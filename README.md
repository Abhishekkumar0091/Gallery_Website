# 📸 Media Gallery Website

A professional full-stack **Media Gallery Web Application** built with **React, TypeScript, Tailwind CSS, and Supabase**.  
Users can securely upload, manage, and view photos and videos with authentication and private storage.

---

## 🚀 Features

- 🔐 Secure Email/Password Authentication
- 📤 Drag & Drop Media Upload (Images & Videos)
- 🖼 Responsive Gallery Grid Layout
- 🔎 Full-Screen Lightbox Viewer
- ⬅️➡️ Navigation Between Media Items
- 📥 Download Media
- 🗑 Delete Media
- 🛡 Row Level Security (RLS) for Data Protection
- 📱 Fully Responsive Design

---

## 🛠 Tech Stack

| Technology | Usage |
|------------|--------|
| React + TypeScript | Frontend Development |
| Tailwind CSS | Styling |
| Supabase | Backend (Auth, DB, Storage) |
| Vite | Build Tool |
| Context API | Global State Management |

---

## 📂 Project Structure

media-gallery/
│
├── public/ # Static assets
│
├── src/
│ ├── components/ # Reusable UI Components
│ │ ├── AuthForm.tsx # Login & Registration Form
│ │ ├── MediaUpload.tsx # Drag & Drop Upload Component
│ │ ├── MediaGallery.tsx # Gallery Grid & Lightbox Viewer
│ │
│ ├── contexts/ # Global Context Providers
│ │ ├── AuthContext.tsx # Authentication State Management
│ │
│ ├── lib/ # External Configurations
│ │ ├── supabase.ts # Supabase Client Configuration
│ │
│ ├── types/ # TypeScript Type Definitions
│ │ ├── database.ts # Database Types & Interfaces
│ │
│ ├── App.tsx # Main Application Component
│ ├── main.tsx # Application Entry Point
│
├── .env # Environment Variables
├── package.json # Project Dependencies
├── vite.config.ts # Vite Configuration
└── README.md # Project Documentation
