# TMW-CP-008 — Wages and Contribution-Based Payment
## Ownership and Solve-Contract Audit

**Branch:** `feat/tmw-cp008`  
**Base:** approved CP-007 merge `43e98ae182974b5abf8c8e0a57e27693dbe5e4b9`  
**Status:** implementation ownership baseline; counts discovered rather than fixed as a quota  
**Publication:** disabled

## Canonical invariant

For each worker or category,

\[
C_i=N_iE_iD_iH_i
\]

and a fixed payment pool is distributed by

\[
P_i=P_{total}\frac{C_i}{\sum_j C_j}.
\]

Explicit completed-work fractions, extra-output bonuses and accepted net output are alternative contribution vectors. They do not create unrelated arithmetic engines.

## Ownership boundary

CP-008 owns payment only when the allocation depends on work contribution. It excludes capital/time partnership profit, salary taxation, payroll law and commercial accounting. Work-rate reconstruction without payment remains in CP-001–007.

## Blueprint consolidation

The blueprint listed 22 candidates. They reduce to 13 materially distinct QLs:

- equal-time, equal-efficiency, general efficiency×time and unequal-daily-hour wage ratios merge into one contribution-ratio contract;
- individual, helper and selected-group shares merge into one selected-beneficiary contract;
- missing-worker and contractor-residual wording merge into one residual-payment contract;
- join, leave and handoff cases merge into one staged-participation contract;
- explicit completed fractions remain distinct from inferred efficiency×time contribution;
- efficiency/time ratio recovery share one ordered-ratio inverse contract;
- missing time and missing efficiency remain separate because their units and option admissibility differ;
- mixed-category distribution, piece-rate payment, extra-output bonus and signed/defective contribution remain separate.

## Retained QLs

1. `TMW-QL-144` — payment ratio from contribution factors;
2. `TMW-QL-145` — selected person or group payment;
3. `TMW-QL-146` — total payment pool from one known share;
4. `TMW-QL-147` — residual payment after known allocations;
5. `TMW-QL-148` — payment after join, leave or handoff participation;
6. `TMW-QL-149` — payment from explicit completed-work fractions;
7. `TMW-QL-150` — efficiency or time ratio from payment shares;
8. `TMW-QL-151` — missing time from payment share;
9. `TMW-QL-152` — missing efficiency/work rate from payment share;
10. `TMW-QL-153` — mixed-category payment distribution;
11. `TMW-QL-154` — piece-rate payment from accepted output;
12. `TMW-QL-155` — bonus share from output above target;
13. `TMW-QL-156` — payment from accepted net output after deductions.

## Parameter policy

- generate valid contribution states first;
- derive payment pools and reported shares from exact ratios;
- keep all money answers integral in the English proof corpus;
- use £ consistently for generic-money scenarios under the active locale;
- require three distinct mathematical states per QL in the review pack;
- use bounded distractor construction; no option generator may loop indefinitely.

## Safety boundary

No Question Studio route, Question Bank write path, test assembly, localisation or public student delivery is enabled. Every candidate remains `publiclyPublishable: false`.
