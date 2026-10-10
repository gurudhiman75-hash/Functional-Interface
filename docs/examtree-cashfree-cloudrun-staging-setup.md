# Examtree: Cashfree SANDBOX on Cloud Run staging

Only use this for the **staging** API `examtree-api-staging` in GCP project `sarbedutech`.
This document does not authorize production transactions, production API credentials,
live webhook migration, or switching Cloudflare/Render traffic.

## Why it is gated

The normal `scripts/deploy-examtree-api-cloudrun-staging.sh` deploy does **not**
enable Cashfree. `cashfreeSelected()` requires
`EXAMTREE_PAYMENT_PROVIDER=cashfree`; the sandbox gateway requires
`CASHFREE_ENV=sandbox` and sandbox client credentials.
Without credentials the webhook responds 503; with credentials but no signature
it rejects requests with 400. Do not interpret the 400 check as a successful
Cashfree provider transaction.

## 1. Create **sandbox** credentials in Google Secret Manager

Obtain the **sandbox**, not production, Cashfree client ID and secret from the
Cashfree sandbox dashboard. Never send credentials in chat, terminal output,
repository files, or diagnostic logs.

From Google Cloud Shell, safely stage each value in a chmod-600 file:

```bash
umask 077
nano /tmp/examtree-cashfree-client-id
nano /tmp/examtree-cashfree-client-secret
chmod 600 /tmp/examtree-cashfree-client-id /tmp/examtree-cashfree-client-secret

PROJECT=sarbedutech
for entry in \
  "examtree-cashfree-sandbox-client-id:/tmp/examtree-cashfree-client-id" \
  "examtree-cashfree-sandbox-client-secret:/tmp/examtree-cashfree-client-secret"; do
  secret="${entry%%:*}"
  file="${entry#*:}"
  if gcloud secrets describe "$secret" --project="$PROJECT" >/dev/null 2>&1; then
    gcloud secrets versions add "$secret" --project="$PROJECT" --data-file="$file"
  else
    gcloud secrets create "$secret" --project="$PROJECT" \
      --replication-policy=automatic --data-file="$file"
  fi
done
rm -f /tmp/examtree-cashfree-client-id /tmp/examtree-cashfree-client-secret
```

Keep secret names as in the script. The API runtime service account gains
Secret Manager *read* permission only during the approved staging deployment.

## 2. Deploy sandbox only

```bash
cd ~/Functional-Interface
git switch New-main
git pull --ff-only origin New-main
EXAMTREE_BUDGET_READY=yes EXAMTREE_ENABLE_CASHFREE_SANDBOX=yes \
  bash scripts/deploy-examtree-api-cloudrun-staging.sh sarbedutech
```

The script validates the two enabled secret versions **before building**.
It sets `EXAMTREE_PAYMENT_PROVIDER=cashfree`, `CASHFREE_ENV=sandbox`,
and references both secrets via Secret Manager. It uses the correct Cloud Run
staging `EXAMTREE_API_ORIGIN`, so newly created sandbox orders point
`order_meta.notify_url` directly to
`https://examtree-api-staging-1083299267005.asia-south1.run.app/api/billing/cashfree/webhook`.
The return URL points to `https://functional-interface.pages.dev/orders/:orderId`.
**Note:** the live frontend still calls Render; a staging API smoke test requires
an explicit staging API request with an authorized Firebase user.

Safe smoke checks run automatically:
- API health responds 200
- public product catalog indicates `checkoutProvider=cashfree`
- unsigned webhook responds 400 (never 200; an unconfigured webhook responds 503)
- no payment order, capture, refund, entitlement, or scheduled job is created

## 3. Actual sandbox acceptance (separate deliberate transaction)

After the preflight checks pass, create one **sandbox** order through the staging
`POST /api/commerce/orders` endpoint, using a valid sandbox test product and
authorized student token. Never pass secrets or tokens in chat.
Check the Cashfree sandbox order dashboard or sandbox API, then complete one
Cashfree-approved sandbox payment via the sandbox hosted checkout. Verify:

1. The Cashfree sandbox order and payment show SUCCESS / PAID.
2. The signed webhook reaches **Cloud Run staging** without 503 or 400.
3. `commerce.payment_events` records a verified, processed event.
4. `commerce.orders` is paid and `commerce.payment_attempts` is captured.
5. Exactly one paid entitlement and test link are created; test access is allowed.
6. Repeat signed webhook delivery, or reconciliation, does not duplicate grants.
7. A failure or user-dropped sandbox payment never creates access.
8. A fully verified sandbox refund revokes access per reviewed policy.
9. An unresolved/pending refund must **not** revoke access.

Avoid creating test payments against production accounts or production APIs.
Connected Cashfree merchant-account records may refer to a **different environment**
than sandbox; no results in the merchant account do not verify sandbox orders.
Do not repoint the student frontend or disable Render based only on staging success.

## 4. Disable / rollback

Run the standard staging deploy **without** `EXAMTREE_ENABLE_CASHFREE_SANDBOX=yes`
(or set it to `no`). The deploy rebuilds from `New-main` and omits Cashfree
provider env and sandbox credential secret mounts. This does not cancel existing
sandbox orders; reconcile those separately before decommissioning any webhook.

This script does not activate the Cloud Run background job.
