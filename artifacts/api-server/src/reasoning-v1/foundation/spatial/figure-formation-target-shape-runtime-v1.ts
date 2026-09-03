import { generateFigureFormationQuestionStudioV1, type FigureFormationLanguageV1 } from "./figure-formation-question-studio-v1";
import type { FigureFormationPermanentQlIdV10 } from "./spatial-permanent-ql-allocation-v10";

type Point = readonly [number, number];
type Atom = readonly [Point, Point, Point];
type AtomShape = readonly Atom[];
type Piece = Readonly<{ id: string; shape: AtomShape }>;
type Placement = Readonly<{ pieceId: string; rotationDegrees: 0 | 90 | 180 | 270; atoms: AtomShape }>;

const LABELS = ["A", "B", "C", "D"] as const;

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
function edgeKey(a: Point, b: Point): string { return [pointKey(a), pointKey(b)].sort().join("|"); }
function atomKey(atom: Atom): string { return [...atom].map(pointKey).sort().join(";"); }
function sortAtom(atom: readonly Point[]): Atom {
  return [...atom].sort(([ax, ay], [bx, by]) => ax - bx || ay - by) as unknown as Atom;
}
function normalize(shape: AtomShape): Atom[] {
  const points = shape.flatMap((atom) => [...atom]);
  const minX = Math.min(...points.map(([x]) => x));
  const minY = Math.min(...points.map(([, y]) => y));
  return shape
    .map((atom) => sortAtom(atom.map(([x, y]) => [x - minX, y - minY] as const)))
    .sort((a, b) => atomKey(a).localeCompare(atomKey(b)));
}
function shapeKey(shape: AtomShape): string { return normalize(shape).map(atomKey).join("/"); }
function rotate90(shape: AtomShape): Atom[] {
  return normalize(shape.map((atom) => sortAtom(atom.map(([x, y]) => [-y, x] as const))));
}
function orientations(shape: AtomShape): ReadonlyArray<Readonly<{ rotationDegrees: 0 | 90 | 180 | 270; shape: AtomShape }>> {
  const result: Array<{ rotationDegrees: 0 | 90 | 180 | 270; shape: AtomShape }> = [];
  const seen = new Set<string>();
  let current = normalize(shape);
  for (const rotationDegrees of [0, 90, 180, 270] as const) {
    const key = shapeKey(current);
    if (!seen.has(key)) { seen.add(key); result.push({ rotationDegrees, shape: current }); }
    current = rotate90(current);
  }
  return result;
}
function translate(shape: AtomShape, dx: number, dy: number): Atom[] {
  return shape.map((atom) => sortAtom(atom.map(([x, y]) => [x + dx, y + dy] as const)));
}
function bounds(shape: AtomShape) {
  const points = shape.flatMap((atom) => [...atom]);
  return {
    minX: Math.min(...points.map(([x]) => x)), maxX: Math.max(...points.map(([x]) => x)),
    minY: Math.min(...points.map(([, y]) => y)), maxY: Math.max(...points.map(([, y]) => y)),
  };
}
function placementsFor(piece: Piece, target: AtomShape): Placement[] {
  const normalizedTarget = normalize(target);
  const targetKeys = new Set(normalizedTarget.map(atomKey));
  const targetBounds = bounds(normalizedTarget);
  const result: Placement[] = [];
  const seen = new Set<string>();
  for (const orientation of orientations(piece.shape)) {
    const b = bounds(orientation.shape);
    for (let dx = 0; dx <= targetBounds.maxX - b.maxX; dx += 1) {
      for (let dy = 0; dy <= targetBounds.maxY - b.maxY; dy += 1) {
        const atoms = translate(orientation.shape, dx, dy);
        if (!atoms.every((atom) => targetKeys.has(atomKey(atom)))) continue;
        const key = atoms.map(atomKey).sort().join("/");
        if (seen.has(key)) continue;
        seen.add(key);
        result.push(Object.freeze({ pieceId: piece.id, rotationDegrees: orientation.rotationDegrees, atoms: Object.freeze(atoms) }));
      }
    }
  }
  return result;
}
function findExactCover(pieces: readonly Piece[], target: AtomShape): readonly Placement[] | null {
  const normalizedTarget = normalize(target);
  if (pieces.reduce((sum, piece) => sum + piece.shape.length, 0) !== normalizedTarget.length) return null;
  const required = new Set(normalizedTarget.map(atomKey));
  const groups = pieces.map((piece) => ({ piece, placements: placementsFor(piece, normalizedTarget) }));
  if (groups.some((group) => group.placements.length === 0)) return null;
  groups.sort((a, b) => a.placements.length - b.placements.length || a.piece.id.localeCompare(b.piece.id));
  function search(index: number, used: Set<string>, chosen: Placement[]): Placement[] | null {
    if (index === groups.length) return used.size === required.size ? chosen : null;
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
function squareTarget(size: number): Atom[] {
  const atoms: Atom[] = [];
  for (let x = 0; x < size; x += 1) for (let y = 0; y < size; y += 1) atoms.push(atomA(x, y), atomB(x, y));
  return normalize(atoms);
}
function rectangleTarget(width: number, height: number): Atom[] {
  const atoms: Atom[] = [];
  for (let x = 0; x < width; x += 1) for (let y = 0; y < height; y += 1) atoms.push(atomA(x, y), atomB(x, y));
  return normalize(atoms);
}
function rightTriangleTarget(size: number): Atom[] {
  const atoms: Atom[] = [];
  for (let x = 0; x < size; x += 1) {
    for (let y = 0; y < size; y += 1) {
      for (const atom of [atomA(x, y), atomB(x, y)]) {
        if (atom.every(([px, py]) => px + py <= size)) atoms.push(atom);
      }
    }
  }
  return normalize(atoms);
}
function polyominoTarget(cells: readonly (readonly [number, number])[]): Atom[] {
  return normalize(cells.flatMap(([x, y]) => [atomA(x, y), atomB(x, y)]));
}
function complement(target: AtomShape, part: AtomShape): Atom[] {
  const owned = new Set(normalize(part).map(atomKey));
  return normalize(target).filter((atom) => !owned.has(atomKey(atom)));
}

const POLY4 = Object.freeze([
  [[0,0],[1,0],[2,0],[3,0]],
  [[0,0],[0,1],[0,2],[1,2]],
  [[0,0],[1,0],[2,0],[1,1]],
  [[1,0],[2,0],[0,1],[1,1]],
  [[0,0],[1,0],[1,1],[2,1]],
  [[0,0],[1,0],[0,1],[1,1]],
  [[0,0],[0,1],[1,1],[2,1]],
] as const);
const POLY8 = Object.freeze([
  [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],
  [[0,0],[1,0],[2,0],[3,0],[0,1],[1,1],[2,1],[3,1]],
  [[0,0],[0,1],[0,2],[0,3],[0,4],[1,4],[2,4],[3,4]],
  [[0,0],[1,0],[2,0],[3,0],[4,0],[2,1],[2,2],[2,3]],
  [[0,0],[1,0],[1,1],[2,1],[2,2],[3,2],[3,3],[4,3]],
  [[0,0],[0,1],[1,1],[1,2],[2,2],[2,3],[3,3],[3,4]],
] as const);

function targetTemplate(seed: string) {
  if (hash32(`${seed}:target-kind`) % 2 === 0) {
    const target = squareTarget(4);
    const first = rightTriangleTarget(4);
    return {
      kind: "SQUARE" as const,
      target,
      correctShapes: [first, complement(target, first)] as const,
      decoys: POLY8.map(polyominoTarget),
    };
  }
  const target = rightTriangleTarget(4);
  const splitVariants = [
    [0,1,2,3,4,5,6,7],
    [0,1,2,3,4,5,6,9],
    [0,1,2,3,4,5,6,11],
  ] as const;
  const indices = splitVariants[hash32(`${seed}:triangle-split`) % splitVariants.length]!;
  const first = normalize(indices.map((index) => target[index]!));
  return {
    kind: "TRIANGLE" as const,
    target,
    correctShapes: [first, complement(target, first)] as const,
    decoys: POLY4.map(polyominoTarget),
  };
}

function chooseUniquePool(seed: string) {
  const template = targetTemplate(seed);
  const correct: Piece[] = [
    Object.freeze({ id: "C1", shape: template.correctShapes[0] }),
    Object.freeze({ id: "C2", shape: template.correctShapes[1] }),
  ];
  const candidates = template.decoys.map((shape, index) => Object.freeze({ id: `D${index + 1}`, shape }));
  const triples: readonly [number, number, number][] = [] as any;
  const mutable: [number, number, number][] = [];
  for (let a = 0; a < candidates.length; a += 1) for (let b = a + 1; b < candidates.length; b += 1) for (let c = b + 1; c < candidates.length; c += 1) mutable.push([a,b,c]);
  (triples as any).push?.(...mutable);
  const ordered = mutable.sort((a, b) => hash32(`${seed}:triple:${a.join("-")}`) - hash32(`${seed}:triple:${b.join("-")}`));
  let selected: Piece[] | null = null;
  for (const triple of ordered) {
    const pool = [...correct, ...triple.map((index) => candidates[index]!)];
    const solvable: [number, number][] = [];
    for (let left = 0; left < pool.length; left += 1) {
      for (let right = left + 1; right < pool.length; right += 1) {
        const pair = [
          Object.freeze({ id: String(left + 1), shape: pool[left]!.shape }),
          Object.freeze({ id: String(right + 1), shape: pool[right]!.shape }),
        ];
        if (findExactCover(pair, template.target)) solvable.push([left, right]);
      }
    }
    if (solvable.length === 1 && solvable[0]![0] === 0 && solvable[0]![1] === 1) { selected = pool; break; }
  }
  if (!selected) throw new Error("FFM target-shape runtime could not build a unique five-piece pool.");
  const decorated = selected.map((piece, index) => ({ piece, role: index < 2 ? `CORRECT_${index}` : "DECOY", score: hash32(`${seed}:pool:${index}:${shapeKey(piece.shape)}`) }));
  decorated.sort((a, b) => a.score - b.score || a.role.localeCompare(b.role));
  const pool = decorated.map((entry, index) => Object.freeze({ id: String(index + 1), shape: entry.piece.shape, role: entry.role }));
  const correctIndexes = decorated.map((entry, index) => entry.role.startsWith("CORRECT_") ? index : -1).filter((index) => index >= 0).sort((a,b)=>a-b) as [number, number];
  const correctPieces = correctIndexes.map((index) => Object.freeze({ id: String(index + 1), shape: pool[index]!.shape }));
  const solution = findExactCover(correctPieces, template.target);
  if (!solution) throw new Error("FFM target-shape correct pair lost exact-cover solution after pool ordering.");
  const wrongPairs: [number, number][] = [];
  for (let left = 0; left < pool.length; left += 1) {
    for (let right = left + 1; right < pool.length; right += 1) {
      if (left === correctIndexes[0] && right === correctIndexes[1]) continue;
      const pairPieces = [Object.freeze({ id: String(left + 1), shape: pool[left]!.shape }), Object.freeze({ id: String(right + 1), shape: pool[right]!.shape })];
      if (!findExactCover(pairPieces, template.target)) wrongPairs.push([left, right]);
    }
  }
  if (wrongPairs.length < 3) throw new Error("FFM target-shape runtime needs at least three invalid pair distractors.");
  wrongPairs.sort((a,b)=>hash32(`${seed}:wrong:${a.join("-")}`)-hash32(`${seed}:wrong:${b.join("-")}`));
  const rawOptions = [{ pair: correctIndexes, correct: true }, ...wrongPairs.slice(0,3).map((pair)=>({ pair, correct:false }))]
    .map((entry,index)=>({...entry, score:hash32(`${seed}:option:${index}:${entry.pair.join("-")}`)}))
    .sort((a,b)=>a.score-b.score || a.pair[0]-b.pair[0]);
  const correctIndex = rawOptions.findIndex((entry)=>entry.correct);
  return { ...template, pool, solution, options: rawOptions, correctIndex };
}

function boundaryEdges(shape: AtomShape) {
  const counts = new Map<string, { count: number; a: Point; b: Point }>();
  for (const atom of normalize(shape)) {
    const edges: readonly [Point, Point][] = [[atom[0],atom[1]],[atom[1],atom[2]],[atom[0],atom[2]]];
    for (const [a,b] of edges) {
      const key=edgeKey(a,b); const current=counts.get(key);
      if (current) current.count += 1; else counts.set(key,{count:1,a,b});
    }
  }
  return [...counts.values()].filter((entry)=>entry.count===1);
}
function renderShapeInBox(shape: AtomShape, x: number, y: number, width: number, height: number, seed: string): string {
  const variants=orientations(shape); const current=variants[hash32(seed)%variants.length]!.shape; const b=bounds(current);
  const shapeW=Math.max(1,b.maxX-b.minX); const shapeH=Math.max(1,b.maxY-b.minY); const scale=Math.min((width-18)/shapeW,(height-18)/shapeH);
  const ox=x+(width-shapeW*scale)/2; const oy=y+(height-shapeH*scale)/2;
  return boundaryEdges(current).map(({a,b:bb})=>`<line x1="${(ox+(a[0]-b.minX)*scale).toFixed(2)}" y1="${(oy+(a[1]-b.minY)*scale).toFixed(2)}" x2="${(ox+(bb[0]-b.minX)*scale).toFixed(2)}" y2="${(oy+(bb[1]-b.minY)*scale).toFixed(2)}"/>`).join("");
}
function svgShell(width:number,height:number,body:string,label:string):string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${label}"><rect width="${width}" height="${height}" fill="white" stroke="none"/><g stroke="#111827" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round" fill="none">${body}</g></svg>`;
}
function renderTarget(shape:AtomShape,label:string,width=220,height=160):string { return svgShell(width,height,renderShapeInBox(shape,0,0,width,height,`${label}:target`),label); }
function renderTargetAndPool(target:AtomShape,pool:readonly any[],seed:string):string {
  const width=600,height=180; let body=renderShapeInBox(target,10,18,170,140,`${seed}:target`)+`<line x1="195" y1="15" x2="195" y2="165" stroke="#9ca3af" stroke-width="1"/>`;
  const slot=78;
  pool.forEach((piece,index)=>{ const x=205+index*slot; body+=renderShapeInBox(piece.shape,x,18,slot-5,118,`${seed}:piece:${index}`); body+=`<text x="${x+(slot-5)/2}" y="158" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" fill="#111827" stroke="none">${index+1}</text>`; });
  return svgShell(width,height,body,"Target figure and numbered pieces");
}
function renderPairNumbers(pair:readonly [number,number]):string {
  const body=`<text x="95" y="62" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#111827" stroke="none">${pair[0]+1} and ${pair[1]+1}</text>`;
  return svgShell(190,95,body,`Pieces ${pair[0]+1} and ${pair[1]+1}`);
}
function renderPiecePair(pool:readonly any[],pair:readonly [number,number],seed:string,index:number):string {
  let body=renderShapeInBox(pool[pair[0]]!.shape,8,8,82,98,`${seed}:${index}:left`)+renderShapeInBox(pool[pair[1]]!.shape,100,8,82,98,`${seed}:${index}:right`);
  return svgShell(190,114,body,"Pair of formation pieces");
}
function localizedExplanation(language:FigureFormationLanguageV1,correctLabel:string,pieceNumbers:readonly number[],solution:readonly Placement[],targetKind:"SQUARE"|"TRIANGLE") {
  const rotations=solution.slice().sort((a,b)=>a.pieceId.localeCompare(b.pieceId)).map((placement,index)=>({piece:pieceNumbers[index] ?? Number(placement.pieceId), rotation:placement.rotationDegrees}));
  const en=rotations.map((entry)=>`piece ${entry.piece} by ${entry.rotation}°`).join(" and ");
  const hi=rotations.map((entry)=>`टुकड़ा ${entry.piece} को ${entry.rotation}°`).join(" और ");
  const pa=rotations.map((entry)=>`ਟੁਕੜਾ ${entry.piece} ਨੂੰ ${entry.rotation}°`).join(" ਅਤੇ ");
  const targetEn=targetKind==="SQUARE"?"square":"triangle"; const targetHi=targetKind==="SQUARE"?"वर्ग":"त्रिभुज"; const targetPa=targetKind==="SQUARE"?"ਵਰਗ":"ਤਿਕੋਣ";
  if(language==="hi") return Object.freeze({observation:"टुकड़ों की बाहरी और तिरछी किनारियों को लक्ष्य सीमा से मिलाइए।",rule:"टुकड़ों को घुमाया जा सकता है, लेकिन पलटा नहीं जा सकता; सही जोड़ी बिना खाली जगह या ओवरलैप के पूरी सीमा भरती है।",application:`${hi} घुमाकर जोड़ने पर वे ${targetHi} की पूरी सीमा ठीक-ठीक भरते हैं।`,check:`इसलिए केवल विकल्प ${correctLabel} सही गठन बनाता है।`});
  if(language==="pa") return Object.freeze({observation:"ਟੁਕੜਿਆਂ ਦੀਆਂ ਬਾਹਰੀ ਅਤੇ ਤਿਰਛੀਆਂ ਹੱਦਾਂ ਨੂੰ ਨਿਸ਼ਾਨਾ ਹੱਦ ਨਾਲ ਮਿਲਾਓ।",rule:"ਟੁਕੜਿਆਂ ਨੂੰ ਘੁਮਾਇਆ ਜਾ ਸਕਦਾ ਹੈ ਪਰ ਪਰਛਾਵੇਂ ਵਾਂਗ ਉਲਟਿਆ ਨਹੀਂ ਜਾ ਸਕਦਾ; ਸਹੀ ਜੋੜੀ ਬਿਨਾਂ ਖਾਲੀ ਥਾਂ ਜਾਂ ਓਵਰਲੈਪ ਦੇ ਪੂਰੀ ਹੱਦ ਭਰਦੀ ਹੈ।",application:`${pa} ਘੁਮਾ ਕੇ ਜੋੜਨ ਨਾਲ ਉਹ ${targetPa} ਦੀ ਪੂਰੀ ਹੱਦ ਬਿਲਕੁਲ ਭਰਦੇ ਹਨ।`,check:`ਇਸ ਲਈ ਕੇਵਲ ਵਿਕਲਪ ${correctLabel} ਸਹੀ ਬਣਤਰ ਬਣਾਉਂਦਾ ਹੈ।`});
  return Object.freeze({observation:"Match the outside and sloping edges against the target boundary.",rule:"Pieces may be rotated but not reflected; the valid pair fills the complete target with no gap or overlap.",application:`Rotate ${en}; together they fill the ${targetEn} boundary exactly.`,check:`Therefore only option ${correctLabel} forms the required target.`});
}

export function generateFigureFormationTargetShapeQuestionV1(input:Readonly<{qlId:Extract<FigureFormationPermanentQlIdV10,"SPA-QL-052"|"SPA-QL-053">;seed:string;language?:FigureFormationLanguageV1;}>) {
  const language=input.language??"en"; const base=generateFigureFormationQuestionStudioV1({qlId:input.qlId,seed:input.seed,language}); const generated=chooseUniquePool(input.seed);
  const optionSvgs=input.qlId==="SPA-QL-052"
    ? generated.options.map((entry)=>renderPairNumbers(entry.pair))
    : generated.options.map((entry,index)=>renderPiecePair(generated.pool,entry.pair,input.seed,index));
  const stimulusSvgs=input.qlId==="SPA-QL-052" ? [renderTargetAndPool(generated.target,generated.pool,input.seed)] : [renderTarget(generated.target,generated.kind==="SQUARE"?"Square target":"Triangle target",260,180)];
  const answer=LABELS[generated.correctIndex]!; const correctPair=generated.options[generated.correctIndex]!.pair; const correctPieceNumbers=[correctPair[0]+1,correctPair[1]+1];
  const geometryDescriptor=`TARGET_SHAPE:${generated.kind}:${shapeKey(generated.target)}:${generated.pool.map((piece:any)=>shapeKey(piece.shape)).join("|")}:${generated.options.map((entry)=>entry.pair.join("-")).join("|")}`;
  const geometryFingerprint=shortHash(geometryDescriptor); const contentFingerprint=shortHash(`${input.qlId}:${geometryFingerprint}:${generated.correctIndex}`); const canonicalItemId=`${input.qlId}:${geometryFingerprint}:${contentFingerprint}`;
  return Object.freeze({
    ...base,
    version:"SPA-FFM-001-QUESTION-STUDIO-V3-TARGET-SHAPE" as const,
    stimulusSvgs:Object.freeze(stimulusSvgs), optionSvgs:Object.freeze(optionSvgs), correctIndex:generated.correctIndex, answer,
    explanation:localizedExplanation(language,answer,correctPieceNumbers,generated.solution,generated.kind),
    canonicalItemId, questionLanguageId:`${canonicalItemId}:${language}`, questionId:`ffm-001:${canonicalItemId}:${language}`, contentFingerprint, geometryFingerprint,
    localization:Object.freeze({...base.localization,authority:"SPA-FFM-001-MULTILINGUAL-RUNTIME-V2-FULL-REGION-LOCALIZATION" as const}),
    validation:Object.freeze({...base.validation,exactCoverSolverBacked:true as const,everyPieceUsedAccordingToQl:true as const,noIllegalOverlap:true as const,exactBoundaryCoverage:true as const,uniqueAnswer:true as const,rotationAllowed:true as const,reflectionDisallowed:true as const}),
    solveFacts:Object.freeze({placements:Object.freeze(generated.solution.map((placement)=>Object.freeze({pieceId:placement.pieceId,shapeId:"TRIANGULATED_POLYGON_PIECE" as const,rotationDegrees:placement.rotationDegrees,region:"target" as const}))),reflectionUsed:false as const,overlapCount:0 as const,uncoveredTargetCells:0 as const,targetKind:generated.kind,atomicTriangleCount:generated.target.length}),
  });
}

export type FigureFormationTargetShapeQuestionV1=ReturnType<typeof generateFigureFormationTargetShapeQuestionV1>;
