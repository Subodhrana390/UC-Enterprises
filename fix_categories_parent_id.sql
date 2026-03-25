-- Fix categories parent_id to ensure proper NULL values
-- Run this in your Supabase SQL Editor

-- Step 1: Check current state of categories
SELECT 
  id,
  name,
  parent_id,
  CASE 
    WHEN parent_id IS NULL THEN 'NULL (Top Level)'
    WHEN parent_id::text = '00000000-0000-0000-0000-000000000000' THEN 'Zero UUID (Invalid)'
    ELSE 'Has Parent: ' || parent_id::text
  END as parent_status
FROM categories
ORDER BY name;

-- Step 2: Fix any zero UUIDs or invalid parent_id values to NULL
UPDATE categories 
SET parent_id = NULL 
WHERE parent_id IS NOT NULL 
  AND (
    parent_id::text = '00000000-0000-0000-0000-000000000000'
    OR NOT EXISTS (
      SELECT 1 FROM categories c2 WHERE c2.id = categories.parent_id
    )
  );

-- Step 3: Verify the fix - show category hierarchy
SELECT 
  c1.id,
  c1.name as category_name,
  c1.parent_id,
  c2.name as parent_name,
  CASE 
    WHEN c1.parent_id IS NULL THEN 'Top Level Category'
    ELSE 'Subcategory'
  END as category_type,
  (SELECT COUNT(*) FROM categories WHERE parent_id = c1.id) as subcategory_count
FROM categories c1
LEFT JOIN categories c2 ON c1.parent_id = c2.id
ORDER BY c1.parent_id NULLS FIRST, c1.name;

-- Step 4: Show category tree structure
WITH RECURSIVE category_tree AS (
  -- Base case: top-level categories
  SELECT 
    id,
    name,
    parent_id,
    name as path,
    0 as level
  FROM categories
  WHERE parent_id IS NULL
  
  UNION ALL
  
  -- Recursive case: subcategories
  SELECT 
    c.id,
    c.name,
    c.parent_id,
    ct.path || ' > ' || c.name as path,
    ct.level + 1 as level
  FROM categories c
  INNER JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT 
  REPEAT('  ', level) || name as category_hierarchy,
  level,
  id,
  parent_id
FROM category_tree
ORDER BY path;
