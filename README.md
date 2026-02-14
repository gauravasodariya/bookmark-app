# 📑 BookMark - Smart Bookmark Manager

A modern, real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS. Save your favorite links securely and access them anywhere with real-time synchronization across devices.

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

-- Enable RLS (Row Level Security)
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: Users can only see their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

-- Create RLS policy: Users can insert their own bookmarks
CREATE POLICY "Users can insert their own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policy: Users can delete their own bookmarks
CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Enable Realtime for the bookmarks table
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

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/bookmark-app.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "Add New → Project"
3. Select your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click "Deploy"

### 3. Update Google OAuth Redirect URI

In Google Cloud Console, add your Vercel URL as an authorized redirect URI:
- `https://your-vercel-app.vercel.app/auth/callback`

In Supabase, update your site URL:
- Project Settings → Configuration → Site URL: `https://your-vercel-app.vercel.app`

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

## Problems & Solutions

### Problem 1: "User does not have permission" error
**Cause**: Row Level Security (RLS) policies not properly configured.

**Solution**: 
- Ensure all RLS policies are created correctly
- Check that `auth.uid()` matches the user ID in your bookmarks table
- Go to Supabase SQL Editor and re-run the RLS policy section

### Problem 2: Real-time updates not working
**Cause**: Realtime not enabled on the bookmarks table.

**Solution**:
- Ensure the table has Realtime enabled with: `ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;`
- Verify subscription in code is listening to the correct channel and filter

### Problem 3: Google OAuth redirect fails
**Cause**: Redirect URI not configured correctly.

**Solution**:
- Verify in Google Cloud Console that all redirect URIs are added:
  - Local: `http://localhost:3000/auth/callback`
  - Production: `https://your-vercel-app.vercel.app/auth/callback`
  - Supabase: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
- Clear browser cache and cookies
- Try in an incognito window

### Problem 4: Bookmarks not appearing after adding
**Cause**: Database not synced or form not triggering refresh.

**Solution**:
- Check browser console for errors
- Verify you're logged in with a valid user
- Check Supabase database directly to see if bookmark was inserted
- Ensure RLS policies allow reading your own bookmarks

### Problem 5: CORS errors
**Cause**: Supabase URL or keys incorrect.

**Solution**:
- Double-check environment variables are correct
- Environment variables should be in `.env.local` file
- Restart the development server after changing `.env.local`

### Problem 6: Can't see other users' bookmarks (expected behavior)
**This is a feature, not a bug!** RLS policies ensure only you can see your own bookmarks.

- User A's bookmarks are completely private from User B
- This is handled automatically by Supabase's RLS policies
- Each user only queries their own `user_id`

## Performance Optimization

- **Real-time subscriptions**: Only subscribe to user-specific bookmarks (filtered by `user_id`)
- **Database indexes**: Created on `user_id` and `created_at` for fast queries
- **Lazy loading**: Bookmarks only loaded when user views dashboard
- **Image optimization**: Next.js automatic image optimization

## Security Features

🔐 **OAuth Only**: No passwords to compromise
🔒 **RLS Policies**: Database-level access control
🛡️ **HTTPS**: All communication encrypted
🔑 **Secrets**: Never exposed in frontend code
👤 **User Privacy**: Each user's data completely isolated

## Troubleshooting

### Local Development Issues

**Issue**: Port 3000 already in use
```bash
# Kill the process or use a different port
npm run dev -- -p 3001
```

**Issue**: Module not found errors
```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
```

**Issue**: TypeScript errors
```bash
# Ensure all dependencies are installed and types are correct
npm install
npm run build
```

### Browser Issues

- Try clearing browser cache and cookies
- Use an incognito window
- Check that cookies are enabled
- Disable browser extensions temporarily

## Contributing

This is a personal project, but feel free to fork and modify for your own use!

## License

MIT License - feel free to use this project however you'd like.

## Support & Questions

For issues or questions:
1. Check the Problems & Solutions section above
2. Review the code comments
3. Check Supabase documentation: https://supabase.com/docs
4. Check Next.js documentation: https://nextjs.org/docs

---

**Built with ❤️ using Next.js + Supabase**

**Live Demo**: https://your-vercel-app.vercel.app  
**GitHub Repository**: https://github.com/yourusername/bookmark-app
