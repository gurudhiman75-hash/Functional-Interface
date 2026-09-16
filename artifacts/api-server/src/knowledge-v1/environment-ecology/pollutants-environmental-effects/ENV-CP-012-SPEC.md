# ENV-CP-012 — Pollutants & Environmental Effects

**Chapter:** ENV-001 Environment & Ecology  
**CP:** ENV-CP-012 Pollutants & Environmental Effects  
**Lifecycle:** APPROVED / CONTENT-FROZEN  
**Approved review version:** V1  
**Approval date:** 2026-09-16  
**Runtime registration:** review generator remains blocked; shared runtime integration is separate  

## Scope

Included:
- eutrophication from excess nitrogen and phosphorus
- algal bloom → oxygen depletion relationship
- biochemical oxygen demand (BOD) and dissolved oxygen
- chemical oxygen demand (COD) as chemical oxygen-equivalent demand
- acid rain and its main precursor gases SO2 and NOx
- carbon monoxide and reduced oxygen transport in blood
- particulate matter and respiratory/cardiovascular effects at concept level
- bioaccumulation vs biomagnification
- persistent pollutants such as DDT/PCBs as classic biomagnification examples
- methylmercury accumulation through aquatic food chains
- lead toxicity, especially effects on the developing nervous system
- mercury toxicity, especially neurological and kidney effects
- arsenic exposure through contaminated groundwater and its chronic skin/cancer effects
- cadmium toxicity, especially kidney, skeletal and respiratory effects
- correct/incorrect pollutant–effect pairs and applied identification

Explicitly deferred:
- ozone depletion and stratospheric ozone chemistry (ENV-CP-013)
- greenhouse gases and greenhouse effect (ENV-CP-013)
- climate-change mechanisms and impacts (ENV-CP-014)
- detailed environmental laws and numerical standards (ENV-CP-015)
- current AQI values, current contamination incidents and changing regulatory limits

## Learner-facing rules

1. Stems use direct competitive-exam formats from V1.
2. Explanations use one short fact or causal link.
3. Excess nitrogen and phosphorus can trigger algal blooms; decomposition can reduce dissolved oxygen.
4. Higher BOD generally means greater microbial oxygen demand from biodegradable organic matter.
5. Acid rain is mainly linked with atmospheric SO2 and NOx forming sulfuric and nitric acids.
6. Carbon monoxide forms carboxyhemoglobin and reduces oxygen transport in blood.
7. Fine particulate matter can enter deep into the lungs; some particles can reach the bloodstream.
8. Bioaccumulation occurs within an organism; biomagnification means increasing concentration across trophic levels.
9. Lead is especially harmful to the developing nervous system of children.
10. Methylmercury exposure is strongly linked with fish/shellfish consumption and neurological toxicity.
11. Arsenic questions use stable chronic-effect associations, not current regional concentration values.
12. Cadmium questions use stable kidney/skeletal/respiratory toxicity associations.
13. Review generators remain `runtimeRegistered: false`; shared runtime integration is handled separately.

## QL inventory

| QL | Family | Difficulty |
|---|---|---|
| ENV-012-QL-001 | Eutrophication | Easy |
| ENV-012-QL-002 | BOD and dissolved oxygen | Easy |
| ENV-012-QL-003 | Acid rain | Easy |
| ENV-012-QL-004 | Carbon monoxide | Medium |
| ENV-012-QL-005 | Particulate matter | Medium |
| ENV-012-QL-006 | Bioaccumulation vs biomagnification | Medium |
| ENV-012-QL-007 | Lead | Medium |
| ENV-012-QL-008 | Mercury | Medium |
| ENV-012-QL-009 | Arsenic | Medium |
| ENV-012-QL-010 | Cadmium and COD | Medium |
| ENV-012-QL-011 | Correct / incorrect pollutant-effect pair | Hard |
| ENV-012-QL-012 | Statements and applied identification | Hard |

## Frozen review gate

Approved V1 contains:
- exactly 48 questions;
- four questions per QL;
- Easy, Medium and Hard coverage;
- all four correct-option positions inside every QL;
- four unique options per question;
- canonical answer equal to option at `correctIndex`;
- source IDs and source-fact IDs retained;
- unique semantic question signatures;
- no ozone-depletion or greenhouse-effect leakage from ENV-CP-013;
- no mutable numerical exposure limits;
- no teaching/meta stem wording;
- short, plain explanations;
- no `associated with` filler;
- no option-by-option explanation clutter.

## Source policy

Facts were cross-checked against US EPA material on nutrient pollution, acid rain, carbon monoxide, particulate matter and biomagnification; USGS material on BOD; and WHO material on lead, mercury, arsenic and cadmium. V1 was human-approved and content-frozen on 2026-09-16.