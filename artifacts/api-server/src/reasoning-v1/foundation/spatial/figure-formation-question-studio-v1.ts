import { FIGURE_FORMATION_INTERNAL_ACTIVATION_V1 } from "./figure-formation-internal-activation-v1";
import {
  FIGURE_FORMATION_PERMANENT_QL_ALLOCATIONS_V10,
  type FigureFormationPermanentQlIdV10,
} from "./spatial-permanent-ql-allocation-v10";

export type FigureFormationLanguageV1 = "en" | "hi" | "pa";
type Cell = readonly [number, number];
type ShapeId = "DOMINO" | "I3" | "L3" | "O4" | "I4" | "L4" | "T4" | "S4" | "Z4";
type Piece = Readonly<{ id: string; shapeId: ShapeId }>;
type Placement = Readonly<{ pieceId: string; shapeId: ShapeId; rotationDegrees: 0 | 90 | 180 | 270; cells: readonly Cell[] }>;

const OPTION_LABELS = Object.freeze(["A", "B", "C", "D"] as const);
type OptionLabel = (typeof OPTION_LABELS)[number];

const SHAPES: Readonly<Record<ShapeId, readonly Cell[]>> = Object.freeze({
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

const SUBSET_TEMPLATES = Object.freeze([
  Object.freeze({ pool: ["O4","I4","L4","T4","S4"] as const, target: [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,2]] as const }),
  Object.freeze({ pool: ["O4","I4","L4","T4","Z4"] as const, target: [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1]] as const }),
  Object.freeze({ pool: ["O4","I4","L4","S4","Z4"] as const, target: [[0,0],[0,1],[0,2],[0,3],[1,0],[1,1],[1,2],[2,0]] as const }),
  Object.freeze({ pool: ["O4","I4","T4","S4","Z4"] as const, target: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[1,1],[1,3]] as const }),
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

function shortHash(value: string): string {
  return hash32(value).toString(16).padStart(8, "0");
}

function normalizeCells(cells: readonly Cell[]): Cell[] {
  const minX = Math.min(...cells.map(([x]) => x));
  const minY = Math.min(...cells.map(([, y]) => y));
  return cells
    .map(([x, y]) => [x - minX, y - minY] as const)
    .sort(([ax, ay], [bx, by]) => ax - bx || ay - by);
}

function cellsKey(cells: readonly Cell[]): string {
  return normalizeCells(cells).map(([x, y]) => `${x},${y}`).join(";");
}

function rotateCells(cells: readonly Cell[]): Cell[] {
  return normalizeCells(cells.map(([x, y]) => [-y, x] as const));
}

function orientations(cells: readonly Cell[]) {
  const result: { rotationDegrees: 0 | 90 | 180 | 270; cells: Cell[] }[] = [];
  const seen = new Set<string>();
  let current = normalizeCells(cells);
  const degrees = [0, 90, 180, 270] as const;
  for (const rotationDegrees of degrees) {
    const key = cellsKey(current);
    if (!seen.has(key)) {
      seen.add(key);
      result.push({ rotationDegrees, cells: current });
    }
    current = rotateCells(current);
  }
  return result;
}

function rotationCanonicalKey(cells: readonly Cell[]): string {
  return orientations(cells).map((entry) => cellsKey(entry.cells)).sort()[0]!;
}

function pieceCells(piece: Piece): readonly Cell[] {
  return SHAPES[piece.shapeId];
}

function targetSet(target: readonly Cell[]): Set<string> {
  return new Set(normalizeCells(target).map(([x, y]) => `${x},${y}`));
}

function placementsForPiece(piece: Piece, target: readonly Cell[]): Placement[] {
  const normalizedTarget = normalizeCells(target);
  const allowed = targetSet(normalizedTarget);
  const maxX = Math.max(...normalizedTarget.map(([x]) => x));
  const maxY = Math.max(...normalizedTarget.map(([, y]) => y));
  const placements: Placement[] = [];
  const seen = new Set<string>();

  for (const orientation of orientations(pieceCells(piece))) {
    const pieceMaxX = Math.max(...orientation.cells.map(([x]) => x));
    const pieceMaxY = Math.max(...orientation.cells.map(([, y]) => y));
    for (let dx = 0; dx <= maxX - pieceMaxX; dx += 1) {
      for (let dy = 0; dy <= maxY - pieceMaxY; dy += 1) {
        const translated = orientation.cells.map(([x, y]) => [x + dx, y + dy] as const);
        const key = translated.map(([x, y]) => `${x},${y}`).sort().join(";");
        if (seen.has(key)) continue;
        if (!translated.every(([x, y]) => allowed.has(`${x},${y}`))) continue;
        seen.add(key);
        placements.push(Object.freeze({
          pieceId: piece.id,
          shapeId: piece.shapeId,
          rotationDegrees: orientation.rotationDegrees,
          cells: Object.freeze(translated),
        }));
      }
    }
  }
  return placements;
}

function findAssembly(pieces: readonly Piece[], target: readonly Cell[]): readonly Placement[] | null {
  const normalizedTarget = normalizeCells(target);
  if (pieces.reduce((sum, piece) => sum + pieceCells(piece).length, 0) !== normalizedTarget.length) return null;
  const required = targetSet(normalizedTarget);
  const candidateGroups = pieces.map((piece) => ({ piece, placements: placementsForPiece(piece, normalizedTarget) }));
  if (candidateGroups.some((entry) => entry.placements.length === 0)) return null;
  candidateGroups.sort((left, right) => left.placements.length - right.placements.length || left.piece.id.localeCompare(right.piece.id));

  function search(index: number, used: Set<string>, chosen: Placement[]): Placement[] | null {
    if (index === candidateGroups.length) return used.size === required.size ? chosen : null;
    const group = candidateGroups[index]!;
    for (const placement of group.placements) {
      const keys = placement.cells.map(([x, y]) => `${x},${y}`);
      if (keys.some((key) => used.has(key))) continue;
      const nextUsed = new Set(used);
      keys.forEach((key) => nextUsed.add(key));
      const result = search(index + 1, nextUsed, [...chosen, placement]);
      if (result) return result;
    }
    return null;
  }

  return search(0, new Set<string>(), []);
}

function makePieces(shapeIds: readonly ShapeId[]): Piece[] {
  return shapeIds.map((shapeId, index) => Object.freeze({ id: String(index + 1), shapeId }));
}

function combinationsOfTwo<T>(items: readonly T[]): readonly [number, number][] {
  const result: [number, number][] = [];
  for (let left = 0; left < items.length; left += 1) {
    for (let right = left + 1; right < items.length; right += 1) result.push([left, right]);
  }
  return result;
}

function placementRegion(placement: Placement, target: readonly Cell[]): string {
  const width = Math.max(...target.map(([x]) => x)) + 1;
  const height = Math.max(...target.map(([, y]) => y)) + 1;
  const cx = placement.cells.reduce((sum, [x]) => sum + x + 0.5, 0) / placement.cells.length;
  const cy = placement.cells.reduce((sum, [, y]) => sum + y + 0.5, 0) / placement.cells.length;
  const horizontal = cx < width * 0.4 ? "left" : cx > width * 0.6 ? "right" : "middle";
  const vertical = cy < height * 0.4 ? "upper" : cy > height * 0.6 ? "lower" : "middle";
  if (horizontal === "middle") return vertical === "middle" ? "central" : vertical;
  if (vertical === "middle") return horizontal;
  return `${vertical}-${horizontal}`;
}

function renderShapeSvg(cells: readonly Cell[], ariaLabel: string, width = 170, height = 128): string {
  const normalized = normalizeCells(cells);
  const shapeWidth = Math.max(...normalized.map(([x]) => x)) + 1;
  const shapeHeight = Math.max(...normalized.map(([, y]) => y)) + 1;
  const cell = Math.min(28, (width - 34) / shapeWidth, (height - 34) / shapeHeight);
  const ox = (width - shapeWidth * cell) / 2;
  const oy = (height - shapeHeight * cell) / 2;
  const occupied = new Set(normalized.map(([x, y]) => `${x},${y}`));
  const fills = normalized.map(([x, y]) => `<rect x="${(ox + x * cell).toFixed(2)}" y="${(oy + y * cell).toFixed(2)}" width="${cell.toFixed(2)}" height="${cell.toFixed(2)}" fill="white"/>`).join("");
  const edges: string[] = [];
  for (const [x, y] of normalized) {
    const x0 = ox + x * cell;
    const y0 = oy + y * cell;
    const x1 = x0 + cell;
    const y1 = y0 + cell;
    if (!occupied.has(`${x},${y - 1}`)) edges.push(`<line x1="${x0.toFixed(2)}" y1="${y0.toFixed(2)}" x2="${x1.toFixed(2)}" y2="${y0.toFixed(2)}"/>`);
    if (!occupied.has(`${x + 1},${y}`)) edges.push(`<line x1="${x1.toFixed(2)}" y1="${y0.toFixed(2)}" x2="${x1.toFixed(2)}" y2="${y1.toFixed(2)}"/>`);
    if (!occupied.has(`${x},${y + 1}`)) edges.push(`<line x1="${x0.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x1.toFixed(2)}" y2="${y1.toFixed(2)}"/>`);
    if (!occupied.has(`${x - 1},${y}`)) edges.push(`<line x1="${x0.toFixed(2)}" y1="${y0.toFixed(2)}" x2="${x0.toFixed(2)}" y2="${y1.toFixed(2)}"/>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${ariaLabel}"><rect width="${width}" height="${height}" fill="white"/>${fills}<g stroke="#111827" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" fill="none">${edges.join("")}</g></svg>`;
}

function renderPiecesSvg(pieces: readonly Piece[], seed: string, labels: boolean, width = 320, height = 150): string {
  const slotWidth = width / pieces.length;
  const body: string[] = [];
  for (let index = 0; index < pieces.length; index += 1) {
    const piece = pieces[index]!;
    const variants = orientations(pieceCells(piece));
    const variant = variants[hash32(`${seed}:${piece.id}:rotation`) % variants.length]!;
    const cells = variant.cells;
    const shapeWidth = Math.max(...cells.map(([x]) => x)) + 1;
    const shapeHeight = Math.max(...cells.map(([, y]) => y)) + 1;
    const cell = Math.min(21, (slotWidth - 18) / shapeWidth, (height - (labels ? 46 : 26)) / shapeHeight);
    const ox = index * slotWidth + (slotWidth - shapeWidth * cell) / 2;
    const oy = 18 + (height - (labels ? 52 : 32) - shapeHeight * cell) / 2;
    const occupied = new Set(cells.map(([x, y]) => `${x},${y}`));
    for (const [x, y] of cells) {
      const x0 = ox + x * cell;
      const y0 = oy + y * cell;
      const x1 = x0 + cell;
      const y1 = y0 + cell;
      body.push(`<rect x="${x0.toFixed(2)}" y="${y0.toFixed(2)}" width="${cell.toFixed(2)}" height="${cell.toFixed(2)}" fill="white"/>`);
      if (!occupied.has(`${x},${y - 1}`)) body.push(`<line x1="${x0.toFixed(2)}" y1="${y0.toFixed(2)}" x2="${x1.toFixed(2)}" y2="${y0.toFixed(2)}"/>`);
      if (!occupied.has(`${x + 1},${y}`)) body.push(`<line x1="${x1.toFixed(2)}" y1="${y0.toFixed(2)}" x2="${x1.toFixed(2)}" y2="${y1.toFixed(2)}"/>`);
      if (!occupied.has(`${x},${y + 1}`)) body.push(`<line x1="${x0.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x1.toFixed(2)}" y2="${y1.toFixed(2)}"/>`);
      if (!occupied.has(`${x - 1},${y}`)) body.push(`<line x1="${x0.toFixed(2)}" y1="${y0.toFixed(2)}" x2="${x0.toFixed(2)}" y2="${y1.toFixed(2)}"/>`);
    }
    if (labels) body.push(`<text x="${(index * slotWidth + slotWidth / 2).toFixed(2)}" y="${height - 12}" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" fill="#111827">${piece.id}</text>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="Figure formation pieces"><rect width="${width}" height="${height}" fill="white"/><g stroke="#111827" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${body.join("")}</g></svg>`;
}

function renderTargetAndPiecesSvg(target: readonly Cell[], pieces: readonly Piece[], seed: string): string {
  const targetSvg = renderShapeSvg(target, "Target figure", 170, 132).replace(/^<svg[^>]*>|<\/svg>$/g, "");
  const piecesSvg = renderPiecesSvg(pieces, seed, true, 350, 148).replace(/^<svg[^>]*>|<\/svg>$/g, "");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 170" width="560" height="170" role="img" aria-label="Target figure and numbered pieces"><rect width="560" height="170" fill="white"/><g transform="translate(0 18)">${targetSvg}</g><line x1="185" y1="18" x2="185" y2="152" stroke="#9ca3af" stroke-width="1"/><g transform="translate(200 10)">${piecesSvg}</g></svg>`;
}

function renderSubsetOption(pair: readonly [number, number]): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 100" width="170" height="100" role="img" aria-label="Pieces ${pair[0] + 1} and ${pair[1] + 1}"><rect width="170" height="100" fill="white"/><circle cx="55" cy="50" r="21" fill="white" stroke="#111827" stroke-width="1.4"/><circle cx="115" cy="50" r="21" fill="white" stroke="#111827" stroke-width="1.4"/><text x="55" y="57" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#111827">${pair[0] + 1}</text><text x="115" y="57" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#111827">${pair[1] + 1}</text><text x="85" y="57" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#111827">+</text></svg>`;
}

function localizedStem(language: FigureFormationLanguageV1, qlId: FigureFormationPermanentQlIdV10, seed: string): string {
  const variants = qlId === "SPA-QL-051"
    ? {
        en: ["Which answer figure can be formed by joining all the given pieces?", "Select the figure that can be made by using all the pieces shown below.", "Which figure is obtained when all the given pieces are assembled?"],
        hi: ["सभी दिए गए टुकड़ों को जोड़कर कौन-सी उत्तर आकृति बनाई जा सकती है?", "नीचे दिए सभी टुकड़ों का उपयोग करके बनने वाली आकृति चुनिए।", "सभी दिए गए टुकड़ों को जोड़ने पर कौन-सी आकृति बनेगी?"],
        pa: ["ਸਾਰੇ ਦਿੱਤੇ ਟੁਕੜਿਆਂ ਨੂੰ ਜੋੜ ਕੇ ਕਿਹੜੀ ਉੱਤਰ ਆਕ੍ਰਿਤੀ ਬਣ ਸਕਦੀ ਹੈ?", "ਹੇਠਾਂ ਦਿੱਤੇ ਸਾਰੇ ਟੁਕੜਿਆਂ ਦੀ ਵਰਤੋਂ ਨਾਲ ਬਣਨ ਵਾਲੀ ਆਕ੍ਰਿਤੀ ਚੁਣੋ।", "ਸਾਰੇ ਦਿੱਤੇ ਟੁਕੜੇ ਜੋੜਨ ਤੇ ਕਿਹੜੀ ਆਕ੍ਰਿਤੀ ਬਣੇਗੀ?"],
      }
    : qlId === "SPA-QL-052"
      ? {
          en: ["Which pair of numbered pieces can be joined to form the target figure?", "Select the two numbered pieces that together make the target figure.", "Which two pieces can be assembled to reproduce the target exactly?"],
          hi: ["क्रमांकित टुकड़ों की कौन-सी जोड़ी लक्ष्य आकृति बना सकती है?", "वे दो क्रमांकित टुकड़े चुनिए जो मिलकर लक्ष्य आकृति बनाते हैं।", "कौन-से दो टुकड़े जोड़कर लक्ष्य आकृति ठीक-ठीक बनाई जा सकती है?"],
          pa: ["ਨੰਬਰ ਲੱਗੇ ਟੁਕੜਿਆਂ ਦੀ ਕਿਹੜੀ ਜੋੜੀ ਨਿਸ਼ਾਨਾ ਆਕ੍ਰਿਤੀ ਬਣਾ ਸਕਦੀ ਹੈ?", "ਉਹ ਦੋ ਨੰਬਰ ਲੱਗੇ ਟੁਕੜੇ ਚੁਣੋ ਜੋ ਮਿਲ ਕੇ ਨਿਸ਼ਾਨਾ ਆਕ੍ਰਿਤੀ ਬਣਾਉਂਦੇ ਹਨ।", "ਕਿਹੜੇ ਦੋ ਟੁਕੜੇ ਜੋੜ ਕੇ ਨਿਸ਼ਾਨਾ ਆਕ੍ਰਿਤੀ ਬਿਲਕੁਲ ਬਣ ਸਕਦੀ ਹੈ?"],
        }
      : {
          en: ["Which option contains the pieces that can be joined to form the target figure?", "Select the set of pieces that can make the target figure exactly.", "Which pair of pieces can be assembled into the target shown?"],
          hi: ["किस विकल्प के टुकड़ों को जोड़कर लक्ष्य आकृति बनाई जा सकती है?", "टुकड़ों का वह समूह चुनिए जो लक्ष्य आकृति ठीक-ठीक बना सकता है।", "कौन-सी टुकड़ों की जोड़ी दिखाई गई लक्ष्य आकृति बना सकती है?"],
          pa: ["ਕਿਹੜੇ ਵਿਕਲਪ ਦੇ ਟੁਕੜਿਆਂ ਨੂੰ ਜੋੜ ਕੇ ਨਿਸ਼ਾਨਾ ਆਕ੍ਰਿਤੀ ਬਣ ਸਕਦੀ ਹੈ?", "ਉਹ ਟੁਕੜਿਆਂ ਦਾ ਸਮੂਹ ਚੁਣੋ ਜੋ ਨਿਸ਼ਾਨਾ ਆਕ੍ਰਿਤੀ ਬਿਲਕੁਲ ਬਣਾ ਸਕਦਾ ਹੈ।", "ਕਿਹੜੀ ਟੁਕੜਿਆਂ ਦੀ ਜੋੜੀ ਦਿੱਤੀ ਨਿਸ਼ਾਨਾ ਆਕ੍ਰਿਤੀ ਬਣਾ ਸਕਦੀ ਹੈ?"],
        };
  const list = variants[language];
  return list[hash32(`${seed}:${qlId}:stem`) % list.length]!;
}

function localizedExplanation(input: Readonly<{
  language: FigureFormationLanguageV1;
  qlId: FigureFormationPermanentQlIdV10;
  correctLabel: OptionLabel;
  correctPieceNumbers: readonly number[];
  placements: readonly Placement[];
  target: readonly Cell[];
}>) {
  const transforms = input.placements
    .slice()
    .sort((a, b) => a.pieceId.localeCompare(b.pieceId))
    .map((placement, index) => ({
      pieceNumber: input.correctPieceNumbers[index] ?? Number(placement.pieceId),
      rotation: placement.rotationDegrees,
      region: placementRegion(placement, input.target),
    }));
  const transformTextEn = transforms.map((entry) => `piece ${entry.pieceNumber} at ${entry.rotation}° in the ${entry.region} part`).join(", ");
  const transformTextHi = transforms.map((entry) => `टुकड़ा ${entry.pieceNumber} को ${entry.rotation}° पर ${entry.region} भाग में`).join(", ");
  const transformTextPa = transforms.map((entry) => `ਟੁਕੜਾ ${entry.pieceNumber} ਨੂੰ ${entry.rotation}° ਤੇ ${entry.region} ਹਿੱਸੇ ਵਿੱਚ`).join(", ");

  if (input.language === "hi") {
    return Object.freeze({
      observation: "टुकड़ों की बाहरी किनारियों और मिलने वाली किनारियों को अलग-अलग मिलाइए।",
      rule: "टुकड़ों को घुमाया जा सकता है, लेकिन पलटा नहीं जा सकता; सही गठन में न तो खाली जगह रहती है और न टुकड़े एक-दूसरे पर चढ़ते हैं।",
      application: `${transformTextHi} रखने पर सभी किनारियाँ लक्ष्य सीमा के भीतर ठीक बैठती हैं और पूरी आकृति बन जाती है।`,
      check: `इसलिए केवल विकल्प ${input.correctLabel} लक्ष्य आकृति को ठीक-ठीक बनाता है।`,
    });
  }
  if (input.language === "pa") {
    return Object.freeze({
      observation: "ਟੁਕੜਿਆਂ ਦੀਆਂ ਬਾਹਰੀ ਹੱਦਾਂ ਅਤੇ ਮਿਲਣ ਵਾਲੀਆਂ ਹੱਦਾਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਮਿਲਾਓ।",
      rule: "ਟੁਕੜਿਆਂ ਨੂੰ ਘੁਮਾਇਆ ਜਾ ਸਕਦਾ ਹੈ ਪਰ ਪਰਛਾਵੇਂ ਵਾਂਗ ਉਲਟਿਆ ਨਹੀਂ ਜਾ ਸਕਦਾ; ਸਹੀ ਬਣਤਰ ਵਿੱਚ ਨਾ ਖਾਲੀ ਥਾਂ ਰਹਿੰਦੀ ਹੈ ਤੇ ਨਾ ਹੀ ਟੁਕੜੇ ਇਕ-ਦੂਜੇ ਉੱਤੇ ਚੜ੍ਹਦੇ ਹਨ।",
      application: `${transformTextPa} ਰੱਖਣ ਨਾਲ ਸਾਰੀਆਂ ਹੱਦਾਂ ਨਿਸ਼ਾਨਾ ਆਕ੍ਰਿਤੀ ਦੇ ਅੰਦਰ ਠੀਕ ਬੈਠਦੀਆਂ ਹਨ ਅਤੇ ਪੂਰੀ ਆਕ੍ਰਿਤੀ ਬਣ ਜਾਂਦੀ ਹੈ।`,
      check: `ਇਸ ਲਈ ਕੇਵਲ ਵਿਕਲਪ ${input.correctLabel} ਨਿਸ਼ਾਨਾ ਆਕ੍ਰਿਤੀ ਨੂੰ ਬਿਲਕੁਲ ਬਣਾਉਂਦਾ ਹੈ।`,
    });
  }
  return Object.freeze({
    observation: "Match the outside boundaries separately from the edges that will be joined.",
    rule: "Pieces may be rotated but not reflected; a valid formation leaves no gap, overlap or extra outer edge.",
    application: `Place ${transformTextEn}. Their joined boundaries disappear internally and the remaining outline matches the target exactly.`,
    check: `Therefore only option ${input.correctLabel} forms the required figure exactly.`,
  });
}

function difficultyBand(qlId: FigureFormationPermanentQlIdV10, pieceCount: number): "Easy" | "Medium" | "Hard" {
  if (qlId === "SPA-QL-051" && pieceCount === 2) return "Easy";
  if (qlId === "SPA-QL-051" && pieceCount >= 3) return "Medium";
  return "Medium";
}

function allocationFor(qlId: FigureFormationPermanentQlIdV10) {
  const allocation = FIGURE_FORMATION_PERMANENT_QL_ALLOCATIONS_V10.find((entry) => entry.permanentQlId === qlId);
  if (!allocation) throw new Error(`Missing FFM-001 allocation for ${qlId}.`);
  return allocation;
}

function lifecycle() {
  return Object.freeze({
    questionStudioDiscoverable: true as const,
    registrationStatus: "REGISTERED" as const,
    persistenceAllowed: true as const,
    questionBankStatus: FIGURE_FORMATION_INTERNAL_ACTIVATION_V1.questionBankStatus,
    questionBankWritable: true as const,
    questionBankAcceptanceMode: FIGURE_FORMATION_INTERNAL_ACTIVATION_V1.questionBankAcceptanceMode,
    testEligibility: FIGURE_FORMATION_INTERNAL_ACTIVATION_V1.testEligibility,
    testEligible: true as const,
    testBuilderEligible: true as const,
    publiclyPublishable: true as const,
    mockTestEligible: false as const,
    publicReleaseAuthorized: false as const,
    studentDeliveryAuthorized: false as const,
    manualApprovalRequired: true as const,
    manualQuestionPublicationRequired: true as const,
    automaticStudentPublication: false as const,
    releaseAuthority: FIGURE_FORMATION_INTERNAL_ACTIVATION_V1.authorityId,
  });
}

function commonQuestion(input: Readonly<{
  qlId: FigureFormationPermanentQlIdV10;
  language: FigureFormationLanguageV1;
  seed: string;
  target: readonly Cell[];
  stimulusSvgs: readonly string[];
  optionSvgs: readonly string[];
  correctIndex: number;
  correctPieceNumbers: readonly number[];
  placements: readonly Placement[];
  geometryDescriptor: string;
  pieceCount: number;
}>) {
  const allocation = allocationFor(input.qlId);
  const answer = OPTION_LABELS[input.correctIndex]!;
  const geometryFingerprint = shortHash(input.geometryDescriptor);
  const contentFingerprint = shortHash(`${input.qlId}:${geometryFingerprint}:${input.optionSvgs.map((svg) => shortHash(svg)).join(":")}:${input.correctIndex}`);
  const canonicalItemId = `${input.qlId}:${geometryFingerprint}:${contentFingerprint}`;
  const locale = input.language === "hi" ? "hi-IN" as const : input.language === "pa" ? "pa-IN" as const : "en-IN" as const;
  return {
    version: "SPA-FFM-001-QUESTION-STUDIO-V1" as const,
    packageId: "SPA-001" as const,
    qlId: input.qlId,
    proposalId: allocation.proposalId,
    chapterCode: "FFM-001" as const,
    qlName: allocation.name,
    language: input.language,
    locale,
    difficultyBand: difficultyBand(input.qlId, input.pieceCount),
    seed: input.seed,
    generationSeed: input.seed,
    mode: allocation.skillMode,
    stem: localizedStem(input.language, input.qlId, input.seed),
    stimulusSvgs: Object.freeze([...input.stimulusSvgs]),
    optionSvgs: Object.freeze([...input.optionSvgs]) as readonly string[],
    optionLabels: OPTION_LABELS,
    correctIndex: input.correctIndex,
    answer,
    explanation: localizedExplanation({
      language: input.language,
      qlId: input.qlId,
      correctLabel: answer,
      correctPieceNumbers: input.correctPieceNumbers,
      placements: input.placements,
      target: input.target,
    }),
    canonicalItemId,
    questionLanguageId: `${canonicalItemId}:${input.language}`,
    questionId: `ffm-001:${canonicalItemId}:${input.language}`,
    contentFingerprint,
    geometryFingerprint,
    renderer: Object.freeze({
      kind: "SVG_WITH_IMAGE_OPTIONS" as const,
      recommendedStimulusPixels: 300,
      recommendedOptionPixels: 180,
      mobileMinimumOptionPixels: 112,
    }),
    localization: Object.freeze({
      authority: "SPA-FFM-001-MULTILINGUAL-RUNTIME-V1" as const,
      canonicalLanguage: "en" as const,
      targetLanguage: input.language,
      semanticParity: "GEOMETRY_OPTIONS_ANSWER_AND_PLACEMENTS_EXACT" as const,
    }),
    validation: Object.freeze({
      valid: true as const,
      exactCoverSolverBacked: true as const,
      everyPieceUsedAccordingToQl: true as const,
      noIllegalOverlap: true as const,
      exactBoundaryCoverage: true as const,
      uniqueAnswer: true as const,
      rotationAllowed: true as const,
      reflectionDisallowed: true as const,
      svgSanitizedByConstruction: true as const,
      learnerExplanationSafe: true as const,
    }),
    lifecycle: lifecycle(),
    sourceFreezeAuthority: FIGURE_FORMATION_INTERNAL_ACTIVATION_V1.authorityId,
    solveFacts: Object.freeze({
      placements: Object.freeze(input.placements.map((placement) => Object.freeze({
        pieceId: placement.pieceId,
        shapeId: placement.shapeId,
        rotationDegrees: placement.rotationDegrees,
        region: placementRegion(placement, input.target),
      }))),
      reflectionUsed: false as const,
      overlapCount: 0 as const,
      uncoveredTargetCells: 0 as const,
    }),
  } as const;
}

function generateQl051(seed: string, language: FigureFormationLanguageV1) {
  const template = ASSEMBLY_TEMPLATES[hash32(`${seed}:template`) % ASSEMBLY_TEMPLATES.length]!;
  const pieces = makePieces(template.pieceShapes);
  const target = normalizeCells(template.target);
  const solution = findAssembly(pieces, target);
  if (!solution) throw new Error("SPA-QL-051 template lost its exact-cover solution.");

  const targetCatalog = [...ASSEMBLY_TEMPLATES.map((entry) => normalizeCells(entry.target)), ...EXTRA_TARGETS.map((entry) => normalizeCells(entry))];
  const uniqueByRotation = new Map<string, Cell[]>();
  for (const candidate of targetCatalog) uniqueByRotation.set(rotationCanonicalKey(candidate), candidate);
  const distractors = [...uniqueByRotation.values()]
    .filter((candidate) => rotationCanonicalKey(candidate) !== rotationCanonicalKey(target))
    .filter((candidate) => findAssembly(pieces, candidate) === null)
    .sort((a, b) => hash32(`${seed}:${cellsKey(a)}`) - hash32(`${seed}:${cellsKey(b)}`))
    .slice(0, 3);
  if (distractors.length !== 3) throw new Error("SPA-QL-051 could not produce three exact-cover distractors.");

  const rawOptions = [target, ...distractors];
  const ordered = rawOptions
    .map((cells, rawIndex) => ({ cells, rawIndex, score: hash32(`${seed}:option:${cellsKey(cells)}`) }))
    .sort((a, b) => a.score - b.score || cellsKey(a.cells).localeCompare(cellsKey(b.cells)));
  const correctIndex = ordered.findIndex((entry) => entry.rawIndex === 0);
  if (correctIndex < 0) throw new Error("SPA-QL-051 lost correct option ownership.");

  return commonQuestion({
    qlId: "SPA-QL-051",
    language,
    seed,
    target,
    stimulusSvgs: [renderPiecesSvg(pieces, seed, true)],
    optionSvgs: ordered.map((entry, index) => renderShapeSvg(entry.cells, `Option ${OPTION_LABELS[index]}`)),
    correctIndex,
    correctPieceNumbers: pieces.map((_, index) => index + 1),
    placements: solution,
    geometryDescriptor: `QL051:${pieces.map((piece) => piece.shapeId).join("+")}:${cellsKey(target)}:${ordered.map((entry) => cellsKey(entry.cells)).join("|")}`,
    pieceCount: pieces.length,
  });
}

function subsetCandidates(template: (typeof SUBSET_TEMPLATES)[number], seed: string) {
  const pieces = makePieces(template.pool);
  const target = normalizeCells(template.target);
  const evaluated = combinationsOfTwo(pieces).map((pair) => {
    const selected = [pieces[pair[0]]!, pieces[pair[1]]!].map((piece, index) => Object.freeze({ ...piece, id: String(index + 1) }));
    const solution = findAssembly(selected, target);
    return { pair, selected, solution };
  });
  const solvable = evaluated.filter((entry) => entry.solution !== null);
  if (solvable.length !== 1) throw new Error(`FFM subset template expected one solvable pair, got ${solvable.length}.`);
  const correct = solvable[0]!;
  const wrong = evaluated
    .filter((entry) => entry.solution === null)
    .sort((a, b) => hash32(`${seed}:pair:${a.pair.join("-")}`) - hash32(`${seed}:pair:${b.pair.join("-")}`))
    .slice(0, 3);
  const optionCandidates = [correct, ...wrong]
    .map((entry, rawIndex) => ({ ...entry, rawIndex, score: hash32(`${seed}:option-pair:${entry.pair.join("-")}`) }))
    .sort((a, b) => a.score - b.score || a.pair[0] - b.pair[0] || a.pair[1] - b.pair[1]);
  const correctIndex = optionCandidates.findIndex((entry) => entry.rawIndex === 0);
  if (correctIndex < 0 || !correct.solution) throw new Error("FFM subset option ownership failed.");
  return { pieces, target, correct, optionCandidates, correctIndex };
}

function generateQl052(seed: string, language: FigureFormationLanguageV1) {
  const template = SUBSET_TEMPLATES[hash32(`${seed}:template`) % SUBSET_TEMPLATES.length]!;
  const result = subsetCandidates(template, seed);
  return commonQuestion({
    qlId: "SPA-QL-052",
    language,
    seed,
    target: result.target,
    stimulusSvgs: [renderTargetAndPiecesSvg(result.target, result.pieces, seed)],
    optionSvgs: result.optionCandidates.map((entry) => renderSubsetOption(entry.pair)),
    correctIndex: result.correctIndex,
    correctPieceNumbers: [result.correct.pair[0] + 1, result.correct.pair[1] + 1],
    placements: result.correct.solution!,
    geometryDescriptor: `QL052:${template.pool.join("+")}:${cellsKey(result.target)}:${result.optionCandidates.map((entry) => entry.pair.join("-")).join("|")}`,
    pieceCount: 2,
  });
}

function generateQl053(seed: string, language: FigureFormationLanguageV1) {
  const template = SUBSET_TEMPLATES[hash32(`${seed}:template:inverse`) % SUBSET_TEMPLATES.length]!;
  const result = subsetCandidates(template, `${seed}:inverse`);
  const optionSvgs = result.optionCandidates.map((entry, index) => {
    const originalPieces = [result.pieces[entry.pair[0]]!, result.pieces[entry.pair[1]]!].map((piece, pieceIndex) => Object.freeze({ ...piece, id: String(pieceIndex + 1) }));
    return renderPiecesSvg(originalPieces, `${seed}:option:${index}`, false, 190, 118);
  });
  return commonQuestion({
    qlId: "SPA-QL-053",
    language,
    seed,
    target: result.target,
    stimulusSvgs: [renderShapeSvg(result.target, "Target figure", 250, 170)],
    optionSvgs,
    correctIndex: result.correctIndex,
    correctPieceNumbers: [1, 2],
    placements: result.correct.solution!,
    geometryDescriptor: `QL053:${cellsKey(result.target)}:${result.optionCandidates.map((entry) => entry.pair.map((pieceIndex) => template.pool[pieceIndex]).join("+")).join("|")}`,
    pieceCount: 2,
  });
}

export function generateFigureFormationQuestionStudioV1(input: Readonly<{
  qlId: FigureFormationPermanentQlIdV10;
  seed: string;
  language?: FigureFormationLanguageV1;
}>) {
  const seed = String(input.seed ?? "").trim();
  if (!seed) throw new Error("FFM-001 generation requires an explicit seed.");
  const language = input.language ?? "en";
  if (!(["en", "hi", "pa"] as const).includes(language)) throw new Error(`Unsupported FFM-001 language '${language}'.`);
  if (input.qlId === "SPA-QL-051") return Object.freeze(generateQl051(seed, language));
  if (input.qlId === "SPA-QL-052") return Object.freeze(generateQl052(seed, language));
  if (input.qlId === "SPA-QL-053") return Object.freeze(generateQl053(seed, language));
  throw new Error(`Unsupported FFM-001 permanent QL '${input.qlId}'.`);
}

export type FigureFormationQuestionStudioQuestionV1 = ReturnType<typeof generateFigureFormationQuestionStudioV1>;
