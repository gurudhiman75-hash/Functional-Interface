import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router=Router();
const TYPES=new Set(["exam_family","test_series","learning_resource","current_affairs_release"]);
function text(value:unknown,max=1000){return typeof value==="string"?value.trim().slice(0,max):"";}
function dateOrNull(value:unknown){const raw=text(value,80);if(!raw)return null;const d=new Date(raw);return Number.isNaN(d.getTime())?null:d.toISOString();}
function normalize(input:unknown){
  const raw=input&&typeof input==="object"?input as Record<string,unknown>:{};
  const entityType=text(raw.entityType,60);
  return {
    slotKey:text(raw.slotKey,80),
    entityType:TYPES.has(entityType)?entityType:"",
    entityId:text(raw.entityId,80),
    labelOverride:text(raw.labelOverride,140),
    badgeText:text(raw.badgeText,60),
    languageCode:text(raw.languageCode,20),
    sortOrder:Number.isFinite(Number(raw.sortOrder))?Math.max(0,Math.min(999,Number(raw.sortOrder))):1,
    isActive:raw.isActive!==false,
    startAt:dateOrNull(raw.startAt),
    endAt:dateOrNull(raw.endAt),
  };
}
function uuid(value:string){return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);}
async function assertReference(type:string,id:string){
  let rows:any[]=[];
  if(type==="exam_family") rows=await sqlClient`SELECT id::text AS id FROM catalog.exam_families WHERE id=${id}::uuid AND is_active=true LIMIT 1`;
  if(type==="test_series") rows=await sqlClient`SELECT id::text AS id FROM assessment.test_series WHERE id=${id}::uuid AND deleted_at IS NULL LIMIT 1`;
  if(type==="learning_resource") rows=await sqlClient`SELECT id::text AS id FROM content.learning_resources WHERE id=${id}::uuid AND status='published' LIMIT 1`;
  if(type==="current_affairs_release") rows=await sqlClient`SELECT id::text AS id FROM content.current_affairs_releases WHERE id=${id}::uuid AND status='approved' LIMIT 1`;
  if(rows.length===0)throw Object.assign(new Error("The selected shared content item is unavailable for mobile planning."),{statusCode:409,code:"MOBILE_CONTENT_REFERENCE_INVALID"});
}
function validate(input:ReturnType<typeof normalize>){
  if(input.slotKey.length<2)throw Object.assign(new Error("Placement slot is required."),{statusCode:400,code:"MOBILE_CONTENT_SLOT_REQUIRED"});
  if(!input.entityType||!uuid(input.entityId))throw Object.assign(new Error("Select a valid shared content item."),{statusCode:400,code:"MOBILE_CONTENT_REFERENCE_REQUIRED"});
  if(input.startAt&&input.endAt&&new Date(input.endAt)<new Date(input.startAt))throw Object.assign(new Error("End time cannot be before start time."),{statusCode:400,code:"MOBILE_CONTENT_WINDOW_INVALID"});
}
router.use(authenticate);
router.get("/",requireAdminPermission("content.taxonomy.read"),async(_req,res)=>{
  try{
    const [items,examFamilies,testSeries,learningResources,currentAffairs]=await Promise.all([
      sqlClient`SELECT id::text AS id,slot_key AS "slotKey",entity_type AS "entityType",entity_id::text AS "entityId",label_override AS "labelOverride",badge_text AS "badgeText",language_code AS "languageCode",sort_order AS "sortOrder",is_active AS "isActive",start_at AS "startAt",end_at AS "endAt",created_at AS "createdAt",updated_at AS "updatedAt" FROM platform.mobile_content_plan_items ORDER BY slot_key,sort_order,updated_at DESC`,
      sqlClient`SELECT id::text AS id,code,name FROM catalog.exam_families WHERE is_active=true ORDER BY name`,
      sqlClient`SELECT s.id::text AS id,s.code,s.name,e.name AS "examName" FROM assessment.test_series s JOIN catalog.exam_versions ev ON ev.id=s.exam_version_id JOIN catalog.exams e ON e.id=ev.exam_id WHERE s.deleted_at IS NULL ORDER BY s.updated_at DESC LIMIT 250`,
      sqlClient`SELECT id::text AS id,public_code AS code,title,category,language_code AS "languageCode" FROM content.learning_resources WHERE status='published' ORDER BY published_at DESC NULLS LAST,created_at DESC LIMIT 300`,
      sqlClient`SELECT id::text AS id,public_code AS code,exam_family_key AS "examFamilyKey",period_type AS "periodType",period_start AS "periodStart",period_end AS "periodEnd" FROM content.current_affairs_releases WHERE status='approved' ORDER BY period_end DESC LIMIT 200`
    ]);
    res.json({items,catalog:{examFamilies,testSeries,learningResources,currentAffairs},generatedAt:new Date().toISOString()});
  }catch(error){console.error("Unable to load mobile content planning",error);res.status(500).json({error:"Unable to load mobile content planning",code:"MOBILE_CONTENT_PLAN_LOAD_FAILED"});}
});
router.post("/",requireAdminPermission("content.taxonomy.manage"),async(req,res)=>{
  try{
    const input=normalize(req.body);validate(input);await assertReference(input.entityType,input.entityId);
    const id=randomUUID();const actor=req.adminSession!.user.id;
    await sqlClient.begin(async tx=>{
      await tx`INSERT INTO platform.mobile_content_plan_items (id,slot_key,entity_type,entity_id,label_override,badge_text,language_code,sort_order,is_active,start_at,end_at,created_by,updated_by) VALUES (${id}::uuid,${input.slotKey},${input.entityType},${input.entityId}::uuid,${input.labelOverride},${input.badgeText},${input.languageCode},${input.sortOrder},${input.isActive},${input.startAt}::timestamptz,${input.endAt}::timestamptz,${actor}::uuid,${actor}::uuid)`;
      await tx`INSERT INTO platform.audit_events (id,actor_type,actor_user_id,action_key,entity_type,entity_id,summary,reason,metadata) VALUES (${randomUUID()}::uuid,'user'::audit_actor_type,${actor}::uuid,'mobile.content_plan.created','mobile_content_plan_item',${id}::uuid,'Added shared content to mobile plan','Admin curated existing content for mobile discovery',${tx.json({slotKey:input.slotKey,entityType:input.entityType,entityId:input.entityId})})`;
    });
    res.status(201).json({id});
  }catch(error){const e=error as {statusCode?:number;code?:string;message?:string};res.status(e.statusCode??500).json({error:e.message??"Unable to create mobile content plan item",code:e.code??"MOBILE_CONTENT_PLAN_CREATE_FAILED"});}
});
router.put("/:id",requireAdminPermission("content.taxonomy.manage"),async(req,res)=>{
  try{
    const id=text(req.params.id,80);if(!uuid(id))return void res.status(400).json({error:"Invalid content-plan identifier",code:"MOBILE_CONTENT_PLAN_ID_INVALID"});
    const input=normalize(req.body);validate(input);await assertReference(input.entityType,input.entityId);const actor=req.adminSession!.user.id;
    const rows=await sqlClient`UPDATE platform.mobile_content_plan_items SET slot_key=${input.slotKey},entity_type=${input.entityType},entity_id=${input.entityId}::uuid,label_override=${input.labelOverride},badge_text=${input.badgeText},language_code=${input.languageCode},sort_order=${input.sortOrder},is_active=${input.isActive},start_at=${input.startAt}::timestamptz,end_at=${input.endAt}::timestamptz,updated_by=${actor}::uuid,updated_at=now() WHERE id=${id}::uuid RETURNING id::text AS id`;
    if(rows.length===0)return void res.status(404).json({error:"Content-plan item not found",code:"MOBILE_CONTENT_PLAN_NOT_FOUND"});
    res.json({id});
  }catch(error){const e=error as {statusCode?:number;code?:string;message?:string};res.status(e.statusCode??500).json({error:e.message??"Unable to update mobile content plan item",code:e.code??"MOBILE_CONTENT_PLAN_UPDATE_FAILED"});}
});
export default router;
