import React from 'react';
import { Shield, RefreshCw, ExternalLink, Sparkles, LayoutDashboard, ArrowLeft, ArrowRight, SlidersHorizontal } from 'lucide-react';
import type { ProjectProfile } from '../types/grant';

interface NavbarProps {
  profile: ProjectProfile;
  currentView?: 'landing' | 'studio';
  onToggleView?: (view: 'landing' | 'studio') => void;
  onOpenProfile: () => void;
  onRefreshFeed: () => void;
  isRefreshing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  currentView = 'landing',
  onToggleView,
  onOpenProfile,
  onRefreshFeed,
  isRefreshing,
}) => {
  return (
    <header className="border-b border-white/[0.08] bg-[#0A0D12]/90 backdrop-blur-md px-4 sm:px-6 py-3 sticky top-0 z-50 transition-all">
      <div className="max-w-[1520px] mx-auto flex items-center justify-between gap-3">
        
        {/* Brand identity */}
        <div className="flex items-center space-x-3 shrink-0">
          <div
            onClick={() => onToggleView?.('landing')}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00DC82]/25 to-[#00DC82]/5 border border-[#00DC82]/40 flex items-center justify-center text-[#00DC82] shadow-[0_0_15px_rgba(0,220,130,0.15)] group-hover:scale-105 transition-transform">
              <Shield className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="text-base font-extrabold tracking-tight text-white font-sans">
                  GrantHunter
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#00DC82]/15 text-[#00DC82] border border-[#00DC82]/25">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:inline leading-none mt-0.5">
                Autonomous Capital Matrix
              </span>
            </div>
          </div>

          <span className="text-slate-700 text-sm hidden sm:inline">•</span>

          {/* Quick Navigation Toggle */}
          {currentView === 'studio' ? (
            <button
              onClick={() => onToggleView?.('landing')}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#141924] hover:bg-[#1C2333] border border-white/[0.08] hover:border-white/20 text-slate-300 hover:text-white transition text-xs cursor-pointer font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#00DC82]" />
              <span className="hidden sm:inline">Overview</span>
            </button>
          ) : (
            <button
              onClick={() => onToggleView?.('studio')}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#141924] hover:bg-[#1C2333] border border-white/[0.08] hover:border-white/20 text-slate-300 hover:text-white transition text-xs cursor-pointer font-medium"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#00DC82]" />
              <span>Studio</span>
            </button>
          )}

          {/* Quick Target Profile Button (visible in studio) */}
          {currentView === 'studio' && (
            <button
              onClick={onOpenProfile}
              title="Click to switch or edit target project profile"
              className="flex items-center space-x-2 px-2.5 sm:px-3 py-1 rounded-lg bg-[#12161F] hover:bg-[#181E2A] border border-white/[0.08] hover:border-white/20 transition cursor-pointer text-xs group"
            >
              <span className="text-slate-400 font-sans text-xs hidden md:inline">Project:</span>
              <span className="font-semibold text-slate-200 group-hover:text-white truncate max-w-[120px] sm:max-w-[160px]">
                {profile.name}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#00DC82] animate-pulse shrink-0" />
            </button>
          )}
        </div>

        {/* Center: Live DoraHacks Status Ticker (Desktop only) */}
        <div className="hidden lg:flex items-center space-x-3 text-xs text-slate-400 bg-[#0E121A] px-3.5 py-1.5 rounded-full border border-white/[0.06]">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#00DC82] animate-pulse" />
            <span className="text-slate-200 font-semibold">DoraHacks BUIDL Sync Active</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center space-x-1 text-cyan-400">
            <Sparkles className="w-3 h-3" />
            <span>Anna AI Builder Verified</span>
          </div>
        </div>

        {/* Right Actions Suite */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 text-xs shrink-0">
          {currentView === 'studio' ? (
            <>
              <button
                onClick={onRefreshFeed}
                disabled={isRefreshing}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#12161F] hover:bg-[#181E2A] text-slate-200 hover:text-white border border-white/[0.08] transition cursor-pointer disabled:opacity-50 font-medium"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#00DC82] ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isRefreshing ? 'Scanning...' : 'Sync Grants'}</span>
              </button>

              <button
                onClick={onOpenProfile}
                className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#12161F] hover:bg-[#181E2A] text-slate-200 hover:text-white border border-white/[0.08] transition cursor-pointer font-medium"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span>Profile</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => onToggleView?.('studio')}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-[#00DC82] hover:bg-[#00c776] text-[#07090C] font-extrabold transition shadow-[0_2px_12px_rgba(0,220,130,0.25)] hover:shadow-[0_4px_16px_rgba(0,220,130,0.4)] cursor-pointer"
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <a
            href="https://dorahacks.io/build"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#141924] hover:bg-[#1C2333] text-slate-300 hover:text-white border border-white/[0.08] font-semibold transition"
          >
            <span>DoraHacks</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>

      </div>
    </header>
  );
};
