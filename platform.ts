# Supabase Setup Guide

1. Create a Supabase project in the closest region to your primary users.
2. Copy `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` into `.env.local`.
3. Create storage buckets for:
   - `photos`
   - `videos`
   - `audio`
   - `logos`
   - `headshots`
   - `brand-assets`
4. Use row-level security policies that scope records to organization membership.
5. Keep large generated video delivery on Mux or Cloudinary unless Supabase storage is explicitly preferred.
