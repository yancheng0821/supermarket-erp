# Supermarket ERP

Multi-tenant SaaS supermarket ERP system.

## Quick Start

Before starting, export the required local secrets into your shell:

```bash
export ERP_DB_PASSWORD='replace-with-your-local-db-password'
export ERP_JWT_SECRET='replace-with-a-32-plus-char-jwt-secret'
```

1. Start infrastructure: `docker compose -f docker/docker-compose.yml up -d`
2. If you are reusing an existing local MySQL volume, apply the auth/schema upgrade once:
   `/Users/aisenyc/anaconda3/bin/mysql -h 127.0.0.1 -P 3306 -u root -p"${ERP_DB_PASSWORD}" supermarket_erp < docker/mysql/upgrade-system-auth-phase1.sql`
3. Build: `mvn clean package -DskipTests`
4. Run `erp-system`: `./scripts/run-local-system.sh`
5. Run `erp-gateway`: `./scripts/run-local-gateway.sh`
6. Smoke test request correlation and unauthenticated response flow: `./scripts/smoke-local-auth.sh`

## Local Baseline

- Java 17+ is required. The startup scripts try to auto-detect a Java 17+ installation on macOS through `/usr/libexec/java_home`; if that fails, set `JAVA_HOME` manually before running them.
- `local` startup for `erp-system` and `erp-gateway` no longer requires a local Nacos instance for standalone development.
- Required local dependencies for the current auth and logging baseline are MySQL (`3306`) and Redis (`6379`).
- `ERP_DB_PASSWORD` and `ERP_JWT_SECRET` must be set in the shell before starting local services. `docker compose` can also read them from a root `.env` file, but the Maven startup scripts rely on your current shell environment.
- Default local ports:
  - `erp-system`: `8080`
  - `erp-gateway`: `9000`
- Override ports when needed:
  - `SYSTEM_PORT=18080 ./scripts/run-local-system.sh`
  - `SYSTEM_PORT=18080 GATEWAY_PORT=19000 ./scripts/run-local-gateway.sh`
  - `SYSTEM_PORT=18080 GATEWAY_PORT=19000 ./scripts/smoke-local-auth.sh`
- If your shell has `http_proxy` or `https_proxy` configured, use the provided smoke script instead of raw `curl`. It already adds `--noproxy '*'` for localhost.

## Profiles

- `local`: local MySQL + Redis, service registration and Nacos config disabled for standalone runs, log path defaults to `./logs`, JWT secret still comes from `ERP_JWT_SECRET`
- `dev`: environment variables drive datasource, JWT secret, and Nacos addresses
- `prod`: all datasource, JWT secret, and Nacos settings must be provided by environment variables

## Health And Logs

- `erp-system` health: `GET /actuator/health`
- `erp-gateway` health: `GET /actuator/health`
- `erp-system` logs: `${ERP_SYSTEM_LOG_PATH:-./logs/erp-system}`
- `erp-gateway` logs: `${ERP_GATEWAY_LOG_PATH:-./logs/erp-gateway}`
- When started through the provided scripts, the effective default log directories are:
  - `erp-module-system/erp-module-system-biz/logs/erp-system`
  - `erp-gateway/logs/erp-gateway`
- Request lifecycle logs are written to `access.log`; application errors are written to `error.log`.

## Default Credentials

- Platform username: `platform-admin`
- Platform password: `admin123`
- Tenant code: `freshmart-sh`
- Tenant username: `admin`
- Tenant password: `admin123`
