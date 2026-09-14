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
import { applyPunjabiPhysicsEditorialV2 } from "./sci-physics-punjabi-editorial-v2";
import {
  SCI_PHYSICS_LOCALIZATION_V1,
  type PhysicsLocaleV1,
  type PhysicsLocalizedAnchorSurfaceV1,
  type PhysicsLocalizedQuestionV1,
} from "./sci-physics-localization-types-v1";

type SupportedCpV1 = "SCI-CP-001" | "SCI-CP-002";

const SURFACES = {
  "SCI-CP-001": { hi: SCI_PHYSICS_CP001_HI_SURFACES_V1, pa: SCI_PHYSICS_CP001_PA_SURFACES_V1 },
  "SCI-CP-002": { hi: SCI_PHYSICS_CP002_HI_SURFACES_V1, pa: SCI_PHYSICS_CP002_PA_SURFACES_V1 },
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
    correct: "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਕਥਨ ਸਹੀ ਹੈ?",
    incorrect: "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਕਥਨ ਗਲਤ ਹੈ?",
    pairEnd: "ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ।",
    iCorrect: "ਕਥਨ I ਸਹੀ ਹੈ।", iIncorrect: "ਕਥਨ I ਗਲਤ ਹੈ।",
    iiCorrect: "ਕਥਨ II ਸਹੀ ਹੈ।", iiIncorrect: "ਕਥਨ II ਗਲਤ ਹੈ।",
    incorrectLead: "ਇਹ ਕਥਨ ਗਲਤ ਹੈ।",
    pairOptions: ["I ਅਤੇ II ਦੋਵੇਂ", "ਕੇਵਲ I", "ਕੇਵਲ II", "ਨਾ I, ਨਾ II"],
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
    Object.entries(raw).map(([anchorId, surface]) => [anchorId, applyPunjabiPhysicsEditorialV2(anchorId, surface)]),
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

export function localizePhysicsExhaustiveQuestionV1(question: PhysicsExhaustiveQuestionV2, locale: PhysicsLocaleV1): PhysicsLocalizedQuestionV1 {
  if (locale === "en") return localizedBase(question, "en", question.stem, [...question.options], question.canonicalAnswer, question.explanation);
  if (question.cpId !== "SCI-CP-001" && question.cpId !== "SCI-CP-002") throw new Error(`Physics localization V1 currently supports CP001-CP002 only; received ${question.cpId}`);
  const cpId = question.cpId as SupportedCpV1;
  const anchors = anchorMap(cpId);
  const surfaces = surfaceMap(cpId, locale);
  const lead = anchors.get(question.anchorIds[0]);
  if (!lead) throw new Error(`${question.questionId}: missing lead anchor`);
  const leadSurface = surfaces[lead.id];
  if (!leadSurface) throw new Error(`${question.questionId}: missing ${locale} surface for ${lead.id}`);

  if (question.family === "direct-anchor") {
    const options = question.options.map((option) => mapDirectOption(option, lead, leadSurface));
    return localizedBase(question, locale, leadSurface.stem, options, options[question.correctIndex], leadSurface.explanation);
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
    const explanation = question.family === "correct-statement" ? leadSurface.explanation : `${text.incorrectLead} ${leadSurface.explanation}`;
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
  const explanation = `${truthI ? text.iCorrect : text.iIncorrect} ${leadSurface.explanation} ${truthII ? text.iiCorrect : text.iiIncorrect} ${secondSurface.explanation}`;
  return localizedBase(question, locale, `I. ${statementI}\nII. ${statementII}\n${text.pairEnd}`, options, options[question.correctIndex], explanation);
}

export function generatePhysicsLocalizedCpV1(cpId: SupportedCpV1, locale: PhysicsLocaleV1): PhysicsLocalizedQuestionV1[] {
  return generatePhysicsExhaustiveCpV2(cpId).map((question) => localizePhysicsExhaustiveQuestionV1(question, locale));
}
export function generatePhysicsLocalizedBalancedReviewV1(cpId: SupportedCpV1, locale: PhysicsLocaleV1): PhysicsLocalizedQuestionV1[] {
  return generatePhysicsExhaustiveBalancedReviewV2(cpId).map((question) => localizePhysicsExhaustiveQuestionV1(question, locale));
}
export const SCI_PHYSICS_LOCALIZATION_V1_SUPPORTED_CPS = ["SCI-CP-001", "SCI-CP-002"] as const;
export const SCI_PHYSICS_LOCALIZATION_V1_SUPPORTED_LOCALES = ["en", "hi", "pa"] as const;
