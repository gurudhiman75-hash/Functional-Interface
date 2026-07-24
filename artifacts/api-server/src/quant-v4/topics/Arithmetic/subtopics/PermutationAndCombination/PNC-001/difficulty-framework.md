# PNC-001 Difficulty Framework

Difficulty is based on structural complexity, computational effort and reasoning depth—not merely the size of the final count.

## Easy

- one direct addition or multiplication rule;
- direct factorial evaluation or `0! = 1! = 1`;
- arranging all distinct objects;
- direct familiar unordered selection;
- a short word arrangement with one repeated category;
- direct non-zero-digit number formation;
- repetition-allowed code formation with no leading restriction;
- selecting a committee and appointing one chairperson;
- finding the role-assignment multiplier for a fixed selected group.

## Medium

- three-stage counting or disjoint product cases;
- simple complement or bounded factorial recovery;
- partial permutation or direct `nCr` interpretation;
- combination symmetry;
- multiset arrangements with two repeated categories;
- fixing a unique object before arranging the remaining multiset;
- identifying the overcount factor from identical swaps;
- leading-zero correction;
- odd/even final-digit restriction without a multi-case zero split;
- alphanumeric stage multiplication;
- bounded inverse alphabet recovery;
- selecting a group before two or three distinct appointments;
- selecting and arranging every chosen object while preserving the `nCs × s! = nPs` bridge.

## Hard

- inverse factorial, permutation or combination reasoning with an explicit search domain;
- a word with several repeated categories and a larger exact correction;
- fixing one copy of a repeated object and updating its multiplicity correctly;
- bounded recovery of an unknown repeated multiplicity;
- even numbers with separate zero and non-zero-even final cases;
- divisibility-by-5 cases with different first-position counts;
- controlled threshold-prefix reasoning;
- exact multiplicity pattern `2,1,1` in codes;
- bounded unique recovery of the pool size, selected-group size or role count from `nCs × sPk`.

## Need-based distribution rule

No final Easy/Medium/Hard quota is fixed for PNC-001 or the P&C family. Each QL receives the difficulty supported by its actual structure.

The current six-active-CP checkpoint contains:

- Easy: 39;
- Medium: 44;
- Hard: 21;
- Total: 104.

These are observed checkpoint counts used for regression control. They are not targets for future additions or PNC-002.
