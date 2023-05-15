import { Tabs, TabsProps } from "antd";
import { QueryResults } from "../../types";
import BarChart from "../charts/BarChart";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/store";
import { AiOutlineBarChart, AiOutlineRadarChart } from "react-icons/ai";
import { BsPieChart } from "react-icons/bs";
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

type ChartsProps = {
  results: QueryResults;
};

const Charts = ({ results }: ChartsProps) => {
  const settings = useStore().settingsStore;
  const chartWidth = Math.floor(
    (window.screen.width - (settings.fullScreen ? 0 : settings.sidebarWidth)) *
      (settings.fullScreen ? 0.95 : 0.88)
  );
  const chartHeight = Math.floor(
    window.screen.height * (settings.fullScreen ? 0.8 : 0.45)
  );
  const items: TabsProps["items"] = [
    {
      key: "recommended",
      label: `Recommended`,
      children: <></>,
    },
    {
      key: "bar chart",
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
      key: "pie chart",
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
      key: "line chart",
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
      key: "treemap",
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
      key: "radar chart",
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
      key: "sankey",
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
      key: "scatter",
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
      key: "chord diagram",
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
  ];

  return (
    <Fullscreen>
      <Tabs defaultActiveKey="1" items={items} style={{ padding: 10 }} />
    </Fullscreen>
  );
};

export default observer(Charts);
