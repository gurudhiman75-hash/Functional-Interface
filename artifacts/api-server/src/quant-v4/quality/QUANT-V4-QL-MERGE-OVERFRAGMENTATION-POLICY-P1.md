# Quant V4 QL Merge / Over-Fragmentation Policy — P1

## Purpose

A Question Language (QL) should represent a genuinely useful learner-facing form of a mathematical contract. It should not exist only because the same mathematics was wrapped in a different memo, notice, register, report, schedule, ledger, or similar documentary noun.

The goal is not to minimize wording variety. The goal is to keep **meaningful exam variety** while removing artificial authoring fragmentation that makes large generated batches sound synthetic.

## Mathematical contract

For this checkpoint, two QLs belong to the same mathematical contract when they share:

- package;
- canonical problem ID;
- task kind;
- answer type;
- required variable set; and
- difficulty band.

Different QLs inside one contract may still be valid when they represent genuinely different exam forms or contexts. However, a large cluster is a review signal rather than proof of useful coverage.

## P1 rules

1. **Exact learner-stem duplicates across different QL IDs are not allowed.**
2. **A single mathematical contract should normally expose no more than four active English QLs.** More than four is treated as over-fragmentation and must be reviewed.
3. **Documentary wrappers are not a valid reason to keep a redundant QL.** Words such as `memo`, `notice`, `register`, `report`, `record`, `schedule`, `ledger`, `sheet`, `circular`, `bulletin`, `log`, and `timetable` may occur when the document is natural to the actual exam situation, but they must not be manufactured simply to make a clone look different.
4. **Prefer one direct exam form plus a small number of meaningful contextual forms.** Do not create five near-identical QLs merely to inflate library size.
5. **Do not manufacture explanation diversity for QLs that are mathematically identical.** If two QLs require the same working, identical working can be correct; the duplication belongs in this QL audit.
6. **Preserve backward compatibility while reducing default-generation fragmentation.** If legacy QL IDs need to remain addressable for traceability, they may be retained as non-default/legacy aliases rather than deleted immediately.

## What this checkpoint audits first

P1 statically audits the mature learner-surface packages currently covered by the Quant V4 quality workflow:

- `PCT-001`
- `PCT-002`
- `RAP-001`

The diagnostic artifact records exact duplicate templates, over-fragmented mathematical contracts, documentary-wrapper concentration, QL IDs, and representative stems so remediation can target the actual bank rather than guessed examples.

## Editorial direction

When a contract is over-fragmented, prefer this order:

1. keep the strongest direct exam stem;
2. keep up to a few genuinely different exam contexts if they add useful reading variety;
3. retire or alias superficial paraphrases;
4. remove synthetic documentary wording instead of replacing one artificial wrapper with another.

The audit is intentionally stricter than the older clone-cleanup approach that diversified clone blocks through labels such as memos, notices, registers, and reports. That approach improved exact-string diversity but did not reliably improve exam realness.

This policy file is also part of the Quant-path CI trigger so the first stacked #14 run evaluates the actual current bank immediately.