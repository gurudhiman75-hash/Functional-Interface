-- Safe, reversible PostgreSQL schema smoke. Execute against an ephemeral
-- CI database ONLY after the two repository queue migrations have run.
-- No production Neon URL is used; synthetic records roll back at the end.
\set ON_ERROR_STOP on
BEGIN;

DO $qa$
DECLARE
  run_a uuid := gen_random_uuid();
  run_b uuid := gen_random_uuid();
  token_1 uuid := gen_random_uuid();
  token_2 uuid := gen_random_uuid();
  rows_added integer;
  reservation_guard boolean := false;
  attempt_guard boolean := false;
  hash_guard boolean := false;
  lease_guard boolean := false;
  expiry_guard boolean := false;
BEGIN
  INSERT INTO content.generation_runs(id,status) VALUES
    (run_a,'queued'),(run_b,'queued');

  INSERT INTO content.generation_enqueue_idempotency
    (actor_firebase_uid,idempotency_key,request_sha256,generation_run_id)
  VALUES ('ci-actor-one','request-12345',repeat('a',64),run_a);

  INSERT INTO content.generation_enqueue_idempotency
    (actor_firebase_uid,idempotency_key,request_sha256,generation_run_id)
  VALUES ('ci-actor-one','request-12345',repeat('a',64),run_b)
    ON CONFLICT (actor_firebase_uid,idempotency_key) DO NOTHING;
  GET DIAGNOSTICS rows_added = ROW_COUNT;
  IF rows_added <> 0 THEN
    RAISE EXCEPTION 'Duplicate actor/idempotency key created a second reservation';
  END IF;

  BEGIN
    INSERT INTO content.generation_enqueue_idempotency
      (actor_firebase_uid,idempotency_key,request_sha256,generation_run_id)
    VALUES ('ci-actor-one','other-request-123',repeat('b',64),run_a);
  EXCEPTION WHEN unique_violation THEN reservation_guard:=true;
  END;
  IF NOT reservation_guard THEN
    RAISE EXCEPTION 'A run accepted more than one unique reservation';
  END IF;

  BEGIN
    INSERT INTO content.generation_enqueue_idempotency
      (actor_firebase_uid,idempotency_key,request_sha256,generation_run_id)
    VALUES ('ci-actor-one','invalid-hash-123','bad',run_b);
  EXCEPTION WHEN check_violation THEN hash_guard:=true;
  END;
  IF NOT hash_guard THEN RAISE EXCEPTION 'Malformed SHA256 was accepted'; END IF;

  -- Scoped idempotency keys may be reused by a different actor.
  INSERT INTO content.generation_enqueue_idempotency
    (actor_firebase_uid,idempotency_key,request_sha256,generation_run_id)
  VALUES ('ci-actor-two','request-12345',repeat('b',64),run_b);

  INSERT INTO content.generation_run_task_leases
    (generation_run_id,lease_token,attempt_number,claimed_at,lease_expires_at)
  VALUES (run_a,token_1,1,now(),now()+interval '4 minutes');

  BEGIN
    INSERT INTO content.generation_run_task_leases
      (generation_run_id,lease_token,attempt_number,claimed_at,lease_expires_at)
    VALUES (run_a,token_2,2,now(),now()+interval '4 minutes');
  EXCEPTION WHEN unique_violation THEN lease_guard:=true;
  END;
  IF NOT lease_guard THEN RAISE EXCEPTION 'Duplicate active lease was accepted'; END IF;

  UPDATE content.generation_run_task_leases
    SET lease_token=token_2,attempt_number=2,
        claimed_at=now(),lease_expires_at=now()+interval '4 minutes'
    WHERE generation_run_id=run_a AND lease_token=token_1;
  GET DIAGNOSTICS rows_added = ROW_COUNT;
  IF rows_added <> 1 THEN RAISE EXCEPTION 'Valid lease rotation failed'; END IF;

  UPDATE content.generation_run_task_leases SET completed_at=now()
    WHERE generation_run_id=run_a AND lease_token=token_1;
  GET DIAGNOSTICS rows_added = ROW_COUNT;
  IF rows_added <> 0 THEN RAISE EXCEPTION 'Stale lease was accepted'; END IF;

  UPDATE content.generation_run_task_leases
    SET lease_token=gen_random_uuid(),attempt_number=3,
        claimed_at=now(),lease_expires_at=now()+interval '4 minutes'
    WHERE generation_run_id=run_a AND lease_token=token_2;
  GET DIAGNOSTICS rows_added = ROW_COUNT;
  IF rows_added <> 1 THEN RAISE EXCEPTION 'Third lease attempt failed'; END IF;

  BEGIN
    UPDATE content.generation_run_task_leases
      SET lease_token=gen_random_uuid(),attempt_number=4
      WHERE generation_run_id=run_a;
  EXCEPTION WHEN check_violation THEN attempt_guard:=true;
  END;
  IF NOT attempt_guard THEN RAISE EXCEPTION 'Fourth lease attempt was accepted'; END IF;

  BEGIN
    INSERT INTO content.generation_run_task_leases
      (generation_run_id,lease_token,attempt_number,claimed_at,lease_expires_at)
    VALUES (run_b,gen_random_uuid(),1,now(),now()-interval '5 seconds');
  EXCEPTION WHEN check_violation THEN expiry_guard:=true;
  END;
  IF NOT expiry_guard THEN RAISE EXCEPTION 'Lease with invalid expiry was accepted'; END IF;
END $qa$;

-- Ensure no test record can persist beyond this SQL smoke.
ROLLBACK;

SELECT
  CASE WHEN (SELECT count(*) FROM content.generation_enqueue_idempotency)=0
             AND (SELECT count(*) FROM content.generation_run_task_leases)=0
  THEN 'PASS: synthetic queue transaction rolled back'
  ELSE 'FAIL: synthetic queue records persisted' END AS result;
