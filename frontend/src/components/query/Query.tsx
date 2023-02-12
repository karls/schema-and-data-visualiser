import { Button } from "antd";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { runSparqlQuery } from "../../api/repository";
import { useStore } from "../../stores/store";
import { Triplet } from "../../types";
import QueryEditor from "./QueryEditor";
import QueryResults from "./QueryResults";

const Query: React.FC = observer(() => {
  const { settings } = useStore();
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Triplet[]>([]);

  return (
    <>
      <QueryEditor query={query} onChange={setQuery} />
      {settings.currentRepository && (
        <Button
          onClick={() => {
            runSparqlQuery(settings.currentRepository!, query).then(
              (results) => {
                console.log(results);
                setResults(results);
              }
            );
          }}
        >
          Run
        </Button>
      )}
      <QueryResults results={results} />
    </>
  );
});

export default Query;
