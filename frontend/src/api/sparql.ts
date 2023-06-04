import axios from "axios";
import { QueryResults, RepositoryId, RepositoryInfo } from "../types";

export async function allRepositories(
  username: string
): Promise<RepositoryInfo[]> {
  const BACKEND_API = process.env.REACT_APP_BACKEND_API;
  try {
    const endpoint = `${BACKEND_API}/repositories?username=${encodeURIComponent(
      username
    )}`;
    const response = await axios.get(endpoint);
    const repositories = response.data;
    console.log(repositories);
    return repositories;
  } catch (error) {}
  return [];
}

export async function runSparqlQuery(
  repository: RepositoryId,
  query: string,
  username: string
): Promise<QueryResults> {
  const BACKEND_API = process.env.REACT_APP_BACKEND_API;
  try {
    const endpoint = `${BACKEND_API}/sparql`;
    const response = await axios.get(
      `${endpoint}?repository=${repository}&query=${encodeURIComponent(
        query
      )}&username=${encodeURIComponent(username)}`
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
