# Catalog Seeding

This project now includes starter seed data for `categories` and `products`.

## Option 1: Supabase SQL Editor

Run the SQL in:

`supabase/seed.sql`

This is the easiest option if you want to seed directly in the Supabase dashboard.

## Option 2: Node seed script

Run:

```bash
npm run seed:catalog
```

Before running it, add this environment variable:

```bash
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

The script uses `upsert` on `slug`, so rerunning it updates the same seed records instead of creating duplicates.

## Seed coverage

Categories include:

- Welding Electrodes
- Welding Machines
- Industrial Safety Hardware
- Electronic Goods
- CCTV and Security Systems
- Laboratory Chemicals
- Industrial Powders
- General Office and Supply Items

Products include examples for:

- Welding supplies
- Electronic goods
- Security systems
- Lab chemicals
- Powders
- General office supplies
