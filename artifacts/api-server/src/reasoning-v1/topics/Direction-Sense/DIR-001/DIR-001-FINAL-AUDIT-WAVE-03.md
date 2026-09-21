# DIR-001 Final Audit — Wave 03

## Scope

Hindi and Punjabi explanation quality for DIR-CP-004 and DIR-CP-005 (DIR-QL-011..022).

## Finding

Both localized paths preserved semantics but collapsed rich English solve evidence into generic instructions such as “place the points” or “compare the final positions”. The English generators already hold exact relation distances, mover routes, endpoint coordinates and distance calculations.

## Remediation

### DIR-CP-004
- replay every actual stated relation in the learner explanation;
- for direction-and-distance questions, show the actual horizontal/vertical separation and straight-line calculation;
- retain the localized explanation diagram.

### DIR-CP-005
- show every mover's actual route leg;
- show each final position relative to the common reference point;
- for pair-comparison QLs, show the actual endpoint difference;
- show Pythagorean straight-line calculation where required;
- for nearest/farthest questions, show each mover's actual distance from point O.

## Safety

Only localized explanation text changes. Structured prompts, English authority, seeds, difficulty, options, correct index, correct answer, diagrams and solver output are unchanged.

## Regression

Hindi/Punjabi tests now reject the prior generic explanation boilerplate and require real relation/movement distances from the solved source record. QLs with a Pythagorean source calculation must expose that calculation in the localized explanation.
