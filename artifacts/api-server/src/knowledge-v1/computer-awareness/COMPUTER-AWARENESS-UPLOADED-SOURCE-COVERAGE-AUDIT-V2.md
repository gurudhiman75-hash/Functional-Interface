# Computer Awareness — Uploaded-Source Coverage Audit V2

Status: current against `New-main` head `b879f3fda17d6e41e9854cccfbb811680ca4a361`  
Date: 2026-09-09  
Audit type: uploaded-source coverage, chapter ownership, completion state and editorial controls

## 1. Source inventory

The uploaded Library source was found in three copies:

- `1774936389OBJECTIVE Computer Awareness E book (Arihant Experts).pdf`
- duplicate copy 1
- duplicate copy 2

The copies are treated as one source authority:

- Library file: `libfile_e49f8a55e67c8191811e33014f5fd7c9`
- PDF size: 3,199,463 bytes
- Length: 191 pages
- Extracted source read: 14,721 lines

The duplicate files are not separate evidence. The book is used for topic discovery and coverage checks. Old, product-specific or version-sensitive facts still need a current authority check.

## 2. Uploaded-source chapter map

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

The glossary, abbreviations and practice sets are supporting coverage checks. They are not separate chapters.

## 3. Current implementation checkpoint

All eight planned Computer chapters are now present on `New-main`.

| Chapter | Current owner | Frozen or review corpus | Current state |
|---|---|---:|---|
| COM-001 Fundamentals and Architecture | CP-001 to CP-007 | 440 questions per language | Registered through the shared Question Studio; BANK_ONLY; Easy/Medium only |
| COM-002 Operating Systems, Files and Windows | COM-002 | 520 per language | Approved and active; BANK_ONLY; Hard and downstream release locked |
| COM-003 Office and Productivity Software | COM-003 | 228 per language | Frozen and active; BANK_ONLY |
| COM-004 Internet, Web, E-mail and Digital Services | COM-004 | 204 per language | Frozen and active; BANK_ONLY |
| COM-005 Networking | COM-005 | 38 per language | Frozen and active; BANK_ONLY |
| COM-006 Cyber Security | COM-006 | 32 per language | Frozen and connected; BANK_ONLY |
| COM-007 Software, Programming Languages and Database Basics | COM-007 | 32 per language | Frozen and connected; BANK_ONLY |
| COM-008 Data Representation, Number Systems and Computer Codes | COM-008 | 32 per language | Approved and active; BANK_ONLY |

The visible total is 1,526 questions per language, or 4,578 English/Hindi/Punjabi language versions. This total combines frozen generator pools and fixed review corpora; it is not a promise that every generated question is a separate permanent Question Bank row.

All current Computer packages preserve these boundaries:

- English, Hindi and Punjabi parity.
- Easy and Medium only.
- Hard difficulty disabled.
- Manual Question Bank acceptance through the shared BANK_ONLY lifecycle.
- No automatic Question Bank insertion.
- Test Builder, mock tests, public/student publication and production release disabled.
- Deterministic selection without replacement where the package supports generation.

## 4. Source-area coverage

| Uploaded-source area | Current result | Decision |
|---|---|---|
| Introduction, history and generations | COM-001 CP-006 now has a 28-question English freeze, matching Hindi and Punjabi localization, and Question Studio routing | Covered. The old scope note was stale and is corrected in this change |
| Architecture, CPU and basic units | COM-001 CP-002 covers input/output flow, CPU, Arithmetic Logic Unit and Control Unit basics | Core covered |
| Hardware and input/output devices | COM-001 CP-003 to CP-005 cover common input/output devices, and CP-007 covers motherboard parts, instruction-cycle steps, buses, ports, display measures, printer types and combined input/output devices | Covered at the current awareness level; product-specific specifications remain out of scope |
| Memory and storage | COM-001 CP-001 has 9 permanent learning units and 360 questions per language | Covered strongly |
| Data representation and computer codes | COM-008 has 8 learning units and 32 questions per language covering number systems, bits/bytes/nibbles, small conversions, Binary Coded Decimal, American Standard Code for Information Interchange, Extended Binary Coded Decimal Interchange Code and Unicode | Covered |
| System/application software, utilities, drivers and firmware | COM-007 covers the main software classes, utilities, drivers and firmware | Core covered |
| Operating systems, files and Windows | COM-002 has 13 permanent learning units and 520 questions per language, with the final BANK_ONLY activation merged | Covered at awareness level. Avoid obsolete version trivia |
| Programming concepts | COM-007 covers language levels, examples and translator roles | Partial. Program documentation, object-oriented programming and debugging need explicit source-gap decisions |
| Microsoft Office | COM-003 has 19 learning units and 228 questions per language | Covered at the current awareness level |
| Database concepts | COM-007 covers basic tables, keys and Structured Query Language | Partial. Database models, Database Management System functions, integrity, security, backup/recovery and language groups need explicit coverage decisions |
| Data communication and networking | COM-005 covers network types, topologies, devices, protocols, addressing, media and transmission modes | Partial. Peer-to-peer/client-server models, architecture/layers, switching/routing and wider communication basics need one source-gap pass |
| Internet, web, e-mail and digital services | COM-004 has 17 learning units and 204 questions per language | Covered at the current awareness level |
| Computer security | COM-006 has 8 learning units and 32 questions per language | Covered at basic exam depth |
| Glossary and abbreviations | Shared editorial validation is active in the knowledge-v1 generation path | Permanent rule retained and strengthened in this change |

## 5. Confirmed remaining source gaps

The audit does not create a new chapter. The remaining work belongs to existing owners.

### Resolved hardware gap

The earlier COM-001 hardware gap is covered by CP-007 on the current `New-main`. It includes durable, exam-level questions for motherboard parts, instruction-cycle steps, registers, buses, ports, display measures, printer types and combined input/output devices.

### COM-007 programming and database gap

Check whether the uploaded source adds useful awareness-level questions for:

- program documentation
- object-oriented programming
- debugging
- hierarchical, network and relational database models
- Database Management System functions
- database integrity and security
- backup and recovery
- database language groups

Do not add coding exercises or degree-level database theory.

### COM-005 networking gap

Check whether the uploaded source adds useful awareness-level questions for:

- peer-to-peer and client-server models
- basic network architecture and layers
- gateway and bridge roles
- data communication basics
- switching and routing concepts

Do not duplicate the existing device, protocol and addressing questions.

These gaps are genuine coverage items, but they require their own source-backed merge/split and localization review. They are not silently marked complete by this audit.

## 6. Source-risk rules

Do not copy these source areas blindly:

- old Windows or Office version lists
- floppy-disk capacities
- old connection technologies
- product-specific shortcut claims
- dated Internet history
- questionable abbreviation expansions
- facts that depend on an old exam convention

Use durable concepts, current primary authorities and target-exam evidence. Do not create Hard questions from old trivia.

## 7. Permanent Computer editorial rules

Every future Computer question must:

- start directly with the computer task;
- avoid openings such as “In the following”, “Consider the following”, “Read the question carefully”, “Please select”, “Select the correct answer” and “Choose the correct answer”;
- test computer knowledge, not difficult English;
- use short, question-specific explanations;
- give one simple reason for the answer;
- write the full form of every abbreviation used in an explanation;
- avoid “associated” and “association” as filler;
- keep English, Hindi and Punjabi on the same answer, option order and meaning;
- remain Easy or Medium until a separate Hard authority is approved;
- preserve BANK_ONLY and all downstream release locks.

The shared knowledge-v1 validation path enforces the stem, explanation, abbreviation and wording rules for future generated Computer questions.

## 8. Audit conclusion

COM-001 through COM-008 are implemented and connected to the shared Question Studio. COM-008 is no longer missing, and COM-002 is no longer waiting for its final BANK_ONLY activation.

Computer Awareness is not yet source-saturated against every detail in the uploaded book. The remaining evidence-backed work is:

1. COM-007 programming and database source-gap review.
2. COM-005 networking source-gap review.

No new chapter is required at this checkpoint.
