import { writeFileSync } from "node:fs";

const out: Record<string, unknown> = {};
console.log = () => {};
for (const p of ["agr", "cli", "ind", "loc", "min", "phy", "riv", "soi", "trn", "veg"]) {
  const m = await import(`../../../question-studio/engines/knowledge-v1-geo-${p}-001-adapter-v1.ts`);
  const key = Object.keys(m).find((k) => /CORPUS/.test(k) && Array.isArray(m[k]));
  if (!key) throw new Error(`Missing GEO-${p.toUpperCase()}-001 corpus export`);
  out[p] = m[key].map(({ questionId, stem, options, correctIndex, explanation }: {
    questionId: string;
    stem: string;
    options: readonly string[];
    correctIndex: number;
    explanation: string;
  }) => ({ questionId, stem, options, correctIndex, explanation }));
}
writeFileSync(process.argv[2] ?? "/tmp/geo-corpus.json", JSON.stringify(out));
