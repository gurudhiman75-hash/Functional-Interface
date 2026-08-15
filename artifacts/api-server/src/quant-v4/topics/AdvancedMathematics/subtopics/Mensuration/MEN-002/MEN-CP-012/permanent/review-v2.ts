import { MEN_CP_012_PERMANENT_ALLOCATION } from "./allocation";
import {
  generateMenCp012PermanentEnglishQuestionFromSourceV2,
  listMenCp012PermanentEnglishSourcesV2,
  type MenCp012PermanentEnglishQuestionV2,
} from "./runtime-v2";
import type { MenCp012PermanentSource } from "./runtime-v1";

const SOURCE_ROWS = listMenCp012PermanentEnglishSourcesV2();

function candidate(
  qlId: (typeof MEN_CP_012_PERMANENT_ALLOCATION)[number]["qlId"],
  source: MenCp012PermanentSource,
  position: number,
  usedStems: Set<string>,
) {
  for (let attempt = position; attempt < 8192; attempt += 4) {
    const seed = `permanent-review-v2:${qlId}:${source.id}:${String(attempt).padStart(5, "0")}`;
    const question = generateMenCp012PermanentEnglishQuestionFromSourceV2(qlId, source.id, seed);
    if (question.correctIndex !== position || usedStems.has(question.stem)) continue;
    return question;
  }
  return null;
}

export function buildMenCp012PermanentEnglishReviewV2() {
  const records: MenCp012PermanentEnglishQuestionV2[] = [];
  const globalPositionCounts = [0, 0, 0, 0];

  for (const allocation of MEN_CP_012_PERMANENT_ALLOCATION) {
    const sourceRow = SOURCE_ROWS.find((row) => row.qlId === allocation.qlId)!;
    const sources = sourceRow.sources;
    const selected: MenCp012PermanentEnglishQuestionV2[] = [];
    const usedStems = new Set<string>();
    const usedSources = new Set<string>();
    const localPositions = new Set<number>();

    for (let index = 0; index < Math.min(4, sources.length); index += 1) {
      const source = sources[index]!;
      const question = candidate(allocation.qlId, source, index, usedStems);
      if (!question) throw new Error(`${allocation.qlId}/${source.id}: could not build V2 review state at position ${index}.`);
      selected.push(question);
      usedStems.add(question.stem);
      usedSources.add(question.sourceId);
      localPositions.add(question.correctIndex);
      globalPositionCounts[question.correctIndex] += 1;
    }

    for (let position = 0; position < 4; position += 1) {
      if (localPositions.has(position)) continue;
      let question: MenCp012PermanentEnglishQuestionV2 | null = null;
      for (const source of sources) {
        question = candidate(allocation.qlId, source, position, usedStems);
        if (question) break;
      }
      if (!question) throw new Error(`${allocation.qlId}: could not fill V2 review answer position ${position}.`);
      selected.push(question);
      usedStems.add(question.stem);
      usedSources.add(question.sourceId);
      localPositions.add(question.correctIndex);
      globalPositionCounts[question.correctIndex] += 1;
    }

    for (const source of sources) {
      if (usedSources.has(source.id)) continue;
      const orderedPositions = [0, 1, 2, 3].sort(
        (a, b) => globalPositionCounts[a]! - globalPositionCounts[b]!,
      );
      let question: MenCp012PermanentEnglishQuestionV2 | null = null;
      for (const position of orderedPositions) {
        question = candidate(allocation.qlId, source, position, usedStems);
        if (question) break;
      }
      if (!question) throw new Error(`${allocation.qlId}/${source.id}: could not expose V2 source in review.`);
      selected.push(question);
      usedStems.add(question.stem);
      usedSources.add(question.sourceId);
      localPositions.add(question.correctIndex);
      globalPositionCounts[question.correctIndex] += 1;
    }

    if (localPositions.size !== 4 || usedSources.size !== sources.length) {
      throw new Error(`${allocation.qlId}: V2 source/position review closure failed.`);
    }
    records.push(...selected);
  }

  return records;
}

export function auditMenCp012PermanentEnglishReviewV2() {
  const records = buildMenCp012PermanentEnglishReviewV2();
  const declared = new Set(SOURCE_ROWS.flatMap((row) => row.sources.map((source) => `${row.qlId}:${source.id}`)));
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
    noSpacedPercent: records.every(
      (question) =>
        !/\d+(?:\.\d+)?\s+%/.test(question.answer) &&
        question.options.every((option) => !/\d+(?:\.\d+)?\s+%/.test(option.display)),
    ),
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
