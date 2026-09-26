# DI-002 Advanced Table V2 — Editorial Review (Difficulty Floor Revised)

Status: **ENGLISH_REVIEW_CANDIDATE · HUMAN APPROVAL PENDING**

This pack reflects the revised DI-002 V2 blueprint after removing trivial lookup-only questions.

## Revised difficulty policy

- No question is answered by simply copying one visible table cell.
- Easy: at least one arithmetic operation.
- Medium: at least one derived value or aggregation.
- Hard: multi-step comparison or aggregation.
- Removed families: DIRECT_SELECTED_VALUE, DIRECT_SELECTION_RATE, SELECTION_RATE_POINT_GAP.
- Added families: COMBINED_REJECTED, APPLICANTS_RATIO, AVERAGE_SELECTED_THREE_ROWS.

The V2 branch remains review-only. Question Studio, Question Bank, tests, mocks and public release are still locked.

---

## Set A

**Scholarship applications and final selections by zone**

| Zone | Applicants | Selected | Selection % |
| --- | ---: | ---: | ---: |
| Zone A | 3000 | 2100 | 70% |
| Zone M | 3675 | 2940 | 80% |
| Zone V | 2800 | 1680 | 60% |
| Zone T | ? | 2520 | 40% |
| Zone L | 6720 | 3360 | 50% |

### DI-QL-097 — SELECTED_DIFFERENCE · Easy

What is the difference between the numbers selected from Zone M and Zone V?

A. 840  
B. 1260  
C. 1680  
D. 4620

**Answer:** B. 1260

**Explanation**
- Selected from Zone M = 2940.
- Selected from Zone V = 1680.
- Difference = 2940 - 1680 = **1260**.

### DI-QL-101 — SELECTED_SHARE_OF_TOTAL · Medium

To the nearest whole percent, what percentage of all selected candidates came from Zone A?

A. 13%  
B. 17%  
C. 23%  
D. 30%

**Answer:** B. 17%

**Explanation**
- Total selected = 2100 + 2940 + 1680 + 2520 + 3360 = 12600.
- Required percentage = 2100 / 12600 × 100 = 16.67%.
- Nearest whole percent = **17%**.

### DI-QL-105 — COMBINED_SELECTED_RATIO · Hard

What is the ratio of the combined number selected from Zone A and Zone V to the combined number selected from Zone T and Zone L?

A. 9:14  
B. 14:9  
C. 7:10  
D. 3:5

**Answer:** A. 9:14

**Explanation**
- Zone A + Zone V = 2100 + 1680 = 3780.
- Zone T + Zone L = 2520 + 3360 = 5880.
- Ratio = 3780:5880 = **9:14**.

### DI-QL-106 — RELATIVE_SELECTED_PERCENT_EXCESS · Hard

The number selected from Zone T is what percent more than the number selected from Zone A?

A. 17%  
B. 20%  
C. 25%  
D. 120%

**Answer:** B. 20%

**Explanation**
- Difference = 2520 - 2100 = 420.
- Base value = 2100.
- Percentage more = 420 / 2100 × 100 = **20%**.

### DI-QL-107 — COMBINED_SELECTION_RATE · Hard

If Zone A and Zone V are considered together, what is their overall selection rate to the nearest whole percent?

A. 60%  
B. 65%  
C. 68%  
D. 70%

**Answer:** B. 65%

**Explanation**
- Combined selected = 2100 + 1680 = 3780.
- Combined applicants = 3000 + 2800 = 5800.
- Overall selection rate = 3780 / 5800 × 100 = 65.17%.
- Nearest whole percent = **65%**.

---

## Set B

**Applications and selections at recruitment centres**

| Centre | Applicants | Selected | Selection % |
| --- | ---: | ---: | ---: |
| Centre K | 5880 | 2352 | 40% |
| Centre G | 2688 | 1344 | 50% |
| Centre F | 2800 | 1680 | 60% |
| Centre E | ? | 2016 | 80% |
| Centre U | 3840 | 2688 | 70% |

### DI-QL-098 — COMBINED_SELECTED · Easy

How many candidates were selected altogether from Centre G and Centre E?

A. 2016  
B. 2688  
C. 3360  
D. 4704

**Answer:** C. 3360

**Explanation**
- Centre G selected = 1344.
- Centre E selected = 2016.
- Combined selected = 1344 + 2016 = **3360**.

### DI-QL-102 — COMBINED_REJECTED · Medium

How many applicants from Centre K and Centre G together were not selected?

A. 2184  
B. 3696  
C. 4872  
D. 8568

**Answer:** C. 4872

**Explanation**
- Centre K not selected = 5880 - 2352 = 3528.
- Centre G not selected = 2688 - 1344 = 1344.
- Combined not selected = 3528 + 1344 = **4872**.

### DI-QL-103 — APPLICANTS_RATIO · Medium

What is the ratio of applicants from Centre K to applicants from Centre G?

A. 16:35  
B. 35:16  
C. 7:4  
D. 21:8

**Answer:** B. 35:16

**Explanation**
- Applicants = 5880 and 2688.
- 5880:2688 = **35:16**.

### DI-QL-104 — AVERAGE_SELECTED_THREE_ROWS · Medium

What is the average number of candidates selected from Centre K, Centre G and Centre F?

A. 1512  
B. 1792  
C. 1848  
D. 5376

**Answer:** B. 1792

**Explanation**
- Total selected = 2352 + 1344 + 1680 = 5376.
- Average = 5376 / 3 = **1792**.

---

## Set C

**Applications processed and candidates selected by service units**

| Unit | Applicants | Selected | Selection % |
| --- | ---: | ---: | ---: |
| Unit S | 3528 | 1764 | 50% |
| Unit I | 5040 | 2016 | 40% |
| Unit U | 1260 | 1008 | 80% |
| Unit P | 2100 | 1260 | 60% |
| Unit R | ? | 1512 | 70% |

### DI-QL-099 — MISSING_APPLICANTS_FROM_RATE · Medium

The Applicants value for Unit R is missing. How many candidates applied there?

A. 1890  
B. 2100  
C. 2160  
D. 2520

**Answer:** C. 2160

**Explanation**
- 70% of Applicants = 1512.
- Applicants = 1512 × 100 / 70 = **2160**.

### DI-QL-100 — REJECTED_COUNT · Medium

How many applicants from Unit I were not selected?

A. 2016  
B. 2520  
C. 3024  
D. 5040

**Answer:** C. 3024

**Explanation**
- Applicants = 5040.
- Selected = 2016.
- Not selected = 5040 - 2016 = **3024**.

### DI-QL-108 — REJECTED_TO_SELECTED_RATIO · Hard

For Unit I and Unit U together, what is the ratio of candidates not selected to candidates selected?

A. 12:13  
B. 13:12  
C. 25:12  
D. 3:2

**Answer:** B. 13:12

**Explanation**
- Unit I not selected = 5040 - 2016 = 3024.
- Unit U not selected = 1260 - 1008 = 252.
- Combined not selected = 3276.
- Combined selected = 2016 + 1008 = 3024.
- Ratio = 3276:3024 = **13:12**.

---

## Editorial checkpoint

The revised 12-family map is:

| QL | Family | Difficulty |
| --- | --- | --- |
| DI-QL-097 | SELECTED_DIFFERENCE | Easy |
| DI-QL-098 | COMBINED_SELECTED | Easy |
| DI-QL-099 | MISSING_APPLICANTS_FROM_RATE | Medium |
| DI-QL-100 | REJECTED_COUNT | Medium |
| DI-QL-101 | SELECTED_SHARE_OF_TOTAL | Medium |
| DI-QL-102 | COMBINED_REJECTED | Medium |
| DI-QL-103 | APPLICANTS_RATIO | Medium |
| DI-QL-104 | AVERAGE_SELECTED_THREE_ROWS | Medium |
| DI-QL-105 | COMBINED_SELECTED_RATIO | Hard |
| DI-QL-106 | RELATIVE_SELECTED_PERCENT_EXCESS | Hard |
| DI-QL-107 | COMBINED_SELECTION_RATE | Hard |
| DI-QL-108 | REJECTED_TO_SELECTED_RATIO | Hard |
