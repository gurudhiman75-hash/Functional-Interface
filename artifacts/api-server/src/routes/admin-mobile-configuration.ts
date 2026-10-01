import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router=Router();
function text(value:unknown,max=1000){return typeof value==="string"?value.trim().slice(0,max):"";}
function normalize(input:unknown){
  const raw=input&&typeof input==="object"?input as Record<string,unknown>:{};
  const flags=raw.featureFlags&&typeof raw.featureFlags==="object"&&!Array.isArray(raw.featureFlags)?raw.featureFlags as Record<string,unknown>:{};
  const cleanFlags:Record<string,boolean>={};
  for(const [key,value] of Object.entries(flags).slice(0,100)){const k=key.trim().slice(0,80);if(k)cleanFlags[k]=Boolean(value);}
  return {
    minimumSupportedVersion:text(raw.minimumSupportedVersion,40),
    latestVersion:text(raw.latestVersion,40),
    forceUpdate:Boolean(raw.forceUpdate),
    maintenanceMode:Boolean(raw.maintenanceMode),
    maintenanceMessage:text(raw.maintenanceMessage,500),
    playStoreUrl:text(raw.playStoreUrl,1000),
    supportUrl:text(raw.supportUrl,1000),
    defaultLanguage:text(raw.defaultLanguage,20)||"en",
    featureFlags:cleanFlags,
  };
}
async function load(){
  const rows=await sqlClient`SELECT configuration,updated_at AS "updatedAt",updated_by::text AS "updatedBy" FROM platform.mobile_app_configuration WHERE singleton_key='default' LIMIT 1`;
  return rows[0]??{configuration:normalize({}),updatedAt:null,updatedBy:null};
}
router.use(authenticate);
router.get("/",requireAdminPermission("content.taxonomy.read"),async(_req,res)=>{
  try{const row=await load();res.json({configuration:normalize(row.configuration),updatedAt:row.updatedAt,updatedBy:row.updatedBy,generatedAt:new Date().toISOString()});}
  catch(error){console.error("Unable to load mobile app configuration",error);res.status(500).json({error:"Unable to load mobile app configuration",code:"MOBILE_CONFIG_LOAD_FAILED"});}
});
router.put("/",requireAdminPermission("content.taxonomy.manage"),async(req,res)=>{
  try{
    const configuration=normalize(req.body?.configuration??req.body);
    const actor=req.adminSession!.user.id;
    await sqlClient.begin(async tx=>{
      await tx`
        INSERT INTO platform.mobile_app_configuration (singleton_key,configuration,updated_by,updated_at)
        VALUES ('default',${tx.json(configuration)},${actor}::uuid,now())
        ON CONFLICT (singleton_key) DO UPDATE
        SET configuration=EXCLUDED.configuration,updated_by=EXCLUDED.updated_by,updated_at=EXCLUDED.updated_at
      `;
      await tx`INSERT INTO platform.audit_events (id,actor_type,actor_user_id,action_key,entity_type,entity_id,summary,reason,metadata)
        VALUES (${randomUUID()}::uuid,'user'::audit_actor_type,${actor}::uuid,'mobile.app_configuration.updated','mobile_app_configuration',NULL,'Updated mobile app configuration','Admin updated mobile runtime configuration',${tx.json({minimumSupportedVersion:configuration.minimumSupportedVersion,latestVersion:configuration.latestVersion,forceUpdate:configuration.forceUpdate,maintenanceMode:configuration.maintenanceMode,featureFlags:configuration.featureFlags})})`;
    });
    res.json({configuration,updatedAt:new Date().toISOString()});
  }catch(error){console.error("Unable to update mobile app configuration",error);res.status(500).json({error:"Unable to update mobile app configuration",code:"MOBILE_CONFIG_UPDATE_FAILED"});}
});
export default router;
