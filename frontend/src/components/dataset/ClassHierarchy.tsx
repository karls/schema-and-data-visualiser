import { RDFGraph, Triplet, RepositoryId } from "../../types";
import { useEffect, useState } from "react";
import { getClassHierarchy } from "../../api/dataset";
import GraphVis from "../graph/GraphVis";
import { useStore } from "../../stores/store";

type ClassHierarchyProps = {
  repository: RepositoryId;
  width: number;
  height: number;
};

const ClassHierarchy = ({ repository, width, height }: ClassHierarchyProps) => {
  const username = useStore().authStore.username!;
  const [triplets, setTriplets] = useState<Triplet[]>([]);

  useEffect(() => {
    getClassHierarchy(repository, username).then((res: RDFGraph) => {
      setTriplets(res.data);
    });
  }, [repository, username]);

  return (
    <GraphVis
      links={triplets}
      width={width}
      height={height}
      repository={repository}
      hierarchical={true}
      interactive={false}
    />
  );
};

export default ClassHierarchy;
