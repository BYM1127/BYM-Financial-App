# FlowSpend 💸

FlowSpend is a modern, AI-powered personal finance and cash flow tracker. It replaces tedious manual budget categorization with natural language processing and focuses on one powerful metric: **"In My Pocket"**—the safe amount of money you have left to spend.

## What it is

Traditional budgeting apps force you to manually sort expenses into rigid categories and navigate through paywalls for advanced insights. 

FlowSpend operates differently:
- **It works like a chat or a fast Excel sheet**: Just type what you did ("Dropped $120 on matcha because I was stressed" or "Got paid $4000 from work") and hit Enter.
- **It uses AI**: The Google Gemini AI instantly parses your sentence, determines if it's an `income` or `expense`, extracts the `amount` and `merchant`, and categorizes it along with the underlying psychological *mood* (e.g., Stress, Treat, Essential, Convenience).
- **It calculates Cash Flow**: Instead of obsessing over 50 different micro-budgets, FlowSpend calculates your total income minus your total expenses to give you a single, massive **"In My Pocket"** number so you always know exactly how much safe spending money you have left.

## Core Features
* ✨ **AI Natural Language Input:** Skip the forms. Just type how you spent your money.
* 🧠 **Psychological Spending Insights:** Tracks the *mood* behind your spending to help you understand your financial habits on an emotional level.
* 💰 **"In My Pocket" Cash Flow:** A PocketGuard-style main dashboard widget showing exactly what you have left to spend.
* 📊 **Beautiful Analytics:** Interactive charts powered by Recharts showing your spending breakdown by category and emotion.
* 🚀 **Vercel Serverless Ready:** Designed as a full-stack monorepo that automatically deploys the Vite frontend and Express API backend onto Vercel out of the box.

## Tech Stack
* **Frontend:** React, Vite, Tailwind CSS, Recharts, Lucide Icons
* **Backend:** Node.js, Express (Vercel Serverless Functions)
* **Database:** Supabase (PostgreSQL)
* **AI:** Google Gemini (2.5-flash)

## Setup & Local Development

1. **Clone & Install**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file at the root of the project with the following keys:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   GEMINI_API_KEY=your-gemini-key
   ```

3. **Database Setup**
   Run the SQL scripts located in the `/database` folder in your Supabase SQL Editor to set up the `transactions` table.

4. **Run the App**
   Start both the frontend and the backend locally:
   ```bash
   npm run dev      # Starts the Vite frontend on port 5173
   node api/index.js # Starts the Express backend on port 5000 (if testing locally without Vercel CLI)
   ```

## Deployment
This project is configured for a 1-click deployment to **Vercel**. 
Simply import the repository in the Vercel Dashboard, ensure the root directory is `./`, and Vercel will automatically build the React app and host the `/api` Express routes as Serverless Functions.
