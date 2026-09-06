export type Com002ApprovedSimplifiedReviewV5 = Readonly<{
  stem: string;
  options: readonly [string, string, string, string];
  answer: string;
  explanation: string;
}>;

const ROWS = [
  ["human-review-wave1:COM-002-QL-001:A","Which software manages CPU resources?",["Presentation software","Spreadsheet software","Word processor","Operating system"],"Operating system","The operating system manages CPU resources, so Operating system is the correct answer."],
  ["human-review-wave1:COM-002-QL-001:B","Which of these is a job of an operating system?",["Managing hardware and applications by sharing system resources","Writing an email","Creating presentation slides","Editing a photo"],"Managing hardware and applications by sharing system resources","An operating system manages hardware, applications, and system resources. The other options are tasks done in application software."],
  ["human-review-wave1:COM-002-QL-002:A","Ubuntu Desktop is which type of software?",["Proprietary operating system","Application software","Device driver","Open-source operating system"],"Open-source operating system","Ubuntu Desktop is an open-source operating system."],
  ["human-review-wave1:COM-002-QL-002:B","Which of these is a proprietary mobile operating system?",["iOS","Android","Microsoft Excel","SQL language"],"iOS","iOS is a proprietary mobile operating system."],
  ["human-review-wave1:COM-002-QL-003:A","Which type of operating system allows many users to use the computer system?",["Single-tasking operating system","Multi-user operating system","Real-time operating system","Single-user operating system"],"Multi-user operating system","A multi-user operating system allows more than one user to access the computer system."],
  ["human-review-wave1:COM-002-QL-003:B","What is a single-user operating system?",["It responds to events within strict time limits","It shares processor time among many users or tasks","It supports one user at a time","It allows many programs to run during the same period"],"It supports one user at a time","A single-user operating system is designed for one user to work on the computer at a time."],
  ["human-review-wave1:COM-002-QL-004:A","What is the main role of the kernel in an operating system?",["It gives CPU time to processes","It manages files and file-system access","It gives memory to processes","It connects operating-system software with hardware resources"],"It connects operating-system software with hardware resources","The kernel is the main link between operating-system software and hardware resources."],
  ["human-review-wave1:COM-002-QL-004:B","Which part forms the core of an operating system?",["Kernel","Shell","Process scheduler","Memory manager"],"Kernel","The kernel is the core part of an operating system."],
  ["human-review-wave1:COM-002-QL-005:A","Which interface uses buttons, icons, windows, and other graphical controls?",["Basic input/output system (BIOS)","Command-line interface (CLI)","Graphical user interface (GUI)","Application programming interface (API)"],"Graphical user interface (GUI)","A graphical user interface (GUI) lets users interact with graphical controls such as icons, buttons, and windows."],
  ["human-review-wave1:COM-002-QL-005:B","How does a command-line interface (CLI) work?",["It uses graphical controls","It manages files and folders in Windows","It loads the operating system at startup","It accepts text commands typed by the user"],"It accepts text commands typed by the user","A command-line interface (CLI) works by accepting text commands typed by the user."],
  ["human-review-wave1:COM-002-QL-006:A","What does Restart do in Windows?",["Turns the PC off completely","Restarts the PC and starts Windows again","Starts the computer and loads the operating system","Saves the current session and uses less power than Sleep"],"Restarts the PC and starts Windows again","Restart shuts down and starts the Windows PC again."],
  ["human-review-wave1:COM-002-QL-006:B","Which action restarts a Windows PC and starts it again?",["Sleep","Hibernate","Restart","Booting"],"Restart","Restart reboots the Windows PC and starts it again."],
  ["human-review-wave1:COM-002-QL-007:A","Which part of the Windows taskbar shows system icons and notifications?",["Printer settings","Mouse settings","Windows taskbar","Notification area"],"Notification area","The notification area on the taskbar shows system-status icons and notification-related features."],
  ["human-review-wave1:COM-002-QL-007:B","What is the main use of the Windows Start menu?",["Open apps, settings, files, and search","Change display settings","Change mouse settings","Change date and time settings"],"Open apps, settings, files, and search","The Windows Start menu gives access to apps, settings, files, and search."],
  ["human-review-wave1:COM-002-QL-008:A","What is a folder (directory)?",["A tool to browse files, folders, and drives in Windows","A feature that can show hidden items","A place used to organize files and other folders","A feature that can show file-name extensions"],"A place used to organize files and other folders","A folder is used to organize files and other folders."],
  ["human-review-wave1:COM-002-QL-008:B","Which Windows tool is used to browse and manage files, folders, and drives?",["File path","File Explorer","Folder (directory)","File"],"File Explorer","File Explorer is used to browse and manage files, folders, and drives in Windows."],
  ["human-review-wave1:COM-002-QL-009:A","Which file extension is matched with the correct file type?",[".tmp — JPEG image file",".pdf — JPEG image file",".jpg — JPEG image file",".png — JPEG image file"],".jpg — JPEG image file",".jpg is used for JPEG image files."],
  ["human-review-wave1:COM-002-QL-009:B","Which extension is commonly used for a temporary file?",[".txt",".tmp",".exe",".png"],".tmp",".tmp is commonly used for temporary files."],
  ["human-review-wave1:COM-002-QL-010:A","Which operation deletes a selected file or folder?",["Copy","Rename","Move","Delete"],"Delete","Delete removes the selected file or folder."],
  ["human-review-wave1:COM-002-QL-010:B","What does the Delete operation do?",["Deletes the selected file or folder","Moves the item to another location","Changes the item's name","Finds matching files or folders"],"Deletes the selected file or folder","Delete removes the selected file or folder."],
  ["human-review-wave1:COM-002-QL-011:A","What does Restore do to an item in the Recycle Bin?",["Permanently deletes it","Renames it","Compresses it into an archive","Brings the deleted item back"],"Brings the deleted item back","Restore brings back a deleted item that is still in the Recycle Bin."],
  ["human-review-wave1:COM-002-QL-011:B","What does Shift+Delete do in Windows?",["Moves the item to the Recycle Bin","Deletes the item without first sending it to the Recycle Bin","Renames the item","Opens the item's properties"],"Deletes the item without first sending it to the Recycle Bin","Shift+Delete deletes the selected item without first moving it to the Recycle Bin."],
  ["human-review-wave1:COM-002-QL-012:A","Which shortcut is matched with the correct action?",["Windows key + E — Refresh File Explorer","Shift+Delete — Refresh File Explorer","F5 — Refresh File Explorer","Windows key + D — Refresh File Explorer"],"F5 — Refresh File Explorer","F5 refreshes the active File Explorer window."],
  ["human-review-wave1:COM-002-QL-012:B","Which shortcut is used to search for a file or folder in File Explorer?",["Alt+F4","F3","Shift+Delete","Windows key + D"],"F3","F3 is used to search for a file or folder in File Explorer."],
  ["human-review-wave1:COM-002-QL-013:A","Consider these statements:\nI. iOS is a proprietary mobile operating system.\nII. Rename creates a copy and leaves the original item unchanged.\nIII. .exe is a JPEG image file extension.\nIV. Windows key + D shows or hides the desktop.\nWhich statements are correct?",["I and IV only","III and IV only","I and II only","I and III only"],"I and IV only","I is correct. II is wrong because Rename only changes the item's name. III is wrong because .exe is used for executable program files. IV is correct. Therefore, I and IV only are correct."],
  ["human-review-wave1:COM-002-QL-013:B","Consider these statements:\nI. Linux is a proprietary operating system.\nII. Rename changes the selected item's name.\nIII. .png is a JPEG image file extension.\nIV. F5 refreshes the active File Explorer window.\nWhich statements are correct?",["III only","II, III and IV only","I, III and IV only","II and IV only"],"II and IV only","I is wrong because Linux is open-source. II is correct. III is wrong because .png is used for PNG image files. IV is correct. Therefore, II and IV only are correct."],
] as const;

export const COM002_APPROVED_SIMPLIFIED_REVIEW_V5: Readonly<Record<string, Com002ApprovedSimplifiedReviewV5>> =
  Object.freeze(
    Object.fromEntries(
      ROWS.map(([seed, stem, options, answer, explanation]) => [
        seed,
        { stem, options, answer, explanation },
      ]),
    ),
  );

export const COM002_V5_APPROVED_REVIEW_SEEDS = Object.freeze(
  ROWS.map(([seed]) => seed),
);

export const COM002_V5_APPROVED_BROWSER_PACK_FINGERPRINT =
  "afbfa579bb22ca0e8a7663bf58c16bef4fc33aab7fec957d04b6082bc00d1ef7" as const;
