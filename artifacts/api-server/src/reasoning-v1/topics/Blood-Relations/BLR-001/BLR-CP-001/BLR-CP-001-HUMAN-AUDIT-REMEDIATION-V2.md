# BLR-CP-001 — Human Audit Remediation V2

Status: **implemented in review-facing runtime; exact-head CI pending; no permanent QLs**.

## Human audit received

The 88-question English review pack was independently rated **8.7/10**. The audit confirmed:

- mathematical and logical correctness across all records;
- independent-solver agreement;
- clean gender constraints;
- accurate misconception labels;
- strong distractor taxonomy.

The review identified three production-readiness defects:

1. artificial and repetitive stem lead-ins;
2. missing generation-level family-tree visuals;
3. explanations that stated the path without fully teaching generation arithmetic, lineage side and option rejection.

## Remediation architecture

The solver and graph generators remain unchanged. A shared deterministic editorial layer now upgrades every question emitted through the canonical CP-001 review/runtime registry.

This separation preserves:

- graph truth;
- seeded determinism;
- answer identity;
- option position balance;
- misconception labels;
- independent-solver proof.

The editorial layer changes only learner-facing wording and teaching structure.

## Stem remediation

The following filler openings are prohibited:

```text
Read the following family information carefully.
Study the following family information carefully.
Read the family statements and answer the question.
Use the relations given below to reconstruct the family.
Consider the following information about a family.
```

One-clue questions now use compact exam-authentic forms such as:

```text
If Sahil is the son of Harjit, how is Sahil related to Harjit?
```

Two-clue questions use joined declarative phrasing:

```text
Isha is the mother of Gurleen, and Gurleen is the mother of Asha. How is Isha exactly related to Asha?
```

Longer families retain all clues without a repetitive instruction sentence.

## Four-tier teacher explanation

Every canonical reviewed question now exposes:

### Tier 1 — Core concept and generation mapping

- `(+)` male;
- `(-)` female;
- `(?)` not established or not required;
- parent `+1`;
- sibling/spouse `0`;
- child `-1`;
- query-specific rules for order, claim truth, gender or maternal/paternal ownership.

### Tier 2 — Step-by-step family-tree solution

A standard ASCII generation grid includes:

- named reference at Generation `0`;
- all connected people grouped by generation;
- gender symbols;
- parent, spouse and sibling edges;
- explicit generation arithmetic such as `ΔGen = +2`;
- the existing clue-normalisation and solver path.

### Tier 3 — Ten-second exam shortcut

Examples:

```text
Mother's mother = maternal grandmother.
Father's sister = paternal aunt.
Count upward parent moves as +1 and downward child moves as -1.
Read an ordered pair from left to right.
```

### Tier 4 — Distractor analysis

Each wrong option retains its machine error label and receives a student-facing warning. Covered families include:

- reversed query direction;
- wrong relative gender;
- maternal/paternal swap;
- generation direction reversed;
- generation off by one;
- wrong family member;
- claim not entailed;
- claim actually true;
- nearby kinship confusion;
- wrong generation or branch.

## Executable remediation gate

`cp001-human-audit-remediation.test.ts` generates 440 reviewed questions and enforces:

- no banned filler opening;
- no direct-question double phrasing;
- compact one-clue stems;
- four teaching tiers on every question;
- generation grid presence;
- generation arithmetic for exact-lineage questions;
- ordered-pair direction teaching;
- three option-specific trap explanations;
- exact alignment between trap explanations and option error labels;
- answer-position balance `[110, 110, 110, 110]`.

The existing 1,140 solver/runtime questions and 440-question editorial audit remain active, so the workflow now exercises 2,020 deterministic generated questions before export.

## Review export V2

The HTML, CSV and JSONL export now includes:

- `coreConcept`;
- `familyTreeGrid`;
- `generationAnalysis`;
- `examShortcut`;
- `distractorAnalysis`;
- existing structured prompt, options, clue trace and metadata.

The HTML review pack displays the four tiers as separate teacher-facing sections.

## Discovery boundary

This human audit is remediation evidence, not a discovery freeze.

Still prohibited:

- permanent `BLR-QL-*` allocation;
- Hindi or Punjabi localisation;
- Question Studio visibility;
- Question Bank or mock-test eligibility;
- public publication.

After exact-head CI and review-pack inspection, CP-001 still requires the second source/gap audit before any freeze decision.
