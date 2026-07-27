import { getMalCp001PrototypeEntry } from "./cp001-registry";
import { generateMalCp001PrototypeParameters } from "./cp001-parameter-generator";
import {
  enforceMalCp001ContextCoherence,
  polishMalCp001Stem,
} from "./cp001-editorial-gate";
import { solveMalCp001 } from "./solver";
import { verifyMalCp001ResultIndependently } from "./independent-verifier";
import { buildMalCp001Options } from "./cp001-options";
import {
  renderMalCp001Diagram,
  renderMalCp001Explanation,
  renderMalCp001Stem,
} from "./cp001-presentation";
import { buildMalCp001ReasoningGraph } from "./reasoning-graph";
import { validateMalCp001GeneratedPrototype } from "./validator";
import { rationalKey } from "./rational";
import type {
  MalCp001GeneratedPrototype,
  MalCp001PrototypeId,
  MalCp001SolveResult,
} from "./types";

function solutionFingerprint(solution: MalCp001SolveResult): string {
  switch (solution.kind) {
    case "MEAN_VALUE":
    case "SOURCE_VALUE":
      return `${solution.kind}:${rationalKey(solution.value)}`;
    case "COMPONENT_QUANTITY":
      return `${solution.kind}:${rationalKey(solution.quantity)}`;
    case "COMPONENT_RATIO":
      return `${solution.kind}:${rationalKey(solution.firstPart)}:${rationalKey(solution.secondPart)}`;
    case "COMPONENT_QUANTITY_PAIR":
      return `${solution.kind}:${rationalKey(solution.firstQuantity)}:${rationalKey(solution.secondQuantity)}`;
  }
}

export function generateMalCp001Prototype(
  prototypeId: MalCp001PrototypeId,
  seed: string,
): MalCp001GeneratedPrototype {
  const entry = getMalCp001PrototypeEntry(prototypeId);
  const parameters = generateMalCp001PrototypeParameters(prototypeId, seed);
  enforceMalCp001ContextCoherence(parameters);

  const solution = solveMalCp001(parameters.request);
  const independent = verifyMalCp001ResultIndependently(parameters.request, solution);
  if (!independent.ok) {
    throw new Error(
      `Independent verification failed for ${prototypeId}/${seed}: ${independent.errors.join(" | ")}`,
    );
  }
  const optionPackage = buildMalCp001Options(parameters, solution);
  const question: MalCp001GeneratedPrototype = {
    archetypeId: "MAL-001",
    canonicalProblemId: "MAL-CP-001",
    prototypeId,
    permanentQlId: null,
    questionLanguageId: `${prototypeId}:en`,
    language: "en",
    seed,
    difficulty: parameters.difficulty,
    taskDirection: entry.taskDirection,
    answerSemantic: entry.answerSemantic,
    stem: polishMalCp001Stem(renderMalCp001Stem(entry, parameters)),
    parameters,
    solution,
    options: optionPackage.options,
    optionAudit: optionPackage.optionAudit,
    correctIndex: optionPackage.correctIndex,
    explanation: renderMalCp001Explanation(entry, parameters, solution),
    reasoningGraph: buildMalCp001ReasoningGraph(parameters, solution),
    diagram: renderMalCp001Diagram(entry, parameters),
    mathematicalFingerprint: `${parameters.generationFingerprint}:answer=${solutionFingerprint(solution)}`,
    validation: { ok: true, errors: [] },
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  };
  question.validation = validateMalCp001GeneratedPrototype(question);
  if (!question.validation.ok) {
    throw new Error(
      `MAL-CP-001 prototype validation failed for ${prototypeId}/${seed}: ${question.validation.errors.join(" | ")}`,
    );
  }
  return question;
}
