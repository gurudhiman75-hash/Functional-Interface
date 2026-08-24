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
  | "SSC_2X4"
  | "SSC_3X4"
  | "BANK_2X5"
  | "BANK_3X5"
  | "BANK_4X5"
  | "BANK_3X5_NEGATIVE"
  | "BANK_5X5"
  | "PUNJAB_2X4"
  | "PUNJAB_3X4";

export const STA_V4_QL_IDS = Object.freeze([
  "STA-QL-001",
  "STA-QL-002",
  "STA-QL-003",
  "STA-QL-004",
  "STA-QL-005",
  "STA-QL-006",
] as const satisfies readonly StaV4QlId[]);

export const STA_V4_PROFILE_IDS = Object.freeze([
  "SSC_2X4",
  "SSC_3X4",
  "BANK_2X5",
  "BANK_3X5",
  "BANK_4X5",
  "BANK_3X5_NEGATIVE",
  "BANK_5X5",
  "PUNJAB_2X4",
  "PUNJAB_3X4",
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
  "STA-QL-001": "STA-CP-001",
  "STA-QL-002": "STA-CP-001",
  "STA-QL-003": "STA-CP-002",
  "STA-QL-004": "STA-CP-002",
  "STA-QL-005": "STA-CP-003",
  "STA-QL-006": "STA-CP-004",
} satisfies Readonly<Record<StaV4QlId, StaV4CheckpointId>>);

type L = Readonly<{ en: string; hi: string; pa: string }>;
const l = (en: string, hi: string, pa: string): L => Object.freeze({ en, hi, pa });

interface Domain {
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

const DOMAINS: readonly Domain[] = [
  {
    id: "EXAM-CENTRE",
    sourceProfile: "SSC",
    actor: l("candidates", "अभ्यर्थियों", "ਉਮੀਦਵਾਰਾਂ"),
    task: l("entry verification", "प्रवेश सत्यापन", "ਦਾਖਲਾ ਤਸਦੀਕ"),
    channel: l("the QR verification desk", "क्यूआर सत्यापन डेस्क", "ਕਿਊਆਰ ਤਸਦੀਕ ਡੈਸਕ"),
    service: l("the examination-centre entry service", "परीक्षा-केंद्र प्रवेश सेवा", "ਪਰੀਖਿਆ ਕੇਂਦਰ ਦਾਖਲਾ ਸੇਵਾ"),
    issue: l("entry delays", "प्रवेश में देरी", "ਦਾਖਲੇ ਵਿੱਚ ਦੇਰੀ"),
    intervention: l("an additional verification desk", "एक अतिरिक्त सत्यापन डेस्क", "ਇੱਕ ਵਾਧੂ ਤਸਦੀਕ ਡੈਸਕ"),
    outcome: l("shorter entry time", "कम प्रवेश समय", "ਘੱਟ ਦਾਖਲਾ ਸਮਾਂ"),
    audience: l("exam candidates", "परीक्षा अभ्यर्थी", "ਪਰੀਖਿਆ ਉਮੀਦਵਾਰ"),
    benefit: l("quicker entry processing", "तेज़ प्रवेश प्रक्रिया", "ਤੇਜ਼ ਦਾਖਲਾ ਕਾਰਵਾਈ"),
    metric: l("average verification time", "औसत सत्यापन समय", "ਔਸਤ ਤਸਦੀਕ ਸਮਾਂ"),
    compareA: l("QR-assisted verification", "क्यूआर-सहायित सत्यापन", "ਕਿਊਆਰ-ਸਹਾਇਤ ਤਸਦੀਕ"),
    compareB: l("manual verification", "मैनुअल सत्यापन", "ਹੱਥੋਂ ਤਸਦੀਕ"),
    evidenceGroup: l("morning-shift candidates", "सुबह की पाली के अभ्यर्थी", "ਸਵੇਰ ਦੀ ਪਾਲੀ ਦੇ ਉਮੀਦਵਾਰ"),
  },
  {
    id: "BANK-SERVICE",
    sourceProfile: "BANKING",
    actor: l("customers", "ग्राहकों", "ਗਾਹਕਾਂ"),
    task: l("routine service requests", "नियमित सेवा अनुरोध", "ਰੋਜ਼ਮਰਰਾ ਸੇਵਾ ਬੇਨਤੀਆਂ"),
    channel: l("the mobile banking app", "मोबाइल बैंकिंग ऐप", "ਮੋਬਾਈਲ ਬੈਂਕਿੰਗ ਐਪ"),
    service: l("the branch service system", "शाखा सेवा प्रणाली", "ਸ਼ਾਖਾ ਸੇਵਾ ਪ੍ਰਣਾਲੀ"),
    issue: l("repeat counter visits", "बार-बार काउंटर पर जाना", "ਵਾਰ-ਵਾਰ ਕਾਊਂਟਰ ਤੇ ਜਾਣਾ"),
    intervention: l("a guided digital-help desk", "मार्गदर्शित डिजिटल सहायता डेस्क", "ਮਾਰਗਦਰਸ਼ਿਤ ਡਿਜ਼ਿਟਲ ਮਦਦ ਡੈਸਕ"),
    outcome: l("fewer repeat visits", "कम दोबारा विज़िट", "ਘੱਟ ਦੁਬਾਰਾ ਦੌਰੇ"),
    audience: l("branch customers", "शाखा ग्राहक", "ਸ਼ਾਖਾ ਗਾਹਕ"),
    benefit: l("faster routine service", "तेज़ नियमित सेवा", "ਤੇਜ਼ ਰੋਜ਼ਮਰਰਾ ਸੇਵਾ"),
    metric: l("average completion time", "औसत पूर्णता समय", "ਔਸਤ ਪੂਰਾ ਹੋਣ ਦਾ ਸਮਾਂ"),
    compareA: l("app-assisted service", "ऐप-सहायित सेवा", "ਐਪ-ਸਹਾਇਤ ਸੇਵਾ"),
    compareB: l("counter-only service", "केवल काउंटर सेवा", "ਕਾਊਂਟਰ-ਆਧਾਰਿਤ ਸੇਵਾ"),
    evidenceGroup: l("sampled branch customers", "नमूने में शामिल शाखा ग्राहक", "ਨਮੂਨੇ ਵਿੱਚ ਸ਼ਾਮਲ ਸ਼ਾਖਾ ਗਾਹਕ"),
  },
  {
    id: "DISTRICT-OFFICE",
    sourceProfile: "PUNJAB_STATE",
    actor: l("applicants", "आवेदकों", "ਅਰਜ਼ੀਦਾਰਾਂ"),
    task: l("certificate applications", "प्रमाण-पत्र आवेदन", "ਸਰਟੀਫਿਕੇਟ ਅਰਜ਼ੀਆਂ"),
    channel: l("the district online portal", "जिला ऑनलाइन पोर्टल", "ਜ਼ਿਲ੍ਹਾ ਆਨਲਾਈਨ ਪੋਰਟਲ"),
    service: l("the certificate service", "प्रमाण-पत्र सेवा", "ਸਰਟੀਫਿਕੇਟ ਸੇਵਾ"),
    issue: l("incomplete applications", "अधूरे आवेदन", "ਅਧੂਰੀਆਂ ਅਰਜ਼ੀਆਂ"),
    intervention: l("a pre-submission checklist", "जमा करने से पहले की चेकलिस्ट", "ਜਮ੍ਹਾਂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਦੀ ਚੈੱਕਲਿਸਟ"),
    outcome: l("fewer incomplete submissions", "कम अधूरे जमा आवेदन", "ਘੱਟ ਅਧੂਰੀਆਂ ਜਮ੍ਹਾਂ ਅਰਜ਼ੀਆਂ"),
    audience: l("certificate applicants", "प्रमाण-पत्र आवेदक", "ਸਰਟੀਫਿਕੇਟ ਅਰਜ਼ੀਦਾਰ"),
    benefit: l("simpler application handling", "सरल आवेदन प्रक्रिया", "ਸੌਖੀ ਅਰਜ਼ੀ ਕਾਰਵਾਈ"),
    metric: l("application completion rate", "आवेदन पूर्णता दर", "ਅਰਜ਼ੀ ਪੂਰਨਤਾ ਦਰ"),
    compareA: l("checklist-assisted applications", "चेकलिस्ट-सहायित आवेदन", "ਚੈੱਕਲਿਸਟ-ਸਹਾਇਤ ਅਰਜ਼ੀਆਂ"),
    compareB: l("standard applications", "सामान्य आवेदन", "ਸਧਾਰਣ ਅਰਜ਼ੀਆਂ"),
    evidenceGroup: l("sampled certificate applications", "नमूने के प्रमाण-पत्र आवेदन", "ਨਮੂਨੇ ਵਾਲੀਆਂ ਸਰਟੀਫਿਕੇਟ ਅਰਜ਼ੀਆਂ"),
  },
  {
    id: "WORKPLACE",
    sourceProfile: "CROSS_EXAM_DISCOVERY",
    actor: l("employees", "कर्मचारियों", "ਕਰਮਚਾਰੀਆਂ"),
    task: l("leave requests", "अवकाश अनुरोध", "ਛੁੱਟੀ ਬੇਨਤੀਆਂ"),
    channel: l("the HR portal", "एचआर पोर्टल", "ਐਚਆਰ ਪੋਰਟਲ"),
    service: l("the HR request system", "एचआर अनुरोध प्रणाली", "ਐਚਆਰ ਬੇਨਤੀ ਪ੍ਰਣਾਲੀ"),
    issue: l("processing delays", "प्रक्रिया में देरी", "ਕਾਰਵਾਈ ਵਿੱਚ ਦੇਰੀ"),
    intervention: l("automated document screening", "स्वचालित दस्तावेज़ जांच", "ਆਟੋਮੈਟਿਕ ਦਸਤਾਵੇਜ਼ ਜਾਂਚ"),
    outcome: l("quicker request processing", "तेज़ अनुरोध प्रक्रिया", "ਤੇਜ਼ ਬੇਨਤੀ ਕਾਰਵਾਈ"),
    audience: l("employees using HR services", "एचआर सेवाओं का उपयोग करने वाले कर्मचारी", "ਐਚਆਰ ਸੇਵਾਵਾਂ ਵਰਤਣ ਵਾਲੇ ਕਰਮਚਾਰੀ"),
    benefit: l("quicker approvals", "तेज़ अनुमोदन", "ਤੇਜ਼ ਮਨਜ਼ੂਰੀਆਂ"),
    metric: l("average processing days", "औसत प्रक्रिया दिन", "ਔਸਤ ਕਾਰਵਾਈ ਦਿਨ"),
    compareA: l("automated screening", "स्वचालित जांच", "ਆਟੋਮੈਟਿਕ ਜਾਂਚ"),
    compareB: l("manual screening", "मैनुअल जांच", "ਹੱਥੋਂ ਜਾਂਚ"),
    evidenceGroup: l("sampled leave requests", "नमूने के अवकाश अनुरोध", "ਨਮੂਨੇ ਵਾਲੀਆਂ ਛੁੱਟੀ ਬੇਨਤੀਆਂ"),
  },
  {
    id: "CLINIC",
    sourceProfile: "PUNJAB_STATE",
    actor: l("patients", "मरीजों", "ਮਰੀਜ਼ਾਂ"),
    task: l("appointment booking", "अपॉइंटमेंट बुकिंग", "ਮੁਲਾਕਾਤ ਬੁਕਿੰਗ"),
    channel: l("the clinic helpline", "क्लिनिक हेल्पलाइन", "ਕਲੀਨਿਕ ਹੈਲਪਲਾਈਨ"),
    service: l("the outpatient appointment service", "बाह्य-रोगी अपॉइंटमेंट सेवा", "ਬਾਹਰੀ ਮਰੀਜ਼ ਮੁਲਾਕਾਤ ਸੇਵਾ"),
    issue: l("missed appointments", "छूटी हुई अपॉइंटमेंट", "ਛੁੱਟੀਆਂ ਮੁਲਾਕਾਤਾਂ"),
    intervention: l("appointment reminder messages", "अपॉइंटमेंट याद-दिहानी संदेश", "ਮੁਲਾਕਾਤ ਯਾਦ-ਦਿਹਾਨੀ ਸੁਨੇਹੇ"),
    outcome: l("fewer missed appointments", "कम छूटी हुई अपॉइंटमेंट", "ਘੱਟ ਛੁੱਟੀਆਂ ਮੁਲਾਕਾਤਾਂ"),
    audience: l("clinic patients", "क्लिनिक मरीज", "ਕਲੀਨਿਕ ਮਰੀਜ਼"),
    benefit: l("timely appointment handling", "समय पर अपॉइंटमेंट प्रक्रिया", "ਸਮੇਂ ਸਿਰ ਮੁਲਾਕਾਤ ਕਾਰਵਾਈ"),
    metric: l("appointment attendance rate", "अपॉइंटमेंट उपस्थिति दर", "ਮੁਲਾਕਾਤ ਹਾਜ਼ਰੀ ਦਰ"),
    compareA: l("reminder-supported bookings", "याद-दिहानी वाले बुकिंग", "ਯਾਦ-ਦਿਹਾਨੀ ਵਾਲੀਆਂ ਬੁਕਿੰਗਾਂ"),
    compareB: l("standard bookings", "सामान्य बुकिंग", "ਸਧਾਰਣ ਬੁਕਿੰਗਾਂ"),
    evidenceGroup: l("sampled appointments", "नमूने की अपॉइंटमेंट", "ਨਮੂਨੇ ਵਾਲੀਆਂ ਮੁਲਾਕਾਤਾਂ"),
  },
  {
    id: "TRANSIT",
    sourceProfile: "SSC",
    actor: l("commuters", "यात्रियों", "ਯਾਤਰੀਆਂ"),
    task: l("travel-pass renewal", "यात्रा-पास नवीनीकरण", "ਯਾਤਰਾ-ਪਾਸ ਨਵੀਨੀਕਰਨ"),
    channel: l("the service kiosk", "सेवा कियोस्क", "ਸੇਵਾ ਕਿਓਸਕ"),
    service: l("the transit pass service", "ट्रांजिट पास सेवा", "ਆਵਾਜਾਈ ਪਾਸ ਸੇਵਾ"),
    issue: l("renewal queues", "नवीनीकरण कतारें", "ਨਵੀਨੀਕਰਨ ਕਤਾਰਾਂ"),
    intervention: l("a self-service renewal option", "स्व-सेवा नवीनीकरण विकल्प", "ਸਵੈ-ਸੇਵਾ ਨਵੀਨੀਕਰਨ ਵਿਕਲਪ"),
    outcome: l("shorter renewal queues", "छोटी नवीनीकरण कतारें", "ਛੋਟੀਆਂ ਨਵੀਨੀਕਰਨ ਕਤਾਰਾਂ"),
    audience: l("pass holders", "पास धारक", "ਪਾਸ ਧਾਰਕ"),
    benefit: l("faster pass renewal", "तेज़ पास नवीनीकरण", "ਤੇਜ਼ ਪਾਸ ਨਵੀਨੀਕਰਨ"),
    metric: l("average waiting time", "औसत प्रतीक्षा समय", "ਔਸਤ ਉਡੀਕ ਸਮਾਂ"),
    compareA: l("kiosk renewal", "कियोस्क नवीनीकरण", "ਕਿਓਸਕ ਨਵੀਨੀਕਰਨ"),
    compareB: l("counter renewal", "काउंटर नवीनीकरण", "ਕਾਊਂਟਰ ਨਵੀਨੀਕਰਨ"),
    evidenceGroup: l("sampled pass renewals", "नमूने के पास नवीनीकरण", "ਨਮੂਨੇ ਵਾਲੇ ਪਾਸ ਨਵੀਨੀਕਰਨ"),
  },
] as const;

interface CandidateAuthority {
  readonly id: string;
  readonly implicit: boolean;
  readonly textVariants: readonly [L, L];
  readonly rationale: L;
  readonly misconception: "REQUIRED_DEPENDENCY" | "SUPPORTIVE_NOT_NECESSARY" | "RELATED_BUT_IRRELEVANT" | "EXPLICIT_RESTATEMENT" | "REVERSE_DEPENDENCY" | "WRONG_SCOPE" | "WRONG_BASELINE";
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

function c(
  id: string,
  implicit: boolean,
  first: L,
  second: L,
  rationale: L,
  misconception: CandidateAuthority["misconception"],
): CandidateAuthority {
  return Object.freeze({ id, implicit, textVariants: [first, second], rationale, misconception });
}

const profileForMode = (mode: number): StaV4Difficulty => mode === 0 ? "Easy" : mode === 1 ? "Medium" : "Hard";
const s = (en: string, hi: string, pa: string): L => l(en, hi, pa);

function ql001(domain: Domain, mode: number): StaV4ScenarioAuthority {
  const statements: readonly [L, L, L] = [
    s(`Use ${domain.channel.en} for ${domain.task.en}.`, `${domain.task.hi} के लिए ${domain.channel.hi} का उपयोग करें।`, `${domain.task.pa} ਲਈ ${domain.channel.pa} ਵਰਤੋ।`),
    s(`${domain.actor.en} should route ${domain.task.en} through ${domain.channel.en}.`, `${domain.actor.hi} को ${domain.task.hi} ${domain.channel.hi} के माध्यम से करना चाहिए।`, `${domain.actor.pa} ਨੂੰ ${domain.task.pa} ${domain.channel.pa} ਰਾਹੀਂ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ।`),
    s(`For timely ${domain.task.en}, follow the route through ${domain.channel.en}.`, `समय पर ${domain.task.hi} के लिए ${domain.channel.hi} वाला मार्ग अपनाएँ।`, `ਸਮੇਂ ਸਿਰ ${domain.task.pa} ਲਈ ${domain.channel.pa} ਵਾਲਾ ਰਾਹ ਅਪਣਾਓ।`),
  ];
  return {
    scenarioId: `STA-V4-QL001-${domain.id}-${mode + 1}`,
    qlId: "STA-QL-001",
    checkpointId: "STA-CP-001",
    sourceProfile: domain.sourceProfile,
    evidenceClass: "CONTROLLED_EXAM_SYNTHESIS",
    officialVerbatim: false,
    difficulty: profileForMode(mode),
    statementVariants: [statements[mode], statements[(mode + 1) % 3], statements[(mode + 2) % 3]],
    candidates: [
      c("SERVICE_SUPPORTS_TASK", true,
        s(`${domain.channel.en} supports ${domain.task.en}.`, `${domain.channel.hi} ${domain.task.hi} को संभालने के लिए कार्यशील है।`, `${domain.channel.pa} ${domain.task.pa} ਨੂੰ ਸੰਭਾਲਣ ਲਈ ਕਾਰਗਰ ਹੈ।`),
        s(`${domain.task.en} is supported through ${domain.channel.en}.`, `${domain.task.hi} की प्रक्रिया ${domain.channel.hi} से समर्थित है।`, `${domain.task.pa} ਦੀ ਕਾਰਵਾਈ ${domain.channel.pa} ਰਾਹੀਂ ਸਮਰਥਿਤ ਹੈ।`),
        s("The named route has to perform the task for the instruction to work.", "निर्देश के काम करने के लिए बताए गए माध्यम को वही कार्य करना आवश्यक है।", "ਹਦਾਇਤ ਦੇ ਕਾਰਗਰ ਹੋਣ ਲਈ ਦੱਸਿਆ ਮਾਧਿਅਮ ਉਹ ਕੰਮ ਕਰਦਾ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ।"), "REQUIRED_DEPENDENCY"),
      c("ACTOR_HAS_ACCESS", true,
        s(`${domain.actor.en} have access to ${domain.channel.en}.`, `${domain.actor.hi} की ${domain.channel.hi} तक पहुँच है।`, `${domain.actor.pa} ਦੀ ${domain.channel.pa} ਤੱਕ ਪਹੁੰਚ ਹੈ।`),
        s(`${domain.channel.en} is accessible to ${domain.actor.en}.`, `${domain.channel.hi} ${domain.actor.hi} के लिए उपलब्ध है।`, `${domain.channel.pa} ${domain.actor.pa} ਲਈ ਉਪਲਬਧ ਹੈ।`),
        s("The named route must be reachable by the people being instructed.", "निर्देश पाने वाले लोगों की बताए गए माध्यम तक पहुँच आवश्यक है।", "ਹਦਾਇਤ ਲੈਣ ਵਾਲਿਆਂ ਦੀ ਦੱਸੇ ਮਾਧਿਅਮ ਤੱਕ ਪਹੁੰਚ ਲਾਜ਼ਮੀ ਹੈ।"), "REQUIRED_DEPENDENCY"),
      c("ROUTE_IS_CONVENIENT", false,
        s(`${domain.channel.en} is convenient for ${domain.actor.en}.`, `${domain.channel.hi} ${domain.actor.hi} के लिए सुविधाजनक है।`, `${domain.channel.pa} ${domain.actor.pa} ਲਈ ਸੁਵਿਧਾਜਨਕ ਹੈ।`),
        s(`${domain.actor.en} find the route through ${domain.channel.en} comfortable to use.`, `${domain.actor.hi} को ${domain.channel.hi} वाला तरीका सहज लगता है।`, `${domain.actor.pa} ਨੂੰ ${domain.channel.pa} ਵਾਲਾ ਤਰੀਕਾ ਸੁਖਾਲਾ ਲੱਗਦਾ ਹੈ।`),
        s("Convenience would support the instruction but is not required for feasibility.", "सुविधा निर्देश का समर्थन करती है, पर उसकी व्यवहार्यता के लिए आवश्यक नहीं है।", "ਸੁਵਿਧਾ ਹਦਾਇਤ ਨੂੰ ਸਮਰਥਨ ਦਿੰਦੀ ਹੈ, ਪਰ ਕਾਰਗਰਤਾ ਲਈ ਲਾਜ਼ਮੀ ਨਹੀਂ।"), "SUPPORTIVE_NOT_NECESSARY"),
      c("STAFF_FAMILIAR", false,
        s(`Staff working with ${domain.service.en} are familiar with this route.`, `${domain.service.hi} के कर्मचारी इस तरीके से परिचित हैं।`, `${domain.service.pa} ਦੇ ਕਰਮਚਾਰੀ ਇਸ ਤਰੀਕੇ ਨਾਲ ਜਾਣੂ ਹਨ।`),
        s(`The operating team is comfortable with the process used by ${domain.channel.en}.`, `संचालन दल ${domain.channel.hi} की प्रक्रिया से परिचित है।`, `ਚਲਾਉਣ ਵਾਲੀ ਟੀਮ ${domain.channel.pa} ਦੀ ਪ੍ਰਕਿਰਿਆ ਨਾਲ ਜਾਣੂ ਹੈ।`),
        s("Staff familiarity is useful background, not a logical requirement of the instruction.", "कर्मचारियों की परिचितता उपयोगी पृष्ठभूमि है, तार्किक आवश्यकता नहीं।", "ਕਰਮਚਾਰੀਆਂ ਦੀ ਜਾਣ-ਪਛਾਣ ਲਾਭਦਾਇਕ ਪਿਛੋਕੜ ਹੈ, ਤਾਰਕਿਕ ਲੋੜ ਨਹੀਂ।"), "RELATED_BUT_IRRELEVANT"),
      c("TASK_IS_SUBJECT", false,
        s(`The instruction concerns ${domain.task.en}.`, `निर्देश ${domain.task.hi} से संबंधित है।`, `ਹਦਾਇਤ ${domain.task.pa} ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ।`),
        s(`${domain.task.en} is the task named in the instruction.`, `${domain.task.hi} वही कार्य है जिसका निर्देश में उल्लेख है।`, `${domain.task.pa} ਉਹੀ ਕੰਮ ਹੈ ਜਿਸਦਾ ਹਦਾਇਤ ਵਿੱਚ ਜ਼ਿਕਰ ਹੈ।`),
        s("That information is already stated and is not an unstated assumption.", "यह बात पहले से कही गई है, इसलिए यह अप्रकट पूर्वधारणा नहीं है।", "ਇਹ ਗੱਲ ਪਹਿਲਾਂ ਹੀ ਕਹੀ ਗਈ ਹੈ, ਇਸ ਲਈ ਇਹ ਲੁਕਵੀਂ ਧਾਰਨਾ ਨਹੀਂ।"), "EXPLICIT_RESTATEMENT"),
    ],
  };
}

function ql002(domain: Domain, mode: number): StaV4ScenarioAuthority {
  const statements: readonly [L, L, L] = [
    s(`Introduce ${domain.intervention.en} to address ${domain.issue.en}.`, `${domain.issue.hi} से निपटने के लिए ${domain.intervention.hi} शुरू करें।`, `${domain.issue.pa} ਨਾਲ ਨਜਿੱਠਣ ਲਈ ${domain.intervention.pa} ਸ਼ੁਰੂ ਕਰੋ।`),
    s(`${domain.service.en} should adopt ${domain.intervention.en} for ${domain.outcome.en}.`, `${domain.service.hi} को ${domain.outcome.hi} के लिए ${domain.intervention.hi} अपनाना चाहिए।`, `${domain.service.pa} ਨੂੰ ${domain.outcome.pa} ਲਈ ${domain.intervention.pa} ਅਪਣਾਉਣਾ ਚਾਹੀਦਾ ਹੈ।`),
    s(`The proposed response to ${domain.issue.en} is ${domain.intervention.en}.`, `${domain.issue.hi} के लिए प्रस्तावित उपाय ${domain.intervention.hi} है।`, `${domain.issue.pa} ਲਈ ਪ੍ਰਸਤਾਵਿਤ ਕਦਮ ${domain.intervention.pa} ਹੈ।`),
  ];
  return {
    scenarioId: `STA-V4-QL002-${domain.id}-${mode + 1}`,
    qlId: "STA-QL-002",
    checkpointId: "STA-CP-001",
    sourceProfile: domain.sourceProfile,
    evidenceClass: "CONTROLLED_EXAM_SYNTHESIS",
    officialVerbatim: false,
    difficulty: profileForMode(mode),
    statementVariants: [statements[mode], statements[(mode + 1) % 3], statements[(mode + 2) % 3]],
    candidates: [
      c("ISSUE_REQUIRES_ATTENTION", true,
        s(`${domain.issue.en} requires attention in this setting.`, `इस व्यवस्था में ${domain.issue.hi} पर ध्यान देना आवश्यक है।`, `ਇਸ ਪ੍ਰਬੰਧ ਵਿੱਚ ${domain.issue.pa} ਵੱਲ ਧਿਆਨ ਦੇਣਾ ਲਾਜ਼ਮੀ ਹੈ।`),
        s(`${domain.issue.en} is relevant to the decision being made.`, `${domain.issue.hi} इस निर्णय के लिए प्रासंगिक है।`, `${domain.issue.pa} ਇਸ ਫੈਸਲੇ ਲਈ ਸਬੰਧਤ ਹੈ।`),
        s("A recommendation aimed at the issue presupposes that the issue is relevant enough to address.", "किसी समस्या पर लक्षित सुझाव उस समस्या की प्रासंगिकता मानकर चलता है।", "ਕਿਸੇ ਸਮੱਸਿਆ ਵੱਲ ਨਿਸ਼ਾਨਾ ਲਾਉਂਦੀ ਸਿਫ਼ਾਰਸ਼ ਉਸ ਸਮੱਸਿਆ ਦੀ ਸਬੰਧਤਾ ਮੰਨਦੀ ਹੈ।"), "REQUIRED_DEPENDENCY"),
      c("INTERVENTION_RELEVANT_TO_OUTCOME", true,
        s(`${domain.intervention.en} has a meaningful link to ${domain.outcome.en}.`, `${domain.intervention.hi} का ${domain.outcome.hi} से सार्थक संबंध है।`, `${domain.intervention.pa} ਦਾ ${domain.outcome.pa} ਨਾਲ ਅਰਥਪੂਰਨ ਸੰਬੰਧ ਹੈ।`),
        s(`${domain.outcome.en} is responsive to ${domain.intervention.en}.`, `${domain.outcome.hi} ${domain.intervention.hi} से प्रभावित होता है।`, `${domain.outcome.pa} ${domain.intervention.pa} ਨਾਲ ਪ੍ਰਭਾਵਿਤ ਹੁੰਦਾ ਹੈ।`),
        s("The proposal needs a plausible efficacy bridge between the action and the intended result.", "प्रस्ताव के लिए कार्रवाई और अपेक्षित परिणाम के बीच प्रभाव का संबंध आवश्यक है।", "ਪ੍ਰਸਤਾਵ ਲਈ ਕਦਮ ਅਤੇ ਉਮੀਦ ਕੀਤੇ ਨਤੀਜੇ ਵਿਚਕਾਰ ਪ੍ਰਭਾਵਕ ਸੰਬੰਧ ਲਾਜ਼ਮੀ ਹੈ।"), "REQUIRED_DEPENDENCY"),
      c("INTERVENTION_AFFORDABLE", false,
        s(`${domain.intervention.en} is reasonably economical to operate.`, `${domain.intervention.hi} का संचालन अपेक्षाकृत किफायती है।`, `${domain.intervention.pa} ਦਾ ਚਲਾਉਣਾ ਕਾਫ਼ੀ ਕਿਫ਼ਾਇਤੀ ਹੈ।`),
        s(`The operating cost of ${domain.intervention.en} is acceptable.`, `${domain.intervention.hi} की संचालन लागत स्वीकार्य है।`, `${domain.intervention.pa} ਦੀ ਚਲਾਉਣ ਲਾਗਤ ਕਬੂਲਯੋਗ ਹੈ।`),
        s("Cost may matter to implementation but the recommendation does not logically require this cost judgement.", "लागत लागू करने में उपयोगी हो सकती है, पर सुझाव के लिए यह लागत-निर्णय तार्किक रूप से आवश्यक नहीं।", "ਲਾਗਤ ਲਾਗੂ ਕਰਨ ਲਈ ਲਾਭਦਾਇਕ ਹੋ ਸਕਦੀ ਹੈ, ਪਰ ਸਿਫ਼ਾਰਸ਼ ਲਈ ਇਹ ਲਾਗਤ-ਫੈਸਲਾ ਤਾਰਕਿਕ ਲੋੜ ਨਹੀਂ।"), "SUPPORTIVE_NOT_NECESSARY"),
      c("USERS_PREFER_INTERVENTION", false,
        s(`${domain.audience.en} view ${domain.intervention.en} favourably.`, `${domain.audience.hi} ${domain.intervention.hi} को सकारात्मक रूप से देखते हैं।`, `${domain.audience.pa} ${domain.intervention.pa} ਨੂੰ ਚੰਗੇ ਤਰੀਕੇ ਨਾਲ ਵੇਖਦੇ ਹਨ।`),
        s(`${domain.intervention.en} is attractive to ${domain.audience.en}.`, `${domain.intervention.hi} ${domain.audience.hi} को आकर्षक लगता है।`, `${domain.intervention.pa} ${domain.audience.pa} ਨੂੰ ਆਕਰਸ਼ਕ ਲੱਗਦਾ ਹੈ।`),
        s("Audience preference could help adoption but is not the required reason for the recommendation.", "लोगों की पसंद अपनाने में मदद कर सकती है, पर सुझाव का आवश्यक आधार नहीं है।", "ਲੋਕਾਂ ਦੀ ਪਸੰਦ ਅਪਣਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦੀ ਹੈ, ਪਰ ਸਿਫ਼ਾਰਸ਼ ਦਾ ਲਾਜ਼ਮੀ ਆਧਾਰ ਨਹੀਂ।"), "RELATED_BUT_IRRELEVANT"),
      c("STAFF_KNOWS_METHOD", false,
        s(`The service team is familiar with ${domain.intervention.en}.`, `सेवा दल ${domain.intervention.hi} से परिचित है।`, `ਸੇਵਾ ਟੀਮ ${domain.intervention.pa} ਨਾਲ ਜਾਣੂ ਹੈ।`),
        s(`${domain.intervention.en} fits the team's existing routine.`, `${domain.intervention.hi} दल की मौजूदा दिनचर्या से मेल खाता है।`, `${domain.intervention.pa} ਟੀਮ ਦੀ ਮੌਜੂਦਾ ਰੁਟੀਨ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।`),
        s("Operational familiarity is helpful background rather than a necessary premise of the recommendation.", "संचालन की परिचितता सहायक पृष्ठभूमि है, आवश्यक पूर्वधारणा नहीं।", "ਚਲਾਉਣ ਦੀ ਜਾਣ-ਪਛਾਣ ਸਹਾਇਕ ਪਿਛੋਕੜ ਹੈ, ਲਾਜ਼ਮੀ ਧਾਰਨਾ ਨਹੀਂ।"), "SUPPORTIVE_NOT_NECESSARY"),
    ],
  };
}

function ql003(domain: Domain, mode: number): StaV4ScenarioAuthority {
  const statements: readonly [L, L, L] = [
    s(`Notice: ${domain.task.en} will be handled through ${domain.channel.en}.`, `सूचना: ${domain.task.hi} अब ${domain.channel.hi} के माध्यम से किया जाएगा।`, `ਸੂਚਨਾ: ${domain.task.pa} ਹੁਣ ${domain.channel.pa} ਰਾਹੀਂ ਕੀਤੀ ਜਾਵੇਗੀ।`),
    s(`${domain.service.en} directs ${domain.actor.en} to use ${domain.channel.en} for ${domain.task.en}.`, `${domain.service.hi} ${domain.actor.hi} को ${domain.task.hi} के लिए ${domain.channel.hi} उपयोग करने का निर्देश देती है।`, `${domain.service.pa} ${domain.actor.pa} ਨੂੰ ${domain.task.pa} ਲਈ ${domain.channel.pa} ਵਰਤਣ ਦੀ ਹਦਾਇਤ ਦਿੰਦੀ ਹੈ।`),
    s(`Under the revised service rule, ${domain.task.en} is routed through ${domain.channel.en}.`, `संशोधित सेवा नियम के तहत ${domain.task.hi} ${domain.channel.hi} से किया जाता है।`, `ਸੋਧੇ ਹੋਏ ਸੇਵਾ ਨਿਯਮ ਅਧੀਨ ${domain.task.pa} ${domain.channel.pa} ਰਾਹੀਂ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।`),
  ];
  return {
    scenarioId: `STA-V4-QL003-${domain.id}-${mode + 1}`,
    qlId: "STA-QL-003",
    checkpointId: "STA-CP-002",
    sourceProfile: domain.sourceProfile,
    evidenceClass: "CONTROLLED_EXAM_SYNTHESIS",
    officialVerbatim: false,
    difficulty: profileForMode(mode),
    statementVariants: [statements[mode], statements[(mode + 1) % 3], statements[(mode + 2) % 3]],
    candidates: [
      c("AUDIENCE_RELEVANT", true,
        s(`${domain.actor.en} are affected by the service direction.`, `${domain.actor.hi} इस सेवा निर्देश से प्रभावित हैं।`, `${domain.actor.pa} ਇਸ ਸੇਵਾ ਹਦਾਇਤ ਨਾਲ ਪ੍ਰਭਾਵਿਤ ਹਨ।`),
        s(`The direction is relevant to ${domain.actor.en} using ${domain.service.en}.`, `यह निर्देश ${domain.service.hi} का उपयोग करने वाले ${domain.actor.hi} से संबंधित है।`, `ਇਹ ਹਦਾਇਤ ${domain.service.pa} ਵਰਤਣ ਵਾਲੇ ${domain.actor.pa} ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ।`),
        s("A service direction presupposes a relevant audience to whom the rule applies.", "सेवा निर्देश उस संबंधित समूह को मानकर चलता है जिस पर नियम लागू होता है।", "ਸੇਵਾ ਹਦਾਇਤ ਉਸ ਸੰਬੰਧਤ ਸਮੂਹ ਨੂੰ ਮੰਨਦੀ ਹੈ ਜਿਸ ਉੱਤੇ ਨਿਯਮ ਲਾਗੂ ਹੁੰਦਾ ਹੈ।"), "REQUIRED_DEPENDENCY"),
      c("CHANNEL_OPERATIONAL", true,
        s(`${domain.channel.en} is operational for ${domain.task.en}.`, `${domain.channel.hi} ${domain.task.hi} के लिए कार्यशील है।`, `${domain.channel.pa} ${domain.task.pa} ਲਈ ਕਾਰਗਰ ਹੈ।`),
        s(`${domain.service.en} supports the directed process through ${domain.channel.en}.`, `${domain.service.hi} ${domain.channel.hi} वाली निर्देशित प्रक्रिया का समर्थन करती है।`, `${domain.service.pa} ${domain.channel.pa} ਵਾਲੀ ਦੱਸੀ ਪ੍ਰਕਿਰਿਆ ਨੂੰ ਸਮਰਥਨ ਦਿੰਦੀ ਹੈ।`),
        s("The directed response route must function for the notice to be actionable.", "सूचना पर अमल के लिए निर्देशित माध्यम का कार्यशील होना आवश्यक है।", "ਸੂਚਨਾ ਉੱਤੇ ਅਮਲ ਲਈ ਦੱਸਿਆ ਮਾਧਿਅਮ ਕਾਰਗਰ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ।"), "REQUIRED_DEPENDENCY"),
      c("CHANGE_POPULAR", false,
        s(`The revised route is viewed favourably by ${domain.actor.en}.`, `${domain.actor.hi} संशोधित तरीके को सकारात्मक रूप से देखते हैं।`, `${domain.actor.pa} ਸੋਧੇ ਤਰੀਕੇ ਨੂੰ ਚੰਗੇ ਤਰੀਕੇ ਨਾਲ ਵੇਖਦੇ ਹਨ।`),
        s(`${domain.actor.en} are comfortable with the revised service rule.`, `${domain.actor.hi} संशोधित सेवा नियम से सहज हैं।`, `${domain.actor.pa} ਸੋਧੇ ਸੇਵਾ ਨਿਯਮ ਨਾਲ ਸੁਖੀ ਹਨ।`),
        s("Approval of the rule is not required for the rule to be a valid direction.", "नियम की स्वीकृति उस निर्देश की तार्किक आवश्यकता नहीं है।", "ਨਿਯਮ ਦੀ ਪਸੰਦ ਉਸ ਹਦਾਇਤ ਦੀ ਤਾਰਕਿਕ ਲੋੜ ਨਹੀਂ।"), "SUPPORTIVE_NOT_NECESSARY"),
      c("WORKLOAD_EFFECT", false,
        s(`The revised route is expected to reduce staff workload.`, `संशोधित तरीका कर्मचारियों का कार्यभार घटाने के लिए उपयोगी माना जाता है।`, `ਸੋਧਿਆ ਤਰੀਕਾ ਕਰਮਚਾਰੀਆਂ ਦਾ ਕੰਮ-ਭਾਰ ਘਟਾਉਣ ਲਈ ਲਾਭਦਾਇਕ ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ।`),
        s(`Staff workload is connected with the new route.`, `कर्मचारियों का कार्यभार नए तरीके से जुड़ा हुआ है।`, `ਕਰਮਚਾਰੀਆਂ ਦਾ ਕੰਮ-ਭਾਰ ਨਵੇਂ ਤਰੀਕੇ ਨਾਲ ਜੁੜਿਆ ਹੋਇਆ ਹੈ।`),
        s("A workload effect might be a consequence but is not needed for the audience to follow the notice.", "कार्यभार पर असर परिणाम हो सकता है, पर सूचना का पालन करने के लिए आवश्यक नहीं।", "ਕੰਮ-ਭਾਰ ਉੱਤੇ ਅਸਰ ਨਤੀਜਾ ਹੋ ਸਕਦਾ ਹੈ, ਪਰ ਸੂਚਨਾ ਮੰਨਣ ਲਈ ਲਾਜ਼ਮੀ ਨਹੀਂ।"), "RELATED_BUT_IRRELEVANT"),
      c("RULE_RESTATED", false,
        s(`The notice changes how ${domain.task.en} is handled.`, `सूचना ${domain.task.hi} की प्रक्रिया बदलती है।`, `ਸੂਚਨਾ ${domain.task.pa} ਦੀ ਕਾਰਵਾਈ ਬਦਲਦੀ ਹੈ।`),
        s(`${domain.channel.en} is named in the revised direction.`, `संशोधित निर्देश में ${domain.channel.hi} का उल्लेख है।`, `ਸੋਧੀ ਹਦਾਇਤ ਵਿੱਚ ${domain.channel.pa} ਦਾ ਜ਼ਿਕਰ ਹੈ।`),
        s("This is explicit in the notice rather than an unstated premise.", "यह सूचना में स्पष्ट है, अप्रकट पूर्वधारणा नहीं।", "ਇਹ ਸੂਚਨਾ ਵਿੱਚ ਸਪਸ਼ਟ ਹੈ, ਲੁਕਵੀਂ ਧਾਰਨਾ ਨਹੀਂ।"), "EXPLICIT_RESTATEMENT"),
    ],
  };
}

function ql004(domain: Domain, mode: number): StaV4ScenarioAuthority {
  const statements: readonly [L, L, L] = [
    s(`After introducing ${domain.intervention.en}, the service expects ${domain.outcome.en}.`, `${domain.intervention.hi} शुरू करने के बाद सेवा ${domain.outcome.hi} की उम्मीद करती है।`, `${domain.intervention.pa} ਸ਼ੁਰੂ ਕਰਨ ਤੋਂ ਬਾਅਦ ਸੇਵਾ ${domain.outcome.pa} ਦੀ ਉਮੀਦ ਕਰਦੀ ਹੈ।`),
    s(`${domain.intervention.en} is projected to lead to ${domain.outcome.en}.`, `${domain.intervention.hi} से ${domain.outcome.hi} का अनुमान लगाया गया है।`, `${domain.intervention.pa} ਨਾਲ ${domain.outcome.pa} ਦਾ ਅਨੁਮਾਨ ਲਾਇਆ ਗਿਆ ਹੈ।`),
    s(`The service links ${domain.intervention.en} with ${domain.outcome.en}.`, `सेवा ${domain.intervention.hi} को ${domain.outcome.hi} से जोड़ती है।`, `ਸੇਵਾ ${domain.intervention.pa} ਨੂੰ ${domain.outcome.pa} ਨਾਲ ਜੋੜਦੀ ਹੈ।`),
  ];
  return {
    scenarioId: `STA-V4-QL004-${domain.id}-${mode + 1}`,
    qlId: "STA-QL-004",
    checkpointId: "STA-CP-002",
    sourceProfile: domain.sourceProfile,
    evidenceClass: "CONTROLLED_EXAM_SYNTHESIS",
    officialVerbatim: false,
    difficulty: profileForMode(mode),
    statementVariants: [statements[mode], statements[(mode + 1) % 3], statements[(mode + 2) % 3]],
    candidates: [
      c("CAUSAL_BRIDGE", true,
        s(`${domain.intervention.en} has a causal connection with ${domain.outcome.en}.`, `${domain.intervention.hi} का ${domain.outcome.hi} से कारणात्मक संबंध है।`, `${domain.intervention.pa} ਦਾ ${domain.outcome.pa} ਨਾਲ ਕਾਰਣਕ ਸੰਬੰਧ ਹੈ।`),
        s(`${domain.outcome.en} is responsive to the process changed by ${domain.intervention.en}.`, `${domain.outcome.hi} उस प्रक्रिया से प्रभावित होता है जिसे ${domain.intervention.hi} बदलता है।`, `${domain.outcome.pa} ਉਸ ਪ੍ਰਕਿਰਿਆ ਨਾਲ ਪ੍ਰਭਾਵਿਤ ਹੁੰਦਾ ਹੈ ਜਿਸਨੂੰ ${domain.intervention.pa} ਬਦਲਦਾ ਹੈ।`),
        s("Without a causal or efficacy bridge, the stated prediction loses its basis.", "कारण या प्रभाव का संबंध न हो तो कथित अनुमान का आधार टूट जाता है।", "ਕਾਰਣ ਜਾਂ ਪ੍ਰਭਾਵਕ ਸੰਬੰਧ ਨਾ ਹੋਵੇ ਤਾਂ ਦੱਸੇ ਅਨੁਮਾਨ ਦਾ ਆਧਾਰ ਟੁੱਟ ਜਾਂਦਾ ਹੈ।"), "REQUIRED_DEPENDENCY"),
      c("MEASURE_TRACKS_PROCESS", true,
        s(`${domain.outcome.en} reflects the process targeted by ${domain.intervention.en}.`, `${domain.outcome.hi} उस प्रक्रिया को दर्शाता है जिस पर ${domain.intervention.hi} काम करता है।`, `${domain.outcome.pa} ਉਸ ਪ੍ਰਕਿਰਿਆ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ ਜਿਸ ਉੱਤੇ ${domain.intervention.pa} ਕੰਮ ਕਰਦਾ ਹੈ।`),
        s(`The predicted result is relevant to the operational change.`, `अनुमानित परिणाम संचालन बदलाव से प्रासंगिक है।`, `ਅਨੁਮਾਨਿਤ ਨਤੀਜਾ ਚਲਾਉਣ ਵਾਲੇ ਬਦਲਾਅ ਨਾਲ ਸਬੰਧਤ ਹੈ।`),
        s("The predicted result has to be relevant to the mechanism being changed.", "अनुमानित परिणाम का बदली जा रही प्रक्रिया से प्रासंगिक होना आवश्यक है।", "ਅਨੁਮਾਨਿਤ ਨਤੀਜੇ ਦਾ ਬਦਲੀ ਜਾ ਰਹੀ ਪ੍ਰਕਿਰਿਆ ਨਾਲ ਸਬੰਧਤ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ।"), "REQUIRED_DEPENDENCY"),
      c("STAFF_SUPPORT", false,
        s(`The operating staff view ${domain.intervention.en} favourably.`, `संचालन कर्मचारी ${domain.intervention.hi} को सकारात्मक रूप से देखते हैं।`, `ਚਲਾਉਣ ਵਾਲਾ ਸਟਾਫ ${domain.intervention.pa} ਨੂੰ ਚੰਗੇ ਤਰੀਕੇ ਨਾਲ ਵੇਖਦਾ ਹੈ।`),
        s(`${domain.intervention.en} fits staff preferences.`, `${domain.intervention.hi} कर्मचारियों की पसंद से मेल खाता है।`, `${domain.intervention.pa} ਕਰਮਚਾਰੀਆਂ ਦੀ ਪਸੰਦ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।`),
        s("Staff preference is not necessary for the causal prediction to hold.", "कर्मचारियों की पसंद कारणात्मक अनुमान के लिए आवश्यक नहीं।", "ਕਰਮਚਾਰੀਆਂ ਦੀ ਪਸੰਦ ਕਾਰਣਕ ਅਨੁਮਾਨ ਲਈ ਲਾਜ਼ਮੀ ਨਹੀਂ।"), "RELATED_BUT_IRRELEVANT"),
      c("OUTCOME_PRIOR_TREND", false,
        s(`${domain.outcome.en} showed a favourable trend before the change.`, `बदलाव से पहले ${domain.outcome.hi} में सकारात्मक रुझान था।`, `ਬਦਲਾਅ ਤੋਂ ਪਹਿਲਾਂ ${domain.outcome.pa} ਵਿੱਚ ਚੰਗਾ ਰੁਝਾਨ ਸੀ।`),
        s(`Earlier observations were favourable for ${domain.outcome.en}.`, `${domain.outcome.hi} के पुराने अवलोकन सकारात्मक थे।`, `${domain.outcome.pa} ਬਾਰੇ ਪੁਰਾਣੇ ਨਿਰੀਖਣ ਚੰਗੇ ਸਨ।`),
        s("A previous trend is possible background but is not required by the stated causal claim.", "पुराना रुझान पृष्ठभूमि हो सकता है, पर कथित कारणात्मक दावे की आवश्यकता नहीं।", "ਪੁਰਾਣਾ ਰੁਝਾਨ ਪਿਛੋਕੜ ਹੋ ਸਕਦਾ ਹੈ, ਪਰ ਦੱਸੇ ਕਾਰਣਕ ਦਾਅਵੇ ਦੀ ਲੋੜ ਨਹੀਂ।"), "SUPPORTIVE_NOT_NECESSARY"),
      c("EASY_TO_MAINTAIN", false,
        s(`${domain.intervention.en} is easy for the service team to maintain.`, `${domain.intervention.hi} सेवा दल के लिए बनाए रखना सहज है।`, `${domain.intervention.pa} ਸੇਵਾ ਟੀਮ ਲਈ ਸੰਭਾਲਣਾ ਸੁਖਾਲਾ ਹੈ।`),
        s(`Maintaining ${domain.intervention.en} fits the service routine.`, `${domain.intervention.hi} का रख-रखाव सेवा की दिनचर्या से मेल खाता है।`, `${domain.intervention.pa} ਦੀ ਦੇਖਭਾਲ ਸੇਵਾ ਦੀ ਰੁਟੀਨ ਨਾਲ ਮੇਲ ਖਾਂਦੀ ਹੈ।`),
        s("Maintainability may affect implementation, not the logical bridge asserted by the prediction.", "रख-रखाव लागू करने पर असर डाल सकता है, कथित अनुमान की तार्किक कड़ी पर नहीं।", "ਦੇਖਭਾਲ ਲਾਗੂ ਕਰਨ ਉੱਤੇ ਅਸਰ ਪਾ ਸਕਦੀ ਹੈ, ਦੱਸੇ ਅਨੁਮਾਨ ਦੀ ਤਾਰਕਿਕ ਕੜੀ ਉੱਤੇ ਨਹੀਂ।"), "RELATED_BUT_IRRELEVANT"),
    ],
  };
}

function ql005(domain: Domain, mode: number): StaV4ScenarioAuthority {
  const statements: readonly [L, L, L] = [
    s(`Message to ${domain.audience.en}: choose ${domain.service.en} for ${domain.benefit.en}.`, `${domain.audience.hi} के लिए संदेश: ${domain.benefit.hi} के लिए ${domain.service.hi} चुनें।`, `${domain.audience.pa} ਲਈ ਸੁਨੇਹਾ: ${domain.benefit.pa} ਲਈ ${domain.service.pa} ਚੁਣੋ।`),
    s(`${domain.service.en} is promoted to ${domain.audience.en} by highlighting ${domain.benefit.en}.`, `${domain.service.hi} को ${domain.audience.hi} के सामने ${domain.benefit.hi} बताकर प्रचारित किया गया है।`, `${domain.service.pa} ਨੂੰ ${domain.audience.pa} ਅੱਗੇ ${domain.benefit.pa} ਦਰਸਾ ਕੇ ਪ੍ਰਚਾਰਿਆ ਗਿਆ ਹੈ।`),
    s(`An appeal asks ${domain.audience.en} to use ${domain.channel.en} for ${domain.benefit.en}.`, `एक अपील ${domain.audience.hi} से ${domain.benefit.hi} के लिए ${domain.channel.hi} उपयोग करने को कहती है।`, `ਇੱਕ ਅਪੀਲ ${domain.audience.pa} ਨੂੰ ${domain.benefit.pa} ਲਈ ${domain.channel.pa} ਵਰਤਣ ਲਈ ਕਹਿੰਦੀ ਹੈ।`),
  ];
  return {
    scenarioId: `STA-V4-QL005-${domain.id}-${mode + 1}`,
    qlId: "STA-QL-005",
    checkpointId: "STA-CP-003",
    sourceProfile: domain.sourceProfile,
    evidenceClass: "SOURCE_BACKED_SEMANTIC_SYNTHESIS",
    officialVerbatim: false,
    difficulty: profileForMode(mode),
    statementVariants: [statements[mode], statements[(mode + 1) % 3], statements[(mode + 2) % 3]],
    candidates: [
      c("RESPONSIVE_AUDIENCE_EXISTS", true,
        s(`A responsive audience exists for the highlighted benefit.`, `दिखाए गए लाभ के लिए प्रतिक्रिया देने वाला संबंधित समूह मौजूद है।`, `ਦੱਸੇ ਲਾਭ ਲਈ ਪ੍ਰਤੀਕਿਰਿਆ ਦੇਣ ਵਾਲਾ ਸੰਬੰਧਤ ਸਮੂਹ ਮੌਜੂਦ ਹੈ।`),
        s(`${domain.benefit.en} is relevant to the intended audience.`, `${domain.benefit.hi} लक्षित समूह के लिए प्रासंगिक है।`, `${domain.benefit.pa} ਨਿਸ਼ਾਨਾ ਸਮੂਹ ਲਈ ਸਬੰਧਤ ਹੈ।`),
        s("A persuasive message needs its highlighted benefit to matter to a relevant audience.", "प्रचार संदेश के लिए दिखाया गया लाभ संबंधित समूह के लिए मायने रखना आवश्यक है।", "ਪ੍ਰਚਾਰਕ ਸੁਨੇਹੇ ਲਈ ਦੱਸਿਆ ਲਾਭ ਸੰਬੰਧਤ ਸਮੂਹ ਲਈ ਮਾਇਨੇ ਰੱਖਣਾ ਲਾਜ਼ਮੀ ਹੈ।"), "REQUIRED_DEPENDENCY"),
      c("RESPONSE_ROUTE_RELEVANT", true,
        s(`${domain.channel.en} is a relevant response route for the promoted service.`, `${domain.channel.hi} प्रचारित सेवा के लिए उपयुक्त प्रतिक्रिया माध्यम है।`, `${domain.channel.pa} ਪ੍ਰਚਾਰਿਤ ਸੇਵਾ ਲਈ ਢੁੱਕਵਾਂ ਪ੍ਰਤੀਕਿਰਿਆ ਮਾਧਿਅਮ ਹੈ।`),
        s(`The promoted benefit is connected with using ${domain.service.en}.`, `प्रचारित लाभ ${domain.service.hi} के उपयोग से जुड़ा है।`, `ਪ੍ਰਚਾਰਿਤ ਲਾਭ ${domain.service.pa} ਦੀ ਵਰਤੋਂ ਨਾਲ ਜੁੜਿਆ ਹੈ।`),
        s("The requested response must connect meaningfully with the benefit being promoted.", "मांगी गई प्रतिक्रिया का प्रचारित लाभ से सार्थक संबंध आवश्यक है।", "ਮੰਗੀ ਪ੍ਰਤੀਕਿਰਿਆ ਦਾ ਪ੍ਰਚਾਰਿਤ ਲਾਭ ਨਾਲ ਅਰਥਪੂਰਨ ਸੰਬੰਧ ਲਾਜ਼ਮੀ ਹੈ।"), "REQUIRED_DEPENDENCY"),
      c("MESSAGE_MEMORABLE", false,
        s(`The message is memorable to ${domain.audience.en}.`, `संदेश ${domain.audience.hi} को याद रहने वाला लगता है।`, `ਸੁਨੇਹਾ ${domain.audience.pa} ਨੂੰ ਯਾਦ ਰਹਿਣ ਵਾਲਾ ਲੱਗਦਾ ਹੈ।`),
        s(`The wording of the promotion is engaging.`, `प्रचार की भाषा आकर्षक है।`, `ਪ੍ਰਚਾਰ ਦੀ ਭਾਸ਼ਾ ਦਿਲਚਸਪ ਹੈ।`),
        s("Memorability may improve persuasion but is not a required hidden premise.", "याद रहना प्रचार में मदद कर सकता है, पर आवश्यक अप्रकट पूर्वधारणा नहीं।", "ਯਾਦ ਰਹਿਣਾ ਪ੍ਰਚਾਰ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹੈ, ਪਰ ਲਾਜ਼ਮੀ ਲੁਕਵੀਂ ਧਾਰਨਾ ਨਹੀਂ।"), "SUPPORTIVE_NOT_NECESSARY"),
      c("COMPETITOR_SIMILARITY", false,
        s(`Other services offer a related benefit.`, `दूसरी सेवाएँ भी संबंधित लाभ देती हैं।`, `ਹੋਰ ਸੇਵਾਵਾਂ ਵੀ ਸਬੰਧਤ ਲਾਭ ਦਿੰਦੀਆਂ ਹਨ।`),
        s(`The promoted service has competitors in the same area.`, `प्रचारित सेवा के उसी क्षेत्र में प्रतिस्पर्धी हैं।`, `ਪ੍ਰਚਾਰਿਤ ਸੇਵਾ ਦੇ ਉਸੇ ਖੇਤਰ ਵਿੱਚ ਮੁਕਾਬਲੇਦਾਰ ਹਨ।`),
        s("Competitor conditions are not required for this message to seek a response.", "प्रतिक्रिया मांगने के लिए प्रतिस्पर्धियों की स्थिति आवश्यक नहीं।", "ਪ੍ਰਤੀਕਿਰਿਆ ਮੰਗਣ ਲਈ ਮੁਕਾਬਲੇਦਾਰਾਂ ਦੀ ਸਥਿਤੀ ਲਾਜ਼ਮੀ ਨਹੀਂ।"), "RELATED_BUT_IRRELEVANT"),
      c("CAMPAIGN_TIMING", false,
        s(`The campaign timing is convenient for the service team.`, `अभियान का समय सेवा दल के लिए सुविधाजनक है।`, `ਮੁਹਿੰਮ ਦਾ ਸਮਾਂ ਸੇਵਾ ਟੀਮ ਲਈ ਸੁਵਿਧਾਜਨਕ ਹੈ।`),
        s(`The promotion fits the team's operating schedule.`, `प्रचार दल की संचालन समय-सारणी से मेल खाता है।`, `ਪ੍ਰਚਾਰ ਟੀਮ ਦੇ ਚਲਾਉਣ ਸਮੇਂ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।`),
        s("Internal timing is not a necessary audience-response assumption.", "आंतरिक समय-सारणी दर्शक-प्रतिक्रिया की आवश्यक पूर्वधारणा नहीं।", "ਅੰਦਰੂਨੀ ਸਮਾਂ-ਸਾਰਣੀ ਦਰਸ਼ਕ-ਪ੍ਰਤੀਕਿਰਿਆ ਦੀ ਲਾਜ਼ਮੀ ਧਾਰਨਾ ਨਹੀਂ।"), "WRONG_SCOPE"),
    ],
  };
}

function ql006(domain: Domain, mode: number): StaV4ScenarioAuthority {
  const statements: readonly [L, L, L] = [
    s(`A report ranks ${domain.compareA.en} ahead of ${domain.compareB.en} using ${domain.metric.en}.`, `एक रिपोर्ट ${domain.metric.hi} के आधार पर ${domain.compareA.hi} को ${domain.compareB.hi} से आगे बताती है।`, `ਇੱਕ ਰਿਪੋਰਟ ${domain.metric.pa} ਦੇ ਆਧਾਰ ਤੇ ${domain.compareA.pa} ਨੂੰ ${domain.compareB.pa} ਤੋਂ ਅੱਗੇ ਦੱਸਦੀ ਹੈ।`),
    s(`Among ${domain.evidenceGroup.en}, ${domain.compareA.en} performed better than ${domain.compareB.en} on ${domain.metric.en}.`, `${domain.evidenceGroup.hi} में ${domain.metric.hi} पर ${domain.compareA.hi} का प्रदर्शन ${domain.compareB.hi} से बेहतर रहा।`, `${domain.evidenceGroup.pa} ਵਿੱਚ ${domain.metric.pa} ਉੱਤੇ ${domain.compareA.pa} ਦਾ ਪ੍ਰਦਰਸ਼ਨ ${domain.compareB.pa} ਤੋਂ ਚੰਗਾ ਰਿਹਾ।`),
    s(`The evidence uses ${domain.metric.en} to compare ${domain.compareA.en} with ${domain.compareB.en}.`, `प्रमाण ${domain.compareA.hi} और ${domain.compareB.hi} की तुलना के लिए ${domain.metric.hi} का उपयोग करता है।`, `ਸਬੂਤ ${domain.compareA.pa} ਅਤੇ ${domain.compareB.pa} ਦੀ ਤੁਲਨਾ ਲਈ ${domain.metric.pa} ਵਰਤਦਾ ਹੈ।`),
  ];
  return {
    scenarioId: `STA-V4-QL006-${domain.id}-${mode + 1}`,
    qlId: "STA-QL-006",
    checkpointId: "STA-CP-004",
    sourceProfile: domain.sourceProfile,
    evidenceClass: "SOURCE_BACKED_SEMANTIC_SYNTHESIS",
    officialVerbatim: false,
    difficulty: profileForMode(mode),
    statementVariants: [statements[mode], statements[(mode + 1) % 3], statements[(mode + 2) % 3]],
    candidates: [
      c("METRIC_RELEVANT", true,
        s(`${domain.metric.en} is relevant to the property being compared.`, `${domain.metric.hi} तुलना किए जा रहे गुण के लिए प्रासंगिक है।`, `${domain.metric.pa} ਤੁਲਨਾ ਕੀਤੀ ਜਾ ਰਹੀ ਵਿਸ਼ੇਸ਼ਤਾ ਲਈ ਸਬੰਧਤ ਹੈ।`),
        s(`The comparison claim is meaningfully represented by ${domain.metric.en}.`, `तुलना का दावा ${domain.metric.hi} से सार्थक रूप से व्यक्त होता है।`, `ਤੁਲਨਾ ਦਾ ਦਾਅਵਾ ${domain.metric.pa} ਨਾਲ ਅਰਥਪੂਰਨ ਤਰੀਕੇ ਨਾਲ ਦਰਸਾਇਆ ਜਾਂਦਾ ਹੈ।`),
        s("The chosen measure has to represent what the comparison claims to judge.", "चुना गया माप उसी गुण का प्रतिनिधित्व करना आवश्यक है जिसका दावा किया गया है।", "ਚੁਣਿਆ ਮਾਪ ਉਸੇ ਵਿਸ਼ੇਸ਼ਤਾ ਨੂੰ ਦਰਸਾਉਣਾ ਲਾਜ਼ਮੀ ਹੈ ਜਿਸਦਾ ਦਾਅਵਾ ਕੀਤਾ ਗਿਆ ਹੈ।"), "REQUIRED_DEPENDENCY"),
      c("COMPARABLE_BASIS", true,
        s(`${domain.compareA.en} and ${domain.compareB.en} are measured on a comparable basis.`, `${domain.compareA.hi} और ${domain.compareB.hi} को तुलनीय आधार पर मापा गया है।`, `${domain.compareA.pa} ਅਤੇ ${domain.compareB.pa} ਨੂੰ ਤੁਲਨਾਯੋਗ ਆਧਾਰ ਤੇ ਮਾਪਿਆ ਗਿਆ ਹੈ।`),
        s(`The measurement meaning is consistent across the compared groups.`, `तुलना किए गए समूहों में माप का अर्थ एकसमान है।`, `ਤੁਲਨਾ ਕੀਤੇ ਸਮੂਹਾਂ ਵਿੱਚ ਮਾਪ ਦਾ ਅਰਥ ਇਕਸਾਰ ਹੈ।`),
        s("A comparison loses validity if the two sides are not measured on a meaningfully comparable basis.", "यदि दोनों पक्ष तुलनीय आधार पर न मापे जाएँ तो तुलना की वैधता टूट जाती है।", "ਜੇ ਦੋਵੇਂ ਪਾਸੇ ਤੁਲਨਾਯੋਗ ਆਧਾਰ ਤੇ ਨਾ ਮਾਪੇ ਜਾਣ ਤਾਂ ਤੁਲਨਾ ਦੀ ਵੈਧਤਾ ਟੁੱਟ ਜਾਂਦੀ ਹੈ।"), "REQUIRED_DEPENDENCY"),
      c("DIFFERENCE_NOTICEABLE", false,
        s(`The measured difference is noticeable to service users.`, `मापा गया अंतर सेवा उपयोगकर्ताओं को दिखाई देता है।`, `ਮਾਪਿਆ ਫ਼ਰਕ ਸੇਵਾ ਵਰਤੋਂਕਾਰਾਂ ਨੂੰ ਦਿਖਾਈ ਦਿੰਦਾ ਹੈ।`),
        s(`Users are aware of the difference reported by the study.`, `उपयोगकर्ता रिपोर्ट किए गए अंतर से परिचित हैं।`, `ਵਰਤੋਂਕਾਰ ਰਿਪੋਰਟ ਕੀਤੇ ਫ਼ਰਕ ਨਾਲ ਜਾਣੂ ਹਨ।`),
        s("User awareness is not required for the comparison itself to be valid.", "तुलना की वैधता के लिए उपयोगकर्ताओं की जानकारी आवश्यक नहीं।", "ਤੁਲਨਾ ਦੀ ਵੈਧਤਾ ਲਈ ਵਰਤੋਂਕਾਰਾਂ ਦੀ ਜਾਣਕਾਰੀ ਲਾਜ਼ਮੀ ਨਹੀਂ।"), "RELATED_BUT_IRRELEVANT"),
      c("ANALYST_EXPECTATION", false,
        s(`The analysts expected this ranking before examining the data.`, `विश्लेषकों को डेटा देखने से पहले इसी क्रम की अपेक्षा थी।`, `ਵਿਸ਼ਲੇਸ਼ਕਾਂ ਨੂੰ ਡਾਟਾ ਵੇਖਣ ਤੋਂ ਪਹਿਲਾਂ ਇਸੇ ਕ੍ਰਮ ਦੀ ਉਮੀਦ ਸੀ।`),
        s(`The reported result matches the analysts' prior view.`, `रिपोर्ट किया गया परिणाम विश्लेषकों की पहले की राय से मेल खाता है।`, `ਰਿਪੋਰਟ ਕੀਤਾ ਨਤੀਜਾ ਵਿਸ਼ਲੇਸ਼ਕਾਂ ਦੀ ਪਹਿਲਾਂ ਵਾਲੀ ਰਾਏ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।`),
        s("Analyst expectation does not determine whether the evidence supports the comparison.", "विश्लेषकों की अपेक्षा यह तय नहीं करती कि प्रमाण तुलना का समर्थन करता है या नहीं।", "ਵਿਸ਼ਲੇਸ਼ਕਾਂ ਦੀ ਉਮੀਦ ਇਹ ਤੈਅ ਨਹੀਂ ਕਰਦੀ ਕਿ ਸਬੂਤ ਤੁਲਨਾ ਨੂੰ ਸਮਰਥਨ ਦਿੰਦਾ ਹੈ ਜਾਂ ਨਹੀਂ।"), "RELATED_BUT_IRRELEVANT"),
      c("COLLECTION_CONVENIENT", false,
        s(`Collecting the data fit the operating schedule.`, `डेटा संग्रह संचालन समय-सारणी के अनुकूल था।`, `ਡਾਟਾ ਇਕੱਠਾ ਕਰਨਾ ਚਲਾਉਣ ਸਮਾਂ-ਸਾਰਣੀ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਸੀ।`),
        s(`The evidence was convenient for the team to gather.`, `प्रमाण जुटाना दल के लिए सुविधाजनक था।`, `ਸਬੂਤ ਇਕੱਠਾ ਕਰਨਾ ਟੀਮ ਲਈ ਸੁਵਿਧਾਜਨਕ ਸੀ।`),
        s("Collection convenience is not a validity requirement for the stated comparison.", "संग्रह की सुविधा कथित तुलना की वैधता की आवश्यकता नहीं।", "ਇਕੱਠਾ ਕਰਨ ਦੀ ਸੁਵਿਧਾ ਦੱਸੀ ਤੁਲਨਾ ਦੀ ਵੈਧਤਾ ਦੀ ਲੋੜ ਨਹੀਂ।"), "WRONG_SCOPE"),
    ],
  };
}

const builders = [ql001, ql002, ql003, ql004, ql005, ql006] as const;
export const STA_V4_SCENARIOS: readonly StaV4ScenarioAuthority[] = Object.freeze(
  builders.flatMap((builder) => DOMAINS.flatMap((domain) => [0, 1, 2].map((mode) => builder(domain, mode)))),
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
  profileId,
  ...PROFILE_META[profileId],
  officialVerbatim: false as const,
  directPunjabPyqBacked: profileId === "PUNJAB_2X4",
})));

function hash32(input: string): number {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash >>> 0;
}

function choose<T>(values: readonly T[], seed: string): T {
  if (!values.length) throw new Error(`${seed}: empty choice pool`);
  return values[hash32(seed) % values.length]!;
}

function shuffle<T>(values: readonly T[], seed: string): T[] {
  const out = [...values];
  let state = hash32(seed) || 0x9e3779b9;
  const next = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x1_0000_0000;
  };
  for (let index = out.length - 1; index > 0; index -= 1) {
    const j = Math.floor(next() * (index + 1));
    [out[index], out[j]] = [out[j]!, out[index]!];
  }
  return out;
}

function languageFromLocale(locale: StaV4Locale): StaV4Language {
  if (locale === "hi-IN") return "hi";
  if (locale === "pa-IN") return "pa";
  return "en";
}

function localize(value: L, language: StaV4Language): string {
  return value[language];
}

function roman(index: number): string {
  return ["I", "II", "III", "IV", "V"][index] ?? String(index + 1);
}

function setKey(set: readonly number[]): string {
  return [...set].sort((a, b) => a - b).join(",");
}

function allSubsets(count: number): number[][] {
  const values: number[][] = [];
  for (let mask = 0; mask < (1 << count); mask += 1) {
    const set: number[] = [];
    for (let bit = 0; bit < count; bit += 1) if (mask & (1 << bit)) set.push(bit);
    values.push(set);
  }
  return values;
}

function hamming(a: readonly number[], b: readonly number[], count: number): number {
  const as = new Set(a);
  const bs = new Set(b);
  let score = 0;
  for (let index = 0; index < count; index += 1) if (as.has(index) !== bs.has(index)) score += 1;
  return score;
}

function answerText(set: readonly number[], count: number, language: StaV4Language): string {
  const labels = set.map(roman);
  const joined = labels.join(language === "en" ? " and " : language === "hi" ? " और " : " ਅਤੇ ");
  if (set.length === 0) {
    if (language === "hi") return "इनमें से कोई नहीं";
    if (language === "pa") return "ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕੋਈ ਨਹੀਂ";
    return "None of these";
  }
  if (set.length === count) {
    if (language === "hi") return "सभी कथन";
    if (language === "pa") return "ਸਾਰੀਆਂ ਧਾਰਨਾਵਾਂ";
    return "All assumptions";
  }
  if (language === "hi") return `केवल ${joined}`;
  if (language === "pa") return `ਕੇਵਲ ${joined}`;
  return `Only ${joined}`;
}

function instruction(language: StaV4Language, negative: boolean): string {
  if (negative) {
    if (language === "hi") return "दिए गए कथन के आधार पर बताइए कि कौन-सी पूर्वधारणाएँ निहित नहीं हैं।";
    if (language === "pa") return "ਦਿੱਤੇ ਕਥਨ ਦੇ ਆਧਾਰ ਤੇ ਦੱਸੋ ਕਿ ਕਿਹੜੀਆਂ ਧਾਰਨਾਵਾਂ ਨਿਹਿਤ ਨਹੀਂ ਹਨ।";
    return "Decide which of the following assumptions are not implicit in the statement.";
  }
  if (language === "hi") return "दिए गए कथन के आधार पर बताइए कि कौन-सी पूर्वधारणाएँ निहित हैं।";
  if (language === "pa") return "ਦਿੱਤੇ ਕਥਨ ਦੇ ਆਧਾਰ ਤੇ ਦੱਸੋ ਕਿ ਕਿਹੜੀਆਂ ਧਾਰਨਾਵਾਂ ਨਿਹਿਤ ਹਨ।";
  return "Decide which of the following assumptions are implicit in the statement.";
}

export interface StaV4RenderedCandidate {
  readonly label: string;
  readonly candidateId: string;
  readonly text: string;
  readonly classification: "IMPLICIT" | "NOT_IMPLICIT";
  readonly misconception: CandidateAuthority["misconception"];
}

export interface StaV4Option {
  readonly display: string;
  readonly semanticAnswerSet: readonly number[];
  readonly isCorrect: boolean;
}

export interface StaV4Question {
  readonly packageId: "STA-001";
  readonly chapterId: "REAS-STA";
  readonly runtimeVersion: "STA-001-EXAM-REALNESS-V4";
  readonly qlId: StaV4QlId;
  readonly checkpointId: StaV4CheckpointId;
  readonly presentationProfile: StaV4ProfileId;
  readonly scenarioId: string;
  readonly canonicalItemId: string;
  readonly contentFingerprint: string;
  readonly questionId: string;
  readonly questionLanguageId: string;
  readonly seed: string;
  readonly language: StaV4Language;
  readonly locale: StaV4Locale;
  readonly difficulty: StaV4Difficulty;
  readonly sourceProfile: StaV4SourceProfile;
  readonly evidenceClass: string;
  readonly instruction: string;
  readonly statement: string;
  readonly candidates: readonly StaV4RenderedCandidate[];
  readonly candidateCount: number;
  readonly options: readonly StaV4Option[];
  readonly optionCount: number;
  readonly answerIndex: number;
  readonly answerSet: readonly number[];
  readonly queryPolarity: "IMPLICIT" | "NOT_IMPLICIT";
  readonly explanation: string;
  readonly oracleParity: true;
}

function explanationFor(
  scenario: StaV4ScenarioAuthority,
  selected: readonly CandidateAuthority[],
  language: StaV4Language,
  negative: boolean,
  answerDisplay: string,
): string {
  const intro = language === "hi"
    ? "कथन को चलाने वाली आवश्यक कड़ी देखें; केवल संभव या सहायक बात को पूर्वधारणा न मानें।"
    : language === "pa"
      ? "ਕਥਨ ਨੂੰ ਚਲਾਉਣ ਵਾਲੀ ਲਾਜ਼ਮੀ ਕੜੀ ਵੇਖੋ; ਸਿਰਫ਼ ਸੰਭਵ ਜਾਂ ਸਹਾਇਕ ਗੱਲ ਨੂੰ ਧਾਰਨਾ ਨਾ ਮੰਨੋ।"
      : "Test the dependency the statement actually needs; a plausible or supportive fact is not enough.";
  const lines = selected.map((candidate, index) => {
    const classification = candidate.implicit ? "IMPLICIT" : "NOT_IMPLICIT";
    const label = roman(index);
    if (language === "hi") return `${label}: ${classification === "IMPLICIT" ? "निहित" : "निहित नहीं"} — ${localize(candidate.rationale, language)}`;
    if (language === "pa") return `${label}: ${classification === "IMPLICIT" ? "ਨਿਹਿਤ" : "ਨਿਹਿਤ ਨਹੀਂ"} — ${localize(candidate.rationale, language)}`;
    return `${label}: ${classification === "IMPLICIT" ? "implicit" : "not implicit"} — ${localize(candidate.rationale, language)}`;
  });
  const finish = language === "hi"
    ? `${negative ? "निहित नहीं वाली" : "निहित"} पूर्वधारणाओं के अनुसार सही विकल्प: ${answerDisplay}।`
    : language === "pa"
      ? `${negative ? "ਨਿਹਿਤ ਨਾ ਹੋਣ ਵਾਲੀਆਂ" : "ਨਿਹਿਤ"} ਧਾਰਨਾਵਾਂ ਅਨੁਸਾਰ ਸਹੀ ਚੋਣ: ${answerDisplay}।`
      : `Therefore the correct coded choice is ${answerDisplay}.`;
  return [intro, ...lines, finish].join("\n");
}

export function generateStaV4Question(input: Readonly<{
  seed: string;
  locale: StaV4Locale;
  profileId: StaV4ProfileId;
  qlId?: StaV4QlId;
}>): StaV4Question {
  const language = languageFromLocale(input.locale);
  const qlId = input.qlId ?? choose(STA_V4_QL_IDS, `${input.seed}:ql`);
  const pool = STA_V4_SCENARIOS_BY_QL[qlId];
  const scenario = choose(pool, `${input.seed}:${qlId}:scenario`);
  const profile = PROFILE_META[input.profileId];
  const statement = localize(choose(scenario.statementVariants, `${input.seed}:${scenario.scenarioId}:statement`), language);
  const selected = shuffle(scenario.candidates, `${input.seed}:${scenario.scenarioId}:candidate-order`).slice(0, profile.candidateCount);
  const renderedCandidates = selected.map((candidate, index) => ({
    label: roman(index),
    candidateId: candidate.id,
    text: localize(choose(candidate.textVariants, `${input.seed}:${scenario.scenarioId}:${candidate.id}:phrasing`), language),
    classification: candidate.implicit ? "IMPLICIT" as const : "NOT_IMPLICIT" as const,
    misconception: candidate.misconception,
  }));
  const answerSet = renderedCandidates.flatMap((candidate, index) => {
    const correct = profile.negative ? candidate.classification === "NOT_IMPLICIT" : candidate.classification === "IMPLICIT";
    return correct ? [index] : [];
  });
  const alternatives = allSubsets(profile.candidateCount)
    .filter((set) => setKey(set) !== setKey(answerSet))
    .sort((a, b) => hamming(a, answerSet, profile.candidateCount) - hamming(b, answerSet, profile.candidateCount) || setKey(a).localeCompare(setKey(b)));
  const distractors = shuffle(alternatives.slice(0, Math.max(8, profile.optionCount * 3)), `${input.seed}:option-distractors`).slice(0, profile.optionCount - 1);
  const optionSets = shuffle([answerSet, ...distractors], `${input.seed}:option-order`);
  const options = optionSets.map((set) => ({
    display: answerText(set, profile.candidateCount, language),
    semanticAnswerSet: [...set],
    isCorrect: setKey(set) === setKey(answerSet),
  }));
  const answerIndex = options.findIndex((option) => option.isCorrect);
  if (answerIndex < 0) throw new Error(`${input.seed}: missing correct option`);
  const semanticKey = [qlId, input.profileId, scenario.scenarioId, profile.negative ? "NEG" : "POS", ...selected.map((candidate) => candidate.id), setKey(answerSet)].join("|");
  const fingerprint = hash32(semanticKey).toString(16).padStart(8, "0");
  const canonicalItemId = `STA-V4:${fingerprint}`;
  const questionId = `${canonicalItemId}:${language}`;
  const answerDisplay = options[answerIndex]!.display;
  return {
    packageId: "STA-001",
    chapterId: "REAS-STA",
    runtimeVersion: "STA-001-EXAM-REALNESS-V4",
    qlId,
    checkpointId: scenario.checkpointId,
    presentationProfile: input.profileId,
    scenarioId: scenario.scenarioId,
    canonicalItemId,
    contentFingerprint: fingerprint,
    questionId,
    questionLanguageId: `${canonicalItemId}:${language}`,
    seed: input.seed,
    language,
    locale: input.locale,
    difficulty: scenario.difficulty,
    sourceProfile: scenario.sourceProfile,
    evidenceClass: `${scenario.evidenceClass}/${profile.evidenceClass}`,
    instruction: instruction(language, profile.negative),
    statement,
    candidates: renderedCandidates,
    candidateCount: profile.candidateCount,
    options,
    optionCount: profile.optionCount,
    answerIndex,
    answerSet,
    queryPolarity: profile.negative ? "NOT_IMPLICIT" : "IMPLICIT",
    explanation: explanationFor(scenario, selected, language, profile.negative, answerDisplay),
    oracleParity: true,
  };
}

export const STA_V4_CUE_PATTERNS: Readonly<Record<StaV4Language, readonly RegExp[]>> = Object.freeze({
  en: [/\ball\b/iu, /\bevery\b/iu, /\bnever\b/iu, /\balways\b/iu, /\bonly\b/iu, /\bbest\b/iu, /\bmost\b/iu, /\bcan\b/iu, /\bmay\b/iu, /\bsome\b/iu, /\bat least\b/iu, /\bnone\b/iu, /\bunable\b/iu, /\bimpossible\b/iu],
  hi: [/सभी/u, /हर/u, /कभी नहीं/u, /हमेशा/u, /केवल/u, /सबसे/u, /सक/u, /कुछ/u, /कोई नहीं/u, /असंभव/u],
  pa: [/ਸਾਰੇ/u, /ਹਰ/u, /ਕਦੇ ਨਹੀਂ/u, /ਹਮੇਸ਼ਾ/u, /ਕੇਵਲ/u, /ਸਭ ਤੋਂ/u, /ਸਕ/u, /ਕੁਝ/u, /ਕੋਈ ਨਹੀਂ/u, /ਅਸੰਭਵ/u],
});

export function staV4CueSignalCount(text: string, language: StaV4Language): number {
  return STA_V4_CUE_PATTERNS[language].reduce((count, pattern) => count + (pattern.test(text) ? 1 : 0), 0);
}

export function assertStaV4QuestionIntegrity(question: StaV4Question): void {
  if (!STA_V4_QL_IDS.includes(question.qlId)) throw new Error(`${question.questionId}: unknown QL`);
  if (!STA_V4_PROFILE_IDS.includes(question.presentationProfile)) throw new Error(`${question.questionId}: unknown profile`);
  if (question.candidates.length !== question.candidateCount) throw new Error(`${question.questionId}: candidate count drift`);
  if (question.options.length !== question.optionCount) throw new Error(`${question.questionId}: option count drift`);
  if (question.options.filter((option) => option.isCorrect).length !== 1) throw new Error(`${question.questionId}: non-unique correct option`);
  if (!question.options[question.answerIndex]?.isCorrect) throw new Error(`${question.questionId}: answer index drift`);
  if (setKey(question.options[question.answerIndex]!.semanticAnswerSet) !== setKey(question.answerSet)) throw new Error(`${question.questionId}: answer-set drift`);
  if (!question.statement.trim() || !question.explanation.trim()) throw new Error(`${question.questionId}: empty learner surface`);
}
