import {
  COM002_V6_V5_APPROVED_FREEZE_CANDIDATE,
  COM002_V6_V5_APPROVED_FREEZE_PINS,
  auditCom002V6V5ApprovedFreezeCandidate,
} from "./com002-v6-v5-approved-freeze-candidate";

const audit = auditCom002V6V5ApprovedFreezeCandidate();
if (!audit.validReviewBinding) throw new Error(`approved V6/V5 review binding is invalid: ${audit.issues.join(",")}`);
if (!audit.promotable) throw new Error(`approved V6/V5 freeze candidate must be promotable after fingerprint export: ${audit.issues.join(",")}`);

const expected = {
  englishV6CorpusFingerprint: "8f8231ca8bbc9d90ead4d862b0505a4b5b716ce50908419754fd9b35cd87af14",
  englishV6ReviewPackFingerprint: "f0697394e6797aaec6a4e3af503340593aa74c4fad36673727271b880f1ae1af",
  englishV6ExportReferenceFingerprint: "a2f8c44e9d88c11c61fbc318a973c0b41690d3fd04a7b3127ad60a10a20b8aec",
  englishV6CombinedFingerprint: "d41ad6eab504f88f154a1e3487db730f188f754ba784f1d1e9f94ce4f9b118f6",
  hindiV5CorpusFingerprint: "7c750564746d331852e8ede6bea3f135d2437b53c76413367cecc6b6fac06a11",
  punjabiV5CorpusFingerprint: "686c6e6e3db14494baaceb2403162d4ba4ad2ab1da199a37da9ac3f0497997ea",
  bilingualV5ReviewFingerprint: "7303161552dc11354f1cb4765cc56a85d94755fd8835adffb2de3514100e5e16",
  localizationV5CombinedFingerprint: "361d48f97a4982b58f589cd5ed003ed8ad1a91bd5f9bd2f4a6c1d3ecc7a4296c",
} as const;

for (const [key, value] of Object.entries(expected)) {
  if (COM002_V6_V5_APPROVED_FREEZE_PINS[key as keyof typeof expected] !== value) {
    throw new Error(`approved freeze fingerprint mismatch for ${key}`);
  }
}

if (COM002_V6_V5_APPROVED_FREEZE_CANDIDATE.executionEvidence.workflowRunNumber !== 585) {
  throw new Error("latest approved human-review green execution must bind run #585");
}
if (COM002_V6_V5_APPROVED_FREEZE_CANDIDATE.executionEvidence.bilingualReviewArtifactDigest !==
  "sha256:abbcf92326134c5ab6678db59bb98fea1b9940c5afdd3a1a3e1fee9541bfe141") {
  throw new Error("run #585 bilingual artifact digest mismatch");
}
if (COM002_V6_V5_APPROVED_FREEZE_CANDIDATE.machineFingerprintEvidence.workflowRunId !== 33315236675) {
  throw new Error("approved fingerprint manifest must bind one-off run 33315236675");
}
if (COM002_V6_V5_APPROVED_FREEZE_CANDIDATE.machineFingerprintEvidence.artifactDigest !==
  "sha256:aa852b498327aa1de0ae3a22fe1eab957d1c9b53056c9a7759ee566c3a842960") {
  throw new Error("approved fingerprint manifest artifact digest mismatch");
}
if (!COM002_V6_V5_APPROVED_FREEZE_CANDIDATE.guarantees.fullCorpusFingerprintsPinned) {
  throw new Error("full corpus fingerprints must be pinned");
}
if (!COM002_V6_V5_APPROVED_FREEZE_CANDIDATE.lifecycle.machineFreezePromotable) {
  throw new Error("machine freeze candidate must now be promotable");
}
if (COM002_V6_V5_APPROVED_FREEZE_CANDIDATE.lifecycle.questionStudioDiscoverable) {
  throw new Error("Question Studio must remain hidden until operational freeze and adapter audit");
}
if (COM002_V6_V5_APPROVED_FREEZE_CANDIDATE.lifecycle.questionBankWritable) {
  throw new Error("Question Bank must remain unwritable");
}
if (COM002_V6_V5_APPROVED_FREEZE_CANDIDATE.lifecycle.publiclyPublishable) {
  throw new Error("public delivery must remain disabled");
}

console.log("[COM002-V6-V5-APPROVED-FREEZE-CANDIDATE] PASS fingerprintsPinned=true promotable=true questionStudio=false");
