import { assertContinuousDirectionQlIds } from "./DIR-001-CHAPTER-MANIFEST";
import { DIR_CP001_QLS, generateDirCp001Question } from "./DIR-CP-001";
import { DIR_CP002_QLS, generateDirCp002Question } from "./DIR-CP-002";
import { DIR_CP003_QLS, generateDirCp003Question } from "./DIR-CP-003";
import { DIR_CP004_QLS, generateDirCp004Question } from "./DIR-CP-004";
import { DIR_CP005_QLS, generateDirCp005Question } from "./DIR-CP-005";
import { DIR_CP006_QLS, generateDirCp006Question } from "./DIR-CP-006";
import { DIR_CP007_QLS, generateDirCp007Question } from "./DIR-CP-007";
import { DIR_CP008_QLS, generateDirCp008Question } from "./DIR-CP-008";

const DIR_001_IMPLEMENTED_QLS = [
  ...DIR_CP001_QLS,
  ...DIR_CP002_QLS,
  ...DIR_CP003_QLS,
  ...DIR_CP004_QLS,
  ...DIR_CP005_QLS,
  ...DIR_CP006_QLS,
  ...DIR_CP007_QLS,
  ...DIR_CP008_QLS,
] as const;

/**
 * The checkpoint registries preserve their point-in-time implementation status.
 * The public chapter registry is the manually approved English baseline used by
 * localization, Question Studio and chapter-wide generation.
 */
export const DIR_001_QLS = Object.freeze(
  DIR_001_IMPLEMENTED_QLS.map((ql) => Object.freeze({ ...ql, status: "REVIEWED" as const })),
);

assertContinuousDirectionQlIds(DIR_001_QLS);

export function directionQlById(qlId: string): (typeof DIR_001_QLS)[number] {
  const ql = DIR_001_QLS.find((candidate) => candidate.qlId === qlId);
  if (!ql) throw new Error(`Unknown DIR-001 QL: ${qlId}`);
  return ql;
}

export function generateDirectionQuestion(qlId: string, seed = 0) {
  const ql = directionQlById(qlId);
  switch (ql.checkpointId) {
    case "DIR-CP-001": return generateDirCp001Question(qlId, seed);
    case "DIR-CP-002": return generateDirCp002Question(qlId, seed);
    case "DIR-CP-003": return generateDirCp003Question(qlId, seed);
    case "DIR-CP-004": return generateDirCp004Question(qlId, seed);
    case "DIR-CP-005": return generateDirCp005Question(qlId, seed);
    case "DIR-CP-006": return generateDirCp006Question(qlId, seed);
    case "DIR-CP-007": return generateDirCp007Question(qlId, seed);
    case "DIR-CP-008": return generateDirCp008Question(qlId, seed);
    default: throw new Error(`DIR-001 generator is not implemented for checkpoint: ${String((ql as { checkpointId: string }).checkpointId)}`);
  }
}
