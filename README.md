# JobPulse AI – Frontend

A stunning full-stack AI-powered job portal with role-based dashboards, real-time messaging, and an intelligent
Grok-3-Mini Career Coach.

![JobPulse AI](/preview.png)

## ✨ Live Demo
[View Live Demo](https://jobpulse-ai-frontend.vercel.app)

## 🚀 Tech Stack
- **Next.js 15** (App Router + React Compiler)
- **TypeScript**
- **Tailwind CSS v4 + DaisyUI**
- **Framer Motion**
- **Lucide React** (Icons)
- **React Toastify** + **Confetti**
- **Axios** for API calls
- **Socket.io**
## 🎯 Key Features

### For Job Seekers
- Apply with cover letter in a smooth modal
- **AI Career Coach** – 24/7 intelligent guidance powered by Grok-3-Mini
- Track all applications with real-time status

### For Employers
- Post new jobs (pending admin approval)
- Manage postings and view received applications
- Simple, elegant dashboard

### For Admin
- Review & approve/reject pending jobs
- Manage all users
- Full platform oversight

### General
- Fully responsive dark-first modern design
- Role-based dashboards with smooth sidebar
- Heavy Framer Motion animations (stagger, spring, hover effects)
- Secure JWT authentication
- Chat system is still in devlopment

## 🛠️ Installation & Setup

```bash
git clone https://github.com/TheLunatic1/jobpulse-ai-frontend.git
cd jobpulse-ai-frontend

npm install
npm run dev
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://jobpulse-ai-backend.onrender.com
```

## 📱 Pages
- `/` – Home with Hero, Featured Jobs, Why Choose Us, Impact Stats, Trusted By, Testimonials
- `/jobs` – All open positions
- `/companies` – Company directory
- `/companies/[id]` – Company profile
- `/ai-coach` – Dedicated AI Coach landing
- `/about` – About the project
- `/dashboard` – Role-based dashboard (Job Seeker / Employer / Admin)
- `/auth/login` & `/auth/register`

## ✨ Highlights for Resume
- Heavy use of Framer Motion for buttery smooth animations
- Role-based authentication and protected routes
- Real-time features using Socket.IO (backend)
- Clean, maintainable TypeScript codebase
- Fully responsive design with Tailwind + DaisyUI

---

Made by **Salman Toha**  
