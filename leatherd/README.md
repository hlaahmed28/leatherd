<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your app

This contains everything you need to run your app locally and deploy to Hostinger.

## Local development

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```
3. Run migrations (creates tables and applies schema changes):
   ```bash
   npx prisma migrate dev --name init
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## Production deployment

When deploying to Hostinger:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```
3. Run production migrations:
   ```bash
   npx prisma migrate deploy
   ```
4. Start production server:
   ```bash
   npm start
   ```

> **Note on Migrations vs db push:** We use `migrate dev` and `migrate deploy` to maintain a consistent history of database schema changes and apply them safely across environments, rather than `db push` which is destructive and meant for rapid prototyping. Never run `prisma migrate dev` or `prisma db push` in production as it can cause data loss.
