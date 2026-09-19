# Security Patch Plan

## Objective
Harden the application security by restricting unauthorized access to administrative features and tightening database Row-Level Security (RLS) policies.

## Tasks

### 1. Frontend: Secure Admin Navigation
- [ ] Modify `frontend/src/components/Footer.tsx` to conditionally render or protect the "Admin Portal" link based on user administrative status.

### 2. Backend/Database: Harden Supabase RLS
- [ ] Analyze `rls_polices_fix.sql` and `supabase_schema.sql` to identify necessary restrictions.
- [ ] Create a new migration script to transition RLS policies from "publicly permissive" to "authenticated/admin-restricted".
- [ ] Apply RLS updates to critical tables (orders, products, etc.).

### 3. Verification
- [ ] Verify that the Admin Portal link is not accessible to non-admin users.
- [ ] Verify that unauthorized attempts to update database records via direct API calls (bypassing the backend) are rejected by Supabase RLS.
