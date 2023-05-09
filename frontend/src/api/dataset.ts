import axios from "axios";
import { RDFGraph, RepositoryId, URI } from "../types";
import { emptyGraph } from "../utils/queryResults";

export async function getClasses(repository: RepositoryId): Promise<URI[]> {
    const BACKEND_API = process.env.REACT_APP_BACKEND_API;
    try {
      const endpoint = `${BACKEND_API}/dataset/classes?repository=${repository}`;
      const response = await axios.get(endpoint);
      const repositories = response.data;
      return repositories;
    } catch (error) {}
    return [];
}

export async function getClassHierarchy(repository: RepositoryId): Promise<RDFGraph> {
    const BACKEND_API = process.env.REACT_APP_BACKEND_API;
    try {
      const endpoint = `${BACKEND_API}/dataset/classes?repository=${repository}`;
      const response = await axios.get(endpoint);
      const repositories = response.data;
      return repositories;
    } catch (error) {}
    return emptyGraph();
}
  