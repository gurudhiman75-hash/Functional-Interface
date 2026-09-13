import { CAE_001_CAUSAL_WORLDS } from "./causal-world-authorities.ts";
import type {
  CaeDifficultyEvidence,
  CaeLocale,
  CaeRenderedOption,
  GeneratedCaeQuestion,
} from "./types.ts";

const OPTION_TEXT: Record<CaeLocale, Readonly<Record<string, string>>> = {
  "en-IN": {
    FIRST_DIRECT_CAUSES_SECOND: "Statement I is the cause and Statement II is its effect.",
    SECOND_DIRECT_CAUSES_FIRST: "Statement II is the cause and Statement I is its effect.",
    COMMON_CAUSE: "Both statements are effects of one common cause.",
    CORRELATION_ONLY: "The statements are associated, but no causal explanation is established.",
  },
  "hi-IN": {
    FIRST_DIRECT_CAUSES_SECOND: "कथन I कारण है और कथन II उसका प्रभाव है।",
    SECOND_DIRECT_CAUSES_FIRST: "कथन II कारण है और कथन I उसका प्रभाव है।",
    COMMON_CAUSE: "दोनों कथन एक ही सामान्य कारण के प्रभाव हैं।",
    CORRELATION_ONLY: "कथन जुड़े हुए दिखते हैं, लेकिन कोई कारणात्मक व्याख्या स्थापित नहीं है।",
  },
  "pa-IN": {
    FIRST_DIRECT_CAUSES_SECOND: "ਕਥਨ I ਕਾਰਨ ਹੈ ਅਤੇ ਕਥਨ II ਉਸ ਦਾ ਪ੍ਰਭਾਵ ਹੈ।",
    SECOND_DIRECT_CAUSES_FIRST: "ਕਥਨ II ਕਾਰਨ ਹੈ ਅਤੇ ਕਥਨ I ਉਸ ਦਾ ਪ੍ਰਭਾਵ ਹੈ।",
    COMMON_CAUSE: "ਦੋਵੇਂ ਕਥਨ ਇੱਕੋ ਸਾਂਝੇ ਕਾਰਨ ਦੇ ਪ੍ਰਭਾਵ ਹਨ।",
    CORRELATION_ONLY: "ਕਥਨ ਆਪਸ ਵਿੱਚ ਜੁੜੇ ਹੋਏ ਲੱਗਦੇ ਹਨ, ਪਰ ਕੋਈ ਕਾਰਨਾਤਮਕ ਵਿਆਖਿਆ ਸਥਾਪਤ ਨਹੀਂ ਹੈ।",
  },
};

const COPY: Record<CaeLocale, Readonly<{ prompt: string; statementOne: string; statementTwo: string; explanation: string }>> = {
  "en-IN": {
    prompt: "Read the two statements and decide which conclusion is best supported.",
    statementOne: "Statement I",
    statementTwo: "Statement II",
    explanation: "The two visible outcomes do not cause each other; both follow from the same hidden cause.",
  },
  "hi-IN": {
    prompt: "दोनों कथन पढ़िए और सबसे अधिक समर्थित निष्कर्ष चुनिए।",
    statementOne: "कथन I",
    statementTwo: "कथन II",
    explanation: "दिखाई गई दोनों घटनाएँ एक-दूसरे का कारण नहीं हैं; दोनों एक ही छिपे हुए कारण से उत्पन्न हुई हैं।",
  },
  "pa-IN": {
    prompt: "ਦੋਵੇਂ ਕਥਨ ਪੜ੍ਹੋ ਅਤੇ ਸਭ ਤੋਂ ਵੱਧ ਸਮਰਥਿਤ ਨਤੀਜਾ ਚੁਣੋ।",
    statementOne: "ਕਥਨ I",
    statementTwo: "ਕਥਨ II",
    explanation: "ਦਿਖਾਈਆਂ ਦੋਵੇਂ ਘਟਨਾਵਾਂ ਇੱਕ-ਦੂਜੇ ਦਾ ਕਾਰਨ ਨਹੀਂ ਹਨ; ਦੋਵੇਂ ਇੱਕੋ ਲੁਕੇ ਹੋਏ ਕਾਰਨ ਤੋਂ ਪੈਦਾ ਹੋਈਆਂ ਹਨ।",
  },
};

function mix32(value: number): number {
  let x = value | 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return x >>> 0;
}

function shuffled<T>(values: readonly T[], seed: number): readonly T[] {
  const result = [...values];
  let state = mix32(seed ^ 0x9e3779b9);
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = mix32(state + index);
    const swap = state % (index + 1);
    [result[index], result[swap]] = [result[swap]!, result[index]!];
  }
  return result;
}

export const CP007_COMMON_FACTOR_WORLDS = Object.freeze(
  CAE_001_CAUSAL_WORLDS.filter((world) => world.scenarioFamilyId === "CAE-FAM-SHARED-PRESSURE"),
);

const DIFFICULTY_EVIDENCE: CaeDifficultyEvidence = Object.freeze({
  causalDistance: 0,
  hiddenLinks: 1,
  topologyComplexity: 2,
  plausibleDistractors: 2,
  visibleEventCount: 2,
  inferenceBurden: 4,
  candidatePlausibilityBurden: 0,
  score: 12,
});

export function generateCp007CommonFactorQuestion(input: Readonly<{ locale: CaeLocale; seed: number }>): GeneratedCaeQuestion {
  if (CP007_COMMON_FACTOR_WORLDS.length === 0) throw new Error("CAE CP007: no shared-pressure worlds available for common-factor review.");
  const selectionSeed = mix32((input.seed >>> 0) ^ 0x7c07c0de);
  const world = CP007_COMMON_FACTOR_WORLDS[selectionSeed % CP007_COMMON_FACTOR_WORLDS.length]!;
  const cause = world.nodes.find((node) => node.role === "CAUSE");
  const effects = world.nodes.filter((node) => node.role === "EFFECT");
  if (!cause || effects.length !== 2) throw new Error(`${world.id}: CP007 common-factor world must contain one cause and two visible effects.`);
  const reverse = mix32(selectionSeed ^ 0x19f7) % 2 === 1;
  const visible = reverse ? [effects[1]!, effects[0]!] : effects;
  const locale = input.locale;
  const ids = ["FIRST_DIRECT_CAUSES_SECOND", "SECOND_DIRECT_CAUSES_FIRST", "COMMON_CAUSE", "CORRELATION_ONLY"] as const;
  const options: readonly CaeRenderedOption[] = shuffled(ids.map((id) => ({
    id,
    text: OPTION_TEXT[locale][id]!,
    isCorrect: id === "COMMON_CAUSE",
    distractorRole: id === "COMMON_CAUSE" ? undefined : id === "SECOND_DIRECT_CAUSES_FIRST" ? "REVERSE_CAUSATION" as const : id === "CORRELATION_ONLY" ? "COMMON_CAUSE_CONFUSION" as const : "CORRELATION" as const,
  })), mix32(selectionSeed ^ 0x5a07));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const stateId = [
    "projection:CAE-PLAN-CORRELATION",
    `family:${world.scenarioFamilyId}`,
    `variant:${world.scenarioVariantId}`,
    "graph:BRANCHING_COMMON_CAUSE",
    `visible:${visible.map((node) => node.semanticSlot).join(",")}`,
  ].join("|");
  const itemVariantId = [
    stateId,
    "distractors:CORRELATION_ONLY,FIRST_DIRECT_CAUSES_SECOND,SECOND_DIRECT_CAUSES_FIRST",
    "profile:FOUR_WAY",
    `presentation:${options.map((option) => option.id).join(">")}`,
  ].join("|");
  const copy = COPY[locale];
  const trim = (value: string) => value.replace(/[.।]+$/u, "");

  return Object.freeze({
    chapterId: "CAE-001",
    checkpointId: "CAE-CP-007",
    qlId: "CAE-QL-007",
    projectionId: "CAE-PLAN-CORRELATION",
    scenarioFamilyId: world.scenarioFamilyId,
    scenarioVariantId: world.scenarioVariantId,
    causalStateId: stateId,
    itemVariantId,
    semanticInstanceId: itemVariantId,
    causalWorldId: world.id,
    causalStructure: "BRANCHING_COMMON_CAUSE:cause>first-effect|cause>second-effect",
    locale,
    seed: input.seed,
    difficulty: "MEDIUM",
    difficultyEvidence: DIFFICULTY_EVIDENCE,
    questionProfile: "FOUR_WAY",
    visibleContext: {
      backdrop: null,
      visibleNodeIds: visible.map((node) => node.id),
      hiddenNodeIds: [cause.id],
    },
    stem: `${copy.prompt}\n\n${copy.statementOne}: ${visible[0]!.text[locale]}\n\n${copy.statementTwo}: ${visible[1]!.text[locale]}`,
    options: options.map((option) => option.text),
    correctIndex,
    answerId: "COMMON_CAUSE",
    explanation: `${trim(cause.text[locale])} → ${trim(visible[0]!.text[locale])} / ${trim(visible[1]!.text[locale])}. ${copy.explanation}`,
    causalTrace: [cause.id, ...visible.map((node) => node.id)],
    distractorMechanisms: options.flatMap((option) => option.distractorRole ? [option.distractorRole] : []),
    candidateComparisons: [],
    optionMetadata: options,
    metadata: {
      solver: "CAE_CAUSAL_WORLD_SOLVER_V3",
      sourceMode: "CURATED_COMPOSABLE_SCENARIO",
      qlAllocation: "PROVISIONAL_PENDING_SOURCE_SATURATION",
      reviewOnly: true,
      questionBankWritable: false,
      testEligible: false,
      mockEligible: false,
      publicEligible: false,
    },
  });
}
