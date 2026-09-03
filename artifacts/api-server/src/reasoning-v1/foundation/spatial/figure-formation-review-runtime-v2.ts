import {
  FIGURE_FORMATION_PERMANENT_QL_ALLOCATIONS_V10,
  type FigureFormationPermanentQlIdV10,
} from "./spatial-permanent-ql-allocation-v10";
import { FFM_001_SOURCE_SATURATION_AUTHORITY_V2 } from "./figure-formation-source-saturation-v2";

export type FigureFormationLanguageV2 = "en" | "hi" | "pa";
export type FigureFormationAnswerSurfaceV2 = "VISUAL_RESULT" | "LABELLED_SUBSET" | "VISUAL_PIECE_SET";
type Cell = readonly [number, number];
type ShapeId = "DOMINO" | "I3" | "L3" | "O4" | "I4" | "L4" | "T4" | "S4" | "Z4";
type CellPiece = Readonly<{ id: string; shapeId: ShapeId }>;
type CellPlacement = Readonly<{ pieceId: string; rotationDegrees: 0 | 90 | 180 | 270; cells: readonly Cell[] }>;
type Point = readonly [number, number];
type Atom = readonly [Point, Point, Point];
type AtomShape = readonly Atom[];
type AtomPiece = Readonly<{ id: string; shape: AtomShape }>;
type AtomPlacement = Readonly<{ pieceId: string; rotationDegrees: 0 | 90 | 180 | 270; atoms: AtomShape }>;
type PlacementFact = Readonly<{ pieceId: string; rotationDegrees: 0 | 90 | 180 | 270 }>;

const OPTION_LABELS = Object.freeze(["A", "B", "C", "D"] as const);
const STROKE = "#111827";
const STROKE_WIDTH = 1.35;

const CELL_SHAPES: Readonly<Record<ShapeId, readonly Cell[]>> = Object.freeze({
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

const EXTRA_TARGETS = Object.freeze([
  [[0,0],[0,1],[1,1],[1,2],[2,1],[3,1],[3,2],[4,1]],
  [[0,0],[1,0],[1,1],[1,2],[2,2],[3,2],[3,3],[4,2]],
  [[0,0],[0,1],[1,1],[1,2],[2,1],[2,2],[2,3],[3,2]],
  [[0,0],[1,0],[1,1],[1,2],[2,1],[3,1],[3,2],[4,2]],
  [[0,0],[0,1],[0,2],[0,3],[1,1],[1,2],[2,1],[2,2]],
  [[0,0],[0,2],[1,0],[1,1],[1,2],[1,3],[2,1],[2,2]],
] as const);

function hash32(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
function shortHash(value: string): string { return hash32(value).toString(16).padStart(8, "0"); }
function normalizeCells(cells: readonly Cell[]): Cell[] {
  const minX = Math.min(...cells.map(([x]) => x));
  const minY = Math.min(...cells.map(([, y]) => y));
  return cells.map(([x, y]) => [x - minX, y - minY] as const).sort(([ax, ay], [bx, by]) => ax - bx || ay - by);
}
function cellsKey(cells: readonly Cell[]): string { return normalizeCells(cells).map(([x, y]) => `${x},${y}`).join(";"); }
function rotateCells(cells: readonly Cell[]): Cell[] { return normalizeCells(cells.map(([x, y]) => [-y, x] as const)); }
function cellOrientations(cells: readonly Cell[]) {
  const out: Array<{ rotationDegrees: 0 | 90 | 180 | 270; cells: Cell[] }> = [];
  const seen = new Set<string>();
  let current = normalizeCells(cells);
  for (const rotationDegrees of [0, 90, 180, 270] as const) {
    const key = cellsKey(current);
    if (!seen.has(key)) { seen.add(key); out.push({ rotationDegrees, cells: current }); }
    current = rotateCells(current);
  }
  return out;
}
function rotationCanonicalKey(cells: readonly Cell[]): string { return cellOrientations(cells).map((entry) => cellsKey(entry.cells)).sort()[0]!; }
function cellPlacements(piece: CellPiece, target: readonly Cell[]): CellPlacement[] {
  const normalizedTarget = normalizeCells(target);
  const allowed = new Set(normalizedTarget.map(([x, y]) => `${x},${y}`));
  const maxX = Math.max(...normalizedTarget.map(([x]) => x));
  const maxY = Math.max(...normalizedTarget.map(([, y]) => y));
  const out: CellPlacement[] = [];
  for (const orientation of cellOrientations(CELL_SHAPES[piece.shapeId])) {
    const pieceMaxX = Math.max(...orientation.cells.map(([x]) => x));
    const pieceMaxY = Math.max(...orientation.cells.map(([, y]) => y));
    for (let dx = 0; dx <= maxX - pieceMaxX; dx += 1) for (let dy = 0; dy <= maxY - pieceMaxY; dy += 1) {
      const cells = orientation.cells.map(([x, y]) => [x + dx, y + dy] as const);
      if (cells.every(([x, y]) => allowed.has(`${x},${y}`))) out.push(Object.freeze({ pieceId: piece.id, rotationDegrees: orientation.rotationDegrees, cells: Object.freeze(cells) }));
    }
  }
  return out;
}
function findCellCover(pieces: readonly CellPiece[], target: readonly Cell[]): readonly CellPlacement[] | null {
  const normalizedTarget = normalizeCells(target);
  if (pieces.reduce((sum, piece) => sum + CELL_SHAPES[piece.shapeId].length, 0) !== normalizedTarget.length) return null;
  const groups = pieces.map((piece) => ({ piece, placements: cellPlacements(piece, normalizedTarget) })).sort((a, b) => a.placements.length - b.placements.length || a.piece.id.localeCompare(b.piece.id));
  function search(index: number, used: Set<string>, chosen: CellPlacement[]): CellPlacement[] | null {
    if (index === groups.length) return used.size === normalizedTarget.length ? chosen : null;
    for (const placement of groups[index]!.placements) {
      const keys = placement.cells.map(([x, y]) => `${x},${y}`);
      if (keys.some((key) => used.has(key))) continue;
      const next = new Set(used); keys.forEach((key) => next.add(key));
      const solved = search(index + 1, next, [...chosen, placement]);
      if (solved) return solved;
    }
    return null;
  }
  return groups.some((group) => group.placements.length === 0) ? null : search(0, new Set(), []);
}
function makeCellPieces(shapeIds: readonly ShapeId[]): CellPiece[] { return shapeIds.map((shapeId, index) => Object.freeze({ id: String(index + 1), shapeId })); }

function cellBoundarySegments(cells: readonly Cell[]) {
  const normalized = normalizeCells(cells);
  const occupied = new Set(normalized.map(([x, y]) => `${x},${y}`));
  const segments: Array<readonly [number, number, number, number]> = [];
  for (const [x, y] of normalized) {
    if (!occupied.has(`${x},${y - 1}`)) segments.push([x, y, x + 1, y]);
    if (!occupied.has(`${x + 1},${y}`)) segments.push([x + 1, y, x + 1, y + 1]);
    if (!occupied.has(`${x},${y + 1}`)) segments.push([x, y + 1, x + 1, y + 1]);
    if (!occupied.has(`${x - 1},${y}`)) segments.push([x, y, x, y + 1]);
  }
  return segments;
}
function renderCellShape(cells: readonly Cell[], label: string, width = 180, height = 132): string {
  const normalized = normalizeCells(cells);
  const maxX = Math.max(...normalized.map(([x]) => x)) + 1;
  const maxY = Math.max(...normalized.map(([, y]) => y)) + 1;
  const scale = Math.min(24, (width - 34) / maxX, (height - 40) / maxY);
  const ox = (width - maxX * scale) / 2;
  const oy = (height - maxY * scale) / 2 + 5;
  const lines = cellBoundarySegments(normalized).map(([x1, y1, x2, y2]) => `<line x1="${(ox+x1*scale).toFixed(2)}" y1="${(oy+y1*scale).toFixed(2)}" x2="${(ox+x2*scale).toFixed(2)}" y2="${(oy+y2*scale).toFixed(2)}"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${label}"><rect width="${width}" height="${height}" fill="white"/><g stroke="${STROKE}" stroke-width="${STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round" fill="none">${lines}</g></svg>`;
}
function renderCellPiecesRow(pieces: readonly CellPiece[], seed: string): string {
  const width = 330, height = 150, slot = width / pieces.length;
  const body: string[] = [];
  pieces.forEach((piece, index) => {
    const variants = cellOrientations(CELL_SHAPES[piece.shapeId]);
    const cells = variants[hash32(`${seed}:${piece.id}:rotation`) % variants.length]!.cells;
    const maxX = Math.max(...cells.map(([x]) => x)) + 1;
    const maxY = Math.max(...cells.map(([, y]) => y)) + 1;
    const scale = Math.min(20, (slot - 24) / maxX, 78 / maxY);
    const ox = index * slot + (slot - maxX * scale) / 2;
    const oy = 26 + (78 - maxY * scale) / 2;
    body.push(...cellBoundarySegments(cells).map(([x1,y1,x2,y2]) => `<line x1="${(ox+x1*scale).toFixed(2)}" y1="${(oy+y1*scale).toFixed(2)}" x2="${(ox+x2*scale).toFixed(2)}" y2="${(oy+y2*scale).toFixed(2)}"/>`));
    body.push(`<text x="${(index*slot+slot/2).toFixed(2)}" y="128" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="${STROKE}">${piece.id}</text>`);
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="Given pieces"><rect width="${width}" height="${height}" fill="white"/><g stroke="${STROKE}" stroke-width="${STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round" fill="none">${body.filter((x)=>x.startsWith("<line")).join("")}</g>${body.filter((x)=>x.startsWith("<text")).join("")}</svg>`;
}

function pointKey([x, y]: Point): string { return `${x},${y}`; }
function atomKey(atom: Atom): string { return [...atom].map(pointKey).sort().join(";"); }
function sortAtom(points: readonly Point[]): Atom { return [...points].sort(([ax, ay], [bx, by]) => ax - bx || ay - by) as unknown as Atom; }
function normalizeAtoms(shape: AtomShape): Atom[] {
  const points = shape.flatMap((atom) => [...atom]);
  const minX = Math.min(...points.map(([x]) => x));
  const minY = Math.min(...points.map(([, y]) => y));
  return shape.map((atom) => sortAtom(atom.map(([x, y]) => [x - minX, y - minY] as const))).sort((a, b) => atomKey(a).localeCompare(atomKey(b)));
}
function atomShapeKey(shape: AtomShape): string { return normalizeAtoms(shape).map(atomKey).join("/"); }
function rotateAtoms90(shape: AtomShape): Atom[] { return normalizeAtoms(shape.map((atom) => sortAtom(atom.map(([x, y]) => [-y, x] as const)))); }
function atomOrientations(shape: AtomShape) {
  const out: Array<{ rotationDegrees: 0 | 90 | 180 | 270; shape: AtomShape }> = [];
  const seen = new Set<string>();
  let current = normalizeAtoms(shape);
  for (const rotationDegrees of [0, 90, 180, 270] as const) {
    const key = atomShapeKey(current);
    if (!seen.has(key)) { seen.add(key); out.push({ rotationDegrees, shape: current }); }
    current = rotateAtoms90(current);
  }
  return out;
}
function atomBounds(shape: AtomShape) {
  const points = shape.flatMap((atom) => [...atom]);
  return { minX: Math.min(...points.map(([x]) => x)), maxX: Math.max(...points.map(([x]) => x)), minY: Math.min(...points.map(([, y]) => y)), maxY: Math.max(...points.map(([, y]) => y)) };
}
function translateAtoms(shape: AtomShape, dx: number, dy: number): Atom[] { return shape.map((atom) => sortAtom(atom.map(([x, y]) => [x + dx, y + dy] as const))); }
function atomPlacements(piece: AtomPiece, target: AtomShape): AtomPlacement[] {
  const normalizedTarget = normalizeAtoms(target);
  const allowed = new Set(normalizedTarget.map(atomKey));
  const bounds = atomBounds(normalizedTarget);
  const out: AtomPlacement[] = [];
  for (const orientation of atomOrientations(piece.shape)) {
    const pb = atomBounds(orientation.shape);
    for (let dx = 0; dx <= bounds.maxX - pb.maxX; dx += 1) for (let dy = 0; dy <= bounds.maxY - pb.maxY; dy += 1) {
      const atoms = translateAtoms(orientation.shape, dx, dy);
      if (atoms.every((atom) => allowed.has(atomKey(atom)))) out.push(Object.freeze({ pieceId: piece.id, rotationDegrees: orientation.rotationDegrees, atoms: Object.freeze(atoms) }));
    }
  }
  return out;
}
function findAtomCover(pieces: readonly AtomPiece[], target: AtomShape): readonly AtomPlacement[] | null {
  const normalizedTarget = normalizeAtoms(target);
  if (pieces.reduce((sum, piece) => sum + piece.shape.length, 0) !== normalizedTarget.length) return null;
  const groups = pieces.map((piece) => ({ piece, placements: atomPlacements(piece, normalizedTarget) })).sort((a,b)=>a.placements.length-b.placements.length || a.piece.id.localeCompare(b.piece.id));
  if (groups.some((group) => group.placements.length === 0)) return null;
  function search(index: number, used: Set<string>, chosen: AtomPlacement[]): AtomPlacement[] | null {
    if (index === groups.length) return used.size === normalizedTarget.length ? chosen : null;
    for (const placement of groups[index]!.placements) {
      const keys = placement.atoms.map(atomKey);
      if (keys.some((key) => used.has(key))) continue;
      const next = new Set(used); keys.forEach((key) => next.add(key));
      const solved = search(index + 1, next, [...chosen, placement]);
      if (solved) return solved;
    }
    return null;
  }
  return search(0, new Set(), []);
}
function atomA(x: number, y: number): Atom { return sortAtom([[x, y], [x + 1, y], [x, y + 1]]); }
function atomB(x: number, y: number): Atom { return sortAtom([[x + 1, y], [x, y + 1], [x + 1, y + 1]]); }
function squareTarget(size: number): Atom[] { const out: Atom[] = []; for (let x=0;x<size;x+=1) for (let y=0;y<size;y+=1) out.push(atomA(x,y),atomB(x,y)); return normalizeAtoms(out); }
function rightTriangleTarget(size: number): Atom[] { const out: Atom[] = []; for (let x=0;x<size;x+=1) for (let y=0;y<size;y+=1) for (const atom of [atomA(x,y),atomB(x,y)]) if (atom.every(([px,py])=>px+py<=size)) out.push(atom); return normalizeAtoms(out); }
function polyominoAtoms(cells: readonly Cell[]): Atom[] { return normalizeAtoms(cells.flatMap(([x,y])=>[atomA(x,y),atomB(x,y)])); }
function atomComplement(target: AtomShape, part: AtomShape): Atom[] { const owned = new Set(normalizeAtoms(part).map(atomKey)); return normalizeAtoms(target).filter((atom)=>!owned.has(atomKey(atom))); }

const POLY4 = Object.freeze([
  [[0,0],[1,0],[2,0],[3,0]], [[0,0],[0,1],[0,2],[1,2]], [[0,0],[1,0],[2,0],[1,1]],
  [[1,0],[2,0],[0,1],[1,1]], [[0,0],[1,0],[1,1],[2,1]], [[0,0],[1,0],[0,1],[1,1]], [[0,0],[0,1],[1,1],[2,1]],
] as const);
const POLY8 = Object.freeze([
  [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]], [[0,0],[1,0],[2,0],[3,0],[0,1],[1,1],[2,1],[3,1]],
  [[0,0],[0,1],[0,2],[0,3],[0,4],[1,4],[2,4],[3,4]], [[0,0],[1,0],[2,0],[3,0],[4,0],[2,1],[2,2],[2,3]],
  [[0,0],[1,0],[1,1],[2,1],[2,2],[3,2],[3,3],[4,3]], [[0,0],[0,1],[1,1],[1,2],[2,2],[2,3],[3,3],[3,4]],
] as const);

function targetConstructionTemplate(seed: string) {
  if (hash32(`${seed}:target-kind`) % 2 === 0) {
    const target = squareTarget(4); const first = rightTriangleTarget(4);
    return { kind: "SQUARE" as const, target, correctShapes: [first, atomComplement(target, first)] as const, decoys: POLY8.map(polyominoAtoms) };
  }
  const target = rightTriangleTarget(4);
  const splits = [[0,1,2,3,4,5,6,7],[0,1,2,3,4,5,6,9],[0,1,2,3,4,5,6,11]] as const;
  const first = normalizeAtoms(splits[hash32(`${seed}:triangle-split`) % splits.length]!.map((index)=>target[index]!));
  return { kind: "TRIANGLE" as const, target, correctShapes: [first, atomComplement(target, first)] as const, decoys: POLY4.map(polyominoAtoms) };
}
function buildUniqueConstructionPool(seed: string) {
  const template = targetConstructionTemplate(seed);
  const correct: AtomPiece[] = [Object.freeze({ id: "C1", shape: template.correctShapes[0] }), Object.freeze({ id: "C2", shape: template.correctShapes[1] })];
  const candidates = template.decoys.map((shape,index)=>Object.freeze({ id:`D${index+1}`, shape }));
  const triples: Array<readonly [number,number,number]> = [];
  for (let a=0;a<candidates.length;a+=1) for (let b=a+1;b<candidates.length;b+=1) for (let c=b+1;c<candidates.length;c+=1) triples.push([a,b,c]);
  triples.sort((a,b)=>hash32(`${seed}:triple:${a.join("-")}`)-hash32(`${seed}:triple:${b.join("-")}`));
  let selected: AtomPiece[] | null = null;
  for (const triple of triples) {
    const pool = [...correct, ...triple.map((index)=>candidates[index]!)];
    const solvable: Array<readonly [number,number]> = [];
    for (let left=0;left<pool.length;left+=1) for (let right=left+1;right<pool.length;right+=1) {
      const pair = [Object.freeze({ id:String(left+1), shape:pool[left]!.shape }), Object.freeze({ id:String(right+1), shape:pool[right]!.shape })];
      if (findAtomCover(pair, template.target)) solvable.push([left,right]);
    }
    if (solvable.length===1 && solvable[0]![0]===0 && solvable[0]![1]===1) { selected=pool; break; }
  }
  if (!selected) throw new Error("FFM QL052 could not build a unique target-construction pool.");
  const decorated = selected.map((piece,index)=>({piece,role:index<2?`CORRECT_${index}`:"DECOY",score:hash32(`${seed}:pool:${index}:${atomShapeKey(piece.shape)}`)})).sort((a,b)=>a.score-b.score || a.role.localeCompare(b.role));
  const pool = decorated.map((entry,index)=>Object.freeze({ id:String(index+1), shape:entry.piece.shape }));
  const correctIndexes = decorated.map((entry,index)=>entry.role.startsWith("CORRECT_")?index:-1).filter((index)=>index>=0).sort((a,b)=>a-b) as [number,number];
  const correctPieces = correctIndexes.map((index)=>Object.freeze({ id:String(index+1), shape:pool[index]!.shape }));
  const solution = findAtomCover(correctPieces, template.target);
  if (!solution) throw new Error("FFM QL052 correct pair lost its exact-cover solution.");
  const wrongPairs: Array<[number,number]> = [];
  for (let left=0;left<pool.length;left+=1) for (let right=left+1;right<pool.length;right+=1) {
    if (left===correctIndexes[0] && right===correctIndexes[1]) continue;
    const pair=[Object.freeze({id:String(left+1),shape:pool[left]!.shape}),Object.freeze({id:String(right+1),shape:pool[right]!.shape})];
    if (!findAtomCover(pair,template.target)) wrongPairs.push([left,right]);
  }
  wrongPairs.sort((a,b)=>hash32(`${seed}:wrong:${a.join("-")}`)-hash32(`${seed}:wrong:${b.join("-")}`));
  const options=[{pair:correctIndexes,correct:true},...wrongPairs.slice(0,3).map((pair)=>({pair,correct:false}))]
    .map((entry,index)=>({...entry,score:hash32(`${seed}:option:${index}:${entry.pair.join("-")}`)})).sort((a,b)=>a.score-b.score || a.pair[0]-b.pair[0]);
  const correctIndex=options.findIndex((entry)=>entry.correct);
  return { ...template, pool, solution, options, correctIndex, correctIndexes };
}

function atomBoundaryEdges(shape: AtomShape) {
  const counts = new Map<string,{count:number;a:Point;b:Point}>();
  for (const atom of normalizeAtoms(shape)) for (const [a,b] of [[atom[0],atom[1]],[atom[1],atom[2]],[atom[0],atom[2]]] as const) {
    const key=[pointKey(a),pointKey(b)].sort().join("|"); const current=counts.get(key);
    if (current) current.count+=1; else counts.set(key,{count:1,a,b});
  }
  return [...counts.values()].filter((entry)=>entry.count===1);
}
function atomShapeLines(shape: AtomShape, x:number, y:number, width:number, height:number, seed:string) {
  const variants=atomOrientations(shape); const current=variants[hash32(seed)%variants.length]!.shape; const b=atomBounds(current);
  const w=Math.max(1,b.maxX-b.minX), h=Math.max(1,b.maxY-b.minY); const scale=Math.min((width-18)/w,(height-18)/h);
  const ox=x+(width-w*scale)/2-b.minX*scale, oy=y+(height-h*scale)/2-b.minY*scale;
  return atomBoundaryEdges(current).map(({a,b})=>`<line x1="${(ox+a[0]*scale).toFixed(2)}" y1="${(oy+a[1]*scale).toFixed(2)}" x2="${(ox+b[0]*scale).toFixed(2)}" y2="${(oy+b[1]*scale).toFixed(2)}"/>`).join("");
}
function renderAtomShape(shape: AtomShape, label:string, seed:string, width=190, height=145): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${label}"><rect width="${width}" height="${height}" fill="white"/><g stroke="${STROKE}" stroke-width="${STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round" fill="none">${atomShapeLines(shape,12,12,width-24,height-24,seed)}</g></svg>`;
}
function renderAtomPool(pool: readonly AtomPiece[], seed:string): string {
  const width=390,height=150,slot=width/pool.length; const lines:string[]=[]; const labels:string[]=[];
  pool.forEach((piece,index)=>{ lines.push(atomShapeLines(piece.shape,index*slot+6,18,slot-12,88,`${seed}:piece:${piece.id}`)); labels.push(`<text x="${(index*slot+slot/2).toFixed(2)}" y="132" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="${STROKE}">${piece.id}</text>`); });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="Numbered pieces"><rect width="${width}" height="${height}" fill="white"/><g stroke="${STROKE}" stroke-width="${STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round" fill="none">${lines.join("")}</g>${labels.join("")}</svg>`;
}
function renderPairLabel(pair: readonly [number,number]): string {
  const width=170,height=86; return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="Pieces ${pair[0]+1} and ${pair[1]+1}"><rect width="${width}" height="${height}" fill="white"/><text x="85" y="50" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="${STROKE}">${pair[0]+1} and ${pair[1]+1}</text></svg>`;
}
function renderVisualPair(pool: readonly AtomPiece[], pair: readonly [number,number], seed:string): string {
  const width=190,height=118; const left=pool[pair[0]]!,right=pool[pair[1]]!;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="Candidate piece set"><rect width="${width}" height="${height}" fill="white"/><g stroke="${STROKE}" stroke-width="${STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round" fill="none">${atomShapeLines(left.shape,8,12,80,90,`${seed}:a`)}${atomShapeLines(right.shape,102,12,80,90,`${seed}:b`)}</g></svg>`;
}

function allocationFor(qlId: FigureFormationPermanentQlIdV10) {
  const allocation=FIGURE_FORMATION_PERMANENT_QL_ALLOCATIONS_V10.find((entry)=>entry.permanentQlId===qlId);
  if (!allocation) throw new Error(`Unknown FFM-001 QL ${qlId}.`); return allocation;
}
function stem(language:FigureFormationLanguageV2, qlId:FigureFormationPermanentQlIdV10, surface:FigureFormationAnswerSurfaceV2, targetKind?:"SQUARE"|"TRIANGLE", seed="") {
  const variant=hash32(`${seed}:stem`)%3;
  if (qlId==="SPA-QL-051") {
    const en=["Which answer figure can be formed by joining all the given pieces?","Choose the figure that can be made using every given piece exactly once.","The given pieces are joined without overlapping. Which option can be formed?"];
    const hi=["सभी दी गई आकृतियों को जोड़ने पर कौन-सी उत्तर आकृति बन सकती है?","हर दिए गए टुकड़े का ठीक एक बार उपयोग करके बनने वाली आकृति चुनिए।","दिए गए टुकड़ों को बिना एक-दूसरे पर चढ़ाए जोड़ें। कौन-सा विकल्प बन सकता है?"];
    const pa=["ਸਾਰੇ ਦਿੱਤੇ ਟੁਕੜਿਆਂ ਨੂੰ ਜੋੜ ਕੇ ਕਿਹੜੀ ਉੱਤਰ ਆਕ੍ਰਿਤੀ ਬਣ ਸਕਦੀ ਹੈ?","ਹਰ ਦਿੱਤੇ ਟੁਕੜੇ ਨੂੰ ਠੀਕ ਇੱਕ ਵਾਰ ਵਰਤ ਕੇ ਬਣਨ ਵਾਲੀ ਆਕ੍ਰਿਤੀ ਚੁਣੋ।","ਦਿੱਤੇ ਟੁਕੜਿਆਂ ਨੂੰ ਬਿਨਾਂ ਇਕ-ਦੂਜੇ ਉੱਤੇ ਚੜ੍ਹਾਏ ਜੋੜੋ। ਕਿਹੜਾ ਵਿਕਲਪ ਬਣ ਸਕਦਾ ਹੈ?"];
    return (language==="hi"?hi:language==="pa"?pa:en)[variant]!;
  }
  const targetEn=targetKind==="TRIANGLE"?"triangle":"square"; const targetHi=targetKind==="TRIANGLE"?"त्रिभुज":"वर्ग"; const targetPa=targetKind==="TRIANGLE"?"ਤਿਕੋਣ":"ਵਰਗ";
  if (surface==="VISUAL_PIECE_SET") return language==="hi"?`कौन-सा टुकड़ा-समूह दिए गए ${targetHi} को बना सकता है?`:language==="pa"?`ਕਿਹੜਾ ਟੁਕੜਾ-ਸਮੂਹ ਦਿੱਤਾ ${targetPa} ਬਣਾ ਸਕਦਾ ਹੈ?`:`Which set of pieces can form the given ${targetEn}?`;
  return language==="hi"?`कौन-से दो क्रमांकित टुकड़े मिलकर दिए गए ${targetHi} को बना सकते हैं?`:language==="pa"?`ਕਿਹੜੇ ਦੋ ਨੰਬਰ ਵਾਲੇ ਟੁਕੜੇ ਮਿਲ ਕੇ ਦਿੱਤਾ ${targetPa} ਬਣਾ ਸਕਦੇ ਹਨ?`:`Which two numbered pieces can be joined to form the given ${targetEn}?`;
}
function explanation(language:FigureFormationLanguageV2, qlId:FigureFormationPermanentQlIdV10, answer:string, pieceNumbers:readonly number[], placements:readonly PlacementFact[], targetKind?:"SQUARE"|"TRIANGLE") {
  const rotationText=placements.map((placement)=>`${placement.pieceId}:${placement.rotationDegrees}°`).join(", ");
  if (language==="hi") {
    if (qlId==="SPA-QL-051") return Object.freeze({ rule:"हर टुकड़े का ठीक एक बार उपयोग होना चाहिए; घुमाना मान्य है, प्रतिबिंब नहीं।", working:`सही जोड़ में टुकड़ों के घुमाव ${rotationText} हैं। इससे लक्ष्य पूरा भरता है और न खाली जगह बचती है, न ओवरलैप होता है।`, answer:`इसलिए सही उत्तर ${answer} है।` });
    return Object.freeze({ rule:"चुने गए दोनों टुकड़ों को घुमाया जा सकता है, पर पलटा नहीं जा सकता; उन्हें लक्ष्य को पूरी तरह भरना चाहिए।", working:`टुकड़े ${pieceNumbers.join(" और ")} को ${targetKind==="TRIANGLE"?"त्रिभुज":"वर्ग"} में रखने पर घुमाव ${rotationText} मिलते हैं और लक्ष्य बिना खाली जगह/ओवरलैप पूरा भरता है।`, answer:`इसलिए सही उत्तर ${answer} है।` });
  }
  if (language==="pa") {
    if (qlId==="SPA-QL-051") return Object.freeze({ rule:"ਹਰ ਟੁਕੜਾ ਠੀਕ ਇੱਕ ਵਾਰ ਵਰਤਣਾ ਹੈ; ਘੁਮਾਉਣਾ ਮਨਜ਼ੂਰ ਹੈ, ਪਰ ਪਰਛਾਵਾਂ ਨਹੀਂ।", working:`ਸਹੀ ਜੋੜ ਵਿੱਚ ਟੁਕੜਿਆਂ ਦੇ ਘੁੰਮਾਅ ${rotationText} ਹਨ। ਇਸ ਨਾਲ ਲਕਸ਼ ਪੂਰਾ ਭਰਦਾ ਹੈ ਅਤੇ ਨਾ ਖਾਲੀ ਥਾਂ ਰਹਿੰਦੀ ਹੈ, ਨਾ ਓਵਰਲੈਪ।`, answer:`ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।` });
    return Object.freeze({ rule:"ਚੁਣੇ ਦੋਵੇਂ ਟੁਕੜੇ ਘੁਮਾਏ ਜਾ ਸਕਦੇ ਹਨ ਪਰ ਪਲਟੇ ਨਹੀਂ; ਉਹ ਲਕਸ਼ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਰਨੇ ਚਾਹੀਦੇ ਹਨ।", working:`ਟੁਕੜੇ ${pieceNumbers.join(" ਅਤੇ ")} ਨੂੰ ${targetKind==="TRIANGLE"?"ਤਿਕੋਣ":"ਵਰਗ"} ਵਿੱਚ ਰੱਖਣ ਤੇ ਘੁੰਮਾਅ ${rotationText} ਮਿਲਦੇ ਹਨ ਅਤੇ ਲਕਸ਼ ਬਿਨਾਂ ਖਾਲੀ ਥਾਂ/ਓਵਰਲੈਪ ਪੂਰਾ ਭਰਦਾ ਹੈ।`, answer:`ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।` });
  }
  if (qlId==="SPA-QL-051") return Object.freeze({ rule:"Use every piece exactly once. Rotation is allowed, but reflection is not.", working:`In the valid assembly the piece rotations are ${rotationText}. Together they cover the target exactly, with no gap or overlap.`, answer:`Therefore, option ${answer} is correct.` });
  return Object.freeze({ rule:"The selected pieces may be rotated but not reflected; together they must cover the target exactly.", working:`Pieces ${pieceNumbers.join(" and ")} fit the ${targetKind?.toLowerCase()} with rotations ${rotationText}. They cover it completely with no gap or overlap.`, answer:`Therefore, option ${answer} is correct.` });
}
function reviewLifecycle() { return Object.freeze({ reviewOnly:true as const, learnerContentFrozen:false as const, questionStudioDiscoverable:false as const, persistenceAllowed:false as const, questionBankWritable:false as const, testEligible:false as const, mockTestEligible:false as const, publiclyPublishable:false as const, studentDeliveryAuthorized:false as const, automaticStudentPublication:false as const }); }
function buildQuestion(input: Readonly<{ qlId:FigureFormationPermanentQlIdV10; language:FigureFormationLanguageV2; seed:string; surface:FigureFormationAnswerSurfaceV2; stimulusSvgs:readonly string[]; optionSvgs:readonly string[]; correctIndex:number; geometryDescriptor:string; placements:readonly PlacementFact[]; pieceNumbers:readonly number[]; targetKind?:"SQUARE"|"TRIANGLE"; difficultyBand:"FOUNDATIONAL"|"MODERATE"|"ADVANCED" }>) {
  const allocation=allocationFor(input.qlId); const answer=OPTION_LABELS[input.correctIndex]!; const geometryFingerprint=shortHash(input.geometryDescriptor); const contentFingerprint=shortHash(`${input.qlId}:${geometryFingerprint}:${input.optionSvgs.map(shortHash).join(":")}:${input.correctIndex}`); const canonicalItemId=`${input.qlId}:${geometryFingerprint}:${contentFingerprint}`;
  return Object.freeze({
    version:"SPA-FFM-001-REVIEW-RUNTIME-V2" as const, packageId:"SPA-001-FFM-001-REVIEW" as const, qlId:input.qlId, proposalId:allocation.proposalId, chapterCode:"FFM-001" as const, qlName:allocation.name, language:input.language, locale:input.language==="hi"?"hi-IN" as const:input.language==="pa"?"pa-IN" as const:"en-IN" as const, difficultyBand:input.difficultyBand, seed:input.seed, generationSeed:input.seed, mode:allocation.skillMode, answerSurface:input.surface, targetKind:input.targetKind ?? null, stem:stem(input.language,input.qlId,input.surface,input.targetKind,input.seed), stimulusSvgs:Object.freeze([...input.stimulusSvgs]), optionSvgs:Object.freeze([...input.optionSvgs]), optionLabels:OPTION_LABELS, correctIndex:input.correctIndex as 0|1|2|3, answer, explanation:explanation(input.language,input.qlId,answer,input.pieceNumbers,input.placements,input.targetKind), canonicalItemId, questionLanguageId:`${canonicalItemId}:${input.language}`, contentFingerprint, geometryFingerprint, renderer:Object.freeze({ kind:"SVG" as const, background:"WHITE" as const, stroke:STROKE, strokeWidth:STROKE_WIDTH, recommendedStimulusPixels:320, recommendedOptionPixels:180 }), validation:Object.freeze({ exactCoverSolverBacked:true as const, everyRequiredPieceUsedExactlyOnce:true as const, rotationAllowed:true as const, reflectionAllowed:false as const, noGapNoOverlap:true as const, uniqueAnswer:true as const, svgSanitizedByConstruction:true as const, learnerExplanationSafe:true as const }), lifecycle:reviewLifecycle(), sourceAuthorityId:FFM_001_SOURCE_SATURATION_AUTHORITY_V2.authorityId, solveFacts:Object.freeze({ placements:Object.freeze(input.placements), reflectionUsed:false as const, overlapCount:0 as const, uncoveredTargetUnits:0 as const })
  });
}

function generateQl051(seed:string,language:FigureFormationLanguageV2) {
  const template=ASSEMBLY_TEMPLATES[hash32(`${seed}:template`)%ASSEMBLY_TEMPLATES.length]!; const pieces=makeCellPieces(template.pieceShapes); const target=normalizeCells(template.target); const solution=findCellCover(pieces,target); if(!solution) throw new Error("SPA-QL-051 template lost exact-cover solution.");
  const catalog=[...ASSEMBLY_TEMPLATES.map((entry)=>normalizeCells(entry.target)),...EXTRA_TARGETS.map((entry)=>normalizeCells(entry))]; const unique=new Map<string,Cell[]>(); catalog.forEach((candidate)=>unique.set(rotationCanonicalKey(candidate),candidate));
  const distractors=[...unique.values()].filter((candidate)=>rotationCanonicalKey(candidate)!==rotationCanonicalKey(target)).filter((candidate)=>findCellCover(pieces,candidate)===null).sort((a,b)=>hash32(`${seed}:${cellsKey(a)}`)-hash32(`${seed}:${cellsKey(b)}`)).slice(0,3); if(distractors.length!==3) throw new Error("SPA-QL-051 needs three solver-rejected distractors.");
  const ordered=[target,...distractors].map((cells,rawIndex)=>({cells,rawIndex,score:hash32(`${seed}:option:${cellsKey(cells)}`)})).sort((a,b)=>a.score-b.score || cellsKey(a.cells).localeCompare(cellsKey(b.cells))); const correctIndex=ordered.findIndex((entry)=>entry.rawIndex===0); if(correctIndex<0) throw new Error("SPA-QL-051 lost correct option.");
  return buildQuestion({ qlId:"SPA-QL-051",language,seed,surface:"VISUAL_RESULT",stimulusSvgs:[renderCellPiecesRow(pieces,seed)],optionSvgs:ordered.map((entry,index)=>renderCellShape(entry.cells,`Option ${OPTION_LABELS[index]}`)),correctIndex,geometryDescriptor:`QL051:${pieces.map((piece)=>piece.shapeId).join("+")}:${cellsKey(target)}:${ordered.map((entry)=>cellsKey(entry.cells)).join("|")}`,placements:solution.map((placement)=>({pieceId:placement.pieceId,rotationDegrees:placement.rotationDegrees})),pieceNumbers:pieces.map((_,index)=>index+1),difficultyBand:pieces.length===3?"ADVANCED":"MODERATE" });
}
function generateQl052(seed:string,language:FigureFormationLanguageV2) {
  const result=buildUniqueConstructionPool(seed); const surface:FigureFormationAnswerSurfaceV2=hash32(`${seed}:surface`)%2===0?"LABELLED_SUBSET":"VISUAL_PIECE_SET"; const optionSvgs=surface==="LABELLED_SUBSET"?result.options.map((entry)=>renderPairLabel(entry.pair)):result.options.map((entry,index)=>renderVisualPair(result.pool,entry.pair,`${seed}:option:${index}`));
  return buildQuestion({ qlId:"SPA-QL-052",language,seed,surface,stimulusSvgs:surface==="LABELLED_SUBSET"?[renderAtomShape(result.target,`${result.kind} target`,`${seed}:target`,230,165),renderAtomPool(result.pool,seed)]:[renderAtomShape(result.target,`${result.kind} target`,`${seed}:target`,250,175)],optionSvgs,correctIndex:result.correctIndex,geometryDescriptor:`QL052:${result.kind}:${atomShapeKey(result.target)}:${surface}:${result.options.map((entry)=>entry.pair.join("-")).join("|")}`,placements:result.solution.map((placement)=>({pieceId:placement.pieceId,rotationDegrees:placement.rotationDegrees})),pieceNumbers:result.correctIndexes.map((index)=>index+1),targetKind:result.kind,difficultyBand:result.kind==="TRIANGLE"?"ADVANCED":"MODERATE" });
}

export function generateFigureFormationReviewQuestionV2(input: Readonly<{ qlId:FigureFormationPermanentQlIdV10; seed:string; language?:FigureFormationLanguageV2 }>) {
  const seed=String(input.seed??"").trim(); if(!seed) throw new Error("FFM-001 review generation requires an explicit seed."); const language=input.language??"en"; if(!(["en","hi","pa"] as const).includes(language)) throw new Error(`Unsupported FFM language '${language}'.`);
  return input.qlId==="SPA-QL-051"?generateQl051(seed,language):generateQl052(seed,language);
}

export type FigureFormationReviewQuestionV2 = ReturnType<typeof generateFigureFormationReviewQuestionV2>;
