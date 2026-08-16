# MEN-CP-013 — Merge/Split & Permanent Allocation V2

## Decision

Discovery is closed at 34 executable source forms. They consolidate into **15 permanent reasoning identities** rather than 34 shape/wording identities.

Permanent range: **MEN-002-QL-163..MEN-002-QL-177**.

## Permanent families

1. Composite volume — direct
2. Composite volume with derived component dimension
3. Composite exposed surface area
4. Removed / drilled material volume
5. Axis-aligned largest-inscribed containment
6. Diagonal/body-diagonal containment
7. Vacant space under containment
8. Static tank capacity
9. Direct displacement / level change
10. Inverse displacement — object count
11. Inverse displacement — object dimension
12. Inverse displacement — tank base area
13. Partial-fill final level
14. Overflow from remaining headroom
15. Containment followed by a secondary measure

## Merge rules

- Sphere/cube/cylinder object substitutions do not create new QLs when the governing displacement equation is unchanged.
- SSC/PYQ-style wording is evidence/representation, not identity.
- Cuboid versus cylindrical capacity is a base-area representation inside static capacity.
- Direct rise, direct fall, one object and multiple objects share one direct displacement family.
- Count, object-dimension and tank-base-area inverse forms remain separate because the unknown and inverse operation differ.
- Axis-aligned containment remains separate from body-diagonal containment.
- Composite total-height questions remain separate from direct composite volume because a component dimension must first be derived.
- Overflow remains separate from partial-fill final level because overflow requires a headroom comparison and an excess-volume result.

## Boundary

- Recasting/melting remains MEN-CP-012.
- Hollow/open/exposure-first geometry remains MEN-CP-011.
- Flow-rate/fill-empty rate problems remain outside MEN-CP-013.

## Lifecycle

This freezes **identity and solve mode only**. English implementation is not frozen. All product gates remain closed:

- active: false
- Question Studio: false
- Question Bank: NOT_STORED
- scored tests: INELIGIBLE
- public publication: false

The next gate is a permanent English runtime with source-forced proof and a source-complete setter review. In particular, the inverse tank-base-area family must receive broader numeric answer entropy before English freeze.
