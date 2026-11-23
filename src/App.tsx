import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ProjectProfileBar } from './components/ProjectProfileBar';
import { OpportunityList } from './components/OpportunityList';
import { ProposalCompiler } from './components/ProposalCompiler';
import { ProjectProfileModal } from './components/ProjectProfileModal';
import { initialOpportunities, defaultProjectProfile } from './data/initialGrants';
import type { GrantOpportunity, ProjectProfile } from './types/grant';

export function App() {
  const [opportunities, setOpportunities] = useState<GrantOpportunity[]>(initialOpportunities);
  const [selectedGrant, setSelectedGrant] = useState<GrantOpportunity | null>(initialOpportunities[0]);
  const [profile, setProfile] = useState<ProjectProfile>(defaultProjectProfile);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  const handleRefreshFeed = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      // Re-sort with top fit first
      setOpportunities((prev) => [...prev].sort((a, b) => b.fitScore - a.fitScore));
    }, 700);
  };

  const handleSaveProfile = (newProfile: ProjectProfile) => {
    setProfile(newProfile);
  };

  return (
    <div className="min-h-screen bg-[#08090B] text-[#EDEDF0] flex flex-col font-sans selection:bg-[#00DC82]/20 selection:text-[#00DC82]">
      {/* Top Navbar */}
      <Navbar
        profile={profile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onRefreshFeed={handleRefreshFeed}
        isRefreshing={isRefreshing}
      />

      {/* Main Container */}
      <div className="max-w-[1520px] w-full mx-auto px-5 py-4 flex-1 flex flex-col space-y-3.5">
        
        {/* Contextual Profile Bar */}
        <ProjectProfileBar
          profile={profile}
          onOpenModal={() => setIsProfileModalOpen(true)}
        />

        {/* Workstation Split-Pane */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 items-start">
          {/* Left Column: Master Opportunity List (5 Cols / ~42%) */}
          <div className="lg:col-span-5 w-full">
            <OpportunityList
              opportunities={opportunities}
              selectedGrant={selectedGrant}
              onSelectGrant={setSelectedGrant}
            />
          </div>

          {/* Right Column: Signature Proposal Compiler & Jury Audit (7 Cols / ~58%) */}
          <div className="lg:col-span-7 w-full">
            <ProposalCompiler grant={selectedGrant} />
          </div>
        </main>

      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[#0E1015] py-2.5 px-5 text-center text-[11px] font-mono text-slate-500">
        GrantHunter Workstation • DoraHacks Anna AI App Builder Track • Built with disciplined frontend craft
      </footer>

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
