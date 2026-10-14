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
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col md:flex-row font-body" style={{ fontFamily: "'Lato', sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-[#121212] border-r border-[#27272A] flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-[#27272A]">
            <Link href="/admin/crm" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-none bg-white text-black flex items-center justify-center font-black shadow-lg" style={{ fontFamily: "'Raleway', sans-serif" }}>
                DP
              </div>
              <div>
                <div className="font-extrabold text-base tracking-wider text-white" style={{ fontFamily: "'Raleway', sans-serif" }}>
                  DRANPARTS CRM
                </div>
                <div className="text-[11px] font-semibold text-[#A1A1AA] tracking-widest uppercase" style={{ fontFamily: "'Raleway', sans-serif" }}>
                  Enterprise Suite
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] px-3 py-2" style={{ fontFamily: "'Raleway', sans-serif" }}>
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
                      ? 'bg-[#27272A] text-white border-l-4 border-white'
                      : 'text-[#A1A1AA] hover:text-white hover:bg-[#1C1C1E]'
                  }`}
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#71717A]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-white text-black" style={{ fontFamily: "'Raleway', sans-serif" }}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Quick Links */}
        <div className="p-4 border-t border-[#27272A] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-[#D4D4D8] bg-[#1C1C1E] hover:bg-[#27272A] hover:text-white transition-all border border-[#27272A]"
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Public Store</span>
          </Link>
          <Link
            href="/admin/login"
            className="flex items-center justify-center gap-2 w-full py-2 text-xs font-semibold text-[#A1A1AA] hover:text-white transition-colors"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#0A0A0A] min-h-screen">
        {children}
      </main>
    </div>
  );
}

