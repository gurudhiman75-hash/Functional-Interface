import { writeAvg001ApprovedReviewCsv } from "./foundation/review-export";

writeAvg001ApprovedReviewCsv({
  outputFile: "avg-001-cp005-human-review-en.csv",
  expectedRows: 56,
  seedPrefix: "avg-cp005-review",
  select: (entry) => entry.cpId === "AVG-CP-005",
});
