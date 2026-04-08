
DROP POLICY "System can insert notifications" ON public.notifications;

CREATE OR REPLACE FUNCTION public.notify_admins_new_wish()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type, related_id)
  SELECT ur.user_id, 
         'Neuer Herzenswunsch', 
         'Ein neuer Wunsch wurde eingereicht: ' || NEW.title,
         'wish_new',
         NEW.id
  FROM public.user_roles ur
  WHERE ur.role = 'admin';
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_wish_created
  AFTER INSERT ON public.wishes
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admins_new_wish();

CREATE OR REPLACE FUNCTION public.notify_wish_published()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'published' AND (OLD.status IS NULL OR OLD.status != 'published') THEN
    INSERT INTO public.notifications (user_id, title, message, type, related_id)
    VALUES (NEW.user_id, 'Wunsch veröffentlicht! 🌟', 'Dein Wunsch "' || NEW.title || '" wurde veröffentlicht!', 'wish_published', NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_wish_published
  AFTER UPDATE ON public.wishes
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_wish_published();
