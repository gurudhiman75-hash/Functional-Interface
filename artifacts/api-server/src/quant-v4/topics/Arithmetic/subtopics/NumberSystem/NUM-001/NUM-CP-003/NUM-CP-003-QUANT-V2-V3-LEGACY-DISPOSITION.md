# NUM-CP-003 — Quant V2/V3 Legacy Disposition

**Status:** source-backed legacy reconciliation before permanent allocation  
**Checkpoint:** `NUM-CP-003 — Divisibility Rules and Missing-Digit Constraints`  
**Permanent QLs:** 0  
**Frozen V4 solve authorities:** 0

This document reconciles the frozen Quant V3 `NS-DIV-001` reference archetype with the open-inventory Quant V4 checkpoint. The V3 freeze protects its own architecture; it does not force V4 to preserve each legacy canonical problem as a separate permanent QL.

---

## 1. Legacy authority reviewed

Quant V3 froze seven canonical problems under single-missing-digit divisibility:

```text
CP-001  Find Missing Digit
CP-002  Find Largest Valid Digit
CP-003  Find Smallest Valid Digit
CP-004  Count Valid Digits
CP-005  Sum Of Valid Digits
CP-006  Form Greatest Valid Number
CP-007  Form Smallest Valid Number
```

The V3 runtime, fixtures, language libraries and audit files remain immutable reference evidence. They are not a V4 production source.

---

## 2. Disposition ledger

| V3 contract | V4 disposition | Executable status before Wave 05 | Reason |
|---|---|---:|---|
| CP-001 — unique missing digit | `RETAIN_AS_ANSWER_SEMANTIC` | covered | Unique digit is a routine learner target over the single-digit candidate-set engine. |
| CP-002 — largest valid digit | `RETAIN_AS_ANSWER_SEMANTIC` | gap | Source-backed extremum target; not yet executed in V4 Waves 01–04. |
| CP-003 — smallest valid digit | `RETAIN_AS_ANSWER_SEMANTIC` | gap | Source-backed extremum target; not yet executed in V4 Waves 01–04. |
| CP-004 — count valid digits | `RETAIN_AS_ANSWER_SEMANTIC` | covered | Count changes the requested output and misconception profile even though the candidate-set engine is shared. |
| CP-005 — sum valid digits | `RETAIN_AS_ANSWER_SEMANTIC` | gap | Aggregation over the complete candidate set is not equivalent to count or set output. |
| CP-006 — greatest completed number | `RETAIN_AS_ANSWER_SEMANTIC` | gap | The requested answer is a numeral, not a digit; leading position and place value affect the result. |
| CP-007 — smallest completed number | `RETAIN_AS_ANSWER_SEMANTIC` | gap | The requested answer is a numeral, not a digit; leading-zero policy is material. |

---

## 3. V2/V3 artefact role in V4

### Retain as evidence

- divisor and pattern fixtures;
- candidate-domain examples;
- primitive and composite rule coverage;
- valid-digit-set expectations;
- largest/smallest/count/sum/form-number answer contracts;
- historical language and explanation samples for defect comparison;
- regression tests that prove expected mathematics.

### Do not reuse as production authority

- fixed templates as the generation source;
- V3 CP identifiers as V4 permanent QL identifiers;
- mechanical legacy explanation wording;
- duplicated stem families;
- legacy difficulty labels without instance-derived evidence;
- architectural assumptions that one CP must equal one V4 solver.

---

## 4. Merge and split conclusion

All seven V3 contracts share one exact candidate-set authority:

```text
enumerate admissible digits
  → construct completed numeral
  → test complete divisibility condition
  → retain valid candidates
```

They do not require seven mathematical solvers.

However, the answer contracts remain materially different:

```text
DIGIT
EXTREMUM_DIGIT
COUNT
SUM
COMPLETED_NUMBER
```

The final V4 QL proposal may therefore retain multiple learner-facing QLs over one shared solve authority. That decision must be made by answer semantic, task direction and misconception profile—not by the legacy CP count.

---

## 5. New source-backed hybrid absent from V3

The uploaded SSC material adds a linked arithmetic-result divisibility task:

```text
an arithmetic operation links two unknown digits;
the result must be divisible by a stated divisor;
the question asks for the greatest or smallest admissible digit.
```

This contract is not represented by V3 CP-001..007 and must be discovered independently in Wave 05.

The generator must prove that arithmetic evidence alone does not determine the target, while arithmetic plus divisibility and the extremum request does.

---

## 6. Final legacy decision

```text
Legacy V3 CPs reviewed:                      7
Covered before Wave 05:                      2
Source-backed V3 answer gaps:                5
New source-backed hybrid gaps:               1
Wave 05 temporary contracts required:        6
Legacy fixed-template production reuse:      FORBIDDEN
Permanent V4 allocation authorised:          NO
```

After Wave 05, the checkpoint-wide merge/split audit must be regenerated from retained V4 contracts rather than copying the V3 seven-CP inventory.
