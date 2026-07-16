import assert from 'node:assert/strict';
import test from 'node:test';
import type { NextFunction, Request, Response } from 'express';

import {
  hasAdminPermission,
  requireAdminPermission,
  type AdminSession,
} from './admin-rbac';

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
  roles: ['content_author'],
  permissions: ['content.generation.read'],
};

function responseRecorder() {
  const record: { status?: number; body?: unknown } = {};
  const response = {
    status(code: number) {
      record.status = code;
      return this;
    },
    json(body: unknown) {
      record.body = body;
      return this;
    },
  } as unknown as Response;
  return { record, response };
}

test('effective permission calculation recognizes exact keys and wildcard', () => {
  assert.equal(hasAdminPermission({ permissions: ['content.generation.read'] }, 'content.generation.read'), true);
  assert.equal(hasAdminPermission({ permissions: ['content.generation.read'] }, 'content.generation.run'), false);
  assert.equal(hasAdminPermission({ permissions: ['*'] }, 'content.generation.run'), true);
});

test('permission middleware rejects unauthenticated requests', async () => {
  const req = {} as Request;
  const { record, response } = responseRecorder();
  let nextCalled = false;
  await requireAdminPermission('content.generation.read', async () => session)(
    req,
    response,
    (() => { nextCalled = true; }) as NextFunction,
  );
  assert.equal(record.status, 401);
  assert.equal(nextCalled, false);
});

test('permission middleware rejects a missing effective permission', async () => {
  const req = { user: { id: 'firebase-admin-1' } } as Request;
  const { record, response } = responseRecorder();
  let nextCalled = false;
  await requireAdminPermission('content.generation.run', async () => session)(
    req,
    response,
    (() => { nextCalled = true; }) as NextFunction,
  );
  assert.equal(record.status, 403);
  assert.deepEqual(record.body, {
    error: 'Administrator permission required',
    permission: 'content.generation.run',
  });
  assert.equal(nextCalled, false);
});

test('permission middleware attaches the server-resolved session', async () => {
  const req = { user: { id: 'firebase-admin-1' } } as Request;
  const { response } = responseRecorder();
  let nextCalled = false;
  await requireAdminPermission('content.generation.read', async () => session)(
    req,
    response,
    (() => { nextCalled = true; }) as NextFunction,
  );
  assert.equal(nextCalled, true);
  assert.equal(req.adminSession, session);
});
