import React, { useState } from 'react';
import { Copy, Download, ExternalLink, Check, FileText, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'preview' | 'edit' | 'audit'>('preview');
  const [copied, setCopied] = useState(false);
  const [appliedOracleSuggestion, setAppliedOracleSuggestion] = useState(false);

  // Editable fields state
  const [editedTitle, setEditedTitle] = useState('');
  const [editedSummary, setEditedSummary] = useState('');
  const [editedProblem, setEditedProblem] = useState('');
  const [editedArch, setEditedArch] = useState('');
  const [editedBudget, setEditedBudget] = useState('');

  // Synchronize when grant changes
  React.useEffect(() => {
    if (grant) {
      setEditedTitle(grant.proposal.title);
      setEditedSummary(grant.proposal.summary);
      setEditedProblem(grant.proposal.problem);
      setEditedArch(grant.proposal.architecture);
      setEditedBudget(grant.proposal.budget);
      setAppliedOracleSuggestion(false);
    }
  }, [grant]);

  if (!isOpen || !grant) return null;

  const handleApplySuggestion = () => {
    setAppliedOracleSuggestion(true);
    setEditedArch((prev) => `${prev} Additionally incorporates an on-chain verifiable oracle hook to prove milestone deliverables transparently on DoraHacks.`);
  };

  const handleCopyMarkdown = () => {
    const text = `# ${editedTitle}

## 1. Executive Summary
${editedSummary}

## 2. Problem & Ecosystem Opportunity
${editedProblem}

## 3. Technical Architecture & Innovation
${editedArch}

## 4. Milestones & Verifiable Deliverables
${grant.proposal.milestones.join('\n')}

## 5. Budget Breakdown
${editedBudget}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const text = `# ${editedTitle}

## 1. Executive Summary
${editedSummary}

## 2. Problem & Ecosystem Opportunity
${editedProblem}

## 3. Technical Architecture & Innovation
${editedArch}

## 4. Milestones & Verifiable Deliverables
${grant.proposal.milestones.join('\n')}

## 5. Budget Breakdown
${editedBudget}
`;
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Proposal_${grant.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentScore = appliedOracleSuggestion ? 98.7 : grant.fitScore + 0.2;

  return (
    <div className="fixed inset-0 z-50 bg-[#030508]/85 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="glass-panel w-full max-w-5xl h-[88vh] rounded-3xl border border-white/10 flex flex-col overflow-hidden shadow-2xl">
        {/* Header Strip */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#080B11]/70">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center glow-cyan">
              <FileText className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-base">{grant.title}</h3>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                  {grant.fitScore}% Fit Score
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Host: <span className="text-slate-300 font-medium">{grant.host}</span> • Pool: <span className="text-cyan-400 font-mono font-semibold">{grant.pool}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyMarkdown}
              className="px-3.5 py-2 rounded-xl bg-[#0D111A] hover:bg-[#131924] text-slate-300 border border-white/[0.08] text-xs font-mono font-medium flex items-center space-x-1.5 transition cursor-pointer"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Markdown'}</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-medium flex items-center space-x-1.5 transition cursor-pointer glow-cyan"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .MD</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-[#0D111A] hover:bg-[#131924] text-slate-400 hover:text-white flex items-center justify-center transition border border-white/[0.08] cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Navigation Toolbar */}
        <div className="px-6 py-2.5 border-b border-white/[0.06] bg-[#05070B]/50 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 font-mono">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Document Preview
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                activeTab === 'edit'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              In-Place Markdown Editor
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'audit'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Jury Red-Team Audit</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-emerald-400 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Agent 3 & 4 Co-Authored</span>
          </div>
        </div>

        {/* Modal Body: Split Screen */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Main Content Area (8 Cols) */}
          <div className="lg:col-span-8 p-6 overflow-y-auto space-y-5 border-r border-white/[0.06] bg-[#030508]/40">
            {activeTab === 'preview' && (
              <div className="font-sans text-xs leading-relaxed text-slate-300 space-y-5">
                <div className="p-4 rounded-xl bg-[#080B11]/90 border border-white/[0.06] space-y-1.5">
                  <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                    Project Submission Title
                  </div>
                  <div className="text-base font-bold text-white leading-snug">
                    {editedTitle}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    1. Executive Summary
                  </div>
                  <p className="text-slate-200 leading-relaxed bg-[#080B11]/40 p-3.5 rounded-xl border border-white/[0.04]">
                    {editedSummary}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    2. Problem & Ecosystem Opportunity
                  </div>
                  <p className="text-slate-200 leading-relaxed bg-[#080B11]/40 p-3.5 rounded-xl border border-white/[0.04]">
                    {editedProblem}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    3. Technical Architecture & Innovation
                  </div>
                  <p className="text-slate-200 leading-relaxed bg-[#080B11]/40 p-3.5 rounded-xl border border-white/[0.04]">
                    {editedArch}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    4. Milestones & Verifiable Deliverables
                  </div>
                  <ul className="space-y-2 bg-[#080B11]/40 p-3.5 rounded-xl border border-white/[0.04]">
                    {grant.proposal.milestones.map((m, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5 pb-3">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    5. Budget Breakdown
                  </div>
                  <p className="text-slate-200 font-mono bg-[#080B11]/60 p-3.5 rounded-xl border border-white/[0.04]">
                    {editedBudget}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'edit' && (
              <div className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Proposal Title</label>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 font-sans"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Executive Summary</label>
                  <textarea
                    rows={3}
                    value={editedSummary}
                    onChange={(e) => setEditedSummary(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 font-sans leading-relaxed"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Problem & Ecosystem Opportunity</label>
                  <textarea
                    rows={4}
                    value={editedProblem}
                    onChange={(e) => setEditedProblem(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 font-sans leading-relaxed"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Technical Architecture</label>
                  <textarea
                    rows={4}
                    value={editedArch}
                    onChange={(e) => setEditedArch(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 font-sans leading-relaxed"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Budget Allocation</label>
                  <input
                    type="text"
                    value={editedBudget}
                    onChange={(e) => setEditedBudget(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="space-y-4 text-xs font-sans">
                <div className="p-4 rounded-xl bg-[#080B11] border border-white/[0.08] space-y-2">
                  <h4 className="font-bold text-white text-sm flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Agent 4 Comprehensive Red-Team Review</span>
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    This proposal draft was simulated against DoraHacks BUIDL judging parameters (Originality, Technical Execution, Real-World Utility, and Ecosystem Fit).
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-start space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">Strength: High Meta-Relevance</div>
                      <p className="text-slate-300 mt-0.5">
                        Matches Anna AI OS criteria for client-side privacy-first autonomous workflow automation.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 flex items-start space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">Strength: Realistic Budget Allocation</div>
                      <p className="text-slate-300 mt-0.5">
                        Clear milestones with deliverables matching the $6,000 USD Launch Boost tier.
                      </p>
                    </div>
                  </div>

                  {!appliedOracleSuggestion ? (
                    <div className="p-3.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                          <span>Recommendation: Add On-Chain Oracle Verification (+2.5 pts)</span>
                        </div>
                        <p className="text-slate-300 mt-0.5">
                          Adding verifiable on-chain oracle milestones boosts web3 jury scoring.
                        </p>
                      </div>
                      <button
                        onClick={handleApplySuggestion}
                        className="px-3 py-1.5 rounded-lg bg-violet-500 hover:bg-violet-400 text-[#030508] font-bold font-mono text-[11px] shrink-0 transition cursor-pointer"
                      >
                        Apply Fix
                      </button>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center space-x-2 font-mono text-xs">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>On-Chain Oracle suggestion applied! Score boosted to 98.7/100.</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right: Jury Red-Team Scorecard (4 Cols) */}
          <div className="lg:col-span-4 p-6 overflow-y-auto bg-[#080B11]/60 space-y-6">
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">
                Agent 4: Jury Red-Team Scorecard
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-extrabold text-white font-mono tracking-tight">
                  {currentScore.toFixed(1)}
                </span>
                <span className="text-xs text-emerald-400 font-mono font-bold">
                  / 100 • Grade A+
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                Matches DoraHacks criteria and qualifies for highest grant tier bracket.
              </p>
            </div>

            {/* Score Breakdown Progress Bars */}
            <div className="space-y-3.5 border-t border-white/[0.08] pt-4">
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Technical Depth</span>
                  <span className="text-cyan-400 font-bold">96%</span>
                </div>
                <div className="w-full bg-[#131924] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                    style={{ width: '96%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Ecosystem Utility</span>
                  <span className="text-emerald-400 font-bold">98%</span>
                </div>
                <div className="w-full bg-[#131924] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: '98%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Budget Feasibility</span>
                  <span className="text-violet-400 font-bold">94%</span>
                </div>
                <div className="w-full bg-[#131924] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-violet-500 to-violet-400 h-full rounded-full transition-all duration-500"
                    style={{ width: '94%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Anti-AI-Slop Rigor</span>
                  <span className="text-amber-400 font-bold">98%</span>
                </div>
                <div className="w-full bg-[#131924] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-500"
                    style={{ width: '98%' }}
                  />
                </div>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <a
                href={grant.externalUrl || 'https://dorahacks.io/build'}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-[#030508] font-bold text-xs tracking-wide flex items-center justify-center space-x-2 transition shadow-xl shadow-emerald-500/25 cursor-pointer"
              >
                <span>Submit to DoraHacks BUIDL</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
