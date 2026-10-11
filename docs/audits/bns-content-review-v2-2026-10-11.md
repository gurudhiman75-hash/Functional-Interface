# Banking Number Series: content review V2

Base: `New-main@bebf90d7`. This extends the previous merged technical audit. It does not freeze the whole chapter.

## Changes

Wrong-term generation now supports all five existing grammars. The answer identifies the wrong displayed number; the replacement is calculated in the explanation. Five options are drawn from distinct displayed terms. Wrong-term items show eight terms, because six terms can admit several repairs under interleaved arithmetic. An independent repair search recovers candidates from unaffected observations and accepts exactly one repair across the supported grammar set. It does not consult generator answers or arithmetic proof values. Next-term and missing-term items retain six visible terms.

Hindi and Punjabi rendering now covers all three tasks and all five grammars. It derives numerical working from visible observations, preserves options/answers across languages, and includes a following-step check when visible. Punjabi stems and prose are authored in Punjabi. Metadata for internal distractor derivations remains English; learner explanations do not use that metadata as fallback.

The progressive-difference parameter pool now includes increments of one and seven and larger starting differences, supported by publisher practice examples.

## Source review

The JSON ledger records 20 item locators from two retrieved publisher practice pages. These are not certified PYQs. Most exceed the existing five-grammar generator scope: variable operations, fractional operations, higher differences, powers and primes. Two unresolved items remain explicit source holds. Inferred answers were independently calculated; publisher solution images were not available. The ledger distinguishes matcher support from generated-state support. This is evidence of remaining breadth gaps, not source saturation.

Sources:
- PracticeMock, 7 July 2025: https://www.practicemock.com/blog/most-asked-number-series-questions-for-sbi-po-download-free-pdf/
- BankersAdda, 27 January 2019: https://www.bankersadda.com/number-series-for-ibps-exams/

## Validation

1,000 existing-task questions, 500 wrong-term questions and 960 Hindi/Punjabi packages passed. Deterministic replay, independent verification, all three error positions and all five answer positions passed. Tests reject two corrupted terms and prove that forged generator arithmetic evidence cannot determine wrong-term acceptance. Two independently adjudicated progressive-difference source fixtures passed. Scoped TypeScript passed.

## Remaining work

Source-supported grammar expansion and source holds still need resolution. Banking Mains needs its own calibrated profile. Exact six-term wrong-series representation is not claimed. Public/test eligibility, permanent QLs, Question Studio discovery and human approval remain unchanged. Live verification is deferred to the user.
