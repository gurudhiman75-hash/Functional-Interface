# RNK-001 Approved Multilingual Integration V1

Status: **COMBINED-TREE VALIDATION CANDIDATE — FREEZE NOT YET GRANTED**

This branch validates the product-approved Hindi/Punjabi lineages together without merging their original PRs into `New-main`.

## Approval authority

Formal Hindi/Punjabi product/native approval is recorded in PR #934 and `rnk-001-native-product-approval-v1.ts`.

Approved permanent scope remains `RNK-QL-001..042`; `RNK-QL-043` is unallocated.

## Combined-tree method

`rnk-001-materialize-approved-locales-v1.sh` fetches and SHA-verifies the seven approved checkpoint branches, then overlays only their checkpoint-local localization implementation/test/export files into one CI workspace. Old checkpoint-specific workflow files and review-note Markdown are deliberately excluded.

The workflow retains a file manifest and binary patch of the exact combined overlay.

## Required verdict before freeze

All seven checkpoint localization stacks, presentation declutter, English freeze, exam-readiness/delivery guards, banking adapter, all-42 shared Question Studio review path, API build and admin build must pass together.

Until then:

- `combinedTreeGreen = false`
- `multilingualFreeze = false`
- Hindi/Punjabi Question Studio delivery = locked
- Question Bank write = false
- mock/test eligibility = false
- public publication = false
