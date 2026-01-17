import JSZip from "jszip";

interface GeneratedFile {
  filePath: string;
  code: string;
}

export async function downloadAsZip(
  files: GeneratedFile[] | string, 
  filename: string = "project"
) {
  const zip = new JSZip();
  
  // Handle legacy single HTML file format
  if (typeof files === "string") {
    zip.file("index.html", files);
    const readme = `# Generated Website

## Running Locally
Simply open index.html in a web browser.

## Deployment
Upload index.html to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3

Generated with AI Website Generator
`;
    zip.file("README.md", readme);
  } else {
    // Handle multi-file MERN application format
    files.forEach(({ filePath, code }) => {
      // Remove leading slash for proper zip structure
      const normalizedPath = filePath.startsWith('/') 
        ? filePath.substring(1) 
        : filePath;
      
      zip.file(normalizedPath, code);
    });
    
    // Add comprehensive README for MERN projects
    const readme = `# Generated MERN Application

## Project Structure
This is a full-stack MERN (MongoDB, Express, React, Node.js) application.

## Setup Instructions

### Backend Setup
1. Navigate to the server directory
2. Run \`npm install\`
3. Create a \`.env\` file with required environment variables (see .env.example)
4. Run \`npm start\` to start the server

### Frontend Setup
1. Navigate to the client directory
2. Run \`npm install\`
3. Run \`npm start\` to start the React development server

### Database
Make sure MongoDB is installed and running on your system, or use MongoDB Atlas for cloud hosting.

## Generated Files
${files.map(f => `- ${f.filePath}`).join('\n')}

Generated with AI MERN Generator
`;
    
    zip.file("README.md", readme);
  }
  
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}
