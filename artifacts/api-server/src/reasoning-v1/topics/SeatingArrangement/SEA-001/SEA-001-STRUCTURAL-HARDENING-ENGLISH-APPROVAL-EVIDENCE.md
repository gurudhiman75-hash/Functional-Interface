# SEA-001 Structural Hardening — English Approval Evidence

Status: **APPROVED / PINNED REPLACEMENT ENGLISH AUTHORITY**

Approval date: 2026-08-20 (Asia/Kolkata)
Reviewer / product owner: `gurudhiman75-hash`
Approval source: explicit product-owner approval after review of the generated audit HTML.

## Exact approved candidate

- Candidate ID: `SEA001_STRUCTURAL_REALNESS_ENGLISH_REVIEW_CANDIDATE_V1`
- Candidate learner-surface SHA-256: `4425e3df11195d33c20f3e5d1cf9e8ebce4151750af2fbcaba514ef1256bb93a`
- Scope: 60 deterministic English caselets / 240 child questions
- Blueprint coverage:
  - `SEA-PBA-001`: 20 caselets
  - `SEA-PBA-011`: 20 caselets
  - `SEA-PBA-014`: 20 caselets
- Review artifact workflow run: `32285618003` — PASS
- Review artifact ID: `9377518429`
- Artifact ZIP digest: `sha256:b6def2f512cb87a98bd63d765b8ea0b81c4d7e5f7aa7bf88b4d10f6f403ff714`
- Validated branch head used by the approved artifact: `4f2988f867b36ec500220e654a7fcc6041690a9b`

The workflow proved the candidate fingerprint before upload and re-ran the full 1,600-caselet / 6,400-child pinned structural-realness gate. Machine status remained GREEN with no blockers.

## Relationship to the previous English freeze

Previous English review fingerprint:

`e3a4bdcd5c3afb656bed4a695e50f2f4218e45907647e23d8c733feffb59ca22`

The product owner has approved the hardening candidate above as the new English authority for the affected generated learner surfaces. The historical evidence is retained for provenance; it must not be rewritten.

## Multilingual boundary

This English approval **does not replace the currently frozen Hindi/Punjabi authority by itself**.

Before multilingual replacement:

1. regenerate the balanced 100-caselet canonical review corpus from the hardened generators across all 20 SEA-001 PBAs;
2. generate Hindi and Punjabi review candidates from that English authority;
3. prove semantic parity, explanation-block parity, case accept/reject parity, option-rationale parity and learner-surface hygiene;
4. run dynamic multilingual realness checks;
5. obtain explicit human Hindi/Punjabi approval; and
6. only then write replacement multilingual fingerprints and rerun freeze regressions.

Until those steps pass, the previously frozen Hindi/Punjabi fingerprints remain the active multilingual authority.

## Product lifecycle boundary

This approval authorizes English learner-authority replacement review progression only. It does **not** authorize product activation.

```text
Question Studio registration   false / unchanged
Question Bank writes           false
mock-test eligibility          false
production staging             false
public delivery                false
```

Full Seating-family exam weighting also remains outside this approval and is still pending SEA-002 / SEA-003 plus broader Punjab source evidence.
