import type { KnowledgeFact, KnowledgeFactSource } from "../types";
import { COM002_SOURCE_AUTHORITIES } from "./com002-source-manifest";
import { COM002_SOURCE_AUTHORITY_EXTENSION } from "./com002-source-authority-extension";
import { COM002_SOURCE_AUTHORITY_EXTENSION2 } from "./com002-source-authority-extension2";

const ALL_AUTHORITIES = [...COM002_SOURCE_AUTHORITIES, ...COM002_SOURCE_AUTHORITY_EXTENSION, ...COM002_SOURCE_AUTHORITY_EXTENSION2];
function source(sourceId: string, locator: string): KnowledgeFactSource {
  const authority = ALL_AUTHORITIES.find((entry) => entry.sourceId === sourceId);
  if (!authority) throw new Error(`Unknown COM-002 source authority ${sourceId}`);
  return { sourceId, sourceType: authority.authorityClass === "OFFICIAL_CURRICULUM" || authority.authorityClass === "GOVERNMENT_REFERENCE" ? "textbook" : "reference", title: authority.title, url: authority.url, locator };
}
function fact(factId: string, entityId: string, relation: string, entity: string, value: string, sourceId: string, locator: string, tags: string[]): KnowledgeFact {
  return { factId, entityId, subject: "Computer Awareness", chapterId: "COM-002", cpId: "COM-002-CP-001", relation, entity: { canonicalName: entity, label: { en: entity } }, value: { kind: "text", text: { en: value } }, contextGroupId: relation === "software_classification" || relation === "license_class" ? "os-example-classification" : "os-type-properties", distractorGroupIds: [relation === "software_classification" || relation === "license_class" ? "os-example-classification" : "os-type-properties"], difficulty: "Medium", examTags: ["SSC", "BANKING", "PUNJAB_STATE"], tags, source: source(sourceId, locator), review: { status: "REVIEW_REQUIRED", confidence: 0.84 }, freshness: { class: "IMMUTABLE" } };
}

export const COM002_CANDIDATE_FACT_EXTENSION3: KnowledgeFact[] = [
  fact("com002-linux-classification", "computer:os:linux", "software_classification", "Linux", "operating system", "IBM-OPERATING-SYSTEMS-2025", "Popular operating systems: Linux", ["Linux", "operating-system"]),
  fact("com002-macos-classification", "computer:os:macos", "software_classification", "macOS", "operating system", "IBM-OPERATING-SYSTEMS-2025", "Popular operating systems: macOS", ["macOS", "operating-system"]),
  fact("com002-linux-open-source", "computer:os:linux", "license_class", "Linux", "open-source operating system", "IBM-OPERATING-SYSTEMS-2025", "Linux described as open source", ["Linux", "open-source"]),
  fact("com002-macos-proprietary", "computer:os:macos", "license_class", "macOS", "proprietary operating system", "IBM-OPERATING-SYSTEMS-2025", "macOS described as proprietary", ["macOS", "proprietary"]),
  fact("com002-ios-proprietary", "computer:os:ios", "license_class", "iOS", "proprietary mobile operating system", "IBM-OPERATING-SYSTEMS-2025", "iOS described as proprietary mobile OS", ["iOS", "proprietary", "mobile-os"]),
  fact("com002-android-open-source", "computer:os:android", "license_class", "Android", "open-source mobile operating system", "IBM-OPERATING-SYSTEMS-2025", "Android described as open-source mobile OS", ["Android", "open-source", "mobile-os"]),
  fact("com002-single-user-os-property", "computer:os-type:single-user", "os_type_property", "Single-user operating system", "supports one user working on the computer at a time", "CBSE-ACADEMICS-OS-TYPES", "Operating System FAQ: Single User", ["single-user-os", "os-type"]),
  fact("com002-multi-user-os-property", "computer:os-type:multi-user", "os_type_property", "Multi-user operating system", "allows multiple users to access the computer system", "ODISHA-SCTEVT-OS-TYPES-2025", "Types of Operating System: multi-user", ["multi-user-os", "os-type"]),
  fact("com002-multitasking-os-property", "computer:os-type:multitasking", "os_type_property", "Multitasking operating system", "allows more than one program to run during the same period of use", "ODISHA-SCTEVT-OS-TYPES-2025", "Types of Operating System: multitasking", ["multitasking-os", "os-type"]),
  fact("com002-single-tasking-os-property", "computer:os-type:single-tasking", "os_type_property", "Single-tasking operating system", "has only one running program at a time", "ODISHA-SCTEVT-OS-TYPES-2025", "Types of Operating System: single-tasking", ["single-tasking-os", "os-type"]),
  fact("com002-time-sharing-os-property", "computer:os-type:time-sharing", "os_type_property", "Time-sharing operating system", "shares processor time so multiple users or tasks can receive interactive access", "CBSE-ACADEMICS-OS-TYPES", "Operating System FAQ: Time Sharing", ["time-sharing-os", "os-type"]),
];

export function auditCom002CandidateCorpusExtension3() {
  const issues: string[] = [];
  const ids = new Set<string>();
  for (const candidate of COM002_CANDIDATE_FACT_EXTENSION3) {
    if (ids.has(candidate.factId)) issues.push(`DUPLICATE_FACT_ID:${candidate.factId}`);
    ids.add(candidate.factId);
    if (candidate.review.status !== "REVIEW_REQUIRED") issues.push(`PREMATURE_APPROVAL:${candidate.factId}`);
    if (candidate.chapterId !== "COM-002" || candidate.cpId !== "COM-002-CP-001") issues.push(`OWNERSHIP_MISMATCH:${candidate.factId}`);
  }
  return { valid: issues.length === 0, factCount: COM002_CANDIDATE_FACT_EXTENSION3.length, productionEligible: false, issues };
}
