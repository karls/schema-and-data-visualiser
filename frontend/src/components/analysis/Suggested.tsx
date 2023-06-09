import { QueryResults } from "../../types";
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
    <>
      <ColumnRelations
        results={results}
        allRelations={allRelations}
        allIncomingLinks={allIncomingLinks}
        allOutgoingLinks={allOutgoingLinks}
      />
    </>
  );
};


