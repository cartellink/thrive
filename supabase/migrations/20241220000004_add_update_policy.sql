-- Add missing UPDATE policy for daily_habit_completions table
-- This allows users to update (increment/decrement) their habit completion counts

CREATE POLICY "Users can update own completions" ON daily_habit_completions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = daily_habit_completions.user_id 
      AND users.auth_user_id = auth.uid()
    )
  );

