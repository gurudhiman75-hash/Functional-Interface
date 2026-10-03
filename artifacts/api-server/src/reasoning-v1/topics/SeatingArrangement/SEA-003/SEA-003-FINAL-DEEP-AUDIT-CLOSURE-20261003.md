# SEA-003 — Final Content Deep-Audit Closure

Date: 2026-10-03

Status: `CONTENT_DEEP_AUDIT_CLOSED__CP011_TO_CP015__9_PERMANENT_QLS__EN_HI_PA__REVIEW_ONLY`

## Package boundary

`SEA-003` is the conditional/advanced-state package inside `REAS-SEA — Seating Arrangement`.

It owns:
- `SEA-CP-011` — attribute-linked seating;
- `SEA-CP-012` — vacant-seat seating;
- `SEA-CP-013` — genuinely conditional seating clues;
- `SEA-CP-014` — uncertain-number seating;
- `SEA-CP-015` — post-arrangement transformations.

It does not own:
- ordinary single-row/circular seating already frozen in SEA-001;
- parallel-row, square, polygonal or concentric topology already owned by SEA-002;
- floor/flat puzzles owned by FLR-001;
- ranking as a standalone ordering problem owned by RNK-001;
- generic multi-attribute logic puzzles that do not materially depend on seating topology, owned by LP-001;
- Data Sufficiency answer shells.

## Permanent QL authority

SEA-003 allocates:
- `SEA-QL-043` — linear seating + bijective attribute layer;
- `SEA-QL-044` — circular seating + bijective attribute layer;
- `SEA-QL-045` — parallel rows with one explicit vacant seat;
- `SEA-QL-046` — linear seating with multiple vacancies;
- `SEA-QL-047` — solution-essential either/or seating condition;
- `SEA-QL-048` — solution-essential implication seating condition;
- `SEA-QL-049` — uncertain-number row with total-count inference;
- `SEA-QL-050` — uncertain-number row with middle/equal-side inference;
- `SEA-QL-051` — post-arrangement exchange transformation.

Total: **9 permanent QLs**.

Next available Seating identity: `SEA-QL-052`.

No separate QL is created for:
- name pool;
- option order;
- language;
- query target;
- ordinary left/right distance;
- attribute label;
- exact row length inside an existing uncertain-number contract;
- which two occupants are exchanged.

## Source posture

External validation confirms several core SEA-003 families are exam-real:
- banking question banks include seating with a second attribute layer such as colours;
- uncertain-number seating appears in current banking practice collections and reported IBPS PO / SBI Clerk exam analyses;
- an explicit one-vacant-seat two-parallel-row seating question is available in a competitive-exam question bank;
- exchange-of-position reasoning is present in official-paper question banks, including recent SSC and state/government examination material.

Reviewed references include:
- Testbook RBI Grade B Seating Arrangement Questions;
- Testbook Uncertain Seating MCQ collection;
- Testbook one-vacant-seat parallel-row question;
- Oliveboard IBPS PO / SBI Clerk reasoning analyses;
- Testbook SSC CHSL / MPSC / Navy position-exchange official-paper questions.

Vacant-seat multi-vacancy and explicit conditional-clue frequency are not overstated. Where recurring frequency evidence is thinner, the implementation relies on the already approved SEA-003 design boundary and keeps a conservative source-frequency claim.

## Solver authority

Every QL is solved against an exact finite state space relevant to the displayed problem.

Audited state spaces:
- QL043: `5! × 5! = 14,400` seat/attribute worlds;
- QL044: `4! × 5! = 2,880` circular-normalized seat/attribute worlds;
- QL045: `8! = 40,320` seven-person + one-vacancy parallel-row worlds;
- QL046: `7!/2! = 2,520` five-person + two-indistinguishable-vacancy linear worlds;
- QL047: `5! = 120` linear worlds;
- QL048: `5! = 120` linear worlds;
- QL049: **29,544** named-position worlds across row lengths 8..12;
- QL050: **29,544** named-position worlds across row lengths 8..12;
- QL051: `5! = 120` base arrangements before transformation.

For uncertain-number seating, anonymous occupants are quotient-equivalent: only total row length and named-person positions affect the displayed constraints or answer. Enumerating those named-position states is therefore the exact relevant state space.

A generated item is rejected unless one world remains.

## Conditional-clue integrity

For QL047 and QL048 the non-conditional clues deliberately leave exactly two worlds.

The final either/or or implication condition must reduce those two worlds to exactly one.

This prevents decorative conditionals that do not participate in the solve.

## Transformation integrity

QL051 uses two stages:
1. solve the base arrangement uniquely;
2. apply only the stated exchange;
3. answer from the transformed state.

The exchange is never baked into the original solver state.

## Language quality

Supported:
- English;
- Hindi;
- Punjabi.

The final audit rejects:
- generic `Directions:` boilerplate;
- internal solver/oracle/fingerprint/blueprint language;
- mechanical Hindi/Punjabi gender-slash forms.

Hindi and Punjabi use direct neutral positional phrasing instead.

## Difficulty

Difficulty comes from the generated contract:
- Easy: direct uncertain-count inference; simple post-solve exchange;
- Medium: linear attribute layer; multiple vacancies;
- Hard: circular attribute layer; single-vacancy parallel rows; conditional seating; equal-side uncertain-number seating.

Difficulty is not relabelled after generation.

## Question Studio

`SEA-003` is registered as one review-only package covering CP011..015.

Normal mixed five-question review batches expose all five checkpoints before repeating a checkpoint family.

Still locked:
- Question Bank writes;
- scored tests;
- mock-test eligibility;
- public delivery;
- automatic student publication.

## Result

`SEA_003_CONTENT_DEEP_AUDIT_CLOSED__9_QLS__CP011_TO_CP015__TRILINGUAL__REVIEW_ONLY`
