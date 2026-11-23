import React from 'react';
import { FileText } from 'lucide-react';
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
  return (
    <div
      onClick={onSelect}
      className={`glass-panel glass-panel-hover rounded-xl p-5 flex flex-col justify-between cursor-pointer border transition ${
        isSelected
          ? 'border-cyan-400 shadow-lg shadow-cyan-500/10'
          : 'border-white/[0.07]'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.05] text-slate-300 border border-white/[0.08]">
            {grant.host}
          </span>
          <span
            className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
              grant.fitScore >= 90
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
            }`}
          >
            {grant.fitScore}% Fit
          </span>
        </div>

        <h3 className="font-bold text-white text-sm mb-1.5 hover:text-cyan-300 transition">
          {grant.title}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 mb-3">
          {grant.summary}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {grant.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono text-slate-400 bg-[#080B11] px-1.5 py-0.5 rounded border border-white/[0.04]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-white/[0.06] pt-3 flex items-center justify-between text-xs">
        <div>
          <div className="text-[10px] text-slate-400 font-mono">
            Prize / Grant Pool
          </div>
          <div className="font-bold text-cyan-400 font-mono">{grant.pool}</div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDraftProposal();
          }}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-[#05070B] font-bold text-xs tracking-wide transition shadow-md shadow-cyan-500/10 flex items-center space-x-1.5 cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Draft Proposal</span>
        </button>
      </div>
    </div>
  );
};
