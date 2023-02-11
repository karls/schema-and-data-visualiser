import axios from "axios";
import { RepositoryId, RepositoryInfo, Triplet } from "../types";

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
): Promise<Triplet[]> {
  const BACKEND_API = process.env.REACT_APP_BACKEND_API;
  try {
    const endpoint = `${BACKEND_API}/query`;
    const response = await axios.post(endpoint, {
      repository: repository,
      query: query.replace('\n', ' '),
    });
    const results = response.data;
    return results;
  } catch (error) {
    console.log(error);
  }
  return [];
}
