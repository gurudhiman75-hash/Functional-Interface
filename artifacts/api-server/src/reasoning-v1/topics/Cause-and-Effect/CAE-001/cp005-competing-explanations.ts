import type {
  CaeDifficulty,
  CaeDifficultyEvidence,
  CaeDistractorRole,
  CaeLocale,
  CaeRenderedOption,
  GeneratedCaeQuestion,
  LocalizedText,
} from "./types.ts";

type Fit = "CLOSE" | "CLEAR_REJECT";
type Candidate = Readonly<{
  id: string;
  text: LocalizedText;
  isCorrect: boolean;
  fit: Fit;
  mechanism?: CaeDistractorRole;
}>;
type Scenario = Readonly<{
  id: string;
  observation: LocalizedText;
  evidence: LocalizedText;
  explanation: LocalizedText;
  difficulty: CaeDifficulty;
  candidates: readonly Candidate[];
}>;

const l = (en: string, hi: string, pa: string): LocalizedText => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa });
const c = (id: string, en: string, hi: string, pa: string, isCorrect: boolean, fit: Fit, mechanism?: CaeDistractorRole): Candidate => ({ id, text: l(en, hi, pa), isCorrect, fit, mechanism });

/**
 * Human-calibrated CP-005 review corpus.
 *
 * Distractors are deliberately complete causes that could explain the same
 * broad outcome. HARD items carry at least two close alternatives; the learner
 * must use the supplied timing/scope/mechanism evidence to select the best fit.
 */
export const CP005_COMPETING_SCENARIOS: readonly Scenario[] = Object.freeze([
  {
    id: "metro-corridor-shift",
    difficulty: "HARD",
    observation: l("Metro use at stations along the east corridor rose sharply during the evening peak.", "पूर्वी गलियारे के स्टेशनों पर शाम के व्यस्त समय में मेट्रो का उपयोग तेजी से बढ़ गया।", "ਪੂਰਬੀ ਕੌਰੀਡੋਰ ਦੇ ਸਟੇਸ਼ਨਾਂ ਉੱਤੇ ਸ਼ਾਮ ਦੇ ਰੁਸ਼ ਸਮੇਂ ਮੈਟਰੋ ਦੀ ਵਰਤੋਂ ਤੇਜ਼ੀ ਨਾਲ ਵੱਧ ਗਈ।"),
    evidence: l("Road travel time almost doubled, and the longest queues formed immediately before the river crossing.", "सड़क यात्रा का समय लगभग दोगुना हो गया और सबसे लंबी कतारें नदी पार करने वाले स्थान से ठीक पहले बनीं।", "ਸੜਕ ਯਾਤਰਾ ਦਾ ਸਮਾਂ ਲਗਭਗ ਦੋਗੁਣਾ ਹੋ ਗਿਆ ਅਤੇ ਸਭ ਤੋਂ ਲੰਬੀਆਂ ਕਤਾਰਾਂ ਦਰਿਆ ਪਾਰ ਕਰਨ ਵਾਲੀ ਥਾਂ ਤੋਂ ਠੀਕ ਪਹਿਲਾਂ ਬਣੀਆਂ।"),
    explanation: l("Closing the bridge best explains both the concentrated road queue before the crossing and the simultaneous shift to nearby metro stations.", "पुल बंद होना नदी पार करने से पहले बनी केंद्रित सड़क कतार और पास के मेट्रो स्टेशनों की ओर एक साथ हुए बदलाव—दोनों को सबसे अच्छी तरह समझाता है।", "ਪੁਲ ਬੰਦ ਹੋਣਾ ਦਰਿਆ ਪਾਰ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਬਣੀ ਕੇਂਦਰਿਤ ਸੜਕ ਕਤਾਰ ਅਤੇ ਨੇੜਲੇ ਮੈਟਰੋ ਸਟੇਸ਼ਨਾਂ ਵੱਲ ਇੱਕੋ ਸਮੇਂ ਹੋਏ ਬਦਲਾਅ—ਦੋਵਾਂ ਨੂੰ ਸਭ ਤੋਂ ਚੰਗੀ ਤਰ੍ਹਾਂ ਸਮਝਾਉਂਦਾ ਹੈ।"),
    candidates: [
      c("bridge-closure", "The bridge on the main corridor was closed for an emergency inspection.", "मुख्य गलियारे का पुल आपात निरीक्षण के लिए बंद किया गया।", "ਮੁੱਖ ਕੌਰੀਡੋਰ ਦਾ ਪੁਲ ਐਮਰਜੈਂਸੀ ਜਾਂਚ ਲਈ ਬੰਦ ਕੀਤਾ ਗਿਆ।", true, "CLOSE"),
      c("bus-service-cut", "Several bus services on the same corridor were withdrawn because of vehicle shortages.", "उसी गलियारे की कई बस सेवाएँ वाहन की कमी के कारण हटाई गईं।", "ਉਸੇ ਕੌਰੀਡੋਰ ਦੀਆਂ ਕਈ ਬੱਸ ਸੇਵਾਵਾਂ ਵਾਹਨਾਂ ਦੀ ਘਾਟ ਕਾਰਨ ਹਟਾਈਆਂ ਗਈਆਂ।", false, "CLOSE", "WEAK_CAUSE"),
      c("stadium-event", "A major sports event ended near two metro stations on the corridor.", "गलियारे के दो मेट्रो स्टेशनों के पास एक बड़ा खेल आयोजन समाप्त हुआ।", "ਕੌਰੀਡੋਰ ਦੇ ਦੋ ਮੈਟਰੋ ਸਟੇਸ਼ਨਾਂ ਨੇੜੇ ਇੱਕ ਵੱਡਾ ਖੇਡ ਸਮਾਗਮ ਖਤਮ ਹੋਇਆ।", false, "CLOSE", "WRONG_SCOPE"),
      c("feeder-resurfacing", "Lane resurfacing reduced capacity on a feeder road joining the same corridor.", "उसी गलियारे से जुड़ने वाली फीडर सड़क पर लेन की मरम्मत से क्षमता घट गई।", "ਉਸੇ ਕੌਰੀਡੋਰ ਨਾਲ ਜੁੜਦੀ ਫੀਡਰ ਸੜਕ ਉੱਤੇ ਲੇਨ ਮੁਰੰਮਤ ਕਾਰਨ ਸਮਰੱਥਾ ਘੱਟ ਗਈ।", false, "CLOSE", "WRONG_SCOPE"),
    ],
  },
  {
    id: "vegetable-supply-shock",
    difficulty: "HARD",
    observation: l("Fresh vegetable deliveries to the town fell sharply and retail prices rose within a day.", "कस्बे में ताजी सब्जियों की आपूर्ति तेजी से घटी और एक दिन के भीतर खुदरा कीमतें बढ़ गईं।", "ਕਸਬੇ ਵਿੱਚ ਤਾਜ਼ੀਆਂ ਸਬਜ਼ੀਆਂ ਦੀ ਸਪਲਾਈ ਤੇਜ਼ੀ ਨਾਲ ਘੱਟੀ ਅਤੇ ਇੱਕ ਦਿਨ ਅੰਦਰ ਖੁਦਰਾ ਕੀਮਤਾਂ ਵੱਧ ਗਈਆਂ।"),
    evidence: l("The disruption began after overnight rain on the hill route; the wholesale market and fuel supply were operating normally.", "व्यवधान पहाड़ी मार्ग पर रात की बारिश के बाद शुरू हुआ; थोक बाजार और ईंधन आपूर्ति सामान्य चल रही थी।", "ਵਿਘਨ ਪਹਾੜੀ ਰਸਤੇ ਉੱਤੇ ਰਾਤ ਦੇ ਮੀਂਹ ਤੋਂ ਬਾਅਦ ਸ਼ੁਰੂ ਹੋਇਆ; ਥੋਕ ਬਾਜ਼ਾਰ ਅਤੇ ਇੰਧਨ ਸਪਲਾਈ ਆਮ ਚੱਲ ਰਹੀ ਸੀ।"),
    explanation: l("A landslide on the only hill supply road matches the sudden timing, the route-specific disruption and the town-wide fall in deliveries.", "एकमात्र पहाड़ी आपूर्ति सड़क पर भूस्खलन अचानक समय, मार्ग-विशिष्ट बाधा और पूरे कस्बे में आपूर्ति गिरने—तीनों से मेल खाता है।", "ਇਕੱਲੇ ਪਹਾੜੀ ਸਪਲਾਈ ਰਸਤੇ ਉੱਤੇ ਭੂਸਖਲਨ ਅਚਾਨਕ ਸਮੇਂ, ਰਸਤਾ-ਵਿਸ਼ੇਸ਼ ਰੁਕਾਵਟ ਅਤੇ ਪੂਰੇ ਕਸਬੇ ਵਿੱਚ ਸਪਲਾਈ ਘਟਣ—ਤਿੰਨਾਂ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।"),
    candidates: [
      c("landslide-main-road", "A landslide blocked the main hill supply road.", "भूस्खलन ने मुख्य पहाड़ी आपूर्ति सड़क बंद कर दी।", "ਭੂਸਖਲਨ ਨੇ ਮੁੱਖ ਪਹਾੜੀ ਸਪਲਾਈ ਰਸਤਾ ਬੰਦ ਕਰ ਦਿੱਤਾ।", true, "CLOSE"),
      c("wholesale-strike", "Workers at the regional wholesale market began a partial strike.", "क्षेत्रीय थोक बाजार के कर्मचारियों ने आंशिक हड़ताल शुरू की।", "ਖੇਤਰੀ ਥੋਕ ਬਾਜ਼ਾਰ ਦੇ ਕਰਮਚਾਰੀਆਂ ਨੇ ਅੰਸ਼ਕ ਹੜਤਾਲ ਸ਼ੁਰੂ ਕੀਤੀ।", false, "CLOSE", "WRONG_SCOPE"),
      c("fuel-shortage", "A regional fuel shortage delayed several produce trucks.", "क्षेत्रीय ईंधन की कमी से कई सब्जी ट्रक देर से चले।", "ਖੇਤਰੀ ਇੰਧਨ ਘਾਟ ਕਾਰਨ ਕਈ ਸਬਜ਼ੀ ਟਰੱਕ ਦੇਰ ਨਾਲ ਚਲੇ।", false, "CLOSE", "WEAK_CAUSE"),
      c("crop-disease", "A crop disease reduced output from some supplying farms that week.", "फसल रोग से उस सप्ताह कुछ आपूर्तिकर्ता खेतों का उत्पादन घट गया।", "ਫਸਲੀ ਬਿਮਾਰੀ ਕਾਰਨ ਉਸ ਹਫ਼ਤੇ ਕੁਝ ਸਪਲਾਈ ਕਰਨ ਵਾਲੇ ਖੇਤਾਂ ਦੀ ਪੈਦਾਵਾਰ ਘੱਟ ਗਈ।", false, "CLOSE", "TEMPORAL_VIOLATION"),
    ],
  },
  {
    id: "public-service-server",
    difficulty: "HARD",
    observation: l("Online applications became slow across the service portal and many applicants went to the help counter.", "सेवा पोर्टल पर ऑनलाइन आवेदन धीमे हो गए और कई आवेदक सहायता काउंटर पर पहुँचे।", "ਸੇਵਾ ਪੋਰਟਲ ਉੱਤੇ ਆਨਲਾਈਨ ਅਰਜ਼ੀਆਂ ਹੌਲੀਆਂ ਹੋ ਗਈਆਂ ਅਤੇ ਕਈ ਬਿਨੈਕਾਰ ਮਦਦ ਕਾਊਂਟਰ ਤੇ ਪਹੁੰਚੇ।"),
    evidence: l("Response time worsened steadily as concurrent users increased, while login and payment checks continued to work normally.", "एक साथ उपयोगकर्ताओं की संख्या बढ़ने के साथ प्रतिक्रिया समय लगातार खराब हुआ, जबकि लॉगिन और भुगतान जांच सामान्य चलती रही।", "ਇਕੱਠੇ ਵਰਤੋਂਕਾਰਾਂ ਦੀ ਗਿਣਤੀ ਵਧਣ ਨਾਲ ਜਵਾਬ ਸਮਾਂ ਲਗਾਤਾਰ ਖਰਾਬ ਹੋਇਆ, ਜਦਕਿ ਲਾਗਇਨ ਅਤੇ ਭੁਗਤਾਨ ਜਾਂਚ ਆਮ ਚੱਲਦੀ ਰਹੀ।"),
    explanation: l("Server overload best fits the gradual slowdown with rising concurrent demand while the authentication and payment components remained healthy.", "बढ़ती समकालीन मांग के साथ क्रमिक धीमापन और लॉगिन/भुगतान सेवाओं का सामान्य रहना सर्वर ओवरलोड से सबसे अच्छी तरह मेल खाता है।", "ਵਧਦੀ ਇਕੱਠੀ ਮੰਗ ਨਾਲ ਕ੍ਰਮਵਾਰ ਹੌਲਾਪਣ ਅਤੇ ਲਾਗਇਨ/ਭੁਗਤਾਨ ਸੇਵਾਵਾਂ ਦਾ ਆਮ ਰਹਿਣਾ ਸਰਵਰ ਓਵਰਲੋਡ ਨਾਲ ਸਭ ਤੋਂ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮੇਲ ਖਾਂਦਾ ਹੈ।"),
    candidates: [
      c("server-overload", "The service server received an unusually high number of simultaneous requests.", "सेवा सर्वर को असामान्य रूप से बहुत समकालीन अनुरोध मिले।", "ਸੇਵਾ ਸਰਵਰ ਨੂੰ ਅਸਧਾਰਣ ਤੌਰ ਤੇ ਬਹੁਤ ਇਕੱਠੀਆਂ ਬੇਨਤੀਆਂ ਮਿਲੀਆਂ।", true, "CLOSE"),
      c("auth-outage", "The authentication service became unstable during the same period.", "उसी समय प्रमाणीकरण सेवा अस्थिर हो गई।", "ਉਸੇ ਸਮੇਂ ਪ੍ਰਮਾਣੀਕਰਨ ਸੇਵਾ ਅਸਥਿਰ ਹੋ ਗਈ।", false, "CLOSE", "WRONG_SCOPE"),
      c("payment-latency", "The payment gateway developed high transaction latency.", "भुगतान गेटवे में लेनदेन की देरी बढ़ गई।", "ਭੁਗਤਾਨ ਗੇਟਵੇ ਵਿੱਚ ਲੈਣ-ਦੇਣ ਦੀ ਦੇਰੀ ਵੱਧ ਗਈ।", false, "CLOSE", "WRONG_SCOPE"),
      c("database-backup", "A scheduled database backup consumed substantial capacity on the portal infrastructure.", "निर्धारित डेटाबेस बैकअप ने पोर्टल ढांचे की काफी क्षमता उपयोग की।", "ਨਿਰਧਾਰਤ ਡਾਟਾਬੇਸ ਬੈਕਅੱਪ ਨੇ ਪੋਰਟਲ ਢਾਂਚੇ ਦੀ ਕਾਫ਼ੀ ਸਮਰੱਥਾ ਵਰਤੀ।", false, "CLOSE", "WEAK_CAUSE"),
    ],
  },
  {
    id: "certificate-printing",
    difficulty: "MEDIUM",
    observation: l("Certificates were issued late at every service counter for about forty minutes.", "लगभग चालीस मिनट तक हर सेवा काउंटर पर प्रमाणपत्र देर से जारी हुए।", "ਲਗਭਗ ਚਾਲੀ ਮਿੰਟ ਤੱਕ ਹਰ ਸੇਵਾ ਕਾਊਂਟਰ ਉੱਤੇ ਸਰਟੀਫਿਕੇਟ ਦੇਰ ਨਾਲ ਜਾਰੀ ਹੋਏ।"),
    evidence: l("Verification continued at its normal pace, but completed certificates could not be printed at any counter.", "सत्यापन सामान्य गति से चलता रहा, लेकिन किसी भी काउंटर पर तैयार प्रमाणपत्र प्रिंट नहीं हो सके।", "ਤਸਦੀਕ ਆਮ ਗਤੀ ਨਾਲ ਚੱਲਦੀ ਰਹੀ, ਪਰ ਕਿਸੇ ਵੀ ਕਾਊਂਟਰ ਉੱਤੇ ਤਿਆਰ ਸਰਟੀਫਿਕੇਟ ਪ੍ਰਿੰਟ ਨਹੀਂ ਹੋ ਸਕੇ।"),
    explanation: l("A printer-network failure directly explains why verification continued but completed certificates could not be issued.", "प्रिंटर नेटवर्क की खराबी सीधे समझाती है कि सत्यापन चलता रहा लेकिन तैयार प्रमाणपत्र जारी नहीं हो सके।", "ਪ੍ਰਿੰਟਰ ਨੈੱਟਵਰਕ ਦੀ ਖਰਾਬੀ ਸਿੱਧਾ ਸਮਝਾਉਂਦੀ ਹੈ ਕਿ ਤਸਦੀਕ ਚੱਲਦੀ ਰਹੀ ਪਰ ਤਿਆਰ ਸਰਟੀਫਿਕੇਟ ਜਾਰੀ ਨਹੀਂ ਹੋ ਸਕੇ।"),
    candidates: [
      c("printer-network", "The office printer network failed.", "कार्यालय का प्रिंटर नेटवर्क बंद हो गया।", "ਦਫ਼ਤਰ ਦਾ ਪ੍ਰਿੰਟਰ ਨੈੱਟਵਰਕ ਬੰਦ ਹੋ ਗਿਆ।", true, "CLOSE"),
      c("verification-server", "The document-verification server slowed across all counters.", "दस्तावेज सत्यापन सर्वर सभी काउंटरों पर धीमा हो गया।", "ਦਸਤਾਵੇਜ਼ ਤਸਦੀਕ ਸਰਵਰ ਸਾਰੇ ਕਾਊਂਟਰਾਂ ਉੱਤੇ ਹੌਲਾ ਹੋ ਗਿਆ।", false, "CLOSE", "WRONG_SCOPE"),
      c("staff-absence", "Several experienced clerks were absent during the shift.", "पाली के दौरान कई अनुभवी क्लर्क अनुपस्थित थे।", "ਸ਼ਿਫਟ ਦੌਰਾਨ ਕਈ ਤਜਰਬੇਕਾਰ ਕਲਰਕ ਗੈਰਹਾਜ਼ਰ ਸਨ।", false, "CLOSE", "WEAK_CAUSE"),
      c("courier-delay", "The courier collecting completed certificates arrived late.", "तैयार प्रमाणपत्र लेने वाला कुरियर देर से पहुँचा।", "ਤਿਆਰ ਸਰਟੀਫਿਕੇਟ ਲੈਣ ਵਾਲਾ ਕੂਰੀਅਰ ਦੇਰ ਨਾਲ ਪਹੁੰਚਿਆ।", false, "CLEAR_REJECT", "WRONG_SCOPE"),
    ],
  },
  {
    id: "cold-storage-dispatch",
    difficulty: "MEDIUM",
    observation: l("Dispatch vehicles carrying perishable goods left the distribution hub late.", "नाशवान सामान ले जाने वाले डिस्पैच वाहन वितरण केंद्र से देर से निकले।", "ਨਾਸ਼ਵਾਨ ਸਮਾਨ ਲਿਜਾਣ ਵਾਲੇ ਡਿਸਪੈਚ ਵਾਹਨ ਵੰਡ ਕੇਂਦਰ ਤੋਂ ਦੇਰ ਨਾਲ ਨਿਕਲੇ।"),
    evidence: l("All loading bays paused at almost the same time and a power alarm was recorded; scanners remained online.", "लगभग एक ही समय सभी लोडिंग बे रुक गए और बिजली अलार्म दर्ज हुआ; स्कैनर ऑनलाइन रहे।", "ਲਗਭਗ ਇੱਕੋ ਸਮੇਂ ਸਾਰੇ ਲੋਡਿੰਗ ਬੇ ਰੁਕ ਗਏ ਅਤੇ ਬਿਜਲੀ ਅਲਾਰਮ ਦਰਜ ਹੋਇਆ; ਸਕੈਨਰ ਆਨਲਾਈਨ ਰਹੇ।"),
    explanation: l("A cold-storage power failure best explains the simultaneous pause across all bays and the recorded power alarm.", "कोल्ड-स्टोरेज की बिजली विफलता सभी बे के एक साथ रुकने और दर्ज बिजली अलार्म—दोनों को सबसे अच्छी तरह समझाती है।", "ਕੋਲਡ-ਸਟੋਰੇਜ ਦੀ ਬਿਜਲੀ ਨਾਕਾਮੀ ਸਾਰੇ ਬੇ ਇਕੱਠੇ ਰੁਕਣ ਅਤੇ ਦਰਜ ਬਿਜਲੀ ਅਲਾਰਮ—ਦੋਵਾਂ ਨੂੰ ਸਭ ਤੋਂ ਚੰਗੀ ਤਰ੍ਹਾਂ ਸਮਝਾਉਂਦੀ ਹੈ।"),
    candidates: [
      c("power-failure", "Power to the cold-storage loading system failed.", "कोल्ड-स्टोरेज लोडिंग प्रणाली की बिजली बंद हो गई।", "ਕੋਲਡ-ਸਟੋਰੇਜ ਲੋਡਿੰਗ ਪ੍ਰਣਾਲੀ ਦੀ ਬਿਜਲੀ ਬੰਦ ਹੋ ਗਈ।", true, "CLOSE"),
      c("scanner-outage", "The warehouse scanning service failed at several loading bays.", "कई लोडिंग बे पर गोदाम स्कैनिंग सेवा बंद हो गई।", "ਕਈ ਲੋਡਿੰਗ ਬੇ ਉੱਤੇ ਗੋਦਾਮ ਸਕੈਨਿੰਗ ਸੇਵਾ ਬੰਦ ਹੋ ਗਈ।", false, "CLOSE", "WRONG_SCOPE"),
      c("staff-shortage", "A sudden staff shortage slowed loading across the morning shift.", "अचानक कर्मचारियों की कमी से सुबह की पाली में लोडिंग धीमी हुई।", "ਅਚਾਨਕ ਕਰਮਚਾਰੀਆਂ ਦੀ ਘਾਟ ਕਾਰਨ ਸਵੇਰ ਦੀ ਸ਼ਿਫਟ ਵਿੱਚ ਲੋਡਿੰਗ ਹੌਲੀ ਹੋਈ।", false, "CLOSE", "WEAK_CAUSE"),
      c("forklift-fault", "Several forklifts required unscheduled maintenance.", "कई फोर्कलिफ्टों को अचानक रखरखाव की जरूरत पड़ी।", "ਕਈ ਫੋਰਕਲਿਫਟਾਂ ਨੂੰ ਅਚਾਨਕ ਰੱਖ-ਰਖਾਵ ਦੀ ਲੋੜ ਪਈ।", false, "CLEAR_REJECT", "WEAK_CAUSE"),
    ],
  },
  {
    id: "ferry-market-delay",
    difficulty: "MEDIUM",
    observation: l("Goods using the river crossing reached the market much later than usual.", "नदी पार करने वाले मार्ग से आने वाला सामान बाजार में सामान्य से काफी देर से पहुँचा।", "ਦਰਿਆ ਪਾਰ ਰਸਤੇ ਰਾਹੀਂ ਆਉਣ ਵਾਲਾ ਸਮਾਨ ਬਾਜ਼ਾਰ ਵਿੱਚ ਆਮ ਨਾਲੋਂ ਕਾਫ਼ੀ ਦੇਰ ਨਾਲ ਪਹੁੰਚਿਆ।"),
    evidence: l("Departures in both directions were suspended during a wind advisory; the loading ramp and crew were reported normal.", "तेज हवा की चेतावनी के दौरान दोनों दिशाओं की रवानगी रोक दी गई; लोडिंग रैंप और चालक दल सामान्य बताए गए।", "ਤੇਜ਼ ਹਵਾ ਦੀ ਚੇਤਾਵਨੀ ਦੌਰਾਨ ਦੋਵੇਂ ਦਿਸ਼ਾਵਾਂ ਦੀ ਰਵਾਨਗੀ ਰੋਕੀ ਗਈ; ਲੋਡਿੰਗ ਰੈਂਪ ਅਤੇ ਕਰਮਚਾਰੀ ਆਮ ਦੱਸੇ ਗਏ।"),
    explanation: l("Strong wind fits the two-way suspension during the weather advisory while equipment and staffing remained normal.", "मौसम चेतावनी के दौरान दोनों दिशाओं की रोक और उपकरण/कर्मचारियों का सामान्य रहना तेज हवा से सबसे अच्छी तरह मेल खाता है।", "ਮੌਸਮ ਚੇਤਾਵਨੀ ਦੌਰਾਨ ਦੋਵੇਂ ਦਿਸ਼ਾਵਾਂ ਦੀ ਰੋਕ ਅਤੇ ਸਾਜ਼ੋ-ਸਾਮਾਨ/ਕਰਮਚਾਰੀਆਂ ਦਾ ਆਮ ਰਹਿਣਾ ਤੇਜ਼ ਹਵਾ ਨਾਲ ਸਭ ਤੋਂ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮੇਲ ਖਾਂਦਾ ਹੈ।"),
    candidates: [
      c("strong-wind", "Strong wind made the ferry crossing unsafe.", "तेज हवा से फेरी पारगमन असुरक्षित हो गया।", "ਤੇਜ਼ ਹਵਾ ਕਾਰਨ ਫੈਰੀ ਪਾਰਗਮਨ ਅਸੁਰੱਖਿਅਤ ਹੋ ਗਿਆ।", true, "CLOSE"),
      c("ramp-fault", "A fault developed in the vehicle loading ramp.", "वाहन लोडिंग रैंप में खराबी आ गई।", "ਵਾਹਨ ਲੋਡਿੰਗ ਰੈਂਪ ਵਿੱਚ ਖਰਾਬੀ ਆ ਗਈ।", false, "CLOSE", "WRONG_SCOPE"),
      c("crew-shortage", "The ferry operator had fewer crew members than scheduled.", "फेरी संचालक के पास निर्धारित से कम चालक दल था।", "ਫੈਰੀ ਸੰਚਾਲਕ ਕੋਲ ਨਿਰਧਾਰਤ ਤੋਂ ਘੱਟ ਕਰਮਚਾਰੀ ਸਨ।", false, "CLOSE", "WEAK_CAUSE"),
      c("market-roadworks", "Roadwork near the market slowed some delivery vehicles.", "बाजार के पास सड़क कार्य से कुछ डिलीवरी वाहन धीमे हुए।", "ਬਾਜ਼ਾਰ ਨੇੜੇ ਸੜਕ ਕੰਮ ਕਾਰਨ ਕੁਝ ਡਿਲੀਵਰੀ ਵਾਹਨ ਹੌਲੇ ਹੋਏ।", false, "CLEAR_REJECT", "WRONG_SCOPE"),
    ],
  },
  {
    id: "rail-section-delay",
    difficulty: "HARD",
    observation: l("Several trains lost time while passing the same rail section.", "एक ही रेल खंड से गुजरते समय कई ट्रेनों को देरी हुई।", "ਇੱਕੋ ਰੇਲ ਖੰਡ ਤੋਂ ਲੰਘਦਿਆਂ ਕਈ ਰੇਲਾਂ ਨੂੰ ਦੇਰੀ ਹੋਈ।"),
    evidence: l("The speed restriction appeared only where track water level had risen after prolonged rain; signalling tests were normal.", "गति प्रतिबंध केवल वहीं लगा जहाँ लंबे समय की बारिश के बाद पटरी पर पानी बढ़ा था; सिग्नल परीक्षण सामान्य थे।", "ਗਤੀ ਪਾਬੰਦੀ ਸਿਰਫ਼ ਉੱਥੇ ਲੱਗੀ ਜਿੱਥੇ ਲੰਬੇ ਮੀਂਹ ਤੋਂ ਬਾਅਦ ਪਟੜੀ ਉੱਤੇ ਪਾਣੀ ਵਧਿਆ ਸੀ; ਸਿਗਨਲ ਜਾਂਚ ਆਮ ਸੀ।"),
    explanation: l("Waterlogging caused by prolonged rain best explains the location-specific speed restriction while signalling remained normal.", "लंबी बारिश से हुआ जलभराव स्थान-विशिष्ट गति प्रतिबंध को सबसे अच्छी तरह समझाता है, जबकि सिग्नल सामान्य थे।", "ਲੰਬੇ ਮੀਂਹ ਨਾਲ ਹੋਇਆ ਪਾਣੀ ਭਰਾਅ ਥਾਂ-ਵਿਸ਼ੇਸ਼ ਗਤੀ ਪਾਬੰਦੀ ਨੂੰ ਸਭ ਤੋਂ ਚੰਗੀ ਤਰ੍ਹਾਂ ਸਮਝਾਉਂਦਾ ਹੈ, ਜਦਕਿ ਸਿਗਨਲ ਆਮ ਸਨ।"),
    candidates: [
      c("rail-waterlogging", "Prolonged rain caused water to collect on that track section.", "लंबी बारिश से उस पटरी खंड पर पानी जमा हो गया।", "ਲੰਬੇ ਮੀਂਹ ਕਾਰਨ ਉਸ ਪਟੜੀ ਖੰਡ ਉੱਤੇ ਪਾਣੀ ਇਕੱਠਾ ਹੋ ਗਿਆ।", true, "CLOSE"),
      c("signal-instability", "Intermittent signal instability affected the same section.", "उसी खंड में रुक-रुक कर सिग्नल अस्थिरता हुई।", "ਉਸੇ ਖੰਡ ਵਿੱਚ ਵਾਰ-ਵਾਰ ਸਿਗਨਲ ਅਸਥਿਰਤਾ ਹੋਈ।", false, "CLOSE", "WRONG_SCOPE"),
      c("maintenance-restriction", "Planned track maintenance imposed a temporary speed restriction there.", "निर्धारित पटरी रखरखाव से वहाँ अस्थायी गति प्रतिबंध लगा।", "ਨਿਰਧਾਰਤ ਪਟੜੀ ਰੱਖ-ਰਖਾਵ ਕਾਰਨ ਉੱਥੇ ਅਸਥਾਈ ਗਤੀ ਪਾਬੰਦੀ ਲੱਗੀ।", false, "CLOSE", "TEMPORAL_VIOLATION"),
      c("platform-crowding", "Heavy passenger boarding at a nearby station extended dwell times.", "पास के स्टेशन पर भारी चढ़ाई-उतराई से रुकने का समय बढ़ा।", "ਨੇੜਲੇ ਸਟੇਸ਼ਨ ਉੱਤੇ ਵੱਧ ਯਾਤਰੀ ਚੜ੍ਹਨ-ਉਤਰਣ ਕਾਰਨ ਰੁਕਣ ਦਾ ਸਮਾਂ ਵਧਿਆ।", false, "CLOSE", "WRONG_SCOPE"),
    ],
  },
  {
    id: "exam-centre-arrivals",
    difficulty: "HARD",
    observation: l("A large group of candidates reached an examination centre late and requested late-entry help.", "उम्मीदवारों का बड़ा समूह परीक्षा केंद्र पर देर से पहुँचा और देर से प्रवेश की सहायता माँगी।", "ਉਮੀਦਵਾਰਾਂ ਦਾ ਵੱਡਾ ਸਮੂਹ ਪਰੀਖਿਆ ਕੇਂਦਰ ਉੱਤੇ ਦੇਰ ਨਾਲ ਪਹੁੰਚਿਆ ਅਤੇ ਦੇਰੀ ਨਾਲ ਦਾਖਲੇ ਲਈ ਮਦਦ ਮੰਗੀ।"),
    evidence: l("Most delayed candidates had approached from the east, where police had blocked the main access road; security processing inside the centre remained on schedule.", "अधिकांश देर से पहुँचे उम्मीदवार पूर्व दिशा से आए थे, जहाँ पुलिस ने मुख्य पहुंच सड़क बंद की थी; केंद्र के अंदर सुरक्षा प्रक्रिया समय पर चल रही थी।", "ਜ਼ਿਆਦਾਤਰ ਦੇਰ ਨਾਲ ਪਹੁੰਚੇ ਉਮੀਦਵਾਰ ਪੂਰਬ ਵੱਲੋਂ ਆਏ ਸਨ, ਜਿੱਥੇ ਪੁਲਿਸ ਨੇ ਮੁੱਖ ਪਹੁੰਚ ਰਸਤਾ ਬੰਦ ਕੀਤਾ ਸੀ; ਕੇਂਦਰ ਅੰਦਰ ਸੁਰੱਖਿਆ ਪ੍ਰਕਿਰਿਆ ਸਮੇਂ ਉੱਤੇ ਚੱਲ ਰਹੀ ਸੀ।"),
    explanation: l("The access-road closure matches the direction-specific delay before candidates reached the centre, while the internal security process remained normal.", "पहुंच सड़क बंद होना केंद्र पहुँचने से पहले दिशा-विशिष्ट देरी से मेल खाता है, जबकि अंदर की सुरक्षा प्रक्रिया सामान्य थी।", "ਪਹੁੰਚ ਰਸਤਾ ਬੰਦ ਹੋਣਾ ਕੇਂਦਰ ਪਹੁੰਚਣ ਤੋਂ ਪਹਿਲਾਂ ਦਿਸ਼ਾ-ਵਿਸ਼ੇਸ਼ ਦੇਰੀ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ, ਜਦਕਿ ਅੰਦਰਲੀ ਸੁਰੱਖਿਆ ਪ੍ਰਕਿਰਿਆ ਆਮ ਸੀ।"),
    candidates: [
      c("approach-road-closure", "Police closed the main eastern approach road to the centre.", "पुलिस ने केंद्र की मुख्य पूर्वी पहुंच सड़क बंद कर दी।", "ਪੁਲਿਸ ਨੇ ਕੇਂਦਰ ਦਾ ਮੁੱਖ ਪੂਰਬੀ ਪਹੁੰਚ ਰਸਤਾ ਬੰਦ ਕਰ ਦਿੱਤਾ।", true, "CLOSE"),
      c("security-slowdown", "Security screening at the centre took longer than usual.", "केंद्र पर सुरक्षा जांच सामान्य से अधिक समय लेने लगी।", "ਕੇਂਦਰ ਉੱਤੇ ਸੁਰੱਖਿਆ ਜਾਂਚ ਆਮ ਨਾਲੋਂ ਵੱਧ ਸਮਾਂ ਲੈਣ ਲੱਗੀ।", false, "CLOSE", "TEMPORAL_VIOLATION"),
      c("parking-shortage", "Parking around the examination centre filled earlier than expected.", "परीक्षा केंद्र के आसपास पार्किंग अपेक्षा से पहले भर गई।", "ਪਰੀਖਿਆ ਕੇਂਦਰ ਆਲੇ-ਦੁਆਲੇ ਪਾਰਕਿੰਗ ਉਮੀਦ ਨਾਲੋਂ ਪਹਿਲਾਂ ਭਰ ਗਈ।", false, "CLOSE", "WEAK_CAUSE"),
      c("bus-breakdown", "A bus carrying candidates broke down on a nearby route.", "उम्मीदवारों को ले जा रही एक बस पास के मार्ग पर खराब हो गई।", "ਉਮੀਦਵਾਰਾਂ ਨੂੰ ਲਿਜਾਣ ਵਾਲੀ ਇੱਕ ਬੱਸ ਨੇੜਲੇ ਰਸਤੇ ਉੱਤੇ ਖਰਾਬ ਹੋ ਗਈ।", false, "CLOSE", "WRONG_SCOPE"),
    ],
  },
  {
    id: "water-pressure-zone",
    difficulty: "MEDIUM",
    observation: l("Water reached upper-floor homes slowly across one distribution zone.", "एक वितरण क्षेत्र में ऊपरी मंजिलों के घरों तक पानी धीरे पहुँचा।", "ਇੱਕ ਵੰਡ ਖੇਤਰ ਵਿੱਚ ਉੱਪਰੀ ਮੰਜ਼ਿਲਾਂ ਦੇ ਘਰਾਂ ਤੱਕ ਪਾਣੀ ਹੌਲੀ ਪਹੁੰਚਿਆ।"),
    evidence: l("Pressure fell at several monitoring points at the same time; valve settings had not changed.", "कई निगरानी बिंदुओं पर एक ही समय दबाव गिरा; वाल्व सेटिंग में कोई बदलाव नहीं था।", "ਕਈ ਨਿਗਰਾਨੀ ਬਿੰਦੂਆਂ ਉੱਤੇ ਇੱਕੋ ਸਮੇਂ ਦਬਾਅ ਘਟਿਆ; ਵਾਲਵ ਸੈਟਿੰਗ ਵਿੱਚ ਕੋਈ ਬਦਲਾਅ ਨਹੀਂ ਸੀ।"),
    explanation: l("Failure of the main pump best explains the simultaneous pressure fall across the same zone with unchanged valve settings.", "मुख्य पंप की विफलता बिना बदली वाल्व सेटिंग के पूरे क्षेत्र में एक साथ दबाव गिरने को सबसे अच्छी तरह समझाती है।", "ਮੁੱਖ ਪੰਪ ਦੀ ਨਾਕਾਮੀ ਬਿਨਾਂ ਬਦਲੀ ਵਾਲਵ ਸੈਟਿੰਗ ਦੇ ਪੂਰੇ ਖੇਤਰ ਵਿੱਚ ਇੱਕੋ ਸਮੇਂ ਦਬਾਅ ਘਟਣ ਨੂੰ ਸਭ ਤੋਂ ਚੰਗੀ ਤਰ੍ਹਾਂ ਸਮਝਾਉਂਦੀ ਹੈ।"),
    candidates: [
      c("main-pump-stop", "The main pump serving the distribution zone stopped operating.", "वितरण क्षेत्र की सेवा करने वाला मुख्य पंप बंद हो गया।", "ਵੰਡ ਖੇਤਰ ਨੂੰ ਸੇਵਾ ਦੇਣ ਵਾਲਾ ਮੁੱਖ ਪੰਪ ਬੰਦ ਹੋ ਗਿਆ।", true, "CLOSE"),
      c("large-pipe-leak", "A major pipe leak developed within the same distribution zone.", "उसी वितरण क्षेत्र में एक बड़ी पाइप लीकेज हो गई।", "ਉਸੇ ਵੰਡ ਖੇਤਰ ਵਿੱਚ ਇੱਕ ਵੱਡੀ ਪਾਈਪ ਲੀਕ ਹੋ ਗਈ।", false, "CLOSE", "WEAK_CAUSE"),
      c("valve-adjustment", "Operators partly closed several control valves in the zone.", "ऑपरेटरों ने क्षेत्र के कई नियंत्रण वाल्व आंशिक रूप से बंद किए।", "ਓਪਰੇਟਰਾਂ ਨੇ ਖੇਤਰ ਦੇ ਕਈ ਕੰਟਰੋਲ ਵਾਲਵ ਅੰਸ਼ਕ ਤੌਰ ਤੇ ਬੰਦ ਕੀਤੇ।", false, "CLOSE", "TEMPORAL_VIOLATION"),
      c("adjacent-demand", "Water demand rose sharply in an adjacent supply zone.", "पास के आपूर्ति क्षेत्र में पानी की मांग तेजी से बढ़ी।", "ਨੇੜਲੇ ਸਪਲਾਈ ਖੇਤਰ ਵਿੱਚ ਪਾਣੀ ਦੀ ਮੰਗ ਤੇਜ਼ੀ ਨਾਲ ਵਧੀ।", false, "CLEAR_REJECT", "WRONG_SCOPE"),
    ],
  },
  {
    id: "warehouse-dispatch",
    difficulty: "HARD",
    observation: l("Several shops received stock late after vehicles left the same regional warehouse behind schedule.", "एक ही क्षेत्रीय गोदाम से वाहन देर से निकलने के बाद कई दुकानों को स्टॉक देर से मिला।", "ਇੱਕੋ ਖੇਤਰੀ ਗੋਦਾਮ ਤੋਂ ਵਾਹਨ ਦੇਰ ਨਾਲ ਨਿਕਲਣ ਤੋਂ ਬਾਅਦ ਕਈ ਦੁਕਾਨਾਂ ਨੂੰ ਸਟਾਕ ਦੇਰ ਨਾਲ ਮਿਲਿਆ।"),
    evidence: l("Road conditions were normal and the delay began at multiple loading bays during the same hour.", "सड़क की स्थिति सामान्य थी और उसी घंटे कई लोडिंग बे पर देरी शुरू हुई।", "ਸੜਕ ਹਾਲਾਤ ਆਮ ਸਨ ਅਤੇ ਉਸੇ ਘੰਟੇ ਕਈ ਲੋਡਿੰਗ ਬੇ ਉੱਤੇ ਦੇਰੀ ਸ਼ੁਰੂ ਹੋਈ।"),
    explanation: l("A warehouse-wide loading-system failure best fits a simultaneous multi-bay departure delay while outside road conditions were normal.", "गोदाम-व्यापी लोडिंग प्रणाली की खराबी कई बे पर एक साथ रवानगी की देरी और सामान्य बाहरी सड़क स्थिति—दोनों से सबसे अच्छी तरह मेल खाती है।", "ਗੋਦਾਮ-ਪੱਧਰੀ ਲੋਡਿੰਗ ਪ੍ਰਣਾਲੀ ਦੀ ਖਰਾਬੀ ਕਈ ਬੇ ਉੱਤੇ ਇੱਕੋ ਸਮੇਂ ਰਵਾਨਗੀ ਦੀ ਦੇਰੀ ਅਤੇ ਆਮ ਬਾਹਰੀ ਸੜਕ ਹਾਲਾਤ—ਦੋਵਾਂ ਨਾਲ ਸਭ ਤੋਂ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮੇਲ ਖਾਂਦੀ ਹੈ।"),
    candidates: [
      c("loading-system", "The warehouse loading-control system stopped working across several bays.", "गोदाम की लोडिंग-नियंत्रण प्रणाली कई बे पर बंद हो गई।", "ਗੋਦਾਮ ਦੀ ਲੋਡਿੰਗ-ਕੰਟਰੋਲ ਪ੍ਰਣਾਲੀ ਕਈ ਬੇ ਉੱਤੇ ਬੰਦ ਹੋ ਗਈ।", true, "CLOSE"),
      c("staff-shortage-warehouse", "A sudden staff shortage slowed work across several loading bays.", "अचानक कर्मचारियों की कमी से कई लोडिंग बे पर काम धीमा हुआ।", "ਅਚਾਨਕ ਕਰਮਚਾਰੀਆਂ ਦੀ ਘਾਟ ਕਾਰਨ ਕਈ ਲੋਡਿੰਗ ਬੇ ਉੱਤੇ ਕੰਮ ਹੌਲਾ ਹੋਇਆ।", false, "CLOSE", "WEAK_CAUSE"),
      c("scanner-latency", "The warehouse scanning system developed severe latency across several bays.", "गोदाम की स्कैनिंग प्रणाली कई बे पर बहुत धीमी हो गई।", "ਗੋਦਾਮ ਦੀ ਸਕੈਨਿੰਗ ਪ੍ਰਣਾਲੀ ਕਈ ਬੇ ਉੱਤੇ ਬਹੁਤ ਹੌਲੀ ਹੋ ਗਈ।", false, "CLOSE", "WEAK_CAUSE"),
      c("regional-traffic", "Heavy regional traffic delayed delivery vehicles after they left the warehouse.", "भारी क्षेत्रीय यातायात ने गोदाम से निकलने के बाद डिलीवरी वाहनों को देर कर दी।", "ਭਾਰੀ ਖੇਤਰੀ ਆਵਾਜਾਈ ਨੇ ਗੋਦਾਮ ਤੋਂ ਨਿਕਲਣ ਤੋਂ ਬਾਅਦ ਡਿਲੀਵਰੀ ਵਾਹਨਾਂ ਨੂੰ ਦੇਰ ਕਰ ਦਿੱਤੀ।", false, "CLOSE", "TEMPORAL_VIOLATION"),
    ],
  },
  {
    id: "neighbourhood-flooding",
    difficulty: "HARD",
    observation: l("Deliveries to several streets in a low-lying neighbourhood arrived late during the afternoon.", "निचले इलाके की कई सड़कों पर दोपहर में डिलीवरी देर से पहुँची।", "ਨੀਵੇਂ ਇਲਾਕੇ ਦੀਆਂ ਕਈ ਗਲੀਆਂ ਵਿੱਚ ਦੁਪਹਿਰ ਵੇਲੇ ਡਿਲੀਵਰੀ ਦੇਰ ਨਾਲ ਪਹੁੰਚੀ।"),
    evidence: l("Access roads became waterlogged after hours of rain; courier staffing and vehicle availability remained normal.", "कई घंटों की बारिश के बाद पहुंच सड़कें जलमग्न हो गईं; कुरियर कर्मचारी और वाहन उपलब्धता सामान्य रही।", "ਕਈ ਘੰਟਿਆਂ ਦੇ ਮੀਂਹ ਤੋਂ ਬਾਅਦ ਪਹੁੰਚ ਰਸਤੇ ਪਾਣੀ ਨਾਲ ਭਰ ਗਏ; ਕੂਰੀਅਰ ਕਰਮਚਾਰੀ ਅਤੇ ਵਾਹਨ ਉਪਲਬਧਤਾ ਆਮ ਰਹੀ।"),
    explanation: l("Sustained heavy rain best explains the widespread waterlogging and simultaneous delivery delays while courier capacity remained normal.", "लगातार तेज बारिश व्यापक जलभराव और एक साथ हुई डिलीवरी देरी को सबसे अच्छी तरह समझाती है, जबकि कुरियर क्षमता सामान्य रही।", "ਲਗਾਤਾਰ ਤੇਜ਼ ਮੀਂਹ ਵਿਆਪਕ ਪਾਣੀ ਭਰਾਅ ਅਤੇ ਇੱਕੋ ਸਮੇਂ ਹੋਈ ਡਿਲੀਵਰੀ ਦੇਰੀ ਨੂੰ ਸਭ ਤੋਂ ਚੰਗੀ ਤਰ੍ਹਾਂ ਸਮਝਾਉਂਦਾ ਹੈ, ਜਦਕਿ ਕੂਰੀਅਰ ਸਮਰੱਥਾ ਆਮ ਰਹੀ।"),
    candidates: [
      c("heavy-rain", "Heavy rain continued for several hours over the neighbourhood.", "इलाके में कई घंटों तक तेज बारिश जारी रही।", "ਇਲਾਕੇ ਵਿੱਚ ਕਈ ਘੰਟਿਆਂ ਤੱਕ ਤੇਜ਼ ਮੀਂਹ ਜਾਰੀ ਰਿਹਾ।", true, "CLOSE"),
      c("road-repair", "Road repair work restricted traffic on two access streets.", "सड़क मरम्मत ने दो पहुंच सड़कों पर यातायात सीमित किया।", "ਸੜਕ ਮੁਰੰਮਤ ਨੇ ਦੋ ਪਹੁੰਚ ਰਸਤਿਆਂ ਉੱਤੇ ਆਵਾਜਾਈ ਸੀਮਿਤ ਕੀਤੀ।", false, "CLOSE", "WRONG_SCOPE"),
      c("courier-shortage", "A courier company operated with fewer delivery staff that afternoon.", "उस दोपहर एक कुरियर कंपनी कम डिलीवरी कर्मचारियों के साथ चली।", "ਉਸ ਦੁਪਹਿਰ ਇੱਕ ਕੂਰੀਅਰ ਕੰਪਨੀ ਘੱਟ ਡਿਲੀਵਰੀ ਕਰਮਚਾਰੀਆਂ ਨਾਲ ਚੱਲੀ।", false, "CLOSE", "WEAK_CAUSE"),
      c("waste-truck", "A municipal waste truck blocked one narrow street for an extended period.", "नगरपालिका का कचरा वाहन एक संकरी सड़क को लंबे समय तक रोके रहा।", "ਨਗਰ ਨਿਗਮ ਦਾ ਕੂੜਾ ਵਾਹਨ ਇੱਕ ਤੰਗ ਗਲੀ ਨੂੰ ਲੰਬੇ ਸਮੇਂ ਤੱਕ ਰੋਕੇ ਰਿਹਾ।", false, "CLOSE", "WRONG_SCOPE"),
    ],
  },
]);

const COPY: Record<CaeLocale, Readonly<{ observation: string; evidence: string; prompt: string }>> = {
  "en-IN": { observation: "Observation", evidence: "Additional information", prompt: "Which proposed event best explains the observation?" },
  "hi-IN": { observation: "अवलोकन", evidence: "अतिरिक्त जानकारी", prompt: "कौन-सी प्रस्तावित घटना अवलोकन को सबसे अच्छी तरह समझाती है?" },
  "pa-IN": { observation: "ਨਿਰੀਖਣ", evidence: "ਵਾਧੂ ਜਾਣਕਾਰੀ", prompt: "ਕਿਹੜੀ ਪ੍ਰਸਤਾਵਿਤ ਘਟਨਾ ਨਿਰੀਖਣ ਨੂੰ ਸਭ ਤੋਂ ਚੰਗੀ ਤਰ੍ਹਾਂ ਸਮਝਾਉਂਦੀ ਹੈ?" },
};

function mix32(value: number): number {
  let x = value | 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return x >>> 0;
}

function shuffled<T>(values: readonly T[], seed: number): readonly T[] {
  const result = [...values];
  let state = mix32(seed ^ 0x9e3779b9);
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = mix32(state + index);
    const swap = state % (index + 1);
    [result[index], result[swap]] = [result[swap]!, result[index]!];
  }
  return result;
}

function difficultyEvidence(scenario: Scenario): CaeDifficultyEvidence {
  const closeAlternatives = scenario.candidates.filter((candidate) => !candidate.isCorrect && candidate.fit === "CLOSE").length;
  const hard = scenario.difficulty === "HARD";
  return {
    causalDistance: 1,
    hiddenLinks: 1,
    topologyComplexity: 4,
    plausibleDistractors: closeAlternatives,
    visibleEventCount: 1,
    inferenceBurden: hard ? 5 : 3,
    candidatePlausibilityBurden: hard ? 8 : 4,
    score: hard ? 20 : 14,
  };
}

export function generateCp005CompetingQuestion(input: Readonly<{ locale: CaeLocale; seed: number }>): GeneratedCaeQuestion {
  const selectionSeed = mix32((input.seed >>> 0) ^ 0xc005cae5);
  const scenario = CP005_COMPETING_SCENARIOS[selectionSeed % CP005_COMPETING_SCENARIOS.length]!;
  const locale = input.locale;
  const rendered: readonly CaeRenderedOption[] = shuffled(scenario.candidates.map((candidate) => ({
    id: candidate.id,
    text: candidate.text[locale],
    isCorrect: candidate.isCorrect,
    distractorRole: candidate.isCorrect ? undefined : candidate.mechanism,
  })), selectionSeed ^ 0x51a5);
  const correctIndex = rendered.findIndex((option) => option.isCorrect);
  if (correctIndex < 0 || rendered.filter((option) => option.isCorrect).length !== 1) throw new Error(`${scenario.id}: CP005 requires exactly one correct explanation.`);
  const closeAlternatives = scenario.candidates.filter((candidate) => !candidate.isCorrect && candidate.fit === "CLOSE").length;
  if (scenario.difficulty === "HARD" && closeAlternatives < 2) throw new Error(`${scenario.id}: HARD CP005 requires at least two close alternatives.`);
  const stateId = `projection:CAE-PLAN-COMPETING|family:CAE-FAM-REVIEWED-COMPETING|variant:${scenario.id}|graph:COMPETING_EXPLANATIONS|visible:observation`;
  const itemVariantId = `${stateId}|distractors:${rendered.filter((option) => !option.isCorrect).map((option) => option.id).sort().join(",")}|profile:FOUR_WAY|presentation:${rendered.map((option) => option.id).join(">")}`;
  const copy = COPY[locale];
  const correct = scenario.candidates.find((candidate) => candidate.isCorrect)!;

  return Object.freeze({
    chapterId: "CAE-001",
    checkpointId: "CAE-CP-005",
    qlId: "CAE-QL-005",
    projectionId: "CAE-PLAN-COMPETING",
    scenarioFamilyId: "CAE-FAM-REVIEWED-COMPETING",
    scenarioVariantId: scenario.id,
    causalStateId: stateId,
    itemVariantId,
    semanticInstanceId: itemVariantId,
    causalWorldId: `CAE-WORLD-REVIEWED-COMPETING-${scenario.id}`,
    causalStructure: "COMPETING_EXPLANATIONS:best-fit-cause>observation",
    locale,
    seed: input.seed,
    difficulty: scenario.difficulty,
    difficultyEvidence: difficultyEvidence(scenario),
    questionProfile: "FOUR_WAY",
    visibleContext: { backdrop: null, visibleNodeIds: [`${scenario.id}:observation`], hiddenNodeIds: [correct.id] },
    stem: `${copy.observation}: ${scenario.observation[locale]}\n\n${copy.evidence}: ${scenario.evidence[locale]}\n\n${copy.prompt}`,
    options: rendered.map((option) => option.text),
    correctIndex,
    answerId: correct.id,
    explanation: scenario.explanation[locale],
    causalTrace: [correct.id, `${scenario.id}:observation`],
    distractorMechanisms: rendered.flatMap((option) => option.distractorRole ? [option.distractorRole] : []),
    candidateComparisons: [],
    optionMetadata: rendered,
    metadata: {
      solver: "CAE_CAUSAL_WORLD_SOLVER_V3",
      sourceMode: "CURATED_COMPOSABLE_SCENARIO",
      qlAllocation: "PROVISIONAL_PENDING_SOURCE_SATURATION",
      reviewOnly: true,
      questionBankWritable: false,
      testEligible: false,
      mockEligible: false,
      publicEligible: false,
    },
  });
}
