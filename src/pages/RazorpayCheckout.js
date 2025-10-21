import React, { useEffect } from 'react';

import axios from 'axios';
import { selectCurrentorder } from '../features/order/OrderSlice';
import { useSelector } from 'react-redux';

function RazorpayCheckout() {
  const currentOrder = useSelector(selectCurrentorder);

  const loadRazorpay = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const openRazorpay = async () => {
    const res = await loadRazorpay('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    //1. call backend to create razorpay order
    try {
      const result = await axios.post('/create-order', {
        totalAmount: currentOrder.totalAmount,
      });

      if (!result) {
        alert('Server error. Are you online?');
        return;
      }

      const { amount, id: order_id, currency } = result.data;

      const options = {
        key: 'rzp_test_i3sr9cCCX0IQjM', // Enter the Key ID generated from the Dashboard
        amount: amount.toString(),
        currency: currency,
        name: currentOrder.items[0].product.title || 'My Store',
        description: 'Test Transaction',
        image: currentOrder.items[0].product.thumbnail,
        order_id: order_id,
        handler: async function (response) {
          // console.log('Payment success:', response);

          const data = {
            orderCreationId: order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          const verifyRes = await axios.post('/verify-payment', data);

          if (verifyRes.data.success) {
            window.location.href = `/order-success/${currentOrder.id}`;
          } else {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: 'Soumya Dey',
          email: 'SoumyaDey@example.com',
          contact: '9999999999',
        },
        notes: {
          orderId: currentOrder.id,
          customerName: 'Soumya Dey',
          address: 'Corporate Office',
        },
        theme: {
          color: '#61dafb',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      alert('Something went wrong while starting payment.');
    }
  };

  // Call it automatically when currentOrder is ready
  useEffect(() => {
    if (currentOrder) {
      openRazorpay();
    }
  }, [currentOrder]);

  return null;
}

// no button anymore
//   return (
//     <div>
//       <button
//         onClick={openRazorpay}
//         className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-white font-semibold
//              shadow-md hover:bg-indigo-700 focus:outline-none
//              focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1
//              transition duration-200"
//       >
//         Pay with Razorpay
//       </button>
//     </div>
//   );
// }

export default RazorpayCheckout;
