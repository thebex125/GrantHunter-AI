import React from 'react';
import type { ProjectProfile } from '../types/grant';
import { Layers, Sliders, CheckCircle2, DollarSign, Award } from 'lucide-react';

interface ProjectProfileBarProps {
  profile: ProjectProfile;
  onOpenModal: () => void;
}

export const ProjectProfileBar: React.FC<ProjectProfileBarProps> = ({
  profile,
  onOpenModal,
}) => {
  return (
    <div className="bg-gradient-to-r from-[#0C1017] via-[#0E131C] to-[#0A0D14] border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
      
      {/* Background subtle radial glow */}
      <div className="absolute top-0 right-0 w-80 h-full bg-[#00DC82]/5 blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
        
        {/* Left: Active Project Info & Tagline */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 w-full lg:w-auto">
          <div className="w-10 h-10 rounded-xl bg-[#00DC82]/10 border border-[#00DC82]/30 flex items-center justify-center text-[#00DC82] shrink-0">
            <Layers className="w-5 h-5" />
          </div>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Evaluation Target:
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {profile.name}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#00DC82]/12 text-[#00DC82] border border-[#00DC82]/25 text-xs font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                {profile.category}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mt-0.5 line-clamp-1 max-w-2xl leading-relaxed">
              {profile.tagline}
            </p>
          </div>
        </div>

        {/* Right: Stack Badge & Edit CTA */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-white/[0.06] pt-3 lg:pt-0">
          
          {/* Quick Metrics Pills */}
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#141924] border border-white/[0.06] text-slate-300">
              <DollarSign className="w-3.5 h-3.5 text-[#00DC82]" />
              <span className="font-semibold text-white">$136k+</span>
              <span className="text-slate-400">Pools</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#141924] border border-white/[0.06] text-slate-300">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold text-white">96%</span>
              <span className="text-slate-400">Top Fit</span>
            </div>
          </div>

          <button
            onClick={onOpenModal}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-[#141924] hover:bg-[#1C2333] text-slate-200 hover:text-white border border-white/[0.1] hover:border-white/20 transition cursor-pointer text-xs font-semibold shadow-sm ml-auto lg:ml-0"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span>Customize Stack & Profile</span>
          </button>
        </div>

      </div>

    </div>
  );
};
