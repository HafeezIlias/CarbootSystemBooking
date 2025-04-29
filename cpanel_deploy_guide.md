# cPanel Deployment Guide for Carboot Booking System

## Prerequisites
- cPanel hosting account (already set up at http://carbootsoc.feeyazproduction.com/)
- FTP access or cPanel File Manager access
- Access to cPanel MySQL database management

## Step 1: Prepare the Database
1. Login to your cPanel account
2. Navigate to "MySQL Databases"
3. The database is already created: `feeyamnw_carboot_soc_db`
4. Create a database user if not already created (Example: `feeyamnw_carboot_user`)
5. Assign the user to the database with all privileges

## Step 2: Upload Files
1. Zip the contents of the `public` folder created by the deploy script
2. Upload the zip to your server using File Manager or FTP
3. Extract the zip in your desired directory (likely `public_html/carbootsoc`)
4. Make sure all files including the hidden ones (.htaccess, .env) were uploaded

## Step 3: Update Configuration
1. Edit the `.env` file in your hosting directory:
   ```
   # Server Configuration
   PORT=3000
   NODE_ENV=production

   # Database Configuration
   DB_NAME=feeyamnw_carboot_soc_db
   DB_USER=feeyamnw_carboot_user
   DB_PASS=your_secure_password
   DB_HOST=localhost

   # JWT Secret (generate a secure random string)
   JWT_SECRET=your_secure_jwt_secret
   ```

## Step 4: Setup Node.js App
1. In cPanel, go to "Setup Node.js App"
2. Create a new application:
   - Node.js version: Choose the latest available version
   - Application mode: Production
   - Application root: Path to your app directory (e.g., `/home/username/public_html/carbootsoc`)
   - Application URL: http://carbootsoc.feeyazproduction.com/
   - Application startup file: server.js

## Step 5: Install Dependencies
1. SSH into your server (if available) and run:
   ```
   cd ~/public_html/carbootsoc
   npm install
   ```

2. If SSH access is not available, you might need to use cPanel's "Terminal" feature or contact your hosting provider.

## Step 6: Setup PM2 (if available)
1. If your hosting supports PM2 process manager:
   ```
   pm2 start server.js --name carboot-booking
   pm2 save
   ```

## Step 7: Configure Domain
1. Your domain http://carbootsoc.feeyazproduction.com/ is already pointing to the server
2. Make sure DNS settings are correctly configured

## Troubleshooting
1. Check Node.js app logs in cPanel
2. Review error logs in cPanel
3. Make sure database credentials are correct
4. Verify that all required directories were uploaded
5. Check if ports are correctly configured and open

## Additional Notes
- Always keep a local backup of your project
- Consider setting up automatic backups for your database
- Monitor application logs for any issues 