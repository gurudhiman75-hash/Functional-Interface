import { upgradeBlrCp002EditorialQuestion } from "./cp002-editorial-upgrader";
import { generateBlrCp002PrototypeQuestion } from "./cp002-generator";
import type {
  BlrCp002PrototypeId,
  GeneratedBlrCp002PrototypeQuestion,
} from "./cp002-types";

export function generateBlrCp002ReviewQuestion(
  prototypeId: BlrCp002PrototypeId,
  seed = 0,
): GeneratedBlrCp002PrototypeQuestion {
  return upgradeBlrCp002EditorialQuestion(
    generateBlrCp002PrototypeQuestion(prototypeId, seed),
  );
}
