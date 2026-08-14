import { INE_001_CLOSURE_GROUPS } from "../chapter-closure/registry";

export type IneContentClass = "EXAM_FACING" | "GUIDED_ONLY";
export type IneOptionStandard = "EXAMTREE_FOUR_OPTION" | "GUIDED_INTERNAL";

const CONTENT_CLASS_BY_AUTHORITY = new Map(
  INE_001_CLOSURE_GROUPS.flatMap((group) =>
    group.authorityIds.map(
      (authorityId) => [
        authorityId,
        group.decision === "PERMANENT_QL_CANDIDATE" ? "EXAM_FACING" : "GUIDED_ONLY",
      ] as const,
    ),
  ),
);

export function ineContentClass(authorityId: string): IneContentClass {
  const contentClass = CONTENT_CLASS_BY_AUTHORITY.get(authorityId);
  if (!contentClass) throw new Error(`INE-001 authority has no closure scope: ${authorityId}`);
  return contentClass;
}

export function ineOptionStandard(authorityId: string): IneOptionStandard {
  return ineContentClass(authorityId) === "EXAM_FACING"
    ? "EXAMTREE_FOUR_OPTION"
    : "GUIDED_INTERNAL";
}
