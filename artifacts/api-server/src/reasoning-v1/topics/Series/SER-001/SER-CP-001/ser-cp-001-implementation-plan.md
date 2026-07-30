# SER-CP-001 — Additive sequence executable-discovery plan

## Objective

Build the smallest honest executable foundation for `SER-001 — Series` without pre-allocating permanent QLs or pretending that unpushed experiments are repository authority.

The initial candidate invariant is:

```text
a(n) = start + n × step, where step is a non-zero bounded integer
```

The generator owns instance construction. The independent solver receives only the displayed sequence and task kind, enumerates compatible arithmetic progressions and accepts the item only when one candidate remains.

## Temporary task templates

| Temporary ID | Task | Answer semantic |
|---|---|---|
| `SER-CP-001-TMP-001` | infer the next term | required term value |
| `SER-CP-001-TMP-002` | infer an interior missing term | required term value |
| `SER-CP-001-TMP-003` | infer the previous term | required term value |
| `SER-CP-001-TMP-004` | identify the wrong displayed term | wrong displayed value |

The templates exercise task directions around one candidate solve authority. Their final merge/split result remains open.

## Generation domains

- Easy: short positive ascending sequences.
- Medium: wider signed starts with ascending or descending steps.
- Hard: longer signed sequences with larger positive or negative steps.
- Zero-step sequences are excluded because they collapse distractor and difficulty behavior.
- All displayed and option values remain safe bounded integers.
- Wrong-term corruption is non-multiple of the true step so it cannot silently duplicate another valid term.

## Independent solving and ambiguity

For completion tasks, the solver:

1. derives candidate non-zero integer steps from every visible pair;
2. derives the corresponding start value;
3. retains candidates matching every visible term;
4. rejects unless exactly one candidate remains;
5. evaluates the missing position.

For wrong-term tasks, the solver:

1. derives candidate progressions from displayed pairs;
2. retains candidates with exactly one mismatch;
3. rejects unless exactly one candidate remains;
4. returns the mismatching displayed value and its correct replacement.

Hidden generator state is used only by audit assertions after the independent result is obtained.

## Option and explanation contract

- exactly four unique numeric options;
- exactly one correct answer;
- deterministic answer placement;
- wrong-term distractors are other displayed terms that still satisfy the rule;
- completion distractors model one-step, direction and off-by-one errors;
- every option receives a short trap analysis;
- the explanation states the common difference, applies it at the target position and concludes with the required value.

## Audit contract

The executable audit generates:

```text
4 temporary templates × 120 seeds = 480 questions
```

For every question it checks:

- deterministic replay;
- identity and lifecycle locks;
- four unique options and one answer;
- independent-solver agreement;
- exactly one compatible rule;
- task-specific missing/wrong-term shape;
- safe integer bounds;
- complete explanation and option analysis;
- absence of placeholders and internal IDs in learner text.

Across every temporary template it also requires exact reach across four answer positions and three difficulty labels, plus at least 80 distinct mathematical fingerprints.

## Review evidence

The review exporter emits 32 exact English questions:

```text
4 temporary templates × 8 seeds
```

Generated review output is uploaded by GitHub Actions and is not committed as source.

## Lifecycle boundary

```text
Permanent QLs:             0
Question Studio:           disabled
Question Bank:             disabled
Test eligibility:          disabled
Public publication:        disabled
Localization:              not started
Source saturation:         open
Editorial approval:        not started
```

## Execution honesty

At the time this plan is added:

- runtime and audit source are implemented;
- GitHub Actions execution is pending;
- no test is described as passing until the remote workflow reports success;
- source saturation and permanent allocation remain future work.
