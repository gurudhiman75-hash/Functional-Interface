import { getPrt001QuestionLanguageIds, getPrt001QuestionTemplate, getPrt001QuestionTemplates } from "./library";
import type { Prt001Language } from "./types";

export interface Prt001E7AuditReport {
  readonly audit: string;
  readonly cases: number;
  readonly metrics: Readonly<Record<string, unknown>>;
}

function requireAudit(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function semanticSlot(key: string): string {
  const normalized = key.toLowerCase();
  if (normalized === "business") return "<business>";
  if (normalized.includes("profitratio")) return "<profit-ratio>";
  if (normalized.includes("capitalratio")) return "<capital-ratio>";
  if (normalized.includes("timeratio")) return "<time-ratio>";
  if (normalized.includes("capitalrelation")) return "<capital-relation>";
  if (normalized === "totalcapital") return "<total-capital>";
  if (normalized.includes("capital")) return "<capital>";
  if (normalized.includes("duration") || normalized.includes("month") || normalized.includes("joinafter") || normalized.includes("leaveafter")) return "<time>";
  if (normalized.includes("percentage") || normalized.includes("fractionalchange")) return "<change-rate>";
  if (normalized.includes("commissionpercent")) return "<commission-rate>";
  if (normalized.includes("salary")) return "<salary>";
  if (normalized.includes("allowance")) return "<allowance>";
  if (normalized.includes("deduction")) return "<deduction>";
  if (normalized.includes("reserve")) return "<reserve>";
  if (normalized.includes("expense")) return "<expense>";
  if (normalized.includes("totalloss")) return "<loss>";
  if (normalized.includes("totalprofit")) return "<profit-pool>";
  if (normalized.includes("share") || normalized.includes("receipt")) return "<share>";
  if (normalized.includes("partner")) return "<partner>";
  return `<${normalized.replace(/[^a-z0-9]+/g, "-")}>`;
}

function normalizedSkeleton(template: string): string {
  return template
    .toLocaleLowerCase("en")
    .replace(/\{([^}]+)\}/g, (_match, key: string) => ` ${semanticSlot(key)} `)
    .replace(/\bone[- ]year\b/g, " <period> ")
    .replace(/[^\p{L}\p{N}<>-]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenBigrams(value: string): Set<string> {
  const tokens = value.split(" ").filter(Boolean);
  if (tokens.length < 2) return new Set(tokens);
  return new Set(tokens.slice(0, -1).map((token, index) => `${token} ${tokens[index + 1]}`));
}

function diceSimilarity(left: Set<string>, right: Set<string>): number {
  if (left.size === 0 && right.size === 0) return 1;
  let overlap = 0;
  for (const item of left) if (right.has(item)) overlap += 1;
  return (2 * overlap) / (left.size + right.size);
}

export function auditPrt001ChapterStemSkeletonDepth(): Prt001E7AuditReport {
  const ids = getPrt001QuestionLanguageIds();
  const languages: readonly Prt001Language[] = ["en", "hi", "pa"];
  const perLocaleQl: Record<string, { authoredSkeletons: number; selectedSkeletons: number }> = {};
  let cases = 0;
  for (const language of languages) {
    for (const questionLanguageId of ids) {
      const authored = getPrt001QuestionTemplates(questionLanguageId, language);
      requireAudit(authored.length === 3, `${language}:${questionLanguageId} has ${authored.length} authored stem skeletons instead of 3`);
      requireAudit(new Set(authored).size === 3, `${language}:${questionLanguageId} has duplicate authored stem skeletons`);
      const selected = new Set<string>();
      for (let index = 0; index < 24; index += 1) {
        selected.add(getPrt001QuestionTemplate(questionLanguageId, language, `prt-001:e7-stem:${questionLanguageId}:${language}:${index}`));
        cases += 1;
      }
      requireAudit(selected.size === 3, `${language}:${questionLanguageId} seeded selection reached only ${selected.size}/3 stem skeletons`);
      perLocaleQl[`${language}:${questionLanguageId}`] = { authoredSkeletons: 3, selectedSkeletons: selected.size };
    }
  }
  return {
    audit: "e7-chapter-stem-skeleton-depth",
    cases,
    metrics: { activeQls: ids.length, locales: languages.length, qlLocalePairs: ids.length * languages.length, authoredSkeletonsPerQlPerLocale: 3, perLocaleQl },
  };
}

export function auditPrt001CrossQlStemStructure(): Prt001E7AuditReport {
  const ids = getPrt001QuestionLanguageIds();
  const languages: readonly Prt001Language[] = ["en", "hi", "pa"];
  const exactDuplicates: string[] = [];
  const nearPairs: Array<{ language: Prt001Language; left: string; right: string; score: number }> = [];
  let comparisons = 0;

  for (const language of languages) {
    const templates = ids.flatMap((questionLanguageId) =>
      getPrt001QuestionTemplates(questionLanguageId, language).map((template, variantIndex) => ({
        questionLanguageId,
        variantIndex,
        skeleton: normalizedSkeleton(template),
      })),
    );
    const exactOwner = new Map<string, { questionLanguageId: string; variantIndex: number }>();
    for (const item of templates) {
      const prior = exactOwner.get(item.skeleton);
      if (prior && prior.questionLanguageId !== item.questionLanguageId) {
        exactDuplicates.push(`${language}:${prior.questionLanguageId}#${prior.variantIndex + 1}<->${item.questionLanguageId}#${item.variantIndex + 1}`);
      } else if (!prior) {
        exactOwner.set(item.skeleton, { questionLanguageId: item.questionLanguageId, variantIndex: item.variantIndex });
      }
    }

    const bigrams = templates.map((item) => ({ ...item, bigrams: tokenBigrams(item.skeleton) }));
    for (let leftIndex = 0; leftIndex < bigrams.length; leftIndex += 1) {
      const left = bigrams[leftIndex]!;
      for (let rightIndex = leftIndex + 1; rightIndex < bigrams.length; rightIndex += 1) {
        const right = bigrams[rightIndex]!;
        if (left.questionLanguageId === right.questionLanguageId) continue;
        const score = diceSimilarity(left.bigrams, right.bigrams);
        comparisons += 1;
        if (score >= 0.88) {
          nearPairs.push({
            language,
            left: `${left.questionLanguageId}#${left.variantIndex + 1}`,
            right: `${right.questionLanguageId}#${right.variantIndex + 1}`,
            score: Number(score.toFixed(3)),
          });
        }
      }
    }
  }

  requireAudit(exactDuplicates.length === 0, `cross-QL normalized stem duplicates: ${exactDuplicates.join(", ")}`);
  const severeNearPairs = nearPairs.filter((item) => item.score >= 0.985);
  requireAudit(severeNearPairs.length === 0, `cross-QL near-identical stem skeletons: ${severeNearPairs.map((item) => `${item.language}:${item.left}<->${item.right}@${item.score}`).join(", ")}`);
  nearPairs.sort((left, right) => right.score - left.score || left.left.localeCompare(right.left));
  return {
    audit: "e7-cross-ql-stem-structure",
    cases: comparisons,
    metrics: {
      normalizedExactDuplicates: exactDuplicates.length,
      severeNearIdenticalPairs: severeNearPairs.length,
      semanticSlotNormalization: true,
      editorialNearSimilarityThreshold: 0.88,
      blockingNearIdentityThreshold: 0.985,
      nearSimilarityPairs: nearPairs.length,
      highestSimilarityPairs: nearPairs.slice(0, 30),
    },
  };
}
