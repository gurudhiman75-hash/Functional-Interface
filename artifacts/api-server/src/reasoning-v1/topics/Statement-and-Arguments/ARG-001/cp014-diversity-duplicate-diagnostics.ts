import { createHash } from "node:crypto";

import { generateArgCp014QuestionStudioBatch } from "./cp014-manual-editorial-approval.ts";
import { ARG_QL_IDS } from "./types.ts";

const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
const REAL_PAPER_CELLS = [
  ["SSC_RECENT_2X4", "Easy"],
  ["SSC_RECENT_2X4", "Medium"],
  ["BANKING_CLASSIC_2X5", "Medium"],
  ["BANKING_CLASSIC_2X5", "Hard"],
  ["BANKING_COMBO_3X5", "Medium"],
  ["BANKING_COMBO_3X5", "Hard"],
  ["BANKING_COMBO_4X5", "Hard"],
] as const;

type Row = Readonly<Record<string, any> & {
  auditMode: "core" | "real-paper";
  auditProfile: string;
  auditQl: string;
  auditDifficulty: string;
}>;

function signature(question: Readonly<Record<string, any>>): string {
  return createHash("sha256").update(JSON.stringify([
    question.statement,
    question.arguments,
    question.options,
    question.correctIndex,
    question.explanation,
  ])).digest("hex");
}

function push(target: Row[], input: Record<string, unknown>, mode: "core" | "real-paper", profile: string, ql: string, difficulty: string) {
  const result = generateArgCp014QuestionStudioBatch(input);
  for (const question of result.questions as readonly Readonly<Record<string, any>>[]) {
    target.push(Object.freeze({ ...question, auditMode: mode, auditProfile: profile, auditQl: ql, auditDifficulty: difficulty }));
  }
}

const rows: Row[] = [];
for (const qlId of ARG_QL_IDS) {
  for (let index = 0; index < DIFFICULTIES.length; index += 1) {
    const difficulty = DIFFICULTIES[index]!;
    push(rows, {
      profileMode: "core",
      qlId,
      language: "en",
      difficulty,
      seed: `ARG-DIVERSITY-CORE:${qlId}:${difficulty}`,
      count: index === 0 ? 34 : 33,
    }, "core", "CORE", qlId, difficulty);
  }
}
for (let qlIndex = 0; qlIndex < ARG_QL_IDS.length; qlIndex += 1) {
  const qlId = ARG_QL_IDS[qlIndex]!;
  const targetForQl = qlIndex < 4 ? 67 : 66;
  const base = Math.floor(targetForQl / REAL_PAPER_CELLS.length);
  const extra = targetForQl - base * REAL_PAPER_CELLS.length;
  for (let cellIndex = 0; cellIndex < REAL_PAPER_CELLS.length; cellIndex += 1) {
    const [profile, difficulty] = REAL_PAPER_CELLS[cellIndex]!;
    push(rows, {
      profileMode: "real-paper",
      examProfile: profile,
      qlId,
      language: "en",
      difficulty,
      seed: `ARG-DIVERSITY-RP:${qlId}:${profile}:${difficulty}`,
      count: base + (cellIndex < extra ? 1 : 0),
    }, "real-paper", profile, qlId, difficulty);
  }
}

if (rows.length !== 1000) throw new Error(`Expected 1000 rows; received ${rows.length}`);

function summary(group: readonly Row[]) {
  const unique = new Set(group.map(signature)).size;
  return { total: group.length, unique, duplicates: group.length - unique, uniqueness: unique / group.length };
}

const byProfile: Record<string, ReturnType<typeof summary>> = {};
for (const profile of ["CORE", ...new Set(rows.filter((row) => row.auditMode === "real-paper").map((row) => row.auditProfile))]) {
  byProfile[profile] = summary(rows.filter((row) => row.auditProfile === profile));
}

const byQlMode: Record<string, ReturnType<typeof summary>> = {};
for (const ql of ARG_QL_IDS) {
  for (const mode of ["core", "real-paper"] as const) {
    const key = `${ql}:${mode}`;
    byQlMode[key] = summary(rows.filter((row) => row.auditQl === ql && row.auditMode === mode));
  }
}

const groups = new Map<string, Row[]>();
for (const row of rows) {
  const key = signature(row);
  const list = groups.get(key) ?? [];
  list.push(row);
  groups.set(key, list);
}
const duplicateGroups = [...groups.entries()]
  .filter(([, values]) => values.length > 1)
  .sort((a, b) => b[1].length - a[1].length);

let duplicateInstancesWithinCore = 0;
let duplicateInstancesWithinRealPaper = 0;
let crossModeDuplicateGroups = 0;
let crossProfileDuplicateGroups = 0;
for (const [, values] of duplicateGroups) {
  const coreCount = values.filter((row) => row.auditMode === "core").length;
  const rpCount = values.filter((row) => row.auditMode === "real-paper").length;
  if (coreCount > 1) duplicateInstancesWithinCore += coreCount - 1;
  if (rpCount > 1) duplicateInstancesWithinRealPaper += rpCount - 1;
  if (coreCount && rpCount) crossModeDuplicateGroups += 1;
  if (new Set(values.map((row) => row.auditProfile)).size > 1) crossProfileDuplicateGroups += 1;
}

const topDuplicateGroups = duplicateGroups.slice(0, 20).map(([sig, values]) => ({
  signature: sig.slice(0, 16),
  instances: values.length,
  qls: [...new Set(values.map((row) => row.auditQl))],
  modes: [...new Set(values.map((row) => row.auditMode))],
  profiles: [...new Set(values.map((row) => row.auditProfile))],
  difficulties: [...new Set(values.map((row) => row.auditDifficulty))],
  statement: String(values[0]?.statement ?? ""),
}));

console.log("ARG_DIVERSITY_DUPLICATE_DIAGNOSTICS_START");
console.log(JSON.stringify({
  overall: summary(rows),
  core: summary(rows.filter((row) => row.auditMode === "core")),
  realPaper: summary(rows.filter((row) => row.auditMode === "real-paper")),
  duplicateGroupCount: duplicateGroups.length,
  duplicateInstancesWithinCore,
  duplicateInstancesWithinRealPaper,
  crossModeDuplicateGroups,
  crossProfileDuplicateGroups,
  byProfile,
  byQlMode,
  topDuplicateGroups,
}, null, 2));
console.log("ARG_DIVERSITY_DUPLICATE_DIAGNOSTICS_END");
