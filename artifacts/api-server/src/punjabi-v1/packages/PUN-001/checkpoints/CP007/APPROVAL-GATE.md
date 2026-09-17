# CP007 Approval Gate

Current state: `HUMAN_REVIEW_PENDING`

Approval must follow review of the generated 120-question Markdown pack and successful exact-head CI.

Until explicit approval:
- keep all CP007 authorities `REVIEW_PENDING`;
- keep lifecycle `REVIEW_ONLY`;
- do not allocate permanent QLs;
- do not register in Question Studio/runtime;
- do not write to Question Bank;
- do not enable tests, mocks, automatic publication, or public/student delivery.
