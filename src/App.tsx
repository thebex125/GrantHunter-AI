import { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { ProjectProfileBar } from './components/ProjectProfileBar';
import { OpportunityList } from './components/OpportunityList';
import { ProposalCompiler } from './components/ProposalCompiler';
import { ProjectProfileModal } from './components/ProjectProfileModal';
import { initialOpportunities, defaultProjectProfile } from './data/initialGrants';
import type { GrantOpportunity, ProjectProfile } from './types/grant';
import { ScoutHarvesterService } from './services/scoutHarvester';
import { VectorMatcherService } from './services/vectorMatcher';
import { ProposalArchitectService } from './services/proposalArchitect';
import { FileText, Sparkles } from 'lucide-react';

export function App() {
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

      // Keep current selected grant or switch to top match
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
    // Dynamically re-rank opportunities and regenerate tailored proposals
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
      // Ignore if user is currently typing inside an input or textarea
      const target = e.target as HTMLElement | null;
      const isInput =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable;

      // Focus Search shortcut: "/" or "Ctrl+K"
      if (!isInput && (e.key === '/' || (e.ctrlKey && e.key === 'k'))) {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      // Navigate Grants Up / Down with Arrow keys (when not typing)
      if (!isInput && (e.key === 'ArrowDown' || e.key === 'j')) {
        e.preventDefault();
        if (opportunities.length > 0) {
          const currentIndex = opportunities.findIndex((g) => g.id === selectedGrant?.id);
          const nextIndex = currentIndex < opportunities.length - 1 ? currentIndex + 1 : 0;
          handleSelectGrant(opportunities[nextIndex]);
        }
        return;
      }

      if (!isInput && (e.key === 'ArrowUp' || e.key === 'k')) {
        e.preventDefault();
        if (opportunities.length > 0) {
          const currentIndex = opportunities.findIndex((g) => g.id === selectedGrant?.id);
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : opportunities.length - 1;
          handleSelectGrant(opportunities[prevIndex]);
        }
        return;
      }

      // Open Profile Modal shortcut: "Ctrl+P" or "p" (when not typing)
      if (!isInput && (e.key === 'p' || (e.ctrlKey && e.key === 'p'))) {
        e.preventDefault();
        setIsProfileModalOpen((prev) => !prev);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [opportunities, selectedGrant]);

  return (
    <div className="min-h-screen bg-[#07090C] text-[#EDEDF0] flex flex-col font-sans selection:bg-[#00DC82]/20 selection:text-[#00DC82] antialiased">
      
      {/* Top Global Navbar */}
      <Navbar
        profile={profile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onRefreshFeed={handleRefreshFeed}
        isRefreshing={isRefreshing}
      />

      {/* Main Workspace Container */}
      <div className="max-w-[1520px] w-full mx-auto px-3.5 sm:px-5 py-3 sm:py-4 flex-1 flex flex-col space-y-3.5">
        
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

      </div>

      {/* Footer with Keyboard Hints */}
      <footer className="border-t border-white/[0.06] bg-[#0A0D12] py-2.5 px-5 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-[1520px] w-full mx-auto gap-2">
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
