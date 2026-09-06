export type Com004DiscoveryEvidence =
  | "OFFICIAL_EXAM"
  | "STANDARDS_AUTHORITY"
  | "REGULATOR_AUTHORITY"
  | "EXAM_PREP_CORPUS"
  | "PYQ_CONFIRMED"
  | "PYQ_REQUIRED"
  | "DOMAIN_HYPOTHESIS";

export type Com004DiscoveryCandidate = {
  candidateId: string;
  learnerTask: string;
  relationFamily: string;
  candidateMode:
    | "FORWARD_RECALL"
    | "REVERSE_RECALL"
    | "CLASSIFICATION"
    | "COMPARISON"
    | "PROCEDURAL_MAPPING"
    | "STATEMENT_SET"
    | "MATCHING";
  objectFamilies: string[];
  surfaceVariants: string[];
  evidence: Com004DiscoveryEvidence[];
  sourceRefIds: string[];
  likelyMergeWith?: string[];
  splitIf?: string[];
  ownershipNotes?: string[];
  ambiguityRisks?: string[];
  productionState: "DISCOVERY_ONLY";
};

export const COM004_DISCOVERY_SOURCE_REFS = {
  "SRC-SSC-CGL-2026": "SSC CGL 2026 notice: Working with Internet and e-mails — Web Browsing & Searching, Downloading & Uploading, Managing an E-mail Account, e-Banking.",
  "SRC-MDN-WWW": "MDN World Wide Web glossary: Web is a system of interlinked public pages accessed through the Internet and is not identical to the Internet.",
  "SRC-MDN-URL": "MDN URL glossary / URI reference: URL identifies the location of a resource and has scheme/domain/path structure at awareness depth.",
  "SRC-MDN-HTTP": "MDN HTTP/HTTPS glossary: HTTP transfers Web resources; HTTPS uses a secure TLS channel.",
  "SRC-IETF-SMTP": "RFC 5321: SMTP is the basic Internet electronic-mail transport protocol.",
  "SRC-IETF-IMAP": "RFC 9051: IMAP lets a client access and manipulate mail stored on a server.",
  "SRC-IETF-POP3": "RFC 1939: POP3 is a mail-access protocol; detailed port/security trivia is outside COM-004 unless separately justified.",
  "SRC-RBI-DIGITAL-SAFETY": "RBI digital-banking safeguards: use verified secure sites, protect credentials/OTP/PIN, avoid public/open networks and report unauthorized transactions.",
  "SRC-OLIVE-INTERNET-2026": "Oliveboard 2026 Internet & Web bank-exam corpus: recurring browser/search, WWW, URL/DNS, HTTP/HTTPS, e-mail-protocol and internet-service patterns.",
  "SRC-TESTBOOK-INTERNET-2026": "Testbook 2026 Internet question corpus: recurring e-mail fields, web/internet terminology and user-facing internet-service questions.",
  "SRC-TESTBOOK-EBANKING-2026": "Testbook 2026 Internet-banking corpus: balance inquiry, account statement and online fund-transfer use cases.",
} as const;

type Com004SourceRefId = keyof typeof COM004_DISCOVERY_SOURCE_REFS;

const c = (
  candidate: Omit<Com004DiscoveryCandidate, "productionState"> & { sourceRefIds: Com004SourceRefId[] },
): Com004DiscoveryCandidate => ({ ...candidate, productionState: "DISCOVERY_ONLY" });

/**
 * COM-004 — Internet, Web, E-mail & Digital Services
 *
 * Exhaustive provisional learner-task discovery inventory. This file is NOT
 * a permanent QL allocation and does not authorize generation, Question Bank,
 * tests, mocks or publication. Source saturation, merge/split and ownership
 * audits must close before permanent identities are proposed.
 */
export const COM004_INTERNET_WEB_EMAIL_DISCOVERY: Com004DiscoveryCandidate[] = [
  c({
    candidateId: "WEB-DISC-001",
    learnerTask: "Identify the Internet as a global network of interconnected networks",
    relationFamily: "internet-definition",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["Internet", "network of networks", "global connectivity"],
    surfaceVariants: ["Which term describes a global network of interconnected computer networks?", "The phrase ‘network of networks’ most commonly refers to what?"],
    evidence: ["OFFICIAL_EXAM", "EXAM_PREP_CORPUS"],
    sourceRefIds: ["SRC-SSC-CGL-2026", "SRC-OLIVE-INTERNET-2026"],
  }),
  c({
    candidateId: "WEB-DISC-002",
    learnerTask: "Distinguish the World Wide Web from the Internet",
    relationFamily: "internet-vs-web",
    candidateMode: "COMPARISON",
    objectFamilies: ["Internet", "World Wide Web", "web pages", "internet service"],
    surfaceVariants: ["Which statement correctly distinguishes the Internet from the World Wide Web?", "The World Wide Web is best described as what in relation to the Internet?"],
    evidence: ["OFFICIAL_EXAM", "STANDARDS_AUTHORITY", "EXAM_PREP_CORPUS"],
    sourceRefIds: ["SRC-SSC-CGL-2026", "SRC-MDN-WWW", "SRC-OLIVE-INTERNET-2026"],
  }),
  c({
    candidateId: "WEB-DISC-003",
    learnerTask: "Recognize a web page, website and home page as distinct web concepts",
    relationFamily: "web-resource-classification",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["web page", "website", "home page"],
    surfaceVariants: ["Which term refers to a collection of related web pages under a common site?", "What is commonly meant by the home page of a website?"],
    evidence: ["EXAM_PREP_CORPUS", "PYQ_REQUIRED"],
    sourceRefIds: ["SRC-OLIVE-INTERNET-2026"],
    ambiguityRisks: ["Avoid treating every landing page as a home page; use conventional exam-level wording only."],
  }),
  c({
    candidateId: "WEB-DISC-004",
    learnerTask: "Identify hyperlinks as navigational links connecting web resources",
    relationFamily: "web-hyperlink-purpose",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["hyperlink", "linked resource", "navigation"],
    surfaceVariants: ["Which web element takes a user to another linked resource when activated?", "What is the clickable connection between web resources called?"],
    evidence: ["STANDARDS_AUTHORITY", "EXAM_PREP_CORPUS"],
    sourceRefIds: ["SRC-MDN-WWW", "SRC-OLIVE-INTERNET-2026"],
  }),
  c({
    candidateId: "WEB-DISC-005",
    learnerTask: "Classify common Internet services such as Web browsing, e-mail and file transfer",
    relationFamily: "internet-service-classification",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["Web", "e-mail", "file transfer", "voice/video communication"],
    surfaceVariants: ["Which of the following is an Internet service?", "Which option is NOT ordinarily classified as an Internet service?"],
    evidence: ["OFFICIAL_EXAM", "EXAM_PREP_CORPUS"],
    sourceRefIds: ["SRC-SSC-CGL-2026", "SRC-OLIVE-INTERNET-2026"],
    likelyMergeWith: ["WEB-DISC-001"],
  }),
  c({
    candidateId: "WEB-DISC-006",
    learnerTask: "Distinguish a web browser from a search engine",
    relationFamily: "browser-vs-search-engine",
    candidateMode: "COMPARISON",
    objectFamilies: ["web browser", "search engine", "Chrome", "Firefox", "Edge", "Google Search", "Bing"],
    surfaceVariants: ["Which option is a web browser rather than a search engine?", "What is the difference between a browser and a search engine?"],
    evidence: ["OFFICIAL_EXAM", "EXAM_PREP_CORPUS", "PYQ_CONFIRMED"],
    sourceRefIds: ["SRC-SSC-CGL-2026", "SRC-OLIVE-INTERNET-2026", "SRC-TESTBOOK-INTERNET-2026"],
    ambiguityRisks: ["Product examples are slow-mutable; prefer category identity over market-share/current-default claims."],
  }),
  c({
    candidateId: "WEB-DISC-007",
    learnerTask: "Identify common web browsers from product names",
    relationFamily: "browser-product-identity",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["Chrome", "Firefox", "Edge", "Safari", "web browser"],
    surfaceVariants: ["Which of the following is a web browser?", "Which application is used to browse websites?"],
    evidence: ["EXAM_PREP_CORPUS", "PYQ_CONFIRMED"],
    sourceRefIds: ["SRC-OLIVE-INTERNET-2026", "SRC-TESTBOOK-INTERNET-2026"],
    likelyMergeWith: ["WEB-DISC-006"],
    ambiguityRisks: ["Do not encode current popularity, bundled status or default-browser claims."],
  }),
  c({
    candidateId: "WEB-DISC-008",
    learnerTask: "Identify common search engines from product names",
    relationFamily: "search-engine-product-identity",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["Google Search", "Bing", "DuckDuckGo", "search engine"],
    surfaceVariants: ["Which of the following is a search engine?", "Which service is primarily used to search indexed web content?"],
    evidence: ["OFFICIAL_EXAM", "EXAM_PREP_CORPUS"],
    sourceRefIds: ["SRC-SSC-CGL-2026", "SRC-OLIVE-INTERNET-2026"],
    likelyMergeWith: ["WEB-DISC-006"],
    ambiguityRisks: ["Avoid current market-share or ranking claims."],
  }),
  c({
    candidateId: "WEB-DISC-009",
    learnerTask: "Map basic browser controls such as Back, Forward, Refresh/Reload, Home and Stop to their user-facing effects",
    relationFamily: "browser-navigation-control",
    candidateMode: "PROCEDURAL_MAPPING",
    objectFamilies: ["Back", "Forward", "Refresh", "Reload", "Home", "Stop"],
    surfaceVariants: ["Which browser control reloads the current page?", "Which control returns to the previously viewed page?"],
    evidence: ["OFFICIAL_EXAM", "EXAM_PREP_CORPUS"],
    sourceRefIds: ["SRC-SSC-CGL-2026", "SRC-TESTBOOK-INTERNET-2026"],
    ambiguityRisks: ["Avoid browser-specific icon placement and platform-specific shortcuts."],
  }),
  c({
    candidateId: "WEB-DISC-010",
    learnerTask: "Distinguish bookmarks/favorites, browsing history and browser cache at awareness depth",
    relationFamily: "browser-saved-state-concept",
    candidateMode: "COMPARISON",
    objectFamilies: ["bookmark", "favorite", "history", "cache"],
    surfaceVariants: ["Which browser feature saves a page address for later access?", "Which feature records previously visited pages?"],
    evidence: ["EXAM_PREP_CORPUS", "PYQ_REQUIRED"],
    sourceRefIds: ["SRC-OLIVE-INTERNET-2026"],
    ambiguityRisks: ["Cache is technical storage, not a list of visited pages; do not merge it with history."],
  }),
  c({
    candidateId: "WEB-DISC-011",
    learnerTask: "Distinguish downloading from uploading by direction of transfer",
    relationFamily: "download-upload-direction",
    candidateMode: "COMPARISON",
    objectFamilies: ["download", "upload", "local device", "remote service/server"],
    surfaceVariants: ["Copying a file from an online service to your device is called what?", "Sending a local file to a web service is called what?"],
    evidence: ["OFFICIAL_EXAM", "EXAM_PREP_CORPUS", "PYQ_CONFIRMED"],
    sourceRefIds: ["SRC-SSC-CGL-2026", "SRC-OLIVE-INTERNET-2026"],
  }),
  c({
    candidateId: "WEB-DISC-012",
    learnerTask: "Map web-search actions to search-query and result concepts",
    relationFamily: "web-search-process",
    candidateMode: "PROCEDURAL_MAPPING",
    objectFamilies: ["search query", "keyword", "search results", "search engine"],
    surfaceVariants: ["What is the text entered into a search engine to find information commonly called?", "Which service returns web results for entered keywords?"],
    evidence: ["OFFICIAL_EXAM", "EXAM_PREP_CORPUS"],
    sourceRefIds: ["SRC-SSC-CGL-2026", "SRC-OLIVE-INTERNET-2026"],
    likelyMergeWith: ["WEB-DISC-008"],
  }),
  c({
    candidateId: "WEB-DISC-013",
    learnerTask: "Identify a URL as the address/location identifier of an Internet/Web resource",
    relationFamily: "url-purpose",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["URL", "web address", "resource location"],
    surfaceVariants: ["Which term refers to the address used to locate a resource on the Web?", "A web address is commonly represented by which concept?"],
    evidence: ["STANDARDS_AUTHORITY", "EXAM_PREP_CORPUS", "PYQ_CONFIRMED"],
    sourceRefIds: ["SRC-MDN-URL", "SRC-OLIVE-INTERNET-2026", "SRC-TESTBOOK-INTERNET-2026"],
  }),
  c({
    candidateId: "WEB-DISC-014",
    learnerTask: "Recognize the durable high-level components of a URL: scheme, host/domain and path",
    relationFamily: "url-component",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["scheme", "host", "domain", "path", "URL"],
    surfaceVariants: ["In https://example.com/docs, which part is the scheme?", "Which part of a typical URL identifies the host/domain?"],
    evidence: ["STANDARDS_AUTHORITY", "EXAM_PREP_CORPUS"],
    sourceRefIds: ["SRC-MDN-URL", "SRC-OLIVE-INTERNET-2026"],
    likelyMergeWith: ["WEB-DISC-013"],
    ambiguityRisks: ["Do not force simplified ‘protocol/domain/path’ labels where a specific example would make the distinction technically false."],
  }),
  c({
    candidateId: "WEB-DISC-015",
    learnerTask: "Identify domain names as human-readable Internet names used in web addresses",
    relationFamily: "domain-name-purpose",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["domain name", "host name", "web address"],
    surfaceVariants: ["What is the human-readable name such as example.com called?", "Which component is the domain in a conventional web address?"],
    evidence: ["STANDARDS_AUTHORITY", "EXAM_PREP_CORPUS"],
    sourceRefIds: ["SRC-MDN-URL", "SRC-OLIVE-INTERNET-2026"],
    ownershipNotes: ["Detailed DNS operation, IP addressing and name-resolution mechanics belong to COM-005 Networking."],
  }),
  c({
    candidateId: "WEB-DISC-016",
    learnerTask: "Recognize common generic/top-level domain suffix categories at exam-awareness depth",
    relationFamily: "domain-suffix-classification",
    candidateMode: "CLASSIFICATION",
    objectFamilies: [".com", ".org", ".edu", ".gov", ".in", "domain suffix"],
    surfaceVariants: ["Which suffix is a country-code domain associated with India?", "Which option is a domain suffix rather than a browser?"],
    evidence: ["EXAM_PREP_CORPUS", "PYQ_REQUIRED"],
    sourceRefIds: ["SRC-OLIVE-INTERNET-2026", "SRC-TESTBOOK-INTERNET-2026"],
    ambiguityRisks: ["Do not overstate modern registration restrictions or organization-type guarantees for generic TLDs."],
  }),
  c({
    candidateId: "WEB-DISC-017",
    learnerTask: "Map HTTP to Web-resource transfer and distinguish HTTPS as HTTP over a secure encrypted channel",
    relationFamily: "http-https-purpose",
    candidateMode: "COMPARISON",
    objectFamilies: ["HTTP", "HTTPS", "Web", "TLS", "encrypted connection"],
    surfaceVariants: ["Which protocol underlies ordinary transfer of Web resources?", "What is the key security distinction between HTTP and HTTPS at awareness depth?"],
    evidence: ["STANDARDS_AUTHORITY", "EXAM_PREP_CORPUS", "PYQ_CONFIRMED"],
    sourceRefIds: ["SRC-MDN-HTTP", "SRC-OLIVE-INTERNET-2026"],
    ownershipNotes: ["Default ports, OSI/TCP-IP placement and transport mechanics belong to COM-005 Networking."],
  }),
  c({
    candidateId: "WEB-DISC-018",
    learnerTask: "Recognize WWW, URL, HTTP/HTTPS and related durable Internet/Web abbreviations from expansions",
    relationFamily: "web-abbreviation-expansion",
    candidateMode: "MATCHING",
    objectFamilies: ["WWW", "URL", "HTTP", "HTTPS"],
    surfaceVariants: ["Match WWW, URL and HTTP with their standard expansions.", "What does URL stand for?"],
    evidence: ["STANDARDS_AUTHORITY", "EXAM_PREP_CORPUS", "PYQ_CONFIRMED"],
    sourceRefIds: ["SRC-MDN-WWW", "SRC-MDN-URL", "SRC-MDN-HTTP", "SRC-TESTBOOK-INTERNET-2026"],
    splitIf: ["PYQ saturation proves abbreviation recall is independently frequent enough to deserve its own permanent learner-task authority."],
  }),
  c({
    candidateId: "WEB-DISC-019",
    learnerTask: "Identify an e-mail account/address as an electronic messaging identity and service endpoint",
    relationFamily: "email-identity-purpose",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["e-mail", "e-mail account", "e-mail address", "electronic message"],
    surfaceVariants: ["Which Internet service is primarily used to exchange electronic mail messages?", "Which identifier is used to address an e-mail to a recipient?"],
    evidence: ["OFFICIAL_EXAM", "EXAM_PREP_CORPUS"],
    sourceRefIds: ["SRC-SSC-CGL-2026", "SRC-TESTBOOK-INTERNET-2026"],
  }),
  c({
    candidateId: "WEB-DISC-020",
    learnerTask: "Interpret the basic structure of an e-mail address as local part, @ symbol and domain",
    relationFamily: "email-address-structure",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["local part", "@", "domain", "e-mail address"],
    surfaceVariants: ["In user@example.com, which part identifies the domain?", "Which symbol separates the local part from the domain in an e-mail address?"],
    evidence: ["EXAM_PREP_CORPUS", "PYQ_CONFIRMED"],
    sourceRefIds: ["SRC-TESTBOOK-INTERNET-2026"],
  }),
  c({
    candidateId: "WEB-DISC-021",
    learnerTask: "Distinguish To, Cc and Bcc recipient fields",
    relationFamily: "email-recipient-field",
    candidateMode: "COMPARISON",
    objectFamilies: ["To", "Cc", "Bcc", "visible recipient", "hidden copy recipient"],
    surfaceVariants: ["Which e-mail field hides its recipient list from other recipients?", "Which field is normally used for visible carbon-copy recipients?"],
    evidence: ["OFFICIAL_EXAM", "EXAM_PREP_CORPUS", "PYQ_CONFIRMED"],
    sourceRefIds: ["SRC-SSC-CGL-2026", "SRC-TESTBOOK-INTERNET-2026"],
  }),
  c({
    candidateId: "WEB-DISC-022",
    learnerTask: "Map Subject and message body to their roles in an e-mail",
    relationFamily: "email-message-field",
    candidateMode: "PROCEDURAL_MAPPING",
    objectFamilies: ["Subject", "message body", "recipient"],
    surfaceVariants: ["Which field gives a short description of an e-mail’s topic?", "Where is the main message text entered when composing an e-mail?"],
    evidence: ["OFFICIAL_EXAM", "EXAM_PREP_CORPUS"],
    sourceRefIds: ["SRC-SSC-CGL-2026", "SRC-TESTBOOK-INTERNET-2026"],
  }),
  c({
    candidateId: "WEB-DISC-023",
    learnerTask: "Distinguish Reply, Reply All and Forward operations",
    relationFamily: "email-message-action",
    candidateMode: "COMPARISON",
    objectFamilies: ["Reply", "Reply All", "Forward"],
    surfaceVariants: ["Which action sends your response back to the sender without addressing all recipients?", "Which action sends a received message onward to a new recipient?"],
    evidence: ["OFFICIAL_EXAM", "EXAM_PREP_CORPUS"],
    sourceRefIds: ["SRC-SSC-CGL-2026", "SRC-TESTBOOK-INTERNET-2026"],
  }),
  c({
    candidateId: "WEB-DISC-024",
    learnerTask: "Identify an e-mail attachment and distinguish it from the message body",
    relationFamily: "email-attachment-purpose",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["attachment", "file", "message body"],
    surfaceVariants: ["What is a file sent along with an e-mail called?", "Which e-mail feature is used to include a document or image as a separate file?"],
    evidence: ["OFFICIAL_EXAM", "EXAM_PREP_CORPUS", "PYQ_CONFIRMED"],
    sourceRefIds: ["SRC-SSC-CGL-2026", "SRC-TESTBOOK-INTERNET-2026"],
  }),
  c({
    candidateId: "WEB-DISC-025",
    learnerTask: "Distinguish common mailbox folders such as Inbox, Sent, Drafts, Spam/Junk and Trash",
    relationFamily: "email-mailbox-folder",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["Inbox", "Sent", "Drafts", "Spam", "Junk", "Trash"],
    surfaceVariants: ["Which folder normally stores messages that have been received?", "Where is an unfinished saved e-mail commonly kept?"],
    evidence: ["OFFICIAL_EXAM", "EXAM_PREP_CORPUS"],
    sourceRefIds: ["SRC-SSC-CGL-2026", "SRC-TESTBOOK-INTERNET-2026"],
    ambiguityRisks: ["Folder labels vary by provider; normalize Spam/Junk and Trash/Deleted Items only where semantics match."],
  }),
  c({
    candidateId: "WEB-DISC-026",
    learnerTask: "Distinguish webmail from a dedicated e-mail client at awareness depth",
    relationFamily: "email-client-vs-webmail",
    candidateMode: "COMPARISON",
    objectFamilies: ["webmail", "e-mail client", "browser", "mail application"],
    surfaceVariants: ["Which description best fits webmail?", "What distinguishes a browser-based mail service from a dedicated mail client?"],
    evidence: ["EXAM_PREP_CORPUS", "PYQ_REQUIRED"],
    sourceRefIds: ["SRC-OLIVE-INTERNET-2026", "SRC-TESTBOOK-INTERNET-2026"],
  }),
  c({
    candidateId: "WEB-DISC-027",
    learnerTask: "Map SMTP to sending/transport of e-mail",
    relationFamily: "email-smtp-role",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["SMTP", "send", "mail transport"],
    surfaceVariants: ["Which protocol is associated with sending/transporting e-mail?", "SMTP is primarily associated with which e-mail function?"],
    evidence: ["STANDARDS_AUTHORITY", "EXAM_PREP_CORPUS", "PYQ_CONFIRMED"],
    sourceRefIds: ["SRC-IETF-SMTP", "SRC-OLIVE-INTERNET-2026"],
    ownershipNotes: ["Protocol role belongs to COM-004; port numbers, transport-layer detail and packet behavior belong to COM-005 Networking."],
  }),
  c({
    candidateId: "WEB-DISC-028",
    learnerTask: "Map IMAP to server-based e-mail access/synchronization",
    relationFamily: "email-imap-role",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["IMAP", "mailbox on server", "multi-device access", "synchronization"],
    surfaceVariants: ["Which protocol lets a mail client access and manage messages kept on a mail server?", "Which e-mail access protocol is designed around server-resident mailboxes?"],
    evidence: ["STANDARDS_AUTHORITY", "EXAM_PREP_CORPUS", "PYQ_CONFIRMED"],
    sourceRefIds: ["SRC-IETF-IMAP", "SRC-OLIVE-INTERNET-2026"],
    ownershipNotes: ["Detailed IMAP ports/security extensions belong to COM-005 Networking."],
  }),
  c({
    candidateId: "WEB-DISC-029",
    learnerTask: "Map POP3 to retrieval/access of e-mail and distinguish it from SMTP/IMAP at awareness depth",
    relationFamily: "email-pop3-role",
    candidateMode: "COMPARISON",
    objectFamilies: ["POP3", "SMTP", "IMAP", "mail retrieval", "mail access"],
    surfaceVariants: ["Which protocol is associated with retrieving e-mail from a mail server?", "Which option correctly distinguishes SMTP, POP3 and IMAP by broad role?"],
    evidence: ["STANDARDS_AUTHORITY", "EXAM_PREP_CORPUS", "PYQ_CONFIRMED"],
    sourceRefIds: ["SRC-IETF-POP3", "SRC-IETF-SMTP", "SRC-IETF-IMAP", "SRC-OLIVE-INTERNET-2026"],
    ownershipNotes: ["Do not teach ‘POP always deletes server mail’ as an invariant; client/server behavior and retention settings vary."],
  }),
  c({
    candidateId: "WEB-DISC-030",
    learnerTask: "Match core e-mail protocols SMTP, POP3 and IMAP with their broad roles",
    relationFamily: "email-protocol-matching",
    candidateMode: "MATCHING",
    objectFamilies: ["SMTP", "POP3", "IMAP", "sending", "retrieval/access", "server mailbox access"],
    surfaceVariants: ["Match SMTP, POP3 and IMAP with their broad e-mail roles.", "Which protocol-role pairing is correct?"],
    evidence: ["STANDARDS_AUTHORITY", "EXAM_PREP_CORPUS", "PYQ_CONFIRMED"],
    sourceRefIds: ["SRC-IETF-SMTP", "SRC-IETF-POP3", "SRC-IETF-IMAP", "SRC-OLIVE-INTERNET-2026"],
    likelyMergeWith: ["WEB-DISC-027", "WEB-DISC-028", "WEB-DISC-029"],
    ownershipNotes: ["Composition family only; permanent split requires PYQ evidence beyond ordinary protocol-role recall."],
  }),
  c({
    candidateId: "WEB-DISC-031",
    learnerTask: "Identify e-banking/Internet banking as access to banking services through a bank’s online channel",
    relationFamily: "ebanking-definition",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["Internet banking", "online banking", "e-banking", "bank website/app"],
    surfaceVariants: ["Which term describes using a bank’s online channel to access banking services?", "Internet banking is best described as which type of service?"],
    evidence: ["OFFICIAL_EXAM", "REGULATOR_AUTHORITY", "EXAM_PREP_CORPUS"],
    sourceRefIds: ["SRC-SSC-CGL-2026", "SRC-RBI-DIGITAL-SAFETY", "SRC-TESTBOOK-EBANKING-2026"],
    ownershipNotes: ["Banking products, RBI payment-system rules, transfer limits and current scheme details belong to Banking Awareness/current affairs, not COM-004."],
  }),
  c({
    candidateId: "WEB-DISC-032",
    learnerTask: "Recognize common Internet-banking functions such as balance inquiry, statement access and online fund transfer",
    relationFamily: "ebanking-service-capability",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["balance inquiry", "account statement", "online fund transfer", "cash withdrawal"],
    surfaceVariants: ["Which task can ordinarily be performed through Internet banking?", "Which activity is NOT itself an Internet-banking transaction performed online?"],
    evidence: ["OFFICIAL_EXAM", "EXAM_PREP_CORPUS", "PYQ_CONFIRMED"],
    sourceRefIds: ["SRC-SSC-CGL-2026", "SRC-TESTBOOK-EBANKING-2026"],
    ownershipNotes: ["Do not test current NEFT/RTGS/IMPS/UPI limits or settlement rules here."],
  }),
  c({
    candidateId: "WEB-DISC-033",
    learnerTask: "Identify HTTPS/verified bank URLs as a basic safer practice for online banking",
    relationFamily: "ebanking-secure-site-practice",
    candidateMode: "PROCEDURAL_MAPPING",
    objectFamilies: ["HTTPS", "verified URL", "secure website", "online banking"],
    surfaceVariants: ["Which practice is safer before entering credentials on an online-banking site?", "Which web-address characteristic should be checked when accessing a bank website?"],
    evidence: ["OFFICIAL_EXAM", "REGULATOR_AUTHORITY", "STANDARDS_AUTHORITY"],
    sourceRefIds: ["SRC-SSC-CGL-2026", "SRC-RBI-DIGITAL-SAFETY", "SRC-MDN-HTTP"],
    ownershipNotes: ["This owns user-facing e-banking safety only; certificate/TLS mechanics and attack taxonomy belong to COM-005/COM-006."],
    ambiguityRisks: ["HTTPS alone does not prove a site is legitimate; wording must require verified/trusted bank URL as well."],
  }),
  c({
    candidateId: "WEB-DISC-034",
    learnerTask: "Recognize that banking passwords, PINs, OTPs and similar credentials must not be shared",
    relationFamily: "ebanking-credential-safety",
    candidateMode: "STATEMENT_SET",
    objectFamilies: ["password", "PIN", "OTP", "credentials", "banking safety"],
    surfaceVariants: ["Which statement reflects safe digital-banking practice?", "Which credential should never be shared with another person, including someone claiming to be bank staff?"],
    evidence: ["OFFICIAL_EXAM", "REGULATOR_AUTHORITY"],
    sourceRefIds: ["SRC-SSC-CGL-2026", "SRC-RBI-DIGITAL-SAFETY"],
    ownershipNotes: ["Phishing/social-engineering taxonomy belongs to COM-006 Cyber Security; COM-004 owns the service-use safety behavior."],
  }),
  c({
    candidateId: "WEB-DISC-035",
    learnerTask: "Recognize public/open networks and untrusted devices as unsafe contexts for digital banking",
    relationFamily: "ebanking-access-context-safety",
    candidateMode: "STATEMENT_SET",
    objectFamilies: ["public Wi-Fi", "open network", "public device", "trusted device", "online banking"],
    surfaceVariants: ["Which environment should be avoided for online banking?", "Which statement is consistent with RBI digital-banking safety guidance?"],
    evidence: ["REGULATOR_AUTHORITY", "OFFICIAL_EXAM"],
    sourceRefIds: ["SRC-RBI-DIGITAL-SAFETY", "SRC-SSC-CGL-2026"],
    ownershipNotes: ["Wireless-security mechanisms belong to COM-005/COM-006; this candidate tests the user-facing safe-use decision."],
  }),
  c({
    candidateId: "WEB-DISC-036",
    learnerTask: "Apply cross-topic Internet/e-mail/e-banking concepts in statement or matching sets without introducing new facts",
    relationFamily: "internet-email-ebanking-composition",
    candidateMode: "MATCHING",
    objectFamilies: ["browser", "URL", "download/upload", "e-mail fields", "e-mail protocols", "e-banking safety"],
    surfaceVariants: ["Match each Internet/e-mail term with its correct use.", "Which combination of statements about Web, e-mail and e-banking is correct?"],
    evidence: ["OFFICIAL_EXAM", "EXAM_PREP_CORPUS"],
    sourceRefIds: ["SRC-SSC-CGL-2026", "SRC-OLIVE-INTERNET-2026", "SRC-TESTBOOK-INTERNET-2026", "SRC-RBI-DIGITAL-SAFETY"],
    ownershipNotes: ["Composition-only family; all atomic facts must already be source-approved and owned by COM-004."],
  }),
];

export function auditCom004InternetWebEmailDiscovery() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const relationFamilies = new Set<string>();
  const knownSources = new Set(Object.keys(COM004_DISCOVERY_SOURCE_REFS));

  for (const candidate of COM004_INTERNET_WEB_EMAIL_DISCOVERY) {
    if (!/^WEB-DISC-\d{3}$/.test(candidate.candidateId)) issues.push(`Bad candidate id: ${candidate.candidateId}`);
    if (ids.has(candidate.candidateId)) issues.push(`Duplicate candidate id: ${candidate.candidateId}`);
    ids.add(candidate.candidateId);
    relationFamilies.add(candidate.relationFamily);
    if (!candidate.learnerTask.trim()) issues.push(`${candidate.candidateId}: missing learnerTask`);
    if (candidate.surfaceVariants.length < 2) issues.push(`${candidate.candidateId}: needs >=2 surface variants`);
    if (candidate.objectFamilies.length < 2) issues.push(`${candidate.candidateId}: needs >=2 object-family entries`);
    if (candidate.evidence.length === 0) issues.push(`${candidate.candidateId}: missing evidence`);
    if (candidate.sourceRefIds.length === 0) issues.push(`${candidate.candidateId}: missing source refs`);
    for (const sourceRefId of candidate.sourceRefIds) {
      if (!knownSources.has(sourceRefId)) issues.push(`${candidate.candidateId}: unknown source ${sourceRefId}`);
    }
    if (candidate.productionState !== "DISCOVERY_ONLY") issues.push(`${candidate.candidateId}: production state escaped discovery`);
  }

  const officialExamCandidateIds = COM004_INTERNET_WEB_EMAIL_DISCOVERY.filter((candidate) => candidate.evidence.includes("OFFICIAL_EXAM")).map((candidate) => candidate.candidateId);
  const pyqConfirmedCandidateIds = COM004_INTERNET_WEB_EMAIL_DISCOVERY.filter((candidate) => candidate.evidence.includes("PYQ_CONFIRMED")).map((candidate) => candidate.candidateId);
  const standardsBackedCandidateIds = COM004_INTERNET_WEB_EMAIL_DISCOVERY.filter((candidate) => candidate.evidence.includes("STANDARDS_AUTHORITY")).map((candidate) => candidate.candidateId);
  const regulatorBackedCandidateIds = COM004_INTERNET_WEB_EMAIL_DISCOVERY.filter((candidate) => candidate.evidence.includes("REGULATOR_AUTHORITY")).map((candidate) => candidate.candidateId);
  const com005BoundaryIds = COM004_INTERNET_WEB_EMAIL_DISCOVERY.filter((candidate) => candidate.ownershipNotes?.some((note) => note.includes("COM-005"))).map((candidate) => candidate.candidateId);
  const com006BoundaryIds = COM004_INTERNET_WEB_EMAIL_DISCOVERY.filter((candidate) => candidate.ownershipNotes?.some((note) => note.includes("COM-006"))).map((candidate) => candidate.candidateId);
  const bankingBoundaryIds = COM004_INTERNET_WEB_EMAIL_DISCOVERY.filter((candidate) => candidate.ownershipNotes?.some((note) => /Banking Awareness|current affairs/i.test(note))).map((candidate) => candidate.candidateId);

  if (COM004_INTERNET_WEB_EMAIL_DISCOVERY.length < 30) issues.push("Discovery breadth is too small for COM-004 source saturation work");
  if (relationFamilies.size < 28) issues.push("Relation-family breadth is too small for COM-004 discovery");
  if (officialExamCandidateIds.length < 15) issues.push("Too few candidates anchored to the official exam scope");
  if (standardsBackedCandidateIds.length < 8) issues.push("Too few standards-backed Web/e-mail candidates");
  if (regulatorBackedCandidateIds.length < 4) issues.push("Too few regulator-backed e-banking candidates");
  if (com005BoundaryIds.length < 5) issues.push("COM-005 ownership boundary is under-specified");
  if (com006BoundaryIds.length < 3) issues.push("COM-006 ownership boundary is under-specified");
  if (bankingBoundaryIds.length < 2) issues.push("Banking Awareness/current-affairs ownership boundary is under-specified");

  return {
    valid: issues.length === 0,
    issues,
    candidateCount: COM004_INTERNET_WEB_EMAIL_DISCOVERY.length,
    relationFamilyCount: relationFamilies.size,
    officialExamCandidateIds,
    pyqConfirmedCandidateIds,
    standardsBackedCandidateIds,
    regulatorBackedCandidateIds,
    com005BoundaryIds,
    com006BoundaryIds,
    bankingBoundaryIds,
    permanentQlCount: 0,
    productionReady: false,
    sourceSaturationClosed: false,
    nextGate: "COM004_SOURCE_SATURATION_AND_MERGE_SPLIT_AUDIT",
  } as const;
}
