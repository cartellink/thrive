-- Remove deprecated habit columns from daily_logs table
-- These are now handled by the new habit system (daily_habit_completions table)
ALTER TABLE daily_logs DROP COLUMN IF EXISTS had_beer;
ALTER TABLE daily_logs DROP COLUMN IF EXISTS night_snacks;
ALTER TABLE daily_logs DROP COLUMN IF EXISTS skipped_breakfast;
ALTER TABLE daily_logs DROP COLUMN IF EXISTS played_squash;

-- Remove the unique constraint to allow multiple logs per day
ALTER TABLE daily_logs DROP CONSTRAINT IF EXISTS daily_logs_user_id_log_date_key;

-- Add a timestamp column to track when each log entry was created
ALTER TABLE daily_logs ADD COLUMN logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add an index for better performance when querying logs by user and date
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_date ON daily_logs(user_id, log_date);
