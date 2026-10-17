import { generateBns001Question, supportedGrammarMatches } from "./engine";
import {
  ADVANCED_PATTERNS,
  independentAdvancedMatches,
} from "./advanced-verifier";
import { BNS_MAINS_PATTERNS } from "./advanced-engine";
import {
  independentlyVerifyBns001Question,
  independentWrongTermRepairs,
  independentGrammarMatches,
} from "./independent-verifier";
function assert(c: unknown, m: string): asserts c {
  if (!c) throw Error(m);
}
export function auditAdvancedBns() {
  let generated = 0,
    localized = 0,
    mains = 0,
    negative = 0;
  const coverage: Record<
    string,
    { states: number; answers: number[]; positions: number[] }
  > = {};
  for (const patternKind of ADVANCED_PATTERNS)
    for (const taskKind of [
      "NEXT_TERM",
      "MISSING_TERM",
      "WRONG_TERM",
    ] as const) {
      const states = new Set<string>(),
        answers = new Set<number>(),
        positions = new Set<number>();
      for (let i = 0; i < 64; i++) {
        const input = {
          seed: `BNS-V3-${patternKind}-${taskKind}-${i}`,
          patternKind,
          taskKind,
        };
        const q = generateBns001Question(input);
      assert(supportedGrammarMatches(q.proof.fullSeries).includes(patternKind), "Exported grammar checker misses an implemented family.");
        assert(
          independentlyVerifyBns001Question(q).valid,
          `${patternKind}/${taskKind}/${i} verifier`,
        );
        assert(
          JSON.stringify(q) === JSON.stringify(generateBns001Question(input)),
          `${patternKind}/${taskKind}/${i} replay`,
        );
        assert(
          q.options.length === 5 && new Set(q.options).size === 5,
          "Choices must be distinct.",
        );
        assert(
          q.proof.canonicalNext === q.proof.fullSeries.at(-1),
          "Canonical continuation binding.",
        );
        assert(
          q.explanation.working.length >= 5 &&
            q.explanation.working.some((s) => s.includes("=")),
          "Calculative working missing.",
        );
        if (taskKind === "WRONG_TERM") {
          const repairs = independentWrongTermRepairs(
            q.visibleSeries.map(Number),
          );
          assert(repairs.length === 1, "Ambiguous repair");
          const forged = {
            ...q,
            proof: { ...q.proof, fullSeries: [999], canonicalNext: -1 },
          };
          assert(
            independentlyVerifyBns001Question(forged).valid,
            "Wrong-term verifier trusts proof arithmetic",
          );
        }
        const wrong = q.options.findIndex(
          (_, index) => index !== q.correctIndex,
        );
        const broken = { ...q, answer: q.options[wrong]!, correctIndex: wrong };
        assert(
          !independentlyVerifyBns001Question(broken).valid,
          "Wrong-answer tamper accepted",
        );
        negative++;
        for (const language of ["hi", "pa"] as const) {
          const n = generateBns001Question({ ...input, language });
          assert(
            n.answer === q.answer &&
              JSON.stringify(n.options) === JSON.stringify(q.options),
            "Native math drift",
          );
          assert(
            independentlyVerifyBns001Question(n).valid,
            "Native independent proof",
          );
          assert(!/[A-Za-z]/u.test(n.stem), "Native stem fallback");
          localized++;
        }
        if (i < 8 && BNS_MAINS_PATTERNS.includes(patternKind)) {
          const m = generateBns001Question({
            ...input,
            examProfile: "BANKING_MAINS",
          });
          assert(
            m.examProfile === "BANKING_MAINS" && m.difficulty === "Hard",
            "Mains profile bypass",
          );
          assert(independentlyVerifyBns001Question(m).valid, "Mains proof");
          mains++;
        }
        states.add(JSON.stringify(q.visibleSeries));
        answers.add(q.correctIndex);
        if (q.proof.hiddenIndex !== null) positions.add(q.proof.hiddenIndex);
        generated++;
      }
      assert(
        states.size >= 8,
        `${patternKind}/${taskKind}: only ${states.size} states`,
      );
      assert(
        answers.size === 5,
        `${patternKind}/${taskKind}: option-position coverage`,
      );
      if (taskKind !== "NEXT_TERM")
        assert(
          positions.size === (taskKind === "WRONG_TERM" ? 8 : 3),
          `${patternKind}/${taskKind}: gap/error position coverage ${[...positions]}`,
        );
      coverage[`${patternKind}:${taskKind}`] = {
        states: states.size,
        answers: [...answers].sort(),
        positions: [...positions].sort(),
      };
    }
  // Independently adjudicated publisher examples; prose/source text is not copied.
  const fixtures: [string, number[]][] = [
    ["QUARTIC_POLYNOMIAL_TERMS", [4, 45, 176, 475, 1044, 2009]],
    ["POWER_DIFFERENCE", [17, 17, 19, 31, 87, 327]],
    ["QUADRATIC_DIFFERENCE", [1, 22, 66, 135, 231, 356]],
    ["QUADRATIC_DIFFERENCE", [28, 66, 128, 220, 348, 518]],
    ["VARIABLE_MULTIPLY_SUBTRACT", [12, 22, 63, 248, 1235, 7404]],
    ["DESCENDING_CUBE_DIFFERENCE", [1634, 905, 562, 437, 410, 409]],
    ["VARIABLE_MULTIPLY_ADD", [5, 25, 129, 777, 5441, 43529]],
    ["FRACTIONAL_GEOMETRIC", [16, 40, 100, 250, 625, 1562.5]],
    ["CONSTANT_DIVISION", [18225, 6075, 2025, 675, 225, 75, 25]],
    ["CONSECUTIVE_PRIME_DIFFERENCE", [2194, 2175, 2152, 2123, 2092, 2055, 2014]],
    ["CONSECUTIVE_PRIME_DIFFERENCE", [15, 34, 57, 86, 117, 154]],
    ["VARIABLE_FRACTIONAL_MULTIPLIER", [2.5, 5, 12.5, 37.5, 131.25, 525]],
    ["PRIME_SECOND_DIFFERENCE", [5, 23, 43, 66, 94, 129]],
    ["ALTERNATING_MULTIPLY_DIVIDE", [12, 36, 6, 18, 3, 9, 1.5]],
    [
      "INTERLEAVED_PROGRESSIVE_DIFFERENCE",
      [4.5, 3, 12, 25.5, 27, 40.5, 49.5, 48],
    ],
    ["ODD_SQUARE_DIFFERENCE", [5555, 5506, 5425, 5304, 5135, 4910, 4621]],
    ["VARIABLE_MULTIPLY_ADD", [1, 3, 10, 36, 152, 770, 4632]],
    ["VARIABLE_FRACTIONAL_DIVISOR", [157.5, 45, 15, 6, 3, 2, 2]],
    ["CONSECUTIVE_CUBES", [216, 343, 512, 729, 1000, 1331]],
  ];
  for (const [pattern, series] of fixtures)
    assert(
      independentAdvancedMatches(series).includes(
        pattern as (typeof ADVANCED_PATTERNS)[number],
      ),
      `Source fixture ${pattern}`,
    );
  assert(
    independentGrammarMatches([6, 7, 9, 13, 21, 37, 69]).includes(
      "MULTIPLY_AND_ADD",
    ),
    "Geometric-difference/negative-addend fixture",
  );
  const selected = new Set<string>();
  const divisionRepairs = independentWrongTermRepairs([18225, 6075, 2025, 675, 220, 75, 25]);
  assert(divisionRepairs.length === 1 && divisionRepairs[0]!.index === 4 &&
    divisionRepairs[0]!.replacement === 225, "IBPS PO 2024 Q77 source repair");
  const primeRepairs = independentWrongTermRepairs([2194, 2175, 2152, 2123, 2092, 2054, 2014]);
  assert(primeRepairs.some((repair) => repair.index === 5 && repair.replacement === 2055 &&
    repair.pattern === "CONSECUTIVE_PRIME_DIFFERENCE"), "IBPS PO 2024 Q80 intended source repair");
  assert(primeRepairs.length > 1, "Retain the seven-term source ambiguity hold; do not certify unique repair.");
  for (let i = 0; i < 32; i++)
    selected.add(
      generateBns001Question({
        seed: `MAINS-selector-${i}`,
        examProfile: "BANKING_MAINS",
      }).patternKind,
    );
  assert(selected.size >= 5, "Mains selector breadth");
  return {
    status: "PASS_BNS_ADVANCED_V3",
    generated,
    localized,
    mains,
    negative,
    sourceFixtures: fixtures.length + 1,
    coverage,
    mainsSelectorFamilies: selected.size,
  };
}
