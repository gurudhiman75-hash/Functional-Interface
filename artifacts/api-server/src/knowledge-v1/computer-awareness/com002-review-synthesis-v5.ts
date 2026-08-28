import { assertKnowledgeQuestionValid } from "../question-validation";
import { generateCom002ReviewQuestionV4 } from "./com002-review-synthesis-v4";
import type { Com002ReviewQuestion } from "./com002-review-types";

export const COM002_ENGLISH_GENERATOR_VERSION_V5 =
  "COM-002-ENGLISH-GENERATOR-V5-SIMPLIFIED-APPROVED-1" as const;

function simplifyPhrase(text: string) {
  const exact = new Map<string, string>([
    ["Managing hardware and applications by allocating system resources", "Managing hardware and applications by sharing system resources"],
    ["Creating presentation slides", "Creating presentation slides"],
    ["Editing a photograph", "Editing a photo"],
    ["Writing a spreadsheet formula", "Writing a spreadsheet formula"],
    ["Composing an email message", "Writing an email"],
    ["reacts to external events within strict time constraints", "responds to events within strict time limits"],
    ["shares processor time so multiple users or tasks can receive interactive access", "shares processor time among many users or tasks"],
    ["supports one user working on the computer at a time", "supports one user at a time"],
    ["allows more than one program to run during the same period of use", "allows many programs to run during the same period"],
    ["allocates CPU time to processes and coordinates process execution", "gives CPU time to processes"],
    ["organizes and retrieves files while managing file-system access", "manages files and file-system access"],
    ["allocates and reallocates memory to processes", "gives memory to processes"],
    ["provides the core interface between operating-system software and hardware resources", "connects operating-system software with hardware resources"],
    ["uses graphical controls for user interaction", "uses buttons, icons, windows, and other graphical controls"],
    ["accepts text commands typed by the user", "accepts text commands typed by the user"],
    ["turns the Windows PC off completely", "turns the PC off completely"],
    ["reboots the Windows PC and starts it again", "restarts the PC and starts Windows again"],
    ["starts the computer and loads the operating system", "starts the computer and loads the operating system"],
    ["saves the current session state and uses less power than sleep until the PC resumes", "saves the current session and uses less power than Sleep"],
    ["provide access to apps, settings, files and search", "open apps, settings, files, and search"],
    ["change display-related system settings", "change display settings"],
    ["change mouse-related settings", "change mouse settings"],
    ["change system date and time settings", "change date and time settings"],
    ["browse and manage files, folders and drives in Windows", "browse and manage files, folders, and drives in Windows"],
    ["can display hidden items when the relevant view option is enabled", "can show hidden items"],
    ["container used to organize files and other folders", "a place used to organize files and other folders"],
    ["can display file-name extensions", "can show file-name extensions"],
    ["deletes the selected file or folder", "deletes the selected file or folder"],
    ["changes the item's location rather than leaving the original in place", "moves the item to another location"],
    ["changes the selected item's name", "changes the item's name"],
    ["finds files or folders that match the requested search", "finds matching files or folders"],
    ["recovers a deleted item that is still available in the Recycle Bin", "brings the deleted item back"],
    ["moves the selected item to the Recycle Bin", "moves the item to the Recycle Bin"],
    ["deletes the selected item without first moving it to the Recycle Bin", "deletes the item without first sending it to the Recycle Bin"],
    ["renames the selected item", "renames the item"],
    ["opens the selected item's properties", "opens the item's properties"],
    ["refresh the active File Explorer window", "Refresh File Explorer"],
    ["show or hide the desktop", "show or hide the desktop"],
  ]);
  return exact.get(text) ?? text;
}

function simplifyOptions(question: Com002ReviewQuestion): Com002ReviewQuestion {
  const options = question.options.map(simplifyPhrase);
  const canonicalAnswer = options[question.correctIndex]!;
  if (new Set(options).size !== 4) return question;
  return { ...question, options, canonicalAnswer };
}

function simplifyGenericText(question: Com002ReviewQuestion): Com002ReviewQuestion {
  let stem = question.stem
    .replace(/^Identify the operating system from the options\.$/i, "Which of these is an operating system?")
    .replace(/^Which option belongs to the operating-system category\?$/i, "Which of these is an operating system?")
    .replace(/^Which of the following is an operating system\?$/i, "Which of these is an operating system?")
    .replace(/^([^?]+) is best classified as:$/i, "$1 is which type of software?")
    .replace(/^Which of the following is /i, "Which of these is ")
    .replace(/^Which statement best describes a (.+)\?$/i, "What is a $1?")
    .replace(/^Which statement correctly describes (.+)\?$/i, "How does $1 work?")
    .replace(/^Identify the interface type that (.+)\.$/i, "Which interface $1?")
    .replace(/^Which user-interface type is described by the following property: it (.+)\?$/i, "Which interface $1?")
    .replace(/^An interface that (.+) is best classified as:$/i, "Which interface $1?")
    .replace(/^Which file extension and file-type pair is correctly matched\?$/i, "Which file extension is matched with the correct file type?")
    .replace(/^Identify the correctly matched file extension and file type\.$/i, "Which file extension is matched with the correct file type?")
    .replace(/^Which option correctly pairs a file extension with its file type\?$/i, "Which file extension is matched with the correct file type?")
    .replace(/^Which file\/folder operation is used to delete a selected item\?$/i, "Which operation deletes a selected file or folder?")
    .replace(/^What is the effect of the Delete operation\?$/i, "What does the Delete operation do?")
    .replace(/^What is the purpose of the Restore action for an item in the Windows Recycle Bin\?$/i, "What does Restore do to an item in the Recycle Bin?")
    .replace(/^Which Windows\/File Explorer shortcut is correctly matched with its action\?$/i, "Which shortcut is matched with the correct action?")
    .replace(/^Consider the following statements:/i, "Consider these statements:")
    .replace(/Which of the above statements are correct\?$/i, "Which statements are correct?");

  if (question.surfaceMode === "FUNCTION_TO_ENTITY") {
    stem = stem
      .replace(/^The function “managing (.+)” is primarily associated with which software\?$/i, "Which software manages $1?")
      .replace(/^Which type of system software is responsible for managing (.+)\?$/i, "Which software manages $1?")
      .replace(/^Which software performs the following core system function: managing (.+)\?$/i, "Which software manages $1?")
      .replace(/^Which type of system software is responsible for (.+)\?$/i, "Which software is responsible for $1?")
      .replace(/^Which software performs the following core system function: (.+)\?$/i, "Which software performs this function: $1?")
      .replace(/^The function “(.+)” is primarily associated with which software\?$/i, "Which software is mainly responsible for $1?");
  }

  if (question.surfaceMode === "ENTITY_TO_FUNCTION" && question.qlId === "COM-002-QL-001") {
    stem = "Which of these is a job of an operating system?";
  }

  if (question.qlId === "COM-002-QL-003" && question.surfaceMode === "PROPERTY_TO_TYPE") {
    stem = stem
      .replace(/^Identify the OS type described as one that (.+)\.$/i, "Which type of operating system $1?")
      .replace(/^The property “(.+)” best describes which operating-system type\?$/i, "Which type of operating system $1?");
  }

  if (question.qlId === "COM-002-QL-004") {
    if (question.surfaceMode === "COMPONENT_TO_ROLE") stem = "What is the main role of the kernel in an operating system?";
    if (question.surfaceMode === "CORE_COMPONENT") stem = "Which part forms the core of an operating system?";
    if (question.surfaceMode === "ROLE_TO_COMPONENT" && /core of an operating system/i.test(stem)) stem = "Which part forms the core of an operating system?";
  }

  if (question.qlId === "COM-002-QL-006") {
    stem = stem
      .replace(/^What does “([^”]+)” mean in this Windows\/basic-computer context\?$/i, "What does $1 do in Windows?")
      .replace(/^Which system action (.+)\?$/i, "Which action $1?");
  }

  if (question.qlId === "COM-002-QL-007") {
    stem = stem
      .replace(/^Which part of the Windows taskbar displays system-status icons and notification-related features\?$/i, "Which part of the Windows taskbar shows system icons and notifications?")
      .replace(/^Which function best matches Windows Start menu\?$/i, "What is the main use of the Windows Start menu?")
      .replace(/^Which Windows component or settings area is used to (.+)\?$/i, "Which Windows setting is used to $1?");
  }

  if (question.qlId === "COM-002-QL-008") {
    stem = stem
      .replace(/^Which statement correctly describes Folder \(directory\)\?$/i, "What is a folder (directory)?")
      .replace(/^Which file-management item is described as follows: browse and manage files, folders and drives in Windows\?$/i, "Which Windows tool is used to browse and manage files, folders, and drives?")
      .replace(/^Which statement correctly describes (.+)\?$/i, "What is $1?")
      .replace(/^Which file-management item is described as follows: (.+)\?$/i, "Which file-management item matches this description: $1?");
  }

  if (question.qlId === "COM-002-QL-009") {
    stem = stem
      .replace(/^Which file extension is associated with a temporary file\?$/i, "Which extension is commonly used for a temporary file?")
      .replace(/^A temporary file commonly uses which file extension\?$/i, "Which extension is commonly used for a temporary file?")
      .replace(/^Identify the extension associated with a temporary file\.$/i, "Which extension is commonly used for a temporary file?");
  }

  let explanation = question.explanation
    .replace(/Therefore, Operating system is the correct answer\./g, "So Operating system is the correct answer.")
    .replace(/application-level user tasks rather than core OS resource-management functions\./g, "tasks done in application software.")
    .replace(/^The kernel provides the core interface between operating-system software and hardware resources\.$/i, "The kernel is the main link between operating-system software and hardware resources.")
    .replace(/^Graphical user interface \(GUI\) uses graphical controls for user interaction\.$/i, "A graphical user interface (GUI) lets users interact with graphical controls such as icons, buttons, and windows.")
    .replace(/^Command-line interface \(CLI\) accepts text commands typed by the user\.$/i, "A command-line interface (CLI) works by accepting text commands typed by the user.")
    .replace(/^Restart reboots the Windows PC and starts it again\.$/i, "Restart shuts down and starts the Windows PC again.")
    .replace(/^Windows Start menu provides access to apps, settings, files and search\.$/i, "The Windows Start menu gives access to apps, settings, files, and search.")
    .replace(/^A folder \(directory\) is a container used to organize files and other folders\.$/i, "A folder is used to organize files and other folders.")
    .replace(/^Delete removes the selected file or folder rather than relocating it to another folder\.$/i, "Delete removes the selected file or folder.")
    .replace(/^The Delete operation deletes the selected file or folder; it is not the same as moving the item to a different location\.$/i, "Delete removes the selected file or folder.")
    .replace(/^Restore from Recycle Bin recovers a deleted item that is still available in the Recycle Bin\.$/i, "Restore brings back a deleted item that is still in the Recycle Bin.")
    .replace(/^(.+) is associated with a (.+), so (.+) is the correctly matched pair\.$/i, "$1 is used for $2.")
    .replace(/^(.+) is associated with a (.+)\.$/i, "$1 is commonly used for $2.");

  return { ...question, stem, explanation };
}

type ApprovedOverride = Readonly<{
  stem: string;
  options: readonly [string, string, string, string];
  answer: string;
  explanation: string;
}>;

const APPROVED_SIMPLIFIED_REVIEW_OVERRIDES: Readonly<Record<string, ApprovedOverride>> = Object.freeze({
  "human-review-wave1:COM-002-QL-001:A": { stem: "Which software manages CPU resources?", options: ["Presentation software","Spreadsheet software","Word processor","Operating system"], answer: "Operating system", explanation: "The operating system manages CPU resources, so Operating system is the correct answer." },
  "human-review-wave1:COM-002-QL-001:B": { stem: "Which of these is a job of an operating system?", options: ["Managing hardware and applications by sharing system resources","Writing an email","Creating presentation slides","Editing a photo"], answer: "Managing hardware and applications by sharing system resources", explanation: "An operating system manages hardware, applications, and system resources. The other options are tasks done in application software." },
  "human-review-wave1:COM-002-QL-002:A": { stem: "Ubuntu Desktop is which type of software?", options: ["proprietary operating system","application software","device driver","open-source operating system"], answer: "open-source operating system", explanation: "Ubuntu Desktop is an open-source operating system." },
  "human-review-wave1:COM-002-QL-002:B": { stem: "Which of these is a proprietary mobile operating system?", options: ["iOS","Android","Microsoft Excel","SQL language"], answer: "iOS", explanation: "iOS is a proprietary mobile operating system." },
  "human-review-wave1:COM-002-QL-003:A": { stem: "Which type of operating system allows many users to use the computer system?", options: ["Single-tasking operating system","Multi-user operating system","Real-time operating system","Single-user operating system"], answer: "Multi-user operating system", explanation: "A multi-user operating system allows more than one user to access the computer system." },
  "human-review-wave1:COM-002-QL-003:B": { stem: "What is a single-user operating system?", options: ["It responds to events within strict time limits","It shares processor time among many users or tasks","It supports one user at a time","It allows many programs to run during the same period"], answer: "It supports one user at a time", explanation: "A single-user operating system is designed for one user to work on the computer at a time." },
  "human-review-wave1:COM-002-QL-004:A": { stem: "What is the main role of the kernel in an operating system?", options: ["It gives CPU time to processes","It manages files and file-system access","It gives memory to processes","It connects operating-system software with hardware resources"], answer: "It connects operating-system software with hardware resources", explanation: "The kernel is the main link between operating-system software and hardware resources." },
  "human-review-wave1:COM-002-QL-004:B": { stem: "Which part forms the core of an operating system?", options: ["Kernel","Shell","Process scheduler","Memory manager"], answer: "Kernel", explanation: "The kernel is the core part of an operating system." },
  "human-review-wave1:COM-002-QL-005:A": { stem: "Which interface uses buttons, icons, windows, and other graphical controls?", options: ["Basic input/output system (BIOS)","Command-line interface (CLI)","Graphical user interface (GUI)","Application programming interface (API)"], answer: "Graphical user interface (GUI)", explanation: "A graphical user interface (GUI) lets users interact with graphical controls such as icons, buttons, and windows." },
  "human-review-wave1:COM-002-QL-005:B": { stem: "How does a command-line interface (CLI) work?", options: ["It uses graphical controls","It manages files and folders in Windows","It loads the operating system at startup","It accepts text commands typed by the user"], answer: "It accepts text commands typed by the user", explanation: "A command-line interface (CLI) works by accepting text commands typed by the user." },
  "human-review-wave1:COM-002-QL-006:A": { stem: "What does Restart do in Windows?", options: ["Turns the PC off completely","Restarts the PC and starts Windows again","Starts the computer and loads the operating system","Saves the current session and uses less power than Sleep"], answer: "Restarts the PC and starts Windows again", explanation: "Restart shuts down and starts the Windows PC again." },
  "human-review-wave1:COM-002-QL-006:B": { stem: "Which action restarts a Windows PC and starts it again?", options: ["Sleep","Hibernate","Restart","Booting"], answer: "Restart", explanation: "Restart reboots the Windows PC and starts it again." },
  "human-review-wave1:COM-002-QL-007:A": { stem: "Which part of the Windows taskbar shows system icons and notifications?", options: ["Windows printer settings","Windows mouse settings","Windows taskbar","Taskbar notification area"], answer: "Taskbar notification area", explanation: "The notification area on the taskbar shows system-status icons and notification-related features." },
  "human-review-wave1:COM-002-QL-007:B": { stem: "What is the main use of the Windows Start menu?", options: ["open apps, settings, files, and search","change display settings","change mouse settings","change date and time settings"], answer: "open apps, settings, files, and search", explanation: "The Windows Start menu gives access to apps, settings, files, and search." },
  "human-review-wave1:COM-002-QL-008:A": { stem: "What is a folder (directory)?", options: ["A tool to browse files, folders, and drives in Windows","A feature that can show hidden items","A place used to organize files and other folders","A feature that can show file-name extensions"], answer: "A place used to organize files and other folders", explanation: "A folder is used to organize files and other folders." },
  "human-review-wave1:COM-002-QL-008:B": { stem: "Which Windows tool is used to browse and manage files, folders, and drives?", options: ["File path","File Explorer","Folder (directory)","File"], answer: "File Explorer", explanation: "File Explorer is used to browse and manage files, folders, and drives in Windows." },
  "human-review-wave1:COM-002-QL-009:A": { stem: "Which file extension is matched with the correct file type?", options: [".tmp — JPEG image file",".pdf — JPEG image file",".jpg — JPEG image file",".png — JPEG image file"], answer: ".jpg — JPEG image file", explanation: ".jpg is used for JPEG image files." },
  "human-review-wave1:COM-002-QL-009:B": { stem: "Which extension is commonly used for a temporary file?", options: [".txt",".tmp",".exe",".png"], answer: ".tmp", explanation: ".tmp is commonly used for temporary files." },
  "human-review-wave1:COM-002-QL-010:A": { stem: "Which operation deletes a selected file or folder?", options: ["Copy","Rename","Move","Delete"], answer: "Delete", explanation: "Delete removes the selected file or folder." },
  "human-review-wave1:COM-002-QL-010:B": { stem: "What does the Delete operation do?", options: ["Deletes the selected file or folder","Moves the item to another location","Changes the item's name","Finds matching files or folders"], answer: "Deletes the selected file or folder", explanation: "Delete removes the selected file or folder." },
  "human-review-wave1:COM-002-QL-011:A": { stem: "What does Restore do to an item in the Recycle Bin?", options: ["Permanently deletes it","Renames it","Compresses it into an archive","Brings the deleted item back"], answer: "Brings the deleted item back", explanation: "Restore brings back a deleted item that is still in the Recycle Bin." },
  "human-review-wave1:COM-002-QL-011:B": { stem: "What does Shift+Delete do in Windows?", options: ["Moves the item to the Recycle Bin","Deletes the item without first sending it to the Recycle Bin","Renames the item","Opens the item's properties"], answer: "Deletes the item without first sending it to the Recycle Bin", explanation: "Shift+Delete deletes the selected item without first moving it to the Recycle Bin." },
  "human-review-wave1:COM-002-QL-012:A": { stem: "Which shortcut is matched with the correct action?", options: ["Windows key + E — Refresh File Explorer","Shift+Delete — Refresh File Explorer","F5 — Refresh File Explorer","Windows key + D — Refresh File Explorer"], answer: "F5 — Refresh File Explorer", explanation: "F5 refreshes the active File Explorer window." },
  "human-review-wave1:COM-002-QL-012:B": { stem: "Which shortcut is used to search for a file or folder in File Explorer?", options: ["Alt+F4","F3","Shift+Delete","Windows key + D"], answer: "F3", explanation: "F3 is used to search for a file or folder in File Explorer." },
  "human-review-wave1:COM-002-QL-013:A": { stem: "Consider these statements:\nI. iOS is a proprietary mobile operating system.\nII. Rename creates a copy and leaves the original item unchanged.\nIII. .exe is a JPEG image file extension.\nIV. Windows key + D shows or hides the desktop.\nWhich statements are correct?", options: ["I and IV only","III and IV only","I and II only","I and III only"], answer: "I and IV only", explanation: "I is correct. II is wrong because Rename only changes the item's name. III is wrong because .exe is used for executable program files. IV is correct. Therefore, I and IV only are correct." },
  "human-review-wave1:COM-002-QL-013:B": { stem: "Consider these statements:\nI. Linux is a proprietary operating system.\nII. Rename changes the selected item's name.\nIII. .png is a JPEG image file extension.\nIV. F5 refreshes the active File Explorer window.\nWhich statements are correct?", options: ["III only","II, III and IV only","I, III and IV only","II and IV only"], answer: "II and IV only", explanation: "I is wrong because Linux is open-source. II is correct. III is wrong because .png is used for PNG image files. IV is correct. Therefore, II and IV only are correct." },
});

export const COM002_V5_APPROVED_REVIEW_SEEDS = Object.freeze(Object.keys(APPROVED_SIMPLIFIED_REVIEW_OVERRIDES));

function applyApprovedOverride(question: Com002ReviewQuestion, seed: string): Com002ReviewQuestion {
  const approved = APPROVED_SIMPLIFIED_REVIEW_OVERRIDES[seed];
  if (!approved) return question;
  const options = [...approved.options];
  const correctIndex = options.indexOf(approved.answer);
  if (correctIndex < 0) throw new Error(`${seed}: approved answer missing from options`);
  return {
    ...question,
    stem: approved.stem,
    options,
    correctIndex,
    canonicalAnswer: approved.answer,
    explanation: approved.explanation,
  };
}

export function generateCom002ReviewQuestionV5(input: { qlId: string; seed: string }): Com002ReviewQuestion {
  const v4 = generateCom002ReviewQuestionV4(input);
  let question = simplifyOptions(v4);
  question = simplifyGenericText(question);
  question = applyApprovedOverride(question, input.seed);

  assertKnowledgeQuestionValid({
    stem: question.stem,
    explanation: question.explanation,
    options: question.options,
    correctIndex: question.correctIndex,
    canonicalAnswer: question.canonicalAnswer,
  });

  return {
    ...question,
    questionId: question.questionId.replace(/-V4$/, "-V5"),
  };
}

export function listCom002ReviewV5QlIds() {
  return Array.from({ length: 13 }, (_, index) => `COM-002-QL-${String(index + 1).padStart(3, "0")}`);
}
