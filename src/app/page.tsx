import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Target, TrendingDown, Camera, BarChart3 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className='container mx-auto px-4 py-16'>
        {/* Header */}
        <header className='mb-16 text-center'>
          <h1 className='mb-4 text-5xl font-bold text-gray-900'>Thrive</h1>
          <p className='mx-auto mb-8 max-w-4xl text-xl text-gray-600'>
            Your personal weight loss accountability partner. Track progress,
            build habits, and achieve your fitness goals.
          </p>
          <div className='flex justify-center gap-4'>
            <Button size='lg'>
              <Link href='/auth/signup'>Get Started</Link>
            </Button>
            <Button variant='outline' size='lg'>
              <Link href='/auth/login'>Sign In</Link>
            </Button>
          </div>
        </header>

        {/* Features */}
        <section className='mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader>
              <Target className='mb-2 h-8 w-8 text-blue-600' />
              <CardTitle>Goal Tracking</CardTitle>
              <CardDescription>
                Set your target weight and timeline. Track your progress with
                detailed metrics.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingDown className='mb-2 h-8 w-8 text-green-600' />
              <CardTitle>Daily Habits</CardTitle>
              <CardDescription>
                Build healthy habits with simple checkboxes. Track streaks and
                stay accountable.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Camera className='mb-2 h-8 w-8 text-purple-600' />
              <CardTitle>Progress Photos</CardTitle>
              <CardDescription>
                Visual progress tracking with before/after photo comparisons.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className='mb-2 h-8 w-8 text-orange-600' />
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Detailed charts and weekly summaries to understand your journey.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        {/* How it works */}
        <section className='mb-16 text-center'>
          <h2 className='mb-8 text-3xl font-bold text-gray-900'>
            How It Works
          </h2>
          <div className='mx-auto grid max-w-4xl gap-8 md:grid-cols-3'>
            <div className='text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100'>
                <span className='text-2xl font-bold text-blue-600'>1</span>
              </div>
              <h3 className='mb-2 text-xl font-semibold'>Set Your Goals</h3>
              <p className='text-gray-600'>
                Enter your current weight, target weight, and preferred
                timeline.
              </p>
            </div>
            <div className='text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
                <span className='text-2xl font-bold text-green-600'>2</span>
              </div>
              <h3 className='mb-2 text-xl font-semibold'>Track Daily</h3>
              <p className='text-gray-600'>
                Log your weight, body metrics, and daily habits with simple
                checkboxes.
              </p>
            </div>
            <div className='text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100'>
                <span className='text-2xl font-bold text-purple-600'>3</span>
              </div>
              <h3 className='mb-2 text-xl font-semibold'>Stay Motivated</h3>
              <p className='text-gray-600'>
                Build streaks, see progress charts, and create your personal
                vision board.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className='rounded-lg bg-white p-8 text-center shadow-lg'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900'>
            Ready to Start Your Journey?
          </h2>
          <p className='mb-6 text-lg text-gray-600'>
            Join thousands of people who are achieving their fitness goals with
            Thrive.
          </p>
          <Button size='lg' className='px-8 py-3 text-lg'>
            <Link href='/auth/signup'>Start Your Free Account</Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
