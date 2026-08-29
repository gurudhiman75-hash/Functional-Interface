# Algebra Final Retained Semantic Contract Matrix

**Chapter:** Algebra  
**Runtime packages:** `ALG-001`, `ALG-002`  
**Input authorities:** Revision-2 design, executable discovery, Source/PYQ Waves 1–3, HOLD Resolution Passes 01–02, final source-gap pass  
**Status:** `PRE_FREEZE_RETAINED_CONTRACT_AUTHORITY`  
**Executable candidates reviewed:** 112  
**Retained semantic contracts:** 40  
**Permanent QL IDs allocated:** 0 in this document  
**Date:** 18 August 2026

---

## 1. Decision

The 112 executable discovery candidates do **not** become 112 permanent QLs.

After source/PYQ review, ownership consolidation, HOLD resolution and a final gap pass, they collapse to **40 retained learner-facing semantic contracts**.

A retained contract is kept only when it has a stable exam-facing inference/answer contract. Representation, sign, coefficient topology, root state, endpoint inclusion, answer relation and other generation states remain variants unless they materially change the governing inference.

---

## 2. Final retained contracts — ALG-001

### CP-001 — Expressions / substitution

| Freeze key | Retained contract | Final disposition |
|---|---|---|
| `F-C001` | coefficient extraction | KEEP |
| `F-C002` | simplify / expand algebraic expression | KEEP |
| `F-C003` | evaluate one-variable algebraic expression | KEEP |
| `F-C004` | evaluate multi-variable algebraic expression | KEEP |

Merged / moved:
- missing coefficient from known evaluation → variant of linear-equation / parameter inference, no standalone contract;
- undefined substitution → domain state owned by rational-equation infrastructure.

### CP-002 — Two-variable identities / reciprocal transforms

| Freeze key | Retained contract | Final disposition |
|---|---|---|
| `F-C005` | square-sum identity from sum/product | KEEP |
| `F-C006` | cube-sum identity from sum/product | KEEP |
| `F-C007` | reciprocal square transform | KEEP |
| `F-C008` | reciprocal cube transform | KEEP |
| `F-C009` | higher reciprocal power via recurrence | KEEP |
| `F-C010` | scaled reciprocal transform | KEEP |

Merged:
- plus/minus input sign → state;
- difference-of-squares from supplied sum/difference → target variant in identity transformation, no separate QL.

### CP-003 — Three-variable identities / relations

| Freeze key | Retained contract | Final disposition |
|---|---|---|
| `F-C011` | symmetric square / pairwise-product conversion | KEEP |
| `F-C012` | zero-sum cubic identity | KEEP |
| `F-C013` | cyclic reciprocal multi-variable relation | KEEP |

Merged:
- pairwise-difference-square target → target/intermediate variant inside three-variable symmetric identities.

### CP-004 — Factorisation

| Freeze key | Retained contract | Final disposition |
|---|---|---|
| `F-C014` | identity-form recognition / factorisation | KEEP |
| `F-C015` | generic quadratic factorisation | KEEP |

`F-C014` owns identity-recognition topology including:
- difference of squares;
- perfect-square trinomial recognition/factorisation.

`F-C015` owns:
- monic/non-monic quadratic factorisation;
- common integer content as a pre-step/state.

### CP-005 — Remainder / Factor Theorem

| Freeze key | Retained contract | Final disposition |
|---|---|---|
| `F-C016` | remainder under a linear divisor | KEEP |
| `F-C017` | parameter from remainder/factor condition | KEEP |
| `F-C018` | two parameters from two independent remainder/factor conditions | KEEP |
| `F-C019` | parameter plus common remainder across two polynomials | KEEP |

Merged states:
- divisor `x-k`, `x+k`, `ax+b`;
- remainder zero/nonzero;
- Boolean factor verification.

**ALG-001 retained contracts: 19.**

---

## 3. Final retained contracts — ALG-002

### CP-006 — One-variable linear equations

| Freeze key | Retained contract | Final disposition |
|---|---|---|
| `F-C020` | solve one-variable linear equation | KEEP |

Variants:
- variables on both sides;
- brackets/expansion;
- rational/fractional coefficients;
- reverse parameter from known solution.

Engine-only:
- `0x=c` / `0x=0` no-solution / infinite-solution classification unless a later target-exam source independently justifies learner-facing ownership.

### CP-007 — Simultaneous linear equations

| Freeze key | Retained contract | Final disposition |
|---|---|---|
| `F-C021` | solve a unique 2×2 linear system | KEEP |
| `F-C022` | classify 2×2 system solution state | KEEP |
| `F-C023` | parameter for system consistency / inconsistency | KEEP |

Target `(x,y)`, one variable, `x+y`, `x-y` etc. are target states of `F-C021`.

### CP-008 — Rational equations / domain

| Freeze key | Retained contract | Final disposition |
|---|---|---|
| `F-C024` | solve rational equation with original-domain filtering | KEEP |

Merged / engine states:
- identify excluded value;
- undefined substitution;
- one/two/multiple fractional terms;
- cancelled excluded root;
- empty valid-root set;
- reciprocal rational equation;
- identity-on-allowed-domain classification.

Original denominator restrictions remain mandatory first-class state even though they are not separate QLs.

### CP-009 — Quadratic equations

| Freeze key | Retained contract | Final disposition |
|---|---|---|
| `F-C025` | solve / classify quadratic across root states | KEEP |
| `F-C026` | parameter for equal roots | KEEP |
| `F-C027` | parameter / coefficient from root condition | KEEP |

Root state in `F-C025` is metadata:
- two rational roots;
- repeated root;
- exact irrational conjugate roots;
- no real roots.

### CP-010 — Vieta / transformed roots

| Freeze key | Retained contract | Final disposition |
|---|---|---|
| `F-C028` | direct Vieta invariant / infer missing root | KEEP |
| `F-C029` | derived symmetric root expression | KEEP |
| `F-C030` | construct equation from supplied/derived sum and product | KEEP |
| `F-C031` | construct equation under controlled root transformation | KEEP |

Merged:
- infer other root from one known root → direct Vieta target variant;
- shift, reciprocal, `P±S`, reciprocal→shift and other approved transforms → controlled transform topology, not one QL each.

### CP-011 — Banking quadratic comparison

| Freeze key | Retained contract | Final disposition |
|---|---|---|
| `F-C032` | compare all admissible roots of two quadratic equations | KEEP |

Answer relation is state:
- `>`;
- `<`;
- `≥`;
- `≤`;
- `=`;
- cannot be established.

Rational vs exact conjugate-surd roots are representation states. Surd coefficients in the *input equations* and unlike-radicand comparison remain outside current freeze scope.

### CP-012 — Inequalities / extrema

| Freeze key | Retained contract | Final disposition |
|---|---|---|
| `F-C033` | solve linear inequality constraints | KEEP |
| `F-C034` | solve quadratic inequality / sign region | KEEP |
| `F-C035` | find quadratic extremum | KEEP |
| `F-C036` | parameter range for a global quadratic sign | KEEP |

`F-C033` owns both single and compound linear constraints; number of constraints and sign reversal are generation states, not separate QLs.

`F-C034` owns:
- sign direction;
- endpoint open/closed state;
- repeated/distinct rational-root topology;
- integer-count target over the solved interval.

Minimum/maximum is leading-sign state inside `F-C035`.

### CP-013 — Absolute value

| Freeze key | Retained contract | Final disposition |
|---|---|---|
| `F-C037` | solve absolute-value equation | KEEP |
| `F-C038` | solve absolute-value inequality | KEEP |

Merged states:
- simple/affine form;
- zero/negative RHS edge states;
- equal absolute distances → equation topology;
- bounded/exterior/zero-threshold inequality;
- integer count over the solved absolute-value interval.

### CP-014 — Quantity comparison / data sufficiency

| Freeze key | Retained contract | Final disposition |
|---|---|---|
| `F-C039` | quantity comparison across all admissible states | KEEP |
| `F-C040` | algebraic data sufficiency | KEEP |

QC relation outcome is answer state. DS verdict is answer state; the five standard verdicts do not create five QLs.

### CP-015 — Mixed synthesis / caselets

**Permanent contracts: 0.**

All current CP-015 generators remain controlled composition/presentation over the owning contracts above.

**ALG-002 retained contracts: 21.**

---

## 4. Count authority

```text
Executable discovery candidates       112
Retained ALG-001 contracts             19
Retained ALG-002 contracts             21
Final retained semantic contracts      40
CP-015 permanent contracts              0
```

The 40-contract count is derived from semantic/source consolidation; it was not chosen as a quota.

---

## 5. Major explicit non-contract states

The following are important runtime/test dimensions but do not receive standalone QL identity:

- positive/negative coefficients;
- monic/non-monic;
- integer/rational/surd answer representation;
- one/two fractions;
- denominator exclusion and extraneous-root rejection;
- rational/repeated/irrational/no-real quadratic root state;
- Banking relation output;
- inequality operator / endpoint inclusion;
- minimum vs maximum;
- absolute-value inside/outside interval;
- QC relation output;
- DS verdict output;
- caselet/mixed-synthesis packaging.

---

## 6. Freeze gate after this matrix

Before allocating permanent IDs:

1. normalize source fixtures against `F-C001..F-C040`;
2. run final missing-family search against this 40-contract list;
3. confirm no retained contract is evidence-free;
4. confirm all MOVE / ENGINE_ONLY / COMPOSITION decisions remain intentional;
5. then allocate permanent QL IDs in stable order.

Question Studio, Question Bank, test and public release remain locked until those subsequent gates pass.
