import { causalPath, solveCaeRelationship } from "./causal-solver.ts";
import { CAE_001_CAUSAL_WORLDS } from "./causal-world-authorities.ts";
import { generateCaeQuestion } from "./chapter-generator.ts";
import type {
  CaeDistractorRole,
  CaeLocale,
  CaeQlId,
  CaeQuestionProfile,
  CaeRelationship,
  CaeRenderedOption,
  GeneratedCaeQuestion,
} from "./types.ts";

export const CAE_SOURCE_PROFILE_IDS = [
  "CLASSIC_BANK_FIVE_RELATION",
  "PUNJAB_POLICE_SI_2016_FOUR_RELATION",
  "SSC_SELECTION_POST_DIRECT_RECOGNITION",
] as const;

export type CaeSourceProfileId = (typeof CAE_SOURCE_PROFILE_IDS)[number];

export type CaeSourceProfileAuthority = Readonly<{
  id: CaeSourceProfileId;
  sourceLabel: string;
  learnerOperation: "PAIRED_RELATIONSHIP" | "DIRECT_RECOGNITION";
  baseQuestionProfile: CaeQuestionProfile;
  allowedQlIds: readonly CaeQlId[];
  relationshipIds: readonly string[];
}>;

export const CAE_SOURCE_PROFILE_AUTHORITIES: Readonly<Record<CaeSourceProfileId, CaeSourceProfileAuthority>> = Object.freeze({
  CLASSIC_BANK_FIVE_RELATION: Object.freeze({
    id: "CLASSIC_BANK_FIVE_RELATION",
    sourceLabel: "Classic Bank PO five-relation Cause & Effect schema",
    learnerOperation: "PAIRED_RELATIONSHIP",
    baseQuestionProfile: "FIVE_WAY",
    allowedQlIds: ["CAE-QL-001", "CAE-QL-002"],
    relationshipIds: [
      "FIRST_DIRECT_CAUSES_SECOND",
      "SECOND_DIRECT_CAUSES_FIRST",
      "INDEPENDENT_CAUSES",
      "INDEPENDENT_EFFECTS",
      "COMMON_CAUSE",
    ],
  }),
  PUNJAB_POLICE_SI_2016_FOUR_RELATION: Object.freeze({
    id: "PUNJAB_POLICE_SI_2016_FOUR_RELATION",
    sourceLabel: "Punjab Police SI 2016 four-relation Cause & Effect schema",
    learnerOperation: "PAIRED_RELATIONSHIP",
    baseQuestionProfile: "FOUR_WAY",
    allowedQlIds: ["CAE-QL-001", "CAE-QL-002"],
    relationshipIds: [
      "FIRST_DIRECT_CAUSES_SECOND",
      "SECOND_DIRECT_CAUSES_FIRST",
      "INDEPENDENT_EFFECTS",
      "COMMON_CAUSE",
    ],
  }),
  SSC_SELECTION_POST_DIRECT_RECOGNITION: Object.freeze({
    id: "SSC_SELECTION_POST_DIRECT_RECOGNITION",
    sourceLabel: "SSC Selection Post direct cause-effect recognition MCQ",
    learnerOperation: "DIRECT_RECOGNITION",
    baseQuestionProfile: "FOUR_WAY",
    allowedQlIds: ["CAE-QL-001"],
    relationshipIds: [],
  }),
});

export type GeneratedCaeSourceProfileQuestion = GeneratedCaeQuestion & Readonly<{
  sourceProfileId: CaeSourceProfileId;
  sourceProfileLabel: string;
}>;

export class CaeSourceProfileIncompatibleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CaeSourceProfileIncompatibleError";
  }
}

const RELATION_TEXT: Record<CaeLocale, Readonly<Record<string, string>>> = {
  "en-IN": {
    FIRST_DIRECT_CAUSES_SECOND: "Statement I is the cause and Statement II is its effect.",
    SECOND_DIRECT_CAUSES_FIRST: "Statement II is the cause and Statement I is its effect.",
    INDEPENDENT_CAUSES: "Both statements are independent causes.",
    INDEPENDENT_EFFECTS: "Both statements are effects of independent causes.",
    COMMON_CAUSE: "Both statements are effects of a common cause.",
  },
  "hi-IN": {
    FIRST_DIRECT_CAUSES_SECOND: "कथन I कारण है और कथन II उसका प्रभाव है।",
    SECOND_DIRECT_CAUSES_FIRST: "कथन II कारण है और कथन I उसका प्रभाव है।",
    INDEPENDENT_CAUSES: "दोनों कथन स्वतंत्र कारण हैं।",
    INDEPENDENT_EFFECTS: "दोनों कथन स्वतंत्र कारणों के प्रभाव हैं।",
    COMMON_CAUSE: "दोनों कथन एक सामान्य कारण के प्रभाव हैं।",
  },
  "pa-IN": {
    FIRST_DIRECT_CAUSES_SECOND: "ਕਥਨ I ਕਾਰਨ ਹੈ ਅਤੇ ਕਥਨ II ਉਸ ਦਾ ਪ੍ਰਭਾਵ ਹੈ।",
    SECOND_DIRECT_CAUSES_FIRST: "ਕਥਨ II ਕਾਰਨ ਹੈ ਅਤੇ ਕਥਨ I ਉਸ ਦਾ ਪ੍ਰਭਾਵ ਹੈ।",
    INDEPENDENT_CAUSES: "ਦੋਵੇਂ ਕਥਨ ਸੁਤੰਤਰ ਕਾਰਨ ਹਨ।",
    INDEPENDENT_EFFECTS: "ਦੋਵੇਂ ਕਥਨ ਸੁਤੰਤਰ ਕਾਰਨਾਂ ਦੇ ਪ੍ਰਭਾਵ ਹਨ।",
    COMMON_CAUSE: "ਦੋਵੇਂ ਕਥਨ ਇੱਕ ਸਾਂਝੇ ਕਾਰਨ ਦੇ ਪ੍ਰਭਾਵ ਹਨ।",
  },
};

const DIRECT_RECOGNITION_COPY: Record<CaeLocale, Readonly<{ stem: string; explanation: string; causalJoin: string }>> = {
  "en-IN": {
    stem: "Which of the following shows a valid cause-and-effect relationship?",
    explanation: "The first event directly produces the second event in the causal sequence.",
    causalJoin: "As a result",
  },
  "hi-IN": {
    stem: "निम्नलिखित में से कौन-सा विकल्प सही कारण-प्रभाव संबंध दिखाता है?",
    explanation: "कारणात्मक क्रम में पहली घटना से दूसरी घटना सीधे उत्पन्न होती है।",
    causalJoin: "इसके परिणामस्वरूप",
  },
  "pa-IN": {
    stem: "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵਿਕਲਪ ਸਹੀ ਕਾਰਨ-ਪ੍ਰਭਾਵ ਸੰਬੰਧ ਦਿਖਾਉਂਦਾ ਹੈ?",
    explanation: "ਕਾਰਨਾਤਮਕ ਕ੍ਰਮ ਵਿੱਚ ਪਹਿਲੀ ਘਟਨਾ ਤੋਂ ਦੂਜੀ ਘਟਨਾ ਸਿੱਧੇ ਤੌਰ ਤੇ ਪੈਦਾ ਹੁੰਦੀ ਹੈ।",
    causalJoin: "ਇਸ ਦੇ ਨਤੀਜੇ ਵਜੋਂ",
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

function worldFor(question: GeneratedCaeQuestion) {
  const world = CAE_001_CAUSAL_WORLDS.find((entry) => entry.id === question.causalWorldId);
  if (!world) throw new Error(`${question.causalWorldId}: source-profile renderer cannot find causal world.`);
  return world;
}

function relationshipFor(question: GeneratedCaeQuestion): CaeRelationship {
  const world = worldFor(question);
  const [first, second] = question.visibleContext.visibleNodeIds;
  if (!first || !second) throw new Error(`${question.causalStateId}: paired source profile needs two visible statements.`);
  return solveCaeRelationship(world, first, second);
}

function optionRole(id: string, answerId: string): CaeDistractorRole | undefined {
  if (id === answerId) return undefined;
  if (id === "FIRST_DIRECT_CAUSES_SECOND" || id === "SECOND_DIRECT_CAUSES_FIRST") return "REVERSE_CAUSATION";
  if (id === "COMMON_CAUSE") return "COMMON_CAUSE_CONFUSION";
  return "UNRELATED_EVENT";
}

function sourceItemVariantId(question: GeneratedCaeQuestion, profile: CaeSourceProfileId, options: readonly CaeRenderedOption[]): string {
  const candidateSet = options.filter((option) => !option.isCorrect).map((option) => option.id).sort().join(",");
  const presentation = options.map((option) => option.id).join(">");
  return [
    question.causalStateId,
    `distractors:${candidateSet}`,
    `profile:${question.questionProfile ?? "NONE"}`,
    `sourceProfile:${profile}`,
    `presentation:${presentation}`,
  ].join("|");
}

function withSourceProfile(
  question: GeneratedCaeQuestion,
  profile: CaeSourceProfileAuthority,
  patch: Partial<GeneratedCaeQuestion>,
): GeneratedCaeSourceProfileQuestion {
  const merged = { ...question, ...patch } as GeneratedCaeQuestion;
  return Object.freeze({
    ...merged,
    sourceProfileId: profile.id,
    sourceProfileLabel: profile.sourceLabel,
  });
}

function renderRelationshipProfile(
  base: GeneratedCaeQuestion,
  profile: CaeSourceProfileAuthority,
  locale: CaeLocale,
  seed: number,
): GeneratedCaeSourceProfileQuestion {
  const relationship = relationshipFor(base);
  if (!profile.relationshipIds.includes(relationship)) {
    throw new CaeSourceProfileIncompatibleError(`${profile.id}/${base.causalStateId}: relationship '${relationship}' is not part of this source schema.`);
  }
  const options = shuffled(
    profile.relationshipIds.map((id) => ({
      id,
      text: RELATION_TEXT[locale][id]!,
      isCorrect: id === relationship,
      distractorRole: optionRole(id, relationship),
    })),
    seed ^ 0x53c3a1,
  );
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0 || options.filter((option) => option.isCorrect).length !== 1) {
    throw new Error(`${profile.id}/${base.causalStateId}: source profile must render exactly one answer.`);
  }
  const itemVariantId = sourceItemVariantId(base, profile.id, options);
  return withSourceProfile(base, profile, {
    options: options.map((option) => option.text),
    correctIndex,
    answerId: relationship,
    itemVariantId,
    semanticInstanceId: itemVariantId,
    optionMetadata: options,
    distractorMechanisms: options.flatMap((option) => option.distractorRole ? [option.distractorRole] : []),
  });
}

function stripTerminal(text: string): string {
  return text.trim().replace(/[.!?।]+$/u, "");
}

function causalClaim(locale: CaeLocale, first: string, second: string): string {
  const copy = DIRECT_RECOGNITION_COPY[locale];
  return `${stripTerminal(first)}. ${copy.causalJoin}, ${stripTerminal(second)}.`;
}

function commonCauseDistractor(locale: CaeLocale, seed: number): Readonly<{ id: string; text: string }> {
  const worlds = CAE_001_CAUSAL_WORLDS.filter((world) => world.nodes.some((node) => world.edges.filter((edge) => edge.from === node.id).length >= 2));
  const world = worlds[mix32(seed ^ 0x4319) % worlds.length]!;
  const parent = world.nodes.find((node) => world.edges.filter((edge) => edge.from === node.id).length >= 2)!;
  const children = world.edges.filter((edge) => edge.from === parent.id).map((edge) => world.nodes.find((node) => node.id === edge.to)!).filter(Boolean);
  const [first, second] = children;
  if (!first || !second) throw new Error(`${world.id}: common-cause recognition distractor requires sibling effects.`);
  return {
    id: `FALSE_COMMON_CAUSE:${first.id}>${second.id}`,
    text: causalClaim(locale, first.text[locale], second.text[locale]),
  };
}

function independentDistractor(locale: CaeLocale, seed: number): Readonly<{ id: string; text: string }> {
  const worlds = CAE_001_CAUSAL_WORLDS.filter((world) => /PARALLEL|COINCIDENT/u.test(world.scenarioFamilyId));
  const world = worlds[mix32(seed ^ 0x8a71) % worlds.length]!;
  const pair = world.nodes.flatMap((first, index, nodes) => nodes.slice(index + 1).flatMap((second) => {
    const forward = causalPath(world, first.id, second.id);
    const reverse = causalPath(world, second.id, first.id);
    return !forward && !reverse ? [[first, second] as const] : [];
  }))[0];
  if (!pair) throw new Error(`${world.id}: independent recognition distractor requires an unrelated pair.`);
  return {
    id: `FALSE_INDEPENDENT:${pair[0].id}>${pair[1].id}`,
    text: causalClaim(locale, pair[0].text[locale], pair[1].text[locale]),
  };
}

function renderDirectRecognition(
  base: GeneratedCaeQuestion,
  profile: CaeSourceProfileAuthority,
  locale: CaeLocale,
  seed: number,
): GeneratedCaeSourceProfileQuestion {
  const world = worldFor(base);
  const [causeId, effectId] = base.causalTrace;
  const cause = causeId ? world.nodes.find((node) => node.id === causeId) : undefined;
  const effect = effectId ? world.nodes.find((node) => node.id === effectId) : undefined;
  if (!cause || !effect || !world.edges.some((edge) => edge.from === cause.id && edge.to === effect.id)) {
    throw new Error(`${base.causalStateId}: SSC direct-recognition profile requires a direct canonical edge.`);
  }
  const common = commonCauseDistractor(locale, seed);
  const independent = independentDistractor(locale, seed);
  const options = shuffled<CaeRenderedOption>([
    {
      id: `VALID_DIRECT:${cause.id}>${effect.id}`,
      text: causalClaim(locale, cause.text[locale], effect.text[locale]),
      isCorrect: true,
    },
    {
      id: `FALSE_REVERSE:${effect.id}>${cause.id}`,
      text: causalClaim(locale, effect.text[locale], cause.text[locale]),
      isCorrect: false,
      distractorRole: "REVERSE_CAUSATION",
    },
    {
      id: common.id,
      text: common.text,
      isCorrect: false,
      distractorRole: "COMMON_CAUSE_CONFUSION",
    },
    {
      id: independent.id,
      text: independent.text,
      isCorrect: false,
      distractorRole: "UNRELATED_EVENT",
    },
  ], seed ^ 0xa91f);
  if (new Set(options.map((option) => option.text)).size !== options.length) {
    throw new Error(`${base.causalStateId}: SSC direct-recognition options must be textually unique.`);
  }
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const itemVariantId = sourceItemVariantId(base, profile.id, options);
  return withSourceProfile(base, profile, {
    stem: DIRECT_RECOGNITION_COPY[locale].stem,
    options: options.map((option) => option.text),
    correctIndex,
    answerId: options[correctIndex]!.id,
    explanation: `${stripTerminal(cause.text[locale])} → ${stripTerminal(effect.text[locale])}. ${DIRECT_RECOGNITION_COPY[locale].explanation}`,
    itemVariantId,
    semanticInstanceId: itemVariantId,
    optionMetadata: options,
    distractorMechanisms: options.flatMap((option) => option.distractorRole ? [option.distractorRole] : []),
  });
}

export function generateCaeSourceProfileQuestion(input: Readonly<{
  qlId: CaeQlId;
  locale: CaeLocale;
  seed: number;
  sourceProfileId: CaeSourceProfileId;
}>): GeneratedCaeSourceProfileQuestion {
  const profile = CAE_SOURCE_PROFILE_AUTHORITIES[input.sourceProfileId];
  if (!profile.allowedQlIds.includes(input.qlId)) {
    throw new CaeSourceProfileIncompatibleError(`${profile.id} does not support ${input.qlId}.`);
  }
  const base = generateCaeQuestion({
    qlId: input.qlId,
    locale: input.locale,
    seed: input.seed,
    questionProfile: profile.baseQuestionProfile,
  });
  return profile.learnerOperation === "DIRECT_RECOGNITION"
    ? renderDirectRecognition(base, profile, input.locale, input.seed)
    : renderRelationshipProfile(base, profile, input.locale, input.seed);
}
