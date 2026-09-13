# POL-CP-001 — Constitutional History Implementation Spec

**Chapter:** POL-001 Indian Polity  
**CP:** POL-CP-001 Constitutional History  
**Lifecycle:** REVIEW CANDIDATE  
**Runtime registration:** blocked pending human approval  
**Languages in this checkpoint:** English review surface only; canonical facts are locale-neutral.

## Scope

This CP covers the constitutional-administrative development of British India from the Regulating Act, 1773 to the Indian Independence Act, 1947.

Included milestones:
- Regulating Act, 1773
- Pitt's India Act, 1784
- Charter Acts of 1793, 1813, 1833 and 1853
- Government of India Act, 1858
- Indian Councils Acts of 1861, 1892 and 1909
- Government of India Act, 1919
- Government of India Act, 1935
- Indian Independence Act, 1947

## Design goals

1. Questions must test constitutional development, not obscure colonial trivia.
2. Every distractor must be another real Act/provision from the same CP.
3. Chronology questions must use canonical sequence ranks.
4. "First" claims are explicitly stored as milestone facts and never inferred by free text.
5. 1919/1935 dyarchy questions must distinguish *introduced/provided for* from *actually operated*.
6. The 1935 federal scheme is described as proposed and not brought into operation.
7. Review questions remain `runtimeRegistered: false` until human approval.

## QL inventory

| QL | Family | Primary operation | Difficulty |
|---|---|---|---|
| POL-001-QL-001 | Act identification | provision → Act | Easy |
| POL-001-QL-002 | Provision identification | Act → defining provision | Easy |
| POL-001-QL-003 | Date/Act mapping | year → Act | Easy |
| POL-001-QL-004 | Correct pair | Act ↔ provision | Medium |
| POL-001-QL-005 | Incorrect pair | detect wrong Act ↔ provision | Medium |
| POL-001-QL-006 | Constitutional milestone | "first"/transition milestone → Act | Medium |
| POL-001-QL-007 | Reform-name mapping | reform label → Act | Easy/Medium |
| POL-001-QL-008 | Two-statement evaluation | verify two provisions | Medium |
| POL-001-QL-009 | Three-statement count | evaluate three provisions | Hard |
| POL-001-QL-010 | Chronology | arrange four Acts | Hard |
| POL-001-QL-011 | Before/after bridge | identify Act between two milestones | Medium |
| POL-001-QL-012 | Cross-Act comparison | distinguish two nearby reforms | Hard |

## Fact integrity rules

- Act titles and years are unique.
- Each defining provision is attached to exactly one canonical row in this CP.
- Each milestone is stored with a stable ID.
- Feature distractors are drawn only from other CP-001 rows.
- No current political office-holder is present.
- No fact depends on current law or current institutional membership.

## Review acceptance gate

Before runtime registration:
- minimum 36 review questions;
- all 12 QLs represented;
- at least 10 Easy, 16 Medium and 8 Hard review items;
- all four option positions used as the correct answer;
- no duplicate semantic questions (standard instruction stems may repeat);
- no duplicate options inside a question;
- every item carries source IDs and source-fact IDs;
- editorial review confirms exam realism and factual precision.

## Sources

The source layer uses the historical Acts themselves as the primary source class, supplemented where necessary by authoritative constitutional-history references. Source IDs are explicit in the fact registry so later source-URL enrichment does not change question logic.
