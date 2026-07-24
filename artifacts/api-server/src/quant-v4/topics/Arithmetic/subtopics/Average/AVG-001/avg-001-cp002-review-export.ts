import { writeAvg001ApprovedReviewCsv } from "./foundation/review-export";

writeAvg001ApprovedReviewCsv({
  outputFile: "avg-001-cp002-human-review-en.csv",
  expectedRows: 62,
  seedPrefix: "avg-cp002-review",
  select: (entry) => entry.cpId === "AVG-CP-002",
});
