# HIS-001 Indian History — Package Roadmap

Status: FINAL MULTILINGUAL FROZEN / CP001–CP024 COMPLETE / QUESTION STUDIO REVIEW_ONLY INTEGRATED  
Engine: `knowledge-v1`

## English freezes

The V1 English review corpus for `HIS-CP-001` through `HIS-CP-016` is frozen under `HIS-001-ENGLISH-FREEZE-V1.md`. V2 expanded the English corpus through CP024. A post-freeze CP017 explanation-context defect was corrected under `HIS-001-ENGLISH-FREEZE-V3.md`. A later CP020 review found two malformed English answer mappings, corrected under `HIS-001-ENGLISH-FREEZE-V4.md`. During CP023 localization, the Fort William College year was corrected from 1801 to 1800 under `HIS-001-ENGLISH-FREEZE-V5.md`, which is now the semantic authority for new History localization. Hindi and Punjabi are approved through CP024. The complete EN-HI-PA chapter is frozen under `HIS-001-MULTILINGUAL-FREEZE-V1.md` and registered in Question Studio as review-only.

## Binding rule

`HIS-001` is the shared Indian History package. Each content checkpoint (CP) is promoted into the shared package only after its English review batch is explicitly approved. Localization follows the same canonical fact IDs and answer semantics.

The blueprint units map to package CPs as follows:

| CP | Scope |
| --- | --- |
| HIS-CP-001 | Prehistory & Harappan Civilization |
| HIS-CP-002 | Vedic Age |
| HIS-CP-003 | Mahajanapadas, Jainism & Buddhism |
| HIS-CP-004 | Mauryan Empire |
| HIS-CP-005 | Post-Mauryan India & Sangam Age |
| HIS-CP-006 | Gupta & Post-Gupta Period |
| HIS-CP-007 | Early & Medieval South Indian Kingdoms |
| HIS-CP-008 | Delhi Sultanate |
| HIS-CP-009 | Vijayanagara, Bahmani & Regional Kingdoms |
| HIS-CP-010 | Mughal Empire |
| HIS-CP-011 | Marathas, Sikhs & Eighteenth-Century India |
| HIS-CP-012 | Europeans in India & British Expansion |
| HIS-CP-013 | British Administration & Economic Policies |
| HIS-CP-014 | Revolt of 1857 & Socio-Religious Reform |
| HIS-CP-015 | National Movement, 1885–1919 |
| HIS-CP-016 | National Movement, 1919–1947 |
| HIS-CP-017 | Chalcolithic Cultures & Rise of Magadha |
| HIS-CP-018 | Ancient Intellectual, Artistic & Traveller Supplements |
| HIS-CP-019 | Early Medieval North India |
| HIS-CP-020 | Medieval Economy, Society, Trade & Technology |
| HIS-CP-021 | Bhakti, Sufism, Sikh Development & Medieval Cultural Synthesis |
| HIS-CP-022 | Peasant, Tribal & Popular Resistance to Company Rule |
| HIS-CP-023 | Colonial Education, Press, Constitutional Development & Reform Supplements |
| HIS-CP-024 | National Movement Saturation Supplements |

World History is outside HIS-001 and requires a separate later authorization.

## Promotion sequence

For each CP:

`source pack -> canonical facts -> QLs -> review generator -> audit -> review markdown -> human approval -> freeze -> shared Question Studio package binding`

A CP may remain review-only while later CPs are being developed. Approval of one CP does not automatically authorize the rest of the chapter.

## Source policy

History facts must be traceable to authoritative textbooks, official/primary records or recognized academic references. PYQs may guide exam relevance and question form, but they are not the sole factual authority.

Disputed archaeological or historiographical propositions must be either excluded or explicitly qualified.


## V2 coverage expansion

The coverage-gap programme is complete. `HIS-CP-017` through `HIS-CP-024` add **480** source-backed questions and **480** canonical facts to the V1 core, taking the frozen English chapter to **1,434 questions** and **1,379 canonical facts**.

Authority: `HIS-001-COVERAGE-GAP-AUDIT-V1.md` and current semantic freeze `HIS-001-ENGLISH-FREEZE-V5.md`.

No further English CP is planned under the current coverage ledger. The chapter-wide multilingual parity audit and Question Studio review-only registration are complete under `HIS-001-MULTILINGUAL-FREEZE-V1.md`.

World History remains outside HIS-001 unless separately authorized.


### Stem-language rule

History stems should use direct exam wording. Avoid filler such as **“best describes”**, **“associated with”**, **“which correctly identifies”**, and similar mechanical constructions when a direct question can ask the same fact more naturally. Use such wording only when the relationship itself is genuinely what is being tested.


## Multilingual progress

- `HIS-CP-001` through `HIS-CP-024`: **APPROVED / MULTILINGUAL COMPLETE**
- Final multilingual corpus: **1,434 questions per language / 4,302 EN-HI-PA surfaces / 239 QLs / 1,379 canonical fact IDs**
- Question Studio: **REGISTERED / REVIEW_ONLY** under `HIS-001-MULTILINGUAL-FREEZE-V1`
- Source localization remains `reviewOnly: true` / `runtimeRegistered: false`; only generated Question Studio review payloads receive runtime registration metadata.
- Question Bank storage, test eligibility, mock-test eligibility and public/automatic publication remain **DISABLED**.
