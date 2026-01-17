# Quick Start Script
# This script helps you set up the environment variables

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "AI Website Generator - Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (Test-Path ".env.local") {
    Write-Host "⚠️  .env.local already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Setup cancelled." -ForegroundColor Red
        exit
    }
}

Write-Host "Let's set up your environment variables..." -ForegroundColor Green
Write-Host ""

# Generate NEXTAUTH_SECRET
Write-Host "Generating NEXTAUTH_SECRET..." -ForegroundColor Cyan
$secret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
Write-Host "✓ Generated" -ForegroundColor Green
Write-Host ""

# MongoDB URI
Write-Host "MongoDB Setup:" -ForegroundColor Cyan
Write-Host "1. Free MongoDB Atlas: https://www.mongodb.com/cloud/atlas"
Write-Host "2. Create a cluster and get connection string"
Write-Host "3. Format: mongodb+srv://username:password@cluster.mongodb.net/dbname"
Write-Host ""
$mongoUri = Read-Host "Enter your MongoDB URI"
Write-Host ""

# AI API Keys
Write-Host "AI Provider Setup:" -ForegroundColor Cyan
Write-Host "You need at least ONE of these API keys:"
Write-Host ""

Write-Host "Groq API Key (Recommended - Free & Fast):" -ForegroundColor Yellow
Write-Host "Get it at: https://console.groq.com"
$groqKey = Read-Host "Enter Groq API Key (or press Enter to skip)"
Write-Host ""

Write-Host "OpenRouter API Key (Multiple Models):" -ForegroundColor Yellow
Write-Host "Get it at: https://openrouter.ai/keys"
$openrouterKey = Read-Host "Enter OpenRouter API Key (or press Enter to skip)"
Write-Host ""

Write-Host "Hugging Face API Key (Open Source Models):" -ForegroundColor Yellow
Write-Host "Get it at: https://huggingface.co/settings/tokens"
$hfKey = Read-Host "Enter Hugging Face API Key (or press Enter to skip)"
Write-Host ""

# Check if at least one API key provided
if ([string]::IsNullOrWhiteSpace($groqKey) -and 
    [string]::IsNullOrWhiteSpace($openrouterKey) -and 
    [string]::IsNullOrWhiteSpace($hfKey)) {
    Write-Host "❌ Error: You must provide at least one AI API key!" -ForegroundColor Red
    exit
}

# Create .env.local file
$envContent = @"
# MongoDB Connection
MONGODB_URI=$mongoUri

# NextAuth Configuration
NEXTAUTH_SECRET=$secret
NEXTAUTH_URL=http://localhost:3000

# AI API Keys
GROQ_API_KEY=$groqKey
OPENROUTER_API_KEY=$openrouterKey
HUGGINGFACE_API_KEY=$hfKey
"@

Set-Content -Path ".env.local" -Value $envContent

Write-Host ""
Write-Host "==================================" -ForegroundColor Green
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""
Write-Host "Created .env.local with your configuration" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run: npm install (if you haven't already)"
Write-Host "2. Run: npm run dev"
Write-Host "3. Open: http://localhost:3000"
Write-Host "4. Create an account and start generating websites!"
Write-Host ""
Write-Host "Need help? Check DATABASE_SETUP.md for detailed instructions" -ForegroundColor Cyan
Write-Host ""
