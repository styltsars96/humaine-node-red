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

# Copy package.json and its generated lock file into /defaults for lazy-init
RUN mkdir -p /defaults/node_modules
COPY --from=builder /build/package.json /defaults/package.json
COPY --from=builder /build/package-lock.json /defaults/package-lock.json
COPY --from=builder /build/node_modules /defaults/node_modules

# Copy flows and settings into defaults
COPY default-flows/flows.json /defaults/flows.json
COPY default-flows/example.settings.js /defaults/settings.js

# Copy base image config files that may be needed (lib, .config.*)
RUN mkdir -p /defaults/lib && \
    cp -a /data/.config.nodes.json /defaults/ 2>/dev/null || true && \
    cp -a /data/.config.runtime.json /defaults/ 2>/dev/null || true && \
    cp -a /data/.config.users.json /defaults/ 2>/dev/null || true

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh && \
    chown -R 1000:1000 /entrypoint.sh /defaults

EXPOSE 8888

USER 1000

ENTRYPOINT ["/entrypoint.sh"]
