import {
  generateClockProofQuestion,
  generateGlyphStringProofQuestion,
  type SpatialClockTime,
  type SpatialTransformProofQuestion,
} from "../../../../../foundation/spatial";

export function generateWaterDigitProofQuestion(
  seed: string,
  glyphIds: readonly string[],
): SpatialTransformProofQuestion {
  return generateGlyphStringProofQuestion({
    seed,
    chapterCode: "WAT-001",
    prototypeId: "WAT-PROT-DIGIT-STRING-HORIZONTAL-REFLECTION",
    requestedTransform: "REFLECT_HORIZONTAL",
    instructionKey: "WATER_SELECT_DIGIT_STRING_IMAGE",
    glyphIds,
    stimulusKind: "WESTERN_ARABIC_DIGIT_STRING",
  });
}

export function generateWaterLatinGlyphProofQuestion(
  seed: string,
  glyphIds: readonly string[],
): SpatialTransformProofQuestion {
  return generateGlyphStringProofQuestion({
    seed,
    chapterCode: "WAT-001",
    prototypeId: "WAT-PROT-LATIN-GLYPH-STRING-HORIZONTAL-REFLECTION",
    requestedTransform: "REFLECT_HORIZONTAL",
    instructionKey: "WATER_SELECT_LATIN_GLYPH_STRING_IMAGE",
    glyphIds,
    stimulusKind: "LATIN_GLYPH_STRING",
  });
}

export function generateWaterClockProofQuestion(
  seed: string,
  time: SpatialClockTime,
): SpatialTransformProofQuestion {
  return generateClockProofQuestion({
    seed,
    chapterCode: "WAT-001",
    prototypeId: "WAT-PROT-ANALOG-CLOCK-HORIZONTAL-REFLECTION",
    requestedTransform: "REFLECT_HORIZONTAL",
    instructionKey: "WATER_SELECT_ANALOG_CLOCK_DIAGRAM",
    time,
  });
}
