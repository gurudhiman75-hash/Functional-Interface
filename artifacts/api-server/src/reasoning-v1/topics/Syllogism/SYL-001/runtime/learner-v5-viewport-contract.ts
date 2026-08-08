export const SYL_V5_VIEWPORT_WIDTHS = [360, 412, 768] as const;

export const SYL_V5_VIEWPORT_CSS = `
* { box-sizing: border-box; }
html { color-scheme: light; }
body {
  margin: 0;
  padding: 16px;
  background: #f4f6f8;
  color: #17202a;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
.toolbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding: 12px;
  margin: 0 auto 16px;
  max-width: 980px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #dce2e8;
  border-radius: 12px;
}
button, select {
  min-height: 40px;
  padding: 8px 12px;
  border: 1px solid #aeb8c2;
  border-radius: 8px;
  background: #fff;
  font: inherit;
}
button[aria-pressed="true"] { font-weight: 700; border-color: #17202a; }
.device-shell { overflow-x: auto; padding: 4px 0 24px; }
.device {
  width: var(--device-width, 360px);
  max-width: 100%;
  min-width: 0;
  margin: 0 auto;
}
.question-card {
  min-width: 0;
  margin: 0 0 18px;
  padding: clamp(14px, 4vw, 22px);
  background: #fff;
  border: 1px solid #dce2e8;
  border-radius: 14px;
  box-shadow: 0 4px 18px rgba(23, 32, 42, 0.06);
  overflow: hidden;
}
.meta { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
.badge { padding: 3px 7px; border-radius: 999px; background: #eef2f5; font-size: 12px; }
.direction { padding: 10px; border-left: 4px solid #7b8794; background: #f8fafb; }
.stem, .option, .reason, .answer, .diagram-caption {
  min-width: 0;
  overflow-wrap: anywhere;
  word-break: normal;
  white-space: pre-line;
}
.options { display: grid; gap: 9px; margin: 14px 0; padding: 0; list-style: none; }
.option { display: grid; grid-template-columns: 28px minmax(0, 1fr); gap: 8px; padding: 10px; border: 1px solid #dce2e8; border-radius: 10px; }
.option-key { font-weight: 700; }
.answer { margin-top: 12px; padding: 10px; background: #edf8f0; border-radius: 10px; font-weight: 700; }
details { margin-top: 12px; }
summary { min-height: 40px; cursor: pointer; font-weight: 700; }
.reason-list { display: grid; gap: 8px; padding-left: 20px; }
.diagram { margin-top: 14px; padding: 10px; border: 1px solid #dce2e8; border-radius: 10px; overflow: hidden; }
.diagram svg { display: block; width: 100%; max-width: 340px; height: auto; margin: 0 auto; }
[hidden] { display: none !important; }
@media (max-width: 420px) {
  body { padding: 8px; }
  .toolbar { border-radius: 8px; }
  .question-card { border-radius: 10px; }
}
`;
