import { writeAvg001ApprovedReviewCsv } from "./foundation/review-export";

writeAvg001ApprovedReviewCsv({
  outputFile: "avg-001-cp004-human-review-en.csv",
  expectedRows: 85,
  seedPrefix: "avg-cp004-review",
  select: (entry) => entry.cpId === "AVG-CP-004",
});
