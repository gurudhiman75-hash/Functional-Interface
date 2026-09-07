# COM-004 completion status

Status: BANK-ONLY INTERNAL — V4 editorial review approved and active in Question
Studio. Hard, test-builder, mock-test, public-release and production gates remain
closed.

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
- English and Hindi/Punjabi Freeze V4 now feed Question Studio. V1–V3 remain historical.
- V3 applies exactly the 34 approved English stems/explanations and 34 translations per local language.
- The remaining 170 English questions now use direct stems and simple question-specific explanations.
- Hindi/Punjabi copy for the same 170 source IDs receives the same direct-copy cleanup; answer bindings and options are unchanged.
- Approved review file: `COM004-ENGLISH-QUESTION-REVIEW-V3.md`.
- V3 approval authority records the exact review-file SHA-256 and all 34 source IDs.

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

1. Chapter-wide English Freeze V3 and Hindi/Punjabi Localization Freeze V3 are
   versioned and fingerprinted.
2. The frozen corpus is registered in the existing knowledge-v1 Question Studio
   composite with shared lifecycle, selector validation and deterministic
   no-repeat selection.
3. Difficulty filtering is available for Easy and Medium review batches. Hard,
   scored-test, mock-test and public-release gates remain closed.

Question Bank acceptance is `BANK_ONLY` and still requires manual approval. No
separate studio is created.

## V3 editorial validation

The V3 runtime test compares the authored English text with the approved Markdown,
checks 612 generated records, preserves answer/options and source IDs, and confirms
that non-revised questions retain their prior text. Activation V2 binds Freeze V3
and Difficulty Authority V2 to the existing BANK_ONLY lifecycle.

## V4 complete editorial freeze and runtime activation

- `com004-english-editorial-candidate-v4.ts` applies the direct-stem/simple-explanation style to the other 170 English items.
- The 34 V3-approved questions remain byte-for-byte unchanged in the candidate.
- All 204 English, Hindi and Punjabi questions retain their answers, options, source IDs and provenance bindings.
- `COM004-COMPLETE-ENGLISH-REVIEW-V4.md` is generated directly from the complete candidate corpus, with all four options, answer and explanation for each question.
- Hindi/Punjabi V4 localization is frozen with a versioned fingerprint and bound to English Freeze V4.
- The active Question Studio adapter now serves V4 in all three languages with deterministic no-repeat selection.
- The candidate and runtime tests check 612 generated records, cross-language answer parity, protected source fields, direct stems and simple explanations.
- The user approved the complete V4 review. Question Bank acceptance remains `BANK_ONLY` and still requires manual approval.
