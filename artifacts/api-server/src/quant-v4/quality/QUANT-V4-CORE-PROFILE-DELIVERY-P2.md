# Quant V4 Core Profile Delivery — P2

Authority: `QUANT-V4-PROFILE-DELIVERY-P2`

## Purpose

Shared exam-profile transport now reaches the public Quant generation boundary. This checkpoint makes the **delivery contract** enforceable for profile-blind Quant routes without falsely claiming that their content/QL selection has already been calibrated to each exam.

## Delivery rule now enforced

For Quant Question Studio questions generated through a route that does not yet expose the requested exam profile itself:

- `PUNJAB_STATE` -> 4 options
- SSC profiles -> 4 options
- Banking profiles -> 5 options
- Generic Practice -> 4 options

If the chapter output already has the required number of unique options, those options are preserved. If the count is wrong, the shared deterministic option builder reconstructs the option set using the central profile's required option count.

The correct answer/index remains validated after shaping.

## New readiness distinction

A profile-blind chapter that receives correct public delivery is marked:

`DELIVERY_CONTRACT_APPLIED_SELECTION_PENDING`

This explicitly means:

- the requested central profile reached the public generation stack;
- the required option-count delivery contract is enforced;
- the chapter has **not** yet proved exam-specific CP/QL/frequency/difficulty selection.

It must not be interpreted as PYQ calibration or exam-specific content readiness.

By contrast, a runtime such as Probability that already exposes and consumes its own supported exam profile remains:

`APPLIED_DOWNSTREAM`

## Audit trace fields

Delivered Quant questions expose:

- `requestedExamProfile`
- `deliveryExamProfile`
- `expectedOptionCount`
- `optionCount`
- `deliveryContractApplied`
- `profileSelectionCalibrated`
- `profileDeliveryAuthority`
- `examProfileTransportStatus`

The batch generation context reports separate counts for native downstream application, delivery-only application and unresolved transport.

## Scope boundary

This checkpoint does not introduce Punjab-specific Percentage/Ratio/Partnership QL weighting. It also does not invent Punjab Probability rules. Those remain evidence-dependent follow-ups.
