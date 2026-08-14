import {
  MAL_CP006_PERMANENT_ALLOCATION,
  MAL_CP006_PERMANENT_ALLOCATION_ID,
  MAL_CP006_PERMANENT_QL_RANGE,
} from "./foundation/cp006-permanent-allocation";

const lines: string[] = [];
lines.push("# MAL-CP-006 Wave 05 — Permanent Allocation Review");
lines.push("");
lines.push(`- Allocation: \`${MAL_CP006_PERMANENT_ALLOCATION_ID}\``);
lines.push(`- Range: \`${MAL_CP006_PERMANENT_QL_RANGE}\``);
lines.push("- Language: English only");
lines.push("- Permanent identities: frozen");
lines.push("- Question Studio / Question Bank / test / public: disabled");
lines.push("");
lines.push("| QL | Solve mode | Shared core | Prototype | Learner contract |");
lines.push("|---|---|---|---|---|");
for (const entry of MAL_CP006_PERMANENT_ALLOCATION) {
  lines.push(
    `| \`${entry.qlId}\` | \`${entry.solveModeId}\` | \`${entry.sharedCoreId}\` | \`${entry.prototypeId}\` | ${entry.learnerContract} |`,
  );
}
lines.push("");
lines.push("## Lifecycle lock");
lines.push("");
lines.push("Every entry has `permanentIdentityFrozen: true` and all delivery flags set to `false`. This review is identity allocation evidence only; it is not release activation.");
lines.push("");
lines.push("## Boundary lock");
lines.push("");
lines.push("The common-final-concentration equal-exchange projection remains outside this allocation at the CP001 weighted-blend boundary. Wave04 longer-forward and asymmetric-inverse generalisations remain inside `MAL-QL-061` and `MAL-QL-066`; they do not create extra QLs.");

console.log(lines.join("\n"));
