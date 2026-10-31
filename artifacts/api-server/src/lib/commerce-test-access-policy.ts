import type { sqlClient } from "./db";

type SqlExecutor = typeof sqlClient;

/** Activate paid membership without overriding an explicitly granted admin free preview. */
export async function promotePaidPackageTestPolicies(
  client: SqlExecutor,
  productVersionId: string,
  actorUserId: string,
): Promise<void> {
  await client`
    INSERT INTO commerce.test_access_policies (test_id, access_mode, source, changed_by, updated_at)
    SELECT pvt.test_id, 'premium', 'package_activation', ${actorUserId}::uuid, now()
    FROM commerce.product_version_tests pvt
    JOIN commerce.product_versions pv ON pv.id = pvt.product_version_id
    WHERE pvt.product_version_id = ${productVersionId}::uuid
      AND pv.sale_price_minor > 0
    ON CONFLICT (test_id) DO UPDATE
      SET access_mode = 'premium', source = 'package_activation',
        changed_by = EXCLUDED.changed_by, updated_at = now()
    WHERE commerce.test_access_policies.source <> 'admin'
      AND commerce.test_access_policies.access_mode <> 'premium'
  `;
}
