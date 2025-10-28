# Thrive Design System

A comprehensive design system for the Thrive weight loss tracking application, built with React, TypeScript, and Tailwind CSS.

## Overview

The Thrive design system provides a cohesive set of design tokens, components, and patterns that ensure consistency across the entire application. It emphasizes accessibility, usability, and a modern gradient-heavy aesthetic.

## Design Tokens

### Colors

The design system uses a carefully crafted color palette with semantic meaning:

#### Primary Colors

- **Blue**: `#2563eb` - Primary brand color
- **Indigo**: `#4f46e5` - Secondary brand color
- **Purple**: `#9333ea` - Accent brand color

#### Semantic Colors

- **Success**: `#16a34a` - For positive actions and states
- **Warning**: `#d97706` - For caution and attention
- **Error**: `#dc2626` - For errors and destructive actions
- **Info**: `#2563eb` - For informational content

#### Gradients

- **Primary**: `linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #9333ea 100%)`
- **Secondary**: `linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)`
- **Success**: `linear-gradient(135deg, #16a34a 0%, #22c55e 100%)`

### Typography

#### Font Families

- **Sans**: Geist Sans (primary)
- **Mono**: Geist Mono (code)

#### Font Sizes

- **xs**: 12px (0.75rem)
- **sm**: 14px (0.875rem)
- **base**: 16px (1rem)
- **lg**: 18px (1.125rem)
- **xl**: 20px (1.25rem)
- **2xl**: 24px (1.5rem)
- **3xl**: 30px (1.875rem)
- **4xl**: 36px (2.25rem)

### Spacing

Based on a 2px grid system (compact):

- **xs**: 2px (0.125rem)
- **sm**: 4px (0.25rem)
- **md**: 8px (0.5rem)
- **lg**: 12px (0.75rem)
- **xl**: 16px (1rem)
- **2xl**: 24px (1.5rem)
- **3xl**: 32px (2rem)

### Border Radius

- **sm**: 8px (0.5rem)
- **md**: 12px (0.75rem)
- **lg**: 16px (1rem)
- **xl**: 24px (1.5rem)
- **2xl**: 32px (2rem)
- **full**: 9999px

### Shadows

Elevation system for depth:

- **sm**: `0 1px 2px 0 rgb(0 0 0 / 0.05)`
- **md**: `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`
- **lg**: `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`
- **xl**: `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`

## Components

### Layout Components

#### AppShell

Wraps authenticated pages with consistent layout and navigation.

```tsx
import { AppShell } from '@/components/layout/AppShell';

<AppShell>
  <YourPageContent />
</AppShell>;
```

#### AuthLayout

Provides consistent layout for authentication pages.

```tsx
import {
  AuthLayout,
  AuthForm,
  AuthField,
  AuthActions,
} from '@/components/layout/AuthLayout';

<AuthLayout title='Welcome Back' subtitle='Sign in to your account'>
  <AuthForm onSubmit={handleSubmit}>
    <AuthField>
      <Label htmlFor='email'>Email</Label>
      <Input id='email' type='email' />
    </AuthField>
    <AuthActions>
      <Button type='submit' variant='gradient'>
        Sign In
      </Button>
    </AuthActions>
  </AuthForm>
</AuthLayout>;
```

#### PageHeader

Standardized page headers with optional back button and actions.

```tsx
import { PageHeader, PageHeaderActions } from '@/components/PageHeader';

<PageHeader
  title='Dashboard'
  subtitle='Welcome back, John!'
  showBackButton
  onBack={() => router.back()}
  actions={
    <PageHeaderActions
      onSettings={() => router.push('/settings')}
      onLogout={handleLogout}
    />
  }
  variant='gradient'
/>;
```

### UI Components

#### Button

Enhanced button component with gradient and glass variants.

```tsx
import { Button } from '@/components/ui/button'

// Gradient variant
<Button variant="gradient">Primary Action</Button>

// Glass variant
<Button variant="glass">Glass Effect</Button>

// Loading state
<Button loading={isLoading}>Save Changes</Button>
```

#### Card

Enhanced card component with multiple variants.

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Gradient variant
<Card variant="gradient">
  <CardHeader>
    <CardTitle>Gradient Card</CardTitle>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>

// Interactive variant
<Card variant="interactive" onClick={handleClick}>
  <CardContent>Clickable card</CardContent>
</Card>
```

#### Badge

Enhanced badge component with semantic variants.

```tsx
import { Badge } from '@/components/ui/badge'

<Badge variant="success">Completed</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Failed</Badge>
<Badge variant="gradient">Premium</Badge>
```

### Composite Components

#### StatCard

Displays statistics with icons and optional trend indicators.

```tsx
import { StatCard } from '@/components/StatCard';
import { TrendingUp } from 'lucide-react';

<StatCard
  icon={TrendingUp}
  value='75%'
  label='Progress'
  trend={{ value: 5, isPositive: true }}
  color='green'
  variant='outlined'
/>;
```

#### GradientCard

Cards with gradient backgrounds and glass morphism effects.

```tsx
import { GradientCard, ActionCard, FeatureCard } from '@/components/GradientCard'

// Basic gradient card
<GradientCard variant="primary">
  <div>Content</div>
</GradientCard>

// Action card
<ActionCard variant="blue" onClick={handleClick}>
  <div>Click me</div>
</ActionCard>

// Feature card
<FeatureCard
  icon={<Target className="h-8 w-8" />}
  title="Vision Board"
  description="Create your goals"
  variant="purple"
  onClick={() => router.push('/vision-board')}
/>
```

#### EmptyState

Consistent empty state patterns with icons and CTAs.

```tsx
import { EmptyState } from '@/components/EmptyState';
import { Heart } from 'lucide-react';

<EmptyState
  icon={Heart}
  title='No habits yet'
  description='Start building healthy habits by adding your first one.'
  action={{
    label: 'Add Your First Habit',
    onClick: () => router.push('/settings'),
    variant: 'gradient',
  }}
/>;
```

#### LoadingState

Branded loading states with consistent styling.

```tsx
import { LoadingState } from '@/components/LoadingState'

// Page loading
<LoadingState message="Loading dashboard..." size="lg" />

// Card loading
<LoadingState message="Loading..." size="md" />

// Inline loading
<LoadingState message="Saving..." size="sm" />
```

#### TextCard

Themed text cards for vision boards and motivational content.

```tsx
import { TextCard } from '@/components/TextCard';

<TextCard
  text='Every expert was once a beginner'
  theme='blue'
  index={0}
  totalItems={6}
  onClick={() => console.log('clicked')}
/>;
```

## Utility Classes

### Gradient Backgrounds

- `.bg-gradient-primary`
- `.bg-gradient-secondary`
- `.bg-gradient-success`
- `.bg-gradient-warning`
- `.bg-gradient-error`

### Glass Morphism

- `.glass` - Light glass effect
- `.glass-dark` - Dark glass effect

### Transitions

- `.transition-smooth` - Standard smooth transition
- `.transition-fast` - Fast transition
- `.transition-slow` - Slow transition

### Hover Effects

- `.hover-lift` - Lifts element on hover
- `.hover-scale` - Scales element on hover

### Text Gradients

- `.text-gradient-primary`
- `.text-gradient-secondary`

### Consistent Spacing

- `.space-y-consistent` - Standard vertical spacing
- `.space-y-consistent-sm` - Small vertical spacing
- `.space-y-consistent-lg` - Large vertical spacing

## Animation Classes

- `.animate-fade-in` - Fade in animation
- `.animate-slide-in` - Slide in animation
- `.animate-scale-in` - Scale in animation
- `.animate-pulse-slow` - Slow pulse animation
- `.animate-bounce-slow` - Slow bounce animation

## Usage Guidelines

### Color Usage

- Use primary gradients for main CTAs and important elements
- Use semantic colors consistently (green for success, red for errors)
- Maintain sufficient contrast ratios for accessibility

### Spacing

- Use the spacing scale consistently throughout the application
- Prefer `space-y-consistent` for vertical spacing between elements
- Use `gap-2` or `gap-3` for grid layouts

### Typography

- Use heading hierarchy (h1-h6) appropriately
- Maintain consistent font weights and sizes
- Ensure text is readable across all screen sizes

### Components

- Prefer composite components over custom implementations
- Use variants consistently (gradient for primary actions, outlined for secondary)
- Always include loading states for async operations

### Accessibility

- Include proper ARIA labels and roles
- Ensure keyboard navigation works correctly
- Maintain color contrast ratios
- Use semantic HTML elements

## Examples

### Dashboard Layout

```tsx
<AppShell>
  <PageHeader
    title='Dashboard'
    subtitle='Welcome back!'
    variant='gradient'
    actions={<PageHeaderActions onSettings={handleSettings} />}
  />

  <div className='mb-3 grid grid-cols-3 gap-2'>
    <StatCard icon={TrendingDown} value='75kg' label='Weight' color='blue' />
    <StatCard icon={Trophy} value='65%' label='Progress' color='green' />
    <StatCard icon={Flame} value='12' label='Streak' color='orange' />
  </div>

  <div className='grid grid-cols-2 gap-3'>
    <Card variant='outlined'>
      <CardHeader>
        <CardTitle>Today's Habits</CardTitle>
      </CardHeader>
      <CardContent>{/* Habits content */}</CardContent>
    </Card>

    <Card variant='outlined'>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 gap-2'>
          <ActionCard variant='blue' onClick={() => router.push('/log')}>
            <div>Log Entry</div>
          </ActionCard>
          <ActionCard variant='green' onClick={() => router.push('/progress')}>
            <div>View Progress</div>
          </ActionCard>
        </div>
      </CardContent>
    </Card>
  </div>
</AppShell>
```

### Authentication Flow

```tsx
<AuthLayout title='Welcome Back' subtitle='Sign in to your account'>
  <AuthForm onSubmit={handleLogin}>
    <AuthField>
      <Label htmlFor='email'>Email</Label>
      <Input id='email' type='email' required />
    </AuthField>

    <AuthField>
      <Label htmlFor='password'>Password</Label>
      <Input id='password' type='password' required />
    </AuthField>

    <AuthActions>
      <Button
        type='submit'
        variant='gradient'
        className='w-full'
        loading={loading}
      >
        Sign In
      </Button>
    </AuthActions>
  </AuthForm>

  <AuthFooter>
    Don't have an account? <Link href='/signup'>Sign up</Link>
  </AuthFooter>
</AuthLayout>
```

## Migration Guide

When updating existing components to use the design system:

1. **Replace custom layouts** with `AppShell` or `AuthLayout`
2. **Use PageHeader** instead of custom header implementations
3. **Replace custom cards** with `Card` component variants
4. **Use StatCard** for metric displays
5. **Replace custom empty states** with `EmptyState` component
6. **Use LoadingState** for consistent loading indicators
7. **Apply utility classes** for spacing, colors, and effects
8. **Use semantic color variants** for buttons and badges

## Contributing

When adding new components to the design system:

1. Follow the established patterns and naming conventions
2. Include proper TypeScript types and JSDoc comments
3. Ensure accessibility compliance
4. Add variants using `class-variance-authority`
5. Include loading and error states where appropriate
6. Update this documentation with usage examples
7. Test across different screen sizes and themes
