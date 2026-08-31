# COM-002 · Operating Systems, Files & Windows — End-to-End Design R1

Status: DISCOVERY / NO PERMANENT CP OR QL IDS YET

## Goal

Build an exam-authentic Computer Awareness chapter for SSC, Banking and Punjab/state exams using `knowledge-v1` while reusing the standard Question Studio lifecycle proven by COM-001.

This chapter must not become a Windows-trivia dump or a college-level Operating Systems course. Permanent learner tasks are allocated only after source/PYQ saturation and merge/split review.

## Scope anchors

Current source review establishes strong ownership for:

- operating-system basics and functions
- desktop/laptop and mobile OS awareness
- common OS examples/non-examples
- real-time OS at awareness-exam depth
- open-source OS awareness
- kernel/core concept
- GUI/CLI interaction concepts
- Windows desktop components
- File Explorer
- files, folders/directories and paths
- file extensions and general file-type mappings
- create/copy/move/rename/delete/search operations
- Recycle Bin and restore/permanent-delete behavior
- durable Windows/File Explorer shortcuts

Source authority is recorded in `com002-source-manifest.ts`.

## Evidence already confirmed

Target-exam evidence currently confirms at least these learner tasks:

- kernel is the core of an operating system
- real-time OS responds within specified time constraints
- OS/non-OS classification
- open-source OS classification
- file-extension concept
- `.tmp` temporary-file extension
- Recycle Bin behavior after ordinary Windows deletion

These surfaces are evidence anchors, not yet permanent QLs.

## Explicit ownership boundaries

### Keep in COM-002

- generic file-extension mechanics
- general file types such as `.tmp`, `.txt`, `.png`, `.jpg`, `.pdf`, `.zip`, `.exe`, `.bat`
- Windows/File Explorer system shortcuts
- GUI-based OS/file management

### Keep out of COM-002 unless later evidence proves otherwise

- Word/Excel/PowerPoint feature and format knowledge -> COM-003 Office & Productivity Software
- web-browser/internet behavior -> COM-004
- networking commands/protocols -> COM-005
- security utilities/malware/firewall -> COM-006
- programming language/compiler concepts -> COM-007
- detailed process scheduling, deadlock, paging algorithms, IPC, kernel architectures -> outside basic Computer Awareness unless SSC/Banking/Punjab evidence explicitly requires them

## Discovery inventory

`com002-operating-system-discovery.ts` currently carries 25 provisional candidates spanning:

1. OS function forward/inverse
2. OS example classification
3. OS type classification
4. real-time OS property
5. open-source/proprietary classification
6. desktop/mobile platform classification
7. kernel identity/function
8. GUI/CLI
9. boot/start-stop basics
10. Windows UI components
11. Windows settings
12. File Explorer
13. file/folder/path concepts
14. extension concept and extension mapping
15. file operations
16. deletion/Recycle Bin/restore/permanent delete
17. Windows/File Explorer shortcuts forward/inverse
18. hidden-item/properties surfaces
19. multi-statement composition
20. matching
21. legacy DOS/command-line basics held behind PYQ evidence

No candidate is a permanent QL yet.

## Merge/split principles

Likely merges to test:

- OS function forward + inverse
- kernel identity + kernel function
- file-extension concept + file-type mapping only if difficulty/topology remains coherent
- Windows shortcuts forward + inverse
- File Explorer + visibility/properties if PYQs do not justify a separate learner task

Likely splits to test:

- broad OS type recognition vs real-time deadline reasoning
- conceptual file operations vs shortcut execution
- deletion behavior vs generic file operations if Recycle Bin produces a sufficiently distinct solver surface

## Canonical fact/object model

Candidate facts should use structured relations rather than authored MCQs. Example relation families:

- `is_operating_system`
- `os_primary_function`
- `os_type_property`
- `license_class`
- `platform_class`
- `component_role`
- `ui_component_function`
- `file_concept_definition`
- `extension_file_type`
- `file_operation_effect`
- `shortcut_action`
- `delete_behavior`

Facts should retain:

- `sourceIds`
- exam/PYQ evidence IDs separately from truth authority
- freshness/validity metadata where version-sensitive
- aliases/localized labels
- distractor neighborhood/group
- ownership notes

## Version-sensitivity rules

Windows UI changes across versions. Therefore:

- prefer durable concepts over exact menu coordinates
- avoid version-specific labels unless the question explicitly names the Windows version
- do not assert that Control Panel is the only route when modern Settings also performs the function
- preserve first-party Microsoft authority for current shortcut/File Explorer behavior
- treat product-version facts as SLOW_MUTABLE/CURRENT rather than IMMUTABLE where appropriate

## Distractor strategy

Distractors must come from semantic neighbors:

- OS vs browser/application/utility
- OS type vs neighboring OS types
- kernel vs shell/device driver/application
- taskbar vs Start menu/desktop/notification area
- File Explorer vs Control Panel/Task Manager/browser
- extension vs filename/path/folder
- `.tmp` vs other plausible extensions
- Recycle Bin vs Control Panel/Taskbar/Start menu
- shortcut keys with nearby Windows actions

No arbitrary string distractors.

## Explanation style

Human-readable and concise:

- state what the concept/action means
- explain why the selected answer matches
- where useful, distinguish the closest misconception
- no engine metadata, source IDs, lifecycle jargon or formula-like templates in learner-facing text

## Localization

English semantic state freezes first.

Hindi/Punjabi localization must preserve:

- same QL
- same canonical semantic state
- same option order
- same correct index
- same source facts/authorities
- same difficulty decision

Technical names/shortcuts such as Windows, Linux, Ubuntu, GUI, CLI, File Explorer, `.tmp`, `Win+E`, `Alt+F4`, `F2` remain appropriately untranslated while surrounding prose is localized naturally.

## Standard Question Studio lifecycle

COM-002 must not define a subject-specific lifecycle.

Once content qualification is complete, it enters the same outer contract as COM-001:

`knowledge-v1 -> Question Studio run -> review states -> manual approval -> Question Bank -> later test/mock/publication gates`

Initial registration must start at standard REVIEW_ONLY. BANK_ONLY is a later explicit gate after normalization/provenance proof and human review.

## Implementation sequence

1. source/PYQ saturation
2. discovery audit
3. merge/split + inverse/domain/ownership audit
4. provisional CP allocation
5. candidate fact/object corpus
6. permanent QL allocation only after exhaustiveness review
7. deterministic English generators/verifiers/distractors
8. large English editorial audit
9. human review sample pack
10. English freeze
11. Hindi/Punjabi semantic localization + parity audit
12. localization freeze
13. standard Question Studio REVIEW_ONLY registration
14. 3-language Studio batch audit
15. human Studio review
16. standard BANK_ONLY normalization/readiness gate
17. later scored-test/publication gates separately

## Current gate

COM-002 remains `DISCOVERY_ONLY` with zero permanent QLs and no runtime registration.
