# Architecture Overview

## Product Modules

- Landing page: conversion-focused, original luxury New England positioning.
- Dashboard: recent projects, usage metrics, and quick actions.
- Projects: create, upload, duplicate, and archive listing campaigns.
- Media library: photos, videos, audio, logos, headshots, and reusable brand assets.
- Brand center: colors, fonts, logos, brokerage details, agent details, disclosures, and contact data.
- Video studio: guided creation workflow plus timeline editor surface.
- Admin: users, usage, feature flags, monitoring, support, and moderation.

## AI Services

- OpenAI: descriptions, scripts, social copy, narration planning.
- Replicate: image enhancement and virtual staging framework.
- Runway: future-ready video generation provider.
- Stability AI: future-ready image enhancement and replacement provider.

## Video Services

- FFmpeg: timeline composition, overlays, audio mixing, aspect-ratio exports.
- Mux: video hosting, playback IDs, delivery, and readiness webhooks.

## Analytics

Track these events:

- `signup_started`
- `project_created`
- `media_uploaded`
- `description_generated`
- `video_generation_started`
- `export_completed`

The `UsageTracking` table is the internal billing and quota source. PostHog and Google Analytics are product and acquisition analytics layers.
