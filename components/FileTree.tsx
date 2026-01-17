"use client";

interface FileTreeProps {
  files: Array<{ filePath: string; code: string }>;
  currentFile: string;
  onSelectFile: (filePath: string) => void;
}

export function FileTree({ files, currentFile, onSelectFile }: FileTreeProps) {
  // Organize files into a tree structure
  const fileTree: { [key: string]: string[] } = {};
  
  files.forEach(({ filePath }) => {
    const parts = filePath.split('/').filter(Boolean);
    if (parts.length === 1) {
      if (!fileTree['/']) fileTree['/'] = [];
      fileTree['/'].push(filePath);
    } else {
      const folder = '/' + parts.slice(0, -1).join('/');
      if (!fileTree[folder]) fileTree[folder] = [];
      fileTree[folder].push(filePath);
    }
  });

  const folders = Object.keys(fileTree).sort();

  return (
    <div className="w-64 bg-gray-900 text-gray-300 overflow-y-auto">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
          Project Files
        </h3>
        <p className="text-xs text-gray-400 mt-1">{files.length} files</p>
      </div>
      
      <div className="py-2">
        {folders.map(folder => (
          <div key={folder} className="mb-2">
            <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {folder}
            </div>
            {fileTree[folder].map(filePath => {
              const fileName = filePath.split('/').pop() || filePath;
              const isActive = currentFile === filePath;
              
              return (
                <button
                  key={filePath}
                  onClick={() => onSelectFile(filePath)}
                  className={`w-full text-left px-6 py-2 text-sm transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    </svg>
                    <span className="truncate">{fileName}</span>
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
