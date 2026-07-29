import type { MalAnswerSemantic, MalTaskDirection } from "./types";
import type { MalCp001DiscoveryPrototypeId } from "./cp001-gap-registry";
import type { MalCp001FreezeCandidateId } from "./cp001-freeze-candidate-ledger";

export const MAL_CP001_PROVISIONAL_SOLVE_MODE_IDS = [
  "MAL-CP001-SM-TARGET-RATIO",
  "MAL-CP001-SM-FINAL-MEAN",
  "MAL-CP001-SM-UNKNOWN-SOURCE-WEIGHTED-BALANCE",
  "MAL-CP001-SM-UNKNOWN-SOURCE-RATIO-EVIDENCE",
  "MAL-CP001-SM-UNKNOWN-COMPONENT-QUANTITY",
  "MAL-CP001-SM-RATIO-SCALE-FROM-TOTAL",
  "MAL-CP001-SM-TWO-STAGE-FINAL-MEAN",
] as const;

export type MalCp001ProvisionalSolveModeId =
  (typeof MAL_CP001_PROVISIONAL_SOLVE_MODE_IDS)[number];

export const MAL_CP001_PROVISIONAL_QL_TEMPLATE_IDS = [
  "MAL-CP001-QLC-TARGET-RATIO",
  "MAL-CP001-QLC-FINAL-MEAN-EXPLICIT-TWO",
  "MAL-CP001-QLC-FINAL-MEAN-RATIO",
  "MAL-CP001-QLC-FINAL-MEAN-MULTI-COMPONENT",
  "MAL-CP001-QLC-UNKNOWN-SOURCE-QUANTITY-EVIDENCE",
  "MAL-CP001-QLC-UNKNOWN-SOURCE-RATIO-EVIDENCE",
  "MAL-CP001-QLC-UNKNOWN-QUANTITY-ONE-KNOWN",
  "MAL-CP001-QLC-UNKNOWN-QUANTITY-MULTI-KNOWN",
  "MAL-CP001-QLC-RATIO-SCALE-BOTH-QUANTITIES",
  "MAL-CP001-QLC-RATIO-SCALE-REQUESTED-SHARE",
  "MAL-CP001-QLC-TWO-STAGE-FINAL-MEAN",
] as const;

export type MalCp001ProvisionalQlTemplateId =
  (typeof MAL_CP001_PROVISIONAL_QL_TEMPLATE_IDS)[number];

export type MalCp001QlSplitDimension =
  | "ANSWER_SHAPE"
  | "EVIDENCE_TOPOLOGY"
  | "QUESTION_LANGUAGE"
  | "MISCONCEPTION_STRATEGY"
  | "EXPLANATION_SEQUENCE"
  | "VALIDATOR_CONTRACT";

export interface MalCp001ProvisionalSolveMode {
  solveModeId: MalCp001ProvisionalSolveModeId;
  learnerOperation: string;
  canonicalMethod: string;
  invariant: string;
  provisional: true;
}

export interface MalCp001ProvisionalQlTemplate {
  qlTemplateId: MalCp001ProvisionalQlTemplateId;
  solveModeId: MalCp001ProvisionalSolveModeId;
  freezeCandidateId: MalCp001FreezeCandidateId;
  prototypeIds: readonly MalCp001DiscoveryPrototypeId[];
  taskDirection: MalTaskDirection;
  answerSemantic: MalAnswerSemantic;
  evidenceTopology: string;
  questionLanguageContract: string;
  validatorContract: string;
  misconceptionStrategy: string;
  explanationStrategy: string;
  splitDimensions: readonly MalCp001QlSplitDimension[];
  mergeOrSplitRationale: string;
  provisionalStatus: "EXECUTABLE_EXPANSION_FRONTIER";
  permanentQlId: null;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}

export const MAL_CP001_PROVISIONAL_SOLVE_MODES:
  readonly MalCp001ProvisionalSolveMode[] = [
    {
      solveModeId: "MAL-CP001-SM-TARGET-RATIO",
      learnerOperation: "Find the required ratio of two source components from their values and a target mean.",
      canonicalMethod: "Alligation cross with opposite differences.",
      invariant: "qL:qH = (H-M):(M-L).",
      provisional: true,
    },
    {
      solveModeId: "MAL-CP001-SM-FINAL-MEAN",
      learnerOperation: "Find the final mean value from complete source contributions.",
      canonicalMethod: "Weighted total divided by total quantity.",
      invariant: "M = sum(q_i v_i) / sum(q_i).",
      provisional: true,
    },
    {
      solveModeId: "MAL-CP001-SM-UNKNOWN-SOURCE-WEIGHTED-BALANCE",
      learnerOperation: "Recover one unknown source value from explicit quantities and a target mean.",
      canonicalMethod: "Target weighted total minus known weighted contribution.",
      invariant: "q_k v_k + q_x v_x = (q_k+q_x)M.",
      provisional: true,
    },
    {
      solveModeId: "MAL-CP001-SM-UNKNOWN-SOURCE-RATIO-EVIDENCE",
      learnerOperation: "Recover one unknown source value from a source ratio and target mean.",
      canonicalMethod: "Reverse alligation or ratio-weighted mean isolation.",
      invariant: "r_L L + r_H H = (r_L+r_H)M.",
      provisional: true,
    },
    {
      solveModeId: "MAL-CP001-SM-UNKNOWN-COMPONENT-QUANTITY",
      learnerOperation: "Recover one missing component quantity in a static target-mean balance.",
      canonicalMethod: "Preserve all known weighted contributions and isolate x.",
      invariant: "W_k + x v_x = (Q_k+x)M.",
      provisional: true,
    },
    {
      solveModeId: "MAL-CP001-SM-RATIO-SCALE-FROM-TOTAL",
      learnerOperation: "Derive an alligation ratio, scale it from a stated total, and return the requested quantity output.",
      canonicalMethod: "Alligation ratio followed by common-scale projection.",
      invariant: "qL:qH = a:b and qL+qH = Q.",
      provisional: true,
    },
    {
      solveModeId: "MAL-CP001-SM-TWO-STAGE-FINAL-MEAN",
      learnerOperation: "Collapse a completed first blend to its mean, then compute the final second-stage mean.",
      canonicalMethod: "Intermediate weighted mean followed by a second weighted mean.",
      invariant: "M1 = W1/Q1, then M2 = (q_p M1 + q_f v_f)/(q_p+q_f).",
      provisional: true,
    },
  ] as const;

/**
 * Count-bearing expansion frontier only. These are provisional QL-template
 * families and solve modes, not permanent QLs or a frozen inventory.
 */
export const MAL_CP001_PROVISIONAL_QL_TEMPLATES:
  readonly MalCp001ProvisionalQlTemplate[] = [
    {
      qlTemplateId: "MAL-CP001-QLC-TARGET-RATIO",
      solveModeId: "MAL-CP001-SM-TARGET-RATIO",
      freezeCandidateId: "MAL-CP001-FREEZE-TARGET-RATIO",
      prototypeIds: ["MAL-CP001-PROT-RATIO-FROM-TARGET"],
      taskDirection: "FORWARD",
      answerSemantic: "COMPONENT_RATIO",
      evidenceTopology: "Two source values plus one target mean; no absolute quantity scale.",
      questionLanguageContract: "Ask for the lower-source to higher-source mixing ratio in an explicit order.",
      validatorContract: "Reduced ordered rational ratio with exactly one canonical orientation.",
      misconceptionStrategy: "Reverse ratio, same-side differences, equal split and source-gap-as-ratio.",
      explanationStrategy: "Show opposite differences, attach each to the opposite source and verify the target mean.",
      splitDimensions: ["ANSWER_SHAPE", "VALIDATOR_CONTRACT", "MISCONCEPTION_STRATEGY"],
      mergeOrSplitRationale: "The ordered ratio answer and alligation-specific validator are materially distinct from every quantity or value output.",
      provisionalStatus: "EXECUTABLE_EXPANSION_FRONTIER",
      permanentQlId: null,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
    },
    {
      qlTemplateId: "MAL-CP001-QLC-FINAL-MEAN-EXPLICIT-TWO",
      solveModeId: "MAL-CP001-SM-FINAL-MEAN",
      freezeCandidateId: "MAL-CP001-FREEZE-FINAL-MEAN",
      prototypeIds: ["MAL-CP001-PROT-MEAN-FROM-QUANTITIES"],
      taskDirection: "FORWARD",
      answerSemantic: "FINAL_MEAN_VALUE",
      evidenceTopology: "Two explicit component quantities and per-unit values.",
      questionLanguageContract: "Present two complete source contributions and ask for the resulting per-unit value.",
      validatorContract: "Exact weighted mean in the context value unit.",
      misconceptionStrategy: "Simple average, swapped quantities and reporting one source value.",
      explanationStrategy: "Compute both weighted contributions, total them and divide by total quantity.",
      splitDimensions: ["EVIDENCE_TOPOLOGY", "MISCONCEPTION_STRATEGY", "QUESTION_LANGUAGE"],
      mergeOrSplitRationale: "It shares the final-mean solve mode but needs a two-source contribution template and two-source misconception package.",
      provisionalStatus: "EXECUTABLE_EXPANSION_FRONTIER",
      permanentQlId: null,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
    },
    {
      qlTemplateId: "MAL-CP001-QLC-FINAL-MEAN-RATIO",
      solveModeId: "MAL-CP001-SM-FINAL-MEAN",
      freezeCandidateId: "MAL-CP001-FREEZE-FINAL-MEAN",
      prototypeIds: ["MAL-CP001-PROT-MEAN-FROM-RATIO"],
      taskDirection: "FORWARD",
      answerSemantic: "FINAL_MEAN_VALUE",
      evidenceTopology: "Two source values with a stated component ratio rather than absolute quantities.",
      questionLanguageContract: "State the ordered source ratio and ask for the resulting mean value.",
      validatorContract: "Exact ratio-weighted mean in the context value unit.",
      misconceptionStrategy: "Simple average, ratio reversal and reporting a source value.",
      explanationStrategy: "Treat ratio parts as proportional quantities and evaluate the weighted mean.",
      splitDimensions: ["EVIDENCE_TOPOLOGY", "QUESTION_LANGUAGE", "MISCONCEPTION_STRATEGY"],
      mergeOrSplitRationale: "The solver invariant is shared, but ratio evidence requires an order-sensitive stem and different distractors from explicit quantities.",
      provisionalStatus: "EXECUTABLE_EXPANSION_FRONTIER",
      permanentQlId: null,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
    },
    {
      qlTemplateId: "MAL-CP001-QLC-FINAL-MEAN-MULTI-COMPONENT",
      solveModeId: "MAL-CP001-SM-FINAL-MEAN",
      freezeCandidateId: "MAL-CP001-FREEZE-FINAL-MEAN",
      prototypeIds: ["MAL-CP001-PROT-THREE-COMPONENT-MEAN"],
      taskDirection: "FORWARD",
      answerSemantic: "FINAL_MEAN_VALUE",
      evidenceTopology: "Three or more complete source contributions.",
      questionLanguageContract: "Render a grammatically stable multi-component list and ask for one final mean.",
      validatorContract: "Exact weighted mean over every listed component.",
      misconceptionStrategy: "Simple average, omission of one component and reporting a source value.",
      explanationStrategy: "Audit every source contribution before summing the weighted total and quantity.",
      splitDimensions: ["EVIDENCE_TOPOLOGY", "MISCONCEPTION_STRATEGY", "EXPLANATION_SEQUENCE", "QUESTION_LANGUAGE"],
      mergeOrSplitRationale: "Multi-component list rendering and omission-based misconceptions are material enough to separate the template while preserving the same solve mode.",
      provisionalStatus: "EXECUTABLE_EXPANSION_FRONTIER",
      permanentQlId: null,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
    },
    {
      qlTemplateId: "MAL-CP001-QLC-UNKNOWN-SOURCE-QUANTITY-EVIDENCE",
      solveModeId: "MAL-CP001-SM-UNKNOWN-SOURCE-WEIGHTED-BALANCE",
      freezeCandidateId: "MAL-CP001-FREEZE-UNKNOWN-SOURCE-VALUE",
      prototypeIds: ["MAL-CP001-PROT-UNKNOWN-SOURCE-VALUE"],
      taskDirection: "INVERSE",
      answerSemantic: "SOURCE_VALUE",
      evidenceTopology: "Known source quantity/value, unknown-source quantity and target mean.",
      questionLanguageContract: "Name the unknown source and ask for its per-unit value.",
      validatorContract: "Exact isolated source value in the context value unit.",
      misconceptionStrategy: "Report target, report known source, or apply an unweighted target difference.",
      explanationStrategy: "Construct the required target weighted total, subtract the known contribution and divide by the unknown quantity.",
      splitDimensions: ["EVIDENCE_TOPOLOGY", "EXPLANATION_SEQUENCE", "MISCONCEPTION_STRATEGY"],
      mergeOrSplitRationale: "Explicit quantity evidence drives a weighted-total isolation path that differs materially from ratio-based reverse alligation.",
      provisionalStatus: "EXECUTABLE_EXPANSION_FRONTIER",
      permanentQlId: null,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
    },
    {
      qlTemplateId: "MAL-CP001-QLC-UNKNOWN-SOURCE-RATIO-EVIDENCE",
      solveModeId: "MAL-CP001-SM-UNKNOWN-SOURCE-RATIO-EVIDENCE",
      freezeCandidateId: "MAL-CP001-FREEZE-UNKNOWN-SOURCE-VALUE",
      prototypeIds: ["MAL-CP001-PROT-SOURCE-VALUE-FROM-RATIO"],
      taskDirection: "INVERSE",
      answerSemantic: "SOURCE_VALUE",
      evidenceTopology: "One source value, target mean and an ordered source ratio.",
      questionLanguageContract: "State which ratio part belongs to the known and unknown source before asking for the missing value.",
      validatorContract: "Exact isolated source value with ratio orientation preserved.",
      misconceptionStrategy: "Report target, report known source, reverse ratio ownership or use a ratio part as a value.",
      explanationStrategy: "Translate ratio parts into proportional weighted contributions and isolate the missing source value.",
      splitDimensions: ["EVIDENCE_TOPOLOGY", "QUESTION_LANGUAGE", "EXPLANATION_SEQUENCE", "MISCONCEPTION_STRATEGY"],
      mergeOrSplitRationale: "The answer semantic is shared, but the learner equation, ratio ownership and error model form a separate solve mode and template.",
      provisionalStatus: "EXECUTABLE_EXPANSION_FRONTIER",
      permanentQlId: null,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
    },
    {
      qlTemplateId: "MAL-CP001-QLC-UNKNOWN-QUANTITY-ONE-KNOWN",
      solveModeId: "MAL-CP001-SM-UNKNOWN-COMPONENT-QUANTITY",
      freezeCandidateId: "MAL-CP001-FREEZE-UNKNOWN-COMPONENT-QUANTITY",
      prototypeIds: [
        "MAL-CP001-PROT-UNKNOWN-COMPONENT-QUANTITY",
        "MAL-CP001-PROT-ADDED-QUANTITY-FOR-TARGET",
      ],
      taskDirection: "INVERSE",
      answerSemantic: "COMPONENT_QUANTITY",
      evidenceTopology: "One complete known source plus one unknown quantity at a known value.",
      questionLanguageContract: "Support static-used and must-be-added framing without changing the named unknown component or equation.",
      validatorContract: "Exact positive component quantity in the context quantity unit.",
      misconceptionStrategy: "Report known quantity, report final total or use the difference between known and required quantities.",
      explanationStrategy: "Keep the known weighted contribution intact and isolate the unknown quantity from the target balance.",
      splitDimensions: ["EVIDENCE_TOPOLOGY", "VALIDATOR_CONTRACT", "MISCONCEPTION_STRATEGY"],
      mergeOrSplitRationale: "Addition wording is a framing variant of the same one-known-source equation and must not inflate QL count.",
      provisionalStatus: "EXECUTABLE_EXPANSION_FRONTIER",
      permanentQlId: null,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
    },
    {
      qlTemplateId: "MAL-CP001-QLC-UNKNOWN-QUANTITY-MULTI-KNOWN",
      solveModeId: "MAL-CP001-SM-UNKNOWN-COMPONENT-QUANTITY",
      freezeCandidateId: "MAL-CP001-FREEZE-UNKNOWN-COMPONENT-QUANTITY",
      prototypeIds: ["MAL-CP001-PROT-THIRD-COMPONENT-QUANTITY"],
      taskDirection: "INVERSE",
      answerSemantic: "COMPONENT_QUANTITY",
      evidenceTopology: "Two or more complete known sources plus one unknown quantity at a known value.",
      questionLanguageContract: "Render every known contribution and explicitly ask for the named additional component quantity.",
      validatorContract: "Exact positive component quantity after aggregating all known contributions.",
      misconceptionStrategy: "Omit one known source, report total known quantity or report one known source quantity.",
      explanationStrategy: "Aggregate the known weighted state first, then isolate the unknown quantity from the target balance.",
      splitDimensions: ["EVIDENCE_TOPOLOGY", "QUESTION_LANGUAGE", "MISCONCEPTION_STRATEGY", "EXPLANATION_SEQUENCE"],
      mergeOrSplitRationale: "The solve mode is shared, but the multi-source evidence list and omission traps require a separate template family.",
      provisionalStatus: "EXECUTABLE_EXPANSION_FRONTIER",
      permanentQlId: null,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
    },
    {
      qlTemplateId: "MAL-CP001-QLC-RATIO-SCALE-BOTH-QUANTITIES",
      solveModeId: "MAL-CP001-SM-RATIO-SCALE-FROM-TOTAL",
      freezeCandidateId: "MAL-CP001-FREEZE-QUANTITIES-FROM-RATIO-SCALE",
      prototypeIds: ["MAL-CP001-PROT-TWO-QUANTITIES-FROM-TOTAL"],
      taskDirection: "RECONSTRUCTION",
      answerSemantic: "COMPONENT_QUANTITY_PAIR",
      evidenceTopology: "Two source values, target mean and total quantity; both source quantities requested.",
      questionLanguageContract: "Name both components, state their answer order and require a labelled ordered pair.",
      validatorContract: "Two labelled positive quantities whose sum and weighted mean both verify.",
      misconceptionStrategy: "Reverse the pair, assume equal split or use a plausible but incorrect scale.",
      explanationStrategy: "Derive the alligation ratio, total its parts and project both labelled quantities.",
      splitDimensions: ["ANSWER_SHAPE", "QUESTION_LANGUAGE", "VALIDATOR_CONTRACT", "MISCONCEPTION_STRATEGY"],
      mergeOrSplitRationale: "Returning both quantities creates an ordered-pair validator and option contract that cannot safely share the scalar requested-share template.",
      provisionalStatus: "EXECUTABLE_EXPANSION_FRONTIER",
      permanentQlId: null,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
    },
    {
      qlTemplateId: "MAL-CP001-QLC-RATIO-SCALE-REQUESTED-SHARE",
      solveModeId: "MAL-CP001-SM-RATIO-SCALE-FROM-TOTAL",
      freezeCandidateId: "MAL-CP001-FREEZE-QUANTITIES-FROM-RATIO-SCALE",
      prototypeIds: ["MAL-CP001-PROT-COMPONENT-SHARE-FROM-TARGET"],
      taskDirection: "RECONSTRUCTION",
      answerSemantic: "COMPONENT_QUANTITY",
      evidenceTopology: "Two source values, target mean and total quantity; one named side requested.",
      questionLanguageContract: "State the requested lower or higher component explicitly and ask for one quantity.",
      validatorContract: "One labelled positive quantity projected from the correctly oriented ratio.",
      misconceptionStrategy: "Return the opposite component, return a ratio part or assume equal split.",
      explanationStrategy: "Derive the alligation ratio, scale it to the total and project only the requested side.",
      splitDimensions: ["ANSWER_SHAPE", "QUESTION_LANGUAGE", "VALIDATOR_CONTRACT", "MISCONCEPTION_STRATEGY"],
      mergeOrSplitRationale: "It shares the ratio-scaling solve mode, but the scalar answer and opposite-side misconception require a separate QL template.",
      provisionalStatus: "EXECUTABLE_EXPANSION_FRONTIER",
      permanentQlId: null,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
    },
    {
      qlTemplateId: "MAL-CP001-QLC-TWO-STAGE-FINAL-MEAN",
      solveModeId: "MAL-CP001-SM-TWO-STAGE-FINAL-MEAN",
      freezeCandidateId: "MAL-CP001-FREEZE-TWO-STAGE-FINAL-MEAN",
      prototypeIds: ["MAL-CP001-PROT-TWO-STAGE-BLEND-MEAN"],
      taskDirection: "FORWARD",
      answerSemantic: "FINAL_MEAN_VALUE",
      evidenceTopology: "A completed first blend, a stated portion of it and one second-stage source.",
      questionLanguageContract: "Make the first blend and transferred portion explicit before asking for the final mean.",
      validatorContract: "Exact second-stage mean after independently verifying the intermediate mean.",
      misconceptionStrategy: "Report the first-stage mean, average stage means simply or omit one first-stage component.",
      explanationStrategy: "Calculate and verify the first-stage mean, treat the transferred portion as homogeneous, then perform the second weighted balance.",
      splitDimensions: ["EVIDENCE_TOPOLOGY", "EXPLANATION_SEQUENCE", "MISCONCEPTION_STRATEGY", "VALIDATOR_CONTRACT"],
      mergeOrSplitRationale: "The compulsory intermediate-state derivation is a materially distinct learner burden and solve mode.",
      provisionalStatus: "EXECUTABLE_EXPANSION_FRONTIER",
      permanentQlId: null,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
    },
  ] as const;

const templateById = new Map<MalCp001ProvisionalQlTemplateId, MalCp001ProvisionalQlTemplate>(
  MAL_CP001_PROVISIONAL_QL_TEMPLATES.map((entry) => [entry.qlTemplateId, entry]),
);

export function getMalCp001ProvisionalQlTemplate(
  qlTemplateId: MalCp001ProvisionalQlTemplateId,
): MalCp001ProvisionalQlTemplate {
  const entry = templateById.get(qlTemplateId);
  if (!entry) throw new Error(`Missing MAL-CP-001 provisional QL template ${qlTemplateId}.`);
  return entry;
}
