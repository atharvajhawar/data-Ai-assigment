# 🚀 Deployment Guide

This guide will help you deploy your Data Alchemist application to various platforms.

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ All dependencies installed (`npm install`)
- ✅ Application builds successfully (`npm run build`)
- ✅ No TypeScript errors (`npm run lint`)
- ✅ Sample data file in the correct location

## 🌐 Deployment Options

### 1. Vercel (Recommended)

**Why Vercel?**
- Built by Next.js creators
- Zero configuration
- Automatic deployments
- Free tier available

**Steps:**
1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? `Y`
   - Which scope? `Select your account`
   - Link to existing project? `N`
   - Project name? `data-alchemist`
   - Directory? `./` (current directory)
   - Override settings? `N`

5. **Your app will be live at:** `https://your-project.vercel.app`

### 2. Netlify

**Steps:**
1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop your `out` folder
   - Or connect your GitHub repository

3. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `out`

### 3. Railway

**Steps:**
1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login and deploy**
   ```bash
   railway login
   railway init
   railway up
   ```

### 4. Heroku

**Steps:**
1. **Install Heroku CLI**
   ```bash
   # Download from heroku.com
   ```

2. **Create Heroku app**
   ```bash
   heroku create your-data-alchemist
   ```

3. **Set buildpacks**
   ```bash
   heroku buildpacks:set heroku/nodejs
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

## 🔧 Environment Configuration

### Required Environment Variables

Create a `.env.local` file for local development:

```env
# Optional: Add any API keys or configuration
NEXT_PUBLIC_APP_NAME=Data Alchemist
NEXT_PUBLIC_VERSION=1.0.0
```

### Production Environment

For production deployments, set these in your platform's dashboard:

- `NODE_ENV=production`
- `NEXT_PUBLIC_APP_NAME=Data Alchemist`

## 📁 File Structure for Deployment

Ensure your project structure looks like this:

```
data-alchemist-app/
├── components/
├── utils/
├── src/
├── public/
│   └── sample.json    # ⚠️ Important: Sample data file
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

## 🚨 Common Deployment Issues

### Issue 1: Sample data not found
**Error:** `Failed to load sample data`

**Solution:**
- Ensure `sample.json` is in the `public/` folder
- Check file permissions
- Verify the file path in the code

### Issue 2: Build errors
**Error:** TypeScript compilation fails

**Solution:**
```bash
npm run lint
npm run build
```
Fix any TypeScript errors before deploying.

### Issue 3: Missing dependencies
**Error:** Module not found

**Solution:**
```bash
npm install
npm run build
```

### Issue 4: Port conflicts
**Error:** Port already in use

**Solution:**
```bash
# For local testing
npm run dev -- -p 3001

# For production
PORT=3001 npm start
```

## 🔒 Security Considerations

### For Production Deployments:

1. **Environment Variables**
   - Never commit sensitive data to Git
   - Use platform-specific secret management

2. **File Upload Security**
   - Validate file types on server
   - Limit file sizes
   - Sanitize uploaded content

3. **CORS Configuration**
   - Configure allowed origins
   - Restrict API access

## 📊 Performance Optimization

### Build Optimization:
```bash
# Analyze bundle size
npm run build
# Check the build output for optimization suggestions
```

### Runtime Optimization:
- Enable gzip compression
- Use CDN for static assets
- Implement caching strategies

## 🔄 Continuous Deployment

### GitHub Actions (Vercel/Netlify)
1. Connect your GitHub repository
2. Enable automatic deployments
3. Deploy on every push to main branch

### Manual Deployment
```bash
# Build and deploy
npm run build
npm run deploy
```

## 📈 Monitoring

### Recommended Tools:
- **Vercel Analytics**: Built-in performance monitoring
- **Sentry**: Error tracking
- **Google Analytics**: User behavior

### Health Checks:
- Monitor application uptime
- Track error rates
- Monitor performance metrics

## 🆘 Troubleshooting

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev
```

### Check Logs
```bash
# Vercel
vercel logs

# Railway
railway logs

# Heroku
heroku logs --tail
```

### Common Commands
```bash
# Check build status
npm run build

# Test locally
npm run dev

# Check for issues
npm run lint

# Type check
npx tsc --noEmit
```

## 📞 Support

If you encounter deployment issues:

1. **Check the logs** for specific error messages
2. **Verify prerequisites** are met
3. **Test locally** before deploying
4. **Check platform documentation**
5. **Create an issue** in the repository

---

**Happy Deploying! 🚀**

Your Data Alchemist application is ready to transform data chaos into organized insights for users worldwide! 