import type { Di012Stimulus } from "./types";

function esc(value: unknown) {
  return String(value).replace(/[&<>"]/g, (ch) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[ch]!));
}
export function renderDi012TableHtml(stimulus: Di012Stimulus) {
  const rows = stimulus.rows.map((row) =>
    `<tr><td>${esc(row.label)}</td><td data-col-a="${esc(row.a)}">${esc(row.a)}</td><td data-col-b="${esc(row.b)}">${esc(row.b)}</td></tr>`
  ).join("");
  return `<div class="di012-stimulus" data-model-kind="${esc(stimulus.modelKind)}"><h3>${esc(stimulus.title)}</h3><p>${esc(stimulus.instruction)}</p><table><thead><tr><th>Category</th><th>${esc(stimulus.columnA)}</th><th>${esc(stimulus.columnB)}</th></tr></thead><tbody>${rows}</tbody></table><p><strong>Additional information:</strong> ${esc(stimulus.condition)}</p></div>`;
}
