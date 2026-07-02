# 🌱 AgriFarm — Live Market Prices for Ghanaian Farmers

AgriFarm is a full-stack web application that delivers **real-time crop prices** from 5 major Ghanaian markets to farmers, traders, and agricultural stakeholders. Built as a Final Year Project by **Accra Technical University — Group 39**.

> _"Know the right price before market day."_

---

## ✨ Features

- **📊 Daily Price Tracking** — Up-to-date prices entered by MoFA data officers from every major market
- **📍 Market Comparison** — Compare crop prices side-by-side across 5 regional hubs
- **📱 SMS Alerts** — Subscribe to a commodity and receive price updates by SMS — no internet needed
- **📈 Price Trends** — Track how prices move over weeks and months to plan when to sell
- **🔐 Role-Based Access** — Farmers, data officers, and admins each have tailored permissions
- **📝 Audit Logging** — Full transparency on price entries and modifications

## 🏪 Markets Covered

| Market                | Region        |
| --------------------- | ------------- |
| Makola Market         | Greater Accra |
| Kumasi Central Market | Ashanti       |
| Kejetia Market        | Ashanti       |
| Techiman Market       | Bono East     |
| Tamale Market         | Northern      |

## 🌾 Commodities Tracked (20)

**Vegetables** — Tomatoes, Onions, Pepper, Garden Eggs, Okra  
**Tubers** — Yam, Cassava, Cocoyam, Sweet Potato  
**Cereals** — Maize, Rice, Millet, Sorghum  
**Legumes** — Groundnuts, Cowpea, Soybeans  
**Fruits** — Plantain, Watermelon, Orange, Pineapple

---

## 🛠 Tech Stack

| Layer              | Technology                                                                  |
| ------------------ | --------------------------------------------------------------------------- |
| **Framework**      | [TanStack Start](https://tanstack.com/start) (React 19 + SSR)               |
| **Routing**        | [TanStack Router](https://tanstack.com/router)                              |
| **Data Fetching**  | [TanStack Query](https://tanstack.com/query) + Server Functions             |
| **Styling**        | [Tailwind CSS v4](https://tailwindcss.com/)                                 |
| **UI Components**  | [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| **Backend / Auth** | [Supabase](https://supabase.com/) (PostgreSQL, Auth, RLS)                   |
| **Build Tool**     | [Vite 8](https://vite.dev/)                                                 |
| **Runtime**        | [Bun](https://bun.sh/) / Node.js                                            |

---

## 🚀 Getting Started

### Prerequisites

- **Bun** ≥ 1.0 (or Node.js ≥ 18 + npm)
- A [Supabase](https://supabase.com/) project

### 1. Clone the repository

```bash
git clone https://github.com/devkad09/agriprice-hub.git
cd agriprice-hub
```

### 2. Install dependencies

```bash
bun install
# or
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_PUBLISHABLE_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
```

### 4. Set up the database

Run the SQL migrations in your Supabase dashboard (SQL Editor) from the `supabase/migrations/` directory. These will create all required tables, RLS policies, roles, and seed data.

### 5. Start the dev server

```bash
bun run dev
# or
npm run dev
```

The app will be available at **http://localhost:8080**.

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components (shadcn/ui)
│   └── ui/              # Base component library
├── hooks/               # Custom React hooks
├── integrations/
│   └── supabase/        # Supabase client, auth middleware, types
├── lib/                 # Utilities, server functions, auth helpers
│   ├── prices.functions.ts   # All price CRUD server functions
│   ├── use-auth.ts           # Auth state hook
│   └── utils.ts              # General utilities
├── routes/              # File-based routing (TanStack Router)
│   ├── __root.tsx       # Root layout, providers, error boundary
│   ├── index.tsx        # Home / landing page
│   └── auth.tsx         # Sign in / sign up page
├── router.tsx           # Router configuration
├── server.ts            # SSR entry point
├── start.ts             # TanStack Start middleware setup
└── styles.css           # Global styles & design tokens
```

---

## 🔒 User Roles

| Role             | Permissions                                                 |
| ---------------- | ----------------------------------------------------------- |
| **Farmer**       | View prices, markets, commodities; manage SMS subscriptions |
| **Data Officer** | All farmer permissions + create/update/delete prices        |
| **Admin**        | Full access including user role management and audit logs   |

New users are automatically assigned the `farmer` role on sign-up.

---

## 📜 Scripts

| Command           | Description               |
| ----------------- | ------------------------- |
| `bun run dev`     | Start development server  |
| `bun run build`   | Production build          |
| `bun run preview` | Preview production build  |
| `bun run lint`    | Run ESLint                |
| `bun run format`  | Format code with Prettier |

---

## � Deployment

### Frontend on Vercel

1. Create a new Vercel project from this repository root.
2. Set the install command to `npm install` and the build command to `npm run build`.
3. Set the output directory to `dist` if Vercel asks for one.
4. Add these environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_USE_MOCK_SUPABASE=false`
   - `JWT_SECRET` (optional, if custom server functions depend on it)
5. Deploy and verify the app loads and authentication works.

> Note: the current frontend is primarily wired to Supabase auth/data, so Vercel should serve the TanStack Start app with those keys available.

### Backend on Railway

1. Create a Railway project and connect it to the `backend/` folder in this repo.
2. Use the service's `start` command: `npm start`.
3. Add the following environment variables on Railway:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `CLIENT_URL` (your Vercel frontend URL)
   - `AT_USERNAME` (Africa's Talking username)
   - `AT_API_KEY` (Africa's Talking API key)
4. If you use Railway Postgres for the app database, apply the SQL schema from `backend/models/schema.sql` and seed data from `backend/models/seed.sql`.

### Why this split

- `backend/` runs as a standalone Express API on Railway.
- The root app runs as the frontend SSR site on Vercel.
- If you want the frontend to call the Express API instead of Supabase, add a `BACKEND_URL` environment variable and migrate API calls accordingly.

---

## �📄 License

This project was developed as a Final Year Project at **Accra Technical University** by **Group 39**.

---

<p align="center">
  Built with 💚 for Ghanaian farmers
</p>
