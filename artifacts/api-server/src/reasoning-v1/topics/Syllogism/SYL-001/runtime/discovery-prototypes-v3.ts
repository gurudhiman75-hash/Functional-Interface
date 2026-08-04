import { normalizePremises } from "../foundation/normalization";
import { classifyConclusionPrimary, solveConstraintSatisfiability } from "../foundation/primary-solver";
import { canonicalModel, modelSatisfiesConstraints } from "../foundation/region-model";
import type {
  CanonicalConclusion,
  CanonicalModel,
  SurfacePremise,
  TermId,
} from "../foundation/types";

export type SylDiscoveryDecisionV3 =
  | "IMPLEMENTED_EXECUTABLE_PROTOTYPE"
  | "GOVERNED_EXCLUSION"
  | "REJECT_FROM_GENERATED_POOL";

export interface SylDiscoveryPrototypeV3 {
  prototypeId: string;
  permanentQlId: null;
  decision: SylDiscoveryDecisionV3;
  title: string;
  rationale: string;
  premises: readonly SurfacePremise[];
  conclusion: CanonicalConclusion | null;
  evidence: Readonly<Record<string, unknown>>;
}

function premise(
  premiseId: string,
  form: SurfacePremise["form"],
  subject: TermId,
  predicate: TermId,
): SurfacePremise {
  return { premiseId, form, subject, predicate };
}

function conclusion(
  conclusionId: string,
  form: CanonicalConclusion["form"],
  subject: TermId,
  predicate: TermId,
): CanonicalConclusion {
  return { conclusionId, form, subject, predicate };
}

function modelMasks(model: CanonicalModel): readonly number[] {
  return model.occupiedRegions.map((region) => region.mask);
}

const sameDifferentPremises = [
  premise("WD-P1", "SOME", "A", "B"),
  premise("WD-P2", "SOME", "B", "C"),
] as const;
const sameDifferentConstraints = normalizePremises(sameDifferentPremises);
const sameDifferentTerms = ["A", "B", "C"] as const;
const sameWitnessModel = canonicalModel(sameDifferentTerms, [0b111]);
const differentWitnessModel = canonicalModel(sameDifferentTerms, [0b011, 0b110]);
const sameDifferentConclusion = conclusion("WD-C1", "SOME", "A", "C");
const sameDifferentProfile = classifyConclusionPrimary(
  sameDifferentConstraints,
  sameDifferentConclusion,
  sameDifferentTerms,
);

const threeWitnessPremises = [
  premise("TW-P1", "SOME", "A", "B"),
  premise("TW-P2", "SOME", "C", "D"),
  premise("TW-P3", "SOME_NOT", "E", "A"),
  premise("TW-P4", "NO", "A", "C"),
  premise("TW-P5", "NO", "E", "C"),
] as const;
const threeWitnessConstraints = normalizePremises(threeWitnessPremises);
const threeWitnessTerms = ["A", "B", "C", "D", "E"] as const;
const threeWitnessResult = solveConstraintSatisfiability(threeWitnessConstraints, threeWitnessTerms);

const inconsistentPremises = [
  premise("IC-P1", "ALL", "A", "B"),
  premise("IC-P2", "NO", "A", "B"),
] as const;
const inconsistentResult = solveConstraintSatisfiability(
  normalizePremises(inconsistentPremises),
  ["A", "B"],
);

const irrelevantPremises = [
  premise("IR-P1", "SOME", "A", "B"),
  premise("IR-P2", "ALL", "B", "C"),
  premise("IR-P3", "NO", "D", "E"),
] as const;
const irrelevantConclusion = conclusion("IR-C1", "SOME", "A", "C");
const irrelevantFull = classifyConclusionPrimary(
  normalizePremises(irrelevantPremises),
  irrelevantConclusion,
  ["A", "B", "C", "D", "E"],
);
const irrelevantReduced = classifyConclusionPrimary(
  normalizePremises(irrelevantPremises.slice(0, 2)),
  irrelevantConclusion,
  ["A", "B", "C", "D", "E"],
);

const redundantPremises = [
  premise("RD-P1", "ALL", "A", "B"),
  premise("RD-P2", "ALL", "B", "C"),
  premise("RD-P3", "ALL", "A", "C"),
] as const;
const redundantConclusion = conclusion("RD-C1", "SOME", "A", "C");
const redundantFull = classifyConclusionPrimary(
  normalizePremises(redundantPremises),
  redundantConclusion,
  ["A", "B", "C"],
);
const redundantReduced = classifyConclusionPrimary(
  normalizePremises(redundantPremises.slice(0, 2)),
  redundantConclusion,
  ["A", "B", "C"],
);

export const SYL_DISCOVERY_PROTOTYPES_V3: readonly SylDiscoveryPrototypeV3[] = Object.freeze([
  Object.freeze({
    prototypeId: "SYL-DISC-V3-WITNESS-SAME-DIFFERENT",
    permanentQlId: null,
    decision: "IMPLEMENTED_EXECUTABLE_PROTOTYPE",
    title: "Two existential statements may use the same or different members",
    rationale: "Some A are B plus Some B are C does not force the A-B witness and B-C witness to be identical.",
    premises: sameDifferentPremises,
    conclusion: sameDifferentConclusion,
    evidence: {
      witnessRelation: "MAY_BE_SAME_OR_DIFFERENT",
      sameWitnessModelValid: modelSatisfiesConstraints(sameWitnessModel, sameDifferentConstraints),
      differentWitnessModelValid: modelSatisfiesConstraints(differentWitnessModel, sameDifferentConstraints),
      sameWitnessMasks: modelMasks(sameWitnessModel),
      differentWitnessMasks: modelMasks(differentWitnessModel),
      someAareCClassification: sameDifferentProfile.classification,
      canBeTrue: sameDifferentProfile.canBeTrue,
      canBeFalse: sameDifferentProfile.canBeFalse,
    },
  }),
  Object.freeze({
    prototypeId: "SYL-DISC-V3-THREE-DISTINCT-WITNESSES",
    permanentQlId: null,
    decision: "IMPLEMENTED_EXECUTABLE_PROTOTYPE",
    title: "Five-term structure requiring at least three witnesses",
    rationale: "The existential obligations and exclusions force separate A-B, C-D and E-not-A witnesses.",
    premises: threeWitnessPremises,
    conclusion: null,
    evidence: {
      satisfiable: threeWitnessResult.satisfiable,
      occupiedRegionCount: threeWitnessResult.model?.occupiedRegions.length ?? 0,
      occupiedMasks: threeWitnessResult.model ? modelMasks(threeWitnessResult.model) : [],
      maxTerms: threeWitnessTerms.length,
      witnessRelation: "DISTINCT_WITNESSES_REQUIRED",
    },
  }),
  Object.freeze({
    prototypeId: "SYL-DISC-V3-INCONSISTENT-PREMISES",
    permanentQlId: null,
    decision: "GOVERNED_EXCLUSION",
    title: "Intentional inconsistent-premise diagnostic",
    rationale: "The solver detects inconsistency, but no verified SYL-001 V1 source authority currently supports publishing an inconsistent-premise task family.",
    premises: inconsistentPremises,
    conclusion: null,
    evidence: {
      solverDiagnosticImplemented: true,
      satisfiable: inconsistentResult.satisfiable,
      productionTaskEnabled: false,
      requiredFutureAuthority: "VERIFIED_INCONSISTENT_PREMISE_EXAM_PATTERN",
    },
  }),
  Object.freeze({
    prototypeId: "SYL-DISC-V3-IRRELEVANT-PREMISE-REJECTION",
    permanentQlId: null,
    decision: "REJECT_FROM_GENERATED_POOL",
    title: "Irrelevant premise rejection",
    rationale: "Adding No D is E does not change the truth profile of Some A are C; production generation must reject such payloads.",
    premises: irrelevantPremises,
    conclusion: irrelevantConclusion,
    evidence: {
      fullClassification: irrelevantFull.classification,
      reducedClassification: irrelevantReduced.classification,
      fullCanBeTrue: irrelevantFull.canBeTrue,
      reducedCanBeTrue: irrelevantReduced.canBeTrue,
      fullCanBeFalse: irrelevantFull.canBeFalse,
      reducedCanBeFalse: irrelevantReduced.canBeFalse,
      rejectedPremiseId: "IR-P3",
    },
  }),
  Object.freeze({
    prototypeId: "SYL-DISC-V3-REDUNDANT-PREMISE-REJECTION",
    permanentQlId: null,
    decision: "REJECT_FROM_GENERATED_POOL",
    title: "Redundant premise rejection",
    rationale: "All A are C is already implied by All A are B and All B are C; production generation must not add it as a redundant statement.",
    premises: redundantPremises,
    conclusion: redundantConclusion,
    evidence: {
      fullClassification: redundantFull.classification,
      reducedClassification: redundantReduced.classification,
      fullCanBeTrue: redundantFull.canBeTrue,
      reducedCanBeTrue: redundantReduced.canBeTrue,
      fullCanBeFalse: redundantFull.canBeFalse,
      reducedCanBeFalse: redundantReduced.canBeFalse,
      rejectedPremiseId: "RD-P3",
    },
  }),
  Object.freeze({
    prototypeId: "SYL-DISC-V3-PLAIN-FEW-EXCLUSION",
    permanentQlId: null,
    decision: "GOVERNED_EXCLUSION",
    title: "Plain Few remains source-profile governed",
    rationale: "Available exam-preparation authorities conflict: some reduce Few to Some, while others also force Some-not. The runtime must not silently select one interpretation.",
    premises: [],
    conclusion: null,
    evidence: {
      productionNormalization: "BLOCKED",
      competingInterpretations: ["SOME_ONLY", "SOME_AND_SOME_NOT"],
      sourceConflictId: "SYL_FEW_SEMANTIC_CONFLICT_V1",
      requiredFutureDecision: "SOURCE_PROFILE_VERSIONED_AMENDMENT",
    },
  }),
]);

export function getSylDiscoveryPrototypeV3(prototypeId: string): SylDiscoveryPrototypeV3 {
  const prototype = SYL_DISCOVERY_PROTOTYPES_V3.find((entry) => entry.prototypeId === prototypeId);
  if (!prototype) throw new Error(`Unknown SYL-001 V3 discovery prototype: ${prototypeId}.`);
  return prototype;
}
