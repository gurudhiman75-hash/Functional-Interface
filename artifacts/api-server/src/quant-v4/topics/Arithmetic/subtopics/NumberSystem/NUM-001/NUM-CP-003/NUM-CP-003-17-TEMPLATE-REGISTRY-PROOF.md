# NUM-CP-003 — 17-Template Retained Registry Proof

**Workflow:** `Validate NUM-CP-003 retained registry`  
**Run:** `30382227945`  
**Validated head:** `473d72a538036e87470e2ccf4a0323daa892afcd`  
**Result:** PASS  
**Permanent QLs:** 0

Evidence:

```text
Artifact ID: 8697464812
Digest: sha256:2facf09d536d91f8c1d8739dee5066a92bd5c7e992feb2f63ff63b0f3ea8e051
```

## Proven inventory

```text
Exploratory prototypes:            38
Retained prototype ancestries:     23
Non-retained dispositions:         15
Temporary retained templates:      17
Numerical authorities:              7
Standard task templates:           15
Data-sufficiency templates:         1
Claim templates:                    1
Permanent QLs:                      0
```

## Non-retained disposition proof

```text
REJECT:          3
REASSIGN:        2
OWNERSHIP_HOLD:  8
STUDY_ONLY:      2
```

The audit proves:

- all 38 exploratory IDs are unique;
- every exploratory ID appears in exactly one retained ancestry or non-retained disposition;
- no prototype appears in both groups;
- retained ancestry has no duplicate assignment across templates;
- temporary labels are continuous from `NUM-CP003-QLT2-01` to `NUM-CP003-QLT2-17`;
- all seven authorities are represented;
- all 17 rows contain source evidence and prototype ancestry;
- all lifecycle and Question Studio locks remain false/null;
- the two rule-identification prototypes remain `STUDY_ONLY` and are absent from learner QLs.

The 17-row registry is temporary architecture evidence. It is not a permanent QL allocation.
