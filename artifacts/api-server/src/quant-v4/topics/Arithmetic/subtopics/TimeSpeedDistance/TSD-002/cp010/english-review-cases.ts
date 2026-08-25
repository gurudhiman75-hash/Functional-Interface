import { generateTsdCp010ExecutableCases } from "./executable-generator";
import type { TsdCp010ExecutableInput, TsdCp010ExecutableSolution } from "./executable-types";
import { TSD_CP010_QL_ALLOCATION, type TsdCp010QlId } from "./ql-allocation";

export type TsdCp010EnglishReviewCase = Readonly<{
  qlId: TsdCp010QlId;
  familyId: string;
  input: TsdCp010ExecutableInput;
  solution: TsdCp010ExecutableSolution;
}>;

const all = generateTsdCp010ExecutableCases();
const letters = ["A", "B", "C", "D", "E", "F"] as const;

export const TSD_CP010_ENGLISH_REVIEW_CASES: readonly TsdCp010EnglishReviewCase[] = Object.freeze(
  TSD_CP010_QL_ALLOCATION.flatMap(({ qlId, authorityKey }) => {
    const cases = all.filter((x) => x.authorityKey === authorityKey).slice(0, 6);
    if (cases.length !== 6) throw new Error(`${qlId}: expected six executable review cases`);
    return cases.map((entry, index) => Object.freeze({
      qlId,
      familyId: `${qlId.replace("TSD-QL-", "")}-${letters[index]}`,
      input: entry.input,
      solution: entry.expected,
    }));
  }),
);