import { MEN_CP_012_PERMANENT_ALLOCATION } from "./allocation";
import { auditMenCp012PermanentMetadataV2 } from "./metadata-v2";
import {
  MEN_CP_012_PERMANENT_ENGLISH_RUNTIME_V2_AUTHORITY,
  generateMenCp012PermanentEnglishQuestionFromSourceV2,
  listMenCp012PermanentEnglishSourcesV2,
} from "./runtime-v2";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function countParts(answer: string, clusterId: string) {
  const withUnit = /^(\d+)\s+(spheres|cubes|cylinders|coins)$/.exec(answer);
  if (withUnit) return { value: Number(withUnit[1]), unit: withUnit[2] };
  if (clusterId === "RECAST_COUNT_DIRECT" && /^\d+$/.test(answer)) return { value: Number(answer), unit: "" };
  return null;
}

function isVolumeRatioDistractor(answer: number, wrong: number) {
  return (
    wrong * 2 === answer ||
    wrong * 3 === answer ||
    wrong * 4 === answer ||
    wrong === answer * 2 ||
    wrong === answer * 3 ||
    wrong === answer * 4
  );
}

const metadataAudit = auditMenCp012PermanentMetadataV2();
assert(metadataAudit.permanentQlCount === 13, "Effective metadata must preserve all 13 permanent QLs.");
assert(metadataAudit.ql157Semantic === "COUNT_OR_LENGTH", `QL-157 semantic must be COUNT_OR_LENGTH; got ${metadataAudit.ql157Semantic}.`);
assert(metadataAudit.ql159Semantic === "COUNT_OR_LENGTH", `QL-159 semantic must be COUNT_OR_LENGTH; got ${metadataAudit.ql159Semantic}.`);
assert(metadataAudit.identityUnchanged, "Metadata correction must not change permanent QL/template/solve-mode identity.");

const sourceRows = listMenCp012PermanentEnglishSourcesV2();
const declaredSources = new Set(sourceRows.flatMap((row) => row.sources.map((source) => `${row.qlId}:${source.id}`)));
const sourceHits = new Set<string>();
let generated = 0;
let derivedExplanationCount = 0;
let countOptionAuditCount = 0;
const secondaryStems = new Set<string>();
const secondaryAnswers = new Set<string>();

for (const allocation of MEN_CP_012_PERMANENT_ALLOCATION) {
  const sourceRow = sourceRows.find((row) => row.qlId === allocation.qlId)!;
  const positions = new Set<number>();
  for (let index = 0; index < 128; index += 1) {
    const source = sourceRow.sources[index % sourceRow.sources.length]!;
    const seed = `permanent-v2:${allocation.qlId}:${source.id}:${String(index).padStart(4, "0")}`;
    const question = generateMenCp012PermanentEnglishQuestionFromSourceV2(allocation.qlId, source.id, seed);

    assert(question.authority === MEN_CP_012_PERMANENT_ENGLISH_RUNTIME_V2_AUTHORITY, `${allocation.qlId}/${seed}: V2 authority mismatch.`);
    assert(question.permanentQlId === allocation.qlId && question.clusterId === allocation.clusterId, `${allocation.qlId}/${seed}: permanent identity drift.`);
    assert(question.sourceId === source.id, `${allocation.qlId}/${seed}: forced source drift.`);
    assert(question.verification.valid, `${allocation.qlId}/${seed}: verification failed.`);
    assert(question.options.length === 4 && new Set(question.options.map((option) => option.display)).size === 4, `${allocation.qlId}/${seed}: option contract failed.`);
    assert(question.options.filter((option) => option.isCorrect).length === 1, `${allocation.qlId}/${seed}: expected one correct option.`);
    assert(question.options[question.correctIndex]?.display === question.answer, `${allocation.qlId}/${seed}: displayed-answer parity failed.`);
    assert(!/\d+(?:\.\d+)?\s+%/.test(question.answer), `${allocation.qlId}/${seed}: percentage answer contains space before %.`);
    assert(question.options.every((option) => !/\d+(?:\.\d+)?\s+%/.test(option.display)), `${allocation.qlId}/${seed}: percentage option contains space before %.`);
    assert(question.explanation.steps.every((step) => step.body !== "Write total usable source volume equal to total target volume."), `${allocation.qlId}/${seed}: generic Wave-02 filler survived.`);
    assert(question.explanation.steps.every((step) => step.body !== "Keep all dimensions in consistent units before evaluating the conservation relation."), `${allocation.qlId}/${seed}: generic Wave-03 filler survived.`);
    assert(question.explanation.steps.every((step) => step.body !== "Convert linear units before applying powers; apply any loss/yield fraction to material volume."), `${allocation.qlId}/${seed}: generic Wave-02 unit filler survived.`);
    assert(question.explanation.traps.every((trap) => trap !== "Recasting conserves volume, not surface area." && trap !== "Do not reverse source and target volume factors."), `${allocation.qlId}/${seed}: generic Wave-02 trap survived.`);
    assert(question.explanation.steps.length >= 4 && question.explanation.traps.length >= 2, `${allocation.qlId}/${seed}: teaching contract failed.`);

    const count = countParts(question.answer, question.clusterId);
    if (count) {
      const wrongValues = question.options
        .filter((option) => !option.isCorrect)
        .map((option) => Number.parseInt(option.display, 10));
      assert(wrongValues.every((wrong) => Number.isInteger(wrong) && isVolumeRatioDistractor(count.value, wrong)), `${allocation.qlId}/${seed}: count distractors must reflect volume-ratio mistakes; got ${wrongValues.join(", ")} for ${count.value}.`);
      countOptionAuditCount += 1;
    }

    if (question.sourceKind === "WAVE02" || question.sourceKind === "WAVE03") derivedExplanationCount += 1;
    if (question.sourceId === "V3-UNEQUAL-SPHERES-TO-SPHERE-SURFACE-DECREASE") {
      secondaryStems.add(question.stem);
      secondaryAnswers.add(question.answer);
      assert(question.sourceAuthority === "MEN-CP012-PERMANENT-EDITORIAL-V2", `${allocation.qlId}/${seed}: secondary-measure diversity must use editorial V2 source authority.`);
      assert(question.stem.includes("correct to two decimal places"), `${allocation.qlId}/${seed}: secondary-measure rounding request missing.`);
      assert(/^\d+\.\d{2}%$/.test(question.answer), `${allocation.qlId}/${seed}: secondary-measure answer precision mismatch.`);
    }

    assert(!question.englishImplementationFrozen && !question.active && !question.questionStudioDiscoverable && !question.publiclyPublishable, `${allocation.qlId}/${seed}: lifecycle leaked.`);
    assert(question.questionBankStatus === "NOT_STORED" && question.testEligibility === "INELIGIBLE", `${allocation.qlId}/${seed}: downstream gate leaked.`);
    positions.add(question.correctIndex);
    sourceHits.add(`${allocation.qlId}:${question.sourceId}`);
    generated += 1;
  }
  assert(positions.size === 4, `${allocation.qlId}: V2 runtime must reach A/B/C/D.`);
}

const missingSources = [...declaredSources].filter((source) => !sourceHits.has(source));
assert(generated === 1664, `Expected 1,664 V2 proof questions, got ${generated}.`);
assert(missingSources.length === 0, `V2 runtime missed sources: ${missingSources.join(", ")}`);
assert(derivedExplanationCount > 0, "Derived-source explanation polish was not exercised.");
assert(countOptionAuditCount > 0, "Count-option realism audit was not exercised.");
assert(secondaryStems.size >= 8, `Secondary-measure family needs at least eight distinct stems across proof; got ${secondaryStems.size}.`);
assert(secondaryAnswers.size >= 4, `Secondary-measure family needs at least four distinct percentage answers; got ${secondaryAnswers.size}.`);

console.log(JSON.stringify({
  authority: MEN_CP_012_PERMANENT_ENGLISH_RUNTIME_V2_AUTHORITY,
  deterministicQuestionCount: generated,
  declaredSourceCount: declaredSources.size,
  exercisedSourceCount: sourceHits.size,
  derivedExplanationCount,
  countOptionAuditCount,
  secondaryDistinctStems: secondaryStems.size,
  secondaryDistinctAnswers: secondaryAnswers.size,
  metadataCorrection: { ql157: metadataAudit.ql157Semantic, ql159: metadataAudit.ql159Semantic },
  englishImplementationFrozen: false,
  productLocked: true,
}, null, 2));
