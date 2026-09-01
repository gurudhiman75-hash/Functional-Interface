import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";

export const DAILY_MASTER_PACK_LANGUAGES = ["en", "hi", "pa"] as const;
export type DailyMasterPackLanguage = (typeof DAILY_MASTER_PACK_LANGUAGES)[number];
const DAILY_PRODUCT_EXAM_FAMILIES = ["ssc", "banking", "punjab"] as const;

const CATEGORY_ORDER = [
  "national",
  "economy_banking",
  "international",
  "appointments",
  "awards",
  "reports_indices",
  "sports",
  "science_technology",
  "space",
  "defence",
  "environment",
  "books_authors",
  "important_days",
  "summits",
  "obituaries",
  "punjab",
  "other",
] as const;

const CATEGORY_LABELS: Record<DailyMasterPackLanguage, Record<string, string>> = {
  en: {
    national: "National Affairs",
    economy_banking: "Economy & Banking",
    international: "International Affairs",
    appointments: "Appointments",
    awards: "Awards & Honours",
    reports_indices: "Reports & Indices",
    sports: "Sports",
    science_technology: "Science & Technology",
    space: "Space",
    defence: "Defence",
    environment: "Environment",
    books_authors: "Books & Authors",
    important_days: "Important Days",
    summits: "Summits & Conferences",
    obituaries: "Obituaries",
    punjab: "Punjab",
    other: "Other Important Developments",
  },
  hi: {
    national: "राष्ट्रीय घटनाक्रम",
    economy_banking: "अर्थव्यवस्था एवं बैंकिंग",
    international: "अंतरराष्ट्रीय घटनाक्रम",
    appointments: "नियुक्तियाँ",
    awards: "पुरस्कार एवं सम्मान",
    reports_indices: "रिपोर्ट एवं सूचकांक",
    sports: "खेल",
    science_technology: "विज्ञान एवं प्रौद्योगिकी",
    space: "अंतरिक्ष",
    defence: "रक्षा",
    environment: "पर्यावरण",
    books_authors: "पुस्तकें एवं लेखक",
    important_days: "महत्वपूर्ण दिवस",
    summits: "शिखर सम्मेलन एवं सम्मेलन",
    obituaries: "निधन",
    punjab: "पंजाब",
    other: "अन्य महत्वपूर्ण घटनाक्रम",
  },
  pa: {
    national: "ਰਾਸ਼ਟਰੀ ਮਾਮਲੇ",
    economy_banking: "ਅਰਥਵਿਵਸਥਾ ਅਤੇ ਬੈਂਕਿੰਗ",
    international: "ਅੰਤਰਰਾਸ਼ਟਰੀ ਮਾਮਲੇ",
    appointments: "ਨਿਯੁਕਤੀਆਂ",
    awards: "ਇਨਾਮ ਅਤੇ ਸਨਮਾਨ",
    reports_indices: "ਰਿਪੋਰਟਾਂ ਅਤੇ ਸੂਚਕਾਂਕ",
    sports: "ਖੇਡਾਂ",
    science_technology: "ਵਿਗਿਆਨ ਅਤੇ ਤਕਨਾਲੋਜੀ",
    space: "ਅੰਤਰਿਕਸ਼",
    defence: "ਰੱਖਿਆ",
    environment: "ਵਾਤਾਵਰਣ",
    books_authors: "ਕਿਤਾਬਾਂ ਅਤੇ ਲੇਖਕ",
    important_days: "ਮਹੱਤਵਪੂਰਨ ਦਿਨ",
    summits: "ਸਿਖਰ ਸੰਮੇਲਨ ਅਤੇ ਕਾਨਫਰੰਸਾਂ",
    obituaries: "ਦਿਹਾਂਤ",
    punjab: "ਪੰਜਾਬ",
    other: "ਹੋਰ ਮਹੱਤਵਪੂਰਨ ਘਟਨਾਵਾਂ",
  },
};

const FACT_LABELS: Record<Exclude<DailyMasterPackLanguage, "en">, Record<string, string>> = {
  hi: {
    appointee: "नियुक्त व्यक्ति",
    position: "पद",
    index_value: "सूचकांक मान",
    policy_repo_rate: "रेपो दर",
    standing_deposit_facility_rate: "SDF",
    marginal_standing_facility_rate: "MSF",
    bank_rate: "बैंक दर",
    cash_reserve_ratio: "CRR",
    statutory_liquidity_ratio: "SLR",
    mou_parties: "MoU के पक्ष",
    orbit_altitude: "कक्षा ऊंचाई",
    repeat_cycle: "पुनरावृत्ति चक्र",
    mission_life: "मिशन अवधि",
    launcher: "प्रक्षेपण यान",
    scheme_outlay: "परिव्यय",
    beneficiary_count: "लाभार्थी",
    effective_date: "प्रभावी तिथि",
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
    headquarters: "मुख्यालय",
    target_percentage: "लक्ष्य",
    target_year: "लक्ष्य वर्ष",
    regulator: "नियामक",
    state: "राज्य",
  },
  pa: {
    appointee: "ਨਿਯੁਕਤ ਵਿਅਕਤੀ",
    position: "ਅਹੁਦਾ",
    index_value: "ਸੂਚਕਾਂਕ ਮੁੱਲ",
    policy_repo_rate: "ਰੇਪੋ ਦਰ",
    standing_deposit_facility_rate: "SDF",
    marginal_standing_facility_rate: "MSF",
    bank_rate: "ਬੈਂਕ ਦਰ",
    cash_reserve_ratio: "CRR",
    statutory_liquidity_ratio: "SLR",
    mou_parties: "MoU ਦੇ ਪੱਖ",
    orbit_altitude: "ਕਕਸ਼ ਉਚਾਈ",
    repeat_cycle: "ਦੁਹਰਾਵਾ ਚੱਕਰ",
    mission_life: "ਮਿਸ਼ਨ ਅਵਧੀ",
    launcher: "ਲਾਂਚ ਵਾਹਨ",
    scheme_outlay: "ਖਰਚਾ",
    beneficiary_count: "ਲਾਭਪਾਤਰੀ",
    effective_date: "ਲਾਗੂ ਮਿਤੀ",
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
    headquarters: "ਮੁੱਖ ਦਫ਼ਤਰ",
    target_percentage: "ਟੀਚਾ",
    target_year: "ਟੀਚਾ ਸਾਲ",
    regulator: "ਨਿਯਾਮਕ",
    state: "ਰਾਜ",
  },
};

const LANGUAGE_COPY = {
  en: {
    locale: "en-IN",
    title: "Examtree Daily Current Affairs",
    count: (events: number, sections: number) => `${events} verified, authoring-ready, exam-relevant developments · ${sections} sections`,
    intro: "Canonical draft generated from Examtree's verified Current Affairs event graph. This text is the shared source for web and text distribution; the English pack also drives the validated PDF renderer. Editorial approval remains separate.",
    why: "Why in News",
    facts: "Key Facts",
    remember: "Remember",
    exam: "Exam relevance",
    evidence: "Evidence",
    primary: "Primary",
    supporting: "Supporting",
    footer: "Draft only. Publication and Question Bank promotion require separate editorial authority.",
  },
  hi: {
    locale: "hi-IN",
    title: "Examtree दैनिक करेंट अफेयर्स",
    count: (events: number, sections: number) => `${events} सत्यापित, परीक्षा-प्रासंगिक घटनाक्रम · ${sections} खंड`,
    intro: "यह कैनोनिकल ड्राफ्ट Examtree के सत्यापित Current Affairs event graph और स्वीकृत हिंदी localization records से बनाया गया है। अंग्रेज़ी, हिंदी और पंजाबी master packs में event-ID parity अनिवार्य है। संपादकीय स्वीकृति अलग चरण है।",
    why: "समाचार में क्यों",
    facts: "मुख्य तथ्य",
    remember: "याद रखें",
    exam: "परीक्षा प्रासंगिकता",
    evidence: "साक्ष्य",
    primary: "प्राथमिक",
    supporting: "सहायक",
    footer: "केवल ड्राफ्ट। प्रकाशन और Question Bank promotion के लिए अलग संपादकीय अनुमति आवश्यक है।",
  },
  pa: {
    locale: "pa-IN",
    title: "Examtree ਰੋਜ਼ਾਨਾ ਕਰੰਟ ਅਫੇਅਰਜ਼",
    count: (events: number, sections: number) => `${events} ਪ੍ਰਮਾਣਿਤ, ਪ੍ਰੀਖਿਆ-ਸੰਬੰਧਿਤ ਘਟਨਾਵਾਂ · ${sections} ਭਾਗ`,
    intro: "ਇਹ ਕੈਨੋਨਿਕਲ ਡਰਾਫਟ Examtree ਦੇ ਪ੍ਰਮਾਣਿਤ Current Affairs event graph ਅਤੇ ਮਨਜ਼ੂਰਸ਼ੁਦਾ ਪੰਜਾਬੀ localization records ਤੋਂ ਬਣਾਇਆ ਗਿਆ ਹੈ। ਅੰਗਰੇਜ਼ੀ, ਹਿੰਦੀ ਅਤੇ ਪੰਜਾਬੀ master packs ਵਿੱਚ event-ID parity ਲਾਜ਼ਮੀ ਹੈ। ਸੰਪਾਦਕੀ ਮਨਜ਼ੂਰੀ ਵੱਖਰਾ ਪੜਾਅ ਹੈ।",
    why: "ਖ਼ਬਰਾਂ ਵਿੱਚ ਕਿਉਂ",
    facts: "ਮੁੱਖ ਤੱਥ",
    remember: "ਯਾਦ ਰੱਖੋ",
    exam: "ਪ੍ਰੀਖਿਆ ਸੰਬੰਧਤਾ",
    evidence: "ਸਬੂਤ",
    primary: "ਮੁੱਖ ਸਰੋਤ",
    supporting: "ਸਹਾਇਕ",
    footer: "ਕੇਵਲ ਡਰਾਫਟ। ਪ੍ਰਕਾਸ਼ਨ ਅਤੇ Question Bank promotion ਲਈ ਵੱਖਰੀ ਸੰਪਾਦਕੀ ਮਨਜ਼ੂਰੀ ਲੋੜੀਂਦੀ ਹੈ।",
  },
} satisfies Record<DailyMasterPackLanguage, {
  locale: string;
  title: string;
  count: (events: number, sections: number) => string;
  intro: string;
  why: string;
  facts: string;
  remember: string;
  exam: string;
  evidence: string;
  primary: string;
  supporting: string;
  footer: string;
}>;

export type DailyMasterPackEvent = {
  id: string;
  publicCode: string;
  category: string;
  eventDate: string;
  title: string;
  summary: string;
  oneLiner: string;
  examFamilies: string[];
  facts: Array<{ key: string; label?: string; value: string; type: string | null; confidence: number }>;
  sources: Array<{ name: string; url: string; primary: boolean }>;
};

export type DailyMasterPackPayload = {
  contentDate: string;
  generatedAt: string;
  language: DailyMasterPackLanguage;
  eventCount: number;
  categoryCount: number;
  sections: Array<{ category: string; label: string; events: DailyMasterPackEvent[] }>;
};

function clean(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function parseArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value as T[] : [];
}

function markdownSafe(value: string): string {
  return value.replace(/([\\`*_{}\[\]()#+.!>|-])/g, "\\$1");
}

export function assertDailyMasterPackLanguage(value: unknown): DailyMasterPackLanguage {
  const language = String(value ?? "en").trim().toLowerCase();
  if ((DAILY_MASTER_PACK_LANGUAGES as readonly string[]).includes(language)) return language as DailyMasterPackLanguage;
  throw new Error("Daily master pack language must be en, hi or pa");
}

function factLabel(language: DailyMasterPackLanguage, key: string) {
  if (language === "en") return key.replace(/_/g, " ");
  return FACT_LABELS[language][key] ?? key.replace(/_/g, " ");
}

function dateLabel(contentDate: string, language: DailyMasterPackLanguage) {
  return new Intl.DateTimeFormat(LANGUAGE_COPY[language].locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${contentDate}T00:00:00Z`));
}

export function buildDailyMasterPackPayload(
  contentDate: string,
  events: DailyMasterPackEvent[],
  language: DailyMasterPackLanguage = "en",
): DailyMasterPackPayload {
  const sections = CATEGORY_ORDER
    .map((category) => ({
      category,
      label: CATEGORY_LABELS[language][category] ?? category,
      events: events.filter((event) => event.category === category),
    }))
    .filter((section) => section.events.length > 0);

  return {
    contentDate,
    generatedAt: new Date().toISOString(),
    language,
    eventCount: events.length,
    categoryCount: sections.length,
    sections,
  };
}

export function renderDailyMasterPackMarkdown(payload: DailyMasterPackPayload): string {
  const copy = LANGUAGE_COPY[payload.language];
  const lines: string[] = [
    `# ${copy.title} — ${dateLabel(payload.contentDate, payload.language)}`,
    "",
    `**${copy.count(payload.eventCount, payload.categoryCount)}**`,
    "",
    `> ${copy.intro}`,
    "",
  ];

  let ordinal = 1;
  for (const section of payload.sections) {
    lines.push(`## ${section.label}`, "");
    for (const event of section.events) {
      lines.push(`### ${ordinal}. ${markdownSafe(event.title)}`, "");
      if (event.summary) lines.push(`**${copy.why}**`, "", markdownSafe(event.summary), "");
      if (event.facts.length > 0) {
        lines.push(`**${copy.facts}**`, "");
        for (const fact of event.facts.slice(0, 12)) {
          const label = clean(fact.label) || factLabel(payload.language, fact.key);
          lines.push(`- **${markdownSafe(label)}:** ${markdownSafe(fact.value)}`);
        }
        lines.push("");
      }
      if (event.oneLiner) lines.push(`**${copy.remember}:** ${markdownSafe(event.oneLiner)}`, "");
      lines.push(`**${copy.exam}:** ${event.examFamilies.map((item) => item.toUpperCase()).join(" · ")}`, "");
      if (event.sources.length > 0) {
        lines.push(`**${copy.evidence}**`, "");
        for (const source of event.sources.slice(0, 4)) {
          lines.push(`- ${source.primary ? copy.primary : copy.supporting}: [${markdownSafe(source.name)}](${source.url})`);
        }
        lines.push("");
      }
      ordinal += 1;
    }
  }

  lines.push("---", "", `*${copy.footer}*`, "");
  return lines.join("\n");
}

async function loadMasterPackEvents(
  contentDate: string,
  language: DailyMasterPackLanguage,
): Promise<DailyMasterPackEvent[]> {
  const rows = await sqlClient`
    SELECT
      event.id::text AS id,
      event.public_code AS "publicCode",
      event.category,
      event.event_date::text AS "eventDate",
      CASE WHEN ${language}='en'
        THEN COALESCE(version.learner_title, event.canonical_title)
        ELSE localization.localized_title
      END AS title,
      CASE WHEN ${language}='en'
        THEN COALESCE(version.learner_summary, event.summary, '')
        ELSE COALESCE(localization.localized_summary, '')
      END AS summary,
      CASE WHEN ${language}='en'
        THEN COALESCE(version.learner_one_liner, '')
        ELSE COALESCE(localization.localized_one_liner, localization.localized_summary, '')
      END AS "oneLiner",
      COALESCE(scores.families, ARRAY[]::text[]) AS "examFamilies",
      COALESCE(facts.items, '[]'::json) AS facts,
      COALESCE(sources.items, '[]'::json) AS sources
    FROM content.current_affairs_events event
    LEFT JOIN content.current_affairs_authoring_versions version
      ON version.id=event.learner_authoring_version_id
    LEFT JOIN content.current_affairs_localizations localization
      ON localization.event_id=event.id
      AND localization.authoring_version_id=event.learner_authoring_version_id
      AND localization.language_code=${language}
      AND localization.status IN ('ready','manual')
    LEFT JOIN LATERAL (
      SELECT array_agg(DISTINCT score.exam_family_key ORDER BY score.exam_family_key) AS families
      FROM content.current_affairs_exam_scores score
      WHERE score.event_id=event.id
        AND score.include_recommended=true
        AND score.exam_family_key IN ('ssc','banking','punjab')
    ) scores ON true
    LEFT JOIN LATERAL (
      SELECT json_agg(json_build_object(
        'key', fact.fact_key,
        'value', fact.fact_value,
        'type', fact.fact_type,
        'confidence', fact.confidence::float8
      ) ORDER BY fact.sort_order, fact.fact_key, fact.fact_value) AS items
      FROM content.current_affairs_facts fact
      WHERE fact.event_id=event.id AND fact.is_verified=true
    ) facts ON true
    LEFT JOIN LATERAL (
      SELECT json_agg(json_build_object(
        'name', source.name,
        'url', evidence.source_url,
        'primary', evidence.is_primary_evidence
      ) ORDER BY evidence.is_primary_evidence DESC, source.trust_score DESC, evidence.created_at ASC) AS items
      FROM content.current_affairs_event_sources evidence
      JOIN content.current_affairs_sources source ON source.id=evidence.source_id
      WHERE evidence.event_id=event.id AND evidence.source_url IS NOT NULL
    ) sources ON true
    WHERE event.event_date=${contentDate}::date
      AND event.status='verified'
      AND event.learner_authoring_status IN ('ready','manual')
      AND (${language}='en' OR localization.id IS NOT NULL)
      AND EXISTS (
        SELECT 1
        FROM content.current_affairs_exam_scores relevance
        WHERE relevance.event_id=event.id
          AND relevance.include_recommended=true
          AND relevance.exam_family_key IN ('ssc','banking','punjab')
      )
      AND NOT EXISTS (
        SELECT 1 FROM content.current_affairs_fact_conflicts conflict
        WHERE conflict.event_id=event.id AND conflict.status='open'
      )
    ORDER BY event.category, event.canonical_title
  `;

  return rows.map((row) => ({
    id: String(row.id),
    publicCode: String(row.publicCode),
    category: String(row.category),
    eventDate: String(row.eventDate).slice(0, 10),
    title: clean(row.title),
    summary: clean(row.summary),
    oneLiner: clean(row.oneLiner),
    examFamilies: parseArray<string>(row.examFamilies)
      .map(String)
      .filter((family) => (DAILY_PRODUCT_EXAM_FAMILIES as readonly string[]).includes(family)),
    facts: parseArray<Record<string, unknown>>(row.facts).map((fact) => ({
      key: clean(fact.key),
      label: factLabel(language, clean(fact.key)),
      value: clean(fact.value),
      type: fact.type ? clean(fact.type) : null,
      confidence: Number(fact.confidence ?? 0),
    })).filter((fact) => fact.key && fact.value),
    sources: parseArray<Record<string, unknown>>(row.sources).map((source) => ({
      name: clean(source.name),
      url: clean(source.url),
      primary: Boolean(source.primary),
    })).filter((source) => source.name && source.url.startsWith("https://")),
  }));
}

export function evaluateLocalizedMasterPackParity(
  englishEvents: Array<Pick<DailyMasterPackEvent, "id" | "publicCode">>,
  localizedEvents: Array<Pick<DailyMasterPackEvent, "id" | "publicCode">>,
) {
  const english = new Map(englishEvents.map((event) => [event.id, event.publicCode]));
  const localized = new Map(localizedEvents.map((event) => [event.id, event.publicCode]));
  const missingEventIds = [...english.keys()].filter((id) => !localized.has(id));
  const extraEventIds = [...localized.keys()].filter((id) => !english.has(id));
  return {
    complete: english.size > 0 && missingEventIds.length === 0 && extraEventIds.length === 0,
    expectedEventCount: english.size,
    localizedEventCount: localized.size,
    missingEventIds,
    missingPublicCodes: missingEventIds.map((id) => english.get(id)!).filter(Boolean),
    extraEventIds,
  };
}

function publicCode(contentDate: string, language: DailyMasterPackLanguage) {
  return `CA_MASTER_D_${contentDate.replaceAll("-", "")}_${language.toUpperCase()}`;
}

function resourceTitle(contentDate: string, language: DailyMasterPackLanguage) {
  return `${LANGUAGE_COPY[language].title} — ${contentDate}`;
}

function resourceSummary(payload: DailyMasterPackPayload) {
  if (payload.language === "hi") {
    return `${payload.eventCount} सत्यापित परीक्षा-प्रासंगिक Current Affairs घटनाक्रम ${payload.categoryCount} खंडों में। अंग्रेज़ी master pack के साथ event-ID parity वाला कैनोनिकल ड्राफ्ट।`;
  }
  if (payload.language === "pa") {
    return `${payload.eventCount} ਪ੍ਰਮਾਣਿਤ ਪ੍ਰੀਖਿਆ-ਸੰਬੰਧਿਤ Current Affairs ਘਟਨਾਵਾਂ ${payload.categoryCount} ਭਾਗਾਂ ਵਿੱਚ। ਅੰਗਰੇਜ਼ੀ master pack ਨਾਲ event-ID parity ਵਾਲਾ ਕੈਨੋਨਿਕਲ ਡਰਾਫਟ।`;
  }
  return `${payload.eventCount} verified exam-relevant Current Affairs developments across ${payload.categoryCount} sections. Canonical draft for text and PDF distribution.`;
}

export async function materializeDailyMasterPack(
  contentDate: string,
  censusId?: string | null,
  languageInput: DailyMasterPackLanguage = "en",
) {
  const language = assertDailyMasterPackLanguage(languageInput);
  const existing = await sqlClient`
    SELECT pack.id::text AS id, pack.status,
           pack.learning_resource_id::text AS "learningResourceId",
           resource.status AS "resourceStatus"
    FROM content.current_affairs_daily_master_packs pack
    JOIN content.learning_resources resource ON resource.id=pack.learning_resource_id
    WHERE pack.content_date=${contentDate}::date AND pack.language_code=${language}
    LIMIT 1
  `;
  if (existing[0] && (String(existing[0].status) === "approved" || String(existing[0].resourceStatus) === "published")) {
    return {
      created: false,
      updated: false,
      locked: true,
      id: String(existing[0].id),
      language,
      learningResourceId: String(existing[0].learningResourceId),
      reason: "approved_or_published_master_pack_is_immutable",
    };
  }

  const englishEvents = await loadMasterPackEvents(contentDate, "en");
  if (englishEvents.length === 0) {
    return { created: false, updated: false, locked: false, language, reason: "no_verified_authoring_ready_exam_relevant_events", eventCount: 0 };
  }

  const events = language === "en" ? englishEvents : await loadMasterPackEvents(contentDate, language);
  if (language !== "en") {
    const parity = evaluateLocalizedMasterPackParity(englishEvents, events);
    if (!parity.complete) {
      return {
        created: false,
        updated: false,
        locked: false,
        language,
        reason: "localized_event_parity_incomplete",
        eventCount: events.length,
        parity,
      };
    }
  }

  const payload = buildDailyMasterPackPayload(contentDate, events, language);
  const bodyMarkdown = renderDailyMasterPackMarkdown(payload);
  const code = publicCode(contentDate, language);
  const title = resourceTitle(contentDate, language);
  const summary = resourceSummary(payload);
  const resourceId = existing[0]?.learningResourceId ? String(existing[0].learningResourceId) : randomUUID();
  const packId = existing[0]?.id ? String(existing[0].id) : randomUUID();
  const renderTargets = ["web", "text", "pdf"];

  await sqlClient.begin(async (tx) => {
    await tx`
      INSERT INTO content.learning_resources (
        id, public_code, category, format, title, summary, language_code,
        content_date, body_markdown, content_url, status, created_at, updated_at
      ) VALUES (
        ${resourceId}::uuid, ${code}, 'current_affairs', 'article', ${title}, ${summary},
        ${language}, ${contentDate}::date, ${bodyMarkdown}, null, 'draft', now(), now()
      )
      ON CONFLICT (public_code) DO UPDATE SET
        title=EXCLUDED.title,
        summary=EXCLUDED.summary,
        body_markdown=EXCLUDED.body_markdown,
        content_date=EXCLUDED.content_date,
        updated_at=now()
      WHERE content.learning_resources.status='draft'
    `;
    await tx`
      INSERT INTO content.current_affairs_daily_master_packs (
        id, public_code, content_date, language_code, status, census_id,
        learning_resource_id, event_count, category_count, body_markdown,
        payload, render_targets, generated_at, created_at, updated_at
      ) VALUES (
        ${packId}::uuid, ${code}, ${contentDate}::date, ${language}, 'draft',
        ${censusId ?? null}::uuid, ${resourceId}::uuid, ${payload.eventCount}, ${payload.categoryCount},
        ${bodyMarkdown}, ${JSON.stringify(payload)}::jsonb,
        ${JSON.stringify(renderTargets)}::jsonb, now(), now(), now()
      )
      ON CONFLICT (content_date, language_code) DO UPDATE SET
        census_id=EXCLUDED.census_id,
        event_count=EXCLUDED.event_count,
        category_count=EXCLUDED.category_count,
        body_markdown=EXCLUDED.body_markdown,
        payload=EXCLUDED.payload,
        render_targets=EXCLUDED.render_targets,
        generated_at=now(), updated_at=now()
      WHERE content.current_affairs_daily_master_packs.status IN ('draft','review')
    `;
  });

  return {
    created: !existing[0],
    updated: Boolean(existing[0]),
    locked: false,
    id: packId,
    publicCode: code,
    language,
    learningResourceId: resourceId,
    eventCount: payload.eventCount,
    categoryCount: payload.categoryCount,
    bodyMarkdown,
    payload,
    renderTargets,
  };
}

export async function materializeDailyMasterPacks(contentDate: string, censusId?: string | null) {
  const en = await materializeDailyMasterPack(contentDate, censusId, "en");
  const hi = await materializeDailyMasterPack(contentDate, censusId, "hi");
  const pa = await materializeDailyMasterPack(contentDate, censusId, "pa");
  return {
    en,
    hi,
    pa,
    allLocalizedParityReady: [hi, pa].every((item) => item.locked || item.reason !== "localized_event_parity_incomplete"),
  };
}

export async function loadDailyMasterPack(
  contentDate: string,
  languageInput: DailyMasterPackLanguage = "en",
) {
  const language = assertDailyMasterPackLanguage(languageInput);
  const rows = await sqlClient`
    SELECT pack.id::text AS id, pack.public_code AS "publicCode",
      pack.content_date::text AS "contentDate", pack.language_code AS language,
      pack.status, pack.event_count::int AS "eventCount", pack.category_count::int AS "categoryCount",
      pack.body_markdown AS "bodyMarkdown", pack.payload, pack.render_targets AS "renderTargets",
      pack.learning_resource_id::text AS "learningResourceId", pack.generated_at::text AS "generatedAt",
      resource.status AS "learningResourceStatus"
    FROM content.current_affairs_daily_master_packs pack
    JOIN content.learning_resources resource ON resource.id=pack.learning_resource_id
    WHERE pack.content_date=${contentDate}::date AND pack.language_code=${language}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function loadDailyMasterPacks(contentDate: string) {
  const [en, hi, pa] = await Promise.all([
    loadDailyMasterPack(contentDate, "en"),
    loadDailyMasterPack(contentDate, "hi"),
    loadDailyMasterPack(contentDate, "pa"),
  ]);
  return { en, hi, pa };
}
