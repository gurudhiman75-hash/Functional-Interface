import { deterministicIndex } from "./foundation/prng";
import { generateIntCp001Prototype } from "./foundation/cp001-pipeline";
import type { IntCp001PrototypeId } from "./foundation/types";
import { generateIntCp001Wave2Prototype } from "./gap-wave-02/pipeline";
import type { IntCp001Wave2PrototypeId } from "./gap-wave-02/types";
import { generateIntCp001ClosurePrototype } from "./final-closure/final-closure";
import type { IntCp001ClosurePrototypeId } from "./final-closure/final-closure";
import {
  getIntCp001FinalRegistryEntry,
  INT_CP001_RELEASE_ID,
  type IntCp001FinalQlId,
  type IntCp001SourceAdapter,
} from "./cp001-final-registry";

interface CommonSourceItem {
  stem: string;
  options: string[];
  optionAudit: Array<{ text: string; misconceptionId: string; result: { semantic: string; value: unknown } }>;
  correctIndex: number;
  explanation: {
    notice: string;
    relation: string;
    steps: string[];
    verification: string;
    conclusion: string;
    commonTrap: string;
  };
  reasoningGraph: unknown;
  solution: { semantic: string; value: unknown };
  validation: { ok: boolean; errors: string[]; matchingCandidates?: string[] };
  difficulty: "Easy" | "Medium" | "Hard";
  difficultyEvidence: string[];
  mathematicalFingerprint: string;
  parameters: unknown;
  taskDirection: string;
  answerSemantic: string;
}

function generateSource(adapter: IntCp001SourceAdapter, seed: string): CommonSourceItem {
  switch (adapter.kind) {
    case "FOUNDATION":
      return generateIntCp001Prototype(adapter.prototypeId as IntCp001PrototypeId, seed) as unknown as CommonSourceItem;
    case "WAVE2":
      return generateIntCp001Wave2Prototype(adapter.prototypeId as IntCp001Wave2PrototypeId, seed) as unknown as CommonSourceItem;
    case "CLOSURE":
      return generateIntCp001ClosurePrototype(adapter.prototypeId as IntCp001ClosurePrototypeId, seed) as unknown as CommonSourceItem;
  }
}

export interface IntCp001FinalGeneratedQuestion {
  packageId: "INT-001";
  canonicalProblemId: "INT-CP-001";
  qlId: IntCp001FinalQlId;
  permanentQlId: IntCp001FinalQlId;
  questionLanguageId: string;
  releaseId: typeof INT_CP001_RELEASE_ID;
  language: "en";
  maturity: "FROZEN_ENGLISH_CONTRACT";
  seed: string;
  solveContract: string;
  topology: string;
  taskDirection: string;
  answerSemantic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  difficultyEvidence: string[];
  stem: string;
  options: string[];
  optionAudit: CommonSourceItem["optionAudit"];
  correctIndex: number;
  explanation: CommonSourceItem["explanation"];
  reasoningGraph: unknown;
  solution: CommonSourceItem["solution"];
  mathematicalFingerprint: string;
  validation: CommonSourceItem["validation"];
  internalProvenance: {
    sourceKind: IntCp001SourceAdapter["kind"];
    sourcePrototypeId: string;
    representation: IntCp001SourceAdapter["representation"];
    answerUnit: IntCp001SourceAdapter["answerUnit"];
    sourceParameters: unknown;
  };
  reviewStatus: "FROZEN_ENGLISH_CONTRACT";
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}

export function generateIntCp001FinalQuestion(
  qlId: IntCp001FinalQlId,
  seed: string,
): IntCp001FinalGeneratedQuestion {
  const entry = getIntCp001FinalRegistryEntry(qlId);
  const adapterIndex = deterministicIndex(`${qlId}:${seed}:representation-adapter`, entry.sourceAdapters.length);
  const adapter = entry.sourceAdapters[adapterIndex]!;
  const sourceSeed = `${qlId}:${adapter.representation ?? "DEFAULT"}:${adapter.answerUnit ?? "DEFAULT"}:${seed}`;
  const source = generateSource(adapter, sourceSeed);
  const errors = [...source.validation.errors];

  if (!source.validation.ok) errors.push("Source prototype validation failed.");
  if (source.options.length !== 4 || new Set(source.options).size !== 4) errors.push("Permanent package must contain four unique options.");
  if (source.correctIndex < 0 || source.correctIndex > 3) errors.push("Permanent package correct index is invalid.");
  if (!source.explanation.conclusion.includes(source.options[source.correctIndex]!)) {
    errors.push("Permanent package conclusion does not state the displayed correct option.");
  }

  const learnerText = [
    source.stem,
    ...source.options,
    source.explanation.notice,
    source.explanation.relation,
    ...source.explanation.steps,
    source.explanation.verification,
    source.explanation.conclusion,
    source.explanation.commonTrap,
  ].join(" ");
  if (/INT-CP|INT-QL|PROT-|discoveryWaveId|prototypeId/iu.test(learnerText)) {
    errors.push("Learner-facing text leaks an internal identity.");
  }

  return {
    packageId: "INT-001",
    canonicalProblemId: "INT-CP-001",
    qlId,
    permanentQlId: qlId,
    questionLanguageId: `${qlId}:en`,
    releaseId: INT_CP001_RELEASE_ID,
    language: "en",
    maturity: "FROZEN_ENGLISH_CONTRACT",
    seed,
    solveContract: entry.solveContract,
    topology: entry.topology,
    taskDirection: entry.taskDirection,
    answerSemantic: entry.answerSemantic,
    difficulty: source.difficulty,
    difficultyEvidence: source.difficultyEvidence,
    stem: source.stem,
    options: source.options,
    optionAudit: source.optionAudit,
    correctIndex: source.correctIndex,
    explanation: source.explanation,
    reasoningGraph: source.reasoningGraph,
    solution: source.solution,
    mathematicalFingerprint: `${qlId}::${source.mathematicalFingerprint}`,
    validation: {
      ok: errors.length === 0,
      errors,
      matchingCandidates: source.validation.matchingCandidates,
    },
    internalProvenance: {
      sourceKind: adapter.kind,
      sourcePrototypeId: adapter.prototypeId,
      representation: adapter.representation,
      answerUnit: adapter.answerUnit,
      sourceParameters: source.parameters,
    },
    reviewStatus: "FROZEN_ENGLISH_CONTRACT",
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  };
}
