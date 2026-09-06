import { COM004_SOURCE_AUTHORITIES } from "./com004-source-manifest";

export type Com004DiscoveryEvidence =
  | "OFFICIAL_EXAM"
  | "OFFICIAL_CURRICULUM"
  | "STANDARDS_AUTHORITY"
  | "PRODUCT_AUTHORITY"
  | "REGULATOR_AUTHORITY"
  | "PYQ_CONFIRMED"
  | "PYQ_REQUIRED"
  | "DOMAIN_HYPOTHESIS";

export type Com004DiscoveryFamily =
  | "D-CP-A"
  | "D-CP-B"
  | "D-CP-C"
  | "D-CP-D"
  | "D-CP-E"
  | "D-CP-F"
  | "D-CP-G"
  | "D-CP-H"
  | "D-CP-I";

export type Com004DiscoveryCandidate = {
  candidateId: string;
  provisionalFamily: Com004DiscoveryFamily;
  learnerTask: string;
  relationFamily: string;
  candidateMode:
    | "FORWARD_RECALL"
    | "REVERSE_RECALL"
    | "CLASSIFICATION"
    | "COMPARISON"
    | "PROCEDURAL_MAPPING"
    | "CONTEXT_SELECTION"
    | "STATEMENT_SET"
    | "MATCHING";
  objectFamilies: string[];
  surfaceVariants: string[];
  evidence: Com004DiscoveryEvidence[];
  sourceSupportKeys: string[];
  likelyMergeWith?: string[];
  splitIf?: string[];
  ownershipNotes?: string[];
  ambiguityRisks?: string[];
  freshnessRisk?: "LOW" | "MEDIUM" | "HIGH";
  productionState: "DISCOVERY_ONLY";
};

/**
 * Saturated provisional learner-task inventory for COM-004.
 *
 * This intentionally over-discovers surface demand. Permanent CP/QL allocation
 * is forbidden here. The merge/split audit must compress inverse and
 * surface-only variants into solver/fact boundaries before allocation.
 */
export const COM004_INTERNET_WEB_EMAIL_DISCOVERY: Com004DiscoveryCandidate[] = [
  {
    candidateId: "WEB-DISC-001",
    provisionalFamily: "D-CP-A",
    learnerTask: "Identify the Internet from a definition describing a global interconnected network environment",
    relationFamily: "internet-concept",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["Internet", "network of networks", "WWW", "intranet"],
    surfaceVariants: [
      "Which term refers to the worldwide system of interconnected computer networks?",
      "A global network infrastructure connecting many networks is called what?",
    ],
    evidence: ["OFFICIAL_EXAM", "OFFICIAL_CURRICULUM"],
    sourceSupportKeys: ["internet-www"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-002",
    provisionalFamily: "D-CP-A",
    learnerTask: "Distinguish the Internet from the World Wide Web",
    relationFamily: "internet-www-distinction",
    candidateMode: "COMPARISON",
    objectFamilies: ["Internet", "World Wide Web", "webpages", "network infrastructure"],
    surfaceVariants: [
      "Which statement correctly distinguishes the Internet from the World Wide Web?",
      "The WWW is best understood as which kind of service/resource system operating over the Internet?",
    ],
    evidence: ["OFFICIAL_CURRICULUM"],
    sourceSupportKeys: ["internet-www"],
    ambiguityRisks: ["Never treat Internet and WWW as exact synonyms."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-003",
    provisionalFamily: "D-CP-A",
    learnerTask: "Distinguish website, webpage and homepage at awareness-exam depth",
    relationFamily: "web-resource-concepts",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["website", "webpage", "homepage", "collection of pages", "individual page"],
    surfaceVariants: [
      "Which term refers to an individual document/resource viewed on the Web?",
      "What is the usual name for the main or starting page of a website?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "DOMAIN_HYPOTHESIS"],
    sourceSupportKeys: ["internet-www"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-004",
    provisionalFamily: "D-CP-A",
    learnerTask: "Identify hyperlinks from their navigation/reference function",
    relationFamily: "hyperlink-purpose",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["hyperlink", "link", "target resource", "web navigation"],
    surfaceVariants: [
      "Which web element takes the user to another resource or location when activated?",
      "Clickable text or an object that references another resource is called what?",
    ],
    evidence: ["OFFICIAL_CURRICULUM"],
    sourceSupportKeys: ["internet-www"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-005",
    provisionalFamily: "D-CP-B",
    learnerTask: "Identify a web browser from its purpose of accessing and navigating Web content",
    relationFamily: "browser-purpose",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["web browser", "Chrome", "Firefox", "Edge", "Safari", "webpages"],
    surfaceVariants: [
      "Which type of software is used to view pages and navigate the World Wide Web?",
      "Which application category is used to access websites?",
    ],
    evidence: ["OFFICIAL_EXAM", "OFFICIAL_CURRICULUM", "PYQ_CONFIRMED"],
    sourceSupportKeys: ["scope:web-browsing-searching", "web-browsing", "pyq:web-browser-purpose"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-006",
    provisionalFamily: "D-CP-B",
    learnerTask: "Distinguish a web browser from a search engine or e-mail service",
    relationFamily: "browser-search-service-distinction",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["browser", "search engine", "email service", "Chrome", "Firefox", "Google Search", "Gmail"],
    surfaceVariants: [
      "Which option is a browser rather than a search engine?",
      "Which of the following is NOT a web browser?",
    ],
    evidence: ["OFFICIAL_EXAM", "OFFICIAL_CURRICULUM", "PYQ_CONFIRMED"],
    sourceSupportKeys: ["scope:web-browsing-searching", "pyq:browser-classification"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-007",
    provisionalFamily: "D-CP-B",
    learnerTask: "Identify a search engine from its information-search purpose",
    relationFamily: "search-engine-purpose",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["search engine", "search query", "web index", "browser"],
    surfaceVariants: [
      "Which service helps a user search for information on the Web by entering a query?",
      "A user wants to find relevant webpages by keywords. Which type of service is needed?",
    ],
    evidence: ["OFFICIAL_EXAM", "OFFICIAL_CURRICULUM"],
    sourceSupportKeys: ["scope:web-browsing-searching", "search-engines"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-008",
    provisionalFamily: "D-CP-B",
    learnerTask: "Distinguish downloading from uploading by transfer direction relative to the user's device",
    relationFamily: "upload-download-direction",
    candidateMode: "COMPARISON",
    objectFamilies: ["download", "upload", "local device", "remote service/server"],
    surfaceVariants: [
      "Copying a file from an online service to your device is called what?",
      "Sending a local file from your device to an online service is called what?",
    ],
    evidence: ["OFFICIAL_EXAM", "OFFICIAL_CURRICULUM"],
    sourceSupportKeys: ["scope:downloading-uploading", "web-browsing"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-009",
    provisionalFamily: "D-CP-B",
    learnerTask: "Map durable browser actions such as refresh, back, forward and bookmark/favourite to their purposes",
    relationFamily: "browser-common-action",
    candidateMode: "PROCEDURAL_MAPPING",
    objectFamilies: ["refresh/reload", "back", "forward", "bookmark/favourite", "current page", "saved page reference"],
    surfaceVariants: [
      "Which browser action requests the current page again?",
      "Which browser feature stores a page reference for convenient later access?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "PYQ_REQUIRED"],
    sourceSupportKeys: ["web-browsing"],
    ambiguityRisks: ["Avoid version-specific browser UI placement or branding."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-010",
    provisionalFamily: "D-CP-C",
    learnerTask: "Identify URL from its resource-addressing role and full form",
    relationFamily: "url-identity-purpose",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["URL", "Uniform Resource Locator", "web resource address"],
    surfaceVariants: [
      "What does URL stand for?",
      "Which term identifies the address/location of a resource on the Web?",
    ],
    evidence: ["STANDARDS_AUTHORITY", "OFFICIAL_CURRICULUM", "PYQ_REQUIRED"],
    sourceSupportKeys: ["url", "web-addressing"],
    ambiguityRisks: ["Do not define URL as only a website address; URLs can identify resources and paths."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-011",
    provisionalFamily: "D-CP-C",
    learnerTask: "Identify scheme, host/domain and path as basic URL components without teaching resolution mechanics",
    relationFamily: "url-component-role",
    candidateMode: "PROCEDURAL_MAPPING",
    objectFamilies: ["scheme", "host/domain", "path", "https", "example.com", "/path"],
    surfaceVariants: [
      "In a simple URL, which part identifies the scheme such as https?",
      "Which part of a web URL names the host/domain rather than the resource path?",
    ],
    evidence: ["STANDARDS_AUTHORITY"],
    sourceSupportKeys: ["url-scheme", "url-host", "url-path"],
    ownershipNotes: ["DNS resolution mechanics and network addressing architecture belong to COM-005."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-012",
    provisionalFamily: "D-CP-C",
    learnerTask: "Distinguish HTTP from HTTPS at awareness depth without claiming HTTPS guarantees site trustworthiness",
    relationFamily: "http-https-awareness",
    candidateMode: "COMPARISON",
    objectFamilies: ["HTTP", "HTTPS", "web communication", "protected transport"],
    surfaceVariants: [
      "Which scheme indicates HTTP communication protected using TLS?",
      "Which statement about HTTP and HTTPS is technically safer and more accurate?",
    ],
    evidence: ["STANDARDS_AUTHORITY", "PYQ_REQUIRED"],
    sourceSupportKeys: ["http", "web-protocol-purpose"],
    ownershipNotes: ["TLS mechanics, ports and protocol-stack depth belong to COM-005/COM-006 as appropriate."],
    ambiguityRisks: ["HTTPS must not be described as proof that a website itself is honest, legitimate or malware-free."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-013",
    provisionalFamily: "D-CP-D",
    learnerTask: "Recognize the basic local-part@domain structure of an e-mail address",
    relationFamily: "email-address-structure",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["email address", "local part", "@", "domain"],
    surfaceVariants: [
      "Which symbol separates the local part from the domain in a standard e-mail address?",
      "Which option has the basic structure of a valid e-mail address?",
    ],
    evidence: ["OFFICIAL_EXAM", "OFFICIAL_CURRICULUM"],
    sourceSupportKeys: ["scope:email-account-management", "email-structure"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-014",
    provisionalFamily: "D-CP-D",
    learnerTask: "Select To, CC or BCC from recipient and visibility requirements",
    relationFamily: "email-recipient-field-semantics",
    candidateMode: "CONTEXT_SELECTION",
    objectFamilies: ["To", "CC", "BCC", "primary recipient", "visible copy", "hidden copy"],
    surfaceVariants: [
      "Which field is appropriate when copied recipients should not see one another's addresses?",
      "Which field normally identifies the primary recipient of an e-mail?",
    ],
    evidence: ["OFFICIAL_EXAM", "OFFICIAL_CURRICULUM", "PYQ_REQUIRED"],
    sourceSupportKeys: ["email-structure", "email-operations"],
    ambiguityRisks: ["Question wording must state the relevant recipient-visibility requirement explicitly."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-015",
    provisionalFamily: "D-CP-D",
    learnerTask: "Identify the Subject field from its message-topic/summary role",
    relationFamily: "email-subject-role",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["Subject", "message topic", "recipient fields", "message body"],
    surfaceVariants: [
      "Which e-mail field briefly indicates what the message is about?",
      "Where is a concise topic line for an e-mail normally entered?",
    ],
    evidence: ["OFFICIAL_CURRICULUM"],
    sourceSupportKeys: ["email-structure"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-016",
    provisionalFamily: "D-CP-D",
    learnerTask: "Map Inbox, Outbox, Sent, Draft and Spam/Trash concepts to message state",
    relationFamily: "email-mailbox-folder-state",
    candidateMode: "PROCEDURAL_MAPPING",
    objectFamilies: ["Inbox", "Outbox", "Sent", "Draft", "Spam", "Trash"],
    surfaceVariants: [
      "Which mailbox folder normally contains received messages?",
      "A message saved before it is sent is normally found in which folder?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "PYQ_REQUIRED"],
    sourceSupportKeys: ["email-operations"],
    ambiguityRisks: ["Do not conflate Outbox with Sent; client behavior can differ, so facts must express stable message-state meaning."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-017",
    provisionalFamily: "D-CP-D",
    learnerTask: "Distinguish reply, reply-all and forward from the intended recipient/action semantics",
    relationFamily: "email-response-action",
    candidateMode: "CONTEXT_SELECTION",
    objectFamilies: ["Reply", "Reply All", "Forward", "sender", "original recipients", "new recipient"],
    surfaceVariants: [
      "Which action sends your response to the original sender only?",
      "Which action sends an existing message onward to a new recipient?",
    ],
    evidence: ["OFFICIAL_CURRICULUM"],
    sourceSupportKeys: ["email-operations"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-018",
    provisionalFamily: "D-CP-D",
    learnerTask: "Identify attachment and e-mail signature from their roles",
    relationFamily: "email-message-feature",
    candidateMode: "CLASSIFICATION",
    objectFamilies: ["attachment", "signature", "file", "closing/contact block"],
    surfaceVariants: [
      "Which e-mail feature sends a file along with a message?",
      "Which feature can automatically add a standard name/contact block to outgoing messages?",
    ],
    evidence: ["OFFICIAL_CURRICULUM"],
    sourceSupportKeys: ["email-attachments-signatures"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-019",
    provisionalFamily: "D-CP-E",
    learnerTask: "Identify SMTP as the e-mail sending/transport protocol at awareness depth",
    relationFamily: "email-protocol-role",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["SMTP", "Simple Mail Transfer Protocol", "send/transport mail", "POP3", "IMAP"],
    surfaceVariants: [
      "Which protocol is primarily associated with sending/transporting e-mail?",
      "What does SMTP stand for in e-mail communication?",
    ],
    evidence: ["STANDARDS_AUTHORITY", "PYQ_REQUIRED"],
    sourceSupportKeys: ["smtp", "email-submission"],
    ownershipNotes: ["Port numbers and protocol-stack mechanics belong to COM-005."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-020",
    provisionalFamily: "D-CP-E",
    learnerTask: "Identify POP3 as an e-mail retrieval/access protocol without technically false local-only claims",
    relationFamily: "email-protocol-role",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["POP3", "Post Office Protocol Version 3", "mail retrieval/access", "SMTP", "IMAP"],
    surfaceVariants: [
      "Which protocol is associated with retrieving/accessing delivered e-mail rather than sending it?",
      "What does POP3 stand for?",
    ],
    evidence: ["STANDARDS_AUTHORITY", "PYQ_REQUIRED"],
    sourceSupportKeys: ["pop3", "mail-retrieval"],
    ambiguityRisks: ["Do not claim POP3 universally deletes server mail or only permits one-device use."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-021",
    provisionalFamily: "D-CP-E",
    learnerTask: "Identify IMAP as a server-mailbox access/manipulation protocol",
    relationFamily: "email-protocol-role",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["IMAP", "Internet Message Access Protocol", "server mailbox access", "SMTP", "POP3"],
    surfaceVariants: [
      "Which protocol lets a client access and manipulate messages stored in a server mailbox?",
      "What does IMAP stand for?",
    ],
    evidence: ["STANDARDS_AUTHORITY", "PYQ_REQUIRED"],
    sourceSupportKeys: ["imap", "mailbox-access"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-022",
    provisionalFamily: "D-CP-E",
    learnerTask: "Discriminate SMTP from POP3/IMAP by sending versus mailbox-access role",
    relationFamily: "email-protocol-role-comparison",
    candidateMode: "COMPARISON",
    objectFamilies: ["SMTP", "POP3", "IMAP", "sending", "retrieval", "mailbox access"],
    surfaceVariants: [
      "Which pair correctly matches a mail protocol with its primary awareness-level role?",
      "Which protocol belongs on the sending side rather than the mailbox-access side?",
    ],
    evidence: ["STANDARDS_AUTHORITY", "PYQ_REQUIRED"],
    sourceSupportKeys: ["smtp-vs-pop-imap"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-023",
    provisionalFamily: "D-CP-F",
    learnerTask: "Identify e-commerce from online buying/selling or commercial transaction context",
    relationFamily: "digital-service-concept",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["e-commerce", "online buying/selling", "digital marketplace", "e-governance"],
    surfaceVariants: [
      "Buying or selling goods/services through online systems is called what?",
      "Which concept primarily concerns commercial transactions conducted electronically?",
    ],
    evidence: ["OFFICIAL_CURRICULUM"],
    sourceSupportKeys: ["e-commerce"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-024",
    provisionalFamily: "D-CP-F",
    learnerTask: "Identify e-governance from government-service delivery using digital systems",
    relationFamily: "digital-service-concept",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["e-governance", "government services", "digital public service", "e-commerce"],
    surfaceVariants: [
      "Providing government information/services through digital systems is commonly called what?",
      "Which concept relates most directly to electronic delivery of government services?",
    ],
    evidence: ["OFFICIAL_CURRICULUM"],
    sourceSupportKeys: ["e-governance"],
    freshnessRisk: "MEDIUM",
    ambiguityRisks: ["Do not build immutable questions around a particular app/service feature that can change."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-025",
    provisionalFamily: "D-CP-F",
    learnerTask: "Recognize basic netiquette/responsible online communication behavior when curriculum evidence supports it",
    relationFamily: "netiquette-action",
    candidateMode: "CONTEXT_SELECTION",
    objectFamilies: ["netiquette", "respectful communication", "privacy", "responsible sharing"],
    surfaceVariants: [
      "Which action best reflects good netiquette in an online discussion?",
      "Which behavior is inappropriate when communicating online?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "PYQ_REQUIRED"],
    sourceSupportKeys: ["netiquette"],
    ownershipNotes: ["Threat/attack taxonomy remains COM-006."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-026",
    provisionalFamily: "D-CP-G",
    learnerTask: "Identify OTP and its authentication/verification role without implying that OTP alone guarantees safety",
    relationFamily: "digital-financial-tool-purpose",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["OTP", "One Time Password", "authentication", "verification"],
    surfaceVariants: [
      "What does OTP stand for in digital transactions?",
      "Which temporary credential is commonly used as an additional verification factor?",
    ],
    evidence: ["OFFICIAL_CURRICULUM"],
    sourceSupportKeys: ["otp-qr"],
    ambiguityRisks: ["Do not state that possession/use of an OTP makes a transaction inherently safe."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-027",
    provisionalFamily: "D-CP-G",
    learnerTask: "Identify QR code and its encoded/scannable information role in digital-payment contexts",
    relationFamily: "digital-financial-tool-purpose",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["QR code", "Quick Response code", "scan", "payment information"],
    surfaceVariants: [
      "What does QR stand for?",
      "Which scannable code is commonly used to carry payment or other encoded information?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "PRODUCT_AUTHORITY"],
    sourceSupportKeys: ["otp-qr", "qr-payment"],
    ambiguityRisks: ["A QR code itself is neither inherently safe nor inherently fraudulent."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-028",
    provisionalFamily: "D-CP-G",
    learnerTask: "Identify UPI by canonical expansion and durable bank-account payment purpose",
    relationFamily: "digital-payment-system-purpose",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["UPI", "Unified Payments Interface", "bank-account transfer", "merchant payment", "UPI ID"],
    surfaceVariants: [
      "What is the correct expansion of UPI?",
      "Which NPCI payment system enables real-time bank-account payments through UPI-enabled applications?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "PRODUCT_AUTHORITY", "PYQ_REQUIRED"],
    sourceSupportKeys: ["upi", "unified-payments-interface"],
    ambiguityRisks: ["Canonical expansion is Unified Payments Interface, not Unified Payment Interface."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-029",
    provisionalFamily: "D-CP-G",
    learnerTask: "Identify AePS from Aadhaar-authenticated assisted banking purpose",
    relationFamily: "digital-payment-system-purpose",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["AePS", "Aadhaar Enabled Payment System", "Aadhaar authentication", "assisted banking"],
    surfaceVariants: [
      "Which system enables Aadhaar-authenticated basic banking transactions in an assisted model?",
      "What does AePS stand for?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "PRODUCT_AUTHORITY"],
    sourceSupportKeys: ["aeps", "aadhaar-enabled-payment-system"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-030",
    provisionalFamily: "D-CP-G",
    learnerTask: "Identify USSD/*99# mobile-banking concept and expansion at awareness depth",
    relationFamily: "digital-payment-system-purpose",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["USSD", "Unstructured Supplementary Service Data", "*99#", "mobile banking without mobile data"],
    surfaceVariants: [
      "What does USSD stand for?",
      "Which mobile-banking channel can provide basic services through a USSD session without mobile-data access?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "PRODUCT_AUTHORITY"],
    sourceSupportKeys: ["ussd", "99-service"],
    ambiguityRisks: ["Avoid bank/operator-specific mutable menu codes or charges."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-031",
    provisionalFamily: "D-CP-G",
    learnerTask: "Distinguish debit and credit cards at basic account/funding-source awareness depth",
    relationFamily: "payment-tool-classification",
    candidateMode: "COMPARISON",
    objectFamilies: ["debit card", "credit card", "bank account", "credit facility"],
    surfaceVariants: [
      "Which card normally draws purchase funds directly from the linked deposit account?",
      "Which card generally uses a sanctioned credit line rather than directly debiting the linked deposit balance at purchase time?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "PYQ_REQUIRED"],
    sourceSupportKeys: ["cards"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-032",
    provisionalFamily: "D-CP-G",
    learnerTask: "Identify an e-wallet/prepaid wallet from stored-value payment context at basic depth",
    relationFamily: "payment-tool-classification",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["e-wallet", "prepaid value", "digital payment tool", "bank transfer"],
    surfaceVariants: [
      "Which digital tool can hold prepaid value for making eligible electronic payments?",
      "An electronic wallet is best classified as which type of digital payment tool?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "PYQ_REQUIRED"],
    sourceSupportKeys: ["ewallet"],
    freshnessRisk: "MEDIUM",
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-033",
    provisionalFamily: "D-CP-G",
    learnerTask: "Identify Point of Sale (PoS) from merchant-payment acceptance context",
    relationFamily: "payment-tool-classification",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["PoS", "Point of Sale", "merchant terminal", "payment acceptance"],
    surfaceVariants: [
      "What does PoS stand for in digital payments?",
      "Which merchant-side device/system is associated with accepting card or other supported payments at the point of sale?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "PYQ_REQUIRED"],
    sourceSupportKeys: ["pos"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-034",
    provisionalFamily: "D-CP-H",
    learnerTask: "Identify Internet banking/e-banking from the performance of banking services through online channels",
    relationFamily: "internet-banking-concept",
    candidateMode: "REVERSE_RECALL",
    objectFamilies: ["Internet banking", "e-banking", "online banking services", "fund transfer"],
    surfaceVariants: [
      "Performing banking services through a bank's online channel is commonly called what?",
      "NEFT, RTGS and IMPS are commonly encountered in which broad activity/service context?",
    ],
    evidence: ["OFFICIAL_EXAM", "OFFICIAL_CURRICULUM", "PYQ_CONFIRMED"],
    sourceSupportKeys: ["scope:e-banking", "internet-banking", "pyq:neft-rtgs-imps-classification"],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-035",
    provisionalFamily: "D-CP-H",
    learnerTask: "Identify NEFT by canonical expansion and batch-based electronic fund-transfer model",
    relationFamily: "fund-transfer-service-model",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["NEFT", "National Electronic Funds Transfer", "batch settlement", "electronic fund transfer"],
    surfaceVariants: [
      "What does NEFT stand for?",
      "Which RBI-operated electronic fund-transfer system processes transactions in batches rather than individually in real time?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "REGULATOR_AUTHORITY", "PYQ_CONFIRMED"],
    sourceSupportKeys: ["neft", "batch-settlement", "pyq:neft-expansion"],
    freshnessRisk: "MEDIUM",
    ambiguityRisks: ["Do not freeze mutable transaction limits, charges, exact batch counts or availability claims unless validity-scoped."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-036",
    provisionalFamily: "D-CP-H",
    learnerTask: "Identify RTGS by expansion and unpack real-time plus gross settlement meaning",
    relationFamily: "fund-transfer-service-model",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["RTGS", "Real Time Gross Settlement", "real-time", "gross", "transaction-by-transaction"],
    surfaceVariants: [
      "What does RTGS stand for?",
      "In RTGS, what do the terms real time and gross indicate about processing and settlement?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "REGULATOR_AUTHORITY", "PYQ_REQUIRED"],
    sourceSupportKeys: ["rtgs", "real-time", "gross-settlement"],
    freshnessRisk: "MEDIUM",
    ambiguityRisks: ["Do not use mutable monetary thresholds as the sole answer discriminator in frozen questions."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-037",
    provisionalFamily: "D-CP-H",
    learnerTask: "Identify IMPS by expansion and instant inter-bank electronic transfer purpose",
    relationFamily: "fund-transfer-service-model",
    candidateMode: "FORWARD_RECALL",
    objectFamilies: ["IMPS", "Immediate Payment Service", "instant fund transfer", "inter-bank transfer"],
    surfaceVariants: [
      "What does IMPS stand for?",
      "Which NPCI service is designed for instant electronic fund transfer between participating institutions?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "PRODUCT_AUTHORITY", "PYQ_CONFIRMED"],
    sourceSupportKeys: ["imps", "immediate-payment-service", "pyq:imps-expansion"],
    freshnessRisk: "LOW",
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-038",
    provisionalFamily: "D-CP-H",
    learnerTask: "Compare NEFT, RTGS and IMPS only on durable settlement/purpose distinctions",
    relationFamily: "fund-transfer-service-comparison",
    candidateMode: "COMPARISON",
    objectFamilies: ["NEFT", "RTGS", "IMPS", "batch", "real-time gross", "instant retail transfer"],
    surfaceVariants: [
      "Which pair correctly matches a fund-transfer service with its durable settlement model?",
      "Which service is distinguished by real-time gross settlement rather than batch settlement?",
    ],
    evidence: ["REGULATOR_AUTHORITY", "PRODUCT_AUTHORITY", "PYQ_CONFIRMED"],
    sourceSupportKeys: ["rtgs-vs-neft", "neft-batch", "rtgs-gross", "instant-interbank-transfer"],
    freshnessRisk: "MEDIUM",
    ambiguityRisks: ["Comparison facts must remain valid when operating hours, limits or channel availability change."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-039",
    provisionalFamily: "D-CP-I",
    learnerTask: "Select the safe action of never sharing OTP/PIN/password/CVV with another person",
    relationFamily: "digital-service-safe-action",
    candidateMode: "CONTEXT_SELECTION",
    objectFamilies: ["OTP", "PIN", "password", "CVV", "credential secrecy"],
    surfaceVariants: [
      "A caller asks for your OTP to reverse a transaction. What is the correct action?",
      "Which of these credentials should not be shared with another person during a banking interaction?",
    ],
    evidence: ["OFFICIAL_CURRICULUM", "DOMAIN_HYPOTHESIS"],
    sourceSupportKeys: ["otp-qr"],
    ownershipNotes: ["Attack labels such as phishing/vishing are COM-006 unless incidental to a safe-action scenario."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-040",
    provisionalFamily: "D-CP-I",
    learnerTask: "Choose safer digital-banking behavior for links, site/app verification and public networks",
    relationFamily: "digital-service-safe-action",
    candidateMode: "CONTEXT_SELECTION",
    objectFamilies: ["verified bank site/app", "suspicious link", "public Wi-Fi", "transaction alert", "unauthorised transaction reporting"],
    surfaceVariants: [
      "Which action is safest before entering banking credentials online?",
      "Which response is appropriate after noticing an unauthorised digital-banking transaction?",
    ],
    evidence: ["DOMAIN_HYPOTHESIS", "PYQ_REQUIRED"],
    sourceSupportKeys: ["scope:e-banking"],
    ownershipNotes: ["Security-control and threat-taxonomy questions remain COM-006."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-041",
    provisionalFamily: "D-CP-I",
    learnerTask: "Evaluate a multi-statement set composed only from independently approved COM-004 atomic facts",
    relationFamily: "com004-multi-statement",
    candidateMode: "STATEMENT_SET",
    objectFamilies: ["Web", "e-mail", "digital payments", "fund-transfer services", "safe actions"],
    surfaceVariants: [
      "Which of statements I, II and III about Internet/e-mail/digital services are correct?",
      "Select the correct combination of independently verifiable COM-004 statements.",
    ],
    evidence: ["DOMAIN_HYPOTHESIS", "PYQ_REQUIRED"],
    sourceSupportKeys: ["scope:web-browsing-searching", "scope:email-account-management", "scope:e-banking"],
    ownershipNotes: ["Composition-only family; it may not introduce new factual claims."],
    productionState: "DISCOVERY_ONLY",
  },
  {
    candidateId: "WEB-DISC-042",
    provisionalFamily: "D-CP-I",
    learnerTask: "Match independently approved COM-004 concepts with purposes, expansions or roles",
    relationFamily: "com004-multi-pair-matching",
    candidateMode: "MATCHING",
    objectFamilies: ["browser", "URL", "BCC", "SMTP", "UPI", "NEFT", "RTGS", "IMPS"],
    surfaceVariants: [
      "Match each Internet/e-mail/payment concept with its correct purpose or expansion.",
      "Match List I with List II using only source-approved COM-004 relation pairs.",
    ],
    evidence: ["DOMAIN_HYPOTHESIS", "PYQ_REQUIRED"],
    sourceSupportKeys: ["scope:web-browsing-searching", "email-operations", "internet-banking"],
    ownershipNotes: ["Composition-only family; all pairs must already exist as approved atomic relations."],
    productionState: "DISCOVERY_ONLY",
  },
];

export function auditCom004InternetWebEmailDiscovery() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const relationFamilies = new Set<string>();
  const familyCounts = new Map<Com004DiscoveryFamily, number>();
  const supportScopes = new Set(COM004_SOURCE_AUTHORITIES.flatMap((source) => source.supports));

  for (const candidate of COM004_INTERNET_WEB_EMAIL_DISCOVERY) {
    if (ids.has(candidate.candidateId)) issues.push(`DUPLICATE_ID:${candidate.candidateId}`);
    ids.add(candidate.candidateId);
    relationFamilies.add(candidate.relationFamily);
    familyCounts.set(candidate.provisionalFamily, (familyCounts.get(candidate.provisionalFamily) ?? 0) + 1);

    if (candidate.productionState !== "DISCOVERY_ONLY") issues.push(`PREMATURE_PRODUCTION_STATE:${candidate.candidateId}`);
    if (!candidate.learnerTask.trim()) issues.push(`EMPTY_LEARNER_TASK:${candidate.candidateId}`);
    if (!candidate.relationFamily.trim()) issues.push(`EMPTY_RELATION_FAMILY:${candidate.candidateId}`);
    if (!candidate.objectFamilies.length) issues.push(`NO_OBJECT_FAMILY:${candidate.candidateId}`);
    if (candidate.surfaceVariants.length < 2) issues.push(`THIN_SURFACE_SET:${candidate.candidateId}`);
    if (!candidate.evidence.length) issues.push(`NO_EVIDENCE_PLAN:${candidate.candidateId}`);
    if (!candidate.sourceSupportKeys.length) issues.push(`NO_SOURCE_SUPPORT:${candidate.candidateId}`);
    for (const supportKey of candidate.sourceSupportKeys) {
      if (!supportScopes.has(supportKey)) issues.push(`UNKNOWN_SOURCE_SUPPORT:${candidate.candidateId}:${supportKey}`);
    }
  }

  for (const family of ["D-CP-A", "D-CP-B", "D-CP-C", "D-CP-D", "D-CP-E", "D-CP-F", "D-CP-G", "D-CP-H", "D-CP-I"] as const) {
    if ((familyCounts.get(family) ?? 0) < 2) issues.push(`THIN_DISCOVERY_FAMILY:${family}:${familyCounts.get(family) ?? 0}`);
  }

  const requiredRelations = [
    "internet-www-distinction",
    "browser-purpose",
    "browser-search-service-distinction",
    "upload-download-direction",
    "url-identity-purpose",
    "http-https-awareness",
    "email-recipient-field-semantics",
    "email-response-action",
    "email-protocol-role",
    "email-protocol-role-comparison",
    "digital-service-concept",
    "digital-payment-system-purpose",
    "internet-banking-concept",
    "fund-transfer-service-model",
    "fund-transfer-service-comparison",
    "digital-service-safe-action",
  ];
  for (const relation of requiredRelations) {
    if (!relationFamilies.has(relation)) issues.push(`MISSING_REQUIRED_RELATION:${relation}`);
  }

  const pyqConfirmed = COM004_INTERNET_WEB_EMAIL_DISCOVERY.filter((candidate) => candidate.evidence.includes("PYQ_CONFIRMED"));
  const ambiguityGuarded = COM004_INTERNET_WEB_EMAIL_DISCOVERY.filter((candidate) => (candidate.ambiguityRisks?.length ?? 0) > 0);
  const crossBoundaryGuarded = COM004_INTERNET_WEB_EMAIL_DISCOVERY.filter((candidate) =>
    candidate.ownershipNotes?.some((note) => /COM-005|COM-006|COM-007/.test(note)),
  );

  if (COM004_INTERNET_WEB_EMAIL_DISCOVERY.length < 40) issues.push(`THIN_DISCOVERY_INVENTORY:${COM004_INTERNET_WEB_EMAIL_DISCOVERY.length}`);
  if (relationFamilies.size < 24) issues.push(`THIN_RELATION_FAMILY_COVERAGE:${relationFamilies.size}`);
  if (pyqConfirmed.length < 6) issues.push(`THIN_PYQ_CONFIRMED_TASKS:${pyqConfirmed.length}`);
  if (ambiguityGuarded.length < 8) issues.push(`THIN_AMBIGUITY_GUARDING:${ambiguityGuarded.length}`);
  if (crossBoundaryGuarded.length < 4) issues.push(`THIN_CROSS_CHAPTER_GUARDING:${crossBoundaryGuarded.length}`);

  return {
    valid: issues.length === 0,
    candidateCount: COM004_INTERNET_WEB_EMAIL_DISCOVERY.length,
    relationFamilyCount: relationFamilies.size,
    familyCounts: Object.fromEntries(familyCounts),
    pyqConfirmedCandidateIds: pyqConfirmed.map((entry) => entry.candidateId),
    ambiguityGuardedCandidateIds: ambiguityGuarded.map((entry) => entry.candidateId),
    crossBoundaryGuardedCandidateIds: crossBoundaryGuarded.map((entry) => entry.candidateId),
    permanentQlCount: 0,
    productionReady: false,
    issues,
  };
}
