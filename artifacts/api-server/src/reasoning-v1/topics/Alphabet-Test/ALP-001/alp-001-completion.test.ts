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
const rejectedSyntheticStem = /^Given\b|\bFirst\b.*\bthen\b/i;
const rejectedGenericTrap = /uses the source row before|counts from the opposite end or moves in the opposite direction|mixes the requested category|मूल पंक्ति पढ़ता है|विपरीत सिरे से गिनता है|माँगी श्रेणी|ਮੂਲ ਕਤਾਰ ਪੜ੍ਹਦਾ ਹੈ|ਉਲਟ ਸਿਰੇ ਤੋਂ ਗਿਣਦਾ ਹੈ|ਮੰਗੀ ਸ਼੍ਰੇਣੀ/;
const rejectedRegionalJargon = /अंक-चिह्नों की क्रमबद्ध पंक्ति|तत्त्व-पंक्ति|साथ-साथ खिड़की|ਅੰਕ-ਚਿੰਨ੍ਹਾਂ ਦੀ ਕ੍ਰਮਵਾਰ ਕਤਾਰ|ਤੱਤ-ਕਤਾਰ|ਨਾਲ-ਨਾਲ ਖਿੜਕੀ/;
let generated = 0;

assert(ALP_001_QLS.length === 156, `Expected complete 156-QL chapter, found ${ALP_001_QLS.length}`);
assert(ALP_001_QLS.at(-1)?.qlId === "ALP-QL-156", `Expected ALP-QL-156 chapter end, found ${ALP_001_QLS.at(-1)?.qlId}`);
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
      const learnerText = `${question.stem}\n${JSON.stringify(question.explanation)}`;
      assert(question.metadata.runtimeVersion === "ALP-001-RUNTIME-V3", `${ql.qlId} ${seed} ${locale} runtime`);
      assert(question.options.length === 4, `${ql.qlId} ${seed} ${locale} option count`);
      assert(new Set(question.options.map((option) => option.value)).size === 4, `${ql.qlId} ${seed} ${locale} option uniqueness`);
      assert(question.options[question.correctIndex]?.value === question.answer, `${ql.qlId} ${seed} ${locale} answer/index`);
      assert(question.explanation.distractorAnalyses.length === 3, `${ql.qlId} ${seed} ${locale} trap count`);
      assert(question.explanation.steps.length >= 3, `${ql.qlId} ${seed} ${locale} worked solution too thin`);
      assert(question.explanation.visualWorking.length >= 3, `${ql.qlId} ${seed} ${locale} visual working`);
      if (ql.solveMode === "IDENTIFY_WORD_BY_ALPHA_PAIR_COUNT") {
        assert(!question.structuredPrompt.sequence?.length, `${ql.qlId} ${seed} ${locale} correct word leaked as source sequence`);
        assert(!question.structuredPrompt.word, `${ql.qlId} ${seed} ${locale} correct word leaked as source word`);
      } else {
        assert((question.structuredPrompt.sequence?.length ?? 0) > 0, `${ql.qlId} ${seed} ${locale} source sequence`);
      }
      assert(question.explanation.conclusion.includes(question.answer), `${ql.qlId} ${seed} ${locale} conclusion`);
      assert(!/undefined|null|\{\{|\}\}|ALP_|COMPLETION_TRAP_/.test(learnerText), `${ql.qlId} ${seed} ${locale} internal text`);
      assert(!rejectedSyntheticStem.test(question.stem), `${ql.qlId} ${seed} ${locale} synthetic directive stem: ${question.stem}`);
      assert(!rejectedGenericTrap.test(learnerText), `${ql.qlId} ${seed} ${locale} generic completion trap retained`);
      assert(!rejectedRegionalJargon.test(learnerText), `${ql.qlId} ${seed} ${locale} engineering terminology retained`);
      assert(question.stem.trim().endsWith("?"), `${ql.qlId} ${seed} ${locale} stem is not a natural question`);
      for (const analysis of question.explanation.distractorAnalyses) {
        const label = locale === "en-IN" ? `Option ${analysis.optionIndex + 1} (${analysis.optionValue})` : locale === "hi-IN" ? `विकल्प ${analysis.optionIndex + 1} (${analysis.optionValue})` : `ਚੋਣ ${analysis.optionIndex + 1} (${analysis.optionValue})`;
        assert(analysis.explanation.includes(label), `${ql.qlId} ${seed} ${locale} trap lacks option label ${label}`);
        assert(analysis.explanation.includes(question.answer), `${ql.qlId} ${seed} ${locale} trap omits verified answer`);
      }
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

const pairSample = generateAlp001Question("ALP-QL-105", 0, "en-IN");
assert(/How many pairs of letters/.test(pairSample.stem), "ALP-QL-105 lacks standard pair-question voice");
const transformSample = generateAlp001Question("ALP-QL-115", 0, "en-IN");
assert(/resulting letters are then arranged alphabetically/.test(transformSample.stem), "ALP-QL-115 omits the second-stage sorting instruction");
assert(transformSample.explanation.visualWorking.length >= 4, "ALP-QL-115 lacks intermediate transformation evidence");
const chapterEnd = generateAlp001Question("ALP-QL-156", 0, "en-IN");
assert(/how many letters are immediately followed by a digit/i.test(chapterEnd.stem), "ALP-QL-156 lacks natural composite scan wording");

console.log("ALP-001 CP-006 through CP-010 natural editorial audit passed.", {
  chapterQlCount: ALP_001_QLS.length,
  qlCount: qls.length,
  generated,
  checkpointCounts: Object.fromEntries([...checkpointCounts].sort()),
  answerPositions: positions,
  difficulties: Object.fromEntries([...difficulties].map(([key, value]) => [key, [...value].sort()])),
});
