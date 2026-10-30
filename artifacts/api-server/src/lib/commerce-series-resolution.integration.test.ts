import assert from "node:assert/strict";
import test from "node:test";
import postgres from "postgres";
import { loadEligibleSeriesTestGroups, SeriesPackageSelectionError } from "./commerce-series-resolution";
import { composePackageTestIds } from "./commerce-series-composition";
import { evaluateTestAccess } from "./canonical-commerce-entitlements";

// This suite MUST run only against the disposable Postgres CI service.
const connectionString = process.env.TEST_COMMERCE_DATABASE_URL ?? "";
const safeDatabase = (() => {
  try {
    const u = new URL(connectionString);
    return ["localhost", "127.0.0.1"].includes(u.hostname) &&
      u.pathname === "/examtree_commerce_series_test";
  } catch { return false; }
})();
if (!safeDatabase) throw new Error("Integration tests require a disposable localhost examtree_commerce_series_test database");

const ids = {
  seriesA: "10000000-0000-4000-8000-000000000001",
  seriesB: "10000000-0000-4000-8000-000000000002",
  v1: "20000000-0000-4000-8000-000000000001",
  v2: "20000000-0000-4000-8000-000000000002",
  archived: "20000000-0000-4000-8000-000000000003",
  expired: "20000000-0000-4000-8000-000000000004",
  hidden: "20000000-0000-4000-8000-000000000005",
  empty: "20000000-0000-4000-8000-000000000006",
  unready: "20000000-0000-4000-8000-000000000007",
  missing: "20000000-0000-4000-8000-000000000008",
  t1: "30000000-0000-4000-8000-000000000001",
  t2: "30000000-0000-4000-8000-000000000002",
  t3: "30000000-0000-4000-8000-000000000003",
  draft: "30000000-0000-4000-8000-000000000004",
};

test("SQL-backed canonical series composition and frozen grant snapshots", async () => {
  const sql = postgres(connectionString, { max: 1 });
  try {
    await sql`CREATE SCHEMA assessment`;
    await sql`CREATE SCHEMA commerce`;
    await sql`CREATE TABLE assessment.test_series (id uuid PRIMARY KEY, deleted_at timestamptz)`;
    await sql`CREATE TABLE assessment.test_series_versions (
      id uuid PRIMARY KEY, series_id uuid NOT NULL REFERENCES assessment.test_series(id),
      availability_end_at timestamptz, configuration jsonb NOT NULL DEFAULT '{}'::jsonb
    )`;
    await sql`CREATE TABLE assessment.tests (id uuid PRIMARY KEY, status text NOT NULL, deleted_at timestamptz)`;
    await sql`CREATE TABLE assessment.test_series_items (
      id uuid PRIMARY KEY, series_version_id uuid NOT NULL REFERENCES assessment.test_series_versions(id),
      test_id uuid NOT NULL, sort_order int NOT NULL
    )`;
    await sql`CREATE TABLE commerce.products (
      id uuid PRIMARY KEY, status text NOT NULL, current_version_number int NOT NULL
    )`;
    await sql`CREATE TABLE commerce.product_versions (
      id uuid PRIMARY KEY, product_id uuid NOT NULL REFERENCES commerce.products(id),
      version_number int NOT NULL, sale_price_minor bigint NOT NULL
    )`;
    await sql`CREATE TABLE commerce.entitlements (
      id uuid PRIMARY KEY, user_id uuid NOT NULL, status text NOT NULL,
      starts_at timestamptz NOT NULL, ends_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now()
    )`;
    await sql`CREATE TABLE commerce.product_version_tests (
      product_version_id uuid NOT NULL, test_id uuid NOT NULL, PRIMARY KEY(product_version_id, test_id)
    )`;
    await sql`CREATE TABLE commerce.entitlement_tests (
      entitlement_id uuid NOT NULL, test_id uuid NOT NULL, PRIMARY KEY(entitlement_id, test_id)
    )`;
    await sql`INSERT INTO assessment.test_series (id,deleted_at) VALUES
      (${ids.seriesA}::uuid,NULL), (${ids.seriesB}::uuid,now())`;
    await sql`INSERT INTO assessment.tests (id,status) VALUES
      (${ids.t1}::uuid,'live'), (${ids.t2}::uuid,'scheduled'),
      (${ids.t3}::uuid,'completed'), (${ids.draft}::uuid,'needs_fix')`;
    await sql`INSERT INTO assessment.test_series_versions (id,series_id,availability_end_at,configuration) VALUES
      (${ids.v1}::uuid,${ids.seriesA}::uuid,NULL,'{"learnerVisibility":"live"}'),
      (${ids.v2}::uuid,${ids.seriesA}::uuid,NULL,'{"learnerVisibility":"live"}'),
      (${ids.archived}::uuid,${ids.seriesB}::uuid,NULL,'{"learnerVisibility":"live"}'),
      (${ids.expired}::uuid,${ids.seriesA}::uuid,'2026-01-01T00:00:00Z','{"learnerVisibility":"live"}'),
      (${ids.hidden}::uuid,${ids.seriesA}::uuid,NULL,'{"learnerVisibility":"hidden"}'),
      (${ids.empty}::uuid,${ids.seriesA}::uuid,NULL,'{"learnerVisibility":"live"}'),
      (${ids.unready}::uuid,${ids.seriesA}::uuid,NULL,'{"learnerVisibility":"live"}'),
      (${ids.missing}::uuid,${ids.seriesA}::uuid,NULL,'{"learnerVisibility":"live"}')`;
    const items: Array<[string,string,number]> = [
      [ids.v1,ids.t1,1],[ids.v1,ids.t2,2],
      [ids.v2,ids.t1,1],[ids.v2,ids.t2,2],[ids.v2,ids.t3,3],
      [ids.archived,ids.t1,1],[ids.expired,ids.t1,1],
      [ids.hidden,ids.t1,1],[ids.unready,ids.draft,1],
      [ids.missing,"30000000-0000-4000-8000-000000000099",1],
    ];
    for (const [v,id,order] of items) {
      await sql`INSERT INTO assessment.test_series_items (id,series_version_id,test_id,sort_order)
        VALUES (gen_random_uuid(),${v}::uuid,${id}::uuid,${order})`;
    }
    const client = sql as unknown as Parameters<typeof loadEligibleSeriesTestGroups>[0];
    const oldGroups = await loadEligibleSeriesTestGroups(client,[ids.v1]);
    assert.deepEqual(oldGroups, [[ids.t1,ids.t2]]);
    const combined = composePackageTestIds([ids.t1],oldGroups);
    assert.deepEqual(combined,[ids.t1,ids.t2]);
    const productVersion = "40000000-0000-4000-8000-000000000001";
    const entitlement = "50000000-0000-4000-8000-000000000001";
    for (const testId of combined) {
      await sql`INSERT INTO commerce.product_version_tests VALUES (${productVersion}::uuid,${testId}::uuid)`;
    }
    const productId = "70000000-0000-4000-8000-000000000001";
    const userId = "80000000-0000-4000-8000-000000000001";
    await sql`INSERT INTO commerce.products VALUES (${productId}::uuid,'active',1)`;
    await sql`INSERT INTO commerce.product_versions VALUES (${productVersion}::uuid,${productId}::uuid,1,29900)`;
    const beforePurchase = await evaluateTestAccess({ userId, testId: ids.t1, client });
    assert.equal(beforePurchase.allowed, false);
    assert.equal(beforePurchase.paidAccessRequired, true);
    assert.equal((await evaluateTestAccess({ userId, testId: ids.t3, client })).allowed, true);
    await sql`INSERT INTO commerce.entitlements (id,user_id,status,starts_at,ends_at)
      VALUES (${entitlement}::uuid,${userId}::uuid,'active',now() - interval '1 hour', now() + interval '1 day')`;
    // Same immutable purchase-grant SQL shape as canonical payment finalization.
    await sql`INSERT INTO commerce.entitlement_tests (entitlement_id,test_id)
      SELECT ${entitlement}::uuid,test_id FROM commerce.product_version_tests
      WHERE product_version_id = ${productVersion}::uuid
      ON CONFLICT DO NOTHING`;
    const afterPurchase = await evaluateTestAccess({ userId, testId: ids.t1, client });
    assert.equal(afterPurchase.allowed, true);
    assert.equal(afterPurchase.reason, "active_entitlement");
    await sql`UPDATE commerce.entitlements SET ends_at = now() - interval '1 minute' WHERE id = ${entitlement}::uuid`;
    assert.equal((await evaluateTestAccess({ userId, testId: ids.t1, client })).allowed, false);
    await sql`UPDATE commerce.entitlements SET ends_at = now() + interval '1 day', status = 'revoked' WHERE id = ${entitlement}::uuid`;
    assert.equal((await evaluateTestAccess({ userId, testId: ids.t1, client })).allowed, false);
    await sql`UPDATE commerce.entitlements SET status = 'active' WHERE id = ${entitlement}::uuid`;
    const updatedGroups = await loadEligibleSeriesTestGroups(client,[ids.v2]);
    assert.deepEqual(updatedGroups, [[ids.t1,ids.t2,ids.t3]]);
    const purchased = await sql`SELECT test_id::text AS id FROM commerce.entitlement_tests
      WHERE entitlement_id = ${entitlement}::uuid ORDER BY test_id`;
    assert.deepEqual(purchased.map(row=>String(row.id)),[ids.t1,ids.t2]);
    for (const bad of [ids.archived, ids.expired, ids.hidden, ids.empty, ids.unready, ids.missing]) {
      await assert.rejects(loadEligibleSeriesTestGroups(client,[bad]), (error: unknown) =>
        error instanceof SeriesPackageSelectionError && error.code === "SERIES_NOT_READY");
    }
    await assert.rejects(loadEligibleSeriesTestGroups(client,["60000000-0000-4000-8000-000000000001"]),
      (error: unknown) => error instanceof SeriesPackageSelectionError && error.code === "SERIES_VERSION_MISSING");
    // An invalid attempt to include an archived series cannot mutate a previously frozen entitlement.
    const retained = await sql`SELECT count(*)::int AS count FROM commerce.entitlement_tests WHERE entitlement_id = ${entitlement}::uuid`;
    assert.equal(retained[0].count,2);
  } finally {
    await sql.end();
  }
});
