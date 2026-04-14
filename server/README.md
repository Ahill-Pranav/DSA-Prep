---
title: DSA Tracker Pro API
emoji: 🚀
colorFrom: emerald
colorTo: black
sdk: docker
pinned: false
app_port: 7860
---

# DSA Tracker Pro - Backend API

This is the FastAPI backend for the DSA Tracker Pro application.

## Deployment Info

- **SDK**: Docker
- **Port**: 7860
- **Database**: Supabase PostgreSQL

## Environment Variables Needed

- `DATABASE_URL`: Connection string for Supabase.
- `RESEND_API_KEY`: API key for Resend email notifications.
- `SECRET_KEY`: Random string for JWT signing.
- `NEXT_PUBLIC_FRONTEND_URL`: URL of the Vercel frontend (optional, for CORS).
