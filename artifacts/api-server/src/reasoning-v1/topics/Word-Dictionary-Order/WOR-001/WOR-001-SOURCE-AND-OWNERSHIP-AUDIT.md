# WOR-001 Source and Ownership Audit

## Ownership decision

WOR-001 owns ordering multiple complete English words by explicit A–Z dictionary rules and positional consequences derived from that order.

It does not own:

- rearranging letters within one word (`ALP-001`);
- alphabet positions, gaps or letter pairs (`ALP-001`);
- hidden word transformations (`COD-001`);
- semantic or chronological word sequences;
- rank inferred from relational clues;
- classification or odd-word-out tasks;
- word formation from supplied letters;
- native Devanagari or Gurmukhi collation.

The boundary agrees with the existing Classification design, which assigns dictionary sorting to Word and Dictionary Order, and with Alphabet Test's ownership of transformations within one supplied word.

## Evidence vocabulary

Prototype contracts now carry one of three source-evidence states:

- `PYQ_SUPPORTED` — the same solve contract is directly evidenced in a competitive-exam previous/actual paper sample;
- `PLATFORM_SUPPORTED` — the solve contract appears in established competitive-exam preparation material but direct PYQ evidence has not yet been pinned here;
- `EXPLORATORY_SOURCE_GAP` — the runtime is mechanically valid, but no adequate recurring exam-source evidence has yet been pinned. This status blocks treating the prototype as freeze-ready merely because it executes.

## Pinned source sample

| Source | Exam / date | Observed pattern | Audit use |
| --- | --- | --- | --- |
| Employment News, Government of India, SSC CGL Tier-I actual-paper extract | 29 Aug 2016, morning shift | Arrange `Follicle / Folk / Follow / Foliage` in dictionary order | Direct support for complete-order contract and deep common-prefix instances |
| Employment News, Government of India, SSC CGL Tier-I actual-paper extract | 2016 extract | Arrange words and choose the word that comes first (`Temple / Tenant / Terminate / Temperature`) | Direct support for endpoint selection after ordering |
| Testbook reproduction labelled PSSSB Senior Assistant Official Paper | 28 Jan 2024 | Arrange `Range / Rader / Race / Rack / Rant` in dictionary order | Punjab-state corroboration for the complete-order contract |
| SSC official Answer Key portal | multiple years | Final answer keys are published along with question papers for CGL/CHSL/Selection Post/Stenographer and related exams | Primary repository locator for subsequent saturation sampling |

Pinned URLs:

- https://employmentnews.gov.in/newemp/MoreContentNew.aspx?k=208&n=SpecialContent
- https://employmentnews.gov.in/newemp/MoreContentNew.aspx?k=193&n=SpecialContent
- https://testbook.com/question-answer/arrange-the-given-words-in-the-sequence-in-which-t--68a8d09fbbfe34c441a48bba
- https://doc.ssc.nic.in/Portal/AnswerKey

## Executable discovery decisions after remediation

| Pattern | Allocation decision | Source evidence | Freeze implication |
| --- | --- | --- | --- |
| Complete ascending order | `RETAIN` | `PYQ_SUPPORTED` | eligible for later QL decision after editorial/corpus gates |
| Explicit descending order | `RETAIN` | `PLATFORM_SUPPORTED` | keep executable; pin direct PYQ before permanent freeze if kept separate |
| First/last word | `RETAIN` | `PYQ_SUPPORTED` | eligible for later QL decision after editorial/corpus gates |
| Kth word | `RETAIN` | `PYQ_SUPPORTED` | eligible for later QL decision after editorial/corpus gates |
| Rank of a specified word | `RETAIN` | `PLATFORM_SUPPORTED` | keep executable; direct PYQ pin still desirable |
| Immediate predecessor/successor | `RETAIN` | `EXPLORATORY_SOURCE_GAP` | not freeze-ready |
| Middle word | `RETAIN` | `PLATFORM_SUPPORTED` | keep executable; direct PYQ pin still desirable |
| Insertion position/new rank | `RETAIN` | `EXPLORATORY_SOURCE_GAP` | not freeze-ready |
| Predecessor after insertion | `RETAIN` | `EXPLORATORY_SOURCE_GAP` | not freeze-ready |
| Unique misplaced word | `RETAIN` | `EXPLORATORY_SOURCE_GAP` | not freeze-ready |
| Unique incorrect adjacent pair | `RETAIN` | `EXPLORATORY_SOURCE_GAP` | not freeze-ready |
| Complete partial order | `RETAIN` | `EXPLORATORY_SOURCE_GAP` | not freeze-ready |
| Four to seven words | `MERGE_AS_INSTANCE_VARIANT` | inherited from solve contract | no separate QL |
| Deep-prefix hard mode | `MERGE_AS_INSTANCE_VARIANT` | inherited from solve contract | no separate QL |
| Localized instructions | `MERGE_AS_PRESENTATION_VARIANT` | presentation-only | no separate QL |
| Semantic sequence of words | `DEFER` | out of ownership | do not implement here |
| Native-script collation | `DEFER` | out of V1 scope | do not implement in V1 |

## Current conclusion

The core chapter ownership is now source-backed rather than relying only on the design specification. The source audit is **not saturated**: this pass establishes direct support for complete order, endpoint selection and kth/position-style reasoning, while explicitly preserving source gaps for the more synthetic CP-002/CP-003 contracts.

No `EXPLORATORY_SOURCE_GAP` prototype may be treated as permanent-QL-ready solely because automated generation, answer validation or multilingual parity passes. A later saturation pass must either provide recurring SSC/Banking/Punjab evidence, merge the pattern into a supported contract as an instance variant, or remove it from permanent allocation consideration.
