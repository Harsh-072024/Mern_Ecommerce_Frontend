import React, { useEffect } from 'react';
import logo from './logo.svg';
import Home from './pages/Home';
import './App.css';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { createBrowserRouter, RouterProvider } from 'react-router';
import CartPage from './pages/CartPage.js';
import Checkout from './pages/Checkout.js';
import ProductDetailPage from './pages/ProductDetailPage.js';
import Protected from './features/auth/components/Protected.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItemsByUserIdAsync } from './features/cart/cartSlice.js';
import PageNotFound from './pages/404.js';
import OrderSuccessPage from './pages/orderSuccessPage.js';
import UserOrdersPage from './pages/UsersOrdersPage.js';
import UserProfilePage from './pages/userProfilePage.js';
import { fetchLoggedInUserAsync } from './features/user/userSlice.js';
import {
  checkAuthAsync,
  selectLoggedInUser,
  selectUserChecked,
} from './features/auth/authSlice.js';
import Logout from './features/auth/components/Logout.js';
import ForgotPasswordPage from './pages/ForgotPasswordPage.js';
import AdminHome from './pages/AdminHome.js';
import ProtectedAdmin from './features/auth/components/ProtectedAdmin.js';
import AdminProductDetailPage from './pages/AdminProductDetailPage.js';
import AdminProductFormPage from './pages/AdminProductFormPage.js';
import AdminOrdersPage from './pages/AdminOrdersPage.js';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RazorpayCheckout from './pages/RazorpayCheckout.js';
import ResetPasswordPage from './pages/ResetPasswordPage.js';

let router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Protected>
        <Home></Home>
      </Protected>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedAdmin>
        <AdminHome></AdminHome>
      </ProtectedAdmin>
    ),
  },
  {
    path: '/login',
    element: <LoginPage></LoginPage>,
  },
  {
    path: '/signup',
    element: <SignupPage></SignupPage>,
  },
  {
    path: '/cart',
    element: (
      <Protected>
        <CartPage></CartPage>
      </Protected>
    ),
  },
  {
    path: '/checkout',
    element: (
      <Protected>
        <Checkout></Checkout>
      </Protected>
    ),
  },
  {
    path: '/product-details/:id',
    element: (
      <Protected>
        <ProductDetailPage></ProductDetailPage>
      </Protected>
    ),
  },
  {
    path: '/admin/product-details/:id',
    element: (
      <ProtectedAdmin>
        <AdminProductDetailPage></AdminProductDetailPage>
      </ProtectedAdmin>
    ),
  },
  {
    path: '/admin/product-form',
    element: (
      <ProtectedAdmin>
        <AdminProductFormPage></AdminProductFormPage>
      </ProtectedAdmin>
    ),
  },
  {
    path: '/admin/product-form/edit/:id',
    element: (
      <ProtectedAdmin>
        <AdminProductFormPage></AdminProductFormPage>
      </ProtectedAdmin>
    ),
  },
  {
    path: '/admin/orders',
    element: (
      <ProtectedAdmin>
        <AdminOrdersPage></AdminOrdersPage>
      </ProtectedAdmin>
    ),
  },

  {
    path: '*',
    element: <PageNotFound></PageNotFound>,
  },
  {
    path: '/order-success/:id',
    element: <OrderSuccessPage></OrderSuccessPage>,
  },
  {
    path: '/orders',
    element: (
      <Protected>
        <UserOrdersPage></UserOrdersPage>
      </Protected>
      // we will add Page later right now using component directly.
    ),
  },
  {
    path: '/profile',
    element: (
      <Protected>
        <UserProfilePage></UserProfilePage>
      </Protected>
      // we will add Page later right now using component directly.
    ),
  },
  {
    path: '/logout',
    element: (
      <Protected>
        <Logout></Logout>
      </Protected>
      // we will add Page later right now using component directly.
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <ForgotPasswordPage></ForgotPasswordPage>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <ResetPasswordPage></ResetPasswordPage>
    ),
  },
  {
    path: '/razorpay-checkout',
    element: (
      <Protected>
        <RazorpayCheckout></RazorpayCheckout>
      </Protected>
      // we will add Page later right now using component directly.
    ),
  },
]);

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);
  const userChecked = useSelector(selectUserChecked);

  useEffect(() => {
    dispatch(checkAuthAsync());
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(fetchItemsByUserIdAsync());
      //we can get req.user by token on backend so no need to give in frontend
      dispatch(fetchLoggedInUserAsync());
    }
  }, [dispatch, user]);

  return (
    <>
      <div className="App">
        {userChecked && <RouterProvider router={router} />}
        <ToastContainer position="bottom-left" autoClose={5000} theme="dark" />
      </div>
    </>
  );
}

export default App;
