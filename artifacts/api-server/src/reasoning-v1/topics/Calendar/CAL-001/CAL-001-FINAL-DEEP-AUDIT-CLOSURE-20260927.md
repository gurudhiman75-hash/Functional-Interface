# CAL-001 — Final Deep Audit Closure

Status: **CLOSED — DEEP AUDIT COMPLETE**

Date: 2026-09-27

## Closure scope

This closure completes the current Reasoning V1 deep audit for the fully implemented Calendar chapter.

Novelty is intentionally **not** part of this closure and remains deferred to the later final Reasoning novelty pass.

## Chapter authority

- Package: `CAL-001`
- Permanent QLs: `CAL-QL-001..036`
- Checkpoints: `CAL-CP-001..010`
- Languages: English, Hindi, Punjabi
- Question Studio: active
- Manual approval required downstream
- Automatic student publication: disabled

## Deep-audit findings and remediations

### 1. Learner explanation surface

Problem:
- QA-only `closestTrap` and verification prose were being projected into learner explanations.

Remediation:
- learner explanations now contain only observation/context, rule, worked steps and conclusion;
- trap/verification diagnostics remain available internally for QA.

Permanent proof:
- all 36 QLs × 3 languages × 6 deterministic seeds = 648 learner surfaces.

### 2. Difficulty integrity

Problems:
- default Calendar difficulty included seed-derived score components;
- explicit requested difficulty could silently fall back to another natural band.

Remediation:
- removed seed-driven difficulty inflation;
- default dimensions now follow completed generated-state structure;
- family-specific semantic difficulty overrides remain authoritative;
- explicit QL+difficulty requests fail honestly when the band is unreachable;
- mixed generation searches for a compatible QL rather than silently changing the request.

Permanent proof:
- executable 36 QL × Easy/Medium/Hard reachability matrix;
- mixed Easy/Medium/Hard batch assertions.

### 3. Generated-content diversity

Permanent generated-profile gate covers:
- 36 permanent QLs;
- 3 languages;
- 12 deterministic seeds per QL/locale;
- 1,296 learner-facing surfaces.

Requirements include:
- visible stem variation;
- mathematical-fingerprint variation;
- answer-position spread;
- concise learner explanations;
- no implementation vocabulary leakage;
- four unique options and valid answer mapping.

Outlier found and remediated:
- `CAL-QL-018` initially exposed only two visibly distinct stem forms;
- `CAL-PQL-022` now supplies multiple direct, exam-standard stem variants in English/Hindi/Punjabi without changing semantic authority.

### 4. Distractor quality

For all 44 normal Calendar source prototypes:
- sampled wrong options must carry an explicit misconception ID;
- sampled wrong options must carry derivation evidence;
- arbitrary neighbour distractors without learner-error provenance are rejected.

### 5. Stem/editorial quality

The chapter-wide scan found no systematic recurrence of mechanical wording such as:
- “associated with”;
- “most closely linked”;
- broad/meta wording.

Existing English editorial freeze remains enforced.

The CAL-QL-018 remediation was adjusted to preserve the frozen convention that Calendar stems remain direct questions.

### 6. Lifecycle/documentation consistency

The root README previously described obsolete discovery-only lifecycle state.

It now reflects the current:
- 36 permanent QLs;
- active Question Studio lifecycle;
- approval-gated downstream eligibility;
- automatic-publication lock.

Historical freeze records remain unchanged as historical evidence.

### 7. Question Studio integration proof

The old production-integration proof expected Calendar to be mounted directly in the top-level route index.

Current architecture correctly mounts Calendar through the canonical Question Studio registry.

The proof now verifies:
- lazy import of `admin-question-studio-calendar`;
- registry mount of the Calendar router;
- Calendar API endpoints;
- admin review UI wiring.

### 8. CI permanence

The active Calendar validator now permanently enforces:
- prior Gregorian/foundation proof;
- exam-readiness proof;
- English editorial freeze;
- Hindi/Punjabi human/editorial proof;
- source-gap/permanent identity proof;
- Question Studio/production lifecycle proof;
- learner-surface deep-audit proof;
- difficulty reachability proof;
- generated-content profile proof.

The workflow also now complies with repository fanout/timeout policy.

## Exact-head closure evidence

Closure candidate head:

```text
3a95fdea847dfbaccc899a486c22ed608d06e312
```

Exact-head GitHub Actions results:

```text
Guard pull request branch topology           PASS
Enforce workflow CI hygiene policy           PASS
Validate CAL-001 end-to-end foundation       PASS
```

The full Calendar validation workflow passed after the CAL-QL-018 direct-question remediation.

## Final disposition

```text
source/exam coverage:               CLOSED
solver/foundation correctness:      CLOSED
stem realism/editorial quality:     CLOSED
distractor quality:                 CLOSED
difficulty integrity:               CLOSED
learner explanation quality:        CLOSED
multilingual parity:                CLOSED
diversity/fatigue resistance:       CLOSED
Question Studio integration:        CLOSED
lifecycle/documentation drift:      CLOSED
CI permanence:                      CLOSED
novelty:                            DEFERRED_TO_FINAL_REASONING_PASS
deep-audit status:                  CLOSED
```

No new permanent QL was required by this audit.

Future reopening should require one of:
- a newly documented source/exam gap;
- a regression in the permanent gates;
- the deliberately deferred final novelty audit.
