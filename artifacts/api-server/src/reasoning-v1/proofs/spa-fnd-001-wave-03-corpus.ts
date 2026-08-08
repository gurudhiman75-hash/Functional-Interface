import type { SpatialTransformProofQuestion } from "../foundation/spatial";
import { generateMirrorGeometricProofQuestion } from "../topics/Non-Verbal-Reasoning/Mirror-Images/MIR-001/runtime/mirror-proof-generator";
import {
  generateMirrorClockProofQuestion,
  generateMirrorDigitProofQuestion,
  generateMirrorLatinGlyphProofQuestion,
} from "../topics/Non-Verbal-Reasoning/Mirror-Images/MIR-001/runtime/mirror-specialised-proof-generator";
import { generateWaterGeometricProofQuestion } from "../topics/Non-Verbal-Reasoning/Water-Images/WAT-001/runtime/water-proof-generator";
import {
  generateWaterClockProofQuestion,
  generateWaterDigitProofQuestion,
  generateWaterLatinGlyphProofQuestion,
} from "../topics/Non-Verbal-Reasoning/Water-Images/WAT-001/runtime/water-specialised-proof-generator";

export interface SpatialWave03Corpus {
  mirror: SpatialTransformProofQuestion[];
  water: SpatialTransformProofQuestion[];
  all: SpatialTransformProofQuestion[];
}

export function buildSpatialWave03Corpus(): SpatialWave03Corpus {
  const mirror: SpatialTransformProofQuestion[] = [
    generateMirrorGeometricProofQuestion("MIR-PROOF-004"),
    generateMirrorGeometricProofQuestion("MIR-PROOF-007"),
    generateMirrorGeometricProofQuestion("MIR-PROOF-008"),
    generateMirrorGeometricProofQuestion("MIR-PROOF-009"),
    generateMirrorDigitProofQuestion("MIR-W3-004", [
      "DIGIT-2",
      "DIGIT-4",
      "DIGIT-7",
    ]),
    generateMirrorDigitProofQuestion("MIR-W3-005", [
      "DIGIT-5",
      "DIGIT-2",
    ]),
    generateMirrorDigitProofQuestion("MIR-W3-007", [
      "DIGIT-7",
      "DIGIT-4",
      "DIGIT-5",
    ]),
    generateMirrorLatinGlyphProofQuestion("MIR-W3-019", [
      "LATIN-F",
      "LATIN-R",
      "LATIN-L",
    ]),
    generateMirrorLatinGlyphProofQuestion("MIR-W3-023", [
      "LATIN-P",
      "LATIN-K",
    ]),
    generateMirrorLatinGlyphProofQuestion("MIR-W3-003", [
      "LATIN-Q",
      "LATIN-F",
      "LATIN-P",
    ]),
    generateMirrorClockProofQuestion("MIR-CLOCK-W3-009", {
      hour: 2,
      minute: 20,
    }),
    generateMirrorClockProofQuestion("MIR-CLOCK-W3-011", {
      hour: 4,
      minute: 35,
    }),
  ];

  const water: SpatialTransformProofQuestion[] = [
    generateWaterGeometricProofQuestion("WAT-PROOF-003"),
    generateWaterGeometricProofQuestion("WAT-PROOF-011"),
    generateWaterGeometricProofQuestion("WAT-PROOF-009"),
    generateWaterDigitProofQuestion("WAT-W3-001", [
      "DIGIT-2",
      "DIGIT-5",
      "DIGIT-7",
    ]),
    generateWaterDigitProofQuestion("WAT-W3-006", [
      "DIGIT-4",
      "DIGIT-2",
    ]),
    generateWaterLatinGlyphProofQuestion("WAT-W3-007", [
      "LATIN-R",
      "LATIN-F",
    ]),
    generateWaterLatinGlyphProofQuestion("WAT-W3-008", [
      "LATIN-Q",
      "LATIN-L",
      "LATIN-P",
    ]),
    generateWaterClockProofQuestion("WAT-CLOCK-W3-005", {
      hour: 2,
      minute: 0,
    }),
  ];

  return { mirror, water, all: [...mirror, ...water] };
}
