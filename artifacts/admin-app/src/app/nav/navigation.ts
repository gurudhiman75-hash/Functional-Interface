import {
  Activity, BarChart3, Bell, Box, CalendarClock, ClipboardCheck, FileQuestion,
  FileText, HeartPulse, Image as ImageIcon, KeyRound, Languages, LayoutDashboard,
  Layers, LifeBuoy, ListChecks, Lock, Network, Palette, Plug, ScrollText, Settings,
  ShieldCheck, ShoppingCart, Sparkles, Target, Ticket, TrendingUp, Users,
  type LucideIcon,
} from 'lucide-react';

export type AdminWorkspaceStatus = 'live' | 'in_progress' | 'planned';

export const WORKSPACE_STATUS_LABELS: Record<AdminWorkspaceStatus, string> = {
  live: 'Live',
  in_progress: 'In progress',
  planned: 'Planned',
};

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  status: AdminWorkspaceStatus;
  permission?: string;
  summary: string;
  milestone?: string;
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'overview', label: 'Overview', items: [
      { label: 'Launchpad', path: '/dashboard', icon: LayoutDashboard, status: 'live', summary: 'Canonical command centre for the production admin workflows that are currently available.' },
    ],
  },
  {
    id: 'content', label: 'Content', items: [
      { label: 'Question Studio', path: '/content/questions/generate', icon: Sparkles, status: 'live', permission: 'content.generation.read', summary: 'Generate, inspect, revise, regenerate, approve and convert questions through immutable review workflows.' },
      { label: 'Question Bank', path: '/content/questions', icon: FileQuestion, status: 'live', summary: 'Canonical question search, editing, lifecycle management and test-usage workspace.' },
      { label: 'Content Review', path: '/content/review', icon: ClipboardCheck, status: 'in_progress', summary: 'A dedicated reviewer queue spanning generated and manually authored questions.', milestone: 'Reviewer assignment, comments, saved queues and SLA tracking.' },
      { label: 'Coverage Planner', path: '/content/coverage', icon: Target, status: 'live', permission: 'content.taxonomy.read', summary: 'Plan exam-version targets and measure canonical Question Bank readiness across the taxonomy hierarchy.' },
      { label: 'Sections & Topics', path: '/content/taxonomy', icon: Network, status: 'live', permission: 'content.taxonomy.read', summary: 'Manage canonical taxonomy nodes, parent edges, exam-version mappings and activation state.' },
      { label: 'DI & Passage Sets', path: '/content/sets', icon: Layers, status: 'planned', summary: 'Create shared passages, data sets and grouped questions with reusable source material.', milestone: 'Passage/set schema, media references and grouped-question delivery.' },
      { label: 'Media Library', path: '/content/media', icon: ImageIcon, status: 'planned', summary: 'Upload, validate and reuse diagrams, charts, tables and question media.', milestone: 'Canonical object storage, transformations and usage tracking.' },
    ],
  },
  {
    id: 'tests', label: 'Tests', items: [
      { label: 'Tests', path: '/tests', icon: FileText, status: 'live', summary: 'Canonical test inventory, lifecycle and publication workspace.' },
      { label: 'Test Builder', path: '/tests/builder', icon: ListChecks, status: 'live', summary: 'Compose test sections and questions, validate totals and publish student-ready tests.' },
      { label: 'Test QA', path: '/tests/qa', icon: ClipboardCheck, status: 'in_progress', summary: 'Structured pre-publication QA, preview and reviewer sign-off.', milestone: 'QA checklist, issue resolution and publish gate.' },
      { label: 'Test Series', path: '/tests/series', icon: Box, status: 'in_progress', summary: 'Organise tests into exam-oriented series with ordering and availability rules.', milestone: 'Series CRUD and canonical test membership.' },
      { label: 'Exam Blueprints', path: '/tests/blueprints', icon: CalendarClock, status: 'in_progress', summary: 'Define section, marks, difficulty and taxonomy targets for repeatable test creation.', milestone: 'Blueprint validation and assisted test generation.' },
      { label: 'Publishing Calendar', path: '/tests/calendar', icon: CalendarClock, status: 'planned', summary: 'Schedule releases, expiry, embargoes and campaign-aligned test publication.', milestone: 'Scheduled publication worker and calendar operations.' },
    ],
  },
  {
    id: 'commerce', label: 'Commerce', items: [
      { label: 'Packages', path: '/commerce/packages', icon: Box, status: 'planned', summary: 'Create paid and free offerings and map canonical tests to sellable packages.', milestone: 'Package catalogue, pricing and test entitlement mapping.' },
      { label: 'Orders & Payments', path: '/commerce/orders', icon: ShoppingCart, status: 'planned', summary: 'Reconcile orders, payments, refunds and payment-provider events.', milestone: 'Razorpay verification, order ledger and refund workflow.' },
      { label: 'Coupons', path: '/commerce/coupons', icon: Ticket, status: 'planned', summary: 'Configure discount codes, usage limits and campaign windows.', milestone: 'Canonical promotion rules and redemption audit.' },
      { label: 'Entitlements', path: '/commerce/entitlements', icon: KeyRound, status: 'planned', summary: 'Inspect and manage the products and tests each student can access.', milestone: 'Server-enforced entitlement engine and administrative overrides.' },
    ],
  },
  {
    id: 'users', label: 'Users', items: [
      { label: 'Students', path: '/users/students', icon: Users, status: 'in_progress', summary: 'Search student identities, attempts, access state and account history.', milestone: 'Canonical student profile and attempt-detail APIs.' },
      { label: 'Admin Team', path: '/users/team', icon: ShieldCheck, status: 'in_progress', summary: 'Manage administrators, role membership and operational ownership.', milestone: 'Admin invitations and granular canonical RBAC management.' },
      { label: 'Support Requests', path: '/users/support', icon: LifeBuoy, status: 'planned', summary: 'Triage student support tickets with assignment, status and resolution history.', milestone: 'Support ticket ingestion and workflow APIs.' },
      { label: 'Notifications', path: '/users/notifications', icon: Bell, status: 'planned', summary: 'Compose and target operational, product and exam notifications.', milestone: 'Template, audience, delivery and engagement tracking.' },
    ],
  },
  {
    id: 'analytics', label: 'Analytics', items: [
      { label: 'Business Analytics', path: '/analytics/business', icon: TrendingUp, status: 'planned', summary: 'Revenue, conversion, retention and product performance reporting.', milestone: 'Commerce and entitlement data must be canonical first.' },
      { label: 'Test Analytics', path: '/analytics/tests', icon: BarChart3, status: 'in_progress', summary: 'Attempt volume, score distribution, completion and section-level performance.', milestone: 'Canonical attempt aggregation and percentile pipeline.' },
      { label: 'Question Analytics', path: '/analytics/questions', icon: BarChart3, status: 'in_progress', summary: 'Accuracy, discrimination, option selection and timing for each question version.', milestone: 'Question-version response aggregation and anomaly detection.' },
      { label: 'Content Quality', path: '/analytics/content-quality', icon: Activity, status: 'in_progress', summary: 'Monitor review throughput, quality blockers, duplicates and chapter readiness.', milestone: 'Question Studio and Question Bank quality metrics API.' },
      { label: 'System Health', path: '/analytics/system-health', icon: HeartPulse, status: 'in_progress', summary: 'Operational visibility into API, database, generation and publication failures.', milestone: 'Health checks, error events and latency telemetry.' },
    ],
  },
  {
    id: 'settings', label: 'Settings', items: [
      { label: 'Exam Configuration', path: '/settings/exam-config', icon: Settings, status: 'in_progress', summary: 'Configure supported exams, scoring rules and operational defaults.', milestone: 'Canonical exam-version management UI.' },
      { label: 'Languages', path: '/settings/languages', icon: Languages, status: 'in_progress', summary: 'Manage language availability, translation readiness and terminology standards.', milestone: 'Translation workflow and per-language publication gates.' },
      { label: 'Roles & Permissions', path: '/settings/roles', icon: Lock, status: 'in_progress', summary: 'Inspect and manage canonical administrative roles and permissions.', milestone: 'Safe role editor, assignment workflow and protected permissions.' },
      { label: 'Branding', path: '/settings/branding', icon: Palette, status: 'planned', summary: 'Control platform identity, visual assets and communication branding.', milestone: 'Canonical tenant branding configuration.' },
      { label: 'Audit Logs', path: '/settings/audit-logs', icon: ScrollText, status: 'in_progress', summary: 'Search immutable administrative and system actions across canonical entities.', milestone: 'Audit-event query API with entity and actor filters.' },
      { label: 'Integrations', path: '/settings/integrations', icon: Plug, status: 'planned', summary: 'Configure approved external providers and inspect integration health.', milestone: 'Secret-safe provider configuration and webhook observability.' },
    ],
  },
];

export const NAV_LOOKUP: Record<string, NavItem> = Object.fromEntries(
  NAV_GROUPS.flatMap((group) => group.items.map((item) => [item.path, item])),
);

export const ADMIN_WORKSPACE_COUNTS = NAV_GROUPS
  .flatMap((group) => group.items)
  .reduce<Record<AdminWorkspaceStatus, number>>(
    (counts, item) => ({ ...counts, [item.status]: counts[item.status] + 1 }),
    { live: 0, in_progress: 0, planned: 0 },
  );
