import React from "react";

import { Chart } from "react-google-charts";
import { Daydata } from "jsonsfile/data.json";

const PieChart = () => {
  const options = {
    title: "Last 7 Days Sale",
    subtitle: "Sales, Expenses, and Profit: 2022-2023",
    is3D: true,
  };

  return (
    <div>
      <Chart
        chartType="PieChart"
        width="100%"
        height="400px"
        data={Daydata}
        options={options}
      />
    </div>
  );
};
export default PieChart;
