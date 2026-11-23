import React from 'react';
import { Shield, RefreshCw, ChevronDown, Activity, Sparkles } from 'lucide-react';
import type { ProjectProfile } from '../types/grant';

interface NavbarProps {
  profile: ProjectProfile;
  onOpenProfile: () => void;
  onScanFeed: () => void;
  isScanning: boolean;
  scanProgress: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  onOpenProfile,
  onScanFeed,
  isScanning,
  scanProgress,
}) => {
  return (
    <header className="border-b border-white/[0.08] bg-[#030508]/85 backdrop-blur-xl sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-500 to-violet-600 p-[1.5px] glow-cyan">
            <div className="w-full h-full bg-[#030508] rounded-2xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#030508]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                GrantHunter
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold">
                Swarm OS v2
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-wide font-mono">
              Autonomous Capital Discovery & Proposal Swarm
            </p>
          </div>
        </div>

        {/* Middle Swarm Active Strip */}
        <div className="hidden lg:flex items-center space-x-3 px-4 py-2 rounded-2xl bg-[#080B11]/90 border border-white/[0.08] text-xs font-mono shadow-inner">
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-slate-300 font-semibold">Swarm Active:</span>
          </div>
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="text-cyan-400">● Scout</span>
            <span className="text-emerald-400">● Matcher</span>
            <span className="text-violet-400">● Drafter</span>
            <span className="text-amber-400">● Critic</span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenProfile}
            className="flex items-center space-x-2.5 px-3.5 py-2 rounded-xl bg-[#080B11] border border-white/[0.08] hover:border-white/20 transition cursor-pointer text-xs"
          >
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <div className="text-left">
              <div className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">Target Project</div>
              <div className="font-bold text-white text-xs truncate max-w-[130px] sm:max-w-none">
                {profile.name}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          <button
            onClick={onScanFeed}
            disabled={isScanning}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-[#030508] font-bold text-xs tracking-wide transition shadow-lg shadow-cyan-500/25 cursor-pointer disabled:opacity-50"
          >
            {isScanning ? (
              <Activity className="w-4 h-4 animate-spin text-[#030508]" />
            ) : (
              <RefreshCw className="w-4 h-4 text-[#030508]" />
            )}
            <span className="font-mono">
              {isScanning ? `Scanning (${scanProgress}%)` : 'Run Swarm'}
            </span>
            {!isScanning && <Sparkles className="w-3.5 h-3.5 ml-0.5 text-[#030508]" />}
          </button>
        </div>
      </div>
    </header>
  );
};
