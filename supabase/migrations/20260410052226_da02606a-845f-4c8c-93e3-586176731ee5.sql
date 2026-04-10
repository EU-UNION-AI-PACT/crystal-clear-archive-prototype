-- Allow everyone (including unauthenticated) to see published wishes for the live ticker
CREATE POLICY "Published wishes visible to all"
ON public.wishes
FOR SELECT
USING (status = 'published');

-- Enable realtime for wishes
ALTER PUBLICATION supabase_realtime ADD TABLE public.wishes;