-- Add password column to api_settings table
ALTER TABLE api_settings
ADD COLUMN settings_password TEXT;

-- Add function to verify settings password
CREATE OR REPLACE FUNCTION verify_settings_password(
  user_id_input UUID,
  password_input TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stored_password TEXT;
BEGIN
  -- Get the stored password for the user
  SELECT settings_password INTO stored_password
  FROM api_settings
  WHERE user_id = user_id_input;

  -- Return true if passwords match, false otherwise
  RETURN stored_password = password_input;
END;
$$;
