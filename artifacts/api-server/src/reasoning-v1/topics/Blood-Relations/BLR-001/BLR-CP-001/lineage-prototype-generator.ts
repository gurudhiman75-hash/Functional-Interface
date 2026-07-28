import { graphFromClues } from "../foundation/graph-closure";
import { SeededRandom, stableHash } from "../foundation/prng";
import { directRelationSubjectGender, relationLabel } from "../foundation/relation-ontology";
import type {
  BlrDifficulty,
  BlrGender,
  DirectRelationClue,
  FamilyGraph,
} from "../foundation/types";
import { getBlrCp001LineagePrototypeContract } from "./lineage-prototype-contracts";
import {
  assignLineageNames,
  buildLineageStem,
  formatLineageClue,
  lineageScenariosFor,
  type BlrCp001LineageScenarioTemplate,
} from "./lineage-scenario-library";
import {
  exactLineageAnswerKey,
  exactLineageRelationLabel,
  personByGenderAnswerKey,
  solveBlrCp001LineagePrompt,
  solveExactLineageRelationFromGraph,
  swapExactLineageFamily,
  swapExactLineageGender,
  swapExactLineageSide,
} from "./lineage-prototype-solver";
import type {
  BlrCp001LineageOption,
  BlrCp001LineagePrototypeId,
  BlrCp001LineageStructuredPrompt,
  GeneratedBlrCp001LineagePrototypeQuestion,
} from "./lineage-prototype-types";

interface OptionCandidate {
  value: string;
  answerKey: string;
  errorLabel?: string;
}

function optionsWithCorrectAt(
  candidates: readonly OptionCandidate[],
  correctAnswerKey: string,
  correctIndex: number,
  random: SeededRandom,
): BlrCp001LineageOption[] {
  const unique = [
    ...new Map(candidates.map((candidate) => [candidate.answerKey, candidate])).values(),
  ];
  const correct = unique.find((candidate) => candidate.answerKey === correctAnswerKey);
  if (!correct) throw new Error(`Missing correct option ${correctAnswerKey}.`);
  const wrong = random.shuffle(
    unique.filter((candidate) => candidate.answerKey !== correctAnswerKey),
  );
  if (wrong.length < 3) throw new Error("Lineage prototype requires three wrong options.");

  const options: BlrCp001LineageOption[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    const candidate = index === correctIndex ? correct : wrong[wrongIndex++]!;
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

function genderEvidence(
  personId: string,
  gender: Exclude<BlrGender, "UNKNOWN">,
  clues: readonly DirectRelationClue[],
  names: Readonly<Record<string, string>>,
): string {
  const subjectClue = clues.find(
    (clue) =>
      clue.subjectId === personId &&
      directRelationSubjectGender(clue.relationId) === gender,
  );
  if (subjectClue) return formatLineageClue(subjectClue, names);

  const spouseReference = clues.find(
    (clue) =>
      clue.referenceId === personId &&
      ((clue.relationId === "HUSBAND" && gender === "FEMALE") ||
        (clue.relationId === "WIFE" && gender === "MALE")),
  );
  if (spouseReference) {
    return `${formatLineageClue(spouseReference, names)} Therefore, ${names[personId]} is ${gender.toLocaleLowerCase("en-IN")}.`;
  }

  throw new Error(`No displayed clue establishes ${names[personId]}'s gender.`);
}

function difficultyFor(
  prototypeId: BlrCp001LineagePrototypeId,
  exactBroadRelationId: string | null,
  seed: number,
): BlrDifficulty {
  if (prototypeId === "BLR-CP001-PROT-IDENTIFY-PERSON-BY-GENDER") {
    return seed % 4 === 0 ? "MEDIUM" : "EASY";
  }
  if (exactBroadRelationId === "UNCLE" || exactBroadRelationId === "AUNT") {
    return seed % 3 === 0 ? "MEDIUM" : "HARD";
  }
  return seed % 4 === 0 ? "HARD" : "MEDIUM";
}

function buildGenderPromptAndCandidates(
  template: BlrCp001LineageScenarioTemplate,
  names: Readonly<Record<string, string>>,
  graph: FamilyGraph,
  random: SeededRandom,
  seed: number,
): {
  prompt: BlrCp001LineageStructuredPrompt;
  candidates: readonly OptionCandidate[];
} {
  const targetGender: Exclude<BlrGender, "UNKNOWN"> =
    seed % 2 === 0 ? "MALE" : "FEMALE";
  const targets = graph.persons.filter((person) => person.gender === targetGender);
  const opposite = graph.persons.filter(
    (person) =>
      person.gender !== "UNKNOWN" && person.gender !== targetGender,
  );
  if (targets.length === 0 || opposite.length < 3) {
    throw new Error(`${template.scenarioId} lacks balanced known genders.`);
  }

  const target = random.pick(targets);
  const wrong = random.shuffle(opposite).slice(0, 3);
  const candidatePersonIds = random.shuffle([
    target.personId,
    ...wrong.map((person) => person.personId),
  ]);
  const prompt: BlrCp001LineageStructuredPrompt = {
    clues: template.clues,
    personNames: names,
    query: {
      kind: "IDENTIFY_PERSON_BY_GENDER",
      targetGender,
      candidatePersonIds,
    },
  };
  const candidates = candidatePersonIds.map<OptionCandidate>((personId) => ({
    value: names[personId]!,
    answerKey: personByGenderAnswerKey(personId),
    errorLabel:
      personId === target.personId ? undefined : "OPPOSITE_GENDER",
  }));
  return { prompt, candidates };
}

function buildExactPromptAndCandidates(
  template: BlrCp001LineageScenarioTemplate,
  names: Readonly<Record<string, string>>,
  graph: FamilyGraph,
): {
  prompt: BlrCp001LineageStructuredPrompt;
  candidates: readonly OptionCandidate[];
} {
  const query = template.exactQuery;
  if (!query) throw new Error(`${template.scenarioId} lacks an exact-lineage query.`);
  const solved = solveExactLineageRelationFromGraph(
    graph,
    query.subjectId,
    query.referenceId,
  );
  if (solved.relationId !== query.expectedRelationId) {
    throw new Error(
      `${template.scenarioId} expected ${query.expectedRelationId}, received ${solved.relationId}.`,
    );
  }

  const distractors = [
    {
      relationId: swapExactLineageSide(solved.relationId),
      errorLabel: "MATERNAL_PATERNAL_SWAP",
    },
    {
      relationId: swapExactLineageGender(solved.relationId),
      errorLabel: "WRONG_RELATIVE_GENDER",
    },
    {
      relationId: swapExactLineageFamily(solved.relationId),
      errorLabel: "WRONG_GENERATION_OR_BRANCH",
    },
  ] as const;
  const prompt: BlrCp001LineageStructuredPrompt = {
    clues: template.clues,
    personNames: names,
    query: {
      kind: "SOLVE_EXACT_LINEAGE_RELATION",
      subjectId: query.subjectId,
      referenceId: query.referenceId,
    },
  };
  const candidates: OptionCandidate[] = [
    {
      value: exactLineageRelationLabel(solved.relationId),
      answerKey: exactLineageAnswerKey(solved.relationId),
    },
    ...distractors.map((distractor) => ({
      value: exactLineageRelationLabel(distractor.relationId),
      answerKey: exactLineageAnswerKey(distractor.relationId),
      errorLabel: distractor.errorLabel,
    })),
  ];
  return { prompt, candidates };
}

function explanationFor(
  prompt: BlrCp001LineageStructuredPrompt,
  graph: FamilyGraph,
  correctValue: string,
): GeneratedBlrCp001LineagePrototypeQuestion["explanation"] {
  const names = prompt.personNames;
  const normalizedClues = prompt.clues.map((clue) =>
    formatLineageClue(clue, names),
  );

  if (prompt.query.kind === "IDENTIFY_PERSON_BY_GENDER") {
    const query = prompt.query;
    const matchedId = query.candidatePersonIds.find((personId) => {
      const person = graph.persons.find((entry) => entry.personId === personId);
      return person?.gender === query.targetGender;
    })!;
    const evidence = genderEvidence(
      matchedId,
      query.targetGender,
      prompt.clues,
      names,
    );
    return {
      ruleStatement:
        "Use gender-bearing kinship words and spouse direction to determine each offered person's gender.",
      normalizedClues,
      queryPath: [
        evidence,
        `Among the four offered people, only ${names[matchedId]} is ${query.targetGender.toLocaleLowerCase("en-IN")}.`,
      ],
      conclusion: `Therefore, the required person is ${correctValue}.`,
      closestTrapRejection:
        "A person's name must not be used to guess gender; only the stated family relations are authoritative.",
    };
  }

  const solved = solveExactLineageRelationFromGraph(
    graph,
    prompt.query.subjectId,
    prompt.query.referenceId,
  );
  const pathNames = solved.path.personIds.map((personId) => names[personId] ?? personId);
  const lineageParent = graph.persons.find(
    (person) => person.personId === solved.lineageParentId,
  )!;
  return {
    ruleStatement:
      "First solve the broad relation, then use the intervening parent's gender to decide whether the branch is paternal or maternal.",
    normalizedClues,
    queryPath: [
      pathNames.join(" → "),
      `${names[solved.lineageParentId]} is ${lineageParent.gender.toLocaleLowerCase("en-IN")}, so this is the ${solved.lineageSide.toLocaleLowerCase("en-IN")} side.`,
      `The broad relation is ${relationLabel(solved.broadRelationId).toLocaleLowerCase("en-IN")}.`,
    ],
    conclusion: `Therefore, the exact relation is ${correctValue.toLocaleLowerCase("en-IN")}.`,
    closestTrapRejection:
      "Choosing the opposite side ignores whether the connecting parent is the father or the mother of the reference person.",
  };
}

export function generateBlrCp001LineagePrototypeQuestion(
  prototypeId: BlrCp001LineagePrototypeId,
  seed = 0,
): GeneratedBlrCp001LineagePrototypeQuestion {
  const contract = getBlrCp001LineagePrototypeContract(prototypeId);
  const scenarios = lineageScenariosFor(prototypeId);
  const scenarioIndex =
    ((Math.trunc(seed) % scenarios.length) + scenarios.length) % scenarios.length;
  const template = scenarios[scenarioIndex]!;
  const random = new SeededRandom(
    seed ^ Number.parseInt(stableHash([prototypeId]), 16),
  );
  const names = assignLineageNames(template, random);
  const graph = graphFromClues(template.clues, names);
  const built =
    prototypeId === "BLR-CP001-PROT-IDENTIFY-PERSON-BY-GENDER"
      ? buildGenderPromptAndCandidates(template, names, graph, random, seed)
      : buildExactPromptAndCandidates(template, names, graph);
  const independent = solveBlrCp001LineagePrompt(built.prompt);
  const correctIndex = ((Math.trunc(seed) % 4) + 4) % 4;
  const optionRandom = new SeededRandom(
    seed + Number.parseInt(stableHash([template.scenarioId, "lineage-options"]), 16),
  );
  const options = optionsWithCorrectAt(
    built.candidates,
    independent.answerKey,
    correctIndex,
    optionRandom,
  );
  const correctValue = options[correctIndex]!.value;
  const questionText =
    built.prompt.query.kind === "IDENTIFY_PERSON_BY_GENDER"
      ? `Who among the following is ${built.prompt.query.targetGender.toLocaleLowerCase("en-IN")}?`
      : `How is ${names[built.prompt.query.subjectId]} exactly related to ${names[built.prompt.query.referenceId]}?`;
  const stemRandom = new SeededRandom(
    seed + Number.parseInt(stableHash([template.scenarioId, "lineage-stem"]), 16),
  );
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
      independent.broadRelationId,
      seed,
    ),
    renderer:
      prototypeId === "BLR-CP001-PROT-EXACT-LINEAGE-RELATION"
        ? "FAMILY_TREE_EXPLANATION"
        : "STRUCTURED_TEXT",
    answerType: contract.answerType,
    stem: buildLineageStem(
      template.clues,
      names,
      questionText,
      stemRandom,
    ),
    structuredPrompt: built.prompt,
    options,
    correctIndex,
    explanation: explanationFor(built.prompt, graph, correctValue),
    metadata: {
      runtimeVersion: "blr-cp001-lineage-prototype-v1",
      taskKind: contract.taskKind,
      scenarioId: template.scenarioId,
      correctAnswerKey: independent.answerKey,
      hiddenFingerprint: stableHash(fingerprintParts),
      clueCount: template.clues.length,
      personCount: independent.graphPersonCount,
      graphEdgeCount: independent.graphEdgeCount,
      pathLength: independent.pathLength,
      targetGender: independent.targetGender,
      lineageSide: independent.lineageSide,
      broadRelationId: independent.broadRelationId,
      exactLineageRelationId: independent.exactLineageRelationId,
      ambiguityAccepted: true,
      independentSolverAgreed: true,
      familyGraphValid: true,
      distractorErrorLabels: options
        .filter((option) => !option.isCorrect)
        .map((option) => option.errorLabel!),
    },
  };
}
