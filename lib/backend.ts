const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchBackend(path: string, init: RequestInit = {}) {
  const url = `${API_URL}${path}`;
  return fetch(url, { cache: "no-store", ...init });
}

export const backendUrl = API_URL;
