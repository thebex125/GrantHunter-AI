import React from 'react';
import { FileText, Clock, Award, ArrowUpRight } from 'lucide-react';
import type { GrantOpportunity } from '../types/grant';

interface OpportunityCardProps {
  grant: GrantOpportunity;
  isSelected: boolean;
  onSelect: () => void;
  onDraftProposal: () => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  grant,
  isSelected,
  onSelect,
  onDraftProposal,
}) => {
  const isPrimaryMatch = grant.id === 'anna-ai';

  return (
    <div
      onClick={onSelect}
      className={`glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between cursor-pointer border transition relative overflow-hidden ${
        isPrimaryMatch ? 'border-beam' : ''
      } ${
        isSelected
          ? 'border-cyan-400 shadow-xl shadow-cyan-500/15'
          : 'border-white/[0.08]'
      }`}
    >
      {/* Featured Badge for Primary Match */}
      {isPrimaryMatch && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500 via-teal-500 to-transparent px-3 py-1 text-[9px] font-mono font-extrabold text-[#030508] uppercase tracking-wider rounded-bl-xl shadow">
          ★ Primary Hackathon Target
        </div>
      )}

      <div>
        {/* Top Meta Strip */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/[0.06] text-slate-300 border border-white/[0.08]">
              {grant.host}
            </span>
            <div className="flex items-center space-x-1 text-[10px] font-mono text-slate-400">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{grant.deadline}</span>
            </div>
          </div>

          <div
            className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1 ${
              grant.fitScore >= 90
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 glow-emerald'
                : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{grant.fitScore}% Fit</span>
          </div>
        </div>

        {/* Title & Summary */}
        <h3 className="font-bold text-white text-base mb-2 group-hover:text-cyan-300 transition leading-snug">
          {grant.title}
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
          {grant.summary}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {grant.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono text-slate-400 bg-[#080B11] px-2 py-0.5 rounded-md border border-white/[0.05]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="border-t border-white/[0.06] pt-4 flex items-center justify-between text-xs">
        <div>
          <div className="text-[10px] text-slate-400 font-mono">Grant / Prize Pool</div>
          <div className="font-extrabold text-cyan-400 font-mono text-sm tracking-tight">
            {grant.pool}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDraftProposal();
          }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-[#030508] font-bold text-xs tracking-wide transition shadow-lg shadow-cyan-500/15 flex items-center space-x-1.5 cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Draft Proposal</span>
          <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
        </button>
      </div>
    </div>
  );
};
