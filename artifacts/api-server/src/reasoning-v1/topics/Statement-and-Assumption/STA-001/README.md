# STA-001 — Statement & Assumption

Product code: `REAS-STA`

Family: `Reasoning V1 / Family C — Logic and deduction`

## Current status

```text
permanent QL semantics:       FROZEN (4 QLs)
English corpus/runtime:       FROZEN_V2
QL001 Hindi/Punjabi:          FROZEN_V2
QL002 Hindi/Punjabi:          FROZEN_V2
QL003 Hindi/Punjabi:          FROZEN_V2
QL004 Hindi/Punjabi:          REVIEW_LOCKED_V3
exam presentation runtime:    TECHNICALLY_CERTIFIED_V1
multilingual chapter freeze:  false
Question Studio:              CLOSED
Question Bank writes:         CLOSED
mock/test eligibility:        CLOSED
public publication:           CLOSED
```

QL004 learner content is technically review-locked to the exact certified V3 artifact, but native/product approval has **not** been recorded. That approval is the only declared blocker in `multilingual-pre-freeze-manifest.ts`; downstream gates remain closed until it is resolved and the final multilingual freeze is created.

## Certified authorities

English freeze:

```text
freeze:   STA-001-EN-v2-frozen
authorities: 64 (16 per QL)
canonical English review questions: 128
learner digest: sha256:92ea0a1af379cee387237b247c89f7457a9b22d1508032618ce310076103f6e9
```

QL004 V3 technical review lock:

```text
review lock: STA-001-QL004-HI-PA-v3-review-locked
certified source head: 902af678a76666de765d7ad193a602e9be6cd709
workflow run: 32567365948 (SUCCESS)
artifact: 9474478876
artifact digest: sha256:7befb13b8c666e3f7f0919f38bbb095fbc264dcfbf44871addbbbab9bf1fe11b
canonical questions: 32 Hindi + 32 Punjabi
learner digest: sha256:ae65d8906fd644fe0062a2aa923dc7c2301608b60bdea1f7a6dcfcb326264a3b
native/product approval: false
```

Exact-head run `32567365948` proved strict TypeScript, all existing immutable freezes, QL004 V2 semantic/native identity, QL004 V3 exam-realness over 8,192 generated questions, source-backed exam-format coverage, legacy banking five-code presentation, the 32,768-question chapter-wide learner-realness stress gate, review artifact generation, and production API build.

## Permanent semantic QLs

```text
STA-QL-001  prerequisite / existence / availability / capability / feasibility dependency
STA-QL-002  recommendation / proposal / policy / decision with relevant need plus feasibility/efficacy
STA-QL-003  institutional notice / rule / service direction with audience relevance plus response capability
STA-QL-004  claim / prediction with explicit premise plus a distinct hidden causal/efficacy bridge
```

Candidate count, coded options, query polarity and option order are **presentation metadata**, not QL identity.

## Source-backed exam presentation matrix

The runtime supports:

- SSC: 2- and 3-assumption, 4-option forms;
- Banking: 2-, 3- and 4-assumption, 5-option forms;
- Banking negative-query 3-assumption form;
- legacy Banking two-assumption five-code presentation;
- Punjab-state: 2- and 3-assumption, 4-option forms;
- English, Hindi and Punjabi presentation in every supported profile.

`BANK_4X5` is source-backed by RBI Grade B 2024 evidence. Its fourth assumption is a curated **presentation-only** same-scenario authority: it does not mutate the frozen 64-authority English corpus. Eight overlay authorities span all four QLs and four misconception classes. The independent oracle must classify the added assumption `NOT_IMPLICIT / NO_REQUIRED_DEPENDENCY`.

The stress proof exercises all assumption positions I-IV for both the overlay and genuine implicit assumptions, preventing position-predictable four-assumption questions.

## Core doctrine

An assumption is an **unstated proposition materially required by the discourse act**.

The runtime therefore rejects:

- explicit restatement;
- merely true or plausible facts;
- generic relevance or desirability;
- consequences that are not required premises;
- unrestricted commonsense/world-knowledge inference;
- stronger claims than the statement needs.

Semantic negation and dependency denial are validation aids. The generator constructs questions from reviewed proposition/dependency authority first; it does not write a fluent stem and invent an answer afterward.

## Product boundary

STA owns implicit-assumption identification only and stays distinct from:

- Statement & Conclusion (`REAS-STC`)
- Statement & Argument (`REAS-ARG`)
- Course of Action (`REAS-COA`)
- Cause & Effect (`REAS-CAE`)
- Assertion & Reason (`REAS-ASM`)

## Current closure path

1. replay `localization-ql004-review-lock-proof.test.ts` and `multilingual-pre-freeze-proof.test.ts` on the current head;
2. record explicit native/product approval for the exact QL004 V3 artifact;
3. create the immutable QL004 V3 freeze manifest/proof;
4. create the final multilingual STA runtime freeze;
5. register STA in the shared Reasoning V1 Question Studio review registry;
6. keep Question Bank, mock/test and public-publication locks closed until their own explicit release checkpoint.

No further QL discovery, English corpus expansion or speculative presentation family is required for this closure path.
