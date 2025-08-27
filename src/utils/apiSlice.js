// src/utils/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.puppydigitalmart.com/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("PuppyToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
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
      query: (data) => ({
        url: "/offers/offers",
        method: "POST",
        body: data,
      }),
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
      query: (data) => ({
        url: "/ad/ad",
        method: "POST",
        body: data,
      }),
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

  // Admin
  useGetAllUsersQuery,
  useGetUserByPhoneQuery,
  useGetAdminRedemptionsQuery,
  useApproveRedemptionMutation,

  // Redemption
  useGetAllRedemptionsQuery,
  useRedeemOfferMutation,

  // Offers
  useCreateOfferMutation,
  useGetAllOffersQuery,
  useDeleteOfferMutation,

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

  useGetCarouselPosterQuery,
} = apiSlice;
