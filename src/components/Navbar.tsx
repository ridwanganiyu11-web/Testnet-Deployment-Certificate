import React, { useState } from 'react';
import { ShieldCheck, PlusCircle, LayoutDashboard, Award, Search, Menu, X, ExternalLink, Radio } from 'lucide-react';
import { BOTCHAIN_CONFIG } from '../config/botchain';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openCertificateModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Explore', icon: LayoutDashboard },
    { id: 'dashboard', label: 'Dashboard', icon: ShieldCheck },
    { id: 'register', label: 'Register Deployment', icon: PlusCircle, highlight: true },
    { id: 'certificates', label: 'My Certificates', icon: Award },
    { id: 'verify', label: 'Verify', icon: Search },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Tagline */}
          <div 
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                  DeployProof
                </span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Botchain 968
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Deploy It. Register It. Prove It.
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-950'
                      : item.highlight
                      ? 'bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Network Pill & Connect Wallet Button */}
          <div className="flex items-center gap-3">
            {/* Live Network Status Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-emerald-400 font-medium">BOT 968</span>
              <span className="text-slate-500">|</span>
              <a 
                href={BOTCHAIN_CONFIG.explorerUrl} 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-[11px]"
                title="Open BohrScan Explorer"
              >
                Scan <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Reown AppKit Web Component Button */}
            <div className="appkit-button-container">
              {/* @ts-ignore */}
              <appkit-button balance="show" />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
          <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between px-3">
            <span>Botchain Testnet (Chain ID 968)</span>
            <a 
              href={BOTCHAIN_CONFIG.explorerUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="text-emerald-400 hover:underline flex items-center gap-1"
            >
              BohrScan <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

