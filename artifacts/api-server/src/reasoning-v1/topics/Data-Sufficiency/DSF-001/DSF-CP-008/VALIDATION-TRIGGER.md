# DSF-CP-008 validation trigger

This file exists only to trigger the dedicated DSF-CP-008 pull-request validation workflow against the exact localization implementation already present on `New-main`.

The gate must prove:
- API and admin builds pass.
- Hindi/Punjabi learner text is localized without semantic drift.
- option semantic order, canonical sufficiency class and correct index are preserved.
- all 4 domains, all 8 solve modes and approved answer profiles are exercised.
- localized Question Bank/test/mock/public publication remains locked pending human review.
- CP-007 English production freeze and earlier DSF authorities remain green.
- the 62-question Hindi/Punjabi human-review artifact is generated.
