import type { Com007FrozenQuestion } from "./com007-software-languages-database-freeze-v1";

type Copy = { stem: string; options: readonly string[]; explanation: string };
type Source = {
  id: string;
  qlId: string;
  difficulty: "EASY" | "MEDIUM";
  correctIndex: number;
  fact: string;
  en: Copy;
  hi: Copy;
  pa: Copy;
};

export const COM007_GAP_EXTENSION_AUTHORITY_V1 = {
  authorityId: "COM-007-GAP-EXTENSION-V1",
  chapterCode: "COM-007",
  cpId: "COM-007-CP-002",
  status: "REVIEW_ONLY",
  questionCountPerLanguage: 20,
  permanentQlIds: [
    "COM-007-QL-009",
    "COM-007-QL-010",
    "COM-007-QL-011",
    "COM-007-QL-012",
    "COM-007-QL-013",
  ],
  sources: [
    "IBM-PROGRAM-DOCUMENTATION",
    "MICROSOFT-DEBUGGING",
    "ORACLE-DATABASE-MODELS",
    "ORACLE-DBMS",
    "ORACLE-SQL",
  ],
  lifecycle: "BANK_ONLY_MANUAL_ACCEPTANCE",
  hardDifficultyAuthorized: false,
} as const;

const S: readonly Source[] = [
  {
    id: "COM007-EXT-001", qlId: "COM-007-QL-009", difficulty: "EASY", correctIndex: 0, fact: "program documentation explains how a program works",
    en: { stem: "What is the purpose of program documentation?", options: ["To explain a program", "To clean a monitor", "To connect a cable", "To print every file"], explanation: "Program documentation explains how a program works and how it should be used." },
    hi: { stem: "प्रोग्राम डॉक्यूमेंटेशन का उद्देश्य क्या है?", options: ["प्रोग्राम को समझाना", "मॉनिटर साफ करना", "केबल जोड़ना", "हर फाइल प्रिंट करना"], explanation: "प्रोग्राम डॉक्यूमेंटेशन बताता है कि प्रोग्राम कैसे काम करता है और उसका उपयोग कैसे करना है।" },
    pa: { stem: "ਪ੍ਰੋਗਰਾਮ ਡੌਕੂਮੈਂਟੇਸ਼ਨ ਦਾ ਉਦੇਸ਼ ਕੀ ਹੈ?", options: ["ਪ੍ਰੋਗਰਾਮ ਨੂੰ ਸਮਝਾਉਣਾ", "ਮਾਨੀਟਰ ਸਾਫ਼ ਕਰਨਾ", "ਕੇਬਲ ਜੋੜਨਾ", "ਹਰ ਫਾਇਲ ਪ੍ਰਿੰਟ ਕਰਨਾ"], explanation: "ਪ੍ਰੋਗਰਾਮ ਡੌਕੂਮੈਂਟੇਸ਼ਨ ਦੱਸਦੀ ਹੈ ਕਿ ਪ੍ਰੋਗਰਾਮ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ ਅਤੇ ਇਸ ਦੀ ਵਰਤੋਂ ਕਿਵੇਂ ਕਰਨੀ ਹੈ।" },
  },
  {
    id: "COM007-EXT-002", qlId: "COM-007-QL-009", difficulty: "EASY", correctIndex: 2, fact: "a user manual is a type of program documentation",
    en: { stem: "Which item is a type of program documentation?", options: ["Keyboard", "Power cable", "User manual", "Mouse pad"], explanation: "A user manual is documentation that explains how to use the program." },
    hi: { stem: "प्रोग्राम डॉक्यूमेंटेशन का उदाहरण कौन-सा है?", options: ["कीबोर्ड", "पावर केबल", "यूजर मैनुअल", "माउस पैड"], explanation: "यूजर मैनुअल वह डॉक्यूमेंटेशन है जो प्रोग्राम का उपयोग समझाता है।" },
    pa: { stem: "ਪ੍ਰੋਗਰਾਮ ਡੌਕੂਮੈਂਟੇਸ਼ਨ ਦੀ ਉਦਾਹਰਨ ਕਿਹੜੀ ਹੈ?", options: ["ਕੀਬੋਰਡ", "ਪਾਵਰ ਕੇਬਲ", "ਯੂਜ਼ਰ ਮੈਨੂਅਲ", "ਮਾਊਸ ਪੈਡ"], explanation: "ਯੂਜ਼ਰ ਮੈਨੂਅਲ ਉਹ ਡੌਕੂਮੈਂਟੇਸ਼ਨ ਹੈ ਜੋ ਪ੍ਰੋਗਰਾਮ ਦੀ ਵਰਤੋਂ ਸਮਝਾਉਂਦੀ ਹੈ।" },
  },
  {
    id: "COM007-EXT-003", qlId: "COM-007-QL-009", difficulty: "MEDIUM", correctIndex: 1, fact: "debugging finds and removes program errors",
    en: { stem: "What is debugging?", options: ["Designing a keyboard", "Finding and correcting program errors", "Printing a chart", "Changing a screen"], explanation: "Debugging is the process of finding and correcting errors in a program." },
    hi: { stem: "डिबगिंग क्या है?", options: ["कीबोर्ड डिजाइन करना", "प्रोग्राम की त्रुटियां ढूंढकर सुधारना", "चार्ट प्रिंट करना", "स्क्रीन बदलना"], explanation: "डिबगिंग प्रोग्राम की त्रुटियों को ढूंढने और सुधारने की प्रक्रिया है।" },
    pa: { stem: "ਡਿਬੱਗਿੰਗ ਕੀ ਹੈ?", options: ["ਕੀਬੋਰਡ ਡਿਜ਼ਾਇਨ ਕਰਨਾ", "ਪ੍ਰੋਗਰਾਮ ਦੀਆਂ ਗਲਤੀਆਂ ਲੱਭ ਕੇ ਠੀਕ ਕਰਨਾ", "ਚਾਰਟ ਪ੍ਰਿੰਟ ਕਰਨਾ", "ਸਕਰੀਨ ਬਦਲਣਾ"], explanation: "ਡਿਬੱਗਿੰਗ ਪ੍ਰੋਗਰਾਮ ਦੀਆਂ ਗਲਤੀਆਂ ਲੱਭਣ ਅਤੇ ਠੀਕ ਕਰਨ ਦੀ ਪ੍ਰਕਿਰਿਆ ਹੈ।" },
  },
  {
    id: "COM007-EXT-004", qlId: "COM-007-QL-009", difficulty: "MEDIUM", correctIndex: 3, fact: "a syntax error breaks language rules",
    en: { stem: "Which error occurs when program code breaks language rules?", options: ["Power error", "Screen error", "Cable error", "Syntax error"], explanation: "A syntax error occurs when code does not follow the rules of the programming language." },
    hi: { stem: "प्रोग्राम कोड भाषा के नियम तोड़े तो कौन-सी त्रुटि होती है?", options: ["पावर त्रुटि", "स्क्रीन त्रुटि", "केबल त्रुटि", "सिंटैक्स त्रुटि"], explanation: "सिंटैक्स त्रुटि तब होती है जब कोड प्रोग्रामिंग भाषा के नियमों का पालन नहीं करता।" },
    pa: { stem: "ਜੇ ਪ੍ਰੋਗਰਾਮ ਕੋਡ ਭਾਸ਼ਾ ਦੇ ਨਿਯਮ ਤੋੜੇ ਤਾਂ ਕਿਹੜੀ ਗਲਤੀ ਹੁੰਦੀ ਹੈ?", options: ["ਪਾਵਰ ਗਲਤੀ", "ਸਕਰੀਨ ਗਲਤੀ", "ਕੇਬਲ ਗਲਤੀ", "ਸਿੰਟੈਕਸ ਗਲਤੀ"], explanation: "ਸਿੰਟੈਕਸ ਗਲਤੀ ਤਦ ਹੁੰਦੀ ਹੈ ਜਦੋਂ ਕੋਡ ਪ੍ਰੋਗਰਾਮਿੰਗ ਭਾਸ਼ਾ ਦੇ ਨਿਯਮ ਨਹੀਂ ਮੰਨਦਾ।" },
  },
  {
    id: "COM007-EXT-005", qlId: "COM-007-QL-010", difficulty: "EASY", correctIndex: 1, fact: "object-oriented programming organizes software around objects",
    en: { stem: "What does object-oriented programming organize software around?", options: ["Cables", "Objects", "Screens", "Printers"], explanation: "Object-oriented programming organizes software around objects that contain data and actions." },
    hi: { stem: "ऑब्जेक्ट-ओरिएंटेड प्रोग्रामिंग सॉफ्टवेयर को किसके आसपास व्यवस्थित करती है?", options: ["केबल", "ऑब्जेक्ट", "स्क्रीन", "प्रिंटर"], explanation: "ऑब्जेक्ट-ओरिएंटेड प्रोग्रामिंग ऐसे ऑब्जेक्ट के आसपास सॉफ्टवेयर व्यवस्थित करती है जिनमें डेटा और कार्य होते हैं।" },
    pa: { stem: "ਆਬਜੈਕਟ-ਓਰੀਐਂਟਡ ਪ੍ਰੋਗਰਾਮਿੰਗ ਸਾਫਟਵੇਅਰ ਨੂੰ ਕਿਸ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਵਿਵਸਥਿਤ ਕਰਦੀ ਹੈ?", options: ["ਕੇਬਲ", "ਆਬਜੈਕਟ", "ਸਕਰੀਨ", "ਪ੍ਰਿੰਟਰ"], explanation: "ਆਬਜੈਕਟ-ਓਰੀਐਂਟਡ ਪ੍ਰੋਗਰਾਮਿੰਗ ਉਹਨਾਂ ਆਬਜੈਕਟਾਂ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਸਾਫਟਵੇਅਰ ਵਿਵਸਥਿਤ ਕਰਦੀ ਹੈ ਜਿਨ੍ਹਾਂ ਵਿੱਚ ਡਾਟਾ ਅਤੇ ਕੰਮ ਹੁੰਦੇ ਹਨ।" },
  },
  {
    id: "COM007-EXT-006", qlId: "COM-007-QL-010", difficulty: "EASY", correctIndex: 0, fact: "encapsulation keeps data and related operations together",
    en: { stem: "Which idea keeps data and related operations together?", options: ["Encapsulation", "Routing", "Formatting", "Scanning"], explanation: "Encapsulation keeps data and the operations that use it together inside an object." },
    hi: { stem: "कौन-सा विचार डेटा और उससे जुड़े कार्यों को साथ रखता है?", options: ["एनकैप्सुलेशन", "रूटिंग", "फॉर्मेटिंग", "स्कैनिंग"], explanation: "एनकैप्सुलेशन डेटा और उस पर काम करने वाले कार्यों को एक ऑब्जेक्ट में साथ रखता है।" },
    pa: { stem: "ਕਿਹੜਾ ਵਿਚਾਰ ਡਾਟਾ ਅਤੇ ਉਸ ਨਾਲ ਜੁੜੇ ਕੰਮਾਂ ਨੂੰ ਇਕੱਠਾ ਰੱਖਦਾ ਹੈ?", options: ["ਐਨਕੈਪਸੂਲੇਸ਼ਨ", "ਰੂਟਿੰਗ", "ਫਾਰਮੈਟਿੰਗ", "ਸਕੈਨਿੰਗ"], explanation: "ਐਨਕੈਪਸੂਲੇਸ਼ਨ ਡਾਟਾ ਅਤੇ ਉਸ ਉੱਤੇ ਕੰਮ ਕਰਨ ਵਾਲੇ ਕੰਮਾਂ ਨੂੰ ਇੱਕ ਆਬਜੈਕਟ ਵਿੱਚ ਇਕੱਠਾ ਰੱਖਦਾ ਹੈ।" },
  },
  {
    id: "COM007-EXT-007", qlId: "COM-007-QL-010", difficulty: "MEDIUM", correctIndex: 2, fact: "inheritance lets a new class use features of an existing class",
    en: { stem: "What does inheritance allow in object-oriented programming?", options: ["Deleting all classes", "Printing source code", "A new class to use features of an existing class", "Changing a cable"], explanation: "Inheritance lets a new class use features of an existing class." },
    hi: { stem: "ऑब्जेक्ट-ओरिएंटेड प्रोग्रामिंग में इनहेरिटेंस क्या करती है?", options: ["सभी क्लास मिटाती है", "सोर्स कोड प्रिंट करती है", "नई क्लास को पुरानी क्लास की विशेषताएं देती है", "केबल बदलती है"], explanation: "इनहेरिटेंस नई क्लास को मौजूदा क्लास की विशेषताएं उपयोग करने देती है।" },
    pa: { stem: "ਆਬਜੈਕਟ-ਓਰੀਐਂਟਡ ਪ੍ਰੋਗਰਾਮਿੰਗ ਵਿੱਚ ਇਨਹੇਰਿਟੈਂਸ ਕੀ ਕਰਦੀ ਹੈ?", options: ["ਸਾਰੀਆਂ ਕਲਾਸਾਂ ਮਿਟਾਉਂਦੀ ਹੈ", "ਸੋਰਸ ਕੋਡ ਪ੍ਰਿੰਟ ਕਰਦੀ ਹੈ", "ਨਵੀਂ ਕਲਾਸ ਨੂੰ ਮੌਜੂਦਾ ਕਲਾਸ ਦੀਆਂ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਦਿੰਦੀ ਹੈ", "ਕੇਬਲ ਬਦਲਦੀ ਹੈ"], explanation: "ਇਨਹੇਰਿਟੈਂਸ ਨਵੀਂ ਕਲਾਸ ਨੂੰ ਮੌਜੂਦਾ ਕਲਾਸ ਦੀਆਂ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਵਰਤਣ ਦਿੰਦੀ ਹੈ।" },
  },
  {
    id: "COM007-EXT-008", qlId: "COM-007-QL-010", difficulty: "MEDIUM", correctIndex: 3, fact: "polymorphism lets the same interface show different behavior",
    en: { stem: "What does polymorphism allow?", options: ["Only one data type", "Only file storage", "Only code printing", "The same interface to show different behavior"], explanation: "Polymorphism allows the same interface or method name to show different behavior." },
    hi: { stem: "पॉलीमॉर्फिज्म क्या करने देता है?", options: ["केवल एक डेटा प्रकार", "केवल फाइल स्टोरेज", "केवल कोड प्रिंट करना", "एक ही इंटरफेस का अलग व्यवहार दिखाना"], explanation: "पॉलीमॉर्फिज्म एक ही इंटरफेस या मेथड नाम को अलग व्यवहार दिखाने देता है।" },
    pa: { stem: "ਪੌਲੀਮਾਰਫਿਜ਼ਮ ਕੀ ਕਰਨ ਦਿੰਦਾ ਹੈ?", options: ["ਸਿਰਫ਼ ਇੱਕ ਡਾਟਾ ਕਿਸਮ", "ਸਿਰਫ਼ ਫਾਇਲ ਸਟੋਰੇਜ", "ਸਿਰਫ਼ ਕੋਡ ਪ੍ਰਿੰਟ ਕਰਨਾ", "ਇੱਕੋ ਇੰਟਰਫੇਸ ਦਾ ਵੱਖਰਾ ਵਿਹਾਰ ਦਿਖਾਉਣਾ"], explanation: "ਪੌਲੀਮਾਰਫਿਜ਼ਮ ਇੱਕੋ ਇੰਟਰਫੇਸ ਜਾਂ ਮੈਥਡ ਨਾਮ ਨੂੰ ਵੱਖਰਾ ਵਿਹਾਰ ਦਿਖਾਉਣ ਦਿੰਦਾ ਹੈ।" },
  },
  {
    id: "COM007-EXT-009", qlId: "COM-007-QL-011", difficulty: "EASY", correctIndex: 2, fact: "a hierarchical database organizes records in a tree structure",
    en: { stem: "Which database model uses a tree-like structure?", options: ["Relational", "Network", "Flat file", "Hierarchical"], explanation: "A hierarchical database arranges records in a tree-like parent and child structure." },
    hi: { stem: "कौन-सा डेटाबेस मॉडल पेड़ जैसी संरचना का उपयोग करता है?", options: ["रिलेशनल", "नेटवर्क", "फ्लैट फाइल", "हाइरार्किकल"], explanation: "हाइरार्किकल डेटाबेस रिकॉर्ड को पैरेंट और चाइल्ड वाली पेड़ जैसी संरचना में रखता है।" },
    pa: { stem: "ਕਿਹੜਾ ਡਾਟਾਬੇਸ ਮਾਡਲ ਦਰੱਖਤ ਵਰਗੀ ਬਣਤਰ ਵਰਤਦਾ ਹੈ?", options: ["ਰਿਲੇਸ਼ਨਲ", "ਨੈੱਟਵਰਕ", "ਫਲੈਟ ਫਾਇਲ", "ਹਾਇਰਾਰਕੀਕਲ"], explanation: "ਹਾਇਰਾਰਕੀਕਲ ਡਾਟਾਬੇਸ ਰਿਕਾਰਡਾਂ ਨੂੰ ਪੇਰੈਂਟ ਅਤੇ ਚਾਇਲਡ ਵਾਲੀ ਦਰੱਖਤ ਵਰਗੀ ਬਣਤਰ ਵਿੱਚ ਰੱਖਦਾ ਹੈ।" },
  },
  {
    id: "COM007-EXT-010", qlId: "COM-007-QL-011", difficulty: "EASY", correctIndex: 0, fact: "a relational database stores data in tables",
    en: { stem: "Which database model stores data in tables?", options: ["Relational", "Hierarchical", "Network", "Sequential"], explanation: "A relational database stores data in tables made of rows and columns." },
    hi: { stem: "कौन-सा डेटाबेस मॉडल डेटा को टेबल में रखता है?", options: ["रिलेशनल", "हाइरार्किकल", "नेटवर्क", "सीक्वेंशियल"], explanation: "रिलेशनल डेटाबेस डेटा को पंक्तियों और कॉलम वाली टेबल में रखता है।" },
    pa: { stem: "ਕਿਹੜਾ ਡਾਟਾਬੇਸ ਮਾਡਲ ਡਾਟਾ ਨੂੰ ਟੇਬਲਾਂ ਵਿੱਚ ਰੱਖਦਾ ਹੈ?", options: ["ਰਿਲੇਸ਼ਨਲ", "ਹਾਇਰਾਰਕੀਕਲ", "ਨੈੱਟਵਰਕ", "ਸੀਕਵੈਂਸ਼ਲ"], explanation: "ਰਿਲੇਸ਼ਨਲ ਡਾਟਾਬੇਸ ਡਾਟਾ ਨੂੰ ਕਤਾਰਾਂ ਅਤੇ ਕਾਲਮਾਂ ਵਾਲੀਆਂ ਟੇਬਲਾਂ ਵਿੱਚ ਰੱਖਦਾ ਹੈ।" },
  },
  {
    id: "COM007-EXT-011", qlId: "COM-007-QL-011", difficulty: "MEDIUM", correctIndex: 1, fact: "a network database can represent many-to-many links",
    en: { stem: "Which model can represent many-to-many links between records?", options: ["Hierarchical", "Network", "Flat file", "Single table"], explanation: "A network database can represent records with many-to-many links." },
    hi: { stem: "रिकॉर्ड के बीच कई-से-कई संबंध कौन-सा मॉडल दिखा सकता है?", options: ["हाइरार्किकल", "नेटवर्क", "फ्लैट फाइल", "सिंगल टेबल"], explanation: "नेटवर्क डेटाबेस रिकॉर्ड के बीच कई-से-कई संबंध दिखा सकता है।" },
    pa: { stem: "ਰਿਕਾਰਡਾਂ ਵਿਚਕਾਰ ਕਈ-ਤੋਂ-ਕਈ ਸੰਬੰਧ ਕਿਹੜਾ ਮਾਡਲ ਦਿਖਾ ਸਕਦਾ ਹੈ?", options: ["ਹਾਇਰਾਰਕੀਕਲ", "ਨੈੱਟਵਰਕ", "ਫਲੈਟ ਫਾਇਲ", "ਸਿੰਗਲ ਟੇਬਲ"], explanation: "ਨੈੱਟਵਰਕ ਡਾਟਾਬੇਸ ਰਿਕਾਰਡਾਂ ਵਿਚਕਾਰ ਕਈ-ਤੋਂ-ਕਈ ਸੰਬੰਧ ਦਿਖਾ ਸਕਦਾ ਹੈ।" },
  },
  {
    id: "COM007-EXT-012", qlId: "COM-007-QL-011", difficulty: "MEDIUM", correctIndex: 3, fact: "a relational database uses relationships between tables",
    en: { stem: "What is a main feature of a relational database?", options: ["Only one record", "No rows", "No columns", "Relations between tables"], explanation: "A relational database connects tables through relationships between their data." },
    hi: { stem: "रिलेशनल डेटाबेस की मुख्य विशेषता क्या है?", options: ["केवल एक रिकॉर्ड", "कोई पंक्ति नहीं", "कोई कॉलम नहीं", "टेबलों के बीच संबंध"], explanation: "रिलेशनल डेटाबेस अपने डेटा के बीच संबंध बनाकर टेबलों को जोड़ता है।" },
    pa: { stem: "ਰਿਲੇਸ਼ਨਲ ਡਾਟਾਬੇਸ ਦੀ ਮੁੱਖ ਵਿਸ਼ੇਸ਼ਤਾ ਕੀ ਹੈ?", options: ["ਸਿਰਫ਼ ਇੱਕ ਰਿਕਾਰਡ", "ਕੋਈ ਕਤਾਰ ਨਹੀਂ", "ਕੋਈ ਕਾਲਮ ਨਹੀਂ", "ਟੇਬਲਾਂ ਵਿਚਕਾਰ ਸੰਬੰਧ"], explanation: "ਰਿਲੇਸ਼ਨਲ ਡਾਟਾਬੇਸ ਆਪਣੇ ਡਾਟੇ ਵਿਚਕਾਰ ਸੰਬੰਧ ਬਣਾ ਕੇ ਟੇਬਲਾਂ ਨੂੰ ਜੋੜਦਾ ਹੈ।" },
  },
  {
    id: "COM007-EXT-013", qlId: "COM-007-QL-012", difficulty: "EASY", correctIndex: 1, fact: "DBMS means Database Management System and manages stored data",
    en: { stem: "What is the main role of a Database Management System?", options: ["To control a printer", "To manage stored data", "To draw pictures", "To make cables"], explanation: "DBMS means Database Management System. It helps create, store, update and retrieve data." },
    hi: { stem: "Database Management System का मुख्य काम क्या है?", options: ["प्रिंटर नियंत्रित करना", "संग्रहीत डेटा संभालना", "चित्र बनाना", "केबल बनाना"], explanation: "DBMS का पूरा नाम Database Management System है। यह डेटा बनाने, रखने, बदलने और निकालने में मदद करता है।" },
    pa: { stem: "Database Management System ਦਾ ਮੁੱਖ ਕੰਮ ਕੀ ਹੈ?", options: ["ਪ੍ਰਿੰਟਰ ਕੰਟਰੋਲ ਕਰਨਾ", "ਸੰਭਾਲਿਆ ਡਾਟਾ ਪ੍ਰਬੰਧਿਤ ਕਰਨਾ", "ਤਸਵੀਰਾਂ ਬਣਾਉਣਾ", "ਕੇਬਲ ਬਣਾਉਣਾ"], explanation: "DBMS ਦਾ ਪੂਰਾ ਨਾਮ Database Management System ਹੈ। ਇਹ ਡਾਟਾ ਬਣਾਉਣ, ਰੱਖਣ, ਬਦਲਣ ਅਤੇ ਕੱਢਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।" },
  },
  {
    id: "COM007-EXT-014", qlId: "COM-007-QL-012", difficulty: "EASY", correctIndex: 0, fact: "a primary key identifies a row uniquely",
    en: { stem: "What does a primary key do in a table?", options: ["Uniquely identifies a row", "Deletes every row", "Prints the table", "Changes the screen"], explanation: "A primary key uniquely identifies each row in a table." },
    hi: { stem: "टेबल में प्राइमरी की क्या करती है?", options: ["एक पंक्ति की अलग पहचान करती है", "हर पंक्ति मिटाती है", "टेबल प्रिंट करती है", "स्क्रीन बदलती है"], explanation: "प्राइमरी की टेबल की हर पंक्ति की अलग पहचान करती है।" },
    pa: { stem: "ਟੇਬਲ ਵਿੱਚ ਪ੍ਰਾਇਮਰੀ ਕੀ ਕੀ ਕਰਦੀ ਹੈ?", options: ["ਕਤਾਰ ਦੀ ਵਿਲੱਖਣ ਪਛਾਣ ਕਰਦੀ ਹੈ", "ਹਰ ਕਤਾਰ ਮਿਟਾਉਂਦੀ ਹੈ", "ਟੇਬਲ ਪ੍ਰਿੰਟ ਕਰਦੀ ਹੈ", "ਸਕਰੀਨ ਬਦਲਦੀ ਹੈ"], explanation: "ਪ੍ਰਾਇਮਰੀ ਕੀ ਟੇਬਲ ਦੀ ਹਰ ਕਤਾਰ ਦੀ ਵਿਲੱਖਣ ਪਛਾਣ ਕਰਦੀ ਹੈ।" },
  },
  {
    id: "COM007-EXT-015", qlId: "COM-007-QL-012", difficulty: "MEDIUM", correctIndex: 2, fact: "database backup supports recovery after data loss",
    en: { stem: "Why is a database backup important?", options: ["It increases screen size", "It removes all records", "It helps restore lost data", "It changes a keyboard"], explanation: "A backup is a copy of data that can help restore the database after loss or damage." },
    hi: { stem: "डेटाबेस बैकअप क्यों महत्वपूर्ण है?", options: ["यह स्क्रीन का आकार बढ़ाता है", "यह सभी रिकॉर्ड हटाता है", "यह खोया डेटा वापस लाने में मदद करता है", "यह कीबोर्ड बदलता है"], explanation: "बैकअप डेटा की कॉपी है। डेटा खोने या खराब होने पर इससे डेटाबेस वापस लाने में मदद मिलती है।" },
    pa: { stem: "ਡਾਟਾਬੇਸ ਬੈਕਅੱਪ ਕਿਉਂ ਮਹੱਤਵਪੂਰਨ ਹੈ?", options: ["ਇਹ ਸਕਰੀਨ ਦਾ ਆਕਾਰ ਵਧਾਉਂਦਾ ਹੈ", "ਇਹ ਸਾਰੇ ਰਿਕਾਰਡ ਮਿਟਾਉਂਦਾ ਹੈ", "ਇਹ ਗੁੰਮਿਆ ਡਾਟਾ ਵਾਪਸ ਲਿਆਉਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ", "ਇਹ ਕੀਬੋਰਡ ਬਦਲਦਾ ਹੈ"], explanation: "ਬੈਕਅੱਪ ਡਾਟੇ ਦੀ ਕਾਪੀ ਹੁੰਦੀ ਹੈ। ਡਾਟਾ ਗੁੰਮ ਜਾਂ ਖਰਾਬ ਹੋਣ ਉੱਤੇ ਇਸ ਨਾਲ ਡਾਟਾਬੇਸ ਵਾਪਸ ਲਿਆਉਣ ਵਿੱਚ ਮਦਦ ਮਿਲਦੀ ਹੈ।" },
  },
  {
    id: "COM007-EXT-016", qlId: "COM-007-QL-012", difficulty: "MEDIUM", correctIndex: 3, fact: "database security controls access to data",
    en: { stem: "What is a database security control used for?", options: ["Cooling a CPU", "Drawing a table", "Changing a file name", "Controlling access to data"], explanation: "Database security controls who can view or change data." },
    hi: { stem: "डेटाबेस सिक्योरिटी कंट्रोल का उपयोग किस लिए होता है?", options: ["CPU ठंडा करना", "टेबल बनाना", "फाइल का नाम बदलना", "डेटा तक पहुंच नियंत्रित करना"], explanation: "डेटाबेस सिक्योरिटी यह नियंत्रित करती है कि कौन डेटा देख या बदल सकता है।" },
    pa: { stem: "ਡਾਟਾਬੇਸ ਸੁਰੱਖਿਆ ਕੰਟਰੋਲ ਕਿਸ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?", options: ["CPU ਠੰਢਾ ਕਰਨਾ", "ਟੇਬਲ ਬਣਾਉਣਾ", "ਫਾਇਲ ਦਾ ਨਾਮ ਬਦਲਣਾ", "ਡਾਟੇ ਤੱਕ ਪਹੁੰਚ ਕੰਟਰੋਲ ਕਰਨਾ"], explanation: "ਡਾਟਾਬੇਸ ਸੁਰੱਖਿਆ ਇਹ ਕੰਟਰੋਲ ਕਰਦੀ ਹੈ ਕਿ ਕੌਣ ਡਾਟਾ ਦੇਖ ਜਾਂ ਬਦਲ ਸਕਦਾ ਹੈ।" },
  },
  {
    id: "COM007-EXT-017", qlId: "COM-007-QL-013", difficulty: "EASY", correctIndex: 0, fact: "SQL means Structured Query Language and is used with relational databases",
    en: { stem: "What is SQL mainly used for?", options: ["Working with database data", "Cleaning a monitor", "Connecting a mouse", "Printing cables"], explanation: "SQL means Structured Query Language. It is used to work with data in relational databases." },
    hi: { stem: "SQL का मुख्य उपयोग क्या है?", options: ["डेटाबेस डेटा पर काम करना", "मॉनिटर साफ करना", "माउस जोड़ना", "केबल प्रिंट करना"], explanation: "SQL का पूरा नाम Structured Query Language है। इसका उपयोग रिलेशनल डेटाबेस के डेटा पर काम करने के लिए होता है।" },
    pa: { stem: "SQL ਦਾ ਮੁੱਖ ਉਪਯੋਗ ਕੀ ਹੈ?", options: ["ਡਾਟਾਬੇਸ ਡਾਟੇ ਉੱਤੇ ਕੰਮ ਕਰਨਾ", "ਮਾਨੀਟਰ ਸਾਫ਼ ਕਰਨਾ", "ਮਾਊਸ ਜੋੜਨਾ", "ਕੇਬਲ ਪ੍ਰਿੰਟ ਕਰਨਾ"], explanation: "SQL ਦਾ ਪੂਰਾ ਨਾਮ Structured Query Language ਹੈ। ਇਹ ਰਿਲੇਸ਼ਨਲ ਡਾਟਾਬੇਸ ਦੇ ਡਾਟੇ ਉੱਤੇ ਕੰਮ ਕਰਨ ਲਈ ਵਰਤੀ ਜਾਂਦੀ ਹੈ।" },
  },
  {
    id: "COM007-EXT-018", qlId: "COM-007-QL-013", difficulty: "EASY", correctIndex: 2, fact: "DDL means Data Definition Language and defines database structures",
    en: { stem: "What does Data Definition Language define?", options: ["Monitor brightness", "Network cables", "Database structures", "Keyboard keys"], explanation: "DDL means Data Definition Language. It defines database structures such as tables." },
    hi: { stem: "Data Definition Language क्या परिभाषित करती है?", options: ["मॉनिटर की चमक", "नेटवर्क केबल", "डेटाबेस संरचनाएं", "कीबोर्ड कीज"], explanation: "DDL का पूरा नाम Data Definition Language है। यह टेबल जैसी डेटाबेस संरचनाएं परिभाषित करती है।" },
    pa: { stem: "Data Definition Language ਕੀ ਪਰਿਭਾਸ਼ਿਤ ਕਰਦੀ ਹੈ?", options: ["ਮਾਨੀਟਰ ਦੀ ਰੌਸ਼ਨੀ", "ਨੈੱਟਵਰਕ ਕੇਬਲ", "ਡਾਟਾਬੇਸ ਬਣਤਰਾਂ", "ਕੀਬੋਰਡ ਕੀਜ਼"], explanation: "DDL ਦਾ ਪੂਰਾ ਨਾਮ Data Definition Language ਹੈ। ਇਹ ਟੇਬਲਾਂ ਵਰਗੀਆਂ ਡਾਟਾਬੇਸ ਬਣਤਰਾਂ ਪਰਿਭਾਸ਼ਿਤ ਕਰਦੀ ਹੈ।" },
  },
  {
    id: "COM007-EXT-019", qlId: "COM-007-QL-013", difficulty: "MEDIUM", correctIndex: 1, fact: "DML means Data Manipulation Language and changes stored data",
    en: { stem: "What does Data Manipulation Language mainly change?", options: ["The monitor", "Stored data", "The keyboard", "The network cable"], explanation: "DML means Data Manipulation Language. It is used to add, change or remove stored data." },
    hi: { stem: "Data Manipulation Language मुख्य रूप से क्या बदलती है?", options: ["मॉनिटर", "संग्रहीत डेटा", "कीबोर्ड", "नेटवर्क केबल"], explanation: "DML का पूरा नाम Data Manipulation Language है। इसका उपयोग संग्रहीत डेटा जोड़ने, बदलने या हटाने के लिए होता है।" },
    pa: { stem: "Data Manipulation Language ਮੁੱਖ ਤੌਰ ਉੱਤੇ ਕੀ ਬਦਲਦੀ ਹੈ?", options: ["ਮਾਨੀਟਰ", "ਸੰਭਾਲਿਆ ਡਾਟਾ", "ਕੀਬੋਰਡ", "ਨੈੱਟਵਰਕ ਕੇਬਲ"], explanation: "DML ਦਾ ਪੂਰਾ ਨਾਮ Data Manipulation Language ਹੈ। ਇਹ ਸੰਭਾਲੇ ਡਾਟੇ ਨੂੰ ਜੋੜਨ, ਬਦਲਣ ਜਾਂ ਹਟਾਉਣ ਲਈ ਵਰਤੀ ਜਾਂਦੀ ਹੈ।" },
  },
  {
    id: "COM007-EXT-020", qlId: "COM-007-QL-013", difficulty: "MEDIUM", correctIndex: 3, fact: "DCL means Data Control Language and controls data permissions",
    en: { stem: "What does Data Control Language mainly control?", options: ["Screen colour", "File size", "Printer speed", "Data permissions"], explanation: "DCL means Data Control Language. It controls permissions for using database data." },
    hi: { stem: "Data Control Language मुख्य रूप से क्या नियंत्रित करती है?", options: ["स्क्रीन का रंग", "फाइल का आकार", "प्रिंटर की गति", "डेटा की अनुमति"], explanation: "DCL का पूरा नाम Data Control Language है। यह डेटाबेस डेटा के उपयोग की अनुमति नियंत्रित करती है।" },
    pa: { stem: "Data Control Language ਮੁੱਖ ਤੌਰ ਉੱਤੇ ਕੀ ਕੰਟਰੋਲ ਕਰਦੀ ਹੈ?", options: ["ਸਕਰੀਨ ਦਾ ਰੰਗ", "ਫਾਇਲ ਦਾ ਆਕਾਰ", "ਪ੍ਰਿੰਟਰ ਦੀ ਗਤੀ", "ਡਾਟੇ ਦੀਆਂ ਇਜਾਜ਼ਤਾਂ"], explanation: "DCL ਦਾ ਪੂਰਾ ਨਾਮ Data Control Language ਹੈ। ਇਹ ਡਾਟਾਬੇਸ ਡਾਟੇ ਦੀ ਵਰਤੋਂ ਦੀਆਂ ਇਜਾਜ਼ਤਾਂ ਕੰਟਰੋਲ ਕਰਦੀ ਹੈ।" },
  },
];

function build(source: Source, language: "en" | "hi" | "pa"): Com007FrozenQuestion {
  const copy = source[language];
  return Object.freeze({
    questionId: `${source.id}-${language.toUpperCase()}`,
    sourceQuestionId: source.id,
    qlId: source.qlId,
    language,
    locale: `${language}-IN` as "en-IN" | "hi-IN" | "pa-IN",
    difficulty: source.difficulty,
    stem: copy.stem,
    options: Object.freeze([...copy.options]),
    correctIndex: source.correctIndex,
    canonicalAnswer: copy.options[source.correctIndex]!,
    explanation: copy.explanation,
    sourceFactIds: Object.freeze([source.fact]),
    sourceEnglishAuthorityId: COM007_GAP_EXTENSION_AUTHORITY_V1.authorityId,
    sourceEnglishFrozen: true,
    sourceLocalizationFrozen: true,
  });
}

export const COM007_GAP_EXTENSION_ENGLISH: readonly Com007FrozenQuestion[] = Object.freeze(S.map((source) => build(source, "en")));
export const COM007_GAP_EXTENSION_HINDI: readonly Com007FrozenQuestion[] = Object.freeze(S.map((source) => build(source, "hi")));
export const COM007_GAP_EXTENSION_PUNJABI: readonly Com007FrozenQuestion[] = Object.freeze(S.map((source) => build(source, "pa")));

export function auditCom007GapExtensionV1() {
  const issues: string[] = [];
  const all = [...COM007_GAP_EXTENSION_ENGLISH, ...COM007_GAP_EXTENSION_HINDI, ...COM007_GAP_EXTENSION_PUNJABI];
  if (S.length !== COM007_GAP_EXTENSION_AUTHORITY_V1.questionCountPerLanguage) issues.push("QUESTION_COUNT_MISMATCH");
  if (new Set(S.map((q) => q.qlId)).size !== COM007_GAP_EXTENSION_AUTHORITY_V1.permanentQlIds.length) issues.push("QL_COUNT_MISMATCH");
  for (const q of all) {
    if (q.options.length !== 4 || q.correctIndex < 0 || q.correctIndex > 3) issues.push(`INVALID_OPTIONS:${q.questionId}`);
    if (!q.explanation.trim() || q.explanation.split(/[.!?।॥]+/).filter(Boolean).length > 2) issues.push(`BAD_EXPLANATION:${q.questionId}`);
    if (/^consider the following|^in the following|associated|association/i.test(q.stem + " " + q.explanation)) issues.push(`EDITORIAL_WORDING:${q.questionId}`);
  }
  if (new Set(all.map((q) => q.questionId)).size !== all.length) issues.push("DUPLICATE_QUESTION_ID");
  return { valid: issues.length === 0, issues, counts: { en: COM007_GAP_EXTENSION_ENGLISH.length, hi: COM007_GAP_EXTENSION_HINDI.length, pa: COM007_GAP_EXTENSION_PUNJABI.length } };
}
