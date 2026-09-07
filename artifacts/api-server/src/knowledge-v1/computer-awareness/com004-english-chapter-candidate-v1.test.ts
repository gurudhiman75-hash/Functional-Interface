import {
  COM004_ENGLISH_CHAPTER_CANDIDATE_AUTHORITY_V1,
  COM004_ENGLISH_CHAPTER_CANDIDATE_V1,
  auditCom004EnglishChapterCandidateV1,
} from "./com004-english-chapter-candidate-v1";

const audit = auditCom004EnglishChapterCandidateV1();

if (!audit.valid) {
  throw new Error(`COM-004 English Chapter Candidate V1 audit failed:\n${audit.issues.join("\n")}`);
}

if (COM004_ENGLISH_CHAPTER_CANDIDATE_V1.length !== 204) {
  throw new Error(`COM-004 English chapter candidate must contain 204 questions, found ${COM004_ENGLISH_CHAPTER_CANDIDATE_V1.length}`);
}

if (COM004_ENGLISH_CHAPTER_CANDIDATE_AUTHORITY_V1.permanentQlCount !== 17) {
  throw new Error("COM-004 English chapter candidate permanent QL count drifted");
}

if (COM004_ENGLISH_CHAPTER_CANDIDATE_AUTHORITY_V1.questionsPerQl !== 12) {
  throw new Error("COM-004 English chapter candidate questions-per-QL drifted");
}

if (COM004_ENGLISH_CHAPTER_CANDIDATE_AUTHORITY_V1.status !== "REVIEW_CANDIDATE_NOT_FROZEN") {
  throw new Error("COM-004 English chapter candidate was prematurely frozen");
}

if (COM004_ENGLISH_CHAPTER_CANDIDATE_AUTHORITY_V1.nextGate !== "COM004_ENGLISH_CHAPTER_EDITORIAL_AUDIT_V1") {
  throw new Error(`COM-004 English chapter candidate next gate drifted: ${COM004_ENGLISH_CHAPTER_CANDIDATE_AUTHORITY_V1.nextGate}`);
}

console.log(JSON.stringify({
  checkpoint: "COM004_ENGLISH_CHAPTER_CANDIDATE_V1",
  ...audit,
}, null, 2));
