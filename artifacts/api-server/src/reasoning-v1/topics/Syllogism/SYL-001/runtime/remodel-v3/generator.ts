import { SYL_001_SEMANTICS_PROFILE } from "../../foundation/semantics-profile";
import type { SylDifficulty, SylLocale } from "../../foundation/types";
import { generateSylQuestion } from "../generator";
import { createPrng, shuffle } from "../prng";
import { getSylQlDefinition } from "../ql-registry";
import { selectQuestionLogic } from "../selection";
import { assignTerms } from "../term-assignment";
import type { SylQlId } from "../types";
import { renderCombinedDiagramV3 } from "./diagram";
import { existenceDirection, v3Headings } from "./localization";
import { buildStructuredProofCoreV3 } from "./proof";
import type {
  GeneratedSylOptionV3,
  GeneratedSylQuestionV3,
  SylVersionTupleV3,
} from "./types";

export const SYL_001_V3_VERSION_TUPLE: SylVersionTupleV3 = Object.freeze({
  contentVersion: "SYL_001_REMODEL_V3",
  solverVersion: "INDIAN_COMPETITIVE_EXAM_SYLLOGISM_V1",
  proofGeneratorVersion: "syl-structured-proof-v3",
  diagramGeneratorVersion: "syl-combined-diagram-v3",
  localizationVersion: "syl-localization-v3",
  existencePolicyVersion: 1,
  optionShuffleVersion: "syl-secure-shuffle-v3",
});

function qlNumber(qlId: SylQlId): string {
  return qlId.slice(-3);
}

function secureOptions(
  options: GeneratedSylQuestionV3["options"] | readonly {
    optionId: string;
    semanticValue: string;
    text: string;
    isCorrect: boolean;
    errorLabel: string | null;
  }[],
  qlId: SylQlId,
  seed: number,
  semanticAnswer: string,
): readonly GeneratedSylOptionV3[] {
  const random = createPrng(`SYL_001_REMODEL_V3:${qlId}:${seed}:${semanticAnswer}:secure-option-order`);
  return Object.freeze(shuffle(options, random).map((option, index) => Object.freeze({
    ...option,
    optionId: `OPTION-${index + 1}`,
    displayIndex: index + 1,
    displayLabel: String(index + 1),
  })));
}

function canonicalPayloadIdentity(
  qlId: SylQlId,
  taskKind: string,
  scenarioId: string,
  premises: readonly { form: string; subject: string; predicate: string }[],
  conclusions: readonly { form: string; subject: string; predicate: string }[],
  semanticAnswer: string,
): string {
  const premisePart = [...premises]
    .map((premise) => `${premise.form}(${premise.subject},${premise.predicate})`)
    .sort()
    .join("&");
  const conclusionPart = conclusions
    .map((conclusion) => `${conclusion.form}(${conclusion.subject},${conclusion.predicate})`)
    .join("|");
  return [
    "SYL-FP-V3",
    qlId,
    taskKind,
    scenarioId,
    premisePart,
    conclusionPart,
    semanticAnswer,
  ].join("::");
}

function semanticDifficulty(
  taskKind: string,
  topology: string,
  premises: readonly { form: string }[],
  termCount: number,
  conclusionCount: number,
  correctClassification: string | null,
): { score: number; difficulty: SylDifficulty; evidence: readonly string[] } {
  const existentialForms = new Set(["SOME", "SOME_NOT", "A_FEW", "ONLY_A_FEW", "NOT_ALL"]);
  const transformationForms = new Set(["ONLY", "ARE_ONLY", "ONLY_A_FEW", "NOT_ALL", "IDENTITY"]);
  const witnessCount = premises.filter((premise) => existentialForms.has(premise.form)).length;
  const transformationCount = premises.filter((premise) => transformationForms.has(premise.form)).length;
  let score = 1;
  score += Math.max(0, premises.length - 2);
  score += Math.max(0, termCount - 3);
  score += topology === "LINEAR" ? 0 : topology === "BRANCHING" || topology === "CONVERGING" ? 1 : 2;
  score += Math.min(3, witnessCount);
  score += Math.min(4, transformationCount * 2);
  score += Math.max(0, conclusionCount - 1);
  if (taskKind.includes("POSSIBILITY") || taskKind.includes("NON_FOLLOWING")) score += 2;
  if (taskKind.includes("MODAL")) score += 2;
  if (taskKind.includes("EITHER_OR") || taskKind.includes("PAIR")) score += 3;
  if (taskKind.includes("THREE_CONCLUSION")) score += 2;
  if (correctClassification === "CONTRADICTED") score -= 1;
  const forms = premises.map((premise) => premise.form);
  if (forms.includes("SOME") && forms.includes("NO") && premises.length === 2) score -= 1;
  if (forms.filter((form) => form === "ALL" || form === "ARE_ONLY").length >= 2 && premises.length === 2) score -= 1;
  score = Math.max(1, score);
  const difficulty: SylDifficulty = score <= 4 ? "EASY" : score <= 7 ? "MEDIUM" : "HARD";
  return Object.freeze({
    score,
    difficulty,
    evidence: Object.freeze([
      `${premises.length} premises`,
      `${termCount} terms`,
      `${witnessCount} explicit witness obligations`,
      `${transformationCount} normalization-sensitive forms`,
      `${conclusionCount} conclusions`,
      `topology ${topology}`,
      `semantic score ${score}`,
    ]),
  });
}

export function generateSylQuestionV3(
  qlId: SylQlId,
  seed: number,
  locale: SylLocale,
): GeneratedSylQuestionV3 & {
  readonly difficultyScore: number;
  readonly difficultyEvidence: readonly string[];
} {
  if (!Number.isSafeInteger(seed)) throw new Error("V3 seed must be a safe integer.");
  const definition = getSylQlDefinition(qlId);
  const selected = selectQuestionLogic(definition, seed);
  const base = generateSylQuestion(qlId, seed, locale);
  const assignment = assignTerms(qlId, seed, selected.analysis.termOrder);
  const displayedPremises = Object.freeze(shuffle(
    selected.analysis.premises,
    createPrng(`${qlId}:${seed}:premise-order`),
  ));
  const options = secureOptions(base.options, qlId, seed, selected.semanticAnswer);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0 || options.filter((option) => option.isCorrect).length !== 1) {
    throw new Error(`${qlId}/${seed}/${locale} V3 must have exactly one correct option.`);
  }
  const core = buildStructuredProofCoreV3(
    definition,
    selected,
    displayedPremises,
    options,
    correctIndex,
    locale,
    assignment,
  );
  const diagram = renderCombinedDiagramV3({
    qlId,
    seed,
    scenarioId: selected.analysis.scenario.scenarioId,
    locale,
    displayedPremises,
    assignment,
    correctOptionIndex: correctIndex,
    correctOptionText: options[correctIndex]!.text,
    core,
  });
  const headings = v3Headings(locale);
  const existence = existenceDirection(locale);
  const questionId = `SYL-Q-${qlNumber(qlId)}-S${String(seed).replace("-", "N")}`;
  const questionLanguageId = `${questionId}-${locale}`;
  const contentIdentity = canonicalPayloadIdentity(
    qlId,
    definition.taskKind,
    selected.analysis.scenario.scenarioId,
    selected.analysis.premises,
    selected.conclusions.map((candidate) => candidate.conclusion),
    selected.semanticAnswer,
  );
  const difficulty = semanticDifficulty(
    definition.taskKind,
    selected.analysis.scenario.topology,
    selected.analysis.premises,
    selected.analysis.termOrder.length,
    selected.conclusions.length,
    selected.conclusions[0]?.profile.classification ?? null,
  );
  const finalAnswer = options[correctIndex]!;
  const explanation = Object.freeze({
    schemaVersion: "syl-structured-proof-v3" as const,
    taskKind: definition.taskKind,
    existencePolicy: Object.freeze({
      id: SYL_001_SEMANTICS_PROFILE.existencePolicyId,
      version: SYL_001_SEMANTICS_PROFILE.existencePolicyVersion,
      visibleToStudent: true as const,
      studentDirection: existence,
    }),
    understandStatementsHeading: headings.understand,
    statementMeanings: core.statementMeanings,
    combineStatementsHeading: headings.combine,
    combinedRelation: core.combinedRelation,
    checkOptionsHeading: headings.options,
    optionAnalysis: core.optionAnalysis,
    correctProofHeading: headings.correctProof,
    correctOptionProof: core.correctOptionProof,
    fastRuleHeading: headings.fastRule,
    fastRule: core.fastRule,
    diagramHeading: headings.diagram,
    combinedDiagram: diagram,
    finalAnswerHeading: headings.finalAnswer,
    finalAnswer: locale === "hi-IN"
      ? `विकल्प ${correctIndex + 1} — ${finalAnswer.text}`
      : locale === "pa-IN"
        ? `ਵਿਕਲਪ ${correctIndex + 1} — ${finalAnswer.text}`
        : `Option ${correctIndex + 1} — ${finalAnswer.text}`,
  });
  const lifecycle = Object.freeze({
    questionStudioVisible: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  });
  return Object.freeze({
    ...base,
    questionId,
    questionLanguageId,
    contentIdentity,
    stem: `${existence}\n\n${base.stem}`,
    options,
    correctIndex,
    explanation,
    difficulty: difficulty.difficulty,
    difficultyScore: difficulty.score,
    difficultyEvidence: difficulty.evidence,
    versionTuple: SYL_001_V3_VERSION_TUPLE,
    humanReviewStatus: "REVISE",
    lifecycle,
    metadata: Object.freeze({
      ...base.metadata,
      runtimeVersion: "syl-001-remodel-runtime-v3",
      proofObjectGenerated: true,
      optionExplanationSynchronized: true,
      oneCombinedDiagramValidated: true,
      existencePolicyVisibleToStudent: true,
      immutableReviewVersion: "SYL_001_REMODEL_V3",
      humanReviewStatus: "REVISE",
      questionStudioVisible: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    }),
  } as unknown as GeneratedSylQuestionV3 & {
    readonly difficultyScore: number;
    readonly difficultyEvidence: readonly string[];
  });
}

export function generateSylQuestionV3ByString(
  qlId: string,
  seed: number,
  locale: SylLocale,
): ReturnType<typeof generateSylQuestionV3> {
  return generateSylQuestionV3(qlId as SylQlId, seed, locale);
}
