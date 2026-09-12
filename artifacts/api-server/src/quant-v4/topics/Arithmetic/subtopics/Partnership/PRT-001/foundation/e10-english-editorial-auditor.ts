import objectPoolsSource from "../object-pools.library.json" assert { type: "json" };
import {
  getPrt001QuestionLanguageIds,
  getPrt001QuestionTemplates,
} from "./library";
import { runPrt001PilotPipeline } from "./pipeline";

interface ObjectPools {
  partnerPairs: [string, string][];
  businesses: string[];
}

export interface Prt001E10EditorialReport {
  readonly audit: string;
  readonly cases: number;
  readonly metrics: Readonly<Record<string, unknown>>;
}

const BASELINE_INVERSE_QLS = new Set([
  "PRT-QL-011",
  "PRT-QL-012",
  "PRT-QL-015",
  "PRT-QL-019",
  "PRT-QL-020",
  "PRT-QL-023",
  "PRT-QL-028",
  "PRT-QL-032",
]);

const GENERIC_EXPLANATION_PHRASES = [
  "Translate the stated profit or final-receipt condition",
  "one linear unknown",
  "Solving and substituting back",
  "question condition",
];

function requireAudit(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function assertEnglishSurface(text: string, label: string): void {
  requireAudit(text.trim() === text, `${label} has leading/trailing whitespace`);
  requireAudit(!/\s{2,}/.test(text), `${label} has repeated whitespace`);
  requireAudit(!/undefined|NaN|Infinity/.test(text), `${label} leaks an internal token`);
  requireAudit(!/\ba\s+(?:electronics|online)\b/i.test(text), `${label} has an article error: ${text}`);
  requireAudit(!/\ban\s+(?:trading|retail|small|dealership|wholesale|logistics|digital|food|construction|garment|consumer|book)\b/i.test(text), `${label} has an article error: ${text}`);
}

function assertCleanAuthoredTemplate(text: string, label: string): void {
  assertEnglishSurface(text, label);
  const withoutPlaceholders = text.replace(/\{[A-Za-z][A-Za-z0-9]*\}/g, "");
  requireAudit(!/[{}]/.test(withoutPlaceholders), `${label} contains a malformed authored placeholder`);
}

function assertCleanRenderedText(text: string, label: string): void {
  assertEnglishSurface(text, label);
  requireAudit(!/[{}]/.test(text), `${label} contains an unresolved authored placeholder`);
}

export function auditPrt001E10EnglishEditorial(): Prt001E10EditorialReport {
  const ids = getPrt001QuestionLanguageIds();
  const objectPools = objectPoolsSource as unknown as ObjectPools;
  let cases = 0;
  let stemSkeletons = 0;
  let generatedQuestions = 0;
  let explanationLines = 0;
  const inverseEquationQls = new Set<string>();

  requireAudit(ids.length === 112, `E10/E13 expects 112 active QLs, got ${ids.length}`);
  requireAudit(objectPools.businesses.length >= 12, "E10 requires at least 12 business contexts");
  for (const business of objectPools.businesses) {
    requireAudit(!/^[aeiou]/i.test(business), `business context is unsafe after the authored article "a": ${business}`);
  }

  for (const questionLanguageId of ids) {
    const templates = getPrt001QuestionTemplates(questionLanguageId, "en");
    requireAudit(templates.length === 3, `${questionLanguageId} does not have exactly 3 English authored stems`);
    for (const [variantIndex, template] of templates.entries()) {
      assertCleanAuthoredTemplate(template, `${questionLanguageId}#${variantIndex + 1}`);
      requireAudit(template.length >= 45 && template.length <= 780, `${questionLanguageId}#${variantIndex + 1} has implausible authored stem length ${template.length}`);
      stemSkeletons += 1;
      cases += 1;
    }

    for (let seedIndex = 0; seedIndex < 8; seedIndex += 1) {
      const pkg = runPrt001PilotPipeline({
        questionLanguageId,
        seed: `prt-001:e10-editorial:${questionLanguageId}:${seedIndex}`,
        language: "en",
      });
      requireAudit(pkg.validation.valid, `${questionLanguageId} failed generation at E10 seed ${seedIndex}`);
      assertCleanRenderedText(pkg.stem, `${questionLanguageId}:rendered:${seedIndex}`);
      requireAudit(pkg.stem.length >= 45 && pkg.stem.length <= 900, `${questionLanguageId} rendered stem length ${pkg.stem.length} is outside editorial bounds`);
      requireAudit(pkg.explanation.lines.length >= 2 && pkg.explanation.lines.length <= 5, `${questionLanguageId} explanation has ${pkg.explanation.lines.length} lines`);
      const explanation = pkg.explanation.lines.join(" ");
      assertCleanRenderedText(explanation, `${questionLanguageId}:explanation:${seedIndex}`);
      requireAudit(pkg.explanation.lines.every((line) => line.length <= 430), `${questionLanguageId} has an overlong explanation line`);
      for (const phrase of GENERIC_EXPLANATION_PHRASES) {
        requireAudit(!explanation.includes(phrase), `${questionLanguageId} still uses generic explanation phrase: ${phrase}`);
      }
      requireAudit(!/\b(?:SALARY|COMMISSION|RESERVE|CHARITY|EXPENSE|BONUS|INTEREST_ON_CAPITAL)\b/.test(explanation), `${questionLanguageId} exposes an internal allocation enum in English prose`);
      requireAudit(explanation.includes(pkg.answer), `${questionLanguageId} explanation does not state the computed answer`);
      if (BASELINE_INVERSE_QLS.has(questionLanguageId)) {
        requireAudit(/[×=]/.test(explanation), `${questionLanguageId} inverse explanation lacks an explicit equation/working marker`);
        inverseEquationQls.add(questionLanguageId);
      }
      generatedQuestions += 1;
      explanationLines += pkg.explanation.lines.length;
      cases += 1;
    }
  }

  requireAudit(inverseEquationQls.size === BASELINE_INVERSE_QLS.size, `only ${inverseEquationQls.size}/${BASELINE_INVERSE_QLS.size} baseline inverse QLs showed concrete working`);

  return {
    audit: "e10-english-editorial",
    cases,
    metrics: {
      activeQls: ids.length,
      authoredEnglishStemSkeletons: stemSkeletons,
      generatedEnglishQuestions: generatedQuestions,
      explanationLinesReviewed: explanationLines,
      genericExplanationPhrasesFound: 0,
      internalAllocationEnumsFound: 0,
      articleUnsafeBusinessContexts: 0,
      baselineInverseQlsWithConcreteWorking: inverseEquationQls.size,
      baselineInverseQlTarget: BASELINE_INVERSE_QLS.size,
      localizedE7NearSimilaritySignalsDeferredToE11: 6,
    },
  };
}
