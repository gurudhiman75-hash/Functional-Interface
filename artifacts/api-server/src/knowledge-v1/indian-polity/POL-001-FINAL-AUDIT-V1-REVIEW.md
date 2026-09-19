# POL-001 Indian Polity — Final Audit V1 Review

**Status:** REVIEW-READY  
**Audit surface:** 27 CPs / 2,087 questions  
**Runtime integration:** not started  
**Localization:** not started

This review packet contains only the final-audit remediation layer. Previously approved CP content remains the base authority until these candidates are approved.

## A. Non-semantic remediation

These changes preserve the tested fact and answer semantics.

### Qualification explanation backfill

Full high-yield qualification lists were added only to eligibility questions for:

- President — POL-CP-007 V7
- Vice-President — POL-CP-008 V7
- Supreme Court Judge — POL-CP-012 V3
- High Court Judge — POL-CP-013 V2
- Governor — POL-CP-014 V2
- State Legislature membership — POL-CP-016 V2

### Mechanical stem cleanup

49 surviving stems across CP003–CP011 matched the exact database pattern `Article X (mainly) deals with:`.

The final editorial layer rewrites only that pattern into natural question forms. Answers, options, correct positions, explanations and sources are unchanged.

Examples:

| Before | Final-audit form |
|---|---|
| Article 2 deals with: | Which subject is covered under Article 2 of the Constitution? |
| Article 14 deals with: | Article 14 of the Constitution primarily concerns which of the following? |
| Article 368 deals with: | Which of the following is provided by Article 368 of the Constitution? |
| Article 79 deals with: | What is the main constitutional subject of Article 79? |

### Execution/validator defects fixed

- CP007: one V6 explanation violated its own banned-wording validator.
- CP025: validator contradicted the approved 43 completion / 37 question stem mix.
- CP027: two completion stems violated CP027's own mechanical-stem gate.

No answer semantics changed in these fixes.

## B. Ownership remediation candidates

### POL-CP-013 V3 — Article 226 writ context

**Problem:** CP004 already owns generic writ meanings/scenarios; CP013 repeated generic writ questions.

**Remediation:** ten CP013 writ stems are explicitly reframed as High Court / Article 226 applications. Answers and options are unchanged.

Examples:

- `Which writ is primarily used to secure release from unlawful detention?`
  → `In an Article 226 petition before a High Court, which writ primarily seeks release from unlawful detention?`
- `Which writ commands a public authority to perform a public duty it has failed to perform?`
  → `Under Article 226, which writ may a High Court use to require a public authority to perform a neglected public duty?`
- prohibition/certiorari hard items are likewise anchored to Article 226.

### POL-CP-014 V3 — Governor ownership cleanup

**Problem:** CP014 contained standalone ministry facts owned by CP015 and a full Advocate-General block owned by CP022.

#### New QL009 — Article 175 address/message powers

| Stem focus | Answer |
|---|---|
| May Governor address either House or both Houses together? | Yes |
| What may an Article 175 message concern? | A pending Bill or another matter |
| What should a House do after receiving a required matter in a message? | Consider it with all convenient dispatch |
| Article 175 vs Article 176 | Article 175 gives a general address and message power |

#### New QL010 — Article 154 executive-power mechanics

| Stem focus | Answer |
|---|---|
| How may State executive power be exercised? | Directly or through subordinate officers in accordance with the Constitution |
| Does Article 154 automatically transfer an existing-law function to Governor? | No |
| May a competent Legislature confer functions on subordinate authorities? | Yes |
| Core Article 154 distinction | It vests State executive power while preserving lawful functions of other authorities |

#### Hard-question replacements

Standalone ministry-size, non-member-minister and Advocate-General hard items are replaced with:

- Article 154 existing-law allocation;
- Article 154 subordinate-authority functions;
- Article 175 statement evaluation;
- integrated Articles 154/160/175 mapping;
- Article 160 unforeseen contingency;
- Article 175 legislative-message application.

Governor-facing Article 163/164/166/167 interactions remain where they are necessary to understand the Governor's role.

### POL-CP-026 V3 — PSC ownership cleanup

**Problem:** CP026 explicitly says Articles 315–323/UPSC/SPSC belong to CP022, but QL013 directly retested PSC facts.

**Remediation:** all four QL013 questions are redirected to CP026's own Articles 309–314 boundary.

| New focus | Answer |
|---|---|
| Constitutional location of Articles 309–314 | Part XIV, Chapter I — Services |
| Closing sequence of Services chapter | 312A service conditions → 313 transitional laws → 314 omitted |
| Article 313 vs 314 | 313 continues certain existing service laws; 314 is omitted |
| Current-numbering end of Services chapter | Omitted Article 314 |

## C. Automated acceptance gates

The final review surface must pass:

- 27 CPs and 2,087 questions;
- answer/index alignment;
- four unique options;
- all four correct positions in every CP;
- semantic duplicate detection within and across CPs;
- qualification explanation assertions;
- CP004/013 writ ownership rule;
- CP014/015/022 State-executive ownership rule;
- CP022/026 PSC ownership rule;
- no database-style Article stems after final editorial pass;
- no internal project wording in stems;
- no generic explanation boilerplate;
- focused preservation tests for all audit overlays;
- API-server build.

## Approval effect

Approval of this review packet authorizes the audit candidates to become the final English Polity surface. The next implementation step is Question Studio package binding, followed by runtime smoke tests and then Hindi/Punjabi localization.
