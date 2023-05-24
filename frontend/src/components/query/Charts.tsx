import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsProps } from "antd";
import {
  ChartType,
  QueryAnalysis,
  QueryResults,
  Visualisation,
} from "../../types";
import BarChart from "../charts/BarChart";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/store";
import { AiOutlineBarChart, AiOutlineRadarChart } from "react-icons/ai";
import { BsBodyText, BsCalendar3, BsLightbulb, BsPieChart } from "react-icons/bs";
import { BiLineChart } from "react-icons/bi";
import {
  TbChartSankey,
  TbChartTreemap,
  TbCircles,
  TbGridDots,
} from "react-icons/tb";
import { VscGraphScatter } from "react-icons/vsc";
import { ImSphere, ImTree } from "react-icons/im";
import { TiChartPieOutline } from "react-icons/ti";

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
import CalendarChart from "../charts/CalendarChart";
import WordCloud from "../charts/WordCloud";
import { CirclePacking } from "../charts/CirclePacking";
import HierarchyTree from "../charts/HierarchyTree";
import SunburstChart from "../charts/SunburstChart";
import HeatMap from "../charts/HeatMap";

type ChartsProps = {
  query: string;
  results: QueryResults;
};

const Charts = observer(({ query, results }: ChartsProps) => {
  const rootStore = useStore();
  const settings = rootStore.settingsStore;
  const repositoryStore = rootStore.repositoryStore;

  const chartWidth = Math.floor(
    (window.screen.width - (settings.fullScreen ? 0 : settings.sidebarWidth)) *
      (settings.fullScreen ? 0.95 : 0.88)
  );

  const chartHeight = settings.fullScreen
    ? settings.screenHeight
    : settings.screenHeight - 325;

  const [queryAnalysis, setQueryAnalysis] = useState<QueryAnalysis>();
  const [possibleVis, setPossibleVis] = useState<Visualisation[]>([]);
  useEffect(() => {
    getQueryAnalysis(query, repositoryStore.currentRepository!).then((res) => {
      setQueryAnalysis(res!);
      setPossibleVis(res!.visualisations);
    });
  }, [query, repositoryStore.currentRepository]);

  const items: TabsProps["items"] = useMemo(() => {
    if (!queryAnalysis) {
      return [];
    }
    return [
      {
        key: "Suggested",
        label: (
          <>
            <BsLightbulb size={15} /> Suggested
          </>
        ),
        children: <></>,
      },
      {
        key: ChartType.Bar,
        label: (
          <>
            <AiOutlineBarChart size={20} /> Bar
          </>
        ),
        children: (
          <BarChart
            results={results}
            width={chartWidth}
            height={chartHeight}
            variables={queryAnalysis!.variables}
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
          <LineChart
            results={results}
            width={chartWidth}
            height={chartHeight}
          />
        ),
      },
      {
        key: ChartType.TreeMap,
        label: (
          <>
            <TbChartTreemap size={18} /> Treemap
          </>
        ),
        children: (
          <TreeMap
            results={results}
            width={chartWidth}
            height={chartHeight}
            variables={queryAnalysis!.variables}
          />
        ),
      },
      {
        key: ChartType.CirclePacking,
        label: (
          <>
            <TbCircles size={18} /> Circle Packing
          </>
        ),
        children: (
          <CirclePacking
            results={results}
            width={chartWidth}
            height={chartHeight}
            variables={queryAnalysis!.variables}
          />
        ),
      },
      {
        key: ChartType.Sunburst,
        label: (
          <>
            <TiChartPieOutline size={20} /> Sunburst
          </>
        ),
        children: (
          <SunburstChart
            results={results}
            width={chartWidth}
            height={chartHeight}
            variables={queryAnalysis!.variables}
          />
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
          <RadarChart
            results={results}
            width={chartWidth}
            height={chartHeight}
          />
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
            variables={queryAnalysis!.variables}
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
        key: ChartType.HeatMap,
        label: (
          <>
            <TbGridDots size={20} /> Heat Map
          </>
        ),
        children: (
          <HeatMap
            results={results}
            width={chartWidth}
            height={chartHeight}
            variables={queryAnalysis.variables}
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
          <>
            {queryAnalysis && (
              <WordCloud
                results={results}
                width={chartWidth}
                height={chartHeight}
                variables={queryAnalysis.variables}
              />
            )}
          </>
        ),
      },
      {
        key: ChartType.Calendar,
        label: (
          <>
            <BsCalendar3 size={20} /> Calendar
          </>
        ),
        children: (
          <CalendarChart
            results={results}
            width={chartWidth}
            height={chartHeight}
            variables={queryAnalysis!.variables}
          />
        ),
      },
      {
        key: ChartType.HierarchyTree,
        label: (
          <>
            <ImTree size={20} /> Hierarchy Tree
          </>
        ),
        children: (
          <HierarchyTree
            results={results}
            width={chartWidth}
            height={chartHeight}
            variables={queryAnalysis!.variables}
          />
        ),
      },
    ];
  }, [chartHeight, chartWidth, queryAnalysis, results]);

  return (
    <Fullscreen>
      <Tabs
        defaultActiveKey="1"
        items={
          settings.showAllCharts
            ? items
            : items.filter(
                ({ key }) =>
                  key === "Guide" ||
                  possibleVis.map(({ name }) => name).includes(key as ChartType)
              )
        }
        style={{ padding: 10 }}
      />
    </Fullscreen>
  );
});

export default Charts;
