import assert from "node:assert/strict";
import { STA_EXAM_PROFILES, type StaExamProfileId } from "./exam-format-extension.ts";
import { STA_EXAM_FORMAT_PROVENANCE } from "./exam-format-provenance.ts";

const profileIds = Object.keys(STA_EXAM_PROFILES) as StaExamProfileId[];
assert.deepEqual(Object.keys(STA_EXAM_FORMAT_PROVENANCE).sort(), [...profileIds].sort(), "Every STA exam profile must have explicit provenance");

const direct = profileIds.filter((id) => STA_EXAM_FORMAT_PROVENANCE[id].evidenceClass === "DIRECT_PYQ_FORMAT");
const compatible = profileIds.filter((id) => STA_EXAM_FORMAT_PROVENANCE[id].evidenceClass === "LEGACY_OR_FAMILY_COMPATIBLE");
const synthesis = profileIds.filter((id) => STA_EXAM_FORMAT_PROVENANCE[id].evidenceClass === "CROSS_EXAM_SYNTHESIS");

assert.ok(direct.includes("SSC_2X4"));
assert.ok(direct.includes("SSC_3X4"));
assert.ok(direct.includes("BANK_3X5"));
assert.ok(direct.includes("BANK_4X5"));
assert.ok(direct.includes("PUNJAB_2X4"));
assert.deepEqual(synthesis, ["PUNJAB_3X4"], "Punjab 3x4 must remain explicitly classified as cross-exam synthesis until direct Punjab PYQ evidence exists");
assert.equal(STA_EXAM_FORMAT_PROVENANCE.PUNJAB_3X4.directPunjabPyqBacked, false);
assert.equal(STA_EXAM_FORMAT_PROVENANCE.PUNJAB_2X4.directPunjabPyqBacked, true);
assert.ok(profileIds.every((id) => STA_EXAM_FORMAT_PROVENANCE[id].freezeEligible), "All retained presentation profiles must be explicitly freeze-eligible");
assert.ok(compatible.includes("BANK_2X5"));
assert.ok(compatible.includes("BANK_3X5_NEGATIVE"));

console.log("PASS_STA_001_EXAM_FORMAT_PROVENANCE_V1");
console.log(JSON.stringify({
  profileCount: profileIds.length,
  directPyqProfiles: direct,
  legacyOrFamilyCompatibleProfiles: compatible,
  crossExamSynthesisProfiles: synthesis,
  directPunjabPyqProfiles: profileIds.filter((id) => STA_EXAM_FORMAT_PROVENANCE[id].directPunjabPyqBacked),
  overclaimGuard: "PUNJAB_3X4 is not direct Punjab-PYQ-backed unless this proof is deliberately revised with new evidence.",
  multilingualChapterFrozen: false,
  questionStudioDiscoverable: false,
}, null, 2));
