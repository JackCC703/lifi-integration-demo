# LI.FI Integration Demo

A developer-focused `Next.js + TypeScript` demo that compares `LI.FI Widget` and `LI.FI SDK` in one project.

## 🚀 Live Demo

**Try it now**: [https://lifi-integration-demo.vercel.app](https://lifi-integration-demo.vercel.app)

- **Widget Demo**: [https://lifi-integration-demo.vercel.app/widget](https://lifi-integration-demo.vercel.app/widget)
- **SDK Demo**: [https://lifi-integration-demo.vercel.app/sdk](https://lifi-integration-demo.vercel.app/sdk)

**GitHub Repository**: [https://github.com/JackCC703/lifi-integration-demo](https://github.com/JackCC703/lifi-integration-demo)

## What this is

This repo is not trying to be a polished consumer swap app. It is a public integration demo designed to help developers and technical interviewers answer four questions quickly:

- What does LI.FI solve?
- What is the fastest integration path?
- When do you outgrow Widget and move to SDK or API?
- How should status tracking, validation, and error handling be structured?

## Why I built this

I wanted one compact project that could work as:

- a DevRel-style portfolio asset
- an interview demo
- a public GitHub repo
- a base for a Chinese technical article and short walkthrough video

The point is not “I can build a React page”. The point is “I can integrate a third-party infrastructure product quickly, explain the tradeoffs clearly, and handle the engineering edges instead of only the happy path”.

## What it demonstrates

- `LI.FI Widget` integration for the fastest drop-in path
- `LI.FI SDK` integration through `Next.js` route handlers
- `quote` vs `routes` as two different product and engineering choices
- status tracking with manual `txHash` lookup
- client-side validation plus server-side normalization
- explicit error handling for invalid params, no route, and status lookup issues

## Why Widget and SDK are shown together

These two paths solve different problems:

- `Widget` is the fastest way to ship. It is good for MVPs, prototypes, and hackathons.
- `SDK` is better when you need control, observability, custom UI, structured errors, and a server boundary for future API key usage.

This repo keeps them side by side so the integration tradeoff is obvious.

## Why API is not the main page path

The API is important, but it is not the best primary demo surface here.

- `Widget` is the clearest “fastest path” story.
- `SDK` is the clearest “more control” story.
- Direct API usage is still worth documenting, but it adds more low-level request detail to the UI layer.
- If an API key is needed later, it should stay on the server, not in the browser.

## Tech stack

- `Next.js 16`
- `React 19`
- `TypeScript`
- `Tailwind CSS v4`
- `@lifi/widget`
- `@lifi/sdk`
- `react-hook-form`
- `zod`
- `viem`

## Project structure

```txt
app/
  page.tsx
  widget/page.tsx
  sdk/page.tsx
  api/lifi/chains/route.ts
  api/lifi/tokens/route.ts
  api/lifi/quote/route.ts
  api/lifi/routes/route.ts
  api/lifi/status/route.ts

components/
  layout/site-header.tsx
  home/decision-cards.tsx
  widget/widget-demo-loader.tsx
  widget/widget-demo-shell.tsx
  sdk/sdk-demo-shell.tsx
  sdk/sdk-demo-form.tsx
  sdk/sdk-result-panel.tsx
  sdk/status-panel.tsx
  shared/section-card.tsx
  shared/json-viewer.tsx

lib/
  constants/demo-defaults.ts
  lifi/client.ts
  lifi/config.ts
  lifi/server.ts
  lifi/serializers.ts
  lifi/validators.ts

types/
  lifi.ts

docs/
  lifi-nextjs-guide.zh-CN.md
```

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy env vars:

```bash
cp .env.example .env.local
```

3. Start the app:

```bash
npm run dev
```

4. Open the demo locally:

- Home: [http://localhost:3000](http://localhost:3000)
- Widget: [http://localhost:3000/widget](http://localhost:3000/widget)
- SDK: [http://localhost:3000/sdk](http://localhost:3000/sdk)

## Environment variables

```bash
LIFI_INTEGRATOR=jackcc-lifi-public-demo
LIFI_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Notes:

- `LIFI_INTEGRATOR` is used by the server-side SDK config.
- `LIFI_API_KEY` is optional for this MVP.
- If an API key is used later, keep it server-only.
- `NEXT_PUBLIC_APP_URL` should be set to your deployment URL in production (e.g., `https://lifi-integration-demo.vercel.app`).

## Running the demo

The main path is:

- `Arbitrum USDC -> Optimism USDC`

Fallback path:

- `Arbitrum USDC -> Polygon USDC`

Why this path:

- stablecoin route
- familiar EVM chains
- easier to explain in a live demo
- lower risk than using volatile or obscure assets

## Demo pages

### Home

Explains the project in one screen:

- what the repo is
- why Widget and SDK are both shown
- what the demo covers
- where to click next

### Widget Demo

Shows the fastest LI.FI integration path:

- client-only Widget loading
- constrained chain and token setup
- default USDC route
- light branding
- explanation of when Widget is and is not the right answer

### SDK Demo

Shows the more controllable path:

- chain, token, amount, and address form
- `quote` mode
- `routes` mode
- normalized result summary
- raw JSON inspection
- status lookup with `txHash`
- fixed error state blocks

## Widget vs SDK/API

| Dimension | Widget | SDK/API |
| --- | --- | --- |
| Main goal | Fastest integration | More control |
| Best for | MVP, hackathon, prototype | Productized flows, tracking, custom UX |
| UI ownership | Mostly prebuilt | Fully custom |
| Observability | Lower | Higher |
| Backend boundary | Optional | Strongly recommended |

## Common integration concerns

### 1. API key exposure

Do not expose `x-lifi-api-key` in the browser.

### 2. Client/server boundary

This demo keeps SDK calls inside `/api/lifi/*` route handlers so the frontend stays clean and future rate-limit or logging needs do not require a rewrite.

### 3. Token identity

The UI may show a token symbol, but the real identifier is always `chainId + token address`.

### 4. Amount handling

The UI keeps a decimal string like `10`. The request layer converts it to smallest units with the token decimals before calling the SDK.

### 5. No route found

No route is a real product scenario, not just a “bad luck” API response. The demo surfaces it clearly and recommends using the fallback path.

### 6. Status tracking

Status is separated from live execution in this MVP so the demo can still prove lifecycle understanding without depending on a fresh wallet transaction.

## Verification

Validated locally with:

```bash
npm run lint
npm run build
```

Also verified at runtime with:

- `GET /api/lifi/chains`
- `GET /api/lifi/tokens?chain=42161`
- `POST /api/lifi/quote`
- `POST /api/lifi/routes`

## Deployment

**Live Demo**: [https://lifi-integration-demo.vercel.app](https://lifi-integration-demo.vercel.app)

The project is deployed on Vercel. To deploy your own instance:

1. import the repo into Vercel
2. set `LIFI_INTEGRATOR`
3. optionally set `LIFI_API_KEY`
4. deploy

## Future improvements

- wallet connection and live execution
- automatic status polling after execution
- richer chain and token filtering
- short walkthrough video
- APAC and Chinese developer-specific documentation expansion

## Chinese tutorial

See [docs/lifi-nextjs-guide.zh-CN.md](./docs/lifi-nextjs-guide.zh-CN.md).

## References

- [LI.FI Widget install](https://docs.li.fi/widget/install-widget)
- [LI.FI Widget compatibility](https://docs.li.fi/widget/compatibility)
- [LI.FI SDK overview](https://docs.li.fi/sdk/overview)
- [Requesting routes / fetching quotes](https://docs.li.fi/introduction/user-flows-and-examples/requesting-route-fetching-quote)
- [Status tracking](https://docs.li.fi/introduction/user-flows-and-examples/status-tracking)
- [API reference](https://docs.li.fi/api-reference/introduction)
- [Rate limits and API key](https://docs.li.fi/rate-limits-and-api-key)
