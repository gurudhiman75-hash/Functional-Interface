import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router=Router();
const DESTINATIONS=new Set(["exam","test_series","learn","url","none"]);
const STATUSES=new Set(["draft","scheduled","cancelled"]);

function text(value:unknown,max=1000){return typeof value==="string"?value.trim().slice(0,max):"";}
function dateOrNull(value:unknown):string|null{const raw=text(value,80);if(!raw)return null;const d=new Date(raw);return Number.isNaN(d.getTime())?null:d.toISOString();}
function normalize(input:unknown){
  const raw=input&&typeof input==="object"?input as Record<string,unknown>:{};
  const destinationType=text(raw.destinationType,40)||"none";
  const status=text(raw.status,40)||"draft";
  const audience=raw.audience&&typeof raw.audience==="object"&&!Array.isArray(raw.audience)?raw.audience as Record<string,unknown>:{};
  return {
    title:text(raw.title,120),
    body:text(raw.body,500),
    imageUrl:text(raw.imageUrl,1000),
    destinationType:DESTINATIONS.has(destinationType)?destinationType:"none",
    destinationValue:text(raw.destinationValue,1000),
    audience,
    status:STATUSES.has(status)?status:"draft",
    scheduledAt:dateOrNull(raw.scheduledAt),
  };
}
function validate(input:ReturnType<typeof normalize>){
  if(input.title.length<2)throw Object.assign(new Error("Notification title must contain at least 2 characters."),{statusCode:400,code:"MOBILE_NOTIFICATION_TITLE_INVALID"});
  if(input.body.length<2)throw Object.assign(new Error("Notification body must contain at least 2 characters."),{statusCode:400,code:"MOBILE_NOTIFICATION_BODY_INVALID"});
  if(input.status==="scheduled"&&!input.scheduledAt)throw Object.assign(new Error("Scheduled notifications require a date and time."),{statusCode:400,code:"MOBILE_NOTIFICATION_SCHEDULE_REQUIRED"});
}

router.use(authenticate);

router.get("/",requireAdminPermission("content.taxonomy.read"),async(_req,res)=>{
  try{
    const campaigns=await sqlClient`
      SELECT
        c.id::text AS id,c.title,c.body,c.image_url AS "imageUrl",
        c.destination_type AS "destinationType",c.destination_value AS "destinationValue",
        c.audience,c.status,c.scheduled_at AS "scheduledAt",c.sent_at AS "sentAt",
        c.created_at AS "createdAt",c.updated_at AS "updatedAt",
        COUNT(d.id)::int AS "deliveryCount",
        COUNT(d.id) FILTER (WHERE d.status='sent')::int AS "sentCount",
        COUNT(d.id) FILTER (WHERE d.status='failed')::int AS "failedCount",
        COUNT(d.id) FILTER (WHERE d.status='opened')::int AS "openedCount"
      FROM platform.mobile_notification_campaigns c
      LEFT JOIN platform.mobile_notification_deliveries d ON d.campaign_id=c.id
      GROUP BY c.id
      ORDER BY COALESCE(c.scheduled_at,c.created_at) DESC
      LIMIT 250
    `;
    const [deviceSummary]=await sqlClient`
      SELECT
        COUNT(*) FILTER (WHERE is_active)::int AS "activeDevices",
        COUNT(DISTINCT user_id) FILTER (WHERE is_active)::int AS "reachableUsers"
      FROM platform.mobile_push_devices
    `;
    res.json({campaigns,deviceSummary:deviceSummary??{activeDevices:0,reachableUsers:0},generatedAt:new Date().toISOString()});
  }catch(error){
    console.error("Unable to load mobile notifications",error);
    res.status(500).json({error:"Unable to load mobile notifications",code:"MOBILE_NOTIFICATIONS_LOAD_FAILED"});
  }
});

router.post("/",requireAdminPermission("content.taxonomy.manage"),async(req,res)=>{
  try{
    const input=normalize(req.body);validate(input);const id=randomUUID();const actor=req.adminSession!.user.id;
    await sqlClient.begin(async tx=>{
      await tx`
        INSERT INTO platform.mobile_notification_campaigns (
          id,title,body,image_url,destination_type,destination_value,audience,status,scheduled_at,created_by,updated_by
        ) VALUES (
          ${id}::uuid,${input.title},${input.body},${input.imageUrl},${input.destinationType},${input.destinationValue},
          ${tx.json(input.audience)},${input.status},${input.scheduledAt}::timestamptz,${actor}::uuid,${actor}::uuid
        )
      `;
      await tx`INSERT INTO platform.audit_events (id,actor_type,actor_user_id,action_key,entity_type,entity_id,summary,reason,metadata)
        VALUES (${randomUUID()}::uuid,'user'::audit_actor_type,${actor}::uuid,'mobile.notification.created','mobile_notification_campaign',${id}::uuid,'Created mobile notification campaign','Admin created a mobile push campaign',${tx.json({title:input.title,status:input.status,scheduledAt:input.scheduledAt,audience:input.audience})})`;
    });
    res.status(201).json({id});
  }catch(error){const typed=error as {statusCode?:number;code?:string;message?:string};res.status(typed.statusCode??500).json({error:typed.message??"Unable to create notification",code:typed.code??"MOBILE_NOTIFICATION_CREATE_FAILED"});}
});

router.put("/:id",requireAdminPermission("content.taxonomy.manage"),async(req,res)=>{
  try{
    const id=text(req.params.id,80);if(!/^[0-9a-f-]{36}$/i.test(id))return void res.status(400).json({error:"Invalid notification identifier",code:"MOBILE_NOTIFICATION_ID_INVALID"});
    const input=normalize(req.body);validate(input);const actor=req.adminSession!.user.id;
    const rows=await sqlClient`
      UPDATE platform.mobile_notification_campaigns SET
        title=${input.title},body=${input.body},image_url=${input.imageUrl},
        destination_type=${input.destinationType},destination_value=${input.destinationValue},
        audience=${sqlClient.json(input.audience)},status=${input.status},scheduled_at=${input.scheduledAt}::timestamptz,
        updated_by=${actor}::uuid,updated_at=now()
      WHERE id=${id}::uuid AND status IN ('draft','scheduled','cancelled')
      RETURNING id::text AS id
    `;
    if(rows.length===0)return void res.status(409).json({error:"Only draft, scheduled or cancelled campaigns can be edited.",code:"MOBILE_NOTIFICATION_IMMUTABLE_AFTER_SEND"});
    await sqlClient`INSERT INTO platform.audit_events (id,actor_type,actor_user_id,action_key,entity_type,entity_id,summary,reason,metadata)
      VALUES (${randomUUID()}::uuid,'user'::audit_actor_type,${actor}::uuid,'mobile.notification.updated','mobile_notification_campaign',${id}::uuid,'Updated mobile notification campaign','Admin updated a mobile push campaign',${sqlClient.json({title:input.title,status:input.status,scheduledAt:input.scheduledAt})})`;
    res.json({id});
  }catch(error){const typed=error as {statusCode?:number;code?:string;message?:string};res.status(typed.statusCode??500).json({error:typed.message??"Unable to update notification",code:typed.code??"MOBILE_NOTIFICATION_UPDATE_FAILED"});}
});

router.post("/:id/cancel",requireAdminPermission("content.taxonomy.manage"),async(req,res)=>{
  const id=text(req.params.id,80);if(!/^[0-9a-f-]{36}$/i.test(id))return void res.status(400).json({error:"Invalid notification identifier",code:"MOBILE_NOTIFICATION_ID_INVALID"});
  try{
    const actor=req.adminSession!.user.id;
    const rows=await sqlClient`UPDATE platform.mobile_notification_campaigns SET status='cancelled',updated_by=${actor}::uuid,updated_at=now() WHERE id=${id}::uuid AND status IN ('draft','scheduled') RETURNING id::text AS id`;
    if(rows.length===0)return void res.status(409).json({error:"This notification can no longer be cancelled.",code:"MOBILE_NOTIFICATION_CANCEL_BLOCKED"});
    res.json({id,status:"cancelled"});
  }catch(error){console.error("Unable to cancel notification",error);res.status(500).json({error:"Unable to cancel notification",code:"MOBILE_NOTIFICATION_CANCEL_FAILED"});}
});

export default router;
