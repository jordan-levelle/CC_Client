import React, { useState } from "react";
import ProductDisplay from "../components/ProductDisplay";
import ProductFeatures from '../components/ProductFeatures';
// import { AuthContext } from "../context/AuthContext";
import { createCheckoutSession } from "../api/stripe";

export default function Subscribe() {
  const [loading, setLoading] = useState(false);
  // const { dispatch } = useContext(AuthContext);

  const handleCheckout = async (sliderValue) => {
    const token = localStorage.getItem("token");

    setLoading(true);

    try {
      // Pass the slider value (amount) to the backend
      const session = await createCheckoutSession(sliderValue, token);
      window.location.href = session.url; // Redirect to Stripe checkout page
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ProductDisplay
        handleCheckout={handleCheckout}
        loading={loading}
      />
      <ProductFeatures />
    </div>
  );
}


