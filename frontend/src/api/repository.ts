import axios from "axios";
import { RepositoryInfo } from "../types";

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
