# Tangent-track maximum separation — 2026-10-10

Source: Arun Sharma (2018), PDF415, printed III.171, Applications Q6. Extracted text was read in the previous source pass; no visual inspection or original exam-paper authentication is claimed.

Two externally tangent circular tracks have radii 40 m and 80 m. Speeds are 80π m/min and 40π m/min; both runners start at the tangent point, with the second starting four minutes earlier. The question asks when their straight-line separation is 240 m.

The centers are 120 m apart. Triangle inequality bounds separation by 40+120+80=240 m. Equality requires each runner to be at the outermost point of their own track, on opposite sides of the center line. This condition is independent of their running directions.

The lap periods are exactly 1 minute and 4 minutes. The four-minute headstart is one full lap on the larger track. Measured from the first runner's start, the outermost-point times are t=1/2+k and t=−2+4j, for integers k,j. Doubling the times makes the first expression odd and the second even; they cannot coincide at any time. The answer is **never**. In particular, at 12.5 minutes the first runner is at the outermost point, but the second has completed 33/8 laps and is not at its outermost point.

`tangent-tracks-source-proof.test.ts` executes the existing CP011 circumference/rate translation for both exact lap rates using common π-scaled units, verifies the periods and headstart phase, and checks the necessary maximum-distance congruences. The all-time impossibility follows from parity, not a finite sampling window or approximate π.

This resolves the scoped maximum-distance source question without adding a permanent QL or a learner batch. It does not make the one-track CP006 contract capable of arbitrary two-track straight-line distances. General two-radius geometry, nonmaximum distances and integration ownership remain unverified. No frozen content, live registration or lifecycle gate changes.
