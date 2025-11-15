# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Grow Tracker is a Progressive Web App (PWA) for tracking cannabis plant growth. The application monitors plant growth phases (vegetative and flowering), tracks watering schedules, and provides progress visualization. Built with Next.js 15, TypeScript, and Prisma with SQLite.

## Development Commands

```bash
# Development
npm run dev                 # Start dev server on port 3000 (logs to dev.log)

# Database
npm run db:push            # Push schema changes to database
npm run db:generate        # Generate Prisma client
npm run db:migrate         # Create and apply migration
npm run db:reset           # Reset database and reapply migrations

# Production
npm run build              # Build for production (creates standalone output)
npm start                  # Start production server (logs to server.log)

# Code Quality
npm run lint               # Run ESLint
```

## Database Configuration

- **Provider**: SQLite
- **Location**: `db/custom.db`
- **ORM**: Prisma
- **Database URL**: Set via `DATABASE_URL` environment variable

The database uses a singleton pattern in `src/lib/db.ts` to prevent multiple Prisma Client instances in development.

## Architecture

### Data Models

**Plant Model** (core entity):
- Tracks plant name, strain, plant date, and flowering duration
- `floweringWeeks` (default: 8) determines total grow cycle length
- `imageUrls` stored as JSON string array
- Related to `WateringRecord` via one-to-many relationship

**WateringRecord Model**:
- Tracks individual watering events
- Cascade deletes when parent plant is deleted

**User Model**:
- Pre-configured but not actively used in current implementation

### Growth Phase Logic

Critical business logic in `src/app/page.tsx:calculateGrowthInfo()`:
- **Vegetative phase**: Fixed 35 days (5 weeks)
- **Flowering phase**: `floweringWeeks * 7` days (configurable per plant)
- Phase display format:
  - Vegetative: `VT{day}` (e.g., "VT12")
  - Flowering: `BT{day} ({weeks} Wochen)` (e.g., "BT21 (8 Wochen)")

### Application Structure

```
src/
├── app/
│   ├── page.tsx                      # Home page - plant list and overview
│   ├── layout.tsx                    # Root layout
│   ├── plants/
│   │   ├── new/page.tsx             # Create new plant form
│   │   └── [id]/page.tsx            # Plant detail view
│   └── api/
│       ├── plants/
│       │   ├── route.ts             # GET /api/plants, POST /api/plants
│       │   └── [id]/
│       │       ├── route.ts         # GET/PUT/DELETE /api/plants/[id]
│       │       ├── water/route.ts   # POST /api/plants/[id]/water
│       │       └── watering/route.ts
├── components/
│   ├── ui/                          # shadcn/ui components
│   └── ServiceWorkerRegister.tsx    # PWA service worker registration
├── lib/
│   ├── db.ts                        # Prisma client singleton
│   └── utils.ts                     # Utility functions (cn, etc.)
└── hooks/                           # Custom React hooks
```

### PWA Configuration

- Configured as installable Progressive Web App
- Service worker: `public/sw.js`
- Manifest: `public/manifest.json`
- German language (`lang: "de"`)
- Theme color: Green (#16a34a)
- Icons: 512x512 and 1024x1024 PNG

### Build Configuration

- **Output mode**: `standalone` - creates self-contained production build
- **React Strict Mode**: Disabled
- **Hot reload**: Disabled in webpack (handled by nodemon)
- **TypeScript**: Build errors ignored (`ignoreBuildErrors: true`)
- **ESLint**: Errors ignored during builds (`ignoreDuringBuilds: true`)

The build process copies static assets and Next.js output to `.next/standalone/` for deployment.

## UI Framework

Uses shadcn/ui component library built on:
- Radix UI primitives
- Tailwind CSS 4 for styling
- Class Variance Authority (CVA) for component variants
- Lucide React for icons

## Important Notes

- Application uses German language for UI text (e.g., "Gießen", "Blüte Phase")
- Image URLs stored as JSON-stringified arrays in database
- All dates calculated relative to `plantDate` field
- Watering records persist independently but cascade delete with plants
- Development logs written to `dev.log`, production logs to `server.log`
