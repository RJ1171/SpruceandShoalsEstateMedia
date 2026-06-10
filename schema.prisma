# Local Setup Guide

## Requirements

- Node.js 20+
- PostgreSQL database
- Clerk application
- Supabase project
- Cloudinary account
- OpenAI API key
- Resend account
- Mux account

## Install

```bash
npm install
cp .env.example .env.local
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Open `http://localhost:3000`.

## Notes

- All editable brand defaults live in `config/brand.ts`.
- The dashboard and video generation routes are protected by Clerk middleware.
- The AI routes fail fast when `OPENAI_API_KEY` is missing.
- The video generation endpoint currently enqueues a provider-neutral job object. Connect it to a queue such as Inngest, Trigger.dev, or a dedicated worker when enabling long-running FFmpeg jobs.
