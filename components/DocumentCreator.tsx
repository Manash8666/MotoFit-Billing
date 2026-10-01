"use client";
import { apiClient } from '@/lib/api-client';

import React, { useState } from "react";
import { MotoFitPrintableInvoice, PrintableDocProps } from "@/components/MotoFitPrintableInvoice";
import { Plus, Trash2, Eye, Edit2, Download, Share2 } from "lucide-react";

type LineItem = PrintableDocProps["data"]["items"][0];

interface DocumentCreatorProps {
  docType: "SOW_BILL" | "ESTIMATE";
}

export default function DocumentCreator({ docType }: DocumentCreatorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    docNumber: "AUTO",
    date: new Date().toISOString().split("T")[0],
    customerName: "",
    customerPhone: "",
    vehicleReg: "",
    makeModel: "",
    runningKm: 0,
    workTypeNote: "",
    paymentMethod: "CASH" as "CASH" | "BANK_TRANSFER" | "UPI",
  });

  const [items, setItems] = useState<LineItem[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [parts, setParts] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activePartDropdown, setActivePartDropdown] = useState<string | null>(null);

  React.useEffect(() => {
    apiClient.fetch('/api/v1/customers')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCustomers(data);
      })
      .catch(console.error);
      
    apiClient.fetch('/api/v1/parts')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setParts(data);
      })
      .catch(console.error);

    // Duplicate logic
    const params = new URLSearchParams(window.location.search);
    const duplicateId = params.get('duplicate');
    if (duplicateId) {
      apiClient.fetch(`/api/v1/documents/${duplicateId}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setFormData(prev => ({
              ...prev,
              customerName: data.vehicle?.customer?.name || "",
              customerPhone: data.vehicle?.customer?.phone || "",
              vehicleReg: data.vehicle?.regNumber || "",
              makeModel: data.vehicle?.makeModel || "",
              workTypeNote: data.workTypeNote || "",
              paymentMethod: data.paymentMethod || "CASH"
            }));
            if (data.items && Array.isArray(data.items)) {
              setItems(data.items.map((i: any) => ({
                id: Date.now().toString() + Math.random().toString(),
                sectionName: i.sectionName || "",
                title: i.title || "",
                description: i.description || "",
                quantity: i.quantity || 1,
                qtyUnit: i.qtyUnit || "Pcs",
                rate: i.rate || 0,
                mrpDiscount: i.mrpDiscount || 0
              })));
            }
          }
        })
        .catch(console.error);
    }
  }, []);

  const handleAddRow = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        sectionName: items.length > 0 ? items[items.length - 1].sectionName : "",
        title: "",
        description: "",
        quantity: 1,
        qtyUnit: "Pcs",
        rate: 0,
        mrpDiscount: 0,
      }
    ]);
  };

  const handleRemoveRow = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof LineItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const getInvoiceData = (): PrintableDocProps["data"] => {
    return {
      docType,
      docNumber: formData.docNumber || "AUTO",
      date: formData.date || new Date().toISOString().split("T")[0],
      customerName: formData.customerName || "Walk-in Customer",
      customerPhone: formData.customerPhone || "9999999999",
      vehicleReg: formData.vehicleReg || "UNKNOWN",
      makeModel: formData.makeModel || "Unknown",
      runningKm: Number(formData.runningKm) || 0,
      workTypeNote: formData.workTypeNote,
      paymentMethod: formData.paymentMethod,
      items: items.map(item => ({
        ...item,
        quantity: Number(item.quantity) || 1,
        rate: Number(item.rate) || 0
      }))
    };
  };

  const [isExporting, setIsExporting] = useState(false);

  const generatePDF = async () => {
    const { default: html2canvas } = await import('html2canvas');
    const { jsPDF } = await import('jspdf');

    const element = document.getElementById('printable-invoice');
    if (!element) return null;
    
    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    return pdf;
  };

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    try {
      const pdf = await generatePDF();
      if (pdf) {
        pdf.save(`${formData.docNumber || 'MotoFit-Doc'}.pdf`);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to generate PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareWhatsApp = async () => {
    setIsExporting(true);
    try {
      const pdf = await generatePDF();
      if (!pdf) return;
      
      const blob = pdf.output('blob');
      const file = new File([blob], `${formData.docNumber || 'MotoFit-Doc'}.pdf`, { type: 'application/pdf' });
      
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `MotoFit Document ${formData.docNumber}`,
          text: `Here is your MotoFit document: ${formData.docNumber}`,
          files: [file]
        });
      } else {
        // Fallback if file sharing not supported
        const text = encodeURIComponent(`Hello ${formData.customerName}, your MotoFit document ${formData.docNumber} is ready.`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
      }
    } catch (error) {
      console.error(error);
      alert("Failed to share via WhatsApp. You can download the PDF and share manually.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      const response = await apiClient.fetch('/api/v1/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getInvoiceData())
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to save document');
      }
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving document:", error);
      alert("Failed to save to database: " + (error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isPreview) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-full flex flex-col sm:flex-row justify-between gap-4 mb-6 no-print">
          <button 
            onClick={() => setIsPreview(false)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition w-full sm:w-auto"
          >
            <Edit2 size={16} /> Edit Details
          </button>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center justify-center gap-2 px-4 py-2 text-white rounded transition ${saveSuccess ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-500'} ${isSaving ? 'opacity-50 cursor-not-allowed' : ''} w-full sm:w-auto`}
            >
              {saveSuccess ? "Saved!" : isSaving ? "Saving..." : "Save to DB"}
            </button>
            <button 
              onClick={handleShareWhatsApp}
              disabled={isExporting}
              className={`flex items-center justify-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded hover:bg-[#20b858] transition shadow-lg shadow-green-500/30 w-full sm:w-auto ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Share2 size={16} /> {isExporting ? "Generating..." : "WhatsApp"}
            </button>
            <button 
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className={`flex items-center justify-center gap-2 px-4 py-2 bg-[#f04923] text-white rounded hover:bg-red-600 transition shadow-lg shadow-red-500/30 w-full sm:w-auto ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Download size={16} /> {isExporting ? "Generating..." : "Save PDF"}
            </button>
          </div>
        </div>
        <div className="shadow-2xl overflow-x-auto print:shadow-none print:w-full print:overflow-visible w-full">
          <div id="printable-invoice" className="min-w-[800px] print:min-w-0 mx-auto bg-white">
            <MotoFitPrintableInvoice data={getInvoiceData()} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-sm">
      {/* Meta Data Form */}
      <div className="bg-[#1a233a] p-6 rounded-xl border border-gray-800">
        <h3 className="text-xl font-bold mb-4 text-[#f04923]">Document Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 mb-1">Doc Number (Type 'AUTO' for sync)</label>
            <input 
              type="text" 
              placeholder="AUTO"
              className="w-full bg-[#0b132b] border border-gray-700 rounded p-2 text-white placeholder-gray-500" 
              value={formData.docNumber} 
              onChange={e => setFormData({...formData, docNumber: e.target.value.toUpperCase()})}
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Date</label>
            <input 
              type="date" 
              className="w-full bg-[#0b132b] border border-gray-700 rounded p-2 text-white" 
              value={formData.date} 
              onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Customer Name</label>
            <input 
              type="text" 
              className="w-full bg-[#0b132b] border border-gray-700 rounded p-2 text-white" 
              placeholder="e.g. Dharamveer Sir"
              value={formData.customerName} 
              onChange={e => setFormData({...formData, customerName: e.target.value})}
            />
          </div>
          <div className="relative">
            <label className="block text-gray-400 mb-1">Customer Phone</label>
            <input 
              type="text" 
              className="w-full bg-[#0b132b] border border-gray-700 rounded p-2 text-white" 
              placeholder="+91 98765 43210"
              value={formData.customerPhone} 
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              onChange={e => {
                setFormData({...formData, customerPhone: e.target.value});
                setShowDropdown(true);
              }}
            />
            {showDropdown && customers.length > 0 && formData.customerPhone.length > 2 && (
              <div className="absolute z-50 w-full mt-1 bg-[#1a233a] border border-gray-700 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                {customers
                  .filter(c => c.phone.includes(formData.customerPhone) || c.name.toLowerCase().includes(formData.customerPhone.toLowerCase()))
                  .map(c => (
                  <div 
                    key={c.id} 
                    className="p-3 hover:bg-white/10 cursor-pointer border-b border-gray-800 last:border-0"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        customerPhone: c.phone,
                        customerName: c.name,
                        makeModel: c.vehicles?.[0]?.makeModel || "",
                        vehicleReg: c.vehicles?.[0]?.regNumber || ""
                      });
                      setShowDropdown(false);
                    }}
                  >
                    <p className="text-white font-medium text-sm">{c.name} <span className="text-gray-400 text-xs ml-1">{c.phone}</span></p>
                    {c.vehicles?.[0] && <p className="text-xs text-[#06b6d4] mt-1">{c.vehicles[0].makeModel} ({c.vehicles[0].regNumber})</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Vehicle Make & Model</label>
            <input 
              type="text" 
              className="w-full bg-[#0b132b] border border-gray-700 rounded p-2 text-white" 
              placeholder="e.g. Hero Passion Pro APDV"
              value={formData.makeModel} 
              onChange={e => setFormData({...formData, makeModel: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Registration Number</label>
            <input 
              type="text" 
              className="w-full bg-[#0b132b] border border-gray-700 rounded p-2 text-white" 
              placeholder="e.g. GJ 01 VP 8363"
              value={formData.vehicleReg} 
              onChange={e => {
                // Auto format: gj01vp8363 -> GJ 01 VP 8363 (rough approximation for Indian plates)
                let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                if (val.length > 2) val = val.slice(0, 2) + ' ' + val.slice(2);
                if (val.length > 5) val = val.slice(0, 5) + ' ' + val.slice(5);
                if (val.length > 8) val = val.slice(0, 8) + ' ' + val.slice(8, 12);
                setFormData({...formData, vehicleReg: val});
              }}
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Odometer (KM)</label>
            <input 
              type="number" inputMode="decimal" pattern="[0-9]*" 
              className="w-full bg-[#0b132b] border border-gray-700 rounded p-2 text-white" 
              placeholder="e.g. 12500"
              value={formData.runningKm} 
              onChange={e => setFormData({...formData, runningKm: Number(e.target.value)})}
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-gray-400 mb-1">Payment Method</label>
            <select
              className="w-full bg-[#0b132b] border border-gray-700 rounded p-2 text-white"
              value={formData.paymentMethod}
              onChange={e => setFormData({...formData, paymentMethod: e.target.value as any})}
            >
              <option value="CASH">Cash</option>
              <option value="UPI">UPI</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-400 mb-1">Bottom Billing Notice / Remark</label>
            <input 
              type="text" 
              className="w-full bg-[#0b132b] border border-gray-700 rounded p-2 text-white" 
              placeholder="e.g. Chain tensioned & lubricated today..."
              value={formData.workTypeNote} 
              onChange={e => setFormData({...formData, workTypeNote: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Line Items Form */}
      <div className="bg-[#1a233a] p-6 rounded-xl border border-gray-800">
        <h3 className="text-xl font-bold mb-4 text-[#f04923]">Line Items</h3>
        
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={item.id} className="p-4 border border-gray-700 bg-[#0b132b] rounded flex flex-col gap-3 relative">
              <button 
                onClick={() => handleRemoveRow(item.id)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Section Heading (Optional)</label>
                  <input 
                    type="text" 
                    className="w-full bg-[#1a233a] border border-gray-700 rounded p-1.5 text-white" 
                    placeholder="e.g. ROUTINE MAINTENANCE"
                    value={item.sectionName || ""} 
                    onChange={e => handleItemChange(item.id, "sectionName", e.target.value)}
                  />
                </div>
                <div className="relative">
                  <label className="block text-xs text-gray-500 mb-1">Item Title</label>
                  <input 
                    type="text" 
                    className="w-full bg-[#1a233a] border border-gray-700 rounded p-1.5 text-white" 
                    placeholder="e.g. Engine Oil Motul"
                    value={item.title} 
                    onFocus={() => setActivePartDropdown(item.id)}
                    onBlur={() => setTimeout(() => setActivePartDropdown(null), 200)}
                    onChange={e => {
                      handleItemChange(item.id, "title", e.target.value);
                      setActivePartDropdown(item.id);
                    }}
                  />
                  {activePartDropdown === item.id && parts.length > 0 && item.title.length > 1 && (
                    <div className="absolute z-50 w-full mt-1 bg-[#0b132b] border border-gray-700 rounded-lg shadow-2xl max-h-48 overflow-y-auto">
                      {parts
                        .filter(p => p.name.toLowerCase().includes(item.title.toLowerCase()) || (p.category && p.category.toLowerCase().includes(item.title.toLowerCase())))
                        .map(p => (
                        <div 
                          key={p.id} 
                          className="p-3 hover:bg-white/10 cursor-pointer border-b border-gray-800 last:border-0"
                          onClick={() => {
                            setItems(items.map(i => i.id === item.id ? { 
                              ...i, 
                              title: p.name,
                              sectionName: p.category || i.sectionName,
                              rate: Number(p.price) || 0
                            } : i));
                            setActivePartDropdown(null);
                          }}
                        >
                          <p className="text-white font-medium text-sm">{p.name}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-[#06b6d4]">{p.category || 'General'}</span>
                            <span className="text-xs text-green-400 font-mono">₹{p.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">Description (Optional)</label>
                  <input 
                    type="text" 
                    className="w-full bg-[#1a233a] border border-gray-700 rounded p-1.5 text-white" 
                    placeholder="e.g. Motul semi-synthetic 4T..."
                    value={item.description || ""} 
                    onChange={e => handleItemChange(item.id, "description", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pr-8 mt-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Qty</label>
                  <input 
                    type="number" inputMode="decimal" pattern="[0-9]*" 
                    className="w-full bg-[#1a233a] border border-gray-700 rounded p-1.5 text-white" 
                    value={item.quantity} 
                    onChange={e => handleItemChange(item.id, "quantity", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Unit</label>
                  <input 
                    type="text" 
                    className="w-full bg-[#1a233a] border border-gray-700 rounded p-1.5 text-white" 
                    value={item.qtyUnit || ""} 
                    onChange={e => handleItemChange(item.id, "qtyUnit", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Rate (₹)</label>
                  <input 
                    type="number" inputMode="decimal" pattern="[0-9]*" 
                    className="w-full bg-[#1a233a] border border-gray-700 rounded p-1.5 text-white" 
                    value={item.rate} 
                    onChange={e => handleItemChange(item.id, "rate", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Total (₹)</label>
                  <div className="w-full bg-gray-800 border border-gray-700 rounded p-1.5 text-white font-mono flex items-center h-[34px]">
                    {Number(item.quantity) * Number(item.rate)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={handleAddRow}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition text-sm"
        >
          <Plus size={16} /> Add Line Item
        </button>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={() => setIsPreview(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#f04923] text-white rounded-lg hover:bg-red-600 transition shadow-lg shadow-red-500/30 text-lg font-bold"
        >
          <Eye size={20} /> Preview Document
        </button>
      </div>
    </div>
  );
}
