# PUN-001 CP010 Retrofit — ਬਹੁਤੇ ਸ਼ਬਦਾਂ ਦੀ ਥਾਂ ਇੱਕ ਸ਼ਬਦ

Status: **REVIEW_ONLY / HUMAN_APPROVED**

## Why this retrofit exists
The earlier forward-port intentionally used 64 authorities arranged as 8 domains × 8. That numerical symmetry is now removed.

The historical donor and the previously approved 64-bank were re-audited together. The previous bank is used as a canonical wording reference, not as a cap.

## Exhaustive audited authority surface
Raw historical donor:
- 255 one-word-substitution rows
- 190 exact answer strings before spelling/semantic normalization

Final audited surface:
- **177 distinct, unambiguous one-word substitution concepts**
- **10 organic semantic domains**
- **25,293 governed semantic combinations**

## Canonicalization
Repeated or equivalent answers are collapsed into one authority with provenance retained. Examples:
- ਤਬੇਲਾ → ਅਸਤਬਲ
- ਲਾਇਬ੍ਰੇਰੀ → ਪੁਸਤਕਾਲਾ
- ਯਤੀਮ → ਅਨਾਥ
- ਰੰਡੂਆ → ਵਿਧੁਰ
- ਗਾਲੜੀ → ਵਾਚਾਲ
- ਅਮੋਲਕ → ਅਮੁੱਲ
- ਹਫ਼ਤਾਵਾਰੀ → ਹਫ਼ਤਾਵਾਰ
- ਸਰਵਗਿਆਨੀ / ਸਰਬ-ਗਿਆਨੀ → ਸਰਬੱਗ
- ਸਰਵ-ਵਿਆਪਕ → ਸਰਬ-ਵਿਆਪਕ
- ਸਰਵ-ਸ਼ਕਤੀਮਾਨ → ਸਰਬ-ਸ਼ਕਤੀਮਾਨ
- ਅਲਪਗ → ਅਲਪੱਗ
- ਕਬਰਿਸਤਾਨ → ਕਬਰਸਤਾਨ
- ਦੋਪਾਇਆ → ਦੁਪਾਇਆ
- ਅਮਿਟ → ਅਮਿੱਟ
- ਖ਼ੁਦਗ਼ਰਜ਼ → ਖ਼ੁਦਗਰਜ਼
- ਸਾਖ਼ਰ → ਸਾਖਰ
- ਗੁਣਗਿਆ → ਕ੍ਰਿਤੱਗ
- ਚਸ਼ਮਦੀਦ ਗਵਾਹ → ਚਸ਼ਮਦੀਦ

Four weak or unreliable donor entries are excluded rather than retained for count:
- ਰੁਦਾਲੀ
- ਦਰਸ਼ਨੀਕ
- ਛੂਤਹਾ
- ਘੁਰਨਾ

## Domains
The retrofit uses organic domain sizes rather than equal blocks:
- CHARACTER
- DOCUMENT
- NATURE
- PLACE
- PROFESSION
- QUALITY
- RELATION
- SOCIETY
- STATE
- TIME

Every domain has at least four authorities, so same-domain Medium families are supported without synthetic padding.

## Families
- F01 direct phrase → word — Easy
- F02 direct word → phrase — Easy
- F03 same-domain phrase precision — Medium
- F04 same-domain definition precision — Medium
- F05 identify incorrect mapping — Medium
- F06 identify correct mapping — Medium
- F07 ordered two-phrase mapping — Hard
- F08 two-statement substitution verification — Hard

## Governed breadth
- 177 direct authorities in F01/F02/F03/F04/F06
- 4,068 ordered same-domain pairs in F05/F07
- 16,272 dual-statement truth cases in F08
- **25,293 total governed combinations**

## Approval
Owner approval basis: PR #2009 chapter integration on 2026-09-20. Runtime remains REVIEW_ONLY.

## Lifecycle
This retrofit was subsequently included in owner-approved chapter integration PR #2009 on 2026-09-20.

No runtime/publication promotion is authorized.
