import { apiUrl, apiHeader } from "../config.json";
import jwtDecode from "jwt-decode";
import axios from "axios";

const apiEndpoint =
  (process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : apiUrl) +
  "/auth";
const tokenKey = "token";

export function setUserToken(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

export async function login(email, password) {
  const pbody = {
    email: email,
    password: password,
  };
  let authResp = {};
  await axios.post(apiEndpoint, pbody, { apiHeader }).then((resp) => {
    authResp = resp;
  });

  const { data: jwt } = authResp;
  // {data:.jwt., status: 200, statusText: OK, config:.., headers:..x-auth-token.., request:...}
  // console.log("authResp", authResp);
  // localStorage.setItem("token", jwt);
  setUserToken(jwt);
  // the below return to previously load
  // this.props.history.push("/");
  // the window option reload the page
  // causing the full reload of the app

  return authResp;
}

export function logout() {
  localStorage.removeItem(tokenKey);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    const user = jwtDecode(jwt);
    return user;
  } catch (ex) {
    return null;
  }
}

export default {
  login,
  logout,
  setUserToken,
  getCurrentUser,
};
