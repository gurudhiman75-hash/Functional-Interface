# NUM-CP-005 — Hindi and Punjabi Linguistic Hardening Record

**Checkpoint:** `NUM-CP-005 — Divisors and Divisor Functions`  
**Permanent range:** `NUM-QL-046..NUM-QL-069`  
**Locales:** `hi-IN`, `pa-IN`  
**Input evidence:** 144-question bilingual review pack from executable localisation PR #472  
**Phase:** linguistic hardening after mathematical parity  
**Final multilingual freeze:** not yet granted  
**Delivery lifecycle:** locked

## Review findings

Mathematical parity and script audits were green, but the bilingual review pack exposed issues that structural checks could not detect:

1. data-sufficiency conclusions could repeat the copula (`है है` / `ਹੈ ਹੈ`);
2. one Punjabi common trap was ungrammatical and repeated throughout the corpus;
3. the unrestricted bounded-maximum variant discussed an odd/even condition that was not present;
4. several Punjabi phrases were literal or needlessly technical, including `ਭਾਜਯ`, `ਢੰਗ ਦੇ ਭਾਜਕ`, `ਲਕਸ਼`, `ਸਾਂਝਾ ਮਿਲਾਪ` and `ਨਿਯਮ-ਮੁੱਲ`;
5. the Hindi/Punjabi caselet introduction was stiff (`एक लघु विवरण में` / `ਇੱਕ ਛੋਟੇ ਵੇਰਵੇ ਵਿੱਚ`);
6. every localized wrong-option analysis used the same generic sentence, so Common Traps were not owned by the three displayed distractors.

## Corrections

The hardened runtime now:

- uses direct, natural wording for proper-divisor, divisibility, table and caselet forms;
- gives the unrestricted and parity-constrained bounded-maximum variants separate explanations;
- fixes the data-sufficiency final conclusion grammar;
- uses `कतार`-style table language in Punjabi rather than repeated literal `line` wording;
- replaces overly literal Punjabi constructions with complete natural phrases;
- generates a localized reason from each misconception ID;
- names the actual displayed option value in every option analysis;
- derives the three Common Traps directly from the three wrong-option analyses.

## Executable hardening contract

The hardening audit covers:

```text
24 permanent QLs
2 translated locales
60 seeds per QL per locale
2,880 hardened localized questions
all approved runtime prototypes
all localized misconception IDs
```

It must prove:

- zero banned awkward or repeated phrases;
- zero generic option-analysis sentences;
- every option analysis names its displayed option;
- every Common Trap is owned by one displayed wrong option;
- three distinct traps per question;
- no parity wording in the unrestricted bounded-maximum variant;
- deterministic mathematical parity remains green;
- original editorial and script audits remain green;
- zero Question Studio, Question Bank, test or public exposure.

## Lifecycle

```text
maturity:                    MULTILINGUAL_LOCALISATION_REVIEW
reviewStatus:                LOCALIZED_REVIEW_REQUIRED
localizationStatus:          LINGUISTIC_HARDENING_REVIEW
active:                      false
questionStudioDiscoverable:  false
questionBankWritable:        false
testEligible:                false
publiclyPublishable:         false
```

## Approval boundary

This record proves implementation hardening and evidence quality. It does not substitute for the product owner's explicit final multilingual-freeze approval. Question Studio activation remains a later independent release gate.
