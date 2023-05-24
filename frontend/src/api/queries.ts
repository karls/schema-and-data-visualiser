import axios from "axios";
import { QueryAnalysis, QueryRecord } from "../types";

export async function getQueryHistory(
  repositoryId: string
): Promise<QueryRecord[]> {
  const BACKEND_API = process.env.REACT_APP_BACKEND_API;
  try {
    const endpoint = `${BACKEND_API}/history?repository=${repositoryId}`;
    const response = await axios.get(endpoint);
    const queries = response.data;
    return queries;
  } catch (error) {
    console.log(error);
  }
  return [];
}

export async function addQueryToHistory(
  repositoryId: string,
  query: string,
  title: string
) {
  const BACKEND_API = process.env.REACT_APP_BACKEND_API;
  try {
    const endpoint = `${BACKEND_API}/history?repository=${repositoryId}&title=${encodeURIComponent(
      title
    )}&query=${encodeURIComponent(query)}`;
    const response = await axios.post(endpoint);
    return response;
  } catch (error) {
    console.log(error);
  }
  return '';
}

export async function clearQueryHistory(repositoryId: string) {
  const BACKEND_API = process.env.REACT_APP_BACKEND_API;
  try {
    const endpoint = `${BACKEND_API}/history?repository=${repositoryId}`;
    const response = await axios.delete(endpoint);
    return response;
  } catch (error) {
    console.log(error);
  }
  return [];
}

export async function getQueryAnalysis(
  query: string,
  repositoryId: string
): Promise<QueryAnalysis | null> {
  const BACKEND_API = process.env.REACT_APP_BACKEND_API;
  try {
    const endpoint = `${BACKEND_API}/analysis?repository=${repositoryId}&query=${encodeURIComponent(
      query
    )}`;
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.log(error);
  }
  return null;
}
