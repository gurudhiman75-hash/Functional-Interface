# PNC-001 Ownership Overlap Audit

Date: 2026-07-24  
Status: **PASS**

## Fixed ownership boundaries

| CP | Final reviewed ownership | QLs |
|---|---|---:|
| `PNC-CP-001` | Fundamental counting principle, disjoint cases, complement, missing-stage recovery and supporting factorial reasoning | 58 |
| `PNC-CP-002` | Unrestricted ordered arrangements from the full pool | 8 |
| `PNC-CP-003` | Unrestricted unordered selection | 8 |
| `PNC-CP-004` | Digit, number, code and password formation with leading-zero, repetition, parity and related symbol rules | 12 |
| `PNC-CP-005` | Word, letter and multiset arrangements, including dictionary rank | 10 |
| `PNC-CP-006` | Explicit selection followed by arrangement or distinct-role assignment | 10 |

## Reviewed boundary decisions

- `PNC-QL-062` remains CP-002 because it is a generic ordered-symbol arrangement with no digit value, leading-zero, parity or divisibility semantics.
- `PNC-QL-068` remains CP-003 because the stem explicitly states that no offices are assigned; only the committee is selected.
- CP-006 QLs visibly contain both stages: an unordered selection followed by ordering or role assignment.
- CP-005 dictionary-rank QLs remain word/multiset questions because letter identity and repeated-letter correction determine the lexicographic blocks.
- General together/apart, prescribed-position, relative-order, alternation and gap restrictions remain outside PNC-001 and belong to CP-007/CP-008.
- Conditional category selection remains CP-009.
- Circular arrangements remain CP-010.
- Grouping/distribution remains CP-011.
- complex mixed systems remain CP-012.

## Automated ownership scan

The final 106-QL audit found:

- CP-002 number-specific semantic leaks: 0;
- CP-003 ordered-role leaks: 0;
- registry/QL CP mismatches: 0;
- unresolved CP-004/CP-005 historical misclassification in active libraries: 0.

## Verdict

All active QLs are owned by the correct fixed CP boundary. No ownership repair remains open.