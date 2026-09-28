# VEN-001 CP003 Category-Set Candidate Pool V2

Status: **19 trilingual candidate authorities; every record remains pending human review**

The pool is available through the shared Question Studio reasoning-v1 package for review-only generation. These records are candidate factual authorities, not approved answer keys. The Hindi and Punjabi text, domain facts, and exam suitability require human review before any freeze or permanent QL assignment.

## Coverage

| Relation topology | Candidate count | Candidate examples |
|---|---:|---|
| Three nested classes | 5 | Sparrows / birds / animals; squares / rectangles / quadrilaterals; integers / rational numbers / real numbers; whole numbers / rational numbers / real numbers |
| Two separate subsets in a common class | 7 | Snakes and lizards / reptiles; squares and circles / plane figures; spiders and insects / arthropods; prose and poetry / literature |
| Two overlapping subsets in a common class | 7 | Prime and odd natural numbers; right and isosceles triangles; rectangles and rhombi / quadrilaterals; multiples of 4 and 6 / natural numbers |
| **Total** | **19** | Animal classification, geometry, number classification, and literary categories |

The overlap candidates include explicit witnesses for the shared region and for both exclusive regions. For example, the prime / even natural number candidate uses 2 as a shared member, odd primes as a prime-only witness, and even composite natural numbers as an even-only witness.

## Supported question operations

1. **Category labels → diagram:** the stem supplies the three named categories; four labeled diagrams are shown.
2. **Diagram → category labels:** an unlabeled topology is shown; four localized category triples are offered. Distractor triples have a different relation topology from the target.

The generator selects an operation deterministically from the request seed, or accepts `VEN-CP003-DIRECT` and `VEN-CP003-REVERSE` selectors for focused review.

## Difficulty and lifecycle

Easy and Medium are provisional structure-based review labels. Hard is disabled. Every item is marked `PENDING_TRILINGUAL_HUMAN_REVIEW`; the chapter has no permanent QL allocation. Question Bank writes, tests, mock tests, publication, and production release remain disabled.

## Boundaries still open

This pool implements CP003 candidate generation only. CP001 standalone two-group question patterns and CP002 general three-group patterns require their own source-pattern validation and generator contracts. CP004 remains conditional on evidence for a recurring region/member operation distinct from the two CP003 directions above.
