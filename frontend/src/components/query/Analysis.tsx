import { useEffect, useState } from "react";
import { Alert, Card, Descriptions, List, Space, Tag, Typography } from "antd";
import {
  ChartType,
  QueryAnalysis,
  RepositoryId,
  VariableCategories,
  Visualisation,
} from "../../types";
import { getQueryAnalysis } from "../../api/queries";
import { AiOutlineBarChart } from "react-icons/ai";
import { BiScatterChart } from "react-icons/bi";
import { VscGraphScatter } from "react-icons/vsc";
import { BsBodyText, BsCalendar3 } from "react-icons/bs";

type AnalysisProps = {
  query: string;
  repository: RepositoryId;
};

const Analysis = ({ query, repository }: AnalysisProps) => {
  const [queryAnalysis, setQueryAnalysis] = useState<QueryAnalysis | null>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    getQueryAnalysis(query, repository).then((res) => {
      console.log(res);
      setQueryAnalysis(res);
      setLoading(false);
    });
  }, [query, repository]);

  return (
    <Card title="Analysis" style={{ width: "100%" }} loading={loading}>
      {queryAnalysis && (
        <Space direction="vertical" style={{ width: "100%" }}>
          <Variables variableCategories={queryAnalysis.variables} />
          {queryAnalysis.valid ? (
            <RecommendedCharts
              query={query}
              visualisations={queryAnalysis.visualisations}
            />
          ) : (
            <Alert message="Could not match any query pattern." banner />
          )}
        </Space>
      )}
    </Card>
  );
};

type RecommendedProps = {
  query: string;
  visualisations: Visualisation[];
};

const RecommendedCharts = ({ query, visualisations }: RecommendedProps) => {
  const chartIcons = {
    [ChartType.Bar]: <AiOutlineBarChart size={35} />,
    [ChartType.Scatter]: <VscGraphScatter size={30} />,
    [ChartType.Bubble]: <BiScatterChart size={35} />,
    [ChartType.WordCloud]: <BsBodyText size={30} />,
    [ChartType.Calendar]: <BsCalendar3 size={30} />,
  };
  return (
    <Card
      type="inner"
      title={`Recommended chart${visualisations.length > 1 ? "s" : ""}`}
      style={{ width: "100%" }}
    >
      <List
        itemLayout="horizontal"
        dataSource={visualisations}
        renderItem={(item, index) => {
          const { name, maxInstances } = item;
          const ChartIcon = chartIcons[name];
          return (
            <List.Item>
              <List.Item.Meta
                key={name}
                avatar={ChartIcon ? ChartIcon : name}
                title={name}
                description={
                  <>
                    {maxInstances && (
                      <Alert
                        banner
                        message={`Add LIMIT ${maxInstances} in query for readability`}
                      />
                    )}
                  </>
                }
              />
            </List.Item>
          );
        }}
      />
    </Card>
  );
};

type VariablesProps = {
  variableCategories: VariableCategories;
};

const Variables = ({ variableCategories }: VariablesProps) => {
  return (
    <Card title="Variables">
      <Space direction="vertical">
        {Object.keys(variableCategories).map(
          (category, index) =>
            variableCategories[category].length > 0 && (
              <Space key={`categ-${index}`}>
                <Typography.Text>{category}</Typography.Text>:
                <>
                  {variableCategories[category].map((v, index) => (
                    <Tag key={index}>{v}</Tag>
                  ))}
                </>
              </Space>
            )
        )}
      </Space>
    </Card>
  );
};

export default Analysis;
