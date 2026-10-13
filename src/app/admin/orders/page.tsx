'use client';

import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Truck,
  CheckCircle,
  Clock,
  RefreshCw,
  Phone,
  MapPin,
  ExternalLink,
  ChevronDown,
  X,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ totalOrders: 0, pendingCount: 0, dispatchedCount: 0, deliveredCount: 0 });
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  const fetchOrders = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    if (searchQuery) params.set('q', searchQuery);

    fetch(`/api/admin/orders?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.orders || []);
          setStats(data.stats || {});
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, delivery_status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setToastMsg(`Order marked as ${newStatus}`);
        setTimeout(() => setToastMsg(''), 2500);
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'placed':
        return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
      case 'confirmed':
        return 'text-sky-400 bg-sky-400/10 border-sky-400/30';
      case 'dispatched':
        return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/30';
      case 'delivered':
        return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
      case 'cancelled':
        return 'text-rose-400 bg-rose-400/10 border-rose-400/30';
      default:
        return 'text-slate-400 bg-slate-400/10 border-slate-400/30';
    }
  };

  return (
    <div className="p-6 md:p-10 font-sans max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Customer Orders & Dispatch</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30">
              {stats.totalOrders || 0} Total
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track incoming purchases, verify vehicle fitment, assign express air courier tracking numbers, and update delivery status.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors self-start md:self-auto"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 border-l-4 border-l-amber-500">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Orders Placed / Pending</div>
          <div className="text-2xl font-black text-amber-400 mt-1.5">{stats.pendingCount || 0}</div>
          <div className="text-[11px] text-slate-500 mt-1">Awaiting dispatch verification</div>
        </div>

        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 border-l-4 border-l-indigo-500">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">In Transit / Dispatched</div>
          <div className="text-2xl font-black text-indigo-400 mt-1.5">{stats.dispatchedCount || 0}</div>
          <div className="text-[11px] text-slate-500 mt-1">Shipped via BlueDart / Delhivery Air</div>
        </div>

        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 border-l-4 border-l-emerald-500">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Delivered Orders</div>
          <div className="text-2xl font-black text-emerald-400 mt-1.5">{stats.deliveredCount || 0}</div>
          <div className="text-[11px] text-slate-500 mt-1">Successfully fulfilled</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {['', 'placed', 'confirmed', 'dispatched', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                statusFilter === status
                  ? 'bg-[#C5A059] text-slate-950 shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white'
              }`}
            >
              {status === '' ? 'All Orders' : status}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchOrders();
          }}
          className="flex gap-2"
        >
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order ID, customer, city..."
              className="bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#C5A059] w-64"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700"
          >
            Search
          </button>
        </form>
      </div>

      {/* Orders Table */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="p-4">Order ID & Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Shipping Destination</th>
                <th className="p-4">Items / Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Delivery Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#C5A059]" />
                    <span>Loading orders...</span>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <span>No orders found.</span>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Order ID */}
                    <td className="p-4 align-top">
                      <div className="font-extrabold text-[#C5A059] font-mono text-sm">
                        {order.order_number}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="p-4 align-top">
                      <div className="font-bold text-white text-sm">{order.customer_name}</div>
                      <a
                        href={`tel:${order.customer_phone}`}
                        className="text-xs text-sky-400 flex items-center gap-1 mt-0.5"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{order.customer_phone}</span>
                      </a>
                    </td>

                    {/* Destination */}
                    <td className="p-4 align-top">
                      <div className="flex items-start gap-1.5 text-xs text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span>{order.shipping_address?.city || 'India'}</span>,{' '}
                          <span className="font-mono text-slate-400">{order.shipping_address?.pincode}</span>
                        </div>
                      </div>
                    </td>

                    {/* Items & Total */}
                    <td className="p-4 align-top">
                      <div className="font-black text-white text-base">
                        ₹{Number(order.total_amount || 0).toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {order.items?.length || 1} Item(s)
                      </div>
                    </td>

                    {/* Payment */}
                    <td className="p-4 align-top">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                        {order.payment_method || 'COD'}
                      </span>
                    </td>

                    {/* Status Select */}
                    <td className="p-4 align-top">
                      <select
                        value={order.delivery_status || 'placed'}
                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border focus:outline-none cursor-pointer capitalize ${getStatusBadge(
                          order.delivery_status || 'placed'
                        )}`}
                      >
                        <option value="placed" className="bg-slate-900 text-amber-400">
                          Placed
                        </option>
                        <option value="confirmed" className="bg-slate-900 text-sky-400">
                          Confirmed
                        </option>
                        <option value="dispatched" className="bg-slate-900 text-indigo-400">
                          Dispatched
                        </option>
                        <option value="out_for_delivery" className="bg-slate-900 text-purple-400">
                          Out For Delivery
                        </option>
                        <option value="delivered" className="bg-slate-900 text-emerald-400">
                          Delivered
                        </option>
                        <option value="cancelled" className="bg-slate-900 text-rose-400">
                          Cancelled
                        </option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#C5A059] text-slate-950 font-bold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-slideUp">
          <CheckCircle className="w-5 h-5" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}

