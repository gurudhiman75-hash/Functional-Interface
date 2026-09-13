import type { CodAnswerType, CodRenderer, ExplanationTrace, GeneratedOption } from "./foundation/types";
import { generateSourceGapV2, type SourceGapV2Question } from "./remediation/source-gap-v2";
import {
  getCodSourceGapPermanentContract,
  type CodSourceGapPermanentContract,
  type CodSourceGapQlId,
} from "./source-gap-permanent-contracts";
import { COD_SOURCE_GAP_DISCOVERY_FREEZE_VERSION } from "./source-gap-discovery-freeze";

export interface GeneratedCodSourceGapQuestion {
  readonly packageId: "COD-001";
  readonly qlId: CodSourceGapQlId;
  readonly permanentQlId: CodSourceGapQlId;
  readonly checkpointId: CodSourceGapPermanentContract["checkpointId"];
  readonly ruleId: CodSourceGapPermanentContract["ruleId"];
  readonly solveContractId: CodSourceGapPermanentContract["solveContractId"];
  readonly taskKind: "INFER_AND_ENCODE";
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: SourceGapV2Question["difficulty"];
  readonly renderer: CodRenderer;
  readonly answerType: CodAnswerType;
  readonly stem: string;
  readonly structuredPrompt: {
    readonly taskKind: "INFER_AND_ENCODE";
    readonly evidence: SourceGapV2Question["evidence"];
    readonly targetWord: string;
    readonly targetCode: string;
  };
  readonly options: readonly GeneratedOption[];
  readonly correctIndex: number;
  readonly explanation: ExplanationTrace;
  readonly prototypeOnly: false;
  readonly reviewOnly: true;
  readonly questionStudioVisible: false;
  readonly publiclyPublishable: false;
  readonly metadata: {
    readonly runtimeVersion: "cod-001-source-gap-permanent-v1";
    readonly maturity: "ENGLISH_RUNTIME_PROOF";
    readonly reviewOnly: true;
    readonly publiclyPublishable: false;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly mockTestEligible: false;
    readonly sourceGapFreezeVersion: typeof COD_SOURCE_GAP_DISCOVERY_FREEZE_VERSION;
    readonly inferredCandidateCount: 1;
    readonly arbitraryFallbackUsed: false;
    readonly difficultyScore: number;
    readonly difficultyFeatures: readonly string[];
    readonly distractorProvenance: readonly string[];
    readonly hiddenFingerprint: string;
  };
}

function answerType(question: SourceGapV2Question): CodAnswerType {
  return question.ruleId === "MIXED_CLASS_CODE" ? "SYMBOL_SEQUENCE" : "LETTER_CLUSTER";
}

function explanation(question: SourceGapV2Question): ExplanationTrace {
  return {
    ruleStatement: question.explanation.rule,
    sourceDemonstration: question.evidence.map((row) => `${row.source} → ${row.code}`),
    targetApplication: [...question.explanation.steps, ...question.explanation.working],
    conclusion: `Therefore, ${question.targetWord} is coded as ${question.targetCode}.`,
    commonTrapAlert: question.explanation.caution,
  };
}

function options(question: SourceGapV2Question): readonly GeneratedOption[] {
  const provenanceByValue = new Map(question.distractors.map((item) => [item.value, item.provenance] as const));
  return question.options.map((value, index) => ({
    value,
    isCorrect: index === question.correctIndex,
    errorLabel: index === question.correctIndex ? undefined : provenanceByValue.get(value),
  }));
}

function hiddenFingerprint(contract: CodSourceGapPermanentContract, question: SourceGapV2Question): string {
  return [
    contract.qlId,
    contract.ruleId,
    JSON.stringify(question.context),
    question.evidence.map((row) => `${row.source}>${row.code}`).join("|"),
    `${question.targetWord}>${question.targetCode}`,
  ].join("::");
}

export function generateCodSourceGapPermanentQuestion(qlId: CodSourceGapQlId, seed = 0): GeneratedCodSourceGapQuestion {
  const contract = getCodSourceGapPermanentContract(qlId);
  const candidate = generateSourceGapV2(contract.ruleId, seed);
  if (candidate.ownerCheckpoint !== contract.checkpointId) {
    throw new Error(`${qlId} ownership drift: expected ${contract.checkpointId}, got ${candidate.ownerCheckpoint}`);
  }
  const generatedOptions = options(candidate);
  if (generatedOptions.filter((option) => option.isCorrect).length !== 1) {
    throw new Error(`${qlId}/${seed} does not contain exactly one correct option`);
  }

  return {
    packageId: "COD-001",
    qlId: contract.qlId,
    permanentQlId: contract.qlId,
    checkpointId: contract.checkpointId,
    ruleId: contract.ruleId,
    solveContractId: contract.solveContractId,
    taskKind: contract.taskKind,
    seed,
    locale: "en-IN",
    difficulty: candidate.difficulty,
    renderer: "EXAMPLE_TARGET_BLOCK",
    answerType: answerType(candidate),
    stem: candidate.stem,
    structuredPrompt: {
      taskKind: "INFER_AND_ENCODE",
      evidence: candidate.evidence,
      targetWord: candidate.targetWord,
      targetCode: candidate.targetCode,
    },
    options: generatedOptions,
    correctIndex: candidate.correctIndex,
    explanation: explanation(candidate),
    prototypeOnly: false,
    reviewOnly: true,
    questionStudioVisible: false,
    publiclyPublishable: false,
    metadata: {
      runtimeVersion: "cod-001-source-gap-permanent-v1",
      maturity: "ENGLISH_RUNTIME_PROOF",
      reviewOnly: true,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      mockTestEligible: false,
      sourceGapFreezeVersion: COD_SOURCE_GAP_DISCOVERY_FREEZE_VERSION,
      inferredCandidateCount: 1,
      arbitraryFallbackUsed: false,
      difficultyScore: candidate.difficultyScore,
      difficultyFeatures: candidate.difficultyFeatures,
      distractorProvenance: candidate.distractors.map((item) => item.provenance),
      hiddenFingerprint: hiddenFingerprint(contract, candidate),
    },
  };
}
