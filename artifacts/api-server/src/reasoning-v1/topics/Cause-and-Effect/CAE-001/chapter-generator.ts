import { causalPath, hasDirectEdge, nodeById, solveCaeRelationship } from "./causal-solver.ts";
import { CAE_001_CAUSAL_WORLDS, CAE_001_PROJECTION_AUTHORITIES } from "./causal-world-authorities.ts";
import type {
  CaeCausalWorld,
  CaeLocale,
  CaeProjectionAuthority,
  CaeQuestionProfile,
  CaeRelationship,
  CaeRenderedOption,
  GeneratedCaeQuestion,
} from "./types.ts";

function mix32(value: number): number {
  let x = value | 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return x >>> 0;
}

function hashText(value: string): number {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function worldFor(id: string): CaeCausalWorld {
  const world = CAE_001_CAUSAL_WORLDS.find((entry) => entry.id === id);
  if (!world) throw new Error(`Unknown CAE-001 causal world '${id}'.`);
  return world;
}

function globalNodeText(nodeId: string, locale: CaeLocale): string {
  for (const world of CAE_001_CAUSAL_WORLDS) {
    const node = world.nodes.find((entry) => entry.id === nodeId);
    if (node) return node.text[locale];
  }
  throw new Error(`Unknown CAE-001 causal node '${nodeId}'.`);
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

const COPY: Record<CaeLocale, Readonly<Record<string, string>>> = {
  "en-IN": {
    relationship: "Read the situation and determine the relationship between Statement I and Statement II. Use only the information given.",
    statementOne: "Statement I",
    statementTwo: "Statement II",
    situation: "Situation",
    probableCause: "Which of the following is the most probable immediate cause of the event described above?",
    probableEffect: "Which of the following is the most probable immediate effect of the event described above?",
    competing: "Which proposed event best explains the observed outcome in its timing and scope?",
    indirect: "Which relationship between the two events is best supported?",
    correlation: "Which conclusion about the two observations is logically supported?",
    sequence: "Study the events and select the causally valid sequence.",
    missing: "Which event most logically completes the causal sequence?",
    observation: "Observation",
    therefore: "Therefore",
  },
  "hi-IN": {
    relationship: "स्थिति पढ़िए और कथन I तथा कथन II के बीच संबंध तय कीजिए। केवल दी गई जानकारी का उपयोग करें।",
    statementOne: "कथन I",
    statementTwo: "कथन II",
    situation: "स्थिति",
    probableCause: "ऊपर वर्णित घटना का सबसे संभावित तात्कालिक कारण निम्न में से कौन-सा है?",
    probableEffect: "ऊपर वर्णित घटना का सबसे संभावित तात्कालिक प्रभाव निम्न में से कौन-सा है?",
    competing: "कौन-सी प्रस्तावित घटना समय और दायरे के आधार पर देखे गए परिणाम को सबसे अच्छी तरह समझाती है?",
    indirect: "दो घटनाओं के बीच कौन-सा संबंध सबसे अच्छी तरह समर्थित है?",
    correlation: "दो अवलोकनों के बारे में कौन-सा निष्कर्ष तार्किक रूप से समर्थित है?",
    sequence: "घटनाओं का अध्ययन कीजिए और कारणात्मक रूप से सही क्रम चुनिए।",
    missing: "कौन-सी घटना कारणात्मक क्रम को सबसे तार्किक रूप से पूरा करती है?",
    observation: "अवलोकन",
    therefore: "अतः",
  },
  "pa-IN": {
    relationship: "ਸਥਿਤੀ ਪੜ੍ਹੋ ਅਤੇ ਕਥਨ I ਤੇ ਕਥਨ II ਵਿਚਕਾਰ ਸੰਬੰਧ ਨਿਰਧਾਰਤ ਕਰੋ। ਕੇਵਲ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਦੀ ਵਰਤੋਂ ਕਰੋ।",
    statementOne: "ਕਥਨ I",
    statementTwo: "ਕਥਨ II",
    situation: "ਸਥਿਤੀ",
    probableCause: "ਉੱਪਰ ਵਰਣਿਤ ਘਟਨਾ ਦਾ ਸਭ ਤੋਂ ਸੰਭਾਵੀ ਤੁਰੰਤ ਕਾਰਨ ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਹੈ?",
    probableEffect: "ਉੱਪਰ ਵਰਣਿਤ ਘਟਨਾ ਦਾ ਸਭ ਤੋਂ ਸੰਭਾਵੀ ਤੁਰੰਤ ਪ੍ਰਭਾਵ ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਹੈ?",
    competing: "ਸਮੇਂ ਅਤੇ ਦਾਇਰੇ ਦੇ ਆਧਾਰ ਤੇ ਕਿਹੜੀ ਪ੍ਰਸਤਾਵਿਤ ਘਟਨਾ ਦੇਖੇ ਗਏ ਨਤੀਜੇ ਨੂੰ ਸਭ ਤੋਂ ਚੰਗੀ ਤਰ੍ਹਾਂ ਸਮਝਾਉਂਦੀ ਹੈ?",
    indirect: "ਦੋ ਘਟਨਾਵਾਂ ਵਿਚਕਾਰ ਕਿਹੜਾ ਸੰਬੰਧ ਸਭ ਤੋਂ ਵਧੀਆ ਢੰਗ ਨਾਲ ਸਮਰਥਿਤ ਹੈ?",
    correlation: "ਦੋ ਨਿਰੀਖਣਾਂ ਬਾਰੇ ਕਿਹੜਾ ਨਤੀਜਾ ਤਰਕਸੰਗਤ ਤੌਰ ਤੇ ਸਮਰਥਿਤ ਹੈ?",
    sequence: "ਘਟਨਾਵਾਂ ਦਾ ਅਧਿਐਨ ਕਰੋ ਅਤੇ ਕਾਰਨਾਤਮਕ ਤੌਰ ਤੇ ਸਹੀ ਕ੍ਰਮ ਚੁਣੋ।",
    missing: "ਕਿਹੜੀ ਘਟਨਾ ਕਾਰਨਾਤਮਕ ਕ੍ਰਮ ਨੂੰ ਸਭ ਤੋਂ ਤਰਕਸੰਗਤ ਢੰਗ ਨਾਲ ਪੂਰਾ ਕਰਦੀ ਹੈ?",
    observation: "ਨਿਰੀਖਣ",
    therefore: "ਇਸ ਲਈ",
  },
};

const RELATION_OPTION_TEXT: Record<CaeLocale, Readonly<Record<string, string>>> = {
  "en-IN": {
    FIRST_DIRECT_CAUSES_SECOND: "Statement I is the cause and Statement II is its effect.",
    SECOND_DIRECT_CAUSES_FIRST: "Statement II is the cause and Statement I is its effect.",
    INDEPENDENT_CAUSES: "Statements I and II are independent causes.",
    INDEPENDENT_EFFECTS: "Statements I and II are effects of independent causes.",
    COMMON_CAUSE: "Statements I and II are effects of a common cause.",
    INDEPENDENT: "The statements are independent; neither causes the other.",
    INDIRECT_FIRST_CAUSES_SECOND: "Statement I is an indirect cause of Statement II.",
    INDIRECT_SECOND_CAUSES_FIRST: "Statement II is an indirect cause of Statement I.",
    NO_CAUSAL_LINK: "No causal relationship is established between the statements.",
    CORRELATION_ONLY: "Their timing alone does not establish a causal relationship.",
  },
  "hi-IN": {
    FIRST_DIRECT_CAUSES_SECOND: "कथन I कारण है और कथन II उसका प्रभाव है।",
    SECOND_DIRECT_CAUSES_FIRST: "कथन II कारण है और कथन I उसका प्रभाव है।",
    INDEPENDENT_CAUSES: "कथन I और II स्वतंत्र कारण हैं।",
    INDEPENDENT_EFFECTS: "कथन I और II स्वतंत्र कारणों के प्रभाव हैं।",
    COMMON_CAUSE: "कथन I और II एक सामान्य कारण के प्रभाव हैं।",
    INDEPENDENT: "कथन स्वतंत्र हैं; कोई भी दूसरे का कारण नहीं है।",
    INDIRECT_FIRST_CAUSES_SECOND: "कथन I, कथन II का अप्रत्यक्ष कारण है।",
    INDIRECT_SECOND_CAUSES_FIRST: "कथन II, कथन I का अप्रत्यक्ष कारण है।",
    NO_CAUSAL_LINK: "कथनों के बीच कोई कारणात्मक संबंध स्थापित नहीं है।",
    CORRELATION_ONLY: "केवल एक ही समय पर होना कारणात्मक संबंध स्थापित नहीं करता।",
  },
  "pa-IN": {
    FIRST_DIRECT_CAUSES_SECOND: "ਕਥਨ I ਕਾਰਨ ਹੈ ਅਤੇ ਕਥਨ II ਉਸ ਦਾ ਪ੍ਰਭਾਵ ਹੈ।",
    SECOND_DIRECT_CAUSES_FIRST: "ਕਥਨ II ਕਾਰਨ ਹੈ ਅਤੇ ਕਥਨ I ਉਸ ਦਾ ਪ੍ਰਭਾਵ ਹੈ।",
    INDEPENDENT_CAUSES: "ਕਥਨ I ਅਤੇ II ਸੁਤੰਤਰ ਕਾਰਨ ਹਨ।",
    INDEPENDENT_EFFECTS: "ਕਥਨ I ਅਤੇ II ਸੁਤੰਤਰ ਕਾਰਨਾਂ ਦੇ ਪ੍ਰਭਾਵ ਹਨ।",
    COMMON_CAUSE: "ਕਥਨ I ਅਤੇ II ਇੱਕ ਸਾਂਝੇ ਕਾਰਨ ਦੇ ਪ੍ਰਭਾਵ ਹਨ।",
    INDEPENDENT: "ਕਥਨ ਸੁਤੰਤਰ ਹਨ; ਕੋਈ ਵੀ ਦੂਜੇ ਦਾ ਕਾਰਨ ਨਹੀਂ ਹੈ।",
    INDIRECT_FIRST_CAUSES_SECOND: "ਕਥਨ I, ਕਥਨ II ਦਾ ਅਪ੍ਰਤੱਖ ਕਾਰਨ ਹੈ।",
    INDIRECT_SECOND_CAUSES_FIRST: "ਕਥਨ II, ਕਥਨ I ਦਾ ਅਪ੍ਰਤੱਖ ਕਾਰਨ ਹੈ।",
    NO_CAUSAL_LINK: "ਕਥਨਾਂ ਵਿਚਕਾਰ ਕੋਈ ਕਾਰਨਾਤਮਕ ਸੰਬੰਧ ਸਥਾਪਤ ਨਹੀਂ ਹੈ।",
    CORRELATION_ONLY: "ਕੇਵਲ ਇੱਕੋ ਸਮੇਂ ਹੋਣਾ ਕਾਰਨਾਤਮਕ ਸੰਬੰਧ ਸਥਾਪਤ ਨਹੀਂ ਕਰਦਾ।",
  },
};

function relationshipOptions(locale: CaeLocale, profile: CaeQuestionProfile, relationship: CaeRelationship, seed: number): readonly CaeRenderedOption[] {
  const ids = profile === "FIVE_WAY"
    ? ["FIRST_DIRECT_CAUSES_SECOND", "SECOND_DIRECT_CAUSES_FIRST", "INDEPENDENT_CAUSES", "INDEPENDENT_EFFECTS", "COMMON_CAUSE"]
    : ["FIRST_DIRECT_CAUSES_SECOND", "SECOND_DIRECT_CAUSES_FIRST", "INDEPENDENT", "COMMON_CAUSE"];
  const answerId = profile === "FOUR_WAY" && (relationship === "INDEPENDENT_CAUSES" || relationship === "INDEPENDENT_EFFECTS")
    ? "INDEPENDENT"
    : relationship;
  return shuffled(ids.map((id) => ({ id, text: RELATION_OPTION_TEXT[locale][id]!, isCorrect: id === answerId })), seed);
}

function nodeOptions(projection: CaeProjectionAuthority, locale: CaeLocale, seed: number): readonly CaeRenderedOption[] {
  const correctNodeId = projection.correctNodeId ?? projection.missingLinkNodeId;
  if (!projection.candidateNodeIds || !correctNodeId) throw new Error(`${projection.id}: candidate-node projection is incomplete.`);
  return shuffled(projection.candidateNodeIds.map((nodeId) => ({
    id: nodeId,
    text: globalNodeText(nodeId, locale),
    isCorrect: nodeId === correctNodeId,
    distractorRole: projection.distractorRoles?.[nodeId],
  })), seed);
}

function renderTrace(world: CaeCausalWorld, locale: CaeLocale, nodeIds: readonly string[]): string {
  return nodeIds.map((nodeId) => nodeById(world, nodeId).text[locale]).join(" → ");
}

function optionsForProjection(
  projection: CaeProjectionAuthority,
  world: CaeCausalWorld,
  locale: CaeLocale,
  profile: CaeQuestionProfile,
  seed: number,
): { options: readonly CaeRenderedOption[]; answerId: string; explanation: string; trace: readonly string[]; questionProfile: CaeQuestionProfile | null } {
  const copy = COPY[locale];
  const relationship = projection.displayedNodeIds.length === 2
    ? solveCaeRelationship(world, projection.displayedNodeIds[0]!, projection.displayedNodeIds[1]!)
    : null;

  if (projection.kind === "DIRECT_RELATIONSHIP" || projection.kind === "COMMON_OR_INDEPENDENT") {
    if (!relationship) throw new Error(`${projection.id}: relationship projection needs two displayed nodes.`);
    const options = relationshipOptions(locale, profile, relationship, seed);
    const path = relationship === "FIRST_DIRECT_CAUSES_SECOND" || relationship === "SECOND_DIRECT_CAUSES_FIRST"
      ? causalPath(world, relationship === "FIRST_DIRECT_CAUSES_SECOND" ? projection.displayedNodeIds[0]! : projection.displayedNodeIds[1]!, relationship === "FIRST_DIRECT_CAUSES_SECOND" ? projection.displayedNodeIds[1]! : projection.displayedNodeIds[0]!) ?? []
      : projection.displayedNodeIds;
    const answerId = options.find((option) => option.isCorrect)!.id;
    return {
      options,
      answerId,
      explanation: `${renderTrace(world, locale, path)}. ${copy.therefore}, ${RELATION_OPTION_TEXT[locale][answerId]!}`,
      trace: path,
      questionProfile: profile,
    };
  }

  if (projection.kind === "PROBABLE_CAUSE" || projection.kind === "PROBABLE_EFFECT" || projection.kind === "COMPETING_EXPLANATION" || projection.kind === "MISSING_CAUSAL_LINK") {
    const options = nodeOptions(projection, locale, seed);
    const correctId = options.find((option) => option.isCorrect)!.id;
    const path = projection.kind === "MISSING_CAUSAL_LINK"
      ? [projection.displayedNodeIds[0]!, correctId, projection.targetNodeId!]
      : projection.kind === "PROBABLE_EFFECT"
      ? causalPath(world, projection.targetNodeId!, correctId) ?? []
      : causalPath(world, correctId, projection.targetNodeId!) ?? [];
    return {
      options,
      answerId: correctId,
      explanation: `${renderTrace(world, locale, path)}. ${copy.therefore}, ${globalNodeText(correctId, locale)}`,
      trace: path,
      questionProfile: null,
    };
  }

  if (projection.kind === "INDIRECT_CAUSAL_CHAIN") {
    if (!relationship) throw new Error(`${projection.id}: indirect projection needs two displayed nodes.`);
    const ids = ["INDIRECT_FIRST_CAUSES_SECOND", "INDIRECT_SECOND_CAUSES_FIRST", "COMMON_CAUSE", "NO_CAUSAL_LINK"];
    const options = shuffled(ids.map((id) => ({ id, text: RELATION_OPTION_TEXT[locale][id]!, isCorrect: id === relationship })), seed);
    const path = causalPath(world, projection.displayedNodeIds[0]!, projection.displayedNodeIds[1]!) ?? [];
    return { options, answerId: relationship, explanation: `${renderTrace(world, locale, path)}. ${copy.therefore}, ${RELATION_OPTION_TEXT[locale][relationship]!}`, trace: path, questionProfile: null };
  }

  if (projection.kind === "CORRELATION_CHECK") {
    const ids = ["FIRST_DIRECT_CAUSES_SECOND", "SECOND_DIRECT_CAUSES_FIRST", "COMMON_CAUSE", "CORRELATION_ONLY"];
    const options = shuffled(ids.map((id): CaeRenderedOption => ({ id, text: RELATION_OPTION_TEXT[locale][id]!, isCorrect: id === "CORRELATION_ONLY", distractorRole: id === "CORRELATION_ONLY" ? undefined : "CORRELATION" })), seed);
    return { options, answerId: "CORRELATION_ONLY", explanation: `${copy.therefore}, ${RELATION_OPTION_TEXT[locale].CORRELATION_ONLY!}`, trace: projection.displayedNodeIds, questionProfile: null };
  }

  if (projection.kind === "MULTI_EVENT_SEQUENCE") {
    const sequence = projection.sequenceNodeIds!;
    const candidates = [
      sequence,
      [sequence[0]!, sequence[2]!, sequence[1]!, sequence[3]!],
      [sequence[1]!, sequence[0]!, sequence[2]!, sequence[3]!],
      [sequence[0]!, sequence[1]!, sequence[3]!, sequence[2]!],
    ];
    const answerId = sequence.join("|");
    const options = shuffled(candidates.map((candidate): CaeRenderedOption => ({ id: candidate.join("|"), text: candidate.map((nodeId) => nodeById(world, nodeId).text[locale]).join(" → "), isCorrect: candidate.join("|") === answerId, distractorRole: candidate.join("|") === answerId ? undefined : "TEMPORAL_VIOLATION" })), seed);
    return { options, answerId, explanation: `${renderTrace(world, locale, sequence)}. ${copy.therefore}, this is the supported causal sequence.`, trace: sequence, questionProfile: null };
  }

  throw new Error(`${projection.id}: unsupported projection kind '${projection.kind}'.`);
}

function stemFor(projection: CaeProjectionAuthority, world: CaeCausalWorld, locale: CaeLocale): string {
  const copy = COPY[locale];
  const nodes = projection.displayedNodeIds.map((nodeId) => nodeById(world, nodeId));
  const situation = `${copy.situation}: ${world.context[locale]}`;
  if (projection.kind === "DIRECT_RELATIONSHIP" || projection.kind === "COMMON_OR_INDEPENDENT") {
    return `${copy.relationship}\n\n${situation}\n\n${copy.statementOne}: ${nodes[0]!.text[locale]}\n\n${copy.statementTwo}: ${nodes[1]!.text[locale]}`;
  }
  if (projection.kind === "PROBABLE_CAUSE") return `${situation}\n\n${copy.observation}: ${nodeById(world, projection.targetNodeId!).text[locale]}\n\n${copy.probableCause}`;
  if (projection.kind === "PROBABLE_EFFECT") return `${situation}\n\n${copy.observation}: ${nodeById(world, projection.targetNodeId!).text[locale]}\n\n${copy.probableEffect}`;
  if (projection.kind === "COMPETING_EXPLANATION") return `${situation}\n\n${copy.observation}: ${nodeById(world, projection.targetNodeId!).text[locale]}\n\n${copy.competing}`;
  if (projection.kind === "INDIRECT_CAUSAL_CHAIN") return `${copy.indirect}\n\n${situation}\n\n${copy.statementOne}: ${nodes[0]!.text[locale]}\n\n${copy.statementTwo}: ${nodes[1]!.text[locale]}`;
  if (projection.kind === "CORRELATION_CHECK") return `${copy.correlation}\n\n${situation}\n\n${copy.statementOne}: ${nodes[0]!.text[locale]}\n\n${copy.statementTwo}: ${nodes[1]!.text[locale]}`;
  if (projection.kind === "MULTI_EVENT_SEQUENCE") return `${copy.sequence}\n\n${situation}\n\n${nodes.map((node, index) => `${String.fromCharCode(80 + index)}. ${node.text[locale]}`).join("\n")}`;
  if (projection.kind === "MISSING_CAUSAL_LINK") return `${copy.missing}\n\n${situation}\n\n${nodeById(world, projection.displayedNodeIds[0]!).text[locale]} → ? → ${nodeById(world, projection.targetNodeId!).text[locale]}`;
  throw new Error(`${projection.id}: unsupported projection kind.`);
}

export function generateCaeQuestion(input: {
  readonly qlId: CaeProjectionAuthority["qlId"];
  readonly locale: CaeLocale;
  readonly seed: number;
  readonly questionProfile?: CaeQuestionProfile;
}): GeneratedCaeQuestion {
  const projections = CAE_001_PROJECTION_AUTHORITIES.filter((projection) => projection.qlId === input.qlId);
  if (projections.length === 0) throw new Error(`${input.qlId}: no CAE-001 projection authority is available.`);
  const selection = mix32((input.seed >>> 0) ^ hashText(input.qlId));
  const projection = projections[selection % projections.length]!;
  const world = worldFor(projection.worldId);
  const profile = input.questionProfile ?? "FOUR_WAY";
  const rendered = optionsForProjection(projection, world, input.locale, profile, selection ^ hashText(projection.id));
  const correctIndex = rendered.options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0 || rendered.options.filter((option) => option.isCorrect).length !== 1) {
    throw new Error(`${projection.id}: rendered options do not contain exactly one correct answer.`);
  }
  return {
    chapterId: "CAE-001",
    checkpointId: projection.checkpointId,
    qlId: projection.qlId,
    projectionId: projection.id,
    causalWorldId: world.id,
    locale: input.locale,
    seed: input.seed,
    difficulty: projection.difficulty,
    questionProfile: rendered.questionProfile,
    stem: stemFor(projection, world, input.locale),
    options: rendered.options.map((option) => option.text),
    correctIndex,
    answerId: rendered.answerId,
    explanation: rendered.explanation,
    causalTrace: rendered.trace,
    optionMetadata: rendered.options,
    metadata: {
      solver: "CAE_CAUSAL_WORLD_SOLVER_V2",
      sourceMode: "CURATED_ORIGINAL_SCENARIO",
      reviewOnly: true,
      questionBankWritable: false,
      testEligible: false,
      mockEligible: false,
      publicEligible: false,
    },
  };
}
