# Spend Tracker V2

A modern, mobile-first personal finance tracking application built with Next.js 16 and Supabase. Track your spending across multiple payment sources, manage category budgets, and visualize your financial health with an intuitive dashboard.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-Enabled-green)

## ✨ Features

### 📊 **Comprehensive Dashboard**
- View all your spending categories at a glance
- Visual progress bars showing budget utilization
- Overall budget tracking with percentage indicators
- Expandable categories to view transaction history
- Quick access to settings and transaction entry

### 💳 **Multi-Source Tracking**
- Support for multiple payment sources (checking, credit cards, etc.)
- Customizable fund source names
- Easy fund source management in settings

### 🏷️ **Category Management**
- Pre-configured spending categories (Grocery, Rent, Car, Gas, etc.)
- Custom category creation
- Individual category budget allocation
- Budget allocation warnings (over/under/exact)
- Color-coded category indicators with icons

### 📝 **Transaction Tracking**
- Quick 3-step transaction entry:
  1. Select payment source
  2. Enter amount with numeric keypad
  3. Choose category
- Transaction history with dates and amounts
- Delete individual transactions
- Automatic budget calculations

### ⚙️ **Flexible Settings**
- Customize total monthly budget
- Add/remove fund sources
- Add/remove spending categories
- Adjust individual category budgets
- Real-time allocation status with visual warnings

### 🎨 **Modern UI/UX**
- Mobile-first responsive design
- Dark mode support
- Smooth animations and transitions
- Intuitive navigation
- Clean, modern interface with Radix UI components
- Celebratory confirmation screens

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19.2
- **Styling**: Tailwind CSS 4.1
- **UI Components**: 
  - [Radix UI](https://www.radix-ui.com/) (Headless UI components)
  - Custom components with `class-variance-authority`
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: Recharts 2.15
- **Date Handling**: date-fns 4.1
- **Form Management**: React Hook Form with Zod validation
- **Theming**: next-themes

### Backend & Database
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Storage**: Supabase for persistent data
- **API**: Next.js API Routes
- **Database Client**: @supabase/supabase-js

### Data Structure
The application uses two main Supabase tables:
- **transactions**: Stores all spending transactions
- **budget_settings**: Stores budget configuration (categories, fund sources, total budget)

## 📁 Project Structure

```
spendtrackerv2/
├── app/                      # Next.js App Router
│   ├── amount/              # Amount entry page
│   ├── api/                 # API routes
│   │   ├── budget/         # Budget settings API
│   │   └── transactions/   # Transactions API
│   ├── category/           # Category selection page
│   ├── confirmation/       # Transaction confirmation page
│   ├── dashboard/          # Main dashboard page
│   ├── settings/           # Settings page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page (fund source selection)
├── components/
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── budgetDefaults.ts  # Default budget configuration
│   ├── categoryMeta.ts    # Category metadata (colors, icons)
│   ├── storage.ts         # Data access layer
│   ├── supabase.ts        # Supabase client configuration
│   ├── types.ts           # TypeScript type definitions
│   └── utils.ts           # Utility functions
└── public/                # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- A Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/psong11/spendtrackerv2.git
   cd spendtrackerv2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Set up Supabase tables**
   
   Create the following tables in your Supabase project:

   **transactions table:**
   ```sql
   CREATE TABLE transactions (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     fund TEXT NOT NULL,
     amount DECIMAL NOT NULL,
     category TEXT NOT NULL,
     date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

   **budget_settings table:**
   ```sql
   CREATE TABLE budget_settings (
     id TEXT PRIMARY KEY DEFAULT 'default',
     total_budget DECIMAL NOT NULL,
     categories JSONB NOT NULL,
     fund_sources JSONB NOT NULL,
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

   **Insert default budget settings:**
   ```sql
   INSERT INTO budget_settings (id, total_budget, categories, fund_sources)
   VALUES (
     'default',
     5879,
     '[
       {"id": "grocery", "name": "Grocery", "budget": 400},
       {"id": "rent", "name": "Rent", "budget": 1600},
       {"id": "car", "name": "Car", "budget": 330},
       {"id": "gas", "name": "Gas", "budget": 70},
       {"id": "eating-out", "name": "Eating Out", "budget": 320},
       {"id": "personal-development", "name": "Personal Development", "budget": 200},
       {"id": "essential-subscriptions", "name": "Essential Subscriptions", "budget": 50},
       {"id": "medical-health", "name": "Medical/Health", "budget": 20},
       {"id": "investments-assets", "name": "Investments/Assets", "budget": 2889}
     ]'::jsonb,
     '[
       {"id": "checking", "name": "Checking Account"},
       {"id": "credit-card", "name": "Credit Card"}
     ]'::jsonb
   );
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 User Flow

1. **Select Payment Source**: Choose which account/card you're spending from
2. **Enter Amount**: Use the numeric keypad to enter the transaction amount
3. **Choose Category**: Select the spending category
4. **Confirmation**: View transaction summary and updated budget status
5. **Dashboard**: Monitor all categories, view history, and track budget progress

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

### Code Style
- TypeScript strict mode enabled
- ESLint configured for Next.js
- Component-based architecture
- Server and Client Components appropriately separated

### Key Design Patterns
- **Server Components**: Used by default for better performance
- **Client Components**: Used only when needed (interactive elements)
- **API Routes**: Separate API layer for Supabase operations
- **Type Safety**: Full TypeScript coverage with defined interfaces

## 🌐 Deployment

### Deploy on Vercel

The easiest way to deploy this application is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/psong11/spendtrackerv2)

### Other Deployment Options
- **Netlify**: Supports Next.js with edge functions
- **Railway**: Easy deployment with PostgreSQL
- **Self-hosted**: Can be deployed to any Node.js hosting

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | Yes |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and maintained by [psong11](https://github.com/psong11).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Database and authentication by [Supabase](https://supabase.com/)
- Icons from [Lucide](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ by psong11**
