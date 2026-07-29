import { readFileSync, writeFileSync } from "node:fs";

const reportPath = "dist/quant-v4/tmw-001-english-gap-audit.json";
const report = JSON.parse(readFileSync(reportPath, "utf8"));
const imperative = /^(?:How|What|Which|Who|When|Where|Find|Calculate|Determine|State|Identify|Choose|Work out)\b/i;

let acceptedImperativeTargets = 0;
let retainedTargetBlockers = 0;
const findings = report.findings.flatMap((finding: any) => {
  if (finding.code !== "STEM_TARGET_PUNCTUATION") return [finding];
  const stem = String(finding.sample ?? "").trim();
  const lastSentence = stem.split(/(?<=[.!?])\s+/).at(-1) ?? stem;
  if (stem.endsWith("?") || imperative.test(lastSentence)) {
    acceptedImperativeTargets += 1;
    return [];
  }
  retainedTargetBlockers += 1;
  return [{
    ...finding,
    code: "STEM_TARGET_SYNTAX",
    detail: "Stem does not end with an explicit interrogative or imperative target.",
  }];
});

report.findings = findings;
report.summary.hardFailures = findings.filter((finding: any) => finding.severity === "HARD_FAILURE").length;
report.summary.freezeBlockers = findings.filter((finding: any) => finding.severity === "FREEZE_BLOCKER").length;
report.summary.observations = findings.filter((finding: any) => finding.severity === "OBSERVATION").length;
report.calibration = {
  acceptedImperativeTargets,
  retainedTargetBlockers,
  rule: "A stem target is explicit when it ends with ? or its final sentence begins with an approved imperative/question word.",
};

writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(JSON.stringify({
  acceptedImperativeTargets,
  retainedTargetBlockers,
  hardFailures: report.summary.hardFailures,
  freezeBlockers: report.summary.freezeBlockers,
}, null, 2));
