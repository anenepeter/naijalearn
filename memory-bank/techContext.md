# Technical Context: NaijaLearn

## Technologies Used
- **Frontend Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4
- **State Management:** Redux Toolkit
- **Deployment:** Vercel
- **Backend & Database (BaaS):** Supabase (Authentication, Database, Storage)
- **Content Management System (CMS):** Sanity.io
- **Interactive Component Libraries:**
    - `@dnd-kit/core`
    - `Framer Motion`
    - `react-leaflet`
- **Icons:** Lucide Icons or Heroicons
- **TypeScript:** Used throughout the project for type safety.
- **Testing:** Jest, React Testing Library, MSW, Cypress or Playwright.
- **Code Quality:** ESLint, Prettier.
- **Error Tracking:** Sentry or similar.

## Development Setup
- Node.js and npm/yarn/pnpm installed.
- Git for version control.
- VS Code (recommended) with relevant extensions (Tailwind CSS, ESLint, Prettier).
- Supabase CLI (optional, for local development/migrations).
- Sanity CLI (`npm install -g @sanity/cli`).
- Environment variables configured for Supabase and Sanity keys (`.env.local`).

## Technical Constraints
- Adherence to Next.js 15 App Router conventions.
- Utilizing stable features of Tailwind CSS v4; documenting workarounds if experimental features cause issues.
- Supabase Row Level Security (RLS) must be enabled and correctly configured for all tables.
- Secure management of API keys and sensitive information via environment variables.
- Performance optimization targets (Lighthouse scores, Core Web Vitals).
- Accessibility compliance (WCAG 2.1 AA).
- Sanity.io schema definitions must support the required content types and relationships.

## Dependencies
- `next`, `react`, `react-dom`
- `tailwindcss`, `postcss`, `autoprefixer`
- `react-redux`, `@reduxjs/toolkit`
- `@supabase/supabase-js`
- `@sanity/client`, `@portabletext/react`, `@sanity/image-url`
- `@dnd-kit/core`
- `framer-motion`
- `react-leaflet`, `leaflet`
- `lucide-react` or `heroicons/react`
- Development dependencies: `typescript`, `@types/react`, `@types/node`, `eslint`, `prettier`, testing libraries (Jest, React Testing Library, Cypress/Playwright), MSW.