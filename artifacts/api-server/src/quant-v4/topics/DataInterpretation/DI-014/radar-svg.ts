import type { Di014RadarStimulus } from "./types";
function esc(v:unknown){return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&apos;");}
function polar(cx:number,cy:number,r:number,index:number,count:number){const angle=-Math.PI/2+(Math.PI*2*index)/count;return{x:cx+r*Math.cos(angle),y:cy+r*Math.sin(angle)};}
export function renderDi014RadarSvg(s:Di014RadarStimulus){
  const width=820,height=620,cx=410,cy=325,maxR=220,n=s.points.length,maxTick=Math.max(...s.radialTicks);
  const parts:string[]=[`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(s.title)}" data-radar-pie-radar="true"><rect width="100%" height="100%" fill="white"/><title>${esc(s.title)}</title><text x="${cx}" y="30" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="21" font-weight="700">${esc(s.title)}</text>`];
  for(const tick of s.radialTicks.filter(t=>t>0)){const r=maxR*tick/maxTick,pts=Array.from({length:n},(_,i)=>{const p=polar(cx,cy,r,i,n);return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;}).join(" ");parts.push(`<polygon data-radial-tick="${tick}" points="${pts}" fill="none" stroke="#d9dee8"/><text x="${cx+6}" y="${(cy-r+13).toFixed(2)}" font-size="11" fill="#667085">${tick}</text>`);}
  s.points.forEach((p,i)=>{const edge=polar(cx,cy,maxR,i,n),label=polar(cx,cy,maxR+38,i,n);parts.push(`<line x1="${cx}" y1="${cy}" x2="${edge.x.toFixed(2)}" y2="${edge.y.toFixed(2)}" stroke="#cbd2dc"/><text x="${label.x.toFixed(2)}" y="${label.y.toFixed(2)}" text-anchor="middle" font-size="12" font-weight="600">${esc(p.category)}</text>`);});
  const pts=s.points.map((p,i)=>{const q=polar(cx,cy,maxR*p.applications/maxTick,i,n);return{...q,value:p.applications};});
  parts.push(`<polygon points="${pts.map(p=>`${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ")}" fill="#6c8cf5" fill-opacity=".10" stroke="#4c67c8" stroke-width="2.5"/>`);
  pts.forEach((p,i)=>parts.push(`<circle data-application-point="${i}" data-value="${p.value}" cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="4.5" fill="white" stroke="#4c67c8" stroke-width="2"/><text x="${p.x.toFixed(2)}" y="${(p.y-10).toFixed(2)}" text-anchor="middle" font-size="11" font-weight="700" fill="#4c67c8">${p.value}</text>`));
  parts.push(`<text x="${cx}" y="590" text-anchor="middle" font-size="12" fill="#667085">Applications received</text></svg>`);
  return parts.join("");
}
