# STP Starter

A simple starter app build with SvelteKit (framework), tRPC (api), Prisma (ORM), and Skeleton (UI lib)

Demo: [https://stp-starter.cpnx.eu](https://stp-starter.cpnx.eu)

## Developing

Once you've installed dependencies with `pnpm install`, start a development server:

```bash
pnpm run dev
```

## Deployment

Deploy using docker. Here is a sample docker-compose file

```yaml
services:
  web:
    image: "YOUR_IMAGE_HERE"
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: "postgresql://postgres:postgres@db:5432/stp-starter?schema=public"

  db:
    image: "postgres:latest"
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: "postgres"
      POSTGRES_USER: "postgres"
      POSTGRES_DB: "stp-starter"
```

Run migrations using `pnpm prisma migrate deploy`
