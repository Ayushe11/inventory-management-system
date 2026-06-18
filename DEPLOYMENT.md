# Deployment Guide

This guide covers deploying the Inventory & Order Management System to production using Railway and Netlify.

## Backend Deployment on Railway

Railway makes it easy to deploy full-stack applications with automatic CI/CD.

### Prerequisites
- Railway account (sign up at railway.app)
- GitHub account with the repository

### Steps

1. **Push code to GitHub**
```bash
git remote add origin https://github.com/yourusername/inventory-management.git
git push -u origin master
```

2. **Create Railway Project**
   - Go to railway.app
   - Click "New Project"
   - Select "GitHub Repo"
   - Authorize and select your repository

3. **Add PostgreSQL Database**
   - In Railway dashboard, click "Add Service"
   - Select "PostgreSQL"
   - Railway will automatically detect and configure the database

4. **Configure Environment Variables**
   - In Railway project settings, set:
   ```
   FLASK_ENV=production
   SECRET_KEY=your-super-secret-key-here
   ```
   - Railway will automatically add `DATABASE_URL` for PostgreSQL

5. **Deploy**
   - Railway automatically deploys on every push to master
   - View your backend URL in the Railway dashboard
   - It will be something like: `https://your-app.railway.app`

6. **Verify Deployment**
```bash
curl https://your-app.railway.app/api/products
# Should return: {"success": true, "data": [], "count": 0}
```

## Frontend Deployment on Netlify

### Prerequisites
- Netlify account (sign up at netlify.com)
- Frontend code with `npm run build` script

### Steps

1. **Prepare Frontend for Production**
   - Ensure `REACT_APP_API_URL` is set to your Railway backend URL
   - Test build locally:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy via Git**
   - Connect your GitHub repository to Netlify
   - In Netlify dashboard, click "New site from Git"
   - Select GitHub and your repository

3. **Configure Build Settings**
   - Build command: `npm run build` (if in root) or `cd frontend && npm run build`
   - Publish directory: `build` or `frontend/build`

4. **Set Environment Variables**
   - In Netlify dashboard: Build & Deploy → Environment
   - Add:
   ```
   REACT_APP_API_URL=https://your-app.railway.app/api
   ```

5. **Deploy**
   - Netlify automatically deploys on push to master
   - Your frontend will be available at: `https://your-site.netlify.app`

## Post-Deployment Setup

### 1. Test API Endpoints
```bash
# Test products endpoint
curl https://your-app.railway.app/api/products

# Create a test product
curl -X POST https://your-app.railway.app/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "sku": "TEST001",
    "price": 99.99,
    "quantity": 10
  }'
```

### 2. Test Database Connection
```bash
# Check if tables were created
curl https://your-app.railway.app/api/products
# Should return empty array: {"success": true, "data": [], "count": 0}
```

### 3. Test Frontend Connection
- Navigate to your Netlify URL
- Open browser DevTools
- Check network requests go to your Railway backend
- Test creating a product

## Environment Variables Summary

### Backend (Railway)
```
FLASK_ENV=production
SECRET_KEY=your-secret-key
DATABASE_URL=automatically set by Railway
CORS_ORIGINS=https://your-site.netlify.app
```

### Frontend (Netlify)
```
REACT_APP_API_URL=https://your-app.railway.app/api
```

## Monitoring & Troubleshooting

### View Backend Logs
```bash
# Via Railway CLI
railway logs

# Via Railway Dashboard
# Click your project → View Deployments
```

### View Frontend Logs
```bash
# Netlify Dashboard
# Deploy → Preview/Production → Check logs
```

### Common Issues

1. **CORS Error from Frontend to Backend**
   - Backend needs to allow Netlify origin
   - Update `CORS_ORIGINS` in production.py if using CORS_ORIGINS env var
   - Or update Flask CORS configuration

2. **Database Connection Failed**
   - Verify `DATABASE_URL` is set on Railway
   - Check that PostgreSQL service is running
   - Check logs for connection details

3. **API Returns 404**
   - Verify backend is deployed and running
   - Check that `REACT_APP_API_URL` is correct
   - Ensure paths start with `/api`

4. **Blank Frontend Page**
   - Check build logs on Netlify
   - Verify Node.js version compatibility
   - Clear browser cache (Ctrl+Shift+Delete)

## Rollback

### Railway
```bash
# View previous deployments
railway deployments

# Rollback to previous deployment
railway rollback <deployment-id>
```

### Netlify
- Go to Deploys section
- Click previous successful deploy
- Click "Publish deploy"

## Cost Optimization

1. **Railway**
   - Free tier: $5 credit/month
   - Database included
   - Scale as you grow

2. **Netlify**
   - Free tier: 300 min/month bandwidth
   - Unlimited deployments
   - No credit card required

## Next Steps

- Monitor application performance
- Set up error tracking (Sentry)
- Implement database backups
- Add monitoring and alerting
- Consider scaling strategies
- Implement CI/CD pipeline improvements
