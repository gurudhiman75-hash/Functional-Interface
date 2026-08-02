import { deterministicIndex, rotate } from "./foundation/prng";
import type { Rational } from "./foundation/types";
import { generateIntCp002Wave01PrototypeV2 } from "./cp002-wave01-runtime-v2";
import type { IntCp002Wave01PrototypeId } from "./cp002-wave01-types";
import { generateIntCp002Wave02QuestionV2 } from "./cp002-wave02-runtime-v2";
import type { IntCp002Wave02PrototypeId } from "./cp002-wave02-types";
import { generateIntCp002FinalClosureQuestion } from "./cp002-final-closure-runtime";
import type { IntCp002FinalClosurePrototypeId } from "./cp002-final-closure-types";
import {
  getIntCp002FinalRegistryEntry,
  INT_CP002_RELEASE_CANDIDATE_ID,
  type IntCp002FinalQlId,
  type IntCp002FinalSourceAdapter,
} from "./cp002-final-registry";

interface CommonSourceQuestion {
  stem: string;
  options: string[];
  optionAudit: Array<{
    text: string;
    value: Rational;
    misconceptionId: string;
    explanation: string;
  }>;
  correctIndex: number;
  explanation: {
    mainRule: string;
    workedSteps: string[];
    examShortcut: string;
    verification: string;
    conclusion: string;
    trapAnalysis: Array<{
      optionNumber: number;
      misconceptionId: string;
      explanation: string;
    }>;
  };
  solution: Rational;
  validation: { ok: boolean; errors: string[] };
  difficulty: "Easy" | "Medium" | "Hard";
  mathematicalFingerprint: string;
  answerSemantic: string;
  sourceState?: unknown;
  state?: unknown;
}

function generateSource(adapter: IntCp002FinalSourceAdapter, seed: string): CommonSourceQuestion {
  switch (adapter.kind) {
    case "WAVE01":
      return generateIntCp002Wave01PrototypeV2({
        prototypeId: adapter.prototypeId as IntCp002Wave01PrototypeId,
        seed,
      }) as unknown as CommonSourceQuestion;
    case "WAVE02":
      return generateIntCp002Wave02QuestionV2({
        prototypeId: adapter.prototypeId as IntCp002Wave02PrototypeId,
        seed,
      }) as unknown as CommonSourceQuestion;
    case "CLOSURE":
      return generateIntCp002FinalClosureQuestion({
        prototypeId: adapter.prototypeId as IntCp002FinalClosurePrototypeId,
        seed,
      }) as unknown as CommonSourceQuestion;
  }
}

export interface IntCp002FinalGeneratedQuestion {
  packageId: "INT-001";
  canonicalProblemId: "INT-CP-002";
  qlId: IntCp002FinalQlId;
  permanentQlId: IntCp002FinalQlId;
  questionLanguageId: string;
  releaseCandidateId: typeof INT_CP002_RELEASE_CANDIDATE_ID;
  language: "en";
  maturity: "FINAL_ENGLISH_REVIEW_CANDIDATE";
  seed: string;
  solveContract: string;
  topology: string;
  taskDirection: string;
  answerSemantic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  stem: string;
  options: string[];
  optionAudit: CommonSourceQuestion["optionAudit"];
  correctIndex: number;
  explanation: CommonSourceQuestion["explanation"];
  solution: Rational;
  mathematicalFingerprint: string;
  validation: { ok: boolean; errors: string[] };
  internalProvenance: {
    sourceKind: IntCp002FinalSourceAdapter["kind"];
    sourcePrototypeId: string;
    sourceState: unknown;
  };
  reviewStatus: "FINAL_ENGLISH_REVIEW_CANDIDATE";
  enabled: false;
  stagingStatus: "NOT_STAGED";
  registrationStatus: "NOT_REGISTERED";
  questionStudioDiscoverable: false;
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
}

export function generateIntCp002FinalQuestion(
  qlId: IntCp002FinalQlId,
  seed: string,
): IntCp002FinalGeneratedQuestion {
  const registryEntry = getIntCp002FinalRegistryEntry(qlId);
  const sourceSeed = `${qlId}:${registryEntry.sourceAdapter.kind}:${seed}`;
  const source = generateSource(registryEntry.sourceAdapter, sourceSeed);
  const desiredCorrectIndex = deterministicIndex(`${qlId}:${seed}:final-answer-position`, 4);
  const rotationOffset = source.correctIndex - desiredCorrectIndex;
  const options = rotate(source.options, rotationOffset);
  const optionAudit = rotate(source.optionAudit, rotationOffset);
  const correctIndex = desiredCorrectIndex;
  const errors = [...source.validation.errors];

  if (!source.validation.ok) errors.push("Source runtime validation failed.");
  if (options.length !== 4 || new Set(options).size !== 4) {
    errors.push("Final CP-002 package must contain four unique options.");
  }
  if (correctIndex < 0 || correctIndex > 3) errors.push("Final correct index is invalid.");
  if (optionAudit[correctIndex]?.misconceptionId !== "CORRECT") {
    errors.push("QL-owned answer rotation did not preserve correct-option ownership.");
  }
  if (!source.explanation.conclusion.includes(options[correctIndex]!)) {
    errors.push("Final explanation conclusion does not state the displayed correct answer.");
  }
  if (source.answerSemantic !== registryEntry.answerSemantic) {
    errors.push(`Source answer semantic '${source.answerSemantic}' does not match registry semantic '${registryEntry.answerSemantic}'.`);
  }

  const learnerText = [
    source.stem,
    ...options,
    source.explanation.mainRule,
    ...source.explanation.workedSteps,
    source.explanation.examShortcut,
    source.explanation.verification,
    source.explanation.conclusion,
    ...source.explanation.trapAnalysis.map((item) => item.explanation),
  ].join(" ");
  if (/INT-CP|INT-QL|PROT-|WAVE0|CLOSE-|prototypeId|effectiveSeed|generationAttempts/iu.test(learnerText)) {
    errors.push("Learner-facing text leaks an internal identity.");
  }

  return {
    packageId: "INT-001",
    canonicalProblemId: "INT-CP-002",
    qlId,
    permanentQlId: qlId,
    questionLanguageId: `${qlId}:en`,
    releaseCandidateId: INT_CP002_RELEASE_CANDIDATE_ID,
    language: "en",
    maturity: "FINAL_ENGLISH_REVIEW_CANDIDATE",
    seed,
    solveContract: registryEntry.solveContract,
    topology: registryEntry.topology,
    taskDirection: registryEntry.taskDirection,
    answerSemantic: registryEntry.answerSemantic,
    difficulty: source.difficulty,
    stem: source.stem,
    options,
    optionAudit,
    correctIndex,
    explanation: source.explanation,
    solution: source.solution,
    mathematicalFingerprint: `${qlId}::${source.mathematicalFingerprint}`,
    validation: { ok: errors.length === 0, errors },
    internalProvenance: {
      sourceKind: registryEntry.sourceAdapter.kind,
      sourcePrototypeId: registryEntry.sourceAdapter.prototypeId,
      sourceState: source.sourceState ?? source.state,
    },
    reviewStatus: "FINAL_ENGLISH_REVIEW_CANDIDATE",
    enabled: false,
    stagingStatus: "NOT_STAGED",
    registrationStatus: "NOT_REGISTERED",
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  };
}
