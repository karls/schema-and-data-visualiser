import axios from "axios";

const BACKEND_API = process.env.REACT_APP_BACKEND_API;

export async function login(username: string): Promise<string> {
    try {
      const endpoint = `${BACKEND_API}/login?username=${encodeURIComponent(username)}`;
      await axios.post(endpoint);
      return username;
    } catch (error) {}
    return '';
}