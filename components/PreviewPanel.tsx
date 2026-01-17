"use client";

import { useState, useEffect } from "react";
import { downloadAsZip, copyToClipboard } from "@/lib/utils";
import { deployToVercel, deployToNetlify, deployToGitHub } from "@/lib/deploy";

interface PreviewPanelProps {
  html: string;
  isGenerating: boolean;
  onSaveProject?: (title: string) => void;
}

export function PreviewPanel({ html, isGenerating, onSaveProject }: PreviewPanelProps) {
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showDeployDialog, setShowDeployDialog] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const [deploymentError, setDeploymentError] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<'github' | 'netlify' | 'vercel' | null>(null);
  const [apiToken, setApiToken] = useState("");

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    copyToClipboard(html);
    setCopied(true);
  };

  const handleDownload = () => {
    downloadAsZip(html);
  };

  const handleSave = () => {
    if (projectTitle.trim() && onSaveProject) {
      onSaveProject(projectTitle.trim());
      setShowSaveDialog(false);
      setProjectTitle("");
    }
  };

  const handleDeploy = async (platform: 'vercel' | 'netlify' | 'github') => {
    if (!apiToken.trim()) {
      setDeploymentError('Please enter your API token');
      return;
    }

    setIsDeploying(true);
    setDeploymentError(null);
    setDeploymentUrl(null);

    const projectName = projectTitle.trim() || 'ai-generated-website';

    try {
      let result;
      if (platform === 'vercel') {
        result = await deployToVercel(html, projectName, apiToken);
      } else if (platform === 'netlify') {
        result = await deployToNetlify(html, projectName, apiToken);
      } else {
        result = await deployToGitHub(html, projectName, apiToken);
      }

      if (result.success && result.url) {
        setDeploymentUrl(result.url);
      } else {
        setDeploymentError(result.error || 'Deployment failed');
      }
    } catch (error) {
      setDeploymentError(error instanceof Error ? error.message : 'Deployment failed');
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Preview</h2>
          <p className="text-sm text-gray-600 mt-1">
            Your generated website appears here
          </p>
        </div>
        
        {html && (
          <div className="flex items-center space-x-2">
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("preview")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  viewMode === "preview"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => setViewMode("code")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  viewMode === "code"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Code
              </button>
            </div>
            
            {onSaveProject && (
              <button
                onClick={() => setShowSaveDialog(true)}
                className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                Save Project
              </button>
            )}
            
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              {copied ? "Copied!" : "Copy Code"}
            </button>
            
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Download ZIP
            </button>
            
            <button
              onClick={() => setShowDeployDialog(true)}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Deploy Live
            </button>
          </div>
        )}
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Save Project</h3>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Enter project title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setProjectTitle("");
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!projectTitle.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deploy Dialog */}
      {showDeployDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Deploy Your Website</h3>
            
            {!deploymentUrl && !deploymentError && !selectedPlatform && (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Choose a platform to deploy your generated website. The website will be live and publicly accessible.
                </p>
                
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="Project name (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                />

                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => setSelectedPlatform('github')}
                    className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <div className="text-left">
                        <div className="font-medium">GitHub Gist</div>
                        <div className="text-xs text-gray-300">Free • Instant deployment</div>
                      </div>
                    </div>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button
                    onClick={() => setSelectedPlatform('netlify')}
                    className="w-full px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
                      </svg>
                      <div className="text-left">
                        <div className="font-medium">Netlify</div>
                        <div className="text-xs text-teal-200">Free • Fast CDN</div>
                      </div>
                    </div>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button
                    onClick={() => setSelectedPlatform('vercel')}
                    className="w-full px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0L24 24H0L12 0z"/>
                      </svg>
                      <div className="text-left">
                        <div className="font-medium">Vercel</div>
                        <div className="text-xs text-gray-400">Free • Edge network</div>
                      </div>
                    </div>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </>
            )}

            {selectedPlatform && !deploymentUrl && !deploymentError && (
              <>
                <button
                  onClick={() => {
                    setSelectedPlatform(null);
                    setApiToken('');
                    setDeploymentError(null);
                  }}
                  className="mb-4 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to platform selection
                </button>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {selectedPlatform === 'github' && 'GitHub Personal Access Token Required'}
                    {selectedPlatform === 'netlify' && 'Netlify Access Token Required'}
                    {selectedPlatform === 'vercel' && 'Vercel Access Token Required'}
                  </h4>
                  <p className="text-sm text-blue-700 mb-2">
                    {selectedPlatform === 'github' && 'Create a token with "gist" and "repo" scopes at:'}
                    {selectedPlatform === 'netlify' && 'Get your access token from:'}
                    {selectedPlatform === 'vercel' && 'Create an access token at:'}
                  </p>
                  <a
                    href={
                      selectedPlatform === 'github' ? 'https://github.com/settings/tokens' :
                      selectedPlatform === 'netlify' ? 'https://app.netlify.com/user/applications#personal-access-tokens' :
                      'https://vercel.com/account/tokens'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {selectedPlatform === 'github' && 'github.com/settings/tokens'}
                    {selectedPlatform === 'netlify' && 'app.netlify.com/user/applications'}
                    {selectedPlatform === 'vercel' && 'vercel.com/account/tokens'}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Token / Access Token
                  </label>
                  <input
                    type="password"
                    value={apiToken}
                    onChange={(e) => setApiToken(e.target.value)}
                    placeholder={`Enter your ${selectedPlatform} token`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Your token is only used for this deployment and is not stored.
                  </p>
                </div>

                <button
                  onClick={() => handleDeploy(selectedPlatform)}
                  disabled={isDeploying || !apiToken.trim()}
                  className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                >
                  {isDeploying ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Deploying...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Deploy to {selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}
                    </>
                  )}
                </button>
              </>
            )}

            {deploymentUrl && (
              <div className="mb-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <h4 className="font-medium text-green-900 mb-1">Deployment Successful!</h4>
                      <p className="text-sm text-green-700 mb-3">Your website is now live at:</p>
                      <div className="bg-white border border-green-300 rounded px-3 py-2 flex items-center justify-between">
                        <a 
                          href={deploymentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline truncate"
                        >
                          {deploymentUrl}
                        </a>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(deploymentUrl);
                          }}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {deploymentError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-red-900 mb-1">Deployment Failed</h4>
                    <p className="text-sm text-red-700">{deploymentError}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowDeployDialog(false);
                  setDeploymentUrl(null);
                  setDeploymentError(null);
                  setProjectTitle("");
                  setSelectedPlatform(null);
                  setApiToken("");
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              {deploymentUrl && (
                <a
                  href={deploymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Visit Website
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {isGenerating ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600">Generating your website...</p>
            </div>
          </div>
        ) : html ? (
          viewMode === "preview" ? (
            <div className="w-full h-full min-h-screen">
              <iframe
                srcDoc={html}
                className="w-full h-full min-h-screen border-0"
                title="Website Preview"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-top-navigation-by-user-activation allow-downloads"
              />
            </div>
          ) : (
            <div className="h-full overflow-auto">
              <pre className="p-6 text-sm">
                <code className="text-gray-800">{html}</code>
              </pre>
            </div>
          )
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg">No website generated yet</p>
              <p className="text-sm mt-2">Enter a prompt and click Generate</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
