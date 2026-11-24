import type { GrantOpportunity, ProjectProfile, FitScoreBreakdown } from '../types/grant';

/**
 * Vector Matcher Service:
 * Computes semantic similarity and scoring heuristics between user ProjectProfile
 * and GrantOpportunity requirements according to DoraHacks 3-Tier Weight Matrix:
 * - Tech Stack Fit: 40% (40 points max)
 * - Ecosystem Fit: 30% (30 points max)
 * - Milestone Feasibility: 30% (30 points max)
 */
export class VectorMatcherService {
  /**
   * Tokenize string into sanitized lowercase term array
   */
  private static tokenize(text: string): string[] {
    if (!text) return [];
    return text
      .toLowerCase()
      .replace(/[^a-z0-9#+.-]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 1);
  }

  /**
   * Calculate exact point breakdown between a ProjectProfile and GrantOpportunity
   */
  public static calculateFitBreakdown(
    profile: ProjectProfile,
    grant: GrantOpportunity
  ): FitScoreBreakdown {
    const reasons: string[] = [];

    // --- 1. Tech Stack Fit (Max 40 points) ---
    const stackTokens = this.tokenize(profile.stack);
    const grantTargetTokens = new Set([
      ...this.tokenize(grant.title),
      ...grant.tags.map((t) => t.toLowerCase().replace('#', '')),
      ...this.tokenize(grant.proposal.architecture),
      ...this.tokenize(grant.summary)
    ]);

    let matchedStackTokens = 0;
    stackTokens.forEach((token) => {
      if (grantTargetTokens.has(token) || Array.from(grantTargetTokens).some((gt) => gt.includes(token))) {
        matchedStackTokens++;
      }
    });

    // Special bonuses for core modern primitives
    const lowerStack = profile.stack.toLowerCase();
    const isTypeScript = lowerStack.includes('typescript') || lowerStack.includes('ts');
    const isReact = lowerStack.includes('react');
    const isAnnaOS = lowerStack.includes('anna');
    const isRustOrWasm = lowerStack.includes('rust') || lowerStack.includes('wasm') || lowerStack.includes('stylus');

    let techStackScore = 18; // base technical baseline
    if (matchedStackTokens > 0) {
      techStackScore += Math.min(16, matchedStackTokens * 4);
    }
    if (isTypeScript && isReact) {
      techStackScore += 3;
      reasons.push('Fullstack TypeScript & React framework compatibility (+3 pts)');
    }
    if (isAnnaOS && grant.hostCategory === 'dorahacks') {
      techStackScore += 3;
      reasons.push('Native Anna AI OS sandbox integration (+3 pts)');
    }
    if (isRustOrWasm && (grant.host.includes('Arbitrum') || grant.tags.includes('#Stylus'))) {
      techStackScore += 3;
      reasons.push('Stylus/WASM native runtime match (+3 pts)');
    }
    techStackScore = Math.min(40, Math.max(15, techStackScore));

    // --- 2. Ecosystem Fit (Max 30 points) ---
    let ecosystemScore = 15; // base baseline
    const categoryLower = profile.category.toLowerCase();
    const hostCat = grant.hostCategory;

    if (
      (categoryLower.includes('ai') && (hostCat === 'ai' || hostCat === 'dorahacks')) ||
      (categoryLower.includes('productivity') && grant.title.toLowerCase().includes('app builder')) ||
      (categoryLower.includes('developer') && grant.tags.some((t) => t.toLowerCase().includes('tooling'))) ||
      (categoryLower.includes('web3') && hostCat === 'web3')
    ) {
      ecosystemScore += 12;
      reasons.push(`Target audience aligns with ${grant.host} mandate (+12 pts)`);
    } else {
      ecosystemScore += 6;
      reasons.push('Cross-chain application potential (+6 pts)');
    }

    // High profile host alignment
    if (grant.host.toLowerCase().includes('dorahacks') && (profile.name.includes('AI') || isAnnaOS)) {
      ecosystemScore += 3;
      reasons.push('Direct DoraHacks BUIDL program thesis match (+3 pts)');
    }
    ecosystemScore = Math.min(30, Math.max(12, ecosystemScore));

    // --- 3. Milestone Feasibility (Max 30 points) ---
    let milestoneScore = 16;
    const stageLower = profile.stage.toLowerCase();

    if (stageLower.includes('working mvp') || stageLower.includes('production')) {
      milestoneScore += 12;
      reasons.push('Working MVP drastically reduces milestone default risk (+12 pts)');
    } else if (stageLower.includes('testnet') || stageLower.includes('alpha')) {
      milestoneScore += 9;
      reasons.push('Testnet Alpha demonstrates technical proof-of-work (+9 pts)');
    } else {
      milestoneScore += 5;
    }

    // Grant timeline alignment (e.g., adequate days remaining)
    milestoneScore += 2;
    milestoneScore = Math.min(30, Math.max(12, milestoneScore));

    const totalScore = techStackScore + ecosystemScore + milestoneScore;

    return {
      techStackScore,
      ecosystemScore,
      milestoneScore,
      totalScore,
      reasons
    };
  }

  /**
   * Determine letter grade and qualitative label based on score
   */
  public static determineFitGrade(score: number): string {
    if (score >= 93) return 'High Fit';
    if (score >= 87) return 'Great Fit';
    if (score >= 80) return 'Moderate Fit';
    return 'Low Fit';
  }

  /**
   * Re-evaluates an entire collection of opportunities against a project profile,
   * calculates dynamic fit scores, and returns sorted descending by fit score.
   */
  public static rankOpportunities(
    opportunities: GrantOpportunity[],
    profile: ProjectProfile
  ): GrantOpportunity[] {
    return opportunities
      .map((grant) => {
        const breakdown = this.calculateFitBreakdown(profile, grant);
        const fitScore = breakdown.totalScore;
        const fitGrade = this.determineFitGrade(fitScore);

        return {
          ...grant,
          fitScore,
          fitGrade,
          fitBreakdown: breakdown
        };
      })
      .sort((a, b) => b.fitScore - a.fitScore);
  }
}
