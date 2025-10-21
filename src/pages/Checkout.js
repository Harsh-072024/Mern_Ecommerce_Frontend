import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteItemFromCartAsync, selectItems, updateCartAsync } from '../features/cart/cartSlice';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { createOrderAsync, selectCurrentorder } from '../features/order/OrderSlice';
import { selectUserInfo, updateUserAsync } from '../features/user/userSlice';

function Checkout() {
  const [open, setOpen] = useState(true);
  const items = useSelector(selectItems);
  const user = useSelector(selectUserInfo);
  const dispatch = useDispatch();
  const currentorder = useSelector(selectCurrentorder);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentmethod, setPaymentMethod] = useState(null);

  const totalAmount = items.reduce(
    (amount, item) => (item.product.discountPrice) * item.quantity + amount,
    0
  );
  const totalItems = items.reduce((total, item) => item.quantity + total, 0);
  const handleQuantity = (e, item) => {
    dispatch(updateCartAsync({ id: item.id, quantity: +e.target.value }));
  };

  const handleRemove = (e, id) => {
    dispatch(deleteItemFromCartAsync(id));
  };

  const handleAddress = (e) => {
    setSelectedAddress(user.addresses[e.target.value]);
  };
  const handlePayment = (e) => {
    setPaymentMethod(e.target.value);
  };
  const handleOrder = (e) => {
    if (selectedAddress && paymentmethod) {
      const order = {
        items,
        user: user.id,
        totalAmount,
        totalItems,
        paymentmethod,
        selectedAddress,
        status: 'pending', //other status can be delivered , recieved
      };
      dispatch(createOrderAsync(order));
      // need  to redirect from here to a new success page
    } else {
      alert('Enter Address and paymentMethods');
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  return (
    <>
      {!items.length && <Navigate to="/" replace={true}></Navigate>}
      {currentorder && currentorder.paymentmethod === 'cash' &&(
        <Navigate to={`/order-success/${currentorder.id}`} replace={true}></Navigate>
      )}
      {currentorder && currentorder.paymentmethod === 'card' &&(
        <Navigate to={`/razorpay-checkout/`} replace={true}></Navigate>
      )}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <form
              className=" bg-white py-5 px-5 mt-12"
              noValidate
              onSubmit={handleSubmit((data) => {
                dispatch(updateUserAsync({ ...user, addresses: [...user.addresses, data] }));
                reset();
              })}
            >
              <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                  <h2 className="text-2xl  font-semibold text-gray-900">Personal Information</h2>
                  <p className="mt-1 text-sm/6 text-gray-600">
                    Use a permanent address where you can receive mail.
                  </p>

                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                        Full name
                      </label>
                      <div className="mt-2">
                        <input
                          id="name"
                          type="text"
                          {...register('name', { required: 'name is required' })}
                          autoComplete="given-name"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 
                                  outline outline-1 outline-gray-300 
                                  focus:outline-2 focus:outline-indigo-600 focus:outline-offset-2 
                                  placeholder:text-gray-400 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                        Email address
                      </label>
                      <div className="mt-2">
                        <input
                          id="email"
                          type="email"
                          {...register('email', { required: 'email is required' })}
                          autoComplete="email"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 
                                  outline outline-1 outline-gray-300 
                                  focus:outline-2 focus:outline-indigo-600 focus:outline-offset-2 
                                  placeholder:text-gray-400 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-900">
                        Phone
                      </label>
                      <div className="mt-2 relative">
                        <input
                          id="phone"
                          type="tel"
                          {...register('phone', { required: 'phone is required' })}
                          autoComplete="phone"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 
                                  outline outline-1 outline-gray-300 
                                  focus:outline-2 focus:outline-indigo-600 focus:outline-offset-2 
                                  placeholder:text-gray-400 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label
                        htmlFor="street-address"
                        className="block text-sm/6 font-medium text-gray-900"
                      >
                        Street address
                      </label>
                      <div className="mt-2">
                        <input
                          id="street-address"
                          type="text"
                          {...register('street', { required: 'street is required' })}
                          autoComplete="street-address"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 
                                  outline outline-1 outline-gray-300 
                                  focus:outline-2 focus:outline-indigo-600 focus:outline-offset-2 
                                  placeholder:text-gray-400 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2 sm:col-start-1">
                      <label htmlFor="city" className="block text-sm/6 font-medium text-gray-900">
                        City
                      </label>
                      <div className="mt-2">
                        <input
                          id="city"
                          type="text"
                          {...register('city', { required: 'city is required' })}
                          autoComplete="address-level2"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 
                                outline outline-1 outline-gray-300 
                                focus:outline-2 focus:outline-indigo-600 focus:outline-offset-2 
                                placeholder:text-gray-400 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="state" className="block text-sm/6 font-medium text-gray-900">
                        State / Province
                      </label>
                      <div className="mt-2">
                        <input
                          id="state"
                          type="text"
                          {...register('state', { required: 'state is required' })}
                          autoComplete="address-level1"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 
                                outline outline-1 outline-gray-300 
                                focus:outline-2 focus:outline-indigo-600 focus:outline-offset-2 
                                placeholder:text-gray-400 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="pinCode"
                        className="block text-sm/6 font-medium text-gray-900"
                      >
                        ZIP / Postal code
                      </label>
                      <div className="mt-2">
                        <input
                          id="pinCode"
                          type="text"
                          {...register('pinCode', { required: 'pinCode is required' })}
                          autoComplete="postal-code"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 
                                 outline outline-1 outline-gray-300 
                                 focus:outline-2 focus:outline-indigo-600 focus:outline-offset-2 
                                 placeholder:text-gray-400 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                  <button type="button" className="text-sm/6 font-semibold text-gray-900">
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Add Address
                  </button>
                </div>

                <div className="border-b border-gray-900/10 pb-12">
                  <h2 className="text-base/7 font-semibold text-gray-900">Addresses</h2>
                  <p className="mt-1 text-sm/6 text-gray-600">Choose from existing addresses</p>
                  <ul role="list">
                    {user.addresses.map((address, index) => (
                      <li
                        key={index}
                        className="flex justify-between gap-x-6 py-5 border-solid border-2 border-gray-200 px-5"
                      >
                        <div className="flex  gap-x-4">
                          <input
                            name="address"
                            type="radio"
                            value={index}
                            checked={selectedAddress === address}
                            onChange={handleAddress}
                            className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                          />
                          <div className="min-w-0 flex-auto">
                            <p className="text-sm/6 font-semibold text-gray-900">{address.name}</p>
                            <p className="mt-1 truncate text-xs/5 text-gray-500">
                              {address.street}
                            </p>
                            <p className="mt-1 truncate text-xs/5 text-gray-500">
                              {address.pinCode}
                            </p>
                          </div>
                        </div>
                        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                          <p className="text-sm/6 text-gray-900">Phone: {address.phone}</p>
                          <p className="text-sm/6 text-gray-900">{address.city}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10 space-y-10">
                    <fieldset>
                      <legend className="text-sm/6 font-semibold text-gray-900">
                        Payment Methods
                      </legend>
                      <p className="mt-1 text-sm/6 text-gray-600">Choose One</p>
                      <div className="mt-6 space-y-6">
                        <div className="flex items-center gap-x-3">
                          <input
                            id="cash"
                            type="radio"
                            name="payments"
                            value="cash"
                            onChange={handlePayment}
                            checked={paymentmethod === 'cash'}
                            className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                          />
                          <label
                            htmlFor="cash"
                            className="block text-sm/6 font-medium text-gray-900"
                          >
                            Cash
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <input
                            id="card"
                            type="radio"
                            name="payments"
                            value="card"
                            onChange={handlePayment}
                            checked={paymentmethod === 'card'}
                            className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                          />
                          <label
                            htmlFor="card"
                            className="block text-sm/6 font-medium text-gray-900"
                          >
                            Card Payment
                          </label>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="lg:col-span-2">
            <div className="mx-auto bg-white mt-12 max-w-7xl px-2 sm:px-2 lg:px-4">
              <div className="border-t border-gray-200 px-4 py-6 sm:px-0">
                <h1 className="text-4xl my-5 font-bold tracking-tight text-gray-900">Cart</h1>
                <div className="flow-root">
                  <ul role="list" className="-my-6 divide-y divide-gray-200">
                    {items.map((item) => (
                      <li key={item.id} className="flex py-6">
                        <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            alt={item.product.title}
                            src={item.product.thumbnail}
                            className="size-full object-cover"
                          />
                        </div>

                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>
                                <a href={item.product.id}>{item.product.title}</a>
                              </h3>
                              <p className="ml-4">${item.product.discountPrice}</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">{item.color}</p>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-sm">
                            <div className="text-gray-500">
                              <label
                                htmlFor="quantity"
                                className="inline mr-5 text-sm font-medium leading-6 text-gray-900"
                              >
                                Qty
                              </label>
                              <select
                                onChange={(e) => handleQuantity(e, item)}
                                value={item.quantity}
                              >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                              </select>
                            </div>

                            <div className="flex">
                              <button
                                onClick={(e) => handleRemove(e, item.id)}
                                type="button"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-200 px-4 py-6 sm:px-2">
                <div className="flex justify-between text-base font-medium text-gray-900 my-2">
                  <p>Subtotal</p>
                  <p>$ {Math.round(totalAmount)}</p>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Total Items in cart</p>
                  <p>{totalItems} items</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">
                  Shipping and taxes calculated at checkout.
                </p>
                <div className="mt-6">
                  <div
                    onClick={handleOrder}
                    className="flex items-center cursor-pointer justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700"
                  >
                    Order Now
                  </div>
                </div>
                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                  <p>
                    or{' '}
                    <Link to="/">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;
