'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  DollarSign,
  TrendingUp,
  Inbox,
  Search,
  Plus,
  Phone,
  MessageSquare,
  Trash2,
  CheckCircle2,
  X,
  RefreshCw,
  Car,
  FileText,
} from 'lucide-react';

export default function AdminCRMPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalLeads: 0,
    newLeads: 0,
    quotedLeads: 0,
    wonLeads: 0,
    pipelineVal: 0,
    wonVal: 0,
  });
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // New Lead Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    vehicle_info: '',
    requested_part: '',
    estimated_value: '',
    status: 'NEW',
    notes: '',
  });

  const fetchLeads = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    if (searchQuery) params.set('q', searchQuery);

    fetch(`/api/admin/crm?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLeads(data.leads || []);
          setStats(data.stats || {});
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/crm', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setToastMsg(`Lead status updated to ${newStatus}`);
        setTimeout(() => setToastMsg(''), 2500);
        fetchLeads();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      const res = await fetch(`/api/admin/crm?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setToastMsg('Lead deleted successfully');
        setTimeout(() => setToastMsg(''), 2500);
        fetchLeads();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setFormData({
          name: '',
          phone: '',
          email: '',
          vehicle_info: '',
          requested_part: '',
          estimated_value: '',
          status: 'NEW',
          notes: '',
        });
        setToastMsg('New lead created successfully!');
        setTimeout(() => setToastMsg(''), 2500);
        fetchLeads();
      } else {
        alert(data.error || 'Failed to create lead');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'text-white border-[#71717A] bg-[#27272A]';
      case 'CONTACTED':
        return 'text-[#D4D4D8] border-[#52525B] bg-[#18181B]';
      case 'QUOTED':
        return 'text-white border-[#D4D4D8] bg-[#27272A]';
      case 'WON':
        return 'text-black border-white bg-white font-black';
      case 'LOST':
        return 'text-[#71717A] border-[#3F3F46] bg-[#121212]';
      default:
        return 'text-[#A1A1AA] border-[#3F3F46] bg-[#1C1C1E]';
    }
  };

  return (
    <div className="p-6 md:p-10 font-body max-w-7xl mx-auto" style={{ fontFamily: "'Lato', sans-serif" }}>
      {/* Page Title & Add Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight" style={{ fontFamily: "'Raleway', sans-serif" }}>
              CRM Leads Pipeline
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#27272A] text-white border border-[#3F3F46]" style={{ fontFamily: "'Raleway', sans-serif" }}>
              Live Cloud Database
            </span>
          </div>
          <p className="text-[#A1A1AA] text-sm mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>
            Manage inquiries, quotation pipelines, customer WhatsApp engagements, and sales conversion rates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchLeads}
            className="p-2.5 rounded-xl bg-[#1C1C1E] text-[#D4D4D8] hover:text-white hover:bg-[#27272A] transition-colors border border-[#27272A]"
            title="Refresh Leads"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-bold text-sm shadow-lg hover:bg-[#E4E4E7] active:scale-95 transition-all"
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Create New Lead</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#121212] border border-[#27272A] rounded-2xl p-5 border-l-4 border-l-white">
          <div className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]" style={{ fontFamily: "'Raleway', sans-serif" }}>Active Pipeline Value</div>
          <div className="text-2xl font-black text-white mt-1.5" style={{ fontFamily: "'Raleway', sans-serif" }}>
            ₹{Number(stats.pipelineVal || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#71717A] mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>Open quotations & ongoing deals</div>
        </div>

        <div className="bg-[#121212] border border-[#27272A] rounded-2xl p-5 border-l-4 border-l-[#71717A]">
          <div className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]" style={{ fontFamily: "'Raleway', sans-serif" }}>Closed / Won Revenue</div>
          <div className="text-2xl font-black text-white mt-1.5" style={{ fontFamily: "'Raleway', sans-serif" }}>
            ₹{Number(stats.wonVal || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#71717A] mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>{stats.wonLeads || 0} converted customer orders</div>
        </div>

        <div className="bg-[#121212] border border-[#27272A] rounded-2xl p-5 border-l-4 border-l-[#52525B]">
          <div className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]" style={{ fontFamily: "'Raleway', sans-serif" }}>New Inquiries</div>
          <div className="text-2xl font-black text-white mt-1.5" style={{ fontFamily: "'Raleway', sans-serif" }}>{stats.newLeads || 0}</div>
          <div className="text-[11px] text-[#71717A] mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>Pending response / quotation</div>
        </div>

        <div className="bg-[#121212] border border-[#27272A] rounded-2xl p-5 border-l-4 border-l-[#3F3F46]">
          <div className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]" style={{ fontFamily: "'Raleway', sans-serif" }}>Total Leads In CRM</div>
          <div className="text-2xl font-black text-white mt-1.5" style={{ fontFamily: "'Raleway', sans-serif" }}>{stats.totalLeads || 0}</div>
          <div className="text-[11px] text-[#71717A] mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>{stats.quotedLeads || 0} under active quotation</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#121212] border border-[#27272A] rounded-2xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {['', 'NEW', 'CONTACTED', 'QUOTED', 'WON', 'LOST'].map((status) => {
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  isActive
                    ? 'bg-white text-black shadow-md'
                    : 'bg-[#1C1C1E] text-[#D4D4D8] hover:text-white hover:bg-[#27272A] border border-[#27272A]'
                }`}
                style={{ fontFamily: "'Raleway', sans-serif" }}
              >
                {status === '' ? `All (${stats.totalLeads || 0})` : status}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer, vehicle, part..."
              className="bg-[#1C1C1E] border border-[#27272A] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-white w-64"
              style={{ fontFamily: "'Lato', sans-serif" }}
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 bg-[#27272A] hover:bg-[#3F3F46] text-white rounded-xl text-xs font-bold transition-colors border border-[#3F3F46]"
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            Search
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setTimeout(fetchLeads, 50);
              }}
              className="px-2.5 py-2 bg-[#27272A] text-white rounded-xl text-xs font-bold hover:bg-[#3F3F46]"
              title="Clear Search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>

      {/* Leads Table */}
      <div className="bg-[#121212] border border-[#27272A] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse" style={{ fontFamily: "'Lato', sans-serif" }}>
            <thead>
              <tr className="bg-[#0A0A0A] border-b border-[#27272A] text-[11px] font-bold uppercase tracking-wider text-[#A1A1AA]" style={{ fontFamily: "'Raleway', sans-serif" }}>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Vehicle & Requested Component</th>
                <th className="p-4">Est. Value</th>
                <th className="p-4">Pipeline Status</th>
                <th className="p-4">Notes</th>
                <th className="p-4 text-right">Quick Engagement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#A1A1AA]">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-white" />
                    <span>Loading CRM leads from MongoDB Atlas...</span>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#71717A]">
                    <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <span>No leads found matching the filter criteria.</span>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => {
                  const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
                  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Hello ${lead.name}, greetings from Off Road Connection Parts. Regarding your inquiry for ${lead.requested_part} for your ${lead.vehicle_info || 'vehicle'}...`
                  )}`;

                  return (
                    <tr key={lead._id} className="hover:bg-[#1C1C1E] transition-colors">
                      {/* Customer */}
                      <td className="p-4 align-top">
                        <div className="font-bold text-white text-sm" style={{ fontFamily: "'Raleway', sans-serif" }}>{lead.name}</div>
                        <div className="text-xs text-[#D4D4D8] mt-1 font-mono">{lead.phone}</div>
                        {lead.email && <div className="text-xs text-[#A1A1AA]">{lead.email}</div>}
                        <div className="text-[10px] text-[#71717A] mt-1">
                          {new Date(lead.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>

                      {/* Vehicle & Part */}
                      <td className="p-4 align-top">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-white" style={{ fontFamily: "'Raleway', sans-serif" }}>
                          <Car className="w-3.5 h-3.5 text-white" />
                          <span>{lead.vehicle_info || 'Luxury Vehicle'}</span>
                        </div>
                        <div className="font-semibold text-[#D4D4D8] text-sm mt-1">{lead.requested_part}</div>
                        <div className="text-[10px] text-[#71717A] mt-0.5">Source: {lead.source || 'Website Form'}</div>
                      </td>

                      {/* Estimated Value */}
                      <td className="p-4 align-top whitespace-nowrap">
                        <div className="text-base font-black text-white" style={{ fontFamily: "'Raleway', sans-serif" }}>
                          ₹{Number(lead.estimated_value || 0).toLocaleString('en-IN')}
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="p-4 align-top">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                          className={`text-xs font-extrabold px-3 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${getStatusColor(
                            lead.status
                          )}`}
                        >
                          <option value="NEW" className="bg-[#121212] text-white">
                            NEW
                          </option>
                          <option value="CONTACTED" className="bg-[#121212] text-[#D4D4D8]">
                            CONTACTED
                          </option>
                          <option value="QUOTED" className="bg-[#121212] text-white">
                            QUOTED
                          </option>
                          <option value="WON" className="bg-[#121212] text-white">
                            WON
                          </option>
                          <option value="LOST" className="bg-[#121212] text-[#71717A]">
                            LOST
                          </option>
                        </select>
                      </td>

                      {/* Notes */}
                      <td className="p-4 align-top max-w-xs">
                        <p className="text-xs text-[#D4D4D8] line-clamp-3 leading-relaxed">
                          {lead.notes || <span className="text-[#71717A] italic">No notes added.</span>}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="p-4 align-top text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* WhatsApp */}
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-[#27272A] hover:bg-white hover:text-black text-white shadow-sm transition-all border border-[#3F3F46]"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>

                          {/* Call */}
                          <a
                            href={`tel:${lead.phone}`}
                            className="p-2 rounded-xl bg-[#1C1C1E] hover:bg-[#27272A] text-white transition-all border border-[#27272A]"
                            title="Call Customer"
                          >
                            <Phone className="w-4 h-4" />
                          </a>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteLead(lead._id)}
                            className="p-2 rounded-xl bg-[#1C1C1E] hover:bg-[#27272A] text-[#A1A1AA] hover:text-white transition-all border border-[#27272A]"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn" style={{ fontFamily: "'Lato', sans-serif" }}>
          <div className="bg-[#121212] border border-[#27272A] rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#27272A] pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-white" />
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Raleway', sans-serif" }}>Create New CRM Lead</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-[#71717A] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#A1A1AA] mb-1" style={{ fontFamily: "'Raleway', sans-serif" }}>Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full bg-[#1C1C1E] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#A1A1AA] mb-1" style={{ fontFamily: "'Raleway', sans-serif" }}>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#1C1C1E] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A1A1AA] mb-1" style={{ fontFamily: "'Raleway', sans-serif" }}>Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="customer@domain.com"
                    className="w-full bg-[#1C1C1E] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1AA] mb-1" style={{ fontFamily: "'Raleway', sans-serif" }}>Vehicle Make, Model & Year</label>
                <input
                  type="text"
                  value={formData.vehicle_info}
                  onChange={(e) => setFormData({ ...formData, vehicle_info: e.target.value })}
                  placeholder="e.g. 2021 BMW 530d M Sport / 2022 Porsche Cayenne"
                  className="w-full bg-[#1C1C1E] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1AA] mb-1" style={{ fontFamily: "'Raleway', sans-serif" }}>Requested Component / Part *</label>
                <input
                  type="text"
                  required
                  value={formData.requested_part}
                  onChange={(e) => setFormData({ ...formData, requested_part: e.target.value })}
                  placeholder="e.g. Front Air Suspension Strut (Left) with EDC"
                  className="w-full bg-[#1C1C1E] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#A1A1AA] mb-1" style={{ fontFamily: "'Raleway', sans-serif" }}>Estimated Value (₹)</label>
                  <input
                    type="number"
                    value={formData.estimated_value}
                    onChange={(e) => setFormData({ ...formData, estimated_value: e.target.value })}
                    placeholder="e.g. 65000"
                    className="w-full bg-[#1C1C1E] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A1A1AA] mb-1" style={{ fontFamily: "'Raleway', sans-serif" }}>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#1C1C1E] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white"
                  >
                    <option value="NEW">NEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="QUOTED">QUOTED</option>
                    <option value="WON">WON</option>
                    <option value="LOST">LOST</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1AA] mb-1" style={{ fontFamily: "'Raleway', sans-serif" }}>Conversation Notes / VIN</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Enter chassis number, customer requirements, or quotation details..."
                  className="w-full bg-[#1C1C1E] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-white resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#27272A]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#A1A1AA] hover:text-white bg-[#1C1C1E] border border-[#27272A]"
                  style={{ fontFamily: "'Raleway', sans-serif" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-black bg-white hover:bg-[#E4E4E7] shadow-lg"
                  style={{ fontFamily: "'Raleway', sans-serif" }}
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-white text-black font-bold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-slideUp" style={{ fontFamily: "'Raleway', sans-serif" }}>
          <CheckCircle2 className="w-5 h-5 text-black" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}

