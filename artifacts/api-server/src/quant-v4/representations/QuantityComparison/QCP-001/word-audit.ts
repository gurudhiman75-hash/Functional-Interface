import assert from "node:assert/strict";
import { generateQcp001Question } from "./engine";
import { independentlyVerifyQcp001Question } from "./independent-verifier";
import { solveWordState } from "./word-source";
import type { Qcp001Question, Qcp001WordState } from "./types";
export function auditQcpWordProblems() {
  const seen = new Map<string, Set<string>>(),
    tasks = new Set<string>();
  let packages = 0,
    replays = 0;
  const examples: Qcp001Question[] = [];
  for (const examProfile of ["BANKING_PRELIMS", "BANKING_MAINS"] as const) {
    for (let n = 1; n <= 900; n++) {
      for (const language of ["en", "hi", "pa"] as const) {
        const input = {
          seed: `QCP-WORD-AUDIT:${n}`,
          examProfile,
          language,
          sourceMode: "WORD_PROBLEMS" as const,
        };
        const q = generateQcp001Question(input);
        assert.equal(independentlyVerifyQcp001Question(q).valid, true);
        assert.equal(
          q.traceability.contractVersion,
          "QCP-001-BANKING-RELATION-V3",
        );
        assert.match(q.stem, /₹/);
        assert.equal(q.options.length, 5);
        assert.notEqual(
          q.questionId,
          generateQcp001Question({ ...input, sourceMode: "FOUNDATION" })
            .questionId,
        );
        if (language !== "en")
          assert.match(
            q.stem,
            language === "hi" ? /[\u0900-\u097f]/ : /[\u0a00-\u0a7f]/,
          );
        if (n <= 60) {
          assert.deepEqual(generateQcp001Question(input), q);
          replays++;
        }
        const key = `${examProfile}:${language}:${q.quantityI.sourceFamily}->${q.quantityII.sourceFamily}`;
        const bucket = seen.get(key) ?? new Set<string>();
        bucket.add(q.answerClass);
        seen.set(key, bucket);
        for (const o of [q.quantityI, q.quantityII]) {
          assert.equal(new Set(o.states.map((s) => s.kind)).size, 1);
          for (const raw of o.states) {
            const s = raw as Qcp001WordState;
            tasks.add(
              `${s.kind}:${s.task}${s.kind === "PROFIT_LOSS" ? ":" + s.direction : s.kind === "MIXTURE" ? ":" + s.quantities.length : ""}`,
            );
          }
        }
        if (n <= 10 && examProfile === "BANKING_PRELIMS") examples.push(q);
        packages++;
      }
    }
  }
  assert.equal(seen.size, 54); // 9 ordered pairs × 2 profiles × 3 languages.
  for (const [key, classes] of seen) assert.equal(classes.size, 5, key);
  assert.equal(tasks.size, 12); // Six PNL modes, three SI modes, three blend forms.
  const known: Array<[Qcp001WordState, number]> = [
    [
      {
        kind: "PROFIT_LOSS",
        task: "SELLING_PRICE",
        amount: 800,
        rate: 25,
        direction: "PROFIT",
      },
      1000,
    ],
    [
      {
        kind: "PROFIT_LOSS",
        task: "COST_PRICE",
        amount: 600,
        rate: 25,
        direction: "LOSS",
      },
      800,
    ],
    [
      {
        kind: "PROFIT_LOSS",
        task: "PROFIT_AMOUNT",
        amount: 900,
        rate: 20,
        direction: "PROFIT",
      },
      180,
    ],
    [
      { kind: "INTEREST", task: "INTEREST", amount: 4000, rate: 10, years: 3 },
      1200,
    ],
    [
      { kind: "INTEREST", task: "AMOUNT", amount: 4000, rate: 10, years: 3 },
      5200,
    ],
    [
      { kind: "INTEREST", task: "PRINCIPAL", amount: 1200, rate: 10, years: 3 },
      4000,
    ],
    [
      {
        kind: "MIXTURE",
        task: "MEAN",
        quantities: [2, 3],
        prices: [40, 60],
        mean: 52,
      },
      52,
    ],
    [
      {
        kind: "MIXTURE",
        task: "UNKNOWN_PRICE",
        quantities: [2, 3],
        prices: [40],
        mean: 52,
      },
      60,
    ],
  ];
  for (const [state, expected] of known)
    assert.equal(solveWordState(state), expected);
  const q = generateQcp001Question({
    seed: "QCP-WORD-NEGATIVE:1",
    sourceMode: "WORD_PROBLEMS",
  });
  const mutations: Array<(x: any) => void> = [
    (x) => (x.quantityI.states[0].task = "UNKNOWN"),
    (x) => (x.quantityI.states[0].amount = -1),
    (x) => (x.quantityI.states[0].direction = "SIDEWAYS"),
    (x) => (x.quantityI.states[0].rate = 0),
    (x) => (x.quantityI.prompt = "A different article"),
    (x) => (x.stem = "An unrelated question"),
    (x) => (x.quantityI.sourcePackageId = "MAL-001"),
    (x) => (x.quantityI.values[0] += 1),
  ];
  for (const mutate of mutations) {
    const clone = structuredClone(q);
    mutate(clone);
    assert.equal(independentlyVerifyQcp001Question(clone).valid, false);
  }
  for (const familyIndex of [1, 2]) {
    const q = generateQcp001Question({
      seed: `QCP-WORD-NEGATIVE:${familyIndex * 5 + 1}`,
      sourceMode: "WORD_PROBLEMS",
    });
    // These indices select QII Interest and Mixture, respectively.
    const bad = structuredClone(q) as any;
    if (familyIndex === 1) bad.quantityII.states[0].years = 0;
    else bad.quantityII.states[0].quantities[0] = 0;
    assert.equal(independentlyVerifyQcp001Question(bad).valid, false);
  }
  return {
    status: "PASS_QCP_WORD_PROBLEMS_V3",
    packages,
    replays,
    orderedPairsPerProfileLanguage: 9,
    relationClassesPerPair: 5,
    taskForms: [...tasks].sort(),
    independentKnownAnswers: known.length,
    malformedRejected: 10,
    examples,
  };
}
