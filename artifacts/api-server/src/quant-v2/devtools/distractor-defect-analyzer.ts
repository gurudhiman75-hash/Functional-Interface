import { readFile } from "node:fs/promises";
import path from "node:path";

interface AuditQuestion {
  index: number;
  text: string;
  options: string[];
  correctValue: string;
  family: string;
}

async function main() {
  const inPath = path.join(process.cwd(), "exports", "sampled-audit-questions.json");
  const rawData = await readFile(inPath, "utf8");
  const data = JSON.parse(rawData);
  const allQuestions: AuditQuestion[] = [...data.production, ...data.review, ...data.pyqPlus];

  let lazyDistractorCount = 0;
  const lazyExamples: any[] = [];

  for (const q of allQuestions) {
    const rawOpts = q.options || [];
    const cleanOpts = rawOpts.map(o => {
      const match = o.match(/-?\d+/);
      return match ? Number(match[0]) : NaN;
    }).filter(Number.isFinite);

    if (cleanOpts.length === 4) {
      // Sort and check differences
      const sorted = [...cleanOpts].sort((a, b) => a - b);
      const diffs = [sorted[1] - sorted[0], sorted[2] - sorted[1], sorted[3] - sorted[2]];
      
      // If the differences are all 1, it means they are consecutive integers (e.g. 7999, 8000, 8001, 8002)
      const isConsecutive = diffs.every(d => d === 1);
      
      // If the differences are very small (e.g. 1 or 2) relative to a large number, it is also lazy
      const correctVal = Number(q.correctValue.replace(/[^\d-]/g, ""));
      const isLazyThreshold = correctVal > 50 && diffs.every(d => d <= 5);

      if (isConsecutive || isLazyThreshold) {
        lazyDistractorCount++;
        lazyExamples.push({
          index: q.index,
          family: q.family,
          text: q.text,
          options: q.options,
          correct: q.correctValue,
          reason: isConsecutive ? "Consecutive integers (diff is exactly 1)" : "Extremely close interval for a large number"
        });
      }
    }
  }

  console.log(`Lazy Distractor Count: ${lazyDistractorCount}/${allQuestions.length} (${((lazyDistractorCount/allQuestions.length)*100).toFixed(1)}%)`);
  console.log("\nFirst 10 lazy distractor examples:");
  console.log(JSON.stringify(lazyExamples.slice(0, 10), null, 2));
}

main().catch(err => console.error(err));
