import { assertKnowledgeQuestionValid } from "../question-validation";
import { generateCom002ReviewQuestionV4 } from "./com002-review-synthesis-v4";
import type { Com002ReviewQuestion } from "./com002-review-types";
import {
  COM002_APPROVED_SIMPLIFIED_REVIEW_V5,
  COM002_V5_APPROVED_REVIEW_SEEDS,
} from "./com002-approved-simplified-review-v5";

export { COM002_V5_APPROVED_REVIEW_SEEDS };

export const COM002_ENGLISH_GENERATOR_VERSION_V5 =
  "COM-002-ENGLISH-GENERATOR-V5-SIMPLIFIED-APPROVED-1" as const;

function simplifyOptions(question: Com002ReviewQuestion): Com002ReviewQuestion {
  const replacements = new Map<string, string>([
    ["Managing hardware and applications by allocating system resources", "Managing hardware and applications by sharing system resources"],
    ["Editing a photograph", "Editing a photo"],
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
    ["turns the Windows PC off completely", "turns the PC off completely"],
    ["reboots the Windows PC and starts it again", "restarts the PC and starts Windows again"],
    ["saves the current session state and uses less power than sleep until the PC resumes", "saves the current session and uses less power than Sleep"],
    ["provide access to apps, settings, files and search", "open apps, settings, files, and search"],
    ["change display-related system settings", "change display settings"],
    ["change mouse-related settings", "change mouse settings"],
    ["change system date and time settings", "change date and time settings"],
    ["browse and manage files, folders and drives in Windows", "browse and manage files, folders, and drives in Windows"],
    ["can display hidden items when the relevant view option is enabled", "can show hidden items"],
    ["container used to organize files and other folders", "a place used to organize files and other folders"],
    ["can display file-name extensions", "can show file-name extensions"],
    ["changes the item's location rather than leaving the original in place", "moves the item to another location"],
    ["changes the selected item's name", "changes the item's name"],
    ["finds files or folders that match the requested search", "finds matching files or folders"],
    ["recovers a deleted item that is still available in the Recycle Bin", "brings the deleted item back"],
    ["moves the selected item to the Recycle Bin", "moves the item to the Recycle Bin"],
    ["deletes the selected item without first moving it to the Recycle Bin", "deletes the item without first sending it to the Recycle Bin"],
    ["renames the selected item", "renames the item"],
    ["opens the selected item's properties", "opens the item's properties"],
    ["refresh the active File Explorer window", "Refresh File Explorer"],
  ]);

  const options = question.options.map((option) => replacements.get(option) ?? option);
  if (new Set(options).size !== 4) return question;
  return { ...question, options, canonicalAnswer: options[question.correctIndex]! };
}

function simplifyLearnerFacingText(question: Com002ReviewQuestion): Com002ReviewQuestion {
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
    .replace(/^Select the activity that belongs to operating-system resource management\.$/i, "Which of these is a job of an operating system?")
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
      .replace(/^The function “(.+)” is primarily associated with which software\?$/i, "Which software is mainly responsible for $1?")
      .replace(/^Which type of system software is responsible for (.+)\?$/i, "Which software is responsible for $1?");
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
    if (question.surfaceMode === "COMPONENT_TO_ROLE") {
      stem = question.targetFactId === "com002-kernel-core"
        ? "Which statement correctly describes the kernel in an operating system?"
        : "What is the main role of the kernel in an operating system?";
    }
    if (question.surfaceMode === "CORE_COMPONENT") stem = "Which part forms the core of an operating system?";
    if (question.surfaceMode === "ROLE_TO_COMPONENT" && /core of an operating system/i.test(stem)) {
      stem = "Which part forms the core of an operating system?";
    }
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
      .replace(/^Which file-management item is described as follows: (.+)\?$/i, "Which file-management item matches this description: $1?");
  }

  if (question.qlId === "COM-002-QL-009") {
    stem = stem
      .replace(/^Which file extension is associated with a temporary file\?$/i, "Which extension is commonly used for a temporary file?")
      .replace(/^A temporary file commonly uses which file extension\?$/i, "Which extension is commonly used for a temporary file?")
      .replace(/^Identify the extension associated with a temporary file\.$/i, "Which extension is commonly used for a temporary file?");
  }

  const explanation = question.explanation
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

function applyApprovedOverride(question: Com002ReviewQuestion, seed: string): Com002ReviewQuestion {
  const approved = COM002_APPROVED_SIMPLIFIED_REVIEW_V5[seed];
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
  question = simplifyLearnerFacingText(question);
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
  return Array.from(
    { length: 13 },
    (_, index) => `COM-002-QL-${String(index + 1).padStart(3, "0")}`,
  );
}
