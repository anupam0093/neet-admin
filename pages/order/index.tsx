import React, { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import styles from "styles/order.module.scss";
import OrderList from "components/table/order-list";
import DashboardHeader from "layout/header";
import { useFetchAllOrders, useFetchAllOrdersTest, useGetMyself } from "network-requests/queries";
import { orderStatus } from "constants/OrderActions";
import _ from 'lodash';
import {
  useBulkOrderUpdate,
  useUpdateOrderHistory,
} from "network-requests/mutations";
import { useRouter } from "next/router";
import Search from "layout/search";
import Invoice from "components/Invoice";
import { useImmer } from "use-immer";
import moment from "moment";
import Button from "components/element/button";
import { useInView } from "react-intersection-observer";


function AllOrderPage() {
  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  const router = useRouter();
  const { data: me } = useGetMyself();
  
  
  const [dell,setDell]=React.useState(false);
  const [orderSatat,setOrderStat]=React.useState("");
  console.log("orderSatat",orderSatat);
  const { data:order,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,}=useFetchAllOrdersTest(orderSatat,dell,router?.query?.id as any)
  console.log("order on line 22",order)
  const allOrders = useMemo(()=>order?.pages?.flatMap((page) => page.data),[order?.pages]);
    // const { data, refetch } = useFetchAllOrders(router?.query?.id as any);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const HandleStat = React.useCallback(
    async (stat: any) => {
      setDell(false);
      setOrderStat(stat);
      await refetch();
      // console.log("stat", orderSatat);
    }, // 300 milliseconds debounce time
    [refetch]
  );
  // console.log("all Order",allOrders);
  React.useEffect(() => {
    refetch();
  }, [orderSatat, refetch]);




  console.log("ALL order on line 22",order)

  const { mutateAsync } = useBulkOrderUpdate();
  const { mutateAsync: historyMutate } = useUpdateOrderHistory();
  // filter payment method
  const [filterPayment, setFilterPayment] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [orders, setOrders] = React.useState<typeof allOrders>([]);

  const [action, setAction] = useState("");
  const [selectedAction, setSelectedAction] = useState("");

  const onSetOrders = (key: string, value: any) => {
    refetch();
    setSelectedAction(key);
    setOrders(value);
    
  }
const filterArrary = React.useMemo(() => {
    return allOrders?.filter((d) => {
      return filterPayment === ""
        ? d
        : d.payment?.paymentMethod === filterPayment;
    });
  }, [allOrders, filterPayment]);


  React.useEffect(() => {
    setOrders(allOrders?.filter((order: any) => order.isDeleted === false) ?? []);
  }, [allOrders]);
  const selectedOrdersPrintInvoice = React.useMemo(() => {
    if (!selected.length) return [];
    if (!orders) return [];
    if (action !== "PRINT_INVOICE") return [];
    return orders?.filter((d) => selected.includes(d._id));
  }, [selected, orders, action]);

  // OLD STATUS
  // const [historyStatus, setHistoryStatus] = useImmer([]);
  const [historyStatus, setHistoryStatus] = useImmer({
    id: "",
    status: "",
    newHistory: "",
  });

  const onChangeHistory = React.useCallback(
    (key: keyof typeof historyStatus, value: any) => {
      setHistoryStatus((draft) => {
        draft[key] = value;
      });
    },
    [setHistoryStatus]
  );

  const handleSelect = useCallback(
    (id: string, status: string) => {
      if (selected.includes(id)) {
        setSelected(selected.filter((s) => s !== id));
        // setHistoryStatus((draft) => {
        //   return draft.filter((i: any) => i.id !== id);
        // });
        setHistoryStatus((draft) => {
          draft.id = id;
          draft.status = status;
        });
      } else {
        setSelected([...selected, id]);
        // setHistoryStatus((draft: any) => {
        //   draft.push({ id, status });
        // });
        setHistoryStatus((draft) => {
          draft.id = id;
          draft.status = status;
        });
      }
    },
    [selected, setHistoryStatus]
  );

  const handleSelectAll = useCallback(() => {
    if (selected.length === allOrders?.length) {
      setSelected([]);
    } else {
      setSelected(allOrders?.map((d) => d._id) || []);
    }
  }, [allOrders, selected]);

  const handleBulkAction = useCallback(async () => {
    if (!action) return;
    if (action === "PRINT_INVOICE") {
      window.print();
      return;
    }

    const status = `Order status change from ${historyStatus.status} to ${
      historyStatus.newHistory
    } by ${me?.name} At ${moment(new Date()).format(`DD-MMM-YYYY hh:mm:ss`)}`;

    await historyMutate({
      _id: historyStatus.id,
      payload: {
        status,
      },
    });

    await mutateAsync(
      { ids: selected, status: action },
      {
        onSuccess: () => {
          refetch();
          setSelected([]);
          setAction("");
        },
      }
    );
  }, [
    action,
    historyStatus.status,
    historyStatus.newHistory,
    historyStatus.id,
    me?.name,
    historyMutate,
    mutateAsync,
    selected,
    refetch,
  ]);

  const onFilterPayment = React.useCallback((value: string) => {
    setFilterPayment(value);
  }, []);


  

  return (
    <>
      <div className={styles.rightsidebar}>
        <DashboardHeader
          customHeader={
            <Search
              inputProps={{
                placeholder: "Custom Search for Order Page",
              }}
            />
          }
        />

        <main className={styles.main}>
          <div className={styles.containerbox}>
            {/* <div className={styles.mainheading}>Orders </div> */}
            <div className={` ${styles.tablebox} ${styles.mt2}`}>
              <div className={styles.tabletopheading}>
                <div>
                  All Orders
                  <span className={styles.number}>{allOrders?.length}</span>
                </div>

                <ul className={styles.oldDatabase}>
                  <li>
                    <a
                      href="https://staging-bedsdivansco-staging.kinsta.cloud/admin"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className={styles.icons}>
                        <Image
                          src="/database-2-line.svg"
                          width="30"
                          height={20}
                          alt="icons"
                          priority
                        />{" "}
                      </span>{" "}
                      Old Database 1
                    </a>
                  </li>
                  <li>
                    <div> </div>{" "}
                    <a
                      href="http://env-bedsdivansco-newbackup.kinsta.cloud/admin"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className={styles.icons}>
                        <Image
                          src="/database-2-fill.svg"
                          width="30"
                          height={20}
                          alt="icons"
                          priority
                        />{" "}
                      </span>{" "}
                      Old Database 2
                    </a>
                  </li>
                </ul>
              </div>

              <div className={styles.subsubsubactionbtnlist}>
                <div className={styles.actionbtnlist}>
                  <ul>
                    <li>
                      <a
                        onClick={() =>{HandleStat("")
                        refetch()
                       }
                          // onSetOrders(
                          //   "all",
                          //   allOrders?.filter(
                          //     (order: any) => order.isDeleted === false
                          //   )
                          // )
                        }
                      >
                        All <span>({allOrders?.length})</span>
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={() => {
                          // refresh();
                          HandleStat(orderStatus.Processing)
                          refetch();
                          // onSetOrders(
                          //   "processing",
                          //   allOrders?.filter(
                          //     (order: any) =>
                          //       order.payment.status === orderStatus.Processing
                          //   )
                          // );
                        }}
                      >
                        Processing{" "}
                        <span>
                          (
                          {allOrders?.reduce(
                            (item, i) =>
                              item +
                              (i?.payment?.status === orderStatus.Processing
                                ? 1
                                : 0),
                            0
                          )}
                          )
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={() => {
                          HandleStat(orderStatus.PendingPayment)
                          // onSetOrders(
                          //   "pending-payments",
                          //   allOrders?.filter(
                          //     (order: any) =>
                          //       order.payment.status ===
                          //       orderStatus.PendingPayment
                          //   )
                          // );
                        }}
                      >
                        Pending payments{" "}
                        <span>
                          (
                          {allOrders?.reduce(
                            (item, i) =>
                              item +
                              (i?.payment?.status === orderStatus.PendingPayment
                                ? 1
                                : 0),
                            0
                          )}
                          )
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={() => {
                          HandleStat(orderStatus.OnHold)
                          refetch();
                          // onSetOrders(
                          //   "on-hold",
                          //   allOrders?.filter(
                          //     (order: any) =>
                          //       order.payment.status === orderStatus.OnHold
                          //   )
                          // );
                        }}
                      >
                        On hold{" "}
                        <span>
                          ({" "}
                          {allOrders?.reduce(
                            (item, i) =>
                              item +
                              (i?.payment?.status === orderStatus.OnHold
                                ? 1
                                : 0),
                            0
                          )}
                          )
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={() => {
                          HandleStat(orderStatus.Completed)
                          refetch();
                          // onSetOrders(
                          //   "completed",
                          //   allOrders?.filter(
                          //     (order: any) =>
                          //       order.payment.status === orderStatus.Completed
                          //   )
                          // );
                        }}
                      >
                        Completed{" "}
                        <span>
                          ({" "}
                          {allOrders?.reduce(
                            (item, i) =>
                              item +
                              (i?.payment?.status === orderStatus.Completed
                                ? 1
                                : 0),
                            0
                          )}
                          )
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={() => {
                          HandleStat(orderStatus.Cancelled)
                          refetch();
                          // onSetOrders(
                          //   "cancelled",
                          //   allOrders?.filter(
                          //     (order: any) =>
                          //       order.payment.status === orderStatus.Cancelled
                          //   )
                          // );
                        }}
                      >
                        Cancelled{" "}
                        <span>
                          ({" "}
                          {allOrders?.reduce(
                            (item, i) =>
                              item +
                              (i?.payment?.status === orderStatus.Cancelled
                                ? 1
                                : 0),
                            0
                          )}
                          )
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={() => {
                          HandleStat(orderStatus.Refunded)
                          refetch();
                          // onSetOrders(
                          //   "refunded",
                          //   allOrders?.filter(
                          //     (order: any) =>
                          //       order.payment.status === orderStatus.Refunded
                          //   )
                          // );
                        }}
                      >
                        Refunded{" "}
                        <span>
                          ({" "}
                          {allOrders?.reduce(
                            (item, i) =>
                              item +
                              (i?.payment?.status === orderStatus.Refunded
                                ? 1
                                : 0),
                            0
                          )}
                          )
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={() => {
                          HandleStat(orderStatus.Failed)
                          refetch();
                          // onSetOrders(
                          //   "failed",
                          //   allOrders?.filter(
                          //     (order: any) =>
                          //       order.payment.status === orderStatus.Failed
                          //   )
                          // );
                        }}
                      >
                        Failed{" "}
                        <span>
                          ({" "}
                          {allOrders?.reduce(
                            (item, i) =>
                              item +
                              (i?.payment?.status === orderStatus.Failed
                                ? 1
                                : 0),
                            0
                          )}
                          ){" "}
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={() => {
                          HandleStat(orderStatus.Delivered)
                          refetch();
                          
                          // onSetOrders(
                          //   "delivered",
                          //   allOrders?.filter(
                          //     (order: any) =>
                          //       order.payment.status === orderStatus.Delivered
                          //   )
                          // );
                        }}
                      >
                        Delivered{" "}
                        <span>
                          ({" "}
                          {allOrders?.reduce(
                            (item, i) =>
                              item +
                              (i?.payment?.status === orderStatus.Delivered
                                ? 1
                                : 0),
                            0
                          )}
                          )
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={() => {
                          setDell(true)
                          refetch()
                          // onSetOrders(
                          //   "bin",
                          //   allOrders?.filter(
                          //     (order: any) => order.isDeleted === true
                          //   )
                          // );
                        }}
                      >
                        Bin{" "}
                        <span>
                          ({" "}
                          {allOrders?.reduce(
                            (item, i) => item + (i?.isDeleted === true ? 1 : 0),
                            0
                          )}
                          )
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>
                {/* <div className={styles.searchlistproduct}>
                  <div className={styles.box}>
                    <input type="text" placeholder="Search Order" />
                    <button>
                      <Image
                        src="/icons/search-line.svg"
                        alt="search"
                        width={24}
                        height={24}
                      />
                    </button>
                  </div>
                </div> */}
              </div>

              <div className={styles.paymentsectionbulk}>
                <div className={styles.actionbtnlistSecond}>
                  <ul>
                    <li>
                      <p>Payment Method</p>
                      <select
                        value={filterPayment}
                        onChange={(e) => onFilterPayment(e.target.value)}
                      >
                        <option value="">All</option>
                        <option value="stripe">Stripe</option>
                        <option value="klarna">Klarna</option>
                        <option value="cash-on-delivery">
                          Cash on Delivery
                        </option>
                      </select>
                    </li>

                    {selectedAction !== "bin" && (
                      <React.Fragment>
                        <li>
                          <p>Bulk Action</p>
                          <select
                            value={action}
                            onChange={(e) => {
                              setAction(e.target.value);
                              onChangeHistory("newHistory", e.target.value);
                            }}
                          >
                            <option value="">Select Any Action</option>
                            <option value={orderStatus.Delivered}>
                              Change status to Delivered
                            </option>
                            <option value={orderStatus.Failed}>
                              Change status to Failed
                            </option>
                            {/* <option value="print-invoice">Print Invoice</option>
                          <option value="print-delivery-note">
                            Print Delivery Note
                          </option>
                          <option value="print-receipt">Print Receipt</option> */}
                            <option value={orderStatus.Processing}>
                              Change status to Processing
                            </option>
                            <option value={orderStatus.OnHold}>
                              Change status to On-Hold
                            </option>
                            <option value={orderStatus.Completed}>
                              Change status to Completed
                            </option>
                            <option value={orderStatus.Cancelled}>
                              Change status to Cancelled
                            </option>
                            <option value={orderStatus.Refunded}>
                              Change status to Refund
                            </option>
                            <option value={"PRINT_INVOICE"}>
                              Print Invoice
                            </option>
                            <option value={orderStatus.MoveToBin}>
                              Move To Bin
                            </option>

                            {/* <option value="export-to-CSV">Export to CSV</option> */}
                            {/* <option value="one">Klarna</option>
                    <option value="one">Amazon Pay</option> */}
                          </select>
                        </li>
                        {action !== "" && (
                          <li className={styles.applyBtn}>
                            <button onClick={handleBulkAction}>
                              {action === "PRINT_INVOICE" ? "Print" : "Apply"}
                            </button>
                          </li>
                        )}
                      </React.Fragment>
                    )}
                  </ul>
                </div>
                {/* <div className={styles.searchlistproduct}>
                  <div className={styles.box}>
                    <input type="text" placeholder="Search Order" />
                    <button>
                      <Image
                        src="/icons/search-line.svg"
                        alt="search"
                        width={24}
                        height={24}
                      />
                    </button>
                  </div>
                </div> */}
              </div>

              <div className={styles.table}>
                <table>
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th>ORDER</th>
                      <th>DATE</th>
                      <th>CUSTOMER</th>
                      <th>TOTAL</th>
                      <th>STATUS</th>
                      <th>Billing</th>
                      <th>Notes</th>
                      {/* <th>LOCATION</th> */}
                      {/* <th>PAYMENT TYPE</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {/* @ts-ignore */}
                    {filterArrary?.map((order, i) => {
                      const status = order.payment?.status as string;
                      return (
                        <OrderList
                          order={order}
                          key={order?._id}
                          checked={selected.includes(order?._id)}
                          onChecked={(id: string) => handleSelect(id, status)}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className={styles.mainheading}>
                <Button
                  // ref={ref}
                  onClick={() =>{ fetchNextPage()}}
                  disabled={!hasNextPage || isFetchingNextPage}
                >
                  {isFetchingNextPage
                    ? "Loading more..."
                    : hasNextPage
                    ? "Load Newer"
                    : "Nothing more to load"}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <div>
        {selectedOrdersPrintInvoice?.map((order: any) => (
          <Invoice data={order} key={order?._id} />
        ))}
      </div>
    </>
  );
}

export default AllOrderPage;

{
  /* <ul className="dropnav">
                  <li>
                    <Link href="#">
                      <a>
                        <span>Settings</span>
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <a>
                        <span>Sign Out</span>
                      </a>
                    </Link>
                  </li>
                </ul> */
}

// m(
//   { _id: historyStatus.id },
//   {
//     status: `Order status change from ${historyStatus.status} to ${historyStatus.newHistory} by simple`,
//   }
// );
// const historyData = await UpdateOrderHistoryById(historyStatus.id, {
//   status: `Order status change from ${historyStatus.status} to ${historyStatus.newHistory} by simple`,
// });

// m()
