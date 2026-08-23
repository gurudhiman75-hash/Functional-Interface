# SEA-002 — Parallel Rows, Polygonal and Multi-Ring Seating

Status: **SEA-CP-006 COMPLETE FOR QUESTION STUDIO + BANK_ONLY ACCEPTANCE / SEA-CP-007 NEXT**

SEA-002 is the advanced-topology package in `REAS-SEA`. It starts after the SEA-001 learner authorities are frozen and the SEA-001 Question Studio review gate is proven.

## Approved checkpoint boundary

| Checkpoint | Ownership | Status |
|---|---|---|
| `SEA-CP-006` | Two parallel rows facing each other | **complete for Question Studio + manual BANK_ONLY Question Bank acceptance** |
| `SEA-CP-007` | Parallel rows with mixed, same-direction or otherwise non-uniform facing | **next** |
| `SEA-CP-008` | Square seating | not started |
| `SEA-CP-009` | Rectangular and regular-polygon seating | not started |
| `SEA-CP-010` | Concentric circles and dual-group seating | not started |

SEA-002 must prove row/position alignment, opposite and diagonal relations, corners versus side seats, perimeter order on non-circular tables, topology-specific symmetry, inner/outer-ring correspondence and diagram correctness.

## SEA-CP-006 frozen solve authorities

`SEA-CP-006` retains four permanent solve authorities with no merge or split:

- `SEA-QL-021` ← `SEA-PBA-021` — fixed row membership with opposites
- `SEA-QL-022` ← `SEA-PBA-022` — row membership partly inferred
- `SEA-QL-023` ← `SEA-PBA-023` — same-row chains linked by opposite seats
- `SEA-QL-024` ← `SEA-PBA-024` — opposite/not-opposite/diagonal/endpoint mix

Widths 3+3 through 6+6 remain size variants, not separate authorities. The next permanent seating ID is `SEA-QL-025`.

## SEA-CP-006 frozen query inventory

- `SEA-QC-003`
- `SEA-QC-006`
- `SEA-QC-008`
- `SEA-QC-010`
- `SEA-QC-011`
- `SEA-QC-012`
- `SEA-QC-014`
- `SEA-QC-015`

Every Question Studio proof batch preserves the complete frozen inventory across `APPROVED_BASELINE`, `EXAM_REAL_SOURCE_A` and `EXAM_REAL_SOURCE_B` runtime families.

## SEA-CP-006 topology contract

- two equal rows of 3–6 seats;
- top row faces south;
- bottom row faces north;
- internally, opposite seats share the same coordinate column;
- person-relative left/right is evaluated from the reference person's facing;
- internally, diagonal means other row plus an adjacent coordinate, never the opposite coordinate;
- every displayed clue is typed and independently checked against the hidden state;
- ordinary caselets require one unique arrangement;
- each passage carries four child questions with diverse query contracts;
- source-natural exam cases retain a source clue that is solution-essential rather than decorative.

## Learner presentation contract

Questions use compact SSC/Banking-style language. Internal engine terms such as solver/oracle/blueprint/fingerprint/observer coordinates are prohibited from learner-facing prose.

Solutions use simple teacher-style wording and **position** consistently:

- compact opening frame with upper/lower row facing directions;
- candidate cases only when the clues genuinely create alternatives;
- later conditions visibly eliminate wrong cases;
- deductions use concrete row and position wording;
- final two-row arrangement is shown after deductions;
- diagrams use `Positions:` and `P1`, `P2`, ... rather than learner-facing column labels;
- repeated row-membership narration is grouped;
- learner-facing `column` / `columns` is rejected.

## Signed multilingual freeze

English approved fingerprint:

`21e815257a510a943092cffb69f3c5f44222c7e332ffe171e36eadbca0b83621`

Hindi/Punjabi approved fingerprint:

`75edc8b938402ec2cf700fe3fa9053b25844981e281150f85b4238e5f7c0d4b9`

Approved localization artifact:

- artifact ID `9475802210`
- ZIP SHA-256 `93f898d640ad95dfcf00100eeaf8047c436748f84abd7306a8524a45c7364195`

Both freezes remain immutable source authorities. The Question Bank activation overlay does not rewrite them.

## Question Studio and Question Bank lifecycle

The frozen source generator remains product-inactive (`NOT_STORED`, Bank-writable false). The production shared Question Studio facade applies the separately proven acceptance overlay.

```text
technical SEA-CP-006              complete
permanent QLs                    SEA-QL-021..SEA-QL-024 frozen
solve inventory                  frozen
query mix                        frozen
English freeze                   frozen
Hindi/Punjabi freeze             frozen
Question Studio generation       active
Question Bank status             READY_FOR_STORAGE
Question Bank writable           true after manual Studio approval
Question Bank acceptance mode    BANK_ONLY
manual approval required         true
test eligible                    false
mock-test eligible               false
production staging               false
public delivery                  false
automatic student publication    false
next permanent seating ID        SEA-QL-025
next checkpoint                  SEA-CP-007
```

Question Bank acceptance authority:

`SEA002_CP006_QUESTION_BANK_ACCEPTANCE_V1`

Completion authority:

`SEA002_CP006_AUTHORING_AND_BANK_COMPLETION_V1`

Test/mock/staging/public release are intentionally outside CP006 completion and require separate later lifecycle gates. This allows the chapter-authoring workflow to advance without silently publishing questions to learners.

## Next checkpoint — SEA-CP-007

`SEA-CP-007` owns **parallel rows where facing is not uniform**. It must cover same-direction rows, mixed individual facings and other non-uniform facing configurations without leaking CP006's fixed upper-south/lower-north assumptions. Its first permanent authority, if discovery proves a genuinely new solve mode, starts at `SEA-QL-025`.
