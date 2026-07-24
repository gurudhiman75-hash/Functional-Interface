import { writeAvg001ApprovedReviewCsv } from "./foundation/review-export";

writeAvg001ApprovedReviewCsv({
  outputFile: "avg-001-cp003-human-review-en.csv",
  expectedRows: 98,
  seedPrefix: "avg-cp003-review",
  select: (entry) => entry.cpId === "AVG-CP-003",
});
