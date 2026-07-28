import { relationLabel } from "../foundation/relation-ontology";
import { graphFromStructuredPrompt, solveRelationFromGraph } from "../foundation/graph-closure";
import { SeededRandom, stableHash } from "../foundation/prng";
import type {
  BlrCp001PrototypeId,
  BlrDifficulty,
  BlrRelationId,
  BlrStructuredPrompt,
  GeneratedBlrCp001PrototypeQuestion,
  GeneratedBlrOption,
} from "../foundation/types";
import { buildBlrCp001Distractors } from "./distractor-builder";
import { getBlrCp001PrototypeContract } from "./prototype-contracts";
import {
  assignNames,
  buildStem,
  formatClue,
  scenariosFor,
} from "./scenario-library";
import { solveBlrCp001Prompt } from "./prototype-solver";

function tryReverseRelation(prompt: BlrStructuredPrompt): BlrRelationId | null {
  try {
    return solveBlrCp001Prompt({
      ...prompt,
      query: { subjectId: prompt.query.referenceId, referenceId: prompt.query.subjectId },
    }).relationId;
  } catch {
    return null;
  }
}

function difficultyFor(
  pathLength: number,
  clueCount: number,
  prototypeId: BlrCp001PrototypeId,
  seed: number,
): BlrDifficulty {
  if (pathLength === 1 && clueCount === 1) return seed % 5 === 0 ? "MEDIUM" : "EASY";
  if (pathLength === 2) return seed % 4 === 0 ? "HARD" : "MEDIUM";
  if (prototypeId === "BLR-CP001-PROT-COMPOSED-THREE-EDGE") {
    return seed % 3 === 0 ? "MEDIUM" : "HARD";
  }
  return "MEDIUM";
}

function explanationFor(
  prompt: BlrStructuredPrompt,
  relationId: BlrRelationId,
  pathPersonIds: readonly string[],
  closestDistractor: BlrRelationId,
): GeneratedBlrCp001PrototypeQuestion["explanation"] {
  const pathNames = pathPersonIds.map((personId) => prompt.personNames[personId] ?? personId);
  const subjectName = prompt.personNames[prompt.query.subjectId]!;
  const referenceName = prompt.personNames[prompt.query.referenceId]!;
  return {
    ruleStatement:
      "Place the people in the order stated, then trace the family path in the exact direction asked by the question.",
    normalizedClues: prompt.clues.map((entry) => formatClue(entry, prompt.personNames)),
    queryPath: [
      pathNames.join(" → "),
      `${subjectName}'s relation to ${referenceName} is ${relationLabel(relationId).toLocaleLowerCase("en-IN")}.`,
    ],
    conclusion:
      `Therefore, ${subjectName} is the ${relationLabel(relationId).toLocaleLowerCase("en-IN")} of ${referenceName}.`,
    closestTrapRejection:
      `${relationLabel(closestDistractor)} is tempting, but it does not match the direction and generation of the traced path.`,
  };
}

export function generateBlrCp001PrototypeQuestion(
  prototypeId: BlrCp001PrototypeId,
  seed = 0,
): GeneratedBlrCp001PrototypeQuestion {
  const contract = getBlrCp001PrototypeContract(prototypeId);
  const random = new SeededRandom(seed ^ Number.parseInt(stableHash([prototypeId]), 16));
  const template = random.pick(scenariosFor(prototypeId));
  const prompt: BlrStructuredPrompt = {
    clues: template.clues,
    query: template.query,
    personNames: assignNames(template, random),
  };

  const independent = solveBlrCp001Prompt(prompt);
  if (independent.relationId !== template.expectedRelationId) {
    throw new Error(
      `${template.scenarioId} expected ${template.expectedRelationId} but solver returned ${independent.relationId}.`,
    );
  }
  if (
    independent.path.steps.length < contract.minimumPathLength ||
    independent.path.steps.length > contract.maximumPathLength
  ) {
    throw new Error(`${template.scenarioId} violates the prototype path-length contract.`);
  }

  const graph = graphFromStructuredPrompt(prompt);
  const generatorCheck = solveRelationFromGraph(
    graph,
    prompt.query.subjectId,
    prompt.query.referenceId,
  );
  if (generatorCheck.relationId !== independent.relationId) {
    throw new Error(`Generator and independent solver disagree for ${template.scenarioId}.`);
  }

  const reverseRelationId = tryReverseRelation(prompt);
  const distractors = buildBlrCp001Distractors(independent.relationId, reverseRelationId, random);
  if (distractors.length !== 3) {
    throw new Error("Unable to construct three unique misconception distractors.");
  }

  const correctIndex = ((Math.trunc(seed) % 4) + 4) % 4;
  const options: GeneratedBlrOption[] = [];
  let distractorIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      options.push({
        value: relationLabel(independent.relationId),
        relationId: independent.relationId,
        isCorrect: true,
      });
    } else {
      const distractor = distractors[distractorIndex++]!;
      options.push({
        value: relationLabel(distractor.relationId),
        relationId: distractor.relationId,
        isCorrect: false,
        errorLabel: distractor.errorLabel,
      });
    }
  }

  const stemRandom = new SeededRandom(
    seed + Number.parseInt(stableHash([template.scenarioId]), 16),
  );

  return {
    packageId: "BLR-001",
    checkpointId: "BLR-CP-001",
    prototypeId,
    permanentQlId: null,
    prototypeOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    ruleId: "BLOOD_GRAPH_RELATION",
    seed,
    locale: "en-IN",
    difficulty: difficultyFor(independent.path.steps.length, prompt.clues.length, prototypeId, seed),
    renderer:
      independent.path.steps.length >= 2 ? "FAMILY_TREE_EXPLANATION" : "STRUCTURED_TEXT",
    answerType: "RELATION_LABEL",
    stem: buildStem(prompt, stemRandom),
    structuredPrompt: prompt,
    options,
    correctIndex,
    explanation: explanationFor(
      prompt,
      independent.relationId,
      independent.path.personIds,
      distractors[0]!.relationId,
    ),
    metadata: {
      runtimeVersion: "blr-cp001-prototype-v1",
      hiddenFingerprint: stableHash([
        template.scenarioId,
        ...template.clues.flatMap((entry) => [entry.subjectId, entry.relationId, entry.referenceId]),
        template.query.subjectId,
        template.query.referenceId,
      ]),
      relationId: independent.relationId,
      reverseRelationId,
      pathLength: independent.path.steps.length,
      clueCount: prompt.clues.length,
      ambiguityAccepted: true,
      independentSolverAgreed: true,
      familyGraphValid: true,
      distractorErrorLabels: distractors.map((entry) => entry.errorLabel),
    },
  };
}
