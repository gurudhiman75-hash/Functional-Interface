import {
  solvePfcCutsV1,
  type PfcCutV1,
  type PfcFoldV1,
} from "./paper-folding-foundation-v1";
import {
  PFC_TPF_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1,
  generatePfcTpfStudioBatchV1,
  generatePfcTpfStudioQuestionV1,
  type PfcTpfStudioLanguageV1,
  type PfcTpfStudioQlIdV1,
  type PfcTpfStudioQuestionV1,
} from "./paper-folding-question-studio-seeded-runtime-v1";
import { PFC_TPF_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2 } from "./paper-folding-localization-freeze-v2";
import type { SpatialPoint } from "./types";

export const PFC_TPF_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1_1 = Object.freeze({
  ...PFC_TPF_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1,
  authorityId: "PFC-TPF-QUESTION-STUDIO-SEEDED-RUNTIME-V1.1" as const,
  supersedesRuntimeAuthorityId: PFC_TPF_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.authorityId,
  remediation: [
    "QL038_BOUNDARY_NOTCH_PLACED_ON_ACTUAL_OVERLAPPED_FOLDED_BOUNDARY",
    "BOUNDARY_TOPOLOGY_SOLVER_ASSERTED_BEFORE_RENDER",
    "BOUNDARY_NOTCH_DISTRACTORS_USE_MISSING_LAYER_EXTRA_LAYER_OR_WRONG_AXIS",
    "NO_SPACING_ONLY_BOUNDARY_NOTCH_DISTRACTOR",
  ] as const,
  status: "SEEDED_RUNTIME_V1_1_OPERATOR_REVIEW_REQUIRED" as const,
} as const);

const LETTERS = ["A", "B", "C", "D"] as const;

function hash32(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function shortHash(value: string): string {
  return hash32(value).toString(16).padStart(8, "0");
}

function fraction(seed: string, key: string, min: number, max: number): number {
  const unit = hash32(`${seed}:${key}`) / 0xffffffff;
  return min + (max - min) * unit;
}

function boundaryNotchRequested(seed: string): boolean {
  return hash32(`${seed}:ql038-boundary-topology-v1-1`) % 4 === 0;
}

interface BoundaryNotchSheet {
  representation: "SQUARE" | "RECTANGLE";
  boundary: SpatialPoint[];
  width: number;
  height: number;
}

function boundaryNotchSheet(seed: string): BoundaryNotchSheet {
  const rectangle = hash32(`${seed}:boundary-sheet`) % 2 === 0;
  const width = rectangle ? 120 : 100;
  const height = rectangle ? 80 : 100;
  return {
    representation: rectangle ? "RECTANGLE" : "SQUARE",
    boundary: [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: height },
      { x: 0, y: height },
    ],
    width,
    height,
  };
}

function roundedNotch(x: number, y: number, r: number, clipId: string): string {
  return `<circle cx="${x.toFixed(3)}" cy="${y.toFixed(3)}" r="${r}" fill="white" stroke="#111" stroke-width="1.4" clip-path="url(#${clipId})" data-cutout="transparent"/>`;
}

function paperSvg(
  sheet: BoundaryNotchSheet,
  marks: readonly SpatialPoint[],
  width = 150,
): string {
  const margin = 10;
  const clipId = `paper-${shortHash(`${sheet.representation}:${marks.map((mark) => `${mark.x.toFixed(2)},${mark.y.toFixed(2)}`).join("|")}`)}`;
  const points = sheet.boundary.map((point) => `${point.x},${point.y}`).join(" ");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-margin} ${-margin} ${sheet.width + margin * 2} ${sheet.height + margin * 2}" width="${width}" height="${width}" style="background:#fff" role="img" aria-label="Paper with boundary notches"><defs><clipPath id="${clipId}"><polygon points="${points}"/></clipPath></defs><polygon points="${points}" fill="white" stroke="#111" stroke-width="1.4"/>${marks.map((mark) => roundedNotch(mark.x, mark.y, 4.4, clipId)).join("")}</svg>`;
}

function foldedBoundaryStimulus(sheet: BoundaryNotchSheet, cutY: number): string {
  const midX = sheet.width / 2;
  const panel = 170;
  const gap = 16;
  const originalClip = `original-${shortHash(`${sheet.width}:${sheet.height}:${cutY}`)}`;
  const foldedClip = `folded-${shortHash(`${sheet.height}:${cutY}`)}`;
  const marker = `arrow-${shortHash(`${cutY}`)}`;
  const originalPoints = sheet.boundary.map((point) => `${point.x},${point.y}`).join(" ");
  const foldedPoints = `0,0 ${midX},0 ${midX},${sheet.height} 0,${sheet.height}`;
  const originalView = `-10 -10 ${sheet.width + 20} ${sheet.height + 20}`;
  const foldedView = `-10 -10 ${midX + 20} ${sheet.height + 20}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${panel * 2 + gap} 205" width="${panel * 2 + gap}" height="205" style="background:#fff" role="img" aria-label="Fold then cut on the folded boundary"><defs><marker id="${marker}" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z" fill="#111"/></marker></defs><g transform="translate(0,25)"><text x="${panel / 2}" y="-7" text-anchor="middle" font-family="Arial,sans-serif" font-size="12">Fold</text><svg width="${panel}" height="${panel}" viewBox="${originalView}"><defs><clipPath id="${originalClip}"><polygon points="${originalPoints}"/></clipPath></defs><polygon points="${originalPoints}" fill="white" stroke="#111" stroke-width="1.4"/><line x1="${midX}" y1="0" x2="${midX}" y2="${sheet.height}" stroke="#111" stroke-width="1.3" stroke-dasharray="4 3"/><line x1="${sheet.width * 0.78}" y1="${sheet.height * 0.35}" x2="${midX + 3}" y2="${sheet.height * 0.35}" stroke="#111" stroke-width="1.4" marker-end="url(#${marker})"/></svg></g><g transform="translate(${panel + gap},25)"><text x="${panel / 2}" y="-7" text-anchor="middle" font-family="Arial,sans-serif" font-size="12">Cut</text><svg width="${panel}" height="${panel}" viewBox="${foldedView}"><defs><clipPath id="${foldedClip}"><polygon points="${foldedPoints}"/></clipPath></defs><polygon points="${foldedPoints}" fill="white" stroke="#111" stroke-width="1.4"/><polygon points="${foldedPoints}" fill="none" stroke="#777" stroke-width="0.9"/>${roundedNotch(0, cutY, 4.4, foldedClip)}</svg></g></svg>`;
}

function optionOrder<T>(correct: T, distractors: readonly [T, T, T], seed: string) {
  const correctIndex = (hash32(`${seed}:answer-slot`) % 4) as 0 | 1 | 2 | 3;
  const options: T[] = [];
  let wrong = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) options.push(correct);
    else options.push(distractors[wrong++]!);
  }
  return {
    options: options as [T, T, T, T],
    correctIndex,
    answer: LETTERS[correctIndex],
  };
}

function localizedBoundaryText(language: PfcTpfStudioLanguageV1, answer: string) {
  if (language === "hi") {
    return {
      stem: "कागज़ को दिखाए अनुसार मोड़ा गया है और मुड़े हुए कागज़ के किनारे पर कट लगाया गया है। कागज़ को पूरी तरह खोलने पर कौन-सा विकल्प सही होगा?",
      explanation: {
        observation: "कट मुड़े हुए कागज़ के किनारे पर है, इसलिए खोलने पर उससे बने निशान भी संबंधित बाहरी किनारों से जुड़े रहेंगे।",
        rule: "मोड़ खोलते समय किनारे वाले कट को अंदर का छेद न मानें। हर प्रभावित परत पर कट उसी बाहरी किनारे से जुड़ा रहता है।",
        application: `मोड़ खोलने पर कट बाएँ और दाएँ दोनों बाहरी किनारों पर बनता है। यह व्यवस्था केवल विकल्प ${answer} में है।`,
        check: `विकल्प ${answer} में दो किनारे वाले कट हैं; कोई कट गलती से कागज़ के अंदर नहीं रखा गया है।`,
      },
    };
  }
  if (language === "pa") {
    return {
      stem: "ਕਾਗਜ਼ ਨੂੰ ਦਿਖਾਏ ਅਨੁਸਾਰ ਮੋੜਿਆ ਗਿਆ ਹੈ ਅਤੇ ਮੋੜੇ ਕਾਗਜ਼ ਦੇ ਕਿਨਾਰੇ ਉੱਤੇ ਕੱਟ ਲਾਇਆ ਗਿਆ ਹੈ। ਕਾਗਜ਼ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਖੋਲ੍ਹਣ ਤੇ ਕਿਹੜਾ ਵਿਕਲਪ ਸਹੀ ਹੋਵੇਗਾ?",
      explanation: {
        observation: "ਕੱਟ ਮੋੜੇ ਕਾਗਜ਼ ਦੇ ਕਿਨਾਰੇ ਉੱਤੇ ਹੈ, ਇਸ ਲਈ ਖੋਲ੍ਹਣ ਤੇ ਬਣੇ ਨਿਸ਼ਾਨ ਵੀ ਸੰਬੰਧਤ ਬਾਹਰੀ ਕਿਨਾਰਿਆਂ ਨਾਲ ਜੁੜੇ ਰਹਿਣਗੇ।",
        rule: "ਮੋੜ ਖੋਲ੍ਹਦੇ ਸਮੇਂ ਕਿਨਾਰੇ ਵਾਲੇ ਕੱਟ ਨੂੰ ਅੰਦਰਲਾ ਛੇਦ ਨਾ ਮੰਨੋ। ਹਰ ਪ੍ਰਭਾਵਿਤ ਪਰਤ ਉੱਤੇ ਕੱਟ ਉਸੇ ਬਾਹਰੀ ਕਿਨਾਰੇ ਨਾਲ ਜੁੜਿਆ ਰਹਿੰਦਾ ਹੈ।",
        application: `ਮੋੜ ਖੋਲ੍ਹਣ ਤੇ ਕੱਟ ਖੱਬੇ ਅਤੇ ਸੱਜੇ ਦੋਵੇਂ ਬਾਹਰੀ ਕਿਨਾਰਿਆਂ ਉੱਤੇ ਬਣਦਾ ਹੈ। ਇਹ ਬਣਤਰ ਸਿਰਫ਼ ਵਿਕਲਪ ${answer} ਵਿੱਚ ਹੈ।`,
        check: `ਵਿਕਲਪ ${answer} ਵਿੱਚ ਦੋ ਕਿਨਾਰੇ ਵਾਲੇ ਕੱਟ ਹਨ; ਕੋਈ ਕੱਟ ਗਲਤੀ ਨਾਲ ਕਾਗਜ਼ ਦੇ ਅੰਦਰ ਨਹੀਂ ਰੱਖਿਆ ਗਿਆ।`,
      },
    };
  }
  return {
    stem: "The paper is folded as shown and a cut is made on the boundary of the folded paper. Which option is correct after the paper is fully unfolded?",
    explanation: {
      observation: "The cut lies on the boundary of the folded packet, so its unfolded copies must remain attached to the corresponding outer boundaries.",
      rule: "When unfolding, do not turn a boundary cut into an interior hole. Reflect the boundary contact through every affected folded layer.",
      application: `The cut appears on both the left and right outer boundaries after unfolding. Only option ${answer} has that topology.`,
      check: `Option ${answer} has two boundary-attached cuts and no cut has drifted into the paper interior.`,
    },
  };
}

function buildBoundaryNotchQuestion(
  seed: string,
  language: PfcTpfStudioLanguageV1,
): PfcTpfStudioQuestionV1 {
  if (!PFC_TPF_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.governance.seededQuestionStudioIntegrationAuthorized) {
    throw new Error("Localization freeze does not authorize seeded PFC/TPF Studio integration.");
  }
  const shell = generatePfcTpfStudioQuestionV1({ qlId: "SPA-QL-038", seed: `${seed}:shell`, language });
  const sheet = boundaryNotchSheet(seed);
  const midX = sheet.width / 2;
  const fold: PfcFoldV1 = {
    foldId: "F1",
    kind: "VERTICAL",
    line: { a: { x: midX, y: -80 }, b: { x: midX, y: sheet.height + 80 } },
    movingSide: "POSITIVE",
  };
  const cutY = sheet.height * fraction(seed, "boundary-cut-y", 0.27, 0.73);
  // After folding the right half onto the left half, x=0 is a real overlapped outer boundary.
  const cut: PfcCutV1 = {
    cutId: "N1",
    kind: "BOUNDARY_NOTCH",
    center: { x: 0, y: cutY },
    radius: 3.2,
  };
  const solution = solvePfcCutsV1(sheet.boundary, [fold], [cut]);
  const mapped = solution.cuts[0]?.mappedCuts ?? [];
  if (mapped.length !== 2) {
    throw new Error(`Boundary-notch Studio case expected 2 affected layers, received ${mapped.length}.`);
  }
  if (mapped.some((mark) => mark.originalContact !== "BOUNDARY")) {
    throw new Error("Boundary-notch Studio case produced an interior mapped cut.");
  }
  const correctMarks = mapped.map((mark) => ({ ...mark.originalCenter }));
  const wrongMissingLayer = [correctMarks[0]!];
  const wrongExtraLayer = [
    ...correctMarks,
    { x: sheet.width / 2, y: 0 },
  ];
  const wrongAxis = [
    { x: sheet.width * 0.35, y: 0 },
    { x: sheet.width * 0.35, y: sheet.height },
  ];
  const ordered = optionOrder(
    paperSvg(sheet, correctMarks),
    [
      paperSvg(sheet, wrongMissingLayer),
      paperSvg(sheet, wrongExtraLayer),
      paperSvg(sheet, wrongAxis),
    ],
    seed,
  );
  const text = localizedBoundaryText(language, ordered.answer);
  const geometrySignature = JSON.stringify({
    qlId: "SPA-QL-038",
    mode: "BOUNDARY_NOTCH_UNFOLD_V1_1",
    representation: sheet.representation,
    stimulus: foldedBoundaryStimulus(sheet, cutY),
    options: ordered.options,
    answer: ordered.answer,
    solverFingerprint: solution.unfoldedFingerprint,
  });
  const contentFingerprint = `pfc-tpf-${shortHash(geometrySignature)}`;
  return {
    ...shell,
    version: "PFC-TPF-QUESTION-STUDIO-QUESTION-V1",
    seed,
    generationSeed: `${seed}:SPA-QL-038:BOUNDARY-NOTCH-V1_1`,
    mode: "BOUNDARY_NOTCH_UNFOLD_V1_1",
    provenance: "SOURCE_BACKED_CORE",
    representation: sheet.representation,
    stem: text.stem,
    stimulusSvgs: [foldedBoundaryStimulus(sheet, cutY)],
    optionSvgs: ordered.options,
    correctIndex: ordered.correctIndex,
    answer: ordered.answer,
    explanation: text.explanation,
    questionId: `SPA-QL-038:${contentFingerprint}`,
    canonicalItemId: `SPA-QL-038:${contentFingerprint}`,
    questionLanguageId: `SPA-QL-038:${language.toUpperCase()}:${contentFingerprint}`,
    contentFingerprint,
    validation: {
      valid: true,
      exactSolverBacked: true,
      uniqueAnswer: true,
      optionArtUnique: true,
      spacingOnlyDistractorsAllowed: false,
      falsePyqAttribution: false,
    },
  };
}

export function generatePfcTpfStudioQuestionV1_1(input: {
  qlId: PfcTpfStudioQlIdV1;
  seed: string;
  language?: PfcTpfStudioLanguageV1;
}): PfcTpfStudioQuestionV1 {
  const language = input.language ?? "en";
  if (input.qlId === "SPA-QL-038" && boundaryNotchRequested(input.seed)) {
    return buildBoundaryNotchQuestion(input.seed, language);
  }
  return generatePfcTpfStudioQuestionV1(input);
}

export function generatePfcTpfStudioBatchV1_1(request: {
  seed: string;
  count?: number;
  qlId?: PfcTpfStudioQlIdV1;
  language?: PfcTpfStudioLanguageV1;
}) {
  const seed = String(request.seed ?? "").trim();
  if (!seed) throw new Error("PFC/TPF Studio batch generation requires an explicit seed.");
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 6) || 6)));
  const language = request.language ?? "en";
  const qls = request.qlId
    ? [request.qlId]
    : (["SPA-QL-035", "SPA-QL-036", "SPA-QL-037", "SPA-QL-038", "SPA-QL-039", "SPA-QL-040"] as const);
  const orderedQls = [...qls].sort((left, right) =>
    hash32(`${seed}:${left}:order`) - hash32(`${seed}:${right}:order`),
  );
  const questions: PfcTpfStudioQuestionV1[] = [];
  const seen = new Set<string>();
  for (let index = 0; index < count; index += 1) {
    const qlId = orderedQls[index % orderedQls.length]!;
    let accepted: PfcTpfStudioQuestionV1 | null = null;
    for (let retry = 0; retry < 80 && !accepted; retry += 1) {
      const question = generatePfcTpfStudioQuestionV1_1({
        qlId,
        seed: `${seed}:${index}:R${retry}`,
        language,
      });
      if (seen.has(question.contentFingerprint)) continue;
      seen.add(question.contentFingerprint);
      accepted = question;
    }
    if (!accepted) throw new Error(`${qlId}: unable to produce a unique PFC/TPF Studio V1.1 batch item.`);
    questions.push(accepted);
  }
  return {
    generationContext: {
      ...generatePfcTpfStudioBatchV1({ seed, count: 1, qlId: qls[0], language }).generationContext,
      count,
      runtimeAuthority: PFC_TPF_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1_1.authorityId,
    },
    questions,
  } as const;
}
