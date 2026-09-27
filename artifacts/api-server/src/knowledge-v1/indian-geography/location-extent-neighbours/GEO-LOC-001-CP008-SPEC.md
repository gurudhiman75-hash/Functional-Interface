# GEO-LOC-001 CP008 — Reference Lines & State/UT Map Associations

Status: REVIEW CANDIDATE V1
Parent blueprint: `GEO-LOC-001-BLUEPRINT.md`
Permanent QLs: `GEO-LOC-001-QL-064` to `GEO-LOC-001-QL-072`

## Ownership map

| QL | Owning fact family |
| --- | --- |
| QL064 | Tropic of Cancer — eight-state count |
| QL065 | Tropic of Cancer — complete state set |
| QL066 | Tropic of Cancer — west-to-east order |
| QL067 | Tropic of Cancer — crossed/not-crossed state identification |
| QL068 | Tropic of Cancer — regional state grouping |
| QL069 | Standard Meridian — five-state set |
| QL070 | Standard Meridian — north-to-south state order |
| QL071 | Standard Meridian — crossed/not-crossed state identification |
| QL072 | States crossed by both reference lines |

## Review contract

- 54 questions; six per QL.
- Easy 18 / Medium 30 / Hard 6.
- Answer positions A14 / B14 / C13 / D13.
- Tropic of Cancer crosses eight states: Gujarat, Rajasthan, Madhya Pradesh, Chhattisgarh, Jharkhand, West Bengal, Tripura and Mizoram.
- West-to-east order follows the same sequence.
- India’s Standard Meridian at 82°30'E crosses Uttar Pradesh, Madhya Pradesh, Chhattisgarh, Odisha and Andhra Pradesh.
- North-to-south order follows that sequence.
- Madhya Pradesh and Chhattisgarh are crossed by both the Tropic of Cancer and the Standard Meridian.
- CP008 tests state-map association; CP003 remains the owner of time calculations and IST mechanics.
- Avoid district/city trivia unless essential to a reference-line fact.
- Review-only lifecycle; runtime publication disabled.

## Boundary

CP008 owns the state-level map associations of the Tropic of Cancer and Standard Meridian. CP009 owns coastal and international-border state/UT geography; CP003 owns timekeeping applications.
