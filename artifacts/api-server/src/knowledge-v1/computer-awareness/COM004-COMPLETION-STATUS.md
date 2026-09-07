# COM-004 completion status

Status: IN PROGRESS — not chapter-complete and not runtime-activated.

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
- Hindi: 72 authored items, QL001–006.
- Punjabi: 72 authored items, QL001–006.
- Missing: 132 Hindi and 132 Punjabi items, QL007–017.
- V2 is a source revision candidate, not a fabricated human-reviewed freeze.

The localization constructor now binds to the complete chapter source rather
than only Wave 1. It records whether the source is the historical V1 freeze or
the V2 revision, rejects malformed copy and unsupported languages, and freezes
nested options/source references. Historical Wave 1 IDs remain stable.

## Validation

`com004-chapter-completion.test.ts` checks the 204-item revised English corpus,
all authored localizations, answer/source binding, script presence, duplicate
options/stems/IDs, immutable output, and rejection of invalid inputs. Its report
explicitly returns `releaseReady: false` for missing translations. Passing the
regression suite does not constitute editorial approval or chapter completion.

`com004-english-freeze-v1.test.ts` preserves the historical freeze contract.

## Work required to finish

1. Author and semantically review QL007–017 in both Hindi and Punjabi against
   the V2 source, including all four options and question-specific explanations.
2. Review existing QL001–004 language quality alongside the newer native-script
   copy. Structural/script checks are not a substitute for semantic review.
3. Finish chapter-wide distractor/difficulty and explanation-quality review;
   re-freeze versioned source revisions and localization with actual evidence.
4. Register in the existing knowledge-v1 Question Studio composite, using the
   shared lifecycle, selector validation and deterministic no-repeat selection.
5. Validate the real review/acceptance path before enabling any downstream use.

Question Studio, Question Bank, test/mock eligibility and public/automatic
publication are not enabled by this checkpoint. No separate studio is created.
