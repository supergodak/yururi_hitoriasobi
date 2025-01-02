/*
  # Add venue_option_id to participants table

  1. Changes
    - Add venue_option_id column to participants table
    - Add foreign key constraint to venue_options table
    - Add index for better query performance

  2. Security
    - No changes to RLS policies required
*/

-- Add venue_option_id column
ALTER TABLE public.participants
ADD COLUMN IF NOT EXISTS venue_option_id uuid REFERENCES public.venue_options(id);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS participants_venue_option_id_idx 
ON public.participants(venue_option_id);