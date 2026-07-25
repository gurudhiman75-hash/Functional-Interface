import { assertContinuousDirectionQlIds } from "./DIR-001-CHAPTER-MANIFEST";
import { DIR_CP001_QLS, generateDirCp001Question } from "./DIR-CP-001";
import { DIR_CP002_QLS, generateDirCp002Question } from "./DIR-CP-002";

export const DIR_001_QLS = [...DIR_CP001_QLS, ...DIR_CP002_QLS] as const;

assertContinuousDirectionQlIds(DIR_001_QLS);

export function directionQlById(qlId: string): (typeof DIR_001_QLS)[number] {
  const ql = DIR_001_QLS.find((candidate) => candidate.qlId === qlId);
  if (!ql) {
    throw new Error(`Unknown DIR-001 QL: ${qlId}`);
  }
  return ql;
}

export function generateDirectionQuestion(qlId: string, seed = 0) {
  const ql = directionQlById(qlId);
  switch (ql.checkpointId) {
    case "DIR-CP-001":
      return generateDirCp001Question(qlId, seed);
    case "DIR-CP-002":
      return generateDirCp002Question(qlId, seed);
    default:
      throw new Error(`Checkpoint ${String(ql.checkpointId)} is not wired into DIR-001 generation`);
  }
}

export const DIR_001_RUNTIME_REGISTRY = Object.freeze({
  packageId: "DIR-001",
  qlCount: DIR_001_QLS.length,
  qls: DIR_001_QLS,
  generate: generateDirectionQuestion,
});
