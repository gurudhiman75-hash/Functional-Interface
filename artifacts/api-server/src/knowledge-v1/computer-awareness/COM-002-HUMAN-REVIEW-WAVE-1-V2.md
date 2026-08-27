# COM-002 Human Review Wave 1 V2

**Chapter:** COM-002 — Operating Systems, Files & Windows  
**Scope:** 13 permanent QLs · 2 English samples per QL · 26 questions total  
**Generator:** `generateCom002ReviewQuestionV2`  
**Status:** `REVIEW_REQUIRED`  
**Purpose:** Exact product-owner approval artifact. Automated audits do **not** substitute for approval.

Approval, if granted, applies only to this exact 26-question pack and the bound deterministic English corpus. Any material learner-facing change requires a new review/freeze authority.

---

## COM-002-QL-001 — Operating System Role & Function

### Q01 — FUNCTION_TO_ENTITY
Seed: `human-review-wave1:COM-002-QL-001:A`

**Question:** The function “managing CPU resources” is primarily associated with which software?

A. Presentation software  
B. Spreadsheet software  
C. Word processor  
D. Operating system ✅

**Answer:** Operating system  
**Explanation:** An operating system manages CPU resources. Therefore, Operating system is the correct answer.  
**Sources:** IBM-OPERATING-SYSTEMS-2025  
**Facts:** com002-os-manages-cpu

### Q02 — ENTITY_TO_FUNCTION
Seed: `human-review-wave1:COM-002-QL-001:B`

**Question:** Select the activity that belongs to operating-system resource management.

A. Managing hardware and applications by allocating system resources ✅  
B. Composing an email message  
C. Creating presentation slides  
D. Editing a photograph

**Answer:** Managing hardware and applications by allocating system resources  
**Explanation:** Managing hardware and applications by allocating system resources is an operating-system function. The other options are application-level user tasks rather than core OS resource-management functions.  
**Sources:** IBM-OPERATING-SYSTEMS-2025  
**Facts:** com002-os-primary-role

---

## COM-002-QL-002 — Operating System Identity & Classification

### Q03 — OS_TO_LICENSE
Seed: `human-review-wave1:COM-002-QL-002:A`

**Question:** Ubuntu Desktop is best classified as:

A. proprietary operating system  
B. application software  
C. device driver  
D. open-source operating system ✅

**Answer:** open-source operating system  
**Explanation:** Ubuntu Desktop is an open-source operating system.  
**Sources:** UBUNTU-DESKTOP-2026  
**Facts:** com002-ubuntu-open-source

### Q04 — ATTRIBUTE_TO_OS
Seed: `human-review-wave1:COM-002-QL-002:B`

**Question:** Which of the following is a proprietary mobile operating system?

A. iOS ✅  
B. Android  
C. Microsoft Excel  
D. SQL language

**Answer:** iOS  
**Explanation:** iOS is a proprietary mobile operating system.  
**Sources:** IBM-OPERATING-SYSTEMS-2025  
**Facts:** com002-ios-proprietary, com002-android-open-source

---

## COM-002-QL-003 — Operating System Type & Real-Time Behavior

### Q05 — PROPERTY_TO_TYPE
Seed: `human-review-wave1:COM-002-QL-003:A`

**Question:** Identify the OS type described as one that allows multiple users to access the computer system.

A. Single-tasking operating system  
B. Multi-user operating system ✅  
C. Real-time operating system  
D. Single-user operating system

**Answer:** Multi-user operating system  
**Explanation:** Multi-user operating system allows multiple users to access the computer system. Therefore, it matches the property in the question.  
**Sources:** ODISHA-SCTEVT-OS-TYPES-2025, FREERTOS-RTOS-FAQ-2026, FREERTOS-RTOS-FUNDAMENTALS-2026, CBSE-ACADEMICS-OS-TYPES  
**Facts:** com002-multi-user-os-property, com002-rtos-timely-deterministic-response, com002-rtos-time-constraints, com002-single-user-os-property, com002-multitasking-os-property, com002-single-tasking-os-property, com002-time-sharing-os-property

### Q06 — TYPE_TO_PROPERTY
Seed: `human-review-wave1:COM-002-QL-003:B`

**Question:** Which statement best describes a Single-user operating system?

A. reacts to external events within strict time constraints  
B. shares processor time so multiple users or tasks can receive interactive access  
C. supports one user working on the computer at a time ✅  
D. allows more than one program to run during the same period of use

**Answer:** supports one user working on the computer at a time  
**Explanation:** A Single-user operating system supports one user working on the computer at a time.  
**Sources:** CBSE-ACADEMICS-OS-TYPES, FREERTOS-RTOS-FAQ-2026, FREERTOS-RTOS-FUNDAMENTALS-2026, ODISHA-SCTEVT-OS-TYPES-2025  
**Facts:** com002-single-user-os-property, com002-rtos-timely-deterministic-response, com002-rtos-time-constraints, com002-multi-user-os-property, com002-multitasking-os-property, com002-single-tasking-os-property, com002-time-sharing-os-property

---

## COM-002-QL-004 — Kernel Identity & Function

### Q07 — COMPONENT_TO_ROLE
Seed: `human-review-wave1:COM-002-QL-004:A`

**Question:** Which statement correctly describes the kernel?

A. allocates CPU time to processes and coordinates process execution  
B. organizes and retrieves files while managing file-system access  
C. allocates and reallocates memory to processes  
D. provides the core interface between operating-system software and hardware resources ✅

**Answer:** provides the core interface between operating-system software and hardware resources  
**Explanation:** The kernel provides the core interface between operating-system software and hardware resources.  
**Sources:** PSSCIVE-OS-STRUCTURE-2021, IBM-OPERATING-SYSTEMS-2025  
**Facts:** com002-kernel-hardware-interface, com002-shell-interface-role, com002-process-scheduler-role, com002-memory-manager-role, com002-file-system-manager-role

### Q08 — ROLE_TO_COMPONENT
Seed: `human-review-wave1:COM-002-QL-004:B`

**Question:** Which component forms the core of an operating system?

A. Kernel ✅  
B. Shell  
C. Process scheduler  
D. Memory manager

**Answer:** Kernel  
**Explanation:** The kernel is the core component of an operating system.  
**Sources:** FREERTOS-RTOS-FUNDAMENTALS-2026, PSSCIVE-OS-STRUCTURE-2021, IBM-OPERATING-SYSTEMS-2025  
**Facts:** com002-kernel-core, com002-shell-interface-role, com002-process-scheduler-role, com002-memory-manager-role, com002-file-system-manager-role

---

## COM-002-QL-005 — GUI vs CLI Interaction

### Q09 — PROPERTY_TO_INTERFACE
Seed: `human-review-wave1:COM-002-QL-005:A`

**Question:** Identify the interface type that uses graphical controls for user interaction.

A. Basic input/output system (BIOS)  
B. Command-line interface (CLI)  
C. Graphical user interface (GUI) ✅  
D. Application programming interface (API)

**Answer:** Graphical user interface (GUI)  
**Explanation:** Graphical user interface (GUI) uses graphical controls for user interaction.  
**Sources:** IBM-OPERATING-SYSTEMS-2025  
**Facts:** com002-gui-interaction

### Q10 — INTERFACE_TO_PROPERTY
Seed: `human-review-wave1:COM-002-QL-005:B`

**Question:** Which statement correctly describes Command-line interface (CLI)?

A. uses graphical controls for user interaction  
B. manages files and folders in Windows  
C. loads the operating system during startup  
D. accepts text commands typed by the user ✅

**Answer:** accepts text commands typed by the user  
**Explanation:** Command-line interface (CLI) accepts text commands typed by the user.  
**Sources:** IBM-OPERATING-SYSTEMS-2025  
**Facts:** com002-cli-interaction, com002-gui-interaction

---

## COM-002-QL-006 — Booting & Basic System Start/Stop

### Q11 — TERM_TO_PROCESS
Seed: `human-review-wave1:COM-002-QL-006:A`

**Question:** What does “Restart” mean in this Windows/basic-computer context?

A. turns the Windows PC off completely  
B. reboots the Windows PC and starts it again ✅  
C. starts the computer and loads the operating system  
D. saves the current session state and uses less power than sleep until the PC resumes

**Answer:** reboots the Windows PC and starts it again  
**Explanation:** Restart reboots the Windows PC and starts it again.  
**Sources:** MICROSOFT-WINDOWS-RESTART-2026, MICROSOFT-WINDOWS-BOOT-OPTIONS-2026, MICROSOFT-WINDOWS-SHUTDOWN-2026  
**Facts:** com002-restart-reboot, com002-boot-load-os, com002-shutdown-turn-off, com002-sleep-power-state, com002-hibernate-power-state

### Q12 — PROCESS_TO_TERM
Seed: `human-review-wave1:COM-002-QL-006:B`

**Question:** Which system action reboots the Windows PC and starts it again?

A. Sleep  
B. Hibernate  
C. Restart ✅  
D. Booting

**Answer:** Restart  
**Explanation:** Restart reboots the Windows PC and starts it again.  
**Sources:** MICROSOFT-WINDOWS-RESTART-2026, MICROSOFT-WINDOWS-BOOT-OPTIONS-2026, MICROSOFT-WINDOWS-SHUTDOWN-2026  
**Facts:** com002-restart-reboot, com002-boot-load-os, com002-shutdown-turn-off, com002-sleep-power-state, com002-hibernate-power-state

---

## COM-002-QL-007 — Windows Desktop Components & Basic Settings

### Q13 — FUNCTION_TO_COMPONENT
Seed: `human-review-wave1:COM-002-QL-007:A`

**Question:** Which part of the Windows taskbar displays system-status icons and notification-related features?

A. Windows printer settings  
B. Windows mouse settings  
C. Windows taskbar  
D. Taskbar notification area ✅

**Answer:** Taskbar notification area  
**Explanation:** Taskbar notification area shows system-status icons and provides access to notification-related system features.  
**Sources:** MICROSOFT-WINDOWS-TASKBAR-2026, MICROSOFT-WINDOWS-START-2026, NIELIT-CCC-REV4-2023  
**Facts:** com002-notification-area-function, com002-taskbar-function, com002-start-menu-function, com002-settings-display, com002-settings-date-time, com002-settings-mouse, com002-desktop-workspace, com002-settings-printer, com002-settings-programs-features

### Q14 — COMPONENT_TO_FUNCTION
Seed: `human-review-wave1:COM-002-QL-007:B`

**Question:** Which function best matches Windows Start menu?

A. provide access to apps, settings, files and search ✅  
B. change display-related system settings  
C. change mouse-related settings  
D. change system date and time settings

**Answer:** provide access to apps, settings, files and search  
**Explanation:** Windows Start menu provides access to apps, settings, files and search.  
**Sources:** MICROSOFT-WINDOWS-START-2026, MICROSOFT-WINDOWS-TASKBAR-2026, NIELIT-CCC-REV4-2023  
**Facts:** com002-start-menu-function, com002-taskbar-function, com002-settings-display, com002-settings-date-time, com002-settings-mouse, com002-desktop-workspace, com002-notification-area-function, com002-settings-printer, com002-settings-programs-features

---

## COM-002-QL-008 — File Explorer, Files, Folders & Paths

### Q15 — ITEM_TO_DEFINITION
Seed: `human-review-wave1:COM-002-QL-008:A`

**Question:** Which statement correctly describes Folder (directory)?

A. browse and manage files, folders and drives in Windows  
B. can display hidden items when the relevant view option is enabled  
C. container used to organize files and other folders ✅  
D. can display file-name extensions

**Answer:** container used to organize files and other folders  
**Explanation:** A folder (directory) is a container used to organize files and other folders.  
**Sources:** NIELIT-CCC-PLUS-OS, MICROSOFT-FILE-EXPLORER-2026  
**Facts:** com002-folder-purpose, com002-file-explorer-purpose, com002-file-explorer-show-extensions, com002-file-explorer-show-hidden, com002-file-path-purpose, com002-file-concept

### Q16 — DEFINITION_TO_ITEM
Seed: `human-review-wave1:COM-002-QL-008:B`

**Question:** Which file-management item is described as follows: browse and manage files, folders and drives in Windows?

A. File path  
B. File Explorer ✅  
C. Folder (directory)  
D. File

**Answer:** File Explorer  
**Explanation:** File Explorer is used to browse and manage files, folders and drives in Windows.  
**Sources:** MICROSOFT-FILE-EXPLORER-2026, NIELIT-CCC-PLUS-OS  
**Facts:** com002-file-explorer-purpose, com002-file-explorer-show-extensions, com002-file-explorer-show-hidden, com002-folder-purpose, com002-file-path-purpose, com002-file-concept

---

## COM-002-QL-009 — File Extensions & File-Type Recognition

### Q17 — MATCHED_PAIR
Seed: `human-review-wave1:COM-002-QL-009:A`

**Question:** Identify the correctly matched file extension and file type.

A. .tmp — JPEG image file  
B. .pdf — JPEG image file  
C. .jpg — JPEG image file ✅  
D. .png — JPEG image file

**Answer:** .jpg — JPEG image file  
**Explanation:** .jpg is associated with a JPEG image file, so .jpg — JPEG image file is the correctly matched pair.  
**Sources:** MICROSOFT-WINDOWS-FILE-EXTENSIONS-2026  
**Facts:** com002-extension-jpg, com002-extension-tmp, com002-extension-pdf, com002-extension-png

### Q18 — TYPE_TO_EXTENSION
Seed: `human-review-wave1:COM-002-QL-009:B`

**Question:** Which file extension is associated with a temporary file?

A. .txt  
B. .tmp ✅  
C. .exe  
D. .png

**Answer:** .tmp  
**Explanation:** .tmp is associated with a temporary file.  
**Sources:** MICROSOFT-WINDOWS-FILE-EXTENSIONS-2026  
**Facts:** com002-extension-tmp, com002-extension-txt, com002-extension-exe, com002-extension-png

---

## COM-002-QL-010 — File & Folder Operations

### Q19 — EFFECT_TO_ACTION
Seed: `human-review-wave1:COM-002-QL-010:A`

**Question:** Which file/folder operation is used to delete a selected item?

A. Copy  
B. Rename  
C. Move  
D. Delete ✅

**Answer:** Delete  
**Explanation:** Delete removes the selected file or folder rather than relocating it to another folder.  
**Sources:** MICROSOFT-DELETE-FILE-RECYCLE-BIN-2026, NIELIT-CCC-PLUS-OS  
**Facts:** com002-file-operation-delete, com002-file-operation-copy, com002-file-operation-move, com002-file-operation-rename, com002-file-operation-search

### Q20 — ACTION_TO_EFFECT
Seed: `human-review-wave1:COM-002-QL-010:B`

**Question:** What is the effect of the Delete operation?

A. deletes the selected file or folder ✅  
B. changes the item's location rather than leaving the original in place  
C. changes the selected item's name  
D. finds files or folders that match the requested search

**Answer:** deletes the selected file or folder  
**Explanation:** The Delete operation deletes the selected file or folder; it is not the same as moving the item to a different location.  
**Sources:** MICROSOFT-DELETE-FILE-RECYCLE-BIN-2026, NIELIT-CCC-PLUS-OS  
**Facts:** com002-file-operation-delete, com002-file-operation-copy, com002-file-operation-move, com002-file-operation-rename, com002-file-operation-search

---

## COM-002-QL-011 — Windows Delete, Recycle Bin & Recovery Behavior

### Q21 — RECOVERY_ACTION
Seed: `human-review-wave1:COM-002-QL-011:A`

**Question:** What is the purpose of the Restore action for an item in the Windows Recycle Bin?

A. permanently erases the item  
B. renames the item  
C. compresses the item into an archive  
D. recovers a deleted item that is still available in the Recycle Bin ✅

**Answer:** recovers a deleted item that is still available in the Recycle Bin  
**Explanation:** Restore from Recycle Bin recovers a deleted item that is still available in the Recycle Bin.  
**Sources:** NIELIT-CCC-PLUS-OS  
**Facts:** com002-recycle-bin-restore

### Q22 — PERMANENT_DELETE_BEHAVIOR
Seed: `human-review-wave1:COM-002-QL-011:B`

**Question:** What does Shift+Delete do to a selected item in Windows?

A. moves the selected item to the Recycle Bin  
B. deletes the selected item without first moving it to the Recycle Bin ✅  
C. renames the selected item  
D. opens the selected item's properties

**Answer:** deletes the selected item without first moving it to the Recycle Bin  
**Explanation:** Shift+Delete deletes the selected item without first moving it to the Recycle Bin.  
**Sources:** MICROSOFT-WINDOWS-SHORTCUTS-2026  
**Facts:** com002-shift-delete-permanent

---

## COM-002-QL-012 — Windows & File Explorer Keyboard Shortcuts

### Q23 — MATCHED_PAIR
Seed: `human-review-wave1:COM-002-QL-012:A`

**Question:** Which Windows/File Explorer shortcut is correctly matched with its action?

A. Windows key + E — refresh the active File Explorer window  
B. Shift+Delete — refresh the active File Explorer window  
C. F5 — refresh the active File Explorer window ✅  
D. Windows key + D — refresh the active File Explorer window

**Answer:** F5 — refresh the active File Explorer window  
**Explanation:** F5 is used to refresh the active File Explorer window, so F5 — refresh the active File Explorer window is the correctly matched pair.  
**Sources:** MICROSOFT-WINDOWS-SHORTCUTS-2026  
**Facts:** com002-shortcut-f5, com002-shortcut-win-e, com002-shortcut-shift-delete, com002-shortcut-win-d

### Q24 — ACTION_TO_SHORTCUT
Seed: `human-review-wave1:COM-002-QL-012:B`

**Question:** Which shortcut is used to search for a file or folder in File Explorer?

A. Alt+F4  
B. F3 ✅  
C. Shift+Delete  
D. Windows key + D

**Answer:** F3  
**Explanation:** F3 is used to search for a file or folder in File Explorer.  
**Sources:** MICROSOFT-WINDOWS-SHORTCUTS-2026  
**Facts:** com002-shortcut-f3, com002-shortcut-win-e, com002-shortcut-alt-f4, com002-shortcut-f2, com002-shortcut-f5, com002-shortcut-shift-delete, com002-shortcut-win-d, com002-shortcut-alt-tab, com002-shortcut-alt-enter

---

## COM-002-QL-013 — Multi-Statement Evaluation

### Q25 — MULTI_STATEMENT_TRUTH_VECTOR
Seed: `human-review-wave1:COM-002-QL-013:A`

**Question:** Consider the following statements:

I. macOS is classified as mobile operating system.  
II. Time-sharing operating system shares processor time so multiple users or tasks can receive interactive access.  
III. .png is associated with Portable Document Format file.  
IV. F5 is used to refresh the active File Explorer window.

Which of the above statements are correct?

A. III only  
B. II and IV only ✅  
C. I, II, III and IV  
D. IV only

**Answer:** II and IV only  
**Explanation:** I is incorrect. macOS is classified as operating system. II is correct. Time-sharing operating system shares processor time so multiple users or tasks can receive interactive access. III is incorrect. .png is associated with PNG image file. IV is correct. F5 is used to refresh the active File Explorer window. Therefore, II and IV only is correct.  
**Sources:** IBM-OPERATING-SYSTEMS-2025, CBSE-ACADEMICS-OS-TYPES, MICROSOFT-WINDOWS-FILE-EXTENSIONS-2026, MICROSOFT-WINDOWS-SHORTCUTS-2026, NIELIT-CCC-REV4-2023  
**Facts:** com002-macos-classification, com002-time-sharing-os-property, com002-extension-png, com002-shortcut-f5, com002-android-classification, com002-extension-pdf

### Q26 — MULTI_STATEMENT_TRUTH_VECTOR
Seed: `human-review-wave1:COM-002-QL-013:B`

**Question:** Consider the following statements:

I. Linux is classified as operating system.  
II. Real-time operating system provides timely and deterministic response to events.  
III. .bat is associated with PNG image file.  
IV. Alt+Tab is used to switch between open applications.

Which of the above statements are correct?

A. I, II and IV only ✅  
B. I and II only  
C. I and IV only  
D. II and III only

**Answer:** I, II and IV only  
**Explanation:** I is correct. Linux is classified as operating system. II is correct. Real-time operating system provides timely and deterministic response to events. III is incorrect. .bat is associated with Windows batch file. IV is correct. Alt+Tab is used to switch between open applications. Therefore, I, II and IV only is correct.  
**Sources:** IBM-OPERATING-SYSTEMS-2025, FREERTOS-RTOS-FAQ-2026, MICROSOFT-WINDOWS-FILE-EXTENSIONS-2026, MICROSOFT-WINDOWS-SHORTCUTS-2026  
**Facts:** com002-linux-classification, com002-rtos-timely-deterministic-response, com002-extension-bat, com002-shortcut-alt-tab, com002-extension-png

---

## Approval Gate

Current status: **REVIEW_REQUIRED**.

An explicit product-owner approval must reference this exact V2 pack. Until that happens:

- operational English freeze: **blocked**
- Hindi/Punjabi localization freeze promotion: **blocked**
- Question Studio registration: **blocked**
- review persistence: **blocked**
- Question Bank writes: **blocked**
- test/mock/public release: **blocked**
