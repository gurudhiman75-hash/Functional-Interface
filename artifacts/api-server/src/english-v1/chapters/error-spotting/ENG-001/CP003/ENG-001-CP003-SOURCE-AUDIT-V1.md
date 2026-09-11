# ENG-001-CP003 Source & Coverage Audit — Articles and Determiners V1

Status: `SOURCE_AUDIT_V1__IMPLEMENTATION_OPEN__NOT_QUESTION_STUDIO_REGISTERED`

## Blueprint scope

`ENG-001-CP003` is **Articles and Determiners**. The required coverage includes:

- `a / an`
- `the`
- zero article
- professions
- superlatives
- unique entities
- institutions
- geographical names
- count / non-count usage
- initial sound vs initial letter

This checkpoint follows the same architecture established in CP001 and CP002:

> verified correct construction → registered grammar rule → controlled mutation → deterministic answer → question-specific explanation

## Completion gate

CP003 is not complete until it has:

1. source coverage audit;
2. rule inventory;
3. sentence pattern inventory;
4. mutation inventory;
5. difficulty mapping;
6. question-family mapping;
7. explanation logic;
8. automated validators;
9. representative review batch;
10. generator-level defect corrections;
11. final targeted audit;
12. Question Studio compatibility after explicit human approval.

## V1 rule plan

Initial deterministic rule families:

1. indefinite article before singular count nouns;
2. `a/an` based on initial sound, not spelling;
3. definite article with superlatives;
4. definite article with unique/common-reference entities;
5. zero article for plural/general and non-count/general reference;
6. article use with professions;
7. institutional zero-article vs building/reference use;
8. geographical-name article rules;
9. count/non-count determiner compatibility;
10. determiners with singular/plural/countability constraints.

## Editorial policy

- Use plain, competitive-exam English.
- Difficulty must come from grammatical structure, reference interpretation, countability, and competing article cues—not obscure vocabulary.
- No local place-name pool for generic questions.
- Every error item changes exactly one registered article/determiner span.
- No-error items must come from a calibrated, ambiguity-safe pool.
- Explanations must identify the keyed part, give one short rule-based reason, state the correction, and show the corrected sentence.
- Review defects must be fixed in the generator/catalog/validator layer, not patched only in the review file.

## Initial ambiguity exclusions

V1 will reject or defer constructions where article choice is strongly style-, dialect-, idiom-, or context-dependent unless the sentence itself provides an unambiguous reference frame. In particular, generator patterns must avoid unsupported assumptions about whether a noun is already known to the reader.
