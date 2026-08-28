# TRG-002 Legacy Proof Gate Note

The original engineering proof layers remain in repository history and as source inputs where still useful:

- `runtime-proof.ts`
- `runtime-proof-reviewed.ts`

Their original executable gate files are no longer the active authority after the exam-readiness audit.

## Why the original gates were retired

Fresh static review found that the engineering registry marked `TRG-002-QL-056`, `TRG-002-QL-065`, and `TRG-002-QL-068` as `Hard`, while each engineering explanation contains only two steps. The engineering runtime itself requires at least three steps for a Hard item. Therefore the old all-20 engineering/reviewed gates could fail before the newer remediation layer was reached.

This is not hidden or treated as a pass. The current active candidate instead routes through:

1. `runtime-proof-exam-ready.ts`
2. `runtime-proof-exam-ready.test.ts`
3. `runtime-proof-solution-diagram.ts`
4. `runtime-proof-solution-diagram.test.ts`

The exam-ready layer preserves the permanent IDs and locked families while rebuilding or recalibrating the affected QLs.

## Remodeled mathematical/state roles

- QL-015 — clean depression-height construction with integer target height
- QL-025 — shadow-to-height values avoid awkward `√3/3` answer forms
- QL-030 — natural integer object height; exact surd appears in the answer instead
- QL-056 — move-closer role recalibrated to Medium with a complete two-observation explanation
- QL-065 — original-distance role recalibrated to Medium with a complete two-observation explanation
- QL-068 — same-side point-separation role recalibrated to Medium
- QL-073 — observer eye height fixed at a realistic 1.5 m

## Additional editorial calibration

- QL-061 retains a genuine Hard two-observation system and its information-leak fix
- QL-078, QL-083, QL-088, QL-092 are calibrated to Medium in their current standard-angle forms
- QL-078 distractor provenance labels are made explicit
- wording/explanation clarity is improved without changing permanent family identity

## Execution truth

No strict TypeScript/runtime/GitHub Actions pass is claimed until an actual execution is observed. Removing the obsolete gate filenames prevents a known-invalid legacy surface from being mistaken for the current proof authority; Git history retains the original files and assertions.
