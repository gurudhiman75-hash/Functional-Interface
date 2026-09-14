# ECO-CP-010 Status

**CP:** ECO-CP-010 Banking System  
**Lifecycle:** REVIEW_CANDIDATE_V1  
**Runtime:** BLOCKED_PENDING_HUMAN_APPROVAL  
**Localisation:** NOT_STARTED

## Implemented

- RBI/NCERT/NABARD/DICGC source registry;
- scheduled-bank definition and broad banking-classification concepts;
- core deposit-taking/lending and financial-intermediation concepts;
- savings/current/fixed/recurring deposit distinctions;
- RRB history and rural-credit purpose;
- PACS/DCCB/State Cooperative Bank short-term cooperative hierarchy;
- Small Finance Bank vs Payments Bank distinctions;
- secured/unsecured lending and collateral;
- introductory bank credit/deposit-creation logic;
- NPA concept and standard 90-day term-loan rule;
- Priority Sector Lending concept without current target percentages;
- DICGC deposit-insurance concept without current rupee ceiling;
- 12 QLs;
- deterministic 44-question English review generator;
- per-variant Easy/Medium/Hard classification;
- stronger rule + reason/application explanations;
- QA for source resolution, option validity, duplicate prevention, institutional distinctions and difficulty spread;
- QA blocking current bank counts, rates, PSL percentages, DICGC limit and NPA ratios;
- 24-question human review Markdown set.

## Static boundary

Excluded from this CP:
- current number/list/ranking of banks, RRBs, SFBs or Payments Banks;
- current ownership of individual banks and latest mergers/amalgamations;
- current deposit/loan interest rates;
- current PSL target/sub-target percentages;
- current DICGC insurance ceiling;
- current NPA ratios and bank-wise asset-quality data;
- detailed NBFC and all-India financial-institution material reserved for ECO-CP-011.

## Promotion steps

1. Human review of English questions and explanations.
2. Fix editorial/content defects if found.
3. Freeze approved English behavior.
4. Add localisation layer in the localisation phase.
5. Register with runtime/Question Studio only after separate promotion approval.
