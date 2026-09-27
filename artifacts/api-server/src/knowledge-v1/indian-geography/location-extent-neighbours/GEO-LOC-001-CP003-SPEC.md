# GEO-LOC-001 CP003 — Indian Standard Time & Longitude Applications

Status: REVIEW CANDIDATE V1
Parent blueprint: `GEO-LOC-001-BLUEPRINT.md`
Permanent QLs: `GEO-LOC-001-QL-019` to `GEO-LOC-001-QL-027`

## Ownership map

| QL | Owning fact family |
| --- | --- |
| QL019 | Standard Meridian — 82°30'E |
| QL020 | Mirzapur reference and central meridian |
| QL021 | IST as one national standard time |
| QL022 | IST and UTC/GMT offset (+5:30) |
| QL023 | Longitude–time relation: 1° = 4 minutes |
| QL024 | 15° longitude = 1 hour |
| QL025 | Eastern places are ahead in local solar time |
| QL026 | Gujarat–Arunachal local-time difference |
| QL027 | Mixed IST / longitude-time calculations |

## Review contract

- 54 questions; six per QL.
- Easy 18 / Medium 30 / Hard 6.
- Answer positions A14 / B14 / C13 / D13.
- Keep official clock time separate from local solar time.
- Use 82°30'E as India's Standard Meridian and Mirzapur in Uttar Pradesh as the textbook reference point.
- IST is 5 hours 30 minutes ahead of UTC/GMT.
- Use the standard longitude-time relation of 4 minutes per degree, or 15° per hour.
- Eastern longitudes are ahead in local solar time; western longitudes are behind.
- Gujarat–Arunachal questions use the textbook approximation of about two hours.
- Calculation questions must remain short, transparent and exam-like.
- Review-only lifecycle; runtime publication disabled.

## Boundary

CP003 owns applications of standard time and longitude. CP001 owns the basic identification of the Standard Meridian; CP003 tests why it is used, how local solar time varies, and how simple longitude-time calculations work.
