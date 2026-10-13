'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Layers,
  Search,
  ExternalLink,
  RefreshCw,
  Plus,
  Trash2,
  Edit3,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  Package,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  FileSpreadsheet,
  FileText,
  DollarSign,
  Boxes,
  ArrowUpDown,
  Image as ImageIcon,
} from 'lucide-react';
import { formatImageUrl } from '@/lib/image';
import { LUXURY_MAKES } from '@/constants/vehicles';

interface ProductItem {
  id?: number | string;
  _id?: string;
  title: string;
  slug: string;
  part_number: string;
  oem_number?: string;
  oem_numbers?: string[];
  brand?: string;
  make?: string;
  model?: string;
  year_compatibility?: string;
  category_name?: string;
  category_slug?: string;
  price: number;
  old_price?: number;
  stock_quantity: number;
  in_stock: boolean;
  images: string[];
  image?: string;
  description?: string;
  short_description?: string;
  created_at?: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, totalPages: 1 });
  const [stats, setStats] = useState({ totalCount: 0, inStockCount: 0, outOfStockCount: 0, totalValuation: 0 });
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedMake, setSelectedMake] = useState('all');
  const [selectedStock, setSelectedStock] = useState('all');

  // Multi-select
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; updated: number; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toast
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Product Form State
  const initialForm = {
    title: '',
    slug: '',
    part_number: '',
    oem_numbers: '',
    make: '',
    model: '',
    year_compatibility: '',
    category_name: 'Automotive Parts',
    brand: 'Off Road Connection Parts',
    price: '',
    old_price: '',
    stock_quantity: '50',
    in_stock: true,
    images: '',
    description: '',
    short_description: '',
  };
  const [formData, setFormData] = useState(initialForm);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImage(true);
    try {
      const uploadData = new FormData();
      Array.from(files).forEach((f) => uploadData.append('files', f));

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload image');
      }

      const currentImages = formData.images
        ? formData.images
            .split(/[\n,]/)
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      const newImages = [...currentImages, ...(data.urls || [data.url])];
      setFormData((prev) => ({
        ...prev,
        images: newImages.join('\n'),
      }));

      showToast(`Successfully uploaded ${data.count || 1} image(s)!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Image upload failed', 'error');
    } finally {
      setIsUploadingImage(false);
      if (imageFileInputRef.current) imageFileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const currentImages = formData.images
      ? formData.images
          .split(/[\n,]/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const updated = currentImages.filter((_, i) => i !== indexToRemove);
    setFormData((prev) => ({
      ...prev,
      images: updated.join('\n'),
    }));
  };

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fetchProducts = (pageToFetch = pagination.page) => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', String(pageToFetch));
    params.set('limit', String(pagination.limit));
    if (search.trim()) params.set('search', search.trim());
    if (selectedMake !== 'all') params.set('make', selectedMake);
    if (selectedStock !== 'all') params.set('stock', selectedStock);

    fetch(`/api/admin/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products || []);
          setPagination(data.pagination || { page: pageToFetch, limit: pagination.limit, total: 0, totalPages: 1 });
          if (data.stats) setStats(data.stats);
        } else {
          showToast(data.error || 'Failed to load products', 'error');
        }
      })
      .catch((err) => {
        console.error(err);
        showToast('Error connecting to server', 'error');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts(1);
  }, [selectedMake, selectedStock]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(1);
  };

  // Select all / deselect all
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = products.map((p) => String(p._id || p.id));
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Open Create Modal
  const openCreateModal = () => {
    setModalMode('create');
    setEditingProduct(null);
    setFormData(initialForm);
    setShowProductModal(true);
  };

  // Open Edit Modal
  const openEditModal = (p: ProductItem) => {
    setModalMode('edit');
    setEditingProduct(p);
    setFormData({
      title: p.title || '',
      slug: p.slug || '',
      part_number: p.part_number || '',
      oem_numbers: Array.isArray(p.oem_numbers) ? p.oem_numbers.join(', ') : p.oem_number || '',
      make: p.make || '',
      model: p.model || '',
      year_compatibility: p.year_compatibility || '',
      category_name: p.category_name || 'Automotive Parts',
      brand: p.brand || 'Off Road Connection Parts',
      price: String(p.price || 0),
      old_price: p.old_price ? String(p.old_price) : '',
      stock_quantity: String(p.stock_quantity ?? 50),
      in_stock: p.in_stock,
      images: Array.isArray(p.images) ? p.images.join('\n') : p.image || '',
      description: p.description || '',
      short_description: p.short_description || '',
    });
    setShowProductModal(true);
  };

  // Save Product (Create or Edit)
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);

    const payload = {
      ...(modalMode === 'edit' && editingProduct ? { _id: editingProduct._id, id: editingProduct.id } : {}),
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      part_number: formData.part_number.trim(),
      oem_numbers: formData.oem_numbers
        .split(/[;,]/)
        .map((s) => s.trim())
        .filter(Boolean),
      make: formData.make.trim(),
      model: formData.model.trim(),
      year_compatibility: formData.year_compatibility.trim(),
      category_name: formData.category_name.trim(),
      brand: formData.brand.trim(),
      price: Number(formData.price || 0),
      old_price: formData.old_price ? Number(formData.old_price) : undefined,
      stock_quantity: Number(formData.stock_quantity || 0),
      in_stock: formData.in_stock,
      images: formData.images
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean),
      description: formData.description,
      short_description: formData.short_description,
    };

    try {
      const url = '/api/admin/products';
      const method = modalMode === 'create' ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast(modalMode === 'create' ? 'Product created successfully!' : 'Product updated successfully!');
        setShowProductModal(false);
        fetchProducts(pagination.page);
      } else {
        showToast(data.error || 'Operation failed', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Network error', 'error');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete Single Product
  const handleDeleteSingle = async (p: ProductItem) => {
    if (!confirm(`Are you sure you want to delete "${p.title}"?`)) return;

    try {
      const id = p._id || p.id;
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        showToast('Product deleted successfully');
        fetchProducts(pagination.page);
      } else {
        showToast(data.error || 'Failed to delete product', 'error');
      }
    } catch (err) {
      showToast('Error deleting product', 'error');
    }
  };

  // Delete Bulk Selected
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected products? This action is permanent.`))
      return;

    try {
      const res = await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const data = await res.json();

      if (data.success) {
        showToast(`${data.deletedCount || selectedIds.length} products deleted successfully`);
        setSelectedIds([]);
        fetchProducts(1);
      } else {
        showToast(data.error || 'Bulk delete failed', 'error');
      }
    } catch (err) {
      showToast('Error deleting products', 'error');
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const params = new URLSearchParams();
    params.set('export', 'csv');
    if (search.trim()) params.set('search', search.trim());
    if (selectedMake !== 'all') params.set('make', selectedMake);
    if (selectedStock !== 'all') params.set('stock', selectedStock);

    window.open(`/api/admin/products?${params.toString()}`, '_blank');
  };

  // Export to JSON
  const handleExportJSON = () => {
    const params = new URLSearchParams();
    params.set('export', 'json');
    if (search.trim()) params.set('search', search.trim());
    if (selectedMake !== 'all') params.set('make', selectedMake);
    if (selectedStock !== 'all') params.set('stock', selectedStock);

    window.open(`/api/admin/products?${params.toString()}`, '_blank');
  };

  // File Upload Parser (CSV / JSON)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportText(content);
    };
    reader.readAsText(file);
  };

  // Parse CSV text to product objects
  const parseCSVToItems = (csv: string) => {
    const lines = csv.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return [];

    // Parse header
    const headers = lines[0].split(',').map((h) => h.replace(/^["']|["']$/g, '').trim().toLowerCase());

    const items: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      // Regex CSV line splitter handling quotes
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      const line = lines[i];

      for (let c = 0; c < line.length; c++) {
        const char = line[c];
        if (char === '"' || char === "'") {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim().replace(/^["']|["']$/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim().replace(/^["']|["']$/g, ''));

      const obj: any = {};
      headers.forEach((h, idx) => {
        const val = values[idx] || '';
        if (h.includes('title') || h.includes('name')) obj.title = val;
        else if (h.includes('part') || h.includes('sku')) obj.part_number = val;
        else if (h.includes('oem')) obj.oem_numbers = val.split(/[;,]/).map((s) => s.trim()).filter(Boolean);
        else if (h.includes('make')) obj.make = val;
        else if (h.includes('model')) obj.model = val;
        else if (h.includes('category')) obj.category_name = val;
        else if (h.includes('price')) obj.price = Number(val) || 0;
        else if (h.includes('stock')) obj.stock_quantity = Number(val) || 50;
        else if (h.includes('image')) obj.images = val.split(/[;,]/).map((s) => s.trim()).filter(Boolean);
        else if (h.includes('desc')) obj.description = val;
      });

      if (obj.title) items.push(obj);
    }
    return items;
  };

  // Execute Bulk Import
  const handleExecuteImport = async () => {
    if (!importText.trim()) {
      showToast('Please upload a file or paste CSV/JSON data first', 'error');
      return;
    }

    setImportLoading(true);
    setImportResult(null);

    let itemsToImport: any[] = [];

    try {
      if (importText.trim().startsWith('[') || importText.trim().startsWith('{')) {
        const parsed = JSON.parse(importText);
        itemsToImport = Array.isArray(parsed) ? parsed : [parsed];
      } else {
        itemsToImport = parseCSVToItems(importText);
      }
    } catch (parseErr) {
      showToast('Failed to parse file. Please verify CSV or JSON syntax.', 'error');
      setImportLoading(false);
      return;
    }

    if (itemsToImport.length === 0) {
      showToast('No valid product rows found in input.', 'error');
      setImportLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bulk: true, items: itemsToImport }),
      });

      const data = await res.json();
      if (data.success) {
        setImportResult({
          imported: data.imported || 0,
          updated: data.updated || 0,
          errors: data.errors || [],
        });
        showToast(`Import Success: ${data.imported} added, ${data.updated} updated!`);
        fetchProducts(1);
      } else {
        showToast(data.error || 'Import failed', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Server error during import', 'error');
    } finally {
      setImportLoading(false);
    }
  };

  // Sample CSV Template Download
  const downloadSampleCSV = () => {
    const csvContent =
      'Title,Part Number,OEM Numbers,Make,Model,Category,Price,Stock Quantity,Images,Description\n' +
      '"BMW 5 Series F10 Front LED Matrix Headlight Unit","ORCP-BMW-6001","63117271907; 63117271908","BMW","520d / 530d (F10)","Lighting Assemblies",48500,12,"https://images.unsplash.com/photo-1549399542-7e3f8b79c341","Genuine OEM specification LED Headlight Unit with active cornering modules."\n' +
      '"Mercedes-Benz E-Class W213 Air Suspension Strut Front Left","ORCP-MB-7002","A2133200100; A2133200200","Mercedes-Benz","E-Class (W213)","Suspension & Steering",54000,8,"https://images.unsplash.com/photo-1486006920555-c77dce18193b","OEM Genuine Air Suspension Strut with electronic damping control valve."';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample-parts-import-template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 md:p-10 font-body max-w-7xl mx-auto" style={{ fontFamily: "'Lato', sans-serif" }}>
      {/* Title & Analytics Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight" style={{ fontFamily: "'Raleway', sans-serif" }}>
              Enterprise Inventory Manager
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#27272A] text-white border border-[#3F3F46]" style={{ fontFamily: "'Raleway', sans-serif" }}>
              {stats.totalCount || pagination.total} Active SKUs
            </span>
          </div>
          <p className="text-[#A1A1AA] text-sm mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>
            Add, update, delete, and bulk import/export genuine OEM spare parts directly synced with MongoDB Atlas.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => fetchProducts(pagination.page)}
            className="p-2.5 rounded-xl bg-[#1C1C1E] text-[#D4D4D8] hover:text-white hover:bg-[#27272A] transition-colors border border-[#27272A]"
            title="Refresh Inventory"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1C1C1E] hover:bg-[#27272A] text-white font-bold text-xs border border-[#3F3F46] transition-all"
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            <Upload className="w-3.5 h-3.5 text-white" />
            <span>Bulk Import (CSV/JSON)</span>
          </button>

          <div className="relative group">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1C1C1E] hover:bg-[#27272A] text-white font-bold text-xs border border-[#3F3F46] transition-all"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>Export CSV</span>
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-black text-xs shadow-lg hover:bg-[#E4E4E7] active:scale-95 transition-all"
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Add New Part</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#121212] border border-[#27272A] rounded-2xl p-5 border-l-4 border-l-white">
          <div className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]" style={{ fontFamily: "'Raleway', sans-serif" }}>Total Catalog SKUs</div>
          <div className="text-2xl font-black text-white mt-1.5" style={{ fontFamily: "'Raleway', sans-serif" }}>
            {Number(stats.totalCount || pagination.total || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#71717A] mt-1">Verified OEM parts in MongoDB</div>
        </div>

        <div className="bg-[#121212] border border-[#27272A] rounded-2xl p-5 border-l-4 border-l-[#71717A]">
          <div className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]" style={{ fontFamily: "'Raleway', sans-serif" }}>In-Stock & Ready To Ship</div>
          <div className="text-2xl font-black text-white mt-1.5" style={{ fontFamily: "'Raleway', sans-serif" }}>
            {Number(stats.inStockCount || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#71717A] mt-1">Ready for 2-4 day express air dispatch</div>
        </div>

        <div className="bg-[#121212] border border-[#27272A] rounded-2xl p-5 border-l-4 border-l-[#52525B]">
          <div className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]" style={{ fontFamily: "'Raleway', sans-serif" }}>Out of Stock / On Request</div>
          <div className="text-2xl font-black text-white mt-1.5" style={{ fontFamily: "'Raleway', sans-serif" }}>
            {Number(stats.outOfStockCount || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#71717A] mt-1">Requires factory procurement</div>
        </div>

        <div className="bg-[#121212] border border-[#27272A] rounded-2xl p-5 border-l-4 border-l-[#3F3F46]">
          <div className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]" style={{ fontFamily: "'Raleway', sans-serif" }}>Active Inventory Valuation</div>
          <div className="text-2xl font-black text-white mt-1.5" style={{ fontFamily: "'Raleway', sans-serif" }}>
            ₹{Number(stats.totalValuation || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#71717A] mt-1">Total physical stock retail worth</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#121212] border border-[#27272A] rounded-2xl p-4 mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by part title, SKU, OEM code, make (BMW, Audi, Porsche)..."
              className="w-full bg-[#1C1C1E] border border-[#27272A] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-white"
              style={{ fontFamily: "'Lato', sans-serif" }}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#27272A] hover:bg-[#3F3F46] text-white rounded-xl text-xs font-bold transition-colors border border-[#3F3F46]"
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setTimeout(() => fetchProducts(1), 50);
              }}
              className="px-2.5 py-2.5 bg-[#1C1C1E] text-[#A1A1AA] hover:text-white rounded-xl text-xs font-bold border border-[#27272A]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Filters & Bulk Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Make Filter */}
          <select
            value={selectedMake}
            onChange={(e) => setSelectedMake(e.target.value)}
            className="bg-[#1C1C1E] border border-[#27272A] text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-white"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            <option value="all">All Makes (BMW, Audi, etc.)</option>
            {LUXURY_MAKES.map((m) => (
              <option key={m.name} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value)}
            className="bg-[#1C1C1E] border border-[#27272A] text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-white"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            <option value="all">All Stock Statuses</option>
            <option value="in_stock">In Stock Only</option>
            <option value="low_stock">Low Stock (≤10)</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>

          {/* Bulk Delete Button if selected */}
          {selectedIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white text-black font-extrabold text-xs shadow-lg hover:bg-[#E4E4E7] transition-all animate-pulse"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              <Trash2 className="w-3.5 h-3.5 text-black" />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-[#121212] border border-[#27272A] rounded-2xl overflow-hidden shadow-xl mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse" style={{ fontFamily: "'Lato', sans-serif" }}>
            <thead>
              <tr className="bg-[#0A0A0A] border-b border-[#27272A] text-[11px] font-bold uppercase tracking-wider text-[#A1A1AA]" style={{ fontFamily: "'Raleway', sans-serif" }}>
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === products.length && products.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-[#3F3F46] bg-[#1C1C1E] text-white focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="p-4">Component & Make</th>
                <th className="p-4">SKU / OEM Code</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price (INR)</th>
                <th className="p-4">Inventory Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-[#A1A1AA]">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-white" />
                    <span>Synchronizing inventory catalog...</span>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-[#71717A]">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <span>No parts found matching your criteria.</span>
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const id = String(p._id || p.id);
                  const isSelected = selectedIds.includes(id);
                  const img =
                    p.images && p.images.length > 0
                      ? formatImageUrl(p.images[0])
                      : '/assets/images/banner/banner-1.jpg';

                  return (
                    <tr
                      key={id}
                      className={`transition-colors ${isSelected ? 'bg-[#27272A]/40' : 'hover:bg-[#1C1C1E]'}`}
                    >
                      {/* Checkbox */}
                      <td className="p-4 align-middle">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(id)}
                          className="rounded border-[#3F3F46] bg-[#1C1C1E] text-white focus:ring-0 cursor-pointer"
                        />
                      </td>

                      {/* Photo & Title */}
                      <td className="p-4 align-top">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-xl bg-black border border-[#27272A] p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img} alt={p.title} className="w-full h-full object-contain" />
                          </div>
                          <div className="max-w-md">
                            <div className="font-bold text-white text-sm line-clamp-1" style={{ fontFamily: "'Raleway', sans-serif" }}>
                              {p.title}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1C1C1E] text-white border border-[#27272A]">
                                {p.make || 'European & Luxury'}
                              </span>
                              {p.model && (
                                <span className="text-[10px] text-[#A1A1AA] truncate max-w-[120px]">
                                  {p.model}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* SKU & OEM */}
                      <td className="p-4 align-top font-mono text-xs">
                        <div className="font-bold text-white">{p.part_number || 'N/A'}</div>
                        {p.oem_numbers && p.oem_numbers.length > 0 ? (
                          <div
                            className="text-[10px] text-[#71717A] mt-0.5 truncate max-w-[150px]"
                            title={Array.isArray(p.oem_numbers) ? p.oem_numbers.join(', ') : String(p.oem_numbers)}
                          >
                            OEM: {Array.isArray(p.oem_numbers) ? p.oem_numbers.join(', ') : p.oem_numbers}
                          </div>
                        ) : p.oem_number ? (
                          <div className="text-[10px] text-[#71717A] mt-0.5 truncate max-w-[150px]" title={p.oem_number}>
                            OEM: {p.oem_number}
                          </div>
                        ) : null}
                      </td>

                      {/* Category */}
                      <td className="p-4 align-top text-xs text-[#D4D4D8]">
                        <span className="px-2.5 py-0.5 rounded bg-[#1C1C1E] border border-[#27272A] inline-block" style={{ fontFamily: "'Raleway', sans-serif" }}>
                          {p.category_name || 'General Spare'}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="p-4 align-top">
                        <div className="font-black text-white text-sm" style={{ fontFamily: "'Raleway', sans-serif" }}>
                          ₹{Number(p.price || 0).toLocaleString('en-IN')}
                        </div>
                        {p.old_price && p.old_price > p.price && (
                          <div className="text-[10px] text-[#71717A] line-through mt-0.5">
                            ₹{Number(p.old_price).toLocaleString('en-IN')}
                          </div>
                        )}
                      </td>

                      {/* Stock Status */}
                      <td className="p-4 align-top">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold self-start ${
                              p.in_stock && (p.stock_quantity ?? 50) > 0
                                ? 'bg-white text-black'
                                : 'bg-[#27272A] text-[#71717A] border border-[#3F3F46]'
                            }`}
                            style={{ fontFamily: "'Raleway', sans-serif" }}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                p.in_stock && (p.stock_quantity ?? 50) > 0 ? 'bg-black' : 'bg-[#71717A]'
                              }`}
                            />
                            <span>{p.in_stock && (p.stock_quantity ?? 50) > 0 ? 'In Stock' : 'Out of Stock'}</span>
                          </span>
                          <span className="text-[10px] text-[#71717A]">
                            Quantity: <strong className="text-white">{p.stock_quantity ?? 50}</strong>
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 align-top text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit */}
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-2 rounded-xl bg-[#1C1C1E] hover:bg-[#27272A] text-white transition-all border border-[#27272A]"
                            title="Edit Part Details"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-white" />
                          </button>

                          {/* View in Store */}
                          <Link
                            href={`/product/${p.slug}`}
                            target="_blank"
                            className="p-2 rounded-xl bg-[#1C1C1E] hover:bg-[#27272A] text-white transition-all border border-[#27272A]"
                            title="View Public Storefront Page"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-white" />
                          </Link>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteSingle(p)}
                            className="p-2 rounded-xl bg-[#1C1C1E] hover:bg-[#27272A] text-[#A1A1AA] hover:text-white transition-all border border-[#27272A]"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-[#A1A1AA]" />
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
            className="px-3.5 py-2 rounded-xl bg-[#1C1C1E] text-[#D4D4D8] hover:text-white disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 border border-[#27272A]"
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>
          <button
            onClick={() => fetchProducts(Math.min(pagination.totalPages, pagination.page + 1))}
            disabled={pagination.page >= pagination.totalPages}
            className="px-3.5 py-2 rounded-xl bg-[#1C1C1E] text-[#D4D4D8] hover:text-white disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 border border-[#27272A]"
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD / EDIT PRODUCT MODAL                                                   */}
      {/* ========================================================================= */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn" style={{ fontFamily: "'Lato', sans-serif" }}>
          <div className="bg-[#121212] border border-[#27272A] rounded-3xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#27272A] pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-white" />
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Raleway', sans-serif" }}>
                  {modalMode === 'create' ? 'Add New Spare Part to Inventory' : `Edit Part: ${editingProduct?.title}`}
                </h3>
              </div>
              <button onClick={() => setShowProductModal(false)} className="p-1 rounded-lg text-[#71717A] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-[#A1A1AA] mb-1" style={{ fontFamily: "'Raleway', sans-serif" }}>
                  Part Title / Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. BMW 520d F10 Front Air Suspension Strut Left"
                  className="w-full bg-[#1C1C1E] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-white"
                />
              </div>

              {/* Part Number & OEM */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#A1A1AA] mb-1" style={{ fontFamily: "'Raleway', sans-serif" }}>
                    Part Number / SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.part_number}
                    onChange={(e) => setFormData({ ...formData, part_number: e.target.value })}
                    placeholder="e.g. ORCP-BMW-9021 or 31316789363"
                    className="w-full bg-[#1C1C1E] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A1A1AA] mb-1" style={{ fontFamily: "'Raleway', sans-serif" }}>
                    OEM Number(s) (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.oem_numbers}
                    onChange={(e) => setFormData({ ...formData, oem_numbers: e.target.value })}
                    placeholder="e.g. 63117271907, 63117271908"
                    className="w-full bg-[#1C1C1E] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-white font-mono"
                  />
                </div>
              </div>

              {/* Make, Model, Year */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#A1A1AA] mb-1" style={{ fontFamily: "'Raleway', sans-serif" }}>
                    Vehicle Make
                  </label>
                  <select
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    className="w-full bg-[#1C1C1E] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white"
                  >
                    <option value="">Select Vehicle Make</option>
                    {LUXURY_MAKES.map((m) => (
                      <option key={m.name} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A1A1AA] mb-1" style={{ fontFamily: "'Raleway', sans-serif" }}>
                    Vehicle Model
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="e.g. 520d / 530d (F10)"
                    className="w-full bg-[#1C1C1E] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A1A1AA] mb-1" style={{ fontFamily: "'Raleway', sans-serif" }}>
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={formData.category_name}
                    onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                    placeholder="e.g. Suspension & Steering"
                    className="w-full bg-[#1C1C1E] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#A1A1AA] mb-1" style={{ fontFamily: "'Raleway', sans-serif" }}>
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="45000"
                    className="w-full bg-[#1C1C1E] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A1A1AA] mb-1" style={{ fontFamily: "'Raleway', sans-serif" }}>
                    MRP / Old Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.old_price}
                    onChange={(e) => setFormData({ ...formData, old_price: e.target.value })}
                    placeholder="58000"
                    className="w-full bg-[#1C1C1E] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A1A1AA] mb-1" style={{ fontFamily: "'Raleway', sans-serif" }}>
                    Stock Units
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                    placeholder="50"
                    className="w-full bg-[#1C1C1E] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A1A1AA] mb-1" style={{ fontFamily: "'Raleway', sans-serif" }}>
                    Status
                  </label>
                  <select
                    value={formData.in_stock ? 'yes' : 'no'}
                    onChange={(e) => setFormData({ ...formData, in_stock: e.target.value === 'yes' })}
                    className="w-full bg-[#1C1C1E] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white"
                  >
                    <option value="yes">In Stock</option>
                    <option value="no">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Product Photos: Upload from Device + Link Input + Live Visual Gallery */}
              <div className="space-y-3 bg-[#141416] p-4 rounded-xl border border-[#27272A]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#A1A1AA] flex items-center gap-1.5" style={{ fontFamily: "'Raleway', sans-serif" }}>
                    <ImageIcon className="w-3.5 h-3.5 text-white" />
                    <span>Product Photographs (Upload or Link)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => imageFileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black hover:bg-[#E4E4E7] text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                    style={{ fontFamily: "'Raleway', sans-serif" }}
                  >
                    {isUploadingImage ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photos</span>
                      </>
                    )}
                  </button>
                  <input
                    ref={imageFileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Clickable Drag & Drop Zone */}
                <div
                  onClick={() => imageFileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#27272A] hover:border-white/40 rounded-xl p-3 text-center cursor-pointer transition-colors bg-[#1C1C1E]/60 hover:bg-[#1C1C1E]"
                >
                  <Upload className="w-5 h-5 mx-auto text-[#71717A] mb-1" />
                  <p className="text-xs text-[#E4E4E7] font-medium">
                    Click to browse files or drop photos here
                  </p>
                  <p className="text-[11px] text-[#71717A] mt-0.5">
                    Supports JPG, PNG, WEBP, AVIF (Multiple images can be selected at once)
                  </p>
                </div>

                {/* Image URLs text input */}
                <div>
                  <label className="block text-[11px] text-[#71717A] mb-1">
                    Or paste Photo Links (one URL per line or comma-separated):
                  </label>
                  <textarea
                    rows={2}
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    placeholder="https://res.cloudinary.com/.../part.jpg or /uploads/products/..."
                    className="w-full bg-[#1C1C1E] border border-[#27272A] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-white font-mono"
                  />
                </div>

                {/* Live Thumbnail Preview Gallery with 1-Click Delete */}
                {formData.images && formData.images.trim().length > 0 && (
                  <div className="pt-2 border-t border-[#27272A]/70">
                    <div className="text-[11px] text-[#A1A1AA] font-semibold mb-2 flex items-center justify-between">
                      <span>Attached Photos ({formData.images.split(/[\n,]/).map((s) => s.trim()).filter(Boolean).length}):</span>
                      <span className="text-[10px] text-[#71717A]">Click &times; to remove photo</span>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1.5 bg-[#0D0D0E] rounded-xl border border-[#27272A]">
                      {formData.images
                        .split(/[\n,]/)
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .map((imgUrl, idx) => (
                          <div
                            key={idx}
                            className="group relative aspect-square rounded-lg overflow-hidden border border-[#27272A] bg-black/60"
                          >
                            <img
                              src={formatImageUrl(imgUrl)}
                              alt={`Product preview ${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = '/assets/images/banner/banner-1.jpg';
                              }}
                            />
                            <span className="absolute bottom-1 left-1 bg-black/80 text-[9px] font-bold px-1.5 py-0.5 rounded text-white font-mono">
                              {idx === 0 ? 'Cover' : `#${idx + 1}`}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(idx);
                              }}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center text-xs opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                              title="Delete photo"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#A1A1AA] mb-1" style={{ fontFamily: "'Raleway', sans-serif" }}>
                  Technical Description & Fitment Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter chassis compatibility, OEM technical specifications, and fitment advisory..."
                  className="w-full bg-[#1C1C1E] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-white resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#27272A]">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#A1A1AA] hover:text-white bg-[#1C1C1E] border border-[#27272A]"
                  style={{ fontFamily: "'Raleway', sans-serif" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-black bg-white hover:bg-[#E4E4E7] shadow-lg disabled:opacity-50"
                  style={{ fontFamily: "'Raleway', sans-serif" }}
                >
                  {formSubmitting ? 'Saving...' : modalMode === 'create' ? 'Create Part' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BULK IMPORT MODAL                                                         */}
      {/* ========================================================================= */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn" style={{ fontFamily: "'Lato', sans-serif" }}>
          <div className="bg-[#121212] border border-[#27272A] rounded-3xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#27272A] pb-4 mb-6">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-white" />
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Raleway', sans-serif" }}>
                  Bulk Parts Import (CSV or JSON)
                </h3>
              </div>
              <button onClick={() => setShowImportModal(false)} className="p-1 rounded-lg text-[#71717A] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between bg-[#1C1C1E] border border-[#27272A] p-4 rounded-xl">
                <div>
                  <div className="text-xs font-bold text-white" style={{ fontFamily: "'Raleway', sans-serif" }}>Standard Inventory CSV Format</div>
                  <div className="text-[11px] text-[#A1A1AA] mt-0.5">Download sample template with column headers and example rows.</div>
                </div>
                <button
                  type="button"
                  onClick={downloadSampleCSV}
                  className="px-3 py-1.5 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] text-white text-xs font-bold border border-[#3F3F46] transition-colors"
                  style={{ fontFamily: "'Raleway', sans-serif" }}
                >
                  Download Sample CSV
                </button>
              </div>

              {/* File upload box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#27272A] hover:border-white/50 rounded-2xl p-6 text-center cursor-pointer bg-[#1C1C1E]/50 transition-colors"
              >
                <Upload className="w-8 h-8 mx-auto text-[#71717A] mb-2" />
                <div className="text-xs font-bold text-white" style={{ fontFamily: "'Raleway', sans-serif" }}>
                  Click to select CSV or JSON file from your computer
                </div>
                <div className="text-[11px] text-[#71717A] mt-1">Supports up to 5,000 rows per batch upload.</div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv,.json,text/csv,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Paste Textarea */}
              <div>
                <label className="block text-xs font-semibold text-[#A1A1AA] mb-1" style={{ fontFamily: "'Raleway', sans-serif" }}>
                  Or paste CSV / JSON content directly:
                </label>
                <textarea
                  rows={6}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Paste CSV rows or JSON array here..."
                  className="w-full bg-[#1C1C1E] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-white font-mono"
                />
              </div>

              {importResult && (
                <div className="p-4 rounded-xl bg-[#1C1C1E] border border-[#27272A]">
                  <div className="text-xs font-bold text-white mb-1" style={{ fontFamily: "'Raleway', sans-serif" }}>
                    Import Result Summary:
                  </div>
                  <div className="text-xs text-[#A1A1AA] space-y-1">
                    <div>
                      Created: <strong className="text-white">{importResult.imported}</strong> new items
                    </div>
                    <div>
                      Updated: <strong className="text-white">{importResult.updated}</strong> existing items
                    </div>
                    {importResult.errors.length > 0 && (
                      <div className="text-[#A1A1AA] text-[11px] mt-2">
                        Warnings ({importResult.errors.length}): {importResult.errors.slice(0, 3).join('; ')}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#27272A]">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#A1A1AA] hover:text-white bg-[#1C1C1E] border border-[#27272A]"
                  style={{ fontFamily: "'Raleway', sans-serif" }}
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleExecuteImport}
                  disabled={importLoading || !importText.trim()}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-black bg-white hover:bg-[#E4E4E7] shadow-lg disabled:opacity-40"
                  style={{ fontFamily: "'Raleway', sans-serif" }}
                >
                  {importLoading ? 'Importing Batch...' : 'Execute Import'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div
          className="fixed bottom-6 right-6 z-50 bg-white text-black font-bold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-slideUp"
          style={{ fontFamily: "'Raleway', sans-serif" }}
        >
          {toastMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-black" />
          ) : (
            <AlertCircle className="w-5 h-5 text-black" />
          )}
          <span>{toastMsg.text}</span>
        </div>
      )}
    </div>
  );
}
