import type {
  CaeCandidateApplicability,
  CaeDistractorRole,
  CaeEditorialPlausibility,
  CaeMagnitude,
  CaeScenarioFamilyAuthority,
  CaeScope,
  CaeSemanticCandidateAuthority,
  LocalizedText,
} from "./types.ts";

const t = (en: string, hi: string, pa: string): LocalizedText => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa });
const app = (
  id: string,
  projection: CaeCandidateApplicability["applicableProjectionKinds"][number],
  target: string,
  reference: string,
  relation: CaeCandidateApplicability["eligibleRelations"][number],
  editorialPlausibility: CaeEditorialPlausibility,
): CaeCandidateApplicability => ({ id, applicableProjectionKinds: [projection], eligibleTargetSemanticSlots: [target], eligibleReferenceSemanticSlots: [reference], eligibleRelations: [relation], editorialPlausibility });

const causeApps = (id: string, credibility: CaeEditorialPlausibility): readonly CaeCandidateApplicability[] => [
  app(`${id}:pc:b`, "PROBABLE_CAUSE", "bridge", "cause", "CAUSE_OF_TARGET", credibility),
  app(`${id}:pc:e`, "PROBABLE_CAUSE", "effect", "bridge", "CAUSE_OF_TARGET", credibility),
  app(`${id}:pc:t`, "PROBABLE_CAUSE", "terminal", "effect", "CAUSE_OF_TARGET", credibility),
  app(`${id}:ce`, "COMPETING_EXPLANATION", "terminal", "cause", "CAUSE_OF_TARGET", credibility),
];

const bridgeApps = (id: string, credibility: CaeEditorialPlausibility): readonly CaeCandidateApplicability[] => [
  app(`${id}:m:e`, "MISSING_CAUSAL_LINK", "effect", "bridge", "BRIDGE_TO_TARGET", credibility),
  app(`${id}:m:t`, "MISSING_CAUSAL_LINK", "terminal", "effect", "BRIDGE_TO_TARGET", credibility),
];

const effectApps = (id: string, credibility: CaeEditorialPlausibility): readonly CaeCandidateApplicability[] => [
  app(`${id}:pe:c`, "PROBABLE_EFFECT", "cause", "bridge", "EFFECT_OF_TARGET", credibility),
  app(`${id}:pe:b`, "PROBABLE_EFFECT", "bridge", "effect", "EFFECT_OF_TARGET", credibility),
  app(`${id}:pe:e`, "PROBABLE_EFFECT", "effect", "terminal", "EFFECT_OF_TARGET", credibility),
];

const candidate = (
  id: string,
  text: LocalizedText,
  mechanism: CaeDistractorRole,
  temporalOrder: number,
  scope: CaeScope,
  magnitude: CaeMagnitude,
  severity: CaeMagnitude,
  applicability: readonly CaeCandidateApplicability[],
  rationale: string,
  causalDistance: number | null = null,
): CaeSemanticCandidateAuthority => ({ id, text, mechanism, temporalOrder, scope, magnitude, severity, causalDistance, applicability, editorialRationale: rationale });

const cause = (id: string, text: LocalizedText, mechanism: "WEAK_CAUSE" | "WRONG_SCOPE" | "REVERSE_CAUSATION", rationale: string): CaeSemanticCandidateAuthority => {
  const credibility: CaeEditorialPlausibility = mechanism === "REVERSE_CAUSATION" ? "CLEAR_REJECT" : "CREDIBLE_ALTERNATIVE";
  return candidate(id, text, mechanism, mechanism === "REVERSE_CAUSATION" ? 5 : 1, mechanism === "WRONG_SCOPE" ? "PERSON" : "SITE", mechanism === "WEAK_CAUSE" ? "LOW" : "MODERATE", mechanism === "WEAK_CAUSE" ? "LOW" : "MODERATE", causeApps(id, credibility), rationale);
};

const bridge = (id: string, text: LocalizedText, mechanism: "WEAK_CAUSE" | "WRONG_SCOPE" | "REVERSE_CAUSATION", rationale: string): CaeSemanticCandidateAuthority => {
  const credibility: CaeEditorialPlausibility = mechanism === "REVERSE_CAUSATION" ? "CLEAR_REJECT" : "CREDIBLE_ALTERNATIVE";
  return candidate(id, text, mechanism, mechanism === "REVERSE_CAUSATION" ? 5 : 2, mechanism === "WRONG_SCOPE" ? "PERSON" : "SITE", mechanism === "WEAK_CAUSE" ? "LOW" : "MODERATE", mechanism === "WEAK_CAUSE" ? "LOW" : "MODERATE", bridgeApps(id, credibility), rationale);
};

const effect = (id: string, text: LocalizedText, mechanism: "MAGNITUDE_MISMATCH" | "WRONG_SCOPE" | "REVERSE_CAUSATION", rationale: string): CaeSemanticCandidateAuthority => {
  const credibility: CaeEditorialPlausibility = mechanism === "REVERSE_CAUSATION" ? "CLEAR_REJECT" : "CREDIBLE_ALTERNATIVE";
  return candidate(id, text, mechanism, mechanism === "REVERSE_CAUSATION" ? 0 : 4, mechanism === "WRONG_SCOPE" ? "PERSON" : "SITE", mechanism === "MAGNITUDE_MISMATCH" ? "LOW" : "MODERATE", mechanism === "MAGNITUDE_MISMATCH" ? "LOW" : "MODERATE", effectApps(id, credibility), rationale);
};

type FamilyPool = Readonly<{
  causes: readonly CaeSemanticCandidateAuthority[];
  bridges: readonly CaeSemanticCandidateAuthority[];
  effects: readonly CaeSemanticCandidateAuthority[];
}>;

const POOLS: Readonly<Record<string, FamilyPool>> = {
  "CAE-FAM-POWER-GRID-CASCADE": {
    causes: [
      cause("sat-power-minor-flicker", t("A brief voltage dip affected only one shop.", "केवल एक दुकान में थोड़ी देर वोल्टेज गिरा।", "ਕੇਵਲ ਇੱਕ ਦੁਕਾਨ ਵਿੱਚ ਕੁਝ ਸਮੇਂ ਲਈ ਵੋਲਟੇਜ ਘੱਟਿਆ।"), "WEAK_CAUSE", "Real electrical disturbance, but too small to explain a wider grid outcome."),
      cause("sat-power-single-appliance", t("One consumer reported a faulty high-load appliance.", "एक उपभोक्ता ने अधिक लोड वाले खराब उपकरण की सूचना दी।", "ਇੱਕ ਖਪਤਕਾਰ ਨੇ ਵੱਧ ਲੋਡ ਵਾਲੇ ਖਰਾਬ ਉਪਕਰਣ ਦੀ ਸੂਚਨਾ ਦਿੱਤੀ।"), "WRONG_SCOPE", "Plausible electricity event with far narrower service scope."),
      cause("sat-power-repair-response", t("Repair crews arrived after supply complaints increased.", "आपूर्ति शिकायतें बढ़ने के बाद मरम्मत दल पहुँचा।", "ਸਪਲਾਈ ਸ਼ਿਕਾਇਤਾਂ ਵੱਧਣ ਤੋਂ ਬਾਅਦ ਮੁਰੰਮਤ ਟੀਮ ਪਹੁੰਚੀ।"), "REVERSE_CAUSATION", "Operational response occurs after the disruption."),
    ],
    bridges: [
      bridge("sat-power-local-switch", t("A small local switch was opened for a routine check.", "नियमित जांच के लिए एक छोटा स्थानीय स्विच खोला गया।", "ਰੁਟੀਨ ਜਾਂਚ ਲਈ ਇੱਕ ਛੋਟਾ ਸਥਾਨਕ ਸਵਿੱਚ ਖੋਲ੍ਹਿਆ ਗਿਆ।"), "WEAK_CAUSE", "A real switching event but too limited for the observed chain."),
      bridge("sat-power-one-premise", t("Protection operated at a single commercial premises.", "एक ही व्यावसायिक परिसर में सुरक्षा उपकरण चला।", "ਕੇਵਲ ਇੱਕ ਵਪਾਰਕ ਥਾਂ ਉੱਤੇ ਸੁਰੱਖਿਆ ਉਪਕਰਣ ਚੱਲਿਆ।"), "WRONG_SCOPE", "Electrical protection event at the wrong scope."),
      bridge("sat-power-restoration-note", t("A restoration notice was issued after the interruption.", "बाधा के बाद बहाली सूचना जारी की गई।", "ਰੁਕਾਵਟ ਤੋਂ ਬਾਅਦ ਬਹਾਲੀ ਸੂਚਨਾ ਜਾਰੀ ਕੀਤੀ ਗਈ।"), "REVERSE_CAUSATION", "Notice follows the outage and cannot bridge toward it."),
    ],
    effects: [
      effect("sat-power-one-lamp", t("One street lamp flickered briefly.", "एक स्ट्रीट लाइट थोड़ी देर झपकी।", "ਇੱਕ ਸਟ੍ਰੀਟ ਲਾਈਟ ਕੁਝ ਸਮੇਂ ਲਈ ਝਪਕੀ।"), "MAGNITUDE_MISMATCH", "A real electrical effect but too small for the target mechanism."),
      effect("sat-power-one-user", t("One household restarted its inverter.", "एक घर ने अपना इन्वर्टर दोबारा चालू किया।", "ਇੱਕ ਘਰ ਨੇ ਆਪਣਾ ਇਨਵਰਟਰ ਮੁੜ ਚਾਲੂ ਕੀਤਾ।"), "WRONG_SCOPE", "Downstream response limited to one user."),
      effect("sat-power-prior-check", t("Technicians checked the feeder before the disruption began.", "बाधा शुरू होने से पहले तकनीशियनों ने फीडर जांचा।", "ਰੁਕਾਵਟ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਤਕਨੀਸ਼ੀਅਨਾਂ ਨੇ ਫੀਡਰ ਜਾਂਚਿਆ।"), "REVERSE_CAUSATION", "Occurs before the target event and cannot be its effect."),
    ],
  },
  "CAE-FAM-TELECOM-NETWORK": {
    causes: [
      cause("sat-tel-one-handset", t("One subscriber's handset briefly lost signal.", "एक ग्राहक के फोन का सिग्नल थोड़ी देर गया।", "ਇੱਕ ਗਾਹਕ ਦੇ ਫ਼ੋਨ ਦਾ ਸਿਗਨਲ ਕੁਝ ਸਮੇਂ ਲਈ ਗਿਆ।"), "WEAK_CAUSE", "Too small to explain a network-wide service outcome."),
      cause("sat-tel-single-building", t("A router failed inside one office building.", "एक कार्यालय भवन का राउटर खराब हुआ।", "ਇੱਕ ਦਫ਼ਤਰੀ ਇਮਾਰਤ ਦਾ ਰਾਊਟਰ ਖਰਾਬ ਹੋਇਆ।"), "WRONG_SCOPE", "Plausible communications fault at a much narrower scope."),
      cause("sat-tel-support-response", t("Extra support agents logged in after complaints increased.", "शिकायतें बढ़ने के बाद अतिरिक्त सहायता एजेंट लॉग इन हुए।", "ਸ਼ਿਕਾਇਤਾਂ ਵੱਧਣ ਤੋਂ ਬਾਅਦ ਵਾਧੂ ਸਹਾਇਤਾ ਏਜੰਟ ਲਾਗ ਇਨ ਹੋਏ।"), "REVERSE_CAUSATION", "Support response follows the service problem."),
    ],
    bridges: [
      bridge("sat-tel-minor-sector", t("One low-traffic cell sector was taken down for a short check.", "कम ट्रैफिक वाले एक सेल सेक्टर को छोटी जांच के लिए बंद किया गया।", "ਘੱਟ ਟ੍ਰੈਫਿਕ ਵਾਲੇ ਇੱਕ ਸੈੱਲ ਸੈਕਟਰ ਨੂੰ ਛੋਟੀ ਜਾਂਚ ਲਈ ਬੰਦ ਕੀਤਾ ਗਿਆ।"), "WEAK_CAUSE", "Real network action but too small for the wider chain."),
      bridge("sat-tel-one-floor", t("Internal Wi-Fi failed on one office floor.", "एक कार्यालय की एक मंजिल पर आंतरिक वाई-फाई बंद हुआ।", "ਇੱਕ ਦਫ਼ਤਰ ਦੀ ਇੱਕ ਮੰਜ਼ਿਲ ਉੱਤੇ ਅੰਦਰੂਨੀ ਵਾਈ-ਫਾਈ ਬੰਦ ਹੋਇਆ।"), "WRONG_SCOPE", "Connectivity event outside the affected network scope."),
      bridge("sat-tel-outage-message", t("The operator sent an outage message after service slowed.", "सेवा धीमी होने के बाद ऑपरेटर ने बाधा संदेश भेजा।", "ਸੇਵਾ ਹੌਲੀ ਹੋਣ ਤੋਂ ਬਾਅਦ ਓਪਰੇਟਰ ਨੇ ਰੁਕਾਵਟ ਸੁਨੇਹਾ ਭੇਜਿਆ।"), "REVERSE_CAUSATION", "Notification is a response, not a causal bridge."),
    ],
    effects: [
      effect("sat-tel-one-download", t("One user reported a slow file download.", "एक उपयोगकर्ता ने धीमे फाइल डाउनलोड की सूचना दी।", "ਇੱਕ ਵਰਤੋਂਕਾਰ ਨੇ ਹੌਲੀ ਫਾਈਲ ਡਾਊਨਲੋਡ ਦੀ ਸੂਚਨਾ ਦਿੱਤੀ।"), "MAGNITUDE_MISMATCH", "Too small to match a broad telecom outcome."),
      effect("sat-tel-one-desk", t("A single office desk switched to mobile hotspot use.", "एक कार्यालय डेस्क ने मोबाइल हॉटस्पॉट उपयोग किया।", "ਇੱਕ ਦਫ਼ਤਰੀ ਡੈਸਕ ਨੇ ਮੋਬਾਈਲ ਹਾਟਸਪਾਟ ਵਰਤਿਆ।"), "WRONG_SCOPE", "Local workaround at only one point."),
      effect("sat-tel-before-fault", t("A routine speed test was completed before the fault began.", "खराबी शुरू होने से पहले नियमित गति परीक्षण पूरा हुआ।", "ਖਰਾਬੀ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਰੁਟੀਨ ਗਤੀ ਟੈਸਟ ਪੂਰਾ ਹੋਇਆ।"), "REVERSE_CAUSATION", "Precedes the target and cannot be its effect."),
    ],
  },
  "CAE-FAM-EXAM-ADMINISTRATION": {
    causes: [
      cause("sat-exam-one-query", t("One candidate asked for a correction at the help desk.", "एक उम्मीदवार ने सहायता डेस्क पर सुधार पूछा।", "ਇੱਕ ਉਮੀਦਵਾਰ ਨੇ ਸਹਾਇਤਾ ਡੈਸਕ ਉੱਤੇ ਸੋਧ ਬਾਰੇ ਪੁੱਛਿਆ।"), "WEAK_CAUSE", "Real examination issue but too small for a centre-level disruption."),
      cause("sat-exam-one-room", t("A clock stopped working in one examination room.", "एक परीक्षा कक्ष की घड़ी बंद हो गई।", "ਇੱਕ ਪਰੀਖਿਆ ਕਮਰੇ ਦੀ ਘੜੀ ਬੰਦ ਹੋ ਗਈ।"), "WRONG_SCOPE", "Exam-centre event with insufficient scope."),
      cause("sat-exam-help-response", t("Additional staff were sent after candidate queues grew.", "उम्मीदवारों की कतार बढ़ने के बाद अतिरिक्त कर्मचारी भेजे गए।", "ਉਮੀਦਵਾਰਾਂ ਦੀ ਕਤਾਰ ਵੱਧਣ ਤੋਂ ਬਾਅਦ ਵਾਧੂ ਸਟਾਫ ਭੇਜਿਆ ਗਿਆ।"), "REVERSE_CAUSATION", "Staff response follows the disruption."),
    ],
    bridges: [
      bridge("sat-exam-one-document", t("One candidate's identity document required a second check.", "एक उम्मीदवार के पहचान दस्तावेज की दूसरी जांच करनी पड़ी।", "ਇੱਕ ਉਮੀਦਵਾਰ ਦੇ ਪਛਾਣ ਦਸਤਾਵੇਜ਼ ਦੀ ਦੂਜੀ ਜਾਂਚ ਕਰਨੀ ਪਈ।"), "WEAK_CAUSE", "Plausible verification delay but too limited for a broad chain."),
      bridge("sat-exam-single-desk", t("One registration desk changed its seating arrangement.", "एक पंजीकरण डेस्क ने बैठने की व्यवस्था बदली।", "ਇੱਕ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਡੈਸਕ ਨੇ ਬੈਠਣ ਦੀ ਵਿਵਸਥਾ ਬਦਲੀ।"), "WRONG_SCOPE", "Operational change at only one desk."),
      bridge("sat-exam-delay-notice", t("A delay notice was displayed after entry slowed.", "प्रवेश धीमा होने के बाद देरी की सूचना लगाई गई।", "ਦਾਖਲਾ ਹੌਲਾ ਹੋਣ ਤੋਂ ਬਾਅਦ ਦੇਰੀ ਦੀ ਸੂਚਨਾ ਲਗਾਈ ਗਈ।"), "REVERSE_CAUSATION", "Notice follows the observed delay."),
    ],
    effects: [
      effect("sat-exam-one-candidate", t("One candidate changed seats before the paper began.", "एक उम्मीदवार ने पेपर से पहले सीट बदली।", "ਇੱਕ ਉਮੀਦਵਾਰ ਨੇ ਪੇਪਰ ਤੋਂ ਪਹਿਲਾਂ ਸੀਟ ਬਦਲੀ।"), "MAGNITUDE_MISMATCH", "Too small to match a centre-level consequence."),
      effect("sat-exam-one-room-effect", t("One room requested an extra attendance sheet.", "एक कक्ष ने अतिरिक्त उपस्थिति पत्र मांगा।", "ਇੱਕ ਕਮਰੇ ਨੇ ਵਾਧੂ ਹਾਜ਼ਰੀ ਸ਼ੀਟ ਮੰਗੀ।"), "WRONG_SCOPE", "A narrow administrative event unrelated to wider impact."),
      effect("sat-exam-precheck", t("The centre completed its routine room check before candidates arrived.", "उम्मीदवारों के आने से पहले केंद्र ने नियमित कक्ष जांच पूरी की।", "ਉਮੀਦਵਾਰਾਂ ਦੇ ਆਉਣ ਤੋਂ ਪਹਿਲਾਂ ਕੇਂਦਰ ਨੇ ਰੁਟੀਨ ਕਮਰਾ ਜਾਂਚ ਪੂਰੀ ਕੀਤੀ।"), "REVERSE_CAUSATION", "Occurs before the target causal event."),
    ],
  },
  "CAE-FAM-MANUFACTURING-FLOW": {
    causes: [
      cause("sat-mfg-one-tool", t("One hand tool required replacement at a workstation.", "एक कार्यस्थल पर एक हाथ उपकरण बदलना पड़ा।", "ਇੱਕ ਵਰਕਸਟੇਸ਼ਨ ਉੱਤੇ ਇੱਕ ਹੱਥੀ ਸੰਦ ਬਦਲਣਾ ਪਿਆ।"), "WEAK_CAUSE", "Real production issue but too limited for line-wide effects."),
      cause("sat-mfg-single-bin", t("One material bin was labelled incorrectly.", "एक सामग्री बिन पर गलत लेबल लगा था।", "ਇੱਕ ਸਮੱਗਰੀ ਬਿਨ ਉੱਤੇ ਗਲਤ ਲੇਬਲ ਲੱਗਾ ਸੀ।"), "WRONG_SCOPE", "Narrow factory issue with insufficient production scope."),
      cause("sat-mfg-supervisor-response", t("A supervisor reassigned workers after output fell.", "उत्पादन घटने के बाद पर्यवेक्षक ने कर्मचारियों को दोबारा लगाया।", "ਉਤਪਾਦਨ ਘਟਣ ਤੋਂ ਬਾਅਦ ਸੁਪਰਵਾਈਜ਼ਰ ਨੇ ਕਰਮਚਾਰੀਆਂ ਨੂੰ ਮੁੜ ਲਾਇਆ।"), "REVERSE_CAUSATION", "Management response follows the output problem."),
    ],
    bridges: [
      bridge("sat-mfg-short-check", t("One workstation paused briefly for a routine check.", "एक कार्यस्थल नियमित जांच के लिए थोड़ी देर रुका।", "ਇੱਕ ਵਰਕਸਟੇਸ਼ਨ ਰੁਟੀਨ ਜਾਂਚ ਲਈ ਕੁਝ ਸਮੇਂ ਰੁਕਿਆ।"), "WEAK_CAUSE", "Too small to bridge a plant-level disruption."),
      bridge("sat-mfg-one-cart", t("One material cart took a longer internal route.", "एक सामग्री गाड़ी ने लंबा आंतरिक मार्ग लिया।", "ਇੱਕ ਸਮੱਗਰੀ ਕਾਰਟ ਨੇ ਲੰਮਾ ਅੰਦਰੂਨੀ ਰਸਤਾ ਲਿਆ।"), "WRONG_SCOPE", "Local movement issue at insufficient scale."),
      bridge("sat-mfg-recovery-note", t("A recovery plan was issued after production slowed.", "उत्पादन धीमा होने के बाद बहाली योजना जारी हुई।", "ਉਤਪਾਦਨ ਹੌਲਾ ਹੋਣ ਤੋਂ ਬਾਅਦ ਬਹਾਲੀ ਯੋਜਨਾ ਜਾਰੀ ਹੋਈ।"), "REVERSE_CAUSATION", "Recovery action follows the causal chain."),
    ],
    effects: [
      effect("sat-mfg-one-carton", t("One finished carton required repacking.", "एक तैयार कार्टन को दोबारा पैक करना पड़ा।", "ਇੱਕ ਤਿਆਰ ਕਾਰਟਨ ਨੂੰ ਮੁੜ ਪੈਕ ਕਰਨਾ ਪਿਆ।"), "MAGNITUDE_MISMATCH", "Real downstream issue at too small a magnitude."),
      effect("sat-mfg-one-order", t("One small order was moved to a later truck.", "एक छोटा आदेश बाद वाले ट्रक में भेजा गया।", "ਇੱਕ ਛੋਟਾ ਆਰਡਰ ਬਾਅਦ ਵਾਲੇ ਟਰੱਕ ਵਿੱਚ ਭੇਜਿਆ ਗਿਆ।"), "WRONG_SCOPE", "Single-order consequence with insufficient scope."),
      effect("sat-mfg-prestart-check", t("A routine safety check finished before the shift began.", "पाली शुरू होने से पहले नियमित सुरक्षा जांच पूरी हुई।", "ਪਾਲੀ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਰੁਟੀਨ ਸੁਰੱਖਿਆ ਜਾਂਚ ਪੂਰੀ ਹੋਈ।"), "REVERSE_CAUSATION", "Precedes the target event."),
    ],
  },
  "CAE-FAM-HEALTHCARE-OPERATIONS": {
    causes: [
      cause("sat-health-one-file", t("One patient's paper file was briefly misplaced.", "एक मरीज की कागजी फाइल थोड़ी देर के लिए नहीं मिली।", "ਇੱਕ ਮਰੀਜ਼ ਦੀ ਕਾਗਜ਼ੀ ਫਾਈਲ ਕੁਝ ਸਮੇਂ ਲਈ ਨਹੀਂ ਮਿਲੀ।"), "WEAK_CAUSE", "Real hospital delay but too small for a department-level outcome."),
      cause("sat-health-single-room", t("A monitor required replacement in one consultation room.", "एक परामर्श कक्ष में मॉनिटर बदलना पड़ा।", "ਇੱਕ ਸਲਾਹ ਕਮਰੇ ਵਿੱਚ ਮਾਨੀਟਰ ਬਦਲਣਾ ਪਿਆ।"), "WRONG_SCOPE", "Clinical equipment issue at only one room."),
      cause("sat-health-extra-staff", t("Extra staff were called after the waiting area became crowded.", "प्रतीक्षा क्षेत्र में भीड़ बढ़ने के बाद अतिरिक्त कर्मचारी बुलाए गए।", "ਉਡੀਕ ਖੇਤਰ ਵਿੱਚ ਭੀੜ ਵੱਧਣ ਤੋਂ ਬਾਅਦ ਵਾਧੂ ਸਟਾਫ ਬੁਲਾਇਆ ਗਿਆ।"), "REVERSE_CAUSATION", "Response follows the service pressure."),
    ],
    bridges: [
      bridge("sat-health-one-recheck", t("One sample required a routine second check.", "एक नमूने की नियमित दूसरी जांच करनी पड़ी।", "ਇੱਕ ਨਮੂਨੇ ਦੀ ਰੁਟੀਨ ਦੂਜੀ ਜਾਂਚ ਕਰਨੀ ਪਈ।"), "WEAK_CAUSE", "Normal isolated recheck cannot explain a broader delay."),
      bridge("sat-health-one-bed", t("One bed was moved to another room.", "एक बिस्तर दूसरे कक्ष में ले जाया गया।", "ਇੱਕ ਬੈੱਡ ਦੂਜੇ ਕਮਰੇ ਵਿੱਚ ਲਿਆਂਦਾ ਗਿਆ।"), "WRONG_SCOPE", "Narrow ward action at insufficient scope."),
      bridge("sat-health-advisory", t("An advisory was issued after waiting times increased.", "प्रतीक्षा समय बढ़ने के बाद परामर्श सूचना जारी हुई।", "ਉਡੀਕ ਸਮਾਂ ਵੱਧਣ ਤੋਂ ਬਾਅਦ ਸਲਾਹ ਸੂਚਨਾ ਜਾਰੀ ਹੋਈ।"), "REVERSE_CAUSATION", "Advisory is a response to the disruption."),
    ],
    effects: [
      effect("sat-health-one-report", t("One routine report was printed a few minutes late.", "एक सामान्य रिपोर्ट कुछ मिनट देर से छपी।", "ਇੱਕ ਆਮ ਰਿਪੋਰਟ ਕੁਝ ਮਿੰਟ ਦੇਰ ਨਾਲ ਛਪੀ।"), "MAGNITUDE_MISMATCH", "Too small a consequence for the target chain."),
      effect("sat-health-one-visitor", t("One visitor waited at a different desk.", "एक आगंतुक ने दूसरे डेस्क पर प्रतीक्षा की।", "ਇੱਕ ਆਗੰਤੁਕ ਨੇ ਦੂਜੇ ਡੈਸਕ ਉੱਤੇ ਉਡੀਕ ਕੀਤੀ।"), "WRONG_SCOPE", "Individual event with insufficient service scope."),
      effect("sat-health-opening-check", t("Staff completed the opening checklist before patients arrived.", "मरीजों के आने से पहले कर्मचारियों ने प्रारंभिक जांच सूची पूरी की।", "ਮਰੀਜ਼ਾਂ ਦੇ ਆਉਣ ਤੋਂ ਪਹਿਲਾਂ ਸਟਾਫ ਨੇ ਸ਼ੁਰੂਆਤੀ ਜਾਂਚ ਸੂਚੀ ਪੂਰੀ ਕੀਤੀ।"), "REVERSE_CAUSATION", "Precedes the target event and cannot be its effect."),
    ],
  },
};

export const CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS = Object.freeze(Object.keys(POOLS));

/** Attach same-family, target-audited semantic pools to every chain variant in a ready family. */
export function withSaturationCandidateAuthorities(family: CaeScenarioFamilyAuthority): CaeScenarioFamilyAuthority {
  const pool = POOLS[family.id];
  if (!pool) return family;
  return Object.freeze({
    ...family,
    allowedProjectionKinds: Object.freeze(Array.from(new Set([...family.allowedProjectionKinds, "PROBABLE_CAUSE", "PROBABLE_EFFECT", "COMPETING_EXPLANATION", "MISSING_CAUSAL_LINK"]))),
    variants: Object.freeze(family.variants.map((variant) => Object.freeze({
      ...variant,
      semanticCandidateEvents: pool.causes,
      semanticBridgeCandidateEvents: pool.bridges,
      semanticEffectCandidateEvents: pool.effects,
    }))),
  });
}
