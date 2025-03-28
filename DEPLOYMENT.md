# Deployment Guide

This document outlines the steps required to deploy the Retell AI Voice Assistant application.

## Architecture Overview

The application is split into two main components:
1. **Next.js Application**: Deployed on Vercel
2. **WebSocket Server**: Deployed on Railway

Both components connect to the same Supabase database and Retell API.

## Prerequisites

- Vercel account
- Railway account
- Supabase account
- Retell AI account
- Cal.com account
- GitHub account

## Deployment Steps

### 1. Set up Supabase

1. Create a new Supabase project
2. Run the database migrations (located in `supabase/migrations`)
3. Create a service role key
4. Note down the Supabase URL and keys

### 2. Set up Retell AI

1. Create a new Retell AI account
2. Create a new agent
3. Configure the agent with the appropriate voice and language settings
4. Note down the agent ID and API key

### 3. Set up Cal.com

1. Create a new Cal.com account
2. Set up an event type
3. Generate an API key
4. Note down the event type ID and API key

### 4. Deploy WebSocket Server to Railway

1. Create a new Railway project
2. Connect your GitHub repository
3. Add the following environment variables:
   - `NEXT_PUBLIC_RETELL_API_KEY`
   - `RETELL_API_KEY`
   - `NEXT_PUBLIC_SITE_URL`
   - `NODE_ENV=production`
4. Deploy the service
5. Note down the Railway app URL

### 5. Deploy Next.js Application to Vercel

1. Create a new Vercel project
2. Connect your GitHub repository
3. Add all environment variables from `.env.example`
4. Update the `RETELL_WEBHOOK_URL` to point to your Vercel deployment URL
5. Update the `NEXT_PUBLIC_WEBSOCKET_SERVER` to point to your Railway deployment URL
6. Deploy the application

### 6. Configure Retell Webhook

After deployment, run:

```bash
RETELL_WEBHOOK_URL=https://your-vercel-url.vercel.app/api/webhook npm run configure-agent
```

This will update your Retell agent to use the correct webhook URL.

## Verifying the Deployment

1. Visit your deployed application
2. Sign in with Supabase authentication
3. Try making a call using the Retell widget
4. Check the logs in both Vercel and Railway

## Troubleshooting

### WebSocket Connection Issues

If the WebSocket connection fails:
1. Check that the `NEXT_PUBLIC_WEBSOCKET_SERVER` environment variable is correctly set
2. Verify that the Railway service is running
3. Check CORS settings in the WebSocket server

### Retell Integration Issues

If calls aren't working properly:
1. Verify that the `RETELL_WEBHOOK_URL` is correctly set and accessible
2. Check that the agent ID and API key are correct
3. Run the configure-agent script to update the webhook URL

### Database Connection Issues

If database connections fail:
1. Verify that the Supabase URL and keys are correct
2. Check network rules in Supabase to ensure the application can connect

## Monitoring and Logging

- Vercel provides built-in logging for the Next.js application
- Railway provides logs for the WebSocket server
- Check both platforms for any errors

## Scaling Considerations

- The WebSocket server may need to be scaled up as usage increases
- Consider moving to a dedicated VPS or Kubernetes cluster for high-traffic scenarios

## Security Notes

- Ensure that all API keys are kept secure
- Regularly rotate API keys
- Enable Supabase RLS (Row Level Security) for production 