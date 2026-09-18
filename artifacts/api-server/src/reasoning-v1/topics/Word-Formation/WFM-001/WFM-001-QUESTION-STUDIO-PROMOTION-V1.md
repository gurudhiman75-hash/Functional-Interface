# WFM-001 — Question Studio Promotion V1

Status: **controlled review integration candidate**

Product code: `REAS-WFM`  
Chapter: `WFM-001 — Word Formation`  
QLs: `WFM-QL-001..004`  
Checkpoints: `WFM-CP-001..003`

## Promotion scope

The approved WFM V2 content/runtime is promoted into the shared Reasoning V1 Question Studio **for review only**.

One package owns the whole chapter:

```text
packageId = WFM-001
  -> WFM-QL-001
  -> WFM-QL-002
  -> WFM-QL-003
  -> WFM-QL-004
```

No duplicate per-QL packages are created.

## Visibility model

The shared review wrapper is visible:

- `questionStudioVisible = true`
- registered in `question-studio-review-registry.ts`
- deterministic preview supported
- `en-IN`, `hi-IN`, `pa-IN`
- Easy / Medium / Hard
- SSC/Punjab four-option profiles

The raw runtime remains directly non-discoverable:

- runtime metadata `questionStudioVisible = false`
- the Studio wrapper explicitly overlays review visibility
- this prevents direct runtime use from being confused with approved learner delivery

## Release locks

This promotion does **not** authorize downstream delivery:

- Question Bank writable: `false`
- test eligible: `false`
- mock-test eligible: `false`
- publicly publishable: `false`
- automatic student publication: `false`
- generic Question Studio persistence: throws / fails closed

A later authorization must deliberately define persistence, review status transitions, RBAC/audit behavior and downstream publication gates.

## Governance authority

Product ownership is governed by:

`REASONING-V1-TAXONOMY-AMENDMENT-WFM-001.md`

That amendment adds `REAS-WFM | Word Formation` to Family A and freezes the ownership boundaries against Alphabet Test, Dictionary Order and Coding-Decoding.

## Integration proof

The integration gate must prove:

1. exactly one shared WFM package is registered;
2. all four approved QLs are present and no `WFM-QL-005` is implicitly reserved;
3. all three checkpoints are reachable;
4. English, Hindi and Punjabi previews work;
5. all three difficulty bands work per QL;
6. deterministic replay is exact;
7. wrapper visibility is `true` while raw runtime visibility remains `false`;
8. Question Bank/test/mock/public locks remain false;
9. generic persistence is rejected;
10. current API build remains green.
