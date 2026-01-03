# 🚀 CodeHopper – AI-Powered GitHub Code Review Platform

CodeHopper is a **full-stack SaaS application** that automatically reviews GitHub Pull Requests using **AI + RAG (Retrieval Augmented Generation)**.  
It provides **context-aware, human-like code reviews** directly on GitHub, along with a modern dashboard for analytics, repositories, and billing.

---

## ✨ Key Features

### 🤖 AI-Powered Code Reviews
- Automatic PR review generation using **Google Gemini AI**
- Context-aware reviews using **RAG (vector embeddings)**
- Reviews include:
  - Code walkthrough
  - Summary & strengths
  - Issues & suggestions
  - Best practices
  - AI-generated insights (including creative summaries)

---

### 🔗 GitHub Integration
- Connect multiple GitHub repositories
- Automatic **webhook handling** for PR events
- Real-time AI review on PR open/update
- Reviews posted **directly as GitHub PR comments**

---

### 🧠 Retrieval Augmented Generation (RAG)
- Automatic repository indexing
- Codebase converted into vector embeddings
- Semantic search across entire repository
- AI receives **full project context**, not just diffs

---

### 📊 Dashboard & Analytics
- Repository, PR, and review statistics
- Monthly activity charts
- GitHub contribution heatmap
- Review status tracking (pending / completed / failed)

---

### 🗂 Repository Management
- Browse all GitHub repositories
- Connect / disconnect repositories
- Infinite scroll pagination
- Repository connection status tracking

---

### 💳 Subscription & Billing
- **Free Plan**
  - Up to 5 repositories
  - Limited reviews per repository
- **Pro Plan**
  - Unlimited repositories
  - Unlimited reviews
- Billing portal integration
- Usage tracking and limits
- Subscription status sync

---

### ⚙ Background Processing
- **Inngest** for async job handling
- Repository indexing jobs
- AI review generation jobs
- Concurrency control and retries

---

### 🎨 Modern UI / UX
- Built with **shadcn/ui + Tailwind CSS**
- Dark mode first design
- Skeleton loaders and spinners
- Toast notifications
- Premium SaaS-style UI (Stripe / Vercel inspired)

---

## 🧱 Tech Stack

**Frontend**
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query

**Backend**
- Node.js
- Prisma
- PostgreSQL
- GitHub REST & GraphQL APIs
- Webhooks

**AI / Infra**
- Google Gemini AI
- RAG (Vector Embeddings)
- Inngest (Background Jobs)
- ngrok (Webhook tunneling)

---

## 🛠️ Running the Project Locally

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/codehopper.git
cd codehopper
