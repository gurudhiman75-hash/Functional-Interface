# GEO-RIV-001-CP002 — Indus River System

**Chapter:** GEO-RIV-001 — Indian Rivers & Drainage System  
**CP:** GEO-RIV-001-CP002  
**Status:** IMPLEMENTATION SPEC V1

## Scope

Build a deterministic, source-backed Static GK package for the Indus river system with emphasis on relations repeatedly tested in competitive exams.

## Canonical knowledge domains

### A. System membership
- Indus
- Jhelum
- Chenab
- Ravi
- Beas
- Satluj

### B. Indus anchors
- source feature / source region
- Tibetan name
- major tributaries
- selected Ladakh tributary/location associations

### C. Jhelum
- Verinag source
- Wular Lake association
- selected important tributary relations only where source locators are strong

### D. Chenab
- Chandra + Bhaga formation
- Tandi confluence
- Baralacha Pass / Lahaul-Spiti source-area association
- selected tributaries such as Miyar Nallah / Marusudar only when useful for exam-grade distractors

### E. Ravi
- Chamba district source region
- perennial character
- Budhil and Nai/Dhona tributary relations
- joins Chenab

### F. Beas
- Beas Kund source
- Rohtang Pass / Pir Panjal source region
- joins Satluj

### G. Satluj
- source near Mansarovar Lake in Tibet
- Shipkila entry/course association
- Spiti tributary
- relation with Beas

## Proposed question families

1. **QL-010 — Direct river association**  
   River → source, lake, pass, tributary or parent-river relation.

2. **QL-011 — Reverse association**  
   Source/place/tributary → river.

3. **QL-012 — Tributary / parent-river identification**  
   Identify which river a tributary belongs to.

4. **QL-013 — Confluence / formation**  
   Example topology: Chandra + Bhaga → Chenab.

5. **QL-014 — Correct pair**  
   River — source/place/tributary/parent relation.

6. **QL-015 — Incorrect pair**

7. **QL-016 — Join-order / relation chain**  
   Multi-hop but source-backed ordering or parent-chain discrimination.

8. **QL-017 — Statement I/II**

9. **QL-018 — Multi-statement count**

## Difficulty

### Easy
- one direct relation
- familiar river and clearly separated options
- source/place or major tributary recall

### Medium
- reverse relation
- close distractors from within the Indus system
- two linked facts
- tributary/parent discrimination

### Hard
- multi-hop joining relation
- statement combinations
- close same-system rivers and source places
- relation chain where each component must be correct

Hard wording must remain simple.

## Distractor rules

Prefer distractors from the same semantic class:
- river for river
- source place for source place
- tributary for tributary
- pass for pass
- lake for lake

Do not mix obviously different object types merely to fill four options.

All distractors must be independently true/false against the canonical relation graph so an accidental second answer cannot appear.

## Explanation standard

Explanations should:
1. state the correct relation directly;
2. add the minimum related fact needed to show why the answer fits;
3. correct nearby wrong pairs when useful;
4. remain short and exam-like.

Example style:
> Chenab is formed by the Chandra and Bhaga rivers at Tandi in Himachal Pradesh. Therefore, Tandi is the correct answer.

Avoid generic wording such as “this matches the reviewed relation.”

## Initial implementation gate

Before question generation, CP002 must have:
- source-authority extensions
- canonical fact corpus
- fact/source validator
- relation-class inventory
- ambiguity/discrepancy notes
- deterministic fact IDs
- no current-policy/treaty facts in the static corpus

## Review checkpoint target

First review batch should contain about 50–60 questions across QL-010..018 with:
- all major river entities represented
- source/place/tributary/confluence relations represented
- Easy/Medium/Hard separation
- no semantic duplicate questions
- simple exam-like language
- detailed but concise explanations
