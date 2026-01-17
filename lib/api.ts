export async function generateWebsite(
  prompt: string, 
  model: string, 
  provider: string
) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt, model, provider, stack: "html" }),
  });

  const contentType = response.headers.get("content-type");
  
  if (!response.ok) {
    let errorMessage = "Failed to generate website";
    try {
      if (contentType?.includes("application/json")) {
        const error = await response.json();
        errorMessage = error.error || errorMessage;
      } else {
        const text = await response.text();
        errorMessage = text.substring(0, 200) || errorMessage;
      }
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("API returned non-JSON response. Check server logs.");
  }

  return response.json();
}
