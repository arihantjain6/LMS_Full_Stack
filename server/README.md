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
```

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
