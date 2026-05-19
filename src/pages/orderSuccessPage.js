import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { resetCartAsync } from '../features/cart/cartSlice';
import { useDispatch } from 'react-redux';
import { resetOrder } from '../features/order/OrderSlice';

function OrderSuccessPage() {
  const params = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetCartAsync());
    dispatch(resetOrder());
  }, [dispatch]);

  if (!params.id) return <Navigate to="/" replace={true} />;

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-sm sm:text-base font-semibold text-indigo-600">
          Order Successfully Placed
        </p>

        <h1 className="mt-4 text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 break-all sm:break-normal">
          Order Number  <br /> #{params.id}
        </h1>

        <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-500">
          You can check your order in <span className="font-semibold text-gray-700">My Orders</span>
          .
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            to="/"
            className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm sm:text-base font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            Go back home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default OrderSuccessPage;
