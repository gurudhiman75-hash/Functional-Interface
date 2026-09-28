import type { Di003SingleStimulus } from "./single-bar-v1";
function esc(v:unknown){return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&apos;");}
export function renderDi003SingleBarSvg(stimulus:Di003SingleStimulus){
  const width=900,height=500,left=80,right=30,top=70,bottom=90,plotW=width-left-right,plotH=height-top-bottom;
  const max=Math.max(...stimulus.points.map(p=>p.value)),step=20,yMax=Math.ceil((max+step)/step)*step,group=plotW/stimulus.points.length,barW=Math.min(70,group*.45);
  const parts:string[]=[`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(stimulus.title)}" data-single-series-bar="true"><rect width="100%" height="100%" fill="white"/><title>${esc(stimulus.title)}</title><text x="${width/2}" y="30" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="21" font-weight="700">${esc(stimulus.title)}</text>`];
  for(let v=0;v<=yMax;v+=step){const y=top+plotH-(v/yMax)*plotH;parts.push(`<line x1="${left}" y1="${y}" x2="${width-right}" y2="${y}" stroke="#e7ebf0"/><text x="${left-12}" y="${y+4}" text-anchor="end" font-size="11" fill="#667085">${v}</text>`);}
  parts.push(`<line x1="${left}" y1="${top+plotH}" x2="${width-right}" y2="${top+plotH}" stroke="#344054"/>`);
  stimulus.points.forEach((p,i)=>{const x=left+group*(i+.5)-barW/2,h=(p.value/yMax)*plotH,y=top+plotH-h;parts.push(`<rect data-single-bar="true" data-value="${p.value}" x="${x}" y="${y}" width="${barW}" height="${h}" fill="#6c8cf5" stroke="#4c67c8"/><text x="${x+barW/2}" y="${y-7}" text-anchor="middle" font-size="12" font-weight="700">${p.value}</text><text x="${x+barW/2}" y="${top+plotH+27}" text-anchor="middle" font-size="11">${esc(p.category)}</text>`);});
  parts.push(`<text x="22" y="${top+plotH/2}" transform="rotate(-90 22 ${top+plotH/2})" text-anchor="middle" font-size="12" font-weight="600">${esc(stimulus.seriesLabel)} (${esc(stimulus.unit)})</text></svg>`);
  return parts.join("");
}
