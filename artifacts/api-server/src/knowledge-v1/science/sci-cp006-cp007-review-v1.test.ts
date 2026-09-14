import { generateSciCp006ReviewBatchV1 } from "./sound/sci-cp006-review-v1";
import { generateSciCp007ReviewBatchV1 } from "./light-optics/sci-cp007-review-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function validate(cpId: string, rows: ReturnType<typeof generateSciCp006ReviewBatchV1> | ReturnType<typeof generateSciCp007ReviewBatchV1>) {
  assert(rows.length === 60, `${cpId}: expected 60 questions, got ${rows.length}`);
  const qlCounts = new Map<string, number>();
  const diff = new Map<string, number>();
  const pos = [0,0,0,0];
  const stems = new Set<string>();
  const ids = new Set<string>();

  for (const q of rows) {
    assert(q.cpId === cpId, `${cpId}: wrong cpId on ${q.questionId}`);
    assert(q.reviewOnly === true && q.runtimeRegistered === false, `${cpId}: lifecycle leak on ${q.questionId}`);
    assert(q.options.length === 4, `${cpId}: ${q.questionId} must have four options`);
    assert(q.correctIndex >= 0 && q.correctIndex < 4, `${cpId}: bad correct index`);
    assert(q.options[q.correctIndex] === q.canonicalAnswer, `${cpId}: answer mismatch on ${q.questionId}`);
    assert(new Set(q.options).size === 4, `${cpId}: duplicate option on ${q.questionId}`);
    assert(q.stem.trim().length >= 12, `${cpId}: weak stem on ${q.questionId}`);
    assert(q.explanation.trim().length >= 12, `${cpId}: weak explanation on ${q.questionId}`);
    assert(q.sourceIds.length > 0 && q.sourceFactIds.length > 0, `${cpId}: missing provenance`);
    assert(!ids.has(q.questionId), `${cpId}: duplicate question id`);
    assert(!stems.has(q.stem), `${cpId}: duplicate stem`);
    ids.add(q.questionId);
    stems.add(q.stem);
    qlCounts.set(q.qlId, (qlCounts.get(q.qlId) ?? 0) + 1);
    diff.set(q.difficulty, (diff.get(q.difficulty) ?? 0) + 1);
    pos[q.correctIndex] += 1;
  }

  assert(qlCounts.size === 10, `${cpId}: expected 10 QLs`);
  for (const [ql,count] of qlCounts) assert(count === 6, `${cpId}: ${ql} expected 6, got ${count}`);
  assert(diff.get("Easy") === 18, `${cpId}: Easy count mismatch`);
  assert(diff.get("Medium") === 30, `${cpId}: Medium count mismatch`);
  assert(diff.get("Hard") === 12, `${cpId}: Hard count mismatch`);
  assert(pos.join(",") === "15,15,15,15", `${cpId}: answer positions ${pos.join(",")}`);
}

validate("SCI-CP-006", generateSciCp006ReviewBatchV1());
validate("SCI-CP-007", generateSciCp007ReviewBatchV1());
console.log("SCI-CP-006/007 qualification gate passed: 120 questions.");
