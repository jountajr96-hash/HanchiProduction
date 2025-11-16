-- Create works table for storing music, videos, and images
CREATE TABLE public.works (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('music', 'video', 'image')),
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (everyone can view works)
CREATE POLICY "Works are viewable by everyone" 
ON public.works 
FOR SELECT 
USING (true);

-- Create policy for insert (for now, anyone can upload - you can restrict this later)
CREATE POLICY "Anyone can upload works" 
ON public.works 
FOR INSERT 
WITH CHECK (true);

-- Create policy for update
CREATE POLICY "Anyone can update works" 
ON public.works 
FOR UPDATE 
USING (true);

-- Create policy for delete
CREATE POLICY "Anyone can delete works" 
ON public.works 
FOR DELETE 
USING (true);

-- Create storage bucket for work files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('works', 'works', true);

-- Create policies for work file uploads
CREATE POLICY "Work files are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'works');

CREATE POLICY "Anyone can upload work files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'works');

CREATE POLICY "Anyone can update work files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'works');

CREATE POLICY "Anyone can delete work files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'works');