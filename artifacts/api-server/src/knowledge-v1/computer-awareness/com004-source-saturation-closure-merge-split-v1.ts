import { COM004_INTERNET_WEB_EMAIL_DISCOVERY } from "./com004-internet-web-email-discovery";
import { COM004_DISCOVERY_GAP_ADDITIONS_V2 } from "./com004-discovery-gap-additions-v2";
import { COM004_DISCOVERY_GAP_ADDITIONS_V3 } from "./com004-discovery-gap-additions-v3";

export type Com004AuthorityProposal = {
  authorityKey: string;
  learnerTask: string;
  sourceCandidateIds: string[];
  mergeReason: string;
  objectPoolExamples: string[];
  protectedBoundaries?: string[];
  productionState: "MERGE_SPLIT_PROPOSAL_ONLY";
};

export const COM004_AUTHORITY_PROPOSALS_V1: Com004AuthorityProposal[] = [
  {
    authorityKey: "COM004-AUTH-PROP-001",
    learnerTask: "Identify the Internet and the role of an ISP in providing user access",
    sourceCandidateIds: ["WEB-DISC-001", "WEB-DISC-037"],
    mergeReason: "Internet identity and ISP role form one coherent access-level foundation; connection technology remains outside this authority.",
    objectPoolExamples: ["Internet", "network of networks", "ISP", "Internet Service Provider", "Internet access"],
    protectedBoundaries: ["Modems, IP assignment, access media and network architecture remain COM-005."],
    productionState: "MERGE_SPLIT_PROPOSAL_ONLY",
  },
  {
    authorityKey: "COM004-AUTH-PROP-002",
    learnerTask: "Distinguish the World Wide Web from the Internet",
    sourceCandidateIds: ["WEB-DISC-002"],
    mergeReason: "This is a durable misconception boundary and should not be diluted into generic Internet definitions.",
    objectPoolExamples: ["Internet", "World Wide Web", "web pages", "Internet service/application"],
    productionState: "MERGE_SPLIT_PROPOSAL_ONLY",
  },
  {
    authorityKey: "COM004-AUTH-PROP-003",
    learnerTask: "Classify core Web-resource terms such as webpage, website, homepage and hyperlink",
    sourceCandidateIds: ["WEB-DISC-003", "WEB-DISC-004"],
    mergeReason: "Punjab official papers directly distinguish website/homepage; hyperlink is the linked-resource relation inside the same Web-resource concept family.",
    objectPoolExamples: ["webpage", "website", "homepage", "hyperlink", "linked resource"],
    productionState: "MERGE_SPLIT_PROPOSAL_ONLY",
  },
  {
    authorityKey: "COM004-AUTH-PROP-004",
    learnerTask: "Classify common user-facing Internet services",
    sourceCandidateIds: ["WEB-DISC-005"],
    mergeReason: "E-mail, chat rooms, mailing lists, video conferencing, social networking and e-commerce are object-pool members of one service-classification task.",
    objectPoolExamples: ["e-mail", "chat room", "mailing list", "video conferencing", "social networking", "e-commerce", "Web"],
    protectedBoundaries: ["Underlying network technology belongs to COM-005; security taxonomy belongs to COM-006."],
    productionState: "MERGE_SPLIT_PROPOSAL_ONLY",
  },
  {
    authorityKey: "COM004-AUTH-PROP-005",
    learnerTask: "Distinguish browsers from search engines and recognize the basic Web-search process",
    sourceCandidateIds: ["WEB-DISC-006", "WEB-DISC-007", "WEB-DISC-008", "WEB-DISC-012"],
    mergeReason: "Multiple Punjab competitive papers show browser-versus-search-engine classification; product names and search-query terms are surface/object variants, not separate learner tasks.",
    objectPoolExamples: ["browser", "search engine", "Chrome", "Firefox", "Edge", "Safari", "Google Search", "Bing", "query", "search result"],
    protectedBoundaries: ["No market-share, default-browser or provider-ranking claims."],
    productionState: "MERGE_SPLIT_PROPOSAL_ONLY",
  },
  {
    authorityKey: "COM004-AUTH-PROP-006",
    learnerTask: "Map common browser controls and saved/state features to their user-facing purposes",
    sourceCandidateIds: ["WEB-DISC-009", "WEB-DISC-010", "WEB-DISC-041"],
    mergeReason: "Reload/back/bookmark/history/cache/cookie questions all test browser-state/navigation awareness; separate QLs would over-fragment a modest exam pattern.",
    objectPoolExamples: ["Back", "Forward", "Reload", "bookmark", "history", "cache", "cookie", "third-party cookie"],
    protectedBoundaries: ["Browser-vendor UI defaults are mutable; cookie security/attack-control depth remains COM-006."],
    productionState: "MERGE_SPLIT_PROPOSAL_ONLY",
  },
  {
    authorityKey: "COM004-AUTH-PROP-007",
    learnerTask: "Distinguish downloading from uploading by transfer direction",
    sourceCandidateIds: ["WEB-DISC-011"],
    mergeReason: "Explicit official SSC scope plus Punjab competitive recurrence supports a standalone directional transfer task.",
    objectPoolExamples: ["download", "upload", "local device", "remote server/service"],
    productionState: "MERGE_SPLIT_PROPOSAL_ONLY",
  },
  {
    authorityKey: "COM004-AUTH-PROP-008",
    learnerTask: "Identify URLs/domains and recognize durable Web-address components and suffixes at awareness depth",
    sourceCandidateIds: ["WEB-DISC-013", "WEB-DISC-014", "WEB-DISC-015", "WEB-DISC-016"],
    mergeReason: "URL, domain, high-level components and common suffix recognition are one Web-address learner task; separate component/TLD QLs would duplicate facts.",
    objectPoolExamples: ["URL", "scheme", "domain/host", "path", ".com", ".org", ".in"],
    protectedBoundaries: ["DNS resolution and IP-address mechanics remain COM-005.", "Do not treat generic TLDs as proof of the registrant's real-world organization type."],
    productionState: "MERGE_SPLIT_PROPOSAL_ONLY",
  },
  {
    authorityKey: "COM004-AUTH-PROP-009",
    learnerTask: "Distinguish HTTP from HTTPS at Web-use and basic secure-channel awareness depth",
    sourceCandidateIds: ["WEB-DISC-017"],
    mergeReason: "Punjab official HTTPS questions and Web standards support a distinct protocol-purpose/security contrast.",
    objectPoolExamples: ["HTTP", "HTTPS", "Web resource transfer", "secure encrypted channel", "TLS"],
    protectedBoundaries: ["Ports, stack layers and transport mechanics remain COM-005.", "HTTPS alone is not proof that a site is legitimate."],
    productionState: "MERGE_SPLIT_PROPOSAL_ONLY",
  },
  {
    authorityKey: "COM004-AUTH-PROP-010",
    learnerTask: "Recognize high-frequency historical associations for Internet, Web and e-mail",
    sourceCandidateIds: ["WEB-DISC-038", "WEB-DISC-039", "WEB-DISC-040"],
    mergeReason: "History surfaced in Punjab official/curriculum and cross-government exam evidence; one compact history authority prevents trivia from fragmenting the chapter.",
    objectPoolExamples: ["ARPA", "ARPANET", "Tim Berners-Lee", "World Wide Web", "Ray Tomlinson", "e-mail"],
    protectedBoundaries: ["Do not equate ARPANET with the modern Internet or claim a simplistic single-person invention of the Internet."],
    productionState: "MERGE_SPLIT_PROPOSAL_ONLY",
  },
  {
    authorityKey: "COM004-AUTH-PROP-011",
    learnerTask: "Identify basic e-mail concepts, address structure and webmail/client access forms",
    sourceCandidateIds: ["WEB-DISC-019", "WEB-DISC-020", "WEB-DISC-026"],
    mergeReason: "E-mail identity, local-part/@/domain structure and webmail-vs-client are one basic e-mail access/identity family; webmail/client evidence is too thin for its own QL.",
    objectPoolExamples: ["e-mail", "e-mail address", "local part", "@", "domain", "webmail", "mail client"],
    productionState: "MERGE_SPLIT_PROPOSAL_ONLY",
  },
  {
    authorityKey: "COM004-AUTH-PROP-012",
    learnerTask: "Map e-mail message fields to recipient and message roles",
    sourceCandidateIds: ["WEB-DISC-021", "WEB-DISC-022"],
    mergeReason: "To/Cc/Bcc and Subject/body are all composition-field semantics; Punjab official Bcc evidence supports the family.",
    objectPoolExamples: ["To", "Cc", "Bcc", "Subject", "message body", "visible recipient", "hidden copy"],
    productionState: "MERGE_SPLIT_PROPOSAL_ONLY",
  },
  {
    authorityKey: "COM004-AUTH-PROP-013",
    learnerTask: "Map e-mail account-management actions and mailbox folders to their purposes",
    sourceCandidateIds: ["WEB-DISC-023", "WEB-DISC-025"],
    mergeReason: "Punjab Police official papers directly test Reply/Forward and Drafts/Spam behavior; both are account-management operations.",
    objectPoolExamples: ["Reply", "Reply All", "Forward", "Inbox", "Sent", "Drafts", "Spam/Junk", "Trash"],
    productionState: "MERGE_SPLIT_PROPOSAL_ONLY",
  },
  {
    authorityKey: "COM004-AUTH-PROP-014",
    learnerTask: "Identify e-mail attachments and what can be sent as attached files",
    sourceCandidateIds: ["WEB-DISC-024"],
    mergeReason: "Attachment use is independently recurrent and concrete enough to retain; provider-specific attachment-size limits are excluded.",
    objectPoolExamples: ["attachment", "document", "image", "audio file", "video file", "message body"],
    protectedBoundaries: ["Provider-specific attachment-size limits are mutable and excluded."],
    productionState: "MERGE_SPLIT_PROPOSAL_ONLY",
  },
  {
    authorityKey: "COM004-AUTH-PROP-015",
    learnerTask: "Match SMTP, POP3 and IMAP with their broad e-mail roles",
    sourceCandidateIds: ["WEB-DISC-027", "WEB-DISC-028", "WEB-DISC-029", "WEB-DISC-030"],
    mergeReason: "Atomic SMTP/POP3/IMAP candidates collapse into one protocol-role discrimination authority; Punjab official SMTP evidence and standards sources anchor truth.",
    objectPoolExamples: ["SMTP", "POP3", "IMAP", "sending/transport", "retrieval/access", "server-resident mailbox"],
    protectedBoundaries: ["Protocol ports and stack-layer mechanics remain COM-005.", "Do not teach POP3 as invariably deleting mail from the server."],
    productionState: "MERGE_SPLIT_PROPOSAL_ONLY",
  },
  {
    authorityKey: "COM004-AUTH-PROP-016",
    learnerTask: "Identify e-banking and classify durable online-banking capabilities",
    sourceCandidateIds: ["WEB-DISC-031", "WEB-DISC-032"],
    mergeReason: "Definition and stable capabilities are one service-use family; changing payment-system limits/timings remain outside Computer Awareness.",
    objectPoolExamples: ["Internet banking", "e-banking", "balance inquiry", "account statement", "online fund transfer"],
    protectedBoundaries: ["Current NEFT/RTGS/IMPS/UPI rules, limits and timings belong to Banking Awareness/current affairs."],
    productionState: "MERGE_SPLIT_PROPOSAL_ONLY",
  },
  {
    authorityKey: "COM004-AUTH-PROP-017",
    learnerTask: "Apply regulator-backed safe-use practices for e-banking",
    sourceCandidateIds: ["WEB-DISC-033", "WEB-DISC-034", "WEB-DISC-035"],
    mergeReason: "Verified URL/HTTPS context, credential secrecy and safe access environment are one user-facing e-banking safety decision family.",
    objectPoolExamples: ["verified bank URL", "HTTPS", "password", "PIN", "OTP", "public/open Wi-Fi", "trusted device"],
    protectedBoundaries: ["Phishing, malware, attack and security-control taxonomy remain COM-006.", "HTTPS alone is not proof of legitimacy."],
    productionState: "MERGE_SPLIT_PROPOSAL_ONLY",
  },
];

export const COM004_NON_AUTHORITY_DISCOVERY_DISPOSITIONS_V1 = [
  {
    candidateId: "WEB-DISC-018",
    disposition: "COMPOSITION_ONLY",
    reason: "WWW/URL/HTTP/HTTPS abbreviation expansion reuses facts owned by Web/URL/HTTP authorities and should be generated as a matching/abbreviation composition form, not a duplicate factual QL.",
  },
  {
    candidateId: "WEB-DISC-036",
    disposition: "COMPOSITION_ONLY",
    reason: "Cross-topic statement/matching sets are presentation forms over already-owned atomic facts and must not become an overlapping factual authority.",
  },
] as const;

export const COM004_EXTERNAL_OWNERSHIP_DISPOSITIONS_V1 = [
  {
    pattern: "Internet access technologies / media / modem / DNS / IP / ports / stack mechanics",
    owner: "COM-005",
  },
  {
    pattern: "Phishing / malware / attacks / CAPTCHA-security taxonomy / browser-security control taxonomy",
    owner: "COM-006",
  },
  {
    pattern: "Current payment-system limits, timings, settlement rules and mutable banking-product details",
    owner: "BANKING_AWARENESS_CURRENT_AFFAIRS",
  },
  {
    pattern: "Provider-specific attachment limits, browser market share/defaults and similar mutable product trivia",
    owner: "REJECT_FROM_CANONICAL_COM004",
  },
] as const;

export function auditCom004SourceSaturationClosureMergeSplitV1() {
  const issues: string[] = [];
  const baseCandidates = COM004_INTERNET_WEB_EMAIL_DISCOVERY;
  const v2Candidates = COM004_DISCOVERY_GAP_ADDITIONS_V2;
  const v3Candidates = COM004_DISCOVERY_GAP_ADDITIONS_V3;
  const allCandidates = [...baseCandidates, ...v2Candidates, ...v3Candidates];
  const allCandidateIds = allCandidates.map((candidate) => candidate.candidateId);
  const expectedIds = Array.from({ length: 41 }, (_, index) => `WEB-DISC-${String(index + 1).padStart(3, "0")}`);

  if (new Set(allCandidateIds).size !== allCandidateIds.length) issues.push("Duplicate discovery candidate id across saturation waves");
  for (const expectedId of expectedIds) {
    if (!allCandidateIds.includes(expectedId)) issues.push(`Missing discovery candidate ${expectedId}`);
  }

  const authorityCandidateIds = COM004_AUTHORITY_PROPOSALS_V1.flatMap((proposal) => proposal.sourceCandidateIds);
  const compositionCandidateIds = COM004_NON_AUTHORITY_DISCOVERY_DISPOSITIONS_V1.map((entry) => entry.candidateId);
  const dispositionIds = [...authorityCandidateIds, ...compositionCandidateIds];

  if (new Set(authorityCandidateIds).size !== authorityCandidateIds.length) issues.push("A discovery candidate is assigned to multiple authority proposals");
  if (new Set(dispositionIds).size !== dispositionIds.length) issues.push("A discovery candidate has multiple final merge/split dispositions");
  for (const candidateId of allCandidateIds) {
    if (!dispositionIds.includes(candidateId)) issues.push(`Unresolved candidate disposition: ${candidateId}`);
  }
  for (const candidateId of dispositionIds) {
    if (!allCandidateIds.includes(candidateId)) issues.push(`Disposition references unknown candidate: ${candidateId}`);
  }

  if (COM004_AUTHORITY_PROPOSALS_V1.length !== 17) issues.push("Expected 17 merged authority proposals before permanent QL allocation");
  if (COM004_NON_AUTHORITY_DISCOVERY_DISPOSITIONS_V1.length !== 2) issues.push("Expected exactly two composition-only discovery families");
  if (COM004_EXTERNAL_OWNERSHIP_DISPOSITIONS_V1.length < 4) issues.push("External ownership/rejection coverage incomplete");

  for (const proposal of COM004_AUTHORITY_PROPOSALS_V1) {
    if (!/^COM004-AUTH-PROP-\d{3}$/.test(proposal.authorityKey)) issues.push(`Bad authority proposal key ${proposal.authorityKey}`);
    if (proposal.productionState !== "MERGE_SPLIT_PROPOSAL_ONLY") issues.push(`${proposal.authorityKey}: escaped proposal state`);
    if (proposal.sourceCandidateIds.length === 0) issues.push(`${proposal.authorityKey}: no source candidates`);
    if (proposal.objectPoolExamples.length < 3) issues.push(`${proposal.authorityKey}: object pool too thin`);
  }

  const securityProposal = COM004_AUTHORITY_PROPOSALS_V1.find((proposal) => proposal.authorityKey === "COM004-AUTH-PROP-017");
  if (!securityProposal?.protectedBoundaries?.some((boundary) => /HTTPS alone is not proof/i.test(boundary))) {
    issues.push("E-banking safety authority lost HTTPS legitimacy misconception lock");
  }
  const protocolProposal = COM004_AUTHORITY_PROPOSALS_V1.find((proposal) => proposal.authorityKey === "COM004-AUTH-PROP-015");
  if (!protocolProposal?.protectedBoundaries?.some((boundary) => /POP3.*invariably deleting/i.test(boundary))) {
    issues.push("E-mail protocol authority lost POP3 misconception lock");
  }
  const cookieProposal = COM004_AUTHORITY_PROPOSALS_V1.find((proposal) => proposal.authorityKey === "COM004-AUTH-PROP-006");
  if (!cookieProposal?.sourceCandidateIds.includes("WEB-DISC-041")) issues.push("Late cookie gap is not resolved into browser features/state authority");

  return {
    valid: issues.length === 0,
    issues,
    discoveryCandidateCount: allCandidates.length,
    authorityProposalCount: COM004_AUTHORITY_PROPOSALS_V1.length,
    compositionOnlyCandidateCount: COM004_NON_AUTHORITY_DISCOVERY_DISPOSITIONS_V1.length,
    externalOwnershipDispositionCount: COM004_EXTERNAL_OWNERSHIP_DISPOSITIONS_V1.length,
    permanentQlCount: 0,
    sourceSaturationClosed: issues.length === 0,
    mergeSplitClosed: false,
    productionReady: false,
    nextGate: "COM004_MERGE_SPLIT_FINAL_AND_PERMANENT_QL_ALLOCATION",
  } as const;
}
