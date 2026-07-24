import { writeAvg001ApprovedReviewCsv } from "./foundation/review-export";

writeAvg001ApprovedReviewCsv({
  outputFile: "avg-001-gap-expansion-human-review-en.csv",
  expectedRows: 52,
  seedPrefix: "avg-gap-review",
  select: (entry) => Number(entry.qlId.slice(-3)) >= 374,
});
