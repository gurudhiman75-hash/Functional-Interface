import type { GeoJsonAreaGeometry, GeoJsonLineString, IndiaAdminFeatureCollection, Position } from "../geometry/geojson";
import type { StaticGkMapPathSceneRecipe, StaticGkMeridianSceneRecipe, StaticGkSceneCue, StaticGkSceneQuiz, StaticGkSceneViewport } from "../scenes/types";

interface Point { x: number; y: number }
interface Projector { project(position: Position): Point }
const MAX_LAT = 85.05112878;

function esc(value: string): string { return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;"); }
function raw([lon, lat]: Position): Point { const lambda = lon * Math.PI / 180; const phi = Math.max(-MAX_LAT, Math.min(MAX_LAT, lat)) * Math.PI / 180; return { x: lambda, y: Math.log(Math.tan(Math.PI / 4 + phi / 2)) }; }
function eachPosition(geometry: GeoJsonAreaGeometry, visit: (position: Position) => void): void { const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates; for (const polygon of polygons) for (const ring of polygon) for (const position of ring) visit(position); }
function projectorForIndia(geometry: IndiaAdminFeatureCollection, viewport: StaticGkSceneViewport): Projector {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const feature of geometry.features) eachPosition(feature.geometry, (p) => { const q = raw(p); minX = Math.min(minX, q.x); maxX = Math.max(maxX, q.x); minY = Math.min(minY, q.y); maxY = Math.max(maxY, q.y); });
  if (![minX,maxX,minY,maxY].every(Number.isFinite)) throw new Error("Invalid India geometry extent");
  const top = viewport.safeArea.top + 245, bottom = viewport.height - viewport.safeArea.bottom - 360, left = viewport.safeArea.left + 20, right = viewport.width - viewport.safeArea.right - 20;
  const scale = Math.min((right-left)/(maxX-minX), (bottom-top)/(maxY-minY));
  const rw=(maxX-minX)*scale, rh=(maxY-minY)*scale;
  const ox=left+((right-left)-rw)/2-minX*scale, oy=top+((bottom-top)-rh)/2+maxY*scale;
  return { project(position) { const q=raw(position); return { x:q.x*scale+ox, y:oy-q.y*scale }; } };
}
function ringPath(ring: Position[], p: Projector): string { return ring.map((v,i)=>{const q=p.project(v);return `${i?"L":"M"}${q.x.toFixed(2)},${q.y.toFixed(2)}`;}).join(" ")+" Z"; }
function areaPath(g: GeoJsonAreaGeometry,p:Projector):string { const polygons=g.type==="Polygon"?[g.coordinates]:g.coordinates; return polygons.flatMap(poly=>poly.map(r=>ringPath(r,p))).join(" "); }
function linePath(g: GeoJsonLineString,p:Projector):string { return g.coordinates.map((v,i)=>{const q=p.project(v);return `${i?"L":"M"}${q.x.toFixed(2)},${q.y.toFixed(2)}`;}).join(" "); }
function active(cues: readonly StaticGkSceneCue[], layer: StaticGkSceneCue["layer"], ms:number){ return cues.find(c=>c.layer===layer&&c.startMs<=ms&&ms<c.endMs); }
function textAt(cues: readonly StaticGkSceneCue[],ms:number){ return [...cues].filter(c=>c.startMs<=ms&&ms<c.endMs&&c.text).sort((a,b)=>b.startMs-a.startMs)[0]?.text; }
function target(cue:StaticGkSceneCue|undefined,prefix:string){ return cue?.targetRef?.startsWith(prefix)?cue.targetRef.slice(prefix.length):undefined; }
function textCard(text:string,y:number,size=34):string { return `<g><rect x="90" y="${y-62}" width="900" height="112" rx="30" fill="#07111F" fill-opacity="0.82" stroke="#FFFFFF" stroke-opacity="0.18"/><text x="540" y="${y}" text-anchor="middle" font-size="${size}" font-weight="700" fill="#FFFFFF">${esc(text)}</text></g>`; }
function quizCard(quiz:StaticGkSceneQuiz,visible:boolean):string { if(!visible)return""; return `<g><rect x="80" y="1430" width="920" height="350" rx="38" fill="#06111F" fill-opacity="0.9" stroke="#FBBF24" stroke-width="3"/><text x="540" y="1512" text-anchor="middle" font-size="34" font-weight="800" fill="#FFFFFF">${esc(quiz.question)}</text>${quiz.options.map((o,i)=>`<text x="155" y="${1580+i*43}" font-size="29" font-weight="650" fill="#F8FAFC">${String.fromCharCode(65+i)}. ${esc(o)}</text>`).join("")}</g>`; }
function shell(v:StaticGkSceneViewport,title:string,subtitle:string,body:string,overlay:string):string { return `<svg xmlns="http://www.w3.org/2000/svg" width="${v.width}" height="${v.height}" viewBox="0 0 ${v.width} ${v.height}"><defs><filter id="shadow"><feDropShadow dx="0" dy="3" stdDeviation="7" flood-color="#000000" flood-opacity="0.75"/></filter></defs><g filter="url(#shadow)"><rect x="58" y="62" width="964" height="178" rx="34" fill="#06111F" fill-opacity="0.72"/><text x="540" y="132" text-anchor="middle" font-size="50" font-weight="850" fill="#FFFFFF">${esc(title)}</text><text x="540" y="198" text-anchor="middle" font-size="31" font-weight="700" fill="#FBBF24">${esc(subtitle)}</text></g><g>${body}</g>${overlay}<text x="540" y="1850" text-anchor="middle" font-size="23" font-weight="650" fill="#FFFFFF" fill-opacity="0.85">EXAMTREE · VERIFIED GEOGRAPHY OVERLAY</text></svg>`; }

export function renderTropicCancerAiOverlayFrame(scene:StaticGkMapPathSceneRecipe,geometry:IndiaAdminFeatureCollection,timeMs:number):string {
  if(scene.status!=="render-ready")throw new Error("Tropic scene is not render-ready");
  const p=projectorForIndia(geometry,scene.viewport), cue=active(scene.cues,"state-highlight",timeMs), code=target(cue,"state.");
  const selected=code?scene.route.resolvedSegments.find(s=>s.stateCode===code)?.stateName:undefined;
  const routeVisible=scene.cues.some(c=>c.layer==="latitude-line"&&c.startMs<=timeMs), quiz=Boolean(active(scene.cues,"quiz",timeMs)), info=textAt(scene.cues,timeMs);
  const boundaries=geometry.features.map(f=>{const on=f.properties.stateCode===code;return `<path d="${areaPath(f.geometry,p)}" fill="${on?"#FBBF24":"#07111F"}" fill-opacity="${on?"0.28":"0.12"}" stroke="${on?"#FBBF24":"#FFFFFF"}" stroke-opacity="${on?"1":"0.58"}" stroke-width="${on?"4":"1.5"}" fill-rule="evenodd"/>`;}).join("");
  const route=routeVisible?scene.route.resolvedSegments.map(s=>`<path d="${linePath(s.geometry,p)}" fill="none" stroke="#FFD447" stroke-width="10" stroke-linecap="round"/>`).join(""):"";
  const overlay=`${selected?textCard(selected,1515,54):""}${!quiz&&info?textCard(info,1640,32):""}${quizCard(scene.quiz,quiz)}`;
  return shell(scene.viewport,scene.title,scene.route.editorialLabel,`${boundaries}${route}`,overlay);
}

export function renderStandardMeridianAiOverlayFrame(scene:StaticGkMeridianSceneRecipe,geometry:IndiaAdminFeatureCollection,timeMs:number):string {
  if(scene.status!=="render-ready")throw new Error("Standard Meridian scene is not render-ready");
  const p=projectorForIndia(geometry,scene.viewport), state=Boolean(active(scene.cues,"state-highlight",timeMs)), district=Boolean(active(scene.cues,"district-highlight",timeMs)), meridian=scene.cues.some(c=>c.layer==="longitude-line"&&c.startMs<=timeMs), quiz=Boolean(active(scene.cues,"quiz",timeMs)), info=textAt(scene.cues,timeMs);
  const boundaries=geometry.features.map(f=>{const dn=typeof f.properties.districtName==="string"?f.properties.districtName.trim().toLowerCase():"";const isD=district&&f.properties.stateName==="Uttar Pradesh"&&dn==="mirzapur";const isS=state&&f.properties.stateName==="Uttar Pradesh";return `<path d="${areaPath(f.geometry,p)}" fill="${isD?"#FBBF24":isS?"#38BDF8":"#07111F"}" fill-opacity="${isD?"0.32":isS?"0.22":"0.12"}" stroke="${isD?"#FBBF24":isS?"#7DD3FC":"#FFFFFF"}" stroke-opacity="0.8" stroke-width="${isD?"5":isS?"3":"1.5"}" fill-rule="evenodd"/>`;}).join("");
  const line=meridian?scene.meridian.indiaSegments.map(s=>`<path d="${linePath(s,p)}" fill="none" stroke="#FFD447" stroke-width="10" stroke-linecap="round"/>`).join(""):"";
  const verified=district?scene.districtOfInterest.meridianSegments.map(s=>`<path d="${linePath(s,p)}" fill="none" stroke="#FB923C" stroke-width="15" stroke-linecap="round"/>`).join(""):"";
  const overlay=`${district?textCard("Mirzapur district",1515,50):""}${!quiz&&info?textCard(info,1640,32):""}${quizCard(scene.quiz,quiz)}`;
  return shell(scene.viewport,scene.title,scene.meridian.editorialLabel,`${boundaries}${line}${verified}`,overlay);
}
