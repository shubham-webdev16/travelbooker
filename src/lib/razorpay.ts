declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

export function openRazorpay({
  amount,
  hotelName,
  description,
  onSuccess,
  onDismiss,
}: {
  amount: number;
  hotelName: string;
  description: string;
  onSuccess: (response: RazorpayResponse) => void;
  onDismiss?: () => void;
}) {
  const options: RazorpayOptions = {
    key: "rzp_test_1DP5mmOlF5G5ag", // Razorpay test key
    amount: amount * 100, // amount in paise
    currency: "INR",
    name: "Wanderlust",
    description,
    handler: onSuccess,
    prefill: {
      name: "Guest User",
      email: "guest@wanderlust.com",
      contact: "9876543210",
    },
    theme: {
      color: "#e8553a", // matches our primary
    },
    modal: {
      ondismiss: onDismiss,
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}
