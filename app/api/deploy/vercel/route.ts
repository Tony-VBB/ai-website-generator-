import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { html, projectName, token } = await req.json();

    if (!html) {
      return NextResponse.json({ error: 'HTML content is required' }, { status: 400 });
    }

    const VERCEL_TOKEN = token || process.env.VERCEL_ACCESS_TOKEN;
    
    if (!VERCEL_TOKEN) {
      return NextResponse.json({ 
        error: 'Vercel token is required. Please provide your Vercel Access Token.' 
      }, { status: 400 });
    }

    const projectSlug = (projectName || 'ai-generated-site')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .substring(0, 50) + '-' + Date.now();

    // Deploy to Vercel using their API
    const deployment = {
      name: projectSlug,
      files: [
        {
          file: 'index.html',
          data: html,
        },
      ],
      projectSettings: {
        framework: null,
      },
    };

    const response = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deployment),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Vercel deployment error:', error);
      return NextResponse.json({ error: 'Failed to deploy to Vercel' }, { status: 500 });
    }

    const result = await response.json();
    
    return NextResponse.json({
      url: `https://${result.url}`,
      deploymentId: result.id,
      projectName: projectSlug,
    });

  } catch (error: any) {
    console.error('Vercel deployment error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to deploy to Vercel' },
      { status: 500 }
    );
  }
}
