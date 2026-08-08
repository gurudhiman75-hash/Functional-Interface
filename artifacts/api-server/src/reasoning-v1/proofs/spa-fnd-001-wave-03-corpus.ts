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
    generateMirrorGeometricProofQuestion("MIR-GEO-A-003"),
    generateMirrorGeometricProofQuestion("MIR-GEO-B-012"),
    generateMirrorGeometricProofQuestion("MIR-GEO-C-006"),
    generateMirrorGeometricProofQuestion("MIR-GEO-D-022"),
    generateMirrorDigitProofQuestion("MIR-SP-R5-006", [
      "DIGIT-2",
      "DIGIT-4",
      "DIGIT-7",
    ]),
    generateMirrorDigitProofQuestion("MIR-SP-R6-008", [
      "DIGIT-5",
      "DIGIT-2",
    ]),
    generateMirrorDigitProofQuestion("MIR-SP-R7-003", [
      "DIGIT-7",
      "DIGIT-4",
      "DIGIT-5",
    ]),
    generateMirrorLatinGlyphProofQuestion("MIR-SP-R8-002", [
      "LATIN-F",
      "LATIN-R",
      "LATIN-L",
    ]),
    generateMirrorLatinGlyphProofQuestion("MIR-SP-R9-004", [
      "LATIN-P",
      "LATIN-K",
    ]),
    generateMirrorLatinGlyphProofQuestion("MIR-SP-R10-006", [
      "LATIN-Q",
      "LATIN-F",
      "LATIN-P",
    ]),
    generateMirrorClockProofQuestion("MIR-CLK-R11-007", {
      hour: 2,
      minute: 20,
    }),
    generateMirrorClockProofQuestion("MIR-CLK-R12-001", {
      hour: 4,
      minute: 35,
    }),
  ];

  const water: SpatialTransformProofQuestion[] = [
    generateWaterGeometricProofQuestion("WAT-GEO-B-008"),
    generateWaterGeometricProofQuestion("WAT-GEO-A-032"),
    generateWaterGeometricProofQuestion("WAT-GEO-C-015"),
    generateWaterDigitProofQuestion("WAT-SP-R16-002", [
      "DIGIT-2",
      "DIGIT-5",
      "DIGIT-7",
    ]),
    generateWaterDigitProofQuestion("WAT-SP-R17-001", [
      "DIGIT-4",
      "DIGIT-2",
    ]),
    generateWaterLatinGlyphProofQuestion("WAT-SP-R18-002", [
      "LATIN-R",
      "LATIN-F",
    ]),
    generateWaterLatinGlyphProofQuestion("WAT-SP-R19-002", [
      "LATIN-Q",
      "LATIN-L",
      "LATIN-P",
    ]),
    generateWaterClockProofQuestion("WAT-CLK-R20-010", {
      hour: 2,
      minute: 0,
    }),
  ];

  return { mirror, water, all: [...mirror, ...water] };
}
