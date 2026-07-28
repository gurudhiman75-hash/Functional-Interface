import { rationalKey } from "../foundation/rational";
import { normaliseIntCp001Wave2Stem } from "./editorial-normalizer";
import { buildIntCp001Wave2Options } from "./options";
import { generateIntCp001Wave2Parameters } from "./parameter-generator";
import { presentIntCp001Wave2 } from "./presentation";
import { getIntCp001Wave2RegistryEntry } from "./registry";
import { solveIntCp001Wave2 } from "./solver";
import type {
  IntCp001Wave2GeneratedPrototype,
  IntCp001Wave2PrototypeId,
} from "./types";
import { validateIntCp001Wave2 } from "./validator";

export function generateIntCp001Wave2Prototype(
  prototypeId: IntCp001Wave2PrototypeId,
  seed: string,
): IntCp001Wave2GeneratedPrototype {
  const registry = getIntCp001Wave2RegistryEntry(prototypeId);
  const parameters = generateIntCp001Wave2Parameters(prototypeId, seed);
  const solution = solveIntCp001Wave2(parameters.request);
  const optionPackage = buildIntCp001Wave2Options(parameters, solution);
  const presentation = presentIntCp001Wave2(parameters, solution);
  const stem = normaliseIntCp001Wave2Stem(presentation.stem);
  const validation = validateIntCp001Wave2({
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
    discoveryWaveId: "INT-CP001-GAP-WAVE-02",
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
