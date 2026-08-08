import { generateMenCp011ShellReviewBatch } from "./spherical-shells";

const records = generateMenCp011ShellReviewBatch().records;

function learnerSolutionText(question: any) {
  const learner = question.learnerSolution;
  return [
    learner?.formula ?? "",
    ...(learner?.steps ?? []),
    learner?.finalAnswer ?? "",
    learner?.shortcut ?? "",
    ...(learner?.wrongOptionAnalysis ?? []),
  ].join("\n");
}

function learnerText(question: any) {
  return [
    question.stem,
    ...question.options.map((option: any) => option.display),
    question.answer,
    learnerSolutionText(question),
  ].join("\n");
}

function findings(question: any) {
  const text = learnerText(question);
  const result: string[] = [];
  if (text.includes("\\pih")) result.push("MALFORMED_PI_COMMAND");
  if ((text.match(/\$/g) ?? []).length % 2 !== 0) result.push("UNBALANCED_DOLLARS");
  if (/\[(?:USED_|CALCULATED_|ADDED_|OMITTED_|RETURNED_|COPIED_|MEN-CP011-PROT-|FALLBACK_|UNCLASSIFIED)/.test(text)) {
    result.push("BRACKETED_INTERNAL_CODE");
  }
  if (/misconceptionId|prototypeId/.test(text)) result.push("METADATA_TOKEN");
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(text)) result.push("CONTROL_CHARACTER");
  return {
    prototypeId: question.prototypeId,
    seed: question.seed,
    piPolicy: question.piPolicy,
    dollarCount: (text.match(/\$/g) ?? []).length,
    findings: result,
    matchedInternalCode: text.match(/\[(?:USED_|CALCULATED_|ADDED_|OMITTED_|RETURNED_|COPIED_|MEN-CP011-PROT-|FALLBACK_|UNCLASSIFIED)[^\]]*\]/)?.[0] ?? null,
    metadataToken: text.match(/misconceptionId|prototypeId/)?.[0] ?? null,
    malformedPiContext: text.includes("\\pih")
      ? text.slice(Math.max(0, text.indexOf("\\pih") - 80), text.indexOf("\\pih") + 120)
      : null,
  };
}

const failures = records.map(findings).filter((record) => record.findings.length > 0);
console.log(JSON.stringify({
  recordCount: records.length,
  failureCount: failures.length,
  findingCounts: failures.reduce((counts: Record<string, number>, failure) => {
    for (const finding of failure.findings) counts[finding] = (counts[finding] ?? 0) + 1;
    return counts;
  }, {}),
  firstFailures: failures.slice(0, 8),
}, null, 2));
