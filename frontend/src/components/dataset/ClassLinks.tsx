import { useEffect, useMemo, useState } from "react";
import ChordDiagram from "react-chord-diagram";
import { RepositoryId, URI } from "../../types";
import { getOutgoingLinks, getTypes } from "../../api/dataset";
import { removePrefix } from "../../utils/queryResults";
import randomColor from "randomcolor";

type ClassLinksProps = {
  repository: RepositoryId;
};

const ClassLinks = ({ repository }: ClassLinksProps) => {
  const [types, setTypes] = useState<URI[]>([]);
  const [, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getTypes(repository).then((res: URI[]) => {
      setTypes(res);
    });
  }, [repository]);

  const matrix = useMemo(() => {
    setLoading(true);
    const outgoingLinks = {};
    for (let source of types) {
      outgoingLinks[source] = [];
      getOutgoingLinks(repository, source).then((res) => {
        for (let target of types) {
          outgoingLinks[source].push(res[target] ?? 0);
        }
      });
    }
    const m = types.map((source) => outgoingLinks[source]);
    return m;
  }, [repository, types]);

  useEffect(() => {
    setLoading(false);
  }, [matrix]);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <ChordDiagram
        matrix={matrix}
        componentId={1}
        groupLabels={types.map((t) => removePrefix(t))}
        groupColors={types.map((t) => randomColor())}
        style={{ margin: "auto" }}
      />
    </div>
  );
};

export default ClassLinks;
