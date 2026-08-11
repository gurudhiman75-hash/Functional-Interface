# INT-001 / INT-CP-001 English Editorial V2 Release Record

Release ID: `INT-CP-001-EN-v2`  
Editorial standard: `FOUR_TIER_GOLD_V2`  
Mathematical baseline: `INT-CP-001-EN-v1`  
Permanent QL range: `INT-QL-001..INT-QL-021`  
Frozen QL count: **21**  
Status: **FROZEN_ENGLISH_CONTRACT / REVIEW-ONLY**

## Release relationship

`INT-CP-001-EN-v2` supersedes the learner-facing English presentation of `INT-CP-001-EN-v1` without changing its mathematical inventory.

Unchanged:

- all 21 permanent QL identities;
- every solve contract and ownership boundary;
- exact parameter state;
- canonical answer;
- independent verification;
- option values and correct answer position;
- difficulty and representation ownership;
- publication and Question Studio safety.

Changed:

- learner-facing stems receive Indian currency grouping while preserving punctuation;
- explanations use the four-tier modular framework;
- every core relation uses centred display MathJax;
- every question includes a competitive-exam shortcut and shortcut MathJax;
- every wrong option receives displayed-option-specific misconception analysis;
- the review exporter emits the v2 structure directly.

## Four-tier learner contract

Every generated English package contains exactly these sections:

1. `📌 Core Concept & Formula`;
2. `📝 Step-by-Step Solution`;
3. `⚡ Exam Speed Shortcut`;
4. `⚠️ Common Traps & Distractor Analysis`.

The shortcut layer prioritises the net-rate or amount-factor method where applicable:

```text
Net interest percentage = R × T
Amount percentage = 100 + R × T
```

Two-time amount questions instead use amount-gap or amount-factor ratio shortcuts appropriate to their topology.

## Editorial defects closed

The adversarial review identified and this release closes:

- older narrative explanation headings;
- plain core formulas without display MathJax;
- ungrouped rupee values such as `₹12000` and `₹29040`;
- missing net-rate and amount-factor shortcuts;
- raw option-audit presentation instead of student-facing trap analysis.

Internal follow-up review also closed:

- punctuation commas being confused with Indian digit-grouping commas;
- shortcuts without display equations;
- imperative shortcut openings;
- repeated wording such as “first ... first”;
- closure-time distractors with unreadable fractional-year values;
- correct-option display-unit and conclusion mismatches.

## Permanent validation gates

For every generated question, the v2 audit requires:

- deterministic regeneration;
- exact core-runtime validation;
- release ID `INT-CP-001-EN-v2`;
- all four tier headings;
- balanced core and shortcut display MathJax;
- non-empty shortcut narrative;
- no imperative or repeated-word shortcut defects;
- exactly three wrong-option analyses;
- exact option-text and misconception-ID alignment;
- Indian comma grouping for every rupee value of four or more digits;
- no punctuation loss after a currency value;
- four unique options and one exact correct answer;
- no internal identity, placeholder or unresolved token;
- review-only lifecycle safety.

## Review evidence contract

The release exporter produces:

```text
21 QLs × 3 review seeds = 63 English review questions
```

The exhaustive freeze audit produces:

```text
21 QLs × 80 seeds = 1,680 English packages
```

For each QL it requires:

- all four correct-answer positions;
- every frozen source adapter;
- at least 35 distinct stems;
- at least 35 mathematical fingerprints;
- at least 8 distinct displayed answers;
- 80 four-tier explanations;
- 80 shortcut equations;
- 240 distractor analyses.

## Lifecycle boundary

Every v2 package remains:

```text
maturity:                    FROZEN_ENGLISH_CONTRACT
reviewStatus:                FROZEN_ENGLISH_CONTRACT
questionBankStatus:          NOT_STORED
testEligibility:             INELIGIBLE
publiclyPublishable:         false
questionStudioDiscoverable:  false
```

Hindi and Punjabi adaptation, multilingual parity, publication approval and Question Studio activation remain separate downstream release gates.
