export type Com005DiscoveryEvidence =
  | "OFFICIAL_EXAM"
  | "STANDARDS_AUTHORITY"
  | "PYQ_CONFIRMED"
  | "PYQ_REQUIRED"
  | "DOMAIN_HYPOTHESIS";

export type Com005DiscoveryCandidate = {
  candidateId: string;
  learnerTask: string;
  relationFamily: string;
  candidateMode: "FORWARD_RECALL" | "REVERSE_RECALL" | "CLASSIFICATION" | "COMPARISON" | "PROCEDURAL_MAPPING" | "STATEMENT_SET";
  objectFamilies: string[];
  surfaceVariants: string[];
  evidence: Com005DiscoveryEvidence[];
  sourceRefIds: string[];
  likelyMergeWith?: string[];
  splitIf?: string[];
  ownershipNotes?: string[];
  ambiguityRisks?: string[];
  productionState: "DISCOVERY_ONLY";
};

export const COM005_DISCOVERY_SOURCE_REFS = {
  "SRC-SSC-CGL-COMPUTER": "SSC computer-awareness scope: networking, Internet and related computer fundamentals are exam-relevant areas.",
  "SRC-NIELIT-NETWORK": "NIELIT computer fundamentals scope: LAN/WAN, network devices, topologies, transmission media and basic protocols.",
  "SRC-ISO-OSI": "ISO/IEC 7498-1: OSI reference model terminology; only awareness-level layer/function mapping is eligible.",
  "SRC-IETF-IP": "IETF Internet Protocol standards: IP provides addressing and packet delivery across interconnected networks.",
  "SRC-IETF-DHCP": "IETF DHCP standard: DHCP supplies configuration information such as IP parameters to hosts.",
  "SRC-IETF-DNS": "IETF DNS standards: DNS maps domain names to network resource information; detailed records are out of scope.",
  "SRC-CISCO-BASICS": "Cisco networking fundamentals: common device roles, LAN/WAN distinction, switching and routing at awareness depth.",
  "SRC-PYQ-REQUIRED": "Target-exam PYQ collection is required before any candidate becomes a permanent QL.",
} as const;

type SourceRefId = keyof typeof COM005_DISCOVERY_SOURCE_REFS;
type CandidateInput = Omit<Com005DiscoveryCandidate, "productionState" | "sourceRefIds"> & { sourceRefIds: SourceRefId[] };
const c = (candidate: CandidateInput): Com005DiscoveryCandidate => ({ ...candidate, productionState: "DISCOVERY_ONLY" });

/** Provisional COM-005 inventory. No permanent QL or runtime generation is authorized here. */
export const COM005_NETWORKING_DISCOVERY: Com005DiscoveryCandidate[] = [
  c({
    candidateId: "NET-DISC-001",
    learnerTask: "Classify a network by geographic scope or coverage",
    relationFamily: "network-scope",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["PAN", "LAN", "MAN", "WAN"],
    surfaceVariants: ["Which network covers a small office or building?", "Which network type covers a large geographic area?"],
    evidence: ["OFFICIAL_EXAM", "PYQ_REQUIRED"],
    sourceRefIds: ["SRC-SSC-CGL-COMPUTER", "SRC-NIELIT-NETWORK", "SRC-PYQ-REQUIRED"],
    ambiguityRisks: ["Do not use exact distance limits; exam definitions differ by context."],
  }),
  c({
    candidateId: "NET-DISC-002",
    learnerTask: "Identify a network topology from its connection pattern",
    relationFamily: "network-topology",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["bus", "star", "ring", "mesh", "tree"],
    surfaceVariants: ["Which topology uses a central connecting device?", "Which topology gives each node a direct link to every other node?"],
    evidence: ["OFFICIAL_EXAM", "PYQ_REQUIRED"],
    sourceRefIds: ["SRC-SSC-CGL-COMPUTER", "SRC-NIELIT-NETWORK", "SRC-PYQ-REQUIRED"],
    ambiguityRisks: ["Use simple connection patterns; do not test physical-versus-logical topology theory."],
  }),
  c({
    candidateId: "NET-DISC-003",
    learnerTask: "Map a common networking device to its main function",
    relationFamily: "device-function",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["hub", "switch", "router", "repeater", "bridge", "gateway", "access point", "modem", "NIC"],
    surfaceVariants: ["Which device connects different networks?", "Which device forwards data to the intended device in a LAN?"],
    evidence: ["OFFICIAL_EXAM", "PYQ_CONFIRMED"],
    sourceRefIds: ["SRC-SSC-CGL-COMPUTER", "SRC-NIELIT-NETWORK", "SRC-CISCO-BASICS"],
    splitIf: ["Split device families only if PYQs show a distinct solver and enough independent coverage."],
    ambiguityRisks: ["Do not use vendor-specific features; keep each device to its basic exam-level role."],
  }),
  c({
    candidateId: "NET-DISC-004",
    learnerTask: "Distinguish a hub, switch and router by forwarding scope",
    relationFamily: "device-forwarding-comparison",
    candidateMode: "COMPARISON",
    objectFamilies: ["hub", "switch", "router", "LAN", "network", "broadcast"],
    surfaceVariants: ["Which device forwards a frame to the selected LAN port?", "Which device connects separate networks?"],
    evidence: ["STANDARDS_AUTHORITY", "PYQ_REQUIRED"],
    sourceRefIds: ["SRC-CISCO-BASICS", "SRC-PYQ-REQUIRED"],
    likelyMergeWith: ["NET-DISC-003"],
    splitIf: ["Keep separate only if comparison questions require a meaningfully different decision process."],
  }),
  c({
    candidateId: "NET-DISC-005",
    learnerTask: "Identify a basic protocol or service from its communication purpose",
    relationFamily: "protocol-purpose",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["TCP", "IP", "DNS", "DHCP", "HTTP", "HTTPS", "FTP", "SMTP", "POP3", "IMAP"],
    surfaceVariants: ["Which protocol assigns network configuration automatically?", "Which protocol resolves a domain name?"],
    evidence: ["STANDARDS_AUTHORITY", "PYQ_REQUIRED"],
    sourceRefIds: ["SRC-IETF-IP", "SRC-IETF-DHCP", "SRC-IETF-DNS", "SRC-PYQ-REQUIRED"],
    ownershipNotes: ["COM-004 owns user-facing web and e-mail workflows; COM-005 owns only basic protocol-purpose mapping.", "COM-006 owns security threats and defensive controls."],
    likelyMergeWith: ["NET-DISC-006"],
    ambiguityRisks: ["Do not test port numbers, packet fields or version-specific protocol behavior at this stage."],
  }),
  c({
    candidateId: "NET-DISC-006",
    learnerTask: "Match a network protocol to its short expansion or layer-level role",
    relationFamily: "protocol-identity",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["TCP", "IP", "DNS", "DHCP", "FTP"],
    surfaceVariants: ["What does DNS stand for?", "Which protocol is associated with file transfer?"],
    evidence: ["OFFICIAL_EXAM", "PYQ_REQUIRED"],
    sourceRefIds: ["SRC-SSC-CGL-COMPUTER", "SRC-IETF-IP", "SRC-IETF-DHCP", "SRC-IETF-DNS", "SRC-PYQ-REQUIRED"],
    likelyMergeWith: ["NET-DISC-005"],
    ambiguityRisks: ["Expansion-only recall is not enough for a permanent QL unless target-exam evidence supports it."],
  }),
  c({
    candidateId: "NET-DISC-007",
    learnerTask: "Distinguish IP address, MAC address and domain name by identity and use",
    relationFamily: "addressing-terminology",
    candidateMode: "COMPARISON",
    objectFamilies: ["IP address", "MAC address", "domain name", "host", "network interface"],
    surfaceVariants: ["Which identifier is associated with a network interface?", "Which name is used instead of a numeric network address for people?"],
    evidence: ["STANDARDS_AUTHORITY", "PYQ_REQUIRED"],
    sourceRefIds: ["SRC-IETF-IP", "SRC-IETF-DNS", "SRC-PYQ-REQUIRED"],
    ownershipNotes: ["COM-004 may mention domains in URLs, but IP/MAC/addressing mechanics belong here."],
    ambiguityRisks: ["Avoid claiming that a MAC address is globally unique in every operational context."],
  }),
  c({
    candidateId: "NET-DISC-008",
    learnerTask: "Classify common wired and wireless transmission media",
    relationFamily: "transmission-media",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["twisted pair", "coaxial cable", "optical fiber", "radio/wireless"],
    surfaceVariants: ["Which medium carries data using light?", "Which medium is wireless?"],
    evidence: ["OFFICIAL_EXAM", "PYQ_REQUIRED"],
    sourceRefIds: ["SRC-NIELIT-NETWORK", "SRC-PYQ-REQUIRED"],
    splitIf: ["Split media property comparison only if PYQs support separate attenuation/speed reasoning."],
    ambiguityRisks: ["Do not use current speed or price rankings; they change with technology and deployment."],
  }),
  c({
    candidateId: "NET-DISC-009",
    learnerTask: "Distinguish simplex, half-duplex and full-duplex transmission",
    relationFamily: "transmission-direction",
    candidateMode: "COMPARISON",
    objectFamilies: ["simplex", "half-duplex", "full-duplex", "one-way", "two-way"],
    surfaceVariants: ["Which mode permits communication in both directions at the same time?", "Which mode permits transmission in only one direction?"],
    evidence: ["OFFICIAL_EXAM", "PYQ_REQUIRED"],
    sourceRefIds: ["SRC-NIELIT-NETWORK", "SRC-PYQ-REQUIRED"],
  }),
  c({
    candidateId: "NET-DISC-010",
    learnerTask: "Recognize basic network performance terms such as bandwidth and latency",
    relationFamily: "network-performance-terminology",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["bandwidth", "latency", "data transfer", "delay"],
    surfaceVariants: ["Which term describes delay before data begins to arrive?", "Which term describes the capacity of a link to carry data?"],
    evidence: ["DOMAIN_HYPOTHESIS", "PYQ_REQUIRED"],
    sourceRefIds: ["SRC-NIELIT-NETWORK", "SRC-PYQ-REQUIRED"],
    splitIf: ["Hold unless target-exam evidence shows repeated, unambiguous terminology questions."],
  }),
];

export type Com005DiscoveryAudit = {
  candidateCount: number;
  relationFamilyCount: number;
  sourceRefCount: number;
  officialOrStandardsCandidateCount: number;
  pyqConfirmedCandidateCount: number;
  pyqRequiredCandidateCount: number;
  com004BoundaryIds: string[];
  com006BoundaryIds: string[];
  permanentQlCount: number;
  productionReady: boolean;
  sourceSaturationClosed: boolean;
  nextGate: "COM005_SOURCE_SATURATION_AND_MERGE_SPLIT_AUDIT";
  issues: string[];
};

export function auditCom005NetworkingDiscovery(): Com005DiscoveryAudit {
  const ids = new Set<string>();
  const relationFamilies = new Set<string>();
  const issues: string[] = [];
  for (const candidate of COM005_NETWORKING_DISCOVERY) {
    if (ids.has(candidate.candidateId)) issues.push(`duplicate candidate: ${candidate.candidateId}`);
    ids.add(candidate.candidateId);
    relationFamilies.add(candidate.relationFamily);
    if (candidate.productionState !== "DISCOVERY_ONLY") issues.push(`${candidate.candidateId} is not discovery-only`);
    if (candidate.sourceRefIds.length === 0) issues.push(`${candidate.candidateId} has no source refs`);
    if (candidate.surfaceVariants.length < 2) issues.push(`${candidate.candidateId} needs two simple stem surfaces`);
  }
  const com004BoundaryIds = COM005_NETWORKING_DISCOVERY.filter((c) => c.ownershipNotes?.some((n) => /COM-004/i.test(n))).map((c) => c.candidateId);
  const com006BoundaryIds = COM005_NETWORKING_DISCOVERY.filter((c) => c.ownershipNotes?.some((n) => /COM-006/i.test(n))).map((c) => c.candidateId);
  return {
    candidateCount: COM005_NETWORKING_DISCOVERY.length,
    relationFamilyCount: relationFamilies.size,
    sourceRefCount: Object.keys(COM005_DISCOVERY_SOURCE_REFS).length,
    officialOrStandardsCandidateCount: COM005_NETWORKING_DISCOVERY.filter((c) => c.evidence.some((e) => e === "OFFICIAL_EXAM" || e === "STANDARDS_AUTHORITY")).length,
    pyqConfirmedCandidateCount: COM005_NETWORKING_DISCOVERY.filter((c) => c.evidence.includes("PYQ_CONFIRMED")).length,
    pyqRequiredCandidateCount: COM005_NETWORKING_DISCOVERY.filter((c) => c.evidence.includes("PYQ_REQUIRED")).length,
    com004BoundaryIds,
    com006BoundaryIds,
    permanentQlCount: 0,
    productionReady: false,
    sourceSaturationClosed: false,
    nextGate: "COM005_SOURCE_SATURATION_AND_MERGE_SPLIT_AUDIT",
    issues,
  };
}
