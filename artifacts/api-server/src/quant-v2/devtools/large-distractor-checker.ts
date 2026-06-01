import { readFile } from "node:fs/promises";
import path from "node:path";

async function main() {
  const raw = await readFile(path.join(process.cwd(), "exports", "sampled-audit-questions.json"), "utf8");
  const data = JSON.parse(raw);
  const all = [...data.production, ...data.review, ...data.pyqPlus];
  
  console.log("Checking large-number product of divisors questions:");
  const prodOfDivs = all.filter(q => q.family === "ns_product_of_divisors");
  for (const q of prodOfDivs.slice(0, 5)) {
    console.log(`\nQuestion: ${q.text}`);
    console.log(`Options: ${q.options.join(", ")}`);
    console.log(`Correct: ${q.correctValue}`);
  }
}

main().catch(err => console.error(err));
