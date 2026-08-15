import { MEN_CP_012_PERMANENT_ALLOCATION } from "./allocation";
import {
  generateMenCp012PermanentEnglishQuestionFromSource,
  listMenCp012PermanentEnglishSources,
  type MenCp012PermanentEnglishQuestion,
  type MenCp012PermanentSource,
} from "./runtime-v1";

const SOURCE_ROWS = listMenCp012PermanentEnglishSources();

function candidate(
  qlId: (typeof MEN_CP_012_PERMANENT_ALLOCATION)[number]["qlId"],
  source: MenCp012PermanentSource,
  position: number,
  usedStems: Set<string>,
) {
  for (let attempt = position; attempt < 8192; attempt += 4) {
    const seed = `permanent-review-v1:${qlId}:${source.id}:${String(attempt).padStart(5, "0")}`;
    const question = generateMenCp012PermanentEnglishQuestionFromSource(qlId, source.id, seed);
    if (question.correctIndex !== position) continue;
    if (usedStems.has(question.stem)) continue;
    return question;
  }
  return null;
}

function leastUsedPosition(counts: readonly number[]) {
  let best = 0;
  for (let index = 1; index < 4; index += 1) {
    if (counts[index]! < counts[best]!) best = index;
  }
  return best;
}

export function buildMenCp012PermanentEnglishReviewV1() {
  const records: MenCp012PermanentEnglishQuestion[] = [];
  const globalPositionCounts = [0, 0, 0, 0];

  for (const allocation of MEN_CP_012_PERMANENT_ALLOCATION) {
    const sourceRow = SOURCE_ROWS.find((row) => row.qlId === allocation.qlId)!;
    const sources = sourceRow.sources;
    const selected: MenCp012PermanentEnglishQuestion[] = [];
    const usedStems = new Set<string>();
    const usedSources = new Set<string>();
    const localPositions = new Set<number>();

    // First four source slots establish A/B/C/D where source breadth permits.
    for (let index = 0; index < Math.min(4, sources.length); index += 1) {
      const source = sources[index]!;
      const position = index;
      const question = candidate(allocation.qlId, source, position, usedStems);
      if (!question) throw new Error(`${allocation.qlId}/${source.id}: could not build initial review state at position ${position}.`);
      selected.push(question);
      usedStems.add(question.stem);
      usedSources.add(question.sourceId);
      localPositions.add(question.correctIndex);
      globalPositionCounts[question.correctIndex] += 1;
    }

    // If there are fewer than four sources, reuse them with distinct states so
    // each permanent QL still demonstrates all answer positions.
    for (let position = 0; position < 4; position += 1) {
      if (localPositions.has(position)) continue;
      let question: MenCp012PermanentEnglishQuestion | null = null;
      for (let sourceIndex = 0; sourceIndex < sources.length && !question; sourceIndex += 1) {
        question = candidate(allocation.qlId, sources[sourceIndex]!, position, usedStems);
      }
      if (!question) throw new Error(`${allocation.qlId}: could not reach answer position ${position} with a distinct review stem.`);
      selected.push(question);
      usedStems.add(question.stem);
      usedSources.add(question.sourceId);
      localPositions.add(question.correctIndex);
      globalPositionCounts[question.correctIndex] += 1;
    }

    // Cover every remaining representation exactly once in the human artifact;
    // choose the currently least-used global answer position to keep the review
    // balanced without manufacturing duplicate stems.
    for (const source of sources) {
      if (usedSources.has(source.id)) continue;
      const orderedPositions = [0, 1, 2, 3].sort(
        (a, b) => globalPositionCounts[a]! - globalPositionCounts[b]!,
      );
      let question: MenCp012PermanentEnglishQuestion | null = null;
      for (const position of orderedPositions) {
        question = candidate(allocation.qlId, source, position, usedStems);
        if (question) break;
      }
      if (!question) throw new Error(`${allocation.qlId}/${source.id}: could not build distinct source-complete review state.`);
      selected.push(question);
      usedStems.add(question.stem);
      usedSources.add(question.sourceId);
      localPositions.add(question.correctIndex);
      globalPositionCounts[question.correctIndex] += 1;
    }

    if (localPositions.size !== 4) throw new Error(`${allocation.qlId}: review does not cover A/B/C/D.`);
    if (usedSources.size !== sources.length) throw new Error(`${allocation.qlId}: review source coverage incomplete.`);
    records.push(...selected);
  }

  return records;
}

export function auditMenCp012PermanentEnglishReviewV1() {
  const records = buildMenCp012PermanentEnglishReviewV1();
  const sourceRows = listMenCp012PermanentEnglishSources();
  const declared = new Set(sourceRows.flatMap((row) => row.sources.map((source) => `${row.qlId}:${source.id}`)));
  const covered = new Set(records.map((question) => `${question.permanentQlId}:${question.sourceId}`));
  const positions = [0, 0, 0, 0];
  for (const question of records) positions[question.correctIndex] += 1;
  return {
    reviewRecordCount: records.length,
    permanentQlCount: new Set(records.map((question) => question.permanentQlId)).size,
    uniqueStemCount: new Set(records.map((question) => question.stem)).size,
    declaredSourceCount: declared.size,
    coveredSourceCount: covered.size,
    missingSources: [...declared].filter((source) => !covered.has(source)),
    correctPositions: { A: positions[0], B: positions[1], C: positions[2], D: positions[3] },
    answerPositionSpread: Math.max(...positions) - Math.min(...positions),
    everyQlHasAllFourPositions: MEN_CP_012_PERMANENT_ALLOCATION.every((allocation) => {
      const slice = records.filter((question) => question.permanentQlId === allocation.qlId);
      return new Set(slice.map((question) => question.correctIndex)).size === 4;
    }),
    allVerified: records.every((question) => question.verification.valid),
    allUniqueOptions: records.every((question) => new Set(question.options.map((option) => option.display)).size === 4),
    productLocked: records.every(
      (question) =>
        !question.englishImplementationFrozen &&
        !question.active &&
        !question.questionStudioDiscoverable &&
        question.questionBankStatus === "NOT_STORED" &&
        question.testEligibility === "INELIGIBLE" &&
        !question.publiclyPublishable,
    ),
  } as const;
}
