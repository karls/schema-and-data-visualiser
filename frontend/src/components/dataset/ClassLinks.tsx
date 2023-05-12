import { useEffect, useMemo, useState } from "react";
import ChordDiagram from "react-chord-diagram";
import { RepositoryId, URI } from "../../types";
import {
  getIncomingLinks,
  getOutgoingLinks,
  getTypes,
} from "../../api/dataset";
import { removePrefix } from "../../utils/queryResults";
import randomColor from "randomcolor";
import { Alert, Divider } from "antd";

type ClassLinksProps = {
  repository: RepositoryId;
  width: number;
};

const ClassLinks = ({ repository, width }: ClassLinksProps) => {
  const [types, setTypes] = useState<URI[]>([]);

  useEffect(() => {
    getTypes(repository).then((res: URI[]) => {
      setTypes(res);
    });
  }, [repository]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Alert message="Hover or click on a node to hide other ribbons" />
      <Divider>Outgoing</Divider>
      <OutgoingLinks repository={repository} types={types} width={width} />
      <Divider>Incoming</Divider>
      <IncomingLinks repository={repository} types={types} width={width} />
    </div>
  );
};

const OutgoingLinks = ({ repository, types, width }) => {
  const matrix = useMemo(() => {
    const links = {};
    for (let source of types) {
      links[source] = [];
      getOutgoingLinks(repository, source).then((res) => {
        for (let target of types) {
          links[source].push(parseInt((res[target] ?? 0) as any));
        }
      });
    }
    const m = types.map((source) => links[source]);
    return m;
  }, [repository, types]);

  return (
    <ChordDiagram
      matrix={matrix}
      componentId={1}
      groupLabels={types.map((t: URI) => removePrefix(t))}
      groupColors={types.map(() => randomColor())}
      style={{ margin: "auto", padding: 50 }}
      width={width}
      outerRadius={width - 1000}
      height={window.screen.height - 100}
      persistHoverOnClick
    />
  );
};

const IncomingLinks = ({ repository, types, width }) => {
  const matrix = useMemo(() => {
    const links = {};
    for (let source of types) {
      links[source] = [];
      getIncomingLinks(repository, source).then((res) => {
        for (let target of types) {
          links[source].push(parseInt((res[target] ?? 0) as any));
        }
      });
    }
    const m = types.map((source) => links[source]);
    return m;
  }, [repository, types]);

  return (
    <ChordDiagram
      matrix={matrix}
      componentId={2}
      groupLabels={types.map((t: URI) => removePrefix(t))}
      groupColors={types.map(() => randomColor())}
      style={{ margin: "auto", padding: 50 }}
      width={width}
      outerRadius={width - 1000}
      height={window.screen.height}
      persistHoverOnClick
    />
  );
};
export default ClassLinks;
