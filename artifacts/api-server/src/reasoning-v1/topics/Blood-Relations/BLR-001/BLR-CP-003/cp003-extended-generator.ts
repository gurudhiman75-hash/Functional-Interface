import { allSupportedRelationFacts } from "../foundation/family-analysis";
import { clueToNormalizedText, solveRelationFromGraph } from "../foundation/graph-closure";
import { assignNamesForClues } from "../foundation/name-registry";
import { SeededRandom, stableHash } from "../foundation/prng";
import { relationLabel } from "../foundation/relation-ontology";
import type { FamilyGraph } from "../foundation/types";
import { BLR_CP003_EXTENDED_SCENARIO } from "./cp003-extended-scenario";
import {
  blrCp003ExtendedSemanticKey,
  proveEveryBlrCp003ExtendedClueContributes,
  solveBlrCp003ExtendedFromClues,
} from "./cp003-extended-solver";
import type {
  BlrCp003ExtendedAnswer,
  BlrCp003ExtendedOption,
  BlrCp003ExtendedQuestionSpec,
  GeneratedBlrCp003ExtendedGroup,
  GeneratedBlrCp003ExtendedQuestion,
} from "./cp003-extended-types";

function pairKey(personAId: string, personBId: string): string {
  return [personAId, personBId].sort().join("::");
}

function setKey(personIds: readonly string[]): string {
  return [...personIds].sort().join("::");
}

function relationPhrase(relationId: string): string {
  return relationLabel(relationId as Parameters<typeof relationLabel>[0]).toLocaleLowerCase(
    "en-IN",
  );
}

function sharedPrompt(names: Readonly<Record<string, string>>): string {
  const statements = BLR_CP003_EXTENDED_SCENARIO.clues.map(
    (clue) =>
      `${names[clue.subjectId]} is the ${relationPhrase(clue.relationId)} of ${names[clue.referenceId]}.`,
  );
  return [
    "Read the following information carefully and answer the questions that follow.",
    statements.join(" "),
  ].join("\n\n");
}

function shuffleOptions(
  random: SeededRandom,
  entries: readonly Omit<BlrCp003ExtendedOption, "isCorrect">[],
  correctKey: string,
): { options: BlrCp003ExtendedOption[]; correctIndex: number } {
  const unique = new Map(entries.map((entry) => [entry.semanticKey, entry]));
  if (unique.size !== 4) {
    throw new Error(`CP-003 extended options require four unique semantics, found ${unique.size}.`);
  }
  const options = random.shuffle([...unique.values()]).map((entry) => ({
    ...entry,
    isCorrect: entry.semanticKey === correctKey,
  }));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0 || options.filter((option) => option.isCorrect).length !== 1) {
    throw new Error("CP-003 extended options do not have exactly one correct answer.");
  }
  return { options, correctIndex };
}

function personOptions(
  answer: Extract<BlrCp003ExtendedAnswer, { kind: "PERSON" }>,
  graph: FamilyGraph,
  names: Readonly<Record<string, string>>,
  random: SeededRandom,
): { options: BlrCp003ExtendedOption[]; correctIndex: number } {
  const distractors = random
    .shuffle(graph.persons.map((person) => person.personId).filter((id) => id !== answer.personId))
    .slice(0, 3);
  return shuffleOptions(
    random,
    [answer.personId, ...distractors].map((personId) => ({
      text: names[personId]!,
      semanticKey: `PERSON:${personId}`,
      errorLabel: personId === answer.personId ? undefined : "WRONG_FAMILY_MEMBER",
    })),
    blrCp003ExtendedSemanticKey(answer),
  );
}

function isSiblingPair(graph: FamilyGraph, personAId: string, personBId: string): boolean {
  try {
    const forward = solveRelationFromGraph(graph, personAId, personBId).relationId;
    const reverse = solveRelationFromGraph(graph, personBId, personAId).relationId;
    return (
      ["BROTHER", "SISTER"].includes(forward) &&
      ["BROTHER", "SISTER"].includes(reverse)
    );
  } catch {
    return false;
  }
}

function pairOptions(
  answer: Extract<BlrCp003ExtendedAnswer, { kind: "PAIR" }>,
  graph: FamilyGraph,
  names: Readonly<Record<string, string>>,
  random: SeededRandom,
  pairKind: "SIBLING_PAIR" | "PARENT_CHILD_PAIR",
): { options: BlrCp003ExtendedOption[]; correctIndex: number } {
  const correctKey = pairKey(answer.personIds[0], answer.personIds[1]);
  const people = graph.persons.map((person) => person.personId);
  const candidates: [string, string][] = [];
  for (let first = 0; first < people.length; first += 1) {
    for (let second = first + 1; second < people.length; second += 1) {
      const personAId = people[first]!;
      const personBId = people[second]!;
      const key = pairKey(personAId, personBId);
      if (key === correctKey) continue;
      const isAnotherCorrectType =
        pairKind === "SIBLING_PAIR"
          ? isSiblingPair(graph, personAId, personBId)
          : graph.parentEdges.some(
              (edge) =>
                pairKey(edge.parentId, edge.childId) === pairKey(personAId, personBId),
            );
      if (!isAnotherCorrectType) candidates.push([personAId, personBId]);
    }
  }
  const selected = random.shuffle(candidates).slice(0, 3);
  if (selected.length !== 3) throw new Error(`No adequate ${pairKind} distractor pool.`);
  const pairs: readonly [string, string][] = [
    [answer.personIds[0], answer.personIds[1]],
    ...selected,
  ];
  return shuffleOptions(
    random,
    pairs.map(([personAId, personBId]) => ({
      text: `${names[personAId]} and ${names[personBId]}`,
      semanticKey: `PAIR:${pairKey(personAId, personBId)}`,
      errorLabel:
        pairKey(personAId, personBId) === correctKey
          ? undefined
          : pairKind === "SIBLING_PAIR"
            ? "NON_SIBLING_PAIR"
            : "NON_PARENT_CHILD_PAIR",
    })),
    blrCp003ExtendedSemanticKey(answer),
  );
}

function falseClaimOptions(
  answer: Extract<BlrCp003ExtendedAnswer, { kind: "CLAIM" }>,
  graph: FamilyGraph,
  names: Readonly<Record<string, string>>,
  random: SeededRandom,
): { options: BlrCp003ExtendedOption[]; correctIndex: number } {
  const falseKey = blrCp003ExtendedSemanticKey(answer);
  const trueFacts = random
    .shuffle(
      allSupportedRelationFacts(graph).filter(
        (fact) =>
          `CLAIM:${fact.subjectId}:${fact.relationId}:${fact.referenceId}` !== falseKey,
      ),
    )
    .slice(0, 3);
  if (trueFacts.length !== 3) throw new Error("Not enough true claims for false-claim options.");
  const entries: Omit<BlrCp003ExtendedOption, "isCorrect">[] = [
    {
      text: `${names[answer.subjectId]} is the ${relationPhrase(answer.relationId)} of ${names[answer.referenceId]}.`,
      semanticKey: falseKey,
    },
    ...trueFacts.map((fact) => ({
      text: `${names[fact.subjectId]} is the ${relationPhrase(fact.relationId)} of ${names[fact.referenceId]}.`,
      semanticKey: `CLAIM:${fact.subjectId}:${fact.relationId}:${fact.referenceId}`,
      errorLabel: "TRUE_STATEMENT_SELECTED_AS_FALSE",
    })),
  ];
  return shuffleOptions(random, entries, falseKey);
}

function memberSetOptions(
  answer: Extract<BlrCp003ExtendedAnswer, { kind: "PERSON_SET" }>,
  graph: FamilyGraph,
  names: Readonly<Record<string, string>>,
  random: SeededRandom,
): { options: BlrCp003ExtendedOption[]; correctIndex: number } {
  const correctIds = [...answer.personIds].sort();
  const outsiders = graph.persons
    .map((person) => person.personId)
    .filter((personId) => !correctIds.includes(personId));
  if (correctIds.length < 2 || outsiders.length < 1) {
    throw new Error("Member-set options require at least two matches and one outsider.");
  }
  const outsider = random.pick(outsiders);
  const sets = [
    correctIds,
    correctIds.slice(0, -1),
    [...correctIds.slice(0, -1), outsider].sort(),
    [...correctIds, outsider].sort(),
  ];
  return shuffleOptions(
    random,
    sets.map((personIds) => ({
      text: personIds.map((personId) => names[personId]).join(" and "),
      semanticKey: `PERSON_SET:${setKey(personIds)}`,
      errorLabel:
        setKey(personIds) === setKey(correctIds)
          ? undefined
          : personIds.length < correctIds.length
            ? "OMITTED_MATCHING_MEMBER"
            : personIds.length > correctIds.length
              ? "INCLUDED_NON_MATCHING_MEMBER"
              : "REPLACED_MATCHING_MEMBER",
    })),
    blrCp003ExtendedSemanticKey(answer),
  );
}

function buildQuestion(
  spec: BlrCp003ExtendedQuestionSpec,
  answer: BlrCp003ExtendedAnswer,
  index: number,
  graph: FamilyGraph,
  names: Readonly<Record<string, string>>,
  normalizedClues: readonly string[],
  random: SeededRandom,
): GeneratedBlrCp003ExtendedQuestion {
  let stem: string;
  let built: { options: BlrCp003ExtendedOption[]; correctIndex: number };
  let decisiveTrace: string[];
  let conclusion: string;
  let closestTrapRejection: string;

  switch (spec.kind) {
    case "IDENTIFY_PERSON": {
      if (answer.kind !== "PERSON") throw new Error("Identify-person answer mismatch.");
      stem = `Who is the ${relationPhrase(spec.relationId)} of ${names[spec.referenceId]}?`;
      built = personOptions(answer, graph, names, random);
      decisiveTrace = [
        `Trace every member's relation to ${names[spec.referenceId]}.`,
        `Only ${names[answer.personId]} satisfies ${relationPhrase(spec.relationId)}.`,
      ];
      conclusion = `${names[answer.personId]} is the required person.`;
      closestTrapRejection = "Do not choose a nearby generation or reverse the relation direction.";
      break;
    }
    case "SIBLING_PAIR": {
      if (answer.kind !== "PAIR") throw new Error("Sibling-pair answer mismatch.");
      stem = "Which of the following pairs consists of siblings?";
      built = pairOptions(answer, graph, names, random, "SIBLING_PAIR");
      decisiveTrace = [
        `${names[answer.personIds[0]]} and ${names[answer.personIds[1]]} share the modelled parent.`,
      ];
      conclusion = `${names[answer.personIds[0]]} and ${names[answer.personIds[1]]} are siblings.`;
      closestTrapRejection = "Being in the same generation does not by itself make two people siblings.";
      break;
    }
    case "PARENT_CHILD_PAIR": {
      if (answer.kind !== "PAIR") throw new Error("Parent-child answer mismatch.");
      stem = "Which of the following pairs consists of a parent and child?";
      built = pairOptions(answer, graph, names, random, "PARENT_CHILD_PAIR");
      decisiveTrace = [
        `${names[spec.parentId]} is directly placed as a parent of ${names[spec.childId]}.`,
      ];
      conclusion = `${names[spec.parentId]} and ${names[spec.childId]} form the parent–child pair.`;
      closestTrapRejection = "Do not substitute a grandparent–grandchild or sibling pair.";
      break;
    }
    case "FALSE_CLAIM": {
      if (answer.kind !== "CLAIM") throw new Error("False-claim answer mismatch.");
      stem = "Which of the following statements is definitely false?";
      built = falseClaimOptions(answer, graph, names, random);
      const actual = solveRelationFromGraph(
        graph,
        answer.subjectId,
        answer.referenceId,
      ).relationId;
      decisiveTrace = [
        `${names[answer.subjectId]} is actually the ${relationPhrase(actual)} of ${names[answer.referenceId]}.`,
      ];
      conclusion = `Therefore, the statement calling ${names[answer.subjectId]} the ${relationPhrase(answer.relationId)} of ${names[answer.referenceId]} is false.`;
      closestTrapRejection = "The other statements are verified directly from the reconstructed family graph.";
      break;
    }
    case "MEMBER_SET": {
      if (answer.kind !== "PERSON_SET") throw new Error("Member-set answer mismatch.");
      stem = `Which option lists all the ${relationPhrase(spec.relationId)}s of ${names[spec.referenceId]}?`;
      built = memberSetOptions(answer, graph, names, random);
      decisiveTrace = answer.personIds.map(
        (personId) => `${names[personId]} satisfies the requested relation.`,
      );
      conclusion = `${answer.personIds.map((personId) => names[personId]).join(" and ")} form the complete set.`;
      closestTrapRejection = "The answer must include every matching member and no non-matching member.";
      break;
    }
  }

  return {
    itemId: `${BLR_CP003_EXTENDED_SCENARIO.scenarioId}-Q${String(index + 1).padStart(2, "0")}`,
    prototypeId: spec.prototypeId,
    permanentQlId: null,
    prototypeOnly: true,
    stem,
    options: built.options,
    correctIndex: built.correctIndex,
    answer,
    explanation: {
      normalizedClues,
      decisiveTrace,
      conclusion,
      closestTrapRejection,
    },
    metadata: {
      hiddenGraphAnswerAgreed: true,
      uniqueAnswer: true,
      optionSemanticsUnique: true,
    },
  };
}

export function generateBlrCp003ExtendedGroup(
  seed: number,
): GeneratedBlrCp003ExtendedGroup {
  const random = new SeededRandom(seed);
  const names = assignNamesForClues(BLR_CP003_EXTENDED_SCENARIO.clues, random);
  const solved = solveBlrCp003ExtendedFromClues(
    BLR_CP003_EXTENDED_SCENARIO,
    names,
  );
  if (
    !proveEveryBlrCp003ExtendedClueContributes(
      BLR_CP003_EXTENDED_SCENARIO,
      names,
    )
  ) {
    throw new Error("The extended CP-003 scenario failed graph agreement or clue contribution.");
  }
  const normalizedClues = BLR_CP003_EXTENDED_SCENARIO.clues.map((clue) =>
    clueToNormalizedText(clue, names),
  );
  const questions = BLR_CP003_EXTENDED_SCENARIO.questions.map((spec, index) =>
    buildQuestion(
      spec,
      solved.answers[index]!,
      index,
      solved.graph,
      names,
      normalizedClues,
      random,
    ),
  );

  return {
    packageId: "BLR-001",
    checkpointId: "BLR-CP-003",
    permanentQlIds: [],
    prototypeOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
    locale: "en-IN",
    seed,
    scenarioId: BLR_CP003_EXTENDED_SCENARIO.scenarioId,
    topologyId: BLR_CP003_EXTENDED_SCENARIO.topologyId,
    sharedPrompt: sharedPrompt(names),
    personNames: names,
    reconstructedFamily: solved.graph,
    questions,
    metadata: {
      runtimeVersion: "blr-cp003-extended-prototype-v1",
      hiddenGraphAgreedWithClueGraph: true,
      everyClueContributes: true,
      clueCount: 6,
      itemCount: 7,
      semanticFingerprint: stableHash([
        BLR_CP003_EXTENDED_SCENARIO.topologyId,
        ...BLR_CP003_EXTENDED_SCENARIO.clues.map(
          (clue) => `${clue.subjectId}:${clue.relationId}:${clue.referenceId}`,
        ),
        ...BLR_CP003_EXTENDED_SCENARIO.questions.map((spec) => JSON.stringify(spec)),
      ]),
    },
  };
}
