# RNK-CP-001 — Provisional Authority Review Runtime

Status: **English review runtime; permanent identity and product exposure blocked**.

## Purpose

The 13 executable discovery prototypes have consolidated into nine provisional authorities. This runtime exposes those authorities directly for human review without inventing `RNK-QL-*` identities.

Each authority call:

1. accepts a provisional authority ID and deterministic seed;
2. selects a governed source prototype;
3. alternates start/end variants for merged authorities;
4. generates the reviewed English question;
5. preserves the original canonical and independent solver proof;
6. attaches the provisional authority contract;
7. keeps every delivery surface disabled.

## Authority inventory

```text
RNK-CP001-AUTH-01  convert rank between ends
RNK-CP001-AUTH-02  total from both end-ranks
RNK-CP001-AUTH-03  side-count from same-side rank
RNK-CP001-AUTH-04  opposite side-count from total and rank
RNK-CP001-AUTH-05  same-side rank from side-count
RNK-CP001-AUTH-06  opposite-end rank from total and side-count
RNK-CP001-AUTH-07  exact middle rank from odd total
RNK-CP001-AUTH-08  odd total from exact middle rank
RNK-CP001-AUTH-09  total from before and after counts
```

## Variant policy

Authorities 03–06 each own two mirrored source prototypes. Variant selection is deterministic and balanced by seed. The side is a runtime parameter and does not create another authority.

Authorities 01, 02 and 07–09 own one source prototype each.

## Review proof target

```text
9 authorities × 320 seeds = 2,880 authority dispatches
```

The proof must establish:

- deterministic authority replay;
- exact authority-to-prototype ownership;
- both variants for every merged authority;
- authority answer-semantic parity;
- all contexts and answer positions;
- all chapter difficulty bands;
- original option and answer correctness;
- no permanent QL identity;
- complete lifecycle locks.

## Human review corpus

The exporter produces six representative questions per authority:

```text
9 authorities × 6 samples = 54 questions
```

The corpus includes authority metadata, source-prototype ancestry, stem, options, answer, rule, numerical steps, shortcut and option diagnostics.

## Release boundary

```text
review status:               ENGLISH_REVIEW_REQUIRED
permanent QLs:               0
Question Studio:             disabled
Question Bank:               NOT_STORED
test eligibility:            INELIGIBLE
public publication:          false
Hindi/Punjabi:               not started
```
