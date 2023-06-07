import { useEffect, useState } from "react";
import {
  Alert,
  Card,
  Divider,
  List,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  ChartType,
  QueryAnalysis,
  RepositoryId,
  CategoryType,
  VariableCategories,
} from "../../types";
import { getQueryAnalysis } from "../../api/queries";
import { AiOutlineBarChart, AiOutlineRadarChart } from "react-icons/ai";
import { BiLineChart, BiScatterChart, BiText } from "react-icons/bi";
import { VscGraphScatter } from "react-icons/vsc";
import {
  BsBodyText,
  BsCalendar3,
  BsCalendarDateFill,
  BsGeoAltFill,
  BsPieChart,
} from "react-icons/bs";
import { GoKey } from "react-icons/go";
import { IoMdGitNetwork, IoMdTime } from "react-icons/io";
import { MdNumbers, MdOutlineStackedBarChart } from "react-icons/md";
import {
  Tb123,
  TbChartSankey,
  TbChartTreemap,
  TbCircles,
  TbGridDots,
} from "react-icons/tb";
import { TiChartPieOutline } from "react-icons/ti";
import { ImSphere, ImTree } from "react-icons/im";
import { HiOutlineGlobe } from "react-icons/hi";
import { RiBarChartGroupedFill } from "react-icons/ri";
import { useStore } from "../../stores/store";

export const chartIcons = {
  [ChartType.BAR]: <AiOutlineBarChart size={35} />,
  [ChartType.SCATTER]: <VscGraphScatter size={30} />,
  [ChartType.BUBBLE]: <BiScatterChart size={35} />,
  [ChartType.WORD_CLOUD]: <BsBodyText size={30} />,
  [ChartType.CALENDAR]: <BsCalendar3 size={30} />,
  [ChartType.PIE]: <BsPieChart size={30} />,
  [ChartType.LINE]: <BiLineChart size={30} />,
  [ChartType.TREE_MAP]: <TbChartTreemap size={30} />,
  [ChartType.CIRCLE_PACKING]: <TbCircles size={30} />,
  [ChartType.SUNBURST]: <TiChartPieOutline size={30} />,
  [ChartType.SPIDER]: <AiOutlineRadarChart size={30} />,
  [ChartType.SANKEY]: <TbChartSankey size={30} />,
  [ChartType.CHORD_DIAGRAM]: <ImSphere size={30} />,
  [ChartType.HEAT_MAP]: <TbGridDots size={30} />,
  [ChartType.HIERARCHY_TREE]: <ImTree size={30} />,
  [ChartType.NETWORK]: <IoMdGitNetwork size={30} />,
  [ChartType.CHOROPLETH_MAP]: <HiOutlineGlobe size={30} />,
  [ChartType.STACKED_BAR]: <MdOutlineStackedBarChart size={30} />,
  [ChartType.GROUPED_BAR]: <RiBarChartGroupedFill size={30} />,
};

type AnalysisProps = {
  query: string;
  repository: RepositoryId;
};

const Analysis = ({ query, repository }: AnalysisProps) => {
  const username = useStore().authStore.username!;

  const [queryAnalysis, setQueryAnalysis] = useState<QueryAnalysis | null>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    getQueryAnalysis(query, repository, username).then((res) => {
      setQueryAnalysis(res);
      setLoading(false);
    });
  }, [query, repository, username]);

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
            <Alert
              message="Could not match any query pattern but you can still try the suggested charts."
              banner
            />
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
          Potential charts
        </Typography.Text>
        <Space>
          {visualisations.map((chart) => (
            <Space key={chart}>
              <Tooltip title={chart}>{chartIcons[chart] ?? chart}</Tooltip>
              <Divider type="vertical" />
            </Space>
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
