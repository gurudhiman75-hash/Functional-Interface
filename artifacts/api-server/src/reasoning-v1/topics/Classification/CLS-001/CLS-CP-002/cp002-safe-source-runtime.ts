import {
  CLS_CP002_CLASS_RELATION_IDS,
  CLS_CP002_LEXICAL_RELATION_IDS,
  CLS_CP002_PROTOTYPE_BY_ID,
  CLS_CP002_SEMANTIC_RELATION_IDS,
  directClassMemberLabels,
  matchingRelationIds,
  relationDefinition,
} from "./relation-registry";
import {
  CLS_CP002_MULTILINGUAL_SAFE_RELATION_IDS,
  multilingualSafeFactsForRelation,
} from "./localization/cp002-safe-facts";
import { auditClsCp002DisplayedPairs } from "./runtime";
import type {
  ClsCp002AmbiguityAudit,
  ClsCp002Difficulty,
  ClsCp002DifficultyFeatures,
  ClsCp002Pair,
  ClsCp002PrototypeDefinition,
  ClsCp002PrototypeId,
  ClsCp002RelationFact,
  GeneratedClsCp002Question,
} from "./types";

const MAX_ATTEMPTS = 240;
const ALL_FACT_RELATION_IDS = [
  ...CLS_CP002_SEMANTIC_RELATION_IDS,
  ...CLS_CP002_LEXICAL_RELATION_IDS,
];

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

type SafeState = {
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

function sample<T>(values: readonly T[], count: number, rng: Rng): T[] {
  if (values.length < count) throw new Error(`Cannot sample ${count} from ${values.length}`);
  return shuffled(values, rng).slice(0, count);
}

function choose<T>(values: readonly T[], seed: number, salt: string): T {
  if (values.length === 0) throw new Error(`Cannot choose from an empty ${salt} pool`);
  return values[hashText(`${salt}:${seed}`) % values.length]!;
}

function display(pair: ClsCp002Pair): string {
  return `${pair.left} : ${pair.right}`;
}

function list(values: readonly string[]): string {
  if (values.length === 0) return "";
  if (values.length === 1) return values[0]!;
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")} and ${values.at(-1)}`;
}

function prototype(prototypeId: ClsCp002PrototypeId): ClsCp002PrototypeDefinition {
  const value = CLS_CP002_PROTOTYPE_BY_ID.get(prototypeId);
  if (!value) throw new Error(`Unknown CLS-CP-002 prototype: ${prototypeId}`);
  return value;
}

function pairsFromFacts(facts: readonly ClsCp002RelationFact[]): ClsCp002Pair[] {
  return facts.map((fact) => ({ left: fact.left, right: fact.right }));
}

function contrastState(
  definition: ClsCp002PrototypeDefinition,
  seed: number,
  optionCount: 4 | 5,
  rng: Rng,
): SafeState {
  const intendedPool = definition.eligibleRelationIds.filter((relationId) => {
    const intended = relationDefinition(relationId);
    if (multilingualSafeFactsForRelation(relationId).length < optionCount - 1) return false;
    return definition.eligibleRelationIds.some((otherId) => {
      const other = relationDefinition(otherId);
      return otherId !== relationId
        && other.contrastGroup === intended.contrastGroup
        && multilingualSafeFactsForRelation(otherId).length > 0;
    });
  });
  const intendedRelationId = choose(intendedPool, seed, `${definition.prototypeId}:intended`);
  const intended = relationDefinition(intendedRelationId);
  const contrastPool = definition.eligibleRelationIds.filter((relationId) => {
    const other = relationDefinition(relationId);
    return relationId !== intendedRelationId
      && other.contrastGroup === intended.contrastGroup
      && multilingualSafeFactsForRelation(relationId).length > 0;
  });
  const contrastRelationId = choose(contrastPool, seed, `${definition.prototypeId}:contrast`);
  const common = sample(multilingualSafeFactsForRelation(intendedRelationId), optionCount - 1, rng);
  const odd = sample(multilingualSafeFactsForRelation(contrastRelationId), 1, rng)[0]!;
  return {
    intendedRelationId,
    pairs: [...pairsFromFacts(common), { left: odd.left, right: odd.right }],
    sourceFactIds: [...common.map((fact) => fact.factId), odd.factId],
    eligibleRelationIds: CLS_CP002_SEMANTIC_RELATION_IDS,
    oddPairKind: "CONTRAST_RELATION",
  };
}

function lexicalPolarityState(seed: number, optionCount: 4 | 5, rng: Rng): SafeState {
  const intendedRelationId = choose(
    ["LEX_SYNONYM", "LEX_ANTONYM"],
    seed,
    "CLS-CP002-PROT-002:intended",
  );
  const contrastRelationId = intendedRelationId === "LEX_SYNONYM" ? "LEX_ANTONYM" : "LEX_SYNONYM";
  const common = sample(multilingualSafeFactsForRelation(intendedRelationId), optionCount - 1, rng);
  const odd = sample(multilingualSafeFactsForRelation(contrastRelationId), 1, rng)[0]!;
  return {
    intendedRelationId,
    pairs: [...pairsFromFacts(common), { left: odd.left, right: odd.right }],
    sourceFactIds: [...common.map((fact) => fact.factId), odd.factId],
    eligibleRelationIds: CLS_CP002_LEXICAL_RELATION_IDS,
    oddPairKind: "CONTRAST_RELATION",
  };
}

function reversedState(seed: number, optionCount: 4 | 5, rng: Rng): SafeState {
  const viable = CLS_CP002_MULTILINGUAL_SAFE_RELATION_IDS.filter((relationId) =>
    relationDefinition(relationId).directionSensitive
    && multilingualSafeFactsForRelation(relationId).length >= optionCount,
  );
  const intendedRelationId = choose(viable, seed, "CLS-CP002-PROT-003:intended");
  const facts = sample(multilingualSafeFactsForRelation(intendedRelationId), optionCount, rng);
  const common = facts.slice(0, optionCount - 1);
  const reversed = facts.at(-1)!;
  return {
    intendedRelationId,
    pairs: [...pairsFromFacts(common), { left: reversed.right, right: reversed.left }],
    sourceFactIds: facts.map((fact) => fact.factId),
    eligibleRelationIds: ALL_FACT_RELATION_IDS,
    oddPairKind: "REVERSED_DIRECTION",
  };
}

function falsePairState(seed: number, optionCount: 4 | 5, rng: Rng): SafeState {
  const viable = CLS_CP002_MULTILINGUAL_SAFE_RELATION_IDS.filter((relationId) =>
    multilingualSafeFactsForRelation(relationId).length >= optionCount + 1,
  );
  const intendedRelationId = choose(viable, seed, "CLS-CP002-PROT-004:intended");
  const facts = sample(multilingualSafeFactsForRelation(intendedRelationId), optionCount + 1, rng);
  const common = facts.slice(0, optionCount - 1);
  const remaining = facts.slice(optionCount - 1);
  let odd: ClsCp002Pair | null = null;
  for (const leftFact of shuffled(remaining, rng)) {
    for (const rightFact of shuffled(facts, rng)) {
      if (leftFact.factId === rightFact.factId) continue;
      const candidate = { left: leftFact.left, right: rightFact.right };
      if (matchingRelationIds(candidate, ALL_FACT_RELATION_IDS).length === 0) {
        odd = candidate;
        break;
      }
    }
    if (odd) break;
  }
  if (!odd) throw new Error(`Unable to construct safe false pair for ${intendedRelationId}`);
  return {
    intendedRelationId,
    pairs: [...pairsFromFacts(common), odd],
    sourceFactIds: facts.map((fact) => fact.factId),
    eligibleRelationIds: ALL_FACT_RELATION_IDS,
    oddPairKind: "FALSE_PAIR",
  };
}

function classState(seed: number, optionCount: 4 | 5, rng: Rng): SafeState {
  const viable = CLS_CP002_CLASS_RELATION_IDS.filter((relationId) =>
    directClassMemberLabels(relationId).length >= (optionCount - 1) * 2,
  );
  const intendedPool = viable.filter((relationId) => {
    const intended = relationDefinition(relationId);
    return viable.some((otherId) => {
      const other = relationDefinition(otherId);
      return otherId !== relationId && other.contrastGroup === intended.contrastGroup;
    });
  });
  const intendedRelationId = choose(intendedPool, seed, "CLS-CP002-PROT-005:intended");
  const intended = relationDefinition(intendedRelationId);
  const contrastPool = viable.filter((relationId) => {
    const other = relationDefinition(relationId);
    return relationId !== intendedRelationId && other.contrastGroup === intended.contrastGroup;
  });
  const contrastRelationId = choose(contrastPool, seed, "CLS-CP002-PROT-005:contrast");
  const commonLabels = sample(
    directClassMemberLabels(intendedRelationId),
    (optionCount - 1) * 2,
    rng,
  );
  const pairs: ClsCp002Pair[] = [];
  for (let index = 0; index < commonLabels.length; index += 2) {
    pairs.push({ left: commonLabels[index]!, right: commonLabels[index + 1]! });
  }
  const oddLabels = sample(directClassMemberLabels(contrastRelationId), 2, rng);
  pairs.push({ left: oddLabels[0]!, right: oddLabels[1]! });
  return {
    intendedRelationId,
    pairs,
    sourceFactIds: pairs.map((pair, index) => `CLS-CP002-CLASS-${index + 1}-${pair.left}-${pair.right}`),
    eligibleRelationIds: CLS_CP002_CLASS_RELATION_IDS,
    oddPairKind: "CLASS_CONTRAST",
  };
}

function stateFor(
  definition: ClsCp002PrototypeDefinition,
  seed: number,
  optionCount: 4 | 5,
  rng: Rng,
): SafeState {
  switch (definition.generationProfile) {
    case "CONTRAST_RELATION": return contrastState(definition, seed, optionCount, rng);
    case "LEXICAL_POLARITY": return lexicalPolarityState(seed, optionCount, rng);
    case "REVERSED_DIRECTION": return reversedState(seed, optionCount, rng);
    case "CATEGORY_SAFE_FALSE_PAIR": return falsePairState(seed, optionCount, rng);
    case "CLASS_PAIR_CONTRAST": return classState(seed, optionCount, rng);
  }
}

function difficultyFeatures(
  pairs: readonly ClsCp002Pair[],
  intendedRelationId: string,
  profile: ClsCp002PrototypeDefinition["generationProfile"],
  audit: ClsCp002AmbiguityAudit,
): ClsCp002DifficultyFeatures {
  const intended = relationDefinition(intendedRelationId);
  const classMultiMembershipCount = pairs.filter((pair) =>
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
    (pairs.length === 5 ? 1 : 0)
    + (intended.directionSensitive ? 1 : 0)
    + (profile === "REVERSED_DIRECTION" ? 2 : 0)
    + (profile === "CATEGORY_SAFE_FALSE_PAIR" ? 2 : 0)
    + (profile === "LEXICAL_POLARITY" ? 1 : 0)
    + Math.min(2, classMultiMembershipCount)
    + Math.max(0, audit.candidateSupports.length - 1)
    + Math.max(0, semanticDemand - 1);
  return {
    optionCount: pairs.length as 4 | 5,
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

function difficulty(score: number): ClsCp002Difficulty {
  if (score <= 2) return "EASY";
  if (score <= 5) return "MEDIUM";
  return "HARD";
}

function actualOddRelation(pair: ClsCp002Pair, intendedRelationId: string): string | null {
  return matchingRelationIds(pair, [
    ...ALL_FACT_RELATION_IDS,
    ...CLS_CP002_CLASS_RELATION_IDS,
  ])
    .filter((relationId) => relationId !== intendedRelationId)
    .sort((leftId, rightId) => {
      const left = relationDefinition(leftId);
      const right = relationDefinition(rightId);
      return right.qualityRank - left.qualityRank || leftId.localeCompare(rightId);
    })[0] ?? null;
}

function explanation(
  pairs: readonly ClsCp002Pair[],
  correctIndex: number,
  intendedRelationId: string,
  profile: ClsCp002PrototypeDefinition["generationProfile"],
): GeneratedClsCp002Question["explanation"] {
  const intended = relationDefinition(intendedRelationId);
  const common = pairs.filter((_, index) => index !== correctIndex).map(display);
  const oddPair = pairs[correctIndex]!;
  const odd = display(oddPair);
  const actual = actualOddRelation(oddPair, intendedRelationId);
  const difference = profile === "REVERSED_DIRECTION"
    ? `${odd} reverses the required direction.`
    : profile === "CATEGORY_SAFE_FALSE_PAIR"
      ? `${odd} uses the expected kinds of words, but they do not form the required relationship.`
      : actual
        ? `${odd} follows ${relationDefinition(actual).label}, so its relationship is different.`
        : `${odd} does not follow the common relationship.`;
  return {
    coreConcept: [`The common pairs follow this relation: ${intended.ruleStatement}`],
    stepByStep: [
      `${list(common)} follow the same relationship.`,
      difference,
      `Therefore, ${odd} is the odd pair.`,
    ],
    examSpeedShortcut: [
      intended.directionSensitive
        ? "Read each pair from left to right and describe the link in one short sentence."
        : "Name the meaning-link inside each pair, then compare it across the options.",
    ],
    commonTrapWarning: [
      profile === "REVERSED_DIRECTION"
        ? "Do not ignore word order; reversing a directional pair changes the relationship."
        : profile === "CATEGORY_SAFE_FALSE_PAIR"
          ? "Do not accept a pair only because both words look like the expected types; verify their actual link."
          : profile === "LEXICAL_POLARITY"
            ? "Do not confuse words with similar meanings and words with opposite meanings."
            : profile === "CLASS_PAIR_CONTRAST"
              ? "Check both words in every pair; matching only one word is not enough."
              : "Use one precise relation for all common pairs; a vague link can hide the odd pair.",
    ],
  };
}

function stem(seed: number): string {
  const stems = [
    "Choose the pair whose internal relationship differs from the other pairs.",
    "Most pairs follow one common relationship. Which pair does not?",
    "Select the odd pair based on the relationship between its two words.",
    "Which word-pair does not follow the relationship followed by the others?",
  ];
  return stems[seed % stems.length]!;
}

export function generateClsCp002MultilingualSafePrototype(
  prototypeId: ClsCp002PrototypeId,
  seed = 0,
  optionCount: 4 | 5 = 4,
): GeneratedClsCp002Question {
  if (!Number.isSafeInteger(seed) || seed < 0) throw new Error(`Invalid seed: ${seed}`);
  if (optionCount !== 4 && optionCount !== 5) throw new Error(`Invalid option count: ${optionCount}`);
  const definition = prototype(prototypeId);

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const attemptSeed = seed * MAX_ATTEMPTS + attempt;
    const rng = makeRng(attemptSeed, prototypeId);
    let state: SafeState;
    try {
      state = stateFor(definition, attemptSeed, optionCount, rng);
    } catch {
      continue;
    }
    const pairs = shuffled(state.pairs, rng);
    const options = pairs.map(display);
    if (new Set(options.map((option) => option.toLocaleLowerCase("en-IN"))).size !== optionCount) continue;
    const audit = auditClsCp002DisplayedPairs(pairs, state.eligibleRelationIds);
    if (audit.result !== "UNIQUE") continue;
    if (audit.winningRelationId !== state.intendedRelationId) continue;
    const correctIndex = audit.winningOutlierIndex!;
    const intended = relationDefinition(state.intendedRelationId);
    const features = difficultyFeatures(pairs, state.intendedRelationId, definition.generationProfile, audit);

    return {
      checkpointId: "CLS-CP-002",
      prototypeId,
      seed,
      task: "FIND_ODD_PAIR",
      generationProfile: definition.generationProfile,
      family: intended.family,
      stem: stem(seed + attempt),
      pairs,
      options,
      correctIndex,
      answer: options[correctIndex]!,
      intendedRelationId: state.intendedRelationId,
      intendedRelationLabel: intended.label,
      evidenceByOption: pairs.map((pair, index) => index === correctIndex
        ? `${display(pair)} does not follow ${intended.label}.`
        : `${display(pair)} follows ${intended.label}.`),
      ambiguityAudit: audit,
      difficulty: difficulty(features.score),
      difficultyFeatures: features,
      explanation: explanation(pairs, correctIndex, state.intendedRelationId, definition.generationProfile),
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
  }
  throw new Error(`${prototypeId}/${seed}/${optionCount} did not produce a multilingual-safe state`);
}
