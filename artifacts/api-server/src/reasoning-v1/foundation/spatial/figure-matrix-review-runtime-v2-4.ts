import {
  type FigureMatrixLanguageV2,
  type FigureMatrixQlIdV2,
} from "./figure-matrix-review-runtime-v2";
import { generateFigureMatrixReviewQuestionV2_3 } from "./figure-matrix-review-runtime-v2-3";

type ReviewQuestionV23 = ReturnType<typeof generateFigureMatrixReviewQuestionV2_3>;

type SemanticCell = Readonly<{
  glyph?: string | null;
  rotation?: number | null;
  position?: string | null;
  segments?: readonly string[];
  dotCount?: number | null;
  fillPattern?: string | null;
  outerGlyph?: string | null;
  innerGlyph?: string | null;
  markerPosition?: string | null;
}>;

function hash32(text: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

function fingerprint(text: string): string {
  return `fmt24-${hash32(text).toString(16).padStart(8, "0")}`;
}

function parseSemanticCell(key: string): SemanticCell {
  try {
    return JSON.parse(key) as SemanticCell;
  } catch {
    throw new Error(`FMT-001 V2.4 could not parse semantic cell key: ${key}`);
  }
}

function arrowSemanticKey(key: string): string {
  const parsed = parseSemanticCell(key);
  if (parsed.glyph !== "TRIANGLE") {
    throw new Error(`FMT-001 V2.4 orientation remediation expected TRIANGLE state, received ${String(parsed.glyph)}.`);
  }
  return JSON.stringify({ ...parsed, glyph: "ARROW" });
}

function asymmetricArrowSvg(svg: string): string {
  const triangle = /<polygon points="0,-10 9,8 -9,8" fill="white" transform="translate\(([-\d.]+) ([-\d.]+)\) rotate\(([-\d.]+)\)"\/>/g;
  let replacements = 0;
  const replaced = svg.replace(triangle, (_match, x: string, y: string, rotation: string) => {
    replacements += 1;
    return `<g transform="translate(${x} ${y}) rotate(${rotation}) scale(1)"><line x1="-11" y1="0" x2="10" y2="0"/><polyline points="4,-6 11,0 4,6"/></g>`;
  });
  if (replacements === 0) throw new Error("FMT-001 V2.4 orientation remediation found no triangle primitive to replace.");
  return replaced;
}

function visualRotationPeriod(glyph: string | null | undefined): number {
  if (glyph === "ARROW") return 360;
  if (glyph === "TRIANGLE") return 120;
  if (glyph === "SQUARE" || glyph === "DIAMOND") return 90;
  if (glyph === "CIRCLE") return 1;
  return 360;
}

function perceptualOrientationKey(key: string): string {
  const parsed = parseSemanticCell(key);
  const period = visualRotationPeriod(parsed.glyph);
  const rotation = ((Number(parsed.rotation ?? 0) % period) + period) % period;
  return JSON.stringify({
    glyph: parsed.glyph ?? null,
    perceptualRotation: rotation,
    position: parsed.position ?? "C",
    fillPattern: parsed.fillPattern ?? "HOLLOW",
    dotCount: parsed.dotCount ?? 0,
    segments: parsed.segments ?? [],
    outerGlyph: parsed.outerGlyph ?? null,
    innerGlyph: parsed.innerGlyph ?? null,
    markerPosition: parsed.markerPosition ?? null,
  });
}

function remediateOrientationCycle(question: ReviewQuestionV23) {
  const semanticAnswerKey = arrowSemanticKey(question.solveFacts.semanticAnswerKey);
  const semanticOptionKeys = Object.freeze(question.solveFacts.semanticOptionKeys.map(arrowSemanticKey));
  const perceptualKeys = semanticOptionKeys.map(perceptualOrientationKey);
  if (new Set(perceptualKeys).size !== perceptualKeys.length) {
    throw new Error("FMT-001 V2.4 rejected perceptually equivalent ORIENTATION_CYCLE options after rotational-symmetry normalization.");
  }

  const matrixSvg = asymmetricArrowSvg(question.matrixSvg);
  const solutionSvg = asymmetricArrowSvg(question.solutionSvg);
  const optionSvgs = Object.freeze(question.optionSvgs.map(asymmetricArrowSvg));
  if (new Set(optionSvgs).size !== 4) throw new Error("FMT-001 V2.4 orientation options must render as four distinct SVGs.");

  const geometryFingerprint = fingerprint(JSON.stringify({
    qlId: question.qlId,
    sourceVariant: question.solveFacts.sourceVariant,
    matrixSize: question.matrixSize,
    missingIndex: question.missingIndex,
    semanticAnswerKey,
    semanticOptionKeys,
    matrixSvg,
    optionSvgs,
  }));
  const contentFingerprint = fingerprint([
    geometryFingerprint,
    question.language,
    question.stem,
    question.explanation.rule,
    question.explanation.worked,
    question.explanation.application,
    question.explanation.verification,
    ...question.explanation.distractorChecks,
  ].join("|"));

  return Object.freeze({
    ...question,
    version: "SPA-FMT-001-REVIEW-QUESTION-V2.4" as const,
    matrixSvg,
    optionSvgs,
    solutionSvg,
    solveFacts: Object.freeze({
      ...question.solveFacts,
      semanticAnswerKey,
      semanticOptionKeys,
      orientationVisualMotif: "ASYMMETRIC_ARROW" as const,
      perceptualOrientationKeys: Object.freeze(perceptualKeys),
    }),
    validation: Object.freeze({
      ...question.validation,
      rotationalSymmetryNormalizedBeforeOptionUniqueness: true as const,
      orientationCycleUsesAsymmetricDirectionalGlyph: true as const,
      perceptualOptionEquivalenceRejected: true as const,
    }),
    geometryFingerprint,
    contentFingerprint,
  });
}

export function generateFigureMatrixReviewQuestionV2_4(input: Readonly<{
  qlId: FigureMatrixQlIdV2;
  seed: string;
  language: FigureMatrixLanguageV2;
}>) {
  const question = generateFigureMatrixReviewQuestionV2_3(input);
  if (question.solveFacts.sourceVariant !== "ORIENTATION_CYCLE") {
    return Object.freeze({
      ...question,
      version: "SPA-FMT-001-REVIEW-QUESTION-V2.4" as const,
      solveFacts: Object.freeze({
        ...question.solveFacts,
        orientationVisualMotif: null,
        perceptualOrientationKeys: Object.freeze([] as string[]),
      }),
      validation: Object.freeze({
        ...question.validation,
        rotationalSymmetryNormalizedBeforeOptionUniqueness: false as const,
        orientationCycleUsesAsymmetricDirectionalGlyph: false as const,
        perceptualOptionEquivalenceRejected: false as const,
      }),
    });
  }
  return remediateOrientationCycle(question);
}
