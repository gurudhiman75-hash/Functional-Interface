import { randomUUID } from "node:crypto";
import { Router } from "express";

import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router=Router();
const PLATFORMS=new Set(["android","ios","web"]);
function text(value:unknown,max=2000){return typeof value==="string"?value.trim().slice(0,max):"";}

async function canonicalUserId(firebaseUid:string){
  const rows=await sqlClient`
    SELECT u.id::text AS id
    FROM identity.auth_identities ai
    JOIN identity.users u ON u.id=ai.user_id
    WHERE ai.provider='firebase' AND ai.provider_subject=${firebaseUid}
      AND u.deleted_at IS NULL AND u.status='active'::user_status
    LIMIT 1
  `;
  return rows[0]?.id?String(rows[0].id):null;
}

router.use(authenticate);

router.post("/mobile/push-devices",async(req,res)=>{
  try{
    const firebaseUid=req.user?.id??"";
    const userId=await canonicalUserId(firebaseUid);
    if(!userId)return void res.status(409).json({error:"Complete your ExamTree student profile before enabling notifications.",code:"MOBILE_PUSH_PROFILE_REQUIRED"});
    const token=text(req.body?.token,4096);
    const platform=text(req.body?.platform,20);
    if(token.length<20||!PLATFORMS.has(platform))return void res.status(400).json({error:"A valid push token and platform are required.",code:"MOBILE_PUSH_DEVICE_INVALID"});
    const appVersion=text(req.body?.appVersion,80);
    const locale=text(req.body?.locale,40);
    const id=randomUUID();
    await sqlClient`
      INSERT INTO platform.mobile_push_devices (id,user_id,firebase_uid,token,platform,app_version,locale,is_active,last_seen_at,created_at,updated_at)
      VALUES (${id}::uuid,${userId}::uuid,${firebaseUid},${token},${platform},${appVersion},${locale},true,now(),now(),now())
      ON CONFLICT (token) DO UPDATE SET
        user_id=EXCLUDED.user_id,firebase_uid=EXCLUDED.firebase_uid,platform=EXCLUDED.platform,
        app_version=EXCLUDED.app_version,locale=EXCLUDED.locale,is_active=true,last_seen_at=now(),updated_at=now()
    `;
    res.status(201).json({registered:true});
  }catch(error){console.error("Unable to register push device",error);res.status(500).json({error:"Unable to register push device",code:"MOBILE_PUSH_DEVICE_REGISTER_FAILED"});}
});

router.delete("/mobile/push-devices",async(req,res)=>{
  try{
    const firebaseUid=req.user?.id??"";const token=text(req.body?.token,4096);
    if(!token)return void res.status(400).json({error:"Push token is required.",code:"MOBILE_PUSH_TOKEN_REQUIRED"});
    await sqlClient`UPDATE platform.mobile_push_devices SET is_active=false,updated_at=now() WHERE firebase_uid=${firebaseUid} AND token=${token}`;
    res.json({registered:false});
  }catch(error){console.error("Unable to unregister push device",error);res.status(500).json({error:"Unable to unregister push device",code:"MOBILE_PUSH_DEVICE_UNREGISTER_FAILED"});}
});


router.get("/mobile/notifications",async(req,res)=>{
  try{
    const firebaseUid=req.user?.id??"";
    const userId=await canonicalUserId(firebaseUid);
    if(!userId)return void res.status(404).json({error:"Student profile not found.",code:"MOBILE_PUSH_PROFILE_NOT_FOUND"});
    const rows=await sqlClient`
      SELECT DISTINCT ON (d.campaign_id)
        c.id::text AS "campaignId",
        c.title,
        c.body,
        c.image_url AS "imageUrl",
        c.destination_type AS "destinationType",
        c.destination_value AS "destinationValue",
        d.status,
        d.sent_at AS "sentAt",
        d.opened_at AS "openedAt"
      FROM platform.mobile_notification_deliveries d
      JOIN platform.mobile_notification_campaigns c ON c.id=d.campaign_id
      WHERE d.user_id=${userId}::uuid
        AND COALESCE(d.is_test,false)=false
        AND d.status IN ('sent','opened')
      ORDER BY d.campaign_id,d.created_at DESC
    `;
    rows.sort((a,b)=>{
      const at=a.sentAt instanceof Date?a.sentAt.getTime():new Date(String(a.sentAt??0)).getTime();
      const bt=b.sentAt instanceof Date?b.sentAt.getTime():new Date(String(b.sentAt??0)).getTime();
      return bt-at;
    });
    res.json({notifications:rows.slice(0,100)});
  }catch(error){
    console.error("Unable to list mobile notifications",error);
    res.status(500).json({error:"Unable to load notifications",code:"MOBILE_NOTIFICATION_LIST_FAILED"});
  }
});

router.post("/mobile/notifications/:campaignId/open",async(req,res)=>{
  try{
    const firebaseUid=req.user?.id??"";
    const userId=await canonicalUserId(firebaseUid);
    if(!userId)return void res.status(404).json({error:"Student profile not found.",code:"MOBILE_PUSH_PROFILE_NOT_FOUND"});
    const campaignId=text(req.params.campaignId,80);
    if(!/^[0-9a-f-]{36}$/i.test(campaignId))return void res.status(400).json({error:"Invalid campaign identifier.",code:"MOBILE_NOTIFICATION_ID_INVALID"});
    const rows=await sqlClient`
      UPDATE platform.mobile_notification_deliveries
      SET status='opened',opened_at=COALESCE(opened_at,now())
      WHERE campaign_id=${campaignId}::uuid
        AND user_id=${userId}::uuid
        AND COALESCE(is_test,false)=false
        AND status='sent'
      RETURNING id::text AS id
    `;
    res.json({opened:true,deliveryCount:rows.length});
  }catch(error){console.error("Unable to record notification open",error);res.status(500).json({error:"Unable to record notification open",code:"MOBILE_NOTIFICATION_OPEN_FAILED"});}
});

export default router;
