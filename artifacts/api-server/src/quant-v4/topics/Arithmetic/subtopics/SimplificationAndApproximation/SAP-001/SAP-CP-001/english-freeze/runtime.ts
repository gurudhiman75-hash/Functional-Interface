import { formatRational } from "../../../shared/exact-rational";
import type { ExpressionNode } from "../../../shared/expression-ast";
import type { SapCp001Wave01Package } from "../wave01/types";
import {
  generateSapCp001Wave01Package,
} from "../wave01/runtime";
import type {
  SapCp001Wave02Package,
  SapCp001Wave02QuestionState,
} from "../wave02/types";
import {
  generateSapCp001Wave02Package,
} from "../wave02/runtime";
import type { SapCp001Wave03Package } from "../wave03/types";
import {
  generateSapCp001Wave03Package,
} from "../wave03/runtime";
import {
  SAP_CP001_ALL_PROTOTYPE_IDS,
  SAP_CP001_ENGLISH_TEMPLATE_MAP,
  type SapCp001PrototypeId,
} from "../SAP-CP-001-ENGLISH-TEMPLATE-PROPOSAL";
import {
  buildDifficultyProfile,
  buildEnglishExplanation,
  buildEnglishStem,
  editorialReviewComments,
  polishEnglishOptions,
} from "./editorial-policy";
import { evaluateIndependentEvidence } from "./independent-evidence";
import type {
  SapCp001EnglishCandidate,
  SapCp001IndependentEvidence,
} from "./types";

type DiscoveryPackage =
  | SapCp001Wave01Package
  | SapCp001Wave02Package
  | SapCp001Wave03Package;

interface ExpressionEntry {
  readonly label: string;
  readonly expression: ExpressionNode;
}

function assertPositiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${label} must be a positive integer.`);
  }
}

function generateDiscoveryPackage(
  prototypeId: SapCp001PrototypeId,
  seed: number,
): DiscoveryPackage {
  if (prototypeId.includes("COMPARE-DIFFERENT-GROUPINGS")
    || prototypeId.includes("SELECT-EQUIVALENT-GROUPING")
    || prototypeId.includes("IDENTIFY-FIRST-VALID-STEP")
    || prototypeId.includes("IDENTIFY-INCORRECT-PRECEDENCE-STEP")
    || prototypeId.includes("PARTIAL-SUBEXPRESSION-VALUE")) {
    return generateSapCp001Wave02Package(prototypeId as Parameters<typeof generateSapCp001Wave02Package>[0], seed);
  }
  if (prototypeId.includes("VINCULUM-FRACTION-BAR-SCOPE")
    || prototypeId.includes("UNAMBIGUOUS-IMPLICIT-MULTIPLICATION")
    || prototypeId.includes("REPEATED-GROUPING")
    || prototypeId.includes("NEGATIVE-INTERMEDIATE")) {
    return generateSapCp001Wave03Package(prototypeId as Parameters<typeof generateSapCp001Wave03Package>[0], seed);
  }
  return generateSapCp001Wave01Package(prototypeId as Parameters<typeof generateSapCp001Wave01Package>[0], seed);
}

function questionStateOf(pkg: DiscoveryPackage): SapCp001Wave02QuestionState | null {
  return "questionState" in pkg ? pkg.questionState : null;
}

function expressionOf(pkg: DiscoveryPackage): ExpressionNode | null {
  return "expression" in pkg ? pkg.expression : null;
}

function renderedExpressionOf(pkg: DiscoveryPackage): string | null {
  return "renderedExpression" in pkg ? pkg.renderedExpression : null;
}

function expressionEntries(pkg: DiscoveryPackage): readonly ExpressionEntry[] {
  if ("expression" in pkg) {
    return Object.freeze([{ label: "question expression", expression: pkg.expression }]);
  }

  const state = pkg.questionState;
  switch (state.kind) {
    case "COMPARISON":
      return Object.freeze([
        { label: "left expression", expression: state.leftExpression },
        { label: "right expression", expression: state.rightExpression },
      ]);
    case "EQUIVALENT_GROUPING":
      return Object.freeze([
        { label: "source expression", expression: state.sourceExpression },
        ...state.candidateExpressions.map((expression, index) => ({
          label: `candidate expression ${index + 1}`,
          expression,
        })),
      ]);
    case "FIRST_VALID_STEP":
      return Object.freeze([
        { label: "source expression", expression: state.sourceExpression },
        ...state.candidateAfterExpressions.map((expression, index) => ({
          label: `candidate first step ${index + 1}`,
          expression,
        })),
      ]);
    case "INCORRECT_CHAIN":
      return Object.freeze([
        { label: "source expression", expression: state.sourceExpression },
        ...state.chainExpressions.map((expression, index) => ({
          label: `worked step ${index + 1}`,
          expression,
        })),
      ]);
    case "PARTIAL_EVALUATION":
      return Object.freeze([
        { label: "source expression", expression: state.sourceExpression },
        { label: "declared subexpression", expression: state.declaredSubexpression },
        { label: "substituted expression", expression: state.substitutedExpression },
      ]);
  }
}

function independentEvidence(pkg: DiscoveryPackage): readonly SapCp001IndependentEvidence[] {
  return Object.freeze(expressionEntries(pkg).map(({ label, expression }) => {
    const evidence = evaluateIndependentEvidence(expression);
    return Object.freeze({
      label,
      value: formatRational(evidence.value),
      rpnTrace: evidence.rpnTrace,
    });
  }));
}

function lifecycleSnapshot(pkg: DiscoveryPackage): SapCp001EnglishCandidate["technicalDetails"]["lifecycle"] {
  return Object.freeze({
    permanentQlId: null,
    active: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  });
}

export function generateSapCp001EnglishCandidate(
  prototypeId: SapCp001PrototypeId,
  seed: number,
): SapCp001EnglishCandidate {
  assertPositiveInteger(seed, "SAP-CP-001 English candidate seed");
  if (!SAP_CP001_ALL_PROTOTYPE_IDS.includes(prototypeId as never)) {
    throw new Error(`Unknown SAP-CP-001 prototype: ${prototypeId}`);
  }

  const discovery = generateDiscoveryPackage(prototypeId, seed);
  if (!discovery.validation.ok) {
    throw new Error(
      `${prototypeId} seed ${seed} failed discovery validation: ${discovery.validation.errors.join("; ")}`,
    );
  }
  if (discovery.canonicalAnswer !== discovery.verifierAnswer) {
    throw new Error(`${prototypeId} seed ${seed} has inconsistent exact answers.`);
  }

  const questionState = questionStateOf(discovery);
  const expression = expressionOf(discovery);
  const stemResult = buildEnglishStem({
    prototypeId,
    seed,
    originalStem: discovery.stem,
    renderedExpression: renderedExpressionOf(discovery),
    questionState,
  });
  const options = polishEnglishOptions(discovery.options, discovery.answerSemantic);
  const explanation = buildEnglishExplanation(
    discovery.explanation,
    discovery.taskDirection,
    discovery.answerSemantic,
    discovery.canonicalAnswer,
    discovery.canonicalTrace,
    options,
  );

  return Object.freeze({
    packageId: "SAP-001",
    checkpointId: "SAP-CP-001",
    temporaryPrototypeId: prototypeId,
    proposedTemplateId: SAP_CP001_ENGLISH_TEMPLATE_MAP[prototypeId],
    permanentQlId: null,
    locale: "en-IN",
    seed,
    difficulty: discovery.difficulty,
    difficultyEvidence: discovery.difficultyEvidence,
    difficultyProfile: buildDifficultyProfile(prototypeId, discovery.difficulty),
    taskDirection: discovery.taskDirection,
    answerSemantic: discovery.answerSemantic,
    stemTemplateId: stemResult.stemTemplateId,
    stem: stemResult.stem,
    canonicalAnswer: discovery.canonicalAnswer,
    verifierAnswer: discovery.verifierAnswer,
    options,
    correctIndex: discovery.correctIndex,
    explanation,
    editorialStatus: "ENGLISH_MANUAL_FREEZE_APPROVED",
    reviewDecision: "APPROVE_FOR_ID_FREE_TEMPLATE_PROPOSAL",
    reviewComments: editorialReviewComments(prototypeId),
    technicalDetails: Object.freeze({
      originalStem: discovery.stem,
      expression,
      questionState,
      hiddenState: discovery.hiddenState,
      mathematicalFingerprint: discovery.mathematicalFingerprint,
      canonicalTrace: discovery.canonicalTrace,
      independentEvidence: independentEvidence(discovery),
      sourceAncestry: discovery.sourceAncestry,
      prototypeAncestry: discovery.prototypeAncestry,
      discoveryValidation: discovery.validation,
      lifecycle: lifecycleSnapshot(discovery),
    }),
  });
}

export function generateSapCp001EnglishSweep(
  seedsPerPrototype: number,
): readonly SapCp001EnglishCandidate[] {
  assertPositiveInteger(seedsPerPrototype, "SAP-CP-001 English sweep seeds per prototype");
  const candidates: SapCp001EnglishCandidate[] = [];
  for (const prototypeId of SAP_CP001_ALL_PROTOTYPE_IDS) {
    for (let seed = 1; seed <= seedsPerPrototype; seed += 1) {
      candidates.push(generateSapCp001EnglishCandidate(prototypeId, seed));
    }
  }
  return Object.freeze(candidates);
}
