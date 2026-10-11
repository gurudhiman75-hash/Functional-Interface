# Delayed departure with unsigned separation — 2026-10-10

Source: Arun Sharma (2018), PDF416, printed III.172, Applications Q22. Extracted text was read in the preceding source pass; no page-image or authenticated original exam-paper provenance is claimed.

The source describes an 800 km journey, departures at 18:00 and 21:30, a 15 km/h speed advantage for the later car, and a 70 km separation at 04:30 the next morning. It does not state which car is ahead. The earlier car has travelled for 10.5 hours and the later for 7 hours.

Let v be the earlier car's speed. Their signed separation is 10.5v−7(v+15)=3.5v−105. The unsigned observation gives |3.5v−105|=70, so v=50 **or** v=10 km/h.

| Earlier speed | Later speed | Earlier position | Later position | Observation |
| --- | --- | --- | --- | --- |
| 50 km/h | 65 km/h | 525 km | 455 km | Earlier car leads by 70 km |
| 10 km/h | 25 km/h | 105 km | 175 km | Later car leads by 70 km |

All positions lie strictly within the 800 km route. Neither solution can be rejected by an arrival or stopping condition. Both have constant speeds and the required 15 km/h difference. The answer is therefore **cannot be determined**. Choosing 50 km/h alone silently adds an ahead/behind condition absent from the question.

`delayed-departure-source-proof.test.ts` executes the existing CP012 coupled linear inverse solver for both signs and independently reconstructs both position pairs. It also executes the existing CP004 delayed-start pursuit solver and verifies that the catch occurs after the observation in the 50 km/h state and before it in the 10 km/h state.

This resolves the scoped Q22 semantic follow-up. The algebra and pursuit authorities already exist; no new permanent QL, learner batch, live registration, solver promotion or release permission is added. The remaining integration concern is preserving both signs when an unsigned separation is presented as an inverse question. The wider source audit and UI evidence remain open.
