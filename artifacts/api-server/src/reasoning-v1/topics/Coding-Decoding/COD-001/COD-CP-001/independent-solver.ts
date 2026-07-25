import type { DirectMappingPrompt } from "../foundation/types";
import { decodeWithMapping, encodeWithMapping, mappingFromEvidence } from "../foundation/mapping";

export function solveCodCp001(prompt: DirectMappingPrompt): string {
  const evidenceMapping = mappingFromEvidence(prompt.evidence, prompt.separator);
  if (prompt.taskKind === "DECODE_TARGET") {
    if (!prompt.encodedTarget) throw new Error("Decode task is missing encoded target");
    return decodeWithMapping(prompt.encodedTarget, evidenceMapping, prompt.separator);
  }
  if (prompt.taskKind === "RECOVER_MISSING_CODE") {
    if (!prompt.missingSource) throw new Error("Missing-code task lacks missing source");
    const answer = evidenceMapping[prompt.missingSource];
    if (answer === undefined) throw new Error("Missing source is not independently evidenced");
    return answer;
  }
  return encodeWithMapping(prompt.target, evidenceMapping, prompt.separator);
}
