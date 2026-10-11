# Quant closure reconciliation — 11 October 2026

Base checked: `8ad6519756556abaddecf67c96b8f901ef07bd1c` (`New-main`). Scope: existing closure authorities, dedicated review capabilities and the actual unified Quant adapter. This is a routing/authority reconciliation, not a new source audit of every chapter. Live verification remains deferred to the user.

## Confirmed integration findings

| Chapter | Existing dedicated authority | Unified status after this change | Next work |
|---|---|---|---|
| Surds & Indices | 58 permanent QLs; 12 CPs; approved frozen EN/HI/PA | **Connected: SRI-001 and SRI-002** | No integration gap remains for the existing frozen scope |
| Number System CP008–014 | NUM-002; 88 permanent QLs; 7 CPs; EN/HI/PA | Missing | Connect the existing aggregate and its checkpoint-specific dispatch |
| Interest | INT-001; 133 permanent QLs; 10 CPs; EN/HI/PA | Missing | Connect the complete chapter admin adapter |
| Algebra | ALGEBRA; 43 permanent QLs; 14 permanent-owning CPs; EN/HI/PA; BANK_ONLY | Missing | Connect V5 delivery and preserve its existing Bank-only authority, central profiles and option counts |

These packages already have working dedicated review paths. Their absence from the unified registry is an integration defect, not evidence that their mathematical models or translations need rebuilding. Algebra CP015 is composition-only and does not own a new permanent QL.

Number System needs a second reconciliation: NUM-001 currently exposes CP001/003/004 through the unified card, with native generation declared only for CP001. The final allocation authority covers fourteen checkpoints and 253 QLs. CP002/005/006/007 and the CP003/004 language policies must therefore be checked against their later checkpoint authorities before declaring complete unified chapter exposure.

## Preserved chapter scope

The actual adapter snapshot contains 62 Quant package cards after the SRI connection. It includes Average, Mixture & Alligation, the current Number System subset, Percentage, Profit & Loss, Partnership, Ratio & Proportion, SAP, Time & Work, Trigonometry, Geometry, Mensuration, Probability, P&C, TSD, all fourteen Statistics packages and all fourteen individual DI packages plus its delivery mix.

P&C's 11 October technical freeze and TSD's latest merged closure stay intact. The P&C guard still verifies all 267 frozen files and its PNC integration projection. SAP, TMW, RAP, Mensuration and Probability are not reopened because a delivery gate is locked. Their existing closure scope remains authoritative.

Statistics' `STATISTICS-PAPER-II-CLOSURE-AUDIT.md` explicitly closes its current mathematical/Paper-II scope and leaves localization disabled. Its English-only cards are not a newly discovered syllabus gap. DI's `CONTENT-QUALITY-STATUS.md` freezes mainstream source breadth and learner content while explicitly deferring its novelty/edge pass. Neither deferred extension is relabelled as failed implementation.

Percentage cards currently advertise English; the next capability check must compare those declarations with the existing localized delivery before deciding whether metadata or runtime needs a repair. DI-MIX-001 also advertises English while its individual packages advertise all three languages. These are capability follow-ups, not yet proven missing content.

## SRI repair and proof

The unified adapter now lists SRI-001/SRI-002 once each and dispatches their existing `question-studio-v1` runtime before general Number System routing. Package, CP, QL, language and difficulty selectors preserve source ownership. Invalid filters, counts and runtime modes produce client errors. Permanent IDs, freeze fingerprints and approved localization artifact `9684834606` are preserved.

Type corrections fix readonly distractor tuples, four-option tuple construction, lookup key types, literal checkpoint arrays and QL narrowing. A stale multilingual audit previously included active Question Studio review in `downstreamLocked`, causing its final assertion to fail despite Bank/test/public gates being closed. It now reports `questionStudioReviewEnabled` separately and verifies the three downstream release locks explicitly.

Validation passed:

- 696 actual unified learner surfaces: 58 QLs × 3 languages × 4 seeds, with identical content to dedicated delivery, deterministic repeats, exact canonical-answer parity and release locks.
- 18 language/difficulty batches, all 12 checkpoint routes, QL-only and chapter-alias routing, and invalid-request cases.
- All 58 stored English fingerprints and 928 frozen English runtime checks.
- 2,784 frozen native runtime checks, deterministic/content parity and deep immutability.
- Scoped production TypeScript and patch hygiene.
- Existing P&C technical-freeze guard.

SRI remains REVIEW_ONLY. Bank writes, scored-test/mock eligibility, public publication and automatic student delivery remain false.

The JSON companion records the complete unified package snapshot and executable comparisons with dedicated authorities. Reproduce it from `artifacts/api-server` by bundling and running `scripts/audits/quant-closure-reconciliation.ts`. Its validation-count fields reference this change's separately run proofs; the reconciliation script itself inspects registrations rather than rerunning every proof.
