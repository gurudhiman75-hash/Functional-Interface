import { writeAvg001ApprovedReviewCsv } from "./foundation/review-export";

writeAvg001ApprovedReviewCsv({
  outputFile: "avg-001-cp006-human-review-en.csv",
  expectedRows: 44,
  seedPrefix: "avg-cp006-review",
  select: (entry) => entry.cpId === "AVG-CP-006",
});
