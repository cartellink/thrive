# Port Configuration for Thrive App

This project has been configured to use custom ports to avoid conflicts when running multiple Supabase and Next.js projects simultaneously.

## Port Assignments

| Service | Default Port | Thrive Port | Purpose |
|---------|-------------|-------------|---------|
| Next.js App | 3000 | **3001** | Main application |
| Supabase API | 54321 | **54331** | Supabase REST API |
| Supabase DB | 54322 | **54332** | PostgreSQL database |
| Supabase Studio | 54323 | **54333** | Database management UI |
| Supabase Inbucket | 54324 | **54334** | Email testing |
| Supabase Analytics | 54327 | **54337** | Analytics service |
| Supabase DB Pooler | 54329 | **54339** | Connection pooling |
| Supabase Shadow DB | 54320 | **54330** | Migration testing |

## Environment Variables

Create a `.env.local` file with these variables:

```bash
# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Supabase Configuration (Local Development)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54331
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Supabase Service Role Key (Server-side only)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Development Commands

1. **Start Supabase services:**
   ```bash
   supabase start
   ```

2. **Start Next.js development server:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Main app: http://localhost:3001
   - Supabase Studio: http://localhost:54333

## Benefits

- **No Port Conflicts**: Run multiple Supabase/Next.js projects simultaneously
- **Consistent Configuration**: All ports are clearly documented
- **Easy Switching**: Simple to change ports if needed
- **Team Collaboration**: Everyone uses the same port configuration

## Troubleshooting

If you encounter port conflicts:

1. Check if ports are already in use:
   ```bash
   lsof -i :3001
   lsof -i :54331
   ```

2. Kill processes using conflicting ports:
   ```bash
   kill -9 <PID>
   ```

3. Restart Supabase services:
   ```bash
   supabase stop
   supabase start
   ```
