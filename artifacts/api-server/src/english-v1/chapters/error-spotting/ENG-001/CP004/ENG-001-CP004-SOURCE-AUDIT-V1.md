# ENG-001 CP004 — Pronouns — Source & Coverage Audit V1

Status: `SOURCE_AUDIT_V1__IMPLEMENTATION_ACTIVE__NOT_QUESTION_STUDIO_REGISTERED`

## Scope

CP004 implements deterministic error-spotting coverage for pronouns. V1 focuses on exam-stable, mechanically checkable pronoun rules rather than disputed stylistic preferences.

### Registered rule families

1. subject pronoun case;
2. object pronoun case after verbs/prepositions;
3. possessive determiner vs possessive pronoun;
4. reflexive pronoun when subject and object are coreferential;
5. misuse of reflexive pronouns as ordinary objects;
6. pronoun–antecedent number agreement;
7. formal `who / whom` case;
8. person/thing relative pronouns in non-restrictive clauses;
9. demonstrative number (`this/that` vs `these/those`);
10. `whose / who's`.

## Ambiguity exclusions

V1 deliberately avoids:

- generic singular `they` disputes;
- prescriptive `each/everyone ... his` patterns;
- `between you and I` material unless the prepositional object is structurally explicit;
- comparison ellipsis such as `than me / than I`;
- restrictive `that / which` style disputes;
- collective-noun pronoun agreement where dialect can change the answer;
- reciprocal-pronoun rules (`each other / one another`) because the traditional distinction is not stable enough for deterministic marking;
- pronoun reference questions that depend on unstated discourse context.

## Editorial standard

- All stems use the same exam-standard instruction adopted in CP001–CP003.
- Vocabulary is intentionally plain; Hard difficulty comes from dependency distance and plausible case/antecedent distractions.
- Every error question starts from an authored correct sentence and changes exactly one registered pronoun span.
- Explanations connect the rule directly to the actual word or grammatical role in the sentence.
- Explanation wording varies deterministically across several simple human-style sentence patterns.
- No-error items use the verified correct construction rather than a separately invented sentence.
- Review defects must be fixed in the rule/catalog/generator layer, not only in the review export.

## Authored corpus

Current V1 catalog contains **60 authored semantic scenes**:

- Easy: 20
- Medium: 20
- Hard: 20

The scenes cover education, transport, healthcare, commerce, public service, sports, banking, technology, household, science, postal, media, manufacturing, environment, culture, energy, agriculture, hospitality, emergency service and infrastructure contexts.

## Difficulty policy

Structural score excludes lexical load.

- Easy: structural score <= 8
- Medium: structural score 9–14
- Hard: structural score >= 15
- Hard lexical load <= 2

## Lifecycle

CP004 remains `reviewOnly: true`.

It must not be registered in Question Studio, written to Question Bank, marked test/mock eligible, or exposed to learners until the frozen review is explicitly approved and final integration regressions pass.
