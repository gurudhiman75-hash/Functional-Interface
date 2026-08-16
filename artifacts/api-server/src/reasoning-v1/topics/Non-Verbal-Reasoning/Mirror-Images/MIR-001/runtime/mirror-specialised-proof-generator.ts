import {
  generateClockProofQuestion,
  generateGlyphStringProofQuestion,
  type SpatialClockTime,
  type SpatialTransformProofQuestion,
} from "../../../../../foundation/spatial";

export function generateMirrorDigitProofQuestion(
  seed: string,
  glyphIds: readonly string[],
): SpatialTransformProofQuestion {
  return generateGlyphStringProofQuestion({
    seed,
    chapterCode: "MIR-001",
    prototypeId: "MIR-PROT-DIGIT-STRING-VERTICAL-REFLECTION",
    requestedTransform: "REFLECT_VERTICAL",
    instructionKey: "MIRROR_SELECT_DIGIT_STRING_IMAGE",
    glyphIds,
    stimulusKind: "WESTERN_ARABIC_DIGIT_STRING",
  });
}

export function generateMirrorLatinGlyphProofQuestion(
  seed: string,
  glyphIds: readonly string[],
): SpatialTransformProofQuestion {
  return generateGlyphStringProofQuestion({
    seed,
    chapterCode: "MIR-001",
    prototypeId: "MIR-PROT-LATIN-GLYPH-STRING-VERTICAL-REFLECTION",
    requestedTransform: "REFLECT_VERTICAL",
    instructionKey: "MIRROR_SELECT_LATIN_GLYPH_STRING_IMAGE",
    glyphIds,
    stimulusKind: "LATIN_GLYPH_STRING",
  });
}

export function generateMirrorClockProofQuestion(
  seed: string,
  time: SpatialClockTime,
): SpatialTransformProofQuestion {
  return generateClockProofQuestion({
    seed,
    chapterCode: "MIR-001",
    prototypeId: "MIR-PROT-ANALOG-CLOCK-VERTICAL-REFLECTION",
    requestedTransform: "REFLECT_VERTICAL",
    instructionKey: "MIRROR_SELECT_ANALOG_CLOCK_IMAGE",
    time,
  });
}
