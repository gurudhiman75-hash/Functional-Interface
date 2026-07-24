import { writeAvg001ApprovedReviewCsv } from "./foundation/review-export";

writeAvg001ApprovedReviewCsv({
  outputFile: "avg-001-human-review-en.csv",
  expectedRows: 425,
  seedPrefix: "avg-review",
});
