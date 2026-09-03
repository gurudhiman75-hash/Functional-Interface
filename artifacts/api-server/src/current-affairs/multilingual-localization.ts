import { createHash } from "node:crypto";

import { evaluateTranslationQuality } from "../lib/admin-translation-operations";

export type CurrentAffairsLocalizationLanguage = "hi" | "pa";

export type LocalizationFact = {
  key: string;
  value: string;
  type?: string;
};

export type CurrentAffairsLocalizationInput = {
  eventId: string;
  authoringVersionId: string;
  languageCode: CurrentAffairsLocalizationLanguage;
  sourceTitle: string;
  sourceSummary: string;
  sourceOneLiner?: string;
  templateId?: string;
  sourceKey?: string;
  facts: LocalizationFact[];
};

export type CurrentAffairsLocalizationQuality = {
  sharedTranslationQuality: ReturnType<typeof evaluateTranslationQuality>;
  requiredFactKeys: string[];
  missingCanonicalFacts: Array<{ key: string; value: string }>;
  expectedScriptPresent: boolean;
};

export type CurrentAffairsLocalizationOutput = {
  status: "ready" | "needs_editorial";
  localizedTitle?: string;
  localizedSummary?: string;
  localizedOneLiner?: string;
  templateId?: string;
  inputFingerprint: string;
  quality: CurrentAffairsLocalizationQuality;
  reasons: string[];
};

const LOCALIZATION_POLICY_VERSION = "ca-cp058-date-anchor-parity-v1";

const SOURCE_NAMES: Record<CurrentAffairsLocalizationLanguage, Record<string, string>> = {
  hi: {
    pib: "भारत सरकार",
    rbi: "भारतीय रिज़र्व बैंक",
    sebi: "SEBI",
    isro: "ISRO",
    punjab_gov: "पंजाब सरकार",
    punjab_gov_press: "पंजाब सरकार",
    punjab_lok_bhavan_press: "पंजाब लोक भवन",
  },
  pa: {
    pib: "ਭਾਰਤ ਸਰਕਾਰ",
    rbi: "ਭਾਰਤੀ ਰਿਜ਼ਰਵ ਬੈਂਕ",
    sebi: "SEBI",
    isro: "ISRO",
    punjab_gov: "ਪੰਜਾਬ ਸਰਕਾਰ",
    punjab_gov_press: "ਪੰਜਾਬ ਸਰਕਾਰ",
    punjab_lok_bhavan_press: "ਪੰਜਾਬ ਲੋਕ ਭਵਨ",
  },
};

const GENERIC_FACT_LABELS: Record<CurrentAffairsLocalizationLanguage, Record<string, string>> = {
  hi: {
    acting_entity: "आधिकारिक निकाय",
    official_action: "आधिकारिक कार्रवाई",
    action_subject: "विषय",
    winner: "विजेता",
    award_or_title: "पुरस्कार या उपाधि",
    launching_entity: "आरंभ करने वाला निकाय",
    initiative: "पहल",
    event_status: "स्थिति",
    amount: "राशि",
    percentage: "प्रतिशत",
    rank: "रैंक",
    scheme_outlay: "परिव्यय",
    beneficiary_count: "लाभार्थी",
    effective_date: "प्रभावी तिथि",
    headquarters: "मुख्यालय",
    target_percentage: "लक्ष्य",
    target_year: "लक्ष्य वर्ष",
    mou_parties: "MoU के पक्ष",
    orbit_altitude: "कक्षा ऊंचाई",
    repeat_cycle: "पुनरावृत्ति चक्र",
    mission_life: "मिशन अवधि",
    launcher: "प्रक्षेपण यान",
    index_value: "सूचकांक मान",
  },
  pa: {
    acting_entity: "ਅਧਿਕਾਰਤ ਸੰਸਥਾ",
    official_action: "ਅਧਿਕਾਰਤ ਕਾਰਵਾਈ",
    action_subject: "ਵਿਸ਼ਾ",
    winner: "ਜੇਤੂ",
    award_or_title: "ਇਨਾਮ ਜਾਂ ਖਿਤਾਬ",
    launching_entity: "ਸ਼ੁਰੂ ਕਰਨ ਵਾਲੀ ਸੰਸਥਾ",
    initiative: "ਪਹਿਲ",
    event_status: "ਸਥਿਤੀ",
    amount: "ਰਕਮ",
    percentage: "ਪ੍ਰਤੀਸ਼ਤ",
    rank: "ਰੈਂਕ",
    scheme_outlay: "ਖਰਚਾ",
    beneficiary_count: "ਲਾਭਪਾਤਰੀ",
    effective_date: "ਲਾਗੂ ਮਿਤੀ",
    headquarters: "ਮੁੱਖ ਦਫ਼ਤਰ",
    target_percentage: "ਟੀਚਾ",
    target_year: "ਟੀਚਾ ਸਾਲ",
    mou_parties: "MoU ਦੇ ਪੱਖ",
    orbit_altitude: "ਕਕਸ਼ ਉਚਾਈ",
    repeat_cycle: "ਦੁਹਰਾਵਾ ਚੱਕਰ",
    mission_life: "ਮਿਸ਼ਨ ਅਵਧੀ",
    launcher: "ਲਾਂਚ ਵਾਹਨ",
    index_value: "ਸੂਚਕਾਂਕ ਮੁੱਲ",
  },
};

const GENERIC_SUBJECT_PRIORITY = [
  "action_subject",
  "initiative",
  "award_or_title",
  "appointee",
  "mou_parties",
  "headquarters",
  "scheme_outlay",
  "rank",
] as const;

const LOCALIZED_MONTHS: Record<string, Record<CurrentAffairsLocalizationLanguage, string>> = {
  january: { hi: "जनवरी", pa: "ਜਨਵਰੀ" },
  february: { hi: "फ़रवरी", pa: "ਫ਼ਰਵਰੀ" },
  march: { hi: "मार्च", pa: "ਮਾਰਚ" },
  april: { hi: "अप्रैल", pa: "ਅਪ੍ਰੈਲ" },
  may: { hi: "मई", pa: "ਮਈ" },
  june: { hi: "जून", pa: "ਜੂਨ" },
  july: { hi: "जुलाई", pa: "ਜੁਲਾਈ" },
  august: { hi: "अगस्त", pa: "ਅਗਸਤ" },
  september: { hi: "सितंबर", pa: "ਸਤੰਬਰ" },
  october: { hi: "अक्टूबर", pa: "ਅਕਤੂਬਰ" },
  november: { hi: "नवंबर", pa: "ਨਵੰਬਰ" },
  december: { hi: "दिसंबर", pa: "ਦਸੰਬਰ" },
};

function factMap(facts: LocalizationFact[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const fact of facts) {
    const key = fact.key.trim().toLowerCase();
    const value = fact.value.trim();
    if (key && value && !map.has(key)) map.set(key, value);
  }
  return map;
}

function normalized(value: string): string {
  return value.normalize("NFKC").replace(/\s+/g, " ").trim();
}

function sentence(value: string, language: CurrentAffairsLocalizationLanguage): string {
  const clean = normalized(value);
  if (!clean) return "";
  if (/[.!?।]$/u.test(clean)) return clean;
  return `${clean}।`;
}

function localizedSourceDateAnchor(
  sourceSummary: string,
  language: CurrentAffairsLocalizationLanguage,
): string | undefined {
  const match = normalized(sourceSummary).match(
    /^On\s+(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4}),?/i,
  );
  if (!match?.[1] || !match[2] || !match[3]) return undefined;
  const month = LOCALIZED_MONTHS[match[2].toLowerCase()]?.[language];
  if (!month) return undefined;
  return language === "hi"
    ? `${match[1]} ${month} ${match[3]} को`
    : `${match[1]} ${month} ${match[3]} ਨੂੰ`;
}

function authoringSubject(sourceTitle: string): string | undefined {
  const colon = sourceTitle.indexOf(":");
  if (colon > 0) {
    const subject = sourceTitle.slice(0, colon).trim();
    if (subject.length >= 2 && subject.length <= 80) return subject;
  }
  return undefined;
}

function usableFactValue(value: string | undefined): value is string {
  if (!value) return false;
  const clean = value.replace(/\s+/g, " ").trim();
  return Boolean(clean) && clean.length <= 220 && !/https?:\/\//i.test(clean);
}

function genericGraphKeys(facts: Map<string, string>): string[] {
  return [...facts.entries()]
    .filter(([, value]) => usableFactValue(value))
    .slice(0, 4)
    .map(([key]) => key);
}

function requiredFactKeys(templateId: string | undefined, facts: Map<string, string>): string[] {
  switch (templateId) {
    case "appointment_v1":
      return ["appointee", "position"];
    case "rbi_financial_inclusion_index_v1":
      return ["index_value"];
    case "rbi_policy_rates_v1":
      return [
        "policy_repo_rate",
        "standing_deposit_facility_rate",
        "marginal_standing_facility_rate",
        "bank_rate",
        "cash_reserve_ratio",
        "statutory_liquidity_ratio",
      ].filter((key) => facts.has(key));
    case "mou_v1":
      return ["mou_parties"];
    case "isro_mission_facts_v1":
      return ["orbit_altitude", "repeat_cycle", "mission_life", "launcher"].filter((key) => facts.has(key));
    case "programme_outlay_v1":
      return ["scheme_outlay", "beneficiary_count", "effective_date"].filter((key) => facts.has(key));
    case "verified_official_action_v1":
      return ["acting_entity", "official_action", "action_subject"];
    case "verified_award_result_v1":
      return ["winner", "award_or_title"];
    case "verified_initiative_v1":
      return ["launching_entity", "initiative"];
    case "generic_verified_fact_graph_v1":
      return genericGraphKeys(facts);
    default:
      return [];
  }
}

function expectedScriptPresent(value: string, language: CurrentAffairsLocalizationLanguage): boolean {
  const pattern = language === "hi" ? /[\u0900-\u097F]/u : /[\u0A00-\u0A7F]/u;
  return pattern.test(value);
}

export function localizationInputFingerprint(input: CurrentAffairsLocalizationInput): string {
  const stable = JSON.stringify({
    localizationPolicyVersion: LOCALIZATION_POLICY_VERSION,
    eventId: input.eventId,
    authoringVersionId: input.authoringVersionId,
    languageCode: input.languageCode,
    sourceTitle: normalized(input.sourceTitle),
    sourceSummary: normalized(input.sourceSummary),
    sourceOneLiner: normalized(input.sourceOneLiner ?? ""),
    templateId: input.templateId ?? "",
    sourceKey: input.sourceKey ?? "",
    facts: [...input.facts]
      .map((fact) => ({ key: fact.key.trim().toLowerCase(), value: normalized(fact.value) }))
      .sort((a, b) => a.key.localeCompare(b.key) || a.value.localeCompare(b.value)),
  });
  return createHash("sha256").update(stable).digest("hex");
}

export function evaluateCurrentAffairsLocalization(args: {
  input: CurrentAffairsLocalizationInput;
  localizedTitle: string;
  localizedSummary: string;
  localizedOneLiner?: string;
  requiredKeys?: string[];
}): CurrentAffairsLocalizationQuality {
  const facts = factMap(args.input.facts);
  const keys = args.requiredKeys ?? requiredFactKeys(args.input.templateId, facts);
  const composite = [args.localizedTitle, args.localizedSummary, args.localizedOneLiner ?? ""].join(" ");
  const missingCanonicalFacts = keys
    .map((key) => ({ key, value: facts.get(key) ?? "" }))
    .filter((item) => item.value && !composite.includes(item.value));
  const sharedTranslationQuality = evaluateTranslationQuality({
    source: {
      stem: args.input.sourceTitle,
      explanation: args.input.sourceSummary,
      options: [],
    },
    target: {
      stem: args.localizedTitle,
      explanation: args.localizedSummary,
      options: [],
    },
    languageCode: args.input.languageCode,
    terms: [],
  });
  return {
    sharedTranslationQuality,
    requiredFactKeys: keys,
    missingCanonicalFacts,
    expectedScriptPresent: expectedScriptPresent(composite, args.input.languageCode),
  };
}

function rendered(args: {
  input: CurrentAffairsLocalizationInput;
  title: string;
  summary: string;
  oneLiner: string;
  requiredKeys: string[];
}): CurrentAffairsLocalizationOutput {
  const localizedTitle = normalized(args.title);
  const dateAnchor = localizedSourceDateAnchor(args.input.sourceSummary, args.input.languageCode);
  const summaryWithDate = dateAnchor ? `${dateAnchor} ${args.summary}` : args.summary;
  const localizedSummary = sentence(summaryWithDate, args.input.languageCode);
  const localizedOneLiner = sentence(args.oneLiner, args.input.languageCode);
  const quality = evaluateCurrentAffairsLocalization({
    input: args.input,
    localizedTitle,
    localizedSummary,
    localizedOneLiner,
    requiredKeys: args.requiredKeys,
  });
  const reasons: string[] = [];
  if (!quality.sharedTranslationQuality.approvable) {
    reasons.push("Shared translation quality gate reported one or more blocking errors");
  }
  if (quality.missingCanonicalFacts.length > 0) {
    reasons.push("One or more canonical fact values are missing from localized learner copy");
  }
  if (!quality.expectedScriptPresent) {
    reasons.push("Target-language script is absent from localized learner copy");
  }
  const ready = quality.sharedTranslationQuality.approvable
    && quality.missingCanonicalFacts.length === 0
    && quality.expectedScriptPresent;
  return {
    status: ready ? "ready" : "needs_editorial",
    localizedTitle: ready ? localizedTitle : undefined,
    localizedSummary: ready ? localizedSummary : undefined,
    localizedOneLiner: ready ? localizedOneLiner : undefined,
    templateId: args.input.templateId,
    inputFingerprint: localizationInputFingerprint(args.input),
    quality,
    reasons,
  };
}

function joinRateFacts(language: CurrentAffairsLocalizationLanguage, facts: Map<string, string>): string {
  const labels = language === "hi"
    ? [
        ["policy_repo_rate", "रेपो दर"],
        ["standing_deposit_facility_rate", "SDF"],
        ["marginal_standing_facility_rate", "MSF"],
        ["bank_rate", "बैंक दर"],
        ["cash_reserve_ratio", "CRR"],
        ["statutory_liquidity_ratio", "SLR"],
      ]
    : [
        ["policy_repo_rate", "ਰੇਪੋ ਦਰ"],
        ["standing_deposit_facility_rate", "SDF"],
        ["marginal_standing_facility_rate", "MSF"],
        ["bank_rate", "ਬੈਂਕ ਦਰ"],
        ["cash_reserve_ratio", "CRR"],
        ["statutory_liquidity_ratio", "SLR"],
      ];
  return labels
    .map(([key, label]) => facts.get(key) ? `${label} ${facts.get(key)}` : "")
    .filter(Boolean)
    .join("; ");
}

function genericFactLabel(language: CurrentAffairsLocalizationLanguage, key: string): string {
  return GENERIC_FACT_LABELS[language][key] ?? key.replace(/_/g, " ");
}

function genericFactDetails(
  language: CurrentAffairsLocalizationLanguage,
  facts: Map<string, string>,
  keys: string[],
): string {
  return keys
    .map((key) => facts.get(key) ? `${genericFactLabel(language, key)}: ${facts.get(key)}` : "")
    .filter(Boolean)
    .join("; ");
}

export function localizeCurrentAffairsAuthoring(input: CurrentAffairsLocalizationInput): CurrentAffairsLocalizationOutput {
  const facts = factMap(input.facts);
  const language = input.languageCode;
  const sourceName = SOURCE_NAMES[language][input.sourceKey ?? ""] ?? (language === "hi" ? "आधिकारिक स्रोत" : "ਅਧਿਕਾਰਤ ਸਰੋਤ");

  if (input.templateId === "appointment_v1") {
    const appointee = facts.get("appointee");
    const position = facts.get("position");
    if (appointee && position) {
      return language === "hi"
        ? rendered({
            input,
            title: `${appointee}: ${position} के रूप में नियुक्ति`,
            summary: `${appointee} को ${position} के रूप में नियुक्त किया गया है`,
            oneLiner: `${appointee} — ${position} के रूप में नियुक्त`,
            requiredKeys: ["appointee", "position"],
          })
        : rendered({
            input,
            title: `${appointee}: ${position} ਵਜੋਂ ਨਿਯੁਕਤੀ`,
            summary: `${appointee} ਨੂੰ ${position} ਵਜੋਂ ਨਿਯੁਕਤ ਕੀਤਾ ਗਿਆ ਹੈ`,
            oneLiner: `${appointee} — ${position} ਵਜੋਂ ਨਿਯੁਕਤ`,
            requiredKeys: ["appointee", "position"],
          });
    }
  }

  if (input.templateId === "rbi_financial_inclusion_index_v1") {
    const value = facts.get("index_value");
    if (value) {
      return language === "hi"
        ? rendered({
            input,
            title: `RBI वित्तीय समावेशन सूचकांक: ${value}`,
            summary: `भारतीय रिज़र्व बैंक का वित्तीय समावेशन सूचकांक ${value} दर्ज किया गया है`,
            oneLiner: `RBI वित्तीय समावेशन सूचकांक ${value} है`,
            requiredKeys: ["index_value"],
          })
        : rendered({
            input,
            title: `RBI ਵਿੱਤੀ ਸਮਾਵੇਸ਼ ਸੂਚਕਾਂਕ: ${value}`,
            summary: `ਭਾਰਤੀ ਰਿਜ਼ਰਵ ਬੈਂਕ ਦਾ ਵਿੱਤੀ ਸਮਾਵੇਸ਼ ਸੂਚਕਾਂਕ ${value} ਦਰਜ ਕੀਤਾ ਗਿਆ ਹੈ`,
            oneLiner: `RBI ਵਿੱਤੀ ਸਮਾਵੇਸ਼ ਸੂਚਕਾਂਕ ${value} ਹੈ`,
            requiredKeys: ["index_value"],
          });
    }
  }

  if (input.templateId === "rbi_policy_rates_v1") {
    const repo = facts.get("policy_repo_rate");
    const requiredKeys = requiredFactKeys(input.templateId, facts);
    if (repo && requiredKeys.length >= 2) {
      const details = joinRateFacts(language, facts);
      return language === "hi"
        ? rendered({
            input,
            title: `RBI नीति दरें: रेपो दर ${repo}`,
            summary: `भारतीय रिज़र्व बैंक की प्रमुख नीति दरें हैं: ${details}`,
            oneLiner: `RBI रेपो दर ${repo} है`,
            requiredKeys,
          })
        : rendered({
            input,
            title: `RBI ਨੀਤੀ ਦਰਾਂ: ਰੇਪੋ ਦਰ ${repo}`,
            summary: `ਭਾਰਤੀ ਰਿਜ਼ਰਵ ਬੈਂਕ ਦੀਆਂ ਮੁੱਖ ਨੀਤੀ ਦਰਾਂ ਹਨ: ${details}`,
            oneLiner: `RBI ਰੇਪੋ ਦਰ ${repo} ਹੈ`,
            requiredKeys,
          });
    }
  }

  if (input.templateId === "mou_v1") {
    const parties = facts.get("mou_parties");
    if (parties) {
      return language === "hi"
        ? rendered({
            input,
            title: `समझौता ज्ञापन (MoU): ${parties}`,
            summary: `${parties} के बीच समझौता ज्ञापन (MoU) किया गया है`,
            oneLiner: `MoU के पक्ष: ${parties}`,
            requiredKeys: ["mou_parties"],
          })
        : rendered({
            input,
            title: `ਸਮਝੌਤਾ ਯਾਦਦਾਸ਼ਤ (MoU): ${parties}`,
            summary: `${parties} ਵਿਚਕਾਰ ਸਮਝੌਤਾ ਯਾਦਦਾਸ਼ਤ (MoU) ਕੀਤੀ ਗਈ ਹੈ`,
            oneLiner: `MoU ਦੇ ਪੱਖ: ${parties}`,
            requiredKeys: ["mou_parties"],
          });
    }
  }

  if (input.templateId === "isro_mission_facts_v1") {
    const subject = authoringSubject(input.sourceTitle);
    const requiredKeys = requiredFactKeys(input.templateId, facts);
    if (subject && requiredKeys.length >= 2) {
      const detailParts = language === "hi"
        ? [
            facts.get("orbit_altitude") ? `कक्षा ऊंचाई ${facts.get("orbit_altitude")}` : "",
            facts.get("repeat_cycle") ? `पुनरावृत्ति चक्र ${facts.get("repeat_cycle")}` : "",
            facts.get("mission_life") ? `मिशन अवधि ${facts.get("mission_life")}` : "",
            facts.get("launcher") ? `प्रक्षेपण यान ${facts.get("launcher")}` : "",
          ]
        : [
            facts.get("orbit_altitude") ? `ਕਕਸ਼ ਉਚਾਈ ${facts.get("orbit_altitude")}` : "",
            facts.get("repeat_cycle") ? `ਦੁਹਰਾਵਾ ਚੱਕਰ ${facts.get("repeat_cycle")}` : "",
            facts.get("mission_life") ? `ਮਿਸ਼ਨ ਅਵਧੀ ${facts.get("mission_life")}` : "",
            facts.get("launcher") ? `ਲਾਂਚ ਵਾਹਨ ${facts.get("launcher")}` : "",
          ];
      const details = detailParts.filter(Boolean).join("; ");
      return language === "hi"
        ? rendered({
            input,
            title: `${subject}: ISRO मिशन के प्रमुख तथ्य`,
            summary: `${subject} के सत्यापित मिशन तथ्य हैं: ${details}`,
            oneLiner: `${subject} — ${details}`,
            requiredKeys,
          })
        : rendered({
            input,
            title: `${subject}: ISRO ਮਿਸ਼ਨ ਦੇ ਮੁੱਖ ਤੱਥ`,
            summary: `${subject} ਦੇ ਪ੍ਰਮਾਣਿਤ ਮਿਸ਼ਨ ਤੱਥ ਹਨ: ${details}`,
            oneLiner: `${subject} — ${details}`,
            requiredKeys,
          });
    }
  }

  if (input.templateId === "programme_outlay_v1") {
    const outlay = facts.get("scheme_outlay");
    const beneficiaries = facts.get("beneficiary_count");
    const effectiveDate = facts.get("effective_date");
    const requiredKeys = requiredFactKeys(input.templateId, facts);
    if (outlay && requiredKeys.length >= 2) {
      const details = language === "hi"
        ? [
            `परिव्यय ${outlay}`,
            beneficiaries ? `लाभार्थी ${beneficiaries}` : "",
            effectiveDate ? `प्रभावी तिथि ${effectiveDate}` : "",
          ].filter(Boolean).join("; ")
        : [
            `ਖਰਚਾ ${outlay}`,
            beneficiaries ? `ਲਾਭਪਾਤਰੀ ${beneficiaries}` : "",
            effectiveDate ? `ਲਾਗੂ ਮਿਤੀ ${effectiveDate}` : "",
          ].filter(Boolean).join("; ");
      return language === "hi"
        ? rendered({
            input,
            title: `${sourceName} कार्यक्रम: ${outlay} परिव्यय`,
            summary: `${sourceName} के सत्यापित कार्यक्रम तथ्य हैं: ${details}`,
            oneLiner: `${sourceName} कार्यक्रम — ${details}`,
            requiredKeys,
          })
        : rendered({
            input,
            title: `${sourceName} ਪ੍ਰੋਗਰਾਮ: ${outlay} ਖਰਚਾ`,
            summary: `${sourceName} ਦੇ ਪ੍ਰਮਾਣਿਤ ਪ੍ਰੋਗਰਾਮ ਤੱਥ ਹਨ: ${details}`,
            oneLiner: `${sourceName} ਪ੍ਰੋਗਰਾਮ — ${details}`,
            requiredKeys,
          });
    }
  }

  if (input.templateId === "verified_official_action_v1") {
    const actingEntity = facts.get("acting_entity");
    const officialAction = facts.get("official_action");
    const actionSubject = facts.get("action_subject");
    if (actingEntity && officialAction && actionSubject) {
      return language === "hi"
        ? rendered({
            input,
            title: `${sourceName} अपडेट: ${actionSubject}`,
            summary: `सत्यापित आधिकारिक तथ्यों के अनुसार आधिकारिक निकाय ${actingEntity}, कार्रवाई ${officialAction}, और विषय ${actionSubject} है`,
            oneLiner: `विषय: ${actionSubject}`,
            requiredKeys: ["acting_entity", "official_action", "action_subject"],
          })
        : rendered({
            input,
            title: `${sourceName} ਅਪਡੇਟ: ${actionSubject}`,
            summary: `ਪ੍ਰਮਾਣਿਤ ਅਧਿਕਾਰਤ ਤੱਥਾਂ ਅਨੁਸਾਰ ਅਧਿਕਾਰਤ ਸੰਸਥਾ ${actingEntity}, ਕਾਰਵਾਈ ${officialAction}, ਅਤੇ ਵਿਸ਼ਾ ${actionSubject} ਹੈ`,
            oneLiner: `ਵਿਸ਼ਾ: ${actionSubject}`,
            requiredKeys: ["acting_entity", "official_action", "action_subject"],
          });
    }
  }

  if (input.templateId === "verified_award_result_v1") {
    const winner = facts.get("winner");
    const award = facts.get("award_or_title");
    if (winner && award) {
      return language === "hi"
        ? rendered({
            input,
            title: `${sourceName} पुरस्कार अपडेट: ${award}`,
            summary: `सत्यापित तथ्यों में ${winner} विजेता और ${award} पुरस्कार या उपाधि के रूप में दर्ज है`,
            oneLiner: `${winner} — ${award}`,
            requiredKeys: ["winner", "award_or_title"],
          })
        : rendered({
            input,
            title: `${sourceName} ਇਨਾਮ ਅਪਡੇਟ: ${award}`,
            summary: `ਪ੍ਰਮਾਣਿਤ ਤੱਥਾਂ ਵਿੱਚ ${winner} ਜੇਤੂ ਅਤੇ ${award} ਇਨਾਮ ਜਾਂ ਖਿਤਾਬ ਵਜੋਂ ਦਰਜ ਹੈ`,
            oneLiner: `${winner} — ${award}`,
            requiredKeys: ["winner", "award_or_title"],
          });
    }
  }

  if (input.templateId === "verified_initiative_v1") {
    const launchingEntity = facts.get("launching_entity");
    const initiative = facts.get("initiative");
    if (launchingEntity && initiative) {
      return language === "hi"
        ? rendered({
            input,
            title: `${sourceName} पहल अपडेट: ${initiative}`,
            summary: `सत्यापित तथ्यों के अनुसार ${launchingEntity} आरंभ करने वाला निकाय है और पहल ${initiative} है`,
            oneLiner: `पहल: ${initiative}`,
            requiredKeys: ["launching_entity", "initiative"],
          })
        : rendered({
            input,
            title: `${sourceName} ਪਹਿਲ ਅਪਡੇਟ: ${initiative}`,
            summary: `ਪ੍ਰਮਾਣਿਤ ਤੱਥਾਂ ਅਨੁਸਾਰ ${launchingEntity} ਸ਼ੁਰੂ ਕਰਨ ਵਾਲੀ ਸੰਸਥਾ ਹੈ ਅਤੇ ਪਹਿਲ ${initiative} ਹੈ`,
            oneLiner: `ਪਹਿਲ: ${initiative}`,
            requiredKeys: ["launching_entity", "initiative"],
          });
    }
  }

  if (input.templateId === "generic_verified_fact_graph_v1") {
    const requiredKeys = requiredFactKeys(input.templateId, facts);
    if (requiredKeys.length >= 2) {
      const subject = GENERIC_SUBJECT_PRIORITY
        .map((key) => facts.get(key))
        .find((value) => usableFactValue(value));
      const details = genericFactDetails(language, facts, requiredKeys);
      return language === "hi"
        ? rendered({
            input,
            title: subject ? `${sourceName} सत्यापित अपडेट: ${subject}` : `${sourceName} सत्यापित करेंट अफेयर्स अपडेट`,
            summary: `इस विकास के सत्यापित तथ्य हैं: ${details}`,
            oneLiner: genericFactDetails(language, facts, requiredKeys.slice(0, 2)),
            requiredKeys,
          })
        : rendered({
            input,
            title: subject ? `${sourceName} ਪ੍ਰਮਾਣਿਤ ਅਪਡੇਟ: ${subject}` : `${sourceName} ਪ੍ਰਮਾਣਿਤ ਕਰੰਟ ਅਫੇਅਰਜ਼ ਅਪਡੇਟ`,
            summary: `ਇਸ ਵਿਕਾਸ ਦੇ ਪ੍ਰਮਾਣਿਤ ਤੱਥ ਹਨ: ${details}`,
            oneLiner: genericFactDetails(language, facts, requiredKeys.slice(0, 2)),
            requiredKeys,
          });
    }
  }

  const emptyQuality = evaluateCurrentAffairsLocalization({
    input,
    localizedTitle: language === "hi" ? "संपादकीय समीक्षा आवश्यक" : "ਸੰਪਾਦਕੀ ਸਮੀਖਿਆ ਲੋੜੀਂਦੀ",
    localizedSummary: language === "hi" ? "सुरक्षित स्वचालित स्थानीयकरण के लिए पर्याप्त संरचना उपलब्ध नहीं है।" : "ਸੁਰੱਖਿਅਤ ਆਟੋਮੈਟਿਕ ਸਥਾਨਕੀਕਰਨ ਲਈ ਕਾਫ਼ੀ ਸੰਰਚਨਾ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।",
    localizedOneLiner: "",
    requiredKeys: [],
  });
  return {
    status: "needs_editorial",
    templateId: input.templateId,
    inputFingerprint: localizationInputFingerprint(input),
    quality: emptyQuality,
    reasons: ["Current authoring template is not supported by deterministic Hindi/Punjabi localization"],
  };
}
