# 🎯 TrueScore - Your Real Neynar Reputation

A beautiful, futuristic Farcaster Mini App that displays your real Neynar score, engagement analytics, and social reputation on the Farcaster network.

![TrueScore Banner](https://v0-task-to-cash-seven.vercel.app/api/og?fid=338060)

## ✨ Features

### 🔮 Core Features
- **Real-Time Neynar Score** - View your authentic Neynar reputation score
- **Updates Hub** - Stay informed with a dedicated "What's New" modal
- **Dynamic OG Images** - Share your score with beautiful, auto-generated images
- **AI Post Generator** - Create engaging Farcaster posts with AI assistance
- **Daily Check-In** - Earn rewards with daily engagement on Base
- **Lucky Spin** - Win XP and rewards with the daily spin wheel 🎰
- **Streak Counter** - Track your check-in streak with fire emoji indicators 🔥
- **Gas Tracker** - Monitor Base network gas prices in real-time ⛽
- **Achievement Badges** - Unlock achievements as you progress
- **Activity Feed** - See your recent check-ins and milestones
- **Quick Stats Dashboard** - Visual metrics for your engagement
- **Creator Tips** - Support the project with easy tipping
- **Profile Analytics** - Track your casts, replies, and engagement

### 🎨 Design
- **Neon-Blue Sci-Fi Theme** - Stunning dark mode with glowing effects
- **Animated Stars Background** - Dynamic space-themed backdrop
- **Glass Morphism UI** - Modern, premium interface elements
- **Responsive Design** - Works perfectly on mobile and desktop

### 🤖 AI Features
- **Smart Post Generation** - 20+ templates for varied content
- **Multiple Writing Styles** - Enthusiastic, Analytical, Community-focused, Educational, and FOMO
- **Customizable Prompts** - Generate posts tailored to your ideas
- **Copy to Clipboard** - Easy sharing to Farcaster

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Smart Contracts:** Solidity 0.8.20 (Base Mainnet)
- **APIs:**
  - Neynar API - User data & scores
  - Farcaster SDK - Mini App integration
  - OpenAI API (optional) - AI post generation
- **Deployment:** Vercel
- **OG Images:** @vercel/og with Satori
- **Blockchain:** Base (Chain ID: 8453)

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Neynar API Key

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/Earnwithalee7890/True-Score-Mini-app-Crypto.git
cd v0-task-to-cash
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env.local` file:
```env
# Required
NEYNAR_API_KEY=your_neynar_api_key_here

# Optional (for AI post generation)
OPENAI_API_KEY=your_openai_api_key_here
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables:
   - `NEYNAR_API_KEY`
   - `OPENAI_API_KEY` (optional)
4. Deploy!

### Farcaster Mini App Setup

1. Create `public/.well-known/farcaster.json` manifest
2. Add your deployed URL to the manifest
3. Submit to Farcaster Mini Apps directory

## 🎨 Features Breakdown

### 1. Neynar Score Display
- Fetches real-time scores from Neynar API
- Beautiful circular progress visualization
- Color-coded reputation badges (Safe, Neutral, Risky, Spammy)
- Animated neon glows and effects

### 2. AI Post Maker
- 20 diverse post templates
- 5 different writing styles
- 200-320 character posts optimized for Farcaster
- Optional OpenAI integration for truly unique posts

### 3. Year Reback 2025 (New! 🎆)
- **Interactive Multi-Slide Recap** of your year
- **Persona Generation** - Are you "The Voice", "The Lurker", or "The Influencer"?
- **Prime Time Analysis** - Discover your peak activity hours and favorite days
- **Community Impact** - Visualize your total followers and likes impact
- **Shareable Card** - Ready-to-post summary for Warpcast

### 4. Dynamic OG Images
- Auto-generated based on user's FID
- Shows actual Neynar score
- Clean, professional design
- Optimized for social sharing (1200x630)

### 4. Share Functionality
- One-click sharing to Farcaster
- Dynamic URLs with user-specific data
- Proper Open Graph and Frame meta tags
- Cache-busting for fresh images

## 📁 Project Structure

```
v0-task-to-cash/
├── app/
│   ├── api/
│   │   ├── og/              # Dynamic OG image generation
│   │   ├── generate-post/   # AI post generation
│   │   ├── neynar/          # Neynar API routes
│   │   └── webhook/         # Farcaster webhooks
│   ├── share/               # Share page with dynamic OG tags
│   ├── layout.tsx           # Root layout with meta tags
│   └── page.tsx             # Home page
├── components/
│   ├── truescore-app.tsx    # Main app component
│   ├── home-page.tsx        # Home view
│   ├── profile-page.tsx     # Profile view
│   ├── ai-post-maker.tsx    # AI post generator
│   ├── score-display.tsx    # Neynar score display
│   └── ...                  # Other components
├── contracts/
│   ├── CheckIn.sol          # Base mainnet check-in contract
│   └── README.md            # Contract documentation
├── lib/
│   └── neynar.ts            # Neynar API client
└── public/
    └── .well-known/
        └── farcaster.json   # Farcaster Mini App manifest
```

## 🔧 Configuration

### Farcaster Manifest

The `farcaster.json` file contains your Mini App configuration:
- App name, description, and icons
- OG image URLs (dynamic)
- Webhook endpoints
- Action buttons

### Meta Tags

Proper meta tags in `app/layout.tsx`:
- Open Graph tags for social sharing
- Farcaster Frame tags for Mini App embedding
- Twitter Card for cross-platform sharing

## 🎯 API Endpoints

### GET `/api/og`
Generate dynamic OG images
- Query params: `fid` (Farcaster ID), `t` (timestamp for cache-busting)
- Returns: PNG image (1200x630)

### POST `/api/generate-post`
Generate AI-powered Farcaster posts
- Body: `{ prompt: string }`
- Returns: `{ post: string }`

### GET `/api/neynar/user`
Fetch user Neynar data
- Query params: `fid`
- Returns: User score, reputation, stats

## 🎨 Customization

### Themes
Edit `app/globals.css` to customize:
- Color schemes
- Neon glow effects
- Animation speeds
- Glass morphism styles

### Post Templates
Modify `app/api/generate-post/route.ts` to:
- Add new writing styles
- Customize templates
- Adjust post length

## 🐛 Troubleshooting

### Embed not valid
- Ensure all meta tags use `/api/og` (not static images)
- Check `farcaster.json` is accessible
- Verify OG image returns 200 status

### Score not loading
- Check `NEYNAR_API_KEY` is set correctly
- Verify FID is valid
- Check API rate limits

### AI posts not working
- Fallback templates work without OpenAI
- Check `OPENAI_API_KEY` if using AI
- Verify API credits/limits

## 📝 License

MIT License - feel free to use this project however you'd like!

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Star the repo to show support! 🌟

## 👨‍💻 Author

Created with ❤️ by [@aleekhoso](https://warpcast.com/aleekhoso)

## 🏆 Talent Protocol - Base Builder Event

This project is participating in the **Top Base Builders: January** event on Talent Protocol.

### Tracking Metrics

#### ✅ Mini App Developer Rewards
- Farcaster Mini App manifest: `/.well-known/farcaster.json`
- Base App ID: `69459eacd19763ca26ddc592`
- Transactions generate fee-based rewards

#### ✅ On-Chain Progress
- **CheckIn Contract**: `0xBD3aDb162D1C5c211075C75DFe3dCD14b549433A` (Base Mainnet)
- Contract generates fees from daily check-ins (0.000001 ETH per check-in)
- Full source code in `/contracts` folder

#### ✅ GitHub Contributions
- Public repository with verified commits
- Author email: `earnwithalee@gmail.com`
- Regular contributions tracked **Jan 1 - Jan 31**

### Smart Contracts

See [`/contracts/README.md`](contracts/README.md) for detailed contract documentation.

**CheckIn Contract Features:**
- Daily check-in system with streak tracking
- Reputation building mechanism
- Anti-spam protection via minimal fee
- Fully verified on BaseScan

## 🔗 Links

- **Live App:** [v0-task-to-cash-seven.vercel.app](https://v0-task-to-cash-seven.vercel.app)
- **Mini App:** [Install on Warpcast](https://warpcast.com/~/frames/launch?url=https%3A%2F%2Fv0-task-to-cash-seven.vercel.app)
- **GitHub:** [Earnwithalee7890/True-Score-Mini-app-Crypto](https://github.com/Earnwithalee7890/True-Score-Mini-app-Crypto)
- **Farcaster:** [@aleekhoso](https://warpcast.com/aleekhoso)

---

**Built for the Farcaster community 🟣**
