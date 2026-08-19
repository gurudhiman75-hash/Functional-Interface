# STA-001 English Freeze V2

Status: **ENGLISH FROZEN V2**

Freeze ID: `STA-001-EN-v2-frozen`

This freeze advances only the English content/runtime authority for `STA-001 — Statement & Assumption`. The four permanent QL identities remain unchanged and all downstream product gates remain closed.

## Frozen authority

- Permanent QLs: `STA-QL-001..004`
- English semantic authorities: **64**
- Authorities per QL: **16 / 16 / 16 / 16**
- Semantic families: **63**
- Neutral domains: **10**
- Misconception classes: **15**
- Dependency relations exercised: **7**
- Canonical human-review questions: **128** (two per authority)

## Exact reviewed source provenance

- Reviewed source head: `89cc4271130f0f7945a1edf4dae92844d3b49b01`
- Workflow: `Validate STA-001 semantic freeze and English corpus`
- Source review run: `32278819068` — **SUCCESS**
- Review artifact ID: `9375021406`
- Review artifact digest: `sha256:a2254d128c034392009b743b52bb0f2522697021f82f77a2bb164e5cccec3180`
- Canonical learner-content digest: `sha256:92ea0a1af379cee387237b247c89f7457a9b22d1508032618ce310076103f6e9`

The learner-content digest is computed from the canonical 128-question review JSON after removing lifecycle metadata. It therefore locks the reviewed learner surface while allowing the lifecycle to record the transition from review candidate to frozen English authority.

## Review corrections completed before freeze

The freeze follows direct learner-artifact review, not CI-only approval. The final review cycle corrected:

- QL-002 routing for explicitly stated problem + hidden efficacy forms;
- QL-002 routing for need/relevance + feasibility forms;
- QL-003 notices that had accidentally stated a capability later labelled as an implicit assumption;
- QL-002 appointment wording that explicitly disclosed the hidden forgetfulness bridge;
- QL-002 loaner-device and rotating-field-team stems that exposed too much of the tested hidden need/relevance;
- QL-004 difficulty coverage;
- repeated full-stem text inside explanations.

The post-remediation review surface has 128 unique stems, all 64 authorities represented twice, concise explanations without full-stem repetition, and no known English content gap from the V2 audit.

## Immutable freeze mechanism

`english-freeze-manifest.ts` pins the exact reviewed Git blob IDs for the English corpus and semantic runtime. `english-freeze-proof.test.ts` verifies those blob identities, replays the canonical 128-question surface, checks frozen lifecycle locks, and recomputes the learner-content SHA-256 digest.

Any later English content or runtime change requires an explicit freeze revision rather than silently mutating V2.

## Lifecycle after this freeze

```text
permanent QL semantics:   FROZEN (4 QLs)
English corpus/runtime:   FROZEN_V2
Hindi/Punjabi:            NOT_STARTED
Question Studio:          CLOSED
Question Bank writes:     CLOSED
mock/test eligibility:    CLOSED
public publication:       CLOSED
```

This is not a multilingual chapter freeze and does not authorize Question Studio integration, Question Bank storage, mock-test inclusion, publication, deployment, or merge.

## Next gate

Start Hindi and Punjabi localization from this frozen English authority. Localization must preserve semantic identity, proposition/dependency meaning, answer-set identity, misconception intent, and learner clarity. After native-language review and parity proof, perform the final multilingual chapter freeze before any Question Studio activation.
