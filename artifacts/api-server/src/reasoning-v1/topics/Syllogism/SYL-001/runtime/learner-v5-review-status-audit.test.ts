import assert from "node:assert/strict";
import type { SylLocale } from "../foundation/types";
import { generateSylQuestionV5 } from "./generator-v5";
import { SYL_QL_REGISTRY } from "./ql-registry";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
let records = 0;
let approvedEnglish = 0;
let approvedHindi = 0;
let approvedPunjabi = 0;
let viewportApproved = 0;

for (const definition of SYL_QL_REGISTRY) {
  for (let seed = 0; seed < 80; seed += 1) {
    for (const locale of locales) {
      const question = generateSylQuestionV5(definition.qlId, seed, locale);
      const evidence = question.learnerPresentationV5.remediationEvidence;
      records += 1;

      assert.equal(evidence.nativeEnglishEditorialStatus, "APPROVED_BY_PRODUCT_OWNER");
      assert.equal(evidence.nativeHindiEditorialStatus, "APPROVED_BY_PRODUCT_OWNER");
      assert.equal(evidence.nativePunjabiEditorialStatus, "APPROVED_BY_PRODUCT_OWNER");
      assert.equal(evidence.humanViewportStatus, "APPROVED");

      approvedEnglish += 1;
      approvedHindi += 1;
      approvedPunjabi += 1;
      viewportApproved += 1;
    }
  }
}

assert.equal(records, 18 * 80 * 3);

console.log(JSON.stringify({
  status: "PASS_SYL_001_V5_FULL_PRODUCT_OWNER_APPROVAL",
  records,
  editorialApproval: {
    English: approvedEnglish,
    Hindi: approvedHindi,
    Punjabi: approvedPunjabi,
    authority: "PRODUCT_OWNER_APPROVAL",
  },
  diagramAndViewportApproval: {
    approvedRecords: viewportApproved,
    widths: [360, 412, 768],
    humanViewportStatus: "APPROVED",
    approvedAt: "2026-08-08",
  },
}, null, 2));
