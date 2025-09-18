"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { paypalService } from "@/lib/services/paypalService";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface PayPalWebhookHandlerProps {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export default function PayPalWebhookHandler({
  onSuccess,
  onError,
}: PayPalWebhookHandlerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "cancelled"
  >("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handlePayPalCallback = async () => {
      const paymentId = searchParams.get("paymentId");
      const token = searchParams.get("token");
      const payerId = searchParams.get("PayerID");
      const paymentStatus = searchParams.get("payment");

      // Handle cancelled payment
      if (paymentStatus === "cancelled") {
        setStatus("cancelled");
        setMessage("Payment was cancelled by user");
        return;
      }

      // Handle successful payment
      if (paymentStatus === "success" && paymentId && token && payerId) {
        try {
          // Capture the PayPal order
          const result = await paypalService.captureOrder(paymentId);

          if (result.success) {
            setStatus("success");
            setMessage("Payment completed successfully!");

            if (onSuccess) {
              onSuccess({ paymentId, token, payerId });
            }

            // Redirect to dashboard after 3 seconds
            setTimeout(() => {
              router.push("/dashboard?payment=completed");
            }, 3000);
          } else {
            setStatus("error");
            setMessage(result.error || "Failed to capture payment");

            if (onError) {
              onError(result.error || "Failed to capture payment");
            }
          }
        } catch (error) {
          setStatus("error");
          setMessage("An error occurred while processing your payment");

          if (onError) {
            onError("An error occurred while processing your payment");
          }
        }
      } else {
        setStatus("error");
        setMessage("Invalid payment parameters");

        if (onError) {
          onError("Invalid payment parameters");
        }
      }
    };

    handlePayPalCallback();
  }, [searchParams, router, onSuccess, onError]);

  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />;
      case "success":
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case "error":
        return <XCircle className="w-16 h-16 text-red-500" />;
      case "cancelled":
        return <AlertCircle className="w-16 h-16 text-yellow-500" />;
      default:
        return <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "cancelled":
        return "text-yellow-600";
      default:
        return "text-blue-600";
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case "loading":
        return "Processing Payment...";
      case "success":
        return "Payment Successful!";
      case "error":
        return "Payment Failed";
      case "cancelled":
        return "Payment Cancelled";
      default:
        return "Processing...";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">{getStatusIcon()}</div>

        <h2 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
          {getStatusTitle()}
        </h2>

        <p className="text-gray-600 mb-6">{message}</p>

        {status === "loading" && (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                Please wait while we process your PayPal payment...
              </p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-700">
                Your payment has been processed successfully. You will be
                redirected to your dashboard shortly.
              </p>
            </div>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-red-700">
                There was an error processing your payment. Please try again or
                contact support.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => router.push("/dashboard?payment=retry")}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {status === "cancelled" && (
          <div className="space-y-4">
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-yellow-700">
                Your payment was cancelled. You can try again anytime.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => router.push("/dashboard?payment=retry")}
                className="flex-1 bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
