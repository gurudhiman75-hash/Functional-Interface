import type { Com005FrozenQuestion } from "./com005-networking-freeze-v1";

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

export const COM005_GAP_EXTENSION_AUTHORITY_V1 = {
  authorityId: "COM-005-GAP-EXTENSION-V1",
  chapterCode: "COM-005",
  cpId: "COM-005-CP-002",
  status: "REVIEW_ONLY",
  questionCountPerLanguage: 16,
  permanentQlIds: [
    "COM-005-QL-008",
    "COM-005-QL-009",
    "COM-005-QL-010",
    "COM-005-QL-011",
  ],
  sources: [
    "IBM-NETWORK-ARCHITECTURE",
    "CISCO-NETWORKING-BASICS",
    "IBM-DATA-COMMUNICATION",
  ],
  lifecycle: "BANK_ONLY_MANUAL_ACCEPTANCE",
  hardDifficultyAuthorized: false,
} as const;

const S: readonly Source[] = [
  {
    id: "COM005-EXT-001", qlId: "COM-005-QL-008", difficulty: "EASY", correctIndex: 0, fact: "peer-to-peer networks let connected computers share resources directly",
    en: { stem: "Which network model lets computers share resources directly with one another?", options: ["Peer-to-peer", "Client-server", "Ring", "Bus"], explanation: "In a peer-to-peer model, computers can share resources directly without a central server." },
    hi: { stem: "कौन-सा नेटवर्क मॉडल कंप्यूटरों को एक-दूसरे से सीधे संसाधन साझा करने देता है?", options: ["पीयर-टू-पीयर", "क्लाइंट-सर्वर", "रिंग", "बस"], explanation: "पीयर-टू-पीयर मॉडल में कंप्यूटर केंद्रीय सर्वर के बिना सीधे संसाधन साझा कर सकते हैं।" },
    pa: { stem: "ਕਿਹੜਾ ਨੈੱਟਵਰਕ ਮਾਡਲ ਕੰਪਿਊਟਰਾਂ ਨੂੰ ਇਕ-ਦੂਜੇ ਨਾਲ ਸਿੱਧੇ ਸਰੋਤ ਸਾਂਝੇ ਕਰਨ ਦਿੰਦਾ ਹੈ?", options: ["ਪੀਅਰ-ਟੂ-ਪੀਅਰ", "ਕਲਾਇੰਟ-ਸਰਵਰ", "ਰਿੰਗ", "ਬੱਸ"], explanation: "ਪੀਅਰ-ਟੂ-ਪੀਅਰ ਮਾਡਲ ਵਿੱਚ ਕੰਪਿਊਟਰ ਕੇਂਦਰੀ ਸਰਵਰ ਤੋਂ ਬਿਨਾਂ ਸਿੱਧੇ ਸਰੋਤ ਸਾਂਝੇ ਕਰ ਸਕਦੇ ਹਨ।" },
  },
  {
    id: "COM005-EXT-002", qlId: "COM-005-QL-008", difficulty: "EASY", correctIndex: 1, fact: "a client requests services and a server provides them",
    en: { stem: "In a client-server model, what does the server do?", options: ["Only requests a service", "Provides a service", "Works as a cable", "Changes a file name"], explanation: "A server provides a service or resource to a client that requests it." },
    hi: { stem: "क्लाइंट-सर्वर मॉडल में सर्वर क्या करता है?", options: ["केवल सेवा मांगता है", "सेवा देता है", "केबल की तरह काम करता है", "फाइल का नाम बदलता है"], explanation: "सर्वर उस क्लाइंट को सेवा या संसाधन देता है जो उसकी मांग करता है।" },
    pa: { stem: "ਕਲਾਇੰਟ-ਸਰਵਰ ਮਾਡਲ ਵਿੱਚ ਸਰਵਰ ਕੀ ਕਰਦਾ ਹੈ?", options: ["ਸਿਰਫ਼ ਸੇਵਾ ਮੰਗਦਾ ਹੈ", "ਸੇਵਾ ਦਿੰਦਾ ਹੈ", "ਕੇਬਲ ਵਾਂਗ ਕੰਮ ਕਰਦਾ ਹੈ", "ਫਾਇਲ ਦਾ ਨਾਮ ਬਦਲਦਾ ਹੈ"], explanation: "ਸਰਵਰ ਉਸ ਕਲਾਇੰਟ ਨੂੰ ਸੇਵਾ ਜਾਂ ਸਰੋਤ ਦਿੰਦਾ ਹੈ ਜੋ ਉਸ ਦੀ ਮੰਗ ਕਰਦਾ ਹੈ।" },
  },
  {
    id: "COM005-EXT-003", qlId: "COM-005-QL-008", difficulty: "MEDIUM", correctIndex: 2, fact: "peer-to-peer has no dedicated central server for all sharing",
    en: { stem: "Which model is more suitable when each computer may act as both client and server?", options: ["Client-server", "Star", "Peer-to-peer", "Bus"], explanation: "In a peer-to-peer model, each computer may request and provide resources." },
    hi: { stem: "कौन-सा मॉडल उपयुक्त है जब हर कंप्यूटर क्लाइंट और सर्वर दोनों की तरह काम कर सकता है?", options: ["क्लाइंट-सर्वर", "स्टार", "पीयर-टू-पीयर", "बस"], explanation: "पीयर-टू-पीयर मॉडल में हर कंप्यूटर संसाधन मांग भी सकता है और दे भी सकता है।" },
    pa: { stem: "ਕਿਹੜਾ ਮਾਡਲ ਢੁਕਵਾਂ ਹੈ ਜਦੋਂ ਹਰ ਕੰਪਿਊਟਰ ਕਲਾਇੰਟ ਅਤੇ ਸਰਵਰ ਦੋਵੇਂ ਬਣ ਸਕਦਾ ਹੈ?", options: ["ਕਲਾਇੰਟ-ਸਰਵਰ", "ਸਟਾਰ", "ਪੀਅਰ-ਟੂ-ਪੀਅਰ", "ਬੱਸ"], explanation: "ਪੀਅਰ-ਟੂ-ਪੀਅਰ ਮਾਡਲ ਵਿੱਚ ਹਰ ਕੰਪਿਊਟਰ ਸਰੋਤ ਮੰਗ ਵੀ ਸਕਦਾ ਹੈ ਅਤੇ ਦੇ ਵੀ ਸਕਦਾ ਹੈ।" },
  },
  {
    id: "COM005-EXT-004", qlId: "COM-005-QL-008", difficulty: "MEDIUM", correctIndex: 3, fact: "central management is a client-server feature",
    en: { stem: "Which model normally gives central control of shared services?", options: ["Peer-to-peer", "Ring", "Mesh", "Client-server"], explanation: "In a client-server model, a server centrally manages shared services for clients." },
    hi: { stem: "साझा सेवाओं का केंद्रीय नियंत्रण सामान्यतः किस मॉडल में होता है?", options: ["पीयर-टू-पीयर", "रिंग", "मेश", "क्लाइंट-सर्वर"], explanation: "क्लाइंट-सर्वर मॉडल में सर्वर क्लाइंट के लिए साझा सेवाओं को केंद्रीय रूप से संभालता है।" },
    pa: { stem: "ਸਾਂਝੀਆਂ ਸੇਵਾਵਾਂ ਦਾ ਕੇਂਦਰੀ ਕੰਟਰੋਲ ਆਮ ਤੌਰ ਉੱਤੇ ਕਿਹੜੇ ਮਾਡਲ ਵਿੱਚ ਹੁੰਦਾ ਹੈ?", options: ["ਪੀਅਰ-ਟੂ-ਪੀਅਰ", "ਰਿੰਗ", "ਮੇਸ਼", "ਕਲਾਇੰਟ-ਸਰਵਰ"], explanation: "ਕਲਾਇੰਟ-ਸਰਵਰ ਮਾਡਲ ਵਿੱਚ ਸਰਵਰ ਕਲਾਇੰਟਾਂ ਲਈ ਸਾਂਝੀਆਂ ਸੇਵਾਵਾਂ ਨੂੰ ਕੇਂਦਰੀ ਤੌਰ ਉੱਤੇ ਸੰਭਾਲਦਾ ਹੈ।" },
  },
  {
    id: "COM005-EXT-005", qlId: "COM-005-QL-009", difficulty: "EASY", correctIndex: 1, fact: "network architecture describes how devices and services are arranged",
    en: { stem: "What does network architecture mainly describe?", options: ["Only cable colour", "The arrangement of devices and services", "Only screen size", "Only file names"], explanation: "Network architecture describes how devices, connections and services are arranged." },
    hi: { stem: "नेटवर्क आर्किटेक्चर मुख्य रूप से क्या बताता है?", options: ["केवल केबल का रंग", "डिवाइस और सेवाओं की व्यवस्था", "केवल स्क्रीन का आकार", "केवल फाइल के नाम"], explanation: "नेटवर्क आर्किटेक्चर डिवाइस, कनेक्शन और सेवाओं की व्यवस्था बताता है।" },
    pa: { stem: "ਨੈੱਟਵਰਕ ਆਰਕੀਟੈਕਚਰ ਮੁੱਖ ਤੌਰ ਉੱਤੇ ਕੀ ਦੱਸਦਾ ਹੈ?", options: ["ਸਿਰਫ਼ ਕੇਬਲ ਦਾ ਰੰਗ", "ਡਿਵਾਈਸਾਂ ਅਤੇ ਸੇਵਾਵਾਂ ਦੀ ਬਣਤਰ", "ਸਿਰਫ਼ ਸਕਰੀਨ ਦਾ ਆਕਾਰ", "ਸਿਰਫ਼ ਫਾਇਲਾਂ ਦੇ ਨਾਮ"], explanation: "ਨੈੱਟਵਰਕ ਆਰਕੀਟੈਕਚਰ ਡਿਵਾਈਸਾਂ, ਕਨੈਕਸ਼ਨਾਂ ਅਤੇ ਸੇਵਾਵਾਂ ਦੀ ਬਣਤਰ ਦੱਸਦਾ ਹੈ।" },
  },
  {
    id: "COM005-EXT-006", qlId: "COM-005-QL-009", difficulty: "EASY", correctIndex: 0, fact: "the Open Systems Interconnection model has layers for network communication",
    en: { stem: "What does the Open Systems Interconnection model divide?", options: ["Network communication into layers", "A hard disk into folders", "A monitor into pixels", "A file into names"], explanation: "The Open Systems Interconnection model divides network communication into layers." },
    hi: { stem: "Open Systems Interconnection मॉडल किसे स्तरों में बांटता है?", options: ["नेटवर्क संचार को", "हार्ड डिस्क को फोल्डर में", "मॉनिटर को पिक्सल में", "फाइल को नामों में"], explanation: "Open Systems Interconnection मॉडल नेटवर्क संचार को अलग-अलग स्तरों में बांटता है।" },
    pa: { stem: "Open Systems Interconnection ਮਾਡਲ ਕਿਸ ਨੂੰ ਪੱਧਰਾਂ ਵਿੱਚ ਵੰਡਦਾ ਹੈ?", options: ["ਨੈੱਟਵਰਕ ਸੰਚਾਰ ਨੂੰ", "ਹਾਰਡ ਡਿਸਕ ਨੂੰ ਫੋਲਡਰਾਂ ਵਿੱਚ", "ਮਾਨੀਟਰ ਨੂੰ ਪਿਕਸਲਾਂ ਵਿੱਚ", "ਫਾਇਲ ਨੂੰ ਨਾਮਾਂ ਵਿੱਚ"], explanation: "Open Systems Interconnection ਮਾਡਲ ਨੈੱਟਵਰਕ ਸੰਚਾਰ ਨੂੰ ਵੱਖ-ਵੱਖ ਪੱਧਰਾਂ ਵਿੱਚ ਵੰਡਦਾ ਹੈ।" },
  },
  {
    id: "COM005-EXT-007", qlId: "COM-005-QL-009", difficulty: "MEDIUM", correctIndex: 2, fact: "layered design separates network functions",
    en: { stem: "Why is a layered network design useful?", options: ["It removes all devices", "It stores only pictures", "It separates communication functions", "It stops all data"], explanation: "Layering separates communication functions, so each layer has a clear role." },
    hi: { stem: "स्तर आधारित नेटवर्क डिजाइन क्यों उपयोगी है?", options: ["यह सभी डिवाइस हटा देता है", "यह केवल चित्र रखता है", "यह संचार के कार्य अलग करता है", "यह सभी डेटा रोकता है"], explanation: "स्तर आधारित डिजाइन संचार के कार्यों को अलग करता है और हर स्तर की भूमिका स्पष्ट करता है।" },
    pa: { stem: "ਪੱਧਰਾਂ ਵਾਲਾ ਨੈੱਟਵਰਕ ਡਿਜ਼ਾਇਨ ਕਿਉਂ ਲਾਭਦਾਇਕ ਹੈ?", options: ["ਇਹ ਸਾਰੀਆਂ ਡਿਵਾਈਸਾਂ ਹਟਾ ਦਿੰਦਾ ਹੈ", "ਇਹ ਸਿਰਫ਼ ਤਸਵੀਰਾਂ ਰੱਖਦਾ ਹੈ", "ਇਹ ਸੰਚਾਰ ਦੇ ਕੰਮ ਵੱਖ ਕਰਦਾ ਹੈ", "ਇਹ ਸਾਰਾ ਡਾਟਾ ਰੋਕਦਾ ਹੈ"], explanation: "ਪੱਧਰਾਂ ਵਾਲਾ ਡਿਜ਼ਾਇਨ ਸੰਚਾਰ ਦੇ ਕੰਮ ਵੱਖ ਕਰਦਾ ਹੈ ਅਤੇ ਹਰ ਪੱਧਰ ਦੀ ਭੂਮਿਕਾ ਸਪਸ਼ਟ ਕਰਦਾ ਹੈ।" },
  },
  {
    id: "COM005-EXT-008", qlId: "COM-005-QL-009", difficulty: "MEDIUM", correctIndex: 3, fact: "the transport layer supports end-to-end delivery in layered models",
    en: { stem: "Which function belongs to the transport layer in a layered model?", options: ["Printing a page", "Changing monitor brightness", "Formatting a disk", "Supporting end-to-end data delivery"], explanation: "The transport layer supports data delivery between the communicating endpoints." },
    hi: { stem: "स्तर आधारित मॉडल में ट्रांसपोर्ट लेयर का कार्य क्या है?", options: ["पेज प्रिंट करना", "मॉनिटर की चमक बदलना", "डिस्क फॉर्मेट करना", "एंड-टू-एंड डेटा डिलीवरी में मदद करना"], explanation: "ट्रांसपोर्ट लेयर संचार करने वाले अंतिम बिंदुओं के बीच डेटा डिलीवरी में मदद करती है।" },
    pa: { stem: "ਪੱਧਰਾਂ ਵਾਲੇ ਮਾਡਲ ਵਿੱਚ ਟਰਾਂਸਪੋਰਟ ਲੇਅਰ ਦਾ ਕੰਮ ਕੀ ਹੈ?", options: ["ਪੰਨਾ ਪ੍ਰਿੰਟ ਕਰਨਾ", "ਮਾਨੀਟਰ ਦੀ ਰੌਸ਼ਨੀ ਬਦਲਣਾ", "ਡਿਸਕ ਫਾਰਮੈਟ ਕਰਨਾ", "ਐਂਡ-ਟੂ-ਐਂਡ ਡਾਟਾ ਡਿਲਿਵਰੀ ਵਿੱਚ ਮਦਦ ਕਰਨਾ"], explanation: "ਟਰਾਂਸਪੋਰਟ ਲੇਅਰ ਸੰਚਾਰ ਕਰ ਰਹੇ ਅੰਤਲੇ ਬਿੰਦੂਆਂ ਵਿਚਕਾਰ ਡਾਟਾ ਡਿਲਿਵਰੀ ਵਿੱਚ ਮਦਦ ਕਰਦੀ ਹੈ।" },
  },
  {
    id: "COM005-EXT-009", qlId: "COM-005-QL-010", difficulty: "EASY", correctIndex: 0, fact: "a gateway connects networks that may use different protocols",
    en: { stem: "Which device connects networks that may use different protocols?", options: ["Gateway", "Keyboard", "Plotter", "Repeater"], explanation: "A gateway connects networks that may use different protocols and can translate between them." },
    hi: { stem: "कौन-सा डिवाइस अलग प्रोटोकॉल वाले नेटवर्कों को जोड़ सकता है?", options: ["गेटवे", "कीबोर्ड", "प्लॉटर", "रिपीटर"], explanation: "गेटवे अलग प्रोटोकॉल वाले नेटवर्कों को जोड़ सकता है और उनके बीच रूपांतरण कर सकता है।" },
    pa: { stem: "ਕਿਹੜੀ ਡਿਵਾਈਸ ਵੱਖਰੇ ਪ੍ਰੋਟੋਕੋਲਾਂ ਵਾਲੇ ਨੈੱਟਵਰਕਾਂ ਨੂੰ ਜੋੜ ਸਕਦੀ ਹੈ?", options: ["ਗੇਟਵੇ", "ਕੀਬੋਰਡ", "ਪਲੌਟਰ", "ਰੀਪੀਟਰ"], explanation: "ਗੇਟਵੇ ਵੱਖਰੇ ਪ੍ਰੋਟੋਕੋਲਾਂ ਵਾਲੇ ਨੈੱਟਵਰਕਾਂ ਨੂੰ ਜੋੜ ਸਕਦਾ ਹੈ ਅਤੇ ਉਨ੍ਹਾਂ ਵਿਚਕਾਰ ਬਦਲਾਅ ਕਰ ਸਕਦਾ ਹੈ।" },
  },
  {
    id: "COM005-EXT-010", qlId: "COM-005-QL-010", difficulty: "EASY", correctIndex: 2, fact: "a bridge connects and filters traffic between network segments",
    en: { stem: "What is a bridge mainly used for?", options: ["Scanning pages", "Playing sound", "Connecting network segments", "Typing text"], explanation: "A bridge connects network segments and filters traffic between them." },
    hi: { stem: "ब्रिज का मुख्य उपयोग क्या है?", options: ["पेज स्कैन करना", "ध्वनि चलाना", "नेटवर्क सेगमेंट जोड़ना", "टेक्स्ट टाइप करना"], explanation: "ब्रिज नेटवर्क सेगमेंट जोड़ता है और उनके बीच डेटा ट्रैफिक को छांटता है।" },
    pa: { stem: "ਬ੍ਰਿਜ ਦਾ ਮੁੱਖ ਉਪਯੋਗ ਕੀ ਹੈ?", options: ["ਪੰਨੇ ਸਕੈਨ ਕਰਨਾ", "ਆਵਾਜ਼ ਚਲਾਉਣਾ", "ਨੈੱਟਵਰਕ ਸੈਗਮੈਂਟ ਜੋੜਨਾ", "ਟੈਕਸਟ ਟਾਈਪ ਕਰਨਾ"], explanation: "ਬ੍ਰਿਜ ਨੈੱਟਵਰਕ ਸੈਗਮੈਂਟ ਜੋੜਦਾ ਹੈ ਅਤੇ ਉਨ੍ਹਾਂ ਵਿਚਕਾਰ ਡਾਟਾ ਟ੍ਰੈਫਿਕ ਨੂੰ ਛਾਂਟਦਾ ਹੈ।" },
  },
  {
    id: "COM005-EXT-011", qlId: "COM-005-QL-010", difficulty: "MEDIUM", correctIndex: 1, fact: "a bridge operates between local network segments while a gateway can translate protocols",
    en: { stem: "Which device is the better match for joining two similar local network segments?", options: ["Gateway", "Bridge", "Modem", "Printer"], explanation: "A bridge joins similar local network segments. A gateway can connect networks with different protocols." },
    hi: { stem: "दो समान लोकल नेटवर्क सेगमेंट जोड़ने के लिए कौन-सा डिवाइस सही है?", options: ["गेटवे", "ब्रिज", "मोडेम", "प्रिंटर"], explanation: "ब्रिज समान लोकल नेटवर्क सेगमेंट जोड़ता है। गेटवे अलग प्रोटोकॉल वाले नेटवर्क जोड़ सकता है।" },
    pa: { stem: "ਦੋ ਸਮਾਨ ਲੋਕਲ ਨੈੱਟਵਰਕ ਸੈਗਮੈਂਟ ਜੋੜਨ ਲਈ ਕਿਹੜੀ ਡਿਵਾਈਸ ਠੀਕ ਹੈ?", options: ["ਗੇਟਵੇ", "ਬ੍ਰਿਜ", "ਮੋਡਮ", "ਪ੍ਰਿੰਟਰ"], explanation: "ਬ੍ਰਿਜ ਸਮਾਨ ਲੋਕਲ ਨੈੱਟਵਰਕ ਸੈਗਮੈਂਟ ਜੋੜਦਾ ਹੈ। ਗੇਟਵੇ ਵੱਖਰੇ ਪ੍ਰੋਟੋਕੋਲਾਂ ਵਾਲੇ ਨੈੱਟਵਰਕ ਜੋੜ ਸਕਦਾ ਹੈ।" },
  },
  {
    id: "COM005-EXT-012", qlId: "COM-005-QL-010", difficulty: "MEDIUM", correctIndex: 3, fact: "a router forwards packets between networks",
    en: { stem: "Which device forwards packets between different networks?", options: ["Hub", "Bridge", "Access point", "Router"], explanation: "A router forwards packets between different networks using network addresses." },
    hi: { stem: "अलग-अलग नेटवर्कों के बीच पैकेट कौन भेजता है?", options: ["हब", "ब्रिज", "एक्सेस पॉइंट", "राउटर"], explanation: "राउटर नेटवर्क पतों का उपयोग करके अलग-अलग नेटवर्कों के बीच पैकेट भेजता है।" },
    pa: { stem: "ਵੱਖ-ਵੱਖ ਨੈੱਟਵਰਕਾਂ ਵਿਚਕਾਰ ਪੈਕੇਟ ਕਿਹੜੀ ਡਿਵਾਈਸ ਭੇਜਦੀ ਹੈ?", options: ["ਹੱਬ", "ਬ੍ਰਿਜ", "ਐਕਸੈਸ ਪੁਆਇੰਟ", "ਰਾਊਟਰ"], explanation: "ਰਾਊਟਰ ਨੈੱਟਵਰਕ ਪਤਿਆਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਵੱਖ-ਵੱਖ ਨੈੱਟਵਰਕਾਂ ਵਿਚਕਾਰ ਪੈਕੇਟ ਭੇਜਦਾ ਹੈ।" },
  },
  {
    id: "COM005-EXT-013", qlId: "COM-005-QL-011", difficulty: "EASY", correctIndex: 1, fact: "packet switching divides data into packets that can travel separately",
    en: { stem: "What does packet switching do?", options: ["Prints packets", "Sends data in separate packets", "Deletes all data", "Changes a screen"], explanation: "Packet switching divides data into packets that can travel through a network." },
    hi: { stem: "पैकेट स्विचिंग क्या करती है?", options: ["पैकेट प्रिंट करती है", "डेटा को अलग-अलग पैकेटों में भेजती है", "सारा डेटा मिटाती है", "स्क्रीन बदलती है"], explanation: "पैकेट स्विचिंग डेटा को पैकेटों में बांटकर नेटवर्क से भेजती है।" },
    pa: { stem: "ਪੈਕੇਟ ਸਵਿੱਚਿੰਗ ਕੀ ਕਰਦੀ ਹੈ?", options: ["ਪੈਕੇਟ ਪ੍ਰਿੰਟ ਕਰਦੀ ਹੈ", "ਡਾਟਾ ਨੂੰ ਵੱਖਰੇ ਪੈਕੇਟਾਂ ਵਿੱਚ ਭੇਜਦੀ ਹੈ", "ਸਾਰਾ ਡਾਟਾ ਮਿਟਾਉਂਦੀ ਹੈ", "ਸਕਰੀਨ ਬਦਲਦੀ ਹੈ"], explanation: "ਪੈਕੇਟ ਸਵਿੱਚਿੰਗ ਡਾਟਾ ਨੂੰ ਪੈਕੇਟਾਂ ਵਿੱਚ ਵੰਡ ਕੇ ਨੈੱਟਵਰਕ ਰਾਹੀਂ ਭੇਜਦੀ ਹੈ।" },
  },
  {
    id: "COM005-EXT-014", qlId: "COM-005-QL-011", difficulty: "EASY", correctIndex: 0, fact: "circuit switching reserves a path for a communication session",
    en: { stem: "Which switching method reserves a path during a communication session?", options: ["Circuit switching", "Packet switching", "File sorting", "Screen sharing"], explanation: "Circuit switching reserves a dedicated path for the communication session." },
    hi: { stem: "संचार सत्र के दौरान कौन-सी स्विचिंग विधि मार्ग सुरक्षित रखती है?", options: ["सर्किट स्विचिंग", "पैकेट स्विचिंग", "फाइल सॉर्टिंग", "स्क्रीन शेयरिंग"], explanation: "सर्किट स्विचिंग संचार सत्र के लिए एक समर्पित मार्ग सुरक्षित रखती है।" },
    pa: { stem: "ਸੰਚਾਰ ਸੈਸ਼ਨ ਦੌਰਾਨ ਕਿਹੜੀ ਸਵਿੱਚਿੰਗ ਵਿਧੀ ਰਸਤਾ ਰਾਖਵਾਂ ਰੱਖਦੀ ਹੈ?", options: ["ਸਰਕਿਟ ਸਵਿੱਚਿੰਗ", "ਪੈਕੇਟ ਸਵਿੱਚਿੰਗ", "ਫਾਇਲ ਸੌਰਟਿੰਗ", "ਸਕਰੀਨ ਸਾਂਝੀ ਕਰਨਾ"], explanation: "ਸਰਕਿਟ ਸਵਿੱਚਿੰਗ ਸੰਚਾਰ ਸੈਸ਼ਨ ਲਈ ਇੱਕ ਸਮਰਪਿਤ ਰਸਤਾ ਰਾਖਵਾਂ ਰੱਖਦੀ ਹੈ।" },
  },
  {
    id: "COM005-EXT-015", qlId: "COM-005-QL-011", difficulty: "MEDIUM", correctIndex: 2, fact: "routing selects a path for packets",
    en: { stem: "What is the main purpose of routing?", options: ["To type a message", "To create a monitor", "To select a path for packets", "To format a document"], explanation: "Routing selects a path for packets to travel from source to destination." },
    hi: { stem: "रूटिंग का मुख्य उद्देश्य क्या है?", options: ["संदेश टाइप करना", "मॉनिटर बनाना", "पैकेटों के लिए मार्ग चुनना", "दस्तावेज फॉर्मेट करना"], explanation: "रूटिंग स्रोत से गंतव्य तक पैकेटों के लिए मार्ग चुनती है।" },
    pa: { stem: "ਰੂਟਿੰਗ ਦਾ ਮੁੱਖ ਉਦੇਸ਼ ਕੀ ਹੈ?", options: ["ਸੁਨੇਹਾ ਟਾਈਪ ਕਰਨਾ", "ਮਾਨੀਟਰ ਬਣਾਉਣਾ", "ਪੈਕੇਟਾਂ ਲਈ ਰਸਤਾ ਚੁਣਨਾ", "ਦਸਤਾਵੇਜ਼ ਫਾਰਮੈਟ ਕਰਨਾ"], explanation: "ਰੂਟਿੰਗ ਸਰੋਤ ਤੋਂ ਮੰਜ਼ਿਲ ਤੱਕ ਪੈਕੇਟਾਂ ਲਈ ਰਸਤਾ ਚੁਣਦੀ ਹੈ।" },
  },
  {
    id: "COM005-EXT-016", qlId: "COM-005-QL-011", difficulty: "MEDIUM", correctIndex: 3, fact: "a switch forwards frames within a local network",
    en: { stem: "Which device usually forwards data within a local network?", options: ["Gateway", "Modem", "Repeater", "Switch"], explanation: "A switch forwards data to the needed device within a local network." },
    hi: { stem: "लोकल नेटवर्क के भीतर डेटा सामान्यतः कौन भेजता है?", options: ["गेटवे", "मोडेम", "रिपीटर", "स्विच"], explanation: "स्विच लोकल नेटवर्क के भीतर डेटा को आवश्यक डिवाइस तक भेजता है।" },
    pa: { stem: "ਲੋਕਲ ਨੈੱਟਵਰਕ ਦੇ ਅੰਦਰ ਡਾਟਾ ਆਮ ਤੌਰ ਉੱਤੇ ਕਿਹੜੀ ਡਿਵਾਈਸ ਭੇਜਦੀ ਹੈ?", options: ["ਗੇਟਵੇ", "ਮੋਡਮ", "ਰੀਪੀਟਰ", "ਸਵਿੱਚ"], explanation: "ਸਵਿੱਚ ਲੋਕਲ ਨੈੱਟਵਰਕ ਦੇ ਅੰਦਰ ਡਾਟਾ ਨੂੰ ਲੋੜੀਂਦੀ ਡਿਵਾਈਸ ਤੱਕ ਭੇਜਦੀ ਹੈ।" },
  },
];

function build(source: Source, language: "en" | "hi" | "pa"): Com005FrozenQuestion {
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
    sourceEnglishAuthorityId: COM005_GAP_EXTENSION_AUTHORITY_V1.authorityId,
    sourceEnglishFrozen: true,
    sourceLocalizationFrozen: true,
  });
}

export const COM005_GAP_EXTENSION_ENGLISH: readonly Com005FrozenQuestion[] = Object.freeze(S.map((source) => build(source, "en")));
export const COM005_GAP_EXTENSION_HINDI: readonly Com005FrozenQuestion[] = Object.freeze(S.map((source) => build(source, "hi")));
export const COM005_GAP_EXTENSION_PUNJABI: readonly Com005FrozenQuestion[] = Object.freeze(S.map((source) => build(source, "pa")));

export function auditCom005GapExtensionV1() {
  const issues: string[] = [];
  const all = [...COM005_GAP_EXTENSION_ENGLISH, ...COM005_GAP_EXTENSION_HINDI, ...COM005_GAP_EXTENSION_PUNJABI];
  if (S.length !== COM005_GAP_EXTENSION_AUTHORITY_V1.questionCountPerLanguage) issues.push("QUESTION_COUNT_MISMATCH");
  if (new Set(S.map((q) => q.qlId)).size !== COM005_GAP_EXTENSION_AUTHORITY_V1.permanentQlIds.length) issues.push("QL_COUNT_MISMATCH");
  for (const q of all) {
    if (q.options.length !== 4 || q.correctIndex < 0 || q.correctIndex > 3) issues.push(`INVALID_OPTIONS:${q.questionId}`);
    if (!q.explanation.trim() || q.explanation.split(/[.!?।॥]+/).filter(Boolean).length > 2) issues.push(`BAD_EXPLANATION:${q.questionId}`);
    if (/^consider the following|^in the following|associated|association/i.test(q.stem + " " + q.explanation)) issues.push(`EDITORIAL_WORDING:${q.questionId}`);
  }
  if (new Set(all.map((q) => q.questionId)).size !== all.length) issues.push("DUPLICATE_QUESTION_ID");
  return { valid: issues.length === 0, issues, counts: { en: COM005_GAP_EXTENSION_ENGLISH.length, hi: COM005_GAP_EXTENSION_HINDI.length, pa: COM005_GAP_EXTENSION_PUNJABI.length } };
}
