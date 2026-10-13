// Cloud Tasks transport for durable Question Studio outbox events.
// Strict configuration and small OIDC-authenticated run-id-only task payloads.
// No Firebase ID token, full question content, DB URL or worker shared secret
// is ever placed in a Cloud Task body.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TOKEN_URL = "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token";

export type QuestionStudioTaskConfig = {
  projectId: string;
  region: string;
  queueId: string;
  handlerUrl: string;
  audience: string;
  serviceAccount: string;
};

export type QuestionStudioTaskEvent = {
  eventId: string;
  runId: string;
};

export class QuestionStudioTaskTransportError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message);
    this.name = "QuestionStudioTaskTransportError";
  }
}

export function getQuestionStudioTaskConfig(env: Record<string,string|undefined> = process.env): QuestionStudioTaskConfig {
  const projectId = env.EXAMTREE_QUESTION_STUDIO_TASK_PROJECT?.trim() ?? "";
  const region = env.EXAMTREE_QUESTION_STUDIO_TASK_REGION?.trim() ?? "";
  const queueId = env.EXAMTREE_QUESTION_STUDIO_TASK_QUEUE?.trim() ?? "";
  const handlerUrl = env.EXAMTREE_QUESTION_STUDIO_TASK_HANDLER_URL?.trim() ?? "";
  const audience = env.EXAMTREE_QUESTION_STUDIO_TASK_AUDIENCE?.trim() ?? "";
  const serviceAccount = env.EXAMTREE_QUESTION_STUDIO_TASK_SERVICE_ACCOUNT?.trim() ?? "";
  if (!/^[a-z][a-z0-9-]{4,61}[a-z0-9]$/.test(projectId) ||
      !/^[a-z]+(?:-[a-z0-9]+)+$/.test(region) ||
      !/^[a-zA-Z][a-zA-Z0-9_-]{0,99}$/.test(queueId) ||
      !/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+\.iam\.gserviceaccount\.com$/.test(serviceAccount)) {
    throw new QuestionStudioTaskTransportError("TASK_CONFIGURATION_INVALID", "Cloud Tasks project/queue/identity settings are incomplete");
  }
  let endpoint: URL;
  let expectedAudience: URL;
  try {
    endpoint = new URL(handlerUrl);
    expectedAudience = new URL(audience);
  } catch {
    throw new QuestionStudioTaskTransportError("TASK_URL_INVALID", "Invalid Cloud Tasks handler URL or audience");
  }
  if (endpoint.protocol !== "https:" || expectedAudience.protocol !== "https:" ||
      !endpoint.hostname.endsWith(".run.app") ||
      endpoint.pathname !== "/internal/question-studio/async-task" ||
      endpoint.search || endpoint.hash || endpoint.username || endpoint.password ||
      expectedAudience.origin !== endpoint.origin ||
      expectedAudience.pathname !== "/" || expectedAudience.search || expectedAudience.hash ||
      expectedAudience.username || expectedAudience.password) {
    throw new QuestionStudioTaskTransportError("TASK_URL_INVALID", "Cloud Tasks destination must use the configured Cloud Run internal receiver");
  }
  return { projectId, region, queueId, handlerUrl: endpoint.toString(), audience: expectedAudience.origin, serviceAccount };
}

export function createQuestionStudioTask(event: QuestionStudioTaskEvent, config: QuestionStudioTaskConfig) {
  if (!UUID.test(event.eventId) || !UUID.test(event.runId)) {
    throw new QuestionStudioTaskTransportError("TASK_EVENT_INVALID", "Outbox and run UUIDs are required");
  }
  const parent = `projects/${config.projectId}/locations/${config.region}/queues/${config.queueId}`;
  // Idempotent Cloud Tasks name across outbox replays. Cloud Tasks can return
  // ALREADY_EXISTS after the task was created but before Neon ack committed.
  const name = `${parent}/tasks/qs-${event.eventId.replaceAll("-", "").toLowerCase()}`;
  const body = Buffer.from(JSON.stringify({runId:event.runId,queueVersion:1})).toString("base64");
  return {
    parent,
    task: {
      name,
      httpRequest: {
        httpMethod: "POST" as const,
        url: config.handlerUrl,
        headers: {"Content-Type":"application/json"},
        body,
        oidcToken: {
          serviceAccountEmail: config.serviceAccount,
          audience: config.audience,
        },
      },
      dispatchDeadline: "180s",
    },
  };
}

export type CloudTasksDeliveryResult = {taskName:string; alreadyExists:boolean};

// Only callable by the explicitly gated dispatcher after Cloud Tasks,
// IAM and receiver have been independently verified.
export async function deliverQuestionStudioCloudTask(
  event: QuestionStudioTaskEvent,
  config: QuestionStudioTaskConfig,
  request: typeof fetch = fetch,
): Promise<CloudTasksDeliveryResult> {
  const { parent, task } = createQuestionStudioTask(event, config);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);
  try {
    const metadata = await request(TOKEN_URL, {
      headers: {"Metadata-Flavor":"Google"},
      signal: controller.signal,
    });
    if (!metadata.ok) throw new QuestionStudioTaskTransportError("TASK_AUTH_UNAVAILABLE", "Cloud Run metadata credentials unavailable");
    const tokenPayload = await metadata.json() as {access_token?:unknown};
    const token = tokenPayload.access_token;
    if (typeof token !== "string" || token.length < 32) {
      throw new QuestionStudioTaskTransportError("TASK_AUTH_UNAVAILABLE", "No valid Cloud Run access token");
    }
    const response = await request(
      `https://cloudtasks.googleapis.com/v2/${parent}/tasks`,
      {
        method:"POST",
        headers:{"Authorization":`Bearer ${token}`,"Content-Type":"application/json"},
        body:JSON.stringify({task}),
        signal:controller.signal,
      },
    );
    if (response.status === 409) {
      return {taskName:task.name,alreadyExists:true};
    }
    if (!response.ok) {
      // Do not log Google API bodies: they can echo credentials/URLs.
      throw new QuestionStudioTaskTransportError("TASK_CREATE_FAILED", `Cloud Tasks rejected task creation (HTTP ${response.status})`);
    }
    return {taskName:task.name,alreadyExists:false};
  } catch(error) {
    if (controller.signal.aborted) {
      throw new QuestionStudioTaskTransportError("TASK_CREATE_TIMEOUT", "Cloud Tasks request exceeded 12 seconds");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
