# 📑 BookMark - Smart Bookmark Manager

A modern, secure, and real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS. Users can log in using Google OAuth, save bookmarks privately, and see updates instantly across multiple tabs and devices.

---

## 🌐 Live Demo

https://bookmark-app-beige-rho.vercel.app/

---

## ✨ Features

* 🔐 Google OAuth Authentication (Supabase Auth)
* 🔒 Private bookmarks per user (Row Level Security)
* ⚡ Real-time synchronization across tabs and devices
* ➕ Add bookmarks with title and URL
* 🗑️ Delete your own bookmarks
* 📱 Fully responsive design
* 🚀 Deployed on Vercel

---

## 🛠️ Tech Stack

**Frontend**

* Next.js (App Router)
* React
* Tailwind CSS

**Backend**

* Supabase (PostgreSQL database)
* Supabase Authentication (Google OAuth)
* Supabase Realtime subscriptions

**Deployment**

* Vercel

---

## 🧠 Architecture Overview

The application follows a modern full-stack architecture using Next.js and Supabase Backend-as-a-Service.

### Frontend (Next.js)

* Handles UI rendering and user interaction
* Uses Supabase client SDK
* Manages authentication state
* Subscribes to real-time updates

### Backend (Supabase)

* PostgreSQL database stores bookmarks
* Supabase Auth handles Google OAuth login
* Row Level Security ensures data privacy
* Supabase Realtime broadcasts database changes

---

## 🔐 Authentication Flow

1. User clicks "Login with Google"
2. Supabase redirects to Google OAuth
3. User authenticates with Google
4. Google redirects back to Supabase
5. Supabase creates user session
6. Frontend fetches bookmarks for authenticated user

---

## ⚡ Real-Time Flow

1. User adds or deletes bookmark
2. Supabase updates PostgreSQL database
3. Supabase Realtime sends event to clients
4. All open tabs receive update instantly
5. Bookmark list updates without refresh

---

## 🗄️ Database Schema

Table: `bookmarks`

Columns:

* id (uuid, primary key)
* user_id (uuid, references auth.users)
* title (text)
* url (text)
* created_at (timestamp)
* updated_at (timestamp)

---

## 🔒 Security (Row Level Security)

RLS ensures users can only access their own bookmarks.

Policies:

* Users can view their own bookmarks
* Users can insert their own bookmarks
* Users can delete their own bookmarks

---

## ⚙️ Environment Variables

Create `.env.local` in root folder:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## ▶️ Run Locally

Clone repository:

```
git clone https://github.com/gauravasodariya/bookmark-app.git
```

Go to project folder:

```
cd bookmark-app
```

Install dependencies:

```
npm install
```

Run development server:

```
npm run dev
```

Open in browser:

```
http://localhost:3000
```

---

## 🚀 Deployment (Vercel)

Steps:

1. Push project to GitHub

2. Go to https://vercel.com

3. Click "New Project"

4. Import GitHub repository

5. Add environment variables:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

6. Click Deploy

7. Add redirect URL in Supabase:

```
https://bookmark-app-beige-rho.vercel.app/auth/callback
```

Deployment complete.

---

## 📁 Project Structure

```
bookmark-app/
│
├── app/
│   ├── auth/callback/page.tsx
│   ├── components/
│   │   ├── LoginButton.tsx
│   │   ├── LogoutButton.tsx
│   │   ├── AddBookmark.tsx
│   │   └── BookmarkList.tsx
│   ├── dashboard/page.tsx
│   ├── layout.tsx
│   └── page.tsx
│
├── lib/
│   └── supabase.ts
│
├── public/
│
├── .env.local
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## ⚠️ Challenges Faced and Solutions

### 1. OAuth Redirect Issue

Problem: After deployment, Google OAuth redirected to localhost instead of production.

Solution:

* Added production redirect URL in Supabase
* Updated Site URL in Supabase settings
* Configured redirect URLs in Google Cloud Console

---

### 2. Real-Time Updates Not Working

Problem: Bookmark list did not update automatically.

Solution:

* Enabled Supabase Realtime
* Added bookmarks table to realtime publication
* Subscribed to realtime changes in frontend

---

### 3. Bookmark Privacy Issue

Problem: Users could see other users' bookmarks.

Solution:

* Enabled Row Level Security
* Created policies restricting access by user_id

---

### 4. Environment Variables Not Working in Production

Problem: Supabase connection failed on Vercel.

Solution:

* Added environment variables in Vercel dashboard
* Redeployed project

---

### 5. Authentication State Flicker

Problem: Login page flashed briefly before redirect.

Solution:

* Added loading state while checking auth
* Implemented proper authentication guards

---

## 👨‍💻 Author

Gaurav Asodariya
MSc IT Student, DAIICT

GitHub: https://github.com/gauravasodariya

---

## 📌 Conclusion

This project demonstrates modern full-stack development using Next.js and Supabase, including authentication, database security, real-time updates, and production deployment.

It follows best practices for security, scalability, and performance.
