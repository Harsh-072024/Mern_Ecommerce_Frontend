import { BASE_URL } from "../../app/config";

export function validateCoupon({ code, totalAmount }) {
  return new Promise(async (resolve) => {
    const response = await fetch(`${BASE_URL}/coupons/validate`, {
      method: 'POST',
      body: JSON.stringify({ code, totalAmount }),
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
    });
    const data = await response.json();

    resolve({ data });
  });
}
