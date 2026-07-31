# CLS-CP-002 — Final Multilingual Freeze

Status: `FROZEN_MULTILINGUAL_RUNTIME_PROOF`

## 1. Permanent inventory

```text
Checkpoint:     CLS-CP-002
Permanent QL:   CLS-QL-004
Solve contract: CP002-FIND-ODD-SEMANTIC-RELATION-PAIR
Student task:   Find the pair whose internal semantic relationship differs
Answer object:  Complete displayed word-pair
Locales:        en-IN, hi-IN, pa-IN
Option counts:  4 and 5
```

The five source controls merge into one permanent QL. Relation family, direction reversal, false pairing, synonym/antonym polarity, class-pair contrast and option count are generation or difficulty features—not different learner contracts.

## 2. Frozen solver invariant

For every emitted question:

```text
Among four or five complete displayed pairs,
exactly one admitted relation supports every pair except one,
no comparable admitted relation selects another answer,
and the displayed state independently re-solves to the same pair.
```

Only `UNIQUE` states are emitted. `AMBIGUOUS` and `NO_VALID_RULE` states are rejected deterministically.

## 3. Final relation and fact boundary

```text
Stable semantic relations:          19
Lexical relations:                  12
Semantic class-pair relations:      24
Total admitted relations:           55
Curated English fact pairs:        372
Multilingual-safe fact pairs:      160
English-only discovery fact pairs: 212
Fact-backed relation families:      31
```

The 160 multilingual-safe facts are the only fact pairs admitted to learner-facing permanent generation. Every one has a reversible Hindi and Punjabi rendering. The 212 English-only facts remain available only for discovery and ambiguity audits.

The frozen CP-001 semantic entity translations supply class-pair localisation.

## 4. Conservative safety policy

Excluded:

- volatile country/capital, state/capital and country/currency facts;
- generic spouse-role relations;
- unstable office-holder facts;
- obscure one-off trivia;
- free-form relation invention;
- broad false-pair constructions that remain arguable.

Learner-facing false-pair generation is restricted to precise governed relations. Pair order is enforced whenever the relation is directional.

## 5. Multilingual editorial policy

English, Hindi and Punjabi use the same canonical state and answer index.

The learner explanation contains four blocks:

1. Core concept / मुख्य बात / ਮੁੱਖ ਗੱਲ
2. Step-by-step solution / हल / ਹੱਲ
3. Exam speed shortcut / जल्दी तरीका / ਤੇਜ਼ ਤਰੀਕਾ
4. Common trap / ध्यान रखें / ਧਿਆਨ ਰੱਖੋ

Mechanical or overly technical wording is replaced with natural learner language. Examples include:

- `mammals` → `दूध पिलाने वाले जानवर` / `ਦੁੱਧ ਪਿਲਾਉਣ ਵਾਲੇ ਜਾਨਵਰ`;
- `aquatic animals` → `पानी में रहने वाले जानवर` / `ਪਾਣੀ ਵਿੱਚ ਰਹਿਣ ਵਾਲੇ ਜਾਨਵਰ`;
- `Crown` → `पेड़ का ऊपरी भाग` / `ਦਰੱਖਤ ਦਾ ਉੱਪਰਲਾ ਹਿੱਸਾ`;
- `Sapwood` → `पेड़ की नई लकड़ी` / `ਦਰੱਖਤ ਦੀ ਨਵੀਂ ਲੱਕੜ`.

Punjabi learner text rejects avoidable technical placeholders such as `ਪਦ` and `ਸਾਦ੍ਰਿਸ਼ਤਾ`.

## 6. Final executable evidence

### Discovery audit

```text
Generated English discovery questions: 2,000
Relations exercised:                   55/55
Curated facts audited:                372/372
Difficulties:                          Easy, Medium, Hard
Option counts:                         4 and 5
```

### Frozen English runtime audit

```text
Generated questions:          1,600
Unique visible questions:     1,580
Duplicate visible questions:     20
Relations exercised:             55/55
Source controls exercised:        5/5
Answer positions:             360, 401, 394, 361, 84
```

### Multilingual parity audit

```text
Questions per locale:          600
Total questions:             1,800
Relations exercised:            55/55
Source controls exercised:       5/5
Unique en-IN questions:          595
Unique hi-IN questions:          597
Unique pa-IN questions:          597
Duplicate counts en/hi/pa:     5/3/3
Unique explanation traces:     1,767
Answer positions per locale: 135, 156, 148, 134, 27
```

Every Hindi and Punjabi displayed pair is converted back to the exact canonical English pair before independent solving.

## 7. Review package

The checkpoint workflow exports:

```text
Frozen multilingual questions: 90
Canonical review states:        30
Locales per state:               3
Complete multilingual fact rows: 160
```

The question review covers all source controls, relation families, option counts and difficulty levels. The fact sheet exposes every fact admitted to multilingual permanent generation.

## 8. Ownership closure

Classification owns complete option-local pair comparison:

```text
A:B, C:D, E:F, G:H -> choose the differently related pair
```

Analogy retains source-to-target rule transfer and equivalent-pair selection from a supplied source pair.

Number-pair arithmetic, letter-pair structure and blood-relation graph inference remain outside CP-002.

## 9. Release locks

```text
Permanent CP-002 QLs:          1
Frozen CP-002 solve contracts: 1
Question Studio exposure:      disabled
Question Bank storage:         disabled
Test eligibility:              disabled
Public publication:            disabled
```

This freeze approves a multilingual review-only runtime proof. It does not authorise Question Studio, storage, test assembly or public publication wiring.