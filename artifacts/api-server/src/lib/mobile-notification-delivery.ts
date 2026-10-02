import { randomUUID } from "node:crypto";

import { sqlClient } from "./db";
import { messaging } from "./firebase-admin";

const POLL_MS=60_000;
let started=false;
let running=false;

type Campaign={
  id:string;title:string;body:string;imageUrl:string;destinationType:string;destinationValue:string;audience:Record<string,unknown>;
};

function providerCode(error:unknown){
  const candidate=error as {code?:unknown;message?:unknown};
  return {code:typeof candidate?.code==="string"?candidate.code:"FCM_SEND_FAILED",message:typeof candidate?.message==="string"?candidate.message:"Push delivery failed"};
}

async function claimCampaign():Promise<Campaign|null>{
  return sqlClient.begin(async tx=>{
    const rows=await tx`
      SELECT id::text AS id,title,body,image_url AS "imageUrl",
        destination_type AS "destinationType",destination_value AS "destinationValue",audience
      FROM platform.mobile_notification_campaigns
      WHERE status='scheduled' AND scheduled_at<=now()
      ORDER BY scheduled_at,id
      LIMIT 1
      FOR UPDATE SKIP LOCKED
    `;
    if(!rows[0])return null;
    await tx`UPDATE platform.mobile_notification_campaigns SET status='sending',updated_at=now() WHERE id=${String(rows[0].id)}::uuid`;
    return {
      id:String(rows[0].id),title:String(rows[0].title),body:String(rows[0].body),imageUrl:String(rows[0].imageUrl??""),
      destinationType:String(rows[0].destinationType),destinationValue:String(rows[0].destinationValue??""),
      audience:rows[0].audience&&typeof rows[0].audience==="object"?rows[0].audience as Record<string,unknown>:{},
    };
  });
}

async function deliver(campaign:Campaign){
  if(!messaging){
    await sqlClient`UPDATE platform.mobile_notification_campaigns SET status='scheduled',updated_at=now() WHERE id=${campaign.id}::uuid AND status='sending'`;
    return {status:"provider_unavailable" as const,count:0};
  }
  const languageCodes=Array.isArray(campaign.audience.languageCodes)
    ? campaign.audience.languageCodes.map(value=>String(value).trim().toLowerCase()).filter(value=>["en","hi","pa"].includes(value))
    : [];
  const examIds=Array.isArray(campaign.audience.examIds)
    ? campaign.audience.examIds.map(value=>String(value).trim()).filter(value=>/^[0-9a-f-]{36}$/i.test(value))
    : [];
  const devices=await sqlClient`
    SELECT d.id::text AS id,d.user_id::text AS "userId",d.token
    FROM platform.mobile_push_devices d
    WHERE d.is_active=true
      AND (
        ${languageCodes.length===0}
        OR lower(split_part(replace(d.locale,'_','-'),'-',1)) = ANY(${languageCodes}::text[])
      )
      AND (
        ${examIds.length===0}
        OR EXISTS (
          SELECT 1
          FROM identity.student_exam_preferences preference
          WHERE preference.user_id=d.user_id
            AND preference.exam_id = ANY(${examIds}::uuid[])
        )
      )
    ORDER BY d.updated_at DESC
    LIMIT 5000
  `;
  if(devices.length===0){
    await sqlClient`UPDATE platform.mobile_notification_campaigns SET status='sent',sent_at=now(),updated_at=now() WHERE id=${campaign.id}::uuid`;
    return {status:"sent" as const,count:0};
  }
  let sent=0;let failed=0;
  for(let offset=0;offset<devices.length;offset+=500){
    const batch=devices.slice(offset,offset+500);
    const response=await messaging.sendEachForMulticast({
      tokens:batch.map(d=>String(d.token)),
      notification:{title:campaign.title,body:campaign.body,...(campaign.imageUrl?{imageUrl:campaign.imageUrl}:{})},
      data:{campaignId:campaign.id,destinationType:campaign.destinationType,destinationValue:campaign.destinationValue},
      android:{priority:"high"},
    });
    for(let i=0;i<batch.length;i+=1){
      const device=batch[i]!;
      const result=response.responses[i]!;
      if(result.success){
        sent+=1;
        await sqlClient`
          INSERT INTO platform.mobile_notification_deliveries
            (id,campaign_id,user_id,device_id,provider,provider_message_id,status,sent_at,created_at)
          VALUES
            (${randomUUID()}::uuid,${campaign.id}::uuid,${String(device.userId)}::uuid,${String(device.id)}::uuid,'fcm',${result.messageId??null},'sent',now(),now())
        `;
      }else{
        failed+=1;const err=providerCode(result.error);
        await sqlClient`
          INSERT INTO platform.mobile_notification_deliveries
            (id,campaign_id,user_id,device_id,provider,status,error_code,error_message,created_at)
          VALUES
            (${randomUUID()}::uuid,${campaign.id}::uuid,${String(device.userId)}::uuid,${String(device.id)}::uuid,'fcm','failed',${err.code},${err.message},now())
        `;
        if(["messaging/registration-token-not-registered","messaging/invalid-registration-token"].includes(err.code)){
          await sqlClient`UPDATE platform.mobile_push_devices SET is_active=false,updated_at=now() WHERE id=${String(device.id)}::uuid`;
        }
      }
    }
  }
  await sqlClient`
    UPDATE platform.mobile_notification_campaigns
    SET status=${sent>0||failed===0?"sent":"failed"},sent_at=CASE WHEN ${sent}>0 THEN now() ELSE sent_at END,updated_at=now()
    WHERE id=${campaign.id}::uuid
  `;
  return {status:sent>0||failed===0?"sent":"failed",count:devices.length,sent,failed};
}

export async function runMobileNotificationDelivery(){
  const campaign=await claimCampaign();
  if(!campaign)return {status:"idle" as const};
  try{return {campaignId:campaign.id,...await deliver(campaign)};}
  catch(error){
    console.error("Mobile notification delivery failed",error);
    await sqlClient`UPDATE platform.mobile_notification_campaigns SET status='failed',updated_at=now() WHERE id=${campaign.id}::uuid AND status='sending'`;
    return {status:"failed" as const,campaignId:campaign.id};
  }
}

export function startMobileNotificationWorker(){
  if(started)return;started=true;
  const tick=async()=>{if(running)return;running=true;try{for(let i=0;i<5;i+=1){const result=await runMobileNotificationDelivery();if(result.status==="idle"||result.status==="provider_unavailable")break;}}finally{running=false;}};
  const timer=setInterval(()=>void tick(),POLL_MS);timer.unref();
  void tick();
}
