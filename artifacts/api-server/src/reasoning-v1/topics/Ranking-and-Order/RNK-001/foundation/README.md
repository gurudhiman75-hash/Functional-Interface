# RNK-001 Foundation Object Pool V2

Status: **future-facing deterministic presentation infrastructure; not adopted by frozen CP001..CP006 runtimes**.

Pinned content manifest:

```text
RNK_OBJECT_POOL_V2_MANIFEST_V1
sha256:09fd886c8ef602ab00bd6ca4b1410b963c8db93351881417ec13e538ec4aa452
```

Any change to the versioned people, localized labels, groups, settings, relation templates, symbolic objects, quantity domains, partition schemes, operation surfaces or required-operation variables must deliberately move this manifest.

## Inventory

### Ordinary Ranking presentation pool

```text
person objects:            96
male/female:               48 / 48
locales/person:            EN / HI / PA
localized person labels:   288
group objects:             20
setting objects:           18
semantic ranking domains:   6
relation template sets:      6 x 3 locales
```

### Derived/compositional Ranking pool

```text
symbolic rankable objects: 52
derived quantity domains:   8
partition schemes:          12
derived operation kinds:     8
locales:                    EN / HI / PA
```

Core files:

```text
rnk-object-pool-v2.ts
rnk-presentation-object-pool-v2.ts
rnk-derived-object-pool-v2.ts
rnk-derived-operation-render-v2.ts
rnk-object-pool-v2-manifest.ts
rnk-object-pool-v2.test.ts
rnk-derived-object-pool-v2.test.ts
rnk-derived-operation-render-v2.test.ts
rnk-object-pool-v2-manifest.test.ts
```

## Purpose

Historical RNK generators were built checkpoint by checkpoint and some use small local name arrays. Those arrays are now projection-bearing history and must remain unchanged.

Object Pool V2 gives future Question Studio/discovery versions a much larger deterministic presentation layer without mutating frozen mathematics.

The derived extension was added after the post-CP006 source audit found source-backed Ranking questions involving subgroup composition, symbolic weighted objects, money transfers and bounded numeric age domains.

## People

The registry contains 96 stable person IDs, balanced 48/48 across male/female records, with unique English, Hindi and Punjabi display forms.

Names are presentation objects only. Gender or name identity must never imply rank, score, speed, seniority, wealth, ability or performance.

## Group and setting objects

Twenty neutral group labels include candidates, students, applicants, trainees, runners, participants, employees, officers, analysts and related exam-compatible groups.

Eighteen setting objects cover merit/selection lists, score rankings, training assessments, height comparison, race/time-trial ranking, seniority lists and performance-review settings.

Each setting declares compatible group IDs so a renderer does not create obviously mismatched context combinations.

## Ordinary semantic domains

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

`rnk-presentation-object-pool-v2.ts` provides complete `{A}` / `{B}` relation templates in English, Hindi and Punjabi for:

```text
higher relation
lower relation
equality relation
```

Templates avoid English gender pronouns and slash-gender placeholders so neutral ranking grammar is not coupled to the selected person's gender.

## Symbolic rankable objects

`rnk-derived-object-pool-v2.ts` adds 52 deterministic symbolic objects.

The first 26 are `A..Z`, directly supporting source-authentic forms such as the SSC MTS weight problem with objects `F, G, H, J, K, L`. Additional symbolic IDs extend capacity for larger generated states without forcing human names into object-weight questions.

Each symbolic object supports:

```text
SYMBOL_ONLY
OBJECT_LABEL
```

## Derived quantity domains

```text
WEIGHT
MONEY_BALANCE
AGE
POPULATION_COUNT
SCORE
TIME_TAKEN
HEIGHT
INCOME
```

These are **presentation/derivation domains**, not permanent QLs.

A future solver must still decide whether a problem belongs to Ranking or Quant based on the assessed reasoning burden.

## Partition schemes

Twelve two-category schemes support subgroup-composition questions.

One is directly source-backed:

```text
boys / girls
```

Neutral alternatives include:

```text
Section A / Section B
morning batch / evening batch
Batch P / Batch Q
Group X / Group Y
first shift / second shift
Team A / Team B
```

A category is always explicit problem data. It must never be inferred from a person's name.

## Derived operation surfaces

Eight operation families support source-backed CP007 discovery:

```text
TRANSFER
MULTIPLIER
FRACTION_OF
EXACT_DIFFERENCE
SUM_COMPARISON
CATEGORY_RATIO
CATEGORY_AHEAD_COUNT
BOUNDED_CONSECUTIVE_VALUES
```

They provide EN/HI/PA surface variants only. Mathematical validity remains the responsibility of the eventual CP007 solver.

`rnk-derived-operation-render-v2.ts` adds deterministic placeholder substitution and a gender-neutral transfer renderer. Hindi/Punjabi money-transfer wording is intentionally phrased without assuming the selected person's grammatical gender.

## Deterministic APIs

Ordinary layer:

```text
selectRnkPeople(seed, count, options)
selectRnkSetting(seed, domain?)
selectCompatibleRnkGroup(seed, setting)
buildRnkPresentationBundle(seed, count, options)
renderRnkRelation(domain, relation, locale, A, B)
```

Derived layer:

```text
selectRnkSymbolicObjects(seed, count)
selectRnkDerivedQuantityDomain(seed)
selectRnkPartitionScheme(seed)
rnkDerivedOperationSurface(kind)
renderRnkDerivedOperation(kind, locale, seed, variables)
```

No V2 selector uses `Math.random()`.

## Validation burden

The ordinary pool test checks:

- globally unique person IDs and visible names per locale;
- NFC normalization;
- 48/48 gender balance;
- deterministic balanced draws for 5, 6, 7, 8, 10 and 12 people across 1,000 seeds each;
- deterministic setting/group selection across 1,000 seeds;
- every setting's group compatibility;
- all six semantic domains;
- complete EN/HI/PA relation-template coverage;
- absence of English gender-pronoun/slash placeholders in relation templates;
- absence of Seating Arrangement vocabulary;
- deterministic presentation bundles across locales/domains.

The derived pool test checks:

- 52 unique symbolic object IDs/symbols;
- eight quantity domains with valid supported-operation references;
- twelve unique partition schemes and explicit source-backed marker for boys/girls;
- all eight operation surface kinds across EN/HI/PA;
- deterministic symbolic draws for 4–16 objects across thousands of seeds;
- deterministic quantity-domain and partition selection.

The derived renderer test checks all eight operation kinds across all three locales for deterministic rendering, complete substitution and transfer-gender neutrality.

The manifest test protects the complete V2 content projection at:

```text
09fd886c8ef602ab00bd6ca4b1410b963c8db93351881417ec13e538ec4aa452
```

## Frozen compatibility

The V2 pools must not change these permanent projections:

```text
CP004  39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f
CP005  f6759445937626e6777f322f9b8217bc7aaa12f6a96ee180a24ca3350bd42717
CP006  7043ecd80798ed9b60529d6052f4bc6fd4e678a98d06cc3e0332a3d10028d819
```

Future runtime adoption requires a new version/projection and its own manual review. It must not be smuggled into an already frozen projection.
