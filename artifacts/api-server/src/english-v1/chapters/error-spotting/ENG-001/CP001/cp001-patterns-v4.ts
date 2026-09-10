import { deterministicPick } from "../../../../core/deterministic";
import { classifyEnglishDifficulty } from "../../../../core/difficulty";
import type { DifficultyDimensions, Eng001SentenceCandidate, EnglishDifficulty, GrammarRuleId } from "../../../../core/types";
import { SUBJECT_VERB_AGREEMENT_RULE_BY_ID } from "../../../../grammar/subject-verb-agreement";
import { BASE_SCENES_V4, CP001_V4_BASE_SCENE_COUNT, SEMANTIC_DOMAINS_V4, type SemanticDomainV4, type SemanticSceneV4 } from "./cp001-semantic-catalog-v4";
import { COLLECTIVE_MEMBER_V4, COLLECTIVE_UNIT_V4, COUNT_TAILS_BY_DOMAIN_V4, INTERVENING_SCENES_V4, PAIR_SCENES_V4 } from "./cp001-structural-catalog-v4";

function dims(
  ruleComplexity: DifficultyDimensions["ruleComplexity"],
  dependencyDistance: DifficultyDimensions["dependencyDistance"],
  distractorSimilarity: DifficultyDimensions["distractorSimilarity"],
  sentenceLength: DifficultyDimensions["sentenceLength"],
  ruleInteraction: DifficultyDimensions["ruleInteraction"],
  lexicalLoad: DifficultyDimensions["lexicalLoad"],
): DifficultyDimensions {
  return { ruleComplexity, dependencyDistance, distractorSimilarity, sentenceLength, ruleInteraction, lexicalLoad };
}

function buildCandidate(input: {
  candidateId: string;
  ruleId: GrammarRuleId;
  difficulty: EnglishDifficulty;
  dimensions: DifficultyDimensions;
  correctSegments: readonly string[];
  errorSegments: readonly string[];
  errorIndex: number;
  errorSpan: string;
  correction: string;
  subjectHead: string;
  distractorCue?: string;
  explanationApplication: string;
  tags: readonly string[];
}): Eng001SentenceCandidate {
  const mutationId = SUBJECT_VERB_AGREEMENT_RULE_BY_ID[input.ruleId].mutationId;
  const derived = classifyEnglishDifficulty(input.dimensions);
  if (derived !== input.difficulty) {
    throw new Error(`${input.candidateId} difficulty mismatch: requested ${input.difficulty}, derived ${derived}`);
  }
  return { ...input, mutationId };
}

const domainTag = (domain: SemanticDomainV4): string => `domain:${domain}`;
const baseScene = (seed: string): SemanticSceneV4 => deterministicPick(`${seed}:v4-scene`, BASE_SCENES_V4);
const sceneModifier = (scene: SemanticSceneV4, seed: string): string => deterministicPick(`${seed}:v4-modifier:${scene.familyId}`, scene.modifiers);
const articleFor = (word: string): "a" | "an" => /^[aeiou]/i.test(word) ? "an" : "a";

function renderBasic(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  if (difficulty !== "easy") throw new Error("GR-SVA-001 is easy-only in CP001 V4");
  const scene = baseScene(seed);
  const plural = deterministicPick(`${seed}:number`, [false, true] as const);
  const subject = `The ${plural ? scene.plural : scene.singular}`;
  const correctVerb = plural ? scene.pluralVerb : scene.singularVerb;
  const wrongVerb = plural ? scene.singularVerb : scene.pluralVerb;
  return buildCandidate({
    candidateId: `V4:P001:${scene.id}:${plural ? "PL" : "SG"}`,
    ruleId: "GR-SVA-001",
    difficulty,
    dimensions: dims(1, 1, 1, 1, 1, 1),
    correctSegments: [subject, correctVerb, scene.segment3, scene.segment4],
    errorSegments: [subject, wrongVerb, scene.segment3, scene.segment4],
    errorIndex: 1,
    errorSpan: wrongVerb,
    correction: correctVerb,
    subjectHead: plural ? scene.plural : scene.singular,
    explanationApplication: `The subject “${subject}” is ${plural ? "plural" : "singular"}, so the finite verb must be “${correctVerb}”.`,
    tags: ["pattern:basic", `scene:${scene.id}`, domainTag(scene.domain)],
  });
}

function renderEachEvery(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const scene = baseScene(seed);
  const each = deterministicPick(`${seed}:form`, [true, false] as const);
  const subject = each ? `Each of the ${scene.plural}` : `Every ${scene.singular}`;
  const explanation = each
    ? `“Each” is the singular head; the plural noun “${scene.plural}” does not control the verb.`
    : `The phrase “Every ${scene.singular}” is singular and takes “${scene.singularVerb}”.`;
  if (difficulty === "easy") {
    return buildCandidate({
      candidateId: `V4:P002:${scene.id}:${each ? "EACH" : "EVERY"}:E`,
      ruleId: "GR-SVA-002",
      difficulty,
      dimensions: dims(2, 1, 2, 1, 1, 1),
      correctSegments: [subject, scene.singularVerb, scene.segment3, scene.segment4],
      errorSegments: [subject, scene.pluralVerb, scene.segment3, scene.segment4],
      errorIndex: 1,
      errorSpan: scene.pluralVerb,
      correction: scene.singularVerb,
      subjectHead: each ? "Each" : subject,
      distractorCue: each ? scene.plural : undefined,
      explanationApplication: explanation,
      tags: [`pattern:${each ? "each-of" : "every"}`, `scene:${scene.id}`, domainTag(scene.domain)],
    });
  }
  const modifier = sceneModifier(scene, seed);
  return buildCandidate({
    candidateId: `V4:P002:${scene.id}:${each ? "EACH" : "EVERY"}:${modifier}:M`,
    ruleId: "GR-SVA-002",
    difficulty,
    dimensions: dims(2, 3, 3, 2, 1, 1),
    correctSegments: [subject, modifier, scene.singularVerb, `${scene.segment3} ${scene.segment4}`],
    errorSegments: [subject, modifier, scene.pluralVerb, `${scene.segment3} ${scene.segment4}`],
    errorIndex: 2,
    errorSpan: scene.pluralVerb,
    correction: scene.singularVerb,
    subjectHead: each ? "Each" : subject,
    distractorCue: each ? scene.plural : "intervening modifier",
    explanationApplication: `${explanation} The intervening phrase “${modifier}” does not alter that agreement.`,
    tags: [`pattern:${each ? "each-of" : "every"}`, "dependency:modifier", `scene:${scene.id}`, domainTag(scene.domain)],
  });
}

function renderOneOf(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const scene = baseScene(seed);
  const subject = `One of the ${scene.plural}`;
  if (difficulty === "easy") {
    return buildCandidate({
      candidateId: `V4:P003:${scene.id}:E`,
      ruleId: "GR-SVA-003",
      difficulty,
      dimensions: dims(2, 2, 2, 1, 1, 1),
      correctSegments: [subject, scene.singularVerb, scene.segment3, scene.segment4],
      errorSegments: [subject, scene.pluralVerb, scene.segment3, scene.segment4],
      errorIndex: 1,
      errorSpan: scene.pluralVerb,
      correction: scene.singularVerb,
      subjectHead: "One",
      distractorCue: scene.plural,
      explanationApplication: `The head subject is “One”, not “${scene.plural}”, so “${scene.singularVerb}” is required.`,
      tags: ["pattern:one-of", `scene:${scene.id}`, domainTag(scene.domain)],
    });
  }
  const modifier = sceneModifier(scene, seed);
  return buildCandidate({
    candidateId: `V4:P003:${scene.id}:${modifier}:M`,
    ruleId: "GR-SVA-003",
    difficulty,
    dimensions: dims(2, 3, 3, 2, 1, 1),
    correctSegments: [subject, modifier, scene.singularVerb, `${scene.segment3} ${scene.segment4}`],
    errorSegments: [subject, modifier, scene.pluralVerb, `${scene.segment3} ${scene.segment4}`],
    errorIndex: 2,
    errorSpan: scene.pluralVerb,
    correction: scene.singularVerb,
    subjectHead: "One",
    distractorCue: `${scene.plural} / modifier`,
    explanationApplication: `The singular head “One” controls agreement even though the plural noun “${scene.plural}” and the intervening phrase appear before the verb.`,
    tags: ["pattern:one-of", "dependency:modifier", `scene:${scene.id}`, domainTag(scene.domain)],
  });
}

const COUNT_VERBS = [
  { id: "increase", singular: "has increased", plural: "have increased" },
  { id: "fall", singular: "has fallen", plural: "have fallen" },
  { id: "change", singular: "has changed", plural: "have changed" },
] as const;

function renderNumberPhrase(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  if (difficulty === "medium") {
    const scene = baseScene(seed);
    const subject = `A number of ${scene.plural}`;
    return buildCandidate({
      candidateId: `V4:P004:A-NUMBER:${scene.id}:M`,
      ruleId: "GR-SVA-004",
      difficulty,
      dimensions: dims(3, 2, 3, 2, 1, 1),
      correctSegments: [subject, scene.pluralVerb, scene.segment3, scene.segment4],
      errorSegments: [subject, scene.singularVerb, scene.segment3, scene.segment4],
      errorIndex: 1,
      errorSpan: scene.singularVerb,
      correction: scene.pluralVerb,
      subjectHead: subject,
      explanationApplication: `“A number of ${scene.plural}” means several ${scene.plural} and therefore takes plural agreement.`,
      tags: ["pattern:a-number-of", `scene:${scene.id}`, domainTag(scene.domain)],
    });
  }
  const pair = deterministicPick(`${seed}:number-pair`, PAIR_SCENES_V4);
  const countVerb = deterministicPick(`${seed}:number-count-verb`, COUNT_VERBS);
  const tail = deterministicPick(`${seed}:number-tail`, COUNT_TAILS_BY_DOMAIN_V4[pair.domain]);
  const subject = `The number of ${pair.pluralSubject}`;
  return buildCandidate({
    candidateId: `V4:P004:THE-NUMBER:${pair.id}:${countVerb.id}:${tail}:H`,
    ruleId: "GR-SVA-004",
    difficulty,
    dimensions: dims(3, 4, 4, 3, 1, 1),
    correctSegments: [subject, pair.pluralModifier, countVerb.singular, tail],
    errorSegments: [subject, pair.pluralModifier, countVerb.plural, tail],
    errorIndex: 2,
    errorSpan: countVerb.plural,
    correction: countVerb.singular,
    subjectHead: "The number",
    distractorCue: pair.pluralSubject,
    explanationApplication: `“${subject}” refers to one total. The plural noun phrase “${pair.pluralSubject}” does not control the verb, so “${countVerb.singular}” is required.`,
    tags: ["pattern:the-number-of", "dependency:long", `pair:${pair.id}`, domainTag(pair.domain)],
  });
}

const ADDITIVE_CONNECTORS = ["along with", "together with", "as well as"] as const;

function renderAdditive(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const pair = deterministicPick(`${seed}:additive-pair`, PAIR_SCENES_V4);
  const connector = deterministicPick(`${seed}:additive-connector`, ADDITIVE_CONNECTORS);
  const mainPlural = deterministicPick(`${seed}:additive-main-number`, [false, true] as const);
  const subject = mainPlural ? `The ${pair.pluralSubject}` : `The ${pair.singularSubject}`;
  const other = mainPlural ? `the ${pair.singularSubject}` : `the ${pair.pluralSubject}`;
  const otherModifier = mainPlural ? pair.singularModifier : pair.pluralModifier;
  const correctVerb = mainPlural ? pair.pluralVerb : pair.singularVerb;
  const wrongVerb = mainPlural ? pair.singularVerb : pair.pluralVerb;
  const additive = difficulty === "hard" ? `${connector} ${other} ${otherModifier}` : `${connector} ${other}`;
  return buildCandidate({
    candidateId: `V4:P005:${pair.id}:${connector}:${mainPlural ? "PL" : "SG"}:${difficulty}`,
    ruleId: "GR-SVA-005",
    difficulty,
    dimensions: difficulty === "hard" ? dims(3, 4, 4, 3, 1, 1) : dims(3, 3, 3, 2, 1, 1),
    correctSegments: [`${subject},`, `${additive},`, correctVerb, pair.tail],
    errorSegments: [`${subject},`, `${additive},`, wrongVerb, pair.tail],
    errorIndex: 2,
    errorSpan: wrongVerb,
    correction: correctVerb,
    subjectHead: subject,
    distractorCue: other,
    explanationApplication: `The phrase “${additive}” adds information but does not form a compound subject; agreement remains with “${subject}”.`,
    tags: ["pattern:additive-phrase", difficulty === "hard" ? "dependency:long" : "dependency:medium", `pair:${pair.id}`, domainTag(pair.domain)],
  });
}

function renderProximity(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const pair = deterministicPick(`${seed}:proximity-pair`, PAIR_SCENES_V4);
  const nearPlural = deterministicPick(`${seed}:proximity-near-number`, [false, true] as const);
  const useEither = deterministicPick(`${seed}:proximity-form`, [false, true] as const);
  const firstJoin = useEither ? "Either" : "Neither";
  const secondJoin = useEither ? "or" : "nor";
  const subject = nearPlural
    ? `${firstJoin} the ${pair.singularSubject} ${secondJoin} the ${pair.pluralSubject}`
    : `${firstJoin} the ${pair.pluralSubject} ${secondJoin} the ${pair.singularSubject}`;
  const modifier = nearPlural ? pair.pluralModifier : pair.singularModifier;
  const correctVerb = nearPlural ? pair.pluralVerb : pair.singularVerb;
  const wrongVerb = nearPlural ? pair.singularVerb : pair.pluralVerb;
  const nearerSubject = nearPlural ? pair.pluralSubject : pair.singularSubject;
  if (difficulty === "medium") {
    return buildCandidate({
      candidateId: `V4:P006:${pair.id}:${useEither ? "EITHER" : "NEITHER"}:${nearPlural ? "PL" : "SG"}:M`,
      ruleId: "GR-SVA-006",
      difficulty,
      dimensions: dims(4, 2, 4, 2, 1, 1),
      correctSegments: [subject, correctVerb, pair.tail.split(" ").slice(0, 3).join(" "), pair.tail.split(" ").slice(3).join(" ")],
      errorSegments: [subject, wrongVerb, pair.tail.split(" ").slice(0, 3).join(" "), pair.tail.split(" ").slice(3).join(" ")],
      errorIndex: 1,
      errorSpan: wrongVerb,
      correction: correctVerb,
      subjectHead: nearerSubject,
      distractorCue: nearPlural ? pair.singularSubject : pair.pluralSubject,
      explanationApplication: `The nearer subject is “${nearerSubject}”, which is ${nearPlural ? "plural" : "singular"}; therefore “${correctVerb}” is required.`,
      tags: [`pattern:${useEither ? "either-or" : "neither-nor"}`, "agreement:proximity", `pair:${pair.id}`, domainTag(pair.domain)],
    });
  }
  return buildCandidate({
    candidateId: `V4:P006:${pair.id}:${useEither ? "EITHER" : "NEITHER"}:${nearPlural ? "PL" : "SG"}:H`,
    ruleId: "GR-SVA-006",
    difficulty,
    dimensions: dims(4, 4, 4, 3, 1, 1),
    correctSegments: [subject, modifier, correctVerb, pair.tail],
    errorSegments: [subject, modifier, wrongVerb, pair.tail],
    errorIndex: 2,
    errorSpan: wrongVerb,
    correction: correctVerb,
    subjectHead: nearerSubject,
    distractorCue: nearPlural ? pair.singularSubject : pair.pluralSubject,
    explanationApplication: `Even with the intervening phrase “${modifier}”, the nearer subject remains “${nearerSubject}”, so “${correctVerb}” is required.`,
    tags: [`pattern:${useEither ? "either-or" : "neither-nor"}`, "agreement:proximity", "dependency:modifier", `pair:${pair.id}`, domainTag(pair.domain)],
  });
}

function renderCollective(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const scene = deterministicPick(`${seed}:collective`, difficulty === "hard" ? COLLECTIVE_MEMBER_V4 : COLLECTIVE_UNIT_V4);
  const correctVerb = difficulty === "hard" ? scene.pluralVerb : scene.singularVerb;
  const wrongVerb = difficulty === "hard" ? scene.singularVerb : scene.pluralVerb;
  return buildCandidate({
    candidateId: `V4:P007:${scene.id}:${difficulty}`,
    ruleId: "GR-SVA-007",
    difficulty,
    dimensions: difficulty === "hard" ? dims(4, 3, 4, 3, 2, 1) : dims(3, 2, 3, 2, 1, 1),
    correctSegments: [scene.subject, correctVerb, scene.segment3, scene.segment4],
    errorSegments: [scene.subject, wrongVerb, scene.segment3, scene.segment4],
    errorIndex: 1,
    errorSpan: wrongVerb,
    correction: correctVerb,
    subjectHead: scene.subjectHead,
    distractorCue: scene.mode,
    explanationApplication: scene.mode === "unit"
      ? `The context presents “${scene.subjectHead}” as one unit, so singular agreement “${scene.singularVerb}” is required.`
      : `The context explicitly presents the members separately (“${scene.segment3}”), so plural agreement “${scene.pluralVerb}” is required in the target exam convention.`,
    tags: [`pattern:collective-${scene.mode}`, "ambiguity:context-guarded", `collective:${scene.id}`, domainTag(scene.domain)],
  });
}

function renderMoreThanOne(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const scene = baseScene(seed);
  const subject = `More than one ${scene.singular}`;
  if (difficulty === "medium") {
    return buildCandidate({
      candidateId: `V4:P008:${scene.id}:M`,
      ruleId: "GR-SVA-008",
      difficulty,
      dimensions: dims(4, 2, 4, 2, 1, 1),
      correctSegments: [subject, scene.singularVerb, scene.segment3, scene.segment4],
      errorSegments: [subject, scene.pluralVerb, scene.segment3, scene.segment4],
      errorIndex: 1,
      errorSpan: scene.pluralVerb,
      correction: scene.singularVerb,
      subjectHead: subject,
      explanationApplication: `The construction “more than one + singular noun” takes singular agreement, so “${scene.singularVerb}” is required.`,
      tags: ["pattern:more-than-one", `scene:${scene.id}`, domainTag(scene.domain)],
    });
  }
  const modifier = sceneModifier(scene, seed);
  return buildCandidate({
    candidateId: `V4:P008:${scene.id}:${modifier}:H`,
    ruleId: "GR-SVA-008",
    difficulty,
    dimensions: dims(4, 4, 4, 3, 1, 1),
    correctSegments: [subject, modifier, scene.singularVerb, `${scene.segment3} ${scene.segment4}`],
    errorSegments: [subject, modifier, scene.pluralVerb, `${scene.segment3} ${scene.segment4}`],
    errorIndex: 2,
    errorSpan: scene.pluralVerb,
    correction: scene.singularVerb,
    subjectHead: subject,
    distractorCue: modifier,
    explanationApplication: `The intervening phrase “${modifier}” does not change the singular agreement required by “${subject}”.`,
    tags: ["pattern:more-than-one", "dependency:modifier", `scene:${scene.id}`, domainTag(scene.domain)],
  });
}

function renderManyA(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const scene = baseScene(seed);
  const article = articleFor(scene.singular);
  const subject = `Many ${article} ${scene.singular}`;
  if (difficulty === "medium") {
    return buildCandidate({
      candidateId: `V4:P009:${scene.id}:M`,
      ruleId: "GR-SVA-009",
      difficulty,
      dimensions: dims(4, 2, 4, 2, 1, 1),
      correctSegments: [subject, scene.singularVerb, scene.segment3, scene.segment4],
      errorSegments: [subject, scene.pluralVerb, scene.segment3, scene.segment4],
      errorIndex: 1,
      errorSpan: scene.pluralVerb,
      correction: scene.singularVerb,
      subjectHead: subject,
      explanationApplication: `The construction “many ${article} + singular noun” takes singular agreement.`,
      tags: ["pattern:many-a", `scene:${scene.id}`, domainTag(scene.domain)],
    });
  }
  const modifier = sceneModifier(scene, seed);
  return buildCandidate({
    candidateId: `V4:P009:${scene.id}:${modifier}:H`,
    ruleId: "GR-SVA-009",
    difficulty,
    dimensions: dims(4, 4, 4, 3, 1, 1),
    correctSegments: [subject, modifier, scene.singularVerb, `${scene.segment3} ${scene.segment4}`],
    errorSegments: [subject, modifier, scene.pluralVerb, `${scene.segment3} ${scene.segment4}`],
    errorIndex: 2,
    errorSpan: scene.pluralVerb,
    correction: scene.singularVerb,
    subjectHead: subject,
    distractorCue: modifier,
    explanationApplication: `“${subject}” still takes singular agreement; the intervening phrase “${modifier}” does not change that.`,
    tags: ["pattern:many-a", "dependency:modifier", `scene:${scene.id}`, domainTag(scene.domain)],
  });
}

function renderIntervening(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const scene = deterministicPick(`${seed}:intervening`, INTERVENING_SCENES_V4);
  const hard = difficulty === "hard";
  return buildCandidate({
    candidateId: `V4:P010:${scene.id}:${hard ? "H" : "M"}`,
    ruleId: "GR-SVA-010",
    difficulty,
    dimensions: hard ? dims(3, 4, 5, 3, 1, 1) : dims(2, 3, 4, 2, 1, 1),
    correctSegments: [scene.subject, scene.modifier, scene.singularVerb, scene.tail],
    errorSegments: [scene.subject, scene.modifier, scene.pluralVerb, scene.tail],
    errorIndex: 2,
    errorSpan: scene.pluralVerb,
    correction: scene.singularVerb,
    subjectHead: scene.subjectHead,
    distractorCue: scene.distractorCue,
    explanationApplication: `The true subject head is the singular noun “${scene.subjectHead}”. The nearby plural noun(s) “${scene.distractorCue}” are inside intervening material and do not control the verb.`,
    tags: ["pattern:intervening-phrase", hard ? "dependency:attractor" : "dependency:single", `intervening:${scene.id}`, domainTag(scene.domain)],
  });
}

const RENDERERS: Record<GrammarRuleId, (difficulty: EnglishDifficulty, seed: string) => Eng001SentenceCandidate> = {
  "GR-SVA-001": renderBasic,
  "GR-SVA-002": renderEachEvery,
  "GR-SVA-003": renderOneOf,
  "GR-SVA-004": renderNumberPhrase,
  "GR-SVA-005": renderAdditive,
  "GR-SVA-006": renderProximity,
  "GR-SVA-007": renderCollective,
  "GR-SVA-008": renderMoreThanOne,
  "GR-SVA-009": renderManyA,
  "GR-SVA-010": renderIntervening,
};

export const ENG001_CP001_V4_NO_ERROR_RULE_IDS: readonly GrammarRuleId[] = [
  "GR-SVA-002", "GR-SVA-003", "GR-SVA-004", "GR-SVA-005", "GR-SVA-006",
  "GR-SVA-007", "GR-SVA-008", "GR-SVA-009", "GR-SVA-010",
] as const;

export function rulesForDifficultyV4(difficulty: EnglishDifficulty): readonly GrammarRuleId[] {
  return Object.values(SUBJECT_VERB_AGREEMENT_RULE_BY_ID)
    .filter((rule) => rule.allowedDifficulties.includes(difficulty))
    .map((rule) => rule.ruleId);
}

export function buildEng001Cp001CandidateV4(input: {
  ruleId: GrammarRuleId;
  difficulty: EnglishDifficulty;
  seed: string;
}): Eng001SentenceCandidate {
  const rule = SUBJECT_VERB_AGREEMENT_RULE_BY_ID[input.ruleId];
  if (!rule.allowedDifficulties.includes(input.difficulty)) {
    throw new Error(`${input.ruleId} does not support ${input.difficulty} in CP001 V4`);
  }
  return RENDERERS[input.ruleId](input.difficulty, input.seed);
}

export function semanticDomainOfV4(candidate: Eng001SentenceCandidate): SemanticDomainV4 | null {
  const tag = candidate.tags.find((entry) => entry.startsWith("domain:"));
  if (!tag) return null;
  const domain = tag.slice("domain:".length) as SemanticDomainV4;
  return SEMANTIC_DOMAINS_V4.includes(domain) ? domain : null;
}

/**
 * Conservative canonical-candidate capacity before QL shaping and stem variation.
 * This deliberately counts structural + semantic realizations, not raw noun swaps.
 */
export const CP001_V4_CANONICAL_VARIANT_CAPACITY = {
  easy: 3_200,
  medium: 6_492,
  hard: 3_772,
  total: 13_464,
} as const;

export const CP001_V4_CATALOG_METRICS = {
  semanticScenes: CP001_V4_BASE_SCENE_COUNT,
  semanticDomains: SEMANTIC_DOMAINS_V4.length,
  pairScenes: PAIR_SCENES_V4.length,
  interveningScenes: INTERVENING_SCENES_V4.length,
  collectiveUnitScenes: COLLECTIVE_UNIT_V4.length,
  collectiveMemberScenes: COLLECTIVE_MEMBER_V4.length,
  canonicalVariants: CP001_V4_CANONICAL_VARIANT_CAPACITY.total,
} as const;