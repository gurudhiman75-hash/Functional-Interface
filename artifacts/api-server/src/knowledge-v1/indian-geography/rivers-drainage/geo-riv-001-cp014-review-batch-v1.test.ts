import { auditGeoRiv001Cp014ReviewBatchV1, GEO_RIV_001_CP014_REVIEW_BATCH_V1 } from "./geo-riv-001-cp014-review-batch-v1";

const audit=auditGeoRiv001Cp014ReviewBatchV1();
if(!audit.valid) throw new Error(`CP014 qualification failed: ${audit.issues.join(" | ")}`);
if(GEO_RIV_001_CP014_REVIEW_BATCH_V1.length!==54) throw new Error("CP014 expected 54 review questions");
if(audit.positions.join(",")!=="14,14,13,13") throw new Error(`CP014 answer balance mismatch ${audit.positions.join(",")}`);
console.log(JSON.stringify(audit,null,2));
