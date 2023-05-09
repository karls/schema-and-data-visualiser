import axios from "axios";
import { RDFGraph, URI } from "../types";
import { emptyGraph } from "../utils/queryResults";

export async function getClasses(): Promise<URI[]> {
    const BACKEND_API = process.env.REACT_APP_BACKEND_API;
    try {
      const endpoint = `${BACKEND_API}/dataset/classes`;
      const response = await axios.get(endpoint);
      const repositories = response.data;
      return repositories;
    } catch (error) {}
    return [];
}

export async function getClassHierarchy(): Promise<RDFGraph> {
    const BACKEND_API = process.env.REACT_APP_BACKEND_API;
    try {
      const endpoint = `${BACKEND_API}/dataset/classes`;
      const response = await axios.get(endpoint);
      const repositories = response.data;
      return repositories;
    } catch (error) {}
    return emptyGraph();
}
  