import { validateCoupon } from './couponAPI';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  coupon: null,
  discount: 0,
  finalAmount: 0,
  status: 'idle',
  error: null,
};

export const validateCouponAsync = createAsyncThunk(
  'coupon/validateCoupon',
  async ({ code, totalAmount }) => {
    const response = await validateCoupon({ code, totalAmount });
    return response.data;
  }
);

const couponSlice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    clearCoupon(state) {
      state.coupon = null;
      state.discount = 0;
      state.finalAmount = 0;
      state.error = null;
      state.status = 'idle';
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(validateCouponAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(validateCouponAsync.fulfilled, (state, action) => {
        state.status = 'idle';

        console.log('actionPayload coupon', action.payload);
        if (action.payload.success) {
          state.coupon = true;
          state.discount = action.payload.discount;
          state.finalAmount = action.payload.finalAmount;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(validateCouponAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.coupon = null;
        state.discount = 0;
        state.finalAmount = 0;
      });
  },
});

export const { clearCoupon } = couponSlice.actions;
export default couponSlice.reducer;
