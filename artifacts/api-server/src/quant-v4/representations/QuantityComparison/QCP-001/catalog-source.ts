import {
  rational,
  addRational,
  subtractRational,
  multiplyRational,
  divideRational,
  formatRational,
  type Rational,
} from "../../../shared/algebra/rational";
import { solveQuadraticEquation } from "../../../shared/algebra/quadratic";
import { combinationCount } from "../../../shared/counting";
import { canonicalAnswer } from "../../../topics/Arithmetic/subtopics/Interest/INT-001/cp003-math-authority";
import { solveTmwCp003 } from "../../../topics/Arithmetic/subtopics/TimeAndWork/TMW-001/foundation/cp003-solver";
import { TMW_CP003_REGISTRY } from "../../../topics/Arithmetic/subtopics/TimeAndWork/TMW-001/foundation/cp003-registry";
import { rational as workRat } from "../../../topics/Arithmetic/subtopics/TimeAndWork/TMW-001/foundation/rational";
import { MEN_001_CP002_SOLVE_MODE_REGISTRY } from "../../../topics/AdvancedMathematics/subtopics/Mensuration/MEN-001/solve-mode-registry.cp002";
import { solveTsdCp009 } from "../../../topics/Arithmetic/subtopics/TimeSpeedDistance/TSD-002/cp009/executable-solver";
import {
  catalogRootCount,
  validateCatalogState,
  type QcpCatalogState,
} from "./catalog-schema";
import { catalogPrompt } from "./catalog-display";
import type { Qcp001Operand } from "./types";

// These bounded compositions reuse shared exact authorities and existing topic
// solvers. Topic names in the ledger alone do not assert solver calls.
type E = { r: Rational; work: string };
const n = (a: number, b = 1): E => ({
  r: rational(a, b),
  work: b === 1 ? String(a) : `(${a}/${b})`,
});
const op = (
  a: E,
  b: E,
  symbol: string,
  solve: (a: Rational, b: Rational) => Rational,
): E => ({ r: solve(a.r, b.r), work: `(${a.work} ${symbol} ${b.work})` });
const add = (a: E, b: E) => op(a, b, "+", addRational);
const sub = (a: E, b: E) => op(a, b, "−", subtractRational);
const mul = (a: E, b: E) => op(a, b, "×", multiplyRational);
const div = (a: E, b: E) => op(a, b, "÷", divideRational);
function choose(total: number, count: number): E {
  return {
    r: rational(combinationCount(total, count)),
    work: `C(${total},${count})`,
  };
}
function roots(a: number, b: number, c: number): Rational[] {
  const result = solveQuadraticEquation({
    a: rational(a),
    b: rational(b),
    c: rational(c),
  });
  if (result.kind !== "TWO_RATIONAL_ROOTS")
    throw Error("Catalogue rational substitution failed");
  return [...result.roots].sort((x, y) =>
    Number(x.numerator * y.denominator - y.numerator * x.denominator),
  );
}
export function catalogResult(s: QcpCatalogState): {
  value: number;
  text: string;
  working: string;
} {
  validateCatalogState(s);
  const k = s.scale,
    left = s.quantity === "I";
  let e: E;
  switch (s.pattern) {
    case "BA24-01":
      e = left
        ? div(add(n(54 * k, 9 * k), n(40 * k, 10 * k)), n(2))
        : sub(n(45 * k, 9 * k), n(1));
      break;
    case "BA24-02":
      e = left
        ? mul(sub(n(12 * k), n(5 * k)), n(7))
        : div(mul(n(3 * k), sub(n(1), n(6, 13))), sub(n(6, 13), n(3, 7)));
      break;
    case "BA24-03":
      if (left) e = div(choose(5 * k, 2), choose(8 * k, 2));
      else
        e = {
          r: roots(98, -147, 40)[s.rootIndex]!,
          work: "(7x − 8)(14x − 5) = 0 ⇒ x ∈ {5/14, 8/7}",
        };
      break;
    case "BA24-04": {
      const unit = div(n(88 * k), n(2 * 11));
      e = left
        ? mul(n(24 * k), n(24 * k))
        : mul(mul(n(6), unit), mul(n(5), unit));
      break;
    }
    case "BA24-06":
      e = mul(n(50000 * k), left ? n(120, 100) : n(350, 300));
      break;
    case "BA24-10": {
      const colours = [6 * k, 5 * k, 3 * k, 6 * k];
      let favourable = n(0);
      if (left)
        favourable = add(choose(colours[1]!, 3), choose(colours[3]!, 3));
      else
        for (let a = 0; a < 4; a++)
          for (let b = a + 1; b < 4; b++)
            for (let c = b + 1; c < 4; c++)
              favourable = add(
                favourable,
                mul(mul(n(colours[a]!), n(colours[b]!)), n(colours[c]!)),
              );
      e = div(favourable, choose(20 * k, 3));
      break;
    }
    case "BA24-11": {
      const m = 100 - 25 * k,
        current = n(m, 2),
        body = sub(n(100), current);
      e = mul(
        div(left ? current : sub(body, current), left ? n(100) : body),
        n(100),
      );
      break;
    }
    case "BA24-12":
      e = left
        ? div(div(n(8505 * k, 10), n(105, 100)), n(90, 100))
        : n(900 * k);
      break;
    case "BA24-13": {
      const d = left ? 3 : 2;
      const r = left
        ? roots(3, 3 * k, -60 * k * k)
        : roots(2, 14 * k, 20 * k * k);
      const coefficient = r[s.rootIndex]!;
      const text = `${formatRational(coefficient)}√${d}`;
      return {
        value:
          (Number(coefficient.numerator) / Number(coefficient.denominator)) *
          Math.sqrt(d),
        text,
        working: `${left ? `x² + ${k}√3x − ${60 * k * k}` : `y² + ${7 * k}√2y + ${20 * k * k}`} = 0; ${left ? "x" : "y"} = √${d}z ⇒ ${d}z² + ${left ? 3 * k : 14 * k}z ${left ? "− " + 60 * k * k : "+ " + 20 * k * k} = 0 ⇒ ${left ? "x" : "y"} = ${text}`,
      };
    }
    case "BA24-14":
      e = mul(n(10000 * k * (left ? 4 : 5)), left ? n(70, 100) : n(55, 100));
      break;
    case "BA24-15": {
      const entry = TMW_CP003_REGISTRY.find(
        (e) =>
          e.solveMode ===
          "findIndividualTimeFromEfficiencyRatioAndCombinedTime",
      )!;
      const r = solveTmwCp003(entry, {
        timeUnit: "day",
        efficiencyA: workRat(6),
        efficiencyB: workRat(5),
        combinedTime: workRat(30 * k),
        targetAgentIndex: left ? 0 : 1,
        context: {
          agentNoun: "worker",
          jobPhrase: "the work",
          outputNoun: "units",
          outputVerb: "complete",
        },
      }).answer;
      const alone = {
        r: rational(r.numerator, r.denominator),
        work: `${30 * k} × 11 ÷ ${left ? 6 : 5}`,
      };
      e = div(
        mul(alone, left ? n(2, 5) : n(1, 2)),
        left ? n(25, 100) : n(40, 100),
      );
      break;
    }
    case "BA24-16": {
      const current = div(sub(n(1050 * k, 5), n(1050 * k, 7)), n(40 * k)),
        body = mul(n(6), current);
      e = div(
        n((left ? 1050 : 1500) * k),
        left ? sub(body, current) : add(body, mul(current, n(120, 100))),
      );
      break;
    }
    case "BA24-18": {
      const milk = n(15 * k, 2),
        water = n(5 * k);
      const numerator = left ? add(milk, n(3 * k, 2)) : milk;
      e = mul(
        div(numerator, left ? add(numerator, water) : add(milk, n(7 * k, 2))),
        n(100),
      );
      break;
    }
    case "BA24-19": {
      const stream = n(4, 2),
        body = mul(n(3), stream),
        down = add(body, stream),
        up = sub(body, stream);
      e = left
        ? div(
            sub(n(35 * k, 2), div(n(20 * k), down)),
            add(div(n(1), up), div(n(1), down)),
          )
        : mul(down, n(21 * k, 4));
      break;
    }
    case "BA24-20": {
      const train = n(1300 * k, 130 * k);
      e = left ? train : add(train, n(500 * k, 500 * k));
      break;
    }
    case "BA22-01":
      e = left ? mul(div(n(234 * k), n(375, 1000)), n(3, 13)) : n(144 * k);
      break;
    case "BA22-02":
      e = left
        ? {
            r: canonicalAnswer({
              qlId: "INT-QL-056",
              compoundInterest: rational(7040 * k),
              ratePercent: rational(20),
              years: 2,
            }),
            work: `${7040 * k} ÷ ((1 + 20/100)² − 1)`,
          }
        : n(20000 * k);
      break;
    case "BA22-03":
      e = left
        ? mul(sub(mul(n(120 + 5 * k, 100), n(125 + 5 * k, 100)), n(1)), n(100))
        : n(125, 2);
      break;
    case "BA22-04": {
      if (!left) {
        e = n(6);
        break;
      }
      const pink = 4 + k,
        hiddenTotal = 3 * pink - 3;
      const probability = div(choose(pink, 2), choose(hiddenTotal, 2));
      const product = div(n(pink * (pink - 1)), probability);
      const candidates = roots(
        1,
        -1,
        -Number(product.r.numerator / product.r.denominator),
      );
      const total = candidates.find((x) => x.numerator > 0n)!;
      e = {
        r: subtractRational(total, rational(pink)),
        work: `p = ${formatRational(probability.r)}; N(N − 1) = ${formatRational(product.r)} ⇒ N = ${formatRational(total)} ⇒ blue = N − ${pink}`,
      };
      break;
    }
    case "BA22-05":
      e = left ? sub(mul(n(6 * k, 3), n(14)), n(10 * k)) : n(20 * k);
      break;
  }
  if (s.pattern === "BA24-04") {
    const mode = left ? "findSquareAreaFromSide" : "findRectangleArea";
    const result = MEN_001_CP002_SOLVE_MODE_REGISTRY[mode].solve({
      packageId: "MEN-001",
      canonicalProblemId: "MEN-CP-002",
      questionId: "QCP-CATALOG",
      questionLanguageId: "QCP-CATALOG",
      language: "en",
      difficulty: "Medium",
      taskKind: "quadrilateralMeasurementApplication",
      solveMode: mode,
      answerDimension: "AREA",
      unitPolicy: "SQUARE_CENTIMETRES",
      seed: "QCP-CATALOG",
      renderVariables: {},
      values: { side: 24 * k, length: 24 * k, breadth: 20 * k },
    });
    if (result.exactAnswer.kind !== "INTEGER")
      throw Error("Unexpected area authority output");
    e.r = rational(result.exactAnswer.value);
  }
  if (s.pattern === "BA24-01" && left) {
    const speed = solveTsdCp009({
      authorityKey: "mediumComponentsFromAssistedOpposedSpeeds",
      assistedGroundSpeed: rational(54 * k * 5, 9 * k * 18),
      opposedGroundSpeed: rational(40 * k * 5, 10 * k * 18),
      target: "BODY_SPEED",
    }).value;
    e.r = divideRational(speed, rational(5, 18));
  }
  if (s.pattern === "BA24-16") {
    const answer = solveTsdCp009({
      authorityKey: "mediumLegTravelState",
      bodyRelativeSpeed: rational(9 * 5, 18),
      mediumSpeed: left ? rational(3 * 5, 2 * 18) : rational(9 * 5, 5 * 18),
      direction: left ? "OPPOSED" : "ASSISTED",
      target: "TIME",
      distance: rational((left ? 1050 : 1500) * k * 1000),
    }).value;
    e.r = divideRational(answer, rational(3600));
  }
  const text = formatRational(e.r);
  return {
    value: Number(e.r.numerator) / Number(e.r.denominator),
    text,
    working: `${e.work} = ${text}`,
  };
}
export function buildCatalogOperand(
  pattern: QcpCatalogState["pattern"],
  scale: number,
  quantity: "I" | "II",
): Qcp001Operand {
  const states = Array.from(
    { length: catalogRootCount({ pattern, quantity }) },
    (_, rootIndex) => ({
      kind: "SOURCE_CATALOG" as const,
      pattern,
      scale,
      quantity,
      rootIndex: rootIndex as 0 | 1,
    }),
  );
  states.forEach(validateCatalogState);
  return {
    label: quantity === "I" ? "Quantity I" : "Quantity II",
    sourceFamily: "SOURCE_CATALOG",
    sourcePackageId: "QCP-001",
    sourceSolveMode: "reviewedSourcePattern",
    states,
    values: states.map((s) => catalogResult(s).value),
    prompt: catalogPrompt(states[0]!, "en"),
  };
}
