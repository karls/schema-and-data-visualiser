import axios from "axios";
import {
  QueryInfo,
  QueryResults,
  RepositoryId,
  RepositoryInfo,
} from "../types";

export async function allRepositories(): Promise<RepositoryInfo[]> {
  const BACKEND_API = process.env.REACT_APP_BACKEND_API;
  try {
    const endpoint = `${BACKEND_API}/repositories`;
    const response = await axios.get(endpoint);
    const repositories = response.data;
    return repositories;
  } catch (error) {}
  return [];
}

export async function runSparqlQuery(
  repository: RepositoryId,
  queryInfo: QueryInfo
): Promise<QueryResults> {
  const BACKEND_API = process.env.REACT_APP_BACKEND_API;
  try {
    const endpoint = `${BACKEND_API}/sparql`;
    const response = await axios.get(
      `${endpoint}?repository=${repository}&title=${encodeURIComponent(
        queryInfo.title
      )}&query=${encodeURIComponent(queryInfo.sparql)}`
    );
    const results = response.data;
    return results;
  } catch (error) {
    console.log(error);
  }
  return { header: [], data: [] };
}

export async function updateApiUrl(graphdbURL: string) {
  const BACKEND_API = process.env.REACT_APP_BACKEND_API;
  try {
    const endpoint = `${BACKEND_API}/api-url?url=${graphdbURL}`;
    await axios.post(endpoint);
  } catch (error) {
    console.log(error);
  }
}

export async function getApiUrl(): Promise<string> {
  const BACKEND_API = process.env.REACT_APP_BACKEND_API;
  try {
    const endpoint = `${BACKEND_API}/api-url`;
    const response = await axios.get(endpoint);
    const url = response.data;
    return url;
  } catch (error) {
    console.log(error);
  }
  return "";
}
