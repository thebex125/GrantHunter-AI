import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { LiveEcosystemStats } from './components/LiveEcosystemStats';
import { AgentPipelineShowcase } from './components/AgentPipelineShowcase';
import { OpportunityList } from './components/OpportunityList';
import { ProposalCompiler } from './components/ProposalCompiler';
import { ProjectProfileModal } from './components/ProjectProfileModal';
import { V0ArchitecturalBackground } from './components/ui/MotionPrimitives';
import { initialOpportunities, defaultProjectProfile } from './data/initialGrants';
import type { GrantOpportunity, ProjectProfile } from './types/grant';
import { ScoutHarvesterService } from './services/scoutHarvester';
import { VectorMatcherService } from './services/vectorMatcher';
import { ProposalArchitectService } from './services/proposalArchitect';
import { FileText, ListFilter, ArrowRight } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'studio'>('landing');
  const [profile, setProfile] = useState<ProjectProfile>(defaultProjectProfile);
  
  const [opportunities, setOpportunities] = useState<GrantOpportunity[]>(() =>
    VectorMatcherService.rankOpportunities(initialOpportunities, defaultProjectProfile)
  );

  const [selectedGrant, setSelectedGrant] = useState<GrantOpportunity | null>(() =>
    opportunities[0] || initialOpportunities[0]
  );

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'list' | 'proposal'>('list');

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const totalPoolFormatted = useMemo(() => {
    const sum = opportunities.reduce((acc, g) => acc + (g.poolValue || 0), 0);
    return sum > 0 ? `$${sum.toLocaleString('en-US')}` : '$136,000';
  }, [opportunities]);

  const handleRefreshFeed = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const harvested = await ScoutHarvesterService.harvestOpportunities(profile);
      const ranked = VectorMatcherService.rankOpportunities(harvested, profile);
      setOpportunities(ranked);

      if (selectedGrant) {
        const found = ranked.find((g) => g.id === selectedGrant.id);
        if (found) setSelectedGrant(found);
        else setSelectedGrant(ranked[0] || null);
      } else {
        setSelectedGrant(ranked[0] || null);
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [profile, selectedGrant]);

  const handleSelectGrant = (grant: GrantOpportunity) => {
    setSelectedGrant(grant);
    if (window.innerWidth < 1024) {
      setMobileTab('proposal');
    }
  };

  const handleSaveProfile = (newProfile: ProjectProfile) => {
    setProfile(newProfile);
    const reRanked = VectorMatcherService.rankOpportunities(opportunities, newProfile);
    setOpportunities(reRanked);
    const topOrCurrent =
      reRanked.find((g) => g.id === selectedGrant?.id) || reRanked[0];
    if (topOrCurrent) {
      const freshProposal = ProposalArchitectService.generateProposal(newProfile, topOrCurrent);
      setSelectedGrant({
        ...topOrCurrent,
        proposal: freshProposal
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable;

      if (!isInput && (e.key === '/' || (e.ctrlKey && e.key === 'k'))) {
        if (currentView !== 'studio') {
          setCurrentView('studio');
        }
        e.preventDefault();
        setTimeout(() => searchInputRef.current?.focus(), 60);
        return;
      }

      if (!isInput && currentView === 'studio' && (e.key === 'ArrowDown' || e.key === 'j')) {
        e.preventDefault();
        if (opportunities.length > 0) {
          const currentIndex = opportunities.findIndex((g) => g.id === selectedGrant?.id);
          const nextIndex = currentIndex < opportunities.length - 1 ? currentIndex + 1 : 0;
          handleSelectGrant(opportunities[nextIndex]);
        }
        return;
      }

      if (!isInput && currentView === 'studio' && (e.key === 'ArrowUp' || e.key === 'k')) {
        e.preventDefault();
        if (opportunities.length > 0) {
          const currentIndex = opportunities.findIndex((g) => g.id === selectedGrant?.id);
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : opportunities.length - 1;
          handleSelectGrant(opportunities[prevIndex]);
        }
        return;
      }

      if (!isInput && (e.key === 'p' || (e.ctrlKey && e.key === 'p'))) {
        e.preventDefault();
        setIsProfileModalOpen((prev) => !prev);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, opportunities, selectedGrant]);

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300 antialiased relative">
      
      {/* V0 Architectural Grid & Subtle Top Light Beam */}
      <V0ArchitecturalBackground />

      {/* Unified Top Bar with Motion.dev Shared-Layout Switcher */}
      <Navbar
        profile={profile}
        currentView={currentView}
        onToggleView={(v) => setCurrentView(v)}
        totalGrants={opportunities.length}
        totalPoolFormatted={totalPoolFormatted}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onRefreshFeed={handleRefreshFeed}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Router */}
      <AnimatePresence mode="wait">
        {currentView === 'landing' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className="flex-1 flex flex-col relative z-10"
          >
            {/* Asymmetric Editorial Hero + GetLayers 3D Spatial Dossier */}
            <LandingHero
              onLaunchStudio={() => setCurrentView('studio')}
              profile={profile}
              topGrant={opportunities[0] || selectedGrant}
              onSelectPreset={handleSaveProfile}
              onOpenProfileModal={() => setIsProfileModalOpen(true)}
            />

            {/* Architectural Hairline Telemetry Strip (Refero / Unlumen) */}
            <LiveEcosystemStats />

            {/* Asymmetric Interactive Bento Grid (Aceternity / 21st.dev) */}
            <AgentPipelineShowcase onLaunchStudio={() => setCurrentView('studio')} />

            {/* Minimal Bottom Editorial Launch Strip */}
            <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 pb-14">
              <div className="p-6 sm:p-8 rounded-2xl bg-[#111114]/90 border border-zinc-800/85 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-code text-emerald-400 uppercase tracking-wider">
                    Ready for DoraHacks BUIDL Submission
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-100 mt-0.5 tracking-tight">
                    Compile your tailored grant dossier and itemized budget in one click.
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentView('studio')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs sm:text-sm transition cursor-pointer shrink-0"
                >
                  <span>Launch Proposal Workbench</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="studio"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="max-w-[1600px] w-full mx-auto px-3.5 sm:px-6 py-3.5 flex-1 flex flex-col gap-3 relative z-10"
          >
            {/* Mobile & Tablet Segmented Switcher (< lg screens) */}
            <div className="flex lg:hidden items-center p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium">
              <button
                type="button"
                onClick={() => setMobileTab('list')}
                className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  mobileTab === 'list'
                    ? 'bg-zinc-100 text-zinc-950 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>Grant Feed ({opportunities.length})</span>
              </button>
              
              <button
                type="button"
                onClick={() => setMobileTab('proposal')}
                className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  mobileTab === 'proposal'
                    ? 'bg-zinc-100 text-zinc-950 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="truncate max-w-[160px]">
                  {selectedGrant ? selectedGrant.title : 'Proposal Dossier'}
                </span>
              </button>
            </div>

            {/* Master-Detail Grid */}
            <main className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 items-start">
              
              {/* Left Pane: Master Grant List & Spatial Radar */}
              <div className={`w-full lg:col-span-4 ${mobileTab === 'list' ? 'block' : 'hidden lg:block'}`}>
                <OpportunityList
                  opportunities={opportunities}
                  selectedGrant={selectedGrant}
                  onSelectGrant={handleSelectGrant}
                  searchInputRef={searchInputRef}
                />
              </div>

              {/* Right Pane: Proposal Specification Document & Rubric */}
              <div className={`w-full lg:col-span-8 ${mobileTab === 'proposal' ? 'block' : 'hidden lg:block'}`}>
                <ProposalCompiler
                  grant={selectedGrant}
                  profile={profile}
                  onUpdateProposal={(updatedProposal) => {
                    if (selectedGrant) {
                      setSelectedGrant({
                        ...selectedGrant,
                        proposal: updatedProposal
                      });
                    }
                  }}
                />
              </div>

            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Profile Configuration Modal */}
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
