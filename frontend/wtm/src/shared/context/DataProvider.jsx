import AppContext from "./app-context";
import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import jwt_decode from "jwt-decode";

const DataProvider = (props) => {
  const [token, setToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [tokenError, setTokenError] = useState(null);

  const navigate = useNavigate();

  const logIn = async (token) => {
    try {
      const decodedToken = await jwt_decode(token);
      setToken(token);
      setUserEmail(
        decodedToken.user ? decodedToken.user.email : decodedToken.admin.email
      );
      setRole(decodedToken.role);
      setUser(decodedToken.user);
      setTokenError(null);
      localStorage.setItem("token", token);
      if (decodedToken.role === "USER")
        navigate("/user_account", { replace: true });
      if (decodedToken.role === "ADMIN") navigate("/shifts", { replace: true });
    } catch (err) {
      throw "Token jest nieprawidłowy";
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setRole(null);
    setUser(null);
    setTokenError(null);
    setUserEmail(null);
    navigate("/login");
  };

  const checkExpirationDate = async (token) => {
    try {
      const decodedToken = await jwt_decode(token);

      const expiresAt = new Date(decodedToken.exp * 1000).getTime();
      const currentDate = Date.now();

      // this calculation says, if token is still valid. If number is a positive, then we know, that token is valid.
      const millisecondsToExpire = expiresAt - currentDate;

      const minExpirationTimeInMilliseconds = 5000;

      if (millisecondsToExpire <= minExpirationTimeInMilliseconds)
        throw { message: "Token wygasł" };

      logIn(token);
    } catch (err) {
      throw err.message;
    }
  };

  useEffect(() => {
    if (!!token) return;
    const localToken = localStorage.getItem("token");
    if (!localToken) return;
    checkExpirationDate(localToken).catch((err) => setTokenError(err));
  }, []);

  const appContext = {
    user,
    userEmail,
    token,
    role,
    tokenError,
    logIn,
    logout,
  };

  return (
    <AppContext.Provider value={appContext}>
      {props.children}
    </AppContext.Provider>
  );
};

export default DataProvider;
