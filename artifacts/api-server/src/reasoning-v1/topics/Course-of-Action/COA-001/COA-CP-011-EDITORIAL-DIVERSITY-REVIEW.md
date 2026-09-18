# COA-001 / COA-CP-011 — Final Editorial & Diversity Review

Status: **APPROVED / FROZEN**

## What the final audit found

The frozen COA corpus is well balanced structurally:
- QL001–006: **15 semantic authorities each**
- QL008–009: **14 semantic authorities each**
- all four answer classes remain balanced inside every active QL;
- every active QL spans at least **10 domains**;
- English, Hindi and Punjabi authored statements have no exact duplicate statement surfaces.

The main runtime weakness was not content correctness. It was **semantic recycling inside large filtered Question Studio batches**.

Example: requesting many questions from one QL could previously cycle through its 14–15 underlying scenarios and present reordered wording as if they were new questions.

## CP011 fix

Question Studio now uses a semantic-uniqueness gate.

Within one review batch:
- the same semantic authority cannot appear twice;
- the real capacity of the selected filter is calculated first;
- if a request exceeds that capacity, generation stops with a clear error instead of repeating scenarios.

Examples:
- unfiltered four-way review: up to **50 unique semantic questions** in one batch;
- QL001–006: up to **15 unique semantic questions** per QL;
- QL008–009: up to **14 unique semantic questions** per QL;
- three-action profile: **6 unique semantic authorities**;
- five-code profile is capped before its four dedicated Either authorities can recycle.

## Difficulty integrity

CP011 does not manufacture difficulty coverage.

QL008 is intentionally Medium/Hard because genuine ordered-response reasoning is harder by design. If Question Studio requests QL008 + Easy, the truthful result is **no matching authority**, not a relabelled Medium question.

## Editorial regression protection

The final proof also blocks recurrence of machine-translated constructions already cleaned from Hindi/Punjabi, including patterns equivalent to:
- “final processing queue”;
- “outgoing notification queue”;
- “destination does not match” used unnaturally;
- “incoming payroll group”;
- unnatural “very large festival crowd” phrasing.

Localized learner surfaces also reject the English filler word **associated**.

## Lifecycle after CP011

Question Studio remains review-only.

Still closed:
- canonical Question Bank writes;
- test eligibility;
- mock eligibility;
- student/public delivery.

## Approval record

Approved by the product owner on **2026-09-18**.

This freezes:
1. the semantic anti-repetition rule;
2. QL008 Medium/Hard-only coverage;
3. the current 118 active ordinary + 10 source-backed profile authorities;
4. the final EN/HI/PA editorial surface.

The chapter may now proceed to **CP012 internal-eligibility evaluation**. CP011 approval does not itself make COA internally eligible.
