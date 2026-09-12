import { causalPath, hasDirectEdge, nodeById, solveCaeRelationship } from "./causal-solver.ts";
import { CAE_001_PROJECTION_AUTHORITIES, familyForCae001, materializeCae001World } from "./causal-world-authorities.ts";
import type {
  CaeCandidateAuthority,
  CaeCausalWorld,
  CaeDifficulty,
  CaeDifficultyEvidence,
  CaeLocale,
  CaeProjectionAuthority,
  CaeQuestionProfile,
  CaeRelationship,
  CaeRenderedOption,
  CaeScenarioFamilyAuthority,
  CaeScenarioVariant,
  CaeVisibleContext,
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

function pick<T>(values: readonly T[], seed: number, label: string): T {
  if (values.length === 0) throw new Error(`CAE-001: no ${label} available.`);
  return values[mix32(seed ^ hashText(label)) % values.length]!;
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
    relationship: "Read the two statements and determine the relationship supported by the information shown.",
    statementOne: "Statement I", statementTwo: "Statement II", situation: "Setting",
    probableCause: "Which option is the most probable immediate cause of the observed event?",
    probableEffect: "Which option is the most probable immediate effect of the event?",
    competing: "Which proposed event best explains the observation, considering timing, scope, and magnitude?",
    indirect: "Which relationship between the two events is best supported?",
    correlation: "Which conclusion about these two observations is logically supported?",
    sequence: "Select the causally valid sequence.", missing: "Which event most logically completes the causal sequence?",
    observation: "Observation", because: "because", directStep: "This is one direct causal step.", matchedFactors: "The correct option matches the timing and scope; the other proposals do not.", competingMatch: "This chain matches the observation's timing, scope, and magnitude.", indirectChain: "The hidden event or events make the first statement an indirect cause of the second.", commonCause: "Both events follow from the same hidden cause", noCausalLink: "The two observations do not establish a causal link", noPathPair: "Neither displayed event lies on a causal path to the other.", separatePaths: "The displayed observations arise on separate causal paths.", missingBridge: "The missing event is the only direct bridge between the shown events.", sequenceSupported: "This order follows the causal chain shown by the events.",
  },
  "hi-IN": {
    relationship: "दोनों कथन पढ़िए और केवल दिखाई गई जानकारी से समर्थित संबंध तय कीजिए।",
    statementOne: "कथन I", statementTwo: "कथन II", situation: "परिवेश",
    probableCause: "देखी गई घटना का सबसे संभावित तात्कालिक कारण कौन-सा है?",
    probableEffect: "घटना का सबसे संभावित तात्कालिक प्रभाव कौन-सा है?",
    competing: "समय, दायरे और परिमाण को देखते हुए कौन-सी प्रस्तावित घटना अवलोकन को सबसे अच्छी तरह समझाती है?",
    indirect: "दो घटनाओं के बीच कौन-सा संबंध सबसे अच्छी तरह समर्थित है?",
    correlation: "इन दोनों अवलोकनों के बारे में कौन-सा निष्कर्ष तार्किक रूप से समर्थित है?",
    sequence: "कारणात्मक रूप से सही क्रम चुनिए।", missing: "कौन-सी घटना कारणात्मक क्रम को सबसे तार्किक रूप से पूरा करती है?",
    observation: "अवलोकन", because: "क्योंकि", directStep: "यह एक प्रत्यक्ष कारणात्मक चरण है।", matchedFactors: "सही विकल्प समय और दायरे से मेल खाता है; अन्य प्रस्ताव नहीं।", competingMatch: "यह क्रम अवलोकन के समय, दायरे और परिमाण से मेल खाता है।", indirectChain: "छिपी हुई घटना या घटनाएँ पहले कथन को दूसरे का अप्रत्यक्ष कारण बनाती हैं।", commonCause: "दोनों घटनाएँ एक ही छिपे हुए कारण से उत्पन्न हुई हैं", noCausalLink: "दोनों अवलोकन कारणात्मक संबंध स्थापित नहीं करते", noPathPair: "दिखाई गई कोई भी घटना दूसरी तक जाने वाले कारणात्मक पथ पर नहीं है।", separatePaths: "दिखाई गए अवलोकन अलग कारणात्मक पथों से उत्पन्न होते हैं।", missingBridge: "लुप्त घटना दिखाई गई घटनाओं के बीच एकमात्र प्रत्यक्ष सेतु है।", sequenceSupported: "यह क्रम घटनाओं से बने कारणात्मक क्रम का अनुसरण करता है।",
  },
  "pa-IN": {
    relationship: "ਦੋਵੇਂ ਕਥਨ ਪੜ੍ਹੋ ਅਤੇ ਕੇਵਲ ਦਿਖਾਈ ਗਈ ਜਾਣਕਾਰੀ ਤੋਂ ਸਮਰਥਿਤ ਸੰਬੰਧ ਨਿਰਧਾਰਤ ਕਰੋ।",
    statementOne: "ਕਥਨ I", statementTwo: "ਕਥਨ II", situation: "ਪ੍ਰਸੰਗ",
    probableCause: "ਦੇਖੀ ਗਈ ਘਟਨਾ ਦਾ ਸਭ ਤੋਂ ਸੰਭਾਵੀ ਤੁਰੰਤ ਕਾਰਨ ਕਿਹੜਾ ਹੈ?",
    probableEffect: "ਘਟਨਾ ਦਾ ਸਭ ਤੋਂ ਸੰਭਾਵੀ ਤੁਰੰਤ ਪ੍ਰਭਾਵ ਕਿਹੜਾ ਹੈ?",
    competing: "ਸਮੇਂ, ਦਾਇਰੇ ਅਤੇ ਪੈਮਾਨੇ ਨੂੰ ਦੇਖਦਿਆਂ ਕਿਹੜੀ ਪ੍ਰਸਤਾਵਿਤ ਘਟਨਾ ਨਿਰੀਖਣ ਨੂੰ ਸਭ ਤੋਂ ਚੰਗੀ ਤਰ੍ਹਾਂ ਸਮਝਾਉਂਦੀ ਹੈ?",
    indirect: "ਦੋ ਘਟਨਾਵਾਂ ਵਿਚਕਾਰ ਕਿਹੜਾ ਸੰਬੰਧ ਸਭ ਤੋਂ ਵਧੀਆ ਸਮਰਥਿਤ ਹੈ?",
    correlation: "ਇਨ੍ਹਾਂ ਦੋਵਾਂ ਨਿਰੀਖਣਾਂ ਬਾਰੇ ਕਿਹੜਾ ਨਤੀਜਾ ਤਰਕਸੰਗਤ ਤੌਰ ਤੇ ਸਮਰਥਿਤ ਹੈ?",
    sequence: "ਕਾਰਨਾਤਮਕ ਤੌਰ ਤੇ ਸਹੀ ਕ੍ਰਮ ਚੁਣੋ।", missing: "ਕਿਹੜੀ ਘਟਨਾ ਕਾਰਨਾਤਮਕ ਕ੍ਰਮ ਨੂੰ ਸਭ ਤੋਂ ਤਰਕਸੰਗਤ ਢੰਗ ਨਾਲ ਪੂਰਾ ਕਰਦੀ ਹੈ?",
    observation: "ਨਿਰੀਖਣ", because: "ਕਿਉਂਕਿ", directStep: "ਇਹ ਇੱਕ ਸਿੱਧਾ ਕਾਰਨਾਤਮਕ ਪੜਾਅ ਹੈ।", matchedFactors: "ਸਹੀ ਵਿਕਲਪ ਸਮੇਂ ਅਤੇ ਦਾਇਰੇ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ; ਹੋਰ ਪ੍ਰਸਤਾਵ ਨਹੀਂ।", competingMatch: "ਇਹ ਕੜੀ ਨਿਰੀਖਣ ਦੇ ਸਮੇਂ, ਦਾਇਰੇ ਅਤੇ ਪੈਮਾਨੇ ਨਾਲ ਮੇਲ ਖਾਂਦੀ ਹੈ।", indirectChain: "ਲੁਕੀ ਹੋਈ ਘਟਨਾ ਜਾਂ ਘਟਨਾਵਾਂ ਪਹਿਲੇ ਕਥਨ ਨੂੰ ਦੂਜੇ ਦਾ ਅਪ੍ਰਤੱਖ ਕਾਰਨ ਬਣਾਉਂਦੀਆਂ ਹਨ।", commonCause: "ਦੋਵੇਂ ਘਟਨਾਵਾਂ ਇੱਕੋ ਲੁਕੇ ਹੋਏ ਕਾਰਨ ਤੋਂ ਪੈਦਾ ਹੁੰਦੀਆਂ ਹਨ", noCausalLink: "ਦੋਵੇਂ ਨਿਰੀਖਣ ਕਾਰਨਾਤਮਕ ਸੰਬੰਧ ਸਥਾਪਤ ਨਹੀਂ ਕਰਦੇ", noPathPair: "ਦਿਖਾਈ ਗਈ ਕੋਈ ਵੀ ਘਟਨਾ ਦੂਜੀ ਤੱਕ ਜਾਂਦੇ ਕਾਰਨਾਤਮਕ ਰਸਤੇ ਉੱਤੇ ਨਹੀਂ ਹੈ।", separatePaths: "ਦਿਖਾਏ ਗਏ ਨਿਰੀਖਣ ਵੱਖਰੇ ਕਾਰਨਾਤਮਕ ਰਸਤਿਆਂ ਤੋਂ ਪੈਦਾ ਹੁੰਦੇ ਹਨ।", missingBridge: "ਲਾਪਤਾ ਘਟਨਾ ਦਿਖਾਈਆਂ ਘਟਨਾਵਾਂ ਦਰਮਿਆਨ ਇਕੋ ਸਿੱਧਾ ਪੁਲ ਹੈ।", sequenceSupported: "ਇਹ ਕ੍ਰਮ ਘਟਨਾਵਾਂ ਨਾਲ ਬਣੇ ਕਾਰਨਾਤਮਕ ਕ੍ਰਮ ਦੀ ਪਾਲਣਾ ਕਰਦਾ ਹੈ।",
  },
};

const RELATION_OPTION_TEXT: Record<CaeLocale, Readonly<Record<string, string>>> = {
  "en-IN": {
    FIRST_DIRECT_CAUSES_SECOND: "Statement I is the direct cause and Statement II is its effect.",
    SECOND_DIRECT_CAUSES_FIRST: "Statement II is the direct cause and Statement I is its effect.",
    INDEPENDENT_CAUSES: "Statements I and II are independent causes.",
    INDEPENDENT_EFFECTS: "Statements I and II are effects of independent causes.",
    COMMON_CAUSE: "Statements I and II are effects of a common cause.",
    INDEPENDENT: "The statements are independent; neither causes the other.",
    INDIRECT_FIRST_CAUSES_SECOND: "Statement I is an indirect cause of Statement II.",
    INDIRECT_SECOND_CAUSES_FIRST: "Statement II is an indirect cause of Statement I.",
    NO_CAUSAL_LINK: "No causal relationship is established between the statements.",
    CORRELATION_ONLY: "Their co-occurrence does not establish causation.",
  },
  "hi-IN": {
    FIRST_DIRECT_CAUSES_SECOND: "कथन I प्रत्यक्ष कारण है और कथन II उसका प्रभाव है।",
    SECOND_DIRECT_CAUSES_FIRST: "कथन II प्रत्यक्ष कारण है और कथन I उसका प्रभाव है।",
    INDEPENDENT_CAUSES: "कथन I और II स्वतंत्र कारण हैं।",
    INDEPENDENT_EFFECTS: "कथन I और II स्वतंत्र कारणों के प्रभाव हैं।",
    COMMON_CAUSE: "कथन I और II एक सामान्य कारण के प्रभाव हैं।",
    INDEPENDENT: "कथन स्वतंत्र हैं; कोई भी दूसरे का कारण नहीं है।",
    INDIRECT_FIRST_CAUSES_SECOND: "कथन I, कथन II का अप्रत्यक्ष कारण है।",
    INDIRECT_SECOND_CAUSES_FIRST: "कथन II, कथन I का अप्रत्यक्ष कारण है।",
    NO_CAUSAL_LINK: "कथनों के बीच कारणात्मक संबंध स्थापित नहीं है।",
    CORRELATION_ONLY: "एक साथ होना कारण स्थापित नहीं करता।",
  },
  "pa-IN": {
    FIRST_DIRECT_CAUSES_SECOND: "ਕਥਨ I ਸਿੱਧਾ ਕਾਰਨ ਹੈ ਅਤੇ ਕਥਨ II ਉਸ ਦਾ ਪ੍ਰਭਾਵ ਹੈ।",
    SECOND_DIRECT_CAUSES_FIRST: "ਕਥਨ II ਸਿੱਧਾ ਕਾਰਨ ਹੈ ਅਤੇ ਕਥਨ I ਉਸ ਦਾ ਪ੍ਰਭਾਵ ਹੈ।",
    INDEPENDENT_CAUSES: "ਕਥਨ I ਅਤੇ II ਸੁਤੰਤਰ ਕਾਰਨ ਹਨ।",
    INDEPENDENT_EFFECTS: "ਕਥਨ I ਅਤੇ II ਸੁਤੰਤਰ ਕਾਰਨਾਂ ਦੇ ਪ੍ਰਭਾਵ ਹਨ।",
    COMMON_CAUSE: "ਕਥਨ I ਅਤੇ II ਇੱਕ ਸਾਂਝੇ ਕਾਰਨ ਦੇ ਪ੍ਰਭਾਵ ਹਨ।",
    INDEPENDENT: "ਕਥਨ ਸੁਤੰਤਰ ਹਨ; ਕੋਈ ਵੀ ਦੂਜੇ ਦਾ ਕਾਰਨ ਨਹੀਂ ਹੈ।",
    INDIRECT_FIRST_CAUSES_SECOND: "ਕਥਨ I, ਕਥਨ II ਦਾ ਅਪ੍ਰਤੱਖ ਕਾਰਨ ਹੈ।",
    INDIRECT_SECOND_CAUSES_FIRST: "ਕਥਨ II, ਕਥਨ I ਦਾ ਅਪ੍ਰਤੱਖ ਕਾਰਨ ਹੈ।",
    NO_CAUSAL_LINK: "ਕਥਨਾਂ ਵਿਚਕਾਰ ਕਾਰਨਾਤਮਕ ਸੰਬੰਧ ਸਥਾਪਤ ਨਹੀਂ ਹੈ।",
    CORRELATION_ONLY: "ਇੱਕੋ ਵੇਲੇ ਹੋਣਾ ਕਾਰਨ ਸਥਾਪਤ ਨਹੀਂ ਕਰਦਾ।",
  },
};

type SelectedState = Readonly<{
  plan: CaeProjectionAuthority;
  family: CaeScenarioFamilyAuthority;
  variant: CaeScenarioVariant;
  world: CaeCausalWorld;
  selectionSeed: number;
}>;

function selectState(qlId: CaeProjectionAuthority["qlId"], seed: number): SelectedState {
  const plan = CAE_001_PROJECTION_AUTHORITIES.find((entry) => entry.qlId === qlId);
  if (!plan) throw new Error(`${qlId}: no provisional CAE-001 plan is available.`);
  const selectionSeed = mix32((seed >>> 0) ^ hashText(plan.id));
  const family = familyForCae001(pick(plan.compatibleFamilyIds, selectionSeed, "compatible family"));
  if (!family.allowedProjectionKinds.includes(plan.kind)) throw new Error(`${plan.id}: selected incompatible scenario family '${family.id}'.`);
  const variant = pick(family.variants, selectionSeed ^ hashText(family.id), "scenario variant");
  return { plan, family, variant, world: materializeCae001World(family, variant), selectionSeed };
}

function directPairs(world: CaeCausalWorld): readonly (readonly [string, string])[] {
  return world.edges.map((edge) => [edge.from, edge.to] as const);
}

function rootToLeafPaths(world: CaeCausalWorld): readonly (readonly string[])[] {
  const roots = world.nodes.filter((node) => !world.edges.some((edge) => edge.to === node.id));
  const leaves = world.nodes.filter((node) => !world.edges.some((edge) => edge.from === node.id));
  return roots.flatMap((root) => leaves.map((leaf) => causalPath(world, root.id, leaf.id)).filter((path): path is string[] => Boolean(path && path.length >= 3)));
}

function contextFor(family: CaeScenarioFamilyAuthority, variant: CaeScenarioVariant, world: CaeCausalWorld, locale: CaeLocale, visibleNodeIds: readonly string[]): CaeVisibleContext {
  const hiddenNodeIds = world.nodes.filter((node) => !visibleNodeIds.includes(node.id)).map((node) => node.id);
  if (family.renderingConstraints.contextMustBeNeutral && visibleNodeIds.some((id) => variant.backdrop[locale].includes(nodeById(world, id).text[locale]))) {
    throw new Error(`${world.id}: backdrop leaks a visible event instead of providing a neutral setting.`);
  }
  return { backdrop: variant.backdrop[locale], visibleNodeIds, hiddenNodeIds };
}

function renderTrace(world: CaeCausalWorld, locale: CaeLocale, nodeIds: readonly string[]): string {
  return nodeIds.map((nodeId) => nodeById(world, nodeId).text[locale].replace(/[.।]+$/u, "")).join(" → ");
}

function relationshipOptions(locale: CaeLocale, profile: CaeQuestionProfile, relationship: CaeRelationship, seed: number): readonly CaeRenderedOption[] {
  const ids = profile === "FIVE_WAY"
    ? ["FIRST_DIRECT_CAUSES_SECOND", "SECOND_DIRECT_CAUSES_FIRST", "INDEPENDENT_CAUSES", "INDEPENDENT_EFFECTS", "COMMON_CAUSE"]
    : ["FIRST_DIRECT_CAUSES_SECOND", "SECOND_DIRECT_CAUSES_FIRST", "INDEPENDENT", "COMMON_CAUSE"];
  const answerId = profile === "FOUR_WAY" && (relationship === "INDEPENDENT_CAUSES" || relationship === "INDEPENDENT_EFFECTS") ? "INDEPENDENT" : relationship;
  const roleFor = (id: string) => id === answerId ? undefined : id.includes("SECOND_DIRECT") ? "REVERSE_CAUSATION" as const : id === "COMMON_CAUSE" ? "COMMON_CAUSE_CONFUSION" as const : "UNRELATED_EVENT" as const;
  return shuffled(ids.map((id) => ({ id, text: RELATION_OPTION_TEXT[locale][id]!, isCorrect: id === answerId, distractorRole: roleFor(id) })), seed);
}

function candidateOptions(correctId: string, correctText: string, candidates: readonly CaeCandidateAuthority[], locale: CaeLocale, seed: number): readonly CaeRenderedOption[] {
  const distinct = candidates.filter((entry, index, list) => list.findIndex((other) => other.text[locale] === entry.text[locale]) === index).slice(0, 3);
  if (distinct.length !== 3) throw new Error("CAE-001: a generated candidate set needs three distinct, scenario-local distractors.");
  return shuffled([
    { id: correctId, text: correctText, isCorrect: true },
    ...distinct.map((entry) => ({ id: entry.id, text: entry.text[locale], isCorrect: false, distractorRole: entry.mechanism })),
  ], seed);
}

function deriveDifficulty(input: {
  path: readonly string[];
  visibleNodeIds: readonly string[];
  topology: CaeScenarioFamilyAuthority["topology"];
  plausibleDistractors: number;
  inferenceBurden: number;
}): { difficulty: CaeDifficulty; evidence: CaeDifficultyEvidence } {
  const causalDistance = Math.max(0, input.path.length - 1);
  const hiddenLinks = Math.max(0, input.path.filter((nodeId) => !input.visibleNodeIds.includes(nodeId)).length);
  const topologyComplexity = input.topology === "DIRECT_CHAIN" ? 1 : input.topology === "PARALLEL_CHAINS" ? 2 : input.topology === "BRANCHING_COMMON_CAUSE" ? 2 : 3;
  const score = causalDistance + hiddenLinks * 2 + topologyComplexity + input.plausibleDistractors + input.visibleNodeIds.length + input.inferenceBurden;
  const difficulty: CaeDifficulty = score >= 13 ? "HARD" : score >= 8 ? "MEDIUM" : "EASY";
  return { difficulty, evidence: { causalDistance, hiddenLinks, topologyComplexity, plausibleDistractors: input.plausibleDistractors, visibleEventCount: input.visibleNodeIds.length, inferenceBurden: input.inferenceBurden, score } };
}

function answerDetails(options: readonly CaeRenderedOption[]) {
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0 || options.filter((option) => option.isCorrect).length !== 1) throw new Error("CAE-001: rendered options must contain exactly one correct answer.");
  return { correctIndex, answerId: options[correctIndex]!.id };
}

function relationshipStem(kind: "DIRECT_RELATIONSHIP" | "COMMON_OR_INDEPENDENT" | "INDIRECT_CAUSAL_CHAIN" | "CORRELATION_CHECK", context: CaeVisibleContext, world: CaeCausalWorld, locale: CaeLocale): string {
  const copy = COPY[locale];
  const prompt = kind === "INDIRECT_CAUSAL_CHAIN" ? copy.indirect : kind === "CORRELATION_CHECK" ? copy.correlation : copy.relationship;
  const [first, second] = context.visibleNodeIds;
  return `${prompt}\n\n${copy.situation}: ${context.backdrop}\n\n${copy.statementOne}: ${nodeById(world, first!).text[locale]}\n\n${copy.statementTwo}: ${nodeById(world, second!).text[locale]}`;
}

function semanticId(plan: CaeProjectionAuthority, state: SelectedState, visibleNodeIds: readonly string[], answerId: string): string {
  return [plan.id, state.family.id, state.variant.id, ...visibleNodeIds.map((id) => nodeById(state.world, id).semanticSlot), answerId].join("|");
}

export function generateCaeQuestion(input: {
  readonly qlId: CaeProjectionAuthority["qlId"];
  readonly locale: CaeLocale;
  readonly seed: number;
  readonly questionProfile?: CaeQuestionProfile;
}): GeneratedCaeQuestion {
  const state = selectState(input.qlId, input.seed);
  const { plan, family, variant, world, selectionSeed } = state;
  const profile = input.questionProfile ?? plan.examProfiles[0]!;
  if (!plan.examProfiles.includes(profile) || !family.allowedQuestionProfiles.includes(profile)) throw new Error(`${plan.id}: question profile '${profile}' is not allowed.`);
  const optionSeed = mix32(selectionSeed ^ hashText(`${variant.id}:${plan.kind}`));
  const locale = input.locale;
  const copy = COPY[locale];
  let visibleNodeIds: readonly string[] = [];
  let options: readonly CaeRenderedOption[] = [];
  let answerId = "";
  let stem = "";
  let explanation = "";
  let trace: readonly string[] = [];
  let questionProfile: CaeQuestionProfile | null = null;
  let inferenceBurden = 0;

  if (plan.kind === "DIRECT_RELATIONSHIP") {
    const pair = pick(directPairs(world), selectionSeed, "direct pair");
    const reverse = mix32(selectionSeed ^ 0x11) % 2 === 1;
    visibleNodeIds = reverse ? [pair[1], pair[0]] : pair;
    const relationship = solveCaeRelationship(world, visibleNodeIds[0]!, visibleNodeIds[1]!);
    options = relationshipOptions(locale, profile, relationship, optionSeed);
    answerId = answerDetails(options).answerId;
    trace = relationship === "FIRST_DIRECT_CAUSES_SECOND" ? [visibleNodeIds[0]!, visibleNodeIds[1]!] : [visibleNodeIds[1]!, visibleNodeIds[0]!];
    const context = contextFor(family, variant, world, locale, visibleNodeIds);
    stem = relationshipStem("DIRECT_RELATIONSHIP", context, world, locale);
    explanation = `${renderTrace(world, locale, trace)} ${copy.because} ${copy.directStep}`;
    questionProfile = profile;
  } else if (plan.kind === "COMMON_OR_INDEPENDENT") {
    const effects = world.nodes.filter((node) => node.role === "EFFECT");
    const commonPairs = effects.flatMap((first, index) => effects.slice(index + 1).filter((second) => solveCaeRelationship(world, first.id, second.id) === "COMMON_CAUSE").map((second) => [first.id, second.id] as const));
    const independentCausePairs = world.nodes.filter((node) => node.role === "CAUSE").flatMap((first, index, roots) => roots.slice(index + 1).filter((second) => solveCaeRelationship(world, first.id, second.id) === "INDEPENDENT_CAUSES").map((second) => [first.id, second.id] as const));
    const independentEffectPairs = effects.flatMap((first, index) => effects.slice(index + 1).filter((second) => solveCaeRelationship(world, first.id, second.id) === "INDEPENDENT_EFFECTS").map((second) => [first.id, second.id] as const));
    visibleNodeIds = pick([...commonPairs, ...independentCausePairs, ...independentEffectPairs], selectionSeed, "common or independent pair");
    const relationship = solveCaeRelationship(world, visibleNodeIds[0]!, visibleNodeIds[1]!);
    options = relationshipOptions(locale, profile, relationship, optionSeed);
    answerId = answerDetails(options).answerId;
    const context = contextFor(family, variant, world, locale, visibleNodeIds);
    stem = relationshipStem("COMMON_OR_INDEPENDENT", context, world, locale);
    trace = relationship === "COMMON_CAUSE"
      ? world.nodes.filter((node) => causalPath(world, node.id, visibleNodeIds[0]!) && causalPath(world, node.id, visibleNodeIds[1]!)).slice(0, 1).map((node) => node.id)
      : visibleNodeIds;
    explanation = relationship === "COMMON_CAUSE"
      ? `${renderTrace(world, locale, trace)} → ${nodeById(world, visibleNodeIds[0]!).text[locale]} / ${nodeById(world, visibleNodeIds[1]!).text[locale]}. ${copy.commonCause}.`
      : `${copy.noCausalLink}. ${copy.noPathPair}`;
    questionProfile = profile;
    inferenceBurden = relationship === "COMMON_CAUSE" ? 2 : 1;
  } else if (plan.kind === "PROBABLE_CAUSE" || plan.kind === "PROBABLE_EFFECT") {
    const pairs = directPairs(world);
    const pair = pick(pairs, selectionSeed, plan.kind === "PROBABLE_CAUSE" ? "cause target" : "effect target");
    const correctNodeId = plan.kind === "PROBABLE_CAUSE" ? pair[0] : pair[1];
    const targetNodeId = plan.kind === "PROBABLE_CAUSE" ? pair[1] : pair[0];
    visibleNodeIds = [targetNodeId];
    options = candidateOptions(correctNodeId, nodeById(world, correctNodeId).text[locale], variant.competingCandidates, locale, optionSeed);
    answerId = answerDetails(options).answerId;
    trace = plan.kind === "PROBABLE_CAUSE" ? [correctNodeId, targetNodeId] : [targetNodeId, correctNodeId];
    const context = contextFor(family, variant, world, locale, visibleNodeIds);
    stem = `${copy.situation}: ${context.backdrop}\n\n${copy.observation}: ${nodeById(world, targetNodeId).text[locale]}\n\n${plan.kind === "PROBABLE_CAUSE" ? copy.probableCause : copy.probableEffect}`;
    explanation = `${renderTrace(world, locale, trace)}. ${copy.matchedFactors}`;
    inferenceBurden = 2;
  } else if (plan.kind === "COMPETING_EXPLANATION") {
    const paths = rootToLeafPaths(world);
    const path = pick(paths, selectionSeed, "competing explanation path");
    const correctNodeId = path[0]!;
    const targetNodeId = path[path.length - 1]!;
    visibleNodeIds = [targetNodeId];
    options = candidateOptions(correctNodeId, nodeById(world, correctNodeId).text[locale], variant.competingCandidates, locale, optionSeed);
    answerId = answerDetails(options).answerId;
    trace = path;
    const context = contextFor(family, variant, world, locale, visibleNodeIds);
    stem = `${copy.situation}: ${context.backdrop}\n\n${copy.observation}: ${nodeById(world, targetNodeId).text[locale]}\n\n${copy.competing}`;
    explanation = `${renderTrace(world, locale, trace)}. ${copy.competingMatch}`;
    inferenceBurden = 4;
  } else if (plan.kind === "INDIRECT_CAUSAL_CHAIN") {
    const path = pick(rootToLeafPaths(world), selectionSeed, "indirect path");
    visibleNodeIds = [path[0]!, path[path.length - 1]!];
    const relationship = solveCaeRelationship(world, visibleNodeIds[0]!, visibleNodeIds[1]!);
    const ids = ["INDIRECT_FIRST_CAUSES_SECOND", "INDIRECT_SECOND_CAUSES_FIRST", "COMMON_CAUSE", "NO_CAUSAL_LINK"];
    options = shuffled(ids.map((id) => ({ id, text: RELATION_OPTION_TEXT[locale][id]!, isCorrect: id === relationship, distractorRole: id === relationship ? undefined : id === "INDIRECT_SECOND_CAUSES_FIRST" ? "REVERSE_CAUSATION" as const : id === "COMMON_CAUSE" ? "COMMON_CAUSE_CONFUSION" as const : "INDIRECTNESS_CONFUSION" as const })), optionSeed);
    answerId = answerDetails(options).answerId;
    trace = path;
    const context = contextFor(family, variant, world, locale, visibleNodeIds);
    stem = relationshipStem("INDIRECT_CAUSAL_CHAIN", context, world, locale);
    explanation = `${renderTrace(world, locale, trace)}. ${copy.indirectChain}`;
    inferenceBurden = 3;
  } else if (plan.kind === "CORRELATION_CHECK") {
    const pairs = world.nodes.flatMap((first, index, nodes) => nodes.slice(index + 1).filter((second) => !causalPath(world, first.id, second.id) && !causalPath(world, second.id, first.id)).map((second) => [first.id, second.id] as const));
    visibleNodeIds = pick(pairs, selectionSeed, "correlation pair");
    const ids = ["FIRST_DIRECT_CAUSES_SECOND", "SECOND_DIRECT_CAUSES_FIRST", "COMMON_CAUSE", "CORRELATION_ONLY"];
    options = shuffled(ids.map((id) => ({ id, text: RELATION_OPTION_TEXT[locale][id]!, isCorrect: id === "CORRELATION_ONLY", distractorRole: id === "CORRELATION_ONLY" ? undefined : id === "COMMON_CAUSE" ? "COMMON_CAUSE_CONFUSION" as const : id === "SECOND_DIRECT_CAUSES_FIRST" ? "REVERSE_CAUSATION" as const : "CORRELATION" as const })), optionSeed);
    answerId = "CORRELATION_ONLY";
    trace = visibleNodeIds;
    const context = contextFor(family, variant, world, locale, visibleNodeIds);
    stem = relationshipStem("CORRELATION_CHECK", context, world, locale);
    explanation = `${copy.noCausalLink}. ${copy.separatePaths}`;
    inferenceBurden = 2;
  } else if (plan.kind === "MULTI_EVENT_SEQUENCE") {
    const sequence = pick(rootToLeafPaths(world), selectionSeed, "sequence path");
    visibleNodeIds = sequence;
    const answer = sequence.join("|");
    const alternatives = [sequence, [sequence[0]!, sequence[2]!, sequence[1]!, ...sequence.slice(3)], [sequence[1]!, sequence[0]!, ...sequence.slice(2)], [...sequence.slice(0, -2), sequence[sequence.length - 1]!, sequence[sequence.length - 2]!]];
    options = shuffled(alternatives.map((candidate, index) => ({ id: candidate.join("|"), text: renderTrace(world, locale, candidate), isCorrect: candidate.join("|") === answer, distractorRole: candidate.join("|") === answer ? undefined : index === 1 ? "TEMPORAL_VIOLATION" as const : index === 2 ? "REVERSE_CAUSATION" as const : "INDIRECTNESS_CONFUSION" as const })), optionSeed);
    answerId = answer;
    trace = sequence;
    const context = contextFor(family, variant, world, locale, visibleNodeIds);
    stem = `${copy.sequence}\n\n${copy.situation}: ${context.backdrop}\n\n${sequence.map((nodeId, index) => `${String.fromCharCode(80 + index)}. ${nodeById(world, nodeId).text[locale]}`).join("\n")}`;
    explanation = `${renderTrace(world, locale, sequence)}. ${copy.sequenceSupported}`;
    inferenceBurden = 3;
  } else if (plan.kind === "MISSING_CAUSAL_LINK") {
    const path = pick(rootToLeafPaths(world), selectionSeed, "missing-link path");
    const start = mix32(selectionSeed ^ 0x77) % (path.length - 2);
    const source = path[start]!;
    const middle = path[start + 1]!;
    const target = path[start + 2]!;
    visibleNodeIds = [source, target];
    options = candidateOptions(middle, nodeById(world, middle).text[locale], variant.competingCandidates, locale, optionSeed);
    answerId = answerDetails(options).answerId;
    trace = [source, middle, target];
    const context = contextFor(family, variant, world, locale, visibleNodeIds);
    stem = `${copy.missing}\n\n${copy.situation}: ${context.backdrop}\n\n${nodeById(world, source).text[locale]} → ? → ${nodeById(world, target).text[locale]}`;
    explanation = `${renderTrace(world, locale, trace)}. ${copy.missingBridge}`;
    inferenceBurden = 3;
  } else {
    const unreachable: never = plan.kind;
    throw new Error(`Unsupported CAE-001 projection '${unreachable}'.`);
  }

  const visibleContext = contextFor(family, variant, world, locale, visibleNodeIds);
  if (family.renderingConstraints.prohibitAnswerInStem && plan.kind !== "DIRECT_RELATIONSHIP" && plan.kind !== "COMMON_OR_INDEPENDENT" && plan.kind !== "INDIRECT_CAUSAL_CHAIN" && plan.kind !== "CORRELATION_CHECK" && stem.includes(options.find((option) => option.isCorrect)!.text)) {
    throw new Error(`${world.id}: answer text leaked into the learner-visible stem.`);
  }
  if (family.renderingConstraints.prohibitIndependenceCue && (plan.kind === "COMMON_OR_INDEPENDENT" || plan.kind === "CORRELATION_CHECK") && /separate|independent|अलग-अलग|स्वतंत्र|ਵੱਖਰੇ|ਸੁਤੰਤਰ/i.test(visibleContext.backdrop)) {
    throw new Error(`${world.id}: backdrop leaks the relationship answer.`);
  }
  const derived = deriveDifficulty({ path: trace, visibleNodeIds, topology: family.topology, plausibleDistractors: options.filter((option) => !option.isCorrect && option.distractorRole && option.distractorRole !== "UNRELATED_EVENT").length, inferenceBurden });
  const details = answerDetails(options);
  return {
    chapterId: "CAE-001",
    checkpointId: plan.checkpointId,
    qlId: plan.qlId,
    projectionId: plan.id,
    scenarioFamilyId: family.id,
    scenarioVariantId: variant.id,
    semanticInstanceId: semanticId(plan, state, visibleNodeIds, answerId),
    causalWorldId: world.id,
    causalStructure: `${family.topology}:${trace.map((nodeId) => nodeById(world, nodeId).semanticSlot).join(">")}`,
    locale,
    seed: input.seed,
    difficulty: derived.difficulty,
    difficultyEvidence: derived.evidence,
    questionProfile,
    visibleContext,
    stem,
    options: options.map((option) => option.text),
    correctIndex: details.correctIndex,
    answerId,
    explanation,
    causalTrace: trace,
    distractorMechanisms: options.flatMap((option) => option.distractorRole ? [option.distractorRole] : []),
    optionMetadata: options,
    metadata: { solver: "CAE_CAUSAL_WORLD_SOLVER_V3", sourceMode: "CURATED_COMPOSABLE_SCENARIO", qlAllocation: "PROVISIONAL_PENDING_SOURCE_SATURATION", reviewOnly: true, questionBankWritable: false, testEligible: false, mockEligible: false, publicEligible: false },
  };
}
