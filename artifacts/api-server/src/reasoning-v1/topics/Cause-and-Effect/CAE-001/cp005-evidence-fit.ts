import type {
  CaeDifficulty,
  CaeDifficultyEvidence,
  CaeDistractorRole,
  CaeLocale,
  CaeRenderedOption,
  GeneratedCaeQuestion,
  LocalizedText,
} from "./types.ts";

type EvidenceFitMode = "TIMING_FIT" | "SCOPE_FIT" | "MECHANISM_FIT";
type Candidate = Readonly<{
  id: string;
  text: LocalizedText;
  isCorrect: boolean;
  mechanism?: CaeDistractorRole;
}>;
type Scenario = Readonly<{
  familyId: string;
  id: string;
  mode: EvidenceFitMode;
  difficulty: CaeDifficulty;
  observation: LocalizedText;
  evidence: LocalizedText;
  explanation: LocalizedText;
  candidates: readonly Candidate[];
}>;

const l = (en: string, hi: string, pa: string): LocalizedText => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa });
const c = (id: string, text: LocalizedText, isCorrect: boolean, mechanism?: CaeDistractorRole): Candidate => ({ id, text, isCorrect, mechanism });

export const CP005_EVIDENCE_FIT_FAMILY_IDS = Object.freeze([
  "CAE-FAM-COMPETING-TIMING-EVIDENCE",
  "CAE-FAM-COMPETING-SCOPE-EVIDENCE",
  "CAE-FAM-COMPETING-MECHANISM-EVIDENCE",
] as const);

export const CP005_EVIDENCE_FIT_SCENARIOS: readonly Scenario[] = Object.freeze([
  {
    familyId: "CAE-FAM-COMPETING-TIMING-EVIDENCE",
    id: "parcel-hub-night-shift",
    mode: "TIMING_FIT",
    difficulty: "HARD",
    observation: l(
      "Parcel departures from the hub became late during the night shift.",
      "रात की पाली में हब से पार्सल की रवानगी देर से होने लगी।",
      "ਰਾਤ ਦੀ ਸ਼ਿਫਟ ਵਿੱਚ ਹੱਬ ਤੋਂ ਪਾਰਸਲਾਂ ਦੀ ਰਵਾਨਗੀ ਦੇਰ ਨਾਲ ਹੋਣ ਲੱਗੀ।",
    ),
    evidence: l(
      "The delay began immediately after the sorting belt stopped at 11:20 p.m.; staffing and incoming truck arrivals were normal before and after that time.",
      "देरी ठीक 11:20 बजे छंटाई बेल्ट बंद होने के बाद शुरू हुई; उस समय से पहले और बाद में कर्मचारी तथा आने वाले ट्रक सामान्य थे।",
      "ਦੇਰੀ ਠੀਕ ਰਾਤ 11:20 ਵਜੇ ਛਾਂਟਣ ਵਾਲੀ ਬੈਲਟ ਬੰਦ ਹੋਣ ਤੋਂ ਬਾਅਦ ਸ਼ੁਰੂ ਹੋਈ; ਉਸ ਸਮੇਂ ਤੋਂ ਪਹਿਲਾਂ ਅਤੇ ਬਾਅਦ ਕਰਮਚਾਰੀ ਅਤੇ ਆਉਣ ਵਾਲੇ ਟਰੱਕ ਆਮ ਸਨ।",
    ),
    explanation: l(
      "The timing matches the sorting-belt failure. The other events do not explain why the delay started at that exact time.",
      "समय छंटाई बेल्ट की खराबी से मेल खाता है। बाकी घटनाएँ यह नहीं समझातीं कि देरी ठीक उसी समय क्यों शुरू हुई।",
      "ਸਮਾਂ ਛਾਂਟਣ ਵਾਲੀ ਬੈਲਟ ਦੀ ਖਰਾਬੀ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ। ਹੋਰ ਘਟਨਾਵਾਂ ਇਹ ਨਹੀਂ ਸਮਝਾਉਂਦੀਆਂ ਕਿ ਦੇਰੀ ਠੀਕ ਉਸੇ ਵੇਲੇ ਕਿਉਂ ਸ਼ੁਰੂ ਹੋਈ।",
    ),
    candidates: [
      c("sorting-belt-stop", l("The main sorting belt failed at 11:20 p.m.", "मुख्य छंटाई बेल्ट 11:20 बजे खराब हो गई।", "ਮੁੱਖ ਛਾਂਟਣ ਵਾਲੀ ਬੈਲਟ ਰਾਤ 11:20 ਵਜੇ ਖਰਾਬ ਹੋ ਗਈ।"), true),
      c("staff-shortage-earlier", l("The hub had fewer workers than usual earlier in the evening.", "शाम के पहले हिस्से में हब में सामान्य से कम कर्मचारी थे।", "ਸ਼ਾਮ ਦੇ ਪਹਿਲੇ ਹਿੱਸੇ ਵਿੱਚ ਹੱਬ ਵਿੱਚ ਆਮ ਨਾਲੋਂ ਘੱਟ ਕਰਮਚਾਰੀ ਸਨ।"), false, "TEMPORAL_VIOLATION"),
      c("truck-queue-morning", l("Incoming trucks had faced a queue during the morning shift.", "सुबह की पाली में आने वाले ट्रकों को कतार का सामना करना पड़ा था।", "ਸਵੇਰ ਦੀ ਸ਼ਿਫਟ ਵਿੱਚ ਆਉਣ ਵਾਲੇ ਟਰੱਕਾਂ ਨੂੰ ਕਤਾਰ ਦਾ ਸਾਹਮਣਾ ਕਰਨਾ ਪਿਆ ਸੀ।"), false, "TEMPORAL_VIOLATION"),
      c("scanner-slow-one-zone", l("Handheld scanners were slow in one loading zone.", "एक लोडिंग क्षेत्र में हैंडहेल्ड स्कैनर धीमे थे।", "ਇੱਕ ਲੋਡਿੰਗ ਖੇਤਰ ਵਿੱਚ ਹੈਂਡਹੈਲਡ ਸਕੈਨਰ ਹੌਲੇ ਸਨ।"), false, "WRONG_SCOPE"),
    ],
  },
  {
    familyId: "CAE-FAM-COMPETING-TIMING-EVIDENCE",
    id: "school-bus-road-block",
    mode: "TIMING_FIT",
    difficulty: "HARD",
    observation: l(
      "Several school buses reached the campus late in the morning.",
      "सुबह कई स्कूल बसें परिसर में देर से पहुँचीं।",
      "ਸਵੇਰੇ ਕਈ ਸਕੂਲ ਬੱਸਾਂ ਕੈਂਪਸ ਵਿੱਚ ਦੇਰ ਨਾਲ ਪਹੁੰਚੀਆਂ।",
    ),
    evidence: l(
      "All delayed buses used the western route, and the delays started only after police closed that road at 7:35 a.m.; the buses had left their first stops on time.",
      "सभी देर से पहुँची बसें पश्चिमी मार्ग से आईं और देरी केवल 7:35 बजे पुलिस द्वारा सड़क बंद करने के बाद शुरू हुई; बसें अपने पहले स्टॉप से समय पर चली थीं।",
      "ਸਾਰੀਆਂ ਦੇਰ ਨਾਲ ਪਹੁੰਚੀਆਂ ਬੱਸਾਂ ਪੱਛਮੀ ਰਸਤੇ ਤੋਂ ਆਈਆਂ ਅਤੇ ਦੇਰੀ ਸਿਰਫ਼ ਸਵੇਰੇ 7:35 ਵਜੇ ਪੁਲਿਸ ਵੱਲੋਂ ਰਸਤਾ ਬੰਦ ਕਰਨ ਤੋਂ ਬਾਅਦ ਸ਼ੁਰੂ ਹੋਈ; ਬੱਸਾਂ ਆਪਣੇ ਪਹਿਲੇ ਸਟਾਪ ਤੋਂ ਸਮੇਂ ਸਿਰ ਚੱਲੀਆਂ ਸਨ।",
    ),
    explanation: l(
      "The road closure matches both the route and the exact start of the delay.",
      "सड़क बंद होना मार्ग और देरी शुरू होने के समय—दोनों से मेल खाता है।",
      "ਰਸਤਾ ਬੰਦ ਹੋਣਾ ਰਸਤੇ ਅਤੇ ਦੇਰੀ ਸ਼ੁਰੂ ਹੋਣ ਦੇ ਸਮੇਂ—ਦੋਵਾਂ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।",
    ),
    candidates: [
      c("western-road-closure", l("Police closed the western access road at 7:35 a.m.", "पुलिस ने 7:35 बजे पश्चिमी पहुंच सड़क बंद कर दी।", "ਪੁਲਿਸ ਨੇ ਸਵੇਰੇ 7:35 ਵਜੇ ਪੱਛਮੀ ਪਹੁੰਚ ਰਸਤਾ ਬੰਦ ਕਰ ਦਿੱਤਾ।"), true),
      c("driver-shortage-week", l("The operator had faced a driver shortage earlier that week.", "ऑपरेटर को उसी सप्ताह पहले ड्राइवरों की कमी रही थी।", "ਓਪਰੇਟਰ ਨੂੰ ਉਸੇ ਹਫ਼ਤੇ ਪਹਿਲਾਂ ਡਰਾਈਵਰਾਂ ਦੀ ਘਾਟ ਰਹੀ ਸੀ।"), false, "TEMPORAL_VIOLATION"),
      c("campus-gate-check", l("The campus gate introduced a longer vehicle check after 9 a.m.", "कैंपस गेट पर सुबह 9 बजे के बाद लंबी वाहन जांच शुरू हुई।", "ਕੈਂਪਸ ਗੇਟ ਉੱਤੇ ਸਵੇਰੇ 9 ਵਜੇ ਤੋਂ ਬਾਅਦ ਲੰਬੀ ਵਾਹਨ ਜਾਂਚ ਸ਼ੁਰੂ ਹੋਈ।"), false, "TEMPORAL_VIOLATION"),
      c("one-bus-fault", l("One bus developed an engine fault on another route.", "दूसरे मार्ग की एक बस में इंजन खराबी आई।", "ਦੂਜੇ ਰਸਤੇ ਦੀ ਇੱਕ ਬੱਸ ਵਿੱਚ ਇੰਜਣ ਦੀ ਖਰਾਬੀ ਆਈ।"), false, "WRONG_SCOPE"),
    ],
  },
  {
    familyId: "CAE-FAM-COMPETING-TIMING-EVIDENCE",
    id: "clinic-registration-delay",
    mode: "TIMING_FIT",
    difficulty: "MEDIUM",
    observation: l(
      "Patient registration suddenly slowed at a clinic.",
      "क्लिनिक में मरीजों का पंजीकरण अचानक धीमा हो गया।",
      "ਕਲੀਨਿਕ ਵਿੱਚ ਮਰੀਜ਼ਾਂ ਦੀ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਅਚਾਨਕ ਹੌਲੀ ਹੋ ਗਈ।",
    ),
    evidence: l(
      "The slowdown began immediately after the registration server restarted; patient arrivals stayed close to the usual level.",
      "धीमापन पंजीकरण सर्वर के पुनः शुरू होने के तुरंत बाद आया; मरीजों की संख्या सामान्य के करीब रही।",
      "ਹੌਲਾਪਣ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਸਰਵਰ ਮੁੜ ਚਾਲੂ ਹੋਣ ਦੇ ਤੁਰੰਤ ਬਾਅਦ ਆਇਆ; ਮਰੀਜ਼ਾਂ ਦੀ ਗਿਣਤੀ ਆਮ ਦੇ ਨੇੜੇ ਰਹੀ।",
    ),
    explanation: l(
      "The server restart is the event that lines up with the sudden change in registration speed.",
      "सर्वर का पुनः शुरू होना ही वह घटना है जो पंजीकरण की गति में अचानक बदलाव के समय से मेल खाती है।",
      "ਸਰਵਰ ਦਾ ਮੁੜ ਚਾਲੂ ਹੋਣਾ ਹੀ ਉਹ ਘਟਨਾ ਹੈ ਜੋ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਦੀ ਗਤੀ ਵਿੱਚ ਅਚਾਨਕ ਬਦਲਾਅ ਦੇ ਸਮੇਂ ਨਾਲ ਮੇਲ ਖਾਂਦੀ ਹੈ।",
    ),
    candidates: [
      c("registration-server-restart", l("The registration server restarted and took time to recover.", "पंजीकरण सर्वर पुनः शुरू हुआ और सामान्य होने में समय लगा।", "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਸਰਵਰ ਮੁੜ ਚਾਲੂ ਹੋਇਆ ਅਤੇ ਆਮ ਹੋਣ ਵਿੱਚ ਸਮਾਂ ਲੱਗਿਆ।"), true),
      c("high-arrivals-yesterday", l("The clinic had unusually high patient arrivals the previous day.", "पिछले दिन क्लिनिक में मरीजों की संख्या असामान्य रूप से अधिक थी।", "ਪਿਛਲੇ ਦਿਨ ਕਲੀਨਿਕ ਵਿੱਚ ਮਰੀਜ਼ਾਂ ਦੀ ਗਿਣਤੀ ਅਸਧਾਰਣ ਤੌਰ ਤੇ ਵੱਧ ਸੀ।"), false, "TEMPORAL_VIOLATION"),
      c("printer-paper", l("One desk ran short of printer paper.", "एक डेस्क पर प्रिंटर पेपर कम पड़ गया।", "ਇੱਕ ਡੈਸਕ ਉੱਤੇ ਪ੍ਰਿੰਟਰ ਪੇਪਰ ਘੱਟ ਪੈ ਗਿਆ।"), false, "WRONG_SCOPE"),
      c("parking-crowding", l("The clinic parking area became crowded later in the morning.", "सुबह बाद में क्लिनिक की पार्किंग भीड़भाड़ वाली हो गई।", "ਸਵੇਰੇ ਬਾਅਦ ਵਿੱਚ ਕਲੀਨਿਕ ਦੀ ਪਾਰਕਿੰਗ ਭੀੜਭਾੜ ਵਾਲੀ ਹੋ ਗਈ।"), false, "TEMPORAL_VIOLATION"),
    ],
  },
  {
    familyId: "CAE-FAM-COMPETING-TIMING-EVIDENCE",
    id: "bank-clearing-lag",
    mode: "TIMING_FIT",
    difficulty: "HARD",
    observation: l(
      "A bank's outward transfers began taking much longer than usual.",
      "एक बैंक के बाहर भेजे जाने वाले ट्रांसफर सामान्य से काफी अधिक समय लेने लगे।",
      "ਇੱਕ ਬੈਂਕ ਦੇ ਬਾਹਰ ਭੇਜੇ ਜਾਣ ਵਾਲੇ ਟ੍ਰਾਂਸਫਰ ਆਮ ਨਾਲੋਂ ਕਾਫ਼ੀ ਵੱਧ ਸਮਾਂ ਲੈਣ ਲੱਗੇ।",
    ),
    evidence: l(
      "The change started immediately after a clearing gateway maintenance window ended; branch internet links and customer login remained normal.",
      "बदलाव क्लियरिंग गेटवे के रखरखाव समय के खत्म होते ही शुरू हुआ; शाखाओं का इंटरनेट और ग्राहक लॉगिन सामान्य रहे।",
      "ਬਦਲਾਅ ਕਲੀਅਰਿੰਗ ਗੇਟਵੇ ਦੀ ਮੇਂਟੇਨੈਂਸ ਵਿੰਡੋ ਖਤਮ ਹੁੰਦੇ ਹੀ ਸ਼ੁਰੂ ਹੋਇਆ; ਸ਼ਾਖਾਵਾਂ ਦਾ ਇੰਟਰਨੈੱਟ ਅਤੇ ਗਾਹਕ ਲਾਗਇਨ ਆਮ ਰਹੇ।",
    ),
    explanation: l(
      "The clearing gateway is the only proposed cause that matches the start time and the affected service.",
      "क्लियरिंग गेटवे ही ऐसा कारण है जो शुरू होने के समय और प्रभावित सेवा—दोनों से मेल खाता है।",
      "ਕਲੀਅਰਿੰਗ ਗੇਟਵੇ ਹੀ ਉਹ ਕਾਰਨ ਹੈ ਜੋ ਸ਼ੁਰੂ ਹੋਣ ਦੇ ਸਮੇਂ ਅਤੇ ਪ੍ਰਭਾਵਿਤ ਸੇਵਾ—ਦੋਵਾਂ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।",
    ),
    candidates: [
      c("clearing-gateway-recovery", l("The clearing gateway did not recover correctly after maintenance.", "रखरखाव के बाद क्लियरिंग गेटवे सही तरह से सामान्य नहीं हुआ।", "ਮੇਂਟੇਨੈਂਸ ਤੋਂ ਬਾਅਦ ਕਲੀਅਰਿੰਗ ਗੇਟਵੇ ਠੀਕ ਤਰ੍ਹਾਂ ਆਮ ਨਹੀਂ ਹੋਇਆ।"), true),
      c("branch-link-congestion", l("Several branch internet links were congested throughout the day.", "दिन भर कई शाखाओं के इंटरनेट लिंक व्यस्त रहे।", "ਦਿਨ ਭਰ ਕਈ ਸ਼ਾਖਾਵਾਂ ਦੇ ਇੰਟਰਨੈੱਟ ਲਿੰਕ ਭਰੇ ਰਹੇ।"), false, "WRONG_SCOPE"),
      c("login-service-fault", l("The customer login service became unstable.", "ग्राहक लॉगिन सेवा अस्थिर हो गई।", "ਗਾਹਕ ਲਾਗਇਨ ਸੇਵਾ ਅਸਥਿਰ ਹੋ ਗਈ।"), false, "WRONG_SCOPE"),
      c("month-end-demand", l("Transfer demand had been high since the start of the morning.", "सुबह की शुरुआत से ही ट्रांसफर की मांग अधिक थी।", "ਸਵੇਰ ਦੀ ਸ਼ੁਰੂਆਤ ਤੋਂ ਹੀ ਟ੍ਰਾਂਸਫਰ ਦੀ ਮੰਗ ਵੱਧ ਸੀ।"), false, "TEMPORAL_VIOLATION"),
    ],
  },

  {
    familyId: "CAE-FAM-COMPETING-SCOPE-EVIDENCE",
    id: "bank-branches-login",
    mode: "SCOPE_FIT",
    difficulty: "HARD",
    observation: l(
      "Staff at many branches could not open the same banking application.",
      "कई शाखाओं के कर्मचारी एक ही बैंकिंग एप्लिकेशन नहीं खोल सके।",
      "ਕਈ ਸ਼ਾਖਾਵਾਂ ਦੇ ਕਰਮਚਾਰੀ ਇੱਕੋ ਬੈਂਕਿੰਗ ਐਪਲੀਕੇਸ਼ਨ ਨਹੀਂ ਖੋਲ੍ਹ ਸਕੇ।",
    ),
    evidence: l(
      "The failures appeared at branches on different networks at the same time, while other web services at those branches remained available.",
      "अलग-अलग नेटवर्क वाली शाखाओं में एक ही समय विफलता हुई, जबकि उन शाखाओं में दूसरी वेब सेवाएँ चलती रहीं।",
      "ਵੱਖ-ਵੱਖ ਨੈੱਟਵਰਕ ਵਾਲੀਆਂ ਸ਼ਾਖਾਵਾਂ ਵਿੱਚ ਇੱਕੋ ਸਮੇਂ ਨਾਕਾਮੀ ਹੋਈ, ਜਦਕਿ ਉਹਨਾਂ ਸ਼ਾਖਾਵਾਂ ਵਿੱਚ ਹੋਰ ਵੈੱਬ ਸੇਵਾਵਾਂ ਚੱਲਦੀਆਂ ਰਹੀਆਂ।",
    ),
    explanation: l(
      "A central application service fits the wide scope. A local branch or network fault would not affect many independent branches at once.",
      "केंद्रीय एप्लिकेशन सेवा व्यापक असर से मेल खाती है। स्थानीय शाखा या नेटवर्क की खराबी कई स्वतंत्र शाखाओं को एक साथ प्रभावित नहीं करती।",
      "ਕੇਂਦਰੀ ਐਪਲੀਕੇਸ਼ਨ ਸੇਵਾ ਵਿਆਪਕ ਅਸਰ ਨਾਲ ਮੇਲ ਖਾਂਦੀ ਹੈ। ਸਥਾਨਕ ਸ਼ਾਖਾ ਜਾਂ ਨੈੱਟਵਰਕ ਦੀ ਖਰਾਬੀ ਕਈ ਸੁਤੰਤਰ ਸ਼ਾਖਾਵਾਂ ਨੂੰ ਇੱਕੋ ਸਮੇਂ ਪ੍ਰਭਾਵਿਤ ਨਹੀਂ ਕਰਦੀ।",
    ),
    candidates: [
      c("central-auth-service", l("The central authentication service for the banking application failed.", "बैंकिंग एप्लिकेशन की केंद्रीय प्रमाणीकरण सेवा बंद हो गई।", "ਬੈਂਕਿੰਗ ਐਪਲੀਕੇਸ਼ਨ ਦੀ ਕੇਂਦਰੀ ਪ੍ਰਮਾਣੀਕਰਨ ਸੇਵਾ ਬੰਦ ਹੋ ਗਈ।"), true),
      c("one-branch-router", l("A router failed at one large branch.", "एक बड़ी शाखा का राउटर खराब हो गया।", "ਇੱਕ ਵੱਡੀ ਸ਼ਾਖਾ ਦਾ ਰਾਊਟਰ ਖਰਾਬ ਹੋ ਗਿਆ।"), false, "WRONG_SCOPE"),
      c("regional-provider", l("One regional internet provider had a local outage.", "एक क्षेत्रीय इंटरनेट प्रदाता में स्थानीय खराबी हुई।", "ਇੱਕ ਖੇਤਰੀ ਇੰਟਰਨੈੱਟ ਪ੍ਰਦਾਤਾ ਵਿੱਚ ਸਥਾਨਕ ਖਰਾਬੀ ਹੋਈ।"), false, "WRONG_SCOPE"),
      c("branch-firewall-rule", l("A firewall rule was changed at a single branch.", "एक शाखा में फायरवॉल नियम बदला गया।", "ਇੱਕ ਸ਼ਾਖਾ ਵਿੱਚ ਫਾਇਰਵਾਲ ਨਿਯਮ ਬਦਲਿਆ ਗਿਆ।"), false, "WRONG_SCOPE"),
    ],
  },
  {
    familyId: "CAE-FAM-COMPETING-SCOPE-EVIDENCE",
    id: "exam-room-verification",
    mode: "SCOPE_FIT",
    difficulty: "HARD",
    observation: l(
      "Candidate verification slowed in several rooms of the same examination building.",
      "एक ही परीक्षा भवन के कई कमरों में उम्मीदवार सत्यापन धीमा हो गया।",
      "ਇੱਕੋ ਪਰੀਖਿਆ ਭਵਨ ਦੇ ਕਈ ਕਮਰਿਆਂ ਵਿੱਚ ਉਮੀਦਵਾਰ ਤਸਦੀਕ ਹੌਲੀ ਹੋ ਗਈ।",
    ),
    evidence: l(
      "Different scanners showed the same delay, but rooms in the neighbouring building were unaffected.",
      "अलग-अलग स्कैनर पर एक जैसी देरी हुई, लेकिन पास के दूसरे भवन के कमरे प्रभावित नहीं हुए।",
      "ਵੱਖ-ਵੱਖ ਸਕੈਨਰਾਂ ਉੱਤੇ ਇੱਕੋ ਜਿਹੀ ਦੇਰੀ ਹੋਈ, ਪਰ ਨੇੜਲੇ ਦੂਜੇ ਭਵਨ ਦੇ ਕਮਰੇ ਪ੍ਰਭਾਵਿਤ ਨਹੀਂ ਹੋਏ।",
    ),
    explanation: l(
      "A network fault shared by that building matches the scope: several rooms are affected, but the neighbouring building is not.",
      "उस भवन की साझा नेटवर्क खराबी असर के दायरे से मेल खाती है: कई कमरे प्रभावित हैं, लेकिन पास का दूसरा भवन नहीं।",
      "ਉਸ ਭਵਨ ਦੀ ਸਾਂਝੀ ਨੈੱਟਵਰਕ ਖਰਾਬੀ ਅਸਰ ਦੇ ਦਾਇਰੇ ਨਾਲ ਮੇਲ ਖਾਂਦੀ ਹੈ: ਕਈ ਕਮਰੇ ਪ੍ਰਭਾਵਿਤ ਹਨ, ਪਰ ਨੇੜਲਾ ਦੂਜਾ ਭਵਨ ਨਹੀਂ।",
    ),
    candidates: [
      c("building-network-switch", l("The network switch serving that examination building became unstable.", "उस परीक्षा भवन का नेटवर्क स्विच अस्थिर हो गया।", "ਉਸ ਪਰੀਖਿਆ ਭਵਨ ਦਾ ਨੈੱਟਵਰਕ ਸਵਿੱਚ ਅਸਥਿਰ ਹੋ ਗਿਆ।"), true),
      c("one-scanner-fault", l("One room had a faulty verification scanner.", "एक कमरे का सत्यापन स्कैनर खराब था।", "ਇੱਕ ਕਮਰੇ ਦਾ ਤਸਦੀਕ ਸਕੈਨਰ ਖਰਾਬ ਸੀ।"), false, "WRONG_SCOPE"),
      c("central-exam-server", l("The central examination server failed for all centres.", "केंद्रीय परीक्षा सर्वर सभी केंद्रों के लिए बंद हो गया।", "ਕੇਂਦਰੀ ਪਰੀਖਿਆ ਸਰਵਰ ਸਾਰੇ ਕੇਂਦਰਾਂ ਲਈ ਬੰਦ ਹੋ ਗਿਆ।"), false, "MAGNITUDE_MISMATCH"),
      c("candidate-document-issue", l("Some candidates in one room had incomplete documents.", "एक कमरे के कुछ उम्मीदवारों के दस्तावेज अधूरे थे।", "ਇੱਕ ਕਮਰੇ ਦੇ ਕੁਝ ਉਮੀਦਵਾਰਾਂ ਦੇ ਦਸਤਾਵੇਜ਼ ਅਧੂਰੇ ਸਨ।"), false, "WRONG_SCOPE"),
    ],
  },
  {
    familyId: "CAE-FAM-COMPETING-SCOPE-EVIDENCE",
    id: "distribution-feeder-voltage",
    mode: "SCOPE_FIT",
    difficulty: "MEDIUM",
    observation: l(
      "Voltage dropped at homes supplied by three feeders from the same substation.",
      "एक ही सबस्टेशन से जुड़े तीन फीडरों के घरों में वोल्टेज गिर गया।",
      "ਇੱਕੋ ਸਬਸਟੇਸ਼ਨ ਨਾਲ ਜੁੜੇ ਤਿੰਨ ਫੀਡਰਾਂ ਦੇ ਘਰਾਂ ਵਿੱਚ ਵੋਲਟੇਜ ਘਟ ਗਿਆ।",
    ),
    evidence: l(
      "A fourth feeder from another substation remained normal, and no single local transformer showed an overload alarm.",
      "दूसरे सबस्टेशन का चौथा फीडर सामान्य रहा और किसी एक स्थानीय ट्रांसफॉर्मर पर ओवरलोड अलार्म नहीं आया।",
      "ਦੂਜੇ ਸਬਸਟੇਸ਼ਨ ਦਾ ਚੌਥਾ ਫੀਡਰ ਆਮ ਰਿਹਾ ਅਤੇ ਕਿਸੇ ਇੱਕ ਸਥਾਨਕ ਟ੍ਰਾਂਸਫਾਰਮਰ ਉੱਤੇ ਓਵਰਲੋਡ ਅਲਾਰਮ ਨਹੀਂ ਆਇਆ।",
    ),
    explanation: l(
      "The shared substation is the level common to all affected feeders. A single local transformer is too narrow.",
      "साझा सबस्टेशन ही सभी प्रभावित फीडरों का समान स्तर है। एक स्थानीय ट्रांसफॉर्मर का असर बहुत सीमित होता।",
      "ਸਾਂਝਾ ਸਬਸਟੇਸ਼ਨ ਹੀ ਸਾਰੇ ਪ੍ਰਭਾਵਿਤ ਫੀਡਰਾਂ ਦਾ ਸਾਂਝਾ ਪੱਧਰ ਹੈ। ਇੱਕ ਸਥਾਨਕ ਟ੍ਰਾਂਸਫਾਰਮਰ ਦਾ ਅਸਰ ਬਹੁਤ ਸੀਮਿਤ ਹੁੰਦਾ।",
    ),
    candidates: [
      c("substation-regulator-fault", l("The voltage regulator at the shared substation malfunctioned.", "साझा सबस्टेशन का वोल्टेज रेगुलेटर खराब हो गया।", "ਸਾਂਝੇ ਸਬਸਟੇਸ਼ਨ ਦਾ ਵੋਲਟੇਜ ਰੈਗੂਲੇਟਰ ਖਰਾਬ ਹੋ ਗਿਆ।"), true),
      c("one-transformer-overload", l("One neighbourhood transformer became overloaded.", "एक मोहल्ले का ट्रांसफॉर्मर ओवरलोड हो गया।", "ਇੱਕ ਮੁਹੱਲੇ ਦਾ ਟ੍ਰਾਂਸਫਾਰਮਰ ਓਵਰਲੋਡ ਹੋ ਗਿਆ।"), false, "WRONG_SCOPE"),
      c("house-wiring", l("Several homes had internal wiring faults.", "कई घरों में अंदरूनी वायरिंग की खराबी थी।", "ਕਈ ਘਰਾਂ ਵਿੱਚ ਅੰਦਰੂਨੀ ਵਾਇਰਿੰਗ ਦੀ ਖਰਾਬੀ ਸੀ।"), false, "WRONG_SCOPE"),
      c("grid-wide-shortage", l("The entire regional grid faced a severe power shortage.", "पूरे क्षेत्रीय ग्रिड में गंभीर बिजली कमी थी।", "ਪੂਰੇ ਖੇਤਰੀ ਗ੍ਰਿਡ ਵਿੱਚ ਗੰਭੀਰ ਬਿਜਲੀ ਘਾਟ ਸੀ।"), false, "MAGNITUDE_MISMATCH"),
    ],
  },
  {
    familyId: "CAE-FAM-COMPETING-SCOPE-EVIDENCE",
    id: "canal-outlet-flow",
    mode: "SCOPE_FIT",
    difficulty: "HARD",
    observation: l(
      "Water flow fell at several irrigation outlets along the same canal reach.",
      "एक ही नहर खंड के कई सिंचाई आउटलेट पर पानी का बहाव घट गया।",
      "ਇੱਕੋ ਨਹਿਰ ਖੰਡ ਦੇ ਕਈ ਸਿੰਚਾਈ ਆਉਟਲੈੱਟਾਂ ਉੱਤੇ ਪਾਣੀ ਦਾ ਵਹਾਅ ਘਟ ਗਿਆ।",
    ),
    evidence: l(
      "The fall began downstream of one head regulator; outlets upstream of it remained normal.",
      "गिरावट एक मुख्य रेगुलेटर के नीचे वाले हिस्से में शुरू हुई; उसके ऊपर के आउटलेट सामान्य रहे।",
      "ਘਟਾਅ ਇੱਕ ਮੁੱਖ ਰੈਗੂਲੇਟਰ ਤੋਂ ਹੇਠਾਂ ਵਾਲੇ ਹਿੱਸੇ ਵਿੱਚ ਸ਼ੁਰੂ ਹੋਇਆ; ਉਸ ਤੋਂ ਉੱਪਰਲੇ ਆਉਟਲੈੱਟ ਆਮ ਰਹੇ।",
    ),
    explanation: l(
      "A restriction at the head regulator matches the exact affected section of the canal.",
      "मुख्य रेगुलेटर पर रुकावट नहर के ठीक उसी प्रभावित हिस्से से मेल खाती है।",
      "ਮੁੱਖ ਰੈਗੂਲੇਟਰ ਉੱਤੇ ਰੁਕਾਵਟ ਨਹਿਰ ਦੇ ਠੀਕ ਉਸੇ ਪ੍ਰਭਾਵਿਤ ਹਿੱਸੇ ਨਾਲ ਮੇਲ ਖਾਂਦੀ ਹੈ।",
    ),
    candidates: [
      c("head-regulator-restriction", l("The head regulator for that canal reach was partly closed.", "उस नहर खंड का मुख्य रेगुलेटर आंशिक रूप से बंद था।", "ਉਸ ਨਹਿਰ ਖੰਡ ਦਾ ਮੁੱਖ ਰੈਗੂਲੇਟਰ ਅੰਸ਼ਕ ਤੌਰ ਤੇ ਬੰਦ ਸੀ।"), true),
      c("one-outlet-silt", l("Silt blocked one irrigation outlet.", "एक सिंचाई आउटलेट में गाद भर गई।", "ਇੱਕ ਸਿੰਚਾਈ ਆਉਟਲੈੱਟ ਵਿੱਚ ਗਾਦ ਭਰ ਗਈ।"), false, "WRONG_SCOPE"),
      c("reservoir-shortage", l("The reservoir feeding the entire canal system had very low storage.", "पूरी नहर प्रणाली को पानी देने वाले जलाशय में भंडारण बहुत कम था।", "ਪੂਰੀ ਨਹਿਰ ਪ੍ਰਣਾਲੀ ਨੂੰ ਪਾਣੀ ਦੇਣ ਵਾਲੇ ਜਲਾਸ਼ਯ ਵਿੱਚ ਭੰਡਾਰ ਬਹੁਤ ਘੱਟ ਸੀ।"), false, "MAGNITUDE_MISMATCH"),
      c("farm-pump", l("A farm pump near one outlet drew extra water.", "एक आउटलेट के पास खेत का पंप अधिक पानी खींच रहा था।", "ਇੱਕ ਆਉਟਲੈੱਟ ਨੇੜੇ ਖੇਤ ਦਾ ਪੰਪ ਵੱਧ ਪਾਣੀ ਖਿੱਚ ਰਿਹਾ ਸੀ।"), false, "WRONG_SCOPE"),
    ],
  },

  {
    familyId: "CAE-FAM-COMPETING-MECHANISM-EVIDENCE",
    id: "atm-dispense-failure",
    mode: "MECHANISM_FIT",
    difficulty: "HARD",
    observation: l(
      "Several ATMs accepted transactions but failed to dispense cash.",
      "कई एटीएम ने लेनदेन स्वीकार किया लेकिन नकद नहीं दिया।",
      "ਕਈ ਏਟੀਐਮਾਂ ਨੇ ਲੈਣ-ਦੇਣ ਮੰਨਿਆ ਪਰ ਨਕਦ ਨਹੀਂ ਦਿੱਤਾ।",
    ),
    evidence: l(
      "Account verification and balance checks completed normally, while the machines recorded repeated dispenser-motor errors.",
      "खाता सत्यापन और बैलेंस जांच सामान्य रही, जबकि मशीनों में बार-बार कैश डिस्पेंसर मोटर की त्रुटि दर्ज हुई।",
      "ਖਾਤਾ ਤਸਦੀਕ ਅਤੇ ਬੈਲੈਂਸ ਜਾਂਚ ਆਮ ਰਹੀ, ਜਦਕਿ ਮਸ਼ੀਨਾਂ ਵਿੱਚ ਵਾਰ-ਵਾਰ ਕੈਸ਼ ਡਿਸਪੈਂਸਰ ਮੋਟਰ ਦੀ ਗਲਤੀ ਦਰਜ ਹੋਈ।",
    ),
    explanation: l(
      "The transaction system is working, but the cash-delivery mechanism is failing. That points to the dispenser hardware.",
      "लेनदेन प्रणाली काम कर रही है, लेकिन नकद देने वाला तंत्र विफल हो रहा है। इसलिए कारण डिस्पेंसर हार्डवेयर है।",
      "ਲੈਣ-ਦੇਣ ਪ੍ਰਣਾਲੀ ਕੰਮ ਕਰ ਰਹੀ ਹੈ, ਪਰ ਨਕਦ ਦੇਣ ਵਾਲਾ ਤੰਤਰ ਨਾਕਾਮ ਹੋ ਰਿਹਾ ਹੈ। ਇਸ ਲਈ ਕਾਰਨ ਡਿਸਪੈਂਸਰ ਹਾਰਡਵੇਅਰ ਹੈ।",
    ),
    candidates: [
      c("cash-dispenser-motor", l("The cash-dispenser mechanism developed a motor fault.", "कैश डिस्पेंसर तंत्र में मोटर खराबी आ गई।", "ਕੈਸ਼ ਡਿਸਪੈਂਸਰ ਤੰਤਰ ਵਿੱਚ ਮੋਟਰ ਦੀ ਖਰਾਬੀ ਆ ਗਈ।"), true),
      c("bank-network-outage", l("The bank network stopped authorising ATM transactions.", "बैंक नेटवर्क ने एटीएम लेनदेन को अधिकृत करना बंद कर दिया।", "ਬੈਂਕ ਨੈੱਟਵਰਕ ਨੇ ਏਟੀਐਮ ਲੈਣ-ਦੇਣ ਨੂੰ ਮਨਜ਼ੂਰੀ ਦੇਣੀ ਬੰਦ ਕਰ ਦਿੱਤੀ।"), false, "WRONG_SCOPE"),
      c("account-server", l("The account-balance server became unavailable.", "खाता बैलेंस सर्वर उपलब्ध नहीं रहा।", "ਖਾਤਾ ਬੈਲੈਂਸ ਸਰਵਰ ਉਪਲਬਧ ਨਹੀਂ ਰਿਹਾ।"), false, "WRONG_SCOPE"),
      c("card-reader", l("The card readers failed to read customer cards.", "कार्ड रीडर ग्राहक कार्ड पढ़ने में विफल रहे।", "ਕਾਰਡ ਰੀਡਰ ਗਾਹਕਾਂ ਦੇ ਕਾਰਡ ਪੜ੍ਹਨ ਵਿੱਚ ਨਾਕਾਮ ਰਹੇ।"), false, "WRONG_SCOPE"),
    ],
  },
  {
    familyId: "CAE-FAM-COMPETING-MECHANISM-EVIDENCE",
    id: "cold-room-temperature",
    mode: "MECHANISM_FIT",
    difficulty: "MEDIUM",
    observation: l(
      "Temperature rose in a cold-storage room even though the lights and control panel stayed on.",
      "कोल्ड-स्टोरेज कमरे का तापमान बढ़ गया, जबकि लाइट और कंट्रोल पैनल चालू रहे।",
      "ਕੋਲਡ-ਸਟੋਰੇਜ ਕਮਰੇ ਦਾ ਤਾਪਮਾਨ ਵੱਧ ਗਿਆ, ਜਦਕਿ ਲਾਈਟਾਂ ਅਤੇ ਕੰਟਰੋਲ ਪੈਨਲ ਚਾਲੂ ਰਹੇ।",
    ),
    evidence: l(
      "The controller showed a compressor-pressure alarm, and the door sensor showed that the door remained closed.",
      "कंट्रोलर पर कंप्रेसर प्रेशर अलार्म आया और दरवाजा सेंसर ने दिखाया कि दरवाजा बंद रहा।",
      "ਕੰਟਰੋਲਰ ਉੱਤੇ ਕੰਪ੍ਰੈਸਰ ਪ੍ਰੈਸ਼ਰ ਅਲਾਰਮ ਆਇਆ ਅਤੇ ਦਰਵਾਜ਼ਾ ਸੈਂਸਰ ਨੇ ਦਿਖਾਇਆ ਕਿ ਦਰਵਾਜ਼ਾ ਬੰਦ ਰਿਹਾ।",
    ),
    explanation: l(
      "Power is available and the door is closed. The compressor alarm directly points to a refrigeration-system fault.",
      "बिजली उपलब्ध है और दरवाजा बंद है। कंप्रेसर अलार्म सीधे रेफ्रिजरेशन प्रणाली की खराबी की ओर संकेत करता है।",
      "ਬਿਜਲੀ ਉਪਲਬਧ ਹੈ ਅਤੇ ਦਰਵਾਜ਼ਾ ਬੰਦ ਹੈ। ਕੰਪ੍ਰੈਸਰ ਅਲਾਰਮ ਸਿੱਧਾ ਰੈਫ੍ਰਿਜਰੇਸ਼ਨ ਪ੍ਰਣਾਲੀ ਦੀ ਖਰਾਬੀ ਵੱਲ ਇਸ਼ਾਰਾ ਕਰਦਾ ਹੈ।",
    ),
    candidates: [
      c("compressor-fault", l("The refrigeration compressor developed a pressure fault.", "रेफ्रिजरेशन कंप्रेसर में प्रेशर खराबी आ गई।", "ਰੈਫ੍ਰਿਜਰੇਸ਼ਨ ਕੰਪ੍ਰੈਸਰ ਵਿੱਚ ਪ੍ਰੈਸ਼ਰ ਦੀ ਖਰਾਬੀ ਆ ਗਈ।"), true),
      c("power-cut", l("The cold-storage room lost electrical power.", "कोल्ड-स्टोरेज कमरे की बिजली चली गई।", "ਕੋਲਡ-ਸਟੋਰੇਜ ਕਮਰੇ ਦੀ ਬਿਜਲੀ ਚਲੀ ਗਈ।"), false, "WRONG_SCOPE"),
      c("door-open", l("The cold-room door was left open for a long period.", "कोल्ड-रूम का दरवाजा लंबे समय तक खुला रहा।", "ਕੋਲਡ-ਰੂਮ ਦਾ ਦਰਵਾਜ਼ਾ ਲੰਬੇ ਸਮੇਂ ਤੱਕ ਖੁੱਲ੍ਹਾ ਰਿਹਾ।"), false, "TEMPORAL_VIOLATION"),
      c("light-fault", l("The room lighting circuit developed a fault.", "कमरे की लाइटिंग सर्किट में खराबी आई।", "ਕਮਰੇ ਦੀ ਲਾਈਟਿੰਗ ਸਰਕਿਟ ਵਿੱਚ ਖਰਾਬੀ ਆਈ।"), false, "WRONG_SCOPE"),
    ],
  },
  {
    familyId: "CAE-FAM-COMPETING-MECHANISM-EVIDENCE",
    id: "bus-depot-fuel",
    mode: "MECHANISM_FIT",
    difficulty: "HARD",
    observation: l(
      "Several buses from the same depot lost engine power soon after starting their routes.",
      "एक ही डिपो की कई बसों में मार्ग शुरू करने के थोड़ी देर बाद इंजन की शक्ति घट गई।",
      "ਇੱਕੋ ਡਿਪੋ ਦੀਆਂ ਕਈ ਬੱਸਾਂ ਵਿੱਚ ਰਸਤਾ ਸ਼ੁਰੂ ਕਰਨ ਤੋਂ ਥੋੜ੍ਹੀ ਦੇਰ ਬਾਅਦ ਇੰਜਣ ਦੀ ਤਾਕਤ ਘਟ ਗਈ।",
    ),
    evidence: l(
      "Workshop checks found similar fuel-filter blockage in the affected buses; their electrical systems and engine temperatures were normal.",
      "वर्कशॉप जांच में प्रभावित बसों के फ्यूल फिल्टर में एक जैसी रुकावट मिली; उनकी विद्युत प्रणाली और इंजन तापमान सामान्य थे।",
      "ਵਰਕਸ਼ਾਪ ਜਾਂਚ ਵਿੱਚ ਪ੍ਰਭਾਵਿਤ ਬੱਸਾਂ ਦੇ ਫਿਊਲ ਫਿਲਟਰਾਂ ਵਿੱਚ ਇੱਕੋ ਜਿਹੀ ਰੁਕਾਵਟ ਮਿਲੀ; ਉਹਨਾਂ ਦੀ ਬਿਜਲੀ ਪ੍ਰਣਾਲੀ ਅਤੇ ਇੰਜਣ ਤਾਪਮਾਨ ਆਮ ਸਨ।",
    ),
    explanation: l(
      "The common fuel-filter blockage points to contaminated fuel from the shared depot supply.",
      "एक जैसी फ्यूल-फिल्टर रुकावट साझा डिपो आपूर्ति से दूषित ईंधन की ओर संकेत करती है।",
      "ਇੱਕੋ ਜਿਹੀ ਫਿਊਲ-ਫਿਲਟਰ ਰੁਕਾਵਟ ਸਾਂਝੀ ਡਿਪੋ ਸਪਲਾਈ ਤੋਂ ਦੂਸ਼ਿਤ ਇੰਧਨ ਵੱਲ ਇਸ਼ਾਰਾ ਕਰਦੀ ਹੈ।",
    ),
    candidates: [
      c("contaminated-fuel-batch", l("The depot received a contaminated batch of fuel.", "डिपो को दूषित ईंधन की खेप मिली।", "ਡਿਪੋ ਨੂੰ ਦੂਸ਼ਿਤ ਇੰਧਨ ਦੀ ਖੇਪ ਮਿਲੀ।"), true),
      c("battery-faults", l("The buses had weak batteries.", "बसों की बैटरियाँ कमजोर थीं।", "ਬੱਸਾਂ ਦੀਆਂ ਬੈਟਰੀਆਂ ਕਮਜ਼ੋਰ ਸਨ।"), false, "WRONG_SCOPE"),
      c("engine-overheating", l("The engines overheated because of cooling-system faults.", "कूलिंग प्रणाली की खराबी से इंजन अधिक गर्म हुए।", "ਕੂਲਿੰਗ ਪ੍ਰਣਾਲੀ ਦੀ ਖਰਾਬੀ ਕਾਰਨ ਇੰਜਣ ਜ਼ਿਆਦਾ ਗਰਮ ਹੋਏ।"), false, "WRONG_SCOPE"),
      c("route-congestion", l("Heavy traffic on the routes reduced bus speed.", "मार्गों पर भारी यातायात से बसों की गति कम हुई।", "ਰਸਤਿਆਂ ਉੱਤੇ ਭਾਰੀ ਆਵਾਜਾਈ ਨਾਲ ਬੱਸਾਂ ਦੀ ਗਤੀ ਘੱਟ ਹੋਈ।"), false, "WEAK_CAUSE"),
    ],
  },
  {
    familyId: "CAE-FAM-COMPETING-MECHANISM-EVIDENCE",
    id: "water-treatment-turbidity",
    mode: "MECHANISM_FIT",
    difficulty: "HARD",
    observation: l(
      "Treated water leaving a plant showed unusually high turbidity.",
      "प्लांट से निकलने वाले उपचारित पानी में असामान्य रूप से अधिक धुंधलापन था।",
      "ਪਲਾਂਟ ਤੋਂ ਨਿਕਲਣ ਵਾਲੇ ਸਾਫ਼ ਕੀਤੇ ਪਾਣੀ ਵਿੱਚ ਅਸਧਾਰਣ ਤੌਰ ਤੇ ਵੱਧ ਧੁੰਦਲਾਪਣ ਸੀ।",
    ),
    evidence: l(
      "Raw-water turbidity was normal, but the filter differential pressure rose sharply while chemical dosing remained within its normal range.",
      "कच्चे पानी का धुंधलापन सामान्य था, लेकिन फिल्टर का डिफरेंशियल प्रेशर तेजी से बढ़ा, जबकि रासायनिक डोजिंग सामान्य सीमा में रही।",
      "ਕੱਚੇ ਪਾਣੀ ਦਾ ਧੁੰਦਲਾਪਣ ਆਮ ਸੀ, ਪਰ ਫਿਲਟਰ ਦਾ ਡਿਫਰੈਂਸ਼ਲ ਪ੍ਰੈਸ਼ਰ ਤੇਜ਼ੀ ਨਾਲ ਵਧਿਆ, ਜਦਕਿ ਰਸਾਇਣਕ ਡੋਜ਼ਿੰਗ ਆਮ ਹੱਦ ਵਿੱਚ ਰਹੀ।",
    ),
    explanation: l(
      "The abnormal filter pressure identifies the filtration stage as the problem. The raw water and chemical dosing do not match the observed mechanism.",
      "फिल्टर का असामान्य प्रेशर समस्या को फिल्ट्रेशन चरण तक सीमित करता है। कच्चा पानी और रासायनिक डोजिंग इस पैटर्न से मेल नहीं खाते।",
      "ਫਿਲਟਰ ਦਾ ਅਸਧਾਰਣ ਪ੍ਰੈਸ਼ਰ ਸਮੱਸਿਆ ਨੂੰ ਫਿਲਟ੍ਰੇਸ਼ਨ ਪੜਾਅ ਤੱਕ ਸੀਮਿਤ ਕਰਦਾ ਹੈ। ਕੱਚਾ ਪਾਣੀ ਅਤੇ ਰਸਾਇਣਕ ਡੋਜ਼ਿੰਗ ਇਸ ਪੈਟਰਨ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦੇ।",
    ),
    candidates: [
      c("filter-bed-failure", l("A filter bed became clogged and stopped filtering effectively.", "एक फिल्टर बेड जाम हो गया और प्रभावी फिल्ट्रेशन बंद हो गया।", "ਇੱਕ ਫਿਲਟਰ ਬੈੱਡ ਜਾਮ ਹੋ ਗਿਆ ਅਤੇ ਪ੍ਰਭਾਵਸ਼ਾਲੀ ਫਿਲਟ੍ਰੇਸ਼ਨ ਬੰਦ ਹੋ ਗਈ।"), true),
      c("muddy-raw-water", l("A sudden muddy inflow increased raw-water turbidity.", "अचानक गंदा पानी आने से कच्चे पानी का धुंधलापन बढ़ गया।", "ਅਚਾਨਕ ਗੰਦਾ ਪਾਣੀ ਆਉਣ ਨਾਲ ਕੱਚੇ ਪਾਣੀ ਦਾ ਧੁੰਦਲਾਪਣ ਵੱਧ ਗਿਆ।"), false, "WRONG_SCOPE"),
      c("chemical-dose-error", l("The coagulant dose fell far below the required level.", "कोएगुलेंट की मात्रा जरूरत से बहुत कम हो गई।", "ਕੋਐਗੂਲੈਂਟ ਦੀ ਮਾਤਰਾ ਲੋੜ ਤੋਂ ਬਹੁਤ ਘੱਟ ਹੋ ਗਈ।"), false, "WRONG_SCOPE"),
      c("distribution-pipe", l("A downstream distribution pipe developed a leak.", "नीचे की वितरण पाइप में लीकेज हो गई।", "ਹੇਠਾਂ ਵਾਲੀ ਵੰਡ ਪਾਈਪ ਵਿੱਚ ਲੀਕ ਹੋ ਗਈ।"), false, "TEMPORAL_VIOLATION"),
    ],
  },
]);

const COPY: Record<CaeLocale, Readonly<{ observation: string; evidence: string; prompt: string }>> = {
  "en-IN": { observation: "Observation", evidence: "Evidence", prompt: "Which proposed cause best fits the evidence?" },
  "hi-IN": { observation: "अवलोकन", evidence: "साक्ष्य", prompt: "कौन-सा प्रस्तावित कारण दिए गए साक्ष्य से सबसे अच्छी तरह मेल खाता है?" },
  "pa-IN": { observation: "ਨਿਰੀਖਣ", evidence: "ਸਬੂਤ", prompt: "ਕਿਹੜਾ ਪ੍ਰਸਤਾਵਿਤ ਕਾਰਨ ਦਿੱਤੇ ਸਬੂਤ ਨਾਲ ਸਭ ਤੋਂ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮੇਲ ਖਾਂਦਾ ਹੈ?" },
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
  let state = mix32(seed ^ 0x5e005f17);
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = mix32(state + index);
    const swap = state % (index + 1);
    [result[index], result[swap]] = [result[swap]!, result[index]!];
  }
  return result;
}

function difficultyEvidence(scenario: Scenario): CaeDifficultyEvidence {
  const hard = scenario.difficulty === "HARD";
  return {
    causalDistance: 1,
    hiddenLinks: 1,
    topologyComplexity: 4,
    plausibleDistractors: hard ? 3 : 2,
    visibleEventCount: 2,
    inferenceBurden: hard ? 6 : 4,
    candidatePlausibilityBurden: hard ? 8 : 5,
    score: hard ? 21 : 15,
  };
}

export function generateCp005EvidenceFitQuestion(input: Readonly<{ locale: CaeLocale; seed: number }>): GeneratedCaeQuestion {
  const selectionSeed = mix32((input.seed >>> 0) ^ 0xc005ef17);
  const scenario = CP005_EVIDENCE_FIT_SCENARIOS[selectionSeed % CP005_EVIDENCE_FIT_SCENARIOS.length]!;
  const rendered: readonly CaeRenderedOption[] = shuffled(
    scenario.candidates.map((candidate) => ({
      id: candidate.id,
      text: candidate.text[input.locale],
      isCorrect: candidate.isCorrect,
      distractorRole: candidate.isCorrect ? undefined : candidate.mechanism,
    })),
    selectionSeed,
  );
  const correctIndex = rendered.findIndex((option) => option.isCorrect);
  const correct = scenario.candidates.find((candidate) => candidate.isCorrect);
  if (!correct || correctIndex < 0 || rendered.filter((option) => option.isCorrect).length !== 1) {
    throw new Error(`${scenario.id}: CP005 evidence-fit scenario requires exactly one correct cause.`);
  }

  const stateId = [
    "projection:CAE-PLAN-COMPETING",
    `family:${scenario.familyId}`,
    `variant:${scenario.id}`,
    `operation:${scenario.mode}`,
    "graph:COMPETING_EXPLANATIONS",
    "visible:observation,evidence",
  ].join("|");
  const itemVariantId = `${stateId}|profile:FOUR_WAY|presentation:${rendered.map((option) => option.id).join(">")}`;
  const copy = COPY[input.locale];

  return Object.freeze({
    chapterId: "CAE-001",
    checkpointId: "CAE-CP-005",
    qlId: "CAE-QL-005",
    projectionId: "CAE-PLAN-COMPETING",
    scenarioFamilyId: scenario.familyId,
    scenarioVariantId: scenario.id,
    causalStateId: stateId,
    itemVariantId,
    semanticInstanceId: itemVariantId,
    causalWorldId: `CAE-WORLD-${scenario.familyId}-${scenario.id}`,
    causalStructure: `COMPETING_EXPLANATIONS:${scenario.mode}`,
    locale: input.locale,
    seed: input.seed,
    difficulty: scenario.difficulty,
    difficultyEvidence: difficultyEvidence(scenario),
    questionProfile: "FOUR_WAY",
    visibleContext: {
      backdrop: null,
      visibleNodeIds: [`${scenario.id}:observation`, `${scenario.id}:evidence`],
      hiddenNodeIds: [correct.id],
    },
    stem: `${copy.observation}: ${scenario.observation[input.locale]}\n\n${copy.evidence}: ${scenario.evidence[input.locale]}\n\n${copy.prompt}`,
    options: rendered.map((option) => option.text),
    correctIndex,
    answerId: correct.id,
    explanation: scenario.explanation[input.locale],
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
