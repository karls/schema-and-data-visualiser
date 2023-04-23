import { Tabs, TabsProps, Tooltip } from "antd";
import { QueryResults } from "../../types";
import BarChart from "./BarChart";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/store";
import { AiOutlineBarChart } from "react-icons/ai";
import { BsPieChart } from "react-icons/bs";
import { BiLineChart } from "react-icons/bi";
import { HiRectangleGroup } from "react-icons/hi2";
import PieChart from "./PieChart";
import LineChart from "./LineChart";
import TreeMap from "./TreeMap";

type ChartsProps = {
  results: QueryResults;
};

const Charts = ({ results }: ChartsProps) => {
  const settings = useStore().settingsStore;

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Recommended`,
      children: <></>,
    },
    {
      key: "2",
      label: (
        <>
          <AiOutlineBarChart size={20} /> Bar
        </>
      ),
      children: (
        <BarChart
          results={results}
          width={Math.floor(
            (window.screen.width - settings.sidebarWidth) * 0.75
          )}
          height={400}
        />
      ),
    },
    {
      key: "3",
      label: (
        <>
          <BsPieChart size={18} /> Pie
        </>
      ),
      children: (
        <Tabs
          defaultActiveKey="1"
          items={results.header.slice(1).map((column, index) => {
            return {
              key: `${index}`,
              label: column,
              children: (
                <PieChart
                  results={results}
                  width={Math.floor(
                    (window.screen.width - settings.sidebarWidth) * 0.75
                  )}
                  height={400}
                  columnIndex={index + 1}
                />
              ),
            };
          })}
        />
      ),
    },
    {
      key: "4",
      label: (
        <>
          <BiLineChart size={18} /> Line
        </>
      ),
      children: (
        <Tabs
          defaultActiveKey="1"
          items={results.header.slice(1).map((column, index) => {
            return {
              key: `${index}`,
              label: column,
              children: (
                <LineChart
                  results={results}
                  width={Math.floor(
                    (window.screen.width - settings.sidebarWidth) * 0.75
                  )}
                  height={400}
                  columnIndex={index + 1}
                />
              ),
            };
          })}
        />
      ),
    },
    {
      key: "5",
      label: (
        <>
          <HiRectangleGroup size={18} /> Treemap
        </>
      ),
      children: (
        <Tabs
          defaultActiveKey="1"
          items={results.header.slice(1).map((column, index) => {
            return {
              key: `${index}`,
              label: column,
              children: (
                <TreeMap
                  results={results}
                  width={Math.floor(
                    (window.screen.width - settings.sidebarWidth) * 0.75
                  )}
                  height={400}
                  columnIndex={index + 1}
                />
              ),
            };
          })}
        />
      ),
    },
  ];
  return <Tabs defaultActiveKey="1" items={items} />;
};

export default observer(Charts);
