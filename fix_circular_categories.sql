-- Fix circular category references
-- Your current data has a circular chain where each category points to another

-- Step 1: View current circular structure
SELECT 
  c1.name as category,
  c1.parent_id,
  c2.name as parent_name
FROM categories c1
LEFT JOIN categories c2 ON c1.parent_id = c2.id
ORDER BY c1.name;

-- Step 2: Set all categories to NULL (top-level) temporarily
UPDATE categories SET parent_id = NULL;

-- Step 3: Verify all are now top-level
SELECT id, name, parent_id FROM categories ORDER BY name;

-- Step 4: Now you can manually set the correct hierarchy
-- Example: If you want "ICs & Processors" as parent with others as children:

-- Make "ICs & Processors" a top-level category (already NULL)
-- Make "Microcontrollers" a child of "ICs & Processors"
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'ics-processors')
WHERE slug = 'microcontrollers';

-- Make "Power Modules" a child of "ICs & Processors"  
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'ics-processors')
WHERE slug = 'power-modules';

-- Make "Sensors" a top-level category (keep NULL)
-- Or make it a child of something else if needed

-- Step 5: Verify the new structure
SELECT 
  c1.name as category,
  CASE 
    WHEN c1.parent_id IS NULL THEN 'Top Level'
    ELSE c2.name
  END as parent,
  (SELECT COUNT(*) FROM categories WHERE parent_id = c1.id) as child_count
FROM categories c1
LEFT JOIN categories c2 ON c1.parent_id = c2.id
ORDER BY c1.parent_id NULLS FIRST, c1.name;
