import type { GeneratedBlrCp006Question } from "./cp006-model";
import { generateBlrCp006FrozenBank } from "./cp006-runtime";
import {
  generateBlrCp006MultilingualFrozenBank,
  type GeneratedBlrCp006MultilingualFrozenQuestion,
} from "./cp006-multilingual-frozen";

export const BLR_CP006_EDITORIAL_V3_REVIEW_CANDIDATE =
  "BLR_CP006_EDITORIAL_V3_REVIEW_CANDIDATE" as const;
export const BLR_CP006_EDITORIAL_V3_HUMAN_REVIEW_BLOCKER =
  "TRILINGUAL_EDITORIAL_V3_HUMAN_REVIEW_PENDING" as const;

type AnyFrozenQuestion =
  | GeneratedBlrCp006Question
  | GeneratedBlrCp006MultilingualFrozenQuestion;

const EN_PROMPT_HINT =
  "Each adjacent coded pair is a separate family assertion. The symbols are relation codes, not arithmetic operators.";
const HI_PROMPT_HINT =
  "प्रत्येक संकेत का अर्थ केवल दिए गए संबंध-कूट के अनुसार लें। संकेतों को गणितीय चिह्न मानकर प्राथमिकता न लगाएँ।";
const PA_PROMPT_HINT =
  "ਹਰ ਚਿੰਨ੍ਹ ਦਾ ਅਰਥ ਕੇਵਲ ਦਿੱਤੇ ਸੰਬੰਧ-ਕੋਡ ਅਨੁਸਾਰ ਲਓ। ਚਿੰਨ੍ਹਾਂ ਨੂੰ ਗਣਿਤੀ ਨਿਸ਼ਾਨ ਮੰਨ ਕੇ ਤਰਜੀਹ ਨਾ ਲਗਾਓ।";

const EN_CORE_HINT =
  "Treat adjacent coded pairs as separate relation assertions; ordinary arithmetic precedence never applies.";
const HI_CORE_HINT =
  "कूटबद्ध कथन की प्रत्येक क्रमिक जोड़ी को अलग संबंध-कथन मानें; संकेतों पर गणितीय प्राथमिकता लागू न करें।";
const PA_CORE_HINT =
  "ਕੋਡ ਕੀਤੇ ਕਥਨ ਦੀ ਹਰ ਲਗਾਤਾਰ ਜੋੜੀ ਨੂੰ ਵੱਖਰਾ ਸੰਬੰਧ-ਕਥਨ ਮੰਨੋ; ਚਿੰਨ੍ਹਾਂ ਉੱਤੇ ਗਣਿਤੀ ਤਰਜੀਹ ਲਾਗੂ ਨਾ ਕਰੋ।";

const EN_CORE_REPLACEMENT =
  "Decode the coded pairs using the supplied key, then trace the family relation asked in the question.";
const HI_CORE_REPLACEMENT =
  "दिए गए कूट के अनुसार संबंधों का अर्थ निकालें, फिर प्रश्न में पूछा गया पारिवारिक संबंध खोजें।";
const PA_CORE_REPLACEMENT =
  "ਦਿੱਤੇ ਕੋਡ ਅਨੁਸਾਰ ਰਿਸ਼ਤਿਆਂ ਦਾ ਅਰਥ ਕੱਢੋ, ਫਿਰ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਪੁੱਛਿਆ ਪਰਿਵਾਰਕ ਰਿਸ਼ਤਾ ਲੱਭੋ।";

function localeOf(question: AnyFrozenQuestion): "en-IN" | "hi-IN" | "pa-IN" {
  return question.locale as "en-IN" | "hi-IN" | "pa-IN";
}

function removePromptHint(prompt: string, locale: "en-IN" | "hi-IN" | "pa-IN"): string {
  const hint = locale === "en-IN" ? EN_PROMPT_HINT : locale === "hi-IN" ? HI_PROMPT_HINT : PA_PROMPT_HINT;
  return prompt
    .replace(`\n\n${hint}`, "")
    .replace(hint, "")
    .trim();
}

function rewriteCoreConcept(
  lines: readonly string[],
  locale: "en-IN" | "hi-IN" | "pa-IN",
): readonly string[] {
  const hint = locale === "en-IN" ? EN_CORE_HINT : locale === "hi-IN" ? HI_CORE_HINT : PA_CORE_HINT;
  const replacement =
    locale === "en-IN"
      ? EN_CORE_REPLACEMENT
      : locale === "hi-IN"
        ? HI_CORE_REPLACEMENT
        : PA_CORE_REPLACEMENT;
  return lines.map((line) => (line === hint ? replacement : line));
}

function removeArithmeticTrap(
  lines: readonly string[],
  locale: "en-IN" | "hi-IN" | "pa-IN",
): readonly string[] {
  const pattern =
    locale === "en-IN"
      ? /arithmetic precedence/i
      : locale === "hi-IN"
        ? /गणितीय प्राथमिकता/
        : /ਗਣਿਤੀ ਤਰਜੀਹ/;
  return lines.filter((line) => !pattern.test(line));
}

export function applyBlrCp006EditorialV3<T extends AnyFrozenQuestion>(question: T) {
  const locale = localeOf(question);
  return {
    ...question,
    sharedPrompt: removePromptHint(question.sharedPrompt, locale),
    explanation: {
      ...question.explanation,
      coreConcept: rewriteCoreConcept(question.explanation.coreConcept, locale),
      commonTraps: removeArithmeticTrap(question.explanation.commonTraps, locale),
    },
    metadata: {
      ...question.metadata,
      editorialVersion: "blr-cp006-editorial-v3-review",
      editorialAuthority: BLR_CP006_EDITORIAL_V3_REVIEW_CANDIDATE,
      editorialStatus: "TRILINGUAL_REVIEW_REQUIRED",
      humanLanguageReviewRequired: true,
      activeEditorialBlockers: [BLR_CP006_EDITORIAL_V3_HUMAN_REVIEW_BLOCKER],
      productDeliveryUnlocked: false,
      productionStagingApproved: false,
    },
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
  } as const;
}

export function generateBlrCp006EditorialV3ReviewBundle() {
  return {
    english: generateBlrCp006FrozenBank().map(applyBlrCp006EditorialV3),
    hindi: generateBlrCp006MultilingualFrozenBank("hi-IN").map(applyBlrCp006EditorialV3),
    punjabi: generateBlrCp006MultilingualFrozenBank("pa-IN").map(applyBlrCp006EditorialV3),
  } as const;
}

export function cp006EditorialV3SemanticProjection(question: AnyFrozenQuestion) {
  return {
    packageId: question.packageId,
    checkpointId: question.checkpointId,
    qlId: question.qlId,
    permanentQlId: question.permanentQlId,
    sourcePrototypeId: question.sourcePrototypeId,
    seed: question.seed,
    scenarioId: question.scenarioId,
    topologyId: question.topologyId,
    codeKey: question.codeKey,
    codedStatements: question.codedStatements,
    query: question.query,
    answerType: question.answerType,
    optionSemantics: question.options.map((option) => ({
      semanticKey: option.semanticKey,
      isCorrect: option.isCorrect,
      errorLabel: option.errorLabel ?? null,
    })),
    correctIndex: question.correctIndex,
    graph: question.graph,
    semanticFingerprint: question.metadata.semanticFingerprint,
    noArithmeticPrecedence: question.metadata.noArithmeticPrecedence,
    independentSolverAgreed: question.metadata.independentSolverAgreed,
    uniqueAnswer: question.metadata.uniqueAnswer,
  };
}
