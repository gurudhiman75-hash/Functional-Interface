import {
  classifyMenCp011Difficulty,
  generateMenCp011FoundationPrototype as generateOrthographicMenCp011FoundationPrototype,
} from "./runtime-orthographic";
import type {
  MenCp011Package,
  MenCp011PrototypeId,
} from "./types";

export function generateMenCp011FoundationPrototype(
  prototypeId: MenCp011PrototypeId,
  seed: string,
): MenCp011Package {
  const generated = generateOrthographicMenCp011FoundationPrototype(prototypeId, seed);
  const diagram = {
    ...generated.diagram,
    svg: generated.diagram.svg.replace(">empty opening<", ">empty void<"),
  };
  return { ...generated, diagram };
}

export { classifyMenCp011Difficulty };
