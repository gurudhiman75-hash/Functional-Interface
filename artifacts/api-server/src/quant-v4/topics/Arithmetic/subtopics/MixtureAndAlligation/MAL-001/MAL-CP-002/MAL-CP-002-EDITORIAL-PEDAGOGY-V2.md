# MAL-CP-002 — English Editorial Pedagogy V2

Status: **runtime editorial correction under executable validation**  
Authority: `MAL-CP002-EN-EDITORIAL-V2`  
Base mathematical release: `MAL-CP002-EN-v1`  
Permanent QLs: `MAL-QL-012` through `MAL-QL-028`

## Purpose

This checkpoint corrects learner-facing language and pedagogy without changing any mathematical authority, answer, option, correct index, QL identity, difficulty, CP ownership or delivery gate.

## Method boundary

- `MAL-CP-001` retains the structured responsive SVG alligation cross for appropriate price, grade and target-mean questions.
- `MAL-CP-002` uses the conserved-ratio-part method and must not use an alligation cross or alligation terminology.
- Single remove-and-refill questions use proportional retention followed by refill; they are not recast as alligation.

## Editorial rules

1. Use natural SSC, banking and Punjab-state-exam stem voice.
2. Avoid routine actor-led openings such as “A fuel technician…” or “A pulse merchant…”.
3. Remove learner-facing engine jargon, including `fixed counterpart`, `unaltered component`, `unchanged component` and `changed component`.
4. Do not add `pure` before ordinary item names in stems or explanations.
5. Use item-specific teacher language: “Since only apple juice is added, grape juice remains …”.
6. Put quantities, ratios and calculations inside MathJax delimiters.
7. Show directed arithmetic for addition and removal; do not hide direction with raw absolute-value bars.
8. Reject citation debris such as `[cite_start]`, `[cite:…]`, `googleusercontent` and `immersive_entry_chip`.
9. Preserve the responsive before/after ratio SVG as a supporting ledger, not as an alligation diagram.

## Runtime architecture

The V2 layer wraps the frozen V1 mathematical package. It re-authors only:

- stem;
- core concept and formula;
- worked steps;
- verification and conclusion;
- exam shortcut and trap warning;
- learner-facing diagram title, operation wording and note.

The wrapper asserts byte-equivalent mathematical solution, options, correct index and fingerprint against the base release.

## Audit scope

The executable audit must prove:

- 17 permanent QLs;
- 1,700 V2 questions and deterministic replays;
- 1,700 mathematical identity comparisons against V1;
- 68 regenerated review rows;
- Question Studio routing to V2 for every CP-002 QL;
- no prohibited jargon, alligation, raw absolute bars or citation debris;
- MathJax coverage for formulas and every worked calculation;
- CP-001 structured-alligation regression remains green.

## Approval honesty

This correction applies the senior editorial audit as an implementation directive. It does not claim a new separate product-owner row-by-row review of all 68 regenerated samples. The executable audit and review artifact remain the evidence for staging and release continuity.
