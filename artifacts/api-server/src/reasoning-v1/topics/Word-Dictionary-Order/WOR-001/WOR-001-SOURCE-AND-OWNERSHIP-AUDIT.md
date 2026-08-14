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

## Evidence vocabulary

Prototype contracts carry one of three source-evidence states:

- `PYQ_SUPPORTED` — the same solve contract is directly evidenced in a competitive-exam previous/actual paper sample;
- `PLATFORM_SUPPORTED` — the solve contract appears in established competitive-exam preparation material but direct PYQ evidence has not yet been pinned here;
- `EXPLORATORY_SOURCE_GAP` — the runtime is mechanically valid, but adequate recurring exam-source evidence has not been pinned. This blocks permanent-QL readiness.

Freeze posture is derived separately:

- retained + supported → `ELIGIBLE_AFTER_EDITORIAL`;
- retained + source gap → `DEFER_SOURCE_GAP`;
- `MERGE_AS_INSTANCE_VARIANT` → `INSTANCE_VARIANT_NO_QL`.

## Pinned source sample

| Source | Exam / date | Observed pattern | Audit use |
| --- | --- | --- | --- |
| Employment News, Government of India, SSC CGL Tier-I actual-paper extract | 29 Aug 2016, morning shift | Arrange `Follicle / Folk / Follow / Foliage` in dictionary order | Direct support for complete-order contract and deep common-prefix instances |
| Employment News, Government of India, SSC CGL Tier-I actual-paper extract | 2016 extract | Arrange words and choose the word that comes first | Direct support for endpoint selection after ordering |
| Testbook reproduction labelled SSC GD Constable 2024 Official Paper | 27 Feb 2024, Shift 4 | Arrange five `Shr...` words and select the third word | Direct support for kth-position query |
| Testbook reproduction labelled SSC CHSL Tier-I 2022 Official Paper | 9 Mar 2023, Shift 3 | Arrange five `Conv...` words and select the fourth word | Direct support for kth-position query with deep common prefix |
| Testbook reproduction labelled Odisha Police SI Official Paper | 7 Jul 2022, Paper II | Arrange five words and select the middle word | Direct support for middle-word instance; merged into kth-position QL |
| Testbook competitive-exam practice | current corpus | Explicit reverse dictionary order questions | Supports reverse-order instance; merged into complete-order QL |
| Testbook reproduction labelled PSSSB Senior Assistant Official Paper | 28 Jan 2024 | Arrange `Range / Rader / Race / Rack / Rant` in dictionary order | Punjab-state corroboration for complete-order contract |
| SSC official Answer Key portal | multiple years | Question papers/final answer keys for SSC families | Primary repository locator for later sampling |

Pinned URLs:

- https://employmentnews.gov.in/newemp/MoreContentNew.aspx?k=208&n=SpecialContent
- https://employmentnews.gov.in/newemp/MoreContentNew.aspx?k=193&n=SpecialContent
- https://testbook.com/question-answer/after-arranging-the-given-words-according-to-dicti--666d978f7bb5914b7130ca7f
- https://testbook.com/question-answer/after-arranging-the-given-words-according-to-dicti--642d38fba26126bf63596dd6
- https://testbook.com/question-answer/arrange-the-given-words-in-alphabetical-order-and--634ff902c45be191b49ce3ef
- https://testbook.com/question-answer/arrange-the-given-words-in-the-order-in-which-they--5bed2337a6115a17e6c394fe
- https://testbook.com/question-answer/arrange-the-given-words-in-the-sequence-in-which-t--68a8d09fbbfe34c441a48bba
- https://doc.ssc.nic.in/Portal/AnswerKey

## Final recommended QL architecture

| Permanent root | Authority prototype | Instance variants | Evidence / rationale |
| --- | --- | --- | --- |
| Complete dictionary order | `WOR-PROT-001` | `002` reverse order; `016` hard full-order | full ordering is direct-PYQ; reverse is the same comparator with output direction reversed |
| Endpoint after ordering | `WOR-PROT-003` | `004` last word | first and last are mirror endpoint queries on the same sorted sequence |
| Word at a specified position | `WOR-PROT-005` | `009` middle; `017` hard kth | kth and middle forms have direct previous-paper support; middle is a fixed kth instance |
| Position of a specified word | `WOR-PROT-006` | `018` hard rank | distinct input-output direction from kth; platform-supported and mechanically non-degenerate |

These four are recommendations only. Permanent IDs remain unallocated until human editorial review is accepted.

## Source-deferred executable contracts

The following remain useful review-only solve contracts but do not reserve permanent QLs:

- immediate predecessor;
- immediate successor;
- insertion position;
- rank after insertion;
- predecessor after insertion;
- unique misplaced word;
- unique incorrect adjacent pair;
- complete partial dictionary order.

Targeted searches across SSC/banking/general competitive-exam sources repeatedly returned ordinary full-order, reverse-order, endpoint, kth and middle forms rather than recurring direct examples of these eight variants. They therefore remain `DEFER_SOURCE_GAP`.

`WOR-PROT-019` is the hard insertion instance and is already `INSTANCE_VARIANT_NO_QL`.

## Current freeze posture

```text
ELIGIBLE_AFTER_EDITORIAL: 4
DEFER_SOURCE_GAP: 8
INSTANCE_VARIANT_NO_QL: 7
```

`RETAIN` continues to mean executable taxonomy, not publication approval. No source-deferred contract may become a permanent QL solely because generation, answer validation or multilingual parity passes.
