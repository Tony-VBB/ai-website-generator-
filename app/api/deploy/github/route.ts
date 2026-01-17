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

    const GITHUB_TOKEN = token || process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
    
    if (!GITHUB_TOKEN) {
      return NextResponse.json({ 
        error: 'GitHub token is required. Please provide your GitHub Personal Access Token.' 
      }, { status: 400 });
    }

    const fileName = (projectName || 'ai-generated-website')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .substring(0, 50) + '.html';

    const description = `AI-generated website: ${projectName || 'Untitled'}`;

    // Create a public gist
    const response = await fetch('https://api.github.com/gists', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        description,
        public: true,
        files: {
          [fileName]: {
            content: html,
          },
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('GitHub gist creation error:', error);
      return NextResponse.json({ error: 'Failed to create GitHub gist' }, { status: 500 });
    }

    const gist = await response.json();
    
    // Use RawGit or similar service to serve the HTML
    const rawUrl = gist.files[fileName].raw_url;
    const gistId = gist.id;
    
    // GitHub Pages URL via gist
    const viewUrl = `https://gist.githack.com/${session.user.email?.split('@')[0] || 'anonymous'}/${gistId}/raw/${fileName}`;
    
    return NextResponse.json({
      url: viewUrl,
      gistUrl: gist.html_url,
      rawUrl: rawUrl,
      gistId: gistId,
    });

  } catch (error: any) {
    console.error('GitHub deployment error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to deploy to GitHub' },
      { status: 500 }
    );
  }
}
