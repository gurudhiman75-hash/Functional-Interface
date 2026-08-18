# IOP-001 Checkpoint A — Implementation Evidence

Status: **local executable proof completed; hosted exact-head CI pending branch publication**.

## Implemented

- 12 temporary authorities across CP001–CP004;
- deterministic token generation and machine execution;
- stable token identity and action provenance;
- independent full-trace oracle;
- semantic rule fingerprinting;
- adversarial competing-rule grammar;
- rule-identifiability rejection/regeneration;
- simultaneous-action order canonicalization;
- four child query families;
- independent child-query answer oracle;
- semantic option uniqueness and one-answer enforcement;
- discovery lifecycle locks;
- HTML/JSON review exporter.

## Local scale proof

Executed with:

```text
IOP_FOUNDATION_CASES=80
12 prototypes x 80 = 960 caselets
4 child questions each = 3,840 child questions
```

Observed result:

```text
PASS_IOP_001_FOUNDATION_CP001_CP004
temporary prototype authorities 12
generated deterministic caselets 960
generated child questions 3840
competing rule executions audited 58080
non-matching alternative rule candidates rejected 57120
unique visible caselets 960
answer positions by child:
  Q1 251 / 225 / 250 / 234
  Q2 250 / 242 / 241 / 227
  Q3 215 / 247 / 240 / 258
  Q4 230 / 227 / 236 / 267
permanent QLs 0
Question Studio false
```

The proof regenerates every caselet from the same seed and requires byte-structure equality. Every child answer is independently recomputed from structured query evidence over the target trace.

## Defect found during implementation

The first rule-identifiability implementation treated these as two distinct rules:

```text
same visible step: move smallest number left + largest number right
internal order A: left action, then right action
internal order B: right action, then left action
```

That was a false ambiguity. For simultaneous schedules, semantic rule fingerprinting now sorts phase fingerprints before comparison. Internal action order therefore cannot manufacture a second learner-visible rule.

After correction the 960-caselet scale proof passes with exactly one semantic matching rule for every demonstration.

## Review export

The exporter produces:

```text
24 deterministic review caselets
2 per temporary prototype
96 child questions
HTML review surface
full JSON caselet records
summary evidence JSON
```

Every review caselet shows the illustration, new input, rule explanation, competing-rule count, questions, options, answers and learner explanations.

## Lifecycle

```text
maturity:                    EXECUTABLE_DISCOVERY_PROOF
permanentQlCount:            0
questionStudioDiscoverable:  false
questionBankWritable:        false
testEligible:                false
publiclyPublishable:         false
Hindi/Punjabi:               NOT_STARTED
```

Hosted exact-head workflow evidence must replace this local record after CI completes.
