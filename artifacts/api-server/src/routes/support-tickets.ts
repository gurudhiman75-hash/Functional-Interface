import { createHash, randomUUID } from "node:crypto";
import { Router } from "express";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import { requireAdminPermission } from "../lib/admin-rbac";

const router = Router();
const categories = new Set(["Mock test access","Payment or refund","Wrong answer or ambiguity","Punjabi / Hindi translation issue","Technical support","Other"]);
const states = new Set(["open","in_progress","resolved","closed"]);
const idPattern = /^[0-9a-f-]{36}$/i;
const text = (input: unknown, max: number) => typeof input === "string" ? input.trim().slice(0,max+1) : "";
const enabled = () => process.env.EXAMTREE_SUPPORT_TICKETS_ENABLED === "true";

// Public form: no unauthenticated read or update APIs.
router.post("/", async (req,res) => {
  if (!enabled()) return void res.status(503).json({error:"Direct support submissions are not available yet. Please email support@examtree.in.",code:"SUPPORT_TICKETS_DISABLED"});
  if (text(req.body?.website,500)) return void res.status(400).json({error:"Unable to submit request",code:"SUPPORT_INVALID"});
  const name=text(req.body?.name,120);
  const email=text(req.body?.email,254).toLowerCase();
  const category=text(req.body?.category,100);
  const message=text(req.body?.message,5000);
  if (name.length<2 || name.length>120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length>254 || !categories.has(category) || message.length<12 || message.length>5000) {
    return void res.status(400).json({error:"Please provide a valid name, email, category and message (at least 12 characters).",code:"SUPPORT_INVALID"});
  }
  // Cloudflare proxy requests may provide CF-Connecting-IP; trust only if the proxy itself is trusted.
  // Use the Express remote address as a conservative baseline; hash before persistence.
  const ip = String(req.socket.remoteAddress ?? "unknown");
  const senderHash = createHash("sha256").update(ip + ":" + (process.env.EXAMTREE_SUPPORT_RATE_SALT || "examtree-support")).digest("hex");
  try {
    const result = await sqlClient.begin(async tx => {
      // Serialize per-sender inserts so concurrent requests cannot bypass the hourly limit.
      await tx`SELECT pg_advisory_xact_lock(hashtext(${senderHash}))`;
      const rate = await tx`SELECT count(*)::integer AS count FROM platform.support_tickets WHERE (sender_hash=${senderHash} OR email=${email}) AND created_at > now()-interval '1 hour'`;
      if (Number(rate[0]?.count||0)>=5) return null;
      const id=randomUUID();
      await tx`INSERT INTO platform.support_tickets (id,name,email,category,message,status,sender_hash,created_at,updated_at) VALUES (${id}::uuid,${name},${email},${category},${message},'open',${senderHash},now(),now())`;
      return id;
    });
    if (!result) return void res.status(429).json({error:"Too many requests. Please email support@examtree.in if urgent.",code:"SUPPORT_RATE_LIMIT"});
    res.status(201).json({id:result,status:"open",message:"Your support request has been received."});
  } catch(error) {
    console.error("Support ticket write failed",error);
    res.status(503).json({error:"Unable to submit right now. Please email support@examtree.in.",code:"SUPPORT_UNAVAILABLE"});
  }
});

const admin = Router();
admin.use(authenticate);
admin.get("/", requireAdminPermission("users.students.read"), async(req,res)=>{
  if(!enabled())return void res.status(503).json({error:"Support ticket workflow is not enabled",code:"SUPPORT_TICKETS_DISABLED"});
  const state=text(req.query.status,30);
  if (state && !states.has(state))return void res.status(400).json({error:"Invalid status"});
  const page=Math.max(1,Math.min(10000,Number(req.query.page)||1));
  try {
    const rows=await sqlClient`SELECT id::text,name,email,category,message,status,admin_note AS "adminNote",created_at AS "createdAt",updated_at AS "updatedAt" FROM platform.support_tickets WHERE (${state}='' OR status=${state}) ORDER BY created_at DESC LIMIT 25 OFFSET ${(page-1)*25}`;
    res.json({tickets:rows,page});
  }catch(error){console.error("Support ticket list failed",error);res.status(503).json({error:"Unable to load support requests"});}
});
admin.patch("/:id", requireAdminPermission("users.students.manage"),async(req,res)=>{
  if(!enabled())return void res.status(503).json({error:"Support ticket workflow is not enabled"});
  const id=text(req.params.id,60), status=text(req.body?.status,30),note=text(req.body?.note,2000);
  if(!idPattern.test(id)||!states.has(status)||note.length>2000)return void res.status(400).json({error:"Invalid ticket update"});
  try{
    const rows=await sqlClient`UPDATE platform.support_tickets SET status=${status},admin_note=${note},updated_at=now() WHERE id=${id}::uuid RETURNING id::text,status`;
    if(!rows.length)return void res.status(404).json({error:"Ticket not found"});
    res.json({ticket:rows[0]});
  }catch(error){console.error("Support ticket update failed",error);res.status(503).json({error:"Unable to update ticket"});}
});
export { admin };
export default router;
