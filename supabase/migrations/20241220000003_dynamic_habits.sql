-- Create habit_presets table (library of common habits)
CREATE TABLE habit_presets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('health', 'nutrition', 'productivity', 'social', 'wellness', 'sports', 'mental')),
  default_daily_target INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_habits table (user's active habits)
CREATE TABLE user_habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  habit_preset_id UUID REFERENCES habit_presets(id) ON DELETE SET NULL,
  custom_name TEXT,
  custom_icon TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  daily_target INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_habit_completions table (daily habit tracking)
CREATE TABLE daily_habit_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  user_habit_id UUID REFERENCES user_habits(id) ON DELETE CASCADE NOT NULL,
  completion_date DATE NOT NULL,
  completion_count INTEGER DEFAULT 1,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, user_habit_id, completion_date)
);

-- Add user_habit_id to habit_streaks table
ALTER TABLE habit_streaks ADD COLUMN user_habit_id UUID REFERENCES user_habits(id) ON DELETE CASCADE;

-- Add new unique constraint for user_habit_id
ALTER TABLE habit_streaks ADD CONSTRAINT habit_streaks_user_habit_unique UNIQUE (user_id, user_habit_id);

-- Enable RLS on new tables
ALTER TABLE habit_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_habit_completions ENABLE ROW LEVEL SECURITY;

-- RLS policies for habit_presets (public read)
CREATE POLICY "Anyone can view active habit presets" ON habit_presets
  FOR SELECT USING (is_active = true);

-- RLS policies for user_habits
CREATE POLICY "Users can view own habits" ON user_habits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = user_habits.user_id 
      AND users.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own habits" ON user_habits
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = user_habits.user_id 
      AND users.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own habits" ON user_habits
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = user_habits.user_id 
      AND users.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own habits" ON user_habits
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = user_habits.user_id 
      AND users.auth_user_id = auth.uid()
    )
  );

-- RLS policies for daily_habit_completions
CREATE POLICY "Users can view own completions" ON daily_habit_completions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = daily_habit_completions.user_id 
      AND users.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own completions" ON daily_habit_completions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = daily_habit_completions.user_id 
      AND users.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own completions" ON daily_habit_completions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = daily_habit_completions.user_id 
      AND users.auth_user_id = auth.uid()
    )
  );

-- Populate habit presets library
INSERT INTO habit_presets (name, description, icon, category, default_daily_target) VALUES
  -- Health (5 habits)
  ('Exercise', 'Any form of physical activity for at least 30 minutes', '🏃', 'health', 1),
  ('Stretch', 'Stretch for flexibility and mobility', '🧘', 'health', 1),
  ('Meditate', 'Practice mindfulness or meditation', '🧘‍♂️', 'health', 1),
  ('Sleep 8 Hours', 'Get at least 8 hours of quality sleep', '😴', 'health', 1),
  ('Drink Water', 'Drink at least 8 glasses of water (500ml each)', '💧', 'health', 4),
  
  -- Nutrition (7 habits)
  ('No Alcohol', 'Avoid alcoholic beverages', '🚫🍺', 'nutrition', 1),
  ('No Sweets', 'Avoid sugary foods and desserts', '🚫🍰', 'nutrition', 1),
  ('No Night Snacks', 'Avoid eating after dinner', '🚫🍿', 'nutrition', 1),
  ('Eat Breakfast', 'Have a healthy breakfast', '🍳', 'nutrition', 1),
  ('Eat Vegetables', 'Include vegetables in your meals', '🥗', 'nutrition', 3),
  ('Healthy Snacks', 'Choose nutritious snacks', '🥜', 'nutrition', 1),
  ('Track Calories', 'Log your daily calorie intake', '📊', 'nutrition', 1),
  
  -- Productivity (5 habits)
  ('Morning Routine', 'Complete your morning routine', '☀️', 'productivity', 1),
  ('Read', 'Read for at least 20 minutes', '📚', 'productivity', 1),
  ('Journal', 'Write in your journal', '✍️', 'productivity', 1),
  ('Learn Something', 'Dedicate time to learning', '🎓', 'productivity', 1),
  ('Plan Tomorrow', 'Plan your next day before bed', '📝', 'productivity', 1),
  
  -- Social (3 habits)
  ('Call Family', 'Connect with family members', '👨‍👩‍👧‍👦', 'social', 1),
  ('Connect with Friends', 'Reach out to friends', '👥', 'social', 1),
  ('Quality Time', 'Spend quality time with loved ones', '❤️', 'social', 1),
  
  -- Wellness (4 habits)
  ('No Smoking', 'Avoid tobacco products', '🚭', 'wellness', 1),
  ('Take Vitamins', 'Take daily supplements', '💊', 'wellness', 2),
  ('Skincare Routine', 'Complete skincare routine', '🧴', 'wellness', 2),
  ('Limit Screen Time', 'Reduce non-productive screen time', '📱', 'wellness', 1),
  
  -- Sports (6 habits)
  ('Run', 'Go for a run', '🏃‍♀️', 'sports', 1),
  ('Gym Workout', 'Complete a gym session', '💪', 'sports', 1),
  ('Yoga', 'Practice yoga', '🧘‍♀️', 'sports', 1),
  ('Play Squash', 'Play squash or racquet sports', '🎾', 'sports', 1),
  ('Swim', 'Go swimming', '🏊', 'sports', 1),
  ('Cycle', 'Go cycling', '🚴', 'sports', 1),
  
  -- Mental (5 habits)
  ('Gratitude Practice', 'Write down things you''re grateful for', '🙏', 'mental', 1),
  ('Affirmations', 'Practice positive affirmations', '✨', 'mental', 1),
  ('Mindfulness', 'Practice being present', '🌟', 'mental', 1),
  ('Deep Breathing', 'Practice breathing exercises', '💨', 'mental', 1),
  ('No Social Media', 'Avoid social media scrolling', '🚫📱', 'mental', 1);

-- Create indexes for performance
CREATE INDEX idx_user_habits_user_id ON user_habits(user_id) WHERE is_active = true;
CREATE INDEX idx_user_habits_preset_id ON user_habits(habit_preset_id);
CREATE INDEX idx_daily_completions_user_date ON daily_habit_completions(user_id, completion_date);
CREATE INDEX idx_daily_completions_habit_date ON daily_habit_completions(user_habit_id, completion_date);
CREATE INDEX idx_habit_streaks_user_habit ON habit_streaks(user_id, user_habit_id);

