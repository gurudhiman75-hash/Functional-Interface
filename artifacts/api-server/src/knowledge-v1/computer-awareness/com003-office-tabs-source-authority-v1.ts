export type Com003OfficeTabsSourceAuthority = {
  sourceId: string;
  product: "Office" | "Excel" | "PowerPoint";
  title: string;
  url: string;
  verifiedOn: "2026-09-09";
};

/**
 * Microsoft Support sources used for the Excel and PowerPoint Ribbon/tab
 * completion pack. The pack is intentionally limited to durable desktop
 * commands that are useful in Static GK examinations.
 */
export const COM003_OFFICE_TABS_SOURCE_AUTHORITIES: readonly Com003OfficeTabsSourceAuthority[] = Object.freeze([
  { sourceId: "MICROSOFT-OFFICE-RIBBON-2026", product: "Office", title: "Show or hide the Ribbon in Office", url: "https://support.microsoft.com/en-us/office/foundations-experiences/show-or-hide-the-ribbon-in-office", verifiedOn: "2026-09-09" },
  { sourceId: "MICROSOFT-OFFICE-CUSTOMIZE-RIBBON-2026", product: "Office", title: "Customize the Ribbon in Office", url: "https://support.microsoft.com/en-us/office/foundations-experiences/customize-the-ribbon-in-office", verifiedOn: "2026-09-09" },
  { sourceId: "MICROSOFT-OFFICE-QUICK-ACCESS-TOOLBAR-2026", product: "Office", title: "Customize the Quick Access Toolbar", url: "https://support.microsoft.com/en-us/office/customize-the-quick-access-toolbar", verifiedOn: "2026-09-09" },
  { sourceId: "MICROSOFT-EXCEL-OVERVIEW-2026", product: "Excel", title: "What is Excel?", url: "https://support.microsoft.com/en-us/excel/get-started/what-is-excel", verifiedOn: "2026-09-09" },
  { sourceId: "MICROSOFT-EXCEL-BASIC-TASKS-2026", product: "Excel", title: "Basic tasks in Excel", url: "https://support.microsoft.com/en-us/excel/basic-tasks-in-excel", verifiedOn: "2026-09-09" },
  { sourceId: "MICROSOFT-EXCEL-CHARTS-2026", product: "Excel", title: "Create a chart from start to finish", url: "https://support.microsoft.com/en-us/excel/get-started/create-a-chart-from-start-to-finish", verifiedOn: "2026-09-09" },
  { sourceId: "MICROSOFT-EXCEL-RECOMMENDED-CHARTS-2026", product: "Excel", title: "Create a chart with Recommended Charts", url: "https://support.microsoft.com/en-us/excel/create-a-chart-with-recommended-charts", verifiedOn: "2026-09-09" },
  { sourceId: "MICROSOFT-EXCEL-PIVOTTABLE-2026", product: "Excel", title: "Create a PivotTable to analyze worksheet data", url: "https://support.microsoft.com/en-us/excel/get-started/create-a-pivottable-to-analyze-worksheet-data", verifiedOn: "2026-09-09" },
  { sourceId: "MICROSOFT-EXCEL-DATA-VALIDATION-2026", product: "Excel", title: "Apply data validation to cells", url: "https://support.microsoft.com/en-us/excel/get-started/apply-data-validation-to-cells", verifiedOn: "2026-09-09" },
  { sourceId: "MICROSOFT-EXCEL-DROP-DOWN-2026", product: "Excel", title: "Create a drop-down list", url: "https://support.microsoft.com/en-us/excel/get-started/create-a-drop-down-list", verifiedOn: "2026-09-09" },
  { sourceId: "MICROSOFT-EXCEL-FREEZE-PANES-2026", product: "Excel", title: "Freeze panes to lock rows and columns", url: "https://support.microsoft.com/en-us/excel/get-started/freeze-panes-to-lock-rows-and-columns", verifiedOn: "2026-09-09" },
  { sourceId: "MICROSOFT-EXCEL-HIDE-ROWS-COLUMNS-2026", product: "Excel", title: "Hide or show rows or columns", url: "https://support.microsoft.com/en-us/excel/get-started/hide-or-show-rows-or-columns", verifiedOn: "2026-09-09" },
  { sourceId: "MICROSOFT-EXCEL-VIEW-MULTIPLE-2026", product: "Excel", title: "View multiple panes, sheets or workbooks", url: "https://support.microsoft.com/en-us/excel/view-multiple-panes-sheets-or-workbooks", verifiedOn: "2026-09-09" },
  { sourceId: "MICROSOFT-EXCEL-PROTECT-SHEET-2026", product: "Excel", title: "Lock or unlock specific areas of a protected worksheet", url: "https://support.microsoft.com/en-us/excel/get-started/lock-or-unlock-specific-areas-of-a-protected-worksheet", verifiedOn: "2026-09-09" },
  { sourceId: "MICROSOFT-POWERPOINT-HELP-2026", product: "PowerPoint", title: "PowerPoint help and learning", url: "https://support.microsoft.com/en-us/powerpoint/powerpoint-help", verifiedOn: "2026-09-09" },
  { sourceId: "MICROSOFT-POWERPOINT-LAYOUT-2026", product: "PowerPoint", title: "Apply a slide layout", url: "https://support.microsoft.com/en-us/powerpoint/training/apply-a-slide-layout", verifiedOn: "2026-09-09" },
  { sourceId: "MICROSOFT-POWERPOINT-SLIDE-MASTER-2026", product: "PowerPoint", title: "What is a slide master in PowerPoint?", url: "https://support.microsoft.com/en-us/powerpoint/training/what-is-a-slide-master-in-powerpoint", verifiedOn: "2026-09-09" },
  { sourceId: "MICROSOFT-POWERPOINT-CUSTOMIZE-MASTER-2026", product: "PowerPoint", title: "Customize a slide master", url: "https://support.microsoft.com/en-us/powerpoint/training/customize-a-slide-master", verifiedOn: "2026-09-09" },
  { sourceId: "MICROSOFT-POWERPOINT-TRANSITIONS-2026", product: "PowerPoint", title: "Add, change or remove transitions between slides", url: "https://support.microsoft.com/en-us/powerpoint/training/add-change-or-remove-transitions-between-slides", verifiedOn: "2026-09-09" },
  { sourceId: "MICROSOFT-POWERPOINT-PRESENTER-VIEW-2026", product: "PowerPoint", title: "Start the presentation and see your notes in Presenter view", url: "https://support.microsoft.com/en-us/powerpoint/training/start-the-presentation-and-see-your-notes-in-presenter-view", verifiedOn: "2026-09-09" },
  { sourceId: "MICROSOFT-POWERPOINT-AUDIO-2026", product: "PowerPoint", title: "Add or delete audio in your presentation", url: "https://support.microsoft.com/en-us/powerpoint/training/add-or-delete-audio-in-your-powerpoint-presentation", verifiedOn: "2026-09-09" },
  { sourceId: "MICROSOFT-POWERPOINT-PLATFORM-COMPARISON-2026", product: "PowerPoint", title: "Compare PowerPoint features on different platforms", url: "https://support.microsoft.com/en-us/powerpoint/compare-powerpoint-features-on-different-platforms", verifiedOn: "2026-09-09" },
  { sourceId: "MICROSOFT-POWERPOINT-ANIMATION-2026", product: "PowerPoint", title: "PowerPoint animation and visual effects help", url: "https://support.microsoft.com/en-us/powerpoint/powerpoint-help", verifiedOn: "2026-09-09" },
] as const);

export function auditCom003OfficeTabsSources() {
  const issues: string[] = [];
  const ids = COM003_OFFICE_TABS_SOURCE_AUTHORITIES.map((source) => source.sourceId);
  if (new Set(ids).size !== ids.length) issues.push("DUPLICATE_SOURCE_ID");
  for (const source of COM003_OFFICE_TABS_SOURCE_AUTHORITIES) {
    if (!source.url.startsWith("https://support.microsoft.com/")) issues.push(`NON_MICROSOFT_SOURCE:${source.sourceId}`);
    if (!source.title.trim()) issues.push(`EMPTY_TITLE:${source.sourceId}`);
  }
  return { valid: issues.length === 0, sourceCount: COM003_OFFICE_TABS_SOURCE_AUTHORITIES.length, issues };
}

export const COM003_OFFICE_TABS_SOURCE_AUDIT_V1 = auditCom003OfficeTabsSources();
if (!COM003_OFFICE_TABS_SOURCE_AUDIT_V1.valid) {
  throw new Error(`COM-003 Office tabs source audit failed: ${COM003_OFFICE_TABS_SOURCE_AUDIT_V1.issues.join(", ")}`);
}
