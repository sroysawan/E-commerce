import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { payment } from '../../api/stripe'
import useEcomStore from "../../store/ecom-store";
import CheckoutForm from "../../components/CheckoutForm";


const stripePromise = loadStripe("pk_test_51QDO62GdE4tw3Bx8e6cAYgIEwhIV9wEtSSYh96HznuIlfHPA1BTqdGUva91bDVSEb4DbRiYQeIoZwtcDWqcPIJ5X00yxv7aGF3");

const Payment = () => {
    const token = useEcomStore((state)=> state.token)
    const [clientSecret, setClientSecret] = useState("");

    useEffect(()=>{
        payment(token)
        .then((res)=>{
            console.log(res)
            setClientSecret(res.data.clientSecret)
        })
        .catch((error)=>{
            console.log(error)
        })
    },[])

    const appearance = {
        theme: 'stripe',
      };
      // Enable the skeleton loader UI for optimal loading.
      const loader = 'auto';

  return (
    <div>
      {
        clientSecret && (
            <Elements options={{clientSecret, appearance, loader}} stripe={stripePromise}>
                <CheckoutForm/>
            </Elements>
        )
      }

    </div>
  )
}

export default Payment
