# COM-004 completion status

Status: COMPLETED / BANK-ONLY INTERNAL — frozen corpus is registered in the
existing Question Studio composite; downstream release gates remain closed.

Continuation branch: `feature/com004-chapter-completion-v1`, based on current
`New-main`, preserving the COM-004 source checkpoint `78ebf6f389e49ac8e9620300163dda544c4b9dc6`.
The original discovery checkpoint describes historical V1 discovery only and
must not be used to report current coverage.

## Current content

- Source saturation/merge-split and permanent allocation already exist.
- 17 permanent QLs, 12 English questions each: 204 total.
- Historical English Freeze V1 is unchanged.
- English editorial revision V2 corrects 13 items containing authoring-scope
  questions, internal chapter references, or explanations about governance.
- Hindi: 204 authored items, QL001–017.
- Punjabi: 204 authored items, QL001–017.
- Missing: none.
- V2 is the versioned English freeze bound to the localization corpus; a correction requires a new source version.

The localization constructor now binds to the complete chapter source rather
than only Wave 1. It records whether the source is the historical V1 freeze or
the V2 revision, rejects malformed copy and unsupported languages, and freezes
nested options/source references. Historical Wave 1 IDs remain stable.

## Validation

`com004-chapter-completion.test.ts` checks the 204-item revised English corpus,
all authored localizations, answer/source binding, script presence, duplicate
options/stems/IDs, immutable output, and rejection of invalid inputs. The audit
reports `releaseReady: true` for content completeness. The separate freeze and
difficulty audit records the Hindi/Punjabi freeze fingerprints and the Easy /
Medium-only review topology. Passing the regression suite does not authorize
test-builder eligibility or public publication.

`com004-english-freeze-v1.test.ts` preserves the historical freeze contract.

## Controlled registration completed

1. Chapter-wide English Freeze V2 and Hindi/Punjabi Localization Freeze V2 are
   versioned and fingerprinted.
2. The frozen corpus is registered in the existing knowledge-v1 Question Studio
   composite with shared lifecycle, selector validation and deterministic
   no-repeat selection.
3. Difficulty filtering is available for Easy and Medium review batches. Hard,
   scored-test, mock-test and public-release gates remain closed.

Question Bank acceptance is `BANK_ONLY` and still requires manual approval. No
separate studio is created.
