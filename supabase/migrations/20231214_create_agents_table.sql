-- Create the agents table
CREATE TABLE IF NOT EXISTS public.agents (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    agent_id TEXT NOT NULL,
    agent_name TEXT NOT NULL,
    voice_id TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'english',
    is_selected BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT agents_user_id_agent_id_key UNIQUE(user_id, agent_id)
);

-- Add RLS policies if they don't exist
DO $$ 
BEGIN
    -- Enable RLS
    ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

    -- Create policies if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'agents' 
        AND policyname = 'Users can view their own agents'
    ) THEN
        CREATE POLICY "Users can view their own agents"
            ON public.agents FOR SELECT
            USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'agents' 
        AND policyname = 'Users can insert their own agents'
    ) THEN
        CREATE POLICY "Users can insert their own agents"
            ON public.agents FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'agents' 
        AND policyname = 'Users can update their own agents'
    ) THEN
        CREATE POLICY "Users can update their own agents"
            ON public.agents FOR UPDATE
            USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create function to create table if not exists
CREATE OR REPLACE FUNCTION public.create_agents_table_if_not_exists()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Create the table if it doesn't exist
    CREATE TABLE IF NOT EXISTS public.agents (
        id BIGSERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES auth.users(id),
        agent_id TEXT NOT NULL,
        agent_name TEXT NOT NULL,
        voice_id TEXT NOT NULL,
        language TEXT NOT NULL DEFAULT 'english',
        is_selected BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT agents_user_id_agent_id_key UNIQUE(user_id, agent_id)
    );

    -- Add RLS policies if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'agents'
    ) THEN
        ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'public' 
            AND tablename = 'agents' 
            AND policyname = 'Users can view their own agents'
        ) THEN
            CREATE POLICY "Users can view their own agents"
                ON public.agents FOR SELECT
                USING (auth.uid() = user_id);
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'public' 
            AND tablename = 'agents' 
            AND policyname = 'Users can insert their own agents'
        ) THEN
            CREATE POLICY "Users can insert their own agents"
                ON public.agents FOR INSERT
                WITH CHECK (auth.uid() = user_id);
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'public' 
            AND tablename = 'agents' 
            AND policyname = 'Users can update their own agents'
        ) THEN
            CREATE POLICY "Users can update their own agents"
                ON public.agents FOR UPDATE
                USING (auth.uid() = user_id);
        END IF;
    END IF;
END;
$$;
