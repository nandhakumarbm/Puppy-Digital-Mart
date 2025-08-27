import { getIsLoggedIn } from "../utils/auth";

function AuthGate({ authed, unauthed }) {
  const ok = getIsLoggedIn();
  return ok ? authed : unauthed;
}

export default AuthGate;    