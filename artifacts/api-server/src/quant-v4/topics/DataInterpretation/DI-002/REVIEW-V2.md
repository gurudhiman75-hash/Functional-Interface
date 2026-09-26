# DI-002 Advanced Table V2 — Editorial Review

Status: **ENGLISH_REVIEW_CANDIDATE · HUMAN APPROVAL PENDING**

This review pack samples the actual DI-002 V2 deterministic generator and covers all 12 proposed semantic families (DI-QL-097 through DI-QL-108). The V2 branch remains review-only: Question Studio, Question Bank, tests, mocks and public release are still locked.

## Review notes

- Exact linked-set balance in production: 1 Easy + 2 Medium + 2 Hard per set.
- SSC form shown here: 4 unique options. Banking uses 5.
- Percentage results that require rounding explicitly ask for the nearest whole percent.
- Explanations are question-specific; no forced shortcut/trap boilerplate.
- Generator-level cleanup applied during this review: no mixed `%` vs `percentage points` option units, no Hard `1:1` ratio collapse, and rejected-count questions avoid 50% rows where Selected = Rejected.

## Set A — `DI002-REVIEW-0`

**Scholarship applications and final selections by zone**

Study the table and answer the questions that follow. One value in the Applicants column is missing and can be found from the same row.

| Zone | Applicants | Selected | Selection % |
| --- | --- | --- | --- |
| Zone A | 3000 | 2100 | 70% |
| Zone M | 3675 | 2940 | 80% |
| Zone V | 2800 | 1680 | 60% |
| Zone T | ? | 2520 | 40% |
| Zone L | 6720 | 3360 | 50% |

### DI-QL-097 — DIRECT_SELECTED_VALUE · Easy

According to the table, how many candidates were selected from Zone A?

A. 2940  
B. 2100  
C. 2520  
D. 1680

**Answer:** B. 2100

**Explanation:** Read the required entry directly from the Selected column.

- Zone A has 2100 in the Selected column.

### DI-QL-101 — SELECTED_DIFFERENCE · Medium

Find the absolute difference in Selected values for Zone M and Zone V.

A. 4620  
B. 1680  
C. 2940  
D. 1260

**Answer:** D. 1260

**Explanation:** Use the two values from the Selected column and subtract the smaller from the larger.

- Selected values = 2940 and 1680.
- Difference = |2940 - 1680| = 1260.

### DI-QL-104 — SELECTED_SHARE_OF_TOTAL · Medium

To the nearest whole percent, what percentage of all selected candidates came from Zone A?

A. 23%  
B. 17%  
C. 70%  
D. 13%

**Answer:** B. 17%

**Explanation:** Use the requested Selected value as the part and the total of the Selected column as the whole.

- All-row Selected total = 2100 + 2940 + 1680 + 2520 + 3360 = 12600.
- Required share = 2100/12600 × 100 ≈ 17%.

### DI-QL-106 — RELATIVE_SELECTED_PERCENT_EXCESS · Hard

Taking the number selected from Zone A as the base, by what percentage is the number selected from Zone T higher? Round to the nearest whole percent.

A. 120%  
B. 20%  
C. 17%  
D. 83%

**Answer:** B. 20%

**Explanation:** For 'percent more', divide the difference by the smaller/original value.

- Difference in Selected = 2520 - 2100 = 420.
- Base = 2100.
- Percentage excess = 420/2100 × 100 ≈ 20%.

### DI-QL-107 — COMBINED_SELECTION_RATE · Hard

Find the overall selection percentage for Zone A and Zone V together. Round to the nearest whole percent.

A. 60%  
B. 65%  
C. 70%  
D. 36%

**Answer:** B. 65%

**Explanation:** A combined selection rate must use combined Selected divided by combined Applicants; do not average the two rates directly.

- Combined Selected = 2100 + 1680 = 3780.
- Combined Applicants = 3000 + 2800 = 5800.
- Overall selection rate = 3780/5800 × 100 ≈ 65%.

## Set B — `DI002-REVIEW-1`

**Applications and selections at recruitment centres**

Study the table and answer the questions that follow. One value in the Applicants column is missing and can be found from the same row.

| Centre | Applicants | Selected | Selection % |
| --- | --- | --- | --- |
| Centre K | 5880 | 2352 | 40% |
| Centre G | 2688 | 1344 | 50% |
| Centre F | 2800 | 1680 | 60% |
| Centre E | ? | 2016 | 80% |
| Centre U | 3840 | 2688 | 70% |

### DI-QL-102 — COMBINED_SELECTED · Medium

The sum of selected candidates from Centre G and Centre E is:

A. 1344  
B. 2016  
C. 672  
D. 3360

**Answer:** D. 3360

**Explanation:** Add the Selected values for the two named rows.

- Centre G: 1344; Centre E: 2016.
- Combined Selected = 1344 + 2016 = 3360.

### DI-QL-103 — SELECTION_RATE_POINT_GAP · Medium

Find the absolute gap in Selection % between Centre K and Centre G.

A. 30 percentage points  
B. 25 percentage points  
C. 10 percentage points  
D. 20 percentage points

**Answer:** C. 10 percentage points

**Explanation:** A percentage-point gap is found by subtracting the two percentage rates.

- Rates = 40% and 50%.
- Gap = |40 - 50| = 10 percentage points.

### DI-QL-105 — COMBINED_SELECTED_RATIO · Hard

Find the ratio of the total selected from Centre G and Centre F to the total selected from Centre E and Centre U.

A. 9:14  
B. 5:8  
C. 14:9  
D. 2:3

**Answer:** A. 9:14

**Explanation:** Find each named Selected subtotal first, then reduce their ratio.

- First subtotal = 1344 + 1680 = 3024.
- Second subtotal = 2016 + 2688 = 4704.
- 3024:4704 = 9:14.

## Set C — `DI002-REVIEW-83`

**Applications processed and candidates selected by service units**

Study the table and answer the questions that follow. One value in the Applicants column is missing and can be found from the same row.

| Unit | Applicants | Selected | Selection % |
| --- | --- | --- | --- |
| Unit S | 3528 | 1764 | 50% |
| Unit I | 5040 | 2016 | 40% |
| Unit U | 1260 | 1008 | 80% |
| Unit P | 2100 | 1260 | 60% |
| Unit R | ? | 1512 | 70% |

### DI-QL-098 — DIRECT_SELECTION_RATE · Easy

Find the selection rate shown for Unit R.

A. 40%  
B. 80%  
C. 70%  
D. 50%

**Answer:** C. 70%

**Explanation:** Read the required percentage directly from the Selection % column.

- Unit R shows a selection rate of 70%.

### DI-QL-099 — MISSING_APPLICANTS_FROM_RATE · Medium

The Applicants value for Unit R is missing. How many candidates applied there?

A. 2160  
B. 1260  
C. 5040  
D. 3528

**Answer:** A. 2160

**Explanation:** The Selected figure is the stated percentage of Applicants, so reverse the percentage.

- 70% of Applicants = 1512.
- Applicants = 1512 × 100 / 70 = 2160.

### DI-QL-100 — REJECTED_COUNT · Medium

How many applicants from Unit I were not selected?

A. 5040  
B. 2016  
C. 3024  
D. 1764

**Answer:** C. 3024

**Explanation:** Candidates not selected = Applicants − Selected.

- Applicants at Unit I = 5040.
- Not selected = 5040 - 2016 = 3024.

### DI-QL-108 — REJECTED_TO_SELECTED_RATIO · Hard

For Unit I and Unit U together, find the ratio of candidates not selected to candidates selected.

A. 13:12  
B. 12:13  
C. 3:2  
D. 25:12

**Answer:** A. 13:12

**Explanation:** First find rejected candidates for each row, add them, then compare the combined rejected total with the combined selected total.

- Rejected: Unit I = 5040 - 2016 = 3024; Unit U = 1260 - 1008 = 252.
- Combined Rejected = 3024 + 252 = 3276; Combined Selected = 2016 + 1008 = 3024.
- 3276:3024 = 13:12.
