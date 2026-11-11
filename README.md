# Union Parishad Budget Portal

Frontend client for the Union Parishad Budget Portal, a bilingual public and admin-facing web application for viewing, publishing, and managing Union Parishad budget information.

The app includes:

- public budget browsing by form, union, and financial year
- dashboard workflows for budget forms KA, KHA, GA, and GHA
- authentication-protected office screens
- progress tracking, recent activity, notifications, reports, and profile settings
- feedback submission, FAQ, support center, training videos, user manuals, and legal pages
- Bangla/English language support

## Tech stack

- React 19
- TypeScript
- Vite
- Redux Toolkit + RTK Query
- React Router
- React Hook Form + Zod
- i18next
- Tailwind CSS
- Recharts
- Radix UI / shadcn-style components
- React PDF, xlsx, and related document utilities

## Prerequisites

- Node.js 20 or newer recommended
- npm
- Backend API configured and reachable from the frontend

## Setup

Clone the repository and install dependencies:

```bash
npm install
```

Create a `.env` file in the project root with the required values:

```bash
VITE_PUBLIC_BASE_API_URL=https://api.example.com
VITE_PUBLIC_BASE_IMAGE_URL=https://assets.example.com
VITE_PUBLIC_FILE_BASE_URL=https://files.example.com
VITE_FORM_GA_OTHER_ALLOWANCE_HEAD_ID=21
```

Only `VITE_PUBLIC_BASE_API_URL` is required for the app to talk to the backend. The other values are used for media/file URLs and form-specific configuration when applicable.

## Development

Run the app locally:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

## What the app does

### Public portal

- browse published Union Parishad budgets
- filter by division, district, upazila, and union
- view budget details for available financial years
- read legal, RTI, FAQ, training, support, and user guide pages
- submit public feedback

### Dashboard

- office login and protected routes
- manage budget form workflows
- track form status and activity
- view notifications, reports, and recent activity
- manage profile and account-related pages

### Budget forms

The app supports the common Union Parishad budget form flow:

- Form Ka
- Form Kha
- Form Ga
- Form Gha

These forms include list, details, workflow, import/export, PDF generation, and table-based editing features.

## Project structure

```text
src/
|-- app/              # App providers and initialization
|-- components/       # Shared UI and layout components
|-- features/         # Feature-based modules and pages
|-- hooks/            # Shared React hooks
|-- lib/              # Utility libraries and helpers
|-- routes/           # Route configuration
|-- redux/            # Store and API setup
|-- types/            # Shared TypeScript types
`-- utils/            # General utilities
```

## Notes

- The app uses cookie-aware API requests and bearer tokens where available.
- Language support is wired through the i18n layer and the UI can switch between English and Bangla.
- The branding and content are aligned with the Union Parishad Budget Portal, not the older placeholder project text that was previously in this file.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and build the app for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint across the project |
