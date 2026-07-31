# CLS-CP-001 — Simplified Student Explanation Standard

Status: `EDITORIAL_V2_REQUIRED`

This standard applies to the permanent English, Hindi and Punjabi review-only runtimes for:

- `CLS-QL-001` — semantic odd one out;
- `CLS-QL-002` — select another class member;
- `CLS-QL-003` — select the only coherent word-group.

It does not change the solver, answer, difficulty or lifecycle locks.

## 1. Four learner blocks

Every solution uses exactly four short sections:

1. `📌 Core Concept` / `📌 मुख्य बात` / `📌 ਮੁੱਖ ਗੱਲ`
2. `📝 Step-by-Step Solution` / `📝 हल` / `📝 ਹੱਲ`
3. `⚡ Exam Speed Shortcut` / `⚡ जल्दी तरीका` / `⚡ ਤੇਜ਼ ਤਰੀਕਾ`
4. `⚠️ Common Trap` / `⚠️ ध्यान रखें` / `⚠️ ਧਿਆਨ ਰੱਖੋ`

The headings are renderer concerns. Internal data fields remain compatible with the existing runtime contract.

## 2. No learner-facing option loop

The learner explanation must not repeat one mechanical sentence for every option.

Rejected pattern:

```text
A belongs to X.
B belongs to X.
C belongs to X.
D does not belong to X.
```

Required pattern:

```text
A, B and C are X.
D belongs to Y.
Therefore, D is the odd one out.
```

Per-option evidence remains available in `evidenceByOption` for automated QA and reviewer diagnostics, but it is not shown as the main student solution.

## 3. Task-specific structure

### Odd one out

- state the exact common group;
- name all matching options together;
- explain what the outlier belongs to when a safe alternative class is known;
- state the answer directly.

### Select another member

- name the group formed by the given words;
- state that the answer is another true member;
- reject merely related or broad-category options.

### Select a coherent group

- name the three words in the correct group together;
- state that every other option contains at least one mismatching word;
- use one actual near-miss option in the trap warning when possible.

## 4. Simpler language

Avoid learner-facing words such as:

- ontological hierarchy;
- cross-cutting property;
- multi-membership;
- semantic demand;
- candidate rule;
- quality rank;
- hierarchy depth.

Use:

- common group;
- shared link;
- overlapping trait;
- main use;
- where the item belongs;
- smaller clear group.

## 5. Locale style

### English

Use short teacher sentences and direct warnings. Prefer:

```text
Sapwood, Twig, Bark and Branch are parts of a tree.
Keel is part of a ship.
Therefore, Keel is the odd one out.
```

### Hindi

Prefer `विषम (अलग) शब्द` or simply `अलग शब्द`. Avoid heavy terms such as `असंगत पद` inside routine explanations.

### Punjabi

Use natural Gurmukhi and `ਵੱਖਰਾ ਸ਼ਬਦ`. Do not use technical placeholders such as standalone `ਪਦ` or `ਸਾਦ੍ਰਿਸ਼ਤਾ`.

## 6. Factual safety

A simple explanation must still be factually correct.

The example `Duck / Parrot / Butterfly / Bee` cannot treat Duck as unable to fly. Ducks can fly, so that displayed state is rejected if an augmented flight-fact check produces another answer or ambiguity.

The permanent runtime performs an additional fact-safety pass before exposing a generated state.

## 7. Review layout

Technical fields such as source control, solve contract and difficulty features remain in a collapsed reviewer-only block. The main review view shows the question, options, answer and four learner blocks first.
