'use client';
import React, { useState } from 'react';
import { Zap, Activity, TrendingUp, ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AISalesAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  const [formData, setFormData] = useState({
    customerProfile: '',
    pastPurchases: '',
    currentInquiry: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/sales/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to predict sales analysis');
      }

      setResult(data.salesPrediction);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050511] text-white overflow-hidden relative font-sans p-8">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#ff00ff]/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          Back to Dashboard
        </Link>

        <header className="mb-10">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Zap className="text-[#ff00ff]" size={40} />
            AI Predictive Sales
          </h1>
          <p className="text-gray-400 mt-2">Powered by AgentRouter AI</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Input Form */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold mb-6">Customer Context</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Customer Profile / Persona</label>
                <textarea 
                  required
                  value={formData.customerProfile}
                  onChange={e => setFormData({ ...formData, customerProfile: e.target.value })}
                  placeholder="e.g. 35 year old male, daily commuter, values reliability..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff00ff]/50 focus:ring-1 focus:ring-[#ff00ff]/50 transition-all h-28"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Past Purchases & Service History</label>
                <textarea 
                  value={formData.pastPurchases}
                  onChange={e => setFormData({ ...formData, pastPurchases: e.target.value })}
                  placeholder="e.g. Bought a KTM Duke in 2021, regular servicing..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff00ff]/50 focus:ring-1 focus:ring-[#ff00ff]/50 transition-all h-28"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Current Inquiry</label>
                <textarea 
                  required
                  value={formData.currentInquiry}
                  onChange={e => setFormData({ ...formData, currentInquiry: e.target.value })}
                  placeholder="e.g. Asking about engine knocking sound..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff00ff]/50 focus:ring-1 focus:ring-[#ff00ff]/50 transition-all h-28"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#ff00ff] to-[#8b5cf6] hover:from-[#ff00ff]/80 hover:to-[#8b5cf6]/80 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#ff00ff]/20 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                {loading ? 'Analyzing...' : 'Generate Prediction'}
              </button>
            </form>
            
            {error && <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-xl text-sm">{error}</div>}
          </div>

          {/* Results Display */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl flex flex-col">
            <h2 className="text-2xl font-semibold mb-6">AI Analysis Engine</h2>
            
            {!result && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 opacity-50">
                <Activity size={64} className="mb-4" />
                <p>Waiting for context input...</p>
              </div>
            )}

            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-[#ff00ff]">
                <Loader2 size={64} className="mb-4 animate-spin" />
                <p className="animate-pulse">Consulting the Neural Net...</p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-6 flex-1 overflow-y-auto pr-2">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/30 border border-white/5 p-4 rounded-2xl">
                    <p className="text-sm text-gray-400 mb-1">Conversion Probability</p>
                    <div className="text-3xl font-bold text-[#10b981] flex items-center gap-2">
                      <TrendingUp size={24} /> {result.salesProbabilityScore}%
                    </div>
                  </div>
                  
                  <div className="bg-black/30 border border-white/5 p-4 rounded-2xl">
                    <p className="text-sm text-gray-400 mb-1">Predicted LTV</p>
                    <div className="text-2xl font-bold text-[#06b6d4]">
                      {result.predictedCustomerLifetimeValue}
                    </div>
                  </div>
                </div>

                <div className="bg-black/30 border border-white/5 p-5 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg text-white">Recommended Up-Sells</h3>
                  </div>
                  <div className="space-y-4">
                    {result.recommendedUpSells?.map((upsell: any, i: number) => (
                      <div key={i} className="border-l-2 border-[#ff00ff] pl-4">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-white">{upsell.productOrServiceName}</span>
                          <span className={`text-xs px-2 py-1 rounded border ${upsell.successProbability === 'HIGH' ? 'bg-[#10b981]/20 border-[#10b981] text-[#10b981]' : upsell.successProbability === 'MEDIUM' ? 'bg-[#ffd600]/20 border-[#ffd600] text-[#ffd600]' : 'bg-[#f04923]/20 border-[#f04923] text-[#f04923]'}`}>
                            {upsell.successProbability} PROBABILITY
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">{upsell.pitchReasoning}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className={`p-4 rounded-2xl border ${result.retentionRiskLevel === 'HIGH' ? 'bg-[#f04923]/10 border-[#f04923]/30' : result.retentionRiskLevel === 'MEDIUM' ? 'bg-[#ffd600]/10 border-[#ffd600]/30' : 'bg-[#10b981]/10 border-[#10b981]/30'}`}>
                    <h3 className="font-semibold text-white flex items-center gap-2 mb-2">
                      <ShieldAlert size={18} className={result.retentionRiskLevel === 'HIGH' ? 'text-[#f04923]' : result.retentionRiskLevel === 'MEDIUM' ? 'text-[#ffd600]' : 'text-[#10b981]'} />
                      Retention Risk: {result.retentionRiskLevel}
                    </h3>
                  </div>
                </div>

                <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                  <h3 className="font-semibold mb-2">Strategy Advisory</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">{result.salesStrategyAdvisory}</p>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
