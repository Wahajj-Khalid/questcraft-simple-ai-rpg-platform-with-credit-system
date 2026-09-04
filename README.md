# QuestCraft - AI Dungeon Master and Text RPG Platform

QuestCraft is an interactive, full-stack text roleplaying game platform engineered with Next.js 15 (App Router), Supabase (Auth, PostgreSQL, Row Level Security, and Triggers), and Groq AI LLMs. The application transforms classic tabletop roleplaying mechanics into an automated, dynamic web experience where a real-time AI Dungeon Master narrates scenarios, calculates skill outcomes, manages player inventory and health, and enforces a daily credit allowance system.

The web interface is built with Tailwind CSS and Lucide icons, featuring dark and light theme palettes, dynamic Difficulty Class (DC) skill checks, interactive D20 dice rolling animations, studio neural text-to-speech narration, persistent multi-campaign game saves, and memory-optimized Docker containerization for cloud deployment.

---

## Live Deployment

The application is deployed and can be accessed directly at: [QuestCraft RPG](https://questcraft-simple-ai-rpg-platform-with.onrender.com/)

---

## Repository Structure

```text
project-root/
├── .env.example          # Template environment variable configuration
├── .gitignore            # Specifies untracked files and directories
├── Dockerfile            # Multi-stage container build definition
├── docker-compose.yml   # Container orchestration specification
├── next.config.ts        # Next.js standalone and memory build settings
├── package.json          # Project dependencies and script commands
├── tsconfig.json         # TypeScript compiler configuration
├── public/               # Custom SVG favicon and static assets
│   └── icon.svg
├── supabase/
│   └── migrations/
│       └── 20260904000000_init_rpg_schema.sql # Database schema definitions
├── app/                  # Next.js 15 App Router directory
│   ├── actions/          # Modular Server Actions for AI and authentication
│   │   ├── auth.ts       # Server Actions for login, signup, and logout
│   │   └── rpg.ts        # Server Actions for Groq AI DM and game sessions
│   ├── api/              # API Route Handlers
│   │   └── tts/          # Route handler proxying neural voice audio
│   ├── auth/             # Authentication pages
│   │   ├── login/        # Dedicated login page with back navigation
│   │   └── sign-up/      # Dedicated signup page with back navigation
│   ├── rpg/              # Dynamic RPG game session routes
│   │   └── [id]/         # Active campaign game session view
│   ├── globals.css       # Tailwind CSS and global theme styles
│   ├── layout.tsx        # Root layout with metadata and favicon definitions
│   └── page.tsx          # Landing page and active campaign manager hub
├── components/           # Reusable UI components
│   ├── footer.tsx        # Application footer component
│   ├── login-form.tsx    # Modular login form component
│   ├── navbar.tsx        # Navigation bar with credit counter and theme toggle
│   ├── rpg-game-view.tsx # Main RPG game interface with D20 dice roller
│   ├── rpg-tts-player.tsx# Studio neural audio text-to-speech player
│   ├── sign-up-form.tsx  # Modular signup form component
│   ├── theme-provider.tsx# Light and dark theme context manager
│   ├── theme-switcher.tsx# Theme toggle button component
│   ├── landing/          # Landing page content sections
│   │   ├── about-section.tsx       # About QuestCraft features
│   │   ├── features-section.tsx    # Platform technical capabilities
│   │   └── how-to-play-section.tsx # Game rules and D20 dice mechanics
│   └── ui/               # Custom UI controls
│       └── custom-select.tsx       # Bespoke dark-theme dropdown component
└── lib/                  # Core utility libraries
    └── supabase/
        ├── client.ts     # Supabase browser client SDK helper
        ├── server.ts     # Supabase server client SDK helper
        └── check-env-vars.ts # Environment variable validator
```

---

## Technical Features

* **AI Dungeon Master Engine**: Connects to Groq AI models (`openai/gpt-oss-20b` and `openai/gpt-oss-120b`) to generate real-time 2-paragraph narrative scenes, contextual options, and dynamic story consequences.
* **Dynamic Difficulty Class (DC) and D20 Dice Physics**: Evaluates player choices against AI-assigned Difficulty Classes (Easy DC 5, Medium DC 10, Hard DC 15, Very Hard DC 18) using an interactive 20-sided dice roller to calculate critical successes and failures.
* **24-Hour Daily Credit Auto-Refresh System**: Enforces a daily allowance system where PostgreSQL stored procedures (`get_or_refresh_user_credits` and `deduct_user_credit`) reset free tier balances back to 10 credits every calendar day at midnight (00:00 UTC).
* **Multi-Campaign Saves and Persistent State**: Allows players to create and switch between multiple adventure sessions stored in Supabase PostgreSQL tables (`GameSessions`), complete with live tracking for health points, gold, inventory items, and story history logs.
* **Studio Neural Voice Audio Narration**: Proxies neural audio generation through a server route (`/api/tts`) to deliver clear human voice narration for Dungeon Master story text without client-side browser synthesis artifacts.
* **Modular Authentication and Row Level Security**: Leverages Supabase Auth alongside PostgreSQL Row Level Security (RLS) policies to isolate campaign data and credit balances securely per user.
* **Memory-Conscious Containerization**: Multi-stage Docker build utilizing Node 22 Alpine, Next.js standalone output tracing, and V8 garbage collection limits (`NODE_OPTIONS="--max-old-space-size=384"`) to execute within strict 512 MB RAM memory bounds.

---

## Local Setup and Installation

### Prerequisites

* Docker and Docker Compose
* Node.js 22 or higher
* Active Supabase Project URL and API Keys
* Active Groq API Key

### 1. Clone the Repository

```bash
git clone https://github.com/Wahajj-Khalid/questcraft-simple-ai-rpg-platform-with-credit-system.git
cd questcraft-simple-ai-rpg-platform-with-credit-system
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
cp .env.example .env.local
```

Edit the `.env` file and insert your project credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
GROQ_API_KEY=gsk_your_actual_groq_api_key
```

### 3. Apply Database Migrations

Copy the contents of `supabase/migrations/20260904000000_init_rpg_schema.sql` and run them in your Supabase Dashboard SQL Editor, or apply them via the Supabase CLI:

```bash
npx supabase link --project-ref your-supabase-project-id
npx supabase db push
```

---

## Running the Application Locally

### Option A: Running via Docker Compose (Recommended)

```bash
docker-compose up --build
```

Access the application in your browser at `http://localhost:3000`.

### Option B: Running via Native Command

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Access the application in your browser at `http://localhost:3000`.

---

## Known Limitations and Technical Considerations

* **Groq Model Fallbacks**: If a specific Groq model endpoint experiences high traffic, the backend automatically attempts secondary candidate models (`openai/gpt-oss-20b`, `openai/gpt-oss-120b`, `qwen/qwen3.6-27b`) to maintain uninterrupted storytelling.
* **Midnight Credit Transition**: Credit balances reset precisely at midnight (00:00 UTC). The evaluation logic runs automatically upon page load or action submission, requiring no background cron workers.
* **Memory Optimization**: The production container is constrained to 384 MB Node heap size to ensure compilation and execution remain under 512 MB total RAM.