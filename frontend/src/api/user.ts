import axios from "axios";

export async function login(username: string): Promise<string> {
    const BACKEND_API = process.env.REACT_APP_BACKEND_API;
    try {
      const endpoint = `${BACKEND_API}/login?username=${encodeURIComponent(username)}`;
      await axios.post(endpoint);
      return username;
    } catch (error) {}
    return '';
}