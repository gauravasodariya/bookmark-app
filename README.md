# 📑 BookMark - Smart Bookmark Manager

A modern, real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS. Save your favorite links securely and access them anywhere with real-time synchronization across devices.

**Live Demo**: https://bookmark-app-beige-rho.vercel.app/

## Features

✨ **Google OAuth Authentication** - Sign in with your Google account (no email/password needed)  
🔒 **Private Bookmarks** - Your bookmarks are completely private and secure  
⚡ **Real-Time Sync** - Changes sync instantly across all your open tabs/devices  
➕ **Easy to Add** - Quick bookmark creation with URL validation  
🗑️ **Manage Bookmarks** - Delete bookmarks you no longer need  
📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile  

## Tech Stack

- **Frontend**: Next.js 16 (App Router) with React 19
- **Styling**: Tailwind CSS 4
- **Backend/Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Google OAuth)
- **Real-time**: Supabase Realtime subscriptions
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- Google OAuth credentials
- Vercel account (for deployment)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/bookmark-app.git
cd bookmark-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and create a free account
2. Create a new project
3. Copy your **Project URL** and **Anon Key** from Settings → API

#### Create Database Tables

In your Supabase dashboard, go to **SQL Editor** and run this SQL:

```sql
-- Create bookmarks table
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_created_at ON bookmarks(created_at DESC);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
```

#### Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the **Google+ API**
4. Create OAuth 2.0 credentials:
   - Choose "Web application"
   - Add authorized redirect URI: `https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback`
   - Also add for local testing: `http://localhost:3000/auth/callback`
5. Copy **Client ID** and **Client Secret**

6. In Supabase dashboard:
   - Go to **Authentication → Providers**
   - Enable **Google**
   - Paste your **Client ID** and **Client Secret**

### 4. Set Up Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your Supabase project settings → API.

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Sign In**: Click "Sign in with Google" on the landing page
2. **Add Bookmarks**: Enter a title and URL in the "Add New Bookmark" form
3. **View Bookmarks**: Your bookmarks appear instantly in the list below
4. **Real-Time Updates**: Open the app in another tab/window - changes sync automatically
5. **Delete Bookmarks**: Click the "Delete" button to remove a bookmark
6. **Sign Out**: Click the "Logout" button in the header

## Project Structure

```
bookmark-app/
├── app/
│   ├── auth/
│   │   └── callback/
│   │       └── page.tsx          # OAuth callback handler
│   ├── components/
│   │   ├── LoginButton.tsx       # Google sign-in button
│   │   ├── LogoutButton.tsx      # Sign out button
│   │   ├── AddBookmark.tsx       # Bookmark form
│   │   └── BookmarkList.tsx      # Bookmarks display with real-time updates
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard page
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── lib/
│   └── supabase.ts               # Supabase client configuration
├── public/                        # Static assets
├── .env.local                     # Environment variables (local)
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Project dependencies
```


Made with Gaurav ♥️
---

