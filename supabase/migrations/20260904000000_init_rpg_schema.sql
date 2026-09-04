-- ====================================================================
-- QuestCraft RPG: Complete Init Migration Schema
-- ====================================================================

-- 1. Create Credits Table (Tracks user credits and midnight 00:00 UTC reset)
CREATE TABLE IF NOT EXISTS public."Credits" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  credits_count INTEGER DEFAULT 10 CHECK (credits_count >= 0),
  last_reset TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create GameSessions Table (Stores saved RPG campaigns)
CREATE TABLE IF NOT EXISTS public."GameSessions" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  character_class TEXT NOT NULL,
  world_theme TEXT NOT NULL,
  hp INTEGER DEFAULT 100 CHECK (hp >= 0),
  gold INTEGER DEFAULT 50 CHECK (gold >= 0),
  inventory JSONB DEFAULT '["Iron Longsword", "Health Potion"]'::jsonb,
  story_log JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public."Credits" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."GameSessions" ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own credits
DO $$ BEGIN
  CREATE POLICY "Users can view own credits" 
    ON public."Credits" FOR SELECT 
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Policy: Users can create, read, update, and delete their own game sessions
DO $$ BEGIN
  CREATE POLICY "Users can CRUD own game sessions" 
    ON public."GameSessions" FOR ALL 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 4. Automatic Credit Creation Trigger on Sign Up
CREATE OR REPLACE FUNCTION public.handle_new_user_credits()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public."Credits" (user_id, user_email, credits_count, last_reset)
  VALUES (NEW.id, NEW.email, 10, NOW())
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created_credits
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_credits();

-- 5. Midnight (00:00 UTC) Credit Reset and Retrieval Function
CREATE OR REPLACE FUNCTION public.get_or_refresh_user_credits(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_credits INTEGER;
  v_last_reset TIMESTAMPTZ;
BEGIN
  SELECT credits_count, last_reset INTO v_credits, v_last_reset
  FROM public."Credits"
  WHERE user_id = p_user_id
  FOR UPDATE;

  -- Create row if missing
  IF v_credits IS NULL THEN
    INSERT INTO public."Credits" (user_id, user_email, credits_count, last_reset)
    SELECT id, email, 10, NOW() FROM auth.users WHERE id = p_user_id
    RETURNING credits_count INTO v_credits;
    RETURN 10;
  END IF;

  -- Midnight Reset Check: Compare calendar dates at 00:00 UTC
  IF v_last_reset IS NULL OR DATE_TRUNC('day', NOW() AT TIME ZONE 'UTC') > DATE_TRUNC('day', v_last_reset AT TIME ZONE 'UTC') THEN
    UPDATE public."Credits"
    SET credits_count = 10,
        last_reset = NOW(),
        updated_at = NOW()
    WHERE user_id = p_user_id;
    RETURN 10;
  END IF;

  RETURN v_credits;
END;
$$;

-- 6. Atomic Credit Deduction Function
CREATE OR REPLACE FUNCTION public.deduct_user_credit(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_credits INTEGER;
BEGIN
  -- Perform midnight (00:00 UTC) check first
  v_credits := public.get_or_refresh_user_credits(p_user_id);

  IF v_credits <= 0 THEN
    RAISE EXCEPTION 'INSUFFICIENT_CREDITS';
  END IF;

  UPDATE public."Credits"
  SET credits_count = v_credits - 1,
      updated_at = NOW()
  WHERE user_id = p_user_id;

  RETURN v_credits - 1;
END;
$$;