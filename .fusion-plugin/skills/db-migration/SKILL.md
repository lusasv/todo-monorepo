---
name: Database Migration
description: Create and run database migrations
argument-hint: <migration-name>
---
Create or run database migrations for the project.

## Steps

1. Detect the ORM/migration tool:
   - TypeORM: `npx typeorm migration:create` / `npx typeorm migration:run`
   - Prisma: `npx prisma migrate dev --name`
   - Knex: `npx knex migrate:make` / `npx knex migrate:latest`
   - Sequelize: `npx sequelize-cli migration:generate --name`
   - Django: `python manage.py makemigrations` / `python manage.py migrate`
2. If argument is "run" or "up": execute pending migrations
3. If argument is "status": show migration status
4. If argument is a name: create a new migration with that name
5. Show the result

## Rules

- Never modify existing migration files that have been run
- Always create reversible migrations (up + down)
- Verify the migration compiles before running
- Back up important data before destructive migrations (DROP, ALTER)