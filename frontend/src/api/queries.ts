import axios from "axios";
import { QueryRecord } from "../types";

export async function getQueryHistory(
  repositoryId: string
): Promise<QueryRecord[]> {
  const BACKEND_API = process.env.REACT_APP_BACKEND_API;
  try {
    const endpoint = `${BACKEND_API}/history?repositoryId=${repositoryId}`;
    const response = await axios.get(endpoint);
    const queries = response.data;
    return queries;
  } catch (error) {
    console.log(error);
  }
  return [];
}

export async function clearQueryHistory(repositoryId: string) {
  const BACKEND_API = process.env.REACT_APP_BACKEND_API;
  try {
    const endpoint = `${BACKEND_API}/history/clear?repositoryId=${repositoryId}`;
    const response = await axios.delete(endpoint);
    return response;
  } catch (error) {
    console.log(error);
  }
  return [];
}
