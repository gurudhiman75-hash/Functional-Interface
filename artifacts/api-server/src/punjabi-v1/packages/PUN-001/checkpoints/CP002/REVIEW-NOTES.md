# CP002 Forward-Port Review Notes

## What changed from donor

- Replaced two broad families with five semantic families.
- Removed verbose/formal stem wording such as `ਟਕਸਾਲੀ` and `ਪ੍ਰਮਾਣਿਤ`.
- Removed option-by-option explanation filler.
- Replaced seed-only fake fingerprints with semantic content hashes.
- Added `subtype` metadata for Question Studio analytics.
- Hard difficulty now requires multiple spelling decisions, not merely negative/reversed wording.
- Authority records are explicitly `REVIEW_PENDING` and the entire checkpoint remains `REVIEW_ONLY`.

## Still intentionally unresolved

- Wave-1 authority records still need lexical/source verification before production admission.
- The donor corpus is much larger than this first forward-port wave; remaining records must be admitted in reviewed waves rather than copied wholesale.
- Question Studio/Question Bank/test/mock/public lifecycle gates remain closed.
