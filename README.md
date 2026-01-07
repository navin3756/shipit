# ShipIt 🚀

> **The Last-Mile Logistics Platform for AI-Generated Software**

ShipIt is a "DoorDash for DevOps" - allowing non-technical founders to upload AI artifacts, receive an automated "Technical Distance" quote, and instantly book a vetted technician to perform the deployment.

![ShipIt](https://img.shields.io/badge/version-1.0.0-indigo) ![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-cyan)

## ✨ Features

### Client Side (Founders)
- **Artifact Ingestion**: GitHub repo, file upload (.zip), or raw code paste
- **AI Estimation Engine**: Analyze code stack, calculate "Technical Distance", generate fixed-price quotes
- **Expert Marketplace**: Browse vetted technicians with ratings, tiers, and specialties
- **Mission Control Dashboard**: Real-time deployment status, secure chat, secret vault

### Expert Side (Technicians)
- **Command Center**: Job board with "Unmanifested Cargo" list
- **Mission Log**: Track active deliveries with automated payout calculation

### Security
- Client-side AES-256 encryption for Secret Vault
- Row Level Security (RLS) for project access
- SOC 2 Type II, GDPR compliant architecture

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Tailwind CSS (Glassmorphism UI) |
| Backend | Supabase (PostgreSQL, Realtime Subscriptions) |
| AI Engine | Google Gemini Pro (Code Analysis & Blueprint) |
| Build | Vite 6 |

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/navin3756/shipit-production.git
cd shipit-production

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Add your Supabase and Gemini API keys

# Start development server
npm run dev
```

## 📁 Project Structure

```
shipit/
├── App.tsx                 # Main application with routing
├── components/
│   ├── Layout.tsx          # Header + Footer wrapper
│   ├── Footer.tsx          # Production footer with legal, social proof
│   ├── Hero.tsx            # Landing page hero
│   ├── BlueprintWizard.tsx # Onboarding wizard
│   ├── Dashboard.tsx       # Mission Control
│   ├── ExpertMarketplace.tsx
│   ├── IntegrationHub.tsx  # AI Connectors page
│   ├── SecretVault.tsx     # Encrypted credential storage
│   └── Expert*.tsx         # Technician portal components
├── services/
│   ├── supabase.ts         # Database client
│   └── geminiService.ts    # AI analysis service
├── types.ts                # TypeScript definitions
└── Pricing.tsx, HowItWorks.tsx
```

## 🧭 Navigation Architecture

**Header**: Dashboard → Experts → Pricing → Integrations

**Footer**: 
- Product links (How It Works, Pricing, Integrations, Expert Network)
- Company links (About, Careers, Blog)
- Legal links (Terms, Privacy, Cookie Policy, Security, DPA)
- Live system status indicator
- Social proof (2,400+ founders shipped)

## 🔑 Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## 📜 Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run preview  # Preview production build
```

## 🎨 Design System

- **Colors**: Indigo primary (#4f46e5), Slate neutrals
- **Typography**: Bold, black weight headings with tight tracking
- **Components**: Glassmorphism cards, rounded-[32px] containers
- **Themes**: Light (Founders), Dark (Technicians)

## 📄 License

MIT © 2025 ShipIt Technologies, Inc.
