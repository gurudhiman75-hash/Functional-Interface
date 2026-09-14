import { materializeCae001World } from "./causal-world-authorities.ts";
import { CAE_001_SATURATION_WAVE2_FAMILIES } from "./causal-world-saturation-wave2.ts";
import { CAE_001_SATURATION_WAVE4_FAMILIES } from "./causal-world-saturation-wave4.ts";
import type { CaeDifficultyEvidence, CaeLocale, CaeRenderedOption, GeneratedCaeQuestion } from "./types.ts";

const BRANCH_FAMILIES = Object.freeze(
  [...CAE_001_SATURATION_WAVE2_FAMILIES, ...CAE_001_SATURATION_WAVE4_FAMILIES]
    .filter((family) => family.topology === "BRANCHING_COMMON_CAUSE"),
);

const WORLDS = Object.freeze(
  BRANCH_FAMILIES.flatMap((family) => family.variants.map((variant) => materializeCae001World(family, variant))),
);

export const CP009_EXPANDED_COMMON_CAUSE_FAMILY_IDS = Object.freeze(BRANCH_FAMILIES.map((family) => family.id));
export const CP009_EXPANDED_COMMON_CAUSE_WORLD_COUNT = WORLDS.length;

const COPY: Record<CaeLocale, Readonly<{ prompt: string; one: string; two: string; explanation: string }>> = {
  "en-IN": {
    prompt: "Which event best explains both observations?",
    one: "Observation I",
    two: "Observation II",
    explanation: "This event causes both observations. Neither observation is the cause of the other.",
  },
  "hi-IN": {
    prompt: "कौन-सी घटना दोनों अवलोकनों को सबसे अच्छी तरह समझाती है?",
    one: "अवलोकन I",
    two: "अवलोकन II",
    explanation: "यह घटना दोनों अवलोकनों का कारण है। कोई भी अवलोकन दूसरे का कारण नहीं है।",
  },
  "pa-IN": {
    prompt: "ਕਿਹੜੀ ਘਟਨਾ ਦੋਵੇਂ ਨਿਰੀਖਣਾਂ ਨੂੰ ਸਭ ਤੋਂ ਚੰਗੀ ਤਰ੍ਹਾਂ ਸਮਝਾਉਂਦੀ ਹੈ?",
    one: "ਨਿਰੀਖਣ I",
    two: "ਨਿਰੀਖਣ II",
    explanation: "ਇਹ ਘਟਨਾ ਦੋਵੇਂ ਨਿਰੀਖਣਾਂ ਦਾ ਕਾਰਨ ਹੈ। ਕੋਈ ਵੀ ਨਿਰੀਖਣ ਦੂਜੇ ਦਾ ਕਾਰਨ ਨਹੀਂ ਹੈ।",
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
  const out = [...values];
  let state = mix32(seed ^ 0x9904cc);
  for (let index = out.length - 1; index > 0; index -= 1) {
    state = mix32(state + index);
    const swap = state % (index + 1);
    [out[index], out[swap]] = [out[swap]!, out[index]!];
  }
  return out;
}

function trim(value: string): string {
  return value.replace(/[.।]+$/u, "");
}

export function generateCp009ExpandedCommonCauseQuestion(input: Readonly<{ locale: CaeLocale; seed: number }>): GeneratedCaeQuestion {
  if (WORLDS.length === 0) throw new Error("CAE CP009 expanded common-cause: no branching worlds are available.");
  const selectionSeed = mix32((input.seed >>> 0) ^ 0x9904cae);
  const world = WORLDS[selectionSeed % WORLDS.length]!;
  const cause = world.nodes.find((node) => node.role === "CAUSE");
  const effects = world.nodes.filter((node) => node.role === "EFFECT");
  if (!cause || effects.length < 2) throw new Error(`${world.id}: expanded CP009 common-cause world is incomplete.`);

  const siblingCauses = WORLDS
    .filter((candidate) => candidate.scenarioFamilyId === world.scenarioFamilyId && candidate.id !== world.id)
    .map((candidate) => candidate.nodes.find((node) => node.role === "CAUSE"))
    .filter((node): node is NonNullable<typeof node> => Boolean(node))
    .filter((node) => node.text[input.locale] !== cause.text[input.locale]);
  if (siblingCauses.length < 3) throw new Error(`${world.scenarioFamilyId}: expanded CP009 common-cause needs three same-family alternatives.`);

  const wrong = shuffled(siblingCauses, selectionSeed ^ 0x33).slice(0, 3);
  const options: readonly CaeRenderedOption[] = shuffled([
    { id: cause.id, text: cause.text[input.locale], isCorrect: true },
    ...wrong.map((node, index) => ({
      id: `EXPANDED_COMMON_ALT:${world.scenarioFamilyId}:${index + 1}`,
      text: node.text[input.locale],
      isCorrect: false,
      distractorRole: "COMMON_CAUSE_CONFUSION" as const,
    })),
  ], selectionSeed);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const copy = COPY[input.locale];
  const stateId = [
    "projection:CAE-PLAN-INTEGRATED-V2",
    `family:${world.scenarioFamilyId}`,
    `variant:${world.scenarioVariantId}`,
    "operation:COMMON_CAUSE_RECONSTRUCTION_EXPANDED",
    `visible:${effects[0]!.semanticSlot},${effects[1]!.semanticSlot}`,
  ].join("|");
  const itemVariantId = `${stateId}|profile:FOUR_WAY|presentation:${options.map((option) => option.id).join(">")}`;
  const evidence: CaeDifficultyEvidence = {
    causalDistance: 1,
    hiddenLinks: 1,
    topologyComplexity: 3,
    plausibleDistractors: 3,
    visibleEventCount: 2,
    inferenceBurden: 5,
    candidatePlausibilityBurden: 5,
    score: 19,
  };

  return Object.freeze({
    chapterId: "CAE-001",
    checkpointId: "CAE-CP-009",
    qlId: "CAE-QL-009",
    projectionId: "CAE-PLAN-INTEGRATED-V2",
    scenarioFamilyId: world.scenarioFamilyId,
    scenarioVariantId: world.scenarioVariantId,
    causalStateId: stateId,
    itemVariantId,
    semanticInstanceId: itemVariantId,
    causalWorldId: world.id,
    causalStructure: "INTEGRATED:COMMON_CAUSE_RECONSTRUCTION_EXPANDED:cause>effect-1|cause>effect-2",
    locale: input.locale,
    seed: input.seed,
    difficulty: "HARD",
    difficultyEvidence: evidence,
    questionProfile: "FOUR_WAY",
    visibleContext: { backdrop: world.backdrop?.[input.locale] ?? null, visibleNodeIds: [effects[0]!.id, effects[1]!.id], hiddenNodeIds: [cause.id] },
    stem: `${copy.prompt}\n\n${copy.one}: ${effects[0]!.text[input.locale]}\n\n${copy.two}: ${effects[1]!.text[input.locale]}`,
    options: options.map((option) => option.text),
    correctIndex,
    answerId: "COMMON_CAUSE_RECONSTRUCTION_EXPANDED",
    explanation: `${trim(cause.text[input.locale])} → ${trim(effects[0]!.text[input.locale])} / ${trim(effects[1]!.text[input.locale])}. ${copy.explanation}`,
    causalTrace: [cause.id, effects[0]!.id, effects[1]!.id],
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
