import { useEffect } from "react";

type RunnerDialogConfig = {
  key: string;
  title: string;
  cancelLabel: string;
};

type ActiveRunnerDialog = {
  panel: HTMLElement;
  overlay: HTMLElement;
  cancelButton: HTMLButtonElement;
  trigger: HTMLElement | null;
  inertedSiblings: HTMLElement[];
};

const DIALOGS: RunnerDialogConfig[] = [
  { key: "pause", title: "Pause & Exit?", cancelLabel: "Continue Test" },
  { key: "section-switch", title: "Move to Next Section?", cancelLabel: "Stay Here" },
  { key: "submit", title: "Submit this attempt?", cancelLabel: "Continue test" },
];

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "a[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function visibleFocusableElements(panel: HTMLElement): HTMLElement[] {
  return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((element) => {
    const style = window.getComputedStyle(element);
    return style.visibility !== "hidden" && style.display !== "none" && element.getClientRects().length > 0;
  });
}

function findRunnerDialog(): { config: RunnerDialogConfig; panel: HTMLElement; overlay: HTMLElement; cancelButton: HTMLButtonElement } | null {
  if (!window.location.pathname.startsWith("/test/")) return null;

  for (const config of DIALOGS) {
    const heading = Array.from(document.querySelectorAll<HTMLElement>("h1,h2,h3,h4,h5,h6"))
      .find((element) => element.textContent?.trim() === config.title);
    if (!heading) continue;

    const overlay = heading.closest<HTMLElement>("div.fixed.inset-0");
    const panel = heading.closest<HTMLElement>("div.w-full");
    if (!overlay || !panel) continue;

    const cancelButton = Array.from(panel.querySelectorAll<HTMLButtonElement>("button"))
      .find((button) => button.textContent?.trim() === config.cancelLabel);
    if (!cancelButton) continue;

    const titleId = `runner-dialog-${config.key}-title`;
    heading.id = titleId;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-labelledby", titleId);
    panel.setAttribute("data-runner-dialog", config.key);
    panel.tabIndex = -1;

    const description = heading.parentElement?.querySelector<HTMLElement>("p");
    if (description) {
      const descriptionId = `runner-dialog-${config.key}-description`;
      description.id = descriptionId;
      panel.setAttribute("aria-describedby", descriptionId);
    }

    return { config, panel, overlay, cancelButton };
  }

  return null;
}

export function RunnerDialogAccessibility() {
  useEffect(() => {
    let activeDialog: ActiveRunnerDialog | null = null;
    let focusFrame = 0;

    const restoreDialog = () => {
      if (!activeDialog) return;
      const previous = activeDialog;
      activeDialog = null;
      previous.inertedSiblings.forEach((element) => element.removeAttribute("inert"));
      if (previous.trigger?.isConnected) {
        window.requestAnimationFrame(() => previous.trigger?.focus({ preventScroll: true }));
      }
    };

    const activateDialog = () => {
      if (activeDialog?.panel.isConnected) return;
      if (activeDialog && !activeDialog.panel.isConnected) restoreDialog();

      const found = findRunnerDialog();
      if (!found) return;

      const currentFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const trigger = currentFocus && !found.overlay.contains(currentFocus) && currentFocus !== document.body
        ? currentFocus
        : null;
      const inertedSiblings: HTMLElement[] = [];
      const markInert = (element: HTMLElement) => {
        if (element.hasAttribute("inert") || inertedSiblings.includes(element)) return;
        element.setAttribute("inert", "");
        inertedSiblings.push(element);
      };

      const overlayParent = found.overlay.parentElement;
      if (overlayParent) {
        Array.from(overlayParent.children).forEach((child) => {
          if (child instanceof HTMLElement && child !== found.overlay) markInert(child);
        });
      }

      // The app root also owns global controls such as Exit fullscreen beside
      // the routed application tree. Keep those controls out of the accessibility
      // and keyboard order while a runner dialog is modal.
      const root = document.getElementById("root");
      if (root) {
        Array.from(root.children).forEach((child) => {
          if (child instanceof HTMLElement && !child.contains(found.overlay)) markInert(child);
        });
      }

      Array.from(document.body.children).forEach((child) => {
        if (child instanceof HTMLElement && !child.contains(found.overlay) && child.id !== "root") markInert(child);
      });

      activeDialog = {
        panel: found.panel,
        overlay: found.overlay,
        cancelButton: found.cancelButton,
        trigger,
        inertedSiblings,
      };

      window.cancelAnimationFrame(focusFrame);
      focusFrame = window.requestAnimationFrame(() => {
        if (activeDialog?.panel.isConnected) activeDialog.cancelButton.focus({ preventScroll: true });
      });
    };

    const syncDialog = () => {
      if (activeDialog && !activeDialog.panel.isConnected) restoreDialog();
      activateDialog();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const active = activeDialog;
      if (!active?.panel.isConnected) return;

      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        active.cancelButton.click();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = visibleFocusableElements(active.panel);
      if (focusable.length === 0) {
        event.preventDefault();
        active.panel.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      const current = document.activeElement;
      if (event.shiftKey && (current === first || !active.panel.contains(current))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (current === last || !active.panel.contains(current))) {
        event.preventDefault();
        first.focus();
      }
    };

    const observer = new MutationObserver(syncDialog);
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("keydown", onKeyDown, true);
    syncDialog();

    return () => {
      observer.disconnect();
      document.removeEventListener("keydown", onKeyDown, true);
      window.cancelAnimationFrame(focusFrame);
      if (activeDialog) {
        activeDialog.inertedSiblings.forEach((element) => element.removeAttribute("inert"));
      }
      activeDialog = null;
    };
  }, []);

  return null;
}
