# MAL-CP-004 Wave 02 — Direct Source Recovery and Normalisation

Status: **source-normalised open discovery**  
Permanent QLs allocated: **0**  
Question Studio exposure: **disabled**  
Question Bank / test / publication flags: **disabled**

## Purpose

Wave 01 proved seven conserved-quantity runtimes using exact rational arithmetic and legacy-family recovery. Wave 02 asks a different question:

> Do recognised competitive-exam and aptitude-book sources actually contain these task forms, and do their numbers normalise exactly into the CP-004 mathematics?

Source presence alone does not authorise a permanent release. This wave records direct task matches, formula-equivalent directions, cross-chapter collisions and source-backed gaps separately.

## Uploaded source authorities

### R.S. Aggarwal — Quantitative Aptitude for Competitive Examinations

The uploaded revised and enlarged 2017 edition explicitly targets SSC, Bank PO, SBI, IBPS, RBI, Railway, MAT, CAT and other competitive examinations.

Recovered CP-004 evidence includes:

| Source location | Exam label | Normalised task |
|---|---|---|
| Percentage solved example 42 | MAT 2004 | Add pure salt to raise solution strength; the solution also explicitly computes initial salt quantity |
| Percentage solved example 43 | SSC 2007 | Recover initial solution mass from known evaporation and initial/final concentrations |
| Percentage question 325 | — | Fresh fruit to dry-fruit mass |
| Percentage question 327 | MAT 2007 | Dry grapes to original fresh-grape mass |
| Percentage question 328 | SNAP 2010 | Add pure gold to raise alloy percentage |
| Percentage question 330 | RRB 2006 | Find final strength after a known evaporation |
| Percentage question 331 | — | Add water to reduce alcohol strength to a target |
| Percentage question 332 | SSC 2007 | Find final strength after a known water addition |
| Percentage question 333 | — | Add pure alcohol to raise solution strength |
| Percentage question 334 | MCA 2005 | Two-solution blend, retained as a CP-001/CP-004 boundary |

### Arun Sharma — How to Prepare for Quantitative Aptitude for CAT

The uploaded eighth edition supplies a CAT 2001 fresh-grapes/dried-grapes question that directly matches the forward moisture-shift contract.

It also contains replacement and multi-mixture material used only as boundary evidence where sampling or weighted blending controls the mathematics.

## Current prototype source coverage

All seven Wave 01 prototypes now have at least one exact uploaded-source normalisation:

1. component amount from concentration — formula-equivalent sub-step in a direct pure-addition solution;
2. concentration from component amount — formula-equivalent projection after known evaporation;
3. solvent addition for target concentration — direct task match;
4. pure-solute addition for target concentration — multiple direct task matches;
5. solvent evaporation for target concentration — exact forward reconstruction of the SSC inverse source state;
6. final mass after moisture shift — direct R.S. Aggarwal and CAT task matches;
7. initial mass from moisture shift — direct MAT-labelled task match.

The distinction between **direct task match** and **formula-equivalent direction** is preserved in code and evidence output.

## Source-backed gaps found

Wave 02 found three legitimate task directions not represented by the seven Wave 01 requests:

### 1. Initial total from evaporated quantity

Given:

- quantity evaporated;
- initial concentration;
- final concentration.

Find the original total quantity. This is the exact direction of the SSC 2007 solved example.

Disposition: **add an open inverse discovery prototype**.

### 2. Final concentration after known evaporation

Given initial quantity, initial strength and quantity evaporated, find final strength.

Disposition: **test as a representation variant or separate prototype during equivalence closure**.

### 3. Final concentration after known solvent addition

Given initial quantity, initial strength and solvent added, find final strength.

Disposition: **test as a representation variant or separate prototype during equivalence closure**.

No gap receives a permanent QL in this wave.

## Percentage collision

ExamTree Percentage `PCT-CP-006` already generates evaporation and fresh/dry composition questions. These use the same conserved-component equations as MAL-CP-004.

Current verdict:

```text
PCT-CP-006_MAL-CP-004_COLLISION
```

Recommended next action:

- treat MAL-CP-004 as the canonical Mixture & Alligation owner for conserved-solute and dry-matter transformations;
- preserve Percentage references for syllabus discoverability if required;
- do not publish duplicate permanent QLs under both chapters;
- complete a formal cross-chapter equivalence and migration audit before changing existing Percentage releases.

## Boundaries retained

- Two- and three-solution weighted blending remains a `MAL-CP-001_CP004_BOUNDARY`.
- Remove-and-replace questions involving sampling remain a `MAL-CP-003_CP004_BOUNDARY`.
- Multi-vessel transfer/equilibrium remains a CP-004/CP-006 concern from Wave 01 and is not absorbed here.

## Executable proof

The Wave 02 audit checks:

```text
13 source references
7+ direct uploaded-textbook task references
3 formula-equivalent source directions
10 exact current-prototype source cases
3 exact source-gap cases
7 / 7 Wave 01 prototypes covered
350 Wave 01 compatibility questions
0 permanent QLs
0 enabled product flags
```

It also proves:

- every normalised case resolves to its exact source answer;
- the SSC evaporation example round-trips between forward and inverse directions;
- the RRB known-evaporation result agrees with the component/total concentration projection;
- source case IDs, source IDs and prototype mappings are internally consistent;
- the Percentage collision and CP-001/CP-003 boundaries remain explicit;
- Wave 01 runtime maturity is not silently promoted by a source report.

## Next phase

Wave 03 should perform mathematical equivalence and merge/split closure across:

- the seven Wave 01 prototypes;
- the three Wave 02 source-backed gaps;
- Percentage `PCT-CP-006` collision families;
- CP-001 weighted-blend boundaries;
- CP-003 sampling/replacement boundaries.

Only after equivalence, editorial quality and corpus diversity pass should `MAL-QL-038+` allocation be considered.
