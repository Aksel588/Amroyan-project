-- Create new enum type with desired values
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_category_new') THEN
    CREATE TYPE public.document_category_new AS ENUM (
      'standards',
      'pek_notifications',
      'clarifications_tax',
      'clarifications_labor',
      'discussions',
      'tests_accounting_finance',
      'tests_hr'
    );
  END IF;
END $$;

-- Alter the documents.category column to the new enum, mapping old values
ALTER TABLE public.documents
  ALTER COLUMN category TYPE public.document_category_new
  USING (
    CASE category::text
      WHEN 'tax_laws' THEN 'standards'::document_category_new
      WHEN 'personnel_laws' THEN 'standards'::document_category_new
      WHEN 'tax_hhms' THEN 'standards'::document_category_new
      WHEN 'tax_fhms' THEN 'standards'::document_category_new
      WHEN 'personnel_hhms' THEN 'standards'::document_category_new
      WHEN 'personnel_fhms' THEN 'standards'::document_category_new
      WHEN 'tax_clarifications' THEN 'clarifications_tax'::document_category_new
      WHEN 'personnel_clarifications' THEN 'clarifications_labor'::document_category_new
      WHEN 'tax_discussions' THEN 'discussions'::document_category_new
      WHEN 'personnel_discussions' THEN 'discussions'::document_category_new
      ELSE 'standards'::document_category_new
    END
  );

-- Drop old enum type and rename new type to original name
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_category') THEN
    DROP TYPE public.document_category;
  END IF;
END $$;

ALTER TYPE public.document_category_new RENAME TO document_category;