PostgreSQL setup:

1. Create the database if it does not exist:

```bash
createdb violet
```

2. Update `Backend/.env` with your real PostgreSQL credentials.

3. Create the tables:

```bash
psql postgresql://DB_USER:DB_PASSWORD@localhost:5432/violet -f Database/schema.sql
```

The signup form inserts users into the `users` table through `POST /api/auth/signup`.
