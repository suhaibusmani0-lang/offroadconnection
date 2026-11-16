'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Package,
  Layers,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  PhoneCall,
  LogOut,
  Car,
  Ticket,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, don't show admin sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem('offroad_admin_logged_in');
      document.cookie = 'offroad_admin_session=; path=/; max-age=0';
    } catch (e) {}
    router.push('/admin/login');
  };

  const navItems = [
    {
      label: 'Executive Command',
      href: '/admin',
      icon: LayoutDashboard,
      badge: 'Live',
      highlight: true,
    },
    {
      label: 'CRM Leads & Pipeline',
      href: '/admin/crm',
      icon: Users,
    },
    {
      label: 'Customer Orders',
      href: '/admin/orders',
      icon: Package,
    },
    {
      label: 'Products & Inventory',
      href: '/admin/products',
      icon: Layers,
      badge: '2,524',
    },
  ];

  return (
    <div className="min-h-screen bg-[#090A0F] text-white flex flex-col md:flex-row font-body" style={{ fontFamily: "'Lato', sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-[#0D1017] border-r border-white/10 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-white/10">
            <Link href="/admin" className="flex items-center gap-3">
              <img
                src="/favicon.png"
                alt="DranParts Enterprise"
                className="w-10 h-10 rounded-xl shadow-lg object-contain"
              />
              <div>
                <div className="font-extrabold text-base tracking-wider text-white flex items-center gap-1.5" style={{ fontFamily: "'Raleway', sans-serif" }}>
                  <span>DRANPARTS</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#E5B869]/20 text-[#E5B869] font-bold">
                    PRO
                  </span>
                </div>
                <div className="text-[10px] font-semibold text-[#A1A1AA] tracking-widest uppercase" style={{ fontFamily: "'Raleway', sans-serif" }}>
                  Enterprise Suite v2.6
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] px-3 py-2" style={{ fontFamily: "'Raleway', sans-serif" }}>
              Management Suite
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#E5B869]/20 to-transparent text-[#E5B869] border-l-4 border-[#E5B869]'
                      : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
                  }`}
                  style={{ fontFamily: "'Raleway', sans-serif" }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#E5B869]' : 'text-[#71717A]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 text-[9px] font-black rounded-full ${
                        isActive
                          ? 'bg-[#E5B869] text-black shadow-sm'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-[#71717A]" />
              <span>Live Showroom</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400">● Online</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
