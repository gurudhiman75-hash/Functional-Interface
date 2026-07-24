import { writeAvg001ApprovedReviewCsv } from "./foundation/review-export";

writeAvg001ApprovedReviewCsv({
  outputFile: "avg-001-cp001-human-review-en.csv",
  expectedRows: 80,
  seedPrefix: "avg-cp001-review",
  select: (entry) => entry.cpId === "AVG-CP-001",
});
