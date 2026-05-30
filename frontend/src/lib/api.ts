const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("aandilik_token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const maxRetries = 3;
  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });
      
      // If we got here, the request was successful or returned an HTTP error code (which we handle below)
      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (e) {
          // Not a JSON response
        }
        
        const errorMessage = (errorData as any).message 
          ? (Array.isArray((errorData as any).message) ? (errorData as any).message.join(", ") : (errorData as any).message)
          : (response.statusText || `Request failed with status ${response.status}`);
          
        console.error(`[API Error] ${response.status} ${endpoint} | ${errorMessage}`);
        console.error("Error data:", errorData);
        
        throw new Error(errorMessage);
      }

      const text = await response.text();
      return text ? JSON.parse(text) : null;

    } catch (err: any) {
      lastError = err;
      
      // Only retry on network errors (TypeError: Failed to fetch)
      // Do not retry on HTTP errors (like 401, 400, etc.) which are already thrown above
      if (err instanceof TypeError || err.message === "Failed to fetch") {
        console.warn(`[API] Connection failed to ${endpoint}. Retrying (${i + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, 800 * (i + 1))); // Exponential backoff
        continue;
      }
      
      // Otherwise re-throw the error
      throw err;
    }
  }

  throw lastError;
}
