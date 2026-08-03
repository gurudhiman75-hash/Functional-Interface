import { createHash } from "node:crypto";

import {
  convertApprovedGenerationItem,
  type QuestionSqlExecutor,
} from "../../../../../../lib/admin-question-conversion";
import { sqlClient } from "../../../../../../lib/db";
import { generateQuestion } from "../../../../../generation-engine";
import {
  listPnl001CanonicalReviewEntries,
  type Pnl001Language,
} from "./question-studio-review-runtime";

const RELEASE_ID = "PNL-001-CANONICAL-PRODUCTION-V1";
const RUN_ID = "2b730a95-f9f7-57dd-b0e9-37d6e4b8de43";
const RUN_CODE = "GEN-20260803-2B730A95";
const ACTOR_ID = "92b90dc3-4a6c-41bc-8e03-64c1905f77a2";
const LANGUAGES: readonly Pnl001Language[] = ["en", "hi", "pa"];
const EXPECTED_ITEMS = 558;
const NAMESPACE = uuidV5(
  "https://examtree.in/imports/PNL-001-CANONICAL-PRODUCTION-V1",
  "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
);

function uuidBytes(uuid: string): Buffer {
  return Buffer.from(uuid.replaceAll("-", ""), "hex");
}

function uuidV5(name: string, namespace: string): string {
  const digest = createHash("sha1")
    .update(Buffer.concat([uuidBytes(namespace), Buffer.from(name, "utf8")]))
    .digest()
    .subarray(0, 16);
  digest[6] = (digest[6]! & 0x0f) | 0x50;
  digest[8] = (digest[8]! & 0x3f) | 0x80;
  const hex = digest.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function stableId(kind: string, key: string): string {
  return uuidV5(`${kind}:${key}`, NAMESPACE);
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

async function ensureRun(): Promise<void> {
  await sqlClient`
    INSERT INTO content.generation_runs (
      id, public_code, requested_by, reviewer_user_id, status, attempt_number,
      prompt_snapshot, request_snapshot, provider, model,
      prompt_tokens, completion_tokens, estimated_cost_paise, actual_cost_paise,
      started_at, created_at, updated_at
    ) VALUES (
      ${RUN_ID}::uuid,
      ${RUN_CODE},
      ${ACTOR_ID}::uuid,
      ${ACTOR_ID}::uuid,
      'running'::generation_run_status,
      1,
      'Approved PNL-001 canonical production import: 186 QLs x 3 languages',
      ${JSON.stringify({
        releaseId: RELEASE_ID,
        packageId: "PNL-001",
        runtimeMode: "CANONICAL_REVIEW",
        reviewStatus: "APPROVED_EDITORIAL_CANONICAL",
        itemCount: EXPECTED_ITEMS,
        languages: LANGUAGES,
        canonicalReleaseMergeCommit:
          "c23f9193ef439f4e18d596104b9ad915013531a5",
      })}::jsonb,
      'examtree',
      'quant-v4-canonical',
      0, 0, 0, 0,
      now(), now(), now()
    )
    ON CONFLICT (id) DO UPDATE SET
      requested_by = EXCLUDED.requested_by,
      reviewer_user_id = EXCLUDED.reviewer_user_id,
      status = CASE
        WHEN content.generation_runs.status = 'approved'
          THEN content.generation_runs.status
        ELSE 'running'::generation_run_status
      END,
      request_snapshot = EXCLUDED.request_snapshot,
      updated_at = now()
  `;
}

async function importOne(
  ordinal: number,
  qlId: string,
  cpId: string,
  language: Pnl001Language,
): Promise<"created" | "existing"> {
  const importKey = `${qlId}:${language}`;
  const itemId = stableId("generation-item", importKey);
  const itemVersionId = stableId("generation-item-version", importKey);
  const itemAuditId = stableId("item-approved-audit", importKey);
  const seed = `${RELEASE_ID}:${qlId}:${language}`;

  const generated = await generateQuestion({
    packageId: "PNL-001",
    runtimeMode: "CANONICAL_REVIEW",
    language,
    canonicalProblemId: cpId,
    questionLanguageId: qlId,
    seed,
    count: 1,
  });
  const preview = asRecord(generated.questions?.[0]);
  const context = asRecord(generated.generationContext);
  const providerQuestionId = String(preview.questionId ?? "");
  const payload = {
    ...preview,
    generationContext: context,
    validationResult: "approved",
    productionImport: {
      releaseId: RELEASE_ID,
      importKey,
      qlId,
      cpId,
      language,
      canonicalReleaseMergeCommit:
        "c23f9193ef439f4e18d596104b9ad915013531a5",
    },
  };

  return sqlClient.begin(async (tx) => {
    const existing = await tx`
      SELECT accepted_question_id AS "acceptedQuestionId"
      FROM content.generation_run_items
      WHERE id = ${itemId}::uuid
      FOR UPDATE
    `;

    if (existing[0]?.acceptedQuestionId) return "existing" as const;

    await tx`
      INSERT INTO content.generation_run_items (
        id, generation_run_id, item_number, status,
        current_version_number, reviewer_user_id, created_at, updated_at
      ) VALUES (
        ${itemId}::uuid,
        ${RUN_ID}::uuid,
        ${ordinal},
        'approved'::generation_item_status,
        1,
        ${ACTOR_ID}::uuid,
        now(), now()
      )
      ON CONFLICT (id) DO UPDATE SET
        status = 'approved'::generation_item_status,
        reviewer_user_id = ${ACTOR_ID}::uuid,
        updated_at = now()
    `;

    await tx`
      INSERT INTO content.generation_item_versions (
        id, generation_item_id, version_number, payload,
        provider_item_id, created_at
      ) VALUES (
        ${itemVersionId}::uuid,
        ${itemId}::uuid,
        1,
        ${JSON.stringify(payload)}::jsonb,
        ${providerQuestionId || null},
        now()
      )
      ON CONFLICT (generation_item_id, version_number) DO UPDATE SET
        payload = EXCLUDED.payload,
        provider_item_id = EXCLUDED.provider_item_id
    `;

    const converted = await convertApprovedGenerationItem(
      tx as QuestionSqlExecutor,
      itemId,
      ACTOR_ID,
    );
    if (!converted) {
      throw new Error(`${importKey}: approved item conversion returned null.`);
    }

    await tx`
      UPDATE content.question_versions
      SET answer_model = jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(
              jsonb_set(
                answer_model,
                '{generation,releaseId}',
                to_jsonb(${RELEASE_ID}::text),
                true
              ),
              '{generation,importKey}',
              to_jsonb(${importKey}::text),
              true
            ),
            '{generation,questionLanguageId}',
            to_jsonb(${qlId}::text),
            true
          ),
          '{generation,canonicalProblemId}',
          to_jsonb(${cpId}::text),
          true
        ),
        '{generation,runtimeMode}',
        to_jsonb('CANONICAL_REVIEW'::text),
        true
      )
      WHERE id = ${converted.questionVersionId}::uuid
    `;

    await tx`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, effective_role_key,
        action_key, entity_type, entity_id, entity_version_id,
        reason, summary, metadata
      ) VALUES (
        ${itemAuditId}::uuid,
        'user'::audit_actor_type,
        ${ACTOR_ID}::uuid,
        'super_admin',
        'question_studio.generated_item.approved',
        'generation_item',
        ${itemId}::uuid,
        ${converted.questionVersionId}::uuid,
        'Approved PNL-001 canonical production import',
        ${`Approved ${importKey} and converted it to ${converted.publicCode}`},
        ${JSON.stringify({
          releaseId: RELEASE_ID,
          importKey,
          qlId,
          cpId,
          language,
          questionId: converted.questionId,
          questionVersionId: converted.questionVersionId,
        })}::jsonb
      )
      ON CONFLICT (id) DO NOTHING
    `;

    return "created" as const;
  });
}

async function verify(): Promise<Record<string, unknown>> {
  const rows = await sqlClient`
    WITH imported AS (
      SELECT
        i.id AS item_id,
        i.accepted_question_id,
        i.accepted_question_version_id,
        v.payload,
        q.status::text AS question_status,
        q.published_version_id,
        qv.answer_model
      FROM content.generation_run_items i
      JOIN content.generation_item_versions v
        ON v.generation_item_id = i.id
       AND v.version_number = i.current_version_number
      LEFT JOIN content.questions q ON q.id = i.accepted_question_id
      LEFT JOIN content.question_versions qv
        ON qv.id = i.accepted_question_version_id
      WHERE i.generation_run_id = ${RUN_ID}::uuid
    ), option_counts AS (
      SELECT
        qo.question_version_id,
        COUNT(*)::int AS option_count,
        COUNT(*) FILTER (WHERE qo.is_correct)::int AS correct_count
      FROM content.question_options qo
      JOIN imported i ON i.accepted_question_version_id = qo.question_version_id
      GROUP BY qo.question_version_id
    )
    SELECT
      COUNT(*)::int AS "itemCount",
      COUNT(*) FILTER (
        WHERE accepted_question_id IS NOT NULL
          AND accepted_question_version_id IS NOT NULL
      )::int AS "convertedCount",
      COUNT(*) FILTER (WHERE question_status = 'approved')::int AS "approvedCount",
      COUNT(*) FILTER (WHERE published_version_id IS NOT NULL)::int AS "publishedCount",
      COUNT(DISTINCT payload -> 'productionImport' ->> 'importKey')::int AS "uniqueImportKeys",
      COUNT(DISTINCT answer_model #>> '{generation,providerQuestionId}')::int AS "uniqueProviderIds",
      COUNT(*) FILTER (
        WHERE answer_model #>> '{generation,runtimeMode}' = 'DYNAMIC_CANDIDATE'
      )::int AS "dynamicCount",
      COUNT(*) FILTER (
        WHERE (SELECT option_count FROM option_counts o
               WHERE o.question_version_id = accepted_question_version_id) = 4
          AND (SELECT correct_count FROM option_counts o
               WHERE o.question_version_id = accepted_question_version_id) = 1
      )::int AS "validOptionModels"
    FROM imported
  `;

  const languageRows = await sqlClient`
    SELECT
      qv.answer_model #>> '{generation,language}' AS language,
      COUNT(*)::int AS count
    FROM content.generation_run_items i
    JOIN content.question_versions qv
      ON qv.id = i.accepted_question_version_id
    WHERE i.generation_run_id = ${RUN_ID}::uuid
    GROUP BY 1
    ORDER BY 1
  `;

  const cpRows = await sqlClient`
    SELECT
      qv.answer_model #>> '{generation,canonicalProblemId}' AS "cpId",
      COUNT(*)::int AS count
    FROM content.generation_run_items i
    JOIN content.question_versions qv
      ON qv.id = i.accepted_question_version_id
    WHERE i.generation_run_id = ${RUN_ID}::uuid
    GROUP BY 1
    ORDER BY 1
  `;

  const summary = {
    ...rows[0],
    languageCounts: Object.fromEntries(
      languageRows.map((row) => [String(row.language), Number(row.count)]),
    ),
    cpCounts: Object.fromEntries(
      cpRows.map((row) => [String(row.cpId), Number(row.count)]),
    ),
  };

  const expected = {
    itemCount: EXPECTED_ITEMS,
    convertedCount: EXPECTED_ITEMS,
    approvedCount: EXPECTED_ITEMS,
    publishedCount: 0,
    uniqueImportKeys: EXPECTED_ITEMS,
    uniqueProviderIds: EXPECTED_ITEMS,
    dynamicCount: 0,
    validOptionModels: EXPECTED_ITEMS,
  };
  for (const [key, value] of Object.entries(expected)) {
    if (Number(summary[key as keyof typeof summary]) !== value) {
      throw new Error(
        `Verification failed for ${key}: expected ${value}, received ${String(summary[key as keyof typeof summary])}.`,
      );
    }
  }
  for (const language of LANGUAGES) {
    if (summary.languageCounts[language] !== 186) {
      throw new Error(`${language}: expected 186 imported questions.`);
    }
  }

  return summary;
}

async function main(): Promise<void> {
  await ensureRun();
  const entries = listPnl001CanonicalReviewEntries().sort((left, right) =>
    left.qlId.localeCompare(right.qlId),
  );
  if (entries.length !== 186) {
    throw new Error(`Expected 186 canonical entries, received ${entries.length}.`);
  }

  let ordinal = 0;
  let created = 0;
  let existing = 0;
  for (const entry of entries) {
    for (const language of LANGUAGES) {
      ordinal += 1;
      const result = await importOne(
        ordinal,
        entry.qlId,
        entry.cpId,
        language,
      );
      if (result === "created") created += 1;
      else existing += 1;
      if (ordinal % 50 === 0 || ordinal === EXPECTED_ITEMS) {
        console.log(`Imported ${ordinal}/${EXPECTED_ITEMS}`);
      }
    }
  }

  const summary = await verify();
  await sqlClient`
    UPDATE content.generation_runs
    SET
      status = 'approved'::generation_run_status,
      completed_at = now(),
      updated_at = now()
    WHERE id = ${RUN_ID}::uuid
  `;

  const runAuditId = stableId("run-approved-audit", RELEASE_ID);
  await sqlClient`
    INSERT INTO platform.audit_events (
      id, actor_type, actor_user_id, effective_role_key,
      action_key, entity_type, entity_id,
      reason, summary, metadata
    ) VALUES (
      ${runAuditId}::uuid,
      'user'::audit_actor_type,
      ${ACTOR_ID}::uuid,
      'super_admin',
      'question_studio.generation_run.approved',
      'generation_run',
      ${RUN_ID}::uuid,
      'Completed PNL-001 canonical production import',
      'Imported and approved all 558 PNL-001 canonical Question Bank records',
      ${JSON.stringify({ releaseId: RELEASE_ID, summary })}::jsonb
    )
    ON CONFLICT (id) DO NOTHING
  `;

  console.log(
    JSON.stringify(
      {
        status: "PASS",
        releaseId: RELEASE_ID,
        runId: RUN_ID,
        runCode: RUN_CODE,
        created,
        existing,
        summary,
      },
      null,
      2,
    ),
  );
}

try {
  await main();
} finally {
  await sqlClient.end({ timeout: 5 });
}
