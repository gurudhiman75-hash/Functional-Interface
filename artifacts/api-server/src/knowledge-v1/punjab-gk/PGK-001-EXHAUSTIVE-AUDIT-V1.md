# PGK-001 — Exhaustive Factual & Editorial Audit V1

Status: AUDIT COMPLETE / REMEDIATION CANDIDATE
Audit date: 19 September 2026
Chapter: `PGK-001 — Punjab General Knowledge`
Audit branch: `feature/pgk-001-exhaustive-audit-v3`
Registered corpus: 1,092 English questions
Permanent CPs: 26
Permanent QLs: 182

## Audit model

This audit treats the frozen Question Studio corpus and its canonical fact graph as one authority chain:

`registered question → permanent QL → canonical fact ID(s) → source authority ID(s)`

Factual verification is performed at the canonical-fact layer rather than re-verifying the same shared fact separately for every surface question. Every one of the 1,092 registered learner questions must resolve to non-empty fact and source provenance.

## Exact-corpus gates

The strengthened Question Studio audit runs over the complete 1,092-question registered English corpus and requires:

- exactly 26 CPs and 182 permanent QLs;
- exactly 1,092 unique registered question IDs;
- six frozen payloads for every permanent QL;
- four unique options per question;
- the canonical answer to be present at the recorded correct index;
- non-empty stems and explanations;
- non-empty canonical fact provenance for every question;
- non-empty source provenance for every question;
- every registered source ID must resolve to a concrete source registry or source-URL authority entry;
- no generic source placeholders such as `*-REFERENCE`, `*-STANDARD-HISTORY` or `*-GENERIC` in registered question provenance;
- no semantic duplicate normalized stems across the chapter;
- no learner-facing generator/source metadata;
- no banned mechanical wording such as `associated with`, `linked with`, `known for`, `best described`, option-analysis language or generator language;
- bounded stem and explanation length;
- explanations limited to one to three learner sentences;
- explicit Census 2011 scope for demographic facts;
- deterministic Question Studio replay and selector isolation;
- review-only lifecycle locks preserved.

## Source-authority audit

The chapter fact graphs were reviewed CP-by-CP for source quality and scope. Primary/institutional authorities dominate the corpus, including:

- Government of Punjab and NIC district portals;
- Census of India / ORGI;
- India Code and Election Commission of India;
- Punjab Vidhan Sabha and Punjab & Haryana High Court;
- Punjab Agricultural University;
- Punjab School Education Board;
- BBMB and Punjab Water Resources;
- MoEFCC / Ramsar records;
- Archaeological Survey of India and National Monuments Authority;
- SGPC and official Sikh-history records used by the chapter;
- Ministry of Culture / Government of India;
- Sahitya Akademi and Bharatiya Jnanpith;
- Hockey India, World Athletics, Ministry of Youth Affairs & Sports and CRPF for sports-personality facts;
- Punjabi University / Panjab University and Bhai Vir Singh Sahitya Sadan records where literary bibliography required institutional corroboration.

Secondary references are retained only where a primary institutional source is impractical and are not used to override stronger primary evidence.

## High-risk factual re-verification

The audit gave additional manual scrutiny to claims most likely to be fragile even when structurally valid:

- present-day district/division counts and administrative formation chronology;
- Census 2011 population, literacy, density and sex-ratio snapshots;
- river, wetland and district-boundary ambiguity;
- `first`, `only`, `highest`, `lowest`, `earliest` and record claims;
- exact dates of reorganisation, treaties, battles and historical transitions;
- award years and sports records;
- birthplace / district-personality relations;
- literary work-author-award relations;
- historical Punjab versus present-day Indian Punjab scope.

## Remediation completed

The audit branch contains the following corrections and hardening:

- removed remaining weak/mechanical learner wording in affected early and late CPs;
- strengthened explanation sentence counting to avoid decimal/initialism false positives;
- added exact-corpus semantic-duplicate detection;
- made fact and source provenance mandatory for every registered question;
- restored/expanded fact provenance for CP018–CP026 where late-style QL arrays had weaker traceability;
- added explicit source provenance to CP023 culture, CP024 heritage, CP025 sports and CP026 district fact graphs;
- corrected the remaining Harike single-district ambiguity and preserved the multi-district wetland fact separately;
- corrected Ajit Pal Singh birthplace source attribution;
- cleaned several learner-facing questions/explanations in CP003, CP005, CP006, CP020, CP022, CP023 and CP026;
- replaced generic CP022 literary source labels with concrete Sahitya Akademi / institutional provenance;
- strengthened CP001 state-symbol provenance with a Comptroller and Auditor General of India wildlife-preservation authority and corrected the stale Northern Goshawk registry key;
- replaced the CP017 `singh-sabha-standard-history` placeholder with a named Punjabi University / Punjabipedia authority covering the 1873 Amritsar Sabha, 1879 Lahore Sabha and reform aims.

## CP017 Singh Sabha provenance hardening

The generic `singh-sabha-standard-history` source label was removed. The three Singh Sabha facts now resolve through `PUNJABI-UNIVERSITY-PUNJABIPEDIA-SINGH-SABHA`, with an explicit institutional authority, title, URL and supported claims.

## CP022 literature provenance hardening

Generic labels were replaced as follows:

- `PUNJABI-LITERATURE-REFERENCE` → `SAHITYA-AKADEMI-BABA-FARID`;
- `WARIS-SHAH-REFERENCE` → `SAHITYA-AKADEMI-WARIS-SHAH`;
- `BHAI-VIR-SINGH-REFERENCE` → `SAHITYA-AKADEMI-BHAI-VIR-SINGH`;
- `AMRITA-PRITAM-REFERENCE` → `SAHITYA-AKADEMI-AMRITA-PRITAM`.

Award facts remain tied to the official Sahitya Akademi award list and Bharatiya Jnanpith laureate records.

## Audit conclusion

No unresolved chapter-level factual, provenance, structural or learner-language blocker remains in the audited English authority.

The corrected English corpus remains **review-only**. This audit does not authorize:

- Question Bank writes;
- test eligibility;
- mock-test eligibility;
- public or automatic publication;
- production release;
- Hindi/Punjabi localisation promotion.

The next lifecycle gate is human acceptance of this audit remediation, followed by merge. Localisation remains a separate later pass.
