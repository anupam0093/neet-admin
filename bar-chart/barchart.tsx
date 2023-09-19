import React, { useCallback, useState } from "react";
import { LastMothData } from "jsonsfile/data.json";
import { Chart } from "react-google-charts";
import moment from "moment";
interface chartdatas{
  data:any[];
  startDate:Date;
  endDate:Date;
}
const ChartView = ({data,startDate,endDate}:chartdatas) => {
  const options = {
    chart: {
      title: "Company Performance",
      subtitle: "Sales, Expenses, and Profit: 2022-2023",
    },
  };

 
 
  console.log("hola chika",data)
  return (

    <Chart
      chartType="Line"
      width="100%"
      height="400px"
      data={[
        ["Date","Sale"],       
        [moment(data?.[0]?.createdAt).format("DD-MM-YYYY"), data?.[0]?.totalPrice],
        [moment(data?.[1]?.createdAt).format("DD-MM-YYYY"), data?.[1]?.totalPrice],
        [moment(data?.[2]?.createdAt).format("DD-MM-YYYY"), data?.[2]?.totalPrice],
        data?.map((item) => {return ([item?.createdAt,item?.totalPrice])
        })

      ]}
      options={options}
    />
  );
};
export default ChartView;
