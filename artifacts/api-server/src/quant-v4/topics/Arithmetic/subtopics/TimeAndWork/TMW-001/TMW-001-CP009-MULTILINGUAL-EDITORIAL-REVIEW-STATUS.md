# TMW-001 CP009 Multilingual Editorial Review Status

**Checkpoint:** `TMW-CP-009 — Core Pipes & Signed Flow`  
**QL range:** `TMW-QL-157..174`  
**Languages:** English, Hindi, Punjabi  
**Status:** `ASSISTANT_EDITORIAL_REVIEW_COMPLETE / FREEZE_CANDIDATE`  
**Public delivery:** LOCKED

## Review finding

The pre-review CP009 generator was mathematically valid, but technical parity alone was not enough for exam-ready learner delivery. The fresh Hindi/Punjabi corpus exposed generic signed-flow explanations being reused for physical-flow, conversion, capacity and efficiency questions; incorrect answer labels that called capacities, levels, ratios and percentages “time”; a direction answer mislabeled as a rate; English boundary wording leaking into localized working; localized prose inside MathJax; ambiguous stripped symbols such as `V:V` and `E:E`; and a malformed hour-minute conversion line.

## Remediation completed

- added solve-mode-specific learner methods across all 18 CP009 QLs;
- made answer lines quantity-aware for fill/empty time, changed fraction, missing pipe time, pipe count, capacity, flow rate, converted rate, boundary time, final level, capacity ratio, efficiency ratio, blockage percent, direction and feasibility decision;
- corrected QL163 one-pipe rate wording;
- corrected QL167 to show `1 hour = 60 minutes` naturally in all three languages;
- moved localized prose outside MathJax in QL168, QL172, QL173 and all seed variants discovered by the stronger gate;
- labeled Tank A/Tank B capacity working explicitly in QL170;
- rebuilt QL171 old/new time and new:old efficiency working with explicit time units;
- removed ambiguous stripped `V:V`, `E:E` and `E/E` learner notation;
- made QL173 direction working seed-resilient across positive, negative and zero-style outcomes;
- made QL174 boundary-decision working seed-resilient and fully localized;
- retained canonical answers, four-option contracts, permanent QL IDs and `publiclyPublishable: false`.

## Permanent gates

1. CP009 multilingual editorial proof: 18 QLs × 3 languages × 8 seeds = **432 cases**.
2. Hindi/Punjabi human-review export: 18 QLs × 2 languages × 2 seeds = **72 packages**.
3. Strict TypeScript validation for the CP009 finalizer, chapter runtime, targeted proof and final chapter audit.
4. Full 228-QL × 3-language = **684-package** chapter audit.
5. Chapter multilingual parity regression.

The exact final governance head must pass all gates before the stacked draft PR is considered the checkpoint freeze candidate.
