import { PGK_001_CP023_QL154 } from "./pgk-001-cp023-ql154";
import { PGK_001_CP023_QL155 } from "./pgk-001-cp023-ql155";
import { PGK_001_CP023_QL156 } from "./pgk-001-cp023-ql156";
import { PGK_001_CP023_QL157 } from "./pgk-001-cp023-ql157";
import { PGK_001_CP023_QL158 } from "./pgk-001-cp023-ql158";
import { PGK_001_CP023_QL159 } from "./pgk-001-cp023-ql159";
import { PGK_001_CP023_QL160 } from "./pgk-001-cp023-ql160";

const QLS = [
  ["PGK-001-QL-154", PGK_001_CP023_QL154],
  ["PGK-001-QL-155", PGK_001_CP023_QL155],
  ["PGK-001-QL-156", PGK_001_CP023_QL156],
  ["PGK-001-QL-157", PGK_001_CP023_QL157],
  ["PGK-001-QL-158", PGK_001_CP023_QL158],
  ["PGK-001-QL-159", PGK_001_CP023_QL159],
  ["PGK-001-QL-160", PGK_001_CP023_QL160],
] as const;

export const PGK_001_CP023_REVIEW_BATCH_V1 = Object.freeze(
  QLS.flatMap(([qlId, payloads]) => payloads.map((payload, index) => Object.freeze({
    id: `${qlId}-R${String(index + 1).padStart(2, "0")}`,
    qlId,
    ...payload,
    reviewOnly: true as const,
    runtimeRegistered: false as const,
  })))
);

const BANNED = [
  "associated with",
  "closely associated",
  "linked with",
  "closely linked",
  "known for",
  "formed the framework",
  "according to",
  "school history",
  "the correct answer is",
  "the correct option",
  "the other options",
  "this question tests",
  "review batch",
  "generator",
];

export function auditPgk001Cp023ReviewBatchV1() {
  const questions = PGK_001_CP023_REVIEW_BATCH_V1;
  const errors: string[] = [];

  if (questions.length !== 42) errors.push(`Expected 42 questions, found ${questions.length}`);

  for (const [qlId] of QLS) {
    const count = questions.filter((q) => q.qlId === qlId).length;
    if (count !== 6) errors.push(`${qlId}: expected 6 questions, found ${count}`);
  }

  for (const q of questions) {
    if (q.options.length !== 4 || new Set(q.options).size !== 4) errors.push(`${q.id}: options must be four unique values`);
    if (!q.options.includes(q.answer as never)) errors.push(`${q.id}: answer is not present in options`);
    if (!q.reviewOnly || q.runtimeRegistered) errors.push(`${q.id}: invalid lifecycle flags`);

    const learner = `${q.stem}\n${q.explanation}`.toLowerCase();
    for (const term of BANNED) if (learner.includes(term)) errors.push(`${q.id}: banned wording '${term}'`);

    const sentenceCount = q.explanation.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean).length;
    if (sentenceCount < 2 || sentenceCount > 3) errors.push(`${q.id}: explanation should contain 2-3 short sentences`);
  }

  return Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) });
}
