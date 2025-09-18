# cPanel Deployment Guide for LunaLuna AI

This guide will help you deploy your Next.js application on cPanel hosting that supports Node.js.

## Prerequisites

- cPanel hosting with Node.js support
- Access to Terminal/SSH (if available)
- File Manager access in cPanel

## Step 1: Prepare Your Application

### 1.1 Build the Application

```bash
# Install dependencies
npm install

# Build the application for production
npm run build:production
```

### 1.2 Create Production Environment File

Create a `.env.production` file with your production settings:

```env
NODE_ENV=production
HOSTNAME=yourdomain.com
PORT=3000
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

## Step 2: Upload Files to cPanel

### 2.1 Upload via File Manager

1. Login to your cPanel
2. Open File Manager
3. Navigate to your domain's public_html folder
4. Upload all files except:
   - `node_modules/`
   - `.git/`
   - `.next/` (we'll build this on the server)

### 2.2 Upload via FTP/SFTP (Alternative)

```bash
# Using rsync (if SSH is available)
rsync -avz --exclude node_modules --exclude .git . user@yourdomain.com:public_html/
```

## Step 3: Install Dependencies on Server

### 3.1 Via cPanel Terminal (if available)

```bash
cd public_html
npm install --production
```

### 3.2 Via SSH (if available)

```bash
ssh user@yourdomain.com
cd public_html
npm install --production
```

## Step 4: Configure cPanel Node.js App

### 4.1 Create Node.js App

1. In cPanel, go to "Node.js Selector"
2. Click "Create Application"
3. Set the following:
   - **Node.js version**: Latest LTS (18.x or 20.x)
   - **Application mode**: Production
   - **Application root**: `/public_html`
   - **Application URL**: `/` (or your subdomain)
   - **Application startup file**: `server.js`

### 4.2 Set Environment Variables

In the Node.js app settings, add these environment variables:

```
NODE_ENV=production
HOSTNAME=yourdomain.com
PORT=3000
```

## Step 5: Build and Start the Application

### 5.1 Build on Server

```bash
# In cPanel Terminal or SSH
cd public_html
npm run build:production
```

### 5.2 Start the Application

```bash
# Start the server
npm run server:production
```

## Step 6: Configure Domain and SSL

### 6.1 Domain Configuration

1. Point your domain to the cPanel hosting
2. Set up subdomain if needed (e.g., `app.yourdomain.com`)

### 6.2 SSL Certificate

1. In cPanel, go to "SSL/TLS"
2. Install SSL certificate (Let's Encrypt is free)
3. Force HTTPS redirect

## Step 7: Set Up Process Management (Optional)

### 7.1 Using PM2 (if available)

```bash
# Install PM2 globally
npm install -g pm2

# Start your app with PM2
pm2 start server.js --name "lunaluna-ai"

# Save PM2 configuration
pm2 save
pm2 startup
```

### 7.2 Using Forever (Alternative)

```bash
# Install forever globally
npm install -g forever

# Start your app with forever
forever start server.js
```

## Step 8: Configure .htaccess for Better Performance

The `.htaccess` file has been created in the `public/` folder with:

- URL rewriting for SPA routing
- Security headers
- Static asset caching
- Gzip compression

## Step 9: Database Configuration (if needed)

### 9.1 MySQL Database

1. Create MySQL database in cPanel
2. Create database user
3. Update your `.env.production` with database credentials

### 9.2 Environment Variables

Add these to your Node.js app environment variables:

```
DB_HOST=localhost
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASS=your_database_password
```

## Step 10: Monitoring and Maintenance

### 10.1 Log Files

- Check application logs in cPanel
- Monitor error logs for issues
- Set up log rotation if needed

### 10.2 Performance Monitoring

- Monitor CPU and memory usage
- Check disk space regularly
- Optimize images and assets

## Troubleshooting

### Common Issues

1. **Application won't start**

   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check environment variables

2. **404 errors on refresh**

   - Ensure `.htaccess` is properly configured
   - Check URL rewriting rules

3. **Static assets not loading**

   - Verify file permissions
   - Check `.htaccess` caching rules

4. **Database connection issues**
   - Verify database credentials
   - Check database server status

### Debug Commands

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check if port is in use
netstat -tulpn | grep :3000

# Check application logs
tail -f /path/to/your/logs/app.log
```

## Security Considerations

1. **Environment Variables**

   - Never commit `.env` files to version control
   - Use strong passwords and API keys

2. **File Permissions**

   - Set appropriate file permissions (644 for files, 755 for directories)
   - Restrict access to sensitive files

3. **HTTPS**

   - Always use HTTPS in production
   - Set up proper SSL certificates

4. **Regular Updates**
   - Keep dependencies updated
   - Monitor security advisories

## Performance Optimization

1. **Enable Gzip Compression**

   - Already configured in `.htaccess`

2. **Static Asset Caching**

   - Already configured in `.htaccess`

3. **Image Optimization**

   - Use WebP format when possible
   - Compress images before upload

4. **CDN Integration**
   - Consider using a CDN for static assets
   - Configure proper cache headers

## Backup Strategy

1. **Regular Backups**

   - Set up automated backups in cPanel
   - Backup database regularly

2. **Version Control**
   - Keep your code in Git
   - Tag releases for easy rollback

## Support

If you encounter issues:

1. Check cPanel error logs
2. Verify all configuration steps
3. Test locally first
4. Contact your hosting provider if needed

---

**Note**: This guide assumes you have a cPanel hosting account with Node.js support. Some steps may vary depending on your hosting provider's specific configuration.
