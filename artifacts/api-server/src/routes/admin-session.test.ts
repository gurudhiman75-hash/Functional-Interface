import assert from 'node:assert/strict';
import { once } from 'node:events';
import type { AddressInfo } from 'node:net';
import test from 'node:test';
import express, { type RequestHandler } from 'express';

import type { AdminBootstrapResult, AdminSession } from '../lib/admin-rbac';
import { createAdminSessionRouter } from './admin-session';

const session: AdminSession = {
  user: {
    id: '11111111-1111-4111-8111-111111111111',
    firebaseUid: 'firebase-admin-1',
    email: 'admin@example.test',
    displayName: 'Admin User',
  },
  profile: {
    userId: '11111111-1111-4111-8111-111111111111',
    employeeCode: 'ADM-111111111111',
    department: 'Administration',
    title: 'Administrator',
  },
  roles: ['super_admin'],
  permissions: ['content.generation.read', 'content.generation.run', 'content.generation.review'],
};

const authenticated: RequestHandler = (req, _res, next) => {
  req.user = {
    id: 'firebase-admin-1',
    email: 'admin@example.test',
    displayName: 'Admin User',
    emailVerified: true,
  };
  next();
};

const unauthenticated: RequestHandler = (_req, _res, next) => next();
const databaseConfigured = () => true;

async function requestBootstrap(router: ReturnType<typeof createAdminSessionRouter>) {
  const app = express();
  app.use(express.json());
  app.use('/admin/session', router);
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address() as AddressInfo;
  try {
    const response = await fetch(`http://127.0.0.1:${address.port}/admin/session/bootstrap`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{}',
    });
    return { status: response.status, body: await response.json() as Record<string, unknown> };
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

function dependencies(overrides: Partial<Parameters<typeof createAdminSessionRouter>[0]> = {}) {
  return {
    authenticate: authenticated,
    isDatabaseConfigured: databaseConfigured,
    isAdministrator: async () => true,
    activateInvitation: async () => undefined,
    relinkIdentity: async () => undefined,
    bootstrap: async () => ({ session, firstAdministrator: true, pendingRoleAssignment: false }),
    ...overrides,
  };
}

test('bootstrap rejects an unauthenticated request', async () => {
  const result = await requestBootstrap(createAdminSessionRouter(dependencies({ authenticate: unauthenticated })));
  assert.equal(result.status, 401);
});

test('bootstrap reports a missing canonical database before querying RBAC', async () => {
  let administratorCheckCalled = false;
  let activationCalled = false;
  let relinkCalled = false;
  let bootstrapCalled = false;
  const result = await requestBootstrap(createAdminSessionRouter(dependencies({
    isDatabaseConfigured: () => false,
    isAdministrator: async () => {
      administratorCheckCalled = true;
      return true;
    },
    activateInvitation: async () => { activationCalled = true; },
    relinkIdentity: async () => { relinkCalled = true; },
    bootstrap: async () => {
      bootstrapCalled = true;
      return { session, firstAdministrator: true, pendingRoleAssignment: false };
    },
  })));
  assert.equal(result.status, 503);
  assert.equal(result.body.code, 'DATABASE_URL_REQUIRED');
  assert.equal(administratorCheckCalled, false);
  assert.equal(activationCalled, false);
  assert.equal(relinkCalled, false);
  assert.equal(bootstrapCalled, false);
});

test('bootstrap rejects an authenticated non-admin without writing identity data', async () => {
  let activationCalled = false;
  let relinkCalled = false;
  let bootstrapCalled = false;
  const result = await requestBootstrap(createAdminSessionRouter(dependencies({
    isAdministrator: async () => false,
    activateInvitation: async () => { activationCalled = true; },
    relinkIdentity: async () => { relinkCalled = true; },
    bootstrap: async () => {
      bootstrapCalled = true;
      return { session, firstAdministrator: false, pendingRoleAssignment: false };
    },
  })));
  assert.equal(result.status, 403);
  assert.equal(activationCalled, false);
  assert.equal(relinkCalled, false);
  assert.equal(bootstrapCalled, false);
});

test('pre-authorized invitations activate and relink before canonical session resolution', async () => {
  const calls: string[] = [];
  const result = await requestBootstrap(createAdminSessionRouter(dependencies({
    isAdministrator: async (identity) => {
      calls.push(`authorize:${identity.email}:${identity.emailVerified}`);
      return true;
    },
    activateInvitation: async () => { calls.push('activate'); },
    relinkIdentity: async (identity) => {
      calls.push(`relink:${identity.firebaseUid}:${identity.emailVerified}`);
    },
    bootstrap: async () => {
      calls.push('bootstrap');
      return { session, firstAdministrator: false, pendingRoleAssignment: false };
    },
  })));
  assert.equal(result.status, 200);
  assert.deepEqual(calls, [
    'authorize:admin@example.test:true',
    'activate',
    'relink:firebase-admin-1:true',
    'bootstrap',
  ]);
});

test('first bootstrap returns the server-resolved super-admin session', async () => {
  const result = await requestBootstrap(createAdminSessionRouter(dependencies()));
  assert.equal(result.status, 200);
  assert.equal(result.body.firstAdministrator, true);
  assert.deepEqual(result.body.roles, ['super_admin']);
});

test('repeated bootstrap is idempotent at the route boundary', async () => {
  let calls = 0;
  const bootstrap = async (): Promise<AdminBootstrapResult> => {
    calls += 1;
    return { session, firstAdministrator: calls === 1, pendingRoleAssignment: false };
  };
  const routeDependencies = dependencies({ bootstrap });
  const first = await requestBootstrap(createAdminSessionRouter(routeDependencies));
  const repeated = await requestBootstrap(createAdminSessionRouter(routeDependencies));
  assert.equal(first.status, 200);
  assert.equal(first.body.firstAdministrator, true);
  assert.equal(repeated.status, 200);
  assert.equal(repeated.body.firstAdministrator, false);
  assert.deepEqual(repeated.body.user, first.body.user);
});

test('subsequent administrators receive an explicit pending-role state', async () => {
  const pendingSession = { ...session, roles: [], permissions: [] };
  const result = await requestBootstrap(createAdminSessionRouter(dependencies({
    bootstrap: async () => ({
      session: pendingSession,
      firstAdministrator: false,
      pendingRoleAssignment: true,
    }),
  })));
  assert.equal(result.status, 200);
  assert.equal(result.body.pendingRoleAssignment, true);
  assert.deepEqual(result.body.permissions, []);
});
