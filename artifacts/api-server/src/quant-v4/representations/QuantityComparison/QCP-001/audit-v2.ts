import {
  classifyQcp001Relation,
  generateQcp001Question,
  QCP_001_RELATION_CLASSES,
} from "./engine";
import { independentlyVerifyQcp001Question } from "./independent-verifier";
import type { Qcp001Question, Qcp001RelationClass } from "./types";
function assert(c: unknown, m: string): asserts c {
  if (!c) throw Error(m);
}
export function auditQcpV2() {
  const subsets: number[][] = [];
  for (let mask = 1; mask < 32; mask++)
    subsets.push([-2, -1, 0, 1, 2].filter((_, i) => !!(mask & (1 << i))));
  let oracleChecks = 0;
  for (const a of subsets)
    for (const b of subsets) {
      const signs = new Set(a.flatMap((x) => b.map((y) => Math.sign(x - y))));
      const expected: Qcp001RelationClass =
        signs.size === 1 && signs.has(1)
          ? "QUANTITY_I_GREATER"
          : signs.size === 1 && signs.has(-1)
            ? "QUANTITY_I_LESS"
            : signs.has(1) && signs.has(0) && !signs.has(-1)
              ? "QUANTITY_I_GREATER_OR_EQUAL"
              : signs.has(-1) && signs.has(0) && !signs.has(1)
                ? "QUANTITY_I_LESS_OR_EQUAL"
                : "EQUAL_OR_RELATION_CANNOT_BE_ESTABLISHED";
      assert(
        classifyQcp001Relation(a, b) === expected,
        "Cartesian relation oracle mismatch",
      );
      oracleChecks++;
    }
  for (const a of [[], [NaN], [Infinity]]) {
    let rejected = false;
    try {
      classifyQcp001Relation(a, [1]);
    } catch {
      rejected = true;
    }
    assert(rejected, "Invalid comparison domain accepted");
  }
  let english = 0,
    native = 0,
    replays = 0;
  const positions = new Map<string, Set<number>>(),
    surfaces = new Map<string, Set<string>>();
  for (const examProfile of ["BANKING_PRELIMS", "BANKING_MAINS"] as const)
    for (let i = 1; i <= 1200; i++) {
      const input = { seed: `QCP-V2:${i}`, examProfile },
        q = generateQcp001Question(input);
      assert(
        independentlyVerifyQcp001Question(q).valid,
        "English independent package proof",
      );
      assert(
        JSON.stringify(q) === JSON.stringify(generateQcp001Question(input)),
        "English deterministic replay",
      );
      replays++;
      const cell = `${examProfile}:${q.answerClass}`;
      if (!positions.has(cell)) positions.set(cell, new Set());
      positions.get(cell)!.add(q.correctIndex);
      const pair = `${examProfile}:${q.quantityI.sourceFamily}->${q.quantityII.sourceFamily}`;
      if (!surfaces.has(pair)) surfaces.set(pair, new Set());
      surfaces.get(pair)!.add(q.stem);
      assert(
        !("distractorAnalysis" in q.explanation),
        "Option-by-option diagnostics leaked into learner explanation",
      );
      if (
        q.answerEvidenceMode === "EXACT_EQUALITY" &&
        examProfile === "BANKING_MAINS"
      )
        assert(
          q.difficulty === "Medium",
          "Exact equality must not manufacture Mains complexity",
        );
      if (
        q.quantityI.sourceFamily === "PERCENTAGE" &&
        q.quantityII.sourceFamily === "PERCENTAGE" &&
        q.quantityI.states.length > 1 &&
        q.quantityII.states.length > 1
      )
        assert(
          q.quantityI.prompt.includes("M") && q.quantityII.prompt.includes("N"),
          "Independent percentages share a variable",
        );
      if (
        q.quantityI.sourceFamily === "RATIO" &&
        q.quantityII.sourceFamily === "RATIO"
      )
        assert(
          q.quantityI.prompt.includes("A:B") &&
            q.quantityII.prompt.includes("C:D"),
          "Independent ratios share variable names",
        );
      for (const language of ["hi", "pa"] as const) {
        const n = generateQcp001Question({ ...input, language });
        assert(
          independentlyVerifyQcp001Question(n).valid,
          "Native package proof",
        );
        assert(
          n.answerClass === q.answerClass &&
            n.correctIndex === q.correctIndex &&
            JSON.stringify(n.quantityI.values) ===
              JSON.stringify(q.quantityI.values) &&
            JSON.stringify(n.quantityII.values) ===
              JSON.stringify(q.quantityII.values),
          "Native mathematical drift",
        );
        assert(
          !/Quantity|where|selected|remainder|if|Possible|greater|smaller|relationship/u.test(
            n.stem + " " + n.direction + " " + JSON.stringify(n.explanation),
          ),
          "English fallback in native learner text",
        );
        if (i <= 80) {
          assert(
            JSON.stringify(n) ===
              JSON.stringify(generateQcp001Question({ ...input, language })),
            "Native replay",
          );
          replays++;
        }
        native++;
      }
      english++;
    }
  for (const [cell, set] of positions)
    assert(set.size === 5, `${cell}: correct answer position bias`);
  for (const [pair, set] of surfaces)
    assert(
      set.size >= 12,
      `${pair}: thin displayed-state variety (${set.size})`,
    );
  const q = generateQcp001Question({ seed: "QCP-V2:75" }),
    wrong = q.options.findIndex((_, i) => i !== q.correctIndex);
  const malformed: unknown[] = [
    {
      ...q,
      options: q.options.map((v, i) => (i === wrong ? "Unrelated choice" : v)),
    },
    { ...q, answer: "Forged answer" },
    { ...q, answerEvidenceMode: "EXACT_EQUALITY" },
    { ...q, optionCount: 4 },
    {
      ...q,
      optionMetadata: q.optionMetadata.map((o) => ({ ...o, isCorrect: true })),
    },
    { ...q, quantityI: { ...q.quantityI, states: [], values: [] } },
    { ...q, quantityI: { ...q.quantityI, sourcePackageId: "PCT-001" } },
    { ...q, quantityI: { ...q.quantityI, sourceSolveMode: "unknown" } },
    { ...q, quantityI: { ...q.quantityI, values: [NaN] } },
    {
      ...q,
      quantityI: { ...q.quantityI, states: [{ kind: "UNKNOWN" }], values: [0] },
    },
    {
      ...q,
      quantityI: {
        ...q.quantityI,
        states: [{ kind: "NUMBER_SYSTEM", dividend: 2, divisor: 0 }],
        values: [0],
      },
    },
    {
      ...q,
      quantityI: {
        ...q.quantityI,
        states: [{ kind: "RATIO", ratioA: 0, ratioB: 2, valueA: 1 }],
        values: [0],
      },
    },
    {
      ...q,
      quantityI: {
        ...q.quantityI,
        states: [{ kind: "ALGEBRA", a: 0, b: 1, c: 2, rootIndex: 0 }],
        values: [0],
      },
    },
    { ...q, traceability: { ...q.traceability, publiclyPublishable: true } },
  ];
  // Bind the evidence and owner tamper cases to known differing originals.
  const fixture = generateQcp001Question({ seed: "QCP-V2:1" });
  malformed[2] = { ...fixture, answerEvidenceMode: "EXACT_EQUALITY" };
  malformed[6] = {
    ...fixture,
    quantityI: { ...fixture.quantityI, sourcePackageId: "ALG-002" },
  };
  for (const bad of malformed)
    assert(
      !independentlyVerifyQcp001Question(bad as Qcp001Question).valid,
      "Malformed learner package accepted",
    );
  for (const input of [{ language: "xx" }, { examProfile: "SSC_TIER_I" }]) {
    let rejected = false;
    try {
      generateQcp001Question(
        input as Parameters<typeof generateQcp001Question>[0],
      );
    } catch {
      rejected = true;
    }
    assert(rejected, "Unsupported request accepted");
  }
  return {
    status: "PASS_QCP_001_REVIEW_V2",
    oracleChecks,
    english,
    native,
    replays,
    malformedRejected: malformed.length,
    answerPositionsPerRelation: Object.fromEntries(
      [...positions].map(([k, v]) => [k, [...v].sort()]),
    ),
    displayedStatesPerSourcePair: Object.fromEntries(
      [...surfaces].map(([k, v]) => [k, v.size]),
    ),
  };
}
