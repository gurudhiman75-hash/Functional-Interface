import {
  COM003_WORD_TABS_SOURCE_AUTHORITIES,
  auditCom003WordTabsSources,
} from "./com003-word-tabs-source-authority-v1";

export type Com003WordTabsLanguage = "en" | "hi" | "pa";
export type Com003WordTabsDifficulty = "EASY" | "MEDIUM";
export type Com003WordTabsFamily = "DIRECT_RECALL" | "FUNCTIONAL_APPLICATION" | "EXAMPLE_RECOGNITION" | "CONTRAST_DISCRIMINATION";

type LocalizedCopy = {
  stem: string;
  options: readonly string[];
  canonicalAnswer: string;
  explanation: string;
};

type WordTabsDefinition = {
  qlId: string;
  targetFactId: string;
  surfaceMode: string;
  examSurfaceFamily: Com003WordTabsFamily;
  difficulty: Com003WordTabsDifficulty;
  correctIndex: number;
  en: LocalizedCopy;
  hi: LocalizedCopy;
  pa: LocalizedCopy;
};

export const COM003_WORD_TABS_QLS = Object.freeze([
  { qlId: "COM-003-QL-020", title: "Word Interface, Ribbon & File Tab", tab: "Interface / File", sourceIds: ["MICROSOFT-WORD-RIBBON-2026", "MICROSOFT-WORD-NEW-USERS-2026", "MICROSOFT-WORD-SHORTCUTS-2026"] },
  { qlId: "COM-003-QL-021", title: "Word Home Tab", tab: "Home", sourceIds: ["MICROSOFT-WORD-FORMAT-PAINTER-2026", "MICROSOFT-WORD-SHORTCUTS-2026"] },
  { qlId: "COM-003-QL-022", title: "Word Insert Tab", tab: "Insert", sourceIds: ["MICROSOFT-WORD-INSERT-TABLE-2026", "MICROSOFT-WORD-INSERT-PICTURES-2026", "MICROSOFT-WORD-INSERT-HEADER-FOOTER-2026", "MICROSOFT-WORD-INSERT-PAGE-NUMBERS-2026", "MICROSOFT-WORD-INSERT-BREAKS-2026"] },
  { qlId: "COM-003-QL-023", title: "Word Design Tab", tab: "Design", sourceIds: ["MICROSOFT-WORD-DESIGN-THEME-2026", "MICROSOFT-WORD-DESIGN-BORDER-2026"] },
  { qlId: "COM-003-QL-024", title: "Word Layout Tab", tab: "Layout", sourceIds: ["MICROSOFT-WORD-LAYOUT-2026", "MICROSOFT-WORD-COLUMNS-2026", "MICROSOFT-WORD-INSERT-BREAKS-2026"] },
  { qlId: "COM-003-QL-025", title: "Word References Tab", tab: "References", sourceIds: ["MICROSOFT-WORD-REFERENCES-FOOTNOTES-2026", "MICROSOFT-WORD-REFERENCES-TOC-2026", "MICROSOFT-WORD-REFERENCES-CITATIONS-2026"] },
  { qlId: "COM-003-QL-026", title: "Word Mailings Tab", tab: "Mailings", sourceIds: ["MICROSOFT-WORD-MAIL-MERGE-2026", "MICROSOFT-WORD-MAIL-MERGE-PREVIEW-2026"] },
  { qlId: "COM-003-QL-027", title: "Word Review Tab", tab: "Review", sourceIds: ["MICROSOFT-WORD-REVIEW-TRACK-CHANGES-2026", "MICROSOFT-WORD-REVIEW-EDITOR-2026"] },
  { qlId: "COM-003-QL-028", title: "Word View Tab", tab: "View", sourceIds: ["MICROSOFT-WORD-VIEWS-2026", "MICROSOFT-WORD-RULER-2026"] },
  { qlId: "COM-003-QL-029", title: "Word File Tab & Backstage", tab: "File", sourceIds: ["MICROSOFT-WORD-NEW-USERS-2026", "MICROSOFT-WORD-SHORTCUTS-2026"] },
] as const);

const qlById = new Map(COM003_WORD_TABS_QLS.map((item) => [item.qlId, item]));

const D: readonly WordTabsDefinition[] = [
  {
    qlId: "COM-003-QL-020", targetFactId: "com003-word-tabs-ribbon-groups", surfaceMode: "STRUCTURE_FROM_DEFINITION", examSurfaceFamily: "DIRECT_RECALL", difficulty: "EASY", correctIndex: 0,
    en: { stem: "What does a group on the Word Ribbon contain?", options: ["Related commands", "Only document pages", "Only file names", "Only spelling errors"], canonicalAnswer: "Related commands", explanation: "A Ribbon group collects related commands so they can be used together." },
    hi: { stem: "Word Ribbon के एक समूह में क्या होता है?", options: ["संबंधित कमांड", "केवल दस्तावेज़ पृष्ठ", "केवल फ़ाइल नाम", "केवल वर्तनी त्रुटियाँ"], canonicalAnswer: "संबंधित कमांड", explanation: "Ribbon समूह संबंधित कमांड को एक साथ रखता है ताकि उनका उपयोग साथ किया जा सके।" },
    pa: { stem: "Word Ribbon ਦੇ ਇੱਕ ਸਮੂਹ ਵਿੱਚ ਕੀ ਹੁੰਦਾ ਹੈ?", options: ["ਸੰਬੰਧਿਤ ਕਮਾਂਡਾਂ", "ਸਿਰਫ਼ ਦਸਤਾਵੇਜ਼ ਪੰਨੇ", "ਸਿਰਫ਼ ਫ਼ਾਈਲ ਨਾਮ", "ਸਿਰਫ਼ ਸ਼ਬਦ-ਜੋੜ ਗਲਤੀਆਂ"], canonicalAnswer: "ਸੰਬੰਧਿਤ ਕਮਾਂਡਾਂ", explanation: "Ribbon ਸਮੂਹ ਸੰਬੰਧਿਤ ਕਮਾਂਡਾਂ ਨੂੰ ਇਕੱਠਾ ਰੱਖਦਾ ਹੈ ਤਾਂ ਜੋ ਉਹਨਾਂ ਨੂੰ ਇਕੱਠੇ ਵਰਤਿਆ ਜਾ ਸਕੇ।" },
  },
  {
    qlId: "COM-003-QL-020", targetFactId: "com003-word-tabs-quick-access-toolbar", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which Word interface area gives quick access to frequently used commands such as Save?", options: ["Status Bar", "Quick Access Toolbar", "Navigation Pane", "Ruler"], canonicalAnswer: "Quick Access Toolbar", explanation: "The Quick Access Toolbar provides quick access to commonly used commands such as Save and Undo." },
    hi: { stem: "Save जैसे बार-बार उपयोग होने वाले कमांड तक जल्दी पहुँच किस Word क्षेत्र से मिलती है?", options: ["Status Bar", "Quick Access Toolbar", "Navigation Pane", "स्केल"], canonicalAnswer: "Quick Access Toolbar", explanation: "Quick Access Toolbar Save और पूर्ववत करें जैसे सामान्य कमांड तक जल्दी पहुँच देता है।" },
    pa: { stem: "Save ਵਰਗੇ ਵਾਰ-ਵਾਰ ਵਰਤੇ ਜਾਣ ਵਾਲੇ ਕਮਾਂਡਾਂ ਤੱਕ ਤੁਰੰਤ ਪਹੁੰਚ Word ਦੇ ਕਿਹੜੇ ਖੇਤਰ ਤੋਂ ਮਿਲਦੀ ਹੈ?", options: ["Status Bar", "Quick Access Toolbar", "Navigation Pane", "ਪੈਮਾਨਾ"], canonicalAnswer: "Quick Access Toolbar", explanation: "Quick Access Toolbar Save ਅਤੇ ਵਾਪਸ ਕਰੋ ਵਰਗੇ ਆਮ ਕਮਾਂਡਾਂ ਤੱਕ ਤੁਰੰਤ ਪਹੁੰਚ ਦਿੰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-020", targetFactId: "com003-word-tabs-title-bar", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "DIRECT_RECALL", difficulty: "EASY", correctIndex: 2,
    en: { stem: "Which Word interface area normally shows the document title?", options: ["Ribbon", "Status Bar", "Title Bar", "Scroll Bar"], canonicalAnswer: "Title Bar", explanation: "The Title Bar normally displays the name of the document and the application." },
    hi: { stem: "कौन-सा Word इंटरफ़ेस क्षेत्र सामान्यतः दस्तावेज़ का शीर्षक दिखाता है?", options: ["Ribbon", "Status Bar", "Title Bar", "Scroll Bar"], canonicalAnswer: "Title Bar", explanation: "Title Bar सामान्यतः दस्तावेज़ का नाम और अनुप्रयोग का नाम दिखाता है।" },
    pa: { stem: "ਕਿਹੜਾ Word ਇੰਟਰਫੇਸ ਖੇਤਰ ਆਮ ਤੌਰ ਉੱਤੇ ਦਸਤਾਵੇਜ਼ ਦਾ ਸਿਰਲੇਖ ਦਿਖਾਉਂਦਾ ਹੈ?", options: ["Ribbon", "Status Bar", "Title Bar", "Scroll Bar"], canonicalAnswer: "Title Bar", explanation: "Title Bar ਆਮ ਤੌਰ ਉੱਤੇ ਦਸਤਾਵੇਜ਼ ਦਾ ਨਾਮ ਅਤੇ ਐਪਲੀਕੇਸ਼ਨ ਦਾ ਨਾਮ ਦਿਖਾਉਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-020", targetFactId: "com003-word-tabs-status-bar", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 3,
    en: { stem: "Where can a user commonly see page and word-count information in Word?", options: ["Title Bar", "Home tab", "Quick Access Toolbar", "Status Bar"], canonicalAnswer: "Status Bar", explanation: "The Status Bar commonly shows document information such as page position and word count." },
    hi: { stem: "Word में पृष्ठ और शब्द-गिनती जानकारी सामान्यतः कहाँ दिखाई देती है?", options: ["Title Bar", "Home टैब", "Quick Access Toolbar", "Status Bar"], canonicalAnswer: "Status Bar", explanation: "Status Bar पृष्ठ स्थिति और शब्द गिनती जैसी दस्तावेज़ जानकारी दिखा सकता है।" },
    pa: { stem: "Word ਵਿੱਚ ਪੰਨਾ ਅਤੇ ਸ਼ਬਦ-ਗਿਣਤੀ ਜਾਣਕਾਰੀ ਆਮ ਤੌਰ ਉੱਤੇ ਕਿੱਥੇ ਦਿਖਾਈ ਦਿੰਦੀ ਹੈ?", options: ["Title Bar", "Home ਟੈਬ", "Quick Access Toolbar", "Status Bar"], canonicalAnswer: "Status Bar", explanation: "Status Bar ਪੰਨਾ ਸਥਿਤੀ ਅਤੇ ਸ਼ਬਦ ਗਿਣਤੀ ਵਰਗੀ ਦਸਤਾਵੇਜ਼ ਜਾਣਕਾਰੀ ਦਿਖਾ ਸਕਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-020", targetFactId: "com003-word-tabs-file-backstage", surfaceMode: "TAB_TO_WORKSPACE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 0,
    en: { stem: "What opens when the File tab is selected in desktop Word?", options: ["Backstage view", "The ruler", "The spelling dictionary", "A worksheet"], canonicalAnswer: "Backstage view", explanation: "The File tab opens Backstage view, where document and file commands are managed." },
    hi: { stem: "डेस्कटॉप Word में File टैब चुनने पर क्या खुलता है?", options: ["Backstage दृश्य", "स्केल", "Spelling शब्दकोश", "कार्यपत्रक"], canonicalAnswer: "Backstage दृश्य", explanation: "File टैब Backstage दृश्य खोलता है, जहाँ दस्तावेज़ और फ़ाइल कमांड संभाले जाते हैं।" },
    pa: { stem: "ਡੈਸਕਟਾਪ Word ਵਿੱਚ File ਟੈਬ ਚੁਣਨ ਨਾਲ ਕੀ ਖੁੱਲ੍ਹਦਾ ਹੈ?", options: ["Backstage ਦ੍ਰਿਸ਼", "ਪੈਮਾਨਾ", "Spelling ਸ਼ਬਦਕੋਸ਼", "ਵਰਕਸ਼ੀਟ"], canonicalAnswer: "Backstage ਦ੍ਰਿਸ਼", explanation: "File ਟੈਬ Backstage ਦ੍ਰਿਸ਼ ਖੋਲ੍ਹਦਾ ਹੈ, ਜਿੱਥੇ ਦਸਤਾਵੇਜ਼ ਅਤੇ ਫ਼ਾਈਲ ਕਮਾਂਡਾਂ ਸੰਭਾਲੇ ਜਾਂਦੇ ਹਨ।" },
  },
  {
    qlId: "COM-003-QL-020", targetFactId: "com003-word-tabs-dialog-launcher", surfaceMode: "CONTROL_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "MEDIUM", correctIndex: 1,
    en: { stem: "What does a dialog box launcher in a Ribbon group usually open?", options: ["A new document", "More detailed settings", "A slide show", "The Windows desktop"], canonicalAnswer: "More detailed settings", explanation: "A dialog box launcher opens a dialog box with more detailed options for that group." },
    hi: { stem: "Ribbon समूह में संवाद बॉक्स लॉन्चर सामान्यतः क्या खोलता है?", options: ["नया दस्तावेज़", "अधिक विस्तृत सेटिंग्स", "स्लाइड दिखाना", "विंडोज़ डेस्कटॉप"], canonicalAnswer: "अधिक विस्तृत सेटिंग्स", explanation: "संवाद बॉक्स लॉन्चर उस समूह की अधिक विस्तृत विकल्प वाली संवाद बॉक्स खोलता है।" },
    pa: { stem: "Ribbon ਸਮੂਹ ਵਿੱਚ ਸੰਵਾਦ ਬਾਕਸ ਲਾਂਚਰ ਆਮ ਤੌਰ ਉੱਤੇ ਕੀ ਖੋਲ੍ਹਦਾ ਹੈ?", options: ["ਨਵਾਂ ਦਸਤਾਵੇਜ਼", "ਹੋਰ ਵਿਸਥਾਰ ਵਾਲਾ ਸੈਟਿੰਗਾਂ", "ਸਲਾਈਡ ਦਿਖਾਉਣਾ", "ਵਿੰਡੋਜ਼ ਡੈਸਕਟਾਪ"], canonicalAnswer: "ਹੋਰ ਵਿਸਥਾਰ ਵਾਲਾ ਸੈਟਿੰਗਾਂ", explanation: "ਸੰਵਾਦ ਬਾਕਸ ਲਾਂਚਰ ਉਸ ਸਮੂਹ ਦੀਆਂ ਹੋਰ ਵਿਸਥਾਰ ਵਾਲਾ ਵਿਕਲਪ ਵਾਲੀ ਸੰਵਾਦ ਬਾਕਸ ਖੋਲ੍ਹਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-020", targetFactId: "com003-word-tabs-contextual-tab", surfaceMode: "FEATURE_FROM_EVENT", examSurfaceFamily: "EXAMPLE_RECOGNITION", difficulty: "MEDIUM", correctIndex: 2,
    en: { stem: "What type of Word tab may appear when a picture or table is selected?", options: ["Permanent system tab", "Only the File tab", "Contextual tab", "A worksheet tab"], canonicalAnswer: "Contextual tab", explanation: "A contextual tab appears for a selected object and provides commands related to that object." },
    hi: { stem: "चित्र या तालिका चुनना करने पर Word में किस प्रकार का टैब दिखाई दे सकता है?", options: ["स्थायी प्रणाली टैब", "केवल File टैब", "Contextual टैब", "कार्यपत्रक टैब"], canonicalAnswer: "Contextual टैब", explanation: "Contextual टैब चुने गए वस्तु से संबंधित कमांड दिखाता है और वस्तु चुनना होने पर दिखाई दे सकता है।" },
    pa: { stem: "ਤਸਵੀਰ ਜਾਂ ਟੇਬਲ ਚੁਣਨਾ ਕਰਨ ਨਾਲ Word ਵਿੱਚ ਕਿਹੜੀ ਕਿਸਮ ਦਾ ਟੈਬ ਦਿਖ ਸਕਦਾ ਹੈ?", options: ["ਸਥਾਈ ਪ੍ਰਣਾਲੀ ਟੈਬ", "ਸਿਰਫ਼ File ਟੈਬ", "Contextual ਟੈਬ", "ਵਰਕਸ਼ੀਟ ਟੈਬ"], canonicalAnswer: "Contextual ਟੈਬ", explanation: "Contextual ਟੈਬ ਚੁਣੇ ਵਸਤੂ ਨਾਲ ਸੰਬੰਧਿਤ ਕਮਾਂਡਾਂ ਦਿਖਾਉਂਦਾ ਹੈ ਅਤੇ ਵਸਤੂ ਚੁਣਨਾ ਹੋਣ ਉੱਤੇ ਆ ਸਕਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-020", targetFactId: "com003-word-tabs-tab-command-ownership", surfaceMode: "TAB_TO_FEATURE", examSurfaceFamily: "CONTRAST_DISCRIMINATION", difficulty: "MEDIUM", correctIndex: 3,
    en: { stem: "Which Word feature is mainly found on the Home tab rather than the View tab?", options: ["Ruler", "Zoom", "Navigation Pane", "Bold"], canonicalAnswer: "Bold", explanation: "Bold is a character-formatting command on the Home tab; the View tab controls viewing tools such as Zoom and Ruler." },
    hi: { stem: "कौन-सा Word सुविधा दृश्य टैब के बजाय मुख्य रूप से Home टैब पर मिलता है?", options: ["स्केल", "Zoom", "Navigation Pane", "गाढ़ा"], canonicalAnswer: "गाढ़ा", explanation: "गाढ़ा Home टैब का अक्षर-स्वरूपण कमांड है; दृश्य टैब Zoom और स्केल जैसे दृश्य देखना उपकरण संभालता है।" },
    pa: { stem: "ਕਿਹੜਾ Word ਵਿਸ਼ੇਸ਼ਤਾ ਦ੍ਰਿਸ਼ ਟੈਬ ਦੀ ਬਜਾਏ ਮੁੱਖ ਤੌਰ ਉੱਤੇ Home ਟੈਬ ਉੱਤੇ ਮਿਲਦਾ ਹੈ?", options: ["ਪੈਮਾਨਾ", "Zoom", "Navigation Pane", "ਗੂੜ੍ਹਾ"], canonicalAnswer: "ਗੂੜ੍ਹਾ", explanation: "ਗੂੜ੍ਹਾ Home ਟੈਬ ਦਾ ਅੱਖਰ-ਸਜਾਵਟ ਕਮਾਂਡ ਹੈ; ਦ੍ਰਿਸ਼ ਟੈਬ Zoom ਅਤੇ ਪੈਮਾਨਾ ਵਰਗੇ ਦੇਖਣ ਸਾਧਨ ਸੰਭਾਲਦਾ ਹੈ।" },
  },

  {
    qlId: "COM-003-QL-021", targetFactId: "com003-word-home-clipboard", surfaceMode: "GROUP_FROM_COMMAND", examSurfaceFamily: "DIRECT_RECALL", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Which Home-tab group contains common Cut, Copy and Paste commands?", options: ["Clipboard", "Font", "Styles", "Editing"], canonicalAnswer: "Clipboard", explanation: "The Clipboard group contains common Cut, Copy and Paste commands." },
    hi: { stem: "काटें, कॉपी और पेस्ट कमांड किस Home टैबटैब समूह में होते हैं?", options: ["Clipboard", "Font", "Styles", "संपादन"], canonicalAnswer: "Clipboard", explanation: "Clipboard समूह में काटें, कॉपी और पेस्ट जैसे सामान्य कमांड होते हैं।" },
    pa: { stem: "ਕੱਟੋ, ਕਾਪੀ ਅਤੇ ਪੇਸਟ ਕਮਾਂਡਾਂ ਕਿਹੜੇ Home ਟੈਬਟੈਬ ਸਮੂਹ ਵਿੱਚ ਹੁੰਦੇ ਹਨ?", options: ["Clipboard", "Font", "Styles", "ਸੋਧ"], canonicalAnswer: "Clipboard", explanation: "Clipboard ਸਮੂਹ ਵਿੱਚ ਕੱਟੋ, ਕਾਪੀ ਅਤੇ ਪੇਸਟ ਵਰਗੇ ਆਮ ਕਮਾਂਡਾਂ ਹੁੰਦੇ ਹਨ।" },
  },
  {
    qlId: "COM-003-QL-021", targetFactId: "com003-word-home-format-painter", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which Home-tab tool copies formatting from one selection to another?", options: ["Replace", "Format Painter", "Word Count", "Translate"], canonicalAnswer: "Format Painter", explanation: "Format Painter copies formatting such as font, size and style to another selection." },
    hi: { stem: "एक चयन की स्वरूपण को दूसरी चयन पर कॉपी करने वाला Home टैबटैब उपकरण कौन-सा है?", options: ["Replace", "Format Painter", "Word Count", "Translate"], canonicalAnswer: "Format Painter", explanation: "Format Painter फ़ॉन्ट, आकार और शैली जैसी स्वरूपण को दूसरी चयन पर कॉपी करता है।" },
    pa: { stem: "ਇੱਕ ਚੋਣ ਦੀ ਸਜਾਵਟ ਨੂੰ ਦੂਜੀ ਚੋਣ ਉੱਤੇ ਕਾਪੀ ਕਰਨ ਵਾਲਾ Home ਟੈਬਟੈਬ ਸਾਧਨ ਕਿਹੜਾ ਹੈ?", options: ["Replace", "Format Painter", "Word Count", "Translate"], canonicalAnswer: "Format Painter", explanation: "Format Painter ਫੌਂਟ, ਆਕਾਰ ਅਤੇ ਸ਼ੈਲੀ ਵਰਗੀ ਸਜਾਵਟ ਨੂੰ ਦੂਜੀ ਚੋਣ ਉੱਤੇ ਕਾਪੀ ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-021", targetFactId: "com003-word-home-font-group", surfaceMode: "GROUP_FROM_EFFECT", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 3,
    en: { stem: "Which Home-tab group changes font name, size and character style?", options: ["Paragraph", "Clipboard", "Editing", "Font"], canonicalAnswer: "Font", explanation: "The Font group controls character settings such as font name, size, bold and italic." },
    hi: { stem: "Font नाम, आकार और अक्षर शैली बदलने वाला Home टैबटैब समूह कौन-सा है?", options: ["Paragraph", "Clipboard", "संपादन", "Font"], canonicalAnswer: "Font", explanation: "Font समूह फ़ॉन्ट नाम, आकार, गाढ़ा और तिरछा जैसी अक्षर सेटिंग्स संभालता है।" },
    pa: { stem: "Font ਨਾਮ, ਆਕਾਰ ਅਤੇ ਅੱਖਰ ਸ਼ੈਲੀ ਬਦਲਣ ਵਾਲਾ Home ਟੈਬਟੈਬ ਸਮੂਹ ਕਿਹੜਾ ਹੈ?", options: ["Paragraph", "Clipboard", "ਸੋਧ", "Font"], canonicalAnswer: "Font", explanation: "Font ਸਮੂਹ ਫੌਂਟ ਨਾਮ, ਆਕਾਰ, ਗੂੜ੍ਹਾ ਅਤੇ ਤਿਰਛਾ ਵਰਗੀਆਂ ਅੱਖਰ ਸੈਟਿੰਗਾਂ ਸੰਭਾਲਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-021", targetFactId: "com003-word-home-alignment", surfaceMode: "FEATURE_FROM_EFFECT", examSurfaceFamily: "EXAMPLE_RECOGNITION", difficulty: "EASY", correctIndex: 3,
    en: { stem: "Which Home-tab command controls whether a paragraph is left, centred, right or justified?", options: ["Font Color", "Change Case", "Text Highlight", "Paragraph alignment"], canonicalAnswer: "Paragraph alignment", explanation: "Paragraph alignment controls the horizontal position of paragraph text." },
    hi: { stem: "Paragraph को बायाँ, केंद्रित, दायाँ या समायोजित करने वाला Home टैबटैब कमांड कौन-सा है?", options: ["Font Color", "Change Case", "Text Highlight", "Paragraph संरेखण"], canonicalAnswer: "Paragraph संरेखण", explanation: "Paragraph संरेखण अनुच्छेद पाठ की क्षैतिज स्थिति नियंत्रित करता है।" },
    pa: { stem: "Paragraph ਨੂੰ ਖੱਬਾ, ਕੇਂਦਰਿਤ, ਸੱਜਾ ਜਾਂ ਬਰਾਬਰ ਕਰਨ ਵਾਲਾ Home ਟੈਬਟੈਬ ਕਮਾਂਡ ਕਿਹੜਾ ਹੈ?", options: ["Font Color", "Change Case", "Text Highlight", "Paragraph ਸੰਰેખਣ"], canonicalAnswer: "Paragraph ਸੰਰેખਣ", explanation: "Paragraph ਸੰਰેખਣ ਪੈਰਾਗ੍ਰਾਫ ਲਿਖਤ ਦੀ ਲੇਟਵਾਂ ਸਥਿਤੀ ਨੂੰ ਨਿਯੰਤਰਿਤ ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-021", targetFactId: "com003-word-home-bullets", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Which Home-tab feature is used to create an unordered list?", options: ["Bullets", "Numbering", "Sort", "Borders"], canonicalAnswer: "Bullets", explanation: "Bullets create an unordered list in which items are marked without a sequence number." },
    hi: { stem: "अक्रमित सूची बनाने के लिए Home टैब का कौन-सा सुविधा उपयोग होता है?", options: ["बुलेट", "क्रमांकन", "Sort", "Borders"], canonicalAnswer: "बुलेट", explanation: "बुलेट अक्रमित सूची बनाते हैं जिसमें वस्तुएँ को क्रम संख्या के बिना चिन्हित किया जाता है।" },
    pa: { stem: "ਬਿਨਾਂ ਕ੍ਰਮ ਵਾਲੀ ਸੂਚੀ ਬਣਾਉਣ ਲਈ Home ਟੈਬ ਦਾ ਕਿਹੜਾ ਵਿਸ਼ੇਸ਼ਤਾ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?", options: ["ਬੁਲੇਟ", "ਕ੍ਰਮ-ਅੰਕਣ", "Sort", "Borders"], canonicalAnswer: "ਬੁਲੇਟ", explanation: "ਬੁਲੇਟ ਬਿਨਾਂ ਕ੍ਰਮ ਵਾਲੀ ਸੂਚੀ ਬਣਾਉਂਦੇ ਹਨ ਜਿਸ ਵਿੱਚ ਵਸਤੂਆਂ ਨੂੰ ਕ੍ਰਮ ਅੰਕ ਤੋਂ ਬਿਨਾਂ ਨਿਸ਼ਾਨ ਲਾਇਆ ਜਾਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-021", targetFactId: "com003-word-home-styles", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which Home-tab area applies a coordinated set of formatting to text?", options: ["Clipboard", "Styles", "Editing", "Voice"], canonicalAnswer: "Styles", explanation: "The Styles gallery applies a coordinated set of formatting, such as a heading style, to text." },
    hi: { stem: "पाठ पर समन्वित स्वरूपण लागू करने वाला Home टैबटैब क्षेत्र कौन-सा है?", options: ["Clipboard", "Styles", "संपादन", "आवाज़"], canonicalAnswer: "Styles", explanation: "Styles गैलरी पाठ पर शीर्षक शैली जैसी समन्वित स्वरूपण लागू करती है।" },
    pa: { stem: "ਲਿਖਤ ਉੱਤੇ ਸਮਨਵਿਤ ਸਜਾਵਟ ਲਾਗੂ ਕਰਨ ਵਾਲਾ Home ਟੈਬਟੈਬ ਖੇਤਰ ਕਿਹੜਾ ਹੈ?", options: ["Clipboard", "Styles", "ਸੋਧ", "ਆਵਾਜ਼"], canonicalAnswer: "Styles", explanation: "Styles ਗੈਲਰੀ ਲਿਖਤ ਉੱਤੇ ਸਿਰਲੇਖ ਸ਼ੈਲੀ ਵਰਗੀ ਸਮਨਵਿਤ ਸਜਾਵਟ ਲਾਗੂ ਕਰਦੀ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-021", targetFactId: "com003-word-home-find", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 2,
    en: { stem: "Which Home-tab command locates a word or phrase without changing it?", options: ["Replace", "Select All", "Find", "Format Painter"], canonicalAnswer: "Find", explanation: "Find searches for a word or phrase; Replace is used when the found text must be changed." },
    hi: { stem: "Word या वाक्यांश को बिना बदले ढूँढना करने वाला Home टैबटैब कमांड कौन-सा है?", options: ["Replace", "चुनना सभी", "ढूँढना", "Format Painter"], canonicalAnswer: "ढूँढना", explanation: "ढूँढना शब्द या वाक्यांश खोजता है; मिले हुए पाठ को बदलने के लिए Replace उपयोग होता है।" },
    pa: { stem: "Word ਜਾਂ ਵਾਕ-ਅੰਸ਼ ਨੂੰ ਬਦਲੇ ਬਿਨਾਂ ਲੱਭਣਾ ਕਰਨ ਵਾਲਾ Home ਟੈਬਟੈਬ ਕਮਾਂਡ ਕਿਹੜਾ ਹੈ?", options: ["Replace", "ਚੁਣਨਾ ਸਾਰੇ", "ਲੱਭਣਾ", "Format Painter"], canonicalAnswer: "ਲੱਭਣਾ", explanation: "ਲੱਭਣਾ ਸ਼ਬਦ ਜਾਂ ਵਾਕ-ਅੰਸ਼ ਖੋਜਦਾ ਹੈ; ਮਿਲੇ ਲਿਖਤ ਨੂੰ ਬਦਲਣ ਲਈ Replace ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-021", targetFactId: "com003-word-home-replace", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "CONTRAST_DISCRIMINATION", difficulty: "MEDIUM", correctIndex: 3,
    en: { stem: "Which Home-tab command changes every matching occurrence of a word or phrase?", options: ["Find", "Select", "Sort", "Replace All"], canonicalAnswer: "Replace All", explanation: "Replace All changes every matching occurrence of the specified text in the document." },
    hi: { stem: "किस Home टैबटैब कमांड से शब्द या वाक्यांश की सभी मिलान उपस्थितियाँ बदली जाती हैं?", options: ["ढूँढना", "चुनना", "Sort", "Replace सभी"], canonicalAnswer: "Replace सभी", explanation: "Replace सभी दस्तावेज़ में निर्दिष्ट पाठ की हर मिलान उपस्थिति बदलता है।" },
    pa: { stem: "ਕਿਹੜੇ Home ਟੈਬਟੈਬ ਕਮਾਂਡ ਨਾਲ ਸ਼ਬਦ ਜਾਂ ਵਾਕ-ਅੰਸ਼ ਦੀਆਂ ਸਾਰੀਆਂ ਮਿਲਾਨ ਮੌਜੂਦਗੀਆਂ ਬਦਲੀਆਂ ਜਾਂਦੀਆਂ ਹਨ?", options: ["ਲੱਭਣਾ", "ਚੁਣਨਾ", "Sort", "Replace ਸਾਰੇ"], canonicalAnswer: "Replace ਸਾਰੇ", explanation: "Replace ਸਾਰੇ ਦਸਤਾਵੇਜ਼ ਵਿੱਚ ਨਿਰਧਾਰਤ ਲਿਖਤ ਦੀ ਹਰ ਮਿਲਾਨ ਮੌਜੂਦਗੀ ਬਦਲਦਾ ਹੈ।" },
  },

  {
    qlId: "COM-003-QL-022", targetFactId: "com003-word-insert-table", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Which Insert-tab feature organizes information in rows and columns?", options: ["Table", "WordArt", "Bookmark", "Equation"], canonicalAnswer: "Table", explanation: "A table organizes information in rows and columns." },
    hi: { stem: "पंक्तियाँ और स्तंभ में जानकारी व्यवस्थित करने वाला Insert टैबटैब सुविधा कौन-सा है?", options: ["तालिका", "WordArt", "बुकमार्क", "Equation"], canonicalAnswer: "तालिका", explanation: "तालिका जानकारी को पंक्तियाँ और स्तंभ में व्यवस्थित करता है।" },
    pa: { stem: "ਕਤਾਰਾਂ ਅਤੇ ਕਾਲਮ ਵਿੱਚ ਜਾਣਕਾਰੀ व्यवस्थित ਕਰਨ ਵਾਲਾ Insert ਟੈਬਟੈਬ ਵਿਸ਼ੇਸ਼ਤਾ ਕਿਹੜਾ ਹੈ?", options: ["ਟੇਬਲ", "WordArt", "ਬੁੱਕਮਾਰਕ", "Equation"], canonicalAnswer: "ਟੇਬਲ", explanation: "ਟੇਬਲ ਜਾਣਕਾਰੀ ਨੂੰ ਕਤਾਰਾਂ ਅਤੇ ਕਾਲਮ ਵਿੱਚ व्यवस्थित ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-022", targetFactId: "com003-word-insert-picture", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which Insert-tab feature adds a photograph or other image to a Word document?", options: ["Chart", "Pictures", "Footnote", "Caption"], canonicalAnswer: "Pictures", explanation: "Pictures inserts image content such as a photograph or illustration." },
    hi: { stem: "Word दस्तावेज़ में फ़ोटो या अन्य चित्र जोड़ने वाला Insert टैबटैब सुविधा कौन-सा है?", options: ["Chart", "Pictures", "Footnote", "Caption"], canonicalAnswer: "Pictures", explanation: "Pictures फ़ोटो या चित्रण जैसी चित्र सामग्री डालना करता है।" },
    pa: { stem: "Word ਦਸਤਾਵੇਜ਼ ਵਿੱਚ ਤਸਵੀਰ ਜਾਂ ਹੋਰ ਤਸਵੀਰ ਜੋੜਨ ਵਾਲਾ Insert ਟੈਬਟੈਬ ਵਿਸ਼ੇਸ਼ਤਾ ਕਿਹੜਾ ਹੈ?", options: ["Chart", "Pictures", "Footnote", "Caption"], canonicalAnswer: "Pictures", explanation: "Pictures ਤਸਵੀਰ ਜਾਂ ਚਿੱਤਰਣ ਵਰਗੀ ਤਸਵੀਰ ਸਮੱਗਰੀ ਸ਼ਾਮਲ ਕਰਨਾ ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-022", targetFactId: "com003-word-insert-shapes", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "DIRECT_RECALL", difficulty: "EASY", correctIndex: 2,
    en: { stem: "Which Insert-tab feature adds ready-made lines, arrows and geometric objects?", options: ["Header", "Symbol", "Shapes", "Page Number"], canonicalAnswer: "Shapes", explanation: "Shapes provides ready-made lines, arrows and geometric objects for insertion." },
    hi: { stem: "पहले से तैयार पंक्तियाँ, तीर और ज्यामितीय वस्तुएँ जोड़ने वाला Insert टैबटैब सुविधा कौन-सा है?", options: ["शीर्षलेख", "Symbol", "Shapes", "पृष्ठ Number"], canonicalAnswer: "Shapes", explanation: "Shapes सम्मिलन के लिए पहले से तैयार पंक्तियाँ, तीर और ज्यामितीय वस्तुएँ देता है।" },
    pa: { stem: "ਪਹਿਲਾਂ ਤੋਂ ਤਿਆਰ ਲਾਈਨਾਂ, ਤੀਰ ਅਤੇ ਜਿਆਮਿਤੀ ਵਸਤੂਆਂ ਜੋੜਨ ਵਾਲਾ Insert ਟੈਬਟੈਬ ਵਿਸ਼ੇਸ਼ਤਾ ਕਿਹੜਾ ਹੈ?", options: ["ਉੱਪਰਲਾ ਸਿਰਲੇਖ", "Symbol", "Shapes", "ਪੰਨਾ Number"], canonicalAnswer: "Shapes", explanation: "Shapes ਸ਼ਾਮਲ ਕਰਨਾ ਲਈ ਪਹਿਲਾਂ ਤੋਂ ਤਿਆਰ ਲਾਈਨਾਂ, ਤੀਰ ਅਤੇ ਜਿਆਮਿਤੀ ਵਸਤੂਆਂ ਦਿੰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-022", targetFactId: "com003-word-insert-smartart", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 3,
    en: { stem: "Which Insert-tab feature is designed to present a process or hierarchy visually?", options: ["Table", "Page Break", "Bookmark", "SmartArt"], canonicalAnswer: "SmartArt", explanation: "SmartArt provides visual layouts for processes, hierarchies and related information." },
    hi: { stem: "प्रक्रिया या पदानुक्रम को दृश्य रूप से प्रस्तुत करना करने के लिए कौन-सा Insert टैबटैब सुविधा बना है?", options: ["तालिका", "पृष्ठ विराम", "बुकमार्क", "SmartArt"], canonicalAnswer: "SmartArt", explanation: "SmartArt प्रक्रियाएँ, पदानुक्रम और संबंधित जानकारी के लिए दृश्य लेआउट देता है।" },
    pa: { stem: "ਪ੍ਰਕਿਰਿਆ ਜਾਂ ਪਦਾਨੁਕ੍ਰਮ ਨੂੰ ਦ੍ਰਿਸ਼ਟੀਗਤ ਤੌਰ ਉੱਤੇ ਪੇਸ਼ ਕਰਨਾ ਕਰਨ ਲਈ ਕਿਹੜਾ Insert ਟੈਬਟੈਬ ਵਿਸ਼ੇਸ਼ਤਾ ਬਣਿਆ ਹੈ?", options: ["ਟੇਬਲ", "ਪੰਨਾ ਵਿਰਾਮ", "ਬੁੱਕਮਾਰਕ", "SmartArt"], canonicalAnswer: "SmartArt", explanation: "SmartArt ਪ੍ਰਕਿਰਿਆਵਾਂ, ਪਦਾਨੁਕ੍ਰਮ ਅਤੇ ਸੰਬੰਧਿਤ ਜਾਣਕਾਰੀ ਲਈ ਦ੍ਰਿਸ਼ ਲੇਆਉਟ ਦਿੰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-022", targetFactId: "com003-word-insert-header-footer", surfaceMode: "TAB_TO_FEATURE", examSurfaceFamily: "DIRECT_RECALL", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Where does Word place the command for adding a header or footer?", options: ["Insert tab", "Design tab", "Review tab", "View tab"], canonicalAnswer: "Insert tab", explanation: "Word places Header and Footer commands on the Insert tab." },
    hi: { stem: "शीर्षलेख या पादलेख जोड़ने का कमांड Word में कहाँ होता है?", options: ["Insert टैब", "डिज़ाइन टैब", "समीक्षा टैब", "दृश्य टैब"], canonicalAnswer: "Insert टैब", explanation: "Word में शीर्षलेख और पादलेख कमांड Insert टैब पर होते हैं।" },
    pa: { stem: "ਉੱਪਰਲਾ ਸਿਰਲੇਖ ਜਾਂ ਹੇਠਲਾ ਸਿਰਲੇਖ ਜੋੜਨ ਵਾਲਾ ਕਮਾਂਡ Word ਵਿੱਚ ਕਿੱਥੇ ਹੁੰਦਾ ਹੈ?", options: ["Insert ਟੈਬ", "ਡਿਜ਼ਾਈਨ ਟੈਬ", "ਸਮੀਖਿਆ ਟੈਬ", "ਦ੍ਰਿਸ਼ ਟੈਬ"], canonicalAnswer: "Insert ਟੈਬ", explanation: "Word ਵਿੱਚ ਉੱਪਰਲਾ ਸਿਰਲੇਖ ਅਤੇ ਹੇਠਲਾ ਸਿਰਲੇਖ ਕਮਾਂਡਾਂ Insert ਟੈਬ ਉੱਤੇ ਹੁੰਦੇ ਹਨ।" },
  },
  {
    qlId: "COM-003-QL-022", targetFactId: "com003-word-insert-page-number", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which Insert-tab command adds page numbers to a document?", options: ["Caption", "Page Number", "Bookmark", "Text Box"], canonicalAnswer: "Page Number", explanation: "The Page Number command inserts numbering in a header, footer or another available position." },
    hi: { stem: "दस्तावेज़ में पृष्ठ संख्याएँ जोड़ने वाला Insert टैबटैब कमांड कौन-सा है?", options: ["Caption", "पृष्ठ Number", "बुकमार्क", "Text Box"], canonicalAnswer: "पृष्ठ Number", explanation: "पृष्ठ Number कमांड शीर्षलेख, पादलेख या उपलब्ध अन्य स्थिति में क्रमांकन डालना करता है।" },
    pa: { stem: "ਦਸਤਾਵੇਜ਼ ਵਿੱਚ ਪੰਨਾ ਅੰਕ ਜੋੜਨ ਵਾਲਾ Insert ਟੈਬਟੈਬ ਕਮਾਂਡ ਕਿਹੜਾ ਹੈ?", options: ["Caption", "ਪੰਨਾ Number", "ਬੁੱਕਮਾਰਕ", "Text Box"], canonicalAnswer: "ਪੰਨਾ Number", explanation: "ਪੰਨਾ Number ਕਮਾਂਡ ਉੱਪਰਲਾ ਸਿਰਲੇਖ, ਹੇਠਲਾ ਸਿਰਲੇਖ ਜਾਂ ਉਪਲਬਧ ਹੋਰ ਸਥਿਤੀ ਵਿੱਚ ਕ੍ਰਮ-ਅੰਕਣ ਸ਼ਾਮਲ ਕਰਨਾ ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-022", targetFactId: "com003-word-insert-hyperlink", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 2,
    en: { stem: "Which Insert-tab feature creates a clickable link to a webpage or another location?", options: ["Equation", "Symbol", "Link", "Screenshot"], canonicalAnswer: "Link", explanation: "Link creates a hyperlink to a webpage, file or another location." },
    hi: { stem: "वेबपृष्ठ या अन्य स्थान का क्लिक करने योग्य लिंक बनाने वाला Insert टैबटैब सुविधा कौन-सा है?", options: ["Equation", "Symbol", "लिंक", "स्क्रीनशॉट"], canonicalAnswer: "लिंक", explanation: "लिंक वेबपृष्ठ, फ़ाइल या अन्य स्थान के लिए हाइपरलिंक बनाता है।" },
    pa: { stem: "ਵੈੱਬਪੰਨਾ ਜਾਂ ਹੋਰ ਥਾਂ ਦਾ ਕਲਿੱਕ ਕਰਨ ਯੋਗ ਲਿੰਕ ਬਣਾਉਣ ਵਾਲਾ Insert ਟੈਬਟੈਬ ਵਿਸ਼ੇਸ਼ਤਾ ਕਿਹੜਾ ਹੈ?", options: ["Equation", "Symbol", "ਲਿੰਕ", "ਸਕ੍ਰੀਨਸ਼ਾਟ"], canonicalAnswer: "ਲਿੰਕ", explanation: "ਲਿੰਕ ਵੈੱਬਪੰਨਾ, ਫ਼ਾਈਲ ਜਾਂ ਹੋਰ ਥਾਂ ਲਈ ਹਾਈਪਰਲਿੰਕ ਬਣਾਉਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-022", targetFactId: "com003-word-insert-page-break", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 3,
    en: { stem: "Which Insert-tab command starts the following content on a new page?", options: ["Section", "Column", "Caption", "Page Break"], canonicalAnswer: "Page Break", explanation: "A Page Break starts the following content on the next page." },
    hi: { stem: "निम्नलिखित सामग्री को नए पृष्ठ पर शुरू करने वाला Insert टैबटैब कमांड कौन-सा है?", options: ["Section", "स्तंभ", "Caption", "पृष्ठ विराम"], canonicalAnswer: "पृष्ठ विराम", explanation: "पृष्ठ विराम निम्नलिखित सामग्री को अगले पृष्ठ पर शुरू करता है।" },
    pa: { stem: "ਹੇਠ ਲਿਖਿਆ ਸਮੱਗਰੀ ਨੂੰ ਨਵੇਂ ਪੰਨਾ ਉੱਤੇ ਸ਼ੁਰੂ ਕਰਨ ਵਾਲਾ Insert ਟੈਬਟੈਬ ਕਮਾਂਡ ਕਿਹੜਾ ਹੈ?", options: ["Section", "ਕਾਲਮ", "Caption", "ਪੰਨਾ ਵਿਰਾਮ"], canonicalAnswer: "ਪੰਨਾ ਵਿਰਾਮ", explanation: "ਪੰਨਾ ਵਿਰਾਮ ਹੇਠ ਲਿਖਿਆ ਸਮੱਗਰੀ ਨੂੰ ਅਗਲੇ ਪੰਨਾ ਉੱਤੇ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ।" },
  },

  {
    qlId: "COM-003-QL-023", targetFactId: "com003-word-design-themes", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Which Design-tab feature applies a coordinated overall look to a document?", options: ["Themes", "Margins", "Footnotes", "Mail Merge"], canonicalAnswer: "Themes", explanation: "A theme applies coordinated document colors, fonts and effects." },
    hi: { stem: "दस्तावेज़ को समन्वित समग्र दिखना देने वाला डिज़ाइन टैबटैब सुविधा कौन-सा है?", options: ["Themes", "हाशिये", "पाद-टिप्पणियाँ", "Mail Merge"], canonicalAnswer: "Themes", explanation: "थीम दस्तावेज़ के रंग, फ़ॉन्ट और प्रभाव में समन्वित दिखना लागू करता है।" },
    pa: { stem: "ਦਸਤਾਵੇਜ਼ ਨੂੰ ਸਮਨਵਿਤ ਕੁੱਲ ਦਿੱਖ ਦੇਣ ਵਾਲਾ ਡਿਜ਼ਾਈਨ ਟੈਬਟੈਬ ਵਿਸ਼ੇਸ਼ਤਾ ਕਿਹੜਾ ਹੈ?", options: ["Themes", "ਹਾਸ਼ੀਏ", "ਫੁਟਨੋਟ", "Mail Merge"], canonicalAnswer: "Themes", explanation: "ਥੀਮ ਦਸਤਾਵੇਜ਼ ਦੇ ਰੰਗ, ਫੌਂਟ ਅਤੇ ਪ੍ਰਭਾਵ ਉੱਤੇ ਸਮਨਵਿਤ ਦਿੱਖ ਲਾਗੂ ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-023", targetFactId: "com003-word-design-theme-colors", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "DIRECT_RECALL", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which Design-tab option changes the coordinated color set used by a theme?", options: ["Effects", "Colors", "Columns", "Indent"], canonicalAnswer: "Colors", explanation: "Theme Colors changes the coordinated set of document colors." },
    hi: { stem: "थीम द्वारा उपयोग किए गए समन्वित रंग निर्धारित करना को बदलने वाला डिज़ाइन टैबटैब विकल्प कौन-सा है?", options: ["Effects", "Colors", "स्तंभ", "Indent"], canonicalAnswer: "Colors", explanation: "थीम Colors दस्तावेज़ रंग के समन्वित निर्धारित करना को बदलता है।" },
    pa: { stem: "ਥੀਮ ਵੱਲੋਂ ਵਰਤੇ ਸਮਨਵਿਤ ਰੰਗ ਨਿਰਧਾਰਤ ਕਰਨਾ ਨੂੰ ਬਦਲਣ ਵਾਲਾ ਡਿਜ਼ਾਈਨ ਟੈਬਟੈਬ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?", options: ["Effects", "Colors", "ਕਾਲਮ", "Indent"], canonicalAnswer: "Colors", explanation: "ਥੀਮ Colors ਦਸਤਾਵੇਜ਼ ਰੰਗ ਦੇ ਸਮਨਵਿਤ ਨਿਰਧਾਰਤ ਕਰਨਾ ਨੂੰ ਬਦਲਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-023", targetFactId: "com003-word-design-theme-fonts", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "DIRECT_RECALL", difficulty: "EASY", correctIndex: 2,
    en: { stem: "Which Design-tab option changes the coordinated heading and body font set?", options: ["Page Color", "Watermark", "Fonts", "Page Borders"], canonicalAnswer: "Fonts", explanation: "Theme Fonts changes the coordinated font set used by the document theme." },
    hi: { stem: "समन्वित शीर्षक और मुख्य भाग फ़ॉन्ट निर्धारित करना बदलने वाला डिज़ाइन टैबटैब विकल्प कौन-सा है?", options: ["Page Color", "Watermark", "फ़ॉन्ट", "Page Borders"], canonicalAnswer: "फ़ॉन्ट", explanation: "थीम फ़ॉन्ट दस्तावेज़ थीम द्वारा उपयोग किए गए समन्वित फ़ॉन्ट निर्धारित करना को बदलता है।" },
    pa: { stem: "ਸਮਨਵਿਤ ਸਿਰਲੇਖ ਅਤੇ ਮੁੱਖ ਭਾਗ ਫੌਂਟ ਨਿਰਧਾਰਤ ਕਰਨਾ ਬਦਲਣ ਵਾਲਾ ਡਿਜ਼ਾਈਨ ਟੈਬਟੈਬ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?", options: ["Page Color", "Watermark", "ਫੌਂਟ", "Page Borders"], canonicalAnswer: "ਫੌਂਟ", explanation: "ਥੀਮ ਫੌਂਟ ਦਸਤਾਵੇਜ਼ ਥੀਮ ਵੱਲੋਂ ਵਰਤੇ ਸਮਨਵਿਤ ਫੌਂਟ ਨਿਰਧਾਰਤ ਕਰਨਾ ਨੂੰ ਬਦਲਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-023", targetFactId: "com003-word-design-watermark", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 3,
    en: { stem: "Which Design-tab feature places faint text or an image behind document content?", options: ["Page Color", "Themes", "Effects", "Watermark"], canonicalAnswer: "Watermark", explanation: "A watermark places faint text or an image behind the main document content." },
    hi: { stem: "दस्तावेज़ सामग्री के पीछे हल्का पाठ या चित्र रखने वाला डिज़ाइन टैबटैब सुविधा कौन-सा है?", options: ["Page Color", "Themes", "Effects", "Watermark"], canonicalAnswer: "Watermark", explanation: "Watermark मुख्य दस्तावेज़ सामग्री के पीछे हल्का पाठ या चित्र रखता है।" },
    pa: { stem: "ਦਸਤਾਵੇਜ਼ ਸਮੱਗਰੀ ਦੇ ਪਿੱਛੇ ਹਲਕਾ ਲਿਖਤ ਜਾਂ ਤਸਵੀਰ ਰੱਖਣ ਵਾਲਾ ਡਿਜ਼ਾਈਨ ਟੈਬਟੈਬ ਵਿਸ਼ੇਸ਼ਤਾ ਕਿਹੜਾ ਹੈ?", options: ["Page Color", "Themes", "Effects", "Watermark"], canonicalAnswer: "Watermark", explanation: "Watermark ਮੁੱਖ ਦਸਤਾਵੇਜ਼ ਸਮੱਗਰੀ ਦੇ ਪਿੱਛੇ ਹਲਕਾ ਲਿਖਤ ਜਾਂ ਤਸਵੀਰ ਰੱਖਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-023", targetFactId: "com003-word-design-page-borders", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Which Design-tab command adds a border around a page?", options: ["Page Borders", "Paragraph Spacing", "Size", "Breaks"], canonicalAnswer: "Page Borders", explanation: "Page Borders opens the controls for adding a border around a page or section." },
    hi: { stem: "पृष्ठ के चारों ओर सीमा जोड़ने वाला डिज़ाइन टैबटैब कमांड कौन-सा है?", options: ["Page Borders", "Paragraph अंतराल", "आकार", "विराम"], canonicalAnswer: "Page Borders", explanation: "Page Borders पृष्ठ या अनुभाग के चारों ओर सीमा जोड़ने के नियंत्रित करता है खोलता है।" },
    pa: { stem: "ਪੰਨਾ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਕਿਨਾਰਾ ਜੋੜਨ ਵਾਲਾ ਡਿਜ਼ਾਈਨ ਟੈਬਟੈਬ ਕਮਾਂਡ ਕਿਹੜਾ ਹੈ?", options: ["Page Borders", "Paragraph ਫ਼ਾਸਲਾ", "ਆਕਾਰ", "ਵਿਰਾਮ"], canonicalAnswer: "Page Borders", explanation: "Page Borders ਪੰਨਾ ਜਾਂ ਭਾਗ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਕਿਨਾਰਾ ਜੋੜਨ ਵਾਲੇ ਨਿਯੰਤਰਿਤ ਕਰਦਾ ਹੈ ਖੋਲ੍ਹਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-023", targetFactId: "com003-word-design-page-color", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which Design-tab feature changes the background color of document pages?", options: ["Font Color", "Page Color", "Highlight", "Shading"], canonicalAnswer: "Page Color", explanation: "Page Color changes the background color used for document pages." },
    hi: { stem: "दस्तावेज़ पृष्ठ का पृष्ठभूमि रंग बदलने वाला डिज़ाइन टैबटैब सुविधा कौन-सा है?", options: ["Font Color", "Page Color", "Highlight", "छायांकन"], canonicalAnswer: "Page Color", explanation: "Page Color दस्तावेज़ पृष्ठ के लिए उपयोग होने वाला पृष्ठभूमि रंग बदलता है।" },
    pa: { stem: "ਦਸਤਾਵੇਜ਼ ਪੰਨੇ ਦਾ ਪਿਛੋਕੜ ਰੰਗ ਬਦਲਣ ਵਾਲਾ ਡਿਜ਼ਾਈਨ ਟੈਬਟੈਬ ਵਿਸ਼ੇਸ਼ਤਾ ਕਿਹੜਾ ਹੈ?", options: ["Font Color", "Page Color", "Highlight", "ਛਾਂਵ"], canonicalAnswer: "Page Color", explanation: "Page Color ਦਸਤਾਵੇਜ਼ ਪੰਨੇ ਲਈ ਵਰਤਿਆ ਪਿਛੋਕੜ ਰੰਗ ਬਦਲਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-023", targetFactId: "com003-word-design-paragraph-spacing", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "MEDIUM", correctIndex: 2,
    en: { stem: "Which Design-tab option changes the overall spacing between paragraphs in a document?", options: ["Page Borders", "Effects", "Paragraph Spacing", "Watermark"], canonicalAnswer: "Paragraph Spacing", explanation: "Paragraph Spacing applies an overall spacing choice between paragraphs." },
    hi: { stem: "दस्तावेज़ में अनुच्छेद के बीच समग्र अंतराल बदलने वाला डिज़ाइन टैबटैब विकल्प कौन-सा है?", options: ["Page Borders", "Effects", "Paragraph अंतराल", "Watermark"], canonicalAnswer: "Paragraph अंतराल", explanation: "Paragraph अंतराल अनुच्छेद के बीच समग्र अंतराल चयन लागू करता है।" },
    pa: { stem: "ਦਸਤਾਵੇਜ਼ ਵਿੱਚ ਪੈਰਾਗ੍ਰਾਫ ਵਿਚਕਾਰ ਕੁੱਲ ਫ਼ਾਸਲਾ ਬਦਲਣ ਵਾਲਾ ਡਿਜ਼ਾਈਨ ਟੈਬਟੈਬ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?", options: ["Page Borders", "Effects", "Paragraph ਫ਼ਾਸਲਾ", "Watermark"], canonicalAnswer: "Paragraph ਫ਼ਾਸਲਾ", explanation: "Paragraph ਫ਼ਾਸਲਾ ਪੈਰਾਗ੍ਰਾਫ ਵਿਚਕਾਰ ਕੁੱਲ ਫ਼ਾਸਲਾ ਚੋਣ ਲਾਗੂ ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-023", targetFactId: "com003-word-design-theme-effects", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "DIRECT_RECALL", difficulty: "MEDIUM", correctIndex: 3,
    en: { stem: "Which Design-tab option changes coordinated visual effects in a document theme?", options: ["Margins", "Footnotes", "Recipients", "Effects"], canonicalAnswer: "Effects", explanation: "Theme Effects changes the coordinated visual effects used by the document theme." },
    hi: { stem: "दस्तावेज़ थीम के समन्वित दृश्य प्रभाव बदलने वाला डिज़ाइन टैबटैब विकल्प कौन-सा है?", options: ["हाशिये", "पाद-टिप्पणियाँ", "प्राप्तकर्ता", "Effects"], canonicalAnswer: "Effects", explanation: "थीम Effects दस्तावेज़ थीम के समन्वित दृश्य प्रभाव बदलता है।" },
    pa: { stem: "ਦਸਤਾਵੇਜ਼ ਥੀਮ ਦੇ ਸਮਨਵਿਤ ਦ੍ਰਿਸ਼ ਪ੍ਰਭਾਵ ਬਦਲਣ ਵਾਲਾ ਡਿਜ਼ਾਈਨ ਟੈਬਟੈਬ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?", options: ["ਹਾਸ਼ੀਏ", "ਫੁਟਨੋਟ", "ਪ੍ਰਾਪਤਕਰਤਾ", "Effects"], canonicalAnswer: "Effects", explanation: "ਥੀਮ Effects ਦਸਤਾਵੇਜ਼ ਥੀਮ ਦੇ ਸਮਨਵਿਤ ਦ੍ਰਿਸ਼ ਪ੍ਰਭਾਵ ਨੂੰ ਬਦਲਦਾ ਹੈ।" },
  },

  {
    qlId: "COM-003-QL-024", targetFactId: "com003-word-layout-margins", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Which Layout-tab feature controls the blank space around the edges of a page?", options: ["Margins", "Themes", "Citations", "Comments"], canonicalAnswer: "Margins", explanation: "Margins control the blank space between page edges and document content." },
    hi: { stem: "पृष्ठ किनारे और दस्तावेज़ सामग्री के बीच रिक्त स्थान नियंत्रित करने वाला Layout टैबटैब सुविधा कौन-सा है?", options: ["हाशिये", "Themes", "उद्धरण", "Comments"], canonicalAnswer: "हाशिये", explanation: "हाशिये पृष्ठ किनारे और दस्तावेज़ सामग्री के बीच रिक्त स्थान नियंत्रित करते हैं।" },
    pa: { stem: "ਪੰਨਾ ਕਿਨਾਰੇ ਅਤੇ ਦਸਤਾਵੇਜ਼ ਸਮੱਗਰੀ ਵਿਚਕਾਰ ਖਾਲੀ ਥਾਂ ਨੂੰ ਨਿਯੰਤਰਿਤ ਕਰਨ ਵਾਲਾ Layout ਟੈਬਟੈਬ ਵਿਸ਼ੇਸ਼ਤਾ ਕਿਹੜਾ ਹੈ?", options: ["ਹਾਸ਼ੀਏ", "Themes", "ਹਵਾਲੇ", "Comments"], canonicalAnswer: "ਹਾਸ਼ੀਏ", explanation: "ਹਾਸ਼ੀਏ ਪੰਨਾ ਕਿਨਾਰੇ ਅਤੇ ਦਸਤਾਵੇਜ਼ ਸਮੱਗਰੀ ਵਿਚਕਾਰ ਖਾਲੀ ਥਾਂ ਨੂੰ ਨਿਯੰਤਰਿਤ ਕਰਦੇ ਹਨ।" },
  },
  {
    qlId: "COM-003-QL-024", targetFactId: "com003-word-layout-orientation", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which Layout-tab command changes a page between portrait and landscape?", options: ["Size", "Orientation", "Columns", "Indent"], canonicalAnswer: "Orientation", explanation: "Orientation changes the page direction between portrait and landscape." },
    hi: { stem: "पृष्ठ को पोर्ट्रेट और लैंडस्केप के बीच बदलने वाला Layout टैबटैब कमांड कौन-सा है?", options: ["आकार", "Orientation", "स्तंभ", "Indent"], canonicalAnswer: "Orientation", explanation: "Orientation पृष्ठ दिशा को पोर्ट्रेट और लैंडस्केप के बीच बदलता है।" },
    pa: { stem: "ਪੰਨਾ ਨੂੰ ਪੋਰਟਰੇਟ ਅਤੇ ਲੈਂਡਸਕੇਪ ਵਿਚਕਾਰ ਬਦਲਣ ਵਾਲਾ Layout ਟੈਬਟੈਬ ਕਮਾਂਡ ਕਿਹੜਾ ਹੈ?", options: ["ਆਕਾਰ", "Orientation", "ਕਾਲਮ", "Indent"], canonicalAnswer: "Orientation", explanation: "Orientation ਪੰਨਾ ਦਿਸ਼ਾ ਨੂੰ ਪੋਰਟਰੇਟ ਅਤੇ ਲੈਂਡਸਕੇਪ ਵਿਚਕਾਰ ਬਦਲਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-024", targetFactId: "com003-word-layout-paper-size", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "DIRECT_RECALL", difficulty: "EASY", correctIndex: 2,
    en: { stem: "Which Layout-tab option selects a paper size such as A4 or Letter?", options: ["Margins", "Breaks", "Size", "Line Numbers"], canonicalAnswer: "Size", explanation: "Size selects the paper size used by the document." },
    hi: { stem: "एक4 या अक्षर जैसी कागज़ आकार चुनने वाला Layout टैबटैब विकल्प कौन-सा है?", options: ["हाशिये", "विराम", "आकार", "पंक्ति संख्याएँ"], canonicalAnswer: "आकार", explanation: "आकार दस्तावेज़ में उपयोग होने वाली कागज़ आकार चुनता है।" },
    pa: { stem: "ਇੱਕ4 ਜਾਂ ਅੱਖਰ ਵਰਗੀ ਕਾਗਜ਼ ਆਕਾਰ ਚੁਣਨ ਵਾਲਾ Layout ਟੈਬਟੈਬ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?", options: ["ਹਾਸ਼ੀਏ", "ਵਿਰਾਮ", "ਆਕਾਰ", "ਲਾਈਨ ਅੰਕ"], canonicalAnswer: "ਆਕਾਰ", explanation: "ਆਕਾਰ ਦਸਤਾਵੇਜ਼ ਵਿੱਚ ਵਰਤੀ ਜਾਣ ਵਾਲੀ ਕਾਗਜ਼ ਆਕਾਰ ਚੁਣਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-024", targetFactId: "com003-word-layout-columns", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 3,
    en: { stem: "Which Layout-tab feature divides text into newspaper-style vertical sections?", options: ["Orientation", "Hyphenation", "Line Numbers", "Columns"], canonicalAnswer: "Columns", explanation: "Columns divides page text into vertical columns, such as a newspaper layout." },
    hi: { stem: "पाठ को समाचार-पत्र शैली ऊर्ध्वाधर अनुभाग में बाँटने वाला Layout टैबटैब सुविधा कौन-सा है?", options: ["Orientation", "हाइफ़नेशन", "पंक्ति संख्याएँ", "स्तंभ"], canonicalAnswer: "स्तंभ", explanation: "स्तंभ पृष्ठ पाठ को समाचार-पत्र लेआउट जैसी ऊर्ध्वाधर स्तंभ में बाँटता है।" },
    pa: { stem: "ਲਿਖਤ ਨੂੰ ਅਖ਼ਬਾਰ ਸ਼ੈਲੀ ਲੰਬਕਾਰੀ ਭਾਗ ਵਿੱਚ ਵੰਡਣ ਵਾਲਾ Layout ਟੈਬਟੈਬ ਵਿਸ਼ੇਸ਼ਤਾ ਕਿਹੜਾ ਹੈ?", options: ["Orientation", "ਹਾਈਫ਼ਨੇਸ਼ਨ", "ਲਾਈਨ ਅੰਕ", "ਕਾਲਮ"], canonicalAnswer: "ਕਾਲਮ", explanation: "ਕਾਲਮ ਪੰਨਾ ਲਿਖਤ ਨੂੰ ਅਖ਼ਬਾਰ ਲੇਆਉਟ ਵਰਗੀਆਂ ਲੰਬਕਾਰੀ ਕਾਲਮ ਵਿੱਚ ਵੰਡਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-024", targetFactId: "com003-word-layout-section-break", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "CONTRAST_DISCRIMINATION", difficulty: "MEDIUM", correctIndex: 0,
    en: { stem: "Which Layout-tab feature allows different page settings in different parts of one document?", options: ["Section Breaks", "Themes", "Word Count", "Styles"], canonicalAnswer: "Section Breaks", explanation: "Section Breaks divide a document into sections that can have different layout settings." },
    hi: { stem: "एक दस्तावेज़ के अलग भाग में अलग पृष्ठ सेटिंग्स देने वाला Layout टैबटैब सुविधा कौन-सा है?", options: ["Section विराम", "Themes", "Word Count", "Styles"], canonicalAnswer: "Section विराम", explanation: "Section विराम दस्तावेज़ को अनुभाग में बाँटते हैं और हर अनुभाग की लेआउट सेटिंग्स अलग हो सकती हैं।" },
    pa: { stem: "ਇੱਕ ਦਸਤਾਵੇਜ਼ ਦੇ ਵੱਖਰੇ ਹਿੱਸੇ ਵਿੱਚ ਵੱਖਰੀਆਂ ਪੰਨਾ ਸੈਟਿੰਗਾਂ ਦੇਣ ਵਾਲਾ Layout ਟੈਬਟੈਬ ਵਿਸ਼ੇਸ਼ਤਾ ਕਿਹੜਾ ਹੈ?", options: ["Section ਵਿਰਾਮ", "Themes", "Word Count", "Styles"], canonicalAnswer: "Section ਵਿਰਾਮ", explanation: "Section ਵਿਰਾਮ ਦਸਤਾਵੇਜ਼ ਨੂੰ ਭਾਗ ਵਿੱਚ ਵੰਡਦੇ ਹਨ ਅਤੇ ਹਰ ਭਾਗ ਦੀਆਂ ਲੇਆਉਟ ਸੈਟਿੰਗਾਂ ਵੱਖਰੀਆਂ ਹੋ ਸਕਦੀਆਂ ਹਨ।" },
  },
  {
    qlId: "COM-003-QL-024", targetFactId: "com003-word-layout-line-numbers", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which Layout-tab command displays numbers beside lines of text?", options: ["Columns", "Line Numbers", "Breaks", "Size"], canonicalAnswer: "Line Numbers", explanation: "Line Numbers displays numbering beside lines of document text." },
    hi: { stem: "पाठ की पंक्तियाँ के पास संख्याएँ दिखाने वाला Layout टैबटैब कमांड कौन-सा है?", options: ["स्तंभ", "पंक्ति संख्याएँ", "विराम", "आकार"], canonicalAnswer: "पंक्ति संख्याएँ", explanation: "पंक्ति संख्याएँ दस्तावेज़ पाठ की पंक्तियाँ के पास क्रमांकन दिखाता है।" },
    pa: { stem: "ਲਿਖਤ ਦੀਆਂ ਲਾਈਨਾਂ ਦੇ ਕੋਲ ਅੰਕ ਦਿਖਾਉਣ ਵਾਲਾ Layout ਟੈਬਟੈਬ ਕਮਾਂਡ ਕਿਹੜਾ ਹੈ?", options: ["ਕਾਲਮ", "ਲਾਈਨ ਅੰਕ", "ਵਿਰਾਮ", "ਆਕਾਰ"], canonicalAnswer: "ਲਾਈਨ ਅੰਕ", explanation: "ਲਾਈਨ ਅੰਕ ਦਸਤਾਵੇਜ਼ ਲਿਖਤ ਦੀਆਂ ਲਾਈਨਾਂ ਦੇ ਕੋਲ ਕ੍ਰਮ-ਅੰਕਣ ਦਿਖਾਉਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-024", targetFactId: "com003-word-layout-paragraph-indent", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "MEDIUM", correctIndex: 2,
    en: { stem: "Which Layout-tab paragraph setting moves the paragraph inward from the margin?", options: ["Orientation", "Size", "Indent", "Watermark"], canonicalAnswer: "Indent", explanation: "Indent moves paragraph text inward from the left or right margin." },
    hi: { stem: "Paragraph को हाशिया से अंदर ले जाने वाली Layout टैबटैब अनुच्छेद सेटिंग कौन-सी है?", options: ["Orientation", "आकार", "Indent", "Watermark"], canonicalAnswer: "Indent", explanation: "Indent अनुच्छेद पाठ को बायाँ या दायाँ हाशिया से अंदर ले जाता है।" },
    pa: { stem: "Paragraph ਨੂੰ ਹਾਸ਼ੀਆ ਤੋਂ ਅੰਦਰ ਲੈ ਜਾਣ ਵਾਲੀ Layout ਟੈਬਟੈਬ ਪੈਰਾਗ੍ਰਾਫ ਸੈਟਿੰਗ ਕਿਹੜੀ ਹੈ?", options: ["Orientation", "ਆਕਾਰ", "Indent", "Watermark"], canonicalAnswer: "Indent", explanation: "Indent ਪੈਰਾਗ੍ਰਾਫ ਲਿਖਤ ਨੂੰ ਖੱਬਾ ਜਾਂ ਸੱਜਾ ਹਾਸ਼ੀਆ ਤੋਂ ਅੰਦਰ ਲੈ ਜਾਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-024", targetFactId: "com003-word-layout-paragraph-spacing", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "MEDIUM", correctIndex: 3,
    en: { stem: "Which Layout-tab paragraph setting changes space before or after a paragraph?", options: ["Columns", "Size", "Orientation", "Spacing"], canonicalAnswer: "Spacing", explanation: "Paragraph Spacing changes the space before or after a paragraph." },
    hi: { stem: "Paragraph से पहले या बाद का स्थान बदलने वाली Layout टैबटैब अनुच्छेद सेटिंग कौन-सी है?", options: ["स्तंभ", "आकार", "Orientation", "अंतराल"], canonicalAnswer: "अंतराल", explanation: "Paragraph अंतराल अनुच्छेद से पहले या बाद का स्थान बदलता है।" },
    pa: { stem: "Paragraph ਤੋਂ ਪਹਿਲਾਂ ਜਾਂ ਬਾਅਦ ਦਾ ਥਾਂ ਬਦਲਣ ਵਾਲੀ Layout ਟੈਬਟੈਬ ਪੈਰਾਗ੍ਰਾਫ ਸੈਟਿੰਗ ਕਿਹੜੀ ਹੈ?", options: ["ਕਾਲਮ", "ਆਕਾਰ", "Orientation", "ਫ਼ਾਸਲਾ"], canonicalAnswer: "ਫ਼ਾਸਲਾ", explanation: "Paragraph ਫ਼ਾਸਲਾ ਪੈਰਾਗ੍ਰਾਫ ਤੋਂ ਪਹਿਲਾਂ ਜਾਂ ਬਾਅਦ ਦਾ ਥਾਂ ਬਦਲਦਾ ਹੈ।" },
  },

  {
    qlId: "COM-003-QL-025", targetFactId: "com003-word-references-table-of-contents", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Which References-tab feature creates a list of headings and their page numbers?", options: ["Table of Contents", "Mail Merge", "Page Color", "WordArt"], canonicalAnswer: "Table of Contents", explanation: "A Table of Contents lists document headings and their page numbers." },
    hi: { stem: "Headings और उनके पृष्ठ संख्याएँ की सूची बनाने वाला References टैबटैब सुविधा कौन-सा है?", options: ["Table of Contents", "Mail Merge", "Page Color", "WordArt"], canonicalAnswer: "Table of Contents", explanation: "Table of Contents दस्तावेज़ शीर्षक और उनके पृष्ठ संख्याएँ की सूची बनाता है।" },
    pa: { stem: "Headings ਅਤੇ ਉਹਨਾਂ ਦੇ ਪੰਨਾ ਅੰਕ ਦੀ ਸੂਚੀ ਬਣਾਉਣ ਵਾਲਾ References ਟੈਬਟੈਬ ਵਿਸ਼ੇਸ਼ਤਾ ਕਿਹੜਾ ਹੈ?", options: ["Table of Contents", "Mail Merge", "Page Color", "WordArt"], canonicalAnswer: "Table of Contents", explanation: "Table of Contents ਦਸਤਾਵੇਜ਼ ਸਿਰਲੇਖ ਅਤੇ ਉਹਨਾਂ ਦੇ ਪੰਨਾ ਅੰਕ ਦੀ ਸੂਚੀ ਬਣਾਉਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-025", targetFactId: "com003-word-references-footnote", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Where does a footnote normally appear?", options: ["At the start of the next document", "At the bottom of the current page", "Only in the title bar", "Inside the Ribbon"], canonicalAnswer: "At the bottom of the current page", explanation: "A footnote is placed at the bottom of the page containing its reference mark." },
    hi: { stem: "Footnote सामान्यतः कहाँ दिखाई देती है?", options: ["अगले दस्तावेज़ के शुरू में", "वर्तमान पृष्ठ के नीचे पर", "केवल शीर्षक पट्टी में", "Ribbon के अंदर"], canonicalAnswer: "वर्तमान पृष्ठ के नीचे पर", explanation: "Footnote उस पृष्ठ के नीचे पर रखी जाती है जिसमें उसका संदर्भ चिह्न होता है।" },
    pa: { stem: "Footnote ਆਮ ਤੌਰ ਉੱਤੇ ਕਿੱਥੇ ਦਿਖਾਈ ਦਿੰਦੀ ਹੈ?", options: ["ਅਗਲੇ ਦਸਤਾਵੇਜ਼ ਦੇ ਸ਼ੁਰੂ ਵਿੱਚ", "ਮੌਜੂਦਾ ਪੰਨਾ ਦੇ ਹੇਠਾਂ ਉੱਤੇ", "ਸਿਰਫ਼ ਸਿਰਲੇਖ ਪੱਟੀ ਵਿੱਚ", "Ribbon ਦੇ ਅੰਦਰ"], canonicalAnswer: "ਮੌਜੂਦਾ ਪੰਨਾ ਦੇ ਹੇਠਾਂ ਉੱਤੇ", explanation: "Footnote ਉਸ ਪੰਨਾ ਦੇ ਹੇਠਾਂ ਉੱਤੇ ਰੱਖੀ ਜਾਂਦੀ ਹੈ ਜਿਸ ਵਿੱਚ ਉਸਦਾ ਹਵਾਲਾ ਨਿਸ਼ਾਨ ਹੁੰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-025", targetFactId: "com003-word-references-endnote", surfaceMode: "CONCEPT_FROM_LOCATION", examSurfaceFamily: "CONTRAST_DISCRIMINATION", difficulty: "MEDIUM", correctIndex: 2,
    en: { stem: "Where is an endnote normally placed?", options: ["At the left margin", "Inside a table", "At the end of the document or section", "In the Quick Access Toolbar"], canonicalAnswer: "At the end of the document or section", explanation: "An endnote is placed at the end of the document or section rather than at the bottom of the current page." },
    hi: { stem: "Endnote सामान्यतः कहाँ रखी जाती है?", options: ["बायाँ हाशिया पर", "तालिका के अंदर", "दस्तावेज़ या अनुभाग के अंत में", "Quick Access Toolbar में"], canonicalAnswer: "दस्तावेज़ या अनुभाग के अंत में", explanation: "Endnote वर्तमान पृष्ठ के नीचे के बजाय दस्तावेज़ या अनुभाग के अंत में रखी जाती है।" },
    pa: { stem: "Endnote ਆਮ ਤੌਰ ਉੱਤੇ ਕਿੱਥੇ ਰੱਖੀ ਜਾਂਦੀ ਹੈ?", options: ["ਖੱਬਾ ਹਾਸ਼ੀਆ ਉੱਤੇ", "ਟੇਬਲ ਦੇ ਅੰਦਰ", "ਦਸਤਾਵੇਜ਼ ਜਾਂ ਭਾਗ ਦੇ ਅੰਤ ਵਿੱਚ", "Quick Access Toolbar ਵਿੱਚ"], canonicalAnswer: "ਦਸਤਾਵੇਜ਼ ਜਾਂ ਭਾਗ ਦੇ ਅੰਤ ਵਿੱਚ", explanation: "Endnote ਮੌਜੂਦਾ ਪੰਨਾ ਦੇ ਹੇਠਾਂ ਦੀ ਬਜਾਏ ਦਸਤਾਵੇਜ਼ ਜਾਂ ਭਾਗ ਦੇ ਅੰਤ ਵਿੱਚ ਰੱਖੀ ਜਾਂਦੀ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-025", targetFactId: "com003-word-references-citations", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 3,
    en: { stem: "Which References-tab command adds a source citation to document text?", options: ["Insert Caption", "Insert Table", "Insert Index", "Insert Citation"], canonicalAnswer: "Insert Citation", explanation: "Insert Citation adds a citation linked to a source in the document." },
    hi: { stem: "दस्तावेज़ पाठ में स्रोत उद्धरण जोड़ने वाला References टैबटैब कमांड कौन-सा है?", options: ["Insert Caption", "Insert तालिका", "Insert अनुक्रमणिका", "Insert उद्धरण"], canonicalAnswer: "Insert उद्धरण", explanation: "Insert उद्धरण दस्तावेज़ में स्रोत से जुड़ी उद्धरण जोड़ता है।" },
    pa: { stem: "ਦਸਤਾਵੇਜ਼ ਲਿਖਤ ਵਿੱਚ ਸਰੋਤ ਹਵਾਲਾ ਜੋੜਨ ਵਾਲਾ References ਟੈਬਟੈਬ ਕਮਾਂਡ ਕਿਹੜਾ ਹੈ?", options: ["Insert Caption", "Insert ਟੇਬਲ", "Insert ਸੂਚਕ", "Insert ਹਵਾਲਾ"], canonicalAnswer: "Insert ਹਵਾਲਾ", explanation: "Insert ਹਵਾਲਾ ਦਸਤਾਵੇਜ਼ ਵਿੱਚ ਸਰੋਤ ਨਾਲ ਜੁੜੀ ਹਵਾਲਾ ਜੋੜਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-025", targetFactId: "com003-word-references-bibliography", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Which References-tab feature creates a list of sources used in a document?", options: ["Bibliography", "Watermark", "Header", "Replace"], canonicalAnswer: "Bibliography", explanation: "Bibliography creates a formatted list of sources used in the document." },
    hi: { stem: "दस्तावेज़ में उपयोग किए गए स्रोत की सूची बनाने वाला References टैबटैब सुविधा कौन-सा है?", options: ["Bibliography", "Watermark", "शीर्षलेख", "Replace"], canonicalAnswer: "Bibliography", explanation: "Bibliography दस्तावेज़ में उपयोग किए गए स्रोत की स्वरूपित सूची बनाती है।" },
    pa: { stem: "ਦਸਤਾਵੇਜ਼ ਵਿੱਚ ਵਰਤੇ ਸਰੋਤ ਦੀ ਸੂਚੀ ਬਣਾਉਣ ਵਾਲਾ References ਟੈਬਟੈਬ ਵਿਸ਼ੇਸ਼ਤਾ ਕਿਹੜਾ ਹੈ?", options: ["Bibliography", "Watermark", "ਉੱਪਰਲਾ ਸਿਰਲੇਖ", "Replace"], canonicalAnswer: "Bibliography", explanation: "Bibliography ਦਸਤਾਵੇਜ਼ ਵਿੱਚ ਵਰਤੇ ਸਰੋਤ ਦੀ ਰੂਪਬੱਧ ਸੂਚੀ ਬਣਾਉਂਦੀ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-025", targetFactId: "com003-word-references-caption", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which References-tab feature adds a label such as Figure 1 to an object?", options: ["Citation", "Caption", "Endnote", "Index"], canonicalAnswer: "Caption", explanation: "A caption adds a label or short description to a figure, table or other object." },
    hi: { stem: "वस्तु पर आकृति 1 जैसा लेबल जोड़ने वाला References टैबटैब सुविधा कौन-सा है?", options: ["उद्धरण", "Caption", "Endnote", "अनुक्रमणिका"], canonicalAnswer: "Caption", explanation: "Caption आकृति, तालिका या अन्य वस्तु पर लेबल या छोटा विवरण जोड़ता है।" },
    pa: { stem: "ਵਸਤੂ ਉੱਤੇ ਚਿੱਤਰ 1 ਵਰਗਾ ਲੇਬਲ ਜੋੜਨ ਵਾਲਾ References ਟੈਬਟੈਬ ਵਿਸ਼ੇਸ਼ਤਾ ਕਿਹੜਾ ਹੈ?", options: ["ਹਵਾਲਾ", "Caption", "Endnote", "ਸੂਚਕ"], canonicalAnswer: "Caption", explanation: "Caption ਚਿੱਤਰ, ਟੇਬਲ ਜਾਂ ਹੋਰ ਵਸਤੂ ਉੱਤੇ ਲੇਬਲ ਜਾਂ ਛੋਟਾ ਵੇਰਵਾ ਜੋੜਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-025", targetFactId: "com003-word-references-cross-reference", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "MEDIUM", correctIndex: 2,
    en: { stem: "Which References-tab feature links text to another heading, figure or table in the same document?", options: ["Watermark", "Mail Merge", "Cross-reference", "Page Color"], canonicalAnswer: "Cross-reference", explanation: "A cross-reference links text to another item in the same document, such as a heading or figure." },
    hi: { stem: "समान दस्तावेज़ के दूसरे शीर्षक, आकृति या तालिका से पाठ को लिंक करने वाला References टैबटैब सुविधा कौन-सा है?", options: ["Watermark", "Mail Merge", "Cross-reference", "Page Color"], canonicalAnswer: "Cross-reference", explanation: "Cross-reference पाठ को उसी दस्तावेज़ के दूसरे वस्तु, जैसे शीर्षक या आकृति, से जोड़ता है।" },
    pa: { stem: "ਉਸੇ ਦਸਤਾਵੇਜ਼ ਦੇ ਹੋਰ ਸਿਰਲੇਖ, ਚਿੱਤਰ ਜਾਂ ਟੇਬਲ ਨਾਲ ਲਿਖਤ ਨੂੰ ਲਿੰਕ ਕਰਨ ਵਾਲਾ References ਟੈਬਟੈਬ ਵਿਸ਼ੇਸ਼ਤਾ ਕਿਹੜਾ ਹੈ?", options: ["Watermark", "Mail Merge", "Cross-reference", "Page Color"], canonicalAnswer: "Cross-reference", explanation: "Cross-reference ਲਿਖਤ ਨੂੰ ਉਸੇ ਦਸਤਾਵੇਜ਼ ਦੇ ਹੋਰ ਵਸਤੂ, ਜਿਵੇਂ ਸਿਰਲੇਖ ਜਾਂ ਚਿੱਤਰ, ਨਾਲ ਜੋੜਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-025", targetFactId: "com003-word-references-toc-headings", surfaceMode: "REQUIREMENT_TO_FEATURE", examSurfaceFamily: "CONTRAST_DISCRIMINATION", difficulty: "MEDIUM", correctIndex: 3,
    en: { stem: "Which document structure is most useful for building an automatic Table of Contents?", options: ["Random font colors", "Page background images", "Unformatted spaces", "Heading styles"], canonicalAnswer: "Heading styles", explanation: "Heading styles give Word the structure it needs to build and update a Table of Contents." },
    hi: { stem: "स्वचालित Table of Contents बनाने के लिए कौन-सी दस्तावेज़ संरचना सबसे उपयोगी है?", options: ["यादृच्छिक फ़ॉन्ट रंग", "पृष्ठ पृष्ठभूमि चित्र", "बिना स्वरूपण वाला स्थान", "शीर्षक शैलियाँ"], canonicalAnswer: "शीर्षक शैलियाँ", explanation: "शीर्षक शैलियाँ Word को Table of Contents बनाने और अद्यतन करने के लिए दस्तावेज़ संरचना देते हैं।" },
    pa: { stem: "ਆਪਣੇ ਆਪ Table of Contents ਬਣਾਉਣ ਲਈ ਕਿਹੜੀ ਦਸਤਾਵੇਜ਼ ਬਣਤਰ ਸਭ ਤੋਂ ਲਾਭਦਾਇਕ ਹੈ?", options: ["ਬੇਤਰਤੀਬ ਫੌਂਟ ਰੰਗ", "ਪੰਨਾ ਪਿਛੋਕੜ ਤਸਵੀਰਾਂ", "ਬਿਨਾਂ ਰੂਪ ਵਾਲਾ ਥਾਵਾਂ", "ਸਿਰਲੇਖ ਸ਼ੈਲੀਆਂ"], canonicalAnswer: "ਸਿਰਲੇਖ ਸ਼ੈਲੀਆਂ", explanation: "ਸਿਰਲੇਖ ਸ਼ੈਲੀਆਂ Word ਨੂੰ Table of Contents ਬਣਾਉਣ ਅਤੇ ਅਪਡੇਟ ਕਰਨ ਲਈ ਦਸਤਾਵੇਜ਼ ਬਣਤਰ ਦਿੰਦੇ ਹਨ।" },
  },
  {
    qlId: "COM-003-QL-026", targetFactId: "com003-word-mailings-start-mail-merge", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Which Mailings-tab command starts the process of creating personalized copies of a document?", options: ["Start Mail Merge", "Track Changes", "Insert Caption", "Page Color"], canonicalAnswer: "Start Mail Merge", explanation: "Start Mail Merge begins the workflow for creating personalized letters, labels, envelopes or messages." },
    hi: { stem: "वैयक्तिकृत दस्तावेज़ कॉपी करता है बनाने की प्रक्रिया शुरू करने वाला Mailings टैबटैब कमांड कौन-सा है?", options: ["Start Mail Merge", "Track Changes", "Insert Caption", "Page Color"], canonicalAnswer: "Start Mail Merge", explanation: "Start Mail Merge वैयक्तिकृत अक्षर, लेबल, लिफ़ाफ़े या संदेश बनाने का कार्यप्रवाह शुरू करता है।" },
    pa: { stem: "ਵਿਅਕਤੀਗਤ ਦਸਤਾਵੇਜ਼ ਕਾਪੀ ਕਰਦਾ ਹੈ ਬਣਾਉਣ ਦੀ ਪ੍ਰਕਿਰਿਆ ਸ਼ੁਰੂ ਕਰਨ ਵਾਲਾ Mailings ਟੈਬਟੈਬ ਕਮਾਂਡ ਕਿਹੜਾ ਹੈ?", options: ["Start Mail Merge", "Track Changes", "Insert Caption", "Page Color"], canonicalAnswer: "Start Mail Merge", explanation: "Start Mail Merge ਵਿਅਕਤੀਗਤ ਅੱਖਰ, ਲੇਬਲ, ਲਿਫ਼ਾਫ਼ੇ ਜਾਂ ਸੁਨੇਹੇ ਬਣਾਉਣ ਦਾ ਕੰਮ-ਪ੍ਰਵਾਹ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-026", targetFactId: "com003-word-mailings-select-recipients", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which Mailings-tab command connects a mail merge to a recipient list?", options: ["Finish & Merge", "Select Recipients", "Preview Results", "Match Fields"], canonicalAnswer: "Select Recipients", explanation: "Select Recipients connects the merge to its data source or recipient list." },
    hi: { stem: "Mail विलय को प्राप्तकर्ता सूची से जोड़ना करने वाला Mailings टैबटैब कमांड कौन-सा है?", options: ["Finish & Merge", "चुनना प्राप्तकर्ता", "Preview Results", "मिलान फ़ील्ड"], canonicalAnswer: "चुनना प्राप्तकर्ता", explanation: "चुनना प्राप्तकर्ता विलय को उसके डेटा स्रोत या प्राप्तकर्ता सूची से जोड़ना करता है।" },
    pa: { stem: "Mail ਮਿਲਾਉਣਾ ਨੂੰ ਪ੍ਰਾਪਤਕਰਤਾ ਸੂਚੀ ਨਾਲ ਜੋੜਨਾ ਕਰਨ ਵਾਲਾ Mailings ਟੈਬਟੈਬ ਕਮਾਂਡ ਕਿਹੜਾ ਹੈ?", options: ["Finish & Merge", "ਚੁਣਨਾ ਪ੍ਰਾਪਤਕਰਤਾ", "Preview Results", "ਮਿਲਾਨ ਫੀਲਡ"], canonicalAnswer: "ਚੁਣਨਾ ਪ੍ਰਾਪਤਕਰਤਾ", explanation: "ਚੁਣਨਾ ਪ੍ਰਾਪਤਕਰਤਾ ਮਿਲਾਉਣਾ ਨੂੰ ਉਸਦੇ ਡਾਟਾ ਸਰੋਤ ਜਾਂ ਪ੍ਰਾਪਤਕਰਤਾ ਸੂਚੀ ਨਾਲ ਜੋੜਨਾ ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-026", targetFactId: "com003-word-mailings-edit-recipients", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "MEDIUM", correctIndex: 2,
    en: { stem: "Which Mailings-tab command lets a user filter or remove records from the merge list?", options: ["Insert Merge Field", "Greeting Line", "Edit Recipient List", "Start Mail Merge"], canonicalAnswer: "Edit Recipient List", explanation: "Edit Recipient List lets the user select, filter or modify records used by the merge." },
    hi: { stem: "विलय सूची से अभिलेख फ़िल्टर या हटाना करने वाला Mailings टैबटैब कमांड कौन-सा है?", options: ["Insert Merge Field", "Greeting Line", "संपादित करें प्राप्तकर्ता सूची", "Start Mail Merge"], canonicalAnswer: "संपादित करें प्राप्तकर्ता सूची", explanation: "संपादित करें प्राप्तकर्ता सूची विलय में उपयोग होने वाले अभिलेख को चुनना, फ़िल्टर या संशोधित करना करने देता है।" },
    pa: { stem: "ਮਿਲਾਉਣਾ ਸੂਚੀ ਵਿੱਚੋਂ ਰਿਕਾਰਡ ਫਿਲਟਰ ਜਾਂ ਹਟਾਉਣਾ ਕਰਨ ਵਾਲਾ Mailings ਟੈਬਟੈਬ ਕਮਾਂਡ ਕਿਹੜਾ ਹੈ?", options: ["Insert Merge Field", "Greeting Line", "ਸੋਧੋ ਪ੍ਰਾਪਤਕਰਤਾ ਸੂਚੀ", "Start Mail Merge"], canonicalAnswer: "ਸੋਧੋ ਪ੍ਰਾਪਤਕਰਤਾ ਸੂਚੀ", explanation: "ਸੋਧੋ ਪ੍ਰਾਪਤਕਰਤਾ ਸੂਚੀ ਮਿਲਾਉਣਾ ਵਿੱਚ ਵਰਤੇ ਰਿਕਾਰਡ ਨੂੰ ਚੁਣਨਾ, ਫਿਲਟਰ ਜਾਂ ਸੋਧਣਾ ਕਰਨ ਦਿੰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-026", targetFactId: "com003-word-mailings-merge-field", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 3,
    en: { stem: "Which Mailings-tab command inserts a variable value such as a recipient's name?", options: ["Address Block", "Preview Results", "Finish & Merge", "Insert Merge Field"], canonicalAnswer: "Insert Merge Field", explanation: "Insert Merge Field places a field that receives a value from the data source." },
    hi: { stem: "प्राप्तकर्ता के नाम जैसी चर मान डालना करने वाला Mailings टैबटैब कमांड कौन-सा है?", options: ["Address Block", "Preview Results", "Finish & Merge", "Insert Merge Field"], canonicalAnswer: "Insert Merge Field", explanation: "Insert Merge Field ऐसा फ़ील्ड रखता है जिसमें डेटा स्रोत से मान आती है।" },
    pa: { stem: "ਪ੍ਰਾਪਤਕਰਤਾ ਦੇ ਨਾਮ ਵਰਗੀ ਚਲ ਮੁੱਲ ਸ਼ਾਮਲ ਕਰਨਾ ਕਰਨ ਵਾਲਾ Mailings ਟੈਬਟੈਬ ਕਮਾਂਡ ਕਿਹੜਾ ਹੈ?", options: ["Address Block", "Preview Results", "Finish & Merge", "Insert Merge Field"], canonicalAnswer: "Insert Merge Field", explanation: "Insert Merge Field ਅਜਿਹਾ ਫੀਲਡ ਰੱਖਦਾ ਹੈ ਜਿਸ ਵਿੱਚ ਡਾਟਾ ਸਰੋਤ ਤੋਂ ਮੁੱਲ ਆਉਂਦੀ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-026", targetFactId: "com003-word-mailings-address-block", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Which Mailings-tab feature inserts a formatted recipient address?", options: ["Address Block", "Page Number", "Caption", "Citation"], canonicalAnswer: "Address Block", explanation: "Address Block inserts a formatted group of address fields for a recipient." },
    hi: { stem: "स्वरूपित प्राप्तकर्ता पता डालना करने वाला Mailings टैबटैब सुविधा कौन-सा है?", options: ["Address Block", "पृष्ठ Number", "Caption", "उद्धरण"], canonicalAnswer: "Address Block", explanation: "Address Block प्राप्तकर्ता के पता फ़ील्ड का स्वरूपित समूह डालना करता है।" },
    pa: { stem: "ਰੂਪਬੱਧ ਪ੍ਰਾਪਤਕਰਤਾ ਪਤਾ ਸ਼ਾਮਲ ਕਰਨਾ ਕਰਨ ਵਾਲਾ Mailings ਟੈਬਟੈਬ ਵਿਸ਼ੇਸ਼ਤਾ ਕਿਹੜਾ ਹੈ?", options: ["Address Block", "ਪੰਨਾ Number", "Caption", "ਹਵਾਲਾ"], canonicalAnswer: "Address Block", explanation: "Address Block ਪ੍ਰਾਪਤਕਰਤਾ ਦੇ ਪਤਾ ਫੀਲਡ ਦਾ ਰੂਪਬੱਧ ਸਮੂਹ ਸ਼ਾਮਲ ਕਰਨਾ ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-026", targetFactId: "com003-word-mailings-greeting-line", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which Mailings-tab feature adds a personalized salutation such as Dear Anil?", options: ["Address Block", "Greeting Line", "Edit Recipient List", "Labels"], canonicalAnswer: "Greeting Line", explanation: "Greeting Line inserts a personalized salutation using recipient data." },
    hi: { stem: "प्रिय अनिल जैसा वैयक्तिकृत संबोधन जोड़ने वाला Mailings टैबटैब सुविधा कौन-सा है?", options: ["Address Block", "Greeting Line", "संपादित करें प्राप्तकर्ता सूची", "लेबल"], canonicalAnswer: "Greeting Line", explanation: "Greeting Line प्राप्तकर्ता डेटा का उपयोग करके वैयक्तिकृत संबोधन डालना करता है।" },
    pa: { stem: "ਪਿਆਰੇ ਅਨਿਲ ਵਰਗਾ ਵਿਅਕਤੀਗਤ ਸੰਬੋਧਨ ਜੋੜਨ ਵਾਲਾ Mailings ਟੈਬਟੈਬ ਵਿਸ਼ੇਸ਼ਤਾ ਕਿਹੜਾ ਹੈ?", options: ["Address Block", "Greeting Line", "ਸੋਧੋ ਪ੍ਰਾਪਤਕਰਤਾ ਸੂਚੀ", "ਲੇਬਲ"], canonicalAnswer: "Greeting Line", explanation: "Greeting Line ਪ੍ਰਾਪਤਕਰਤਾ ਡਾਟਾ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਵਿਅਕਤੀਗਤ ਸੰਬੋਧਨ ਸ਼ਾਮਲ ਕਰਨਾ ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-026", targetFactId: "com003-word-mailings-preview-results", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 2,
    en: { stem: "Which Mailings-tab command shows how merged records will appear before completion?", options: ["Select Recipients", "Insert Merge Field", "Preview Results", "Start Mail Merge"], canonicalAnswer: "Preview Results", explanation: "Preview Results displays the merged document with recipient values before the merge is completed." },
    hi: { stem: "समापन से पहले विलयित अभिलेख कैसे दिखेंगे, यह दिखाने वाला Mailings टैबटैब कमांड कौन-सा है?", options: ["चुनना प्राप्तकर्ता", "Insert Merge Field", "Preview Results", "Start Mail Merge"], canonicalAnswer: "Preview Results", explanation: "Preview Results विलय पूर्ण होने से पहले प्राप्तकर्ता मान वाला दस्तावेज़ दिखाता है।" },
    pa: { stem: "ਮੁਕੰਮਲਤਾ ਤੋਂ ਪਹਿਲਾਂ ਮਿਲਾਇਆ ਹੋਇਆ ਰਿਕਾਰਡ ਕਿਵੇਂ ਦਿਖਣਗੇ, ਇਹ ਦਿਖਾਉਣ ਵਾਲਾ Mailings ਟੈਬਟੈਬ ਕਮਾਂਡ ਕਿਹੜਾ ਹੈ?", options: ["ਚੁਣਨਾ ਪ੍ਰਾਪਤਕਰਤਾ", "Insert Merge Field", "Preview Results", "Start Mail Merge"], canonicalAnswer: "Preview Results", explanation: "Preview Results ਮਿਲਾਉਣਾ ਪੂਰਾ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਪ੍ਰਾਪਤਕਰਤਾ ਮੁੱਲ ਵਾਲਾ ਦਸਤਾਵੇਜ਼ ਦਿਖਾਉਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-026", targetFactId: "com003-word-mailings-finish-merge", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 3,
    en: { stem: "Which Mailings-tab command produces the final merged documents or messages?", options: ["Preview Results", "Select Recipients", "Edit Recipient List", "Finish & Merge"], canonicalAnswer: "Finish & Merge", explanation: "Finish & Merge completes the merge and creates the final output." },
    hi: { stem: "अंतिम विलयित दस्तावेज़ या संदेश बनाने वाला Mailings टैबटैब कमांड कौन-सा है?", options: ["Preview Results", "चुनना प्राप्तकर्ता", "संपादित करें प्राप्तकर्ता सूची", "Finish & Merge"], canonicalAnswer: "Finish & Merge", explanation: "Finish & Merge विलय को पूरा करके अंतिम परिणाम बनाता है।" },
    pa: { stem: "ਅੰਤਿਮ ਮਿਲਾਇਆ ਹੋਇਆ ਦਸਤਾਵੇਜ਼ ਜਾਂ ਸੁਨੇਹੇ ਬਣਾਉਣ ਵਾਲਾ Mailings ਟੈਬਟੈਬ ਕਮਾਂਡ ਕਿਹੜਾ ਹੈ?", options: ["Preview Results", "ਚੁਣਨਾ ਪ੍ਰਾਪਤਕਰਤਾ", "ਸੋਧੋ ਪ੍ਰਾਪਤਕਰਤਾ ਸੂਚੀ", "Finish & Merge"], canonicalAnswer: "Finish & Merge", explanation: "Finish & Merge ਮਿਲਾਉਣਾ ਨੂੰ ਪੂਰਾ ਕਰਕੇ ਅੰਤਿਮ ਨਤੀਜਾ ਬਣਾਉਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-027", targetFactId: "com003-word-review-editor", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Which Review-tab feature checks spelling, grammar and writing suggestions?", options: ["Editor", "Mail Merge", "Themes", "Columns"], canonicalAnswer: "Editor", explanation: "Editor checks spelling, grammar and other writing issues for review." },
    hi: { stem: "Spelling, व्याकरण और लेखन सुझाव जाँच करने वाला समीक्षा टैबटैब सुविधा कौन-सा है?", options: ["Editor", "Mail Merge", "Themes", "स्तंभ"], canonicalAnswer: "Editor", explanation: "Editor वर्तनी, व्याकरण और अन्य लेखन समस्याएँ को समीक्षा के लिए जाँच करता है।" },
    pa: { stem: "Spelling, ਵਿਆਕਰਨ ਅਤੇ ਲਿਖਤ ਸੁਝਾਅ ਜਾਂਚ ਕਰਨ ਵਾਲਾ ਸਮੀਖਿਆ ਟੈਬਟੈਬ ਵਿਸ਼ੇਸ਼ਤਾ ਕਿਹੜਾ ਹੈ?", options: ["Editor", "Mail Merge", "Themes", "ਕਾਲਮ"], canonicalAnswer: "Editor", explanation: "Editor ਸ਼ਬਦ-ਜੋੜ, ਵਿਆਕਰਨ ਅਤੇ ਹੋਰ ਲਿਖਤ ਸਮੱਸਿਆਵਾਂ ਨੂੰ ਸਮੀਖਿਆ ਲਈ ਜਾਂਚ ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-027", targetFactId: "com003-word-review-proofing-language", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "MEDIUM", correctIndex: 1,
    en: { stem: "Which Review-tab setting tells Word which language to use for proofing?", options: ["Translate Document", "Set Proofing Language", "New Comment", "Compare"], canonicalAnswer: "Set Proofing Language", explanation: "Set Proofing Language selects the language used for spelling and grammar checking." },
    hi: { stem: "Word को अशुद्धि-जाँच के लिए कौन-सी भाषा उपयोग करनी है, यह बताने वाली समीक्षा टैबटैब सेटिंग कौन-सी है?", options: ["Translate दस्तावेज़", "Set अशुद्धि-जाँच भाषा", "New Comment", "Compare"], canonicalAnswer: "Set अशुद्धि-जाँच भाषा", explanation: "Set अशुद्धि-जाँच भाषा वर्तनी और व्याकरण जाँच के लिए भाषा चुनती है।" },
    pa: { stem: "Word ਨੂੰ ਸ਼ੁੱਧ-ਜਾਂਚ ਲਈ ਕਿਹੜੀ ਭਾਸ਼ਾ ਵਰਤਣੀ ਹੈ, ਇਹ ਦੱਸਣ ਵਾਲੀ ਸਮੀਖਿਆ ਟੈਬਟੈਬ ਸੈਟਿੰਗ ਕਿਹੜੀ ਹੈ?", options: ["Translate ਦਸਤਾਵੇਜ਼", "Set ਸ਼ੁੱਧ-ਜਾਂਚ ਭਾਸ਼ਾ", "New Comment", "Compare"], canonicalAnswer: "Set ਸ਼ੁੱਧ-ਜਾਂਚ ਭਾਸ਼ਾ", explanation: "Set ਸ਼ੁੱਧ-ਜਾਂਚ ਭਾਸ਼ਾ ਸ਼ਬਦ-ਜੋੜ ਅਤੇ ਵਿਆਕਰਨ ਜਾਂਚ ਲਈ ਭਾਸ਼ਾ ਚੁਣਦੀ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-027", targetFactId: "com003-word-review-comments", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 2,
    en: { stem: "Which Review-tab feature adds a note without changing the main document text?", options: ["Accept", "Reject", "New Comment", "Track Changes"], canonicalAnswer: "New Comment", explanation: "New Comment adds an annotation for discussion while leaving the main text unchanged." },
    hi: { stem: "मुख्य दस्तावेज़ पाठ बदले बिना टिप्पणी जोड़ने वाला समीक्षा टैबटैब सुविधा कौन-सा है?", options: ["स्वीकारें", "अस्वीकारें", "New Comment", "Track Changes"], canonicalAnswer: "New Comment", explanation: "New Comment मुख्य पाठ बदले बिना चर्चा के लिए टिप्पणी जोड़ता है।" },
    pa: { stem: "ਮੁੱਖ ਦਸਤਾਵੇਜ਼ ਲਿਖਤ ਬਦਲੇ ਬਿਨਾਂ ਨੋਟ ਜੋੜਨ ਵਾਲਾ ਸਮੀਖਿਆ ਟੈਬਟੈਬ ਵਿਸ਼ੇਸ਼ਤਾ ਕਿਹੜਾ ਹੈ?", options: ["ਸਵੀਕਾਰੋ", "ਨਕਾਰੋ", "New Comment", "Track Changes"], canonicalAnswer: "New Comment", explanation: "New Comment ਮੁੱਖ ਲਿਖਤ ਬਦਲੇ ਬਿਨਾਂ ਚਰਚਾ ਲਈ ਟਿੱਪਣੀ ਜੋੜਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-027", targetFactId: "com003-word-review-track-changes", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 3,
    en: { stem: "Which Review-tab feature records edits made to a document?", options: ["Editor", "Compare", "Restrict Editing", "Track Changes"], canonicalAnswer: "Track Changes", explanation: "Track Changes records insertions, deletions and other edits for later review." },
    hi: { stem: "दस्तावेज़ में किए गए संपादन को अभिलेख करने वाला समीक्षा टैबटैब सुविधा कौन-सा है?", options: ["Editor", "Compare", "सीमित करना संपादन", "Track Changes"], canonicalAnswer: "Track Changes", explanation: "Track Changes सम्मिलन, हटाना और अन्य संपादन को बाद की समीक्षा के लिए अभिलेख करता है।" },
    pa: { stem: "ਦਸਤਾਵੇਜ਼ ਵਿੱਚ ਕੀਤੇ ਸੋਧਾਂ ਨੂੰ ਰਿਕਾਰਡ ਕਰਨ ਵਾਲਾ ਸਮੀਖਿਆ ਟੈਬਟੈਬ ਵਿਸ਼ੇਸ਼ਤਾ ਕਿਹੜਾ ਹੈ?", options: ["Editor", "Compare", "ਸੀਮਿਤ ਕਰਨਾ ਸੋਧ", "Track Changes"], canonicalAnswer: "Track Changes", explanation: "Track Changes ਸ਼ਾਮਲੀਆਂ, ਮਿਟਾਉਣ ਅਤੇ ਹੋਰ ਸੋਧਾਂ ਨੂੰ ਬਾਅਦ ਦੀ ਸਮੀਖਿਆ ਲਈ ਰਿਕਾਰਡ ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-027", targetFactId: "com003-word-review-accept-reject", surfaceMode: "FEATURE_FROM_EFFECT", examSurfaceFamily: "CONTRAST_DISCRIMINATION", difficulty: "MEDIUM", correctIndex: 0,
    en: { stem: "What is the effect of choosing Accept for a tracked change?", options: ["The change becomes part of the document", "The document is printed", "A new source is added", "The change is hidden only"], canonicalAnswer: "The change becomes part of the document", explanation: "Accept keeps the tracked edit as a normal part of the document." },
    hi: { stem: "ट्रैक किए गए बदलना के लिए स्वीकारें चुनने का प्रभाव क्या है?", options: ["बदलना दस्तावेज़ का भाग बन जाता है", "दस्तावेज़ मुद्रण हो जाता है", "नया स्रोत जुड़ता है", "बदलना केवल छिपाना होता है"], canonicalAnswer: "बदलना दस्तावेज़ का भाग बन जाता है", explanation: "स्वीकारें ट्रैक किए गए संपादित करें को दस्तावेज़ के सामान्य सामग्री का भाग बना देता है।" },
    pa: { stem: "ਟ੍ਰੈਕ ਕੀਤੇ ਹੋਏ ਬਦਲਣਾ ਲਈ ਸਵੀਕਾਰੋ ਚੁਣਨ ਦਾ ਪ੍ਰਭਾਵ ਕੀ ਹੁੰਦਾ ਹੈ?", options: ["ਬਦਲਣਾ ਦਸਤਾਵੇਜ਼ ਦਾ ਹਿੱਸਾ ਬਣ ਜਾਂਦਾ ਹੈ", "ਦਸਤਾਵੇਜ਼ ਛਪਾਈ ਹੋ ਜਾਂਦਾ ਹੈ", "ਨਵਾਂ ਸਰੋਤ ਜੁੜਦਾ ਹੈ", "ਬਦਲਣਾ ਸਿਰਫ਼ ਲੁਕਾਉਣਾ ਹੁੰਦਾ ਹੈ"], canonicalAnswer: "ਬਦਲਣਾ ਦਸਤਾਵੇਜ਼ ਦਾ ਹਿੱਸਾ ਬਣ ਜਾਂਦਾ ਹੈ", explanation: "ਸਵੀਕਾਰੋ ਟ੍ਰੈਕ ਕੀਤੇ ਹੋਏ ਸੋਧੋ ਨੂੰ ਦਸਤਾਵੇਜ਼ ਦੇ ਆਮ ਸਮੱਗਰੀ ਦਾ ਹਿੱਸਾ ਬਣਾ ਦਿੰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-027", targetFactId: "com003-word-review-reject", surfaceMode: "FEATURE_FROM_EFFECT", examSurfaceFamily: "CONTRAST_DISCRIMINATION", difficulty: "MEDIUM", correctIndex: 1,
    en: { stem: "What is the effect of choosing Reject for a tracked change?", options: ["The change is permanently accepted", "The tracked edit is discarded", "The page is rotated", "A citation is inserted"], canonicalAnswer: "The tracked edit is discarded", explanation: "Reject removes the proposed tracked change from the accepted document content." },
    hi: { stem: "ट्रैक किए गए बदलना के लिए अस्वीकारें चुनने का प्रभाव क्या है?", options: ["बदलना स्थायी रूप से स्वीकारें हो जाता है", "ट्रैक किए गए संपादित करें हटाना हो जाता है", "पृष्ठ घुमाना हो जाता है", "उद्धरण डालना होती है"], canonicalAnswer: "ट्रैक किए गए संपादित करें हटाना हो जाता है", explanation: "अस्वीकारें प्रस्तावित ट्रैक किए गए बदलना को स्वीकृत दस्तावेज़ सामग्री से हटा देता है।" },
    pa: { stem: "ਟ੍ਰੈਕ ਕੀਤੇ ਹੋਏ ਬਦਲਣਾ ਲਈ ਨਕਾਰੋ ਚੁਣਨ ਦਾ ਪ੍ਰਭਾਵ ਕੀ ਹੁੰਦਾ ਹੈ?", options: ["ਬਦਲਣਾ ਸਥਾਈ ਤੌਰ ਉੱਤੇ ਸਵੀਕਾਰੋ ਹੋ ਜਾਂਦਾ ਹੈ", "ਟ੍ਰੈਕ ਕੀਤੇ ਹੋਏ ਸੋਧੋ ਹਟਾਉਣਾ ਹੋ ਜਾਂਦਾ ਹੈ", "ਪੰਨਾ ਘੁੰਮਾਉਣਾ ਹੋ ਜਾਂਦਾ ਹੈ", "ਹਵਾਲਾ ਸ਼ਾਮਲ ਕਰਨਾ ਹੁੰਦੀ ਹੈ"], canonicalAnswer: "ਟ੍ਰੈਕ ਕੀਤੇ ਹੋਏ ਸੋਧੋ ਹਟਾਉਣਾ ਹੋ ਜਾਂਦਾ ਹੈ", explanation: "ਨਕਾਰੋ ਪੇਸ਼ ਕੀਤਾ ਟ੍ਰੈਕ ਕੀਤੇ ਹੋਏ ਬਦਲਣਾ ਨੂੰ ਸਵੀਕਾਰਿਆ ਦਸਤਾਵੇਜ਼ ਸਮੱਗਰੀ ਤੋਂ ਹਟਾ ਦਿੰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-027", targetFactId: "com003-word-review-compare", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "MEDIUM", correctIndex: 2,
    en: { stem: "Which Review-tab command compares two versions of a document?", options: ["Editor", "New Comment", "Compare", "Language"], canonicalAnswer: "Compare", explanation: "Compare examines two document versions and shows their differences." },
    hi: { stem: "दस्तावेज़ के दो संस्करण की तुलना करने वाला समीक्षा टैबटैब कमांड कौन-सा है?", options: ["Editor", "New Comment", "Compare", "भाषा"], canonicalAnswer: "Compare", explanation: "Compare दो दस्तावेज़ संस्करण की जाँच करके उनके अंतर दिखाता है।" },
    pa: { stem: "ਦਸਤਾਵੇਜ਼ ਦੇ ਦੋ ਰੂਪਾਂ ਦੀ ਤੁਲਨਾ ਕਰਨ ਵਾਲਾ ਸਮੀਖਿਆ ਟੈਬਟੈਬ ਕਮਾਂਡ ਕਿਹੜਾ ਹੈ?", options: ["Editor", "New Comment", "Compare", "ਭਾਸ਼ਾ"], canonicalAnswer: "Compare", explanation: "Compare ਦੋ ਦਸਤਾਵੇਜ਼ ਰੂਪਾਂ ਦੀ ਜਾਂਚ ਕਰਕੇ ਉਹਨਾਂ ਦੇ ਫਰਕ ਦਿਖਾਉਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-027", targetFactId: "com003-word-review-restrict-editing", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "MEDIUM", correctIndex: 3,
    en: { stem: "Which Review-tab command limits the types of changes users can make?", options: ["Track Changes", "Editor", "Compare", "Restrict Editing"], canonicalAnswer: "Restrict Editing", explanation: "Restrict Editing limits permitted editing actions in a document." },
    hi: { stem: "उपयोगकर्ता किस प्रकार के बदलाव कर सकते हैं, इसे सीमित करने वाला समीक्षा टैबटैब कमांड कौन-सा है?", options: ["Track Changes", "Editor", "Compare", "सीमित करना संपादन"], canonicalAnswer: "सीमित करना संपादन", explanation: "सीमित करना संपादन दस्तावेज़ में अनुमत संपादन क्रियाएँ को सीमित करता है।" },
    pa: { stem: "ਵਰਤੋਂਕਾਰ ਕਿਹੜੇ ਕਿਸਮ ਦੇ ਤਬਦੀਲੀਆਂ ਕਰ ਸਕਦੇ ਹਨ, ਇਸ ਨੂੰ ਸੀਮਿਤ ਕਰਨ ਵਾਲਾ ਸਮੀਖਿਆ ਟੈਬਟੈਬ ਕਮਾਂਡ ਕਿਹੜਾ ਹੈ?", options: ["Track Changes", "Editor", "Compare", "ਸੀਮਿਤ ਕਰਨਾ ਸੋਧ"], canonicalAnswer: "ਸੀਮਿਤ ਕਰਨਾ ਸੋਧ", explanation: "ਸੀਮਿਤ ਕਰਨਾ ਸੋਧ ਦਸਤਾਵੇਜ਼ ਵਿੱਚ ਮਨਜ਼ੂਰ ਸੋਧ ਕਾਰਵਾਈਆਂ ਨੂੰ ਸੀਮਿਤ ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-028", targetFactId: "com003-word-view-print-layout", surfaceMode: "VIEW_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Which Word view shows pages close to how they will appear when printed?", options: ["Print Layout", "Draft", "Outline", "Web Layout"], canonicalAnswer: "Print Layout", explanation: "Print Layout displays page boundaries and a view close to the printed document." },
    hi: { stem: "कौन-सा Word दृश्य पृष्ठ को मुद्रित दस्तावेज़ जैसा दिखाता है?", options: ["Print Layout", "मसौदा", "रूपरेखा", "वेब Layout"], canonicalAnswer: "Print Layout", explanation: "Print Layout पृष्ठ सीमाएँ और मुद्रित दस्तावेज़ के करीब दृश्य दिखाता है।" },
    pa: { stem: "ਕਿਹੜਾ Word ਦ੍ਰਿਸ਼ ਪੰਨੇ ਨੂੰ ਛਪੇ ਹੋਏ ਦਸਤਾਵੇਜ਼ ਵਰਗਾ ਦਿਖਾਉਂਦਾ ਹੈ?", options: ["Print Layout", "ਮਸੌਦਾ", "ਰੂਪ-ਰੇਖਾ", "ਵੈੱਬ Layout"], canonicalAnswer: "Print Layout", explanation: "Print Layout ਪੰਨਾ ਹੱਦਾਂ ਅਤੇ ਛਪੇ ਹੋਏ ਦਸਤਾਵੇਜ਼ ਦੇ ਨੇੜੇ ਦ੍ਰਿਸ਼ ਦਿਖਾਉਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-028", targetFactId: "com003-word-view-read-mode", surfaceMode: "VIEW_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which Word view is intended mainly for reading a document?", options: ["Draft", "Read Mode", "Outline", "Web Layout"], canonicalAnswer: "Read Mode", explanation: "Read Mode is designed to make reading a document easier." },
    hi: { stem: "दस्तावेज़ पढ़ने के लिए मुख्य रूप से बनाया गया Word दृश्य कौन-सा है?", options: ["मसौदा", "पढ़ना मोड", "रूपरेखा", "वेब Layout"], canonicalAnswer: "पढ़ना मोड", explanation: "पढ़ना मोड दस्तावेज़ को पढ़ना आसान बनाने के लिए बनाया गया है।" },
    pa: { stem: "ਦਸਤਾਵੇਜ਼ ਪੜ੍ਹਨ ਲਈ ਮੁੱਖ ਤੌਰ ਉੱਤੇ ਬਣਾਇਆ Word ਦ੍ਰਿਸ਼ ਕਿਹੜਾ ਹੈ?", options: ["ਮਸੌਦਾ", "ਪੜ੍ਹਨਾ ਮੋਡ", "ਰੂਪ-ਰੇਖਾ", "ਵੈੱਬ Layout"], canonicalAnswer: "ਪੜ੍ਹਨਾ ਮੋਡ", explanation: "ਪੜ੍ਹਨਾ ਮੋਡ ਦਸਤਾਵੇਜ਼ ਨੂੰ ਪੜ੍ਹਨਾ ਆਸਾਨ ਬਣਾਉਣ ਲਈ ਬਣਾਇਆ ਗਿਆ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-028", targetFactId: "com003-word-view-outline", surfaceMode: "VIEW_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 2,
    en: { stem: "Which Word view displays the document structure through heading levels?", options: ["Print Layout", "Draft", "Outline", "Read Mode"], canonicalAnswer: "Outline", explanation: "Outline view displays and manages the document structure through heading levels." },
    hi: { stem: "शीर्षक स्तर के माध्यम से दस्तावेज़ संरचना दिखाने वाला Word दृश्य कौन-सा है?", options: ["Print Layout", "मसौदा", "रूपरेखा", "पढ़ना मोड"], canonicalAnswer: "रूपरेखा", explanation: "रूपरेखा दृश्य शीर्षक स्तर के माध्यम से दस्तावेज़ संरचना दिखाता और प्रबंधित करना करता है।" },
    pa: { stem: "ਸਿਰਲੇਖ ਪੱਧਰ ਰਾਹੀਂ ਦਸਤਾਵੇਜ਼ ਬਣਤਰ ਦਿਖਾਉਣ ਵਾਲਾ Word ਦ੍ਰਿਸ਼ ਕਿਹੜਾ ਹੈ?", options: ["Print Layout", "ਮਸੌਦਾ", "ਰੂਪ-ਰੇਖਾ", "ਪੜ੍ਹਨਾ ਮੋਡ"], canonicalAnswer: "ਰੂਪ-ਰੇਖਾ", explanation: "ਰੂਪ-ਰੇਖਾ ਦ੍ਰਿਸ਼ ਸਿਰਲੇਖ ਪੱਧਰ ਰਾਹੀਂ ਦਸਤਾਵੇਜ਼ ਬਣਤਰ ਦਿਖਾਉਂਦਾ ਅਤੇ ਪ੍ਰਬੰਧਿਤ ਕਰਨਾ ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-028", targetFactId: "com003-word-view-web-layout", surfaceMode: "VIEW_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 3,
    en: { stem: "Which Word view displays a document in a form suited to reading on a screen like a webpage?", options: ["Print Layout", "Draft", "Outline", "Web Layout"], canonicalAnswer: "Web Layout", explanation: "Web Layout displays the document in a webpage-like screen view." },
    hi: { stem: "दस्तावेज़ को वेबपृष्ठ जैसी स्क्रीन दृश्य में दिखाने वाला Word दृश्य कौन-सा है?", options: ["Print Layout", "मसौदा", "रूपरेखा", "वेब Layout"], canonicalAnswer: "वेब Layout", explanation: "वेब Layout दस्तावेज़ को वेबपृष्ठ जैसी स्क्रीन दृश्य में दिखाता है।" },
    pa: { stem: "ਦਸਤਾਵੇਜ਼ ਨੂੰ ਵੈੱਬਪੰਨਾ ਵਰਗੀ ਸਕ੍ਰੀਨ ਦ੍ਰਿਸ਼ ਵਿੱਚ ਦਿਖਾਉਣ ਵਾਲਾ Word ਦ੍ਰਿਸ਼ ਕਿਹੜਾ ਹੈ?", options: ["Print Layout", "ਮਸੌਦਾ", "ਰੂਪ-ਰੇਖਾ", "ਵੈੱਬ Layout"], canonicalAnswer: "ਵੈੱਬ Layout", explanation: "ਵੈੱਬ Layout ਦਸਤਾਵੇਜ਼ ਨੂੰ ਵੈੱਬਪੰਨਾ ਵਰਗੀ ਸਕ੍ਰੀਨ ਦ੍ਰਿਸ਼ ਵਿੱਚ ਦਿਖਾਉਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-028", targetFactId: "com003-word-view-navigation-pane", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Which View-tab feature helps jump between headings in a long document?", options: ["Navigation Pane", "Page Color", "Address Block", "Watermark"], canonicalAnswer: "Navigation Pane", explanation: "Navigation Pane helps search the document and move between headings or pages." },
    hi: { stem: "लंबा दस्तावेज़ में शीर्षक के बीच जल्दी जाने में मदद करने वाला दृश्य टैबटैब सुविधा कौन-सा है?", options: ["Navigation Pane", "Page Color", "Address Block", "Watermark"], canonicalAnswer: "Navigation Pane", explanation: "Navigation Pane दस्तावेज़ खोज करने और शीर्षक या पृष्ठ के बीच जाने में मदद करता है।" },
    pa: { stem: "ਲੰਮਾ ਦਸਤਾਵੇਜ਼ ਵਿੱਚ ਸਿਰਲੇਖ ਵਿਚਕਾਰ ਜਲਦੀ ਜਾਣ ਵਿੱਚ ਮਦਦ ਕਰਨ ਵਾਲਾ ਦ੍ਰਿਸ਼ ਟੈਬਟੈਬ ਵਿਸ਼ੇਸ਼ਤਾ ਕਿਹੜਾ ਹੈ?", options: ["Navigation Pane", "Page Color", "Address Block", "Watermark"], canonicalAnswer: "Navigation Pane", explanation: "Navigation Pane ਦਸਤਾਵੇਜ਼ ਖੋਜ ਕਰਨ ਅਤੇ ਸਿਰਲੇਖ ਜਾਂ ਪੰਨੇ ਵਿਚਕਾਰ ਜਾਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-028", targetFactId: "com003-word-view-ruler", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which View-tab command displays the ruler used for tabs and indents?", options: ["Gridlines", "Ruler", "Zoom", "Split"], canonicalAnswer: "Ruler", explanation: "Ruler displays the measurement guide used to set tabs and indents." },
    hi: { stem: "टैब और इंडेंट के लिए उपयोग होने वाला स्केल दिखाने वाला दृश्य टैबटैब कमांड कौन-सा है?", options: ["ग्रिडलाइनें", "स्केल", "Zoom", "विभाजित करें"], canonicalAnswer: "स्केल", explanation: "स्केल टैब और इंडेंट निर्धारित करना करने के लिए माप मार्गदर्शक दिखाता है।" },
    pa: { stem: "ਟੈਬ ਅਤੇ ਇੰਡੈਂਟ ਲਈ ਵਰਤਿਆ ਪੈਮਾਨਾ ਦਿਖਾਉਣ ਵਾਲਾ ਦ੍ਰਿਸ਼ ਟੈਬਟੈਬ ਕਮਾਂਡ ਕਿਹੜਾ ਹੈ?", options: ["ਗ੍ਰਿਡਲਾਈਨਾਂ", "ਪੈਮਾਨਾ", "Zoom", "ਵੰਡੋ"], canonicalAnswer: "ਪੈਮਾਨਾ", explanation: "ਪੈਮਾਨਾ ਟੈਬ ਅਤੇ ਇੰਡੈਂਟ ਨਿਰਧਾਰਤ ਕਰਨਾ ਕਰਨ ਲਈ ਮਾਪ ਗਾਈਡ ਦਿਖਾਉਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-028", targetFactId: "com003-word-view-gridlines", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 2,
    en: { stem: "Which View-tab command displays non-printing gridlines to help align objects?", options: ["Ruler", "Zoom", "Gridlines", "Read Mode"], canonicalAnswer: "Gridlines", explanation: "Gridlines provide visual alignment guides and are not normally printed as document content." },
    hi: { stem: "वस्तुएँ संरेखित करना करने में मदद करने वाली गैर-मुद्रण ग्रिडलाइनें दिखाने वाला दृश्य टैबटैब कमांड कौन-सा है?", options: ["स्केल", "Zoom", "ग्रिडलाइनें", "पढ़ना मोड"], canonicalAnswer: "ग्रिडलाइनें", explanation: "ग्रिडलाइनें दृश्य संरेखण मार्गदर्शक देती हैं और सामान्यतः दस्तावेज़ सामग्री की तरह मुद्रण नहीं होतीं।" },
    pa: { stem: "ਵਸਤੂਆਂ ਸੰਰેખਿਤ ਕਰਨਾ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰਨ ਵਾਲੀਆਂ ਗੈਰ-ਛਪਾਈ ਗ੍ਰਿਡਲਾਈਨਾਂ ਦਿਖਾਉਣ ਵਾਲਾ ਦ੍ਰਿਸ਼ ਟੈਬਟੈਬ ਕਮਾਂਡ ਕਿਹੜਾ ਹੈ?", options: ["ਪੈਮਾਨਾ", "Zoom", "ਗ੍ਰਿਡਲਾਈਨਾਂ", "ਪੜ੍ਹਨਾ ਮੋਡ"], canonicalAnswer: "ਗ੍ਰਿਡਲਾਈਨਾਂ", explanation: "ਗ੍ਰਿਡਲਾਈਨਾਂ ਦ੍ਰਿਸ਼ ਸੰਰેખਣ ਗਾਈਡ ਦਿੰਦੀਆਂ ਹਨ ਅਤੇ ਆਮ ਤੌਰ ਉੱਤੇ ਦਸਤਾਵੇਜ਼ ਸਮੱਗਰੀ ਵਾਂਗ ਛਪਾਈ ਨਹੀਂ ਹੁੰਦੀਆਂ।" },
  },
  {
    qlId: "COM-003-QL-028", targetFactId: "com003-word-view-zoom", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 3,
    en: { stem: "Which View-tab control changes how large the document appears on screen without changing page content?", options: ["Ruler", "Gridlines", "Navigation Pane", "Zoom"], canonicalAnswer: "Zoom", explanation: "Zoom changes the on-screen magnification; it does not change the document's actual text or page settings." },
    hi: { stem: "पृष्ठ सामग्री बदले बिना स्क्रीन पर दस्तावेज़ का आकार बदलने वाला दृश्य टैबटैब नियंत्रण कौन-सा है?", options: ["स्केल", "ग्रिडलाइनें", "Navigation Pane", "Zoom"], canonicalAnswer: "Zoom", explanation: "Zoom पर-स्क्रीन आवर्धन बदलता है; दस्तावेज़ का वास्तविक पाठ या पृष्ठ सेटिंग्स नहीं बदलता।" },
    pa: { stem: "ਪੰਨਾ ਸਮੱਗਰੀ ਬਦਲੇ ਬਿਨਾਂ ਸਕ੍ਰੀਨ ਉੱਤੇ ਦਸਤਾਵੇਜ਼ ਦਾ ਆਕਾਰ ਬਦਲਣ ਵਾਲਾ ਦ੍ਰਿਸ਼ ਟੈਬਟੈਬ ਨਿਯੰਤਰਣ ਕਿਹੜਾ ਹੈ?", options: ["ਪੈਮਾਨਾ", "ਗ੍ਰਿਡਲਾਈਨਾਂ", "Navigation Pane", "Zoom"], canonicalAnswer: "Zoom", explanation: "Zoom ਉੱਤੇ-ਸਕ੍ਰੀਨ ਵੱਡਾ ਕਰਨਾ ਬਦਲਦਾ ਹੈ; ਦਸਤਾਵੇਜ਼ ਦਾ ਅਸਲ ਲਿਖਤ ਜਾਂ ਪੰਨਾ ਸੈਟਿੰਗਾਂ ਨਹੀਂ ਬਦਲਦਾ।" },
  },

  {
    qlId: "COM-003-QL-029", targetFactId: "com003-word-file-new", surfaceMode: "TAB_TO_COMMAND", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Which File-tab command creates a new Word document?", options: ["New", "Open", "Info", "Export"], canonicalAnswer: "New", explanation: "The New command creates a new document from a blank file or template." },
    hi: { stem: "नया Word दस्तावेज़ बनाने वाला File टैबटैब कमांड कौन-सा है?", options: ["नया", "Open", "Info", "Export"], canonicalAnswer: "नया", explanation: "नया कमांड रिक्त फ़ाइल या टेम्पलेट से नया दस्तावेज़ बनाता है।" },
    pa: { stem: "ਨਵਾਂ Word ਦਸਤਾਵੇਜ਼ ਬਣਾਉਣ ਵਾਲਾ File ਟੈਬਟੈਬ ਕਮਾਂਡ ਕਿਹੜਾ ਹੈ?", options: ["ਨਵਾਂ", "Open", "Info", "Export"], canonicalAnswer: "ਨਵਾਂ", explanation: "ਨਵਾਂ ਕਮਾਂਡ ਖਾਲੀ ਫ਼ਾਈਲ ਜਾਂ ਟੈਂਪਲੇਟ ਤੋਂ ਨਵਾਂ ਦਸਤਾਵੇਜ਼ ਬਣਾਉਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-029", targetFactId: "com003-word-file-open", surfaceMode: "TAB_TO_COMMAND", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which File-tab command opens an existing Word document?", options: ["New", "Open", "Save As", "Print"], canonicalAnswer: "Open", explanation: "Open loads an existing document from a file location." },
    hi: { stem: "मौजूदा Word दस्तावेज़ खोलने वाला File टैबटैब कमांड कौन-सा है?", options: ["नया", "Open", "Save जैसे", "Print"], canonicalAnswer: "Open", explanation: "Open फ़ाइल स्थान से मौजूदा दस्तावेज़ लोड करना करता है।" },
    pa: { stem: "ਮੌਜੂਦਾ Word ਦਸਤਾਵੇਜ਼ ਖੋਲ੍ਹਣ ਵਾਲਾ File ਟੈਬਟੈਬ ਕਮਾਂਡ ਕਿਹੜਾ ਹੈ?", options: ["ਨਵਾਂ", "Open", "Save ਵਜੋਂ", "Print"], canonicalAnswer: "Open", explanation: "Open ਫ਼ਾਈਲ ਥਾਂ ਤੋਂ ਮੌਜੂਦਾ ਦਸਤਾਵੇਜ਼ ਲੋਡ ਕਰਨਾ ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-029", targetFactId: "com003-word-file-save-as", surfaceMode: "TAB_TO_COMMAND", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 2,
    en: { stem: "Which File-tab command saves a document with a new name or file format?", options: ["New", "Open", "Save As", "Close"], canonicalAnswer: "Save As", explanation: "Save As creates a saved copy with a chosen name, location or format." },
    hi: { stem: "दस्तावेज़ को नए नाम या फ़ाइल स्वरूप के साथ सहेजना करने वाला File टैबटैब कमांड कौन-सा है?", options: ["नया", "Open", "Save जैसे", "Close"], canonicalAnswer: "Save जैसे", explanation: "Save जैसे चुने गए नाम, स्थान या स्वरूप के साथ सहेजा गया कॉपी बनाता है।" },
    pa: { stem: "ਦਸਤਾਵੇਜ਼ ਨੂੰ ਨਵੇਂ ਨਾਮ ਜਾਂ ਫ਼ਾਈਲ ਰੂਪ ਨਾਲ ਸੰਭਾਲਣਾ ਕਰਨ ਵਾਲਾ File ਟੈਬਟੈਬ ਕਮਾਂਡ ਕਿਹੜਾ ਹੈ?", options: ["ਨਵਾਂ", "Open", "Save ਵਜੋਂ", "Close"], canonicalAnswer: "Save ਵਜੋਂ", explanation: "Save ਵਜੋਂ ਚੁਣੇ ਨਾਮ, ਥਾਂ ਜਾਂ ਰੂਪ ਨਾਲ ਸੰਭਾਲਿਆ ਗਿਆ ਕਾਪੀ ਬਣਾਉਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-029", targetFactId: "com003-word-file-print", surfaceMode: "TAB_TO_COMMAND", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 3,
    en: { stem: "Which File-tab command opens print settings and print preview?", options: ["Info", "Share", "Export", "Print"], canonicalAnswer: "Print", explanation: "Print opens print settings and a preview of the document output." },
    hi: { stem: "Print सेटिंग्स और मुद्रण पूर्वावलोकन खोलने वाला File टैबटैब कमांड कौन-सा है?", options: ["Info", "साझा करें", "Export", "Print"], canonicalAnswer: "Print", explanation: "Print दस्तावेज़ परिणाम की मुद्रण सेटिंग्स और पूर्वावलोकन खोलता है।" },
    pa: { stem: "Print ਸੈਟਿੰਗਾਂ ਅਤੇ ਛਪਾਈ ਪੂਰਵ-ਦ੍ਰਿਸ਼ ਖੋਲ੍ਹਣ ਵਾਲਾ File ਟੈਬਟੈਬ ਕਮਾਂਡ ਕਿਹੜਾ ਹੈ?", options: ["Info", "ਸਾਂਝਾ ਕਰੋ", "Export", "Print"], canonicalAnswer: "Print", explanation: "Print ਦਸਤਾਵੇਜ਼ ਨਤੀਜਾ ਦੀਆਂ ਛਪਾਈ ਸੈਟਿੰਗਾਂ ਅਤੇ ਪੂਰਵ-ਦ੍ਰਿਸ਼ ਖੋਲ੍ਹਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-029", targetFactId: "com003-word-file-info", surfaceMode: "TAB_TO_COMMAND", examSurfaceFamily: "DIRECT_RECALL", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Which File-tab area shows document properties and protection options?", options: ["Info", "Open", "New", "Print"], canonicalAnswer: "Info", explanation: "Info shows document properties and options such as protecting the document." },
    hi: { stem: "दस्तावेज़ गुण और सुरक्षा विकल्प दिखाने वाला File टैबटैब क्षेत्र कौन-सा है?", options: ["Info", "Open", "नया", "Print"], canonicalAnswer: "Info", explanation: "Info दस्तावेज़ गुण और दस्तावेज़ सुरक्षा जैसे विकल्प दिखाता है।" },
    pa: { stem: "ਦਸਤਾਵੇਜ਼ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਅਤੇ ਸੁਰੱਖਿਆ ਵਿਕਲਪ ਦਿਖਾਉਣ ਵਾਲਾ File ਟੈਬਟੈਬ ਖੇਤਰ ਕਿਹੜਾ ਹੈ?", options: ["Info", "Open", "ਨਵਾਂ", "Print"], canonicalAnswer: "Info", explanation: "Info ਦਸਤਾਵੇਜ਼ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਅਤੇ ਦਸਤਾਵੇਜ਼ ਸੁਰੱਖਿਆ ਵਰਗੇ ਵਿਕਲਪ ਦਿਖਾਉਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-029", targetFactId: "com003-word-file-export", surfaceMode: "TAB_TO_COMMAND", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which File-tab command is used to create a copy in another supported format?", options: ["Open", "Export", "New", "Close"], canonicalAnswer: "Export", explanation: "Export creates a copy of the document in another supported output format." },
    hi: { stem: "दस्तावेज़ की कॉपी को दूसरे समर्थित स्वरूप में बनाने के लिए कौन-सा File टैबटैब कमांड उपयोग होता है?", options: ["Open", "Export", "नया", "Close"], canonicalAnswer: "Export", explanation: "Export दस्तावेज़ की कॉपी को दूसरे समर्थित परिणाम स्वरूप में बनाता है।" },
    pa: { stem: "ਦਸਤਾਵੇਜ਼ ਦੀ ਕਾਪੀ ਨੂੰ ਹੋਰ ਸਮਰਥਿਤ ਰੂਪ ਵਿੱਚ ਬਣਾਉਣ ਲਈ ਕਿਹੜਾ File ਟੈਬਟੈਬ ਕਮਾਂਡ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?", options: ["Open", "Export", "ਨਵਾਂ", "Close"], canonicalAnswer: "Export", explanation: "Export ਦਸਤਾਵੇਜ਼ ਦੀ ਕਾਪੀ ਨੂੰ ਹੋਰ ਸਮਰਥਿਤ ਨਤੀਜਾ ਰੂਪ ਵਿੱਚ ਬਣਾਉਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-029", targetFactId: "com003-word-file-share", surfaceMode: "TAB_TO_COMMAND", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 2,
    en: { stem: "Which File-tab command is intended for sending or sharing a document with others?", options: ["Print", "Info", "Share", "Page Color"], canonicalAnswer: "Share", explanation: "Share provides document-sharing options, subject to the account and platform in use." },
    hi: { stem: "दूसरों को दस्तावेज़ भेजने या साझा करें करने के लिए कौन-सा File टैबटैब कमांड वांछित है?", options: ["Print", "Info", "साझा करें", "Page Color"], canonicalAnswer: "साझा करें", explanation: "साझा करें दस्तावेज़ साझाकरण विकल्प देता है; उपलब्ध विकल्प खाता और मंच पर निर्भर हो सकते हैं।" },
    pa: { stem: "ਹੋਰਾਂ ਨੂੰ ਦਸਤਾਵੇਜ਼ ਭੇਜਣ ਜਾਂ ਸਾਂਝਾ ਕਰੋ ਕਰਨ ਲਈ ਕਿਹੜਾ File ਟੈਬਟੈਬ ਕਮਾਂਡ ਇੱਛਤ ਹੈ?", options: ["Print", "Info", "ਸਾਂਝਾ ਕਰੋ", "Page Color"], canonicalAnswer: "ਸਾਂਝਾ ਕਰੋ", explanation: "ਸਾਂਝਾ ਕਰੋ ਦਸਤਾਵੇਜ਼ ਸਾਂਝਾ ਕਰਨਾ ਵਿਕਲਪ ਦਿੰਦਾ ਹੈ; ਉਪਲਬਧ ਵਿਕਲਪ ਖਾਤਾ ਅਤੇ ਪਲੇਟਫਾਰਮ ਉੱਤੇ ਨਿਰਭਰ ਕਰ ਸਕਦੇ ਹਨ।" },
  },
  {
    qlId: "COM-003-QL-029", targetFactId: "com003-word-file-close", surfaceMode: "TAB_TO_COMMAND", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 3,
    en: { stem: "Which File-tab command closes the current document?", options: ["Export", "Save As", "New", "Close"], canonicalAnswer: "Close", explanation: "Close closes the current document while leaving the Word application open." },
    hi: { stem: "वर्तमान दस्तावेज़ बंद करने वाला File टैबटैब कमांड कौन-सा है?", options: ["Export", "Save जैसे", "नया", "Close"], canonicalAnswer: "Close", explanation: "Close वर्तमान दस्तावेज़ बंद करता है और Word अनुप्रयोग खुली रह सकती है।" },
    pa: { stem: "ਮੌਜੂਦਾ ਦਸਤਾਵੇਜ਼ ਬੰਦ ਕਰਨ ਵਾਲਾ File ਟੈਬਟੈਬ ਕਮਾਂਡ ਕਿਹੜਾ ਹੈ?", options: ["Export", "Save ਵਜੋਂ", "ਨਵਾਂ", "Close"], canonicalAnswer: "Close", explanation: "Close ਮੌਜੂਦਾ ਦਸਤਾਵੇਜ਼ ਬੰਦ ਕਰਦਾ ਹੈ ਅਤੇ Word ਐਪਲੀਕੇਸ਼ਨ ਖੁੱਲ੍ਹੀ ਰਹਿ ਸਕਦੀ ਹੈ।" },
  },
] as const;

const sourceAudit = auditCom003WordTabsSources();
if (!sourceAudit.valid) throw new Error(`COM-003 Word tabs source audit failed: ${sourceAudit.issues.join(", ")}`);

const validQlIds = new Set(COM003_WORD_TABS_QLS.map((item) => item.qlId));
const sourceIds = new Set(COM003_WORD_TABS_SOURCE_AUTHORITIES.map((item) => item.sourceId));

export type Com003WordTabsQuestion = {
  questionId: string;
  sourceQuestionId: string;
  localizationId: string;
  qlId: string;
  cpId: "COM-003-CP-002";
  language: Com003WordTabsLanguage;
  locale: "en-IN" | "hi-IN" | "pa-IN";
  surfaceMode: string;
  examSurfaceFamily: Com003WordTabsFamily;
  targetFactId: string;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
  difficulty: Com003WordTabsDifficulty;
  versionScoped: true;
  sourceEnglishFrozen: true;
  sourceLocalizationFrozen: false;
  reviewOnly: true;
  runtimeRegistered: false;
};

function materialize(language: Com003WordTabsLanguage): readonly Com003WordTabsQuestion[] {
  const locale = language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "pa-IN";
  return D.map((definition, index) => {
    const ql = qlById.get(definition.qlId);
    if (!ql) throw new Error(`Missing Word tabs QL metadata for ${definition.qlId}`);
    const copy = definition[language];
    if (copy.options.length !== 4 || copy.options[definition.correctIndex] !== copy.canonicalAnswer) {
      throw new Error(`Invalid Word tabs answer position ${definition.targetFactId}/${language}`);
    }
    return {
      questionId: `COM003-WORD-TABS-${String(index + 1).padStart(3, "0")}`,
      sourceQuestionId: `COM003-WORD-TABS-${String(index + 1).padStart(3, "0")}`,
      localizationId: `COM003-WORD-TABS-${language.toUpperCase()}-${String(index + 1).padStart(3, "0")}`,
      qlId: definition.qlId,
      cpId: "COM-003-CP-002",
      language,
      locale,
      surfaceMode: definition.surfaceMode,
      examSurfaceFamily: definition.examSurfaceFamily,
      targetFactId: definition.targetFactId,
      stem: copy.stem,
      options: copy.options,
      correctIndex: definition.correctIndex,
      canonicalAnswer: copy.canonicalAnswer,
      explanation: copy.explanation,
      sourceIds: ql.sourceIds,
      sourceFactIds: [definition.targetFactId],
      difficulty: definition.difficulty,
      versionScoped: true,
      sourceEnglishFrozen: true,
      sourceLocalizationFrozen: false,
      reviewOnly: true,
      runtimeRegistered: false,
    };
  });
}

export const COM003_WORD_TABS_ENGLISH_REVIEW = materialize("en");
export const COM003_WORD_TABS_HINDI_REVIEW = materialize("hi");
export const COM003_WORD_TABS_PUNJABI_REVIEW = materialize("pa");

export const COM003_WORD_TABS_AUTHORITY_V1 = Object.freeze({
  authorityId: "COM-003-WORD-TABS-COMPLETION-V1" as const,
  packageId: "COM-003-WORD-TABS" as const,
  chapterCode: "COM-003" as const,
  cpId: "COM-003-CP-002" as const,
  status: "REVIEW_ONLY" as const,
  scope: "Exam-relevant Word interface and Ribbon tab functionality for the standard desktop Word surface." as const,
  permanentQlIds: Object.freeze(COM003_WORD_TABS_QLS.map((item) => item.qlId)),
  qlCount: COM003_WORD_TABS_QLS.length,
  questionsPerQlPerLanguage: 8,
  questionCountPerLanguage: COM003_WORD_TABS_ENGLISH_REVIEW.length,
  supportedLanguages: Object.freeze(["en", "hi", "pa"] as const),
  englishQuestionCount: COM003_WORD_TABS_ENGLISH_REVIEW.length,
  hindiQuestionCount: COM003_WORD_TABS_HINDI_REVIEW.length,
  punjabiQuestionCount: COM003_WORD_TABS_PUNJABI_REVIEW.length,
  totalQuestionLanguageArtifacts: COM003_WORD_TABS_ENGLISH_REVIEW.length + COM003_WORD_TABS_HINDI_REVIEW.length + COM003_WORD_TABS_PUNJABI_REVIEW.length,
  versionScoped: true,
  hardDifficultyAuthorized: false,
  questionBankAcceptanceMode: "REQUIRES_USER_APPROVAL_THEN_BANK_ONLY" as const,
  questionStudioRuntimeAuthorized: true,
  questionBankWritesAuthorized: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  productionReleaseAuthorized: false,
});

export function auditCom003WordTabsCompletion() {
  const issues: string[] = [];
  if (D.length !== COM003_WORD_TABS_QLS.length * 8) issues.push(`ENGLISH_COUNT:${D.length}`);
  for (const ql of COM003_WORD_TABS_QLS) {
    const questions = D.filter((item) => item.qlId === ql.qlId);
    if (questions.length !== 8) issues.push(`QL_COUNT:${ql.qlId}:${questions.length}`);
    for (const question of questions) {
      if (!validQlIds.has(question.qlId)) issues.push(`UNKNOWN_QL:${question.qlId}`);
      if (!ql.sourceIds.every((sourceId) => sourceIds.has(sourceId))) issues.push(`UNKNOWN_SOURCE:${ql.qlId}`);
      if (question.en.options.length !== 4 || question.hi.options.length !== 4 || question.pa.options.length !== 4) issues.push(`OPTION_COUNT:${question.targetFactId}`);
      if (question.en.options[question.correctIndex] !== question.en.canonicalAnswer) issues.push(`EN_ANSWER:${question.targetFactId}`);
      if (question.hi.options[question.correctIndex] !== question.hi.canonicalAnswer) issues.push(`HI_ANSWER:${question.targetFactId}`);
      if (question.pa.options[question.correctIndex] !== question.pa.canonicalAnswer) issues.push(`PA_ANSWER:${question.targetFactId}`);
      if (!question.en.stem.trim() || !question.hi.stem.trim() || !question.pa.stem.trim()) issues.push(`EMPTY_STEM:${question.targetFactId}`);
      if (!question.en.explanation.trim() || !question.hi.explanation.trim() || !question.pa.explanation.trim()) issues.push(`EMPTY_EXPLANATION:${question.targetFactId}`);
      if (/^(?:based on|in the following|according to|as per)\b/i.test(question.en.stem)) issues.push(`FILLER_STEM:${question.targetFactId}`);
    }
  }
  const ids = [COM003_WORD_TABS_ENGLISH_REVIEW, COM003_WORD_TABS_HINDI_REVIEW, COM003_WORD_TABS_PUNJABI_REVIEW].map((items) => items.map((item) => item.sourceQuestionId).join("|"));
  if (!(ids[0] === ids[1] && ids[1] === ids[2])) issues.push("LANGUAGE_PARITY");
  return {
    valid: issues.length === 0,
    qls: COM003_WORD_TABS_QLS.length,
    questionsPerLanguage: COM003_WORD_TABS_ENGLISH_REVIEW.length,
    totalQuestionLanguageArtifacts: COM003_WORD_TABS_AUTHORITY_V1.totalQuestionLanguageArtifacts,
    issues,
  };
}

export const COM003_WORD_TABS_COMPLETION_AUDIT_V1 = auditCom003WordTabsCompletion();
if (!COM003_WORD_TABS_COMPLETION_AUDIT_V1.valid) {
  throw new Error(`COM-003 Word tabs completion audit failed: ${COM003_WORD_TABS_COMPLETION_AUDIT_V1.issues.join(", ")}`);
}
