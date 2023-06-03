import axios from "axios";
import { QueryAnalysis, QueryRecord } from "../types";

export async function getQueryHistory(
  repository: string
): Promise<QueryRecord[]> {
  const BACKEND_API = process.env.REACT_APP_BACKEND_API;
  try {
    const endpoint = `${BACKEND_API}/history?repository=${repository}`;
    const response = await axios.get(endpoint);
    const queries = response.data;
    return queries;
  } catch (error) {
    console.log(error);
  }
  return [];
}

export async function addQueryToHistory(
  repository: string,
  query: string,
  title: string
) {
  const BACKEND_API = process.env.REACT_APP_BACKEND_API;
  try {
    const endpoint = `${BACKEND_API}/history?repository=${repository}&title=${encodeURIComponent(
      title
    )}&query=${encodeURIComponent(query)}`;
    const response = await axios.post(endpoint);
    return response;
  } catch (error) {
    console.log(error);
  }
  return "";
}

export async function clearQueryHistory(repository: string) {
  const BACKEND_API = process.env.REACT_APP_BACKEND_API;
  try {
    const endpoint = `${BACKEND_API}/history?repository=${repository}`;
    const response = await axios.delete(endpoint);
    return response;
  } catch (error) {
    console.log(error);
  }
  return [];
}

export async function getQueryAnalysis(
  query: string,
  repository: string
): Promise<QueryAnalysis> {
  const BACKEND_API = process.env.REACT_APP_BACKEND_API;
  try {
    const endpoint = `${BACKEND_API}/analysis?repository=${repository}&query=${encodeURIComponent(
      query
    )}`;
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.log(error);
  }
  return {
    pattern: null,
    visualisations: [],
    variables: {
      key: [],
      scalar: [],
      geographical: [],
      temporal: [],
      lexical: [],
      date: [],
      numeric: [],
    },
  };
}
