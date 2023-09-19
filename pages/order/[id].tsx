/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from 'styles/order.module.scss';
import DashboardHeader from 'layout/header';
import dynamic from 'next/dynamic';
import { useFetchOrderById, useGetMyself } from 'network-requests/queries';
import { format } from 'date-fns';
import {
  useSendOrderDetails,
  useStripeRefund,
  useUpdateOrder,
  useUpdateOrderHistory,
  useUpdateOrderStatus,
} from 'network-requests/mutations';
import { useSocket } from 'hooks/useSocket';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Invoice from 'components/Invoice';
import Button from 'components/element/button';
import { useImmer } from 'use-immer';
import Input from 'components/element/input';
import paymentOptions from 'constants/payment-status';
import moment from 'moment';
import ModelView from 'components/model';
import CloseIcon from 'icons/close';
import OtherAdmin from 'components/order/other-admin';
import SideContent from 'components/order/side-content';
import Loading from 'components/loading';
import Notes from 'components/order/notes';
import StaffNotes from 'components/order/staffnotes';

const ProductDetails = dynamic(
  () => import('components/order/product-details'),
  {
    ssr: false,
  }
);
const ItemSubtotal = dynamic(() => import('components/order/item-subtotal'), {
  ssr: false,
});

function SingleOrderPreview() {
  const router = useRouter();
  const socket = useSocket();
  const { id } = router.query;
  const { data: _data } = useGetMyself();

  const [refundModel, setRefundModel] = useState(false);

  const onRefundModel = React.useCallback((value: boolean) => {
    setRefundModel(value);
  }, []);

  const { data, isLoading, refetch } = useFetchOrderById(id as string);
  const { mutate } = useUpdateOrderStatus(id as string);
  const { mutateAsync } = useUpdateOrder(router.query?.id as string);

  const { mutate: sendEmailInvoce } = useSendOrderDetails();
  const { mutateAsync: historyMutate } = useUpdateOrderHistory();

  const [orderDate, setOrderDate] = React.useState('');
  const [paymentStatus, setPaymentStatus] = React.useState('');
  const [edit, setEdit] = React.useState('');

  const [billingEdit, setBillingEdit] = React.useState({
    address: '',
    townCity: '',
    postalCode: '',
    country: '',
    companyName: '',
  });

  const [userEdit, setUserEdit] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  console.log(data?.extraDelivery?.price, 'extra deliver');

  const { mutateAsync: stripeRefundMutate } = useStripeRefund();

  const [refundState, setRefundState] = useImmer({
    reason: '',
    partial_amount: 0,
  });

  type RefundKey = keyof typeof refundState;

  const onRefundStateChange = React.useCallback(
    (key: RefundKey, value: any) => {
      setRefundState((draft) => {
        // @ts-expect-error
        draft[key] = value;
      });
    },
    [setRefundState]
  );

  console.log(data);
  // STRIPE REFUND HANDLER
  const onRefundWhenStripe = React.useCallback(async () => {
    const paymentMethod = data?.payment?.paymentMethod;
    if (window.confirm('Are you sure to refund against this order?')) {
      switch (paymentMethod) {
        case 'stripe':
          {
            if (
              data?.stripeSession?.amount_total &&
              data?.stripeSession?.payment_intent
            ) {
              const refundData = {
                orderId: data._id && data._id,
                amount_total: data?.stripeSession?.amount_total as number,
                refunded_amount: data?.stripeSession?.refunded_amount as number,
                partial_amount: refundState?.partial_amount * 100,
                payment_intent: data?.stripeSession?.payment_intent as string,
                reason: refundState.reason,
              };
              console.log({ refundData });
              await stripeRefundMutate(refundData, {
                onSuccess: () => {
                  alert('Your order refunded successfully');
                  onRefundModel(false);
                },
              });
            }
          }
          console.log('STRIPE');
          break;

        case 'klarna':
          console.log('KLARNA');
          break;
        default:
          break;
      }
    }
  }, [
    data?.payment?.paymentMethod,
    data?.stripeSession?.amount_total,
    data?.stripeSession?.payment_intent,
    data?.stripeSession?.refunded_amount,
    data?._id,
    refundState?.partial_amount,
    refundState.reason,
    stripeRefundMutate,
    onRefundModel,
  ]);

  const handleUserChange = (e: any) => {
    const { name, value } = e.target;
    const updatedUser = { ...userEdit, [name]: value };
    setUserEdit(updatedUser);
  };

  const handleBillingChange = (e: any) => {
    const { name, value } = e.target;
    const updatedBilling = { ...billingEdit, [name]: value };
    setBillingEdit(updatedBilling);
  };

  const updateOrder = React.useCallback(async () => {
    const billing = `Order Billing change by ${_data?.name} At ${moment(
      new Date()
    ).format(`DD-MMM-YYYY hh:mm:ss`)}`;
    await mutateAsync(
      {
        ...data,
        shippingAddress: billingEdit,
        user: userEdit,
      },
      {
        onSuccess: () => {
          toast.success('Order updated successfully');
          refetch();
          setEdit('');
        },
      }
    );
    await historyMutate({
      _id: router.query?.id,
      payload: {
        billing,
      },
    });
  }, [
    _data?.name,
    billingEdit,
    data,
    historyMutate,
    mutateAsync,
    refetch,
    router.query.id,
    userEdit,
  ]);

  const handleEmailSend = () => {
    sendEmailInvoce(
      {
        email: data?.user.email,
        message: data?._id,
      },
      {
        onSuccess: () => {
          toast.success('Email sent successfully');
        },
      }
    );
  };
  const handleOrderStatus = (e: any) => {
    mutate({ status: e.target.value });
    setPaymentStatus(e.target.value);
    toast.success('Order status updated successfully');
  };

  // const handleInvoicePrint = () => {
  //   router.push("/invoice/" + id);
  // };

  React.useEffect(() => {
    if (data) {
      setPaymentStatus(data?.payment?.status as string);
      setBillingEdit(data?.shippingAddress as any);
      setUserEdit(data?.user as any);
      setOrderDate(
        format(new Date(data?.createdAt as any), "yyyy-MM-dd'T'HH:mm:ss")
      );
    }
  }, [data]);

  // SOCKET
  const [accessible, setAccessible] = React.useState(false);
  const [socketLoading, setSocketLoading] = React.useState(false);
  const [name, setName] = React.useState('');
  console.log(data);
  React.useEffect(() => {
    if (socket) {
      if (id && _data?.name) {
        setSocketLoading(true);
        socket.emit('active-order', id as string, _data?.name);
      }
      socket.on('is-order-accessible', ({ access, name }) => {
        setAccessible(access);
        setSocketLoading(false);
        setName(name);
      });
    }
    return () => {
      if (socket) {
        socket.off('is-order-accessible');
        socket.emit('inactive-order', id as string);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, socket, _data?.name]);
  // console.log(data?.stripeSession?.amount_total / 100);

  const loadStates = React.useMemo(() => {
    return {
      whenLoading: isLoading || socketLoading,
      whenNoOrder: !data,
      whenOtherAdmin: !accessible,
      whenLoaded: !(isLoading || socketLoading) && data && accessible,
    };
  }, [accessible, data, isLoading, socketLoading]);

  const Component = React.useMemo(() => {
    if (loadStates.whenLoading) return <Loading />;
    if (loadStates.whenNoOrder)
      return (
        <div>
          <h2>No order found</h2>
        </div>
      );
    if (loadStates.whenOtherAdmin) {
      return <OtherAdmin />;
    }
  }, [
    loadStates.whenLoading,
    loadStates.whenNoOrder,
    loadStates.whenOtherAdmin,
  ]);
  const statusHistory = data?.history?.filter((_) => _.status);
  const billingHistory = data?.history?.filter((_) => _.billing);

  // console.log(data?.stripeSession.refunded_amount);
  return (
    <>
      <ModelView
        show={refundModel}
        style={{
          maxWidth: '400px',
        }}
        className={styles['model-refund']}
      >
        <div className={styles['model-container']}>
          <h3>Refund Payment</h3>
          <span
            onClick={() => onRefundModel(false)}
            className={styles['close-button']}
          >
            <CloseIcon />
          </span>
        </div>
        <div className={styles['table']}>
          <div className={styles['table-list']}>
            <ul>
              <li>Amount already refunded:</li>
              <li>
                £
                {data?.stripeSession?.refunded_amount &&
                  (data?.stripeSession?.refunded_amount / 100).toFixed(2)}
              </li>
            </ul>
            <ul>
              <li>Total available to refund:</li>
              <li>
                {' '}
                £
                {data?.stripeSession?.amount_total &&
                  (data?.stripeSession?.amount_total / 100).toFixed(2)}
              </li>
            </ul>
          </div>
        </div>

        <div className={styles['inputs']}>
          <Input
            min={0}
            value={refundState.partial_amount}
            type="number"
            label={'Refund partial_amount:'}
            max={data?.stripeSession?.amount_total}
            onChange={({ target }) => {
              if (data?.stripeSession?.amount_total) {
                if (
                  Number(target.value) <=
                  data?.stripeSession?.amount_total / 100
                ) {
                  onRefundStateChange('partial_amount', Number(target.value));
                }
              }
            }}
          />
          <Input
            type="text"
            label={'Reason for refund (optional): '}
            onChange={({ target }) =>
              onRefundStateChange('reason', target.value)
            }
          />
        </div>

        <div className={styles['action-button']}>
          <div />
          <div className={styles['btn']}>
            <Button onClick={() => onRefundModel(false)}>Cancle</Button>
            <Button onClick={onRefundWhenStripe}>Refund</Button>
          </div>
        </div>
      </ModelView>

      <ToastContainer />
      <div className={styles.rightsidebar} id="orderMain">
        <DashboardHeader />
        {!loadStates.whenLoaded ? (
          Component
        ) : (
          <main className={styles.main}>
            <div className={styles.containerbox}>
              <div
                className={styles.containerbox1}
                style={{
                  display: 'flex',
                  gap: '.5rem',
                  flex: '1',
                }}
              >
                <div className={styles.devide}>
                  <div className={styles.mainheading}>
                    <h1>Orders No #{data?.orderId?.toString()}</h1>
                    <p>
                      Payment via {data?.payment?.paymentMethod}. Customer IP:
                      <span> 92.40.196.240</span>
                    </p>
                    <p>
                      <span>
                        Last Modified By: {data?.lastModifiedBy?.name} at{' '}
                        {moment(data?.updatedAt).format('DD MMM YY - hh:mm A')}
                      </span>
                    </p>
                    <div className={styles.orderdetails}>
                      <div className={styles.col}>
                        <div className={styles.box}>
                          <div className={styles.wdheading}>General</div>
                          <span>
                            <label>Date Created</label>
                            <input
                              type="datetime-local"
                              id="date-time"
                              name="date-time"
                              value={orderDate}
                              onChange={(e) => setOrderDate(e.target.value)}
                              placeholder="date-time"
                            />
                          </span>
                          <div className={styles.payment_link}>
                            {' '}
                            <label>
                              Status <a href="">Customer payment page →</a>
                            </label>
                          </div>

                          <select
                            name="order_status"
                            className={styles.select_status}
                            value={paymentStatus}
                            onChange={handleOrderStatus}
                            placeholder="Select Status"
                          >
                            {paymentOptions?.map((item) => {
                              return (
                                <option key={item?.value} value={item?.value}>
                                  {item?.label}
                                </option>
                              );
                            })}
                          </select>
                          <span></span>
                        </div>
                      </div>
                      <div className={styles.col}>
                        <div className={styles.box}>
                          <div className={styles.editBtnNew}>
                            <div className={styles.swdheading}>Billing</div>
                            <a
                              onClick={() => setEdit('billing')}
                              className={styles.butn}
                            >
                              Edit{' '}
                            </a>
                          </div>
                          {edit === 'billing' ? (
                            <div className={styles.Billingbox}>
                              <input
                                type="text"
                                value={userEdit?.firstName}
                                onChange={handleUserChange}
                                name="firstName"
                              />
                              <input
                                type="text"
                                value={userEdit?.lastName}
                                onChange={handleUserChange}
                                name="lastName"
                              />
                              <input
                                type="text"
                                value={billingEdit?.companyName}
                                onChange={handleBillingChange}
                                name="companyName"
                              />
                              <input
                                type="text"
                                value={billingEdit?.address}
                                onChange={handleBillingChange}
                                name="address"
                              />
                              <input
                                type="text"
                                value={billingEdit?.townCity}
                                onChange={handleBillingChange}
                                name="townCity"
                              />
                              <input
                                type="text"
                                value={billingEdit?.country}
                                onChange={handleBillingChange}
                                name="country"
                              />
                              <input
                                type="text"
                                value={billingEdit?.postalCode}
                                onChange={handleBillingChange}
                                name="postalCode"
                              />
                              <input
                                type="text"
                                value={userEdit?.email}
                                onChange={handleUserChange}
                                name="email"
                              />
                              <input
                                type="text"
                                value={userEdit?.phone}
                                onChange={handleUserChange}
                                name="phone"
                              />

                              <div
                                className={` ${styles.btnbox}  ${styles.mt_10}  mt-10 d-flex justify-content-between`}
                              >
                                <button
                                  onClick={updateOrder}
                                  className={styles.butn}
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEdit('')}
                                  className={styles.butn}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className={styles.Billingbox}>
                              <span>
                                {data?.user?.firstName} {data?.user?.lastName}
                              </span>
                              <span>
                                {data?.billingAddress?.companyName ||
                                  data?.shippingAddress?.companyName}
                              </span>
                              <span>
                                {data?.billingAddress?.address ||
                                  data?.shippingAddress?.address}
                              </span>
                              <span>
                                {data?.billingAddress?.townCity ||
                                  data?.shippingAddress?.townCity}
                              </span>
                              <span>
                                {data?.billingAddress?.country ||
                                  data?.shippingAddress?.country}
                              </span>
                              <span>
                                {data?.billingAddress?.postalCode ||
                                  data?.shippingAddress?.postalCode}
                              </span>
                              <span>
                                <strong>Email address:</strong>
                              </span>{' '}
                              <span>
                                <a href="mailto:">{data?.user?.email}</a>
                              </span>
                              <span>
                                <strong>Phone:</strong>
                              </span>{' '}
                              <span>
                                <a href="tel:">{data?.user?.phone}</a>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={styles.col}>
                        <div className={styles.box}>
                          <div className="d-flex justify-content-between">
                            <div className={styles.swdheading}>Shipping</div>
                            <a
                              onClick={() => setEdit('shipping')}
                              className={styles.butn}
                            >
                              Edit{' '}
                            </a>
                          </div>

                          {edit === 'shipping' ? (
                            <div className={styles.Billingbox}>
                              <input
                                type="text"
                                value={userEdit?.firstName}
                                onChange={handleUserChange}
                                name="firstName"
                              />
                              <input
                                type="text"
                                value={userEdit?.lastName}
                                onChange={handleUserChange}
                                name="lastName"
                              />
                              <input
                                type="text"
                                value={billingEdit?.companyName}
                                onChange={handleBillingChange}
                                name="companyName"
                              />
                              <input
                                type="text"
                                value={billingEdit?.address}
                                onChange={handleBillingChange}
                                name="address"
                              />
                              <input
                                type="text"
                                value={billingEdit?.townCity}
                                onChange={handleBillingChange}
                                name="townCity"
                              />
                              <input
                                type="text"
                                value={billingEdit?.country}
                                onChange={handleBillingChange}
                                name="country"
                              />
                              <input
                                type="text"
                                value={billingEdit?.postalCode}
                                onChange={handleBillingChange}
                                name="postalCode"
                              />
                              <input
                                type="text"
                                value={userEdit?.email}
                                onChange={handleUserChange}
                                name="email"
                              />
                              <input
                                type="text"
                                value={userEdit?.phone}
                                onChange={handleUserChange}
                                name="phone"
                              />

                              <div
                                className={` ${styles.btnbox}  ${styles.mt_10}  mt-10 d-flex justify-content-between`}
                              >
                                <button
                                  onClick={updateOrder}
                                  className={styles.butn}
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEdit('')}
                                  className={styles.butn}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className={styles.Billingbox}>
                              <span>
                                {data?.user?.firstName} {data?.user?.lastName}
                              </span>
                              <span>{data?.shippingAddress?.companyName}</span>
                              <span>{data?.shippingAddress?.address}</span>
                              <span>{data?.shippingAddress?.townCity}</span>
                              <span>{data?.shippingAddress?.country}</span>
                              <span>{data?.shippingAddress?.postalCode}</span>
                              <span>
                                <strong>Email address:</strong>
                              </span>{' '}
                              <span>
                                <a href="mailto:">{data?.user?.email}</a>
                              </span>
                              <span>
                                <strong>Phone:</strong>
                              </span>{' '}
                              <span>
                                <a href="tel:">{data?.user?.phone}</a>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Notes notesList={data?.notes} />
                 
                  {data?.orderItems?.map((item, index) => (
                    <ProductDetails
                      data={item}
                      key={index}
                      extraDeliveryname={data?.extraDelivery?.name}
                      extraDeliveryprice={data?.extraDelivery?.price}
                    />
                  ))}

                  <div className={styles.Order_subtotal}>
                    <ItemSubtotal data={data} />
                    <div className={styles.refund_button}>
                      <p>
                        <button
                          type="button"
                          onClick={() => onRefundModel(true)}
                          style={{ display: refundModel ? 'none' : 'block' }}
                        >
                          Refund
                        </button>

                        {/* <span>This order is no longer editable.</span> */}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Side Content */}
                <div className={styles['side-content']}>
                  <SideContent
                    notesList={data?.staffnotes}
                    adminImage={data?.adminImage}
                    user={_data}
                  />
                  <div className={styles.action_parent}>
                    <div className={styles.order_Action}>
                      <h2>Order actions</h2>
                      <div className={styles.action_Select}>
                        <select>
                          <option value={'action'}>Choose an action...</option>
                          <option value={'email'}>
                            Email Invoice / Order Details To Customer
                          </option>
                          {/* <option value={"resend"}>
                          Resend new order notification
                        </option>
                        <option value={"regenerate"}>
                          Regenerate download permissions
                        </option> */}
                        </select>
                      </div>
                      <div className={styles.action_update}>
                        <div className={styles.left_link}>
                          <a href="#">Move to bin</a>
                        </div>
                        <div
                          className={styles.right_update_button}
                          onClick={handleEmailSend}
                        >
                          <button type="button">Send</button>
                        </div>
                      </div>
                    </div>
                    {/* Staff Notes */}
                    <StaffNotes notesList={data?.staffnotes}/>
                    {/* order invoice  */}
                    <div className={styles.order_printing1}>
                      <div className={styles.Order_printing}>
                        <h2>Order Printing</h2>
                      </div>
                      <div className={styles.printing_buttons}>
                        <button onClick={() => window.print()}>
                          Print Invoice
                        </button>
                        <button>Print Delivery Note</button>
                        <span>
                          <button>Print Receipt</button>
                        </span>
                      </div>
                    </div>
                    
                    {/* order History  */}
                    {statusHistory && statusHistory?.length > 0 && (
                      <div className={styles.order_printing1}>
                        <div className={styles.Order_printing}>
                          <h2>Order Status History</h2>
                        </div>
                        {/* statusHistory billingHistory */}
                        <div className={styles.order_notes}>
                          {statusHistory &&
                            statusHistory.map(({ status }, index) => {
                              return (
                                <div key={index}>
                                  <div className={styles.order_notes_container}>
                                    <p>{status}</p>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}
                    {billingHistory && billingHistory.length > 0 && (
                      <div className={styles.order_printing1}>
                        <div className={styles.Order_printing}>
                          <h2>Order Billing History</h2>
                        </div>
                        <div className={styles.order_notes}>
                          {billingHistory &&
                            billingHistory?.map(({ billing }, index) => {
                              return (
                                <div key={index}>
                                  <div className={styles.order_notes_container}>
                                    <p>{billing}</p>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}
      </div>
      <Invoice data={data} />
    </>
  );
}

export default SingleOrderPreview;
