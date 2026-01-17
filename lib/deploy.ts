// Deployment utilities for generated websites

export interface DeploymentResult {
  success: boolean;
  url?: string;
  error?: string;
  platform: string;
}

/**
 * Deploy to Vercel Blob Storage
 */
export async function deployToVercel(html: string, projectName: string, token?: string): Promise<DeploymentResult> {
  try {
    const response = await fetch('/api/deploy/vercel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html, projectName, token }),
    });

    const data = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        url: data.url,
        platform: 'Vercel',
      };
    } else {
      return {
        success: false,
        error: data.error || 'Deployment failed',
        platform: 'Vercel',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      platform: 'Vercel',
    };
  }
}

/**
 * Deploy to Netlify
 */
export async function deployToNetlify(html: string, projectName: string, token?: string): Promise<DeploymentResult> {
  try {
    const response = await fetch('/api/deploy/netlify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html, projectName, token }),
    });

    const data = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        url: data.url,
        platform: 'Netlify',
      };
    } else {
      return {
        success: false,
        error: data.error || 'Deployment failed',
        platform: 'Netlify',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      platform: 'Netlify',
    };
  }
}

/**
 * Deploy to GitHub Pages (creates a public gist)
 */
export async function deployToGitHub(html: string, projectName: string, token?: string): Promise<DeploymentResult> {
  try {
    const response = await fetch('/api/deploy/github', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html, projectName, token }),
    });

    const data = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        url: data.url,
        platform: 'GitHub',
      };
    } else {
      return {
        success: false,
        error: data.error || 'Deployment failed',
        platform: 'GitHub',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      platform: 'GitHub',
    };
  }
}
