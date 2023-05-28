import {
  TbRelationManyToMany,
  TbRelationOneToMany,
  TbRelationOneToOne,
} from "react-icons/tb";
import { QueryAnalysis, QueryResults, RelationType } from "../../types";
import { getColumnRelationship } from "../../utils/charts";
import { Card, Space, Typography } from "antd";

type SuggestedProps = {
  queryAnalysis: QueryAnalysis;
  results: QueryResults;
};
export const Suggested = ({ queryAnalysis, results }: SuggestedProps) => {
  return (
    <>
      <ColumnRelations
        keyColumns={queryAnalysis.variables.key}
        results={results}
      />
    </>
  );
};

type ColumnRelationsProps = {
  results: QueryResults;
  keyColumns: string[];
};
const ColumnRelations = ({ keyColumns, results }: ColumnRelationsProps) => {
  const relationIcons = {
    [RelationType.ONE_TO_ONE]: (
      <TbRelationOneToOne title="One to one" size={30} />
    ),
    [RelationType.ONE_TO_MANY]: (
      <TbRelationOneToMany title="One to many" size={30} />
    ),
    [RelationType.MANY_TO_MANY]: (
      <TbRelationManyToMany title="Many to many" size={30} />
    ),
  };
  return (
    <Card title="Entity Relationships">
      <Space>
        {keyColumns.map((colA, i) =>
          keyColumns.map((colB, j) => {
            let left = colA;
            let right = colB;
            let relationType = getColumnRelationship(results, colA, colB);
            if (relationType === RelationType.MANY_TO_ONE) {
              left = colB;
              right = colA;
              relationType = RelationType.ONE_TO_MANY;
            }
            return (
              i < j && (
                <Card type="inner" bodyStyle={{ padding: 10 }} hoverable>
                  <Space>
                    <Typography.Text>{left}</Typography.Text>
                    {relationIcons[relationType]}
                    <Typography.Text>{right}</Typography.Text>
                  </Space>
                </Card>
              )
            );
          })
        )}
      </Space>
    </Card>
  );
};
