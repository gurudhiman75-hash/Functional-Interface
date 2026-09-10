# Quant V4 Specialized Profile Delivery Remediation — P2

Authority: `QUANT-V4-SPECIALIZED-PROFILE-DELIVERY-REMEDIATION-P2`

## Problem closed

The specialized Question Studio routes for Average, Mixture & Alligation, Number System and Time & Work could return before the shared Quant generation boundary. As measured by the preceding bypass-map audit, Banking Prelims requests therefore returned four options even though the central Banking delivery contract requires five.

The production admin route also transported `examProfile` only for the SAP Banking path, so other specialized Quant requests could lose the selected exam family before generation.

## Remediation

1. The existing central Quant delivery annotator is exported as `applyQuantV4ExamProfileDelivery` and remains the single authority for 4/5-option shaping.
2. Specialized AVG/MAL/NUM/SAP generation exits run inside the shared request-scoped exam-profile context and pass through that delivery annotator.
3. TMW and the dedicated NUM-CP-001 review exits receive the same treatment.
4. Native SAP Banking Speed Maths remains on its existing profile-aware path and is kept as the positive downstream control.
5. The admin Question Studio route now resolves the shared Quant profile for non-reasoning requests instead of limiting profile transport to SAP Banking.

## Truthful readiness semantics

For specialized routes that do not yet own an evidence-backed exam-family selector, successful delivery shaping is reported as:

`DELIVERY_CONTRACT_APPLIED_SELECTION_PENDING`

This means the requested profile reached the runtime and its public option-count contract was enforced, but chapter-level CP/QL/frequency/difficulty selection has **not** been proven.

It must not be interpreted as `APPLIED_DOWNSTREAM` or as exam calibration.

### Current expected delivery

- Banking Prelims/Mains: five unique options.
- SSC profiles: four unique options.
- Punjab State: four unique options.

Punjab four-option output therefore remains delivery-correct but selection-pending unless a chapter later supplies independent Punjab evidence and native profile machinery.

## Regression requirements

The dedicated proof covers:

- AVG Banking Prelims → 5 options, selection pending;
- MAL Banking Prelims → 5 options, selection pending;
- NUM standard Banking Prelims → 5 options, selection pending;
- NUM-CP-001 review Banking Prelims → 5 options, selection pending;
- TMW review Banking Prelims → 5 options, selection pending;
- AVG and standard SAP Punjab → 4 options, selection pending;
- SAP Banking native route remains a five-option downstream profile-aware control;
- seeded option rebuilding remains deterministic;
- correct indices stay valid and options stay unique.

The earlier bypass-map audit is retained as a live regression: after this remediation it must report zero delivery mismatches while continuing to distinguish native profile evidence from wrapper-added delivery metadata.

## What is still pending

This checkpoint fixes transport and delivery correctness. It does **not** invent Banking or Punjab CP/QL weights for AVG, MAL, NUM or TMW. The next profile-quality work is chapter-level evidence/application, followed only then by empirical selection calibration.
