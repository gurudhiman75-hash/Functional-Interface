import { materializeCae001World } from "./causal-world-authorities.ts";
import { CAE_001_SATURATION_WAVE4_PARALLEL_FAMILIES } from "./causal-world-saturation-wave4-parallel.ts";
import type { CaeDifficultyEvidence, CaeLocale, CaeRenderedOption, GeneratedCaeQuestion } from "./types.ts";

const WORLDS = Object.freeze(CAE_001_SATURATION_WAVE4_PARALLEL_FAMILIES.flatMap((family) => family.variants.map((variant) => materializeCae001World(family, variant))));
export const CP007_WAVE4_PARALLEL_FAMILY_IDS = Object.freeze(CAE_001_SATURATION_WAVE4_PARALLEL_FAMILIES.map((family) => family.id));

const OPTION_TEXT: Record<CaeLocale, Readonly<Record<string, string>>> = {
  "en-IN": {
    FIRST_DIRECT_CAUSES_SECOND: "Statement I is the cause and Statement II is its effect.",
    SECOND_DIRECT_CAUSES_FIRST: "Statement II is the cause and Statement I is its effect.",
    COMMON_CAUSE: "Both statements are effects of one common cause.",
    CORRELATION_ONLY: "The two statements do not establish a causal link between them.",
  },
  "hi-IN": {
    FIRST_DIRECT_CAUSES_SECOND: "कथन I कारण है और कथन II उसका प्रभाव है।",
    SECOND_DIRECT_CAUSES_FIRST: "कथन II कारण है और कथन I उसका प्रभाव है।",
    COMMON_CAUSE: "दोनों कथन एक ही सामान्य कारण के प्रभाव हैं।",
    CORRELATION_ONLY: "दोनों कथन अपने बीच कारण-प्रभाव संबंध स्थापित नहीं करते।",
  },
  "pa-IN": {
    FIRST_DIRECT_CAUSES_SECOND: "ਕਥਨ I ਕਾਰਨ ਹੈ ਅਤੇ ਕਥਨ II ਉਸ ਦਾ ਪ੍ਰਭਾਵ ਹੈ।",
    SECOND_DIRECT_CAUSES_FIRST: "ਕਥਨ II ਕਾਰਨ ਹੈ ਅਤੇ ਕਥਨ I ਉਸ ਦਾ ਪ੍ਰਭਾਵ ਹੈ।",
    COMMON_CAUSE: "ਦੋਵੇਂ ਕਥਨ ਇੱਕੋ ਸਾਂਝੇ ਕਾਰਨ ਦੇ ਪ੍ਰਭਾਵ ਹਨ।",
    CORRELATION_ONLY: "ਦੋਵੇਂ ਕਥਨ ਆਪਣੇ ਵਿਚਕਾਰ ਕਾਰਨ-ਪ੍ਰਭਾਵ ਸੰਬੰਧ ਸਥਾਪਤ ਨਹੀਂ ਕਰਦੇ।",
  },
};

const COPY: Record<CaeLocale, Readonly<Record<string, string>>> = {
  "en-IN": { prompt: "Read the two statements and choose the conclusion supported by the additional information.", first: "Statement I", second: "Statement II", info: "Additional information:", explanation: "Each visible change has its own supported cause. Therefore one visible change should not be treated as the cause of the other." },
  "hi-IN": { prompt: "दोनों कथन पढ़िए और अतिरिक्त जानकारी से समर्थित निष्कर्ष चुनिए।", first: "कथन I", second: "कथन II", info: "अतिरिक्त जानकारी:", explanation: "दिखाई गई दोनों घटनाओं के अपने-अपने समर्थित कारण हैं। इसलिए एक दिखाई गई घटना को दूसरी का कारण नहीं माना जा सकता।" },
  "pa-IN": { prompt: "ਦੋਵੇਂ ਕਥਨ ਪੜ੍ਹੋ ਅਤੇ ਵਾਧੂ ਜਾਣਕਾਰੀ ਤੋਂ ਸਮਰਥਿਤ ਨਤੀਜਾ ਚੁਣੋ।", first: "ਕਥਨ I", second: "ਕਥਨ II", info: "ਵਾਧੂ ਜਾਣਕਾਰੀ:", explanation: "ਦਿਖਾਈਆਂ ਦੋਵੇਂ ਘਟਨਾਵਾਂ ਦੇ ਆਪਣੇ-ਆਪਣੇ ਸਮਰਥਿਤ ਕਾਰਨ ਹਨ। ਇਸ ਲਈ ਇੱਕ ਦਿਖਾਈ ਘਟਨਾ ਨੂੰ ਦੂਜੀ ਦਾ ਕਾਰਨ ਨਹੀਂ ਮੰਨਿਆ ਜਾ ਸਕਦਾ।" },
};

function mix32(value: number): number { let x = value | 0; x ^= x >>> 16; x = Math.imul(x, 0x7feb352d); x ^= x >>> 15; x = Math.imul(x, 0x846ca68b); x ^= x >>> 16; return x >>> 0; }
function shuffled<T>(values: readonly T[], seed: number): readonly T[] { const out = [...values]; let state = mix32(seed ^ 0x47a11); for (let i = out.length - 1; i > 0; i -= 1) { state = mix32(state + i); const j = state % (i + 1); [out[i], out[j]] = [out[j]!, out[i]!]; } return out; }
function role(id: string): CaeRenderedOption["distractorRole"] { if (id === "COMMON_CAUSE") return "COMMON_CAUSE_CONFUSION"; if (id === "SECOND_DIRECT_CAUSES_FIRST") return "REVERSE_CAUSATION"; if (id === "FIRST_DIRECT_CAUSES_SECOND") return "CORRELATION"; return undefined; }

export function generateReviewedCp007Wave4ParallelQuestion(input: Readonly<{ locale: CaeLocale; seed: number }>): GeneratedCaeQuestion {
  if (!WORLDS.length) throw new Error("CP007 Wave 4: no parallel worlds available.");
  const selectionSeed = mix32((input.seed >>> 0) ^ 0x7407cafe);
  const world = WORLDS[selectionSeed % WORLDS.length]!;
  const firstCause = world.nodes.find((node) => node.semanticSlot === "first-cause")!;
  const firstEffect = world.nodes.find((node) => node.semanticSlot === "first-effect")!;
  const secondCause = world.nodes.find((node) => node.semanticSlot === "second-cause")!;
  const secondEffect = world.nodes.find((node) => node.semanticSlot === "second-effect")!;
  const reverse = mix32(selectionSeed ^ 0x77) % 2 === 1;
  const visibleEffects = reverse ? [secondEffect, firstEffect] : [firstEffect, secondEffect];
  const evidenceCauses = reverse ? [secondCause, firstCause] : [firstCause, secondCause];
  const ids = ["FIRST_DIRECT_CAUSES_SECOND", "SECOND_DIRECT_CAUSES_FIRST", "COMMON_CAUSE", "CORRELATION_ONLY"] as const;
  const options: readonly CaeRenderedOption[] = shuffled(ids.map((id) => ({ id, text: OPTION_TEXT[input.locale][id]!, isCorrect: id === "CORRELATION_ONLY", distractorRole: role(id) })), selectionSeed);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const stateId = ["projection:CAE-PLAN-CORRELATION", `family:${world.scenarioFamilyId}`, `variant:${world.scenarioVariantId}`, "graph:PARALLEL_CHAINS", `visible:${visibleEffects[0]!.semanticSlot},${visibleEffects[1]!.semanticSlot}`, "evidence:independent-causes-visible", "wave:4"].join("|");
  const itemVariantId = `${stateId}|presentation:${options.map((option) => option.id).join(">")}`;
  const c = COPY[input.locale];
  const stem = `${c.prompt}\n\n${c.first}: ${visibleEffects[0]!.text[input.locale]}\n\n${c.second}: ${visibleEffects[1]!.text[input.locale]}\n\n${c.info}\n${evidenceCauses[0]!.text[input.locale]}\n${evidenceCauses[1]!.text[input.locale]}`;
  const explanation = `${evidenceCauses[0]!.text[input.locale]} → ${visibleEffects[0]!.text[input.locale]} ${evidenceCauses[1]!.text[input.locale]} → ${visibleEffects[1]!.text[input.locale]} ${c.explanation}`;
  const difficultyEvidence: CaeDifficultyEvidence = { causalDistance: 0, hiddenLinks: 0, topologyComplexity: 2, plausibleDistractors: 3, visibleEventCount: 4, inferenceBurden: 4, candidatePlausibilityBurden: 3, score: 16 };
  return Object.freeze({
    chapterId: "CAE-001", checkpointId: "CAE-CP-007", qlId: "CAE-QL-007", projectionId: "CAE-PLAN-CORRELATION",
    scenarioFamilyId: world.scenarioFamilyId, scenarioVariantId: world.scenarioVariantId, causalStateId: stateId, itemVariantId, semanticInstanceId: itemVariantId,
    causalWorldId: world.id, causalStructure: "PARALLEL_CHAINS:CO_MOVEMENT:first-cause>first-effect|second-cause>second-effect", locale: input.locale, seed: input.seed,
    difficulty: "MEDIUM", difficultyEvidence, questionProfile: "FOUR_WAY",
    visibleContext: { backdrop: null, visibleNodeIds: [visibleEffects[0]!.id, visibleEffects[1]!.id, evidenceCauses[0]!.id, evidenceCauses[1]!.id], hiddenNodeIds: [] },
    stem, options: options.map((option) => option.text), correctIndex, answerId: "CORRELATION_ONLY", explanation,
    causalTrace: [evidenceCauses[0]!.id, visibleEffects[0]!.id, evidenceCauses[1]!.id, visibleEffects[1]!.id],
    distractorMechanisms: options.flatMap((option) => option.distractorRole ? [option.distractorRole] : []), candidateComparisons: [], optionMetadata: options,
    metadata: { solver: "CAE_CAUSAL_WORLD_SOLVER_V3", sourceMode: "CURATED_COMPOSABLE_SCENARIO", qlAllocation: "PROVISIONAL_PENDING_SOURCE_SATURATION", reviewOnly: true, questionBankWritable: false, testEligible: false, mockEligible: false, publicEligible: false },
  });
}
