# PGK-001 — Exhaustive Source-Strength Audit V1

Status: SOURCE REMEDIATION IMPLEMENTED / CLAIM-LEVEL FACTUAL CERTIFICATION IN PROGRESS
Branch: `feature/pgk-001-exhaustive-audit-20260922`
Base authority: current `New-main`

## Audit standard

Every learner fact must resolve to an identifiable authority that can be independently checked. A symbolic `sourceId` without a resolvable source registry is not sufficient for final certification.

Ratings:
- **PRIMARY** — Government, statutory, official institutional, board/university or first-party record directly supporting the claim.
- **STRONG_SECONDARY** — reputable academic/reference authority where a primary source is impractical.
- **WEAK** — broad homepage, generic corporate page, examination paper used as factual authority, or non-pinpoint source.
- **MISSING** — learner fact has no resolvable provenance.
- **DISPUTED** — credible authorities differ; learner wording must be reconciled before certification.

## Current chapter findings

| CP | Source state after remediation | Current audit state |
|---|---|---|
| CP001 | Government/PSEB/PSCST/NFDB plus Government of India state-symbol authority | SOURCE TRACEABILITY PASS. Blackbuck recruitment-paper dependency removed; Northern Goshawk registry-key defect repaired. |
| CP002 | Punjab/NIC administrative registry with resolvable URLs | SOURCE TRACEABILITY PASS; claim-level factual verification still in chapter pass. |
| CP003 | Government of Punjab/PUDA/PAU registry | SOURCE TRACEABILITY PASS. |
| CP004 | Government of Punjab/BBMB/PUDA/PSEB registry | SOURCE TRACEABILITY PASS; ancient-name spelling/identification reconciliation remains a factual-pass item. |
| CP005 | BBMB/PSPCL/PUDA/Punjab WR registry with project-level documents | SOURCE TRACEABILITY PASS. UBDC and Harike relations now have project/system authorities rather than generic roots. |
| CP006 | Government/PSEB/PAU/Punjab policy registry plus question provenance | SOURCE TRACEABILITY PASS; claim-level factual verification continues. |
| CP007 | MoEFCC/Ramsar/WII registry | SOURCE TRACEABILITY PASS; claim-level factual verification continues. |
| CP008 | PAU/Government of Punjab registry | SOURCE TRACEABILITY PASS. |
| CP009 | Punjab/PUDA/municipal/PSIEC/MILKFED/MARKFED/HMEL registry | SOURCE TRACEABILITY PASS; corporate first-party evidence is retained only for operator/facility identity. |
| CP010 | PSEB/ASI/NMA/Punjab plus strong secondary historical reference | SOURCE TRACEABILITY PASS; ancient/historical identifications remain in factual reconciliation. |
| CP011–CP015 | PSEB/Government/SGPC/district/archival registries | SOURCE TRACEABILITY PASS; claim-level historical verification continues. |
| CP016 | National Army Museum/IGNCA archival registry | SOURCE TRACEABILITY PASS. Different `SOURCE_IDS` declaration style is valid; no unresolved keys. |
| CP017 | Ministry of Culture/Jallianwala/Punjabi University and movement-specific authorities | SOURCE TRACEABILITY PASS; claim-level historical verification continues. |
| CP018 | Punjab/Chandigarh/Punjab Raj Bhavan/India Code/High Court | SOURCE TRACEABILITY PASS. Archive.org PEPSU dependency removed. |
| CP019 | Constitution/India Code/ECI/Rajya Sabha/High Court/Punjab rural-local authorities | SOURCE TRACEABILITY PASS. Urban-body source replaced by statutory municipal authorities. |
| CP020 | Census of India and official demographic authorities | SOURCE TRACEABILITY PASS; versioned 2011 claims remain explicitly historical snapshots. |
| CP021 | India Code/Punjab/Unicode/SGPC/Punjabi University | SOURCE TRACEABILITY PASS. |
| CP022 | Sahitya Akademi/Jnanpith/Punjabi University/Punjab Auqaf | P0 SOURCE BLOCKER RESOLVED. Work/authorship and award authorities are now separated and resolvable. |
| CP023 | Government of Punjab/PSEB/Punjabi University/Ministry of Culture/SNA | P0 SOURCE BLOCKER RESOLVED. Exact cultural authorities replace generic source labels; unsupported unused facts removed. |
| CP024 | District NIC/Government heritage authorities | P0 SOURCE BLOCKER RESOLVED. High-risk dates/place-event relations verified against district authorities. |
| CP025 | Hockey India/World Athletics/MYAS/MHA/CRPF/Punjab award authorities | P0 SOURCE BLOCKER RESOLVED. High-risk record/captaincy/award claims verified against governing or government authorities. |
| CP026 | District NIC/ASI-equivalent district museum/official institutional and conservation authorities | P0 SOURCE BLOCKER RESOLVED. High-risk district “first/major” and conservation claims verified against official district sources. |

## Remediation completed in this audit line

1. Added or restored resolvable source registries and fact-level provenance where earlier CPs exposed only symbolic IDs.
2. Added provenance to CP023–CP026, which originally had no usable source authority on frozen learner surfaces.
3. Replaced CP022 generic literary placeholders with direct Sahitya Akademi, Jnanpith and Punjabi University authorities.
4. Replaced CP018 archival PEPSU dependency with an official Punjab Raj Bhavan authority.
5. Replaced CP019 broad quarterly circular evidence with statutory municipal authorities.
6. Repaired the CP001 Northern Goshawk source-registry key mismatch and strengthened Blackbuck sourcing.
7. Tightened CP005 Harike/feeder provenance with BBMB system authority.
8. Removed unsupported, unused CP023 facts instead of retaining unverified breadth.

## Still required before final certification

- Complete claim-by-claim factual reconciliation across the 1,092 frozen learner questions.
- Resolve ancient-name variants and any historical attribution where authoritative sources differ.
- Complete superlative/first/only/major wording checks so sources prove the exact strength of each stem/explanation.
- Re-run structural, provenance and Question Studio integration gates on the current-main rebased branch.
- Re-run learner-language/editorial audit after any factual/source corrections.

## Certification rule

PGK-001 must **not** be labelled `EXHAUSTIVE_FACTUAL_SOURCE_AUDIT_CERTIFIED` until the remaining factual reconciliation passes and CI proves the frozen corpus still satisfies the 26-CP / 182-QL / 1,092-question contract.

The existing Question Studio review-only integration remains intact. This audit does not authorize Question Bank writes, test/mock eligibility, publication, localisation or production release.
