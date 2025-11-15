# 🌱 Grow Tracker

A modern, beautiful Progressive Web App (PWA) for tracking cannabis plant growth from seed to harvest. Built with Next.js 15, featuring dark mode, and ready to deploy on Vercel with Supabase.

## ✨ Features

- **📱 Progressive Web App** - Install on mobile devices for a native app experience
- **🌙 Dark Mode** - Beautiful dark/light theme with smooth transitions
- **🌱 Plant Management** - Track multiple plants with detailed growth phases
- **💧 Watering Tracker** - Log and monitor watering schedules
- **📊 Growth Progress** - Visual progress bars showing vegetative and flowering phases
- **📸 Image Gallery** - Upload and view plant photos throughout the grow cycle
- **📝 Notes & Details** - Add custom notes, strain info, and grow parameters
- **📅 Timeline View** - See complete watering history with timestamps
- **🎨 Modern UI** - Clean, minimalist design with glassmorphism effects
- **⚡ Real-time Updates** - Instant feedback with toast notifications
- **📱 Responsive** - Optimized for mobile, tablet, and desktop

## 🚀 Tech Stack

### Core
- **Next.js 15** - React framework with App Router
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling with dark mode support
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Production database (via Supabase)

### UI & Components
- **shadcn/ui** - High-quality, accessible components
- **Lucide React** - Beautiful icon library
- **next-themes** - Dark/light mode theming
- **Sonner** - Toast notifications
- **Framer Motion** - Smooth animations

### Hosting & Database
- **Vercel** - Serverless deployment platform
- **Supabase** - PostgreSQL database hosting (free tier)

## 🎯 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/grow-tracker.git
   cd grow-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your Supabase connection strings (see [DEPLOYMENT.md](DEPLOYMENT.md) for details)

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Deployment

This app is designed to be deployed on Vercel with Supabase as the database. See the detailed [DEPLOYMENT.md](DEPLOYMENT.md) guide for step-by-step instructions.

**Quick deployment steps:**
1. Set up Supabase project and get connection strings
2. Push code to GitHub
3. Import project to Vercel
4. Add environment variables
5. Deploy!

Both Supabase and Vercel offer generous free tiers perfect for personal projects.

## 📁 Project Structure

```
grow-tracker/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx             # Home page - plant dashboard
│   │   ├── layout.tsx           # Root layout with theme provider
│   │   ├── plants/
│   │   │   ├── new/            # New plant form
│   │   │   └── [id]/           # Plant detail page
│   │   └── api/
│   │       └── plants/          # API routes for CRUD operations
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   └── ThemeToggle.tsx      # Dark/light mode toggle
│   └── lib/
│       ├── db.ts                # Prisma client singleton
│       └── utils.ts             # Utility functions
├── prisma/
│   └── schema.prisma            # Database schema
├── public/                       # Static assets & PWA files
├── agents/                       # AI agent configurations
├── CLAUDE.md                     # Development documentation
├── DEPLOYMENT.md                 # Deployment guide
└── README.md                     # This file
```

## 🌱 How It Works

### Growth Phases

The app tracks plants through two main phases:

1. **Vegetative Phase (VT)** - 35 days (5 weeks)
   - Progress displayed as VT0-VT35
   - Green progress bar
   - Focus on growth and development

2. **Flowering Phase (BT)** - Configurable (default 8 weeks)
   - Progress displayed as BT0-BT56 (for 8 weeks)
   - Purple progress bar
   - Countdown to harvest

### Data Model

- **Plant** - Core plant information (name, strain, dates, notes, images)
- **WateringRecord** - Timestamped watering logs linked to plants
- **User** - User management (ready for authentication)

## 🎨 Design Philosophy

**Modern Minimalism, Not Boring**

- **Glassmorphism** - Frosted glass effects with backdrop blur
- **Gradient Design System** - Color-coded sections (green, purple, blue, amber)
- **Micro-interactions** - Hover effects, scale animations, smooth transitions
- **Scannable Hierarchy** - Clear visual structure with badges and progress bars
- **Dark Mode First** - Beautiful dark theme as default, with light mode option

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

### Database Commands

```bash
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma generate  # Generate Prisma Client
npx prisma db push   # Push schema changes to database
```

## 🤖 AI-Powered Development

This project includes configuration for AI-assisted development:

- **CLAUDE.md** - Comprehensive project documentation for Claude Code
- **agents/** - Pre-configured agents for code review and design review
- Optimized codebase structure for AI understanding

## 📝 Environment Variables

Required environment variables (see `.env.example`):

```env
DATABASE_URL="postgresql://..."      # Supabase connection (Transaction mode)
DIRECT_URL="postgresql://..."        # Supabase connection (Session mode)
```

## 🔒 Security Notes

- Never commit `.env` file (already in `.gitignore`)
- Keep database credentials secure
- Use Supabase Row Level Security (RLS) for production
- Consider adding authentication with NextAuth.js

## 🌟 Future Enhancements

Potential features to add:
- [ ] User authentication and multi-user support
- [ ] Nutrient tracking and feeding schedules
- [ ] Environmental data (temp, humidity, pH)
- [ ] Harvest tracking and yield recording
- [ ] Export grow logs to PDF
- [ ] Charts and analytics
- [ ] Clone/mother plant tracking
- [ ] Grow journal with Markdown support

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Credits

Built with modern web technologies and best practices. Designed for cannabis growers who want a simple, beautiful way to track their plants.

---

**Made with ❤️ for the growing community** 🌱

Need help? Check out [DEPLOYMENT.md](DEPLOYMENT.md) or [CLAUDE.md](CLAUDE.md) for detailed documentation.
