# System Auth And Permissions Design

## Summary

This spec defines the first-phase production-oriented foundation for the supermarket ERP admin system. The goal is to replace the current mock frontend authentication flow with a real platform and tenant login system, establish backend-driven menus and permissions, and add the minimum production baseline needed to support a real admin deployment.

The first phase stays intentionally narrow:

- Keep one `erp-system` service responsible for authentication and system management.
- Support two login scopes: platform administrator and tenant administrator.
- Deliver the minimum management surfaces needed to operate the system:
  - platform side: tenant management, menu management
  - tenant side: user management, role management
- Add essential production baseline items that directly support real login and operations:
  - log rotation
  - actuator health endpoints
  - profile-based environment configuration
  - unified auth and error handling
  - seed data
  - minimum regression tests

This spec does not include second-phase work such as full Spring Cloud governance, deployment automation, or observability stacks beyond the minimal actuator baseline.

## Current State

The project already has a substantial ERP skeleton:

- backend multi-module Maven structure
- gateway and Nacos-related dependencies
- system authentication service with JWT generation
- tenant infrastructure and business modules
- React admin frontend with login page and business pages

However, several critical gaps remain:

- frontend login is still mock-based
- frontend route protection is incomplete
- frontend user management is still mock data
- backend user, role, menu, and tenant management are not fully wired for real admin operations
- platform-level account and tenant login boundaries are not explicit
- log rotation and production-oriented operational baseline are missing

## Goals

1. Establish real backend-backed authentication for the admin frontend.
2. Separate platform and tenant login scopes clearly.
3. Use backend-delivered menus and permissions as the source of truth.
4. Provide a minimal but usable system management surface.
5. Add enough production baseline to support real deployment and operation of this authentication layer.

## Non-Goals

- Full microservice governance rollout in the first phase
- Full observability stack such as tracing and metrics pipelines
- Platform administrator self-management UI
- Fine-grained permissions rollout across every existing business page in the first phase
- Complete CI/CD and deployment packaging in the first phase

## Architecture Decision

The first phase will keep authentication and system management inside the existing `erp-system` service instead of splitting them into separate services. This is the fastest way to achieve a real login and authorization loop while staying aligned with the current codebase.

The system will support two independent login paths:

- platform administrator login
- tenant administrator login

Both paths will issue JWT tokens, but the token payload and authorization behavior must explicitly identify the login scope.

## Login Model

### Platform Administrator Login

Platform administrators use a separate login entry that does not require a tenant code.

Input fields:

- `username`
- `password`

On success, the issued token must include:

- `loginScope=platform`
- `userId`
- platform-level permissions

`tenantId` is empty for platform logins.

Platform tokens are only valid for platform-level endpoints such as tenant management and global menu management.

### Tenant Administrator Login

Tenant administrators log in with a tenant account code plus credentials.

Input fields:

- `tenantCode`
- `username`
- `password`

The backend authenticates in this order:

1. resolve tenant by `tenantCode`
2. validate tenant status
3. validate the user within that tenant
4. validate password and user status
5. resolve role-based menus and permissions

On success, the issued token must include:

- `loginScope=tenant`
- `tenantId`
- `userId`
- tenant-scoped permissions

Tenant tokens are only valid for tenant-level endpoints unless an explicit exception is designed later.

## Authorization Model

The backend is the source of truth for menus and permissions.

After login, or when restoring an existing session, the frontend obtains a full session payload containing:

- token
- current user info
- current login scope
- current tenant info when applicable
- menu tree
- permission set

The frontend may cache this data locally, but it must not invent permissions or use local data as the authority. Route access, sidebar rendering, and button visibility must all be based on backend-delivered session data.

### Scope Boundaries

- platform tokens cannot access tenant management surfaces intended for tenant administrators
- tenant tokens cannot access platform management surfaces
- menu and permission delivery must already be filtered by scope on the backend

### Permission Usage

The frontend will expose a single permission check utility such as `hasPermission(...)`.

This utility controls page-level and button-level behaviors for operations like:

- create
- edit
- enable or disable
- reset password
- assign roles
- assign menus

## System Management Boundaries

The first phase limits management capabilities to the minimum set needed for a usable system.

### Platform Side

Platform administrators can manage:

- tenants
- global menu definitions

The first phase platform UI includes:

- tenant management page
- menu management page

Platform administrator account management is not part of the first phase. The system starts with a seeded built-in platform administrator account.

### Tenant Side

Tenant administrators can manage data within their own tenant only.

The first phase tenant UI includes:

- user management page
- role management page

Available operations include:

- create
- edit
- enable or disable
- assign roles
- assign menus
- reset password

## Data Model

### `sys_tenant`

Keep the existing numeric primary key as the internal tenant isolation key.

Add:

- `code` with global uniqueness

The tenant code is the user-facing tenant account value used at login. Example style:

- `freshmart-sh`

The login input uses `tenantCode`, while internal authorization and data isolation continue to use numeric `tenantId`.

### `sys_platform_user`

Add a dedicated table for platform administrators instead of forcing platform accounts into tenant-scoped user tables.

Minimum fields:

- `id`
- `username`
- `password`
- `nickname`
- `status`
- audit fields

The first phase only requires seed data and authentication support for this table.

### Tenant-Scoped Identity Tables

Continue using the existing tenant-scoped model:

- `sys_user`
- `sys_role`
- `sys_user_role`
- `sys_role_menu`

These remain the source for tenant user and role management.

### `sys_menu`

Add a `scope` field with values:

- `platform`
- `tenant`
- `both`

This allows one menu table to support both management domains while keeping authorization logic explicit.

Rules:

- platform administrators can receive `platform` and `both`
- tenant roles can only receive `tenant` and `both`

## API Design

### Authentication Endpoints

- `POST /api/v1/admin/auth/platform-login`
- `POST /api/v1/admin/auth/tenant-login`
- `GET /api/v1/admin/auth/session`

The session endpoint returns the current authenticated context:

- user
- login scope
- tenant info when applicable
- menu tree
- permissions

### Platform Endpoints

- `GET /api/v1/admin/tenant/page`
- `POST /api/v1/admin/tenant`
- `PUT /api/v1/admin/tenant/{id}`
- `PUT /api/v1/admin/tenant/{id}/status`
- `GET /api/v1/admin/menu/tree`
- `POST /api/v1/admin/menu`
- `PUT /api/v1/admin/menu/{id}`

### Tenant Endpoints

- `GET /api/v1/admin/user/page`
- `POST /api/v1/admin/user`
- `PUT /api/v1/admin/user/{id}`
- `PUT /api/v1/admin/user/{id}/status`
- `PUT /api/v1/admin/user/{id}/reset-password`
- `PUT /api/v1/admin/user/{id}/roles`
- `GET /api/v1/admin/role/page`
- `POST /api/v1/admin/role`
- `PUT /api/v1/admin/role/{id}`
- `PUT /api/v1/admin/role/{id}/status`
- `PUT /api/v1/admin/role/{id}/menus`

## Frontend Design

The first phase reuses the existing `admin-web` structure and replaces mock authentication behavior with a real session model.

### Login Experience

The login page provides two entry modes:

- platform administrator login
- tenant administrator login

This can be implemented as tabs or a simple switcher.

### Session Storage

The frontend stores a single session snapshot:

- `token`
- `loginScope`
- `user`
- `tenant`
- `menuTree`
- `permissions`

The frontend should not treat a local `tenantId` value as an authority. The backend must derive tenant context from the authenticated token wherever possible.

### App Boot

When a token exists locally, application startup performs session restoration:

1. call `GET /api/v1/admin/auth/session`
2. if successful, refresh the local auth store
3. if unauthorized, clear local auth state and redirect to login

This prevents false logged-in states based only on the presence of a token string.

### Route Guards

Frontend route protection uses two layers:

1. authenticated or unauthenticated
2. authorized or unauthorized for the target page

Expected behavior:

- unauthenticated users cannot enter admin routes
- users without page permission go to `403`
- unknown routes go to `404`

### Dynamic Menus

Sidebar rendering is based on the backend-delivered menu tree. Static route definitions may remain in the codebase, but menu visibility and page access are controlled by the session data delivered by the backend.

### Scope of First-Phase Frontend Permission Wiring

The first phase fully wires permissions for:

- tenant management
- menu management
- user management
- role management

Existing ERP business pages outside this system-management slice can remain in place with basic authenticated access first. Their fine-grained permission integration can be expanded later.

## Error Handling

The backend must standardize authentication and business error responses.

Minimum behaviors:

- `401`: unauthenticated or expired token
- `403`: authenticated but unauthorized
- validation errors: consistent structured response
- business errors: consistent structured response

The frontend must centrally handle:

- `401`: clear session and redirect to login
- `403`: redirect to forbidden page
- other errors: show usable feedback messages

## Production Baseline For Phase One

These items are part of the first phase because they directly support real login and operational readiness.

### Logging And Rotation

Add service-level file logging with rolling policies.

Minimum requirements:

- separate log files per service
- time-based rolling
- file size limit
- retention period
- separate application and error logs when practical

### Health And Basic Monitoring

Add `spring-boot-starter-actuator` and expose at least:

- `health`
- `info`
- `metrics`

This is required for basic operational checks for gateway and system services.

### Environment Profiles

Define at least:

- `local`
- `dev`
- `prod`

Secrets and environment-specific connection settings such as database, Redis, Nacos, JWT secrets, and log paths must not stay flattened into a single default profile.

### Seed Data

The project must define reproducible initial data for:

- built-in platform administrator
- example tenant
- example tenant administrator
- base menus
- base roles

This can be done through SQL initialization or startup seeding, but the result must be deterministic and documented.

### Minimum Regression Coverage

The first phase must include focused tests for:

- backend authentication flow
- scope and permission boundary behavior
- frontend login-state restoration
- frontend route-guard behavior

## Second-Phase Items

The following remain explicitly out of scope for the first phase and should be planned separately:

- complete Spring Cloud governance
- configuration center normalization across all services
- service-to-service policy and resilience tooling
- Prometheus, tracing, and broader observability stack
- Dockerfile, CI/CD, Helm, or Kubernetes delivery assets
- stronger security controls such as login throttling, password policies, and audit analysis

## Recommended Implementation Order

The recommended order is:

1. backend authentication model changes
2. backend session and permission payloads
3. platform tenant management and tenant user or role management APIs
4. frontend real login, session restore, route guards, and dynamic menus
5. logging, actuator, profile separation, and unified exception handling
6. focused regression tests

This sequence delivers real business value early by making authentication and authorization correct before spending time on broader production hardening.
