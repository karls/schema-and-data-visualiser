import { Space } from "antd";
import { QueryResults } from "../../types";
import Cardinalities from "./Cardinalities";
import { ColumnRelations } from "./ColumnRelations";

type SuggestedProps = {
  results: QueryResults;
  allRelations: any;
  allOutgoingLinks: any;
  allIncomingLinks: any;
};
export const Suggested = ({
  results,
  allRelations,
  allIncomingLinks,
  allOutgoingLinks,
}: SuggestedProps) => {
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <ColumnRelations
        results={results}
        allRelations={allRelations}
        allIncomingLinks={allIncomingLinks}
        allOutgoingLinks={allOutgoingLinks}
      />
      <Cardinalities results={results} />
    </Space>
  );
};
