# COD-001 — Editorial Approval Authority

Status: **APPROVED**

Approval date: **2026-07-28**

Approved scope:

- chapter: `COD-001 — Coding–Decoding`;
- checkpoints: `COD-CP-001..010`;
- permanent identities: `COD-QL-001..199`;
- locales: `en-IN`, `hi-IN`, `pa-IN`;
- question stems, options, answer keys, explanations and pedagogical presentation;
- final review corpus: 199 questions per locale, 597 review items total.

## Approval basis

The product owner approved COD-001 after reviewing the multilingual chapter corpus and the completed adversarial remediation. The accepted runtime includes:

- frozen evidence-backed QL ownership and solver boundaries;
- complete English, Hindi and natural-Punjabi coverage;
- `cod-001-pedagogy-v1` explanations with core rule, problem-specific steps, visual working, exam shortcut and common-trap analysis;
- clean Markdown exports with no raw JSON explanation dumps;
- all chapter, locale, pedagogy and production-build gates green.

## Effect of approval

COD-001 is now:

```text
Editorial review: approved
Runtime identity: frozen
Multilingual content: approved
Pedagogical presentation: approved
Integration readiness: ready for a separate guarded integration phase
```

This approval does **not** by itself enable:

- Question Studio visibility;
- Question Bank conversion;
- mock-test eligibility;
- public routing or publication.

Those surfaces remain disabled until an explicit integration instruction and a separate guarded integration PR.

## Change control

Any later change to a permanent QL identity, solve contract, answer authority, locale meaning, or student-facing pedagogy reopens the affected review scope and requires a new approval record. Pure integration work may consume the frozen runtime without changing its content authority.
