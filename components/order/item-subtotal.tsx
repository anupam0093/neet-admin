import moment from "moment";
import styles from "styles/order.module.scss";

const ItemSubtotal = ({ data }: any) => {
  const totalPrice = data?.totalPrice;
  const status = data?.payment?.status;
  const isPending = status === "PENDING_PAYMENT";
  const paymentMethod = data?.payment?.paymentMethod;
  console.log("check", { data });
  return (
    <>
      <table className={styles.subtotal_paid}>
        <tbody>
          <tr>
            <td>Items Subtotal:</td>
            <td>
              <strong>
                £
                {data?.extraDelivery?.price > 0
                  ? totalPrice + data?.extraDelivery?.price
                  : totalPrice}
              </strong>
            </td>
          </tr>

          <tr>
            <td>Shipping:</td>
            <td>
              <strong>£0.00</strong>
            </td>
          </tr>

          {data?.discount?.code && (
            <tr>
              <td>Promo Code:</td>
              <td>
                <strong>{data?.discount?.code?.toUpperCase()}</strong>
              </td>
            </tr>
          )}

          {data?.discount?.code && (
            <tr>
              <td>Discount:</td>
              <td>
                <strong>
                  - £
                  {getDiscountAmount(
                    totalPrice || 0,
                    data?.discount?.percent || 0
                  )}
                  {" | "} ({data?.discount?.percent}%)
                </strong>
              </td>
            </tr>
          )}

          <tr>
            <td>Order Total:</td>
            <td>
              <strong>
                £
                {data?.discount?.price > 0
                  ? data?.discount?.price + data?.extraDelivery?.price
                  : data?.extraDelivery?.price > 0
                  ? totalPrice + data?.extraDelivery?.price
                  : totalPrice}
              </strong>
            </td>
          </tr>
          {data?.upfront === 30 ? (
            <>
              <tr>
                <td>
                  <strong>Upfront:</strong>
                </td>
                <td>
                  <strong>
                    £
                    {data?.discount?.price > 0
                      ? data?.discount?.price + data?.extraDelivery?.price
                      : data?.extraDelivery?.price > 0
                      ? data?.upfront + data?.extraDelivery?.price
                      : data?.upfront}
                  </strong>
                </td>
              </tr>
            </>
          ) : (
            <></>
          )}
          {data?.upfront === 30 ? (
            <>
              <tr>
                <td>
                  <strong>Remaining:</strong>
                </td>
                <td>
                  <strong>
                    £
                    {/* need remaining price minus from upfront price and also check if there is any discount price then add otherwise don't add same as extra dilivery */}
                    {data?.discount?.price > 0
                      ? data?.discount?.price + data?.extraDelivery?.price
                      : data?.extraDelivery?.price > 0
                      ? totalPrice - data?.upfront + data?.extraDelivery?.price
                      : totalPrice - data?.upfront}
                  </strong>
                </td>
              </tr>
            </>
          ) : (
            <></>
          )}
          {/* if upfront amount is 30 then dont show the pai table row otherwise show */}
          {data?.upfront === 30 ? (
            <> </>
          ) : (
            <>
              <tr>
                <td>
                  <strong>Paid:</strong>
                </td>
                <td>
                  <strong>
                    £
                    {data?.discount?.price > 0
                      ? data?.discount?.price + data?.extraDelivery?.price
                      : data?.extraDelivery?.price > 0
                      ? totalPrice + data?.extraDelivery?.price
                      : totalPrice}
                  </strong>
                </td>
              </tr>
            </>
          )}

          <tr>
            <span>
              {moment(data?.createdAt).format(`MMMM DD, YYYY`)} via{" "}
              <span style={{ textTransform: "capitalize" }}>
                {paymentMethod} {`${isPending ? "(  Pending Payment)" : ""}`}
              </span>
            </span>
          </tr>
        </tbody>
      </table>

      <table className={styles.total_paid}>
        <tbody></tbody>
      </table>
    </>
  );
};

export default ItemSubtotal;

const getDiscountAmount = (total: number, discountPct: number) => {
  return (total * discountPct) / 100;
};
