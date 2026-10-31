import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import postgres from "postgres";

import { evaluateTestAccess } from "./canonical-commerce-entitlements";
import { promotePaidPackageTestPolicies } from "./commerce-test-access-policy";

const connectionString = process.env.TEST_COMMERCE_DATABASE_URL ?? "";
const safeDatabase = (() => {
  try {
    const url = new URL(connectionString);
    return ["localhost", "127.0.0.1"].includes(url.hostname) &&
      url.pathname === "/examtree_commerce_series_test";
  } catch { return false; }
})();
if (!safeDatabase || process.env.DATABASE_URL !== connectionString) {
  throw new Error("Policy integration tests require the disposable localhost CI database");
}

const freeTest = "11111111-1111-4111-8111-111111111111";
const archivedOfferTest = "22222222-2222-4222-8222-222222222222";
const newlyPremiumTest = "33333333-3333-4333-8333-333333333333";
const explicitFreeTest = "44444444-4444-4444-8444-444444444444";
const unclassifiedTest = "55555555-5555-4555-8555-555555555555";
const oldProductVersion = "66666666-6666-4666-8666-666666666666";
const newProductVersion = "77777777-7777-4777-8777-777777777777";
const actor = "88888888-8888-4888-8888-888888888888";
const student = "99999999-9999-4999-8999-999999999999";
const entitlement = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

test("explicit policy backfill, archive independence, premium synchronization and free override", async () => {
  const sql = postgres(connectionString, { max: 1 });
  try {
    // This is a disposable CI database, never the canonical Neon project.
    await sql`DROP SCHEMA IF EXISTS commerce CASCADE`;
    await sql`DROP SCHEMA IF EXISTS assessment CASCADE`;
    await sql`DROP SCHEMA IF EXISTS identity CASCADE`;
    await sql`CREATE SCHEMA identity`;
    await sql`CREATE SCHEMA assessment`;
    await sql`CREATE SCHEMA commerce`;
    await sql`CREATE TABLE identity.users (id uuid PRIMARY KEY)`;
    await sql`CREATE TABLE assessment.tests (id uuid PRIMARY KEY)`;
    await sql`CREATE TABLE commerce.product_versions (id uuid PRIMARY KEY, sale_price_minor bigint NOT NULL)`;
    await sql`CREATE TABLE commerce.product_version_tests (
      product_version_id uuid NOT NULL REFERENCES commerce.product_versions(id),
      test_id uuid NOT NULL REFERENCES assessment.tests(id),
      PRIMARY KEY (product_version_id,test_id)
    )`;
    await sql`CREATE TABLE commerce.entitlements (
      id uuid PRIMARY KEY, user_id uuid NOT NULL, status text NOT NULL,
      starts_at timestamptz NOT NULL, ends_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now()
    )`;
    await sql`CREATE TABLE commerce.entitlement_tests (entitlement_id uuid NOT NULL, test_id uuid NOT NULL)`;
    await sql`INSERT INTO identity.users VALUES (${actor}::uuid)`;
    for (const id of [freeTest,archivedOfferTest,newlyPremiumTest,explicitFreeTest,unclassifiedTest]) {
      await sql`INSERT INTO assessment.tests VALUES (${id}::uuid)`;
    }
    await sql`INSERT INTO commerce.product_versions VALUES
      (${oldProductVersion}::uuid,19900),(${newProductVersion}::uuid,24900)`;
    await sql`INSERT INTO commerce.product_version_tests VALUES (${oldProductVersion}::uuid,${archivedOfferTest}::uuid)`;

    const migration = readFileSync("docs/database-migrations/2026-10-31-explicit-test-access-policies.sql", "utf8");
    await sql.unsafe(migration).simple();
    const mode = async (testId: string) => {
      const rows = await sql`SELECT access_mode AS mode, source FROM commerce.test_access_policies WHERE test_id = ${testId}::uuid`;
      return rows[0] ? { mode: String(rows[0].mode), source: String(rows[0].source) } : null;
    };
    assert.deepEqual(await mode(archivedOfferTest), { mode:"premium", source:"backfill" });
    assert.deepEqual(await mode(freeTest), { mode:"free", source:"backfill" });

    // An archived/removed sales offer must never make its test free.
    await sql`DELETE FROM commerce.product_version_tests WHERE product_version_id = ${oldProductVersion}::uuid`;
    const client = sql as unknown as Parameters<typeof evaluateTestAccess>[0]["client"] & Parameters<typeof promotePaidPackageTestPolicies>[0];
    assert.equal((await evaluateTestAccess({ userId: student, testId: archivedOfferTest, client })).allowed,false);
    assert.equal((await evaluateTestAccess({ userId: student, testId: freeTest, client })).allowed,true);

    await sql`INSERT INTO commerce.product_version_tests VALUES
      (${newProductVersion}::uuid,${newlyPremiumTest}::uuid),
      (${newProductVersion}::uuid,${explicitFreeTest}::uuid)`;
    await sql`UPDATE commerce.test_access_policies SET access_mode = 'free', source = 'admin'
      WHERE test_id = ${explicitFreeTest}::uuid`;
    await promotePaidPackageTestPolicies(client!,newProductVersion,actor);
    assert.deepEqual(await mode(newlyPremiumTest), { mode:"premium", source:"package_activation" });
    assert.deepEqual(await mode(explicitFreeTest), { mode:"free", source:"admin" });

    // A newly created test without a configured policy fails closed, not free.
    await sql`DELETE FROM commerce.test_access_policies WHERE test_id = ${unclassifiedTest}::uuid`;
    assert.equal((await evaluateTestAccess({ userId: student, testId: unclassifiedTest, client })).allowed,false);

    await sql`INSERT INTO commerce.entitlements (id,user_id,status,starts_at,ends_at)
      VALUES (${entitlement}::uuid,${student}::uuid,'active',now() - interval '1 minute',now() + interval '1 day')`;
    await sql`INSERT INTO commerce.entitlement_tests VALUES (${entitlement}::uuid,${archivedOfferTest}::uuid)`;
    assert.equal((await evaluateTestAccess({ userId: student, testId: archivedOfferTest, client })).allowed,true);
    await sql`UPDATE commerce.entitlements SET status='revoked' WHERE id = ${entitlement}::uuid`;
    assert.equal((await evaluateTestAccess({ userId: student, testId: archivedOfferTest, client })).allowed,false);

    // Migration is additive and idempotent.
    await sql.unsafe(migration).simple();
    assert.deepEqual(await mode(explicitFreeTest), { mode:"free", source:"admin" });
    assert.deepEqual(await mode(archivedOfferTest), { mode:"premium", source:"backfill" });
  } finally { await sql.end(); }
});
