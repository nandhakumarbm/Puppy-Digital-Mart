// src/routes/routes.js
import Home from "../User/pages/Home";
import Profile from "../User/pages/Profile";
import Login from "../auth/pages/Login"
import Signup from "../auth/pages/Signup";
import Wallet from "../User/pages/Wallet";
import Redemption from "../User/pages/Redemption";
import StoreList from "../User/components/StoreList";

import UserLists from "../Admin/pages/UserLists";
import RedemptionReq from "../Admin/pages/RedemptionReq";
import ManageAds from "../Admin/pages/ManageAds";
import ProfileCard from "../Admin/pages/Profile";
import ManageOffers from "../Admin/pages/ManageOffers";
import LiveCoupons from "../Admin/pages/LiveCoupons";
import CreateStore from "../Admin/pages/CreateStore";
import EditOrDeleteStore from "../Admin/pages/EditOrDeleteStore";


export const publicRoutes = [
  { path: "/login", element: <Login />, guestOnly: true },
  { path: "/signup", element: <Signup />, guestOnly: true },
];

export const privateRoutes = [
  { path: "/user/", element: <Home /> },
  { path: "/user/profile", element: <Profile /> },
  { path: "/user/wallet", element: <Wallet /> },
  { path: "/user/redeem", element: <Redemption /> },
  { path: "/user/store", element: <StoreList /> },

];


export const adminRoutes = [
  { path: "/admin/", element: <UserLists /> },
  { path: "/admin/redeemreq", element: <RedemptionReq /> },
  { path: "/admin/manageAds", element: <ManageAds /> },
  { path: "/admin/profile", element: <ProfileCard /> },
  { path: "/admin/manageOffers", element: <ManageOffers /> },
  { path: "/admin/liveCoupons", element: <LiveCoupons /> },
  { path: "/admin/createStore", element: <CreateStore /> },
  { path: "/admin/EditOrDeleteStore", element: <EditOrDeleteStore /> },

]   