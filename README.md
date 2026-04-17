# 超市 ERP

一个面向连锁超市场景的多租户 SaaS ERP 项目，当前仓库同时包含：

- Spring Boot / Spring Cloud 后端基础工程
- React + Vite 管理后台前端
- 本地开发所需的 Docker 基础设施
- 登录、权限、日志链路、异常治理等生产基线能力

## 项目定位

这个项目的目标不是只做一个“管理后台模板”，而是逐步沉淀出一套适用于超市零售业务的完整 ERP 底座，覆盖：

- 平台侧租户管理
- 租户侧组织与权限体系
- 商品、门店、仓库、供应商等主数据
- 库存、采购、运营、会员、线上业务、分析、财务等业务模块

目前仓库已经具备比较完整的工程骨架，并且核心的认证授权、网关转发、异常响应、日志链路、前端多语言和后台路由骨架已经落地。  
其中 `system` 模块是当前后端实现最完整的一块，其他业务模块大多已经建好目录和前端页面入口，但后端业务实现仍会继续补齐。

## 当前进度

### 已落地

- 后端 Maven 多模块工程
- Spring Cloud Gateway 网关入口
- `system` 模块的登录、会话、平台/租户权限控制
- 平台管理能力：
  - 租户管理
  - 菜单管理
- 租户管理能力：
  - 用户管理
  - 角色管理
- 全局异常处理与统一 JSON 错误响应
- 请求 ID 透传、访问日志、错误日志分流
- 本地开发脚本：
  - `erp-system`
  - `erp-gateway`
  - 8 个业务服务本地启动脚本
  - 一键启动 / 停止 / 查看本地后端联调栈
  - `system/gateway` 认证链路 smoke 脚本
  - 全服务健康检查 smoke 脚本
- GitHub Actions CI 骨架
- Dockerfile 与 compose 叠加部署骨架
- 前端后台页面骨架
- 前端中英文国际化基础与静态文案治理

### 已有前端页面/路由骨架

- 平台管理：租户、菜单
- 系统管理：用户、角色
- 档案管理：门店、仓库、供应商、商品、分类
- 库存管理：库存、入库、出库、调拨、盘点
- 采购管理：采购单、补货建议
- 运营管理：销售、退款、支付、收银班次
- 会员管理：会员、积分、优惠券
- 线上业务：商品、配送、门店配置
- 数据分析：日销售、商品销售、库存分析
- 财务管理：费用、门店结算、供应商结算、凭证

### 当前需要继续补的部分

- 除 `system` 以外的大部分业务模块后端逻辑仍需继续实现
- 前端页面中部分模块目前仍以页面骨架和演示数据为主
- 业务流、报表、任务调度、审计追踪等还需要逐步深化

## 技术栈

### 后端

- Java 17
- Maven
- Spring Boot 3.2.5
- Spring Cloud Gateway
- Spring Security
- MyBatis-Plus
- MySQL 8
- Redis 7
- Nacos
- JWT
- Logback

### 前端

- React 19
- TypeScript
- Vite
- TanStack Router
- TanStack Query
- Zustand
- i18next / react-i18next
- Tailwind CSS 4
- Vitest

## 项目结构

```text
supermarket-erp/
├── .github/workflows/          # CI 工作流
├── admin-web/                  # React 管理后台
├── docker/                     # 本地基础设施与数据库初始化脚本
├── erp-dependencies/           # 统一依赖管理
├── erp-framework/              # 通用基础框架
│   ├── erp-common
│   ├── erp-spring-boot-starter-mybatis
│   ├── erp-spring-boot-starter-redis
│   ├── erp-spring-boot-starter-security
│   ├── erp-spring-boot-starter-tenant
│   └── erp-spring-boot-starter-web
├── erp-gateway/                # 网关服务
├── erp-module-system/          # 系统模块（当前最完整）
├── erp-module-archive/         # 档案模块
├── erp-module-inventory/       # 库存模块
├── erp-module-purchase/        # 采购模块
├── erp-module-operation/       # 运营模块
├── erp-module-member/          # 会员模块
├── erp-module-online/          # 线上模块
├── erp-module-analytics/       # 分析模块
├── erp-module-finance/         # 财务模块
├── scripts/                    # 本地启动与 smoke 测试脚本
└── pom.xml                     # 根聚合工程
```

## 核心能力说明

### 1. 认证与权限

当前后端已经支持两种登录域：

- 平台登录：面向平台管理员
- 租户登录：面向租户管理员

登录成功后会返回 JWT，并在服务端解析出：

- 用户 ID
- 租户 ID
- 登录域
- 权限集合

当前权限边界已经覆盖：

- 平台管理员访问平台租户/菜单接口
- 租户管理员访问用户/角色接口
- 越权访问返回统一 `403 Forbidden`

### 2. 异常治理

系统已经统一收口常见异常，返回统一 JSON 结构，避免默认白页或 HTML 错误响应：

- 参数校验异常
- 参数类型不匹配
- 业务异常
- 未认证异常
- 无权限异常
- 未知异常

### 3. 日志链路

当前日志治理包含：

- 请求进入/完成日志
- `X-Request-Id` 透传与自动补齐
- 网关到业务服务的请求链路关联
- `access.log` 与 `error.log` 分流
- 本地文件日志路径可配置

### 4. 前端基线

前端已经完成以下基础能力：

- 中英文切换
- 登录态存储
- 基于权限的路由守卫
- 平台侧与系统侧页面结构
- 关键页面的国际化测试覆盖

## 环境要求

### 必需软件

- Java 17 或更高版本
- Maven 3.9+
- Node.js 20+（建议）
- npm 或 pnpm
- Docker / Docker Compose

### 本地依赖

- MySQL：`3306`
- Redis：`6379`
- Nacos：`8848`

说明：

- 本地 `erp-system` 与 `erp-gateway` 使用 `local` profile 时，不依赖 Nacos 注册发现即可单机启动。
- `docker compose` 中仍保留了 Nacos 服务，便于后续联调 `dev` / `prod` 风格配置。

## 快速开始

### 1. 准备环境变量

建议先复制根目录环境样例：

```bash
cp .env.example .env
```

根目录启动脚本会自动加载 `.env`。如果你不想使用 `.env`，也可以直接在当前 shell 中导出本地开发变量：

```bash
export ERP_DB_PASSWORD='替换成你的本地数据库密码'
export ERP_JWT_SECRET='替换成长度至少 32 位的 JWT 密钥'
```

注意：因为启动脚本会直接 `source .env`，所以 `.env` 内容要保持 shell 赋值语法；像 JDBC URL 这类带 `&` 的值请用引号包起来。

如果你还需要调整本地联调端口，可以一并修改：

```bash
SYSTEM_PORT=8080
ARCHIVE_PORT=8081
INVENTORY_PORT=8082
PURCHASE_PORT=8083
OPERATION_PORT=8084
MEMBER_PORT=8085
ONLINE_PORT=8086
FINANCE_PORT=8087
ANALYTICS_PORT=8088
GATEWAY_PORT=9000
```

### 2. 启动基础设施

```bash
docker compose -f docker/docker-compose.yml up -d
```

默认会启动：

- MySQL 8
- Redis 7
- Nacos 2.3.2

### 3. 初始化或升级数据库

首次初始化时，MySQL 会自动执行：

- `docker/mysql/init.sql`

如果你是在已有本地数据卷上继续开发，并且需要补齐认证/权限结构升级，请手动执行：

```bash
mysql -h 127.0.0.1 -P 3306 -u root -p"${ERP_DB_PASSWORD}" supermarket_erp < docker/mysql/upgrade-system-auth-phase1.sql
```

### 4. 编译后端

```bash
mvn clean package -DskipTests
```

### 5. 启动后端服务

最小认证链路：

```bash
./scripts/run-local-system.sh
./scripts/run-local-gateway.sh
```

如果要联调具体业务模块，可以按需启动对应服务：

```bash
./scripts/run-local-archive.sh
./scripts/run-local-inventory.sh
./scripts/run-local-purchase.sh
./scripts/run-local-operation.sh
./scripts/run-local-member.sh
./scripts/run-local-online.sh
./scripts/run-local-finance.sh
./scripts/run-local-analytics.sh
```

常用自定义方式：

```bash
SYSTEM_PORT=18080 ./scripts/run-local-system.sh
ARCHIVE_PORT=18081 ./scripts/run-local-archive.sh
SYSTEM_PORT=18080 ARCHIVE_PORT=18081 GATEWAY_PORT=19000 ./scripts/run-local-gateway.sh
./scripts/run-local-online.sh --logging.level.root=DEBUG
```

如果希望一键拉起最小后端联调栈，可以直接执行：

```bash
./scripts/start-local-stack.sh
./scripts/status-local-stack.sh
./scripts/stop-local-stack.sh
```

如果要一次性拉起全部后端服务：

```bash
./scripts/start-local-stack.sh all
```

这些脚本会把运行时状态写到：

- `.runtime/pids/`
- `.runtime/logs/`

### 6. 启动前端

```bash
cd admin-web
corepack enable
pnpm install
pnpm dev
```

前端默认地址：

- `http://localhost:3000`

Vite 已经把 `/api` 代理到：

- `http://localhost:9000`

也就是说，推荐本地联调链路为：

`admin-web(3000) -> erp-gateway(9000) -> erp-system(8080)`

如果要联调某个业务模块，请额外启动对应服务，默认链路为：

`admin-web(3000) -> erp-gateway(9000) -> 目标业务服务(8081~8088)`

### 7. 运行本地 smoke 验证

```bash
./scripts/smoke-local-auth.sh
./scripts/smoke-local-services.sh
```

`smoke-local-auth.sh` 会依次验证：

- `erp-system` 健康检查
- `erp-system` 未登录会话响应
- `erp-gateway` 健康检查
- `erp-gateway` 未登录会话响应

`smoke-local-services.sh` 会依次验证：

- `erp-system`
- `erp-archive`
- `erp-inventory`
- `erp-purchase`
- `erp-operation`
- `erp-member`
- `erp-online`
- `erp-finance`
- `erp-analytics`

### 8. 容器化联调 / 部署骨架

如果你想直接用容器把基础设施、后端服务和前端一起拉起来，可以使用 compose 叠加文件：

```bash
docker compose \
  -f docker/docker-compose.yml \
  -f docker/docker-compose.apps.yml \
  up -d --build
```

停止整套容器：

```bash
docker compose \
  -f docker/docker-compose.yml \
  -f docker/docker-compose.apps.yml \
  down
```

这套 compose 骨架默认包含：

- MySQL / Redis / Nacos
- `erp-system`
- `erp-archive`
- `erp-inventory`
- `erp-purchase`
- `erp-operation`
- `erp-member`
- `erp-online`
- `erp-finance`
- `erp-analytics`
- `erp-gateway`
- `admin-web`

默认日志会映射到仓库根目录下的 `logs/`。

## 默认本地账号

以下账号仅用于本地初始化数据验证：

- 平台账号：`platform-admin`
- 平台密码：`admin123`
- 租户编码：`freshmart-sh`
- 租户账号：`admin`
- 租户密码：`admin123`

建议：

- 仅在本地开发环境使用
- 公网环境务必替换初始化账号和密码

## 配置说明

### Profile 说明

- `local`
  - 本地 MySQL + Redis
  - 禁用 Nacos 配置与服务注册
  - 适合单机开发
- `dev`
  - 通过环境变量配置数据源与 Nacos
  - 适合集成环境
- `prod`
  - 所有关键配置均从环境变量注入
  - 不提供仓库内默认密钥

### 关键环境变量

| 变量名 | 说明 |
| --- | --- |
| `ERP_DB_URL` | 数据库连接串 |
| `ERP_DB_USERNAME` | 数据库用户名 |
| `ERP_DB_PASSWORD` | 数据库密码 |
| `ERP_JWT_SECRET` | JWT 签名密钥，至少 32 位 |
| `NACOS_SERVER_ADDR` | Nacos 地址 |
| `ERP_RUNTIME_PROFILE` | 容器化运行时使用的 Spring profile，默认 `prod` |
| `ERP_REDIS_HOST` | Redis 主机，容器化默认 `redis` |
| `ERP_REDIS_PORT` | Redis 端口，容器化默认 `6379` |
| `ARCHIVE_PORT` | 本地档案服务端口 |
| `INVENTORY_PORT` | 本地库存服务端口 |
| `PURCHASE_PORT` | 本地采购服务端口 |
| `OPERATION_PORT` | 本地运营服务端口 |
| `MEMBER_PORT` | 本地会员服务端口 |
| `ONLINE_PORT` | 本地线上服务端口 |
| `FINANCE_PORT` | 本地财务服务端口 |
| `ANALYTICS_PORT` | 本地分析服务端口 |
| `ERP_SYSTEM_LOG_PATH` | `erp-system` 日志目录 |
| `ERP_ARCHIVE_LOG_PATH` | `erp-archive` 日志目录 |
| `ERP_INVENTORY_LOG_PATH` | `erp-inventory` 日志目录 |
| `ERP_PURCHASE_LOG_PATH` | `erp-purchase` 日志目录 |
| `ERP_OPERATION_LOG_PATH` | `erp-operation` 日志目录 |
| `ERP_MEMBER_LOG_PATH` | `erp-member` 日志目录 |
| `ERP_ONLINE_LOG_PATH` | `erp-online` 日志目录 |
| `ERP_FINANCE_LOG_PATH` | `erp-finance` 日志目录 |
| `ERP_ANALYTICS_LOG_PATH` | `erp-analytics` 日志目录 |
| `ERP_GATEWAY_LOG_PATH` | `erp-gateway` 日志目录 |
| `SYSTEM_PORT` | 本地 system 服务端口 |
| `GATEWAY_PORT` | 本地 gateway 服务端口 |
| `ADMIN_WEB_PORT` | 容器化前端映射端口 |

## 健康检查与日志

### 健康检查

所有后端服务都已暴露：

- `GET /actuator/health`
- `GET /actuator/info`

默认直连端口如下：

- `erp-system`: `8080`
- `erp-archive`: `8081`
- `erp-inventory`: `8082`
- `erp-purchase`: `8083`
- `erp-operation`: `8084`
- `erp-member`: `8085`
- `erp-online`: `8086`
- `erp-finance`: `8087`
- `erp-analytics`: `8088`
- `erp-gateway`: `9000`

### 默认日志路径

- `erp-system`: `${ERP_SYSTEM_LOG_PATH:-./logs/erp-system}`
- `erp-archive`: `${ERP_ARCHIVE_LOG_PATH:-./logs/erp-archive}`
- `erp-inventory`: `${ERP_INVENTORY_LOG_PATH:-./logs/erp-inventory}`
- `erp-purchase`: `${ERP_PURCHASE_LOG_PATH:-./logs/erp-purchase}`
- `erp-operation`: `${ERP_OPERATION_LOG_PATH:-./logs/erp-operation}`
- `erp-member`: `${ERP_MEMBER_LOG_PATH:-./logs/erp-member}`
- `erp-online`: `${ERP_ONLINE_LOG_PATH:-./logs/erp-online}`
- `erp-finance`: `${ERP_FINANCE_LOG_PATH:-./logs/erp-finance}`
- `erp-analytics`: `${ERP_ANALYTICS_LOG_PATH:-./logs/erp-analytics}`
- `erp-gateway`: `${ERP_GATEWAY_LOG_PATH:-./logs/erp-gateway}`

通过启动脚本运行时，默认实际落盘位置通常为：

- `erp-module-system/erp-module-system-biz/logs/erp-system`
- `erp-gateway/logs/erp-gateway`

### 日志文件类型

- `access.log`：请求访问链路
- `error.log`：异常与错误日志

## 测试命令

### 前端

```bash
cd admin-web
pnpm lint
pnpm test -- --run
pnpm build
```

说明：当前前端 lint 已恢复为 CI 阻断项，提交前建议至少执行一次 `pnpm lint && pnpm test -- --run && pnpm build`。

### 后端

```bash
java -version
mvn -pl erp-gateway,erp-module-archive/erp-module-archive-biz,erp-module-inventory/erp-module-inventory-biz,erp-module-purchase/erp-module-purchase-biz,erp-module-operation/erp-module-operation-biz,erp-module-member/erp-module-member-biz,erp-module-online/erp-module-online-biz,erp-module-analytics/erp-module-analytics-biz,erp-module-finance/erp-module-finance-biz -am test -Dsurefire.failIfNoSpecifiedTests=false -Dtest=LocalGatewayConfigTest,ArchiveProductionBaselineConfigTest,InventoryProductionBaselineConfigTest,PurchaseProductionBaselineConfigTest,OperationProductionBaselineConfigTest,MemberProductionBaselineConfigTest,OnlineProductionBaselineConfigTest,AnalyticsProductionBaselineConfigTest,FinanceProductionBaselineConfigTest
```

执行前请确认 `java -version` 输出为 `17` 或更高版本。

### 脚本校验

```bash
bash -n scripts/*.sh scripts/lib/*.sh
./scripts/run-local-system.sh --help
./scripts/run-local-gateway.sh --help
./scripts/run-local-archive.sh --help
./scripts/start-local-stack.sh --help
./scripts/status-local-stack.sh --help
./scripts/stop-local-stack.sh --help
./scripts/smoke-local-services.sh --help
```

### Compose 配置校验

```bash
ERP_DB_PASSWORD='replace-me' \
ERP_JWT_SECRET='replace-with-at-least-32-characters' \
docker compose -f docker/docker-compose.yml -f docker/docker-compose.apps.yml config >/dev/null
```

## CI 说明

仓库已内置 [`.github/workflows/ci.yml`](.github/workflows/ci.yml)，默认在 `push main` 和 `pull_request` 时执行：

- 后端基线测试
- 前端依赖安装、Vitest、build
- Shell 脚本语法校验
- compose 配置语法校验

## 开发建议

### 推荐联调顺序

1. 启动 MySQL / Redis / Nacos
2. 启动 `erp-system`
3. 按需启动目标业务服务
4. 启动 `erp-gateway`
5. 启动 `admin-web`
6. 运行 `smoke-local-auth.sh` 和 `smoke-local-services.sh`
7. 再开始做页面或接口联调

### 当前文档定位

这份 README 主要回答三个问题：

- 这个项目现在做到哪一步了
- 本地怎么把前后端跑起来
- 已有的工程能力和模块边界是什么

后续如果继续推进，会再补：

- 数据库表设计说明
- API 文档入口说明
- 多租户隔离策略说明
- 发布与部署说明
- 模块开发规范
