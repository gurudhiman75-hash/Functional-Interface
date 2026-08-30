# Partnership

`PRT-001` models partnership profit and loss by converting each partner's capital history into an exact capital-time weight. Ordered salaries, commissions, charity, reserves, and expenses are applied before the remaining pool is divided.

The runtime uses exact rational arithmetic throughout. It never relies on floating-point equality or rounded intermediate values. A structurally independent boundary-sweep verifier recomputes every generated result before a package can be returned.

## Runtime scope

- Seven canonical problems, from same-period investment to compound timeline/allocation cases.
- Twenty-eight distinct forward and reverse solve modes.
- Thirty-two human-owned question languages with English, Hindi, and Punjabi semantic counterparts.
- Easy, Medium, and Hard generation bands.
- Four-option answer packages with deterministic seeds, traceability, reasoning graphs, and validation evidence.

The chapter is registered in the Quant V4 generation engine and is available to Question Studio as `PRT-001`.
