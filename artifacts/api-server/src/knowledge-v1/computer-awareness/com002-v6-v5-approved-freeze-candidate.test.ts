import {
  COM002_V6_V5_APPROVED_FREEZE_CANDIDATE,
  COM002_V6_V5_APPROVED_FREEZE_PINS,
  auditCom002V6V5ApprovedFreezeCandidate,
} from "./com002-v6-v5-approved-freeze-candidate";

const audit = auditCom002V6V5ApprovedFreezeCandidate();
if (!audit.validReviewBinding) throw new Error(`approved V6/V5 review binding is invalid: ${audit.issues.join(",")}`);
if (audit.promotable) throw new Error("freeze candidate must remain fail-closed until full corpus hashes are pinned");
if (COM002_V6_V5_APPROVED_FREEZE_PINS.bilingualV5ReviewFingerprint !==
  "7303161552dc11354f1cb4765cc56a85d94755fd8835adffb2de3514100e5e16") {
  throw new Error("approved bilingual review fingerprint mismatch");
}
if (COM002_V6_V5_APPROVED_FREEZE_CANDIDATE.executionEvidence.workflowRunNumber !== 585) {
  throw new Error("latest approved green execution must bind run #585");
}
if (COM002_V6_V5_APPROVED_FREEZE_CANDIDATE.executionEvidence.bilingualReviewArtifactDigest !==
  "sha256:abbcf92326134c5ab6678db59bb98fea1b9940c5afdd3a1a3e1fee9541bfe141") {
  throw new Error("run #585 bilingual artifact digest mismatch");
}
if (COM002_V6_V5_APPROVED_FREEZE_CANDIDATE.lifecycle.questionStudioDiscoverable) {
  throw new Error("Question Studio must remain hidden before full machine freeze");
}
if (COM002_V6_V5_APPROVED_FREEZE_CANDIDATE.lifecycle.questionBankWritable) {
  throw new Error("Question Bank must remain unwritable");
}
if (COM002_V6_V5_APPROVED_FREEZE_CANDIDATE.lifecycle.publiclyPublishable) {
  throw new Error("public delivery must remain disabled");
}

console.log(`[COM002-V6-V5-APPROVED-FREEZE-CANDIDATE] PASS pending=${audit.issues.length}`);
