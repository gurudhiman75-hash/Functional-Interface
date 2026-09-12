import { generateFigureFormationReviewQuestionV4Final } from "./figure-formation-review-runtime-v4-final";
import type { FigureFormationLanguageV1 } from "./figure-formation-question-studio-v1";
import type { FigureFormationPermanentQlIdV10 } from "./spatial-permanent-ql-allocation-v10";

type Cell = readonly [number, number];
type GridShapeId = "DOMINO" | "I3" | "L3" | "O4" | "I4" | "L4" | "T4" | "S4" | "Z4";
type GridPiece = Readonly<{ id: string; shapeId: GridShapeId }>;
type GridPlacement = Readonly<{ pieceId: string; shapeId: GridShapeId; rotationDegrees: 0 | 90 | 180 | 270; cells: readonly Cell[] }>;
type Point = readonly [number, number];
type Atom = readonly [Point, Point, Point];
type AtomShape = readonly Atom[];
type AtomPiece = Readonly<{ id: string; shape: AtomShape }>;
type AtomPlacement = Readonly<{ pieceId: string; rotationDegrees: 0 | 90 | 180 | 270; atoms: AtomShape }>;

const STROKE = 1.35;
const SEAM_STROKE = 1.05;

function hash32(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
function svgText(x: number, y: number, text: string, size = 13, anchor = "middle"): string {
  return `<text x="${x.toFixed(2)}" y="${y.toFixed(2)}" text-anchor="${anchor}" font-family="Arial, sans-serif" font-size="${size}" fill="#111827" stroke="none">${text}</text>`;
}
function shell(width: number, height: number, body: string, label: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${label}"><rect width="${width}" height="${height}" fill="white"/>${body}</svg>`;
}
function rotationDelta(from: number, to: number): number { return (to - from + 360) % 360; }
function turnText(delta: number): string { return delta === 0 ? "no turn" : `turn ${delta}°`; }

const GRID_SHAPES: Readonly<Record<GridShapeId, readonly Cell[]>> = Object.freeze({
  DOMINO: Object.freeze([[0, 0], [1, 0]] as const),
  I3: Object.freeze([[0, 0], [1, 0], [2, 0]] as const),
  L3: Object.freeze([[0, 0], [0, 1], [1, 1]] as const),
  O4: Object.freeze([[0, 0], [1, 0], [0, 1], [1, 1]] as const),
  I4: Object.freeze([[0, 0], [1, 0], [2, 0], [3, 0]] as const),
  L4: Object.freeze([[0, 0], [0, 1], [0, 2], [1, 2]] as const),
  T4: Object.freeze([[0, 0], [1, 0], [2, 0], [1, 1]] as const),
  S4: Object.freeze([[1, 0], [2, 0], [0, 1], [1, 1]] as const),
  Z4: Object.freeze([[0, 0], [1, 0], [1, 1], [2, 1]] as const),
});
const ASSEMBLY_TEMPLATES = Object.freeze([
  Object.freeze({ pieceShapes: ["I4", "L4"] as const, target: [[0,0],[0,1],[0,2],[1,2],[2,2],[3,2],[4,2],[5,2]] as const }),
  Object.freeze({ pieceShapes: ["O4", "L4"] as const, target: [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2],[1,2]] as const }),
  Object.freeze({ pieceShapes: ["T4", "S4"] as const, target: [[0,0],[1,0],[1,1],[2,0],[2,1],[3,0],[3,1],[4,0]] as const }),
  Object.freeze({ pieceShapes: ["I4", "T4"] as const, target: [[0,0],[0,1],[0,2],[0,3],[1,0],[1,1],[1,2],[2,1]] as const }),
  Object.freeze({ pieceShapes: ["S4", "Z4"] as const, target: [[0,0],[0,1],[1,0],[1,1],[1,2],[2,0],[2,1],[3,1]] as const }),
  Object.freeze({ pieceShapes: ["L3", "I3", "DOMINO"] as const, target: [[0,0],[0,1],[1,0],[1,1],[2,0],[2,1],[3,0],[3,1]] as const }),
] as const);
function normalizeCells(cells: readonly Cell[]): Cell[] {
  const minX = Math.min(...cells.map(([x]) => x));
  const minY = Math.min(...cells.map(([, y]) => y));
  return cells.map(([x, y]) => [x - minX, y - minY] as const).sort(([ax, ay], [bx, by]) => ax - bx || ay - by);
}
function cellsKey(cells: readonly Cell[]): string { return normalizeCells(cells).map(([x, y]) => `${x},${y}`).join(";"); }
function rotateCells(cells: readonly Cell[]): Cell[] { return normalizeCells(cells.map(([x, y]) => [-y, x] as const)); }
function gridOrientations(cells: readonly Cell[]) {
  const result: Array<{ rotationDegrees: 0 | 90 | 180 | 270; cells: Cell[] }> = [];
  const seen = new Set<string>();
  let current = normalizeCells(cells);
  for (const rotationDegrees of [0, 90, 180, 270] as const) {
    const key = cellsKey(current);
    if (!seen.has(key)) { seen.add(key); result.push({ rotationDegrees, cells: current }); }
    current = rotateCells(current);
  }
  return result;
}
function gridPlacementsFor(piece: GridPiece, target: readonly Cell[]): GridPlacement[] {
  const normalizedTarget = normalizeCells(target);
  const allowed = new Set(normalizedTarget.map(([x, y]) => `${x},${y}`));
  const maxX = Math.max(...normalizedTarget.map(([x]) => x));
  const maxY = Math.max(...normalizedTarget.map(([, y]) => y));
  const result: GridPlacement[] = [];
  for (const orientation of gridOrientations(GRID_SHAPES[piece.shapeId])) {
    const px = Math.max(...orientation.cells.map(([x]) => x));
    const py = Math.max(...orientation.cells.map(([, y]) => y));
    for (let dx = 0; dx <= maxX - px; dx += 1) for (let dy = 0; dy <= maxY - py; dy += 1) {
      const cells = orientation.cells.map(([x, y]) => [x + dx, y + dy] as const);
      if (cells.every(([x, y]) => allowed.has(`${x},${y}`))) result.push(Object.freeze({ pieceId: piece.id, shapeId: piece.shapeId, rotationDegrees: orientation.rotationDegrees, cells: Object.freeze(cells) }));
    }
  }
  return result;
}
function findGridAssembly(pieces: readonly GridPiece[], target: readonly Cell[]): readonly GridPlacement[] {
  const required = new Set(normalizeCells(target).map(([x, y]) => `${x},${y}`));
  const groups = pieces.map((piece) => ({ piece, placements: gridPlacementsFor(piece, target) })).sort((a, b) => a.placements.length - b.placements.length || a.piece.id.localeCompare(b.piece.id));
  function search(index: number, used: Set<string>, chosen: GridPlacement[]): GridPlacement[] | null {
    if (index === groups.length) return used.size === required.size ? chosen : null;
    for (const placement of groups[index]!.placements) {
      const keys = placement.cells.map(([x, y]) => `${x},${y}`);
      if (keys.some((key) => used.has(key))) continue;
      const next = new Set(used); keys.forEach((key) => next.add(key));
      const solved = search(index + 1, next, [...chosen, placement]);
      if (solved) return solved;
    }
    return null;
  }
  const solved = search(0, new Set(), []);
  if (!solved) throw new Error("FFM V5 could not reconstruct QL051 exact assembly.");
  return solved;
}
function gridBoundary(cells: readonly Cell[], ox: number, oy: number, cell: number): string {
  const occupied = new Set(cells.map(([x, y]) => `${x},${y}`));
  const lines: string[] = [];
  for (const [x, y] of cells) {
    const x0 = ox + x * cell, y0 = oy + y * cell, x1 = x0 + cell, y1 = y0 + cell;
    if (!occupied.has(`${x},${y - 1}`)) lines.push(`<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}"/>`);
    if (!occupied.has(`${x + 1},${y}`)) lines.push(`<line x1="${x1}" y1="${y0}" x2="${x1}" y2="${y1}"/>`);
    if (!occupied.has(`${x},${y + 1}`)) lines.push(`<line x1="${x0}" y1="${y1}" x2="${x1}" y2="${y1}"/>`);
    if (!occupied.has(`${x - 1},${y}`)) lines.push(`<line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}"/>`);
  }
  return `<g stroke="#111827" stroke-width="${STROKE}" stroke-linecap="round" stroke-linejoin="round" fill="none">${lines.join("")}</g>`;
}
function renderGridShape(cells: readonly Cell[], x: number, y: number, width: number, height: number): string {
  const normalized = normalizeCells(cells);
  const w = Math.max(...normalized.map(([px]) => px)) + 1, h = Math.max(...normalized.map(([, py]) => py)) + 1;
  const cell = Math.min(22, (width - 8) / w, (height - 8) / h);
  const ox = x + (width - w * cell) / 2, oy = y + (height - h * cell) / 2;
  return gridBoundary(normalized, ox, oy, cell);
}
function renderGridAssembly(placements: readonly GridPlacement[], x: number, y: number, width: number, height: number, labels: readonly string[]): string {
  const all = placements.flatMap((placement) => placement.cells);
  const maxX = Math.max(...all.map(([px]) => px)), maxY = Math.max(...all.map(([, py]) => py));
  const cell = Math.min(24, (width - 18) / (maxX + 1), (height - 28) / (maxY + 1));
  const ox = x + (width - (maxX + 1) * cell) / 2, oy = y + 5 + (height - 28 - (maxY + 1) * cell) / 2;
  const owner = new Map<string, number>();
  placements.forEach((placement, index) => placement.cells.forEach(([cx, cy]) => owner.set(`${cx},${cy}`, index)));
  let body = `<g data-assembly-stage="joined">`;
  placements.forEach((placement, index) => {
    const fill = index % 2 === 0 ? "#f3f4f6" : "#ffffff";
    for (const [cx, cy] of placement.cells) body += `<rect x="${ox + cx * cell}" y="${oy + cy * cell}" width="${cell}" height="${cell}" fill="${fill}" stroke="none"/>`;
  });
  const outer: string[] = [], seams: string[] = [];
  for (const [key, piece] of owner) {
    const [cx, cy] = key.split(",").map(Number) as [number, number];
    const x0 = ox + cx * cell, y0 = oy + cy * cell, x1 = x0 + cell, y1 = y0 + cell;
    const checks = [
      { nk: `${cx},${cy - 1}`, line: [x0,y0,x1,y0] },
      { nk: `${cx + 1},${cy}`, line: [x1,y0,x1,y1] },
      { nk: `${cx},${cy + 1}`, line: [x0,y1,x1,y1] },
      { nk: `${cx - 1},${cy}`, line: [x0,y0,x0,y1] },
    ] as const;
    checks.forEach((entry, direction) => {
      const other = owner.get(entry.nk);
      const [ax, ay, bx, by] = entry.line;
      if (other === undefined) outer.push(`<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}"/>`);
      else if (other !== piece && (direction === 1 || direction === 2)) seams.push(`<line data-seam="true" x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}"/>`);
    });
  }
  body += `<g stroke="#111827" stroke-width="${STROKE}" stroke-linecap="round" fill="none">${outer.join("")}</g>`;
  body += `<g stroke="#6b7280" stroke-width="${SEAM_STROKE}" stroke-dasharray="4 3" fill="none">${seams.join("")}</g>`;
  placements.forEach((placement, index) => {
    const cx = placement.cells.reduce((sum, [px]) => sum + px + 0.5, 0) / placement.cells.length;
    const cy = placement.cells.reduce((sum, [, py]) => sum + py + 0.5, 0) / placement.cells.length;
    body += svgText(ox + cx * cell, oy + cy * cell + 4, labels[index]!, 12);
  });
  body += `</g>`;
  return body;
}

function pointKey([x, y]: Point): string { return `${x},${y}`; }
function edgeKey(a: Point, b: Point): string { return [pointKey(a), pointKey(b)].sort().join("|"); }
function atomKey(atom: Atom): string { return [...atom].map(pointKey).sort().join(";"); }
function sortAtom(points: readonly Point[]): Atom { return [...points].sort(([ax, ay], [bx, by]) => ax - bx || ay - by) as unknown as Atom; }
function normalizeAtoms(shape: AtomShape): Atom[] {
  const points = shape.flatMap((atom) => [...atom]);
  const minX = Math.min(...points.map(([x]) => x)), minY = Math.min(...points.map(([, y]) => y));
  return shape.map((atom) => sortAtom(atom.map(([x, y]) => [x - minX, y - minY] as const))).sort((a, b) => atomKey(a).localeCompare(atomKey(b)));
}
function atomShapeKey(shape: AtomShape): string { return normalizeAtoms(shape).map(atomKey).join("/"); }
function rotateAtom90(shape: AtomShape): Atom[] { return normalizeAtoms(shape.map((atom) => sortAtom(atom.map(([x, y]) => [-y, x] as const)))); }
function atomOrientations(shape: AtomShape) {
  const result: Array<{ rotationDegrees: 0 | 90 | 180 | 270; shape: AtomShape }> = [];
  const seen = new Set<string>(); let current = normalizeAtoms(shape);
  for (const rotationDegrees of [0, 90, 180, 270] as const) {
    const key = atomShapeKey(current);
    if (!seen.has(key)) { seen.add(key); result.push({ rotationDegrees, shape: current }); }
    current = rotateAtom90(current);
  }
  return result;
}
function translateAtoms(shape: AtomShape, dx: number, dy: number): Atom[] { return shape.map((atom) => sortAtom(atom.map(([x, y]) => [x + dx, y + dy] as const))); }
function atomBounds(shape: AtomShape) {
  const points = shape.flatMap((atom) => [...atom]);
  return { minX: Math.min(...points.map(([x]) => x)), maxX: Math.max(...points.map(([x]) => x)), minY: Math.min(...points.map(([, y]) => y)), maxY: Math.max(...points.map(([, y]) => y)) };
}
function atomPlacementsFor(piece: AtomPiece, target: AtomShape): AtomPlacement[] {
  const normalizedTarget = normalizeAtoms(target); const allowed = new Set(normalizedTarget.map(atomKey)); const tb = atomBounds(normalizedTarget); const result: AtomPlacement[] = [];
  for (const orientation of atomOrientations(piece.shape)) {
    const b = atomBounds(orientation.shape);
    for (let dx = 0; dx <= tb.maxX - b.maxX; dx += 1) for (let dy = 0; dy <= tb.maxY - b.maxY; dy += 1) {
      const atoms = translateAtoms(orientation.shape, dx, dy);
      if (atoms.every((atom) => allowed.has(atomKey(atom)))) result.push(Object.freeze({ pieceId: piece.id, rotationDegrees: orientation.rotationDegrees, atoms: Object.freeze(atoms) }));
    }
  }
  return result;
}
function findAtomAssembly(pieces: readonly AtomPiece[], target: AtomShape): readonly AtomPlacement[] | null {
  const required = new Set(normalizeAtoms(target).map(atomKey));
  if (pieces.reduce((sum, piece) => sum + piece.shape.length, 0) !== required.size) return null;
  const groups = pieces.map((piece) => ({ piece, placements: atomPlacementsFor(piece, target) })).sort((a, b) => a.placements.length - b.placements.length || a.piece.id.localeCompare(b.piece.id));
  function search(index: number, used: Set<string>, chosen: AtomPlacement[]): AtomPlacement[] | null {
    if (index === groups.length) return used.size === required.size ? chosen : null;
    for (const placement of groups[index]!.placements) {
      const keys = placement.atoms.map(atomKey); if (keys.some((key) => used.has(key))) continue;
      const next = new Set(used); keys.forEach((key) => next.add(key)); const solved = search(index + 1, next, [...chosen, placement]); if (solved) return solved;
    }
    return null;
  }
  return search(0, new Set(), []);
}
function atomA(x: number, y: number): Atom { return sortAtom([[x, y], [x + 1, y], [x, y + 1]]); }
function atomB(x: number, y: number): Atom { return sortAtom([[x + 1, y], [x, y + 1], [x + 1, y + 1]]); }
function squareTarget(size: number): Atom[] { const atoms: Atom[] = []; for (let x = 0; x < size; x += 1) for (let y = 0; y < size; y += 1) atoms.push(atomA(x,y), atomB(x,y)); return normalizeAtoms(atoms); }
function rightTriangleTarget(size: number): Atom[] {
  const atoms: Atom[] = [];
  for (let x = 0; x < size; x += 1) for (let y = 0; y < size; y += 1) for (const atom of [atomA(x,y), atomB(x,y)]) if (atom.every(([px, py]) => px + py <= size)) atoms.push(atom);
  return normalizeAtoms(atoms);
}
function polyominoTarget(cells: readonly (readonly [number, number])[]): Atom[] { return normalizeAtoms(cells.flatMap(([x,y]) => [atomA(x,y), atomB(x,y)])); }
function complement(target: AtomShape, part: AtomShape): Atom[] { const owned = new Set(normalizeAtoms(part).map(atomKey)); return normalizeAtoms(target).filter((atom) => !owned.has(atomKey(atom))); }
const POLY4 = Object.freeze([
  [[0,0],[1,0],[2,0],[3,0]], [[0,0],[0,1],[0,2],[1,2]], [[0,0],[1,0],[2,0],[1,1]], [[1,0],[2,0],[0,1],[1,1]], [[0,0],[1,0],[1,1],[2,1]], [[0,0],[1,0],[0,1],[1,1]], [[0,0],[0,1],[1,1],[2,1]],
] as const);
const POLY8 = Object.freeze([
  [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]], [[0,0],[1,0],[2,0],[3,0],[0,1],[1,1],[2,1],[3,1]], [[0,0],[0,1],[0,2],[0,3],[0,4],[1,4],[2,4],[3,4]], [[0,0],[1,0],[2,0],[3,0],[4,0],[2,1],[2,2],[2,3]], [[0,0],[1,0],[1,1],[2,1],[2,2],[3,2],[3,3],[4,3]], [[0,0],[0,1],[1,1],[1,2],[2,2],[2,3],[3,3],[3,4]],
] as const);
function targetTemplate(seed: string) {
  if (hash32(`${seed}:target-kind`) % 2 === 0) {
    const target = squareTarget(4), first = rightTriangleTarget(4);
    return { kind: "SQUARE" as const, target, correctShapes: [first, complement(target, first)] as const, decoys: POLY8.map(polyominoTarget) };
  }
  const target = rightTriangleTarget(4);
  const splitVariants = [[0,1,2,3,4,5,6,7],[0,1,2,3,4,5,6,9],[0,1,2,3,4,5,6,11]] as const;
  const indices = splitVariants[hash32(`${seed}:triangle-split`) % splitVariants.length]!;
  const first = normalizeAtoms(indices.map((index) => target[index]!));
  return { kind: "TRIANGLE" as const, target, correctShapes: [first, complement(target, first)] as const, decoys: POLY4.map(polyominoTarget) };
}
function chooseAtomPool(seed: string) {
  const template = targetTemplate(seed);
  const correct: AtomPiece[] = [Object.freeze({ id: "C1", shape: template.correctShapes[0] }), Object.freeze({ id: "C2", shape: template.correctShapes[1] })];
  const candidates = template.decoys.map((shape, index) => Object.freeze({ id: `D${index + 1}`, shape }));
  const triples: [number, number, number][] = [];
  for (let a = 0; a < candidates.length; a += 1) for (let b = a + 1; b < candidates.length; b += 1) for (let c = b + 1; c < candidates.length; c += 1) triples.push([a,b,c]);
  triples.sort((a,b) => hash32(`${seed}:triple:${a.join("-")}`) - hash32(`${seed}:triple:${b.join("-")}`));
  let selected: AtomPiece[] | null = null;
  for (const triple of triples) {
    const pool = [...correct, ...triple.map((index) => candidates[index]!)]; const solvable: [number, number][] = [];
    for (let left = 0; left < pool.length; left += 1) for (let right = left + 1; right < pool.length; right += 1) {
      const pair = [Object.freeze({ id: String(left + 1), shape: pool[left]!.shape }), Object.freeze({ id: String(right + 1), shape: pool[right]!.shape })];
      if (findAtomAssembly(pair, template.target)) solvable.push([left,right]);
    }
    if (solvable.length === 1 && solvable[0]![0] === 0 && solvable[0]![1] === 1) { selected = pool; break; }
  }
  if (!selected) throw new Error("FFM V5 could not reproduce target-shape pool.");
  const decorated = selected.map((piece,index) => ({ piece, role: index < 2 ? `CORRECT_${index}` : "DECOY", score: hash32(`${seed}:pool:${index}:${atomShapeKey(piece.shape)}`) }));
  decorated.sort((a,b) => a.score - b.score || a.role.localeCompare(b.role));
  const pool = decorated.map((entry,index) => Object.freeze({ id: String(index + 1), shape: entry.piece.shape, role: entry.role }));
  const correctIndexes = decorated.map((entry,index) => entry.role.startsWith("CORRECT_") ? index : -1).filter((index) => index >= 0).sort((a,b)=>a-b) as [number,number];
  const correctPieces = correctIndexes.map((index) => Object.freeze({ id: String(index + 1), shape: pool[index]!.shape }));
  const solution = findAtomAssembly(correctPieces, template.target); if (!solution) throw new Error("FFM V5 atom solution missing.");
  const wrongPairs: [number, number][] = [];
  for (let left = 0; left < pool.length; left += 1) for (let right = left + 1; right < pool.length; right += 1) {
    if (left === correctIndexes[0] && right === correctIndexes[1]) continue;
    const pair = [Object.freeze({ id: String(left + 1), shape: pool[left]!.shape }), Object.freeze({ id: String(right + 1), shape: pool[right]!.shape })];
    if (!findAtomAssembly(pair, template.target)) wrongPairs.push([left,right]);
  }
  wrongPairs.sort((a,b)=>hash32(`${seed}:wrong:${a.join("-")}`)-hash32(`${seed}:wrong:${b.join("-")}`));
  const options = [{ pair: correctIndexes, correct: true }, ...wrongPairs.slice(0,3).map((pair)=>({pair,correct:false}))]
    .map((entry,index)=>({...entry,score:hash32(`${seed}:option:${index}:${entry.pair.join("-")}`)}))
    .sort((a,b)=>a.score-b.score || a.pair[0]-b.pair[0]);
  const correctIndex = options.findIndex((entry)=>entry.correct);
  return { ...template, pool, solution, options, correctIndex, correctPair: options[correctIndex]!.pair };
}
function atomBoundary(shape: AtomShape) {
  const counts = new Map<string, { count: number; a: Point; b: Point }>();
  for (const atom of normalizeAtoms(shape)) for (const [a,b] of [[atom[0],atom[1]],[atom[1],atom[2]],[atom[0],atom[2]]] as readonly [Point,Point][]) {
    const key = edgeKey(a,b), current = counts.get(key); if (current) current.count += 1; else counts.set(key,{count:1,a,b});
  }
  return [...counts.values()].filter((entry)=>entry.count===1);
}
function renderAtomShape(shape: AtomShape, x: number, y: number, width: number, height: number): string {
  const normalized = normalizeAtoms(shape), b = atomBounds(normalized), scale = Math.min(24,(width-8)/Math.max(1,b.maxX-b.minX),(height-8)/Math.max(1,b.maxY-b.minY));
  const ox = x + (width - (b.maxX-b.minX)*scale)/2, oy = y + (height - (b.maxY-b.minY)*scale)/2;
  return `<g stroke="#111827" stroke-width="${STROKE}" stroke-linecap="round" fill="none">${atomBoundary(normalized).map(({a,b:bb})=>`<line x1="${ox+a[0]*scale}" y1="${oy+a[1]*scale}" x2="${ox+bb[0]*scale}" y2="${oy+bb[1]*scale}"/>`).join("")}</g>`;
}
function renderAtomAssembly(target: AtomShape, placements: readonly AtomPlacement[], x: number, y: number, width: number, height: number, labels: readonly string[]): string {
  const normalizedTarget = normalizeAtoms(target), b = atomBounds(normalizedTarget), scale = Math.min(27,(width-18)/Math.max(1,b.maxX-b.minX),(height-30)/Math.max(1,b.maxY-b.minY));
  const ox = x + (width - (b.maxX-b.minX)*scale)/2, oy = y + 5 + (height-30-(b.maxY-b.minY)*scale)/2;
  const edgeOwners = new Map<string, Array<{ owner: number; a: Point; b: Point }>>(); let body = `<g data-assembly-stage="joined">`;
  placements.forEach((placement,index)=>{
    const fill = index % 2 === 0 ? "#f3f4f6" : "#ffffff";
    for (const atom of placement.atoms) {
      body += `<polygon points="${atom.map(([px,py])=>`${ox+px*scale},${oy+py*scale}`).join(" ")}" fill="${fill}" stroke="none"/>`;
      for (const [a,bb] of [[atom[0],atom[1]],[atom[1],atom[2]],[atom[0],atom[2]]] as readonly [Point,Point][]) {
        const key=edgeKey(a,bb), entries=edgeOwners.get(key)??[]; entries.push({owner:index,a,b:bb}); edgeOwners.set(key,entries);
      }
    }
  });
  const outer: string[] = [], seams: string[] = [];
  for (const entries of edgeOwners.values()) {
    const first = entries[0]!; const line = `<line x1="${ox+first.a[0]*scale}" y1="${oy+first.a[1]*scale}" x2="${ox+first.b[0]*scale}" y2="${oy+first.b[1]*scale}"/>`;
    if (entries.length === 1) outer.push(line); else if (entries.some((entry)=>entry.owner !== first.owner)) seams.push(line.replace("<line ","<line data-seam=\"true\" "));
  }
  body += `<g stroke="#111827" stroke-width="${STROKE}" stroke-linecap="round" fill="none">${outer.join("")}</g><g stroke="#6b7280" stroke-width="${SEAM_STROKE}" stroke-dasharray="4 3" fill="none">${seams.join("")}</g>`;
  placements.forEach((placement,index)=>{
    const points = placement.atoms.flatMap((atom)=>[...atom]); const cx=points.reduce((s,[px])=>s+px,0)/points.length, cy=points.reduce((s,[,py])=>s+py,0)/points.length;
    body += svgText(ox+cx*scale,oy+cy*scale+4,labels[index]!,12);
  });
  return body + `</g>`;
}

function panelFrames(): string {
  return `<g fill="none" stroke="#d1d5db" stroke-width="1"><rect x="8" y="30" width="270" height="185" rx="5"/><rect x="315" y="30" width="270" height="185" rx="5"/><rect x="622" y="30" width="270" height="185" rx="5"/></g>${svgText(143,20,"1. As shown",13)}${svgText(450,20,"2. Turn pieces",13)}${svgText(757,20,"3. Join in final positions",13)}${svgText(296,125,"→",28)}${svgText(603,125,"→",28)}`;
}
function renderGridProcess(pieces: readonly GridPiece[], placements: readonly GridPlacement[], displayRotations: readonly number[], labels: readonly string[]): { svg: string; deltas: number[] } {
  const sortedPlacements = labels.map((_,index)=>placements.find((placement)=>placement.pieceId===pieces[index]!.id)!);
  const deltas = sortedPlacements.map((placement,index)=>rotationDelta(displayRotations[index]!,placement.rotationDegrees));
  const slot = 250 / pieces.length; let body = panelFrames();
  pieces.forEach((piece,index)=>{
    const displayed = gridOrientations(GRID_SHAPES[piece.shapeId]).find((entry)=>entry.rotationDegrees===displayRotations[index])!.cells;
    body += renderGridShape(displayed,18+index*slot,55,slot-8,95); body += svgText(18+index*slot+(slot-8)/2,176,labels[index]!,12);
    const finalShape = normalizeCells(sortedPlacements[index]!.cells); body += renderGridShape(finalShape,325+index*slot,55,slot-8,95); body += svgText(325+index*slot+(slot-8)/2,176,`${labels[index]} · ${turnText(deltas[index]!)}`,11);
  });
  body += renderGridAssembly(sortedPlacements,632,48,250,145,labels); body += svgText(757,207,"dashed line = joining seam",11);
  return { svg: shell(900,225,body,"Three-step figure-formation explanation showing original pieces, their required turns, and their exact joined positions"), deltas };
}
function renderAtomProcess(pool: readonly any[], pair: readonly [number,number], placements: readonly AtomPlacement[], seed: string, qlId: FigureFormationPermanentQlIdV10, optionIndex: number, labels: readonly string[], target: AtomShape): { svg: string; deltas: number[] } {
  const selected = pair.map((index)=>pool[index]!); const slot=125; const displayRotations:number[]=[]; let body=panelFrames();
  selected.forEach((piece,index)=>{
    const variants=atomOrientations(piece.shape); const displaySeed=qlId==="SPA-QL-052"?`${seed}:piece:${pair[index]}`:`${seed}:${optionIndex}:${index===0?"left":"right"}`; const displayed=variants[hash32(displaySeed)%variants.length]!; displayRotations.push(displayed.rotationDegrees);
    body += renderAtomShape(displayed.shape,20+index*slot,55,slot-10,95); body += svgText(20+index*slot+(slot-10)/2,176,labels[index]!,12);
  });
  const sortedPlacements=selected.map((_,index)=>placements.find((placement)=>placement.pieceId===String(pair[index]!+1))!); const deltas=sortedPlacements.map((placement,index)=>rotationDelta(displayRotations[index]!,placement.rotationDegrees));
  sortedPlacements.forEach((placement,index)=>{ body += renderAtomShape(normalizeAtoms(placement.atoms),327+index*slot,55,slot-10,95); body += svgText(327+index*slot+(slot-10)/2,176,`${labels[index]} · ${turnText(deltas[index]!)}`,11); });
  body += renderAtomAssembly(target,sortedPlacements,632,48,250,145,labels); body += svgText(757,207,"dashed line = joining seam",11);
  return { svg:shell(900,225,body,"Three-step figure-formation explanation showing original pieces, their required turns, and their exact joined positions"),deltas };
}
function EnglishExplanation(base:any, labels:readonly string[], deltas:readonly number[]) {
  const turnPlan=labels.map((label,index)=>`${label}: ${turnText(deltas[index]!)}`).join("; ");
  return Object.freeze({
    observation:"Do not stop after identifying the correct pieces. Their exact orientation and final position must also be shown.",
    rule:"Keep every piece at the printed scale. Turn pieces only as required, move them into the shown final positions, and join along the dashed internal seam; do not mirror or resize anything.",
    application:`For option ${base.answer}, use this movement plan: ${turnPlan}. The middle panel shows the required orientations, and the last panel places those same pieces inside the target so the dashed seam shows exactly where they touch.`,
    check:`After the pieces meet along the dashed seam, that seam becomes internal and the remaining solid outside boundary is exactly the required figure. Therefore option ${base.answer} is correct.`,
    steps:Object.freeze([
      `Start with the correct pieces exactly as printed in option ${base.answer}.`,
      `Turn them as shown: ${turnPlan}.`,
      "Move the turned pieces into the positions shown in the third panel; do not change their size.",
      "Join along the dashed seam. The solid outside edge must match the target with no gap, overlap or reflection.",
    ]),
  });
}

export function generateFigureFormationReviewQuestionV5(input: Readonly<{ qlId: FigureFormationPermanentQlIdV10; seed: string; language?: FigureFormationLanguageV1 }>) {
  const base=generateFigureFormationReviewQuestionV4Final(input) as any; let illustration:string; let labels:string[]; let deltas:number[];
  if(input.qlId==="SPA-QL-051") {
    const template=ASSEMBLY_TEMPLATES[hash32(`${input.seed}:template`)%ASSEMBLY_TEMPLATES.length]!; const pieces=template.pieceShapes.map((shapeId,index)=>Object.freeze({id:String(index+1),shapeId})) as readonly GridPiece[]; const placements=findGridAssembly(pieces,template.target);
    const displayRotations=pieces.map((piece)=>{const variants=gridOrientations(GRID_SHAPES[piece.shapeId]);return variants[hash32(`${input.seed}:${piece.id}:rotation`)%variants.length]!.rotationDegrees;}); labels=pieces.map((piece)=>`Piece ${piece.id}`); ({svg:illustration,deltas}=renderGridProcess(pieces,placements,displayRotations,labels));
  } else {
    const generated=chooseAtomPool(input.seed); const pair=generated.correctPair; labels=input.qlId==="SPA-QL-052"?pair.map((index)=>`Piece ${index+1}`):["Left piece","Right piece"]; ({svg:illustration,deltas}=renderAtomProcess(generated.pool,pair,generated.solution,input.seed,input.qlId,base.correctIndex,labels,generated.target));
  }
  return Object.freeze({
    ...base,
    version:"SPA-FFM-001-REVIEW-QUESTION-V5" as const,
    explanation:base.language==="en"?EnglishExplanation(base,labels,deltas):base.explanation,
    explanationIllustrationSvg:illustration,
    renderer:Object.freeze({...base.renderer,reviewIllustratedExplanation:true as const,reviewAssemblyPathIllustration:true as const,reviewAssemblySeamVisible:true as const}),
    review:Object.freeze({...base.review,v4RejectedForMissingConnectionMethod:true as const,connectionMethodApprovalRequired:true as const,learnerContentFrozen:false as const,downstreamActivationAllowed:false as const}),
  });
}

export type FigureFormationReviewQuestionV5=ReturnType<typeof generateFigureFormationReviewQuestionV5>;
