import { randomUUID } from "node:crypto";
import { Router } from "express";

import { sqlClient } from "../lib/db";
import { optionalAuthenticate } from "../middlewares/optionalAuth";

const router=Router();
const EVENTS=new Set(["app_open","home_view","hero_impression","hero_click","promotion_impression","promotion_click","promotion_dismiss","content_plan_impression","content_plan_click","notification_open","feature_used","page_view","exam_view","test_view","test_start","checkout_start","purchase_complete","login_complete","signup_complete"]);
const PLATFORMS=new Set(["android","ios","web"]);
function text(value:unknown,max=500){return typeof value==="string"?value.trim().slice(0,max):"";}
async function canonicalUserId(firebaseUid:string|undefined){
  if(!firebaseUid)return null;
  const rows=await sqlClient`SELECT user_id::text AS id FROM identity.auth_identities WHERE provider='firebase' AND provider_subject=${firebaseUid} LIMIT 1`;
  return rows[0]?.id?String(rows[0].id):null;
}
router.post(["/mobile/analytics/events","/analytics/events"],optionalAuthenticate,async(req,res)=>{
  try{
    const raw=req.body&&typeof req.body==="object"?req.body as Record<string,unknown>:{};
    const eventName=text(raw.eventName,80);
    if(!EVENTS.has(eventName))return void res.status(400).json({error:"Unsupported analytics event",code:"ANALYTICS_EVENT_INVALID"});
    const platform=text(raw.platform,20)||"android";
    if(!PLATFORMS.has(platform))return void res.status(400).json({error:"Unsupported analytics platform",code:"ANALYTICS_PLATFORM_INVALID"});
    const userId=await canonicalUserId(req.user?.id);
    const metadata=raw.metadata&&typeof raw.metadata==="object"&&!Array.isArray(raw.metadata)?raw.metadata as Record<string,unknown>:{};
    const safeMetadata=Object.fromEntries(Object.entries(metadata).slice(0,30).map(([k,v])=>[k.slice(0,80),typeof v==="string"?v.slice(0,300):typeof v==="number"||typeof v==="boolean"?v:null]));
    await sqlClient`
      INSERT INTO platform.mobile_analytics_events (
        id,user_id,session_id,event_name,entity_type,entity_id,placement,app_version,platform,locale,metadata,occurred_at
      ) VALUES (
        ${randomUUID()}::uuid,${userId}::uuid,${text(raw.sessionId,120)},${eventName},${text(raw.entityType,80)},${text(raw.entityId,120)},
        ${text(raw.placement,80)},${text(raw.appVersion,80)},${platform},${text(raw.locale,40)},${sqlClient.json(safeMetadata)},
        COALESCE(${typeof raw.occurredAt==="string"?raw.occurredAt:null}::timestamptz,now())
      )
    `;
    res.status(202).json({accepted:true});
  }catch(error){console.error("Unable to record analytics event",error);res.status(500).json({error:"Unable to record mobile analytics event",code:"ANALYTICS_EVENT_FAILED"});}
});
export default router;
