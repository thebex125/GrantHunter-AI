export interface GrantProposal {
  title: string;
  summary: string;
  problem: string;
  architecture: string;
  milestones: string[];
  budget: string;
}

export interface FitScoreBreakdown {
  techStackScore: number;       // 0 - 40 pts (40% weight)
  ecosystemScore: number;       // 0 - 30 pts (30% weight)
  milestoneScore: number;       // 0 - 30 pts (30% weight)
  totalScore: number;           // 0 - 100 pts
  reasons: string[];
}

export interface JuryRubricItem {
  id: 'originality' | 'technical' | 'utility' | 'design';
  category: string;
  maxScore: number;
  assignedScore: number;
  strengths: string;
  weaknesses: string;
  recommendation: string;
}

export interface JuryAuditReport {
  overallScore: number;
  maxPossibleScore: number;
  percentageScore: number;
  grade: 'A+' | 'A' | 'A-' | 'B+' | 'B';
  verdict: string;
  rubrics: JuryRubricItem[];
  criticalImprovements: string[];
  suggestedActionItems: string[];
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
  fitBreakdown?: FitScoreBreakdown;
  tags: string[];
  summary: string;
  radarAngle: number;
  radarDist: number;
  proposal: GrantProposal;
  auditReport?: JuryAuditReport;
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
