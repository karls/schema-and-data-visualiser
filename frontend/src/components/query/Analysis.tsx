import { useEffect, useState } from "react";
import { Alert, Card, List, Space, Tag, Tooltip, Typography } from "antd";
import {
  ChartType,
  QueryAnalysis,
  RepositoryId,
  CategoryType,
  VariableCategories,
} from "../../types";
import { getQueryAnalysis } from "../../api/queries";
import { AiOutlineBarChart } from "react-icons/ai";
import { BiScatterChart, BiText } from "react-icons/bi";
import { VscGraphScatter } from "react-icons/vsc";
import {
  BsBodyText,
  BsCalendar3,
  BsCalendarDateFill,
  BsGeoAltFill,
} from "react-icons/bs";
import { GoKey } from "react-icons/go";
import { IoMdTime } from "react-icons/io";
import { MdNumbers } from "react-icons/md";
import { Tb123 } from "react-icons/tb";

export const chartIcons = {
  [ChartType.BAR]: <AiOutlineBarChart size={35} />,
  [ChartType.SCATTER]: <VscGraphScatter size={30} />,
  [ChartType.BUBBLE]: <BiScatterChart size={35} />,
  [ChartType.WORD_CLOUD]: <BsBodyText size={30} />,
  [ChartType.CALENDAR]: <BsCalendar3 size={30} />,
};

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
      {queryAnalysis && (
        <Space direction="vertical" style={{ width: "100%" }}>
          <Variables variableCategories={queryAnalysis.variables} />
          {queryAnalysis.pattern ? (
            <Pattern
              pattern={queryAnalysis.pattern}
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

type PatternProps = {
  pattern: string;
  visualisations: ChartType[];
};

const Pattern = ({ pattern, visualisations }: PatternProps) => {
  return (
    <Card type="inner" title={pattern} style={{ width: "100%" }}>
      <Space direction="vertical">
        <Typography.Text style={{ fontSize: 20 }}>
          Typical charts
        </Typography.Text>
        <Space>
          {visualisations.map((chart) => (
            <Tooltip title={chart}>{chartIcons[chart] ?? chart}</Tooltip>
          ))}
        </Space>
      </Space>
    </Card>
  );
};

type VariablesProps = {
  variableCategories: VariableCategories;
};

const categoryIcon = {
  [CategoryType.KEY]: <GoKey title="Key" size={20} />,
  [CategoryType.DATE]: <BsCalendarDateFill title="Date" size={20} />,
  [CategoryType.TEMPORAL]: <IoMdTime title="Temporal" size={20} />,
  [CategoryType.GEOGRAPHICAL]: <BsGeoAltFill title="Geographical" size={20} />,
  [CategoryType.SCALAR]: <MdNumbers title="Scalar" size={25} />,
  [CategoryType.LEXICAL]: <BiText title="Lexical" size={20} />,
  [CategoryType.NUMERIC]: <Tb123 title="Numeric" size={25} />,
};

const Variables = ({ variableCategories }: VariablesProps) => {
  return (
    <div>
      <List header={"Variables"}>
        {Object.keys(variableCategories).map(
          (category, index) =>
            variableCategories[category].length > 0 && (
              <List.Item key={category}>
                <Space key={`categ-${index}`}>
                  {categoryIcon[category]}
                  <Space>
                    {variableCategories[category].map(
                      (v: string, index: number) => (
                        <Tag key={index}>{v}</Tag>
                      )
                    )}
                  </Space>
                </Space>
              </List.Item>
            )
        )}
      </List>
    </div>
  );
};

export default Analysis;
