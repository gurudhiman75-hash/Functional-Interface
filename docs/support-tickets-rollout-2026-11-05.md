# Examtree support-ticket rollout (gated)
- Business mailbox: support@examtree.in; no SMTP secrets in frontend or repository.
- New API is disabled by default via EXAMTREE_SUPPORT_TICKETS_ENABLED (must equal true).
- Apply artifacts/api-server/migrations/20261105_support_tickets.sql through the approved database change process before enabling the flag.
- Validate database grants, privacy retention and backups before production activation.
- Public ticket submission is database-backed, with bounded fields, honeypot and rolling hourly IP/email rate limits. Acknowledgement is on-screen; no outgoing email is claimed.
- Admin ticket list/update requires Firebase authentication and canonical admin permissions.
- Verify end-to-end student submission and admin triage, disabled fallback, rate-limit behavior, and no unexpected changes to test-taking/auth/payment.
- Separate follow-up work: provider-backed receipt emails, assignment/history/audit timeline, retention cleanup, abuse protection behind trusted ingress.
- Do not enable the flag until migration, deployment and review have passed.
