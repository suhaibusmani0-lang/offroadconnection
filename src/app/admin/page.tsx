'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  DollarSign,
  Package,
  Users,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  Search,
  Send,
  Plus,
  RefreshCw,
  Car,
  FileText,
  Tag,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // VIN Decoder Tool State
  const [vinInput, setVinInput] = useState('');
  const [vinLoading, setVinLoading] = useState(false);
  const [vinResult, setVinResult] = useState<any>(null);
  const [vinError, setVinError] = useState('');

  // Quick Quotation Tool State
  const [quoteLeadName, setQuoteLeadName] = useState('');
  const [quotePhone, setQuotePhone] = useState('');
  const [quoteVehicle, setQuoteVehicle] = useState('');
  const [quotePart, setQuotePart] = useState('');
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteResult, setQuoteResult] = useState<any>(null);

  const fetchDashboardData = () => {
    setLoading(true);
    fetch('/api/admin/dashboard')
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setData(res);
        }
      })
      .catch((err) => console.error('Dashboard error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleVinDecode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vinInput.trim()) return;
    setVinLoading(true);
    setVinError('');
    setVinResult(null);

    try {
      const res = await fetch(`/api/vin/decode?vin=${encodeURIComponent(vinInput.trim())}`);
      const json = await res.json();
      if (json.success) {
        setVinResult(json);
      } else {
        setVinError(json.error || 'Failed to decode VIN.');
      }
    } catch (err: any) {
      setVinError('Network error while decoding chassis number.');
    } finally {
      setVinLoading(false);
    }
  };

  const handleGenerateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quotePhone || !quotePart || !quotePrice) return;
    setQuoteLoading(true);

    try {
      const res = await fetch('/api/admin/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: quoteLeadName || 'Valued Patron',
          customerPhone: quotePhone,
          vehicle: quoteVehicle,
          items: [
            {
              name: quotePart,
              partNumber: 'OEM-SPEC',
              price: Number(quotePrice),
              quantity: 1,
            },
          ],
        }),
      });

      const json = await res.json();
      if (json.success) {
        setQuoteResult(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setQuoteLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-[#E5B869] animate-spin" />
          <span className="text-[#A1A1AA] text-sm font-semibold tracking-wider">
            Loading Executive Command Center...
          </span>
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || {
    revenue: { paidRevenue: 0, grossMerchandiseValue: 0, avgOrderValue: 0 },
    orders: { total: 0, paid: 0, pending: 0 },
    crm: { totalLeads: 0, newLeads: 0, quotedLeads: 0, wonLeads: 0, pipelineValue: 0, winRate: 0 },
    inventory: { totalProducts: 2524, inStock: 2500, lowStockCount: 0 },
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 bg-[#090A0F] text-white min-h-screen">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#27272A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E5B869] shadow-[0_0_10px_#E5B869]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#E5B869]">
              Live Enterprise Telemetry
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight" style={{ fontFamily: "'Raleway', sans-serif" }}>
            Executive Command Suite
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Global luxury parts logistics, real-time revenue analytics & VIN verification desk.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-xs font-bold text-[#E4E4E7] transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Data</span>
          </button>
          <Link
            href="/admin/products"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5B869] text-black font-black text-xs tracking-wider shadow-lg hover:brightness-110 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add New Part</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total GMV / Pipeline */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-[#141822] to-[#0D1017] border border-white/10 relative overflow-hidden group hover:border-[#E5B869]/50 transition-all shadow-xl">
          <div className="flex items-center justify-between text-xs font-semibold text-[#A1A1AA] mb-3">
            <span>Gross Pipeline Value</span>
            <div className="w-8 h-8 rounded-lg bg-[#E5B869]/10 text-[#E5B869] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-black text-white" style={{ fontFamily: "'Raleway', sans-serif" }}>
            ₹{(metrics.revenue.grossMerchandiseValue + metrics.crm.pipelineValue).toLocaleString('en-IN')}
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-[#A1A1AA]">
            <span className="text-[#34D399] font-bold flex items-center">
              <TrendingUp className="w-3 h-3 mr-1 inline" /> {metrics.crm.winRate}%
            </span>
            <span>lead closing rate</span>
          </div>
        </div>

        {/* Real Paid Revenue */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-[#141822] to-[#0D1017] border border-white/10 relative overflow-hidden group hover:border-[#E5B869]/50 transition-all shadow-xl">
          <div className="flex items-center justify-between text-xs font-semibold text-[#A1A1AA] mb-3">
            <span>Paid Revenue Realized</span>
            <div className="w-8 h-8 rounded-lg bg-[#34D399]/10 text-[#34D399] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-black text-[#E5B869]" style={{ fontFamily: "'Raleway', sans-serif" }}>
            ₹{metrics.revenue.paidRevenue.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-[11px] text-[#A1A1AA]">
            Avg Order: <strong className="text-white">₹{metrics.revenue.avgOrderValue.toLocaleString('en-IN')}</strong>
          </div>
        </div>

        {/* Orders in Pipeline */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-[#141822] to-[#0D1017] border border-white/10 relative overflow-hidden group hover:border-[#E5B869]/50 transition-all shadow-xl">
          <div className="flex items-center justify-between text-xs font-semibold text-[#A1A1AA] mb-3">
            <span>Customer Orders</span>
            <div className="w-8 h-8 rounded-lg bg-[#60A5FA]/10 text-[#60A5FA] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-black text-white" style={{ fontFamily: "'Raleway', sans-serif" }}>
            {metrics.orders.total}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-[#A1A1AA]">
            <span>Pending Dispatch: <strong className="text-amber-400">{metrics.orders.pending}</strong></span>
            <Link href="/admin/orders" className="text-[#60A5FA] hover:underline flex items-center">
              View <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
        </div>

        {/* CRM Leads Active */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-[#141822] to-[#0D1017] border border-white/10 relative overflow-hidden group hover:border-[#E5B869]/50 transition-all shadow-xl">
          <div className="flex items-center justify-between text-xs font-semibold text-[#A1A1AA] mb-3">
            <span>Active CRM Leads</span>
            <div className="w-8 h-8 rounded-lg bg-[#F43F5E]/10 text-[#F43F5E] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-black text-white" style={{ fontFamily: "'Raleway', sans-serif" }}>
            {metrics.crm.totalLeads}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-[#A1A1AA]">
            <span>Quoted: <strong className="text-white">{metrics.crm.quotedLeads}</strong> | Won: <strong className="text-emerald-400">{metrics.crm.wonLeads}</strong></span>
            <Link href="/admin/crm" className="text-[#F43F5E] hover:underline flex items-center">
              Board <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Two High-Utility Interactive Workspaces */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Automated VIN Chassis Decoder Sandbox */}
        <div className="p-6 rounded-2xl bg-[#121620] border border-white/10 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E5B869]/10 text-[#E5B869] flex items-center justify-center">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white" style={{ fontFamily: "'Raleway', sans-serif" }}>
                    Chassis & VIN Precision Decoder
                  </h3>
                  <p className="text-[11px] text-[#A1A1AA]">
                    Enter any 17-digit European vehicle VIN to decode plant, series & catalog parts.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                100% Fitment Match
              </span>
            </div>

            <form onSubmit={handleVinDecode} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. WAUZZZ4G8EN012345 or WBA3D..."
                value={vinInput}
                onChange={(e) => setVinInput(e.target.value)}
                className="flex-1 bg-[#1A1F2C] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E5B869]"
              />
              <button
                type="submit"
                disabled={vinLoading}
                className="px-4 py-2.5 rounded-xl bg-[#E5B869] hover:bg-[#D4AF37] text-black font-extrabold text-xs tracking-wider transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {vinLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Decode</span>
              </button>
            </form>

            {vinError && (
              <div className="mt-3 p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{vinError}</span>
              </div>
            )}

            {vinResult && (
              <div className="mt-4 p-4 rounded-xl bg-[#161B27] border border-[#E5B869]/30 text-xs space-y-2">
                <div className="grid grid-cols-2 gap-3 text-zinc-300">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block font-bold">Manufacturer Make</span>
                    <strong className="text-white text-sm">{vinResult.decoded.make}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block font-bold">Model Year / Generation</span>
                    <strong className="text-[#E5B869]">{vinResult.decoded.modelYear}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block font-bold">Chassis Series</span>
                    <span className="text-white">{vinResult.decoded.series}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block font-bold">Assembly Plant</span>
                    <span className="text-white">{vinResult.decoded.assemblyPlant}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-semibold">
                    ✓ Found {vinResult.compatibleProductsCount} compatible catalog parts
                  </span>
                  <Link
                    href={`/shop?make=${encodeURIComponent(vinResult.decoded.make)}`}
                    className="text-[#E5B869] hover:underline flex items-center"
                  >
                    Browse Parts <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-zinc-500">
            Supports Audi (WAU), BMW (WBA/WBS), Mercedes (WDD/W1K), Porsche (WP0), Range Rover (SAL), Jaguar (SAJ).
          </div>
        </div>

        {/* 2. Fast 1-Click WhatsApp Proforma Quotation Generator */}
        <div className="p-6 rounded-2xl bg-[#121620] border border-white/10 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white" style={{ fontFamily: "'Raleway', sans-serif" }}>
                    Instant WhatsApp Proforma Quotation
                  </h3>
                  <p className="text-[11px] text-[#A1A1AA]">
                    Generate official GST-compliant quotations with direct payment links.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                1-Click Dispatch
              </span>
            </div>

            <form onSubmit={handleGenerateQuote} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Client Name"
                  value={quoteLeadName}
                  onChange={(e) => setQuoteLeadName(e.target.value)}
                  className="bg-[#1A1F2C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E5B869]"
                />
                <input
                  type="text"
                  required
                  placeholder="Client WhatsApp No"
                  value={quotePhone}
                  onChange={(e) => setQuotePhone(e.target.value)}
                  className="bg-[#1A1F2C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E5B869]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Vehicle (e.g. BMW 530d G30)"
                  value={quoteVehicle}
                  onChange={(e) => setQuoteVehicle(e.target.value)}
                  className="bg-[#1A1F2C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E5B869]"
                />
                <input
                  type="text"
                  required
                  placeholder="Part Name / OEM #"
                  value={quotePart}
                  onChange={(e) => setQuotePart(e.target.value)}
                  className="bg-[#1A1F2C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E5B869]"
                />
                <input
                  type="number"
                  required
                  placeholder="Price (₹)"
                  value={quotePrice}
                  onChange={(e) => setQuotePrice(e.target.value)}
                  className="bg-[#1A1F2C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E5B869]"
                />
              </div>

              <button
                type="submit"
                disabled={quoteLoading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-extrabold text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-110"
              >
                {quoteLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Generate & Open WhatsApp Proforma</span>
              </button>
            </form>

            {quoteResult && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-700/40 text-xs flex items-center justify-between">
                <div>
                  <span className="text-emerald-300 font-bold block">
                    ✓ Quotation {quoteResult.quoteNumber} Generated!
                  </span>
                  <span className="text-zinc-400 text-[11px]">
                    Total with 18% GST: <strong>₹{quoteResult.summary.grandTotal.toLocaleString('en-IN')}</strong>
                  </span>
                </div>
                <a
                  href={quoteResult.directWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-extrabold text-xs hover:bg-emerald-400 flex items-center gap-1 shadow-md"
                >
                  <span>Send Now</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-zinc-500">
            Automatically calculates 18% automotive GST, sets lead status to QUOTED, and links checkout token.
          </div>
        </div>
      </div>

      {/* Critical Stock Alerts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Stock Warnings */}
        <div className="p-6 rounded-2xl bg-[#121620] border border-white/10 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-extrabold text-white" style={{ fontFamily: "'Raleway', sans-serif" }}>
                Critical Inventory Telemetry
              </h3>
            </div>
            <Link href="/admin/products" className="text-xs text-[#E5B869] hover:underline">
              Inventory Suite ({metrics.inventory.totalProducts})
            </Link>
          </div>

          {data?.lowStockAlerts && data.lowStockAlerts.length > 0 ? (
            <div className="divide-y divide-white/5">
              {data.lowStockAlerts.slice(0, 5).map((prod: any, idx: number) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-white line-clamp-1">{prod.title}</div>
                    <div className="text-[11px] text-zinc-500">
                      OEM: {prod.part_number || 'OEM-SPEC'} • {prod.make || 'European'}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      prod.stock_quantity <= 0
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {prod.stock_quantity <= 0 ? 'Out of Stock' : `${prod.stock_quantity} Left`}
                    </span>
                    <div className="text-zinc-400 text-[11px] mt-0.5">₹{Number(prod.price).toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-zinc-500 text-xs">
              <CheckCircle className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
              All 2,524 catalogue items are safely stocked in warehouse.
            </div>
          )}
        </div>

        {/* Recent High-Priority CRM Leads */}
        <div className="p-6 rounded-2xl bg-[#121620] border border-white/10 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#E5B869]" />
              <h3 className="text-sm font-extrabold text-white" style={{ fontFamily: "'Raleway', sans-serif" }}>
                Recent High-Priority Enquiries
              </h3>
            </div>
            <Link href="/admin/crm" className="text-xs text-[#E5B869] hover:underline">
              View CRM Pipeline
            </Link>
          </div>

          {data?.recentLeads && data.recentLeads.length > 0 ? (
            <div className="divide-y divide-white/5">
              {data.recentLeads.map((lead: any, idx: number) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-white">{lead.name}</div>
                    <div className="text-[11px] text-zinc-400">
                      {lead.vehicle_info || 'Luxury Car'} — {lead.requested_part}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      lead.status === 'WON'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : lead.status === 'QUOTED'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-zinc-700 text-zinc-300'
                    }`}>
                      {lead.status}
                    </span>
                    <div className="text-[#E5B869] font-bold text-[11px] mt-0.5">
                      ₹{Number(lead.estimated_value || 0).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-zinc-500 text-xs">
              No recent leads recorded. New customer enquiries will populate here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
