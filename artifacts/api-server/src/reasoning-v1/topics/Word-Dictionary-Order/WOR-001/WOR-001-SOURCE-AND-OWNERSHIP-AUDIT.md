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

Prototype contracts carry one of three source-evidence states:

- `PYQ_SUPPORTED` — the same solve contract is directly evidenced in a competitive-exam previous/actual paper sample;
- `PLATFORM_SUPPORTED` — the solve contract appears in established competitive-exam preparation material but direct PYQ evidence has not yet been pinned here;
- `EXPLORATORY_SOURCE_GAP` — the runtime is mechanically valid, but no adequate recurring exam-source evidence has yet been pinned. This status blocks treating the prototype as freeze-ready merely because it executes.

Freeze posture is derived separately:

- retained + supported → `ELIGIBLE_AFTER_EDITORIAL`;
- retained + source gap → `DEFER_SOURCE_GAP`;
- `MERGE_AS_INSTANCE_VARIANT` → `INSTANCE_VARIANT_NO_QL`.

This preserves useful executable discovery contracts without confusing them with publication approval.

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

| Pattern | Executable taxonomy | Source evidence | Freeze posture |
| --- | --- | --- | --- |
| Complete ascending order | `RETAIN` | `PYQ_SUPPORTED` | `ELIGIBLE_AFTER_EDITORIAL` |
| Explicit descending order | `RETAIN` | `PLATFORM_SUPPORTED` | `ELIGIBLE_AFTER_EDITORIAL` |
| First/last word | `RETAIN` | `PYQ_SUPPORTED` | `ELIGIBLE_AFTER_EDITORIAL` |
| Kth word | `RETAIN` | `PYQ_SUPPORTED` | `ELIGIBLE_AFTER_EDITORIAL` |
| Rank of a specified word | `RETAIN` | `PLATFORM_SUPPORTED` | `ELIGIBLE_AFTER_EDITORIAL` |
| Immediate predecessor/successor | `RETAIN` | `EXPLORATORY_SOURCE_GAP` | `DEFER_SOURCE_GAP` |
| Middle word | `RETAIN` | `PLATFORM_SUPPORTED` | `ELIGIBLE_AFTER_EDITORIAL` |
| Insertion position/new rank | `RETAIN` | `EXPLORATORY_SOURCE_GAP` | `DEFER_SOURCE_GAP` |
| Predecessor after insertion | `RETAIN` | `EXPLORATORY_SOURCE_GAP` | `DEFER_SOURCE_GAP` |
| Unique misplaced word | `RETAIN` | `EXPLORATORY_SOURCE_GAP` | `DEFER_SOURCE_GAP` |
| Unique incorrect adjacent pair | `RETAIN` | `EXPLORATORY_SOURCE_GAP` | `DEFER_SOURCE_GAP` |
| Complete partial order | `RETAIN` | `EXPLORATORY_SOURCE_GAP` | `DEFER_SOURCE_GAP` |
| Four to seven words | `MERGE_AS_INSTANCE_VARIANT` | inherited from solve contract | `INSTANCE_VARIANT_NO_QL` |
| Deep-prefix hard mode | `MERGE_AS_INSTANCE_VARIANT` | inherited from solve contract | `INSTANCE_VARIANT_NO_QL` |
| Localized instructions | `MERGE_AS_PRESENTATION_VARIANT` | presentation-only | no separate QL |
| Semantic sequence of words | `DEFER` | out of ownership | do not implement here |
| Native-script collation | `DEFER` | out of V1 scope | do not implement in V1 |

## Current conclusion

The core chapter ownership is source-backed rather than relying only on the design specification. The audit is not saturated: targeted searches continue to support ordinary full-order/position forms, but did not establish recurring SSC/Banking/Punjab evidence for the synthetic source-gap contracts.

Current freeze posture across the 19 executable prototypes is:

```text
ELIGIBLE_AFTER_EDITORIAL: 7
DEFER_SOURCE_GAP: 8
INSTANCE_VARIANT_NO_QL: 4
```

There are 9 `EXPLORATORY_SOURCE_GAP` prototypes overall; one of them (`WOR-PROT-019`) is already an instance variant and therefore never reserves a separate QL.

No `DEFER_SOURCE_GAP` contract may be treated as permanent-QL-ready solely because automated generation, answer validation or multilingual parity passes. A later saturation pass must either provide recurring exam evidence, merge the pattern into a supported contract where semantically valid, or remove it from permanent allocation consideration.
