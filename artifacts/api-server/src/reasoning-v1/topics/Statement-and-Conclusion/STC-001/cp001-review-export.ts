import { STC_CP001_AUTHORITIES } from "./cp001-authorities.ts";
import { generateStcCp001Question } from "./cp001-generator.ts";

const locales = ["en-IN", "hi-IN", "pa-IN"] as const;
const qls = ["STC-QL-001", "STC-QL-002"] as const;

for (const qlId of qls) {
  for (const locale of locales) {
    const samples = Array.from({ length: 8 }, (_, index) => generateStcCp001Question({ qlId, locale, seed: index * 17 + 3 }));
    console.log(JSON.stringify({ qlId, locale, samples }, null, 2));
  }
}

console.error(`Exported review samples from ${STC_CP001_AUTHORITIES.length} curated STC-CP-001 authorities.`);
