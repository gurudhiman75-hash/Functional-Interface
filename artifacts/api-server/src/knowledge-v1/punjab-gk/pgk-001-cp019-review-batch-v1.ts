import { PGK_001_CP019_QL126 } from "./pgk-001-cp019-ql126";
import { PGK_001_CP019_QL127 } from "./pgk-001-cp019-ql127";
import { PGK_001_CP019_QL128 } from "./pgk-001-cp019-ql128";
import { PGK_001_CP019_QL129 } from "./pgk-001-cp019-ql129";
import { PGK_001_CP019_QL130 } from "./pgk-001-cp019-ql130";
import { PGK_001_CP019_QL131 } from "./pgk-001-cp019-ql131";
import { PGK_001_CP019_QL132 } from "./pgk-001-cp019-ql132";

const QLS = [
  ["PGK-001-QL-126", PGK_001_CP019_QL126],
  ["PGK-001-QL-127", PGK_001_CP019_QL127],
  ["PGK-001-QL-128", PGK_001_CP019_QL128],
  ["PGK-001-QL-129", PGK_001_CP019_QL129],
  ["PGK-001-QL-130", PGK_001_CP019_QL130],
  ["PGK-001-QL-131", PGK_001_CP019_QL131],
  ["PGK-001-QL-132", PGK_001_CP019_QL132],
] as const;

export const PGK_001_CP019_REVIEW_BATCH_V1 = Object.freeze(
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

export function auditPgk001Cp019ReviewBatchV1() {
  const questions = PGK_001_CP019_REVIEW_BATCH_V1;
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
