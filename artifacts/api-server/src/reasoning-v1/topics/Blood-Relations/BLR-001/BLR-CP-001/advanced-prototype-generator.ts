import {
  allSupportedRelationFacts,
  generationDelta,
  generationLabel,
  generationRelationForDelta,
  type GenerationRelationId,
  type SupportedRelationFact,
} from "../foundation/family-analysis";
import { graphFromClues, solveRelationFromGraph } from "../foundation/graph-closure";
import { SeededRandom, stableHash } from "../foundation/prng";
import {
  defaultDistractorPool,
  relationLabel,
} from "../foundation/relation-ontology";
import type {
  BlrDifficulty,
  BlrRelationId,
  FamilyGraph,
} from "../foundation/types";
import { buildBlrCp001Distractors } from "./distractor-builder";
import { getBlrCp001AdvancedPrototypeContract } from "./advanced-prototype-contracts";
import {
  advancedScenariosFor,
  assignAdvancedNames,
  buildAdvancedStem,
  formatAdvancedClue,
  type BlrCp001AdvancedScenarioTemplate,
} from "./advanced-scenario-library";
import {
  claimAnswerKey,
  generationAnswerKey,
  pairAnswerKey,
  personAnswerKey,
  relationAnswerKey,
  relationClaimIsTrue,
  solveBlrCp001AdvancedPrompt,
} from "./advanced-prototype-solver";
import type {
  BlrCp001AdvancedOption,
  BlrCp001AdvancedPrototypeId,
  BlrCp001AdvancedStructuredPrompt,
  BlrOrderedPair,
  BlrRelationClaim,
  GeneratedBlrCp001AdvancedPrototypeQuestion,
} from "./advanced-prototype-types";

interface OptionCandidate {
  value: string;
  answerKey: string;
  errorLabel?: string;
}

const ALL_RELATIONS: readonly BlrRelationId[] = [
  "FATHER",
  "MOTHER",
  "SON",
  "DAUGHTER",
  "BROTHER",
  "SISTER",
  "HUSBAND",
  "WIFE",
  "GRANDFATHER",
  "GRANDMOTHER",
  "GRANDSON",
  "GRANDDAUGHTER",
  "UNCLE",
  "AUNT",
  "NEPHEW",
  "NIECE",
  "COUSIN",
  "FATHER_IN_LAW",
  "MOTHER_IN_LAW",
  "SON_IN_LAW",
  "DAUGHTER_IN_LAW",
] as const;

const GENERATION_RELATIONS: readonly GenerationRelationId[] = [
  "SAME_GENERATION",
  "ONE_GENERATION_ABOVE",
  "TWO_GENERATIONS_ABOVE",
  "ONE_GENERATION_BELOW",
  "TWO_GENERATIONS_BELOW",
] as const;

function uniqueByKey<T>(
  values: readonly T[],
  keyOf: (value: T) => string,
): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const value of values) {
    const key = keyOf(value);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(value);
  }
  return result;
}

function optionsWithCorrectAt(
  candidates: readonly OptionCandidate[],
  correctAnswerKey: string,
  correctIndex: number,
  random: SeededRandom,
): BlrCp001AdvancedOption[] {
  const deduped = uniqueByKey(candidates, (candidate) => candidate.answerKey);
  const correct = deduped.find(
    (candidate) => candidate.answerKey === correctAnswerKey,
  );
  if (!correct) {
    throw new Error(
      `Correct answer ${correctAnswerKey} is absent from option candidates.`,
    );
  }

  const wrong = random.shuffle(
    deduped.filter((candidate) => candidate.answerKey !== correctAnswerKey),
  );
  if (wrong.length < 3) {
    throw new Error("Advanced prototype requires at least three wrong options.");
  }

  const options: BlrCp001AdvancedOption[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    const candidate =
      index === correctIndex ? correct : wrong[wrongIndex++]!;
    options.push({
      value: candidate.value,
      answerKey: candidate.answerKey,
      isCorrect: index === correctIndex,
      ...(index === correctIndex
        ? {}
        : { errorLabel: candidate.errorLabel ?? "WRONG_OPTION" }),
    });
  }
  return options;
}

function relationClaimText(
  claim: BlrRelationClaim,
  names: Readonly<Record<string, string>>,
): string {
  return `${names[claim.subjectId]} is the ${relationLabel(claim.relationId).toLocaleLowerCase("en-IN")} of ${names[claim.referenceId]}.`;
}

function pairText(
  pair: BlrOrderedPair,
  names: Readonly<Record<string, string>>,
): string {
  return `${names[pair.subjectId]} – ${names[pair.referenceId]}`;
}

function buildFalseClaim(
  fact: SupportedRelationFact,
  graph: FamilyGraph,
  random: SeededRandom,
): BlrRelationClaim {
  const candidates = random.shuffle([
    ...defaultDistractorPool(fact.relationId),
    ...ALL_RELATIONS,
  ]);

  for (const relationId of candidates) {
    const claim: BlrRelationClaim = {
      subjectId: fact.subjectId,
      relationId,
      referenceId: fact.referenceId,
    };
    if (!relationClaimIsTrue(graph, claim)) return claim;
  }

  throw new Error("Unable to construct a false relation claim.");
}

function queryQuestionText(
  prompt: BlrCp001AdvancedStructuredPrompt,
): string {
  const names = prompt.personNames;
  const query = prompt.query;

  if (query.kind === "IDENTIFY_PERSON_BY_RELATION") {
    return `Who is the ${relationLabel(query.relationId).toLocaleLowerCase("en-IN")} of ${names[query.referenceId]}?`;
  }
  if (query.kind === "IDENTIFY_ORDERED_PAIR") {
    return `Which ordered pair has the first person as the ${relationLabel(query.relationId).toLocaleLowerCase("en-IN")} of the second person?`;
  }
  if (query.kind === "SELECT_RELATION_CLAIM") {
    return `Which of the following statements is ${query.targetTruth === "TRUE" ? "definitely true" : "false"}?`;
  }
  if (query.kind === "COMPARE_GENERATIONS") {
    return `What is ${names[query.subjectId]}'s generation position relative to ${names[query.referenceId]}?`;
  }
  return `How is ${names[query.subjectId]} related to ${names[query.referenceId]}?`;
}

function difficultyFor(
  prototypeId: BlrCp001AdvancedPrototypeId,
  pathLength: number | null,
  generationDifference: number | null,
  seed: number,
): BlrDifficulty {
  if (prototypeId === "BLR-CP001-PROT-GENERATION-COMPARISON") {
    if (
      generationDifference === 0 ||
      Math.abs(generationDifference ?? 0) === 1
    ) {
      return "EASY";
    }
    return seed % 3 === 0 ? "HARD" : "MEDIUM";
  }
  if (prototypeId === "BLR-CP001-PROT-BRANCHING-RELATION") {
    return "HARD";
  }
  if (prototypeId === "BLR-CP001-PROT-RELATION-CLAIM") {
    return seed % 3 === 0 ? "MEDIUM" : "HARD";
  }
  if ((pathLength ?? 1) <= 1) return "EASY";
  return seed % 4 === 0 ? "HARD" : "MEDIUM";
}

function explanationFor(
  prompt: BlrCp001AdvancedStructuredPrompt,
  graph: FamilyGraph,
  correctAnswerKey: string,
  correctValue: string,
): GeneratedBlrCp001AdvancedPrototypeQuestion["explanation"] {
  const names = prompt.personNames;
  const normalizedClues = prompt.clues.map((clue) =>
    formatAdvancedClue(clue, names),
  );
  const query = prompt.query;

  if (query.kind === "IDENTIFY_PERSON_BY_RELATION") {
    const personId = correctAnswerKey.replace("PERSON:", "");
    const solved = solveRelationFromGraph(graph, personId, query.referenceId);
    const pathNames = solved.path.personIds.map((id) => names[id] ?? id);
    return {
      ruleStatement:
        "Reconstruct the family, then find the only named person who has the requested relation to the reference person.",
      normalizedClues,
      queryPath: [
        pathNames.join(" → "),
        `${names[personId]} is the ${relationLabel(query.relationId).toLocaleLowerCase("en-IN")} of ${names[query.referenceId]}.`,
      ],
      conclusion: `Therefore, the required person is ${correctValue}.`,
      closestTrapRejection:
        "The other named people occupy a different branch, generation or relation direction.",
    };
  }

  if (query.kind === "IDENTIFY_ORDERED_PAIR") {
    const correctPair = query.candidatePairs.find(
      (pair) => pairAnswerKey(pair) === correctAnswerKey,
    )!;
    const solved = solveRelationFromGraph(
      graph,
      correctPair.subjectId,
      correctPair.referenceId,
    );
    const pathNames = solved.path.personIds.map((id) => names[id] ?? id);
    return {
      ruleStatement:
        "Check each ordered pair in the stated direction: the first person must have the requested relation to the second.",
      normalizedClues,
      queryPath: [
        pathNames.join(" → "),
        `${names[correctPair.subjectId]} is the ${relationLabel(query.relationId).toLocaleLowerCase("en-IN")} of ${names[correctPair.referenceId]}.`,
      ],
      conclusion: `Therefore, the correct ordered pair is ${correctValue}.`,
      closestTrapRejection:
        "Reversing a valid family pair changes the relation, so pair order cannot be ignored.",
    };
  }

  if (query.kind === "SELECT_RELATION_CLAIM") {
    const claim = query.claims.find(
      (entry) => claimAnswerKey(entry) === correctAnswerKey,
    )!;
    const truth = relationClaimIsTrue(graph, claim);
    let trace: string;

    if (truth) {
      const solved = solveRelationFromGraph(
        graph,
        claim.subjectId,
        claim.referenceId,
      );
      trace = solved.path.personIds.map((id) => names[id] ?? id).join(" → ");
    } else {
      try {
        const actual = solveRelationFromGraph(
          graph,
          claim.subjectId,
          claim.referenceId,
        );
        trace = `${names[claim.subjectId]}'s actual relation to ${names[claim.referenceId]} is ${relationLabel(actual.relationId).toLocaleLowerCase("en-IN")}, not ${relationLabel(claim.relationId).toLocaleLowerCase("en-IN")}.`;
      } catch {
        trace =
          "The displayed clues do not establish the claimed relation in that direction.";
      }
    }

    return {
      ruleStatement:
        "Validate every offered statement against the reconstructed family graph rather than judging it from wording alone.",
      normalizedClues,
      queryPath: [trace, `The selected statement is ${truth ? "true" : "false"}.`],
      conclusion: `Therefore, ${correctValue}`,
      closestTrapRejection:
        "A statement about the same two people may still be wrong when its direction, gender or generation is changed.",
    };
  }

  if (query.kind === "COMPARE_GENERATIONS") {
    const delta = generationDelta(
      graph,
      query.subjectId,
      query.referenceId,
    );
    const label = generationLabel(generationRelationForDelta(delta));
    const positionText =
      delta > 0
        ? `${Math.abs(delta)} generation${Math.abs(delta) === 1 ? "" : "s"} above`
        : delta < 0
          ? `${Math.abs(delta)} generation${Math.abs(delta) === 1 ? "" : "s"} below`
          : "in the same generation as";

    return {
      ruleStatement:
        "Place parents one generation above children, while spouses and siblings remain in the same generation.",
      normalizedClues,
      queryPath: [
        `${names[query.referenceId]} is used as the reference generation.`,
        `${names[query.subjectId]} is ${positionText} ${names[query.referenceId]}.`,
      ],
      conclusion: `Therefore, the answer is ${label.toLocaleLowerCase("en-IN")}.`,
      closestTrapRejection:
        "Do not count the number of names in the path; count only parent–child generation changes.",
    };
  }

  const solved = solveRelationFromGraph(
    graph,
    query.subjectId,
    query.referenceId,
  );
  const pathNames = solved.path.personIds.map((id) => names[id] ?? id);
  return {
    ruleStatement:
      "Build both family branches from their common parent and then trace the shortest valid kinship path.",
    normalizedClues,
    queryPath: [
      pathNames.join(" → "),
      `${names[query.subjectId]} is the ${relationLabel(solved.relationId).toLocaleLowerCase("en-IN")} of ${names[query.referenceId]}.`,
    ],
    conclusion: `Therefore, the answer is ${correctValue.toLocaleLowerCase("en-IN")}.`,
    closestTrapRejection:
      "Stopping at the parents confuses siblings with cousins; both child branches must be completed.",
  };
}

function buildPromptAndCandidates(
  prototypeId: BlrCp001AdvancedPrototypeId,
  template: BlrCp001AdvancedScenarioTemplate,
  names: Readonly<Record<string, string>>,
  random: SeededRandom,
  seed: number,
): {
  prompt: BlrCp001AdvancedStructuredPrompt;
  candidates: readonly OptionCandidate[];
  inferredSiblingRequired: boolean;
} {
  const graph = graphFromClues(template.clues, names);
  const facts = allSupportedRelationFacts(graph);

  if (prototypeId === "BLR-CP001-PROT-IDENTIFY-PERSON") {
    const grouped = new Map<string, SupportedRelationFact[]>();
    for (const fact of facts) {
      const key = `${fact.referenceId}:${fact.relationId}`;
      const entries = grouped.get(key) ?? [];
      entries.push(fact);
      grouped.set(key, entries);
    }

    const uniqueFacts = [...grouped.values()]
      .filter((entries) => entries.length === 1)
      .map((entries) => entries[0]!);
    const target = random.pick(uniqueFacts);
    const prompt: BlrCp001AdvancedStructuredPrompt = {
      clues: template.clues,
      personNames: names,
      query: {
        kind: "IDENTIFY_PERSON_BY_RELATION",
        referenceId: target.referenceId,
        relationId: target.relationId,
      },
    };
    const candidates = graph.persons
      .filter((person) => person.personId !== target.referenceId)
      .map<OptionCandidate>((person) => ({
        value: names[person.personId]!,
        answerKey: personAnswerKey(person.personId),
        errorLabel:
          person.personId === target.subjectId
            ? undefined
            : "WRONG_FAMILY_MEMBER",
      }));
    return { prompt, candidates, inferredSiblingRequired: false };
  }

  if (prototypeId === "BLR-CP001-PROT-IDENTIFY-PAIR") {
    const target = random.pick(facts);
    const correctPair: BlrOrderedPair = {
      subjectId: target.subjectId,
      referenceId: target.referenceId,
    };
    const wrongPairs = random.shuffle(
      facts
        .filter((fact) => fact.relationId !== target.relationId)
        .map((fact) => ({
          subjectId: fact.subjectId,
          referenceId: fact.referenceId,
        })),
    );
    const pairs = uniqueByKey(
      [correctPair, ...wrongPairs],
      pairAnswerKey,
    ).slice(0, 4);
    if (pairs.length < 4) {
      throw new Error("Pair prototype could not find four candidate pairs.");
    }

    const prompt: BlrCp001AdvancedStructuredPrompt = {
      clues: template.clues,
      personNames: names,
      query: {
        kind: "IDENTIFY_ORDERED_PAIR",
        relationId: target.relationId,
        candidatePairs: pairs,
      },
    };
    const candidates = pairs.map<OptionCandidate>((pair) => ({
      value: pairText(pair, names),
      answerKey: pairAnswerKey(pair),
      errorLabel:
        pairAnswerKey(pair) === pairAnswerKey(correctPair)
          ? undefined
          : "PAIR_HAS_DIFFERENT_RELATION",
    }));
    return { prompt, candidates, inferredSiblingRequired: false };
  }

  if (prototypeId === "BLR-CP001-PROT-RELATION-CLAIM") {
    const targetTruth = seed % 2 === 0 ? "TRUE" : "FALSE";
    const shuffledFacts = random.shuffle(facts);
    const trueClaims = uniqueByKey(
      shuffledFacts.map<BlrRelationClaim>((fact) => ({
        subjectId: fact.subjectId,
        relationId: fact.relationId,
        referenceId: fact.referenceId,
      })),
      claimAnswerKey,
    );
    const falseClaims = uniqueByKey(
      shuffledFacts.map((fact) => buildFalseClaim(fact, graph, random)),
      claimAnswerKey,
    );
    const claims =
      targetTruth === "TRUE"
        ? [trueClaims[0]!, ...falseClaims.slice(0, 3)]
        : [falseClaims[0]!, ...trueClaims.slice(0, 3)];

    const prompt: BlrCp001AdvancedStructuredPrompt = {
      clues: template.clues,
      personNames: names,
      query: {
        kind: "SELECT_RELATION_CLAIM",
        targetTruth,
        claims,
      },
    };
    const candidates = claims.map<OptionCandidate>((claim) => {
      const truth = relationClaimIsTrue(graph, claim);
      const correct = targetTruth === "TRUE" ? truth : !truth;
      return {
        value: relationClaimText(claim, names),
        answerKey: claimAnswerKey(claim),
        errorLabel: correct
          ? undefined
          : targetTruth === "TRUE"
            ? "CLAIM_NOT_ENTAILED"
            : "CLAIM_IS_TRUE",
      };
    });
    return { prompt, candidates, inferredSiblingRequired: false };
  }

  if (prototypeId === "BLR-CP001-PROT-GENERATION-COMPARISON") {
    const desired =
      GENERATION_RELATIONS[
        ((seed % GENERATION_RELATIONS.length) + GENERATION_RELATIONS.length) %
          GENERATION_RELATIONS.length
      ]!;
    const generationPairs: {
      pair: BlrOrderedPair;
      relationId: GenerationRelationId;
    }[] = [];

    for (const subject of graph.persons) {
      for (const reference of graph.persons) {
        if (subject.personId === reference.personId) continue;
        try {
          const delta = generationDelta(
            graph,
            subject.personId,
            reference.personId,
          );
          generationPairs.push({
            pair: {
              subjectId: subject.personId,
              referenceId: reference.personId,
            },
            relationId: generationRelationForDelta(delta),
          });
        } catch {
          // Deltas outside the bounded prototype are skipped.
        }
      }
    }

    const matching = generationPairs.filter(
      (entry) => entry.relationId === desired,
    );
    const target = random.pick(matching.length > 0 ? matching : generationPairs);
    const prompt: BlrCp001AdvancedStructuredPrompt = {
      clues: template.clues,
      personNames: names,
      query: {
        kind: "COMPARE_GENERATIONS",
        subjectId: target.pair.subjectId,
        referenceId: target.pair.referenceId,
      },
    };
    const candidates = GENERATION_RELATIONS.map<OptionCandidate>(
      (relationId) => ({
        value: generationLabel(relationId),
        answerKey: generationAnswerKey(relationId),
        errorLabel:
          relationId === target.relationId
            ? undefined
            : relationId === "SAME_GENERATION"
              ? "SAME_GENERATION_CONFUSION"
              : relationId.includes("ABOVE") !==
                  target.relationId.includes("ABOVE")
                ? "GENERATION_DIRECTION_REVERSED"
                : "GENERATION_OFF_BY_ONE",
      }),
    );
    return { prompt, candidates, inferredSiblingRequired: false };
  }

  const branchingQuery = template.branchingQuery;
  if (!branchingQuery) {
    throw new Error(`${template.scenarioId} does not provide a branching query.`);
  }
  const solved = solveRelationFromGraph(
    graph,
    branchingQuery.subjectId,
    branchingQuery.referenceId,
  );
  if (solved.relationId !== branchingQuery.expectedRelationId) {
    throw new Error(
      `${template.scenarioId} expected ${branchingQuery.expectedRelationId}, received ${solved.relationId}.`,
    );
  }

  let reverseRelationId: BlrRelationId | null = null;
  try {
    reverseRelationId = solveRelationFromGraph(
      graph,
      branchingQuery.referenceId,
      branchingQuery.subjectId,
    ).relationId;
  } catch {
    reverseRelationId = null;
  }
  const distractors = buildBlrCp001Distractors(
    solved.relationId,
    reverseRelationId,
    random,
  );
  const prompt: BlrCp001AdvancedStructuredPrompt = {
    clues: template.clues,
    personNames: names,
    query: {
      kind: "SOLVE_BRANCHING_RELATION",
      subjectId: branchingQuery.subjectId,
      referenceId: branchingQuery.referenceId,
    },
  };
  const candidates: OptionCandidate[] = [
    {
      value: relationLabel(solved.relationId),
      answerKey: relationAnswerKey(solved.relationId),
    },
    ...distractors.map((distractor) => ({
      value: relationLabel(distractor.relationId),
      answerKey: relationAnswerKey(distractor.relationId),
      errorLabel: distractor.errorLabel,
    })),
  ];

  return {
    prompt,
    candidates,
    inferredSiblingRequired:
      graph.siblingEdges.length === 0 && solved.path.steps.includes("SIBLING"),
  };
}

export function generateBlrCp001AdvancedPrototypeQuestion(
  prototypeId: BlrCp001AdvancedPrototypeId,
  seed = 0,
): GeneratedBlrCp001AdvancedPrototypeQuestion {
  const contract = getBlrCp001AdvancedPrototypeContract(prototypeId);
  const random = new SeededRandom(
    seed ^ Number.parseInt(stableHash([prototypeId]), 16),
  );
  const template = random.pick(advancedScenariosFor(prototypeId));
  const names = assignAdvancedNames(template, random);
  const built = buildPromptAndCandidates(
    prototypeId,
    template,
    names,
    random,
    seed,
  );
  const independent = solveBlrCp001AdvancedPrompt(built.prompt);
  const correctIndex = ((Math.trunc(seed) % 4) + 4) % 4;
  const optionRandom = new SeededRandom(
    seed + Number.parseInt(stableHash([template.scenarioId, "options"]), 16),
  );
  const options = optionsWithCorrectAt(
    built.candidates,
    independent.answerKey,
    correctIndex,
    optionRandom,
  );
  const correctValue = options[correctIndex]!.value;
  const graph = graphFromClues(template.clues, names);
  const stemRandom = new SeededRandom(
    seed + Number.parseInt(stableHash([template.scenarioId, "stem"]), 16),
  );
  const stem = buildAdvancedStem(
    template.clues,
    names,
    queryQuestionText(built.prompt),
    stemRandom,
  );
  const targetTruth =
    built.prompt.query.kind === "SELECT_RELATION_CLAIM"
      ? built.prompt.query.targetTruth
      : null;
  const fingerprintParts: (string | number)[] = [
    prototypeId,
    template.scenarioId,
    ...template.clues.flatMap((clue) => [
      clue.subjectId,
      clue.relationId,
      clue.referenceId,
    ]),
    built.prompt.query.kind,
    independent.answerKey,
  ];

  return {
    packageId: "BLR-001",
    checkpointId: "BLR-CP-001",
    prototypeId,
    permanentQlId: null,
    prototypeOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    ruleId: contract.ruleId,
    seed,
    locale: "en-IN",
    difficulty: difficultyFor(
      prototypeId,
      independent.pathLength,
      independent.generationDelta,
      seed,
    ),
    renderer:
      prototypeId === "BLR-CP001-PROT-GENERATION-COMPARISON"
        ? "STRUCTURED_TEXT"
        : "FAMILY_TREE_EXPLANATION",
    answerType: contract.answerType,
    stem,
    structuredPrompt: built.prompt,
    options,
    correctIndex,
    explanation: explanationFor(
      built.prompt,
      graph,
      independent.answerKey,
      correctValue,
    ),
    metadata: {
      runtimeVersion: "blr-cp001-advanced-prototype-v1",
      taskKind: contract.taskKind,
      scenarioId: template.scenarioId,
      correctAnswerKey: independent.answerKey,
      hiddenFingerprint: stableHash(fingerprintParts),
      clueCount: template.clues.length,
      personCount: independent.graphPersonCount,
      graphEdgeCount: independent.graphEdgeCount,
      pathLength: independent.pathLength,
      generationDelta: independent.generationDelta,
      targetTruth,
      inferredSiblingRequired: built.inferredSiblingRequired,
      ambiguityAccepted: true,
      independentSolverAgreed: true,
      familyGraphValid: true,
      distractorErrorLabels: options
        .filter((option) => !option.isCorrect)
        .map((option) => option.errorLabel!),
    },
  };
}
