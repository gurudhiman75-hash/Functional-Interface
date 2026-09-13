import { causalPath } from "./causal-solver.ts";
import { CAE_001_CAUSAL_WORLDS } from "./causal-world-authorities.ts";
import type {
  CaeDifficulty,
  CaeDifficultyEvidence,
  CaeLocale,
  CaeRenderedOption,
  GeneratedCaeQuestion,
} from "./types.ts";

type Cp008Mode =
  | "SEQUENCE"
  | "IMMEDIATE_CAUSE"
  | "IMMEDIATE_EFFECT"
  | "EARLIEST_CAUSE"
  | "FINAL_EFFECT"
  | "BRIDGE_ROLE"
  | "INVALID_RELATION";

const MODES: readonly Cp008Mode[] = [
  "SEQUENCE",
  "IMMEDIATE_CAUSE",
  "IMMEDIATE_EFFECT",
  "EARLIEST_CAUSE",
  "FINAL_EFFECT",
  "BRIDGE_ROLE",
  "INVALID_RELATION",
];

const LABELS = ["P", "Q", "R", "S"] as const;
type EventLabel = (typeof LABELS)[number];

const COPY: Record<CaeLocale, Readonly<Record<string, string>>> = {
  "en-IN": {
    sequence: "Select the causally valid sequence.",
    immediateCause: "Which event is the immediate cause of {target}?",
    immediateEffect: "Which event is the immediate effect of {target}?",
    earliestCause: "Which event is the earliest cause in the chain leading to {target}?",
    finalEffect: "Which event is the most remote effect shown for {target}?",
    bridgeRole: "Which event is the immediate effect of {source} and also an indirect cause of {target}?",
    invalidRelation: "Which statement about the causal links is NOT supported?",
    immediateClaim: "{source} is the immediate cause of {target}.",
    pathThrough: "{source} reaches {target} through two intermediate events.",
    explanationSequence: "This order follows the causal chain step by step.",
    explanationImmediateCause: "This event directly produces the target event.",
    explanationImmediateEffect: "This event follows directly from the target event.",
    explanationEarliest: "This is the first event in the chain that eventually leads to the target.",
    explanationFinal: "This is the farthest downstream effect shown in the chain.",
    explanationBridge: "It comes directly after the source and still lies on the causal path to the target.",
    explanationInvalid: "The other three links match the chain; this one confuses an indirect relation with an immediate one.",
  },
  "hi-IN": {
    sequence: "कारणात्मक रूप से सही क्रम चुनिए।",
    immediateCause: "{target} का तात्कालिक कारण कौन-सी घटना है?",
    immediateEffect: "{target} का तात्कालिक प्रभाव कौन-सी घटना है?",
    earliestCause: "{target} तक पहुँचने वाली श्रृंखला में सबसे प्रारंभिक कारण कौन-सी घटना है?",
    finalEffect: "{target} का यहाँ दिखाया गया सबसे दूर का प्रभाव कौन-सा है?",
    bridgeRole: "कौन-सी घटना {source} का तात्कालिक प्रभाव और साथ ही {target} का अप्रत्यक्ष कारण है?",
    invalidRelation: "कारणात्मक संबंधों के बारे में कौन-सा कथन समर्थित नहीं है?",
    immediateClaim: "{source}, {target} का तात्कालिक कारण है।",
    pathThrough: "{source} से {target} तक पहुँचने के बीच दो मध्यवर्ती घटनाएँ आती हैं।",
    explanationSequence: "यह क्रम कारणात्मक श्रृंखला को चरण-दर-चरण दिखाता है।",
    explanationImmediateCause: "यह घटना लक्ष्य घटना को सीधे उत्पन्न करती है।",
    explanationImmediateEffect: "यह घटना लक्ष्य घटना के तुरंत बाद आती है।",
    explanationEarliest: "यह श्रृंखला की पहली घटना है जो अंततः लक्ष्य तक पहुँचाती है।",
    explanationFinal: "यह श्रृंखला में दिखाया गया सबसे दूर का प्रभाव है।",
    explanationBridge: "यह स्रोत के तुरंत बाद आती है और लक्ष्य तक जाने वाले कारणात्मक पथ पर बनी रहती है।",
    explanationInvalid: "बाकी तीन संबंध श्रृंखला से मेल खाते हैं; यह कथन अप्रत्यक्ष संबंध को तात्कालिक संबंध मानता है।",
  },
  "pa-IN": {
    sequence: "ਕਾਰਨਾਤਮਕ ਤੌਰ ਤੇ ਸਹੀ ਕ੍ਰਮ ਚੁਣੋ।",
    immediateCause: "{target} ਦਾ ਤੁਰੰਤ ਕਾਰਨ ਕਿਹੜੀ ਘਟਨਾ ਹੈ?",
    immediateEffect: "{target} ਦਾ ਤੁਰੰਤ ਪ੍ਰਭਾਵ ਕਿਹੜੀ ਘਟਨਾ ਹੈ?",
    earliestCause: "{target} ਤੱਕ ਪਹੁੰਚਣ ਵਾਲੀ ਲੜੀ ਵਿੱਚ ਸਭ ਤੋਂ ਪਹਿਲਾ ਕਾਰਨ ਕਿਹੜੀ ਘਟਨਾ ਹੈ?",
    finalEffect: "{target} ਦਾ ਇੱਥੇ ਦਿਖਾਇਆ ਸਭ ਤੋਂ ਦੂਰਲਾ ਪ੍ਰਭਾਵ ਕਿਹੜਾ ਹੈ?",
    bridgeRole: "ਕਿਹੜੀ ਘਟਨਾ {source} ਦਾ ਤੁਰੰਤ ਪ੍ਰਭਾਵ ਅਤੇ ਨਾਲ ਹੀ {target} ਦਾ ਅਪ੍ਰਤੱਖ ਕਾਰਨ ਹੈ?",
    invalidRelation: "ਕਾਰਨਾਤਮਕ ਸੰਬੰਧਾਂ ਬਾਰੇ ਕਿਹੜਾ ਕਥਨ ਸਮਰਥਿਤ ਨਹੀਂ ਹੈ?",
    immediateClaim: "{source}, {target} ਦਾ ਤੁਰੰਤ ਕਾਰਨ ਹੈ।",
    pathThrough: "{source} ਤੋਂ {target} ਤੱਕ ਪਹੁੰਚਣ ਵਿਚਕਾਰ ਦੋ ਵਿਚਕਾਰਲੀਆਂ ਘਟਨਾਵਾਂ ਆਉਂਦੀਆਂ ਹਨ।",
    explanationSequence: "ਇਹ ਕ੍ਰਮ ਕਾਰਨਾਤਮਕ ਲੜੀ ਨੂੰ ਕਦਮ-ਦਰ-ਕਦਮ ਦਿਖਾਉਂਦਾ ਹੈ।",
    explanationImmediateCause: "ਇਹ ਘਟਨਾ ਟੀਚਾ ਘਟਨਾ ਨੂੰ ਸਿੱਧੇ ਤੌਰ ਤੇ ਪੈਦਾ ਕਰਦੀ ਹੈ।",
    explanationImmediateEffect: "ਇਹ ਘਟਨਾ ਟੀਚਾ ਘਟਨਾ ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ ਆਉਂਦੀ ਹੈ।",
    explanationEarliest: "ਇਹ ਲੜੀ ਦੀ ਪਹਿਲੀ ਘਟਨਾ ਹੈ ਜੋ ਆਖ਼ਿਰਕਾਰ ਟੀਚੇ ਤੱਕ ਲੈ ਜਾਂਦੀ ਹੈ।",
    explanationFinal: "ਇਹ ਲੜੀ ਵਿੱਚ ਦਿਖਾਇਆ ਸਭ ਤੋਂ ਦੂਰਲਾ ਪ੍ਰਭਾਵ ਹੈ।",
    explanationBridge: "ਇਹ ਸਰੋਤ ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ ਆਉਂਦੀ ਹੈ ਅਤੇ ਟੀਚੇ ਤੱਕ ਜਾਣ ਵਾਲੇ ਕਾਰਨਾਤਮਕ ਰਸਤੇ ਉੱਤੇ ਰਹਿੰਦੀ ਹੈ।",
    explanationInvalid: "ਬਾਕੀ ਤਿੰਨ ਸੰਬੰਧ ਲੜੀ ਨਾਲ ਮੇਲ ਖਾਂਦੇ ਹਨ; ਇਹ ਕਥਨ ਅਪ੍ਰਤੱਖ ਸੰਬੰਧ ਨੂੰ ਤੁਰੰਤ ਸੰਬੰਧ ਮੰਨਦਾ ਹੈ।",
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
  let state = mix32(seed ^ 0x8e51a7);
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = mix32(state + index);
    const swap = state % (index + 1);
    [result[index], result[swap]] = [result[swap]!, result[index]!];
  }
  return result;
}

function trim(value: string): string {
  return value.replace(/[.।]+$/u, "");
}

function fill(template: string, values: Readonly<Record<string, string>>): string {
  return Object.entries(values).reduce((text, [key, value]) => text.replace(`{${key}}`, value), template);
}

function rootToLeafFour(world: (typeof CAE_001_CAUSAL_WORLDS)[number]): readonly string[] | null {
  const roots = world.nodes.filter((node) => !world.edges.some((edge) => edge.to === node.id));
  const leaves = world.nodes.filter((node) => !world.edges.some((edge) => edge.from === node.id));
  for (const root of roots) {
    for (const leaf of leaves) {
      const path = causalPath(world, root.id, leaf.id);
      if (path && path.length === 4) return path;
    }
  }
  return null;
}

export const CP008_MULTI_EVENT_WORLDS = Object.freeze(
  CAE_001_CAUSAL_WORLDS.filter((world) => rootToLeafFour(world) !== null),
);

function labelsForPath(path: readonly string[], seed: number): ReadonlyMap<string, EventLabel> {
  const assigned = shuffled(LABELS, seed ^ 0x8a11b3) as readonly EventLabel[];
  return new Map(path.map((id, index) => [id, assigned[index]!] as const));
}

function eventBlock(
  world: (typeof CAE_001_CAUSAL_WORLDS)[number],
  path: readonly string[],
  locale: CaeLocale,
  labelsByNode: ReadonlyMap<string, EventLabel>,
): string {
  return LABELS.map((label) => {
    const id = path.find((candidate) => labelsByNode.get(candidate) === label);
    if (!id) throw new Error(`${world.id}: missing CP008 event for label ${label}.`);
    return `${label}. ${world.nodes.find((node) => node.id === id)!.text[locale]}`;
  }).join("\n");
}

function eventText(world: (typeof CAE_001_CAUSAL_WORLDS)[number], id: string, locale: CaeLocale): string {
  return world.nodes.find((node) => node.id === id)!.text[locale];
}

function optionForEvent(world: (typeof CAE_001_CAUSAL_WORLDS)[number], id: string, locale: CaeLocale, isCorrect: boolean): CaeRenderedOption {
  return { id, text: eventText(world, id, locale), isCorrect, distractorRole: isCorrect ? undefined : "INDIRECTNESS_CONFUSION" };
}

function evidence(mode: Cp008Mode): Readonly<{ difficulty: CaeDifficulty; value: CaeDifficultyEvidence }> {
  const hard = mode === "BRIDGE_ROLE" || mode === "INVALID_RELATION";
  const score = hard ? 18 : mode === "SEQUENCE" ? 14 : 12;
  return {
    difficulty: hard ? "HARD" : "MEDIUM",
    value: {
      causalDistance: mode === "EARLIEST_CAUSE" || mode === "FINAL_EFFECT" ? 3 : mode === "BRIDGE_ROLE" ? 2 : 1,
      hiddenLinks: 0,
      topologyComplexity: 4,
      plausibleDistractors: hard ? 3 : 2,
      visibleEventCount: 4,
      inferenceBurden: hard ? 4 : 3,
      candidatePlausibilityBurden: hard ? 5 : 2,
      score,
    },
  };
}

export function generateCp008MultiEventQuestion(input: Readonly<{ locale: CaeLocale; seed: number }>): GeneratedCaeQuestion {
  if (CP008_MULTI_EVENT_WORLDS.length === 0) throw new Error("CAE CP008: no four-node causal worlds available.");
  const selectionSeed = mix32((input.seed >>> 0) ^ 0x8008cafe);
  const world = CP008_MULTI_EVENT_WORLDS[selectionSeed % CP008_MULTI_EVENT_WORLDS.length]!;
  const path = rootToLeafFour(world)!;
  const mode = MODES[mix32(selectionSeed ^ 0x80) % MODES.length]!;
  const locale = input.locale;
  const copy = COPY[locale];
  const labelsByNode = labelsForPath(path, selectionSeed);
  const labelOf = (id: string): EventLabel => {
    const label = labelsByNode.get(id);
    if (!label) throw new Error(`${world.id}/${mode}: no learner label for ${id}.`);
    return label;
  };
  const block = eventBlock(world, path, locale, labelsByNode);
  let stem = "";
  let options: readonly CaeRenderedOption[] = [];
  let answerId = "";
  let explanation = "";

  if (mode === "SEQUENCE") {
    const sequences = [
      path,
      [path[0]!, path[2]!, path[1]!, path[3]!],
      [path[1]!, path[0]!, path[2]!, path[3]!],
      [path[0]!, path[1]!, path[3]!, path[2]!],
    ];
    answerId = path.join("|");
    options = shuffled(sequences.map((candidate) => ({
      id: candidate.join("|"),
      text: candidate.map((id) => trim(eventText(world, id, locale))).join(" → "),
      isCorrect: candidate.join("|") === answerId,
      distractorRole: candidate.join("|") === answerId ? undefined : "TEMPORAL_VIOLATION" as const,
    })), selectionSeed);
    stem = `${copy.sequence}\n\n${block}`;
    explanation = `${path.map((id) => trim(eventText(world, id, locale))).join(" → ")}. ${copy.explanationSequence}`;
  } else if (mode === "IMMEDIATE_CAUSE") {
    const targetIndex = 1 + (mix32(selectionSeed ^ 0x81) % 3);
    const target = path[targetIndex]!;
    const answer = path[targetIndex - 1]!;
    answerId = answer;
    options = shuffled(path.map((id) => optionForEvent(world, id, locale, id === answer)), selectionSeed);
    stem = `${fill(copy.immediateCause, { target: labelOf(target) })}\n\n${block}`;
    explanation = `${trim(eventText(world, answer, locale))} → ${trim(eventText(world, target, locale))}. ${copy.explanationImmediateCause}`;
  } else if (mode === "IMMEDIATE_EFFECT") {
    const sourceIndex = mix32(selectionSeed ^ 0x82) % 3;
    const source = path[sourceIndex]!;
    const answer = path[sourceIndex + 1]!;
    answerId = answer;
    options = shuffled(path.map((id) => optionForEvent(world, id, locale, id === answer)), selectionSeed);
    stem = `${fill(copy.immediateEffect, { target: labelOf(source) })}\n\n${block}`;
    explanation = `${trim(eventText(world, source, locale))} → ${trim(eventText(world, answer, locale))}. ${copy.explanationImmediateEffect}`;
  } else if (mode === "EARLIEST_CAUSE") {
    const target = path[3]!;
    answerId = path[0]!;
    options = shuffled(path.map((id) => optionForEvent(world, id, locale, id === answerId)), selectionSeed);
    stem = `${fill(copy.earliestCause, { target: labelOf(target) })}\n\n${block}`;
    explanation = `${path.map((id) => trim(eventText(world, id, locale))).join(" → ")}. ${copy.explanationEarliest}`;
  } else if (mode === "FINAL_EFFECT") {
    const source = path[0]!;
    answerId = path[3]!;
    options = shuffled(path.map((id) => optionForEvent(world, id, locale, id === answerId)), selectionSeed);
    stem = `${fill(copy.finalEffect, { target: labelOf(source) })}\n\n${block}`;
    explanation = `${path.map((id) => trim(eventText(world, id, locale))).join(" → ")}. ${copy.explanationFinal}`;
  } else if (mode === "BRIDGE_ROLE") {
    answerId = path[1]!;
    options = shuffled(path.map((id) => optionForEvent(world, id, locale, id === answerId)), selectionSeed);
    stem = `${fill(copy.bridgeRole, { source: labelOf(path[0]!), target: labelOf(path[3]!) })}\n\n${block}`;
    explanation = `${trim(eventText(world, path[0]!, locale))} → ${trim(eventText(world, path[1]!, locale))} → … → ${trim(eventText(world, path[3]!, locale))}. ${copy.explanationBridge}`;
  } else {
    const claims = [
      { id: "PATH_0_TO_1", source: path[0]!, target: path[1]!, correct: false },
      { id: "PATH_1_TO_2", source: path[1]!, target: path[2]!, correct: false },
      { id: "PATH_2_TO_3", source: path[2]!, target: path[3]!, correct: false },
      { id: "PATH_0_IMMEDIATE_3", source: path[0]!, target: path[3]!, correct: true },
    ];
    answerId = "PATH_0_IMMEDIATE_3";
    options = shuffled(claims.map((claim) => ({
      id: claim.id,
      text: fill(copy.immediateClaim, { source: labelOf(claim.source), target: labelOf(claim.target) }),
      isCorrect: claim.correct,
      distractorRole: claim.correct ? undefined : "INDIRECTNESS_CONFUSION" as const,
    })), selectionSeed);
    stem = `${copy.invalidRelation}\n\n${block}`;
    explanation = `${fill(copy.pathThrough, { source: trim(eventText(world, path[0]!, locale)), target: trim(eventText(world, path[3]!, locale)) })} ${copy.explanationInvalid}`;
  }

  if (options.filter((option) => option.isCorrect).length !== 1) throw new Error(`${world.id}/${mode}: CP008 must have exactly one answer.`);
  if (new Set(options.map((option) => option.text)).size !== options.length) throw new Error(`${world.id}/${mode}: CP008 options must be unique.`);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const derived = evidence(mode);
  const labelSignature = path.map((id) => `${id}:${labelOf(id)}`).join(",");
  const causalStateId = `projection:CAE-PLAN-SEQUENCE-V2|world:${world.id}|mode:${mode}|path:${path.join(">")}`;
  const itemVariantId = `${causalStateId}|labels:${labelSignature}|presentation:${options.map((option) => option.id).join(">")}`;

  return Object.freeze({
    chapterId: "CAE-001",
    checkpointId: "CAE-CP-008",
    qlId: "CAE-QL-008",
    projectionId: "CAE-PLAN-SEQUENCE-V2",
    scenarioFamilyId: world.scenarioFamilyId,
    scenarioVariantId: world.scenarioVariantId,
    causalStateId,
    itemVariantId,
    semanticInstanceId: itemVariantId,
    causalWorldId: world.id,
    causalStructure: `MULTI_EVENT:${mode}:${path.map((id) => world.nodes.find((node) => node.id === id)!.semanticSlot).join(">")}`,
    locale,
    seed: input.seed,
    difficulty: derived.difficulty,
    difficultyEvidence: derived.value,
    questionProfile: "FOUR_WAY",
    visibleContext: { backdrop: null, visibleNodeIds: path, hiddenNodeIds: [] },
    stem,
    options: options.map((option) => option.text),
    correctIndex,
    answerId,
    explanation,
    causalTrace: path,
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