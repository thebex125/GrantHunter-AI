import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GrantOpportunity, GrantProposal, ProjectProfile } from '../types/grant';
import { ProposalArchitectService } from '../services/proposalArchitect';
import { JuryCriticService } from '../services/juryCritic';
import {
  Copy,
  Download,
  ArrowUpRight,
  Check,
  FileText,
  Edit3,
  Scale,
  RotateCcw,
} from 'lucide-react';

interface ProposalCompilerProps {
  grant: GrantOpportunity | null;
  profile?: ProjectProfile;
  onUpdateProposal?: (proposal: GrantProposal) => void;
}

interface ParsedBudgetRow {
  item: string;
  amountFormatted: string;
  numericValue: number;
  percentage: number;
}

function parseBudgetRows(rawBudget: string): { rows: ParsedBudgetRow[]; totalFormatted: string } {
  const segments = rawBudget
    .split(/[•|;\n]/)
    .map((s) => s.trim().replace(/\.$/, ''))
    .filter(Boolean);

  const extracted = segments.map((seg) => {
    const match = seg.match(/^(\$[\d,]+(?:\.\d+)?[kK]?)\s+(.+)$/);
    if (match) {
      const amountStr = match[1];
      const label = match[2];
      let num = parseFloat(amountStr.replace(/[$,kK]/g, '')) || 0;
      if (amountStr.toLowerCase().endsWith('k')) num *= 1000;
      return { item: label, amountFormatted: amountStr, numericValue: num };
    }
    return { item: seg, amountFormatted: 'Included', numericValue: 0 };
  });

  const total = extracted.reduce((acc, r) => acc + r.numericValue, 0);
  const rows: ParsedBudgetRow[] = extracted.map((r) => ({
    ...r,
    percentage: total > 0 ? Math.round((r.numericValue / total) * 100) : 0,
  }));

  return {
    rows,
    totalFormatted: total > 0 ? `$${total.toLocaleString('en-US')} USD` : 'Allocated per Pool',
  };
}

function parseMilestone(raw: string, idx: number): { phase: string; deliverable: string } {
  const colonIdx = raw.indexOf(':');
  if (colonIdx !== -1 && colonIdx < 42) {
    return {
      phase: raw.slice(0, colonIdx).trim(),
      deliverable: raw.slice(colonIdx + 1).trim(),
    };
  }
  return {
    phase: `Phase 0${idx + 1}`,
    deliverable: raw,
  };
}

export const ProposalCompiler: React.FC<ProposalCompilerProps> = ({
  grant,
  profile,
  onUpdateProposal
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'edit' | 'audit'>('preview');
  const [copied, setCopied] = useState(false);

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

  const currentProposal: GrantProposal = useMemo(() => ({
    title,
    summary,
    problem,
    architecture,
    milestones,
    budget
  }), [title, summary, problem, architecture, milestones, budget]);

  const auditReport = useMemo(() => {
    if (!grant) return null;
    const activeProfile: ProjectProfile = profile || {
      name: 'AutoBrief AI',
      tagline: 'Autonomous Meeting Intelligence & Execution Matrix',
      stack: 'React 18, TypeScript, Tailwind CSS, Anna AI OS',
      category: 'AI-Native Productivity',
      stage: 'Working MVP / Production-Ready'
    };
    return JuryCriticService.auditProposal(currentProposal, grant, activeProfile);
  }, [currentProposal, grant, profile]);

  const parsedBudget = useMemo(() => parseBudgetRows(budget), [budget]);

  const stackList = useMemo(() => {
    if (!profile?.stack) return [];
    return profile.stack.split(',').map((s) => s.trim()).filter(Boolean);
  }, [profile]);

  if (!grant) {
    return (
      <div className="bg-[#111114]/95 border border-zinc-800/85 rounded-2xl lg:h-[calc(100vh-88px)] flex flex-col items-center justify-center text-center p-8">
        <FileText className="w-6 h-6 text-zinc-600 mb-2" />
        <h3 className="text-sm font-semibold text-zinc-200">No Grant Program Selected</h3>
        <p className="text-xs text-zinc-500 max-w-xs mt-1">
          Select an opportunity from the master feed on the left to review and compile its technical specification.
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

  const tabs = [
    { id: 'preview', label: 'Specification', icon: FileText },
    { id: 'edit', label: 'Edit', icon: Edit3 },
    { id: 'audit', label: `Rubric (${auditReport?.overallScore || 94})`, icon: Scale },
  ] as const;

  return (
    <div className="relative bg-[#111114]/95 border border-zinc-800/85 rounded-2xl flex flex-col lg:h-[calc(100vh-88px)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] overflow-hidden">
      {/* Obsidian UI 1px top specular highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Top Document Toolbar */}
      <div className="px-4 sm:px-6 py-3 border-b border-zinc-800/80 bg-zinc-950/60 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Breadcrumb & Match Summary */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-code font-semibold text-zinc-400 uppercase tracking-wider truncate">
            {grant.host}
          </span>
          <span className="text-zinc-700">/</span>
          <span className="text-xs font-semibold text-zinc-100 truncate">
            {grant.title}
          </span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-code font-semibold bg-emerald-500/12 text-emerald-400 border border-emerald-500/25">
            {grant.fitScore}% match
          </span>
        </div>

        {/* Right: Motion.dev Shared-Layout Mode Switcher & Export Actions */}
        <div className="flex items-center gap-2 ml-auto">
          
          <div className="flex items-center p-0.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition font-medium cursor-pointer"
                >
                  {isActive && (
                    <motion.div
                      layoutId="proposal-mode-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 rounded-lg bg-zinc-100 shadow-xs"
                    />
                  )}
                  <Icon
                    className={`w-3.5 h-3.5 relative z-10 ${
                      isActive ? 'text-zinc-950' : 'text-zinc-400'
                    }`}
                  />
                  <span
                    className={`relative z-10 ${
                      isActive ? 'text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            title="Copy Markdown to Clipboard"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-medium transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden sm:inline">Copy .md</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            title="Download Markdown File"
            className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-100 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

        </div>
      </div>

      {/* Main Document Canvas with AnimatePresence */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: EDITORIAL PROPOSAL SPECIFICATION DOSSIER */}
          {activeTab === 'preview' && (
            <motion.article
              key="preview"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-[780px] mx-auto px-5 sm:px-10 py-7 sm:py-9 space-y-8"
            >
              
              {/* Dossier Header */}
              <header className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-zinc-400 font-code">
                    <span>GRANT DOSSIER</span>
                    <span>•</span>
                    <span>APPLICANT: <strong className="text-zinc-200">{profile?.name || 'AutoBrief AI'}</strong></span>
                  </div>

                  {grant.externalUrl && (
                    <a
                      href={grant.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                    >
                      <span>Official Portal</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight leading-snug">
                  {title}
                </h1>

                {/* 4-Column Specification Metadata Table */}
                <div className="grid grid-cols-2 sm:grid-cols-4 border border-zinc-800/90 rounded-xl divide-y sm:divide-y-0 sm:divide-x divide-zinc-800/90 bg-zinc-950/70">
                  <div className="p-3">
                    <div className="text-[10.5px] font-code uppercase text-zinc-500">Funding Pool</div>
                    <div className="text-xs font-bold text-zinc-100 font-code mt-0.5 truncate">{grant.pool}</div>
                  </div>
                  <div className="p-3">
                    <div className="text-[10.5px] font-code uppercase text-zinc-500">Window</div>
                    <div className="text-xs font-semibold text-zinc-200 font-code mt-0.5">{grant.deadline}</div>
                  </div>
                  <div className="p-3">
                    <div className="text-[10.5px] font-code uppercase text-zinc-500">Cosine Fit</div>
                    <div className="text-xs font-bold text-emerald-400 font-code mt-0.5">
                      {grant.fitScore}/100 ({grant.fitGrade})
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="text-[10.5px] font-code uppercase text-zinc-500">Vector Split</div>
                    <div className="text-[11px] font-code text-zinc-300 mt-0.5">
                      {grant.fitBreakdown
                        ? `T:${grant.fitBreakdown.techStackScore} E:${grant.fitBreakdown.ecosystemScore} M:${grant.fitBreakdown.milestoneScore}`
                        : '40 / 30 / 30'}
                    </div>
                  </div>
                </div>
              </header>

              {/* Section: Executive Summary */}
              <section className="pt-6 border-t border-zinc-800/80 space-y-2">
                <h2 className="text-[11px] font-code font-bold uppercase tracking-wider text-zinc-500">
                  Executive Summary
                </h2>
                <p className="text-sm sm:text-[14.5px] leading-[1.72] text-zinc-300">
                  {summary}
                </p>
              </section>

              {/* Section: Problem & Market Friction */}
              <section className="pt-6 border-t border-zinc-800/80 space-y-2.5">
                <h2 className="text-[11px] font-code font-bold uppercase tracking-wider text-zinc-500">
                  Problem Statement & Ecosystem Gap
                </h2>
                <div className="border-l-2 border-emerald-400 pl-4 py-0.5">
                  <p className="text-sm sm:text-[14.5px] leading-[1.72] text-zinc-300">
                    {problem}
                  </p>
                </div>
              </section>

              {/* Section: Technical Architecture */}
              <section className="pt-6 border-t border-zinc-800/80 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-[11px] font-code font-bold uppercase tracking-wider text-zinc-500">
                    Technical Architecture & Implementation
                  </h2>
                  {stackList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {stackList.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-300 border border-zinc-800 text-[11px] font-code"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-sm sm:text-[14.5px] leading-[1.72] text-zinc-300">
                  {architecture}
                </p>
              </section>

              {/* Section: Delivery Milestones Table */}
              <section className="pt-6 border-t border-zinc-800/80 space-y-3">
                <h2 className="text-[11px] font-code font-bold uppercase tracking-wider text-zinc-500">
                  Execution Roadmap & Verification Gates
                </h2>

                <div className="border border-zinc-800/90 rounded-xl overflow-hidden bg-zinc-950/60">
                  <table className="w-full text-left border-collapse text-xs sm:text-[13.5px]">
                    <thead>
                      <tr className="bg-zinc-900/80 border-b border-zinc-800 text-[10.5px] font-code font-semibold uppercase tracking-wider text-zinc-400">
                        <th className="py-2.5 px-4 w-44">Phase / Gate</th>
                        <th className="py-2.5 px-4">Verifiable Deliverable</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/70">
                      {milestones.map((m, idx) => {
                        const parsed = parseMilestone(m, idx);
                        return (
                          <tr key={idx} className="align-top">
                            <td className="py-3 px-4 font-semibold text-emerald-400 whitespace-nowrap font-code text-xs">
                              {parsed.phase}
                            </td>
                            <td className="py-3 px-4 text-zinc-300 leading-relaxed">
                              {parsed.deliverable}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section: Structured Budget Breakdown Table */}
              <section className="pt-6 border-t border-zinc-800/80 space-y-3 pb-4">
                <h2 className="text-[11px] font-code font-bold uppercase tracking-wider text-zinc-500">
                  Budget & Capital Allocation
                </h2>

                <div className="border border-zinc-800/90 rounded-xl overflow-hidden bg-zinc-950/60">
                  <table className="w-full text-left border-collapse text-xs sm:text-[13.5px]">
                    <thead>
                      <tr className="bg-zinc-900/80 border-b border-zinc-800 text-[10.5px] font-code font-semibold uppercase tracking-wider text-zinc-400">
                        <th className="py-2.5 px-4">Workstream / Cost Center</th>
                        <th className="py-2.5 px-4 w-36 hidden sm:table-cell">Share</th>
                        <th className="py-2.5 px-4 text-right w-32">Allocation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/70">
                      {parsedBudget.rows.map((row, idx) => (
                        <tr key={idx}>
                          <td className="py-2.5 px-4 font-medium text-zinc-200">
                            {row.item}
                          </td>
                          <td className="py-2.5 px-4 hidden sm:table-cell">
                            {row.percentage > 0 && (
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-400 rounded-full"
                                    style={{ width: `${row.percentage}%` }}
                                  />
                                </div>
                                <span className="text-[11px] font-code text-zinc-400">
                                  {row.percentage}%
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-right font-code font-semibold text-zinc-100">
                            {row.amountFormatted}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-zinc-900/90 border-t border-zinc-800 font-semibold text-zinc-100">
                        <td className="py-2.5 px-4 text-[11px] font-code uppercase tracking-wider text-zinc-400">
                          Total Requested Grant
                        </td>
                        <td className="py-2.5 px-4 hidden sm:table-cell font-code text-xs text-zinc-400">
                          100%
                        </td>
                        <td className="py-2.5 px-4 text-right font-code text-sm font-bold text-emerald-400">
                          {parsedBudget.totalFormatted}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </section>

            </motion.article>
          )}

          {/* TAB 2: IN-PLACE PROPOSAL EDITOR */}
          {activeTab === 'edit' && (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-[780px] mx-auto px-5 sm:px-10 py-7 space-y-5 text-xs sm:text-sm"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div>
                  <h3 className="font-bold text-zinc-100 text-base">Edit Proposal Specification</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Modify any section below before exporting markdown.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetToAIDraft}
                    className="px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-zinc-300 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Reset Draft</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveInPlace}
                    className="px-3.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs transition cursor-pointer"
                  >
                    Done Editing
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold text-xs mb-1.5">Proposal Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-zinc-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold text-xs mb-1.5">Executive Summary</label>
                <textarea
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-zinc-500 text-sm leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold text-xs mb-1.5">Problem Statement & Ecosystem Gap</label>
                <textarea
                  rows={3}
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-zinc-500 text-sm leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold text-xs mb-1.5">Technical Architecture</label>
                <textarea
                  rows={3}
                  value={architecture}
                  onChange={(e) => setArchitecture(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-zinc-500 text-sm leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold text-xs mb-1.5">
                  Budget Line Items (separate items with &ldquo;•&rdquo;)
                </label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-zinc-500 text-sm font-code"
                />
              </div>
            </motion.div>
          )}

          {/* TAB 3: RUBRIC EVALUATION TABLE */}
          {activeTab === 'audit' && auditReport && (
            <motion.div
              key="audit"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-[780px] mx-auto px-5 sm:px-10 py-7 space-y-6"
            >
              
              {/* Top Summary Box */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800">
                <div>
                  <span className="text-[11px] font-code font-bold uppercase tracking-wider text-emerald-400">
                    Pre-Submission Jury Rubric Audit
                  </span>
                  <h3 className="text-lg font-bold text-zinc-100 mt-0.5">
                    Readiness Score: {auditReport.overallScore}/{auditReport.maxPossibleScore} (Grade {auditReport.grade})
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    {auditReport.verdict}
                  </p>
                </div>
              </div>

              {/* Structured Rubric Table */}
              <div className="border border-zinc-800/90 rounded-xl overflow-hidden bg-zinc-950/60">
                <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
                  <thead>
                    <tr className="bg-zinc-900/80 border-b border-zinc-800 text-[10.5px] font-code font-semibold uppercase tracking-wider text-zinc-400">
                      <th className="py-2.5 px-4 w-48">Criterion</th>
                      <th className="py-2.5 px-4">Assessment & Actionable Improvement</th>
                      <th className="py-2.5 px-4 text-right w-24">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/70">
                    {auditReport.rubrics.map((rubric) => (
                      <tr key={rubric.id} className="align-top">
                        <td className="py-3.5 px-4 font-semibold text-zinc-100">
                          {rubric.category}
                        </td>
                        <td className="py-3.5 px-4 space-y-1.5">
                          <p className="text-zinc-300 leading-relaxed">{rubric.strengths}</p>
                          <p className="text-xs text-zinc-400">
                            <strong className="text-emerald-400">Recommendation:</strong> {rubric.recommendation}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 text-right font-code font-bold text-emerald-400 whitespace-nowrap">
                          {rubric.assignedScore}/{rubric.maxScore}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pre-Submit Checklist */}
              <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-2">
                <h4 className="text-xs font-code font-bold uppercase tracking-wider text-zinc-300">
                  Final Submission Checklist
                </h4>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  {auditReport.criticalImprovements.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
};
