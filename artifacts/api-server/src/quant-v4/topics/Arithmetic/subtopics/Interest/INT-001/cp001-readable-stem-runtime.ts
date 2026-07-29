import type { IntCp001FinalQlId } from "./cp001-final-registry";
import {
  generateIntCp001FinalEditorialV3Question,
  type IntCp001FinalEditorialV3Question,
} from "./cp001-final-editorial-runtime-v3";
import {
  generateIntCp001ApprovedV2LocalizedQuestion,
  type IntCp001ApprovedV2LocalizedQuestion,
} from "./cp001-localized-runtime-v2-approved";
import type { IntCp001Locale } from "./cp001-multilingual-release";
import {
  buildIntCp001ReadableStemSafe,
} from "./cp001-readable-stem-builder-safe";
import type { IntCp001ReadableStemPresentation } from "./cp001-readable-stem-builder";
import { validateIntCp001ReadableStemCashFlow } from "./cp001-readable-stem-cash-flow-validator";
import {
  getIntCp001ReadableReleaseId,
  INT_CP001_READABLE_STEM_PATCH_ID,
  type IntCp001ReadableLanguage,
} from "./cp001-readable-stem-release";

export type IntCp001ReadableEnglishQuestion = Omit<
  IntCp001FinalEditorialV3Question,
  "releaseId" | "maturity" | "reviewStatus" | "stem" | "validation"
> & {
  releaseId: "INT-CP-001-EN-v4";
  maturity: "READABLE_STEM_EDITORIAL_CANDIDATE";
  reviewStatus: "PENDING_MULTILINGUAL_READABILITY_REVIEW";
  localeReviewStatus: "PENDING_HUMAN_REVIEW";
  stem: string;
  stemPresentation: IntCp001ReadableStemPresentation;
  readabilityEditorialTrace: {
    patchId: typeof INT_CP001_READABLE_STEM_PATCH_ID;
    supersedesReleaseId: IntCp001FinalEditorialV3Question["releaseId"];
    scenarioId: string;
    cashFlowDirection: string;
  };
  validation: IntCp001FinalEditorialV3Question["validation"];
};

export type IntCp001ReadableLocalizedQuestion = Omit<
  IntCp001ApprovedV2LocalizedQuestion,
  "releaseId" | "maturity" | "reviewStatus" | "localeReviewStatus" | "stem" | "validation"
> & {
  releaseId: "INT-CP-001-HI-v3" | "INT-CP-001-PA-v3";
  maturity: "READABLE_STEM_EDITORIAL_CANDIDATE";
  reviewStatus: "PENDING_MULTILINGUAL_READABILITY_REVIEW";
  localeReviewStatus: "PENDING_HUMAN_REVIEW";
  stem: string;
  stemPresentation: IntCp001ReadableStemPresentation;
  readabilityEditorialTrace: {
    patchId: typeof INT_CP001_READABLE_STEM_PATCH_ID;
    supersedesReleaseId: IntCp001ApprovedV2LocalizedQuestion["releaseId"];
    scenarioId: string;
    cashFlowDirection: string;
  };
  validation: IntCp001ApprovedV2LocalizedQuestion["validation"];
};

const ROBOTIC_PATTERNS: Record<IntCp001ReadableLanguage, readonly RegExp[]> = {
  en: [
    /\bheld by\b/iu,
    /\bappears in records\b/iu,
    /\bis recorded by\b/iu,
    /\bthe principal is\b/iu,
    /\bthe simple-interest rate is\b/iu,
    /\bthe term is\b/iu,
    /\barranged the\b/iu,
    /\bentered into a credit agreement\b/iu,
    /\bthe later amount and the amount after\b/iu,
  ],
  hi: [
    /बाद की राशि और .*बाद की राशि/u,
    /बाद वाली राशि कुल कितने समय बाद प्राप्त होगी/u,
    /ऋण समझौता किया है/u,
  ],
  pa: [
    /ਬਾਅਦ ਦੀ ਰਕਮ ਅਤੇ .*ਬਾਅਦ ਦੀ ਰਕਮ/u,
    /ਬਾਅਦ ਵਾਲੀ ਰਕਮ ਕੁੱਲ ਕਿੰਨੇ ਸਮੇਂ ਬਾਅਦ ਮਿਲੇਗੀ/u,
    /ਕਰਜ਼ੇ ਦਾ ਸਮਝੌਤਾ ਕੀਤਾ ਹੈ/u,
  ],
};

function validateReadableStem(
  baseErrors: readonly string[],
  previousStem: string,
  stem: string,
  presentation: IntCp001ReadableStemPresentation,
  solveContract: string,
  language: IntCp001ReadableLanguage,
  cashFlowDirection: "BORROWER_PAYS" | "INVESTOR_EARNS" | "NEUTRAL_MATH",
): string[] {
  const errors = [
    ...baseErrors,
    ...validateIntCp001ReadableStemCashFlow(
      stem,
      solveContract,
      language,
      cashFlowDirection,
    ),
  ];
  if (!stem.trim()) errors.push("Readable-stem candidate is empty.");
  if (stem === previousStem) errors.push("Readable-stem candidate did not supersede the approved stem.");
  if (stem.includes("**")) errors.push("Readable-stem candidate contains raw Markdown emphasis markers.");
  if (!presentation.richTextHtml.startsWith("<p>")) errors.push("Readable-stem rich-text model is not an HTML paragraph.");
  if (presentation.plainText !== stem) errors.push("Readable-stem plain-text presentation drifted from the canonical stem.");
  if (presentation.emphasisSpans.length < 2) errors.push("Readable-stem candidate lacks enough numerical scan anchors.");

  for (const span of presentation.emphasisSpans) {
    if (stem.slice(span.start, span.end) !== span.text) {
      errors.push(`Readable-stem emphasis span '${span.text}' is out of sync.`);
    }
  }
  for (const pattern of ROBOTIC_PATTERNS[language]) {
    if (pattern.test(stem)) errors.push(`Readable-stem candidate retains robotic wording: ${pattern.source}`);
  }

  return errors;
}

export function generateIntCp001ReadableEnglishQuestion(
  qlId: IntCp001FinalQlId,
  seed: string,
): IntCp001ReadableEnglishQuestion {
  const approved = generateIntCp001FinalEditorialV3Question(qlId, seed);
  const built = buildIntCp001ReadableStemSafe(
    approved.solveContract,
    approved.internalProvenance.sourceParameters,
    "en",
  );
  const errors = validateReadableStem(
    approved.validation.errors,
    approved.stem,
    built.stem,
    built.presentation,
    approved.solveContract,
    "en",
    built.cashFlowDirection,
  );

  return {
    ...approved,
    releaseId: getIntCp001ReadableReleaseId("en"),
    maturity: "READABLE_STEM_EDITORIAL_CANDIDATE",
    reviewStatus: "PENDING_MULTILINGUAL_READABILITY_REVIEW",
    localeReviewStatus: "PENDING_HUMAN_REVIEW",
    stem: built.stem,
    stemPresentation: built.presentation,
    readabilityEditorialTrace: {
      patchId: INT_CP001_READABLE_STEM_PATCH_ID,
      supersedesReleaseId: approved.releaseId,
      scenarioId: built.scenarioId,
      cashFlowDirection: built.cashFlowDirection,
    },
    validation: {
      ...approved.validation,
      ok: errors.length === 0,
      errors,
    },
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  };
}

export function generateIntCp001ReadableLocalizedQuestion(
  qlId: IntCp001FinalQlId,
  seed: string,
  locale: IntCp001Locale,
): IntCp001ReadableLocalizedQuestion {
  const approved = generateIntCp001ApprovedV2LocalizedQuestion(qlId, seed, locale);
  const built = buildIntCp001ReadableStemSafe(
    approved.solveContract,
    approved.internalProvenance.sourceParameters,
    locale,
  );
  const errors = validateReadableStem(
    approved.validation.errors,
    approved.stem,
    built.stem,
    built.presentation,
    approved.solveContract,
    locale,
    built.cashFlowDirection,
  );

  return {
    ...approved,
    releaseId: getIntCp001ReadableReleaseId(locale),
    maturity: "READABLE_STEM_EDITORIAL_CANDIDATE",
    reviewStatus: "PENDING_MULTILINGUAL_READABILITY_REVIEW",
    localeReviewStatus: "PENDING_HUMAN_REVIEW",
    stem: built.stem,
    stemPresentation: built.presentation,
    readabilityEditorialTrace: {
      patchId: INT_CP001_READABLE_STEM_PATCH_ID,
      supersedesReleaseId: approved.releaseId,
      scenarioId: built.scenarioId,
      cashFlowDirection: built.cashFlowDirection,
    },
    validation: {
      ...approved.validation,
      ok: errors.length === 0,
      errors,
    },
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  };
}
