# Computer Awareness — Uploaded-Source Coverage Audit V1

Status: completed against New-main after COM-005 merge  
Date: 2026-09-08  
Audit type: source coverage, ownership, completion state and editorial risk

## 1. Source inventory

Library search found three copies of the same uploaded PDF:

- 1774936389OBJECTIVE Computer Awareness E book (Arihant Experts).pdf
- duplicate copy 1
- duplicate copy 2

Unique source used for this audit:

- Library file: libfile_e49f8a55e67c8191811e33014f5fd7c9
- PDF size: 3,199,463 bytes
- Length: 191 pages
- Full extracted source read: 14,721 lines

The duplicate copies are not separate evidence. The book is useful for topic discovery and coverage checks, but old or version-sensitive facts must not be copied without a fresh authority check.

## 2. Source chapter map

The book contains these main areas:

1. Introduction to Computer
2. Computer Architecture
3. Computer Hardware
4. Computer Memory
5. Data Representation
6. Computer Software
7. Operating System
8. Programming Concepts
9. Microsoft Windows
10. Microsoft Office
11. Database Concepts
12. Data Communication and Networking
13. Internet and its Services
14. Computer Security

It also contains a glossary, abbreviations and practice sets. These are supporting checks, not separate chapters.

## 3. Current repository coverage

| Source area | Current owner | Current state | Audit result |
|---|---|---|---|
| Introduction, history and computer generations | COM-001 CP-006 | English freeze and Question Studio routing exist; scope file still calls the QLs provisional | Covered in code; approval checkpoint should be made explicit |
| Computer architecture and basic units | COM-001 CP-002 to CP-005 | Frozen BANK_ONLY corpus | Core covered |
| Hardware and input/output devices | COM-001 CP-002 to CP-005 | Core devices are covered | Partial: motherboard parts, instruction cycle, DMA, UPS, detailed device types and I/O ports need a source-gap pass |
| Memory and storage | COM-001 CP-001 | 9 permanent QLs; 360 audited questions per language; frozen BANK_ONLY | Covered strongly |
| Data representation and computer codes | No completed owner | No permanent chapter or frozen corpus | Missing |
| System/application software, utilities, drivers and firmware | COM-007 | 8 QLs; 32 questions per language; review-only | Core covered |
| Operating systems, files and Windows | COM-002 | V6/V5 review content and adapter exist; standard final freeze still has an unresolved gate | Content is broad; completion is still pending |
| Programming concepts | COM-007 | Translator and language basics are covered | Partial: program documentation, object-oriented programming and debugging are not clearly covered |
| Microsoft Windows | COM-002 | File, folder, Explorer, shortcuts and basic Windows concepts are in scope | Broadly covered; avoid obsolete version trivia |
| Microsoft Office | COM-003 | 19 QLs; 228 questions per language | Covered at the current chapter level |
| Database concepts | COM-007 | Basic database, table, key and Structured Query Language questions exist | Partial: database models, Database Management System functions, integrity, backup/recovery and database language groups need review |
| Data communication and networking | COM-005 | 7 QLs; 38 questions per language; merged and registered | Core covered; peer-to-peer/client-server, network layers and some communication concepts remain thin |
| Internet, web, e-mail and digital services | COM-004 | 17 QLs; 204 questions per language; BANK_ONLY | Covered at the current chapter level |
| Computer security | COM-006 | 8 QLs; 32 questions per language; registered review-only | Covered at basic exam depth |
| Glossary and abbreviations | Cross-chapter rule | Full forms are present in the newer review files | Keep as a permanent validation rule |

## 4. Quantitative checkpoint

The current Computer packages contain these visible frozen or review surfaces:

- COM-001 CP-001: 9 permanent QLs; 360 questions per language.
- COM-001 CP-002 to CP-005: 16 permanent QLs; 32 questions per language in the review corpus.
- COM-001 CP-006: 7 provisional QLs; 28 English questions in the freeze authority; localized freeze code exists.
- COM-002: 13 QLs in the V6/V5 operational scope; 520 English corpus questions and 26 human-review questions. Its standard completion gate is not closed.
- COM-003: 19 QLs; 228 questions per language.
- COM-004: 17 QLs; 204 questions per language.
- COM-005: 7 QLs; 38 questions per language; merged in commit b1e366df68ff127f69c2da8bf95570aaac52dba4.
- COM-006: 8 QLs; 32 questions per language.
- COM-007: 8 QLs; 32 questions per language.

These numbers are not one single total because some packages expose large generator pools while their human-review files show only a review sample.

## 5. Confirmed gaps from the uploaded source

### A. Data Representation is the largest missing area

The source has a full chapter on:

- binary, decimal, octal and hexadecimal number systems
- bits, bytes and nibbles
- number-system conversion
- Binary Coded Decimal
- American Standard Code for Information Interchange
- Extended Binary Coded Decimal Interchange Code
- Unicode

No completed Computer package owns this area. The next chapter should be:

COM-008 — Data Representation, Number Systems and Computer Codes

Keep it exam-level. Do not turn it into a long calculation chapter. Use direct identification, small conversion tasks and code comparisons only where they match the target exams.

### B. Hardware coverage is not yet source-saturated

The source includes items that are not demonstrated by the current CP-002 to CP-005 review file:

- motherboard and its main parts
- fetch, decode, execute and store steps
- registers, accumulator, buffer and time slice
- Direct Memory Access
- Uninterruptible Power Supply
- internal, external, data, address and control buses
- sockets, slots and input/output ports
- Optical Mark Recognition, Optical Character Recognition and Magnetic Ink Character Recognition
- smart-card readers and biometric sensors
- monitor types and display measures
- impact and non-impact printer types
- plotters, speakers and projectors
- devices that perform both input and output

These should first go through a merge/split audit. They may belong in later COM-001 component packs instead of a new chapter.

### C. Programming coverage is only partial

The source includes:

- program and programmer basics
- programming-language groups
- language examples and application areas
- program documentation
- object-oriented programming
- debugging

COM-007 currently covers the main language levels and translator roles, but the last four items need explicit coverage checks. Do not add coding exercises; this subject owns awareness-level facts only.

### D. Database coverage is only partial

The source includes:

- hierarchical, network and relational database models
- database tables and components
- Database Management System functions
- database languages
- integrity and security
- backup and recovery
- advantages and limits of database systems

COM-007 currently has a good relational base, but it does not prove full coverage of these source surfaces.

### E. Networking needs one gap pass

COM-005 covers network types, topologies, devices, protocols, addressing, media and transmission modes. The source also includes:

- peer-to-peer and client-server models
- network architecture and layers
- gateway and bridge roles
- data communication basics
- switching and routing concepts

Some device roles are present, but peer-to-peer/client-server and layer concepts should be checked before calling networking source-saturated.

## 6. Source facts that must not be copied blindly

The uploaded book contains old or fragile material, including:

- old Windows and Microsoft Office version lists
- floppy-disk facts
- old connection technologies
- product-specific shortcut details
- dated Internet history descriptions
- questionable expansions of some terms
- statements that depend on old exam conventions

Use durable concepts first. For a changing product or service, use a current primary authority or omit the fact. Do not create Hard questions from obsolete trivia.

## 7. Permanent editorial rules

Every future Computer question must pass these rules:

- Use a direct stem: What is..., Which device..., What does..., or Which statement is correct?
- Reject filler openings such as In the following, Consider the following, Read the question carefully, Please select and unnecessary Which of the following.
- Test computer knowledge, not difficult English.
- Keep explanations short and question-specific.
- Give one simple reason for the correct answer.
- Write the full form of every abbreviation used in the explanation.
- Do not use associated or association as filler wording.
- Keep English, Hindi and Punjabi on the same answer, option order and meaning.
- Keep Easy and Medium only until a separately approved Hard policy exists.
- Keep Question Bank manual acceptance and downstream release locks unchanged.

## 8. Pending work after this audit

1. Finish the COM-002 V6/V5 final freeze and adapter audit. The current localization file still marks the V5 localization as review-only and not frozen.
2. Make the COM-001 CP-006 human-review/approval checkpoint explicit.
3. Run the hardware source-gap audit and add only supported component-pack QLs.
4. Implement COM-008 for Data Representation, Number Systems and Computer Codes.
5. Extend COM-007 only for proven programming and database gaps.
6. Extend COM-005 only for proven peer-to-peer/client-server and layer gaps.
7. Add one shared editorial test for unnecessary stem openings across all Computer packages.

## 9. Audit conclusion

Computer Awareness is not yet fully saturated against the uploaded source.

Strongly covered: memory/storage, office, Internet/web/e-mail, basic security and the main networking core.

Still pending or partial: COM-002 final closure, data representation, deeper hardware, programming concepts, database concepts and selected networking surfaces.

Recommended next implementation: COM-008 — Data Representation, Number Systems and Computer Codes.
