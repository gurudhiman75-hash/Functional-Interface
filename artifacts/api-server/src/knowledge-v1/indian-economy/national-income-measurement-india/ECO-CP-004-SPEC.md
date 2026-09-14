# ECO-CP-004 — National Income Measurement in India

**Chapter:** ECO-001 Indian Economy  
**CP:** ECO-CP-004 National Income Measurement in India  
**Lifecycle:** REVIEW CANDIDATE  
**Runtime registration:** blocked pending human approval

## Scope

This CP covers how national income and GDP are measured, with India-specific institutional context.

Included:
- value added / product method
- income method
- expenditure method
- final and intermediate goods
- double counting
- value added = output - intermediate consumption
- basic expenditure components: private consumption, government consumption, investment/capital formation and net exports
- basic income components: compensation of employees, operating surplus and mixed income
- relation of GVA to GDP through taxes less subsidies on products
- meaning and purpose of a base year
- MoSPI as the official publisher of National Accounts Statistics

Excluded:
- current GDP or GVA values
- current growth rates
- current sector shares
- current base-year number as a memorisation fact
- detailed estimation procedures for individual industries
- advanced national accounting identities reserved for later depth work

## Design rules

1. Stems must be short, natural and exam-like.
2. Explanations should normally give one clear rule or one short calculation.
3. Difficulty is assigned per generated variant under `ECO-DIFFICULTY-POLICY.md`; it is not fixed by QL.
4. Statement format alone does not make a question Hard.
5. Numerical questions remain GK-oriented: one-step or short conceptual calculations only.
6. Final/intermediate classification must depend on use, not on the physical nature of the item.
7. Product/value-added questions must guard against double counting.
8. Current GDP data, current growth and the current base-year value are not allowed in this Static GK CP.
9. Review questions remain `runtimeRegistered: false` until human approval.

## QL inventory

| QL | Family | Core operation |
|---|---|---|
| ECO-004-QL-001 | Method identification | description → method |
| ECO-004-QL-002 | Method application | scenario → method |
| ECO-004-QL-003 | Final/intermediate goods | use-case → classification |
| ECO-004-QL-004 | Double counting | identify/correct counting error |
| ECO-004-QL-005 | Value added | one-step calculation/application |
| ECO-004-QL-006 | Expenditure method | item → expenditure component |
| ECO-004-QL-007 | Income method | receipt → income component |
| ECO-004-QL-008 | GVA to GDP | apply taxes less subsidies on products |
| ECO-004-QL-009 | Base year | meaning/purpose/application |
| ECO-004-QL-010 | India institution | official national-accounts role |
| ECO-004-QL-011 | Statements | verify measurement concepts |
| ECO-004-QL-012 | Method distinction | distinguish nearby measurement ideas |

## Review gate

Before runtime registration:
- minimum 40 generated review questions;
- all 12 QLs represented;
- Easy, Medium and Hard all present;
- major application QLs span more than one difficulty band;
- all four correct-option positions used;
- no duplicate semantic review items;
- every question has source IDs and source-fact IDs;
- no current-value leakage;
- editorial review confirms simple language and plausible distractors.
