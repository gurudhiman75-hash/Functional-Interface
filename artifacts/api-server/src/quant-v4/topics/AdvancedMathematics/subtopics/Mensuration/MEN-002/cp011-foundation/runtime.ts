import {
  classifyMenCp011Difficulty,
  generateMenCp011FoundationPrototype as generateApprovedMenCp011FoundationPrototype,
} from "./runtime-approved-diagram";
import type {
  MenCp011Package,
  MenCp011PrototypeId,
} from "./types";

export function generateMenCp011FoundationPrototype(
  prototypeId: MenCp011PrototypeId,
  seed: string,
): MenCp011Package {
  return generateApprovedMenCp011FoundationPrototype(prototypeId, seed);
}

export { classifyMenCp011Difficulty };
