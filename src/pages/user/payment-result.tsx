"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { checkoutApi } from "../../services/checkout-api";
import { ordersApi, type OrderResponse } from "../../services/order-api";
import { useToast } from "../../contexts/ToastContext";
import type { Dispatch, SetStateAction } from "react";
import type { CartItem, PageType } from "../../types";

interface PaymentResultProps {
  setCurrentPage: Dispatch<SetStateAction<PageType>>;
  setCart: (cart: CartItem[]) => void;
  setOrders: (orders: OrderResponse[]) => void;
  setSelectedOrderId: (id: string | null) => void;
}

export default function PaymentResult({
  setCurrentPage,
  setCart,
  setOrders,
  setSelectedOrderId,
}: PaymentResultProps) {
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const toast = useToast();

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const vnpayParams: Record<string, string> = {};
      params.forEach((value, key) => {
        vnpayParams[key] = value;
      });

      if (!vnpayParams["vnp_ResponseCode"]) {
        setStatus("failed");
        setMessage("No payment information found");
        return;
      }

      const result = await checkoutApi.verifyVnpay(vnpayParams);

      if (result.success) {
        setStatus("success");
        setOrderId(result.orderId);
        toast.success("Payment successful!", "Your order has been confirmed");

        setCart([]);
        const updatedOrders = await ordersApi.getMyOrders();
        setOrders(updatedOrders);

        window.history.replaceState({}, "", window.location.pathname + "#/payment-result");

        setTimeout(() => {
          if (result.orderId) {
            setSelectedOrderId(String(result.orderId));
          }
          setCurrentPage("orders");
        }, 3000);
      } else {
        setStatus("failed");
        setOrderId(result.orderId || null);
        setMessage(result.message || "Payment verification failed");
        toast.error("Payment failed", result.message || "Please try again");
      }
    } catch {
      setStatus("failed");
      setMessage("Could not verify payment. Please contact support.");
      toast.error("Verification error", "Could not verify your payment");
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      {status === "loading" && (
        <>
          <Loader2 className="w-16 h-16 text-primary mx-auto animate-spin" />
          <h2 className="text-2xl font-serif font-semibold mt-6 mb-2">
            Verifying Payment...
          </h2>
          <p className="text-muted-foreground">
            Please wait while we confirm your payment with VNPay.
          </p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
          <h2 className="text-2xl font-serif font-semibold mt-6 mb-2">
            Payment Successful!
          </h2>
          <p className="text-muted-foreground mb-2">
            Your order <span className="font-semibold text-primary">#{orderId}</span> has been confirmed.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Redirecting to your orders...
          </p>
          <button
            onClick={() => {
              if (orderId) setSelectedOrderId(String(orderId));
              setCurrentPage("orders");
            }}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            View Order Now
          </button>
        </>
      )}

      {status === "failed" && (
        <>
          <XCircle className="w-16 h-16 text-destructive mx-auto" />
          <h2 className="text-2xl font-serif font-semibold mt-6 mb-2">
            Payment Failed
          </h2>
          <p className="text-muted-foreground mb-2">{message}</p>
          {orderId && (
            <p className="text-sm text-muted-foreground mb-6">
              Order ID: <span className="font-semibold">#{orderId}</span>
            </p>
          )}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setCurrentPage("cart")}
              className="px-6 py-3 border border-border rounded-lg hover:bg-secondary transition-colors font-medium"
            >
              Back to Cart
            </button>
            <button
              onClick={() => setCurrentPage("orders")}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              View Orders
            </button>
          </div>
        </>
      )}
    </div>
  );
}
