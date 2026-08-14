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

## Executable discovery decisions

| Pattern | Decision |
| --- | --- |
| Complete ascending order | `RETAIN` |
| Explicit descending order | `RETAIN` |
| First/last word | `RETAIN` |
| Kth word/rank | `RETAIN` |
| Immediate predecessor/successor | `RETAIN` |
| Middle word | `RETAIN` |
| Insertion position/new rank | `RETAIN` |
| Predecessor after insertion | `RETAIN` |
| Unique misplaced word | `RETAIN` |
| Unique incorrect adjacent pair | `RETAIN` |
| Complete partial order | `RETAIN` |
| Four to seven words | `MERGE_AS_INSTANCE_VARIANT` |
| Deep-prefix hard mode | `MERGE_AS_INSTANCE_VARIANT` |
| Localized instructions | `MERGE_AS_PRESENTATION_VARIANT` |
| Semantic sequence of words | `DEFER` |
| Native-script collation | `DEFER` |

## Source status

The implementation is grounded in the user-approved end-to-end specification and existing repository ownership documents. It does not claim to be a previous-year-question corpus. A separate book/platform/PYQ sampling audit remains required before QL freeze and publication.
