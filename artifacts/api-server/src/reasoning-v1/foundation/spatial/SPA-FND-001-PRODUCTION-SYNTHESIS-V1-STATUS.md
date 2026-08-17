# SPA-FND-001 — Production Synthesis V1

## Status

`PROOF_PASSED_AWAITING_USER_APPROVAL`

This slice starts from the user-approved FSR-001 exact head `bf026fa1714cc927471db5aefdc05a33751cb440` and adds lifecycle-isolated deterministic candidate synthesis for FAN-001, FCL-001 and FSR-001.

## Scope

Production Synthesis V1 separates:

1. deterministic candidate construction;
2. independent chapter validation;
3. explicit rejection telemetry;
4. order-independent content deduplication;
5. delivery-order identity;
6. family / correct-slot scheduling;
7. editorial review export.

A failed seed returns a rejected attempt with a code and message. The batch scheduler may try a new seed only after recording that rejected attempt.

## Family authority

```text
FAN-001: 4 transform families
FCL-001: 12 primitive classification families
FSR-001: 10 approved series families
Total:   26 synthesis families
```

FCL production synthesis and the fixed FCL V2 proof use the same exported quartet builder, property authority and 17-descriptor competing-minority audit.

FSR production synthesis reuses the approved FSR proof generator, visible-role-aware rule inference and independent rendered-transition validator. Quarter-turn-sensitive primitives are used for the controlled production families so an extra hidden 90° transform cannot disappear inside a symmetric main figure.

FAN production synthesis reuses Primitive Library V2 instances and the shared complete transform authority. An asymmetric marker makes all transform candidates observable, and A→B is independently solved across the complete transform candidate set before C options are accepted.

## Identity model

`contentFingerprint` is exact and order-independent with respect to answer delivery. Shuffling the same four options does **not** create a new content item.

`deliveryFingerprint` includes ordered options and the correct option slot. It is intentionally separate from content identity.

The proof export shows SHA-256 digests of these exact fingerprints for compact traceability; deduplication itself uses the full semantic fingerprint strings.

## FCL production-quality remediation

The first technically green production search was not accepted. It produced 96 FCL candidates only after 1,080 attempts, including 983 ambiguity rejections. That proved the validator was working but exposed an inefficient blind-search architecture.

A compiled ambiguity-safe quartet catalog replaced blind random FCL search. The selected quartet is still passed through the full shared FCL builder, so the catalog is a prefilter rather than a validation bypass.

The first optimized green artifact was then rejected by manual editorial review because several logically valid quartets were too easy or semantically misleading to a student. Examples included:

- a symmetry question reducible to three closed figures versus one open figure;
- a standalone dot used as a full classification option;
- a divided square treated as “not a polygon” despite its obvious square outer boundary;
- a two-free-terminal question reducible to three open figures versus one closed figure;
- a partition question using an unrelated open stroke as the odd figure.

The production catalog was tightened with property-specific visual domains and a student-visible same-answer shortcut audit. The broad 17-descriptor audit remains active for different-minority ambiguity. Internal metadata such as fill capability or containment capability is not treated as a visible shortcut merely because it reinforces the intended option.

FCL scheduling is now capacity-aware. A low-capacity family stops at its honest strict-content limit; higher-capacity families absorb the remainder. Correct-answer slots remain scheduled globally and independently of family capacity.

### True-crossing presentation

The true-crossing family originally exposed raw symmetry as a same-answer shortcut. Production delivery now keeps all four options in the open, junction-bearing domain and adaptively shortens one or more outer line arms. After each shortening, whole-figure symmetry is recomputed. Delivery is accepted only after vertical, horizontal and 180° symmetry are all absent. Central junction/crossing points never move.

This presentation changes arm length only; branch-junction and true-crossing topology remain unchanged. The stress proof independently requires every delivered true-crossing option to classify as:

```text
vertical:       false
horizontal:     false
rotational180:  false
```

### Branch-junction domain

A later human audit found a triangle-with-median “no junction” option was semantically unsafe because a learner can reasonably see three strokes meeting at the apex. Production branch-junction synthesis is therefore restricted to open line figures only. The final representative quartet is Y / U / X / +, where the U-shape alone has no branch junction.

## Final implementation-head stress evidence

Implementation head:

`abdfbacfa0e527677e701b92dbfca5eb576d92de`

Workflow:

`Validate SPA-FND-001 Production Synthesis V1`

Run:

`31491863481` — PASS

Artifact:

```text
Name:    spa-production-synthesis-v1-review
ID:      9101349730
Digest:  sha256:131c5289fdb97d1833ae71523fb773df52b33f5a42bf2829bceba3e1adb4c319
```

Stress result:

```text
Accepted FAN candidates: 96
Accepted FCL candidates: 96
Accepted FSR candidates: 96
Total accepted:          288
Correct slots/chapter:   A24 / B24 / C24 / D24
Representative review:   26 samples (one per family)
```

Attempts/rejections:

```text
FAN: 98 attempts — 2 duplicate-content rejections
FCL: 144 attempts — 48 duplicate-content rejections
FSR: 102 attempts — 6 duplicate-content rejections
FCL ambiguity rejects: 0
FCL pool-shortage rejects: 0
```

Strict FCL catalog capacity at this implementation head:

```text
EVEN_SIDED_POLYGON       2
VERTICAL_SYMMETRY       32
HORIZONTAL_SYMMETRY      4
HALF_TURN_SYMMETRY       6
QUARTER_TURN_SYMMETRY    8
HAS_BRANCH_JUNCTION      5
HAS_TRUE_CROSSING        3
PARTITIONED_FIGURE       3
HALF_TURN_ONLY          28
TWO_FREE_TERMINALS       8
CLOSED_SHAPE            42
POLYGON                 17
```

Capacity-aware FCL allocation for the 96-candidate stress batch:

```text
EVEN_SIDED_POLYGON       2
VERTICAL_SYMMETRY       15
HORIZONTAL_SYMMETRY      4
HALF_TURN_SYMMETRY       6
QUARTER_TURN_SYMMETRY    8
HAS_BRANCH_JUNCTION      5
HAS_TRUE_CROSSING        3
PARTITIONED_FIGURE       3
HALF_TURN_ONLY          14
TWO_FREE_TERMINALS       8
CLOSED_SHAPE            14
POLYGON                 14
TOTAL                    96
```

## Manual editorial / visual review

The final implementation-head artifact was reviewed family-by-family at normal scale and at approximately 74px mobile option size.

Confirmed:

- all four FAN transform families preserve the complete visible transform and have distinct misconception-owned options;
- all ten FSR families remain clear, including both compound movement/rotation families;
- all twelve FCL representative families are visually legible and match their intended property;
- branch-junction delivery now stays in the open-line domain and is unambiguous;
- true-crossing delivery distinguishes crossing from an arrow-style junction while neutralizing whole-figure symmetry shortcuts;
- even-sided polygon options all expose a meaningful polygon side count;
- polygon classification no longer uses partitioned outer shapes as semantic “not polygon” near-misses;
- two-free-terminal questions stay in an open-line comparison domain;
- standalone internal symbols are not used as full production FCL options;
- partitioned-figure questions compare divided figures with an undivided closed figure rather than an unrelated open stroke;
- all representative diagrams remain legible at the mobile review size.

## Required checks

- deterministic replay from the same seed prefix;
- materially different output for a different seed prefix;
- no duplicate content fingerprints in an accepted chapter batch;
- answer-order changes excluded from content identity;
- delivery fingerprints remain order-sensitive;
- exact correct-slot balance;
- complete family coverage;
- strict capacity-aware FCL scheduling;
- FCL competing-minority ambiguity rejection;
- student-visible same-answer shortcut protection;
- true-crossing symmetry-neutralized delivery;
- representative responsive HTML/JSON review;
- complete previous spatial regression stack;
- lifecycle isolation.

Required marker:

`PASS_SPA_FND_001_PRODUCTION_SYNTHESIS_V1`

## Lifecycle lock

```text
Permanent QLs:                0
Question Studio discovery:    false
Question Bank writes:         false
Mock-test eligibility:        false
Public publication:           false
API/database schema changes:  none
```

The final documentation-only branch head must pass the same workflow before this slice is presented for user approval. This proof does not authorize merge, permanent QL allocation, Question Studio activation, database writes, localisation, mock-test eligibility or publication.
