# PCT-CONTENT-007 - Priority Cleanup Report

## Scope

Priority-1 editorial cleanup was continued for Percentage content after the PCT-CONTENT-006 audit.

This pass remained editorial-only. The intended source edits were limited to English question-language templates.

## Files edited

- `PCT-001/question-language.en.json`
- `PCT-005/question-language.en.json`
- `pct-content-007-priority-cleanup-report.md`

## Files inspected / already fixed in current workspace state

- `PCT-002/question-language.en.json`
- `PCT-004/question-language.en.json`

## Guardrails followed

No solver, validator, parameter generator, reasoning graph, pipeline, registry, schema, contract, runtime, explanation renderer, Hindi, or Punjabi files were intentionally modified.

Existing QL IDs were preserved. Existing placeholders were preserved.

## PCT-001 cleanup completed in this pass

Primary work was concentrated in `PCT-001/PCT-CP-002`, because the audit flagged this chapter as one of the largest duplicate-clone blocks.

### CP touched

- `PCT-001/PCT-CP-002`

### QL IDs touched in this continuation

- `PCT-QL-310`
- `PCT-QL-410`
- `PCT-QL-211`
- `PCT-QL-311`
- `PCT-QL-411`
- `PCT-QL-112`
- `PCT-QL-212`
- `PCT-QL-312`
- `PCT-QL-412`
- `PCT-QL-113`
- `PCT-QL-213`
- `PCT-QL-313`
- `PCT-QL-413`
- `PCT-QL-114`
- `PCT-QL-214`
- `PCT-QL-314`
- `PCT-QL-414`
- `PCT-QL-215`
- `PCT-QL-315`
- `PCT-QL-415`
- `PCT-QL-216`
- `PCT-QL-316`
- `PCT-QL-416`
- `PCT-QL-217`
- `PCT-QL-317`
- `PCT-QL-417`
- `PCT-QL-218`
- `PCT-QL-318`
- `PCT-QL-418`
- `PCT-QL-219`
- `PCT-QL-319`
- `PCT-QL-419`

### Editorial directions introduced

The old repeated abstract shells were converted into more varied exam-like settings, including:

- department sanctioned posts
- school club membership
- rainfall record
- bus depot passes
- library active cards
- revised bill
- shop bill
- electricity bill
- library count
- revised grant
- stock balance
- water-supply reading
- passenger count
- revision note
- stock register
- library register
- pass count
- pay-slip note
- staff revision list
- pay register
- fee addition
- stock addition
- surcharge
- budget sheet
- marks record
- production report
- vote record
- stock sheet
- budget allocation note
- price restoration
- stock restoration
- turnout restoration

## PCT-002 status

The exact duplicate pairs flagged by PCT-CONTENT-006 are already fixed in the current workspace state.

Confirmed current state:

- `PCT-002/PCT-CP-008/PCT-QL-042` is now a survey roster style prompt.
- `PCT-002/PCT-CP-010/PCT-QL-049` is now a district summary style prompt.

No additional PCT-002 source edits were needed in this continuation pass.

## PCT-004 status

The exact duplicate pair flagged by PCT-CONTENT-006 is already fixed in the current workspace state.

Confirmed current state:

- `PCT-004/PCT-CP-003/PCT-QL-006` is now a revised-value notice prompt instead of a duplicate of `PCT-QL-005`.

No additional PCT-004 source edits were needed in this continuation pass.

## PCT-005 cleanup completed in this pass

PCT-005 already had most plus/minus sign notation removed in the current workspace state. This continuation pass cleaned remaining unnatural successive-change phrasing.

### CP touched

- `PCT-005/PCT-CP-009`

### QL IDs touched

- `PCT-QL-017`
- `PCT-QL-018`
- `PCT-QL-045`
- `PCT-QL-046`

### Wording cleanup

Replaced compressed wording such as:

- `changed successively by {rate1}% rise, {rate2}% rise, and a {rate3}% fall`
- `changed by {rate1}% rise, {rate2}% rise, a {rate3}% fall, and a {rate4}% rise`

with natural stage-by-stage English such as:

- rose by `{rate1}%` in the first stage
- rose by `{rate2}%` in the second stage
- fell by `{rate3}%` in the third stage
- rose by `{rate4}%` in the fourth stage

## Unnatural English cleanup

The audit issue `water flies away` was checked in `PCT-001/PCT-CP-006`. Current workspace already uses natural wording:

- `water evaporates`

No additional edit was needed for that issue.

## Items still recommended for later passes

PCT-001 still contains many clone families outside the CP-002 slice cleaned here, especially:

- `PCT-001/PCT-CP-003`
- `PCT-001/PCT-CP-004`
- `PCT-001/PCT-CP-005`
- `PCT-001/PCT-CP-006`

Recommended next task:

`PCT-CONTENT-008 - PCT-001 CP-003 to CP-006 Clone Cleanup`

That task should continue the same approach: keep one direct version per mathematical shell and rewrite clone copies into distinct record, report, ledger, register, notice, or public-data structures.

## Validation

Attempted to run a local JSON parse command for:

- `PCT-001/question-language.en.json`
- `PCT-002/question-language.en.json`
- `PCT-004/question-language.en.json`
- `PCT-005/question-language.en.json`

The command could not execute because the connector returned:

`spawn bash ENOENT`

So JSON validation remains pending in this connector session.
