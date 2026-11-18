import { createHash, randomUUID } from "node:crypto";
import { Router } from "express";
import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();
router.use(authenticate);

function normalize(value: string): string {
  return value.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9\u0a00-\u0a7f\u0900-\u097f]+/g, " ").trim().replace(/\s+/g, " ");
}

function subjectLabel(engine: string, declared: string | undefined, topic: string): string {
  const value = normalize(declared ?? "");
  if (value === "quant" || value === "quantitative aptitude" || value === "mathematics") return "Quantitative Aptitude";
  if (value === "reasoning" || value === "reasoning ability") return "Reasoning Ability";
  if (value === "english" || value === "english language") return "English Language";
  if (value === "punjabi" || value === "punjabi language") return "Punjabi Language";
  if (value === "general knowledge" || value === "general awareness" || value === "gk") return "General Awareness";
  if (declared?.trim()) return declared.trim();
  if (engine === "quant-v4") return "Quantitative Aptitude";
  if (engine === "reasoning-v1") return "Reasoning Ability";
  if (engine === "knowledge-v1") return "General Awareness";
  if (engine === "language-v1") return normalize(topic).includes("punjabi") ? "Punjabi Language" : "English Language";
  return "";
}

// The catalog name column is varchar(180). Some Studio metadata contains long
// descriptions rather than human-sized chapter names. Preserve full text in
// description, while deriving a stable, unique display label for the picker.
const MAX_TAXONOMY_NAME = 180;
function catalogName(raw: string): string {
  const name = raw.trim();
  if (Array.from(name).length <= MAX_TAXONOMY_NAME) return name;
  const hash = createHash("sha256").update(name).digest("hex").slice(0, 12);
  const suffix = `… [${hash}]`;
  return Array.from(name).slice(0, MAX_TAXONOMY_NAME - Array.from(suffix).length).join("").trimEnd() + suffix;
}

interface NodeRow { id: string; code: string; name: string; nodeType: string }
interface EdgeRow { parentId: string; childId: string }

router.post("/taxonomy/sync-studio", requireAdminPermission("content.taxonomy.manage"), async (req, res) => {
  const actorUserId = req.adminSession?.user.id;
  if (!actorUserId) { res.status(403).json({ code: "ADMIN_SESSION_REQUIRED" }); return; }
  if (req.body?.confirm !== true) {
    res.status(400).json({ code: "CONFIRM_REQUIRED", error: "Explicit confirmation is required to import Studio taxonomy." });
    return;
  }

  try {
    // Load the same registry Question Studio uses when selecting a package.
    const { listQuestionStudioPackages } = await import("../question-studio/engine-registry");
    const packages = listQuestionStudioPackages().filter((pkg) => pkg.enabled);
    const result = await sqlClient.begin(async (tx) => {
      // Concurrent syncs must not create duplicate semantic nodes.
      await tx`SELECT pg_advisory_xact_lock(3601, 3610)`;
      const nodeRows = await tx`
        SELECT id::text AS id, code, name, node_type AS "nodeType"
        FROM catalog.taxonomy_nodes
        WHERE is_active = true AND deleted_at IS NULL
        ORDER BY name, id
      ` as unknown as NodeRow[];
      const edgeRows = await tx`
        SELECT parent_id::text AS "parentId", child_id::text AS "childId" FROM catalog.taxonomy_edges
      ` as unknown as EdgeRow[];
      const nodes = [...nodeRows];
      const edges = new Set(edgeRows.map((edge) => `${edge.parentId}:${edge.childId}`));
      const created = { subjects: 0, sections: 0, topics: 0, edges: 0, packages: 0 };

      async function ensureEdge(parentId: string, childId: string) {
        const key = `${parentId}:${childId}`;
        if (edges.has(key)) return;
        await tx`INSERT INTO catalog.taxonomy_edges (parent_id, child_id, sort_order)
          VALUES (${parentId}::uuid, ${childId}::uuid, 0) ON CONFLICT DO NOTHING`;
        edges.add(key);
        created.edges++;
      }

      async function ensureNode(type: "subject" | "section" | "topic", name: string, parentId: string | null, alternateParentId?: string) {
        const displayName = catalogName(name);
        const normalized = normalize(displayName);
        if (!normalized) throw Error("Empty Question Studio taxonomy label");
        const matches = nodes.filter((node) => node.nodeType === type && normalize(node.name) === normalized);
        const underParent = matches.filter((node) =>
          parentId === null || edges.has(`${parentId}:${node.id}`) ||
          (alternateParentId && edges.has(`${alternateParentId}:${node.id}`)));
        if (underParent.length > 1) throw Error(`Ambiguous catalog ${type}: ${name}`);
        let node = underParent[0];
        if (!node) {
          const key = `${type}:${parentId ?? ""}:${normalized}`;
          const code = "QS_" + createHash("sha256").update(key).digest("hex").slice(0, 22).toUpperCase();
          const codeMatches = nodes.filter((entry) => entry.code === code);
          if (codeMatches.length) throw Error(`Conflicting Studio taxonomy code ${code}`);
          node = { id: randomUUID(), code, name: displayName, nodeType: type };
          const fullDescription = displayName === name.trim() ? null : name.trim();
          await tx`INSERT INTO catalog.taxonomy_nodes (id, code, node_type, name, description, is_active)
            VALUES (${node.id}::uuid, ${code}, ${type}, ${node.name}, ${fullDescription}, true)`;
          nodes.push(node);
          if (type === "subject") created.subjects++;
          else if (type === "section") created.sections++;
          else created.topics++;
        }
        if (parentId) await ensureEdge(parentId, node.id);
        return node;
      }

      for (const pkg of packages) {
        const subject = subjectLabel(pkg.engineId, pkg.subject, pkg.topic);
        const section = pkg.topic?.trim() ?? "";
        const topic = (pkg.subtopic || pkg.topic)?.trim() ?? "";
        if (!subject || !topic) continue;
        const subjectNode = await ensureNode("subject", subject, null);
        if (section && normalize(section) !== normalize(topic)) {
          const sectionNode = await ensureNode("section", section, subjectNode.id);
          await ensureNode("topic", topic, sectionNode.id, subjectNode.id);
        } else {
          await ensureNode("topic", topic, subjectNode.id);
        }
        created.packages++;
      }
      await tx`
        INSERT INTO platform.audit_events
          (id, actor_type, actor_user_id, action_key, entity_type, entity_id, reason, summary, metadata)
        VALUES
          (${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
           'content.taxonomy.studio_synced', 'taxonomy_node', ${nodes[0]?.id ?? randomUUID()}::uuid,
           'Explicit administrator Question Studio taxonomy synchronization',
           'Imported active Question Studio subject/section/topic catalog options',
           ${tx.json(created)})
      `;
      return created;
    });
    res.json({ success: true, ...result });
  } catch (error) {
    console.error("Question Studio taxonomy sync failed", error);
    res.status(500).json({ code: "STUDIO_TAXONOMY_SYNC_FAILED", error: "Unable to synchronize Studio taxonomy. No partial catalog changes were committed." });
  }
});

export default router;
