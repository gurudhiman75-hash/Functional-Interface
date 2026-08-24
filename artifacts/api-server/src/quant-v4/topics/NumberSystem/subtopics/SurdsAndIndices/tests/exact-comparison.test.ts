import { strict as assert } from "node:assert";
import { compareSquareSurds, rational, squareSurd } from "../../../../../shared/surds-indices";

const left = squareSurd(rational(10), 24n);
const right = squareSurd(rational(7), 39n);
assert.equal(compareSquareSurds(left, right), 1);
assert.equal(compareSquareSurds(right, left), -1);
assert.equal(compareSquareSurds(squareSurd(rational(1), 8n), squareSurd(rational(2), 2n)), 0);
assert.equal(compareSquareSurds(squareSurd(rational(-1), 8n), squareSurd(rational(-2), 2n)), 0);
