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
        return 'text-white bg-[#27272A] border-[#52525B]';
      case 'confirmed':
        return 'text-[#D4D4D8] bg-[#18181B] border-[#3F3F46]';
      case 'dispatched':
        return 'text-white bg-[#27272A] border-[#71717A]';
      case 'delivered':
        return 'text-black bg-white border-white font-black';
      case 'cancelled':
        return 'text-[#71717A] bg-[#121212] border-[#27272A]';
      default:
        return 'text-[#A1A1AA] bg-[#1C1C1E] border-[#27272A]';
    }
  };

  return (
    <div className="p-6 md:p-10 font-body max-w-7xl mx-auto" style={{ fontFamily: "'Lato', sans-serif" }}>
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3" style={{ fontFamily: "'Raleway', sans-serif" }}>
            <span>Customer Orders & Dispatch</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#27272A] text-white border border-[#3F3F46]" style={{ fontFamily: "'Raleway', sans-serif" }}>
              {stats.totalOrders || 0} Total
            </span>
          </h1>
          <p className="text-[#A1A1AA] text-sm mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>
            Track incoming purchases, verify vehicle fitment, assign express air courier tracking numbers, and update delivery status.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="p-2.5 rounded-xl bg-[#1C1C1E] text-[#D4D4D8] hover:text-white hover:bg-[#27272A] transition-colors border border-[#27272A] self-start md:self-auto"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#121212] border border-[#27272A] rounded-2xl p-5 border-l-4 border-l-[#71717A]">
          <div className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]" style={{ fontFamily: "'Raleway', sans-serif" }}>Orders Placed / Pending</div>
          <div className="text-2xl font-black text-white mt-1.5" style={{ fontFamily: "'Raleway', sans-serif" }}>{stats.pendingCount || 0}</div>
          <div className="text-[11px] text-[#71717A] mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>Awaiting dispatch verification</div>
        </div>

        <div className="bg-[#121212] border border-[#27272A] rounded-2xl p-5 border-l-4 border-l-[#52525B]">
          <div className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]" style={{ fontFamily: "'Raleway', sans-serif" }}>In Transit / Dispatched</div>
          <div className="text-2xl font-black text-white mt-1.5" style={{ fontFamily: "'Raleway', sans-serif" }}>{stats.dispatchedCount || 0}</div>
          <div className="text-[11px] text-[#71717A] mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>Shipped via BlueDart / Delhivery Air</div>
        </div>

        <div className="bg-[#121212] border border-[#27272A] rounded-2xl p-5 border-l-4 border-l-white">
          <div className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]" style={{ fontFamily: "'Raleway', sans-serif" }}>Delivered Orders</div>
          <div className="text-2xl font-black text-white mt-1.5" style={{ fontFamily: "'Raleway', sans-serif" }}>{stats.deliveredCount || 0}</div>
          <div className="text-[11px] text-[#71717A] mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>Successfully fulfilled</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-[#121212] border border-[#27272A] rounded-2xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {['', 'placed', 'confirmed', 'dispatched', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                statusFilter === status
                  ? 'bg-white text-black shadow-md'
                  : 'bg-[#1C1C1E] text-[#D4D4D8] hover:text-white hover:bg-[#27272A] border border-[#27272A]'
              }`}
              style={{ fontFamily: "'Raleway', sans-serif" }}
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
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order ID, customer, city..."
              className="bg-[#1C1C1E] border border-[#27272A] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-white w-64"
              style={{ fontFamily: "'Lato', sans-serif" }}
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 bg-[#27272A] hover:bg-[#3F3F46] text-white rounded-xl text-xs font-bold border border-[#3F3F46]"
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            Search
          </button>
        </form>
      </div>

      {/* Orders Table */}
      <div className="bg-[#121212] border border-[#27272A] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse" style={{ fontFamily: "'Lato', sans-serif" }}>
            <thead>
              <tr className="bg-[#0A0A0A] border-b border-[#27272A] text-[11px] font-bold uppercase tracking-wider text-[#A1A1AA]" style={{ fontFamily: "'Raleway', sans-serif" }}>
                <th className="p-4">Order ID & Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Shipping Destination</th>
                <th className="p-4">Items / Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Delivery Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#A1A1AA]">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-white" />
                    <span>Loading orders...</span>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#71717A]">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <span>No orders found.</span>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#1C1C1E] transition-colors">
                    {/* Order ID */}
                    <td className="p-4 align-top">
                      <div className="font-extrabold text-white font-mono text-sm" style={{ fontFamily: "'Raleway', sans-serif" }}>
                        {order.order_number}
                      </div>
                      <div className="text-[11px] text-[#71717A] mt-1">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="p-4 align-top">
                      <div className="font-bold text-white text-sm" style={{ fontFamily: "'Raleway', sans-serif" }}>{order.customer_name}</div>
                      <a
                        href={`tel:${order.customer_phone}`}
                        className="text-xs text-[#D4D4D8] flex items-center gap-1 mt-0.5"
                      >
                        <Phone className="w-3 h-3 text-[#A1A1AA]" />
                        <span>{order.customer_phone}</span>
                      </a>
                    </td>

                    {/* Destination */}
                    <td className="p-4 align-top">
                      <div className="flex items-start gap-1.5 text-xs text-[#D4D4D8]">
                        <MapPin className="w-3.5 h-3.5 text-[#71717A] flex-shrink-0 mt-0.5" />
                        <div>
                          <span>{order.shipping_address?.city || 'India'}</span>,{' '}
                          <span className="font-mono text-[#71717A]">{order.shipping_address?.pincode}</span>
                        </div>
                      </div>
                    </td>

                    {/* Items & Total */}
                    <td className="p-4 align-top">
                      <div className="font-black text-white text-base" style={{ fontFamily: "'Raleway', sans-serif" }}>
                        ₹{Number(order.total_amount || 0).toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-[#71717A] mt-0.5">
                        {order.items?.length || 1} Item(s)
                      </div>
                    </td>

                    {/* Payment */}
                    <td className="p-4 align-top">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#1C1C1E] text-white border border-[#27272A]" style={{ fontFamily: "'Raleway', sans-serif" }}>
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
                        <option value="placed" className="bg-[#121212] text-white">
                          Placed
                        </option>
                        <option value="confirmed" className="bg-[#121212] text-[#D4D4D8]">
                          Confirmed
                        </option>
                        <option value="dispatched" className="bg-[#121212] text-white">
                          Dispatched
                        </option>
                        <option value="out_for_delivery" className="bg-[#121212] text-[#D4D4D8]">
                          Out For Delivery
                        </option>
                        <option value="delivered" className="bg-[#121212] text-white">
                          Delivered
                        </option>
                        <option value="cancelled" className="bg-[#121212] text-[#71717A]">
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
        <div className="fixed bottom-6 right-6 z-50 bg-white text-black font-bold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-slideUp" style={{ fontFamily: "'Raleway', sans-serif" }}>
          <CheckCircle className="w-5 h-5 text-black" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}

