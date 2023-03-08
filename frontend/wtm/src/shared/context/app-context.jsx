import React from "react";

const AppContext = React.createContext({
  user: null,
  userEmail: null,
  tokenError: null,
  token: null,
  role: null,
  logIn: () => {},
  logout: () => {},
});

export default AppContext;
