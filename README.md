# 3SD-Website
3rd Space Digital Official Website. A digital third place for artists to collaborate, showcase, and grow. A platform for our collective's creative work and community.

## Getting Started

This project is built with React, so you will need to follow the steps below for setup!
Vite is used for quick start up times, and immediate loading of new changes.
ESLint is used to analyze code for quality issues, consistency, best practice, and security. If you use the lint command to check your code, it makes sure what we push remains safe.

### Prerequisites
- Node.js (version 18 or +)
- npm

### Installation

Install dependencies:

`npm install`

### Environment & Google OAuth

For the app (and Google sign-in) to work, create a `.env.local` in the project root with:

- `VITE_SUPABASE_URL` – your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` – your Supabase anon/public key

**If Google sign-in fails for you (but works for someone else), check:**

1. **Redirect URI** – The URL you’re using (e.g. `http://localhost:5173/auth/callback` or your production URL) must be added in:
   - **Google Cloud Console** → APIs & Services → Credentials → your OAuth 2.0 Client ID → Authorized redirect URIs
   - **Supabase Dashboard** → Authentication → URL Configuration → Redirect URLs  
   Use the exact origin and path (including port for localhost).

2. **Same browser** – The code exchange must happen in the same browser (and ideally same device) where you started sign-in (PKCE flow).

3. **Env vars** – Ensure `.env.local` exists and has the correct `VITE_SUPABASE_*` values; restart the dev server after changing them.

### Scripts

`npm run dev` - Start the development server
`npm run build` - Build the project for production
`npm run lint` - Check for lint errors

### Project Structure

```
3SD-Website/
├── src/
│   ├── App.jsx       # Main App component
│   ├── App.css       # App styles
│   ├── main.jsx      # Application entry point
│   └── index.css     # Global styles
├── index.html        # HTML template
├── vite.config.js    # Vite configuration
└── package.json      # Project dependencies
```
