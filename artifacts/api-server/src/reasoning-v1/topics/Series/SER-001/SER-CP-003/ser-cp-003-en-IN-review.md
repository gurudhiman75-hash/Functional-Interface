# SER-001 / SER-CP-003 — Open English Discovery Review

This pack contains exact deterministic runtime output for the temporary second- and third-difference templates.

- Permanent QLs: 0
- Temporary templates: 8
- Candidate solve authorities: 2
- Maturity: OPEN_EXECUTABLE_DISCOVERY
- Product exposure: disabled

## SER-CP-003-TMP-001 · CONSTANT_NONZERO_SECOND_DIFFERENCE · seed 1 · MEDIUM

Find the next term in the series: 10, 21, 35, 52, 72, 95, 121, ?

  A. 156
✓ B. 150
  C. 161
  D. 147

Rule: The first differences change by the same non-zero amount at every step.
- First differences: 11, 14, 17, 20, 23, 26, ...
- Second differences: 3, 3, 3, 3, 3, 3
- Therefore, the required term is 150.

Trap review:
- Option 156: results from extending the wrong difference level or changing the increment.
- Option 150: preserves the complete finite-difference pattern.
- Option 161: results from extending the wrong difference level or changing the increment.
- Option 147: results from extending the wrong difference level or changing the increment.

---

## SER-CP-003-TMP-001 · CONSTANT_NONZERO_SECOND_DIFFERENCE · seed 2 · HARD

Find the next term in the series: 35, 31, 24, 14, 1, -15, -34, -56, ?

  A. -78
  B. -90
✓ C. -81
  D. -94

Rule: The first differences change by the same non-zero amount at every step.
- First differences: -4, -7, -10, -13, -16, -19, ...
- Second differences: -3, -3, -3, -3, -3, -3, ...
- Therefore, the required term is -81.

Trap review:
- Option -78: results from extending the wrong difference level or changing the increment.
- Option -90: results from extending the wrong difference level or changing the increment.
- Option -81: preserves the complete finite-difference pattern.
- Option -94: results from extending the wrong difference level or changing the increment.

---

## SER-CP-003-TMP-001 · CONSTANT_NONZERO_SECOND_DIFFERENCE · seed 3 · EASY

Find the next term in the series: 29, 39, 50, 62, 75, 89, ?

  A. 110
  B. 118
  C. 101
✓ D. 104

Rule: The first differences change by the same non-zero amount at every step.
- First differences: 10, 11, 12, 13, 14, 15
- Second differences: 1, 1, 1, 1, 1
- Therefore, the required term is 104.

Trap review:
- Option 110: results from extending the wrong difference level or changing the increment.
- Option 118: results from extending the wrong difference level or changing the increment.
- Option 101: results from extending the wrong difference level or changing the increment.
- Option 104: preserves the complete finite-difference pattern.

---

## SER-CP-003-TMP-001 · CONSTANT_NONZERO_SECOND_DIFFERENCE · seed 4 · MEDIUM

Find the next term in the series: -57, -70, -78, -81, -79, -72, -60, ?

✓ A. -43
  B. -54
  C. -58
  D. -46

Rule: The first differences change by the same non-zero amount at every step.
- First differences: -13, -8, -3, 2, 7, 12, ...
- Second differences: 5, 5, 5, 5, 5, 5
- Therefore, the required term is -43.

Trap review:
- Option -43: preserves the complete finite-difference pattern.
- Option -54: results from extending the wrong difference level or changing the increment.
- Option -58: results from extending the wrong difference level or changing the increment.
- Option -46: results from extending the wrong difference level or changing the increment.

---

## SER-CP-003-TMP-002 · CONSTANT_NONZERO_SECOND_DIFFERENCE · seed 1 · HARD

Which number replaces the question mark in the series: 73, 75, 83, 97, ?, 143, 175, 213, 257

  A. 104
  B. 111
✓ C. 117
  D. 100

Rule: The first differences change by the same non-zero amount at every step.
- First differences: 2, 8, 14, 20, 26, 32, ...
- Second differences: 6, 6, 6, 6, 6, 6, ...
- Therefore, the required term is 117.

Trap review:
- Option 104: results from extending the wrong difference level or changing the increment.
- Option 111: results from extending the wrong difference level or changing the increment.
- Option 117: preserves the complete finite-difference pattern.
- Option 100: results from extending the wrong difference level or changing the increment.

---

## SER-CP-003-TMP-002 · CONSTANT_NONZERO_SECOND_DIFFERENCE · seed 2 · EASY

Which number replaces the question mark in the series: 13, 25, 40, ?, 79, 103, 130

  A. 41
  B. 62
  C. 47
✓ D. 58

Rule: The first differences change by the same non-zero amount at every step.
- First differences: 12, 15, 18, 21, 24, 27
- Second differences: 3, 3, 3, 3, 3
- Therefore, the required term is 58.

Trap review:
- Option 41: results from extending the wrong difference level or changing the increment.
- Option 62: results from extending the wrong difference level or changing the increment.
- Option 47: results from extending the wrong difference level or changing the increment.
- Option 58: preserves the complete finite-difference pattern.

---

## SER-CP-003-TMP-002 · CONSTANT_NONZERO_SECOND_DIFFERENCE · seed 3 · MEDIUM

Which number replaces the question mark in the series: -29, -20, -6, ?, 37, 66, 100, 139

✓ A. 13
  B. 8
  C. 16
  D. -2

Rule: The first differences change by the same non-zero amount at every step.
- First differences: 9, 14, 19, 24, 29, 34, ...
- Second differences: 5, 5, 5, 5, 5, 5
- Therefore, the required term is 13.

Trap review:
- Option 13: preserves the complete finite-difference pattern.
- Option 8: results from extending the wrong difference level or changing the increment.
- Option 16: results from extending the wrong difference level or changing the increment.
- Option -2: results from extending the wrong difference level or changing the increment.

---

## SER-CP-003-TMP-002 · CONSTANT_NONZERO_SECOND_DIFFERENCE · seed 4 · HARD

Which number replaces the question mark in the series: -14, -26, -31, ?, -20, -4, 19, 49, 86

  A. -42
✓ B. -29
  C. -44
  D. -19

Rule: The first differences change by the same non-zero amount at every step.
- First differences: -12, -5, 2, 9, 16, 23, ...
- Second differences: 7, 7, 7, 7, 7, 7, ...
- Therefore, the required term is -29.

Trap review:
- Option -42: results from extending the wrong difference level or changing the increment.
- Option -29: preserves the complete finite-difference pattern.
- Option -44: results from extending the wrong difference level or changing the increment.
- Option -19: results from extending the wrong difference level or changing the increment.

---

## SER-CP-003-TMP-003 · CONSTANT_NONZERO_SECOND_DIFFERENCE · seed 1 · EASY

Which number comes before the first shown term in the series: ?, 26, 42, 62, 86, 114, 146

  A. 10
  B. 18
  C. 2
✓ D. 14

Rule: The first differences change by the same non-zero amount at every step.
- First differences: 12, 16, 20, 24, 28, 32
- Second differences: 4, 4, 4, 4, 4
- Therefore, the required term is 14.

Trap review:
- Option 10: results from extending the wrong difference level or changing the increment.
- Option 18: results from extending the wrong difference level or changing the increment.
- Option 2: results from extending the wrong difference level or changing the increment.
- Option 14: preserves the complete finite-difference pattern.

---

## SER-CP-003-TMP-003 · CONSTANT_NONZERO_SECOND_DIFFERENCE · seed 2 · MEDIUM

Which number comes before the first shown term in the series: ?, 16, -2, -24, -50, -80, -114, -152

✓ A. 30
  B. 23
  C. 19
  D. 33

Rule: The first differences change by the same non-zero amount at every step.
- First differences: -14, -18, -22, -26, -30, -34, ...
- Second differences: -4, -4, -4, -4, -4, -4
- Therefore, the required term is 30.

Trap review:
- Option 30: preserves the complete finite-difference pattern.
- Option 23: results from extending the wrong difference level or changing the increment.
- Option 19: results from extending the wrong difference level or changing the increment.
- Option 33: results from extending the wrong difference level or changing the increment.

---

## SER-CP-003-TMP-003 · CONSTANT_NONZERO_SECOND_DIFFERENCE · seed 3 · HARD

Which number comes before the first shown term in the series: ?, -69, -94, -123, -156, -193, -234, -279, -328

  A. -55
✓ B. -48
  C. -38
  D. -44

Rule: The first differences change by the same non-zero amount at every step.
- First differences: -21, -25, -29, -33, -37, -41, ...
- Second differences: -4, -4, -4, -4, -4, -4, ...
- Therefore, the required term is -48.

Trap review:
- Option -55: results from extending the wrong difference level or changing the increment.
- Option -48: preserves the complete finite-difference pattern.
- Option -38: results from extending the wrong difference level or changing the increment.
- Option -44: results from extending the wrong difference level or changing the increment.

---

## SER-CP-003-TMP-003 · CONSTANT_NONZERO_SECOND_DIFFERENCE · seed 4 · EASY

Which number comes before the first shown term in the series: ?, 58, 73, 89, 106, 124, 143

  A. 58
  B. 60
✓ C. 44
  D. 50

Rule: The first differences change by the same non-zero amount at every step.
- First differences: 14, 15, 16, 17, 18, 19
- Second differences: 1, 1, 1, 1, 1
- Therefore, the required term is 44.

Trap review:
- Option 58: results from extending the wrong difference level or changing the increment.
- Option 60: results from extending the wrong difference level or changing the increment.
- Option 44: preserves the complete finite-difference pattern.
- Option 50: results from extending the wrong difference level or changing the increment.

---

## SER-CP-003-TMP-004 · CONSTANT_NONZERO_SECOND_DIFFERENCE · seed 1 · MEDIUM

Identify the wrong term in the series: 75, 85, 100, 120, 157, 175, 210, 250

✓ A. 157
  B. 175
  C. 85
  D. 100

Rule: The first differences change by the same non-zero amount at every step.
- First differences: 10, 15, 20, 25, 30, 35, ...
- Second differences: 5, 5, 5, 5, 5, 5
- 157 is the wrong term; the difference pattern requires 145 at that position.

Trap review:
- Option 157: preserves the complete finite-difference pattern.
- Option 175: this displayed term agrees with the finite-difference pattern.
- Option 85: this displayed term agrees with the finite-difference pattern.
- Option 100: this displayed term agrees with the finite-difference pattern.

---

## SER-CP-003-TMP-004 · CONSTANT_NONZERO_SECOND_DIFFERENCE · seed 2 · HARD

Identify the wrong term in the series: 3, 31, 66, 108, 157, 199, 276, 346, 423

  A. 276
✓ B. 199
  C. 157
  D. 31

Rule: The first differences change by the same non-zero amount at every step.
- First differences: 28, 35, 42, 49, 56, 63, ...
- Second differences: 7, 7, 7, 7, 7, 7, ...
- 199 is the wrong term; the difference pattern requires 213 at that position.

Trap review:
- Option 276: this displayed term agrees with the finite-difference pattern.
- Option 199: preserves the complete finite-difference pattern.
- Option 157: this displayed term agrees with the finite-difference pattern.
- Option 31: this displayed term agrees with the finite-difference pattern.

---

## SER-CP-003-TMP-004 · CONSTANT_NONZERO_SECOND_DIFFERENCE · seed 3 · EASY

Identify the wrong term in the series: 7, 9, 4, 16, 21, 27, 34

  A. 27
  B. 21
✓ C. 4
  D. 9

Rule: The first differences change by the same non-zero amount at every step.
- First differences: 2, 3, 4, 5, 6, 7
- Second differences: 1, 1, 1, 1, 1
- 4 is the wrong term; the difference pattern requires 12 at that position.

Trap review:
- Option 27: this displayed term agrees with the finite-difference pattern.
- Option 21: this displayed term agrees with the finite-difference pattern.
- Option 4: preserves the complete finite-difference pattern.
- Option 9: this displayed term agrees with the finite-difference pattern.

---

## SER-CP-003-TMP-004 · CONSTANT_NONZERO_SECOND_DIFFERENCE · seed 4 · MEDIUM

Identify the wrong term in the series: -59, -67, -81, -101, -127, -146, -197, -241

  A. -241
  B. -67
  C. -101
✓ D. -146

Rule: The first differences change by the same non-zero amount at every step.
- First differences: -8, -14, -20, -26, -32, -38, ...
- Second differences: -6, -6, -6, -6, -6, -6
- -146 is the wrong term; the difference pattern requires -159 at that position.

Trap review:
- Option -241: this displayed term agrees with the finite-difference pattern.
- Option -67: this displayed term agrees with the finite-difference pattern.
- Option -101: this displayed term agrees with the finite-difference pattern.
- Option -146: preserves the complete finite-difference pattern.

---

## SER-CP-003-TMP-005 · CONSTANT_NONZERO_THIRD_DIFFERENCE · seed 1 · HARD

Find the next term in the series: 22, 17, 5, -11, -28, -43, -53, -55, -46, ?

  A. -20
✓ B. -23
  C. -30
  D. -40

Rule: The second differences change by the same non-zero amount at every step.
- First differences: -5, -12, -16, -17, -15, -10, ...
- Second differences: -7, -4, -1, 2, 5, 8, ...
- Third differences: 3, 3, 3, 3, 3, 3, ...
- Therefore, the required term is -23.

Trap review:
- Option -20: results from extending the wrong difference level or changing the increment.
- Option -23: preserves the complete finite-difference pattern.
- Option -30: results from extending the wrong difference level or changing the increment.
- Option -40: results from extending the wrong difference level or changing the increment.

---

## SER-CP-003-TMP-005 · CONSTANT_NONZERO_THIRD_DIFFERENCE · seed 2 · EASY

Find the next term in the series: 34, 36, 40, 47, 58, 74, 96, ?

  A. 128
  B. 112
✓ C. 125
  D. 131

Rule: The second differences change by the same non-zero amount at every step.
- First differences: 2, 4, 7, 11, 16, 22, ...
- Second differences: 2, 3, 4, 5, 6, 7
- Third differences: 1, 1, 1, 1, 1
- Therefore, the required term is 125.

Trap review:
- Option 128: results from extending the wrong difference level or changing the increment.
- Option 112: results from extending the wrong difference level or changing the increment.
- Option 125: preserves the complete finite-difference pattern.
- Option 131: results from extending the wrong difference level or changing the increment.

---

## SER-CP-003-TMP-005 · CONSTANT_NONZERO_THIRD_DIFFERENCE · seed 3 · MEDIUM

Find the next term in the series: -34, -41, -51, -67, -92, -129, -181, -251, ?

  A. -332
  B. -335
  C. -345
✓ D. -342

Rule: The second differences change by the same non-zero amount at every step.
- First differences: -7, -10, -16, -25, -37, -52, ...
- Second differences: -3, -6, -9, -12, -15, -18, ...
- Third differences: -3, -3, -3, -3, -3, -3
- Therefore, the required term is -342.

Trap review:
- Option -332: results from extending the wrong difference level or changing the increment.
- Option -335: results from extending the wrong difference level or changing the increment.
- Option -345: results from extending the wrong difference level or changing the increment.
- Option -342: preserves the complete finite-difference pattern.

---

## SER-CP-003-TMP-005 · CONSTANT_NONZERO_THIRD_DIFFERENCE · seed 4 · HARD

Find the next term in the series: 30, 52, 81, 118, 164, 220, 287, 366, 458, ?

✓ A. 564
  B. 557
  C. 572
  D. 586

Rule: The second differences change by the same non-zero amount at every step.
- First differences: 22, 29, 37, 46, 56, 67, ...
- Second differences: 7, 8, 9, 10, 11, 12, ...
- Third differences: 1, 1, 1, 1, 1, 1, ...
- Therefore, the required term is 564.

Trap review:
- Option 564: preserves the complete finite-difference pattern.
- Option 557: results from extending the wrong difference level or changing the increment.
- Option 572: results from extending the wrong difference level or changing the increment.
- Option 586: results from extending the wrong difference level or changing the increment.

---

## SER-CP-003-TMP-006 · CONSTANT_NONZERO_THIRD_DIFFERENCE · seed 1 · EASY

Which number replaces the question mark in the series: 27, 36, 47, ?, 79, 102, 131, 167

  A. 50
  B. 44
✓ C. 61
  D. 63

Rule: The second differences change by the same non-zero amount at every step.
- First differences: 9, 11, 14, 18, 23, 29, ...
- Second differences: 2, 3, 4, 5, 6, 7
- Third differences: 1, 1, 1, 1, 1
- Therefore, the required term is 61.

Trap review:
- Option 50: results from extending the wrong difference level or changing the increment.
- Option 44: results from extending the wrong difference level or changing the increment.
- Option 61: preserves the complete finite-difference pattern.
- Option 63: results from extending the wrong difference level or changing the increment.

---

## SER-CP-003-TMP-006 · CONSTANT_NONZERO_THIRD_DIFFERENCE · seed 2 · MEDIUM

Which number replaces the question mark in the series: 39, 47, 62, 83, ?, 139, 172, 207, 243

  A. 106
  B. 116
  C. 115
✓ D. 109

Rule: The second differences change by the same non-zero amount at every step.
- First differences: 8, 15, 21, 26, 30, 33, ...
- Second differences: 7, 6, 5, 4, 3, 2, ...
- Third differences: -1, -1, -1, -1, -1, -1
- Therefore, the required term is 109.

Trap review:
- Option 106: results from extending the wrong difference level or changing the increment.
- Option 116: results from extending the wrong difference level or changing the increment.
- Option 115: results from extending the wrong difference level or changing the increment.
- Option 109: preserves the complete finite-difference pattern.

---

## SER-CP-003-TMP-006 · CONSTANT_NONZERO_THIRD_DIFFERENCE · seed 3 · HARD

Which number replaces the question mark in the series: 45, 46, 42, 31, 11, -20, ?, -123, -199, -294

✓ A. -64
  B. -57
  C. -59
  D. -54

Rule: The second differences change by the same non-zero amount at every step.
- First differences: 1, -4, -11, -20, -31, -44, ...
- Second differences: -5, -7, -9, -11, -13, -15, ...
- Third differences: -2, -2, -2, -2, -2, -2, ...
- Therefore, the required term is -64.

Trap review:
- Option -64: preserves the complete finite-difference pattern.
- Option -57: results from extending the wrong difference level or changing the increment.
- Option -59: results from extending the wrong difference level or changing the increment.
- Option -54: results from extending the wrong difference level or changing the increment.

---

## SER-CP-003-TMP-006 · CONSTANT_NONZERO_THIRD_DIFFERENCE · seed 4 · EASY

Which number replaces the question mark in the series: 27, 37, 49, 64, ?, 107, 137, 174

  A. 79
✓ B. 83
  C. 91
  D. 97

Rule: The second differences change by the same non-zero amount at every step.
- First differences: 10, 12, 15, 19, 24, 30, ...
- Second differences: 2, 3, 4, 5, 6, 7
- Third differences: 1, 1, 1, 1, 1
- Therefore, the required term is 83.

Trap review:
- Option 79: results from extending the wrong difference level or changing the increment.
- Option 83: preserves the complete finite-difference pattern.
- Option 91: results from extending the wrong difference level or changing the increment.
- Option 97: results from extending the wrong difference level or changing the increment.

---

## SER-CP-003-TMP-007 · CONSTANT_NONZERO_THIRD_DIFFERENCE · seed 1 · MEDIUM

Which number comes before the first shown term in the series: ?, 8, 13, 9, -6, -34, -77, -137, -216

  A. -13
  B. 6
  C. 3
✓ D. -4

Rule: The second differences change by the same non-zero amount at every step.
- First differences: 12, 5, -4, -15, -28, -43, ...
- Second differences: -7, -9, -11, -13, -15, -17, ...
- Third differences: -2, -2, -2, -2, -2, -2
- Therefore, the required term is -4.

Trap review:
- Option -13: results from extending the wrong difference level or changing the increment.
- Option 6: results from extending the wrong difference level or changing the increment.
- Option 3: results from extending the wrong difference level or changing the increment.
- Option -4: preserves the complete finite-difference pattern.

---

## SER-CP-003-TMP-007 · CONSTANT_NONZERO_THIRD_DIFFERENCE · seed 2 · HARD

Which number comes before the first shown term in the series: ?, -28, -44, -64, -91, -128, -178, -244, -329, -436

✓ A. -13
  B. -30
  C. 2
  D. -11

Rule: The second differences change by the same non-zero amount at every step.
- First differences: -15, -16, -20, -27, -37, -50, ...
- Second differences: -1, -4, -7, -10, -13, -16, ...
- Third differences: -3, -3, -3, -3, -3, -3, ...
- Therefore, the required term is -13.

Trap review:
- Option -13: preserves the complete finite-difference pattern.
- Option -30: results from extending the wrong difference level or changing the increment.
- Option 2: results from extending the wrong difference level or changing the increment.
- Option -11: results from extending the wrong difference level or changing the increment.

---

## SER-CP-003-TMP-007 · CONSTANT_NONZERO_THIRD_DIFFERENCE · seed 3 · EASY

Which number comes before the first shown term in the series: ?, 38, 42, 48, 57, 70, 88, 112

  A. 45
✓ B. 35
  C. 22
  D. 24

Rule: The second differences change by the same non-zero amount at every step.
- First differences: 3, 4, 6, 9, 13, 18, ...
- Second differences: 1, 2, 3, 4, 5, 6
- Third differences: 1, 1, 1, 1, 1
- Therefore, the required term is 35.

Trap review:
- Option 45: results from extending the wrong difference level or changing the increment.
- Option 35: preserves the complete finite-difference pattern.
- Option 22: results from extending the wrong difference level or changing the increment.
- Option 24: results from extending the wrong difference level or changing the increment.

---

## SER-CP-003-TMP-007 · CONSTANT_NONZERO_THIRD_DIFFERENCE · seed 4 · MEDIUM

Which number comes before the first shown term in the series: ?, 22, 9, -11, -39, -76, -123, -181, -251

  A. 36
  B. 45
✓ C. 29
  D. 32

Rule: The second differences change by the same non-zero amount at every step.
- First differences: -7, -13, -20, -28, -37, -47, ...
- Second differences: -6, -7, -8, -9, -10, -11, ...
- Third differences: -1, -1, -1, -1, -1, -1
- Therefore, the required term is 29.

Trap review:
- Option 36: results from extending the wrong difference level or changing the increment.
- Option 45: results from extending the wrong difference level or changing the increment.
- Option 29: preserves the complete finite-difference pattern.
- Option 32: results from extending the wrong difference level or changing the increment.

---

## SER-CP-003-TMP-008 · CONSTANT_NONZERO_THIRD_DIFFERENCE · seed 1 · HARD

Identify the wrong term in the series: -10, -26, -34, -65, -42, -50, -66, -94, -138, -202

✓ A. -65
  B. -42
  C. -138
  D. -66

Rule: The second differences change by the same non-zero amount at every step.
- First differences: -16, -8, -4, -4, -8, -16, ...
- Second differences: 8, 4, 0, -4, -8, -12, ...
- Third differences: -4, -4, -4, -4, -4, -4, ...
- -65 is the wrong term; the difference pattern requires -38 at that position.

Trap review:
- Option -65: preserves the complete finite-difference pattern.
- Option -42: this displayed term agrees with the finite-difference pattern.
- Option -138: this displayed term agrees with the finite-difference pattern.
- Option -66: this displayed term agrees with the finite-difference pattern.

---

## SER-CP-003-TMP-008 · CONSTANT_NONZERO_THIRD_DIFFERENCE · seed 2 · EASY

Identify the wrong term in the series: 33, 39, 48, 74, 79, 103, 134, 173

  A. 33
✓ B. 74
  C. 48
  D. 103

Rule: The second differences change by the same non-zero amount at every step.
- First differences: 6, 9, 13, 18, 24, 31, ...
- Second differences: 3, 4, 5, 6, 7, 8
- Third differences: 1, 1, 1, 1, 1
- 74 is the wrong term; the difference pattern requires 61 at that position.

Trap review:
- Option 33: this displayed term agrees with the finite-difference pattern.
- Option 74: preserves the complete finite-difference pattern.
- Option 48: this displayed term agrees with the finite-difference pattern.
- Option 103: this displayed term agrees with the finite-difference pattern.

---

## SER-CP-003-TMP-008 · CONSTANT_NONZERO_THIRD_DIFFERENCE · seed 3 · MEDIUM

Identify the wrong term in the series: -24, -10, -12, 10, 18, 26, 35, 46, 60

  A. 10
  B. 26
✓ C. -12
  D. 35

Rule: The second differences change by the same non-zero amount at every step.
- First differences: 14, 11, 9, 8, 8, 9, ...
- Second differences: -3, -2, -1, 0, 1, 2, ...
- Third differences: 1, 1, 1, 1, 1, 1
- -12 is the wrong term; the difference pattern requires 1 at that position.

Trap review:
- Option 10: this displayed term agrees with the finite-difference pattern.
- Option 26: this displayed term agrees with the finite-difference pattern.
- Option -12: preserves the complete finite-difference pattern.
- Option 35: this displayed term agrees with the finite-difference pattern.

---

## SER-CP-003-TMP-008 · CONSTANT_NONZERO_THIRD_DIFFERENCE · seed 4 · HARD

Identify the wrong term in the series: -28, -41, -61, -89, -126, -173, -248, -301, -384, -481

  A. -61
  B. -481
  C. -173
✓ D. -248

Rule: The second differences change by the same non-zero amount at every step.
- First differences: -13, -20, -28, -37, -47, -58, ...
- Second differences: -7, -8, -9, -10, -11, -12, ...
- Third differences: -1, -1, -1, -1, -1, -1, ...
- -248 is the wrong term; the difference pattern requires -231 at that position.

Trap review:
- Option -61: this displayed term agrees with the finite-difference pattern.
- Option -481: this displayed term agrees with the finite-difference pattern.
- Option -173: this displayed term agrees with the finite-difference pattern.
- Option -248: preserves the complete finite-difference pattern.

---
