# MongoDB Atlas Quick Setup

## THE ISSUE
Your error "Unexpected token '<', "<!DOCTYPE "... is not valid JSON" happens because:
- MONGODB_URI is empty in .env.local
- The app crashes when trying to connect to MongoDB
- Next.js returns an HTML error page instead of JSON
- The frontend tries to parse HTML as JSON = error

## SOLUTION: Add MongoDB URI

### Option 1: MongoDB Atlas (FREE Cloud Database)

1. **Go to MongoDB Atlas**
   https://www.mongodb.com/cloud/atlas/register

2. **Create Free Account**
   - Sign up with Google/email
   - No credit card required

3. **Create Free Cluster**
   - Click "Build a Database"
   - Choose "M0 FREE" option
   - Select cloud provider (AWS recommended)
   - Choose region closest to you
   - Click "Create"

4. **Create Database User**
   - Click "Database Access" in left sidebar
   - Click "+ ADD NEW DATABASE USER"
   - Authentication: Password
   - Username: `aiwebgen` (or your choice)
   - Password: Click "Autogenerate Secure Password" (COPY IT!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

5. **Whitelist Your IP**
   - Click "Network Access" in left sidebar
   - Click "+ ADD IP ADDRESS"
   - Click "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0)
   - Click "Confirm"

6. **Get Connection String**
   - Click "Database" in left sidebar
   - Click "Connect" on your cluster
   - Click "Connect your application"
   - Copy the connection string (looks like):
   ```
   mongodb+srv://aiwebgen:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

7. **Update .env.local**
   Replace `<password>` with your actual password and add database name:
   ```
   MONGODB_URI=mongodb+srv://aiwebgen:YourPassword123@cluster0.xxxxx.mongodb.net/ai-website-gen?retryWrites=true&w=majority
   ```

### Option 2: Local MongoDB

**If you have MongoDB installed:**

```bash
# .env.local
MONGODB_URI=mongodb://localhost:27017/ai-website-gen
```

**Don't have MongoDB?** Install it:
- Windows: https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas above (easier)

## After Adding URI

1. **Save .env.local**

2. **Restart dev server**
   ```powershell
   # Stop current server (Ctrl+C)
   npm run dev
   ```

3. **Test diagnostics**
   Open: http://localhost:3000/api/diagnostics
   
   Should show:
   ```json
   {
     "checks": {
       "mongodbConnection": {
         "status": "connected"
       }
     }
   }
   ```

4. **Try creating account again**
   - You'll now see proper error messages
   - Or successful account creation!

## Still Getting Errors?

Check browser console (F12) - you'll now see:
- Specific error messages
- MongoDB connection status
- What went wrong

The improved error handling will tell you exactly what's wrong!
