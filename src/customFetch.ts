const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const customFetch = async (url: string, options: RequestInit = {}) => {
  return fetch(`${baseUrl}${url}`, options);
}
