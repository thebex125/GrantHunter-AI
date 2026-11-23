import React from 'react';
import { Shield, RefreshCw, ChevronDown, Activity } from 'lucide-react';
import type { ProjectProfile } from '../types/grant';

interface NavbarProps {
  profile: ProjectProfile;
  onOpenProfile: () => void;
  onScanFeed: () => void;
  isScanning: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  onOpenProfile,
  onScanFeed,
  isScanning,
}) => {
  return (
    <header className="border-b border-white/[0.06] bg-[#05070B]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-600 p-[1px]">
            <div className="w-full h-full bg-[#080B11] rounded-xl flex items-center justify-center">
              <Shield className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#05070B]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                GrantHunter
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                Swarm OS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-wide">
              Autonomous Opportunity Intelligence
            </p>
          </div>
        </div>

        {/* Swarm Status Indicator */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#080B11]/90 border border-white/[0.08] text-xs">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-slate-300 font-medium">4 Agents Active:</span>
          <span className="font-mono text-cyan-400 font-semibold">
            Scout • Matcher • Drafter • Critic
          </span>
        </div>

        {/* Actions & Target Profile */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenProfile}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#080B11] border border-white/[0.08] hover:border-white/20 transition cursor-pointer text-xs"
          >
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-slate-400">Target Project:</span>
            <span className="font-semibold text-white truncate max-w-[140px] sm:max-w-none">
              {profile.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            onClick={onScanFeed}
            disabled={isScanning}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-[#05070B] font-semibold text-xs tracking-wide transition shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
          >
            {isScanning ? (
              <Activity className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            <span>{isScanning ? 'Scanning...' : 'Scan Feed'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
