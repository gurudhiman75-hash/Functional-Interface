import {
  generateDsfCp021RankingQuestion,
} from "../DSF-CP-021/ranking-three-statement-batch-v1.ts";
import { generateDsfCp022DirectionQuestion } from "../DSF-CP-022/direction-three-statement-batch-v1.ts";
import { generateDsfCp023BloodQuestion } from "../DSF-CP-023/blood-relations-three-statement-batch-v1.ts";
import { generateDsfCp024InequalityQuestion } from "../DSF-CP-024/inequality-three-statement-batch-v1.ts";
import { generateDsfCp025SeatingQuestion } from "../DSF-CP-025/seating-three-statement-batch-v1.ts";
import { generateDsfCp026CodingQuestion } from "../DSF-CP-026/coding-three-statement-batch-v1.ts";
import { generateDsfCp027CalendarQuestion } from "../DSF-CP-027/calendar-three-statement-batch-v1.ts";

const generators = [
  ["RANKING", generateDsfCp021RankingQuestion],
  ["DIRECTION", generateDsfCp022DirectionQuestion],
  ["BLOOD_RELATIONS", generateDsfCp023BloodQuestion],
  ["INEQUALITY", generateDsfCp024InequalityQuestion],
  ["SEATING", generateDsfCp025SeatingQuestion],
  ["CODING", generateDsfCp026CodingQuestion],
  ["CALENDAR", generateDsfCp027CalendarQuestion],
] as const;

const samples = generators.flatMap(([domain, generate]) =>
  Array.from({length: 5}, (_, index) => {
    const q = generate(`cp030:${domain}:${index}`) as any;
    return {
      domain,
      stem: q.stem,
      statements: q.statements.map((s:any) => `${s.id}. ${s.text}`),
      options: q.options.map((o:any) => `${o.key}. ${o.text}`),
      correctOption: q.options[q.correctIndex]?.key,
      semanticKey: q.semanticKey,
      explanation: q.explanation,
    };
  }),
);

console.log("DSF_CP030_EDITORIAL_SAMPLES_BEGIN");
for (const sample of samples) console.log(JSON.stringify(sample));
console.log("DSF_CP030_EDITORIAL_SAMPLES_END");
