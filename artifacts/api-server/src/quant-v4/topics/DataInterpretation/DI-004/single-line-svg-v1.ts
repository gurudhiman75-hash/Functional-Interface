import type { Di004SingleStimulus } from "./single-line-v1";
function esc(v:unknown){return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&apos;");}
export function renderDi004SingleLineSvg(stimulus:Di004SingleStimulus){
  const width=900,height=500,left=80,right=30,top=70,bottom=90,plotW=width-left-right,plotH=height-top-bottom;
  const max=Math.max(...stimulus.points.map(p=>p.value)),step=20,yMax=Math.ceil((max+step)/step)*step;
  const x=(i:number)=>left+plotW*i/(stimulus.points.length-1),y=(v:number)=>top+plotH-(v/yMax)*plotH;
  const parts:string[]=[`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(stimulus.title)}" data-single-series-line="true"><rect width="100%" height="100%" fill="white"/><title>${esc(stimulus.title)}</title><text x="${width/2}" y="30" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="21" font-weight="700">${esc(stimulus.title)}</text>`];
  for(let v=0;v<=yMax;v+=step){const yy=y(v);parts.push(`<line x1="${left}" y1="${yy}" x2="${width-right}" y2="${yy}" stroke="#e7ebf0"/><text x="${left-12}" y="${yy+4}" text-anchor="end" font-size="11" fill="#667085">${v}</text>`);}
  const pts=stimulus.points.map((p,i)=>`${x(i)},${y(p.value)}`).join(" ");
  parts.push(`<polyline data-single-line="true" points="${pts}" fill="none" stroke="#4c67c8" stroke-width="3"/>`);
  stimulus.points.forEach((p,i)=>parts.push(`<circle data-single-line-point="${i}" data-value="${p.value}" cx="${x(i)}" cy="${y(p.value)}" r="4.5" fill="white" stroke="#4c67c8" stroke-width="2"/><text x="${x(i)}" y="${y(p.value)-10}" text-anchor="middle" font-size="11" font-weight="700">${p.value}</text><text x="${x(i)}" y="${top+plotH+27}" text-anchor="middle" font-size="11">${esc(p.period)}</text>`));
  parts.push(`<text x="22" y="${top+plotH/2}" transform="rotate(-90 22 ${top+plotH/2})" text-anchor="middle" font-size="12" font-weight="600">${esc(stimulus.seriesLabel)} (${esc(stimulus.unit)})</text></svg>`);
  return parts.join("");
}
