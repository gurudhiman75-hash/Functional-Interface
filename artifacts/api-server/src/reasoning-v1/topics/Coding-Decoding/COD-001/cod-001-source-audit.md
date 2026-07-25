# COD-001 Source and Boundary Audit

Status: design evidence record. No runtime implementation is claimed.

## 1. Sources inspected

The chapter design was derived from:

- the canonical `REASONING-V1-ARCHITECTURE.md`;
- uploaded competitive-reasoning material covering Coding–Decoding;
- the existing legacy modules under `src/lib/reasoning/coding-decoding.ts` and `src/lib/motifs/coding-decoding.ts`;
- the architecture and corrective lessons already established by ANA-001.

The reviewed book taxonomy explicitly distinguishes:

1. number coding;
2. direct letter coding;
3. alphabet jumps;
4. rearrangement or jumbling;
5. opposite-letter coding;
6. combined mathematical and rearrangement rules;
7. symbol coding;
8. substitution or renaming coding;
9. sentence/artificial-language coding;
10. conditional table coding.

These are not one runtime family. They require different solvers, ambiguity checks and datasets.

## 2. Legacy code assessment

The legacy coding-decoding implementation is useful as a motif reference only. It already demonstrates:

- fixed alphabet shifts;
- opposite-alphabet mapping;
- alphabet-rank output;
- simple conditional vowel/consonant transformation;
- adjacent-pair swapping;
- multi-stage transformation labels;
- coding-specific distractor ideas.

It is not authoritative for COD-001 because it does not provide the complete Reasoning V1 contract. In particular, the legacy layer has a small hard-coded English word pool, broad motif-driven behavior, and no chapter-wide proof of:

- exact QL identity and allocation;
- independent encode/decode solving for every family;
- full eligible-rule ambiguity rejection;
- registry-level rule-collision detection;
- sentence-code constraint solving;
- conditional-rule precedence validation;
- exhaustive seeded tests;
- Hindi/Punjabi parity;
- Question Studio checkpoint discovery;
- editorial review exports.

COD-001 may reuse proven low-level alphabet utilities after contract review, but it must not route production generation through the legacy motif generator.

## 3. Included formats

COD-001 includes text, digit, symbol and structured-table coding questions in which the student must infer or apply an explicit encoding system.

Included families:

- direct letter-to-letter, letter-to-digit and letter-to-symbol substitution;
- alphabet-position sequences and bounded numeric aggregates;
- forward, backward and opposite-letter transforms;
- position-dependent and class-dependent letter transforms;
- word rearrangement and transposition;
- canonical multi-stage transformations;
- digit, symbol and alphanumeric coding;
- renamed-object or renamed-role substitution;
- sentence/artificial-language token deduction;
- lookup-table coding with explicit conditions.

## 4. Explicit exclusions

The following are separate reasoning chapters or wrappers and must not be absorbed into COD-001:

- mathematical operator interchange and equation balancing;
- coded inequalities;
- input-output machine sequences;
- alphabet-test questions that do not encode or decode a message;
- number or letter series presented without a coding relation;
- coded blood relations, coded directions and coded ranking questions;
- figure coding, figure analogy and visual-symbol transformations requiring SVG reasoning;
- encryption theory, cryptography, ciphers requiring external keys, or security-oriented content;
- factual or current-affairs codes whose correctness changes over time.

## 5. Key design corrections

### 5.1 Hidden state first

Every generated question must begin with a complete hidden code system. Examples and the target query are derived from that system. The generator must never invent examples independently and then guess a common rule afterward.

### 5.2 Evidence must identify the rule

One example is insufficient for many aggregate or composite rules. The generator must display enough evidence to reject equal-or-simpler competitors.

### 5.3 Repeated characters are a contract test

Direct substitution questions must preserve repeated-letter consistency. A repeated source character must always produce the same direct code token, and a bijective mapping must decode unambiguously within the active domain.

### 5.4 Composite stages must be active

A multi-stage question is invalid when one stage becomes an identity or is hidden by repeated letters, symmetry or commuting operations. Composite rules must be normalized so equivalent stage orders are not registered twice.

### 5.5 Sentence coding is a constraint problem

Artificial-language coding must be generated from a hidden word-token bijection and solved by intersection and exclusion constraints. Merely matching common words heuristically is not sufficient proof.

### 5.6 Conditional coding needs precedence

When more than one condition can apply, the design must either make the conditions mutually exclusive or specify and test an explicit precedence order.

## 6. Product decision

COD-001 is one student-facing chapter with ten independently mergeable checkpoints. English runtime is built and reviewed checkpoint by checkpoint. Hindi and Punjabi are added only after the corresponding English checkpoint is editorially accepted.