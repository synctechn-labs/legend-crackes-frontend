import apiClient, { executeApi } from './api';

export const couponService = {
  getCoupons: async () => {
    return await executeApi(
      () => apiClient.get('/admin/coupons'),
      () => [
        {
          id: 1,
          code: 'DIWALI5',
          discountPercentage: 5.0,
          discount_percentage: 5.0,
          description: 'Festive 5% Off Discount Coupon',
          minOrderAmount: 0,
          min_order_amount: 0,
          isActive: true,
          is_active: true,
          usageCount: 14,
          usage_count: 14,
          created_at: new Date().toISOString()
        }
      ]
    );
  },

  createCoupon: async (couponData) => {
    return await executeApi(
      () => apiClient.post('/admin/coupons', couponData),
      () => ({ id: Date.now(), ...couponData, usageCount: 0, isActive: true })
    );
  },

  updateCoupon: async (couponId, couponData) => {
    return await executeApi(
      () => apiClient.put(`/admin/coupons/${couponId}`, couponData),
      () => ({ id: couponId, ...couponData })
    );
  },

  toggleCoupon: async (couponId) => {
    return await executeApi(
      () => apiClient.patch(`/admin/coupons/${couponId}/toggle`),
      () => null
    );
  },

  deleteCoupon: async (couponId) => {
    return await executeApi(
      () => apiClient.delete(`/admin/coupons/${couponId}`),
      () => ({ success: true })
    );
  },

  validateCoupon: async (code, subtotal = 0) => {
    const cleanCode = (code || '').trim().toUpperCase();
    return await executeApi(
      () => apiClient.post('/coupons/validate', { code: cleanCode, subtotal }),
      () => {
        if (cleanCode === 'DIWALI5') {
          const discountAmt = Math.round(subtotal * 0.05);
          return {
            valid: true,
            code: 'DIWALI5',
            discountPercentage: 5.0,
            discountAmount: discountAmt,
            discount_amount: discountAmt,
            message: `Success! 5% discount coupon 'DIWALI5' applied (Saved ₹${discountAmt}).`
          };
        }
        return {
          valid: false,
          code: cleanCode,
          discountPercentage: 0,
          discountAmount: 0,
          message: `Invalid or expired coupon code '${cleanCode}'.`
        };
      }
    );
  },

  getCouponOrders: async (couponId) => {
    return await executeApi(
      () => apiClient.get(`/admin/coupons/${couponId}/orders`),
      () => []
    );
  }
};
