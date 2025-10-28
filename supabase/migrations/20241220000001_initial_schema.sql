-- Create users table (anonymized user data)
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  birth_date DATE,
  height_cm DECIMAL(5,2),
  starting_weight_kg DECIMAL(5,2),
  target_weight_kg DECIMAL(5,2),
  target_date DATE,
  onboarding_completed BOOLEAN DEFAULT FALSE
);

-- Create profiles table (minimal auth-related data)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT, -- Optional display name, not full name
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_logs table
CREATE TABLE daily_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL,
  weight_kg DECIMAL(5,2),
  body_fat_percent DECIMAL(4,2),
  bmi DECIMAL(4,2),
  muscle_mass_kg DECIMAL(5,2),
  had_beer BOOLEAN DEFAULT FALSE,
  night_snacks BOOLEAN DEFAULT FALSE,
  skipped_breakfast BOOLEAN DEFAULT FALSE,
  played_squash BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, log_date)
);

-- Create progress_photos table
CREATE TABLE progress_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  taken_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  weight_at_time DECIMAL(5,2),
  body_fat_at_time DECIMAL(4,2)
);

-- Create vision_board_items table
CREATE TABLE vision_board_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT,
  title TEXT,
  description TEXT,
  item_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create habit_streaks table
CREATE TABLE habit_streaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  habit_type TEXT NOT NULL,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_updated DATE DEFAULT CURRENT_DATE,
  UNIQUE(user_id, habit_type)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE vision_board_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_streaks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view own user data" ON users
  FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own user data" ON users
  FOR UPDATE USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert own user data" ON users
  FOR INSERT WITH CHECK (auth.uid() = auth_user_id);

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for daily_logs
CREATE POLICY "Users can view own daily logs" ON daily_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = daily_logs.user_id 
      AND users.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own daily logs" ON daily_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = daily_logs.user_id 
      AND users.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own daily logs" ON daily_logs
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = daily_logs.user_id 
      AND users.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own daily logs" ON daily_logs
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = daily_logs.user_id 
      AND users.auth_user_id = auth.uid()
    )
  );

-- Create RLS policies for progress_photos
CREATE POLICY "Users can view own progress photos" ON progress_photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = progress_photos.user_id 
      AND users.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own progress photos" ON progress_photos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = progress_photos.user_id 
      AND users.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own progress photos" ON progress_photos
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = progress_photos.user_id 
      AND users.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own progress photos" ON progress_photos
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = progress_photos.user_id 
      AND users.auth_user_id = auth.uid()
    )
  );

-- Create RLS policies for vision_board_items
CREATE POLICY "Users can view own vision board items" ON vision_board_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = vision_board_items.user_id 
      AND users.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own vision board items" ON vision_board_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = vision_board_items.user_id 
      AND users.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own vision board items" ON vision_board_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = vision_board_items.user_id 
      AND users.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own vision board items" ON vision_board_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = vision_board_items.user_id 
      AND users.auth_user_id = auth.uid()
    )
  );

-- Create RLS policies for habit_streaks
CREATE POLICY "Users can view own habit streaks" ON habit_streaks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = habit_streaks.user_id 
      AND users.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own habit streaks" ON habit_streaks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = habit_streaks.user_id 
      AND users.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own habit streaks" ON habit_streaks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = habit_streaks.user_id 
      AND users.auth_user_id = auth.uid()
    )
  );

-- Create function to automatically create profile and user record on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile record
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', ''));
  
  -- Create user record (anonymized)
  INSERT INTO public.users (auth_user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
