import {
  MAL_CP006_WAVE01_V2_HELD_PROTOTYPES,
  MAL_CP006_WAVE01_V2_RETAINED_PROTOTYPE_IDS,
} from "./cp006-wave01-learner-authority-final";
import { MAL_CP006_WAVE01_SOURCE_FIXTURES } from "./cp006-source-fixtures-wave01";
import {
  MAL_CP006_WAVE02_PROTOTYPE_IDS,
  MAL_CP006_WAVE02_SOURCE_FIXTURES,
} from "./cp006-source-fixtures-wave02";

export const MAL_CP006_WAVE03_ANALYSIS_ID =
  "MAL-CP006-WAVE03-MERGE-SPLIT-ANALYSIS-V1" as const;

export const MAL_CP006_WAVE03_CANDIDATE_IDS = [
  ...MAL_CP006_WAVE01_V2_RETAINED_PROTOTYPE_IDS,
  ...MAL_CP006_WAVE02_PROTOTYPE_IDS,
] as const;

export type MalCp006Wave03CandidateId =
  (typeof MAL_CP006_WAVE03_CANDIDATE_IDS)[number];

type TaskDirection = "FORWARD" | "INVERSE" | "HYBRID_INVERSE_THEN_FORWARD";
type Topology =
  | "SEQ_2V_TRANSFER_RETURN"
  | "SIMULTANEOUS_2V_EQUAL_EXCHANGE"
  | "SEQ_3V_CYCLE"
  | "SEQ_2V_TRANSFER_REFILL_RETRANSFER"
  | "SEQ_3V_LINEAR_CHAIN";
type AnswerSemantic =
  | "FINAL_WITHIN_VESSEL_COMPONENT_RATIO"
  | "TRANSFER_QUANTITY"
  | "FINAL_CONCENTRATION_PERCENT"
  | "CROSS_VESSEL_COMPONENT_RATIO"
  | "FINAL_COMPONENT_QUANTITY";

export interface MalCp006Wave03IdentitySignature {
  id: MalCp006Wave03CandidateId;
  taskDirection: TaskDirection;
  topology: Topology;
  unknownVariable: string;
  answerSemantic: AnswerSemantic;
  decisiveConstraint: string;
  learnerReasoning: string;
  collisionGroup: string;
  decision: "RETAIN_DISTINCT";
  splitDecision: "NO_SPLIT";
  rationale: string;
}

export const MAL_CP006_WAVE03_SIGNATURES: readonly MalCp006Wave03IdentitySignature[] = [
  {
    id: "MAL-CP006-PROT-TRANSFER-RETURN-FINAL-RATIO",
    taskDirection: "FORWARD",
    topology: "SEQ_2V_TRANSFER_RETURN",
    unknownVariable: "final component ratio in the receiving vessel",
    answerSemantic: "FINAL_WITHIN_VESSEL_COMPONENT_RATIO",
    decisiveConstraint: "the return sample uses the changed composition of the intermediate source vessel",
    learnerReasoning: "calculate both transferred component amounts stage by stage, then form the final within-vessel ratio",
    collisionGroup: "ROUND_TRIP_SEQUENTIAL",
    decision: "RETAIN_DISTINCT",
    splitDecision: "NO_SPLIT",
    rationale: "Shares a round-trip skeleton with other families, but its forward task and within-vessel ratio projection are distinct.",
  },
  {
    id: "MAL-CP006-PROT-EQUAL-EXCHANGE-AMOUNT-FOR-EQUAL-CONCENTRATIONS",
    taskDirection: "INVERSE",
    topology: "SIMULTANEOUS_2V_EQUAL_EXCHANGE",
    unknownVariable: "simultaneously exchanged quantity",
    answerSemantic: "TRANSFER_QUANTITY",
    decisiveConstraint: "equal final concentrations after simultaneous cross-exchange",
    learnerReasoning: "use the equal-exchange invariant or equivalent simultaneous concentration equations",
    collisionGroup: "EQUAL_EXCHANGE",
    decision: "RETAIN_DISTINCT",
    splitDecision: "NO_SPLIT",
    rationale: "Simultaneous exchange is not sequential current-source sampling and has a materially different invariant.",
  },
  {
    id: "MAL-CP006-PROT-THREE-VESSEL-CYCLE-FINAL-CONCENTRATION",
    taskDirection: "FORWARD",
    topology: "SEQ_3V_CYCLE",
    unknownVariable: "final concentration in a selected vessel",
    answerSemantic: "FINAL_CONCENTRATION_PERCENT",
    decisiveConstraint: "each later transfer samples a vessel after that vessel has already changed",
    learnerReasoning: "carry component totals through a three-stage cycle and convert the selected final state to concentration",
    collisionGroup: "THREE_VESSEL_CURRENT_SOURCE",
    decision: "RETAIN_DISTINCT",
    splitDecision: "NO_SPLIT",
    rationale: "The closed cycle and final concentration projection differ from the linear inverse chain family.",
  },
  {
    id: "MAL-CP006-PROT-SOURCE-REFILL-RETRANSFER-DESTINATION-RATIO",
    taskDirection: "FORWARD",
    topology: "SEQ_2V_TRANSFER_REFILL_RETRANSFER",
    unknownVariable: "final component ratio in the accumulating destination vessel",
    answerSemantic: "FINAL_WITHIN_VESSEL_COMPONENT_RATIO",
    decisiveConstraint: "the source is altered by a pure-liquid refill before the second transfer",
    learnerReasoning: "track the first sample, rebuild the source after refill, then sample the changed source again",
    collisionGroup: "REFILL_INTERRUPTED_TRANSFER",
    decision: "RETAIN_DISTINCT",
    splitDecision: "NO_SPLIT",
    rationale: "The intervening refill creates a distinct state transition and cannot be reduced to ordinary transfer-return.",
  },
  {
    id: "MAL-CP006-PROT-ROUND-TRIP-CROSS-VESSEL-COMPONENT-RATIO",
    taskDirection: "FORWARD",
    topology: "SEQ_2V_TRANSFER_RETURN",
    unknownVariable: "ratio between component amounts located in different final vessels",
    answerSemantic: "CROSS_VESSEL_COMPONENT_RATIO",
    decisiveConstraint: "the returned sample uses the changed composition of the second vessel",
    learnerReasoning: "compute the round-trip state, then project one component from each final vessel into a cross-vessel ratio",
    collisionGroup: "ROUND_TRIP_SEQUENTIAL",
    decision: "RETAIN_DISTINCT",
    splitDecision: "NO_SPLIT",
    rationale: "It shares the transfer-return topology but changes the requested evidence and answer semantic to a cross-vessel comparison.",
  },
  {
    id: "MAL-CP006-PROT-INVERSE-TRANSFER-RETURN-TARGET-RATIO",
    taskDirection: "INVERSE",
    topology: "SEQ_2V_TRANSFER_RETURN",
    unknownVariable: "transfer quantity implied by a target final ratio",
    answerSemantic: "TRANSFER_QUANTITY",
    decisiveConstraint: "the target final ratio must be reconstructed through the composition of the returned current mixture",
    learnerReasoning: "express the returned component amounts in the unknown transfer quantity, then solve the target-ratio equation",
    collisionGroup: "ROUND_TRIP_SEQUENTIAL",
    decision: "RETAIN_DISTINCT",
    splitDecision: "NO_SPLIT",
    rationale: "This is the inverse of a round-trip state, so task direction, unknown variable and answer semantic all differ from the forward families.",
  },
  {
    id: "MAL-CP006-PROT-CHANGED-SOURCE-CHAIN-REMAINING-COMPONENT",
    taskDirection: "HYBRID_INVERSE_THEN_FORWARD",
    topology: "SEQ_3V_LINEAR_CHAIN",
    unknownVariable: "remaining component amount after inferring the hidden chain scale from the final C ratio",
    answerSemantic: "FINAL_COMPONENT_QUANTITY",
    decisiveConstraint: "C inherits B's current ratio, which first determines x; B's changed composition then determines the transferred component amount",
    learnerReasoning: "infer x from the destination ratio, calculate B's current component fraction, then subtract the component sent to C",
    collisionGroup: "THREE_VESSEL_CURRENT_SOURCE",
    decision: "RETAIN_DISTINCT",
    splitDecision: "NO_SPLIT",
    rationale: "The linear chain, inverse ratio inference and remaining-component target are materially different from the three-vessel cycle.",
  },
] as const;

export const MAL_CP006_WAVE03_COLLISION_RATIONALES = Object.freeze({
  "MAL-CP006-PROT-TRANSFER-RETURN-FINAL-RATIO|MAL-CP006-PROT-ROUND-TRIP-CROSS-VESSEL-COMPONENT-RATIO":
    "Same broad sequential round-trip topology, but within-vessel final ratio versus cross-vessel component projection.",
  "MAL-CP006-PROT-TRANSFER-RETURN-FINAL-RATIO|MAL-CP006-PROT-INVERSE-TRANSFER-RETURN-TARGET-RATIO":
    "Same broad sequential round-trip topology, but forward final-state reconstruction versus inverse transfer-quantity solving.",
  "MAL-CP006-PROT-ROUND-TRIP-CROSS-VESSEL-COMPONENT-RATIO|MAL-CP006-PROT-INVERSE-TRANSFER-RETURN-TARGET-RATIO":
    "Same broad sequential round-trip topology, but forward cross-vessel answer projection versus inverse transfer quantity.",
  "MAL-CP006-PROT-THREE-VESSEL-CYCLE-FINAL-CONCENTRATION|MAL-CP006-PROT-CHANGED-SOURCE-CHAIN-REMAINING-COMPONENT":
    "Both require current-source sampling across three vessels, but closed cycle/final concentration differs from linear chain/infer-x/remaining component.",
});

export const MAL_CP006_WAVE03_HELD_BOUNDARY = Object.freeze({
  ...MAL_CP006_WAVE01_V2_HELD_PROTOTYPES,
});

export const MAL_CP006_WAVE03_GENERALISATION_GAPS = [
  {
    id: "MAL-CP006-PROT-INVERSE-TRANSFER-RETURN-TARGET-RATIO",
    gap: "The approved generator currently emphasizes equal out-and-back transfer quantities, while supporting bank evidence also contains known first transfer plus a different unknown return quantity.",
    decision: "GENERALISE_WITHIN_IDENTITY_NOT_NEW_QL",
  },
  {
    id: "MAL-CP006-PROT-TRANSFER-RETURN-FINAL-RATIO",
    gap: "Direct sources contain both two-leg and longer alternating transfer-return sequences; stage-count extension should remain inside the same forward learner identity when the requested semantic is unchanged.",
    decision: "GENERALISE_WITHIN_IDENTITY_NOT_NEW_QL",
  },
] as const;

function directSourceCount(id: MalCp006Wave03CandidateId): number {
  const wave01 = MAL_CP006_WAVE01_SOURCE_FIXTURES.filter(
    (fixture) => fixture.disposition === "CP006_DIRECT" && fixture.supportedPrototypeIds.includes(id as never),
  ).length;
  const wave02 = MAL_CP006_WAVE02_SOURCE_FIXTURES.filter(
    (fixture) => fixture.disposition === "CP006_DIRECT" && fixture.supportedPrototypeIds.includes(id as never),
  ).length;
  return wave01 + wave02;
}

export function malCp006Wave03IdentityKey(signature: MalCp006Wave03IdentitySignature): string {
  return [
    signature.taskDirection,
    signature.topology,
    signature.unknownVariable,
    signature.answerSemantic,
    signature.decisiveConstraint,
  ].join("|");
}

export function malCp006Wave03MergeSplitAudit() {
  const failures: string[] = [];
  const ids = MAL_CP006_WAVE03_CANDIDATE_IDS as readonly string[];
  if (new Set(ids).size !== 7 || ids.length !== 7) failures.push(`expected seven unique retained candidates, got ${ids.length}/${new Set(ids).size}`);
  if (MAL_CP006_WAVE03_SIGNATURES.length !== 7) failures.push(`expected seven signatures, got ${MAL_CP006_WAVE03_SIGNATURES.length}`);

  const signatureIds = MAL_CP006_WAVE03_SIGNATURES.map((x) => x.id);
  for (const id of ids) if (!signatureIds.includes(id as MalCp006Wave03CandidateId)) failures.push(`missing signature for ${id}`);
  for (const signature of MAL_CP006_WAVE03_SIGNATURES) {
    if (!ids.includes(signature.id)) failures.push(`orphan signature ${signature.id}`);
    if (directSourceCount(signature.id) < 1) failures.push(`no direct source evidence for ${signature.id}`);
    if (signature.decision !== "RETAIN_DISTINCT" || signature.splitDecision !== "NO_SPLIT") failures.push(`unresolved decision for ${signature.id}`);
  }

  const identityKeys = MAL_CP006_WAVE03_SIGNATURES.map(malCp006Wave03IdentityKey);
  if (new Set(identityKeys).size !== identityKeys.length) failures.push("two candidates have the same full QL identity key");

  const groups = new Map<string, MalCp006Wave03IdentitySignature[]>();
  for (const signature of MAL_CP006_WAVE03_SIGNATURES) {
    const list = groups.get(signature.collisionGroup) ?? [];
    list.push(signature);
    groups.set(signature.collisionGroup, list);
  }
  for (const members of groups.values()) {
    if (members.length < 2) continue;
    for (let i = 0; i < members.length; i += 1) {
      for (let j = i + 1; j < members.length; j += 1) {
        const a = members[i]!;
        const b = members[j]!;
        const key = `${a.id}|${b.id}`;
        const reverseKey = `${b.id}|${a.id}`;
        if (!(key in MAL_CP006_WAVE03_COLLISION_RATIONALES) && !(reverseKey in MAL_CP006_WAVE03_COLLISION_RATIONALES)) {
          failures.push(`missing collision rationale for ${key}`);
        }
      }
    }
  }

  const heldIds = Object.keys(MAL_CP006_WAVE03_HELD_BOUNDARY);
  for (const held of heldIds) if (ids.includes(held)) failures.push(`held CP001-boundary candidate leaked into retained set: ${held}`);

  return {
    status: failures.length ? "FAIL_MAL_CP006_WAVE03_MERGE_SPLIT" : "PASS_MAL_CP006_WAVE03_MERGE_SPLIT",
    analysisId: MAL_CP006_WAVE03_ANALYSIS_ID,
    candidateCount: ids.length,
    retainedDistinct: MAL_CP006_WAVE03_SIGNATURES.filter((x) => x.decision === "RETAIN_DISTINCT").length,
    mergedCandidates: 0,
    splitCandidates: 0,
    heldBoundaryCandidates: heldIds,
    generalisationGaps: MAL_CP006_WAVE03_GENERALISATION_GAPS,
    candidates: MAL_CP006_WAVE03_SIGNATURES.map((signature) => ({
      id: signature.id,
      taskDirection: signature.taskDirection,
      topology: signature.topology,
      answerSemantic: signature.answerSemantic,
      collisionGroup: signature.collisionGroup,
      directSourceCount: directSourceCount(signature.id),
      decision: signature.decision,
      splitDecision: signature.splitDecision,
    })),
    failures,
  };
}
