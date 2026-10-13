'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  Search,
  ExternalLink,
  RefreshCw,
  Tag,
  DollarSign,
  PackageCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { formatImageUrl } from '@/lib/image';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 2524, totalPages: 127 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProducts = (pageToFetch = 1) => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', String(pageToFetch));
    params.set('limit', '20');
    if (search) params.set('search', search);

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setProducts(data.products);
          setPagination(data.pagination || { page: pageToFetch, limit: 20, total: data.total || 0, totalPages: Math.ceil((data.total || 0) / 20) });
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(1);
  };

  return (
    <div className="p-6 md:p-10 font-body max-w-7xl mx-auto" style={{ fontFamily: "'Lato', sans-serif" }}>
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3" style={{ fontFamily: "'Raleway', sans-serif" }}>
            <span>Products & Inventory Catalog</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#27272A] text-white border border-[#3F3F46]" style={{ fontFamily: "'Raleway', sans-serif" }}>
              {pagination.total} SKUs
            </span>
          </h1>
          <p className="text-[#A1A1AA] text-sm mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>
            Search, inspect, and verify all 2,524 luxury car components stored in MongoDB Atlas with high-resolution Cloudinary CDN assets.
          </p>
        </div>

        <button
          onClick={() => fetchProducts(pagination.page)}
          className="p-2.5 rounded-xl bg-[#1C1C1E] text-[#D4D4D8] hover:text-white hover:bg-[#27272A] transition-colors border border-[#27272A] self-start md:self-auto"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-[#121212] border border-[#27272A] rounded-2xl p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by part title, SKU number, vehicle make (BMW, Audi, Mercedes, Porsche)..."
              className="w-full bg-[#1C1C1E] border border-[#27272A] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-white"
              style={{ fontFamily: "'Lato', sans-serif" }}
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-white text-black rounded-xl text-sm font-bold shadow-lg hover:bg-[#E4E4E7]"
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            Search
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-[#121212] border border-[#27272A] rounded-2xl overflow-hidden shadow-xl mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse" style={{ fontFamily: "'Lato', sans-serif" }}>
            <thead>
              <tr className="bg-[#0A0A0A] border-b border-[#27272A] text-[11px] font-bold uppercase tracking-wider text-[#A1A1AA]" style={{ fontFamily: "'Raleway', sans-serif" }}>
                <th className="p-4">Product / Photo</th>
                <th className="p-4">SKU / Code</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price (INR)</th>
                <th className="p-4">Fitment Status</th>
                <th className="p-4 text-right">Store Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#A1A1AA]">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-white" />
                    <span>Searching catalog...</span>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#71717A]">
                    No products matched your search query.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const img =
                    p.images && p.images.length > 0
                      ? formatImageUrl(p.images[0])
                      : '/assets/images/banner/banner-1.jpg';

                  return (
                    <tr key={p._id || p.slug} className="hover:bg-[#1C1C1E] transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-black border border-[#27272A] p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img} alt={p.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="max-w-md">
                          <div className="font-bold text-white text-sm line-clamp-1" style={{ fontFamily: "'Raleway', sans-serif" }}>{p.name}</div>
                          <div className="text-[11px] text-[#A1A1AA] font-medium mt-0.5">
                            {p.make || 'European & Luxury Import'}
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-mono text-xs">
                        <div className="font-bold text-white">{p.part_number || p.sku || 'N/A'}</div>
                        {(p.oem_numbers && p.oem_numbers.length > 0) ? (
                          <div className="text-[10px] text-[#71717A] mt-0.5 truncate max-w-[140px]" title={Array.isArray(p.oem_numbers) ? p.oem_numbers.join(', ') : p.oem_numbers}>
                            OEM: {Array.isArray(p.oem_numbers) ? p.oem_numbers.join(', ') : p.oem_numbers}
                          </div>
                        ) : p.oem_number ? (
                          <div className="text-[10px] text-[#71717A] mt-0.5 truncate max-w-[140px]" title={p.oem_number}>
                            OEM: {p.oem_number}
                          </div>
                        ) : null}
                      </td>

                      <td className="p-4 text-xs text-[#D4D4D8]">
                        <span className="px-2 py-0.5 rounded bg-[#1C1C1E] border border-[#27272A]" style={{ fontFamily: "'Raleway', sans-serif" }}>
                          {p.category || 'General Spare'}
                        </span>
                      </td>

                      <td className="p-4 font-black text-white text-sm" style={{ fontFamily: "'Raleway', sans-serif" }}>
                        ₹{Number(p.price || 0).toLocaleString('en-IN')}
                      </td>

                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-black" style={{ fontFamily: "'Raleway', sans-serif" }}>
                          <PackageCheck className="w-3 h-3 text-black" />
                          <span>100% In Stock</span>
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C1C1E] hover:bg-[#27272A] text-xs font-semibold text-white border border-[#27272A] transition-colors"
                          style={{ fontFamily: "'Raleway', sans-serif" }}
                        >
                          <span>View</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4 text-xs text-[#A1A1AA]" style={{ fontFamily: "'Lato', sans-serif" }}>
        <div>
          Showing page <span className="font-bold text-white">{pagination.page}</span> of{' '}
          <span className="font-bold text-white">{pagination.totalPages}</span> ({pagination.total} total items)
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchProducts(Math.max(1, pagination.page - 1))}
            disabled={pagination.page <= 1}
            className="px-3 py-1.5 rounded-lg bg-[#1C1C1E] text-[#D4D4D8] hover:text-white disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 border border-[#27272A]"
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>
          <button
            onClick={() => fetchProducts(Math.min(pagination.totalPages, pagination.page + 1))}
            disabled={pagination.page >= pagination.totalPages}
            className="px-3 py-1.5 rounded-lg bg-[#1C1C1E] text-[#D4D4D8] hover:text-white disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 border border-[#27272A]"
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

