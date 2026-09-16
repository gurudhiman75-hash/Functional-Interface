import { auditGeoPhy001Cp012ReviewBatchV1 } from "./geo-phy-001-cp012-review-batch-v1";

const audit = auditGeoPhy001Cp012ReviewBatchV1();
if (!audit.valid) {
  console.error(JSON.stringify(audit, null, 2));
  throw new Error(`GEO-PHY-001 CP012 qualification failed: ${audit.issues.join(" | ")}`);
}
console.log(JSON.stringify(audit));
