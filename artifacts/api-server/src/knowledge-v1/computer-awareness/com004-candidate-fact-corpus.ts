import type {
  KnowledgeFact,
  KnowledgeFactSource,
  KnowledgeFreshnessClass,
  KnowledgeV1Difficulty,
} from "../types";
import { COM004_SOURCE_AUTHORITIES } from "./com004-source-manifest";
import { COM004_SOURCE_AUTHORITY_EXTENSION } from "./com004-source-authority-extension";

export type Com004CandidateCpId =
  | "COM-004-CP-001"
  | "COM-004-CP-002"
  | "COM-004-CP-003"
  | "COM-004-CP-004"
  | "COM-004-CP-005"
  | "COM-004-CP-006"
  | "COM-004-CP-007"
  | "COM-004-CP-008"
  | "COM-004-CP-009";

type FactSeed = {
  factId: string;
  entityKey: string;
  cpId: Com004CandidateCpId;
  family: `D-CP-${"A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I"}`;
  taskId: string;
  relation: string;
  entity: string;
  value: string;
  contextGroupId: string;
  sourceId: string;
  locator: string;
  difficulty?: KnowledgeV1Difficulty;
  freshnessClass?: KnowledgeFreshnessClass;
};

const ALL_AUTHORITIES = [
  ...COM004_SOURCE_AUTHORITIES,
  ...COM004_SOURCE_AUTHORITY_EXTENSION,
];

function source(sourceId: string, locator: string): KnowledgeFactSource {
  const authority = ALL_AUTHORITIES.find((entry) => entry.sourceId === sourceId);
  if (!authority) throw new Error(`Unknown COM-004 source authority ${sourceId}`);
  const sourceType: KnowledgeFactSource["sourceType"] =
    authority.authorityClass === "OFFICIAL_EXAM"
      ? "official"
      : authority.authorityClass === "OFFICIAL_CURRICULUM"
        ? "textbook"
        : "reference";
  return {
    sourceId: authority.sourceId,
    sourceType,
    title: authority.title,
    url: authority.url,
    locator,
  };
}

function buildFact(seed: FactSeed): KnowledgeFact {
  const freshnessClass = seed.freshnessClass ?? "IMMUTABLE";
  const versionScoped = freshnessClass !== "IMMUTABLE";
  return {
    factId: seed.factId,
    entityId: `computer:com004:${seed.entityKey}`,
    subject: "Computer Awareness",
    chapterId: "COM-004",
    cpId: seed.cpId,
    relation: seed.relation,
    entity: { canonicalName: seed.entity, label: { en: seed.entity } },
    value: { kind: "text", text: { en: seed.value } },
    contextGroupId: seed.contextGroupId,
    distractorGroupIds: [seed.contextGroupId],
    difficulty: seed.difficulty ?? "Easy",
    examTags: ["SSC", "BANKING", "PUNJAB_STATE"],
    tags: [
      `provisional-task:${seed.taskId}`,
      `provisional-family:${seed.family}`,
      ...(versionScoped ? ["version-scoped"] : []),
    ],
    source: source(seed.sourceId, seed.locator),
    review: { status: "REVIEW_REQUIRED", confidence: versionScoped ? 0.8 : 0.88 },
    freshness: freshnessClass === "IMMUTABLE"
      ? { class: "IMMUTABLE" }
      : { class: freshnessClass, lastVerifiedAt: "2026-09-06" },
  };
}

const seeds: FactSeed[] = [
  // PT-001 — Internet, WWW and core Web resource concepts (6)
  { factId: "com004-internet-concept", entityKey: "internet", cpId: "COM-004-CP-001", family: "D-CP-A", taskId: "COM004-PT-001", relation: "web_core_concept", entity: "Internet", value: "the worldwide system of interconnected computer networks", contextGroupId: "web-core-concepts", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 6: Introduction to Internet and WWW" },
  { factId: "com004-www-concept", entityKey: "www", cpId: "COM-004-CP-001", family: "D-CP-A", taskId: "COM004-PT-001", relation: "web_core_concept", entity: "World Wide Web", value: "a system of interlinked Web resources accessed over the Internet", contextGroupId: "web-core-concepts", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 6: World Wide Web" },
  { factId: "com004-website-concept", entityKey: "website", cpId: "COM-004-CP-001", family: "D-CP-A", taskId: "COM004-PT-001", relation: "web_core_concept", entity: "Website", value: "a collection of related Web pages/resources presented under a common site identity", contextGroupId: "web-core-concepts", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 6: Web browsing concepts" },
  { factId: "com004-webpage-concept", entityKey: "webpage", cpId: "COM-004-CP-001", family: "D-CP-A", taskId: "COM004-PT-001", relation: "web_core_concept", entity: "Web page", value: "an individual page or resource viewed on the World Wide Web", contextGroupId: "web-core-concepts", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 6: Web browsing concepts" },
  { factId: "com004-homepage-concept", entityKey: "homepage", cpId: "COM-004-CP-001", family: "D-CP-A", taskId: "COM004-PT-001", relation: "web_core_concept", entity: "Home page", value: "the main or starting page of a website", contextGroupId: "web-core-concepts", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 6: Web browsing concepts" },
  { factId: "com004-hyperlink-concept", entityKey: "hyperlink", cpId: "COM-004-CP-001", family: "D-CP-A", taskId: "COM004-PT-001", relation: "web_core_concept", entity: "Hyperlink", value: "a reference that can be activated to navigate to another resource or location", contextGroupId: "web-core-concepts", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 6: Internet and WWW concepts" },

  // PT-002 — Browser, search engine and service classification (6)
  { factId: "com004-browser-role", entityKey: "browser", cpId: "COM-004-CP-002", family: "D-CP-B", taskId: "COM004-PT-002", relation: "browser_search_classification", entity: "Web browser", value: "client application used to access, display and navigate Web content", contextGroupId: "browser-search-service-types", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 6: Web Browsing" },
  { factId: "com004-search-engine-role", entityKey: "search-engine", cpId: "COM-004-CP-002", family: "D-CP-B", taskId: "COM004-PT-002", relation: "browser_search_classification", entity: "Search engine", value: "service used to find Web information by submitting a search query", contextGroupId: "browser-search-service-types", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 6: Search Engines" },
  { factId: "com004-chrome-class", entityKey: "chrome", cpId: "COM-004-CP-002", family: "D-CP-B", taskId: "COM004-PT-002", relation: "browser_search_classification", entity: "Google Chrome", value: "web browser", contextGroupId: "browser-search-service-types", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 6: examples of web browsers" },
  { factId: "com004-firefox-class", entityKey: "firefox", cpId: "COM-004-CP-002", family: "D-CP-B", taskId: "COM004-PT-002", relation: "browser_search_classification", entity: "Mozilla Firefox", value: "web browser", contextGroupId: "browser-search-service-types", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 6: examples of web browsers" },
  { factId: "com004-google-search-class", entityKey: "google-search", cpId: "COM-004-CP-002", family: "D-CP-B", taskId: "COM004-PT-002", relation: "browser_search_classification", entity: "Google Search", value: "web search engine/service", contextGroupId: "browser-search-service-types", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 6: Search Engines" },
  { factId: "com004-search-query-role", entityKey: "search-query", cpId: "COM-004-CP-002", family: "D-CP-B", taskId: "COM004-PT-002", relation: "browser_search_classification", entity: "Search query", value: "words or terms submitted to a search service to request relevant results", contextGroupId: "browser-search-service-types", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 6: searching the Web" },

  // PT-003 — Upload/download direction (2)
  { factId: "com004-download-direction", entityKey: "download", cpId: "COM-004-CP-002", family: "D-CP-B", taskId: "COM004-PT-003", relation: "transfer_direction", entity: "Download", value: "transfer data from a remote service/system to the user's local device", contextGroupId: "upload-download-directions", sourceId: "SSC-CHSL-2024-NOTICE", locator: "Computer Knowledge Test scope: Downloading & Uploading" },
  { factId: "com004-upload-direction", entityKey: "upload", cpId: "COM-004-CP-002", family: "D-CP-B", taskId: "COM004-PT-003", relation: "transfer_direction", entity: "Upload", value: "transfer data from the user's local device to a remote service/system", contextGroupId: "upload-download-directions", sourceId: "SSC-CHSL-2024-NOTICE", locator: "Computer Knowledge Test scope: Downloading & Uploading" },

  // PT-004 — Durable browser actions (4)
  { factId: "com004-browser-refresh", entityKey: "browser-action-refresh", cpId: "COM-004-CP-002", family: "D-CP-B", taskId: "COM004-PT-004", relation: "browser_action_effect", entity: "Refresh / Reload", value: "requests or reloads the current page again", contextGroupId: "browser-actions", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 6: Web Browsing" },
  { factId: "com004-browser-back", entityKey: "browser-action-back", cpId: "COM-004-CP-002", family: "D-CP-B", taskId: "COM004-PT-004", relation: "browser_action_effect", entity: "Back", value: "returns to the previously visited page in browsing history", contextGroupId: "browser-actions", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 6: Web Browsing" },
  { factId: "com004-browser-forward", entityKey: "browser-action-forward", cpId: "COM-004-CP-002", family: "D-CP-B", taskId: "COM004-PT-004", relation: "browser_action_effect", entity: "Forward", value: "moves to a page that follows the current history position after going back", contextGroupId: "browser-actions", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 6: Web Browsing" },
  { factId: "com004-browser-bookmark", entityKey: "browser-action-bookmark", cpId: "COM-004-CP-002", family: "D-CP-B", taskId: "COM004-PT-004", relation: "browser_action_effect", entity: "Bookmark / Favourite", value: "stores a reference to a page for convenient later access", contextGroupId: "browser-actions", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 6: Web Browsing" },

  // PT-005 — URL identity/components (5)
  { factId: "com004-url-expansion", entityKey: "url", cpId: "COM-004-CP-003", family: "D-CP-C", taskId: "COM004-PT-005", relation: "url_identity_component", entity: "URL", value: "Uniform Resource Locator", contextGroupId: "url-components", sourceId: "WHATWG-URL-STANDARD-2026", locator: "URL Standard terminology" },
  { factId: "com004-url-purpose", entityKey: "url", cpId: "COM-004-CP-003", family: "D-CP-C", taskId: "COM004-PT-005", relation: "url_identity_component", entity: "URL purpose", value: "identifies the location/address of a resource using a structured URL", contextGroupId: "url-components", sourceId: "WHATWG-URL-STANDARD-2026", locator: "URL concepts and syntax" },
  { factId: "com004-url-scheme", entityKey: "url-scheme", cpId: "COM-004-CP-003", family: "D-CP-C", taskId: "COM004-PT-005", relation: "url_identity_component", entity: "URL scheme", value: "the leading component such as https that identifies the URL scheme", contextGroupId: "url-components", sourceId: "WHATWG-URL-STANDARD-2026", locator: "URL scheme" },
  { factId: "com004-url-host", entityKey: "url-host", cpId: "COM-004-CP-003", family: "D-CP-C", taskId: "COM004-PT-005", relation: "url_identity_component", entity: "URL host", value: "the host component that identifies the host/domain portion of the URL", contextGroupId: "url-components", sourceId: "WHATWG-URL-STANDARD-2026", locator: "URL host" },
  { factId: "com004-url-path", entityKey: "url-path", cpId: "COM-004-CP-003", family: "D-CP-C", taskId: "COM004-PT-005", relation: "url_identity_component", entity: "URL path", value: "the path component used to identify a resource location within the host's URL space", contextGroupId: "url-components", sourceId: "WHATWG-URL-STANDARD-2026", locator: "URL path" },

  // PT-006 — HTTP/HTTPS awareness (4)
  { factId: "com004-http-expansion", entityKey: "http", cpId: "COM-004-CP-003", family: "D-CP-C", taskId: "COM004-PT-006", relation: "http_https_awareness", entity: "HTTP", value: "Hypertext Transfer Protocol", contextGroupId: "http-https-awareness", sourceId: "IETF-HTTP-RFC9110", locator: "HTTP definition and semantics" },
  { factId: "com004-http-role", entityKey: "http", cpId: "COM-004-CP-003", family: "D-CP-C", taskId: "COM004-PT-006", relation: "http_https_awareness", entity: "HTTP role", value: "application-level protocol semantics for transferring representations and messages in Web communication", contextGroupId: "http-https-awareness", sourceId: "IETF-HTTP-RFC9110", locator: "HTTP semantics overview" },
  { factId: "com004-https-protection", entityKey: "https", cpId: "COM-004-CP-003", family: "D-CP-C", taskId: "COM004-PT-006", relation: "http_https_awareness", entity: "HTTPS", value: "HTTP communication protected by TLS for the connection", contextGroupId: "http-https-awareness", sourceId: "IETF-HTTP-RFC9110", locator: "https URI scheme / secured HTTP" },
  { factId: "com004-https-trust-guard", entityKey: "https-trust-guard", cpId: "COM-004-CP-003", family: "D-CP-C", taskId: "COM004-PT-006", relation: "http_https_awareness", entity: "HTTPS trust implication", value: "does not by itself prove that the site's operator or content is honest, legitimate or malware-free", contextGroupId: "http-https-awareness", sourceId: "RBI-BEAWARE-2022", locator: "safe digital-use guidance: verify entities/sites rather than trusting superficial cues", difficulty: "Medium" },

  // PT-007 — E-mail address/header fields (7)
  { factId: "com004-email-local-part", entityKey: "email-local-part", cpId: "COM-004-CP-004", family: "D-CP-D", taskId: "COM004-PT-007", relation: "email_address_header_role", entity: "Local part", value: "the portion of an e-mail address before the @ symbol", contextGroupId: "email-address-fields", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 7: Structure of E-mail" },
  { factId: "com004-email-at-symbol", entityKey: "email-at", cpId: "COM-004-CP-004", family: "D-CP-D", taskId: "COM004-PT-007", relation: "email_address_header_role", entity: "@ symbol", value: "separates the local part from the domain in the familiar e-mail address form", contextGroupId: "email-address-fields", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 7: Structure of E-mail" },
  { factId: "com004-email-domain-part", entityKey: "email-domain", cpId: "COM-004-CP-004", family: "D-CP-D", taskId: "COM004-PT-007", relation: "email_address_header_role", entity: "E-mail domain part", value: "the domain portion appearing after the @ symbol", contextGroupId: "email-address-fields", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 7: Structure of E-mail" },
  { factId: "com004-email-to", entityKey: "email-field-to", cpId: "COM-004-CP-004", family: "D-CP-D", taskId: "COM004-PT-007", relation: "email_address_header_role", entity: "To", value: "normally identifies the primary intended recipient or recipients", contextGroupId: "email-address-fields", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 7: E-mail fields and operations" },
  { factId: "com004-email-cc", entityKey: "email-field-cc", cpId: "COM-004-CP-004", family: "D-CP-D", taskId: "COM004-PT-007", relation: "email_address_header_role", entity: "CC", value: "sends a visible copy to additional recipient or recipients", contextGroupId: "email-address-fields", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 7: CC field" },
  { factId: "com004-email-bcc", entityKey: "email-field-bcc", cpId: "COM-004-CP-004", family: "D-CP-D", taskId: "COM004-PT-007", relation: "email_address_header_role", entity: "BCC", value: "sends a copy while hiding BCC recipient addresses from the other recipients", contextGroupId: "email-address-fields", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 7: BCC field" },
  { factId: "com004-email-subject", entityKey: "email-field-subject", cpId: "COM-004-CP-004", family: "D-CP-D", taskId: "COM004-PT-007", relation: "email_address_header_role", entity: "Subject", value: "briefly states the topic or purpose of the message", contextGroupId: "email-address-fields", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 7: Structure of E-mail" },

  // PT-008 — Mailbox folders/message state (6)
  { factId: "com004-email-inbox", entityKey: "email-folder-inbox", cpId: "COM-004-CP-004", family: "D-CP-D", taskId: "COM004-PT-008", relation: "email_folder_state", entity: "Inbox", value: "normally contains received messages", contextGroupId: "email-folder-states", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 7: Managing an E-mail account" },
  { factId: "com004-email-outbox", entityKey: "email-folder-outbox", cpId: "COM-004-CP-004", family: "D-CP-D", taskId: "COM004-PT-008", relation: "email_folder_state", entity: "Outbox", value: "normally holds messages waiting to be sent or still in the sending process", contextGroupId: "email-folder-states", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 7: Managing an E-mail account" },
  { factId: "com004-email-sent", entityKey: "email-folder-sent", cpId: "COM-004-CP-004", family: "D-CP-D", taskId: "COM004-PT-008", relation: "email_folder_state", entity: "Sent", value: "normally stores copies of messages that have been sent", contextGroupId: "email-folder-states", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 7: Managing an E-mail account" },
  { factId: "com004-email-draft", entityKey: "email-folder-draft", cpId: "COM-004-CP-004", family: "D-CP-D", taskId: "COM004-PT-008", relation: "email_folder_state", entity: "Draft", value: "stores a message saved before it is sent", contextGroupId: "email-folder-states", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 7: Managing an E-mail account" },
  { factId: "com004-email-spam", entityKey: "email-folder-spam", cpId: "COM-004-CP-004", family: "D-CP-D", taskId: "COM004-PT-008", relation: "email_folder_state", entity: "Spam / Junk", value: "normally contains messages classified as unwanted or suspected junk mail", contextGroupId: "email-folder-states", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 7: Managing an E-mail account" },
  { factId: "com004-email-trash", entityKey: "email-folder-trash", cpId: "COM-004-CP-004", family: "D-CP-D", taskId: "COM004-PT-008", relation: "email_folder_state", entity: "Trash / Deleted Items", value: "normally contains messages moved to a deleted-items state before final removal", contextGroupId: "email-folder-states", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 7: Managing an E-mail account" },

  // PT-009 — Response actions/features (5)
  { factId: "com004-email-reply", entityKey: "email-action-reply", cpId: "COM-004-CP-004", family: "D-CP-D", taskId: "COM004-PT-009", relation: "email_action_feature_role", entity: "Reply", value: "responds to the original sender", contextGroupId: "email-actions-features", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 7: E-mail operations" },
  { factId: "com004-email-reply-all", entityKey: "email-action-reply-all", cpId: "COM-004-CP-004", family: "D-CP-D", taskId: "COM004-PT-009", relation: "email_action_feature_role", entity: "Reply All", value: "responds to the sender and the other applicable original recipients", contextGroupId: "email-actions-features", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 7: E-mail operations" },
  { factId: "com004-email-forward", entityKey: "email-action-forward", cpId: "COM-004-CP-004", family: "D-CP-D", taskId: "COM004-PT-009", relation: "email_action_feature_role", entity: "Forward", value: "sends an existing message onward to a new recipient or recipients", contextGroupId: "email-actions-features", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 7: E-mail operations" },
  { factId: "com004-email-attachment", entityKey: "email-attachment", cpId: "COM-004-CP-004", family: "D-CP-D", taskId: "COM004-PT-009", relation: "email_action_feature_role", entity: "Attachment", value: "adds or sends a file together with an e-mail message", contextGroupId: "email-actions-features", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 7: E-mail attachments" },
  { factId: "com004-email-signature", entityKey: "email-signature", cpId: "COM-004-CP-004", family: "D-CP-D", taskId: "COM004-PT-009", relation: "email_action_feature_role", entity: "E-mail signature", value: "a standard closing/name/contact block that can be appended to outgoing messages", contextGroupId: "email-actions-features", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 7: E-mail signatures" },

  // PT-010 — SMTP, POP3 and IMAP roles/expansions (6)
  { factId: "com004-smtp-expansion", entityKey: "smtp", cpId: "COM-004-CP-005", family: "D-CP-E", taskId: "COM004-PT-010", relation: "email_protocol_fact", entity: "SMTP", value: "Simple Mail Transfer Protocol", contextGroupId: "email-protocol-facts", sourceId: "IETF-SMTP-RFC5321", locator: "RFC title and protocol identity" },
  { factId: "com004-smtp-role", entityKey: "smtp", cpId: "COM-004-CP-005", family: "D-CP-E", taskId: "COM004-PT-010", relation: "email_protocol_fact", entity: "SMTP role", value: "sending/submission and transport of e-mail rather than mailbox retrieval", contextGroupId: "email-protocol-facts", sourceId: "IETF-MAIL-SUBMISSION-RFC6409", locator: "Message submission versus mailbox access" },
  { factId: "com004-pop3-expansion", entityKey: "pop3", cpId: "COM-004-CP-005", family: "D-CP-E", taskId: "COM004-PT-010", relation: "email_protocol_fact", entity: "POP3", value: "Post Office Protocol Version 3", contextGroupId: "email-protocol-facts", sourceId: "IETF-POP3-RFC1939", locator: "RFC title and protocol identity" },
  { factId: "com004-pop3-role", entityKey: "pop3", cpId: "COM-004-CP-005", family: "D-CP-E", taskId: "COM004-PT-010", relation: "email_protocol_fact", entity: "POP3 role", value: "retrieval/access of delivered e-mail through the Post Office Protocol model", contextGroupId: "email-protocol-facts", sourceId: "IETF-POP3-RFC1939", locator: "POP3 introduction and maildrop access" },
  { factId: "com004-imap-expansion", entityKey: "imap", cpId: "COM-004-CP-005", family: "D-CP-E", taskId: "COM004-PT-010", relation: "email_protocol_fact", entity: "IMAP", value: "Internet Message Access Protocol", contextGroupId: "email-protocol-facts", sourceId: "IETF-IMAP-RFC9051", locator: "RFC title and protocol identity" },
  { factId: "com004-imap-role", entityKey: "imap", cpId: "COM-004-CP-005", family: "D-CP-E", taskId: "COM004-PT-010", relation: "email_protocol_fact", entity: "IMAP role", value: "accessing and manipulating messages in server mailboxes", contextGroupId: "email-protocol-facts", sourceId: "IETF-IMAP-RFC9051", locator: "IMAP purpose and mailbox model" },

  // PT-011 — E-commerce/e-governance (4)
  { factId: "com004-ecommerce-concept", entityKey: "ecommerce", cpId: "COM-004-CP-006", family: "D-CP-F", taskId: "COM004-PT-011", relation: "digital_service_concept", entity: "E-commerce", value: "commercial buying, selling or transaction activity conducted through electronic/online systems", contextGroupId: "digital-service-concepts", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 7: e-Commerce" },
  { factId: "com004-ecommerce-focus", entityKey: "ecommerce-focus", cpId: "COM-004-CP-006", family: "D-CP-F", taskId: "COM004-PT-011", relation: "digital_service_concept", entity: "E-commerce focus", value: "commercial exchange of goods/services or related transactions", contextGroupId: "digital-service-concepts", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 7: e-Commerce" },
  { factId: "com004-egovernance-concept", entityKey: "egovernance", cpId: "COM-004-CP-006", family: "D-CP-F", taskId: "COM004-PT-011", relation: "digital_service_concept", entity: "E-governance", value: "use of digital/electronic systems in government information, interaction and service delivery", contextGroupId: "digital-service-concepts", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 7: e-Governance Services" },
  { factId: "com004-egovernance-focus", entityKey: "egovernance-focus", cpId: "COM-004-CP-006", family: "D-CP-F", taskId: "COM004-PT-011", relation: "digital_service_concept", entity: "E-governance focus", value: "digital public administration and government-service interaction rather than commercial selling", contextGroupId: "digital-service-concepts", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 7: e-Governance Services" },

  // PT-012 — Netiquette/responsible online conduct (4)
  { factId: "com004-netiquette-concept", entityKey: "netiquette", cpId: "COM-004-CP-006", family: "D-CP-F", taskId: "COM004-PT-012", relation: "netiquette_principle", entity: "Netiquette", value: "appropriate etiquette and responsible conduct when communicating or interacting online", contextGroupId: "netiquette-principles", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 7: Netiquettes" },
  { factId: "com004-netiquette-respect", entityKey: "netiquette-respect", cpId: "COM-004-CP-006", family: "D-CP-F", taskId: "COM004-PT-012", relation: "netiquette_principle", entity: "Respectful online communication", value: "communicate without abusive, harassing or needlessly hostile behavior", contextGroupId: "netiquette-principles", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 7: Netiquettes / responsible communication" },
  { factId: "com004-netiquette-privacy", entityKey: "netiquette-privacy", cpId: "COM-004-CP-006", family: "D-CP-F", taskId: "COM004-PT-012", relation: "netiquette_principle", entity: "Respect for privacy", value: "avoid exposing another person's private information without a valid reason or permission", contextGroupId: "netiquette-principles", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 7: Netiquettes / responsible online behavior" },
  { factId: "com004-netiquette-sharing", entityKey: "netiquette-sharing", cpId: "COM-004-CP-006", family: "D-CP-F", taskId: "COM004-PT-012", relation: "netiquette_principle", entity: "Responsible sharing", value: "consider accuracy, relevance and harm before forwarding or posting information", contextGroupId: "netiquette-principles", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 7: Netiquettes / responsible online behavior", difficulty: "Medium" },

  // PT-013 — OTP and QR identity/purpose (4)
  { factId: "com004-otp-expansion", entityKey: "otp", cpId: "COM-004-CP-007", family: "D-CP-G", taskId: "COM004-PT-013", relation: "otp_qr_fact", entity: "OTP", value: "One Time Password", contextGroupId: "otp-qr-facts", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 8: OTP" },
  { factId: "com004-otp-purpose", entityKey: "otp", cpId: "COM-004-CP-007", family: "D-CP-G", taskId: "COM004-PT-013", relation: "otp_qr_fact", entity: "OTP purpose", value: "a temporary credential used as an authentication or verification factor", contextGroupId: "otp-qr-facts", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 8: OTP" },
  { factId: "com004-qr-expansion", entityKey: "qr", cpId: "COM-004-CP-007", family: "D-CP-G", taskId: "COM004-PT-013", relation: "otp_qr_fact", entity: "QR", value: "Quick Response", contextGroupId: "otp-qr-facts", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 8: QR" },
  { factId: "com004-qr-purpose", entityKey: "qr", cpId: "COM-004-CP-007", family: "D-CP-G", taskId: "COM004-PT-013", relation: "otp_qr_fact", entity: "QR code purpose", value: "a scannable code that can encode information such as payment details or identifiers", contextGroupId: "otp-qr-facts", sourceId: "NPCI-UPI-PRODUCT-2026", locator: "UPI QR/payment usage" },

  // PT-014 — UPI (4)
  { factId: "com004-upi-expansion", entityKey: "upi", cpId: "COM-004-CP-007", family: "D-CP-G", taskId: "COM004-PT-014", relation: "upi_fact", entity: "UPI", value: "Unified Payments Interface", contextGroupId: "upi-facts", sourceId: "NPCI-UPI-PRODUCT-2026", locator: "canonical product name" },
  { factId: "com004-upi-purpose", entityKey: "upi", cpId: "COM-004-CP-007", family: "D-CP-G", taskId: "COM004-PT-014", relation: "upi_fact", entity: "UPI purpose", value: "enables real-time bank-account based digital payments through participating UPI applications", contextGroupId: "upi-facts", sourceId: "NPCI-UPI-PRODUCT-2026", locator: "UPI product purpose", freshnessClass: "SLOW_MUTABLE" },
  { factId: "com004-upi-p2p", entityKey: "upi-p2p", cpId: "COM-004-CP-007", family: "D-CP-G", taskId: "COM004-PT-014", relation: "upi_fact", entity: "UPI person-to-person use", value: "supports transferring money between participating bank accounts", contextGroupId: "upi-facts", sourceId: "NPCI-UPI-PRODUCT-2026", locator: "UPI fund-transfer capability", freshnessClass: "SLOW_MUTABLE" },
  { factId: "com004-upi-merchant", entityKey: "upi-merchant", cpId: "COM-004-CP-007", family: "D-CP-G", taskId: "COM004-PT-014", relation: "upi_fact", entity: "UPI merchant use", value: "supports merchant payments through UPI-enabled payment flows", contextGroupId: "upi-facts", sourceId: "NPCI-UPI-PRODUCT-2026", locator: "UPI merchant-payment capability", freshnessClass: "SLOW_MUTABLE" },

  // PT-015 — AePS and USSD (6)
  { factId: "com004-aeps-expansion", entityKey: "aeps", cpId: "COM-004-CP-007", family: "D-CP-G", taskId: "COM004-PT-015", relation: "aeps_ussd_fact", entity: "AePS", value: "Aadhaar Enabled Payment System", contextGroupId: "aeps-ussd-facts", sourceId: "NPCI-AEPS-BOOKLET-2026", locator: "product name and expansion" },
  { factId: "com004-aeps-purpose", entityKey: "aeps", cpId: "COM-004-CP-007", family: "D-CP-G", taskId: "COM004-PT-015", relation: "aeps_ussd_fact", entity: "AePS purpose", value: "supports basic assisted banking transactions using Aadhaar-based authentication at participating touchpoints", contextGroupId: "aeps-ussd-facts", sourceId: "NPCI-AEPS-BOOKLET-2026", locator: "AePS product purpose", freshnessClass: "SLOW_MUTABLE" },
  { factId: "com004-aeps-auth", entityKey: "aeps-auth", cpId: "COM-004-CP-007", family: "D-CP-G", taskId: "COM004-PT-015", relation: "aeps_ussd_fact", entity: "AePS authentication anchor", value: "Aadhaar-based authentication is central to the AePS service model", contextGroupId: "aeps-ussd-facts", sourceId: "NPCI-AEPS-BOOKLET-2026", locator: "AePS Aadhaar authentication" },
  { factId: "com004-ussd-expansion", entityKey: "ussd", cpId: "COM-004-CP-007", family: "D-CP-G", taskId: "COM004-PT-015", relation: "aeps_ussd_fact", entity: "USSD", value: "Unstructured Supplementary Service Data", contextGroupId: "aeps-ussd-facts", sourceId: "NPCI-USSD-99-REFERENCE", locator: "USSD service identity" },
  { factId: "com004-ussd-99", entityKey: "ussd-99", cpId: "COM-004-CP-007", family: "D-CP-G", taskId: "COM004-PT-015", relation: "aeps_ussd_fact", entity: "*99# service", value: "USSD-based mobile-banking access associated with NPCI's *99# service", contextGroupId: "aeps-ussd-facts", sourceId: "NPCI-USSD-99-REFERENCE", locator: "*99# mobile banking reference", freshnessClass: "SLOW_MUTABLE" },
  { factId: "com004-ussd-data", entityKey: "ussd-data", cpId: "COM-004-CP-007", family: "D-CP-G", taskId: "COM004-PT-015", relation: "aeps_ussd_fact", entity: "USSD data-channel property", value: "can provide session-based mobile service access without requiring a mobile-data Internet connection", contextGroupId: "aeps-ussd-facts", sourceId: "NPCI-USSD-99-REFERENCE", locator: "USSD service access model", freshnessClass: "SLOW_MUTABLE" },

  // PT-016 — Cards, e-wallet and PoS (7)
  { factId: "com004-debit-card", entityKey: "debit-card", cpId: "COM-004-CP-007", family: "D-CP-G", taskId: "COM004-PT-016", relation: "payment_tool_concept", entity: "Debit card", value: "payment card whose eligible purchase transactions ordinarily draw funds from the linked deposit account", contextGroupId: "payment-tool-concepts", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 8: Cards" },
  { factId: "com004-credit-card", entityKey: "credit-card", cpId: "COM-004-CP-007", family: "D-CP-G", taskId: "COM004-PT-016", relation: "payment_tool_concept", entity: "Credit card", value: "payment card that uses an issuer-provided credit facility rather than directly drawing the purchase amount from a deposit balance", contextGroupId: "payment-tool-concepts", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 8: Cards" },
  { factId: "com004-ppi", entityKey: "ppi", cpId: "COM-004-CP-007", family: "D-CP-G", taskId: "COM004-PT-016", relation: "payment_tool_concept", entity: "Prepaid Payment Instrument (PPI)", value: "payment instrument that facilitates eligible payments/services against value stored in the instrument", contextGroupId: "payment-tool-concepts", sourceId: "RBI-PPI-FAQ-2022", locator: "FAQ: What are PPIs?" },
  { factId: "com004-ewallet", entityKey: "ewallet", cpId: "COM-004-CP-007", family: "D-CP-G", taskId: "COM004-PT-016", relation: "payment_tool_concept", entity: "E-wallet / prepaid wallet", value: "electronic prepaid-value payment tool used to access stored value for eligible transactions", contextGroupId: "payment-tool-concepts", sourceId: "RBI-PPI-FAQ-2022", locator: "PPI definition and electronic wallet context", freshnessClass: "SLOW_MUTABLE" },
  { factId: "com004-pos-expansion", entityKey: "pos", cpId: "COM-004-CP-007", family: "D-CP-G", taskId: "COM004-PT-016", relation: "payment_tool_concept", entity: "PoS", value: "Point of Sale", contextGroupId: "payment-tool-concepts", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 8: PoS" },
  { factId: "com004-pos-purpose", entityKey: "pos", cpId: "COM-004-CP-007", family: "D-CP-G", taskId: "COM004-PT-016", relation: "payment_tool_concept", entity: "PoS terminal/system", value: "merchant-side point used to accept supported electronic payment transactions", contextGroupId: "payment-tool-concepts", sourceId: "RBI-ATM-POS-FAQ", locator: "cash withdrawal/payment context at PoS terminals", freshnessClass: "SLOW_MUTABLE" },
  { factId: "com004-wallet-stored-value", entityKey: "wallet-stored-value", cpId: "COM-004-CP-007", family: "D-CP-G", taskId: "COM004-PT-016", relation: "payment_tool_concept", entity: "Stored-value property", value: "prepaid value is loaded before it is used for eligible transactions", contextGroupId: "payment-tool-concepts", sourceId: "RBI-PPI-FAQ-2022", locator: "PPI value-stored definition" },

  // PT-017 — Internet banking/e-banking (4)
  { factId: "com004-internet-banking", entityKey: "internet-banking", cpId: "COM-004-CP-008", family: "D-CP-H", taskId: "COM004-PT-017", relation: "internet_banking_concept", entity: "Internet banking", value: "accessing or performing banking services through a bank's online channel", contextGroupId: "internet-banking-concepts", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 8: Internet Banking" },
  { factId: "com004-ebanking", entityKey: "ebanking", cpId: "COM-004-CP-008", family: "D-CP-H", taskId: "COM004-PT-017", relation: "internet_banking_concept", entity: "E-banking", value: "electronic delivery/use of banking services through digital channels", contextGroupId: "internet-banking-concepts", sourceId: "SSC-CHSL-2024-NOTICE", locator: "Computer Knowledge Test scope: e-Banking" },
  { factId: "com004-ebanking-transfer-context", entityKey: "ebanking-fund-transfer", cpId: "COM-004-CP-008", family: "D-CP-H", taskId: "COM004-PT-017", relation: "internet_banking_concept", entity: "Electronic fund transfer", value: "a common banking activity performed through eligible electronic banking/payment channels", contextGroupId: "internet-banking-concepts", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 8: Internet Banking / digital financial tools" },
  { factId: "com004-ebanking-service-context", entityKey: "ebanking-service-context", cpId: "COM-004-CP-008", family: "D-CP-H", taskId: "COM004-PT-017", relation: "internet_banking_concept", entity: "NEFT / RTGS / IMPS context", value: "electronic fund-transfer services commonly encountered in digital banking", contextGroupId: "internet-banking-concepts", sourceId: "NIELIT-CCC-REV4-2023", locator: "Chapter 8: NEFT, RTGS, IMPS" },

  // PT-018 — NEFT, RTGS, IMPS (9)
  { factId: "com004-neft-expansion", entityKey: "neft", cpId: "COM-004-CP-008", family: "D-CP-H", taskId: "COM004-PT-018", relation: "fund_transfer_service_fact", entity: "NEFT", value: "National Electronic Funds Transfer", contextGroupId: "fund-transfer-services", sourceId: "RBI-NEFT-FAQ-2024", locator: "NEFT system name" },
  { factId: "com004-neft-model", entityKey: "neft-model", cpId: "COM-004-CP-008", family: "D-CP-H", taskId: "COM004-PT-018", relation: "fund_transfer_service_fact", entity: "NEFT settlement model", value: "electronic fund transfers processed and settled in batches", contextGroupId: "fund-transfer-services", sourceId: "RBI-NEFT-FAQ-2024", locator: "NEFT batch settlement", difficulty: "Medium", freshnessClass: "SLOW_MUTABLE" },
  { factId: "com004-neft-owner", entityKey: "neft-owner", cpId: "COM-004-CP-008", family: "D-CP-H", taskId: "COM004-PT-018", relation: "fund_transfer_service_fact", entity: "NEFT authority", value: "RBI-operated centralised electronic fund-transfer system", contextGroupId: "fund-transfer-services", sourceId: "RBI-NEFT-FAQ-2024", locator: "NEFT system authority", freshnessClass: "SLOW_MUTABLE" },
  { factId: "com004-rtgs-expansion", entityKey: "rtgs", cpId: "COM-004-CP-008", family: "D-CP-H", taskId: "COM004-PT-018", relation: "fund_transfer_service_fact", entity: "RTGS", value: "Real Time Gross Settlement", contextGroupId: "fund-transfer-services", sourceId: "RBI-RTGS-FAQ-2022", locator: "RTGS system name" },
  { factId: "com004-rtgs-real-time", entityKey: "rtgs-real-time", cpId: "COM-004-CP-008", family: "D-CP-H", taskId: "COM004-PT-018", relation: "fund_transfer_service_fact", entity: "RTGS — real time", value: "transactions are processed without waiting for a later batch-processing cycle", contextGroupId: "fund-transfer-services", sourceId: "RBI-RTGS-FAQ-2022", locator: "meaning of real time", difficulty: "Medium", freshnessClass: "SLOW_MUTABLE" },
  { factId: "com004-rtgs-gross", entityKey: "rtgs-gross", cpId: "COM-004-CP-008", family: "D-CP-H", taskId: "COM004-PT-018", relation: "fund_transfer_service_fact", entity: "RTGS — gross", value: "transactions are settled individually rather than netted together with other transactions", contextGroupId: "fund-transfer-services", sourceId: "RBI-RTGS-FAQ-2022", locator: "meaning of gross settlement", difficulty: "Medium", freshnessClass: "SLOW_MUTABLE" },
  { factId: "com004-imps-expansion", entityKey: "imps", cpId: "COM-004-CP-008", family: "D-CP-H", taskId: "COM004-PT-018", relation: "fund_transfer_service_fact", entity: "IMPS", value: "Immediate Payment Service", contextGroupId: "fund-transfer-services", sourceId: "NPCI-IMPS-BOOKLET-2026", locator: "IMPS product name" },
  { factId: "com004-imps-model", entityKey: "imps-model", cpId: "COM-004-CP-008", family: "D-CP-H", taskId: "COM004-PT-018", relation: "fund_transfer_service_fact", entity: "IMPS service model", value: "instant electronic inter-bank fund-transfer service", contextGroupId: "fund-transfer-services", sourceId: "NPCI-IMPS-BOOKLET-2026", locator: "IMPS product purpose", difficulty: "Medium", freshnessClass: "SLOW_MUTABLE" },
  { factId: "com004-transfer-comparison", entityKey: "fund-transfer-comparison", cpId: "COM-004-CP-008", family: "D-CP-H", taskId: "COM004-PT-018", relation: "fund_transfer_service_fact", entity: "NEFT vs RTGS durable distinction", value: "NEFT uses batch settlement whereas RTGS settles transactions individually in real time on a gross basis", contextGroupId: "fund-transfer-services", sourceId: "RBI-CPS-FAQ-2021", locator: "RTGS versus NEFT settlement models", difficulty: "Medium", freshnessClass: "SLOW_MUTABLE" },

  // PT-019 — Digital-service safe actions (7)
  { factId: "com004-safe-otp", entityKey: "safe-otp", cpId: "COM-004-CP-009", family: "D-CP-I", taskId: "COM004-PT-019", relation: "digital_service_safe_action", entity: "OTP secrecy", value: "do not share an OTP with another person, including someone claiming to be from a bank or authority", contextGroupId: "digital-banking-safe-actions", sourceId: "RBI-FAME-2024", locator: "FAME Don'ts: never share OTP" },
  { factId: "com004-safe-pin", entityKey: "safe-pin", cpId: "COM-004-CP-009", family: "D-CP-I", taskId: "COM004-PT-019", relation: "digital_service_safe_action", entity: "PIN secrecy", value: "do not disclose the card/account PIN to another person", contextGroupId: "digital-banking-safe-actions", sourceId: "RBI-FAME-2024", locator: "FAME Don'ts: do not share PIN" },
  { factId: "com004-safe-cvv", entityKey: "safe-cvv", cpId: "COM-004-CP-009", family: "D-CP-I", taskId: "COM004-PT-019", relation: "digital_service_safe_action", entity: "CVV secrecy", value: "do not share the card verification value (CVV) with another person", contextGroupId: "digital-banking-safe-actions", sourceId: "RBI-FAME-2024", locator: "FAME Don'ts: do not share card details/CVV" },
  { factId: "com004-safe-password", entityKey: "safe-password", cpId: "COM-004-CP-009", family: "D-CP-I", taskId: "COM004-PT-019", relation: "digital_service_safe_action", entity: "Banking password secrecy", value: "keep banking login credentials/passwords confidential and do not provide them in response to unsolicited requests", contextGroupId: "digital-banking-safe-actions", sourceId: "RBI-BEAWARE-2022", locator: "consumer precautions: genuine entities do not ask for confidential credentials" },
  { factId: "com004-safe-suspicious-link", entityKey: "safe-suspicious-link", cpId: "COM-004-CP-009", family: "D-CP-I", taskId: "COM004-PT-019", relation: "digital_service_safe_action", entity: "Suspicious banking link", value: "avoid entering banking credentials through an unsolicited or suspicious link; navigate using a verified official channel", contextGroupId: "digital-banking-safe-actions", sourceId: "RBI-BEAWARE-2022", locator: "digital-fraud precautions for links/websites", difficulty: "Medium" },
  { factId: "com004-safe-verify-entity", entityKey: "safe-verify-entity", cpId: "COM-004-CP-009", family: "D-CP-I", taskId: "COM004-PT-019", relation: "digital_service_safe_action", entity: "Verify banking channel", value: "verify the bank/payment entity and official channel before providing credentials or approving a transaction", contextGroupId: "digital-banking-safe-actions", sourceId: "RBI-BEAWARE-2022", locator: "consumer precautions: verify source/entity before acting", difficulty: "Medium" },
  { factId: "com004-safe-report", entityKey: "safe-report", cpId: "COM-004-CP-009", family: "D-CP-I", taskId: "COM004-PT-019", relation: "digital_service_safe_action", entity: "Unauthorised transaction response", value: "report an unauthorised digital-banking transaction promptly through the bank's official reporting channel", contextGroupId: "digital-banking-safe-actions", sourceId: "RBI-BEAWARE-2022", locator: "consumer precautions and reporting guidance", difficulty: "Medium" },
];

export const COM004_CANDIDATE_FACTS: KnowledgeFact[] = seeds.map(buildFact);

export function auditCom004CandidateFactCorpus() {
  const issues: string[] = [];
  const factIds = new Set<string>();
  const knownSourceIds = new Set(ALL_AUTHORITIES.map((entry) => entry.sourceId));
  const allowedCpIds = new Set<Com004CandidateCpId>([
    "COM-004-CP-001", "COM-004-CP-002", "COM-004-CP-003",
    "COM-004-CP-004", "COM-004-CP-005", "COM-004-CP-006",
    "COM-004-CP-007", "COM-004-CP-008", "COM-004-CP-009",
  ]);

  for (const fact of COM004_CANDIDATE_FACTS) {
    if (factIds.has(fact.factId)) issues.push(`DUPLICATE_FACT_ID:${fact.factId}`);
    factIds.add(fact.factId);
    if (!allowedCpIds.has(fact.cpId as Com004CandidateCpId)) issues.push(`UNKNOWN_CANDIDATE_CP:${fact.factId}:${fact.cpId}`);
    if (!knownSourceIds.has(fact.source.sourceId)) issues.push(`UNKNOWN_SOURCE:${fact.factId}:${fact.source.sourceId}`);
    if (!fact.tags.some((tag) => tag.startsWith("provisional-task:"))) issues.push(`MISSING_TASK_TAG:${fact.factId}`);
    if (!fact.tags.some((tag) => tag.startsWith("provisional-family:"))) issues.push(`MISSING_FAMILY_TAG:${fact.factId}`);
    if (fact.review.status !== "REVIEW_REQUIRED") issues.push(`PREMATURE_REVIEW_STATE:${fact.factId}`);
    const authority = ALL_AUTHORITIES.find((entry) => entry.sourceId === fact.source.sourceId);
    if (authority?.authorityClass === "PYQ_EVIDENCE") issues.push(`PYQ_USED_AS_TRUTH_SOURCE:${fact.factId}`);
    if (fact.freshness.class !== "IMMUTABLE" && !fact.tags.includes("version-scoped")) {
      issues.push(`MUTABLE_FACT_WITHOUT_VERSION_SCOPE:${fact.factId}`);
    }
    if (fact.value.kind !== "text" || !fact.value.text.en.trim()) issues.push(`EMPTY_TEXT_VALUE:${fact.factId}`);
  }

  const taskIds = new Set(COM004_CANDIDATE_FACTS.flatMap((fact) =>
    fact.tags.filter((tag) => tag.startsWith("provisional-task:")).map((tag) => tag.replace("provisional-task:", "")),
  ));
  const familyIds = new Set(COM004_CANDIDATE_FACTS.flatMap((fact) =>
    fact.tags.filter((tag) => tag.startsWith("provisional-family:")).map((tag) => tag.replace("provisional-family:", "")),
  ));

  if (COM004_CANDIDATE_FACTS.length !== 100) issues.push(`UNEXPECTED_FACT_COUNT:${COM004_CANDIDATE_FACTS.length}`);
  if (taskIds.size !== 19) issues.push(`UNEXPECTED_TASK_COUNT:${taskIds.size}`);
  if (familyIds.size !== 9) issues.push(`UNEXPECTED_FAMILY_COUNT:${familyIds.size}`);

  return {
    valid: issues.length === 0,
    factCount: COM004_CANDIDATE_FACTS.length,
    taskCount: taskIds.size,
    familyCount: familyIds.size,
    taskIds: [...taskIds].sort(),
    familyIds: [...familyIds].sort(),
    permanentQlCount: 0,
    productionEligible: false,
    status: issues.length === 0 ? "SOURCE_BACKED_CANDIDATE_CORPUS_READY" as const : "BLOCKED" as const,
    issues,
  };
}
