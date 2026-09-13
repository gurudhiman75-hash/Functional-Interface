import { causalPath } from "./causal-solver.ts";
import { CAE_001_CAUSAL_WORLDS } from "./causal-world-authorities.ts";
import type { CaeDifficultyEvidence, CaeLocale, CaeRenderedOption, GeneratedCaeQuestion } from "./types.ts";

const OPTION_TEXT: Record<CaeLocale, Readonly<Record<string, string>>> = {
  "en-IN": {
    FIRST_EFFECT_SECOND_IMMEDIATE: "Statement I is the effect and Statement II is its immediate cause.",
    SECOND_EFFECT_FIRST_IMMEDIATE: "Statement II is the effect and Statement I is its immediate cause.",
    FIRST_EFFECT_SECOND_REMOTE: "Statement I is the effect, but Statement II is not its immediate cause.",
    SECOND_EFFECT_FIRST_REMOTE: "Statement II is the effect, but Statement I is not its immediate cause.",
  },
  "hi-IN": {
    FIRST_EFFECT_SECOND_IMMEDIATE: "कथन I प्रभाव है और कथन II उसका तात्कालिक कारण है।",
    SECOND_EFFECT_FIRST_IMMEDIATE: "कथन II प्रभाव है और कथन I उसका तात्कालिक कारण है।",
    FIRST_EFFECT_SECOND_REMOTE: "कथन I प्रभाव है, लेकिन कथन II उसका तात्कालिक कारण नहीं है।",
    SECOND_EFFECT_FIRST_REMOTE: "कथन II प्रभाव है, लेकिन कथन I उसका तात्कालिक कारण नहीं है।",
  },
  "pa-IN": {
    FIRST_EFFECT_SECOND_IMMEDIATE: "ਕਥਨ I ਪ੍ਰਭਾਵ ਹੈ ਅਤੇ ਕਥਨ II ਉਸ ਦਾ ਤੁਰੰਤ ਕਾਰਨ ਹੈ।",
    SECOND_EFFECT_FIRST_IMMEDIATE: "ਕਥਨ II ਪ੍ਰਭਾਵ ਹੈ ਅਤੇ ਕਥਨ I ਉਸ ਦਾ ਤੁਰੰਤ ਕਾਰਨ ਹੈ।",
    FIRST_EFFECT_SECOND_REMOTE: "ਕਥਨ I ਪ੍ਰਭਾਵ ਹੈ, ਪਰ ਕਥਨ II ਉਸ ਦਾ ਤੁਰੰਤ ਕਾਰਨ ਨਹੀਂ ਹੈ।",
    SECOND_EFFECT_FIRST_REMOTE: "ਕਥਨ II ਪ੍ਰਭਾਵ ਹੈ, ਪਰ ਕਥਨ I ਉਸ ਦਾ ਤੁਰੰਤ ਕਾਰਨ ਨਹੀਂ ਹੈ।",
  },
};

const COPY: Record<CaeLocale, Readonly<{ prompt: string; one: string; two: string; immediate: string; remote: string }>> = {
  "en-IN": { prompt: "Read the two statements and identify the causal relationship.", one: "Statement I", two: "Statement II", immediate: "The cause directly produces the effect, so it is the immediate cause.", remote: "The cause is earlier in the same causal chain, but another event lies between it and the effect; therefore it is not the immediate cause." },
  "hi-IN": { prompt: "दोनों कथन पढ़िए और कारणात्मक संबंध पहचानिए।", one: "कथन I", two: "कथन II", immediate: "कारण से प्रभाव सीधे उत्पन्न होता है, इसलिए यह तात्कालिक कारण है।", remote: "कारण उसी कारणात्मक श्रृंखला में पहले आता है, लेकिन उसके और प्रभाव के बीच एक अन्य घटना है; इसलिए यह तात्कालिक कारण नहीं है।" },
  "pa-IN": { prompt: "ਦੋਵੇਂ ਕਥਨ ਪੜ੍ਹੋ ਅਤੇ ਕਾਰਨਾਤਮਕ ਸੰਬੰਧ ਪਛਾਣੋ।", one: "ਕਥਨ I", two: "ਕਥਨ II", immediate: "ਕਾਰਨ ਤੋਂ ਪ੍ਰਭਾਵ ਸਿੱਧੇ ਤੌਰ ਤੇ ਪੈਦਾ ਹੁੰਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਤੁਰੰਤ ਕਾਰਨ ਹੈ।", remote: "ਕਾਰਨ ਉਸੇ ਕਾਰਨਾਤਮਕ ਲੜੀ ਵਿੱਚ ਪਹਿਲਾਂ ਆਉਂਦਾ ਹੈ, ਪਰ ਉਸ ਅਤੇ ਪ੍ਰਭਾਵ ਦੇ ਵਿਚਕਾਰ ਇੱਕ ਹੋਰ ਘਟਨਾ ਹੈ; ਇਸ ਲਈ ਇਹ ਤੁਰੰਤ ਕਾਰਨ ਨਹੀਂ ਹੈ।" },
};

function mix32(value: number): number { let x = value | 0; x ^= x >>> 16; x = Math.imul(x, 0x7feb352d); x ^= x >>> 15; x = Math.imul(x, 0x846ca68b); x ^= x >>> 16; return x >>> 0; }
function shuffled<T>(values: readonly T[], seed: number): readonly T[] { const out = [...values]; let state = mix32(seed); for (let i = out.length - 1; i > 0; i -= 1) { state = mix32(state + i); const j = state % (i + 1); [out[i], out[j]] = [out[j]!, out[i]!]; } return out; }

const PAIRS = Object.freeze(CAE_001_CAUSAL_WORLDS.flatMap((world) => world.nodes.flatMap((cause) => world.nodes.flatMap((effect) => {
  if (cause.id === effect.id) return [];
  const path = causalPath(world, cause.id, effect.id);
  if (!path || path.length < 2) return [];
  return [{ world, cause, effect, path, direct: path.length === 2 } as const];
}))));

export function generateCp006CausalDistanceQuestion(input: Readonly<{ locale: CaeLocale; seed: number }>): GeneratedCaeQuestion {
  const wantDirect = (input.seed >>> 0) % 2 === 0;
  const pool = PAIRS.filter((pair) => pair.direct === wantDirect);
  if (pool.length === 0) throw new Error(`CAE CP006: no ${wantDirect ? "direct" : "indirect"} causal pairs available.`);
  const selected = pool[mix32((input.seed >>> 0) ^ 0x6cae006) % pool.length]!;
  const reversePresentation = mix32((input.seed >>> 0) ^ 0x1d57) % 2 === 1;
  const first = reversePresentation ? selected.effect : selected.cause;
  const second = reversePresentation ? selected.cause : selected.effect;
  const direct = selected.direct;
  const answerId = reversePresentation
    ? (direct ? "FIRST_EFFECT_SECOND_IMMEDIATE" : "FIRST_EFFECT_SECOND_REMOTE")
    : (direct ? "SECOND_EFFECT_FIRST_IMMEDIATE" : "SECOND_EFFECT_FIRST_REMOTE");
  const ids = ["FIRST_EFFECT_SECOND_IMMEDIATE", "SECOND_EFFECT_FIRST_IMMEDIATE", "FIRST_EFFECT_SECOND_REMOTE", "SECOND_EFFECT_FIRST_REMOTE"] as const;
  const options: readonly CaeRenderedOption[] = shuffled(ids.map((id) => ({
    id,
    text: OPTION_TEXT[input.locale][id]!,
    isCorrect: id === answerId,
    distractorRole: id === answerId ? undefined : id.includes("REMOTE") ? "INDIRECTNESS_CONFUSION" as const : "REVERSE_CAUSATION" as const,
  })), mix32((input.seed >>> 0) ^ 0x6a11));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const copy = COPY[input.locale];
  const traceText = selected.path.map((nodeId) => selected.world.nodes.find((node) => node.id === nodeId)!.text[input.locale].replace(/[.।]+$/u, "")).join(" → ");
  const stateId = ["projection:CAE-PLAN-CAUSAL-DISTANCE", `family:${selected.world.scenarioFamilyId}`, `variant:${selected.world.scenarioVariantId}`, `pair:${selected.cause.semanticSlot}>${selected.effect.semanticSlot}`, `direct:${direct}`, `visible:${first.semanticSlot},${second.semanticSlot}`].join("|");
  const itemVariantId = [stateId, "profile:FOUR_WAY", `presentation:${options.map((option) => option.id).join(">")}`].join("|");
  const evidence: CaeDifficultyEvidence = {
    causalDistance: selected.path.length - 1,
    hiddenLinks: Math.max(0, selected.path.length - 2),
    topologyComplexity: 1,
    plausibleDistractors: direct ? 2 : 3,
    visibleEventCount: 2,
    inferenceBurden: direct ? 3 : 5,
    candidatePlausibilityBurden: direct ? 1 : 4,
    score: direct ? 12 : 18,
  };
  return Object.freeze({
    chapterId: "CAE-001",
    checkpointId: "CAE-CP-006",
    qlId: "CAE-QL-006",
    projectionId: "CAE-PLAN-CAUSAL-DISTANCE",
    scenarioFamilyId: selected.world.scenarioFamilyId,
    scenarioVariantId: selected.world.scenarioVariantId,
    causalStateId: stateId,
    itemVariantId,
    semanticInstanceId: itemVariantId,
    causalWorldId: selected.world.id,
    causalStructure: `${direct ? "IMMEDIATE" : "REMOTE"}:${selected.cause.semanticSlot}>${selected.effect.semanticSlot}`,
    locale: input.locale,
    seed: input.seed,
    difficulty: direct ? "MEDIUM" : "HARD",
    difficultyEvidence: evidence,
    questionProfile: "FOUR_WAY",
    visibleContext: { backdrop: null, visibleNodeIds: [first.id, second.id], hiddenNodeIds: selected.path.slice(1, -1) },
    stem: `${copy.prompt}\n\n${copy.one}: ${first.text[input.locale]}\n\n${copy.two}: ${second.text[input.locale]}`,
    options: options.map((option) => option.text),
    correctIndex,
    answerId,
    explanation: `${traceText}. ${direct ? copy.immediate : copy.remote}`,
    causalTrace: selected.path,
    distractorMechanisms: options.flatMap((option) => option.distractorRole ? [option.distractorRole] : []),
    candidateComparisons: [],
    optionMetadata: options,
    metadata: { solver: "CAE_CAUSAL_WORLD_SOLVER_V3", sourceMode: "CURATED_COMPOSABLE_SCENARIO", qlAllocation: "PROVISIONAL_PENDING_SOURCE_SATURATION", reviewOnly: true, questionBankWritable: false, testEligible: false, mockEligible: false, publicEligible: false },
  });
}
