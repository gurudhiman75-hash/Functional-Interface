# SAP Final Permanent-Allocation / Freeze Proposal — 2026-08-16

**Proposal status:** `READY_FOR_PRODUCT_OWNER_DECISION`  
**Source saturation:** `TRUE`  
**Applied:** `FALSE`  
**Activation/publication:** `FALSE`

This document proposes the final permanent identity map after E1, E2 and E3. It does **not** allocate IDs, change lifecycle flags, merge branches, activate Question Studio, write to the question bank, enable tests, or publish content.

## 1. Fixed boundary already approved

The product-owner freezes already pin:

- CP004–CP008: `SAP-QL-053..146`
- CP009: `SAP-QL-147..165`
- last allocated/frozen coordinate: `SAP-QL-165`
- next historically available coordinate: `SAP-QL-166`

Those existing permanent coordinates are retained. E3 found no reason to renumber them.

## 2. Allocation principle

The proposal uses three rules:

1. **Preserve mature provisional coordinate evidence where possible.** CP010 has been reviewed repeatedly under proposed coordinates `SAP-QL-166..182`; renumbering all 17 identities would add risk without learner benefit.
2. **Do not silently widen a frozen learner identity when the post-freeze work explicitly introduced a new learner contract.** The four E1 `ADD` candidates receive new permanent coordinates.
3. **Do not create a new QL for representation-only E3 expansions.** E3 topologies merge into the governing learner identity because the solve inference is unchanged.

## 3. CP010 — preserve proposed `SAP-QL-166..182`

| Permanent QL | Final learner identity |
|---|---|
| SAP-QL-166 | Square-root interval from nearby perfect squares |
| SAP-QL-167 | Cube-root interval from nearby perfect cubes |
| SAP-QL-168 | Bounded higher-root interval |
| SAP-QL-169 | Nearest integer square root |
| SAP-QL-170 | Nearest integer cube root |
| SAP-QL-171 | Greatest lower / least upper integer root bound |
| SAP-QL-172 | Small decimal power estimate |
| SAP-QL-173 | Percentage power-factor estimate |
| SAP-QL-174 | Reciprocal near an integer benchmark |
| SAP-QL-175 | Approximate product of roots |
| SAP-QL-176 | Approximate quotient of roots |
| SAP-QL-177 | Mixed bounded power-root estimate |
| SAP-QL-178 | Missing radicand under nearest-integer root |
| SAP-QL-179 | Missing base under bounded approximate power |
| SAP-QL-180 | **Nearest option for a power estimate** |
| SAP-QL-181 | Compare approximate root and power values |
| SAP-QL-182 | Diagnose a wrong root benchmark |

### CP010 anti-duplication correction

The old QL180 wording was “nearest option for a root or power estimate.” E1 removed its duplicate ROOT branch. Final QL180 is POWER-only; root-nearest work remains under the dedicated root-nearest identities. This changes the representation matrix, not the coordinate sequence.

## 4. Four E1 post-freeze learner contracts — `SAP-QL-183..186`

These were explicitly introduced as `E1_PROVISIONAL_UNALLOCATED` new learner contracts after the earlier product-owner freezes. They should not be hidden inside already-frozen identities.

| Permanent QL | Checkpoint | Candidate | Proposed final title | Reason for separate identity |
|---|---|---|---|---|
| SAP-QL-183 | CP004 | `SAP-CP004-E1-CAND-NESTED-ADDITIVE-EXACT-RADICAL` | Nested additive exact radical chain | Requires repeated inside-out `root → add → root` evaluation, beyond the frozen nested-perfect-root representation |
| SAP-QL-184 | CP005 | `SAP-CP005-E1-CAND-NUMERIC-PARTIAL-FRACTION-TELESCOPING` | Numeric partial-fraction telescoping sum | Requires first decomposing `1/[k(k+1)]` before endpoint cancellation; this is an added structural route, not merely another direct telescoping display |
| SAP-QL-185 | CP007 | `SAP-CP007-E1-CAND-ROUND-TO-SIGNIFICANT-FIGURES` | Round a number to declared significant figures | Significant-figure counting is not owned by frozen QL113–128, which cover place/decimal rounding, reverse intervals and rounding error |
| SAP-QL-186 | CP010 | `SAP-CP010-E1-CAND-SUPPLIED-ROOT-SCALING` | Scale a supplied approximate root value | Learner must extract an exact square scale and reuse a supplied root approximation; distinct from estimating the root independently |

Production note: QL184 and QL186 remain specialist/low-frequency routes even if frozen as permanent identities.

## 5. CP011 — proposed `SAP-QL-187..198`

| Permanent QL | E2 structure | Final learner identity |
|---|---|---|
| SAP-QL-187 | `CP011-E2-CLOSEST-MIXED-EXPRESSION` | Closest option for a mixed approximate expression |
| SAP-QL-188 | `CP011-E2-CLOSEST-FRACTION-PRODUCT` | Closest option for a fraction-product estimate |
| SAP-QL-189 | `CP011-E2-NEAREST-MULTIPLE-TEN` | Nearest multiple after approximation |
| SAP-QL-190 | `CP011-E2-CLOSEST-ROOT-OPTION` | Closest option for an approximate root expression |
| SAP-QL-191 | `CP011-E2-ABSOLUTE-ERROR` | Absolute error of an estimate |
| SAP-QL-192 | `CP011-E2-PERCENTAGE-ERROR` | Percentage error of an estimate |
| SAP-QL-193 | `CP011-E2-OVER-UNDER-DIRECTION` | Overestimate / underestimate direction |
| SAP-QL-194 | `CP011-E2-COMPARE-ESTIMATE-ACCURACY` | Compare the accuracy of two estimates |
| SAP-QL-195 | `CP011-E2-COMPOSED-ROUNDING-BOUND` | Tight bound from multiple rounded terms |
| SAP-QL-196 | `CP011-E2-OPTION-WITHIN-TOLERANCE` | Select the option inside a stated tolerance |
| SAP-QL-197 | `CP011-E2-GUARANTEED-NEAREST-FROM-INTERVAL` | Guaranteed nearest option from an interval |
| SAP-QL-198 | `CP011-E2-AMBIGUOUS-OPTION-DIAGNOSIS` | Diagnose when no unique nearest option is guaranteed |

CP011 formal bound/error identities may remain low-weight in normal production; permanent identity does not imply equal mock-test frequency.

## 6. CP012 — proposed `SAP-QL-199..211`

| Permanent QL | E2 structure | Final learner identity |
|---|---|---|
| SAP-QL-199 | `CP012-E2-MISSING-ADDEND-MIXED` | Approximate missing addend in a mixed equation |
| SAP-QL-200 | `CP012-E2-MISSING-MULTIPLIER` | Approximate missing multiplier |
| SAP-QL-201 | `CP012-E2-MISSING-DIVISOR` | Approximate missing divisor |
| SAP-QL-202 | `CP012-E2-MISSING-SQUARE-ROOT` | Recover a missing value from a square relation |
| SAP-QL-203 | `CP012-E2-MISSING-CUBE-ROOT` | Recover a missing value from a cube relation |
| SAP-QL-204 | `CP012-E2-MISSING-ROOT-RATIO` | Reverse a root-ratio approximation |
| SAP-QL-205 | `CP012-E2-MISSING-PERCENTAGE` | Recover a missing percentage approximately |
| SAP-QL-206 | `CP012-E2-TWO-SIDED-MIXED-EQUATION` | Reverse a two-sided mixed approximate equation |
| SAP-QL-207 | `CP012-E2-UNIQUE-INTEGER-WITHIN-TOLERANCE` | Unique integer satisfying an approximation tolerance |
| SAP-QL-208 | `CP012-E2-COUNT-ADMISSIBLE-INTEGERS` | Count admissible integers in an approximation band |
| SAP-QL-209 | `CP012-E2-OUTCOME-CLASSIFICATION` | Classify an approximation band as unique / multiple / impossible |
| SAP-QL-210 | `CP012-E2-ROUNDED-OPERAND-SYNTHESIS` | Recover the exact possible interval of a rounded operand |
| SAP-QL-211 | `CP012-E2-MIXED-ROOT-POWER-SYNTHESIS` | Mixed root/power reverse-approximation synthesis |

### E3 merge into CP012

`CP012-E3-EXPLICIT-POWER-REVERSE-SYNTHESIS` does **not** consume another permanent coordinate. Its three source-backed modes merge into QL211:

- `POWER_CHAIN`
- `POWER_ROOT_CHAIN`
- `MISSING_EXPONENT`

They change representation/unknown placement while preserving the same governing reverse-synthesis inference.

The E3 editorial correction to unique-integer tolerance belongs to QL207.

## 7. E3 CP004 representation expansion — no new coordinate

The following E3 source topologies update the representation matrix of the existing CP004 exact-root authority without creating new learner identities:

- heterogeneous sixth/fourth/cube/square-root arithmetic;
- quotient of exact terminating-decimal roots.

Recommended ownership: the existing exact-root mixed-arithmetic authority (principally frozen QL061), with decimal exact-root representation also retained in the existing CP004 exact-root matrix. This is an explicit representation expansion to be recorded in the final freeze evidence; it is not silent scope drift.

## 8. Final proposed permanent range

If the product owner approves this proposal:

```text
already frozen through: SAP-QL-165
CP010 preserved:        SAP-QL-166..182   (17)
E1 additions:           SAP-QL-183..186   (4)
CP011:                  SAP-QL-187..198   (12)
CP012:                  SAP-QL-199..211   (13)
-----------------------------------------------
new identities: 46
final highest QL: SAP-QL-211
next available QL: SAP-QL-212
```

The full chapter would then have a contiguous permanent coordinate sequence through QL211 while preserving all pre-existing frozen IDs.

## 9. What “freeze” should mean at the next gate

If approved, the next implementation should perform an **identity/content freeze only**, matching the earlier SAP freezes:

- allocate the proposed permanent QL IDs;
- pin exact reviewed source heads/artifact digests;
- pin E1/E2/E3 merge/representation decisions;
- keep every delivery lifecycle flag OFF;
- do not enable translations automatically;
- do not expose Question Studio or Question Bank;
- do not mark test-eligible or publicly publishable;
- do not merge to a production branch unless separately authorized.

A later activation/integration gate should remain separate from content freeze.

## 10. Decision requested

**Recommended:** approve the coordinate map above and authorize creation of a dedicated inactive permanent-freeze branch/authority for `SAP-QL-166..211`.

Until that explicit approval is given:

```text
PERMANENT_ALLOCATION_166_211 = NOT_APPLIED
FINAL_CONTENT_FREEZE_166_211 = NOT_APPLIED
QUESTION_STUDIO = OFF
QUESTION_BANK_WRITE = OFF
TEST_ELIGIBLE = OFF
PUBLIC = OFF
MERGE_AUTHORIZATION = FALSE
```
