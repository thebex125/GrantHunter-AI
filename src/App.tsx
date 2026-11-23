import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { RadarCanvas } from './components/RadarCanvas';
import { SwarmTerminal } from './components/SwarmTerminal';
import { OpportunityCard } from './components/OpportunityCard';
import { ProposalStudioModal } from './components/ProposalStudioModal';
import { ProjectProfileModal } from './components/ProjectProfileModal';
import { initialOpportunities, defaultProjectProfile } from './data/initialGrants';
import type { GrantOpportunity, ProjectProfile, SwarmLog } from './types/grant';

export function App() {
  const [opportunities] = useState<GrantOpportunity[]>(initialOpportunities);
  const [selectedGrant, setSelectedGrant] = useState<GrantOpportunity | null>(initialOpportunities[0]);
  const [profile, setProfile] = useState<ProjectProfile>(defaultProjectProfile);
  const [signalMode, setSignalMode] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isScanning, setIsScanning] = useState<boolean>(false);
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
      id: Date.now().toString(),
      timestamp: time,
      agent,
      message,
    };
    setLogs((prev) => [...prev, newLog]);
  };

  const handleScanFeed = () => {
    setIsScanning(true);
    addLog('SCOUT', 'Manual live refresh triggered. Querying DoraHacks BUIDL index...');
    setTimeout(() => {
      setIsScanning(false);
      addLog('SCOUT', 'Ingested 6 verified prize pools. Swarm cache updated.');
      addLog('MATCHER', 'Re-evaluated opportunity ranking. Top match: Anna AI App Builder.');
    }, 1000);
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
      addLog('MATCHER', 'Recalculation complete. Fit vector alignment: 96.4%.');
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
    <div className="min-h-screen selection:bg-cyan-500/20 selection:text-cyan-300 relative flex flex-col">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-cyan-500/10 via-violet-600/5 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-[60%] -left-[10%] w-[500px] h-[500px] bg-violet-600/5 blur-[120px] rounded-full" />
        <div className="absolute top-[70%] -right-[10%] w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          profile={profile}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onScanFeed={handleScanFeed}
          isScanning={isScanning}
        />

        <main className="max-w-7xl mx-auto px-6 py-6 flex-1 w-full flex flex-col space-y-6">
          {/* Hero Grid: Radar Sonar + Swarm Terminal */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
              <SwarmTerminal logs={logs} />
            </div>
          </section>

          {/* Opportunity Feed */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
                  <span>Curated Grant & Bounty Feed</span>
                  <span className="text-xs font-mono font-normal text-slate-400">
                    (Ranked by Win Probability)
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Autonomous vector matching based on your project's technology and roadmap
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center space-x-2 text-xs">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    categoryFilter === 'all'
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'bg-[#080B11] text-slate-400 border border-white/[0.06]'
                  }`}
                >
                  All Grants ({opportunities.length})
                </button>
                <button
                  onClick={() => setCategoryFilter('high')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    categoryFilter === 'high'
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'bg-[#080B11] text-slate-400 border border-white/[0.06]'
                  }`}
                >
                  High Fit &gt;90%
                </button>
                <button
                  onClick={() => setCategoryFilter('dorahacks')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    categoryFilter === 'dorahacks'
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'bg-[#080B11] text-slate-400 border border-white/[0.06]'
                  }`}
                >
                  DoraHacks
                </button>
                <button
                  onClick={() => setCategoryFilter('web3')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    categoryFilter === 'web3'
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'bg-[#080B11] text-slate-400 border border-white/[0.06]'
                  }`}
                >
                  Gitcoin & EVM
                </button>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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

        <footer className="border-t border-white/[0.06] py-5 px-6 text-center text-xs text-slate-500 font-mono">
          GrantHunter AI • Developed for Anna AI App Builder Program on DoraHacks • Thebex Team 2026
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
