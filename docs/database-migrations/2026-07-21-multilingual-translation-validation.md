# Multilingual translation migration validation

Date: 2026-07-21

## Scope

Validation covered the additive migration in:

`docs/database-migrations/2026-07-21-multilingual-translation-operations.sql`

Production was not modified during this validation.

## Neon environment

- Project: `ExamTree`
- Project ID: `empty-sunset-07552954`
- Parent branch: `main` (`br-morning-bar-atttdxj4`)
- Temporary branch: `multilingual-activation-pr58-validation`
- Temporary branch ID: `br-still-band-at9fm4u0`
- Database: `neondb`
- PostgreSQL: `17.10`

## Migration safety changes

The original procedural `DO $$ ... $$` blocks were replaced with parser-safe statements. New named constraints are dropped only by exact name and recreated with explicit validation. New non-null lifecycle columns are added nullable, backfilled, assigned defaults, and then promoted to non-null.

The migration remains additive and repeatable:

- tables use `CREATE TABLE IF NOT EXISTS`;
- indexes use `CREATE INDEX IF NOT EXISTS`;
- columns use `ADD COLUMN IF NOT EXISTS`;
- permission descriptions use conflict-safe upserts;
- role grants use conflict-safe inserts.

## Executions

The exact migration statements were executed twice, unchanged, against temporary branch `br-still-band-at9fm4u0`.

| Run | Result |
| --- | --- |
| First execution | PASS — all 31 statements committed transactionally |
| Second execution | PASS — all 31 statements committed transactionally |

## Verified schema delta

The child-to-parent schema diff contained only the intended multilingual additions:

- language direction, script, fallback, and update metadata;
- question translator ownership, submission timestamps, quality snapshot, and lifecycle timestamps;
- translated question options;
- terminology governance;
- translated test metadata;
- translated section labels;
- validated lifecycle and foreign-key constraints;
- six supporting indexes.

No unrelated table, view, trigger, policy, function, extension, owner, or privilege drift was found.

## RBAC verification

Verified canonical role grants:

- `content.translations.read`: analyst, content admin, content author, content reviewer, super admin, test manager;
- `content.translations.update`: content admin, content author, super admin;
- `content.translations.review`: content admin, content reviewer, super admin;
- `settings.languages.manage`: content admin, super admin.

## End-to-end database smoke scenario

A disposable Punjabi translation workflow used real canonical records:

- test version: `f7840ef1-1437-4a3a-8f0c-e4d3ce4b645c`;
- section: `43310209-7375-4d51-b86e-cb73c2ef9e7a`;
- question version: `0e58d235-c58b-4be9-845d-289a46156bc8`;
- configured exam languages: English and Punjabi.

Assertions:

1. Draft question and test translations blocked publication readiness.
2. Question lifecycle accepted draft → in review → needs fix → in review → approved.
3. Test metadata lifecycle accepted draft → in review → approved.
4. The translated section count matched the source section count.
5. Four translated options matched four source options in key and order.
6. Complete approved Punjabi content satisfied the same readiness query used by the API.
7. The source correct answer remained option `C`; translations never changed scoring truth.
8. Terminology records persisted with preferred and forbidden forms.
9. Every smoke fixture was deleted before the transaction completed.

All assertions passed.

## Production status

The migration has not been applied to `main`. Production application requires a separate explicit approval after the activation pull request and final CI are green.
