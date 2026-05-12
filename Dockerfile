# ============================================================================
# Stage 1: Builder - compile and pack all custom packages + resolve deps
# ============================================================================
FROM gkousiou/hellokubeunp as builder

USER root

WORKDIR /build

# ---- Copy source packages (no package.json/lock yet — we install from tgz) ----
COPY node-red-contrib-custom-icons/ ./node-red-contrib-custom-icons/
COPY human_ai_benchmark_suite/       ./human_ai_benchmark_suite/
COPY kubeflow_pipelines_api/         ./kubeflow_pipelines_api/
COPY node-red-contrib-humaine/       ./node-red-contrib-humaine/

# ---- Build & pack each custom package ---------------------------------------

# 1) node-red-contrib-custom-icons — JS-only, no build step, just pack
WORKDIR /build/node-red-contrib-custom-icons
RUN npm pack

# 2) human_ai_benchmark_suite — TypeScript, rebuild to ensure clean dist
WORKDIR /build/human_ai_benchmark_suite
RUN npm run build
RUN npm pack

# 3) kubeflow_pipelines_api — TypeScript, rebuild to ensure clean dist
WORKDIR /build/kubeflow_pipelines_api
RUN npm run build
RUN npm pack

# 4) node-red-contrib-humaine — rollup + tsc via yarn, then remove dist
WORKDIR /build/node-red-contrib-humaine
RUN npm install           # needs devDeps (rollup, tsc, copyfiles) for build
RUN yarn build
RUN npm pack
RUN rm -rf dist          # clean up compiled TS output (matching devcontainer_setup.sh)

# ---- Install root-level production dependencies from packed tgz files --------
# Don't COPY package-lock.json — it has stale integrity checksums for the freshly-built .tgz files.
# Let npm generate a fresh lock with correct hashes during this build step.
WORKDIR /build
COPY package.json ./
RUN npm install --omit=dev

# ============================================================================
# Stage 2: Runtime - clean Node-RED image with all nodes pre-installed
# ============================================================================
FROM gkousiou/hellokubeunp

USER root

WORKDIR /data

# Copy production node_modules from builder (no build tools, no tgz sources)
COPY --from=builder /build/node_modules ./node_modules

# Set ownership to jovyan user (UID 1000)
RUN chown -R 1000:1000 /data

# Copy entrypoint script and default-flow templates
COPY entrypoint.sh    /entrypoint.sh
COPY default-flows/       /default-flows/

RUN chmod +x /entrypoint.sh && \
    chown -R 1000:1000 /entrypoint.sh /default-flows

USER 1000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "/usr/src/node-red/node_modules/node-red/red.js", "--userDir", "/data"]
