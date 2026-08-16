import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { INT_CP005_V16_1_QL_IDS, generateIntCp005QuestionV16_1Final } from "./cp005-variable-growth-decay-runtime-v16-1-final";
import { INT_CP005_V16_1_LOCALIZED_VERSION, generateIntCp005QuestionV16_1Localized } from "./cp005-variable-growth-decay-runtime-v16-1-localized";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
function templateId(fingerprint: string): string {
  const match = fingerprint.match(/INT-QL-[0-9]+-T([123])/u);
  if (!match) throw new Error(`template marker missing from fingerprint: ${fingerprint}`);
  return `T${match[1]}`;
}

const selected: { qlId: typeof INT_CP005_V16_1_QL_IDS[number]; seed: string; template: string }[] = [];
for (const qlId of INT_CP005_V16_1_QL_IDS) {
  const found = new Map<string, string>();
  for (let index = 0; index < 1200 && found.size < 3; index += 1) {
    const seed = `int-cp005-v16.1-review-${qlId}-${index}`;
    const en = generateIntCp005QuestionV16_1Final(qlId, seed);
    const t = templateId(en.mathematicalFingerprint);
    if (!found.has(t)) found.set(t, seed);
  }
  assert(found.size === 3, `${qlId}: could not capture all three English templates`);
  for (const t of ["T1", "T2", "T3"]) selected.push({ qlId, seed: found.get(t)!, template: t });
}

const lines: string[] = [];
lines.push("# INT-CP-005 V16.1 Diversity-Hardened Multilingual Review");
lines.push("");
lines.push(`Localization: \`${INT_CP005_V16_1_LOCALIZED_VERSION}\``);
lines.push("");
lines.push("**Status:** hardening candidate; not frozen, not merged, not Question-Studio activated.");
lines.push("");
lines.push("**Review design:** one matched mathematical state for every QL × each of the three English stem templates, shown in English, Hindi and Punjabi.");
lines.push("");

function writeQuestion(title: string, q: ReturnType<typeof generateIntCp005QuestionV16_1Final> | ReturnType<typeof generateIntCp005QuestionV16_1Localized>) {
  lines.push(`### ${title}`);
  lines.push("");
  lines.push(q.presentation.markdown);
  if (q.presentation.table) {
    lines.push("");
    lines.push(`| ${q.presentation.table.headers.join(" | ")} |`);
    lines.push(`| ${q.presentation.table.headers.map(() => "---").join(" | ")} |`);
    for (const row of q.presentation.table.rows) lines.push(`| ${row.join(" | ")} |`);
  }
  lines.push("");
  q.options.forEach((option, index) => lines.push(`${String.fromCharCode(65 + index)}. ${option.text}`));
  lines.push("");
  lines.push(`**Correct:** ${String.fromCharCode(65 + q.correctIndex)}. ${q.correctAnswer}`);
  lines.push("");
  lines.push(`**Key idea:** ${q.explanation.keyIdea}`);
  lines.push("");
  lines.push("**Explanation**");
  q.explanation.steps.forEach((step, index) => lines.push(`${index + 1}. ${step}`));
  lines.push("");
  lines.push(`**Common mistake:** ${q.explanation.commonMistake}`);
  lines.push("");
}

for (const entry of selected) {
  const en = generateIntCp005QuestionV16_1Final(entry.qlId, entry.seed);
  const hi = generateIntCp005QuestionV16_1Localized(entry.qlId, entry.seed, "hi-IN");
  const pa = generateIntCp005QuestionV16_1Localized(entry.qlId, entry.seed, "pa-IN");
  lines.push(`## ${entry.qlId} — ${entry.template}`);
  lines.push("");
  lines.push(`State fingerprint: \`${en.mathematicalFingerprint.replace(/\|[^|]+$/, "") }\``);
  lines.push("");
  writeQuestion("English", en);
  writeQuestion("Hindi", hi);
  writeQuestion("Punjabi", pa);
  lines.push("---");
  lines.push("");
}

lines.push("## Review summary");
lines.push("");
lines.push(`- QLs: ${INT_CP005_V16_1_QL_IDS.length}`);
lines.push(`- English template states: ${selected.length}`);
lines.push(`- Learner surfaces shown: ${selected.length * 3}`);
lines.push("- Three English stem templates captured for every retained QL");
lines.push("- Hindi/Punjabi use exactly the same mathematical state, option values/order and correct index");
lines.push("- QL-094 remains excluded");
lines.push("- Production/salary remain excluded");
lines.push("- Lifecycle remains closed");

const output = resolve(process.env.INT_CP005_V16_1_REVIEW_OUT ?? "dist/quant-v4/INT-CP-005-V16.1-HARDENING-REVIEW.md");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, lines.join("\n"), "utf8");
console.log(JSON.stringify({ output, matchedStates: selected.length, learnerSurfaces: selected.length * 3 }, null, 2));
console.log("PASS_INT_CP005_V16_1_REVIEW_EXPORT");
