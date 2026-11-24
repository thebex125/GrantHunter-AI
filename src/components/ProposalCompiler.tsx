import React, { useState, useEffect, useMemo } from 'react';
import type { GrantOpportunity, GrantProposal, ProjectProfile } from '../types/grant';
import { ProposalArchitectService } from '../services/proposalArchitect';
import { JuryCriticService } from '../services/juryCritic';
import {
  Copy,
  Download,
  ExternalLink,
  Check,
  Eye,
  Edit3,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  RotateCcw,
  TrendingUp
} from 'lucide-react';

interface ProposalCompilerProps {
  grant: GrantOpportunity | null;
  profile?: ProjectProfile;
  onUpdateProposal?: (proposal: GrantProposal) => void;
}

export const ProposalCompiler: React.FC<ProposalCompilerProps> = ({
  grant,
  profile,
  onUpdateProposal
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'edit' | 'audit'>('preview');
  const [copied, setCopied] = useState(false);

  // In-place editable state
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [problem, setProblem] = useState('');
  const [architecture, setArchitecture] = useState('');
  const [budget, setBudget] = useState('');
  const [milestones, setMilestones] = useState<string[]>([]);

  useEffect(() => {
    if (grant) {
      setTitle(grant.proposal.title);
      setSummary(grant.proposal.summary);
      setProblem(grant.proposal.problem);
      setArchitecture(grant.proposal.architecture);
      setBudget(grant.proposal.budget);
      setMilestones(grant.proposal.milestones || []);
    }
  }, [grant]);

  // Construct current live proposal object
  const currentProposal: GrantProposal = useMemo(() => ({
    title,
    summary,
    problem,
    architecture,
    milestones,
    budget
  }), [title, summary, problem, architecture, milestones, budget]);

  // Generate live red-team audit report with JuryCriticService
  const auditReport = useMemo(() => {
    if (!grant) return null;
    const activeProfile: ProjectProfile = profile || {
      name: 'GrantHunter Builder',
      tagline: 'Autonomous Grant Intelligence Matrix',
      stack: 'React 19, TypeScript, Tailwind CSS, Anna OS',
      category: 'AI-Native Productivity',
      stage: 'Working MVP / Production-Ready'
    };
    return JuryCriticService.auditProposal(currentProposal, grant, activeProfile);
  }, [currentProposal, grant, profile]);

  if (!grant) {
    return (
      <div className="bg-[#0B0E14] border border-white/[0.08] rounded-2xl lg:h-[calc(100vh-220px)] flex flex-col items-center justify-center text-center p-8 text-slate-400">
        <AlertCircle className="w-8 h-8 text-slate-500 mb-3 opacity-60" />
        <h3 className="text-base font-bold text-white mb-1">No Grant Selected</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
          Select an opportunity from the feed on the left to compile and inspect its custom proposal draft.
        </p>
      </div>
    );
  }

  const getFullMarkdown = () => {
    return ProposalArchitectService.compileToMarkdown(currentProposal, grant);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getFullMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([getFullMarkdown()], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Proposal_${grant.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetToAIDraft = () => {
    if (profile && grant) {
      const freshDraft = ProposalArchitectService.generateProposal(profile, grant);
      setTitle(freshDraft.title);
      setSummary(freshDraft.summary);
      setProblem(freshDraft.problem);
      setArchitecture(freshDraft.architecture);
      setBudget(freshDraft.budget);
      setMilestones(freshDraft.milestones);
      onUpdateProposal?.(freshDraft);
    }
  };

  const handleSaveInPlace = () => {
    onUpdateProposal?.(currentProposal);
    setActiveTab('preview');
  };

  return (
    <div className="bg-[#0B0E14] border border-white/[0.08] rounded-2xl flex flex-col lg:h-[calc(100vh-220px)] shadow-xl overflow-hidden transition-all">
      
      {/* Top Workstation Header Bar */}
      <div className="px-5 sm:px-6 py-4 border-b border-white/[0.08] bg-[#0E121A]/80 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        
        {/* Target Grant Meta */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Target Grant:
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {grant.title}
            </h2>
            <span className="px-2 py-0.5 rounded-md bg-[#00DC82]/15 text-[#00DC82] border border-[#00DC82]/30 font-bold text-xs">
              {grant.fitScore}% Fit
            </span>
          </div>

          <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2">
            <span>Host: <strong className="text-slate-200">{grant.host}</strong></span>
            <span>•</span>
            <span>Pool: <strong className="text-[#00DC82]">{grant.pool}</strong></span>
            <span>•</span>
            <span>Deadline: <strong className="text-slate-200">{grant.deadline}</strong></span>
          </div>
        </div>

        {/* View Switcher & Action Tools */}
        <div className="flex items-center space-x-2 shrink-0">
          
          {/* Tab buttons */}
          <div className="flex items-center p-1 rounded-xl bg-[#141924] border border-white/[0.08] text-xs">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition font-semibold cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-[#00DC82] text-[#07090C] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition font-semibold cursor-pointer ${
                activeTab === 'edit'
                  ? 'bg-[#00DC82] text-[#07090C] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editor</span>
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition font-semibold cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-[#00DC82] text-[#07090C] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Jury Audit</span>
            </button>
          </div>

          {/* Quick Copy / Download */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleCopy}
              title="Copy Full Proposal Markdown (Ctrl+C)"
              className="p-2 rounded-xl bg-[#141924] hover:bg-[#1C2333] border border-white/[0.08] hover:border-white/20 text-slate-300 hover:text-white transition cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-[#00DC82]" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handleDownload}
              title="Download as Markdown File"
              className="p-2 rounded-xl bg-[#141924] hover:bg-[#1C2333] border border-white/[0.08] hover:border-white/20 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Main Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
        
        {/* Tab 1: Structured Preview */}
        {activeTab === 'preview' && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Header / Title Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0E121A] border border-white/[0.08] relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                    <Sparkles className="w-3 h-3 text-[#00DC82]" />
                    <span>DoraHacks BUIDL Proposal Draft</span>
                  </span>
                  <h1 className="text-lg sm:text-xl font-bold text-white leading-snug">
                    {title}
                  </h1>
                </div>

                {grant.externalUrl && (
                  <a
                    href={grant.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-xs text-[#00DC82] hover:underline shrink-0"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Section 1: Executive Summary */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center space-x-2">
                  <span className="text-[#00DC82]">01.</span>
                  <span>Executive Summary</span>
                </h3>
                <span className="text-xs text-[#00DC82] font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Thesis Aligned</span>
                </span>
              </div>
              <p className="text-sm sm:text-[14.5px] leading-relaxed text-slate-200 bg-[#0E121A] p-4 sm:p-5 rounded-2xl border border-white/[0.06]">
                {summary}
              </p>
            </div>

            {/* Section 2: Problem & Ecosystem Opportunity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center space-x-2">
                  <span className="text-[#00DC82]">02.</span>
                  <span>Problem & Ecosystem Opportunity</span>
                </h3>
                <span className="text-xs text-[#00DC82] font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Validated Friction</span>
                </span>
              </div>
              <p className="text-sm sm:text-[14.5px] leading-relaxed text-slate-200 bg-[#0E121A] p-4 sm:p-5 rounded-2xl border border-white/[0.06]">
                {problem}
              </p>
            </div>

            {/* Section 3: Technical Architecture */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center space-x-2">
                  <span className="text-[#00DC82]">03.</span>
                  <span>Technical Architecture & Innovation</span>
                </h3>
                <span className="text-xs text-cyan-400 font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Zero Leakage</span>
                </span>
              </div>
              <p className="text-sm sm:text-[14.5px] leading-relaxed text-slate-200 bg-[#0E121A] p-4 sm:p-5 rounded-2xl border border-white/[0.06]">
                {architecture}
              </p>
            </div>

            {/* Section 4: Milestones & Deliverables */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center space-x-2">
                  <span className="text-[#00DC82]">04.</span>
                  <span>Milestones & Verifiable Deliverables</span>
                </h3>
                <span className="text-xs text-[#00DC82] font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>3 Gates Defined</span>
                </span>
              </div>
              <div className="space-y-2.5">
                {milestones.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#0E121A] border border-white/[0.06] flex items-start space-x-3.5 text-sm leading-relaxed text-slate-200"
                  >
                    <span className="w-6 h-6 rounded-lg bg-[#00DC82]/15 border border-[#00DC82]/30 text-[#00DC82] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Budget Allocation */}
            <div className="space-y-2 pb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center space-x-2">
                  <span className="text-[#00DC82]">05.</span>
                  <span>Itemized Budget Allocation</span>
                </h3>
                <span className="text-xs text-[#00DC82] font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Matches {grant.pool}</span>
                </span>
              </div>
              <div className="bg-[#0E121A] p-4 sm:p-5 rounded-2xl border border-white/[0.06] text-sm text-slate-200 leading-relaxed font-mono">
                {budget}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: In-Place Editor */}
        {activeTab === 'edit' && (
          <div className="max-w-3xl mx-auto space-y-5 text-xs sm:text-sm">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <h3 className="font-bold text-white text-base">In-Place Proposal Studio</h3>
                <p className="text-xs text-slate-400">Edit sections directly to customize your submission draft.</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleResetToAIDraft}
                  className="px-3 py-1.5 rounded-xl bg-[#141924] hover:bg-[#1C2333] border border-white/[0.08] text-xs text-slate-300 hover:text-white transition flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3 text-[#00DC82]" />
                  <span>Re-Generate AI Draft</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveInPlace}
                  className="px-4 py-1.5 rounded-xl bg-[#00DC82] hover:bg-[#00c776] text-[#07090C] font-bold text-xs transition shadow-sm"
                >
                  Save & Preview
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Proposal Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0E121A] border border-white/[0.08] text-white focus:outline-none focus:border-[#00DC82] text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Executive Summary</label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0E121A] border border-white/[0.08] text-white focus:outline-none focus:border-[#00DC82] text-xs sm:text-sm leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Problem & Ecosystem Opportunity</label>
              <textarea
                rows={4}
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0E121A] border border-white/[0.08] text-white focus:outline-none focus:border-[#00DC82] text-xs sm:text-sm leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Technical Architecture</label>
              <textarea
                rows={4}
                value={architecture}
                onChange={(e) => setArchitecture(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0E121A] border border-white/[0.08] text-white focus:outline-none focus:border-[#00DC82] text-xs sm:text-sm leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Itemized Budget Allocation</label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0E121A] border border-white/[0.08] text-white focus:outline-none focus:border-[#00DC82] text-xs sm:text-sm"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Dynamic Red-Team Jury Audit Rubric */}
        {activeTab === 'audit' && auditReport && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Top Score Banner */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0E121A] border border-white/[0.08] space-y-2 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#00DC82]" />
                  <span>DoraHacks 2026 Red-Team Scoring Audit</span>
                </span>
                <span className="font-extrabold text-[#00DC82] text-base sm:text-lg">
                  {auditReport.overallScore} / {auditReport.maxPossibleScore} • Grade {auditReport.grade}
                </span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {auditReport.verdict}
              </p>
            </div>

            {/* Rubrics breakdown */}
            <div className="space-y-3">
              {auditReport.rubrics.map((rubric) => (
                <div
                  key={rubric.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#0E121A] border border-white/[0.06] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">{rubric.category}</h4>
                    <span className="font-mono font-bold text-[#00DC82] text-sm sm:text-base shrink-0">
                      {rubric.assignedScore} / {rubric.maxScore}
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {rubric.strengths}
                  </p>
                  <div className="pt-2 border-t border-white/[0.04] text-[11px] text-cyan-300 flex items-start space-x-1.5">
                    <TrendingUp className="w-3.5 h-3.5 shrink-0 mt-0.5 text-cyan-400" />
                    <span><strong>Jury Tip:</strong> {rubric.recommendation}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Actionable recommendations */}
            <div className="p-5 rounded-2xl bg-[#141924] border border-white/[0.08] space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#00DC82] flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Critical Pre-Submit Checkpoints</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {auditReport.criticalImprovements.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-[#00DC82] font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
