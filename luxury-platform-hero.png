# Production Deployment Guide

## Launch Checklist

- Provision production Postgres and run Prisma migrations.
- Configure Clerk production keys, redirects, and webhooks.
- Configure Cloudinary signed upload presets.
- Configure Mux credentials and webhook processing.
- Configure Resend verified sending domain.
- Configure PostHog and Google Analytics.
- Configure Sentry alerts and release tracking.
- Configure Cloudflare DNS, WAF, CDN, and security policies.
- Run accessibility, mobile, and performance QA.
- Confirm legal review for generated listing copy disclaimers.

## Scaling Plan

- Keep web requests short. Long-running video work should run through background jobs.
- Store immutable asset metadata in Postgres and media binaries in Cloudinary, Mux, or Supabase storage.
- Use organization-scoped indexes for project, asset, video, export, and usage queries.
- Add rate limits for AI generation, uploads, and exports.
- Cache public landing pages and lead pages at the CDN edge.
- Add queue-level concurrency controls for FFmpeg and provider APIs.
- Use usage tracking to drive billing limits, abuse monitoring, and customer success alerts.
