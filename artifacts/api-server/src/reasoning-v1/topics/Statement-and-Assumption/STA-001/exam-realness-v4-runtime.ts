export type StaV4QlId =
  | "STA-QL-001"
  | "STA-QL-002"
  | "STA-QL-003"
  | "STA-QL-004"
  | "STA-QL-005"
  | "STA-QL-006";
export type StaV4CheckpointId = "STA-CP-001" | "STA-CP-002" | "STA-CP-003" | "STA-CP-004";
export type StaV4Language = "en" | "hi" | "pa";
export type StaV4Locale = "en-IN" | "hi-IN" | "pa-IN";
export type StaV4Difficulty = "Easy" | "Medium" | "Hard";
export type StaV4SourceProfile = "SSC" | "BANKING" | "PUNJAB_STATE" | "CROSS_EXAM_DISCOVERY";
export type StaV4ProfileId =
  | "SSC_2X4" | "SSC_3X4"
  | "BANK_2X5" | "BANK_3X5" | "BANK_4X5" | "BANK_3X5_NEGATIVE" | "BANK_5X5"
  | "PUNJAB_2X4" | "PUNJAB_3X4";

export const STA_V4_QL_IDS = Object.freeze([
  "STA-QL-001", "STA-QL-002", "STA-QL-003", "STA-QL-004", "STA-QL-005", "STA-QL-006",
] as const satisfies readonly StaV4QlId[]);
export const STA_V4_PROFILE_IDS = Object.freeze([
  "SSC_2X4", "SSC_3X4", "BANK_2X5", "BANK_3X5", "BANK_4X5", "BANK_3X5_NEGATIVE", "BANK_5X5", "PUNJAB_2X4", "PUNJAB_3X4",
] as const satisfies readonly StaV4ProfileId[]);
export const STA_V4_LANGUAGES = Object.freeze(["en", "hi", "pa"] as const satisfies readonly StaV4Language[]);
export const STA_V4_DIFFICULTIES = Object.freeze(["Easy", "Medium", "Hard"] as const satisfies readonly StaV4Difficulty[]);

export const STA_V4_SEMANTIC_AUTHORITY = Object.freeze({
  "STA-QL-001": "prerequisite / availability / capability / feasibility dependency",
  "STA-QL-002": "recommendation / policy / decision with relevant need plus efficacy",
  "STA-QL-003": "institutional notice / rule with audience relevance plus response capability",
  "STA-QL-004": "claim / prediction with a hidden causal or efficacy bridge",
  "STA-QL-005": "persuasive advertisement / appeal with audience-value and response dependency",
  "STA-QL-006": "comparison / measurement / evidence-generalisation with validity dependency",
} satisfies Readonly<Record<StaV4QlId, string>>);

export const STA_V4_CHECKPOINT_BY_QL = Object.freeze({
  "STA-QL-001": "STA-CP-001", "STA-QL-002": "STA-CP-001",
  "STA-QL-003": "STA-CP-002", "STA-QL-004": "STA-CP-002",
  "STA-QL-005": "STA-CP-003", "STA-QL-006": "STA-CP-004",
} satisfies Readonly<Record<StaV4QlId, StaV4CheckpointId>>);

type L = Readonly<{ en: string; hi: string; pa: string }>;
const l = (en: string, hi: string, pa: string): L => Object.freeze({ en, hi, pa });

interface Context {
  readonly id: string;
  readonly sourceProfile: StaV4SourceProfile;
  readonly actor: L;
  readonly task: L;
  readonly channel: L;
  readonly service: L;
  readonly issue: L;
  readonly intervention: L;
  readonly outcome: L;
  readonly audience: L;
  readonly benefit: L;
  readonly metric: L;
  readonly compareA: L;
  readonly compareB: L;
  readonly evidenceGroup: L;
}

const context = (
  id: string,
  sourceProfile: StaV4SourceProfile,
  values: readonly [L, L, L, L, L, L, L, L, L, L, L, L, L],
): Context => ({
  id, sourceProfile,
  actor: values[0], task: values[1], channel: values[2], service: values[3], issue: values[4], intervention: values[5], outcome: values[6],
  audience: values[7], benefit: values[8], metric: values[9], compareA: values[10], compareB: values[11], evidenceGroup: values[12],
});

const CONTEXTS: readonly Context[] = [
  context("EXAM-ENTRY", "SSC", [
    l("candidates", "अभ्यर्थी", "ਉਮੀਦਵਾਰ"), l("entry verification", "प्रवेश सत्यापन", "ਦਾਖਲਾ ਤਸਦੀਕ"), l("the QR verification desk", "क्यूआर सत्यापन डेस्क", "ਕਿਊਆਰ ਤਸਦੀਕ ਡੈਸਕ"),
    l("the examination-centre entry service", "परीक्षा-केंद्र प्रवेश सेवा", "ਪਰੀਖਿਆ ਕੇਂਦਰ ਦਾਖਲਾ ਸੇਵਾ"), l("entry delays", "प्रवेश में देरी", "ਦਾਖਲੇ ਵਿੱਚ ਦੇਰੀ"), l("an additional verification desk", "एक अतिरिक्त सत्यापन डेस्क", "ਇੱਕ ਵਾਧੂ ਤਸਦੀਕ ਡੈਸਕ"),
    l("shorter entry time", "कम प्रवेश समय", "ਘੱਟ ਦਾਖਲਾ ਸਮਾਂ"), l("exam candidates", "परीक्षा अभ्यर्थी", "ਪਰੀਖਿਆ ਉਮੀਦਵਾਰ"), l("quicker entry processing", "तेज़ प्रवेश प्रक्रिया", "ਤੇਜ਼ ਦਾਖਲਾ ਕਾਰਵਾਈ"),
    l("average verification time", "औसत सत्यापन समय", "ਔਸਤ ਤਸਦੀਕ ਸਮਾਂ"), l("QR-assisted verification", "क्यूआर-सहायित सत्यापन", "ਕਿਊਆਰ-ਸਹਾਇਤ ਤਸਦੀਕ"), l("manual verification", "मैनुअल सत्यापन", "ਹੱਥੋਂ ਤਸਦੀਕ"), l("morning-shift candidates", "सुबह की पाली के अभ्यर्थी", "ਸਵੇਰ ਦੀ ਪਾਲੀ ਦੇ ਉਮੀਦਵਾਰ"),
  ]),
  context("BANK-ROUTINE", "BANKING", [
    l("customers", "ग्राहक", "ਗਾਹਕ"), l("routine service requests", "नियमित सेवा अनुरोध", "ਰੋਜ਼ਮਰਰਾ ਸੇਵਾ ਬੇਨਤੀਆਂ"), l("the mobile banking app", "मोबाइल बैंकिंग ऐप", "ਮੋਬਾਈਲ ਬੈਂਕਿੰਗ ਐਪ"),
    l("the branch service system", "शाखा सेवा प्रणाली", "ਸ਼ਾਖਾ ਸੇਵਾ ਪ੍ਰਣਾਲੀ"), l("repeat counter visits", "बार-बार काउंटर पर जाना", "ਵਾਰ-ਵਾਰ ਕਾਊਂਟਰ ਤੇ ਜਾਣਾ"), l("a guided digital-help desk", "मार्गदर्शित डिजिटल सहायता डेस्क", "ਮਾਰਗਦਰਸ਼ਿਤ ਡਿਜ਼ਿਟਲ ਮਦਦ ਡੈਸਕ"),
    l("fewer repeat visits", "कम दोबारा विज़िट", "ਘੱਟ ਦੁਬਾਰਾ ਦੌਰੇ"), l("branch customers", "शाखा ग्राहक", "ਸ਼ਾਖਾ ਗਾਹਕ"), l("faster routine service", "तेज़ नियमित सेवा", "ਤੇਜ਼ ਰੋਜ਼ਮਰਰਾ ਸੇਵਾ"),
    l("average completion time", "औसत पूर्णता समय", "ਔਸਤ ਪੂਰਾ ਹੋਣ ਦਾ ਸਮਾਂ"), l("app-assisted service", "ऐप-सहायित सेवा", "ਐਪ-ਸਹਾਇਤ ਸੇਵਾ"), l("counter service", "काउंटर सेवा", "ਕਾਊਂਟਰ ਸੇਵਾ"), l("sampled branch customers", "नमूने में शामिल शाखा ग्राहक", "ਨਮੂਨੇ ਵਿੱਚ ਸ਼ਾਮਲ ਸ਼ਾਖਾ ਗਾਹਕ"),
  ]),
  context("DISTRICT-CERTIFICATE", "PUNJAB_STATE", [
    l("applicants", "आवेदक", "ਅਰਜ਼ੀਦਾਰ"), l("certificate applications", "प्रमाण-पत्र आवेदन", "ਸਰਟੀਫਿਕੇਟ ਅਰਜ਼ੀਆਂ"), l("the district online portal", "जिला ऑनलाइन पोर्टल", "ਜ਼ਿਲ੍ਹਾ ਆਨਲਾਈਨ ਪੋਰਟਲ"),
    l("the certificate service", "प्रमाण-पत्र सेवा", "ਸਰਟੀਫਿਕੇਟ ਸੇਵਾ"), l("incomplete applications", "अधूरे आवेदन", "ਅਧੂਰੀਆਂ ਅਰਜ਼ੀਆਂ"), l("a pre-submission checklist", "जमा करने से पहले की चेकलिस्ट", "ਜਮ੍ਹਾਂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਦੀ ਚੈੱਕਲਿਸਟ"),
    l("fewer incomplete submissions", "कम अधूरे जमा आवेदन", "ਘੱਟ ਅਧੂਰੀਆਂ ਜਮ੍ਹਾਂ ਅਰਜ਼ੀਆਂ"), l("certificate applicants", "प्रमाण-पत्र आवेदक", "ਸਰਟੀਫਿਕੇਟ ਅਰਜ਼ੀਦਾਰ"), l("simpler application handling", "सरल आवेदन प्रक्रिया", "ਸੌਖੀ ਅਰਜ਼ੀ ਕਾਰਵਾਈ"),
    l("application completion rate", "आवेदन पूर्णता दर", "ਅਰਜ਼ੀ ਪੂਰਨਤਾ ਦਰ"), l("checklist-assisted applications", "चेकलिस्ट-सहायित आवेदन", "ਚੈੱਕਲਿਸਟ-ਸਹਾਇਤ ਅਰਜ਼ੀਆਂ"), l("standard applications", "सामान्य आवेदन", "ਸਧਾਰਣ ਅਰਜ਼ੀਆਂ"), l("sampled certificate applications", "नमूने के प्रमाण-पत्र आवेदन", "ਨਮੂਨੇ ਵਾਲੀਆਂ ਸਰਟੀਫਿਕੇਟ ਅਰਜ਼ੀਆਂ"),
  ]),
  context("HR-LEAVE", "CROSS_EXAM_DISCOVERY", [
    l("employees", "कर्मचारी", "ਕਰਮਚਾਰੀ"), l("leave requests", "अवकाश अनुरोध", "ਛੁੱਟੀ ਬੇਨਤੀਆਂ"), l("the HR portal", "एचआर पोर्टल", "ਐਚਆਰ ਪੋਰਟਲ"),
    l("the HR request system", "एचआर अनुरोध प्रणाली", "ਐਚਆਰ ਬੇਨਤੀ ਪ੍ਰਣਾਲੀ"), l("processing delays", "प्रक्रिया में देरी", "ਕਾਰਵਾਈ ਵਿੱਚ ਦੇਰੀ"), l("automated document screening", "स्वचालित दस्तावेज़ जांच", "ਆਟੋਮੈਟਿਕ ਦਸਤਾਵੇਜ਼ ਜਾਂਚ"),
    l("quicker request processing", "तेज़ अनुरोध प्रक्रिया", "ਤੇਜ਼ ਬੇਨਤੀ ਕਾਰਵਾਈ"), l("employees using HR services", "एचआर सेवाएँ लेने वाले कर्मचारी", "ਐਚਆਰ ਸੇਵਾਵਾਂ ਵਰਤਣ ਵਾਲੇ ਕਰਮਚਾਰੀ"), l("quicker approvals", "तेज़ अनुमोदन", "ਤੇਜ਼ ਮਨਜ਼ੂਰੀਆਂ"),
    l("average processing days", "औसत प्रक्रिया दिन", "ਔਸਤ ਕਾਰਵਾਈ ਦਿਨ"), l("automated screening", "स्वचालित जांच", "ਆਟੋਮੈਟਿਕ ਜਾਂਚ"), l("manual screening", "मैनुअल जांच", "ਹੱਥੋਂ ਜਾਂਚ"), l("sampled leave requests", "नमूने के अवकाश अनुरोध", "ਨਮੂਨੇ ਵਾਲੀਆਂ ਛੁੱਟੀ ਬੇਨਤੀਆਂ"),
  ]),
  context("CLINIC-APPOINTMENT", "PUNJAB_STATE", [
    l("patients", "मरीज", "ਮਰੀਜ਼"), l("appointment booking", "अपॉइंटमेंट बुकिंग", "ਮੁਲਾਕਾਤ ਬੁਕਿੰਗ"), l("the clinic helpline", "क्लिनिक हेल्पलाइन", "ਕਲੀਨਿਕ ਹੈਲਪਲਾਈਨ"),
    l("the outpatient appointment service", "बाह्य-रोगी अपॉइंटमेंट सेवा", "ਬਾਹਰੀ ਮਰੀਜ਼ ਮੁਲਾਕਾਤ ਸੇਵਾ"), l("missed appointments", "छूटी हुई अपॉइंटमेंट", "ਛੁੱਟੀਆਂ ਮੁਲਾਕਾਤਾਂ"), l("appointment reminder messages", "अपॉइंटमेंट याद-दिहानी संदेश", "ਮੁਲਾਕਾਤ ਯਾਦ-ਦਿਹਾਨੀ ਸੁਨੇਹੇ"),
    l("fewer missed appointments", "कम छूटी हुई अपॉइंटमेंट", "ਘੱਟ ਛੁੱਟੀਆਂ ਮੁਲਾਕਾਤਾਂ"), l("clinic patients", "क्लिनिक मरीज", "ਕਲੀਨਿਕ ਮਰੀਜ਼"), l("timely appointment handling", "समय पर अपॉइंटमेंट प्रक्रिया", "ਸਮੇਂ ਸਿਰ ਮੁਲਾਕਾਤ ਕਾਰਵਾਈ"),
    l("appointment attendance rate", "अपॉइंटमेंट उपस्थिति दर", "ਮੁਲਾਕਾਤ ਹਾਜ਼ਰੀ ਦਰ"), l("reminder-supported bookings", "याद-दिहानी वाले बुकिंग", "ਯਾਦ-ਦਿਹਾਨੀ ਵਾਲੀਆਂ ਬੁਕਿੰਗਾਂ"), l("standard bookings", "सामान्य बुकिंग", "ਸਧਾਰਣ ਬੁਕਿੰਗਾਂ"), l("sampled appointments", "नमूने की अपॉइंटमेंट", "ਨਮੂਨੇ ਵਾਲੀਆਂ ਮੁਲਾਕਾਤਾਂ"),
  ]),
  context("TRANSIT-PASS", "SSC", [
    l("commuters", "यात्री", "ਯਾਤਰੀ"), l("travel-pass renewal", "यात्रा-पास नवीनीकरण", "ਯਾਤਰਾ-ਪਾਸ ਨਵੀਨੀਕਰਨ"), l("the service kiosk", "सेवा कियोस्क", "ਸੇਵਾ ਕਿਓਸਕ"),
    l("the transit pass service", "ट्रांजिट पास सेवा", "ਆਵਾਜਾਈ ਪਾਸ ਸੇਵਾ"), l("renewal queues", "नवीनीकरण कतारें", "ਨਵੀਨੀਕਰਨ ਕਤਾਰਾਂ"), l("a self-service renewal option", "स्व-सेवा नवीनीकरण विकल्प", "ਸਵੈ-ਸੇਵਾ ਨਵੀਨੀਕਰਨ ਵਿਕਲਪ"),
    l("shorter renewal queues", "छोटी नवीनीकरण कतारें", "ਛੋਟੀਆਂ ਨਵੀਨੀਕਰਨ ਕਤਾਰਾਂ"), l("pass holders", "पास धारक", "ਪਾਸ ਧਾਰਕ"), l("faster pass renewal", "तेज़ पास नवीनीकरण", "ਤੇਜ਼ ਪਾਸ ਨਵੀਨੀਕਰਨ"),
    l("average waiting time", "औसत प्रतीक्षा समय", "ਔਸਤ ਉਡੀਕ ਸਮਾਂ"), l("kiosk renewal", "कियोस्क नवीनीकरण", "ਕਿਓਸਕ ਨਵੀਨੀਕਰਨ"), l("counter renewal", "काउंटर नवीनीकरण", "ਕਾਊਂਟਰ ਨਵੀਨੀਕਰਨ"), l("sampled pass renewals", "नमूने के पास नवीनीकरण", "ਨਮੂਨੇ ਵਾਲੇ ਪਾਸ ਨਵੀਨੀਕਰਨ"),
  ]),
  context("LIBRARY-MEMBERSHIP", "SSC", [
    l("members", "सदस्य", "ਮੈਂਬਰ"), l("membership renewal", "सदस्यता नवीनीकरण", "ਮੈਂਬਰਸ਼ਿਪ ਨਵੀਨੀਕਰਨ"), l("the library web portal", "पुस्तकालय वेब पोर्टल", "ਲਾਇਬ੍ਰੇਰੀ ਵੈੱਬ ਪੋਰਟਲ"),
    l("the public library service", "सार्वजनिक पुस्तकालय सेवा", "ਜਨਤਕ ਲਾਇਬ੍ਰੇਰੀ ਸੇਵਾ"), l("renewal backlogs", "नवीनीकरण लंबित मामले", "ਨਵੀਨੀਕਰਨ ਬਕਾਇਆ ਮਾਮਲੇ"), l("online renewal prompts", "ऑनलाइन नवीनीकरण संकेत", "ਆਨਲਾਈਨ ਨਵੀਨੀਕਰਨ ਸੰਕੇਤ"),
    l("faster renewals", "तेज़ नवीनीकरण", "ਤੇਜ਼ ਨਵੀਨੀਕਰਨ"), l("library members", "पुस्तकालय सदस्य", "ਲਾਇਬ੍ਰੇਰੀ ਮੈਂਬਰ"), l("easier membership renewal", "सरल सदस्यता नवीनीकरण", "ਸੌਖਾ ਮੈਂਬਰਸ਼ਿਪ ਨਵੀਨੀਕਰਨ"),
    l("renewal completion time", "नवीनीकरण पूर्णता समय", "ਨਵੀਨੀਕਰਨ ਪੂਰਾ ਹੋਣ ਦਾ ਸਮਾਂ"), l("web-portal renewal", "वेब-पोर्टल नवीनीकरण", "ਵੈੱਬ-ਪੋਰਟਲ ਨਵੀਨੀਕਰਨ"), l("desk renewal", "डेस्क नवीनीकरण", "ਡੈਸਕ ਨਵੀਨੀਕਰਨ"), l("sampled library renewals", "नमूने के पुस्तकालय नवीनीकरण", "ਨਮੂਨੇ ਵਾਲੇ ਲਾਇਬ੍ਰੇਰੀ ਨਵੀਨੀਕਰਨ"),
  ]),
  context("SCHOLARSHIP-PORTAL", "PUNJAB_STATE", [
    l("students", "छात्र", "ਵਿਦਿਆਰਥੀ"), l("scholarship applications", "छात्रवृत्ति आवेदन", "ਵਜ਼ੀਫ਼ਾ ਅਰਜ਼ੀਆਂ"), l("the scholarship portal", "छात्रवृत्ति पोर्टल", "ਵਜ਼ੀਫ਼ਾ ਪੋਰਟਲ"),
    l("the scholarship application service", "छात्रवृत्ति आवेदन सेवा", "ਵਜ਼ੀਫ਼ਾ ਅਰਜ਼ੀ ਸੇਵਾ"), l("document omissions", "दस्तावेज़ छूट जाना", "ਦਸਤਾਵੇਜ਼ ਰਹਿ ਜਾਣਾ"), l("a document-preview step", "दस्तावेज़ पूर्वावलोकन चरण", "ਦਸਤਾਵੇਜ਼ ਝਲਕ ਕਦਮ"),
    l("fewer incomplete applications", "कम अधूरे आवेदन", "ਘੱਟ ਅਧੂਰੀਆਂ ਅਰਜ਼ੀਆਂ"), l("scholarship applicants", "छात्रवृत्ति आवेदक", "ਵਜ਼ੀਫ਼ਾ ਅਰਜ਼ੀਦਾਰ"), l("clearer application submission", "स्पष्ट आवेदन जमा प्रक्रिया", "ਸਪਸ਼ਟ ਅਰਜ਼ੀ ਜਮ੍ਹਾਂ ਕਾਰਵਾਈ"),
    l("complete-application rate", "पूर्ण आवेदन दर", "ਪੂਰੀ ਅਰਜ਼ੀ ਦਰ"), l("preview-assisted submission", "पूर्वावलोकन-सहायित जमा", "ਝਲਕ-ਸਹਾਇਤ ਜਮ੍ਹਾਂ"), l("standard submission", "सामान्य जमा", "ਸਧਾਰਣ ਜਮ੍ਹਾਂ"), l("sampled scholarship applications", "नमूने के छात्रवृत्ति आवेदन", "ਨਮੂਨੇ ਵਾਲੀਆਂ ਵਜ਼ੀਫ਼ਾ ਅਰਜ਼ੀਆਂ"),
  ]),
  context("UTILITY-BILL", "BANKING", [
    l("bill payers", "बिल भुगतानकर्ता", "ਬਿੱਲ ਭੁਗਤਾਨਕਰਤਾ"), l("utility-bill payment", "उपयोगिता बिल भुगतान", "ਯੂਟਿਲਿਟੀ ਬਿੱਲ ਭੁਗਤਾਨ"), l("the digital payment channel", "डिजिटल भुगतान माध्यम", "ਡਿਜ਼ਿਟਲ ਭੁਗਤਾਨ ਮਾਧਿਅਮ"),
    l("the bill-payment service", "बिल भुगतान सेवा", "ਬਿੱਲ ਭੁਗਤਾਨ ਸੇਵਾ"), l("payment retries", "भुगतान दोहराना", "ਭੁਗਤਾਨ ਮੁੜ ਕਰਨਾ"), l("instant payment-status alerts", "तत्काल भुगतान-स्थिति सूचना", "ਤੁਰੰਤ ਭੁਗਤਾਨ-ਸਥਿਤੀ ਸੂਚਨਾ"),
    l("fewer payment retries", "कम दोहराए भुगतान", "ਘੱਟ ਮੁੜ ਭੁਗਤਾਨ"), l("digital bill payers", "डिजिटल बिल भुगतानकर्ता", "ਡਿਜ਼ਿਟਲ ਬਿੱਲ ਭੁਗਤਾਨਕਰਤਾ"), l("clearer payment confirmation", "स्पष्ट भुगतान पुष्टि", "ਸਪਸ਼ਟ ਭੁਗਤਾਨ ਪੁਸ਼ਟੀ"),
    l("successful-payment rate", "सफल भुगतान दर", "ਸਫਲ ਭੁਗਤਾਨ ਦਰ"), l("alert-enabled payment", "सूचना-सक्षम भुगतान", "ਸੂਚਨਾ-ਸਮਰਥ ਭੁਗਤਾਨ"), l("standard payment", "सामान्य भुगतान", "ਸਧਾਰਣ ਭੁਗਤਾਨ"), l("sampled bill payments", "नमूने के बिल भुगतान", "ਨਮੂਨੇ ਵਾਲੇ ਬਿੱਲ ਭੁਗਤਾਨ"),
  ]),
  context("RECRUITMENT-APPLICATION", "BANKING", [
    l("job applicants", "नौकरी आवेदक", "ਨੌਕਰੀ ਅਰਜ਼ੀਦਾਰ"), l("job applications", "नौकरी आवेदन", "ਨੌਕਰੀ ਅਰਜ਼ੀਆਂ"), l("the recruitment portal", "भर्ती पोर्टल", "ਭਰਤੀ ਪੋਰਟਲ"),
    l("the recruitment service", "भर्ती सेवा", "ਭਰਤੀ ਸੇਵਾ"), l("incomplete profiles", "अधूरी प्रोफ़ाइल", "ਅਧੂਰੀ ਪ੍ਰੋਫ਼ਾਈਲ"), l("a profile-completeness indicator", "प्रोफ़ाइल पूर्णता संकेतक", "ਪ੍ਰੋਫ਼ਾਈਲ ਪੂਰਨਤਾ ਸੰਕੇਤਕ"),
    l("fewer incomplete applications", "कम अधूरे आवेदन", "ਘੱਟ ਅਧੂਰੀਆਂ ਅਰਜ਼ੀਆਂ"), l("prospective applicants", "संभावित आवेदक", "ਸੰਭਾਵੀ ਅਰਜ਼ੀਦਾਰ"), l("clearer application tracking", "स्पष्ट आवेदन ट्रैकिंग", "ਸਪਸ਼ਟ ਅਰਜ਼ੀ ਟਰੈਕਿੰਗ"),
    l("application-completion rate", "आवेदन पूर्णता दर", "ਅਰਜ਼ੀ ਪੂਰਨਤਾ ਦਰ"), l("guided application", "मार्गदर्शित आवेदन", "ਮਾਰਗਦਰਸ਼ਿਤ ਅਰਜ਼ੀ"), l("standard application", "सामान्य आवेदन", "ਸਧਾਰਣ ਅਰਜ਼ੀ"), l("sampled recruitment applications", "नमूने के भर्ती आवेदन", "ਨਮੂਨੇ ਵਾਲੀਆਂ ਭਰਤੀ ਅਰਜ਼ੀਆਂ"),
  ]),
  context("INSURANCE-CLAIM", "BANKING", [
    l("claimants", "दावाकर्ता", "ਦਾਅਵੇਦਾਰ"), l("claim submission", "दावा जमा", "ਦਾਅਵਾ ਜਮ੍ਹਾਂ"), l("the claims portal", "दावा पोर्टल", "ਦਾਅਵਾ ਪੋਰਟਲ"),
    l("the insurance claim service", "बीमा दावा सेवा", "ਬੀਮਾ ਦਾਅਵਾ ਸੇਵਾ"), l("missing claim documents", "दावा दस्तावेज़ों की कमी", "ਦਾਅਵਾ ਦਸਤਾਵੇਜ਼ਾਂ ਦੀ ਘਾਟ"), l("a document-requirement guide", "दस्तावेज़ आवश्यकता मार्गदर्शिका", "ਦਸਤਾਵੇਜ਼ ਲੋੜ ਮਾਰਗਦਰਸ਼ਿਕਾ"),
    l("fewer document-deficient claims", "कम दस्तावेज़-अपूर्ण दावे", "ਘੱਟ ਦਸਤਾਵੇਜ਼-ਅਧੂਰੇ ਦਾਅਵੇ"), l("insurance claimants", "बीमा दावाकर्ता", "ਬੀਮਾ ਦਾਅਵੇਦਾਰ"), l("clearer claim preparation", "स्पष्ट दावा तैयारी", "ਸਪਸ਼ਟ ਦਾਅਵਾ ਤਿਆਰੀ"),
    l("claim processing time", "दावा प्रक्रिया समय", "ਦਾਅਵਾ ਕਾਰਵਾਈ ਸਮਾਂ"), l("guided claim submission", "मार्गदर्शित दावा जमा", "ਮਾਰਗਦਰਸ਼ਿਤ ਦਾਅਵਾ ਜਮ੍ਹਾਂ"), l("standard claim submission", "सामान्य दावा जमा", "ਸਧਾਰਣ ਦਾਅਵਾ ਜਮ੍ਹਾਂ"), l("sampled insurance claims", "नमूने के बीमा दावे", "ਨਮੂਨੇ ਵਾਲੇ ਬੀਮਾ ਦਾਅਵੇ"),
  ]),
  context("MUNICIPAL-GRIEVANCE", "PUNJAB_STATE", [
    l("residents", "निवासी", "ਰਿਹਾਇਸ਼ੀ"), l("grievance filing", "शिकायत दर्ज करना", "ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰਨਾ"), l("the civic grievance portal", "नागरिक शिकायत पोर्टल", "ਨਾਗਰਿਕ ਸ਼ਿਕਾਇਤ ਪੋਰਟਲ"),
    l("the municipal grievance service", "नगर शिकायत सेवा", "ਨਗਰ ਸ਼ਿਕਾਇਤ ਸੇਵਾ"), l("untracked complaints", "बिना ट्रैकिंग वाली शिकायतें", "ਬਿਨਾਂ ਟਰੈਕਿੰਗ ਵਾਲੀਆਂ ਸ਼ਿਕਾਇਤਾਂ"), l("a complaint-tracking number", "शिकायत ट्रैकिंग नंबर", "ਸ਼ਿਕਾਇਤ ਟਰੈਕਿੰਗ ਨੰਬਰ"),
    l("better complaint tracking", "बेहतर शिकायत ट्रैकिंग", "ਵਧੀਆ ਸ਼ਿਕਾਇਤ ਟਰੈਕਿੰਗ"), l("residents filing complaints", "शिकायत दर्ज करने वाले निवासी", "ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰਨ ਵਾਲੇ ਰਿਹਾਇਸ਼ੀ"), l("clearer grievance tracking", "स्पष्ट शिकायत ट्रैकिंग", "ਸਪਸ਼ਟ ਸ਼ਿਕਾਇਤ ਟਰੈਕਿੰਗ"),
    l("resolution-tracking rate", "समाधान ट्रैकिंग दर", "ਨਿਪਟਾਰਾ ਟਰੈਕਿੰਗ ਦਰ"), l("tracked complaints", "ट्रैक की गई शिकायतें", "ਟਰੈਕ ਕੀਤੀਆਂ ਸ਼ਿਕਾਇਤਾਂ"), l("untracked submissions", "बिना ट्रैकिंग जमा शिकायतें", "ਬਿਨਾਂ ਟਰੈਕਿੰਗ ਜਮ੍ਹਾਂ ਸ਼ਿਕਾਇਤਾਂ"), l("sampled civic complaints", "नमूने की नागरिक शिकायतें", "ਨਮੂਨੇ ਵਾਲੀਆਂ ਨਾਗਰਿਕ ਸ਼ਿਕਾਇਤਾਂ"),
  ]),
  context("COOPERATIVE-LOAN", "PUNJAB_STATE", [
    l("borrowers", "उधारकर्ता", "ਕਰਜ਼ ਲੈਣ ਵਾਲੇ"), l("loan applications", "ऋण आवेदन", "ਕਰਜ਼ ਅਰਜ਼ੀਆਂ"), l("the cooperative application desk", "सहकारी आवेदन डेस्क", "ਸਹਿਕਾਰੀ ਅਰਜ਼ੀ ਡੈਸਕ"),
    l("the cooperative loan service", "सहकारी ऋण सेवा", "ਸਹਿਕਾਰੀ ਕਰਜ਼ ਸੇਵਾ"), l("application clarification visits", "आवेदन स्पष्टीकरण के लिए विज़िट", "ਅਰਜ਼ੀ ਸਪਸ਼ਟੀਕਰਨ ਦੌਰੇ"), l("a document-verification appointment", "दस्तावेज़ सत्यापन अपॉइंटमेंट", "ਦਸਤਾਵੇਜ਼ ਤਸਦੀਕ ਮੁਲਾਕਾਤ"),
    l("fewer clarification visits", "कम स्पष्टीकरण विज़िट", "ਘੱਟ ਸਪਸ਼ਟੀਕਰਨ ਦੌਰੇ"), l("cooperative borrowers", "सहकारी उधारकर्ता", "ਸਹਿਕਾਰੀ ਕਰਜ਼ ਲੈਣ ਵਾਲੇ"), l("clearer loan-application handling", "स्पष्ट ऋण आवेदन प्रक्रिया", "ਸਪਸ਼ਟ ਕਰਜ਼ ਅਰਜ਼ੀ ਕਾਰਵਾਈ"),
    l("application turnaround time", "आवेदन निपटान समय", "ਅਰਜ਼ੀ ਨਿਪਟਾਰਾ ਸਮਾਂ"), l("appointment-based verification", "अपॉइंटमेंट-आधारित सत्यापन", "ਮੁਲਾਕਾਤ-ਆਧਾਰਿਤ ਤਸਦੀਕ"), l("walk-in verification", "वॉक-इन सत्यापन", "ਵਾਕ-ਇਨ ਤਸਦੀਕ"), l("sampled cooperative applications", "नमूने के सहकारी आवेदन", "ਨਮੂਨੇ ਵਾਲੀਆਂ ਸਹਿਕਾਰੀ ਅਰਜ਼ੀਆਂ"),
  ]),
  context("AGRI-SUBSIDY", "PUNJAB_STATE", [
    l("farm applicants", "कृषि आवेदक", "ਖੇਤੀ ਅਰਜ਼ੀਦਾਰ"), l("subsidy applications", "सब्सिडी आवेदन", "ਸਬਸਿਡੀ ਅਰਜ਼ੀਆਂ"), l("the agriculture facilitation centre", "कृषि सुविधा केंद्र", "ਖੇਤੀ ਸੁਵਿਧਾ ਕੇਂਦਰ"),
    l("the subsidy application service", "सब्सिडी आवेदन सेवा", "ਸਬਸਿਡੀ ਅਰਜ਼ੀ ਸੇਵਾ"), l("eligibility-query visits", "पात्रता संबंधी विज़िट", "ਯੋਗਤਾ ਸਬੰਧੀ ਦੌਰੇ"), l("a pre-application eligibility sheet", "पूर्व-आवेदन पात्रता पत्रक", "ਅਰਜ਼ੀ ਤੋਂ ਪਹਿਲਾਂ ਯੋਗਤਾ ਪੱਤਰ"),
    l("fewer avoidable visits", "कम अनावश्यक विज़िट", "ਘੱਟ ਬੇਲੋੜੇ ਦੌਰੇ"), l("subsidy applicants", "सब्सिडी आवेदक", "ਸਬਸਿਡੀ ਅਰਜ਼ੀਦਾਰ"), l("clearer eligibility guidance", "स्पष्ट पात्रता मार्गदर्शन", "ਸਪਸ਼ਟ ਯੋਗਤਾ ਮਾਰਗਦਰਸ਼ਨ"),
    l("eligible-application rate", "पात्र आवेदन दर", "ਯੋਗ ਅਰਜ਼ੀ ਦਰ"), l("guided eligibility screening", "मार्गदर्शित पात्रता जांच", "ਮਾਰਗਦਰਸ਼ਿਤ ਯੋਗਤਾ ਜਾਂਚ"), l("standard screening", "सामान्य जांच", "ਸਧਾਰਣ ਜਾਂਚ"), l("sampled subsidy applications", "नमूने के सब्सिडी आवेदन", "ਨਮੂਨੇ ਵਾਲੀਆਂ ਸਬਸਿਡੀ ਅਰਜ਼ੀਆਂ"),
  ]),
  context("SCHOOL-ATTENDANCE", "SSC", [
    l("guardians", "अभिभावक", "ਮਾਪੇ"), l("attendance reporting", "उपस्थिति रिपोर्टिंग", "ਹਾਜ਼ਰੀ ਰਿਪੋਰਟਿੰਗ"), l("the school messaging system", "स्कूल संदेश प्रणाली", "ਸਕੂਲ ਸੁਨੇਹਾ ਪ੍ਰਣਾਲੀ"),
    l("the school attendance service", "स्कूल उपस्थिति सेवा", "ਸਕੂਲ ਹਾਜ਼ਰੀ ਸੇਵਾ"), l("late absence reporting", "अनुपस्थिति की देर से सूचना", "ਗੈਰਹਾਜ਼ਰੀ ਦੀ ਦੇਰ ਨਾਲ ਸੂਚਨਾ"), l("same-day attendance alerts", "उसी दिन उपस्थिति सूचना", "ਉਸੇ ਦਿਨ ਹਾਜ਼ਰੀ ਸੂਚਨਾ"),
    l("quicker absence follow-up", "तेज़ अनुपस्थिति फॉलो-अप", "ਤੇਜ਼ ਗੈਰਹਾਜ਼ਰੀ ਫਾਲੋ-ਅੱਪ"), l("student guardians", "छात्र अभिभावक", "ਵਿਦਿਆਰਥੀ ਮਾਪੇ"), l("timely attendance information", "समय पर उपस्थिति जानकारी", "ਸਮੇਂ ਸਿਰ ਹਾਜ਼ਰੀ ਜਾਣਕਾਰੀ"),
    l("same-day reporting rate", "उसी दिन रिपोर्टिंग दर", "ਉਸੇ ਦਿਨ ਰਿਪੋਰਿੰਗ ਦਰ"), l("alert-supported reporting", "सूचना-सहायित रिपोर्टिंग", "ਸੂਚਨਾ-ਸਹਾਇਤ ਰਿਪੋਰਿੰਗ"), l("standard reporting", "सामान्य रिपोर्टिंग", "ਸਧਾਰਣ ਰਿਪੋਰਿੰਗ"), l("sampled attendance records", "नमूने के उपस्थिति रिकॉर्ड", "ਨਮੂਨੇ ਵਾਲੇ ਹਾਜ਼ਰੀ ਰਿਕਾਰਡ"),
  ]),
  context("WAREHOUSE-INVENTORY", "CROSS_EXAM_DISCOVERY", [
    l("store staff", "भंडार कर्मचारी", "ਸਟੋਰ ਕਰਮਚਾਰੀ"), l("inventory updates", "इन्वेंटरी अपडेट", "ਇਨਵੈਂਟਰੀ ਅੱਪਡੇਟ"), l("the barcode terminal", "बारकोड टर्मिनल", "ਬਾਰਕੋਡ ਟਰਮੀਨਲ"),
    l("the inventory-control service", "इन्वेंटरी नियंत्रण सेवा", "ਇਨਵੈਂਟਰੀ ਨਿਯੰਤਰਣ ਸੇਵਾ"), l("stock-record mismatches", "स्टॉक रिकॉर्ड अंतर", "ਸਟਾਕ ਰਿਕਾਰਡ ਅੰਤਰ"), l("scan-at-receipt recording", "प्राप्ति पर स्कैन रिकॉर्डिंग", "ਪ੍ਰਾਪਤੀ ਵੇਲੇ ਸਕੈਨ ਰਿਕਾਰਡਿੰਗ"),
    l("fewer stock-record mismatches", "कम स्टॉक रिकॉर्ड अंतर", "ਘੱਟ ਸਟਾਕ ਰਿਕਾਰਡ ਅੰਤਰ"), l("inventory staff", "इन्वेंटरी कर्मचारी", "ਇਨਵੈਂਟਰੀ ਕਰਮਚਾਰੀ"), l("quicker stock recording", "तेज़ स्टॉक रिकॉर्डिंग", "ਤੇਜ਼ ਸਟਾਕ ਰਿਕਾਰਡਿੰਗ"),
    l("record-matching rate", "रिकॉर्ड मिलान दर", "ਰਿਕਾਰਡ ਮਿਲਾਨ ਦਰ"), l("scan-based recording", "स्कैन-आधारित रिकॉर्डिंग", "ਸਕੈਨ-ਆਧਾਰਿਤ ਰਿਕਾਰਡਿੰਗ"), l("manual recording", "मैनुअल रिकॉर्डिंग", "ਹੱਥੋਂ ਰਿਕਾਰਡਿੰਗ"), l("sampled inventory receipts", "नमूने की इन्वेंटरी प्राप्तियाँ", "ਨਮੂਨੇ ਵਾਲੀਆਂ ਇਨਵੈਂਟਰੀ ਪ੍ਰਾਪਤੀਆਂ"),
  ]),
  context("COURIER-DELIVERY", "CROSS_EXAM_DISCOVERY", [
    l("recipients", "प्राप्तकर्ता", "ਪ੍ਰਾਪਤਕਰਤਾ"), l("delivery coordination", "डिलीवरी समन्वय", "ਡਿਲਿਵਰੀ ਤਾਲਮੇਲ"), l("the delivery-status link", "डिलीवरी-स्थिति लिंक", "ਡਿਲਿਵਰੀ-ਸਥਿਤੀ ਲਿੰਕ"),
    l("the courier delivery service", "कूरियर डिलीवरी सेवा", "ਕੂਰੀਅਰ ਡਿਲਿਵਰੀ ਸੇਵਾ"), l("failed delivery attempts", "असफल डिलीवरी प्रयास", "ਅਸਫਲ ਡਿਲਿਵਰੀ ਕੋਸ਼ਿਸ਼ਾਂ"), l("a delivery-window confirmation", "डिलीवरी समय-खिड़की पुष्टि", "ਡਿਲਿਵਰੀ ਸਮਾਂ-ਵਿੰਡੋ ਪੁਸ਼ਟੀ"),
    l("fewer failed attempts", "कम असफल प्रयास", "ਘੱਟ ਅਸਫਲ ਕੋਸ਼ਿਸ਼ਾਂ"), l("parcel recipients", "पार्सल प्राप्तकर्ता", "ਪਾਰਸਲ ਪ੍ਰਾਪਤਕਰਤਾ"), l("clearer delivery coordination", "स्पष्ट डिलीवरी समन्वय", "ਸਪਸ਼ਟ ਡਿਲਿਵਰੀ ਤਾਲਮੇਲ"),
    l("first-attempt delivery rate", "पहले प्रयास की डिलीवरी दर", "ਪਹਿਲੀ ਕੋਸ਼ਿਸ਼ ਡਿਲਿਵਰੀ ਦਰ"), l("confirmed-window delivery", "पुष्टि समय-खिड़की डिलीवरी", "ਪੁਸ਼ਟੀ ਸਮਾਂ-ਵਿੰਡੋ ਡਿਲਿਵਰੀ"), l("standard delivery", "सामान्य डिलीवरी", "ਸਧਾਰਣ ਡਿਲਿਵਰੀ"), l("sampled parcel deliveries", "नमूने की पार्सल डिलीवरी", "ਨਮੂਨੇ ਵਾਲੀਆਂ ਪਾਰਸਲ ਡਿਲਿਵਰੀਆਂ"),
  ]),
  context("ONLINE-RETURNS", "BANKING", [
    l("buyers", "खरीदार", "ਖਰੀਦਦਾਰ"), l("return requests", "वापसी अनुरोध", "ਵਾਪਸੀ ਬੇਨਤੀਆਂ"), l("the returns page", "वापसी पेज", "ਵਾਪਸੀ ਪੰਨਾ"),
    l("the online returns service", "ऑनलाइन वापसी सेवा", "ਆਨਲਾਈਨ ਵਾਪਸੀ ਸੇਵਾ"), l("return-status enquiries", "वापसी स्थिति पूछताछ", "ਵਾਪਸੀ ਸਥਿਤੀ ਪੁੱਛਗਿੱਛ"), l("a live return-status tracker", "लाइव वापसी-स्थिति ट्रैकर", "ਲਾਈਵ ਵਾਪਸੀ-ਸਥਿਤੀ ਟਰੈਕਰ"),
    l("fewer status enquiries", "कम स्थिति पूछताछ", "ਘੱਟ ਸਥਿਤੀ ਪੁੱਛਗਿੱਛ"), l("online buyers", "ऑनलाइन खरीदार", "ਆਨਲਾਈਨ ਖਰੀਦਦਾਰ"), l("clearer return tracking", "स्पष्ट वापसी ट्रैकिंग", "ਸਪਸ਼ਟ ਵਾਪਸੀ ਟਰੈਕਿੰਗ"),
    l("return-resolution time", "वापसी समाधान समय", "ਵਾਪਸੀ ਨਿਪਟਾਰਾ ਸਮਾਂ"), l("tracker-supported returns", "ट्रैकर-सहायित वापसी", "ਟਰੈਕਰ-ਸਹਾਇਤ ਵਾਪਸੀ"), l("standard returns", "सामान्य वापसी", "ਸਧਾਰਣ ਵਾਪਸੀ"), l("sampled return requests", "नमूने के वापसी अनुरोध", "ਨਮੂਨੇ ਵਾਲੀਆਂ ਵਾਪਸੀ ਬੇਨਤੀਆਂ"),
  ]),
  context("PENSION-QUERY", "PUNJAB_STATE", [
    l("pension applicants", "पेंशन आवेदक", "ਪੈਨਸ਼ਨ ਅਰਜ਼ੀਦਾਰ"), l("application-status queries", "आवेदन स्थिति पूछताछ", "ਅਰਜ਼ੀ ਸਥਿਤੀ ਪੁੱਛਗਿੱਛ"), l("the citizen service helpline", "नागरिक सेवा हेल्पलाइन", "ਨਾਗਰਿਕ ਸੇਵਾ ਹੈਲਪਲਾਈਨ"),
    l("the pension application service", "पेंशन आवेदन सेवा", "ਪੈਨਸ਼ਨ ਅਰਜ਼ੀ ਸੇਵਾ"), l("repeat status visits", "बार-बार स्थिति विज़िट", "ਵਾਰ-ਵਾਰ ਸਥਿਤੀ ਦੌਰੇ"), l("automated status updates", "स्वचालित स्थिति अपडेट", "ਆਟੋਮੈਟਿਕ ਸਥਿਤੀ ਅੱਪਡੇਟ"),
    l("fewer repeat visits", "कम दोबारा विज़िट", "ਘੱਟ ਦੁਬਾਰਾ ਦੌਰੇ"), l("pension applicants", "पेंशन आवेदक", "ਪੈਨਸ਼ਨ ਅਰਜ਼ੀਦਾਰ"), l("clearer application status", "स्पष्ट आवेदन स्थिति", "ਸਪਸ਼ਟ ਅਰਜ਼ੀ ਸਥਿਤੀ"),
    l("status-query resolution time", "स्थिति पूछताछ समाधान समय", "ਸਥਿਤੀ ਪੁੱਛਗਿੱਛ ਨਿਪਟਾਰਾ ਸਮਾਂ"), l("automated status service", "स्वचालित स्थिति सेवा", "ਆਟੋਮੈਟਿਕ ਸਥਿਤੀ ਸੇਵਾ"), l("desk status service", "डेस्क स्थिति सेवा", "ਡੈਸਕ ਸਥਿਤੀ ਸੇਵਾ"), l("sampled pension queries", "नमूने की पेंशन पूछताछ", "ਨਮੂਨੇ ਵਾਲੀਆਂ ਪੈਨਸ਼ਨ ਪੁੱਛਗਿੱਛ"),
  ]),
] as const;

interface CandidateAuthority {
  readonly id: string;
  readonly implicit: boolean;
  readonly textVariants: readonly [L, L];
  readonly rationale: L;
  readonly misconception: "REQUIRED_DEPENDENCY" | "SUPPORTIVE_NOT_NECESSARY" | "RELATED_BUT_IRRELEVANT" | "EXPLICIT_RESTATEMENT" | "WRONG_SCOPE";
}
export interface StaV4ScenarioAuthority {
  readonly scenarioId: string;
  readonly qlId: StaV4QlId;
  readonly checkpointId: StaV4CheckpointId;
  readonly sourceProfile: StaV4SourceProfile;
  readonly evidenceClass: "SOURCE_BACKED_SEMANTIC_SYNTHESIS" | "CONTROLLED_EXAM_SYNTHESIS";
  readonly officialVerbatim: false;
  readonly difficulty: StaV4Difficulty;
  readonly statementVariants: readonly [L, L, L];
  readonly candidates: readonly [CandidateAuthority, CandidateAuthority, CandidateAuthority, CandidateAuthority, CandidateAuthority];
}
const c = (id: string, implicit: boolean, a: L, b: L, rationale: L, misconception: CandidateAuthority["misconception"]): CandidateAuthority =>
  Object.freeze({ id, implicit, textVariants: [a, b], rationale, misconception });
const tx = (en: string, hi: string, pa: string): L => l(en, hi, pa);

function buildScenario(ctx: Context, qlId: StaV4QlId, contextIndex: number): StaV4ScenarioAuthority {
  const difficulty = STA_V4_DIFFICULTIES[contextIndex % STA_V4_DIFFICULTIES.length]!;
  const base = {
    scenarioId: `STA-V4-${qlId}-${ctx.id}`,
    qlId,
    checkpointId: STA_V4_CHECKPOINT_BY_QL[qlId],
    sourceProfile: ctx.sourceProfile,
    evidenceClass: (qlId === "STA-QL-005" || qlId === "STA-QL-006") ? "SOURCE_BACKED_SEMANTIC_SYNTHESIS" as const : "CONTROLLED_EXAM_SYNTHESIS" as const,
    officialVerbatim: false as const,
    difficulty,
  };

  if (qlId === "STA-QL-001") return { ...base,
    statementVariants: [
      tx(`Use ${ctx.channel.en} for ${ctx.task.en}.`, `${ctx.task.hi} के लिए ${ctx.channel.hi} का उपयोग करें।`, `${ctx.task.pa} ਲਈ ${ctx.channel.pa} ਵਰਤੋ।`),
      tx(`${ctx.actor.en} should route ${ctx.task.en} through ${ctx.channel.en}.`, `${ctx.actor.hi} को ${ctx.task.hi} ${ctx.channel.hi} के माध्यम से करना चाहिए।`, `${ctx.actor.pa} ਨੂੰ ${ctx.task.pa} ${ctx.channel.pa} ਰਾਹੀਂ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ।`),
      tx(`For timely ${ctx.task.en}, follow the route through ${ctx.channel.en}.`, `समय पर ${ctx.task.hi} के लिए ${ctx.channel.hi} वाला मार्ग अपनाएँ।`, `ਸਮੇਂ ਸਿਰ ${ctx.task.pa} ਲਈ ${ctx.channel.pa} ਵਾਲਾ ਰਾਹ ਅਪਣਾਓ।`),
    ],
    candidates: [
      c("SERVICE_SUPPORTS_TASK", true, tx(`${ctx.channel.en} supports ${ctx.task.en}.`, `${ctx.channel.hi} ${ctx.task.hi} के लिए कार्यशील है।`, `${ctx.channel.pa} ${ctx.task.pa} ਲਈ ਕਾਰਗਰ ਹੈ।`), tx(`${ctx.task.en} is supported through ${ctx.channel.en}.`, `${ctx.task.hi} की प्रक्रिया ${ctx.channel.hi} से समर्थित है।`, `${ctx.task.pa} ਦੀ ਕਾਰਵਾਈ ${ctx.channel.pa} ਰਾਹੀਂ ਸਮਰਥਿਤ ਹੈ।`), tx("The named route has to perform the task for the instruction to work.", "निर्देश के काम करने के लिए बताए गए माध्यम को वही कार्य करना आवश्यक है।", "ਹਦਾਇਤ ਦੇ ਕਾਰਗਰ ਹੋਣ ਲਈ ਦੱਸਿਆ ਮਾਧਿਅਮ ਉਹ ਕੰਮ ਕਰਦਾ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ।"), "REQUIRED_DEPENDENCY"),
      c("ACTOR_HAS_ACCESS", true, tx(`${ctx.channel.en} is accessible to the intended users.`, `${ctx.channel.hi} लक्षित उपयोगकर्ताओं के लिए उपलब्ध है।`, `${ctx.channel.pa} ਨਿਸ਼ਾਨਾ ਵਰਤੋਂਕਾਰਾਂ ਲਈ ਉਪਲਬਧ ਹੈ।`), tx(`The intended users have access to ${ctx.channel.en}.`, `लक्षित उपयोगकर्ताओं की ${ctx.channel.hi} तक पहुँच है।`, `ਨਿਸ਼ਾਨਾ ਵਰਤੋਂਕਾਰਾਂ ਦੀ ${ctx.channel.pa} ਤੱਕ ਪਹੁੰਚ ਹੈ।`), tx("The instructed group must be able to reach the named route.", "निर्देश पाने वाले समूह की बताए गए माध्यम तक पहुँच आवश्यक है।", "ਹਦਾਇਤ ਲੈਣ ਵਾਲੇ ਸਮੂਹ ਦੀ ਦੱਸੇ ਮਾਧਿਅਮ ਤੱਕ ਪਹੁੰਚ ਲਾਜ਼ਮੀ ਹੈ।"), "REQUIRED_DEPENDENCY"),
      c("ROUTE_CONVENIENT", false, tx(`${ctx.channel.en} is convenient for the intended users.`, `${ctx.channel.hi} लक्षित उपयोगकर्ताओं के लिए सुविधाजनक है।`, `${ctx.channel.pa} ਨਿਸ਼ਾਨਾ ਵਰਤੋਂਕਾਰਾਂ ਲਈ ਸੁਵਿਧਾਜਨਕ ਹੈ।`), tx(`The route through ${ctx.channel.en} feels easy to use.`, `${ctx.channel.hi} वाला तरीका उपयोग में सहज लगता है।`, `${ctx.channel.pa} ਵਾਲਾ ਤਰੀਕਾ ਵਰਤਣ ਵਿੱਚ ਸੁਖਾਲਾ ਲੱਗਦਾ ਹੈ।`), tx("Convenience supports adoption but is not required for feasibility.", "सुविधा अपनाने में मदद करती है, पर व्यवहार्यता की आवश्यकता नहीं।", "ਸੁਵਿਧਾ ਅਪਣਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰਦੀ ਹੈ, ਪਰ ਕਾਰਗਰਤਾ ਦੀ ਲੋੜ ਨਹੀਂ।"), "SUPPORTIVE_NOT_NECESSARY"),
      c("STAFF_FAMILIAR", false, tx(`Staff are familiar with ${ctx.channel.en}.`, `कर्मचारी ${ctx.channel.hi} से परिचित हैं।`, `ਕਰਮਚਾਰੀ ${ctx.channel.pa} ਨਾਲ ਜਾਣੂ ਹਨ।`), tx(`The service team is comfortable operating ${ctx.channel.en}.`, `सेवा दल ${ctx.channel.hi} चलाने में सहज है।`, `ਸੇਵਾ ਟੀਮ ${ctx.channel.pa} ਚਲਾਉਣ ਵਿੱਚ ਸੁਖੀ ਹੈ।`), tx("Staff familiarity is useful background, not a logical requirement of the instruction.", "कर्मचारियों की परिचितता उपयोगी पृष्ठभूमि है, तार्किक आवश्यकता नहीं।", "ਕਰਮਚਾਰੀਆਂ ਦੀ ਜਾਣ-ਪਛਾਣ ਲਾਭਦਾਇਕ ਪਿਛੋਕੜ ਹੈ, ਤਾਰਕਿਕ ਲੋੜ ਨਹੀਂ।"), "RELATED_BUT_IRRELEVANT"),
      c("TASK_RESTATED", false, tx(`The instruction concerns ${ctx.task.en}.`, `निर्देश ${ctx.task.hi} से संबंधित है।`, `ਹਦਾਇਤ ${ctx.task.pa} ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ।`), tx(`${ctx.task.en} is named in the instruction.`, `${ctx.task.hi} का निर्देश में उल्लेख है।`, `${ctx.task.pa} ਦਾ ਹਦਾਇਤ ਵਿੱਚ ਜ਼ਿਕਰ ਹੈ।`), tx("This is stated information rather than an unstated premise.", "यह कही हुई बात है, अप्रकट पूर्वधारणा नहीं।", "ਇਹ ਕਹੀ ਹੋਈ ਗੱਲ ਹੈ, ਲੁਕਵੀਂ ਧਾਰਨਾ ਨਹੀਂ।"), "EXPLICIT_RESTATEMENT"),
    ] };

  if (qlId === "STA-QL-002") return { ...base,
    statementVariants: [
      tx(`Introduce ${ctx.intervention.en} to address ${ctx.issue.en}.`, `${ctx.issue.hi} से निपटने के लिए ${ctx.intervention.hi} शुरू करें।`, `${ctx.issue.pa} ਨਾਲ ਨਜਿੱਠਣ ਲਈ ${ctx.intervention.pa} ਸ਼ੁਰੂ ਕਰੋ।`),
      tx(`${ctx.service.en} should adopt ${ctx.intervention.en} for ${ctx.outcome.en}.`, `${ctx.service.hi} को ${ctx.outcome.hi} के लिए ${ctx.intervention.hi} अपनाना चाहिए।`, `${ctx.service.pa} ਨੂੰ ${ctx.outcome.pa} ਲਈ ${ctx.intervention.pa} ਅਪਣਾਉਣਾ ਚਾਹੀਦਾ ਹੈ।`),
      tx(`The proposed response to ${ctx.issue.en} is ${ctx.intervention.en}.`, `${ctx.issue.hi} के लिए प्रस्तावित उपाय ${ctx.intervention.hi} है।`, `${ctx.issue.pa} ਲਈ ਪ੍ਰਸਤਾਵਿਤ ਕਦਮ ${ctx.intervention.pa} ਹੈ।`),
    ],
    candidates: [
      c("ISSUE_RELEVANT", true, tx(`${ctx.issue.en} requires attention in this setting.`, `इस व्यवस्था में ${ctx.issue.hi} पर ध्यान देना आवश्यक है।`, `ਇਸ ਪ੍ਰਬੰਧ ਵਿੱਚ ${ctx.issue.pa} ਵੱਲ ਧਿਆਨ ਦੇਣਾ ਲਾਜ਼ਮੀ ਹੈ।`), tx(`${ctx.issue.en} is relevant to the decision being made.`, `${ctx.issue.hi} इस निर्णय के लिए प्रासंगिक है।`, `${ctx.issue.pa} ਇਸ ਫੈਸਲੇ ਲਈ ਸਬੰਧਤ ਹੈ।`), tx("A recommendation aimed at an issue presupposes that the issue is relevant enough to address.", "समस्या पर लक्षित सुझाव उस समस्या की प्रासंगिकता मानकर चलता है।", "ਸਮੱਸਿਆ ਵੱਲ ਨਿਸ਼ਾਨਾ ਲਾਉਂਦੀ ਸਿਫ਼ਾਰਸ਼ ਉਸ ਸਮੱਸਿਆ ਦੀ ਸਬੰਧਤਾ ਮੰਨਦੀ ਹੈ।"), "REQUIRED_DEPENDENCY"),
      c("INTERVENTION_RELEVANT", true, tx(`${ctx.intervention.en} has a meaningful link to ${ctx.outcome.en}.`, `${ctx.intervention.hi} का ${ctx.outcome.hi} से सार्थक संबंध है।`, `${ctx.intervention.pa} ਦਾ ${ctx.outcome.pa} ਨਾਲ ਅਰਥਪੂਰਨ ਸੰਬੰਧ ਹੈ।`), tx(`${ctx.outcome.en} is responsive to the process changed by ${ctx.intervention.en}.`, `${ctx.outcome.hi} उस प्रक्रिया से प्रभावित होता है जिसे ${ctx.intervention.hi} बदलता है।`, `${ctx.outcome.pa} ਉਸ ਪ੍ਰਕਿਰਿਆ ਨਾਲ ਪ੍ਰਭਾਵਿਤ ਹੁੰਦਾ ਹੈ ਜਿਸਨੂੰ ${ctx.intervention.pa} ਬਦਲਦਾ ਹੈ।`), tx("The proposal needs an efficacy bridge between the action and intended result.", "प्रस्ताव के लिए कार्रवाई और अपेक्षित परिणाम के बीच प्रभाव की कड़ी आवश्यक है।", "ਪ੍ਰਸਤਾਵ ਲਈ ਕਦਮ ਅਤੇ ਉਮੀਦ ਕੀਤੇ ਨਤੀਜੇ ਵਿਚਕਾਰ ਪ੍ਰਭਾਵਕ ਕੜੀ ਲਾਜ਼ਮੀ ਹੈ।"), "REQUIRED_DEPENDENCY"),
      c("ECONOMICAL", false, tx(`${ctx.intervention.en} is economical to operate.`, `${ctx.intervention.hi} का संचालन किफायती है।`, `${ctx.intervention.pa} ਦਾ ਚਲਾਉਣਾ ਕਿਫ਼ਾਇਤੀ ਹੈ।`), tx(`The operating cost of ${ctx.intervention.en} is acceptable.`, `${ctx.intervention.hi} की संचालन लागत स्वीकार्य है।`, `${ctx.intervention.pa} ਦੀ ਚਲਾਉਣ ਲਾਗਤ ਕਬੂਲਯੋਗ ਹੈ।`), tx("Cost may matter operationally but is not a required premise of this recommendation.", "लागत संचालन में मायने रख सकती है, पर इस सुझाव की आवश्यक पूर्वधारणा नहीं।", "ਲਾਗਤ ਚਲਾਉਣ ਵਿੱਚ ਮਾਇਨੇ ਰੱਖ ਸਕਦੀ ਹੈ, ਪਰ ਇਸ ਸਿਫ਼ਾਰਸ਼ ਦੀ ਲਾਜ਼ਮੀ ਧਾਰਨਾ ਨਹੀਂ।"), "SUPPORTIVE_NOT_NECESSARY"),
      c("AUDIENCE_FAVOURS", false, tx(`${ctx.audience.en} view ${ctx.intervention.en} favourably.`, `${ctx.audience.hi} ${ctx.intervention.hi} को सकारात्मक रूप से देखते हैं।`, `${ctx.audience.pa} ${ctx.intervention.pa} ਨੂੰ ਚੰਗੇ ਤਰੀਕੇ ਨਾਲ ਵੇਖਦੇ ਹਨ।`), tx(`${ctx.intervention.en} is attractive to ${ctx.audience.en}.`, `${ctx.intervention.hi} ${ctx.audience.hi} को आकर्षक लगता है।`, `${ctx.intervention.pa} ${ctx.audience.pa} ਨੂੰ ਆਕਰਸ਼ਕ ਲੱਗਦਾ ਹੈ।`), tx("Audience preference could help adoption but is not the required reason for the proposal.", "लोगों की पसंद अपनाने में मदद कर सकती है, पर प्रस्ताव का आवश्यक आधार नहीं।", "ਲੋਕਾਂ ਦੀ ਪਸੰਦ ਅਪਣਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦੀ ਹੈ, ਪਰ ਪ੍ਰਸਤਾਵ ਦਾ ਲਾਜ਼ਮੀ ਆਧਾਰ ਨਹੀਂ।"), "RELATED_BUT_IRRELEVANT"),
      c("TEAM_FAMILIAR", false, tx(`The service team is familiar with ${ctx.intervention.en}.`, `सेवा दल ${ctx.intervention.hi} से परिचित है।`, `ਸੇਵਾ ਟੀਮ ${ctx.intervention.pa} ਨਾਲ ਜਾਣੂ ਹੈ।`), tx(`${ctx.intervention.en} fits the team's existing routine.`, `${ctx.intervention.hi} दल की मौजूदा दिनचर्या से मेल खाता है।`, `${ctx.intervention.pa} ਟੀਮ ਦੀ ਮੌਜੂਦਾ ਰੁਟੀਨ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।`), tx("Operational familiarity is helpful background rather than a necessary premise.", "संचालन की परिचितता सहायक पृष्ठभूमि है, आवश्यक पूर्वधारणा नहीं।", "ਚਲਾਉਣ ਦੀ ਜਾਣ-ਪਛਾਣ ਸਹਾਇਕ ਪਿਛੋਕੜ ਹੈ, ਲਾਜ਼ਮੀ ਧਾਰਨਾ ਨਹੀਂ।"), "SUPPORTIVE_NOT_NECESSARY"),
    ] };

  if (qlId === "STA-QL-003") return { ...base,
    statementVariants: [
      tx(`Notice: ${ctx.task.en} will be handled through ${ctx.channel.en}.`, `सूचना: ${ctx.task.hi} अब ${ctx.channel.hi} के माध्यम से किया जाएगा।`, `ਸੂਚਨਾ: ${ctx.task.pa} ਹੁਣ ${ctx.channel.pa} ਰਾਹੀਂ ਕੀਤੀ ਜਾਵੇਗੀ।`),
      tx(`${ctx.service.en} directs users to use ${ctx.channel.en} for ${ctx.task.en}.`, `${ctx.service.hi} उपयोगकर्ताओं को ${ctx.task.hi} के लिए ${ctx.channel.hi} उपयोग करने का निर्देश देती है।`, `${ctx.service.pa} ਵਰਤੋਂਕਾਰਾਂ ਨੂੰ ${ctx.task.pa} ਲਈ ${ctx.channel.pa} ਵਰਤਣ ਦੀ ਹਦਾਇਤ ਦਿੰਦੀ ਹੈ।`),
      tx(`Under the revised service rule, ${ctx.task.en} is routed through ${ctx.channel.en}.`, `संशोधित सेवा नियम के तहत ${ctx.task.hi} ${ctx.channel.hi} से किया जाता है।`, `ਸੋਧੇ ਹੋਏ ਸੇਵਾ ਨਿਯਮ ਅਧੀਨ ${ctx.task.pa} ${ctx.channel.pa} ਰਾਹੀਂ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।`),
    ],
    candidates: [
      c("AUDIENCE_RELEVANT", true, tx(`The direction applies to people using ${ctx.service.en}.`, `निर्देश ${ctx.service.hi} का उपयोग करने वाले लोगों पर लागू है।`, `ਹਦਾਇਤ ${ctx.service.pa} ਵਰਤਣ ਵਾਲੇ ਲੋਕਾਂ ਉੱਤੇ ਲਾਗੂ ਹੈ।`), tx(`The service direction is relevant to its intended users.`, `सेवा निर्देश अपने लक्षित उपयोगकर्ताओं के लिए प्रासंगिक है।`, `ਸੇਵਾ ਹਦਾਇਤ ਆਪਣੇ ਨਿਸ਼ਾਨਾ ਵਰਤੋਂਕਾਰਾਂ ਲਈ ਸਬੰਧਤ ਹੈ।`), tx("A service direction presupposes a relevant audience to whom it applies.", "सेवा निर्देश उस संबंधित समूह को मानकर चलता है जिस पर वह लागू होता है।", "ਸੇਵਾ ਹਦਾਇਤ ਉਸ ਸੰਬੰਧਤ ਸਮੂਹ ਨੂੰ ਮੰਨਦੀ ਹੈ ਜਿਸ ਉੱਤੇ ਇਹ ਲਾਗੂ ਹੁੰਦੀ ਹੈ।"), "REQUIRED_DEPENDENCY"),
      c("CHANNEL_OPERATIONAL", true, tx(`${ctx.channel.en} is operational for ${ctx.task.en}.`, `${ctx.channel.hi} ${ctx.task.hi} के लिए कार्यशील है।`, `${ctx.channel.pa} ${ctx.task.pa} ਲਈ ਕਾਰਗਰ ਹੈ।`), tx(`${ctx.service.en} supports the directed process through ${ctx.channel.en}.`, `${ctx.service.hi} ${ctx.channel.hi} वाली निर्देशित प्रक्रिया का समर्थन करती है।`, `${ctx.service.pa} ${ctx.channel.pa} ਵਾਲੀ ਦੱਸੀ ਪ੍ਰਕਿਰਿਆ ਨੂੰ ਸਮਰਥਨ ਦਿੰਦੀ ਹੈ।`), tx("The directed route must function for the notice to be actionable.", "सूचना पर अमल के लिए निर्देशित माध्यम का कार्यशील होना आवश्यक है।", "ਸੂਚਨਾ ਉੱਤੇ ਅਮਲ ਲਈ ਦੱਸਿਆ ਮਾਧਿਅਮ ਕਾਰਗਰ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ।"), "REQUIRED_DEPENDENCY"),
      c("RULE_WELCOMED", false, tx(`Users view the revised route favourably.`, `उपयोगकर्ता संशोधित तरीके को सकारात्मक रूप से देखते हैं।`, `ਵਰਤੋਂਕਾਰ ਸੋਧੇ ਤਰੀਕੇ ਨੂੰ ਚੰਗੇ ਤਰੀਕੇ ਨਾਲ ਵੇਖਦੇ ਹਨ।`), tx(`The intended audience is comfortable with the revised rule.`, `लक्षित समूह संशोधित नियम से सहज है।`, `ਨਿਸ਼ਾਨਾ ਸਮੂਹ ਸੋਧੇ ਨਿਯਮ ਨਾਲ ਸੁਖੀ ਹੈ।`), tx("Approval of the rule is not required for the direction to apply.", "नियम की स्वीकृति निर्देश लागू होने की तार्किक आवश्यकता नहीं।", "ਨਿਯਮ ਦੀ ਪਸੰਦ ਹਦਾਇਤ ਲਾਗੂ ਹੋਣ ਦੀ ਤਾਰਕਿਕ ਲੋੜ ਨਹੀਂ।"), "SUPPORTIVE_NOT_NECESSARY"),
      c("WORKLOAD_EFFECT", false, tx(`The revised route is expected to reduce staff workload.`, `संशोधित तरीका कर्मचारियों का कार्यभार घटाने के लिए उपयोगी माना जाता है।`, `ਸੋਧਿਆ ਤਰੀਕਾ ਕਰਮਚਾਰੀਆਂ ਦਾ ਕੰਮ-ਭਾਰ ਘਟਾਉਣ ਲਈ ਲਾਭਦਾਇਕ ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ।`), tx(`Staff workload is connected with the revised route.`, `कर्मचारियों का कार्यभार संशोधित तरीके से जुड़ा है।`, `ਕਰਮਚਾਰੀਆਂ ਦਾ ਕੰਮ-ਭਾਰ ਸੋਧੇ ਤਰੀਕੇ ਨਾਲ ਜੁੜਿਆ ਹੈ।`), tx("A workload effect may be a consequence but is not needed for users to follow the notice.", "कार्यभार पर असर परिणाम हो सकता है, पर सूचना का पालन करने के लिए आवश्यक नहीं।", "ਕੰਮ-ਭਾਰ ਉੱਤੇ ਅਸਰ ਨਤੀਜਾ ਹੋ ਸਕਦਾ ਹੈ, ਪਰ ਸੂਚਨਾ ਮੰਨਣ ਲਈ ਲਾਜ਼ਮੀ ਨਹੀਂ।"), "RELATED_BUT_IRRELEVANT"),
      c("RULE_RESTATED", false, tx(`The notice changes how ${ctx.task.en} is handled.`, `सूचना ${ctx.task.hi} की प्रक्रिया बदलती है।`, `ਸੂਚਨਾ ${ctx.task.pa} ਦੀ ਕਾਰਵਾਈ ਬਦਲਦੀ ਹੈ।`), tx(`${ctx.channel.en} is named in the revised direction.`, `संशोधित निर्देश में ${ctx.channel.hi} का उल्लेख है।`, `ਸੋਧੀ ਹਦਾਇਤ ਵਿੱਚ ${ctx.channel.pa} ਦਾ ਜ਼ਿਕਰ ਹੈ।`), tx("This is explicit in the notice rather than an unstated premise.", "यह सूचना में स्पष्ट है, अप्रकट पूर्वधारणा नहीं।", "ਇਹ ਸੂਚਨਾ ਵਿੱਚ ਸਪਸ਼ਟ ਹੈ, ਲੁਕਵੀਂ ਧਾਰਨਾ ਨਹੀਂ।"), "EXPLICIT_RESTATEMENT"),
    ] };

  if (qlId === "STA-QL-004") return { ...base,
    statementVariants: [
      tx(`After introducing ${ctx.intervention.en}, the service expects ${ctx.outcome.en}.`, `${ctx.intervention.hi} शुरू करने के बाद सेवा ${ctx.outcome.hi} की उम्मीद करती है।`, `${ctx.intervention.pa} ਸ਼ੁਰੂ ਕਰਨ ਤੋਂ ਬਾਅਦ ਸੇਵਾ ${ctx.outcome.pa} ਦੀ ਉਮੀਦ ਕਰਦੀ ਹੈ।`),
      tx(`${ctx.intervention.en} is projected to lead to ${ctx.outcome.en}.`, `${ctx.intervention.hi} से ${ctx.outcome.hi} का अनुमान लगाया गया है।`, `${ctx.intervention.pa} ਨਾਲ ${ctx.outcome.pa} ਦਾ ਅਨੁਮਾਨ ਲਾਇਆ ਗਿਆ ਹੈ।`),
      tx(`The service links ${ctx.intervention.en} with ${ctx.outcome.en}.`, `सेवा ${ctx.intervention.hi} को ${ctx.outcome.hi} से जोड़ती है।`, `ਸੇਵਾ ${ctx.intervention.pa} ਨੂੰ ${ctx.outcome.pa} ਨਾਲ ਜੋੜਦੀ ਹੈ।`),
    ],
    candidates: [
      c("CAUSAL_BRIDGE", true, tx(`${ctx.intervention.en} has a causal connection with ${ctx.outcome.en}.`, `${ctx.intervention.hi} का ${ctx.outcome.hi} से कारणात्मक संबंध है।`, `${ctx.intervention.pa} ਦਾ ${ctx.outcome.pa} ਨਾਲ ਕਾਰਣਕ ਸੰਬੰਧ ਹੈ।`), tx(`${ctx.outcome.en} is responsive to the process changed by ${ctx.intervention.en}.`, `${ctx.outcome.hi} उस प्रक्रिया से प्रभावित होता है जिसे ${ctx.intervention.hi} बदलता है।`, `${ctx.outcome.pa} ਉਸ ਪ੍ਰਕਿਰਿਆ ਨਾਲ ਪ੍ਰਭਾਵਿਤ ਹੁੰਦਾ ਹੈ ਜਿਸਨੂੰ ${ctx.intervention.pa} ਬਦਲਦਾ ਹੈ।`), tx("Without a causal or efficacy bridge, the prediction loses its basis.", "कारण या प्रभाव की कड़ी न हो तो अनुमान का आधार टूट जाता है।", "ਕਾਰਣ ਜਾਂ ਪ੍ਰਭਾਵਕ ਕੜੀ ਨਾ ਹੋਵੇ ਤਾਂ ਅਨੁਮਾਨ ਦਾ ਆਧਾਰ ਟੁੱਟ ਜਾਂਦਾ ਹੈ।"), "REQUIRED_DEPENDENCY"),
      c("OUTCOME_RELEVANT", true, tx(`${ctx.outcome.en} reflects the process targeted by ${ctx.intervention.en}.`, `${ctx.outcome.hi} उस प्रक्रिया को दर्शाता है जिस पर ${ctx.intervention.hi} काम करता है।`, `${ctx.outcome.pa} ਉਸ ਪ੍ਰਕਿਰਿਆ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ ਜਿਸ ਉੱਤੇ ${ctx.intervention.pa} ਕੰਮ ਕਰਦਾ ਹੈ।`), tx(`The predicted result is relevant to the operational change.`, `अनुमानित परिणाम संचालन बदलाव से प्रासंगिक है।`, `ਅਨੁਮਾਨਿਤ ਨਤੀਜਾ ਚਲਾਉਣ ਵਾਲੇ ਬਦਲਾਅ ਨਾਲ ਸਬੰਧਤ ਹੈ।`), tx("The predicted result has to be relevant to the mechanism being changed.", "अनुमानित परिणाम का बदली जा रही प्रक्रिया से प्रासंगिक होना आवश्यक है।", "ਅਨੁਮਾਨਿਤ ਨਤੀਜੇ ਦਾ ਬਦਲੀ ਜਾ ਰਹੀ ਪ੍ਰਕਿਰਿਆ ਨਾਲ ਸਬੰਧਤ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ।"), "REQUIRED_DEPENDENCY"),
      c("STAFF_SUPPORT", false, tx(`The operating staff view ${ctx.intervention.en} favourably.`, `संचालन कर्मचारी ${ctx.intervention.hi} को सकारात्मक रूप से देखते हैं।`, `ਚਲਾਉਣ ਵਾਲਾ ਸਟਾਫ ${ctx.intervention.pa} ਨੂੰ ਚੰਗੇ ਤਰੀਕੇ ਨਾਲ ਵੇਖਦਾ ਹੈ।`), tx(`${ctx.intervention.en} fits staff preferences.`, `${ctx.intervention.hi} कर्मचारियों की पसंद से मेल खाता है।`, `${ctx.intervention.pa} ਕਰਮਚਾਰੀਆਂ ਦੀ ਪਸੰਦ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।`), tx("Staff preference is not necessary for the causal prediction.", "कर्मचारियों की पसंद कारणात्मक अनुमान के लिए आवश्यक नहीं।", "ਕਰਮਚਾਰੀਆਂ ਦੀ ਪਸੰਦ ਕਾਰਣਕ ਅਨੁਮਾਨ ਲਈ ਲਾਜ਼ਮੀ ਨਹੀਂ।"), "RELATED_BUT_IRRELEVANT"),
      c("PRIOR_TREND", false, tx(`${ctx.outcome.en} showed a favourable trend before the change.`, `बदलाव से पहले ${ctx.outcome.hi} में सकारात्मक रुझान था।`, `ਬਦਲਾਅ ਤੋਂ ਪਹਿਲਾਂ ${ctx.outcome.pa} ਵਿੱਚ ਚੰਗਾ ਰੁਝਾਨ ਸੀ।`), tx(`Earlier observations were favourable for ${ctx.outcome.en}.`, `${ctx.outcome.hi} के पुराने अवलोकन सकारात्मक थे।`, `${ctx.outcome.pa} ਬਾਰੇ ਪੁਰਾਣੇ ਨਿਰੀਖਣ ਚੰਗੇ ਸਨ।`), tx("A previous trend is possible background but is not required by the causal claim.", "पुराना रुझान पृष्ठभूमि हो सकता है, पर कारणात्मक दावे की आवश्यकता नहीं।", "ਪੁਰਾਣਾ ਰੁਝਾਨ ਪਿਛੋਕੜ ਹੋ ਸਕਦਾ ਹੈ, ਪਰ ਕਾਰਣਕ ਦਾਅਵੇ ਦੀ ਲੋੜ ਨਹੀਂ।"), "SUPPORTIVE_NOT_NECESSARY"),
      c("MAINTENANCE_EASY", false, tx(`${ctx.intervention.en} is easy for the service team to maintain.`, `${ctx.intervention.hi} सेवा दल के लिए बनाए रखना सहज है।`, `${ctx.intervention.pa} ਸੇਵਾ ਟੀਮ ਲਈ ਸੰਭਾਲਣਾ ਸੁਖਾਲਾ ਹੈ।`), tx(`Maintaining ${ctx.intervention.en} fits the service routine.`, `${ctx.intervention.hi} का रख-रखाव सेवा की दिनचर्या से मेल खाता है।`, `${ctx.intervention.pa} ਦੀ ਦੇਖਭਾਲ ਸੇਵਾ ਦੀ ਰੁਟੀਨ ਨਾਲ ਮੇਲ ਖਾਂਦੀ ਹੈ।`), tx("Maintainability affects implementation, not the logical bridge asserted by the prediction.", "रख-रखाव लागू करने पर असर डाल सकता है, अनुमान की तार्किक कड़ी पर नहीं।", "ਦੇਖਭਾਲ ਲਾਗੂ ਕਰਨ ਉੱਤੇ ਅਸਰ ਪਾ ਸਕਦੀ ਹੈ, ਅਨੁਮਾਨ ਦੀ ਤਾਰਕਿਕ ਕੜੀ ਉੱਤੇ ਨਹੀਂ।"), "RELATED_BUT_IRRELEVANT"),
    ] };

  if (qlId === "STA-QL-005") return { ...base,
    statementVariants: [
      tx(`Message to ${ctx.audience.en}: choose ${ctx.service.en} for ${ctx.benefit.en}.`, `${ctx.audience.hi} के लिए संदेश: ${ctx.benefit.hi} के लिए ${ctx.service.hi} चुनें।`, `${ctx.audience.pa} ਲਈ ਸੁਨੇਹਾ: ${ctx.benefit.pa} ਲਈ ${ctx.service.pa} ਚੁਣੋ।`),
      tx(`${ctx.service.en} is promoted to ${ctx.audience.en} by highlighting ${ctx.benefit.en}.`, `${ctx.service.hi} को ${ctx.audience.hi} के सामने ${ctx.benefit.hi} बताकर प्रचारित किया गया है।`, `${ctx.service.pa} ਨੂੰ ${ctx.audience.pa} ਅੱਗੇ ${ctx.benefit.pa} ਦਰਸਾ ਕੇ ਪ੍ਰਚਾਰਿਆ ਗਿਆ ਹੈ।`),
      tx(`An appeal asks ${ctx.audience.en} to use ${ctx.channel.en} for ${ctx.benefit.en}.`, `एक अपील ${ctx.audience.hi} से ${ctx.benefit.hi} के लिए ${ctx.channel.hi} उपयोग करने को कहती है।`, `ਇੱਕ ਅਪੀਲ ${ctx.audience.pa} ਨੂੰ ${ctx.benefit.pa} ਲਈ ${ctx.channel.pa} ਵਰਤਣ ਲਈ ਕਹਿੰਦੀ ਹੈ।`),
    ],
    candidates: [
      c("AUDIENCE_VALUES_BENEFIT", true, tx(`${ctx.benefit.en} is relevant to the intended audience.`, `${ctx.benefit.hi} लक्षित समूह के लिए प्रासंगिक है।`, `${ctx.benefit.pa} ਨਿਸ਼ਾਨਾ ਸਮੂਹ ਲਈ ਸਬੰਧਤ ਹੈ।`), tx(`The highlighted benefit matters to the audience being addressed.`, `दिखाया गया लाभ संबोधित समूह के लिए मायने रखता है।`, `ਦੱਸਿਆ ਲਾਭ ਸੰਬੋਧਿਤ ਸਮੂਹ ਲਈ ਮਾਇਨੇ ਰੱਖਦਾ ਹੈ।`), tx("A persuasive message needs its highlighted benefit to matter to a relevant audience.", "प्रचार संदेश के लिए दिखाया गया लाभ संबंधित समूह के लिए मायने रखना आवश्यक है।", "ਪ੍ਰਚਾਰਕ ਸੁਨੇਹੇ ਲਈ ਦੱਸਿਆ ਲਾਭ ਸੰਬੰਧਤ ਸਮੂਹ ਲਈ ਮਾਇਨੇ ਰੱਖਣਾ ਲਾਜ਼ਮੀ ਹੈ।"), "REQUIRED_DEPENDENCY"),
      c("RESPONSE_LINK", true, tx(`${ctx.channel.en} is a relevant response route for ${ctx.service.en}.`, `${ctx.channel.hi} ${ctx.service.hi} के लिए उपयुक्त प्रतिक्रिया माध्यम है।`, `${ctx.channel.pa} ${ctx.service.pa} ਲਈ ਢੁੱਕਵਾਂ ਪ੍ਰਤੀਕਿਰਿਆ ਮਾਧਿਅਮ ਹੈ।`), tx(`The promoted benefit is meaningfully connected with using ${ctx.service.en}.`, `प्रचारित लाभ ${ctx.service.hi} के उपयोग से सार्थक रूप से जुड़ा है।`, `ਪ੍ਰਚਾਰਿਤ ਲਾਭ ${ctx.service.pa} ਦੀ ਵਰਤੋਂ ਨਾਲ ਅਰਥਪੂਰਨ ਤਰੀਕੇ ਨਾਲ ਜੁੜਿਆ ਹੈ।`), tx("The requested response must connect meaningfully with the benefit being promoted.", "मांगी गई प्रतिक्रिया का प्रचारित लाभ से सार्थक संबंध आवश्यक है।", "ਮੰਗੀ ਪ੍ਰਤੀਕਿਰਿਆ ਦਾ ਪ੍ਰਚਾਰਿਤ ਲਾਭ ਨਾਲ ਅਰਥਪੂਰਨ ਸੰਬੰਧ ਲਾਜ਼ਮੀ ਹੈ।"), "REQUIRED_DEPENDENCY"),
      c("MESSAGE_MEMORABLE", false, tx(`The message is memorable to ${ctx.audience.en}.`, `संदेश ${ctx.audience.hi} को याद रहने वाला लगता है।`, `ਸੁਨੇਹਾ ${ctx.audience.pa} ਨੂੰ ਯਾਦ ਰਹਿਣ ਵਾਲਾ ਲੱਗਦਾ ਹੈ।`), tx(`The wording of the promotion is engaging.`, `प्रचार की भाषा आकर्षक है।`, `ਪ੍ਰਚਾਰ ਦੀ ਭਾਸ਼ਾ ਦਿਲਚਸਪ ਹੈ।`), tx("Memorability may improve persuasion but is not a required hidden premise.", "याद रहना प्रचार में मदद कर सकता है, पर आवश्यक अप्रकट पूर्वधारणा नहीं।", "ਯਾਦ ਰਹਿਣਾ ਪ੍ਰਚਾਰ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹੈ, ਪਰ ਲਾਜ਼ਮੀ ਲੁਕਵੀਂ ਧਾਰਨਾ ਨਹੀਂ।"), "SUPPORTIVE_NOT_NECESSARY"),
      c("ALTERNATIVE_SERVICES", false, tx(`Alternative services offer a related benefit.`, `वैकल्पिक सेवाएँ संबंधित लाभ देती हैं।`, `ਵਿਕਲਪੀ ਸੇਵਾਵਾਂ ਸਬੰਧਤ ਲਾਭ ਦਿੰਦੀਆਂ ਹਨ।`), tx(`The promoted service operates alongside competing alternatives.`, `प्रचारित सेवा प्रतिस्पर्धी विकल्पों के साथ चलती है।`, `ਪ੍ਰਚਾਰਿਤ ਸੇਵਾ ਮੁਕਾਬਲੇ ਵਾਲੇ ਵਿਕਲਪਾਂ ਨਾਲ ਚੱਲਦੀ ਹੈ।`), tx("Competitor conditions are not required for this message to seek a response.", "प्रतिक्रिया मांगने के लिए प्रतिस्पर्धी स्थिति आवश्यक नहीं।", "ਪ੍ਰਤੀਕਿਰਿਆ ਮੰਗਣ ਲਈ ਮੁਕਾਬਲੇ ਦੀ ਸਥਿਤੀ ਲਾਜ਼ਮੀ ਨਹੀਂ।"), "RELATED_BUT_IRRELEVANT"),
      c("CAMPAIGN_TIMING", false, tx(`The campaign timing is convenient for the service team.`, `अभियान का समय सेवा दल के लिए सुविधाजनक है।`, `ਮੁਹਿੰਮ ਦਾ ਸਮਾਂ ਸੇਵਾ ਟੀਮ ਲਈ ਸੁਵਿਧਾਜਨਕ ਹੈ।`), tx(`The promotion fits the team's operating schedule.`, `प्रचार दल की संचालन समय-सारणी से मेल खाता है।`, `ਪ੍ਰਚਾਰ ਟੀਮ ਦੇ ਚਲਾਉਣ ਸਮੇਂ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।`), tx("Internal timing is not a necessary audience-response assumption.", "आंतरिक समय-सारणी दर्शक-प्रतिक्रिया की आवश्यक पूर्वधारणा नहीं।", "ਅੰਦਰੂਨੀ ਸਮਾਂ-ਸਾਰਣੀ ਦਰਸ਼ਕ-ਪ੍ਰਤੀਕਿਰਿਆ ਦੀ ਲਾਜ਼ਮੀ ਧਾਰਨਾ ਨਹੀਂ।"), "WRONG_SCOPE"),
    ] };

  return { ...base,
    statementVariants: [
      tx(`A report ranks ${ctx.compareA.en} ahead of ${ctx.compareB.en} using ${ctx.metric.en}.`, `एक रिपोर्ट ${ctx.metric.hi} के आधार पर ${ctx.compareA.hi} को ${ctx.compareB.hi} से आगे बताती है।`, `ਇੱਕ ਰਿਪੋਰਟ ${ctx.metric.pa} ਦੇ ਆਧਾਰ ਤੇ ${ctx.compareA.pa} ਨੂੰ ${ctx.compareB.pa} ਤੋਂ ਅੱਗੇ ਦੱਸਦੀ ਹੈ।`),
      tx(`Among ${ctx.evidenceGroup.en}, ${ctx.compareA.en} performed better than ${ctx.compareB.en} on ${ctx.metric.en}.`, `${ctx.evidenceGroup.hi} में ${ctx.metric.hi} पर ${ctx.compareA.hi} का प्रदर्शन ${ctx.compareB.hi} से बेहतर रहा।`, `${ctx.evidenceGroup.pa} ਵਿੱਚ ${ctx.metric.pa} ਉੱਤੇ ${ctx.compareA.pa} ਦਾ ਪ੍ਰਦਰਸ਼ਨ ${ctx.compareB.pa} ਤੋਂ ਚੰਗਾ ਰਿਹਾ।`),
      tx(`The evidence uses ${ctx.metric.en} to compare ${ctx.compareA.en} with ${ctx.compareB.en}.`, `प्रमाण ${ctx.compareA.hi} और ${ctx.compareB.hi} की तुलना के लिए ${ctx.metric.hi} का उपयोग करता है।`, `ਸਬੂਤ ${ctx.compareA.pa} ਅਤੇ ${ctx.compareB.pa} ਦੀ ਤੁਲਨਾ ਲਈ ${ctx.metric.pa} ਵਰਤਦਾ ਹੈ।`),
    ],
    candidates: [
      c("METRIC_RELEVANT", true, tx(`${ctx.metric.en} is relevant to the property being compared.`, `${ctx.metric.hi} तुलना किए जा रहे गुण के लिए प्रासंगिक है।`, `${ctx.metric.pa} ਤੁਲਨਾ ਕੀਤੀ ਜਾ ਰਹੀ ਵਿਸ਼ੇਸ਼ਤਾ ਲਈ ਸਬੰਧਤ ਹੈ।`), tx(`The comparison claim is meaningfully represented by ${ctx.metric.en}.`, `तुलना का दावा ${ctx.metric.hi} से सार्थक रूप से व्यक्त होता है।`, `ਤੁਲਨਾ ਦਾ ਦਾਅਵਾ ${ctx.metric.pa} ਨਾਲ ਅਰਥਪੂਰਨ ਤਰੀਕੇ ਨਾਲ ਦਰਸਾਇਆ ਜਾਂਦਾ ਹੈ।`), tx("The chosen measure has to represent what the comparison claims to judge.", "चुना गया माप उसी गुण का प्रतिनिधित्व करना आवश्यक है जिसका दावा किया गया है।", "ਚੁਣਿਆ ਮਾਪ ਉਸੇ ਵਿਸ਼ੇਸ਼ਤਾ ਨੂੰ ਦਰਸਾਉਣਾ ਲਾਜ਼ਮੀ ਹੈ ਜਿਸਦਾ ਦਾਅਵਾ ਕੀਤਾ ਗਿਆ ਹੈ।"), "REQUIRED_DEPENDENCY"),
      c("COMPARABLE_BASIS", true, tx(`${ctx.compareA.en} and ${ctx.compareB.en} are measured on a comparable basis.`, `${ctx.compareA.hi} और ${ctx.compareB.hi} को तुलनीय आधार पर मापा गया है।`, `${ctx.compareA.pa} ਅਤੇ ${ctx.compareB.pa} ਨੂੰ ਤੁਲਨਾਯੋਗ ਆਧਾਰ ਤੇ ਮਾਪਿਆ ਗਿਆ ਹੈ।`), tx(`The measurement meaning is consistent across the compared groups.`, `तुलना किए गए समूहों में माप का अर्थ एकसमान है।`, `ਤੁਲਨਾ ਕੀਤੇ ਸਮੂਹਾਂ ਵਿੱਚ ਮਾਪ ਦਾ ਅਰਥ ਇਕਸਾਰ ਹੈ।`), tx("A comparison loses validity if its sides are not measured on a meaningfully comparable basis.", "यदि दोनों पक्ष तुलनीय आधार पर न मापे जाएँ तो तुलना की वैधता टूट जाती है।", "ਜੇ ਦੋਵੇਂ ਪਾਸੇ ਤੁਲਨਾਯੋਗ ਆਧਾਰ ਤੇ ਨਾ ਮਾਪੇ ਜਾਣ ਤਾਂ ਤੁਲਨਾ ਦੀ ਵੈਧਤਾ ਟੁੱਟ ਜਾਂਦੀ ਹੈ।"), "REQUIRED_DEPENDENCY"),
      c("USER_AWARENESS", false, tx(`Service users are aware of the measured difference.`, `सेवा उपयोगकर्ता मापे गए अंतर से परिचित हैं।`, `ਸੇਵਾ ਵਰਤੋਂਕਾਰ ਮਾਪੇ ਗਏ ਫ਼ਰਕ ਨਾਲ ਜਾਣੂ ਹਨ।`), tx(`The reported difference is noticeable to users.`, `रिपोर्ट किया गया अंतर उपयोगकर्ताओं को दिखाई देता है।`, `ਰਿਪੋਰਟ ਕੀਤਾ ਫ਼ਰਕ ਵਰਤੋਂਕਾਰਾਂ ਨੂੰ ਦਿਖਾਈ ਦਿੰਦਾ ਹੈ।`), tx("User awareness is not required for the comparison itself to be valid.", "तुलना की वैधता के लिए उपयोगकर्ताओं की जानकारी आवश्यक नहीं।", "ਤੁਲਨਾ ਦੀ ਵੈਧਤਾ ਲਈ ਵਰਤੋਂਕਾਰਾਂ ਦੀ ਜਾਣਕਾਰੀ ਲਾਜ਼ਮੀ ਨਹੀਂ।"), "RELATED_BUT_IRRELEVANT"),
      c("ANALYST_EXPECTATION", false, tx(`The analysts expected this ranking before examining the data.`, `विश्लेषकों को डेटा देखने से पहले इसी क्रम की अपेक्षा थी।`, `ਵਿਸ਼ਲੇਸ਼ਕਾਂ ਨੂੰ ਡਾਟਾ ਵੇਖਣ ਤੋਂ ਪਹਿਲਾਂ ਇਸੇ ਕ੍ਰਮ ਦੀ ਉਮੀਦ ਸੀ।`), tx(`The reported result matches the analysts' prior view.`, `रिपोर्ट किया गया परिणाम विश्लेषकों की पहले की राय से मेल खाता है।`, `ਰਿਪੋਰਟ ਕੀਤਾ ਨਤੀਜਾ ਵਿਸ਼ਲੇਸ਼ਕਾਂ ਦੀ ਪਹਿਲਾਂ ਵਾਲੀ ਰਾਏ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।`), tx("Analyst expectation does not determine whether the evidence supports the comparison.", "विश्लेषकों की अपेक्षा यह तय नहीं करती कि प्रमाण तुलना का समर्थन करता है या नहीं।", "ਵਿਸ਼ਲੇਸ਼ਕਾਂ ਦੀ ਉਮੀਦ ਇਹ ਤੈਅ ਨਹੀਂ ਕਰਦੀ ਕਿ ਸਬੂਤ ਤੁਲਨਾ ਨੂੰ ਸਮਰਥਨ ਦਿੰਦਾ ਹੈ ਜਾਂ ਨਹੀਂ।"), "RELATED_BUT_IRRELEVANT"),
      c("COLLECTION_CONVENIENT", false, tx(`Collecting the data fit the operating schedule.`, `डेटा संग्रह संचालन समय-सारणी के अनुकूल था।`, `ਡਾਟਾ ਇਕੱਠਾ ਕਰਨਾ ਚਲਾਉਣ ਸਮਾਂ-ਸਾਰਣੀ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਸੀ।`), tx(`The evidence was convenient for the team to gather.`, `प्रमाण जुटाना दल के लिए सुविधाजनक था।`, `ਸਬੂਤ ਇਕੱਠਾ ਕਰਨਾ ਟੀਮ ਲਈ ਸੁਵਿਧਾਜਨਕ ਸੀ।`), tx("Collection convenience is not a validity requirement for the stated comparison.", "संग्रह की सुविधा कथित तुलना की वैधता की आवश्यकता नहीं।", "ਇਕੱਠਾ ਕਰਨ ਦੀ ਸੁਵਿਧਾ ਦੱਸੀ ਤੁਲਨਾ ਦੀ ਵੈਧਤਾ ਦੀ ਲੋੜ ਨਹੀਂ।"), "WRONG_SCOPE"),
    ] };
}

export const STA_V4_SCENARIOS: readonly StaV4ScenarioAuthority[] = Object.freeze(
  STA_V4_QL_IDS.flatMap((qlId) => CONTEXTS.map((ctx, index) => buildScenario(ctx, qlId, index))),
);
export const STA_V4_SCENARIOS_BY_QL: Readonly<Record<StaV4QlId, readonly StaV4ScenarioAuthority[]>> = Object.freeze(
  Object.fromEntries(STA_V4_QL_IDS.map((qlId) => [qlId, STA_V4_SCENARIOS.filter((scenario) => scenario.qlId === qlId)])) as Record<StaV4QlId, readonly StaV4ScenarioAuthority[]>,
);

const PROFILE_META: Readonly<Record<StaV4ProfileId, Readonly<{ candidateCount: 2 | 3 | 4 | 5; optionCount: 4 | 5; negative: boolean; evidenceClass: string }>>> = Object.freeze({
  SSC_2X4: { candidateCount: 2, optionCount: 4, negative: false, evidenceClass: "DIRECT_PYQ_FORMAT" },
  SSC_3X4: { candidateCount: 3, optionCount: 4, negative: false, evidenceClass: "DIRECT_PYQ_FORMAT" },
  BANK_2X5: { candidateCount: 2, optionCount: 5, negative: false, evidenceClass: "LEGACY_OR_FAMILY_COMPATIBLE" },
  BANK_3X5: { candidateCount: 3, optionCount: 5, negative: false, evidenceClass: "MEMORY_BASED_PYQ_FORMAT" },
  BANK_4X5: { candidateCount: 4, optionCount: 5, negative: false, evidenceClass: "MEMORY_BASED_PYQ_FORMAT" },
  BANK_3X5_NEGATIVE: { candidateCount: 3, optionCount: 5, negative: true, evidenceClass: "LEGACY_OR_FAMILY_COMPATIBLE" },
  BANK_5X5: { candidateCount: 5, optionCount: 5, negative: false, evidenceClass: "MEMORY_BASED_PYQ_FORMAT" },
  PUNJAB_2X4: { candidateCount: 2, optionCount: 4, negative: false, evidenceClass: "DIRECT_PYQ_FORMAT" },
  PUNJAB_3X4: { candidateCount: 3, optionCount: 4, negative: false, evidenceClass: "CROSS_EXAM_SYNTHESIS" },
});
export const STA_V4_PRESENTATION_PROFILES = Object.freeze(STA_V4_PROFILE_IDS.map((profileId) => Object.freeze({
  profileId, ...PROFILE_META[profileId], officialVerbatim: false as const, directPunjabPyqBacked: profileId === "PUNJAB_2X4",
})));

function hash32(input: string): number {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) { hash ^= input.charCodeAt(index); hash = Math.imul(hash, 16777619) >>> 0; }
  return hash >>> 0;
}
function choose<T>(values: readonly T[], seed: string): T {
  if (!values.length) throw new Error(`${seed}: empty choice pool`);
  return values[hash32(seed) % values.length]!;
}
function shuffle<T>(values: readonly T[], seed: string): T[] {
  const out = [...values];
  let state = hash32(seed) || 0x9e3779b9;
  const next = () => { state ^= state << 13; state ^= state >>> 17; state ^= state << 5; return (state >>> 0) / 0x1_0000_0000; };
  for (let index = out.length - 1; index > 0; index -= 1) {
    const j = Math.floor(next() * (index + 1));
    const temp = out[index]!; out[index] = out[j]!; out[j] = temp;
  }
  return out;
}
function languageFromLocale(locale: StaV4Locale): StaV4Language { return locale === "hi-IN" ? "hi" : locale === "pa-IN" ? "pa" : "en"; }
function localize(value: L, language: StaV4Language): string { return value[language]; }
function roman(index: number): string { return ["I", "II", "III", "IV", "V"][index] ?? String(index + 1); }
function setKey(set: readonly number[]): string { return [...set].sort((a, b) => a - b).join(","); }
function allSubsets(count: number): number[][] {
  const output: number[][] = [];
  for (let mask = 0; mask < (1 << count); mask += 1) {
    const set: number[] = []; for (let bit = 0; bit < count; bit += 1) if (mask & (1 << bit)) set.push(bit); output.push(set);
  }
  return output;
}
function hamming(a: readonly number[], b: readonly number[], count: number): number {
  const as = new Set(a), bs = new Set(b); let score = 0;
  for (let index = 0; index < count; index += 1) if (as.has(index) !== bs.has(index)) score += 1;
  return score;
}
function answerText(set: readonly number[], count: number, language: StaV4Language): string {
  const labels = set.map(roman); const conjunction = language === "hi" ? " और " : language === "pa" ? " ਅਤੇ " : " and ";
  if (set.length === 0) return language === "hi" ? "इनमें से कोई नहीं" : language === "pa" ? "ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕੋਈ ਨਹੀਂ" : "None of these";
  if (set.length === count) return language === "hi" ? "सभी पूर्वधारणाएँ" : language === "pa" ? "ਸਾਰੀਆਂ ਧਾਰਨਾਵਾਂ" : "All assumptions";
  const joined = labels.join(conjunction);
  return language === "hi" ? `केवल ${joined}` : language === "pa" ? `ਕੇਵਲ ${joined}` : `Only ${joined}`;
}
function exclusiveEitherText(language: StaV4Language): string {
  return language === "hi" ? "या तो I या II" : language === "pa" ? "ਜਾਂ I ਜਾਂ II" : "Either I or II";
}
function instruction(language: StaV4Language, negative: boolean): string {
  if (negative) return language === "hi" ? "दिए गए कथन के आधार पर बताइए कि कौन-सी पूर्वधारणाएँ निहित नहीं हैं।" : language === "pa" ? "ਦਿੱਤੇ ਕਥਨ ਦੇ ਆਧਾਰ ਤੇ ਦੱਸੋ ਕਿ ਕਿਹੜੀਆਂ ਧਾਰਨਾਵਾਂ ਨਿਹਿਤ ਨਹੀਂ ਹਨ।" : "Decide which of the following assumptions are not implicit in the statement.";
  return language === "hi" ? "दिए गए कथन के आधार पर बताइए कि कौन-सी पूर्वधारणाएँ निहित हैं।" : language === "pa" ? "ਦਿੱਤੇ ਕਥਨ ਦੇ ਆਧਾਰ ਤੇ ਦੱਸੋ ਕਿ ਕਿਹੜੀਆਂ ਧਾਰਨਾਵਾਂ ਨਿਹਿਤ ਹਨ।" : "Decide which of the following assumptions are implicit in the statement.";
}

export interface StaV4RenderedCandidate { readonly label: string; readonly candidateId: string; readonly text: string; readonly classification: "IMPLICIT" | "NOT_IMPLICIT"; readonly misconception: CandidateAuthority["misconception"]; }
export interface StaV4Option { readonly display: string; readonly semanticAnswerSet: readonly number[]; readonly isCorrect: boolean; readonly kind: "SEMANTIC_SET" | "EXCLUSIVE_EITHER_LEGACY"; }
export interface StaV4Question {
  readonly packageId: "STA-001"; readonly chapterId: "REAS-STA"; readonly runtimeVersion: "STA-001-EXAM-REALNESS-V4";
  readonly qlId: StaV4QlId; readonly checkpointId: StaV4CheckpointId; readonly presentationProfile: StaV4ProfileId; readonly scenarioId: string;
  readonly canonicalItemId: string; readonly contentFingerprint: string; readonly questionId: string; readonly questionLanguageId: string;
  readonly seed: string; readonly language: StaV4Language; readonly locale: StaV4Locale; readonly difficulty: StaV4Difficulty; readonly sourceProfile: StaV4SourceProfile;
  readonly evidenceClass: string; readonly instruction: string; readonly statement: string; readonly candidates: readonly StaV4RenderedCandidate[]; readonly candidateCount: number;
  readonly options: readonly StaV4Option[]; readonly optionCount: number; readonly answerIndex: number; readonly answerSet: readonly number[]; readonly queryPolarity: "IMPLICIT" | "NOT_IMPLICIT";
  readonly explanation: string; readonly oracleParity: true;
}

function explanationFor(selected: readonly CandidateAuthority[], language: StaV4Language, negative: boolean, answerDisplay: string): string {
  const intro = language === "hi" ? "कथन को चलाने वाली आवश्यक कड़ी देखें; केवल संभव या सहायक बात को पूर्वधारणा न मानें।" : language === "pa" ? "ਕਥਨ ਨੂੰ ਚਲਾਉਣ ਵਾਲੀ ਲਾਜ਼ਮੀ ਕੜੀ ਵੇਖੋ; ਸਿਰਫ਼ ਸੰਭਵ ਜਾਂ ਸਹਾਇਕ ਗੱਲ ਨੂੰ ਧਾਰਨਾ ਨਾ ਮੰਨੋ।" : "Test the dependency the statement actually needs; a plausible or supportive fact is not enough.";
  const lines = selected.map((candidate, index) => {
    const implicit = candidate.implicit; const label = roman(index);
    return language === "hi" ? `${label}: ${implicit ? "निहित" : "निहित नहीं"} — ${localize(candidate.rationale, language)}` : language === "pa" ? `${label}: ${implicit ? "ਨਿਹਿਤ" : "ਨਿਹਿਤ ਨਹੀਂ"} — ${localize(candidate.rationale, language)}` : `${label}: ${implicit ? "implicit" : "not implicit"} — ${localize(candidate.rationale, language)}`;
  });
  const finish = language === "hi" ? `${negative ? "निहित नहीं वाली" : "निहित"} पूर्वधारणाओं के अनुसार सही विकल्प: ${answerDisplay}।` : language === "pa" ? `${negative ? "ਨਿਹਿਤ ਨਾ ਹੋਣ ਵਾਲੀਆਂ" : "ਨਿਹਿਤ"} ਧਾਰਨਾਵਾਂ ਅਨੁਸਾਰ ਸਹੀ ਚੋਣ: ${answerDisplay}।` : `Therefore the correct coded choice is ${answerDisplay}.`;
  return [intro, ...lines, finish].join("\n");
}

export function generateStaV4Question(input: Readonly<{ seed: string; locale: StaV4Locale; profileId: StaV4ProfileId; qlId?: StaV4QlId }>): StaV4Question {
  const language = languageFromLocale(input.locale);
  const qlId = input.qlId ?? choose(STA_V4_QL_IDS, `${input.seed}:ql`);
  const scenario = choose(STA_V4_SCENARIOS_BY_QL[qlId], `${input.seed}:${qlId}:scenario`);
  const profile = PROFILE_META[input.profileId];
  const statement = localize(choose(scenario.statementVariants, `${input.seed}:${scenario.scenarioId}:statement`), language);
  const selected = shuffle(scenario.candidates, `${input.seed}:${scenario.scenarioId}:candidate-order`).slice(0, profile.candidateCount);
  const candidates = selected.map((candidate, index) => ({
    label: roman(index), candidateId: candidate.id,
    text: localize(choose(candidate.textVariants, `${input.seed}:${scenario.scenarioId}:${candidate.id}:phrasing`), language),
    classification: candidate.implicit ? "IMPLICIT" as const : "NOT_IMPLICIT" as const, misconception: candidate.misconception,
  }));
  const answerSet = candidates.flatMap((candidate, index) => {
    const correct = profile.negative ? candidate.classification === "NOT_IMPLICIT" : candidate.classification === "IMPLICIT"; return correct ? [index] : [];
  });
  const alternatives = allSubsets(profile.candidateCount).filter((set) => setKey(set) !== setKey(answerSet)).sort((a, b) => hamming(a, answerSet, profile.candidateCount) - hamming(b, answerSet, profile.candidateCount) || setKey(a).localeCompare(setKey(b)));
  const semanticDistractorCount = input.profileId === "BANK_2X5" ? 3 : profile.optionCount - 1;
  const distractorSets = shuffle(alternatives.slice(0, Math.max(8, profile.optionCount * 3)), `${input.seed}:option-distractors`).slice(0, semanticDistractorCount);
  const rawOptions: StaV4Option[] = [
    { display: answerText(answerSet, profile.candidateCount, language), semanticAnswerSet: [...answerSet], isCorrect: true, kind: "SEMANTIC_SET" },
    ...distractorSets.map((set) => ({ display: answerText(set, profile.candidateCount, language), semanticAnswerSet: [...set], isCorrect: false, kind: "SEMANTIC_SET" as const })),
  ];
  if (input.profileId === "BANK_2X5") rawOptions.push({ display: exclusiveEitherText(language), semanticAnswerSet: [-1], isCorrect: false, kind: "EXCLUSIVE_EITHER_LEGACY" });
  const options = shuffle(rawOptions, `${input.seed}:option-order`);
  const answerIndex = options.findIndex((option) => option.isCorrect);
  if (answerIndex < 0) throw new Error(`${input.seed}: missing correct option`);
  const semanticKey = [qlId, input.profileId, scenario.scenarioId, profile.negative ? "NEG" : "POS", ...selected.map((candidate) => candidate.id), setKey(answerSet)].join("|");
  const fingerprint = hash32(semanticKey).toString(16).padStart(8, "0");
  const canonicalItemId = `STA-V4:${fingerprint}`;
  const question: StaV4Question = {
    packageId: "STA-001", chapterId: "REAS-STA", runtimeVersion: "STA-001-EXAM-REALNESS-V4", qlId, checkpointId: scenario.checkpointId, presentationProfile: input.profileId,
    scenarioId: scenario.scenarioId, canonicalItemId, contentFingerprint: fingerprint, questionId: `${canonicalItemId}:${language}`, questionLanguageId: `${canonicalItemId}:${language}`,
    seed: input.seed, language, locale: input.locale, difficulty: scenario.difficulty, sourceProfile: scenario.sourceProfile, evidenceClass: `${scenario.evidenceClass}/${profile.evidenceClass}`,
    instruction: instruction(language, profile.negative), statement, candidates, candidateCount: profile.candidateCount, options, optionCount: profile.optionCount, answerIndex, answerSet,
    queryPolarity: profile.negative ? "NOT_IMPLICIT" : "IMPLICIT", explanation: explanationFor(selected, language, profile.negative, options[answerIndex]!.display), oracleParity: true,
  };
  assertStaV4QuestionIntegrity(question);
  return question;
}

export const STA_V4_CUE_PATTERNS: Readonly<Record<StaV4Language, readonly RegExp[]>> = Object.freeze({
  en: [/\ball\b/iu, /\bevery\b/iu, /\bnever\b/iu, /\balways\b/iu, /\bonly\b/iu, /\bbest\b/iu, /\bmost\b/iu, /\bcan\b/iu, /\bmay\b/iu, /\bsome\b/iu, /\bat least\b/iu, /\bnone\b/iu, /\bunable\b/iu, /\bimpossible\b/iu],
  hi: [/\bसभी\b/u, /\bहर\b/u, /कभी नहीं/u, /\bहमेशा\b/u, /\bकेवल\b/u, /\bसबसे\b/u, /\bकुछ\b/u, /कोई नहीं/u, /\bअसंभव\b/u],
  pa: [/\bਸਾਰੇ\b/u, /\bਹਰ\b/u, /ਕਦੇ ਨਹੀਂ/u, /\bਹਮੇਸ਼ਾ\b/u, /\bਕੇਵਲ\b/u, /\bਸਭ ਤੋਂ\b/u, /\bਕੁਝ\b/u, /ਕੋਈ ਨਹੀਂ/u, /\bਅਸੰਭਵ\b/u],
});
export function staV4CueSignalCount(text: string, language: StaV4Language): number {
  return STA_V4_CUE_PATTERNS[language].reduce((count, pattern) => count + (pattern.test(text) ? 1 : 0), 0);
}
export function assertStaV4QuestionIntegrity(question: StaV4Question): void {
  if (!STA_V4_QL_IDS.includes(question.qlId)) throw new Error(`${question.questionId}: unknown QL`);
  if (!STA_V4_PROFILE_IDS.includes(question.presentationProfile)) throw new Error(`${question.questionId}: unknown profile`);
  if (question.candidates.length !== question.candidateCount) throw new Error(`${question.questionId}: candidate count drift`);
  if (question.options.length !== question.optionCount) throw new Error(`${question.questionId}: option count drift`);
  if (new Set(question.options.map((option) => option.display)).size !== question.options.length) throw new Error(`${question.questionId}: duplicate option display`);
  if (question.options.filter((option) => option.isCorrect).length !== 1) throw new Error(`${question.questionId}: non-unique correct option`);
  if (!question.options[question.answerIndex]?.isCorrect) throw new Error(`${question.questionId}: answer index drift`);
  if (setKey(question.options[question.answerIndex]!.semanticAnswerSet) !== setKey(question.answerSet)) throw new Error(`${question.questionId}: answer-set drift`);
  if (!question.statement.trim() || !question.explanation.trim()) throw new Error(`${question.questionId}: empty learner surface`);
}
