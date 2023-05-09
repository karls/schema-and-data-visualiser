import axios from "axios";
import { RDFGraph, RepositoryId, URI } from "../types";
import { emptyGraph } from "../utils/queryResults";

export async function getClasses(repository: RepositoryId): Promise<URI[]> {
    const BACKEND_API = process.env.REACT_APP_BACKEND_API;
    try {
      const endpoint = `${BACKEND_API}/dataset/classes?repository=${repository}`;
      const response = await axios.get(endpoint);
      const classes = response.data;
      return classes;
    } catch (error) {}
    return [];
}

export async function getClassHierarchy(repository: RepositoryId): Promise<RDFGraph> {
    const BACKEND_API = process.env.REACT_APP_BACKEND_API;
    try {
      const endpoint = `${BACKEND_API}/dataset/class-hierarchy?repository=${repository}`;
      const response = await axios.get(endpoint);
      const graph = response.data;
      return graph;
    } catch (error) {}
    return emptyGraph();
}

export async function getNoOfTriplets(repository: RepositoryId): Promise<number> {
  const BACKEND_API = process.env.REACT_APP_BACKEND_API;
  try {
    const endpoint = `${BACKEND_API}/dataset/triplet-count?repository=${repository}`;
    const response = await axios.get(endpoint);
    const totalTriplets = parseInt(response.data);
    return totalTriplets;
  } catch (error) {}
  return 0;
}


