import { useEffect, useMemo, useState } from "react";
import ChordDiagram from "react-chord-diagram";
import { RepositoryId, URI } from "../../types";
import {
  getIncomingLinks,
  getOutgoingLinks,
  getAllTypes,
} from "../../api/dataset";
import { removePrefix } from "../../utils/queryResults";
import randomColor from "randomcolor";
import { Alert, Divider } from "antd";
import { useStore } from "../../stores/store";

type ClassLinksProps = {
  repository: RepositoryId;
  width: number;
};

const ClassLinks = ({ repository, width }: ClassLinksProps) => {
  const rootStore = useStore();
  const settings = rootStore.settingsStore;

  const [types, setTypes] = useState<URI[]>([]);

  useEffect(() => {
    getAllTypes(repository).then((res: URI[]) => {
      setTypes(res);
    });
  }, [repository]);

  const outMatrix: number[][] = useMemo(() => {
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

  const inMatrix: number[][] = useMemo(() => {
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Alert message="Hover or click on a node to hide other ribbons" />
      <Divider>Outgoing</Divider>
      <ChordDiagram
        matrix={outMatrix}
        componentId={1}
        groupLabels={types.map((t: URI) => removePrefix(t))}
        groupColors={types.map(() =>
          randomColor({ luminosity: settings.darkMode ? "light" : "dark" })
        )}
        labelColors={types.map(() => (settings.darkMode ? "white" : "black"))}
        style={{ margin: "auto", padding: 50, font: "white" }}
        width={width}
        outerRadius={width - 1000}
        height={window.screen.height - 100}
        persistHoverOnClick
      />
      <Divider>Incoming</Divider>
      <ChordDiagram
        matrix={inMatrix}
        componentId={1}
        groupLabels={types.map((t: URI) => removePrefix(t))}
        groupColors={types.map(() =>
          randomColor({ luminosity: settings.darkMode ? "light" : "dark" })
        )}
        labelColors={types.map(() => (settings.darkMode ? "white" : "black"))}
        style={{ margin: "auto", padding: 50, font: "white" }}
        width={width}
        outerRadius={width - 1000}
        height={window.screen.height - 100}
        persistHoverOnClick
      />
    </div>
  );
};

export default ClassLinks;
