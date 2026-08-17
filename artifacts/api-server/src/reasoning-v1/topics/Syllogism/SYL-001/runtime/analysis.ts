import { collectTerms, normalizePremises } from "../foundation/normalization";
import { solveConstraintSatisfiability } from "../foundation/primary-solver";
import { verifySolverAgreement } from "../foundation/solver-agreement";
import type {
  CanonicalCategoricalForm,
  CanonicalConclusion,
  PrimitiveConstraint,
  SurfacePremise,
  TermId,
} from "../foundation/types";
import type {
  EvaluatedConclusion,
  PairClassificationStatus,
  PairSemanticStatus,
  ScenarioAnalysis,
  SylScenarioSpec,
} from "./types";

const FORMS: readonly CanonicalCategoricalForm[] = ["ALL", "NO", "SOME", "SOME_NOT"];
const ANALYSIS_CACHE = new Map<string, ScenarioAnalysis>();

function conclusionKey(conclusion: CanonicalConclusion): string {
  return `${conclusion.form}:${conclusion.subject}:${conclusion.predicate}`;
}

function directPremiseConclusionKeys(premise: SurfacePremise): readonly string[] {
  const subject = premise.subject;
  const predicate = premise.predicate;
  const key = (form: CanonicalCategoricalForm, left: TermId, right: TermId): string =>
    `${form}:${left}:${right}`;

  switch (premise.form) {
    case "ALL":
      return [key("ALL", subject, predicate)];
    case "NO":
      return [key("NO", subject, predicate), key("NO", predicate, subject)];
    case "SOME":
    case "A_FEW":
      return [key("SOME", subject, predicate), key("SOME", predicate, subject)];
    case "SOME_NOT":
    case "NOT_ALL":
      return [key("SOME_NOT", subject, predicate)];
    case "ONLY":
      return [key("ALL", predicate, subject)];
    case "ARE_ONLY":
      return [key("ALL", subject, predicate)];
    case "ONLY_A_FEW":
      return [
        key("SOME", subject, predicate),
        key("SOME", predicate, subject),
        key("SOME_NOT", subject, predicate),
      ];
    case "IDENTITY":
      return [key("ALL", subject, predicate), key("ALL", predicate, subject)];
    case "FEW":
      return [];
  }
}

export function conclusionDirectlyRestatesPremise(
  premises: readonly SurfacePremise[],
  conclusion: CanonicalConclusion,
): boolean {
  const target = conclusionKey(conclusion);
  return premises.some((premise) => directPremiseConclusionKeys(premise).includes(target));
}

function modelSignature(model: EvaluatedConclusion["profile"]["witnessModel"]): string {
  if (!model) return "NONE";
  return model.occupiedRegions.map((region) => region.mask).sort((a, b) => a - b).join(",");
}

function verdictSignature(profile: EvaluatedConclusion["profile"]): string {
  return `${profile.classification}:${profile.canBeTrue}:${profile.canBeFalse}`;
}

function profileSignature(profile: EvaluatedConclusion["profile"]): string {
  return `${verdictSignature(profile)}:W=${modelSignature(profile.witnessModel)}:C=${modelSignature(profile.counterModel)}`;
}

function makePremises(scenario: SylScenarioSpec): readonly SurfacePremise[] {
  return scenario.premises.map((premise, index) => ({
    premiseId: `${scenario.scenarioId}-P${index + 1}`,
    ...premise,
  }));
}

function makeCandidateConclusions(termOrder: readonly TermId[]): readonly CanonicalConclusion[] {
  const results: CanonicalConclusion[] = [];
  for (const subject of termOrder) {
    for (const predicate of termOrder) {
      if (subject === predicate) continue;
      for (const form of FORMS) {
        results.push({
          conclusionId: `C-${form}-${subject}-${predicate}`,
          form,
          subject,
          predicate,
        });
      }
    }
  }
  return results;
}

export function analyzeScenario(scenario: SylScenarioSpec): ScenarioAnalysis {
  const cached = ANALYSIS_CACHE.get(scenario.scenarioId);
  if (cached) return cached;

  const premises = makePremises(scenario);
  const constraints = normalizePremises(premises);
  const termOrder = collectTerms(constraints);
  const premiseResult = solveConstraintSatisfiability(constraints, termOrder);
  if (!premiseResult.satisfiable) {
    throw new Error(`Scenario ${scenario.scenarioId} has inconsistent premises: ${premiseResult.reason ?? "unknown"}.`);
  }

  const candidates: EvaluatedConclusion[] = [];
  for (const conclusion of makeCandidateConclusions(termOrder)) {
    const agreement = verifySolverAgreement(constraints, conclusion, termOrder);
    if (!agreement.agreed) {
      throw new Error(`Solver disagreement for ${scenario.scenarioId}/${conclusionKey(conclusion)}.`);
    }

    const impactPremiseIds: string[] = [];
    const verdictImpactPremiseIds: string[] = [];
    for (const premise of premises) {
      const reducedConstraints = constraints.filter((constraint) => constraint.originId !== premise.premiseId);
      const reducedResult = solveConstraintSatisfiability(reducedConstraints, termOrder);
      if (!reducedResult.satisfiable) continue;
      const reducedAgreement = verifySolverAgreement(reducedConstraints, conclusion, termOrder);
      if (!reducedAgreement.agreed) {
        throw new Error(`Reduced solver disagreement for ${scenario.scenarioId}/${conclusionKey(conclusion)}.`);
      }
      if (verdictSignature(reducedAgreement.primary) !== verdictSignature(agreement.primary)) {
        verdictImpactPremiseIds.push(premise.premiseId);
        impactPremiseIds.push(premise.premiseId);
      } else if (profileSignature(reducedAgreement.primary) !== profileSignature(agreement.primary)) {
        impactPremiseIds.push(premise.premiseId);
      }
    }

    candidates.push({
      conclusion,
      profile: agreement.primary,
      impactPremiseIds,
      verdictImpactPremiseIds,
    });
  }

  const analysis: ScenarioAnalysis = {
    scenario,
    premises,
    termOrder,
    candidates: candidates.sort((left, right) =>
      conclusionKey(left.conclusion).localeCompare(conclusionKey(right.conclusion))),
  };
  ANALYSIS_CACHE.set(scenario.scenarioId, analysis);
  return analysis;
}

function trueScenarios(conclusion: CanonicalConclusion): readonly (readonly PrimitiveConstraint[])[] {
  const originId = `${conclusion.conclusionId}:PAIR_TRUE`;
  switch (conclusion.form) {
    case "ALL":
      return [[
        { kind: "ALL", subject: conclusion.subject, predicate: conclusion.predicate, originId },
        { kind: "EXISTS", term: conclusion.subject, originId },
      ]];
    case "NO":
      return [[
        { kind: "NO", subject: conclusion.subject, predicate: conclusion.predicate, originId },
        { kind: "EXISTS", term: conclusion.subject, originId },
        { kind: "EXISTS", term: conclusion.predicate, originId },
      ]];
    case "SOME":
      return [[{ kind: "SOME", subject: conclusion.subject, predicate: conclusion.predicate, originId }]];
    case "SOME_NOT":
      return [[{ kind: "SOME_NOT", subject: conclusion.subject, predicate: conclusion.predicate, originId }]];
  }
}

function falseScenarios(conclusion: CanonicalConclusion): readonly (readonly PrimitiveConstraint[])[] {
  const originId = `${conclusion.conclusionId}:PAIR_FALSE`;
  switch (conclusion.form) {
    case "ALL":
      return [
        [{ kind: "EMPTY", term: conclusion.subject, originId }],
        [{ kind: "SOME_NOT", subject: conclusion.subject, predicate: conclusion.predicate, originId }],
      ];
    case "NO":
      return [
        [{ kind: "EMPTY", term: conclusion.subject, originId }],
        [{ kind: "EMPTY", term: conclusion.predicate, originId }],
        [{ kind: "SOME", subject: conclusion.subject, predicate: conclusion.predicate, originId }],
      ];
    case "SOME":
      return [[{ kind: "NO", subject: conclusion.subject, predicate: conclusion.predicate, originId }]];
    case "SOME_NOT":
      return [[{ kind: "ALL", subject: conclusion.subject, predicate: conclusion.predicate, originId }]];
  }
}

function anyJointScenario(
  premises: readonly PrimitiveConstraint[],
  firstScenarios: readonly (readonly PrimitiveConstraint[])[],
  secondScenarios: readonly (readonly PrimitiveConstraint[])[],
  termOrder: readonly TermId[],
): boolean {
  for (const first of firstScenarios) {
    for (const second of secondScenarios) {
      if (solveConstraintSatisfiability([...premises, ...first, ...second], termOrder).satisfiable) {
        return true;
      }
    }
  }
  return false;
}

export function isGenuineEitherOr(
  analysis: ScenarioAnalysis,
  first: EvaluatedConclusion,
  second: EvaluatedConclusion,
): boolean {
  const firstForm = first.conclusion.form;
  const secondForm = second.conclusion.form;
  const complementaryForms =
    (firstForm === "ALL" && secondForm === "SOME_NOT")
    || (firstForm === "SOME_NOT" && secondForm === "ALL")
    || (firstForm === "NO" && secondForm === "SOME")
    || (firstForm === "SOME" && secondForm === "NO");
  if (!complementaryForms) return false;
  if (
    first.conclusion.subject !== second.conclusion.subject
    || first.conclusion.predicate !== second.conclusion.predicate
  ) return false;
  if (first.profile.classification === "ENTAILED" || second.profile.classification === "ENTAILED") {
    return false;
  }
  if (!first.profile.canBeTrue || !second.profile.canBeTrue) return false;

  const premises = normalizePremises(analysis.premises);
  const bothTrue = anyJointScenario(
    premises,
    trueScenarios(first.conclusion),
    trueScenarios(second.conclusion),
    analysis.termOrder,
  );
  const bothFalse = anyJointScenario(
    premises,
    falseScenarios(first.conclusion),
    falseScenarios(second.conclusion),
    analysis.termOrder,
  );
  return !bothTrue && !bothFalse;
}

export function pairSemanticStatus(
  analysis: ScenarioAnalysis,
  first: EvaluatedConclusion,
  second: EvaluatedConclusion,
  allowEitherOr: boolean,
): PairSemanticStatus {
  const firstFollows = first.profile.classification === "ENTAILED";
  const secondFollows = second.profile.classification === "ENTAILED";
  if (firstFollows && secondFollows) return "BOTH_FOLLOW";
  if (firstFollows) return "ONLY_FIRST_FOLLOWS";
  if (secondFollows) return "ONLY_SECOND_FOLLOWS";
  if (allowEitherOr && isGenuineEitherOr(analysis, first, second)) return "EITHER_OR_FOLLOWS";
  return "NEITHER_FOLLOWS";
}

export function pairClassificationStatus(
  analysis: ScenarioAnalysis,
  first: EvaluatedConclusion,
  second: EvaluatedConclusion,
): PairClassificationStatus {
  if (isGenuineEitherOr(analysis, first, second)) return "EITHER_OR";
  const firstFollows = first.profile.classification === "ENTAILED";
  const secondFollows = second.profile.classification === "ENTAILED";
  if (firstFollows && secondFollows) return "BOTH_FOLLOW";
  if (firstFollows) return "ONLY_FIRST_FOLLOWS";
  if (secondFollows) return "ONLY_SECOND_FOLLOWS";
  return "NO_COMPLEMENTARY_RELATION";
}

export function selectedPremisesAreRelevant(
  analysis: ScenarioAnalysis,
  selected: readonly EvaluatedConclusion[],
  mode: "VERDICT" | "MODEL_SPACE" = "VERDICT",
): boolean {
  const impacted = new Set(selected.flatMap((candidate) =>
    mode === "VERDICT" ? candidate.verdictImpactPremiseIds : candidate.impactPremiseIds));
  return analysis.premises.every((premise) => impacted.has(premise.premiseId));
}

export function conclusionSemanticKey(candidate: EvaluatedConclusion): string {
  return conclusionKey(candidate.conclusion);
}
