-- ============================================================================
-- VTS (Volunteer Tracking System) - Proposed Relational Database Schema
-- Target Engine: PostgreSQL 15+ / Supabase
-- Status: PROPOSAL FOR PRODUCTION BACKEND
-- Notes:
--   - All primary keys use UUIDs (gen_random_uuid())
--   - Enums enforce domain-level status integrity
--   - B-tree indexes placed on username, email, statuses, foreign keys, and date ranges
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. ENUMS
-- ----------------------------------------------------------------------------

CREATE TYPE role_enum AS ENUM (
  'applicant',
  'volunteer',
  'team_lead',
  'manager',
  'finance',
  'admin'
);

CREATE TYPE rank_enum AS ENUM (
  'volunteer',
  'senior_volunteer',
  'team_lead',
  'manager'
);

CREATE TYPE account_status_enum AS ENUM (
  'pending_verification',
  'active',
  'suspended',
  'locked'
);

CREATE TYPE application_status_enum AS ENUM (
  'draft',
  'submitted',
  'in_review',
  'more_info_needed',
  'accepted',
  'rejected',
  'expired',
  'withdrawn'
);

CREATE TYPE payment_status_enum AS ENUM (
  'pending',
  'confirmed',
  'failed',
  'needs_review',
  'refunded'
);

CREATE TYPE hours_status_enum AS ENUM (
  'logged',
  'approved',
  'declined'
);

CREATE TYPE hours_source_enum AS ENUM (
  'checkin',
  'manual',
  'submission'
);

CREATE TYPE promotion_status_enum AS ENUM (
  'not_eligible',
  'eligible',
  'recommended',
  'approved',
  'declined'
);

CREATE TYPE activity_status_enum AS ENUM (
  'draft',
  'published',
  'in_progress',
  'completed',
  'cancelled'
);

CREATE TYPE activity_type_enum AS ENUM (
  'field_task',
  'event',
  'project',
  'shift',
  'training'
);

CREATE TYPE enrollment_status_enum AS ENUM (
  'joined',
  'waitlisted',
  'cancelled',
  'attended',
  'no_show'
);

CREATE TYPE certificate_kind_enum AS ENUM (
  'membership',
  'rank_advancement',
  'training_completion',
  'appreciation'
);

CREATE TYPE org_unit_type_enum AS ENUM (
  'head_office',
  'area',
  'branch',
  'location'
);

CREATE TYPE scope_level_enum AS ENUM (
  'all',
  'area',
  'branch',
  'own'
);

CREATE TYPE project_status_enum AS ENUM (
  'planning',
  'active',
  'completed',
  'paused'
);

CREATE TYPE assignment_status_enum AS ENUM (
  'assigned',
  'accepted',
  'declined',
  'completed'
);

CREATE TYPE document_review_status_enum AS ENUM (
  'pending',
  'accepted',
  'returned_for_correction'
);

CREATE TYPE allowance_status_enum AS ENUM (
  'draft',
  'submitted',
  'verified',
  'approved',
  'paid',
  'rejected',
  'failed'
);

-- ----------------------------------------------------------------------------
-- 2. ORGANISATIONAL HIERARCHY
-- ----------------------------------------------------------------------------

CREATE TABLE org_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  type org_unit_type_enum NOT NULL,
  parent_id UUID REFERENCES org_units(id) ON DELETE RESTRICT,
  code VARCHAR(32) NOT NULL UNIQUE,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_org_units_parent_id ON org_units(parent_id);
CREATE INDEX idx_org_units_type ON org_units(type);

-- ----------------------------------------------------------------------------
-- 3. USERS, AUTHENTICATION & ACCESS
-- ----------------------------------------------------------------------------

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(64) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(32) NOT NULL,
  first_name VARCHAR(64) NOT NULL,
  last_name VARCHAR(64) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role role_enum NOT NULL DEFAULT 'applicant',
  account_status account_status_enum NOT NULL DEFAULT 'pending_verification',
  branch_id UUID REFERENCES org_units(id) ON DELETE SET NULL,
  area_id UUID REFERENCES org_units(id) ON DELETE SET NULL,
  email_verified_at TIMESTAMPTZ,
  verification_code VARCHAR(16),
  verification_code_expires_at TIMESTAMPTZ,
  reset_token VARCHAR(64),
  reset_token_expires_at TIMESTAMPTZ,
  failed_sign_in_attempts INT NOT NULL DEFAULT 0,
  locked_until TIMESTAMPTZ,
  password_changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_sign_in_at TIMESTAMPTZ
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_branch_id ON users(branch_id);
CREATE INDEX idx_users_account_status ON users(account_status);

CREATE TABLE sign_in_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  identifier VARCHAR(255) NOT NULL,
  ip_address VARCHAR(64) NOT NULL,
  user_agent TEXT NOT NULL,
  result VARCHAR(32) NOT NULL,
  failure_reason VARCHAR(255),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sign_in_logs_user_id ON sign_in_logs(user_id);
CREATE INDEX idx_sign_in_logs_timestamp ON sign_in_logs(timestamp DESC);

CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role role_enum NOT NULL,
  module VARCHAR(64) NOT NULL,
  actions TEXT[] NOT NULL DEFAULT '{}',
  scope scope_level_enum NOT NULL DEFAULT 'own',
  UNIQUE (role, module)
);

CREATE INDEX idx_role_permissions_role ON role_permissions(role);

-- ----------------------------------------------------------------------------
-- 4. VOLUNTEER PROFILES & NOTIFICATION SETTINGS
-- ----------------------------------------------------------------------------

CREATE TABLE volunteer_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(150) NOT NULL,
  date_of_birth DATE,
  area VARCHAR(64),
  bio TEXT,
  skills TEXT[] NOT NULL DEFAULT '{}',
  availability TEXT[] NOT NULL DEFAULT '{}',
  languages TEXT[] NOT NULL DEFAULT '{}',
  emergency_contact JSONB,
  photo_url TEXT,
  id_photo_url TEXT,
  rank rank_enum NOT NULL DEFAULT 'volunteer',
  member_since TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  volunteer_number VARCHAR(32) NOT NULL UNIQUE,
  branch_id UUID REFERENCES org_units(id) ON DELETE SET NULL,
  rank_history JSONB NOT NULL DEFAULT '[]'
);

CREATE INDEX idx_volunteer_profiles_rank ON volunteer_profiles(rank);
CREATE INDEX idx_volunteer_profiles_branch_id ON volunteer_profiles(branch_id);

CREATE TABLE notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  in_app BOOLEAN NOT NULL DEFAULT TRUE,
  email BOOLEAN NOT NULL DEFAULT TRUE,
  sms BOOLEAN NOT NULL DEFAULT TRUE,
  event_preferences JSONB NOT NULL DEFAULT '{}'
);

-- ----------------------------------------------------------------------------
-- 5. ADMISSIONS, APPLICATIONS & VERIFICATION FILES
-- ----------------------------------------------------------------------------

CREATE TABLE required_document_configs (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  required BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status application_status_enum NOT NULL DEFAULT 'draft',
  source VARCHAR(32) NOT NULL DEFAULT 'self_registered',
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  branch_id UUID REFERENCES org_units(id) ON DELETE SET NULL,
  area_id UUID REFERENCES org_units(id) ON DELETE SET NULL,
  form_data JSONB NOT NULL DEFAULT '{}',
  submitted_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  decision_reason TEXT,
  payment_deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_branch_id ON applications(branch_id);
CREATE INDEX idx_applications_submitted_at ON applications(submitted_at DESC);

CREATE TABLE application_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  config_id VARCHAR(64) REFERENCES required_document_configs(id) ON DELETE RESTRICT,
  name VARCHAR(120) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INT NOT NULL,
  file_url TEXT NOT NULL,
  status document_review_status_enum NOT NULL DEFAULT 'pending',
  review_note TEXT,
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_app_documents_app_id ON application_documents(application_id);
CREATE INDEX idx_app_documents_status ON application_documents(status);

CREATE TABLE application_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  author_name VARCHAR(120) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_app_notes_app_id ON application_notes(application_id);

-- ----------------------------------------------------------------------------
-- 6. PAYMENTS (MONEY IN)
-- ----------------------------------------------------------------------------

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
  amount NUMERIC(10, 2) NOT NULL,
  currency VARCHAR(8) NOT NULL DEFAULT 'ETB',
  telebirr_reference VARCHAR(120) UNIQUE,
  receipt_number VARCHAR(64) NOT NULL UNIQUE,
  status payment_status_enum NOT NULL DEFAULT 'pending',
  payment_method VARCHAR(32) NOT NULL DEFAULT 'telebirr',
  phone_number VARCHAR(32),
  notes TEXT,
  raw_payload JSONB,
  confirmed_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  refund_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_telebirr_ref ON payments(telebirr_reference);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);

-- ----------------------------------------------------------------------------
-- 7. PROJECTS & COMMUNITY INITIATIVES
-- ----------------------------------------------------------------------------

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  branch_id UUID NOT NULL REFERENCES org_units(id) ON DELETE RESTRICT,
  area_id UUID REFERENCES org_units(id) ON DELETE SET NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget NUMERIC(12, 2) NOT NULL,
  allowance_per_day NUMERIC(10, 2) NOT NULL DEFAULT 350.00,
  manager_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status project_status_enum NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_branch_id ON projects(branch_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_manager_id ON projects(manager_id);

-- ----------------------------------------------------------------------------
-- 8. ACTIVITIES, ENROLLMENTS & FIELD ASSIGNMENTS
-- ----------------------------------------------------------------------------

CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  branch_id UUID NOT NULL REFERENCES org_units(id) ON DELETE RESTRICT,
  area_id UUID REFERENCES org_units(id) ON DELETE SET NULL,
  title VARCHAR(180) NOT NULL,
  type activity_type_enum NOT NULL,
  description TEXT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  place VARCHAR(150) NOT NULL,
  capacity INT NOT NULL,
  min_rank rank_enum NOT NULL DEFAULT 'volunteer',
  skills TEXT[] NOT NULL DEFAULT '{}',
  lead_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status activity_status_enum NOT NULL DEFAULT 'published',
  check_in_code VARCHAR(8) NOT NULL,
  cover_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activities_branch_id ON activities(branch_id);
CREATE INDEX idx_activities_project_id ON activities(project_id);
CREATE INDEX idx_activities_status ON activities(status);
CREATE INDEX idx_activities_starts_at ON activities(starts_at);

CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status enrollment_status_enum NOT NULL DEFAULT 'joined',
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (activity_id, user_id)
);

CREATE INDEX idx_enrollments_activity_id ON enrollments(activity_id);
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);

CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
  branch_id UUID REFERENCES org_units(id) ON DELETE SET NULL,
  volunteer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  supervisor_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status assignment_status_enum NOT NULL DEFAULT 'assigned',
  assigned_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  start_date DATE NOT NULL,
  end_date DATE,
  decided_at TIMESTAMPTZ,
  decline_reason TEXT,
  notes TEXT,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_assignments_volunteer_id ON assignments(volunteer_id);
CREATE INDEX idx_assignments_supervisor_id ON assignments(supervisor_id);
CREATE INDEX idx_assignments_project_id ON assignments(project_id);

-- ----------------------------------------------------------------------------
-- 9. DUTY HOURS, EVIDENCE & PERFORMANCE RATINGS
-- ----------------------------------------------------------------------------

CREATE TABLE hours_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  branch_id UUID REFERENCES org_units(id) ON DELETE SET NULL,
  check_in TIMESTAMPTZ NOT NULL,
  check_out TIMESTAMPTZ,
  minutes INT NOT NULL DEFAULT 0,
  source hours_source_enum NOT NULL,
  status hours_status_enum NOT NULL DEFAULT 'logged',
  manual_note TEXT,
  evidence_url TEXT,
  evidence_note TEXT,
  decided_by UUID REFERENCES users(id) ON DELETE SET NULL,
  decision_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hours_user_id ON hours_entries(user_id);
CREATE INDEX idx_hours_activity_id ON hours_entries(activity_id);
CREATE INDEX idx_hours_status ON hours_entries(status);
CREATE INDEX idx_hours_check_in ON hours_entries(check_in DESC);

CREATE TABLE completed_activity_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  branch_id UUID REFERENCES org_units(id) ON DELETE SET NULL,
  title VARCHAR(180) NOT NULL,
  date DATE NOT NULL,
  hours NUMERIC(4, 2) NOT NULL,
  note TEXT NOT NULL,
  evidence_url TEXT NOT NULL,
  supervisor_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status hours_status_enum NOT NULL DEFAULT 'logged',
  decided_by UUID REFERENCES users(id) ON DELETE SET NULL,
  decided_at TIMESTAMPTZ,
  decline_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_submissions_volunteer ON completed_activity_submissions(volunteer_id);
CREATE INDEX idx_submissions_supervisor ON completed_activity_submissions(supervisor_id);

CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rated_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  score NUMERIC(3, 2) NOT NULL CHECK (score >= 1.0 AND score <= 5.0),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (activity_id, user_id)
);

CREATE INDEX idx_ratings_user_id ON ratings(user_id);

-- ----------------------------------------------------------------------------
-- 10. FIELD ALLOWANCES (MONEY OUT)
-- ----------------------------------------------------------------------------

CREATE TABLE allowances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  allowance_number VARCHAR(64) NOT NULL UNIQUE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
  branch_id UUID REFERENCES org_units(id) ON DELETE SET NULL,
  activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
  volunteer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  volunteer_phone VARCHAR(32) NOT NULL,
  days INT NOT NULL CHECK (days > 0),
  allowance_per_day NUMERIC(10, 2) NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  status allowance_status_enum NOT NULL DEFAULT 'submitted',
  prepared_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  prepared_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  supervisor_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  supervisor_notes TEXT,
  verified_by UUID REFERENCES users(id) ON DELETE RESTRICT,
  verified_at TIMESTAMPTZ,
  approved_by UUID REFERENCES users(id) ON DELETE RESTRICT,
  approved_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  payment_reference VARCHAR(120) UNIQUE,
  disbursement_details JSONB,
  rejection_reason TEXT,
  failure_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_allowances_project_id ON allowances(project_id);
CREATE INDEX idx_allowances_volunteer_id ON allowances(volunteer_id);
CREATE INDEX idx_allowances_status ON allowances(status);
CREATE INDEX idx_allowances_prepared_by ON allowances(prepared_by);
CREATE INDEX idx_allowances_supervisor_id ON allowances(supervisor_id);

-- ----------------------------------------------------------------------------
-- 11. PROMOTIONS, CERTIFICATES & RANK RULES
-- ----------------------------------------------------------------------------

CREATE TABLE rank_rules (
  rank rank_enum PRIMARY KEY,
  min_hours INT NOT NULL,
  min_activities INT NOT NULL,
  min_rating NUMERIC(3, 2) NOT NULL,
  min_months INT NOT NULL,
  required_training VARCHAR(120) NOT NULL
);

CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  from_rank rank_enum NOT NULL,
  to_rank rank_enum NOT NULL,
  status promotion_status_enum NOT NULL DEFAULT 'eligible',
  recommended_by UUID REFERENCES users(id) ON DELETE SET NULL,
  decided_by UUID REFERENCES users(id) ON DELETE SET NULL,
  decided_at TIMESTAMPTZ,
  note TEXT,
  evidence JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_promotions_user_id ON promotions(user_id);
CREATE INDEX idx_promotions_status ON promotions(status);

CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind certificate_kind_enum NOT NULL,
  title VARCHAR(150) NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verification_code VARCHAR(64) NOT NULL UNIQUE,
  file_url TEXT NOT NULL
);

CREATE INDEX idx_certificates_user_id ON certificates(user_id);
CREATE INDEX idx_certificates_code ON certificates(verification_code);

-- ----------------------------------------------------------------------------
-- 12. COMMUNICATIONS, NOTIFICATIONS & AUDIT
-- ----------------------------------------------------------------------------

CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  audience VARCHAR(64) NOT NULL DEFAULT 'all',
  title VARCHAR(180) NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_announcements_audience ON announcements(audience);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  body TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  link VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read_at ON notifications(read_at);

CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  actor_name VARCHAR(120) NOT NULL,
  actor_role VARCHAR(32) NOT NULL,
  action VARCHAR(120) NOT NULL,
  subject TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_actor_id ON activity_logs(actor_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);

CREATE TABLE sms_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_phone VARCHAR(32) NOT NULL,
  body TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'delivered',
  message_type VARCHAR(64) NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sms_logs_phone ON sms_logs(recipient_phone);

CREATE TABLE email_templates (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  subject VARCHAR(180) NOT NULL,
  body TEXT NOT NULL,
  variables TEXT[] NOT NULL DEFAULT '{}'
);

CREATE TABLE volunteer_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  reviewed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_feedback_user_id ON volunteer_feedback(user_id);

CREATE TABLE settings (
  key VARCHAR(64) PRIMARY KEY,
  value TEXT NOT NULL
);
