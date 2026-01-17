# Database Setup Guide

## Overview
The AI Website Generator now includes user authentication and project persistence using MongoDB and NextAuth.js. This guide will help you set up the database and get started.

## MongoDB Setup (Required)

### Option 1: MongoDB Atlas (Cloud - Recommended)

1. **Create a Free Account**
   - Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "FREE" shared cluster
   - Select a cloud provider and region close to you
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Enter username and password (save these!)
   - Set privileges to "Read and write to any database"
   - Click "Add User"

4. **Whitelist Your IP**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go back to "Database" view
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with your preferred database name (e.g., `ai-website-gen`)

   **Example:**
   ```
   mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/ai-website-gen?retryWrites=true&w=majority
   ```

### Option 2: Local MongoDB

1. **Install MongoDB Community Edition**
   - Download from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Follow installation instructions for your OS

2. **Start MongoDB**
   ```bash
   # On Mac/Linux
   sudo systemctl start mongod
   
   # On Windows
   net start MongoDB
   ```

3. **Connection String**
   ```
   mongodb://localhost:27017/ai-website-gen
   ```

## Environment Variables Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in the required values:**

   ```bash
   # MongoDB Connection (required)
   MONGODB_URI=your_connection_string_here
   
   # NextAuth Secret (required)
   NEXTAUTH_SECRET=your_generated_secret_here
   NEXTAUTH_URL=http://localhost:3000
   
   # AI API Keys (at least one required)
   GROQ_API_KEY=your_groq_api_key_here
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   HUGGINGFACE_API_KEY=your_huggingface_api_key_here
   ```

3. **Generate NextAuth Secret:**
   
   **On Linux/Mac:**
   ```bash
   openssl rand -base64 32
   ```
   
   **On Windows PowerShell:**
   ```powershell
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
   ```

## Database Schema

The application uses three main collections:

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  name: String (required),
  password: String (hashed, required),
  createdAt: Date
}
```

### Projects Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  title: String (required),
  prompt: String (required),
  enhancedPrompt: String,
  analysis: String,
  htmlCode: String (required),
  model: String (required),
  provider: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

## Using the Application

### 1. First Time Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)

3. Click "Sign up" to create an account

4. Enter your name, email, and password

### 2. Generating Websites

1. After logging in, enter a website description

2. Select an AI provider and model

3. Click "Generate Website"

4. View the live preview or code

### 3. Saving Projects

1. After generating a website, click "Save Project"

2. Enter a project title

3. Click "Save"

### 4. Managing Projects

1. Click "My Projects" in the header

2. View all your saved projects

3. Click "Load" to open a project

4. Click "Delete" to remove a project

## API Routes

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Login (handled by NextAuth)
- `GET /api/auth/signout` - Logout (handled by NextAuth)

### Projects
- `GET /api/projects` - List all user's projects
- `POST /api/projects` - Save new project
- `GET /api/projects/[id]` - Get specific project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

## Security Features

- **Password Hashing**: All passwords encrypted with bcryptjs
- **JWT Sessions**: Secure session management with NextAuth.js
- **User Isolation**: Each user can only access their own projects
- **Protected Routes**: API routes require authentication
- **Connection Pooling**: Optimized MongoDB connections for Next.js

## Troubleshooting

### "MongooseError: buffering timed out"
- Check your MongoDB URI is correct
- Ensure IP whitelist includes your current IP
- Verify database user has correct permissions

### "Invalid credentials"
- Double-check email and password
- Passwords are case-sensitive
- Try creating a new account

### "Failed to connect to MongoDB"
- Verify MONGODB_URI in .env.local
- Check MongoDB cluster is running
- Test connection string in MongoDB Compass

### "NextAuth configuration error"
- Ensure NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches your localhost URL
- Restart development server after changing .env.local

## Production Deployment

### Environment Variables on Vercel

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add each variable:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET` (generate a new one for production!)
   - `NEXTAUTH_URL` (your production URL)
   - All AI API keys

### MongoDB Atlas Production

1. Update Network Access to allow Vercel IPs or use 0.0.0.0/0
2. Use a different database for production (e.g., `ai-website-gen-prod`)
3. Consider upgrading from free tier for better performance

## Best Practices

1. **Never commit .env.local** - It contains sensitive credentials
2. **Use different secrets for dev/prod** - Generate unique NEXTAUTH_SECRET
3. **Regular backups** - Export MongoDB data periodically
4. **Monitor usage** - Check MongoDB Atlas metrics
5. **Update dependencies** - Keep packages up to date for security

## Need Help?

- MongoDB Atlas Docs: [https://docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- NextAuth.js Docs: [https://next-auth.js.org](https://next-auth.js.org)
- Mongoose Docs: [https://mongoosejs.com](https://mongoosejs.com)
