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

const SOURCE_NAMES: Record<CurrentAffairsLocalizationLanguage, Record<string, string>> = {
  hi: {
    pib: "भारत सरकार",
    rbi: "भारतीय रिज़र्व बैंक",
    sebi: "SEBI",
    isro: "ISRO",
    punjab_gov: "पंजाब सरकार",
  },
  pa: {
    pib: "ਭਾਰਤ ਸਰਕਾਰ",
    rbi: "ਭਾਰਤੀ ਰਿਜ਼ਰਵ ਬੈਂਕ",
    sebi: "SEBI",
    isro: "ISRO",
    punjab_gov: "ਪੰਜਾਬ ਸਰਕਾਰ",
  },
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
  return `${clean}${language === "pa" ? "।" : "।"}`;
}

function authoringSubject(sourceTitle: string): string | undefined {
  const colon = sourceTitle.indexOf(":");
  if (colon > 0) {
    const subject = sourceTitle.slice(0, colon).trim();
    if (subject.length >= 2 && subject.length <= 80) return subject;
  }
  return undefined;
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
  const localizedSummary = sentence(args.summary, args.input.languageCode);
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
    reasons: ["CP009 authoring template is not supported by deterministic Hindi/Punjabi localization"],
  };
}
