
-- Role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'member', 'viewer');

-- Unique 5-digit Auth-ID generator
CREATE OR REPLACE FUNCTION public.generate_auth_id()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  new_id TEXT;
  done BOOL;
BEGIN
  done := FALSE;
  WHILE NOT done LOOP
    new_id := LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0');
    done := NOT EXISTS (SELECT 1 FROM public.profiles WHERE auth_id = new_id);
  END LOOP;
  RETURN new_id;
END;
$$;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  age INTEGER CHECK (age >= 13 AND age <= 150),
  auth_id TEXT NOT NULL DEFAULT public.generate_auth_id() UNIQUE,
  registration_status TEXT NOT NULL DEFAULT 'pending' CHECK (registration_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Registration requests
CREATE TABLE public.registration_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  age INTEGER,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.registration_requests ENABLE ROW LEVEL SECURITY;

-- Member IDs (verification documents)
CREATE TABLE public.member_ids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  id_type TEXT NOT NULL CHECK (id_type IN ('duns', 'vat', 'orcid', 'lei', 'pic', 'ungm', 'handelsregister')),
  id_value TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  auto_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verification_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, id_type)
);

ALTER TABLE public.member_ids ENABLE ROW LEVEL SECURITY;

-- Wishes (Wunschportal)
CREATE TABLE public.wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL CHECK (LENGTH(title) <= 200),
  content TEXT NOT NULL CHECK (LENGTH(content) <= 2000),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'published', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;

-- Wish email recipients (admin-managed)
CREATE TABLE public.wish_email_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  added_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.wish_email_recipients ENABLE ROW LEVEL SECURITY;

-- Peace signatures
CREATE TABLE public.peace_signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  signed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  message TEXT CHECK (LENGTH(message) <= 500)
);

ALTER TABLE public.peace_signatures ENABLE ROW LEVEL SECURITY;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_member_ids_updated_at BEFORE UPDATE ON public.member_ids FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, '')
  );
  
  -- Create registration request
  INSERT INTO public.registration_requests (user_id, full_name, email, phone, age)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    CASE WHEN NEW.raw_user_meta_data->>'age' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'age')::INTEGER 
      ELSE NULL 
    END
  );
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS POLICIES

-- Profiles: users see own, admins see all
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- User roles: only admins can manage
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Registration requests: users see own, admins see all
CREATE POLICY "Users can view own requests" ON public.registration_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all requests" ON public.registration_requests FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update requests" ON public.registration_requests FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Member IDs: users manage own, admins see all
CREATE POLICY "Users can view own IDs" ON public.member_ids FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own IDs" ON public.member_ids FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all IDs" ON public.member_ids FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update IDs" ON public.member_ids FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Wishes: users manage own, admins manage all, published visible to approved members
CREATE POLICY "Users can view own wishes" ON public.wishes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert wishes" ON public.wishes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all wishes" ON public.wishes FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update wishes" ON public.wishes FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Published wishes visible to members" ON public.wishes FOR SELECT USING (
  status = 'published' AND public.has_role(auth.uid(), 'member')
);

-- Wish email recipients: admins only
CREATE POLICY "Admins can manage recipients" ON public.wish_email_recipients FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Peace signatures: users manage own, all authenticated can view
CREATE POLICY "Users can sign" ON public.peace_signatures FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "All can view signatures" ON public.peace_signatures FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view own signature" ON public.peace_signatures FOR SELECT USING (auth.uid() = user_id);
