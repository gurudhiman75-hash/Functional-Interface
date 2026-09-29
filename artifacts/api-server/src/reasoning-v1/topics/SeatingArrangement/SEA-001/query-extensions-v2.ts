import type { MixedFacingCaseletRecord } from "./cp002/types.ts";
import {
  SEA_001_QUERY_EXTENSION_AUTHORITY_V1,
  type Sea001QueryExtensionV1,
} from "./query-extensions-v1.ts";

function answerIndex(seed: string): 0 | 1 | 2 | 3 {
  let hash = 2166136261;
  for (const ch of seed) {
    hash ^= ch.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % 4 as 0 | 1 | 2 | 3;
}

function mixedFacings(caselet: MixedFacingCaseletRecord) {
  const key = caselet.solverOracleAgreement.productionKeys[0];
  if (!key) throw new Error("SEA-CP-002 query extension needs a solved model");
  const [orderPart, facingPart] = key.split("|");
  const order = orderPart?.split(">") ?? [];
  const facings = Object.fromEntries((facingPart?.split(",") ?? []).map((entry) => {
    const [personId, facing] = entry.split(":");
    return [personId, facing];
  }));
  if (order.length < 6) throw new Error("Unexpected SEA-CP-002 solved key");
  return { order, facings: facings as Readonly<Record<string, "NORTH" | "SOUTH">> };
}

export interface Sea001FacingCountExtensionV2
  extends Omit<Sea001QueryExtensionV1, "authority" | "kind" | "checkpointId" | "answerType" | "answer"> {
  authority: "SEA_001_QUERY_EXTENSION_V2";
  kind: "FACING_DIRECTION_COUNT";
  checkpointId: "SEA-CP-002";
  answerType: "COUNT";
  answer: number;
}

export function buildMixedFacingCountExtensionV2(
  caselet: MixedFacingCaseletRecord,
): Sea001FacingCountExtensionV2 {
  const { order, facings } = mixedFacings(caselet);
  const northCount = order.filter((personId) => facings[personId] === "NORTH").length;
  const southCount = order.length - northCount;
  const askNorth = answerIndex(caselet.caseletId + ":FACING_KIND") % 2 === 0;
  const answer = askNorth ? northCount : southCount;
  const values = [answer, Math.max(0, answer - 1), Math.min(order.length, answer + 1), order.length - answer];
  const unique = [...new Set(values)];
  for (let candidate = 0; unique.length < 4 && candidate <= order.length; candidate += 1) {
    if (!unique.includes(candidate)) unique.push(candidate);
  }
  const correctIndex = answerIndex(caselet.caseletId + ":FACING_COUNT");
  const wrong = unique.filter((value) => value !== answer).slice(0, 3).map(String);
  const options = [...wrong];
  options.splice(correctIndex, 0, String(answer));

  return {
    authority: "SEA_001_QUERY_EXTENSION_V2",
    kind: "FACING_DIRECTION_COUNT",
    checkpointId: "SEA-CP-002",
    sourceCaseletId: caselet.caseletId,
    answerType: "COUNT",
    stem: `How many persons are facing ${askNorth ? "north" : "south"}?`,
    options: options as [string, string, string, string],
    correctIndex,
    answer,
    sourceBackedGap: true,
    permanentQlAllocated: false,
    reviewOnly: true,
  };
}

export const SEA_001_QUERY_EXTENSION_AUTHORITY_V2 = Object.freeze({
  authorityId: "SEA_001_QUERY_EXTENSION_V2",
  supersedesForAudit: SEA_001_QUERY_EXTENSION_AUTHORITY_V1.authorityId,
  addedGap: "FACING_DIRECTION_COUNT",
  sourceState: "VERIFIED_CP002_MIXED_FACING_MODEL",
  permanentQlAllocated: false,
  questionStudioRegistered: false,
  activationPermitted: false,
});
