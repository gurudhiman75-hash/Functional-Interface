# RAP-001 — Ratio & Proportion English Editorial Review V1

This is a review-only file for the 67 active question-language contracts. Mathematical answers and runtime generation are already validated. Review the learner-facing stem and explanation for exam realism, direct wording and simple question-specific reasoning.

## Review rule

- Stem: direct exam wording; no unnecessary opening or repeated template phrase.
- Explanation: only the calculation needed for this question; no authoring language, generic padding or repeated closing sentence.
- Keep the answer, variable contract and reasoning type unchanged unless a separate mathematical defect is found.

## Questions

### RAP-CP-001

#### 1. RAP-QL-001 · simpleLinkage · Hard

**Question:** Mother:sister = 3:4 and sister:son = 4:5. Find mother:sister:son.

**Answer:** $$3 : 4 : 5$$

**Current explanation:**

The sister part is already 4 in both ratios.

$$\Rightarrow mother:sister=3:4,\quad sister:son=4:5$$

The two ratios can therefore be joined directly.

$$\Rightarrow mother:sister:son=3:4:5$$

The three-part ratio is already in simplest form.

$$\Rightarrow 3:4:5$$

So, mother:sister:son is

$$\Rightarrow 3 : 4 : 5$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 2. RAP-QL-002 · ratioNormalization · Hard

**Question:** Convert the fractional ratio 4/5 : 2/5 into a simple integer ratio.

**Answer:** $$2 : 1$$

**Current explanation:**

Write the two fractions as a ratio.

$$\Rightarrow \frac{4}{5}:\frac{2}{5}$$

Clear the denominators by cross-multiplying.

$$\Rightarrow (4\times5):(5\times2)$$

This gives the whole-number ratio

$$\Rightarrow 20:10$$

Divide both terms by their HCF, 10.

$$\Rightarrow (20\div10):(10\div10)=2:1$$

So, the simplest integer ratio is

$$\Rightarrow 2:1$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 3. RAP-QL-003 · ratioTreeLinkage · Hard

**Question:** Father:brother = 2:3, brother:mother = 3:4, and mother:sister = 4:5. Find father:sister.

**Answer:** $$2 : 5$$

**Current explanation:**

Write the three linked ratios as fractions.

$$\Rightarrow \frac{father}{brother}=\frac{2}{3},\quad \frac{brother}{mother}=\frac{3}{4},\quad \frac{mother}{sister}=\frac{4}{5}$$

Multiply them; brother and mother cancel.

$$\Rightarrow \frac{father}{sister}=\frac{2}{3}\times\frac{3}{4}\times\frac{4}{5}$$

Simplifying the product gives

$$\Rightarrow father:sister=\(2:5\)$$

So, father:sister is

$$\Rightarrow 2 : 5$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 4. RAP-QL-004 · scalingByComponent · Medium

**Question:** A class has boys and girls in the ratio 2:3. If boys are 32, how many girls are there?

**Answer:** $$48$$

**Current explanation:**

2 ratio parts of boys equal 32.

$$\Rightarrow 2\text{ parts}=32$$

Find the value of one ratio part.

$$\Rightarrow 1\text{ part}=\frac{32}{2}=16$$

Girls have 3 ratio parts.

$$\Rightarrow girls=3\times16=48$$

So, the number of girls is

$$\Rightarrow 48$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 5. RAP-QL-006 · decimalNormalization · Medium

**Question:** What is the simplest whole-number ratio equal to 0.6 : 0.7?

**Answer:** $$6 : 7$$

**Current explanation:**

Multiply both terms by 10 to remove the decimals.

$$\Rightarrow 0.6:0.7$$

Both terms are multiplied by the same number, so the ratio does not change.

$$\Rightarrow (0.6\times10):(0.7\times10)=6:7$$

The HCF of 6 and 7 is 1.

$$\Rightarrow \operatorname{HCF}(6,7)=1$$

Divide both terms by the HCF.

$$\Rightarrow (6\div1):(7\div1)=6:7$$

So, the simplest whole-number ratio is

$$\Rightarrow 6 : 7$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 6. RAP-QL-101 · simpleLinkage · Medium

**Question:** The ratio of daughter to mother is 4:5, while the ratio of mother to sister is 5:6. What is the combined ratio of all three?

**Answer:** $$4 : 5 : 6$$

**Current explanation:**

The mother part is already 5 in both ratios.

$$\Rightarrow daughter:mother=4:5,\quad mother:sister=5:6$$

The two ratios can therefore be joined directly.

$$\Rightarrow daughter:mother:sister=4:5:6$$

The three-part ratio is already in simplest form.

$$\Rightarrow 4:5:6$$

So, daughter:mother:sister is

$$\Rightarrow 4 : 5 : 6$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 7. RAP-QL-201 · simpleLinkage · Hard

**Question:** Mother and sister are in the ratio 5:6. Sister and father are in the ratio 6:7. Write the ratio mother:sister:father.

**Answer:** $$5 : 6 : 7$$

**Current explanation:**

The sister part is already 6 in both ratios.

$$\Rightarrow mother:sister=5:6,\quad sister:father=6:7$$

The two ratios can therefore be joined directly.

$$\Rightarrow mother:sister:father=5:6:7$$

The three-part ratio is already in simplest form.

$$\Rightarrow 5:6:7$$

So, mother:sister:father is

$$\Rightarrow 5 : 6 : 7$$

**Automated review flags:** STEM_TEMPLATE_RISK

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 8. RAP-QL-301 · simpleLinkage · Medium

**Question:** Two linked ratios are given: brother:mother = 6:7 and mother:sister = 7:8. Combine them into brother:mother:sister.

**Answer:** $$6 : 7 : 8$$

**Current explanation:**

The mother part is already 7 in both ratios.

$$\Rightarrow brother:mother=6:7,\quad mother:sister=7:8$$

The two ratios can therefore be joined directly.

$$\Rightarrow brother:mother:sister=6:7:8$$

The three-part ratio is already in simplest form.

$$\Rightarrow 6:7:8$$

So, brother:mother:sister is

$$\Rightarrow 6 : 7 : 8$$

**Automated review flags:** STEM_TEMPLATE_RISK

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 9. RAP-QL-401 · simpleLinkage · Hard

**Question:** Given father:brother = 7:8 and brother:son = 8:1, find the single ratio connecting father, brother, and son.

**Answer:** $$7 : 8 : 1$$

**Current explanation:**

The brother part is already 8 in both ratios.

$$\Rightarrow father:brother=7:8,\quad brother:son=8:1$$

The two ratios can therefore be joined directly.

$$\Rightarrow father:brother:son=7:8:1$$

The three-part ratio is already in simplest form.

$$\Rightarrow 7:8:1$$

So, father:brother:son is

$$\Rightarrow 7 : 8 : 1$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 10. RAP-QL-102 · ratioNormalization · Medium

**Question:** Simplify the ratio of fractions 1/2 : 3/7 to whole numbers.

**Answer:** $$7 : 6$$

**Current explanation:**

Write the two fractions as a ratio.

$$\Rightarrow \frac{1}{2}:\frac{3}{7}$$

Clear the denominators by cross-multiplying.

$$\Rightarrow (1\times7):(2\times3)$$

This gives the whole-number ratio

$$\Rightarrow 7:6$$

Divide both terms by their HCF, 1.

$$\Rightarrow (7\div1):(6\div1)=7:6$$

So, the simplest integer ratio is

$$\Rightarrow 7:6$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 11. RAP-QL-202 · ratioNormalization · Hard

**Question:** Find the simplest integer ratio equivalent to 3/4 : 3/7.

**Answer:** $$7 : 4$$

**Current explanation:**

Write the two fractions as a ratio.

$$\Rightarrow \frac{3}{4}:\frac{3}{7}$$

Clear the denominators by cross-multiplying.

$$\Rightarrow (3\times7):(4\times3)$$

This gives the whole-number ratio

$$\Rightarrow 21:12$$

Divide both terms by their HCF, 3.

$$\Rightarrow (21\div3):(12\div3)=7:4$$

So, the simplest integer ratio is

$$\Rightarrow 7:4$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 12. RAP-QL-302 · ratioNormalization · Medium

**Question:** Express the ratio 5/6 : 3/7 in its simplest integer form.

**Answer:** $$35 : 18$$

**Current explanation:**

Write the two fractions as a ratio.

$$\Rightarrow \frac{5}{6}:\frac{3}{7}$$

Clear the denominators by cross-multiplying.

$$\Rightarrow (5\times7):(6\times3)$$

This gives the whole-number ratio

$$\Rightarrow 35:18$$

Divide both terms by their HCF, 1.

$$\Rightarrow (35\div1):(18\div1)=35:18$$

So, the simplest integer ratio is

$$\Rightarrow 35:18$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 13. RAP-QL-402 · ratioNormalization · Hard

**Question:** What is the simple ratio of whole numbers for 2/3 : 4/9?

**Answer:** $$3 : 2$$

**Current explanation:**

Write the two fractions as a ratio.

$$\Rightarrow \frac{2}{3}:\frac{4}{9}$$

Clear the denominators by cross-multiplying.

$$\Rightarrow (2\times9):(3\times4)$$

This gives the whole-number ratio

$$\Rightarrow 18:12$$

Divide both terms by their HCF, 6.

$$\Rightarrow (18\div6):(12\div6)=3:2$$

So, the simplest integer ratio is

$$\Rightarrow 3:2$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 14. RAP-QL-502 · ratioNormalization · Medium

**Question:** Reduce the fractional ratio 4/5 : 4/9 to its lowest whole number terms.

**Answer:** $$9 : 5$$

**Current explanation:**

Write the two fractions as a ratio.

$$\Rightarrow \frac{4}{5}:\frac{4}{9}$$

Clear the denominators by cross-multiplying.

$$\Rightarrow (4\times9):(5\times4)$$

This gives the whole-number ratio

$$\Rightarrow 36:20$$

Divide both terms by their HCF, 4.

$$\Rightarrow (36\div4):(20\div4)=9:5$$

So, the simplest integer ratio is

$$\Rightarrow 9:5$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 15. RAP-QL-602 · ratioNormalization · Hard

**Question:** Normalize the ratio 1/2 : 1/3.

**Answer:** $$3 : 2$$

**Current explanation:**

Write the two fractions as a ratio.

$$\Rightarrow \frac{1}{2}:\frac{1}{3}$$

Clear the denominators by cross-multiplying.

$$\Rightarrow (1\times3):(2\times1)$$

This gives the whole-number ratio

$$\Rightarrow 3:2$$

Divide both terms by their HCF, 1.

$$\Rightarrow (3\div1):(2\div1)=3:2$$

So, the simplest integer ratio is

$$\Rightarrow 3:2$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 16. RAP-QL-702 · ratioNormalization · Hard

**Question:** Rewrite 3/4 : 1/3 as a ratio of integers.

**Answer:** $$9 : 4$$

**Current explanation:**

Write the two fractions as a ratio.

$$\Rightarrow \frac{3}{4}:\frac{1}{3}$$

Clear the denominators by cross-multiplying.

$$\Rightarrow (3\times3):(4\times1)$$

This gives the whole-number ratio

$$\Rightarrow 9:4$$

Divide both terms by their HCF, 1.

$$\Rightarrow (9\div1):(4\div1)=9:4$$

So, the simplest integer ratio is

$$\Rightarrow 9:4$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 17. RAP-QL-802 · ratioNormalization · Medium

**Question:** Find the integer ratio equivalent to 5/6 : 1/3.

**Answer:** $$5 : 2$$

**Current explanation:**

Write the two fractions as a ratio.

$$\Rightarrow \frac{5}{6}:\frac{1}{3}$$

Clear the denominators by cross-multiplying.

$$\Rightarrow (5\times3):(6\times1)$$

This gives the whole-number ratio

$$\Rightarrow 15:6$$

Divide both terms by their HCF, 3.

$$\Rightarrow (15\div3):(6\div3)=5:2$$

So, the simplest integer ratio is

$$\Rightarrow 5:2$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 18. RAP-QL-902 · ratioNormalization · Hard

**Question:** Convert 2/3 : 2/5 into an irreducible whole number ratio.

**Answer:** $$5 : 3$$

**Current explanation:**

Write the two fractions as a ratio.

$$\Rightarrow \frac{2}{3}:\frac{2}{5}$$

Clear the denominators by cross-multiplying.

$$\Rightarrow (2\times5):(3\times2)$$

This gives the whole-number ratio

$$\Rightarrow 10:6$$

Divide both terms by their HCF, 2.

$$\Rightarrow (10\div2):(6\div2)=5:3$$

So, the simplest integer ratio is

$$\Rightarrow 5:3$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 19. RAP-QL-1002 · ratioNormalization · Easy

**Question:** Determine the simplest whole-number ratio for 5/6 : 2/5.

**Answer:** $$25 : 12$$

**Current explanation:**

Write the two fractions as a ratio.

$$\Rightarrow \frac{5}{6}:\frac{2}{5}$$

Clear the denominators by cross-multiplying.

$$\Rightarrow (5\times5):(6\times2)$$

This gives the whole-number ratio

$$\Rightarrow 25:12$$

Divide both terms by their HCF, 1.

$$\Rightarrow (25\div1):(12\div1)=25:12$$

So, the simplest integer ratio is

$$\Rightarrow 25:12$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 20. RAP-QL-1102 · ratioNormalization · Medium

**Question:** State the fractional ratio 2/3 : 3/7 in integers.

**Answer:** $$14 : 9$$

**Current explanation:**

Write the two fractions as a ratio.

$$\Rightarrow \frac{2}{3}:\frac{3}{7}$$

Clear the denominators by cross-multiplying.

$$\Rightarrow (2\times7):(3\times3)$$

This gives the whole-number ratio

$$\Rightarrow 14:9$$

Divide both terms by their HCF, 1.

$$\Rightarrow (14\div1):(9\div1)=14:9$$

So, the simplest integer ratio is

$$\Rightarrow 14:9$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 21. RAP-QL-1202 · ratioNormalization · Easy

**Question:** Calculate the simple integer ratio corresponding to 4/5 : 3/7.

**Answer:** $$28 : 15$$

**Current explanation:**

Write the two fractions as a ratio.

$$\Rightarrow \frac{4}{5}:\frac{3}{7}$$

Clear the denominators by cross-multiplying.

$$\Rightarrow (4\times7):(5\times3)$$

This gives the whole-number ratio

$$\Rightarrow 28:15$$

Divide both terms by their HCF, 1.

$$\Rightarrow (28\div1):(15\div1)=28:15$$

So, the simplest integer ratio is

$$\Rightarrow 28:15$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 22. RAP-QL-1302 · ratioNormalization · Medium

**Question:** Translate 1/2 : 4/9 into a ratio of whole numbers.

**Answer:** $$9 : 8$$

**Current explanation:**

Write the two fractions as a ratio.

$$\Rightarrow \frac{1}{2}:\frac{4}{9}$$

Clear the denominators by cross-multiplying.

$$\Rightarrow (1\times9):(2\times4)$$

This gives the whole-number ratio

$$\Rightarrow 9:8$$

Divide both terms by their HCF, 1.

$$\Rightarrow (9\div1):(8\div1)=9:8$$

So, the simplest integer ratio is

$$\Rightarrow 9:8$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 23. RAP-QL-1402 · ratioNormalization · Easy

**Question:** Give the simplest integer format for the ratio 3/4 : 4/9.

**Answer:** $$27 : 16$$

**Current explanation:**

Write the two fractions as a ratio.

$$\Rightarrow \frac{3}{4}:\frac{4}{9}$$

Clear the denominators by cross-multiplying.

$$\Rightarrow (3\times9):(4\times4)$$

This gives the whole-number ratio

$$\Rightarrow 27:16$$

Divide both terms by their HCF, 1.

$$\Rightarrow (27\div1):(16\div1)=27:16$$

So, the simplest integer ratio is

$$\Rightarrow 27:16$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 24. RAP-QL-1502 · ratioNormalization · Easy

**Question:** Find the cross-multiplied and simplified integer ratio of 5/6 to 4/9.

**Answer:** $$15 : 8$$

**Current explanation:**

Write the two fractions as a ratio.

$$\Rightarrow \frac{5}{6}:\frac{4}{9}$$

Clear the denominators by cross-multiplying.

$$\Rightarrow (5\times9):(6\times4)$$

This gives the whole-number ratio

$$\Rightarrow 45:24$$

Divide both terms by their HCF, 3.

$$\Rightarrow (45\div3):(24\div3)=15:8$$

So, the simplest integer ratio is

$$\Rightarrow 15:8$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 25. RAP-QL-1602 · ratioNormalization · Hard

**Question:** Provide the whole number ratio for 2/3 : 1/3.

**Answer:** $$2 : 1$$

**Current explanation:**

Write the two fractions as a ratio.

$$\Rightarrow \frac{2}{3}:\frac{1}{3}$$

Clear the denominators by cross-multiplying.

$$\Rightarrow (2\times3):(3\times1)$$

This gives the whole-number ratio

$$\Rightarrow 6:3$$

Divide both terms by their HCF, 3.

$$\Rightarrow (6\div3):(3\div3)=2:1$$

So, the simplest integer ratio is

$$\Rightarrow 2:1$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 26. RAP-QL-1702 · ratioNormalization · Easy

**Question:** Express 4/5 to 1/3 as a ratio of integers in simplest form.

**Answer:** $$12 : 5$$

**Current explanation:**

Write the two fractions as a ratio.

$$\Rightarrow \frac{4}{5}:\frac{1}{3}$$

Clear the denominators by cross-multiplying.

$$\Rightarrow (4\times3):(5\times1)$$

This gives the whole-number ratio

$$\Rightarrow 12:5$$

Divide both terms by their HCF, 1.

$$\Rightarrow (12\div1):(5\div1)=12:5$$

So, the simplest integer ratio is

$$\Rightarrow 12:5$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 27. RAP-QL-1802 · ratioNormalization · Hard

**Question:** Reduce 1/2 : 2/5 to the simplest integer ratio.

**Answer:** $$5 : 4$$

**Current explanation:**

Write the two fractions as a ratio.

$$\Rightarrow \frac{1}{2}:\frac{2}{5}$$

Clear the denominators by cross-multiplying.

$$\Rightarrow (1\times5):(2\times2)$$

This gives the whole-number ratio

$$\Rightarrow 5:4$$

Divide both terms by their HCF, 1.

$$\Rightarrow (5\div1):(4\div1)=5:4$$

So, the simplest integer ratio is

$$\Rightarrow 5:4$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 28. RAP-QL-1902 · ratioNormalization · Easy

**Question:** Change the ratio 3/4 : 2/5 to whole numbers.

**Answer:** $$15 : 8$$

**Current explanation:**

Write the two fractions as a ratio.

$$\Rightarrow \frac{3}{4}:\frac{2}{5}$$

Clear the denominators by cross-multiplying.

$$\Rightarrow (3\times5):(4\times2)$$

This gives the whole-number ratio

$$\Rightarrow 15:8$$

Divide both terms by their HCF, 1.

$$\Rightarrow (15\div1):(8\div1)=15:8$$

So, the simplest integer ratio is

$$\Rightarrow 15:8$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 29. RAP-QL-103 · ratioTreeLinkage · Easy

**Question:** The ages of son, father, brother, and mother satisfy son:father = 1:2, father:brother = 2:3, and brother:mother = 3:4. Find the age ratio son:mother.

**Answer:** $$1 : 4$$

**Current explanation:**

Write the three linked ratios as fractions.

$$\Rightarrow \frac{son}{father}=\frac{1}{2},\quad \frac{father}{brother}=\frac{2}{3},\quad \frac{brother}{mother}=\frac{3}{4}$$

Multiply them; father and brother cancel.

$$\Rightarrow \frac{son}{mother}=\frac{1}{2}\times\frac{2}{3}\times\frac{3}{4}$$

Simplifying the product gives

$$\Rightarrow son:mother=\(1:4\)$$

So, son:mother is

$$\Rightarrow 1 : 4$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 30. RAP-QL-203 · ratioTreeLinkage · Hard

**Question:** Starting from father:brother = 8:1, then brother:mother = 1:2, and then mother:daughter = 2:3, determine father:daughter.

**Answer:** $$8 : 3$$

**Current explanation:**

Write the three linked ratios as fractions.

$$\Rightarrow \frac{father}{brother}=\frac{8}{1},\quad \frac{brother}{mother}=\frac{1}{2},\quad \frac{mother}{daughter}=\frac{2}{3}$$

Multiply them; brother and mother cancel.

$$\Rightarrow \frac{father}{daughter}=\frac{8}{1}\times\frac{1}{2}\times\frac{2}{3}$$

Simplifying the product gives

$$\Rightarrow father:daughter=\(8:3\)$$

So, father:daughter is

$$\Rightarrow 8 : 3$$

**Automated review flags:** STEM_TEMPLATE_RISK

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 31. RAP-QL-303 · ratioTreeLinkage · Easy

**Question:** Connect these three ratios and find the end ratio: daughter:father = 7:8, father:brother = 8:1, brother:mother = 1:2.

**Answer:** $$7 : 2$$

**Current explanation:**

Write the three linked ratios as fractions.

$$\Rightarrow \frac{daughter}{father}=\frac{7}{8},\quad \frac{father}{brother}=\frac{8}{1},\quad \frac{brother}{mother}=\frac{1}{2}$$

Multiply them; father and brother cancel.

$$\Rightarrow \frac{daughter}{mother}=\frac{7}{8}\times\frac{8}{1}\times\frac{1}{2}$$

Simplifying the product gives

$$\Rightarrow daughter:mother=\(7:2\)$$

So, daughter:mother is

$$\Rightarrow 7 : 2$$

**Automated review flags:** STEM_TEMPLATE_RISK

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 32. RAP-QL-403 · ratioTreeLinkage · Hard

**Question:** The ratios linking sister to brother are sister:son = 6:7, son:father = 7:8, and father:brother = 8:1. Find sister:brother.

**Answer:** $$6 : 1$$

**Current explanation:**

Write the three linked ratios as fractions.

$$\Rightarrow \frac{sister}{son}=\frac{6}{7},\quad \frac{son}{father}=\frac{7}{8},\quad \frac{father}{brother}=\frac{8}{1}$$

Multiply them; son and father cancel.

$$\Rightarrow \frac{sister}{brother}=\frac{6}{7}\times\frac{7}{8}\times\frac{8}{1}$$

Simplifying the product gives

$$\Rightarrow sister:brother=\(6:1\)$$

So, sister:brother is

$$\Rightarrow 6 : 1$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 33. RAP-QL-104 · scalingByComponent · Easy

**Question:** The ratio of boys to girls in class is 3:4. When the count of boys is 15, find the count of girls.

**Answer:** $$20$$

**Current explanation:**

3 ratio parts of boys equal 15.

$$\Rightarrow 3\text{ parts}=15$$

Find the value of one ratio part.

$$\Rightarrow 1\text{ part}=\frac{15}{3}=5$$

Girls have 4 ratio parts.

$$\Rightarrow girls=4\times5=20$$

So, the number of girls is

$$\Rightarrow 20$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 34. RAP-QL-204 · scalingByComponent · Medium

**Question:** Boys:girls = 4:5 for class. Given 76 boys, calculate the number of girls.

**Answer:** $$95$$

**Current explanation:**

4 ratio parts of boys equal 76.

$$\Rightarrow 4\text{ parts}=76$$

Find the value of one ratio part.

$$\Rightarrow 1\text{ part}=\frac{76}{4}=19$$

Girls have 5 ratio parts.

$$\Rightarrow girls=5\times19=95$$

So, the number of girls is

$$\Rightarrow 95$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 35. RAP-QL-304 · scalingByComponent · Easy

**Question:** Class reports boys:girls as 5:6. If the boys count is 40, what should the girls count be?

**Answer:** $$48$$

**Current explanation:**

5 ratio parts of boys equal 40.

$$\Rightarrow 5\text{ parts}=40$$

Find the value of one ratio part.

$$\Rightarrow 1\text{ part}=\frac{40}{5}=8$$

Girls have 6 ratio parts.

$$\Rightarrow girls=6\times8=48$$

So, the number of girls is

$$\Rightarrow 48$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 36. RAP-QL-404 · scalingByComponent · Medium

**Question:** For class, boys and girls follow the ratio 6:7. With 18 boys, find the matching number of girls.

**Answer:** $$21$$

**Current explanation:**

6 ratio parts of boys equal 18.

$$\Rightarrow 6\text{ parts}=18$$

Find the value of one ratio part.

$$\Rightarrow 1\text{ part}=\frac{18}{6}=3$$

Girls have 7 ratio parts.

$$\Rightarrow girls=7\times3=21$$

So, the number of girls is

$$\Rightarrow 21$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 37. RAP-QL-206 · decimalNormalization · Medium

**Question:** Calculate the simplest whole-number ratio equal to 1 : 1.7?

**Answer:** $$10 : 17$$

**Current explanation:**

Multiply both terms by 10 to remove the decimals.

$$\Rightarrow 1:1.7$$

Both terms are multiplied by the same number, so the ratio does not change.

$$\Rightarrow (1\times10):(1.7\times10)=10:17$$

The HCF of 10 and 17 is 1.

$$\Rightarrow \operatorname{HCF}(10,17)=1$$

Divide both terms by the HCF.

$$\Rightarrow (10\div1):(17\div1)=10:17$$

So, the simplest whole-number ratio is

$$\Rightarrow 10 : 17$$

**Automated review flags:** STEM_TEMPLATE_RISK

**Editorial decision:** PENDING

**Reviewer note:**

---

### RAP-CP-002

#### 38. RAP-QL-008 · shareDifference · Easy

**Question:** An amount of Rs. 1000 is distributed among boys, girls, and teachers in the ratio 4:3:3. Find the difference between boys' share and teachers' share.

**Answer:** $$100$$

**Current explanation:**

Add the ratio parts.

$$\Rightarrow 4+3+3=10$$

Find the amount represented by one ratio part.

$$\Rightarrow 1\text{ part}=\frac{1000}{10}=100$$

Boys and teachers differ by 1 ratio part.

$$\Rightarrow (4-3)\times100=100$$

So, the difference between their shares is

$$\Rightarrow 100$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 39. RAP-QL-009 · reversePartition · Easy

**Question:** A family fund is divided among daughter, mother, and sister in the ratio 5:4:4. The share of daughter exceeds the share of sister by Rs. 180. Find the total fund.

**Answer:** $$2340$$

**Current explanation:**

Convert the given share difference into ratio parts.

$$\Rightarrow 5-4=1\text{ parts}$$

Find the value of one ratio part.

$$\Rightarrow 1\text{ part}=\frac{180}{1}=180$$

The complete ratio contains 13 parts.

$$\Rightarrow (5+4+4)\times180=2340$$

So, the total fund is

$$\Rightarrow 2340$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 40. RAP-QL-011 · salaryDistribution · Easy

**Question:** Father's monthly expense-to-savings ratio is 4:4. If the monthly salary is Rs. 38400, find the monthly savings.

**Answer:** $$19200$$

**Current explanation:**

Add the expense and savings parts.

$$\Rightarrow 4+4=8$$

Find the value of one part.

$$\Rightarrow 1\text{ part}=\frac{38400}{8}=4800$$

Savings correspond to 4 parts.

$$\Rightarrow 4\times4800=19200$$

So, the monthly savings are

$$\Rightarrow 19200$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 41. RAP-QL-107 · basicPartition · Hard

**Question:** A total of 600 is distributed among girls, boys, and teachers in the ratio 1:2:3. Find teachers' share.

**Answer:** $$300$$

**Current explanation:**

Add the ratio parts.

$$\Rightarrow 1+2+3=6$$

Find one part.

$$\Rightarrow \frac{600}{6}=100$$

Teachers have 3 parts.

$$\Rightarrow 3\times100=300$$

So, teachers' share is 300.

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---

### RAP-CP-003

#### 42. RAP-QL-012 · twoStateAddition · Medium

**Question:** A class has boys and girls in the ratio 4:6. After 7 more boys join, the ratio becomes 47:60. How many boys were there at the beginning?

**Answer:** $$40$$

**Current explanation:**

Let the original numbers be the given ratio multiplied by x.

$$\Rightarrow 4x:6x$$

After 7 are added to boys,

$$\Rightarrow \frac{4x+7}{6x}=\frac{47}{60}$$

Solving the equation gives

$$\Rightarrow x=10$$

The original number of boys was

$$\Rightarrow 4\times10=40$$

So, boys originally numbered

$$\Rightarrow 40$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 43. RAP-QL-013 · twoStateSubtraction · Medium

**Question:** The ratio of boys to girls in a class is 4:3. After 16 boys leave, the ratio changes to 4:7. What was the total number of people at the start?

**Answer:** $$49$$

**Current explanation:**

Let the original numbers be the ratio parts multiplied by x.

$$\Rightarrow 4x:3x$$

After 16 are removed from boys,

$$\Rightarrow \frac{4x-16}{3x}=\frac{4}{7}$$

Solving the equation gives

$$\Rightarrow x=7$$

The original total was

$$\Rightarrow (4+3)\times7=49$$

So, the original total was

$$\Rightarrow 49$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 44. RAP-QL-014 · twoStateTransfer · Medium

**Question:** Two numbers are in the ratio 2:7. If 20 is added to each, the ratio becomes 16:31. What is the value of the larger number?

**Answer:** $$42$$

**Current explanation:**

Let the two numbers be the ratio parts multiplied by x.

$$\Rightarrow 2x:7x$$

Adding 20 to both numbers gives

$$\Rightarrow \frac{2x+20}{7x+20}=\frac{16}{31}$$

Solving the equation gives

$$\Rightarrow x=6$$

The larger original number is

$$\Rightarrow 7\times6=42$$

So, the larger number is

$$\Rightarrow 42$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 45. RAP-QL-015 · incomeExpenditureSystem · Hard

**Question:** The incomes of sister and mother are in the ratio 4:2, and their expenses are 5:2. If both save Rs. 2000 each, what is sister's income?

**Answer:** $$12000$$

**Current explanation:**

Let the income ratio use multiplier x and the expenditure ratio use multiplier y.

$$\Rightarrow 4x,2x;\quad 5y,2y$$

For each person, savings equal income minus expenditure.

$$\Rightarrow 4x-5y=2000,\quad 2x-2y=2000$$

Solving the two equations gives the income multiplier.

$$\Rightarrow x=3000$$

The first person's income is

$$\Rightarrow 4\times3000=12000$$

So, the required income is

$$\Rightarrow 12000$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 46. RAP-QL-016 · multiStageTransformation · Hard

**Question:** A school has boys and girls in the ratio 7:2. After 14 boys join and 12 girls leave, the ratio becomes 63:2. How many girls were there originally?

**Answer:** $$14$$

**Current explanation:**

Let the original numbers be the ratio parts multiplied by x.

$$\Rightarrow 7x:2x$$

Apply the stated addition and removal before forming the new ratio.

$$\Rightarrow \frac{7x+14}{2x-12}=\frac{63}{2}$$

Solving the equation gives

$$\Rightarrow x=7$$

The original second-group count was

$$\Rightarrow 2\times7=14$$

So, the original number was

$$\Rightarrow 14$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 47. RAP-QL-113 · twoStateSubtraction · Medium

**Question:** The ratio of boys to girls in class is 5:4. After 19 boys leave, the ratio changes to 11:24. What was the total number of people at the start?

**Answer:** $$54$$

**Current explanation:**

Let the original numbers be the ratio parts multiplied by x.

$$\Rightarrow 5x:4x$$

After 19 are removed from boys,

$$\Rightarrow \frac{5x-19}{4x}=\frac{11}{24}$$

Solving the equation gives

$$\Rightarrow x=6$$

The original total was

$$\Rightarrow (5+4)\times6=54$$

So, the original total was

$$\Rightarrow 54$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 48. RAP-QL-214 · twoStateTransfer · Hard

**Question:** Two numbers are in the ratio 4:9. If 2 is added to each, the ratio becomes 6:13. Find the larger number.

**Answer:** $$63$$

**Current explanation:**

Let the two numbers be the ratio parts multiplied by x.

$$\Rightarrow 4x:9x$$

Adding 2 to both numbers gives

$$\Rightarrow \frac{4x+2}{9x+2}=\frac{6}{13}$$

Solving the equation gives

$$\Rightarrow x=7$$

The larger original number is

$$\Rightarrow 9\times7=63$$

So, the larger number is

$$\Rightarrow 63$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---

### RAP-CP-004

#### 49. RAP-QL-017 · meanProportional · Medium

**Question:** What is the mean proportional between 100 and 121?

**Answer:** $$110$$

**Current explanation:**

Let the mean proportional be x.

$$\Rightarrow a:x=x:b$$

Cross-multiplication gives

$$\Rightarrow x^2=100\times121$$

Taking the positive square root,

$$\Rightarrow x=\sqrt{100\times121}=110$$

So, the mean proportional is

$$\Rightarrow 110$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 50. RAP-QL-018 · thirdProportional · Easy

**Question:** What will be the third proportional to 36 and 36?

**Answer:** $$36$$

**Current explanation:**

Let the third proportional be x.

$$\Rightarrow 36:36=36:x$$

Cross-multiply.

$$\Rightarrow 36x=36^2$$

This gives

$$\Rightarrow x=\frac{36^2}{36}=36$$

So, the third proportional is

$$\Rightarrow 36$$

**Automated review flags:** STEM_TEMPLATE_RISK

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 51. RAP-QL-019 · fourthProportional · Medium

**Question:** Find the number which is fourth proportional to 3, 4, and 21.

**Answer:** $$28$$

**Current explanation:**

Let the fourth proportional be x.

$$\Rightarrow 3:4=21:x$$

Cross-multiply.

$$\Rightarrow 3x=4\times21$$

This gives

$$\Rightarrow x=\frac{4\times21}{3}=28$$

So, the fourth proportional is

$$\Rightarrow 28$$

**Automated review flags:** STEM_TEMPLATE_RISK

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 52. RAP-QL-020 · directVariation · Medium

**Question:** If y varies directly as x, and y is 135 when x is 15, what will be the value of y when x is 16?

**Answer:** $$144$$

**Current explanation:**

For direct variation, y/x is constant.

$$\Rightarrow \frac{y}{x}=k$$

Find the constant from the first pair.

$$\Rightarrow k=\frac{135}{15}=9$$

When x=16,

$$\Rightarrow y=9\times16=144$$

So, the new value of y is

$$\Rightarrow 144$$

**Automated review flags:** STEM_TEMPLATE_RISK

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 53. RAP-QL-021 · inverseVariation · Medium

**Question:** If y is inversely proportional to x, and y is 64 when x is 16, find the value of y when x becomes 1.

**Answer:** $$1024$$

**Current explanation:**

For inverse variation, xy is constant.

$$\Rightarrow xy=k$$

Find the constant from the first pair.

$$\Rightarrow k=16\times64=1024$$

When x=1,

$$\Rightarrow y=\frac{1024}{1}=1024$$

So, the new value of y is

$$\Rightarrow 1024$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 54. RAP-QL-217 · meanProportional · Medium

**Question:** Calculate the mean proportional between 144 and 81?

**Answer:** $$108$$

**Current explanation:**

Let the mean proportional be x.

$$\Rightarrow a:x=x:b$$

Cross-multiplication gives

$$\Rightarrow x^2=144\times81$$

Taking the positive square root,

$$\Rightarrow x=\sqrt{144\times81}=108$$

So, the mean proportional is

$$\Rightarrow 108$$

**Automated review flags:** STEM_TEMPLATE_RISK

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 55. RAP-QL-219 · fourthProportional · Medium

**Question:** Determine the number which is fourth proportional to 5, 6, and 45.

**Answer:** $$54$$

**Current explanation:**

Let the fourth proportional be x.

$$\Rightarrow 5:6=45:x$$

Cross-multiply.

$$\Rightarrow 5x=6\times45$$

This gives

$$\Rightarrow x=\frac{6\times45}{5}=54$$

So, the fourth proportional is

$$\Rightarrow 54$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---

### RAP-CP-005

#### 56. RAP-QL-022 · coinCounting · Hard

**Question:** A bag has coins of 1, 2, and 5 in the ratio 2:3:4. If the total value is Rs. 84, how many coins of 2 are in the bag?

**Answer:** $$9$$

**Current explanation:**

Let the coin counts be the ratio parts multiplied by x.

$$\Rightarrow 2x:3x:4x$$

Multiply each count by its denomination to form the total value.

$$\Rightarrow 2x\times1+3x\times2+4x\times5=84$$

One ratio unit is

$$\Rightarrow x=\frac{84}{28}=3$$

The number of 2-value coins is

$$\Rightarrow 3\times3=9$$

So, there are 9 coins of denomination 2

$$\Rightarrow 9$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 57. RAP-QL-023 · multiDenominationMapping · Hard

**Question:** A box contains 14 coins of 1, 2, 5, and 10. If their values are in the ratio 1:3:10:25, what is the number of 10 coins?

**Answer:** $$5$$

**Current explanation:**

Convert value ratio into count ratio by dividing by denomination.

$$\Rightarrow \frac{1}{1}:\frac{3}{2}:\frac{10}{5}:\frac{25}{10}$$

The resulting count ratio is

$$\Rightarrow 2:3:4:5$$

Use the total number of coins to find one ratio unit.

$$\Rightarrow 1\text{ unit}=\frac{14}{14}=1$$

The count of denomination 10 is

$$\Rightarrow 5\times1=5$$

So, the number of 10-value coins is

$$\Rightarrow 5$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 58. RAP-QL-024 · weightedMapping · Hard

**Question:** The weights of Rs. 2 coin, Rs. 1 coin, and Rs. 5 coin are in the ratio 4:5:6. If one Rs. 2 coin, 2 Rs. 1 coins, and 3 Rs. 5 coins together weigh 32 g, find the weight of one Rs. 2 coin.

**Answer:** $$4$$

**Current explanation:**

Let one weight-ratio unit be x grams.

$$\Rightarrow 4x:5x:6x$$

Use the given numbers of items to form the total weight.

$$\Rightarrow 1(4x)+2(5x)+3(6x)=32$$

Solve for one ratio unit.

$$\Rightarrow x=\frac{32}{32}=1$$

The first item's weight is

$$\Rightarrow 4\times1=4$$

So, the first coin's weight in grams is

$$\Rightarrow 4$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 59. RAP-QL-026 · weightedMarks · Hard

**Question:** Marks in History, Mathematics, and English are in the ratio 1:2:3. Their weights are 3, 4, and 1, and the total weighted score is 126. How many marks were obtained in History?

**Answer:** $$9$$

**Current explanation:**

Let the marks be the ratio parts multiplied by x.

$$\Rightarrow 1x:2x:3x$$

Apply the given weights to the marks.

$$\Rightarrow 1x\times3+2x\times4+3x\times1=126$$

Solve for x.

$$\Rightarrow x=\frac{126}{14}=9$$

History marks are

$$\Rightarrow 1\times9=9$$

So, the marks obtained in History are

$$\Rightarrow 9$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---

### RAP-CP-006

#### 60. RAP-QL-027 · binaryMixture · Hard

**Question:** A mixture contains juice and water in the ratio 3:4. If 10 litres of juice are added, the ratio becomes 7:6. What was the initial quantity of water?

**Answer:** $$24$$

**Current explanation:**

Let the original quantities be the ratio parts multiplied by x.

$$\Rightarrow juice:water=3x:4x$$

After adding 10 litres of juice,

$$\Rightarrow \frac{3x+10}{4x}=\frac{7}{6}$$

Solving gives

$$\Rightarrow x=6$$

The original quantity of water was

$$\Rightarrow 4\times6=24$$

So, the initial quantity of water was

$$\Rightarrow 24$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 61. RAP-QL-028 · mixtureComponentFinding · Hard

**Question:** A 20-litre mixture has juice and water in the ratio 2:3. How many litres of water should be added to make the ratio 8:31?

**Answer:** $$19$$

**Current explanation:**

Find the original amounts of juice and water.

$$\Rightarrow juice=\frac{20\times2}{5}=8,\quad water=\frac{20\times3}{5}=12$$

Let x litres of water be added.

$$\Rightarrow \frac{8}{12+x}=\frac{8}{31}$$

Cross-multiplying gives

$$\Rightarrow 31\times8=8(12+x)$$

Solving for x gives

$$\Rightarrow x=19$$

So, 19 litres of water should be added

$$\Rightarrow 19$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 62. RAP-QL-029 · threeComponentMixture · Hard

**Question:** A solution has milk, water, and juice in the ratio 7:8:1. After adding 16 litres of water, the new ratio becomes 7:10:1. Find the starting volume.

**Answer:** $$128$$

**Current explanation:**

Let the original quantities be proportional to x.

$$\Rightarrow 7x:8x:1x$$

The first component is unchanged, so it determines the scale of the final ratio.

$$\Rightarrow \text{final ratio unit}=\frac{7x}{7}$$

After adding 16 litres of water,

$$\Rightarrow 8x+16=10\left(\frac{7x}{7}\right)$$

Solve for one original ratio part.

$$\Rightarrow 2x=16\Rightarrow x=8$$

The original mixture contains 16 ratio parts.

$$\Rightarrow (7+8+1)\times8=128$$

So, the original volume was

$$\Rightarrow 128$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 63. RAP-QL-030 · variableReplacementRatio · Hard

**Question:** From 80 litres of water, 15 litres are replaced with milk, and then 20 litres are again replaced with milk. What is the final ratio of water to milk?

**Answer:** $$39 : 25$$

**Current explanation:**

First replacement leaves water.

$$\Rightarrow 80-15=65$$

Use the second retention fraction.

$$\Rightarrow 1-\frac{20}{80}=\frac{60}{80}$$

Keep the ratio exact.

$$\Rightarrow water:milk=3900:2500$$

Reduce the ratio.

$$\Rightarrow 3900:2500=39 : 25$$

So, the final water:milk ratio is 39 : 25.

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 64. RAP-QL-032 · acidConcentration · Hard

**Question:** A solution contains 5 litres of acid and 25 litres of water. What is the percentage of acid in the solution?

**Answer:** $$16.6667\%$$

**Current explanation:**

First find the total volume of the solution.

$$\Rightarrow 5+25=30$$

Acid percentage equals acid volume divided by total volume, multiplied by 100.

$$\Rightarrow \text{acid percentage}=\frac{5}{30}\times100$$

Evaluating the fraction gives

$$\Rightarrow \frac{5}{30}\times100=16.6667\%$$

So, the percentage of acid is

$$\Rightarrow 16.6667\%$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 65. RAP-QL-229 · threeComponentMixture · Hard

**Question:** A solution has milk, water, and juice in the ratio 5:6:7. After adding 18 litres of water, the new ratio becomes 10:21:14. Determine the starting volume.

**Answer:** $$72$$

**Current explanation:**

Let the original quantities be proportional to x.

$$\Rightarrow 5x:6x:7x$$

The first component is unchanged, so it determines the scale of the final ratio.

$$\Rightarrow \text{final ratio unit}=\frac{5x}{10}$$

After adding 18 litres of water,

$$\Rightarrow 6x+18=21\left(\frac{5x}{10}\right)$$

Solve for one original ratio part.

$$\Rightarrow 4.5x=18\Rightarrow x=4$$

The original mixture contains 18 ratio parts.

$$\Rightarrow (5+6+7)\times4=72$$

So, the original volume was

$$\Rightarrow 72$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 66. RAP-QL-230 · variableReplacementRatio · Hard

**Question:** From 100 litres of milk, 5 litres are replaced with water, and then 10 litres are again replaced with water. Find the final ratio of milk to water.

**Answer:** $$171 : 29$$

**Current explanation:**

First replacement leaves milk.

$$\Rightarrow 100-5=95$$

Use the second retention fraction.

$$\Rightarrow 1-\frac{10}{100}=\frac{90}{100}$$

Keep the ratio exact.

$$\Rightarrow milk:water=8550:1450$$

Reduce the ratio.

$$\Rightarrow 8550:1450=171 : 29$$

So, the final milk:water ratio is 171 : 29.

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---
#### 67. RAP-QL-232 · acidConcentration · Hard

**Question:** A solution contains 5 litres of acid and 35 litres of water. Find the percentage of acid in the solution.

**Answer:** $$12.5\%$$

**Current explanation:**

First find the total volume of the solution.

$$\Rightarrow 5+35=40$$

Acid percentage equals acid volume divided by total volume, multiplied by 100.

$$\Rightarrow \text{acid percentage}=\frac{5}{40}\times100$$

Evaluating the fraction gives

$$\Rightarrow \frac{5}{40}\times100=12.5\%$$

So, the percentage of acid is

$$\Rightarrow 12.5\%$$

**Automated review flags:** none

**Editorial decision:** PENDING

**Reviewer note:**

---

Total questions: 67

Status: REVIEW_ONLY — not frozen or registered for production.
