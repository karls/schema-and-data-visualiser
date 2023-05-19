import { useEffect, useState } from "react";
import { Alert, Card, Descriptions, List, Space, Tag } from "antd";
import { QueryAnalysis, RepositoryId, Visualisation } from "../../types";
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
      setQueryAnalysis(res);
      setLoading(false);
    });
  }, [query, repository]);

  return (
    <Card title="Analysis" style={{ width: "100%" }} loading={loading}>
      {queryAnalysis ? (
        <Space direction="vertical" style={{ width: "100%" }}>
          <Variables queryAnalysis={queryAnalysis} />
          <RecommendedCharts
            query={query}
            visualisations={queryAnalysis.visualisations}
          />
        </Space>
      ) : (
        <Alert message="Could not match any query pattern." banner />
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
    Bar: <AiOutlineBarChart size={35} />,
    Scatter: <VscGraphScatter size={30} />,
    Bubble: <BiScatterChart size={35} />,
    "Word Cloud": <BsBodyText size={30} />,
    Calendar: <BsCalendar3 size={30} />,
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
  queryAnalysis: QueryAnalysis;
};

const Variables = ({
  queryAnalysis: {
    pattern,
    keyVar,
    scalarVars,
    temporalVars,
    geographicalVars,
    lexicalVars,
  },
}: VariablesProps) => {
  return (
    <Descriptions title="Variables">
      {keyVar && (
        <Descriptions.Item label="Key">
          <Tag>{keyVar}</Tag>
        </Descriptions.Item>
      )}
      {scalarVars.length > 0 && (
        <Descriptions.Item label="Scalar">
          {scalarVars.map((v, index) => (
            <Tag key={index}>{v}</Tag>
          ))}
        </Descriptions.Item>
      )}
      {temporalVars.length > 0 && (
        <Descriptions.Item label="Temporal">
          {temporalVars.map((v, index) => (
            <Tag key={index}>{v}</Tag>
          ))}
        </Descriptions.Item>
      )}
      {geographicalVars.length > 0 && (
        <Descriptions.Item label="Geographical">
          {geographicalVars.map((v, index) => (
            <Tag key={index}>{v}</Tag>
          ))}
        </Descriptions.Item>
      )}
      {lexicalVars.length > 0 && (
        <Descriptions.Item label="Lexical">
          {lexicalVars.map((v, index) => (
            <Tag key={index}>{v}</Tag>
          ))}
        </Descriptions.Item>
      )}
    </Descriptions>
  );
};

export default Analysis;
