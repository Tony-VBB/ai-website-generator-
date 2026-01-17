#!/bin/bash

echo "=================================="
echo "AI Website Generator - Setup"
echo "=================================="
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists!"
    read -p "Do you want to overwrite it? (y/N): " overwrite
    if [ "$overwrite" != "y" ] && [ "$overwrite" != "Y" ]; then
        echo "Setup cancelled."
        exit 1
    fi
fi

echo "Let's set up your environment variables..."
echo ""

# Generate NEXTAUTH_SECRET
echo "Generating NEXTAUTH_SECRET..."
secret=$(openssl rand -base64 32)
echo "✓ Generated"
echo ""

# MongoDB URI
echo "MongoDB Setup:"
echo "1. Free MongoDB Atlas: https://www.mongodb.com/cloud/atlas"
echo "2. Create a cluster and get connection string"
echo "3. Format: mongodb+srv://username:password@cluster.mongodb.net/dbname"
echo ""
read -p "Enter your MongoDB URI: " mongoUri
echo ""

# AI API Keys
echo "AI Provider Setup:"
echo "You need at least ONE of these API keys:"
echo ""

echo "Groq API Key (Recommended - Free & Fast):"
echo "Get it at: https://console.groq.com"
read -p "Enter Groq API Key (or press Enter to skip): " groqKey
echo ""

echo "OpenRouter API Key (Multiple Models):"
echo "Get it at: https://openrouter.ai/keys"
read -p "Enter OpenRouter API Key (or press Enter to skip): " openrouterKey
echo ""

echo "Hugging Face API Key (Open Source Models):"
echo "Get it at: https://huggingface.co/settings/tokens"
read -p "Enter Hugging Face API Key (or press Enter to skip): " hfKey
echo ""

# Check if at least one API key provided
if [ -z "$groqKey" ] && [ -z "$openrouterKey" ] && [ -z "$hfKey" ]; then
    echo "❌ Error: You must provide at least one AI API key!"
    exit 1
fi

# Create .env.local file
cat > .env.local << EOL
# MongoDB Connection
MONGODB_URI=$mongoUri

# NextAuth Configuration
NEXTAUTH_SECRET=$secret
NEXTAUTH_URL=http://localhost:3000

# AI API Keys
GROQ_API_KEY=$groqKey
OPENROUTER_API_KEY=$openrouterKey
HUGGINGFACE_API_KEY=$hfKey
EOL

echo ""
echo "=================================="
echo "✅ Setup Complete!"
echo "=================================="
echo ""
echo "Created .env.local with your configuration"
echo ""
echo "Next steps:"
echo "1. Run: npm install (if you haven't already)"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:3000"
echo "4. Create an account and start generating websites!"
echo ""
echo "Need help? Check DATABASE_SETUP.md for detailed instructions"
echo ""
