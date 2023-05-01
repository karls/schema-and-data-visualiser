import axios from "axios";
import { QueryResults, RepositoryId, RepositoryInfo } from "../types";

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
  query: string
): Promise<QueryResults> {
  const BACKEND_API = process.env.REACT_APP_BACKEND_API;
  try {
    const endpoint = `${BACKEND_API}/query`;
    const response = await axios.post(endpoint, {
      repository,
      query,
    });
    const results = response.data;
    return results;
  } catch (error) {
    console.log(error);
  }
  return { header: [], data: [] };
}

export async function updateGraphdbURL(graphdbURL: string) {
  const BACKEND_API = process.env.REACT_APP_BACKEND_API;
  try {
    const endpoint = `${BACKEND_API}/graphdb/setURL?graphdbURL=${graphdbURL}`;
    await axios.post(endpoint);
  } catch (error) {
    console.log(error);
  }
}

export async function getGraphdbURL(): Promise<string> {
  const BACKEND_API = process.env.REACT_APP_BACKEND_API;
  try {
    const endpoint = `${BACKEND_API}/graphdb/getURL`;
    const response = await axios.get(endpoint);
    const url = response.data;
    return url;
  } catch (error) {
    console.log(error);
  }
  return '';
}
