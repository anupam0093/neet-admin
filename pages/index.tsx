import ArrowIcon from "icons/ArrowDown";
import DashboardHeader from "layout/header";
import React, { useState } from "react";
import styles from "styles/order.module.scss";
import moment from "moment";
import { useFetchAllOrders } from "network-requests/queries";
import { useRouter } from "next/router";
import { Order } from "network-requests/types";
import * as XLSX from "xlsx";
// @ts-ignore
import { saveAs } from "file-saver";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import CloseIcon from "icons/close";

const AdminHome = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDate2, setSelectedDate2] = useState("");
  const startDate = moment(selectedDate).format("YYYYMMDD");
  const endDate = moment(selectedDate2).format("YYYYMMDD");
  const router = useRouter();
  const [nav, setNav] = React.useState(false);
  const { data, refetch } = useFetchAllOrders(router?.query?.id as any);
  const handleclose = () => {
    setSelectedDate("");
    setSelectedDate2("");
    setNav(false);
  };
  const handlego = () => {
    if (selectedDate && selectedDate2) {
      setNav(true);
    }
  };
  const gostyle = {
    backgroundColor: nav ? "#b995d5" : "#95d5b7",
  };
  var purchase = 0;
  var grossSale = 0;
  var refunQuantity = 0;
  var refunOrder = 0;
  var refundPrice = 0;
  var shippingCharges = 0;
  var couponWorth = 0;

  var NewOne = [] as any;
  var dateIndexMap = {} as any;
  // Chart Data Calculation
  const NewOrder: Order[] = [];
  data?.map((item) => {
    const meta = moment(item?.createdAt).format("YYYYMMDD");
    if (Number(meta) >= Number(startDate)) {
      if (Number(meta) <= Number(endDate)) {
        if (!item?.isDeleted) {
          if (item?.payment?.status !== "REFUNDED") {
            NewOrder.push(item);
            purchase += item?.orderItems?.length;
            grossSale += item?.totalPrice;
            shippingCharges += item?.extraDelivery?.price;

            //  Start Data Calculation for Similerdate
            const { createdAt, totalPrice } = item;
            const date = moment(createdAt).format("DD-MM-YYYY");
            if (!dateIndexMap[date]) {
              dateIndexMap[date] = NewOne.length;
              NewOne.push({ date: date, price: totalPrice, quantity: 1 });
            } else {
              const index = dateIndexMap[date];
              NewOne[index].price += totalPrice;
              NewOne[index].quantity++;
            }
            //End Datat Calculations For Similer Date
          }
          if (item?.discount?.price > 0) {
            couponWorth += (item?.totalPrice / 100) * item?.discount?.percent;
          }
          if (item?.payment?.status === "REFUNDED") {
            refunQuantity += item?.orderItems?.length;
            refunOrder += 1;
            refundPrice += item?.totalPrice;
          }
        }
      }
    }
  });

  var NewTwo = [] as any;
  var IndexMap = {} as any;
  data?.slice(0, 50).map((item) => {
    if (!item?.isDeleted) {
      const { createdAt, totalPrice } = item;
      const purchaseQuantity = item.orderItems.length;
      const date = moment(createdAt).format("DD-MM-YYYY");
      if (!IndexMap[date]) {
        IndexMap[date] = NewTwo.length;
        NewTwo.push({
          date: date,
          price: totalPrice,
          quantity: 1,
          purchaseQuantity,
        });
      } else {
        const index = IndexMap[date];
        NewTwo[index].price += totalPrice;
        NewTwo[index].quantity++;
        NewTwo[index].purchaseQuantity += purchaseQuantity;
      }
    }
  });
  const [getexcel,setExcel]=React.useState(false)
  const exportToExcel = () => {
    if(selectedDate&&selectedDate2!==''){
    const worksheet = XLSX.utils.json_to_sheet(NewOrder);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(
      data,
      `Order From ${moment(NewOrder?.[0]?.createdAt).format(
        "DD-MM-YYYY"
      )} to ${moment(NewOrder?.[NewOrder?.length]?.createdAt).format(
        "DD-MM-YYYY"
      )} `
    );
     }
     else{
      setExcel(true);
     }
  };

  const quantities = NewOne.map((item: any) => item.quantity);
  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: "Orders",
    },
    maintainAspectRatio: false,
    xAxis: {
      categories: NewOne?.map((item: any) => item?.date),
      title: {
        text: "Date",
      },
    },
    yAxis: {
      title: {
        text: "Price",
      },
      min: 0,
      labels: {
        formatter: function (this: Highcharts.TooltipFormatterContextObject) {
          // @ts-ignore
          return "£" + this.value; // Added a Pound sign to the y-axis labels
        },
      },
    },
    plotOptions: {
      column: {
        color: "#FFA500", // Set a single color for all bars
      },
    },
    tooltip: {
      pointFormatter: function (
        this: Highcharts.TooltipFormatterContextObject
      ) {
        const dataIndex = this.x as any;
        const quantity = quantities[dataIndex];
        return `<span style="color:${this.color}">\u25CF</span> ${this.series.name} <b>Order:</b> ${quantity} <br/> <b>Total</b>- £${this.y}<br/>`;
      },
      shared: true,
    },
    series: [
      {
        name: "",
        data: NewOne?.map((item: any) => item?.price),
      },
    ],
  };

  const quantities1 = NewTwo?.slice(0,6).map((item: any) => item.quantity);

  const options1 = {
    chart: {
      type: "column",
    },
    title: {
      text: "Orders",
    },
    maintainAspectRatio: false,
    xAxis: {
      categories: NewTwo?.slice(0,6).map((item: any) => item?.date),
      title: {
        text: "Date",
      },
    },
    yAxis: {
      title: {
        text: "Price",
      },
      min: 0,
      labels: {
        formatter: function (this: Highcharts.TooltipFormatterContextObject) {
          //@ts-ignore
          return "£" + this.value; // Added a Pound sign to the y-axis labels
        },
      },
    },
    plotOptions: {
      column: {
        color: "#FFA500", // Set a single color for all bars
      },
    },
    tooltip: {
      pointFormatter: function (
        this: Highcharts.TooltipFormatterContextObject
      ) {
        const dataIndex = this.x as any;
        const quantity = quantities1[dataIndex];
        return `<span style="color:${this.color}">\u25CF</span> ${this.series.name} <b>Order:</b> ${quantity} <br/> <b>Total</b>- £${this.y}<br/>`;
      },
      shared: true,
    },
    series: [
      {
        name: "",
        data: NewTwo?.slice(0,6).map((item: any) => item.price),
      },
    ],
  };

  // console.log(NewTwo);
  var tol = 0;
  var ord = 0;
  var itm = 0;
  NewTwo?.slice(0,6).map((item: any) => {
    tol += item.price;
    ord += item.quantity;
    itm += item.purchaseQuantity;
  });
  return (
    <React.Fragment>
      <div className={styles.rightsidebar}>
        {getexcel && (
          <div className={styles.svgpopup}>
            {" "}
            <span>
              <h5>Select Valid Date</h5>{" "}
              <a onClick={() => setExcel(false)}>
                <CloseIcon width={50} />
              </a>
            </span>
          </div>
        )}

        <DashboardHeader />
        <div className={styles.mainreportgraph}>
          <div className={styles.container}>
            <div className={styles.tabsection}>
              <div className={styles.date}>
                <p>custom:</p>
                <div className={styles.date1picker}>
                  <input
                    type="date"
                    className={styles.datepicker_input}
                    value={selectedDate}
                    onChange={(e: any) => setSelectedDate(e.target.value)}
                  />
                </div>
                -
                <div className={styles.date1picker}>
                  <input
                    type="date"
                    className={styles.datepicker_input}
                    value={selectedDate2}
                    onChange={(e: any) => setSelectedDate2(e.target.value)}
                  />
                </div>
                {nav && (
                  <button
                    onClick={handleclose}
                    className={styles.closebtnchart}
                  >
                    Reset
                  </button>
                )}
                <button
                  onClick={handlego}
                  className={styles.gobtn}
                  style={gostyle}
                >
                  Go
                </button>
              </div>
            </div>
            {/* <div className={styles.buttonsec}>
              <span>
                <ArrowIcon />
              </span>
              <button onClick={exportToExcel}>Export CSV</button>
            </div> */}
          </div>
          <div className={styles.nextsection}>
            <div className={styles.sidebar}>
              <ul>
                <li className={styles.grosssales}>
                  <h3>£{nav ? grossSale : tol}</h3>
                  <p>gross sales in this period</p>
                </li>
                <li className={styles.thirdli}>
                  <h3>{nav ? NewOrder?.length : ord}</h3>
                  <p>orders placed</p>
                </li>
                <li className={styles.fourthli}>
                  <h3>{nav ? purchase : itm}</h3>
                  <p>items purchased</p>
                </li>
                <li className={styles.fifthli}>
                  <h3>£{nav ? refundPrice : "0"}</h3>
                  <p>
                    refund {nav ? refunOrder : "0"} order (
                    {nav ? refunOrder : "0"} item)
                  </p>
                </li>
                {/* <li className={styles.sixthli}>
                  <h3>-£320.00</h3>
                  <p>charged for shipping</p>
                </li> */}
                <li className={styles.seventhli}>
                  <h3>£{nav ? couponWorth.toFixed(1) : "0.00"}</h3>
                  <p>worth of copouns used</p>
                </li>
              </ul>
            </div>
            {nav ? (
              <>
                <div className={styles.graphsec}>
                  <HighchartsReact highcharts={Highcharts} options={options} />
                </div>
              </>
            ) : (
              <>
                <div className={styles.graphsec}>
                  <HighchartsReact highcharts={Highcharts} options={options1} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default AdminHome;
