import { buildBlr001ApprovedEnglishFreezeAudit } from "./blr-001-approved-english-freeze-audit";

const EXAM_DIRECTIVE = /^(?:select|identify|choose|find|determine|complete|fill|mark|pick)\b/i;

export function buildBlr001ApprovedEnglishFreezeReviewedAudit() {
  const base = buildBlr001ApprovedEnglishFreezeAudit();
  const acceptedExamDirectives = base.findings.filter((finding) =>
    finding.code === "NON_QUESTION_STEM" && EXAM_DIRECTIVE.test(finding.detail),
  );
  const acceptedStructuredStems = base.findings.filter((finding) =>
    finding.code === "LONG_STEM" && finding.itemId.includes("-QL034-"),
  );
  const accepted = new Set([...acceptedExamDirectives, ...acceptedStructuredStems]);
  const findings = base.findings.filter((finding) => !accepted.has(finding));
  const blockerFindings = findings.filter((finding) => finding.severity === "BLOCKER");
  const warningFindings = findings.filter((finding) => finding.severity === "WARNING");
  return {
    ...base,
    findings,
    blockerFindings,
    warningFindings,
    blockerCount: blockerFindings.length,
    warningCount: warningFindings.length,
    acceptedExamDirectiveStemCount: acceptedExamDirectives.length,
    acceptedStructuredStemCount: acceptedStructuredStems.length,
    verdict: blockerFindings.length === 0
      ? "APPROVED_CORPUS_ENGLISH_FREEZE_REVIEW_CANDIDATE"
      : "APPROVED_CORPUS_ENGLISH_FREEZE_BLOCKED",
  } as const;
}
