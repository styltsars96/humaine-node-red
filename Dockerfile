FROM nodered/node-red

WORKDIR /data


# Copy all files that are required
COPY package.json .
COPY example.settings.js ./settings.js
COPY flows.json .
COPY node-red-contrib-custom-icons/ ./node-red-contrib-custom-icons/
COPY human_ai_benchmark_suite/ ./human_ai_benchmark_suite/
COPY kubeflow_pipelines_api/ ./kubeflow_pipelines_api/
COPY node-red-contrib-humaine/ ./node-red-contrib-humaine/

USER root
# Set explicit ownership to avoid permission issues during build
RUN chown -R 1000:1000 /data && \
    chmod -R 755 /data

# Switch to non-root user (Node-RED typically handles this)
USER node-red

WORKDIR /data/node-red-contrib-custom-icons/
RUN npm pack

WORKDIR /data/human_ai_benchmark_suite
RUN npm install
RUN npm run build
RUN npm pack

WORKDIR /data/kubeflow_pipelines_api
RUN npm install
RUN npm run build
RUN npm pack

# TODO: Install build and pack node-red-contrib-humaine
# WORKDIR /data/node-red-contrib-humaine
# RUN npm install
# RUN npm run build
# RUN npm pack

# Return to main data directory
WORKDIR /data

# Install all dependencies including custom packages
RUN npm install

# Set ownership and user
USER root
RUN chown -R 1000:1000 /usr/src/node-red
USER node-red

# NOTES:
# The settings.js file should be overridden by a volume.
# The flows.json file should be overridden by a volume.
# If the whole project is the base, then this should be used as a volume for the /data directory.

WORKDIR /usr/src/node-red
ENTRYPOINT ["/usr/src/node-red/entrypoint.sh"]
CMD ["node"]["/usr/src/node-red/node_modules/node-red/red.js"]["--userDir"]["/data"]
