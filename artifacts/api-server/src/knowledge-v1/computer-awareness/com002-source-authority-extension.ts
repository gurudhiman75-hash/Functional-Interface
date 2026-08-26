import type { Com002SourceAuthority } from "./com002-source-manifest";

/**
 * Additional first-party truth authorities discovered after the initial scope
 * and PYQ manifest. Kept separate so task-evidence and canonical-fact authority
 * remain distinguishable during corpus construction.
 */
export const COM002_SOURCE_AUTHORITY_EXTENSION: Com002SourceAuthority[] = [
  {
    sourceId: "IBM-OPERATING-SYSTEMS-2025",
    title: "IBM — What is an Operating System?",
    url: "https://www.ibm.com/think/topics/operating-systems",
    authorityClass: "VENDOR_TECHNICAL",
    supports: [
      "os-function",
      "hardware-resource-management",
      "application-resource-management",
      "gui-cli-awareness",
      "operating-system-examples",
      "os-type-classification",
      "embedded-os",
      "distributed-os",
      "real-time-os",
      "network-os",
      "cluster-os",
    ],
    verifiedOn: "2026-08-26",
    notes: [
      "Defines an OS as software managing hardware/applications by allocating CPU, memory, I/O and file-storage resources.",
      "Explicitly distinguishes graphical and command-line user interfaces without implying an OS must expose only one interface type.",
      "Also provides current awareness-level definitions for embedded, distributed, real-time, network and cluster operating systems.",
    ],
  },
  {
    sourceId: "FREERTOS-RTOS-FUNDAMENTALS-2026",
    title: "FreeRTOS — RTOS Fundamentals",
    url: "https://www.freertos.org/Documentation/01-FreeRTOS-quick-start/01-Beginners-guide/01-RTOS-fundamentals",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["real-time-os-property", "kernel-core", "deterministic-time-response"],
    verifiedOn: "2026-08-25",
    notes: [
      "Defines RTOSes as designed for deterministic behavior and strict time-constrained reactions in embedded systems.",
      "Also explicitly states that the kernel is the core component within an operating system.",
    ],
  },
  {
    sourceId: "FREERTOS-RTOS-FAQ-2026",
    title: "FreeRTOS — What is a Real Time Operating System?",
    url: "https://www.freertos.org/Why-FreeRTOS/FAQs/What-is-this-all-about/",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["real-time-os-property", "timely-deterministic-response"],
    verifiedOn: "2026-08-25",
    notes: [
      "Supports the awareness-level property that an RTOS is optimized for timely and deterministic event response.",
    ],
  },
  {
    sourceId: "MICROSOFT-WINDOWS-TASKBAR-2026",
    title: "Microsoft Support — Customize the Taskbar in Windows",
    url: "https://support.microsoft.com/en-us/windows/experience/personalization/customize-the-taskbar-in-windows",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["windows-ui-component", "taskbar-function", "start-menu-access"],
    verifiedOn: "2026-08-25",
    notes: [
      "Supports durable taskbar functions: launch/pin apps, switch open windows, and access system features such as notifications/search/Start.",
      "Avoid freezing alignment/layout details that can change across Windows versions.",
    ],
  },
  {
    sourceId: "MICROSOFT-WINDOWS-START-2026",
    title: "Microsoft Support — Customize the Windows Start Menu",
    url: "https://support.microsoft.com/en-US/Windows/Experience/Personalization/customize-the-windows-start-menu",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["windows-ui-component", "start-menu-function"],
    verifiedOn: "2026-08-25",
    notes: [
      "Supports the durable function that Start provides access to apps, settings, files and search.",
      "Do not canonicalize version-specific section/layout names unless the Windows version is explicit.",
    ],
  },
  {
    sourceId: "MICROSOFT-DELETE-FILE-RECYCLE-BIN-2026",
    title: "Microsoft Support — Delete a file",
    url: "https://support.microsoft.com/en-us/office/collab-files/delete-a-file",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["delete-recovery-behavior", "local-hard-disk-recycle-bin", "nonlocal-delete-caveat"],
    verifiedOn: "2026-08-25",
    notes: [
      "Explicitly states that deleting a file from a hard-disk location moves it to Recycle Bin.",
      "Also supplies the critical caveat that disk/CD/network locations can behave differently; generation must define ordinary local Windows context when needed.",
    ],
  },
  {
    sourceId: "MICROSOFT-WINDOWS-BOOT-OPTIONS-2026",
    title: "Microsoft Learn — Boot options in Windows",
    url: "https://learn.microsoft.com/en-us/windows-hardware/drivers/devtest/boot-options-in-windows",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["system-start-stop", "boot-load-operating-system"],
    verifiedOn: "2026-08-25",
    notes: [
      "Supports the Windows startup abstraction that Boot Manager starts the system and an OS loader loads the selected operating system.",
      "Detailed BCD/driver-development content remains outside awareness-level COM-002 questions.",
    ],
  },
  {
    sourceId: "MICROSOFT-WINDOWS-SHUTDOWN-2026",
    title: "Microsoft Support — Shut down, sleep, or hibernate your PC",
    url: "https://support.microsoft.com/en-US/Windows/Experience/Power-Battery/shut-down-sleep-or-hibernate-your-pc",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["system-start-stop", "shutdown-action", "sleep-action", "hibernate-action"],
    verifiedOn: "2026-08-26",
    notes: [
      "Use only the durable awareness-level distinction that Shut down turns the PC off completely; avoid version-specific menu paths.",
    ],
  },
  {
    sourceId: "MICROSOFT-WINDOWS-RESTART-2026",
    title: "Microsoft Support — Restart (reboot) your PC",
    url: "https://support.microsoft.com/en-gb/windows/restart-reboot-your-pc-110262aa-fc79-1c33-7b00-c140ae3a6dac",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["system-start-stop", "restart-action", "reboot-action"],
    verifiedOn: "2026-08-26",
    notes: [
      "Use for the durable awareness-level Restart/Reboot action; do not freeze menu coordinates as canonical knowledge.",
    ],
  },
];

export function auditCom002SourceAuthorityExtension() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const urls = new Set<string>();
  for (const source of COM002_SOURCE_AUTHORITY_EXTENSION) {
    if (ids.has(source.sourceId)) issues.push(`DUPLICATE_SOURCE_ID:${source.sourceId}`);
    ids.add(source.sourceId);
    if (urls.has(source.url)) issues.push(`DUPLICATE_URL:${source.url}`);
    urls.add(source.url);
    if (source.authorityClass !== "VENDOR_TECHNICAL") {
      issues.push(`UNEXPECTED_AUTHORITY_CLASS:${source.sourceId}:${source.authorityClass}`);
    }
    if (source.supports.length === 0) issues.push(`NO_SUPPORT_SCOPE:${source.sourceId}`);
    if (!source.url.startsWith("https://")) issues.push(`NON_HTTPS_SOURCE:${source.sourceId}`);
  }
  return {
    valid: issues.length === 0,
    sourceCount: COM002_SOURCE_AUTHORITY_EXTENSION.length,
    supportScopes: [...new Set(COM002_SOURCE_AUTHORITY_EXTENSION.flatMap((source) => source.supports))].sort(),
    issues,
  };
}
