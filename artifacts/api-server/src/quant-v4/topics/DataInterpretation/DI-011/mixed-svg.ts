import type { Di011Stimulus } from "./types";

function esc(value: unknown) {
  return String(value).replace(/[&<>"]/g, (ch) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[ch]!));
}
function tablePanel(stimulus: Di011Stimulus, side:"left"|"right", x:number, y:number, w:number, h:number) {
  const title=side==="left"?stimulus.leftTitle:stimulus.rightTitle;
  const unit=side==="left"?stimulus.leftUnit:stimulus.rightUnit;
  const rows=stimulus.rows;
  const rowH=30;
  const lines=[`<text x="${x+10}" y="${y+22}" font-size="16" font-weight="700">${esc(title)} (${esc(unit)})</text>`,
    `<rect x="${x}" y="${y+34}" width="${w}" height="${Math.min(h-34,rowH*(rows.length+1))}" fill="white" stroke="#777"/>`,
    `<text x="${x+12}" y="${y+56}" font-size="13" font-weight="700">Category</text>`,
    `<text x="${x+w-70}" y="${y+56}" font-size="13" font-weight="700">Value</text>`];
  rows.forEach((r,i)=>{ const yy=y+34+rowH*(i+1); lines.push(`<line x1="${x}" y1="${yy}" x2="${x+w}" y2="${yy}" stroke="#ddd"/>`); lines.push(`<text x="${x+12}" y="${yy+21}" font-size="13">${esc(r.category)}</text>`); lines.push(`<text x="${x+w-70}" y="${yy+21}" font-size="13" data-${side}-value="${side==="left"?r.left:r.right}">${side==="left"?r.left:r.right}</text>`); });
  return lines.join("");
}
function barPanel(stimulus:Di011Stimulus, side:"left"|"right", x:number,y:number,w:number,h:number){
  const vals=stimulus.rows.map(r=>side==="left"?r.left:r.right); const max=Math.max(...vals)*1.15; const bw=w/(vals.length*1.7);
  const title=side==="left"?stimulus.leftTitle:stimulus.rightTitle; const unit=side==="left"?stimulus.leftUnit:stimulus.rightUnit;
  let out=`<text x="${x+10}" y="${y+22}" font-size="16" font-weight="700">${esc(title)} (${esc(unit)})</text><line x1="${x+35}" y1="${y+h-35}" x2="${x+w-10}" y2="${y+h-35}" stroke="#555"/>`;
  vals.forEach((v,i)=>{const bh=(h-80)*v/max; const bx=x+50+i*(w-70)/vals.length; const by=y+h-35-bh; out+=`<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="#d8d8d8" stroke="#666"/><text x="${bx+bw/2}" y="${by-5}" text-anchor="middle" font-size="12" data-${side}-value="${v}">${v}</text><text x="${bx+bw/2}" y="${y+h-17}" text-anchor="middle" font-size="11">${esc(stimulus.rows[i]!.category)}</text>`;}); return out;
}
function linePanel(stimulus:Di011Stimulus, side:"left"|"right", x:number,y:number,w:number,h:number){
  const vals=stimulus.rows.map(r=>side==="left"?r.left:r.right); const max=Math.max(...vals)*1.15; const pts=vals.map((v,i)=>{const px=x+45+i*(w-70)/(vals.length-1);const py=y+h-40-(h-85)*v/max;return [px,py,v] as const;});
  const title=side==="left"?stimulus.leftTitle:stimulus.rightTitle; const unit=side==="left"?stimulus.leftUnit:stimulus.rightUnit;
  let out=`<text x="${x+10}" y="${y+22}" font-size="16" font-weight="700">${esc(title)} (${esc(unit)})</text><polyline points="${pts.map(p=>p[0]+","+p[1]).join(" ")}" fill="none" stroke="#666" stroke-width="2"/>`;
  pts.forEach((p,i)=>{out+=`<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="white" stroke="#555"/><text x="${p[0]}" y="${p[1]-8}" text-anchor="middle" font-size="12" data-${side}-value="${p[2]}">${p[2]}</text><text x="${p[0]}" y="${y+h-18}" text-anchor="middle" font-size="11">${esc(stimulus.rows[i]!.category)}</text>`;}); return out;
}
function piePanel(stimulus:Di011Stimulus,x:number,y:number,w:number,h:number){
  const cx=x+w/2, cy=y+h/2+8, r=Math.min(w,h)*0.28; let a=-Math.PI/2; let out=`<text x="${x+10}" y="${y+22}" font-size="16" font-weight="700">${esc(stimulus.leftTitle)} (${esc(stimulus.leftUnit)})</text>`;
  stimulus.rows.forEach((row,i)=>{const frac=row.left/100, b=a+frac*Math.PI*2; const x1=cx+r*Math.cos(a),y1=cy+r*Math.sin(a),x2=cx+r*Math.cos(b),y2=cy+r*Math.sin(b); const large=frac>0.5?1:0; const mid=(a+b)/2; out+=`<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z" fill="white" stroke="#666"/><text x="${cx+(r+24)*Math.cos(mid)}" y="${cy+(r+24)*Math.sin(mid)}" text-anchor="middle" font-size="11">${esc(row.category)} ${row.left}%</text><text x="${cx}" y="${cy}" visibility="hidden" data-left-value="${row.left}">${row.left}</text>`; a=b;}); return out;
}
function panel(stimulus:Di011Stimulus, which:"left"|"right", x:number,y:number,w:number,h:number){
  const pair=stimulus.pairKind;
  if(which==="left" && pair==="PIE_TABLE") return piePanel(stimulus,x,y,w,h);
  if((which==="left" && (pair==="BAR_TABLE"||pair==="BAR_LINE")) || (which==="right"&&pair==="BAR_LINE")) return barPanel(stimulus,which,x,y,w,h);
  if((which==="left" && pair==="LINE_TABLE") || (which==="right"&&pair==="BAR_LINE")) return linePanel(stimulus,which,x,y,w,h);
  return tablePanel(stimulus,which,x,y,w,h);
}
export function renderDi011MixedSvg(stimulus:Di011Stimulus){
  const width=980,height=430,gap=20,pw=(width-gap-40)/2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(stimulus.title)}"><rect width="100%" height="100%" fill="white"/><text x="20" y="26" font-size="18" font-weight="700">${esc(stimulus.title)}</text><text x="20" y="48" font-size="13">${esc(stimulus.instruction)}</text><g transform="translate(0,55)">${panel(stimulus,"left",20,0,pw,350)}</g><g transform="translate(0,55)">${panel(stimulus,"right",20+pw+gap,0,pw,350)}</g></svg>`;
}
