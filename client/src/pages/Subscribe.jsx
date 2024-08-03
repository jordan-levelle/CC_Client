import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../context/AuthContext';  // Adjust the import path as necessary

const USER_URL = process.env.REACT_APP_USERS_URL;

const ProductDisplay = ({ handleCheckout }) => (
  <section className="subscription-section">
      <div className="product">
        <div className="description">
          <h3>Consensus Check Subscription</h3>
          <h5>$20.00 / year</h5>
        </div>
      </div>
      <button className="checkout-button" onClick={handleCheckout}>
        Checkout
      </button>
    </section>
);

const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

export default function Subscribe() {
  const [message, setMessage] = useState("");
  const { dispatch } = useContext(AuthContext);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");

      // Fetch updated user information
      const updateSubscriptionStatus = async () => {
        const token = localStorage.getItem('token');
        
        try {
          const response = await fetch(`${USER_URL}/getUserInfo`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });

          const updatedUser = await response.json();
          console.log('Updated user info:', updatedUser);

          // Dispatch action to update subscription status
          dispatch({ type: 'UPDATE_SUBSCRIPTION_STATUS', payload: updatedUser.subscriptionStatus });
          
          // Update user in local storage
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
          console.error('Error fetching updated user info:', error);
        }
      };

      updateSubscriptionStatus();
    }

    if (query.get("canceled")) {
      setMessage("Order canceled -- continue to shop around and checkout when you're ready.");
    }
  }, [dispatch]);

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    const priceId = process.env.REACT_APP_PRODUCT_ID;

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
