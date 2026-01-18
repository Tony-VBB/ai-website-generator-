import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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

    const NETLIFY_TOKEN = token || process.env.NETLIFY_ACCESS_TOKEN;
    
    if (!NETLIFY_TOKEN) {
      return NextResponse.json({ 
        error: 'Netlify token is required. Please provide your Netlify Access Token.' 
      }, { status: 400 });
    }

    const siteName = (projectName || 'ai-generated-site')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .substring(0, 50) + '-' + Date.now();

    // Create a zip file with the HTML
    const FormData = require('form-data');
    const JSZip = require('jszip');
    const zip = new JSZip();
    zip.file('index.html', html);
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    // Deploy to Netlify
    const response = await fetch('https://api.netlify.com/api/v1/sites', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NETLIFY_TOKEN}`,
        'Content-Type': 'application/zip',
      },
      body: zipBuffer,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Netlify deployment error:', error);
      return NextResponse.json({ error: 'Failed to deploy to Netlify' }, { status: 500 });
    }

    const site = await response.json();
    
    return NextResponse.json({
      url: site.ssl_url || site.url,
      siteId: site.id,
      siteName: site.name,
    });

  } catch (error: any) {
    console.error('Netlify deployment error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to deploy to Netlify' },
      { status: 500 }
    );
  }
}
