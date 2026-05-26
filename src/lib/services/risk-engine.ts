import type { AlphaVantageOverview } from "@/lib/providers/alpha-vantage";
import type { RiskLevel } from "@/lib/types/stock";

const SECTOR_RISK_MODIFIER: Record<string, number> = {
  Technology: 0.15,
  Finance: 0.1,
  Energy: 0.2,
  Healthcare: 0.05,
  Consumer: 0.08,
  Telecom: 0.12,
  Materials: 0.14,
  Industrials: 0.12,
  "Real Estate": 0.1,
};

type RiskInput = {
  sector: string;
  dailyChangePercent: number;
  weeklyChangePercent?: number;
  overview?: AlphaVantageOverview | null;
};

function scoreVolatility(
  dailyChangePercent: number,
  weeklyChangePercent?: number,
): number {
  const dailyVolatility = Math.abs(dailyChangePercent);
  const weeklyVolatility = Math.abs(
    weeklyChangePercent ?? dailyVolatility * 2,
  );

  if (dailyVolatility >= 4 || weeklyVolatility >= 8) return 0.9;
  if (dailyVolatility >= 2 || weeklyVolatility >= 4) return 0.55;
  return 0.2;
}

function scoreBeta(beta?: number): number {
  if (typeof beta !== "number") return 0.35;
  if (beta >= 1.5) return 0.85;
  if (beta >= 1.1) return 0.6;
  if (beta <= 0.8) return 0.15;
  return 0.35;
}

function scoreFundamentals(overview?: AlphaVantageOverview | null): number {
  if (!overview) return 0.35;

  let score = 0.35;

  if (typeof overview.peRatio === "number") {
    if (overview.peRatio > 45) score += 0.2;
    else if (overview.peRatio < 15) score -= 0.05;
  }

  if (typeof overview.profitMargin === "number") {
    if (overview.profitMargin < 0) score += 0.15;
    else if (overview.profitMargin > 0.15) score -= 0.05;
  }

  return Math.min(Math.max(score, 0), 1);
}

export function deriveCompositeRiskLevel(input: RiskInput): RiskLevel {
  const sectorModifier = SECTOR_RISK_MODIFIER[input.sector] ?? 0.1;
  const volatilityScore = scoreVolatility(
    input.dailyChangePercent,
    input.weeklyChangePercent,
  );
  const betaScore = scoreBeta(input.overview?.beta);
  const fundamentalsScore = scoreFundamentals(input.overview);

  const composite =
    volatilityScore * 0.45 +
    betaScore * 0.3 +
    fundamentalsScore * 0.15 +
    sectorModifier;

  if (composite >= 0.65) return "high";
  if (composite >= 0.4) return "medium";
  return "low";
}
