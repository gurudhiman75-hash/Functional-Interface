# NUM-CP-012 — Permanent Allocation and English Freeze

## Decision

Final source saturation retained **11 permanent solve authorities** from the 14 discovery prototypes. Permanent identities are allocated contiguously:

```text
NUM-QL-226 .. NUM-QL-236
```

The next free Number System identity is therefore **`NUM-QL-237`**.

## Authority map

| QL | Authority | Scope |
|---|---|---|
| NUM-QL-226 | AUTH-001 | Perfect-power recognition, claim and terminal-compatibility rejection |
| NUM-QL-227 | AUTH-002 | Exact integer root with zero/one/signed-domain/no-root handling |
| NUM-QL-228 | AUTH-003 | Least multiplier for perfect-power completion |
| NUM-QL-229 | AUTH-004 | Least divisor for perfect-power reduction |
| NUM-QL-230 | AUTH-005 | Missing exponent and bounded inverse solution topology |
| NUM-QL-231 | AUTH-006 | Greatest perfect-power divisor |
| NUM-QL-232 | AUTH-007 | Count perfect powers in a bounded interval |
| NUM-QL-233 | AUTH-008 | Least additive adjustment to adjacent perfect-power boundary |
| NUM-QL-234 | AUTH-009 | One-sided perfect-power value under a bound |
| NUM-QL-235 | AUTH-010 | Nearest perfect-power value |
| NUM-QL-236 | AUTH-011 | Least perfect-power multiple value |

## English freeze rules

- exact integer arithmetic only; no floating-point root authority;
- square/cube/general `k` parameterisation is used only where the learner algorithm is unchanged;
- non-negative even roots use the principal non-negative learner answer;
- negative odd powers preserve the negative exact root;
- negative even-power targets return `NO_INTEGER_ROOT` when integer roots are requested;
- multiplier `1`, divisor `1`, and additive completion `0` are valid already-complete states;
- nearest integer perfect-power ties are not generated because consecutive integer kth powers have odd gaps;
- terminal patterns are rejection-only evidence and never sufficient proof of exact perfect-power status;
- complete bounded inverse sets are enumerated before collapsing to none/one/multiple class;
- explanations remain human-readable and state what is asked, what invariant is used, the necessary calculation, and the final answer.

## Ownership preserved

- square/cube divisor count → CP005;
- requested remainder → CP008;
- requested terminal digits → CP009;
- Data Sufficiency → DSF-001;
- surd manipulation → Surds & Indices;
- polynomial identities → Algebra;
- area/volume interpretation → Mensuration;
- independently essential multi-engine hybrids → CP014 after ablation.

## Lifecycle after English freeze

English is frozen for internal review authority, but all downstream gates remain closed:

- `active = false`
- `questionStudioDiscoverable = false`
- `questionBankWritable = false`
- `testEligible = false`
- `publiclyPublishable = false`

Hindi/Punjabi localization and shared Question Studio review integration are separate subsequent gates.
