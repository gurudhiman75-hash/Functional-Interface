import type { Com004DiscoveryCandidate, Com004DiscoveryEvidence } from "./com004-internet-web-email-discovery";

type Com004GapDiscoveryCandidate = Omit<Com004DiscoveryCandidate, "evidence"> & {
  evidence: (Com004DiscoveryEvidence | "OFFICIAL_CURRICULUM")[];
};

/**
 * Candidates discovered only after deliberate source saturation. They remain
 * supplemental DISCOVERY_ONLY records until merge/split decides whether they
 * deserve independent learner-task authority or merge into broader concepts.
 */
export const COM004_DISCOVERY_GAP_ADDITIONS_V2: Com004GapDiscoveryCandidate[] = [
  {
    candidateId: "WEB-DISC-037",
    learnerTask: "Identify an Internet Service Provider (ISP) from its role in providing Internet access",
    relationFamily: "internet-service-provider-role",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["ISP", "Internet Service Provider", "Internet access provider", "subscriber Internet access"],
    surfaceVariants: [
      "Which organization provides subscribers with access to the Internet?",
      "In Internet terminology, what does ISP stand for?",
      "A company that connects a subscriber to the Internet is called what?",
    ],
    evidence: ["OFFICIAL_EXAM", "PYQ_CONFIRMED"],
    sourceRefIds: ["PSSSB-EXCISE-2021-ISP", "PUNJAB-JAIL-WARDER-2021-ISP", "PUNJAB-POLICE-2024-ISP", "SSC-CGL-2023-ISP"],
    ownershipNotes: ["ISP identity/role belongs to COM-004; modem, access media, IP assignment and connection architecture remain COM-005 Networking."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-038",
    learnerTask: "Recognize ARPA/ARPANET as a foundational Internet-history relationship at exam-awareness depth",
    relationFamily: "internet-history-arpanet",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["ARPA", "ARPANET", "Internet precursor", "Internet history"],
    surfaceVariants: [
      "The early project associated with the origin of the Internet was undertaken by which agency?",
      "Which early network is commonly identified as a precursor to the modern Internet?",
      "Which agency is associated with the ARPANET project?",
    ],
    evidence: ["OFFICIAL_EXAM", "OFFICIAL_CURRICULUM", "PYQ_CONFIRMED"],
    sourceRefIds: ["PUNJAB-JAIL-WARDER-2021-ARPA", "PSEB-2026-INTERNET-HISTORY", "RRB-JE-2019-ARPA"],
    ambiguityRisks: ["Avoid simplified claims that ARPANET was itself identical to the modern Internet or that one person alone 'invented the Internet'."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-039",
    learnerTask: "Associate Tim Berners-Lee with invention/development of the World Wide Web",
    relationFamily: "web-history-inventor",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["Tim Berners-Lee", "World Wide Web", "CERN", "Web history"],
    surfaceVariants: [
      "Who is credited with inventing the World Wide Web?",
      "Tim Berners-Lee is most directly associated with which major Web development?",
      "Which scientist developed the World Wide Web while working at CERN?",
    ],
    evidence: ["OFFICIAL_EXAM", "PYQ_CONFIRMED"],
    sourceRefIds: ["APSSB-CSLE-2024-WWW-INVENTOR", "DELHI-POLICE-2020-WWW-INVENTOR", "CERN-WWW-HISTORY"],
    ambiguityRisks: ["Keep Web invention distinct from invention of the Internet."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-040",
    learnerTask: "Associate Ray Tomlinson with early network e-mail at exam-awareness depth",
    relationFamily: "email-history-inventor",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["Ray Tomlinson", "e-mail", "ARPANET", "@ symbol"],
    surfaceVariants: [
      "Who is commonly credited in competitive-exam computer awareness with developing early network e-mail?",
      "Ray Tomlinson is associated with which communication development?",
      "Which Internet communication service is historically associated with Ray Tomlinson?",
    ],
    evidence: ["PYQ_CONFIRMED", "EXAM_PREP_CORPUS"],
    sourceRefIds: ["MP-PATWARI-2023-EMAIL-HISTORY", "DSSSB-2025-EMAIL-INVENTOR", "PSSSB-COMPUTER-CORPUS-EMAIL-HISTORY"],
    ambiguityRisks: ["Do not manufacture an exact 'first e-mail message' text or overstate a single-inventor narrative beyond exam-awareness attribution."],
    productionState: "DISCOVERY_ONLY",
  },
];

export function auditCom004DiscoveryGapAdditionsV2() {
  const issues: string[] = [];
  const ids = new Set<string>();

  for (const candidate of COM004_DISCOVERY_GAP_ADDITIONS_V2) {
    if (!/^WEB-DISC-0(37|38|39|40)$/.test(candidate.candidateId)) issues.push(`Unexpected gap candidate id ${candidate.candidateId}`);
    if (ids.has(candidate.candidateId)) issues.push(`Duplicate gap candidate ${candidate.candidateId}`);
    ids.add(candidate.candidateId);
    if (candidate.productionState !== "DISCOVERY_ONLY") issues.push(`${candidate.candidateId}: escaped discovery state`);
    if (candidate.sourceRefIds.length < 2) issues.push(`${candidate.candidateId}: source evidence too thin for gap admission`);
    if (candidate.surfaceVariants.length < 3) issues.push(`${candidate.candidateId}: needs wider surface coverage`);
  }

  const officialExamIds = COM004_DISCOVERY_GAP_ADDITIONS_V2.filter((candidate) => candidate.evidence.includes("OFFICIAL_EXAM")).map((candidate) => candidate.candidateId);
  const historyIds = COM004_DISCOVERY_GAP_ADDITIONS_V2.filter((candidate) => /history/.test(candidate.relationFamily)).map((candidate) => candidate.candidateId);
  const networkingBoundaryIds = COM004_DISCOVERY_GAP_ADDITIONS_V2.filter((candidate) => candidate.ownershipNotes?.some((note) => note.includes("COM-005"))).map((candidate) => candidate.candidateId);

  if (officialExamIds.length < 3) issues.push("Gap additions need stronger official-exam anchoring");
  if (historyIds.length < 3) issues.push("Internet/Web/e-mail history gap family incomplete");
  if (!networkingBoundaryIds.includes("WEB-DISC-037")) issues.push("ISP candidate must preserve COM-005 ownership boundary");

  return {
    valid: issues.length === 0,
    issues,
    gapCandidateCount: COM004_DISCOVERY_GAP_ADDITIONS_V2.length,
    totalDiscoveryCandidateCount: 40,
    officialExamIds,
    historyIds,
    permanentQlCount: 0,
    productionReady: false,
    nextGate: "COM004_SOURCE_SATURATION_V2_EVIDENCE_CLOSURE_AND_MERGE_SPLIT",
  } as const;
}
