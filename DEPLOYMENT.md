# Deployment Guide - Grow Tracker

This guide will help you deploy your Grow Tracker application to Vercel with Supabase as the database.

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Supabase account (free tier available)

## Step 1: Set up Supabase Database

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in the project details:
   - Project name: `grow-tracker` (or your preferred name)
   - Database password: Choose a strong password (save this!)
   - Region: Choose the closest to your users
4. Wait for the project to be created (takes ~2 minutes)

### Get Database Connection Strings

1. In your Supabase project, go to **Project Settings** (gear icon)
2. Go to **Database** section in the sidebar
3. Scroll down to **Connection string**
4. Copy two connection strings:
   - **Transaction mode** → This is your `DATABASE_URL`
   - **Session mode** → This is your `DIRECT_URL`
5. Replace `[YOUR-PASSWORD]` in both URLs with your actual database password

Example:
```
DATABASE_URL="postgresql://postgres:your_password@db.abcdefghijk.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:your_password@db.abcdefghijk.supabase.co:5432/postgres"
```

## Step 2: Set up Local Environment

1. Create a `.env` file in the project root (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase connection strings:
   ```env
   DATABASE_URL="postgresql://postgres:your_password@db.abcdefghijk.supabase.co:5432/postgres"
   DIRECT_URL="postgresql://postgres:your_password@db.abcdefghijk.supabase.co:5432/postgres"
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run Prisma migrations to set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. (Optional) Seed some test data:
   ```bash
   npx prisma studio
   ```
   This opens Prisma Studio where you can manually add test plants.

## Step 3: Test Locally

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)
3. Try creating a plant to verify database connection works

## Step 4: Push to GitHub

1. Create a new repository on GitHub:
   - Go to [https://github.com/new](https://github.com/new)
   - Name: `grow-tracker` (or your preferred name)
   - Make it public or private
   - Don't initialize with README (we already have one)

2. Push your code:
   ```bash
   git add .
   git commit -m "Initial commit - Grow Tracker with dark mode and Supabase"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/grow-tracker.git
   git push -u origin main
   ```

## Step 5: Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository:
   - Select your `grow-tracker` repository
   - Click "Import"

4. Configure the project:
   - **Framework Preset**: Next.js (should be auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

5. Add Environment Variables:
   Click "Environment Variables" and add:
   - `DATABASE_URL` = Your Supabase connection string (Transaction mode)
   - `DIRECT_URL` = Your Supabase connection string (Session mode)

6. Click "Deploy"

7. Wait for the deployment to complete (~2-3 minutes)

## Step 6: Run Database Migrations on Vercel

After first deployment, you need to set up the database schema:

1. In Vercel, go to your project
2. Go to **Settings** → **General**
3. Scroll down to **Build & Development Settings**
4. Add a **Build Command** override:
   ```bash
   npx prisma generate && npx prisma db push && npm run build
   ```

5. Or run manually in Vercel terminal (if available):
   ```bash
   npx prisma db push
   ```

Alternatively, you can run the migrations locally (Step 2.4) - they will apply to your Supabase database and Vercel will use the same database.

## Step 7: Access Your Live App

Your app will be available at:
```
https://your-project-name.vercel.app
```

## Environment Variables Reference

Required environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Supabase PostgreSQL connection (Transaction mode) | `postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres` |
| `DIRECT_URL` | Supabase PostgreSQL connection (Session mode) | `postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres` |

## Troubleshooting

### Database Connection Failed
- Verify your connection strings are correct
- Make sure you replaced `[YOUR-PASSWORD]` with your actual password
- Check that your Supabase project is active

### Build Failed on Vercel
- Make sure you added both environment variables
- Check the build logs for specific errors
- Try running `npm run build` locally first

### Prisma Migration Issues
- Run `npx prisma generate` locally
- Run `npx prisma db push` to sync schema
- If schema is out of sync, you may need to reset: `npx prisma db push --force-reset` (⚠️ this deletes all data)

### PWA Not Working
- PWA features require HTTPS (Vercel provides this automatically)
- Clear browser cache and reload
- Check browser console for service worker errors

## Updating Your Deployment

After making changes to your code:

1. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```

2. Vercel will automatically deploy the changes

## Database Migrations

If you change the Prisma schema:

1. Update `prisma/schema.prisma`
2. Run locally:
   ```bash
   npx prisma db push
   ```
3. Commit the schema changes
4. Push to GitHub - Vercel will rebuild

## Monitoring

- **Vercel Dashboard**: Monitor deployments, check logs, view analytics
- **Supabase Dashboard**: Monitor database usage, run SQL queries, view logs
- **Prisma Studio**: `npx prisma studio` - GUI for database management

## Cost

Both services offer generous free tiers:
- **Vercel**: Unlimited personal projects, 100GB bandwidth/month
- **Supabase**: 500MB database, 1GB file storage, 2GB bandwidth

Perfect for personal projects and small apps!

## Support

- Vercel Docs: [https://vercel.com/docs](https://vercel.com/docs)
- Supabase Docs: [https://supabase.com/docs](https://supabase.com/docs)
- Next.js Docs: [https://nextjs.org/docs](https://nextjs.org/docs)
- Prisma Docs: [https://www.prisma.io/docs](https://www.prisma.io/docs)
