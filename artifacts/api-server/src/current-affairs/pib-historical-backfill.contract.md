# CP-034 PIB historical archive contract

- Generate Yesterday uses PIB's official All Releases monthly listing as the preferred historical discovery surface.
- A release is accepted only when the official listing places an explicit `Posted on` date matching the requested target date.
- Only HTTPS `pib.gov.in` press-release URLs with numeric PRIDs are accepted.
- The ASP.NET exact-date postback remains a bounded fallback for month-boundary cases.
- The archive pass is a completeness pass and does not skip merely because one target-date RSS candidate already exists.
- Raw article text is not persisted by historical discovery.
- Historical discovery does not bypass classification, strict verification, exam relevance, editorial review, release authority, Question Bank promotion, or learner publication gates.
