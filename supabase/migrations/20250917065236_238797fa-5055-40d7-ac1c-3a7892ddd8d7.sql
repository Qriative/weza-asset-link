-- Create enum types
CREATE TYPE auth_provider AS ENUM ('email', 'google', 'twitter', 'github', 'phone');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE asset_type AS ENUM ('vehicle', 'equipment', 'property', 'machinery');
CREATE TYPE application_status AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'disbursed', 'rejected', 'closed');
CREATE TYPE loan_status AS ENUM ('active', 'delinquent', 'closed', 'written_off');
CREATE TYPE payment_method AS ENUM ('mpesa', 'airtel', 'bank_transfer', 'card', 'manual');
CREATE TYPE payment_status AS ENUM ('pending', 'success', 'failed');
CREATE TYPE app_role AS ENUM ('user', 'agent', 'lender', 'admin', 'superadmin');

-- Users table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT UNIQUE,
  dob DATE,
  national_id TEXT,
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'Kenya',
  language TEXT DEFAULT 'en',
  is_verified BOOLEAN DEFAULT false,
  auth_provider auth_provider DEFAULT 'email',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Digital ID verifications
CREATE TABLE public.digital_id_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  afripay_id TEXT,
  status verification_status DEFAULT 'pending',
  documents JSONB,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Assets table
CREATE TABLE public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type asset_type NOT NULL,
  make TEXT,
  model TEXT,
  year INTEGER,
  value DECIMAL(15,2),
  description TEXT,
  images JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Credit scores table
CREATE TABLE public.credit_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  score DECIMAL(5,2),
  components JSONB,
  model_version TEXT,
  computed_at TIMESTAMPTZ DEFAULT now()
);

-- Loan applications table
CREATE TABLE public.loan_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  asset_id UUID REFERENCES public.assets(id),
  requested_amount DECIMAL(15,2) NOT NULL,
  term_months INTEGER NOT NULL,
  interest_rate DECIMAL(5,2),
  status application_status DEFAULT 'draft',
  wezascore JSONB,
  fraud_score DECIMAL(5,2),
  assigned_lender_id UUID REFERENCES auth.users(id),
  application_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Loans table
CREATE TABLE public.loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.loan_applications(id) ON DELETE CASCADE,
  principal DECIMAL(15,2) NOT NULL,
  outstanding_balance DECIMAL(15,2) NOT NULL,
  disbursed_amount DECIMAL(15,2),
  disbursed_at TIMESTAMPTZ,
  next_due_date DATE,
  status loan_status DEFAULT 'active',
  repayment_schedule JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id UUID REFERENCES public.loans(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  method payment_method NOT NULL,
  transaction_reference TEXT,
  status payment_status DEFAULT 'pending',
  received_at TIMESTAMPTZ,
  raw_webhook_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Fraud alerts table
CREATE TABLE public.fraud_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.loan_applications(id) ON DELETE CASCADE,
  score DECIMAL(5,2),
  reasons TEXT[],
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Audit logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID,
  action TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_id_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
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

-- RLS Policies

-- Profiles: users can view/update their own profile, admins can view all
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- User roles: only admins can manage roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- Digital ID verifications: users can view their own, admins can view all
CREATE POLICY "Users can view own verifications" ON public.digital_id_verifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own verifications" ON public.digital_id_verifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all verifications" ON public.digital_id_verifications
  FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- Assets: users can manage their own assets, lenders/admins can view all
CREATE POLICY "Users can manage own assets" ON public.assets
  FOR ALL USING (auth.uid() = owner_user_id);

CREATE POLICY "Lenders can view all assets" ON public.assets
  FOR SELECT USING (public.has_role(auth.uid(), 'lender') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- Credit scores: users can view their own, admins can view all
CREATE POLICY "Users can view own credit scores" ON public.credit_scores
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage credit scores" ON public.credit_scores
  FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- Loan applications: users can manage their own, lenders/admins can view all
CREATE POLICY "Users can manage own applications" ON public.loan_applications
  FOR ALL USING (auth.uid() = applicant_id);

CREATE POLICY "Lenders can view assigned applications" ON public.loan_applications
  FOR SELECT USING (auth.uid() = assigned_lender_id OR public.has_role(auth.uid(), 'lender') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

CREATE POLICY "Lenders can update applications" ON public.loan_applications
  FOR UPDATE USING (public.has_role(auth.uid(), 'lender') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- Loans: users can view their own loans, lenders/admins can view all
CREATE POLICY "Users can view own loans" ON public.loans
  FOR SELECT USING (
    auth.uid() IN (
      SELECT applicant_id FROM public.loan_applications WHERE id = loans.application_id
    )
  );

CREATE POLICY "Lenders can manage loans" ON public.loans
  FOR ALL USING (public.has_role(auth.uid(), 'lender') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- Payments: users can view payments for their loans, admins can view all
CREATE POLICY "Users can view own loan payments" ON public.payments
  FOR SELECT USING (
    auth.uid() IN (
      SELECT la.applicant_id 
      FROM public.loans l 
      JOIN public.loan_applications la ON l.application_id = la.id 
      WHERE l.id = payments.loan_id
    )
  );

CREATE POLICY "Admins can manage payments" ON public.payments
  FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- Fraud alerts: only admins can view
CREATE POLICY "Admins can view fraud alerts" ON public.fraud_alerts
  FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- Audit logs: only admins can view
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
  FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, phone)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.raw_user_meta_data ->> 'phone'
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add update triggers for tables with updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_digital_id_verifications_updated_at
  BEFORE UPDATE ON public.digital_id_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assets_updated_at
  BEFORE UPDATE ON public.assets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_loan_applications_updated_at
  BEFORE UPDATE ON public.loan_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_loans_updated_at
  BEFORE UPDATE ON public.loans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_loan_applications_applicant_id ON public.loan_applications(applicant_id);
CREATE INDEX idx_loan_applications_status ON public.loan_applications(status);
CREATE INDEX idx_loans_application_id ON public.loans(application_id);
CREATE INDEX idx_payments_loan_id ON public.payments(loan_id);
CREATE INDEX idx_credit_scores_user_id ON public.credit_scores(user_id);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_fraud_alerts_application_id ON public.fraud_alerts(application_id);