# ENG-001-CP003 Source & Coverage Audit — Articles and Determiners V1

Status: `SOURCE_AUDIT_V1__REVIEW_CANDIDATE__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED`

## Blueprint scope

`ENG-001-CP003` is **Articles and Determiners**. The implemented V1 coverage includes:

- `a / an`
- `the`
- zero article
- professions
- superlatives
- unique/specified entities
- institutions
- geographical names
- count / non-count usage
- initial sound vs initial letter

This checkpoint follows the same architecture established in CP001 and CP002:

> verified correct construction → registered grammar rule → controlled mutation → deterministic answer → question-specific explanation

## Implemented rule inventory

1. `GR-ART-001` — singular count noun requires a determiner;
2. `GR-ART-002` — `a/an` follows initial sound, not spelling;
3. `GR-ART-003` — superlative takes `the`;
4. `GR-ART-004` — explicitly specified/unique reference takes `the`;
5. `GR-ART-005` — general plural and uncountable reference takes zero article;
6. `GR-ART-006` — singular profession/role uses an indefinite article;
7. `GR-ART-007` — institutional zero article for primary-purpose use;
8. `GR-ART-008` — stable geographical-name article patterns;
9. `GR-ART-009` — countability controls quantity determiners such as many/much and few/little;
10. `GR-ART-010` — determiner agrees with singular/plural noun number.

## Authored coverage

The V1 generator contains **88 authored semantic scenes**:

- Easy: **25**
- Medium: **32**
- Hard: **31**

Scenes use familiar education, transport, commerce, science, sports, public-service, technology, environment, hospitality, healthcare, agriculture, media, household, infrastructure, banking, manufacturing, energy, postal, culture, and emergency-service settings. No local city-name pool is used.

## Difficulty policy

- Easy: direct article/determiner signal and short dependency.
- Medium: wider dependency, explicit comparison/reference/countability context.
- Hard: longer structural cue distance, institutional/general-vs-specific/geographical/countability distinctions.
- Hard lexical load is kept at 1; difficulty is structural rather than vocabulary-driven.

## QL and explanation policy

CP003 supports the permanent ENG-001 review families already established by the English engine:

- `ENG-001-QL001`
- `ENG-001-QL002`
- calibrated `ENG-001-QL007` No-error items

The fixed exam-style instructions are retained. Each error item starts from a verified correct construction and changes exactly one registered article/determiner span. Explanations identify the keyed part, give one short reason, state the correction directly, and show the corrected sentence.

## Automated validation

The V1 gate checks:

- exactly one controlled article/determiner mutation;
- registered rule/mutation consistency;
- deterministic replay;
- fixed QL instructions and option contracts;
- QL002 error-segment preservation;
- calibrated QL007 No-error behavior;
- structural difficulty derivation and Hard lexical-load ceiling;
- correction/explanation consistency;
- semantic-domain tagging;
- 3,000-seed stress generation per difficulty;
- deterministic byte-for-byte 60-question review freeze;
- approved CP002 regression;
- API build.

## Human review artifact

`ENG-001-CP003-REVIEW-V1.md` is frozen deterministically with:

- 20 Easy questions
- 20 Medium questions
- 20 Hard questions

Status remains human-review pending. CP003 is **not** registered in Question Studio and has no Question Bank/test/mock/public publication authorization.

## Completion gate

The source audit, rule inventory, authored patterns, mutations, difficulty mapping, QL mapping, explanations, validators, stress test and review freeze are complete. Remaining gates are:

1. human editorial review of the frozen 60-question artifact;
2. generator-level correction of any defects found in review;
3. explicit human approval;
4. integration into the existing `language-v1 / ENG-001` Question Studio package;
5. final integration CI;
6. explicit merge instruction.
