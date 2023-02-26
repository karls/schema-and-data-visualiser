import axios from "axios";
import { QueryResult, RepositoryId, RepositoryInfo } from "../types";

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
): Promise<QueryResult> {
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
  return { header: [], data: []};
}
