import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import {
  evaluateCurrentAffairsLocalization,
  localizeCurrentAffairsAuthoring,
  localizationInputFingerprint,
  type CurrentAffairsLocalizationInput,
  type CurrentAffairsLocalizationLanguage,
  type LocalizationFact,
} from "./multilingual-localization";

const LOCALIZATION_VERSION = "ca-cp035-generic-multilingual-recovery-v1";
export const CURRENT_AFFAIRS_LOCALIZATION_LANGUAGES = ["hi", "pa"] as const;

const FACT_LABELS: Record<CurrentAffairsLocalizationLanguage, Record<string, string>> = {
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
  },
};

type LocalizationQueueRow = {
  eventId: string;
  publicCode: string;
  eventDate: string;
  category: string;
  authoringVersionId: string;
  authoringStatus: string;
  sourceTitle: string;
  sourceSummary: string;
  sourceOneLiner: string;
  templateId?: string;
  sourceKey?: string;
  facts: LocalizationFact[];
};

function normalizeFacts(value: unknown): LocalizationFact[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => item && typeof item === "object" && !Array.isArray(item) ? item as Record<string, unknown> : {})
    .map((item) => ({
      key: String(item.key ?? "").trim(),
      value: String(item.value ?? "").trim(),
      type: item.type ? String(item.type) : undefined,
    }))
    .filter((item) => item.key && item.value);
}

function localizationInput(row: LocalizationQueueRow, languageCode: CurrentAffairsLocalizationLanguage): CurrentAffairsLocalizationInput {
  return {
    eventId: row.eventId,
    authoringVersionId: row.authoringVersionId,
    languageCode,
    sourceTitle: row.sourceTitle,
    sourceSummary: row.sourceSummary,
    sourceOneLiner: row.sourceOneLiner,
    templateId: row.templateId,
    sourceKey: row.sourceKey,
    facts: row.facts,
  };
}

async function loadLocalizationQueue(limit: number): Promise<LocalizationQueueRow[]> {
  const rows = await sqlClient`
    SELECT
      event.id::text AS "eventId",
      event.public_code AS "publicCode",
      event.event_date::text AS "eventDate",
      event.category,
      version.id::text AS "authoringVersionId",
      version.status AS "authoringStatus",
      version.learner_title AS "sourceTitle",
      version.learner_summary AS "sourceSummary",
      COALESCE(version.learner_one_liner, version.learner_summary) AS "sourceOneLiner",
      version.template_id AS "templateId",
      source.source_key AS "sourceKey",
      version.input_fact_snapshot AS facts
    FROM content.current_affairs_events event
    JOIN content.current_affairs_authoring_versions version
      ON version.id=event.learner_authoring_version_id
    LEFT JOIN LATERAL (
      SELECT evidence.source_id
      FROM content.current_affairs_event_sources evidence
      WHERE evidence.event_id=event.id
      ORDER BY evidence.is_primary_evidence DESC, evidence.created_at ASC
      LIMIT 1
    ) primary_evidence ON true
    LEFT JOIN content.current_affairs_sources source ON source.id=primary_evidence.source_id
    WHERE event.status='verified'
      AND event.learner_authoring_status IN ('ready', 'manual')
      AND version.status IN ('ready', 'manual')
      AND BTRIM(COALESCE(version.learner_title, '')) <> ''
      AND BTRIM(COALESCE(version.learner_summary, '')) <> ''
    ORDER BY event.event_date DESC, event.updated_at DESC
    LIMIT ${limit}
  `;
  return rows.map((row) => ({
    eventId: String(row.eventId),
    publicCode: String(row.publicCode),
    eventDate: String(row.eventDate).slice(0, 10),
    category: String(row.category),
    authoringVersionId: String(row.authoringVersionId),
    authoringStatus: String(row.authoringStatus),
    sourceTitle: String(row.sourceTitle ?? ""),
    sourceSummary: String(row.sourceSummary ?? ""),
    sourceOneLiner: String(row.sourceOneLiner ?? row.sourceSummary ?? ""),
    templateId: row.templateId ? String(row.templateId) : undefined,
    sourceKey: row.sourceKey ? String(row.sourceKey) : undefined,
    facts: normalizeFacts(row.facts),
  }));
}

async function storeLocalization(
  row: LocalizationQueueRow,
  languageCode: CurrentAffairsLocalizationLanguage,
  output: ReturnType<typeof localizeCurrentAffairsAuthoring>,
) {
  const existing = await sqlClient`
    SELECT id::text AS id, input_fingerprint AS "inputFingerprint", status
    FROM content.current_affairs_localizations
    WHERE authoring_version_id=${row.authoringVersionId}::uuid
      AND language_code=${languageCode}
    LIMIT 1
  `;
  if (existing[0] && String(existing[0].status) === "manual") {
    return { id: String(existing[0].id), unchanged: true, status: "manual" };
  }
  if (existing[0] && String(existing[0].inputFingerprint) === output.inputFingerprint) {
    return { id: String(existing[0].id), unchanged: true, status: String(existing[0].status) };
  }

  const id = existing[0] ? String(existing[0].id) : randomUUID();
  const qualitySnapshot = {
    localizationVersion: LOCALIZATION_VERSION,
    shared: output.quality.sharedTranslationQuality,
    requiredFactKeys: output.quality.requiredFactKeys,
    missingCanonicalFacts: output.quality.missingCanonicalFacts,
    expectedScriptPresent: output.quality.expectedScriptPresent,
    semanticParityPassed: output.quality.missingCanonicalFacts.length === 0,
  };
  await sqlClient`
    INSERT INTO content.current_affairs_localizations (
      id, event_id, authoring_version_id, language_code, status,
      localized_title, localized_summary, localized_one_liner,
      template_id, localization_method, input_fingerprint, fact_snapshot,
      quality_snapshot, reasons, created_at, updated_at
    ) VALUES (
      ${id}::uuid, ${row.eventId}::uuid, ${row.authoringVersionId}::uuid, ${languageCode}, ${output.status},
      ${output.localizedTitle ?? null}, ${output.localizedSummary ?? null}, ${output.localizedOneLiner ?? null},
      ${output.templateId ?? null}, 'deterministic_template_v1', ${output.inputFingerprint},
      ${JSON.stringify(row.facts)}::jsonb, ${JSON.stringify(qualitySnapshot)}::jsonb,
      ${JSON.stringify(output.reasons)}::jsonb, now(), now()
    )
    ON CONFLICT (authoring_version_id, language_code) DO UPDATE
    SET status=EXCLUDED.status,
        localized_title=EXCLUDED.localized_title,
        localized_summary=EXCLUDED.localized_summary,
        localized_one_liner=EXCLUDED.localized_one_liner,
        template_id=EXCLUDED.template_id,
        localization_method='deterministic_template_v1',
        input_fingerprint=EXCLUDED.input_fingerprint,
        fact_snapshot=EXCLUDED.fact_snapshot,
        quality_snapshot=EXCLUDED.quality_snapshot,
        reasons=EXCLUDED.reasons,
        reviewed_by=NULL,
        updated_at=now()
  `;
  return { id, unchanged: false, status: output.status };
}

export async function runCurrentAffairsLocalization(limit = 200) {
  const safeLimit = Math.max(1, Math.min(500, Math.floor(limit)));
  const rows = await loadLocalizationQueue(safeLimit);
  const results: Array<Record<string, unknown>> = [];
  for (const row of rows) {
    for (const languageCode of CURRENT_AFFAIRS_LOCALIZATION_LANGUAGES) {
      const input = localizationInput(row, languageCode);
      const output = localizeCurrentAffairsAuthoring(input);
      const stored = await storeLocalization(row, languageCode, output);
      results.push({
        eventId: row.eventId,
        publicCode: row.publicCode,
        authoringVersionId: row.authoringVersionId,
        languageCode,
        status: stored.unchanged ? "unchanged" : output.status,
        localizationStatus: stored.status,
        localizationId: stored.id,
        reasons: output.reasons,
      });
    }
  }
  return {
    examinedEvents: rows.length,
    examinedLocalizations: results.length,
    ready: results.filter((item) => item.status === "ready").length,
    needsEditorial: results.filter((item) => item.status === "needs_editorial").length,
    unchanged: results.filter((item) => item.status === "unchanged").length,
    results,
  };
}

async function loadManualLocalizationInput(
  eventId: string,
  languageCode: CurrentAffairsLocalizationLanguage,
): Promise<CurrentAffairsLocalizationInput & { currentStatus: string }> {
  const rows = await sqlClient`
    SELECT
      event.status AS "currentStatus",
      version.id::text AS "authoringVersionId",
      version.learner_title AS "sourceTitle",
      version.learner_summary AS "sourceSummary",
      COALESCE(version.learner_one_liner, version.learner_summary) AS "sourceOneLiner",
      version.template_id AS "templateId",
      source.source_key AS "sourceKey",
      version.input_fact_snapshot AS facts
    FROM content.current_affairs_events event
    JOIN content.current_affairs_authoring_versions version
      ON version.id=event.learner_authoring_version_id
    LEFT JOIN LATERAL (
      SELECT evidence.source_id
      FROM content.current_affairs_event_sources evidence
      WHERE evidence.event_id=event.id
      ORDER BY evidence.is_primary_evidence DESC, evidence.created_at ASC
      LIMIT 1
    ) primary_evidence ON true
    LEFT JOIN content.current_affairs_sources source ON source.id=primary_evidence.source_id
    WHERE event.id=${eventId}::uuid
      AND event.learner_authoring_status IN ('ready', 'manual')
    LIMIT 1
  `;
  const row = rows[0];
  if (!row) throw new Error("Current Affairs event or accepted learner authoring not found");
  return {
    eventId,
    authoringVersionId: String(row.authoringVersionId),
    languageCode,
    sourceTitle: String(row.sourceTitle ?? ""),
    sourceSummary: String(row.sourceSummary ?? ""),
    sourceOneLiner: String(row.sourceOneLiner ?? row.sourceSummary ?? ""),
    templateId: row.templateId ? String(row.templateId) : undefined,
    sourceKey: row.sourceKey ? String(row.sourceKey) : undefined,
    facts: normalizeFacts(row.facts),
    currentStatus: String(row.currentStatus),
  };
}

export async function createManualCurrentAffairsLocalization(args: {
  eventId: string;
  languageCode: CurrentAffairsLocalizationLanguage;
  title: string;
  summary: string;
  oneLiner?: string;
  reason: string;
  actorUserId: string;
}) {
  const input = await loadManualLocalizationInput(args.eventId, args.languageCode);
  if (input.currentStatus !== "verified") throw new Error("Only verified Current Affairs events can receive localization");
  const title = args.title.replace(/\s+/g, " ").trim();
  const summary = args.summary.replace(/\s+/g, " ").trim();
  const oneLiner = String(args.oneLiner ?? summary).replace(/\s+/g, " ").trim();
  if (title.length < 8 || title.length > 300) throw new Error("Localized title must contain 8 to 300 characters");
  if (summary.length < 20 || summary.length > 6000) throw new Error("Localized summary must contain 20 to 6000 characters");
  if (args.reason.trim().length < 8) throw new Error("Manual localization requires an editorial reason");

  const quality = evaluateCurrentAffairsLocalization({
    input,
    localizedTitle: title,
    localizedSummary: summary,
    localizedOneLiner: oneLiner,
  });
  if (!quality.sharedTranslationQuality.approvable) {
    throw new Error(`Localization quality failed: ${quality.sharedTranslationQuality.issues.filter((issue) => issue.severity === "error").map((issue) => issue.code).join(", ")}`);
  }
  if (quality.missingCanonicalFacts.length > 0) {
    throw new Error(`Localization parity failed: canonical fact values missing for ${quality.missingCanonicalFacts.map((item) => item.key).join(", ")}`);
  }
  if (!quality.expectedScriptPresent) throw new Error("Localization must contain the requested target-language script");

  const localizationId = randomUUID();
  const fingerprint = localizationInputFingerprint(input);
  const qualitySnapshot = {
    localizationVersion: LOCALIZATION_VERSION,
    shared: quality.sharedTranslationQuality,
    requiredFactKeys: quality.requiredFactKeys,
    missingCanonicalFacts: quality.missingCanonicalFacts,
    expectedScriptPresent: quality.expectedScriptPresent,
    semanticParityPassed: true,
    manualEditorialReview: true,
  };
  await sqlClient.begin(async (tx) => {
    const existing = await tx`
      SELECT id::text AS id
      FROM content.current_affairs_localizations
      WHERE authoring_version_id=${input.authoringVersionId}::uuid
        AND language_code=${args.languageCode}
      LIMIT 1
    `;
    const id = existing[0] ? String(existing[0].id) : localizationId;
    await tx`
      INSERT INTO content.current_affairs_localizations (
        id, event_id, authoring_version_id, language_code, status,
        localized_title, localized_summary, localized_one_liner,
        template_id, localization_method, input_fingerprint, fact_snapshot,
        quality_snapshot, reasons, created_by, reviewed_by, created_at, updated_at
      ) VALUES (
        ${id}::uuid, ${args.eventId}::uuid, ${input.authoringVersionId}::uuid, ${args.languageCode}, 'manual',
        ${title}, ${summary}, ${oneLiner}, ${input.templateId ?? 'manual'}, 'manual', ${fingerprint},
        ${JSON.stringify(input.facts)}::jsonb, ${JSON.stringify(qualitySnapshot)}::jsonb,
        ${JSON.stringify([args.reason.trim()])}::jsonb, ${args.actorUserId}::uuid, ${args.actorUserId}::uuid,
        now(), now()
      )
      ON CONFLICT (authoring_version_id, language_code) DO UPDATE
      SET status='manual', localized_title=EXCLUDED.localized_title,
          localized_summary=EXCLUDED.localized_summary,
          localized_one_liner=EXCLUDED.localized_one_liner,
          template_id=EXCLUDED.template_id, localization_method='manual',
          input_fingerprint=EXCLUDED.input_fingerprint,
          fact_snapshot=EXCLUDED.fact_snapshot, quality_snapshot=EXCLUDED.quality_snapshot,
          reasons=EXCLUDED.reasons, reviewed_by=${args.actorUserId}::uuid, updated_at=now()
    `;
    await tx`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, action_key, entity_type, entity_id,
        reason, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid, 'user'::audit_actor_type, ${args.actorUserId}::uuid,
        'current_affairs.localization.manual', 'current_affairs_event', ${args.eventId}::uuid,
        ${args.reason.trim()}, 'Approved manual Current Affairs localization',
        ${JSON.stringify({ languageCode: args.languageCode, authoringVersionId: input.authoringVersionId })}::jsonb
      )
    `;
  });
  return {
    eventId: args.eventId,
    authoringVersionId: input.authoringVersionId,
    languageCode: args.languageCode,
    status: "manual",
    title,
    summary,
    quality: qualitySnapshot,
  };
}

type LocalizedCompilationEvent = {
  id: string;
  title: string;
  summary: string;
  oneLiner: string;
  category: string;
  examScore: number;
  facts: LocalizationFact[];
};

async function loadLocalizedCompilationEvents(
  date: string,
  family: string,
  languageCode: CurrentAffairsLocalizationLanguage,
): Promise<LocalizedCompilationEvent[]> {
  const rows = await sqlClient`
    SELECT
      event.id::text AS id,
      localization.localized_title AS title,
      localization.localized_summary AS summary,
      COALESCE(localization.localized_one_liner, localization.localized_summary) AS "oneLiner",
      event.category,
      score.relevance_score::int AS "examScore",
      COALESCE((
        SELECT json_agg(json_build_object('key', fact.fact_key, 'value', fact.fact_value, 'type', fact.fact_type)
          ORDER BY fact.sort_order, fact.fact_key, fact.fact_value)
        FROM content.current_affairs_facts fact
        WHERE fact.event_id=event.id AND fact.is_verified=true
      ), '[]'::json) AS facts
    FROM content.current_affairs_events event
    JOIN content.current_affairs_exam_scores score
      ON score.event_id=event.id AND score.exam_family_key=${family}
    JOIN content.current_affairs_localizations localization
      ON localization.event_id=event.id
      AND localization.authoring_version_id=event.learner_authoring_version_id
      AND localization.language_code=${languageCode}
      AND localization.status IN ('ready', 'manual')
    WHERE event.status='verified'
      AND event.event_date=${date}::date
      AND event.learner_authoring_status IN ('ready', 'manual')
      AND score.include_recommended=true
      AND NOT EXISTS (
        SELECT 1 FROM content.current_affairs_fact_conflicts conflict
        WHERE conflict.event_id=event.id AND conflict.status='open'
      )
    ORDER BY score.relevance_score DESC, event.canonical_title
    LIMIT 500
  `;
  return rows.map((row) => ({
    id: String(row.id),
    title: String(row.title),
    summary: String(row.summary),
    oneLiner: String(row.oneLiner ?? row.summary),
    category: String(row.category),
    examScore: Number(row.examScore ?? 0),
    facts: normalizeFacts(row.facts),
  }));
}

function localizedCompilationCode(date: string, family: string, languageCode: CurrentAffairsLocalizationLanguage) {
  return `CA-D-${date.replaceAll("-", "")}-${family.toUpperCase()}_${languageCode.toUpperCase()}`;
}

function localizedResourceTitle(date: string, family: string, languageCode: CurrentAffairsLocalizationLanguage) {
  return languageCode === "hi"
    ? `दैनिक करेंट अफेयर्स — ${date} — ${family.toUpperCase()}`
    : `ਰੋਜ਼ਾਨਾ ਕਰੰਟ ਅਫੇਅਰਜ਼ — ${date} — ${family.toUpperCase()}`;
}

function renderLocalizedCompilationMarkdown(args: {
  date: string;
  family: string;
  languageCode: CurrentAffairsLocalizationLanguage;
  events: LocalizedCompilationEvent[];
}) {
  const hi = args.languageCode === "hi";
  const lines: string[] = [
    `# ${localizedResourceTitle(args.date, args.family, args.languageCode)}`,
    "",
    hi
      ? "सभी तथ्य सत्यापित Current Affairs fact graph से लिए गए हैं। यह संपादकीय समीक्षा हेतु ड्राफ्ट है।"
      : "ਸਾਰੇ ਤੱਥ ਪ੍ਰਮਾਣਿਤ Current Affairs fact graph ਤੋਂ ਲਏ ਗਏ ਹਨ। ਇਹ ਸੰਪਾਦਕੀ ਸਮੀਖਿਆ ਲਈ ਡਰਾਫਟ ਹੈ।",
    "",
  ];
  args.events.forEach((event, index) => {
    lines.push(`## ${index + 1}. ${event.title}`, "", event.summary, "");
    lines.push(hi ? `**एक पंक्ति में:** ${event.oneLiner}` : `**ਇੱਕ ਲਾਈਨ ਵਿੱਚ:** ${event.oneLiner}`, "");
    if (event.facts.length > 0) {
      lines.push(hi ? "**मुख्य तथ्य:**" : "**ਮੁੱਖ ਤੱਥ:**");
      for (const fact of event.facts) {
        const label = FACT_LABELS[args.languageCode][fact.key] ?? fact.key.replaceAll("_", " ");
        lines.push(`- **${label}:** ${fact.value}`);
      }
      lines.push("");
    }
  });
  return `${lines.join("\n").trim()}\n`;
}

export async function createLocalizedDailyCompilations(date: string, families: readonly string[]) {
  const results: Array<{ family: string; languageCode: CurrentAffairsLocalizationLanguage; created: boolean; eventCount: number }> = [];
  for (const family of families) {
    for (const languageCode of CURRENT_AFFAIRS_LOCALIZATION_LANGUAGES) {
      const code = localizedCompilationCode(date, family, languageCode);
      const existing = await sqlClient`
        SELECT id FROM content.current_affairs_compilations
        WHERE public_code=${code}
           OR (period_type='daily' AND period_start=${date}::date AND period_end=${date}::date
               AND exam_family_key=${family} AND language_code=${languageCode})
        LIMIT 1
      `;
      if (existing[0]) {
        results.push({ family, languageCode, created: false, eventCount: 0 });
        continue;
      }
      const events = await loadLocalizedCompilationEvents(date, family, languageCode);
      if (events.length === 0) {
        results.push({ family, languageCode, created: false, eventCount: 0 });
        continue;
      }
      const resourceId = randomUUID();
      const compilationId = randomUUID();
      const title = localizedResourceTitle(date, family, languageCode);
      const markdown = renderLocalizedCompilationMarkdown({ date, family, languageCode, events });
      const summary = languageCode === "hi"
        ? `${events.length} सत्यापित और parity-पास Current Affairs घटनाओं का ड्राफ्ट। प्रकाशन से पहले संपादकीय समीक्षा आवश्यक है।`
        : `${events.length} ਪ੍ਰਮਾਣਿਤ ਅਤੇ parity-ਪਾਸ Current Affairs ਘਟਨਾਵਾਂ ਦਾ ਡਰਾਫਟ। ਪ੍ਰਕਾਸ਼ਨ ਤੋਂ ਪਹਿਲਾਂ ਸੰਪਾਦਕੀ ਸਮੀਖਿਆ ਲੋੜੀਂਦੀ ਹੈ।`;
      await sqlClient.begin(async (tx) => {
        await tx`
          INSERT INTO content.learning_resources (
            id, public_code, category, format, title, summary, language_code,
            content_date, body_markdown, content_url, status, created_at, updated_at
          ) VALUES (
            ${resourceId}::uuid, ${code}, 'current_affairs', 'article', ${title}, ${summary},
            ${languageCode}, ${date}, ${markdown}, null, 'draft', now(), now()
          )
        `;
        await tx`
          INSERT INTO content.current_affairs_compilations (
            id, public_code, period_type, period_start, period_end, exam_family_key,
            language_code, status, event_count, learning_resource_id, created_at, updated_at
          ) VALUES (
            ${compilationId}::uuid, ${code}, 'daily', ${date}, ${date}, ${family},
            ${languageCode}, 'draft', ${events.length}, ${resourceId}::uuid, now(), now()
          )
        `;
        for (let index = 0; index < events.length; index += 1) {
          const event = events[index]!;
          await tx`
            INSERT INTO content.current_affairs_compilation_events (
              compilation_id, event_id, sort_order, relevance_score, created_at
            ) VALUES (
              ${compilationId}::uuid, ${event.id}::uuid, ${index + 1}, ${event.examScore}, now()
            )
          `;
        }
      });
      results.push({ family, languageCode, created: true, eventCount: events.length });
    }
  }
  return {
    created: results.filter((item) => item.created).length,
    eventCount: results.reduce((sum, item) => sum + item.eventCount, 0),
    results,
  };
}
