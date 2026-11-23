export interface GrantProposal {
  title: string;
  summary: string;
  problem: string;
  architecture: string;
  milestones: string[];
  budget: string;
}

export interface GrantOpportunity {
  id: string;
  title: string;
  host: string;
  hostCategory: 'dorahacks' | 'web3' | 'ai' | 'opensource';
  pool: string;
  poolValue: number;
  deadline: string;
  fitScore: number;
  fitGrade: string;
  tags: string[];
  summary: string;
  radarAngle: number;
  radarDist: number;
  proposal: GrantProposal;
  externalUrl?: string;
}

export interface ProjectProfile {
  name: string;
  tagline: string;
  stack: string;
  category: string;
  stage: string;
}

export interface SwarmLog {
  id: string;
  timestamp: string;
  agent: 'SCOUT' | 'MATCHER' | 'DRAFTER' | 'CRITIC' | 'SYSTEM';
  message: string;
}
