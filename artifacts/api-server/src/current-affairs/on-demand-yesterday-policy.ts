export const ON_DEMAND_YESTERDAY_STAGES = [
  "official_source_refresh",
  "official_candidate_reclassification",
  "primary_fact_enrichment",
  "manual_authority_guard",
  "intelligence_and_strict_verification",
  "post_promotion_enrichment_reconciliation",
  "historical_claim_rebuild_and_reverification",
  "draft_authoring_localization_and_questions",
] as const;

export type YesterdayArtifactIdentity = {
  family: string;
  language: string;
};

const REQUIRED_FAMILIES = ["ssc", "banking", "punjab"] as const;
const REQUIRED_LANGUAGES = ["en", "hi", "pa"] as const;

export function yesterdayPackCompleteness(artifacts: YesterdayArtifactIdentity[]) {
  const keys = new Set(artifacts.map((item) => `${item.family}:${item.language}`));
  const missing: string[] = [];
  for (const family of REQUIRED_FAMILIES) {
    for (const language of REQUIRED_LANGUAGES) {
      if (!keys.has(`${family}:${language}`)) missing.push(`${family}:${language}`);
    }
  }
  return {
    allEnglishDraftsPresent: REQUIRED_FAMILIES.every((family) => keys.has(`${family}:en`)),
    allLocalizedDraftsPresent: REQUIRED_FAMILIES.every((family) => keys.has(`${family}:hi`) && keys.has(`${family}:pa`)),
    allNineDraftsPresent: missing.length === 0,
    missing,
  };
}

export function shouldContinueBoundedPass(args: { seen: number; batchLimit: number; skipped?: boolean }) {
  if (args.skipped) return false;
  return Number.isFinite(args.seen) && args.seen >= args.batchLimit;
}
