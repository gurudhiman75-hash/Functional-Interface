# MEN-CP-008 offline review export

Temporary review-only tooling used to generate a self-contained HTML pack from the merged permanent English runtime.

The generated file contains all 52 frozen QLs, three deterministic questions per QL, answer and explanation panels, local reviewer decisions and notes, filters, print support, and JSON export.

This tooling is not intended for merge into `New-main`; the generated artifact is the deliverable.

The pull-request workflow validates and packages the HTML as a downloadable artifact. The PR is temporarily marked ready only to allow the trusted workflow to run.
