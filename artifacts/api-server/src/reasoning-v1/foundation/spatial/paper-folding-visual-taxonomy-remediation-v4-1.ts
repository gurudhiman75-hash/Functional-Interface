import { generatePfcDiscoveryQuestionV3 } from "./paper-folding-discovery-presentation-v3";
import type {
  PfcDiscoveryImprintV1,
  PfcMisconceptionV1,
} from "./paper-folding-discovery-v1";
import {
  PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4,
  generatePfcDiscoveryQuestionV4,
  renderPfcDiscoveryOptionSvgV4,
  renderPfcDiscoveryReviewHtmlV4,
  renderPfcDiscoveryStimulusSvgV4,
  type PfcDiscoveryQuestionV4,
  type PfcVisualCutV4,
  type PfcVisualImprintV4,
  type PfcVisualOptionV4,
} from "./paper-folding-visual-taxonomy-remediation-v4";

export const PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4_1 = Object.freeze({
  ...PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4,
  authorityId: "PFC-001-VISUAL-TAXONOMY-REMEDIATION-V4.1" as const,
  supersedesAuthority: PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4.authorityId,
  executableCoverageModeCount: 30,
  fix: "OFF_CENTER_AXIAL_PUNCHES_RELOCATED_INSIDE_PHYSICAL_FOLDED_PACKET_AND_STABLE_OPTION_SET" as const,
  status: "REMEDIATED_REVIEW_CANDIDATE" as const,
} as const);

export type PfcDiscoveryQuestionV4_1 = PfcDiscoveryQuestionV4 & {
  remediationPatchAuthorityId: typeof PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4_1.authorityId;
};

const OPTION_IDS = ["A", "B", "C", "D"] as const;

function q(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function fingerprint(imprints: readonly PfcVisualImprintV4[]): string {
  return imprints
    .map((imprint) => `${imprint.kind}|${imprint.visualKind}|${imprint.contact}|${q(imprint.x)},${q(imprint.y)}`)
    .sort()
    .join(";");
}

function optionSet(
  correct: readonly PfcVisualImprintV4[],
  variantIndex: number,
): { options: PfcVisualOptionV4[]; correctOptionIndex: number } {
  const shifted = correct.map((imprint, index) => ({
    ...imprint,
    x: q(imprint.x + (index === 0 ? 6 : -6)),
  }));
  const extra: PfcVisualImprintV4 = {
    x: 50,
    y: q(Math.min(92, correct[0].y + 14)),
    kind: "POINT_HOLE",
    contact: "INTERIOR",
    visualKind: "CIRCLE_HOLE",
  };
  const candidates: Array<{ misconception: PfcMisconceptionV1; imprints: PfcVisualImprintV4[] }> = [
    { misconception: "CORRECT", imprints: correct.map((imprint) => ({ ...imprint })) },
    { misconception: "ONE_LAYER_ONLY", imprints: [{ ...correct[0] }] },
    { misconception: "WRONG_CUT_POSITION", imprints: shifted },
    { misconception: "EXTRA_IMPRINT", imprints: [...correct.map((imprint) => ({ ...imprint })), extra] },
  ];
  const rotation = variantIndex % 4;
  const ordered = [...candidates.slice(rotation), ...candidates.slice(0, rotation)];
  const options = ordered.map<PfcVisualOptionV4>((candidate, index) => ({
    optionId: OPTION_IDS[index],
    misconception: candidate.misconception,
    imprints: candidate.imprints,
    fingerprint: fingerprint(candidate.imprints),
  }));
  const correctOptionIndex = options.findIndex((option) => option.misconception === "CORRECT");
  return { options, correctOptionIndex };
}

function offCenterVerticalQuestion(discoveryIndex: number): PfcDiscoveryQuestionV4_1 {
  const base = generatePfcDiscoveryQuestionV3(discoveryIndex);
  const u = base.variantIndex;
  const foldedX = q(8 + Math.floor(u / 4));
  const foldedY = q(12 + (u % 57) * 1.19);
  const mirroredOriginalX = q(80 - foldedX);
  const cuts: PfcVisualCutV4[] = [{
    cutId: "C1",
    kind: "POINT_HOLE",
    center: { x: foldedX, y: foldedY },
    radius: 2.2,
    visualKind: "CIRCLE_HOLE",
  }];
  const correct: PfcVisualImprintV4[] = [
    { x: foldedX, y: foldedY, kind: "POINT_HOLE", contact: "INTERIOR", visualKind: "CIRCLE_HOLE" },
    { x: mirroredOriginalX, y: foldedY, kind: "POINT_HOLE", contact: "INTERIOR", visualKind: "CIRCLE_HOLE" },
  ];
  const { options, correctOptionIndex } = optionSet(correct, u);
  const correctOptionId = options[correctOptionIndex].optionId;
  const folds = [{
    foldId: "F1",
    kind: "VERTICAL" as const,
    line: { a: { x: 40, y: 0 }, b: { x: 40, y: 100 } },
    movingSide: "NEGATIVE" as const,
  }];
  const unfoldedFingerprint = [
    `C1|POINT_HOLE|CIRCLE_HOLE|INTERIOR|${foldedX},${foldedY}`,
    `C1|POINT_HOLE|CIRCLE_HOLE|INTERIOR|${mirroredOriginalX},${foldedY}`,
  ].sort().join(";");

  return {
    ...base,
    folds,
    cuts,
    foldedLayerCounts: [2],
    unfoldedFingerprint,
    options,
    correctOptionIndex,
    correctOptionId,
    explanation: `The fold is off-centre, so the two sides of the paper are not the same width. The punch is inside the overlapping folded packet. Opening the fold places the second hole at the matching distance across the crease, giving option ${correctOptionId}.`,
    semanticFingerprint: `PFC-PROT-01-SINGLE-AXIAL-HOLE::OFF_CENTER_VERTICAL::F1@40::C1@${foldedX},${foldedY}::${unfoldedFingerprint}`,
    coverageTags: ["OFF_CENTER_VERTICAL"],
    remediationAuthorityId: PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4.authorityId,
    remediationPatchAuthorityId: PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4_1.authorityId,
  };
}

function offCenterHorizontalQuestion(discoveryIndex: number): PfcDiscoveryQuestionV4_1 {
  const base = generatePfcDiscoveryQuestionV3(discoveryIndex);
  const u = base.variantIndex;
  const foldedX = q(12 + (u % 57) * 1.19);
  const foldedY = q(28 + (u % 19) * 1.21);
  const mirroredOriginalY = q(120 - foldedY);
  const cuts: PfcVisualCutV4[] = [{
    cutId: "C1",
    kind: "POINT_HOLE",
    center: { x: foldedX, y: foldedY },
    radius: 2.2,
    visualKind: "CIRCLE_HOLE",
  }];
  const correct: PfcVisualImprintV4[] = [
    { x: foldedX, y: foldedY, kind: "POINT_HOLE", contact: "INTERIOR", visualKind: "CIRCLE_HOLE" },
    { x: foldedX, y: mirroredOriginalY, kind: "POINT_HOLE", contact: "INTERIOR", visualKind: "CIRCLE_HOLE" },
  ];
  const { options, correctOptionIndex } = optionSet(correct, u);
  const correctOptionId = options[correctOptionIndex].optionId;
  const folds = [{
    foldId: "F1",
    kind: "HORIZONTAL" as const,
    line: { a: { x: 0, y: 60 }, b: { x: 100, y: 60 } },
    movingSide: "POSITIVE" as const,
  }];
  const unfoldedFingerprint = [
    `C1|POINT_HOLE|CIRCLE_HOLE|INTERIOR|${foldedX},${foldedY}`,
    `C1|POINT_HOLE|CIRCLE_HOLE|INTERIOR|${foldedX},${mirroredOriginalY}`,
  ].sort().join(";");

  return {
    ...base,
    folds,
    cuts,
    foldedLayerCounts: [2],
    unfoldedFingerprint,
    options,
    correctOptionIndex,
    correctOptionId,
    explanation: `The horizontal fold is off-centre. The punch is made inside the overlapping folded packet. When the fold is opened, the second hole appears at the same distance on the other side of the crease, giving option ${correctOptionId}.`,
    semanticFingerprint: `PFC-PROT-01-SINGLE-AXIAL-HOLE::OFF_CENTER_HORIZONTAL::F1@60::C1@${foldedX},${foldedY}::${unfoldedFingerprint}`,
    coverageTags: ["OFF_CENTER_HORIZONTAL"],
    remediationAuthorityId: PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4.authorityId,
    remediationPatchAuthorityId: PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4_1.authorityId,
  };
}

export function generatePfcDiscoveryQuestionV4_1(discoveryIndex: number): PfcDiscoveryQuestionV4_1 {
  if (!Number.isInteger(discoveryIndex) || discoveryIndex < 0 || discoveryIndex >= 800) {
    throw new RangeError("PFC discoveryIndex must be an integer from 0 to 799.");
  }
  const representationIndex = Math.floor(discoveryIndex / 80);
  const variantIndex = discoveryIndex % 80;
  if (representationIndex === 0 && variantIndex % 4 === 2) {
    return offCenterVerticalQuestion(discoveryIndex);
  }
  if (representationIndex === 0 && variantIndex % 4 === 3) {
    return offCenterHorizontalQuestion(discoveryIndex);
  }
  return {
    ...generatePfcDiscoveryQuestionV4(discoveryIndex),
    remediationPatchAuthorityId: PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4_1.authorityId,
  };
}

export function generatePfcDiscoveryCorpusV4_1(): PfcDiscoveryQuestionV4_1[] {
  return Array.from({ length: 800 }, (_, index) => generatePfcDiscoveryQuestionV4_1(index));
}

export function pfcV4_1CoverageTags(): string[] {
  return [...new Set(generatePfcDiscoveryCorpusV4_1().flatMap((question) => question.coverageTags))].sort();
}

export function pfcV4_1RepresentationCoverage(): Record<string, string[]> {
  const result = new Map<string, Set<string>>();
  for (const question of generatePfcDiscoveryCorpusV4_1()) {
    if (!result.has(question.representationId)) result.set(question.representationId, new Set());
    for (const tag of question.coverageTags) result.get(question.representationId)!.add(tag);
  }
  return Object.fromEntries([...result.entries()].map(([id, tags]) => [id, [...tags].sort()]));
}

export { renderPfcDiscoveryOptionSvgV4, renderPfcDiscoveryReviewHtmlV4, renderPfcDiscoveryStimulusSvgV4 };
