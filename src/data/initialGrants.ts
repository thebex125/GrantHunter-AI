import type { GrantOpportunity, ProjectProfile } from '../types/grant';

export const defaultProjectProfile: ProjectProfile = {
  name: "AutoBrief AI",
  tagline: "Autonomous Meeting Intelligence & Execution Matrix for Modern Engineering Teams",
  stack: "React 18, TypeScript, Tailwind CSS, Anna AI OS, Framer Motion",
  category: "AI-Native Productivity",
  stage: "Working MVP / Production-Ready",
};

export const initialOpportunities: GrantOpportunity[] = [
  {
    id: 'anna-ai',
    title: 'Anna AI App Builder Program',
    host: 'DoraHacks',
    hostCategory: 'dorahacks',
    pool: '$6,000 USD Launch Boost',
    poolValue: 6000,
    deadline: '12 Days Left',
    fitScore: 96,
    fitGrade: 'High Fit',
    tags: ['#AI-Native', '#Productivity', '#AnnaOS', '#LaunchBoost'],
    summary: 'Incentive program designed to transform AI agents and productivity workflows into user-facing apps on Anna AI OS with monthly recurring grants up to $80k.',
    radarAngle: 45,
    radarDist: 70,
    externalUrl: 'https://dorahacks.io/build',
    proposal: {
      title: "AutoBrief AI — Autonomous Meeting Intelligence & Action Matrix for Anna OS",
      summary: "AutoBrief AI transforms unstructured stakeholder dialogues, audio discussions, and sprint meetings into executable, high-precision task matrices with dynamic PIC assignment and multi-channel follow-up.",
      problem: "Over 70% of engineering and executive time is lost to post-meeting administrative friction. Existing transcription apps merely produce static walls of unreviewed text without translating decisions into accountability.",
      architecture: "Built natively for Anna AI OS using a sandboxed multi-agent pipeline. Operates fully client-side with zero data leakage, leveraging Anna Host LLM Reverse Sampling for deterministic task breakdown and schema verification.",
      milestones: [
        "Milestone 1 (Month 1): Core Anna OS sandbox runtime integration, local audio analysis pipeline, and task matrix editor.",
        "Milestone 2 (Month 2): Multi-channel notification dispatchers (Telegram, Discord, Slack) and automated calendar task sync.",
        "Milestone 3 (Month 3): Anna Marketplace publishing, reaching 200+ Qualified MAU threshold for ongoing monthly grants."
      ],
      budget: "$2,500 Core Pipeline Engineering • $1,500 Anna OS Host Bridge Integration • $1,200 UI/UX Polishing • $800 Documentation & Security Audit."
    }
  },
  {
    id: 'gitcoin-grants-22',
    title: 'Gitcoin Grants 22: Open Source AI',
    host: 'Gitcoin Passport',
    hostCategory: 'web3',
    pool: '$50,000 USDC Matching Pool',
    poolValue: 50000,
    deadline: '18 Days Left',
    fitScore: 91,
    fitGrade: 'Great Fit',
    tags: ['#OpenSource', '#PublicGoods', '#AI', '#QuadraticFunding'],
    summary: 'Community-driven quadratic funding pool dedicated to autonomous agents and open-source intelligence tools that respect privacy and local compute.',
    radarAngle: 135,
    radarDist: 90,
    externalUrl: 'https://gitcoin.co',
    proposal: {
      title: "Public Good AI Agent Runtime: GrantHunter & Local Workflow Protocol",
      summary: "An open-source, local-first multi-agent coordination protocol designed to equalize capital access for emerging builders globally.",
      problem: "Emerging market innovators are systematically excluded from grant capital due to language barriers, lack of legal counsel, and complex proposal guidelines.",
      architecture: "Decentralized registry of grant feeds with local vector embeddings. Pure client-side execution using WebLLM and local sandboxing.",
      milestones: [
        "Milestone 1: Open source repository and documentation with Apache 2.0 licensing.",
        "Milestone 2: Gitcoin passport integration for sybil-resistant opportunity verification.",
        "Milestone 3: Public community testnet deployment with 1,000+ active builder grants processed."
      ],
      budget: "$15,000 Core Open Source SDK • $15,000 Quadratic Integration • $10,000 Community Education • $10,000 Security Reviews."
    }
  },
  {
    id: 'arbitrum-stylus',
    title: 'Arbitrum Foundation AI & Stylus Sprint',
    host: 'Arbitrum DAO',
    hostCategory: 'web3',
    pool: '$25,000 in ARB Tokens',
    poolValue: 25000,
    deadline: '7 Days Left',
    fitScore: 88,
    fitGrade: 'Great Fit',
    tags: ['#Arbitrum', '#Stylus', '#SmartContracts', '#Agents'],
    summary: 'Targeted funding for applications leveraging Arbitrum L2 speed and low fees to run autonomous verification or agent allowance guards.',
    radarAngle: 210,
    radarDist: 110,
    externalUrl: 'https://arbitrum.foundation',
    proposal: {
      title: "On-Chain Escrow & Allowance Guard for Autonomous Agent Workflows",
      summary: "Smart contract settlement primitives that allow AI agents to securely purchase compute and settle task completion on Arbitrum One.",
      problem: "AI agents cannot independently hold financial liability or manage API credits without risking account drain or infinite spending loops.",
      architecture: "Arbitrum Stylus (Rust/WASM) verified spending contracts with daily allowance limits and timelock emergency revocations.",
      milestones: [
        "Milestone 1: Stylus smart contracts written in Rust and deployed to Arbitrum Sepolia.",
        "Milestone 2: Agent SDK integration with client-side allowance monitoring.",
        "Milestone 3: Mainnet audit and deployment on Arbitrum One."
      ],
      budget: "$12,000 Smart Contract Engineering • $8,000 Audit & Formal Verification • $5,000 Frontend & Documentation."
    }
  },
  {
    id: 'optimism-retropgf',
    title: 'Optimism Retro Funding: Dev Tooling',
    host: 'Optimism Collective',
    hostCategory: 'web3',
    pool: '100,000 OP Tokens',
    poolValue: 150000,
    deadline: '24 Days Left',
    fitScore: 84,
    fitGrade: 'Good Fit',
    tags: ['#RetroFunding', '#OPStack', '#DevTools', '#Impact'],
    summary: 'Retroactive rewards for tools that have demonstrably accelerated developer onboarding and project creation across the Superchain.',
    radarAngle: 290,
    radarDist: 125,
    externalUrl: 'https://app.optimism.io/retropgf',
    proposal: {
      title: "Superchain Opportunity Swarm: Scaling Developer Onboarding",
      summary: "Automated grant discovery and onboarding pipeline bringing non-dilutive resources to 500+ developers building across the Superchain.",
      problem: "Fragmented ecosystem funding across Base, Mode, Zora, and OP Mainnet causes builder exhaustion and duplicative administrative work.",
      architecture: "Aggregated Superchain feed indexer with cross-chain grant tracking and automated project milestone delivery verifier.",
      milestones: [
        "Milestone 1: Indexing 100% of Superchain grant programs.",
        "Milestone 2: Generating automated proposal kits for 500+ active developers.",
        "Milestone 3: On-chain impact metric dashboard."
      ],
      budget: "Retroactive impact reward based on developer adoption and total grant volume claimed."
    }
  },
  {
    id: 'solana-radar',
    title: 'Solana Global AI Agent Bounty',
    host: 'Superteam Earn',
    hostCategory: 'web3',
    pool: '$10,000 USDC',
    poolValue: 10000,
    deadline: '5 Days Left',
    fitScore: 78,
    fitGrade: 'Viable Match',
    tags: ['#Solana', '#Superteam', '#AI-Agents', '#MicroBounty'],
    summary: 'Fast-track bounty for building real-world AI agent applications that interact with Solana Actions & Blinks.',
    radarAngle: 330,
    radarDist: 140,
    externalUrl: 'https://earn.superteam.fun',
    proposal: {
      title: "Solana Blink: 1-Click Grant Proposal Submission for Builders",
      summary: "Turn grant opportunities into viral Solana Blinks where community members can co-sponsor and vote on proposals directly inside X feeds.",
      problem: "Hackathon submissions are siloed in web dashboards with zero viral distribution across social channels.",
      architecture: "Solana Actions protocol metadata generator connected to GrantHunter autonomous proposal synthesis engine.",
      milestones: [
        "Milestone 1: Solana Action API endpoint for grant card generation.",
        "Milestone 2: Blink preview rendering for X/Twitter feeds.",
        "Milestone 3: Community micro-grant tip jar escrow."
      ],
      budget: "$5,000 Solana Actions Engineering • $3,000 UI/UX • $2,000 Marketing."
    }
  },
  {
    id: 'dorahacks-ai-hack',
    title: 'DoraHacks AI-Native App Championship',
    host: 'DoraHacks Global',
    hostCategory: 'dorahacks',
    pool: '$15,000 USD',
    poolValue: 15000,
    deadline: '9 Days Left',
    fitScore: 94,
    fitGrade: 'High Fit',
    tags: ['#AI-Agents', '#DoraHacks', '#OpenSource', '#Fullstack'],
    summary: 'Global championship for AI-first applications demonstrating multi-agent workflows, autonomous reasoning, and clean production UI.',
    radarAngle: 80,
    radarDist: 75,
    externalUrl: 'https://dorahacks.io/build',
    proposal: {
      title: "GrantHunter AI: The Autonomous Capital Discovery Swarm",
      summary: "Empowering 500,000+ global builders to effortlessly discover, match, and apply for non-dilutive hackathon and grant capital in under 120 seconds.",
      problem: "80% of eligible developers never apply for grants due to bureaucratic proposal friction and lack of clarity on jury criteria.",
      architecture: "4-Agent Autonomous Swarm (Scout Harvester -> Vector Matcher -> Proposal Drafter -> Jury Red-Team) built in TypeScript & React.",
      milestones: [
        "Milestone 1: Live Radar visualization and multi-agent feed parser.",
        "Milestone 2: Deterministic proposal generation with side-by-side jury scorecard.",
        "Milestone 3: 1-Click DoraHacks BUIDL submission integration."
      ],
      budget: "$6,000 Multi-Agent Pipeline • $4,000 Frontend & Framer Motion • $3,000 API Infrastructure • $2,000 Pitch Deck & Marketing."
    }
  }
];
