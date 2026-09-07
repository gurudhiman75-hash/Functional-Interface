import { deterministicIndex } from "../deterministic";
import {
  COM004_PERMANENT_QL_ALLOCATIONS_V1,
  auditCom004PermanentQlAllocationV1,
  type Com004PermanentQlId,
} from "./com004-permanent-ql-allocation-v1";

export type Com004EnglishWave2SurfaceFamily =
  | "DIRECT_RECALL"
  | "CONCEPT_DISCRIMINATION"
  | "SCENARIO_APPLICATION"
  | "STATEMENT_EVALUATION"
  | "PROCESS_REASONING";

export type Com004EnglishWave2QuestionV1 = {
  questionId: string;
  qlId: Com004PermanentQlId;
  authorityProposalId: string;
  sourceCandidateIds: string[];
  surfaceFamily: Com004EnglishWave2SurfaceFamily;
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
  surfaceFamily: Com004EnglishWave2SurfaceFamily;
  stem: string;
  canonicalAnswer: string;
  distractors: [string, string, string];
  explanation: string;
};

const allocationAudit = auditCom004PermanentQlAllocationV1();
if (!allocationAudit.valid) {
  throw new Error(`COM-004 English Wave 2 cannot bind invalid permanent QLs: ${allocationAudit.issues.join(", ")}`);
}

const allocationByQl = new Map(COM004_PERMANENT_QL_ALLOCATIONS_V1.map((allocation) => [allocation.permanentQlId, allocation]));

function author(input: AuthoringInput): Com004EnglishWave2QuestionV1 {
  const allocation = allocationByQl.get(input.qlId);
  if (!allocation) throw new Error(`Unknown COM-004 permanent QL ${input.qlId}`);

  const canonicalAnswer = input.canonicalAnswer.trim();
  const distractors = input.distractors.map((value) => value.trim());
  const choices = [canonicalAnswer, ...distractors];
  if (new Set(choices.map((value) => value.toLowerCase())).size !== 4) {
    throw new Error(`${input.qlId}/${input.ordinal}: options must be semantically distinct`);
  }

  const correctIndex = deterministicIndex(`COM004:EN:W2:${input.qlId}:${input.ordinal}:answer-position`, 4);
  const options = [...distractors];
  options.splice(correctIndex, 0, canonicalAnswer);

  return {
    questionId: `COM004-EN-W2-${input.qlId.slice(-3)}-${String(input.ordinal).padStart(2, "0")}`,
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

const ql005: Com004EnglishWave2QuestionV1[] = [
  author({
    qlId: "COM-004-QL-005", ordinal: 1, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "Which statement correctly distinguishes a web browser from a search engine?",
    canonicalAnswer: "A browser displays and navigates Web resources, while a search engine helps find indexed resources",
    distractors: ["A browser supplies Internet connectivity, while a search engine installs network hardware", "A browser and a search engine are two names for the same software category", "A browser only sends e-mail, while a search engine only stores local files"],
    explanation: "A browser is client software used to open and navigate Web resources. A search engine is an online information-retrieval service that accepts queries and returns relevant indexed results.",
  }),
  author({
    qlId: "COM-004-QL-005", ordinal: 2, surfaceFamily: "DIRECT_RECALL",
    stem: "Google Chrome, Mozilla Firefox, Microsoft Edge and Safari are examples of which software category?",
    canonicalAnswer: "Web browsers",
    distractors: ["Search engines", "Internet Service Providers", "E-mail protocols"],
    explanation: "Chrome, Firefox, Edge and Safari are web browsers. They are applications used to access and display Web content; they should not be classified as search engines or Internet-access providers.",
  }),
  author({
    qlId: "COM-004-QL-005", ordinal: 3, surfaceFamily: "DIRECT_RECALL",
    stem: "Google Search and Bing are most appropriately classified as which type of Internet service?",
    canonicalAnswer: "Search engines",
    distractors: ["Web browsers", "Operating systems", "Internet access media"],
    explanation: "Google Search and Bing are search engines: services that accept search queries and return indexed results. A user commonly reaches them through a web browser.",
  }),
  author({
    qlId: "COM-004-QL-005", ordinal: 4, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "A student types keywords about the Punjab river system into an online service and receives a list of relevant pages. Which service is being used?",
    canonicalAnswer: "Search engine",
    distractors: ["Web browser cache", "Internet Service Provider", "E-mail client"],
    explanation: "Entering keywords or a query and receiving a ranked or organized list of indexed resources is the basic search-engine process. The browser may display the service, but it is not itself the search index.",
  }),
  author({
    qlId: "COM-004-QL-005", ordinal: 5, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "A user already knows a website's address and enters it directly in Chrome to open the site. In this action, Chrome is functioning primarily as what?",
    canonicalAnswer: "Web browser",
    distractors: ["Search engine", "Internet Service Provider", "Domain registry"],
    explanation: "Chrome is functioning as the browser that requests and displays the Web resource. Entering a known address directly does not require a search engine to discover the site.",
  }),
  author({
    qlId: "COM-004-QL-005", ordinal: 6, surfaceFamily: "PROCESS_REASONING",
    stem: "Which sequence best represents a basic Web-search activity performed by a user?",
    canonicalAnswer: "Open a browser → access a search engine → enter a query → inspect search results",
    distractors: ["Open a search engine → install an ISP → create a CPU process → inspect RAM", "Enter a query → format the disk → open a browser → replace the operating system", "Open a browser → delete the network → enter a query → create a domain registry"],
    explanation: "A typical search flow starts in a browser, reaches a search-engine service, submits a query and then presents search results. The sequence separates the browser tool from the search service it accesses.",
  }),
  author({
    qlId: "COM-004-QL-005", ordinal: 7, surfaceFamily: "STATEMENT_EVALUATION",
    stem: "Consider the statements: (1) Firefox is a web browser. (2) Bing is a search engine. Which option is correct?",
    canonicalAnswer: "Both statements are correct",
    distractors: ["Only statement 1 is correct", "Only statement 2 is correct", "Neither statement is correct"],
    explanation: "Firefox belongs to the browser category, while Bing belongs to the search-engine category. The distinction is based on function, not on which company provides the product or service.",
  }),
  author({
    qlId: "COM-004-QL-005", ordinal: 8, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "Which pairing incorrectly classifies the named Internet-related product or service?",
    canonicalAnswer: "Safari — search engine",
    distractors: ["Firefox — web browser", "Bing — search engine", "Chrome — web browser"],
    explanation: "Safari is a web browser, not a search engine. Firefox and Chrome are also browsers, whereas Bing is correctly classified as a search-engine service.",
  }),
  author({
    qlId: "COM-004-QL-005", ordinal: 9, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "Priya opens Firefox and then visits a search website to find scholarship information. Which statement best describes the two tools involved?",
    canonicalAnswer: "Firefox is the browser; the visited search service is the search engine",
    distractors: ["Firefox is the ISP; the search service is the browser", "Both tools are necessarily search engines", "Both tools are Internet Service Providers"],
    explanation: "Firefox is the client application used to display Web content. The search website provides the information-retrieval service that accepts Priya's query and returns results.",
  }),
  author({
    qlId: "COM-004-QL-005", ordinal: 10, surfaceFamily: "STATEMENT_EVALUATION",
    stem: "Which statement about search queries and search results is most accurate at basic computer-awareness level?",
    canonicalAnswer: "A query expresses what the user wants to find, and the search engine returns matching or relevant results",
    distractors: ["A query is the physical Internet connection supplied by an ISP", "A search result is always a browser installed on the user's computer", "A query is another name for a website's domain suffix"],
    explanation: "A search query is the text or terms submitted to a search engine. The engine processes that request against its index and presents results that it considers relevant to the query.",
  }),
  author({
    qlId: "COM-004-QL-005", ordinal: 11, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "Which action can be performed by a web browser without first using a search engine?",
    canonicalAnswer: "Opening a known Web address entered directly by the user",
    distractors: ["Providing the user's physical Internet connection", "Replacing the computer's operating system scheduler", "Assigning every domain name its network address"],
    explanation: "If the user already knows a Web address, the browser can request that resource directly. Search engines are useful for discovering resources, but they are not mandatory for every act of Web navigation.",
  }),
  author({
    qlId: "COM-004-QL-005", ordinal: 12, surfaceFamily: "STATEMENT_EVALUATION",
    stem: "Which statement avoids a common browser-versus-search-engine misconception?",
    canonicalAnswer: "A search engine may be accessed through a browser, but the two perform different functions",
    distractors: ["Every browser is automatically the same thing as a search engine", "A search engine is the company that provides all Internet connectivity", "A browser can only display results produced by one particular search provider"],
    explanation: "Browsers and search engines frequently appear together in normal Web use, which causes confusion. Their roles remain distinct: the browser displays/navigates resources, while the search engine helps discover indexed resources.",
  }),
];

const ql006: Com004EnglishWave2QuestionV1[] = [
  author({
    qlId: "COM-004-QL-006", ordinal: 1, surfaceFamily: "DIRECT_RECALL",
    stem: "Which browser control is normally used to request the current web page again from its source or stored state?",
    canonicalAnswer: "Reload or Refresh",
    distractors: ["Bookmark", "Back", "History"],
    explanation: "Reload or Refresh asks the browser to load the current page again. Bookmark saves a reference for later access, Back navigates to a previous page, and History records previously visited resources.",
  }),
  author({
    qlId: "COM-004-QL-006", ordinal: 2, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "A user follows three links and then wants to return to the page viewed immediately before the current one. Which browser control is most appropriate?",
    canonicalAnswer: "Back",
    distractors: ["Reload", "Bookmark", "Forward"],
    explanation: "The Back control moves to an earlier page in the current navigation history. Forward is typically useful after moving back, while Reload simply requests the current page again.",
  }),
  author({
    qlId: "COM-004-QL-006", ordinal: 3, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "After using the Back control, a user decides to return to the page from which they had just moved back. Which control serves this purpose?",
    canonicalAnswer: "Forward",
    distractors: ["Bookmark", "Reload", "History deletion"],
    explanation: "Forward moves ahead through navigation history after the user has gone back. It does not save the page permanently and does not reload the current page as its primary purpose.",
  }),
  author({
    qlId: "COM-004-QL-006", ordinal: 4, surfaceFamily: "DIRECT_RECALL",
    stem: "Which browser feature is designed to save a reference to a useful web page so that the user can return to it later?",
    canonicalAnswer: "Bookmark",
    distractors: ["Cache", "Cookie", "Reload"],
    explanation: "A bookmark stores a user-selected reference to a Web resource for convenient later access. Cache and cookies store other forms of browsing state/data and are not equivalent to a user-created saved link.",
  }),
  author({
    qlId: "COM-004-QL-006", ordinal: 5, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "Which statement best distinguishes browser history from a bookmark?",
    canonicalAnswer: "History records visited pages, while a bookmark is deliberately saved by the user for later access",
    distractors: ["History provides Internet access, while a bookmark is a search engine", "History and bookmark are always identical copies of the same data", "History is a domain suffix, while a bookmark is a Web protocol"],
    explanation: "History is a record of pages the browser has visited, whereas bookmarks are selected references the user chooses to save. Their purposes can overlap in finding a page again, but their creation and meaning differ.",
  }),
  author({
    qlId: "COM-004-QL-006", ordinal: 6, surfaceFamily: "DIRECT_RECALL",
    stem: "What is the basic purpose of a browser cache in normal Web use?",
    canonicalAnswer: "To keep local copies of some fetched resources so later loading can be more efficient",
    distractors: ["To provide the physical Internet connection", "To register a new domain name for every page", "To permanently replace all server data"],
    explanation: "A browser cache stores copies of certain retrieved resources locally. Reusing cached resources can reduce repeated transfers and improve loading efficiency, although the browser may still need updated content from the server.",
  }),
  author({
    qlId: "COM-004-QL-006", ordinal: 7, surfaceFamily: "DIRECT_RECALL",
    stem: "In basic Web terminology, what is a browser cookie?",
    canonicalAnswer: "A small piece of data associated with a website that the browser stores and sends according to Web rules",
    distractors: ["A program that supplies Internet connectivity", "A hardware chip that stores the operating system", "A universal replacement for browser history and cache"],
    explanation: "Cookies are small items of website-associated state stored by the browser and used in later interactions according to applicable rules. They can support sessions and preferences but are not the same as cache or history.",
  }),
  author({
    qlId: "COM-004-QL-006", ordinal: 8, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "Which pair correctly matches a browser feature with its usual user-facing purpose?",
    canonicalAnswer: "Bookmark — save a chosen page reference for later use",
    distractors: ["Reload — move permanently to the previous page", "Back — save website session data as a cookie", "History — provide the user's Internet connection"],
    explanation: "Bookmarking is the deliberate act of saving a page reference. Reload, Back and History have different navigation/state roles and none of them supplies the Internet connection itself.",
  }),
  author({
    qlId: "COM-004-QL-006", ordinal: 9, surfaceFamily: "STATEMENT_EVALUATION",
    stem: "Consider the statements: (1) Cache and cookies are identical concepts. (2) Browser history can help a user find a page visited earlier. Which option is correct?",
    canonicalAnswer: "Only statement 2 is correct",
    distractors: ["Only statement 1 is correct", "Both statements are correct", "Neither statement is correct"],
    explanation: "Cache and cookies serve different purposes: cache stores copies of resources, while cookies hold website-associated state. History, meanwhile, records visited resources and can help users revisit them.",
  }),
  author({
    qlId: "COM-004-QL-006", ordinal: 10, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "A website remembers a user's selected language between visits by using small site-associated data stored in the browser. Which feature is most directly involved?",
    canonicalAnswer: "Cookie",
    distractors: ["Back button", "Bookmark", "Search query"],
    explanation: "Remembering a site preference is a common use of cookie-based state. A bookmark stores a page reference, Back navigates history, and a search query expresses information the user wants a search engine to find.",
  }),
  author({
    qlId: "COM-004-QL-006", ordinal: 11, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "A cookie set in a context involving a site different from the one the user is directly visiting is commonly described as what?",
    canonicalAnswer: "Third-party cookie",
    distractors: ["Browser bookmark", "Forward-history entry", "Downloaded file"],
    explanation: "At awareness level, a third-party cookie is associated with a party/site context different from the site the user is directly visiting. Detailed tracking, security and attack-control treatment belongs outside this QL.",
  }),
  author({
    qlId: "COM-004-QL-006", ordinal: 12, surfaceFamily: "STATEMENT_EVALUATION",
    stem: "Which statement about common browser controls and saved state is accurate?",
    canonicalAnswer: "Back, Forward and Reload are navigation/loading controls, while bookmarks, history, cache and cookies retain different kinds of references or state",
    distractors: ["All listed features perform exactly the same function", "Every cookie is simply another name for a bookmark", "Browser history is the physical network used to connect to the Internet"],
    explanation: "The listed browser features belong to one user-facing family but have distinct roles. Navigation controls affect movement/loading, while bookmarks, history, cache and cookies preserve different forms of reference or state.",
  }),
];

const ql007: Com004EnglishWave2QuestionV1[] = [
  author({
    qlId: "COM-004-QL-007", ordinal: 1, surfaceFamily: "DIRECT_RECALL",
    stem: "Copying a file from a remote Internet service to the user's local device is called what?",
    canonicalAnswer: "Downloading",
    distractors: ["Uploading", "Bookmarking", "Refreshing"],
    explanation: "Downloading transfers data toward the user's local device from a remote server or service. Uploading describes the opposite transfer direction, from the local side toward a remote destination.",
  }),
  author({
    qlId: "COM-004-QL-007", ordinal: 2, surfaceFamily: "DIRECT_RECALL",
    stem: "Sending a file from a user's local computer to a remote website or cloud service is known as what?",
    canonicalAnswer: "Uploading",
    distractors: ["Downloading", "Browsing history", "Caching"],
    explanation: "Uploading transfers a local file or data toward a remote server or service. Downloading reverses that direction by bringing remote data to the local device.",
  }),
  author({
    qlId: "COM-004-QL-007", ordinal: 3, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "A candidate saves an admit-card PDF from an examination website onto a laptop. Which transfer direction is taking place?",
    canonicalAnswer: "Download from the remote service to the local laptop",
    distractors: ["Upload from the laptop to the examination server", "Upload from one browser tab to another", "No data transfer occurs because a PDF is only a webpage"],
    explanation: "The file begins on the remote examination service and is copied to the candidate's local laptop, so the operation is a download.",
  }),
  author({
    qlId: "COM-004-QL-007", ordinal: 4, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "A student selects a photograph stored on a phone and submits it through an online application form. How should this transfer be classified?",
    canonicalAnswer: "Upload from the local phone to the remote service",
    distractors: ["Download from the service to the phone", "Browser-history navigation", "Search-engine indexing by the student"],
    explanation: "The photograph starts on the student's local device and is sent to the remote application service. That direction is an upload.",
  }),
  author({
    qlId: "COM-004-QL-007", ordinal: 5, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "Which statement correctly expresses the difference between downloading and uploading?",
    canonicalAnswer: "Download moves data toward the local device; upload moves data from the local device toward a remote service",
    distractors: ["Download and upload always mean exactly the same transfer direction", "Download means deleting remote data; upload means deleting local data", "Download applies only to text and upload applies only to images"],
    explanation: "The distinction is directional, not based on file type. Downloading brings remote data to the local side, while uploading sends local data toward a remote server or service.",
  }),
  author({
    qlId: "COM-004-QL-007", ordinal: 6, surfaceFamily: "STATEMENT_EVALUATION",
    stem: "Consider the statements: (1) Saving a remote file locally is a download. (2) Sending a local file to cloud storage is an upload. Which option is correct?",
    canonicalAnswer: "Both statements are correct",
    distractors: ["Only statement 1 is correct", "Only statement 2 is correct", "Neither statement is correct"],
    explanation: "Both examples follow the standard directional definitions. Remote-to-local transfer is downloading, whereas local-to-remote transfer is uploading.",
  }),
  author({
    qlId: "COM-004-QL-007", ordinal: 7, surfaceFamily: "PROCESS_REASONING",
    stem: "A file is stored on a remote server and must end up as a copy on the user's computer. Which direction arrow correctly represents the operation?",
    canonicalAnswer: "Remote server → local computer",
    distractors: ["Local computer → remote server", "Local computer → local keyboard", "Remote server → remote server only"],
    explanation: "A download is represented by movement from the remote source toward the local device. The reverse arrow, local to remote, represents an upload.",
  }),
  author({
    qlId: "COM-004-QL-007", ordinal: 8, surfaceFamily: "PROCESS_REASONING",
    stem: "A document exists on the user's laptop and must be submitted to a remote recruitment portal. Which direction arrow represents the required transfer?",
    canonicalAnswer: "Local laptop → remote portal",
    distractors: ["Remote portal → local laptop", "Remote portal → remote portal only", "Local laptop → local printer only"],
    explanation: "Submitting the locally stored document sends data outward to the remote portal, which is the defining direction of an upload.",
  }),
  author({
    qlId: "COM-004-QL-007", ordinal: 9, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "Which activity is an example of uploading rather than downloading?",
    canonicalAnswer: "Posting a locally stored video to an online service",
    distractors: ["Saving an online PDF to the computer", "Copying a remote image to the phone", "Installing a file obtained from a remote download"],
    explanation: "Posting the local video sends it to a remote service, so it is an upload. The other examples begin with remote content being brought to the local device and therefore involve downloading.",
  }),
  author({
    qlId: "COM-004-QL-007", ordinal: 10, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "Which activity is an example of downloading rather than uploading?",
    canonicalAnswer: "Saving a report from a website onto the local computer",
    distractors: ["Submitting a local resume to a recruitment site", "Sending a local photo to cloud storage", "Posting a local document through an online form"],
    explanation: "Saving a website-hosted report to the local computer transfers data from remote to local, so it is a download. The other options move local files to remote services.",
  }),
  author({
    qlId: "COM-004-QL-007", ordinal: 11, surfaceFamily: "STATEMENT_EVALUATION",
    stem: "Which statement about upload/download terminology is incorrect?",
    canonicalAnswer: "The terms are determined by whether the file is an image, document or video",
    distractors: ["The terms describe transfer direction relative to the local and remote sides", "A document can be either uploaded or downloaded depending on direction", "A video can be either uploaded or downloaded depending on direction"],
    explanation: "Upload and download are determined by transfer direction, not by content type. The same kind of file can be uploaded in one situation and downloaded in another.",
  }),
  author({
    qlId: "COM-004-QL-007", ordinal: 12, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "A teacher first sends a worksheet from a laptop to cloud storage; later a student saves that worksheet from the cloud to a phone. How are the two transfers classified?",
    canonicalAnswer: "Teacher: upload; student: download",
    distractors: ["Teacher: download; student: upload", "Both are downloads", "Both are uploads"],
    explanation: "The teacher sends local data to a remote cloud service, which is an upload. The student then brings the remote file to a local phone, which is a download.",
  }),
];

const ql008: Com004EnglishWave2QuestionV1[] = [
  author({
    qlId: "COM-004-QL-008", ordinal: 1, surfaceFamily: "DIRECT_RECALL",
    stem: "What does the abbreviation URL stand for in Web terminology?",
    canonicalAnswer: "Uniform Resource Locator",
    distractors: ["Universal Routing Link", "Unified Resource Language", "User Reference Location"],
    explanation: "URL stands for Uniform Resource Locator. It is the standard term used for an address that identifies how and where a resource can be accessed on the Web or another supported scheme.",
  }),
  author({
    qlId: "COM-004-QL-008", ordinal: 2, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "In the URL `https://example.org/reports/index.html`, which part is the scheme?",
    canonicalAnswer: "https",
    distractors: ["example.org", "/reports/index.html", ".org"],
    explanation: "The scheme appears before the colon and indicates the access method or protocol context; here it is `https`. The host/domain is `example.org`, while the remaining slash-led portion is the path.",
  }),
  author({
    qlId: "COM-004-QL-008", ordinal: 3, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "In the URL `https://example.org/reports/index.html`, which portion represents the domain or host name?",
    canonicalAnswer: "example.org",
    distractors: ["https", "/reports/index.html", "index.html only because every host is a file"],
    explanation: "`example.org` is the host/domain portion of the example URL. The `https` prefix is the scheme and `/reports/index.html` is the path to a resource on that host.",
  }),
  author({
    qlId: "COM-004-QL-008", ordinal: 4, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "In the URL `https://example.org/reports/index.html`, which portion is the path to the resource?",
    canonicalAnswer: "/reports/index.html",
    distractors: ["https", "example.org", ".org"],
    explanation: "The path follows the host and identifies a location/resource within that host's namespace. In the example, `/reports/index.html` is the path.",
  }),
  author({
    qlId: "COM-004-QL-008", ordinal: 5, surfaceFamily: "DIRECT_RECALL",
    stem: "Which term most directly identifies the human-readable host name used in a Web address such as `example.org`?",
    canonicalAnswer: "Domain name",
    distractors: ["Browser cache", "Search query", "E-mail attachment"],
    explanation: "A domain name is the human-readable naming component used to identify a host/domain in an Internet address. DNS resolution mechanics and IP addressing belong to the networking chapter rather than this awareness QL.",
  }),
  author({
    qlId: "COM-004-QL-008", ordinal: 6, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "A learner is asked to identify `.in` at the end of a domain such as `example.in`. Which description is most appropriate?",
    canonicalAnswer: "A top-level domain suffix associated with India's country-code domain",
    distractors: ["The HTTPS scheme", "The complete URL path", "A browser-control command"],
    explanation: "`.in` is India's country-code top-level domain suffix. It is part of the domain name and should not be confused with a URL scheme such as HTTPS or with the path after the host.",
  }),
  author({
    qlId: "COM-004-QL-008", ordinal: 7, surfaceFamily: "STATEMENT_EVALUATION",
    stem: "Which statement about common generic suffixes such as `.com` and `.org` is the safest exam-level interpretation?",
    canonicalAnswer: "They are domain suffixes, but the suffix alone does not prove the registrant's real-world organization type",
    distractors: ["Every `.org` site is legally guaranteed to be a nonprofit organization", "Every `.com` site must belong to a publicly listed commercial company", "A domain suffix alone proves that all content on the site is trustworthy"],
    explanation: "`.com` and `.org` are familiar generic top-level domain suffixes, but registration of a generic suffix does not by itself prove the registrant's actual organizational type or trustworthiness.",
  }),
  author({
    qlId: "COM-004-QL-008", ordinal: 8, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "Which pairing correctly matches a Web-address component with its role?",
    canonicalAnswer: "Scheme — indicates the access/protocol context at the beginning of a URL",
    distractors: ["Path — always identifies the Internet Service Provider", "Domain suffix — guarantees the legal type of the organization", "Host name — is always the browser's local cache"],
    explanation: "The scheme appears at the start of a URL and indicates its access/protocol context. Paths identify resource locations, while domain names/suffixes are naming components and do not guarantee organizational status.",
  }),
  author({
    qlId: "COM-004-QL-008", ordinal: 9, surfaceFamily: "SCENARIO_APPLICATION",
    stem: "Two URLs use the same domain but different paths. What can be concluded from that difference at basic Web-address level?",
    canonicalAnswer: "They can identify different resources or locations under the same host/domain",
    distractors: ["They must belong to different Internet Service Providers", "They must have different top-level domains", "They cannot both use HTTPS"],
    explanation: "A path identifies a resource/location within the context of a host. Different paths can therefore point to different resources even when the scheme and host/domain are the same.",
  }),
  author({
    qlId: "COM-004-QL-008", ordinal: 10, surfaceFamily: "STATEMENT_EVALUATION",
    stem: "Consider the statements: (1) A URL can contain a scheme, host/domain and path. (2) The domain suffix alone always proves who operates the site. Which option is correct?",
    canonicalAnswer: "Only statement 1 is correct",
    distractors: ["Only statement 2 is correct", "Both statements are correct", "Neither statement is correct"],
    explanation: "A URL commonly contains components such as scheme, host/domain and path. A suffix such as `.com` or `.org` does not by itself verify the real-world operator or legitimacy of a site.",
  }),
  author({
    qlId: "COM-004-QL-008", ordinal: 11, surfaceFamily: "PROCESS_REASONING",
    stem: "Read the address `https://portal.example.in/forms/apply`. Which component order is represented from left to right?",
    canonicalAnswer: "Scheme → host/domain → path",
    distractors: ["Path → browser → ISP", "Domain suffix → search engine → operating system", "ISP → scheme → browser cache"],
    explanation: "In the sample address, `https` is the scheme, `portal.example.in` is the host/domain, and `/forms/apply` is the path. This question tests visible URL structure only, not DNS or IP-resolution mechanics.",
  }),
  author({
    qlId: "COM-004-QL-008", ordinal: 12, surfaceFamily: "CONCEPT_DISCRIMINATION",
    stem: "Which statement stays within the correct Computer Awareness boundary for domain names and URLs?",
    canonicalAnswer: "A domain name is a human-readable naming component, while the detailed process that resolves it to network addresses belongs to networking",
    distractors: ["Every domain suffix certifies the site's owner and trustworthiness", "A URL is simply another name for a browser application", "The path of a URL is the physical cable carrying Internet traffic"],
    explanation: "COM-004 owns recognition of URLs, domains and visible components at user-awareness depth. Detailed DNS resolution and IP-address mechanics are networking concepts and remain outside this QL.",
  }),
];

export const COM004_ENGLISH_PRODUCTION_WAVE2_V1: Com004EnglishWave2QuestionV1[] = Object.freeze([
  ...ql005,
  ...ql006,
  ...ql007,
  ...ql008,
]) as unknown as Com004EnglishWave2QuestionV1[];

export const COM004_ENGLISH_PRODUCTION_WAVE2_AUTHORITY_V1 = Object.freeze({
  authorityId: "COM-004-ENGLISH-PRODUCTION-WAVE2-V1" as const,
  chapterCode: "COM-004" as const,
  status: "REVIEW_CANDIDATE_NOT_FROZEN" as const,
  permanentQlIds: Object.freeze(["COM-004-QL-005", "COM-004-QL-006", "COM-004-QL-007", "COM-004-QL-008"] as const),
  questionCount: COM004_ENGLISH_PRODUCTION_WAVE2_V1.length,
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
  nextGate: "COM004_ENGLISH_PRODUCTION_WAVE2_EDITORIAL_AUDIT" as const,
});
