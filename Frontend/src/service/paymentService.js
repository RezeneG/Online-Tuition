import { config } from "../config";

export const createCheckoutSession = async (courseId, customerEmail) => {
  try {
    const response = await fetch(`${config.apiBaseUrl}/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId,
        customerEmail,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create checkout session");
    }

    const { url } = await response.json();
    return url;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
};
