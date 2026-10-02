import React from "react";
import { calculateInvoiceTotals } from "@/lib/billing-calculations";

export interface PrintableDocProps {
  data: {
    docNumber: string;
    docType: "JOB_CARD" | "ESTIMATE" | "SOW_BILL";
    date: string;
    vehicleReg: string;
    makeModel: string;
    runningKm: number;
    customerName: string;
    customerPhone: string;
    creatorName?: string;
    workTypeNote?: string;
    paymentMethod: "CASH" | "BANK_TRANSFER" | "UPI";
    items: Array<{
      id: string;
      sectionName?: string;
      title: string;
      description?: string;
      quantity: number;
      qtyUnit?: string;
      rate: number;
      mrpDiscount?: number;
    }>;
    proofImage?: string;
  };
}

const InvoiceMetadata: React.FC<{ data: PrintableDocProps["data"] }> = ({ data }) => (
  <div className="grid grid-cols-3 bg-[#f8fafc] border-y border-slate-200 py-1.5 px-2 mb-2">
    <div>
      <div className="text-[6.5pt] font-semibold text-slate-400 uppercase tracking-wide">
        {data.docType === "SOW_BILL" ? "Customer Name" : "Vehicle Make & Model"}
      </div>
      <div className="text-[7.5pt] font-bold text-slate-900 mt-0.5">
        {data.docType === "SOW_BILL" ? data.customerName : data.makeModel}
      </div>
      <div className="text-[7pt] text-slate-500">
        {data.docType === "SOW_BILL" ? data.customerPhone : ""}
      </div>
    </div>
    <div>
      <div className="text-[6.5pt] font-semibold text-slate-400 uppercase tracking-wide">
        {data.docType === "SOW_BILL" ? "Vehicle Make & Model" : "Registration / Status"}
      </div>
      <div className="text-[7.5pt] font-bold text-slate-900 mt-0.5">
        {data.docType === "SOW_BILL" ? data.makeModel : <span className="text-[#f04923]">{data.vehicleReg}</span>}
      </div>
      <div className="text-[7pt] text-slate-500">
        {data.docType === "SOW_BILL" ? <span className="text-[#f04923]">Reg: On Workshop Record</span> : "Initial Service Estimate"}
      </div>
    </div>
    <div className="text-right">
      <div className="text-[6.5pt] font-semibold text-slate-400 uppercase tracking-wide">
        {data.docType === "SOW_BILL" ? "Invoice ID / Date" : "Estimate ID / Date"}
      </div>
      <div className="text-[7.5pt] font-bold text-slate-900 mt-0.5">
        {data.docNumber}
      </div>
      <div className="text-[7pt] text-slate-500">
        {new Date(data.date).toLocaleDateString("en-GB")}
      </div>
    </div>
  </div>
);

const InvoiceItemsTable: React.FC<{ items: PrintableDocProps["data"]["items"] }> = ({ items }) => {
  let lastSection = "";
  const rows: React.ReactNode[] = [];
  
  items.forEach((item, idx) => {
    if (item.sectionName && item.sectionName !== lastSection) {
      rows.push(
        <tr key={`sec-${item.id}`} className="bg-[#e2e8f0]">
          <td colSpan={5} className="py-1 px-2 text-[7pt] font-bold text-slate-800 uppercase">
            {item.sectionName}
          </td>
        </tr>
      );
      lastSection = item.sectionName;
    }
    
    const disc = item.mrpDiscount || 0;
    const netRate = Math.round(item.rate * (1 - disc / 100) * 100) / 100;
    const lineTotal = Math.round(netRate * item.quantity * 100) / 100;
    
    let rateDisplay = item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 });
    let amountDisplay = `₹ ${lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    
    if (item.rate === 0) {
      rateDisplay = "Complimentary / N/C";
      amountDisplay = "0.00";
    }

    rows.push(
      <tr key={item.id} className="border-b border-slate-200">
        <td className="py-1.5 px-2 text-center text-slate-600 text-[7pt]">
          {idx + 1}
        </td>
        <td className="py-1.5 px-2">
          <div className="font-bold text-slate-900 text-[7.5pt]">{item.title}</div>
          {item.description && (
            <div className="text-slate-500 text-[6.5pt] leading-tight mt-0.5">{item.description}</div>
          )}
        </td>
        <td className="py-1.5 px-2 text-center text-[7.5pt] text-slate-800">
          {item.quantity} {item.qtyUnit !== 'Pcs' ? item.qtyUnit : ''}
        </td>
        <td className="py-1.5 px-2 text-right text-[7.5pt] text-slate-800">
          {rateDisplay}
        </td>
        <td className="py-1.5 px-2 text-right text-[7.5pt] text-slate-800">
          {amountDisplay}
        </td>
      </tr>
    );
  });
  
  return (
    <table className="w-full border-collapse text-left mb-0">
      <thead>
        <tr className="bg-[#0b132b] text-white text-[7pt] uppercase">
          <th className="py-1.5 px-2 text-center w-8">S.No.</th>
          <th className="py-1.5 px-2">Service Item / Spare Part Description</th>
          <th className="py-1.5 px-2 text-center w-12">Qty</th>
          <th className="py-1.5 px-2 text-right w-24">Rate (₹)</th>
          <th className="py-1.5 px-2 text-right w-28">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  );
};

const InvoiceNotice: React.FC<{ data: PrintableDocProps["data"], totals: any }> = ({ data, totals }) => (
  <div className="mt-4 border border-emerald-200 border-l-[4px] border-l-emerald-500 bg-[#f0fdf4] p-2 text-[7pt]">
    <h4 className="font-bold text-emerald-800 uppercase mb-0.5">
      {data.docType === "SOW_BILL" ? "BILLING NOTICE & TECHNICAL REMARK" : "INITIAL ESTIMATE & INSPECTION NOTICE"}
    </h4>
    <p className="text-emerald-900 leading-tight">
      {data.docType === "SOW_BILL" ? (
        <>
          Scope of Work Bill generated for <strong>{data.customerName}'s {data.makeModel}</strong>. Total payable amount: <strong>₹ {totals.finalTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>. {data.workTypeNote || "Routine servicing and mechanical checks completed."} {totals.isMdrApplicable ? "Post-15 Oct 2026 MDR applied for UPI transaction." : "Standard base rate applied."}
        </>
      ) : (
        <>
          Scope of Work Initial Estimate prepared for <strong>{data.makeModel} ({data.vehicleReg})</strong>. Current confirmed items total: <strong>₹ {totals.subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>. {data.workTypeNote || "Front & rear disc brake pads and any ancillary adjustments identified during mechanical teardown will be evaluated along the way and added to the final invoice."} {totals.isMdrApplicable ? "Post-15 Oct 2026 MDR applied for UPI transaction." : "Standard base rate applied."}
        </>
      )}
    </p>
  </div>
);

export const MotoFitPrintableInvoice: React.FC<PrintableDocProps> = ({ data }) => {
  const totals = calculateInvoiceTotals({
    invoiceDate: data.date,
    paymentMethod: data.paymentMethod,
    items: data.items,
  });

  return (
    <div className="motofit-a4-root font-sans text-slate-800 bg-white mx-auto">
      <style dangerouslySetInnerHTML={{ __html: `
        @page { size: A4; margin: 6mm 8mm; }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
        .motofit-a4-root {
          width: 100%;
          max-width: 210mm;
          min-height: 290mm;
          font-size: 7.8pt;
          line-height: 1.2;
          box-sizing: border-box;
          background: #ffffff;
        }
      `}} />

      {/* Primary Header */}
      <div className="bg-[#0b132b] text-white px-5 py-3 border-b-[4px] border-[#f04923]">
        <h1 className="text-2xl font-bold tracking-widest uppercase m-0 leading-tight">
          MOTOFIT <span className="text-[#f04923]">2</span>
        </h1>
        <p className="text-[6.5pt] text-slate-400 tracking-[0.12em] uppercase m-0 mt-1">
          General Maintenance & Precision Servicing | Nigam Nagar HQ, Ahmedabad
        </p>
      </div>

      {/* Title */}
      <div className="flex items-center mt-3 mb-2 px-1">
        <div className="w-[5px] h-[14px] bg-[#f04923] mr-2"></div>
        <h2 className="text-[10pt] font-bold text-[#0b132b] m-0">
          SCOPE OF WORK (SOW) {data.docType === "SOW_BILL" ? "BILL" : "ESTIMATE"}
        </h2>
      </div>

      <InvoiceMetadata data={data} />
      <InvoiceItemsTable items={data.items} />

      {/* Subtotal & Total Block */}
      <div className="flex flex-col bg-[#f8fafc] text-[8pt]">
        <div className="flex justify-end">
          <div className="w-1/2"></div>
          <div className={`w-1/2 px-2 py-1.5 flex justify-between font-bold ${!totals.isMdrApplicable ? 'border-b border-slate-200' : ''}`}>
            <span className="text-slate-800">{data.docType === "SOW_BILL" ? "Subtotal:" : "Estimated Subtotal:"}</span>
            <span>₹ {totals.subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
        {totals.isMdrApplicable && (
          <div className="flex justify-end">
            <div className="w-1/2"></div>
            <div className="w-1/2 px-2 py-1.5 flex justify-between font-bold border-b border-slate-200 text-[#f04923]">
              <span>UPI MDR Surcharge (0.4%):</span>
              <span>₹ {totals.mdrSurcharge.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-end bg-[#0b132b] text-white text-[8.5pt]">
        <div className="w-1/2"></div>
        <div className="w-1/2 px-2 py-1.5 flex justify-between font-bold">
          <span>{data.docType === "SOW_BILL" ? "Total Payable Amount:" : "Total Estimated Base Amount:"}</span>
          <span>₹ {totals.finalTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      <InvoiceNotice data={data} totals={totals} />

      {/* Contacts & Signatory */}
      <div className="mt-3 border border-slate-200 bg-[#f8fafc] flex justify-between p-2">
        <div className="text-[7pt] text-slate-800 leading-tight">
          <div className="font-bold uppercase text-[7.5pt] mb-0.5">WORKSHOP CONTACTS (NIGAM NAGAR HQ, AHMEDABAD)</div>
          <div><strong>Manash:</strong> +91 63596 35416 <span className="text-slate-500">(Client Service Manager)</span> | <strong>Munna:</strong> +91 91232 93450 <span className="text-slate-500">(Senior Mechanic)</span></div>
        </div>
        <div className="text-center w-40 relative flex flex-col items-center justify-end -mt-4">
          <div className="font-['Brush_Script_MT',cursive,'Caveat',serif] text-[15pt] text-slate-900 leading-none pb-1">
            {data.creatorName || "Authorized Mechanic"}
          </div>
          <div className="border-t border-black w-full text-[6.5pt] font-bold text-black pt-0.5 uppercase tracking-wide">
            Authorized Signatory
          </div>
        </div>
      </div>

      {/* Proof of Spares Image */}
      {data.proofImage && (
        <div className="mt-4 border border-slate-200 p-2 break-inside-avoid">
          <div className="font-bold uppercase text-[7.5pt] mb-2 text-slate-800">Proof of Spares / Visual Documentation</div>
          <div className="flex justify-center">
            <img src={data.proofImage} alt="Spares Proof" className="max-w-full max-h-[300px] object-contain rounded border border-slate-100" />
          </div>
        </div>
      )}

      {/* Footer Text */}
      <div className="text-center text-[6pt] text-slate-400 mt-2 pb-2">
        MotoFit 2 | General Maintenance & Precision Servicing | Nigam Nagar HQ, Ahmedabad<br/>
        Thank you for {data.docType === "SOW_BILL" ? "servicing with" : "trusting"} MotoFit 2! Electronically generated {data.docType === "SOW_BILL" ? "document" : "estimate"}.
      </div>
    </div>
  );
};
