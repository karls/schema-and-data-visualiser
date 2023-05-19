import { observer } from "mobx-react-lite";
import Chart from "react-google-charts";
import { QueryResults, VariableCategories } from "../../types";
import { useMemo } from "react";

type CalendarChartProps = {
  results: QueryResults;
  width?: number;
  height: number;
  variables: VariableCategories;
};

const CalendarChart = observer(
  ({ results, width, height, variables }: CalendarChartProps) => {
    const data = useMemo(() => {
      const dateVar = variables.date[0];
      const valueVar = variables.scalar[0];
      const dateIndex = results.header.indexOf(dateVar);
      const valueIndex = results.header.indexOf(valueVar);
      return [
        [dateVar, valueVar],
        ...results.data.map((row) => [
          new Date(row[dateIndex]),
          row[valueIndex],
        ]),
      ];
    }, [results.data, results.header, variables.date, variables.scalar]);
    // const data = [
    //   ["Date", "Value"],
    //   [new Date(2012, 3, 13), 37032],
    //   [new Date(2012, 3, 14), 38024],
    //   [new Date(2012, 3, 15), 38024],
    //   [new Date(2012, 3, 16), 38108],
    //   [new Date(2012, 3, 17), 38229],
    //   [new Date(2013, 9, 4), 38177],
    //   [new Date(2013, 9, 5), 38705],
    //   [new Date(2013, 9, 12), 38210],
    //   [new Date(2013, 9, 13), 38029],
    //   [new Date(2013, 9, 19), 38823],
    //   [new Date(2013, 9, 23), 38345],
    //   [new Date(2013, 9, 24), 38436],
    //   [new Date(2013, 9, 30), 38447],
    // ];
    return (
      <Chart
        width={width}
        height={height}
        chartType="Calendar"
        loader={<div>Loading Chart</div>}
        data={data}
      />
    );
  }
);

export default CalendarChart;
