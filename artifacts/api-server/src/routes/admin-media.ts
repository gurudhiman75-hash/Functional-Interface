import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { storage } from "../lib/firebase-admin";
import { authenticate } from "../middlewares/auth";

const router = Router();
const ALLOWED_TYPES = new Set([
  "Question Image","DI Chart","Passage Image","Package Banner","Exam Icon",
  "Notification Image","Home Banner","Home Icon","Promotion Image",
]);
const ALLOWED_MIME = new Set(["image/png","image/jpeg","image/webp","image/svg+xml"]);
const MAX_BYTES = 10 * 1024 * 1024;

function text(value: unknown, max=500){return typeof value==="string"?value.trim().slice(0,max):"";}
function safeName(value:string){return value.replace(/[^a-zA-Z0-9._-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,120)||"asset";}

let schemaPromise:Promise<void>|null=null;
function ensureMediaSchema(){
  schemaPromise??=(async()=>{
    await sqlClient`CREATE TABLE IF NOT EXISTS platform.media_assets (
      id uuid PRIMARY KEY,
      name text NOT NULL,
      asset_type text NOT NULL,
      mime_type text NOT NULL,
      byte_size bigint NOT NULL CHECK (byte_size >= 0),
      width_px integer NULL CHECK (width_px IS NULL OR width_px > 0),
      height_px integer NULL CHECK (height_px IS NULL OR height_px > 0),
      storage_path text NOT NULL UNIQUE,
      download_url text NOT NULL,
      status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','archived')),
      created_by uuid NULL REFERENCES identity.users(id) ON DELETE SET NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )`;
    await sqlClient`CREATE INDEX IF NOT EXISTS media_assets_status_type_idx ON platform.media_assets (status, asset_type, created_at DESC)`;
  })();
  return schemaPromise;
}

router.use(authenticate);

router.get("/", requireAdminPermission("content.taxonomy.read"), async (req,res)=>{
  try{
    await ensureMediaSchema();
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

router.post("/upload",requireAdminPermission("content.taxonomy.manage"),async(req,res)=>{
  let uploadedPath="";
  try{
    await ensureMediaSchema();
    if(!storage)return void res.status(503).json({error:"Firebase Storage is unavailable",code:"MEDIA_STORAGE_UNAVAILABLE"});
    const name=text(req.body?.name,200);
    const assetType=text(req.body?.type,80);
    const mimeType=text(req.body?.mimeType,100);
    const byteSize=Number(req.body?.byteSize);
    const width=Number(req.body?.width)||null;
    const height=Number(req.body?.height)||null;
    const dataBase64=text(req.body?.dataBase64,20*1024*1024);
    if(!name||!ALLOWED_TYPES.has(assetType)||!ALLOWED_MIME.has(mimeType)||!Number.isFinite(byteSize)||byteSize<=0||byteSize>MAX_BYTES||!dataBase64){
      return void res.status(400).json({error:"Invalid media upload",code:"MEDIA_UPLOAD_INVALID"});
    }
    let bytes:Buffer;
    try{bytes=Buffer.from(dataBase64,"base64");}catch{return void res.status(400).json({error:"Invalid image payload",code:"MEDIA_PAYLOAD_INVALID"});}
    if(bytes.length!==byteSize)return void res.status(400).json({error:"Image payload size does not match",code:"MEDIA_SIZE_MISMATCH"});

    const bucket=storage.bucket();
    uploadedPath="media/"+new Date().toISOString().slice(0,10)+"/"+randomUUID()+"-"+safeName(name);
    const token=randomUUID();
    await bucket.file(uploadedPath).save(bytes,{
      resumable:false,
      contentType:mimeType,
      metadata:{cacheControl:"public,max-age=31536000,immutable",metadata:{firebaseStorageDownloadTokens:token}},
    });
    const url="https://firebasestorage.googleapis.com/v0/b/"+encodeURIComponent(bucket.name)+"/o/"+encodeURIComponent(uploadedPath)+"?alt=media&token="+token;
    const id=randomUUID();
    const actor=req.adminSession!.user.id;
    await sqlClient.begin(async tx=>{
      await tx`INSERT INTO platform.media_assets
        (id,name,asset_type,mime_type,byte_size,width_px,height_px,storage_path,download_url,status,created_by)
        VALUES (${id}::uuid,${name},${assetType},${mimeType},${byteSize},${width},${height},${uploadedPath},${url},'active',${actor}::uuid)`;
      await tx`INSERT INTO platform.audit_events
        (id,actor_type,actor_user_id,action_key,entity_type,entity_id,summary,reason,metadata)
        VALUES (${randomUUID()}::uuid,'user'::audit_actor_type,${actor}::uuid,'media.asset.created','media_asset',${id}::uuid,'Uploaded media asset','Admin uploaded media asset',${tx.json({name,assetType,storagePath:uploadedPath,byteSize})})`;
    });
    res.status(201).json({asset:{id,name,type:assetType,mimeType,byteSize,width,height,storagePath:uploadedPath,url,status:"active",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),uploadedBy:"Current admin"}});
  }catch(error){
    if(uploadedPath&&storage){try{await storage.bucket().file(uploadedPath).delete({ignoreNotFound:true});}catch{}}
    console.error("Unable to upload media asset",error);
    res.status(500).json({error:"Unable to upload media asset",code:"MEDIA_UPLOAD_FAILED"});
  }
});

router.patch("/:id",requireAdminPermission("content.taxonomy.manage"),async(req,res)=>{
  try{
    await ensureMediaSchema();
    const id=text(req.params.id,80);
    const status=text(req.body?.status,20);
    if(!/^[0-9a-f-]{36}$/i.test(id)||!["active","archived"].includes(status))return void res.status(400).json({error:"Invalid media update",code:"MEDIA_UPDATE_INVALID"});
    const rows=await sqlClient`UPDATE platform.media_assets SET status=${status},updated_at=now() WHERE id=${id}::uuid RETURNING id::text`;
    if(rows.length===0)return void res.status(404).json({error:"Media asset not found",code:"MEDIA_NOT_FOUND"});
    res.json({id,status});
  }catch(error){console.error("Unable to update media asset",error);res.status(500).json({error:"Unable to update media asset",code:"MEDIA_UPDATE_FAILED"});}
});

export default router;
