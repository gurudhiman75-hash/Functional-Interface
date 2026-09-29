# ENG-012 Word Swap — CP003–CP005 Review V1

Status: `HUMAN_REVIEW_PENDING__QUESTION_STUDIO_REVIEW_ONLY`

## ENG-012 now complete

### CP003 — Banking Prelims Word Swap
- 24 human-authored authority patterns.
- Medium/Hard emphasis.
- Retail banking, cards, deposits, payments, credit reports, KYC, transfers, budgeting, working capital and basic FX contexts.
- Two controlled lexical variants per authority.

### CP004 — Banking Mains Word Swap
- 24 human-authored authority patterns.
- Hard emphasis.
- Liquidity, capital adequacy, stress testing, credit risk, interest-rate risk, operational risk, model risk, data governance, cybersecurity, asset quality, provisioning, concentration risk, duration, third-party risk, restructuring, risk appetite and recovery planning.
- Two controlled lexical variants per authority.

### CP005 — Deterministic composer
- Can compose from SSC Standard, SSC Advanced, Banking Prelims or Banking Mains.
- Preserves the source CP and composer profile in Question Studio metadata.

## Final content size

| CP | Authorities | Lexical surfaces |
|---|---:|---:|
| CP001 SSC Standard | 24 | 72 |
| CP002 SSC Advanced | 24 | 72 |
| CP003 Banking Prelims | 24 | 72 |
| CP004 Banking Mains | 24 | 72 |
| **Total** | **96** | **288** |

Each surface still receives deterministic option ordering by seed.

## Question contract
- Four marked words.
- One intended interchange pair.
- Four unique pair options.
- Corrected full sentence preserved in metadata and explanation.
- No random word replacement: authorities begin from a known natural sentence and deliberately interchange one pair.

## Explanation
Each explanation:
1. states the correct swap;
2. identifies the first natural phrase;
3. identifies the second natural phrase;
4. shows the corrected sentence.

Structured emphasis cues remain available for selective bolding.

## Question Studio
Package: `english-eng012-word-swap-v1`

Implemented:
- ENG-012-CP001
- ENG-012-CP002
- ENG-012-CP003
- ENG-012-CP004
- ENG-012-CP005

Metadata:
- 96 authority patterns
- 288 lexical surfaces
- composer complete
- review-only lifecycle retained

## Source guards
- 96 unique authority IDs.
- 24 authorities per owning CP.
- exactly two controlled variants per authority.
- deterministic replay.
- four unique options.
- correct swap consistency.
- composer profile/source-CP consistency.
- 10,000-seed soak source.

No CI/test execution is claimed by this review file.
