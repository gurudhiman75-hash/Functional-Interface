# PGK-001 — Final Factual Certification V1

Status: REVIEW-READY / CANONICAL FACT-LAYER CERTIFICATION COMPLETE / AWAITING HUMAN APPROVAL
Date: 23 September 2026
Branch: `feature/pgk-001-final-factual-certification-v1`
Base: current `New-main`
Chapter: `PGK-001 — Punjab General Knowledge`

## 1. Certification scope

This pass closes the factual-certification work left open by the exhaustive source audit.

Corpus boundary:
- 26 checkpoints;
- 182 permanent question-logics;
- 1,092 frozen English review questions;
- six frozen payloads per permanent QL;
- Question Studio lifecycle remains review-only.

The certification is performed at two layers:

1. **Canonical fact layer** — factual claims and their source authorities are reconciled at the fact/source graph from which the learner questions derive.
2. **Exact registered corpus layer** — all 1,092 English questions remain subject to option/answer integrity, provenance, duplicate, wording, length, Census-versioning, deterministic-selection and review-only lifecycle guards.

Repeated payloads are not treated as 1,092 unrelated factual authorities; their factual correctness inherits from the canonical fact/source records to which they are bound.

## 2. Source-provenance remediation forward-port

The strongest chapter-wide source remediation from PR #2063 was forward-ported onto the current `New-main` rather than merging stale branch history.

Forward-port commit:
`e8da67db0dfc330fe0deb9df9263ac9ce6d882c1`

The port preserves newer repository work while retaining the source registries and fact bindings for CP002, CP005-CP007 and CP011-CP026.

A complete source-key integrity sweep was then run across all 26 CP fact files.

Result:
- stale/unknown `SOURCE_IDS` property references after remediation: **0**.

## 3. Confirmed corrections in this certification pass

### CP001 — state-symbol provenance

A real source-registry defect was found in the forwarded audit: the Northern Goshawk source ID had been renamed to `goshawkAuthority`, but the registry still referenced the obsolete `pscstEnvisBird` property.

Fixed:
- source registry now resolves through `goshawkAuthority`;
- Blackbuck receives additional government-forest corroboration;
- Shisham / `Dalbergia sissoo` receives additional Botanical Survey of India corroboration.

The existing Punjab-government examination/PSEB authorities are retained as supporting official evidence.

### CP004 — ancient river-name variants

The river-name layer now carries both relevant PSEB authorities.

Accepted transliteration treatment remains:
- Sutlej — Shutudri / Sutudri / Shatadru variants;
- Beas — Vipasa / Vipasha;
- Ravi — Purushni / Parushni;
- Chenab — Askini / Asikni;
- Jhelum — Vitista / Vitasta.

The learner explanations were adjusted so spelling/transliteration variants are not presented as conflicting facts.

### CP009 — industrial wording

Removed the unnecessary claim that Mandi Gobindgarh is “one of Punjab's oldest secondary-steel clusters”.

Learner wording now tests the durable relation:
- Mandi Gobindgarh is a major secondary-steel / steel re-rolling cluster.

### CP010 — ancient-history evaluation language

Removed the subjective question asking for the “most famous” Kushan ruler.

The replacement tests the objective relation:
- Kanishka belonged to the Kushan dynasty.

The Hyphasis relation was also tightened to:
- Hyphasis corresponds to the modern Beas in accounts of Alexander's campaign.

### CP014 — Budha Dal / Taruna Dal

The PSEB-supported age distinction is retained explicitly:
- Budha Dal — older veterans, generally above 40 in the PSEB account;
- Taruna Dal — younger fighters.

### CP021 — Gurmukhi history

The earlier wording could be read as an “invention from nothing” claim.

It is now qualified to reflect the historical-source distinction:
- the underlying letter tradition predates Guru Angad Dev;
- Guru Angad Dev is credited with revising/systematising the script and promoting its wider use.

The corpus already bans “invented the Gurmukhi” wording.

## 4. High-risk factual reconciliation

The final external pass concentrated on claims most likely to fail despite apparently valid provenance.

### “First”, “oldest”, “highest”, “lowest” and similar claims

Verified/qualified:
- PAU — first hybrid grain pearl millet in the world;
- PAU Bt 1 — PAU/official material identifies it as India's first/public-sector Bt cotton variety in the relevant formulation;
- Ropar archaeological site — first Harappan site excavated in independent India;
- Harballabh Sangeet Sammelan — first Sammelan in 1875 at Devi Talab, Jalandhar;
- Census-2011 district highest/lowest claims remain explicitly tied to the 2011 20-district geography;
- Jnanpith's own material supports Amrita Pritam's 1981 award and describes the Jnanpith Award as the country's highest literary honour.

No canonical fact record contains an unqualified factual `only` claim.

### Punjab-name documentary references

The medieval-history block retains the documented sequence:
- Ibn Battuta — fourteenth-century early use of Punjab;
- `Tarikh-e-Sher Shah Suri` — sixteenth-century use;
- `Ain-i-Akbari` — Punjab/Panjnad references.

Learner wording remains “early documented use” rather than claiming a stronger absolute where unnecessary.

### Banda Singh Bahadur

The coinage item remains deliberately qualified to the Punjab school-history authority:
- Banda Singh Bahadur is treated as the first issuer of coins of the Sikh Panth;
- coin legends invoke Guru Nanak Dev and Guru Gobind Singh.

The corpus avoids turning this into an unsupported broader numismatic superlative.

### Sikh Misls

PSEB material confirms the exam-facing founder relations used in CP014, including:
- Faizalpuria — Nawab Kapur Singh;
- Ahluwalia — Jassa Singh Ahluwalia;
- Ramgarhia — Jassa Singh Ramgarhia;
- Sukerchakia — Charat Singh;
- Kanhaiya — Jai Singh Kanhaiya;
- Bhangi — Chhajja Singh.

The Budha/Taruna and Rakhi details were also reconciled against PSEB material.

### Singh Sabha

Punjabi University material confirms:
- the first Singh Sabha at Amritsar — 1 October 1873;
- Lahore Singh Sabha — 1879.

### PEPSU and reorganisation

Government/archival authorities support:
- PEPSU = Patiala and East Punjab States Union;
- eight constituent princely states;
- inauguration — 15 July 1948;
- merger with Punjab — 1 November 1956;
- Punjab reorganisation appointed day — 1 November 1966.

### Census and mutable facts

CP020 remains explicitly frozen to Census 2011.

The density value `551 persons/sq km` is retained because Census-derived/PSEB and Government of India material supports 551. Some Punjab-government profile material displays a rounded `550`; this is treated as presentation/rounding rather than a reason to rewrite the frozen Census authority.

District superlatives remain scoped to the Census-2011 20-district geography.

Administrative counts elsewhere remain dated/versioned rather than timeless.

### Literature

Institutional authorities support the principal CP022 award relations:
- Amrita Pritam — `Sunehure`, Sahitya Akademi Award 1956;
- Amrita Pritam — Jnanpith 1981;
- other literature facts remain attached to Sahitya Akademi, Jnanpith, Punjabi University/Punjabipedia or other named institutional authorities rather than generic “standard literature” placeholders.

### Sports and personalities

The high-risk birthplace relation retained for Ajit Pal Singh is:
- Sansarpur, Punjab.

His 1975 Men's Hockey World Cup captaincy remains bound to Hockey India/education authority records.

### District deep-dive

High-risk district relations were checked against district-government/official records, including:
- Sunam — birthplace of Shaheed Udham Singh — Sangrur;
- Malerkotla — carved from Sangrur as Punjab's 23rd district in 2021;
- Ropar/Rupnagar archaeological site — first Harappan site excavated in independent India;
- Khatkar Kalan — Bhagat Singh family/native/ancestral association in SBS Nagar;
- Harike — multi-district sanctuary relation retained; no return to the old single-district ambiguity.

## 5. Exact-corpus safeguards

The PGK Question Studio audit continues to enforce across all 1,092 registered English questions:

- 26 CPs and 182 permanent QLs;
- exactly six questions per QL;
- four unique options;
- answer/index parity;
- non-empty canonical fact provenance;
- non-empty source provenance;
- rejection of generic source placeholders;
- normalized semantic duplicate detection;
- learner-wording guards;
- explanation sentence/length bounds;
- explicit Census-2011 versioning for demographic material;
- deterministic replay and CP/QL/difficulty isolation;
- review-only lifecycle.

This pass adds regression rejection for resolved factual-overstatement forms including:
- `most famous ruler of the Kushan`;
- `one of Punjab's oldest secondary-steel...`;
- `invented the Gurmukhi`.

## 6. Remaining non-blocking provenance note

The direct original Punjab state notifications for the Blackbuck state-animal and Shisham state-tree designations were not located during this pass.

This is **not a missing-evidence or factual blocker**:
- Blackbuck is corroborated by official Punjab and government-forest material;
- Shisham / `Dalbergia sissoo` is corroborated by PSEB and Botanical Survey of India material.

The note is retained only because a direct designation notification would be the strongest possible provenance.

## 7. Certification decision

No blocking factual contradiction remains from the final high-risk reconciliation.

Recommended human-review state:

`PGK-001 — FINAL FACTUAL/SOURCE AUDIT PASSED / ENGLISH CONTENT READY TO FREEZE`

This certification does not change lifecycle permissions. Question Bank writes, mock/test eligibility, public publication, automatic student release, localisation promotion and production release remain disabled unless separately approved.
