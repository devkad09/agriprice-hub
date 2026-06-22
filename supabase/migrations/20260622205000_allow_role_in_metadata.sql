-- Update handle_new_user to allow assigning a role via user_metadata during signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  default_role public.app_role;
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, region)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'region'
  );
  
  -- Parse role from user metadata if provided, otherwise default to 'farmer'
  BEGIN
    default_role := (NEW.raw_user_meta_data->>'role')::public.app_role;
  EXCEPTION WHEN OTHERS THEN
    default_role := 'farmer';
  END;

  IF default_role IS NULL THEN
    default_role := 'farmer';
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, default_role);
  RETURN NEW;
END;
$$;
