import React from 'react';
import type { ProjectProfile } from '../types/grant';
import { Layers, Cpu, Sliders } from 'lucide-react';

interface ProjectProfileBarProps {
  profile: ProjectProfile;
  onOpenModal: () => void;
}

export const ProjectProfileBar: React.FC<ProjectProfileBarProps> = ({
  profile,
  onOpenModal,
}) => {
  return (
    <div className="bg-[#0D1016] border border-white/[0.08] rounded-xl px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
      
      {/* Target Project Info */}
      <div className="flex items-center space-x-3.5">
        <div className="flex items-center space-x-2 text-slate-200">
          <Layers className="w-4 h-4 text-[#00DC82]" />
          <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider">Evaluation Target:</span>
          <span className="font-bold text-white text-sm">{profile.name}</span>
        </div>

        <span className="text-slate-700 hidden sm:inline">•</span>

        <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-white/[0.06] text-slate-300 text-[11px] font-mono">
          {profile.category}
        </span>
      </div>

      {/* Stack & Edit Button */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
          <Cpu className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-500">Active Stack:</span>
          <span className="text-slate-300 font-sans truncate max-w-[380px]">
            {profile.stack}
          </span>
        </div>

        <button
          onClick={onOpenModal}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-[#13161C] hover:bg-[#181D26] text-slate-300 hover:text-white border border-white/[0.08] transition text-xs font-mono cursor-pointer"
        >
          <Sliders className="w-3 h-3 text-slate-400" />
          <span>Edit Profile</span>
        </button>
      </div>

    </div>
  );
};
