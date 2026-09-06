import { deterministicIndex } from "../deterministic";
import {
  COM004_PERMANENT_QL_ALLOCATIONS_V1,
  auditCom004PermanentQlAllocationV1,
  type Com004PermanentQlId,
} from "./com004-permanent-ql-allocation-v1";

export type Com004EnglishWave3SurfaceFamily =
  | "DIRECT_RECALL"
  | "CONCEPT_DISCRIMINATION"
  | "SCENARIO_APPLICATION"
  | "STATEMENT_EVALUATION"
  | "MATCHING_REASONING";

export type Com004EnglishWave3QuestionV1 = {
  questionId: string;
  qlId: Com004PermanentQlId;
  authorityProposalId: string;
  sourceCandidateIds: string[];
  surfaceFamily: Com004EnglishWave3SurfaceFamily;
  stem: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  reviewOnly: true;
  runtimeRegistered: false;
};

type AuthoringInput = {
  qlId: Com004PermanentQlId;
  ordinal: number;
  surfaceFamily: Com004EnglishWave3SurfaceFamily;
  stem: string;
  canonicalAnswer: string;
  distractors: [string, string, string];
  explanation: string;
};

const allocationAudit = auditCom004PermanentQlAllocationV1();
if (!allocationAudit.valid) {
  throw new Error(`COM-004 English Wave 3 cannot bind invalid permanent QLs: ${allocationAudit.issues.join(", ")}`);
}

const allocationByQl = new Map(COM004_PERMANENT_QL_ALLOCATIONS_V1.map((allocation) => [allocation.permanentQlId, allocation]));

function author(input: AuthoringInput): Com004EnglishWave3QuestionV1 {
  const allocation = allocationByQl.get(input.qlId);
  if (!allocation) throw new Error(`Unknown COM-004 permanent QL ${input.qlId}`);
  const canonicalAnswer = input.canonicalAnswer.trim();
  const distractors = input.distractors.map((value) => value.trim());
  if (new Set([canonicalAnswer, ...distractors].map((value) => value.toLowerCase())).size !== 4) {
    throw new Error(`${input.qlId}/${input.ordinal}: options must be semantically distinct`);
  }
  const correctIndex = deterministicIndex(`COM004:EN:W3:${input.qlId}:${input.ordinal}:answer-position`, 4);
  const options = [...distractors];
  options.splice(correctIndex, 0, canonicalAnswer);
  return {
    questionId: `COM004-EN-W3-${input.qlId.slice(-3)}-${String(input.ordinal).padStart(2, "0")}`,
    qlId: input.qlId,
    authorityProposalId: allocation.authorityProposalId,
    sourceCandidateIds: [...allocation.sourceCandidateIds],
    surfaceFamily: input.surfaceFamily,
    stem: input.stem.trim(),
    options,
    correctIndex,
    canonicalAnswer,
    explanation: input.explanation.trim(),
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

const ql009: Com004EnglishWave3QuestionV1[] = [
  author({
    qlId: "COM-004-QL-009", ordinal: 1, surfaceFamily: "DIRECT_RECALL",
    stem: "Which Web protocol abbreviation denotes the secure form of HTTP commonly used for encrypted browser-to-site communication?",
    canonicalAnswer: "HTTPS",
    distractors: ["HTTP", "SMTP", "FTP"],
    explanation: "HTTPS is HTTP carried through a TLS-protected connection. At user-awareness level, it indicates an encrypted secure channel between the client and the contacted Web endpoint.",
  }),
  author({
    qlId: "COM-004-QL-009", ordinal: 2, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "Which statement most accurately distinguishes HTTP from HTTPS at basic computer-awareness level?",
    canonicalAnswer: "HTTPS protects HTTP communication with TLS, while plain HTTP lacks that TLS protection",
    distractors: ["HTTP is a browser and HTTPS is a search engine", "HTTPS is proof that every site using it is genuine", "HTTP is used only for e-mail while HTTPS is used only for file storage"],
    explanation: "The core distinction is secure-channel protection: HTTPS uses TLS around HTTP communication. That protection does not by itself establish that the website operator is trustworthy or legitimate.",
  }),
  author({
    qlId: "COM-004-QL-009", ordinal: 3, surfaceFamily: "STATEMENT_EVALUATION",
    stem: "Consider the statements: (1) HTTPS can protect Web traffic in transit with encryption. (2) HTTPS alone proves that a website is legitimate. Which option is correct?",
    canonicalAnswer: "Only statement 1 is correct",
    distractors: ["Only statement 2 is correct", "Both statements are correct", "Neither statement is correct"],
    explanation: "HTTPS provides transport protection such as encryption through TLS, so statement 1 is correct. A malicious or deceptive site can also use HTTPS, so the protocol alone is not proof of legitimacy.",
  }),
  author({
    qlId: "COM-004-QL-009", ordinal: 4, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "A browser shows that a page is being loaded through an HTTPS connection. What is the safest conclusion from that fact alone?",
    canonicalAnswer: "The browser has a TLS-protected connection to the contacted endpoint, but site legitimacy still requires separate judgment",
    distractors: ["The site is automatically genuine and cannot be malicious", "The user no longer needs to verify the domain name", "The connection is necessarily plain unencrypted HTTP"],
    explanation: "HTTPS gives evidence about the protected connection, not a blanket guarantee about the site's intentions or identity. Users must still verify that they reached the intended domain and service.",
  }),
  author({
    qlId: "COM-004-QL-009", ordinal: 5, surfaceFamily: "DIRECT_RECALL",
    stem: "In the abbreviation HTTPS, what does the final letter S conventionally indicate?",
    canonicalAnswer: "Secure",
    distractors: ["Search", "Server", "Storage"],
    explanation: "HTTPS expands to Hypertext Transfer Protocol Secure. The word ‘Secure’ reflects the use of TLS protection for the HTTP communication channel.",
  }),
  author({
    qlId: "COM-004-QL-009", ordinal: 6, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "Which feature is associated with HTTPS rather than ordinary unprotected HTTP?",
    canonicalAnswer: "TLS-based protection of data exchanged over the Web connection",
    distractors: ["Guaranteed honesty of every website operator", "Automatic classification of all search-engine results", "Physical delivery of Internet connectivity by an ISP"],
    explanation: "HTTPS is associated with TLS-based secure-channel protection. It does not certify the motives of a website operator and is unrelated to providing the physical Internet connection.",
  }),
  author({
    qlId: "COM-004-QL-009", ordinal: 7, surfaceFamily: "MATCHING_REASONING",
    stem: "Which pair is correctly matched for Web communication?",
    canonicalAnswer: "HTTPS — HTTP communication protected by TLS",
    distractors: ["HTTP — guaranteed proof of website legitimacy", "HTTPS — Internet Service Provider", "HTTP — e-mail address format"],
    explanation: "HTTPS is the secure form of HTTP in which TLS protects the communication channel. HTTP/HTTPS are Web protocols, not access providers or e-mail-address structures.",
  }),
  author({
    qlId: "COM-004-QL-009", ordinal: 8, surfaceFamily: "STATEMENT_EVALUATION",
    stem: "Which statement about the security meaning of HTTPS is incorrect?",
    canonicalAnswer: "An HTTPS indicator means the website can never be fraudulent",
    distractors: ["HTTPS can encrypt data while it travels over the connection", "Users should still check that the domain is the one they intended to visit", "HTTPS and website legitimacy are related but not identical questions"],
    explanation: "HTTPS protects the channel, but fraudulent sites can also obtain and use HTTPS certificates. Therefore users must not treat the HTTPS indicator as a complete legitimacy guarantee.",
  }),
  author({
    qlId: "COM-004-QL-009", ordinal: 9, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "A user is about to enter sensitive information on a Web form. Which observation concerns the communication channel rather than proving the business behind the site?",
    canonicalAnswer: "Whether the page is being served over HTTPS",
    distractors: ["Whether the company is legally genuine", "Whether the seller will deliver the promised product", "Whether every claim on the site is factually true"],
    explanation: "HTTPS is evidence about protection of the connection between browser and endpoint. Business legitimacy, fulfillment and truthfulness require separate verification beyond the protocol indicator.",
  }),
  author({
    qlId: "COM-004-QL-009", ordinal: 10, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "Which comparison stays within the correct COM-004 awareness boundary for HTTP and HTTPS?",
    canonicalAnswer: "Compare their Web-use and secure-channel meaning without testing port numbers or protocol-stack internals",
    distractors: ["Memorize transport-layer port tables as the main learner task", "Treat HTTPS as a guarantee that a site is genuine", "Replace the browser/search-engine distinction with network routing theory"],
    explanation: "This QL owns user-facing HTTP-versus-HTTPS awareness. Detailed ports, layers and transport mechanics belong to networking, while site legitimacy must not be inferred solely from HTTPS.",
  }),
  author({
    qlId: "COM-004-QL-009", ordinal: 11, surfaceFamily: "STATEMENT_EVALUATION",
    stem: "Which statement correctly combines the benefits and limits of HTTPS?",
    canonicalAnswer: "It helps protect Web data in transit, but users must still verify that they are dealing with the intended site",
    distractors: ["It makes domain verification unnecessary", "It guarantees that downloaded content is always safe and truthful", "It replaces the need for Internet connectivity"],
    explanation: "HTTPS improves confidentiality and integrity of the Web connection, but it does not remove the need to confirm the intended destination or exercise normal judgment about content and requests.",
  }),
  author({
    qlId: "COM-004-QL-009", ordinal: 12, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "Two sites both use HTTPS, but one has a misleading domain that imitates a bank. What should a computer-awareness learner conclude?",
    canonicalAnswer: "HTTPS protects both connections, but the misleading domain can still indicate a deceptive site",
    distractors: ["Both sites must be equally legitimate because they use HTTPS", "The misleading domain becomes irrelevant once HTTPS appears", "HTTPS prevents any site from imitating another brand"],
    explanation: "Secure transport and legitimate identity are separate concerns. HTTPS can protect a connection to a deceptive endpoint, which is why the intended domain still matters.",
  }),
];

const ql010: Com004EnglishWave3QuestionV1[] = [
  author({
    qlId: "COM-004-QL-010", ordinal: 1, surfaceFamily: "DIRECT_RECALL",
    stem: "ARPANET, an important precursor in the history of computer networking, was developed under which U.S. research agency?",
    canonicalAnswer: "ARPA",
    distractors: ["CERN", "W3C", "ICANN"],
    explanation: "ARPANET was developed under the U.S. Advanced Research Projects Agency, commonly abbreviated ARPA. It is historically important as a precursor network rather than simply another name for today's Internet.",
  }),
  author({
    qlId: "COM-004-QL-010", ordinal: 2, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "Which statement gives the most accurate basic relationship between ARPANET and the modern Internet?",
    canonicalAnswer: "ARPANET was an important precursor network that contributed to the development of Internet networking",
    distractors: ["ARPANET is exactly the same worldwide Internet that exists today", "ARPANET was a web browser created after the World Wide Web", "ARPANET was an e-mail field used for hidden recipients"],
    explanation: "ARPANET is historically significant in the evolution of packet-switched networking and the Internet. It should be described as a precursor, not equated simplistically with the modern global Internet.",
  }),
  author({
    qlId: "COM-004-QL-010", ordinal: 3, surfaceFamily: "DIRECT_RECALL",
    stem: "Who is most closely associated with the invention and early development of the World Wide Web?",
    canonicalAnswer: "Tim Berners-Lee",
    distractors: ["Ray Tomlinson", "Charles Babbage", "Dennis Ritchie"],
    explanation: "Tim Berners-Lee is credited with inventing the World Wide Web and developing its foundational Web concepts while working at CERN. This association concerns the Web, not the invention of the entire Internet.",
  }),
  author({
    qlId: "COM-004-QL-010", ordinal: 4, surfaceFamily: "DIRECT_RECALL",
    stem: "Ray Tomlinson is historically associated with which development in computer communication?",
    canonicalAnswer: "Early network e-mail and the use of @ in e-mail addressing",
    distractors: ["Inventing the World Wide Web", "Creating the first web browser company", "Developing every protocol used by the Internet"],
    explanation: "Ray Tomlinson is widely credited with pioneering networked e-mail on ARPANET and popularizing the use of the @ symbol to separate user and host information in addressing.",
  }),
  author({
    qlId: "COM-004-QL-010", ordinal: 5, surfaceFamily: "MATCHING_REASONING",
    stem: "Which historical association is correctly matched?",
    canonicalAnswer: "Tim Berners-Lee — World Wide Web",
    distractors: ["Ray Tomlinson — invention of the entire Internet", "ARPA — e-mail Bcc field", "ARPANET — modern web browser"],
    explanation: "Tim Berners-Lee is associated with the World Wide Web. Ray Tomlinson is associated with early network e-mail, and ARPANET was a precursor network developed under ARPA.",
  }),
  author({
    qlId: "COM-004-QL-010", ordinal: 6, surfaceFamily: "MATCHING_REASONING",
    stem: "Which pair is correctly matched in the history of Internet and e-mail technologies?",
    canonicalAnswer: "Ray Tomlinson — early network e-mail",
    distractors: ["Tim Berners-Lee — ARPANET agency", "ARPA — inventor of the @ symbol", "ARPANET — World Wide Web homepage"],
    explanation: "Ray Tomlinson's name is associated with early networked e-mail. Tim Berners-Lee is associated with the Web, while ARPA sponsored the development of ARPANET.",
  }),
  author({
    qlId: "COM-004-QL-010", ordinal: 7, surfaceFamily: "STATEMENT_EVALUATION",
    stem: "Consider the statements: (1) Tim Berners-Lee is associated with the World Wide Web. (2) Ray Tomlinson is associated with early network e-mail. Which option is correct?",
    canonicalAnswer: "Both statements are correct",
    distractors: ["Only statement 1 is correct", "Only statement 2 is correct", "Neither statement is correct"],
    explanation: "Both are stable historical associations commonly tested in computer awareness: Berners-Lee with the Web and Tomlinson with early networked e-mail.",
  }),
  author({
    qlId: "COM-004-QL-010", ordinal: 8, surfaceFamily: "STATEMENT_EVALUATION",
    stem: "Which historical statement is misleading and should be rejected in an exam-quality computer-awareness corpus?",
    canonicalAnswer: "One person single-handedly invented the entire modern Internet",
    distractors: ["ARPANET was an important precursor network", "Tim Berners-Lee is associated with the World Wide Web", "Ray Tomlinson is associated with early network e-mail"],
    explanation: "The Internet emerged through many technologies, standards, networks and contributors. Reducing its entire invention to one person is historically misleading, unlike the narrower Web and e-mail associations listed.",
  }),
  author({
    qlId: "COM-004-QL-010", ordinal: 9, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "Which association belongs specifically to Web history rather than to the history of e-mail?",
    canonicalAnswer: "Tim Berners-Lee",
    distractors: ["Ray Tomlinson", "Bcc recipient field", "SMTP mail transfer"],
    explanation: "Tim Berners-Lee is the historical figure associated with the World Wide Web. Ray Tomlinson is associated with early network e-mail, while Bcc and SMTP are e-mail concepts rather than Web-history identities.",
  }),
  author({
    qlId: "COM-004-QL-010", ordinal: 10, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "Which association belongs specifically to early network e-mail history rather than to the invention of the World Wide Web?",
    canonicalAnswer: "Ray Tomlinson",
    distractors: ["Tim Berners-Lee", "CERN Web proposal", "Hypertext Web resource"],
    explanation: "Ray Tomlinson is associated with early network e-mail. Tim Berners-Lee and CERN are strongly associated with the development of the World Wide Web.",
  }),
  author({
    qlId: "COM-004-QL-010", ordinal: 11, surfaceFamily: "STATEMENT_EVALUATION",
    stem: "Which statement correctly preserves the distinction between Internet history and Web history?",
    canonicalAnswer: "ARPANET is a precursor in Internet networking history, while Tim Berners-Lee is associated with the World Wide Web",
    distractors: ["ARPANET and the World Wide Web are two names for the same invention", "Tim Berners-Lee created ARPANET under ARPA", "Ray Tomlinson invented the entire Internet and the Web"],
    explanation: "ARPANET belongs to the history of network evolution leading toward the Internet, while Tim Berners-Lee's key association is the World Wide Web. The histories are related but not identical.",
  }),
  author({
    qlId: "COM-004-QL-010", ordinal: 12, surfaceFamily: "MATCHING_REASONING",
    stem: "Which three-way matching set is historically sound at computer-awareness depth?",
    canonicalAnswer: "ARPA — ARPANET; Tim Berners-Lee — Web; Ray Tomlinson — network e-mail",
    distractors: ["ARPA — browser; Tim Berners-Lee — Bcc; Ray Tomlinson — ISP", "ARPA — homepage; Tim Berners-Lee — domain registry; Ray Tomlinson — HTTPS", "ARPA — search engine; Tim Berners-Lee — upload; Ray Tomlinson — cache"],
    explanation: "The three correct associations cover distinct historical roles: ARPA sponsored ARPANET, Berners-Lee developed the World Wide Web, and Tomlinson pioneered network e-mail.",
  }),
];

const ql011: Com004EnglishWave3QuestionV1[] = [
  author({
    qlId: "COM-004-QL-011", ordinal: 1, surfaceFamily: "DIRECT_RECALL",
    stem: "Which symbol conventionally separates the local part of an e-mail address from its domain part?",
    canonicalAnswer: "@",
    distractors: ["#", "&", "%"],
    explanation: "In a conventional e-mail address, the @ symbol separates the local part from the domain part, as in `user@example.org`.",
  }),
  author({
    qlId: "COM-004-QL-011", ordinal: 2, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "In the e-mail address `candidate@example.org`, which text is the local part?",
    canonicalAnswer: "candidate",
    distractors: ["example.org", "@example.org", ".org only"],
    explanation: "The local part appears before the @ separator, so `candidate` is the local part. `example.org` is the domain portion of this address.",
  }),
  author({
    qlId: "COM-004-QL-011", ordinal: 3, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "In the e-mail address `candidate@example.org`, which text is the domain part?",
    canonicalAnswer: "example.org",
    distractors: ["candidate", "candidate@", "@ only"],
    explanation: "The domain portion appears after the @ separator. In the sample address, `example.org` is therefore the domain part.",
  }),
  author({
    qlId: "COM-004-QL-011", ordinal: 4, surfaceFamily: "DIRECT_RECALL",
    stem: "Which description best defines e-mail in basic Internet-service terminology?",
    canonicalAnswer: "A service for exchanging electronic messages between addressed mailboxes/users",
    distractors: ["A browser control for reloading a web page", "A domain suffix that proves organizational identity", "The physical cable that connects every user to the Internet"],
    explanation: "E-mail is an Internet-enabled messaging service built around addressed messages and mailboxes/accounts. It is separate from browser controls, domain suffixes and physical connectivity.",
  }),
  author({
    qlId: "COM-004-QL-011", ordinal: 5, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "Which statement correctly distinguishes webmail from an installed mail client?",
    canonicalAnswer: "Webmail is accessed through a Web interface, while a mail client is an application used to access and manage mail",
    distractors: ["Webmail is an ISP and a mail client is a domain suffix", "Webmail can never access the same account as a mail client", "A mail client is another name for an e-mail address's @ symbol"],
    explanation: "Webmail presents the mailbox through a browser-accessed Web interface. A mail client is an application that can connect to mail services and manage messages; the access forms are different, not mutually exclusive accounts.",
  }),
  author({
    qlId: "COM-004-QL-011", ordinal: 6, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "A user opens a browser, signs in to a mail website and reads messages without installing a dedicated mail application. Which access form is being used?",
    canonicalAnswer: "Webmail",
    distractors: ["Browser cache", "Internet Service Provider", "Domain registry"],
    explanation: "Accessing a mailbox through a browser-based Web interface is webmail. The browser displays the service, while the e-mail account and mailbox remain the underlying messaging resources.",
  }),
  author({
    qlId: "COM-004-QL-011", ordinal: 7, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "A user configures a dedicated desktop application to read and organize messages from an e-mail account. What is that application best classified as?",
    canonicalAnswer: "Mail client",
    distractors: ["Search engine", "Internet Service Provider", "Top-level domain"],
    explanation: "A dedicated application used to connect to and manage an e-mail account is a mail client. It differs from a browser-based webmail interface even though both may access the same mailbox service.",
  }),
  author({
    qlId: "COM-004-QL-011", ordinal: 8, surfaceFamily: "STATEMENT_EVALUATION",
    stem: "Consider the statements: (1) The @ symbol separates two major parts of an e-mail address. (2) Webmail can be accessed through a browser. Which option is correct?",
    canonicalAnswer: "Both statements are correct",
    distractors: ["Only statement 1 is correct", "Only statement 2 is correct", "Neither statement is correct"],
    explanation: "Both are basic e-mail concepts. The @ symbol separates local and domain parts, while webmail provides browser-based access to a mailbox service.",
  }),
  author({
    qlId: "COM-004-QL-011", ordinal: 9, surfaceFamily: "MATCHING_REASONING",
    stem: "Which pair is correctly matched in e-mail addressing?",
    canonicalAnswer: "Text before @ — local part",
    distractors: ["Text after @ — browser history", "@ symbol — Internet Service Provider", "Domain part — e-mail attachment"],
    explanation: "The text before @ is the local part of a conventional e-mail address. The text after @ is the domain part, while @ is the separator between them.",
  }),
  author({
    qlId: "COM-004-QL-011", ordinal: 10, surfaceFamily: "STATEMENT_EVALUATION",
    stem: "Which statement about e-mail access is incorrect?",
    canonicalAnswer: "An e-mail account can only be accessed through one permanent software form in all circumstances",
    distractors: ["Webmail can expose a mailbox through a browser", "A mail client can be used to manage e-mail", "Different access methods can interact with the same underlying mail service"],
    explanation: "E-mail access is not restricted to one permanent interface. Many services can be reached through webmail and through compatible mail-client applications, depending on the account/service configuration.",
  }),
  author({
    qlId: "COM-004-QL-011", ordinal: 11, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "Which item is part of an e-mail address rather than a message-composition field?",
    canonicalAnswer: "Domain part after @",
    distractors: ["Subject", "Bcc", "Message body"],
    explanation: "The domain part is part of the e-mail address itself. Subject, Bcc and the message body are fields or components used when composing an e-mail message.",
  }),
  author({
    qlId: "COM-004-QL-011", ordinal: 12, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "An address is written as `name@department.example.in`. Which interpretation is correct at basic e-mail-awareness level?",
    canonicalAnswer: "`name` is the local part and `department.example.in` is the domain part",
    distractors: ["`name` is the domain and `example.in` is the browser", "The @ symbol is the message body", "The complete address is a Web browser rather than an e-mail address"],
    explanation: "The @ separator divides the address into local and domain portions. Everything before @ is the local part; the domain portion follows it.",
  }),
];

const ql012: Com004EnglishWave3QuestionV1[] = [
  author({
    qlId: "COM-004-QL-012", ordinal: 1, surfaceFamily: "DIRECT_RECALL",
    stem: "Which e-mail field is normally used for the primary recipient or recipients of a message?",
    canonicalAnswer: "To",
    distractors: ["Cc", "Bcc", "Subject"],
    explanation: "The To field identifies the primary addressed recipient or recipients. Cc sends visible copies, Bcc sends copies while hiding those recipient addresses from other recipients, and Subject states the topic.",
  }),
  author({
    qlId: "COM-004-QL-012", ordinal: 2, surfaceFamily: "DIRECT_RECALL",
    stem: "What is the usual purpose of the Cc field while composing an e-mail?",
    canonicalAnswer: "Send a visible copy to additional recipient(s)",
    distractors: ["Hide every recipient address from all others", "Write the main message text", "Store an attachment on the local disk"],
    explanation: "Cc means carbon copy and is used to include additional recipients whose addresses are normally visible to the other message recipients. It is distinct from Bcc, Subject and body.",
  }),
  author({
    qlId: "COM-004-QL-012", ordinal: 3, surfaceFamily: "DIRECT_RECALL",
    stem: "Which e-mail field allows a sender to copy a recipient without exposing that recipient's address to the other recipients?",
    canonicalAnswer: "Bcc",
    distractors: ["To", "Cc", "Subject"],
    explanation: "Bcc means blind carbon copy. Addresses placed there are withheld from the other message recipients, which distinguishes Bcc from the visible-recipient behavior of To and Cc.",
  }),
  author({
    qlId: "COM-004-QL-012", ordinal: 4, surfaceFamily: "DIRECT_RECALL",
    stem: "Which e-mail field is intended to give a short description of the topic or purpose of the message?",
    canonicalAnswer: "Subject",
    distractors: ["Bcc", "To", "Attachment"],
    explanation: "The Subject field summarizes the topic or purpose of an e-mail. The detailed communication belongs in the message body, while To/Bcc concern recipients.",
  }),
  author({
    qlId: "COM-004-QL-012", ordinal: 5, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "Which part of an e-mail contains the main written content that the sender wants the recipients to read?",
    canonicalAnswer: "Message body",
    distractors: ["Subject line", "Bcc field", "Domain suffix"],
    explanation: "The message body contains the substantive written content. The Subject is a brief topic line, Bcc manages hidden-copy recipients, and a domain suffix belongs to addressing rather than message content.",
  }),
  author({
    qlId: "COM-004-QL-012", ordinal: 6, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "A manager wants a colleague to receive a copy of an e-mail and wants that colleague's address visible to the other recipients. Which field is most appropriate?",
    canonicalAnswer: "Cc",
    distractors: ["Bcc", "Subject", "Message body"],
    explanation: "Cc is appropriate for an additional visible-copy recipient. Bcc would conceal that copied recipient's address from other recipients instead.",
  }),
  author({
    qlId: "COM-004-QL-012", ordinal: 7, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "A sender must copy a supervisor on a message but does not want the other recipients to see the supervisor's address. Which field should be used?",
    canonicalAnswer: "Bcc",
    distractors: ["Cc", "To", "Subject"],
    explanation: "Bcc is designed for a blind copy: the Bcc recipient receives the message, while that address is not exposed to the other recipients.",
  }),
  author({
    qlId: "COM-004-QL-012", ordinal: 8, surfaceFamily: "STATEMENT_EVALUATION",
    stem: "Consider the statements: (1) Cc recipients are generally visible to other recipients. (2) Bcc is used when a copied recipient's address should be hidden from other recipients. Which option is correct?",
    canonicalAnswer: "Both statements are correct",
    distractors: ["Only statement 1 is correct", "Only statement 2 is correct", "Neither statement is correct"],
    explanation: "Cc and Bcc both allow copies, but their visibility differs. Cc addresses are normally visible, whereas Bcc hides those recipient addresses from other recipients.",
  }),
  author({
    qlId: "COM-004-QL-012", ordinal: 9, surfaceFamily: "MATCHING_REASONING",
    stem: "Which e-mail field-to-purpose pair is correctly matched?",
    canonicalAnswer: "Subject — brief indication of the message topic",
    distractors: ["Bcc — main written message content", "To — hidden copy that no recipient can see", "Body — domain part of the recipient's address"],
    explanation: "Subject provides the topic line for the e-mail. The body contains the detailed content, To addresses primary recipients, and Bcc handles hidden-copy recipients.",
  }),
  author({
    qlId: "COM-004-QL-012", ordinal: 10, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "Which comparison between Subject and message body is accurate?",
    canonicalAnswer: "Subject summarizes the topic; the body contains the main message content",
    distractors: ["Subject contains hidden recipients; the body supplies Internet access", "Subject is the domain name; the body is the @ separator", "Subject and body are always identical fields"],
    explanation: "Subject and body serve different content roles: the subject line is a concise topic indicator, while the body carries the detailed message.",
  }),
  author({
    qlId: "COM-004-QL-012", ordinal: 11, surfaceFamily: "STATEMENT_EVALUATION",
    stem: "Which statement about recipient fields is incorrect?",
    canonicalAnswer: "Bcc is used when every other recipient must be able to see the copied address",
    distractors: ["To is used for primary addressed recipients", "Cc can include additional visible recipients", "Bcc can conceal copied-recipient addresses from other recipients"],
    explanation: "Bcc does the opposite of exposing a copied recipient's address; it hides that address from the other message recipients. To and Cc provide the visible addressing roles described.",
  }),
  author({
    qlId: "COM-004-QL-012", ordinal: 12, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "An e-mail draft has a recipient address, a short line reading ‘Meeting schedule’, and several paragraphs of details. Which mapping is correct?",
    canonicalAnswer: "Recipient address — To; ‘Meeting schedule’ — Subject; paragraphs — message body",
    distractors: ["Recipient address — Subject; ‘Meeting schedule’ — Bcc; paragraphs — To", "Recipient address — body; ‘Meeting schedule’ — To; paragraphs — domain", "Recipient address — cache; ‘Meeting schedule’ — browser; paragraphs — ISP"],
    explanation: "The To field carries the primary recipient address, Subject carries the short topic line, and the message body contains the detailed paragraphs.",
  }),
];

export const COM004_ENGLISH_PRODUCTION_WAVE3_V1: Com004EnglishWave3QuestionV1[] = Object.freeze([
  ...ql009,
  ...ql010,
  ...ql011,
  ...ql012,
]) as unknown as Com004EnglishWave3QuestionV1[];

export const COM004_ENGLISH_PRODUCTION_WAVE3_AUTHORITY_V1 = Object.freeze({
  authorityId: "COM-004-ENGLISH-PRODUCTION-WAVE3-V1" as const,
  chapterCode: "COM-004" as const,
  status: "REVIEW_CANDIDATE_NOT_FROZEN" as const,
  permanentQlIds: Object.freeze(["COM-004-QL-009", "COM-004-QL-010", "COM-004-QL-011", "COM-004-QL-012"] as const),
  questionCount: COM004_ENGLISH_PRODUCTION_WAVE3_V1.length,
  questionsPerQl: 12,
  governance: Object.freeze({
    englishFreezeAuthorized: false,
    localizationAuthorized: false,
    difficultyAuthorityAuthorized: false,
    questionStudioRuntimeAuthorized: false,
    questionBankWritesAuthorized: false,
    testEligibilityAuthorized: false,
    mockTestEligibilityAuthorized: false,
    automaticPublicationAuthorized: false,
    publicPublicationAuthorized: false,
    productionReleased: false,
  }),
  nextGate: "COM004_ENGLISH_PRODUCTION_WAVE3_EDITORIAL_AUDIT" as const,
});
