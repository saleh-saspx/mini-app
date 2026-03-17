# MiniApp Dashboard (Next.js)

Professional responsive dashboard for Laravel MiniApp backend APIs.

## Features

- Token-based authentication (`POST /api/login`)
- Sidebar + topbar dashboard layout with mobile responsiveness
- Accounts management:
  - List accounts: `GET /mini-app/account/{username}`
  - Create account: `POST /mini-app/store`
  - Update plan: `POST /mini-app/account/{username}/plan`
  - Update password: `POST /mini-app/account/{username}/password`
  - Terminate account: `POST /mini-app/account/{username}/terminate`
- Wallets management (`GET /mini-app/wallets`) with pagination and total balance
- Packages view (`GET /mini-app/packages`)
- Profile page with password update and logout
- React Context for auth/session state
- Axios API layer with `Authorization: Bearer <token>`
- Toast notifications, loading states, and confirmation modal for account termination
- Analytics cards on home dashboard

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Axios
- React Hot Toast

## Project Structure

- `app/` route pages and app setup
- `components/layout/` dashboard shell components
- `components/ui/` reusable UI components
- `context/` auth state management
- `lib/` API and helpers
- `types/` shared API types

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env.local
```

3. Set backend URL in `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

4. Run development server:

```bash
npm run dev
```

5. Open:

- http://localhost:3000/login

## Notes

- Ensure Laravel backend CORS allows your Next.js origin.
- Login token is persisted in `localStorage`.
- All protected routes redirect to `/login` when unauthenticated.
