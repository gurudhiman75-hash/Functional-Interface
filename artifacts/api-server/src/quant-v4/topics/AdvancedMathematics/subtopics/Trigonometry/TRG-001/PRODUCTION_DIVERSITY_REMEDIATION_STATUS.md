# TRG-001 Orientation + Structural Diversity Remediation Status

Status: **AUDIT GAPS REMEDIATED IN CODE — EXECUTION AND FRESH 144-QL EDITORIAL REVIEW PENDING**

This layer supersedes `production-audit-remediated-runtime.ts` as the active TRG-001 review surface.

## Active final review surface

- `production-diversity-remediated-runtime.ts`
- `production-diversity-remediated.test.ts`

The generator composes the earlier 9-Ql fresh-audit remediation and adds controlled right-triangle orientation + chapter-wide diversity hardening.

## Right-triangle orientation remediation

The earlier runtime reused only Pythagorean triples oriented as `opposite < adjacent`, over-representing acute cases with `tanθ < 1`.

The final diversity layer now owns all **30 permanent QLs whose mathematics depends materially on the orientation of a right-triangle ratio**:

- CP-001: `QL-005...024`
- CP-004: `QL-092...095`
- CP-005: `QL-097...100`
- CP-006: `QL-131...132`

For these QLs:

- the same five exact Pythagorean triples remain the numeric authority;
- each triple may be used in its original or mirrored acute-angle orientation;
- canonical state explicitly records `TAN_LT_ONE` or `TAN_GT_ONE`;
- numbered canonical seeds deterministically alternate orientation, guaranteeing coverage on both sides of 45°;
- every orientation-sensitive QL has two normalized wording structures rather than relying on changed numbers alone;
- sign-sensitive outputs are written to react to orientation rather than assuming `adjacent > opposite`.

### Sign-sensitive corrections

The new layer explicitly protects:

- `QL-023`: `tanθ<1 -> cosθ>sinθ`, `tanθ>1 -> sinθ>cosθ`;
- `QL-097`: denominator sign in `(sinθ+cosθ)/(sinθ-cosθ)`;
- `QL-100`: sign of `sin²θ-cos²θ`;
- `QL-132`: sign of `cos2θ` from tangent orientation.

## Static option audit

Before recording this status, the option formulae for all 30 orientation-sensitive builders were checked across:

- 5 base Pythagorean triples;
- both acute-angle orientations for every triple;
- 10 exact geometric states per formula family.

No mathematical four-option collision was found in that static audit.

This is a static formula audit, **not** TypeScript execution evidence.

## Structural / semantic diversity gate

The previous `stems.size >= 2` rule counted raw strings, so a changed number could falsely count as editorial stem diversity.

The new gate separates two concepts:

1. **normalized stem structure** — numbers and variable symbols are normalized before comparing wording;
2. **semantic mathematical state** — canonical-state fingerprints ignore presentation-only keys such as variant/wording/seed.

For each permanent QL, the gate requires either:

- at least two normalized stem structures; or
- at least two semantic mathematical states.

Only 12 deliberately canonical single-form roles may opt out:

- `QL-036`
- `QL-037`
- `QL-042`
- `QL-043`
- `QL-044`
- `QL-047`
- `QL-096`
- `QL-117`
- `QL-118`
- `QL-130`
- `QL-133`
- `QL-143`

The exception budget is fixed at 12. The gate targets **at least 132/144 generatively diverse QLs**.

## New final gate targets

`production-diversity-remediated.test.ts` targets:

- 144/144 permanent IDs;
- 24 canonical seeds per QL = **3,456 canonical target cases**;
- all 30 orientation-sensitive QLs covering both `TAN_LT_ONE` and `TAN_GT_ONE`;
- two normalized stem structures for every orientation-sensitive QL;
- semantic-state diversity for every orientation-sensitive QL;
- at least **132/144** QLs with structural or semantic-state diversity;
- explicit 12-Ql maximum single-form exception budget;
- exact four-option uniqueness / one correct answer;
- correct-index integrity;
- independent/theorem verification;
- difficulty-sensitive explanation depth;
- authority-family retention;
- review locks;
- activation locks;
- sign regression checks for QL-023, QL-100 and QL-132;
- 50-seed full sweep = **7,200 target cases**.

## Fresh-audit remediation retained

The previous 9 permanent-ID corrections remain active underneath this layer:

- `QL-048`
- `QL-112`
- `QL-122`
- `QL-123`
- `QL-125`
- `QL-126`
- `QL-136`
- `QL-137`
- `QL-142`

Therefore the final surface combines:

- authority reconciliation;
- the 9 direct audit remediations;
- 30 orientation-sensitive regenerated roles;
- normalized structural/semantic diversity gates.

## Current review truth

- permanent QLs: **144/144 present**
- fresh-audit direct remediations: **9 IDs implemented**
- orientation-sensitive remediation: **30 IDs implemented**
- previous two unresolved audit gaps: **implemented in code/gates**
- fresh full-surface AI/editorial re-review: **PENDING**
- human review: **0/144 PENDING**
- freeze eligible: **NO**

## Execution evidence

No execution pass is claimed yet for this final layer.

Therefore:

- strict TypeScript compile: **NOT CLAIMED**
- 3,456 canonical diversity cases: **NOT CLAIMED**
- 7,200 sweep cases: **NOT CLAIMED**
- GitHub Actions pass: **NOT CLAIMED**

## Activation safety

Still OFF:

- Question Studio discovery
- Test Builder eligibility
- question-bank storage
- public publication
- Hindi/Punjabi runtime

No registration or activation file is changed by this remediation.
