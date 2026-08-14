import { malCp006Wave03MergeSplitAudit } from "./foundation/cp006-wave03-merge-split-analysis";

const report = malCp006Wave03MergeSplitAudit();
console.log(JSON.stringify(report, null, 2));
if (report.failures.length) process.exitCode = 1;
