import { normaliseIntCp001EditorialStem } from "./cp001-editorial-normalizer";
import { normaliseIntCp001MoneyOptions } from "./cp001-option-normalizer";
import { normaliseIntCp001MoneyState } from "./cp001-money-state-normalizer";
import { getIntCp001PrototypeEntry } from "./cp001-registry";
import { buildIntCp001Options } from "./cp001-options";
import { generateIntCp001Parameters } from "./cp001-parameter-generator";
import { presentIntCp001 } from "./cp001-presentation";
import { solveIntCp001 } from "./cp001-solver";
import { diversifyIntCp001StemOpening } from "./cp001-stem-diversifier";
import { expandIntCp001TimeInverseState } from "./cp001-time-inverse-expander";
import { validateIntCp001Prototype } from "./cp001-validator";
import { rationalKey } from "./rational";
import type { IntCp001GeneratedPrototype, IntCp001PrototypeId } from "./types";

function normaliseQuestionPunctuation(stem: string): string {
  if (stem.endsWith("?")) return stem;
  if (stem.endsWith(".")) return `${stem.slice(0, -1)}?`;
  return `${stem}?`;
}

export function generateIntCp001Prototype(
  prototypeId: IntCp001PrototypeId,
  seed: string,
): IntCp001GeneratedPrototype {
  const registry = getIntCp001PrototypeEntry(prototypeId);
  const parameters = normaliseIntCp001MoneyState(
    expandIntCp001TimeInverseState(
      generateIntCp001Parameters(prototypeId, seed),
    ),
  );
  const solution = solveIntCp001(parameters.request);
  const optionPackage = normaliseIntCp001MoneyOptions(
    parameters,
    solution,
    buildIntCp001Options(parameters, solution),
  );
  const presentation = presentIntCp001(parameters, solution);
  const stem = normaliseIntCp001EditorialStem(
    normaliseQuestionPunctuation(
      diversifyIntCp001StemOpening(presentation.stem, parameters),
    ),
  );
  const validation = validateIntCp001Prototype({
    parameters,
    solution,
    stem,
    options: optionPackage.options,
    optionAudit: optionPackage.optionAudit,
    correctIndex: optionPackage.correctIndex,
    explanation: presentation.explanation,
    reasoningGraph: presentation.reasoningGraph,
  });

  return {
    archetypeId: "INT-001",
    canonicalProblemId: "INT-CP-001",
    prototypeId,
    permanentQlId: null,
    questionLanguageId: `${prototypeId}:en`,
    language: "en",
    seed,
    difficulty: parameters.difficulty,
    difficultyEvidence: parameters.difficultyEvidence,
    taskDirection: registry.taskDirection,
    answerSemantic: registry.answerSemantic,
    stem,
    parameters,
    solution,
    options: optionPackage.options,
    optionAudit: optionPackage.optionAudit,
    correctIndex: optionPackage.correctIndex,
    explanation: presentation.explanation,
    reasoningGraph: presentation.reasoningGraph,
    mathematicalFingerprint: [
      parameters.generationFingerprint,
      solution.semantic,
      rationalKey(solution.value),
    ].join("::"),
    validation,
    reviewStatus: "UNREVIEWED",
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  };
}
