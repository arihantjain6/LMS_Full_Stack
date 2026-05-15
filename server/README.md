# LMS Backend

Production-oriented Loan Management System backend built with Bun, Express, TypeScript, MongoDB, Mongoose, JWT, RBAC, Zod, multer, helmet, cors, and pino.

## Setup

```bash
bun install
cp .env.example .env
bun run seed
bun run dev
```

## Scripts

```bash
bun run dev
bun run start
bun run seed
bun run typecheck
bun run pm2:start
bun run pm2:restart
bun run pm2:logs
```

## PM2 on AWS EC2

```bash
bun install
cp .env.example .env
# update .env with production MONGODB_URI, JWT_SECRET, CORS_ORIGIN, and UPLOAD_BASE_URL
npm install -g pm2
bun run pm2:start
pm2 startup
pm2 save
```

The PM2 app is defined in `ecosystem.config.cjs` and runs `src/server.ts` with Bun from this backend directory. Keep production secrets in `.env`; the PM2 config only sets safe defaults for `NODE_ENV` and `PORT`.

## API Base

```txt
http://localhost:4000/api/v1
```

## Seed Users

All seeded accounts use:

```txt
Password@123
```

- `admin@test.com`
- `sales@test.com`
- `sanction@test.com`
- `disbursement@test.com`
- `collection@test.com`
- `borrower@test.com`
