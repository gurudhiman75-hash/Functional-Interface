import { generateLpCp04PermanentBatch, LP_CP04_ENGLISH_FREEZE_V1, type LpCp04PermanentCaselet } from "./lp-cp04-permanent-freeze-v1.ts";
import type { Assignment, Clue, GroupId } from "./index.ts";
import type { CandidateId, SelectionAssignment, SelectionClue } from "./lp-004.ts";

export type LpCp04LocalizedLanguage = "hi" | "pa";

export type LpCp04LocalizedChild = {
  questionId: string;
  qlId: "LP-QL-047";
  language: LpCp04LocalizedLanguage;
  difficultyBand: "Easy" | "Medium" | "Hard";
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  explanation: { summary: string; lines: string[] };
};

export type LpCp04LocalizedCaselet = {
  packageId: "LP-CP04-COUNTERFACTUAL";
  checkpointId: "LP-CP-012";
  language: LpCp04LocalizedLanguage;
  caseletId: string;
  parentTopology: "LP-001_GROUPING" | "LP-004_COMMITTEE_SELECTION";
  difficultyBand: "Easy" | "Medium" | "Hard";
  scenario: string;
  learnerFacingClues: string[];
  counterfactualChild: LpCp04LocalizedChild;
  englishCaselet: LpCp04PermanentCaselet;
};

export const LP_CP04_HI_PA_LOCALIZATION_REVIEW_V1 = Object.freeze({
  authorityId: "LP_CP04_HI_PA_LOCALIZATION_REVIEW_V1" as const,
  sourceEnglishAuthorityId: LP_CP04_ENGLISH_FREEZE_V1.authorityId,
  packageId: "LP-CP04-COUNTERFACTUAL" as const,
  checkpointId: "LP-CP-012" as const,
  permanentQlIds: ["LP-QL-047"] as const,
  supportedLanguages: ["hi", "pa"] as const,
  locales: ["hi-IN", "pa-IN"] as const,
  localizationMethod: "SEMANTIC_REBUILD_FROM_FROZEN_STRUCTURED_STATE" as const,
  status: "HUMAN_REVIEW_CANDIDATE_V1" as const,
  runtimeMode: "REVIEW_ONLY" as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

const LP001_NATIVE: Record<string, { hi: string; pa: string; groups: Record<GroupId, { hi: string; pa: string }> }> = {
  PUBLIC_HEALTH_FIELDWORK: {
    hi: "एक विश्वविद्यालय सार्वजनिक स्वास्थ्य का मैदानी अध्ययन कर रहा है। छह स्वयंसेवकों को दो-दो सदस्यों की तीन टीमों में बाँटा गया है।",
    pa: "ਇੱਕ ਯੂਨੀਵਰਸਿਟੀ ਜਨਤਕ ਸਿਹਤ ਲਈ ਮੈਦਾਨੀ ਅਧਿਐਨ ਕਰ ਰਹੀ ਹੈ। ਛੇ ਸਵੈਛਿਕਾਂ ਨੂੰ ਦੋ-ਦੋ ਮੈਂਬਰਾਂ ਦੀਆਂ ਤਿੰਨ ਟੀਮਾਂ ਵਿੱਚ ਵੰਡਿਆ ਗਿਆ ਹੈ।",
    groups: { Survey: { hi: "घरेलू सर्वेक्षण", pa: "ਘਰੇਲੂ ਸਰਵੇਖਣ" }, Outreach: { hi: "सामुदायिक संपर्क", pa: "ਸਮੁਦਾਇਕ ਸੰਪਰਕ" }, Data: { hi: "डेटा समीक्षा", pa: "ਡਾਟਾ ਸਮੀਖਿਆ" } },
  },
  TEACHER_TRAINING: {
    hi: "एक शिक्षक-प्रशिक्षण कार्यक्रम में कक्षा-भ्रमण की व्यवस्था की जा रही है। छह शिक्षकों को दो-दो सदस्यों के तीन पैनलों में बाँटा गया है।",
    pa: "ਇੱਕ ਅਧਿਆਪਕ-ਤਾਲੀਮ ਪ੍ਰੋਗਰਾਮ ਵਿੱਚ ਕਲਾਸ ਦੌਰਿਆਂ ਦੀ ਵਿਵਸਥਾ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ। ਛੇ ਅਧਿਆਪਕਾਂ ਨੂੰ ਦੋ-ਦੋ ਮੈਂਬਰਾਂ ਦੇ ਤਿੰਨ ਪੈਨਲਾਂ ਵਿੱਚ ਵੰਡਿਆ ਗਿਆ ਹੈ।",
    groups: { Survey: { hi: "पाठ योजना", pa: "ਪਾਠ ਯੋਜਨਾ" }, Outreach: { hi: "कक्षा अवलोकन", pa: "ਕਲਾਸ ਅਵਲੋਕਨ" }, Data: { hi: "मूल्यांकन समीक्षा", pa: "ਮੁਲਾਂਕਣ ਸਮੀਖਿਆ" } },
  },
  BANK_BRANCH_AUDIT: {
    hi: "एक बैंक छह शाखाओं की समीक्षा कर रहा है। छह अधिकारियों को दो-दो सदस्यों की तीन ऑडिट टीमों में बाँटा गया है।",
    pa: "ਇੱਕ ਬੈਂਕ ਛੇ ਸ਼ਾਖਾਵਾਂ ਦੀ ਸਮੀਖਿਆ ਕਰ ਰਿਹਾ ਹੈ। ਛੇ ਅਧਿਕਾਰੀਆਂ ਨੂੰ ਦੋ-ਦੋ ਮੈਂਬਰਾਂ ਦੀਆਂ ਤਿੰਨ ਆਡਿਟ ਟੀਮਾਂ ਵਿੱਚ ਵੰਡਿਆ ਗਿਆ ਹੈ।",
    groups: { Survey: { hi: "ग्राहक-सेवा ऑडिट", pa: "ਗਾਹਕ-ਸੇਵਾ ਆਡਿਟ" }, Outreach: { hi: "ऋण-फाइल ऑडिट", pa: "ਕਰਜ਼ਾ-ਫਾਈਲ ਆਡਿਟ" }, Data: { hi: "अनुपालन ऑडिट", pa: "ਅਨੁਪਾਲਨਾ ਆਡਿਟ" } },
  },
  DISTRICT_OFFICERS: {
    hi: "एक जिला कार्यालय सेवा-प्रदाय रिपोर्ट तैयार कर रहा है। छह अधिकारियों को दो-दो सदस्यों के तीन कार्य-समूहों में बाँटा गया है।",
    pa: "ਇੱਕ ਜ਼ਿਲ੍ਹਾ ਦਫ਼ਤਰ ਸੇਵਾ-ਪ੍ਰਦਾਨ ਰਿਪੋਰਟ ਤਿਆਰ ਕਰ ਰਿਹਾ ਹੈ। ਛੇ ਅਧਿਕਾਰੀਆਂ ਨੂੰ ਦੋ-ਦੋ ਮੈਂਬਰਾਂ ਦੇ ਤਿੰਨ ਕਾਰਜ-ਸਮੂਹਾਂ ਵਿੱਚ ਵੰਡਿਆ ਗਿਆ ਹੈ।",
    groups: { Survey: { hi: "मैदानी निरीक्षण", pa: "ਮੈਦਾਨੀ ਨਿਰੀਖਣ" }, Outreach: { hi: "जन शिकायत", pa: "ਜਨ ਸ਼ਿਕਾਇਤ" }, Data: { hi: "अभिलेख समीक्षा", pa: "ਰਿਕਾਰਡ ਸਮੀਖਿਆ" } },
  },
  SCHOLARSHIP_VERIFICATION: {
    hi: "एक छात्रवृत्ति कार्यालय छह अभ्यर्थियों के आवेदनों की जाँच कर रहा है। अभ्यर्थियों को दो-दो सदस्यों के तीन सत्यापन पैनलों में बाँटा गया है।",
    pa: "ਇੱਕ ਸਕਾਲਰਸ਼ਿਪ ਦਫ਼ਤਰ ਛੇ ਉਮੀਦਵਾਰਾਂ ਦੀਆਂ ਅਰਜ਼ੀਆਂ ਦੀ ਜਾਂਚ ਕਰ ਰਿਹਾ ਹੈ। ਉਮੀਦਵਾਰਾਂ ਨੂੰ ਦੋ-ਦੋ ਮੈਂਬਰਾਂ ਦੇ ਤਿੰਨ ਜਾਂਚ ਪੈਨਲਾਂ ਵਿੱਚ ਵੰਡਿਆ ਗਿਆ ਹੈ।",
    groups: { Survey: { hi: "पात्रता जाँच", pa: "ਯੋਗਤਾ ਜਾਂਚ" }, Outreach: { hi: "दस्तावेज़ जाँच", pa: "ਦਸਤਾਵੇਜ਼ ਜਾਂਚ" }, Data: { hi: "साक्षात्कार जाँच", pa: "ਇੰਟਰਵਿਊ ਜਾਂਚ" } },
  },
  CIVIC_WATER_AUDIT: {
    hi: "एक नागरिक समूह जिला जल ऑडिट कर रहा है। छह स्वयंसेवकों को दो-दो सदस्यों की तीन मैदानी इकाइयों में बाँटा गया है।",
    pa: "ਇੱਕ ਨਾਗਰਿਕ ਸਮੂਹ ਜ਼ਿਲ੍ਹਾ ਜਲ ਆਡਿਟ ਕਰ ਰਿਹਾ ਹੈ। ਛੇ ਸਵੈਛਿਕਾਂ ਨੂੰ ਦੋ-ਦੋ ਮੈਂਬਰਾਂ ਦੀਆਂ ਤਿੰਨ ਮੈਦਾਨੀ ਇਕਾਈਆਂ ਵਿੱਚ ਵੰਡਿਆ ਗਿਆ ਹੈ।",
    groups: { Survey: { hi: "घरेलू दौरे", pa: "ਘਰੇਲੂ ਦੌਰੇ" }, Outreach: { hi: "सामुदायिक बैठकें", pa: "ਸਮੁਦਾਇਕ ਮੀਟਿੰਗਾਂ" }, Data: { hi: "अभिलेख संकलन", pa: "ਰਿਕਾਰਡ ਸੰਕਲਨ" } },
  },
  CAMPUS_RESEARCH: {
    hi: "एक कॉलेज परिसर-सुरक्षा अध्ययन के लिए प्रमाण जुटा रहा है। छह शोध सहायकों को दो-दो सदस्यों की तीन टीमों में बाँटा गया है।",
    pa: "ਇੱਕ ਕਾਲਜ ਕੈਂਪਸ-ਸੁਰੱਖਿਆ ਅਧਿਐਨ ਲਈ ਸਬੂਤ ਇਕੱਠੇ ਕਰ ਰਿਹਾ ਹੈ। ਛੇ ਖੋਜ ਸਹਾਇਕਾਂ ਨੂੰ ਦੋ-ਦੋ ਮੈਂਬਰਾਂ ਦੀਆਂ ਤਿੰਨ ਟੀਮਾਂ ਵਿੱਚ ਵੰਡਿਆ ਗਿਆ ਹੈ।",
    groups: { Survey: { hi: "छात्र साक्षात्कार", pa: "ਵਿਦਿਆਰਥੀ ਇੰਟਰਵਿਊ" }, Outreach: { hi: "परिसर निरीक्षण", pa: "ਕੈਂਪਸ ਨਿਰੀਖਣ" }, Data: { hi: "प्रमाण विश्लेषण", pa: "ਸਬੂਤ ਵਿਸ਼ਲੇਸ਼ਣ" } },
  },
  MUNICIPAL_PLANNING: {
    hi: "एक नगरपालिका कार्यालय मोहल्ला-सुधार योजना तैयार कर रहा है। छह योजनाकारों को दो-दो सदस्यों के तीन समूहों में बाँटा गया है।",
    pa: "ਇੱਕ ਨਗਰ ਪਾਲਿਕਾ ਦਫ਼ਤਰ ਮੁਹੱਲਾ-ਸੁਧਾਰ ਯੋਜਨਾ ਤਿਆਰ ਕਰ ਰਿਹਾ ਹੈ। ਛੇ ਯੋਜਨਾਕਾਰਾਂ ਨੂੰ ਦੋ-ਦੋ ਮੈਂਬਰਾਂ ਦੇ ਤਿੰਨ ਸਮੂਹਾਂ ਵਿੱਚ ਵੰਡਿਆ ਗਿਆ ਹੈ।",
    groups: { Survey: { hi: "सड़क और जल-निकासी", pa: "ਸੜਕਾਂ ਅਤੇ ਨਿਕਾਸੀ" }, Outreach: { hi: "पार्क और प्रकाश", pa: "ਪਾਰਕ ਅਤੇ ਰੋਸ਼ਨੀ" }, Data: { hi: "बजट और अभिलेख", pa: "ਬਜਟ ਅਤੇ ਰਿਕਾਰਡ" } },
  },
};

const LP004_SCENARIO: Record<string, { hi: string; pa: string }> = {
  DISTRICT_HEALTH_TEAM: { hi: "एक जिला स्वास्थ्य कार्यालय सात कर्मचारियों में से चार लोगों की टीकाकरण संपर्क टीम चुन रहा है।", pa: "ਇੱਕ ਜ਼ਿਲ੍ਹਾ ਸਿਹਤ ਦਫ਼ਤਰ ਸੱਤ ਕਰਮਚਾਰੀਆਂ ਵਿੱਚੋਂ ਚਾਰ ਲੋਕਾਂ ਦੀ ਟੀਕਾਕਰਨ ਸੰਪਰਕ ਟੀਮ ਚੁਣ ਰਿਹਾ ਹੈ।" },
  SCHOOL_EVENT_PANEL: { hi: "एक सरकारी स्कूल सात शिक्षकों में से चार सदस्यों की वार्षिक समारोह योजना समिति बना रहा है।", pa: "ਇੱਕ ਸਰਕਾਰੀ ਸਕੂਲ ਸੱਤ ਅਧਿਆਪਕਾਂ ਵਿੱਚੋਂ ਚਾਰ ਮੈਂਬਰਾਂ ਦੀ ਸਾਲਾਨਾ ਸਮਾਰੋਹ ਯੋਜਨਾ ਕਮੇਟੀ ਬਣਾ ਰਿਹਾ ਹੈ।" },
  BANK_AUDIT_TEAM: { hi: "एक बैंक शाखा सात अधिकारियों में से चार लोगों की आंतरिक ऑडिट टीम चुन रही है।", pa: "ਇੱਕ ਬੈਂਕ ਸ਼ਾਖਾ ਸੱਤ ਅਧਿਕਾਰੀਆਂ ਵਿੱਚੋਂ ਚਾਰ ਲੋਕਾਂ ਦੀ ਅੰਦਰੂਨੀ ਆਡਿਟ ਟੀਮ ਚੁਣ ਰਹੀ ਹੈ।" },
  MUNICIPAL_WATER_SURVEY: { hi: "एक नगर निगम सात कर्मचारियों में से चार लोगों की पेयजल सर्वेक्षण टीम चुन रहा है।", pa: "ਇੱਕ ਨਗਰ ਨਿਗਮ ਸੱਤ ਕਰਮਚਾਰੀਆਂ ਵਿੱਚੋਂ ਚਾਰ ਲੋਕਾਂ ਦੀ ਪੀਣ ਵਾਲੇ ਪਾਣੀ ਦੀ ਸਰਵੇਖਣ ਟੀਮ ਚੁਣ ਰਿਹਾ ਹੈ।" },
  RAILWAY_SAFETY_PANEL: { hi: "एक रेलवे डिपो सात पर्यवेक्षकों में से चार सदस्यों का सुरक्षा समीक्षा पैनल बना रहा है।", pa: "ਇੱਕ ਰੇਲਵੇ ਡਿਪੋ ਸੱਤ ਨਿਗਰਾਨਾਂ ਵਿੱਚੋਂ ਚਾਰ ਮੈਂਬਰਾਂ ਦਾ ਸੁਰੱਖਿਆ ਸਮੀਖਿਆ ਪੈਨਲ ਬਣਾ ਰਿਹਾ ਹੈ।" },
  EXAM_BOARD_COMMITTEE: { hi: "एक भर्ती बोर्ड सात अधिकारियों में से चार लोगों की परीक्षा-केंद्र समीक्षा समिति चुन रहा है।", pa: "ਇੱਕ ਭਰਤੀ ਬੋਰਡ ਸੱਤ ਅਧਿਕਾਰੀਆਂ ਵਿੱਚੋਂ ਚਾਰ ਲੋਕਾਂ ਦੀ ਪ੍ਰੀਖਿਆ-ਕੇਂਦਰ ਸਮੀਖਿਆ ਕਮੇਟੀ ਚੁਣ ਰਿਹਾ ਹੈ।" },
};

function nativeGroup(caselet: any, group: GroupId, language: LpCp04LocalizedLanguage): string {
  const profile = LP001_NATIVE[caselet.scenarioProfileId];
  if (!profile) throw new Error(`${caselet.caseletId}: unsupported LP-001 scenario profile ${caselet.scenarioProfileId}`);
  return profile.groups[group][language];
}

function lp001Scenario(caselet: any, language: LpCp04LocalizedLanguage): string {
  const profile = LP001_NATIVE[caselet.scenarioProfileId];
  if (!profile) throw new Error(`${caselet.caseletId}: unsupported LP-001 scenario profile ${caselet.scenarioProfileId}`);
  const names = caselet.people.join(", ");
  const groups = caselet.groups.map((group: GroupId) => nativeGroup(caselet, group, language)).join(", ");
  if (language === "hi") return `${profile.hi} छह व्यक्ति हैं: ${names}। तीन समूह हैं: ${groups}। प्रत्येक व्यक्ति को केवल एक समूह में रखा गया है और प्रत्येक समूह में दो व्यक्ति हैं।`;
  return `${profile.pa} ਛੇ ਵਿਅਕਤੀ ਹਨ: ${names}। ਤਿੰਨ ਸਮੂਹ ਹਨ: ${groups}। ਹਰ ਵਿਅਕਤੀ ਨੂੰ ਕੇਵਲ ਇੱਕ ਸਮੂਹ ਵਿੱਚ ਰੱਖਿਆ ਗਿਆ ਹੈ ਅਤੇ ਹਰ ਸਮੂਹ ਵਿੱਚ ਦੋ ਵਿਅਕਤੀ ਹਨ।`;
}

function lp001Clue(caselet: any, clue: Clue, language: LpCp04LocalizedLanguage): string {
  if (clue.kind === "SAME_GROUP") return language === "hi" ? `${clue.left} और ${clue.right} एक ही समूह में हैं।` : `${clue.left} ਅਤੇ ${clue.right} ਇੱਕੋ ਸਮੂਹ ਵਿੱਚ ਹਨ।`;
  if (clue.kind === "DIFFERENT_GROUPS") return language === "hi" ? `${clue.left} और ${clue.right} अलग-अलग समूहों में हैं।` : `${clue.left} ਅਤੇ ${clue.right} ਵੱਖ-ਵੱਖ ਸਮੂਹਾਂ ਵਿੱਚ ਹਨ।`;
  const group = nativeGroup(caselet, clue.group, language);
  return language === "hi" ? `${clue.person} को ${group} समूह में नहीं रखा गया है।` : `${clue.person} ਨੂੰ ${group} ਸਮੂਹ ਵਿੱਚ ਨਹੀਂ ਰੱਖਿਆ ਗਿਆ ਹੈ।`;
}

function propositionFromEnglish(caselet: any, option: string, language: LpCp04LocalizedLanguage): string {
  const match = option.match(/^(.+) is assigned to (.+)\.$/u);
  if (!match) throw new Error(`${caselet.caseletId}: unsupported LP-001 proposition: ${option}`);
  const person = match[1]!;
  const groupId = caselet.groups.find((group: GroupId) => caselet.groupLabels[group] === match[2]);
  if (!groupId) throw new Error(`${caselet.caseletId}: unknown group label in ${option}`);
  const group = nativeGroup(caselet, groupId, language);
  return language === "hi" ? `${person} को ${group} में रखा गया है।` : `${person} ਨੂੰ ${group} ਵਿੱਚ ਰੱਖਿਆ ਗਿਆ ਹੈ।`;
}

function lp001Table(caselet: any, state: Assignment, language: LpCp04LocalizedLanguage): string {
  const header = language === "hi" ? "| व्यक्ति | समूह |\n|---|---|" : "| ਵਿਅਕਤੀ | ਸਮੂਹ |\n|---|---|";
  return [header, ...caselet.people.map((person: string) => `| ${person} | ${nativeGroup(caselet, state[person]!, language)} |`)].join("\n");
}

function localizeLp001(caselet: any, language: LpCp04LocalizedLanguage): LpCp04LocalizedCaselet {
  const child = caselet.counterfactualChild;
  const condition = child.temporaryConditions[0]!;
  const conditioned = caselet.validStates.filter((state: Assignment) => state[condition.person] === condition.group);
  const nativeConditionGroup = nativeGroup(caselet, condition.group, language);
  const options = child.options.map((option: string) => propositionFromEnglish(caselet, option, language));
  const answer = options[child.correctIndex]!;
  const stem = language === "hi"
    ? `यदि ${condition.person} को ${nativeConditionGroup} में रखा जाए, तो निम्न में से कौन-सा कथन अवश्य सही होगा?`
    : `ਜੇ ${condition.person} ਨੂੰ ${nativeConditionGroup} ਵਿੱਚ ਰੱਖਿਆ ਜਾਵੇ, ਤਾਂ ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਕਥਨ ਲਾਜ਼ਮੀ ਤੌਰ 'ਤੇ ਸਹੀ ਹੋਵੇਗਾ?`;
  const lines = language === "hi"
    ? [
        `मूल शर्तों से ${caselet.validStates.length} व्यवस्थाएँ संभव हैं।`,
        `अतिरिक्त शर्त: **${condition.person} को ${nativeConditionGroup} में रखा गया है।**`,
        `इस शर्त के बाद ${conditioned.length} व्यवस्था${conditioned.length === 1 ? "" : "एँ"} बचती ${conditioned.length === 1 ? "है" : "हैं"}।`,
        ...conditioned.map((state: Assignment, index: number) => `**बची हुई व्यवस्था ${index + 1}**\n\n${lp001Table(caselet, state, language)}`),
        `हर बची हुई व्यवस्था में **${answer}** सही है। इसलिए यही उत्तर अवश्य सही होगा।`,
      ]
    : [
        `ਮੂਲ ਸ਼ਰਤਾਂ ਨਾਲ ${caselet.validStates.length} ਵਿਵਸਥਾਵਾਂ ਸੰਭਵ ਹਨ।`,
        `ਵਾਧੂ ਸ਼ਰਤ: **${condition.person} ਨੂੰ ${nativeConditionGroup} ਵਿੱਚ ਰੱਖਿਆ ਗਿਆ ਹੈ।**`,
        `ਇਸ ਸ਼ਰਤ ਤੋਂ ਬਾਅਦ ${conditioned.length} ਵਿਵਸਥਾ${conditioned.length === 1 ? "" : "ਵਾਂ"} ਬਚਦੀ${conditioned.length === 1 ? " ਹੈ" : "ਆਂ ਹਨ"}।`,
        ...conditioned.map((state: Assignment, index: number) => `**ਬਚੀ ਹੋਈ ਵਿਵਸਥਾ ${index + 1}**\n\n${lp001Table(caselet, state, language)}`),
        `ਹਰ ਬਚੀ ਹੋਈ ਵਿਵਸਥਾ ਵਿੱਚ **${answer}** ਸਹੀ ਹੈ। ਇਸ ਲਈ ਇਹੀ ਉੱਤਰ ਲਾਜ਼ਮੀ ਤੌਰ 'ਤੇ ਸਹੀ ਹੈ।`,
      ];
  return {
    packageId: "LP-CP04-COUNTERFACTUAL",
    checkpointId: "LP-CP-012",
    language,
    caseletId: caselet.caseletId,
    parentTopology: "LP-001_GROUPING",
    difficultyBand: child.difficultyBand,
    scenario: lp001Scenario(caselet, language),
    learnerFacingClues: caselet.clues.map((clue: Clue) => lp001Clue(caselet, clue, language)),
    counterfactualChild: {
      questionId: child.questionId,
      qlId: "LP-QL-047",
      language,
      difficultyBand: child.difficultyBand,
      stem,
      options,
      correctIndex: child.correctIndex,
      answer,
      explanation: {
        summary: language === "hi" ? "अतिरिक्त शर्त लगाकर बची हुई सभी व्यवस्थाओं की तुलना करें।" : "ਵਾਧੂ ਸ਼ਰਤ ਲਗਾ ਕੇ ਬਚੀਆਂ ਹੋਈਆਂ ਸਾਰੀਆਂ ਵਿਵਸਥਾਵਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।",
        lines,
      },
    },
    englishCaselet: caselet,
  };
}

function lp004Scenario(caselet: any, language: LpCp04LocalizedLanguage): string {
  const base = LP004_SCENARIO[caselet.scenarioProfileId];
  if (!base) throw new Error(`${caselet.caseletId}: unsupported LP-004 scenario profile ${caselet.scenarioProfileId}`);
  const names = caselet.candidates.map((candidate: CandidateId) => caselet.candidateLabels[candidate]).join(", ");
  return language === "hi" ? `${base.hi} सात व्यक्ति हैं: ${names}। कुल चार लोगों का चयन किया जाएगा।` : `${base.pa} ਸੱਤ ਵਿਅਕਤੀ ਹਨ: ${names}। ਕੁੱਲ ਚਾਰ ਲੋਕ ਚੁਣੇ ਜਾਣਗੇ।`;
}

function lp004Clue(caselet: any, clue: SelectionClue, language: LpCp04LocalizedLanguage): string {
  const name = (candidate: CandidateId) => caselet.candidateLabels[candidate];
  if (clue.kind === "MUST_SELECT") return language === "hi" ? `${name(clue.candidate)} का चयन अवश्य होगा।` : `${name(clue.candidate)} ਦੀ ਚੋਣ ਲਾਜ਼ਮੀ ਹੈ।`;
  if (clue.kind === "MUST_NOT_SELECT") return language === "hi" ? `${name(clue.candidate)} का चयन नहीं होगा।` : `${name(clue.candidate)} ਦੀ ਚੋਣ ਨਹੀਂ ਹੋਵੇਗੀ।`;
  if (clue.kind === "TOGETHER") return language === "hi" ? `${name(clue.first)} और ${name(clue.second)} या तो दोनों चुने जाएंगे या दोनों नहीं चुने जाएंगे।` : `${name(clue.first)} ਅਤੇ ${name(clue.second)} ਜਾਂ ਤਾਂ ਦੋਵੇਂ ਚੁਣੇ ਜਾਣਗੇ ਜਾਂ ਦੋਵੇਂ ਨਹੀਂ ਚੁਣੇ ਜਾਣਗੇ।`;
  if (clue.kind === "NOT_TOGETHER") return language === "hi" ? `${name(clue.first)} और ${name(clue.second)} दोनों का एक साथ चयन नहीं हो सकता।` : `${name(clue.first)} ਅਤੇ ${name(clue.second)} ਦੋਵੇਂ ਇਕੱਠੇ ਨਹੀਂ ਚੁਣੇ ਜਾ ਸਕਦੇ।`;
  if (clue.kind === "EXACTLY_ONE") return language === "hi" ? `${name(clue.first)} और ${name(clue.second)} में से ठीक एक का चयन होगा।` : `${name(clue.first)} ਅਤੇ ${name(clue.second)} ਵਿੱਚੋਂ ਠੀਕ ਇੱਕ ਦੀ ਚੋਣ ਹੋਵੇਗੀ।`;
  return language === "hi" ? `यदि ${name(clue.first)} चुना जाता है, तो ${name(clue.second)} का चयन भी होगा।` : `ਜੇ ${name(clue.first)} ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ, ਤਾਂ ${name(clue.second)} ਵੀ ਚੁਣਿਆ ਜਾਵੇਗਾ।`;
}

function selectedNames(caselet: any, state: SelectionAssignment): string {
  return caselet.candidates.filter((candidate: CandidateId) => state[candidate]).map((candidate: CandidateId) => caselet.candidateLabels[candidate]).join(", ");
}

function localizeLp004(caselet: any, language: LpCp04LocalizedLanguage): LpCp04LocalizedCaselet {
  const child = caselet.counterfactualChild;
  const condition = child.temporaryCondition;
  const conditionName = caselet.candidateLabels[condition.candidate];
  const after = caselet.validStates.filter((state: SelectionAssignment) => state[condition.candidate] === condition.selected);
  const options = [...child.options];
  const answer = options[child.correctIndex]!;
  const conditionPhrase = language === "hi"
    ? `${conditionName} ${condition.selected ? "का चयन किया जाए" : "का चयन न किया जाए"}`
    : `${conditionName} ਨੂੰ ${condition.selected ? "ਚੁਣਿਆ ਜਾਵੇ" : "ਨਾ ਚੁਣਿਆ ਜਾਵੇ"}`;
  const targetSelected = child.queryMode === "MUST_BE_SELECTED";
  const stem = language === "hi"
    ? `यदि ${conditionPhrase}, तो निम्न में से किसका चयन ${targetSelected ? "अवश्य होगा" : "अवश्य नहीं होगा"}?`
    : `ਜੇ ${conditionPhrase}, ਤਾਂ ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਸ ਦੀ ਚੋਣ ${targetSelected ? "ਲਾਜ਼ਮੀ ਹੋਵੇਗੀ" : "ਲਾਜ਼ਮੀ ਤੌਰ 'ਤੇ ਨਹੀਂ ਹੋਵੇਗੀ"}?`;
  const lines = language === "hi"
    ? [
        `मूल शर्तों से ${caselet.validStates.length} समितियाँ संभव हैं।`,
        `अतिरिक्त शर्त: **${conditionName} ${condition.selected ? "चुना गया है" : "नहीं चुना गया है"}।**`,
        `मूल शर्तों के साथ यह शर्त लगाने पर ${after.length} समिति${after.length === 1 ? "" : "याँ"} बचती ${after.length === 1 ? "है" : "हैं"}।`,
        ...after.map((state: SelectionAssignment, index: number) => `**बची हुई समिति ${index + 1}:** ${selectedNames(caselet, state)}`),
        `बची हुई हर समिति में **${answer}** ${targetSelected ? "चुना गया है" : "नहीं चुना गया है"}। इसलिए यही उत्तर अवश्य सही है।`,
      ]
    : [
        `ਮੂਲ ਸ਼ਰਤਾਂ ਨਾਲ ${caselet.validStates.length} ਕਮੇਟੀਆਂ ਸੰਭਵ ਹਨ।`,
        `ਵਾਧੂ ਸ਼ਰਤ: **${conditionName} ${condition.selected ? "ਚੁਣਿਆ ਗਿਆ ਹੈ" : "ਨਹੀਂ ਚੁਣਿਆ ਗਿਆ ਹੈ"}।**`,
        `ਮੂਲ ਸ਼ਰਤਾਂ ਨਾਲ ਇਹ ਸ਼ਰਤ ਲਗਾਉਣ ਤੋਂ ਬਾਅਦ ${after.length} ਕਮੇਟੀ${after.length === 1 ? "" : "ਆਂ"} ਬਚਦੀ${after.length === 1 ? " ਹੈ" : "ਆਂ ਹਨ"}।`,
        ...after.map((state: SelectionAssignment, index: number) => `**ਬਚੀ ਹੋਈ ਕਮੇਟੀ ${index + 1}:** ${selectedNames(caselet, state)}`),
        `ਬਚੀ ਹੋਈ ਹਰ ਕਮੇਟੀ ਵਿੱਚ **${answer}** ${targetSelected ? "ਚੁਣਿਆ ਗਿਆ ਹੈ" : "ਨਹੀਂ ਚੁਣਿਆ ਗਿਆ ਹੈ"}। ਇਸ ਲਈ ਇਹੀ ਉੱਤਰ ਲਾਜ਼ਮੀ ਤੌਰ 'ਤੇ ਸਹੀ ਹੈ।`,
      ];
  return {
    packageId: "LP-CP04-COUNTERFACTUAL",
    checkpointId: "LP-CP-012",
    language,
    caseletId: caselet.caseletId,
    parentTopology: "LP-004_COMMITTEE_SELECTION",
    difficultyBand: "Hard",
    scenario: lp004Scenario(caselet, language),
    learnerFacingClues: caselet.clues.map((clue: SelectionClue) => lp004Clue(caselet, clue, language)),
    counterfactualChild: {
      questionId: child.questionId,
      qlId: "LP-QL-047",
      language,
      difficultyBand: "Hard",
      stem,
      options,
      correctIndex: child.correctIndex,
      answer,
      explanation: {
        summary: language === "hi" ? "अतिरिक्त शर्त को मूल शर्तों के साथ लगाकर बची हुई समितियों की तुलना करें।" : "ਵਾਧੂ ਸ਼ਰਤ ਨੂੰ ਮੂਲ ਸ਼ਰਤਾਂ ਨਾਲ ਜੋੜ ਕੇ ਬਚੀਆਂ ਹੋਈਆਂ ਕਮੇਟੀਆਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।",
        lines,
      },
    },
    englishCaselet: caselet,
  };
}

export function generateLpCp04LocalizedBatchV1(language: LpCp04LocalizedLanguage, seed = "lp-cp04-localization-v1", count = 9): LpCp04LocalizedCaselet[] {
  return generateLpCp04PermanentBatch(seed, count).map((caselet: any) =>
    caselet.difficultyBand === "Hard" ? localizeLp004(caselet, language) : localizeLp001(caselet, language),
  );
}
