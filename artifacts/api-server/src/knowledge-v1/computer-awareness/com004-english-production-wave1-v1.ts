import { deterministicIndex } from "../deterministic";
import {
  COM004_PERMANENT_QL_ALLOCATIONS_V1,
  auditCom004PermanentQlAllocationV1,
  type Com004PermanentQlId,
} from "./com004-permanent-ql-allocation-v1";

export type Com004EnglishSurfaceFamily =
  | "DIRECT_RECALL"
  | "CONCEPT_DISCRIMINATION"
  | "SCENARIO_APPLICATION"
  | "STATEMENT_EVALUATION";

export type Com004EnglishQuestionV1 = {
  questionId: string;
  qlId: Com004PermanentQlId;
  authorityProposalId: string;
  sourceCandidateIds: string[];
  surfaceFamily: Com004EnglishSurfaceFamily;
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
  surfaceFamily: Com004EnglishSurfaceFamily;
  stem: string;
  canonicalAnswer: string;
  distractors: [string, string, string];
  explanation: string;
};

const allocationAudit = auditCom004PermanentQlAllocationV1();
if (!allocationAudit.valid) {
  throw new Error(`COM-004 English Wave 1 cannot bind invalid permanent QLs: ${allocationAudit.issues.join(", ")}`);
}

const allocationByQl = new Map(COM004_PERMANENT_QL_ALLOCATIONS_V1.map((allocation) => [allocation.permanentQlId, allocation]));

function author(input: AuthoringInput): Com004EnglishQuestionV1 {
  const allocation = allocationByQl.get(input.qlId);
  if (!allocation) throw new Error(`Unknown COM-004 permanent QL ${input.qlId}`);

  const canonicalAnswer = input.canonicalAnswer.trim();
  const distractors = input.distractors.map((value) => value.trim());
  const uniqueChoices = new Set([canonicalAnswer.toLowerCase(), ...distractors.map((value) => value.toLowerCase())]);
  if (uniqueChoices.size !== 4) throw new Error(`${input.qlId}/${input.ordinal}: options must be semantically distinct`);

  const correctIndex = deterministicIndex(`COM004:EN:W1:${input.qlId}:${input.ordinal}:answer-position`, 4);
  const options = [...distractors];
  options.splice(correctIndex, 0, canonicalAnswer);

  return {
    questionId: `COM004-EN-W1-${input.qlId.slice(-3)}-${String(input.ordinal).padStart(2, "0")}`,
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

const ql001: Com004EnglishQuestionV1[] = [
  author({
    qlId: "COM-004-QL-001", ordinal: 1, surfaceFamily: "DIRECT_RECALL",
    stem: "In basic computer awareness, the expression ‘network of networks’ refers to which of the following?",
    canonicalAnswer: "Internet",
    distractors: ["World Wide Web", "Intranet", "Web browser"],
    explanation: "The Internet interconnects many independent computer networks across the world. The World Wide Web is a service that operates over this wider network infrastructure.",
  }),
  author({
    qlId: "COM-004-QL-001", ordinal: 2, surfaceFamily: "DIRECT_RECALL",
    stem: "What is the full form of ISP in the context of Internet access?",
    canonicalAnswer: "Internet Service Provider",
    distractors: ["Internet System Protocol", "Integrated Service Portal", "Internal Server Provider"],
    explanation: "ISP stands for Internet Service Provider. It is an organization that provides users or organizations with access to the Internet and may offer related connectivity services.",
  }),
  author({
    qlId: "COM-004-QL-001", ordinal: 3, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "A household pays a company for a connection that lets its devices access the Internet. What role is that company performing?",
    canonicalAnswer: "Internet Service Provider",
    distractors: ["Search engine", "Web browser", "Website host page"],
    explanation: "The company is providing Internet access to the household, which is the user-facing role of an Internet Service Provider. A browser or search engine helps users work on the Web after access is available.",
  }),
  author({
    qlId: "COM-004-QL-001", ordinal: 4, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "Which option correctly describes the Internet rather than a particular service running on it?",
    canonicalAnswer: "A global system of interconnected computer networks",
    distractors: ["A collection of only public web pages", "A program used to open websites", "A service used only for electronic mail"],
    explanation: "The Internet is the underlying global network of interconnected networks. Web pages, e-mail and other services use that infrastructure, while a browser is an application used to access Web content.",
  }),
  author({
    qlId: "COM-004-QL-001", ordinal: 5, surfaceFamily: "STATEMENT_EVALUATION",
    stem: "Which statement about an Internet Service Provider is correct?",
    canonicalAnswer: "It provides users with access to the Internet",
    distractors: ["It is another name for the World Wide Web", "It is the software that displays every web page", "It owns and controls the entire Internet"],
    explanation: "An ISP supplies Internet access to customers. It does not own the global Internet, and it should not be confused with either the Web or the browser software used on a device.",
  }),
  author({
    qlId: "COM-004-QL-001", ordinal: 6, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "Before a user can browse websites or send Internet e-mail from home, a service company supplies Internet connectivity. Which term best identifies that company?",
    canonicalAnswer: "ISP",
    distractors: ["URL", "WWW", "HTTP"],
    explanation: "The access company is an ISP. URL identifies a resource address, WWW refers to the Web, and HTTP is a Web communication protocol; none of those denotes the access provider.",
  }),
  author({
    qlId: "COM-004-QL-001", ordinal: 7, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "Which pair is correctly matched?",
    canonicalAnswer: "ISP — provides Internet access to users",
    distractors: ["Internet — a single website", "ISP — a web-search service", "Internet — a browser installed on a computer"],
    explanation: "An Internet Service Provider supplies Internet access. The Internet itself is a worldwide interconnection of networks, not one website, one browser or one search service.",
  }),
  author({
    qlId: "COM-004-QL-001", ordinal: 8, surfaceFamily: "STATEMENT_EVALUATION",
    stem: "Consider the statements: (1) The Internet connects many networks. (2) An ISP is an organization that can provide Internet access. Which option is correct?",
    canonicalAnswer: "Both statements are correct",
    distractors: ["Only statement 1 is correct", "Only statement 2 is correct", "Neither statement is correct"],
    explanation: "Both statements describe stable, basic concepts: the Internet is a network of interconnected networks, and an ISP provides customers with access to that Internet infrastructure.",
  }),
  author({
    qlId: "COM-004-QL-001", ordinal: 9, surfaceFamily: "DIRECT_RECALL",
    stem: "Which term denotes the worldwide communication infrastructure that links large numbers of separate computer networks?",
    canonicalAnswer: "Internet",
    distractors: ["Homepage", "Search engine", "Hyperlink"],
    explanation: "Internet is the term for the worldwide interconnected network infrastructure. A homepage is a web-page role, a search engine retrieves indexed information, and a hyperlink connects resources for navigation.",
  }),
  author({
    qlId: "COM-004-QL-001", ordinal: 10, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "Which of the following is NOT an appropriate description of an ISP?",
    canonicalAnswer: "The global network formed by all interconnected networks",
    distractors: ["A provider of Internet access", "An organization serving Internet connectivity to customers", "A company from which a user may obtain Internet service"],
    explanation: "The global network of interconnected networks is the Internet itself. An ISP is a provider through which a customer obtains access to that wider network.",
  }),
  author({
    qlId: "COM-004-QL-001", ordinal: 11, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "Ravi can use a browser on his laptop, but the laptop has no Internet connection. Which service is fundamentally missing for online access?",
    canonicalAnswer: "Internet access from a service provider",
    distractors: ["A different homepage", "A search-engine account", "A new hyperlink"],
    explanation: "A browser alone does not create Internet connectivity. The device needs Internet access, commonly obtained through an Internet Service Provider, before online Web services can be reached.",
  }),
  author({
    qlId: "COM-004-QL-001", ordinal: 12, surfaceFamily: "STATEMENT_EVALUATION",
    stem: "Which statement best avoids confusing the Internet with the company that gives a customer access to it?",
    canonicalAnswer: "The Internet is the interconnected network; the ISP is the access provider",
    distractors: ["The Internet and an ISP are the same thing", "An ISP is another name for a website", "The Internet is software supplied by every ISP"],
    explanation: "The concepts have different roles. The Internet is the global interconnected network, while an ISP is an organization that provides a customer with access to that network.",
  }),
];

const ql002: Com004EnglishQuestionV1[] = [
  author({
    qlId: "COM-004-QL-002", ordinal: 1, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "Which statement correctly distinguishes the World Wide Web from the Internet?",
    canonicalAnswer: "The Web is a system of interlinked resources accessed over the Internet",
    distractors: ["The Web is the physical network and the Internet is one website", "The Web and the Internet are identical terms", "The Web is limited to electronic mail while the Internet is limited to browsing"],
    explanation: "The Internet is the underlying network infrastructure. The World Wide Web is a system of interlinked pages and resources that users access over that Internet infrastructure.",
  }),
  author({
    qlId: "COM-004-QL-002", ordinal: 2, surfaceFamily: "DIRECT_RECALL",
    stem: "The World Wide Web is best described as which of the following?",
    canonicalAnswer: "An Internet-based system of interlinked web resources",
    distractors: ["The complete global network infrastructure itself", "A company that provides Internet connectivity", "A protocol used only to send e-mail"],
    explanation: "The Web consists of interlinked Web resources made accessible through Internet technologies. It uses the Internet but is not synonymous with the Internet itself.",
  }),
  author({
    qlId: "COM-004-QL-002", ordinal: 3, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "A user sends an e-mail over the Internet without opening any website. What does this example show?",
    canonicalAnswer: "The Internet supports services other than the World Wide Web",
    distractors: ["E-mail and the World Wide Web are the same service", "The Internet exists only when a browser is open", "Every Internet activity must be a web page"],
    explanation: "E-mail is an Internet service but need not be the World Wide Web. The example demonstrates why the Internet is broader than the Web and can carry multiple kinds of services.",
  }),
  author({
    qlId: "COM-004-QL-002", ordinal: 4, surfaceFamily: "STATEMENT_EVALUATION",
    stem: "Consider the statements: (1) The Web uses Internet infrastructure. (2) The terms Web and Internet always mean exactly the same thing. Which option is correct?",
    canonicalAnswer: "Only statement 1 is correct",
    distractors: ["Only statement 2 is correct", "Both statements are correct", "Neither statement is correct"],
    explanation: "The Web operates over Internet infrastructure, so statement 1 is correct. Statement 2 is incorrect because the Internet is the broader network and the Web is one major service built on it.",
  }),
  author({
    qlId: "COM-004-QL-002", ordinal: 5, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "Which item belongs specifically to the World Wide Web rather than defining the Internet as a whole?",
    canonicalAnswer: "Interlinked web pages",
    distractors: ["A worldwide interconnection of computer networks", "Internet connectivity supplied by an ISP", "The overall infrastructure carrying many Internet services"],
    explanation: "Interlinked web pages are characteristic resources of the World Wide Web. The other choices describe the broader Internet infrastructure or access to it.",
  }),
  author({
    qlId: "COM-004-QL-002", ordinal: 6, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "Meena opens a browser and follows links from one public page to another. Which Internet service is she primarily using?",
    canonicalAnswer: "World Wide Web",
    distractors: ["Internet Service Provider", "E-mail transport", "Local file system"],
    explanation: "Following links among web pages is a characteristic World Wide Web activity. The Web is being used through the Internet connection; the ISP only provides access.",
  }),
  author({
    qlId: "COM-004-QL-002", ordinal: 7, surfaceFamily: "DIRECT_RECALL",
    stem: "Which is the broader concept in basic computer awareness?",
    canonicalAnswer: "Internet",
    distractors: ["World Wide Web", "Web page", "Homepage"],
    explanation: "The Internet is broader because it is the network infrastructure on which many services operate. The World Wide Web, individual web pages and homepages are Web-related concepts within that broader environment.",
  }),
  author({
    qlId: "COM-004-QL-002", ordinal: 8, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "Which comparison is accurate?",
    canonicalAnswer: "Internet: network infrastructure; Web: interlinked resources accessed through that infrastructure",
    distractors: ["Internet: one browser; Web: one search engine", "Internet: only e-mail; Web: only file transfer", "Internet: one website; Web: the company providing connectivity"],
    explanation: "The comparison separates infrastructure from service. The Internet connects networks, whereas the Web organizes interlinked resources that are accessed using Internet connectivity.",
  }),
  author({
    qlId: "COM-004-QL-002", ordinal: 9, surfaceFamily: "STATEMENT_EVALUATION",
    stem: "Which statement is incorrect?",
    canonicalAnswer: "Every use of the Internet is necessarily use of the World Wide Web",
    distractors: ["The Web depends on Internet connectivity", "The Internet can carry e-mail as well as Web traffic", "Web pages are resources associated with the World Wide Web"],
    explanation: "Internet use is not limited to the Web; e-mail and other services also use Internet infrastructure. The remaining statements preserve the distinction between the Internet and the Web.",
  }),
  author({
    qlId: "COM-004-QL-002", ordinal: 10, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "A computer is connected to the Internet, but a particular website is unavailable. Which conclusion is most reasonable?",
    canonicalAnswer: "Internet connectivity and access to one Web resource are different issues",
    distractors: ["The Internet and that website must be the same system", "The computer cannot use any non-Web Internet service", "An ISP is another term for that website"],
    explanation: "A single Web resource may be unavailable while the underlying Internet connection still works. This distinction is another practical illustration that a website or even the Web is not identical to the Internet itself.",
  }),
  author({
    qlId: "COM-004-QL-002", ordinal: 11, surfaceFamily: "DIRECT_RECALL",
    stem: "A system of linked public pages that users navigate through browsers is most closely associated with which term?",
    canonicalAnswer: "World Wide Web",
    distractors: ["Internet Service Provider", "Internet infrastructure", "E-mail mailbox"],
    explanation: "The World Wide Web is the linked-resource environment in which users navigate web pages. It operates using Internet infrastructure but remains a distinct concept.",
  }),
  author({
    qlId: "COM-004-QL-002", ordinal: 12, surfaceFamily: "STATEMENT_EVALUATION",
    stem: "Which statement gives the most technically sound exam-level relationship between the Web and the Internet?",
    canonicalAnswer: "The Web uses the Internet; it is not another name for the entire Internet",
    distractors: ["The Internet is a single page inside the Web", "The Web provides physical connectivity to every Internet user", "The two terms can always be substituted without changing meaning"],
    explanation: "The Web relies on Internet connectivity to deliver linked resources. Calling the Web and the Internet identical erases the important distinction between a service and the underlying network infrastructure.",
  }),
];

const ql003: Com004EnglishQuestionV1[] = [
  author({
    qlId: "COM-004-QL-003", ordinal: 1, surfaceFamily: "DIRECT_RECALL",
    stem: "A collection of related web pages presented together under a common site is called a what?",
    canonicalAnswer: "Website",
    distractors: ["Homepage", "Hyperlink", "Web browser"],
    explanation: "A website is a collection of related web pages associated with a common site. A homepage is generally the main or starting page within such a site.",
  }),
  author({
    qlId: "COM-004-QL-003", ordinal: 2, surfaceFamily: "DIRECT_RECALL",
    stem: "What is a web page?",
    canonicalAnswer: "An individual document or resource on the World Wide Web",
    distractors: ["A collection of all sites on the Internet", "The company that supplies Internet access", "A program used to search every local file"],
    explanation: "A web page is an individual Web resource or document that can be displayed in a browser. Multiple related pages can form a website.",
  }),
  author({
    qlId: "COM-004-QL-003", ordinal: 3, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "Which term normally refers to the main or starting page of a website?",
    canonicalAnswer: "Homepage",
    distractors: ["Hyperlink", "Search engine", "Internet Service Provider"],
    explanation: "Homepage is the conventional exam-level term for a website's principal or starting page. It is a page within a website, not a link or Internet-access provider.",
  }),
  author({
    qlId: "COM-004-QL-003", ordinal: 4, surfaceFamily: "DIRECT_RECALL",
    stem: "A clickable element that takes the user to another linked web resource is known as a what?",
    canonicalAnswer: "Hyperlink",
    distractors: ["Homepage", "Website", "Browser cache"],
    explanation: "A hyperlink is a navigational connection from one Web location or resource to another. Activating it causes the browser to follow the link target.",
  }),
  author({
    qlId: "COM-004-QL-003", ordinal: 5, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "A news portal contains separate pages for national news, sports and business under the same site. What is the complete collection best called?",
    canonicalAnswer: "Website",
    distractors: ["One web page", "One hyperlink", "One browser"],
    explanation: "The portal as a whole is a website because it groups multiple related web pages. Each section page is an individual page within that larger site.",
  }),
  author({
    qlId: "COM-004-QL-003", ordinal: 6, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "On a college website, clicking the text ‘Admissions’ opens the admissions page. In this action, the clickable text functions as a what?",
    canonicalAnswer: "Hyperlink",
    distractors: ["Homepage", "Website", "Internet Service Provider"],
    explanation: "The clickable text is functioning as a hyperlink because it points to and opens another resource. The destination may be another page in the same website.",
  }),
  author({
    qlId: "COM-004-QL-003", ordinal: 7, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "Which pair is correctly distinguished?",
    canonicalAnswer: "Web page — individual Web resource; website — collection of related web pages",
    distractors: ["Web page — Internet provider; website — browser", "Web page — collection of all sites; website — one clickable link", "Web page — search engine; website — e-mail protocol"],
    explanation: "A web page is an individual Web resource, while a website is a collection of related pages. Keeping those levels separate prevents the common page-versus-site confusion.",
  }),
  author({
    qlId: "COM-004-QL-003", ordinal: 8, surfaceFamily: "STATEMENT_EVALUATION",
    stem: "Consider the statements: (1) A homepage is generally a web page within a website. (2) Every web page is itself a complete website. Which option is correct?",
    canonicalAnswer: "Only statement 1 is correct",
    distractors: ["Only statement 2 is correct", "Both statements are correct", "Neither statement is correct"],
    explanation: "A homepage is normally a page serving as the principal entry point of a site. An individual web page does not automatically constitute an entire website, so statement 2 is false.",
  }),
  author({
    qlId: "COM-004-QL-003", ordinal: 9, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "A browser displays one article at a specific Web address. What is the displayed article most directly classified as?",
    canonicalAnswer: "Web page",
    distractors: ["Entire Internet", "Internet Service Provider", "Search engine category"],
    explanation: "The individual article displayed at a Web address is a web page. It may belong to a larger website, but the single displayed resource is not the whole site or Internet.",
  }),
  author({
    qlId: "COM-004-QL-003", ordinal: 10, surfaceFamily: "DIRECT_RECALL",
    stem: "Which Web concept primarily provides navigation from one resource to another?",
    canonicalAnswer: "Hyperlink",
    distractors: ["Homepage", "Website", "Web page collection"],
    explanation: "A hyperlink encodes a navigational link to another resource or location. A homepage, website and page collection describe content structures rather than the link itself.",
  }),
  author({
    qlId: "COM-004-QL-003", ordinal: 11, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "Which statement about a homepage is most appropriate for a basic computer-awareness exam?",
    canonicalAnswer: "It is generally the principal or starting page of a website",
    distractors: ["It is another name for the entire Internet", "It is necessarily the only page a website can contain", "It is the company that provides Internet access"],
    explanation: "Homepage conventionally denotes the principal or starting page of a website. A website can contain many pages, and neither the homepage nor website is an Internet-access provider.",
  }),
  author({
    qlId: "COM-004-QL-003", ordinal: 12, surfaceFamily: "STATEMENT_EVALUATION",
    stem: "Which statement about hyperlinks is correct?",
    canonicalAnswer: "A hyperlink can connect the current resource to another linked resource or location",
    distractors: ["A hyperlink is always the first page of a website", "A hyperlink is the same thing as an Internet connection", "A hyperlink must always point to a different website"],
    explanation: "A hyperlink is a navigational link. Its target may be another location in the same site or a different resource, so it is incorrect to require that every link leave the current website.",
  }),
];

const ql004: Com004EnglishQuestionV1[] = [
  author({
    qlId: "COM-004-QL-004", ordinal: 1, surfaceFamily: "CLASSIFICATION" as Com004EnglishSurfaceFamily,
    stem: "Which of the following is a common user-facing Internet service?",
    canonicalAnswer: "E-mail",
    distractors: ["CPU instruction decoding", "RAM refresh circuitry", "Disk-sector formatting logic"],
    explanation: "E-mail is a standard Internet service used to exchange electronic messages. The other choices describe internal computing or storage operations rather than user-facing Internet services.",
  }),
  author({
    qlId: "COM-004-QL-004", ordinal: 2, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "A group of participants speak and see one another live over an Internet connection. Which service best matches this activity?",
    canonicalAnswer: "Video conferencing",
    distractors: ["Word processing", "Disk defragmentation", "Local print spooling"],
    explanation: "Video conferencing supports real-time audio and video communication between participants over a network such as the Internet. It is distinct from local document or device-management operations.",
  }),
  author({
    qlId: "COM-004-QL-004", ordinal: 3, surfaceFamily: "DIRECT_RECALL",
    stem: "Buying and selling goods or services through online Internet platforms is commonly called what?",
    canonicalAnswer: "E-commerce",
    distractors: ["E-mail attachment", "Browser cache", "File compression"],
    explanation: "E-commerce refers to commercial transactions conducted electronically through online services. It is an Internet-enabled service category, not a browser-storage or file-processing operation.",
  }),
  author({
    qlId: "COM-004-QL-004", ordinal: 4, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "One message sent to a subscribed group is distributed to all members through a shared e-mail distribution mechanism. Which Internet-service concept fits best?",
    canonicalAnswer: "Mailing list",
    distractors: ["Homepage", "Browser history", "Disk partition"],
    explanation: "A mailing list distributes messages to a subscribed group of recipients. It is an e-mail-based Internet service and should not be confused with Web-navigation or local-storage features.",
  }),
  author({
    qlId: "COM-004-QL-004", ordinal: 5, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "Which option is NOT primarily an Internet service classification?",
    canonicalAnswer: "Operating-system process scheduling",
    distractors: ["Electronic mail", "Video conferencing", "Social networking"],
    explanation: "Process scheduling is an operating-system function. E-mail, video conferencing and social networking are all familiar user-facing services that can operate over Internet connectivity.",
  }),
  author({
    qlId: "COM-004-QL-004", ordinal: 6, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "Users exchange typed messages in a shared online conversational space. Which service is being described?",
    canonicalAnswer: "Chat room",
    distractors: ["Spreadsheet calculation", "Device driver", "Boot loader"],
    explanation: "A chat room provides a shared online space for participants to exchange messages. The other options are software or system functions rather than communication services.",
  }),
  author({
    qlId: "COM-004-QL-004", ordinal: 7, surfaceFamily: "STATEMENT_EVALUATION",
    stem: "Which set contains only common Internet services or Internet-enabled user activities?",
    canonicalAnswer: "E-mail, Web browsing, video conferencing",
    distractors: ["CPU scheduling, cache replacement, boot loading", "RAM refresh, disk partitioning, BIOS setup", "Device-driver loading, instruction decoding, memory addressing"],
    explanation: "E-mail, browsing the Web and video conferencing are user-facing activities delivered using Internet connectivity. The other sets consist of internal system, hardware or maintenance operations.",
  }),
  author({
    qlId: "COM-004-QL-004", ordinal: 8, surfaceFamily: "DIRECT_RECALL",
    stem: "Which service allows people to build profiles, connect with other users and share content through an online network?",
    canonicalAnswer: "Social networking",
    distractors: ["Disk formatting", "Memory paging", "Compiler optimization"],
    explanation: "Social networking services support online profiles, connections and content sharing among users. The distractors are computing operations unrelated to this Internet-service category.",
  }),
  author({
    qlId: "COM-004-QL-004", ordinal: 9, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "A student opens linked pages in a browser to read information published online. Which Internet service is primarily involved?",
    canonicalAnswer: "World Wide Web",
    distractors: ["Local printer queue", "CPU scheduler", "Disk partition table"],
    explanation: "Browsing linked online pages is use of the World Wide Web, one of the major services that operates over Internet infrastructure.",
  }),
  author({
    qlId: "COM-004-QL-004", ordinal: 10, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "Which pairing correctly identifies a user activity and its Internet-service category?",
    canonicalAnswer: "Sending an electronic message — e-mail",
    distractors: ["Formatting a local drive — social networking", "Scheduling CPU tasks — Web browsing", "Refreshing RAM cells — video conferencing"],
    explanation: "Sending an electronic message is the core use of e-mail. The remaining pairings incorrectly label local hardware or operating-system operations as Internet services.",
  }),
  author({
    qlId: "COM-004-QL-004", ordinal: 11, surfaceFamily: "STATEMENT_EVALUATION",
    stem: "Consider the statements: (1) E-mail is an Internet service. (2) Video conferencing can be an Internet-enabled communication service. Which option is correct?",
    canonicalAnswer: "Both statements are correct",
    distractors: ["Only statement 1 is correct", "Only statement 2 is correct", "Neither statement is correct"],
    explanation: "Both are established Internet-service examples. E-mail exchanges electronic messages, while video conferencing supports live audio/video communication over network connectivity.",
  }),
  author({
    qlId: "COM-004-QL-004", ordinal: 12, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "An online platform lets a customer select a product, place an order and pay for the purchase. Which broad Internet-service category is illustrated?",
    canonicalAnswer: "E-commerce",
    distractors: ["E-mail protocol", "Browser history", "Operating-system scheduling"],
    explanation: "The activity is an online commercial transaction, so it falls under e-commerce. The other options describe messaging technology, a browser feature or an operating-system function.",
  }),
];

export const COM004_ENGLISH_PRODUCTION_WAVE1_V1: Com004EnglishQuestionV1[] = Object.freeze([
  ...ql001,
  ...ql002,
  ...ql003,
  ...ql004,
]) as unknown as Com004EnglishQuestionV1[];

export const COM004_ENGLISH_PRODUCTION_WAVE1_AUTHORITY_V1 = Object.freeze({
  authorityId: "COM-004-ENGLISH-PRODUCTION-WAVE1-V1" as const,
  chapterCode: "COM-004" as const,
  status: "REVIEW_CANDIDATE_NOT_FROZEN" as const,
  permanentQlIds: Object.freeze(["COM-004-QL-001", "COM-004-QL-002", "COM-004-QL-003", "COM-004-QL-004"] as const),
  questionCount: COM004_ENGLISH_PRODUCTION_WAVE1_V1.length,
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
  nextGate: "COM004_ENGLISH_PRODUCTION_WAVE1_EDITORIAL_AUDIT" as const,
});
