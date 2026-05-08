# HumAIne Node-RED

## Context
Part of an ongoing PhD candidacy and the HumAIne research project. This Node-RED instance provides flow-based orchestration for Human-AI collaboration benchmarking workflows developed as part of doctoral research.

## Project Overview
Node-RED integration for the HumAIne project. Provides flow-based orchestration of Human-AI collaboration benchmarking workflows, connecting the HAIC Benchmark Suite backend, KubeFlow Pipelines, MinIO storage, and RabbitMQ messaging.

## Architecture
```
humaine-node-red/
├── flows.json                    # Main Node-RED flow definitions (multiple tabs) - stays active
├── settings.js                   # Node-RED runtime configuration (mostly commented out default)
├── package.json                  # Root dependencies (local tgz packages + npm)
├── Dockerfile                    # Container build for production
├── docker-compose.yml            # Default dev compose (ports 1880)
├── prod.docker-compose.yml       # Production compose configuration
├── dev.docker-compose.yml        # Dev compose variant
├── human_ai_benchmark_suite/     # OLD swagger-generated TS API client (will be deleted)
├── kubeflow_pipelines_api/       # OLD KubeFlow TS client (kept until replaced by new pattern)
├── node-red-contrib-humaine/     # ACTIVE: Custom NR nodes + HAIC API client (primary dev location)
│   ├── nodes/
│   │   ├── haic-config/          # HAIC configuration node
│   │   ├── haic-logger/          # HAIC logging node
│   │   ├── ai-environment-config/# AI environment config node
│   │   └── shared/               # Shared helpers/types
│   └── haic_client/              # HAIC API client (TypeScript, generated from OpenAPI)
├── node-red-contrib-custom-icons/ # DEPRECATED - icons moving into respective clients
├── node-red-node-typescript-starter/ # TS node scaffolding template (gitignored contents)
├── openapi_integration/          # OpenAPI specs (HAIC + KubeFlow) used to generate API clients
├── guides/                       # Reference docs (some may need updates/deletions)
│   ├── Creating Custom NR Nodes.md
│   ├── Project Development Notes.md
│   ├── healthentia.md
│   └── Smart Healthcare_agents_objects_log_map.md
├── scripts/dev/                  # Dev helper scripts (see below for usage)
│   ├── new_node-red_node.sh      # Scaffold a new Node-RED custom node
│   ├── regenerate_ts_api_clients.sh  # Regenerate TS API clients from OpenAPI specs
│   ├── rebuild_humaine_nodes.sh        # Rebuild node-red-contrib-humaine packages
│   └── dev_logs_tail.sh                  # Tail development logs
├── .vscode/                      # VS Code editor settings
├── .devcontainer/                # Dev container setup (devcontainer.json + devcontainer_setup.sh)
├── lib/                          # (lib/flows/ is empty - remove this directory)
├── .config.nodes.json            # NR runtime auto-generated config
├── .config.runtime.json          # NR runtime auto-generated config
├── .config.users.json            # NR users config
├── flows_cred.json               # Node-RED credentials (gitignored)
├── .backup files                 # Backup copies of configs and credentials
└── *.temp.*                      # Temporary working files (keep gitignored)
```

## Root-Level Files
| File | Purpose |
|------|---------|
| `flows.json` | Main orchestrator flows + subflows. **Stays active.** Only the subflow-based clients in node-red-contrib-custom-icons are being decommissioned and replaced by new nodes in node-red-contrib-humaine. |
| `settings.js` | Node-RED runtime config (default template, mostly commented out) |
| `.env` | Environment variables (MinIO, Keycloak, DB, etc.) — gitignored |
| `package.json` | Root dependencies with local file: references to tgz packages |

## Docker Compose Differentiation
| File | Purpose |
|------|---------|
| `docker-compose.yml` | Default development compose (ports 1880) |
| `dev.docker-compose.yml` | Development variant compose |
| `prod.docker-compose.yml` | Production deployment compose |

## Deprecated / Legacy Items
| Item | Status | Notes |
|------|--------|-------|
| `human_ai_benchmark_suite/` | **Legacy** - will be deleted | Old swagger-generated TS API client for HAIC backend |
| `kubeflow_pipelines_api/` | **Legacy** - keep until replaced | Old KubeFlow client; replace with new one following node-red-contrib-humaine/haic_client principles |
| `node-red-contrib-custom-icons` | **Deprecated** | Icons being moved into their respective clients |

## Active Development Areas
### node-red-contrib-humaine (primary)
Custom Node-RED nodes and HAIC API client. This is where new nodes should be developed:
- **haic-config**: Configures connection to HAIC Benchmark Suite backend
- **haic-logger**: Logs interaction data to HAIC backend
- **ai-environment-config**: Manages AI environment configurations
- **haic_client/**: Generated TS API client for HAIC backend (from OpenAPI specs)

### node-red-node-typescript-starter (template)
TypeScript scaffolding template for creating new custom Node-RED nodes. Contents are gitignored.

## Key Dependencies
- **human_ai_benchmark_suite** (local, legacy): TS API client for the HAIC Benchmark Suite FastAPI backend
- **kubeflow_pipelines_api** (local, legacy): TS API client for KubeFlow Pipelines
- **node-red-contrib-humaine** (local, active): Custom nodes + HAIC API client
- @greyorange/node-red-contrib-amqp: RabbitMQ integration
- @reggae_ulli/node-red-contrib-minio-all-fix: MinIO S3 storage
- @flowfuse/node-red-dashboard: Node-RED dashboard

## Flows (tabs in flows.json)
1. **HumAIne New Nodes Test** - Testing new custom nodes
2. **Feedback Consolidation Pattern** - Collecting and consolidating feedback
3. **HAIC Client Example** - HAIC API client usage examples
4. **KF Client Dynamic Triggering examples** - KubeFlow dynamic pipeline triggering
5. **KF Client Schedule** - KubeFlow scheduled pipeline runs
6. **Demo App Triggers** - Demo application trigger flows
7. **HAIC Client Dev+Tests** - Development and testing flows
8. **Demo App Flow** - Main demo application flow
9. **Flow 1/2/3** - Additional flow definitions

## Subflows (to be decommissioned, replaced by new nodes)
- **KubeFlow Pipelines Configuration** (KFP config) → replace with node in node-red-contrib-humaine
- **Pipeline Trigger** (dynamic triggering) → replace with node in node-red-contrib-humaine
- **Pipeline Run Results** (result polling) → replace with node in node-red-contrib-humaine
- **Recurring Pipeline Schedule** (scheduled runs) → replace with node in node-red-contrib-humaine
- **Recurring Pipeline Event Listener** (event-based monitoring) → replace with node in node-red-contrib-humaine
- **Evaluation Config** (HAIC evaluation config CRUD) → replace with node in node-red-contrib-humaine
- **Access Evaluation Logs** (log retrieval) → replace with node in node-red-contrib-humaine
- **Evaluation Trigger** (evaluation triggering) → replace with node in node-red-contrib-humaine
- **Access Evaluation Results** (result retrieval) → replace with node in node-red-contrib-humaine

## Development Scripts (`scripts/dev/`)
| Script | Purpose |
|--------|---------|
| `new_node-red_node.sh` | Scaffold a new Node-RED custom node from the TypeScript template |
| `regenerate_ts_api_clients.sh` | Regenerate TypeScript API clients from OpenAPI specs in `openapi_integration/` |
| `rebuild_humaine_nodes.sh` | Rebuild and repack `node-red-contrib-humaine` packages (tgz) |
| `dev_logs_tail.sh` | Tail development logs for debugging |

## Running
```bash
# Dev (default docker-compose.yml)
docker-compose up

# Production
docker-compose -f prod.docker-compose.yml up

# Dev variant
docker-compose -f dev.docker-compose.yml up
```

## HAIC Backend Integration
- Base URL: `https://benchmark.humaine-horizon.eu/` (production)
- AMQP broker: `rabbitmq-console.humaine-horizon.euost` (port 5672, TLS)
- MinIO: `s3-minio.humaine-horizon.eu` (bucket: benchmarking-suite)
- WebSocket endpoints for real-time feedback push

## Development Notes
- Local packages must be built and packed as tgz before install
- `node-red-contrib-humaine` uses TypeScript with rollup for editor bundle
- The Dockerfile has TODOs for completing the build process
- flows.json contains extensive Node-RED flow definitions (stays active)
- Credentials are backed up as `.backup` files
- Temp files (*.temp.*, data.temp/*, tsconfig.prev.temp.json, OLD.package-lock.temp.json) should remain gitignored
- .vscode/ and .devcontainer/ contain editor/dev container configurations
- When recreating or rebuilding anything, check `scripts/dev/` for existing helper scripts first
