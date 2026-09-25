"use client";

import React, { useState, useEffect, useMemo } from "react";
import Papa from "papaparse";
import { Search, Plus, User, FileText, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import "./VehicleIntakeCRM.css";

interface Bike {
  id: string;
  make: string;
  company: string;
  model: string;
  engine_cc: string;
  bs_standard: string;
  year: string;
  price_inr: string;
  category: string;
}

interface Intake {
  id: string;
  customerName: string;
  customerProfile: string;
  pastPurchases: string;
  currentInquiry: string;
  bike: Bike | null;
  status: "New Inquiry" | "In Shop" | "Quoted" | "Ready";
  aiAnalysis?: any;
  loadingAI?: boolean;
}

export default function VehicleIntakeCRM() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerProfile, setCustomerProfile] = useState("Walk-in customer, prefers quick service.");
  const [pastPurchases, setPastPurchases] = useState("");
  const [currentInquiry, setCurrentInquiry] = useState("");

  useEffect(() => {
    Papa.parse("/bikesDatabase.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setBikes(results.data as Bike[]);
      },
    });
  }, []);

  const filteredBikes = useMemo(() => {
    if (!searchQuery) return [];
    return bikes.filter((b) =>
      `${b.make} ${b.model} ${b.year} ${b.category}`.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 8); // top 8 results
  }, [searchQuery, bikes]);

  const handleSelectBike = (bike: Bike) => {
    setSelectedBike(bike);
    setSearchQuery(`${bike.make} ${bike.model} (${bike.year})`);
    setIsDropdownOpen(false);
    setShowModal(true);
  };

  const handleCreateIntake = async (e: React.FormEvent) => {
    e.preventDefault();
    const newIntake: Intake = {
      id: Math.random().toString(36).substr(2, 9),
      customerName,
      customerProfile,
      pastPurchases,
      currentInquiry,
      bike: selectedBike,
      status: "New Inquiry",
      loadingAI: true,
    };

    setIntakes((prev) => [...prev, newIntake]);
    setShowModal(false);
    
    // Reset Form
    setCustomerName("");
    setCurrentInquiry("");
    setSearchQuery("");
    setSelectedBike(null);

    // Call Sales Predict AI
    try {
      const res = await fetch("/api/sales/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerProfile: newIntake.customerProfile,
          pastPurchases: newIntake.pastPurchases,
          currentInquiry: newIntake.currentInquiry,
        }),
      });
      const data = await res.json();
      
      setIntakes((prev) =>
        prev.map((i) =>
          i.id === newIntake.id
            ? { ...i, loadingAI: false, aiAnalysis: data.salesPrediction }
            : i
        )
      );
    } catch (err) {
      console.error(err);
      setIntakes((prev) =>
        prev.map((i) =>
          i.id === newIntake.id ? { ...i, loadingAI: false, aiAnalysis: { error: "Failed to analyze" } } : i
        )
      );
    }
  };

  const updateStatus = (id: string, newStatus: Intake["status"]) => {
    setIntakes((prev) => prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i)));
  };

  const columns: Intake["status"][] = ["New Inquiry", "In Shop", "Quoted", "Ready"];

  return (
    <div className="crm-container">
      <div className="crm-header">
        <h2>Vehicle Intake Pipeline</h2>
        <div className="search-wrapper">
          <div className="search-input-box">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search make, model to create intake..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
            />
          </div>
          {isDropdownOpen && filteredBikes.length > 0 && (
            <div className="search-dropdown">
              {filteredBikes.map((bike) => (
                <div key={bike.id} className="dropdown-item" onClick={() => handleSelectBike(bike)}>
                  <div className="dropdown-bike-title">{bike.make} {bike.model}</div>
                  <div className="dropdown-bike-meta">{bike.year} • {bike.engine_cc}cc • {bike.category}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="kanban-board">
        {columns.map((col) => (
          <div key={col} className="kanban-column">
            <h3 className="column-title">
              {col} <span className="count-badge">{intakes.filter((i) => i.status === col).length}</span>
            </h3>
            <div className="kanban-cards">
              {intakes
                .filter((i) => i.status === col)
                .map((intake) => (
                  <div key={intake.id} className="kanban-card">
                    <div className="card-header">
                      <strong>{intake.customerName}</strong>
                      <span className="bike-tag">{intake.bike?.make} {intake.bike?.model}</span>
                    </div>
                    <p className="card-inquiry">{intake.currentInquiry}</p>
                    
                    {intake.loadingAI ? (
                      <div className="ai-loading">Generating AI Sales Profile...</div>
                    ) : intake.aiAnalysis ? (
                      <div className="ai-insight">
                        <div className="insight-score">
                          <CheckCircle2 size={14} color="#f04923" />
                          <span>Win Rate: {intake.aiAnalysis.salesProbabilityScore || 0}%</span>
                        </div>
                        {intake.aiAnalysis.recommendedUpSells?.[0] && (
                          <div className="upsell-pill">
                            Up-sell: {intake.aiAnalysis.recommendedUpSells[0].productOrServiceName}
                          </div>
                        )}
                      </div>
                    ) : null}

                    <div className="card-actions">
                      {col !== "Ready" && (
                        <button
                          className="move-btn"
                          onClick={() => updateStatus(intake.id, columns[columns.indexOf(col) + 1])}
                        >
                          Next Stage <ChevronRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>New Intake for {selectedBike?.make} {selectedBike?.model}</h3>
            <form onSubmit={handleCreateIntake}>
              <div className="form-group">
                <label><User size={14}/> Customer Name</label>
                <input required value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              </div>
              <div className="form-group">
                <label><AlertCircle size={14}/> Customer Profile (AI Context)</label>
                <input value={customerProfile} onChange={(e) => setCustomerProfile(e.target.value)} />
              </div>
              <div className="form-group">
                <label><FileText size={14}/> Current Inquiry / Need</label>
                <textarea required value={currentInquiry} onChange={(e) => setCurrentInquiry(e.target.value)} rows={3} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Intake</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
