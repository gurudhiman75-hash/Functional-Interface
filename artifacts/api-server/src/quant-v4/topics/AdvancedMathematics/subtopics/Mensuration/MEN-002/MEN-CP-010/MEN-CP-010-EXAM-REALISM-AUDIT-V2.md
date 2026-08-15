# MEN-CP-010 — Exam Realism Audit V2

Authority: `MEN-CP010-EXAM-REALISM-AUDIT-V2`

## Decision

The V1 permanent English freeze was mathematically sound and substantially editorially improved, but it was **not sufficient as the final competitive-exam realism gate**.

The setter-level V2 audit found:

1. one concrete worked-solution defect in a `π = 3.14` conical-frustum state;
2. an over-formulaic question mix compared with SSC pyramid previous-paper patterns;
3. missing chained representations inside existing permanent reasoning families;
4. a source-coverage audit blind spot: ledger/merge evidence could be counted as represented even when it was not routed by the permanent runtime;
5. no explicit exam-profile weighting, which risked treating CP-010 as equally relevant to SSC, banking and Punjab-state blueprints.

## Benchmark conclusion

### SSC

CP-010 is an SSC-relevant solid-mensuration checkpoint, especially for regular right pyramids and selected frustum questions.

Previous-paper patterns used as realism anchors include:

- square base + vertical height -> face slant height -> LSA/TSA;
- square base + face slant/slant edge -> vertical height -> volume;
- triangular-base pyramid volume;
- total-surface/base-area evidence -> slant -> vertical height -> volume;
- plane parallel to pyramid base -> similar top pyramid -> volume complement/ratio;
- prism:pyramid same-base/same-height comparison;
- conical-frustum direct volume with clean `π = 22/7` arithmetic;
- independent percentage changes of square-base side and vertical height.

### Banking

Current mainstream banking quant emphasis is much stronger on cylinders, cones and spheres than on pyramid/frustum families. CP-010 therefore remains available to custom/manual blueprints but receives **zero default banking weight** in this V2 profile.

### Punjab state

Current Punjab-state quant evidence used for this audit is dominated by 2D mensuration, land measures and basic common solids rather than pyramid/frustum chains. CP-010 therefore receives **zero default Punjab-state weight** unless a specific exam blueprint later provides direct evidence.

## Gap remediation

The permanent identity map remains `MEN-002-QL-124..MEN-002-QL-149`; no artificial QLs are added.

V2 adds exam-facing representations inside existing reasoning families:

| QL | Added exam-realism representation |
|---|---|
| `MEN-002-QL-124` | equilateral-base volume; square-diagonal base recovery; face-slant -> vertical height -> volume; slant-edge -> vertical height -> volume; TSA/base-share -> volume |
| `MEN-002-QL-128` | base side + vertical height -> face slant -> LSA/TSA |
| `MEN-002-QL-129` | clean SSC-style conical-frustum volume with `π = 22/7` |
| `MEN-002-QL-130` | open lampshade/frustum sheet area |
| `MEN-002-QL-131` | parallel-cut square pyramid -> full-minus-removed frustum volume |
| `MEN-002-QL-136` | parallel-cut pyramid -> lower-frustum:top-pyramid volume ratio |
| `MEN-002-QL-141` | concrete conical-frustum parent-cone height reconstruction |
| `MEN-002-QL-143` | realistic bucket-capacity range |
| `MEN-002-QL-145` | independent base-side and vertical-height percentage changes |

## π = 3.14 defect

V1 used an alternation that matched the integer prefix `3` before the decimal alternative in `3.14`. The final answer remained verified because the source generator was correct, but the learner-facing substitution could show `3 × ...` while reporting the `3.14` answer.

V2 changes the parser to prefer decimal values before fraction/integer alternatives and adds a generated regression search that must find a `π = 3.14` state and prove the worked substitution contains `3.14`.

## Coverage-audit correction

The V1 proof exercised every source declared by the permanent runtime, but that declaration was narrower than the discovery/merge evidence.

V2 explicitly audits all executable discovery rows:

- Wave 02 executable rows must be direct runtime sources or named V2 replacements;
- Wave 03 executable rows must be direct runtime sources;
- selected non-executable design representations with exam value must have named V2 replacements.

The three Wave-02 executable representations absent from V1 runtime routing are closed as follows:

```text
CP010-D2-SIMILAR-FRUSTUM-FULL-MINUS-CUT
  -> EXAM-V2-SQUARE-FRUSTUM-FULL-MINUS-CUT

CP010-D2-APP-LAMPSHADE-AREA
  -> EXAM-V2-FRUSTUM-LAMPSHADE-SHEET-AREA

CP010-D2-APP-PYRAMID-TENT-CANVAS
  -> EXAM-V2-PYRAMID-SURFACE-FROM-VERTICAL-HEIGHT
```

The third replacement deliberately strengthens the reasoning burden beyond direct canvas substitution by requiring the candidate to recover face slant height first.

## Human-review gate

V2 expands the setter artifact from 104 to **208 English questions**:

```text
26 QLs × 8 review states = 208
A = 52
B = 52
C = 52
D = 52
```

The review must include both inherited/base and exam-realism sources, distinct stems, worked calculations, realistic bucket capacity, clean SSC frustum arithmetic and all named V2 sources.

## Exam-profile policy

Each permanent QL now carries an external exam-realism profile without changing its permanent identity.

```text
SSC:          weighted CORE / STANDARD / EXTENDED / ENRICHMENT
Banking:      default weight 0 for CP-010
Punjab state: default weight 0 for CP-010
```

This is a blueprint-selection policy only. It does not delete any valid family.

## Lifecycle boundary

This audit/remediation is **not product activation**.

The following remain mandatory:

```text
active: false
questionStudioDiscoverable: false
questionBankStatus: NOT_STORED
testEligibility: INELIGIBLE
publiclyPublishable: false
```

Question Studio activation remains a separate gate after V2 proof and human evidence review.
