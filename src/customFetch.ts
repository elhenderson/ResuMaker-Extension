// const baseUrl = "https://gpjhqkrj3k.us-east-2.awsapprunner.com";
const baseUrl = "http://localhost:3001";

export const customFetch = async (url: string, options: RequestInit = {}) => {
  return fetch(`${baseUrl}${url}`, options);
}
