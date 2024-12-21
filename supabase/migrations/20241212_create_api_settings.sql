-- Create the api_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS api_settings (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    cal_api_key TEXT,
    cal_event_type_id TEXT,
    retell_api_key TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Create RLS policies
ALTER TABLE api_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own settings"
    ON api_settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
    ON api_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
    ON api_settings FOR UPDATE
    USING (auth.uid() = user_id);

-- Create function to create table if it doesn't exist
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
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            UNIQUE(user_id)
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
