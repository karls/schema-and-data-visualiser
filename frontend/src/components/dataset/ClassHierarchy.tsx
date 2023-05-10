import { RDFGraph, Triplet, RepositoryId } from "../../types";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "../../stores/store";
import { getClassHierarchy } from "../../api/dataset";
import GraphVis from "../graph/GraphVis";

type ClassHierarchyProps = {
  repository: RepositoryId;
  width: number;
  height: number;
};

const ClassHierarchy = ({ repository, width, height }: ClassHierarchyProps) => {
  const [triplets, setTriplets] = useState<Triplet[]>([]);

  useEffect(() => {
    getClassHierarchy(repository).then((res: RDFGraph) => {
      setTriplets(res.data);
    });
  }, [repository]);

  return (
    <GraphVis
      triplets={triplets}
      width={width}
      height={height}
    />
  );
};

export default ClassHierarchy;
