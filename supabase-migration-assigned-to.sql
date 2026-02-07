-- Migration: Change assigned_to from UUID to JSONB array (multi-assignee)
-- Execute this in Supabase Dashboard > SQL Editor

-- 1. Add new temporary column
ALTER TABLE tasks ADD COLUMN assigned_to_new JSONB DEFAULT '[]'::jsonb;

-- 2. Migrate existing data: wrap single UUID into array, null becomes empty array
UPDATE tasks SET assigned_to_new =
  CASE
    WHEN assigned_to IS NOT NULL THEN jsonb_build_array(assigned_to::text)
    ELSE '[]'::jsonb
  END;

-- 3. Drop old column and rename new one
ALTER TABLE tasks DROP COLUMN assigned_to;
ALTER TABLE tasks RENAME COLUMN assigned_to_new TO assigned_to;
