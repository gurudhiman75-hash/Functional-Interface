import type { Di004MultiStimulus } from "./multi-line-v1";
function esc(v:unknown){return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&apos;");}
const COLORS=["#4c67c8","#3d927f","#c98940"] as const;
export function renderDi004MultiLineSvg(s:Di004MultiStimulus){
  const width=940,height=540,left=90,right=30,top=82,bottom=100,plotW=width-left-right,plotH=height-top-bottom,max=Math.max(...s.points.flatMap(p=>[p.a,p.b,p.c])),step=20,yMax=Math.ceil((max+step)/step)*step;
  const x=(i:number)=>left+plotW*i/(s.points.length-1), y=(v:number)=>top+plotH-(v/yMax)*plotH;
  const parts:string[]=[`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(s.title)}" data-multi-line="true" data-series-count="3"><rect width="100%" height="100%" fill="white"/><title>${esc(s.title)}</title><text x="${width/2}" y="32" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="21" font-weight="700">${esc(s.title)}</text>`];
  for(let v=0;v<=yMax;v+=step){const yy=y(v);parts.push(`<line x1="${left}" y1="${yy}" x2="${width-right}" y2="${yy}" stroke="#e7ebf0"/><text x="${left-12}" y="${yy+4}" text-anchor="end" font-size="11" fill="#667085">${v}</text>`);}
  const keys=["a","b","c"] as const;
  keys.forEach((key,seg)=>{parts.push(`<polyline data-series-index="${seg}" points="${s.points.map((p,i)=>`${x(i)},${y(p[key])}`).join(" ")}" fill="none" stroke="${COLORS[seg]}" stroke-width="2.7"/>`);s.points.forEach((p,i)=>parts.push(`<circle data-series-index="${seg}" data-period-index="${i}" data-value="${p[key]}" cx="${x(i)}" cy="${y(p[key])}" r="4" fill="white" stroke="${COLORS[seg]}" stroke-width="2"/><text x="${x(i)}" y="${y(p[key])-(seg===1?10:seg===2?-18:18)}" text-anchor="middle" font-size="10" font-weight="700" fill="${COLORS[seg]}">${p[key]}</text>`));});
  s.points.forEach((p,i)=>parts.push(`<text x="${x(i)}" y="${top+plotH+28}" text-anchor="middle" font-size="11">${esc(p.period)}</text>`));
  s.seriesLabels.forEach((label,i)=>parts.push(`<line x1="${220+i*190}" y1="498" x2="${250+i*190}" y2="498" stroke="${COLORS[i]}" stroke-width="3"/><text x="${260+i*190}" y="502" font-size="12">${esc(label)}</text>`));
  parts.push(`<text x="24" y="${top+plotH/2}" transform="rotate(-90 24 ${top+plotH/2})" text-anchor="middle" font-size="12" font-weight="600">${esc(s.unit)}</text></svg>`);
  return parts.join("");
}
