import { causalPath } from "./causal-solver.ts";
import { CAE_001_CAUSAL_WORLDS } from "./causal-world-authorities.ts";
import type {
  CaeCausalWorld,
  CaeDifficulty,
  CaeDifficultyEvidence,
  CaeLocale,
  CaeRenderedOption,
  GeneratedCaeQuestion,
} from "./types.ts";

type Cp009Mode = "MISSING_SINGLE" | "MISSING_PAIR" | "RELATION_TYPE" | "CONNECTOR_PAIR" | "NEXT_OUTCOME" | "COMMON_CAUSE_RECONSTRUCTION";
const MODES: readonly Cp009Mode[] = ["MISSING_SINGLE", "MISSING_PAIR", "RELATION_TYPE", "CONNECTOR_PAIR", "NEXT_OUTCOME", "COMMON_CAUSE_RECONSTRUCTION"];
const LABELS = ["P", "Q", "R", "S"] as const;

const COPY: Record<CaeLocale, Readonly<Record<string, string>>> = {
  "en-IN": {
    missingSingle: "Which event most logically completes the causal sequence?",
    missingPair: "Which pair of events correctly completes the two missing steps?",
    relationType: "Which relationship between P and S is supported by the causal information?",
    connectorPair: "Which pair forms the two-step connector between P and S?",
    nextOutcome: "The first three events are known. Which event most logically follows next?",
    commonCause: "Which hidden event best explains both observations?",
    direct: "P is the direct cause of S.",
    indirect: "P is an indirect cause of S.",
    common: "P and S are effects of a common cause.",
    none: "No causal relationship is established between P and S.",
    missingExplanation: "The missing event is the direct bridge between the two shown events.",
    pairExplanation: "These are the two intermediate events in the correct order.",
    relationExplanation: "P reaches S through intermediate events, so the relationship is indirect rather than direct.",
    connectorExplanation: "These two events lie between P and S on the same causal path.",
    nextExplanation: "This is the next downstream event supported by the causal chain.",
    commonExplanation: "The hidden event produces both visible outcomes; neither visible outcome causes the other.",
  },
  "hi-IN": {
    missingSingle: "कौन-सी घटना कारणात्मक क्रम को सबसे तार्किक रूप से पूरा करती है?",
    missingPair: "कौन-सी घटनाओं की जोड़ी दो लुप्त चरणों को सही क्रम में पूरा करती है?",
    relationType: "कारणात्मक जानकारी के आधार पर P और S के बीच कौन-सा संबंध समर्थित है?",
    connectorPair: "P और S के बीच दो-चरणीय जोड़ कौन-सी घटनाओं की जोड़ी बनाती है?",
    nextOutcome: "पहली तीन घटनाएं ज्ञात हैं। इसके बाद कौन-सी घटना सबसे तार्किक रूप से आएगी?",
    commonCause: "कौन-सी छिपी घटना दोनों अवलोकनों को सबसे अच्छी तरह समझाती है?",
    direct: "P, S का प्रत्यक्ष कारण है।",
    indirect: "P, S का अप्रत्यक्ष कारण है।",
    common: "P और S एक सामान्य कारण के प्रभाव हैं।",
    none: "P और S के बीच कोई कारणात्मक संबंध स्थापित नहीं है।",
    missingExplanation: "लुप्त घटना दिखाई गई दोनों घटनाओं के बीच प्रत्यक्ष सेतु है।",
    pairExplanation: "ये सही क्रम में दो मध्यवर्ती घटनाएं हैं।",
    relationExplanation: "P मध्यवर्ती घटनाओं के माध्यम से S तक पहुँचता है, इसलिए संबंध प्रत्यक्ष नहीं बल्कि अप्रत्यक्ष है।",
    connectorExplanation: "ये दोनों घटनाएं उसी कारणात्मक पथ पर P और S के बीच आती हैं।",
    nextExplanation: "यह कारणात्मक श्रृंखला से समर्थित अगली घटना है।",
    commonExplanation: "छिपी घटना दोनों दिखाई गई घटनाओं को उत्पन्न करती है; दिखाई गई कोई भी घटना दूसरी का कारण नहीं है।",
  },
  "pa-IN": {
    missingSingle: "ਕਿਹੜੀ ਘਟਨਾ ਕਾਰਨਾਤਮਕ ਕ੍ਰਮ ਨੂੰ ਸਭ ਤੋਂ ਤਰਕਸੰਗਤ ਢੰਗ ਨਾਲ ਪੂਰਾ ਕਰਦੀ ਹੈ?",
    missingPair: "ਕਿਹੜੀਆਂ ਘਟਨਾਵਾਂ ਦੀ ਜੋੜੀ ਦੋ ਲਾਪਤਾ ਪੜਾਅ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਪੂਰੇ ਕਰਦੀ ਹੈ?",
    relationType: "ਕਾਰਨਾਤਮਕ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ ਤੇ P ਅਤੇ S ਵਿਚਕਾਰ ਕਿਹੜਾ ਸੰਬੰਧ ਸਮਰਥਿਤ ਹੈ?",
    connectorPair: "P ਅਤੇ S ਵਿਚਕਾਰ ਦੋ-ਪੜਾਅ ਜੋੜ ਕਿਹੜੀਆਂ ਘਟਨਾਵਾਂ ਦੀ ਜੋੜੀ ਬਣਾਉਂਦੀ ਹੈ?",
    nextOutcome: "ਪਹਿਲੀਆਂ ਤਿੰਨ ਘਟਨਾਵਾਂ ਜਾਣੀਆਂ ਹਨ। ਅਗਲੀ ਸਭ ਤੋਂ ਤਰਕਸੰਗਤ ਘਟਨਾ ਕਿਹੜੀ ਹੈ?",
    commonCause: "ਕਿਹੜੀ ਲੁਕੀ ਘਟਨਾ ਦੋਵੇਂ ਨਿਰੀਖਣਾਂ ਨੂੰ ਸਭ ਤੋਂ ਚੰਗੀ ਤਰ੍ਹਾਂ ਸਮਝਾਉਂਦੀ ਹੈ?",
    direct: "P, S ਦਾ ਸਿੱਧਾ ਕਾਰਨ ਹੈ।",
    indirect: "P, S ਦਾ ਅਪ੍ਰਤੱਖ ਕਾਰਨ ਹੈ।",
    common: "P ਅਤੇ S ਇੱਕ ਸਾਂਝੇ ਕਾਰਨ ਦੇ ਪ੍ਰਭਾਵ ਹਨ।",
    none: "P ਅਤੇ S ਵਿਚਕਾਰ ਕੋਈ ਕਾਰਨਾਤਮਕ ਸੰਬੰਧ ਸਥਾਪਤ ਨਹੀਂ ਹੈ।",
    missingExplanation: "ਲਾਪਤਾ ਘਟਨਾ ਦਿਖਾਈਆਂ ਦੋ ਘਟਨਾਵਾਂ ਵਿਚਕਾਰ ਸਿੱਧਾ ਪੁਲ ਹੈ।",
    pairExplanation: "ਇਹ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਦੋ ਵਿਚਕਾਰਲੀਆਂ ਘਟਨਾਵਾਂ ਹਨ।",
    relationExplanation: "P ਵਿਚਕਾਰਲੀਆਂ ਘਟਨਾਵਾਂ ਰਾਹੀਂ S ਤੱਕ ਪਹੁੰਚਦਾ ਹੈ, ਇਸ ਲਈ ਸੰਬੰਧ ਸਿੱਧਾ ਨਹੀਂ ਸਗੋਂ ਅਪ੍ਰਤੱਖ ਹੈ।",
    connectorExplanation: "ਇਹ ਦੋਵੇਂ ਘਟਨਾਵਾਂ ਉਸੇ ਕਾਰਨਾਤਮਕ ਰਸਤੇ ਉੱਤੇ P ਅਤੇ S ਵਿਚਕਾਰ ਆਉਂਦੀਆਂ ਹਨ।",
    nextExplanation: "ਇਹ ਕਾਰਨਾਤਮਕ ਲੜੀ ਤੋਂ ਸਮਰਥਿਤ ਅਗਲੀ ਘਟਨਾ ਹੈ।",
    commonExplanation: "ਲੁਕੀ ਘਟਨਾ ਦੋਵੇਂ ਦਿਖਾਈਆਂ ਘਟਨਾਵਾਂ ਨੂੰ ਪੈਦਾ ਕਰਦੀ ਹੈ; ਦਿਖਾਈਆਂ ਘਟਨਾਵਾਂ ਵਿੱਚੋਂ ਕੋਈ ਵੀ ਦੂਜੇ ਦਾ ਕਾਰਨ ਨਹੀਂ ਹੈ।",
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
  let state = mix32(seed ^ 0x9a11c9);
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

function fourPath(world: CaeCausalWorld): readonly string[] | null {
  const roots = world.nodes.filter((node) => !world.edges.some((edge) => edge.to === node.id));
  const leaves = world.nodes.filter((node) => !world.edges.some((edge) => edge.from === node.id));
  for (const root of roots) for (const leaf of leaves) {
    const path = causalPath(world, root.id, leaf.id);
    if (path && path.length === 4) return path;
  }
  return null;
}

const CHAIN_WORLDS = Object.freeze(CAE_001_CAUSAL_WORLDS.filter((world) => fourPath(world) !== null));
const BRANCH_WORLDS = Object.freeze(CAE_001_CAUSAL_WORLDS.filter((world) => world.scenarioFamilyId === "CAE-FAM-SHARED-PRESSURE"));

function text(world: CaeCausalWorld, id: string, locale: CaeLocale): string {
  return world.nodes.find((node) => node.id === id)!.text[locale];
}

function distinctOtherNodes(world: CaeCausalWorld, excluded: readonly string[], locale: CaeLocale): readonly CaeRenderedOption[] {
  const own = world.nodes.filter((node) => !excluded.includes(node.id)).map((node) => ({ id: node.id, text: node.text[locale], isCorrect: false, distractorRole: "INDIRECTNESS_CONFUSION" as const }));
  return own;
}

function otherTerminalOptions(world: CaeCausalWorld, locale: CaeLocale, count: number): readonly CaeRenderedOption[] {
  const candidates = CHAIN_WORLDS.filter((entry) => entry.id !== world.id).flatMap((entry) => {
    const path = fourPath(entry)!;
    const id = path[3]!;
    return [{ id, text: text(entry, id, locale), isCorrect: false, distractorRole: "UNRELATED_EVENT" as const }];
  });
  const unique = [...new Map(candidates.map((entry) => [entry.text, entry])).values()];
  return unique.slice(0, count);
}

function otherCauseOptions(world: CaeCausalWorld, locale: CaeLocale, count: number): readonly CaeRenderedOption[] {
  const candidates = CAE_001_CAUSAL_WORLDS.filter((entry) => entry.id !== world.id).flatMap((entry) => {
    const causes = entry.nodes.filter((node) => node.role === "CAUSE");
    return causes.map((node) => ({ id: node.id, text: node.text[locale], isCorrect: false, distractorRole: "COMMON_CAUSE_CONFUSION" as const }));
  });
  const unique = [...new Map(candidates.map((entry) => [entry.text, entry])).values()];
  return unique.slice(0, count);
}

function difficulty(mode: Cp009Mode): Readonly<{ difficulty: CaeDifficulty; evidence: CaeDifficultyEvidence }> {
  const medium = mode === "MISSING_SINGLE";
  return {
    difficulty: medium ? "MEDIUM" : "HARD",
    evidence: {
      causalDistance: mode === "RELATION_TYPE" || mode === "CONNECTOR_PAIR" ? 3 : 2,
      hiddenLinks: mode === "COMMON_CAUSE_RECONSTRUCTION" ? 1 : mode === "MISSING_PAIR" ? 2 : 1,
      topologyComplexity: mode === "COMMON_CAUSE_RECONSTRUCTION" ? 2 : 4,
      plausibleDistractors: medium ? 2 : 3,
      visibleEventCount: mode === "COMMON_CAUSE_RECONSTRUCTION" ? 2 : 4,
      inferenceBurden: medium ? 2 : 4,
      candidatePlausibilityBurden: medium ? 3 : 7,
      score: medium ? 13 : 20,
    },
  };
}

export function generateCp009IntegratedQuestion(input: Readonly<{ locale: CaeLocale; seed: number }>): GeneratedCaeQuestion {
  const selectionSeed = mix32((input.seed >>> 0) ^ 0x9009cafe);
  const mode = MODES[mix32(selectionSeed ^ 0x99) % MODES.length]!;
  const locale = input.locale;
  const copy = COPY[locale];
  let world: CaeCausalWorld;
  let trace: readonly string[];
  let visibleNodeIds: readonly string[];
  let stem = "";
  let options: readonly CaeRenderedOption[] = [];
  let answerId = "";
  let explanation = "";

  if (mode === "COMMON_CAUSE_RECONSTRUCTION") {
    if (BRANCH_WORLDS.length === 0) throw new Error("CAE CP009: no branching worlds available.");
    world = BRANCH_WORLDS[selectionSeed % BRANCH_WORLDS.length]!;
    const cause = world.nodes.find((node) => node.role === "CAUSE")!;
    const effects = world.nodes.filter((node) => node.role === "EFFECT");
    visibleNodeIds = effects.map((node) => node.id);
    trace = [cause.id, ...visibleNodeIds];
    answerId = cause.id;
    options = shuffled([
      { id: cause.id, text: cause.text[locale], isCorrect: true },
      ...otherCauseOptions(world, locale, 3),
    ], selectionSeed);
    stem = `${copy.commonCause}\n\nP. ${effects[0]!.text[locale]}\nQ. ${effects[1]!.text[locale]}`;
    explanation = `${trim(cause.text[locale])} → ${trim(effects[0]!.text[locale])} / ${trim(effects[1]!.text[locale])}. ${copy.commonExplanation}`;
  } else {
    if (CHAIN_WORLDS.length === 0) throw new Error("CAE CP009: no four-node chain worlds available.");
    world = CHAIN_WORLDS[selectionSeed % CHAIN_WORLDS.length]!;
    const path = fourPath(world)!;
    trace = path;

    if (mode === "MISSING_SINGLE") {
      const gap = 1 + (mix32(selectionSeed ^ 0x91) % 2);
      const answer = path[gap]!;
      const source = path[gap - 1]!;
      const target = path[gap + 1]!;
      answerId = answer;
      visibleNodeIds = [source, target];
      const distractors = distinctOtherNodes(world, [answer, source, target], locale);
      options = shuffled([
        { id: answer, text: text(world, answer, locale), isCorrect: true },
        ...distractors,
        ...otherTerminalOptions(world, locale, 3),
      ].slice(0, 4), selectionSeed);
      stem = `${copy.missingSingle}\n\n${text(world, source, locale)} → ? → ${text(world, target, locale)}`;
      explanation = `${trim(text(world, source, locale))} → ${trim(text(world, answer, locale))} → ${trim(text(world, target, locale))}. ${copy.missingExplanation}`;
    } else if (mode === "MISSING_PAIR" || mode === "CONNECTOR_PAIR") {
      answerId = `${path[1]}|${path[2]}`;
      visibleNodeIds = [path[0]!, path[3]!];
      const pairText = (a: string, b: string) => `${trim(text(world, a, locale))} → ${trim(text(world, b, locale))}`;
      const pairs = [
        { id: answerId, text: pairText(path[1]!, path[2]!), isCorrect: true },
        { id: `${path[2]}|${path[1]}`, text: pairText(path[2]!, path[1]!), isCorrect: false, distractorRole: "TEMPORAL_VIOLATION" as const },
        { id: `${path[0]}|${path[2]}`, text: pairText(path[0]!, path[2]!), isCorrect: false, distractorRole: "INDIRECTNESS_CONFUSION" as const },
        { id: `${path[1]}|${path[3]}`, text: pairText(path[1]!, path[3]!), isCorrect: false, distractorRole: "INDIRECTNESS_CONFUSION" as const },
      ];
      options = shuffled(pairs, selectionSeed);
      stem = mode === "MISSING_PAIR"
        ? `${copy.missingPair}\n\n${text(world, path[0]!, locale)} → ? → ? → ${text(world, path[3]!, locale)}`
        : `${copy.connectorPair}\n\nP. ${text(world, path[0]!, locale)}\nS. ${text(world, path[3]!, locale)}`;
      explanation = `${path.map((id) => trim(text(world, id, locale))).join(" → ")}. ${mode === "MISSING_PAIR" ? copy.pairExplanation : copy.connectorExplanation}`;
    } else if (mode === "RELATION_TYPE") {
      answerId = "INDIRECT";
      visibleNodeIds = [path[0]!, path[3]!];
      options = shuffled([
        { id: "DIRECT", text: copy.direct, isCorrect: false, distractorRole: "INDIRECTNESS_CONFUSION" },
        { id: "INDIRECT", text: copy.indirect, isCorrect: true },
        { id: "COMMON", text: copy.common, isCorrect: false, distractorRole: "COMMON_CAUSE_CONFUSION" },
        { id: "NONE", text: copy.none, isCorrect: false, distractorRole: "UNRELATED_EVENT" },
      ], selectionSeed);
      stem = `${copy.relationType}\n\nP. ${text(world, path[0]!, locale)}\nS. ${text(world, path[3]!, locale)}`;
      explanation = `${path.map((id) => trim(text(world, id, locale))).join(" → ")}. ${copy.relationExplanation}`;
    } else {
      answerId = path[3]!;
      visibleNodeIds = path.slice(0, 3);
      options = shuffled([
        { id: path[3]!, text: text(world, path[3]!, locale), isCorrect: true },
        ...otherTerminalOptions(world, locale, 3),
      ], selectionSeed);
      stem = `${copy.nextOutcome}\n\n${path.slice(0, 3).map((id, index) => `${LABELS[index]}. ${text(world, id, locale)}`).join("\n")}`;
      explanation = `${path.map((id) => trim(text(world, id, locale))).join(" → ")}. ${copy.nextExplanation}`;
    }
  }

  if (options.length !== 4) throw new Error(`${world.id}/${mode}: CP009 must render four options.`);
  if (options.filter((option) => option.isCorrect).length !== 1) throw new Error(`${world.id}/${mode}: CP009 must have exactly one answer.`);
  if (new Set(options.map((option) => option.text)).size !== options.length) throw new Error(`${world.id}/${mode}: CP009 options must be unique.`);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const derived = difficulty(mode);
  const causalStateId = `projection:CAE-PLAN-INTEGRATED-V2|world:${world.id}|mode:${mode}|trace:${trace.join(">")}|visible:${visibleNodeIds.join(",")}`;
  const itemVariantId = `${causalStateId}|presentation:${options.map((option) => option.id).join(">")}`;

  return Object.freeze({
    chapterId: "CAE-001",
    checkpointId: "CAE-CP-009",
    qlId: "CAE-QL-009",
    projectionId: "CAE-PLAN-INTEGRATED-V2",
    scenarioFamilyId: world.scenarioFamilyId,
    scenarioVariantId: world.scenarioVariantId,
    causalStateId,
    itemVariantId,
    semanticInstanceId: itemVariantId,
    causalWorldId: world.id,
    causalStructure: `INTEGRATED:${mode}`,
    locale,
    seed: input.seed,
    difficulty: derived.difficulty,
    difficultyEvidence: derived.evidence,
    questionProfile: "FOUR_WAY",
    visibleContext: { backdrop: null, visibleNodeIds, hiddenNodeIds: world.nodes.filter((node) => !visibleNodeIds.includes(node.id)).map((node) => node.id) },
    stem,
    options: options.map((option) => option.text),
    correctIndex,
    answerId,
    explanation,
    causalTrace: trace,
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
