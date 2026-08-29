import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import {
  localizeCurrentAffairsQuestion,
  questionLocalizationInputFingerprint,
  type CurrentAffairsQuestionFamily,
} from "./multilingual-question-localization";
import type { CurrentAffairsLocalizationLanguage } from "./multilingual-localization";

const QUESTION_LOCALIZATION_VERSION = "ca-cp011-multilingual-question-drafts-v1";
const TARGET_LANGUAGES = ["hi", "pa"] as const;

type SourceQuestionRow = {
  generationItemId: string;
  sourceGenerationVersionId: string;
  eventId: string;
  factId?: string;
  factKey: string;
  family: CurrentAffairsQuestionFamily;
  factValue: string;
  sourcePayload: Record<string, unknown>;
  currentAuthoringVersionId: string;
  englishEventTitle: string;
};

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

async function loadSourceQuestionQueue(limit: number): Promise<SourceQuestionRow[]> {
  const rows = await sqlClient`
    SELECT
      item.id::text AS "generationItemId",
      version.id::text AS "sourceGenerationVersionId",
      link.event_id::text AS "eventId",
      link.fact_id::text AS "factId",
      link.fact_key AS "factKey",
      link.question_family AS family,
      COALESCE(fact.fact_value, version.payload->'provenance'->>'factValue', '') AS "factValue",
      version.payload AS "sourcePayload",
      event.learner_authoring_version_id::text AS "currentAuthoringVersionId",
      authoring.learner_title AS "englishEventTitle"
    FROM content.current_affairs_question_links link
    JOIN content.generation_run_items item ON item.id=link.generation_item_id
    JOIN content.generation_item_versions version
      ON version.generation_item_id=item.id
      AND version.version_number=item.current_version_number
    JOIN content.generation_runs run ON run.id=item.generation_run_id
    JOIN content.current_affairs_events event ON event.id=link.event_id
    JOIN content.current_affairs_authoring_versions authoring
      ON authoring.id=event.learner_authoring_version_id
    LEFT JOIN content.current_affairs_facts fact ON fact.id=link.fact_id
    WHERE run.status='review'
      AND item.status='unreviewed'
      AND event.status='verified'
      AND event.learner_authoring_status IN ('ready', 'manual')
      AND authoring.status IN ('ready', 'manual')
      AND version.payload->>'language'='en'
      AND version.payload->'generationContext'->>'questionBankAcceptanceMode'='BANK_ONLY'
      AND NOT EXISTS (
        SELECT 1 FROM content.current_affairs_fact_conflicts conflict
        WHERE conflict.event_id=event.id AND conflict.status='open'
      )
    ORDER BY run.created_at DESC, item.item_number ASC
    LIMIT ${limit}
  `;
  return rows.map((row) => ({
    generationItemId: String(row.generationItemId),
    sourceGenerationVersionId: String(row.sourceGenerationVersionId),
    eventId: String(row.eventId),
    factId: row.factId ? String(row.factId) : undefined,
    factKey: String(row.factKey),
    family: String(row.family) as CurrentAffairsQuestionFamily,
    factValue: String(row.factValue ?? ""),
    sourcePayload: record(row.sourcePayload),
    currentAuthoringVersionId: String(row.currentAuthoringVersionId),
    englishEventTitle: String(row.englishEventTitle ?? ""),
  }));
}

async function currentLocalizedEventTitle(
  eventId: string,
  authoringVersionId: string,
  languageCode: CurrentAffairsLocalizationLanguage,
): Promise<string | null> {
  const rows = await sqlClient`
    SELECT localized_title AS title
    FROM content.current_affairs_localizations
    WHERE event_id=${eventId}::uuid
      AND authoring_version_id=${authoringVersionId}::uuid
      AND language_code=${languageCode}
      AND status IN ('ready', 'manual')
    LIMIT 1
  `;
  return rows[0]?.title ? String(rows[0].title) : null;
}

function sourceOptions(payload: Record<string, unknown>): string[] {
  return Array.isArray(payload.options)
    ? payload.options.map((item) => String(item ?? "").replace(/\s+/g, " ").trim()).filter(Boolean)
    : [];
}

async function localizedEventTitleMap(
  englishTitles: string[],
  languageCode: CurrentAffairsLocalizationLanguage,
): Promise<Record<string, string>> {
  const uniqueTitles = Array.from(new Set(englishTitles.map((title) => title.trim()).filter(Boolean)));
  if (uniqueTitles.length === 0) return {};
  const rows = await sqlClient`
    SELECT authoring.learner_title AS "englishTitle", localization.localized_title AS "localizedTitle"
    FROM content.current_affairs_events event
    JOIN content.current_affairs_authoring_versions authoring
      ON authoring.id=event.learner_authoring_version_id
    JOIN content.current_affairs_localizations localization
      ON localization.event_id=event.id
      AND localization.authoring_version_id=event.learner_authoring_version_id
      AND localization.language_code=${languageCode}
      AND localization.status IN ('ready', 'manual')
    WHERE event.status='verified'
      AND authoring.learner_title = ANY(${uniqueTitles}::text[])
  `;
  const result: Record<string, string> = {};
  for (const row of rows) {
    const source = String(row.englishTitle ?? "").trim();
    const target = String(row.localizedTitle ?? "").trim();
    if (source && target) result[source] = target;
  }
  return result;
}

async function existingLocalization(sourceGenerationVersionId: string, languageCode: CurrentAffairsLocalizationLanguage) {
  const rows = await sqlClient`
    SELECT id::text AS id, input_fingerprint AS "inputFingerprint", status
    FROM content.current_affairs_question_localizations
    WHERE source_generation_version_id=${sourceGenerationVersionId}::uuid
      AND language_code=${languageCode}
    LIMIT 1
  `;
  return rows[0] as Record<string, unknown> | undefined;
}

async function storeQuestionLocalization(args: {
  row: SourceQuestionRow;
  languageCode: CurrentAffairsLocalizationLanguage;
  output: ReturnType<typeof localizeCurrentAffairsQuestion>;
}) {
  const existing = await existingLocalization(args.row.sourceGenerationVersionId, args.languageCode);
  if (existing && String(existing.inputFingerprint) === args.output.inputFingerprint) {
    return { id: String(existing.id), unchanged: true, status: String(existing.status) };
  }
  const id = existing ? String(existing.id) : randomUUID();
  const qualitySnapshot = {
    localizationVersion: QUESTION_LOCALIZATION_VERSION,
    ...args.output.quality,
    bankOnly: true,
    automaticStudentPublication: false,
  };
  await sqlClient`
    INSERT INTO content.current_affairs_question_localizations (
      id, generation_item_id, source_generation_version_id, event_id, fact_id,
      language_code, status, localized_payload, localization_method, input_fingerprint,
      quality_snapshot, reasons, created_at, updated_at
    ) VALUES (
      ${id}::uuid, ${args.row.generationItemId}::uuid, ${args.row.sourceGenerationVersionId}::uuid,
      ${args.row.eventId}::uuid, ${args.row.factId ?? null}::uuid, ${args.languageCode}, ${args.output.status},
      ${args.output.payload ? JSON.stringify(args.output.payload) : null}::jsonb,
      'deterministic_v1', ${args.output.inputFingerprint}, ${JSON.stringify(qualitySnapshot)}::jsonb,
      ${JSON.stringify(args.output.reasons)}::jsonb, now(), now()
    )
    ON CONFLICT (source_generation_version_id, language_code) DO UPDATE
    SET generation_item_id=EXCLUDED.generation_item_id,
        event_id=EXCLUDED.event_id,
        fact_id=EXCLUDED.fact_id,
        status=EXCLUDED.status,
        localized_payload=EXCLUDED.localized_payload,
        localization_method='deterministic_v1',
        input_fingerprint=EXCLUDED.input_fingerprint,
        quality_snapshot=EXCLUDED.quality_snapshot,
        reasons=EXCLUDED.reasons,
        reviewed_by=NULL,
        updated_at=now()
  `;
  return { id, unchanged: false, status: args.output.status };
}

export async function runCurrentAffairsQuestionLocalization(limit = 300) {
  const safeLimit = Math.max(1, Math.min(1000, Math.floor(limit)));
  const rows = await loadSourceQuestionQueue(safeLimit);
  const results: Array<Record<string, unknown>> = [];

  for (const row of rows) {
    for (const languageCode of TARGET_LANGUAGES) {
      const localizedEventTitle = await currentLocalizedEventTitle(
        row.eventId,
        row.currentAuthoringVersionId,
        languageCode,
      );
      if (!localizedEventTitle) {
        const missingFingerprint = questionLocalizationInputFingerprint({
          sourceGenerationVersionId: row.sourceGenerationVersionId,
          languageCode,
          family: row.family,
          factKey: row.factKey,
          factValue: row.factValue,
          localizedEventTitle: "",
          sourcePayload: row.sourcePayload,
        });
        const output = {
          status: "needs_editorial" as const,
          inputFingerprint: missingFingerprint,
          quality: {
            shared: null,
            answerIndexPreserved: false,
            optionCountPreserved: false,
            factValuePreserved: false,
            expectedScriptPresent: false,
            missingEventTitleOptions: [row.englishEventTitle],
          },
          reasons: ["Current event does not have an approved CP010 localization for this language"],
        };
        const stored = await storeQuestionLocalization({ row, languageCode, output });
        results.push({ generationItemId: row.generationItemId, languageCode, status: stored.unchanged ? "unchanged" : output.status });
        continue;
      }

      const titleMap = row.family === "CA-QL-002"
        ? await localizedEventTitleMap(sourceOptions(row.sourcePayload), languageCode)
        : undefined;
      const output = localizeCurrentAffairsQuestion({
        sourceGenerationVersionId: row.sourceGenerationVersionId,
        languageCode,
        family: row.family,
        factKey: row.factKey,
        factValue: row.factValue,
        localizedEventTitle,
        sourcePayload: row.sourcePayload,
        localizedEventTitleByEnglishTitle: titleMap,
      });
      const stored = await storeQuestionLocalization({ row, languageCode, output });
      results.push({
        generationItemId: row.generationItemId,
        sourceGenerationVersionId: row.sourceGenerationVersionId,
        languageCode,
        status: stored.unchanged ? "unchanged" : output.status,
        localizationStatus: stored.status,
        localizationId: stored.id,
        reasons: output.reasons,
      });
    }
  }

  return {
    examinedSourceItems: rows.length,
    examinedLocalizations: results.length,
    ready: results.filter((item) => item.status === "ready").length,
    needsEditorial: results.filter((item) => item.status === "needs_editorial").length,
    unchanged: results.filter((item) => item.status === "unchanged").length,
    results,
  };
}

export async function createManualCurrentAffairsQuestionLocalization(args: {
  generationItemId: string;
  languageCode: CurrentAffairsLocalizationLanguage;
  stem: string;
  explanation: string;
  options: string[];
  reason: string;
  actorUserId: string;
}) {
  const rows = await sqlClient`
    SELECT
      version.id::text AS "sourceGenerationVersionId",
      version.payload AS "sourcePayload",
      link.event_id::text AS "eventId",
      link.fact_id::text AS "factId",
      link.fact_key AS "factKey",
      link.question_family AS family,
      COALESCE(fact.fact_value, version.payload->'provenance'->>'factValue', '') AS "factValue",
      event.learner_authoring_version_id::text AS "authoringVersionId",
      localization.localized_title AS "localizedEventTitle"
    FROM content.generation_run_items item
    JOIN content.generation_item_versions version
      ON version.generation_item_id=item.id AND version.version_number=item.current_version_number
    JOIN content.current_affairs_question_links link ON link.generation_item_id=item.id
    JOIN content.current_affairs_events event ON event.id=link.event_id
    LEFT JOIN content.current_affairs_facts fact ON fact.id=link.fact_id
    LEFT JOIN content.current_affairs_localizations localization
      ON localization.event_id=event.id
      AND localization.authoring_version_id=event.learner_authoring_version_id
      AND localization.language_code=${args.languageCode}
      AND localization.status IN ('ready', 'manual')
    WHERE item.id=${args.generationItemId}::uuid
      AND event.status='verified'
      AND version.payload->>'language'='en'
      AND version.payload->'generationContext'->>'questionBankAcceptanceMode'='BANK_ONLY'
    LIMIT 1
  `;
  const row = rows[0] as Record<string, unknown> | undefined;
  if (!row) throw new Error("Eligible Current Affairs source question not found");
  if (!row.localizedEventTitle) throw new Error("Approved CP010 event localization is required before question localization");
  if (args.reason.trim().length < 8) throw new Error("Manual question localization requires an editorial reason");

  const sourcePayload = record(row.sourcePayload);
  const sourceOptionValues = sourceOptions(sourcePayload);
  const targetOptions = args.options.map((item) => String(item ?? "").replace(/\s+/g, " ").trim());
  if (targetOptions.length !== sourceOptionValues.length || targetOptions.some((item) => !item)) {
    throw new Error("Localized options must preserve source option count and order");
  }
  const sourceCorrectIndex = Number(sourcePayload.correctIndex);
  if (!Number.isInteger(sourceCorrectIndex) || sourceCorrectIndex < 0 || sourceCorrectIndex >= targetOptions.length) {
    throw new Error("Source Current Affairs question has invalid correct index");
  }
  const factValue = String(row.factValue ?? "");
  const composite = [args.stem, args.explanation, ...targetOptions].join(" ");
  if (!composite.includes(factValue)) throw new Error("Localized question must preserve the canonical fact value");
  const scriptPattern = args.languageCode === "hi" ? /[\u0900-\u097F]/u : /[\u0A00-\u0A7F]/u;
  if (!scriptPattern.test(composite)) throw new Error("Localized question must contain the requested target-language script");

  const family = String(row.family) as CurrentAffairsQuestionFamily;
  if (family === "CA-QL-001") {
    for (let i = 0; i < sourceOptionValues.length; i += 1) {
      if (targetOptions[i] !== sourceOptionValues[i]) {
        throw new Error("Fact-recall Current Affairs options must remain canonical and unchanged");
      }
    }
  }

  const localizedPayload = {
    ...sourcePayload,
    text: args.stem.trim(),
    stem: args.stem.trim(),
    explanation: args.explanation.trim(),
    options: targetOptions,
    correctIndex: sourceCorrectIndex,
    canonicalAnswer: targetOptions[sourceCorrectIndex],
    language: args.languageCode,
    generationContext: {
      ...record(sourcePayload.generationContext),
      reviewStatus: "PENDING_EDITORIAL_REVIEW",
      questionBankAcceptanceMode: "BANK_ONLY",
      publiclyPublishable: false,
      automaticStudentPublication: false,
      localizationAuthority: "CURRENT_AFFAIRS_STUDIO_CP011_MANUAL",
      sourceGenerationVersionId: String(row.sourceGenerationVersionId),
    },
    provenance: {
      ...record(sourcePayload.provenance),
      sourceGenerationVersionId: String(row.sourceGenerationVersionId),
      localizationLanguage: args.languageCode,
      localizationSource: "manual_cp011",
      factValue,
    },
  };
  const fingerprint = questionLocalizationInputFingerprint({
    sourceGenerationVersionId: String(row.sourceGenerationVersionId),
    languageCode: args.languageCode,
    family,
    factKey: String(row.factKey),
    factValue,
    localizedEventTitle: String(row.localizedEventTitle),
    sourcePayload,
  });
  const id = randomUUID();
  await sqlClient.begin(async (tx) => {
    await tx`
      INSERT INTO content.current_affairs_question_localizations (
        id, generation_item_id, source_generation_version_id, event_id, fact_id,
        language_code, status, localized_payload, localization_method, input_fingerprint,
        quality_snapshot, reasons, created_by, reviewed_by, created_at, updated_at
      ) VALUES (
        ${id}::uuid, ${args.generationItemId}::uuid, ${String(row.sourceGenerationVersionId)}::uuid,
        ${String(row.eventId)}::uuid, ${row.factId ? String(row.factId) : null}::uuid,
        ${args.languageCode}, 'manual', ${JSON.stringify(localizedPayload)}::jsonb, 'manual', ${fingerprint},
        ${JSON.stringify({
          localizationVersion: QUESTION_LOCALIZATION_VERSION,
          answerIndexPreserved: true,
          optionCountPreserved: true,
          factValuePreserved: true,
          expectedScriptPresent: true,
          bankOnly: true,
          automaticStudentPublication: false,
          manualEditorialReview: true,
        })}::jsonb,
        ${JSON.stringify([args.reason.trim()])}::jsonb, ${args.actorUserId}::uuid, ${args.actorUserId}::uuid,
        now(), now()
      )
      ON CONFLICT (source_generation_version_id, language_code) DO UPDATE
      SET generation_item_id=EXCLUDED.generation_item_id,
          event_id=EXCLUDED.event_id,
          fact_id=EXCLUDED.fact_id,
          status='manual',
          localized_payload=EXCLUDED.localized_payload,
          localization_method='manual',
          input_fingerprint=EXCLUDED.input_fingerprint,
          quality_snapshot=EXCLUDED.quality_snapshot,
          reasons=EXCLUDED.reasons,
          reviewed_by=${args.actorUserId}::uuid,
          updated_at=now()
    `;
    await tx`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, action_key, entity_type, entity_id,
        reason, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid, 'user'::audit_actor_type, ${args.actorUserId}::uuid,
        'current_affairs.question_localization.manual', 'generation_run_item', ${args.generationItemId}::uuid,
        ${args.reason.trim()}, 'Approved manual Current Affairs question localization draft',
        ${JSON.stringify({ languageCode: args.languageCode, sourceGenerationVersionId: String(row.sourceGenerationVersionId) })}::jsonb
      )
    `;
  });
  return {
    generationItemId: args.generationItemId,
    sourceGenerationVersionId: String(row.sourceGenerationVersionId),
    languageCode: args.languageCode,
    status: "manual",
    payload: localizedPayload,
  };
}
