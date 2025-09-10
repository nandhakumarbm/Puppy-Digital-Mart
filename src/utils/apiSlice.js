// src/utils/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.puppydigitalmart.com/",
    prepareHeaders: (headers, { endpoint }) => {
      const token = localStorage.getItem("PuppyToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      
      // Don't set Content-Type for FormData - let the browser handle it
      // This is important for file uploads with multipart/form-data boundary
      const formDataEndpoints = ['createOffer', 'createAd', 'createStore'];
      if (formDataEndpoints.includes(endpoint)) {
        // Remove any existing Content-Type header to let browser set it automatically
        headers.delete('Content-Type');
      }
      
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // ===== AUTH =====
    registerUser: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getAuthProfile: builder.query({
      query: () => "/auth/profile",
    }),

    // ===== USER =====
    getUserWallet: builder.query({
      query: () => "/user/wallet",
    }),
    getUserProfile: builder.query({
      query: () => "/user/profile",
    }),
    getStores: builder.query({
      query: () => "/store/store",
    }),

    // ===== ADMIN =====
    getAllUsers: builder.query({
      query: () => "/admin/users",
    }),
    getUserByPhone: builder.query({
      query: (phone) => `/admin/user/${phone}`,
    }),
    getAdminRedemptions: builder.query({
      query: () => "/admin/redemptions",
    }),
    approveRedemption: builder.mutation({
      query: (redemptionId) => ({
        url: `/admin/redemptions/approve`,
        method: "POST",
        body: redemptionId,
      }),
    }),
    createStore: builder.mutation({
      query: (formData) => ({
        url: '/store/store',
        method: 'POST',
        body: formData,
      }),
    }),    
    editStore: builder.mutation({
      query: (data) => ({
        url: "/store/store",
        method: "PUT",
        body: data,
      }),
    }),
    deleteStore: builder.mutation({
      query: (storeId) => ({
        url: "/store/store",
        method: "DELETE",
        body: storeId,
      }),
    }),
    activateStore: builder.mutation({
      query: (storeId) => ({
        url: "/store/store/activate",
        method: "PUT",
        body: storeId,
      }),
    }),
    getStore: builder.query({
      query: (storeId) => `/store/store/`,
    }),

    // ===== REDEMPTION =====
    getAllRedemptions: builder.query({
      query: () => "/redemption/redemptions",
    }),
    redeemOffer: builder.mutation({
      query: (data) => ({
        url: "/redemption/redemptions",
        method: "POST",
        body: data,
      }),
    }),

    // ===== OFFERS =====
    createOffer: builder.mutation({
      query: (formData) => {
        console.log('RTK Query - Creating offer with FormData:', formData instanceof FormData);
        return {
          url: "/offers/offers",
          method: "POST",
          body: formData, // This will be FormData with file
        };
      },
    }),
    
    getAllOffers: builder.query({
      query: () => "/offers/offers",
    }),
    deleteOffer: builder.mutation({
      query: (offerId) => ({
        url: "/offers/offers",
        method: "DELETE",
        body: offerId,
      }),
    }),

    activateOffer: builder.mutation({
      query: (data) => ({
        url: "/offers/offers",
        method: "PUT",
        body: data, // { offerId: "..." }
      }),
    }),

    // ===== COUPON =====
    generateCoupon: builder.mutation({
      query: (data) => ({
        url: "/coupon/generate",
        method: "POST",
        body: data,
      }),
    }),
    redeemCoupon: builder.mutation({
      query: (data) => ({
        url: "/coupon/redeem",
        method: "POST",
        body: data,
      }),
    }),
    validateCoupon: builder.mutation({
      query: (data) => ({
        url: "/coupon/validity",
        method: "POST",
        body: data,
      }),
    }),
    getLiveCoupons: builder.query({
      query: () => "/coupon/alive",
    }),

    getCarouselPoster: builder.query({
      query: () => "/ad/carousel-poster",
    }),

    // ===== ADS =====
    createAd: builder.mutation({
      query: (data) => {
        console.log('RTK Query - Creating ad with data type:', data instanceof FormData ? 'FormData' : 'JSON');
        return {
          url: "/ad/ad",
          method: "POST",
          body: data, // Can be FormData (for images) or JSON (for videos)
        };
      },
    }),    

    getAllAds: builder.query({
      query: () => "/ad/ad",
    }),
    deleteAd: builder.mutation({
      query: (adId) => ({
        url: "/ad/ad",
        method: "DELETE",
        body: adId,
      }),
    }),
    getAddForRedeem: builder.query({
      query: () => "/ad/ad-for-redeem",
    }),

    activateAd: builder.mutation({
      query: (adId) => ({
        url: "/ad/ad/activate",
        method: "PUT",
        body: adId,
      }),
    }),


  }),
});

export const {
  // Auth
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetAuthProfileQuery,

  // User
  useGetUserWalletQuery,
  useGetUserProfileQuery,
  useGetStoresQuery,

  // Admin
  useGetAllUsersQuery,
  useGetUserByPhoneQuery,
  useGetAdminRedemptionsQuery,
  useApproveRedemptionMutation,
  useCreateStoreMutation,
  useEditStoreMutation,
  useDeleteStoreMutation,
  useActivateStoreMutation,
  useGetStoreQuery,

  // Redemption
  useGetAllRedemptionsQuery,
  useRedeemOfferMutation,

  // Offers
  useCreateOfferMutation,
  useGetAllOffersQuery,
  useDeleteOfferMutation,
  useActivateOfferMutation, 

  // Coupon
  useGenerateCouponMutation,
  useRedeemCouponMutation,
  useValidateCouponMutation,
  useGetLiveCouponsQuery,

  // Ads
  useCreateAdMutation,
  useGetAllAdsQuery,
  useDeleteAdMutation,
  useGetAddForRedeemQuery,
  useActivateAdMutation,

  useGetCarouselPosterQuery,
} = apiSlice;