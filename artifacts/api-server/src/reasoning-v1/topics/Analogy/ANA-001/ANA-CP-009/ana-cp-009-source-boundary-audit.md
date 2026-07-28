# ANA-CP-009 Advanced / Meta Analogy — Source Boundary Audit

Status: **SOURCE BOUNDARY AUDITED — NO QL COUNT OR IDS ASSIGNED**.

## 1. Purpose

ANA-CP-009 is not a catch-all for difficult mixed analogy questions. It owns analogy contracts in which the answer cannot be obtained by applying one stable pair-local transformation already owned by ANA-CP-003 through ANA-CP-008.

A candidate belongs here only when the visible evidence requires at least one of the following:

- a transformation parameter that changes systematically across complete pairs;
- interpolation or extrapolation from two complete pair relations;
- a coupled invariant spanning letters and numbers rather than independent component operations;
- a meta-rule that selects or derives the pair-local rule itself;
- another source-backed advanced relation that cannot be represented honestly inside an earlier checkpoint.

The provisional CP-009 reservation is `ANA-QL-251..274`, but this audit assigns **zero** permanent IDs.

## 2. Confirmed ownership boundary

The following framing alone does **not** make a question CP-009:

```text
A : B :: C : D :: E : ?
```

If the same fixed letter vector and the same fixed whole-number operation apply independently to every pair, the question remains a normal pair-transfer relation. Multiple complete pairs merely provide more evidence.

Examples discovered in current SSC mirrors that remain pair-local include:

- `RA140 : PX420 :: CX238 : AU714 :: NL94 : LI282`
  - letters `−2, −3`;
  - number `×3`;
- `AZ205 : CB112 :: CB200 : ED107 :: XM999 : ZO906`
  - both letters `+2` cyclically;
  - number `−93`;
- `AJ150 : YH243 :: KG300 : IE393 :: SL310 : QJ403`
  - both letters `−2` cyclically;
  - number `+93`;
- `QF20 : RH40 :: LX15 : MZ30 :: GP12 : HR24`
  - stable two-letter movement;
  - number `×2`;
- `MM167 : LP67 :: LL197 : KO97 :: NN207 : MQ107`
  - stable letter vector `−1, +3`;
  - number `−100`.

These may inform future CP-008 context expansion or source review, but they are **not** CP-009 authorities merely because three pairs are displayed.

## 3. Candidate A — cross-pair changing vector

Official-paper fixture mirrored by Testbook:

```text
ZKX102 : UHW204 :: XYR126 : ? :: LST305 : QPI610
Published answer: OVU252
Published options: OWU252, OUU232, OVU252, UVO242
```

The number operation is stable:

```text
102 × 2 = 204
126 × 2 = 252
305 × 2 = 610
```

The recovered letter movements are:

```text
ZKX → UHW = −5, −3, −1
XYR → OVU = −9, −3, +3
LST → QPI = +5, −3, −11
```

In canonical forward cyclic shifts, these are:

```text
[21, 23, 25]
[17, 23,  3]
[ 5, 23, 15]
```

Each vector is a modular arithmetic progression with:

```text
start: 21, 17, 5
step:   2,  6, 18
```

A compact candidate explanation therefore exists:

```text
vector step: 2 → 6 → 18       (×3 modulo 26)
start decrement: 4 → 12       (×3)
number: ×2
```

That candidate produces `OVU252`.

### Formal canonicalization result

The two complete anchor vectors do not uniquely force the candidate explanation.

A bounded audit enumerated modular recurrences in which:

1. each three-position vector is an arithmetic progression modulo 26;
2. one fixed modular multiplier advances the vector step;
3. the same multiplier advances the decrement in the vector start;
4. both displayed anchor vectors are reproduced exactly.

Six recurrences survive. They produce four different middle targets:

```text
OVU252
BIH252
AVI252
NIV252
```

Only `OVU252` appears among the published options. The option set therefore selects the published answer, but the anchor pairs do not independently establish one target under the bounded grammar class.

### Current verdict

**Quarantine as an option-dependent meta-rule.**

The fixture remains genuinely cross-pair and does not delegate to CP-008. However, it cannot become a permanent CP-009 authority because ExamTree requires option-independent single-correctness.

The mechanical proof is maintained in:

- `provisional-changing-vector-canonicalization.ts`;
- `provisional-changing-vector-canonicalization.test.ts`;
- `ana-cp-009-changing-vector-canonicalization-result.md`.

Re-admission requires an official rule statement, a second recurring fixture using the same exact grammar, or another visible condition that removes the competing targets before options are considered.

## 4. Candidate B — coupled invariant relation

SSC CHSL mirror fixture:

```text
SL23 : RY11 :: MB39 : HS27 :: EW26 : ?
Published answer: CK40
Published options include: BL40, CK44, CK40, BL44
```

The available prose describes:

```text
position(letter 1) + position(letter 2) + number = 54
```

for each complete cluster, together with a relationship between the two letter movements inside each input-output pair.

### Formal pilot result

The non-QL pilot enumerated every admissible movement step under the recoverable prose. It proved that:

- 25 target outputs satisfy the stated invariant and movement relationship;
- `CK40` satisfies the rule with one movement step;
- `BL40` also satisfies the rule with a different movement step;
- both `CK40` and `BL40` appear in the published option set;
- the source-pair movement steps do not uniquely derive the target step through a simple progression.

### Current verdict

**Quarantine as an ambiguous fixture.**

The available source description is insufficient for a single-correct ExamTree generator. The fixture may be reconsidered only after the missing diagram, condition or authoritative explanation is recovered.

The mechanical proof is maintained in:

- `provisional-coupled-invariant-pilot.ts`;
- `provisional-coupled-invariant-pilot.test.ts`;
- `ana-cp-009-coupled-invariant-pilot-result.md`.

## 5. Inverse-presentation boundary

Some official questions ask for the missing **input** cluster rather than the missing output, for example:

```text
ZWX42 : BBD84 :: ALP61 : CQV122 :: ? : LMT92
```

Inverse presentation does not automatically imply CP-009. If one stable pair-local transform is invertible, the solve contract is an inverse presentation of the authority that owns that transform.

Current policy:

- inverse presentation remains deferred until its own source and ambiguity audit;
- it must not be mixed into CP-009 only because the blank appears on the left;
- if later admitted, ownership follows the underlying rule, with presentation mode recorded separately.

## 6. Legacy 24-QL allocation boundary

The original design reserved 12 family labels and 24 CP-009 placeholders before the earlier checkpoints were saturated. The complete supersession audit is recorded in:

- `ana-cp-009-legacy-allocation-audit.md`;
- `legacy-allocation-boundary.ts`;
- `legacy-allocation-boundary.test.ts`.

Its result is:

- 8 historical families delegate to existing numeric, word, mixed or semantic authorities;
- 3 are presentation contracts rather than solve authorities;
- only the generic conditional-branch label remains a possible CP-009 direction, and it is blocked at `SOURCE_GAP` because no recurring source fixture or formal branch contract has been established;
- none of the historical QL numbers or counts survives into the current `ANA-QL-251..274` window.

## 7. Provisional CP-009 taxonomy

| Candidate family | Current status | Reason |
|---|---|---|
| changing parameter across complete pairs | quarantined as option-dependent | bounded anchor-compatible recurrences produce four targets; options alone select the published answer |
| coupled letter-number invariant | quarantined as ambiguous | formal pilot found multiple valid published options under the available prose |
| visible conditional branch selecting a rule | `SOURCE_GAP` | no recurring fixture or branch grammar is established |
| stable vector plus stable arithmetic shown in three pairs | delegate to CP-008 | pair-local rule; extra pair is only more evidence |
| inverse blank with stable pair rule | presentation audit pending | ownership follows underlying authority, not blank position |
| odd/incorrect pair selection | presentation of underlying authority | format does not define CP-009 |
| Coding-Decoding grammar or table recovery | prohibited | owned by Coding-Decoding |
| progressive sequence rather than relation transfer | prohibited | owned by Series |

## 8. Safety decision

This audit creates no production generator, no Question Logic, no permanent IDs, no locale templates and no Question Studio exposure.

The next safe step is continued source recovery for a genuinely unique changing-parameter family. CP-009 remains at zero QLs until a family passes source recurrence, formal solver, ambiguity and option-yield audits without relying on the answer options for uniqueness.
