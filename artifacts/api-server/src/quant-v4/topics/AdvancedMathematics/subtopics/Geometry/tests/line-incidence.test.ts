import { areCollinear, rational } from "../../../../../shared/geometry";
import { assert, pass } from "./test-helpers";

const p = (x: number, y: number) => ({ x: rational(x), y: rational(y) });
assert(areCollinear(p(0, 0), p(2, 2), p(5, 5)), "Collinear points were rejected");
assert(!areCollinear(p(0, 0), p(2, 2), p(5, 4)), "Non-collinear points were accepted");
pass("line-incidence");
