# WFM-001 — Source, ownership and review design V2

Status: **CURRENT-MAIN GOVERNED REVIEW-ONLY — TAXONOMY APPROVED / QUESTION STUDIO REGISTERED**

Product code: `REAS-WFM`  
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

The current-main audit recognises five checkpoints and six permanent QLs. The original SSC/Punjab surface remains intact, and two additional Banking solve contracts were added only after recurring source evidence established that they are materially different learner tasks.

| Checkpoint | QL | Solve contract |
|---|---|---|
| `WFM-CP-001` | `WFM-QL-001` | exactly one option **can** be formed from the full source word |
| `WFM-CP-001` | `WFM-QL-002` | exactly one option **cannot** be formed from the full source word |
| `WFM-CP-002` | `WFM-QL-003` | use explicitly selected source-word positions and count common meaningful words using every selected letter exactly once |
| `WFM-CP-003` | `WFM-QL-004` | rearrange a supplied letter multiset into one meaningful word; plain-jumble and numbered-sequence presentations are renderer variants |
| `WFM-CP-004` | `WFM-QL-005` | ordered extraction from one or more candidate source words using stated positions; no jumbling; choose the candidate that yields a meaningful word |
| `WFM-CP-005` | `WFM-QL-006` | selected positions → determine whether zero/one/multiple governed words can be formed → return requested output letter or the stated X/Y sentinel |

This closes the material ownership gaps found in the earlier four-QL candidate while still avoiding separate identities for superficial presentation changes. Banking five-option delivery is presentation policy, not a reason to duplicate an existing semantic QL.

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

## 7. Banking extensions

### CP004 — ordered extraction without jumbling

Recurring Banking Mains questions provide candidate word/position groups and require the learner to extract letters in the stated order. The answer depends on whether the ordered extraction itself is a meaningful word; rearrangement is forbidden.

Two renderers share `WFM-QL-005`:

- one source word + several stated positions;
- several source words + one stated position per word.

They are the same solve contract and therefore do not receive separate QLs.

### CP005 — unique / multiple / none output

Recurring Banking questions select letters from a source word, ask whether exactly one meaningful word can be formed, and then request a particular letter from that word. If zero or multiple words are possible, the stem supplies X/Y sentinel rules.

`WFM-QL-006` owns this decision/output contract. Both historical X/Y conventions are supported only when the convention is stated explicitly in the stem.

### Banking presentation policy

- `WFM-QL-003` keeps the same count solve contract but uses five answer options under `BANKING_5`;
- `WFM-QL-005` and `WFM-QL-006` are Banking-only in the current source authority;
- `WFM-QL-001/002/004` remain SSC/Punjab four-option contracts and are not falsely relabelled as Banking.

Transformation-before-word-formation and letter-arrangement puzzle hybrids remain source-watch / neighboring-family items; they are not promoted without stronger recurring ownership evidence.

## 8. Localization

English, Hindi and Punjabi instructional shells are provided. Source letters and answer words remain in Latin script because the operation is explicitly about English word formation.

Native explanations remain simple and show the actual construction/count evidence. Internal QL/checkpoint IDs are never learner-facing.

## 9. Lifecycle boundary

The raw runtime remains non-discoverable, but WFM-001 is now registered in the normal shared Reasoning V1 Question Studio engine under the standard review-only lifecycle:

- taxonomy authority: `REASONING-V1-TAXONOMY-AMENDMENT-WFM-001`;
- standard package discovery: enabled;
- deterministic EN/HI/PA review generation: enabled;
- QL/checkpoint/difficulty selection: enabled;
- raw runtime `questionStudioVisible = false` remains a safety boundary;
- Question Bank write disabled;
- test/mock eligibility disabled;
- public publication disabled;
- automatic learner delivery disabled.

Question Bank/test/mock/public/automatic learner delivery remain locked. Any later activation requires a separate explicit release authority and must not be inferred from Question Studio review registration.
