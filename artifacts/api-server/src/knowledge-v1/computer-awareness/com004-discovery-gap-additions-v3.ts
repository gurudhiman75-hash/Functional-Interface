import type { Com004DiscoveryCandidate } from "./com004-internet-web-email-discovery";

/**
 * Late source-saturation addition: cookies surfaced as a real SSC web/browser
 * pattern after the V2 gap pass. Keep user-facing browser/Web semantics here;
 * security/control depth remains owned by COM-006.
 */
export const COM004_DISCOVERY_GAP_ADDITIONS_V3: Com004DiscoveryCandidate[] = [
  {
    candidateId: "WEB-DISC-041",
    learnerTask: "Recognize browser/HTTP cookies as small pieces of site-associated data used to preserve state and identify third-party-cookie privacy context at awareness depth",
    relationFamily: "browser-cookie-purpose",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["cookie", "browser", "website state", "first-party cookie", "third-party cookie"],
    surfaceVariants: [
      "Which Web/browser mechanism stores small pieces of site-associated state data?",
      "Which type of cookie is associated with a different site/domain context from the page being viewed?",
      "Which browser/Web concept can be used to preserve state across otherwise stateless HTTP interactions?",
    ],
    evidence: ["OFFICIAL_EXAM", "STANDARDS_AUTHORITY", "PYQ_CONFIRMED"],
    sourceRefIds: ["SSC-CGL-2022-TIER2-COOKIE", "MDN-HTTP-COOKIES", "MDN-THIRD-PARTY-COOKIES"],
    ownershipNotes: ["Basic cookie purpose and first/third-party recognition belong to COM-004; tracking-attack taxonomy, CSRF and security-control configuration belong to COM-006."],
    ambiguityRisks: [
      "Do not teach all third-party cookies as malicious; they have legitimate uses but can enable cross-site tracking.",
      "Do not encode current browser-vendor default cookie-blocking behavior as durable truth.",
    ],
    productionState: "DISCOVERY_ONLY",
  },
];

export function auditCom004DiscoveryGapAdditionsV3() {
  const candidate = COM004_DISCOVERY_GAP_ADDITIONS_V3[0];
  const issues: string[] = [];

  if (COM004_DISCOVERY_GAP_ADDITIONS_V3.length !== 1) issues.push("V3 must contain exactly the late cookie gap candidate");
  if (candidate?.candidateId !== "WEB-DISC-041") issues.push("Unexpected V3 candidate id");
  if (candidate?.productionState !== "DISCOVERY_ONLY") issues.push("Cookie candidate escaped discovery state");
  if (!candidate?.evidence.includes("OFFICIAL_EXAM")) issues.push("Cookie candidate missing official-exam evidence");
  if (!candidate?.evidence.includes("STANDARDS_AUTHORITY")) issues.push("Cookie candidate missing standards truth anchor");
  if (!candidate?.ownershipNotes?.some((note) => note.includes("COM-006"))) issues.push("Cookie security boundary missing");
  if (!candidate?.ambiguityRisks?.some((risk) => /not teach all third-party cookies as malicious/i.test(risk))) issues.push("Third-party-cookie misconception lock missing");
  if (!candidate?.ambiguityRisks?.some((risk) => /browser-vendor default/i.test(risk))) issues.push("Mutable browser-default lock missing");

  return {
    valid: issues.length === 0,
    issues,
    gapCandidateCount: COM004_DISCOVERY_GAP_ADDITIONS_V3.length,
    totalDiscoveryCandidateCount: 41,
    permanentQlCount: 0,
    productionReady: false,
    nextGate: "COM004_SOURCE_SATURATION_V2_EVIDENCE_CLOSURE_AND_MERGE_SPLIT",
  } as const;
}
