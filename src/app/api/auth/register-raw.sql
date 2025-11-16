-- Raw SQL Insert for User Registration (Alternative approach)
-- This can be used if Supabase client has issues
-- Note: This is just for reference - we'll use it in the API route if needed

INSERT INTO users (email, name, phone, password_hash, role, verified)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING email, name, phone, role, verified, created_at;

