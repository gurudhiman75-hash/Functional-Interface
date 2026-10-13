import assert from "node:assert/strict";
import { generateQcp001Question } from "./engine";
import { independentlyVerifyQcp001Question } from "./independent-verifier";
import { additionalResult } from "./additional-source";
import type { Qcp001AdditionalState, Qcp001Question } from "./types";
export function auditQcpAdditionalFamilies() {
  let packages = 0,
    replays = 0;
  const coverage = new Map<string, Set<string>>(),
    forms = new Set<string>(),
    radicals = new Set<number>();
  for (const sourceMode of ["ADDITIONAL", "IRRATIONAL"] as const)
    for (const examProfile of ["BANKING_PRELIMS", "BANKING_MAINS"] as const)
      for (let n = 1; n <= 720; n++)
        for (const language of ["en", "hi", "pa"] as const) {
          const input = {
              seed: `QCP-V4-AUDIT:${n}`,
              sourceMode,
              examProfile,
              language,
            },
            q = generateQcp001Question(input);
          assert.equal(independentlyVerifyQcp001Question(q).valid, true);
          const key = `${sourceMode}:${examProfile}:${language}:${q.quantityI.sourceFamily}`;
          const classes = coverage.get(key) ?? new Set<string>();
          classes.add(q.answerClass);
          coverage.set(key, classes);
          assert.equal(q.quantityI.sourceFamily, q.quantityII.sourceFamily);
          if (n <= 45) {
            assert.deepEqual(generateQcp001Question(input), q);
            replays++;
          }
          if (language !== "en")
            assert.match(
              q.stem,
              language === "hi" ? /[\u0900-\u097f]/ : /[\u0a00-\u0a7f]/,
            );
          for (const o of [q.quantityI, q.quantityII])
            for (const state of o.states) {
              if (state.kind === "ALGEBRA") {
                assert.equal(state.positiveOnly, true);
                assert.match(q.explanation.steps.join(" "), /√[235]/);
                for (const d of [2, 3, 5])
                  if (Number.isInteger(Math.sqrt(-state.c / d)))
                    radicals.add(d);
              } else {
                const s = state as Qcp001AdditionalState;
                forms.add(
                  `${s.kind}:${s.task}${s.kind === "REPLACEMENT" ? ":" + s.cycles : s.kind === "PRICE_RECOVERY" ? ":" + s.firstRate + ":" + s.secondDirection : ""}`,
                );
                if (s.kind === "PROBABILITY") {
                  const exact = additionalResult(s).text;
                  assert(q.explanation.steps.join(" ").includes(exact));
                  assert(!/0\.\d{6,}/.test(q.explanation.steps.join(" ")));
                }
              }
            }
          packages++;
        }
  assert.equal(coverage.size, 60);
  for (const [key, classes] of coverage) assert.equal(classes.size, 5, key);
  assert.deepEqual([...radicals].sort(), [2, 3, 5]);
  assert.equal(forms.size, 24);
  const known: Array<[Qcp001AdditionalState, number]> = [
    [
      {
        kind: "COMPOUND_INTEREST",
        task: "AMOUNT",
        amount: 1600,
        rate: 25,
        years: 2,
      },
      2500,
    ],
    [
      {
        kind: "COMPOUND_INTEREST",
        task: "INTEREST",
        amount: 1600,
        rate: 25,
        years: 2,
      },
      900,
    ],
    [
      {
        kind: "COMPOUND_INTEREST",
        task: "PRINCIPAL",
        amount: 2500,
        rate: 25,
        years: 2,
      },
      1600,
    ],
    [
      {
        kind: "WORK",
        task: "COMBINED",
        firstTime: 12,
        secondTime: 6,
        combinedNumerator: 4,
        combinedDenominator: 1,
      },
      4,
    ],
    [
      {
        kind: "WORK",
        task: "MISSING",
        firstTime: 12,
        secondTime: 6,
        combinedNumerator: 4,
        combinedDenominator: 1,
      },
      6,
    ],
    [
      {
        kind: "BOATS",
        task: "UPSTREAM",
        bodySpeed: 12,
        streamSpeed: 3,
        distance: 27,
      },
      3,
    ],
    [
      {
        kind: "BOATS",
        task: "ROUND_TRIP",
        bodySpeed: 16,
        streamSpeed: 4,
        distance: 30,
      },
      4,
    ],
    [
      {
        kind: "TRAINS",
        task: "SAME",
        lengthA: 100,
        lengthB: 200,
        speedA: 15,
        speedB: 5,
      },
      30,
    ],
    [{ kind: "AGES", task: "FUTURE", difference: 29, shift: 5 }, 24],
    [
      { kind: "PROBABILITY", task: "WITHOUT_REPLACEMENT", red: 5, blue: 15 },
      1 / 19,
    ],
    [
      {
        kind: "MENSURATION",
        task: "TRIANGLE_AREA",
        base: 6,
        height: 12,
        area: 36,
      },
      36,
    ],
    [
      {
        kind: "REPLACEMENT",
        task: "REMOVE_REFILL",
        milk: 80,
        water: 20,
        removed: 50,
        cycles: 2,
      },
      20,
    ],
    [
      {
        kind: "PRICE_RECOVERY",
        task: "COST_PRICE",
        difference: 60,
        firstRate: 20,
        secondRate: 10,
        firstDirection: "PROFIT",
        secondDirection: "LOSS",
      },
      200,
    ],
  ];
  for (const [s, value] of known)
    assert.equal(additionalResult(s).value, value);
  let malformedRejected = 0;
  const reject = (q: Qcp001Question, mutate: (x: any) => void) => {
    const x = structuredClone(q);
    mutate(x);
    assert.equal(independentlyVerifyQcp001Question(x).valid, false);
    malformedRejected++;
  };
  for (let family = 0; family < 9; family++) {
    const q = generateQcp001Question({
      seed: `QCP-V4-NEGATIVE:${family * 5 + 1}`,
      sourceMode: "ADDITIONAL",
    });
    reject(q, (x) => (x.quantityI.states[0].task = "UNKNOWN"));
    reject(q, (x) => (x.quantityI.prompt = "A different scenario"));
    reject(q, (x) => (x.stem = "An unrelated question"));
    reject(q, (x) => {
      const s = x.quantityI.states[0];
      const field = [
        "amount",
        "firstTime",
        "bodySpeed",
        "lengthA",
        "difference",
        "red",
        "base",
        "removed",
        "difference",
      ][family]!;
      s[field] = 0;
    });
  }
  const irrational = generateQcp001Question({
    seed: "QCP-V4-ROOT:1",
    sourceMode: "IRRATIONAL",
  });
  reject(irrational, (x) => delete x.quantityI.states[0].positiveOnly);
  reject(irrational, (x) => (x.quantityI.states[0].c = -7));
  reject(
    irrational,
    (x) => (x.quantityI.prompt = x.quantityI.prompt.replace(" > 0", "")),
  );
  reject(irrational, (x) => (x.quantityI.states[0].rootIndex = 0));
  const rational = generateQcp001Question({ seed: "QCP-V4-COMPLETENESS:78" });
  const missing = structuredClone(rational) as any;
  missing.quantityI.states.pop();
  missing.quantityI.values.pop();
  assert.equal(
    independentlyVerifyQcp001Question(missing).checks.quadraticCompleteness,
    false,
  );
  malformedRejected++;
  return {
    status: "PASS_QCP_ADDITIONAL_V4",
    packages,
    replays,
    coveredFamilyProfileLanguages: coverage.size,
    allFiveRelationsPerFamily: true,
    forms: [...forms].sort(),
    radicands: [...radicals].sort(),
    knownAnswers: known.length,
    malformedRejected,
    wholeSourceSaturation: false,
  };
}
