import type { CorpusSchedulerSummary } from "./corpus-scheduler";

export type CorpusQualityTier = "S" | "A" | "B" | "C";

export type CorpusQualityReport = {
  score: number;
  tier: CorpusQualityTier;
  dimensions: {
    topologyBalance: number;
    semanticDiversity: number;
    trapDiversity: number;
    duplicateResistance: number;
    difficultyPacing: number;
    examinerIntentCoverage: number;
  };
  strengths: string[];
  risks: string[];
};

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function entropyScore(distribution: Record<string, number>) {
  const counts = Object.values(distribution);
  const total = counts.reduce((sum, count) => sum + count, 0);
  if (total === 0 || counts.length <= 1) return 45;
  const entropy = counts.reduce((sum, count) => {
    const p = count / total;
    return p <= 0 ? sum : sum - p * Math.log2(p);
  }, 0);
  const maxEntropy = Math.log2(counts.length);
  return clamp((entropy / Math.max(0.1, maxEntropy)) * 100);
}

function tierFor(score: number): CorpusQualityTier {
  if (score >= 90) return "S";
  if (score >= 82) return "A";
  if (score >= 72) return "B";
  return "C";
}

export function evaluateCorpusQuality(
  summary: CorpusSchedulerSummary,
): CorpusQualityReport {
  const acceptedCount = Math.max(1, summary.acceptedCount);
  const isLargeAuditCorpus = acceptedCount >= 1000;
  const topologyBalance = entropyScore(summary.topologyGroupDistribution);
  const semanticDiversity = entropyScore(summary.semanticAnchorDistribution);
  const trapDiversity = entropyScore(summary.distractorTrapDistribution);
  const examinerIntentCoverage = entropyScore(summary.examinerIntentDistribution);
  const duplicateResistance = clamp(
    100 -
      summary.duplicateRisk.repeatedFingerprintShare *
        (isLargeAuditCorpus ? 70 : 160),
  );
  const hardCount = summary.difficultyDistribution.hard ?? 0;
  const total = acceptedCount;
  const hardShare = hardCount / total;
  const difficultyPacing = clamp(
    92 -
      Math.abs(hardShare - 0.2) * 90 -
      summary.pacingReport.events.length * 4,
  );
  const dimensions = {
    topologyBalance,
    semanticDiversity,
    trapDiversity,
    duplicateResistance,
    difficultyPacing,
    examinerIntentCoverage,
  };
  const score = clamp(
    topologyBalance * 0.2 +
      semanticDiversity * 0.16 +
      trapDiversity * 0.16 +
      duplicateResistance * 0.18 +
      difficultyPacing * 0.14 +
      examinerIntentCoverage * 0.16 -
      summary.balanceWarnings.length * (isLargeAuditCorpus ? 2 : 4),
  );
  const strengths: string[] = [];
  const risks: string[] = [];

  if (topologyBalance >= 82) strengths.push("topology mix is well distributed");
  else risks.push("topology mix still has clustering risk");

  if (semanticDiversity >= 82) strengths.push("semantic anchors are varied");
  else risks.push("semantic anchors repeat too often");

  if (trapDiversity >= 80) strengths.push("distractor traps cover multiple mistake modes");
  else risks.push("distractor trap variety is thin");

  if (duplicateResistance >= 78) strengths.push("fingerprint collision risk is controlled");
  else risks.push("fingerprint collision risk remains high");

  if (difficultyPacing >= 80) strengths.push("difficulty pacing is exam-like");
  else risks.push("difficulty pacing needs smoother sequencing");

  for (const warning of summary.balanceWarnings) {
    risks.push(warning);
  }

  return {
    score,
    tier: tierFor(score),
    dimensions,
    strengths,
    risks,
  };
}
