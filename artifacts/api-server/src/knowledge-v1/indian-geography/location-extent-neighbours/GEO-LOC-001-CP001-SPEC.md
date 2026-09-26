# GEO-LOC-001 CP001 — Astronomical Location, Extent & Size Basics

Status: REVIEW CANDIDATE V1
Parent blueprint: `GEO-LOC-001-BLUEPRINT.md`
Permanent QLs: `GEO-LOC-001-QL-001` to `GEO-LOC-001-QL-009`

## Ownership map

| QL | Owning fact family |
| --- | --- |
| QL001 | Northern and Eastern Hemisphere position |
| QL002 | Mainland latitudinal extent |
| QL003 | Mainland longitudinal extent |
| QL004 | Tropic of Cancer |
| QL005 | Standard Meridian of India |
| QL006 | North–south and east–west mainland dimensions |
| QL007 | Area, world share and size rank |
| QL008 | East–west time lag and one standard time |
| QL009 | Mixed coordinate and extent interpretation |

## Review contract

- 54 questions; six per QL.
- Easy 18 / Medium 30 / Hard 6.
- Answer positions A14 / B14 / C13 / D13.
- Use NCERT's standard mainland coordinates: 8°4'N–37°6'N and 68°7'E–97°25'E.
- Tropic of Cancer: 23°30'N.
- Standard Meridian: 82°30'E, passing through Mirzapur in Uttar Pradesh.
- Mainland north–south extent: about 3,214 km; east–west extent: about 2,933 km.
- Area: about 3.28 million sq km; about 2.4% of world geographical area; seventh-largest country by area in the textbook framing.
- Gujarat–Arunachal local-time difference: about two hours; the whole country follows the Standard Meridian time.
- Coordinate questions must say they are testing compatibility with the stated mainland latitude/longitude limits; a bounding-box coordinate must not be falsely claimed to lie within Indian territory.
- Explanations should be simple and useful, not one-line answer restatements.
- Review-only lifecycle; runtime publication disabled.

## Boundary

CP001 owns the core astronomical-location and size facts needed for later map reasoning. Extreme points, neighbours, surrounding seas, island relations and state/UT border/coast associations belong to later CPs.
