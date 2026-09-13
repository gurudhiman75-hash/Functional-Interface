# Logic Puzzles — Source Provenance Wave 01

Status: **EVIDENCE RECONCILED; production/source-saturation gate remains CLOSED.**

Date: 2026-09-13

## Purpose

This checkpoint records source evidence separately from implementation quality. The Logic Puzzle runtime is already frozen through permanent `LP-QL-047`; this document does not reopen approved semantic/editorial work. It asks a narrower question: **what can be honestly claimed about target-exam provenance and source saturation?**

Historical source-audit files are not rewritten. Some of them correctly describe earlier points when QLs were still provisional. This wave adds the current chapter-wide evidence state.

## Evidence policy

Use four evidence classes and do not collapse them:

1. **OFFICIAL QUESTION PAPER / ANSWER KEY** — strongest evidence for year-tagged family occurrence and exact exam phrasing.
2. **OFFICIAL INFORMATION HANDOUT / SAMPLE QUESTIONS / SYLLABUS** — authoritative for exam structure, named reasoning domains and illustrative question forms, but not sufficient by itself for actual frequency claims.
3. **REPUTABLE RECALL / MEMORY-BASED EXAM SET** — useful for recurring family/frequency discovery when the conducting body does not release question papers; must be labelled non-official and cannot alone establish source saturation.
4. **BOOK / COACHING REFERENCE** — convention, variety, misconception and explanation evidence only; never treated as official exam-year provenance.

A chapter may be implementation-frozen while `SOURCE_SATURATED_FOR_TARGET_EXAMS = false`.

## Current implementation authority

- Permanent Logic Puzzle identities are allocated through `LP-QL-047`.
- English/Hindi/Punjabi content for the latest identity is frozen and routed through Question Studio V8.
- Question Bank/test/mock/publication gates remain closed for the post-closure authorities until separate production authorization.
- No new QL is created by this evidence pass.

## Official evidence recovered in Wave 01

| Target lane | Official source | What it proves | What it does **not** prove | Disposition |
|---|---|---|---|---|
| SSC | SSC official examination syllabus/notice, including General Intelligence domains such as problem solving, analysis, judgment, decision making, relationship concepts, coding/decoding, drawing inferences and related forms | Logic/analytical reasoning is an explicit SSC domain; compact reasoning coverage is unquestionably in-scope | It does not establish that long Banking-style puzzle caselets occur at Banking frequency in SSC | `OFFICIAL_SCOPE_CONFIRMED`; family-frequency saturation still open |
| SSC | SSC candidate portal exposes a Previous Year Question Paper area | The Commission has an official previous-paper distribution surface and SSC can support year-tagged provenance where individual paper resources are retrievable | Current Wave 01 retrieval did not yet normalize individual Logic Puzzle items into the source ledger | `OFFICIAL_PAPER_LANE_AVAILABLE`; extraction pending |
| Banking / IBPS | IBPS official PO/MT information handout with Reasoning & Computer Aptitude sample questions | Reasoning is an official tested section and IBPS publishes authoritative illustrative item forms | The handout explicitly says examples are illustrative/not exhaustive; it cannot be used as a frequency census | `OFFICIAL_SCOPE_CONFIRMED`; family-frequency saturation still open |
| Banking / IBPS | IBPS official FAQ | IBPS states that it does **not** provide answer-sheet copies/question papers/right answer keys to candidates | Therefore absence of official year-tagged IBPS question PDFs must not be mislabelled as a research failure | `OFFICIAL_PAPER_UNAVAILABLE_BY_POLICY`; use labelled recall evidence for occurrence/frequency, never masquerading as official |
| Banking / IBPS RRB | Official CRP RRB notification | Confirms a substantial Reasoning section (e.g. 40 questions in listed officer examinations) and official bilingual delivery | Does not identify Logic Puzzle family frequency by itself | `OFFICIAL_WEIGHT_EVIDENCE`; puzzle-family frequency still requires recall/corpus lane |
| Punjab state exams | Official Punjab recruitment/source search in Wave 01 | No sufficiently direct year-tagged Logic Puzzle question-paper corpus was recovered from the official Punjab sources checked in this wave | No source-saturation claim can be made for Punjab from the current official evidence | `OFFICIAL_PROVENANCE_GAP`; hard blocker for Punjab saturation claim |

## Official source references

- SSC candidate/exam portal: `https://ssc.gov.in/`
- SSC official notice/syllabus example used in this wave: `https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Phase-XII_Notification_2024_26022024.pdf`
- IBPS official PO/MT information handout sample-question source: `https://www.ibps.in/wp-content/uploads/IBPS-MAIN-PO-MT-XIV-IH-Eng-2024.pdf`
- IBPS FAQ stating question papers/right answer keys are not provided: `https://www.ibps.in/index.php/faq/`
- IBPS RRB official notification evidence: `https://www.ibps.in/wp-content/uploads/CRP-RRBs-XIV_Final_AD-19.9.25.pdf`

These URLs are evidence references, not permission to copy learner-facing wording into Examtree.

## Target-exam conclusions after Wave 01

### Banking

Banking remains the **stress target** for Logic Puzzles because the official exam structure assigns a large Reasoning section, but official IBPS sources do not release the actual historical question-paper corpus. Consequently:

- implementation depth may continue to be benchmarked against Banking-style multi-clue caselets;
- actual family occurrence/frequency must be supported by a labelled recall/corpus lane;
- no recall source may be represented as an official IBPS paper;
- source saturation requires convergence across multiple independent recall sets plus the official section/format evidence.

### SSC

SSC is a lower-puzzle-frequency target than Banking in the current Examtree model. Official SSC material confirms broad General Intelligence coverage and provides a previous-paper distribution lane. Therefore the next SSC step is **item-level extraction from official previous-paper resources**, not creation of new puzzle semantics.

### Punjab

Punjab remains the decisive provenance gap. Generic reasoning books, coaching sets, SSC papers and Banking recalls cannot substitute for Punjab exam evidence. Until year-tagged Punjab recruitment papers or equivalent authoritative item records are mapped:

- `SOURCE_SATURATED_FOR_PUNJAB = false`;
- Punjab-specific frequency weights remain provisional;
- no claim such as “complete for Punjab exams” is allowed.

## Coverage status by evidence dimension

| Dimension | Status after Wave 01 |
|---|---|
| Semantic/query coverage through LP-QL-047 | **FROZEN** |
| English editorial quality | **FROZEN** |
| Hindi/Punjabi localization quality | **FROZEN for implemented authorities** |
| Question Studio review routing | **INTEGRATED** |
| SSC official scope evidence | **CONFIRMED** |
| SSC item-level year-tagged Logic Puzzle ledger | **OPEN** |
| IBPS official reasoning/structure evidence | **CONFIRMED** |
| IBPS official historical question-paper corpus | **UNAVAILABLE BY PUBLISHED IBPS POLICY** |
| Banking recall-based family/frequency ledger | **OPEN** |
| Punjab official year-tagged Logic Puzzle ledger | **OPEN / BLOCKING** |
| Chapter-wide target-exam source saturation | **FALSE** |
| Production eligibility | **FALSE** |

## What would count as saturation

Do **not** use a raw paper count alone. A target lane is saturated only when consecutive source waves stop producing material new contracts or meaningful depth gaps. Record for every mapped caselet/item:

- exam body and exam name;
- year/date/shift when known;
- evidence class (`OFFICIAL_PAPER`, `OFFICIAL_HANDOUT`, `RECALL_SET`, `BOOK_REFERENCE`);
- source URL/file identity;
- parent topology (`LP-001`…`LP-011` or adjacent-family owner);
- clue topology;
- entity/caselet size;
- child query demand;
- difficulty driver;
- mapped permanent QL(s);
- disposition: `COVERED`, `DEPTH_GAP`, `NEW_CONTRACT_CANDIDATE`, `ADJACENT_FAMILY`, or `INSUFFICIENT_EVIDENCE`.

A new QL is justified only for a genuinely new hidden-state/query contract. A new context, extra names, larger numbers, or alternative wording is not a new QL.

## Wave 02 execution order

1. **SSC official-paper ledger:** recover year-tagged CGL/CHSL/CPO/Selection Post reasoning papers from SSC's official previous-paper surfaces and map only genuine Logic Puzzle items.
2. **Banking recall ledger:** build a clearly labelled multi-source IBPS/SBI/RRB recall corpus because IBPS officially withholds question papers; cross-check recurrence before making frequency claims.
3. **Punjab official-paper hunt:** prioritize PSSSB/PPSC/Punjab Police and other Examtree-targeted Punjab recruitments; record negative evidence rather than filling gaps with coaching claims.
4. Run a **no-new-contract convergence gate**. If the new corpus maps cleanly to `LP-QL-001..047`, retain the registry. If a genuine new semantic contract appears, open an unnumbered candidate first.
5. Only after target-lane evidence is sufficient may a separate authorization checkpoint consider `SOURCE_SATURATED_FOR_TARGET_EXAMS = true`; production promotion remains a distinct gate.

## Decision

**KEEP PRODUCTION CLOSED.**

Wave 01 improves the evidence model and removes a false expectation that IBPS official historical question papers should be obtainable. It does not yet justify source-saturation. The next highest-value work is the item-level SSC official-paper ledger plus the labelled Banking recall ledger, while Punjab official provenance remains the hardest blocker.
