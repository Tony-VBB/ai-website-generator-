import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {} as Record<string, any>,
  };

  // Check MongoDB URI
  diagnostics.checks.mongodbUri = {
    configured: !!process.env.MONGODB_URI,
    format: process.env.MONGODB_URI ? 
      (process.env.MONGODB_URI.startsWith('mongodb') ? 'valid' : 'invalid') : 
      'not set',
  };

  // Check NextAuth
  diagnostics.checks.nextAuth = {
    secretConfigured: !!process.env.NEXTAUTH_SECRET,
    urlConfigured: !!process.env.NEXTAUTH_URL,
    url: process.env.NEXTAUTH_URL,
  };

  // Check AI API Keys
  diagnostics.checks.aiProviders = {
    groq: !!process.env.GROQ_API_KEY,
    openrouter: !!process.env.OPENROUTER_API_KEY,
    huggingface: !!process.env.HUGGINGFACE_API_KEY,
  };

  // Test MongoDB connection
  try {
    const connectDB = (await import('@/lib/mongodb')).default;
    await connectDB();
    diagnostics.checks.mongodbConnection = {
      status: 'connected',
      message: 'Successfully connected to MongoDB',
    };
  } catch (error: any) {
    diagnostics.checks.mongodbConnection = {
      status: 'failed',
      error: error.message,
    };
  }

  return NextResponse.json(diagnostics, { status: 200 });
}
