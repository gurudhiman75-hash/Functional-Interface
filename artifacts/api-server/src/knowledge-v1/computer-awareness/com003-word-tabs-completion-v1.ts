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
    hi: { stem: "Word Ribbon के एक group में क्या होता है?", options: ["संबंधित commands", "केवल document pages", "केवल file names", "केवल spelling errors"], canonicalAnswer: "संबंधित commands", explanation: "Ribbon group संबंधित commands को एक साथ रखता है ताकि उनका उपयोग साथ किया जा सके।" },
    pa: { stem: "Word Ribbon ਦੇ ਇੱਕ group ਵਿੱਚ ਕੀ ਹੁੰਦਾ ਹੈ?", options: ["ਸੰਬੰਧਿਤ commands", "ਸਿਰਫ਼ document pages", "ਸਿਰਫ਼ file names", "ਸਿਰਫ਼ spelling errors"], canonicalAnswer: "ਸੰਬੰਧਿਤ commands", explanation: "Ribbon group ਸੰਬੰਧਿਤ commands ਨੂੰ ਇਕੱਠਾ ਰੱਖਦਾ ਹੈ ਤਾਂ ਜੋ ਉਹਨਾਂ ਨੂੰ ਇਕੱਠੇ ਵਰਤਿਆ ਜਾ ਸਕੇ।" },
  },
  {
    qlId: "COM-003-QL-020", targetFactId: "com003-word-tabs-quick-access-toolbar", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which Word interface area gives quick access to frequently used commands such as Save?", options: ["Status Bar", "Quick Access Toolbar", "Navigation Pane", "Ruler"], canonicalAnswer: "Quick Access Toolbar", explanation: "The Quick Access Toolbar provides quick access to commonly used commands such as Save and Undo." },
    hi: { stem: "Save जैसे बार-बार उपयोग होने वाले commands तक जल्दी पहुँच किस Word area से मिलती है?", options: ["Status Bar", "Quick Access Toolbar", "Navigation Pane", "Ruler"], canonicalAnswer: "Quick Access Toolbar", explanation: "Quick Access Toolbar Save और Undo जैसे सामान्य commands तक जल्दी पहुँच देता है।" },
    pa: { stem: "Save ਵਰਗੇ ਵਾਰ-ਵਾਰ ਵਰਤੇ ਜਾਣ ਵਾਲੇ commands ਤੱਕ ਤੁਰੰਤ ਪਹੁੰਚ Word ਦੇ ਕਿਹੜੇ area ਤੋਂ ਮਿਲਦੀ ਹੈ?", options: ["Status Bar", "Quick Access Toolbar", "Navigation Pane", "Ruler"], canonicalAnswer: "Quick Access Toolbar", explanation: "Quick Access Toolbar Save ਅਤੇ Undo ਵਰਗੇ ਆਮ commands ਤੱਕ ਤੁਰੰਤ ਪਹੁੰਚ ਦਿੰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-020", targetFactId: "com003-word-tabs-title-bar", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "DIRECT_RECALL", difficulty: "EASY", correctIndex: 2,
    en: { stem: "Which Word interface area normally shows the document title?", options: ["Ribbon", "Status Bar", "Title Bar", "Scroll Bar"], canonicalAnswer: "Title Bar", explanation: "The Title Bar normally displays the name of the document and the application." },
    hi: { stem: "कौन-सा Word interface area सामान्यतः document का title दिखाता है?", options: ["Ribbon", "Status Bar", "Title Bar", "Scroll Bar"], canonicalAnswer: "Title Bar", explanation: "Title Bar सामान्यतः document का नाम और application का नाम दिखाता है।" },
    pa: { stem: "ਕਿਹੜਾ Word interface area ਆਮ ਤੌਰ ਉੱਤੇ document ਦਾ title ਦਿਖਾਉਂਦਾ ਹੈ?", options: ["Ribbon", "Status Bar", "Title Bar", "Scroll Bar"], canonicalAnswer: "Title Bar", explanation: "Title Bar ਆਮ ਤੌਰ ਉੱਤੇ document ਦਾ ਨਾਮ ਅਤੇ application ਦਾ ਨਾਮ ਦਿਖਾਉਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-020", targetFactId: "com003-word-tabs-status-bar", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 3,
    en: { stem: "Where can a user commonly see page and word-count information in Word?", options: ["Title Bar", "Home tab", "Quick Access Toolbar", "Status Bar"], canonicalAnswer: "Status Bar", explanation: "The Status Bar commonly shows document information such as page position and word count." },
    hi: { stem: "Word में page और word-count information सामान्यतः कहाँ दिखाई देती है?", options: ["Title Bar", "Home tab", "Quick Access Toolbar", "Status Bar"], canonicalAnswer: "Status Bar", explanation: "Status Bar page position और word count जैसी document information दिखा सकता है।" },
    pa: { stem: "Word ਵਿੱਚ page ਅਤੇ word-count information ਆਮ ਤੌਰ ਉੱਤੇ ਕਿੱਥੇ ਦਿਖਾਈ ਦਿੰਦੀ ਹੈ?", options: ["Title Bar", "Home tab", "Quick Access Toolbar", "Status Bar"], canonicalAnswer: "Status Bar", explanation: "Status Bar page position ਅਤੇ word count ਵਰਗੀ document information ਦਿਖਾ ਸਕਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-020", targetFactId: "com003-word-tabs-file-backstage", surfaceMode: "TAB_TO_WORKSPACE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 0,
    en: { stem: "What opens when the File tab is selected in desktop Word?", options: ["Backstage view", "The ruler", "The spelling dictionary", "A worksheet"], canonicalAnswer: "Backstage view", explanation: "The File tab opens Backstage view, where document and file commands are managed." },
    hi: { stem: "Desktop Word में File tab चुनने पर क्या खुलता है?", options: ["Backstage view", "Ruler", "Spelling dictionary", "Worksheet"], canonicalAnswer: "Backstage view", explanation: "File tab Backstage view खोलता है, जहाँ document और file commands संभाले जाते हैं।" },
    pa: { stem: "Desktop Word ਵਿੱਚ File tab ਚੁਣਨ ਨਾਲ ਕੀ ਖੁੱਲ੍ਹਦਾ ਹੈ?", options: ["Backstage view", "Ruler", "Spelling dictionary", "Worksheet"], canonicalAnswer: "Backstage view", explanation: "File tab Backstage view ਖੋਲ੍ਹਦਾ ਹੈ, ਜਿੱਥੇ document ਅਤੇ file commands ਸੰਭਾਲੇ ਜਾਂਦੇ ਹਨ।" },
  },
  {
    qlId: "COM-003-QL-020", targetFactId: "com003-word-tabs-dialog-launcher", surfaceMode: "CONTROL_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "MEDIUM", correctIndex: 1,
    en: { stem: "What does a dialog box launcher in a Ribbon group usually open?", options: ["A new document", "More detailed settings", "A slide show", "The Windows desktop"], canonicalAnswer: "More detailed settings", explanation: "A dialog box launcher opens a dialog box with more detailed options for that group." },
    hi: { stem: "Ribbon group में dialog box launcher सामान्यतः क्या खोलता है?", options: ["नया document", "अधिक detailed settings", "Slide show", "Windows desktop"], canonicalAnswer: "अधिक detailed settings", explanation: "Dialog box launcher उस group की अधिक detailed options वाली dialog box खोलता है।" },
    pa: { stem: "Ribbon group ਵਿੱਚ dialog box launcher ਆਮ ਤੌਰ ਉੱਤੇ ਕੀ ਖੋਲ੍ਹਦਾ ਹੈ?", options: ["ਨਵਾਂ document", "ਹੋਰ detailed settings", "Slide show", "Windows desktop"], canonicalAnswer: "ਹੋਰ detailed settings", explanation: "Dialog box launcher ਉਸ group ਦੀਆਂ ਹੋਰ detailed options ਵਾਲੀ dialog box ਖੋਲ੍ਹਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-020", targetFactId: "com003-word-tabs-contextual-tab", surfaceMode: "FEATURE_FROM_EVENT", examSurfaceFamily: "EXAMPLE_RECOGNITION", difficulty: "MEDIUM", correctIndex: 2,
    en: { stem: "What type of Word tab may appear when a picture or table is selected?", options: ["Permanent system tab", "Only the File tab", "Contextual tab", "A worksheet tab"], canonicalAnswer: "Contextual tab", explanation: "A contextual tab appears for a selected object and provides commands related to that object." },
    hi: { stem: "Picture या table select करने पर Word में किस प्रकार का tab दिखाई दे सकता है?", options: ["Permanent system tab", "केवल File tab", "Contextual tab", "Worksheet tab"], canonicalAnswer: "Contextual tab", explanation: "Contextual tab चुने गए object से संबंधित commands दिखाता है और object select होने पर दिखाई दे सकता है।" },
    pa: { stem: "Picture ਜਾਂ table select ਕਰਨ ਨਾਲ Word ਵਿੱਚ ਕਿਹੜੀ ਕਿਸਮ ਦਾ tab ਦਿਖ ਸਕਦਾ ਹੈ?", options: ["Permanent system tab", "ਸਿਰਫ਼ File tab", "Contextual tab", "Worksheet tab"], canonicalAnswer: "Contextual tab", explanation: "Contextual tab ਚੁਣੇ object ਨਾਲ ਸੰਬੰਧਿਤ commands ਦਿਖਾਉਂਦਾ ਹੈ ਅਤੇ object select ਹੋਣ ਉੱਤੇ ਆ ਸਕਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-020", targetFactId: "com003-word-tabs-tab-command-ownership", surfaceMode: "TAB_TO_FEATURE", examSurfaceFamily: "CONTRAST_DISCRIMINATION", difficulty: "MEDIUM", correctIndex: 3,
    en: { stem: "Which Word feature is mainly found on the Home tab rather than the View tab?", options: ["Ruler", "Zoom", "Navigation Pane", "Bold"], canonicalAnswer: "Bold", explanation: "Bold is a character-formatting command on the Home tab; the View tab controls viewing tools such as Zoom and Ruler." },
    hi: { stem: "कौन-सा Word feature View tab के बजाय मुख्य रूप से Home tab पर मिलता है?", options: ["Ruler", "Zoom", "Navigation Pane", "Bold"], canonicalAnswer: "Bold", explanation: "Bold Home tab का character-formatting command है; View tab Zoom और Ruler जैसे viewing tools संभालता है।" },
    pa: { stem: "ਕਿਹੜਾ Word feature View tab ਦੀ ਬਜਾਏ ਮੁੱਖ ਤੌਰ ਉੱਤੇ Home tab ਉੱਤੇ ਮਿਲਦਾ ਹੈ?", options: ["Ruler", "Zoom", "Navigation Pane", "Bold"], canonicalAnswer: "Bold", explanation: "Bold Home tab ਦਾ character-formatting command ਹੈ; View tab Zoom ਅਤੇ Ruler ਵਰਗੇ viewing tools ਸੰਭਾਲਦਾ ਹੈ।" },
  },

  {
    qlId: "COM-003-QL-021", targetFactId: "com003-word-home-clipboard", surfaceMode: "GROUP_FROM_COMMAND", examSurfaceFamily: "DIRECT_RECALL", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Which Home-tab group contains common Cut, Copy and Paste commands?", options: ["Clipboard", "Font", "Styles", "Editing"], canonicalAnswer: "Clipboard", explanation: "The Clipboard group contains common Cut, Copy and Paste commands." },
    hi: { stem: "Cut, Copy और Paste commands किस Home-tab group में होते हैं?", options: ["Clipboard", "Font", "Styles", "Editing"], canonicalAnswer: "Clipboard", explanation: "Clipboard group में Cut, Copy और Paste जैसे सामान्य commands होते हैं।" },
    pa: { stem: "Cut, Copy ਅਤੇ Paste commands ਕਿਹੜੇ Home-tab group ਵਿੱਚ ਹੁੰਦੇ ਹਨ?", options: ["Clipboard", "Font", "Styles", "Editing"], canonicalAnswer: "Clipboard", explanation: "Clipboard group ਵਿੱਚ Cut, Copy ਅਤੇ Paste ਵਰਗੇ ਆਮ commands ਹੁੰਦੇ ਹਨ।" },
  },
  {
    qlId: "COM-003-QL-021", targetFactId: "com003-word-home-format-painter", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which Home-tab tool copies formatting from one selection to another?", options: ["Replace", "Format Painter", "Word Count", "Translate"], canonicalAnswer: "Format Painter", explanation: "Format Painter copies formatting such as font, size and style to another selection." },
    hi: { stem: "एक selection की formatting को दूसरी selection पर copy करने वाला Home-tab tool कौन-सा है?", options: ["Replace", "Format Painter", "Word Count", "Translate"], canonicalAnswer: "Format Painter", explanation: "Format Painter font, size और style जैसी formatting को दूसरी selection पर copy करता है।" },
    pa: { stem: "ਇੱਕ selection ਦੀ formatting ਨੂੰ ਦੂਜੀ selection ਉੱਤੇ copy ਕਰਨ ਵਾਲਾ Home-tab tool ਕਿਹੜਾ ਹੈ?", options: ["Replace", "Format Painter", "Word Count", "Translate"], canonicalAnswer: "Format Painter", explanation: "Format Painter font, size ਅਤੇ style ਵਰਗੀ formatting ਨੂੰ ਦੂਜੀ selection ਉੱਤੇ copy ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-021", targetFactId: "com003-word-home-font-group", surfaceMode: "GROUP_FROM_EFFECT", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 3,
    en: { stem: "Which Home-tab group changes font name, size and character style?", options: ["Paragraph", "Clipboard", "Editing", "Font"], canonicalAnswer: "Font", explanation: "The Font group controls character settings such as font name, size, bold and italic." },
    hi: { stem: "Font name, size और character style बदलने वाला Home-tab group कौन-सा है?", options: ["Paragraph", "Clipboard", "Editing", "Font"], canonicalAnswer: "Font", explanation: "Font group font name, size, bold और italic जैसी character settings संभालता है।" },
    pa: { stem: "Font name, size ਅਤੇ character style ਬਦਲਣ ਵਾਲਾ Home-tab group ਕਿਹੜਾ ਹੈ?", options: ["Paragraph", "Clipboard", "Editing", "Font"], canonicalAnswer: "Font", explanation: "Font group font name, size, bold ਅਤੇ italic ਵਰਗੀਆਂ character settings ਸੰਭਾਲਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-021", targetFactId: "com003-word-home-alignment", surfaceMode: "FEATURE_FROM_EFFECT", examSurfaceFamily: "EXAMPLE_RECOGNITION", difficulty: "EASY", correctIndex: 3,
    en: { stem: "Which Home-tab command controls whether a paragraph is left, centred, right or justified?", options: ["Font Color", "Change Case", "Text Highlight", "Paragraph alignment"], canonicalAnswer: "Paragraph alignment", explanation: "Paragraph alignment controls the horizontal position of paragraph text." },
    hi: { stem: "Paragraph को left, centred, right या justified करने वाला Home-tab command कौन-सा है?", options: ["Font Color", "Change Case", "Text Highlight", "Paragraph alignment"], canonicalAnswer: "Paragraph alignment", explanation: "Paragraph alignment paragraph text की horizontal position नियंत्रित करता है।" },
    pa: { stem: "Paragraph ਨੂੰ left, centred, right ਜਾਂ justified ਕਰਨ ਵਾਲਾ Home-tab command ਕਿਹੜਾ ਹੈ?", options: ["Font Color", "Change Case", "Text Highlight", "Paragraph alignment"], canonicalAnswer: "Paragraph alignment", explanation: "Paragraph alignment paragraph text ਦੀ horizontal position ਨੂੰ ਨਿਯੰਤਰਿਤ ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-021", targetFactId: "com003-word-home-bullets", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Which Home-tab feature is used to create an unordered list?", options: ["Bullets", "Numbering", "Sort", "Borders"], canonicalAnswer: "Bullets", explanation: "Bullets create an unordered list in which items are marked without a sequence number." },
    hi: { stem: "Unordered list बनाने के लिए Home tab का कौन-सा feature उपयोग होता है?", options: ["Bullets", "Numbering", "Sort", "Borders"], canonicalAnswer: "Bullets", explanation: "Bullets unordered list बनाते हैं जिसमें items को sequence number के बिना चिन्हित किया जाता है।" },
    pa: { stem: "Unordered list ਬਣਾਉਣ ਲਈ Home tab ਦਾ ਕਿਹੜਾ feature ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?", options: ["Bullets", "Numbering", "Sort", "Borders"], canonicalAnswer: "Bullets", explanation: "Bullets unordered list ਬਣਾਉਂਦੇ ਹਨ ਜਿਸ ਵਿੱਚ items ਨੂੰ sequence number ਤੋਂ ਬਿਨਾਂ ਨਿਸ਼ਾਨ ਲਾਇਆ ਜਾਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-021", targetFactId: "com003-word-home-styles", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which Home-tab area applies a coordinated set of formatting to text?", options: ["Clipboard", "Styles", "Editing", "Voice"], canonicalAnswer: "Styles", explanation: "The Styles gallery applies a coordinated set of formatting, such as a heading style, to text." },
    hi: { stem: "Text पर coordinated formatting लागू करने वाला Home-tab area कौन-सा है?", options: ["Clipboard", "Styles", "Editing", "Voice"], canonicalAnswer: "Styles", explanation: "Styles gallery text पर heading style जैसी coordinated formatting लागू करती है।" },
    pa: { stem: "Text ਉੱਤੇ coordinated formatting ਲਾਗੂ ਕਰਨ ਵਾਲਾ Home-tab area ਕਿਹੜਾ ਹੈ?", options: ["Clipboard", "Styles", "Editing", "Voice"], canonicalAnswer: "Styles", explanation: "Styles gallery text ਉੱਤੇ heading style ਵਰਗੀ coordinated formatting ਲਾਗੂ ਕਰਦੀ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-021", targetFactId: "com003-word-home-find", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 2,
    en: { stem: "Which Home-tab command locates a word or phrase without changing it?", options: ["Replace", "Select All", "Find", "Format Painter"], canonicalAnswer: "Find", explanation: "Find searches for a word or phrase; Replace is used when the found text must be changed." },
    hi: { stem: "Word या phrase को बिना बदले locate करने वाला Home-tab command कौन-सा है?", options: ["Replace", "Select All", "Find", "Format Painter"], canonicalAnswer: "Find", explanation: "Find word या phrase खोजता है; मिले हुए text को बदलने के लिए Replace उपयोग होता है।" },
    pa: { stem: "Word ਜਾਂ phrase ਨੂੰ ਬਦਲੇ ਬਿਨਾਂ locate ਕਰਨ ਵਾਲਾ Home-tab command ਕਿਹੜਾ ਹੈ?", options: ["Replace", "Select All", "Find", "Format Painter"], canonicalAnswer: "Find", explanation: "Find word ਜਾਂ phrase ਖੋਜਦਾ ਹੈ; ਮਿਲੇ text ਨੂੰ ਬਦਲਣ ਲਈ Replace ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-021", targetFactId: "com003-word-home-replace", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "CONTRAST_DISCRIMINATION", difficulty: "MEDIUM", correctIndex: 3,
    en: { stem: "Which Home-tab command changes every matching occurrence of a word or phrase?", options: ["Find", "Select", "Sort", "Replace All"], canonicalAnswer: "Replace All", explanation: "Replace All changes every matching occurrence of the specified text in the document." },
    hi: { stem: "किस Home-tab command से word या phrase की सभी matching occurrences बदली जाती हैं?", options: ["Find", "Select", "Sort", "Replace All"], canonicalAnswer: "Replace All", explanation: "Replace All document में specified text की हर matching occurrence बदलता है।" },
    pa: { stem: "ਕਿਹੜੇ Home-tab command ਨਾਲ word ਜਾਂ phrase ਦੀਆਂ ਸਾਰੀਆਂ matching occurrences ਬਦਲੀਆਂ ਜਾਂਦੀਆਂ ਹਨ?", options: ["Find", "Select", "Sort", "Replace All"], canonicalAnswer: "Replace All", explanation: "Replace All document ਵਿੱਚ specified text ਦੀ ਹਰ matching occurrence ਬਦਲਦਾ ਹੈ।" },
  },

  {
    qlId: "COM-003-QL-022", targetFactId: "com003-word-insert-table", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Which Insert-tab feature organizes information in rows and columns?", options: ["Table", "WordArt", "Bookmark", "Equation"], canonicalAnswer: "Table", explanation: "A table organizes information in rows and columns." },
    hi: { stem: "Rows और columns में information व्यवस्थित करने वाला Insert-tab feature कौन-सा है?", options: ["Table", "WordArt", "Bookmark", "Equation"], canonicalAnswer: "Table", explanation: "Table information को rows और columns में व्यवस्थित करता है।" },
    pa: { stem: "Rows ਅਤੇ columns ਵਿੱਚ information व्यवस्थित ਕਰਨ ਵਾਲਾ Insert-tab feature ਕਿਹੜਾ ਹੈ?", options: ["Table", "WordArt", "Bookmark", "Equation"], canonicalAnswer: "Table", explanation: "Table information ਨੂੰ rows ਅਤੇ columns ਵਿੱਚ व्यवस्थित ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-022", targetFactId: "com003-word-insert-picture", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which Insert-tab feature adds a photograph or other image to a Word document?", options: ["Chart", "Pictures", "Footnote", "Caption"], canonicalAnswer: "Pictures", explanation: "Pictures inserts image content such as a photograph or illustration." },
    hi: { stem: "Word document में photograph या अन्य image जोड़ने वाला Insert-tab feature कौन-सा है?", options: ["Chart", "Pictures", "Footnote", "Caption"], canonicalAnswer: "Pictures", explanation: "Pictures photograph या illustration जैसी image content insert करता है।" },
    pa: { stem: "Word document ਵਿੱਚ photograph ਜਾਂ ਹੋਰ image ਜੋੜਨ ਵਾਲਾ Insert-tab feature ਕਿਹੜਾ ਹੈ?", options: ["Chart", "Pictures", "Footnote", "Caption"], canonicalAnswer: "Pictures", explanation: "Pictures photograph ਜਾਂ illustration ਵਰਗੀ image content insert ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-022", targetFactId: "com003-word-insert-shapes", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "DIRECT_RECALL", difficulty: "EASY", correctIndex: 2,
    en: { stem: "Which Insert-tab feature adds ready-made lines, arrows and geometric objects?", options: ["Header", "Symbol", "Shapes", "Page Number"], canonicalAnswer: "Shapes", explanation: "Shapes provides ready-made lines, arrows and geometric objects for insertion." },
    hi: { stem: "Ready-made lines, arrows और geometric objects जोड़ने वाला Insert-tab feature कौन-सा है?", options: ["Header", "Symbol", "Shapes", "Page Number"], canonicalAnswer: "Shapes", explanation: "Shapes insertion के लिए ready-made lines, arrows और geometric objects देता है।" },
    pa: { stem: "Ready-made lines, arrows ਅਤੇ geometric objects ਜੋੜਨ ਵਾਲਾ Insert-tab feature ਕਿਹੜਾ ਹੈ?", options: ["Header", "Symbol", "Shapes", "Page Number"], canonicalAnswer: "Shapes", explanation: "Shapes insertion ਲਈ ready-made lines, arrows ਅਤੇ geometric objects ਦਿੰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-022", targetFactId: "com003-word-insert-smartart", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 3,
    en: { stem: "Which Insert-tab feature is designed to present a process or hierarchy visually?", options: ["Table", "Page Break", "Bookmark", "SmartArt"], canonicalAnswer: "SmartArt", explanation: "SmartArt provides visual layouts for processes, hierarchies and related information." },
    hi: { stem: "Process या hierarchy को visually present करने के लिए कौन-सा Insert-tab feature बना है?", options: ["Table", "Page Break", "Bookmark", "SmartArt"], canonicalAnswer: "SmartArt", explanation: "SmartArt processes, hierarchies और related information के लिए visual layouts देता है।" },
    pa: { stem: "Process ਜਾਂ hierarchy ਨੂੰ visually present ਕਰਨ ਲਈ ਕਿਹੜਾ Insert-tab feature ਬਣਿਆ ਹੈ?", options: ["Table", "Page Break", "Bookmark", "SmartArt"], canonicalAnswer: "SmartArt", explanation: "SmartArt processes, hierarchies ਅਤੇ related information ਲਈ visual layouts ਦਿੰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-022", targetFactId: "com003-word-insert-header-footer", surfaceMode: "TAB_TO_FEATURE", examSurfaceFamily: "DIRECT_RECALL", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Where does Word place the command for adding a header or footer?", options: ["Insert tab", "Design tab", "Review tab", "View tab"], canonicalAnswer: "Insert tab", explanation: "Word places Header and Footer commands on the Insert tab." },
    hi: { stem: "Header या footer जोड़ने का command Word में कहाँ होता है?", options: ["Insert tab", "Design tab", "Review tab", "View tab"], canonicalAnswer: "Insert tab", explanation: "Word में Header और Footer commands Insert tab पर होते हैं।" },
    pa: { stem: "Header ਜਾਂ footer ਜੋੜਨ ਵਾਲਾ command Word ਵਿੱਚ ਕਿੱਥੇ ਹੁੰਦਾ ਹੈ?", options: ["Insert tab", "Design tab", "Review tab", "View tab"], canonicalAnswer: "Insert tab", explanation: "Word ਵਿੱਚ Header ਅਤੇ Footer commands Insert tab ਉੱਤੇ ਹੁੰਦੇ ਹਨ।" },
  },
  {
    qlId: "COM-003-QL-022", targetFactId: "com003-word-insert-page-number", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which Insert-tab command adds page numbers to a document?", options: ["Caption", "Page Number", "Bookmark", "Text Box"], canonicalAnswer: "Page Number", explanation: "The Page Number command inserts numbering in a header, footer or another available position." },
    hi: { stem: "Document में page numbers जोड़ने वाला Insert-tab command कौन-सा है?", options: ["Caption", "Page Number", "Bookmark", "Text Box"], canonicalAnswer: "Page Number", explanation: "Page Number command header, footer या उपलब्ध अन्य position में numbering insert करता है।" },
    pa: { stem: "Document ਵਿੱਚ page numbers ਜੋੜਨ ਵਾਲਾ Insert-tab command ਕਿਹੜਾ ਹੈ?", options: ["Caption", "Page Number", "Bookmark", "Text Box"], canonicalAnswer: "Page Number", explanation: "Page Number command header, footer ਜਾਂ ਉਪਲਬਧ ਹੋਰ position ਵਿੱਚ numbering insert ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-022", targetFactId: "com003-word-insert-hyperlink", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 2,
    en: { stem: "Which Insert-tab feature creates a clickable link to a webpage or another location?", options: ["Equation", "Symbol", "Link", "Screenshot"], canonicalAnswer: "Link", explanation: "Link creates a hyperlink to a webpage, file or another location." },
    hi: { stem: "Webpage या अन्य location का clickable link बनाने वाला Insert-tab feature कौन-सा है?", options: ["Equation", "Symbol", "Link", "Screenshot"], canonicalAnswer: "Link", explanation: "Link webpage, file या अन्य location के लिए hyperlink बनाता है।" },
    pa: { stem: "Webpage ਜਾਂ ਹੋਰ location ਦਾ clickable link ਬਣਾਉਣ ਵਾਲਾ Insert-tab feature ਕਿਹੜਾ ਹੈ?", options: ["Equation", "Symbol", "Link", "Screenshot"], canonicalAnswer: "Link", explanation: "Link webpage, file ਜਾਂ ਹੋਰ location ਲਈ hyperlink ਬਣਾਉਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-022", targetFactId: "com003-word-insert-page-break", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 3,
    en: { stem: "Which Insert-tab command starts the following content on a new page?", options: ["Section", "Column", "Caption", "Page Break"], canonicalAnswer: "Page Break", explanation: "A Page Break starts the following content on the next page." },
    hi: { stem: "Following content को नए page पर शुरू करने वाला Insert-tab command कौन-सा है?", options: ["Section", "Column", "Caption", "Page Break"], canonicalAnswer: "Page Break", explanation: "Page Break following content को अगले page पर शुरू करता है।" },
    pa: { stem: "Following content ਨੂੰ ਨਵੇਂ page ਉੱਤੇ ਸ਼ੁਰੂ ਕਰਨ ਵਾਲਾ Insert-tab command ਕਿਹੜਾ ਹੈ?", options: ["Section", "Column", "Caption", "Page Break"], canonicalAnswer: "Page Break", explanation: "Page Break following content ਨੂੰ ਅਗਲੇ page ਉੱਤੇ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ।" },
  },

  {
    qlId: "COM-003-QL-023", targetFactId: "com003-word-design-themes", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Which Design-tab feature applies a coordinated overall look to a document?", options: ["Themes", "Margins", "Footnotes", "Mail Merge"], canonicalAnswer: "Themes", explanation: "A theme applies coordinated document colors, fonts and effects." },
    hi: { stem: "Document को coordinated overall look देने वाला Design-tab feature कौन-सा है?", options: ["Themes", "Margins", "Footnotes", "Mail Merge"], canonicalAnswer: "Themes", explanation: "Theme document के colors, fonts और effects में coordinated look लागू करता है।" },
    pa: { stem: "Document ਨੂੰ coordinated overall look ਦੇਣ ਵਾਲਾ Design-tab feature ਕਿਹੜਾ ਹੈ?", options: ["Themes", "Margins", "Footnotes", "Mail Merge"], canonicalAnswer: "Themes", explanation: "Theme document ਦੇ colors, fonts ਅਤੇ effects ਉੱਤੇ coordinated look ਲਾਗੂ ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-023", targetFactId: "com003-word-design-theme-colors", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "DIRECT_RECALL", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which Design-tab option changes the coordinated color set used by a theme?", options: ["Effects", "Colors", "Columns", "Indent"], canonicalAnswer: "Colors", explanation: "Theme Colors changes the coordinated set of document colors." },
    hi: { stem: "Theme द्वारा उपयोग किए गए coordinated color set को बदलने वाला Design-tab option कौन-सा है?", options: ["Effects", "Colors", "Columns", "Indent"], canonicalAnswer: "Colors", explanation: "Theme Colors document colors के coordinated set को बदलता है।" },
    pa: { stem: "Theme ਵੱਲੋਂ ਵਰਤੇ coordinated color set ਨੂੰ ਬਦਲਣ ਵਾਲਾ Design-tab option ਕਿਹੜਾ ਹੈ?", options: ["Effects", "Colors", "Columns", "Indent"], canonicalAnswer: "Colors", explanation: "Theme Colors document colors ਦੇ coordinated set ਨੂੰ ਬਦਲਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-023", targetFactId: "com003-word-design-theme-fonts", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "DIRECT_RECALL", difficulty: "EASY", correctIndex: 2,
    en: { stem: "Which Design-tab option changes the coordinated heading and body font set?", options: ["Page Color", "Watermark", "Fonts", "Page Borders"], canonicalAnswer: "Fonts", explanation: "Theme Fonts changes the coordinated font set used by the document theme." },
    hi: { stem: "Coordinated heading और body font set बदलने वाला Design-tab option कौन-सा है?", options: ["Page Color", "Watermark", "Fonts", "Page Borders"], canonicalAnswer: "Fonts", explanation: "Theme Fonts document theme द्वारा उपयोग किए गए coordinated font set को बदलता है।" },
    pa: { stem: "Coordinated heading ਅਤੇ body font set ਬਦਲਣ ਵਾਲਾ Design-tab option ਕਿਹੜਾ ਹੈ?", options: ["Page Color", "Watermark", "Fonts", "Page Borders"], canonicalAnswer: "Fonts", explanation: "Theme Fonts document theme ਵੱਲੋਂ ਵਰਤੇ coordinated font set ਨੂੰ ਬਦਲਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-023", targetFactId: "com003-word-design-watermark", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 3,
    en: { stem: "Which Design-tab feature places faint text or an image behind document content?", options: ["Page Color", "Themes", "Effects", "Watermark"], canonicalAnswer: "Watermark", explanation: "A watermark places faint text or an image behind the main document content." },
    hi: { stem: "Document content के पीछे हल्का text या image रखने वाला Design-tab feature कौन-सा है?", options: ["Page Color", "Themes", "Effects", "Watermark"], canonicalAnswer: "Watermark", explanation: "Watermark मुख्य document content के पीछे हल्का text या image रखता है।" },
    pa: { stem: "Document content ਦੇ ਪਿੱਛੇ ਹਲਕਾ text ਜਾਂ image ਰੱਖਣ ਵਾਲਾ Design-tab feature ਕਿਹੜਾ ਹੈ?", options: ["Page Color", "Themes", "Effects", "Watermark"], canonicalAnswer: "Watermark", explanation: "Watermark ਮੁੱਖ document content ਦੇ ਪਿੱਛੇ ਹਲਕਾ text ਜਾਂ image ਰੱਖਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-023", targetFactId: "com003-word-design-page-borders", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Which Design-tab command adds a border around a page?", options: ["Page Borders", "Paragraph Spacing", "Size", "Breaks"], canonicalAnswer: "Page Borders", explanation: "Page Borders opens the controls for adding a border around a page or section." },
    hi: { stem: "Page के चारों ओर border जोड़ने वाला Design-tab command कौन-सा है?", options: ["Page Borders", "Paragraph Spacing", "Size", "Breaks"], canonicalAnswer: "Page Borders", explanation: "Page Borders page या section के चारों ओर border जोड़ने के controls खोलता है।" },
    pa: { stem: "Page ਦੇ ਆਲੇ-ਦੁਆਲੇ border ਜੋੜਨ ਵਾਲਾ Design-tab command ਕਿਹੜਾ ਹੈ?", options: ["Page Borders", "Paragraph Spacing", "Size", "Breaks"], canonicalAnswer: "Page Borders", explanation: "Page Borders page ਜਾਂ section ਦੇ ਆਲੇ-ਦੁਆਲੇ border ਜੋੜਨ ਵਾਲੇ controls ਖੋਲ੍ਹਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-023", targetFactId: "com003-word-design-page-color", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which Design-tab feature changes the background color of document pages?", options: ["Font Color", "Page Color", "Highlight", "Shading"], canonicalAnswer: "Page Color", explanation: "Page Color changes the background color used for document pages." },
    hi: { stem: "Document pages का background color बदलने वाला Design-tab feature कौन-सा है?", options: ["Font Color", "Page Color", "Highlight", "Shading"], canonicalAnswer: "Page Color", explanation: "Page Color document pages के लिए उपयोग होने वाला background color बदलता है।" },
    pa: { stem: "Document pages ਦਾ background color ਬਦਲਣ ਵਾਲਾ Design-tab feature ਕਿਹੜਾ ਹੈ?", options: ["Font Color", "Page Color", "Highlight", "Shading"], canonicalAnswer: "Page Color", explanation: "Page Color document pages ਲਈ ਵਰਤਿਆ background color ਬਦਲਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-023", targetFactId: "com003-word-design-paragraph-spacing", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "MEDIUM", correctIndex: 2,
    en: { stem: "Which Design-tab option changes the overall spacing between paragraphs in a document?", options: ["Page Borders", "Effects", "Paragraph Spacing", "Watermark"], canonicalAnswer: "Paragraph Spacing", explanation: "Paragraph Spacing applies an overall spacing choice between paragraphs." },
    hi: { stem: "Document में paragraphs के बीच overall spacing बदलने वाला Design-tab option कौन-सा है?", options: ["Page Borders", "Effects", "Paragraph Spacing", "Watermark"], canonicalAnswer: "Paragraph Spacing", explanation: "Paragraph Spacing paragraphs के बीच overall spacing choice लागू करता है।" },
    pa: { stem: "Document ਵਿੱਚ paragraphs ਵਿਚਕਾਰ overall spacing ਬਦਲਣ ਵਾਲਾ Design-tab option ਕਿਹੜਾ ਹੈ?", options: ["Page Borders", "Effects", "Paragraph Spacing", "Watermark"], canonicalAnswer: "Paragraph Spacing", explanation: "Paragraph Spacing paragraphs ਵਿਚਕਾਰ overall spacing choice ਲਾਗੂ ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-023", targetFactId: "com003-word-design-theme-effects", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "DIRECT_RECALL", difficulty: "MEDIUM", correctIndex: 3,
    en: { stem: "Which Design-tab option changes coordinated visual effects in a document theme?", options: ["Margins", "Footnotes", "Recipients", "Effects"], canonicalAnswer: "Effects", explanation: "Theme Effects changes the coordinated visual effects used by the document theme." },
    hi: { stem: "Document theme के coordinated visual effects बदलने वाला Design-tab option कौन-सा है?", options: ["Margins", "Footnotes", "Recipients", "Effects"], canonicalAnswer: "Effects", explanation: "Theme Effects document theme के coordinated visual effects बदलता है।" },
    pa: { stem: "Document theme ਦੇ coordinated visual effects ਬਦਲਣ ਵਾਲਾ Design-tab option ਕਿਹੜਾ ਹੈ?", options: ["Margins", "Footnotes", "Recipients", "Effects"], canonicalAnswer: "Effects", explanation: "Theme Effects document theme ਦੇ coordinated visual effects ਨੂੰ ਬਦਲਦਾ ਹੈ।" },
  },

  {
    qlId: "COM-003-QL-024", targetFactId: "com003-word-layout-margins", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Which Layout-tab feature controls the blank space around the edges of a page?", options: ["Margins", "Themes", "Citations", "Comments"], canonicalAnswer: "Margins", explanation: "Margins control the blank space between page edges and document content." },
    hi: { stem: "Page edges और document content के बीच blank space नियंत्रित करने वाला Layout-tab feature कौन-सा है?", options: ["Margins", "Themes", "Citations", "Comments"], canonicalAnswer: "Margins", explanation: "Margins page edges और document content के बीच blank space नियंत्रित करते हैं।" },
    pa: { stem: "Page edges ਅਤੇ document content ਵਿਚਕਾਰ blank space ਨੂੰ ਨਿਯੰਤਰਿਤ ਕਰਨ ਵਾਲਾ Layout-tab feature ਕਿਹੜਾ ਹੈ?", options: ["Margins", "Themes", "Citations", "Comments"], canonicalAnswer: "Margins", explanation: "Margins page edges ਅਤੇ document content ਵਿਚਕਾਰ blank space ਨੂੰ ਨਿਯੰਤਰਿਤ ਕਰਦੇ ਹਨ।" },
  },
  {
    qlId: "COM-003-QL-024", targetFactId: "com003-word-layout-orientation", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which Layout-tab command changes a page between portrait and landscape?", options: ["Size", "Orientation", "Columns", "Indent"], canonicalAnswer: "Orientation", explanation: "Orientation changes the page direction between portrait and landscape." },
    hi: { stem: "Page को portrait और landscape के बीच बदलने वाला Layout-tab command कौन-सा है?", options: ["Size", "Orientation", "Columns", "Indent"], canonicalAnswer: "Orientation", explanation: "Orientation page direction को portrait और landscape के बीच बदलता है।" },
    pa: { stem: "Page ਨੂੰ portrait ਅਤੇ landscape ਵਿਚਕਾਰ ਬਦਲਣ ਵਾਲਾ Layout-tab command ਕਿਹੜਾ ਹੈ?", options: ["Size", "Orientation", "Columns", "Indent"], canonicalAnswer: "Orientation", explanation: "Orientation page direction ਨੂੰ portrait ਅਤੇ landscape ਵਿਚਕਾਰ ਬਦਲਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-024", targetFactId: "com003-word-layout-paper-size", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "DIRECT_RECALL", difficulty: "EASY", correctIndex: 2,
    en: { stem: "Which Layout-tab option selects a paper size such as A4 or Letter?", options: ["Margins", "Breaks", "Size", "Line Numbers"], canonicalAnswer: "Size", explanation: "Size selects the paper size used by the document." },
    hi: { stem: "A4 या Letter जैसी paper size चुनने वाला Layout-tab option कौन-सा है?", options: ["Margins", "Breaks", "Size", "Line Numbers"], canonicalAnswer: "Size", explanation: "Size document में उपयोग होने वाली paper size चुनता है।" },
    pa: { stem: "A4 ਜਾਂ Letter ਵਰਗੀ paper size ਚੁਣਨ ਵਾਲਾ Layout-tab option ਕਿਹੜਾ ਹੈ?", options: ["Margins", "Breaks", "Size", "Line Numbers"], canonicalAnswer: "Size", explanation: "Size document ਵਿੱਚ ਵਰਤੀ ਜਾਣ ਵਾਲੀ paper size ਚੁਣਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-024", targetFactId: "com003-word-layout-columns", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 3,
    en: { stem: "Which Layout-tab feature divides text into newspaper-style vertical sections?", options: ["Orientation", "Hyphenation", "Line Numbers", "Columns"], canonicalAnswer: "Columns", explanation: "Columns divides page text into vertical columns, such as a newspaper layout." },
    hi: { stem: "Text को newspaper-style vertical sections में बाँटने वाला Layout-tab feature कौन-सा है?", options: ["Orientation", "Hyphenation", "Line Numbers", "Columns"], canonicalAnswer: "Columns", explanation: "Columns page text को newspaper layout जैसी vertical columns में बाँटता है।" },
    pa: { stem: "Text ਨੂੰ newspaper-style vertical sections ਵਿੱਚ ਵੰਡਣ ਵਾਲਾ Layout-tab feature ਕਿਹੜਾ ਹੈ?", options: ["Orientation", "Hyphenation", "Line Numbers", "Columns"], canonicalAnswer: "Columns", explanation: "Columns page text ਨੂੰ newspaper layout ਵਰਗੀਆਂ vertical columns ਵਿੱਚ ਵੰਡਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-024", targetFactId: "com003-word-layout-section-break", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "CONTRAST_DISCRIMINATION", difficulty: "MEDIUM", correctIndex: 0,
    en: { stem: "Which Layout-tab feature allows different page settings in different parts of one document?", options: ["Section Breaks", "Themes", "Word Count", "Styles"], canonicalAnswer: "Section Breaks", explanation: "Section Breaks divide a document into sections that can have different layout settings." },
    hi: { stem: "एक document के अलग parts में अलग page settings देने वाला Layout-tab feature कौन-सा है?", options: ["Section Breaks", "Themes", "Word Count", "Styles"], canonicalAnswer: "Section Breaks", explanation: "Section Breaks document को sections में बाँटते हैं और हर section की layout settings अलग हो सकती हैं।" },
    pa: { stem: "ਇੱਕ document ਦੇ ਵੱਖਰੇ parts ਵਿੱਚ ਵੱਖਰੀਆਂ page settings ਦੇਣ ਵਾਲਾ Layout-tab feature ਕਿਹੜਾ ਹੈ?", options: ["Section Breaks", "Themes", "Word Count", "Styles"], canonicalAnswer: "Section Breaks", explanation: "Section Breaks document ਨੂੰ sections ਵਿੱਚ ਵੰਡਦੇ ਹਨ ਅਤੇ ਹਰ section ਦੀਆਂ layout settings ਵੱਖਰੀਆਂ ਹੋ ਸਕਦੀਆਂ ਹਨ।" },
  },
  {
    qlId: "COM-003-QL-024", targetFactId: "com003-word-layout-line-numbers", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which Layout-tab command displays numbers beside lines of text?", options: ["Columns", "Line Numbers", "Breaks", "Size"], canonicalAnswer: "Line Numbers", explanation: "Line Numbers displays numbering beside lines of document text." },
    hi: { stem: "Text की lines के पास numbers दिखाने वाला Layout-tab command कौन-सा है?", options: ["Columns", "Line Numbers", "Breaks", "Size"], canonicalAnswer: "Line Numbers", explanation: "Line Numbers document text की lines के पास numbering दिखाता है।" },
    pa: { stem: "Text ਦੀਆਂ lines ਦੇ ਕੋਲ numbers ਦਿਖਾਉਣ ਵਾਲਾ Layout-tab command ਕਿਹੜਾ ਹੈ?", options: ["Columns", "Line Numbers", "Breaks", "Size"], canonicalAnswer: "Line Numbers", explanation: "Line Numbers document text ਦੀਆਂ lines ਦੇ ਕੋਲ numbering ਦਿਖਾਉਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-024", targetFactId: "com003-word-layout-paragraph-indent", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "MEDIUM", correctIndex: 2,
    en: { stem: "Which Layout-tab paragraph setting moves the paragraph inward from the margin?", options: ["Orientation", "Size", "Indent", "Watermark"], canonicalAnswer: "Indent", explanation: "Indent moves paragraph text inward from the left or right margin." },
    hi: { stem: "Paragraph को margin से अंदर ले जाने वाली Layout-tab paragraph setting कौन-सी है?", options: ["Orientation", "Size", "Indent", "Watermark"], canonicalAnswer: "Indent", explanation: "Indent paragraph text को left या right margin से अंदर ले जाता है।" },
    pa: { stem: "Paragraph ਨੂੰ margin ਤੋਂ ਅੰਦਰ ਲੈ ਜਾਣ ਵਾਲੀ Layout-tab paragraph setting ਕਿਹੜੀ ਹੈ?", options: ["Orientation", "Size", "Indent", "Watermark"], canonicalAnswer: "Indent", explanation: "Indent paragraph text ਨੂੰ left ਜਾਂ right margin ਤੋਂ ਅੰਦਰ ਲੈ ਜਾਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-024", targetFactId: "com003-word-layout-paragraph-spacing", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "MEDIUM", correctIndex: 3,
    en: { stem: "Which Layout-tab paragraph setting changes space before or after a paragraph?", options: ["Columns", "Size", "Orientation", "Spacing"], canonicalAnswer: "Spacing", explanation: "Paragraph Spacing changes the space before or after a paragraph." },
    hi: { stem: "Paragraph से पहले या बाद का space बदलने वाली Layout-tab paragraph setting कौन-सी है?", options: ["Columns", "Size", "Orientation", "Spacing"], canonicalAnswer: "Spacing", explanation: "Paragraph Spacing paragraph से पहले या बाद का space बदलता है।" },
    pa: { stem: "Paragraph ਤੋਂ ਪਹਿਲਾਂ ਜਾਂ ਬਾਅਦ ਦਾ space ਬਦਲਣ ਵਾਲੀ Layout-tab paragraph setting ਕਿਹੜੀ ਹੈ?", options: ["Columns", "Size", "Orientation", "Spacing"], canonicalAnswer: "Spacing", explanation: "Paragraph Spacing paragraph ਤੋਂ ਪਹਿਲਾਂ ਜਾਂ ਬਾਅਦ ਦਾ space ਬਦਲਦਾ ਹੈ।" },
  },

  {
    qlId: "COM-003-QL-025", targetFactId: "com003-word-references-table-of-contents", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Which References-tab feature creates a list of headings and their page numbers?", options: ["Table of Contents", "Mail Merge", "Page Color", "WordArt"], canonicalAnswer: "Table of Contents", explanation: "A Table of Contents lists document headings and their page numbers." },
    hi: { stem: "Headings और उनके page numbers की list बनाने वाला References-tab feature कौन-सा है?", options: ["Table of Contents", "Mail Merge", "Page Color", "WordArt"], canonicalAnswer: "Table of Contents", explanation: "Table of Contents document headings और उनके page numbers की list बनाता है।" },
    pa: { stem: "Headings ਅਤੇ ਉਹਨਾਂ ਦੇ page numbers ਦੀ list ਬਣਾਉਣ ਵਾਲਾ References-tab feature ਕਿਹੜਾ ਹੈ?", options: ["Table of Contents", "Mail Merge", "Page Color", "WordArt"], canonicalAnswer: "Table of Contents", explanation: "Table of Contents document headings ਅਤੇ ਉਹਨਾਂ ਦੇ page numbers ਦੀ list ਬਣਾਉਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-025", targetFactId: "com003-word-references-footnote", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Where does a footnote normally appear?", options: ["At the start of the next document", "At the bottom of the current page", "Only in the title bar", "Inside the Ribbon"], canonicalAnswer: "At the bottom of the current page", explanation: "A footnote is placed at the bottom of the page containing its reference mark." },
    hi: { stem: "Footnote सामान्यतः कहाँ दिखाई देती है?", options: ["अगले document के शुरू में", "Current page के bottom पर", "केवल title bar में", "Ribbon के अंदर"], canonicalAnswer: "Current page के bottom पर", explanation: "Footnote उस page के bottom पर रखी जाती है जिसमें उसका reference mark होता है।" },
    pa: { stem: "Footnote ਆਮ ਤੌਰ ਉੱਤੇ ਕਿੱਥੇ ਦਿਖਾਈ ਦਿੰਦੀ ਹੈ?", options: ["ਅਗਲੇ document ਦੇ ਸ਼ੁਰੂ ਵਿੱਚ", "ਮੌਜੂਦਾ page ਦੇ bottom ਉੱਤੇ", "ਸਿਰਫ਼ title bar ਵਿੱਚ", "Ribbon ਦੇ ਅੰਦਰ"], canonicalAnswer: "ਮੌਜੂਦਾ page ਦੇ bottom ਉੱਤੇ", explanation: "Footnote ਉਸ page ਦੇ bottom ਉੱਤੇ ਰੱਖੀ ਜਾਂਦੀ ਹੈ ਜਿਸ ਵਿੱਚ ਉਸਦਾ reference mark ਹੁੰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-025", targetFactId: "com003-word-references-endnote", surfaceMode: "CONCEPT_FROM_LOCATION", examSurfaceFamily: "CONTRAST_DISCRIMINATION", difficulty: "MEDIUM", correctIndex: 2,
    en: { stem: "Where is an endnote normally placed?", options: ["At the left margin", "Inside a table", "At the end of the document or section", "In the Quick Access Toolbar"], canonicalAnswer: "At the end of the document or section", explanation: "An endnote is placed at the end of the document or section rather than at the bottom of the current page." },
    hi: { stem: "Endnote सामान्यतः कहाँ रखी जाती है?", options: ["Left margin पर", "Table के अंदर", "Document या section के अंत में", "Quick Access Toolbar में"], canonicalAnswer: "Document या section के अंत में", explanation: "Endnote current page के bottom के बजाय document या section के अंत में रखी जाती है।" },
    pa: { stem: "Endnote ਆਮ ਤੌਰ ਉੱਤੇ ਕਿੱਥੇ ਰੱਖੀ ਜਾਂਦੀ ਹੈ?", options: ["Left margin ਉੱਤੇ", "Table ਦੇ ਅੰਦਰ", "Document ਜਾਂ section ਦੇ ਅੰਤ ਵਿੱਚ", "Quick Access Toolbar ਵਿੱਚ"], canonicalAnswer: "Document ਜਾਂ section ਦੇ ਅੰਤ ਵਿੱਚ", explanation: "Endnote ਮੌਜੂਦਾ page ਦੇ bottom ਦੀ ਬਜਾਏ document ਜਾਂ section ਦੇ ਅੰਤ ਵਿੱਚ ਰੱਖੀ ਜਾਂਦੀ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-025", targetFactId: "com003-word-references-citations", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 3,
    en: { stem: "Which References-tab command adds a source citation to document text?", options: ["Insert Caption", "Insert Table", "Insert Index", "Insert Citation"], canonicalAnswer: "Insert Citation", explanation: "Insert Citation adds a citation linked to a source in the document." },
    hi: { stem: "Document text में source citation जोड़ने वाला References-tab command कौन-सा है?", options: ["Insert Caption", "Insert Table", "Insert Index", "Insert Citation"], canonicalAnswer: "Insert Citation", explanation: "Insert Citation document में source से जुड़ी citation जोड़ता है।" },
    pa: { stem: "Document text ਵਿੱਚ source citation ਜੋੜਨ ਵਾਲਾ References-tab command ਕਿਹੜਾ ਹੈ?", options: ["Insert Caption", "Insert Table", "Insert Index", "Insert Citation"], canonicalAnswer: "Insert Citation", explanation: "Insert Citation document ਵਿੱਚ source ਨਾਲ ਜੁੜੀ citation ਜੋੜਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-025", targetFactId: "com003-word-references-bibliography", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Which References-tab feature creates a list of sources used in a document?", options: ["Bibliography", "Watermark", "Header", "Replace"], canonicalAnswer: "Bibliography", explanation: "Bibliography creates a formatted list of sources used in the document." },
    hi: { stem: "Document में उपयोग किए गए sources की list बनाने वाला References-tab feature कौन-सा है?", options: ["Bibliography", "Watermark", "Header", "Replace"], canonicalAnswer: "Bibliography", explanation: "Bibliography document में उपयोग किए गए sources की formatted list बनाती है।" },
    pa: { stem: "Document ਵਿੱਚ ਵਰਤੇ sources ਦੀ list ਬਣਾਉਣ ਵਾਲਾ References-tab feature ਕਿਹੜਾ ਹੈ?", options: ["Bibliography", "Watermark", "Header", "Replace"], canonicalAnswer: "Bibliography", explanation: "Bibliography document ਵਿੱਚ ਵਰਤੇ sources ਦੀ formatted list ਬਣਾਉਂਦੀ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-025", targetFactId: "com003-word-references-caption", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which References-tab feature adds a label such as Figure 1 to an object?", options: ["Citation", "Caption", "Endnote", "Index"], canonicalAnswer: "Caption", explanation: "A caption adds a label or short description to a figure, table or other object." },
    hi: { stem: "Object पर Figure 1 जैसा label जोड़ने वाला References-tab feature कौन-सा है?", options: ["Citation", "Caption", "Endnote", "Index"], canonicalAnswer: "Caption", explanation: "Caption figure, table या अन्य object पर label या short description जोड़ता है।" },
    pa: { stem: "Object ਉੱਤੇ Figure 1 ਵਰਗਾ label ਜੋੜਨ ਵਾਲਾ References-tab feature ਕਿਹੜਾ ਹੈ?", options: ["Citation", "Caption", "Endnote", "Index"], canonicalAnswer: "Caption", explanation: "Caption figure, table ਜਾਂ ਹੋਰ object ਉੱਤੇ label ਜਾਂ short description ਜੋੜਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-025", targetFactId: "com003-word-references-cross-reference", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "MEDIUM", correctIndex: 2,
    en: { stem: "Which References-tab feature links text to another heading, figure or table in the same document?", options: ["Watermark", "Mail Merge", "Cross-reference", "Page Color"], canonicalAnswer: "Cross-reference", explanation: "A cross-reference links text to another item in the same document, such as a heading or figure." },
    hi: { stem: "Same document के दूसरे heading, figure या table से text को link करने वाला References-tab feature कौन-सा है?", options: ["Watermark", "Mail Merge", "Cross-reference", "Page Color"], canonicalAnswer: "Cross-reference", explanation: "Cross-reference text को उसी document के दूसरे item, जैसे heading या figure, से जोड़ता है।" },
    pa: { stem: "ਉਸੇ document ਦੇ ਹੋਰ heading, figure ਜਾਂ table ਨਾਲ text ਨੂੰ link ਕਰਨ ਵਾਲਾ References-tab feature ਕਿਹੜਾ ਹੈ?", options: ["Watermark", "Mail Merge", "Cross-reference", "Page Color"], canonicalAnswer: "Cross-reference", explanation: "Cross-reference text ਨੂੰ ਉਸੇ document ਦੇ ਹੋਰ item, ਜਿਵੇਂ heading ਜਾਂ figure, ਨਾਲ ਜੋੜਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-025", targetFactId: "com003-word-references-toc-headings", surfaceMode: "REQUIREMENT_TO_FEATURE", examSurfaceFamily: "CONTRAST_DISCRIMINATION", difficulty: "MEDIUM", correctIndex: 3,
    en: { stem: "Which document structure is most useful for building an automatic Table of Contents?", options: ["Random font colors", "Page background images", "Unformatted spaces", "Heading styles"], canonicalAnswer: "Heading styles", explanation: "Heading styles give Word the structure it needs to build and update a Table of Contents." },
    hi: { stem: "Automatic Table of Contents बनाने के लिए कौन-सी document structure सबसे उपयोगी है?", options: ["Random font colors", "Page background images", "Unformatted spaces", "Heading styles"], canonicalAnswer: "Heading styles", explanation: "Heading styles Word को Table of Contents बनाने और update करने के लिए document structure देते हैं।" },
    pa: { stem: "Automatic Table of Contents ਬਣਾਉਣ ਲਈ ਕਿਹੜੀ document structure ਸਭ ਤੋਂ ਲਾਭਦਾਇਕ ਹੈ?", options: ["Random font colors", "Page background images", "Unformatted spaces", "Heading styles"], canonicalAnswer: "Heading styles", explanation: "Heading styles Word ਨੂੰ Table of Contents ਬਣਾਉਣ ਅਤੇ update ਕਰਨ ਲਈ document structure ਦਿੰਦੇ ਹਨ।" },
  },
  {
    qlId: "COM-003-QL-026", targetFactId: "com003-word-mailings-start-mail-merge", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Which Mailings-tab command starts the process of creating personalized copies of a document?", options: ["Start Mail Merge", "Track Changes", "Insert Caption", "Page Color"], canonicalAnswer: "Start Mail Merge", explanation: "Start Mail Merge begins the workflow for creating personalized letters, labels, envelopes or messages." },
    hi: { stem: "Personalized document copies बनाने की process शुरू करने वाला Mailings-tab command कौन-सा है?", options: ["Start Mail Merge", "Track Changes", "Insert Caption", "Page Color"], canonicalAnswer: "Start Mail Merge", explanation: "Start Mail Merge personalized letters, labels, envelopes या messages बनाने का workflow शुरू करता है।" },
    pa: { stem: "Personalized document copies ਬਣਾਉਣ ਦੀ process ਸ਼ੁਰੂ ਕਰਨ ਵਾਲਾ Mailings-tab command ਕਿਹੜਾ ਹੈ?", options: ["Start Mail Merge", "Track Changes", "Insert Caption", "Page Color"], canonicalAnswer: "Start Mail Merge", explanation: "Start Mail Merge personalized letters, labels, envelopes ਜਾਂ messages ਬਣਾਉਣ ਦਾ workflow ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-026", targetFactId: "com003-word-mailings-select-recipients", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which Mailings-tab command connects a mail merge to a recipient list?", options: ["Finish & Merge", "Select Recipients", "Preview Results", "Match Fields"], canonicalAnswer: "Select Recipients", explanation: "Select Recipients connects the merge to its data source or recipient list." },
    hi: { stem: "Mail merge को recipient list से connect करने वाला Mailings-tab command कौन-सा है?", options: ["Finish & Merge", "Select Recipients", "Preview Results", "Match Fields"], canonicalAnswer: "Select Recipients", explanation: "Select Recipients merge को उसके data source या recipient list से connect करता है।" },
    pa: { stem: "Mail merge ਨੂੰ recipient list ਨਾਲ connect ਕਰਨ ਵਾਲਾ Mailings-tab command ਕਿਹੜਾ ਹੈ?", options: ["Finish & Merge", "Select Recipients", "Preview Results", "Match Fields"], canonicalAnswer: "Select Recipients", explanation: "Select Recipients merge ਨੂੰ ਉਸਦੇ data source ਜਾਂ recipient list ਨਾਲ connect ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-026", targetFactId: "com003-word-mailings-edit-recipients", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "MEDIUM", correctIndex: 2,
    en: { stem: "Which Mailings-tab command lets a user filter or remove records from the merge list?", options: ["Insert Merge Field", "Greeting Line", "Edit Recipient List", "Start Mail Merge"], canonicalAnswer: "Edit Recipient List", explanation: "Edit Recipient List lets the user select, filter or modify records used by the merge." },
    hi: { stem: "Merge list से records filter या remove करने वाला Mailings-tab command कौन-सा है?", options: ["Insert Merge Field", "Greeting Line", "Edit Recipient List", "Start Mail Merge"], canonicalAnswer: "Edit Recipient List", explanation: "Edit Recipient List merge में उपयोग होने वाले records को select, filter या modify करने देता है।" },
    pa: { stem: "Merge list ਵਿੱਚੋਂ records filter ਜਾਂ remove ਕਰਨ ਵਾਲਾ Mailings-tab command ਕਿਹੜਾ ਹੈ?", options: ["Insert Merge Field", "Greeting Line", "Edit Recipient List", "Start Mail Merge"], canonicalAnswer: "Edit Recipient List", explanation: "Edit Recipient List merge ਵਿੱਚ ਵਰਤੇ records ਨੂੰ select, filter ਜਾਂ modify ਕਰਨ ਦਿੰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-026", targetFactId: "com003-word-mailings-merge-field", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 3,
    en: { stem: "Which Mailings-tab command inserts a variable value such as a recipient's name?", options: ["Address Block", "Preview Results", "Finish & Merge", "Insert Merge Field"], canonicalAnswer: "Insert Merge Field", explanation: "Insert Merge Field places a field that receives a value from the data source." },
    hi: { stem: "Recipient के name जैसी variable value insert करने वाला Mailings-tab command कौन-सा है?", options: ["Address Block", "Preview Results", "Finish & Merge", "Insert Merge Field"], canonicalAnswer: "Insert Merge Field", explanation: "Insert Merge Field ऐसा field रखता है जिसमें data source से value आती है।" },
    pa: { stem: "Recipient ਦੇ name ਵਰਗੀ variable value insert ਕਰਨ ਵਾਲਾ Mailings-tab command ਕਿਹੜਾ ਹੈ?", options: ["Address Block", "Preview Results", "Finish & Merge", "Insert Merge Field"], canonicalAnswer: "Insert Merge Field", explanation: "Insert Merge Field ਅਜਿਹਾ field ਰੱਖਦਾ ਹੈ ਜਿਸ ਵਿੱਚ data source ਤੋਂ value ਆਉਂਦੀ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-026", targetFactId: "com003-word-mailings-address-block", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Which Mailings-tab feature inserts a formatted recipient address?", options: ["Address Block", "Page Number", "Caption", "Citation"], canonicalAnswer: "Address Block", explanation: "Address Block inserts a formatted group of address fields for a recipient." },
    hi: { stem: "Formatted recipient address insert करने वाला Mailings-tab feature कौन-सा है?", options: ["Address Block", "Page Number", "Caption", "Citation"], canonicalAnswer: "Address Block", explanation: "Address Block recipient के address fields का formatted group insert करता है।" },
    pa: { stem: "Formatted recipient address insert ਕਰਨ ਵਾਲਾ Mailings-tab feature ਕਿਹੜਾ ਹੈ?", options: ["Address Block", "Page Number", "Caption", "Citation"], canonicalAnswer: "Address Block", explanation: "Address Block recipient ਦੇ address fields ਦਾ formatted group insert ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-026", targetFactId: "com003-word-mailings-greeting-line", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which Mailings-tab feature adds a personalized salutation such as Dear Anil?", options: ["Address Block", "Greeting Line", "Edit Recipient List", "Labels"], canonicalAnswer: "Greeting Line", explanation: "Greeting Line inserts a personalized salutation using recipient data." },
    hi: { stem: "Dear Anil जैसा personalized salutation जोड़ने वाला Mailings-tab feature कौन-सा है?", options: ["Address Block", "Greeting Line", "Edit Recipient List", "Labels"], canonicalAnswer: "Greeting Line", explanation: "Greeting Line recipient data का उपयोग करके personalized salutation insert करता है।" },
    pa: { stem: "Dear Anil ਵਰਗਾ personalized salutation ਜੋੜਨ ਵਾਲਾ Mailings-tab feature ਕਿਹੜਾ ਹੈ?", options: ["Address Block", "Greeting Line", "Edit Recipient List", "Labels"], canonicalAnswer: "Greeting Line", explanation: "Greeting Line recipient data ਦੀ ਵਰਤੋਂ ਕਰਕੇ personalized salutation insert ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-026", targetFactId: "com003-word-mailings-preview-results", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 2,
    en: { stem: "Which Mailings-tab command shows how merged records will appear before completion?", options: ["Select Recipients", "Insert Merge Field", "Preview Results", "Start Mail Merge"], canonicalAnswer: "Preview Results", explanation: "Preview Results displays the merged document with recipient values before the merge is completed." },
    hi: { stem: "Completion से पहले merged records कैसे दिखेंगे, यह दिखाने वाला Mailings-tab command कौन-सा है?", options: ["Select Recipients", "Insert Merge Field", "Preview Results", "Start Mail Merge"], canonicalAnswer: "Preview Results", explanation: "Preview Results merge complete होने से पहले recipient values वाला document दिखाता है।" },
    pa: { stem: "Completion ਤੋਂ ਪਹਿਲਾਂ merged records ਕਿਵੇਂ ਦਿਖਣਗੇ, ਇਹ ਦਿਖਾਉਣ ਵਾਲਾ Mailings-tab command ਕਿਹੜਾ ਹੈ?", options: ["Select Recipients", "Insert Merge Field", "Preview Results", "Start Mail Merge"], canonicalAnswer: "Preview Results", explanation: "Preview Results merge complete ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ recipient values ਵਾਲਾ document ਦਿਖਾਉਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-026", targetFactId: "com003-word-mailings-finish-merge", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 3,
    en: { stem: "Which Mailings-tab command produces the final merged documents or messages?", options: ["Preview Results", "Select Recipients", "Edit Recipient List", "Finish & Merge"], canonicalAnswer: "Finish & Merge", explanation: "Finish & Merge completes the merge and creates the final output." },
    hi: { stem: "Final merged documents या messages बनाने वाला Mailings-tab command कौन-सा है?", options: ["Preview Results", "Select Recipients", "Edit Recipient List", "Finish & Merge"], canonicalAnswer: "Finish & Merge", explanation: "Finish & Merge merge को पूरा करके final output बनाता है।" },
    pa: { stem: "Final merged documents ਜਾਂ messages ਬਣਾਉਣ ਵਾਲਾ Mailings-tab command ਕਿਹੜਾ ਹੈ?", options: ["Preview Results", "Select Recipients", "Edit Recipient List", "Finish & Merge"], canonicalAnswer: "Finish & Merge", explanation: "Finish & Merge merge ਨੂੰ ਪੂਰਾ ਕਰਕੇ final output ਬਣਾਉਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-027", targetFactId: "com003-word-review-editor", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Which Review-tab feature checks spelling, grammar and writing suggestions?", options: ["Editor", "Mail Merge", "Themes", "Columns"], canonicalAnswer: "Editor", explanation: "Editor checks spelling, grammar and other writing issues for review." },
    hi: { stem: "Spelling, grammar और writing suggestions check करने वाला Review-tab feature कौन-सा है?", options: ["Editor", "Mail Merge", "Themes", "Columns"], canonicalAnswer: "Editor", explanation: "Editor spelling, grammar और अन्य writing issues को review के लिए check करता है।" },
    pa: { stem: "Spelling, grammar ਅਤੇ writing suggestions check ਕਰਨ ਵਾਲਾ Review-tab feature ਕਿਹੜਾ ਹੈ?", options: ["Editor", "Mail Merge", "Themes", "Columns"], canonicalAnswer: "Editor", explanation: "Editor spelling, grammar ਅਤੇ ਹੋਰ writing issues ਨੂੰ review ਲਈ check ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-027", targetFactId: "com003-word-review-proofing-language", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "MEDIUM", correctIndex: 1,
    en: { stem: "Which Review-tab setting tells Word which language to use for proofing?", options: ["Translate Document", "Set Proofing Language", "New Comment", "Compare"], canonicalAnswer: "Set Proofing Language", explanation: "Set Proofing Language selects the language used for spelling and grammar checking." },
    hi: { stem: "Word को proofing के लिए कौन-सी language उपयोग करनी है, यह बताने वाली Review-tab setting कौन-सी है?", options: ["Translate Document", "Set Proofing Language", "New Comment", "Compare"], canonicalAnswer: "Set Proofing Language", explanation: "Set Proofing Language spelling और grammar checking के लिए language चुनती है।" },
    pa: { stem: "Word ਨੂੰ proofing ਲਈ ਕਿਹੜੀ language ਵਰਤਣੀ ਹੈ, ਇਹ ਦੱਸਣ ਵਾਲੀ Review-tab setting ਕਿਹੜੀ ਹੈ?", options: ["Translate Document", "Set Proofing Language", "New Comment", "Compare"], canonicalAnswer: "Set Proofing Language", explanation: "Set Proofing Language spelling ਅਤੇ grammar checking ਲਈ language ਚੁਣਦੀ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-027", targetFactId: "com003-word-review-comments", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 2,
    en: { stem: "Which Review-tab feature adds a note without changing the main document text?", options: ["Accept", "Reject", "New Comment", "Track Changes"], canonicalAnswer: "New Comment", explanation: "New Comment adds an annotation for discussion while leaving the main text unchanged." },
    hi: { stem: "Main document text बदले बिना note जोड़ने वाला Review-tab feature कौन-सा है?", options: ["Accept", "Reject", "New Comment", "Track Changes"], canonicalAnswer: "New Comment", explanation: "New Comment main text बदले बिना discussion के लिए annotation जोड़ता है।" },
    pa: { stem: "Main document text ਬਦਲੇ ਬਿਨਾਂ note ਜੋੜਨ ਵਾਲਾ Review-tab feature ਕਿਹੜਾ ਹੈ?", options: ["Accept", "Reject", "New Comment", "Track Changes"], canonicalAnswer: "New Comment", explanation: "New Comment main text ਬਦਲੇ ਬਿਨਾਂ discussion ਲਈ annotation ਜੋੜਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-027", targetFactId: "com003-word-review-track-changes", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 3,
    en: { stem: "Which Review-tab feature records edits made to a document?", options: ["Editor", "Compare", "Restrict Editing", "Track Changes"], canonicalAnswer: "Track Changes", explanation: "Track Changes records insertions, deletions and other edits for later review." },
    hi: { stem: "Document में किए गए edits को record करने वाला Review-tab feature कौन-सा है?", options: ["Editor", "Compare", "Restrict Editing", "Track Changes"], canonicalAnswer: "Track Changes", explanation: "Track Changes insertions, deletions और अन्य edits को बाद की review के लिए record करता है।" },
    pa: { stem: "Document ਵਿੱਚ ਕੀਤੇ edits ਨੂੰ record ਕਰਨ ਵਾਲਾ Review-tab feature ਕਿਹੜਾ ਹੈ?", options: ["Editor", "Compare", "Restrict Editing", "Track Changes"], canonicalAnswer: "Track Changes", explanation: "Track Changes insertions, deletions ਅਤੇ ਹੋਰ edits ਨੂੰ ਬਾਅਦ ਦੀ review ਲਈ record ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-027", targetFactId: "com003-word-review-accept-reject", surfaceMode: "FEATURE_FROM_EFFECT", examSurfaceFamily: "CONTRAST_DISCRIMINATION", difficulty: "MEDIUM", correctIndex: 0,
    en: { stem: "What is the effect of choosing Accept for a tracked change?", options: ["The change becomes part of the document", "The document is printed", "A new source is added", "The change is hidden only"], canonicalAnswer: "The change becomes part of the document", explanation: "Accept keeps the tracked edit as a normal part of the document." },
    hi: { stem: "Tracked change के लिए Accept चुनने का effect क्या है?", options: ["Change document का part बन जाता है", "Document print हो जाता है", "New source जुड़ता है", "Change केवल hide होता है"], canonicalAnswer: "Change document का part बन जाता है", explanation: "Accept tracked edit को document के normal content का part बना देता है।" },
    pa: { stem: "Tracked change ਲਈ Accept ਚੁਣਨ ਦਾ effect ਕੀ ਹੁੰਦਾ ਹੈ?", options: ["Change document ਦਾ part ਬਣ ਜਾਂਦਾ ਹੈ", "Document print ਹੋ ਜਾਂਦਾ ਹੈ", "New source ਜੁੜਦਾ ਹੈ", "Change ਸਿਰਫ਼ hide ਹੁੰਦਾ ਹੈ"], canonicalAnswer: "Change document ਦਾ part ਬਣ ਜਾਂਦਾ ਹੈ", explanation: "Accept tracked edit ਨੂੰ document ਦੇ normal content ਦਾ part ਬਣਾ ਦਿੰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-027", targetFactId: "com003-word-review-reject", surfaceMode: "FEATURE_FROM_EFFECT", examSurfaceFamily: "CONTRAST_DISCRIMINATION", difficulty: "MEDIUM", correctIndex: 1,
    en: { stem: "What is the effect of choosing Reject for a tracked change?", options: ["The change is permanently accepted", "The tracked edit is discarded", "The page is rotated", "A citation is inserted"], canonicalAnswer: "The tracked edit is discarded", explanation: "Reject removes the proposed tracked change from the accepted document content." },
    hi: { stem: "Tracked change के लिए Reject चुनने का effect क्या है?", options: ["Change permanently accept हो जाता है", "Tracked edit discard हो जाता है", "Page rotate हो जाता है", "Citation insert होती है"], canonicalAnswer: "Tracked edit discard हो जाता है", explanation: "Reject proposed tracked change को accepted document content से हटा देता है।" },
    pa: { stem: "Tracked change ਲਈ Reject ਚੁਣਨ ਦਾ effect ਕੀ ਹੁੰਦਾ ਹੈ?", options: ["Change permanently accept ਹੋ ਜਾਂਦਾ ਹੈ", "Tracked edit discard ਹੋ ਜਾਂਦਾ ਹੈ", "Page rotate ਹੋ ਜਾਂਦਾ ਹੈ", "Citation insert ਹੁੰਦੀ ਹੈ"], canonicalAnswer: "Tracked edit discard ਹੋ ਜਾਂਦਾ ਹੈ", explanation: "Reject proposed tracked change ਨੂੰ accepted document content ਤੋਂ ਹਟਾ ਦਿੰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-027", targetFactId: "com003-word-review-compare", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "MEDIUM", correctIndex: 2,
    en: { stem: "Which Review-tab command compares two versions of a document?", options: ["Editor", "New Comment", "Compare", "Language"], canonicalAnswer: "Compare", explanation: "Compare examines two document versions and shows their differences." },
    hi: { stem: "Document के दो versions की तुलना करने वाला Review-tab command कौन-सा है?", options: ["Editor", "New Comment", "Compare", "Language"], canonicalAnswer: "Compare", explanation: "Compare दो document versions की जाँच करके उनके differences दिखाता है।" },
    pa: { stem: "Document ਦੇ ਦੋ versions ਦੀ ਤੁਲਨਾ ਕਰਨ ਵਾਲਾ Review-tab command ਕਿਹੜਾ ਹੈ?", options: ["Editor", "New Comment", "Compare", "Language"], canonicalAnswer: "Compare", explanation: "Compare ਦੋ document versions ਦੀ ਜਾਂਚ ਕਰਕੇ ਉਹਨਾਂ ਦੇ differences ਦਿਖਾਉਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-027", targetFactId: "com003-word-review-restrict-editing", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "MEDIUM", correctIndex: 3,
    en: { stem: "Which Review-tab command limits the types of changes users can make?", options: ["Track Changes", "Editor", "Compare", "Restrict Editing"], canonicalAnswer: "Restrict Editing", explanation: "Restrict Editing limits permitted editing actions in a document." },
    hi: { stem: "Users किस प्रकार के changes कर सकते हैं, इसे सीमित करने वाला Review-tab command कौन-सा है?", options: ["Track Changes", "Editor", "Compare", "Restrict Editing"], canonicalAnswer: "Restrict Editing", explanation: "Restrict Editing document में allowed editing actions को सीमित करता है।" },
    pa: { stem: "Users ਕਿਹੜੇ ਕਿਸਮ ਦੇ changes ਕਰ ਸਕਦੇ ਹਨ, ਇਸ ਨੂੰ ਸੀਮਿਤ ਕਰਨ ਵਾਲਾ Review-tab command ਕਿਹੜਾ ਹੈ?", options: ["Track Changes", "Editor", "Compare", "Restrict Editing"], canonicalAnswer: "Restrict Editing", explanation: "Restrict Editing document ਵਿੱਚ allowed editing actions ਨੂੰ ਸੀਮਿਤ ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-028", targetFactId: "com003-word-view-print-layout", surfaceMode: "VIEW_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Which Word view shows pages close to how they will appear when printed?", options: ["Print Layout", "Draft", "Outline", "Web Layout"], canonicalAnswer: "Print Layout", explanation: "Print Layout displays page boundaries and a view close to the printed document." },
    hi: { stem: "कौन-सा Word view pages को printed document जैसा दिखाता है?", options: ["Print Layout", "Draft", "Outline", "Web Layout"], canonicalAnswer: "Print Layout", explanation: "Print Layout page boundaries और printed document के करीब view दिखाता है।" },
    pa: { stem: "ਕਿਹੜਾ Word view pages ਨੂੰ printed document ਵਰਗਾ ਦਿਖਾਉਂਦਾ ਹੈ?", options: ["Print Layout", "Draft", "Outline", "Web Layout"], canonicalAnswer: "Print Layout", explanation: "Print Layout page boundaries ਅਤੇ printed document ਦੇ ਨੇੜੇ view ਦਿਖਾਉਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-028", targetFactId: "com003-word-view-read-mode", surfaceMode: "VIEW_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which Word view is intended mainly for reading a document?", options: ["Draft", "Read Mode", "Outline", "Web Layout"], canonicalAnswer: "Read Mode", explanation: "Read Mode is designed to make reading a document easier." },
    hi: { stem: "Document पढ़ने के लिए मुख्य रूप से बनाया गया Word view कौन-सा है?", options: ["Draft", "Read Mode", "Outline", "Web Layout"], canonicalAnswer: "Read Mode", explanation: "Read Mode document को पढ़ना आसान बनाने के लिए बनाया गया है।" },
    pa: { stem: "Document ਪੜ੍ਹਨ ਲਈ ਮੁੱਖ ਤੌਰ ਉੱਤੇ ਬਣਾਇਆ Word view ਕਿਹੜਾ ਹੈ?", options: ["Draft", "Read Mode", "Outline", "Web Layout"], canonicalAnswer: "Read Mode", explanation: "Read Mode document ਨੂੰ ਪੜ੍ਹਨਾ ਆਸਾਨ ਬਣਾਉਣ ਲਈ ਬਣਾਇਆ ਗਿਆ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-028", targetFactId: "com003-word-view-outline", surfaceMode: "VIEW_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 2,
    en: { stem: "Which Word view displays the document structure through heading levels?", options: ["Print Layout", "Draft", "Outline", "Read Mode"], canonicalAnswer: "Outline", explanation: "Outline view displays and manages the document structure through heading levels." },
    hi: { stem: "Heading levels के माध्यम से document structure दिखाने वाला Word view कौन-सा है?", options: ["Print Layout", "Draft", "Outline", "Read Mode"], canonicalAnswer: "Outline", explanation: "Outline view heading levels के माध्यम से document structure दिखाता और manage करता है।" },
    pa: { stem: "Heading levels ਰਾਹੀਂ document structure ਦਿਖਾਉਣ ਵਾਲਾ Word view ਕਿਹੜਾ ਹੈ?", options: ["Print Layout", "Draft", "Outline", "Read Mode"], canonicalAnswer: "Outline", explanation: "Outline view heading levels ਰਾਹੀਂ document structure ਦਿਖਾਉਂਦਾ ਅਤੇ manage ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-028", targetFactId: "com003-word-view-web-layout", surfaceMode: "VIEW_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 3,
    en: { stem: "Which Word view displays a document in a form suited to reading on a screen like a webpage?", options: ["Print Layout", "Draft", "Outline", "Web Layout"], canonicalAnswer: "Web Layout", explanation: "Web Layout displays the document in a webpage-like screen view." },
    hi: { stem: "Document को webpage जैसी screen view में दिखाने वाला Word view कौन-सा है?", options: ["Print Layout", "Draft", "Outline", "Web Layout"], canonicalAnswer: "Web Layout", explanation: "Web Layout document को webpage जैसी screen view में दिखाता है।" },
    pa: { stem: "Document ਨੂੰ webpage ਵਰਗੀ screen view ਵਿੱਚ ਦਿਖਾਉਣ ਵਾਲਾ Word view ਕਿਹੜਾ ਹੈ?", options: ["Print Layout", "Draft", "Outline", "Web Layout"], canonicalAnswer: "Web Layout", explanation: "Web Layout document ਨੂੰ webpage ਵਰਗੀ screen view ਵਿੱਚ ਦਿਖਾਉਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-028", targetFactId: "com003-word-view-navigation-pane", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Which View-tab feature helps jump between headings in a long document?", options: ["Navigation Pane", "Page Color", "Address Block", "Watermark"], canonicalAnswer: "Navigation Pane", explanation: "Navigation Pane helps search the document and move between headings or pages." },
    hi: { stem: "Long document में headings के बीच जल्दी जाने में मदद करने वाला View-tab feature कौन-सा है?", options: ["Navigation Pane", "Page Color", "Address Block", "Watermark"], canonicalAnswer: "Navigation Pane", explanation: "Navigation Pane document search करने और headings या pages के बीच जाने में मदद करता है।" },
    pa: { stem: "Long document ਵਿੱਚ headings ਵਿਚਕਾਰ ਜਲਦੀ ਜਾਣ ਵਿੱਚ ਮਦਦ ਕਰਨ ਵਾਲਾ View-tab feature ਕਿਹੜਾ ਹੈ?", options: ["Navigation Pane", "Page Color", "Address Block", "Watermark"], canonicalAnswer: "Navigation Pane", explanation: "Navigation Pane document search ਕਰਨ ਅਤੇ headings ਜਾਂ pages ਵਿਚਕਾਰ ਜਾਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-028", targetFactId: "com003-word-view-ruler", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which View-tab command displays the ruler used for tabs and indents?", options: ["Gridlines", "Ruler", "Zoom", "Split"], canonicalAnswer: "Ruler", explanation: "Ruler displays the measurement guide used to set tabs and indents." },
    hi: { stem: "Tabs और indents के लिए उपयोग होने वाला ruler दिखाने वाला View-tab command कौन-सा है?", options: ["Gridlines", "Ruler", "Zoom", "Split"], canonicalAnswer: "Ruler", explanation: "Ruler tabs और indents set करने के लिए measurement guide दिखाता है।" },
    pa: { stem: "Tabs ਅਤੇ indents ਲਈ ਵਰਤਿਆ ruler ਦਿਖਾਉਣ ਵਾਲਾ View-tab command ਕਿਹੜਾ ਹੈ?", options: ["Gridlines", "Ruler", "Zoom", "Split"], canonicalAnswer: "Ruler", explanation: "Ruler tabs ਅਤੇ indents set ਕਰਨ ਲਈ measurement guide ਦਿਖਾਉਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-028", targetFactId: "com003-word-view-gridlines", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 2,
    en: { stem: "Which View-tab command displays non-printing gridlines to help align objects?", options: ["Ruler", "Zoom", "Gridlines", "Read Mode"], canonicalAnswer: "Gridlines", explanation: "Gridlines provide visual alignment guides and are not normally printed as document content." },
    hi: { stem: "Objects align करने में मदद करने वाली non-printing gridlines दिखाने वाला View-tab command कौन-सा है?", options: ["Ruler", "Zoom", "Gridlines", "Read Mode"], canonicalAnswer: "Gridlines", explanation: "Gridlines visual alignment guides देती हैं और सामान्यतः document content की तरह print नहीं होतीं।" },
    pa: { stem: "Objects align ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰਨ ਵਾਲੀਆਂ non-printing gridlines ਦਿਖਾਉਣ ਵਾਲਾ View-tab command ਕਿਹੜਾ ਹੈ?", options: ["Ruler", "Zoom", "Gridlines", "Read Mode"], canonicalAnswer: "Gridlines", explanation: "Gridlines visual alignment guides ਦਿੰਦੀਆਂ ਹਨ ਅਤੇ ਆਮ ਤੌਰ ਉੱਤੇ document content ਵਾਂਗ print ਨਹੀਂ ਹੁੰਦੀਆਂ।" },
  },
  {
    qlId: "COM-003-QL-028", targetFactId: "com003-word-view-zoom", surfaceMode: "FEATURE_FROM_PURPOSE", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 3,
    en: { stem: "Which View-tab control changes how large the document appears on screen without changing page content?", options: ["Ruler", "Gridlines", "Navigation Pane", "Zoom"], canonicalAnswer: "Zoom", explanation: "Zoom changes the on-screen magnification; it does not change the document's actual text or page settings." },
    hi: { stem: "Page content बदले बिना screen पर document का size बदलने वाला View-tab control कौन-सा है?", options: ["Ruler", "Gridlines", "Navigation Pane", "Zoom"], canonicalAnswer: "Zoom", explanation: "Zoom on-screen magnification बदलता है; document का actual text या page settings नहीं बदलता।" },
    pa: { stem: "Page content ਬਦਲੇ ਬਿਨਾਂ screen ਉੱਤੇ document ਦਾ size ਬਦਲਣ ਵਾਲਾ View-tab control ਕਿਹੜਾ ਹੈ?", options: ["Ruler", "Gridlines", "Navigation Pane", "Zoom"], canonicalAnswer: "Zoom", explanation: "Zoom on-screen magnification ਬਦਲਦਾ ਹੈ; document ਦਾ actual text ਜਾਂ page settings ਨਹੀਂ ਬਦਲਦਾ।" },
  },

  {
    qlId: "COM-003-QL-029", targetFactId: "com003-word-file-new", surfaceMode: "TAB_TO_COMMAND", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Which File-tab command creates a new Word document?", options: ["New", "Open", "Info", "Export"], canonicalAnswer: "New", explanation: "The New command creates a new document from a blank file or template." },
    hi: { stem: "नया Word document बनाने वाला File-tab command कौन-सा है?", options: ["New", "Open", "Info", "Export"], canonicalAnswer: "New", explanation: "New command blank file या template से नया document बनाता है।" },
    pa: { stem: "ਨਵਾਂ Word document ਬਣਾਉਣ ਵਾਲਾ File-tab command ਕਿਹੜਾ ਹੈ?", options: ["New", "Open", "Info", "Export"], canonicalAnswer: "New", explanation: "New command blank file ਜਾਂ template ਤੋਂ ਨਵਾਂ document ਬਣਾਉਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-029", targetFactId: "com003-word-file-open", surfaceMode: "TAB_TO_COMMAND", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which File-tab command opens an existing Word document?", options: ["New", "Open", "Save As", "Print"], canonicalAnswer: "Open", explanation: "Open loads an existing document from a file location." },
    hi: { stem: "Existing Word document खोलने वाला File-tab command कौन-सा है?", options: ["New", "Open", "Save As", "Print"], canonicalAnswer: "Open", explanation: "Open file location से existing document load करता है।" },
    pa: { stem: "Existing Word document ਖੋਲ੍ਹਣ ਵਾਲਾ File-tab command ਕਿਹੜਾ ਹੈ?", options: ["New", "Open", "Save As", "Print"], canonicalAnswer: "Open", explanation: "Open file location ਤੋਂ existing document load ਕਰਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-029", targetFactId: "com003-word-file-save-as", surfaceMode: "TAB_TO_COMMAND", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 2,
    en: { stem: "Which File-tab command saves a document with a new name or file format?", options: ["New", "Open", "Save As", "Close"], canonicalAnswer: "Save As", explanation: "Save As creates a saved copy with a chosen name, location or format." },
    hi: { stem: "Document को नए name या file format के साथ save करने वाला File-tab command कौन-सा है?", options: ["New", "Open", "Save As", "Close"], canonicalAnswer: "Save As", explanation: "Save As चुने गए name, location या format के साथ saved copy बनाता है।" },
    pa: { stem: "Document ਨੂੰ ਨਵੇਂ name ਜਾਂ file format ਨਾਲ save ਕਰਨ ਵਾਲਾ File-tab command ਕਿਹੜਾ ਹੈ?", options: ["New", "Open", "Save As", "Close"], canonicalAnswer: "Save As", explanation: "Save As ਚੁਣੇ name, location ਜਾਂ format ਨਾਲ saved copy ਬਣਾਉਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-029", targetFactId: "com003-word-file-print", surfaceMode: "TAB_TO_COMMAND", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 3,
    en: { stem: "Which File-tab command opens print settings and print preview?", options: ["Info", "Share", "Export", "Print"], canonicalAnswer: "Print", explanation: "Print opens print settings and a preview of the document output." },
    hi: { stem: "Print settings और print preview खोलने वाला File-tab command कौन-सा है?", options: ["Info", "Share", "Export", "Print"], canonicalAnswer: "Print", explanation: "Print document output की print settings और preview खोलता है।" },
    pa: { stem: "Print settings ਅਤੇ print preview ਖੋਲ੍ਹਣ ਵਾਲਾ File-tab command ਕਿਹੜਾ ਹੈ?", options: ["Info", "Share", "Export", "Print"], canonicalAnswer: "Print", explanation: "Print document output ਦੀਆਂ print settings ਅਤੇ preview ਖੋਲ੍ਹਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-029", targetFactId: "com003-word-file-info", surfaceMode: "TAB_TO_COMMAND", examSurfaceFamily: "DIRECT_RECALL", difficulty: "EASY", correctIndex: 0,
    en: { stem: "Which File-tab area shows document properties and protection options?", options: ["Info", "Open", "New", "Print"], canonicalAnswer: "Info", explanation: "Info shows document properties and options such as protecting the document." },
    hi: { stem: "Document properties और protection options दिखाने वाला File-tab area कौन-सा है?", options: ["Info", "Open", "New", "Print"], canonicalAnswer: "Info", explanation: "Info document properties और document protection जैसे options दिखाता है।" },
    pa: { stem: "Document properties ਅਤੇ protection options ਦਿਖਾਉਣ ਵਾਲਾ File-tab area ਕਿਹੜਾ ਹੈ?", options: ["Info", "Open", "New", "Print"], canonicalAnswer: "Info", explanation: "Info document properties ਅਤੇ document protection ਵਰਗੇ options ਦਿਖਾਉਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-029", targetFactId: "com003-word-file-export", surfaceMode: "TAB_TO_COMMAND", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 1,
    en: { stem: "Which File-tab command is used to create a copy in another supported format?", options: ["Open", "Export", "New", "Close"], canonicalAnswer: "Export", explanation: "Export creates a copy of the document in another supported output format." },
    hi: { stem: "Document की copy को दूसरे supported format में बनाने के लिए कौन-सा File-tab command उपयोग होता है?", options: ["Open", "Export", "New", "Close"], canonicalAnswer: "Export", explanation: "Export document की copy को दूसरे supported output format में बनाता है।" },
    pa: { stem: "Document ਦੀ copy ਨੂੰ ਹੋਰ supported format ਵਿੱਚ ਬਣਾਉਣ ਲਈ ਕਿਹੜਾ File-tab command ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?", options: ["Open", "Export", "New", "Close"], canonicalAnswer: "Export", explanation: "Export document ਦੀ copy ਨੂੰ ਹੋਰ supported output format ਵਿੱਚ ਬਣਾਉਂਦਾ ਹੈ।" },
  },
  {
    qlId: "COM-003-QL-029", targetFactId: "com003-word-file-share", surfaceMode: "TAB_TO_COMMAND", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 2,
    en: { stem: "Which File-tab command is intended for sending or sharing a document with others?", options: ["Print", "Info", "Share", "Page Color"], canonicalAnswer: "Share", explanation: "Share provides document-sharing options, subject to the account and platform in use." },
    hi: { stem: "दूसरों को document भेजने या share करने के लिए कौन-सा File-tab command intended है?", options: ["Print", "Info", "Share", "Page Color"], canonicalAnswer: "Share", explanation: "Share document sharing options देता है; उपलब्ध विकल्प account और platform पर निर्भर हो सकते हैं।" },
    pa: { stem: "ਹੋਰਾਂ ਨੂੰ document ਭੇਜਣ ਜਾਂ share ਕਰਨ ਲਈ ਕਿਹੜਾ File-tab command intended ਹੈ?", options: ["Print", "Info", "Share", "Page Color"], canonicalAnswer: "Share", explanation: "Share document sharing options ਦਿੰਦਾ ਹੈ; ਉਪਲਬਧ options account ਅਤੇ platform ਉੱਤੇ ਨਿਰਭਰ ਕਰ ਸਕਦੇ ਹਨ।" },
  },
  {
    qlId: "COM-003-QL-029", targetFactId: "com003-word-file-close", surfaceMode: "TAB_TO_COMMAND", examSurfaceFamily: "FUNCTIONAL_APPLICATION", difficulty: "EASY", correctIndex: 3,
    en: { stem: "Which File-tab command closes the current document?", options: ["Export", "Save As", "New", "Close"], canonicalAnswer: "Close", explanation: "Close closes the current document while leaving the Word application open." },
    hi: { stem: "Current document बंद करने वाला File-tab command कौन-सा है?", options: ["Export", "Save As", "New", "Close"], canonicalAnswer: "Close", explanation: "Close current document बंद करता है और Word application खुली रह सकती है।" },
    pa: { stem: "Current document ਬੰਦ ਕਰਨ ਵਾਲਾ File-tab command ਕਿਹੜਾ ਹੈ?", options: ["Export", "Save As", "New", "Close"], canonicalAnswer: "Close", explanation: "Close current document ਬੰਦ ਕਰਦਾ ਹੈ ਅਤੇ Word application ਖੁੱਲ੍ਹੀ ਰਹਿ ਸਕਦੀ ਹੈ।" },
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
