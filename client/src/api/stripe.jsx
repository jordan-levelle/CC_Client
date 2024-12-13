// src/api/stripeAPI.js

const USER_URL = process.env.REACT_APP_USERS_URL;

// Create a Stripe checkout session
export const createCheckoutSession = async (amount, token) => {
    try {
      const response = await fetch(`${USER_URL}/makePayment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }), // Send the amount chosen by the user
      });
  
      if (!response.ok) {
        throw new Error("Failed to create checkout session.");
      }
  
      return await response.json(); // Returns the session URL
    } catch (error) {
      console.error("Error creating checkout session:", error);
      throw error;
    }
  };


  export const cancelUserSubscription = async (token) => {
    try {
      const response = await fetch(`${USER_URL}/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Failed to cancel subscription');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error.message || 'An error occurred while canceling subscription');
    }
  };
  

// Fetch updated user info after successful subscription
export const fetchUserSubscription = async (token) => {
  try {
    const response = await fetch(`${USER_URL}/getUserInfo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user info.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};
