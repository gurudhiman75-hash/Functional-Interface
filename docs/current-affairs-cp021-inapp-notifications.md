# Current Affairs Studio CP021 — In-app notification delivery

CP021 turns CP020's delivery-agnostic engagement signals into a controlled learner inbox. It remains deliberately in-app only.

## Delivery model

- Persistent inbox rows are written to `content.current_affairs_inapp_notifications`.
- Every signal has a stable per-user `signal_key`; `(user_id, signal_key)` is unique.
- Reading or dismissing a notification does not delete its dedupe record, so the same daily signal cannot be recreated and nag the learner again.
- Daily-pack notifications retain their source quiz code and are hidden if that learner quiz or its CP014 release is later revoked.
- Generic revision/saved-review signals are derived only from currently published/approved Current Affairs state.

## Anti-nag controls

Defaults:

- in-app notifications: enabled
- quiet hours: 22:00–07:00 India time
- daily cap: 3
- minimum gap: 180 minutes
- learner mute: optional, bounded to 30 days per update

Quiet hours support ranges that cross midnight. Delivery eligibility is evaluated before every persisted notification, so a first delivery in a run updates the cap/gap state for later signals in that same run.

## Scheduler

`current-affairs-notification-worker.mjs` runs hourly at minute 35.

The worker:

1. builds a bounded rotating candidate set of up to 250 active CA learners;
2. derives revision/recovery, saved-review, daily-target and fresh-daily-quiz state from canonical tables;
3. applies the learner's CP020 signal toggles and CP021 delivery controls;
4. persists only eligible in-app notifications;
5. records run counts and suppression reasons in `content.current_affairs_notification_runs`;
6. isolates per-user failures.

Opening the authenticated notification inbox also performs the same idempotent materialization for that learner, so the UI does not need to wait for the next hourly slot.

## Learner API

- `GET /current-affairs/notifications`
- `PATCH /current-affairs/notifications/preferences`
- `PATCH /current-affairs/notifications/:id` (`read` or `dismissed`)
- `POST /current-affairs/notifications/read-all`

All endpoints require the canonical Firebase-to-student identity mapping already used by CP017–CP020.

## Learner UI

The signed-in app header gets a Current Affairs notification bell with:

- unread badge;
- inbox list;
- mark-all-read;
- dismiss;
- deep links to the relevant Current Affairs action;
- on/off toggle;
- quiet-hour controls;
- daily cap;
- minimum-gap selection;
- mute/unmute for 24 hours.

## Deliberate boundaries

CP021 does not integrate Firebase Cloud Messaging, web push, email, SMS, WhatsApp, Twilio, Nodemailer or any other outbound provider. No browser push permission is requested. External delivery can be considered only after in-app frequency/engagement data validates the policy.

The notification API contains no quiz answer keys, correct indices or explanations.
