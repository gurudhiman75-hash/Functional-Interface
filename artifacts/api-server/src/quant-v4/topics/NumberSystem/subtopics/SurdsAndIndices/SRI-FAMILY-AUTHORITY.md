# SRI Family Authority

**Student-facing chapter:** Surds & Indices  
**Runtime packages:** `SRI-001`, `SRI-002`  
**Permanent QLs:** 0  
**Status:** Phase-0 discovery authority; subordinate to `SRI-END-TO-END-DESIGN-R1`.

## Package ownership

### `SRI-001 — Indices, Exponents & Power Structure`

- `SRI-CP-001` integer indices and core laws;
- `SRI-CP-002` zero, negative and fractional indices plus real-domain validity;
- `SRI-CP-003` compound power expressions and base harmonisation;
- `SRI-CP-004` transformed exponential values and parameter recovery;
- `SRI-CP-005` exponential equations where exponent structure is the tested burden;
- `SRI-CP-006` comparison, ordering and statement reasoning with powers.

### `SRI-002 — Surds, Radicals & Rationalisation`

- `SRI-CP-007` surd form, simplification and rationality;
- `SRI-CP-008` arithmetic with surds and radical identities;
- `SRI-CP-009` rationalisation and conjugates;
- `SRI-CP-010` nested surds and denesting;
- `SRI-CP-011` transformed surd values, bounded radical equations, exact comparison and bounds;
- `SRI-CP-012` mixed surd-index synthesis, only after ordinary engines are stable.

## Dominant-burden rule

The notation does not determine ownership. The mathematical burden does.

| Example | Owner |
|---|---|
| simplify `2^5 × 2^-3` | SRI |
| rationalise `5/(3+√2)` | SRI |
| denest `√(8+2√15)` | SRI |
| solve `2^(x+1)+2^x=48` | SRI if exponent factoring is the dominant skill |
| `x+1/x=5`; find `x²+1/x²` | Algebra |
| roots of a quadratic happen to contain a surd | Algebra |
| `7^103 mod 10` / last digit / remainder cycle | Number System |
| long BODMAS or approximation containing roots/powers | Simplification & Approximation |
| sufficiency of two statements for finding an exponent | Data Sufficiency wrapper; SRI supplies capability only |
| diagonal/height theorem question with surd answer | Geometry/Mensuration/Trigonometry by tested burden |

## Shared-engine rule

Every retained checkpoint must consume the shared exact primitives in `quant-v4/shared/surds-indices` where applicable. A checkpoint must not silently create a second implementation of:

- rational arithmetic;
- rational-exponent normalization;
- prime-power normal form;
- real-domain checks;
- perfect-power extraction;
- square-surd canonicalization;
- surd-sum equality;
- conjugation/rationalisation;
- denesting;
- exact comparison/bounds.

## Legacy rule

`NS-EXP-001` and `NS-SURD-001` are migration evidence only. Their CP/QL identifiers, counts, maturity labels and educational language do not become SRI production authority automatically.

## Mixed synthesis rule

`SRI-CP-012` remains blocked until `SRI-CP-001..011` ordinary engines required by a candidate are individually stable. Mixed synthesis must test a genuine interaction, not manufacture Hard questions by stacking unrelated operations.
