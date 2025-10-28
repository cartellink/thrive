# Thrive - Weight Loss Tracker

A personal weight loss accountability web app built with Next.js 14, Supabase, and Tailwind CSS. Track your fitness journey with daily metrics, habit tracking, progress photos, and personalized motivation.

## Features

- **Daily Metrics Tracking**: Log weight, body fat %, BMI, and muscle mass from your Mii scale
- **Habit Tracking**: Simple checkboxes for daily habits (beer, snacks, breakfast, squash)
- **Streak Tracking**: Build momentum with streak counters for each habit
- **Progress Visualization**: Charts and trends for weight, body fat, and muscle mass
- **Progress Photos**: Upload and manage photos to track visual progress
- **Vision Board**: Create a personalized motivation board with images and text cards
- **Weekly Summaries**: Track your performance and achievements
- **Mobile-First Design**: Responsive design optimized for mobile devices
- **PWA Support**: Install as a mobile app on your device

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd thrive
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the migrations in `supabase/migrations/` to set up your database schema
   - Create storage buckets for `progress-photos` and `vision-board`
   - Get your project URL and anon key

4. **Configure environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Database Setup

The app includes SQL migrations that will create:

- **profiles**: User profile data and goals
- **daily_logs**: Daily tracking entries for metrics and habits
- **progress_photos**: Photo uploads with metadata
- **vision_board_items**: Motivation images and text cards
- **habit_streaks**: Calculated streak data

All tables include Row Level Security (RLS) policies to ensure users can only access their own data.

### Storage Setup

Create two storage buckets in Supabase:

- `progress-photos` (public)
- `vision-board` (public)

The migrations include storage policies for secure file uploads.

## Usage

1. **Sign Up**: Create an account with your email and password
2. **Onboarding**: Set your height, current weight, target weight, and optional target date
3. **Dashboard**: View your progress, track daily habits, and see current streaks
4. **Log Metrics**: Enter daily measurements from your scale
5. **Track Progress**: View charts and trends over time
6. **Upload Photos**: Add progress photos to track visual changes
7. **Vision Board**: Create motivation cards with images and text
8. **Settings**: Update your profile and goals

## Mobile App

The app is PWA-ready and can be installed on mobile devices:

- On iOS: Use Safari's "Add to Home Screen" feature
- On Android: Use Chrome's "Add to Home Screen" feature

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@thrive-app.com or create an issue in the repository.
