import assert from "node:assert/strict";
import {
  generateDi011MixedSet,
  DI011_PAIR_KINDS,
  DI011_TASK_KINDS,
} from "./DI-011/mixed-set";
import { generateDi014RadarPieSet, DI014_TASKS } from "./DI-014/radar-pie-set";
import { localizeDi011Set } from "./DI-011/localization-review-v1";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const ratio = (a: number, b: number) => {
  const g = gcd(a, b);
  return `${a / g}:${b / g}`;
};
function mentions(stem: string, categories: readonly string[]): string[] {
  const escaped = categories.map((s) =>
    s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  const pattern = new RegExp(
    `(?<![A-Za-z0-9])(${escaped.join("|")})(?![A-Za-z0-9])`,
    "g",
  );
  return [...stem.matchAll(pattern)].map((m) => m[1]!);
}
let mixedQuestions = 0,
  hybridQuestions = 0,
  nativeParity = 0,
  uniqueMaximumCases = 0;
const mixedTasks = new Set<string>(),
  hybridTasks = new Set<string>(),
  pairs = new Set<string>();
for (let seed = 0; seed < 1000; seed++) {
  const set = generateDi011MixedSet({
    seed: `DI-EDGE-CROSS:${seed}`,
    examProfile: seed % 2 ? "BANKING_MAINS" : "BANKING_PRELIMS",
  });
  const s = set.stimulus,
    rows = s.rows,
    isPie = s.pairKind === "PIE_TABLE";
  pairs.add(s.pairKind);
  const metric = (r: (typeof rows)[number]) =>
    isPie ? r.right : r.left + r.right;
  const top = Math.max(...rows.map(metric));
  assert.equal(
    rows.filter((r) => metric(r) === top).length,
    1,
    "Ambiguous maximum category",
  );
  uniqueMaximumCases++;
  for (const q of set.questions) {
    const refs = mentions(
      q.stem,
      rows.map((r) => r.category),
    ).map((c) => rows.find((r) => r.category === c)!);
    const [a, b, c, d] = refs;
    let answer: number | string;
    switch (q.kind) {
      case "SAME_CATEGORY_COMBINED_TOTAL": {
        if (isPie) {
          const highShare = Math.max(...rows.map((r) => r.left));
          const winners = rows.filter((r) => r.left === highShare);
          assert.equal(winners.length, 1);
          answer = winners[0]!.right;
        } else answer = a!.left + a!.right;
        break;
      }
      case "SAME_CATEGORY_ABSOLUTE_DIFFERENCE":
        answer = isPie
          ? Math.abs(a!.left - b!.left)
          : Math.abs(a!.left - a!.right);
        break;
      case "LEFT_TO_RIGHT_RATIO":
        answer = isPie ? ratio(a!.left, b!.left) : ratio(a!.left, a!.right);
        break;
      case "TWO_CATEGORY_CROSS_SUM":
        answer = isPie ? a!.right + b!.right : a!.left + b!.right;
        break;
      case "HIGHEST_COMBINED_CATEGORY":
        answer = rows.find((r) => metric(r) === top)!.category;
        break;
      case "CROSS_COMPONENT_AVERAGE":
        assert(!isPie);
        answer = (a!.left + b!.right) / 2;
        break;
      case "TWO_GROUP_CROSS_RATIO":
        answer = isPie
          ? ratio(a!.right + b!.right, c!.right + d!.right)
          : ratio(a!.left + b!.left, c!.right + d!.right);
        break;
      case "TWO_GROUP_COMBINED_DIFFERENCE":
        answer = isPie
          ? Math.abs(a!.right + b!.right - c!.right - d!.right)
          : Math.abs(a!.left + b!.right - c!.left - d!.right);
        break;
      case "THREE_CATEGORY_CROSS_TOTAL":
        answer = isPie
          ? a!.right + b!.right + c!.right
          : a!.left + b!.right + c!.left;
        break;
      case "FOUR_VALUE_CROSS_AVERAGE":
        assert(!isPie);
        answer = (a!.left + b!.right + c!.left + d!.right) / 4;
        break;
    }
    assert.equal(
      q.answer,
      String(answer),
      `${set.seed}/${q.kind}: visible-data answer`,
    );
    assert.equal(q.options[q.correctIndex], String(answer));
    assert(q.stem.endsWith("?"));
    assert(!/^(Find|Add|Calculate|Compare)\b/.test(q.stem));
    mixedTasks.add(q.kind);
    mixedQuestions++;
  }
  if (seed < 100)
    for (const locale of ["hi-IN", "pa-IN"] as const) {
      const native = localizeDi011Set(set, locale);
      assert.deepEqual(
        native.questions.map((q) => q.kind),
        set.questions.map((q) => q.kind),
      );
      native.questions.forEach((q, i) => {
        assert.equal(q.correctIndex, set.questions[i]!.correctIndex);
        assert.equal(q.options[q.correctIndex], q.answer);
        assert(q.stem.endsWith("?"));
        if (set.questions[i]!.kind !== "HIGHEST_COMBINED_CATEGORY")
          assert.equal(q.answer, set.questions[i]!.answer);
        nativeParity++;
      });
    }

  const hybrid = generateDi014RadarPieSet({ seed: `DI-EDGE-HYBRID:${seed}` });
  const categories = hybrid.radar.points.map((p) => p.category);
  const received = new Map(
    hybrid.radar.points.map((p) => [p.category, p.applications]),
  );
  // Recover approvals solely from visible pie shares and its printed total;
  // never read the generator's approvedCounts or its hidden rate choices.
  const approved = new Map(
    hybrid.pie.slices.map((p) => [
      p.category,
      (hybrid.pie.totalValue * p.percent) / 100,
    ]),
  );
  const rate = (c: string) => (100 * approved.get(c)!) / received.get(c)!;
  for (const q of hybrid.questions) {
    const [a, b] = mentions(q.stem, categories);
    const A = (c: string) => received.get(c)!,
      B = (c: string) => approved.get(c)!;
    let answer: number | string;
    switch (q.kind) {
      case "DIRECT_APPLICATIONS":
        answer = A(a!);
        break;
      case "APPROVED_COUNT_FROM_PIE":
        answer = B(a!);
        break;
      case "CATEGORY_GAP":
        answer = A(a!) - B(a!);
        break;
      case "CATEGORY_APPROVAL_RATE":
        answer = `${rate(a!)}%`;
        break;
      case "APPLICATION_TO_APPROVAL_RATIO":
        answer = ratio(A(a!), B(a!));
        break;
      case "TWO_CATEGORY_APPROVED_TOTAL":
        answer = B(a!) + B(b!);
        break;
      case "TWO_CATEGORY_APPLICATION_TOTAL":
        answer = A(a!) + A(b!);
        break;
      case "GROUP_APPLICATION_TO_APPROVAL_RATIO":
        answer = ratio(A(a!) + A(b!), B(a!) + B(b!));
        break;
      case "TOTAL_APPLICATION_TO_APPROVAL_RATIO":
        answer = ratio(
          [...received.values()].reduce((x, y) => x + y, 0),
          hybrid.pie.totalValue,
        );
        break;
      case "CROSS_CATEGORY_APPLICATION_APPROVAL_RATIO":
        answer = ratio(A(a!), B(b!));
        break;
      case "REJECTED_TO_APPROVED_RATIO":
        answer = ratio(A(a!) - B(a!), B(a!));
        break;
      case "TWO_CATEGORY_REJECTED_TOTAL":
        answer = A(a!) + A(b!) - B(a!) - B(b!);
        break;
      case "APPROVAL_RATE_DIFFERENCE":
        answer = `${Math.abs(rate(a!) - rate(b!))} percentage points`;
        break;
      case "HIGHEST_APPROVAL_RATE":
        answer = `${Math.max(...categories.map(rate))}%`;
        break;
    }
    assert.equal(
      q.answer,
      String(answer),
      `${hybrid.seed}/${q.kind}: visible-data answer`,
    );
    assert.equal(q.options[q.correctIndex], String(answer));
    hybridTasks.add(q.kind);
    hybridQuestions++;
  }
}
assert.deepEqual([...pairs].sort(), [...DI011_PAIR_KINDS].sort());
assert.deepEqual([...mixedTasks].sort(), [...DI011_TASK_KINDS].sort());
assert.deepEqual([...hybridTasks].sort(), [...DI014_TASKS].sort());
console.log(
  JSON.stringify({
    status: "PASS_DI_CROSS_CHART_INDEPENDENT_V2",
    mixedQuestions,
    hybridQuestions,
    nativeParity,
    uniqueMaximumCases,
    mixedPairKinds: [...pairs].sort(),
    mixedTaskForms: mixedTasks.size,
    hybridTaskForms: hybridTasks.size,
    visibleDataOnly: true,
  }),
);
