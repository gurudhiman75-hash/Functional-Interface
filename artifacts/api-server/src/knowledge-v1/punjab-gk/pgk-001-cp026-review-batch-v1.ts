import { PGK_001_CP026_QL175 } from "./pgk-001-cp026-ql175";
import { PGK_001_CP026_QL176 } from "./pgk-001-cp026-ql176";
import { PGK_001_CP026_QL177 } from "./pgk-001-cp026-ql177";
import { PGK_001_CP026_QL178 } from "./pgk-001-cp026-ql178";
import { PGK_001_CP026_QL179 } from "./pgk-001-cp026-ql179";
import { PGK_001_CP026_QL180 } from "./pgk-001-cp026-ql180";
import { PGK_001_CP026_QL181 } from "./pgk-001-cp026-ql181";
import { PGK_001_CP026_QL182 } from "./pgk-001-cp026-ql182";

const QLS = [
  ["PGK-001-QL-175", PGK_001_CP026_QL175],
  ["PGK-001-QL-176", PGK_001_CP026_QL176],
  ["PGK-001-QL-177", PGK_001_CP026_QL177],
  ["PGK-001-QL-178", PGK_001_CP026_QL178],
  ["PGK-001-QL-179", PGK_001_CP026_QL179],
  ["PGK-001-QL-180", PGK_001_CP026_QL180],
  ["PGK-001-QL-181", PGK_001_CP026_QL181],
  ["PGK-001-QL-182", PGK_001_CP026_QL182],
] as const;

export const PGK_001_CP026_REVIEW_BATCH_V1 = Object.freeze(
  QLS.flatMap(([qlId, payloads]) => payloads.map((payload, index) => Object.freeze({
    id: `${qlId}-R${String(index + 1).padStart(2, "0")}`,
    qlId,
    ...payload,
    reviewOnly: true as const,
    runtimeRegistered: false as const,
  })))
);

const BANNED = [
  "associated with", "closely associated", "linked with", "closely linked",
  "the correct answer is", "the correct option", "the other options",
  "this question tests", "review batch", "generator",
];

export function auditPgk001Cp026ReviewBatchV1() {
  const questions = PGK_001_CP026_REVIEW_BATCH_V1;
  const errors: string[] = [];
  if (questions.length !== 48) errors.push(`Expected 48 questions, found ${questions.length}`);
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
    if (sentenceCount < 1 || sentenceCount > 3) errors.push(`${q.id}: explanation should contain 1-3 short sentences`);
  }
  return Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) });
}
