# DSF-CP-014 — Editorial Breadth and Anti-Duplicate Foundation

## Scope

CP014 introduces reusable editorial-quality gates for Data Sufficiency batches. It does **not** change mathematical sufficiency semantics and it does not allocate a new permanent QL.

`DSF-QL-001` remains the authority for two-statement sufficiency. Three-statement semantics remain future `DSF-QL-002` work.

This branch is intentionally independent of the still-unmerged CP012 and CP013 feature branches. Therefore CP014 currently proves the reusable audit foundation only; it does not claim an aggregate CP012+CP013 corpus audit.

## What the foundation detects

### 1. Numeric-only variants

Numbers, percentages and currency values are masked before exact perceptual comparison. A question whose only visible change is parameter substitution is therefore detectable as the same normalized surface.

### 2. Caller-declared entity-only variants

The audit accepts an entity lexicon. Names or domain objects in that lexicon are replaced by a common entity token before comparison, so merely rotating names does not create false editorial breadth.

Entity replacement is opt-in rather than guessed automatically. This avoids destroying meaningful symbols or relations that happen to look like names.

### 3. Statement-I / Statement-II swaps

The audit stores both:

- ordered normalized keys; and
- an unordered canonical statement-pair key.

This catches questions that are editorially identical except that Statements I and II were exchanged.

### 4. Semantic near-duplicate surfaces

Candidate questions are shortlisted through shared meaningful tokens. Candidate pairs are then scored using a weighted combination of unigram and adjacent-token-bigram Jaccard similarity.

The threshold is policy-controlled. By default, near-duplicate comparison stays within one solve mode to reduce false positives; a caller may explicitly enable cross-mode comparison.

### 5. Structural repetition

If the source runtime supplies a `structuralFingerprint`, CP014 can cap the number of questions in one structural cluster independently of textual wording.

### 6. Repeated explanation openings

The first configurable number of meaningful explanation tokens is clustered after the same perceptual normalization. This catches explanation templates that vary only in later arithmetic.

### 7. Context and object-pool breadth

The audit can enforce:

- minimum distinct context count;
- minimum distinct object count; and
- maximum share occupied by any one object key.

This directly supports the Examtree requirement that large generated batches should not feel like the same story with different numbers.

## Non-goals

CP014 does not:

- decide whether a mathematical statement is true;
- classify sufficiency;
- replace source-chapter solvers;
- infer semantic equivalence from an LLM;
- automatically guess named entities;
- publish or register questions in Question Studio;
- claim CP012/CP013 aggregate closure before those branches are available together.

## Tests

`editorial-near-duplicate-audit.test.ts` includes deterministic fixtures for:

- numeric/name-only duplicate collapse;
- preservation of comparison direction (`greater` vs `less`);
- Statement-I/II swap detection;
- high-overlap paraphrase detection;
- unrelated content exclusion under within-mode comparison;
- object-pool concentration failure; and
- a heterogeneous clean batch that must pass all configured gates.

## Lifecycle

This checkpoint is infrastructure/review work only. It changes no learner-facing eligibility and grants no Question Studio, Question Bank, test, mock or public-publication authority.

## Integration after prerequisite branches

Once CP012 and CP013 content coexist on a common base, the next CP014 integration pass should adapt generated records into `DsfEditorialAuditRecord` and run at least three scopes:

1. per lane / per solve mode;
2. per checkpoint across all lanes; and
3. combined Reasoning Data Sufficiency corpus.

Thresholds should be based on observed corpus distributions, not weakened merely to obtain a green run.
