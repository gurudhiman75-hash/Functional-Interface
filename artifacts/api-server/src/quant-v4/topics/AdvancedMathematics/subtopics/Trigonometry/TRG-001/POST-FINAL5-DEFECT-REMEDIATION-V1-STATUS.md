# TRG-001 Post-Final5 Defect Remediation V1

Status: **REMEDIATION CANDIDATE — HUMAN REVIEW PENDING — NOT FROZEN — NOT ACTIVATED**

## Why Final5 approval is blocked

Independent inspection of the exact Final5 review artifact found defects that the existing automated gates did not reject.

### Frozen-English defect

`TRG-001-QL-093` contains a learner-facing unresolved template placeholder in the frozen English explanation trap:

- bad frozen text: `Convert 1 to a fraction with denominator ${t.h} before combining.`
- remediation candidate: `Write 1 as a fraction with the same denominator before combining.`

The historical frozen bytes are intentionally left unchanged for provenance. The new English remediation candidate does **not** inherit the previous human approval or freeze because learner-facing content changed after freeze.

### Hindi/Punjabi defects found after Final5

The Final6 remediation corrects seven QLs in both locales:

1. `QL-093` — shortcut reversed the dependency: it reconstructed from cosine and then substituted sine even though the given ratio is sine and the requested expression needs cosine.
2. `QL-098` — shortcut reversed the dependency: it said to reconstruct tangent from secant/cosine although tangent is the given ratio used to derive secant/cosine.
3. `QL-100` — shortcut placed subtraction before reconstruction from tangent.
4. `QL-113` — generic key rule instructed add/subtract operations although the actual solve is divide by cosine and isolate tangent.
5. `QL-114` — generic key rule is replaced with the actual sine:cosine ratio route used by the worked solution.
6. `QL-115` — generic key rule instructed add/subtract operations instead of converting to tangent and reciprocating for cotangent.
7. `QL-142` — shortcut used the wrong conjugate identity, `(1+cosα)(1−cosα)`, while the actual expression requires `(1+sinα)(1−sinα)=cos²α`.

## Candidate architecture

- historical frozen English authority: unchanged and retained only as provenance;
- `production-post-freeze-remediation-v1.ts`: English correction overlay with freeze inheritance explicitly invalidated;
- `localization-native-v5-pedagogic-review-final6.ts`: targeted Hindi/Punjabi correction overlay over Final5;
- `post-final5-defect-remediation-v1.test.ts`: canonical-semantics, placeholder, targeted-copy and lifecycle-lock regression;
- `export-post-final5-defect-remediation-v1.ts`: side-by-side 144-row English/Hindi/Punjabi review pack.

## Automated target

The focused remediation gate checks three seeds per permanent QL:

- English remediation cases: `144 × 3 = 432`;
- localized cases: `144 × 2 × 3 = 864`;
- canonical answer, correct-index, canonical-state and verification parity;
- canonical semantic fingerprint parity;
- no unresolved `${...}` learner-facing placeholders in the remediated English candidate;
- exact correction text for all seven localized remediation QLs in both locales;
- no unrelated explanation drift;
- all Question Studio, Bank, Test Builder and public gates remain closed.

## Governance

This change does **not** grant or infer human approval.

Required next governance sequence:

1. focused CI must pass on the exact candidate head;
2. inspect the generated 144-row / 288-localized-surface review pack;
3. explicit human review of the English QL-093 content change and the Final6 Hindi/Punjabi corrections;
4. only after explicit approval, create new content-addressed English/localized freeze records;
5. internal activation remains a separate change after the new freeze.

Until then:

- English remediation human review: `PENDING`;
- Hindi/Punjabi human review: `PENDING`;
- English remediation frozen: `false`;
- multilingual freeze: `false`;
- Question Studio remediation candidate: `OFF`;
- Question Bank writes: `OFF`;
- Test Builder eligibility: `OFF`;
- public release: `OFF`.
