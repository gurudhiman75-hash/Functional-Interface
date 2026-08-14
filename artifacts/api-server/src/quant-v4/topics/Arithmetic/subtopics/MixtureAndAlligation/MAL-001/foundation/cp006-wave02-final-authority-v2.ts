import { generateMalCp006Wave02FinalLearnerAuthority } from "./cp006-wave02-final-learner-authority";
import { generateMalCp006Wave02SourceFaithfulChain } from "./cp006-wave02-source-faithful-chain";
import type { MalCp006Wave02PrototypeId } from "./cp006-source-fixtures-wave02";

export const MAL_CP006_WAVE02_FINAL_AUTHORITY_V2_ID = "MAL-CP006-EN-WAVE02-FINAL-LEARNER-AUTHORITY-V2" as const;

export function generateMalCp006Wave02FinalAuthorityV2(id: MalCp006Wave02PrototypeId, seed: string) {
  const q = id.includes("CHANGED-SOURCE-CHAIN")
    ? generateMalCp006Wave02SourceFaithfulChain(seed)
    : generateMalCp006Wave02FinalLearnerAuthority(id, seed);
  const errors = [...q.validation.errors];
  const text = [q.stem, ...q.options, ...q.explanation, q.commonMistake].join(" ");
  if (!q.stem.endsWith("?")) errors.push("stem");
  if (q.explanation.length !== 4) errors.push("explanation");
  if (new Set(q.options).size !== 4 || q.options[q.correctIndex] !== q.answer) errors.push("options");
  if (text.includes("component load") || text.includes("state key") || text.includes("x²") || text.includes("→")) errors.push("learner text");
  if (q.permanentQlId !== null || q.permanentSolveModeId !== null || q.active || q.publiclyPublishable || q.questionStudioDiscoverable || q.questionBankWritable || q.testEligible) errors.push("lifecycle");
  return { ...q, validation: { ok: errors.length === 0, errors } };
}
