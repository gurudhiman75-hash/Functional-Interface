import {
  FIGURE_FORMATION_PERMANENT_QL_ALLOCATIONS_V10,
  type FigureFormationPermanentQlIdV10,
} from "./spatial-permanent-ql-allocation-v10";
import { FFM_001_SOURCE_SATURATION_AUTHORITY_V2 } from "./figure-formation-source-saturation-v2";

export type FigureFormationLanguageV3 = "en" | "hi" | "pa";
export type FigureFormationAnswerSurfaceV3 = "VISUAL_RESULT" | "LABELLED_SUBSET" | "VISUAL_PIECE_SET";
type Point = readonly [number, number];
type Atom = readonly [Point, Point, Point];
type Shape = readonly Atom[];
type Piece = Readonly<{ id: string; shape: Shape }>;
type Placement = Readonly<{ pieceId: string; rotationDegrees: 0 | 90 | 180 | 270; atoms: Shape }>;
type PlacementFact = Readonly<{ pieceId: string; rotationDegrees: 0 | 90 | 180 | 270 }>;
type Cell = readonly [number, number];

const OPTION_LABELS = Object.freeze(["A", "B", "C", "D"] as const);
const STROKE = "#111827";
const STROKE_WIDTH = 1.35;

function hash32(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
function shortHash(value: string): string { return hash32(value).toString(16).padStart(8, "0"); }
function pointKey([x, y]: Point): string { return `${x},${y}`; }
function sortAtom(points: readonly Point[]): Atom {
  return [...points].sort(([ax, ay], [bx, by]) => ax - bx || ay - by) as unknown as Atom;
}
function atomKey(atom: Atom): string { return [...atom].map(pointKey).sort().join(";"); }
function normalizeShape(shape: Shape): Atom[] {
  const points = shape.flatMap((atom) => [...atom]);
  const minX = Math.min(...points.map(([x]) => x));
  const minY = Math.min(...points.map(([, y]) => y));
  return shape
    .map((atom) => sortAtom(atom.map(([x, y]) => [x - minX, y - minY] as const)))
    .sort((left, right) => atomKey(left).localeCompare(atomKey(right)));
}
function shapeKey(shape: Shape): string { return normalizeShape(shape).map(atomKey).join("/"); }
function rotate90(shape: Shape): Atom[] {
  return normalizeShape(shape.map((atom) => sortAtom(atom.map(([x, y]) => [-y, x] as const))));
}
function orientations(shape: Shape) {
  const out: Array<{ rotationDegrees: 0 | 90 | 180 | 270; shape: Shape }> = [];
  const seen = new Set<string>();
  let current = normalizeShape(shape);
  for (const rotationDegrees of [0, 90, 180, 270] as const) {
    const key = shapeKey(current);
    if (!seen.has(key)) {
      seen.add(key);
      out.push({ rotationDegrees, shape: current });
    }
    current = rotate90(current);
  }
  return out;
}
function canonicalRotationKey(shape: Shape): string {
  return orientations(shape).map((entry) => shapeKey(entry.shape)).sort()[0]!;
}
function bounds(shape: Shape) {
  const points = shape.flatMap((atom) => [...atom]);
  return {
    minX: Math.min(...points.map(([x]) => x)),
    maxX: Math.max(...points.map(([x]) => x)),
    minY: Math.min(...points.map(([, y]) => y)),
    maxY: Math.max(...points.map(([, y]) => y)),
  };
}
function translate(shape: Shape, dx: number, dy: number): Atom[] {
  return shape.map((atom) => sortAtom(atom.map(([x, y]) => [x + dx, y + dy] as const)));
}
function atomA(x: number, y: number): Atom { return sortAtom([[x, y], [x + 1, y], [x, y + 1]]); }
function atomB(x: number, y: number): Atom { return sortAtom([[x + 1, y], [x, y + 1], [x + 1, y + 1]]); }
function cellsToShape(cells: readonly Cell[]): Atom[] {
  return normalizeShape(cells.flatMap(([x, y]) => [atomA(x, y), atomB(x, y)]));
}
function rectangleShape(width: number, height: number): Atom[] {
  const cells: Cell[] = [];
  for (let x = 0; x < width; x += 1) for (let y = 0; y < height; y += 1) cells.push([x, y]);
  return cellsToShape(cells);
}
function squareShape(size: number): Atom[] { return rectangleShape(size, size); }
function rightTriangleShape(size: number): Atom[] {
  const out: Atom[] = [];
  for (let x = 0; x < size; x += 1) for (let y = 0; y < size; y += 1) {
    for (const atom of [atomA(x, y), atomB(x, y)]) {
      if (atom.every(([px, py]) => px + py <= size)) out.push(atom);
    }
  }
  return normalizeShape(out);
}
function complement(target: Shape, part: Shape): Atom[] {
  const owned = new Set(normalizeShape(part).map(atomKey));
  return normalizeShape(target).filter((atom) => !owned.has(atomKey(atom)));
}
function triangleStripSplit(target: Shape, axis: "X" | "Y"): readonly [Atom[], Atom[]] {
  const normalized = normalizeShape(target);
  const first = normalized.filter((atom) => {
    const centroid = atom.reduce((sum, point) => sum + (axis === "X" ? point[0] : point[1]), 0) / 3;
    return centroid < 1;
  });
  return [normalizeShape(first), complement(normalized, first)];
}

function placementsFor(piece: Piece, target: Shape): Placement[] {
  const normalizedTarget = normalizeShape(target);
  const allowed = new Set(normalizedTarget.map(atomKey));
  const targetBounds = bounds(normalizedTarget);
  const out: Placement[] = [];
  for (const orientation of orientations(piece.shape)) {
    const pieceBounds = bounds(orientation.shape);
    for (let dx = 0; dx <= targetBounds.maxX - pieceBounds.maxX; dx += 1) {
      for (let dy = 0; dy <= targetBounds.maxY - pieceBounds.maxY; dy += 1) {
        const atoms = translate(orientation.shape, dx, dy);
        if (atoms.every((atom) => allowed.has(atomKey(atom)))) {
          out.push(Object.freeze({ pieceId: piece.id, rotationDegrees: orientation.rotationDegrees, atoms: Object.freeze(atoms) }));
        }
      }
    }
  }
  return out;
}
function findCover(pieces: readonly Piece[], target: Shape): readonly Placement[] | null {
  const normalizedTarget = normalizeShape(target);
  if (pieces.reduce((sum, piece) => sum + piece.shape.length, 0) !== normalizedTarget.length) return null;
  const groups = pieces
    .map((piece) => ({ piece, placements: placementsFor(piece, normalizedTarget) }))
    .sort((left, right) => left.placements.length - right.placements.length || left.piece.id.localeCompare(right.piece.id));
  if (groups.some((group) => group.placements.length === 0)) return null;
  function search(index: number, used: Set<string>, chosen: Placement[]): Placement[] | null {
    if (index === groups.length) return used.size === normalizedTarget.length ? chosen : null;
    for (const placement of groups[index]!.placements) {
      const keys = placement.atoms.map(atomKey);
      if (keys.some((key) => used.has(key))) continue;
      const next = new Set(used);
      keys.forEach((key) => next.add(key));
      const result = search(index + 1, next, [...chosen, placement]);
      if (result) return result;
    }
    return null;
  }
  return search(0, new Set(), []);
}

const CLEAN_CELL_SHAPES = Object.freeze({
  I4: Object.freeze([[0,0],[1,0],[2,0],[3,0]] as const),
  O4: Object.freeze([[0,0],[1,0],[0,1],[1,1]] as const),
  L4: Object.freeze([[0,0],[0,1],[0,2],[1,2]] as const),
  T4: Object.freeze([[0,0],[1,0],[2,0],[1,1]] as const),
  S4: Object.freeze([[1,0],[2,0],[0,1],[1,1]] as const),
  L8: Object.freeze([[0,0],[0,1],[0,2],[0,3],[1,3],[2,3],[3,3],[4,3]] as const),
  T8: Object.freeze([[0,0],[1,0],[2,0],[3,0],[4,0],[2,1],[2,2],[2,3]] as const),
  U8: Object.freeze([[0,0],[0,1],[0,2],[1,2],[2,2],[3,2],[3,1],[3,0]] as const),
  Z8: Object.freeze([[0,0],[1,0],[2,0],[3,0],[2,1],[3,1],[4,1],[5,1]] as const),
  P8: Object.freeze([[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2],[1,2]] as const),
} as const);

const TARGET_CATALOG_16 = Object.freeze([
  Object.freeze({ id: "RECTANGLE", shape: rectangleShape(4, 2) }),
  Object.freeze({ id: "RIGHT_TRIANGLE", shape: rightTriangleShape(4) }),
  Object.freeze({ id: "L_FORM", shape: cellsToShape(CLEAN_CELL_SHAPES.L8) }),
  Object.freeze({ id: "T_FORM", shape: cellsToShape(CLEAN_CELL_SHAPES.T8) }),
  Object.freeze({ id: "U_FORM", shape: cellsToShape(CLEAN_CELL_SHAPES.U8) }),
  Object.freeze({ id: "Z_FORM", shape: cellsToShape(CLEAN_CELL_SHAPES.Z8) }),
  Object.freeze({ id: "P_FORM", shape: cellsToShape(CLEAN_CELL_SHAPES.P8) }),
] as const);

function ql051Template(seed: string) {
  const targetIndex = hash32(`${seed}:family`) % 4;
  if (targetIndex === 0) {
    const target = rectangleShape(4, 2);
    return {
      target,
      pieces: [
        Object.freeze({ id: "1", shape: rectangleShape(2, 2) }),
        Object.freeze({ id: "2", shape: rectangleShape(2, 2) }),
      ],
      family: "TWO_RECTANGULAR_PARTS" as const,
    };
  }
  if (targetIndex === 1) {
    const target = rightTriangleShape(4);
    const [first, second] = triangleStripSplit(target, hash32(`${seed}:cut`) % 2 === 0 ? "X" : "Y");
    return {
      target,
      pieces: [Object.freeze({ id: "1", shape: first }), Object.freeze({ id: "2", shape: second })],
      family: "TWO_POLYGON_PARTS" as const,
    };
  }
  if (targetIndex === 2) {
    const target = rectangleShape(4, 2);
    const part1 = cellsToShape([[0,0],[0,1],[1,1]] as const);
    const part2 = cellsToShape([[1,0],[2,0],[3,0]] as const);
    const part3 = cellsToShape([[2,1],[3,1]] as const);
    return {
      target,
      pieces: [Object.freeze({ id: "1", shape: part1 }), Object.freeze({ id: "2", shape: part2 }), Object.freeze({ id: "3", shape: part3 })],
      family: "THREE_PART_ASSEMBLY" as const,
    };
  }
  const target = cellsToShape(CLEAN_CELL_SHAPES.L8);
  const firstCells = [[0,0],[0,1],[0,2],[0,3]] as const;
  const secondCells = [[1,3],[2,3],[3,3],[4,3]] as const;
  return {
    target,
    pieces: [Object.freeze({ id: "1", shape: cellsToShape(firstCells) }), Object.freeze({ id: "2", shape: cellsToShape(secondCells) })],
    family: "TWO_BAR_L_ASSEMBLY" as const,
  };
}

function cleanDecoyLibrary(targetKind: "SQUARE" | "TRIANGLE") {
  if (targetKind === "SQUARE") {
    return [
      cellsToShape(CLEAN_CELL_SHAPES.L8),
      cellsToShape(CLEAN_CELL_SHAPES.T8),
      cellsToShape(CLEAN_CELL_SHAPES.U8),
      cellsToShape(CLEAN_CELL_SHAPES.Z8),
      cellsToShape(CLEAN_CELL_SHAPES.P8),
      rectangleShape(8, 1),
      rectangleShape(4, 2),
    ];
  }
  return [
    cellsToShape(CLEAN_CELL_SHAPES.I4),
    cellsToShape(CLEAN_CELL_SHAPES.O4),
    cellsToShape(CLEAN_CELL_SHAPES.L4),
    cellsToShape(CLEAN_CELL_SHAPES.T4),
    cellsToShape(CLEAN_CELL_SHAPES.S4),
    rightTriangleShape(3),
  ];
}

function ql052Target(seed: string) {
  if (hash32(`${seed}:target-kind`) % 2 === 0) {
    const target = squareShape(4);
    const split = hash32(`${seed}:square-split`) % 3;
    if (split === 0) {
      const first = rightTriangleShape(4);
      return { targetKind: "SQUARE" as const, target, correct: [first, complement(target, first)] as const, splitFamily: "DIAGONAL" as const };
    }
    if (split === 1) {
      const first = rectangleShape(2, 4);
      const translated = translate(first, 2, 0);
      return { targetKind: "SQUARE" as const, target, correct: [first, normalizeShape(translated)] as const, splitFamily: "VERTICAL_HALVES" as const };
    }
    const firstCells = [[0,0],[0,1],[0,2],[0,3],[1,3],[2,3],[3,3],[3,2]] as const;
    const first = cellsToShape(firstCells);
    return { targetKind: "SQUARE" as const, target, correct: [first, complement(target, first)] as const, splitFamily: "ANGULAR_PARTITION" as const };
  }
  const target = rightTriangleShape(4);
  const axis = hash32(`${seed}:triangle-cut`) % 2 === 0 ? "X" as const : "Y" as const;
  const [first, second] = triangleStripSplit(target, axis);
  return { targetKind: "TRIANGLE" as const, target, correct: [first, second] as const, splitFamily: axis === "X" ? "VERTICAL_CUT" as const : "HORIZONTAL_CUT" as const };
}

function buildQl052Pool(seed: string) {
  const template = ql052Target(seed);
  const correctBase: Piece[] = [
    Object.freeze({ id: "C1", shape: template.correct[0] }),
    Object.freeze({ id: "C2", shape: template.correct[1] }),
  ];
  const decoys = cleanDecoyLibrary(template.targetKind)
    .filter((shape, index, all) => all.findIndex((other) => canonicalRotationKey(other) === canonicalRotationKey(shape)) === index)
    .filter((shape) => correctBase.every((piece) => canonicalRotationKey(piece.shape) !== canonicalRotationKey(shape)))
    .map((shape, index) => Object.freeze({ id: `D${index + 1}`, shape }));
  const triples: Array<readonly [number, number, number]> = [];
  for (let a = 0; a < decoys.length; a += 1) for (let b = a + 1; b < decoys.length; b += 1) for (let c = b + 1; c < decoys.length; c += 1) triples.push([a, b, c]);
  triples.sort((left, right) => hash32(`${seed}:triple:${left.join("-")}`) - hash32(`${seed}:triple:${right.join("-")}`));
  let selected: Piece[] | null = null;
  for (const triple of triples) {
    const pool = [...correctBase, ...triple.map((index) => decoys[index]!)];
    let solvablePairCount = 0;
    let correctOnly = false;
    for (let left = 0; left < pool.length; left += 1) for (let right = left + 1; right < pool.length; right += 1) {
      const pair = [Object.freeze({ id: "1", shape: pool[left]!.shape }), Object.freeze({ id: "2", shape: pool[right]!.shape })];
      if (findCover(pair, template.target)) {
        solvablePairCount += 1;
        if (left === 0 && right === 1) correctOnly = true;
      }
    }
    if (solvablePairCount === 1 && correctOnly) { selected = pool; break; }
  }
  if (!selected) throw new Error(`FFM QL052 ${template.targetKind} could not produce a unique clean five-piece pool.`);
  const decorated = selected
    .map((piece, index) => ({ piece, role: index < 2 ? `CORRECT_${index}` : "DECOY", score: hash32(`${seed}:pool:${index}:${shapeKey(piece.shape)}`) }))
    .sort((left, right) => left.score - right.score || left.role.localeCompare(right.role));
  const pool = decorated.map((entry, index) => Object.freeze({ id: String(index + 1), shape: entry.piece.shape }));
  const correctIndexes = decorated.map((entry, index) => entry.role.startsWith("CORRECT_") ? index : -1).filter((index) => index >= 0).sort((a, b) => a - b) as [number, number];
  const correctPieces = correctIndexes.map((index) => Object.freeze({ id: String(index + 1), shape: pool[index]!.shape }));
  const solution = findCover(correctPieces, template.target);
  if (!solution) throw new Error("FFM QL052 correct pair lost its clean exact-cover solution.");
  const wrongPairs: Array<[number, number]> = [];
  for (let left = 0; left < pool.length; left += 1) for (let right = left + 1; right < pool.length; right += 1) {
    if (left === correctIndexes[0] && right === correctIndexes[1]) continue;
    const pair = [Object.freeze({ id: String(left + 1), shape: pool[left]!.shape }), Object.freeze({ id: String(right + 1), shape: pool[right]!.shape })];
    if (!findCover(pair, template.target)) wrongPairs.push([left, right]);
  }
  wrongPairs.sort((left, right) => hash32(`${seed}:wrong:${left.join("-")}`) - hash32(`${seed}:wrong:${right.join("-")}`));
  const options = [
    { pair: correctIndexes, correct: true },
    ...wrongPairs.slice(0, 3).map((pair) => ({ pair, correct: false })),
  ]
    .map((entry, index) => ({ ...entry, score: hash32(`${seed}:option:${index}:${entry.pair.join("-")}`) }))
    .sort((left, right) => left.score - right.score || left.pair[0] - right.pair[0]);
  const correctIndex = options.findIndex((entry) => entry.correct);
  if (correctIndex < 0 || options.length !== 4) throw new Error("FFM QL052 failed to create four options.");
  return { ...template, pool, correctIndexes, solution, options, correctIndex };
}

function boundaryEdges(shape: Shape) {
  const counts = new Map<string, { count: number; a: Point; b: Point }>();
  for (const atom of normalizeShape(shape)) {
    for (const [a, b] of [[atom[0], atom[1]], [atom[1], atom[2]], [atom[0], atom[2]]] as const) {
      const key = [pointKey(a), pointKey(b)].sort().join("|");
      const current = counts.get(key);
      if (current) current.count += 1;
      else counts.set(key, { count: 1, a, b });
    }
  }
  return [...counts.values()].filter((entry) => entry.count === 1);
}
function shapeLines(shape: Shape, x: number, y: number, width: number, height: number, seed: string) {
  const variants = orientations(shape);
  const current = variants[hash32(seed) % variants.length]!.shape;
  const b = bounds(current);
  const shapeWidth = Math.max(1, b.maxX - b.minX);
  const shapeHeight = Math.max(1, b.maxY - b.minY);
  const scale = Math.min((width - 18) / shapeWidth, (height - 18) / shapeHeight);
  const ox = x + (width - shapeWidth * scale) / 2 - b.minX * scale;
  const oy = y + (height - shapeHeight * scale) / 2 - b.minY * scale;
  return boundaryEdges(current)
    .map(({ a, b: edgeB }) => `<line x1="${(ox + a[0] * scale).toFixed(2)}" y1="${(oy + a[1] * scale).toFixed(2)}" x2="${(ox + edgeB[0] * scale).toFixed(2)}" y2="${(oy + edgeB[1] * scale).toFixed(2)}"/>`)
    .join("");
}
function renderShape(shape: Shape, label: string, seed: string, width = 190, height = 145): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${label}"><rect width="${width}" height="${height}" fill="white"/><g stroke="${STROKE}" stroke-width="${STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round" fill="none">${shapeLines(shape, 12, 12, width - 24, height - 24, seed)}</g></svg>`;
}
function renderPieceRow(pieces: readonly Piece[], seed: string): string {
  const width = 360;
  const height = 150;
  const slot = width / pieces.length;
  const lines: string[] = [];
  const labels: string[] = [];
  pieces.forEach((piece, index) => {
    lines.push(shapeLines(piece.shape, index * slot + 8, 18, slot - 16, 84, `${seed}:piece:${piece.id}`));
    labels.push(`<text x="${(index * slot + slot / 2).toFixed(2)}" y="130" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="${STROKE}">${piece.id}</text>`);
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="Given pieces"><rect width="${width}" height="${height}" fill="white"/><g stroke="${STROKE}" stroke-width="${STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round" fill="none">${lines.join("")}</g>${labels.join("")}</svg>`;
}
function renderPool(pool: readonly Piece[], seed: string): string {
  const width = 410;
  const height = 150;
  const slot = width / pool.length;
  const lines: string[] = [];
  const labels: string[] = [];
  pool.forEach((piece, index) => {
    lines.push(shapeLines(piece.shape, index * slot + 6, 18, slot - 12, 84, `${seed}:pool:${piece.id}`));
    labels.push(`<text x="${(index * slot + slot / 2).toFixed(2)}" y="130" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="${STROKE}">${piece.id}</text>`);
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="Numbered pieces"><rect width="${width}" height="${height}" fill="white"/><g stroke="${STROKE}" stroke-width="${STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round" fill="none">${lines.join("")}</g>${labels.join("")}</svg>`;
}
function renderPairText(pair: readonly [number, number]): string {
  const left = pair[0] + 1;
  const right = pair[1] + 1;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 86" width="170" height="86" role="img" aria-label="Pieces ${left} and ${right}"><rect width="170" height="86" fill="white"/><text x="85" y="50" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="${STROKE}">${left} and ${right}</text></svg>`;
}
function renderVisualPair(pool: readonly Piece[], pair: readonly [number, number], seed: string): string {
  const left = pool[pair[0]]!;
  const right = pool[pair[1]]!;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 118" width="200" height="118" role="img" aria-label="Candidate piece set"><rect width="200" height="118" fill="white"/><g stroke="${STROKE}" stroke-width="${STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round" fill="none">${shapeLines(left.shape, 8, 12, 84, 90, `${seed}:left`)}${shapeLines(right.shape, 108, 12, 84, 90, `${seed}:right`)}</g></svg>`;
}

function allocationFor(qlId: FigureFormationPermanentQlIdV10) {
  const allocation = FIGURE_FORMATION_PERMANENT_QL_ALLOCATIONS_V10.find((entry) => entry.permanentQlId === qlId);
  if (!allocation) throw new Error(`Unknown FFM permanent QL '${qlId}'.`);
  return allocation;
}
function localizedStem(language: FigureFormationLanguageV3, qlId: FigureFormationPermanentQlIdV10, surface: FigureFormationAnswerSurfaceV3, targetKind: "SQUARE" | "TRIANGLE" | null, seed: string) {
  const variant = hash32(`${seed}:stem`) % 3;
  if (qlId === "SPA-QL-051") {
    const en = [
      "Which answer figure can be formed by joining all the given pieces?",
      "Choose the figure that can be made using every given piece exactly once.",
      "The given pieces are joined without overlapping. Which option can be formed?",
    ];
    const hi = [
      "सभी दिए गए टुकड़ों को जोड़ने पर कौन-सी उत्तर आकृति बन सकती है?",
      "हर दिए गए टुकड़े का ठीक एक बार उपयोग करके बनने वाली आकृति चुनिए।",
      "दिए गए टुकड़ों को बिना एक-दूसरे पर चढ़ाए जोड़ें। कौन-सा विकल्प बन सकता है?",
    ];
    const pa = [
      "ਸਾਰੇ ਦਿੱਤੇ ਟੁਕੜਿਆਂ ਨੂੰ ਜੋੜ ਕੇ ਕਿਹੜੀ ਉੱਤਰ ਆਕ੍ਰਿਤੀ ਬਣ ਸਕਦੀ ਹੈ?",
      "ਹਰ ਦਿੱਤੇ ਟੁਕੜੇ ਨੂੰ ਠੀਕ ਇੱਕ ਵਾਰ ਵਰਤ ਕੇ ਬਣਨ ਵਾਲੀ ਆਕ੍ਰਿਤੀ ਚੁਣੋ।",
      "ਦਿੱਤੇ ਟੁਕੜਿਆਂ ਨੂੰ ਬਿਨਾਂ ਇਕ-ਦੂਜੇ ਉੱਤੇ ਚੜ੍ਹਾਏ ਜੋੜੋ। ਕਿਹੜਾ ਵਿਕਲਪ ਬਣ ਸਕਦਾ ਹੈ?",
    ];
    return (language === "hi" ? hi : language === "pa" ? pa : en)[variant]!;
  }
  const enTarget = targetKind === "TRIANGLE" ? "triangle" : "square";
  const hiTarget = targetKind === "TRIANGLE" ? "त्रिभुज" : "वर्ग";
  const paTarget = targetKind === "TRIANGLE" ? "ਤਿਕੋਣ" : "ਵਰਗ";
  if (surface === "VISUAL_PIECE_SET") {
    if (language === "hi") return `कौन-सा टुकड़ा-समूह दिए गए ${hiTarget} को बना सकता है?`;
    if (language === "pa") return `ਕਿਹੜਾ ਟੁਕੜਾ-ਸਮੂਹ ਦਿੱਤਾ ${paTarget} ਬਣਾ ਸਕਦਾ ਹੈ?`;
    return `Which set of pieces can form the given ${enTarget}?`;
  }
  if (language === "hi") return `कौन-से दो क्रमांकित टुकड़े मिलकर दिए गए ${hiTarget} को बना सकते हैं?`;
  if (language === "pa") return `ਕਿਹੜੇ ਦੋ ਨੰਬਰ ਵਾਲੇ ਟੁਕੜੇ ਮਿਲ ਕੇ ਦਿੱਤਾ ${paTarget} ਬਣਾ ਸਕਦੇ ਹਨ?`;
  return `Which two numbered pieces can be joined to form the given ${enTarget}?`;
}
function localizedExplanation(language: FigureFormationLanguageV3, qlId: FigureFormationPermanentQlIdV10, answer: string, pieceNumbers: readonly number[], placements: readonly PlacementFact[], targetKind: "SQUARE" | "TRIANGLE" | null) {
  const rotations = placements.map((placement) => `${placement.pieceId}:${placement.rotationDegrees}°`).join(", ");
  if (language === "hi") {
    if (qlId === "SPA-QL-051") return Object.freeze({ rule: "हर टुकड़े का ठीक एक बार उपयोग होना चाहिए; घुमाना मान्य है, प्रतिबिंब नहीं।", working: `सही जोड़ में टुकड़ों के घुमाव ${rotations} हैं। इससे आकृति पूरी बनती है और न खाली जगह बचती है, न ओवरलैप होता है।`, answer: `इसलिए सही उत्तर ${answer} है।` });
    return Object.freeze({ rule: "चुने गए दोनों टुकड़ों को घुमाया जा सकता है, पर पलटा नहीं जा सकता; उन्हें लक्ष्य को पूरी तरह भरना चाहिए।", working: `टुकड़े ${pieceNumbers.join(" और ")} को ${targetKind === "TRIANGLE" ? "त्रिभुज" : "वर्ग"} में रखने पर घुमाव ${rotations} मिलते हैं और लक्ष्य बिना खाली जगह या ओवरलैप के पूरा भरता है।`, answer: `इसलिए सही उत्तर ${answer} है।` });
  }
  if (language === "pa") {
    if (qlId === "SPA-QL-051") return Object.freeze({ rule: "ਹਰ ਟੁਕੜਾ ਠੀਕ ਇੱਕ ਵਾਰ ਵਰਤਣਾ ਹੈ; ਘੁਮਾਉਣਾ ਮਨਜ਼ੂਰ ਹੈ, ਪਰ ਪਰਛਾਵਾਂ ਨਹੀਂ।", working: `ਸਹੀ ਜੋੜ ਵਿੱਚ ਟੁਕੜਿਆਂ ਦੇ ਘੁੰਮਾਅ ${rotations} ਹਨ। ਇਸ ਨਾਲ ਆਕ੍ਰਿਤੀ ਪੂਰੀ ਬਣਦੀ ਹੈ ਅਤੇ ਨਾ ਖਾਲੀ ਥਾਂ ਰਹਿੰਦੀ ਹੈ, ਨਾ ਓਵਰਲੈਪ।`, answer: `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।` });
    return Object.freeze({ rule: "ਚੁਣੇ ਦੋਵੇਂ ਟੁਕੜੇ ਘੁਮਾਏ ਜਾ ਸਕਦੇ ਹਨ ਪਰ ਪਲਟੇ ਨਹੀਂ; ਉਹ ਲਕਸ਼ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਰਨੇ ਚਾਹੀਦੇ ਹਨ।", working: `ਟੁਕੜੇ ${pieceNumbers.join(" ਅਤੇ ")} ਨੂੰ ${targetKind === "TRIANGLE" ? "ਤਿਕੋਣ" : "ਵਰਗ"} ਵਿੱਚ ਰੱਖਣ ਤੇ ਘੁੰਮਾਅ ${rotations} ਮਿਲਦੇ ਹਨ ਅਤੇ ਲਕਸ਼ ਬਿਨਾਂ ਖਾਲੀ ਥਾਂ ਜਾਂ ਓਵਰਲੈਪ ਦੇ ਪੂਰਾ ਭਰਦਾ ਹੈ।`, answer: `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।` });
  }
  if (qlId === "SPA-QL-051") return Object.freeze({ rule: "Use every piece exactly once. Rotation is allowed, but reflection is not.", working: `In the valid assembly the piece rotations are ${rotations}. Together they make the whole figure with no gap or overlap.`, answer: `Therefore, option ${answer} is correct.` });
  return Object.freeze({ rule: "The selected pieces may be rotated but not reflected; together they must cover the target completely.", working: `Pieces ${pieceNumbers.join(" and ")} fit the ${targetKind?.toLowerCase()} with rotations ${rotations}. They fill it with no gap or overlap.`, answer: `Therefore, option ${answer} is correct.` });
}
function reviewLifecycle() {
  return Object.freeze({
    reviewOnly: true as const,
    learnerContentFrozen: false as const,
    questionStudioDiscoverable: false as const,
    persistenceAllowed: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    studentDeliveryAuthorized: false as const,
    automaticStudentPublication: false as const,
  });
}
function buildQuestion(input: Readonly<{
  qlId: FigureFormationPermanentQlIdV10;
  language: FigureFormationLanguageV3;
  seed: string;
  surface: FigureFormationAnswerSurfaceV3;
  targetKind: "SQUARE" | "TRIANGLE" | null;
  stimulusSvgs: readonly string[];
  optionSvgs: readonly string[];
  correctIndex: number;
  geometryDescriptor: string;
  placements: readonly PlacementFact[];
  pieceNumbers: readonly number[];
  difficultyBand: "FOUNDATIONAL" | "MODERATE" | "ADVANCED";
  motifFamily: string;
}>) {
  const allocation = allocationFor(input.qlId);
  const answer = OPTION_LABELS[input.correctIndex]!;
  const geometryFingerprint = shortHash(input.geometryDescriptor);
  const contentFingerprint = shortHash(`${input.qlId}:${geometryFingerprint}:${input.correctIndex}:${input.optionSvgs.map(shortHash).join(":")}`);
  const canonicalItemId = `${input.qlId}:${geometryFingerprint}:${contentFingerprint}`;
  return Object.freeze({
    version: "SPA-FFM-001-REVIEW-RUNTIME-V3" as const,
    packageId: "SPA-001-FFM-001-REVIEW" as const,
    qlId: input.qlId,
    proposalId: allocation.proposalId,
    chapterCode: "FFM-001" as const,
    qlName: allocation.name,
    language: input.language,
    locale: input.language === "hi" ? "hi-IN" as const : input.language === "pa" ? "pa-IN" as const : "en-IN" as const,
    difficultyBand: input.difficultyBand,
    seed: input.seed,
    generationSeed: input.seed,
    mode: allocation.skillMode,
    motifFamily: input.motifFamily,
    answerSurface: input.surface,
    targetKind: input.targetKind,
    stem: localizedStem(input.language, input.qlId, input.surface, input.targetKind, input.seed),
    stimulusSvgs: Object.freeze([...input.stimulusSvgs]),
    optionSvgs: Object.freeze([...input.optionSvgs]),
    optionLabels: OPTION_LABELS,
    correctIndex: input.correctIndex as 0 | 1 | 2 | 3,
    answer,
    explanation: localizedExplanation(input.language, input.qlId, answer, input.pieceNumbers, input.placements, input.targetKind),
    canonicalItemId,
    questionLanguageId: `${canonicalItemId}:${input.language}`,
    contentFingerprint,
    geometryFingerprint,
    renderer: Object.freeze({ kind: "SVG" as const, background: "WHITE" as const, stroke: STROKE, strokeWidth: STROKE_WIDTH, recommendedStimulusPixels: 340, recommendedOptionPixels: 190 }),
    validation: Object.freeze({ exactCoverSolverBacked: true as const, everyRequiredPieceUsedExactlyOnce: true as const, rotationAllowed: true as const, reflectionAllowed: false as const, noGapNoOverlap: true as const, uniqueAnswer: true as const, cleanBoundaryMotifsOnly: true as const, svgSanitizedByConstruction: true as const, learnerExplanationSafe: true as const }),
    lifecycle: reviewLifecycle(),
    sourceAuthorityId: FFM_001_SOURCE_SATURATION_AUTHORITY_V2.authorityId,
    solveFacts: Object.freeze({ placements: Object.freeze(input.placements), reflectionUsed: false as const, overlapCount: 0 as const, uncoveredTargetUnits: 0 as const }),
  });
}

function generateQl051(seed: string, language: FigureFormationLanguageV3) {
  const template = ql051Template(seed);
  const solution = findCover(template.pieces, template.target);
  if (!solution) throw new Error("SPA-QL-051 clean template lost its exact-cover solution.");
  const targetKey = canonicalRotationKey(template.target);
  const distractors = TARGET_CATALOG_16
    .filter((candidate) => canonicalRotationKey(candidate.shape) !== targetKey)
    .filter((candidate) => findCover(template.pieces, candidate.shape) === null)
    .sort((left, right) => hash32(`${seed}:target:${left.id}`) - hash32(`${seed}:target:${right.id}`))
    .slice(0, 3);
  if (distractors.length !== 3) throw new Error(`SPA-QL-051 ${template.family} needs three solver-rejected clean distractors.`);
  const ordered = [
    { id: "CORRECT", shape: template.target, correct: true },
    ...distractors.map((candidate) => ({ id: candidate.id, shape: candidate.shape, correct: false })),
  ]
    .map((entry) => ({ ...entry, score: hash32(`${seed}:option:${entry.id}`) }))
    .sort((left, right) => left.score - right.score || left.id.localeCompare(right.id));
  const correctIndex = ordered.findIndex((entry) => entry.correct);
  return buildQuestion({
    qlId: "SPA-QL-051",
    language,
    seed,
    surface: "VISUAL_RESULT",
    targetKind: null,
    stimulusSvgs: [renderPieceRow(template.pieces, seed)],
    optionSvgs: ordered.map((entry, index) => renderShape(entry.shape, `Option ${OPTION_LABELS[index]}`, `${seed}:result:${entry.id}`)),
    correctIndex,
    geometryDescriptor: `QL051:${template.family}:${shapeKey(template.target)}:${ordered.map((entry) => canonicalRotationKey(entry.shape)).join("|")}`,
    placements: solution.map((placement) => ({ pieceId: placement.pieceId, rotationDegrees: placement.rotationDegrees })),
    pieceNumbers: template.pieces.map((_, index) => index + 1),
    difficultyBand: template.pieces.length === 3 ? "ADVANCED" : "MODERATE",
    motifFamily: template.family,
  });
}
function generateQl052(seed: string, language: FigureFormationLanguageV3) {
  const result = buildQl052Pool(seed);
  const surface: FigureFormationAnswerSurfaceV3 = hash32(`${seed}:surface`) % 2 === 0 ? "LABELLED_SUBSET" : "VISUAL_PIECE_SET";
  const optionSvgs = surface === "LABELLED_SUBSET"
    ? result.options.map((entry) => renderPairText(entry.pair))
    : result.options.map((entry, index) => renderVisualPair(result.pool, entry.pair, `${seed}:pair:${index}`));
  const stimulusSvgs = surface === "LABELLED_SUBSET"
    ? [renderShape(result.target, `${result.targetKind} target`, `${seed}:target`, 245, 175), renderPool(result.pool, seed)]
    : [renderShape(result.target, `${result.targetKind} target`, `${seed}:target`, 255, 180)];
  return buildQuestion({
    qlId: "SPA-QL-052",
    language,
    seed,
    surface,
    targetKind: result.targetKind,
    stimulusSvgs,
    optionSvgs,
    correctIndex: result.correctIndex,
    geometryDescriptor: `QL052:${result.targetKind}:${result.splitFamily}:${surface}:${shapeKey(result.target)}:${result.options.map((entry) => entry.pair.join("-")).join("|")}`,
    placements: result.solution.map((placement) => ({ pieceId: placement.pieceId, rotationDegrees: placement.rotationDegrees })),
    pieceNumbers: result.correctIndexes.map((index) => index + 1),
    difficultyBand: result.targetKind === "TRIANGLE" || result.splitFamily === "ANGULAR_PARTITION" ? "ADVANCED" : "MODERATE",
    motifFamily: `${result.targetKind}_${result.splitFamily}`,
  });
}

export function generateFigureFormationReviewQuestionV3(input: Readonly<{ qlId: FigureFormationPermanentQlIdV10; seed: string; language?: FigureFormationLanguageV3 }>) {
  const seed = String(input.seed ?? "").trim();
  if (!seed) throw new Error("FFM-001 V3 review generation requires an explicit seed.");
  const language = input.language ?? "en";
  if (!(["en", "hi", "pa"] as const).includes(language)) throw new Error(`Unsupported FFM language '${language}'.`);
  return input.qlId === "SPA-QL-051" ? generateQl051(seed, language) : generateQl052(seed, language);
}

export type FigureFormationReviewQuestionV3 = ReturnType<typeof generateFigureFormationReviewQuestionV3>;
