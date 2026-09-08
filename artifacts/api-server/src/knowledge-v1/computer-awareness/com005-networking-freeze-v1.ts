import { createHash } from "node:crypto";
import { COM005_ENGLISH_REVIEW_CANDIDATE } from "./com005-english-review-candidate-v1";

export type Com005Language = "en" | "hi" | "pa";
export type Com005FrozenQuestion = {
  questionId: string;
  sourceQuestionId: string;
  qlId: string;
  language: Com005Language;
  locale: "en-IN" | "hi-IN" | "pa-IN";
  difficulty: "EASY" | "MEDIUM";
  stem: string;
  options: readonly string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceFactIds: readonly string[];
  sourceEnglishAuthorityId: string;
  sourceEnglishFrozen: true;
  sourceLocalizationFrozen: true;
};

const SELECTED = Object.freeze([
  1, 2, 3, 4, 13, 14, 15, 16, 17, 18, 25, 26, 27, 28, 29, 30, 31, 32,
  37, 38, 39, 40, 41, 42, 43, 44, 49, 50, 51, 52, 61, 62, 63, 64, 73, 74, 75, 76,
].map((number) => `COM005-EN-${String(number).padStart(3, "0")}`));

export const COM005_ENGLISH_FREEZE_AUTHORITY_V1 = {
  authorityId: "COM-005-ENGLISH-FREEZE-V1",
  chapterCode: "COM-005",
  cpId: "COM-005-CP-001",
  language: "en" as const,
  locale: "en-IN" as const,
  questionCount: 38,
  permanentQlIds: Object.freeze([
    "COM-005-QL-001", "COM-005-QL-002", "COM-005-QL-003", "COM-005-QL-004",
    "COM-005-QL-005", "COM-005-QL-006", "COM-005-QL-007",
  ]),
} as const;

type LocalCopy = { sourceQuestionId: string; stem: string; explanation: string };

const HI: readonly LocalCopy[] = [
  ["001","स्कूल की इमारत को आम तौर पर कौन-सा नेटवर्क कवर करता है?","LAN का पूरा नाम Local Area Network है। यह इमारत जैसे छोटे क्षेत्र को कवर करता है।"],
  ["002","अलग-अलग शहरों के उपकरणों को कौन-सा नेटवर्क जोड़ता है?","WAN का पूरा नाम Wide Area Network है। यह बड़े भौगोलिक क्षेत्र को कवर करता है।"],
  ["003","फोन और स्मार्टवॉच के बीच निजी कनेक्शन आम तौर पर कौन-सा नेटवर्क है?","PAN का पूरा नाम Personal Area Network है। यह एक व्यक्ति के पास मौजूद उपकरणों को जोड़ता है।"],
  ["004","सामान्य वर्गीकरण में LAN से बड़ा और WAN से छोटा नेटवर्क कौन-सा है?","MAN का पूरा नाम Metropolitan Area Network है। यह आम तौर पर एक शहर को कवर करता है।"],
  ["013","कौन-सी टोपोलॉजी में एक केंद्रीय उपकरण होता है?","स्टार टोपोलॉजी में हर उपकरण एक केंद्रीय उपकरण से जुड़ा होता है।"],
  ["014","कौन-सी टोपोलॉजी में एक मुख्य बैकबोन केबल होती है?","बस टोपोलॉजी में सभी उपकरण एक मुख्य केबल साझा करते हैं।"],
  ["015","कौन-सी टोपोलॉजी बंद घेरा बनाती है?","रिंग टोपोलॉजी में उपकरण एक घेरे में जुड़े होते हैं।"],
  ["016","कौन-सी टोपोलॉजी में सभी उपकरणों के बीच सीधे लिंक होते हैं?","मेश टोपोलॉजी उपकरणों के बीच सीधे लिंक देती है।"],
  ["017","केंद्रीय उपकरण खराब होने पर कौन-सी टोपोलॉजी सबसे अधिक प्रभावित होती है?","स्टार टोपोलॉजी में केंद्रीय उपकरण मुख्य कनेक्शन बिंदु होता है।"],
  ["018","कौन-सी टोपोलॉजी स्तरों या शाखाओं में बनी होती है?","ट्री टोपोलॉजी शाखाओं वाले क्रम में बनी होती है।"],
  ["025","अलग-अलग नेटवर्कों को कौन-सा उपकरण जोड़ता है?","राउटर अलग-अलग नेटवर्कों के बीच डेटा भेजता है।"],
  ["026","LAN में डेटा को सही उपकरण तक कौन-सा उपकरण भेजता है?","स्विच लोकल नेटवर्क में डेटा को चुने हुए उपकरण तक भेजता है। LAN का पूरा नाम Local Area Network है।"],
  ["027","आने वाला डेटा सभी जुड़े पोर्टों पर कौन-सा उपकरण भेजता है?","हब आने वाले डेटा को सभी जुड़े पोर्टों पर दोहराता है।"],
  ["028","कमजोर सिग्नल को फिर से मजबूत कौन-सा उपकरण करता है?","रिपीटर सिग्नल को फिर बनाता है ताकि वह अधिक दूरी तक जा सके।"],
  ["029","कंप्यूटर को नेटवर्क से कौन-सा भाग जोड़ता है?","NIC का पूरा नाम Network Interface Card है। यह कंप्यूटर को नेटवर्क कनेक्शन देता है।"],
  ["030","कंप्यूटर और संचार लाइन के बीच सिग्नल कौन-सा उपकरण बदलता है?","मोडेम संचार लाइन के लिए सिग्नल बदलता है।"],
  ["031","दो समान नेटवर्क भागों को कौन-सा उपकरण जोड़ता है?","ब्रिज नेटवर्क भागों को जोड़ता और उनके बीच डेटा छाँटता है।"],
  ["032","पास के उपकरणों को वायरलेस नेटवर्क एक्सेस कौन-सा उपकरण देता है?","एक्सेस पॉइंट वायरलेस उपकरणों को नेटवर्क से जोड़ता है।"],
  ["037","डोमेन नाम को IP पते में कौन-सा प्रोटोकॉल बदलता है?","DNS का पूरा नाम Domain Name System है। यह डोमेन नाम को IP पते में बदलता है; IP का पूरा नाम Internet Protocol है।"],
  ["038","होस्ट को IP सेटिंग अपने आप कौन-सा प्रोटोकॉल देता है?","DHCP का पूरा नाम Dynamic Host Configuration Protocol है। यह नेटवर्क सेटिंग अपने आप देता है।"],
  ["039","फाइल भेजने के लिए कौन-सा प्रोटोकॉल इस्तेमाल होता है?","FTP का पूरा नाम File Transfer Protocol है। इसका उपयोग फाइल भेजने के लिए होता है।"],
  ["040","ई-मेल भेजने के लिए कौन-सा प्रोटोकॉल इस्तेमाल होता है?","SMTP का पूरा नाम Simple Mail Transfer Protocol है। इसका उपयोग ई-मेल भेजने के लिए होता है।"],
  ["041","पैकेट भेजने के लिए तार्किक पता कौन-सा प्रोटोकॉल देता है?","IP का पूरा नाम Internet Protocol है। यह नेटवर्क पर तार्किक पता देता है।"],
  ["042","विश्वसनीय और क्रमबद्ध डेटा डिलीवरी कौन-सा प्रोटोकॉल देता है?","TCP का पूरा नाम Transmission Control Protocol है। यह विश्वसनीय और क्रमबद्ध डेटा डिलीवरी में मदद करता है।"],
  ["043","DNS मुख्य रूप से क्या पता करता है?","DNS का पूरा नाम Domain Name System है। यह डोमेन नाम से नेटवर्क पते की जानकारी पता करता है।"],
  ["044","DHCP का मुख्य काम क्या है?","DHCP का पूरा नाम Dynamic Host Configuration Protocol है। यह IP पते जैसी नेटवर्क सेटिंग देता है।"],
  ["049","हार्डवेयर स्तर पर नेटवर्क इंटरफेस की पहचान कौन-सा पता करता है?","MAC का पूरा नाम Media Access Control है। MAC पता नेटवर्क इंटरफेस की पहचान करता है।"],
  ["050","इंटरनेट संसाधन के पढ़ने योग्य नाम को क्या कहते हैं?","डोमेन नाम इंटरनेट संसाधन का पढ़ने योग्य नाम होता है।"],
  ["051","तार्किक नेटवर्क पते के लिए कौन-सा पता इस्तेमाल होता है?","IP का पूरा नाम Internet Protocol है। IP पता नेटवर्क पर तार्किक पता देता है।"],
  ["052","नेटवर्क कार्ड से कौन-सा पता जुड़ा होता है?","MAC का पूरा नाम Media Access Control है। MAC पता नेटवर्क इंटरफेस से जुड़ा होता है।"],
  ["061","कौन-सा माध्यम प्रकाश से डेटा ले जाता है?","ऑप्टिकल फाइबर प्रकाश के रूप में डेटा ले जाता है।"],
  ["062","कौन-सा विकल्प वायरलेस माध्यम है?","रेडियो तरंगें हवा के माध्यम से डेटा भेजती हैं।"],
  ["063","किस माध्यम में तांबे के तारों की मुड़ी हुई जोड़ियाँ होती हैं?","ट्विस्टेड-पेयर केबल में तांबे के तारों की मुड़ी हुई जोड़ियाँ होती हैं।"],
  ["064","किस केबल में बीच का चालक और उसके चारों ओर शील्ड होती है?","कोएक्सियल केबल में बीच का चालक और उसके चारों ओर शील्ड होती है।"],
  ["073","कौन-सा मोड केवल एक दिशा में डेटा भेजता है?","सिम्प्लेक्स मोड में डेटा केवल एक दिशा में जाता है।"],
  ["074","कौन-सा मोड दोनों दिशाओं में एक साथ डेटा भेजता है?","फुल-डुप्लेक्स मोड में दोनों पक्ष एक ही समय पर डेटा भेज सकते हैं।"],
  ["075","कौन-सा मोड दोनों दिशाओं में, लेकिन एक समय में एक दिशा में डेटा भेजता है?","हाफ-डुप्लेक्स मोड में दोनों दिशाओं में बारी-बारी डेटा भेजा जाता है।"],
  ["076","केवल एक तरफ जाने वाला संचार कौन-सा मोड है?","सिम्प्लेक्स एक दिशा वाला संचार मोड है।"],
].map(([n, stem, explanation]) => ({ sourceQuestionId: `COM005-EN-${n}`, stem, explanation }));

const PA: readonly LocalCopy[] = [
  ["001","ਸਕੂਲ ਦੀ ਇਮਾਰਤ ਨੂੰ ਆਮ ਤੌਰ ਉੱਤੇ ਕਿਹੜਾ ਨੈੱਟਵਰਕ ਕਵਰ ਕਰਦਾ ਹੈ?","LAN ਦਾ ਪੂਰਾ ਨਾਮ Local Area Network ਹੈ। ਇਹ ਇਮਾਰਤ ਵਰਗੇ ਛੋਟੇ ਖੇਤਰ ਨੂੰ ਕਵਰ ਕਰਦਾ ਹੈ।"],
  ["002","ਵੱਖ-ਵੱਖ ਸ਼ਹਿਰਾਂ ਦੇ ਉਪਕਰਣਾਂ ਨੂੰ ਕਿਹੜਾ ਨੈੱਟਵਰਕ ਜੋੜਦਾ ਹੈ?","WAN ਦਾ ਪੂਰਾ ਨਾਮ Wide Area Network ਹੈ। ਇਹ ਵੱਡੇ ਭੂਗੋਲਿਕ ਖੇਤਰ ਨੂੰ ਕਵਰ ਕਰਦਾ ਹੈ।"],
  ["003","ਫੋਨ ਅਤੇ ਸਮਾਰਟਵਾਚ ਵਿਚਕਾਰ ਨਿੱਜੀ ਕਨੈਕਸ਼ਨ ਆਮ ਤੌਰ ਉੱਤੇ ਕਿਹੜਾ ਨੈੱਟਵਰਕ ਹੈ?","PAN ਦਾ ਪੂਰਾ ਨਾਮ Personal Area Network ਹੈ। ਇਹ ਇੱਕ ਵਿਅਕਤੀ ਦੇ ਨੇੜੇ ਵਾਲੇ ਉਪਕਰਣ ਜੋੜਦਾ ਹੈ।"],
  ["004","ਆਮ ਵਰਗੀਕਰਨ ਵਿੱਚ LAN ਤੋਂ ਵੱਡਾ ਅਤੇ WAN ਤੋਂ ਛੋਟਾ ਨੈੱਟਵਰਕ ਕਿਹੜਾ ਹੈ?","MAN ਦਾ ਪੂਰਾ ਨਾਮ Metropolitan Area Network ਹੈ। ਇਹ ਆਮ ਤੌਰ ਉੱਤੇ ਇੱਕ ਸ਼ਹਿਰ ਨੂੰ ਕਵਰ ਕਰਦਾ ਹੈ।"],
  ["013","ਕਿਹੜੀ ਟੋਪੋਲੋਜੀ ਵਿੱਚ ਇੱਕ ਕੇਂਦਰੀ ਉਪਕਰਣ ਹੁੰਦਾ ਹੈ?","ਸਟਾਰ ਟੋਪੋਲੋਜੀ ਵਿੱਚ ਹਰ ਉਪਕਰਣ ਇੱਕ ਕੇਂਦਰੀ ਉਪਕਰਣ ਨਾਲ ਜੁੜਦਾ ਹੈ।"],
  ["014","ਕਿਹੜੀ ਟੋਪੋਲੋਜੀ ਵਿੱਚ ਇੱਕ ਮੁੱਖ ਬੈਕਬੋਨ ਕੇਬਲ ਹੁੰਦੀ ਹੈ?","ਬੱਸ ਟੋਪੋਲੋਜੀ ਵਿੱਚ ਸਾਰੇ ਉਪਕਰਣ ਇੱਕ ਮੁੱਖ ਕੇਬਲ ਸਾਂਝੀ ਕਰਦੇ ਹਨ।"],
  ["015","ਕਿਹੜੀ ਟੋਪੋਲੋਜੀ ਬੰਦ ਘੇਰਾ ਬਣਾਉਂਦੀ ਹੈ?","ਰਿੰਗ ਟੋਪੋਲੋਜੀ ਵਿੱਚ ਉਪਕਰਣ ਇੱਕ ਘੇਰੇ ਵਿੱਚ ਜੁੜੇ ਹੁੰਦੇ ਹਨ।"],
  ["016","ਕਿਹੜੀ ਟੋਪੋਲੋਜੀ ਵਿੱਚ ਸਾਰੇ ਉਪਕਰਣਾਂ ਵਿਚਕਾਰ ਸਿੱਧੇ ਲਿੰਕ ਹੁੰਦੇ ਹਨ?","ਮੇਸ਼ ਟੋਪੋਲੋਜੀ ਉਪਕਰਣਾਂ ਵਿਚਕਾਰ ਸਿੱਧੇ ਲਿੰਕ ਦਿੰਦੀ ਹੈ।"],
  ["017","ਕੇਂਦਰੀ ਉਪਕਰਣ ਖਰਾਬ ਹੋਣ ਨਾਲ ਕਿਹੜੀ ਟੋਪੋਲੋਜੀ ਸਭ ਤੋਂ ਵੱਧ ਪ੍ਰਭਾਵਿਤ ਹੁੰਦੀ ਹੈ?","ਸਟਾਰ ਟੋਪੋਲੋਜੀ ਵਿੱਚ ਕੇਂਦਰੀ ਉਪਕਰਣ ਮੁੱਖ ਕਨੈਕਸ਼ਨ ਬਿੰਦੂ ਹੁੰਦਾ ਹੈ।"],
  ["018","ਕਿਹੜੀ ਟੋਪੋਲੋਜੀ ਪੱਧਰਾਂ ਜਾਂ ਸ਼ਾਖਾਂ ਵਿੱਚ ਬਣੀ ਹੁੰਦੀ ਹੈ?","ਟ੍ਰੀ ਟੋਪੋਲੋਜੀ ਸ਼ਾਖਾਂ ਵਾਲੇ ਕ੍ਰਮ ਵਿੱਚ ਬਣੀ ਹੁੰਦੀ ਹੈ।"],
  ["025","ਵੱਖ-ਵੱਖ ਨੈੱਟਵਰਕਾਂ ਨੂੰ ਕਿਹੜਾ ਉਪਕਰਣ ਜੋੜਦਾ ਹੈ?","ਰਾਊਟਰ ਵੱਖ-ਵੱਖ ਨੈੱਟਵਰਕਾਂ ਵਿਚਕਾਰ ਡਾਟਾ ਭੇਜਦਾ ਹੈ।"],
  ["026","LAN ਵਿੱਚ ਡਾਟਾ ਸਹੀ ਉਪਕਰਣ ਤੱਕ ਕਿਹੜਾ ਉਪਕਰਣ ਭੇਜਦਾ ਹੈ?","ਸਵਿੱਚ ਲੋਕਲ ਨੈੱਟਵਰਕ ਵਿੱਚ ਡਾਟਾ ਚੁਣੇ ਉਪਕਰਣ ਤੱਕ ਭੇਜਦਾ ਹੈ। LAN ਦਾ ਪੂਰਾ ਨਾਮ Local Area Network ਹੈ।"],
  ["027","ਆਉਣ ਵਾਲਾ ਡਾਟਾ ਸਾਰੇ ਜੁੜੇ ਪੋਰਟਾਂ ਉੱਤੇ ਕਿਹੜਾ ਉਪਕਰਣ ਭੇਜਦਾ ਹੈ?","ਹੱਬ ਆਉਣ ਵਾਲਾ ਡਾਟਾ ਸਾਰੇ ਜੁੜੇ ਪੋਰਟਾਂ ਉੱਤੇ ਦੁਹਰਾਉਂਦਾ ਹੈ।"],
  ["028","ਕਮਜ਼ੋਰ ਸਿਗਨਲ ਨੂੰ ਮੁੜ ਮਜ਼ਬੂਤ ਕਿਹੜਾ ਉਪਕਰਣ ਕਰਦਾ ਹੈ?","ਰੀਪੀਟਰ ਸਿਗਨਲ ਨੂੰ ਮੁੜ ਬਣਾਉਂਦਾ ਹੈ ਤਾਂ ਜੋ ਉਹ ਹੋਰ ਦੂਰ ਜਾ ਸਕੇ।"],
  ["029","ਕੰਪਿਊਟਰ ਨੂੰ ਨੈੱਟਵਰਕ ਨਾਲ ਕਿਹੜਾ ਭਾਗ ਜੋੜਦਾ ਹੈ?","NIC ਦਾ ਪੂਰਾ ਨਾਮ Network Interface Card ਹੈ। ਇਹ ਕੰਪਿਊਟਰ ਨੂੰ ਨੈੱਟਵਰਕ ਕਨੈਕਸ਼ਨ ਦਿੰਦਾ ਹੈ।"],
  ["030","ਕੰਪਿਊਟਰ ਅਤੇ ਸੰਚਾਰ ਲਾਈਨ ਵਿਚਕਾਰ ਸਿਗਨਲ ਕਿਹੜਾ ਉਪਕਰਣ ਬਦਲਦਾ ਹੈ?","ਮੋਡਮ ਸੰਚਾਰ ਲਾਈਨ ਲਈ ਸਿਗਨਲ ਬਦਲਦਾ ਹੈ।"],
  ["031","ਦੋ ਇੱਕੋ ਜਿਹੇ ਨੈੱਟਵਰਕ ਭਾਗਾਂ ਨੂੰ ਕਿਹੜਾ ਉਪਕਰਣ ਜੋੜਦਾ ਹੈ?","ਬ੍ਰਿਜ ਨੈੱਟਵਰਕ ਭਾਗਾਂ ਨੂੰ ਜੋੜਦਾ ਅਤੇ ਉਨ੍ਹਾਂ ਵਿਚਕਾਰ ਡਾਟਾ ਛਾਂਟਦਾ ਹੈ।"],
  ["032","ਨੇੜੇ ਦੇ ਉਪਕਰਣਾਂ ਨੂੰ ਵਾਇਰਲੈੱਸ ਨੈੱਟਵਰਕ ਪਹੁੰਚ ਕਿਹੜਾ ਉਪਕਰਣ ਦਿੰਦਾ ਹੈ?","ਐਕਸੈੱਸ ਪੌਇੰਟ ਵਾਇਰਲੈੱਸ ਉਪਕਰਣਾਂ ਨੂੰ ਨੈੱਟਵਰਕ ਨਾਲ ਜੋੜਦਾ ਹੈ।"],
  ["037","ਡੋਮੇਨ ਨਾਮ ਨੂੰ IP ਪਤੇ ਵਿੱਚ ਕਿਹੜਾ ਪ੍ਰੋਟੋਕੋਲ ਬਦਲਦਾ ਹੈ?","DNS ਦਾ ਪੂਰਾ ਨਾਮ Domain Name System ਹੈ। ਇਹ ਡੋਮੇਨ ਨਾਮ ਨੂੰ IP ਪਤੇ ਵਿੱਚ ਬਦਲਦਾ ਹੈ; IP ਦਾ ਪੂਰਾ ਨਾਮ Internet Protocol ਹੈ।"],
  ["038","ਹੋਸਟ ਨੂੰ IP ਸੈਟਿੰਗ ਆਪਣੇ ਆਪ ਕਿਹੜਾ ਪ੍ਰੋਟੋਕੋਲ ਦਿੰਦਾ ਹੈ?","DHCP ਦਾ ਪੂਰਾ ਨਾਮ Dynamic Host Configuration Protocol ਹੈ। ਇਹ ਨੈੱਟਵਰਕ ਸੈਟਿੰਗ ਆਪਣੇ ਆਪ ਦਿੰਦਾ ਹੈ।"],
  ["039","ਫਾਈਲ ਭੇਜਣ ਲਈ ਕਿਹੜਾ ਪ੍ਰੋਟੋਕੋਲ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?","FTP ਦਾ ਪੂਰਾ ਨਾਮ File Transfer Protocol ਹੈ। ਇਹ ਫਾਈਲ ਭੇਜਣ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।"],
  ["040","ਈ-ਮੇਲ ਭੇਜਣ ਲਈ ਕਿਹੜਾ ਪ੍ਰੋਟੋਕੋਲ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?","SMTP ਦਾ ਪੂਰਾ ਨਾਮ Simple Mail Transfer Protocol ਹੈ। ਇਹ ਈ-ਮੇਲ ਭੇਜਣ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।"],
  ["041","ਪੈਕੇਟ ਭੇਜਣ ਲਈ ਤਰਕ ਵਾਲਾ ਪਤਾ ਕਿਹੜਾ ਪ੍ਰੋਟੋਕੋਲ ਦਿੰਦਾ ਹੈ?","IP ਦਾ ਪੂਰਾ ਨਾਮ Internet Protocol ਹੈ। ਇਹ ਨੈੱਟਵਰਕ ਉੱਤੇ ਤਰਕ ਵਾਲਾ ਪਤਾ ਦਿੰਦਾ ਹੈ।"],
  ["042","ਭਰੋਸੇਯੋਗ ਅਤੇ ਕ੍ਰਮਵਾਰ ਡਾਟਾ ਡਿਲੀਵਰੀ ਕਿਹੜਾ ਪ੍ਰੋਟੋਕੋਲ ਦਿੰਦਾ ਹੈ?","TCP ਦਾ ਪੂਰਾ ਨਾਮ Transmission Control Protocol ਹੈ। ਇਹ ਭਰੋਸੇਯੋਗ ਅਤੇ ਕ੍ਰਮਵਾਰ ਡਾਟਾ ਡਿਲੀਵਰੀ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।"],
  ["043","DNS ਮੁੱਖ ਤੌਰ ਉੱਤੇ ਕੀ ਲੱਭਦਾ ਹੈ?","DNS ਦਾ ਪੂਰਾ ਨਾਮ Domain Name System ਹੈ। ਇਹ ਡੋਮੇਨ ਨਾਮ ਤੋਂ ਨੈੱਟਵਰਕ ਪਤੇ ਦੀ ਜਾਣਕਾਰੀ ਲੱਭਦਾ ਹੈ।"],
  ["044","DHCP ਦਾ ਮੁੱਖ ਕੰਮ ਕੀ ਹੈ?","DHCP ਦਾ ਪੂਰਾ ਨਾਮ Dynamic Host Configuration Protocol ਹੈ। ਇਹ IP ਪਤੇ ਵਰਗੀਆਂ ਨੈੱਟਵਰਕ ਸੈਟਿੰਗਾਂ ਦਿੰਦਾ ਹੈ।"],
  ["049","ਹਾਰਡਵੇਅਰ ਪੱਧਰ ਉੱਤੇ ਨੈੱਟਵਰਕ ਇੰਟਰਫੇਸ ਦੀ ਪਛਾਣ ਕਿਹੜਾ ਪਤਾ ਕਰਦਾ ਹੈ?","MAC ਦਾ ਪੂਰਾ ਨਾਮ Media Access Control ਹੈ। MAC ਪਤਾ ਨੈੱਟਵਰਕ ਇੰਟਰਫੇਸ ਦੀ ਪਛਾਣ ਕਰਦਾ ਹੈ।"],
  ["050","ਇੰਟਰਨੈੱਟ ਸਰੋਤ ਦੇ ਪੜ੍ਹਨ ਯੋਗ ਨਾਮ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?","ਡੋਮੇਨ ਨਾਮ ਇੰਟਰਨੈੱਟ ਸਰੋਤ ਦਾ ਪੜ੍ਹਨ ਯੋਗ ਨਾਮ ਹੁੰਦਾ ਹੈ।"],
  ["051","ਤਰਕ ਵਾਲੇ ਨੈੱਟਵਰਕ ਪਤੇ ਲਈ ਕਿਹੜਾ ਪਤਾ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?","IP ਦਾ ਪੂਰਾ ਨਾਮ Internet Protocol ਹੈ। IP ਪਤਾ ਨੈੱਟਵਰਕ ਉੱਤੇ ਤਰਕ ਵਾਲਾ ਪਤਾ ਦਿੰਦਾ ਹੈ।"],
  ["052","ਨੈੱਟਵਰਕ ਕਾਰਡ ਨਾਲ ਕਿਹੜਾ ਪਤਾ ਜੁੜਿਆ ਹੁੰਦਾ ਹੈ?","MAC ਦਾ ਪੂਰਾ ਨਾਮ Media Access Control ਹੈ। MAC ਪਤਾ ਨੈੱਟਵਰਕ ਇੰਟਰਫੇਸ ਨਾਲ ਜੁੜਿਆ ਹੁੰਦਾ ਹੈ।"],
  ["061","ਕਿਹੜਾ ਮਾਧਿਅਮ ਰੋਸ਼ਨੀ ਨਾਲ ਡਾਟਾ ਲੈ ਜਾਂਦਾ ਹੈ?","ਆਪਟੀਕਲ ਫਾਈਬਰ ਰੋਸ਼ਨੀ ਦੇ ਰੂਪ ਵਿੱਚ ਡਾਟਾ ਲੈ ਜਾਂਦਾ ਹੈ।"],
  ["062","ਕਿਹੜਾ ਵਿਕਲਪ ਵਾਇਰਲੈੱਸ ਮਾਧਿਅਮ ਹੈ?","ਰੇਡੀਓ ਤਰੰਗਾਂ ਹਵਾ ਰਾਹੀਂ ਡਾਟਾ ਭੇਜਦੀਆਂ ਹਨ।"],
  ["063","ਕਿਸ ਮਾਧਿਅਮ ਵਿੱਚ ਤਾਂਬੇ ਦੀਆਂ ਤਾਰਾਂ ਦੇ ਮਰੋੜੇ ਹੋਏ ਜੋੜੇ ਹੁੰਦੇ ਹਨ?","ਟਵਿਸਟਡ-ਪੇਅਰ ਕੇਬਲ ਵਿੱਚ ਤਾਂਬੇ ਦੀਆਂ ਤਾਰਾਂ ਦੇ ਮਰੋੜੇ ਹੋਏ ਜੋੜੇ ਹੁੰਦੇ ਹਨ।"],
  ["064","ਕਿਸ ਕੇਬਲ ਵਿੱਚ ਵਿਚਕਾਰਲਾ ਚਾਲਕ ਅਤੇ ਉਸ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਸ਼ੀਲਡ ਹੁੰਦੀ ਹੈ?","ਕੋਐਕਸੀਅਲ ਕੇਬਲ ਵਿੱਚ ਵਿਚਕਾਰਲਾ ਚਾਲਕ ਅਤੇ ਉਸ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਸ਼ੀਲਡ ਹੁੰਦੀ ਹੈ।"],
  ["073","ਕਿਹੜਾ ਮੋਡ ਸਿਰਫ਼ ਇੱਕ ਦਿਸ਼ਾ ਵਿੱਚ ਡਾਟਾ ਭੇਜਦਾ ਹੈ?","ਸਿੰਪਲੈਕਸ ਮੋਡ ਵਿੱਚ ਡਾਟਾ ਸਿਰਫ਼ ਇੱਕ ਦਿਸ਼ਾ ਵਿੱਚ ਜਾਂਦਾ ਹੈ।"],
  ["074","ਕਿਹੜਾ ਮੋਡ ਦੋਵੇਂ ਦਿਸ਼ਾਵਾਂ ਵਿੱਚ ਇੱਕੋ ਸਮੇਂ ਡਾਟਾ ਭੇਜਦਾ ਹੈ?","ਫੁੱਲ-ਡੁਪਲੈਕਸ ਮੋਡ ਵਿੱਚ ਦੋਵੇਂ ਪਾਸੇ ਇੱਕੋ ਸਮੇਂ ਡਾਟਾ ਭੇਜ ਸਕਦੇ ਹਨ।"],
  ["075","ਕਿਹੜਾ ਮੋਡ ਦੋਵੇਂ ਦਿਸ਼ਾਵਾਂ ਵਿੱਚ, ਪਰ ਇੱਕ ਸਮੇਂ ਇੱਕ ਦਿਸ਼ਾ ਵਿੱਚ ਡਾਟਾ ਭੇਜਦਾ ਹੈ?","ਹਾਫ-ਡੁਪਲੈਕਸ ਮੋਡ ਵਿੱਚ ਦੋਵੇਂ ਦਿਸ਼ਾਵਾਂ ਵਿੱਚ ਵਾਰੀ-ਵਾਰੀ ਡਾਟਾ ਭੇਜਿਆ ਜਾਂਦਾ ਹੈ।"],
  ["076","ਸਿਰਫ਼ ਇੱਕ ਪਾਸੇ ਜਾਣ ਵਾਲਾ ਸੰਚਾਰ ਕਿਹੜਾ ਮੋਡ ਹੈ?","ਸਿੰਪਲੈਕਸ ਇੱਕ ਦਿਸ਼ਾ ਵਾਲਾ ਸੰਚਾਰ ਮੋਡ ਹੈ।"],
].map(([n, stem, explanation]) => ({ sourceQuestionId: `COM005-EN-${n}`, stem, explanation }));

const HI_TERMS: Record<string, string> = {
  "Access point":"एक्सेस पॉइंट","Assign network settings":"नेटवर्क सेटिंग देना","Bridge":"ब्रिज","Broadcast":"ब्रॉडकास्ट","Bus":"बस","CAN":"CAN",
  "Coaxial cable":"कोएक्सियल केबल","DHCP":"DHCP","DNS":"DNS","Display web pages":"वेब पेज दिखाना","Domain name":"डोमेन नाम","Domain names":"डोमेन नाम",
  "FTP":"FTP","File sizes":"फाइल का आकार","Frame":"फ्रेम","Full-duplex":"फुल-डुप्लेक्स","Gateway":"गेटवे","HTTP":"HTTP","Half-duplex":"हाफ-डुप्लेक्स",
  "Hub":"हब","IP":"IP","IP address":"IP पता","LAN":"LAN","MAC address":"MAC पता","MAN":"MAN","Mesh":"मेश","Modem":"मोडेम","Multicast":"मल्टीकास्ट",
  "Multiplex":"मल्टीप्लेक्स","NIC":"NIC","Optical fibre":"ऑप्टिकल फाइबर","PAN":"PAN","Port number":"पोर्ट नंबर","Power levels":"पावर स्तर",
  "Protocol":"प्रोटोकॉल","Radio wave":"रेडियो तरंग","Repeater":"रिपीटर","Ring":"रिंग","Router":"राउटर","SAN":"SAN","SMTP":"SMTP",
  "Satellite signal":"सैटेलाइट सिग्नल","Screen settings":"स्क्रीन सेटिंग","Send e-mail":"ई-मेल भेजना","Simplex":"सिम्प्लेक्स","Star":"स्टार",
  "Subnet mask":"सबनेट मास्क","Switch":"स्विच","TCP":"TCP","Transfer files":"फाइल भेजना","Tree":"ट्री","Twisted pair":"ट्विस्टेड पेयर",
  "Twisted-pair cable":"ट्विस्टेड-पेयर केबल","URL":"URL","WAN":"WAN",
};
const PA_TERMS: Record<string, string> = {
  "Access point":"ਐਕਸੈੱਸ ਪੌਇੰਟ","Assign network settings":"ਨੈੱਟਵਰਕ ਸੈਟਿੰਗ ਦੇਣਾ","Bridge":"ਬ੍ਰਿਜ","Broadcast":"ਬ੍ਰਾਡਕਾਸਟ","Bus":"ਬੱਸ","CAN":"CAN",
  "Coaxial cable":"ਕੋਐਕਸੀਅਲ ਕੇਬਲ","DHCP":"DHCP","DNS":"DNS","Display web pages":"ਵੈੱਬ ਪੇਜ ਦਿਖਾਉਣਾ","Domain name":"ਡੋਮੇਨ ਨਾਮ","Domain names":"ਡੋਮੇਨ ਨਾਮ",
  "FTP":"FTP","File sizes":"ਫਾਈਲ ਦਾ ਆਕਾਰ","Frame":"ਫਰੇਮ","Full-duplex":"ਫੁੱਲ-ਡੁਪਲੈਕਸ","Gateway":"ਗੇਟਵੇ","HTTP":"HTTP","Half-duplex":"ਹਾਫ-ਡੁਪਲੈਕਸ",
  "Hub":"ਹੱਬ","IP":"IP","IP address":"IP ਪਤਾ","LAN":"LAN","MAC address":"MAC ਪਤਾ","MAN":"MAN","Mesh":"ਮੇਸ਼","Modem":"ਮੋਡਮ","Multicast":"ਮਲਟੀਕਾਸਟ",
  "Multiplex":"ਮਲਟੀਪਲੈਕਸ","NIC":"NIC","Optical fibre":"ਆਪਟੀਕਲ ਫਾਈਬਰ","PAN":"PAN","Port number":"ਪੋਰਟ ਨੰਬਰ","Power levels":"ਪਾਵਰ ਪੱਧਰ",
  "Protocol":"ਪ੍ਰੋਟੋਕੋਲ","Radio wave":"ਰੇਡੀਓ ਤਰੰਗ","Repeater":"ਰੀਪੀਟਰ","Ring":"ਰਿੰਗ","Router":"ਰਾਊਟਰ","SAN":"SAN","SMTP":"SMTP",
  "Satellite signal":"ਸੈਟੇਲਾਈਟ ਸਿਗਨਲ","Screen settings":"ਸਕਰੀਨ ਸੈਟਿੰਗ","Send e-mail":"ਈ-ਮੇਲ ਭੇਜਣਾ","Simplex":"ਸਿੰਪਲੈਕਸ","Star":"ਸਟਾਰ",
  "Subnet mask":"ਸਬਨੈੱਟ ਮਾਸਕ","Switch":"ਸਵਿੱਚ","TCP":"TCP","Transfer files":"ਫਾਈਲ ਭੇਜਣਾ","Tree":"ਟ੍ਰੀ","Twisted pair":"ਟਵਿਸਟਡ ਪੇਅਰ",
  "Twisted-pair cable":"ਟਵਿਸਟਡ-ਪੇਅਰ ਕੇਬਲ","URL":"URL","WAN":"WAN",
};

const englishById = new Map(COM005_ENGLISH_REVIEW_CANDIDATE.map((question) => [question.questionId, question]));
function placeAnswer(options: readonly string[], answer: string, target: number) {
  const rest = options.filter((option) => option !== answer);
  const ordered = [...rest];
  ordered.splice(target, 0, answer);
  return Object.freeze(ordered);
}
function translateOptions(options: readonly string[], terms: Record<string, string>) {
  return options.map((option) => terms[option] ?? option);
}

export const COM005_ENGLISH_FROZEN: readonly Com005FrozenQuestion[] = Object.freeze(SELECTED.map((id, index) => {
  const source = englishById.get(id);
  if (!source) throw new Error(`COM-005 source missing: ${id}`);
  const target = index % 4;
  const options = placeAnswer(source.options, source.canonicalAnswer, target);
  return Object.freeze({
    questionId: source.questionId,
    sourceQuestionId: source.questionId,
    qlId: source.qlId.replace("COM005-", "COM-005-"),
    language: "en" as const,
    locale: "en-IN" as const,
    difficulty: source.difficulty,
    stem: source.stem,
    options,
    correctIndex: target,
    canonicalAnswer: source.canonicalAnswer,
    explanation: source.explanation,
    sourceFactIds: Object.freeze([source.sourceFactId]),
    sourceEnglishAuthorityId: COM005_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
    sourceEnglishFrozen: true as const,
    sourceLocalizationFrozen: true as const,
  });
}));

function buildLocalization(language: "hi" | "pa", copies: readonly LocalCopy[], terms: Record<string, string>): readonly Com005FrozenQuestion[] {
  const copyById = new Map(copies.map((copy) => [copy.sourceQuestionId, copy]));
  return Object.freeze(COM005_ENGLISH_FROZEN.map((source, index) => {
    const copy = copyById.get(source.sourceQuestionId);
    if (!copy) throw new Error(`COM-005 ${language} copy missing: ${source.sourceQuestionId}`);
    const original = englishById.get(source.sourceQuestionId)!;
    const translatedOptions = translateOptions(original.options, terms);
    const translatedAnswer = terms[original.canonicalAnswer] ?? original.canonicalAnswer;
    const options = placeAnswer(translatedOptions, translatedAnswer, source.correctIndex);
    return Object.freeze({
      ...source,
      questionId: `COM005-${language.toUpperCase()}-${String(index + 1).padStart(3, "0")}`,
      language,
      locale: language === "hi" ? "hi-IN" as const : "pa-IN" as const,
      stem: copy.stem,
      options,
      canonicalAnswer: translatedAnswer,
      explanation: copy.explanation,
    });
  }));
}

export const COM005_HINDI_FROZEN = buildLocalization("hi", HI, HI_TERMS);
export const COM005_PUNJABI_FROZEN = buildLocalization("pa", PA, PA_TERMS);

export const COM005_LOCALIZATION_FREEZE_AUTHORITY_V1 = {
  authorityId: "COM-005-HI-PA-LOCALIZATION-FREEZE-V1",
  predecessorAuthorityId: COM005_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
  languageCounts: Object.freeze({ en: 38, hi: 38, pa: 38 }),
  questionCountPerLanguage: 38,
  combinedFingerprint: createHash("sha256")
    .update(JSON.stringify([...COM005_ENGLISH_FROZEN, ...COM005_HINDI_FROZEN, ...COM005_PUNJABI_FROZEN]))
    .digest("hex"),
} as const;

export function auditCom005FreezeV1() {
  const corpora = [COM005_ENGLISH_FROZEN, COM005_HINDI_FROZEN, COM005_PUNJABI_FROZEN];
  const issues: string[] = [];
  for (const corpus of corpora) {
    if (corpus.length !== 38) issues.push(`COUNT:${corpus[0]?.language}`);
    for (const question of corpus) {
      if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push(`OPTIONS:${question.questionId}`);
      if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER:${question.questionId}`);
      if (/associated|which of the following|consider the following/i.test(`${question.stem} ${question.explanation}`)) issues.push(`EDITORIAL:${question.questionId}`);
      if (question.explanation.split(/[.!?।]/).filter(Boolean).length > 2) issues.push(`EXPLANATION_LENGTH:${question.questionId}`);
    }
  }
  const sourceSequences = corpora.map((corpus) => corpus.map((question) => question.sourceQuestionId).join("|"));
  if (new Set(sourceSequences).size !== 1) issues.push("SOURCE_PARITY");
  return { valid: issues.length === 0, issues, englishCount: 38, hindiCount: 38, punjabiCount: 38, qlCount: 7 };
}
