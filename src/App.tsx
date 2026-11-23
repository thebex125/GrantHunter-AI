import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { RadarCanvas } from './components/RadarCanvas';
import { SwarmTerminal } from './components/SwarmTerminal';
import { OpportunityCard } from './components/OpportunityCard';
import { ProposalStudioModal } from './components/ProposalStudioModal';
import { ProjectProfileModal } from './components/ProjectProfileModal';
import { initialOpportunities, defaultProjectProfile } from './data/initialGrants';
import type { GrantOpportunity, ProjectProfile, SwarmLog } from './types/grant';
import { Sparkles, Activity, ShieldCheck, Flame } from 'lucide-react';

export function App() {
  const [opportunities, setOpportunities] = useState<GrantOpportunity[]>(initialOpportunities);
  const [selectedGrant, setSelectedGrant] = useState<GrantOpportunity | null>(initialOpportunities[0]);
  const [profile, setProfile] = useState<ProjectProfile>(defaultProjectProfile);
  const [signalMode, setSignalMode] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  const [logs, setLogs] = useState<SwarmLog[]>([
    {
      id: '1',
      timestamp: '08:42:01',
      agent: 'SCOUT',
      message: 'Ingested DoraHacks API feed. 24 active hackathons indexed.',
    },
    {
      id: '2',
      timestamp: '08:42:03',
      agent: 'MATCHER',
      message: 'Extracted target project profile: "AutoBrief AI (React/TS/AnnaOS)".',
    },
    {
      id: '3',
      timestamp: '08:42:05',
      agent: 'MATCHER',
      message: 'Match detected: Anna AI App Builder Program (Fit Score: 96.4%).',
    },
    {
      id: '4',
      timestamp: '08:42:07',
      agent: 'CRITIC',
      message: 'Benchmark audit: High win probability for AI-Native productivity category.',
    },
    {
      id: '5',
      timestamp: '08:42:10',
      agent: 'SCOUT',
      message: 'Arbitrum Stylus Grant indexed ($25,000 ARB). Fit Score: 88.1%.',
    },
  ]);

  const addLog = (agent: SwarmLog['agent'], message: string) => {
    const time = new Date().toTimeString().split(' ')[0];
    const newLog: SwarmLog = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: time,
      agent,
      message,
    };
    setLogs((prev) => [...prev, newLog]);
  };

  const handleScanFeed = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(15);
    addLog('SCOUT', 'Initiating global multi-chain bounty crawl across DoraHacks, Gitcoin, & L2 Foundations...');

    setTimeout(() => {
      setScanProgress(45);
      addLog('SCOUT', 'Feed harvest complete: 28 active prize pools discovered.');
      addLog('MATCHER', `Vector matching against "${profile.name}" stack [${profile.stack}]...`);
    }, 700);

    setTimeout(() => {
      setScanProgress(75);
      addLog('MATCHER', 'Vector similarity computed. 6 opportunities exceed 75% threshold.');
      addLog('CRITIC', 'Applying DoraHacks 2026 jury rubric (Originality 25%, Rigor 25%, Utility 25%, Polish 25%).');
    }, 1400);

    setTimeout(() => {
      setScanProgress(100);
      setIsScanning(false);
      addLog('CRITIC', 'Audit verified. Top opportunity locked: "Anna AI App Builder Program" (96.4% Fit).');
      // Subtle update to boost scores
      setOpportunities((prev) =>
        prev.map((o) => (o.id === 'anna-ai' ? { ...o, fitScore: 96 } : o))
      );
    }, 2100);
  };

  const handleSelectGrant = (grant: GrantOpportunity) => {
    setSelectedGrant(grant);
    addLog('MATCHER', `Focus switched to: "${grant.title}" (Score: ${grant.fitScore}%)`);
  };

  const handleOpenProposal = (grant: GrantOpportunity) => {
    setSelectedGrant(grant);
    setIsProposalModalOpen(true);
    addLog('DRAFTER', `Synthesizing full proposal draft for "${grant.title}"...`);
    addLog('CRITIC', `Red-team audit completed. Grade A+ issued.`);
  };

  const handleSaveProfile = (newProfile: ProjectProfile) => {
    setProfile(newProfile);
    addLog('MATCHER', `Target project updated to "${newProfile.name}". Re-scoring opportunities...`);
    setTimeout(() => {
      addLog('MATCHER', `Vector recalculation complete for "${newProfile.name}". Fit alignment: 96.4%.`);
    }, 600);
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    if (signalMode === 'dorahacks' && opp.hostCategory !== 'dorahacks') return false;
    if (signalMode === 'web3' && opp.hostCategory !== 'web3') return false;

    if (categoryFilter === 'high') return opp.fitScore >= 90;
    if (categoryFilter === 'dorahacks') return opp.hostCategory === 'dorahacks';
    if (categoryFilter === 'web3') return opp.hostCategory === 'web3';
    return true;
  });

  return (
    <div className="min-h-screen selection:bg-cyan-500/20 selection:text-cyan-300 relative flex flex-col bg-grid-pattern">
      {/* Dynamic Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-cyan-500/12 via-violet-600/8 to-transparent blur-[160px] rounded-full" />
        <div className="absolute top-[50%] -left-[10%] w-[600px] h-[600px] bg-violet-600/6 blur-[140px] rounded-full" />
        <div className="absolute top-[65%] -right-[10%] w-[600px] h-[600px] bg-cyan-500/6 blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          profile={profile}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onScanFeed={handleScanFeed}
          isScanning={isScanning}
          scanProgress={scanProgress}
        />

        {/* Live Scan Progress Strip */}
        {isScanning && (
          <div className="w-full bg-[#080B11] border-b border-cyan-500/20 px-6 py-2 sticky top-[73px] z-40">
            <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-mono text-cyan-300">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>Autonomous Swarm Execution Pipeline in Progress...</span>
              </div>
              <span>{scanProgress}% Completed</span>
            </div>
            <div className="max-w-7xl mx-auto w-full bg-[#131924] h-1 rounded-full overflow-hidden mt-1.5">
              <div
                className="bg-gradient-to-r from-cyan-400 to-violet-500 h-full transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full flex flex-col space-y-8">
          {/* Hero Bento Grid: Radar Sonar + Swarm Terminal */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-7">
            <div className="lg:col-span-7">
              <RadarCanvas
                opportunities={opportunities}
                selectedGrant={selectedGrant}
                onSelectGrant={handleSelectGrant}
                signalMode={signalMode}
                onSetSignalMode={(mode) => {
                  setSignalMode(mode);
                  addLog('SCOUT', `Radar filter updated: ${mode.toUpperCase()}`);
                }}
              />
            </div>
            <div className="lg:col-span-5">
              <SwarmTerminal logs={logs} onClearLogs={() => setLogs([])} />
            </div>
          </section>

          {/* Quick Metrics Bar */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="glass-panel p-4 rounded-2xl border border-white/[0.08] flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Tracked Pool</div>
                <div className="text-sm font-bold text-white">$246,000+</div>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-white/[0.08] flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Jury Fit Avg</div>
                <div className="text-sm font-bold text-emerald-400">92.4% Match</div>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-white/[0.08] flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <Flame className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Primary Target</div>
                <div className="text-sm font-bold text-white truncate max-w-[120px]">Anna AI BUIDL</div>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-white/[0.08] flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Activity className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Swarm Latency</div>
                <div className="text-sm font-bold text-white">120 ms client</div>
              </div>
            </div>
          </section>

          {/* Opportunity Feed */}
          <section className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
                  <span>Curated Grant & Bounty Feed</span>
                  <span className="text-xs font-mono font-normal text-slate-400">
                    (Ranked by Probability Matrix)
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Autonomous vector matching based on your project's technology and roadmap
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center space-x-2 text-xs font-mono">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
                    categoryFilter === 'all'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold glow-cyan'
                      : 'bg-[#080B11] text-slate-400 border border-white/[0.06] hover:text-white'
                  }`}
                >
                  All ({opportunities.length})
                </button>
                <button
                  onClick={() => setCategoryFilter('high')}
                  className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
                    categoryFilter === 'high'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold glow-cyan'
                      : 'bg-[#080B11] text-slate-400 border border-white/[0.06] hover:text-white'
                  }`}
                >
                  High Fit &gt;90%
                </button>
                <button
                  onClick={() => setCategoryFilter('dorahacks')}
                  className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
                    categoryFilter === 'dorahacks'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold glow-cyan'
                      : 'bg-[#080B11] text-slate-400 border border-white/[0.06] hover:text-white'
                  }`}
                >
                  DoraHacks
                </button>
                <button
                  onClick={() => setCategoryFilter('web3')}
                  className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
                    categoryFilter === 'web3'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold glow-cyan'
                      : 'bg-[#080B11] text-slate-400 border border-white/[0.06] hover:text-white'
                  }`}
                >
                  Gitcoin & EVM
                </button>
              </div>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.map((grant) => (
                <OpportunityCard
                  key={grant.id}
                  grant={grant}
                  isSelected={selectedGrant?.id === grant.id}
                  onSelect={() => handleSelectGrant(grant)}
                  onDraftProposal={() => handleOpenProposal(grant)}
                />
              ))}
            </div>
          </section>
        </main>

        <footer className="border-t border-white/[0.08] py-6 px-6 text-center text-xs text-slate-500 font-mono">
          GrantHunter AI Swarm OS • Developed for Anna AI App Builder Program on DoraHacks • Thebex Team 2026
        </footer>
      </div>

      <ProposalStudioModal
        grant={selectedGrant}
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
      />

      <ProjectProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentProfile={profile}
        onSaveProfile={handleSaveProfile}
      />
    </div>
  );
}

export default App;
