# PNL-001 Profit & Loss Implementation Blueprint

## Executive Summary

This document provides a complete blueprint for implementing **Profit & Loss (PNL-001)** as the next subtopic under the **Arithmetic** topic in the Quant V4 question generation system. The implementation follows the exact architectural patterns established by Percentage PCT-007, with full multilingual support (English, Hindi, Punjabi) from day one.

---

## 1. Archetype Definition

### 1.1 Subtopic Identity

```
PNL-001 - Profit and Loss Applications
```

**Scope:** This chapter covers exam-style profit and loss applications across basic CP/SP calculations, profit/loss percentage, successive transactions, marked price and discount, equal profit/loss scenarios, dishonest dealer problems, break-even analysis, ratio-based distribution, and mixed caselets.

**Target Exams:** SSC CGL, CHSL, MTS, GD Constable, Banking (IBPS, SBI), Railway (NTPC, Group D), State PSC, Defence, Police, Teaching (CTET, UPTET), University Entrance

---

## 2. Canonical Problems (10 CPs)

Following PCT-007's structure of 10 canonical problems:

| CP ID | Canonical Problem Name | Description |
|-------|----------------------|-------------|
| `PNL-CP-001` | Basic Cost Price and Selling Price | Direct calculation of CP, SP, profit, or loss amount |
| `PNL-CP-002` | Profit and Loss Percentage | Finding profit% or loss% given CP and SP |
| `PNL-CP-003` | Finding CP/SP from Percentage | Reverse calculation: finding CP or SP when profit/loss% is given |
| `PNL-CP-004` | Successive Transactions (A→B→C) | Multiple buying-selling chains with profit/loss at each stage |
| `PNL-CP-005` | Marked Price, Discount, and Profit | MP, discount%, and resulting profit/loss calculations |
| `PNL-CP-006` | Equal Profit/Loss on Same SP | Two articles sold at same SP, one at x% profit, other at x% loss |
| `PNL-CP-007` | Dishonest Dealer Problems | False weight, cheating in quantity, profit through deception |
| `PNL-CP-008` | Break-Even and No Profit No Loss | Finding conditions for zero profit/zero loss scenarios |
| `PNL-CP-009` | Ratio-Based Profit Distribution | Profit sharing based on investment ratios, time periods |
| `PNL-CP-010` | Mixed Application Caselets | Mini DI style: 2-4 facts requiring multiple P&L concepts |

---

## 3. Directory Structure

Mirror PCT-007's exact folder structure:

```
/workspace/artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/
├── archetype.md
├── canonical-problems.md
├── difficulty-framework.md
├── implementation-plan.md
├── library-authority-map.md
├── reasoning-patterns.md
├── index.ts
├── types.ts
├── math.ts
├── solver.ts
├── validator.ts
├── pipeline.ts
├── parameter-generator.ts
├── reasoning-graph.ts
├── library.ts
├── coverage-auditor.ts
├── explanation-renderer.ts
│
├── foundation/
│   ├── types.ts
│   ├── math.ts
│   ├── solver.ts
│   ├── validator.ts
│   ├── pipeline.ts
│   ├── parameter-generator.ts
│   ├── reasoning-graph.ts
│   ├── library.ts
│   ├── coverage-auditor.ts
│   └── explanation-renderer.ts
│
├── task-registry.library.json          (~188KB, ~500 entries)
├── variable-ranges.library.json        (~750 bytes)
├── coverage-targets.library.json       (~142 bytes)
├── distribution-targets.library.json   (~391 bytes)
│
├── question-language.en.json           (~110KB, 500 templates)
├── question-language.hi.json           (~110KB, 500 templates)
├── question-language.pa.json           (~110KB, 500 templates)
│
├── explanation.en.json                 (~573 bytes, 10 CP mappings)
├── explanation.hi.json                 (~573 bytes, 10 CP mappings)
├── explanation.pa.json                 (~573 bytes, 10 CP mappings)
│
└── pnl-001.test.ts                     (integration tests)
```

**Total Files to Create:** 33 files (matching PCT-007 count)

---

## 4. Variable System

Following PCT-007's `variable-ranges.library.json` pattern:

```json
{
  "archetypeId": "PNL-001",
  "costPrices": [
    100, 120, 150, 200, 240, 250, 300, 400, 500, 600, 800, 
    1000, 1200, 1500, 2000, 2500, 5000, 10000
  ],
  "sellingPrices": [
    110, 125, 140, 160, 180, 220, 275, 320, 375, 450, 550,
    660, 880, 1100, 1320, 1650, 2200, 2750, 5500, 11000
  ],
  "profitPercentages": [
    5, 10, 12.5, 15, 20, 25, 30, 33.33, 40, 50, 60, 75, 80, 100
  ],
  "lossPercentages": [
    5, 10, 12.5, 15, 20, 25, 30, 40, 50, 60
  ],
  "discountPercentages": [
    5, 10, 12.5, 15, 20, 25, 30, 33.33, 40, 50
  ],
  "markedPrices": [
    100, 150, 200, 250, 300, 400, 500, 600, 800, 1000,
    1200, 1500, 2000, 2500, 5000, 10000
  ],
  "falseWeights": [
    800, 850, 875, 900, 920, 950, 960, 975, 980
  ],
  "trueWeights": [
    1000, 1200, 1500, 2000
  ],
  "transactionChains": [2, 3, 4],
  "investmentRatios": [
    [2, 3], [3, 4], [3, 5], [4, 5], [5, 6], [5, 7],
    [2, 3, 4], [3, 4, 5], [2, 5, 7]
  ],
  "timePeriods": [3, 4, 5, 6, 8, 9, 10, 12]
}
```

---

## 5. Task Registry Design

Following PCT-007's `task-registry.library.json` pattern with 500 entries (50 per CP):

### Sample Entries for PNL-CP-001 (Basic CP/SP):

```json
{
  "archetypeId": "PNL-001",
  "ownership": "HUMAN_OWNED",
  "authority": "ExamTree Quant V4 Profit & Loss PNL-001",
  "usage": "Runtime Consumption Only",
  "entries": {
    "PNL-QL-001": {
      "cpId": "PNL-CP-001",
      "taskKind": "basicCostPriceSellingPrice",
      "solveMode": "findProfitAmount",
      "answerType": "AMOUNT",
      "requiredVariables": ["costPrice", "sellingPrice"],
      "scenarioFamily": "cp_sp_to_profit",
      "contextTag": "|trade|money"
    },
    "PNL-QL-002": {
      "cpId": "PNL-CP-001",
      "taskKind": "basicCostPriceSellingPrice",
      "solveMode": "findLossAmount",
      "answerType": "AMOUNT",
      "requiredVariables": ["costPrice", "sellingPrice"],
      "scenarioFamily": "cp_sp_to_loss",
      "contextTag": "|trade|money"
    },
    "PNL-QL-003": {
      "cpId": "PNL-CP-001",
      "taskKind": "basicCostPriceSellingPrice",
      "solveMode": "findSPFromCPAndProfit",
      "answerType": "AMOUNT",
      "requiredVariables": ["costPrice", "profitAmount"],
      "scenarioFamily": "cp_profit_to_sp",
      "contextTag": "|trade|money"
    }
    // ... 47 more entries for PNL-CP-001
  }
}
```

### Task Kind Distribution (500 total):

| CP ID | Task Count | Task Kinds |
|-------|-----------|------------|
| PNL-CP-001 | 50 | findProfitAmount, findLossAmount, findSPFromCPAndProfit, findCPFromSPAndProfit, etc. |
| PNL-CP-002 | 50 | findProfitPercent, findLossPercent, compareProfitLossPercent |
| PNL-CP-003 | 50 | findCPFromSPAndProfitPercent, findSPFromCPAndLossPercent, etc. |
| PNL-CP-004 | 50 | twoStageTransaction, threeStageTransaction, findFinalSP, findOriginalCP |
| PNL-CP-005 | 50 | findMPFromSPAndDiscount, findSPFromMPAndDiscount, findProfitAfterDiscount |
| PNL-CP-006 | 50 | equalProfitLossOnSameSP, netResultCalculation, overallPercent |
| PNL-CP-007 | 50 | falseWeightProfit, cheatingInQuantity, profitByDeception |
| PNL-CP-008 | 50 | breakEvenPoint, noProfitNoLossCondition, minimumSPForNoLoss |
| PNL-CP-009 | 50 | ratioBasedProfitShare, timeWeightedDistribution, partnershipProfit |
| PNL-CP-010 | 50 | miniCaseletComparison, multiFactPAndL, diStyleProfitLoss |

---

## 6. Question Templates (Multilingual)

### 6.1 English Samples (question-language.en.json)

**PNL-CP-001 (Easy):**
```json
"PNL-QL-001": {
  "template": "A shopkeeper buys an article for Rs. {costPrice} and sells it for Rs. {sellingPrice}. Find his profit.",
  "difficulty": "Easy"
}
```

**PNL-CP-002 (Easy):**
```json
"PNL-QL-051": {
  "template": "An article is bought for Rs. {costPrice} and sold for Rs. {sellingPrice}. Find the profit percentage.",
  "difficulty": "Easy"
}
```

**PNL-CP-003 (Medium):**
```json
"PNL-QL-101": {
  "template": "By selling an article for Rs. {sellingPrice}, a man gains {profitPercent}%. Find the cost price.",
  "difficulty": "Medium"
}
```

**PNL-CP-004 (Hard):**
```json
"PNL-QL-151": {
  "template": "A sells a bicycle to B at {profitPercentA}% profit. B sells it to C at {profitPercentB}% profit. If C pays Rs. {finalSP}, find the original cost price for A.",
  "difficulty": "Hard"
}
```

**PNL-CP-005 (Medium):**
```json
"PNL-QL-201": {
  "template": "The marked price of an article is Rs. {markedPrice}. It is sold at {discountPercent}% discount. Find the selling price.",
  "difficulty": "Medium"
}
```

**PNL-CP-006 (Hard):**
```json
"PNL-QL-251": {
  "template": "Two articles are sold at Rs. {sellingPrice} each. On one, there is a gain of {profitPercent}%, and on the other, a loss of {lossPercent}%. Find the overall result.",
  "difficulty": "Hard"
}
```

**PNL-CP-007 (Hard):**
```json
"PNL-QL-301": {
  "template": "A dishonest dealer professes to sell goods at cost price but uses a weight of {falseWeight}g instead of {trueWeight}g. Find his profit percentage.",
  "difficulty": "Hard"
}
```

**PNL-CP-008 (Medium):**
```json
"PNL-QL-351": {
  "template": "By selling an article for Rs. {spWithLoss}, a man loses {lossPercent}%. At what price should he sell it to have no profit and no loss?",
  "difficulty": "Medium"
}
```

**PNL-CP-009 (Hard):**
```json
"PNL-QL-401": {
  "template": "A and B invest in the ratio {ratioA}:{ratioB}. After {monthsA} months, A withdraws his capital. If the profit is divided in the ratio {profitRatioA}:{profitRatioB}, for how many months did B invest?",
  "difficulty": "Hard"
}
```

**PNL-CP-010 (Hard):**
```json
"PNL-QL-451": {
  "template": "A trader has {totalArticles} articles. He sells {soldCount} articles at {profitPercent1}% profit and the remaining at {profitPercent2}% profit. Find his overall profit percentage.",
  "difficulty": "Hard"
}
```

### 6.2 Hindi Translation Strategy (question-language.hi.json)

**Key Terminology:**
- Cost Price → क्रय मूल्य (kray moolya)
- Selling Price → विक्रय मूल्य (vikray moolya)
- Profit → लाभ (laabh)
- Loss → हानि (haani) / नुकसान (nuksaan)
- Profit Percentage → लाभ प्रतिशत (laabh pratishat)
- Loss Percentage → हानि प्रतिशत (haani pratishat)
- Marked Price → अंकित मूल्य (ankit moolya)
- Discount → बट्टा (batta) / छूट (chhoot)
- Weight → वजन (vajan)
- Article → वस्तु (vastu) / सामान (saamaan)

**Sample Hindi Templates:**

```json
"PNL-QL-001": {
  "template": "एक दुकानदार एक वस्तु को रु. {costPrice} में खरीदता है और रु. {sellingPrice} में बेचता है। उसका लाभ ज्ञात कीजिए।",
  "difficulty": "Easy"
}
```

```json
"PNL-QL-051": {
  "template": "एक वस्तु को रु. {costPrice} में खरीदा गया और रु. {sellingPrice} में बेचा गया। लाभ प्रतिशत ज्ञात कीजिए।",
  "difficulty": "Easy"
}
```

```json
"PNL-QL-301": {
  "template": "एक बेईमान डीलर लागत मूल्य पर सामान बेचने का दावा करता है लेकिन {trueWeight}g के स्थान पर {falseWeight}g का वजन उपयोग करता है। उसका लाभ प्रतिशत ज्ञात कीजिए।",
  "difficulty": "Hard"
}
```

### 6.3 Punjabi Translation Strategy (question-language.pa.json)

**Key Terminology:**
- Cost Price → ਕ੍ਰੈ ਮੁੱਲ (krai mull)
- Selling Price → ਵਿਕਰੈ ਮੁੱਲ (vikrai mull)
- Profit → ਲਾਭ (laabh)
- Loss → ਨੁਕਸਾਨ (nuksaan) / ਘਾਟਾ (ghaata)
- Profit Percentage → ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ (laabh prateeshat)
- Loss Percentage → ਨੁਕਸਾਨ ਪ੍ਰਤੀਸ਼ਤ (nuksaan prateeshat)
- Marked Price → ਅੰਕਿਤ ਮੁੱਲ (ankit mull)
- Discount → ਛੂਟ (chhoot) / ਰਾਹਤ (raahat)
- Weight → ਭਾਰ (bhaar)
- Article → ਵਸਤੂ (vastoo) / ਸਮਾਨ (samaana)

**Sample Punjabi Templates:**

```json
"PNL-QL-001": {
  "template": "ਇੱਕ ਦੁਕਾਨਦਾਰ ਇੱਕ ਵਸਤੂ ਨੂੰ ਰੁ. {costPrice} ਵਿੱਚ ਖਰੀਦਦਾ ਹੈ ਅਤੇ ਰੁ. {sellingPrice} ਵਿੱਚ ਵੇਚਦਾ ਹੈ। ਉਸਦਾ ਲਾਭ ਪਤਾ ਕਰੋ।",
  "difficulty": "Easy"
}
```

```json
"PNL-QL-051": {
  "template": "ਇੱਕ ਵਸਤੂ ਨੂੰ ਰੁ. {costPrice} ਵਿੱਚ ਖਰੀਦਿਆ ਗਿਆ ਅਤੇ ਰੁ. {sellingPrice} ਵਿੱਚ ਵੇਚਿਆ ਗਿਆ। ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
  "difficulty": "Easy"
}
```

```json
"PNL-QL-301": {
  "template": "ਇੱਕ ਬੇਈਮਾਨ ਡੀਲਰ ਲਾਗਤ ਮੁੱਲ 'ਤੇ ਸਮਾਨ ਵੇਚਣ ਦਾ ਦਾਅਵਾ ਕਰਦਾ ਹੈ ਪਰ {trueWeight}g ਦੀ ਬਜਾਏ {falseWeight}g ਦਾ ਭਾਰ ਵਰਤਦਾ ਹੈ। ਉਸਦਾ ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
  "difficulty": "Hard"
}
```

---

## 7. Explanation System

Following PCT-007's explanation mapping pattern:

### 7.1 Explanation Mapping Files

**explanation.en.json:**
```json
{
  "PNL-CP-001": {"explanationId": "PNL-ES-001"},
  "PNL-CP-002": {"explanationId": "PNL-ES-002"},
  "PNL-CP-003": {"explanationId": "PNL-ES-003"},
  "PNL-CP-004": {"explanationId": "PNL-ES-004"},
  "PNL-CP-005": {"explanationId": "PNL-ES-005"},
  "PNL-CP-006": {"explanationId": "PNL-ES-006"},
  "PNL-CP-007": {"explanationId": "PNL-ES-007"},
  "PNL-CP-008": {"explanationId": "PNL-ES-008"},
  "PNL-CP-009": {"explanationId": "PNL-ES-009"},
  "PNL-CP-010": {"explanationId": "PNL-ES-010"}
}
```

### 7.2 Explanation Quality Standards

Following Testbook/Testzone/Oliveboard quality:

**Step-by-step format with MathJax:**
```
Given: CP = Rs. {costPrice}, SP = Rs. {sellingPrice}

Since SP > CP, there is a profit.

Profit = SP - CP
       = {sellingPrice} - {costPrice}
       = Rs. {calculatedProfit}

∴ Profit = Rs. {calculatedProfit}

Alternatively:
Profit = SP - CP = Rs. {calculatedProfit}  ✓
```

**For percentage calculations:**
```
Given: CP = Rs. {costPrice}, SP = Rs. {sellingPrice}

Profit = SP - CP = Rs. {profitAmount}

Profit % = (Profit / CP) × 100
         = ({profitAmount} / {costPrice}) × 100
         = {profitPercent}%

∴ Profit Percentage = {profitPercent}%  ✓
```

**For dishonest dealer problems:**
```
Given: True weight = {trueWeight}g, False weight = {falseWeight}g

Error = True weight - False weight
      = {trueWeight} - {falseWeight}
      = {errorWeight}g

Profit % = (Error / False weight) × 100
         = ({errorWeight} / {falseWeight}) × 100
         = {calculatedProfitPercent}%

∴ Dealer's profit = {calculatedProfitPercent}%  ✓
```

### 7.3 Multilingual Explanations

Each explanation must be available in all three languages with identical mathematical reasoning flow.

**Hindi Example:**
```
दिया गया है: क्रय मूल्य = रु. {costPrice}, विक्रय मूल्य = रु. {sellingPrice}

चूँकि विक्रय मूल्य > क्रय मूल्य, इसलिए लाभ है।

लाभ = विक्रय मूल्य - क्रय मूल्य
     = {sellingPrice} - {costPrice}
     = रु. {calculatedProfit}

∴ लाभ = रु. {calculatedProfit}  ✓
```

**Punjabi Example:**
```
ਦਿੱਤਾ ਗਿਆ ਹੈ: ਕ੍ਰੈ ਮੁੱਲ = ਰੁ. {costPrice}, ਵਿਕਰੈ ਮੁੱਲ = ਰੁ. {sellingPrice}

ਕਿਉਂਕਿ ਵਿਕਰੈ ਮੁੱਲ > ਕ੍ਰੈ ਮੁੱਲ, ਇਸ ਲਈ ਲਾਭ ਹੈ।

ਲਾਭ = ਵਿਕਰੈ ਮੁੱਲ - ਕ੍ਰੈ ਮੁੱਲ
     = {sellingPrice} - {costPrice}
     = ਰੁ. {calculatedProfit}

∴ ਲਾਭ = ਰੁ. {calculatedProfit}  ✓
```

---

## 8. Reasoning Patterns

Following PCT-007's reasoning-patterns.md:

```markdown
# PNL-001 Reasoning Patterns

- direct profit/loss calculation from CP and SP
- profit/loss percentage computation on cost price
- reverse recovery of CP or SP from percentage data
- successive transaction chaining (A→B→C)
- marked price, discount, and selling price relationship
- equal profit/loss on same selling price analysis
- false weight and dishonest dealer profit calculation
- break-even point determination
- ratio-based profit distribution with time weighting
- compact caselet with 2-4 profit/loss facts
```

---

## 9. Difficulty Framework

Following PCT-007's difficulty-framework.md:

```markdown
# PNL-001 Difficulty Framework

**Easy:**
- direct profit or loss amount calculation
- simple profit/loss percentage from given CP and SP
- straightforward discount application
- single transaction scenarios

**Medium:**
- reverse-base recovery (finding CP from SP and profit%)
- successive two-stage transactions
- marked price and discount combinations
- break-even price determination
- simple ratio-based distribution

**Hard:**
- three or more stage transaction chains
- equal profit/loss on same SP with net result
- dishonest dealer with false weights
- evaporation-style composition change analogues
- repeated percentage application in partnerships
- compact caselet comparison across different bases
```

---

## 10. Coverage and Distribution Targets

### 10.1 Coverage Targets (coverage-targets.library.json)

```json
{
  "archetypeId": "PNL-001",
  "totalQuestions": 500,
  "byCanonicalProblem": {
    "PNL-CP-001": 50,
    "PNL-CP-002": 50,
    "PNL-CP-003": 50,
    "PNL-CP-004": 50,
    "PNL-CP-005": 50,
    "PNL-CP-006": 50,
    "PNL-CP-007": 50,
    "PNL-CP-008": 50,
    "PNL-CP-009": 50,
    "PNL-CP-010": 50
  },
  "byDifficulty": {
    "Easy": 200,
    "Medium": 200,
    "Hard": 100
  }
}
```

### 10.2 Distribution Targets (distribution-targets.library.json)

```json
{
  "archetypeId": "PNL-001",
  "languageDistribution": {
    "en": 500,
    "hi": 500,
    "pa": 500
  },
  "totalPackages": 1500,
  "balanceTargets": {
    "canonicalProblemBalance": "equal",
    "difficultyBalance": "40-40-20",
    "contextVariety": "high"
  }
}
```

---

## 11. Implementation Plan (8 Weeks)

Following PCT-007's implementation-plan.md pattern:

### Week 1-2: Foundation & Definitions
- [ ] Create directory structure matching PCT-007
- [ ] Write `archetype.md` with scope definition
- [ ] Define 10 canonical problems in `canonical-problems.md`
- [ ] Document `reasoning-patterns.md`
- [ ] Establish `difficulty-framework.md`
- [ ] Create `library-authority-map.md`

### Week 2-3: Type System & Variables
- [ ] Implement `types.ts` with PNL-specific interfaces
- [ ] Build `math.ts` with profit/loss formulas
- [ ] Create `variable-ranges.library.json` with curated pools
- [ ] Develop `parameter-generator.ts` for deterministic generation

### Week 3-4: Task Registry & Translations
- [ ] Generate 500 task registry entries in `task-registry.library.json`
- [ ] Write 500 English question templates in `question-language.en.json`
- [ ] Translate to Hindi in `question-language.hi.json`
- [ ] Translate to Punjabi in `question-language.pa.json`
- [ ] Ensure placeholder parity across all languages

### Week 4-5: Core Logic Implementation
- [ ] Implement `solver.ts` for all 10 CPs
- [ ] Build `validator.ts` with finite-answer checks
- [ ] Create `pipeline.ts` for end-to-end generation
- [ ] Develop `reasoning-graph.ts` for step tracking

### Week 5-6: Explanation System
- [ ] Write explanation templates for all 10 CPs in English
- [ ] Translate explanations to Hindi
- [ ] Translate explanations to Punjabi
- [ ] Implement `explanation-renderer.ts`
- [ ] Integrate MathJax formatting

### Week 6-7: Validation & Testing
- [ ] Run JSON validity checks
- [ ] Execute duplicate detection
- [ ] Verify placeholder consistency
- [ ] Test render pipeline
- [ ] Validate finite-answer guarantees
- [ ] Run bundled test suite (`pnl-001.test.ts`)

### Week 7-8: Integration & Polish
- [ ] Implement `coverage-auditor.ts`
- [ ] Generate implementation report
- [ ] Produce content-audit report
- [ ] Final review against PCT-007 patterns
- [ ] Documentation cleanup

---

## 12. File Creation Checklist

### Foundation Documents (6 files)
- [ ] `archetype.md`
- [ ] `canonical-problems.md`
- [ ] `reasoning-patterns.md`
- [ ] `difficulty-framework.md`
- [ ] `library-authority-map.md`
- [ ] `implementation-plan.md`

### TypeScript Core (10 files)
- [ ] `index.ts`
- [ ] `types.ts`
- [ ] `math.ts`
- [ ] `solver.ts`
- [ ] `validator.ts`
- [ ] `pipeline.ts`
- [ ] `parameter-generator.ts`
- [ ] `reasoning-graph.ts`
- [ ] `library.ts`
- [ ] `coverage-auditor.ts`
- [ ] `explanation-renderer.ts`

### Foundation Folder (10 files)
- [ ] `foundation/types.ts`
- [ ] `foundation/math.ts`
- [ ] `foundation/solver.ts`
- [ ] `foundation/validator.ts`
- [ ] `foundation/pipeline.ts`
- [ ] `foundation/parameter-generator.ts`
- [ ] `foundation/reasoning-graph.ts`
- [ ] `foundation/library.ts`
- [ ] `foundation/coverage-auditor.ts`
- [ ] `foundation/explanation-renderer.ts`

### JSON Libraries (6 files)
- [ ] `task-registry.library.json` (500 entries)
- [ ] `variable-ranges.library.json`
- [ ] `coverage-targets.library.json`
- [ ] `distribution-targets.library.json`
- [ ] `explanation.en.json`
- [ ] `explanation.hi.json`
- [ ] `explanation.pa.json`

### Language Files (3 files)
- [ ] `question-language.en.json` (500 templates)
- [ ] `question-language.hi.json` (500 templates)
- [ ] `question-language.pa.json` (500 templates)

### Tests (1 file)
- [ ] `pnl-001.test.ts`

**Total: 33 files**

---

## 13. Key Formulas Reference

### Basic Formulas
```
Profit = SP - CP  (when SP > CP)
Loss = CP - SP  (when CP > SP)

Profit % = (Profit / CP) × 100
Loss % = (Loss / CP) × 100

SP = CP × (100 + Profit%) / 100
SP = CP × (100 - Loss%) / 100

CP = SP × 100 / (100 + Profit%)
CP = SP × 100 / (100 - Loss%)
```

### Marked Price & Discount
```
MP = Marked Price
Discount = MP × Discount% / 100
SP = MP - Discount
SP = MP × (100 - Discount%) / 100

Profit % = [(SP - CP) / CP] × 100
```

### Successive Transactions
```
If A sells to B at x% profit, and B sells to C at y% profit:
Final SP = CP × (100+x)/100 × (100+y)/100

For n transactions:
Final SP = CP × Π[(100 + rateᵢ)/100]
```

### Equal Profit/Loss on Same SP
```
When two articles sold at same SP:
One at x% profit, other at x% loss

Overall Loss % = (x/10)² %
Always a loss, never profit
```

### Dishonest Dealer
```
Profit % = (Error / False Weight) × 100
where Error = True Weight - False Weight

Or: Profit % = [(True - False) / False] × 100
```

### Partnership with Time
```
Profit Ratio = (Investment₁ × Time₁) : (Investment₂ × Time₂) : ...
```

---

## 14. Quality Assurance Gates

### Pre-Implementation Checks
- [ ] Review PCT-007 file structure completely
- [ ] Confirm all 10 CPs are distinct and exam-relevant
- [ ] Validate variable ranges produce clean numbers
- [ ] Ensure 500 task kinds cover all solve modes

### During Implementation
- [ ] Placeholder parity check across en/hi/pa
- [ ] Deterministic generation verification
- [ ] Finite-answer validation for all 500 questions
- [ ] Duplicate detection across all languages

### Post-Implementation
- [ ] Render test for 10 sample questions per CP
- [ ] Explanation clarity review in all 3 languages
- [ ] MathJax formatting verification
- [ ] Coverage audit against targets
- [ ] Integration test with question bank pipeline

---

## 15. Risk Mitigation

### Potential Risks & Solutions

| Risk | Impact | Mitigation |
|------|--------|------------|
| Inconsistent terminology across languages | High | Create glossary before translation; use native speakers for review |
| Complex formulas breaking in some languages | Medium | Keep mathematical notation in MathJax; translate only text |
| False weight problems confusing in regional contexts | Medium | Use universal examples; avoid region-specific weight units |
| Partnership problems becoming too complex | Medium | Limit to 2-3 partners; keep time periods simple |
| Caselets becoming DI-heavy | Low | Restrict to 2-4 facts; focus on P&L concepts only |

---

## 16. Success Metrics

### Quantitative Targets
- ✅ 500 unique question templates in English
- ✅ 500 translations in Hindi (100% placeholder parity)
- ✅ 500 translations in Punjabi (100% placeholder parity)
- ✅ 10 canonical problems fully implemented
- ✅ 98%+ validation pass rate
- ✅ Zero duplicate questions
- ✅ All explanations rendered correctly in 3 languages

### Qualitative Targets
- ✅ Explanations match Testbook/Testzone clarity
- ✅ Step-by-step reasoning in all languages
- ✅ Cultural adaptation appropriate for each language
- ✅ Difficulty progression feels natural
- ✅ Exam relevance verified against SSC/Banking patterns

---

## 17. Next Steps

1. **Immediate (Day 1-2):**
   - Create directory structure
   - Write archetype.md and canonical-problems.md
   - Set up variable-ranges.library.json

2. **Short-term (Week 1):**
   - Complete all foundation documents
   - Implement types.ts and math.ts
   - Begin task-registry generation

3. **Medium-term (Week 2-4):**
   - Generate all 500 question templates in English
   - Complete Hindi and Punjabi translations
   - Implement solver and validator

4. **Long-term (Week 5-8):**
   - Build explanation system
   - Run full test suite
   - Generate audit reports
   - Prepare for production deployment

---

## Appendix A: Sample Complete Question Package

### English
```json
{
  "questionId": "PNL-QL-001-VAR-12345",
  "archetypeId": "PNL-001",
  "cpId": "PNL-CP-001",
  "taskKind": "basicCostPriceSellingPrice",
  "solveMode": "findProfitAmount",
  "stem": "A shopkeeper buys an article for Rs. 800 and sells it for Rs. 960. Find his profit.",
  "variables": {
    "costPrice": 800,
    "sellingPrice": 960
  },
  "answer": {
    "value": 160,
    "type": "AMOUNT",
    "unit": "Rs."
  },
  "explanation": "Given: CP = Rs. 800, SP = Rs. 960\n\nSince SP > CP, there is a profit.\n\nProfit = SP - CP\n       = 960 - 800\n       = Rs. 160\n\n∴ Profit = Rs. 160 ✓",
  "difficulty": "Easy",
  "language": "en"
}
```

### Hindi
```json
{
  "questionId": "PNL-QL-001-VAR-12345-HI",
  "archetypeId": "PNL-001",
  "cpId": "PNL-CP-001",
  "taskKind": "basicCostPriceSellingPrice",
  "solveMode": "findProfitAmount",
  "stem": "एक दुकानदार एक वस्तु को रु. 800 में खरीदता है और रु. 960 में बेचता है। उसका लाभ ज्ञात कीजिए।",
  "variables": {
    "costPrice": 800,
    "sellingPrice": 960
  },
  "answer": {
    "value": 160,
    "type": "AMOUNT",
    "unit": "रु."
  },
  "explanation": "दिया गया है: क्रय मूल्य = रु. 800, विक्रय मूल्य = रु. 960\n\nचूँकि विक्रय मूल्य > क्रय मूल्य, इसलिए लाभ है।\n\nलाभ = विक्रय मूल्य - क्रय मूल्य\n     = 960 - 800\n     = रु. 160\n\n∴ लाभ = रु. 160 ✓",
  "difficulty": "Easy",
  "language": "hi"
}
```

### Punjabi
```json
{
  "questionId": "PNL-QL-001-VAR-12345-PA",
  "archetypeId": "PNL-001",
  "cpId": "PNL-CP-001",
  "taskKind": "basicCostPriceSellingPrice",
  "solveMode": "findProfitAmount",
  "stem": "ਇੱਕ ਦੁਕਾਨਦਾਰ ਇੱਕ ਵਸਤੂ ਨੂੰ ਰੁ. 800 ਵਿੱਚ ਖਰੀਦਦਾ ਹੈ ਅਤੇ ਰੁ. 960 ਵਿੱਚ ਵੇਚਦਾ ਹੈ। ਉਸਦਾ ਲਾਭ ਪਤਾ ਕਰੋ।",
  "variables": {
    "costPrice": 800,
    "sellingPrice": 960
  },
  "answer": {
    "value": 160,
    "type": "AMOUNT",
    "unit": "ਰੁ."
  },
  "explanation": "ਦਿੱਤਾ ਗਿਆ ਹੈ: ਕ੍ਰੈ ਮੁੱਲ = ਰੁ. 800, ਵਿਕਰੈ ਮੁੱਲ = ਰੁ. 960\n\nਕਿਉਂਕਿ ਵਿਕਰੈ ਮੁੱਲ > ਕ੍ਰੈ ਮੁੱਲ, ਇਸ ਲਈ ਲਾਭ ਹੈ।\n\nਲਾਭ = ਵਿਕਰੈ ਮੁੱਲ - ਕ੍ਰੈ ਮੁੱਲ\n     = 960 - 800\n     = ਰੁ. 160\n\n∴ ਲਾਭ = ਰੁ. 160 ✓",
  "difficulty": "Easy",
  "language": "pa"
}
```

---

**Document Version:** 1.0  
**Last Updated:** Following PCT-007 patterns  
**Status:** Ready for Implementation  
**Owner:** Quant V4 Development Team
