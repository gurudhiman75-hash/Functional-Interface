# Quant closure reconciliation — 11 October 2026

Base checked: `a4719f052c7be8ce0c39972587f4bb4e121d7d8d` (`New-main`). Scope: existing closure authorities, dedicated review capabilities and the actual unified Quant adapter. This is a routing/authority reconciliation, not a new source audit of every chapter. Live verification remains deferred to the user.

## Confirmed integration findings

| Chapter | Existing dedicated authority | Unified status after this change | Next work |
|---|---|---|---|
| Surds & Indices | 58 permanent QLs; 12 CPs; approved frozen EN/HI/PA | **Connected: SRI-001 and SRI-002** | No integration gap remains for the existing frozen scope |
| Number System | NUM-001/NUM-002; 253 permanent QLs; 14 CPs; EN/HI/PA | Connected | Complete final allocation, including CP007 and controlled native CP003/004 review |
| Interest | INT-001; 133 permanent QLs; 10 CPs; EN/HI/PA | Connected | Connected the complete chapter admin adapter |
| Algebra | ALGEBRA; 43 permanent QLs; 14 permanent-owning CPs; EN/HI/PA; BANK_ONLY | Connected | Connected V5 delivery and preserved its existing Bank-only authority, central profiles and option counts |

These packages already have working dedicated review paths. Their absence from the unified registry is an integration defect, not evidence that their mathematical models or translations need rebuilding. Algebra CP015 is composition-only and does not own a new permanent QL.

Number System previously exposed only CP001/003/004. The complete 253-QL allocation and existing checkpoint language runtimes have now been connected; the controlled native review status of CP003/004 is retained.

## Preserved chapter scope

The adapter snapshot now includes the complete Number System cards and Interest/Algebra alongside SRI. It includes Average, Mixture & Alligation, the complete Number System allocation, Percentage, Profit & Loss, Partnership, Ratio & Proportion, SAP, Time & Work, Trigonometry, Geometry, Mensuration, Probability, P&C, TSD, all fourteen Statistics packages and all fourteen individual DI packages plus its delivery mix.

P&C's 11 October technical freeze and TSD's latest merged closure stay intact. The P&C guard still verifies all 267 frozen files and its PNC integration projection. SAP, TMW, RAP, Mensuration and Probability are not reopened because a delivery gate is locked. Their existing closure scope remains authoritative.

Statistics' `STATISTICS-PAPER-II-CLOSURE-AUDIT.md` explicitly closes its current mathematical/Paper-II scope and leaves localization disabled. Its English-only cards are not a newly discovered syllabus gap. DI's `CONTENT-QUALITY-STATUS.md` freezes mainstream source breadth and learner content while explicitly deferring its novelty/edge pass. Neither deferred extension is relabelled as failed implementation.

Percentage cards currently advertise English; the next capability check must compare those declarations with the existing localized delivery before deciding whether metadata or runtime needs a repair. DI-MIX-001 also advertises English while its individual packages advertise all three languages. These are capability follow-ups, not yet proven missing content.

## SRI repair and proof

The unified adapter now lists SRI-001/SRI-002 once each and dispatches their existing `question-studio-v1` runtime before general Number System routing. Package, CP, QL, language and difficulty selectors preserve source ownership. Invalid filters, counts and runtime modes produce client errors. Permanent IDs, freeze fingerprints and approved localization artifact `9684834606` are preserved.

Type corrections fix readonly distractor tuples, four-option tuple construction, lookup key types, literal checkpoint arrays and QL narrowing. A stale multilingual audit previously included active Question Studio review in `downstreamLocked`, causing its final assertion to fail despite Bank/test/public gates being closed. It now reports `questionStudioReviewEnabled` separately and verifies the three downstream release locks explicitly.

The dedicated integration regression also exposed concentrated correct-option placement across active review seeds. The review presentation now uses deterministic cyclic rotation, balances positions within each batch and cycles positions across numbered seed families. Frozen authority option arrays, text, distractors and canonical answers are untouched; source correct indices and the presentation policy are retained in traceability. Review question IDs include the delivery policy and position.

Validation passed:

- 696 actual unified learner surfaces: 58 QLs × 3 languages × 4 seeds, with identical content to dedicated delivery, deterministic repeats, exact canonical-answer parity and release locks.
- 18 language/difficulty batches, all 12 checkpoint routes, QL-only and chapter-alias routing, and invalid-request cases.
- The dedicated review regression: 174 language surfaces and 696 seed-diversity checks, including option-position spread; a 12-question single-QL batch also places three correct answers in each position.
- All 58 stored English fingerprints and 928 frozen English runtime checks.
- 2,784 frozen native runtime checks, deterministic/content parity and deep immutability.
- Scoped production TypeScript and patch hygiene.
- Existing P&C technical-freeze guard.

SRI remains REVIEW_ONLY. Bank writes, scored-test/mock eligibility, public publication and automatic student delivery remain false.

The JSON companion records the complete unified package snapshot and executable comparisons with dedicated authorities. Reproduce it from `artifacts/api-server` by bundling and running `scripts/audits/quant-closure-reconciliation.ts`. Its validation-count fields reference this change's separately run proofs; the reconciliation script itself inspects registrations rather than rerunning every proof.

## Remaining chapter integrations — 11 October

Unified Number System delivery now follows the executable final allocation authority: all 253 permanent QLs across 14 checkpoints, split into NUM-001 (139 QLs, six checkpoints) and NUM-002 (114 QLs, eight checkpoints). This includes CP007, which the older CP008–014 aggregate omitted. No permanent identities or mathematical generators were added or reassigned.

Existing CP001 and CP003/004 English review delivery is reused. CP002/005/006/007 use their permanent English and existing localized runtimes; CP008–014 use their direct checkpoint Question Studio integrations. CP003/004 Hindi/Punjabi remain controlled review surfaces with source statuses preserved. Review registration does not assert human approval or open student delivery. Package/CP/QL ownership mismatches, unsupported runtime modes and invalid counts are rejected. The chapter card declares that a chapter-wide difficulty filter is unsupported rather than silently ignoring it.

Interest now registers its existing full INT-001 chapter adapter: 133 actual permanent QLs across ten checkpoints in EN/HI/PA. The adapter's exact QL list is retained, including its Wave-6 ownership policy. It stays REVIEW_ONLY, and its unsupported chapter-wide difficulty filter is declared explicitly.

Algebra now registers its existing 43-QL, fourteen-checkpoint V5 runtime. CP015 remains composition-only. Its existing BANK_ONLY authority is preserved; SSC delivery has four options and Banking delivery five. Profile aliases use the existing exam resolver. Test/mock/public/automatic-student delivery stays locked.

The unified integration proof checks 1,416 learner surfaces: Number System 253 × 3, Interest 133 × 3 and Algebra 43 × 3 × 2 exam profiles, with deterministic repeated generation. It checks allocation ownership, answer/option binding, exact underlying mathematical-state parity across EN/HI/PA, unique multilingual review identities, native-script delivery, serialization, lifecycle locks, dedicated Interest/Algebra content parity, package batches and invalid requests. CI runs this proof with the existing registry, TMW and SRI proofs. Live verification remains deferred to the user.

CP004 also had a practical delivery defect: its prior review seed mapping reached two billion, while its retained independent verifier enumerates divisors up to the generated integer. Review delivery now maps to a bounded 240-seed source window and records the request seed, source seed and mapping policy. The source mathematics/verifier remain unchanged; every one of the 28 × 240 = 6,720 source states in that window passed answer/verifier/option binding checks. Newly connected numeric checkpoint delivery uses the same bounded source window.

Standalone TypeScript traversal reports diagnostics in the imported legacy graph; it reports none in the two new bridge files. Validation of the production bundle and registered runtime behavior is covered by the API build and integration CI, rather than representing the entire historical source tree as type-clean.

CP003/004 native review reuses the exact source seed selected by their approved English delivery, rather than independently hashing the request seed. Canonical source identities remain recorded while language-specific review identities distinguish localized surfaces.
