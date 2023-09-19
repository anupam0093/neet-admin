import axios from "network-requests/axios";
import { StripeRefundTypes } from "network-requests/types";

export const stripeRefund = (payload: StripeRefundTypes) =>
  axios
    .post("/payment/stripe/refund", payload)
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
