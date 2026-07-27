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
Answer: OVU252
```

The number operation is stable:

```text
102 × 2 = 204
126 × 2 = 252
305 × 2 = 610
```

The letter movements are not one stable pair-local vector:

```text
ZKX → UHW = −5, −3, −1
XYR → OVU = −9, −3, +3
LST → QPI = +5, −3, −11
```

The middle letter shift remains `−3`, while the first and third positions vary across the three relations.

### Current verdict

**Quarantine as an advanced/meta source fixture; do not admit a generative authority yet.**

Reason:

- the published answer is clear;
- the displayed anchor relations prove that the vector changes across pairs;
- the text-only explanation does not establish one unambiguous bounded progression under a canonical cyclic-shift representation;
- the first and third position sequences can be represented by multiple equivalent signed cyclic shifts;
- without the exact diagram logic or a recurring second fixture, a generator could encode an invented progression rather than the examination rule.

Required before admission:

1. recover the exact official or rendered solution diagram;
2. state one canonical shift representation;
3. prove the middle vector uniquely from both anchor vectors;
4. find at least one recurring fixture using the same meta-rule;
5. establish distractors that cannot be explained by a simpler pair-local rule.

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
- only the generic conditional-branch label remains a possible CP-009 direction, and it is quarantined because no recurring source fixture or formal branch contract has been established;
- none of the historical QL numbers or counts survives into the current `ANA-QL-251..274` window.

## 7. Provisional CP-009 taxonomy

| Candidate family | Current status | Reason |
|---|---|---|
| changing parameter across complete pairs | quarantine / investigate | genuinely meta, but current fixture is not generatively unambiguous |
| coupled letter-number invariant | quarantined as ambiguous | formal pilot found multiple valid published options under the available prose |
| visible conditional branch selecting a rule | source required | potentially meta, but no recurring fixture or branch grammar is established |
| stable vector plus stable arithmetic shown in three pairs | delegate to CP-008 | pair-local rule; extra pair is only more evidence |
| inverse blank with stable pair rule | presentation audit pending | ownership follows underlying authority, not blank position |
| odd/incorrect pair selection | presentation of underlying authority | format does not define CP-009 |
| Coding-Decoding grammar or table recovery | prohibited | owned by Coding-Decoding |
| progressive sequence rather than relation transfer | prohibited | owned by Series |

## 8. Safety decision

This audit creates no production generator, no Question Logic, no permanent IDs, no locale templates and no Question Studio exposure.

The next safe step is continued source recovery for a genuinely unique changing-parameter or visible conditional-branch family. CP-009 must remain at zero QLs until such a family passes source recurrence, formal solver, ambiguity and option-yield audits.
