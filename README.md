# Flow UX AI

Automate UX audits with AI precision. Flow UX AI analyzes your Figma designs instantly with machine learning, delivering actionable insights faster than any human expert.

## 🚀 Phase 1 MVP Features

- ✅ **File Upload System** - Upload PNG/JPG designs via drag-and-drop
- ✅ **Rule-Based UX Analysis** - Deterministic analysis engine checking:
  - Contrast (WCAG AA/AAA compliance)
  - Spacing (minimum requirements)
  - Accessibility (touch targets, text size)
  - Layout (alignment, consistency)
- ✅ **Visual Canvas** - Interactive issue highlights on design
- ✅ **Dashboard** - View and manage all your analyses
- ✅ **PDF Export** - Download professional analysis reports
- ✅ **Authentication** - Secure user accounts with NextAuth + Supabase

## 🛠️ Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Supabase** - Database, Storage, and Authentication
- **NextAuth.js** - Authentication
- **jsPDF** - PDF generation
- **Sharp** - Image processing

## Project Structure

```
├── app/              # Next.js app directory
│   ├── layout.tsx   # Root layout
│   ├── page.tsx     # Home page
│   └── globals.css  # Global styles
├── components/       # React components
│   ├── ui/          # UI components (Button, Input, Accordion)
│   └── ...          # Feature components
├── lib/             # Utility functions
└── ...              # Configuration files
```

## 📦 Setup

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (for database and storage)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/flow-ux-ai.git
   cd flow-ux-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_generated_secret
   ```
   See `SUPABASE_SETUP.md` for detailed instructions.

4. **Set up database:**
   - Run the SQL schema from `supabase/schema.sql` in your Supabase SQL Editor
   - See `supabase/README.md` for instructions

5. **Run development server:**
   ```bash
   npm run dev
   ```

6. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📚 Documentation

- `GITHUB_SETUP.md` - Instructions for pushing to GitHub
- `SUPABASE_SETUP.md` - Supabase connection guide
- `AUTH_SETUP.md` - Authentication setup details
- `UPLOAD_API_SETUP.md` - File upload API documentation
- `ANALYSIS_ENGINE_SETUP.md` - Analysis engine documentation
- `DASHBOARD_SETUP.md` - Dashboard features
- `PDF_EXPORT_SETUP.md` - PDF export functionality
- `supabase/README.md` - Database schema setup

## 🏗️ Project Structure

```
flow-ux-ai/
├── app/                    # Next.js app directory
│   ├── api/               # API routes (upload, analyze, export)
│   ├── auth/              # Authentication pages
│   ├── analysis/           # Analysis display pages
│   ├── dashboard/         # Dashboard page
│   └── ...
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...
├── lib/                   # Utilities and libraries
│   ├── analysis/          # Rule-based analysis engine
│   ├── pdf/               # PDF generator
│   └── supabase/          # Supabase client utilities
├── supabase/             # Database schema and setup
└── ...
```

## 🔐 Security

- Environment variables are stored in `.env.local` (not committed)
- Row Level Security (RLS) enabled on all database tables
- Authentication required for all protected routes
- API keys and secrets are never exposed to the client

## 🚧 Roadmap

### Phase 1 (Current) - MVP ✅
- PNG/JPG uploads
- Rule-based UX analysis
- Visual canvas with highlights
- Dashboard with saved analyses
- PDF export

### Phase 2 (Future)
- Figma JSON support
- Real element-level understanding
- More precise rules

### Phase 3 (Future)
- AI-augmented analysis
- Smarter grouping and prioritization
- Multiple analysis models

### Phase 4 (Future)
- Version comparison
- Sharing links
- Team accounts

## 📝 License

[Add your license here]

## 🤝 Contributing

[Add contribution guidelines here]

## 📧 Contact

[Add your contact information here]

