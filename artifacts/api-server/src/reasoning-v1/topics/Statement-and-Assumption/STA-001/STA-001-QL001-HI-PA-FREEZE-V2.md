# STA-001 QL001 Hindi/Punjabi Freeze V2

Status: **FROZEN V2**

User/product approval was recorded on 2026-08-20 against the exact reviewed QL001 Hindi/Punjabi V2 candidate at source head `7965dc4fe6c8794fe1b096e19109c36a01f960de`.

## Approved review authority

- exact source head: `7965dc4fe6c8794fe1b096e19109c36a01f960de`
- exact-head validation run: `32283608128` — SUCCESS
- approved review artifact ID: `9376768050`
- approved artifact digest: `sha256:5d362289974b65d77d403d40db0536b3e62287afe17333988036ee1f06b7ad70`
- editorial version: `V2_NATIVE_EDITORIAL`
- authorities per language: **16**
- canonical questions per language: **32**
- combined canonical learner surface: **64**
- learner-content digest: `sha256:acad4cc501a3468983c6aa7a78ab8146853539893e8b694d33daf1d7971ac802`

## Immutable localization boundary

The freeze manifest pins the exact Git blob identities of:

- `localization-ql001-copy.ts`
- `localization-ql001.ts`
- `localization-ql001-editorial-v2.ts`

The QL001 freeze proof deterministically regenerates the same 32 Hindi + 32 Punjabi learner questions, excludes operational lifecycle metadata from the learner-content digest, and verifies all downstream product locks remain closed.

English V2 remains independently protected by its existing 17 exact source locks and canonical English learner digest.

## Lifecycle after this freeze

```text
English corpus/runtime:   FROZEN_V2
QL001 Hindi/Punjabi:      FROZEN_V2
QL002 Hindi/Punjabi:      NOT_STARTED
QL003 Hindi/Punjabi:      NOT_STARTED
QL004 Hindi/Punjabi:      NOT_STARTED
multilingual STA chapter: NOT_FROZEN
Question Studio:          CLOSED
Question Bank writes:     CLOSED
mock/test eligibility:    CLOSED
public publication:       CLOSED
```

This approval freezes only the QL001 Hindi/Punjabi slice. It does not authorize multilingual chapter freeze, Question Studio discovery, bank writes, mock/test use or publication.
