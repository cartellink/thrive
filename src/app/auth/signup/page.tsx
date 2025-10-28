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

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        router.push('/auth/onboarding');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title='Join Thrive'
      subtitle='Create your account to start your fitness journey'
    >
      <AuthForm onSubmit={handleSignup}>
        <AuthField>
          <Label htmlFor='displayName'>Display Name (optional)</Label>
          <Input
            id='displayName'
            type='text'
            placeholder='How should we address you?'
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
          />
        </AuthField>

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
            placeholder='Create a password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </AuthField>

        {error && (
          <div className='text-center text-sm text-red-600'>{error}</div>
        )}

        <AuthActions>
          <Button
            type='submit'
            className='w-full'
            variant='gradient'
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </AuthActions>
      </AuthForm>

      <AuthFooter>
        Already have an account?{' '}
        <Link
          href='/auth/login'
          className='text-blue-600 transition-all duration-300 hover:underline'
        >
          Sign in
        </Link>
      </AuthFooter>
    </AuthLayout>
  );
}
