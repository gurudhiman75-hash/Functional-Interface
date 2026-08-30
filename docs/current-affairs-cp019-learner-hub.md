# Current Affairs Studio CP019 — Learner Hub

CP019 is the learner product surface for the verified Current Affairs pipeline.

## Routes

- `/current-affairs` — public released-pack hub
- `/current-affairs/notes/:code` — public released note reader
- `/current-affairs/quiz/:code` — public quiz runner; authenticated users submit tracked attempts
- `/current-affairs/revision` — authenticated due-only spaced-repetition runner

## Source of truth

The hub manifest is built only from active CP014 releases whose EN/HI/PA learning resources are currently published. Quiz links appear only for active CP016 learner deliveries.

The note reader consumes the existing published `learning_resources` endpoint. It renders Examtree-authored Markdown as React nodes and does not execute raw HTML.

The quiz runner consumes the CP016 answer-hidden learner snapshot. Anonymous submissions use stateless server grading. Signed-in submissions use the CP017 tracked-attempt endpoint, which creates or updates the D3/D7/D15/D30/D60 schedule.

The revision runner is protected by student authentication and submits only items returned by the server's due queue. The server independently rejects items that are not currently due or whose source release/delivery is no longer active.

## Deliberate boundaries

- No learner page can publish, approve, promote, or mutate Current Affairs editorial content.
- No answer key is present in the pre-submit learner question payload.
- Revoked releases disappear from hub, quiz and revision surfaces through existing active-release checks.
- CP019 does not unlock BANK_ONLY questions for mock tests.
