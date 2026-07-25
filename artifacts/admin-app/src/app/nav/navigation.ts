import {
  Activity, AlertTriangle, BarChart3, Bell, Box, CalendarClock, ClipboardCheck, ClipboardList, FileQuestion,
  FileText, HeartPulse, Image as ImageIcon, KeyRound, Languages, LayoutDashboard,
  Layers, LifeBuoy, ListChecks, Lock, Network, Palette, Plug, ScrollText, Settings,
  ShieldCheck, ShoppingCart, Sparkles, Target, Ticket, TrendingUp, Users,
  type LucideIcon,
} from 'lucide-react';

export type AdminWorkspaceStatus = 'live' | 'in_progress' | 'planned';
export const WORKSPACE_STATUS_LABELS: Record<AdminWorkspaceStatus, string> = { live: 'Live', in_progress: 'In progress', planned: 'Planned' };
export interface NavItem { label: string; path: string; icon: LucideIcon; status: AdminWorkspaceStatus; permission?: string; summary: string; milestone?: string; }
export interface NavGroup { id: string; label: string; items: NavItem[]; }

export const NAV_GROUPS: NavGroup[] = [
  { id: 'overview', label: 'Overview', items: [
    { label: 'Launchpad', path: '/dashboard', icon: LayoutDashboard, status: 'live', summary: 'Canonical command centre for the production admin workflows that are currently available.' },
  ] },
  { id: 'content', label: 'Content', items: [
    { label: 'Question Studio', path: '/content/questions/generate', icon: Sparkles, status: 'live', permission: 'content.generation.read', summary: 'Generate, inspect, revise, regenerate, approve and convert questions through immutable review workflows.' },
    { label: 'Question Bank', path: '/content/questions', icon: FileQuestion, status: 'live', summary: 'Canonical question search, editing, lifecycle management and test-usage workspace.' },
    { label: 'Content Review', path: '/content/review', icon: ClipboardCheck, status: 'live', permission: 'content.questions.read', summary: 'Unified reviewer queue with collaboration, duplicate intelligence, chapter readiness reports and audited freeze governance.' },
    { label: 'Coverage Planner', path: '/content/coverage', icon: Target, status: 'live', permission: 'content.taxonomy.read', summary: 'Plan exam-version targets and measure canonical Question Bank readiness across the taxonomy hierarchy.' },
    { label: 'Sections & Topics', path: '/content/taxonomy', icon: Network, status: 'live', permission: 'content.taxonomy.read', summary: 'Manage canonical taxonomy nodes, parent edges, exam-version mappings and activation state.' },
    { label: 'DI & Passage Sets', path: '/content/sets', icon: Layers, status: 'planned', summary: 'Create shared passages, data sets and grouped questions with reusable source material.', milestone: 'Passage/set schema, media references and grouped-question delivery.' },
    { label: 'Media Library', path: '/content/media', icon: ImageIcon, status: 'planned', summary: 'Upload, validate and reuse diagrams, charts, tables and question media.', milestone: 'Canonical object storage, transformations and usage tracking.' },
  ] },
  { id: 'tests', label: 'Tests', items: [
    { label: 'Tests', path: '/tests', icon: FileText, status: 'live', summary: 'Canonical test inventory, lifecycle and publication workspace.' },
    { label: 'Test Builder', path: '/tests/builder', icon: ListChecks, status: 'live', summary: 'Compose test sections and questions, validate totals and publish student-ready tests.' },
    { label: 'Test QA', path: '/tests/qa', icon: ClipboardCheck, status: 'live', permission: 'tests.read', summary: 'Canonical pre-publication validation, reviewer ownership, issue resolution, candidate preview and release gate.' },
    { label: 'Test Series', path: '/tests/series', icon: Box, status: 'live', permission: 'tests.read', summary: 'Create immutable exam-series versions with ordered tests, release windows, readiness checks and progression rules.' },
    { label: 'Exam Blueprints', path: '/tests/blueprints', icon: CalendarClock, status: 'live', permission: 'tests.read', summary: 'Define immutable exam structures, preview Question Bank shortages and assemble deterministic test drafts.' },
    { label: 'Publishing Calendar', path: '/tests/calendar', icon: CalendarClock, status: 'live', permission: 'tests.read', summary: 'Plan releases, inspect missed schedules, drag QA-approved tests onto dates, publish immediately, postpone or unschedule.' },
  ] },
  { id: 'commerce', label: 'Commerce', items: [
    { label: 'Packages', path: '/commerce/packages', icon: Box, status: 'planned', summary: 'Create paid and free offerings and map canonical tests to sellable packages.', milestone: 'Package catalogue, pricing and test entitlement mapping.' },
    { label: 'Orders & Payments', path: '/commerce/orders', icon: ShoppingCart, status: 'planned', summary: 'Reconcile orders, payments, refunds and payment-provider events.', milestone: 'Razorpay verification, order ledger and refund workflow.' },
    { label: 'Coupons', path: '/commerce/coupons', icon: Ticket, status: 'planned', summary: 'Configure discount codes, usage limits and campaign windows.', milestone: 'Canonical promotion rules and redemption audit.' },
    { label: 'Entitlements', path: '/commerce/entitlements', icon: KeyRound, status: 'planned', summary: 'Inspect and manage the products and tests each student can access.', milestone: 'Server-enforced entitlement engine and administrative overrides.' },
  ] },
  { id: 'users', label: 'Users', items: [
    { label: 'Students', path: '/users/students', icon: Users, status: 'live', permission: 'users.students.read', summary: 'Search canonical student identities and inspect account state, attempts, sessions and account history through privacy-safe read APIs.' },
    { label: 'Attempt Administration', path: '/users/attempts', icon: ClipboardList, status: 'live', permission: 'users.students.read', summary: 'Search canonical attempts and inspect immutable test publication, timing, score and result evidence.' },
    { label: 'Account Recovery', path: '/users/recovery', icon: LifeBuoy, status: 'live', permission: 'users.students.read', summary: 'Review self-service account recovery requests and begin verified identity recovery without creating duplicate students.' },
    { label: 'Admin Team', path: '/users/team', icon: ShieldCheck, status: 'live', permission: 'users.admins.read', summary: 'Authorize administrators, manage profiles, role grants, suspension and session revocation through canonical identity records.' },
    { label: 'Support Requests', path: '/users/support', icon: LifeBuoy, status: 'planned', summary: 'Triage student support tickets with assignment, status and resolution history.', milestone: 'Support ticket ingestion and workflow APIs.' },
    { label: 'Notifications', path: '/users/notifications', icon: Bell, status: 'planned', summary: 'Compose and target operational, product and exam notifications.', milestone: 'Template, audience, delivery and engagement tracking.' },
  ] },
  { id: 'analytics', label: 'Analytics', items: [
    { label: 'Business Analytics', path: '/analytics/business', icon: TrendingUp, status: 'planned', summary: 'Revenue, conversion, retention and product performance reporting.', milestone: 'Commerce and entitlement data must be canonical first.' },
    { label: 'Test Analytics', path: '/analytics/tests', icon: BarChart3, status: 'in_progress', summary: 'Attempt volume, score distribution, completion and section-level performance.', milestone: 'Canonical attempt aggregation and percentile pipeline.' },
    { label: 'Question Analytics', path: '/analytics/questions', icon: BarChart3, status: 'in_progress', summary: 'Accuracy, discrimination, option selection and timing for each question version.', milestone: 'Question-version response aggregation and anomaly detection.' },
    { label: 'Content Quality', path: '/analytics/content-quality', icon: Activity, status: 'in_progress', summary: 'Monitor review throughput, quality blockers, duplicates and chapter readiness.', milestone: 'Question Studio and Question Bank quality metrics API.' },
    { label: 'System Health', path: '/analytics/system-health', icon: HeartPulse, status: 'live', permission: 'jobs.read', summary: 'Inspect API and database health, worker signals, canonical job queues, pipeline failures, outbox backlog and redacted operational errors.' },
    { label: 'Request Failures', path: '/analytics/request-failures', icon: AlertTriangle, status: 'live', permission: 'jobs.read', summary: 'Inspect recent failed admin API requests, copy correlation details, filter endpoints and return directly to the affected workspace.' },
  ] },
  { id: 'settings', label: 'Settings', items: [
    { label: 'Exam Configuration', path: '/settings/exam-config', icon: Settings, status: 'in_progress', summary: 'Configure supported exams, scoring rules and operational defaults.', milestone: 'Canonical exam-version management UI.' },
    { label: 'Languages', path: '/settings/languages', icon: Languages, status: 'live', permission: 'content.translations.read', summary: 'Canonical language availability, question and test translation workflow, terminology governance, reviewer assignments and publication readiness.' },
    { label: 'Roles & Permissions', path: '/settings/roles', icon: Lock, status: 'live', permission: 'settings.roles.manage', summary: 'Create and update server-enforced roles from the canonical granular permission catalogue.' },
    { label: 'Branding', path: '/settings/branding', icon: Palette, status: 'planned', summary: 'Control platform identity, visual assets and communication branding.', milestone: 'Canonical tenant branding configuration.' },
    { label: 'Audit Logs', path: '/settings/audit-logs', icon: ScrollText, status: 'live', permission: 'audit.read', summary: 'Search, inspect and export immutable administrative, system and integration events with field-level changes.' },
    { label: 'Integrations', path: '/settings/integrations', icon: Plug, status: 'planned', summary: 'Configure approved external providers and inspect integration health.', milestone: 'Secret-safe provider configuration and webhook observability.' },
  ] },
];

export const NAV_LOOKUP: Record<string, NavItem> = Object.fromEntries(NAV_GROUPS.flatMap((group) => group.items.map((item) => [item.path, item])));
export const ADMIN_WORKSPACE_COUNTS = NAV_GROUPS.flatMap((group) => group.items).reduce<Record<AdminWorkspaceStatus, number>>((counts, item) => ({ ...counts, [item.status]: counts[item.status] + 1 }), { live: 0, in_progress: 0, planned: 0 });
