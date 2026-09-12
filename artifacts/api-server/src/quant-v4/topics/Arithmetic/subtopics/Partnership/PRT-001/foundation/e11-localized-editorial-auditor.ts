import {
  getPrt001QuestionLanguageIds,
  getPrt001QuestionTemplates,
} from "./library";
import { auditPrt001CrossQlStemStructure } from "./e7-stem-structure-auditor";
import { runPrt001PilotPipeline } from "./pipeline";
import type { Prt001Language } from "./types";

export interface Prt001E11EditorialReport {
  readonly audit: string;
  readonly cases: number;
  readonly metrics: Readonly<Record<string, unknown>>;
}

const LOCALIZED_LANGUAGES: readonly Prt001Language[] = ["hi", "pa"];
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
const INTERNAL_ALLOCATION_ENUMS = /\b(?:SALARY|COMMISSION|RESERVE|CHARITY|EXPENSE|BONUS|INTEREST_ON_CAPITAL)\b/;
const HINDI_GENERIC = /प्रश्न में दी गई शर्त लागू|अज्ञात राशि या समय इसी संबंध/;
const PUNJABI_GENERIC = /ਸਵਾਲ ਦੀ ਦਿੱਤੀ ਸ਼ਰਤ ਲਾਗੂ|ਅਣਜਾਣ ਰਕਮ ਜਾਂ ਸਮਾਂ ਇਸੇ ਸੰਬੰਧ/;

function requireAudit(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function hasNativeScript(value: string, language: Prt001Language): boolean {
  if (language === "hi") return /[\u0900-\u097F]/.test(value);
  if (language === "pa") return /[\u0A00-\u0A7F]/.test(value);
  return true;
}

function assertLocalizedSurface(value: string, language: Prt001Language, label: string, allowPlaceholders = false): void {
  requireAudit(value.trim() === value, `${label} has leading/trailing whitespace`);
  requireAudit(!/\s{2,}/.test(value), `${label} has repeated whitespace`);
  requireAudit(!/undefined|NaN|Infinity/.test(value), `${label} leaks an internal token`);
  requireAudit(!INTERNAL_ALLOCATION_ENUMS.test(value), `${label} leaks an allocation enum`);
  requireAudit(language !== "hi" || !HINDI_GENERIC.test(value), `${label} still contains generic Hindi explanation filler`);
  requireAudit(language !== "pa" || !PUNJABI_GENERIC.test(value), `${label} still contains generic Punjabi explanation filler`);
  requireAudit(hasNativeScript(value, language), `${label} lacks the expected native script`);
  if (allowPlaceholders) {
    const withoutPlaceholders = value.replace(/\{[A-Za-z][A-Za-z0-9]*\}/g, "");
    requireAudit(!/[{}]/.test(withoutPlaceholders), `${label} contains a malformed authored placeholder`);
  } else {
    requireAudit(!/[{}]/.test(value), `${label} contains an unresolved authored placeholder`);
  }
}

export function auditPrt001E11LocalizedEditorial(): Prt001E11EditorialReport {
  const ids = getPrt001QuestionLanguageIds();
  let cases = 0;
  let authoredStemSkeletons = 0;
  let renderedQuestions = 0;
  let explanationLines = 0;
  const inverseEquationQlsByLocale: Record<string, Set<string>> = {
    hi: new Set<string>(),
    pa: new Set<string>(),
  };

  requireAudit(ids.length === 112, `E11/E13 expects 112 active QLs, got ${ids.length}`);

  for (const language of LOCALIZED_LANGUAGES) {
    for (const questionLanguageId of ids) {
      const templates = getPrt001QuestionTemplates(questionLanguageId, language);
      requireAudit(templates.length === 3, `${language}:${questionLanguageId} does not have exactly three authored stems`);
      for (const [variantIndex, template] of templates.entries()) {
        assertLocalizedSurface(template, language, `${language}:${questionLanguageId}#${variantIndex + 1}`, true);
        requireAudit(template.length >= 35 && template.length <= 900, `${language}:${questionLanguageId}#${variantIndex + 1} has implausible stem length ${template.length}`);
        authoredStemSkeletons += 1;
        cases += 1;
      }

      for (let seedIndex = 0; seedIndex < 8; seedIndex += 1) {
        const pkg = runPrt001PilotPipeline({
          questionLanguageId,
          language,
          seed: `prt-001:e11-editorial:${language}:${questionLanguageId}:${seedIndex}`,
        });
        requireAudit(pkg.validation.valid, `${language}:${questionLanguageId} failed generation at E11 seed ${seedIndex}`);
        assertLocalizedSurface(pkg.stem, language, `${language}:${questionLanguageId}:rendered:${seedIndex}`);
        requireAudit(pkg.explanation.lines.length >= 2 && pkg.explanation.lines.length <= 5, `${language}:${questionLanguageId} explanation has ${pkg.explanation.lines.length} lines`);
        const explanation = pkg.explanation.lines.join(" ");
        assertLocalizedSurface(explanation, language, `${language}:${questionLanguageId}:explanation:${seedIndex}`);
        requireAudit(pkg.explanation.lines.every((line) => line.length <= 520), `${language}:${questionLanguageId} has an overlong explanation line`);
        requireAudit(explanation.includes(pkg.answer), `${language}:${questionLanguageId} explanation does not state ${pkg.answer}`);
        if (BASELINE_INVERSE_QLS.has(questionLanguageId)) {
          requireAudit(/[×=]/.test(explanation), `${language}:${questionLanguageId} inverse explanation lacks explicit working`);
          inverseEquationQlsByLocale[language]!.add(questionLanguageId);
        }
        renderedQuestions += 1;
        explanationLines += pkg.explanation.lines.length;
        cases += 1;
      }
    }
  }

  for (const language of LOCALIZED_LANGUAGES) {
    requireAudit(
      inverseEquationQlsByLocale[language]!.size === BASELINE_INVERSE_QLS.size,
      `${language} has concrete working for only ${inverseEquationQlsByLocale[language]!.size}/${BASELINE_INVERSE_QLS.size} baseline inverse QLs`,
    );
  }

  const structural = auditPrt001CrossQlStemStructure();
  const nearSimilarityPairs = Number(structural.metrics.nearSimilarityPairs ?? -1);
  requireAudit(nearSimilarityPairs === 0, `E11/E13 leaves ${nearSimilarityPairs} cross-QL editorial near-similarity pairs >= 0.88`);

  return {
    audit: "e11-localized-editorial-parity",
    cases,
    metrics: {
      activeQls: ids.length,
      localizedLanguages: LOCALIZED_LANGUAGES,
      authoredLocalizedStemSkeletons: authoredStemSkeletons,
      renderedLocalizedQuestions: renderedQuestions,
      explanationLinesReviewed: explanationLines,
      internalAllocationEnumsFound: 0,
      genericLocalizedExplanationPhrasesFound: 0,
      baselineInverseQlsWithConcreteWorking: {
        hi: inverseEquationQlsByLocale.hi!.size,
        pa: inverseEquationQlsByLocale.pa!.size,
      },
      baselineInverseQlTargetPerLocale: BASELINE_INVERSE_QLS.size,
      remainingCrossQlEditorialNearSimilarityPairs: nearSimilarityPairs,
      editorialSimilarityThreshold: 0.88,
    },
  };
}
