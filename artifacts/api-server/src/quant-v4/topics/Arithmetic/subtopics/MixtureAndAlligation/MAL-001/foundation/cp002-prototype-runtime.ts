import {
  buildMalCp002Diagram,
  buildMalCp002Explanation,
  buildMalCp002Options,
  buildMalCp002ReasoningGraph,
  buildMalCp002Stem,
  formatMalCp002Answer,
} from "./cp002-authoring";
import type { MalCp002GeneratedPrototype } from "./cp002-authoring-types";
import {
  MAL_CP002_CONTEXT_LIBRARY,
  type MalCp002Context,
} from "./cp002-context-library";
import { getMalCp002DiscoveryRegistryEntry } from "./cp002-discovery-registry";
import { verifyMalCp002Result } from "./cp002-independent-verifier";
import {
  generateMalCp002Parameters,
  malCp002RequestFingerprint,
} from "./cp002-parameter-generator";
import {
  malCp002ResultFingerprint,
  solveMalCp002Request,
} from "./cp002-solver";
import type { MalCp002ExecutablePrototypeId } from "./cp002-types";

function hash(value: string): number {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.codePointAt(0) ?? 0;
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function selectContext(
  prototypeId: MalCp002ExecutablePrototypeId,
  seed: string,
): MalCp002Context {
  return MAL_CP002_CONTEXT_LIBRARY[
    hash(`${prototypeId}:${seed}:context`) % MAL_CP002_CONTEXT_LIBRARY.length
  ]!;
}

function validateAuthoring(
  prototype: Omit<MalCp002GeneratedPrototype, "validation">,
): string[] {
  const errors: string[] = [];
  if (prototype.stem.trim().length < 60) {
    errors.push("Stem is too short to state the mixture state clearly.");
  }
  if (!prototype.stem.trim().endsWith("?")) {
    errors.push("Stem must end with a question mark.");
  }
  if (/\b(undefined|null|NaN)\b/u.test(prototype.stem)) {
    errors.push("Stem contains a placeholder or invalid value.");
  }
  if (prototype.explanation.steps.length < 4) {
    errors.push("Formula-first explanation has fewer than four worked steps.");
  }
  if (
    prototype.explanation.steps.some(
      (step, index) => !step.startsWith(`Step ${index + 1}:`),
    )
  ) {
    errors.push("Explanation steps are not sequentially labelled.");
  }
  const methodOneText = [
    prototype.explanation.coreConcept,
    prototype.explanation.formula,
    ...prototype.explanation.steps,
    prototype.explanation.verification,
    prototype.explanation.conclusion,
  ].join("\n");
  if (/alligation/iu.test(methodOneText)) {
    errors.push("CP-002 formula-first solution unexpectedly uses alligation.");
  }
  if (!prototype.explanation.examShortcut.trim()) {
    errors.push("Exam shortcut is empty.");
  }
  if (!prototype.explanation.commonTrap.trim()) {
    errors.push("Common-trap warning is empty.");
  }
  if (prototype.reasoningGraph.nodes.length < 5) {
    errors.push("Reasoning graph is incomplete.");
  }
  if (prototype.reasoningGraph.nodes.at(-1)?.kind !== "CONCLUSION") {
    errors.push("Reasoning graph does not end with a conclusion.");
  }
  if (prototype.diagram.type !== "RATIO_ADJUSTMENT") {
    errors.push("Ratio-adjustment diagram contract is missing.");
  }
  if (
    prototype.diagram.componentALabel !== prototype.context.componentALabel ||
    prototype.diagram.componentBLabel !== prototype.context.componentBLabel
  ) {
    errors.push("Diagram labels do not match the selected context.");
  }
  if (prototype.answer !== prototype.options[prototype.correctIndex]) {
    errors.push("Canonical answer does not match the correct option text.");
  }
  return errors;
}

export function generateMalCp002DiscoveryPrototype(
  prototypeId: MalCp002ExecutablePrototypeId,
  seed = `mal-cp002:${prototypeId}:default`,
): MalCp002GeneratedPrototype {
  const registry = getMalCp002DiscoveryRegistryEntry(prototypeId);
  if (registry.discoveryStatus !== "EXECUTABLE_DISCOVERY") {
    throw new Error(`${prototypeId} is not executable in the current discovery frontier.`);
  }

  const context = selectContext(prototypeId, seed);
  const parameters = generateMalCp002Parameters(prototypeId, seed);
  const solution = solveMalCp002Request(parameters.request);
  const verification = verifyMalCp002Result(parameters.request, solution);
  const stem = buildMalCp002Stem(parameters.request, context);
  const answer = formatMalCp002Answer(solution, context);
  const optionPackage = buildMalCp002Options(
    parameters.request,
    solution,
    context,
    `${prototypeId}:${seed}:options`,
  );
  const explanation = buildMalCp002Explanation(
    parameters.request,
    solution,
    context,
  );
  const reasoningGraph = buildMalCp002ReasoningGraph(
    parameters.request,
    solution,
    context,
  );
  const diagram = buildMalCp002Diagram(
    parameters.request,
    solution,
    context,
  );

  const withoutValidation: Omit<MalCp002GeneratedPrototype, "validation"> = {
    archetypeId: "MAL-001",
    canonicalProblemId: "MAL-CP-002",
    prototypeId,
    permanentQlId: null,
    questionLanguageId: `${prototypeId}-EN-DISCOVERY`,
    language: "en",
    seed,
    context,
    difficulty: registry.baseDifficulty,
    taskDirection: registry.taskDirection,
    answerSemantic: registry.answerSemantic,
    stem,
    parameters,
    solution,
    answer,
    options: optionPackage.options,
    optionAudit: optionPackage.optionAudit,
    correctIndex: optionPackage.correctIndex,
    explanation,
    reasoningGraph,
    diagram,
    mathematicalFingerprint: [
      prototypeId,
      malCp002RequestFingerprint(parameters.request),
      malCp002ResultFingerprint(solution),
    ].join("|"),
    maturity: "DISCOVERY_PROTOTYPE",
    allocationStatus: "UNALLOCATED_OPEN_DISCOVERY",
    active: false,
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
  };
  const authoringErrors = validateAuthoring(withoutValidation);

  return {
    ...withoutValidation,
    validation: {
      ok:
        verification.ok &&
        optionPackage.errors.length === 0 &&
        authoringErrors.length === 0,
      errors: [
        ...verification.errors,
        ...optionPackage.errors,
        ...authoringErrors,
      ],
      optionErrors: optionPackage.errors,
      authoringErrors,
    },
  };
}
