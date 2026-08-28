import {
  PFC_001_REPRESENTATION_CATALOG_V1,
  generatePfcDiscoveryQuestionV1,
  pfcDiscoveryOptionIsReadableV1,
  renderPfcDiscoveryReviewHtmlV1,
  type PfcDiscoveryImprintV1,
  type PfcDiscoveryOptionV1,
  type PfcDiscoveryQuestionV1,
  type PfcMisconceptionV1,
} from "./paper-folding-discovery-v1";
import {
  canonicalPfcCutPositionsV1,
  solvePfcCutsV1,
  type PfcCutV1,
} from "./paper-folding-foundation-v1";

export const PFC_001_DISCOVERY_REMEDIATION_AUTHORITY_V2 = Object.freeze({
  authorityId: "PFC-001-EXECUTABLE-DISCOVERY-REMEDIATED-V2" as const,
  chapterCode: "PFC-001" as const,
  supersedesRuntime: "PFC-001-EXECUTABLE-DISCOVERY-V1" as const,
  reason: "REMOVE_TRUE_SEMANTIC_DUPLICATES_AND_FAIL_CLOSED_ON_UNREADABLE_OPTIONS" as const,
  targetQuestions: 800,
  requiredUniqueSemanticQuestions: 800,
  permanentQlAllocationStatus: "NOT_ALLOCATED_DISCOVERY_REVIEW_REQUIRED" as const,
  frozenSpatialQlRange: "SPA-QL-001..SPA-QL-034" as const,
  nextAvailableQl: "SPA-QL-035" as const,
  automaticPublication: false,
} as const);

const OPTION_IDS = ["A", "B", "C", "D"] as const;

function q(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function correctedCuts(question: PfcDiscoveryQuestionV1): PfcCutV1[] {
  const u = question.variantIndex;
  return question.cuts.map((cut, cutIndex) => {
    const copy: PfcCutV1 = {
      ...cut,
      center: { ...cut.center },
    };

    switch (question.representationId) {
      case "PFC-PROT-01-SINGLE-AXIAL-HOLE":
        if (question.folds[0]?.kind === "HORIZONTAL") {
          copy.center.x = q(10 + u * 0.45);
        }
        break;
      case "PFC-PROT-02-SINGLE-AXIAL-EDGE-NOTCH":
        if (copy.center.y === 0) copy.center.x = q(8 + u * 0.42);
        if (copy.center.x === 0) copy.center.y = q(8 + u * 0.42);
        break;
      case "PFC-PROT-05-CORNER-FOLD":
        copy.center.x = q(28 + (u % 20) * 0.5);
        copy.center.y = q(28 + Math.floor(u / 20) * 5 + ((u * 3) % 20) * 0.1);
        break;
      case "PFC-PROT-09-MULTI-FOLD-EDGE-NOTCH":
        copy.center.x = q(8 + u * 0.42);
        copy.center.y = 0;
        break;
      case "PFC-PROT-08-MULTIPLE-CUTS":
        if (cutIndex === 1) {
          copy.center.x = q(27 + ((u * 7) % 17) * 0.61);
          copy.center.y = q(25 + ((u * 11) % 19) * 0.57);
        }
        break;
      default:
        break;
    }
    return copy;
  });
}

function answerImprints(
  solution: ReturnType<typeof solvePfcCutsV1>,
  cuts: readonly PfcCutV1[],
): PfcDiscoveryImprintV1[] {
  return cuts.flatMap((cut) =>
    canonicalPfcCutPositionsV1(solution, cut.cutId).map((point) => ({
      x: point.x,
      y: point.y,
      kind: cut.kind,
      contact: point.contact,
    })),
  );
}

function imprintFingerprint(imprints: readonly PfcDiscoveryImprintV1[]): string {
  return imprints
    .map((imprint) => `${imprint.kind}|${imprint.contact}|${q(imprint.x)},${q(imprint.y)}`)
    .sort()
    .join(";");
}

function uniqueImprints(imprints: readonly PfcDiscoveryImprintV1[]): PfcDiscoveryImprintV1[] {
  const byKey = new Map<string, PfcDiscoveryImprintV1>();
  for (const imprint of imprints) {
    const key = `${imprint.kind}|${imprint.contact}|${q(imprint.x)},${q(imprint.y)}`;
    if (!byKey.has(key)) byKey.set(key, { ...imprint });
  }
  return [...byKey.values()].sort((left, right) =>
    left.x - right.x || left.y - right.y || left.kind.localeCompare(right.kind),
  );
}

function shifted(
  correct: readonly PfcDiscoveryImprintV1[],
  dx: number,
  dy: number,
): PfcDiscoveryImprintV1[] {
  return correct.map((imprint, index) => {
    if (imprint.contact === "BOUNDARY") {
      if (imprint.y === 0 || imprint.y === 100) {
        return {
          ...imprint,
          x: q(Math.min(94, Math.max(6, imprint.x + (index % 2 === 0 ? dx : -dx)))),
        };
      }
      if (imprint.x === 0 || imprint.x === 100) {
        return {
          ...imprint,
          y: q(Math.min(94, Math.max(6, imprint.y + (index % 2 === 0 ? dy : -dy)))),
        };
      }
    }
    return {
      ...imprint,
      x: q(Math.min(94, Math.max(6, imprint.x + (index % 2 === 0 ? dx : -dx)))),
      y: q(Math.min(94, Math.max(6, imprint.y + (index % 2 === 0 ? dy : -dy)))),
    };
  });
}

function candidateOptions(
  correct: readonly PfcDiscoveryImprintV1[],
  variantIndex: number,
): Array<{ misconception: Exclude<PfcMisconceptionV1, "CORRECT">; imprints: PfcDiscoveryImprintV1[] }> {
  const half = Math.max(1, Math.ceil(correct.length / 2));
  const boundaryAsInterior = correct.map((imprint) =>
    imprint.contact === "BOUNDARY"
      ? {
          ...imprint,
          contact: "INTERIOR" as const,
          x: imprint.x === 0 ? 6 : imprint.x,
          y: imprint.y === 0 ? 6 : imprint.y,
        }
      : { ...imprint },
  );
  const extras = [
    { x: 48, y: 52 },
    { x: 58, y: 44 },
    { x: 42, y: 61 },
    { x: 66, y: 63 },
  ].map((point, index) => ({
    kind: correct[0]?.kind ?? ("POINT_HOLE" as const),
    contact: "INTERIOR" as const,
    x: q(point.x + ((variantIndex + index) % 3)),
    y: q(point.y - ((variantIndex + index) % 3)),
  }));

  return [
    { misconception: "INCOMPLETE_UNFOLD", imprints: correct.slice(0, half).map((item) => ({ ...item })) },
    { misconception: "ONE_LAYER_ONLY", imprints: correct.length ? [{ ...correct[correct.length - 1] }] : [] },
    { misconception: "WRONG_CUT_POSITION", imprints: shifted(correct, 7, -6) },
    { misconception: "WRONG_CUT_POSITION", imprints: shifted(correct, 10, 8) },
    { misconception: "EDGE_TREATED_AS_INTERIOR", imprints: boundaryAsInterior },
    ...extras.map((extra) => ({
      misconception: "EXTRA_IMPRINT" as const,
      imprints: [...correct.map((item) => ({ ...item })), extra],
    })),
  ];
}

function buildOptions(
  correct: readonly PfcDiscoveryImprintV1[],
  variantIndex: number,
): { options: PfcDiscoveryOptionV1[]; correctOptionIndex: number } {
  const cleanedCorrect = uniqueImprints(correct);
  const correctFingerprint = imprintFingerprint(cleanedCorrect);
  const selected: Array<{ misconception: PfcMisconceptionV1; imprints: PfcDiscoveryImprintV1[]; fingerprint: string }> = [{
    misconception: "CORRECT",
    imprints: cleanedCorrect,
    fingerprint: correctFingerprint,
  }];
  const seen = new Set([correctFingerprint]);

  if (!pfcDiscoveryOptionIsReadableV1({
    optionId: "A",
    misconception: "CORRECT",
    imprints: cleanedCorrect,
    fingerprint: correctFingerprint,
  })) {
    throw new Error(`PFC correct option is unreadable at variant ${variantIndex}.`);
  }

  for (const candidate of candidateOptions(cleanedCorrect, variantIndex)) {
    const imprints = uniqueImprints(candidate.imprints);
    const fingerprint = imprintFingerprint(imprints);
    if (!fingerprint || seen.has(fingerprint)) continue;
    const probe: PfcDiscoveryOptionV1 = {
      optionId: "A",
      misconception: candidate.misconception,
      imprints,
      fingerprint,
    };
    if (!pfcDiscoveryOptionIsReadableV1(probe)) continue;
    seen.add(fingerprint);
    selected.push({ ...candidate, imprints, fingerprint });
    if (selected.length === 4) break;
  }

  if (selected.length !== 4) {
    throw new Error(`PFC remediated option synthesis produced only ${selected.length} readable options at variant ${variantIndex}.`);
  }

  const rotation = variantIndex % 4;
  const ordered = [...selected.slice(rotation), ...selected.slice(0, rotation)];
  const options = ordered.map<PfcDiscoveryOptionV1>((option, index) => ({
    optionId: OPTION_IDS[index],
    misconception: option.misconception,
    imprints: option.imprints,
    fingerprint: option.fingerprint,
  }));
  const correctOptionIndex = options.findIndex((option) => option.fingerprint === correctFingerprint);
  return { options, correctOptionIndex };
}

function semanticFingerprint(question: PfcDiscoveryQuestionV1, cuts: readonly PfcCutV1[], unfoldedFingerprint: string): string {
  const foldFingerprint = question.folds
    .map((fold) => `${fold.kind}:${q(fold.line.a.x)},${q(fold.line.a.y)}>${q(fold.line.b.x)},${q(fold.line.b.y)}:${fold.movingSide}`)
    .join("|");
  const cutFingerprint = cuts
    .map((cut) => `${cut.kind}:${q(cut.center.x)},${q(cut.center.y)}:${q(cut.radius)}`)
    .join("|");
  return `${question.representationId}::${foldFingerprint}::${cutFingerprint}::${unfoldedFingerprint}`;
}

function explanation(
  question: PfcDiscoveryQuestionV1,
  cuts: readonly PfcCutV1[],
  solution: ReturnType<typeof solvePfcCutsV1>,
  correctOptionId: string,
): string {
  const layers = solution.cuts.map((cut) => cut.affectedLayerCount);
  const positions = cuts.flatMap((cut) =>
    canonicalPfcCutPositionsV1(solution, cut.cutId).map((point) => `(${point.x}, ${point.y})`),
  );
  const foldLabel = question.folds.length === 1 ? "1 fold" : `${question.folds.length} folds`;
  const cutLabel = cuts.length === 1 ? "The cut" : "The cuts";
  return `The paper has ${foldLabel}. ${cutLabel} pass through ${layers.join(" and ")} physical layer${layers.every((count) => count === 1) ? "" : "s"}. Open the folds in reverse order. The cut marks appear at ${positions.join(", ")}. This matches option ${correctOptionId}.`;
}

export function generatePfcDiscoveryQuestionV2(discoveryIndex: number): PfcDiscoveryQuestionV1 {
  const base = generatePfcDiscoveryQuestionV1(discoveryIndex);
  const cuts = correctedCuts(base);
  const solution = solvePfcCutsV1(base.sheetBoundary, base.folds, cuts);
  const correct = answerImprints(solution, cuts);
  const { options, correctOptionIndex } = buildOptions(correct, base.variantIndex);
  const correctOptionId = options[correctOptionIndex].optionId;

  return {
    ...base,
    cuts,
    unfoldedFingerprint: solution.unfoldedFingerprint,
    options,
    correctOptionIndex,
    correctOptionId,
    explanation: explanation(base, cuts, solution, correctOptionId),
    semanticFingerprint: semanticFingerprint(base, cuts, solution.unfoldedFingerprint),
  };
}

export function generatePfcDiscoveryCorpusV2(): PfcDiscoveryQuestionV1[] {
  return Array.from({ length: 800 }, (_, index) => generatePfcDiscoveryQuestionV2(index));
}

export function renderPfcDiscoveryReviewHtmlV2(questions: readonly PfcDiscoveryQuestionV1[]): string {
  return renderPfcDiscoveryReviewHtmlV1(questions).replace(
    "PFC-001 Discovery Learner Review V1",
    "PFC-001 Discovery Learner Review V2",
  );
}

export function pfcDiscoveryRepresentationCountV2(): number {
  return PFC_001_REPRESENTATION_CATALOG_V1.length;
}
