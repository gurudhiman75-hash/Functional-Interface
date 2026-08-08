import type { NumCp006PermanentQlId, NumCp006PrototypeId } from "./allocation";
import type { NumCp006GeneratedContent } from "./types";
import {
  generateQl070, generateQl071, generateQl072, generateQl073, generateQl074, generateQl075,
  generateQl076, generateQl077, generateQl078, generateQl079, generateQl080, generateQl081,
} from "./generators-foundation";
import {
  generateQl082, generateQl083, generateQl084, generateQl085, generateQl086,
  generateQl087, generateQl088, generateQl089, generateQl090,
} from "./generators-remainder";
import {
  generateQl091, generateQl092, generateQl093, generateQl094,
  generateQl095, generateQl096, generateQl097,
} from "./generators-advanced";

const GENERATORS: Readonly<Record<Exclude<NumCp006PermanentQlId, "NUM-QL-097">, (seed: number) => NumCp006GeneratedContent>> = {
  "NUM-QL-070": generateQl070,
  "NUM-QL-071": generateQl071,
  "NUM-QL-072": generateQl072,
  "NUM-QL-073": generateQl073,
  "NUM-QL-074": generateQl074,
  "NUM-QL-075": generateQl075,
  "NUM-QL-076": generateQl076,
  "NUM-QL-077": generateQl077,
  "NUM-QL-078": generateQl078,
  "NUM-QL-079": generateQl079,
  "NUM-QL-080": generateQl080,
  "NUM-QL-081": generateQl081,
  "NUM-QL-082": generateQl082,
  "NUM-QL-083": generateQl083,
  "NUM-QL-084": generateQl084,
  "NUM-QL-085": generateQl085,
  "NUM-QL-086": generateQl086,
  "NUM-QL-087": generateQl087,
  "NUM-QL-088": generateQl088,
  "NUM-QL-089": generateQl089,
  "NUM-QL-090": generateQl090,
  "NUM-QL-091": generateQl091,
  "NUM-QL-092": generateQl092,
  "NUM-QL-093": generateQl093,
  "NUM-QL-094": generateQl094,
  "NUM-QL-095": generateQl095,
  "NUM-QL-096": generateQl096,
};

export function generateNumCp006Content(
  qlId: NumCp006PermanentQlId,
  sourceSeed: number,
  prototypeId: NumCp006PrototypeId,
): NumCp006GeneratedContent {
  if (qlId === "NUM-QL-097") {
    if (prototypeId !== "NUM-CP006-PROT-028" && prototypeId !== "NUM-CP006-PROT-029") {
      throw new Error(`NUM-QL-097 unsupported prototype ${prototypeId}`);
    }
    return generateQl097(sourceSeed, prototypeId);
  }
  const generator = GENERATORS[qlId];
  if (!generator) throw new Error(`No NUM-CP-006 generator for ${qlId}`);
  return generator(sourceSeed);
}
