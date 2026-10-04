# DM-001 Scenario-Domain Diversity Remediation — 2026-10-03

## Why this remediation was needed

The previous breadth pass had many named contexts, but a large share still shared the same underlying feel: a person, application or case is checked against administrative conditions and an authority decides the outcome.

That is nominal context diversity, not sufficient scenario-domain diversity.

This pass therefore does **not** disguise candidate fields such as age, marks or experience as product-grading variables. The existing eligibility engine remains intact for the checkpoint families that genuinely test eligibility and rule application.

## Added operational surface

Five dedicated non-person operational situations are added to each of `DM-CP-011..016`: **30 new distinct context seeds** in total.

The new domains include:

- fruit and produce grading;
- grain procurement and moisture testing;
- packaged-food release and food-safety testing;
- cold-chain and refrigerated consignments;
- dairy sample custody;
- seed testing and certification;
- textile inspection;
- vehicle emissions inspection;
- machinery and warehouse receipt;
- electronics dispatch controls;
- spare-parts damage inspection;
- cement batch verification;
- tender sample evaluation;
- market weighbridge verification;
- production-line safety;
- pesticide-residue alerts;
- municipal water-treatment deviations;
- phytosanitary export release;
- scarce inspection, laboratory, loading and power resources.

Each seed is authored independently in English, Hindi and Punjabi and uses the existing deterministic situational-decision solver.

## Structural effect

The situational builder applies five controlled modifiers to each seed. The 30 new context seeds therefore add **150 generated situational scenario authorities** while preserving the existing QL registry and decision principles.

The important measure is not the 150 generated authorities; it is the **30 new decision objects and operational settings**.

## Regression gate

`dm-001-scenario-domain-diversity.test.ts` now requires:

- exactly five dedicated operational seeds for every checkpoint `DM-CP-011..016`;
- complete EN/HI/PA text for every new situation and action;
- reachability of every new seed through the production scenario library;
- at least 90 distinct situational English contexts across `DM-CP-011..016`;
- presence of a broad operational-domain marker set;
- no drift of the dedicated operational library back into candidate/application administration.

## Boundary retained

This remediation intentionally does not rewrite `DM-CP-001..010` into fake product scenarios. Those checkpoints use candidate-specific fields and remain candidate/eligibility rule-application families.

A future product-grading **rule-table** family, if wanted, should be implemented with genuine product fields such as moisture, defect percentage, size, weight, temperature, seal status and test result—not with renamed candidate fields.
