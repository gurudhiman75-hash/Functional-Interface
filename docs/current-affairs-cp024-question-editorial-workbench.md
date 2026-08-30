# Current Affairs Studio CP024 — Question Editorial Workbench

CP024 gives editors a dedicated review surface for Current Affairs Question Studio items while preserving the release, Question Bank and learner-delivery boundaries established in CP014–CP016.

## Admin surfaces

- `/admin/content/current-affairs/questions` — Current Affairs question review queue.
- `/admin/content/current-affairs/questions/:generationItemId` — question editorial workbench.

The queue shows unreviewed, approvable, approved and lifecycle-locked items. The workbench shows the linked verified event/fact, evidence sources, English generation-item version, Hindi/Punjabi sidecars, release/promotion state and immutable English version history.

## English editorial revisions

English revisions may edit only the question stem and explanation. Options and `correctIndex` are evidence-locked.

Every English edit:

1. rechecks that the linked event is verified and conflict-free;
2. requires the canonical fact value to remain present;
3. creates a new immutable `content.generation_item_versions` row;
4. advances `generation_run_items.current_version_number`;
5. resets the generation item to `unreviewed`;
6. preserves `questionBankAcceptanceMode=BANK_ONLY`, `publiclyPublishable=false`, and `automaticStudentPublication=false`.

Old Hindi/Punjabi rows remain historical because they point at the previous English source version. They are never silently carried forward.

## Hindi/Punjabi parity

Manual localization continues to use the CP011 canonical localization runtime. CP024 adds approval-time semantic checks on top of CP011's existing target-script, canonical-fact, option-count and answer-index checks.

### CA-QL-001 — verified fact recall

Option values are canonical verified fact values. They must remain byte-for-byte equivalent after normalization in English, Hindi and Punjabi. Editors can revise localized stem/explanation wording but cannot replace the canonical option values.

### CA-QL-002 — event association

Option order and answer index remain fixed. Each localized option must exactly match the current approved CP010 Hindi/Punjabi learner title for the corresponding English event-title option. A manually translated distractor that does not map to the current approved event localization blocks approval even if its option count and answer index are otherwise correct.

If an expected event-title localization is missing or ambiguous, the question remains non-approvable until the underlying CP010 localization is resolved.

## Re-review after localization edits

CP024 adds database guards around `content.current_affairs_question_localizations`:

- any allowed localization insert/update resets its generation item to `unreviewed`;
- localization mutation is rejected after canonical Question Bank acceptance, an active CP015 promotion, or an approved CP014 release snapshot.

This prevents an approved question from retaining its approved status after a Hindi/Punjabi edit and closes raw-API bypasses of the CP024 parity gate.

## Editorial approval

Approval requires all of the following at the same current source version:

- editable review lifecycle;
- verified event;
- no open fact conflict;
- English BANK_ONLY/non-public lifecycle flags;
- valid option set and correct index;
- canonical fact preservation;
- current Hindi sidecar;
- current Punjabi sidecar;
- option-count and correct-index parity;
- canonical fact preservation in all languages;
- QL-family-specific semantic option parity.

Approval changes only `generation_run_items.status` to `approved` and writes an audit event.

It does **not**:

- set `accepted_question_id`;
- create/update `content.questions` or `content.question_versions`;
- create canonical question translations;
- assign exam/taxonomy mappings;
- unlock mock/test eligibility;
- approve a Current Affairs release;
- publish to learners.

CP014 still owns release approval. CP015 still owns canonical Question Bank promotion from the exact approved release snapshot.

## Lifecycle locks

The workbench becomes read-only when the question is already:

- included in an approved Current Affairs release;
- actively promoted through CP015; or
- accepted into the canonical Question Bank.

Historical version/release evidence remains visible.
