import { ALP_001_QLS } from "./ql-registry";
import { generateAlp001Question } from "./runtime";
import type { AlpLocale } from "./types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const qls = ALP_001_QLS.filter((ql) => Number(ql.checkpointId.slice(-3)) >= 6);
const locales: readonly AlpLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const positions = [0, 0, 0, 0];
const checkpointCounts = new Map<string, number>();
const difficulties = new Map<string, Set<string>>();
let generated = 0;

assert(qls.length === 52, `Expected 52 completion QLs, found ${qls.length}`);

for (const ql of qls) {
  checkpointCounts.set(ql.checkpointId, (checkpointCounts.get(ql.checkpointId) ?? 0) + 1);
  const visible = new Set<string>();
  for (let seed = 0; seed < 80; seed += 1) {
    const english = generateAlp001Question(ql.qlId, seed, "en-IN");
    const repeated = generateAlp001Question(ql.qlId, seed, "en-IN");
    assert(JSON.stringify(english) === JSON.stringify(repeated), `${ql.qlId} ${seed} determinism`);
    visible.add(`${english.stem}|${english.options.map((option) => option.value).join("|")}`);
    positions[english.correctIndex] = (positions[english.correctIndex] ?? 0) + 1;
    difficulties.set(ql.checkpointId, difficulties.get(ql.checkpointId) ?? new Set());
    difficulties.get(ql.checkpointId)!.add(english.difficulty);

    for (const locale of locales) {
      const question = locale === "en-IN" ? english : generateAlp001Question(ql.qlId, seed, locale);
      generated += 1;
      assert(question.metadata.runtimeVersion === "ALP-001-RUNTIME-V3", `${ql.qlId} ${seed} ${locale} runtime`);
      assert(question.options.length === 4, `${ql.qlId} ${seed} ${locale} option count`);
      assert(new Set(question.options.map((option) => option.value)).size === 4, `${ql.qlId} ${seed} ${locale} option uniqueness`);
      assert(question.options[question.correctIndex]?.value === question.answer, `${ql.qlId} ${seed} ${locale} answer/index`);
      assert(question.explanation.distractorAnalyses.length === 3, `${ql.qlId} ${seed} ${locale} trap count`);
      assert(question.explanation.visualWorking.length >= 3, `${ql.qlId} ${seed} ${locale} visual working`);
      assert((question.structuredPrompt.sequence?.length ?? 0) > 0, `${ql.qlId} ${seed} ${locale} source sequence`);
      assert(question.explanation.conclusion.includes(question.answer), `${ql.qlId} ${seed} ${locale} conclusion`);
      assert(!/undefined|null|\{\{|\}\}|ALP_|COMPLETION_TRAP_/.test(`${question.stem}\n${JSON.stringify(question.explanation)}`), `${ql.qlId} ${seed} ${locale} internal text`);
      if (locale === "hi-IN") assert(/[\u0900-\u097F]/.test(question.stem), `${ql.qlId} ${seed} Hindi script`);
      if (locale === "pa-IN") assert(/[\u0A00-\u0A7F]/.test(question.stem), `${ql.qlId} ${seed} Punjabi script`);
    }
  }
  assert(visible.size >= 8, `${ql.qlId} visible diversity ${visible.size}`);
}

for (const [checkpoint, count] of checkpointCounts) {
  const expected = checkpoint === "ALP-CP-006" ? 6 : checkpoint === "ALP-CP-007" ? 8 : checkpoint === "ALP-CP-008" ? 12 : checkpoint === "ALP-CP-009" ? 14 : 12;
  assert(count === expected, `${checkpoint} expected ${expected}, found ${count}`);
  assert(difficulties.get(checkpoint)?.has("MEDIUM"), `${checkpoint} missing MEDIUM`);
  assert(difficulties.get(checkpoint)?.has("HARD"), `${checkpoint} missing HARD`);
}
const minimum = Math.min(...positions);
const maximum = Math.max(...positions);
assert(minimum > 0 && maximum / minimum < 1.15, `Completion answer positions imbalanced: ${positions.join(", ")}`);

console.log("ALP-001 CP-006 through CP-010 completion audit passed.", {
  qlCount: qls.length,
  generated,
  checkpointCounts: Object.fromEntries([...checkpointCounts].sort()),
  answerPositions: positions,
  difficulties: Object.fromEntries([...difficulties].map(([key, value]) => [key, [...value].sort()])),
});
