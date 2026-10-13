'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users,
  Package,
  Layers,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  PhoneCall,
  LogOut,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If on login page, don't show admin sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    {
      label: 'CRM Leads Pipeline',
      href: '/admin/crm',
      icon: Users,
      badge: 'Active',
      highlight: true,
    },
    {
      label: 'Customer Orders',
      href: '/admin/orders',
      icon: Package,
    },
    {
      label: 'Products & Inventory (2,524)',
      href: '/admin/products',
      icon: Layers,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-[#0F172A] border-r border-slate-800 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800">
            <Link href="/admin/crm" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#C5A059] to-[#DFBA73] flex items-center justify-center text-slate-950 font-black shadow-lg shadow-[#C5A059]/20">
                OR
              </div>
              <div>
                <div className="font-extrabold text-base tracking-wider text-white">
                  OFF ROAD CRM
                </div>
                <div className="text-[11px] font-semibold text-[#C5A059] tracking-widest uppercase">
                  Enterprise Suite
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
              Management Portal
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#C5A059]/20 to-transparent text-[#C5A059] border-l-4 border-[#C5A059]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-[#C5A059]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#C5A059]/20 text-[#C5A059]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Quick Links */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-300 bg-slate-800/80 hover:bg-slate-800 hover:text-[#C5A059] transition-all border border-slate-700/50"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Public Store</span>
          </Link>
          <Link
            href="/admin/login"
            className="flex items-center justify-center gap-2 w-full py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#0B0F19] min-h-screen">
        {children}
      </main>
    </div>
  );
}

