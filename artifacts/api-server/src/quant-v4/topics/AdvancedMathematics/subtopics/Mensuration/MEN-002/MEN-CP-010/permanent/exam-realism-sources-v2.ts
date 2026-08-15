import type { MenCp010PermanentEnglishQuestion } from "./runtime-v1";
import type { MenCp010PermanentQlId } from "./allocation";

export const MEN_CP_010_EXAM_REALISM_SOURCES_V2_AUTHORITY =
  "MEN-CP010-EXAM-REALISM-SOURCES-V2" as const;

const LABELS = ["A", "B", "C", "D"] as const;

function hash(text: string) {
  let h = 2166136261 >>> 0;
  for (const c of text) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

function pick<T>(seed: string, values: readonly T[]): T {
  return values[hash(seed) % values.length]!;
}

function int(seed: string, min: number, max: number) {
  return min + (hash(seed) % (max - min + 1));
}

function tidy(value: number, digits = 3) {
  return value.toFixed(digits).replace(/0+$/, "").replace(/\.$/, "");
}

function options(
  targetIndex: number,
  answer: string,
  distractors: readonly string[],
  misconceptionIds: readonly string[],
): MenCp010PermanentEnglishQuestion["options"] {
  const wrong = [...new Set(distractors.filter((value) => value !== answer))];
  if (wrong.length < 3) throw new Error(`Exam-realism distractors collapsed: ${answer}`);
  let wrongIndex = 0;
  return LABELS.map((label, index) => {
    if (index === targetIndex) {
      return { label, display: answer, isCorrect: true, misconceptionId: null };
    }
    const position = wrongIndex++;
    return {
      label,
      display: wrong[position]!,
      isCorrect: false,
      misconceptionId: misconceptionIds[position] ?? `EXAM_V2_DISTRACTOR_${position + 1}`,
    };
  });
}

function explanation(
  keyRule: string,
  given: string,
  formula: string,
  work: string,
  answer: string,
  shortcut: string,
  traps: readonly string[],
): MenCp010PermanentEnglishQuestion["explanation"] {
  return {
    keyRule,
    steps: [
      { title: "Read the given values", body: given },
      { title: "Choose the formula", body: formula },
      { title: "Substitute and calculate", body: work },
      { title: "Check the result", body: `The required answer is ${answer}; it satisfies the stated geometric relations.` },
    ],
    shortcut,
    traps,
  };
}

export interface MenCp010ExamRealismOverlay {
  readonly authority: typeof MEN_CP_010_EXAM_REALISM_SOURCES_V2_AUTHORITY;
  readonly qlId: MenCp010PermanentQlId;
  readonly sourceId: string;
  readonly stem: string;
  readonly answer: string;
  readonly options: MenCp010PermanentEnglishQuestion["options"];
  readonly explanation: MenCp010PermanentEnglishQuestion["explanation"];
  readonly verification: MenCp010PermanentEnglishQuestion["verification"];
}

const SOURCE_IDS: Readonly<Partial<Record<MenCp010PermanentQlId, readonly string[]>>> = {
  "MEN-002-QL-124": [
    "EXAM-V2-PYRAMID-VOLUME-EQUILATERAL-BASE",
    "EXAM-V2-PYRAMID-VOLUME-SQUARE-DIAGONAL",
    "EXAM-V2-PYRAMID-VOLUME-FROM-FACE-SLANT",
    "EXAM-V2-PYRAMID-VOLUME-FROM-SLANT-EDGE",
    "EXAM-V2-PYRAMID-TSA-BASE-PERCENT-TO-VOLUME",
  ],
  "MEN-002-QL-128": ["EXAM-V2-PYRAMID-SURFACE-FROM-VERTICAL-HEIGHT"],
  "MEN-002-QL-129": ["EXAM-V2-CONICAL-FRUSTUM-VOLUME-CLEAN-PI"],
  "MEN-002-QL-130": ["EXAM-V2-FRUSTUM-LAMPSHADE-SHEET-AREA"],
  "MEN-002-QL-131": ["EXAM-V2-SQUARE-FRUSTUM-FULL-MINUS-CUT"],
  "MEN-002-QL-136": ["EXAM-V2-PYRAMID-CUT-PART-VOLUME-RATIO"],
  "MEN-002-QL-141": ["EXAM-V2-CONICAL-FRUSTUM-PARENT-HEIGHT"],
  "MEN-002-QL-143": ["EXAM-V2-FRUSTUM-BUCKET-CAPACITY"],
  "MEN-002-QL-145": ["EXAM-V2-PYRAMID-NONUNIFORM-VOLUME-SCALING"],
};

export function listMenCp010ExamRealismSourcesV2() {
  return Object.entries(SOURCE_IDS).flatMap(([qlId, sourceIds]) =>
    (sourceIds ?? []).map((sourceId) => ({ qlId: qlId as MenCp010PermanentQlId, sourceId })),
  );
}

export function hasMenCp010ExamRealismSourceV2(qlId: MenCp010PermanentQlId) {
  return (SOURCE_IDS[qlId]?.length ?? 0) > 0;
}

export function shouldUseMenCp010ExamRealismSourceV2(qlId: MenCp010PermanentQlId, seed: string) {
  if (!hasMenCp010ExamRealismSourceV2(qlId)) return false;
  if (seed.includes("exam-v2")) return true;
  return hash(`${qlId}:${seed}:exam-realism`) % 2 === 0;
}

export function buildMenCp010ExamRealismOverlayV2(
  qlId: MenCp010PermanentQlId,
  seed: string,
  targetIndex: number,
): MenCp010ExamRealismOverlay | null {
  const sourceIds = SOURCE_IDS[qlId];
  if (!sourceIds?.length) return null;
  const sourceId = pick(`${seed}:source`, sourceIds);

  if (qlId === "MEN-002-QL-124") {
    if (sourceId === "EXAM-V2-PYRAMID-VOLUME-EQUILATERAL-BASE") {
      const k = int(`${seed}:k`, 1, 4);
      const m = int(`${seed}:m`, 1, 4);
      const side = 6 * k;
      const heightCoeff = 2 * m;
      const volume = 18 * k * k * m;
      const answer = `${volume} cm³`;
      return {
        authority: MEN_CP_010_EXAM_REALISM_SOURCES_V2_AUTHORITY, qlId, sourceId,
        stem: `A right pyramid has an equilateral-triangular base of side ${side} cm and vertical height ${heightCoeff}√3 cm. Find its volume.`,
        answer,
        options: options(targetIndex, answer, [`${volume * 3} cm³`, `${volume / 3} cm³`, `${volume * 2} cm³`], ["OMIT_ONE_THIRD", "DIVIDE_BY_THREE_TWICE", "DOUBLE_BASE_AREA"]),
        explanation: explanation(
          "First construct the equilateral-triangle base area, then use V = Bh/3.",
          `Base side = ${side} cm and vertical height = ${heightCoeff}√3 cm.`,
          "B = (√3/4)a² and V = Bh/3.",
          `B = (√3/4)×${side}² = ${9 * k * k}√3 cm². Therefore V = (${9 * k * k}√3 × ${heightCoeff}√3)/3 = ${volume} cm³.`,
          answer,
          "Use √3×√3 = 3 before multiplying the remaining integers.",
          ["Do not use the base side itself as base area.", "Do not omit the one-third factor for a pyramid."],
        ),
        verification: { valid: true, method: "exact equilateral-base area followed by V=Bh/3" },
      };
    }

    if (sourceId === "EXAM-V2-PYRAMID-VOLUME-SQUARE-DIAGONAL") {
      const d = 2 * int(`${seed}:d`, 3, 8);
      const h = 3 * int(`${seed}:h`, 2, 6);
      const baseArea = (d * d) / 2;
      const volume = (baseArea * h) / 3;
      const answer = `${volume} cm³`;
      return {
        authority: MEN_CP_010_EXAM_REALISM_SOURCES_V2_AUTHORITY, qlId, sourceId,
        stem: `The diagonal of the square base of a right pyramid is ${d} cm and its vertical height is ${h} cm. Find its volume.`,
        answer,
        options: options(targetIndex, answer, [`${volume * 2} cm³`, `${volume * 3} cm³`, `${baseArea} cm³`], ["USE_DIAGONAL_AS_SIDE", "OMIT_ONE_THIRD", "STOP_AT_BASE_AREA"]),
        explanation: explanation(
          "A square with diagonal d has area d²/2; then apply V = Bh/3.",
          `Base diagonal = ${d} cm and vertical height = ${h} cm.`,
          "B = d²/2; V = Bh/3.",
          `B = ${d}²/2 = ${baseArea} cm². Hence V = ${baseArea}×${h}/3 = ${volume} cm³.`,
          answer,
          "Recover the base area directly from the diagonal; there is no need to find the side first.",
          ["Do not treat the diagonal as the side.", "The pyramid volume is one-third of the corresponding prism."],
        ),
        verification: { valid: true, method: "square area from diagonal then V=Bh/3" },
      };
    }

    if (sourceId === "EXAM-V2-PYRAMID-VOLUME-FROM-FACE-SLANT") {
      const [halfSide, height, slant] = pick(`${seed}:triple`, [[3,4,5],[5,12,13],[8,15,17]] as const);
      const scale = int(`${seed}:scale`, 1, 3);
      const x = halfSide * scale, h = height * scale, l = slant * scale, side = 2 * x;
      const volume = (side * side * h) / 3;
      const answer = `${volume} cm³`;
      return {
        authority: MEN_CP_010_EXAM_REALISM_SOURCES_V2_AUTHORITY, qlId, sourceId,
        stem: `A right square pyramid has base side ${side} cm and face slant height ${l} cm. Find its volume.`,
        answer,
        options: options(targetIndex, answer, [`${side * side * l / 3} cm³`, `${side * side * h} cm³`, `${volume / 2} cm³`], ["USE_SLANT_AS_VERTICAL", "OMIT_ONE_THIRD", "HALF_VOLUME"]),
        explanation: explanation(
          "Recover the vertical height from the face slant triangle before using the volume formula.",
          `Half the base side is ${x} cm and face slant height is ${l} cm.`,
          "h = √(l²-(a/2)²); V = a²h/3.",
          `h = √(${l}²-${x}²) = ${h} cm. Therefore V = ${side}²×${h}/3 = ${volume} cm³.`,
          answer,
          "The face slant height pairs with half the base side, not with the full side.",
          ["Do not put slant height directly into V = Bh/3.", "Use half the base side in the right triangle."],
        ),
        verification: { valid: l*l === h*h + x*x, method: "Pythagorean face triangle then V=a²h/3" },
      };
    }

    if (sourceId === "EXAM-V2-PYRAMID-VOLUME-FROM-SLANT-EDGE") {
      const k = int(`${seed}:k`, 1, 3);
      const sideCoeff = 8 * k;
      const edge = 10 * k;
      const centreToVertex = 8 * k;
      const height = 6 * k;
      const baseArea = 2 * sideCoeff * sideCoeff;
      const volume = (baseArea * height) / 3;
      const answer = `${volume} cm³`;
      return {
        authority: MEN_CP_010_EXAM_REALISM_SOURCES_V2_AUTHORITY, qlId, sourceId,
        stem: `A right square pyramid has base side ${sideCoeff}√2 cm and each slant edge from the apex to a base vertex is ${edge} cm. Find its volume.`,
        answer,
        options: options(targetIndex, answer, [`${baseArea * edge / 3} cm³`, `${baseArea * height} cm³`, `${volume / 2} cm³`], ["USE_SLANT_EDGE_AS_HEIGHT", "OMIT_ONE_THIRD", "HALF_VOLUME"]),
        explanation: explanation(
          "For a square base, centre-to-vertex distance is a/√2. Use the apex-centre-vertex right triangle to recover vertical height.",
          `Base side = ${sideCoeff}√2 cm, so centre-to-vertex distance = ${centreToVertex} cm; slant edge = ${edge} cm.`,
          "h = √(e²-(a/√2)²); B = a²; V = Bh/3.",
          `h = √(${edge}²-${centreToVertex}²) = ${height} cm. Base area = (${sideCoeff}√2)² = ${baseArea} cm². Thus V = ${baseArea}×${height}/3 = ${volume} cm³.`,
          answer,
          "A slant edge reaches a vertex, so use half the base diagonal—not half the side.",
          ["Do not confuse face slant height with slant edge.", "Do not use the slant edge as vertical height."],
        ),
        verification: { valid: edge*edge === centreToVertex*centreToVertex + height*height, method: "apex-centre-vertex triangle then V=Bh/3" },
      };
    }

    const k = int(`${seed}:k`, 1, 4);
    const side = 6 * k, baseArea = side * side, tsa = (8 * baseArea) / 3, l = 5 * k, h = 4 * k;
    const volume = (baseArea * h) / 3;
    const answer = `${volume} cm³`;
    return {
      authority: MEN_CP_010_EXAM_REALISM_SOURCES_V2_AUTHORITY, qlId, sourceId,
      stem: `The area of the square base of a right pyramid is 37.5% of its total surface area. If the base side is ${side} cm, find the volume of the pyramid.`,
      answer,
      options: options(targetIndex, answer, [`${baseArea * l / 3} cm³`, `${baseArea * h} cm³`, `${volume * 2} cm³`], ["USE_SLANT_AS_HEIGHT", "OMIT_ONE_THIRD", "DOUBLE_VOLUME"]),
      explanation: explanation(
        "Use the base-area share of TSA to recover lateral area and face slant height, then recover vertical height.",
        `Base area = ${baseArea} cm² and it is 37.5% = 3/8 of TSA.`,
        "TSA = B + 2al; h = √(l²-(a/2)²); V = a²h/3.",
        `TSA = (8/3)×${baseArea} = ${tsa} cm², so LSA = ${tsa}-${baseArea} = ${tsa-baseArea} cm². Hence 2×${side}×l = ${tsa-baseArea}, giving l = ${l} cm. Then h = √(${l}²-${side/2}²) = ${h} cm, and V = ${baseArea}×${h}/3 = ${volume} cm³.`,
        answer,
        "Convert the percentage to a fraction first: 37.5% = 3/8.",
        ["TSA includes the square base once.", "Volume requires vertical height, not face slant height."],
      ),
      verification: { valid: Math.abs(baseArea / tsa - 0.375) < 1e-12, method: "TSA share -> LSA -> slant -> vertical height -> volume" },
    };
  }

  if (qlId === "MEN-002-QL-128") {
    const [halfSide, h0, l0] = pick(`${seed}:triple`, [[3,4,5],[5,12,13],[8,15,17]] as const);
    const scale = int(`${seed}:scale`, 1, 3);
    const side = 2 * halfSide * scale, h = h0 * scale, l = l0 * scale;
    const askTsa = hash(`${seed}:tsa`) % 2 === 0;
    const lsa = 2 * side * l, value = askTsa ? lsa + side * side : lsa;
    const answer = `${value} cm²`;
    return {
      authority: MEN_CP_010_EXAM_REALISM_SOURCES_V2_AUTHORITY, qlId, sourceId,
      stem: `A right square pyramid has base side ${side} cm and vertical height ${h} cm. Find its ${askTsa ? "total" : "lateral"} surface area.`,
      answer,
      options: options(targetIndex, answer, [`${2*side*h + (askTsa ? side*side : 0)} cm²`, `${lsa + (askTsa ? 0 : side*side)} cm²`, `${value*2} cm²`], ["USE_VERTICAL_AS_SLANT", "WRONG_BASE_EXPOSURE", "DOUBLE_AREA"]),
      explanation: explanation(
        "Surface area needs the face slant height, which must first be recovered from vertical height and half the base side.",
        `Base side = ${side} cm, so half-side = ${side/2} cm; vertical height = ${h} cm.`,
        `${askTsa ? "TSA = a² + 2al" : "LSA = 2al"}, with l = √(h²+(a/2)²).`,
        `l = √(${h}²+${side/2}²) = ${l} cm. ${askTsa ? `TSA = ${side}² + 2×${side}×${l}` : `LSA = 2×${side}×${l}`} = ${value} cm².`,
        answer,
        "Derive slant height once, then use it in all four triangular faces.",
        ["Vertical height is not the triangular-face altitude.", askTsa ? "Include the square base exactly once for TSA." : "Do not add the base for LSA."],
      ),
      verification: { valid: l*l === h*h + (side/2)*(side/2), method: "derive face slant then square-pyramid area" },
    };
  }

  if (qlId === "MEN-002-QL-129") {
    const [R0,r0,h0,baseV] = pick(`${seed}:pattern`, [[5,3,21,1078],[5,2,14,572],[5,4,21,1342]] as const);
    const scale = int(`${seed}:scale`, 1, 2);
    const R=R0*scale, r=r0*scale, h=h0*scale, volume=baseV*scale*scale*scale;
    const answer = `${volume} cm³`;
    return {
      authority: MEN_CP_010_EXAM_REALISM_SOURCES_V2_AUTHORITY, qlId, sourceId,
      stem: `A conical frustum has larger radius ${R} cm, smaller radius ${r} cm and vertical height ${h} cm. Using π = 22/7, find its volume.`,
      answer,
      options: options(targetIndex, answer, [`${Math.round((22/7)*h*(R*R+r*r)/3)} cm³`, `${Math.round((22/7)*h*(R-r)*(R-r)/3)} cm³`, `${volume*3} cm³`], ["OMIT_MIXED_TERM", "USE_RADIUS_DIFFERENCE", "OMIT_ONE_THIRD"]),
      explanation: explanation(
        "Use the full frustum-volume expression and retain the mixed Rr term.",
        `R = ${R} cm, r = ${r} cm, h = ${h} cm and π = 22/7.`,
        "V = πh(R²+Rr+r²)/3.",
        `V = (22/7)×${h}×(${R}²+${R}×${r}+${r}²)/3 = ${volume} cm³.`,
        answer,
        "Combine R²+Rr+r² before multiplying; these states are constructed for clean SSC-style arithmetic.",
        ["Do not omit the Rr term.", "Do not replace R and r by their difference in the volume formula."],
      ),
      verification: { valid: Math.abs((22/7)*h*(R*R+R*r+r*r)/3-volume)<1e-9, method: "direct frustum volume with π=22/7" },
    };
  }

  if (qlId === "MEN-002-QL-130") {
    const scale = int(`${seed}:scale`, 1, 3);
    const R=7*scale, r=3*scale, l=5*scale, coef=(R+r)*l;
    const answer = `${coef}π cm²`;
    return {
      authority: MEN_CP_010_EXAM_REALISM_SOURCES_V2_AUTHORITY, qlId, sourceId,
      stem: `A lampshade is shaped like a conical frustum with radii ${R} cm and ${r} cm and slant height ${l} cm. It is open at both circular ends. Find the area of sheet required, in terms of π.`,
      answer,
      options: options(targetIndex, answer, [`${(R-r)*l}π cm²`, `${R*l}π cm²`, `${coef+R*R+r*r}π cm²`], ["USE_RADIUS_DIFFERENCE", "USE_OUTER_RADIUS_ONLY", "ADD_OPEN_ENDS"]),
      explanation: explanation(
        "An open-ended lampshade needs only the curved surface of the frustum.",
        `R = ${R} cm, r = ${r} cm and slant height l = ${l} cm.`,
        "CSA = π(R+r)l.",
        `CSA = π×(${R}+${r})×${l} = ${coef}π cm².`,
        answer,
        "Because both ends are open, do not add either circular base.",
        ["Use R+r, not R-r, in frustum CSA.", "Do not add end-disc areas for an open lampshade."],
      ),
      verification: { valid: true, method: "open frustum curved sheet area" },
    };
  }

  if (qlId === "MEN-002-QL-131") {
    const k = int(`${seed}:k`, 1, 3);
    const A=18*k, H=18*k, a=6*k, topH=6*k, frustumH=H-topH;
    const full=A*A*H/3, top=a*a*topH/3, volume=full-top;
    const answer = `${volume} cm³`;
    return {
      authority: MEN_CP_010_EXAM_REALISM_SOURCES_V2_AUTHORITY, qlId, sourceId,
      stem: `A right square pyramid of base side ${A} cm and height ${H} cm is cut by a plane parallel to its base. The removed smaller pyramid has base side ${a} cm. Find the volume of the remaining frustum.`,
      answer,
      options: options(targetIndex, answer, [`${full} cm³`, `${top} cm³`, `${A*A*frustumH/3} cm³`], ["USE_FULL_PYRAMID", "USE_REMOVED_PYRAMID", "IGNORE_TOP_BASE_SIMILARITY"]),
      explanation: explanation(
        "Use similarity to recover the removed height, then subtract the small pyramid volume from the full pyramid volume.",
        `Corresponding base sides are ${A}:${a} = 3:1, so heights are also 3:1.`,
        "Vfrustum = Vfull pyramid − Vremoved pyramid.",
        `Removed height = ${H}/3 = ${topH} cm. Full volume = ${A}²×${H}/3 = ${full} cm³; removed volume = ${a}²×${topH}/3 = ${top} cm³. Therefore frustum volume = ${full}-${top} = ${volume} cm³.`,
        answer,
        "A parallel cut creates similar pyramids, so corresponding lengths use the same ratio.",
        ["Do not subtract heights and keep the full base area.", "Volume subtraction must use the smaller pyramid's own base and height."],
      ),
      verification: { valid: A/a === H/topH, method: "similar cut then full-minus-removed pyramid volume" },
    };
  }

  if (qlId === "MEN-002-QL-136") {
    const n = pick(`${seed}:n`, [2,3,4] as const);
    const lower = n*n*n-1;
    const answer = `${lower}:1`;
    return {
      authority: MEN_CP_010_EXAM_REALISM_SOURCES_V2_AUTHORITY, qlId, sourceId,
      stem: `A pyramid is cut by a plane parallel to its base so that the height of the small pyramid above the cut is 1/${n} of the original height. Find the ratio of the volume of the lower frustum to the volume of the small top pyramid.`,
      answer,
      options: options(targetIndex, answer, [`${n-1}:1`, `${n*n-1}:1`, `1:${lower}`], ["USE_LINEAR_RATIO", "USE_AREA_RATIO", "REVERSE_RATIO"]),
      explanation: explanation(
        "The top pyramid is similar to the whole pyramid, so its volume fraction is the cube of the linear fraction.",
        `Top-to-whole linear ratio = 1:${n}.`,
        "Vtop:Vwhole = 1:n³; Vfrustum = Vwhole−Vtop.",
        `Vtop:Vwhole = 1:${n*n*n}. Hence Vfrustum:Vtop = (${n*n*n}-1):1 = ${answer}.`,
        answer,
        "For similar solids, cube the height ratio before taking the complement.",
        ["Do not use the linear ratio directly for volumes.", "The requested first term is the lower frustum, not the top pyramid."],
      ),
      verification: { valid: lower+1===n*n*n, method: "similar-pyramid cube ratio followed by complement" },
    };
  }

  if (qlId === "MEN-002-QL-141") {
    const scale = int(`${seed}:scale`, 1, 3);
    const R=15*scale, r=5*scale, fh=12*scale, fullH=18*scale;
    const answer = `${fullH} cm`;
    return {
      authority: MEN_CP_010_EXAM_REALISM_SOURCES_V2_AUTHORITY, qlId, sourceId,
      stem: `A conical frustum has larger radius ${R} cm, smaller radius ${r} cm and vertical height ${fh} cm. It was formed by cutting a smaller cone from a complete cone. Find the height of the complete cone.`,
      answer,
      options: options(targetIndex, answer, [`${fh} cm`, `${6*scale} cm`, `${36*scale} cm`], ["USE_FRUSTUM_HEIGHT", "USE_REMOVED_HEIGHT", "DOUBLE_FULL_HEIGHT"]),
      explanation: explanation(
        "The removed cone and the complete cone are similar, so radius ratio equals height ratio.",
        `R:r = ${R}:${r} = 3:1, and frustum height = ${fh} cm.`,
        "r/R = top height/full height and full height − top height = frustum height.",
        `Let full height be H. Then top height = H/3, so H−H/3 = ${fh}. Thus 2H/3 = ${fh}, giving H = ${fullH} cm.`,
        answer,
        "Express the removed height as a fraction of full height before subtracting.",
        ["The frustum height is not the complete cone height.", "Match smaller radius with the removed smaller cone."],
      ),
      verification: { valid: R*(fullH-fh)===r*fullH, method: "cone similarity reconstructs full height" },
    };
  }

  if (qlId === "MEN-002-QL-143") {
    const [R,r,h] = pick(`${seed}:bucket`, [[14,7,30],[14,7,24],[21,14,10],[14,7,18]] as const);
    const litres = (22/7)*h*(R*R+R*r+r*r)/3/1000;
    const answer = `${tidy(litres)} litres`;
    return {
      authority: MEN_CP_010_EXAM_REALISM_SOURCES_V2_AUTHORITY, qlId, sourceId,
      stem: `A bucket is shaped like a conical frustum with top radius ${R} cm, bottom radius ${r} cm and vertical height ${h} cm. Using π = 22/7, find its capacity in litres.`,
      answer,
      options: options(targetIndex, answer, [`${tidy(litres*1000)} litres`, `${tidy(litres/10)} litres`, `${tidy(litres*3)} litres`], ["MISS_CM3_TO_LITRE", "WRONG_CONVERSION", "OMIT_ONE_THIRD"]),
      explanation: explanation(
        "Find frustum volume in cm³, then divide by 1000 to convert to litres.",
        `R = ${R} cm, r = ${r} cm, h = ${h} cm and π = 22/7.`,
        "V = πh(R²+Rr+r²)/3; 1000 cm³ = 1 litre.",
        `V = (22/7)×${h}×(${R}²+${R}×${r}+${r}²)/3 = ${tidy(litres*1000)} cm³. Capacity = ${tidy(litres*1000)}/1000 = ${answer}.`,
        answer,
        "Keep the volume in cm³ until the final conversion step.",
        ["Do not report cubic centimetres as litres.", "Do not omit the mixed Rr term."],
      ),
      verification: { valid: litres>1 && litres<30, method: "frustum volume with realistic bucket dimensions and litre conversion" },
    };
  }

  if (qlId === "MEN-002-QL-145") {
    const pattern = pick(`${seed}:pattern`, [
      [-10,20,-2.8],
      [10,-10,8.9],
      [20,-20,15.2],
      [-20,25,-20],
    ] as const);
    const [sidePct,heightPct,change] = pattern;
    const sideFactor=1+sidePct/100, heightFactor=1+heightPct/100;
    const answer = change < 0 ? `${Math.abs(change)}% decrease` : `${change}% increase`;
    return {
      authority: MEN_CP_010_EXAM_REALISM_SOURCES_V2_AUTHORITY, qlId, sourceId,
      stem: `The side of the square base of a right pyramid is ${sidePct>=0?"increased":"decreased"} by ${Math.abs(sidePct)}% while its vertical height is ${heightPct>=0?"increased":"decreased"} by ${Math.abs(heightPct)}%. Find the percentage change in its volume.`,
      answer,
      options: options(targetIndex, answer, [`${Math.abs(sidePct+heightPct)}% ${sidePct+heightPct>=0?"increase":"decrease"}`, `${Math.abs((sideFactor*heightFactor-1)*100).toFixed(1)}% increase`, `${Math.abs(sidePct*2+heightPct)}% increase`], ["ADD_PERCENTAGES", "TREAT_BASE_SIDE_ONCE", "LINEARISE_SQUARE_EFFECT"]),
      explanation: explanation(
        "For a square-base pyramid V ∝ a²h, so the base-side factor must be squared and the height factor used once.",
        `Base-side factor = ${tidy(sideFactor)}, height factor = ${tidy(heightFactor)}.`,
        "New volume factor = (side factor)² × (height factor).",
        `New volume factor = ${tidy(sideFactor)}²×${tidy(heightFactor)} = ${tidy(sideFactor*sideFactor*heightFactor)}. Therefore the volume shows a ${answer}.`,
        answer,
        "Apply percentage changes multiplicatively; the square base makes the side change count twice.",
        ["Do not simply add the percentage changes.", "Do not forget that base area depends on the square of the side."],
      ),
      verification: { valid: Math.abs((sideFactor*sideFactor*heightFactor-1)*100-change)<1e-9, method: "independent base-side and height scaling in V∝a²h" },
    };
  }

  return null;
}
