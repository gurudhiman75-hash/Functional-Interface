import { strict as assert } from "node:assert";
import { rational, verifySquareRootEquationCandidate } from "../../../../../shared/surds-indices";

// sqrt(x+2)=x -> squaring gives candidates x=2 and x=-1.
assert.equal(verifySquareRootEquationCandidate(rational(4), rational(2)).valid, true);
assert.equal(verifySquareRootEquationCandidate(rational(1), rational(-1)).valid, false);
assert.equal(verifySquareRootEquationCandidate(rational(-1), rational(1)).valid, false);
