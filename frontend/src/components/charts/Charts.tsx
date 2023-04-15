import { Tabs, TabsProps } from "antd";
import { QueryResults } from "../../types";
import BarGraph from "./BarGraph";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/store";

type ChartsProps = {
  results: QueryResults;
};

const Charts = ({ results }: ChartsProps) => {
  const { settings } = useStore();
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Bar Chart`,
      children: (
        <BarGraph
          results={results}
          width={Math.floor((window.screen.width - settings.getSidebarWidth()) * 0.75)}
          height={400}
        />
      ),
    },
  ];
  return <Tabs defaultActiveKey="1" items={items} />;
};

export default observer(Charts);
