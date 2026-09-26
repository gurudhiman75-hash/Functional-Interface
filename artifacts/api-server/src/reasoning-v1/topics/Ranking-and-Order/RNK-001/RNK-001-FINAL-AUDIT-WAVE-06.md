# RNK-001 — Final Audit Wave 06

Date: 2026-09-26  
Status: **NATIVE LEARNER-SURFACE AUDIT CANDIDATE**

## Scope

Fresh current-Question-Studio Hindi and Punjabi generation across the complete permanent range:

```text
42 QLs
× 2 native languages
× 4 generated instances
= 336 native learner questions
```

This wave audits the rendered product surface, not merely the existence of localization files.

## Guards

Every generated Hindi/Punjabi item must prove:

- native-script stem;
- native-script explanation;
- no cross-script Hindi↔Punjabi contamination;
- no English word leakage into stem/options/explanation;
- distinct options and valid correct index;
- no regression to historical mechanical phrases already repaired in earlier localization review;
- review-only release locks remain closed.

Single Latin category symbols such as A/B/P/Q are allowed because some source-backed/neutral ranking partitions use symbolic group labels. Multi-letter English words are not allowed on the native learner surface.

## Historical regression phrases locked out

Hindi examples include:

- `माँगे गए सिरों में रैंकें`
- `अंतिम आगे से रैंक`
- `सुबह बैच`
- `सही रैंक क्या तय होती है`
- `सबसे नीचे का संभव स्थान`

Punjabi examples include:

- `ਮੰਗੇ ਸਿਰਿਆਂ ਵਿੱਚ ਰੈਂਕਾਂ`
- `ਅੰਤਿਮ ਅੱਗੋਂ ਰੈਂਕ`
- `ਸਵੇਰ ਬੈਚ`
- `ਸਹੀ ਰੈਂਕ ਕੀ ਤੈਅ ਹੁੰਦੀ ਹੈ`

These are not new translations; they are regression guards over fixes already present in the approved localization lineage.

## Safety

No native source authority, answer index, mathematical state, QL ownership or release state is changed by Wave 06.

## CI gate

CI gate: Waves 01–06 execute together on the exact PR head before final closure is considered.

## Next

Once Waves 01–06 pass together on the exact current head, perform the final closure/freeze audit rather than adding new RNK authority.
