import {
  CLS_CP002_CLASS_RELATION_IDS,
  CLS_CP002_LEXICAL_RELATION_IDS,
  CLS_CP002_PROTOTYPE_BY_ID,
  CLS_CP002_PROTOTYPES,
  CLS_CP002_RELATIONS,
  CLS_CP002_SEMANTIC_RELATION_IDS,
  classMemberLabels,
  directClassMemberLabels,
  factsForRelation,
  matchingRelationIds,
  relationDefinition,
} from "./relation-registry";
import type {
  ClsCp002AmbiguityAudit,
  ClsCp002Difficulty,
  ClsCp002DifficultyFeatures,
  ClsCp002Pair,
  ClsCp002PrototypeDefinition,
  ClsCp002PrototypeId,
  ClsCp002RelationFact,
  ClsCp002RelationSupport,
  GeneratedClsCp002Question,
} from "./types";

const MAX_GENERATION_ATTEMPTS = 240;

const LIFECYCLE = {
  permanentQlId: null,
  reviewStatus: "UNREVIEWED_DISCOVERY" as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
  questionStudioDiscoverable: false as const,
};

type Rng = {
  next(): number;
  int(maxExclusive: number): number;
};

type CandidateState = {
  readonly intendedRelationId: string;
  readonly pairs: readonly ClsCp002Pair[];
  readonly sourceFactIds: readonly string[];
  readonly eligibleRelationIds: readonly string[];
  readonly oddPairKind: GeneratedClsCp002Question["metadata"]["oddPairKind"];
};

function hashText(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function makeRng(seed: number, salt: string): Rng {
  let state = hashText(`${salt}:${seed}`) ^ 0x9e3779b9;
  if (state === 0) state = 0x6d2b79f5;
  return {
    next(): number {
      state ^= state << 13;
      state ^= state >>> 17;
      state ^= state << 5;
      return (state >>> 0) / 0x100000000;
    },
    int(maxExclusive: number): number {
      if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
        throw new Error(`Invalid random bound: ${maxExclusive}`);
      }
      return Math.floor(this.next() * maxExclusive);
    },
  };
}

function shuffled<T>(values: readonly T[], rng: Rng): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = rng.int(index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex]!, result[index]!];
  }
  return result;
}

function sampleDistinct<T>(values: readonly T[], count: number, rng: Rng): T[] {
  if (count > values.length) {
    throw new Error(`Cannot sample ${count} values from ${values.length}`);
  }
  return shuffled(values, rng).slice(0, count);
}

function pairDisplay(pair: ClsCp002Pair): string {
  return `${pair.left} : ${pair.right}`;
}

function naturalList(values: readonly string[]): string {
  if (values.length === 0) return "";
  if (values.length === 1) return values[0]!;
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")} and ${values.at(-1)}`;
}

function requirePrototype(prototypeId: ClsCp002PrototypeId): ClsCp002PrototypeDefinition {
  const prototype = CLS_CP002_PROTOTYPE_BY_ID.get(prototypeId);
  if (!prototype) throw new Error(`Unknown CLS-CP-002 prototype: ${prototypeId}`);
  return prototype;
}

function factsAsPairs(facts: readonly ClsCp002RelationFact[]): ClsCp002Pair[] {
  return facts.map((fact) => ({ left: fact.left, right: fact.right }));
}

function relationIdsForFamily(family: "SEMANTIC" | "LEXICAL" | "ALL_FACTS"): readonly string[] {
  if (family === "SEMANTIC") return CLS_CP002_SEMANTIC_RELATION_IDS;
  if (family === "LEXICAL") return CLS_CP002_LEXICAL_RELATION_IDS;
  return [...CLS_CP002_SEMANTIC_RELATION_IDS, ...CLS_CP002_LEXICAL_RELATION_IDS];
}

function constructContrastRelationState(
  prototype: ClsCp002PrototypeDefinition,
  optionCount: 4 | 5,
  rng: Rng,
): CandidateState {
  const intendedRelationId = prototype.eligibleRelationIds[rng.int(prototype.eligibleRelationIds.length)]!;
  const intended = relationDefinition(intendedRelationId);
  const contrasts = prototype.eligibleRelationIds.filter((relationId) => {
    const candidate = relationDefinition(relationId);
    return relationId !== intendedRelationId && candidate.contrastGroup === intended.contrastGroup;
  });
  if (contrasts.length === 0) throw new Error(`No contrast relation for ${intendedRelationId}`);
  const contrastRelationId = contrasts[rng.int(contrasts.length)]!;
  const commonFacts = sampleDistinct(factsForRelation(intendedRelationId), optionCount - 1, rng);
  const oddFact = sampleDistinct(factsForRelation(contrastRelationId), 1, rng)[0]!;
  return {
    intendedRelationId,
    pairs: [...factsAsPairs(commonFacts), { left: oddFact.left, right: oddFact.right }],
    sourceFactIds: [...commonFacts.map((fact) => fact.factId), oddFact.factId],
    eligibleRelationIds: relationIdsForFamily("SEMANTIC"),
    oddPairKind: "CONTRAST_RELATION",
  };
}

function constructLexicalPolarityState(optionCount: 4 | 5, rng: Rng): CandidateState {
  const intendedRelationId = rng.int(2) === 0 ? "LEX_SYNONYM" : "LEX_ANTONYM";
  const contrastRelationId = intendedRelationId === "LEX_SYNONYM" ? "LEX_ANTONYM" : "LEX_SYNONYM";
  const commonFacts = sampleDistinct(factsForRelation(intendedRelationId), optionCount - 1, rng);
  const oddFact = sampleDistinct(factsForRelation(contrastRelationId), 1, rng)[0]!;
  return {
    intendedRelationId,
    pairs: [...factsAsPairs(commonFacts), { left: oddFact.left, right: oddFact.right }],
    sourceFactIds: [...commonFacts.map((fact) => fact.factId), oddFact.factId],
    eligibleRelationIds: relationIdsForFamily("LEXICAL"),
    oddPairKind: "CONTRAST_RELATION",
  };
}

function constructReversedDirectionState(
  prototype: ClsCp002PrototypeDefinition,
  optionCount: 4 | 5,
  rng: Rng,
): CandidateState {
  const viable = prototype.eligibleRelationIds.filter((relationId) => factsForRelation(relationId).length >= optionCount);
  const intendedRelationId = viable[rng.int(viable.length)]!;
  const selectedFacts = sampleDistinct(factsForRelation(intendedRelationId), optionCount, rng);
  const commonFacts = selectedFacts.slice(0, optionCount - 1);
  const reversedFact = selectedFacts.at(-1)!;
  return {
    intendedRelationId,
    pairs: [
      ...factsAsPairs(commonFacts),
      { left: reversedFact.right, right: reversedFact.left },
    ],
    sourceFactIds: selectedFacts.map((fact) => fact.factId),
    eligibleRelationIds: relationIdsForFamily("ALL_FACTS"),
    oddPairKind: "REVERSED_DIRECTION",
  };
}

function constructFalsePairState(
  prototype: ClsCp002PrototypeDefinition,
  optionCount: 4 | 5,
  rng: Rng,
): CandidateState {
  const viable = prototype.eligibleRelationIds.filter((relationId) => factsForRelation(relationId).length >= optionCount + 1);
  const intendedRelationId = viable[rng.int(viable.length)]!;
  const selectedFacts = sampleDistinct(factsForRelation(intendedRelationId), optionCount + 1, rng);
  const commonFacts = selectedFacts.slice(0, optionCount - 1);
  const leftSources = selectedFacts.slice(optionCount - 1);
  const eligibleRelationIds = relationIdsForFamily("ALL_FACTS");

  let falsePair: ClsCp002Pair | null = null;
  for (const leftFact of shuffled(leftSources, rng)) {
    for (const rightFact of shuffled(selectedFacts, rng)) {
      if (leftFact.factId === rightFact.factId) continue;
      const candidate = { left: leftFact.left, right: rightFact.right };
      if (matchingRelationIds(candidate, eligibleRelationIds).length === 0) {
        falsePair = candidate;
        break;
      }
    }
    if (falsePair) break;
  }
  if (!falsePair) throw new Error(`Unable to construct category-safe false pair for ${intendedRelationId}`);

  return {
    intendedRelationId,
    pairs: [...factsAsPairs(commonFacts), falsePair],
    sourceFactIds: selectedFacts.map((fact) => fact.factId),
    eligibleRelationIds,
    oddPairKind: "FALSE_PAIR",
  };
}

function constructClassPairState(optionCount: 4 | 5, rng: Rng): CandidateState {
  const viable = CLS_CP002_CLASS_RELATION_IDS.filter((relationId) =>
    directClassMemberLabels(relationId).length >= (optionCount - 1) * 2,
  );
  const intendedRelationId = viable[rng.int(viable.length)]!;
  const intended = relationDefinition(intendedRelationId);
  const contrasts = viable.filter((relationId) => {
    const candidate = relationDefinition(relationId);
    return relationId !== intendedRelationId
      && candidate.contrastGroup === intended.contrastGroup
      && directClassMemberLabels(relationId).length >= 2;
  });
  if (contrasts.length === 0) throw new Error(`No class contrast for ${intendedRelationId}`);
  const contrastRelationId = contrasts[rng.int(contrasts.length)]!;

  const commonLabels = sampleDistinct(
    directClassMemberLabels(intendedRelationId),
    (optionCount - 1) * 2,
    rng,
  );
  const pairs: ClsCp002Pair[] = [];
  for (let index = 0; index < commonLabels.length; index += 2) {
    pairs.push({ left: commonLabels[index]!, right: commonLabels[index + 1]! });
  }
  const oddLabels = sampleDistinct(directClassMemberLabels(contrastRelationId), 2, rng);
  pairs.push({ left: oddLabels[0]!, right: oddLabels[1]! });

  return {
    intendedRelationId,
    pairs,
    sourceFactIds: pairs.map((pair, index) => `CLS-CP002-CLASS-${index + 1}-${pair.left}-${pair.right}`),
    eligibleRelationIds: CLS_CP002_CLASS_RELATION_IDS,
    oddPairKind: "CLASS_CONTRAST",
  };
}

function constructState(
  prototype: ClsCp002PrototypeDefinition,
  optionCount: 4 | 5,
  rng: Rng,
): CandidateState {
  switch (prototype.generationProfile) {
    case "CONTRAST_RELATION":
      return constructContrastRelationState(prototype, optionCount, rng);
    case "LEXICAL_POLARITY":
      return constructLexicalPolarityState(optionCount, rng);
    case "REVERSED_DIRECTION":
      return constructReversedDirectionState(prototype, optionCount, rng);
    case "CATEGORY_SAFE_FALSE_PAIR":
      return constructFalsePairState(prototype, optionCount, rng);
    case "CLASS_PAIR_CONTRAST":
      return constructClassPairState(optionCount, rng);
  }
}

function relationSupports(
  pairs: readonly ClsCp002Pair[],
  eligibleRelationIds: readonly string[],
): ClsCp002RelationSupport[] {
  return eligibleRelationIds.map((relationId) => {
    const definition = relationDefinition(relationId);
    const matchingOptionIndexes = pairs
      .map((pair, optionIndex) => matchingRelationIds(pair, [relationId]).length > 0 ? optionIndex : -1)
      .filter((optionIndex) => optionIndex >= 0);
    const matchingSet = new Set(matchingOptionIndexes);
    return {
      relationId,
      relationLabel: definition.label,
      matchingOptionIndexes,
      outlierIndexes: pairs.map((_, index) => index).filter((index) => !matchingSet.has(index)),
      qualityRank: definition.qualityRank,
    };
  });
}

export function auditClsCp002DisplayedPairs(
  pairs: readonly ClsCp002Pair[],
  eligibleRelationIds: readonly string[],
): ClsCp002AmbiguityAudit {
  if (![4, 5].includes(pairs.length)) {
    throw new Error(`CLS-CP-002 audit requires four or five pairs, received ${pairs.length}`);
  }
  const supports = relationSupports(pairs, eligibleRelationIds);
  const candidates = supports.filter((support) =>
    support.matchingOptionIndexes.length === pairs.length - 1 && support.outlierIndexes.length === 1,
  );
  if (candidates.length === 0) {
    return {
      result: "NO_VALID_RULE",
      winningRelationId: null,
      winningOutlierIndex: null,
      candidateSupports: [],
      reason: "No admitted relation groups every pair except one.",
    };
  }

  const bestRank = Math.max(...candidates.map((candidate) => candidate.qualityRank));
  const comparable = candidates.filter((candidate) => candidate.qualityRank >= bestRank - 10);
  const outlierIndexes = new Set(comparable.map((candidate) => candidate.outlierIndexes[0]!));
  if (outlierIndexes.size > 1) {
    return {
      result: "AMBIGUOUS",
      winningRelationId: null,
      winningOutlierIndex: null,
      candidateSupports: comparable,
      reason: "Comparable admitted relations identify different odd pairs.",
    };
  }

  const winners = comparable
    .filter((candidate) => candidate.qualityRank === bestRank)
    .sort((left, right) => left.relationId.localeCompare(right.relationId));
  const winner = winners[0]!;
  return {
    result: "UNIQUE",
    winningRelationId: winner.relationId,
    winningOutlierIndex: winner.outlierIndexes[0]!,
    candidateSupports: comparable,
    reason: comparable.length > 1
      ? "Several admitted descriptions agree on the same odd pair."
      : "Exactly one admitted relation identifies one odd pair.",
  };
}

export function independentlyVerifyClsCp002Question(question: GeneratedClsCp002Question): ClsCp002AmbiguityAudit {
  const eligibleRelationIds = question.family === "CLASS_COHESION"
    ? CLS_CP002_CLASS_RELATION_IDS
    : question.generationProfile === "LEXICAL_POLARITY"
      ? CLS_CP002_LEXICAL_RELATION_IDS
      : [...CLS_CP002_SEMANTIC_RELATION_IDS, ...CLS_CP002_LEXICAL_RELATION_IDS];
  return auditClsCp002DisplayedPairs(question.pairs, eligibleRelationIds);
}

function difficultyFeatures(
  questionPairs: readonly ClsCp002Pair[],
  intendedRelationId: string,
  profile: ClsCp002PrototypeDefinition["generationProfile"],
  audit: ClsCp002AmbiguityAudit,
): ClsCp002DifficultyFeatures {
  const intended = relationDefinition(intendedRelationId);
  const classMultiMembershipCount = questionPairs.filter((pair) =>
    matchingRelationIds(pair, CLS_CP002_CLASS_RELATION_IDS).length > 1,
  ).length;
  const semanticDemand: 1 | 2 | 3 = profile === "LEXICAL_POLARITY"
    ? 1
    : profile === "CLASS_PAIR_CONTRAST"
      ? 2
      : profile === "REVERSED_DIRECTION" || profile === "CATEGORY_SAFE_FALSE_PAIR"
        ? 3
        : 2;
  const score =
    (questionPairs.length === 5 ? 1 : 0)
    + (intended.directionSensitive ? 1 : 0)
    + (profile === "REVERSED_DIRECTION" ? 2 : 0)
    + (profile === "CATEGORY_SAFE_FALSE_PAIR" ? 2 : 0)
    + (profile === "LEXICAL_POLARITY" ? 1 : 0)
    + Math.min(2, classMultiMembershipCount)
    + Math.max(0, audit.candidateSupports.length - 1)
    + Math.max(0, semanticDemand - 1);
  return {
    optionCount: questionPairs.length as 4 | 5,
    directionSensitive: intended.directionSensitive,
    reversedDirection: profile === "REVERSED_DIRECTION",
    categorySafeFalsePair: profile === "CATEGORY_SAFE_FALSE_PAIR",
    lexicalPolarity: profile === "LEXICAL_POLARITY",
    classMultiMembershipCount,
    candidateRelationCount: audit.candidateSupports.length,
    semanticDemand,
    score,
  };
}

function difficultyFromScore(score: number): ClsCp002Difficulty {
  if (score <= 2) return "EASY";
  if (score <= 5) return "MEDIUM";
  return "HARD";
}

function stem(seed: number): string {
  const stems = [
    "Choose the pair that is different from the other pairs in its relationship.",
    "Three of the following pairs follow one common relationship. Which pair does not?",
    "Select the odd pair based on the relationship between the two words.",
    "Which option-pair does not follow the relation followed by the others?",
  ];
  return stems[seed % stems.length]!;
}

function explanation(
  pairs: readonly ClsCp002Pair[],
  correctIndex: number,
  intendedRelationId: string,
  profile: ClsCp002PrototypeDefinition["generationProfile"],
): GeneratedClsCp002Question["explanation"] {
  const relation = relationDefinition(intendedRelationId);
  const commonPairs = pairs.filter((_, index) => index !== correctIndex).map(pairDisplay);
  const oddPair = pairDisplay(pairs[correctIndex]!);
  const specificDifference = profile === "REVERSED_DIRECTION"
    ? `${oddPair} reverses the required direction.`
    : profile === "CATEGORY_SAFE_FALSE_PAIR"
      ? `${oddPair} uses words from the expected categories, but the two words do not form the registered relationship.`
      : profile === "CLASS_PAIR_CONTRAST"
        ? `${oddPair} contains members of a different class.`
        : `${oddPair} follows a different relationship.`;
  const trap = profile === "REVERSED_DIRECTION"
    ? "Do not ignore order: reversing the two words changes a directional relationship."
    : profile === "CATEGORY_SAFE_FALSE_PAIR"
      ? "Do not accept a pair merely because both words look like the right types; verify the actual link between them."
      : profile === "LEXICAL_POLARITY"
        ? "Do not confuse words with related meanings and words with opposite meanings."
        : profile === "CLASS_PAIR_CONTRAST"
          ? "Check both words inside each pair; matching only one word is not enough."
          : "Use one precise relation for every common pair; a vague link can hide the true odd pair.";
  return {
    coreConcept: [
      `The common pairs follow this relation: ${relation.ruleStatement}`,
    ],
    stepByStep: [
      `${naturalList(commonPairs)} follow the same relationship.`,
      specificDifference,
      `Therefore, ${oddPair} is the odd pair.`,
    ],
    examSpeedShortcut: [
      relation.directionSensitive
        ? "Read each pair from left to right and describe the link in one short sentence."
        : "Name the meaning-link inside each pair, then compare that link across the options.",
    ],
    commonTrapWarning: [trap],
  };
}

function evidenceByOption(
  pairs: readonly ClsCp002Pair[],
  intendedRelationId: string,
): string[] {
  const relation = relationDefinition(intendedRelationId);
  return pairs.map((pair) => matchingRelationIds(pair, [intendedRelationId]).length > 0
    ? `${pairDisplay(pair)} follows ${relation.label}.`
    : `${pairDisplay(pair)} does not follow ${relation.label}.`);
}

export function generateClsCp002Prototype(
  prototypeId: ClsCp002PrototypeId,
  seed = 0,
  optionCount: 4 | 5 = 4,
): GeneratedClsCp002Question {
  if (!Number.isSafeInteger(seed) || seed < 0) {
    throw new Error(`Seed must be a non-negative safe integer: ${seed}`);
  }
  if (optionCount !== 4 && optionCount !== 5) {
    throw new Error(`CLS-CP-002 supports four or five options, received ${optionCount}`);
  }
  const prototype = requirePrototype(prototypeId);

  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
    const rng = makeRng(seed * MAX_GENERATION_ATTEMPTS + attempt, prototypeId);
    let state: CandidateState;
    try {
      state = constructState(prototype, optionCount, rng);
    } catch {
      continue;
    }

    const shuffledPairs = shuffled(state.pairs, rng);
    const displays = shuffledPairs.map(pairDisplay);
    if (new Set(displays.map((value) => value.toLocaleLowerCase("en-IN"))).size !== optionCount) continue;

    const audit = auditClsCp002DisplayedPairs(shuffledPairs, state.eligibleRelationIds);
    if (audit.result !== "UNIQUE") continue;
    if (audit.winningRelationId !== state.intendedRelationId) continue;
    const correctIndex = audit.winningOutlierIndex!;
    const intended = relationDefinition(state.intendedRelationId);
    const features = difficultyFeatures(shuffledPairs, state.intendedRelationId, prototype.generationProfile, audit);

    const question: GeneratedClsCp002Question = {
      checkpointId: "CLS-CP-002",
      prototypeId,
      seed,
      task: "FIND_ODD_PAIR",
      generationProfile: prototype.generationProfile,
      family: intended.family,
      stem: stem(seed + attempt),
      pairs: shuffledPairs,
      options: displays,
      correctIndex,
      answer: displays[correctIndex]!,
      intendedRelationId: state.intendedRelationId,
      intendedRelationLabel: intended.label,
      evidenceByOption: evidenceByOption(shuffledPairs, state.intendedRelationId),
      ambiguityAudit: audit,
      difficulty: difficultyFromScore(features.score),
      difficultyFeatures: features,
      explanation: explanation(shuffledPairs, correctIndex, state.intendedRelationId, prototype.generationProfile),
      metadata: {
        datasetVersion: "CLS-CP002-RELATION-DISCOVERY-v1",
        runtimeVersion: "cls-cp002-discovery-v1",
        locale: "en-IN",
        optionCount,
        sourceRelationFactIds: state.sourceFactIds,
        oddPairKind: state.oddPairKind,
      },
      lifecycle: LIFECYCLE,
    };

    const independent = independentlyVerifyClsCp002Question(question);
    if (
      independent.result === "UNIQUE"
      && independent.winningOutlierIndex === question.correctIndex
      && independent.winningRelationId === question.intendedRelationId
    ) {
      return question;
    }
  }

  throw new Error(`${prototypeId}/${seed}/${optionCount} did not produce a unique state`);
}

export function getClsCp002PrototypeDefinitions(): readonly ClsCp002PrototypeDefinition[] {
  return CLS_CP002_PROTOTYPES;
}

export function getClsCp002RelationRegistry() {
  return {
    datasetVersion: "CLS-CP002-RELATION-DISCOVERY-v1" as const,
    relations: CLS_CP002_RELATIONS,
    semanticRelationCount: CLS_CP002_SEMANTIC_RELATION_IDS.length,
    lexicalRelationCount: CLS_CP002_LEXICAL_RELATION_IDS.length,
    classRelationCount: CLS_CP002_CLASS_RELATION_IDS.length,
    classMemberLabels,
  };
}
