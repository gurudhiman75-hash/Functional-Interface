import { auditGeoPhy001Cp013ReviewBatchV1 } from "./geo-phy-001-cp013-review-batch-v1";
import { auditGeoPhy001ChapterClosureV1 } from "./geo-phy-001-chapter-closure-v1";

const cp013 = auditGeoPhy001Cp013ReviewBatchV1();
const closure = auditGeoPhy001ChapterClosureV1();
if (!cp013.valid || !closure.valid) {
  console.error(JSON.stringify({ cp013, closure }, null, 2));
  throw new Error(`GEO-PHY-001 final qualification failed: ${[...cp013.issues, ...closure.issues].join(" | ")}`);
}
console.log(JSON.stringify({ cp013, closure }));
