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

    return repositories;
  } catch (error) {}
  return [];
}

export async function addRemoteRepository(
  name: string,
  sparqlEndpoint: string,
  description: string,
  username: string
): Promise<string> {
  const BACKEND_API = process.env.REACT_APP_BACKEND_API;
  try {
    const endpoint = `${BACKEND_API}/repositories/remote`;
    const response = await axios.post(endpoint, {
      name,
      endpoint: sparqlEndpoint,
      description,
      username,
    });
    const repository_id = response.data;
    return repository_id;
  } catch (error) {}
  return "";
}

export async function addLocalRepository(
  name: string,
  dataUrl: string,
  schemaUrl: string,
  description: string,
  username: string
): Promise<string> {
  const BACKEND_API = process.env.REACT_APP_BACKEND_API;
  try {
    const endpoint = `${BACKEND_API}/repositories/local`;
    const response = await axios.post(endpoint, {
      name,
      dataUrl,
      schemaUrl,
      description,
      username,
    });
    const repository_id = response.data;
    return repository_id;
  } catch (error) {}
  return "";
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
