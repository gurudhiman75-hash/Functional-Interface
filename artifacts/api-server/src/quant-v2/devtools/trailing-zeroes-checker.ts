import { readFile } from "node:fs/promises";
import path from "node:path";

async function main() {
  const raw = await readFile(path.join(process.cwd(), "exports", "sampled-audit-questions.json"), "utf8");
  const data = JSON.parse(raw);
  const all = [...data.production, ...data.review, ...data.pyqPlus];
  
  console.log("Checking trailing zeroes questions:");
  const zeroes = all.filter(q => q.family === "ns_trailing_zeroes" || q.text.includes("trailing zeroes"));
  for (const q of zeroes.slice(0, 5)) {
    console.log(`\nQuestion: ${q.text}`);
    console.log(`Explanation:\n${q.explanation}`);
  }
}

main().catch(err => console.error(err));
