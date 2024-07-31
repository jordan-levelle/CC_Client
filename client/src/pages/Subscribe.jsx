import React, { useState, useEffect } from "react";
const USER_URL = process.env.REACT_APP_USERS;

const ProductDisplay = ({ handleCheckout }) => (
  <section>
    <div className="product">
      <div className="description">
        <h3>Consensus Check Subscription</h3>
        <h5>$10.00</h5>
      </div>
    </div>
    <button onClick={handleCheckout}>
      Checkout
    </button>
  </section>
);

const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

export default function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, []);

  const handleCheckout = async () => {
    const token = localStorage.getItem('token'); 
    const priceId = process.env.REACT_APP_PRODUCT_ID; 

    console.log('Initiating checkout process');
    console.log('Token:', token);
    console.log('Price ID:', priceId);

    try {
      const response = await fetch(`${USER_URL}/makePayment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify({
          priceId,
        }),
      });

      const session = await response.json();
      console.log('Checkout session received:', session);

      // Redirect to the checkout page
      window.location.href = session.url;
    } catch (error) {
      console.error('Error during checkout process:', error);
    }
  };

  return message ? (
    <Message message={message} />
  ) : (
    <ProductDisplay handleCheckout={handleCheckout} />
  );
}