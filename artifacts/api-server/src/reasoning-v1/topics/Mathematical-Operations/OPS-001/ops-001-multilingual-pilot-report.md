# ExamTree Reasoning V1 — OPS-001 Multilingual Pilot Report

Status: representative Hindi and Punjabi runtime parity passed. Permanent QL allocation remains unfrozen.

## 1. Scope

This report records the multilingual runtime proof for the twelve representative OPS-001 pilot contracts.

Locales:

```text
en-IN
hi-IN
pa-IN
```

The English generator remains the source of structured mathematical state. Hindi and Punjabi rendering changes only:

- stem instruction prose;
- explanation rule statement;
- explanation step labels;
- prose-only explanation results;
- conclusion wording.

It must not change:

- candidate identity;
- checkpoint identity;
- seed;
- mathematical tokens;
- options;
- correct index;
- answer;
- solver route;
- uniqueness proof;
- semantic fingerprint;
- generation metadata.

## 2. Runtime files

```text
pilot/localization.ts
pilot/localization.test.ts
```

The renderer is candidate-aware. It does not perform unrestricted word-for-word replacement over the full English stem.

## 3. Terminology contracts proved

### Hindi

```text
interchange mutually     -> आपस में बदलना
whole numbers            -> पूरी संख्याएँ
individual digits        -> अंक
operator/sign             -> गणितीय चिह्न
relation boundary         -> समीकरण-सीमा
true equation/statement   -> सत्य समीकरण / सत्य कथन
```

### Punjabi

```text
interchange mutually     -> ਆਪਸ ਵਿੱਚ ਬਦਲਣਾ
whole numbers            -> ਪੂਰੀਆਂ ਸੰਖਿਆਵਾਂ
individual digits        -> ਅੰਕ
operator/sign             -> ਗਣਿਤੀ ਚਿੰਨ੍ਹ
relation boundary         -> ਸਮੀਕਰਨ-ਹੱਦ
true equation/statement   -> ਸਹੀ ਸਮੀਕਰਨ / ਸਹੀ ਕਥਨ
```

Dedicated tests ensure that whole-number swap questions do not use digit wording and digit-identity questions do not use whole-number wording.

## 4. Parity stress run

Coverage:

```text
12 candidate contracts
50 seeds per candidate
2 translated locales

12 × 50 × 2 = 1,200 localized instances
```

For every localized instance the audit requires:

- deterministic localization;
- candidate parity;
- checkpoint parity;
- seed parity;
- answer parity;
- correct-index parity;
- exact option-array parity;
- exact uniqueness-proof parity;
- exact metadata parity;
- unchanged mathematical expression steps;
- required Devanagari or Gurmukhi script presence;
- absence of residual English instruction words;
- bounded stem and option lengths.

Observed maximum localized stem length:

```text
104 characters
```

Configured pilot limit:

```text
260 characters
```

Result:

```text
LOCALIZED_INSTANCE_COUNT         = 1,200
ANSWER_PARITY                    = PASS
OPTION_PARITY                    = PASS
CORRECT_INDEX_PARITY             = PASS
SEED_PARITY                      = PASS
SOLVER_PROOF_PARITY              = PASS
METADATA_PARITY                  = PASS
MATHEMATICAL_TRACE_PARITY        = PASS
SCRIPT_INTEGRITY                 = PASS
RESIDUAL_ENGLISH_INSTRUCTIONS    = 0
WHOLE_NUMBER_DIGIT_DISTINCTION   = PASS
MUTUAL_INTERCHANGE_WORDING       = PASS
PILOT_WIDTH_BUDGET               = PASS
```

## 5. GitHub Actions proof

Workflow:

```text
Validate OPS-001 foundation, pilots and localization
```

Run:

```text
30186894901
```

Job:

```text
pilot-proof
```

Result:

```text
Strict TypeScript check                    PASS
Exact foundation contract proof            PASS
Stress 12 representative candidate pilots  PASS
Prove Hindi and Punjabi answer parity       PASS
Overall workflow conclusion                 SUCCESS
```

The job ran against the PR merge ref.

## 6. Architectural conclusions

1. The core OPS mathematical state is language-neutral for the representative pilot families.
2. Hindi and Punjabi must render from structured candidate identity, not by translating a completed English paragraph blindly.
3. Options containing symbols, expressions and transformation pairs should remain identical across locales.
4. The terms for whole numbers, digits and mutual interchange are semantically significant and require explicit review tests.
5. Hidden symbol mappings can retain Latin symbol tokens while surrounding instruction and explanation prose is fully localized.
6. Renderer-length risk is low for the current representative stems, but final production templates still require device-level visual review.

## 7. Gate verdicts

```text
HI_RUNTIME_RENDERING                 = PASS_FOR_REPRESENTATIVE_PILOTS
PA_RUNTIME_RENDERING                 = PASS_FOR_REPRESENTATIVE_PILOTS
ANSWER_OPTION_PARITY                 = PASS
SEMANTIC_TERMINOLOGY_PARITY          = PASS
SCRIPT_INTEGRITY                     = PASS
PILOT_TEXT_WIDTH                     = PASS
FULL_34_CANDIDATE_LOCALIZATION       = NOT_YET_PROVED
DEVICE_SCREENSHOT_REVIEW             = NOT_STARTED
PERMANENT_QL_MANIFEST                = BLOCKED
```

## 8. Remaining freeze work

Before permanent QL allocation:

1. implement supplementary pilots for candidate families not represented in the twelve-contract set, especially supplied arbitrary tokens and supplied mixed arithmetic/relation mappings;
2. resolve remaining merge-sensitive candidates through runtime and renderer evidence;
3. run the final 34-candidate gap matrix;
4. perform device-level visual review exports;
5. freeze the chapter manifest only after no meaningful uncovered task topology remains.
