# Supermarket ERP

Multi-tenant SaaS supermarket ERP system.

## Quick Start

1. Start infrastructure: `docker compose -f docker/docker-compose.yml up -d`
2. Build: `mvn clean package -DskipTests`
3. Run system service: `mvn spring-boot:run -pl erp-module-system/erp-module-system-biz`
4. Run gateway: `mvn spring-boot:run -pl erp-gateway`

## Default Credentials

- Username: `admin`
- Password: `admin123`
- Tenant ID: `1`
