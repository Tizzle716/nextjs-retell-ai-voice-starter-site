-- Add agent_settings column to api_settings table if it doesn't exist
DO $$ 
BEGIN
    -- Add agent_settings column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'api_settings' 
        AND column_name = 'agent_settings'
    ) THEN
        ALTER TABLE public.api_settings
        ADD COLUMN agent_settings JSONB;
    END IF;

    -- Ensure unique constraint exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints 
        WHERE constraint_schema = 'public' 
        AND table_name = 'api_settings' 
        AND constraint_name = 'api_settings_user_id_key'
    ) THEN
        ALTER TABLE public.api_settings
        ADD CONSTRAINT api_settings_user_id_key UNIQUE (user_id);
    END IF;
END $$;

-- Update function to include agent_settings column
CREATE OR REPLACE FUNCTION create_api_settings_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if table exists
    IF NOT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'api_settings'
    ) THEN
        -- Create the table
        CREATE TABLE public.api_settings (
            id BIGSERIAL PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            cal_api_key TEXT,
            cal_event_type_id TEXT,
            retell_api_key TEXT,
            agent_settings JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            CONSTRAINT api_settings_user_id_key UNIQUE(user_id)
        );

        -- Enable RLS
        ALTER TABLE public.api_settings ENABLE ROW LEVEL SECURITY;

        -- Create policies
        CREATE POLICY "Users can view their own settings"
            ON public.api_settings FOR SELECT
            USING (auth.uid() = user_id);

        CREATE POLICY "Users can insert their own settings"
            ON public.api_settings FOR INSERT
            WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can update their own settings"
            ON public.api_settings FOR UPDATE
            USING (auth.uid() = user_id);
    END IF;
END;
$$;
