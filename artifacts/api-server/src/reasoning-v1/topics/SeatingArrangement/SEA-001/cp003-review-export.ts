import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { generateCircularCaselet, SEA_CP003_BLUEPRINTS } from "./cp003/generator.ts";

const outputDirectory = resolve(process.env.SEA_CP003_REVIEW_OUTPUT_DIR ?? "./dist/sea-cp003-review");
const cases = SEA_CP003_BLUEPRINTS.flatMap((blueprint) =>
  Array.from({ length: 12 }, (_, index) => generateCircularCaselet(`SEA-CP003-REVIEW-${blueprint}-${index}`, blueprint)));

function csvCell(value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return `"${text.replaceAll('"', '""')}"`;
}

const csvHeaders = [
  "caseletId", "blueprint", "seed", "seatCount", "landmark", "setup", "clues",
  "q1", "q1Options", "q1Answer", "q1Explanation",
  "q2", "q2Options", "q2Answer", "q2Explanation",
  "q3", "q3Options", "q3Answer", "q3Explanation",
  "q4", "q4Options", "q4Answer", "q4Explanation",
];
const csvRows = cases.map((caselet) => {
  const row: unknown[] = [
    caselet.caseletId,
    caselet.blueprintAuthorityId,
    caselet.seed,
    caselet.topologySnapshot.seatCount,
    caselet.topologySnapshot.landmark?.id ?? "",
    caselet.setupText,
    caselet.clueTexts.join(" | "),
  ];
  for (const child of caselet.children) {
    row.push(child.text, child.options.map((option) => option.display).join(" | "), child.answer, child.explanation);
  }
  return row.map(csvCell).join(",");
});

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

const htmlCards = cases.map((caselet) => `
<article>
  <h2>${caselet.blueprintAuthorityId} · ${escapeHtml(caselet.seed)}</h2>
  <p>${escapeHtml(caselet.setupText)}</p>
  <ol>${caselet.clueTexts.map((clue) => `<li>${escapeHtml(clue)}</li>`).join("")}</ol>
  <div class="diagram">${caselet.diagram.svg}</div>
  ${caselet.children.map((child) => `
    <section>
      <h3>Q${child.questionOrder}. ${escapeHtml(child.text)}</h3>
      <ol type="A">${child.options.map((option) => `<li>${escapeHtml(option.display)}${option.isCorrect ? " <strong>✓</strong>" : ""}</li>`).join("")}</ol>
      <p><strong>Explanation:</strong> ${escapeHtml(child.explanation)}</p>
    </section>`).join("")}
</article>`).join("\n");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>SEA-CP-003 English Review</title><style>body{font-family:system-ui,sans-serif;max-width:1050px;margin:auto;padding:24px;line-height:1.45}article{border:1px solid #bbb;border-radius:12px;padding:20px;margin:24px 0;break-inside:avoid}.diagram svg{max-width:420px;height:auto}section{border-top:1px solid #ddd;margin-top:14px;padding-top:10px}</style></head><body><h1>SEA-CP-003 Circular Facing Centre — English Review Pack</h1><p>48 deterministic discovery caselets; 12 per provisional blueprint. No permanent QLs or product activation.</p>${htmlCards}</body></html>`;

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeFile(resolve(outputDirectory, "sea-cp003-review.json"), JSON.stringify(cases, null, 2), "utf8"),
  writeFile(resolve(outputDirectory, "sea-cp003-review.csv"), `${csvHeaders.join(",")}\n${csvRows.join("\n")}\n`, "utf8"),
  writeFile(resolve(outputDirectory, "sea-cp003-review.html"), html, "utf8"),
]);
console.log(`WROTE_SEA_CP003_REVIEW ${cases.length} ${outputDirectory}`);
