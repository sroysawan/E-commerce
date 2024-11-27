import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import "../stripe.css";
import { saveOrder } from "../api/user";
import useEcomStore from "../store/ecom-store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export default function CheckoutForm() {
  const token = useEcomStore((state) => state.token);
  const clearCart = useEcomStore((state) => state.clearCart)
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const payload = await stripe.confirmPayment({
      elements,
      //   confirmParams: {
      //     // Make sure to change this to your payment completion page
      //     return_url: "http://localhost:3000/complete",
      //   },
      redirect: "if_required",
    });

    console.log("payload", payload);

    if (payload.error) {
      setMessage(payload.error.message);
      console.log("error", payload.error.message);
      toast.error(payload.error.message)
    } else if (payload.paymentIntent.status === "succeeded") {
      //create order and save payload to backend
      saveOrder(token, payload)
        .then((res) => {
          console.log(res);
          clearCart()
          toast.success("ชำระเงินสำเร็จ");
          navigate("/user/history");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      toast.warning('ชำระเงินไม่สำเร็จ')
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <div className="mx-6 mt-4">
      <form
        className="stripe-form space-y-6"
        id="payment-form"
        onSubmit={handleSubmit}
      >
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <button
          className="stripe-button"
          disabled={isLoading || !stripe || !elements}
          id="submit"
        >
          <span id="button-text">
            {isLoading ? (
              <div className="spinner" id="spinner"></div>
            ) : (
              "Pay now"
            )}
          </span>
        </button>
        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </form>
    </div>
  );
}
