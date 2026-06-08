# Cloudflare Setup Guide

1. Move DNS for the production domain to Cloudflare.
2. Point the root and `www` records to Vercel.
3. Enable WAF managed rules and bot protection.
4. Set cache rules for static assets while leaving authenticated dashboard and API routes dynamic.
5. Enable DNSSEC.
6. Use Cloudflare Turnstile on public lead capture forms if abuse appears.
