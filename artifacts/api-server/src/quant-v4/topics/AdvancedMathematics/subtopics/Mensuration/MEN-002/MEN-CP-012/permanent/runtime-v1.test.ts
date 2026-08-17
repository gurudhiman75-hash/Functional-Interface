import { MEN_CP_012_SOURCE_CORRECTIONS_V4_AUTHORITY } from "../../cp012-foundation/source-corrections-v4";
import { MEN_CP_012_PERMANENT_ALLOCATION } from "./allocation";
import {
  MEN_CP_012_PERMANENT_ENGLISH_RUNTIME_AUTHORITY,
  generateMenCp012PermanentEnglishQuestionFromSource,
  listMenCp012PermanentEnglishSources,
} from "./runtime-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const sourceRows = listMenCp012PermanentEnglishSources();
assert(sourceRows.length === 13, `Expected 13 permanent source rows, got ${sourceRows.length}.`);
const declaredSources = new Set(sourceRows.flatMap((row) => row.sources.map((source) => `${row.qlId}:${source.id}`)));
assert(declaredSources.size === 42, `Expected 42 declared permanent source mappings, got ${declaredSources.size}.`);

const sourceHits = new Set<string>();
let generated = 0;
let correctedConeStates = 0;
for (const allocation of MEN_CP_012_PERMANENT_ALLOCATION) {
  const sourceRow = sourceRows.find((row) => row.qlId === allocation.qlId)!;
  assert(sourceRow.sources.length > 0, `${allocation.qlId}: source pool is empty.`);
  const positions = new Set<number>();
  const sourceIdsSeen = new Set<string>();

  for (let index = 0; index < 128; index += 1) {
    const source = sourceRow.sources[index % sourceRow.sources.length]!;
    const seed = `permanent-v1:${allocation.qlId}:${source.id}:${String(index).padStart(4, "0")}`;
    const first = generateMenCp012PermanentEnglishQuestionFromSource(allocation.qlId, source.id, seed);
    const second = generateMenCp012PermanentEnglishQuestionFromSource(allocation.qlId, source.id, seed);

    assert(first.authority === MEN_CP_012_PERMANENT_ENGLISH_RUNTIME_AUTHORITY, `${allocation.qlId}/${seed}: runtime authority mismatch.`);
    assert(first.permanentQlId === allocation.qlId, `${allocation.qlId}/${seed}: QL mismatch.`);
    assert(first.templateId === allocation.templateId, `${allocation.qlId}/${seed}: template mismatch.`);
    assert(first.solveModeId === allocation.solveModeId, `${allocation.qlId}/${seed}: solve-mode mismatch.`);
    assert(first.clusterId === allocation.clusterId, `${allocation.qlId}/${seed}: cluster mismatch.`);
    assert(first.sourceId === source.id, `${allocation.qlId}/${seed}: forced source mismatch.`);
    assert(first.stem === second.stem && first.answer === second.answer, `${allocation.qlId}/${seed}: deterministic replay drift.`);
    assert(first.correctIndex === second.correctIndex, `${allocation.qlId}/${seed}: answer-position replay drift.`);
    assert(JSON.stringify(first.options) === JSON.stringify(second.options), `${allocation.qlId}/${seed}: option replay drift.`);
    assert(first.verification.valid, `${allocation.qlId}/${seed}: source verification failed.`);
    assert(first.options.length === 4, `${allocation.qlId}/${seed}: expected four options.`);
    assert(new Set(first.options.map((option) => option.display)).size === 4, `${allocation.qlId}/${seed}: duplicate option displays.`);
    assert(first.options.filter((option) => option.isCorrect).length === 1, `${allocation.qlId}/${seed}: expected one correct option.`);
    assert(first.options[first.correctIndex]?.display === first.answer, `${allocation.qlId}/${seed}: displayed-answer parity failed.`);
    assert(first.explanation.steps.length >= 4, `${allocation.qlId}/${seed}: expected at least four explanation steps.`);
    assert(first.explanation.shortcut.length > 20, `${allocation.qlId}/${seed}: shortcut too weak.`);
    assert(first.explanation.traps.length >= 2, `${allocation.qlId}/${seed}: misconception coverage too weak.`);
    assert(first.explanation.steps.some((step) => /[=×√³²]|volume|ratio|percent|%/i.test(step.body)), `${allocation.qlId}/${seed}: explanation lacks question-specific mathematical work.`);
    assert(first.maturity === "PERMANENT_ENGLISH_RUNTIME_CANDIDATE", `${allocation.qlId}/${seed}: maturity mismatch.`);
    assert(first.reviewStatus === "AWAITING_HUMAN_ENGLISH_REVIEW", `${allocation.qlId}/${seed}: review status mismatch.`);
    assert(!first.englishImplementationFrozen && !first.active && !first.questionStudioDiscoverable && !first.publiclyPublishable,
      `${allocation.qlId}/${seed}: lifecycle leaked.`);
    assert(first.questionBankStatus === "NOT_STORED" && first.testEligibility === "INELIGIBLE", `${allocation.qlId}/${seed}: downstream gate leaked.`);

    if (source.id === "V3-SPHERE-TO-CONE-DIAMETER-HEIGHT-RATIO") {
      correctedConeStates += 1;
      assert(first.sourceKind === "V4_CORRECTION", `${allocation.qlId}/${seed}: corrected cone source must use V4 source kind.`);
      assert(first.sourceAuthority === MEN_CP_012_SOURCE_CORRECTIONS_V4_AUTHORITY, `${allocation.qlId}/${seed}: corrected cone source authority mismatch.`);
      assert(first.stem.includes("cone of height"), `${allocation.qlId}/${seed}: corrected cone source must give height.`);
      assert(!first.stem.includes("whose base radius"), `${allocation.qlId}/${seed}: corrected cone source must not give away radius.`);
      assert(first.explanation.steps.some((step) => step.body.includes("r² =") && step.body.includes("so r =")), `${allocation.qlId}/${seed}: corrected cone source must recover radius by square root.`);
    }

    positions.add(first.correctIndex);
    sourceIdsSeen.add(first.sourceId);
    sourceHits.add(`${allocation.qlId}:${first.sourceId}`);
    generated += 1;
  }

  assert(positions.size === 4, `${allocation.qlId}: permanent runtime must reach A/B/C/D.`);
  assert(sourceIdsSeen.size === sourceRow.sources.length, `${allocation.qlId}: not every declared source was exercised.`);
}

const missingSources = [...declaredSources].filter((source) => !sourceHits.has(source));
assert(missingSources.length === 0, `Permanent runtime missed declared sources: ${missingSources.join(", ")}`);
assert(generated === 1664, `Expected 1,664 permanent proof questions, got ${generated}.`);
assert(correctedConeStates > 0, "Corrected cone-ratio representation was never exercised.");

console.log(JSON.stringify({
  authority: MEN_CP_012_PERMANENT_ENGLISH_RUNTIME_AUTHORITY,
  permanentQlCount: MEN_CP_012_PERMANENT_ALLOCATION.length,
  declaredSourceCount: declaredSources.size,
  exercisedSourceCount: sourceHits.size,
  deterministicQuestionCount: generated,
  correctedConeStates,
  englishImplementationFrozen: false,
  productLocked: true,
}, null, 2));
