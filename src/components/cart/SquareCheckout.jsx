import { useState } from "react";
import axios from "axios";
import { PaymentForm, CreditCard } from "react-square-web-payments-sdk";

export default function SquareCheckout({ userId, onSuccess }) {
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const appId = import.meta.env.VITE_SQUARE_APP_ID;
  const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID;

  const handleCardTokenization = async (tokenResult) => {
    if (tokenResult.status !== "OK") {
      setErrorMsg(
        tokenResult.errors?.[0]?.message || "Card tokenization failed."
      );
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const response = await axios.post(`/api/carts/user/${userId}/checkout`, {
        paymentInfo: {
          sourceId: tokenResult.token,
        },
      });

      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Checkout failed. Please ensure backend server is running.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "420px", margin: "0 auto", padding: "1rem" }}>
{/*       <h3 style={{ marginBottom: "1rem", textAlign: "center" }}>
        Payment Details
      </h3> */}

      {errorMsg && (
        <div
          style={{
            color: "#991b1b",
            backgroundColor: "#fee2e2",
            padding: "0.75rem",
            borderRadius: "6px",
            marginBottom: "1rem",
            fontSize: "0.875rem",
          }}
        >
          {errorMsg}
        </div>
      )}

      <PaymentForm
        applicationId={appId}
        locationId={locationId}
        cardTokenizeResponseReceived={handleCardTokenization}
      >
        <CreditCard
          buttonProps={{
            isLoading: loading,
            styled: {
              backgroundColor: "#10b981",
              color: "#ffffff",
              fontSize: "1rem",
              fontWeight: "600",
              borderRadius: "6px",
              padding: "0.75rem",
            },
          }}
        />
      </PaymentForm>
    </div>
  );
}