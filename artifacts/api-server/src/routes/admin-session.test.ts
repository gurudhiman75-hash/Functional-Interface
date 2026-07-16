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

test('bootstrap rejects an unauthenticated request', async () => {
  const result = await requestBootstrap(createAdminSessionRouter({
    authenticate: unauthenticated,
    isLegacyAdmin: async () => true,
    bootstrap: async () => ({ session, firstAdministrator: true, pendingRoleAssignment: false }),
  }));
  assert.equal(result.status, 401);
});

test('bootstrap rejects an authenticated non-admin without writing identity data', async () => {
  let bootstrapCalled = false;
  const result = await requestBootstrap(createAdminSessionRouter({
    authenticate: authenticated,
    isLegacyAdmin: async () => false,
    bootstrap: async () => {
      bootstrapCalled = true;
      return { session, firstAdministrator: false, pendingRoleAssignment: false };
    },
  }));
  assert.equal(result.status, 403);
  assert.equal(bootstrapCalled, false);
});

test('first bootstrap returns the server-resolved super-admin session', async () => {
  const result = await requestBootstrap(createAdminSessionRouter({
    authenticate: authenticated,
    isLegacyAdmin: async () => true,
    bootstrap: async () => ({ session, firstAdministrator: true, pendingRoleAssignment: false }),
  }));
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
  const dependencies = {
    authenticate: authenticated,
    isLegacyAdmin: async () => true,
    bootstrap,
  };
  const first = await requestBootstrap(createAdminSessionRouter(dependencies));
  const repeated = await requestBootstrap(createAdminSessionRouter(dependencies));
  assert.equal(first.status, 200);
  assert.equal(first.body.firstAdministrator, true);
  assert.equal(repeated.status, 200);
  assert.equal(repeated.body.firstAdministrator, false);
  assert.deepEqual(repeated.body.user, first.body.user);
});

test('subsequent administrators receive an explicit pending-role state', async () => {
  const pendingSession = { ...session, roles: [], permissions: [] };
  const result = await requestBootstrap(createAdminSessionRouter({
    authenticate: authenticated,
    isLegacyAdmin: async () => true,
    bootstrap: async () => ({
      session: pendingSession,
      firstAdministrator: false,
      pendingRoleAssignment: true,
    }),
  }));
  assert.equal(result.status, 200);
  assert.equal(result.body.pendingRoleAssignment, true);
  assert.deepEqual(result.body.permissions, []);
});
