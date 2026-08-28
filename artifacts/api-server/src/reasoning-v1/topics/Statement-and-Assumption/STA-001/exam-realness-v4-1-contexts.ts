import type { StaV4Difficulty, StaV4LocalizedText, StaV4SourceProfile } from "./exam-realness-v4-1-types.ts";

export interface StaV41Context {
  readonly id: string;
  readonly sourceProfile: StaV4SourceProfile;
  readonly difficulty: StaV4Difficulty;
  readonly domain: string;
  readonly actor: StaV4LocalizedText;
  readonly task: StaV4LocalizedText;
  readonly channel: StaV4LocalizedText;
  readonly issue: StaV4LocalizedText;
  readonly intervention: StaV4LocalizedText;
  readonly outcome: StaV4LocalizedText;
  readonly audience: StaV4LocalizedText;
  readonly metric: StaV4LocalizedText;
}

export const lt = (en: string, hi: string, pa: string): StaV4LocalizedText => Object.freeze({ en, hi, pa });

function ctx(
  id: string,
  sourceProfile: StaV4SourceProfile,
  difficulty: StaV4Difficulty,
  domain: string,
  actor: StaV4LocalizedText,
  task: StaV4LocalizedText,
  channel: StaV4LocalizedText,
  issue: StaV4LocalizedText,
  intervention: StaV4LocalizedText,
  outcome: StaV4LocalizedText,
  audience: StaV4LocalizedText,
  metric: StaV4LocalizedText,
): StaV41Context {
  return Object.freeze({ id, sourceProfile, difficulty, domain, actor, task, channel, issue, intervention, outcome, audience, metric });
}

export const STA_V41_CONTEXTS: readonly StaV41Context[] = Object.freeze([
  ctx("EXAM-ENTRY", "SSC", "Easy", "EXAM_ADMINISTRATION",
    lt("exam candidates", "परीक्षा अभ्यर्थी", "ਪਰੀਖਿਆ ਉਮੀਦਵਾਰ"),
    lt("entry verification", "प्रवेश सत्यापन", "ਦਾਖਲਾ ਤਸਦੀਕ"),
    lt("the QR verification desk", "क्यूआर सत्यापन डेस्क", "ਕਿਊਆਰ ਤਸਦੀਕ ਡੈਸਕ"),
    lt("entry-queue congestion", "लंबी प्रवेश कतारें", "ਲੰਬੀਆਂ ਦਾਖਲਾ ਕਤਾਰਾਂ"),
    lt("an additional verification desk", "एक अतिरिक्त सत्यापन डेस्क", "ਇੱਕ ਵਾਧੂ ਤਸਦੀਕ ਡੈਸਕ"),
    lt("shorter entry time", "कम प्रवेश समय", "ਘੱਟ ਦਾਖਲਾ ਸਮਾਂ"),
    lt("morning-shift candidates", "सुबह की पाली के अभ्यर्थी", "ਸਵੇਰ ਦੀ ਪਾਲੀ ਦੇ ਉਮੀਦਵਾਰ"),
    lt("average verification time", "औसत सत्यापन समय", "ਔਸਤ ਤਸਦੀਕ ਸਮਾਂ")),

  ctx("BANK-ROUTINE", "BANKING", "Medium", "BANKING_SERVICE",
    lt("branch customers", "शाखा ग्राहक", "ਸ਼ਾਖਾ ਗਾਹਕ"),
    lt("a routine service request", "नियमित सेवा अनुरोध", "ਰੋਜ਼ਾਨਾ ਸੇਵਾ ਬੇਨਤੀਆਂ"),
    lt("the mobile banking app", "मोबाइल बैंकिंग ऐप", "ਮੋਬਾਈਲ ਬੈਂਕਿੰਗ ਐਪ"),
    lt("repeated counter visiting", "बार-बार काउंटर पर जाना", "ਵਾਰ-ਵਾਰ ਕਾਊਂਟਰ ਦੌਰੇ"),
    lt("a guided digital-help desk", "मार्गदर्शित डिजिटल सहायता डेस्क", "ਮਾਰਗਦਰਸ਼ਿਤ ਡਿਜ਼ਿਟਲ ਮਦਦ ਡੈਸਕ"),
    lt("a reduction in repeat visits", "कम दोबारा विज़िट", "ਘੱਟ ਦੁਬਾਰਾ ਦੌਰੇ"),
    lt("customers seeking routine services", "नियमित सेवाएं लेने वाले ग्राहक", "ਰੋਜ਼ਾਨਾ ਸੇਵਾਵਾਂ ਲੈਣ ਵਾਲੇ ਗਾਹਕ"),
    lt("average completion time", "औसत पूर्णता समय", "ਔਸਤ ਪੂਰਾ ਹੋਣ ਦਾ ਸਮਾਂ")),

  ctx("DISTRICT-CERTIFICATE", "PUNJAB_STATE", "Easy", "PUBLIC_CERTIFICATE",
    lt("certificate applicants", "प्रमाण-पत्र आवेदक", "ਸਰਟੀਫਿਕੇਟ ਅਰਜ਼ੀਦਾਰ"),
    lt("a certificate application", "प्रमाण-पत्र आवेदन", "ਸਰਟੀਫਿਕੇਟ ਅਰਜ਼ੀਆਂ"),
    lt("the district online portal", "जिला ऑनलाइन पोर्टल", "ਜ਼ਿਲ੍ਹਾ ਆਨਲਾਈਨ ਪੋਰਟਲ"),
    lt("incomplete application filing", "अधूरे आवेदन", "ਅਧੂਰੀਆਂ ਅਰਜ਼ੀਆਂ"),
    lt("a pre-submission checklist", "जमा करने से पहले की चेकलिस्ट", "ਜਮ੍ਹਾਂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਦੀ ਚੈੱਕਲਿਸਟ"),
    lt("a reduction in incomplete submissions", "कम अधूरे आवेदन", "ਘੱਟ ਅਧੂਰੀਆਂ ਅਰਜ਼ੀਆਂ"),
    lt("district service applicants", "जिला सेवा आवेदक", "ਜ਼ਿਲ੍ਹਾ ਸੇਵਾ ਅਰਜ਼ੀਦਾਰ"),
    lt("application completion rate", "आवेदन पूर्णता दर", "ਅਰਜ਼ੀ ਪੂਰਨਤਾ ਦਰ")),

  ctx("HR-LEAVE", "CROSS_EXAM_DISCOVERY", "Medium", "WORKPLACE_HR",
    lt("employees", "कर्मचारी", "ਕਰਮਚਾਰੀ"),
    lt("a leave request", "अवकाश अनुरोध", "ਛੁੱਟੀ ਬੇਨਤੀਆਂ"),
    lt("the HR portal", "एचआर पोर्टल", "ਐਚਆਰ ਪੋਰਟਲ"),
    lt("processing delay", "प्रक्रिया में देरी", "ਕਾਰਵਾਈ ਵਿੱਚ ਦੇਰੀ"),
    lt("automated document screening", "स्वचालित दस्तावेज़ जांच", "ਆਟੋਮੈਟਿਕ ਦਸਤਾਵੇਜ਼ ਜਾਂਚ"),
    lt("faster request processing", "तेज़ अनुरोध प्रक्रिया", "ਤੇਜ਼ ਬੇਨਤੀ ਕਾਰਵਾਈ"),
    lt("employees submitting leave requests", "अवकाश अनुरोध देने वाले कर्मचारी", "ਛੁੱਟੀ ਬੇਨਤੀਆਂ ਦੇਣ ਵਾਲੇ ਕਰਮਚਾਰੀ"),
    lt("median processing time", "मध्यिका प्रक्रिया समय", "ਮੱਧਿਕ ਕਾਰਵਾਈ ਸਮਾਂ")),

  ctx("HOSPITAL-APPOINTMENT", "CROSS_EXAM_DISCOVERY", "Hard", "HEALTH_APPOINTMENT",
    lt("outpatients", "बाह्य रोगी", "ਬਾਹਰੀ ਮਰੀਜ਼"),
    lt("a clinic appointment", "क्लिनिक अपॉइंटमेंट", "ਕਲੀਨਿਕ ਮੁਲਾਕਾਤਾਂ"),
    lt("the appointment helpline", "अपॉइंटमेंट हेल्पलाइन", "ਮੁਲਾਕਾਤ ਹੈਲਪਲਾਈਨ"),
    lt("missed-appointment incidence", "छूटे हुए अपॉइंटमेंट स्लॉट", "ਖੁੰਝੇ ਹੋਏ ਮੁਲਾਕਾਤ ਸਲਾਟ"),
    lt("a reminder-call system", "रिमाइंडर कॉल प्रणाली", "ਯਾਦ-ਦਿਹਾਨੀ ਕਾਲ ਪ੍ਰਣਾਲੀ"),
    lt("a reduction in missed appointments", "कम छूटे अपॉइंटमेंट", "ਘੱਟ ਖੁੰਝੀਆਂ ਮੁਲਾਕਾਤਾਂ"),
    lt("patients with booked appointments", "बुक किए अपॉइंटमेंट वाले रोगी", "ਬੁੱਕ ਕੀਤੀਆਂ ਮੁਲਾਕਾਤਾਂ ਵਾਲੇ ਮਰੀਜ਼"),
    lt("appointment attendance rate", "अपॉइंटमेंट उपस्थिति दर", "ਮੁਲਾਕਾਤ ਹਾਜ਼ਰੀ ਦਰ")),

  ctx("RAILWAY-ENQUIRY", "SSC", "Medium", "RAILWAY_SERVICE",
    lt("rail passengers", "रेल यात्री", "ਰੇਲ ਯਾਤਰੀ"),
    lt("a platform enquiry", "प्लेटफॉर्म संबंधी पूछताछ", "ਪਲੇਟਫਾਰਮ ਪੁੱਛਗਿੱਛ"),
    lt("the station information kiosk", "स्टेशन सूचना कियोस्क", "ਸਟੇਸ਼ਨ ਜਾਣਕਾਰੀ ਕਿਓਸਕ"),
    lt("crowding at the enquiry counter", "पूछताछ काउंटर पर भीड़", "ਪੁੱਛਗਿੱਛ ਕਾਊਂਟਰ ਉੱਤੇ ਭੀੜ"),
    lt("an additional self-service kiosk network", "अतिरिक्त स्व-सेवा कियोस्क", "ਵਾਧੂ ਸਵੈ-ਸੇਵਾ ਕਿਓਸਕ"),
    lt("lower enquiry-counter load", "पूछताछ काउंटर पर कम भार", "ਪੁੱਛਗਿੱਛ ਕਾਊਂਟਰ ਉੱਤੇ ਘੱਟ ਭਾਰ"),
    lt("passengers seeking platform information", "प्लेटफॉर्म सूचना चाहने वाले यात्री", "ਪਲੇਟਫਾਰਮ ਜਾਣਕਾਰੀ ਲੱਭਣ ਵਾਲੇ ਯਾਤਰੀ"),
    lt("average enquiry waiting time", "औसत पूछताछ प्रतीक्षा समय", "ਔਸਤ ਪੁੱਛਗਿੱਛ ਉਡੀਕ ਸਮਾਂ")),

  ctx("SCHOLARSHIP-FORM", "PUNJAB_STATE", "Hard", "EDUCATION_BENEFIT",
    lt("scholarship applicants", "छात्रवृत्ति आवेदक", "ਵਜ਼ੀਫ਼ਾ ਅਰਜ਼ੀਦਾਰ"),
    lt("a scholarship submission", "छात्रवृत्ति आवेदन जमा करना", "ਵਜ਼ੀਫ਼ਾ ਅਰਜ਼ੀਆਂ ਜਮ੍ਹਾਂ ਕਰਨਾ"),
    lt("the scholarship portal", "छात्रवृत्ति पोर्टल", "ਵਜ਼ੀਫ਼ਾ ਪੋਰਟਲ"),
    lt("rejection due to missing documents", "गुम दस्तावेज़ों से होने वाली अस्वीकृति", "ਗੁੰਮ ਦਸਤਾਵੇਜ਼ਾਂ ਕਾਰਨ ਰੱਦ ਹੋਣ ਵਾਲੀਆਂ ਅਰਜ਼ੀਆਂ"),
    lt("a document-preview screen", "दस्तावेज़ पूर्वावलोकन स्क्रीन", "ਦਸਤਾਵੇਜ਼ ਝਲਕ ਸਕ੍ਰੀਨ"),
    lt("a reduction in document-related rejections", "कम दस्तावेज़-संबंधी अस्वीकृतियां", "ਘੱਟ ਦਸਤਾਵੇਜ਼-ਸਬੰਧੀ ਰੱਦਗੀਆਂ"),
    lt("eligible students", "पात्र विद्यार्थी", "ਯੋਗ ਵਿਦਿਆਰਥੀ"),
    lt("valid-submission rate", "वैध आवेदन दर", "ਵੈਧ ਜਮ੍ਹਾਂ ਦਰ")),

  ctx("LOAN-VERIFICATION", "BANKING", "Hard", "LOAN_PROCESSING",
    lt("loan applicants", "ऋण आवेदक", "ਕਰਜ਼ ਅਰਜ਼ੀਦਾਰ"),
    lt("document verification", "दस्तावेज़ सत्यापन", "ਦਸਤਾਵੇਜ਼ ਤਸਦੀਕ"),
    lt("the secure upload portal", "सुरक्षित अपलोड पोर्टल", "ਸੁਰੱਖਿਅਤ ਅੱਪਲੋਡ ਪੋਰਟਲ"),
    lt("verification backlog", "सत्यापन लंबित कार्य", "ਤਸਦੀਕ ਬਕਾਇਆ ਕੰਮ"),
    lt("structured document tagging", "संरचित दस्तावेज़ टैगिंग", "ਸੰਰਚਿਤ ਦਸਤਾਵੇਜ਼ ਟੈਗਿੰਗ"),
    lt("faster verification", "तेज़ सत्यापन", "ਤੇਜ਼ ਤਸਦੀਕ"),
    lt("applicants submitting loan documents", "ऋण दस्तावेज़ जमा करने वाले आवेदक", "ਕਰਜ਼ ਦਸਤਾਵੇਜ਼ ਜਮ੍ਹਾਂ ਕਰਨ ਵਾਲੇ ਅਰਜ਼ੀਦਾਰ"),
    lt("verification turnaround time", "सत्यापन पूरा होने का समय", "ਤਸਦੀਕ ਪੂਰੀ ਹੋਣ ਦਾ ਸਮਾਂ")),

  ctx("WATER-COMPLAINT", "PUNJAB_STATE", "Medium", "MUNICIPAL_SERVICE",
    lt("residents", "निवासी", "ਨਿਵਾਸੀ"),
    lt("a water-supply complaint", "जल-आपूर्ति शिकायतें", "ਪਾਣੀ ਸਪਲਾਈ ਸ਼ਿਕਾਇਤਾਂ"),
    lt("the municipal complaint line", "नगर शिकायत लाइन", "ਨਗਰ ਸ਼ਿਕਾਇਤ ਲਾਈਨ"),
    lt("complaint-tracking failure", "बिना ट्रैकिंग वाली शिकायतें", "ਬਿਨਾਂ ਟ੍ਰੈਕਿੰਗ ਵਾਲੀਆਂ ਸ਼ਿਕਾਇਤਾਂ"),
    lt("an automatic complaint-ticket system", "स्वचालित शिकायत टिकट नंबर", "ਆਟੋਮੈਟਿਕ ਸ਼ਿਕਾਇਤ ਟਿਕਟ ਨੰਬਰ"),
    lt("better complaint tracking", "बेहतर शिकायत ट्रैकिंग", "ਬਿਹਤਰ ਸ਼ਿਕਾਇਤ ਟ੍ਰੈਕਿੰਗ"),
    lt("households reporting supply problems", "आपूर्ति समस्या बताने वाले परिवार", "ਸਪਲਾਈ ਸਮੱਸਿਆ ਦਰਜ ਕਰਵਾਉਣ ਵਾਲੇ ਘਰ"),
    lt("resolved-complaint rate", "निस्तारित शिकायत दर", "ਨਿਪਟਾਈ ਸ਼ਿਕਾਇਤ ਦਰ")),

  ctx("WAREHOUSE-DISPATCH", "CROSS_EXAM_DISCOVERY", "Hard", "LOGISTICS",
    lt("dispatch staff", "प्रेषण कर्मचारी", "ਡਿਸਪੈਚ ਕਰਮਚਾਰੀ"),
    lt("shipment dispatch", "माल प्रेषण", "ਮਾਲ ਡਿਸਪੈਚ"),
    lt("the barcode dispatch console", "बारकोड प्रेषण कंसोल", "ਬਾਰਕੋਡ ਡਿਸਪੈਚ ਕਨਸੋਲ"),
    lt("package misrouting", "गलत मार्ग पर भेजे पैकेज", "ਗਲਤ ਰੂਟ ਭੇਜੇ ਪੈਕੇਜ"),
    lt("route-code validation", "रूट-कोड सत्यापन", "ਰੂਟ-ਕੋਡ ਤਸਦੀਕ"),
    lt("a reduction in routing errors", "कम रूटिंग त्रुटियां", "ਘੱਟ ਰੂਟਿੰਗ ਗਲਤੀਆਂ"),
    lt("warehouse dispatch teams", "गोदाम प्रेषण दल", "ਗੋਦਾਮ ਡਿਸਪੈਚ ਟੀਮਾਂ"),
    lt("routing-error rate", "रूटिंग त्रुटि दर", "ਰੂਟਿੰਗ ਗਲਤੀ ਦਰ")),

  ctx("SCHOOL-ATTENDANCE", "SSC", "Easy", "SCHOOL_ADMINISTRATION",
    lt("teachers", "शिक्षक", "ਅਧਿਆਪਕ"),
    lt("daily attendance recording", "दैनिक उपस्थिति दर्ज करना", "ਰੋਜ਼ਾਨਾ ਹਾਜ਼ਰੀ ਦਰਜ ਕਰਨਾ"),
    lt("the attendance tablet", "उपस्थिति टैबलेट", "ਹਾਜ਼ਰੀ ਟੈਬਲੈਟ"),
    lt("delay in attendance compilation", "उपस्थिति संकलन में देरी", "ਹਾਜ਼ਰੀ ਇਕੱਠੀ ਕਰਨ ਵਿੱਚ ਦੇਰੀ"),
    lt("classroom attendance syncing", "कक्षा उपस्थिति सिंकिंग", "ਕਲਾਸ ਹਾਜ਼ਰੀ ਸਿੰਕਿੰਗ"),
    lt("faster attendance compilation", "तेज़ उपस्थिति संकलन", "ਤੇਜ਼ ਹਾਜ਼ਰੀ ਇਕੱਠ"),
    lt("school teaching staff", "विद्यालय शिक्षक", "ਸਕੂਲ ਅਧਿਆਪਕ"),
    lt("attendance compilation time", "उपस्थिति संकलन समय", "ਹਾਜ਼ਰੀ ਇਕੱਠ ਸਮਾਂ")),

  ctx("FRAUD-ALERT", "BANKING", "Medium", "DIGITAL_PAYMENTS",
    lt("cardholders", "कार्डधारक", "ਕਾਰਡਧਾਰਕ"),
    lt("suspicious-transaction reporting", "संदिग्ध लेन-देन रिपोर्ट करना", "ਸ਼ੱਕੀ ਲੈਣ-ਦੇਣ ਰਿਪੋਰਟ ਕਰਨਾ"),
    lt("the bank fraud-alert channel", "बैंक धोखाधड़ी अलर्ट चैनल", "ਬੈਂਕ ਧੋਖਾਧੜੀ ਅਲਰਟ ਚੈਨਲ"),
    lt("delay in fraud reporting", "धोखाधड़ी रिपोर्ट में देरी", "ਧੋਖਾਧੜੀ ਰਿਪੋਰਟਾਂ ਵਿੱਚ ਦੇਰੀ"),
    lt("one-tap fraud reporting", "एक-टैप धोखाधड़ी रिपोर्टिंग", "ਇੱਕ-ਟੈਪ ਧੋਖਾਧੜੀ ਰਿਪੋਰਟਿੰਗ"),
    lt("earlier fraud reporting", "जल्दी धोखाधड़ी रिपोर्ट", "ਜਲਦੀ ਧੋਖਾਧੜੀ ਰਿਪੋਰਟ"),
    lt("digital-payment customers", "डिजिटल भुगतान ग्राहक", "ਡਿਜ਼ਿਟਲ ਭੁਗਤਾਨ ਗਾਹਕ"),
    lt("median reporting delay", "मध्यिका रिपोर्टिंग देरी", "ਮੱਧਿਕ ਰਿਪੋਰਟਿੰਗ ਦੇਰੀ")),

  ctx("LIBRARY-MEMBERSHIP", "CROSS_EXAM_DISCOVERY", "Easy", "LIBRARY_SERVICE",
    lt("library users", "पुस्तकालय उपयोगकर्ता", "ਲਾਇਬ੍ਰੇਰੀ ਵਰਤੋਂਕਾਰ"),
    lt("membership renewal", "सदस्यता नवीनीकरण", "ਮੈਂਬਰਸ਼ਿਪ ਨਵੀਨੀਕਰਨ"),
    lt("the library web portal", "पुस्तकालय वेब पोर्टਲ", "ਲਾਇਬ੍ਰੇਰੀ ਵੈੱਬ ਪੋਰਟਲ"),
    lt("renewal-counter congestion", "नवीनीकरण काउंटर पर भीड़", "ਨਵੀਨੀਕਰਨ ਕਾਊਂਟਰ ਭੀੜ"),
    lt("online renewal confirmation", "ऑनलाइन नवीनीकरण पुष्टि", "ਆਨਲਾਈਨ ਨਵੀਨੀਕਰਨ ਪੁਸ਼ਟੀ"),
    lt("lower counter congestion", "काउंटर पर कम भीड़", "ਕਾਊਂਟਰ ਉੱਤੇ ਘੱਟ ਭੀੜ"),
    lt("members due for renewal", "नवीनीकरण वाले सदस्य", "ਨਵੀਨੀਕਰਨ ਵਾਲੇ ਮੈਂਬਰ"),
    lt("average renewal time", "औसत नवीनीकरण समय", "ਔਸਤ ਨਵੀਨੀਕਰਨ ਸਮਾਂ")),

  ctx("FARM-SUBSIDY", "PUNJAB_STATE", "Hard", "AGRICULTURE_SERVICE",
    lt("farmers", "किसान", "ਕਿਸਾਨ"),
    lt("a subsidy claim", "सब्सिडी दावे", "ਸਬਸਿਡੀ ਦਾਅਵੇ"),
    lt("the agriculture service portal", "कृषि सेवा पोर्टल", "ਖੇਤੀਬਾੜੀ ਸੇਵਾ ਪੋਰਟਲ"),
    lt("claim-status uncertainty", "दावे की स्थिति को लेकर अनिश्चितता", "ਦਾਅਵੇ ਦੀ ਸਥਿਤੀ ਬਾਰੇ ਅਣਿਸ਼ਚਿਤਤਾ"),
    lt("a stage-wise status-message system", "चरणवार स्थिति संदेश", "ਪੜਾਅ-ਵਾਰ ਸਥਿਤੀ ਸੁਨੇਹੇ"),
    lt("clearer claim tracking", "स्पष्ट दावा ट्रैकिंग", "ਵਧੇਰੇ ਸਪਸ਼ਟ ਦਾਅਵਾ ਟ੍ਰੈਕਿੰਗ"),
    lt("farmers with submitted claims", "जमा दावों वाले किसान", "ਜਮ੍ਹਾਂ ਦਾਅਵਿਆਂ ਵਾਲੇ ਕਿਸਾਨ"),
    lt("status-enquiry volume", "स्थिति पूछताछ की संख्या", "ਸਥਿਤੀ ਪੁੱਛਗਿੱਛ ਦੀ ਗਿਣਤੀ")),

  ctx("RECRUITMENT-INTERVIEW", "SSC", "Hard", "RECRUITMENT",
    lt("job applicants", "नौकरी आवेदक", "ਨੌਕਰੀ ਅਰਜ਼ੀਦਾਰ"),
    lt("interview scheduling", "साक्षात्कार समय निर्धारण", "ਇੰਟਰਵਿਊ ਸਮਾਂ ਨਿਰਧਾਰਨ"),
    lt("the recruitment scheduling portal", "भर्ती समय-निर्धारण पोर्टल", "ਭਰਤੀ ਸਮਾਂ-ਨਿਰਧਾਰਨ ਪੋਰਟਲ"),
    lt("unused interview-slot capacity", "खाली रह जाने वाले साक्षात्कार स्लॉट", "ਖਾਲੀ ਰਹਿ ਜਾਣ ਵਾਲੇ ਇੰਟਰਵਿਊ ਸਲਾਟ"),
    lt("self-service slot rescheduling", "स्व-सेवा स्लॉट पुनर्निर्धारण", "ਸਵੈ-ਸੇਵਾ ਸਲਾਟ ਮੁੜ-ਨਿਰਧਾਰਨ"),
    lt("better slot utilisation", "बेहतर स्लॉट उपयोग", "ਬਿਹਤਰ ਸਲਾਟ ਵਰਤੋਂ"),
    lt("shortlisted applicants", "चयनित आवेदक", "ਸ਼ਾਰਟਲਿਸਟ ਅਰਜ਼ੀਦਾਰ"),
    lt("interview-slot utilisation", "साक्षात्कार स्लॉट उपयोग", "ਇੰਟਰਵਿਊ ਸਲਾਟ ਵਰਤੋਂ")),

  ctx("INSURANCE-CLAIM", "BANKING", "Easy", "INSURANCE_SERVICE",
    lt("policyholders", "पॉलिसीधारक", "ਪਾਲਿਸੀਧਾਰਕ"),
    lt("claim-document submission", "दावा दस्तावेज़ जमा करना", "ਦਾਅਵਾ ਦਸਤਾਵੇਜ਼ ਜਮ੍ਹਾਂ ਕਰਨਾ"),
    lt("the insurer upload centre", "बीमाकर्ता अपलोड केंद्र", "ਬੀਮਾਕਰਤਾ ਅੱਪਲੋਡ ਕੇਂਦਰ"),
    lt("missing-claim-paper follow-up", "गुम दावा दस्तावेज़ों के अनुरोध", "ਗੁੰਮ ਦਾਅਵਾ ਕਾਗਜ਼ਾਂ ਲਈ ਬੇਨਤੀਆਂ"),
    lt("a document-category guidance system", "दस्तावेज़ श्रेणी संकेत", "ਦਸਤਾਵੇਜ਼ ਸ਼੍ਰੇਣੀ ਸੰਕੇਤ"),
    lt("a reduction in missing-document requests", "कम गुम-दस्तावेज़ अनुरोध", "ਘੱਟ ਗੁੰਮ-ਦਸਤਾਵੇਜ਼ ਬੇਨਤੀਆਂ"),
    lt("policyholders filing claims", "दावा करने वाले पॉलिसीधारक", "ਦਾਅਵੇ ਕਰਨ ਵਾਲੇ ਪਾਲਿਸੀਧਾਰਕ"),
    lt("complete-claim submission rate", "पूर्ण दावा जमा दर", "ਪੂਰਾ ਦਾਅਵਾ ਜਮ੍ਹਾਂ ਦਰ")),

  ctx("BUS-PASS", "PUNJAB_STATE", "Medium", "PUBLIC_TRANSPORT",
    lt("bus-pass applicants", "बस-पास आवेदक", "ਬੱਸ-ਪਾਸ ਅਰਜ਼ੀਦਾਰ"),
    lt("pass renewal", "पास नवीनीकरण", "ਪਾਸ ਨਵੀਨੀਕਰਨ"),
    lt("the transport service portal", "परिवहन सेवा पोर्टल", "ਆਵਾਜਾਈ ਸੇਵਾ ਪੋਰਟਲ"),
    lt("renewal-office queuing", "नवीनीकरण कार्यालय की कतारें", "ਨਵੀਨੀਕਰਨ ਦਫ਼ਤਰ ਕਤਾਰਾਂ"),
    lt("online document pre-check", "ऑनलाइन दस्तावेज़ पूर्व-जांच", "ਆਨਲਾਈਨ ਦਸਤਾਵੇਜ਼ ਪਹਿਲਾਂ-ਜਾਂਚ"),
    lt("shorter renewal time", "कम समय वाले नवीनीकरण दौरे", "ਛੋਟੇ ਨਵੀਨੀਕਰਨ ਦੌਰੇ"),
    lt("regular bus-pass users", "नियमित बस-पास उपयोगकर्ता", "ਨਿਯਮਤ ਬੱਸ-ਪਾਸ ਵਰਤੋਂਕਾਰ"),
    lt("average counter time", "औसत काउंटर समय", "ਔਸਤ ਕਾਊਂਟਰ ਸਮਾਂ")),

  ctx("SUPPORT-TICKET", "CROSS_EXAM_DISCOVERY", "Medium", "CUSTOMER_SUPPORT",
    lt("service users", "सेवा उपयोगकर्ता", "ਸੇਵਾ ਵਰਤੋਂਕਾਰ"),
    lt("a support request", "सहायता अनुरोध", "ਮਦਦ ਬੇਨਤੀਆਂ"),
    lt("the support ticket portal", "सहायता टिकट पोर्टल", "ਮਦਦ ਟਿਕਟ ਪੋਰਟਲ"),
    lt("duplicate-ticket creation", "दोहराए गए सहायता टिकट", "ਦੁਹਰਾਏ ਮਦਦ ਟਿਕਟ"),
    lt("related-ticket detection", "संबंधित टिकट पहचान", "ਸਬੰਧਤ ਟਿਕਟ ਪਛਾਣ"),
    lt("a reduction in duplicate tickets", "कम दोहराए टिकट", "ਘੱਟ ਦੁਹਰਾਏ ਟਿਕਟ"),
    lt("users seeking technical support", "तकनीकी सहायता चाहने वाले उपयोगकर्ता", "ਤਕਨੀਕੀ ਮਦਦ ਲੈਣ ਵਾਲੇ ਵਰਤੋਂਕਾਰ"),
    lt("duplicate-ticket rate", "दोहराए टिकट की दर", "ਦੁਹਰਾਏ ਟਿਕਟ ਦਰ")),
]);

if (STA_V41_CONTEXTS.length !== 18 || new Set(STA_V41_CONTEXTS.map((item) => item.id)).size !== 18) {
  throw new Error("STA V4.1 requires exactly 18 distinct operational contexts");
}