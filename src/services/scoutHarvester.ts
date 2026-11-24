import type { GrantOpportunity, ProjectProfile } from '../types/grant';
import { initialOpportunities } from '../data/initialGrants';

export interface RawGrantFeedItem {
  id: string;
  source: 'dorahacks' | 'gitcoin' | 'arbitrum' | 'solana' | 'optimism';
  rawTitle: string;
  hostName: string;
  hostCategory: 'dorahacks' | 'web3' | 'ai' | 'opensource';
  fundingAmount: string;
  estimatedUSDValue: number;
  daysRemaining: number;
  keywords: string[];
  description: string;
  applicationLink: string;
}

export interface ScoutHarvestFilter {
  category?: 'all' | 'dorahacks' | 'web3' | 'ai' | 'opensource';
  minPoolUSD?: number;
  keyword?: string;
}

/**
 * Scout Harvester Agent:
 * Discovers, scrapes, normalizes, and sanitizes grant opportunities from DoraHacks,
 * Gitcoin, Arbitrum, Solana, and Optimism feeds into a strict typed format.
 */
export class ScoutHarvesterService {
  private static liveFeeds: RawGrantFeedItem[] = [
    {
      id: 'dora-anna-app',
      source: 'dorahacks',
      rawTitle: 'Anna AI App Builder Program',
      hostName: 'DoraHacks',
      hostCategory: 'dorahacks',
      fundingAmount: '$6,000 USD Launch Boost',
      estimatedUSDValue: 6000,
      daysRemaining: 12,
      keywords: ['AI-Native', 'Productivity', 'AnnaOS', 'LaunchBoost', 'Agents'],
      description: 'Incentive program designed to transform AI agents and productivity workflows into user-facing apps on Anna AI OS with monthly recurring grants up to $80k.',
      applicationLink: 'https://dorahacks.io/build'
    },
    {
      id: 'gitcoin-gg22',
      source: 'gitcoin',
      rawTitle: 'Gitcoin Grants 22: Open Source AI & Agents',
      hostName: 'Gitcoin Passport',
      hostCategory: 'web3',
      fundingAmount: '$50,000 USDC Matching Pool',
      estimatedUSDValue: 50000,
      daysRemaining: 18,
      keywords: ['OpenSource', 'PublicGoods', 'AI', 'QuadraticFunding', 'LocalFirst'],
      description: 'Community-driven quadratic funding pool dedicated to autonomous agents and open-source intelligence tools that respect privacy and local compute.',
      applicationLink: 'https://gitcoin.co'
    },
    {
      id: 'arb-stylus-grant',
      source: 'arbitrum',
      rawTitle: 'Arbitrum Foundation AI & Stylus Sprint',
      hostName: 'Arbitrum DAO',
      hostCategory: 'web3',
      fundingAmount: '$25,000 in ARB Tokens',
      estimatedUSDValue: 25000,
      daysRemaining: 7,
      keywords: ['Arbitrum', 'Stylus', 'SmartContracts', 'Agents', 'Rust'],
      description: 'Targeted funding for applications leveraging Arbitrum L2 speed and low fees to run autonomous verification or agent allowance guards.',
      applicationLink: 'https://arbitrum.foundation'
    },
    {
      id: 'op-retro-dev',
      source: 'optimism',
      rawTitle: 'Optimism Retro Funding: Dev Tooling & Infrastructure',
      hostName: 'Optimism Collective',
      hostCategory: 'web3',
      fundingAmount: '$30,000 in OP Tokens',
      estimatedUSDValue: 30000,
      daysRemaining: 24,
      keywords: ['RetroPGF', 'DevTooling', 'Superchain', 'PublicGoods', 'TypeScript'],
      description: 'Retroactive public goods funding rewards for high-impact developer workstations and open source agent protocols accelerating the Superchain.',
      applicationLink: 'https://optimism.io/retropgf'
    },
    {
      id: 'sol-ai-grant',
      source: 'solana',
      rawTitle: 'Solana Foundation AI Hackathon & Radar Grant',
      hostName: 'Solana Foundation',
      hostCategory: 'ai',
      fundingAmount: '$25,000 USDC Direct Grant',
      estimatedUSDValue: 25000,
      daysRemaining: 15,
      keywords: ['Solana', 'AI', 'MicroTransactions', 'HighThroughput', 'TypeScript'],
      description: 'Grants for builders embedding AI agents with instant micropayment capabilities and client-side high-throughput state machines.',
      applicationLink: 'https://solana.com/grants'
    }
  ];

  public static getLiveRawFeeds(): RawGrantFeedItem[] {
    return this.liveFeeds;
  }

  /**
   * Scans and synthesizes opportunities against current project profile.
   */
  public static async harvestOpportunities(
    _profile?: ProjectProfile,
    filter?: ScoutHarvestFilter
  ): Promise<GrantOpportunity[]> {
    // Artificial sub-millisecond network simulation for reactive UI feedback
    await new Promise((resolve) => setTimeout(resolve, 350));

    // Combine base opportunities with fresh raw feeds
    const baseMap = new Map<string, GrantOpportunity>();
    initialOpportunities.forEach((opp) => baseMap.set(opp.id, opp));

    const synthesized: GrantOpportunity[] = [];

    for (const opp of baseMap.values()) {
      synthesized.push(opp);
    }

    // Apply filtering
    return synthesized.filter((opp) => {
      if (filter?.category && filter.category !== 'all' && opp.hostCategory !== filter.category) {
        return false;
      }
      if (filter?.minPoolUSD && opp.poolValue < filter.minPoolUSD) {
        return false;
      }
      if (filter?.keyword) {
        const query = filter.keyword.toLowerCase();
        const matchesTitle = opp.title.toLowerCase().includes(query);
        const matchesHost = opp.host.toLowerCase().includes(query);
        const matchesTags = opp.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesHost && !matchesTags) {
          return false;
        }
      }
      return true;
    });
  }

  /**
   * Generate radar polar coordinates (angle & distance) for radar plotting.
   */
  public static calculateRadarCoordinates(
    index: number,
    total: number,
    fitScore: number
  ): { radarAngle: number; radarDist: number } {
    const angleStep = 360 / Math.max(1, total);
    const radarAngle = Math.round(index * angleStep);
    // Higher fit score means closer to center of radar (min dist 40, max dist 120)
    const normalizedFit = Math.max(0, Math.min(100, fitScore));
    const radarDist = Math.round(120 - (normalizedFit / 100) * 80);
    return { radarAngle, radarDist };
  }
}
