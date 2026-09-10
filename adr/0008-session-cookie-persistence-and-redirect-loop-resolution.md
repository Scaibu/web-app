# ADR 0008: Session Cookie Persistence, Envelope Unwrapping, Circuit Breaker Cooldown, and Route Guard Redirect Loop Resolution

| Field | Value |
| --- | --- |
| **ADR ID** | `ADR-NODE-WEB-APP-0008` |
| **Title** | Session Cookie Persistence, Envelope Unwrapping, Circuit Breaker Cooldown, and Route Guard Redirect Loop Resolution |
| **Status** | **Accepted** |
| **Date** | 2026-09-06 |
| **Scope** | Web App Client & Edge Middleware (`packages/node/web-app`), Shared Infra Resilient Pipeline (`@chief-strategist-j/shared-infra/http`) |

---

## 1. Context & Problem Statement

Users accessing the web application experienced an infinite, high-frequency (~100ms) redirect loop alternating continuously between `GET / 200` and `GET /auth/sign-in?callbackUrl=%2F 200`. Concurrently, subsequent API calls (such as `listOrganizations`) triggered fast-fail circuit breaker errors:
```
Step - 7 - [CircuitBreaker] - Bounded LRU Circuit Breaker State Verification - [FAILED]
Error: Circuit breaker is OPEN for key ...
```

A root-cause analysis identified four compounding architectural defects across the request execution, circuit breaker state machine, cookie lifecycle, and route guard layers:

1. **Envelope Unwrapping Defect in API Executor (`web-app/src/lib/api/executor.ts`)**:
   - The backend `auth-service` returns standard REST responses wrapped in an API envelope:
     ```json
     {
       "status": "success",
       "message": "User signed in successfully",
       "data": {
         "token": "<JWT_STRING>",
         "payload": { ... },
         "user": { ... }
       },
       "error": null
     }
     ```
   - The frontend `executeHttpRequest` function returned the raw `json` object directly as `T`.
   - In `auth.saga.ts`, `response.token` was evaluated directly against `response`. Because the token was nested inside `response.data.token`, `response.token` was `undefined`.
   - As a result, `setAuthCookies(response.token)` was never invoked, and the session cookie was never written to `document.cookie`.

2. **Destructive Mount Behavior & Stale Redux State (`web-app/src/app/auth/sign-in/page.tsx`)**:
   - The `SignInPage` component executed an unconditional `useEffect` on mount that deleted `authjs.session-token` and `user_role` cookies.
   - When `authSuccess` was dispatched, `state.status` transitioned to `'success'`.
   - The navigation effect triggered `router.push(callbackUrl)` (`/`).
   - Upon landing on `/`, client-side `AppShell` checked for `authjs.session-token`. Finding no cookie, it redirected to `/auth/sign-in?callbackUrl=%2F`.
   - When `/auth/sign-in` mounted again, `state.status` was still `'success'`, triggering an immediate `router.push('/')` back to the root page, initiating an infinite ping-pong loop.

3. **Overly Broad Prefix Matching in Edge Route Guard (`shared-infra/src/http/middleware/route-guard.ts`)**:
   - `PUBLIC_ROUTES` defined `HTTP_CONSTANTS.ENDPOINT_ROOT` (`"/"`).
   - `isPublicRoute` checked `publicRoutes.some((route) => pathname.startsWith(route))`.
   - Because all URIs start with `"/"`, every route (including protected dashboards) was evaluated as public.
   - Server-side Next.js middleware could not issue early HTTP 307 redirects to unauthenticated requests, deferring protection entirely to client-side components.

4. **Excessive Cooldown & Per-Attempt Failure Counting in Circuit Breaker (`shared-infra`)**:
   - In `StandardCircuitBreaker`, the default cooldown was set to `cooldownMs = 3600000` (1 hour). Once tripped by transient startup failures or invalid credentials, the circuit was locked `OPEN` for an entire hour.
   - In `StepNetworkExecution`, `onFailure` was invoked inside the retry loop on every individual attempt rather than only after all retry attempts were exhausted, causing a single failing call with 3 retries to consume 60% of the failure threshold.

---

## 2. High-Level Design (HLD)

### 2.1 System Architecture & Pipeline Topology

```mermaid
flowchart TB
    subgraph ClientBrowser["Client Browser Environment"]
        User["Browser User / Agent"]
        CookieJar[("Browser Cookies (authjs.session-token, user_role)")]
        SignInUI["SignInPage (/auth/sign-in)"]
        AppShellUI["AppShell & Layout (/)"]
        ReduxStore["Redux Store & Sagas (auth.slice & auth.saga)"]
        ClientExecutor["ApiExecutor (executor.ts)"]
    end

    subgraph EdgeMiddlewareLayer["Next.js Edge Middleware Boundary (:31400)"]
        Middleware["NextRequest Middleware"]
        StepTracing["Step 1: OpenTelemetry SERVER Span"]
        StepCorrelation["Step 2: Request & Correlation ID"]
        StepAuthGuard["Step 3: StepAuthGuard & isPublicRoute"]
        RedirectEngine["HTTP 307 Redirect Engine"]
    end

    subgraph SharedInfraHTTP["Shared Infra Resilient HTTP Client Pipeline"]
        Admission["1. Concurrency Admission"]
        ContextIso["2. Context Isolation"]
        SSRF["3. SSRF & IP Validation"]
        RateLimiter["4. Tenant Rate Limiter"]
        Singleflight["5. Singleflight Deduplication"]
        CacheStore["6. Partitioned Cache Store"]
        CircuitBreakerEngine["7. StandardCircuitBreaker (10s Cooldown)"]
        NetworkExec["8. Network Socket Fetch & Retry"]
    end

    subgraph BackendServices["Backend Infrastructure"]
        Discovery["Service Registry (:31426)"]
        AuthBackend["Auth Service (:3001)"]
        AlloyDB[("AlloyDB Omni (:31412)")]
    end

    User -->|"Navigate /"| Middleware
    Middleware --> StepTracing
    StepTracing --> StepCorrelation
    StepCorrelation --> StepAuthGuard
    StepAuthGuard -->|"No Cookie & Protected"| RedirectEngine
    RedirectEngine -->|"307 Redirect"| SignInUI
    StepAuthGuard -->|"Cookie Present"| AppShellUI

    User -->|"Submit Credentials"| SignInUI
    SignInUI --> ReduxStore
    ReduxStore --> ClientExecutor
    ClientExecutor --> Admission
    Admission --> ContextIso
    ContextIso --> SSRF
    SSRF --> RateLimiter
    RateLimiter --> Singleflight
    Singleflight --> CacheStore
    CacheStore --> CircuitBreakerEngine
    CircuitBreakerEngine --> NetworkExec
    NetworkExec -->|"Resolve Service"| Discovery
    NetworkExec -->|"POST /api/v1/auth/sign-in"| AuthBackend
    AuthBackend --> AlloyDB
    AuthBackend -.->|"HTTP Response (status: success, data)"| NetworkExec
    NetworkExec -.->|"Raw Response Payload"| ClientExecutor
    ClientExecutor -.->|"Unwrapped (token, payload, user)"| ReduxStore
    ReduxStore -->|"setAuthCookies"| CookieJar
    ReduxStore -->|"authSuccess"| SignInUI
    SignInUI -->|"router.push('/')"| Middleware
```

---

## 3. Low-Level Design (LLD)

### 3.1 LLD: Circuit Breaker State Machine & Cooldown Recovery

```mermaid
stateDiagram-v2
    [*] --> CLOSED: Initial Startup

    CLOSED --> CLOSED: Request Succeeds / 4xx Handled
    CLOSED --> OPEN: Exhausted Retries (Failures >= 5)

    OPEN --> OPEN: Request Attempted within 10s (Fast Fail 503)
    OPEN --> HALF_OPEN: Request Attempted after 10s Cooldown

    HALF_OPEN --> CLOSED: Trial Probe Succeeds (Reset)
    HALF_OPEN --> OPEN: Trial Probe Fails (Reset Cooldown)
```

### 3.2 LLD: Edge Route Guard & Authentication Flowchart

```mermaid
flowchart TD
    Req["Incoming HTTP Request"] --> MatchStatic{"Is Static Asset or Next Internal? (_next, favicon.ico, api)"}
    MatchStatic -- "Yes" --> Allow["Allow Next.js Pipeline Execution"]
    MatchStatic -- "No" --> MatchPublic{"Is Public Route? (/auth/sign-in, /auth/sign-up, /auth/callback)"}
    MatchPublic -- "Yes" --> Allow
    MatchPublic -- "No" --> CheckCookie{"Is Session Cookie Present? (authjs.session-token)"}
    CheckCookie -- "Yes & Valid" --> Allow
    CheckCookie -- "No / Expired" --> Issue307["Construct 307 Redirect to /auth/sign-in"]
    Issue307 --> ReturnClient["Return HTTP 307 to Browser"]
```

### 3.3 LLD: Authentication & Cookie Lifecycle Sequence

```mermaid
sequenceDiagram
    autonumber
    actor User as Browser User
    participant Page as SignInPage (/auth/sign-in)
    participant Saga as AuthSaga
    participant Exec as ApiExecutor (executor.ts)
    participant Pipeline as ScalableHttpClient (Steps 1-8)
    participant CB as StandardCircuitBreaker
    participant Auth as AuthService (:3001)
    participant Middleware as Next.js Edge Middleware
    participant Shell as AppShell (/)

    User->>Page: Enters credentials and clicks Sign In
    Page->>Saga: dispatch(signInSubmitted)
    Saga->>Exec: authApiClient.signIn(credentials)
    Exec->>Pipeline: executeHttpRequest(fullUrl, body)
    Pipeline->>CB: Step 7: canExecute(circuitKey)
    CB-->>Pipeline: true (State: CLOSED)
    Pipeline->>Auth: Step 8: POST /api/v1/auth/sign-in
    Auth-->>Pipeline: HTTP 200 (status: success, data)
    Pipeline->>CB: onSuccess(circuitKey) - Reset failure counter
    Pipeline-->>Exec: res.data
    Exec->>Exec: Unwraps json.data into token, payload, user
    Exec-->>Saga: Resolved AuthResponse
    Saga->>Saga: setAuthCookies(token, role)
    Saga->>Page: put(authSuccess)
    Page->>Page: dispatch(resetAuthStatus)
    Page->>Middleware: router.push('/') with Cookie: authjs.session-token
    Middleware->>Middleware: StepAuthGuard verifies session token
    Middleware-->>Shell: HTTP 200 (Dashboard route allowed)
    Shell-->>User: Renders Observability Dashboard UI
```

---

## 4. Implementation Details

### 4.1 Standard API Envelope Unwrapping (`executor.ts`)
Updated `executeHttpRequest` to inspect the response payload for `json.data`:
- If `json.data` is an object, merges `{ status: json.status, message: json.message, ...json.data }` to provide top-level access to domain fields (`token`, `user`, `payload`) while retaining response status metadata.
- If `json.data` is an array (e.g. lists of users, organizations, keys), returns `json.data` directly.
- Preserves explicit error throwing when `json.status === "error"` or `json.error` is present.

### 4.2 StandardCircuitBreaker Cooldown & Failure Isolation (`shared-infra`)
- Reduced default `cooldownMs` in `StandardCircuitBreaker` from `3600000` (1 hour) to `10000` (10 seconds), matching the decorator standard and preventing prolonged lockout after service recovery.
- Added `reset(circuitKey?: string)` method on `StandardCircuitBreaker` and `ScalableHttpClient`.
- In `StepNetworkExecution`, updated failure tracking to only call `onFailure` when `attempt === maxAttempts` (all retries exhausted), avoiding false trips on retryable transient network blips.

### 4.3 Persistent Cookie Policy (`auth.saga.ts`)
Hardened cookie attributes in `setAuthCookies`:
- Configured explicit `max-age=604800` (7 days) and `SameSite=Lax` on `authjs.session-token` and `user_role` cookies.
- Prevents session loss across reloads and tab closures while defending against CSRF vulnerabilities.

### 4.4 Idempotent Client Auth Lifecycle (`SignInPage`)
Refactored `SignInPage`:
- Removed unconditional cookie deletion on mount.
- Added client cookie inspection on mount: if a valid session token exists, redirects immediately to `callbackUrl`.
- Dispatches `authActions.resetAuthStatus()` immediately upon successful sign-in navigation to prevent stale `'success'` states from triggering recurring navigations.

### 4.5 Precise Route Matching in Edge Middleware (`route-guard.ts`)
Refactored public route verification:
- Removed `ENDPOINT_ROOT` from `PUBLIC_ROUTES` (only explicit auth endpoints `/auth/sign-in`, `/auth/sign-up`, `/auth/callback` are public).
- Updated route matching so root route evaluations check exact equality (`pathname === "/"`) rather than prefix matching.
- Unauthenticated requests to `/` or protected paths now receive an instantaneous `HTTP 307 Temporary Redirect` directly from Next.js middleware, preventing unauthenticated page hydration and client-side loops.

---

## 5. Consequences & Verification

### Positive Consequences
- Completely eliminates the 100ms infinite redirect loop.
- The circuit breaker recovers in 10 seconds via half-open trial probes rather than locking the client out for an hour.
- Internal HTTP retry attempts do not inflate circuit breaker failure counts.
- Unauthenticated traffic is stopped at the edge/middleware boundary via HTTP 307 redirects without unnecessary component rendering.
- Session tokens are reliably stored and read from browser cookies.

### Verification Results
1. **Unauthenticated Edge Guard**:
   `curl -i -s http://localhost:31400/`
   Returns `HTTP/1.1 307 Temporary Redirect` with `Location: /auth/sign-in?callbackUrl=%2F`.

2. **Authenticated Access**:
   `curl -i -s http://localhost:31400/ -H "Cookie: authjs.session-token=<VALID_TOKEN>; user_role=admin"`
   Returns `HTTP 200 OK` and cleanly renders the dashboard.

3. **Circuit Breaker Recovery & Authorized API Verification**:
   `curl -i -s http://localhost:3001/api/v1/auth/organizations -H "Authorization: Bearer <VALID_TOKEN>"`
   Returns `HTTP 200 OK` with `{"status":"success","data":[{"id":"...","name":"Scaibu"}]}` without tripping the circuit breaker.
