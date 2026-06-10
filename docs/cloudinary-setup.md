# Cloudinary Setup Guide

1. Create upload presets for listing photos, logos, headshots, audio, and exported videos.
2. Set:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
3. Use signed uploads for authenticated dashboard uploads.
4. Store returned `public_id`, dimensions, duration, bytes, and secure URL in the `Asset` table.
5. Apply transformations for thumbnails, gallery previews, and social aspect ratios.
