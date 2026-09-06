export type Com004ReviewSeed = {
  factId: string;
  surfaceMode: string;
  examSurfaceFamily: "DIRECT_RECALL" | "FUNCTIONAL_APPLICATION" | "CONTRAST_DISCRIMINATION" | "CONTEXT_SELECTION";
  answer: string;
  distractors: readonly [string, string, string];
  stems: readonly [string, string, string];
  explanation: string;
  controlledPoolId?: string;
};

function s(
  factId: string,
  surfaceMode: string,
  examSurfaceFamily: Com004ReviewSeed["examSurfaceFamily"],
  answer: string,
  distractors: readonly [string, string, string],
  stems: readonly [string, string, string],
  explanation: string,
  controlledPoolId?: string,
): Com004ReviewSeed {
  return { factId, surfaceMode, examSurfaceFamily, answer, distractors, stems, explanation, controlledPoolId };
}

/**
 * Four semantic seeds per permanent QL. Each seed owns three independently
 * worded exam surfaces, producing 12 review questions per QL without treating
 * wording variants as new facts or QLs.
 */
export const COM004_REVIEW_SEEDS_BY_QL: Readonly<Record<string, readonly Com004ReviewSeed[]>> = {
  "COM-004-QL-001": [
    s("com004-internet-concept", "CONCEPT_FROM_DEFINITION", "DIRECT_RECALL", "Internet", ["World Wide Web", "Website", "Web page"], [
      "Which term refers to the worldwide system of interconnected computer networks?",
      "A worldwide infrastructure linking many computer networks is known as what?",
      "Which of the following names the global network environment on which Web services operate?",
    ], "The Internet is the global interconnected network infrastructure. The World Wide Web is a resource system that operates over that infrastructure, so the two terms are not synonyms."),
    s("com004-www-concept", "INTERNET_VS_WWW", "CONTRAST_DISCRIMINATION", "World Wide Web", ["Internet", "Intranet", "E-mail"], [
      "Which term describes the system of interlinked Web resources accessed over the Internet?",
      "A user follows links between pages and other resources through a browser. Which service layer is being used?",
      "Which option is a resource system that uses the Internet rather than the Internet infrastructure itself?",
    ], "The World Wide Web is the interlinked resource system accessed using Web technologies over the Internet. The Internet is the underlying network environment."),
    s("com004-webpage-concept", "WEB_RESOURCE_CLASSIFICATION", "DIRECT_RECALL", "Web page", ["Website", "Home page", "Search engine"], [
      "An individual page or resource viewed on the World Wide Web is called what?",
      "Which term is used for a single page within a website?",
      "A website may contain many individual documents or resources. What is one such individual page called?",
    ], "A Web page is an individual page/resource. A website is the broader collection, while a home page is normally the site's main or starting page."),
    s("com004-hyperlink-concept", "CONCEPT_FROM_FUNCTION", "FUNCTIONAL_APPLICATION", "Hyperlink", ["Homepage", "Search query", "Bookmark"], [
      "Which Web element can be activated to move to another resource or location?",
      "Clickable text or an object that references another Web location is called what?",
      "While reading a page, a user clicks a highlighted item and is taken to another resource. What was clicked?",
    ], "A hyperlink is a reference that supports navigation to another resource or location. A bookmark stores a reference for later use; it is not the link embedded in the page."),
  ],

  "COM-004-QL-002": [
    s("com004-browser-role", "BROWSER_FROM_PURPOSE", "FUNCTIONAL_APPLICATION", "Web browser", ["Search engine", "E-mail service", "Operating system"], [
      "Which type of software is used to access, display and navigate Web content?",
      "A user wants to open websites and move between Web pages. Which type of application is required?",
      "Which of the following is client software for viewing and navigating the World Wide Web?",
    ], "A Web browser is client application software used to access and navigate Web content. A search engine is a service used to find information and Web resources."),
    s("com004-search-engine-role", "SEARCH_ENGINE_FROM_PURPOSE", "FUNCTIONAL_APPLICATION", "Search engine", ["Web browser", "E-mail client", "File manager"], [
      "Which type of service helps a user find Web information by entering a query?",
      "A student enters keywords to locate relevant Web pages. Which service is being used?",
      "Which option is primarily meant to return search results for words or phrases entered by a user?",
    ], "A search engine accepts a query and returns relevant indexed results. A browser is the application through which such a service may be accessed."),
    s("com004-chrome-class", "BROWSER_VS_SEARCH_ENGINE", "CONTRAST_DISCRIMINATION", "Web browser", ["Search engine", "E-mail service", "Spreadsheet application"], [
      "Google Chrome is best classified as which of the following?",
      "Which software category does Google Chrome belong to?",
      "Chrome is used to open and navigate Web content. What type of application is it?",
    ], "Google Chrome is a Web browser. The Google Search service is a search engine; sharing the word 'Google' does not make the two products the same category."),
    s("com004-google-search-class", "BROWSER_VS_SEARCH_ENGINE", "CONTRAST_DISCRIMINATION", "Search engine", ["Web browser", "Operating system", "Word processor"], [
      "Google Search is best classified as which type of Web service?",
      "Which category correctly describes Google Search rather than Google Chrome?",
      "A service that indexes Web information and returns results for queries, such as Google Search, is called what?",
    ], "Google Search is a search engine/service. Google Chrome is a browser used to access Web content, including search-engine websites."),
  ],

  "COM-004-QL-003": [
    s("com004-download-direction", "DIRECTION_TO_TERM", "DIRECT_RECALL", "Download", ["Upload", "Forward", "Refresh"], [
      "Copying a file from an online service to your local device is called what?",
      "Which term describes data transfer from a remote system to the user's device?",
      "A candidate saves an admit-card PDF from a website onto the computer. Which transfer direction is this?",
    ], "Downloading moves data from a remote service/system to the user's local device. Uploading is the opposite direction."),
    s("com004-upload-direction", "DIRECTION_TO_TERM", "DIRECT_RECALL", "Upload", ["Download", "Bookmark", "Reload"], [
      "Sending a local file from your device to an online service is called what?",
      "Which term describes data transfer from the user's device to a remote service or system?",
      "A user selects a photo stored on the phone and submits it to an online form. Which operation is taking place?",
    ], "Uploading transfers data from the user's local device to a remote service/system. Downloading transfers data toward the local device."),
    s("com004-download-direction", "CONTEXT_SELECTION", "CONTEXT_SELECTION", "Download", ["Upload", "Reply", "Search"], [
      "A recruitment portal provides a PDF and the user stores a copy on the laptop. Which action best describes this?",
      "An attachment is retrieved from an e-mail service and saved on the phone. What transfer has occurred?",
      "A file moves from cloud storage to a candidate's computer. Which term applies to the transfer?",
    ], "In each case the file travels from a remote online location to the local device, so the operation is a download."),
    s("com004-upload-direction", "CONTEXT_SELECTION", "CONTEXT_SELECTION", "Upload", ["Download", "Back", "Find"], [
      "A candidate attaches a locally stored photograph to an online application form. Which transfer is required?",
      "A document on a computer is sent to cloud storage. What is this operation called?",
      "When a user sends a file from the phone to a website, which transfer direction is involved?",
    ], "The file starts on the local device and is sent to a remote service, which is the defining direction of an upload."),
  ],

  "COM-004-QL-004": [
    s("com004-browser-refresh", "ACTION_FROM_EFFECT", "FUNCTIONAL_APPLICATION", "Refresh / Reload", ["Back", "Forward", "Bookmark / Favourite"], [
      "Which browser action requests or loads the current page again?",
      "A Web page has changed and the user wants the browser to request the current page again. Which action should be used?",
      "Which browser control is associated with reloading the page currently being viewed?",
    ], "Refresh or Reload requests the current page again. Back and Forward move through browsing history, while a bookmark saves a page reference."),
    s("com004-browser-back", "ACTION_FROM_EFFECT", "FUNCTIONAL_APPLICATION", "Back", ["Forward", "Refresh / Reload", "Bookmark / Favourite"], [
      "Which browser action returns to the previously visited page in the current browsing history?",
      "After opening a link, a user wants to return to the page viewed immediately before it. Which action is used?",
      "Which browser command moves one step toward an earlier page in the history sequence?",
    ], "Back moves to an earlier history position. Refresh reloads the current page and Forward moves toward a later history position after going back."),
    s("com004-browser-forward", "ACTION_FROM_EFFECT", "FUNCTIONAL_APPLICATION", "Forward", ["Back", "Refresh / Reload", "Bookmark / Favourite"], [
      "After using Back, which browser action can move to the later page in the history sequence again?",
      "Which browser command moves forward from the current history position when a later visited page is available?",
      "A user went back one page by mistake. Which browser action can return to the page that followed it?",
    ], "Forward moves to a later history position when such a page is available. It is the counterpart to Back, not a page reload."),
    s("com004-browser-bookmark", "ACTION_FROM_EFFECT", "FUNCTIONAL_APPLICATION", "Bookmark / Favourite", ["Refresh / Reload", "Back", "Forward"], [
      "Which browser feature stores a reference to a page for convenient later access?",
      "A user wants to save a page reference without downloading the page itself. Which browser feature is appropriate?",
      "Which browser action is meant for keeping a convenient link to a page for future visits?",
    ], "A bookmark or favourite stores a reference to a page for later access. It does not copy the page to the device or change the browsing-history position."),
  ],

  "COM-004-QL-005": [
    s("com004-url-expansion", "ACRONYM_EXPANSION", "DIRECT_RECALL", "Uniform Resource Locator", ["Universal Resource Link", "Uniform Reference Locator", "Unified Resource Locator"], [
      "What is the correct expansion of URL?",
      "In Web terminology, URL stands for which of the following?",
      "Which full form correctly represents the acronym URL?",
    ], "URL stands for Uniform Resource Locator. It identifies a resource location through a structured URL; 'Universal Resource Link' and similar forms are not the standard expansion."),
    s("com004-url-scheme", "COMPONENT_FROM_ROLE", "DIRECT_RECALL", "Scheme", ["Host", "Path", "Query"], [
      "In a URL such as https://example.com/page, which component is represented by https?",
      "Which URL component appears at the beginning in forms such as http or https?",
      "The part of a URL that indicates a scheme such as https is called what?",
    ], "The scheme is the leading URL component, such as https. The host identifies the host/domain portion and the path identifies a location within that host's URL space."),
    s("com004-url-host", "COMPONENT_FROM_ROLE", "DIRECT_RECALL", "Host", ["Scheme", "Path", "Fragment"], [
      "In https://example.com/news, which URL component is represented by example.com?",
      "Which URL component identifies the host/domain portion of a Web address?",
      "The part naming the host, such as example.com, is which component of a URL?",
    ], "The host component identifies the host/domain portion. The scheme comes before it and the path normally follows it."),
    s("com004-url-path", "COMPONENT_FROM_ROLE", "DIRECT_RECALL", "Path", ["Host", "Scheme", "Port"], [
      "In https://example.com/news/today, which URL component is represented by /news/today?",
      "Which part of a URL identifies a resource location within the host's URL space?",
      "After the host name in a simple Web URL, which component can identify a more specific resource location?",
    ], "The path identifies a location/resource within the host's URL space. It is distinct from the scheme and the host/domain portion."),
  ],

  "COM-004-QL-006": [
    s("com004-http-expansion", "ACRONYM_EXPANSION", "DIRECT_RECALL", "Hypertext Transfer Protocol", ["Hyperlink Transfer Protocol", "Hypertext Transmission Process", "Hypermedia Transfer Program"], [
      "What does HTTP stand for?",
      "Which full form correctly expands HTTP?",
      "In Web communication, HTTP is the abbreviation for which protocol name?",
    ], "HTTP stands for Hypertext Transfer Protocol. It defines semantics used in Web communication; the other expansions are not standard protocol names."),
    s("com004-https-protection", "HTTP_HTTPS_COMPARISON", "CONTRAST_DISCRIMINATION", "HTTP communication protected by TLS", ["A guarantee that the website is honest", "A browser that blocks all malware", "A replacement for the Internet"], [
      "Which statement best describes HTTPS at awareness level?",
      "What does the use of HTTPS most directly indicate about the Web connection?",
      "A browser shows an https URL. Which conclusion is technically appropriate?",
    ], "HTTPS indicates HTTP communication protected by TLS for the connection. That protection does not by itself guarantee that the site's operator, content or intentions are trustworthy."),
    s("com004-https-trust-guard", "CORRECT_STATEMENT", "CONTRAST_DISCRIMINATION", "HTTPS alone does not prove that a site's operator or content is trustworthy", ["HTTPS proves every site is genuine", "HTTPS means the page cannot contain malicious content", "HTTPS guarantees that every transaction is safe"], [
      "Which statement about HTTPS is the most accurate?",
      "A site uses HTTPS. Which of the following conclusions should a user avoid making?",
      "Which statement correctly separates connection protection from website trustworthiness?",
    ], "HTTPS protects the HTTP connection using TLS, but a malicious or deceptive site can also use HTTPS. Users must still verify the site or service they intend to use."),
    s("com004-http-role", "PROTOCOL_FROM_PURPOSE", "FUNCTIONAL_APPLICATION", "HTTP", ["SMTP", "IMAP", "POP3"], [
      "Which protocol is fundamentally associated with Web request/response communication rather than e-mail sending or mailbox access?",
      "A browser and Web server exchange Web messages using which protocol family?",
      "Which option belongs to Web communication, while SMTP, POP3 and IMAP are e-mail protocols?",
    ], "HTTP is associated with Web communication. SMTP handles e-mail sending/transport, while POP3 and IMAP are used for delivered-mail access/retrieval models."),
  ],

  "COM-004-QL-007": [
    s("com004-email-at-symbol", "ADDRESS_COMPONENT", "DIRECT_RECALL", "@", ["#", "&", "%"], [
      "Which symbol separates the local part from the domain in the familiar form of an e-mail address?",
      "In an address such as name@example.com, which symbol divides the user/local part from the domain?",
      "Which character is essential between the local part and domain in a standard e-mail address form?",
    ], "The @ symbol separates the local part from the domain portion in the familiar e-mail address structure."),
    s("com004-email-to", "FIELD_FROM_REQUIREMENT", "FUNCTIONAL_APPLICATION", "To", ["CC", "BCC", "Subject"], [
      "Which e-mail field normally identifies the primary intended recipient?",
      "A message is being addressed directly to the person expected to act on it. Which recipient field is normally used?",
      "Which field is ordinarily used for the main recipient of an e-mail?",
    ], "The To field normally identifies the primary intended recipient. CC and BCC are copy fields, while Subject states what the message is about."),
    s("com004-email-cc", "CC_BCC_VISIBILITY", "CONTRAST_DISCRIMINATION", "CC", ["BCC", "Subject", "Draft"], [
      "Which field sends a visible copy of an e-mail to additional recipients?",
      "A manager wants additional recipients to receive a copy and for their copied addresses to be visible to the other recipients. Which field is appropriate?",
      "Which recipient field is used for a conventional visible carbon copy?",
    ], "CC sends a visible copy to additional recipients. BCC is used when the BCC recipient addresses should be hidden from the other recipients."),
    s("com004-email-bcc", "CC_BCC_VISIBILITY", "CONTEXT_SELECTION", "BCC", ["CC", "To", "Subject"], [
      "Which field is appropriate when copied recipients should not see the other BCC recipient addresses?",
      "An e-mail is being sent to several unrelated recipients and their addresses should be hidden from one another. Which field best fits that requirement?",
      "Which recipient field provides a blind copy whose BCC addresses are hidden from the other recipients?",
    ], "BCC sends a blind copy and hides BCC recipient addresses from the other recipients. CC does not provide that privacy property."),
  ],

  "COM-004-QL-008": [
    s("com004-email-inbox", "FOLDER_FROM_STATE", "DIRECT_RECALL", "Inbox", ["Sent", "Draft", "Outbox"], [
      "Which mailbox folder normally contains received e-mail messages?",
      "A newly delivered message is normally found in which mailbox folder?",
      "Which folder is primarily associated with incoming messages that have been received?",
    ], "The Inbox normally contains received messages. Sent stores copies of sent messages, Draft holds unsent saved work, and Outbox is associated with messages waiting to be sent."),
    s("com004-email-outbox", "FOLDER_FROM_STATE", "CONTRAST_DISCRIMINATION", "Outbox", ["Sent", "Inbox", "Draft"], [
      "Which mailbox folder is associated with messages waiting to be sent or still in the sending process?",
      "A message has left the compose stage but has not yet completed sending. Which folder is most closely associated with that state?",
      "Which folder should not be confused with Sent because it represents a pre-completion sending state?",
    ], "Outbox is associated with messages waiting to be sent or still being sent. Sent represents messages whose sending has completed and a copy is retained."),
    s("com004-email-sent", "FOLDER_FROM_STATE", "DIRECT_RECALL", "Sent", ["Outbox", "Draft", "Spam / Junk"], [
      "Which folder normally stores copies of messages that have already been sent?",
      "After an e-mail has been sent successfully, its retained copy is normally placed in which folder?",
      "Which mailbox folder represents the completed-sending state rather than the waiting-to-send state?",
    ], "Sent normally stores copies of messages already sent. Outbox is the contrasting waiting/sending state."),
    s("com004-email-draft", "FOLDER_FROM_STATE", "CONTEXT_SELECTION", "Draft", ["Inbox", "Sent", "Trash / Deleted Items"], [
      "A user saves an unfinished e-mail without sending it. In which folder is it normally stored?",
      "Which folder is associated with messages saved for later editing before they are sent?",
      "An e-mail has been composed partly and saved for completion later. What is its normal mailbox state?",
    ], "A Draft is a message saved before sending so it can be edited or completed later."),
  ],

  "COM-004-QL-009": [
    s("com004-email-reply", "ACTION_FROM_RECIPIENT_INTENT", "CONTEXT_SELECTION", "Reply", ["Reply All", "Forward", "Attachment"], [
      "Which e-mail action is used to respond to the original sender?",
      "A recipient wants to answer the person who sent the message without intentionally addressing the wider original recipient group. Which action is appropriate?",
      "Which command starts a response directed to the original sender?",
    ], "Reply creates a response to the original sender. Reply All broadens the response to applicable original recipients, while Forward sends the existing message onward to new recipients."),
    s("com004-email-reply-all", "ACTION_FROM_RECIPIENT_INTENT", "CONTEXT_SELECTION", "Reply All", ["Reply", "Forward", "Signature"], [
      "Which action responds to the sender and the other applicable original recipients?",
      "A discussion e-mail was sent to several people and the response needs to remain with the whole applicable recipient group. Which action is used?",
      "Which e-mail command differs from Reply by including the other applicable original recipients?",
    ], "Reply All addresses the sender and other applicable original recipients. Use it only when the response genuinely belongs with that group."),
    s("com004-email-forward", "ACTION_FROM_RECIPIENT_INTENT", "FUNCTIONAL_APPLICATION", "Forward", ["Reply", "Reply All", "Draft"], [
      "Which e-mail action sends an existing message onward to a new recipient?",
      "A received message must be shared with someone who was not part of the original exchange. Which action is appropriate?",
      "Which command is used when the goal is to pass the existing message to another recipient rather than respond to its sender?",
    ], "Forward sends an existing message onward to a new recipient. Reply and Reply All are response actions tied to the original conversation recipients."),
    s("com004-email-attachment", "FEATURE_FROM_ROLE", "FUNCTIONAL_APPLICATION", "Attachment", ["Signature", "Subject", "BCC"], [
      "Which e-mail feature is used to send a file together with a message?",
      "A user needs to include a PDF document with an e-mail. Which feature is required?",
      "Which message feature carries an additional file such as a document or image?",
    ], "An attachment is a file sent together with an e-mail message. A signature is a standard closing/contact block rather than a file-carrying feature."),
  ],

  "COM-004-QL-010": [
    s("com004-smtp-expansion", "ACRONYM_EXPANSION", "DIRECT_RECALL", "Simple Mail Transfer Protocol", ["Secure Mail Transfer Process", "Simple Message Transmission Program", "Server Mail Transport Protocol"], [
      "What does SMTP stand for?",
      "Which full form correctly expands SMTP?",
      "In e-mail communication, SMTP is the abbreviation for which protocol name?",
    ], "SMTP stands for Simple Mail Transfer Protocol. It is associated with message sending/submission and transport rather than mailbox retrieval."),
    s("com004-smtp-role", "PROTOCOL_FROM_ROLE", "CONTRAST_DISCRIMINATION", "SMTP", ["POP3", "IMAP", "HTTP"], [
      "Which protocol is primarily associated with sending/submitting e-mail rather than accessing a delivered mailbox?",
      "A mail client needs the protocol on the sending side of e-mail communication. Which option fits that role?",
      "Which protocol belongs to e-mail transport/submission rather than the POP3/IMAP mailbox-access side?",
    ], "SMTP is used for e-mail submission/transport. POP3 and IMAP are mailbox access/retrieval protocols, while HTTP is a Web protocol."),
    s("com004-pop3-role", "PROTOCOL_FROM_ROLE", "CONTRAST_DISCRIMINATION", "POP3", ["SMTP", "HTTP", "HTTPS"], [
      "Which protocol is associated with retrieving/accessing delivered e-mail through the Post Office Protocol model?",
      "Which option is a delivered-mail retrieval/access protocol rather than the protocol used to submit outgoing mail?",
      "A question asks for Post Office Protocol Version 3, used for mailbox retrieval/access. Which acronym is correct?",
    ], "POP3 is Post Office Protocol Version 3 and is used for delivered-mail retrieval/access. It should not be described as universally deleting server mail or as a one-device-only protocol."),
    s("com004-imap-role", "PROTOCOL_FROM_ROLE", "FUNCTIONAL_APPLICATION", "IMAP", ["SMTP", "POP3", "FTP"], [
      "Which protocol is designed for accessing and manipulating messages in server mailboxes?",
      "A mail client needs server-mailbox access and manipulation rather than outgoing-message submission. Which protocol is appropriate?",
      "Which e-mail protocol is most directly associated with working with messages stored in a server mailbox?",
    ], "IMAP is the Internet Message Access Protocol and supports access/manipulation of server mailboxes. SMTP serves the sending side; POP3 uses a different retrieval model."),
  ],

  "COM-004-QL-011": [
    s("com004-ecommerce-concept", "CONCEPT_FROM_CONTEXT", "DIRECT_RECALL", "E-commerce", ["E-governance", "E-mail", "E-learning"], [
      "Buying or selling goods and services through electronic/online systems is commonly called what?",
      "Which term primarily refers to commercial transactions conducted through digital networks?",
      "An online marketplace allows customers to purchase products electronically. Which concept does this illustrate?",
    ], "E-commerce concerns commercial buying, selling and related transactions carried out electronically. E-governance concerns government information, interaction and service delivery."),
    s("com004-egovernance-concept", "CONCEPT_FROM_CONTEXT", "DIRECT_RECALL", "E-governance", ["E-commerce", "E-banking", "E-mail"], [
      "The use of digital systems for government information, interaction and service delivery is commonly called what?",
      "Which concept most directly concerns electronic delivery of government and public-administration services?",
      "A government department provides citizen services through an online portal. Which broad concept does this represent?",
    ], "E-governance is the use of digital/electronic systems for government information, interaction and service delivery. It is not primarily a commercial buying-and-selling concept."),
    s("com004-ecommerce-focus", "ECOMMERCE_VS_EGOVERNANCE", "CONTRAST_DISCRIMINATION", "E-commerce", ["E-governance", "Internet banking", "Search engine"], [
      "Which concept has commercial exchange of goods or services as its central focus?",
      "An activity is primarily about an online purchase between a seller and customer. Which category fits it best?",
      "Which option is distinguished from e-governance by its commercial transaction focus?",
    ], "Commercial exchange is the defining focus of e-commerce. Government/public-service delivery is the contrasting focus of e-governance."),
    s("com004-egovernance-focus", "ECOMMERCE_VS_EGOVERNANCE", "CONTEXT_SELECTION", "E-governance", ["E-commerce", "Digital marketing", "Online shopping"], [
      "A state department allows citizens to submit a public-service application through its portal. Which concept is most directly involved?",
      "Which concept covers digital interaction between government administration and citizens for public services?",
      "A portal is used to deliver an official certificate service to citizens. This is best classified under which broad concept?",
    ], "The scenario concerns digital government service delivery, so it falls under e-governance rather than commercial e-commerce."),
  ],

  "COM-004-QL-012": [
    s("com004-otp-expansion", "ACRONYM_EXPANSION", "DIRECT_RECALL", "One Time Password", ["Online Transaction Password", "One Transfer Passcode", "Official Transaction PIN"], [
      "What does OTP stand for?",
      "Which full form correctly expands OTP in digital transactions?",
      "In authentication contexts, OTP is the abbreviation for which term?",
    ], "OTP stands for One Time Password. It is a temporary credential used as an authentication or verification factor; it is not a guarantee that a transaction or request is genuine."),
    s("com004-otp-purpose", "TOOL_FROM_PURPOSE", "FUNCTIONAL_APPLICATION", "OTP", ["QR code", "PoS", "URL"], [
      "Which temporary credential is commonly used as an additional authentication or verification factor?",
      "A service sends a short-lived credential to verify an action. Which tool is being used?",
      "Which option is intended to function as a temporary authentication credential rather than an encoded visual code?",
    ], "An OTP is a temporary credential used for authentication/verification. A QR code is an encoded scannable information carrier, not a temporary password."),
    s("com004-qr-expansion", "ACRONYM_EXPANSION", "DIRECT_RECALL", "Quick Response", ["Quick Read", "Query Response", "Qualified Reference"], [
      "What does QR stand for in QR code?",
      "Which expansion of QR is correct?",
      "The letters QR in a QR code stand for which words?",
    ], "QR stands for Quick Response. A QR code can carry encoded information, including payment-related identifiers or details."),
    s("com004-qr-purpose", "PURPOSE_FROM_TOOL", "CONTRAST_DISCRIMINATION", "Carry encoded information in a scannable code", ["Guarantee that every payment is safe", "Replace every form of authentication", "Prove that the recipient is genuine"], [
      "What is the fundamental role of a QR code in a digital-payment context?",
      "Which statement about a QR code is technically appropriate?",
      "A QR code is scanned during a payment flow. What does the code itself primarily provide?",
    ], "A QR code carries encoded information that can be scanned. The code itself does not guarantee that the payment recipient or transaction is trustworthy."),
  ],

  "COM-004-QL-013": [
    s("com004-upi-expansion", "ACRONYM_EXPANSION", "DIRECT_RECALL", "Unified Payments Interface", ["Unified Payment Interface", "Universal Payments Interface", "Unified Payment Integration"], [
      "What is the correct expansion of UPI?",
      "According to the canonical NPCI product name, UPI stands for what?",
      "Which full form of UPI is correct?",
    ], "UPI stands for Unified Payments Interface. The plural word 'Payments' is part of the canonical NPCI name; 'Unified Payment Interface' is not the canonical expansion."),
    s("com004-upi-purpose", "SYSTEM_FROM_PURPOSE", "FUNCTIONAL_APPLICATION", "UPI", ["RTGS", "PoS", "AePS"], [
      "Which payment system enables real-time bank-account based digital payments through participating applications?",
      "A user makes a bank-account payment through a UPI-enabled application. Which system is being used?",
      "Which NPCI payment interface is associated with real-time bank-account based payment flows through supported applications?",
    ], "UPI is the Unified Payments Interface and enables real-time bank-account based digital payments through participating applications. RTGS and AePS have different service models."),
    s("com004-upi-p2p", "PURPOSE_FROM_SYSTEM", "FUNCTIONAL_APPLICATION", "Transfer money between participating bank accounts", ["Edit a Web page", "Retrieve e-mail through POP3", "Create a browser bookmark"], [
      "Which is a durable person-to-person use of UPI?",
      "UPI can be used between participating users for which banking activity?",
      "Which task is consistent with UPI's bank-account payment purpose?",
    ], "A core UPI use is transferring money between participating bank accounts. The distractors are unrelated Web or e-mail functions."),
    s("com004-upi-merchant", "PURPOSE_FROM_SYSTEM", "CONTEXT_SELECTION", "Merchant payment through a UPI-enabled flow", ["Mailbox synchronisation", "Website hosting", "Spreadsheet calculation"], [
      "Which activity is a normal merchant-facing use of UPI?",
      "A customer scans a merchant's supported payment code and authorises a UPI transaction. Which service purpose is illustrated?",
      "Which option describes a payment use rather than an unrelated Internet or Office function?",
    ], "UPI supports merchant payment flows as part of its bank-account based payment purpose. Mailbox access, website hosting and spreadsheet calculation are unrelated functions."),
  ],

  "COM-004-QL-014": [
    s("com004-aeps-expansion", "ACRONYM_EXPANSION", "DIRECT_RECALL", "Aadhaar Enabled Payment System", ["Aadhaar Electronic Payment Service", "Advanced Electronic Payment System", "Aadhaar Enabled Processing Service"], [
      "What does AePS stand for?",
      "Which full form correctly expands AePS?",
      "In digital financial tools, AePS is the abbreviation for which system?",
    ], "AePS stands for Aadhaar Enabled Payment System. It is associated with Aadhaar-authenticated assisted banking services at participating touchpoints."),
    s("com004-aeps-purpose", "SYSTEM_FROM_PURPOSE", "FUNCTIONAL_APPLICATION", "AePS", ["USSD", "UPI", "IMAP"], [
      "Which system is associated with Aadhaar-authenticated assisted banking transactions?",
      "A customer uses Aadhaar-based authentication for an assisted basic banking transaction at a participating touchpoint. Which system fits the description?",
      "Which digital financial service has Aadhaar-based authentication at the centre of its assisted-banking model?",
    ], "AePS uses Aadhaar-based authentication in an assisted banking model. UPI and USSD are different payment/access channels, while IMAP is an e-mail protocol."),
    s("com004-ussd-expansion", "ACRONYM_EXPANSION", "DIRECT_RECALL", "Unstructured Supplementary Service Data", ["Universal Supplementary Service Data", "Unified Secure Service Data", "Unstructured System Service Dialling"], [
      "What does USSD stand for?",
      "Which full form correctly expands USSD?",
      "The acronym USSD in mobile service access stands for which term?",
    ], "USSD stands for Unstructured Supplementary Service Data. It supports session-based mobile service interaction and has been used for mobile-banking access such as *99#."),
    s("com004-ussd-data", "AEPS_USSD_COMPARISON", "CONTRAST_DISCRIMINATION", "USSD", ["AePS", "RTGS", "PoS"], [
      "Which channel can provide session-based mobile service access without requiring a mobile-data Internet connection?",
      "A basic mobile-banking service is accessed through a USSD session rather than mobile data. Which technology is involved?",
      "Which option is distinguished by a telecom USSD session rather than Aadhaar-authenticated assisted banking?",
    ], "USSD can provide session-based mobile access without a mobile-data Internet connection. AePS is instead defined by its Aadhaar-authenticated assisted-banking model."),
  ],

  "COM-004-QL-015": [
    s("com004-debit-card", "DEBIT_CREDIT_COMPARISON", "CONTRAST_DISCRIMINATION", "Debit card", ["Credit card", "E-wallet", "PoS terminal"], [
      "Which card normally draws an eligible purchase amount from the linked deposit account?",
      "A purchase is funded directly from the customer's linked deposit balance. Which type of card best fits this description?",
      "Which card is distinguished from a credit card by ordinarily debiting the linked deposit account for the purchase?",
    ], "A debit-card purchase ordinarily draws funds from the linked deposit account. A credit card uses an issuer-provided credit facility instead."),
    s("com004-credit-card", "DEBIT_CREDIT_COMPARISON", "CONTRAST_DISCRIMINATION", "Credit card", ["Debit card", "Prepaid wallet", "PoS terminal"], [
      "Which card generally uses an issuer-provided credit facility rather than directly drawing the purchase amount from a deposit balance?",
      "A customer makes a purchase against a sanctioned card credit line. Which payment card is being used?",
      "Which card is defined here by use of an issuer-provided credit facility?",
    ], "A credit card uses credit extended by the issuer. A debit card ordinarily draws purchase funds from the linked deposit account."),
    s("com004-ppi", "PPI_WALLET_POS_CLASSIFICATION", "DIRECT_RECALL", "Prepaid Payment Instrument (PPI)", ["Credit card", "RTGS", "Web browser"], [
      "Which term describes a payment instrument that facilitates eligible transactions against value stored in the instrument?",
      "An instrument is loaded with value before that value is used for eligible payments. Which broad RBI category fits it?",
      "Stored value available for eligible payment use is a defining idea of which payment-instrument category?",
    ], "A Prepaid Payment Instrument enables eligible payments/services against value stored in the instrument. It is conceptually different from a credit facility or a fund-transfer settlement system."),
    s("com004-pos-expansion", "PAYMENT_TOOL_FROM_DESCRIPTION", "DIRECT_RECALL", "Point of Sale", ["Payment over Server", "Point of Serviceability", "Processing of Settlement"], [
      "What does PoS stand for in payment terminology?",
      "Which full form correctly expands PoS in a merchant-payment context?",
      "A merchant accepts supported electronic payments at a PoS terminal. What does PoS mean?",
    ], "PoS stands for Point of Sale. A PoS terminal/system is a merchant-side payment-acceptance point; changing limits or charges are not part of this durable definition."),
  ],

  "COM-004-QL-016": [
    s("com004-internet-banking", "CONCEPT_FROM_CONTEXT", "DIRECT_RECALL", "Internet banking", ["E-commerce", "Web browsing", "E-governance"], [
      "Performing banking services through a bank's online channel is commonly called what?",
      "A customer signs in to the bank's official online channel to use banking services. Which concept is illustrated?",
      "Which term most directly describes use of banking services through an Internet-based bank channel?",
    ], "Internet banking is the use of a bank's online channel to access or perform banking services. It should not be confused with general e-commerce or Web browsing."),
    s("com004-ebanking", "SERVICE_CLASSIFICATION", "DIRECT_RECALL", "E-banking", ["E-commerce", "E-governance", "E-learning"], [
      "Which term broadly refers to electronic delivery or use of banking services through digital channels?",
      "Banking services delivered through electronic channels fall under which broad concept?",
      "Which option is the broad digital-banking category explicitly included in SSC Computer Knowledge scope?",
    ], "E-banking is the broad electronic delivery/use of banking services through digital channels. Internet banking is one online-channel expression of that broader idea."),
    s("com004-ebanking-transfer-context", "CONTEXT_FROM_CONCEPT", "FUNCTIONAL_APPLICATION", "Electronic fund transfer", ["Web page formatting", "E-mail attachment", "Browser bookmarking"], [
      "Which activity is commonly associated with eligible electronic banking/payment channels?",
      "A user moves money electronically through an authorised banking/payment channel. Which broad activity is taking place?",
      "Which option belongs naturally to e-banking rather than to browser or e-mail operation?",
    ], "Electronic fund transfer is a common banking activity supported by eligible digital banking/payment channels. The other options are Web or e-mail functions."),
    s("com004-ebanking-service-context", "SERVICE_CLASSIFICATION", "CONTEXT_SELECTION", "Electronic fund-transfer services", ["E-mail access protocols", "Browser navigation commands", "Word-processing features"], [
      "NEFT, RTGS and IMPS are best grouped under which broad activity?",
      "Which category correctly groups NEFT, RTGS and IMPS?",
      "In a computer-awareness e-banking question, NEFT, RTGS and IMPS are examples of what?",
    ], "NEFT, RTGS and IMPS are electronic fund-transfer services encountered in digital banking. They are not Web navigation or e-mail protocols."),
  ],

  "COM-004-QL-017": [
    s("com004-neft-expansion", "ACRONYM_EXPANSION", "DIRECT_RECALL", "National Electronic Funds Transfer", ["National Electronic Fund Transaction", "National Exchange of Funds Transfer", "Network Electronic Funds Transfer"], [
      "What does NEFT stand for?",
      "Which full form correctly expands NEFT?",
      "In Indian electronic fund transfer, NEFT is the abbreviation for which system name?",
    ], "NEFT stands for National Electronic Funds Transfer. RBI describes it as an electronic fund-transfer system with a batch-based settlement model."),
    s("com004-rtgs-expansion", "ACRONYM_EXPANSION", "DIRECT_RECALL", "Real Time Gross Settlement", ["Real Transfer Gross System", "Rapid Transaction General Settlement", "Real Time Group Settlement"], [
      "What does RTGS stand for?",
      "Which full form correctly expands RTGS?",
      "In payment-system terminology, RTGS is the abbreviation for which phrase?",
    ], "RTGS stands for Real Time Gross Settlement. 'Real time' refers to processing without waiting for a later batch cycle, while 'gross' means individual rather than net settlement."),
    s("com004-imps-expansion", "ACRONYM_EXPANSION", "DIRECT_RECALL", "Immediate Payment Service", ["Instant Money Processing System", "Immediate Payment System", "Interbank Mobile Payment Service"], [
      "What does IMPS stand for?",
      "Which full form correctly expands IMPS?",
      "According to the NPCI product name, IMPS is the abbreviation for what?",
    ], "IMPS stands for Immediate Payment Service and is designed as an instant electronic inter-bank fund-transfer service."),
    s("com004-transfer-comparison", "SERVICE_COMPARISON", "CONTRAST_DISCRIMINATION", "NEFT uses batch settlement, while RTGS settles transactions individually in real time on a gross basis", ["NEFT and RTGS are both only end-of-day systems", "RTGS settles only after transactions are netted into batches", "NEFT and RTGS have identical settlement models"], [
      "Which statement correctly distinguishes the durable settlement models of NEFT and RTGS?",
      "Which comparison of NEFT and RTGS is technically accurate without relying on changing limits or charges?",
      "A question asks for the core settlement-model difference between NEFT and RTGS. Which option is correct?",
    ], "NEFT uses a batch-based settlement model, whereas RTGS processes and settles transactions individually in real time on a gross basis. Monetary limits and charges are intentionally not used as the discriminator."),
  ],

  "COM-004-QL-018": [
    s("com004-safe-otp", "CREDENTIAL_SECRECY", "CONTEXT_SELECTION", "Do not share the OTP", ["Share it if the caller knows your name", "Read it out to speed up a refund", "Post it in the support chat"], [
      "A caller claiming to be from a bank asks for the OTP received on your phone. What should you do?",
      "Someone says an OTP is needed to reverse a failed transaction and asks you to reveal it. Which action is appropriate?",
      "Which response follows RBI consumer-safety guidance when another person asks for your OTP?",
    ], "RBI consumer guidance says an OTP is confidential and should not be shared with another person. A caller's claimed identity or urgency does not make disclosure appropriate."),
    s("com004-safe-pin", "CREDENTIAL_SECRECY", "CONTEXT_SELECTION", "Keep the PIN confidential", ["Tell it to a merchant for verification", "Share it with a caller from 'support'", "Write it in a public message"], [
      "Which action is appropriate for a banking or card PIN?",
      "A person claiming to assist with a card issue asks for the card PIN. What should the cardholder do?",
      "Which choice follows the basic credential-secrecy rule for a PIN?",
    ], "A PIN is a confidential credential and should not be disclosed to another person. Genuine assistance should not require revealing the PIN."),
    s("com004-safe-suspicious-link", "SAFE_ACTION_FROM_SCENARIO", "CONTEXT_SELECTION", "Avoid the link and use a verified official banking channel", ["Open the link and enter credentials immediately", "Forward the link to contacts before checking it", "Enter the password first and verify the site later"], [
      "An unsolicited message contains a link asking you to sign in to your bank account urgently. What is the safer action?",
      "A banking link arrives from an unknown sender and requests login details. Which response best follows regulator-backed safety guidance?",
      "Before entering banking credentials after receiving an unexpected link, what should a user do?",
    ], "Do not rely on an unsolicited link for credential entry. Use a verified official bank channel and confirm the entity or destination independently before acting."),
    s("com004-safe-report", "RESPONSE_SELECTION", "CONTEXT_SELECTION", "Report the unauthorised transaction promptly through the bank's official channel", ["Ignore it until the next statement arrives", "Reply to an unknown message with the PIN", "Post the account password publicly to seek help"], [
      "A customer notices an unauthorised digital-banking transaction. What should be done?",
      "Which response is appropriate after detecting a transaction you did not authorise?",
      "Regulator-backed consumer guidance supports which immediate action when an unauthorised banking transaction is noticed?",
    ], "An unauthorised transaction should be reported promptly through the bank's official reporting channel. Delaying or exposing credentials creates additional risk."),
  ],
} as const;

export function auditCom004ReviewSeedBank() {
  const issues: string[] = [];
  const qlIds = Object.keys(COM004_REVIEW_SEEDS_BY_QL).sort();
  const expected = Array.from({ length: 18 }, (_, index) => `COM-004-QL-${String(index + 1).padStart(3, "0")}`);
  if (JSON.stringify(qlIds) !== JSON.stringify(expected)) issues.push("SEED_BANK_QL_SET_MISMATCH");

  for (const [qlId, seeds] of Object.entries(COM004_REVIEW_SEEDS_BY_QL)) {
    if (seeds.length !== 4) issues.push(`UNEXPECTED_SEED_COUNT:${qlId}:${seeds.length}`);
    const stems = new Set<string>();
    for (const seed of seeds) {
      if (seed.stems.length !== 3) issues.push(`UNEXPECTED_STEM_VARIANT_COUNT:${qlId}:${seed.factId}`);
      if (new Set([seed.answer, ...seed.distractors].map((value) => value.trim().toLowerCase())).size !== 4) {
        issues.push(`DUPLICATE_OPTION_TEXT:${qlId}:${seed.factId}`);
      }
      if (seed.explanation.trim().length < 80) issues.push(`THIN_EXPLANATION:${qlId}:${seed.factId}`);
      for (const stem of seed.stems) {
        const normalized = stem.trim().toLowerCase();
        if (stems.has(normalized)) issues.push(`DUPLICATE_STEM:${qlId}:${normalized}`);
        stems.add(normalized);
        if (!stem.trim().endsWith("?")) issues.push(`NON_QUESTION_STEM:${qlId}:${stem}`);
      }
    }
    if (stems.size !== 12) issues.push(`QL_DOES_NOT_HAVE_12_UNIQUE_STEMS:${qlId}:${stems.size}`);
  }

  return { valid: issues.length === 0, qlCount: qlIds.length, seedCount: Object.values(COM004_REVIEW_SEEDS_BY_QL).flat().length, issues };
}
