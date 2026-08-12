# RNK-001 Foundation Object Pool V2

Status: **future-facing presentation infrastructure; not adopted by frozen CP001..CP006 runtimes**.

## Inventory

```text
person objects:          96
male/female:             48 / 48
locales/person:          EN / HI / PA
localized person labels: 288
group objects:           20
setting objects:         18
semantic domains:         6
relation template sets:   6 x 3 locales
```

Core files:

```text
rnk-object-pool-v2.ts
rnk-presentation-object-pool-v2.ts
rnk-object-pool-v2.test.ts
```

## Purpose

Historical RNK generators were built checkpoint by checkpoint and some use small local name arrays. Those arrays are now projection-bearing history and must remain unchanged.

Object Pool V2 gives future Question Studio / discovery versions a much larger deterministic presentation layer without mutating frozen mathematics.

## People

The registry contains 96 stable person IDs, balanced 48/48 across male/female records, with unique English, Hindi and Punjabi display forms.

Names are presentation objects only. Gender or name identity must never imply rank, score, speed, seniority, ability or performance.

## Group and setting objects

Twenty neutral group labels include candidates, students, applicants, trainees, runners, participants, employees, officers, analysts and related exam-compatible groups.

Eighteen setting objects cover merit/selection lists, score rankings, training assessments, height comparison, race/time-trial ranking, seniority lists and performance-review settings.

Each setting declares compatible group IDs so a renderer does not create combinations such as a race of office analysts unless explicitly intended by a future authority.

## Semantic domains

```text
GENERIC_RANK
SCORES
HEIGHT
SPEED
SENIORITY
PERFORMANCE
```

Domains own presentation vocabulary, not QL identity.

## Multilingual relation templates

`rnk-presentation-object-pool-v2.ts` provides complete `{A}` / `{B}` templates in English, Hindi and Punjabi for:

```text
higher relation
lower relation
equality relation
```

Templates deliberately avoid `he/she`, `his/her` and slash-gender placeholders. This keeps the relation grammar independent of the selected person's gender wherever possible.

## Deterministic APIs

```text
selectRnkPeople(seed, count, options)
selectRnkSetting(seed, domain?)
selectCompatibleRnkGroup(seed, setting)
buildRnkPresentationBundle(seed, count, options)
renderRnkRelation(domain, relation, locale, A, B)
```

No RNK V2 selector uses `Math.random()`.

## Validation burden

The pool test checks:

- globally unique person IDs and visible names per locale;
- NFC normalization;
- 48/48 gender balance;
- deterministic balanced draws for 5, 6, 7, 8, 10 and 12 people across 1,000 seeds each;
- deterministic setting/group selection across 1,000 seeds;
- every setting's group compatibility;
- all six semantic domains;
- complete EN/HI/PA relation-template coverage;
- absence of gender-pronoun/slash placeholders in relation templates;
- absence of Seating Arrangement vocabulary;
- deterministic presentation bundles across locales/domains.

## Frozen compatibility

The V2 pool must not change these permanent projections:

```text
CP004  39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f
CP005  f6759445937626e6777f322f9b8217bc7aaa12f6a96ee180a24ca3350bd42717
CP006  7043ecd80798ed9b60529d6052f4bc6fd4e678a98d06cc3e0332a3d10028d819
```

Future runtime adoption requires a new version/projection and its own manual review. It must not be smuggled into an already frozen projection.
