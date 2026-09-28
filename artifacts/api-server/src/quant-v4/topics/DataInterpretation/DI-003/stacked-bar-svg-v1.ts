import type { Di003StackedStimulus } from "./stacked-bar-v1";
function esc(v:unknown){return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&apos;");}
const COLORS=["#6c8cf5","#62c6b0","#f2b66d"] as const;
export function renderDi003StackedBarSvg(s:Di003StackedStimulus){
  const width=940,height=540,left=90,right=30,top=78,bottom=100,plotW=width-left-right,plotH=height-top-bottom;
  const totals=s.points.map(p=>p.a+p.b+p.c),max=Math.max(...totals),step=100,yMax=Math.ceil((max+step)/step)*step,group=plotW/s.points.length,barW=Math.min(74,group*.46);
  const parts:string[]=[`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(s.title)}" data-stacked-bar="true"><rect width="100%" height="100%" fill="white"/><title>${esc(s.title)}</title><text x="${width/2}" y="32" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="21" font-weight="700">${esc(s.title)}</text>`];
  for(let v=0;v<=yMax;v+=step){const y=top+plotH-(v/yMax)*plotH;parts.push(`<line x1="${left}" y1="${y}" x2="${width-right}" y2="${y}" stroke="#e7ebf0"/><text x="${left-12}" y="${y+4}" text-anchor="end" font-size="11" fill="#667085">${v}</text>`);}
  s.points.forEach((p,i)=>{const x=left+group*(i+.5)-barW/2;let acc=0;([p.a,p.b,p.c] as const).forEach((v,seg)=>{const h=(v/yMax)*plotH,y=top+plotH-(acc/yMax)*plotH-h;parts.push(`<rect data-stacked-segment="${seg}" data-category-index="${i}" data-value="${v}" x="${x}" y="${y}" width="${barW}" height="${h}" fill="${COLORS[seg]}" stroke="white"/><text x="${x+barW/2}" y="${y+h/2+4}" text-anchor="middle" font-size="11" font-weight="700">${v}</text>`);acc+=v;});parts.push(`<text x="${x+barW/2}" y="${top+plotH+28}" text-anchor="middle" font-size="11">${esc(p.category)}</text>`);});
  const lx=220; s.segmentLabels.forEach((label,i)=>parts.push(`<rect x="${lx+i*190}" y="492" width="14" height="14" fill="${COLORS[i]}"/><text x="${lx+22+i*190}" y="504" font-size="12">${esc(label)}</text>`));
  parts.push(`<text x="24" y="${top+plotH/2}" transform="rotate(-90 24 ${top+plotH/2})" text-anchor="middle" font-size="12" font-weight="600">${esc(s.unit)}</text></svg>`);
  return parts.join("");
}
