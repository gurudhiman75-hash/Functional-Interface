import { createHash } from "node:crypto";

export type Com001CompletionLanguage = "en" | "hi" | "pa";
export type Com001CompletionDifficulty = "EASY" | "MEDIUM";

type Copy = { stem: string; options: readonly string[]; explanation: string };
type Source = {
  cpId: "COM-001-CP-002" | "COM-001-CP-003" | "COM-001-CP-004" | "COM-001-CP-005";
  qlId: string;
  difficulty: Com001CompletionDifficulty;
  correctIndex: number;
  sourceFactIds: readonly string[];
  en: Copy;
  hi: Copy;
  pa: Copy;
};

export type Com001CompletionQuestion = Copy & {
  questionId: string;
  sourceQuestionId: string;
  cpId: Source["cpId"];
  qlId: string;
  language: Com001CompletionLanguage;
  locale: "en-IN" | "hi-IN" | "pa-IN";
  difficulty: Com001CompletionDifficulty;
  correctIndex: number;
  canonicalAnswer: string;
  sourceFactIds: readonly string[];
  sourceEnglishAuthorityId: string;
  sourceEnglishFrozen: true;
  sourceLocalizationFrozen: true;
};

const IBM_CPU = "https://www.ibm.com/docs/en/zos-basic-skills?topic=glossary-zos-terms-abbreviations";
const USB = "https://www.usb.org/documents";
const MICROSOFT_DOCK = "https://learn.microsoft.com/en-us/windows-hardware/design/device-experiences/docking";

const S: readonly Source[] = [
  {
    cpId: "COM-001-CP-002", qlId: "COM-001-CP-002-QL-001", difficulty: "EASY", correctIndex: 0, sourceFactIds: [IBM_CPU],
    en: { stem: "Which unit enters data into a computer?", options: ["Input unit", "Output unit", "Storage unit", "Power unit"], explanation: "The input unit sends data and instructions to the computer." },
    hi: { stem: "कंप्यूटर में डेटा कौन-सी इकाई डालती है?", options: ["इनपुट इकाई", "आउटपुट इकाई", "स्टोरेज इकाई", "पावर इकाई"], explanation: "इनपुट इकाई कंप्यूटर को डेटा और निर्देश भेजती है।" },
    pa: { stem: "ਕੰਪਿਊਟਰ ਵਿੱਚ ਡਾਟਾ ਕਿਹੜੀ ਇਕਾਈ ਪਾਉਂਦੀ ਹੈ?", options: ["ਇਨਪੁਟ ਇਕਾਈ", "ਆਉਟਪੁਟ ਇਕਾਈ", "ਸਟੋਰੇਜ ਇਕਾਈ", "ਪਾਵਰ ਇਕਾਈ"], explanation: "ਇਨਪੁਟ ਇਕਾਈ ਕੰਪਿਊਟਰ ਨੂੰ ਡਾਟਾ ਅਤੇ ਹਦਾਇਤਾਂ ਭੇਜਦੀ ਹੈ।" },
  },
  {
    cpId: "COM-001-CP-002", qlId: "COM-001-CP-002-QL-001", difficulty: "MEDIUM", correctIndex: 1, sourceFactIds: [IBM_CPU],
    en: { stem: "Which order shows basic computer processing?", options: ["Output → input → processing", "Input → processing → output", "Processing → storage → input", "Storage → output → input"], explanation: "A computer receives input, processes it and gives output." },
    hi: { stem: "कंप्यूटर प्रोसेसिंग का सही क्रम कौन-सा है?", options: ["आउटपुट → इनपुट → प्रोसेसिंग", "इनपुट → प्रोसेसिंग → आउटपुट", "प्रोसेसिंग → स्टोरेज → इनपुट", "स्टोरेज → आउटपुट → इनपुट"], explanation: "कंप्यूटर इनपुट लेता है, उसे प्रोसेस करता है और आउटपुट देता है।" },
    pa: { stem: "ਕੰਪਿਊਟਰ ਪ੍ਰੋਸੈਸਿੰਗ ਦਾ ਸਹੀ ਕ੍ਰਮ ਕਿਹੜਾ ਹੈ?", options: ["ਆਉਟਪੁਟ → ਇਨਪੁਟ → ਪ੍ਰੋਸੈਸਿੰਗ", "ਇਨਪੁਟ → ਪ੍ਰੋਸੈਸਿੰਗ → ਆਉਟਪੁਟ", "ਪ੍ਰੋਸੈਸਿੰਗ → ਸਟੋਰੇਜ → ਇਨਪੁਟ", "ਸਟੋਰੇਜ → ਆਉਟਪੁਟ → ਇਨਪੁਟ"], explanation: "ਕੰਪਿਊਟਰ ਇਨਪੁਟ ਲੈਂਦਾ ਹੈ, ਉਸ ਨੂੰ ਪ੍ਰੋਸੈਸ ਕਰਦਾ ਹੈ ਅਤੇ ਆਉਟਪੁਟ ਦਿੰਦਾ ਹੈ।" },
  },
  {
    cpId: "COM-001-CP-002", qlId: "COM-001-CP-002-QL-002", difficulty: "EASY", correctIndex: 2, sourceFactIds: [IBM_CPU],
    en: { stem: "Which part is called the brain of a computer?", options: ["Keyboard", "Monitor", "CPU", "Printer"], explanation: "CPU means Central Processing Unit. It processes instructions and controls computer work." },
    hi: { stem: "कंप्यूटर का मस्तिष्क किस भाग को कहा जाता है?", options: ["कीबोर्ड", "मॉनिटर", "CPU", "प्रिंटर"], explanation: "CPU का पूरा नाम Central Processing Unit है। यह निर्देशों को प्रोसेस करता है और कंप्यूटर के काम को नियंत्रित करता है।" },
    pa: { stem: "ਕੰਪਿਊਟਰ ਦਾ ਦਿਮਾਗ ਕਿਸ ਭਾਗ ਨੂੰ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?", options: ["ਕੀਬੋਰਡ", "ਮਾਨੀਟਰ", "CPU", "ਪ੍ਰਿੰਟਰ"], explanation: "CPU ਦਾ ਪੂਰਾ ਨਾਮ Central Processing Unit ਹੈ। ਇਹ ਹਦਾਇਤਾਂ ਨੂੰ ਪ੍ਰੋਸੈਸ ਕਰਦਾ ਅਤੇ ਕੰਪਿਊਟਰ ਦੇ ਕੰਮ ਨੂੰ ਕੰਟਰੋਲ ਕਰਦਾ ਹੈ।" },
  },
  {
    cpId: "COM-001-CP-002", qlId: "COM-001-CP-002-QL-002", difficulty: "MEDIUM", correctIndex: 3, sourceFactIds: [IBM_CPU],
    en: { stem: "What does the CPU mainly do?", options: ["Prints documents", "Scans photos", "Shows images only", "Processes instructions"], explanation: "CPU means Central Processing Unit. Its main work is to process instructions." },
    hi: { stem: "CPU मुख्य रूप से क्या करता है?", options: ["दस्तावेज प्रिंट करता है", "फोटो स्कैन करता है", "केवल चित्र दिखाता है", "निर्देशों को प्रोसेस करता है"], explanation: "CPU का पूरा नाम Central Processing Unit है। इसका मुख्य काम निर्देशों को प्रोसेस करना है।" },
    pa: { stem: "CPU ਮੁੱਖ ਤੌਰ ਉੱਤੇ ਕੀ ਕਰਦਾ ਹੈ?", options: ["ਦਸਤਾਵੇਜ਼ ਪ੍ਰਿੰਟ ਕਰਦਾ ਹੈ", "ਫੋਟੋ ਸਕੈਨ ਕਰਦਾ ਹੈ", "ਸਿਰਫ਼ ਤਸਵੀਰਾਂ ਦਿਖਾਉਂਦਾ ਹੈ", "ਹਦਾਇਤਾਂ ਨੂੰ ਪ੍ਰੋਸੈਸ ਕਰਦਾ ਹੈ"], explanation: "CPU ਦਾ ਪੂਰਾ ਨਾਮ Central Processing Unit ਹੈ। ਇਸ ਦਾ ਮੁੱਖ ਕੰਮ ਹਦਾਇਤਾਂ ਨੂੰ ਪ੍ਰੋਸੈਸ ਕਰਨਾ ਹੈ।" },
  },
  {
    cpId: "COM-001-CP-002", qlId: "COM-001-CP-002-QL-003", difficulty: "EASY", correctIndex: 0, sourceFactIds: [IBM_CPU],
    en: { stem: "Which CPU part performs calculations?", options: ["ALU", "Scanner", "Speaker", "Mouse"], explanation: "ALU means Arithmetic Logic Unit. It performs arithmetic and logical operations." },
    hi: { stem: "CPU का कौन-सा भाग गणना करता है?", options: ["ALU", "स्कैनर", "स्पीकर", "माउस"], explanation: "ALU का पूरा नाम Arithmetic Logic Unit है। यह गणितीय और तार्किक कार्य करता है।" },
    pa: { stem: "CPU ਦਾ ਕਿਹੜਾ ਭਾਗ ਗਣਨਾ ਕਰਦਾ ਹੈ?", options: ["ALU", "ਸਕੈਨਰ", "ਸਪੀਕਰ", "ਮਾਊਸ"], explanation: "ALU ਦਾ ਪੂਰਾ ਨਾਮ Arithmetic Logic Unit ਹੈ। ਇਹ ਗਣਿਤ ਅਤੇ ਤਰਕ ਵਾਲੇ ਕੰਮ ਕਰਦਾ ਹੈ।" },
  },
  {
    cpId: "COM-001-CP-002", qlId: "COM-001-CP-002-QL-003", difficulty: "MEDIUM", correctIndex: 1, sourceFactIds: [IBM_CPU],
    en: { stem: "Which CPU part compares two values?", options: ["Control unit", "ALU", "Printer", "Hard disk"], explanation: "ALU means Arithmetic Logic Unit. It performs comparisons and logical operations." },
    hi: { stem: "CPU का कौन-सा भाग दो मानों की तुलना करता है?", options: ["कंट्रोल यूनिट", "ALU", "प्रिंटर", "हार्ड डिस्क"], explanation: "ALU का पूरा नाम Arithmetic Logic Unit है। यह तुलना और तार्किक कार्य करता है।" },
    pa: { stem: "CPU ਦਾ ਕਿਹੜਾ ਭਾਗ ਦੋ ਮੁੱਲਾਂ ਦੀ ਤੁਲਨਾ ਕਰਦਾ ਹੈ?", options: ["ਕੰਟਰੋਲ ਯੂਨਿਟ", "ALU", "ਪ੍ਰਿੰਟਰ", "ਹਾਰਡ ਡਿਸਕ"], explanation: "ALU ਦਾ ਪੂਰਾ ਨਾਮ Arithmetic Logic Unit ਹੈ। ਇਹ ਤੁਲਨਾ ਅਤੇ ਤਰਕ ਵਾਲੇ ਕੰਮ ਕਰਦਾ ਹੈ।" },
  },
  {
    cpId: "COM-001-CP-002", qlId: "COM-001-CP-002-QL-004", difficulty: "EASY", correctIndex: 2, sourceFactIds: [IBM_CPU],
    en: { stem: "Which CPU part directs other units?", options: ["Plotter", "Microphone", "Control unit", "Webcam"], explanation: "The control unit directs and coordinates computer operations." },
    hi: { stem: "CPU का कौन-सा भाग दूसरी इकाइयों को निर्देश देता है?", options: ["प्लॉटर", "माइक्रोफोन", "कंट्रोल यूनिट", "वेबकैम"], explanation: "कंट्रोल यूनिट कंप्यूटर के कार्यों को निर्देशित और नियंत्रित करती है।" },
    pa: { stem: "CPU ਦਾ ਕਿਹੜਾ ਭਾਗ ਹੋਰ ਇਕਾਈਆਂ ਨੂੰ ਹਦਾਇਤ ਦਿੰਦਾ ਹੈ?", options: ["ਪਲਾਟਰ", "ਮਾਈਕ੍ਰੋਫੋਨ", "ਕੰਟਰੋਲ ਯੂਨਿਟ", "ਵੈੱਬਕੈਮ"], explanation: "ਕੰਟਰੋਲ ਯੂਨਿਟ ਕੰਪਿਊਟਰ ਦੇ ਕੰਮਾਂ ਨੂੰ ਹਦਾਇਤ ਅਤੇ ਕੰਟਰੋਲ ਦਿੰਦੀ ਹੈ।" },
  },
  {
    cpId: "COM-001-CP-002", qlId: "COM-001-CP-002-QL-004", difficulty: "MEDIUM", correctIndex: 3, sourceFactIds: [IBM_CPU],
    en: { stem: "Where does the CPU keep a value needed immediately?", options: ["Printer tray", "Optical disc", "External speaker", "Register"], explanation: "A register is very small, fast storage inside the CPU." },
    hi: { stem: "CPU तुरंत चाहिए मान को कहाँ रखता है?", options: ["प्रिंटर ट्रे", "ऑप्टिकल डिस्क", "बाहरी स्पीकर", "रजिस्टर"], explanation: "रजिस्टर CPU के अंदर बहुत छोटी और तेज स्टोरेज होती है। CPU का पूरा नाम Central Processing Unit है।" },
    pa: { stem: "CPU ਤੁਰੰਤ ਚਾਹੀਦਾ ਮੁੱਲ ਕਿੱਥੇ ਰੱਖਦਾ ਹੈ?", options: ["ਪ੍ਰਿੰਟਰ ਟਰੇ", "ਆਪਟੀਕਲ ਡਿਸਕ", "ਬਾਹਰੀ ਸਪੀਕਰ", "ਰਜਿਸਟਰ"], explanation: "ਰਜਿਸਟਰ CPU ਦੇ ਅੰਦਰ ਬਹੁਤ ਛੋਟੀ ਅਤੇ ਤੇਜ਼ ਸਟੋਰੇਜ ਹੁੰਦੀ ਹੈ। CPU ਦਾ ਪੂਰਾ ਨਾਮ Central Processing Unit ਹੈ।" },
  },

  {
    cpId: "COM-001-CP-003", qlId: "COM-001-CP-003-QL-001", difficulty: "EASY", correctIndex: 0, sourceFactIds: [IBM_CPU],
    en: { stem: "Which device is mainly used to type text?", options: ["Keyboard", "Monitor", "Speaker", "Projector"], explanation: "A keyboard enters letters, numbers and commands." },
    hi: { stem: "टेक्स्ट टाइप करने के लिए मुख्य रूप से कौन-सा उपकरण इस्तेमाल होता है?", options: ["कीबोर्ड", "मॉनिटर", "स्पीकर", "प्रोजेक्टर"], explanation: "कीबोर्ड से अक्षर, संख्याएँ और कमांड डाले जाते हैं।" },
    pa: { stem: "ਟੈਕਸਟ ਟਾਈਪ ਕਰਨ ਲਈ ਮੁੱਖ ਤੌਰ ਉੱਤੇ ਕਿਹੜਾ ਉਪਕਰਣ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?", options: ["ਕੀਬੋਰਡ", "ਮਾਨੀਟਰ", "ਸਪੀਕਰ", "ਪ੍ਰੋਜੈਕਟਰ"], explanation: "ਕੀਬੋਰਡ ਨਾਲ ਅੱਖਰ, ਅੰਕ ਅਤੇ ਕਮਾਂਡ ਪਾਈਆਂ ਜਾਂਦੀਆਂ ਹਨ।" },
  },
  {
    cpId: "COM-001-CP-003", qlId: "COM-001-CP-003-QL-001", difficulty: "MEDIUM", correctIndex: 1, sourceFactIds: [IBM_CPU],
    en: { stem: "Which device moves the pointer on a screen?", options: ["Printer", "Mouse", "Scanner", "Speaker"], explanation: "A mouse controls the pointer and selects items on the screen." },
    hi: { stem: "स्क्रीन पर पॉइंटर कौन-सा उपकरण चलाता है?", options: ["प्रिंटर", "माउस", "स्कैनर", "स्पीकर"], explanation: "माउस पॉइंटर को चलाता है और स्क्रीन पर वस्तुएँ चुनता है।" },
    pa: { stem: "ਸਕਰੀਨ ਉੱਤੇ ਪੁਆਇੰਟਰ ਕਿਹੜਾ ਉਪਕਰਣ ਚਲਾਉਂਦਾ ਹੈ?", options: ["ਪ੍ਰਿੰਟਰ", "ਮਾਊਸ", "ਸਕੈਨਰ", "ਸਪੀਕਰ"], explanation: "ਮਾਊਸ ਪੁਆਇੰਟਰ ਚਲਾਉਂਦਾ ਅਤੇ ਸਕਰੀਨ ਉੱਤੇ ਚੀਜ਼ਾਂ ਚੁਣਦਾ ਹੈ।" },
  },
  {
    cpId: "COM-001-CP-003", qlId: "COM-001-CP-003-QL-002", difficulty: "EASY", correctIndex: 2, sourceFactIds: [IBM_CPU],
    en: { stem: "Which device converts a paper photo into digital form?", options: ["Plotter", "Projector", "Scanner", "Speaker"], explanation: "A scanner captures a paper document or photo as digital data." },
    hi: { stem: "कागज की फोटो को डिजिटल रूप में कौन-सा उपकरण बदलता है?", options: ["प्लॉटर", "प्रोजेक्टर", "स्कैनर", "स्पीकर"], explanation: "स्कैनर कागज के दस्तावेज या फोटो को डिजिटल डेटा के रूप में लेता है।" },
    pa: { stem: "ਕਾਗਜ਼ ਦੀ ਫੋਟੋ ਨੂੰ ਡਿਜ਼ਿਟਲ ਰੂਪ ਵਿੱਚ ਕਿਹੜਾ ਉਪਕਰਣ ਬਦਲਦਾ ਹੈ?", options: ["ਪਲਾਟਰ", "ਪ੍ਰੋਜੈਕਟਰ", "ਸਕੈਨਰ", "ਸਪੀਕਰ"], explanation: "ਸਕੈਨਰ ਕਾਗਜ਼ੀ ਦਸਤਾਵੇਜ਼ ਜਾਂ ਫੋਟੋ ਨੂੰ ਡਿਜ਼ਿਟਲ ਡਾਟਾ ਵਜੋਂ ਲੈਂਦਾ ਹੈ।" },
  },
  {
    cpId: "COM-001-CP-003", qlId: "COM-001-CP-003-QL-002", difficulty: "MEDIUM", correctIndex: 3, sourceFactIds: [IBM_CPU],
    en: { stem: "Which technology converts printed text into editable text?", options: ["OMR", "MICR", "USB", "OCR"], explanation: "OCR means Optical Character Recognition. It converts printed or scanned text into machine-readable text." },
    hi: { stem: "प्रिंटेड टेक्स्ट को संपादन योग्य टेक्स्ट में कौन-सी तकनीक बदलती है?", options: ["OMR", "MICR", "USB", "OCR"], explanation: "OCR का पूरा नाम Optical Character Recognition है। यह प्रिंटेड या स्कैन किए टेक्स्ट को मशीन द्वारा पढ़े जाने वाले टेक्स्ट में बदलता है।" },
    pa: { stem: "ਛਪੇ ਟੈਕਸਟ ਨੂੰ ਸੋਧਣ ਯੋਗ ਟੈਕਸਟ ਵਿੱਚ ਕਿਹੜੀ ਤਕਨੀਕ ਬਦਲਦੀ ਹੈ?", options: ["OMR", "MICR", "USB", "OCR"], explanation: "OCR ਦਾ ਪੂਰਾ ਨਾਮ Optical Character Recognition ਹੈ। ਇਹ ਛਪੇ ਜਾਂ ਸਕੈਨ ਕੀਤੇ ਟੈਕਸਟ ਨੂੰ ਮਸ਼ੀਨ ਵੱਲੋਂ ਪੜ੍ਹਨ ਯੋਗ ਟੈਕਸਟ ਬਣਾਉਂਦਾ ਹੈ।" },
  },
  {
    cpId: "COM-001-CP-003", qlId: "COM-001-CP-003-QL-003", difficulty: "EASY", correctIndex: 0, sourceFactIds: [IBM_CPU],
    en: { stem: "Which technology reads shaded answer bubbles?", options: ["OMR", "OCR", "MICR", "QR"], explanation: "OMR means Optical Mark Recognition. It reads marked areas such as answer-sheet bubbles." },
    hi: { stem: "उत्तर पत्रक के भरे गोले कौन-सी तकनीक पढ़ती है?", options: ["OMR", "OCR", "MICR", "QR"], explanation: "OMR का पूरा नाम Optical Mark Recognition है। यह उत्तर पत्रक के भरे हुए गोले पढ़ती है।" },
    pa: { stem: "ਉੱਤਰ ਪੱਤਰੀ ਦੇ ਭਰੇ ਗੋਲੇ ਕਿਹੜੀ ਤਕਨੀਕ ਪੜ੍ਹਦੀ ਹੈ?", options: ["OMR", "OCR", "MICR", "QR"], explanation: "OMR ਦਾ ਪੂਰਾ ਨਾਮ Optical Mark Recognition ਹੈ। ਇਹ ਉੱਤਰ ਪੱਤਰੀ ਦੇ ਭਰੇ ਹੋਏ ਗੋਲੇ ਪੜ੍ਹਦੀ ਹੈ।" },
  },
  {
    cpId: "COM-001-CP-003", qlId: "COM-001-CP-003-QL-003", difficulty: "MEDIUM", correctIndex: 1, sourceFactIds: [IBM_CPU],
    en: { stem: "Which technology reads characters printed with magnetic ink on cheques?", options: ["OCR", "MICR", "OMR", "QR"], explanation: "MICR means Magnetic Ink Character Recognition. Banks use it to read magnetic-ink characters on cheques." },
    hi: { stem: "चेक पर चुंबकीय स्याही से छपे अक्षर कौन-सी तकनीक पढ़ती है?", options: ["OCR", "MICR", "OMR", "QR"], explanation: "MICR का पूरा नाम Magnetic Ink Character Recognition है। बैंक इससे चेक पर चुंबकीय स्याही वाले अक्षर पढ़ते हैं।" },
    pa: { stem: "ਚੈੱਕ ਉੱਤੇ ਚੁੰਬਕੀ ਸਿਆਹੀ ਨਾਲ ਛਪੇ ਅੱਖਰ ਕਿਹੜੀ ਤਕਨੀਕ ਪੜ੍ਹਦੀ ਹੈ?", options: ["OCR", "MICR", "OMR", "QR"], explanation: "MICR ਦਾ ਪੂਰਾ ਨਾਮ Magnetic Ink Character Recognition ਹੈ। ਬੈਂਕ ਇਸ ਨਾਲ ਚੈੱਕ ਉੱਤੇ ਚੁੰਬਕੀ ਸਿਆਹੀ ਵਾਲੇ ਅੱਖਰ ਪੜ੍ਹਦੇ ਹਨ।" },
  },
  {
    cpId: "COM-001-CP-003", qlId: "COM-001-CP-003-QL-004", difficulty: "EASY", correctIndex: 2, sourceFactIds: [IBM_CPU],
    en: { stem: "Which device enters sound into a computer?", options: ["Monitor", "Printer", "Microphone", "Projector"], explanation: "A microphone changes sound into input for a computer." },
    hi: { stem: "कंप्यूटर में आवाज कौन-सा उपकरण डालता है?", options: ["मॉनिटर", "प्रिंटर", "माइक्रोफोन", "प्रोजेक्टर"], explanation: "माइक्रोफोन आवाज को कंप्यूटर के इनपुट में बदलता है।" },
    pa: { stem: "ਕੰਪਿਊਟਰ ਵਿੱਚ ਆਵਾਜ਼ ਕਿਹੜਾ ਉਪਕਰਣ ਪਾਉਂਦਾ ਹੈ?", options: ["ਮਾਨੀਟਰ", "ਪ੍ਰਿੰਟਰ", "ਮਾਈਕ੍ਰੋਫੋਨ", "ਪ੍ਰੋਜੈਕਟਰ"], explanation: "ਮਾਈਕ੍ਰੋਫੋਨ ਆਵਾਜ਼ ਨੂੰ ਕੰਪਿਊਟਰ ਇਨਪੁਟ ਵਿੱਚ ਬਦਲਦਾ ਹੈ।" },
  },
  {
    cpId: "COM-001-CP-003", qlId: "COM-001-CP-003-QL-004", difficulty: "MEDIUM", correctIndex: 3, sourceFactIds: [IBM_CPU],
    en: { stem: "Which device can scan a QR code?", options: ["Speaker", "Printer", "Plotter", "Camera"], explanation: "A camera can capture a QR code for software to read. QR means Quick Response." },
    hi: { stem: "QR कोड को कौन-सा उपकरण स्कैन कर सकता है?", options: ["स्पीकर", "प्रिंटर", "प्लॉटर", "कैमरा"], explanation: "कैमरा QR कोड की तस्वीर लेता है ताकि सॉफ्टवेयर उसे पढ़ सके। QR का पूरा नाम Quick Response है।" },
    pa: { stem: "QR ਕੋਡ ਨੂੰ ਕਿਹੜਾ ਉਪਕਰਣ ਸਕੈਨ ਕਰ ਸਕਦਾ ਹੈ?", options: ["ਸਪੀਕਰ", "ਪ੍ਰਿੰਟਰ", "ਪਲਾਟਰ", "ਕੈਮਰਾ"], explanation: "ਕੈਮਰਾ QR ਕੋਡ ਦੀ ਤਸਵੀਰ ਲੈਂਦਾ ਹੈ ਤਾਂ ਜੋ ਸਾਫਟਵੇਅਰ ਉਸ ਨੂੰ ਪੜ੍ਹ ਸਕੇ। QR ਦਾ ਪੂਰਾ ਨਾਮ Quick Response ਹੈ।" },
  },

  {
    cpId: "COM-001-CP-004", qlId: "COM-001-CP-004-QL-001", difficulty: "EASY", correctIndex: 0, sourceFactIds: [MICROSOFT_DOCK],
    en: { stem: "Which device shows visual output?", options: ["Monitor", "Keyboard", "Mouse", "Scanner"], explanation: "A monitor displays text, pictures and video." },
    hi: { stem: "दृश्य आउटपुट कौन-सा उपकरण दिखाता है?", options: ["मॉनिटर", "कीबोर्ड", "माउस", "स्कैनर"], explanation: "मॉनिटर टेक्स्ट, चित्र और वीडियो दिखाता है।" },
    pa: { stem: "ਦ੍ਰਿਸ਼ ਆਉਟਪੁਟ ਕਿਹੜਾ ਉਪਕਰਣ ਦਿਖਾਉਂਦਾ ਹੈ?", options: ["ਮਾਨੀਟਰ", "ਕੀਬੋਰਡ", "ਮਾਊਸ", "ਸਕੈਨਰ"], explanation: "ਮਾਨੀਟਰ ਟੈਕਸਟ, ਤਸਵੀਰਾਂ ਅਤੇ ਵੀਡੀਓ ਦਿਖਾਉਂਦਾ ਹੈ।" },
  },
  {
    cpId: "COM-001-CP-004", qlId: "COM-001-CP-004-QL-001", difficulty: "MEDIUM", correctIndex: 1, sourceFactIds: [MICROSOFT_DOCK],
    en: { stem: "What does screen resolution describe?", options: ["Speaker volume", "Number of pixels", "Printer speed", "Keyboard size"], explanation: "Screen resolution states how many pixels form the displayed image." },
    hi: { stem: "स्क्रीन रेजोल्यूशन क्या बताता है?", options: ["स्पीकर की आवाज", "पिक्सल की संख्या", "प्रिंटर की गति", "कीबोर्ड का आकार"], explanation: "स्क्रीन रेजोल्यूशन बताता है कि दिखाई गई तस्वीर कितने पिक्सल से बनी है।" },
    pa: { stem: "ਸਕਰੀਨ ਰੈਜ਼ੋਲੂਸ਼ਨ ਕੀ ਦੱਸਦਾ ਹੈ?", options: ["ਸਪੀਕਰ ਦੀ ਆਵਾਜ਼", "ਪਿਕਸਲਾਂ ਦੀ ਗਿਣਤੀ", "ਪ੍ਰਿੰਟਰ ਦੀ ਗਤੀ", "ਕੀਬੋਰਡ ਦਾ ਆਕਾਰ"], explanation: "ਸਕਰੀਨ ਰੈਜ਼ੋਲੂਸ਼ਨ ਦੱਸਦਾ ਹੈ ਕਿ ਦਿਖਾਈ ਤਸਵੀਰ ਕਿੰਨੇ ਪਿਕਸਲਾਂ ਨਾਲ ਬਣੀ ਹੈ।" },
  },
  {
    cpId: "COM-001-CP-004", qlId: "COM-001-CP-004-QL-002", difficulty: "EASY", correctIndex: 2, sourceFactIds: [IBM_CPU],
    en: { stem: "Which device gives output on paper?", options: ["Scanner", "Mouse", "Printer", "Microphone"], explanation: "A printer produces a paper copy of digital content." },
    hi: { stem: "कागज पर आउटपुट कौन-सा उपकरण देता है?", options: ["स्कैनर", "माउस", "प्रिंटर", "माइक्रोफोन"], explanation: "प्रिंटर डिजिटल सामग्री की कागज पर कॉपी बनाता है।" },
    pa: { stem: "ਕਾਗਜ਼ ਉੱਤੇ ਆਉਟਪੁਟ ਕਿਹੜਾ ਉਪਕਰਣ ਦਿੰਦਾ ਹੈ?", options: ["ਸਕੈਨਰ", "ਮਾਊਸ", "ਪ੍ਰਿੰਟਰ", "ਮਾਈਕ੍ਰੋਫੋਨ"], explanation: "ਪ੍ਰਿੰਟਰ ਡਿਜ਼ਿਟਲ ਸਮੱਗਰੀ ਦੀ ਕਾਗਜ਼ੀ ਕਾਪੀ ਬਣਾਉਂਦਾ ਹੈ।" },
  },
  {
    cpId: "COM-001-CP-004", qlId: "COM-001-CP-004-QL-002", difficulty: "MEDIUM", correctIndex: 3, sourceFactIds: [IBM_CPU],
    en: { stem: "Which printer strikes a ribbon against paper?", options: ["Laser printer", "Inkjet printer", "Thermal printer", "Dot-matrix printer"], explanation: "A dot-matrix printer is an impact printer. Its pins strike a ribbon against paper." },
    hi: { stem: "कौन-सा प्रिंटर रिबन को कागज पर मारता है?", options: ["लेजर प्रिंटर", "इंकजेट प्रिंटर", "थर्मल प्रिंटर", "डॉट-मैट्रिक्स प्रिंटर"], explanation: "डॉट-मैट्रिक्स इम्पैक्ट प्रिंटर है। इसकी पिन रिबन को कागज पर मारती हैं।" },
    pa: { stem: "ਕਿਹੜਾ ਪ੍ਰਿੰਟਰ ਰਿਬਨ ਨੂੰ ਕਾਗਜ਼ ਉੱਤੇ ਮਾਰਦਾ ਹੈ?", options: ["ਲੇਜ਼ਰ ਪ੍ਰਿੰਟਰ", "ਇੰਕਜੈੱਟ ਪ੍ਰਿੰਟਰ", "ਥਰਮਲ ਪ੍ਰਿੰਟਰ", "ਡਾਟ-ਮੈਟ੍ਰਿਕਸ ਪ੍ਰਿੰਟਰ"], explanation: "ਡਾਟ-ਮੈਟ੍ਰਿਕਸ ਇੰਪੈਕਟ ਪ੍ਰਿੰਟਰ ਹੈ। ਇਸ ਦੀਆਂ ਪਿੰਨਾਂ ਰਿਬਨ ਨੂੰ ਕਾਗਜ਼ ਉੱਤੇ ਮਾਰਦੀਆਂ ਹਨ।" },
  },
  {
    cpId: "COM-001-CP-004", qlId: "COM-001-CP-004-QL-003", difficulty: "EASY", correctIndex: 0, sourceFactIds: [IBM_CPU],
    en: { stem: "Which printer uses liquid ink?", options: ["Inkjet printer", "Laser printer", "Dot-matrix printer", "Plotter"], explanation: "An inkjet printer sprays small drops of liquid ink onto paper." },
    hi: { stem: "कौन-सा प्रिंटर तरल स्याही इस्तेमाल करता है?", options: ["इंकजेट प्रिंटर", "लेजर प्रिंटर", "डॉट-मैट्रिक्स प्रिंटर", "प्लॉटर"], explanation: "इंकजेट प्रिंटर कागज पर तरल स्याही की छोटी बूंदें छिड़कता है।" },
    pa: { stem: "ਕਿਹੜਾ ਪ੍ਰਿੰਟਰ ਤਰਲ ਸਿਆਹੀ ਵਰਤਦਾ ਹੈ?", options: ["ਇੰਕਜੈੱਟ ਪ੍ਰਿੰਟਰ", "ਲੇਜ਼ਰ ਪ੍ਰਿੰਟਰ", "ਡਾਟ-ਮੈਟ੍ਰਿਕਸ ਪ੍ਰਿੰਟਰ", "ਪਲਾਟਰ"], explanation: "ਇੰਕਜੈੱਟ ਪ੍ਰਿੰਟਰ ਕਾਗਜ਼ ਉੱਤੇ ਤਰਲ ਸਿਆਹੀ ਦੀਆਂ ਛੋਟੀਆਂ ਬੂੰਦਾਂ ਛਿੜਕਦਾ ਹੈ।" },
  },
  {
    cpId: "COM-001-CP-004", qlId: "COM-001-CP-004-QL-003", difficulty: "MEDIUM", correctIndex: 1, sourceFactIds: [IBM_CPU],
    en: { stem: "Which printer uses toner?", options: ["Inkjet printer", "Laser printer", "Dot-matrix printer", "Pen plotter"], explanation: "A laser printer uses toner powder to print." },
    hi: { stem: "कौन-सा प्रिंटर टोनर इस्तेमाल करता है?", options: ["इंकजेट प्रिंटर", "लेजर प्रिंटर", "डॉट-मैट्रिक्स प्रिंटर", "पेन प्लॉटर"], explanation: "लेजर प्रिंटर प्रिंट करने के लिए टोनर पाउडर इस्तेमाल करता है।" },
    pa: { stem: "ਕਿਹੜਾ ਪ੍ਰਿੰਟਰ ਟੋਨਰ ਵਰਤਦਾ ਹੈ?", options: ["ਇੰਕਜੈੱਟ ਪ੍ਰਿੰਟਰ", "ਲੇਜ਼ਰ ਪ੍ਰਿੰਟਰ", "ਡਾਟ-ਮੈਟ੍ਰਿਕਸ ਪ੍ਰਿੰਟਰ", "ਪੈਨ ਪਲਾਟਰ"], explanation: "ਲੇਜ਼ਰ ਪ੍ਰਿੰਟਰ ਛਪਾਈ ਲਈ ਟੋਨਰ ਪਾਊਡਰ ਵਰਤਦਾ ਹੈ।" },
  },
  {
    cpId: "COM-001-CP-004", qlId: "COM-001-CP-004-QL-004", difficulty: "EASY", correctIndex: 2, sourceFactIds: [MICROSOFT_DOCK],
    en: { stem: "Which output device plays sound?", options: ["Scanner", "Keyboard", "Speaker", "Mouse"], explanation: "A speaker changes digital audio signals into sound." },
    hi: { stem: "आवाज कौन-सा आउटपुट उपकरण चलाता है?", options: ["स्कैनर", "कीबोर्ड", "स्पीकर", "माउस"], explanation: "स्पीकर डिजिटल ऑडियो संकेतों को आवाज में बदलता है।" },
    pa: { stem: "ਆਵਾਜ਼ ਕਿਹੜਾ ਆਉਟਪੁਟ ਉਪਕਰਣ ਚਲਾਉਂਦਾ ਹੈ?", options: ["ਸਕੈਨਰ", "ਕੀਬੋਰਡ", "ਸਪੀਕਰ", "ਮਾਊਸ"], explanation: "ਸਪੀਕਰ ਡਿਜ਼ਿਟਲ ਆਡੀਓ ਸੰਕੇਤਾਂ ਨੂੰ ਆਵਾਜ਼ ਵਿੱਚ ਬਦਲਦਾ ਹੈ।" },
  },
  {
    cpId: "COM-001-CP-004", qlId: "COM-001-CP-004-QL-004", difficulty: "MEDIUM", correctIndex: 3, sourceFactIds: [MICROSOFT_DOCK],
    en: { stem: "Which device displays a computer image on a large screen or wall?", options: ["Barcode reader", "Microphone", "Keyboard", "Projector"], explanation: "A projector enlarges and displays the computer image on another surface." },
    hi: { stem: "कंप्यूटर की तस्वीर बड़ी स्क्रीन या दीवार पर कौन-सा उपकरण दिखाता है?", options: ["बारकोड रीडर", "माइक्रोफोन", "कीबोर्ड", "प्रोजेक्टर"], explanation: "प्रोजेक्टर कंप्यूटर की तस्वीर को बड़ा करके दूसरी सतह पर दिखाता है।" },
    pa: { stem: "ਕੰਪਿਊਟਰ ਦੀ ਤਸਵੀਰ ਵੱਡੀ ਸਕਰੀਨ ਜਾਂ ਕੰਧ ਉੱਤੇ ਕਿਹੜਾ ਉਪਕਰਣ ਦਿਖਾਉਂਦਾ ਹੈ?", options: ["ਬਾਰਕੋਡ ਰੀਡਰ", "ਮਾਈਕ੍ਰੋਫੋਨ", "ਕੀਬੋਰਡ", "ਪ੍ਰੋਜੈਕਟਰ"], explanation: "ਪ੍ਰੋਜੈਕਟਰ ਕੰਪਿਊਟਰ ਦੀ ਤਸਵੀਰ ਵੱਡੀ ਕਰਕੇ ਹੋਰ ਸਤਹ ਉੱਤੇ ਦਿਖਾਉਂਦਾ ਹੈ।" },
  },

  {
    cpId: "COM-001-CP-005", qlId: "COM-001-CP-005-QL-001", difficulty: "EASY", correctIndex: 0, sourceFactIds: [USB],
    en: { stem: "What is the full form of USB?", options: ["Universal Serial Bus", "Unified System Board", "Universal Storage Box", "User Signal Base"], explanation: "USB means Universal Serial Bus. It connects devices and can carry data and power." },
    hi: { stem: "USB का पूरा नाम क्या है?", options: ["Universal Serial Bus", "Unified System Board", "Universal Storage Box", "User Signal Base"], explanation: "USB का पूरा नाम Universal Serial Bus है। यह उपकरण जोड़ता है और डेटा तथा बिजली ले जा सकता है।" },
    pa: { stem: "USB ਦਾ ਪੂਰਾ ਨਾਮ ਕੀ ਹੈ?", options: ["Universal Serial Bus", "Unified System Board", "Universal Storage Box", "User Signal Base"], explanation: "USB ਦਾ ਪੂਰਾ ਨਾਮ Universal Serial Bus ਹੈ। ਇਹ ਉਪਕਰਣ ਜੋੜਦਾ ਅਤੇ ਡਾਟਾ ਤੇ ਬਿਜਲੀ ਲੈ ਜਾ ਸਕਦਾ ਹੈ।" },
  },
  {
    cpId: "COM-001-CP-005", qlId: "COM-001-CP-005-QL-001", difficulty: "MEDIUM", correctIndex: 1, sourceFactIds: [USB],
    en: { stem: "Which connector can be inserted either way up?", options: ["VGA", "USB Type-C", "PS/2", "Parallel port"], explanation: "USB Type-C has a reversible connector. USB means Universal Serial Bus." },
    hi: { stem: "कौन-सा कनेक्टर दोनों तरफ से लगाया जा सकता है?", options: ["VGA", "USB Type-C", "PS/2", "पैरेलल पोर्ट"], explanation: "USB Type-C कनेक्टर दोनों तरफ से लगाया जा सकता है। USB का पूरा नाम Universal Serial Bus है।" },
    pa: { stem: "ਕਿਹੜਾ ਕਨੈਕਟਰ ਦੋਵੇਂ ਪਾਸਿਆਂ ਤੋਂ ਲਾਇਆ ਜਾ ਸਕਦਾ ਹੈ?", options: ["VGA", "USB Type-C", "PS/2", "ਪੈਰਲਲ ਪੋਰਟ"], explanation: "USB Type-C ਕਨੈਕਟਰ ਦੋਵੇਂ ਪਾਸਿਆਂ ਤੋਂ ਲਾਇਆ ਜਾ ਸਕਦਾ ਹੈ। USB ਦਾ ਪੂਰਾ ਨਾਮ Universal Serial Bus ਹੈ।" },
  },
  {
    cpId: "COM-001-CP-005", qlId: "COM-001-CP-005-QL-002", difficulty: "EASY", correctIndex: 2, sourceFactIds: [MICROSOFT_DOCK],
    en: { stem: "Which interface commonly carries digital video and audio to a display?", options: ["PS/2", "Serial port", "HDMI", "Audio input"], explanation: "HDMI means High-Definition Multimedia Interface. It commonly carries digital video and audio." },
    hi: { stem: "डिस्प्ले तक डिजिटल वीडियो और ऑडियो आम तौर पर कौन-सा इंटरफेस ले जाता है?", options: ["PS/2", "सीरियल पोर्ट", "HDMI", "ऑडियो इनपुट"], explanation: "HDMI का पूरा नाम High-Definition Multimedia Interface है। यह आम तौर पर डिजिटल वीडियो और ऑडियो ले जाता है।" },
    pa: { stem: "ਡਿਸਪਲੇ ਤੱਕ ਡਿਜ਼ਿਟਲ ਵੀਡੀਓ ਅਤੇ ਆਡੀਓ ਆਮ ਤੌਰ ਉੱਤੇ ਕਿਹੜਾ ਇੰਟਰਫੇਸ ਲੈ ਜਾਂਦਾ ਹੈ?", options: ["PS/2", "ਸੀਰੀਅਲ ਪੋਰਟ", "HDMI", "ਆਡੀਓ ਇਨਪੁਟ"], explanation: "HDMI ਦਾ ਪੂਰਾ ਨਾਮ High-Definition Multimedia Interface ਹੈ। ਇਹ ਆਮ ਤੌਰ ਉੱਤੇ ਡਿਜ਼ਿਟਲ ਵੀਡੀਓ ਅਤੇ ਆਡੀਓ ਲੈ ਜਾਂਦਾ ਹੈ।" },
  },
  {
    cpId: "COM-001-CP-005", qlId: "COM-001-CP-005-QL-002", difficulty: "MEDIUM", correctIndex: 3, sourceFactIds: [MICROSOFT_DOCK],
    en: { stem: "Which older interface carries analog video?", options: ["USB", "Ethernet", "Audio jack", "VGA"], explanation: "VGA means Video Graphics Array. It carries analog video." },
    hi: { stem: "कौन-सा पुराना इंटरफेस एनालॉग वीडियो ले जाता है?", options: ["USB", "ईथरनेट", "ऑडियो जैक", "VGA"], explanation: "VGA का पूरा नाम Video Graphics Array है। यह एनालॉग वीडियो ले जाता है।" },
    pa: { stem: "ਕਿਹੜਾ ਪੁਰਾਣਾ ਇੰਟਰਫੇਸ ਐਨਾਲਾਗ ਵੀਡੀਓ ਲੈ ਜਾਂਦਾ ਹੈ?", options: ["USB", "ਈਥਰਨੈੱਟ", "ਆਡੀਓ ਜੈਕ", "VGA"], explanation: "VGA ਦਾ ਪੂਰਾ ਨਾਮ Video Graphics Array ਹੈ। ਇਹ ਐਨਾਲਾਗ ਵੀਡੀਓ ਲੈ ਜਾਂਦਾ ਹੈ।" },
  },
  {
    cpId: "COM-001-CP-005", qlId: "COM-001-CP-005-QL-003", difficulty: "EASY", correctIndex: 0, sourceFactIds: [MICROSOFT_DOCK],
    en: { stem: "Which connector is commonly used for a wired Ethernet network?", options: ["RJ-45", "HDMI", "VGA", "Audio jack"], explanation: "RJ-45 means Registered Jack 45. It is commonly used for wired Ethernet connections." },
    hi: { stem: "वायर्ड ईथरनेट नेटवर्क के लिए आम तौर पर कौन-सा कनेक्टर इस्तेमाल होता है?", options: ["RJ-45", "HDMI", "VGA", "ऑडियो जैक"], explanation: "RJ-45 का पूरा नाम Registered Jack 45 है। यह आम तौर पर वायर्ड ईथरनेट कनेक्शन के लिए इस्तेमाल होता है।" },
    pa: { stem: "ਤਾਰ ਵਾਲੇ ਈਥਰਨੈੱਟ ਨੈੱਟਵਰਕ ਲਈ ਆਮ ਤੌਰ ਉੱਤੇ ਕਿਹੜਾ ਕਨੈਕਟਰ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?", options: ["RJ-45", "HDMI", "VGA", "ਆਡੀਓ ਜੈਕ"], explanation: "RJ-45 ਦਾ ਪੂਰਾ ਨਾਮ Registered Jack 45 ਹੈ। ਇਹ ਆਮ ਤੌਰ ਉੱਤੇ ਤਾਰ ਵਾਲੇ ਈਥਰਨੈੱਟ ਕਨੈਕਸ਼ਨ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।" },
  },
  {
    cpId: "COM-001-CP-005", qlId: "COM-001-CP-005-QL-003", difficulty: "MEDIUM", correctIndex: 1, sourceFactIds: [MICROSOFT_DOCK],
    en: { stem: "Where should wired headphones usually be connected?", options: ["Ethernet port", "Audio output jack", "VGA port", "Power socket"], explanation: "The audio output jack sends sound to headphones or speakers." },
    hi: { stem: "वायर्ड हेडफोन आम तौर पर कहाँ जोड़ने चाहिए?", options: ["ईथरनेट पोर्ट", "ऑडियो आउटपुट जैक", "VGA पोर्ट", "पावर सॉकेट"], explanation: "ऑडियो आउटपुट जैक हेडफोन या स्पीकर को आवाज भेजता है।" },
    pa: { stem: "ਤਾਰ ਵਾਲੇ ਹੈੱਡਫੋਨ ਆਮ ਤੌਰ ਉੱਤੇ ਕਿੱਥੇ ਜੋੜਨੇ ਚਾਹੀਦੇ ਹਨ?", options: ["ਈਥਰਨੈੱਟ ਪੋਰਟ", "ਆਡੀਓ ਆਉਟਪੁਟ ਜੈਕ", "VGA ਪੋਰਟ", "ਪਾਵਰ ਸਾਕਟ"], explanation: "ਆਡੀਓ ਆਉਟਪੁਟ ਜੈਕ ਹੈੱਡਫੋਨ ਜਾਂ ਸਪੀਕਰ ਨੂੰ ਆਵਾਜ਼ ਭੇਜਦਾ ਹੈ।" },
  },
  {
    cpId: "COM-001-CP-005", qlId: "COM-001-CP-005-QL-004", difficulty: "EASY", correctIndex: 2, sourceFactIds: [MICROSOFT_DOCK],
    en: { stem: "Which older port was commonly used for a keyboard and mouse?", options: ["HDMI", "RJ-45", "PS/2", "VGA"], explanation: "PS/2 means Personal System/2. Its port was commonly used for keyboards and mice." },
    hi: { stem: "कीबोर्ड और माउस के लिए पहले कौन-सा पोर्ट आम था?", options: ["HDMI", "RJ-45", "PS/2", "VGA"], explanation: "PS/2 का पूरा नाम Personal System/2 है। इसका पोर्ट कीबोर्ड और माउस के लिए आम था।" },
    pa: { stem: "ਕੀਬੋਰਡ ਅਤੇ ਮਾਊਸ ਲਈ ਪਹਿਲਾਂ ਕਿਹੜਾ ਪੋਰਟ ਆਮ ਸੀ?", options: ["HDMI", "RJ-45", "PS/2", "VGA"], explanation: "PS/2 ਦਾ ਪੂਰਾ ਨਾਮ Personal System/2 ਹੈ। ਇਸ ਦਾ ਪੋਰਟ ਕੀਬੋਰਡ ਅਤੇ ਮਾਊਸ ਲਈ ਆਮ ਸੀ।" },
  },
  {
    cpId: "COM-001-CP-005", qlId: "COM-001-CP-005-QL-004", difficulty: "MEDIUM", correctIndex: 3, sourceFactIds: [MICROSOFT_DOCK],
    en: { stem: "Which older port was commonly used to connect a printer?", options: ["Audio port", "VGA port", "PS/2 port", "Parallel port"], explanation: "The parallel port was commonly used for older printers." },
    hi: { stem: "पुराने प्रिंटर को जोड़ने के लिए आम तौर पर कौन-सा पोर्ट इस्तेमाल होता था?", options: ["ऑडियो पोर्ट", "VGA पोर्ट", "PS/2 पोर्ट", "पैरेलल पोर्ट"], explanation: "पुराने प्रिंटर को जोड़ने के लिए पैरेलल पोर्ट आम था।" },
    pa: { stem: "ਪੁਰਾਣੇ ਪ੍ਰਿੰਟਰ ਨੂੰ ਜੋੜਨ ਲਈ ਆਮ ਤੌਰ ਉੱਤੇ ਕਿਹੜਾ ਪੋਰਟ ਵਰਤਿਆ ਜਾਂਦਾ ਸੀ?", options: ["ਆਡੀਓ ਪੋਰਟ", "VGA ਪੋਰਟ", "PS/2 ਪੋਰਟ", "ਪੈਰਲਲ ਪੋਰਟ"], explanation: "ਪੁਰਾਣੇ ਪ੍ਰਿੰਟਰ ਨੂੰ ਜੋੜਨ ਲਈ ਪੈਰਲਲ ਪੋਰਟ ਆਮ ਸੀ।" },
  },
];

export const COM001_CP002_CP005_ENGLISH_FREEZE_AUTHORITY_V1 = {
  authorityId: "COM-001-CP-002-CP-005-ENGLISH-FREEZE-V1",
  chapterCode: "COM-001",
  cpIds: Object.freeze(["COM-001-CP-002", "COM-001-CP-003", "COM-001-CP-004", "COM-001-CP-005"] as const),
  permanentQlIds: Object.freeze([...new Set(S.map((question) => question.qlId))]),
  questionCount: 32,
  questionsPerQl: 2,
} as const;

function build(language: Com001CompletionLanguage): readonly Com001CompletionQuestion[] {
  const locale = language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "pa-IN";
  return Object.freeze(S.map((source, index) => {
    const copy = source[language];
    const sourceQuestionId = `COM001-COMP-EN-${String(index + 1).padStart(3, "0")}`;
    return Object.freeze({
      ...copy,
      questionId: language === "en" ? sourceQuestionId : `COM001-COMP-${language.toUpperCase()}-${String(index + 1).padStart(3, "0")}`,
      sourceQuestionId,
      cpId: source.cpId,
      qlId: source.qlId,
      language,
      locale,
      difficulty: source.difficulty,
      correctIndex: source.correctIndex,
      canonicalAnswer: copy.options[source.correctIndex]!,
      sourceFactIds: source.sourceFactIds,
      sourceEnglishAuthorityId: COM001_CP002_CP005_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
      sourceEnglishFrozen: true as const,
      sourceLocalizationFrozen: true as const,
    });
  }));
}

export const COM001_CP002_CP005_ENGLISH_FROZEN = build("en");
export const COM001_CP002_CP005_HINDI_FROZEN = build("hi");
export const COM001_CP002_CP005_PUNJABI_FROZEN = build("pa");

export const COM001_CP002_CP005_LOCALIZATION_FREEZE_AUTHORITY_V1 = {
  authorityId: "COM-001-CP-002-CP-005-HI-PA-LOCALIZATION-FREEZE-V1",
  predecessorAuthorityId: COM001_CP002_CP005_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
  languageCounts: Object.freeze({ en: 32, hi: 32, pa: 32 }),
  questionCountPerLanguage: 32,
  combinedFingerprint: createHash("sha256")
    .update(JSON.stringify([...COM001_CP002_CP005_ENGLISH_FROZEN, ...COM001_CP002_CP005_HINDI_FROZEN, ...COM001_CP002_CP005_PUNJABI_FROZEN]))
    .digest("hex"),
} as const;

export function auditCom001Cp002Cp005FreezeV1() {
  const all = [...COM001_CP002_CP005_ENGLISH_FROZEN, ...COM001_CP002_CP005_HINDI_FROZEN, ...COM001_CP002_CP005_PUNJABI_FROZEN];
  const issues: string[] = [];
  const ids = new Set<string>();
  for (const question of all) {
    if (ids.has(question.questionId)) issues.push(`DUPLICATE_ID:${question.questionId}`);
    ids.add(question.questionId);
    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push(`OPTIONS:${question.questionId}`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER:${question.questionId}`);
    if (!question.stem.trim() || !question.explanation.trim()) issues.push(`EMPTY_COPY:${question.questionId}`);
    if (/which of the following|consider the following|associated/i.test(question.stem + " " + question.explanation)) issues.push(`STYLE:${question.questionId}`);
    if (question.explanation.split(/[.!?।]/).filter(Boolean).length > 2) issues.push(`EXPLANATION_LENGTH:${question.questionId}`);
  }
  for (const qlId of COM001_CP002_CP005_ENGLISH_FREEZE_AUTHORITY_V1.permanentQlIds) {
    for (const corpus of [COM001_CP002_CP005_ENGLISH_FROZEN, COM001_CP002_CP005_HINDI_FROZEN, COM001_CP002_CP005_PUNJABI_FROZEN]) {
      if (corpus.filter((question) => question.qlId === qlId).length !== 2) issues.push(`QL_COUNT:${qlId}`);
    }
  }
  return { valid: issues.length === 0, issues, englishCount: 32, hindiCount: 32, punjabiCount: 32, qlCount: 16 };
}
