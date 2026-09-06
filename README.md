# AROMA

AROMA is a Next.js 16 application deployed to Cloudflare Workers with vinext. Authentication uses Better Auth and the existing Cloudflare D1 database bound as `DB`.

## Requirements

- Node.js 22 or newer (Node.js 24 is selected in `.node-version`)
- npm
- A Cloudflare account with access to the `aroma-web` Worker and `aroma-db` D1 database

## Local development

Keep local secrets in `.env` at the project root:

```dotenv
BETTER_AUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
RESEND_API_KEY=
GROQ_API_KEY=
```

The non-secret values `BETTER_AUTH_URL` and `GROQ_MODEL` are defined in `wrangler.jsonc`.

Install dependencies, create the local D1 schema, and start vinext in the Workers runtime:

```bash
npm install
npm run db:migrate:local
npm run dev
```

## Verification

```bash
npm run lint
npm run typecheck
npm run check:cloudflare
npm run build
npm start
```

`npm run build` generates a reduced runtime data set in `public/_data`, builds the Worker, and copies those files into `dist/client` as Workers static assets.

## Database migrations

Apply migrations to the existing production D1 database only when a migration has not already been applied:

```bash
npm run db:migrate:remote
```

The D1 binding, database name, and database ID are defined in `wrangler.jsonc`.

## Deployment

Deploy from a machine authenticated with Wrangler:

```bash
npm run deploy
```

For Cloudflare Workers Builds connected to GitHub, use:

- Build command: `npm run build`
- Deploy command: `npm run deploy:built`
- Root directory: `/`

Configure the required Worker secrets in Cloudflare before deploying. The Worker name in Cloudflare must be `aroma-web` so it matches `wrangler.jsonc`.
