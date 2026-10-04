import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildTsdQualityAuditCorpus } from "./corpus";

const rows = buildTsdQualityAuditCorpus();
const outputDir = resolve(process.argv[2] ?? "dist/tsd-quality-audit");
mkdirSync(outputDir, { recursive: true });
const serialize = (value: unknown) => JSON.stringify(value, (_, item) => typeof item === "bigint" ? item.toString() : item, 2);
assert.equal(rows.length, 2769, "Authority corpus changed; review scope must be updated explicitly");
for (const row of rows) {
  assert.ok(typeof row.stem === "string" && row.stem.length > 20, `${row.checkpoint}/${row.qlId}: missing stem`);
  assert.doesNotMatch(row.stem, /undefined|NaN|Infinity|\$\{|\{[A-Za-z]/u);
  assert.ok(row.explanation && serialize(row.explanation).length > 20, `${row.checkpoint}/${row.qlId}: missing explanation`);
  assert.ok(["en", "hi", "pa"].includes(row.language));
  if (row.language === "hi") assert.match(row.stem, /[\u0900-\u097f]/u);
  if (row.language === "pa") assert.match(row.stem, /[\u0a00-\u0a7f]/u);
  if (row.options) {
    assert.equal(row.options.length, 4);
    assert.equal(new Set(row.options).size, 4);
    assert.equal(row.options[row.correctIndex], row.answer);
  }
}
const ledger = Array.from({length: 105}, (_, i) => {
  const qlId = `TSD-QL-${String(i + 38).padStart(3, "0")}`;
  const samples = rows.filter(row => row.qlId === qlId);
  assert.ok(samples.some(row => row.language === "en"), `${qlId}: absent English authority`);
  return {qlId, checkpoint: samples[0]!.checkpoint, languageRows: Object.fromEntries(["en", "hi", "pa"].map(language => [language, samples.filter(row => row.language === language).length]))};
});
const metrics = [...new Set(rows.map(row => row.checkpoint))].sort().map(checkpoint => {
  const samples = rows.filter(row => row.checkpoint === checkpoint);
  const en = samples.filter(row => row.language === "en");
  return {checkpoint, rows: samples.length,
    languages: Object.fromEntries(["en", "hi", "pa"].map(language => [language, samples.filter(row => row.language === language).length])),
    englishNumberMaskedShapes: new Set(en.map(row => row.stem.replace(/\d+(?:[./:]\d+)*/g, "#"))).size};
});
writeFileSync(resolve(outputDir, "TSD-QUALITY-CORPUS.json"), `${serialize(rows)}\n`);
writeFileSync(resolve(outputDir, "TSD-QUALITY-COVERAGE.json"), `${serialize({status: "STRUCTURAL_PASS_EDITORIAL_NO_GO", rows: rows.length, metrics, ledger})}\n`);
console.log(serialize({outputDir, rows: rows.length, currentQlCoverage: ledger.length, structuralChecks: "PASS", editorialClosure: "NO_GO"}));
