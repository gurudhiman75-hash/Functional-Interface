# PGK-001 — Exhaustive Source-Strength Audit V1

Status: SOURCE AUDIT IN PROGRESS / FINAL CERTIFICATION BLOCKED
Branch: `feature/pgk-001-exhaustive-audit-v1`
Base authority: current `New-main`

## Audit standard

Every learner fact must resolve to an identifiable authority that can be independently checked. A symbolic `sourceId` without a resolvable source registry is not sufficient for final certification.

Ratings:
- **PRIMARY** — Government, statutory, official institutional, board/university or first-party record directly supporting the claim.
- **STRONG_SECONDARY** — reputable academic/reference authority where a primary source is impractical.
- **WEAK** — broad homepage, generic corporate page, examination paper used as factual authority, or non-pinpoint source.
- **MISSING** — learner fact has no resolvable provenance.
- **DISPUTED** — credible authorities differ; learner wording must be reconciled before certification.

## Chapter findings

| CP | Source state | Audit result |
|---|---|---|
| CP001 | Government of Punjab/PSEB/PSCST/NFDB registry with direct URLs | PASS WITH REMEDIATION: Blackbuck currently relies on an official Punjab recruitment question paper rather than a direct symbol authority. |
| CP002 | Source IDs present for Punjab/NIC district and administration authorities | TRACEABILITY GAP: fact file has no resolvable source registry/URLs. |
| CP003 | Government of Punjab/PUDA/PAU registry with direct URLs | PASS. |
| CP004 | Government of Punjab/BBMB/PUDA/PSEB registry with direct URLs | PASS; ancient-name variants still require exact-source reconciliation during factual pass. |
| CP005 | BBMB/PSPCL/PUDA/Punjab WR registry | PASS WITH REMEDIATION: UBDC points to PSPCL root; Harike source points to generic eProcurement rather than a pinpoint factual record. |
| CP006 | Source IDs attached question-by-question | TRACEABILITY GAP: no resolvable source registry in the fact authority; provenance exists but cannot be independently followed from the authority file. |
| CP007 | MoEFCC/Ramsar source IDs present | TRACEABILITY GAP: no source registry/URLs in the fact authority. |
| CP008 | PAU/Government of Punjab registry with direct URLs | PASS. |
| CP009 | Punjab/PUDA/municipal/PSIEC/MILKFED/MARKFED/HMEL registry with URLs | PASS WITH MIXED AUTHORITY: first-party corporate source is acceptable for refinery/operator identity but should not substitute for government data where a public authority exists. |
| CP010 | PSEB/ASI/NMA/Punjab/Britannica registry with URLs | PASS WITH REVIEW: Britannica is strong secondary; ancient/historical identifications still need claim-level reconciliation. |
| CP011 | PSEB/Government/Lahore/IGNCA/LBSNAA source IDs | TRACEABILITY GAP: no resolvable source registry/URLs. |
| CP012 | PSEB/SGPC source IDs | TRACEABILITY GAP: no resolvable source registry/URLs. |
| CP013 | PSEB/SGPC/PIB/Census source IDs | TRACEABILITY GAP: no resolvable source registry/URLs. |
| CP014 | PSEB/Tourism/district-history source IDs | TRACEABILITY GAP: no resolvable source registry/URLs. |
| CP015 | PSEB/district/IGNCA/Britannica source IDs | TRACEABILITY GAP: no resolvable source registry/URLs. |
| CP016 | National Army Museum/IGNCA source IDs and per-fact links | TRACEABILITY GAP: per-fact source IDs exist but no resolvable registry/URLs in the fact authority. |
| CP017 | Ministry of Culture/Jallianwala/standard-history source IDs | TRACEABILITY GAP: no resolvable registry; `singh-sabha-standard-history` is not a sufficiently precise authority identifier for final certification. |
| CP018 | Punjab/Chandigarh/India Code/High Court source IDs | TRACEABILITY GAP: strong intended authorities, but no resolvable registry/URLs. |
| CP019 | India Code/ECI/Rajya Sabha/High Court/Punjab local-government source IDs | TRACEABILITY GAP: strong intended authorities, but no resolvable registry/URLs. |
| CP020 | Census of India/Punjab Economic Survey source IDs | TRACEABILITY GAP: excellent intended authorities, but no resolvable registry/URLs. |
| CP021 | India Code/Punjab/Unicode/Punjabi University source IDs | TRACEABILITY GAP: strong intended authorities, but no resolvable registry/URLs. |
| CP022 | Opaque literary source IDs plus descriptive source notes | **BLOCKER / WEAK**: several notes say only “standard Punjabi literary references” or similarly non-bibliographic descriptions; no resolvable URLs. |
| CP023 | Folk culture fact list | **BLOCKER / MISSING**: fact authority and review batches contain no source provenance. |
| CP024 | Fairs, festivals and heritage fact list | **BLOCKER / MISSING**: fact authority and review batch contain no source provenance. |
| CP025 | Personalities and sports fact list | **BLOCKER / MISSING**: fact authority and review batch contain no source provenance. |
| CP026 | District deep-dive fact list | **BLOCKER / MISSING**: fact authority and review batch contain no source provenance. |

## Confirmed remediation priority

1. **P0 — CP023–CP026:** add canonical source registries and fact-level source bindings; verify every frozen learner claim.
2. **P0 — CP022:** replace generic literary placeholders with exact Sahitya Akademi/Jnanpith/university/government or reputable scholarly bibliographic authorities.
3. **P1 — CP002, CP006–CP007, CP011–CP021:** convert symbolic source IDs into resolvable registries and preserve exact per-fact bindings.
4. **P1 — CP005:** replace broad PSPCL root/eProcurement pointers with pinpoint UBDC and Harike records.
5. **P2 — CP001:** replace recruitment-paper support for Blackbuck with a direct official state-symbol authority if available.
6. Run the factual conflict pass for ancient names, historical attribution, superlatives, district claims and mutable administrative/demographic snapshots.

## Certification rule

PGK-001 must **not** be labelled “exhaustive factual/source audit certified” until every P0/P1 item is resolved and all 1,092 learner questions remain consistent with their verified fact authorities.

The existing Question Studio review-only integration may remain intact; this audit does not authorize Question Bank, test/mock, publication or production promotion.
