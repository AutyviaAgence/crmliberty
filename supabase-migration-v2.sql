-- =============================================
-- CRM Liberty - Migration V2
-- Objectifs, Documents, Commentaires, Sous-tâches, Notifications, Récurrence
-- À exécuter dans le Supabase Dashboard (SQL Editor)
-- =============================================

-- 1. Table: goals (Objectifs/KPIs)
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  metric_type TEXT NOT NULL DEFAULT 'custom' CHECK (metric_type IN ('leads_count', 'tasks_done', 'posts_published', 'ideas_created', 'revenue', 'custom')),
  target_value NUMERIC NOT NULL DEFAULT 0,
  current_value NUMERIC NOT NULL DEFAULT 0,
  unit TEXT DEFAULT '',
  period TEXT NOT NULL DEFAULT 'month' CHECK (period IN ('week', 'month', 'quarter')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed', 'cancelled')),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table: projects (Projets documentaires liés aux leads)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table: documents (Fichiers dans les projets)
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  file_url TEXT,
  file_type TEXT DEFAULT '',
  file_size INTEGER DEFAULT 0,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table: task_comments (Commentaires sur les tâches)
CREATE TABLE IF NOT EXISTS public.task_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Table: sub_tasks (Sous-tâches / checklist)
CREATE TABLE IF NOT EXISTS public.sub_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Table: notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT DEFAULT '',
  type TEXT NOT NULL CHECK (type IN ('task_assigned', 'lead_status', 'comment', 'goal_achieved', 'general')),
  entity_type TEXT CHECK (entity_type IN ('task', 'lead', 'goal', 'comment', 'project')),
  entity_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ALTER tasks : ajouter récurrence
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS recurrence TEXT DEFAULT NULL CHECK (recurrence IN (NULL, 'daily', 'weekly', 'monthly'));
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS recurrence_source_id UUID DEFAULT NULL;

-- 8. ALTER activity_log : étendre entity_type
ALTER TABLE public.activity_log DROP CONSTRAINT IF EXISTS activity_log_entity_type_check;
ALTER TABLE public.activity_log ADD CONSTRAINT activity_log_entity_type_check
  CHECK (entity_type IN ('task', 'idea', 'post', 'social_account', 'lead', 'auth', 'goal', 'project', 'document'));

-- =============================================
-- RLS (Row Level Security)
-- =============================================
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_full_access" ON public.goals FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_full_access" ON public.projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_full_access" ON public.documents FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_full_access" ON public.task_comments FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_full_access" ON public.sub_tasks FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_full_access" ON public.notifications FOR ALL USING (auth.role() = 'authenticated');

-- =============================================
-- Indexes
-- =============================================
CREATE INDEX IF NOT EXISTS idx_goals_period ON public.goals(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_goals_status ON public.goals(status);
CREATE INDEX IF NOT EXISTS idx_goals_created_by ON public.goals(created_by);
CREATE INDEX IF NOT EXISTS idx_projects_lead ON public.projects(lead_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_documents_project ON public.documents(project_id);
CREATE INDEX IF NOT EXISTS idx_task_comments_task ON public.task_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_sub_tasks_task ON public.sub_tasks(task_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_recurrence ON public.tasks(recurrence) WHERE recurrence IS NOT NULL;

-- =============================================
-- Triggers (updated_at)
-- =============================================
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_task_comments_updated_at BEFORE UPDATE ON public.task_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Storage bucket pour documents (optionnel, créer manuellement si besoin)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true);
-- =============================================
