import axios from 'axios';
import { QueryHistory } from "../types";

export async function getQueryHistory(): Promise<QueryHistory> {
    const BACKEND_API = process.env.REACT_APP_BACKEND_API;
    try {
      const endpoint = `${BACKEND_API}/query/history`;
      const response = await axios.get(endpoint);
      const queries = response.data;
      return queries;
    } catch (error) {
        console.log(error);
    }
    return [];
  }
  