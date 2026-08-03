import { readFile } from "node:fs/promises";

import postgres from "postgres";

const RELEASE_ID = "PNL-001-CANONICAL-PRODUCTION-V1";
const EXPECTED_ITEMS = 558;
const PAYLOAD_PATH =
  process.env.PNL_PRODUCTION_PAYLOAD_PATH ??
  "/tmp/pnl-001-canonical-production-payload.json";
const connectionString = process.env.DATABASE_URL?.trim();

if (!connectionString) {
  throw new Error("DATABASE_URL is required for staging.");
}

const artifact = JSON.parse(await readFile(PAYLOAD_PATH, "utf8")) as {
  releaseId: string;
  qlCount: number;
  itemCount: number;
  items: Array<{
    ordinal: number;
    releaseId: string;
    importKey: string;
    qlId: string;
    cpId: string;
    language: "en" | "hi" | "pa";
    providerQuestionId: string;
    payload: Record<string, unknown>;
  }>;
};

if (
  artifact.releaseId !== RELEASE_ID ||
  artifact.qlCount !== 186 ||
  artifact.itemCount !== EXPECTED_ITEMS ||
  artifact.items.length !== EXPECTED_ITEMS
) {
  throw new Error("Canonical production artifact summary is invalid.");
}

const sql = postgres(connectionString, {
  max: 1,
  prepare: true,
  idle_timeout: 10,
  connect_timeout: 15,
});

try {
  await sql.begin(async (tx) => {
    for (const item of artifact.items) {
      await tx`
        INSERT INTO pnl_import_staging.items (
          release_id, ordinal, import_key, ql_id, cp_id,
          language, provider_question_id, payload, staged_at
        ) VALUES (
          ${RELEASE_ID},
          ${item.ordinal},
          ${item.importKey},
          ${item.qlId},
          ${item.cpId},
          ${item.language},
          ${item.providerQuestionId},
          ${JSON.stringify(item.payload)}::jsonb,
          now()
        )
        ON CONFLICT (release_id, import_key) DO UPDATE SET
          ordinal = EXCLUDED.ordinal,
          ql_id = EXCLUDED.ql_id,
          cp_id = EXCLUDED.cp_id,
          language = EXCLUDED.language,
          provider_question_id = EXCLUDED.provider_question_id,
          payload = EXCLUDED.payload,
          staged_at = now()
      `;
    }
  });

  const counts = await sql`
    SELECT
      COUNT(*)::int AS "itemCount",
      COUNT(DISTINCT import_key)::int AS "uniqueImportKeys",
      COUNT(DISTINCT provider_question_id)::int AS "uniqueProviderIds",
      COUNT(*) FILTER (WHERE language = 'en')::int AS "englishCount",
      COUNT(*) FILTER (WHERE language = 'hi')::int AS "hindiCount",
      COUNT(*) FILTER (WHERE language = 'pa')::int AS "punjabiCount"
    FROM pnl_import_staging.items
    WHERE release_id = ${RELEASE_ID}
  `;
  const summary = counts[0]!;
  for (const key of ["itemCount", "uniqueImportKeys", "uniqueProviderIds"] as const) {
    if (Number(summary[key]) !== EXPECTED_ITEMS) {
      throw new Error(`${key}: expected ${EXPECTED_ITEMS}, received ${summary[key]}.`);
    }
  }
  for (const key of ["englishCount", "hindiCount", "punjabiCount"] as const) {
    if (Number(summary[key]) !== 186) {
      throw new Error(`${key}: expected 186, received ${summary[key]}.`);
    }
  }

  console.log(
    JSON.stringify(
      {
        status: "PASS",
        releaseId: RELEASE_ID,
        stagingTable: "pnl_import_staging.items",
        ...summary,
      },
      null,
      2,
    ),
  );
} finally {
  await sql.end({ timeout: 5 });
}
