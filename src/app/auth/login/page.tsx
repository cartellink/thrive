'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AuthLayout,
  AuthForm,
  AuthField,
  AuthActions,
  AuthFooter,
} from '@/components/layout/AuthLayout';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title='Welcome Back' subtitle='Sign in to your Thrive account'>
      <AuthForm onSubmit={handleLogin}>
        <AuthField>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            type='email'
            placeholder='Enter your email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </AuthField>

        <AuthField>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            type='password'
            placeholder='Enter your password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </AuthField>

        {error && (
          <div className='text-center text-sm text-red-600'>{error}</div>
        )}

        <AuthActions>
          <Button
            type='submit'
            variant='gradient'
            className='w-full'
            loading={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </AuthActions>
      </AuthForm>

      <AuthFooter>
        Don&apos;t have an account?{' '}
        <Link
          href='/auth/signup'
          className='text-blue-600 transition-all duration-300 hover:underline'
        >
          Sign up
        </Link>
      </AuthFooter>
    </AuthLayout>
  );
}
