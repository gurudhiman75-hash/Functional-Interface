import {
  generatePhysicsExhaustiveCpV2,
  generatePhysicsExhaustiveBalancedReviewV2,
  type PhysicsExhaustiveQuestionV2,
} from "../physics-exhaustive-v2/sci-physics-exhaustive-generator-v2";
import { SCI_PHYSICS_EXHAUSTIVE_CP_META_V2 } from "../physics-exhaustive-v2/sci-physics-exhaustive-domain-v2";
import type { PhysicsExhaustiveAnchorV2 } from "../physics-exhaustive-v2/sci-physics-exhaustive-types-v2";
import {
  SCI_PHYSICS_CP001_HI_SURFACES_V1,
  SCI_PHYSICS_CP001_PA_SURFACES_V1,
} from "./sci-physics-cp001-localization-data-v1";
import {
  SCI_PHYSICS_CP002_HI_SURFACES_V1,
  SCI_PHYSICS_CP002_PA_SURFACES_V1,
} from "./sci-physics-cp002-localization-data-v1";
import {
  SCI_PHYSICS_CP003_HI_SURFACES_V1,
  SCI_PHYSICS_CP003_PA_SURFACES_V1,
} from "./sci-physics-cp003-localization-data-v1";
import {
  SCI_PHYSICS_CP004_HI_SURFACES_V1,
  SCI_PHYSICS_CP004_PA_SURFACES_V1,
} from "./sci-physics-cp004-localization-data-v1";
import { getPhysicsExplanationV2 } from "./sci-physics-explanation-quality-v2";
import { getPhysicsCp003Cp004ExplanationV1 } from "./sci-physics-explanation-quality-cp003-cp004-v1";
import {
  applyPunjabiPhysicsEditorialV2,
  naturalizePunjabiPhysicsTextV3,
} from "./sci-physics-punjabi-editorial-v2";
import {
  applyPunjabiPhysicsNaturalizationV3,
  naturalizePunjabiPhysicsTextFinalV3,
} from "./sci-physics-punjabi-naturalization-v3";
import {
  applyPunjabiPhysicsStandardExamV4,
  standardizePunjabiPhysicsExamTextV4,
} from "./sci-physics-punjabi-standard-exam-v4";
import {
  SCI_PHYSICS_LOCALIZATION_V1,
  type PhysicsLocaleV1,
  type PhysicsLocalizedAnchorSurfaceV1,
  type PhysicsLocalizedQuestionV1,
} from "./sci-physics-localization-types-v1";

type SupportedCpV1 = "SCI-CP-001" | "SCI-CP-002" | "SCI-CP-003" | "SCI-CP-004";

const SURFACES = {
  "SCI-CP-001": { hi: SCI_PHYSICS_CP001_HI_SURFACES_V1, pa: SCI_PHYSICS_CP001_PA_SURFACES_V1 },
  "SCI-CP-002": { hi: SCI_PHYSICS_CP002_HI_SURFACES_V1, pa: SCI_PHYSICS_CP002_PA_SURFACES_V1 },
  "SCI-CP-003": { hi: SCI_PHYSICS_CP003_HI_SURFACES_V1, pa: SCI_PHYSICS_CP003_PA_SURFACES_V1 },
  "SCI-CP-004": { hi: SCI_PHYSICS_CP004_HI_SURFACES_V1, pa: SCI_PHYSICS_CP004_PA_SURFACES_V1 },
} as const;

const STATEMENT_STEMS = {
  hi: {
    correct: "निम्नलिखित में से कौन-सा कथन सही है?",
    incorrect: "निम्नलिखित में से कौन-सा कथन गलत है?",
    pairEnd: "सही विकल्प चुनिए।",
    iCorrect: "कथन I सही है।", iIncorrect: "कथन I गलत है।",
    iiCorrect: "कथन II सही है।", iiIncorrect: "कथन II गलत है।",
    incorrectLead: "यह कथन गलत है।",
    pairOptions: ["I और II दोनों", "केवल I", "केवल II", "न तो I, न II"],
  },
  pa: {
    correct: "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਬਿਆਨ ਸਹੀ ਹੈ?",
    incorrect: "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਬਿਆਨ ਗਲਤ ਹੈ?",
    pairEnd: "ਸਹੀ ਉੱਤਰ ਚੁਣੋ।",
    iCorrect: "ਬਿਆਨ I ਸਹੀ ਹੈ।", iIncorrect: "ਬਿਆਨ I ਗਲਤ ਹੈ।",
    iiCorrect: "ਬਿਆਨ II ਸਹੀ ਹੈ।", iiIncorrect: "ਬਿਆਨ II ਗਲਤ ਹੈ।",
    incorrectLead: "ਇਹ ਬਿਆਨ ਗਲਤ ਹੈ।",
    pairOptions: ["I ਅਤੇ II ਦੋਵੇਂ", "ਸਿਰਫ਼ I", "ਸਿਰਫ਼ II", "ਨਾ I, ਨਾ II"],
  },
} as const;

function cpMeta(cpId: SupportedCpV1) {
  const meta = SCI_PHYSICS_EXHAUSTIVE_CP_META_V2.find((entry) => entry.cpId === cpId);
  if (!meta) throw new Error(`Missing Physics CP metadata: ${cpId}`);
  return meta;
}
function surfaceMap(cpId: SupportedCpV1, locale: Exclude<PhysicsLocaleV1, "en">): Readonly<Record<string, PhysicsLocalizedAnchorSurfaceV1>> {
  const raw = SURFACES[cpId][locale] as Readonly<Record<string, PhysicsLocalizedAnchorSurfaceV1>>;
  if (locale === "hi") return raw;
  return Object.fromEntries(
    Object.entries(raw).map(([anchorId, surface]) => {
      const editorial = applyPunjabiPhysicsEditorialV2(anchorId, surface);
      const natural = applyPunjabiPhysicsNaturalizationV3(anchorId, editorial);
      return [anchorId, applyPunjabiPhysicsStandardExamV4(anchorId, natural)];
    }),
  );
}
function anchorMap(cpId: SupportedCpV1) {
  return new Map(cpMeta(cpId).anchors.map((anchor) => [anchor.id, anchor]));
}
function mapDirectOption(option: string, anchor: PhysicsExhaustiveAnchorV2, localized: PhysicsLocalizedAnchorSurfaceV1): string {
  if (option === anchor.answer) return localized.answer;
  const index = anchor.distractors.findIndex((value) => value === option);
  if (index >= 0) return localized.distractors[index];
  throw new Error(`${anchor.id}: direct option not found in anchor`);
}
function truthForStatement(stem: string, anchor: PhysicsExhaustiveAnchorV2): boolean {
  if (stem.includes(anchor.trueStatement)) return true;
  if (stem.includes(anchor.falseStatement)) return false;
  throw new Error(`${anchor.id}: pair truth state not recoverable`);
}
function localizedBase(question: PhysicsExhaustiveQuestionV2, locale: PhysicsLocaleV1, stem: string, options: string[], canonicalAnswer: string, explanation: string): PhysicsLocalizedQuestionV1 {
  return {
    ...question,
    questionId: locale === "en" ? question.questionId : `${question.questionId}-${locale.toUpperCase()}`,
    stem, options, canonicalAnswer, explanation, locale,
    localizationV1: {
      version: SCI_PHYSICS_LOCALIZATION_V1, englishQuestionId: question.questionId,
      semanticInvariant: true, cpInvariant: true, sourceInvariant: true,
      optionOrderInvariant: true, correctIndexInvariant: true, reviewOnly: true,
    },
  };
}

function explanationFor(anchorId: string, locale: PhysicsLocaleV1): string {
  const explanation = anchorId.startsWith("SCI-CP003-") || anchorId.startsWith("SCI-CP004-")
    ? getPhysicsCp003Cp004ExplanationV1(anchorId, locale)
    : getPhysicsExplanationV2(anchorId, locale);
  if (locale !== "pa") return explanation;
  const editorial = naturalizePunjabiPhysicsTextV3(anchorId, explanation);
  const natural = naturalizePunjabiPhysicsTextFinalV3(anchorId, editorial);
  return standardizePunjabiPhysicsExamTextV4(anchorId, natural);
}

function localizeEnglishExplanation(question: PhysicsExhaustiveQuestionV2, cpId: SupportedCpV1): PhysicsLocalizedQuestionV1 {
  const anchors = anchorMap(cpId);
  const lead = anchors.get(question.anchorIds[0]);
  if (!lead) throw new Error(`${question.questionId}: missing lead anchor`);
  const leadExplanation = explanationFor(lead.id, "en");

  if (question.family === "direct-anchor" || question.family === "correct-statement") {
    return localizedBase(question, "en", question.stem, [...question.options], question.canonicalAnswer, leadExplanation);
  }
  if (question.family === "incorrect-statement") {
    return localizedBase(question, "en", question.stem, [...question.options], question.canonicalAnswer, `The identified statement is incorrect. ${leadExplanation}`);
  }

  const second = anchors.get(question.anchorIds[1]);
  if (!second) throw new Error(`${question.questionId}: missing second anchor`);
  const truthI = truthForStatement(question.stem, lead);
  const truthII = truthForStatement(question.stem, second);
  const secondExplanation = explanationFor(second.id, "en");
  const explanation = `Statement I is ${truthI ? "correct" : "incorrect"}. ${leadExplanation} Statement II is ${truthII ? "correct" : "incorrect"}. ${secondExplanation}`;
  return localizedBase(question, "en", question.stem, [...question.options], question.canonicalAnswer, explanation);
}

export function localizePhysicsExhaustiveQuestionV1(question: PhysicsExhaustiveQuestionV2, locale: PhysicsLocaleV1): PhysicsLocalizedQuestionV1 {
  if (!SCI_PHYSICS_LOCALIZATION_V1_SUPPORTED_CPS.includes(question.cpId as SupportedCpV1)) {
    throw new Error(`Physics localization V1 currently supports CP001-CP004 only; received ${question.cpId}`);
  }
  const cpId = question.cpId as SupportedCpV1;
  if (locale === "en") return localizeEnglishExplanation(question, cpId);

  const anchors = anchorMap(cpId);
  const surfaces = surfaceMap(cpId, locale);
  const lead = anchors.get(question.anchorIds[0]);
  if (!lead) throw new Error(`${question.questionId}: missing lead anchor`);
  const leadSurface = surfaces[lead.id];
  if (!leadSurface) throw new Error(`${question.questionId}: missing ${locale} surface for ${lead.id}`);
  const leadExplanation = explanationFor(lead.id, locale);

  if (question.family === "direct-anchor") {
    const options = question.options.map((option) => mapDirectOption(option, lead, leadSurface));
    return localizedBase(question, locale, leadSurface.stem, options, options[question.correctIndex], leadExplanation);
  }

  if (question.family === "correct-statement" || question.family === "incorrect-statement") {
    const optionMap = new Map<string, string>();
    for (const anchorId of question.anchorIds) {
      const anchor = anchors.get(anchorId); const surface = surfaces[anchorId];
      if (!anchor || !surface) throw new Error(`${question.questionId}: missing localized statement source ${anchorId}`);
      optionMap.set(anchor.trueStatement, surface.trueStatement); optionMap.set(anchor.falseStatement, surface.falseStatement);
    }
    const options = question.options.map((option) => {
      const localized = optionMap.get(option);
      if (!localized) throw new Error(`${question.questionId}: unmapped statement option`);
      return localized;
    });
    const text = STATEMENT_STEMS[locale];
    const stem = question.family === "correct-statement" ? text.correct : text.incorrect;
    const explanation = question.family === "correct-statement" ? leadExplanation : `${text.incorrectLead} ${leadExplanation}`;
    return localizedBase(question, locale, stem, options, options[question.correctIndex], explanation);
  }

  const second = anchors.get(question.anchorIds[1]);
  if (!second) throw new Error(`${question.questionId}: missing second anchor`);
  const secondSurface = surfaces[second.id];
  if (!secondSurface) throw new Error(`${question.questionId}: missing ${locale} surface for ${second.id}`);
  const truthI = truthForStatement(question.stem, lead); const truthII = truthForStatement(question.stem, second);
  const text = STATEMENT_STEMS[locale];
  const statementI = truthI ? leadSurface.trueStatement : leadSurface.falseStatement;
  const statementII = truthII ? secondSurface.trueStatement : secondSurface.falseStatement;
  const canonicalEnglishOptions = ["Both I and II", "I only", "II only", "Neither I nor II"];
  const options = question.options.map((option) => {
    const index = canonicalEnglishOptions.indexOf(option);
    if (index < 0) throw new Error(`${question.questionId}: unknown pair option`);
    return text.pairOptions[index];
  });
  const secondExplanation = explanationFor(second.id, locale);
  const explanation = `${truthI ? text.iCorrect : text.iIncorrect} ${leadExplanation} ${truthII ? text.iiCorrect : text.iiIncorrect} ${secondExplanation}`;
  return localizedBase(question, locale, `I. ${statementI}\nII. ${statementII}\n${text.pairEnd}`, options, options[question.correctIndex], explanation);
}

export function generatePhysicsLocalizedCpV1(cpId: SupportedCpV1, locale: PhysicsLocaleV1): PhysicsLocalizedQuestionV1[] {
  return generatePhysicsExhaustiveCpV2(cpId).map((question) => localizePhysicsExhaustiveQuestionV1(question, locale));
}
export function generatePhysicsLocalizedBalancedReviewV1(cpId: SupportedCpV1, locale: PhysicsLocaleV1): PhysicsLocalizedQuestionV1[] {
  return generatePhysicsExhaustiveBalancedReviewV2(cpId).map((question) => localizePhysicsExhaustiveQuestionV1(question, locale));
}
export const SCI_PHYSICS_LOCALIZATION_V1_SUPPORTED_CPS = ["SCI-CP-001", "SCI-CP-002", "SCI-CP-003", "SCI-CP-004"] as const;
export const SCI_PHYSICS_LOCALIZATION_V1_SUPPORTED_LOCALES = ["en", "hi", "pa"] as const;
