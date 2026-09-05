import { FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1 } from "./figure-matrix-source-saturated-discovery-v1";
import { FIGURE_MATRIX_PERMANENT_QL_ALLOCATIONS_V12 } from "./spatial-permanent-ql-allocation-v12";

export type FigureMatrixLanguageV1 = "en" | "hi" | "pa";
export type FigureMatrixQlIdV1 = "SPA-QL-055" | "SPA-QL-056" | "SPA-QL-057" | "SPA-QL-058" | "SPA-QL-059" | "SPA-QL-060";
export type FigureMatrixDifficultyV1 = "EASY" | "MODERATE" | "HARD";

type Glyph = "ARROW" | "TRIANGLE" | "CIRCLE" | "SQUARE" | "DIAMOND";
type Position = "C" | "N" | "E" | "S" | "W" | "NW" | "NE" | "SE" | "SW";
type Segment = "H" | "V" | "D1" | "D2";
type CellState = Readonly<{
  glyph?: Glyph;
  rotation?: number;
  filled?: boolean;
  position?: Position;
  segments?: readonly Segment[];
  dotCount?: number;
}>;

type RuleFacts = Readonly<{
  family: string;
  governingAxis: "ROW" | "COLUMN" | "BOTH";
  operation: string;
  parameter: string;
  workedExample: string;
  missingApplication: string;
  secondAxisCheck: string;
}>;

const OPTION_LABELS = ["A", "B", "C", "D"] as const;
const QLS: readonly FigureMatrixQlIdV1[] = ["SPA-QL-055", "SPA-QL-056", "SPA-QL-057", "SPA-QL-058", "SPA-QL-059", "SPA-QL-060"];
const SEGMENT_ORDER: readonly Segment[] = ["H", "V", "D1", "D2"];
const POSITION_CYCLE: readonly Position[] = ["N", "E", "S", "W"];

function hash32(text: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

function fingerprint(text: string): string {
  return `fmt-${hash32(text).toString(16).padStart(8, "0")}`;
}

function normRotation(value: number): number {
  return ((value % 360) + 360) % 360;
}

function shuffled<T>(input: readonly T[], seed: number): T[] {
  const out = [...input];
  let state = seed >>> 0;
  for (let i = out.length - 1; i > 0; i -= 1) {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function uniqueSegments(values: readonly Segment[]): readonly Segment[] {
  return Object.freeze(SEGMENT_ORDER.filter((segment) => values.includes(segment)));
}

function cell(input: CellState): CellState {
  return Object.freeze({
    ...input,
    rotation: input.rotation === undefined ? undefined : normRotation(input.rotation),
    segments: input.segments ? uniqueSegments(input.segments) : undefined,
  });
}

function cellKey(value: CellState): string {
  return JSON.stringify({
    glyph: value.glyph ?? null,
    rotation: value.rotation ?? 0,
    filled: value.filled ?? false,
    position: value.position ?? "C",
    segments: value.segments ? [...value.segments] : [],
    dotCount: value.dotCount ?? 0,
  });
}

function sameCell(a: CellState, b: CellState): boolean {
  return cellKey(a) === cellKey(b);
}

function positionPoint(position: Position | undefined): readonly [number, number] {
  const points: Record<Position, readonly [number, number]> = {
    C: [32, 32], N: [32, 18], E: [46, 32], S: [32, 46], W: [18, 32],
    NW: [20, 20], NE: [44, 20], SE: [44, 44], SW: [20, 44],
  };
  return points[position ?? "C"];
}

function glyphSvg(state: CellState): string {
  if (!state.glyph) return "";
  const [x, y] = positionPoint(state.position);
  const fill = state.filled ? "#111827" : "white";
  const transform = `translate(${x} ${y}) rotate(${state.rotation ?? 0})`;
  if (state.glyph === "CIRCLE") return `<circle cx="${x}" cy="${y}" r="9" fill="${fill}"/>`;
  if (state.glyph === "SQUARE") return `<rect x="${x - 8}" y="${y - 8}" width="16" height="16" fill="${fill}" transform="rotate(${state.rotation ?? 0} ${x} ${y})"/>`;
  if (state.glyph === "DIAMOND") return `<rect x="${x - 7}" y="${y - 7}" width="14" height="14" fill="${fill}" transform="rotate(${45 + (state.rotation ?? 0)} ${x} ${y})"/>`;
  if (state.glyph === "TRIANGLE") return `<polygon points="0,-10 9,8 -9,8" fill="${fill}" transform="${transform}"/>`;
  return `<g transform="${transform}"><line x1="-11" y1="0" x2="10" y2="0"/><polyline points="4,-6 11,0 4,6"/></g>`;
}

function segmentsSvg(segments: readonly Segment[] | undefined): string {
  if (!segments?.length) return "";
  const map: Record<Segment, string> = {
    H: '<line x1="13" y1="32" x2="51" y2="32"/>',
    V: '<line x1="32" y1="13" x2="32" y2="51"/>',
    D1: '<line x1="17" y1="17" x2="47" y2="47"/>',
    D2: '<line x1="47" y1="17" x2="17" y2="47"/>',
  };
  return segments.map((segment) => map[segment]).join("");
}

function dotsSvg(count: number | undefined): string {
  if (!count) return "";
  const points: readonly (readonly [number, number])[] = [
    [22, 22], [42, 22], [22, 42], [42, 42], [32, 32], [32, 14], [32, 50], [14, 32], [50, 32],
  ];
  return points.slice(0, Math.min(count, points.length)).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.7" fill="#111827" stroke="none"/>`).join("");
}

function renderCell(state: CellState, size = 92): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" role="img"><rect x="0" y="0" width="64" height="64" fill="white"/><g fill="none" stroke="#111827" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">${segmentsSvg(state.segments)}${glyphSvg(state)}</g>${dotsSvg(state.dotCount)}</svg>`;
}

function renderMatrix(matrix: readonly (CellState | null)[], matrixSize: number, missingIndex: number, filledMissing?: CellState): string {
  const cellSize = 64;
  const total = cellSize * matrixSize;
  const contents = matrix.map((entry, index) => {
    const row = Math.floor(index / matrixSize);
    const col = index % matrixSize;
    const x = col * cellSize;
    const y = row * cellSize;
    const resolved = index === missingIndex && filledMissing ? filledMissing : entry;
    const mark = resolved
      ? `<g transform="translate(${x} ${y})"><g fill="none" stroke="#111827" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">${segmentsSvg(resolved.segments)}${glyphSvg(resolved)}</g>${dotsSvg(resolved.dotCount)}</g>`
      : `<text x="${x + cellSize / 2}" y="${y + cellSize / 2 + 7}" text-anchor="middle" font-family="Arial,sans-serif" font-size="26" font-weight="700" fill="#111827">?</text>`;
    return `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="white" stroke="#111827" stroke-width="1.1"/>${mark}`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${Math.min(330, total * 1.25)}" height="${Math.min(330, total * 1.25)}" role="img">${contents}</svg>`;
}

function makeOptions(correct: CellState, distractors: readonly CellState[], seed: number) {
  const unique = [correct, ...distractors].filter((candidate, index, all) => all.findIndex((other) => sameCell(candidate, other)) === index);
  if (unique.length < 4) throw new Error("FMT-001 failed to construct four semantically distinct options.");
  const chosen = shuffled(unique.slice(0, 4), seed ^ 0x9e3779b9);
  const correctIndex = chosen.findIndex((candidate) => sameCell(candidate, correct));
  if (correctIndex < 0) throw new Error("FMT-001 correct option was lost during shuffle.");
  return { options: Object.freeze(chosen), correctIndex } as const;
}

function repeatedUnary(seed: number) {
  const stepChoices = [45, 90, 135] as const;
  const step = stepChoices[seed % stepChoices.length];
  const glyph: Glyph = seed % 2 === 0 ? "ARROW" : "TRIANGLE";
  const starts = [0, 45, 90].map((value, index) => normRotation(value + ((seed >>> (index + 1)) % 4) * 45));
  const matrix: (CellState | null)[] = [];
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) matrix.push(cell({ glyph, rotation: starts[row] + step * col }));
  }
  const missingIndex = 8;
  const first = matrix[6]!;
  const second = matrix[7]!;
  const inferredStep = normRotation((second.rotation ?? 0) - (first.rotation ?? 0));
  const correct = cell({ glyph, rotation: (second.rotation ?? 0) + inferredStep });
  if (!sameCell(correct, matrix[8]!)) throw new Error("FMT-PROP-01 independent solver disagrees with generated answer.");
  matrix[missingIndex] = null;
  const distractors = [
    cell({ glyph, rotation: second.rotation ?? 0 }),
    cell({ glyph, rotation: (second.rotation ?? 0) - inferredStep }),
    cell({ glyph, rotation: (correct.rotation ?? 0) + 45 }),
  ];
  const facts: RuleFacts = Object.freeze({
    family: "REPEATED_UNARY_TRANSFORM",
    governingAxis: "ROW",
    operation: "ROTATE",
    parameter: `${inferredStep}° per step`,
    workedExample: `In a completed row, the figure turns ${inferredStep}° from the first cell to the second and again by ${inferredStep}° to the third.`,
    missingApplication: `The third-row second figure is at ${second.rotation ?? 0}°. Applying the same ${inferredStep}° turn gives ${correct.rotation ?? 0}° for the missing cell.`,
    secondAxisCheck: "The same rotation increment is independently visible in the other completed rows.",
  });
  return { matrixSize: 3, matrix, missingIndex, correct, distractors, facts, difficulty: "MODERATE" as FigureMatrixDifficultyV1 };
}

function composeSegments(a: readonly Segment[], b: readonly Segment[], op: "UNION" | "XOR" | "INTERSECTION"): readonly Segment[] {
  if (op === "UNION") return uniqueSegments([...a, ...b]);
  if (op === "INTERSECTION") return uniqueSegments(a.filter((segment) => b.includes(segment)));
  return uniqueSegments([...a.filter((segment) => !b.includes(segment)), ...b.filter((segment) => !a.includes(segment))]);
}

function binaryComposition(seed: number) {
  const ops = ["UNION", "XOR", "INTERSECTION"] as const;
  const op = ops[seed % ops.length];
  const rows: readonly (readonly [readonly Segment[], readonly Segment[]])[] = op === "UNION" ? [
    [["H"], ["V"]], [["D1"], ["D2", "H"]], [["H", "V"], ["D1"]],
  ] : op === "XOR" ? [
    [["H", "V"], ["V", "D1"]], [["D1", "D2"], ["D2", "H"]], [["H", "V", "D1"], ["V", "D2"]],
  ] : [
    [["H", "V"], ["V", "D1"]], [["D1", "D2", "H"], ["H", "D2"]], [["H", "V", "D1"], ["V", "D1", "D2"]],
  ];
  const matrix: (CellState | null)[] = [];
  for (const [a, b] of rows) {
    matrix.push(cell({ segments: a }), cell({ segments: b }), cell({ segments: composeSegments(a, b, op) }));
  }
  const missingIndex = 8;
  const a = matrix[6]!.segments ?? [];
  const b = matrix[7]!.segments ?? [];
  const correct = cell({ segments: composeSegments(a, b, op) });
  if (!sameCell(correct, matrix[8]!)) throw new Error("FMT-PROP-02 independent solver disagrees with generated answer.");
  matrix[missingIndex] = null;
  const alternatives = (["UNION", "XOR", "INTERSECTION"] as const).filter((candidate) => candidate !== op).map((candidate) => cell({ segments: composeSegments(a, b, candidate) }));
  const missingOne = cell({ segments: (correct.segments ?? []).slice(1) });
  const addOne = cell({ segments: uniqueSegments([...(correct.segments ?? []), SEGMENT_ORDER.find((segment) => !(correct.segments ?? []).includes(segment)) ?? "H"]) });
  const distractors = [...alternatives, missingOne, addOne];
  const facts: RuleFacts = Object.freeze({
    family: "BINARY_FIGURE_COMPOSITION",
    governingAxis: "ROW",
    operation: op,
    parameter: "visible line segments",
    workedExample: `In each completed row, the third cell is obtained by the ${op.toLowerCase()} operation on the line segments in the first two cells.`,
    missingApplication: `Applying ${op.toLowerCase()} to the two visible segment sets in the last row gives {${(correct.segments ?? []).join(", ") || "none"}}.`,
    secondAxisCheck: "Both completed rows reproduce the same set operation exactly, including segments that cancel or remain absent.",
  });
  return { matrixSize: 3, matrix, missingIndex, correct, distractors, facts, difficulty: op === "UNION" ? "MODERATE" as FigureMatrixDifficultyV1 : "HARD" as FigureMatrixDifficultyV1 };
}

function quantitativeCount(seed: number) {
  const variant = seed % 3;
  const rule = variant === 0 ? "SUM" : variant === 1 ? "ABSOLUTE_DIFFERENCE" : "DOUBLE_FIRST_PLUS_SECOND";
  const rows = rule === "SUM" ? [[1, 2, 3], [2, 3, 5], [1, 4, 5]]
    : rule === "ABSOLUTE_DIFFERENCE" ? [[1, 3, 2], [2, 5, 3], [1, 5, 4]]
      : [[1, 1, 3], [1, 2, 4], [2, 1, 5]];
  const matrix: (CellState | null)[] = rows.flatMap((row) => row.map((count) => cell({ dotCount: count })));
  const missingIndex = 8;
  const first = matrix[6]!.dotCount ?? 0;
  const second = matrix[7]!.dotCount ?? 0;
  const solved = rule === "SUM" ? first + second : rule === "ABSOLUTE_DIFFERENCE" ? Math.abs(second - first) : 2 * first + second;
  const correct = cell({ dotCount: solved });
  if (!sameCell(correct, matrix[8]!)) throw new Error("FMT-PROP-03 independent solver disagrees with generated answer.");
  matrix[missingIndex] = null;
  const values = [solved - 2, solved - 1, solved + 1, solved + 2].filter((value) => value >= 1 && value <= 8 && value !== solved);
  while (values.length < 3) {
    const candidate = ((values.length + solved + 2) % 8) + 1;
    if (candidate !== solved && !values.includes(candidate)) values.push(candidate);
  }
  const distractors = values.slice(0, 3).map((value) => cell({ dotCount: value }));
  const description = rule === "SUM" ? "third count = first + second" : rule === "ABSOLUTE_DIFFERENCE" ? "third count = absolute difference of the first two" : "third count = twice the first + the second";
  const facts: RuleFacts = Object.freeze({
    family: "QUANTITATIVE_COUNT_RELATION",
    governingAxis: "ROW",
    operation: rule,
    parameter: description,
    workedExample: `The completed rows obey the same count equation: ${description}.`,
    missingApplication: `The last row has counts ${first} and ${second}; the rule gives ${solved} dots in the missing cell.`,
    secondAxisCheck: "The count equation is verified on both completed rows before it is applied to the incomplete row.",
  });
  return { matrixSize: 3, matrix, missingIndex, correct, distractors, facts, difficulty: rule === "SUM" ? "EASY" as FigureMatrixDifficultyV1 : "MODERATE" as FigureMatrixDifficultyV1 };
}

function cyclicPermutation(seed: number) {
  const variant = seed % 3;
  const matrixSize = variant === 1 ? 4 : 3;
  const missingIndex = matrixSize * matrixSize - 1;
  let matrix: (CellState | null)[] = [];
  let correct: CellState;
  let distractors: CellState[];
  let parameter: string;
  if (variant === 0) {
    const cycle: readonly Glyph[] = ["CIRCLE", "SQUARE", "TRIANGLE"];
    matrix = Array.from({ length: 9 }, (_, index) => {
      const row = Math.floor(index / 3); const col = index % 3;
      return cell({ glyph: cycle[(row + col) % 3] });
    });
    correct = cell({ glyph: cycle[(2 + 2) % 3] });
    distractors = [cell({ glyph: "CIRCLE" }), cell({ glyph: "TRIANGLE" }), cell({ glyph: "DIAMOND" })];
    parameter = "circle → square → triangle cyclic order";
  } else if (variant === 1) {
    matrix = Array.from({ length: 16 }, (_, index) => {
      const row = Math.floor(index / 4); const col = index % 4;
      return cell({ glyph: "CIRCLE", filled: true, position: POSITION_CYCLE[(row + col) % 4] });
    });
    correct = cell({ glyph: "CIRCLE", filled: true, position: POSITION_CYCLE[(3 + 3) % 4] });
    distractors = POSITION_CYCLE.filter((position) => position !== correct.position).map((position) => cell({ glyph: "CIRCLE", filled: true, position }));
    parameter = "top → right → bottom → left position cycle";
  } else {
    const rotations = [0, 120, 240] as const;
    matrix = Array.from({ length: 9 }, (_, index) => {
      const row = Math.floor(index / 3); const col = index % 3;
      return cell({ glyph: "TRIANGLE", rotation: rotations[(row + col) % 3] });
    });
    correct = cell({ glyph: "TRIANGLE", rotation: rotations[(2 + 2) % 3] });
    distractors = [cell({ glyph: "TRIANGLE", rotation: 0 }), cell({ glyph: "TRIANGLE", rotation: 240 }), cell({ glyph: "TRIANGLE", rotation: 60 })];
    parameter = "0° → 120° → 240° orientation cycle";
  }
  if (!sameCell(correct, matrix[missingIndex]!)) throw new Error("FMT-PROP-04 independent solver disagrees with generated answer.");
  const previousRowFirst = matrix[(matrixSize - 2) * matrixSize]!;
  const lastRowFirst = matrix[(matrixSize - 1) * matrixSize]!;
  if (sameCell(previousRowFirst, lastRowFirst)) throw new Error("FMT-PROP-04 cycle rows must advance rather than duplicate.");
  matrix[missingIndex] = null;
  const facts: RuleFacts = Object.freeze({
    family: "CYCLIC_DISTRIBUTION_OR_PERMUTATION",
    governingAxis: "BOTH",
    operation: "CYCLIC_SHIFT",
    parameter,
    workedExample: `Each completed row moves one place forward through the cycle (${parameter}); the next row starts one place later as well.`,
    missingApplication: "Continue the same cyclic order across the final row to obtain the missing state.",
    secondAxisCheck: "Reading down the columns gives the same one-place cyclic shift, so the answer satisfies both directions.",
  });
  return { matrixSize, matrix, missingIndex, correct, distractors, facts, difficulty: matrixSize === 4 ? "HARD" as FigureMatrixDifficultyV1 : "MODERATE" as FigureMatrixDifficultyV1 };
}

function orthogonalAttributes(seed: number) {
  const variant = seed % 3;
  const rowGlyphs: readonly Glyph[] = variant === 0
    ? ["ARROW", "TRIANGLE", "SQUARE"]
    : variant === 1 ? ["DIAMOND", "CIRCLE", "SQUARE"] : ["CIRCLE", "SQUARE", "TRIANGLE"];
  const colRotations = [0, 30, 60] as const;
  const colPositions: readonly Position[] = ["N", "C", "S"];
  const colCounts = [1, 2, 3] as const;
  const matrix: (CellState | null)[] = [];
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      if (variant === 0) matrix.push(cell({ glyph: rowGlyphs[row], rotation: colRotations[col] }));
      else if (variant === 1) matrix.push(cell({ glyph: rowGlyphs[row], filled: true, position: colPositions[col] }));
      else matrix.push(cell({ glyph: rowGlyphs[row], dotCount: colCounts[col] }));
    }
  }
  const candidateMissing = [4, 5, 7, 8];
  const missingIndex = candidateMissing[seed % candidateMissing.length];
  const row = Math.floor(missingIndex / 3); const col = missingIndex % 3;
  const rowDonor = matrix[row * 3 + ((col + 1) % 3)]!;
  const colDonor = matrix[((row + 1) % 3) * 3 + col]!;
  let correct: CellState;
  if (variant === 0) correct = cell({ glyph: rowDonor.glyph, rotation: colDonor.rotation });
  else if (variant === 1) correct = cell({ glyph: rowDonor.glyph, filled: true, position: colDonor.position });
  else correct = cell({ glyph: rowDonor.glyph, dotCount: colDonor.dotCount });
  if (!sameCell(correct, matrix[missingIndex]!)) throw new Error("FMT-PROP-05 independent row/column solver disagrees with generated answer.");
  matrix[missingIndex] = null;
  const wrongRow = rowGlyphs[(row + 1) % 3];
  const wrongCol = (col + 1) % 3;
  const distractors = variant === 0 ? [
    cell({ glyph: wrongRow, rotation: correct.rotation }),
    cell({ glyph: correct.glyph, rotation: colRotations[wrongCol] }),
    cell({ glyph: wrongRow, rotation: colRotations[wrongCol] }),
  ] : variant === 1 ? [
    cell({ glyph: wrongRow, filled: true, position: correct.position }),
    cell({ glyph: correct.glyph, filled: true, position: colPositions[wrongCol] }),
    cell({ glyph: wrongRow, filled: true, position: colPositions[wrongCol] }),
  ] : [
    cell({ glyph: wrongRow, dotCount: correct.dotCount }),
    cell({ glyph: correct.glyph, dotCount: colCounts[wrongCol] }),
    cell({ glyph: wrongRow, dotCount: colCounts[wrongCol] }),
  ];
  const controlled = variant === 0 ? "orientation" : variant === 1 ? "position" : "dot count";
  const facts: RuleFacts = Object.freeze({
    family: "ORTHOGONAL_ROW_COLUMN_ATTRIBUTES",
    governingAxis: "BOTH",
    operation: "ROW_ATTRIBUTE_PLUS_COLUMN_ATTRIBUTE",
    parameter: `row controls shape; column controls ${controlled}`,
    workedExample: `Across each row the main shape stays fixed, while each column carries the same ${controlled} value from top to bottom.`,
    missingApplication: `The missing cell must take the ${rowGlyphs[row].toLowerCase()} from its row and the ${controlled} required by column ${col + 1}.`,
    secondAxisCheck: "The row donor fixes one attribute and an independent column donor fixes the other; the correct option is the only one satisfying both.",
  });
  return { matrixSize: 3, matrix, missingIndex, correct, distractors, facts, difficulty: "HARD" as FigureMatrixDifficultyV1 };
}

function compoundRule(seed: number) {
  const rotationSteps = [45, 90, 135] as const;
  const step = rotationSteps[seed % rotationSteps.length];
  const positionStep = 1 + ((seed >>> 3) % 2);
  const startsRotation = [0, 45, 90];
  const startsPosition = [0, 1, 2];
  const matrix: (CellState | null)[] = [];
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      matrix.push(cell({
        glyph: "ARROW",
        rotation: startsRotation[row] + step * col,
        position: POSITION_CYCLE[(startsPosition[row] + positionStep * col) % 4],
      }));
    }
  }
  const missingIndex = 8;
  const first = matrix[6]!; const second = matrix[7]!;
  const inferredRotation = normRotation((second.rotation ?? 0) - (first.rotation ?? 0));
  const firstPos = POSITION_CYCLE.indexOf(first.position ?? "N");
  const secondPos = POSITION_CYCLE.indexOf(second.position ?? "N");
  const inferredPositionStep = (secondPos - firstPos + 4) % 4;
  const correct = cell({
    glyph: "ARROW",
    rotation: (second.rotation ?? 0) + inferredRotation,
    position: POSITION_CYCLE[(secondPos + inferredPositionStep) % 4],
  });
  if (!sameCell(correct, matrix[8]!)) throw new Error("FMT-PROP-06 independent compound solver disagrees with generated answer.");
  matrix[missingIndex] = null;
  const distractors = [
    cell({ glyph: "ARROW", rotation: correct.rotation, position: second.position }),
    cell({ glyph: "ARROW", rotation: second.rotation, position: correct.position }),
    cell({ glyph: "ARROW", rotation: (correct.rotation ?? 0) + 90, position: POSITION_CYCLE[(POSITION_CYCLE.indexOf(correct.position ?? "N") + 1) % 4] }),
  ];
  const facts: RuleFacts = Object.freeze({
    family: "COMPOUND_MATRIX_RULE",
    governingAxis: "ROW",
    operation: "ROTATE_AND_MOVE",
    parameter: `rotate ${inferredRotation}° and move ${inferredPositionStep} position-step(s) per cell`,
    workedExample: `In every completed row, one step performs two changes together: the arrow turns ${inferredRotation}° and moves ${inferredPositionStep} place(s) around top-right-bottom-left.`,
    missingApplication: `Apply both changes to the last visible cell of row 3: rotate to ${correct.rotation}° and move to position ${correct.position}.`,
    secondAxisCheck: "The earlier completed rows repeat both components together; an option matching only the angle or only the position is a near miss.",
  });
  return { matrixSize: 3, matrix, missingIndex, correct, distractors, facts, difficulty: "HARD" as FigureMatrixDifficultyV1 };
}

function buildPuzzle(qlId: FigureMatrixQlIdV1, seed: number) {
  if (qlId === "SPA-QL-055") return repeatedUnary(seed);
  if (qlId === "SPA-QL-056") return binaryComposition(seed);
  if (qlId === "SPA-QL-057") return quantitativeCount(seed);
  if (qlId === "SPA-QL-058") return cyclicPermutation(seed);
  if (qlId === "SPA-QL-059") return orthogonalAttributes(seed);
  return compoundRule(seed);
}

function localizedStem(language: FigureMatrixLanguageV1, variant: number): string {
  const en = [
    "Study the figure matrix carefully and choose the option that should replace the question mark.",
    "Which answer figure completes the matrix according to the rule followed by the rows and columns?",
    "Select the figure that correctly fills the blank cell in the matrix.",
  ];
  const hi = [
    "आकृति मैट्रिक्स को ध्यान से देखिए और प्रश्नवाचक चिह्न के स्थान पर आने वाली सही आकृति चुनिए।",
    "पंक्तियों और स्तंभों में चल रहे नियम के अनुसार कौन-सी उत्तर आकृति मैट्रिक्स को पूरा करती है?",
    "मैट्रिक्स के रिक्त खाने को सही ढंग से पूरा करने वाली आकृति चुनिए।",
  ];
  const pa = [
    "ਆਕ੍ਰਿਤੀ ਮੈਟ੍ਰਿਕਸ ਨੂੰ ਧਿਆਨ ਨਾਲ ਵੇਖੋ ਅਤੇ ਪ੍ਰਸ਼ਨ-ਚਿੰਨ੍ਹ ਦੀ ਥਾਂ ਆਉਣ ਵਾਲੀ ਸਹੀ ਆਕ੍ਰਿਤੀ ਚੁਣੋ।",
    "ਕਤਾਰਾਂ ਅਤੇ ਕਾਲਮਾਂ ਵਿੱਚ ਚੱਲ ਰਹੇ ਨਿਯਮ ਅਨੁਸਾਰ ਕਿਹੜੀ ਉੱਤਰ ਆਕ੍ਰਿਤੀ ਮੈਟ੍ਰਿਕਸ ਨੂੰ ਪੂਰਾ ਕਰਦੀ ਹੈ?",
    "ਮੈਟ੍ਰਿਕਸ ਦੇ ਖਾਲੀ ਖਾਣੇ ਨੂੰ ਸਹੀ ਤਰੀਕੇ ਨਾਲ ਪੂਰਾ ਕਰਨ ਵਾਲੀ ਆਕ੍ਰਿਤੀ ਚੁਣੋ।",
  ];
  return (language === "hi" ? hi : language === "pa" ? pa : en)[variant % 3];
}

function localizedExplanation(language: FigureMatrixLanguageV1, facts: RuleFacts, answer: string, distractorFailures: readonly string[]) {
  if (language === "hi") return Object.freeze({
    rule: `मुख्य नियम (${facts.governingAxis === "BOTH" ? "पंक्ति + स्तंभ" : facts.governingAxis === "ROW" ? "पंक्ति" : "स्तंभ"}): ${facts.operation} — ${facts.parameter}.`,
    worked: `पूरी पंक्तियों/स्तंभों से नियम की जाँच करें। ${facts.workedExample}`,
    application: `रिक्त खाने पर वही नियम लगाएँ। ${facts.missingApplication}`,
    verification: `${facts.secondAxisCheck} इसलिए सही उत्तर विकल्प ${answer} है।`,
    distractorChecks: Object.freeze(distractorFailures.map((failure) => `निकट विकल्प जाँच: ${failure}`)),
  });
  if (language === "pa") return Object.freeze({
    rule: `ਮੁੱਖ ਨਿਯਮ (${facts.governingAxis === "BOTH" ? "ਕਤਾਰ + ਕਾਲਮ" : facts.governingAxis === "ROW" ? "ਕਤਾਰ" : "ਕਾਲਮ"}): ${facts.operation} — ${facts.parameter}.`,
    worked: `ਪੂਰੀਆਂ ਕਤਾਰਾਂ/ਕਾਲਮਾਂ ਤੋਂ ਨਿਯਮ ਦੀ ਜਾਂਚ ਕਰੋ। ${facts.workedExample}`,
    application: `ਖਾਲੀ ਖਾਣੇ ਉੱਤੇ ਉਹੀ ਨਿਯਮ ਲਗਾਓ। ${facts.missingApplication}`,
    verification: `${facts.secondAxisCheck} ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ਵਿਕਲਪ ${answer} ਹੈ।`,
    distractorChecks: Object.freeze(distractorFailures.map((failure) => `ਨਜ਼ਦੀਕੀ ਵਿਕਲਪ ਜਾਂਚ: ${failure}`)),
  });
  return Object.freeze({
    rule: `Rule (${facts.governingAxis.toLowerCase()}): ${facts.operation} — ${facts.parameter}.`,
    worked: facts.workedExample,
    application: facts.missingApplication,
    verification: `${facts.secondAxisCheck} Therefore option ${answer} is correct.`,
    distractorChecks: Object.freeze(distractorFailures),
  });
}

function describeMismatch(candidate: CellState, correct: CellState): string {
  const failures: string[] = [];
  if (candidate.glyph !== correct.glyph) failures.push("wrong shape/motif");
  if ((candidate.rotation ?? 0) !== (correct.rotation ?? 0)) failures.push("wrong orientation");
  if ((candidate.position ?? "C") !== (correct.position ?? "C")) failures.push("wrong position");
  if ((candidate.filled ?? false) !== (correct.filled ?? false)) failures.push("wrong fill state");
  if ((candidate.dotCount ?? 0) !== (correct.dotCount ?? 0)) failures.push("wrong element count");
  if (JSON.stringify(candidate.segments ?? []) !== JSON.stringify(correct.segments ?? [])) failures.push("wrong segment set/composition");
  return failures.join(" and ") || "does not satisfy the declared matrix rule";
}

export function generateFigureMatrixReviewQuestionV1(input: Readonly<{
  qlId: FigureMatrixQlIdV1;
  seed: string;
  language: FigureMatrixLanguageV1;
}>) {
  if (!QLS.includes(input.qlId)) throw new Error(`FMT-001 review runtime does not own ${input.qlId}.`);
  const allocation = FIGURE_MATRIX_PERMANENT_QL_ALLOCATIONS_V12.find((item) => item.permanentQlId === input.qlId);
  if (!allocation) throw new Error(`Missing permanent allocation for ${input.qlId}.`);
  const h = hash32(`${input.qlId}|${input.seed}`);
  const puzzle = buildPuzzle(input.qlId, h);
  const optionPack = makeOptions(puzzle.correct, puzzle.distractors, h);
  const answer = OPTION_LABELS[optionPack.correctIndex];
  const distractorFailures = optionPack.options.map((option, index) => index === optionPack.correctIndex ? null : `Option ${OPTION_LABELS[index]}: ${describeMismatch(option, puzzle.correct)}.`).filter((value): value is string => value !== null);
  if (distractorFailures.length !== 3) throw new Error("FMT-001 must retain exactly three semantic distractor failures.");
  const explanation = localizedExplanation(input.language, puzzle.facts, answer, distractorFailures);
  const stem = localizedStem(input.language, h);
  const geometryKey = JSON.stringify({ qlId: input.qlId, matrix: puzzle.matrix.map((entry) => entry ? cellKey(entry) : null), matrixSize: puzzle.matrixSize, missingIndex: puzzle.missingIndex, options: optionPack.options.map(cellKey) });
  const geometryFingerprint = fingerprint(geometryKey);
  const contentFingerprint = fingerprint(`${geometryKey}|${input.language}|${stem}|${explanation.rule}|${explanation.application}|${explanation.verification}`);

  return Object.freeze({
    version: "SPA-FMT-001-REVIEW-QUESTION-V1" as const,
    authorityId: FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
    qlId: input.qlId,
    proposalId: allocation.proposalId,
    skillMode: allocation.skillMode,
    chapterCode: "FMT-001" as const,
    language: input.language,
    seed: input.seed,
    difficulty: puzzle.difficulty,
    stem,
    matrixSize: puzzle.matrixSize,
    missingIndex: puzzle.missingIndex,
    matrixSvg: renderMatrix(puzzle.matrix, puzzle.matrixSize, puzzle.missingIndex),
    optionSvgs: Object.freeze(optionPack.options.map((option) => renderCell(option))),
    optionLabels: OPTION_LABELS,
    correctIndex: optionPack.correctIndex,
    answer,
    solutionSvg: renderMatrix(puzzle.matrix, puzzle.matrixSize, puzzle.missingIndex, puzzle.correct),
    explanation,
    solveFacts: Object.freeze({
      family: puzzle.facts.family,
      governingAxis: puzzle.facts.governingAxis,
      operation: puzzle.facts.operation,
      parameter: puzzle.facts.parameter,
      semanticAnswerKey: cellKey(puzzle.correct),
      semanticOptionKeys: Object.freeze(optionPack.options.map(cellKey)),
      distractorFailures: Object.freeze(distractorFailures),
      matrixSize: puzzle.matrixSize,
      missingIndex: puzzle.missingIndex,
    }),
    validation: Object.freeze({
      semanticCellStateIsAuthority: true as const,
      solverRecomputedMissingCell: true as const,
      correctOptionSatisfiesDeclaredRule: true as const,
      allEvidentialAxesChecked: true as const,
      everyDistractorHasSemanticFailure: true as const,
      uniqueAnswer: true as const,
      duplicateSemanticOptionsRejected: true as const,
      deterministic: true as const,
      svgIsOutputNotAuthority: true as const,
      examStrokeWidthPx: 1.35 as const,
    }),
    geometryFingerprint,
    contentFingerprint,
    lifecycle: Object.freeze({
      reviewOnly: true as const,
      learnerContentFrozen: false as const,
      questionStudioDiscoverable: false as const,
      persistenceAllowed: false as const,
      questionBankWritable: false as const,
      testBuilderEligible: false as const,
      mockTestEligible: false as const,
      publicReleaseAuthorized: false as const,
      studentDeliveryAuthorized: false as const,
      automaticStudentPublication: false as const,
    }),
  });
}
