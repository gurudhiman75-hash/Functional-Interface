import assert from "node:assert/strict";
import {
  buildNumericalItem,
  generateVen001NumericalBatch,
  NUMERICAL_CONTEXTS,
  NUMERICAL_CP_IDS,
  numericalBound,
  QUERY_MASKS,
} from "./ven-001-numerical.ts";
import { reasoningV1QuestionStudioAdapter } from "../../../../question-studio/engines/reasoning-v1-adapter.ts";

let validated = 0;
for (let s = 0; s < 200; s++)
  for (const cp of NUMERICAL_CP_IDS) {
    const languages = ["en", "hi", "pa"] as const;
    const batches = languages.map((language) =>
      generateVen001NumericalBatch({
        packageId: "VEN-001",
        patternId: cp,
        language: language as "en" | "hi" | "pa",
        count: 50,
        seed: `numerical-audit-${s}`,
      }),
    );
    for (let i = 0; i < 50; i++) {
      const q = batches[0].questions[i] as any,
        meta = q.semanticMetadata,
        r = meta.exclusiveRegions as number[] | undefined;
      assert.equal(new Set(q.options).size, 4);
      assert.equal(q.options[q.correctIndex], q.canonicalAnswer);
      assert.ok(
        q.options.every(
          (x: string) => !x.includes("NaN") && !x.includes("undefined"),
        ),
      );
      assert.equal(q.questionBankWritable, false);
      assert.equal(q.reviewStatus, "REVIEW_CANDIDATE_TRILINGUAL");
      assert.ok(q.stem && !q.stem.includes("undefined"));
      assert.ok(
        !/^A\s*=/.test(q.stem),
        `${cp}/${meta.queryKey}: stem should open with varied survey wording, not an A/B/C legend`,
      );
      assert.ok(q.explanation.length > 15);
      for (let localeIndex = 0; localeIndex < batches.length; localeIndex++) {
        const localized = batches[localeIndex].questions[i] as any;
        const scenario = NUMERICAL_CONTEXTS.find(
          (context) => context.id === localized.semanticMetadata.scenarioId,
        );
        assert.ok(
          scenario?.names[languages[localeIndex]]
            .split("|")
            .some((name: string) => localized.explanation.includes(name)),
          `${cp}/${localized.semanticMetadata.queryKey}/${languages[localeIndex]}: explanation must use this question's actual activity names`,
        );
        assert.doesNotMatch(
          localized.stem,
          /first group|second group|third group|first activity|second activity|third activity|पहले समूह|दूसरे समूह|तीसरे समूह|पहली गतिविधि|दूसरी गतिविधि|तीसरी गतिविधि|ਪਹਿਲੇ ਸਮੂਹ|ਦੂਜੇ ਸਮੂਹ|ਤੀਜੇ ਸਮੂਹ|ਪਹਿਲਾ ਕੰਮ|ਦੂਜਾ ਕੰਮ|ਤੀਜਾ ਕੰਮ/iu,
          `${cp}/${localized.semanticMetadata.queryKey}/${languages[localeIndex]}: stem must name the actual activities rather than ordinal groups`,
        );
        if (
          scenario &&
          ["onlyAB", "onlyAC", "onlyBC"].includes(
            localized.semanticMetadata.queryKey,
          )
        ) {
          const excludedIndex =
            localized.semanticMetadata.queryKey === "onlyAB"
              ? 2
              : localized.semanticMetadata.queryKey === "onlyAC"
                ? 1
                : 0;
          const excludedName =
            scenario.names[languages[localeIndex]].split("|")[excludedIndex]!;
          assert.ok(
            localized.explanation.includes(excludedName),
            `${cp}/${localized.semanticMetadata.queryKey}/${languages[localeIndex]}: pair-only explanation must name the actually excluded activity`,
          );
          assert.doesNotMatch(
            localized.explanation,
            /तीसरी गतिविधि|ਤੀਜਾ ਕੰਮ/u,
          );
        }
      }
      assert.ok(
        !q.explanation.includes("Required count") &&
          !q.explanation.includes("Required ratio"),
        `${cp}/${meta.queryKey}: remove placeholder-style explanation labels`,
      );
      assert.ok(
        q.explanation.trim().endsWith(`${q.canonicalAnswer}.`),
        `${cp}/${meta.queryKey}: explanation must finish with the verified answer`,
      );
      if (
        (cp === "VEN-CP006" || cp === "VEN-CP009") &&
        meta.queryKey === "none"
      )
        assert.ok(
          q.explanation.includes("pair counts include the centre") &&
            q.explanation.includes("−") &&
            q.explanation.includes("+"),
          `${cp}/none: derive the union from the supplied inclusive counts`,
        );
      if (cp === "VEN-CP005" && meta.queryKey === "none") {
        assert.ok(
          q.explanation.includes("Subtract this from the surveyed total"),
          "VEN-CP005/none must use the dedicated two-set none derivation",
        );
        assert.doesNotMatch(
          q.explanation,
          /(?:^|[.;]\s+)(?:only |none of the activities|all three activities)/,
          "VEN-CP005 English explanation should not expose lower-case region fragments",
        );
      }
      if (r) {
        // Independently materialize each person by their membership rather than reuse the solver.
        const people = r.flatMap((count, mask) =>
          Array.from({ length: count }, () => ({
            a: !!(mask & 1),
            b: !!(mask & 2),
            c: !!(mask & 4),
            mask,
          })),
        );
        assert.ok(r.every((x) => Number.isInteger(x) && x >= 0));
        const predicates: Record<
          string,
          (p: (typeof people)[number]) => boolean
        > = {
          onlyA: (p) => p.a && !p.b && !p.c,
          onlyB: (p) => p.b && !p.a && !p.c,
          onlyC: (p) => p.c && !p.a && !p.b,
          both: (p) => p.a && p.b,
          onlyAB: (p) => p.a && p.b && !p.c,
          onlyBC: (p) => p.b && p.c && !p.a,
          onlyAC: (p) => p.a && p.c && !p.b,
          all: (p) => p.a && p.b && p.c,
          none: (p) => !p.a && !p.b && !p.c,
          union2: (p) => p.a || p.b,
          union3: (p) => p.a || p.b || p.c,
          exactOne2: (p) => Number(p.a) + Number(p.b) === 1,
          exactOne3: (p) => Number(p.a) + Number(p.b) + Number(p.c) === 1,
          exactTwo: (p) => Number(p.a) + Number(p.b) + Number(p.c) === 2,
          atLeastTwo: (p) => Number(p.a) + Number(p.b) + Number(p.c) >= 2,
          atMostOne: (p) => Number(p.a) + Number(p.b) + Number(p.c) <= 1,
          atMostTwo: (p) => Number(p.a) + Number(p.b) + Number(p.c) <= 2,
          AorBnotC: (p) => (p.a || p.b) && !p.c,
          AnotB: (p) => p.a && !p.b,
          inclusiveAB: (p) => p.a && p.b,
          total2: () => true,
          total3: () => true,
          "missing-pair": (p) => p.a && p.b,
          "missing-triple": (p) => p.a && p.b && p.c,
          "missing-total": () => true,
          "percentage-count": (p) => p.a && p.b,
          "percentage-total": () => true,
          "percentage-three-count": (p) => !p.a && !p.b && !p.c,
          "percentage-three-total": () => true,
          "ratio-given-total": () => true,
        };
        if (predicates[meta.queryKey])
          assert.equal(
            Number(q.canonicalAnswer),
            people.filter(predicates[meta.queryKey]).length,
            `${cp}/${meta.queryKey}`,
          );
        if (
          meta.queryKey.startsWith("ratio-") &&
          meta.queryKey !== "ratio-given-total"
        ) {
          const numerator =
            meta.queryKey === "ratio-two"
              ? people.filter(predicates.onlyA).length
              : people.filter(predicates.exactTwo).length;
          const denominator =
            meta.queryKey === "ratio-two"
              ? people.filter(predicates.onlyB).length
              : people.filter(predicates.all).length;
          const [a, b] = q.canonicalAnswer.split(":").map(Number);
          assert.equal(a * denominator, b * numerator);
        }
        // Verify every diagram number is placed in its true geometric membership region.
        const svg = q.explanationSvgs[0];
        const circles =
          meta.sets === 3
            ? [
                [200, 150, 130],
                [360, 150, 130],
                [280, 280, 130],
              ]
            : [
                [210, 220, 130],
                [350, 220, 130],
              ];
        for (const match of svg.matchAll(
          /<text x="(\d+)" y="(\d+)" data-mask="(\d+)">(\d+)<\/text>/g,
        )) {
          const [, xs, ys, ms, value] = match,
            mask = circles.reduce(
              (acc, [cx, cy, rad], j) =>
                acc |
                (Math.hypot(Number(xs) - cx, Number(ys) - cy) < rad
                  ? 1 << j
                  : 0),
              0,
            );
          assert.equal(mask, Number(ms));
          assert.equal(Number(value), r[mask]);
        }
      } else
        assert.equal(
          q.explanationSvgs.length,
          0,
          "bounds must not display an arbitrary latent distribution",
        );
      for (const batch of batches.slice(1)) {
        const other = batch.questions[i] as any;
        assert.deepEqual(other.options, q.options);
        assert.deepEqual(other.semanticMetadata, meta);
        assert.equal(other.canonicalAnswer, q.canonicalAnswer);
      }
      validated++;
    }
    if (cp === "VEN-CP009")
      for (let i = 0; i < 50; i += 5) {
        assert.equal(
          new Set(batches[0].questions.slice(i, i + 5).map((q) => q.caseletId))
            .size,
          1,
        );
        assert.equal(
          new Set(
            batches[0].questions.slice(i, i + 5).map((q) => q.sharedStimulus),
          ).size,
          1,
        );
        assert.equal(
          new Set(
            batches[0].questions
              .slice(i, i + 5)
              .map((q) => (q.semanticMetadata as any).queryKey),
          ).size,
          5,
        );
      }
  }
// Exhaustively enumerate all small populations; verify extrema are feasible, not merely inequalities.
let boundsChecked = 0;
for (const sets of [2, 3])
  for (let n = 0; n <= 6; n++) {
    const observed = new Map<
      string,
      {
        counts: number[];
        minI: number;
        maxI: number;
        minU: number;
        maxU: number;
      }
    >();
    function enumerate(r: number[], remaining: number) {
      if (r.length === (1 << sets) - 1) {
        const regions = [...r, remaining],
          counts = Array.from({ length: sets }, (_, j) =>
            regions.reduce((a, x, m) => a + (m & (1 << j) ? x : 0), 0),
          ),
          key = counts.join(","),
          intersection = regions.at(-1)!,
          union = n - regions[0],
          old = observed.get(key);
        observed.set(key, {
          counts,
          minI: Math.min(old?.minI ?? Infinity, intersection),
          maxI: Math.max(old?.maxI ?? 0, intersection),
          minU: Math.min(old?.minU ?? Infinity, union),
          maxU: Math.max(old?.maxU ?? 0, union),
        });
        return;
      }
      for (let k = 0; k <= remaining; k++) enumerate([...r, k], remaining - k);
    }
    enumerate([], n);
    for (const o of observed.values()) {
      assert.equal(numericalBound(n, o.counts, true, false), o.minI);
      assert.equal(numericalBound(n, o.counts, true, true), o.maxI);
      assert.equal(numericalBound(n, o.counts, false, false), o.minU);
      assert.equal(numericalBound(n, o.counts, false, true), o.maxU);
      boundsChecked += 4;
    }
  }
const listed = reasoningV1QuestionStudioAdapter
  .listPackages()
  .find((p) => p.packageId === "VEN-001")!;
for (const cp of NUMERICAL_CP_IDS) {
  assert.ok(listed.cpIds!.includes(cp));
  const batch = await reasoningV1QuestionStudioAdapter.generate({
    packageId: "VEN-001",
    patternId: cp,
    count: 5,
    language: "pa",
  });
  assert.equal(batch.questions.length, 5);
  assert.equal(batch.questions[0].cpId, cp);
}
for (const cp of NUMERICAL_CP_IDS) {
  assert.deepEqual(
    generateVen001NumericalBatch({ patternId: cp, seed: "stable" }),
    generateVen001NumericalBatch({ patternId: cp, seed: "stable" }),
  );
  assert.notDeepEqual(
    generateVen001NumericalBatch({ patternId: cp, seed: "stable" }),
    generateVen001NumericalBatch({ patternId: cp, seed: "different" }),
  );
}
for (const [cp, difficulties] of [
  ["VEN-CP005", ["Easy", "Medium"]],
  ["VEN-CP006", ["Medium"]],
  ["VEN-CP007", ["Medium", "Hard"]],
  ["VEN-CP008", ["Medium", "Hard"]],
  ["VEN-CP009", ["Medium"]],
  ["VEN-CP010", ["Medium", "Hard"]],
] as const) {
  for (const difficulty of difficulties)
    assert.ok(
      generateVen001NumericalBatch({
        patternId: cp,
        difficulty,
        count: 12,
      }).questions.every((q) => q.difficulty === difficulty),
    );
}
for (const bad of [
  { patternId: "VEN-CP005", difficulty: "Hard" },
  { patternId: "VEN-CP006", count: 0 },
  { patternId: "VEN-CP008", runtimeMode: "production" },
  { patternId: "VEN-CP009", packageId: "OTHER" },
])
  assert.throws(() => generateVen001NumericalBatch(bad));
assert.throws(() => numericalBound(5, [6, 2], true, false));
assert.ok(Object.keys(QUERY_MASKS).length >= 20);
assert.equal(NUMERICAL_CONTEXTS.length, 20);
console.log(
  `Numerical Venn: ${validated} question instances independently checked; three locales each; ${boundsChecked} exhaustive bounds; adapter, caselet, seed, difficulty and diagram checks passed.`,
);
