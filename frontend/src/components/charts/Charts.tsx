import { Tabs, TabsProps } from "antd";
import { QueryResults } from "../../types";
import BarChart from "./BarChart";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/store";
import PieChart from "./PieChart";

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
      label: `Bar Chart`,
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
      label: `Pie Chart`,
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
  ];
  return <Tabs defaultActiveKey="1" items={items} />;
};

export default observer(Charts);
