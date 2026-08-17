import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  SAP_QUESTION_STUDIO_QLS,
  runSapQuestionStudioPipeline,
} from "./question-studio-adapter";

const OUTPUT_DIRECTORY = resolve(
  process.cwd(),
  "dist/quant-v4/sap-question-studio-repetition-diagnostic",
);
mkdirSync(OUTPUT_DIRECTORY, { recursive: true });

interface Row {
  qlId: string;
  cpId: string;
  state: number;
  sourceSeed: number;
  questionId: string;
  qlTitle: string;
  sourceIdentity: string;
  stem: string;
  options: readonly string[];
  answer: string;
  difficulty: string;
}

const rows: Row[] = [];
const byStem = new Map<string, Row[]>();

for (const descriptor of SAP_QUESTION_STUDIO_QLS) {
  const usedSourceSeeds = new Set<number>();
  for (let state = 1; state <= 3; state += 1) {
    let accepted: any | undefined;
    for (let candidate = 1; candidate <= 100; candidate += 1) {
      const question = runSapQuestionStudioPipeline(descriptor.checkpointId, {
        language: "en",
        questionLanguageId: descriptor.qlId,
        seed: `sap-repetition-diagnostic:${descriptor.qlId}:state-${state}:candidate-${candidate}`,
      }) as any;
      const sourceSeed = Number(question.traceability?.sourceSeed);
      if (!Number.isInteger(sourceSeed)) {
        throw new Error(`${descriptor.qlId}: diagnostic sourceSeed is missing.`);
      }
      if (usedSourceSeeds.has(sourceSeed)) continue;
      usedSourceSeeds.add(sourceSeed);
      accepted = question;
      break;
    }
    if (!accepted) {
      throw new Error(`${descriptor.qlId}: could not obtain three distinct source states.`);
    }

    const normalizedStem = String(accepted.stem).trim().replace(/\s+/gu, " ");
    const row: Row = {
      qlId: descriptor.qlId,
      cpId: descriptor.checkpointId,
      state,
      sourceSeed: Number(accepted.traceability.sourceSeed),
      questionId: String(accepted.questionId),
      qlTitle: descriptor.title,
      sourceIdentity: descriptor.sourceIdentity,
      stem: normalizedStem,
      options: [...accepted.options].map(String),
      answer: String(accepted.answer),
      difficulty: String(accepted.difficultyBand),
    };
    rows.push(row);
    const group = byStem.get(normalizedStem) ?? [];
    group.push(row);
    byStem.set(normalizedStem, group);
  }
}

const duplicateGroups = [...byStem.entries()]
  .filter(([, group]) => group.length > 1)
  .map(([stem, group]) => {
    const qlIds = [...new Set(group.map((row) => row.qlId))];
    const cpIds = [...new Set(group.map((row) => row.cpId))];
    const optionFingerprints = [...new Set(group.map((row) => JSON.stringify(row.options)))];
    const answerFingerprints = [...new Set(group.map((row) => row.answer))];
    return {
      stem,
      count: group.length,
      qlIds,
      cpIds,
      sameQl: qlIds.length === 1,
      crossQl: qlIds.length > 1,
      sameOptions: optionFingerprints.length === 1,
      sameAnswer: answerFingerprints.length === 1,
      rows: group,
    };
  })
  .sort((left, right) => right.count - left.count || left.stem.localeCompare(right.stem));

const sameQlGroups = duplicateGroups.filter((group) => group.sameQl);
const crossQlGroups = duplicateGroups.filter((group) => group.crossQl);
const exactQuestionGroups = duplicateGroups.filter((group) => group.sameOptions && group.sameAnswer);
const crossQlExactQuestionGroups = exactQuestionGroups.filter((group) => group.crossQl);

const summary = {
  status: duplicateGroups.length === 0 ? "NO_EXACT_STEM_REPETITION" : "REPETITION_DIAGNOSTIC_COMPLETE",
  qlCount: SAP_QUESTION_STUDIO_QLS.length,
  generatedStates: rows.length,
  distinctSourceStatesPerQl: 3,
  duplicateStemGroupCount: duplicateGroups.length,
  sameQlDuplicateGroupCount: sameQlGroups.length,
  crossQlDuplicateGroupCount: crossQlGroups.length,
  exactQuestionDuplicateGroupCount: exactQuestionGroups.length,
  crossQlExactQuestionDuplicateGroupCount: crossQlExactQuestionGroups.length,
};

const jsonPath = resolve(OUTPUT_DIRECTORY, "sap-question-studio-repetition-diagnostic.json");
const markdownPath = resolve(OUTPUT_DIRECTORY, "sap-question-studio-repetition-diagnostic.md");

writeFileSync(jsonPath, `${JSON.stringify({ summary, duplicateGroups, rows }, null, 2)}\n`, "utf8");

const markdown = [
  "# SAP Question Studio — Repetition Diagnostic",
  "",
  `Status: **${summary.status}**`,
  "",
  `- QLs sampled: ${summary.qlCount}`,
  `- Generated states: ${summary.generatedStates}`,
  `- Distinct underlying source states per QL: ${summary.distinctSourceStatesPerQl}`,
  `- Duplicate stem groups: ${summary.duplicateStemGroupCount}`,
  `- Same-QL duplicate groups: ${summary.sameQlDuplicateGroupCount}`,
  `- Cross-QL duplicate groups: ${summary.crossQlDuplicateGroupCount}`,
  `- Exact-question duplicate groups: ${summary.exactQuestionDuplicateGroupCount}`,
  `- Cross-QL exact-question duplicate groups: ${summary.crossQlExactQuestionDuplicateGroupCount}`,
  "",
  ...duplicateGroups.flatMap((group, index) => [
    `## ${index + 1}. ${group.count}× ${group.stem}`,
    "",
    `Classification: ${group.sameQl ? "same QL" : "cross QL"}; ${group.sameOptions ? "same options" : "different options"}; ${group.sameAnswer ? "same answer" : "different answer"}.`,
    "",
    ...group.rows.map((row) =>
      `- ${row.qlId} · ${row.cpId} · state ${row.state} · sourceSeed ${row.sourceSeed} · ${row.difficulty} · ${row.sourceIdentity} · answer ${JSON.stringify(row.answer)}`,
    ),
    "",
  ]),
].join("\n");
writeFileSync(markdownPath, `${markdown}\n`, "utf8");

console.log(JSON.stringify({ ...summary, jsonPath, markdownPath }));
