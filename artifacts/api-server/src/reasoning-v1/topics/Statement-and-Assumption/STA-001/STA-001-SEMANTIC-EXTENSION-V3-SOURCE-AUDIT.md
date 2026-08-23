# STA-001 — Semantic Extension V3 Source Audit

Status: **SOURCE-SUPPORTED EXTENSION CANDIDATE / NOT FROZEN**

This audit exists because the final exam-realness review found that the frozen four-QL core is technically strong but not semantically exhaustive enough for the full SSC + Banking Statement & Assumption envelope.

The extension is additive. `STA-QL-001..004`, English V2 and frozen QL001–003 Hindi/Punjabi artifacts are not rewritten.

## Proposed extension QLs

### STA-QL-005 — Persuasive Message / Advertisement / Appeal

Semantic authority: an advertisement, recruitment message or appeal depends on an unstated audience-response bridge such as:

- a relevant audience exists;
- at least some of that audience values or needs the highlighted benefit;
- the audience can notice/respond to the message;
- the requested response can serve the communicative purpose.

This is not merely a NOTICE. A notice primarily guides an already-relevant audience. An advertisement/appeal is persuasive: its rational force depends on audience motivation and expected response.

### STA-QL-006 — Comparison / Measurement / Evidence-Generalisation

Semantic authority: a comparative or evidence-based claim depends on an unstated validity bridge such as:

- compared groups/periods are meaningfully comparable for the stated claim;
- the chosen measure is relevant to the property being judged;
- the measurement meaning is stable across the comparison;
- a sample/reference class is sufficiently relevant where the statement generalises from it;
- the scope of the evidence matches the scope of the claim.

This is not ordinary QL004 efficacy. QL004 links a stated change/cause to a predicted result. QL006 validates the evidential bridge used to compare, measure or generalise.

## Target-exam evidence

The audit stores pattern summaries, not bulk copyrighted question text.

| Evidence | Family | Pattern | Extension implication |
|---|---|---|---|
| `STA-EXT-SRC-001` | SSC CHSL 2015 | Newspaper advertisement promoting pure organic honey followed by assumptions | Advertisement/value-response semantics are genuine SSC assumptions |
| `STA-EXT-SRC-002` | IBPS RRB Scale I 2021 | Construction-company advertisement with three assumptions | Banking directly uses advertisement-based multi-assumption reasoning |
| `STA-EXT-SRC-003` | IBPS Clerk Mains 2021 memory paper | Recruitment advertisement for an IT/web role | Recruitment ads require audience/need-response reasoning |
| `STA-EXT-SRC-004` | SBI PO 2010 | Government appeal to use electronic media rather than paper | Appeal requires capability/access/positive-response assumptions |
| `STA-EXT-SRC-005` | IBPS PO 2011 / later reused bank pattern | Government appeal for judicious water use | Appeal-response bridge is an established banking pattern |
| `STA-EXT-SRC-006` | SSC CHSL 2015 | Claim that metro travel is more convenient/economical | Comparative/evaluative assumptions occur in SSC |
| `STA-EXT-SRC-007` | IBPS PO Mains 2018 | Survey-based learning-performance passage asks for an implicit judging criterion | Measurement/criterion assumptions occur in banking PYQ material |
| `STA-EXT-SRC-008` | Banking reasoning corpus | Bank advertisement claims lower education-loan rates than other banks | Comparison requires comparable offerings/rates; use as pattern authority, not official-verbatim claim |

### Web provenance reviewed during audit

- SSC CHSL 6 Dec 2015 previous-paper mirror: `https://cracku.in/ssc-chsl-6-december-2015-morning-shift-question-paper-solved`
- IBPS RRB Scale I Officer 2021 previous-paper PDF: `https://static.ixambee.com/miscellaneous-pdf/IBPS-RRB-Scale-I-Officer-2021-Mains-Previous-Year-Paper.pdf`
- IBPS Clerk Mains 2021 memory paper: `https://static.ixambee.com/miscellaneous-pdf/1657188472IBPS-Clerk-Mains-2021-MBP-%281%29.pdf`
- SBI PO 2010 previous-paper mirror: `https://cracku.in/sbi-po-exam-2010-question-paper-solved`
- IBPS PO 2011 solved-paper PDF mirror: `https://bankexamportal.com/sites/default/files/ibps-po-papers-solved-paper-2011-reasoning-ability-held-on-18-sep.pdf`
- IBPS PO Mains 2018 previous-paper PDF: ixamBee previous-paper archive

These URLs are evidence references, not claims that every page is an official exam-body publication. Memory/reconstructed sources remain explicitly labelled as such.

## Punjab-state boundary

Direct Punjab-state item-level evidence remains thinner than SSC/Banking. The new QLs may include Punjab-neutral controlled scenarios for product coverage, but they must be tagged `CONTROLLED_SYNTHESIS` unless direct Punjab previous-paper authority is verified. No Punjab-specific semantic QL is created.

## Why these are QLs rather than metadata

Both extensions change the semantic solve operation:

- QL005 requires a **communicative response/motivation dependency** (`VALUE`, `BEHAVIOUR`, `INTENT`, `AWARENESS`, `RELEVANCE`).
- QL006 requires an **evidence-validity dependency** (`COMPARABILITY`, `MEASUREMENT`, `REPRESENTATIVENESS`, `SCOPE`).

Candidate count, option count, negative query wording and coded answers remain presentation metadata.

## Non-goals / remaining boundaries

The extension does not fabricate:

- political persuasion content;
- unstable current-affairs claims;
- survey generalisation where no source-supported evidential bridge exists;
- statistical calculations or Data Interpretation;
- advertisement truthfulness as a factual question;
- universal claims that every advertisement must receive a response.

The assumption standard remains necessary implicit premise, not merely plausible marketing/common-sense knowledge.

## Lifecycle

```text
STA-QL-001..004:        immutable frozen core
STA-QL-005:             source-supported extension candidate
STA-QL-006:             source-supported extension candidate
extension localization: not frozen
Question Studio:        closed
Question Bank:          closed
mock/test:              closed
public release:         closed
```

No final STA multilingual freeze is authorized until QL005/006 pass executable discovery, multilingual native review and explicit approval.
