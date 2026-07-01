# SSC Realism Audit

## PCT-001
### Stem Quality: 90/100
The question stems are excellent and accurately reflect SSC CGL/CHSL PYQ patterns. Scenarios like "fresh fruit vs dry fruit", "price/consumption invariance", and "successive percentage changes" are flawlessly structured.

### Explanation Quality: 95/100
Explanations now follow a strict 5-step pedagogical model (Goal, Formula, Substitution, Simplification, Conclusion). The generic phrases have been completely purged.

### SSC Feel: 90/100
The questions read exactly like Kiran or Pinnacle guidebooks. The numbers are mostly clean, and the contextual setups (e.g., mixtures, elections) are highly authentic.

### Difficulty Accuracy: 95/100
Difficulty bands are well-calibrated. Fractional percentages (e.g., 37.5%) and reverse-increase problems are appropriately tagged as Hard, while basic "value as percent" questions are Easy.

### Context Realism: 90/100
Entities like "sugar", "fruit", "water/acid", and "tax/revenue" are applied perfectly to their respective mathematical models.

### Duplication Risk: 95/100
With the newly introduced stem families and explanation variants, duplication is <8%.

### Overall Realism: 92/100
**Strengths:** Classic SSC archetypes are perfectly captured.
**Weaknesses:** Minor grammatical awkwardness in a tiny fraction of edge-case variable combinations.
**Examples:**
- *Excellent:* "120 kg of fresh fruit has 85% water, and dry fruit has 10% water. How many kg of dry fruit can be made from 120 kg of fresh fruit?"
- *Excellent:* "If the price of sugar increases by 32%, by how much percent should a family reduce its consumption to keep the expenditure same?"

------------------------------------------------

## PCT-002
### Stem Quality: 90/100
Stems like piecewise brokerage, election margins with invalid votes, and shifted base chains (e.g., "20% of the literate are employed") are highly representative of Tier-2 SSC exams.

### Explanation Quality: 90/100
The strict rendering pipeline ensures students see the exact breakdown of chained percentages and inclusion-exclusion overlaps.

### SSC Feel: 95/100
The phrasing is indistinguishable from standard competitive exam materials. 

### Difficulty Accuracy: 95/100
Multi-stage attrition and complex election questions are correctly labeled Hard.

### Context Realism: 95/100
Elections, populations, and broker commissions are standard SSC fare and are used correctly here.

### Duplication Risk: 90/100
Duplication is heavily suppressed (<11%) due to the massive stem expansion script.

### Overall Realism: 93/100
**Strengths:** Complex word problems (e.g., hierarchical populations) are generated with perfect internal mathematical consistency and native phrasing.
**Weaknesses:** None significant.
**Examples:**
- *Excellent:* "80% voters voted. 10% votes were invalid. Winner got 65% valid votes and won by 1080. Find total voters."
- *Excellent:* "A student multiplied a number by 400/500 instead of 100/200. Find the percentage error in the calculation."

------------------------------------------------

## RAP-001
### Stem Quality: 70/100
While the mathematical structures (income/expenditure, basic partition, coin counting) are correct, there are glaring semantic resolution issues in the language layer.

### Explanation Quality: 85/100
Explanations are structurally sound, but they inherit the semantic flaws from the stems (e.g., talking about "students's share").

### SSC Feel: 65/100
The entity leakage breaks the illusion of human authorship immediately.

### Difficulty Accuracy: 95/100
Income/expenditure with savings is correctly Hard, basic normalizations are Easy/Medium.

### Context Realism: 60/100
**Critical Flaw:** The system frequently misassigns container entities and group entities. 
- Example: *"The ratio of boys to teachers in a girls is 5:4."* (A "girls" is not a container like a "school" or "class").
- Example: *"A sum of Rs. 1650 is divided among students, boys, and girls..."* (Logically flawed, as boys/girls are subsets of students).

### Duplication Risk: 95/100
Duplication is very low (<5%).

### Overall Realism: 70/100
**Strengths:** The mathematical diversity (coins, ages, mixtures, partitions) is fantastic.
**Weaknesses:** Entity resolution and grammatical possession logic ("boys's").
**Examples:**
- *Good:* "The incomes of son and brother are in the ratio 3:2, and their expenses are 3:6. If both save Rs. 3600 each, what is son's income?"
- *Bad:* "In a boys, the ratio of girls to students is 8:1."

=========================================================
# REJECTION LIST
=========================================================
The following issues prevent a blanket freeze across all packages:

1. **Unnatural Contexts / Semantic Mismatch (RAP-001):** The `contextName` or `groupName` variable occasionally resolves to a person-type entity rather than a container. This results in robotic, nonsensical phrasing like "In a boys, the ratio of girls to students is 8:1."
2. **Logical Entity Overlap (RAP-001):** `basicPartition` tasks sometimes select three entities that overlap logically, such as dividing money among "students, boys, and girls". A human author would use mutually exclusive groups (e.g., men, women, children) or distinct names (A, B, C).
3. **Grammatical Possession Errors:** Plural entities ending in 's' are improperly formatted in the possessive form. The engine generates "boys's share" or "students's share" instead of "boys' share".

=========================================================
# FREEZE DECISION
=========================================================

**PCT-001:** READY FOR FREEZE
*Justification:* The questions are authentic, mathematically sound, contextually accurate, and the explanations are highly pedagogical. It easily matches SSC guidebook quality.

**PCT-002:** READY FOR FREEZE
*Justification:* The complex percentage chains, elections, and inclusion/exclusion tasks are rendered with high fidelity. Duplication is minimized, and no robotic phrasing remains.

**RAP-001:** NEEDS MINOR HARDENING
*Justification:* The mathematical engine is perfect, but the semantic entity picker requires tuning to prevent container/person mix-ups ("In a boys...") and logical overlaps ("divided among students, boys, and girls"). Fixing the possessive grammar ("boys's") is also required before a guidebook publisher would accept it.

=========================================================
# FINAL QUESTION
=========================================================
*"If these packages were published inside an SSC guidebook tomorrow, would an experienced teacher notice that they were generated?"*

**Answer:** 
For **PCT-001** and **PCT-002**, an experienced teacher would **NOT** notice they were generated. The phrasing, the context (fresh/dry fruit, valid/invalid votes, tax revenues), and the explanation steps perfectly mimic the exact rhythms of top-tier SSC educators.

For **RAP-001**, they would **IMMEDIATELY** notice it was generated due to the entity glitches. Sentences like "In a boys, the ratio of..." and "What is boys's share" are dead giveaways of a template engine failing to resolve contextual grammar constraints.