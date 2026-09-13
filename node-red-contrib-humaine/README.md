# @styltsars_hua/node-red-contrib-humaine

Node-RED nodes for **HumAIne** — a Human-AI collaboration platform.

This package bundles the custom Node-RED nodes used by HumAIne:

| Node | Purpose |
| --- | --- |
| `haic-config` | Global configuration node for the HumAIne connection |
| `ai-environment-config` | Configuration for the AI environment / model endpoints |
| `haic-logger` | Logs interactions and telemetry to the HAIC log map |
| `evaluation-config` | Configures an evaluation run |
| `evaluation-trigger` | Triggers an evaluation run in the backend |
| `access-evaluation-logs` | Retrieves logs for a given evaluation |
| `access-evaluation-results` | Retrieves results for a given evaluation |

## Requirements

- Node-RED **>= 3.0.0** (see the `node-red.version` field in `package.json`)
- A HumAIne backend to connect to (configured via the nodes above)

## Installation

Install into your Node-RED user directory:

```bash
npm install @styltsars_hua/node-red-contrib-humaine --prefix ~/.node-red
```

Then restart Node-RED. The nodes appear in the palette under the **HumAIne** group.

### Installing from a local build / tarball

If you are installing a locally built copy instead of the published package:

```bash
cd node-red-contrib-humaine
npm run build          # produces dist/ (editor + runtime bundles)
npm pack               # produces styltsars_hua-node-red-contrib-humaine-<version>.tgz

# from your Node-RED user directory:
npm install ./styltsars_hua-node-red-contrib-humaine-<version>.tgz --prefix ~/.node-red
```

## Development

This package is written in TypeScript. The editor UIs are bundled with Rollup
and the runtime nodes are compiled with `tsc`.

```bash
npm run build          # clean build (copy assets + editor bundle + runtime)
npm run dev            # watch mode: rebuild on change and run tests
npm test               # run the Jest test suite
npm run lint           # check formatting / linting
npm run lint:fix       # auto-fix formatting / linting
```

A `prepack` script runs a clean build automatically before every publish, so a
published tarball always contains up-to-date compiled artifacts.

## License

Released under the GNU General Public License v3.0 (GPL-3.0+).
