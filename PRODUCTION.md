# Production Deployment Guide

This guide covers deploying the Lunaluna AI application to production.

## Prerequisites

- Node.js 18+
- npm or yarn
- Docker (optional)
- Production environment variables configured

## Environment Setup

1. Copy the example environment file:

   ```bash
   cp env.production.example .env.production
   ```

2. Update the environment variables in `.env.production` with your production values:
   - API endpoints
   - Authentication keys
   - AI service credentials
   - Analytics tracking IDs

## Build Commands

### Development

```bash
npm run dev
```

### Production Build

```bash
# Standard production build
npm run build:production

# Build with bundle analysis
npm run build:analyze

# Type checking only
npm run type-check

# Linting
npm run lint
npm run lint:fix
```

### Production Server

```bash
npm run start:production
```

## Deployment Options

### Option 1: Direct Deployment

1. Run the deployment script:

   ```bash
   # Windows
   deploy.bat

   # Linux/Mac
   ./deploy.sh
   ```

2. Start the production server:
   ```bash
   npm run start:production
   ```

### Option 2: Docker Deployment

1. Build the Docker image:

   ```bash
   docker build -t lunaluna-ai .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 --env-file .env.production lunaluna-ai
   ```

### Option 3: Vercel Deployment

1. Install Vercel CLI:

   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

## Production Optimizations

### Next.js Configuration

- Standalone output for Docker
- Image optimization enabled
- Security headers configured
- Bundle analysis available
- CSS optimization enabled

### Performance Features

- Static generation where possible
- Image optimization with WebP/AVIF
- Bundle splitting and tree shaking
- Compression enabled
- ETags disabled for better caching

### Security Features

- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy configured
- Permissions-Policy set
- CSP headers (configurable)

## Monitoring and Analytics

### Built-in Monitoring

- Error reporting (configurable)
- Performance metrics
- Bundle size analysis

### Recommended External Services

- Google Analytics
- Google Tag Manager
- Sentry for error tracking
- Vercel Analytics (if using Vercel)

## Environment Variables

### Required

- `NODE_ENV=production`
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_AUTH_CLIENT_ID`

### Optional

- `NEXT_PUBLIC_GA_TRACKING_ID`
- `NEXT_PUBLIC_GTM_ID`
- `NEXT_PUBLIC_ENABLE_ANALYTICS`
- `NEXT_PUBLIC_ENABLE_ERROR_REPORTING`

## Troubleshooting

### Build Issues

1. Check TypeScript errors: `npm run type-check`
2. Check ESLint issues: `npm run lint`
3. Clear cache: `npm run clean`
4. Reinstall dependencies: `rm -rf node_modules && npm install`

### Runtime Issues

1. Check environment variables
2. Verify API endpoints are accessible
3. Check browser console for errors
4. Review server logs

### Performance Issues

1. Run bundle analysis: `npm run build:analyze`
2. Check image optimization settings
3. Review caching headers
4. Monitor Core Web Vitals

## Maintenance

### Regular Tasks

- Update dependencies monthly
- Monitor error rates
- Review performance metrics
- Update security headers as needed

### Backup Strategy

- Database backups (if applicable)
- Environment variable backups
- Code repository backups
- Static asset backups

## Support

For production issues:

1. Check the logs
2. Review this documentation
3. Contact the development team
4. Check the GitHub issues

## Security Considerations

- Keep dependencies updated
- Use HTTPS in production
- Implement proper authentication
- Regular security audits
- Monitor for vulnerabilities
