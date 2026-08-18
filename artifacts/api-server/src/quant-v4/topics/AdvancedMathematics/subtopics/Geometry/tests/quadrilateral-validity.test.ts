import { classifyQuadrilateral, rational, validateIntendedQuadrilateral } from "../../../../../shared/geometry";
import { assert, pass } from "./test-helpers";

const p = (x: number, y: number) => ({ x: rational(x), y: rational(y) });
const square = [p(0, 0), p(4, 0), p(4, 4), p(0, 4)] as const;
const classified = classifyQuadrilateral(square);
assert(classified.valid, "Valid square failed quadrilateral validity");
assert(classified.families.includes("SQUARE"), "Square subtype not recognized");
const asParallelogram = validateIntendedQuadrilateral(square, "PARALLELOGRAM");
assert(!asParallelogram.valid, "Accidental square strengthening was not rejected for a plain parallelogram target");
assert(asParallelogram.errors.includes("UNINTENDED_STRONGER_SUBTYPE_RECTANGLE"), "Stronger subtype reason was not recorded");
const crossed = [p(0, 0), p(4, 4), p(0, 4), p(4, 0)] as const;
assert(!classifyQuadrilateral(crossed).valid, "Self-crossing quadrilateral was accepted");
pass("quadrilateral-validity");
