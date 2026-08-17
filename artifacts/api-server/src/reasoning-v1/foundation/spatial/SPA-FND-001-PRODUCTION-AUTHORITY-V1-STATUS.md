# SPA-FND-001 — Production Authority / QL Discovery V1

## Status

`CONTROLLED_DISCOVERY_AUTHORITY_ONLY_NOT_FROZEN`

This authority is stacked directly on Production Scale V2 exact head `caff1d753358a0a9b12e8c892c391adbb007eab8` (PR #692).

It does **not** convert generated questions into permanent QLs, does not activate Question Studio and does not authorize publication.

## Why this phase exists

The spatial runtime has already proved high-volume deterministic generation, but generation volume and curriculum structure are different things. A 500-question stress pool is evidence of safe content capacity; it is not evidence that a chapter needs 500 QLs.

This phase therefore introduces provisional **authority anchors** and **discovery checkpoints**. They describe materially different learner-facing archetypes that must be source-saturated, merge/split audited and reviewed before permanent QL allocation.

## Controlled discovery map

```text
Chapters:                         5
Discovery checkpoints:          24
Authority anchors incl. holds:  49
Learner-candidate anchors:      48
Production-scale validated:     26
Proof-validated, scale pending: 22
Held policy anchors:             1
Permanent QLs:                   0
```

### MIR-001 — Mirror Images

3 discovery checkpoints / 4 learner-candidate anchors.

- geometric vertical reflection;
- Latin vector-glyph string mirror images;
- Western Arabic digit-string mirror images;
- analog-clock reflected-diagram selection.

All four have controlled proof evidence. None has yet been promoted to production-scale authority in the current 1,500-question synthesis proof.

Numeric vertical mirror-time arithmetic remains owned by `CLK-001`; MIR owns learner-facing reflected clock diagrams.

### WAT-001 — Water Images

3 discovery checkpoints / 3 learner-candidate anchors + 1 held policy anchor.

- geometric horizontal reflection;
- Latin vector-glyph string water images;
- Western Arabic digit-string water images;
- analog-clock water reflection remains `HOLD` under the existing `DIAGRAM_ONLY` policy.

The hold prevents a generic reflected clock from being treated as a valid numeric real-clock time.

### FAN-001 — Figure Analogy

6 discovery checkpoints / 11 learner-candidate anchors.

Production-scale validated rigid families:

1. complete 90° clockwise rotation;
2. complete 180° rotation;
3. complete vertical reflection;
4. complete horizontal reflection.

Proof-validated but scale-pending learner archetypes:

5. marker-only movement;
6. segment addition;
7. segment deletion;
8. inner-shape substitution;
9. inner/outer exchange;
10. shading inversion;
11. complete rotation plus shading inversion.

The four scale-validated families exactly match the current FAN production-synthesis authority. The seven remaining proof families are not promoted by association.

### FCL-001 — Figure Classification

7 discovery checkpoints / 20 learner-candidate anchors.

Eight composite-relation archetypes remain proof-validated but production-scale pending:

- outer/inner shape difference;
- dot count vs inner-polygon sides;
- marker on arrow side;
- inner/outer same direction;
- dot count vs outer-polygon sides;
- marker opposite dot group;
- inner polygon one side greater than outer;
- arrow toward dot group.

Twelve primitive-native archetypes are production-scale validated:

- even-sided polygon;
- vertical symmetry;
- horizontal symmetry;
- 180° symmetry;
- 90° symmetry;
- branch junction;
- true crossing;
- partitioned figure;
- 180°-but-not-90° symmetry;
- exactly two free terminals;
- closed shape;
- straight-sided polygon.

This preserves the distinction between the earlier ambiguity-remediated proof corpus and the later 500-question perceptual-safe scale catalog.

### FSR-001 — Figure Series

5 discovery checkpoints / 10 learner-candidate anchors.

All ten current rule authorities are production-scale validated:

- 90° clockwise rotation;
- 90° anticlockwise rotation;
- 180° rotation;
- clockwise / anticlockwise marker movement;
- clockwise / anticlockwise dot-group movement;
- +1 dot progression;
- clockwise rotation + anticlockwise marker movement;
- anticlockwise rotation + clockwise dot-group movement.

## Cross-chapter ownership lock

- Numeric vertical mirror-time arithmetic → `CLK-001`.
- Reflected analog-clock diagram selection → `MIR-001`.
- Generic water-reflected analog clock → `WAT-001`, `DIAGRAM_ONLY`; numeric real-clock interpretation excluded.
- Devanagari and Gurmukhi visual glyph geometry → separate script-specific authority work; not inherited from Latin proof glyphs.
- Figure Completion and later non-verbal chapters remain future spatial chapters; they are not silently folded into the five authorities above.

## What an authority anchor is not

An `*-AUTH-*` identifier is not a QL identifier, quota or production registration. Multiple anchors may later merge into one permanent QL when their solve contract is materially the same. One anchor may also split if source saturation proves materially distinct stem/solver/distractor contracts.

Therefore this phase deliberately contains **no `*-QL-*` allocation**.

## Required next gates

1. source and exam saturation review against SSC, Banking and relevant Punjab-state patterns;
2. archetype merge/split/gap audit;
3. production-scale proof for currently scale-pending anchors that survive the audit;
4. English stem, option and explanation human exam-readiness review;
5. explicit permanent QL allocation approval;
6. only then Question Studio activation approval.

## Lifecycle lock

```text
Permanent QLs:                0
Discovery frozen:             false
English human freeze:         false
Question Studio discovery:    false
Question Bank writes:         false
Mock-test eligibility:        false
Public publication:           false
Hindi/Punjabi generation:     false
API/database schema changes:  none
```

This authority layer is intentionally additive and inactive. It changes no runtime generator, renderer, registry, API, database or student surface.
