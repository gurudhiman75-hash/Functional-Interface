import type { MenCp010PermanentEnglishQuestion } from "./runtime-v1";

function tokens(stem: string) {
  return stem.match(/₹?\d+(?:\/\d+)?(?:\.\d+)?(?:π)?(?::\d+(?:\/\d+)?)?/g) ?? [];
}

function formulaAndWork(sourceId: string, x: readonly string[], answer: string) {
  const n = (i: number) => x[i] ?? "?";
  switch (sourceId) {
    case "MEN-CP010-PROT-SQUARE-PYRAMID-VOLUME":
      return ["V = a²h/3", `V = ${n(0)}² × ${n(1)} / 3 = ${answer}.`];
    case "MEN-CP010-PROT-RECTANGULAR-PYRAMID-VOLUME":
      return ["V = Lbh/3", `V = ${n(0)} × ${n(1)} × ${n(2)} / 3 = ${answer}.`];
    case "MEN-CP010-PROT-TRIANGULAR-PYRAMID-VOLUME":
      return ["V = Bh/3", `V = ${n(0)} × ${n(1)} / 3 = ${answer}.`];
    case "MEN-CP010-PROT-SQUARE-PYRAMID-HEIGHT-FROM-VOLUME":
      return ["h = 3V/a²", `h = 3 × (${n(1)}) / ${n(0)}² = ${answer}.`];
    case "MEN-CP010-PROT-SQUARE-PYRAMID-SLANT-HEIGHT":
      return ["l = √[h² + (a/2)²]", `l = √[${n(1)}² + (${n(0)}/2)²] = ${answer}.`];
    case "MEN-CP010-PROT-SQUARE-PYRAMID-VERTICAL-HEIGHT":
      return ["h = √[l² - (a/2)²]", `h = √[${n(1)}² - (${n(0)}/2)²] = ${answer}.`];
    case "MEN-CP010-PROT-SQUARE-PYRAMID-LSA":
      return ["LSA = 2al", `LSA = 2 × ${n(0)} × ${n(1)} = ${answer}.`];
    case "MEN-CP010-PROT-SQUARE-PYRAMID-TSA":
      return ["TSA = a² + 2al", `TSA = ${n(0)}² + 2 × ${n(0)} × ${n(1)} = ${answer}.`];
    case "MEN-CP010-PROT-CONICAL-FRUSTUM-SLANT-HEIGHT":
      return ["l = √[h² + (R-r)²]", `l = √[${n(2)}² + (${n(0)}-${n(1)})²] = ${answer}.`];
    case "MEN-CP010-PROT-CONICAL-FRUSTUM-VOLUME":
      return ["V = πh(R²+Rr+r²)/3", `V = π × ${n(2)} × (${n(0)}² + ${n(0)}×${n(1)} + ${n(1)}²) / 3 = ${answer}.`];
    case "MEN-CP010-PROT-CONICAL-FRUSTUM-CSA":
      return ["CSA = π(R+r)l", `CSA = π × (${n(0)}+${n(1)}) × ${n(2)} = ${answer}.`];
    case "MEN-CP010-PROT-CONICAL-FRUSTUM-TSA":
      return ["TSA = π[(R+r)l+R²+r²]", `TSA = π[(${n(0)}+${n(1)})×${n(2)} + ${n(0)}² + ${n(1)}²] = ${answer}.`];
    case "MEN-CP010-PROT-SQUARE-FRUSTUM-SLANT-HEIGHT":
      return ["l = √[h² + ((A-a)/2)²]", `l = √[${n(2)}² + ((${n(0)}-${n(1)})/2)²] = ${answer}.`];
    case "MEN-CP010-PROT-SQUARE-FRUSTUM-VOLUME":
      return ["V = h(A²+Aa+a²)/3", `V = ${n(2)} × (${n(0)}² + ${n(0)}×${n(1)} + ${n(1)}²) / 3 = ${answer}.`];
    case "MEN-CP010-PROT-SQUARE-FRUSTUM-LSA":
      return ["LSA = 2(A+a)l", `LSA = 2 × (${n(0)}+${n(1)}) × ${n(2)} = ${answer}.`];
    case "MEN-CP010-PROT-SQUARE-FRUSTUM-TSA":
      return ["TSA = 2(A+a)l + A² + a²", `TSA = 2 × (${n(0)}+${n(1)}) × ${n(2)} + ${n(0)}² + ${n(1)}² = ${answer}.`];

    case "CP010-D2-INV-SQUARE-PYRAMID-SIDE-FROM-VOLUME":
      return ["a = √(3V/h)", `a = √(3 × ${n(0)} / ${n(1)}) = ${answer}.`];
    case "CP010-D2-INV-RECT-PYRAMID-LENGTH-FROM-VOLUME":
      return ["L = 3V/(bh)", `L = 3 × ${n(0)} / (${n(1)} × ${n(2)}) = ${answer}.`];
    case "CP010-D2-INV-CONICAL-FRUSTUM-HEIGHT-FROM-VOLUME":
      return ["h = 3V/[π(R²+Rr+r²)]", `Cancel π, then h = 3 × ${n(0).replace("π", "")} / (${n(1)}² + ${n(1)}×${n(2)} + ${n(2)}²) = ${answer}.`];
    case "CP010-D2-INV-SQUARE-FRUSTUM-HEIGHT-FROM-VOLUME":
      return ["h = 3V/(A²+Aa+a²)", `h = 3 × ${n(0)} / (${n(1)}² + ${n(1)}×${n(2)} + ${n(2)}²) = ${answer}.`];
    case "CP010-D2-INV-CONICAL-FRUSTUM-OUTER-RADIUS":
      return ["R = r + √(l²-h²)", `R = ${n(0)} + √(${n(2)}²-${n(1)}²) = ${answer}.`];
    case "CP010-D2-INV-SQUARE-FRUSTUM-LOWER-SIDE":
      return ["A = a + 2√(l²-h²)", `A = ${n(0)} + 2√(${n(2)}²-${n(1)}²) = ${answer}.`];
    case "CP010-D2-RATIO-VOLUME-FROM-LINEAR":
      return ["Volume ratio = (linear ratio)³", `(${n(0)})³ = ${answer}.`];
    case "CP010-D2-RATIO-AREA-FROM-LINEAR":
      return ["Surface-area ratio = (linear ratio)²", `(${n(0)})² = ${answer}.`];
    case "CP010-D2-RATIO-LINEAR-FROM-VOLUME":
      return ["Linear ratio = cube root of the volume ratio", `∛(${n(0)}) = ${answer}.`];
    case "CP010-D2-RATIO-LINEAR-FROM-AREA":
      return ["Linear ratio = square root of the surface-area ratio", `√(${n(0)}) = ${answer}.`];
    case "CP010-D2-RATIO-PYRAMID-TO-PRISM":
      return ["For the same base and height, Vpyramid = Bh/3 and Vprism = Bh", `So Vpyramid : Vprism = (Bh/3):Bh = ${answer}.`];
    case "CP010-D2-SIMILAR-FULL-HEIGHT-FROM-FRUSTUM":
      return ["H = R·h/(R-r)", `H = ${n(0)} × ${n(2)} / (${n(0)}-${n(1)}) = ${answer}.`];
    case "CP010-D2-SIMILAR-REMOVED-TOP-HEIGHT":
      return ["t = r·h/(R-r)", `t = ${n(1)} × ${n(2)} / (${n(0)}-${n(1)}) = ${answer}.`];
    case "CP010-D2-SIMILAR-CROSS-SECTION-SIDE":
      return ["section side/base side = apex distance/full height", `Section side = ${n(0)} × ${n(2)} / ${n(1)} = ${answer}.`];
    case "CP010-D2-APP-BUCKET-CAPACITY-LITRES":
      return ["V = πh(R²+Rr+r²)/3 and 1000 cm³ = 1 litre", `V = (22/7) × ${n(2)} × (${n(0)}²+${n(0)}×${n(1)}+${n(1)}²) / 3 cm³; dividing by 1000 gives ${answer}.`];
    case "CP010-D2-APP-SURFACE-COST":
      return ["Cost = lateral area × rate, with LSA = 2al", `Cost = 2 × ${n(0)} × ${n(1)} × ${n(2)} = ${answer}.`];
    case "CP010-D2-SCALE-VOLUME-PERCENT-CHANGE":
      return ["Volume scales as k³", `k = ${n(0)}/100, so percentage change = (k³-1)×100 = ${answer}.`];
    case "CP010-D2-SCALE-AREA-PERCENT-CHANGE":
      return ["Surface area scales as k²", `k = ${n(0)}/100, so percentage change = (k²-1)×100 = ${answer}.`];

    case "V3-REGULAR-PYRAMID-LSA":
      return ["LSA = Pl/2", `LSA = ${n(0)} × ${n(1)} / 2 = ${answer}.`];
    case "V3-REGULAR-PYRAMID-TSA":
      return ["TSA = B + Pl/2", `TSA = ${n(0)} + ${n(1)} × ${n(2)} / 2 = ${answer}.`];
    case "V3-REGULAR-FRUSTUM-LSA":
      return ["LSA = (P₁+P₂)l/2", `LSA = (${n(0)}+${n(1)}) × ${n(2)} / 2 = ${answer}.`];
    case "V3-REGULAR-FRUSTUM-VOLUME":
      return ["V = h(A₁+√(A₁A₂)+A₂)/3", `V = ${n(2)} × (${n(0)} + √(${n(0)}×${n(1)}) + ${n(1)}) / 3 = ${answer}.`];
    case "V3-PYRAMID-LSA-INVERSE-SLANT":
      return ["l = 2·LSA/P; for a square base P=4a", `l = 2 × ${n(1)} / (4×${n(0)}) = ${answer}.`];
    case "V3-PYRAMID-TSA-INVERSE-SLANT":
      return ["l = 2(TSA-B)/P; for a square base B=a² and P=4a", `l = 2 × (${n(1)}-${n(0)}²) / (4×${n(0)}) = ${answer}.`];
    case "V3-CONICAL-FRUSTUM-CSA-INVERSE-SLANT":
      return ["l = CSA/[π(R+r)]", `Cancel π, then l = ${n(2).replace("π", "")} / (${n(0)}+${n(1)}) = ${answer}.`];
    case "V3-CONICAL-FRUSTUM-TSA-INVERSE-SLANT":
      return ["l = [TSA/π - R²-r²]/(R+r)", `Cancel π, then l = [${n(2).replace("π", "")}-${n(0)}²-${n(1)}²] / (${n(0)}+${n(1)}) = ${answer}.`];
    case "V3-POLYGONAL-FRUSTUM-LSA-INVERSE-SLANT":
      return ["l = 2·LSA/(P₁+P₂)", `l = 2 × ${n(2)} / (${n(0)}+${n(1)}) = ${answer}.`];
    case "V3-POLYGONAL-FRUSTUM-TSA-INVERSE-SLANT":
      return ["l = 2(TSA-A₁-A₂)/(P₁+P₂)", `l = 2 × (${n(4)}-${n(2)}-${n(3)}) / (${n(0)}+${n(1)}) = ${answer}.`];
    case "V3-SURD-SLANT-REPRESENTATION":
      return ["l = √(h²+q²)", `l = √(${n(0)}²+${n(1)}²) = ${answer}.`];
    default:
      return ["Use the governing geometric relation for this family", `Substituting the stated values gives ${answer}.`];
  }
}

export function buildMenCp010WorkedExplanation(
  q: MenCp010PermanentEnglishQuestion,
  stem: string,
  answer: string,
): MenCp010PermanentEnglishQuestion["explanation"] {
  const x = tokens(stem);
  const [formula, work] = formulaAndWork(q.sourceId, x, answer);
  const given = x.length ? x.join(", ") : "the stated dimensions";
  return {
    keyRule: formula,
    steps: [
      {
        title: "Read the given values",
        body: `Use ${given}, keeping corresponding dimensions in the same order.`,
      },
      {
        title: "Choose the formula",
        body: formula,
      },
      {
        title: "Substitute and calculate",
        body: work,
      },
      {
        title: "Check the result",
        body: `The result is ${answer}; substituting it back into the same relation reproduces the stated measure or ratio.`,
      },
    ],
    shortcut: q.explanation.shortcut,
    traps: q.explanation.traps,
  };
}
