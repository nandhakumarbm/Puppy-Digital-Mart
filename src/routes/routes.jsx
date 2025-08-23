// src/routes/routes.js
import Home from "../User/pages/Home";
import Profile from "../User/pages/Profile";
import Login from "../auth/pages/Login"
import Signup from "../auth/pages/Signup";
import Wallet from "../User/pages/Wallet";
import Redemption from "../User/pages/Redemption";

import UserLists from "../Admin/pages/UserLists";
import RedemptionReq from "../Admin/pages/RedemptionReq";
import AddItems from "../Admin/pages/AddItems";


export const publicRoutes = [
  { path: "/login", element: <Login />, guestOnly: true },
  { path: "/signup", element: <Signup />, guestOnly: true },
];

export const privateRoutes = [
  { path: "/", element: <Home /> },
  { path: "/profile", element: <Profile /> },
  { path: "/wallet", element: <Wallet /> },
  { path: "/redeem", element: <Redemption /> },

];


export const adminRoutes = [
  { path: "/users", element: <UserLists /> },
  { path: "/redeemreq", element: <RedemptionReq /> },
  { path: "/addItems", element: <AddItems /> }
]   