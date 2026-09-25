# PUN-001 CP001 — Gurmukhi Orthography Forward Port

Status: `REVIEW_ONLY`

This is a fresh audited forward-port. Donor CP001 is not merged wholesale.

## Exhaustive breadth contract

CP001 is a finite script-system chapter, so breadth is measured by complete system coverage rather than by forcing a spelling-style word count.

- **100 finite system authorities**;
- **125 unique word authorities**;
- **225 total atomic authorities**;
- **35 basic Gurmukhi letters + 6 supplementary letters**;
- **8 letter groups/rows**;
- **25 five-varg articulation authorities**;
- **3 vowel carriers**;
- **10 lagan and all 10 carrier-to-independent-vowel relations**;
- **3 lagakhars** (ਬਿੰਦੀ, ਟਿੱਪੀ, ਅੱਧਕ);
- **3 modern subjoined/dutt forms** (ਪੈਰੀਂ ਹਾਹਾ, ਪੈਰੀਂ ਰਾਰਾ, ਪੈਰੀਂ ਵਾਵਾ);
- **12 semantic question families**;
- **9,745,337 semantic content combinations**, excluding option-order permutations.

## Semantic families

- F01 — alphabet sequence — Easy
- F02 — letter group classification — Easy
- F03 — articulation place — Medium
- F04 — vowel-carrier composition — Easy
- F05 — laga property — Medium
- F06 — laga identification inside words — Medium
- F07 — lagakhar distribution — Medium
- F08 — lagakhar identification inside words — Medium
- F09 — dutt/subjoined-form usage — Medium
- F10 — two-word orthography analysis — Hard
- F11 — four-word feature matching — Hard
- F12 — cross-system relation — Hard

Difficulty is produced by the required operation, not by negative wording, obscure vocabulary or verbose stems.

## Source and correction policy

The forward-port is grounded in Punjabi University / LearnPunjabi teaching material, Punjabi reference-grammar material, and Unicode Gurmukhi encoding/rendering documentation. In particular:

- the basic repertoire is the traditional 35-letter panti, with later supplementary letters handled separately;
- ੳ, ਅ and ੲ are treated as vowel carriers;
- carrier-to-laga rules follow standard modern teaching practice;
- bindi, tippi and addak are kept as separate orthographic signs;
- modern subjoined ਹ, ਰ and ਵ are represented as virama-based subjoined forms;
- U+0A75 `ੵ` is Yakash and is **not** treated as modern pairin haha.

Authority records retain their provenance-level `REVIEW_PENDING` flag, while the checkpoint itself is owner-approved for `REVIEW_ONLY` use. This does not authorize production promotion.

## Semantic gates

The proof suite requires exact finite-system cardinalities, unique authority IDs and words, NFC normalization, carrier/laga truth, lagakhar distribution truth, modern dutt-form encoding, four unique options, no seed-only fingerprints, Punjabi-only stems/explanations, family-local and cross-family semantic uniqueness, operation-based difficulty, and strict `REVIEW_ONLY` lifecycle metadata.

## Approval

Checkpoint approval is inherited from owner-approved chapter integration PR #2009 on 2026-09-20. No later learner-facing changes were made before the final freeze.

## Production lock

No Question Bank write, test/mock eligibility, public delivery or production authority promotion is opened by this checkpoint.
