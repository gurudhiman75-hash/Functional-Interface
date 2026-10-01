import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { storage } from "../lib/firebase-admin";
import { authenticate } from "../middlewares/auth";

const router = Router();
const ALLOWED_TYPES = new Set(["Question Image","DI Chart","Passage Image","Package Banner","Exam Icon","Notification Image","Home Banner","Home Icon","Promotion Image"]);
const ALLOWED_MIME = new Set(["image/png","image/jpeg","image/webp","image/svg+xml"]);
const MAX_BYTES = 10 * 1024 * 1024;

function text(value: unknown, max=500){return typeof value==="string"?value.trim().slice(0,max):"";}
function safeName(value:string){return value.replace(/[^a-zA-Z0-9._-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,120)||"asset";}

router.use(authenticate);

router.get("/", requireAdminPermission("content.taxonomy.read"), async (req,res)=>{
  try{
    const status=text(req.query.status,20)||"all";
    const type=text(req.query.type,80)||"all";
    const search=text(req.query.search,120).toLowerCase();
    const pattern=search?"%"+search.replace(/[%_\\]/g,"\\$&")+"%":null;
    const rows=await sqlClient`
      SELECT m.id::text AS id,m.name,m.asset_type AS type,m.mime_type AS "mimeType",
        m.byte_size::float8 AS "byteSize",m.width_px AS width,m.height_px AS height,
        m.storage_path AS "storagePath",m.download_url AS url,m.status,
        m.created_at AS "createdAt",m.updated_at AS "updatedAt",
        COALESCE(u.display_name,u.email,'Unknown admin') AS "uploadedBy"
      FROM platform.media_assets m
      LEFT JOIN identity.users u ON u.id=m.created_by
      WHERE (${status}='all' OR m.status=${status})
        AND (${type}='all' OR m.asset_type=${type})
        AND (${pattern}::text IS NULL OR lower(m.name) ILIKE ${pattern} ESCAPE E'\\\\')
      ORDER BY m.created_at DESC LIMIT 500
    `;
    res.json({assets:rows});
  }catch(error){console.error("Unable to load media assets",error);res.status(500).json({error:"Unable to load media assets",code:"MEDIA_LOAD_FAILED"});}
});

router.post("/upload-intent",requireAdminPermission("content.taxonomy.manage"),async(req,res)=>{
  try{
    if(!storage)return void res.status(503).json({error:"Firebase Storage is unavailable",code:"MEDIA_STORAGE_UNAVAILABLE"});
    const name=text(req.body?.name,200); const assetType=text(req.body?.type,80); const mimeType=text(req.body?.mimeType,100); const byteSize=Number(req.body?.byteSize);
    if(!name||!ALLOWED_TYPES.has(assetType)||!ALLOWED_MIME.has(mimeType)||!Number.isFinite(byteSize)||byteSize<=0||byteSize>MAX_BYTES)return void res.status(400).json({error:"Invalid media upload",code:"MEDIA_UPLOAD_INVALID"});
    const objectPath="media/"+new Date().toISOString().slice(0,10)+"/"+randomUUID()+"-"+safeName(name);
    const bucket=storage.bucket();
    const signed=await bucket.file(objectPath).getSignedUrl({version:"v4",action:"write",expires:Date.now()+15*60*1000,contentType:mimeType});
    res.json({objectPath,uploadUrl:signed[0],expiresInSeconds:900});
  }catch(error){console.error("Unable to create media upload intent",error);res.status(500).json({error:"Unable to prepare upload",code:"MEDIA_UPLOAD_INTENT_FAILED"});}
});

router.post("/finalize",requireAdminPermission("content.taxonomy.manage"),async(req,res)=>{
  try{
    if(!storage)return void res.status(503).json({error:"Firebase Storage is unavailable",code:"MEDIA_STORAGE_UNAVAILABLE"});
    const objectPath=text(req.body?.objectPath,600); const name=text(req.body?.name,200); const assetType=text(req.body?.type,80); const mimeType=text(req.body?.mimeType,100); const byteSize=Number(req.body?.byteSize);
    const width=Number(req.body?.width)||null; const height=Number(req.body?.height)||null;
    if(!objectPath.startsWith("media/")||!name||!ALLOWED_TYPES.has(assetType)||!ALLOWED_MIME.has(mimeType)||!Number.isFinite(byteSize)||byteSize<=0||byteSize>MAX_BYTES)return void res.status(400).json({error:"Invalid media metadata",code:"MEDIA_FINALIZE_INVALID"});
    const bucket=storage.bucket(); const file=bucket.file(objectPath); const exists=await file.exists();
    if(!exists[0])return void res.status(409).json({error:"Uploaded object was not found",code:"MEDIA_OBJECT_MISSING"});
    const meta=(await file.getMetadata())[0]; if(Number(meta.size||0)!==byteSize)return void res.status(409).json({error:"Uploaded file size does not match",code:"MEDIA_SIZE_MISMATCH"});
    const token=randomUUID(); await file.setMetadata({metadata:{firebaseStorageDownloadTokens:token},contentType:mimeType,cacheControl:"public,max-age=31536000,immutable"});
    const url="https://firebasestorage.googleapis.com/v0/b/"+encodeURIComponent(bucket.name)+"/o/"+encodeURIComponent(objectPath)+"?alt=media&token="+token;
    const id=randomUUID(); const actor=req.adminSession!.user.id;
    await sqlClient.begin(async tx=>{
      await tx`INSERT INTO platform.media_assets (id,name,asset_type,mime_type,byte_size,width_px,height_px,storage_path,download_url,status,created_by) VALUES (${id}::uuid,${name},${assetType},${mimeType},${byteSize},${width},${height},${objectPath},${url},'active',${actor}::uuid)`;
      await tx`INSERT INTO platform.audit_events (id,actor_type,actor_user_id,action_key,entity_type,entity_id,summary,reason,metadata) VALUES (${randomUUID()}::uuid,'user'::audit_actor_type,${actor}::uuid,'media.asset.created','media_asset',${id}::uuid,'Uploaded media asset','Admin uploaded media asset',${tx.json({name,assetType,objectPath,byteSize})})`;
    });
    res.status(201).json({asset:{id,name,type:assetType,mimeType,byteSize,width,height,storagePath:objectPath,url,status:"active"}});
  }catch(error){console.error("Unable to finalize media asset",error);res.status(500).json({error:"Unable to finalize media asset",code:"MEDIA_FINALIZE_FAILED"});}
});

router.patch("/:id",requireAdminPermission("content.taxonomy.manage"),async(req,res)=>{
  try{
    const id=text(req.params.id,80); const status=text(req.body?.status,20);
    if(!/^[0-9a-f-]{36}$/i.test(id)||!["active","archived"].includes(status))return void res.status(400).json({error:"Invalid media update",code:"MEDIA_UPDATE_INVALID"});
    const rows=await sqlClient`UPDATE platform.media_assets SET status=${status},updated_at=now() WHERE id=${id}::uuid RETURNING id::text`;
    if(rows.length===0)return void res.status(404).json({error:"Media asset not found",code:"MEDIA_NOT_FOUND"});
    res.json({id,status});
  }catch(error){console.error("Unable to update media asset",error);res.status(500).json({error:"Unable to update media asset",code:"MEDIA_UPDATE_FAILED"});}
});

export default router;