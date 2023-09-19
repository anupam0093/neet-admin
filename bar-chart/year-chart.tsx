import React, { useState } from "react";
import { Chart } from "react-google-charts";
import {YearData} from 'jsonsfile/data.json';
const YearChart = () => {
 const options = {
    chart: {
      title: "Company Performance",
      subtitle: "Sales, Expenses, and Profit: 2022-2023",
    },
  };

  return (
    <Chart
      chartType="Bar"
      width="100%"
      height="400px"
      data={YearData}
      options={options}
    />
  )
};
export default YearChart;
