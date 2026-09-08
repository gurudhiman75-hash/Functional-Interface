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

export type Com001HardwareExtensionQuestion = Copy & {
  questionId: string;
  sourceQuestionId: string;
  cpId: "COM-001-CP-007";
  qlId: string;
  language: "en" | "hi" | "pa";
  locale: "en-IN" | "hi-IN" | "pa-IN";
  difficulty: "EASY" | "MEDIUM";
  correctIndex: number;
  canonicalAnswer: string;
  sourceFactIds: readonly string[];
  sourceEnglishAuthorityId: string;
  sourceEnglishFrozen: true;
  sourceLocalizationFrozen: true;
};

export const COM001_HARDWARE_GAP_EXTENSION_AUTHORITY_V1 = {
  authorityId: "COM-001-HARDWARE-GAP-EXTENSION-V1",
  chapterCode: "COM-001",
  cpId: "COM-001-CP-007",
  status: "REVIEW_ONLY",
  questionCountPerLanguage: 16,
  permanentQlIds: [
    "COM-001-CP-007-QL-001",
    "COM-001-CP-007-QL-002",
    "COM-001-CP-007-QL-003",
    "COM-001-CP-007-QL-004",
  ],
  sources: [
    "IBM-COMPUTER-ARCHITECTURE",
    "INTEL-MOTHERBOARD-BASICS",
    "MICROSOFT-DMA",
    "APC-UPS-BASICS",
  ],
  lifecycle: "BANK_ONLY_MANUAL_ACCEPTANCE",
  hardDifficultyAuthorized: false,
} as const;

const S: readonly Source[] = [
  {
    id: "COM001-EXT-001", qlId: "COM-001-CP-007-QL-001", difficulty: "EASY", correctIndex: 0, fact: "the motherboard connects major computer components",
    en: { stem: "What is the main role of a motherboard?", options: ["To connect major computer parts", "To print documents", "To display websites", "To store only photos"], explanation: "The motherboard connects major computer parts such as the processor, memory and expansion devices." },
    hi: { stem: "मदरबोर्ड का मुख्य काम क्या है?", options: ["कंप्यूटर के मुख्य भाग जोड़ना", "दस्तावेज प्रिंट करना", "वेबसाइट दिखाना", "केवल फोटो रखना"], explanation: "मदरबोर्ड प्रोसेसर, मेमोरी और अन्य मुख्य कंप्यूटर भागों को जोड़ता है।" },
    pa: { stem: "ਮਦਰਬੋਰਡ ਦਾ ਮੁੱਖ ਕੰਮ ਕੀ ਹੈ?", options: ["ਕੰਪਿਊਟਰ ਦੇ ਮੁੱਖ ਭਾਗ ਜੋੜਨਾ", "ਦਸਤਾਵੇਜ਼ ਪ੍ਰਿੰਟ ਕਰਨਾ", "ਵੈੱਬਸਾਈਟ ਦਿਖਾਉਣਾ", "ਸਿਰਫ਼ ਤਸਵੀਰਾਂ ਰੱਖਣਾ"], explanation: "ਮਦਰਬੋਰਡ ਪ੍ਰੋਸੈਸਰ, ਮੈਮੋਰੀ ਅਤੇ ਹੋਰ ਮੁੱਖ ਕੰਪਿਊਟਰ ਭਾਗਾਂ ਨੂੰ ਜੋੜਦਾ ਹੈ।" },
  },
  {
    id: "COM001-EXT-002", qlId: "COM-001-CP-007-QL-001", difficulty: "EASY", correctIndex: 2, fact: "a register is a small fast storage location inside the processor",
    en: { stem: "What is a register?", options: ["A printer part", "A network cable", "A small fast storage location in the processor", "A monitor type"], explanation: "A register is a small, fast storage location inside the processor." },
    hi: { stem: "रजिस्टर क्या होता है?", options: ["प्रिंटर का भाग", "नेटवर्क केबल", "प्रोसेसर के अंदर छोटी तेज स्टोरेज जगह", "मॉनिटर का प्रकार"], explanation: "रजिस्टर प्रोसेसर के अंदर मौजूद छोटी और तेज स्टोरेज जगह होती है।" },
    pa: { stem: "ਰਜਿਸਟਰ ਕੀ ਹੁੰਦਾ ਹੈ?", options: ["ਪ੍ਰਿੰਟਰ ਦਾ ਭਾਗ", "ਨੈੱਟਵਰਕ ਕੇਬਲ", "ਪ੍ਰੋਸੈਸਰ ਦੇ ਅੰਦਰ ਛੋਟੀ ਤੇਜ਼ ਸਟੋਰੇਜ ਜਗ੍ਹਾ", "ਮਾਨੀਟਰ ਦੀ ਕਿਸਮ"], explanation: "ਰਜਿਸਟਰ ਪ੍ਰੋਸੈਸਰ ਦੇ ਅੰਦਰ ਮੌਜੂਦ ਛੋਟੀ ਅਤੇ ਤੇਜ਼ ਸਟੋਰੇਜ ਜਗ੍ਹਾ ਹੁੰਦੀ ਹੈ।" },
  },
  {
    id: "COM001-EXT-003", qlId: "COM-001-CP-007-QL-001", difficulty: "MEDIUM", correctIndex: 1, fact: "the accumulator stores intermediate arithmetic and logic results",
    en: { stem: "Which register commonly holds an intermediate calculation result?", options: ["Program counter", "Accumulator", "Instruction register", "Address bus"], explanation: "The accumulator commonly holds an intermediate result of an arithmetic or logic operation." },
    hi: { stem: "मध्यवर्ती गणना परिणाम सामान्यतः कौन-सा रजिस्टर रखता है?", options: ["प्रोग्राम काउंटर", "एक्यूमुलेटर", "इंस्ट्रक्शन रजिस्टर", "एड्रेस बस"], explanation: "एक्यूमुलेटर सामान्यतः गणितीय या तार्किक कार्य का मध्यवर्ती परिणाम रखता है।" },
    pa: { stem: "ਮੱਧਵਰਤੀ ਗਣਨਾ ਦਾ ਨਤੀਜਾ ਆਮ ਤੌਰ ਉੱਤੇ ਕਿਹੜਾ ਰਜਿਸਟਰ ਰੱਖਦਾ ਹੈ?", options: ["ਪ੍ਰੋਗਰਾਮ ਕਾਊਂਟਰ", "ਐਕਿਊਮੂਲੇਟਰ", "ਇੰਸਟਰਕਸ਼ਨ ਰਜਿਸਟਰ", "ਐਡਰੈੱਸ ਬੱਸ"], explanation: "ਐਕਿਊਮੂਲੇਟਰ ਆਮ ਤੌਰ ਉੱਤੇ ਗਣਿਤ ਜਾਂ ਤਰਕ ਵਾਲੇ ਕੰਮ ਦਾ ਮੱਧਵਰਤੀ ਨਤੀਜਾ ਰੱਖਦਾ ਹੈ।" },
  },
  {
    id: "COM001-EXT-004", qlId: "COM-001-CP-007-QL-001", difficulty: "MEDIUM", correctIndex: 3, fact: "a buffer temporarily holds data during transfer",
    en: { stem: "What is the purpose of a buffer?", options: ["To cool the processor", "To print data", "To create a password", "To hold data temporarily during transfer"], explanation: "A buffer holds data temporarily while it moves between devices or programs." },
    hi: { stem: "बफर का उद्देश्य क्या है?", options: ["प्रोसेसर ठंडा करना", "डेटा प्रिंट करना", "पासवर्ड बनाना", "डेटा स्थानांतरण के दौरान उसे थोड़ी देर रखना"], explanation: "बफर डिवाइस या प्रोग्राम के बीच डेटा जाते समय उसे थोड़ी देर रखता है।" },
    pa: { stem: "ਬਫਰ ਦਾ ਉਦੇਸ਼ ਕੀ ਹੈ?", options: ["ਪ੍ਰੋਸੈਸਰ ਠੰਢਾ ਕਰਨਾ", "ਡਾਟਾ ਪ੍ਰਿੰਟ ਕਰਨਾ", "ਪਾਸਵਰਡ ਬਣਾਉਣਾ", "ਡਾਟਾ ਭੇਜਣ ਸਮੇਂ ਕੁਝ ਸਮੇਂ ਲਈ ਰੱਖਣਾ"], explanation: "ਬਫਰ ਡਿਵਾਈਸਾਂ ਜਾਂ ਪ੍ਰੋਗਰਾਮਾਂ ਵਿਚਕਾਰ ਡਾਟਾ ਜਾਂਦੇ ਸਮੇਂ ਉਸ ਨੂੰ ਕੁਝ ਸਮੇਂ ਲਈ ਰੱਖਦਾ ਹੈ।" },
  },
  {
    id: "COM001-EXT-005", qlId: "COM-001-CP-007-QL-002", difficulty: "EASY", correctIndex: 0, fact: "the instruction cycle includes fetch decode execute and store steps",
    en: { stem: "Which step comes first in the instruction cycle?", options: ["Fetch", "Execute", "Store", "Print"], explanation: "The processor first fetches the instruction, then decodes and executes it." },
    hi: { stem: "इंस्ट्रक्शन साइकिल में सबसे पहले कौन-सा चरण आता है?", options: ["फेच", "एक्जीक्यूट", "स्टोर", "प्रिंट"], explanation: "प्रोसेसर पहले निर्देश को फेच करता है, फिर उसे डिकोड और एक्जीक्यूट करता है।" },
    pa: { stem: "ਇੰਸਟਰਕਸ਼ਨ ਸਾਈਕਲ ਵਿੱਚ ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਕਿਹੜਾ ਪੜਾਅ ਆਉਂਦਾ ਹੈ?", options: ["ਫੈਚ", "ਐਗਜ਼ਿਕਿਊਟ", "ਸਟੋਰ", "ਪ੍ਰਿੰਟ"], explanation: "ਪ੍ਰੋਸੈਸਰ ਪਹਿਲਾਂ ਹਦਾਇਤ ਫੈਚ ਕਰਦਾ ਹੈ, ਫਿਰ ਉਸ ਨੂੰ ਡਿਕੋਡ ਅਤੇ ਐਗਜ਼ਿਕਿਊਟ ਕਰਦਾ ਹੈ।" },
  },
  {
    id: "COM001-EXT-006", qlId: "COM-001-CP-007-QL-002", difficulty: "EASY", correctIndex: 2, fact: "the program counter holds the address of the next instruction",
    en: { stem: "What does the program counter hold?", options: ["The last printed page", "A monitor colour", "The address of the next instruction", "A keyboard layout"], explanation: "The program counter holds the address of the next instruction to be fetched." },
    hi: { stem: "प्रोग्राम काउंटर में क्या रहता है?", options: ["पिछला प्रिंट पेज", "मॉनिटर का रंग", "अगले निर्देश का पता", "कीबोर्ड लेआउट"], explanation: "प्रोग्राम काउंटर अगले फेच किए जाने वाले निर्देश का पता रखता है।" },
    pa: { stem: "ਪ੍ਰੋਗਰਾਮ ਕਾਊਂਟਰ ਵਿੱਚ ਕੀ ਹੁੰਦਾ ਹੈ?", options: ["ਪਿਛਲਾ ਪ੍ਰਿੰਟ ਕੀਤਾ ਪੰਨਾ", "ਮਾਨੀਟਰ ਦਾ ਰੰਗ", "ਅਗਲੀ ਹਦਾਇਤ ਦਾ ਪਤਾ", "ਕੀਬੋਰਡ ਲੇਆਉਟ"], explanation: "ਪ੍ਰੋਗਰਾਮ ਕਾਊਂਟਰ ਅਗਲੀ ਫੈਚ ਹੋਣ ਵਾਲੀ ਹਦਾਇਤ ਦਾ ਪਤਾ ਰੱਖਦਾ ਹੈ।" },
  },
  {
    id: "COM001-EXT-007", qlId: "COM-001-CP-007-QL-002", difficulty: "MEDIUM", correctIndex: 1, fact: "decode interprets the fetched instruction",
    en: { stem: "What happens during the decode step?", options: ["A document is printed", "The fetched instruction is interpreted", "The monitor is cleaned", "A cable is connected"], explanation: "During decode, the control unit interprets what the fetched instruction requires." },
    hi: { stem: "डिकोड चरण में क्या होता है?", options: ["दस्तावेज प्रिंट होता है", "फेच किए गए निर्देश का अर्थ समझा जाता है", "मॉनिटर साफ होता है", "केबल जुड़ती है"], explanation: "डिकोड चरण में कंट्रोल यूनिट फेच किए गए निर्देश का अर्थ समझती है।" },
    pa: { stem: "ਡਿਕੋਡ ਪੜਾਅ ਵਿੱਚ ਕੀ ਹੁੰਦਾ ਹੈ?", options: ["ਦਸਤਾਵੇਜ਼ ਪ੍ਰਿੰਟ ਹੁੰਦਾ ਹੈ", "ਫੈਚ ਕੀਤੀ ਹਦਾਇਤ ਦਾ ਅਰਥ ਸਮਝਿਆ ਜਾਂਦਾ ਹੈ", "ਮਾਨੀਟਰ ਸਾਫ਼ ਹੁੰਦਾ ਹੈ", "ਕੇਬਲ ਜੁੜਦੀ ਹੈ"], explanation: "ਡਿਕੋਡ ਪੜਾਅ ਵਿੱਚ ਕੰਟਰੋਲ ਯੂਨਿਟ ਫੈਚ ਕੀਤੀ ਹਦਾਇਤ ਦਾ ਅਰਥ ਸਮਝਦੀ ਹੈ।" },
  },
  {
    id: "COM001-EXT-008", qlId: "COM-001-CP-007-QL-002", difficulty: "MEDIUM", correctIndex: 3, fact: "execute performs the operation and store saves a result when needed",
    en: { stem: "Which order is correct after an instruction is fetched?", options: ["Store → decode → execute", "Execute → fetch → decode", "Decode → store → fetch", "Decode → execute → store"], explanation: "After fetch, the processor decodes and executes the instruction, then stores the result when needed." },
    hi: { stem: "निर्देश फेच होने के बाद सही क्रम कौन-सा है?", options: ["स्टोर → डिकोड → एक्जीक्यूट", "एक्जीक्यूट → फेच → डिकोड", "डिकोड → स्टोर → फेच", "डिकोड → एक्जीक्यूट → स्टोर"], explanation: "फेच के बाद प्रोसेसर निर्देश को डिकोड और एक्जीक्यूट करता है, फिर जरूरत होने पर परिणाम स्टोर करता है।" },
    pa: { stem: "ਹਦਾਇਤ ਫੈਚ ਹੋਣ ਤੋਂ ਬਾਅਦ ਸਹੀ ਕ੍ਰਮ ਕਿਹੜਾ ਹੈ?", options: ["ਸਟੋਰ → ਡਿਕੋਡ → ਐਗਜ਼ਿਕਿਊਟ", "ਐਗਜ਼ਿਕਿਊਟ → ਫੈਚ → ਡਿਕੋਡ", "ਡਿਕੋਡ → ਸਟੋਰ → ਫੈਚ", "ਡਿਕੋਡ → ਐਗਜ਼ਿਕਿਊਟ → ਸਟੋਰ"], explanation: "ਫੈਚ ਤੋਂ ਬਾਅਦ ਪ੍ਰੋਸੈਸਰ ਹਦਾਇਤ ਨੂੰ ਡਿਕੋਡ ਅਤੇ ਐਗਜ਼ਿਕਿਊਟ ਕਰਦਾ ਹੈ, ਫਿਰ ਲੋੜ ਹੋਵੇ ਤਾਂ ਨਤੀਜਾ ਸਟੋਰ ਕਰਦਾ ਹੈ।" },
  },
  {
    id: "COM001-EXT-009", qlId: "COM-001-CP-007-QL-003", difficulty: "EASY", correctIndex: 2, fact: "DMA means Direct Memory Access and transfers data between devices and memory without continuous CPU control",
    en: { stem: "What does DMA mean?", options: ["Data Monitor Area", "Digital Memory Address", "Direct Memory Access", "Device Machine Action"], explanation: "DMA means Direct Memory Access. It lets a device transfer data to memory with less continuous CPU control." },
    hi: { stem: "DMA का पूरा नाम क्या है?", options: ["Data Monitor Area", "Digital Memory Address", "Direct Memory Access", "Device Machine Action"], explanation: "DMA का पूरा नाम Direct Memory Access है। इससे डिवाइस लगातार CPU नियंत्रण के बिना मेमोरी में डेटा भेज सकता है।" },
    pa: { stem: "DMA ਦਾ ਪੂਰਾ ਨਾਮ ਕੀ ਹੈ?", options: ["Data Monitor Area", "Digital Memory Address", "Direct Memory Access", "Device Machine Action"], explanation: "DMA ਦਾ ਪੂਰਾ ਨਾਮ Direct Memory Access ਹੈ। ਇਸ ਨਾਲ ਡਿਵਾਈਸ ਲਗਾਤਾਰ CPU ਕੰਟਰੋਲ ਤੋਂ ਬਿਨਾਂ ਮੈਮੋਰੀ ਵਿੱਚ ਡਾਟਾ ਭੇਜ ਸਕਦੀ ਹੈ।" },
  },
  {
    id: "COM001-EXT-010", qlId: "COM-001-CP-007-QL-003", difficulty: "EASY", correctIndex: 0, fact: "UPS means Uninterruptible Power Supply and provides temporary backup power",
    en: { stem: "What is the purpose of a UPS?", options: ["To provide temporary backup power", "To translate a program", "To display a picture", "To store a password"], explanation: "UPS means Uninterruptible Power Supply. It provides temporary power when the main supply fails." },
    hi: { stem: "UPS का उद्देश्य क्या है?", options: ["थोड़ी देर के लिए बैकअप बिजली देना", "प्रोग्राम का अनुवाद करना", "चित्र दिखाना", "पासवर्ड रखना"], explanation: "UPS का पूरा नाम Uninterruptible Power Supply है। मुख्य बिजली जाने पर यह थोड़ी देर के लिए बैकअप बिजली देता है।" },
    pa: { stem: "UPS ਦਾ ਉਦੇਸ਼ ਕੀ ਹੈ?", options: ["ਥੋੜ੍ਹੇ ਸਮੇਂ ਲਈ ਬੈਕਅੱਪ ਬਿਜਲੀ ਦੇਣਾ", "ਪ੍ਰੋਗਰਾਮ ਦਾ ਅਨੁਵਾਦ ਕਰਨਾ", "ਤਸਵੀਰ ਦਿਖਾਉਣਾ", "ਪਾਸਵਰਡ ਰੱਖਣਾ"], explanation: "UPS ਦਾ ਪੂਰਾ ਨਾਮ Uninterruptible Power Supply ਹੈ। ਮੁੱਖ ਬਿਜਲੀ ਜਾਣ ਉੱਤੇ ਇਹ ਥੋੜ੍ਹੇ ਸਮੇਂ ਲਈ ਬੈਕਅੱਪ ਬਿਜਲੀ ਦਿੰਦਾ ਹੈ।" },
  },
  {
    id: "COM001-EXT-011", qlId: "COM-001-CP-007-QL-003", difficulty: "MEDIUM", correctIndex: 1, fact: "address bus carries addresses and data bus carries data",
    en: { stem: "Which bus carries the address of a memory location?", options: ["Data bus", "Address bus", "Control bus", "Power bus"], explanation: "The address bus carries the address of the memory location to be used." },
    hi: { stem: "मेमोरी स्थान का पता कौन-सी बस ले जाती है?", options: ["डेटा बस", "एड्रेस बस", "कंट्रोल बस", "पावर बस"], explanation: "एड्रेस बस उस मेमोरी स्थान का पता ले जाती है जिसका उपयोग होना है।" },
    pa: { stem: "ਮੈਮੋਰੀ ਸਥਾਨ ਦਾ ਪਤਾ ਕਿਹੜੀ ਬੱਸ ਲੈ ਕੇ ਜਾਂਦੀ ਹੈ?", options: ["ਡਾਟਾ ਬੱਸ", "ਐਡਰੈੱਸ ਬੱਸ", "ਕੰਟਰੋਲ ਬੱਸ", "ਪਾਵਰ ਬੱਸ"], explanation: "ਐਡਰੈੱਸ ਬੱਸ ਉਸ ਮੈਮੋਰੀ ਸਥਾਨ ਦਾ ਪਤਾ ਲੈ ਕੇ ਜਾਂਦੀ ਹੈ ਜਿਸ ਦੀ ਵਰਤੋਂ ਹੋਣੀ ਹੈ।" },
  },
  {
    id: "COM001-EXT-012", qlId: "COM-001-CP-007-QL-003", difficulty: "MEDIUM", correctIndex: 3, fact: "control bus carries control signals",
    en: { stem: "What does the control bus carry?", options: ["Pictures", "Only file names", "Printer ink", "Control signals"], explanation: "The control bus carries signals that control and coordinate computer operations." },
    hi: { stem: "कंट्रोल बस क्या ले जाती है?", options: ["चित्र", "केवल फाइल के नाम", "प्रिंटर की स्याही", "कंट्रोल सिग्नल"], explanation: "कंट्रोल बस कंप्यूटर के कार्यों को नियंत्रित और समन्वित करने वाले सिग्नल ले जाती है।" },
    pa: { stem: "ਕੰਟਰੋਲ ਬੱਸ ਕੀ ਲੈ ਕੇ ਜਾਂਦੀ ਹੈ?", options: ["ਤਸਵੀਰਾਂ", "ਸਿਰਫ਼ ਫਾਇਲਾਂ ਦੇ ਨਾਮ", "ਪ੍ਰਿੰਟਰ ਦੀ ਸਿਆਹੀ", "ਕੰਟਰੋਲ ਸਿਗਨਲ"], explanation: "ਕੰਟਰੋਲ ਬੱਸ ਕੰਪਿਊਟਰ ਦੇ ਕੰਮਾਂ ਨੂੰ ਕੰਟਰੋਲ ਅਤੇ ਮਿਲਾਉਣ ਵਾਲੇ ਸਿਗਨਲ ਲੈ ਕੇ ਜਾਂਦੀ ਹੈ।" },
  },
  {
    id: "COM001-EXT-013", qlId: "COM-001-CP-007-QL-004", difficulty: "EASY", correctIndex: 0, fact: "a touchscreen can perform both input and output",
    en: { stem: "Which device can work as both input and output?", options: ["Touchscreen", "Printer", "Speaker", "Plotter"], explanation: "A touchscreen shows output and also accepts touch input." },
    hi: { stem: "कौन-सा डिवाइस इनपुट और आउटपुट दोनों का काम कर सकता है?", options: ["टचस्क्रीन", "प्रिंटर", "स्पीकर", "प्लॉटर"], explanation: "टचस्क्रीन आउटपुट दिखाती है और टच के रूप में इनपुट भी लेती है।" },
    pa: { stem: "ਕਿਹੜੀ ਡਿਵਾਈਸ ਇਨਪੁਟ ਅਤੇ ਆਉਟਪੁਟ ਦੋਵੇਂ ਦਾ ਕੰਮ ਕਰ ਸਕਦੀ ਹੈ?", options: ["ਟੱਚਸਕਰੀਨ", "ਪ੍ਰਿੰਟਰ", "ਸਪੀਕਰ", "ਪਲੌਟਰ"], explanation: "ਟੱਚਸਕਰੀਨ ਆਉਟਪੁਟ ਦਿਖਾਉਂਦੀ ਹੈ ਅਤੇ ਟੱਚ ਰੂਪ ਵਿੱਚ ਇਨਪੁਟ ਵੀ ਲੈਂਦੀ ਹੈ।" },
  },
  {
    id: "COM001-EXT-014", qlId: "COM-001-CP-007-QL-004", difficulty: "EASY", correctIndex: 2, fact: "a monitor displays visual output",
    en: { stem: "Which device displays visual output?", options: ["Scanner", "Keyboard", "Monitor", "Microphone"], explanation: "A monitor displays visual output from the computer." },
    hi: { stem: "दृश्य आउटपुट कौन-सा डिवाइस दिखाता है?", options: ["स्कैनर", "कीबोर्ड", "मॉनिटर", "माइक्रोफोन"], explanation: "मॉनिटर कंप्यूटर का दृश्य आउटपुट दिखाता है।" },
    pa: { stem: "ਦ੍ਰਿਸ਼ ਆਉਟਪੁਟ ਕਿਹੜੀ ਡਿਵਾਈਸ ਦਿਖਾਉਂਦੀ ਹੈ?", options: ["ਸਕੈਨਰ", "ਕੀਬੋਰਡ", "ਮਾਨੀਟਰ", "ਮਾਈਕ੍ਰੋਫੋਨ"], explanation: "ਮਾਨੀਟਰ ਕੰਪਿਊਟਰ ਦਾ ਦ੍ਰਿਸ਼ ਆਉਟਪੁਟ ਦਿਖਾਉਂਦਾ ਹੈ।" },
  },
  {
    id: "COM001-EXT-015", qlId: "COM-001-CP-007-QL-004", difficulty: "MEDIUM", correctIndex: 1, fact: "impact printers strike an inked ribbon while non-impact printers do not strike the paper",
    en: { stem: "Which printer type strikes an inked ribbon against paper?", options: ["Non-impact printer", "Impact printer", "Laser display", "Plotter screen"], explanation: "An impact printer strikes an inked ribbon against paper. A non-impact printer does not use this striking action." },
    hi: { stem: "कौन-सा प्रिंटर इंक रिबन पर प्रहार करके कागज पर छापता है?", options: ["नॉन-इम्पैक्ट प्रिंटर", "इम्पैक्ट प्रिंटर", "लेजर डिस्प्ले", "प्लॉटर स्क्रीन"], explanation: "इम्पैक्ट प्रिंटर इंक रिबन पर प्रहार करके कागज पर छापता है। नॉन-इम्पैक्ट प्रिंटर ऐसा प्रहार नहीं करता।" },
    pa: { stem: "ਕਿਹੜਾ ਪ੍ਰਿੰਟਰ ਇੰਕ ਰਿਬਨ ਉੱਤੇ ਵੱਜ ਕੇ ਕਾਗਜ਼ ਉੱਤੇ ਛਾਪਦਾ ਹੈ?", options: ["ਨਾਨ-ਇੰਪੈਕਟ ਪ੍ਰਿੰਟਰ", "ਇੰਪੈਕਟ ਪ੍ਰਿੰਟਰ", "ਲੇਜ਼ਰ ਡਿਸਪਲੇ", "ਪਲੌਟਰ ਸਕਰੀਨ"], explanation: "ਇੰਪੈਕਟ ਪ੍ਰਿੰਟਰ ਇੰਕ ਰਿਬਨ ਉੱਤੇ ਵੱਜ ਕੇ ਕਾਗਜ਼ ਉੱਤੇ ਛਾਪਦਾ ਹੈ। ਨਾਨ-ਇੰਪੈਕਟ ਪ੍ਰਿੰਟਰ ਇਸ ਤਰ੍ਹਾਂ ਨਹੀਂ ਵੱਜਦਾ।" },
  },
  {
    id: "COM001-EXT-016", qlId: "COM-001-CP-007-QL-004", difficulty: "MEDIUM", correctIndex: 3, fact: "monitor size is measured diagonally",
    en: { stem: "How is monitor screen size usually measured?", options: ["Across the keyboard", "By cable length", "By speaker weight", "Diagonally across the screen"], explanation: "Monitor size is usually measured diagonally from one corner of the screen to the opposite corner." },
    hi: { stem: "मॉनिटर स्क्रीन का आकार सामान्यतः कैसे मापा जाता है?", options: ["कीबोर्ड के आर-पार", "केबल की लंबाई से", "स्पीकर के वजन से", "स्क्रीन के एक कोने से विपरीत कोने तक तिरछे"], explanation: "मॉनिटर का आकार सामान्यतः स्क्रीन के एक कोने से विपरीत कोने तक तिरछे मापा जाता है।" },
    pa: { stem: "ਮਾਨੀਟਰ ਸਕਰੀਨ ਦਾ ਆਕਾਰ ਆਮ ਤੌਰ ਉੱਤੇ ਕਿਵੇਂ ਮਾਪਿਆ ਜਾਂਦਾ ਹੈ?", options: ["ਕੀਬੋਰਡ ਦੇ ਪਾਰ", "ਕੇਬਲ ਦੀ ਲੰਬਾਈ ਨਾਲ", "ਸਪੀਕਰ ਦੇ ਭਾਰ ਨਾਲ", "ਸਕਰੀਨ ਦੇ ਇੱਕ ਕੋਨੇ ਤੋਂ ਦੂਜੇ ਕੋਨੇ ਤੱਕ ਤਿਰਛਾ"], explanation: "ਮਾਨੀਟਰ ਦਾ ਆਕਾਰ ਆਮ ਤੌਰ ਉੱਤੇ ਸਕਰੀਨ ਦੇ ਇੱਕ ਕੋਨੇ ਤੋਂ ਦੂਜੇ ਕੋਨੇ ਤੱਕ ਤਿਰਛਾ ਮਾਪਿਆ ਜਾਂਦਾ ਹੈ।" },
  },
];

function build(source: Source, language: "en" | "hi" | "pa"): Com001HardwareExtensionQuestion {
  const copy = source[language];
  return Object.freeze({
    questionId: `${source.id}-${language.toUpperCase()}`,
    sourceQuestionId: source.id,
    cpId: "COM-001-CP-007" as const,
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
    sourceEnglishAuthorityId: COM001_HARDWARE_GAP_EXTENSION_AUTHORITY_V1.authorityId,
    sourceEnglishFrozen: true,
    sourceLocalizationFrozen: true,
  });
}

export const COM001_HARDWARE_GAP_EXTENSION_ENGLISH: readonly Com001HardwareExtensionQuestion[] = Object.freeze(S.map((source) => build(source, "en")));
export const COM001_HARDWARE_GAP_EXTENSION_HINDI: readonly Com001HardwareExtensionQuestion[] = Object.freeze(S.map((source) => build(source, "hi")));
export const COM001_HARDWARE_GAP_EXTENSION_PUNJABI: readonly Com001HardwareExtensionQuestion[] = Object.freeze(S.map((source) => build(source, "pa")));

export function auditCom001HardwareGapExtensionV1() {
  const issues: string[] = [];
  const all = [...COM001_HARDWARE_GAP_EXTENSION_ENGLISH, ...COM001_HARDWARE_GAP_EXTENSION_HINDI, ...COM001_HARDWARE_GAP_EXTENSION_PUNJABI];
  if (S.length !== COM001_HARDWARE_GAP_EXTENSION_AUTHORITY_V1.questionCountPerLanguage) issues.push("QUESTION_COUNT_MISMATCH");
  if (new Set(S.map((q) => q.qlId)).size !== COM001_HARDWARE_GAP_EXTENSION_AUTHORITY_V1.permanentQlIds.length) issues.push("QL_COUNT_MISMATCH");
  for (const q of all) {
    if (q.options.length !== 4 || q.correctIndex < 0 || q.correctIndex > 3) issues.push(`INVALID_OPTIONS:${q.questionId}`);
    if (!q.explanation.trim() || q.explanation.split(/[.!?।॥]+/).filter(Boolean).length > 2) issues.push(`BAD_EXPLANATION:${q.questionId}`);
    if (/^consider the following|^in the following|associated|association/i.test(q.stem + " " + q.explanation)) issues.push(`EDITORIAL_WORDING:${q.questionId}`);
  }
  if (new Set(all.map((q) => q.questionId)).size !== all.length) issues.push("DUPLICATE_QUESTION_ID");
  return { valid: issues.length === 0, issues, counts: { en: COM001_HARDWARE_GAP_EXTENSION_ENGLISH.length, hi: COM001_HARDWARE_GAP_EXTENSION_HINDI.length, pa: COM001_HARDWARE_GAP_EXTENSION_PUNJABI.length } };
}
