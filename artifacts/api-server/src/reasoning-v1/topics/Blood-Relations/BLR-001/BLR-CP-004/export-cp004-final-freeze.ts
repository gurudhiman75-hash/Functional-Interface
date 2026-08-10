import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { buildBlrCp004Telemetry, generateBlrCp004FrozenBank } from "./cp004-bank";
import { BLR_CP004_FINAL_FREEZE } from "./cp004-final-freeze";
import { BLR_CP004_PERMANENT_CONTRACTS } from "./cp004-model";

const out = path.resolve(process.argv[2] ?? "blr-cp004-final-freeze-output");
const bank = generateBlrCp004FrozenBank();
const telemetry = buildBlrCp004Telemetry(bank);

function htmlEscape(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function csvEscape(value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function answerText(question: (typeof bank)[number]): string {
  return question.answer.kind === "NUMBER"
    ? String(question.answer.value)
    : question.answer.value.join(" / ");
}

await mkdir(out, { recursive: true });

const summary = {
  freezeVersion: BLR_CP004_FINAL_FREEZE.version,
  approvalDate: BLR_CP004_FINAL_FREEZE.approvalDate,
  approvedBy: BLR_CP004_FINAL_FREEZE.approvedBy,
  ownerDirective: BLR_CP004_FINAL_FREEZE.ownerDirective,
  permanentQlRange: BLR_CP004_FINAL_FREEZE.permanentQlRange,
  nextAvailableChapterQlId: BLR_CP004_FINAL_FREEZE.nextAvailableChapterQlId,
  ...telemetry,
  releaseLock: BLR_CP004_FINAL_FREEZE.releaseLock,
};

await writeFile(
  path.join(out, "blr-cp004-final-freeze-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);
await writeFile(
  path.join(out, "blr-cp004-permanent-contracts.json"),
  `${JSON.stringify(BLR_CP004_PERMANENT_CONTRACTS, null, 2)}\n`,
  "utf8",
);
await writeFile(
  path.join(out, "blr-cp004-final-freeze-records.jsonl"),
  `${bank.map((question) => JSON.stringify(question)).join("\n")}\n`,
  "utf8",
);

const csvHeaders = [
  "itemId",
  "sourceGroupKey",
  "qlId",
  "solveAuthority",
  "sourcePrototypeId",
  "topologyId",
  "difficulty",
  "stem",
  "answer",
  "correctIndex",
];
const csvRows = bank.map((question) =>
  [
    question.itemId,
    question.sourceGroupKey,
    question.qlId,
    question.solveAuthority,
    question.sourcePrototypeId,
    question.topologyId,
    question.metadata.difficulty,
    question.stem,
    answerText(question),
    question.correctIndex,
  ]
    .map(csvEscape)
    .join(","),
);
await writeFile(
  path.join(out, "blr-cp004-final-freeze-records.csv"),
  `${csvHeaders.map(csvEscape).join(",")}\n${csvRows.join("\n")}\n`,
  "utf8",
);

const cards = bank
  .map(
    (question) => `
      <article class="card">
        <div class="meta">${htmlEscape(question.qlId)} · ${htmlEscape(question.solveAuthority)} · ${htmlEscape(question.metadata.difficulty)}</div>
        <h2>${htmlEscape(question.itemId)}</h2>
        <p class="prompt">${htmlEscape(question.sharedPrompt).replaceAll("\n", "<br>")}</p>
        <h3>${htmlEscape(question.stem)}</h3>
        <ol type="A">${question.options
          .map(
            (option) =>
              `<li class="${option.isCorrect ? "correct" : ""}">${htmlEscape(option.text)}</li>`,
          )
          .join("")}</ol>
        <p><strong>Answer:</strong> ${htmlEscape(answerText(question))}</p>
        <ol>${question.explanation.working
          .map((step) => `<li>${htmlEscape(step)}</li>`)
          .join("")}</ol>
        <p><strong>Conclusion:</strong> ${htmlEscape(question.explanation.conclusion)}</p>
        <p><strong>Shortcut:</strong> ${htmlEscape(question.explanation.examShortcut)}</p>
        <pre>${htmlEscape(question.explanation.familyTree.asciiFallback)}</pre>
      </article>`,
  )
  .join("\n");

await writeFile(
  path.join(out, "blr-cp004-final-freeze-review.html"),
  `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>BLR-CP-004 Final Freeze Review</title>
<style>
body{font-family:system-ui,sans-serif;margin:0;background:#f5f6f8;color:#172033}.wrap{max-width:1100px;margin:auto;padding:20px}.card{background:white;border:1px solid #d8dde8;border-radius:14px;padding:18px;margin:0 0 18px;overflow-wrap:anywhere}.meta{font-size:13px;color:#5b6577}.prompt{line-height:1.55}.correct{font-weight:700}pre{white-space:pre-wrap;background:#f7f8fa;padding:12px;border-radius:8px;overflow:auto}@media(max-width:640px){.wrap{padding:10px}.card{padding:14px}}
</style></head><body><main class="wrap"><h1>BLR-CP-004 Final English Freeze</h1><p>${htmlEscape(
    `${bank.length} records · ${telemetry.groupCount} groups · ${telemetry.permanentQlCount} permanent QLs`,
  )}</p>${cards}</main></body></html>`,
  "utf8",
);

const freezeMarkdown = await readFile(
  new URL("./BLR-CP-004-FINAL-DISCOVERY-FREEZE.md", import.meta.url),
  "utf8",
);
await writeFile(
  path.join(out, "BLR-CP-004-FINAL-DISCOVERY-FREEZE.md"),
  freezeMarkdown,
  "utf8",
);

console.log(
  JSON.stringify(
    {
      output: out,
      records: bank.length,
      groups: telemetry.groupCount,
      permanentQlRange: BLR_CP004_FINAL_FREEZE.permanentQlRange,
      files: 6,
    },
    null,
    2,
  ),
);
