# WFM-001 — Source, ownership and review design V2

Status: **IMPLEMENTED REVIEW CANDIDATE — TAXONOMY APPROVAL PENDING**

Proposed product code: `REAS-WFM`  
Chapter ID: `WFM-001`  
Student title: **Word Formation**

## 1. Why V2 exists

The first review candidate covered only the classic full-source `can be formed / cannot be formed` family. The Reasoning V1 audit found that this was too narrow to claim Word Formation ownership.

Additional SSC surfaces materially change the learner task:

- selected positions from a source word, followed by a count of meaningful words that can be formed from the selected letters;
- a jumbled letter set that must be rearranged into one meaningful word;
- numbered letters where the learner chooses the number sequence that produces the meaningful word.

The numbered and plain-jumble arrangements are two renderers of the same rearrangement solve contract, so they share one QL rather than inflating the taxonomy.

## 2. Source-backed coverage decision

The audit now recognises three checkpoints and four proposed QLs.

| Checkpoint | QL | Solve contract |
|---|---|---|
| `WFM-CP-001` | `WFM-QL-001` | exactly one option **can** be formed from the full source word |
| `WFM-CP-001` | `WFM-QL-002` | exactly one option **cannot** be formed from the full source word |
| `WFM-CP-002` | `WFM-QL-003` | use explicitly selected source-word positions and count common meaningful words using every selected letter exactly once |
| `WFM-CP-003` | `WFM-QL-004` | rearrange a supplied letter multiset into one meaningful word; plain-jumble and numbered-sequence presentations are renderer variants |

This closes the material ownership gap found in the earlier two-QL proposal while avoiding separate identities for superficial presentation changes.

## 3. Neighboring chapter boundaries

`WFM-001` owns letter-multiset feasibility and meaningful-word construction.

It does **not** own:

- dictionary ordering of multiple words (`WOR-001`);
- alphabet-position, opposite-letter, pair-counting or mixed-row scan tasks (`ALP-001`);
- hidden coding rules (`COD-001`);
- vocabulary definitions or synonym/antonym testing;
- general permutation-and-combination counting where the task is mathematical rather than lexical.

The selected-position family belongs here only when the final task is meaningful-word formation/counting. A selected-position task that merely asks for the extracted letter or alphabet position remains Alphabet Test.

## 4. CP001 — full-source can/cannot

The runtime uses a governed exam-neutral source pool and a broad real-word candidate corpus.

Quality rules:

- four meaningful word options;
- exactly one semantic answer under independent letter-count solving;
- option lengths kept reasonably close where the pool permits, avoiding trivial three-letter-vs-long-word cues;
- Easy: ordinary absent-letter failures;
- Medium: one close repeated-letter or one-letter-absence trap;
- Hard: multiplicity is decisive and at least two close multiplicity traps are used for `CAN_FORM`;
- explanations show only the decisive letter-count evidence, not boilerplate analysis of every option.

## 5. CP002 — selected-position meaningful-word count

This checkpoint uses a small governed **exam-common anagram authority** rather than an unrestricted dictionary. That is deliberate: `meaningful word` counting is lexically ambiguous if obscure dictionary entries are allowed.

Every fixture records:

- one ordinary source word;
- the selected 1-based positions;
- the resulting letters;
- the accepted common English words using every selected letter exactly once.

Difficulty is derived from the completed lexical state:

- Easy: zero or one accepted word;
- Medium: exactly two accepted words;
- Hard: three or more accepted words.

The answer is a count, not a vocabulary guess. Explanations list the selected letters and the accepted words.

## 6. CP003 — meaningful rearrangement

One semantic QL supports two source-backed renderers:

### `JUMBLED_WORD`

The learner sees a jumbled letter string and four meaningful word options of equal length. Exactly one option has the identical letter multiset.

### `NUMBERED_SEQUENCE`

The learner sees uniquely lettered positions such as `1-G 2-A ...` and chooses the index order that spells the meaningful word. Wrong sequences are near-order mistakes and are rejected if they accidentally create another governed common word.

Difficulty is computed from completed instance features such as option multiset similarity, repeated-letter pressure, sequence proximity and number of positions. Length alone is not the authority.

## 7. Localization

English, Hindi and Punjabi instructional shells are provided. Source letters and answer words remain in Latin script because the operation is explicitly about English word formation.

Native explanations remain simple and show the actual construction/count evidence. Internal QL/checkpoint IDs are never learner-facing.

## 8. Lifecycle boundary

This package remains a governance candidate only:

- master Reasoning taxonomy unchanged;
- shared Question Studio registry unchanged;
- `questionStudioVisible = false`;
- Question Bank write disabled;
- test/mock eligibility disabled;
- public publication disabled;
- automatic learner delivery disabled.

If V2 is approved, the next step is an explicit taxonomy amendment plus a current shared Question Studio review integration. Approval of this review candidate must not silently activate learner delivery.
