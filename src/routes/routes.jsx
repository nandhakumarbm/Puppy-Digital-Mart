// src/routes/routes.js
import Home from "../User/pages/Home";
import Profile from "../User/pages/Profile";
import Login from "../auth/pages/Login"
import Signup from "../auth/pages/Signup";
import Wallet from "../User/pages/Wallet";
import Redemption from "../User/pages/Redemption";

import UserLists from "../Admin/pages/UserLists";
import RedemptionReq from "../Admin/pages/RedemptionReq";
import ManageAds from "../Admin/pages/ManageAds";
import ProfileCard from "../Admin/pages/Profile";
import ManageOffers from "../Admin/pages/ManageOffers";



export const publicRoutes = [
  { path: "/login", element: <Login />, guestOnly: true },
  { path: "/signup", element: <Signup />, guestOnly: true },
];

export const privateRoutes = [
  { path: "/user/", element: <Home /> },
  { path: "/user/profile", element: <Profile /> },
  { path: "/user/wallet", element: <Wallet /> },
  { path: "/user/redeem", element: <Redemption /> },

];


export const adminRoutes = [
  { path: "/admin/", element: <UserLists /> },
  { path: "/admin/redeemreq", element: <RedemptionReq /> },
  { path: "/admin/manageAds", element: <ManageAds /> },
  { path: "/admin/profile", element: <ProfileCard /> },
  { path: "/admin/manageOffers", element: <ManageOffers /> }
]   