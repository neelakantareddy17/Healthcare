# MediQ ML Integration Diagnostic Report

## 1. Executive summary

The source code contains a complete backend-to-ML request path:

```text
GET /api/queue/:id/prediction
  -> authenticate
  -> validate(id)
  -> queueController.getWaitTimePrediction
  -> queueService.getWaitTimePredictionInput
  -> waitTimeService.predictWaitTime
  -> POST ${ML_SERVICE_URL}/predict
```

The request is initiated only after the queue input has been loaded and the
`[ML Controller] Input prepared` log has been emitted. The supplied log
(`Prediction requested`) proves only that the controller started; it does not
prove that the database/input-building phase completed or that `fetch` ran.

The most important finding is that the Python service disables its standard
`BaseHTTPRequestHandler` access logging in `Handler.log_message`. Therefore,
the absence of a request line in Render logs is not evidence that `/predict`
was never reached. The backend has its own failure logging, but it does not
log the resolved URL or a success message around the outbound request.

At the time of this investigation, direct requests to both
`https://mediq-ml-service.onrender.com/health` and `/predict` returned HTTP
503. This is direct evidence that the deployed ML service was unavailable at
that time, although the repository cannot establish whether this was a
temporary Render state, a stopped/crashed service, or a deployment
configuration issue. The previously confirmed `/health` response shows that
the service was reachable at an earlier time.

The source-level conclusion is:

1. The configured URL is intended to be a **base URL**. The backend appends
   `/predict`.
2. The stated URL is consistent with the source route when configured exactly
   as `https://mediq-ml-service.onrender.com`.
3. The backend preserves the ML-first path but returns a queue-based fallback
   estimate when the ML request fails. Authentication, authorization, queue
   lookup, and input-preparation errors still return errors.
4. The strongest currently supported deployment hypothesis is ML service
   unavailability (current HTTP 503), not a proven URL-construction bug.
5. If the only backend line observed is `Prediction requested`, the next
   diagnostic checkpoint is whether `Input prepared` appears. If it does not,
   execution stopped in `getWaitTimePredictionInput` before any HTTP request.

## 2. Architecture and request flow

### Frontend trigger

The patient queue page calls `getWaitTimePrediction(queueId)`, which sends
`GET /queue/${queueId}/prediction` through the configured API client. The
frontend catches any error and changes the display to `Unavailable`; it does
not expose the backend's underlying error in the UI.

### Backend route and middleware

The route is mounted as:

```text
app.use('/api', routes)
routes.use('/queue', queueRoutes)
queueRoutes.get('/:id/prediction', ...)
```

The queue router first applies `authenticate`. The prediction route then
validates the UUID-style `id` parameter with `idParamSchema`. A missing or
invalid bearer token, or an invalid queue ID, prevents the controller and
therefore prevents any ML request.

### Controller and queue input construction

`getWaitTimePrediction`:

1. Checks that `req.params.id` exists.
2. Logs `[ML Controller] Prediction requested`.
3. Calls `queueService.getWaitTimePredictionInput`.
4. Logs `[ML Controller] Input prepared`.
5. Calls `predictWaitTime(input)`, which returns either an ML estimate or a
   queue-based fallback.
6. Returns the estimate in the API response with an `estimate_source` field.

`getWaitTimePredictionInput` first calls `getQueueEntryById`. That performs a
database lookup, verifies patient/doctor access, and for patients performs
additional queue queries. It then counts active entries and patients ahead,
derives appointment date/day/time fields, and returns the 14-feature payload.
Any database error, missing queue entry, access failure, or patient date
restriction stops execution before `predictWaitTime`.

### Backend HTTP request

`predictWaitTime` calls `getPredictionUrl`, which:

1. Parses `env.mlServiceUrl` with the standard `URL` constructor.
2. Allows only `http:` or `https:`.
3. Requires the configured URL path to be empty or exactly `/`.
4. Constructs `new URL('/predict', serviceUrl)`.

It then uses Node's built-in `fetch` to issue:

```text
POST https://mediq-ml-service.onrender.com/predict
Content-Type: application/json
JSON body containing the 14 features
Timeout: 3000 ms
```

The backend reads the response as text, requires an HTTP success status,
parses JSON, requires `predicted_wait_time_minutes` to be a finite nonnegative
number, and only then returns success.

### Python service

`ml/service.py` starts a `ThreadingHTTPServer` on `0.0.0.0` and Render's
`PORT` environment variable, with `18080` as the local default.

Its routes are:

* `GET /health` -> `{"status": "ok"}`
* `POST /predict` -> validates all 14 fields, calls the loaded scikit-learn
  model, and returns `{"predicted_wait_time_minutes": ...}`
* Any other route/method -> 404

The handler's `log_message` method returns immediately. Consequently, normal
request access lines are deliberately suppressed. Startup messages and
explicit errors remain the useful ML-side logs.

## 3. Files inspected

* `backend/src/routes/index.ts`
* `backend/src/routes/queue.routes.ts`
* `backend/src/middlewares/auth.middleware.ts`
* `backend/src/middlewares/validate.middleware.ts`
* `backend/src/controllers/queue.controller.ts`
* `backend/src/services/queue.service.ts`
* `backend/src/services/waitTime.service.ts`
* `backend/src/config/env.ts`
* `backend/src/app.ts`
* `backend/src/middlewares/error.middleware.ts`
* `backend/src/server.ts`
* `backend/package.json`
* `backend/tsconfig.json`
* `backend/.env.example`
* `frontend/src/services/queue.js`
* `frontend/src/pages/patient/QueueStatus.jsx`
* `ml/service.py`
* `ml/train_model.py`
* `ml/requirements.txt`
* `README.md`
* `ml/artifacts/wait_time_model.joblib`

No Render blueprint, `render.yaml`, Dockerfile, or other deployment manifest
was present in the inspected repository. Render service settings and runtime
environment variables therefore cannot be verified from source.

## 4. Confirmed findings

### Request path and gating

* `backend/src/routes/queue.routes.ts:8-27`: the router requires
  authentication and validates `:id` before the prediction controller.
* `backend/src/controllers/queue.controller.ts:139-171`:
  `getWaitTimePrediction` emits the supplied controller log, builds input,
  calls `predictWaitTime`, and returns the estimate with its source.
* `backend/src/services/queue.service.ts:344-417`:
  `getWaitTimePredictionInput` performs the queue-entry authorization and
  database work before the HTTP client is called.

### URL configuration

* `backend/src/config/env.ts:3-24`: `ML_SERVICE_URL` is read from the
  process environment. In production it is required; in non-production it
  defaults to `http://127.0.0.1:18080`.
* `backend/src/services/waitTime.service.ts:27-47`: the value must be a
  valid HTTP(S) base URL with no non-root path. The code appends `/predict`.
  A value already ending in `/predict` is rejected rather than producing
  `/predict/predict`.
* `README.md:191`: documents the same contract: production
  `ML_SERVICE_URL` must be the deployed ML base URL without `/predict`.

### HTTP, timeout, and errors

* `backend/src/services/waitTime.service.ts:50-108`: Node built-in `fetch`
  sends the POST with a 3-second timeout.
* Non-2xx responses log `[ML] Prediction request failed` with the status and
  use the queue-based fallback.
* Invalid JSON, invalid response shape, invalid numeric prediction, timeout,
  DNS/TLS errors, and other fetch failures use the fallback. Connection
  failures include only the error name in the backend log.
* `backend/src/middlewares/error.middleware.ts:10-45`: errors outside the ML
  call remain errors. In production, error details are intentionally not
  printed in the response.
* There is no axios/node-fetch dependency required for this path; the code
  uses the Node runtime's global `fetch`. `backend/package.json:35-56`
  requires Node `>=18.18.0`, which supplies this API.

### Payload compatibility

The TypeScript input interface and Python `FEATURES` list contain the same 14
field names. The numeric and categorical classifications also match. The
Python service accepts numeric integers/floats (but not booleans), requires
categorical values to be strings, and the backend supplies those types.
The response key also matches exactly:
`predicted_wait_time_minutes`.

### ML deployment behavior

* `ml/service.py:24-42`: startup fails if the model artifact is missing or
  cannot be loaded.
* `ml/service.py:132-148`: the service binds to `0.0.0.0` and uses `PORT`.
* `ml/requirements.txt`: declares pandas, `scikit-learn==1.8.0`, and joblib.
* `ml/train_model.py:47-68`: the saved model is a pipeline with the same
  categorical/numeric feature design used by the request handler.
* `ml/service.py:151-152`: standard access logging is disabled. This is
  confirmed source evidence and directly explains why a normal request may
  leave no request line in Render logs.

### External availability check

At investigation time, an external GET to
`https://mediq-ml-service.onrender.com/health` returned HTTP 503, and an
external GET to `/predict` also returned HTTP 503. A GET to `/predict` would
not be a valid prediction request and would normally be expected to return
404 if the service were healthy; the 503 instead indicates that the public
service was unavailable at the time of the check. This is a point-in-time
observation, not proof of the historical state when the supplied log was
generated.

## 5. Potential causes, ranked by likelihood

### 1. ML service was unavailable or restarting — high likelihood, verified current symptom

The current public ML URL returns 503. A backend POST would receive a non-OK
response and log `[ML] Prediction request failed` with status 503 if execution
reached `fetch`. Render service suspension, crash, failed startup, or an
unhealthy deployment are deployment hypotheses that require the Render
dashboard and service logs to distinguish.

The model-loading path can terminate the Python process when the artifact is
missing or incompatible. The repository contains the artifact and declares
dependencies, so a missing artifact or version failure is not confirmed from
source; it must be checked in the ML service's startup logs.

### 2. The request did arrive, but no ML request line was emitted — high likelihood

`Handler.log_message` suppresses all normal request access logging. Therefore
the observed absence of a corresponding Render request line is expected even
for a successful request. This is the strongest explanation for the logging
observation itself.

The backend should be checked for `[ML Controller] Input prepared` followed by
one of the `[ML]` failure logs. The current implementation does not log a
successful outbound request or the resolved URL, making correlation difficult.

### 3. Execution failed before `fetch` in queue/database preparation — medium/high likelihood if `Input prepared` is absent

The supplied controller line is before `getWaitTimePredictionInput`. A queue
entry lookup, authorization check, patient active-date check, or one of the
queue count queries can throw before `predictWaitTime` is invoked. This would
fully explain no outbound request, but the repository cannot select this cause
without the subsequent backend log lines or the backend HTTP response.

### 4. Production `ML_SERVICE_URL` is missing, malformed, or set to an endpoint URL — medium likelihood, unverified

Production requires `ML_SERVICE_URL` at process startup. If it is absent, the
backend should fail during configuration initialization rather than silently
skip prediction. If it includes `/predict`, a non-root path, whitespace, or an
invalid URL, `getPredictionUrl` rejects it before `fetch`. The Render
dashboard value is not in source and must be verified directly.

The stated value `https://mediq-ml-service.onrender.com` is the correct shape
for this code. A value of
`https://mediq-ml-service.onrender.com/predict` is not correct for this
implementation.

### 5. Network timeout, DNS, or TLS failure between Render services — medium

The request has a hard 3-second timeout. Such failures are caught and logged
as `[ML] Prediction service connection failed`, including the error name and
message. This remains a hypothesis until the backend Render logs show that
specific message.

### 6. Request schema or model incompatibility — low likelihood from source

The request and response schemas match between TypeScript and Python, and the
training and serving feature lists match. Python can still return 400/500 for
unexpected runtime data, or model loading/prediction can fail if the deployed
Python environment is inconsistent. Those would generate backend status/error
logs or ML startup/error output; no source evidence currently proves either.

## 6. Verification plan and conclusion

The following checks distinguish the causes without changing application code:

1. In the backend Render logs, locate the same request ID/time window and
   check whether `[ML Controller] Input prepared` appears.
   * Missing: investigate queue-entry existence, authorization, date
     restriction, database errors, and the backend HTTP response.
   * Present: the controller reached the ML service function; inspect the
     subsequent `[ML]` log.
2. Check the backend's production environment in Render. Confirm
   `ML_SERVICE_URL` is exactly
   `https://mediq-ml-service.onrender.com` with no `/predict` suffix and no
   accidental whitespace.
3. Check the ML Render deploy/startup logs for process exit, model artifact
   errors, dependency installation failures, and the startup line
   `MediQ ML service running on 0.0.0.0:<PORT>`.
4. From a controlled client, send a real authenticated backend request and
   record the backend status and response. A direct unauthenticated request
   cannot test the ML path because `authenticate` runs first.
5. If the ML service is healthy, issue a direct `POST /predict` with a known
   valid 14-field payload. A 200 response isolates the remaining problem to
   backend configuration/path/reachability; a 400/500 isolates it to payload
   or model behavior.

**Conclusion:** the repository does not support the claim that the backend
never initiates the ML request. The lack of ML request logs is explained by
intentional Python access-log suppression. The currently observable hard
failure is that the public ML service returns 503. If the backend log contains
`Input prepared` and then a 503 failure, the deployed ML service availability
is the most likely root cause. If `Input prepared` is missing, the failure is
upstream in queue/database preparation and the ML service was never reached
for that request. Render environment values, service status, and startup logs
are required to resolve that branch definitively.
