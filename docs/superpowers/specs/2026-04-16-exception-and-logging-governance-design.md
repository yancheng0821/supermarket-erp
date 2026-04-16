# Exception And Logging Governance Design

## Summary

This spec defines the production-oriented baseline for two cross-cutting concerns in the supermarket ERP platform:

- unified exception handling
- end-to-end request logging and log rotation

The goal is not to introduce a full observability platform in this phase. The goal is to make the current `gateway + servlet service` architecture operationally usable by standardizing error responses, guaranteeing consistent log output, and allowing a single request to be traced across services with a shared request identifier.

The first implementation scope covers:

- shared servlet-side exception and request-context infrastructure
- security-related `401` and `403` response consistency
- gateway-side global exception handling and request ID propagation
- MDC-backed logging context with `requestId`, `tenantId`, `userId`, `method`, and `path`
- standardized `logback-spring.xml` output patterns and rolling policies for `erp-gateway` and `erp-system`

This phase does not attempt to deliver distributed tracing systems, metrics pipelines, centralized log collection, or request or response body capture by default.

## Current State

The codebase already has a partial production baseline:

- servlet services use a shared [GlobalExceptionHandler](/Users/aisenyc/work/supermarket-erp/erp-framework/erp-spring-boot-starter-web/src/main/java/com/supermarket/erp/framework/web/core/GlobalExceptionHandler.java)
- security already returns JSON `401` and `403` responses through dedicated handlers
- `erp-gateway` and `erp-system` both have `logback-spring.xml` with daily and size-based rolling for `application.log` and `error.log`
- `TokenAuthenticationFilter` and `TenantContextWebFilter` already resolve authenticated tenant context for business execution

However, several operational gaps remain:

- exception responses are not standardized end to end across servlet services and gateway
- servlet-side error responses do not include request correlation information
- gateway currently has no dedicated global exception handler for WebFlux failures
- there is no request ID propagation standard such as `X-Request-Id`
- logs do not include request-level correlation fields such as `requestId`, `tenantId`, or `userId`
- request start and request completion are not logged in a consistent way
- the current logging baseline exists only in selected services and is not expressed as a clear platform standard

## Goals

1. Standardize exception handling across servlet services and gateway.
2. Preserve the current frontend response contract based on `CommonResult`.
3. Introduce a request-correlation mechanism that works across gateway and downstream services.
4. Ensure every request can be associated with `requestId`, and authenticated requests can also be associated with `tenantId` and `userId`.
5. Keep log rotation production-appropriate with stable retention and size controls.
6. Make the solution reusable by future business services without redesigning these concerns per module.

## Non-Goals

- Full distributed tracing platform integration such as Zipkin, Jaeger, SkyWalking, or OpenTelemetry
- Centralized log shipping to ELK, Loki, or similar systems
- Request body and response body logging by default
- Redesigning the frontend error object shape in this phase
- Introducing a new API envelope beyond the existing `CommonResult { code, msg, data }`
- Covering every not-yet-implemented microservice in the initial rollout

## Architecture Decision

The platform will keep `CommonResult` as the external error response envelope and will standardize behavior around it rather than replacing it.

Because the current backend uses two different runtime models, the exception strategy must be split by execution model while still producing the same response contract:

- servlet services use shared MVC infrastructure from `erp-spring-boot-starter-web`
- gateway uses Spring Cloud Gateway and must use a WebFlux-compatible global exception path

Request correlation will be standardized around `X-Request-Id`.

Rules:

- gateway accepts an upstream `X-Request-Id` when provided
- gateway generates one when it is missing
- gateway writes it back to the response
- gateway forwards it downstream
- downstream servlet services must reuse the same request ID instead of generating a new one

This design keeps correlation simple, compatible with external ingress layers, and independent from any later tracing platform.

## Error Response Model

### External Contract

The platform keeps the existing JSON envelope:

- `code`
- `msg`
- `data`

No additional top-level response fields are introduced in this phase.

This keeps the current frontend integration stable and avoids expanding the current work into a frontend protocol migration.

### HTTP Status Rules

The current platform mixes business error codes with HTTP response codes. This phase standardizes their HTTP behavior:

- validation and binding failures return `400`
- authentication failures return `401`
- authorization failures return `403`
- resource-not-found or business not-found exceptions may return `404` when the service code explicitly uses `404`
- service exceptions with codes in the `4xx/5xx` range return the matching HTTP status
- service exceptions with non-HTTP business codes continue to return `200` with an error body
- unknown system exceptions return `500`

This rule preserves compatibility with the current `ServiceException` model while allowing proper transport-layer status codes where the code already maps cleanly to HTTP.

## Servlet-Side Exception Handling

Servlet services continue to use the shared [GlobalExceptionHandler](/Users/aisenyc/work/supermarket-erp/erp-framework/erp-spring-boot-starter-web/src/main/java/com/supermarket/erp/framework/web/core/GlobalExceptionHandler.java), but it will be expanded and tightened.

### Covered Exception Categories

The shared handler must cover at least:

- `ServiceException`
- `MethodArgumentNotValidException`
- `BindException`
- `ConstraintViolationException`
- request parameter type conversion failures
- unreadable request bodies such as malformed JSON
- a final `Exception` fallback

### Logging Rules

- `4xx` business and validation failures log at `WARN`
- unexpected `5xx` failures log at `ERROR` with stack trace
- every error log includes `requestId`, `method`, and `path` through MDC and message text

### Message Rules

- validation errors should return the most useful field-level message available
- system fallback errors should return a stable generic message such as `Internal server error`
- internal exception details must not leak into response bodies

## Security Exception Handling

Security exceptions remain outside normal controller exception advice and continue to be handled by dedicated security components:

- [JsonAuthenticationEntryPoint](/Users/aisenyc/work/supermarket-erp/erp-framework/erp-spring-boot-starter-security/src/main/java/com/supermarket/erp/framework/security/core/JsonAuthenticationEntryPoint.java)
- [JsonAccessDeniedHandler](/Users/aisenyc/work/supermarket-erp/erp-framework/erp-spring-boot-starter-security/src/main/java/com/supermarket/erp/framework/security/core/JsonAccessDeniedHandler.java)

These handlers will be aligned with the rest of the platform by:

- preserving `CommonResult.error(...)` output
- logging `401` and `403` at `WARN`
- relying on the same request context fields already present in MDC

## Gateway Exception Handling

`erp-gateway` is a Spring Cloud Gateway application and therefore needs a dedicated WebFlux-side global exception handler.

### Gateway Responsibilities

The gateway exception layer must convert the following classes of failures into the standard `CommonResult` response:

- route resolution failures
- downstream connection failures
- downstream timeout or service-unavailable scenarios
- generic unhandled gateway exceptions

### Gateway Output Rules

- response body keeps the same `CommonResult` shape
- HTTP status reflects the transport failure class whenever practical
- response includes the current `X-Request-Id`
- unexpected gateway failures log at `ERROR`
- expected upstream problems such as unavailable downstream services may log at `WARN` or `ERROR` depending on severity

This is necessary because servlet-side `@RestControllerAdvice` cannot cover reactive gateway failures.

## Request Context And MDC

### Standard MDC Fields

The platform standardizes the following MDC keys:

- `requestId`
- `tenantId`
- `userId`
- `method`
- `path`

Optional future fields such as `clientIp` or `loginScope` may be added later, but they are not required in this phase.

### Request Lifecycle

For servlet services:

1. At request entry, read or generate `X-Request-Id`.
2. Write `requestId`, `method`, and `path` to MDC.
3. Add `X-Request-Id` to the response.
4. After security and tenant resolution succeed, enrich MDC with `userId` and `tenantId`.
5. On request completion, log status and duration.
6. In a finally block, clear MDC to prevent thread reuse leakage.

For gateway:

1. At request entry, read or generate `X-Request-Id`.
2. Write the request ID into the reactive exchange and logging context.
3. Forward the header to downstream services.
4. Write the header back to the client response.
5. Log request start and completion with duration and status.

### Source Of Tenant And User Context

- `tenantId` comes from authenticated token claims when authentication succeeds
- header-based tenant fallback may still apply for backward-compatible local or internal requests
- `userId` comes from the authenticated `LoginUser`

The authenticated token remains the authoritative source. Header-based tenant parsing is fallback-only and must not override authenticated tenant identity.

## Request Logging Policy

The platform will log request lifecycle events in a minimal but consistent form.

### Required Events

- request start
- request completion
- request failure through exception handlers

### Suggested Message Shape

Request start:

- level: `INFO`
- content: `request started`
- fields visible in log line or message: `requestId method path`

Request completion:

- level: `INFO`
- content: `request completed`
- fields visible in log line or message: `requestId method path status durationMs`

Security or validation failure:

- level: `WARN`

Unhandled exception:

- level: `ERROR`

### Explicit Exclusions

The platform will not log full request or response bodies by default.

Reasons:

- password and token leakage risk
- large payload noise
- compliance and privacy exposure
- operational cost without strong default value

If body logging is ever needed, it should be opt-in and endpoint-scoped, not a platform default.

## Logback Standard

The platform keeps the current two-file strategy and standardizes it as the baseline:

- `application.log`
- `error.log`

### Rolling Policy

Both services currently use size-and-time-based rolling. This remains the baseline:

- `application.log`
  - daily archives
  - `50MB` max file size
  - `30` days history
  - `2GB` total size cap
- `error.log`
  - daily archives
  - `20MB` max file size
  - `30` days history
  - `1GB` total size cap

This is sufficient for the current stage and should be copied to future services unless there is a clear reason to diverge.

### Log Pattern Standard

The current pattern is too narrow because it lacks request correlation fields.

The new baseline pattern must include at least:

- timestamp
- thread
- level
- application name
- request ID
- tenant ID
- user ID
- logger
- message

Example shape:

`%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level ${APP_NAME} [req=%X{requestId:-} tenant=%X{tenantId:-} user=%X{userId:-}] %logger{36} - %msg%n`

This is the minimum needed to correlate gateway and downstream service logs during incident analysis.

## Module Responsibilities

### `erp-framework/erp-spring-boot-starter-web`

Responsible for:

- servlet request-context filter or equivalent shared request logging infrastructure
- servlet MDC management
- shared servlet request ID generation and response echoing
- shared servlet exception handling

### `erp-framework/erp-spring-boot-starter-security`

Responsible for:

- security JSON response consistency
- adding authenticated `userId` and token-derived `tenantId` into MDC when available

### `erp-framework/erp-spring-boot-starter-tenant`

Responsible for:

- fallback tenant header parsing
- writing fallback `tenantId` into MDC only when authentication did not already establish it

### `erp-gateway`

Responsible for:

- request ID generation or propagation at platform ingress
- request ID forwarding to downstream services
- request start and completion logs for gateway traffic
- WebFlux global exception handling
- gateway logback pattern compliance

### `erp-module-system/erp-module-system-biz`

Responsible for:

- consuming shared servlet exception and request-context infrastructure
- ensuring local logback pattern matches the platform standard
- verifying that business exceptions, validation exceptions, and security failures produce the expected output

## Compatibility Strategy

This phase is intentionally conservative.

- The `CommonResult` envelope stays unchanged.
- Existing frontend code that reads `code`, `msg`, and `data` remains valid.
- Existing service-side `ServiceException` throwing patterns remain valid.
- Existing tenant header fallback remains available for backward-compatible internal and local development flows.

The main behavior changes are operational:

- more consistent HTTP statuses
- request-correlation headers
- richer logs
- gateway-side error standardization

## Testing Strategy

### Shared Servlet Exception Tests

Add or update tests to verify:

- validation failures return `400`
- `ServiceException` returns the correct body and HTTP status behavior
- unknown exceptions return `500`
- response body remains `CommonResult`

### Security Response Tests

Verify:

- unauthenticated access returns JSON `401`
- forbidden access returns JSON `403`
- handlers do not return HTML error pages

### Gateway Tests

Add gateway-focused tests to verify:

- `X-Request-Id` is generated when absent
- `X-Request-Id` is preserved when supplied
- request ID is forwarded downstream
- gateway exceptions return the standard JSON error envelope

### Logging Behavior Verification

Verification must confirm:

- gateway and `erp-system` log the same `requestId` for a single request chain
- authenticated requests log `userId` and `tenantId`
- unknown exceptions are written to `error.log`
- logback configuration loads without startup failure

### Rotation Verification

This phase does not need long-running archival tests, but configuration validation must confirm:

- size-and-time-based policies remain valid
- archive paths resolve correctly
- both application and error appenders initialize correctly

## Rollout Order

The implementation order should minimize divergence between shared components and service-specific behavior:

1. shared servlet request-context and exception infrastructure
2. security and tenant MDC enrichment
3. gateway request ID propagation and reactive exception handling
4. service-side logback pattern standardization
5. tests proving response and logging behavior

This order ensures the shared contract exists before gateway and business modules start depending on it.

## Success Criteria

The work is successful when all of the following are true:

- servlet services and gateway return consistent JSON error envelopes
- `401`, `403`, validation failures, business failures, and unknown failures all follow explicit rules
- a single request can be traced from gateway to `erp-system` using one shared `requestId`
- authenticated requests include `tenantId` and `userId` in logs
- `erp-gateway` and `erp-system` both use the standardized log pattern and rolling policy
- tests cover the critical exception and request-correlation paths
