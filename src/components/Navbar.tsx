import React from 'react';
import { Shield, ExternalLink, RotateCcw } from 'lucide-react';
import type { ProjectProfile } from '../types/grant';

interface NavbarProps {
  profile: ProjectProfile;
  onOpenProfile: () => void;
  onRefreshFeed: () => void;
  isRefreshing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  onOpenProfile,
  onRefreshFeed,
  isRefreshing,
}) => {
  return (
    <header className="border-b border-white/[0.08] bg-[#0E1015] px-5 py-3 sticky top-0 z-50">
      <div className="max-w-[1520px] mx-auto flex items-center justify-between">
        
        {/* Brand & Breadcrumb */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-2 font-mono font-semibold text-white">
            <div className="w-6 h-6 rounded-md bg-[#00DC82]/10 border border-[#00DC82]/30 flex items-center justify-center text-[#00DC82]">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-bold tracking-tight">GrantHunter</span>
          </div>

          <span className="text-slate-600">/</span>

          <div
            onClick={onOpenProfile}
            className="flex items-center space-x-2 px-2.5 py-1 rounded bg-[#13161C] border border-white/[0.06] hover:border-white/20 transition cursor-pointer text-slate-300 hover:text-white"
          >
            <span className="text-slate-500 font-mono text-[11px]">project:</span>
            <span className="font-semibold">{profile.name}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00DC82]" />
          </div>
        </div>

        {/* Center: System Status */}
        <div className="hidden md:flex items-center space-x-3 text-xs font-mono text-slate-400">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00DC82]" />
            <span className="text-slate-300">DoraHacks API Connected</span>
          </span>
          <span className="text-slate-600">•</span>
          <span>4 Autonomous Agents Ready</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2.5 text-xs">
          <button
            onClick={onRefreshFeed}
            disabled={isRefreshing}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#13161C] hover:bg-[#181C24] text-slate-300 hover:text-white border border-white/[0.08] transition font-mono cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#00DC82]' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Feeds'}</span>
          </button>

          <a
            href="https://dorahacks.io/build"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#00DC82] hover:bg-[#00c776] text-[#08090B] font-semibold transition font-mono shadow-sm cursor-pointer"
          >
            <span>DoraHacks BUIDL</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </header>
  );
};
