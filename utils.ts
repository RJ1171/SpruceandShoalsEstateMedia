# Clerk Setup Guide

1. Create a Clerk application.
2. Enable email/password and any desired SSO providers.
3. Set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.
4. Configure redirect URLs:
   - Development: `http://localhost:3000/dashboard`
   - Production: `${NEXT_PUBLIC_APP_URL}/dashboard`
5. Configure a webhook pointed at `/api/webhooks/clerk`.
6. Add Svix signature verification before turning the webhook on for production writes.

Use Clerk organization metadata or the Prisma `Organization` and `Membership` tables as the source of truth. Avoid splitting authority between both without a sync policy.
