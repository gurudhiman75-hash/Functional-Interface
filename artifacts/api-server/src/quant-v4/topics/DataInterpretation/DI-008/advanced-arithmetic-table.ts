import type { Di008AdvancedStimulus } from "./advanced-arithmetic-types";

function esc(value: unknown) {
  return String(value)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#39;");
}
export function renderDi008AdvancedTableHtml(stimulus:Di008AdvancedStimulus){
  const headerC=stimulus.columnC?`<th>${esc(stimulus.columnC)}</th>`:"";
  const rows=stimulus.rows.map(row=>`<tr><td>${esc(row.label)}</td><td>${row.a}</td><td>${row.b}</td>${stimulus.columnC?`<td>${row.c}</td>`:""}</tr>`).join("");
  return `<div class="di008-advanced"><h3>${esc(stimulus.title)}</h3><p>${esc(stimulus.instruction)}</p><table><thead><tr><th>Case</th><th>${esc(stimulus.columnA)}</th><th>${esc(stimulus.columnB)}</th>${headerC}</tr></thead><tbody>${rows}</tbody></table><p><strong>Use:</strong> ${esc(stimulus.note)}</p></div>`;
}
