import type { GrantOpportunity, GrantProposal, ProjectProfile } from '../types/grant';

/**
 * Proposal Architect Service:
 * Synthesizes formal, high-impact BUIDL proposals tailored specifically for
 * DoraHacks, Gitcoin, and Web3 Grant Committees.
 */
export class ProposalArchitectService {
  /**
   * Generates a complete, tailored proposal for a specific grant and project profile
   */
  public static generateProposal(
    profile: ProjectProfile,
    grant: GrantOpportunity
  ): GrantProposal {
    const isDoraHacks = grant.hostCategory === 'dorahacks' || grant.host.toLowerCase().includes('dorahacks');

    // Title formulation
    const title = `${profile.name} — ${grant.title} Implementation & BUIDL Architecture`;

    // 1. Executive Summary
    const summary = `${profile.name} is an enterprise-grade ${profile.category.toLowerCase()} engineered to resolve critical inefficiencies in modern decentralized operations. Designed with ${profile.stack}, it provides autonomous intelligence and real-time execution with zero data leakage. By integrating with ${grant.host}'s ecosystem (${grant.title}), this project delivers a production-grade interface that expands active builder engagement and verifiable milestone progression.`;

    // 2. Problem Statement
    const problem = `Developers and autonomous systems within the ${grant.host} ecosystem encounter severe operational friction: fragmented data streams, opaque evaluation pipelines, and high overhead costs. Current solutions are centralized, insecure, and lack local-first execution. ${profile.name} eliminates this barrier by providing automated, client-side intelligence that operates without custody risks or vendor lock-in.`;

    // 3. Technical Architecture
    const architecture = isDoraHacks
      ? `Architected natively for Anna AI OS using a sandboxed multi-agent execution matrix. The runtime operates fully client-side with Zero Client-Side Data Leakage. It coordinates 4 specialized autonomous agents (Scout Harvester, Vector Matcher, Proposal Architect, and Jury Critic) utilizing Host LLM Reverse Sampling for deterministic schema validation and sub-second reactive state rendering.`
      : `Built on a modular, local-first architecture combining ${profile.stack}. Features client-side vector cosine similarity calculation, stateful SQLite/local caching primitives, and cryptographic identity attestation to guarantee tamper-proof execution and sybil-resistant submission verification.`;

    // 4. Milestone Gates
    const milestones = [
      `Milestone 1 (Month 1): Core pipeline engineering and sandbox runtime integration. Deliverable: Functional local prototype with live ${grant.host} feed ingestion, automated vector matching, and public open-source repository.`,
      `Milestone 2 (Month 2): End-to-end multi-agent orchestration, interactive red-team jury audit engine, and cross-platform export formatters (Markdown, PDF, and JSON-LD). Deliverable: Public testnet demo with 200+ verified pilot queries.`,
      `Milestone 3 (Month 3): Production deployment on ${grant.host} showcase/marketplace, comprehensive security audit report, and onboarding 500+ active monthly builders.`
    ];

    // 5. Itemized Budget Allocation matching the grant's pool value
    const poolUSD = grant.poolValue || 10000;
    const engineering = Math.round(poolUSD * 0.45);
    const integration = Math.round(poolUSD * 0.25);
    const uiPolish = Math.round(poolUSD * 0.15);
    const securityAudit = Math.round(poolUSD * 0.15);

    const budget = `$${engineering.toLocaleString()} Core Architecture & Agent Runtime Engineering • $${integration.toLocaleString()} ${grant.host} Sandbox & Bridge Integration • $${uiPolish.toLocaleString()} High-Density UI/UX & Keyboard Workflow • $${securityAudit.toLocaleString()} Security Audit, Documentation & Verifiable Testnet Deployment.`;

    return {
      title,
      summary,
      problem,
      architecture,
      milestones,
      budget
    };
  }

  /**
   * Compiles the proposal into standard GitHub-flavored Markdown
   */
  public static compileToMarkdown(proposal: GrantProposal, grant: GrantOpportunity): string {
    return `# ${proposal.title}

> **Target Grant:** ${grant.title} (${grant.host})  
> **Prize Pool:** ${grant.pool}  
> **Evaluation Fit Score:** ${grant.fitScore}% (${grant.fitGrade})  
> **Submission Deadline:** ${grant.deadline}  

---

## 1. Executive Summary
${proposal.summary}

## 2. Problem & Ecosystem Opportunity
${proposal.problem}

## 3. Technical Architecture & Client-Side Innovation
${proposal.architecture}

## 4. Milestones & Verifiable Deliverables
${proposal.milestones.map((m, i) => `### Gate ${i + 1}:\n${m}\n`).join('\n')}

## 5. Itemized Budget Allocation
\`\`\`
${proposal.budget}
\`\`\`

---
*Generated autonomously by GrantHunter AI • DoraHacks BUIDL Standard Verified*
`;
  }
}
