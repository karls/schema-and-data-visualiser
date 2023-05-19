import { useEffect, useState } from "react";
import { Tabs, TabsProps } from "antd";
import { ChartType, QueryAnalysis, QueryResults } from "../../types";
import BarChart from "../charts/BarChart";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/store";
import { AiOutlineBarChart, AiOutlineRadarChart } from "react-icons/ai";
import { BsBodyText, BsPieChart } from "react-icons/bs";
import { BiLineChart } from "react-icons/bi";
import { HiRectangleGroup } from "react-icons/hi2";
import { TbChartSankey } from "react-icons/tb";
import { VscGraphScatter } from "react-icons/vsc";
import { ImSphere } from "react-icons/im";
import PieChart from "../charts/PieChart";
import LineChart from "../charts/LineChart";
import TreeMap from "../charts/TreeMap";
import RadarChart from "../charts/RadarChart";
import SankeyChart from "../charts/SankeyChart";
import ScatterChart from "../charts/ScatterChart";
import "./Charts.css";
import Fullscreen from "./Fullscreen";
import { numericColumns } from "../../utils/queryResults";
import ChordDiagram from "../charts/ChordDiagram";
import { getQueryAnalysis } from "../../api/queries";
import WordCloud from "../charts/WordCloud";

type ChartsProps = {
  query: string;
  results: QueryResults;
};

const Charts = ({ query, results }: ChartsProps) => {
  const rootStore = useStore();
  const settings = rootStore.settingsStore;
  const repositoryStore = rootStore.repositoryStore;

  const chartWidth = Math.floor(
    (window.screen.width - (settings.fullScreen ? 0 : settings.sidebarWidth)) *
      (settings.fullScreen ? 0.95 : 0.88)
  );
  const chartHeight = Math.floor(
    window.screen.height * (settings.fullScreen ? 0.8 : 0.45)
  );

  const [queryAnalysis, setQueryAnalysis] = useState<QueryAnalysis>();

  useEffect(() => {
    getQueryAnalysis(query, repositoryStore.currentRepository!).then((res) => {
      setQueryAnalysis(res!);
    });
  }, [query, repositoryStore.currentRepository]);

  const items: TabsProps["items"] = [
    {
      key: ChartType.Bar,
      label: (
        <>
          <AiOutlineBarChart size={20} /> Bar
        </>
      ),
      children: (
        <Tabs
          defaultActiveKey="1"
          items={numericColumns(results).map((index) => {
            return {
              key: `${index}`,
              label: results.header[index],
              children: (
                <BarChart
                  results={results}
                  width={chartWidth}
                  height={chartHeight}
                  columnIndex={index}
                />
              ),
            };
          })}
        />
      ),
    },
    {
      key: ChartType.Pie,
      label: (
        <>
          <BsPieChart size={18} /> Pie
        </>
      ),
      children: (
        <Tabs
          defaultActiveKey="1"
          items={numericColumns(results).map((index) => {
            return {
              key: `${index}`,
              label: results.header[index],
              children: (
                <PieChart
                  results={results}
                  width={chartWidth}
                  height={chartHeight}
                  columnIndex={index}
                />
              ),
            };
          })}
        />
      ),
    },
    {
      key: ChartType.Line,
      label: (
        <>
          <BiLineChart size={18} /> Line
        </>
      ),
      children: (
        <LineChart results={results} width={chartWidth} height={chartHeight} />
      ),
    },
    {
      key: ChartType.Treemap,
      label: (
        <>
          <HiRectangleGroup size={18} /> Treemap
        </>
      ),
      children: (
        <TreeMap results={results} width={chartWidth} height={chartHeight} />
      ),
    },
    {
      key: ChartType.Radar,
      label: (
        <>
          <AiOutlineRadarChart size={18} /> Radar
        </>
      ),
      children: (
        <RadarChart results={results} width={chartWidth} height={chartHeight} />
      ),
    },
    {
      key: ChartType.Sankey,
      label: (
        <>
          <TbChartSankey size={18} /> Sankey
        </>
      ),
      children: (
        <SankeyChart
          results={results}
          width={chartWidth}
          height={chartHeight}
        />
      ),
    },
    {
      key: ChartType.Scatter,
      label: (
        <>
          <VscGraphScatter size={18} /> Scatter
        </>
      ),
      children: (
        <ScatterChart
          results={results}
          width={chartWidth}
          height={chartHeight}
        />
      ),
    },
    {
      key: ChartType.ChordDiagram,
      label: (
        <>
          <ImSphere size={18} /> Chord
        </>
      ),
      children: (
        <ChordDiagram
          results={results}
          width={chartWidth}
          height={chartHeight}
        />
      ),
    },
    {
      key: ChartType.WordCloud,
      label: (
        <>
          <BsBodyText size={18} /> Word Cloud
        </>
      ),
      children: (
        <WordCloud
          results={results}
          width={chartWidth}
          height={chartHeight}
          keyColumn={queryAnalysis?.variables.key[0]!}
          scalarColumn={queryAnalysis?.variables.scalar[0]!}
        />
      ),
    },
  ];

  return (
    <Fullscreen>
      <Tabs
        defaultActiveKey="1"
        items={items.filter(
          ({ key }) =>
            queryAnalysis &&
            queryAnalysis.visualisations
              .map(({ name }) => name)
              .includes(key as ChartType)
        )}
        style={{ padding: 10 }}
      />
    </Fullscreen>
  );
};

export default observer(Charts);
