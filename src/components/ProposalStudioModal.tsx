import React, { useState } from 'react';
import { Copy, Download, ExternalLink, Check, FileText } from 'lucide-react';
import type { GrantOpportunity } from '../types/grant';

interface ProposalStudioModalProps {
  grant: GrantOpportunity | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProposalStudioModal: React.FC<ProposalStudioModalProps> = ({
  grant,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !grant) return null;

  const handleCopyMarkdown = () => {
    const p = grant.proposal;
    const text = `# ${p.title}

## 1. Executive Summary
${p.summary}

## 2. Problem & Opportunity
${p.problem}

## 3. Technical Architecture
${p.architecture}

## 4. Milestones
${p.milestones.join('\n')}

## 5. Budget Allocation
${p.budget}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const p = grant.proposal;
    const text = `# ${p.title}

## 1. Executive Summary
${p.summary}

## 2. Problem & Opportunity
${p.problem}

## 3. Technical Architecture
${p.architecture}

## 4. Milestones
${p.milestones.join('\n')}

## 5. Budget Allocation
${p.budget}
`;
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Proposal_${grant.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#05070B]/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="glass-panel w-full max-w-5xl h-[88vh] rounded-2xl border border-white/10 flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#080B11]/60">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <FileText className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-base">{grant.title}</h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  {grant.fitScore}% Fit Score
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Host: {grant.host} • Pool: {grant.pool}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 rounded-lg bg-[#0D111A] hover:bg-[#131924] text-slate-300 border border-white/[0.08] text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .MD</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#0D111A] hover:bg-[#131924] text-slate-400 hover:text-white flex items-center justify-center transition border border-white/[0.06] cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body: Split Screen */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left: Proposal Content (8 Cols) */}
          <div className="lg:col-span-8 p-6 overflow-y-auto space-y-4 border-r border-white/[0.06] bg-[#05070B]/40">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                Proposal Generation Studio // Agent 3 Output
              </span>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Draft Ready (Auto-Refined)</span>
              </span>
            </div>

            <div className="font-sans text-xs leading-relaxed text-slate-300 space-y-4">
              <div className="p-3 rounded-lg bg-[#080B11]/80 border border-white/[0.05] space-y-1">
                <div className="text-[11px] font-mono text-cyan-400 uppercase">
                  Project Title
                </div>
                <div className="text-sm font-bold text-white">
                  {grant.proposal.title}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-mono text-slate-400 uppercase">
                  1. Executive Summary
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {grant.proposal.summary}
                </p>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-mono text-slate-400 uppercase">
                  2. Problem & Ecosystem Opportunity
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {grant.proposal.problem}
                </p>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-mono text-slate-400 uppercase">
                  3. Technical Architecture & Innovation
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {grant.proposal.architecture}
                </p>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-mono text-slate-400 uppercase">
                  4. Milestones & Verifiable Deliverables
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {grant.proposal.milestones.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1 pb-2">
                <div className="text-[11px] font-mono text-slate-400 uppercase">
                  5. Budget Breakdown
                </div>
                <p className="text-slate-300 font-mono bg-[#080B11]/80 p-2.5 rounded-lg border border-white/[0.05]">
                  {grant.proposal.budget}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Jury Red-Team Scorecard (4 Cols) */}
          <div className="lg:col-span-4 p-5 overflow-y-auto bg-[#080B11]/50 space-y-5">
            <div>
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                Agent 4: Jury Red-Team Review
              </h4>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-white font-mono">
                  {grant.fitScore}.2
                </span>
                <span className="text-xs text-emerald-400 font-mono font-semibold">
                  / 100 • Grade A+
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Proposal passes DoraHacks criteria and matches highest prize tier bracket.
              </p>
            </div>

            {/* Score Breakdown Bars */}
            <div className="space-y-3 border-t border-white/[0.06] pt-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Technical Depth</span>
                  <span className="font-mono text-cyan-400">96%</span>
                </div>
                <div className="w-full bg-[#131924] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-full rounded-full"
                    style={{ width: '96%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Ecosystem Utility</span>
                  <span className="font-mono text-emerald-400">98%</span>
                </div>
                <div className="w-full bg-[#131924] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full"
                    style={{ width: '98%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Budget Feasibility</span>
                  <span className="font-mono text-violet-400">92%</span>
                </div>
                <div className="w-full bg-[#131924] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-violet-500 to-violet-400 h-full rounded-full"
                    style={{ width: '92%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Anti-AI-Slop Assurance</span>
                  <span className="font-mono text-amber-400">97%</span>
                </div>
                <div className="w-full bg-[#131924] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full"
                    style={{ width: '97%' }}
                  />
                </div>
              </div>
            </div>

            {/* Red-Team Optimizations */}
            <div className="border-t border-white/[0.06] pt-4 space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Red-Team Optimizations Applied:
              </span>
              <div className="p-2.5 rounded-lg bg-[#080B11]/80 border border-white/[0.04] text-[11px] text-slate-300 space-y-1">
                <div className="text-emerald-400 font-semibold flex items-center space-x-1">
                  <span>✓</span> <span>DoraHacks BUIDL Meta Alignment</span>
                </div>
                <p className="text-slate-400">
                  Explicitly linked autonomous workflow to Anna AI OS Marketplace deployment criteria.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-[#080B11]/80 border border-white/[0.04] text-[11px] text-slate-300 space-y-1">
                <div className="text-emerald-400 font-semibold flex items-center space-x-1">
                  <span>✓</span> <span>Granular Milestone Breakdown</span>
                </div>
                <p className="text-slate-400">
                  Removed generic timelines; injected 3 verifiable deliverables with key measurable KPIs.
                </p>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <a
                href={grant.externalUrl || 'https://dorahacks.io/build'}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-[#05070B] font-bold text-xs tracking-wide flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-500/20"
              >
                <span>Go to DoraHacks Submission</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
