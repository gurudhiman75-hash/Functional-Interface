import { add, angle, equals, rational } from "../../../../../shared/geometry";
import { assert, pass } from "./test-helpers";

const reduced = rational(30, 45);
assert(reduced.numerator === 2n && reduced.denominator === 3n, "Rational reduction failed");
const total = add(angle(90), angle(45, 2));
assert(equals(total, rational(225, 2)), "Exact angle addition failed");
const exact = angle(1, 3);
assert(exact.unit === "DEGREE" && exact.denominator === 3n, "Exact rational-degree angle failed");
pass("exact-angle");
