import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { LiveEcosystemStats } from './components/LiveEcosystemStats';
import { AgentPipelineShowcase } from './components/AgentPipelineShowcase';
import { ProjectProfileBar } from './components/ProjectProfileBar';
import { OpportunityList } from './components/OpportunityList';
import { ProposalCompiler } from './components/ProposalCompiler';
import { ProjectProfileModal } from './components/ProjectProfileModal';
import { initialOpportunities, defaultProjectProfile } from './data/initialGrants';
import type { GrantOpportunity, ProjectProfile } from './types/grant';
import { ScoutHarvesterService } from './services/scoutHarvester';
import { VectorMatcherService } from './services/vectorMatcher';
import { ProposalArchitectService } from './services/proposalArchitect';
import { FileText, Sparkles, ArrowRight } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'studio'>('landing');
  const [profile, setProfile] = useState<ProjectProfile>(defaultProjectProfile);
  
  // Initialize opportunities ranked dynamically against default profile
  const [opportunities, setOpportunities] = useState<GrantOpportunity[]>(() =>
    VectorMatcherService.rankOpportunities(initialOpportunities, defaultProjectProfile)
  );

  const [selectedGrant, setSelectedGrant] = useState<GrantOpportunity | null>(() =>
    opportunities[0] || initialOpportunities[0]
  );

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  
  // Mobile / Tablet Tab View Toggle ('list' | 'proposal')
  const [mobileTab, setMobileTab] = useState<'list' | 'proposal'>('list');

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Sync / Harvest Grants with Scout & Vector Matcher
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
    if (selectedGrant) {
      const updated = reRanked.find((g) => g.id === selectedGrant.id) || reRanked[0];
      if (updated) {
        const freshProposal = ProposalArchitectService.generateProposal(newProfile, updated);
        setSelectedGrant({
          ...updated,
          proposal: freshProposal
        });
      }
    }
  };

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable;

      // Focus Search shortcut: "/" or "Ctrl+K" (only when in studio)
      if (!isInput && (e.key === '/' || (e.ctrlKey && e.key === 'k'))) {
        if (currentView !== 'studio') {
          setCurrentView('studio');
        }
        e.preventDefault();
        setTimeout(() => searchInputRef.current?.focus(), 50);
        return;
      }

      // Navigate Grants Up / Down with Arrow keys
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

      // Open Profile Modal shortcut: "Ctrl+P" or "p"
      if (!isInput && (e.key === 'p' || (e.ctrlKey && e.key === 'p'))) {
        e.preventDefault();
        setIsProfileModalOpen((prev) => !prev);
        return;
      }

      // Escape to return to landing view
      if (!isInput && e.key === 'Escape' && currentView === 'studio') {
        setCurrentView('landing');
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, opportunities, selectedGrant]);

  return (
    <div className="min-h-screen bg-[#07090C] text-[#EDEDF0] flex flex-col font-sans selection:bg-[#00DC82]/20 selection:text-[#00DC82] antialiased">
      
      {/* Top Global Navbar */}
      <Navbar
        profile={profile}
        currentView={currentView}
        onToggleView={(v) => setCurrentView(v)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onRefreshFeed={handleRefreshFeed}
        isRefreshing={isRefreshing}
      />

      {/* View Router with AnimatePresence */}
      <AnimatePresence mode="wait">
        
        {/* VIEW 1: MODERN SHOWCASE LANDING PAGE */}
        {currentView === 'landing' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col"
          >
            {/* Hero Section */}
            <LandingHero onLaunchStudio={() => setCurrentView('studio')} />

            {/* Live Ecosystem Stats Metrics */}
            <LiveEcosystemStats />

            {/* 4-Agent Pipeline Deep Dive */}
            <AgentPipelineShowcase />

            {/* Bottom Conversion CTA */}
            <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
              <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#0E131C] to-[#0A0D12] border border-white/[0.08] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#00DC82]/10 blur-3xl pointer-events-none rounded-full" />
                <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#00DC82]/15 text-[#00DC82] text-xs font-mono font-bold border border-[#00DC82]/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Instant DoraHacks Application Ready</span>
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Start Matching Your Project Against $136k+ in Bounties
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Zero setup required. Customize your tech stack, let the 4-agent swarm calculate your fit vector, and export your BUIDL proposal in markdown.
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => setCurrentView('studio')}
                      className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-[#00DC82] hover:bg-[#00c776] text-[#07090C] font-extrabold text-sm sm:text-base transition-all shadow-[0_4px_25px_rgba(0,220,130,0.35)] hover:shadow-[0_6px_30px_rgba(0,220,130,0.5)] cursor-pointer hover:-translate-y-0.5"
                    >
                      <span>Open GrantHunter Workstation</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        ) : (
          
          /* VIEW 2: DEVELOPER WORKSTATION STUDIO */
          <motion.div
            key="studio"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="max-w-[1520px] w-full mx-auto px-3.5 sm:px-5 py-3 sm:py-4 flex-1 flex flex-col space-y-3.5"
          >
            {/* Project Target Spotlight & Metrics Bar */}
            <ProjectProfileBar
              profile={profile}
              onOpenModal={() => setIsProfileModalOpen(true)}
            />

            {/* Mobile & Tablet View Switcher (< lg screens) */}
            <div className="flex lg:hidden items-center p-1 rounded-xl bg-[#0F131C] border border-white/[0.08] text-xs font-semibold">
              <button
                onClick={() => setMobileTab('list')}
                className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center space-x-2 ${
                  mobileTab === 'list'
                    ? 'bg-[#00DC82] text-[#07090C] shadow-md font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Opportunities ({opportunities.length})</span>
              </button>
              
              <button
                onClick={() => setMobileTab('proposal')}
                className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center space-x-2 ${
                  mobileTab === 'proposal'
                    ? 'bg-[#00DC82] text-[#07090C] shadow-md font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="truncate max-w-[160px]">
                  {selectedGrant ? selectedGrant.title : 'Proposal Studio'}
                </span>
              </button>
            </div>

            {/* Workstation Split-Pane Layout */}
            <main className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 items-start">
              
              {/* Left Column: Master Opportunity List */}
              <div className={`w-full lg:col-span-5 ${mobileTab === 'list' ? 'block' : 'hidden lg:block'}`}>
                <OpportunityList
                  opportunities={opportunities}
                  selectedGrant={selectedGrant}
                  onSelectGrant={handleSelectGrant}
                  searchInputRef={searchInputRef}
                />
              </div>

              {/* Right Column: Signature Proposal Compiler & Jury Audit */}
              <div className={`w-full lg:col-span-7 ${mobileTab === 'proposal' ? 'block' : 'hidden lg:block'}`}>
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

      {/* Global Footer */}
      <footer className="border-t border-white/[0.06] bg-[#0A0D12] py-3 px-5 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-[1520px] w-full mx-auto gap-2">
        <div className="flex items-center space-x-3 text-[11px] text-slate-400">
          <span className="flex items-center space-x-1 font-mono">
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300 border border-white/[0.1]">/</kbd>
            <span>Search</span>
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center space-x-1 font-mono">
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300 border border-white/[0.1]">↑</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300 border border-white/[0.1]">↓</kbd>
            <span>Navigate</span>
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center space-x-1 font-mono">
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300 border border-white/[0.1]">P</kbd>
            <span>Profile</span>
          </span>
        </div>

        <span className="text-[11px] text-slate-500">
          GrantHunter AI • DoraHacks Anna AI App Builder Program • Zero Client-Side Leakage
        </span>
      </footer>

      {/* Profile Customize Modal */}
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
